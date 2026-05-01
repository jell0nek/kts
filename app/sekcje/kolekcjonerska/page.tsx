export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import { getPublishedContent } from "@/lib/content-server"
import { PageHero } from "@/components/PageHero"

export const metadata: Metadata = { title: "Sekcja Kolekcjonerska — KTS Kraków" }

export default async function CollectorsPage() {
  const c = await getPublishedContent("kolekcjonerska")

  const sections = [
    { title: "O sekcji", html: c.introHtml },
    { title: "Spotkania tematyczne", html: c.meetingsHtml },
    { title: "Wystawy", html: c.exhibitionsHtml },
    { title: "Pozwolenia kolekcjonerskie", html: c.permitsHtml },
  ]

  return (
    <>
      <PageHero title="Sekcja Kolekcjonerska" subtitle="Historia, mechanika i pasja kolekcjonerska od 2016 roku" />

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        {sections.map(({ title, html }) => (
          <section key={title} className="bg-white border border-neutral-200 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4 pb-3 border-b border-gold-100">{title}</h2>
            <div
              className="prose text-neutral-700"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </section>
        ))}
      </div>
    </>
  )
}
