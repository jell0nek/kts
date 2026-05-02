"use client"

import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RichEditor } from "./RichEditor"
import {
  Save, Eye, Loader2, Plus, Trash2, Upload,
  FileText as FileTextIcon, BookOpen, Scale, Shield, ScrollText,
  Building2, Users, Gavel, Folder, Star,
} from "lucide-react"
import type { FieldConfig } from "@/lib/page-fields"
import type { LegalSection, LegalItem } from "@/lib/content"

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

interface PageEditorClientProps {
  slug: string
  initialContent: Record<string, unknown>
  fields: FieldConfig[]
}

// ─── Icon set ───────────────────────────────────────────────────────────────

const SECTION_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText: FileTextIcon,
  BookOpen,
  Scale,
  Shield,
  ScrollText,
  Building2,
  Users,
  Gavel,
  Folder,
  Star,
}

const SECTION_ICON_LIST = [
  { id: "FileText", label: "Dokument" },
  { id: "BookOpen", label: "Prawo" },
  { id: "Scale", label: "Waga" },
  { id: "Shield", label: "Tarcza" },
  { id: "ScrollText", label: "Zwój" },
  { id: "Building2", label: "Budynek" },
  { id: "Users", label: "Osoby" },
  { id: "Gavel", label: "Sąd" },
  { id: "Folder", label: "Folder" },
  { id: "Star", label: "Ważne" },
]

// ─── Helper ──────────────────────────────────────────────────────────────────

const inputClass =
  "border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white"

// ─── ScheduleEditor ──────────────────────────────────────────────────────────

