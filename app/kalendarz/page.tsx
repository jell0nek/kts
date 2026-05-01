export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { format, isFuture, isPast } from "date-fns"
import { pl } from "date-fns/locale"
import { PageHero } from "@/components/PageHero"
import { Trophy, CalendarDays, RefreshCw, MapPin } from "lucide-react"

export const metadata: Metadata = { title: "Kalendarz wydarzeń — KTS Kraków" }

const SECTION_LABEL: Record<string, string> = {
  sport: "Sekcja Sportowa",
  kolekcje: "Sekcja Kolekcjonerska",
  sspo: "Szkolenie Ochrony",
  general: "Ogólne",
}
const SECTION_COLOR: Record<string, string> = {
  sport: "bg-blue-100 text-blue-800",
  kolekcje: "bg-amber-100 text-amber-800",
  sspo: "bg-emerald-100 text-emerald-800",
  general: "bg-neutral-100 text-neutral-700",
}

const EVENT_TYPE_CONFIG: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  zawody: { label: "Zawody", color: "bg-purple-100 text-purple-800", icon: Trophy },
  jednorazowe: { label: "Jednorazowe", color: "bg-sky-100 text-sky-800", icon: CalendarDays },
  cykliczne: { label: "Cykliczne", color: "bg-emerald-100 text-emerald-800", icon: RefreshCw },
}

type Event = {
  id: string; title: string; date: Date; endTime: Date | null
  location: string | null; section: string; description: string | null
  eventType: string
}

export default async function CalendarPage() {
  let events: Event[] = []

  try {
    const now = new Date()
    events = await prisma.event.findMany({
      where: { isPublished: true, date: { gte: new Date(now.getFullYear(), now.getMonth(), 1) } },
      orderBy: { date: "asc" },
    })
  } catch {}

  const upcoming = events.filter((e) => isFuture(new Date(e.date)))
  const past = events.filter((e) => isPast(new Date(e.date)))

  return (
    <>
      <PageHero title="Kalendarz wydarzeń" subtitle="Treningi, zawody, kursy i spotkania" />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {events.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg">Brak zaplanowanych wydarzeń</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
            {past.length > 0 && upcoming.length > 0 && (
              <div className="pt-4 pb-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Minione</p>
              </div>
            )}
            {past.map((event) => (
              <EventCard key={event.id} event={event} dimmed />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function EventCard({ event, dimmed = false }: { event: Event; dimmed?: boolean }) {
  const date = new Date(event.date)
  const endTime = event.endTime ? new Date(event.endTime) : null
  const typeConfig = EVENT_TYPE_CONFIG[event.eventType] ?? EVENT_TYPE_CONFIG.jednorazowe
  const TypeIcon = typeConfig.icon

  return (
    <div className={`bg-white border rounded-xl p-5 ${dimmed ? "opacity-55 border-neutral-100" : "border-neutral-200 hover:border-gold-300 hover:shadow-sm transition-all"}`}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        {/* Date block */}
        <div className="bg-navy-900 text-white rounded-lg px-3 py-2 text-center min-w-16 shrink-0">
          <div className="text-2xl font-bold leading-none">{format(date, "d")}</div>
          <div className="text-xs text-navy-100/70 uppercase tracking-wide mt-0.5">
            {format(date, "MMM", { locale: pl })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h3 className="font-bold text-navy-900 text-base">{event.title}</h3>
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${typeConfig.color}`}>
              <TypeIcon className="w-3 h-3" />
              {typeConfig.label}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SECTION_COLOR[event.section] ?? SECTION_COLOR.general}`}>
              {SECTION_LABEL[event.section] ?? event.section}
            </span>
          </div>
          <div className="text-sm text-neutral-500 space-y-0.5">
            <p>
              {format(date, "EEEE, d MMMM yyyy", { locale: pl })}
              {" · "}
              {format(date, "HH:mm")}
              {endTime && `–${format(endTime, "HH:mm")}`}
            </p>
            {event.location && (
              <p className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {event.location}
              </p>
            )}
          </div>
          {event.description && (
            <p className="text-sm text-neutral-600 mt-2 leading-relaxed">{event.description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
