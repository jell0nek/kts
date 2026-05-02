import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { updateSettings } from "@/lib/settings"
import { THEMES } from "@/lib/themes"

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()

  if ("theme" in body) {
    if (!body.theme || !THEMES.find((t: { id: string }) => t.id === body.theme)) {
      return NextResponse.json({ error: "Invalid theme" }, { status: 400 })
    }
    await updateSettings({ theme: body.theme })
  }

  if ("calendarHorizonDays" in body) {
    const days = body.calendarHorizonDays
    if (days !== null && (typeof days !== "number" || !Number.isInteger(days) || days < 1)) {
      return NextResponse.json({ error: "calendarHorizonDays must be a positive integer or null" }, { status: 400 })
    }
    await updateSettings({ calendarHorizonDays: days })
  }

  return NextResponse.json({ ok: true })
}
