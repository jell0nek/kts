export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { getSettings } from "@/lib/settings"
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

function toMins(d: Date) { return d.getHours() * 60 + d.getMinutes() }

function timesOverlap(startA: Date, endA: Date | null, startB: Date, endB: Date | null): boolean {
  const s1 = toMins(startA), e1 = endA ? toMins(endA) : s1 + 60
  const s2 = toMins(startB), e2 = endB ? toMins(endB) : s2 + 60
  if (e1 <= s1 || e2 <= s2) return false
  return s1 < e2 && s2 < e1
}

// Expand each cyclic event into individual weekly occurrences within [from, to].
function expandCyclicEvents(events: Event[], from: Date, to: Date): Event[] {
  const result: Event[] = []
  for (const ev of events) {
    const anchor = new Date(ev.date)
    const targetDow = anchor.getDay()
    const h = anchor.getHours(), m = anchor.getMinutes()

    const cursor = new Date(from)
    cursor.setHours(h, m, 0, 0)
    const shift = (targetDow - cursor.getDay() + 7) % 7
    cursor.setDate(cursor.getDate() + shift)

    while (cursor <= to) {
      const d = new Date(cursor)
      const endTime = ev.endTime
        ? new Date(d.getFullYear(), d.getMonth(), d.getDate(), new Date(ev.endTime).getHours(), new Date(ev.endTime).getMinutes())
        : null
      result.push({ ...ev, id: `${ev.id}_${d.getTime()}`, date: d, endTime })
      cursor.setDate(cursor.getDate() + 7)
    }
  }
  return result
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

// zawody beats jednorazowe on exact same day; either beats a cyclic occurrence on exact same day.
function filterByPriority(events: Event[]): Event[] {
  const suppressed = new Set<string>()
  const cyclic = events.filter((e) => e.eventType === "cykliczne")
  const oneTime = events.filter((e) => e.eventType === "jednorazowe")
  const tournaments = events.filter((e) => e.eventType === "zawody")

  for (const cy of cyclic) {
    const da = new Date(cy.date)
    for (const other of [...oneTime, ...tournaments]) {
      if (sameDay(da, new Date(other.date)) && timesOverlap(da, cy.endTime, new Date(other.date), other.endTime)) {
        suppressed.add(cy.id)
        break
      }
    }
  }
  for (const ot of oneTime) {
    const da = new Date(ot.date)
    for (const to of tournaments) {
      if (sameDay(da, new Date(to.date)) && timesOverlap(da, ot.endTime, new Date(to.date), to.endTime)) {
        suppressed.add(ot.id)
        break
      }
    }
  }

  return events.filter((e) => !suppressed.has(e.id))
}

export default async function CalendarPage() {
  let events: Event[] = []

  try {
    const now = new Date()
    const { calendarHorizonDays } = await getSettings()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    // Default to 90 days when admin hasn't configured a horizon
    const horizon = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (calendarHorizonDays ?? 90))

    const [nonCyclic, cyclic] = await Promise.all([
      prisma.event.findMany({
        where: { isPublished: true, eventType: { not: "cykliczne" }, date: { gte: startOfMonth, lte: horizon } },
        orderBy: { date: "asc" },
      }),
      prisma.event.findMany({
        where: { isPublished: true, eventType: "cykliczne" },
      }),
    ])

    const expanded = expandCyclicEvents(cyclic, startOfMonth, horizon)
    events = filterByPriority([...nonCyclic, ...expanded])
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
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
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-navy-700 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {event.location}
              </a>
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
