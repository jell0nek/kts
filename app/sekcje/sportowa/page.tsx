export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import { Mail, Phone, Calendar } from "lucide-react"
import Link from "next/link"
import { getPublishedContent } from "@/lib/content-server"
import { PageHero } from "@/components/PageHero"

export const metadata: Metadata = { title: "Sekcja Sportowa — KTS Kraków" }

export default async function SportPage() {
  const c = await getPublishedContent("sportowa")

  return (
    <>
      <PageHero title="Sekcja Sportowa" subtitle="Klub Sportowy KTS Kraków · Licencja PZSS LK-1343/2024" />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div
          className="prose text-neutral-700 text-lg mb-12"
          dangerouslySetInnerHTML={{ __html: c.introHtml }}
        />

        {/* Schedule */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <Calendar className="w-5 h-5 text-gold-500" />
            <h2 className="text-2xl font-bold text-navy-900">Harmonogram treningów</h2>
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-3 bg-navy-900 text-navy-100 text-xs font-semibold uppercase tracking-wide px-5 py-3">
              <span>Dzień</span>
              <span>Dyscyplina</span>
              <span>Godziny</span>
            </div>
            {c.schedule.map((row, i) => (
              <div
                key={row.id}
                className={`grid grid-cols-3 px-5 py-4 items-center ${
                  i < c.schedule.length - 1 ? "border-b border-neutral-100" : ""
                } ${i % 2 === 0 ? "bg-white" : "bg-neutral-50"}`}
              >
                <span className="font-semibold text-navy-900">{row.day}</span>
                <span className="text-neutral-700">{row.discipline}</span>
                <span className="font-mono text-sm text-neutral-600">{row.time}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-neutral-500">
            Miejsce: Strzelnica Myślenice, ul. Zdrojowa 9 (o ile nie podano inaczej)
          </p>
        </div>

        {/* Join */}
        <div className="bg-gold-50 border border-gold-100 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-navy-900 mb-3">Jak dołączyć?</h2>
          <div
            className="prose text-neutral-700"
            dangerouslySetInnerHTML={{ __html: c.joinHtml }}
          />
          <Link
            href="/kalendarz"
            className="mt-4 inline-flex items-center gap-2 bg-navy-900 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-navy-700 transition-colors text-sm"
          >
            <Calendar className="w-4 h-4" />
            Sprawdź terminarz
          </Link>
        </div>

        {/* Contact */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-navy-900 mb-4">Kontakt</h2>
          <div className="space-y-3">
            <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-neutral-700 hover:text-gold-600 transition-colors">
              <Phone className="w-4 h-4 text-gold-500" />
              {c.phone}
            </a>
            <a href={`mailto:${c.email}`} className="flex items-center gap-3 text-neutral-700 hover:text-gold-600 transition-colors">
              <Mail className="w-4 h-4 text-gold-500" />
              {c.email}
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
