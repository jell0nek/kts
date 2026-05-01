import { NextRequest, NextResponse } from "next/server"
import { draftMode } from "next/headers"
import { auth } from "@/auth"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const draft = await draftMode()
  draft.enable()

  const redirect = req.nextUrl.searchParams.get("redirect") ?? "/"
  return NextResponse.redirect(new URL(redirect, req.url))
}
