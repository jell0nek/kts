import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { CheckCircle, Clock, Pencil } from "lucide-react"

const PAGES = [
  { slug: "home", title: "Strona główna", path: "/" },
  { slug: "o-nas", title: "O nas", path: "/o-nas" },
  { slug: "formalnie", title: "Formalnie", path: "/formalnie" },
  { slug: "sportowa", title: "Sekcja Sportowa", path: "/sekcje/sportowa" },
  { slug: "kolekcjonerska", title: "Sekcja Kolekcjonerska", path: "/sekcje/kolekcjonerska" },
  { slug: "szkolenie", title: "Szkolenie Ochrony", path: "/sekcje/szkolenie" },
]

export default async function StronPage() {
  let dbPages: { slug: string; updatedAt: Date; published: boolean; scheduledAt: Date | null }[] = []
  try {
    const rows = await prisma.pageContent.findMany({
      select: { slug: true, updatedAt: true, published: true, scheduledAt: true },
    })
    dbPages = rows.map((p) => ({ ...p, published: !!p.published }))
  } catch {}

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">Strony</h1>
      <p className="text-neutral-500 text-sm mb-6">Kliknij stronę, aby edytować jej treść.</p>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {PAGES.map(({ slug, title, path }, i) => {
          const db = dbPages.find((p) => p.slug === slug)
          const published = !!db?.published
          const scheduled = !!db?.scheduledAt
          return (
            <div
              key={slug}
              className={`flex items-center gap-4 px-5 py-4 ${i < PAGES.length - 1 ? "border-b border-neutral-100" : ""}`}
            >
              <div className="shrink-0">
                {published ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Clock className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-neutral-900 text-sm">{title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {published ? "Opublikowana" : "Wersja robocza"}
                  </span>
                  {scheduled && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
                      Zaplanowana: {format(new Date(db!.scheduledAt!), "d MMM HH:mm", { locale: pl })}
                    </span>
                  )}
                  {db && (
                    <span className="text-xs text-neutral-400">
                      Zmieniona {format(new Date(db.updatedAt), "d MMM HH:mm", { locale: pl })}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={path}
                  target="_blank"
                  className="text-xs text-neutral-500 hover:text-neutral-700 px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors"
                >
                  Podgląd
                </Link>
                <Link
                  href={`/admin/strony/${slug}`}
                  className="flex items-center gap-1.5 text-xs bg-navy-900 text-white px-3 py-1.5 rounded-lg hover:bg-navy-700 transition-colors font-medium"
                >
                  <Pencil className="w-3 h-3" />
                  Edytuj
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
