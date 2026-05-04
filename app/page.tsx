export const dynamic = "force-dynamic"

import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Target, Shield, Award, MapPin, Info } from "lucide-react"
import { getPublishedContent } from "@/lib/content-server"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { pl } from "date-fns/locale"

export default async function HomePage() {
  const content = await getPublishedContent("home")

  let upcomingEvents: { id: string; title: string; date: Date; location: string | null }[] = []
  try {
    upcomingEvents = await prisma.event.findMany({
      where: { isPublished: true, date: { gte: new Date() } },
      orderBy: { date: "asc" },
      take: 3,
      select: { id: true, title: true, date: true, location: true },
    })
  } catch {}

  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-700/40 to-navy-950 pointer-events-none" />
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #c8a951 1px, transparent 0)", backgroundSize: "32px 32px" }}
        />
        <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-24 md:pt-10 md:pb-36">
          {content.announcementHtml && (
            <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-sm text-white/90">
              <Info className="w-4 h-4 shrink-0 text-gold-400" />
              <div
                className="[&_p]:m-0 [&_p]:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content.announcementHtml }}
              />
            </div>
          )}
          <div className={`flex items-center gap-12 ${content.announcementHtml ? "mt-10" : "mt-16 md:mt-24"}`}>
            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-gold-400 font-semibold tracking-widest uppercase text-xs mb-4">
                Kraków · od 2015 roku
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5">
                {content.heroTitle}
              </h1>
              <p className="text-xl text-navy-100/80 mb-10 leading-relaxed">
                {content.heroSubtitle}
              </p>
              <Link
                href={content.ctaHref}
                className="inline-flex items-center gap-2 bg-gold-500 text-navy-900 font-bold px-7 py-3.5 rounded-lg hover:bg-gold-400 transition-colors text-base shadow-lg"
              >
                {content.ctaText}
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
            {/* Logo */}
            <div className="hidden md:flex shrink-0 items-center justify-center">
              <Image
                src="/logo_metal-retina.png"
                alt="Krakowskie Towarzystwo Strzeleckie"
                width={320}
                height={320}
                className="w-56 lg:w-72 h-auto object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div
          className="prose max-w-3xl mx-auto text-center text-lg text-neutral-700"
          dangerouslySetInnerHTML={{ __html: content.introHtml }}
        />
      </section>

      {/* Section cards */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-center text-3xl font-bold text-navy-900 mb-3">Nasze sekcje</h2>
          <p className="text-center text-neutral-500 mb-10 max-w-xl mx-auto">
            Działamy w trzech obszarach — wybierz sekcję, która Cię interesuje.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: "Sekcja Sportowa",
                href: "/sekcje/sportowa",
                desc: "Treningi z pistoletu, karabinu i strzelby. Przygotowanie do egzaminu patentowego PZSS i zawody strzeleckie.",
                iconColor: "text-blue-600",
                iconBg: "bg-blue-50",
              },
              {
                icon: Award,
                title: "Sekcja Kolekcjonerska",
                href: "/sekcje/kolekcjonerska",
                desc: "Spotkania tematyczne, wystawy kolekcjonerskie i pomoc w uzyskaniu pozwolenia kolekcjonerskiego.",
                iconColor: "text-amber-600",
                iconBg: "bg-amber-50",
              },
              {
                icon: Shield,
                title: "Szkolenie Ochrony",
                href: "/sekcje/szkolenie",
                desc: "Kursy podstawowe (245h) i doskonalące (40h) dla kandydatów i pracowników ochrony fizycznej.",
                iconColor: "text-emerald-600",
                iconBg: "bg-emerald-50",
              },
            ].map(({ icon: Icon, title, href, desc, iconColor, iconBg }) => (
              <Link
                key={href}
                href={href}
                className="group p-6 rounded-xl border border-neutral-200 bg-white hover:border-gold-400 hover:shadow-lg transition-all duration-200 flex flex-col"
              >
                <div className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <h3 className="font-bold text-lg text-navy-900 mb-2 group-hover:text-gold-600 transition-colors">
                  {title}
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed flex-1">{desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-gold-600 text-sm font-semibold">
                  Dowiedz się więcej <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      {upcomingEvents.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-navy-900">Nadchodzące wydarzenia</h2>
            <Link href="/kalendarz" className="text-gold-600 text-sm font-semibold hover:text-gold-500 transition-colors">
              Pokaż wszystkie →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl border border-neutral-200 p-5 hover:shadow-md transition-shadow">
                <div className="text-gold-600 font-bold text-sm mb-1 capitalize">
                  {format(new Date(event.date), "EEEE, d MMMM · HH:mm", { locale: pl })}
                </div>
                <h3 className="font-semibold text-navy-900 mb-1 text-base">{event.title}</h3>
                {event.location && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-neutral-500 text-sm hover:text-navy-700 transition-colors mt-1"
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {event.location}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Join CTA */}
      <section className="bg-navy-900 text-white py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Chcesz dołączyć do KTS?</h2>
          <p className="text-navy-100/75 mb-10 text-lg leading-relaxed">
            Skontaktuj się z nami, aby dowiedzieć się, jak zostać członkiem towarzystwa i zacząć strzelać.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/o-nas"
              className="bg-gold-500 text-navy-900 font-bold px-7 py-3.5 rounded-lg hover:bg-gold-400 transition-colors shadow-lg"
            >
              Kontakt i informacje
            </Link>
            <Link
              href="/kalendarz"
              className="border border-white/25 text-white px-7 py-3.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Sprawdź kalendarz
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
