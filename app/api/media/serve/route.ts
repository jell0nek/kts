import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url")
  if (!url) return new NextResponse(null, { status: 400 })

  // Only proxy Vercel Blob URLs (prevent SSRF)
  if (!url.match(/^https:\/\/[^/]+\.blob\.vercel-storage\.com\//)) {
    return new NextResponse(null, { status: 400 })
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  if (!res.ok) return new NextResponse(null, { status: res.status })

  return new NextResponse(res.body, {
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
