import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Called by Vercel Cron (see vercel.json). Protected by CRON_SECRET in middleware.
export async function GET() {
  const due = await prisma.pageContent.findMany({
    where: { scheduledAt: { lte: new Date() } },
  })

  for (const page of due) {
    await prisma.pageContent.update({
      where: { slug: page.slug },
      data: { published: page.draft as never, scheduledAt: null },
    })
  }

  return NextResponse.json({ processed: due.length })
}
