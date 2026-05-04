import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// POST /api/password-reset — send reset email
export async function POST(req: NextRequest) {
  const { email } = await req.json().catch(() => ({}));

  // Always return ok to avoid leaking whether an email exists
  if (!email || typeof email !== "string") return NextResponse.json({ ok: true });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ ok: true });

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1h

  await prisma.passwordResetToken.create({
    data: { email, token, expires },
  });
  await sendPasswordResetEmail(token, email);

  return NextResponse.json({ ok: true });
}

// PUT /api/password-reset — set new password using token
export async function PUT(req: NextRequest) {
  const { token, password } = await req.json();
  if (!token || !password || password.length < 8) {
    return NextResponse.json({ error: "Nieprawidłowe dane" }, { status: 400 });
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
  });
  if (!record || record.used || record.expires < new Date()) {
    return NextResponse.json(
      { error: "Token wygasł lub jest nieprawidłowy" },
      { status: 400 },
    );
  }

  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.update({
    where: { email: record.email },
    data: { password: hashed },
  });
  await prisma.passwordResetToken.update({
    where: { token },
    data: { used: true },
  });

  return NextResponse.json({ ok: true });
}
