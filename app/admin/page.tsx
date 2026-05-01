import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { FileText, CalendarDays, Image, Upload, Eye, CheckCircle, Clock } from "lucide-react"

const PAGE_TITLES: Record<string, string> = {
  home: "Strona główna",
  "o-nas": "O nas",
  formalnie: "Formalnie",
  sportowa: "Sekcja Sportowa",
  kolekcjonerska: "Sekcja Kolekcjonerska",
  szkolenie: "Szkolenie Ochrony",
}

export default async function AdminDashboard() {
  let pages: { slug: string; updatedAt: Date; published: boolean }[] = []
  let eventsCount = 0
  let scheduledCount = 0

  try {
    const dbPages = await prisma.pageContent.findMany({
      select: { slug: true, updatedAt: true, published: true },
    })
    pages = dbPages.map((p) => ({ ...p, published: !!p.published }))

    eventsCount = await prisma.event.count({
      where: { isPublished: true, date: { gte: new Date() } },
    })

    scheduledCount = await prisma.pageContent.count({
      where: { scheduledAt: { not: null } },
    })
  } catch {}

  const quickLinks = [
    { href: "/admin/strony", label: "Edytuj strony", icon: FileText, desc: "Treści stron i teksty" },
    { href: "/admin/harmonogram", label: "Harmonogram", icon: CalendarDays, desc: "Dodaj i edytuj wydarzenia" },
    { href: "/admin/media", label: "Galeria zdjęć", icon: Image, desc: "Zarządzaj zdjęciami" },
  ]

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">Panel główny</h1>
      <p className="text-neutral-500 text-sm mb-8">Witaj w panelu administracyjnym KTS.</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="text-3xl font-bold text-navy-900">{eventsCount}</div>
          <div className="text-sm text-neutral-500 mt-1">Nadchodzące wydarzenia</div>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="text-3xl font-bold text-navy-900">
            {pages.filter((p) => p.published).length}/{Object.keys(PAGE_TITLES).length}
          </div>
          <div className="text-sm text-neutral-500 mt-1">Opublikowane strony</div>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className={`text-3xl font-bold ${scheduledCount > 0 ? "text-amber-600" : "text-neutral-300"}`}>
            {scheduledCount}
          </div>
          <div className="text-sm text-neutral-500 mt-1">Zaplanowane publikacje</div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {quickLinks.map(({ href, label, icon: Icon, desc }) => (
          <Link
            key={href}
            href={href}
            className="bg-white border border-neutral-200 rounded-xl p-4 flex items-start gap-3 hover:border-navy-300 hover:shadow-sm transition-all group"
          >
            <div className="bg-navy-50 rounded-lg p-2 group-hover:bg-navy-900 transition-colors">
              <Icon className="w-5 h-5 text-navy-600 group-hover:text-gold-400 transition-colors" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900 text-sm">{label}</p>
              <p className="text-neutral-500 text-xs mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Pages status */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden mb-8">
        <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="font-semibold text-neutral-900">Status stron</h2>
          <Link href="/admin/strony" className="text-sm text-navy-600 hover:text-navy-800 font-medium">
            Edytuj →
          </Link>
        </div>
        <div className="divide-y divide-neutral-100">
          {Object.entries(PAGE_TITLES).map(([slug, title]) => {
            const page = pages.find((p) => p.slug === slug)
            return (
              <div key={slug} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-2.5">
                  {page?.published ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-400" />
                  )}
                  <span className="text-sm font-medium text-neutral-800">{title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-400">
                    {page ? format(new Date(page.updatedAt), "d MMM HH:mm", { locale: pl }) : "Domyślna"}
                  </span>
                  <Link
                    href={`/admin/strony/${slug}`}
                    className="text-xs bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-lg hover:bg-navy-100 hover:text-navy-900 transition-colors"
                  >
                    Edytuj
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Publish CTA */}
      <div className="rounded-xl bg-gold-500/35 border border-gold-500/50 p-6 flex items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Upload className="w-5 h-5 text-gold-500" />
            <h2 className="font-bold text-navy-900 text-lg">Publikuj zmiany</h2>
          </div>
          <p className="text-navy-700 text-sm">
            Zatwierdź i opublikuj wszystkie wprowadzone zmiany na stronie publicznej.
          </p>
        </div>
        <Link
          href="/admin/publikuj"
          className="shrink-0 inline-flex items-center gap-2.5 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-6 py-3 rounded-xl transition-colors text-sm shadow-lg shadow-gold-500/20"
        >
          <Upload className="w-4 h-4" />
          Przejdź do publikacji
        </Link>
      </div>
    </div>
  )
}
