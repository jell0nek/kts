import { NextRequest, NextResponse } from "next/server"
import { draftMode } from "next/headers"

export async function GET(req: NextRequest) {
  const draft = await draftMode()
  draft.disable()

  const redirect = req.nextUrl.searchParams.get("redirect") ?? "/"
  return NextResponse.redirect(new URL(redirect, req.url))
}
