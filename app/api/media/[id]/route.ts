import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { del } from "@vercel/blob"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const updated = await prisma.mediaFile.update({
    where: { id },
    data: { caption: body.caption ?? null },
  })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const file = await prisma.mediaFile.findUnique({ where: { id } })
  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (token) {
    try { await del(file.url, { token }) } catch {}
  }

  await prisma.mediaFile.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
