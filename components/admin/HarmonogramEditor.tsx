"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import { pl } from "date-fns/locale"
import { Plus, Pencil, Trash2, Loader2, X, Save, AlertTriangle, Trophy, CalendarDays, RefreshCw, Clock } from "lucide-react"

interface EventData {
  id: string
  title: string
  date: string
  endTime: string | null
  location: string | null
  section: string
  description: string | null
  isPublished: boolean
  recurrence: string | null
  eventType: string
}

const SECTIONS = [
  { value: "sport", label: "Sekcja Sportowa" },
  { value: "kolekcje", label: "Sekcja Kolekcjonerska" },
  { value: "sspo", label: "Szkolenie Ochrony" },
  { value: "general", label: "Ogólne" },
]

const EVENT_TYPE_CONFIG = {
  zawody: {
    label: "Zawody",
    icon: Trophy,
    accent: "border-gold-400",
    headerBg: "bg-gold-50 border-gold-200",
    badge: "bg-gold-100 text-gold-800",
    priority: 3,
    description: "Najwyższy priorytet — zastępują wszystkie inne wydarzenia w tym samym czasie.",
  },
  jednorazowe: {
    label: "Jednorazowe",
    icon: CalendarDays,
    accent: "border-blue-400",
    headerBg: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-800",
    priority: 2,
    description: "Wyższy priorytet niż cykliczne — zastępują treningi cykliczne w tym samym czasie.",
  },
  cykliczne: {
    label: "Cykliczne",
    icon: RefreshCw,
    accent: "border-purple-400",
    headerBg: "bg-purple-50 border-purple-200",
    badge: "bg-purple-100 text-purple-800",
    priority: 1,
    description: "Powtarzają się co tydzień. Mogą być zastąpione przez treningi jednorazowe lub zawody.",
  },
}

// ─── Collision detection ──────────────────────────────────────────────────────

function toMinutes(dateStr: string): number {
  const d = new Date(dateStr)
  return d.getHours() * 60 + d.getMinutes()
}

function timesOverlap(startA: string, endA: string | null, startB: string, endB: string | null): boolean {
  const s1 = toMinutes(startA)
  const e1 = endA ? toMinutes(endA) : s1 + 60
  const s2 = toMinutes(startB)
  const e2 = endB ? toMinutes(endB) : s2 + 60
  if (e1 <= s1 || e2 <= s2) return false // invalid range guard
  return s1 < e2 && s2 < e1
}

function dayOfWeek(dateStr: string): number {
  return new Date(dateStr).getDay()
}

