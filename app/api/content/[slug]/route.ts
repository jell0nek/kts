import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { PAGE_DEFAULTS } from "@/lib/content"

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const page = await prisma.pageContent.findUnique({ where: { slug } })
    if (!page) return NextResponse.json(PAGE_DEFAULTS[slug as keyof typeof PAGE_DEFAULTS] ?? {})
    return NextResponse.json(page.draft)
  } catch {
    return NextResponse.json(PAGE_DEFAULTS[slug as keyof typeof PAGE_DEFAULTS] ?? {})
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { slug } = await params
  const body = await req.json()

  try {
    const page = await prisma.pageContent.upsert({
      where: { slug },
      create: {
        id: slug,
        slug,
        title: slug,
        draft: body,
      },
      update: { draft: body },
    })
    return NextResponse.json(page.draft)
  } catch (err) {
    return NextResponse.json({ error: "Save failed" }, { status: 500 })
  }
}
