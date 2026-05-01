import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { put } from "@vercel/blob"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const form = await req.formData()
  const file = form.get("file") as File | null
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

  const token = process.env.BLOB_READ_WRITE_TOKEN

  if (token) {
    const blob = await put(`kts/documents/${Date.now()}-${file.name}`, file, {
      access: "public",
      token,
    })
    return NextResponse.json({ url: blob.url })
  }

  // Local dev fallback: write to public/uploads/documents/
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`
  const dir = path.join(process.cwd(), "public", "uploads", "documents")
  await mkdir(dir, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(dir, filename), buffer)
  return NextResponse.json({ url: `/uploads/documents/${filename}` })
}