function localDateStr(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function sameLocalDay(a: string, b: string): boolean {
  return localDateStr(a) === localDateStr(b)
}

function detectCollisions(events: EventData[]): Map<string, string[]> {
  const collisions = new Map<string, string[]>()

  function add(a: string, b: string) {
    if (!collisions.get(a)?.includes(b)) collisions.set(a, [...(collisions.get(a) ?? []), b])
    if (!collisions.get(b)?.includes(a)) collisions.set(b, [...(collisions.get(b) ?? []), a])
  }

  const cyclic = events.filter((e) => e.eventType === "cykliczne")
  const oneTime = events.filter((e) => e.eventType === "jednorazowe")
  const tournaments = events.filter((e) => e.eventType === "zawody")

  console.group("[Harmonogram] detectCollisions")
  console.log("cyclic:", cyclic.map(e => ({ title: e.title, date: e.date, dow: dayOfWeek(e.date), min: toMinutes(e.date), endMin: e.endTime ? toMinutes(e.endTime) : toMinutes(e.date)+60 })))
  console.log("oneTime:", oneTime.map(e => ({ title: e.title, date: e.date, dow: dayOfWeek(e.date), min: toMinutes(e.date), endMin: e.endTime ? toMinutes(e.endTime) : toMinutes(e.date)+60 })))
  console.log("tournaments:", tournaments.map(e => ({ title: e.title, date: e.date, dow: dayOfWeek(e.date), min: toMinutes(e.date) })))
  console.groupEnd()

  // Same-type collisions
  for (let i = 0; i < cyclic.length; i++) {
    for (let j = i + 1; j < cyclic.length; j++) {
      if (dayOfWeek(cyclic[i].date) === dayOfWeek(cyclic[j].date) && timesOverlap(cyclic[i].date, cyclic[i].endTime, cyclic[j].date, cyclic[j].endTime))
        add(cyclic[i].id, cyclic[j].id)
    }
  }
  for (let i = 0; i < oneTime.length; i++) {
    for (let j = i + 1; j < oneTime.length; j++) {
      if (sameLocalDay(oneTime[i].date, oneTime[j].date) && timesOverlap(oneTime[i].date, oneTime[i].endTime, oneTime[j].date, oneTime[j].endTime))
        add(oneTime[i].id, oneTime[j].id)
    }
  }
  for (let i = 0; i < tournaments.length; i++) {
    for (let j = i + 1; j < tournaments.length; j++) {
      if (sameLocalDay(tournaments[i].date, tournaments[j].date) && timesOverlap(tournaments[i].date, tournaments[i].endTime, tournaments[j].date, tournaments[j].endTime))
        add(tournaments[i].id, tournaments[j].id)
    }
  }

  // Cross-type collisions
  for (const cy of cyclic) {
    for (const ot of oneTime) {
      if (dayOfWeek(cy.date) === dayOfWeek(ot.date) && timesOverlap(cy.date, cy.endTime, ot.date, ot.endTime))
        add(cy.id, ot.id)
    }
    for (const to of tournaments) {
      if (dayOfWeek(cy.date) === dayOfWeek(to.date) && timesOverlap(cy.date, cy.endTime, to.date, to.endTime))
        add(cy.id, to.id)
    }
  }
  for (const ot of oneTime) {
    for (const to of tournaments) {
      if (sameLocalDay(ot.date, to.date) && timesOverlap(ot.date, ot.endTime, to.date, to.endTime))
        add(ot.id, to.id)
    }
  }

  return collisions
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const inputCls = "w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white"

function toLocalDateTimeString(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function blankForm(eventType: string): Partial<EventData> {
  const now = new Date()
  now.setMinutes(0, 0, 0)
  return {
    title: "",
    date: now.toISOString(),
    endTime: null,
    location: "",
    section: "sport",
    description: "",
    isPublished: true,
    recurrence: eventType === "cykliczne" ? "weekly" : null,
    eventType,
  }
}

function AutoResizeTextarea({ className, onChange, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const adjust = () => {
    const el = ref.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }
  useEffect(() => { adjust() })
  return (
    <textarea
      ref={ref}
      rows={2}
      {...props}
      className={className}
      style={{ overflow: "hidden", resize: "vertical" }}
      onChange={(e) => { adjust(); onChange?.(e) }}
    />
  )
}

// ─── EventForm ────────────────────────────────────────────────────────────────

function EventForm({
  initial,
  onSave,
  onCancel,
  loading,
}: {
  initial: Partial<EventData>
  onSave: (data: Partial<EventData>) => void
  onCancel: () => void
  loading: boolean
}) {
  const [form, setForm] = useState(initial)
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }))
  const isCyclic = form.eventType === "cykliczne"

  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-neutral-600 mb-1">Tytuł *</label>
          <input value={form.title ?? ""} onChange={(e) => set("title", e.target.value)}
            placeholder="np. Trening pistoletu" className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-1">
            {isCyclic ? "Dzień tygodnia i godzina" : "Data i godzina"} *
          </label>
          <input type="datetime-local"
            value={form.date ? toLocalDateTimeString(new Date(form.date)) : ""}
            onChange={(e) => set("date", e.target.value ? new Date(e.target.value).toISOString() : "")}
            className={inputCls} />
          {isCyclic && (
            <p className="text-xs text-neutral-400 mt-1">Wybierz dowolną datę z właściwego dnia tygodnia — tylko dzień tygodnia i godzina są brane pod uwagę.</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-1">Koniec (opcjonalne)</label>
          <input type="datetime-local"
            value={form.endTime ? toLocalDateTimeString(new Date(form.endTime)) : ""}
            onChange={(e) => set("endTime", e.target.value ? new Date(e.target.value).toISOString() : null)}
            className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-1">Sekcja</label>
          <select value={form.section ?? "general"} onChange={(e) => set("section", e.target.value)} className={inputCls}>
            {SECTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-1">Miejsce</label>
          <input value={form.location ?? ""} onChange={(e) => set("location", e.target.value)}
            placeholder="np. Myślenice, ul. Zdrojowa 9" className={inputCls} />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-neutral-600 mb-1">Opis (opcjonalne)</label>
          <AutoResizeTextarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)}
            className={inputCls} placeholder="Dodatkowe informacje..." />
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <input type="checkbox" id="pub" checked={form.isPublished ?? true}
            onChange={(e) => set("isPublished", e.target.checked)} className="rounded" />
          <label htmlFor="pub" className="text-sm text-neutral-700">Widoczne na stronie publicznej</label>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button onClick={() => onSave(form)} disabled={loading || !form.title}
          className="flex items-center gap-2 bg-navy-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-navy-700 transition-colors disabled:opacity-60">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Zapisz
        </button>
        <button onClick={onCancel} className="flex items-center gap-2 border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg text-sm hover:bg-neutral-50">
          <X className="w-4 h-4" /> Anuluj
        </button>
      </div>
    </div>
  )
}

// ─── EventRow ─────────────────────────────────────────────────────────────────

function EventRow({
  event,
  collidingWith,
  allEvents,
  onEdit,
  onDelete,
  loading,
}: {
  event: EventData
  collidingWith: string[]
  allEvents: EventData[]
  onEdit: () => void
  onDelete: () => void
  loading: boolean
}) {
  const date = parseISO(event.date)
  const endTime = event.endTime ? parseISO(event.endTime) : null
  const isCyclic = event.eventType === "cykliczne"

  const collidingEvents = collidingWith
    .map((id) => allEvents.find((e) => e.id === id))
    .filter(Boolean) as EventData[]

  return (
    <div className={`bg-white border rounded-xl px-4 py-3 flex items-start gap-3 ${collidingWith.length > 0 ? "border-amber-300 bg-amber-50/40" : "border-neutral-200"}`}>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <span className="font-semibold text-neutral-900 text-sm">{event.title}</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full font-medium bg-neutral-100 text-neutral-600">
            {SECTIONS.find((s) => s.value === event.section)?.label}
          </span>
          {!event.isPublished && (
            <span className="text-xs px-1.5 py-0.5 rounded-full font-medium bg-red-100 text-red-600">Ukryte</span>
          )}
        </div>
        <p className="text-xs text-neutral-500">
          {isCyclic
            ? `Co ${format(date, "EEEE", { locale: pl })} · ${format(date, "HH:mm")}${endTime ? `–${format(endTime, "HH:mm")}` : ""}`
            : `${format(date, "EEEE, d MMMM yyyy · HH:mm", { locale: pl })}${endTime ? `–${format(endTime, "HH:mm")}` : ""}`}
          {event.location && ` · ${event.location}`}
        </p>
        {collidingWith.length > 0 && (
          <div className="flex items-start gap-1.5 mt-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-px" />
            <p className="text-xs text-amber-700">
              Nakłada się z: {collidingEvents.map((e) => (
                <span key={e.id} className="font-medium">
                  {e.title} ({EVENT_TYPE_CONFIG[e.eventType as keyof typeof EVENT_TYPE_CONFIG]?.label ?? e.eventType})
                </span>
              )).reduce<React.ReactNode[]>((acc, el, i) => i === 0 ? [el] : [...acc, ", ", el], [])}
            </p>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={onEdit} disabled={loading}
          className="p-1.5 text-neutral-500 hover:text-navy-700 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-40">
          <Pencil className="w-4 h-4" />
        </button>
        <button onClick={onDelete} disabled={loading}
          className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ─── HarmonogramEditor ────────────────────────────────────────────────────────

const ORDERED_TYPES = ["zawody", "jednorazowe", "cykliczne"] as const

export function HarmonogramEditor({ initialEvents, initialHorizonDays }: { initialEvents: EventData[]; initialHorizonDays: number | null }) {
  const [events, setEvents] = useState(initialEvents)
  const [adding, setAdding] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [horizonDays, setHorizonDays] = useState<string>(initialHorizonDays != null ? String(initialHorizonDays) : "")
  const [horizonSaving, setHorizonSaving] = useState(false)
  const router = useRouter()

  const horizonDate = (() => {
    const n = parseInt(horizonDays)
    if (!n || n < 1) return null
    const d = new Date()
    d.setDate(d.getDate() + n)
    return d
  })()

  async function saveHorizon() {
    setHorizonSaving(true)
    try {
      const days = parseInt(horizonDays)
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ calendarHorizonDays: days >= 1 ? days : null }),
      })
      router.refresh()
    } finally {
      setHorizonSaving(false)
    }
  }

  const collisions = detectCollisions(events)

  async function saveEvent(data: Partial<EventData>, id?: string) {
    setLoading(true)
    try {
      const method = id ? "PUT" : "POST"
      const url = id ? `/api/events/${id}` : "/api/events"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      const saved = await res.json()
      if (id) {
        setEvents((ev) => ev.map((e) => (e.id === id ? saved : e)))
        setEditing(null)
      } else {
        setEvents((ev) => [...ev, saved])
        setAdding(null)
      }
      router.refresh()
    } catch {
      alert("Nie udało się zapisać wydarzenia.")
    } finally {
      setLoading(false)
    }
  }

  async function deleteEvent(id: string) {
    if (!confirm("Usunąć to wydarzenie?")) return
    setLoading(true)
    try {
      await fetch(`/api/events/${id}`, { method: "DELETE" })
      setEvents((ev) => ev.filter((e) => e.id !== id))
      router.refresh()
    } catch {
      alert("Nie udało się usunąć wydarzenia.")
    } finally {
      setLoading(false)
    }
  }

  const totalCollisions = new Set(
    [...collisions.entries()].filter(([, v]) => v.length > 0).map(([k]) => k)
  ).size

  return (
    <div className="space-y-6">
      {/* Horizon setting */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white border border-neutral-200 rounded-xl px-5 py-4">
        <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-neutral-800 mb-0.5">Zasięg kalendarza</p>
          <p className="text-xs text-neutral-500">
            {horizonDate
              ? <>Zdarzenia będą wyświetlane do <span className="font-medium text-neutral-700">{horizonDate.toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })}</span></>
              : "Brak limitu — wyświetlane są wszystkie zaplanowane zdarzenia."}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs text-neutral-500 whitespace-nowrap">Pokaż przez</label>
          <input
            type="number" min={1} max={3650}
            value={horizonDays}
            onChange={(e) => setHorizonDays(e.target.value)}
            placeholder="∞"
            className="w-20 border border-neutral-300 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-navy-500"
          />
          <label className="text-xs text-neutral-500">dni</label>
          <button
            onClick={saveHorizon}
            disabled={horizonSaving}
            className="flex items-center gap-1.5 bg-navy-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-navy-700 transition-colors disabled:opacity-60"
          >
            {horizonSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Zapisz
          </button>
        </div>
      </div>

      {totalCollisions > 0 && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-800 font-medium">
            {totalCollisions} {totalCollisions === 1 ? "wydarzenie ma" : "wydarzenia mają"} nakładające się terminy.
          </p>
        </div>
      )}

      {ORDERED_TYPES.map((type) => {
        const cfg = EVENT_TYPE_CONFIG[type]
        const Icon = cfg.icon
        const sectionEvents = events
          .filter((e) => e.eventType === type)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        return (
          <div key={type} className={`border rounded-xl overflow-hidden ${cfg.accent}`}>
            {/* Section header */}
            <div className={`flex items-center justify-between px-5 py-4 border-b ${cfg.headerBg}`}>
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-neutral-600" />
                <div>
                  <h2 className="font-bold text-neutral-900">{cfg.label}</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">{cfg.description}</p>
                </div>
              </div>
              <button
                onClick={() => { setAdding(type); setEditing(null) }}
                disabled={adding === type}
                className="flex items-center gap-1.5 bg-navy-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-navy-700 transition-colors disabled:opacity-60 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Dodaj
              </button>
            </div>

            {/* Add form */}
            {adding === type && (
              <div className="p-4">
                <EventForm
                  initial={blankForm(type)}
                  onSave={(data) => saveEvent(data)}
                  onCancel={() => setAdding(null)}
                  loading={loading}
                />
              </div>
            )}

            {/* Events list */}
            <div className="p-4 space-y-2">
              {sectionEvents.length === 0 && adding !== type && (
                <p className="text-sm text-neutral-400 text-center py-4">
                  Brak wydarzeń. Kliknij &quot;Dodaj&quot;, aby dodać pierwsze.
                </p>
              )}
              {sectionEvents.map((event) => (
                <div key={event.id}>
                  {editing === event.id ? (
                    <EventForm
                      initial={event}
                      onSave={(data) => saveEvent(data, event.id)}
                      onCancel={() => setEditing(null)}
                      loading={loading}
                    />
                  ) : (
                    <EventRow
                      event={event}
                      collidingWith={collisions.get(event.id) ?? []}
                      allEvents={events}
                      onEdit={() => { setEditing(event.id); setAdding(null) }}
                      onDelete={() => deleteEvent(event.id)}
                      loading={loading}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
