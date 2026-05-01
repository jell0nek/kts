export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import { Mail, Phone, MapPin, CreditCard, Building } from "lucide-react"
import { getPublishedContent } from "@/lib/content-server"
import { PageHero } from "@/components/PageHero"

export const metadata: Metadata = { title: "O nas — KTS Kraków" }

function InfoRow({ icon: Icon, label, value, href }: {
  icon: React.ElementType; label: string; value: string; href?: string
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-neutral-100 last:border-0">
      <Icon className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-neutral-500 mb-0.5">{label}</p>
        {href ? (
          <a href={href} className="text-navy-900 font-medium hover:text-gold-600 transition-colors break-all">
            {value}
          </a>
        ) : (
          <p className="text-navy-900 font-medium">{value}</p>
        )}
      </div>
    </div>
  )
}

function LegalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-neutral-100 last:border-0 text-sm">
      <span className="text-neutral-600">{label}</span>
      <span className="font-mono font-semibold text-navy-900">{value}</span>
    </div>
  )
}

export default async function AboutPage() {
  const c = await getPublishedContent("o-nas")

  return (
    <>
      <PageHero title="O nas" subtitle="Krakowskie Towarzystwo Strzeleckie" />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Intro */}
        <div
          className="prose max-w-3xl text-neutral-700 text-lg mb-12"
          dangerouslySetInnerHTML={{ __html: c.introHtml }}
        />

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Sport & Collectors contact */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-xl font-bold text-navy-900 mb-1">Sekcja Sportowa i Kolekcjonerska</h2>
            <p className="text-xs text-neutral-500 mb-4">Licencja PZSS: {c.licensePzss}</p>
            <InfoRow icon={MapPin} label="Adres" value={c.addressSport} />
            <InfoRow icon={Phone} label="Telefon" value={c.phoneSport} href={`tel:${c.phoneSport.replace(/\s/g, "")}`} />
            <InfoRow icon={Mail} label="Email" value={c.emailSport} href={`mailto:${c.emailSport}`} />
          </div>

          {/* SSPO contact */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-xl font-bold text-navy-900 mb-1">Szkolenie Ochrony (SSPO)</h2>
            <p className="text-xs text-neutral-500 mb-4">RSPO: {c.rspo}</p>
            <InfoRow icon={Phone} label="Telefon" value={c.phoneSspo} href={`tel:${c.phoneSspo.replace(/\s/g, "")}`} />
            <InfoRow icon={Mail} label="Email" value={c.emailSspo} href={`mailto:${c.emailSspo}`} />
          </div>
        </div>

        {/* Bank accounts */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-gold-500" />
            <h2 className="text-xl font-bold text-navy-900">Konta bankowe</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-neutral-500 mb-1">PLN</p>
              <p className="font-mono font-semibold text-navy-900 text-sm tracking-wide">{c.bankPln}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 mb-1">EUR</p>
              <p className="font-mono font-semibold text-navy-900 text-sm tracking-wide">{c.bankEur}</p>
            </div>
          </div>
        </div>

        {/* Legal IDs */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building className="w-5 h-5 text-gold-500" />
              <h2 className="text-xl font-bold text-navy-900">KTS — dane rejestrowe</h2>
            </div>
            <LegalRow label="KRS" value={c.krs} />
            <LegalRow label="NIP" value={c.nip} />
            <LegalRow label="REGON" value={c.regon} />
            <LegalRow label="Licencja PZSS" value={c.licensePzss} />
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building className="w-5 h-5 text-gold-500" />
              <h2 className="text-xl font-bold text-navy-900">SSPO — dane rejestrowe</h2>
            </div>
            <LegalRow label="RSPO" value={c.rspo} />
            <LegalRow label="REGON" value={c.regonSspo} />
          </div>
        </div>

        {/* Members */}
        <div className="bg-gold-50 border border-gold-100 rounded-xl p-6">
          <h2 className="text-xl font-bold text-navy-900 mb-3">Nasi członkowie</h2>
          <div
            className="prose text-neutral-700"
            dangerouslySetInnerHTML={{ __html: c.membersHtml }}
          />
        </div>
      </div>
    </>
  )
}
