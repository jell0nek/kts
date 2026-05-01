export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import { Mail, Phone, Clock } from "lucide-react"
import { getPublishedContent } from "@/lib/content-server"
import { PageHero } from "@/components/PageHero"

export const metadata: Metadata = { title: "Szkolenie Ochrony — KTS Kraków" }

export default async function SspoPage() {
  const c = await getPublishedContent("szkolenie")

  return (
    <>
      <PageHero title="Szkolenie Ochrony" subtitle={`SSPO KTS — Niepubliczna Placówka Kształcenia Ustawicznego · RSPO: ${c.rspo}`} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div
          className="prose text-neutral-700 text-lg mb-12"
          dangerouslySetInnerHTML={{ __html: c.introHtml }}
        />

        {/* Programs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-navy-900 mb-6">Programy szkoleń</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {c.programs.map((prog) => (
              <div key={prog.id} className="bg-white border border-neutral-200 rounded-xl p-6 hover:border-gold-300 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-gold-500" />
                  <span className="font-bold text-3xl text-navy-900">{prog.hours}</span>
                  <span className="text-neutral-500 text-sm">godzin</span>
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-3">{prog.name}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{prog.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Who we train */}
        <div className="bg-gold-50 border border-gold-100 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-navy-900 mb-3">Kto może skorzystać?</h2>
          <ul className="space-y-2 text-neutral-700">
            <li className="flex items-start gap-2">
              <span className="text-gold-500 font-bold mt-0.5">·</span>
              Osoby prywatne chcące uzyskać uprawnienia pracownika ochrony
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-500 font-bold mt-0.5">·</span>
              Pracownicy firm ochroniarskich podnoszący kwalifikacje
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-500 font-bold mt-0.5">·</span>
              Firmy realizujące kontraktowe szkolenia pracownicze
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-navy-900 mb-4">Kontakt SSPO</h2>
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
