"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import { pl } from "date-fns/locale"
import { Upload, Clock, CheckCircle, Loader2, ExternalLink, Calendar } from "lucide-react"

interface PageInfo {
  slug: string
  title: string
  published: boolean
  scheduledAt: string | null
  updatedAt: string
}

export function PublishClient({ pages }: { pages: PageInfo[] }) {
  const [loading, setLoading] = useState<string | null>(null)
  const [scheduleSlug, setScheduleSlug] = useState<string | null>(null)
  const [scheduleDate, setScheduleDate] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()

  async function publishNow(slug: string | "all") {
    setLoading(slug)
    setMessage("")
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope: slug === "all" ? "all" : `page:${slug}` }),
      })
      if (!res.ok) throw new Error()
      setMessage(slug === "all" ? "Wszystkie strony opublikowane!" : "Strona opublikowana!")
      router.refresh()
      setTimeout(() => setMessage(""), 4000)
    } catch {
      setMessage("Błąd publikacji. Spróbuj ponownie.")
    } finally {
      setLoading(null)
    }
  }

  async function schedulePublish(slug: string) {
    if (!scheduleDate) return
    setLoading("schedule-" + slug)
    setMessage("")
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope: `page:${slug}`, publishAt: new Date(scheduleDate).toISOString() }),
      })
      if (!res.ok) throw new Error()
      setMessage("Publikacja zaplanowana!")
      setScheduleSlug(null)
      setScheduleDate("")
      router.refresh()
      setTimeout(() => setMessage(""), 4000)
    } catch {
      setMessage("Błąd planowania. Spróbuj ponownie.")
    } finally {
      setLoading(null)
    }
  }

  async function cancelSchedule(slug: string) {
    setLoading("cancel-" + slug)
    try {
      await fetch("/api/publish", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope: `page:${slug}` }),
      })
      router.refresh()
    } catch {
      setMessage("Błąd anulowania.")
    } finally {
      setLoading(null)
    }
  }

  const pathFor = (slug: string) => {
    const map: Record<string, string> = {
      home: "/",
      "o-nas": "/o-nas",
      formalnie: "/formalnie",
      sportowa: "/sekcje/sportowa",
      kolekcjonerska: "/sekcje/kolekcjonerska",
      szkolenie: "/sekcje/szkolenie",
    }
    return map[slug] ?? `/${slug}`
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium">
          {message}
        </div>
      )}

      {/* Publish all */}
      <div className="bg-navy-900 text-white rounded-xl p-5 flex items-center justify-between">
        <div>
          <p className="font-bold text-base">Opublikuj wszystkie strony</p>
          <p className="text-navy-100/60 text-sm mt-0.5">Wszystkie szkice staną się natychmiast widoczne.</p>
        </div>
        <button
          onClick={() => publishNow("all")}
          disabled={!!loading}
          className="flex items-center gap-2 bg-gold-500 text-navy-900 font-bold px-5 py-2.5 rounded-lg hover:bg-gold-400 transition-colors disabled:opacity-60 shrink-0"
        >
          {loading === "all" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Opublikuj wszystko
        </button>
      </div>

      {/* Per-page controls */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-100 text-sm font-semibold text-neutral-700">
          Poszczególne strony
        </div>
        <div className="divide-y divide-neutral-100">
          {pages.map((page) => (
            <div key={page.slug}>
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="shrink-0">
                  {page.published ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900 text-sm">{page.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${page.published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {page.published ? "Opublikowana" : "Niepublikowana"}
                    </span>
                    {page.scheduledAt && (
                      <span className="text-xs text-blue-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(parseISO(page.scheduledAt), "d MMM HH:mm", { locale: pl })}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a href={pathFor(page.slug)} target="_blank"
                    className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setScheduleSlug(scheduleSlug === page.slug ? null : page.slug)}
                    className="p-1.5 text-neutral-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    title="Zaplanuj publikację"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                  {page.scheduledAt && (
                    <button onClick={() => cancelSchedule(page.slug)}
                      className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors">
                      Anuluj plan
                    </button>
                  )}
                  <button
                    onClick={() => publishNow(page.slug)}
                    disabled={!!loading}
                    className="flex items-center gap-1.5 text-xs bg-navy-900 text-white px-3 py-1.5 rounded-lg hover:bg-navy-700 transition-colors disabled:opacity-60 font-semibold"
                  >
                    {loading === page.slug ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                    Opublikuj
                  </button>
                </div>
              </div>

              {scheduleSlug === page.slug && (
                <div className="px-5 pb-4 bg-blue-50 border-t border-blue-100">
                  <p className="text-xs font-semibold text-blue-700 mt-3 mb-2">Zaplanuj publikację strony „{page.title}"</p>
                  <div className="flex gap-2 items-center">
                    <input
                      type="datetime-local"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    />
                    <button
                      onClick={() => schedulePublish(page.slug)}
                      disabled={!scheduleDate || !!loading}
                      className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
                    >
                      {loading === "schedule-" + page.slug ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Zaplanuj
                    </button>
                    <button onClick={() => setScheduleSlug(null)} className="text-sm text-neutral-500 hover:text-neutral-700">
                      Anuluj
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
