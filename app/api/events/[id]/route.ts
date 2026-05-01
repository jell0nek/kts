import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const event = await prisma.event.update({
    where: { id },
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
  return NextResponse.json(event)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  await prisma.event.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
