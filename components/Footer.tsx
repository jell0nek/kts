import Link from "next/link"
import { Target, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-navy-900 text-navy-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-gold-500" />
              <span className="font-bold text-white text-lg">KTS Kraków</span>
            </div>
            <p className="text-sm text-navy-100/80 leading-relaxed">
              Krakowskie Towarzystwo Strzeleckie — strzelectwo sportowe,
              kolekcjonerstwo i szkolenia pracowników ochrony.
            </p>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="font-semibold text-gold-500 mb-3 uppercase tracking-wide text-xs">
              Kontakt
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0" />
                ul. Górników 50/139, 30-816 Kraków
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                <a href="tel:+48510778719" className="hover:text-gold-400 transition-colors">
                  510 778 719
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                <a href="mailto:biuro@kts.org.pl" className="hover:text-gold-400 transition-colors">
                  biuro@kts.org.pl
                </a>
              </li>
            </ul>
          </div>

          {/* Linki */}
          <div>
            <h3 className="font-semibold text-gold-500 mb-3 uppercase tracking-wide text-xs">
              Nawigacja
            </h3>
            <ul className="space-y-1.5 text-sm">
              {[
                ["/o-nas", "O nas"],
                ["/formalnie", "Formalnie"],
                ["/sekcje/sportowa", "Sekcja Sportowa"],
                ["/sekcje/kolekcjonerska", "Sekcja Kolekcjonerska"],
                ["/sekcje/szkolenie", "Szkolenie Ochrony"],
                ["/kalendarz", "Kalendarz wydarzeń"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-gold-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-navy-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-navy-100/60">
          <p>© {new Date().getFullYear()} Krakowskie Towarzystwo Strzeleckie</p>
          <p>KRS: 0000651585 · NIP: 6793138474 · REGON: 366079937</p>
        </div>
      </div>
    </footer>
  )
}
