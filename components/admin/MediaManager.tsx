"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Upload, Trash2, Loader2, ImageIcon } from "lucide-react"

interface FileItem {
  id: string; gallery: string; url: string; filename: string; caption: string | null; order: number
}
interface Gallery { slug: string; label: string }

export function MediaManager({
  galleries,
  initialFiles,
}: {
  galleries: Gallery[]
  initialFiles: FileItem[]
}) {
  const [activeGallery, setActiveGallery] = useState(galleries[0]?.slug ?? "muzeum")
  const [files, setFiles] = useState(initialFiles)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const galleryFiles = files.filter((f) => f.gallery === activeGallery)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? [])
    if (!selected.length) return
    setUploading(true)
    try {
      for (const file of selected) {
        const form = new FormData()
        form.append("file", file)
        form.append("gallery", activeGallery)
        const res = await fetch("/api/media", { method: "POST", body: form })
        if (res.ok) {
          const saved = await res.json()
          setFiles((f) => [...f, saved])
        }
      }
      router.refresh()
    } catch {
      alert("Błąd podczas przesyłania zdjęcia.")
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  async function deleteFile(id: string) {
    if (!confirm("Usunąć to zdjęcie?")) return
    setDeletingId(id)
    try {
      await fetch(`/api/media/${id}`, { method: "DELETE" })
      setFiles((f) => f.filter((item) => item.id !== id))
      router.refresh()
    } catch {
      alert("Błąd podczas usuwania.")
    } finally {
      setDeletingId(null)
    }
  }

  async function updateCaption(id: string, caption: string) {
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption }),
      })
      if (res.ok) {
        setFiles((f) => f.map((item) => (item.id === id ? { ...item, caption } : item)))
      }
    } catch {}
  }

  return (
    <div className="space-y-4">
      {/* Gallery tabs */}
      <div className="flex gap-1 bg-neutral-100 rounded-xl p-1">
        {galleries.map((g) => (
          <button
            key={g.slug}
            onClick={() => setActiveGallery(g.slug)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeGallery === g.slug
                ? "bg-white text-navy-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {g.label}
            <span className="ml-1.5 text-xs text-neutral-400">
              ({files.filter((f) => f.gallery === g.slug).length})
            </span>
          </button>
        ))}
      </div>

      {/* Upload button */}
      <div className="flex items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
          id="media-upload"
        />
        <label
          htmlFor="media-upload"
          className="flex items-center gap-2 bg-navy-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-navy-700 transition-colors cursor-pointer"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? "Przesyłanie…" : "Dodaj zdjęcia"}
        </label>
        <p className="text-xs text-neutral-400">Obsługiwane: JPG, PNG, WebP</p>
      </div>

      {/* Grid */}
      {galleryFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-neutral-100 rounded-xl py-16 text-neutral-400 gap-3">
          <ImageIcon className="w-10 h-10 opacity-40" />
          <p className="text-sm">Brak zdjęć w tej galerii. Kliknij "Dodaj zdjęcia".</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {galleryFiles.map((file) => (
            <div key={file.id} className="group relative bg-neutral-100 rounded-lg overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={file.url}
                  alt={file.caption ?? file.filename}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
              <div className="p-2 space-y-1.5">
                <input
                  defaultValue={file.caption ?? ""}
                  onBlur={(e) => updateCaption(file.id, e.target.value)}
                  placeholder="Podpis (opcjonalne)"
                  className="w-full text-xs border border-neutral-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-navy-400"
                />
                <button
                  onClick={() => deleteFile(file.id)}
                  disabled={deletingId === file.id}
                  className="w-full flex items-center justify-center gap-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 py-1 rounded transition-colors"
                >
                  {deletingId === file.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
