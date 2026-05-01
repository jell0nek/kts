import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
  const isLoginPage = req.nextUrl.pathname === "/admin/login"
  const isResetPage = req.nextUrl.pathname === "/admin/reset-password"
  const isCronRoute = req.nextUrl.pathname.startsWith("/api/cron")
  const isLoggedIn = !!req.auth

  if (isCronRoute) {
    const secret = req.headers.get("authorization")
    if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.next()
  }

  if (isAdminRoute && !isLoginPage && !isResetPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.url))
  }
})

export const config = {
  matcher: ["/admin/:path*", "/api/cron/:path*"],
}
