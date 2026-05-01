"use client"

import { useState } from "react"
import { THEMES } from "@/lib/themes"
import { Check, Loader2, Palette } from "lucide-react"

export default function WygladPage() {
  const [active, setActive] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState<string | null>(null)

  async function applyTheme(id: string) {
    setSaving(true)
    setSaved(null)
    setActive(id)
    try {
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: id }),
      })
      setSaved(id)
      setTimeout(() => window.location.reload(), 400)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-2 mb-1">
        <Palette className="w-5 h-5 text-neutral-500" />
        <h1 className="text-2xl font-bold text-neutral-900">Wygląd</h1>
      </div>
      <p className="text-neutral-500 text-sm mb-8">Wybierz paletę kolorów dla całej strony.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {THEMES.map((theme) => (
          <div
            key={theme.id}
            className="bg-white border-2 border-neutral-200 rounded-xl p-5 flex flex-col gap-4 hover:border-neutral-300 transition-colors"
          >
            {/* Swatches */}
            <div className="flex gap-2">
              {theme.swatches.map((color) => (
                <div
                  key={color}
                  className="w-10 h-10 rounded-lg shadow-sm border border-black/10"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Info */}
            <div className="flex-1">
              <p className="font-semibold text-neutral-900">{theme.name}</p>
              <p className="text-sm text-neutral-500 mt-0.5">{theme.description}</p>
            </div>

            {/* Button */}
            <button
              onClick={() => applyTheme(theme.id)}
              disabled={saving}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60
                bg-neutral-900 text-white hover:bg-neutral-700"
            >
              {saving && active === theme.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saved === theme.id ? (
                <Check className="w-4 h-4" />
              ) : null}
              {saved === theme.id ? "Zastosowano" : "Zastosuj"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