function ScheduleEditor({
  value,
  onChange,
}: {
  value: { id: string; day: string; discipline: string; time: string }[]
  onChange: (v: unknown[]) => void
}) {
  const add = () =>
    onChange([...value, { id: Date.now().toString(), day: "", discipline: "", time: "" }])
  const remove = (id: string) => onChange(value.filter((r) => r.id !== id))
  const update = (id: string, field: string, val: string) =>
    onChange(value.map((r) => (r.id === id ? { ...r, [field]: val } : r)))

  return (
    <div className="space-y-2">
      {value.map((row) => (
        <div key={row.id} className="flex gap-2 items-center">
          <input
            value={row.day}
            onChange={(e) => update(row.id, "day", e.target.value)}
            placeholder="Dzień"
            className={inputClass + " flex-1"}
          />
          <input
            value={row.discipline}
            onChange={(e) => update(row.id, "discipline", e.target.value)}
            placeholder="Dyscyplina"
            className={inputClass + " flex-1"}
          />
          <input
            value={row.time}
            onChange={(e) => update(row.id, "time", e.target.value)}
            placeholder="Godziny"
            className={inputClass + " flex-1"}
          />
          <button
            type="button"
            onClick={() => remove(row.id)}
            className="text-red-400 hover:text-red-600 p-1.5"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-sm text-navy-700 hover:text-navy-900 border border-dashed border-neutral-300 rounded-lg px-3 py-1.5 hover:border-navy-400 transition-colors"
      >
        <Plus className="w-4 h-4" /> Dodaj wiersz
      </button>
    </div>
  )
}

// ─── ProgramsEditor ──────────────────────────────────────────────────────────

function ProgramsEditor({
  value,
  onChange,
}: {
  value: { id: string; name: string; hours: number; description: string }[]
  onChange: (v: unknown[]) => void
}) {
  const add = () =>
    onChange([...value, { id: Date.now().toString(), name: "", hours: 0, description: "" }])
  const remove = (id: string) => onChange(value.filter((r) => r.id !== id))
  const update = (id: string, field: string, val: string | number) =>
    onChange(value.map((r) => (r.id === id ? { ...r, [field]: val } : r)))

  return (
    <div className="space-y-4">
      {value.map((prog) => (
        <div key={prog.id} className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 space-y-2">
          <div className="flex gap-2 items-start">
            <div className="flex-1 space-y-2">
              <input
                value={prog.name}
                onChange={(e) => update(prog.id, "name", e.target.value)}
                placeholder="Nazwa kursu"
                className={inputClass + " w-full"}
              />
              <div className="flex items-center gap-2">
                <label className="text-xs text-neutral-500 shrink-0">Godziny:</label>
                <input
                  type="number"
                  value={prog.hours}
                  onChange={(e) => update(prog.id, "hours", parseInt(e.target.value) || 0)}
                  className={inputClass + " w-24"}
                />
              </div>
              <AutoResizeTextarea
                value={prog.description}
                onChange={(e) => update(prog.id, "description", e.target.value)}
                placeholder="Opis programu"
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
              />
            </div>
            <button
              type="button"
              onClick={() => remove(prog.id)}
              className="text-red-400 hover:text-red-600 p-1.5 mt-0.5"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-sm text-navy-700 hover:text-navy-900 border border-dashed border-neutral-300 rounded-lg px-3 py-1.5 hover:border-navy-400 transition-colors"
      >
        <Plus className="w-4 h-4" /> Dodaj kurs
      </button>
    </div>
  )
}

// ─── SectionsEditor ──────────────────────────────────────────────────────────

function SectionsEditor({
  value,
  onChange,
}: {
  value: LegalSection[]
  onChange: (v: unknown[]) => void
}) {
  const [uploading, setUploading] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  // Section-level helpers
  const updateSection = (sid: string, patch: Partial<LegalSection>) =>
    onChange(value.map((s) => (s.id === sid ? { ...s, ...patch } : s)))
  const removeSection = (sid: string) => onChange(value.filter((s) => s.id !== sid))
  const addSection = () =>
    onChange([
      ...value,
      {
        id: Date.now().toString(),
        title: "Nowa sekcja",
        icon: "Folder",
        items: [],
      },
    ])

  // Item-level helpers
  const updateItem = (sid: string, iid: string, patch: Partial<LegalItem>) =>
    onChange(
      value.map((s) =>
        s.id === sid
          ? { ...s, items: s.items.map((it) => (it.id === iid ? { ...it, ...patch } : it)) }
          : s,
      ),
    )
  const removeItem = (sid: string, iid: string) =>
    onChange(
      value.map((s) =>
        s.id === sid ? { ...s, items: s.items.filter((it) => it.id !== iid) } : s,
      ),
    )
  const addItem = (sid: string) =>
    onChange(
      value.map((s) =>
        s.id === sid
          ? {
              ...s,
              items: [
                ...s.items,
                { id: Date.now().toString(), name: "", category: "przeczytaj" as const, content: "" },
              ],
            }
          : s,
      ),
    )

  async function uploadFile(itemCompositeId: string, sectionId: string, itemId: string, file: File) {
    setUploading(itemCompositeId)
    setUploadError(null)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/documents/upload", { method: "POST", body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? `Błąd ${res.status}`)
      if (data.url) updateItem(sectionId, itemId, { url: data.url })
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Nie udało się wgrać pliku")
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="space-y-6">
      {value.map((section) => {
        const SectionIcon = SECTION_ICON_MAP[section.icon] ?? FileTextIcon
        return (
          <div key={section.id} className="border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50">
            {/* Section header */}
            <div className="flex gap-3 items-start px-4 py-3 bg-white border-b border-neutral-100">
              {/* Icon picker */}
              <div className="shrink-0">
                <div className="flex items-center gap-1 mb-1">
                  <SectionIcon className="w-5 h-5 text-gold-500" />
                  <span className="text-xs text-neutral-400 ml-1">Ikona:</span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {SECTION_ICON_LIST.map(({ id, label }) => {
                    const Ic = SECTION_ICON_MAP[id]!
                    return (
                      <button
                        key={id}
                        type="button"
                        title={label}
                        onClick={() => updateSection(section.id, { icon: id })}
                        className={`p-1.5 rounded border transition-colors ${
                          section.icon === id
                            ? "border-navy-500 bg-navy-50 text-navy-700"
                            : "border-neutral-200 hover:border-neutral-400 text-neutral-400 hover:text-neutral-700"
                        }`}
                      >
                        <Ic className="w-3.5 h-3.5" />
                      </button>
                    )
                  })}
                </div>
              </div>
              {/* Title */}
              <input
                value={section.title}
                onChange={(e) => updateSection(section.id, { title: e.target.value })}
                placeholder="Tytuł sekcji"
                className={inputClass + " flex-1 font-semibold"}
              />
              {/* Delete section */}
              <button
                type="button"
                onClick={() => removeSection(section.id)}
                className="text-red-400 hover:text-red-600 p-1.5 mt-0.5 shrink-0"
                title="Usuń sekcję"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="px-4 py-3 space-y-2">
              {section.items.map((item) => {
                const compositeId = `${section.id}::${item.id}`
                const isPobierz = item.category === "pobierz"
                const fileName = item.url && item.url !== "#" ? item.url.split("/").pop() : null
                return (
                  <div
                    key={item.id}
                    className="border border-neutral-200 rounded-lg overflow-hidden bg-white"
                  >
                    {/* Item row */}
                    <div className="flex gap-2 items-center px-2 py-2">
                      <input
                        value={item.name}
                        onChange={(e) => updateItem(section.id, item.id, { name: e.target.value })}
                        placeholder="Nazwa pozycji"
                        className={inputClass + " flex-1 min-w-0"}
                      />
                      <select
                        value={item.category}
                        onChange={(e) =>
                          updateItem(section.id, item.id, {
                            category: e.target.value as "przeczytaj" | "pobierz",
                          })
                        }
                        className={inputClass + " shrink-0"}
                      >
                        <option value="przeczytaj">Przeczytaj</option>
                        <option value="pobierz">Pobierz</option>
                      </select>
                      <button
                        type="button"
                        onClick={() =>
                          setExpanded(expanded === compositeId ? null : compositeId)
                        }
                        className="text-sm text-navy-600 hover:text-navy-900 px-3 py-1.5 rounded border border-neutral-200 hover:border-navy-300 shrink-0 transition-colors"
                      >
                        {expanded === compositeId
                          ? "Zwiń"
                          : isPobierz
                          ? "Plik / link"
                          : "Edytuj treść"}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(section.id, item.id)}
                        className="text-red-400 hover:text-red-600 p-1.5 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Expanded panel */}
                    {expanded === compositeId && (
                      <div className="border-t border-neutral-100 px-3 pb-3 pt-2 space-y-2">
                        {isPobierz ? (
                          <div className="space-y-3">
                            {fileName && (
                              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                                <span className="text-xs text-emerald-700 font-medium truncate flex-1">
                                  {fileName}
                                </span>
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-emerald-600 hover:underline shrink-0"
                                >
                                  Otwórz
                                </a>
                              </div>
                            )}
                            {uploadError && uploading === null && (
                              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                {uploadError}
                              </p>
                            )}
                            {fileName ? (
                              <label className="flex flex-col items-center gap-2 border-2 border-dashed border-neutral-300 rounded-lg p-5 cursor-pointer hover:border-navy-400 transition-colors">
                                {uploading === compositeId ? (
                                  <>
                                    <Loader2 className="w-5 h-5 animate-spin text-navy-500" />
                                    <span className="text-sm text-neutral-500">Wysyłanie…</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-5 h-5 text-neutral-400" />
                                    <span className="text-sm text-neutral-500">Zastąp plik</span>
                                  </>
                                )}
                                <input
                                  type="file"
                                  className="hidden"
                                  disabled={!!uploading}
                                  onChange={(e) => {
                                    const f = e.target.files?.[0]
                                    if (f) uploadFile(compositeId, section.id, item.id, f)
                                  }}
                                />
                              </label>
                            ) : (
                              <>
                                <label className="flex flex-col items-center gap-2 border-2 border-dashed border-neutral-300 rounded-lg p-5 cursor-pointer hover:border-navy-400 transition-colors">
                                  {uploading === compositeId ? (
                                    <>
                                      <Loader2 className="w-5 h-5 animate-spin text-navy-500" />
                                      <span className="text-sm text-neutral-500">Wysyłanie…</span>
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="w-5 h-5 text-neutral-400" />
                                      <span className="text-sm text-neutral-500">Wgraj plik</span>
                                    </>
                                  )}
                                  <input
                                    type="file"
                                    className="hidden"
                                    disabled={!!uploading}
                                    onChange={(e) => {
                                      const f = e.target.files?.[0]
                                      if (f) uploadFile(compositeId, section.id, item.id, f)
                                    }}
                                  />
                                </label>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-px bg-neutral-200" />
                                  <span className="text-xs text-neutral-400">lub podaj link</span>
                                  <div className="flex-1 h-px bg-neutral-200" />
                                </div>
                                <input
                                  value={item.url && item.url !== "#" ? item.url : ""}
                                  onChange={(e) =>
                                    updateItem(section.id, item.id, { url: e.target.value })
                                  }
                                  placeholder="https://example.com/dokument.pdf"
                                  className={inputClass + " w-full"}
                                />
                              </>
                            )}
                          </div>
                        ) : (
                          <>
                            <input
                              value={item.ref ?? ""}
                              onChange={(e) =>
                                updateItem(section.id, item.id, { ref: e.target.value })
                              }
                              placeholder="Sygnatura prawna (opcjonalna, np. Dz.U. 1997 nr 78 poz. 483)"
                              className={inputClass + " w-full"}
                            />
                            <p className="text-xs text-neutral-400 pt-1">
                              Treść podstrony — pojawi się przycisk Czytaj
                            </p>
                            <RichEditor
                              content={item.content ?? ""}
                              onChange={(html) => updateItem(section.id, item.id, { content: html })}
                            />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
              <button
                type="button"
                onClick={() => addItem(section.id)}
                className="flex items-center gap-1.5 text-sm text-navy-700 hover:text-navy-900 border border-dashed border-neutral-300 rounded-lg px-3 py-1.5 hover:border-navy-400 transition-colors w-full justify-center"
              >
                <Plus className="w-4 h-4" /> Dodaj pozycję
              </button>
            </div>
          </div>
        )
      })}

      <button
        type="button"
        onClick={addSection}
        className="flex items-center gap-1.5 text-sm text-navy-700 hover:text-navy-900 border border-dashed border-neutral-300 rounded-lg px-3 py-1.5 hover:border-navy-400 transition-colors w-full justify-center"
      >
        <Plus className="w-4 h-4" /> Dodaj sekcję
      </button>
    </div>
  )
}

// ─── PageEditorClient ─────────────────────────────────────────────────────────

export function PageEditorClient({ slug, initialContent, fields }: PageEditorClientProps) {
  const [content, setContent] = useState<Record<string, unknown>>(initialContent)
  const [saving, setSaving] = useState(false)
  const [previewing, setPreviewing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  function slugToPath(s: string) {
    return s === "home" ? "/" : `/${s.replace("sportowa", "sekcje/sportowa").replace("kolekcjonerska", "sekcje/kolekcjonerska").replace("szkolenie", "sekcje/szkolenie")}`
  }

  async function openPreview() {
    setPreviewing(true)
    try {
      const res = await fetch(`/api/content/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      })
      if (!res.ok) throw new Error()
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 3000)
      window.open(`/api/preview?redirect=${encodeURIComponent(slugToPath(slug))}`, "_blank")
    } catch {
      setError("Nie udało się zapisać przed podglądem.")
    } finally {
      setPreviewing(false)
    }
  }

  const set = (key: string, val: unknown) =>
    setContent((prev) => ({ ...prev, [key]: val }))

  async function saveDraft() {
    setSaving(true)
    setSaved(false)
    setError("")
    try {
      const res = await fetch(`/api/content/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      })
      if (!res.ok) throw new Error("Błąd zapisu")
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError("Nie udało się zapisać. Spróbuj ponownie.")
    } finally {
      setSaving(false)
    }
  }

  function renderField(field: FieldConfig) {
    const val = content[field.name]
    switch (field.type) {
      case "text":
        return (
          <input
            value={(val as string) ?? ""}
            onChange={(e) => set(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={inputClass + " w-full"}
          />
        )
      case "textarea":
        return (
          <AutoResizeTextarea
            value={(val as string) ?? ""}
            onChange={(e) => set(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
          />
        )
      case "rich":
        return (
          <RichEditor
            content={(val as string) ?? ""}
            onChange={(html) => set(field.name, html)}
            placeholder={field.placeholder}
          />
        )
      case "schedule":
        return (
          <ScheduleEditor
            value={
              (val as { id: string; day: string; discipline: string; time: string }[]) ?? []
            }
            onChange={(v) => set(field.name, v)}
          />
        )
      case "programs":
        return (
          <ProgramsEditor
            value={
              (val as { id: string; name: string; hours: number; description: string }[]) ?? []
            }
            onChange={(v) => set(field.name, v)}
          />
        )
      case "sections":
        return (
          <SectionsEditor
            value={(val as LegalSection[]) ?? []}
            onChange={(v) => set(field.name, v)}
          />
        )
    }
  }

  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <div key={field.name} className="bg-white border border-neutral-200 rounded-xl p-5">
          <label className="block text-sm font-semibold text-neutral-700 mb-3">
            {field.label}
          </label>
          {renderField(field)}
        </div>
      ))}

      {/* Sticky save bar */}
      <div className="sticky bottom-0 bg-white border border-neutral-200 rounded-xl p-4 flex items-center justify-between gap-4 shadow-lg">
        <div>
          {saved && (
            <p className="text-sm text-emerald-600 font-medium">✓ Zapisano wersję roboczą</p>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <div className="flex gap-3">
          <button
            onClick={openPreview}
            disabled={saving || previewing}
            className="flex items-center gap-2 border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg text-sm hover:border-neutral-400 transition-colors disabled:opacity-60"
          >
            {previewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
            Podgląd
          </button>
          <button
            onClick={saveDraft}
            disabled={saving}
            className="flex items-center gap-2 bg-navy-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-navy-700 transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Zapisywanie…" : "Zapisz szkic"}
          </button>
        </div>
      </div>
    </div>
  )
}
