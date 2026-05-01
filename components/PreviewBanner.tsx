import { draftMode } from "next/headers"
import Link from "next/link"

export async function PreviewBanner() {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return null

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-navy-900 text-white px-5 py-2.5 rounded-full shadow-2xl text-sm">
      <span className="font-medium">Tryb podglądu — wersja robocza</span>
      <Link
        href="/api/preview/disable"
        className="bg-white text-navy-900 px-3 py-1 rounded-full text-xs font-semibold hover:bg-neutral-100 transition-colors"
      >
        Wyjdź
      </Link>
    </div>
  )
}
