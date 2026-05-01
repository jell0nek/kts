import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteShell } from "@/components/SiteShell"
import { PreviewBanner } from "@/components/PreviewBanner"
import { getSettings } from "@/lib/settings"
import { getTheme, themeToCSS } from "@/lib/themes"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
})

export const metadata: Metadata = {
  title: "Krakowskie Towarzystwo Strzeleckie",
  description:
    "KTS — strzelectwo sportowe, sekcja kolekcjonerska i szkolenia pracowników ochrony w Krakowie.",
  openGraph: {
    title: "Krakowskie Towarzystwo Strzeleckie",
    description: "Strzelectwo sportowe, kolekcjonerstwo i szkolenia w Krakowie.",
    locale: "pl_PL",
    type: "website",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings()
  const theme = getTheme(settings.theme)
  const themeCSS = themeToCSS(theme)

  return (
    <html lang="pl" className={`${inter.variable} h-full`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      </head>
      <body className="min-h-full flex flex-col bg-cream text-neutral-800 antialiased">
        <SiteShell>{children}</SiteShell>
        <PreviewBanner />
      </body>
    </html>
  )
}
