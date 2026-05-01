import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { isPublished: true, date: { gte: new Date() } },
      orderBy: { date: "asc" },
    })
    return NextResponse.json(events)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  if (!body.title || !body.date) {
    return NextResponse.json({ error: "title and date are required" }, { status: 400 })
  }

  const event = await prisma.event.create({
    data: {
      title: body.title,
      date: new Date(body.date),
      endTime: body.endTime ? new Date(body.endTime) : null,
      location: body.location ?? null,
      section: body.section ?? "general",
      description: body.description ?? null,
      isPublished: body.isPublished ?? true,
      recurrence: body.recurrence ?? null,
      eventType: body.eventType ?? "jednorazowe",
    },
  })
  return NextResponse.json(event, { status: 201 })
}
