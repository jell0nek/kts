import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { put } from "@vercel/blob"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const form = await req.formData()
  const file = form.get("file") as File | null
  const gallery = (form.get("gallery") as string) || "muzeum"

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

  const token = process.env.BLOB_READ_WRITE_TOKEN

  let url: string
  if (token) {
    const blob = await put(`kts/media/${gallery}/${Date.now()}-${file.name}`, file, {
      access: "public",
      token,
    })
    url = blob.url
  } else {
    // Local dev fallback: save to public/uploads/
    const { writeFile, mkdir } = await import("fs/promises")
    const { join } = await import("path")
    const filename = `${Date.now()}-${file.name}`
    const dir = join(process.cwd(), "public", "uploads", gallery)
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, filename), Buffer.from(await file.arrayBuffer()))
    url = `/uploads/${gallery}/${filename}`
  }

  const maxOrder = await prisma.mediaFile.aggregate({
    where: { gallery },
    _max: { order: true },
  })

  const saved = await prisma.mediaFile.create({
    data: {
      gallery,
      url,
      filename: file.name,
      caption: null,
      order: (maxOrder._max.order ?? 0) + 1,
    },
  })

  return NextResponse.json(saved, { status: 201 })
}
