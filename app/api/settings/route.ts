import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { updateSettings } from "@/lib/settings"
import { THEMES } from "@/lib/themes"

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { theme } = await req.json()
  if (!theme || !THEMES.find((t) => t.id === theme)) {
    return NextResponse.json({ error: "Invalid theme" }, { status: 400 })
  }

  await updateSettings({ theme })
  return NextResponse.json({ ok: true })
}
