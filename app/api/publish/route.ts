import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

async function publishSlug(slug: string) {
  const page = await prisma.pageContent.findUnique({ where: { slug } })
  if (!page) return
  await prisma.pageContent.update({
    where: { slug },
    data: { published: page.draft as never, scheduledAt: null },
  })
}

// POST — publish now or schedule
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { scope, publishAt } = await req.json()

  if (publishAt) {
    // Schedule: store scheduledAt on the page
    const slug = scope.replace("page:", "")
    if (scope.startsWith("page:")) {
      await prisma.pageContent.updateMany({
        where: { slug },
        data: { scheduledAt: new Date(publishAt) },
      })
    }
    return NextResponse.json({ scheduled: true, publishAt })
  }

  // Publish now
  if (scope === "all") {
    const pages = await prisma.pageContent.findMany()
    for (const page of pages) {
      await publishSlug(page.slug)
    }
  } else if (scope.startsWith("page:")) {
    const slug = scope.replace("page:", "")
    await publishSlug(slug)
  }

  return NextResponse.json({ published: true, scope })
}

// DELETE — cancel scheduled publish
export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { scope } = await req.json()
  if (scope.startsWith("page:")) {
    const slug = scope.replace("page:", "")
    await prisma.pageContent.updateMany({
      where: { slug },
      data: { scheduledAt: null },
    })
  }
  return NextResponse.json({ cancelled: true })
}
