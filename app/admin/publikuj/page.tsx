import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { PublishClient } from "@/components/admin/PublishClient"

const PAGE_TITLES: Record<string, string> = {
  home: "Strona główna",
  "o-nas": "O nas",
  formalnie: "Formalnie",
  sportowa: "Sekcja Sportowa",
  kolekcjonerska: "Sekcja Kolekcjonerska",
  szkolenie: "Szkolenie Ochrony",
}

export default async function PublishPage() {
  let pages: {
    slug: string; title: string; published: boolean
    scheduledAt: string | null; updatedAt: string
  }[] = []

  try {
    const rows = await prisma.pageContent.findMany({
      select: { slug: true, published: true, scheduledAt: true, updatedAt: true },
    })
    pages = rows.map((p) => ({
      slug: p.slug,
      title: PAGE_TITLES[p.slug] ?? p.slug,
      published: !!p.published,
      scheduledAt: p.scheduledAt?.toISOString() ?? null,
      updatedAt: p.updatedAt.toISOString(),
    }))
    // Add pages not yet in DB
    for (const [slug, title] of Object.entries(PAGE_TITLES)) {
      if (!pages.find((p) => p.slug === slug)) {
        pages.push({ slug, title, published: false, scheduledAt: null, updatedAt: "" })
      }
    }
  } catch {}

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">Publikuj</h1>
      <p className="text-neutral-500 text-sm mb-6">
        Opublikuj zmiany na żywo lub zaplanuj publikację na wybrany termin.
        Podgląd strony pokazuje aktualnie opublikowaną wersję.
      </p>
      <PublishClient pages={pages} />
    </div>
  )
}
