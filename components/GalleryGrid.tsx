"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, ImageOff } from "lucide-react"
import { blobUrl } from "@/lib/blobUrl"

type Photo = { id: string; url: string; caption: string | null }

export function GalleryGrid({ photos, label }: { photos: Photo[]; label: string }) {
  const [selected, setSelected] = useState<number | null>(null)

  const close = () => setSelected(null)
  const prev = () => setSelected((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null))
  const next = () => setSelected((i) => (i !== null ? (i + 1) % photos.length : null))

  useEffect(() => {
    if (selected === null) return
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", onKey)
    }
  }, [selected])

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-neutral-100 rounded-xl py-16 text-neutral-400 gap-3">
        <ImageOff className="w-10 h-10" />
        <p className="text-sm">Brak zdjęć w tej galerii</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setSelected(i)}
            className="group relative aspect-square rounded-lg overflow-hidden bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-gold-400"
          >
            <Image
              src={blobUrl(photo.url)}
              alt={photo.caption ?? label}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {photo.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="text-white text-xs">{photo.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {selected !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center"
          onClick={close}
        >
          <div
            className="relative flex items-center justify-center w-full h-full p-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={close}
              className="absolute top-4 right-4 z-10 p-1 text-white/70 hover:text-white transition-colors"
              aria-label="Zamknij"
            >
              <X className="w-7 h-7" />
            </button>

            {/* Prev */}
            {photos.length > 1 && (
              <button
                onClick={prev}
                className="absolute left-2 sm:left-4 z-10 p-2 text-white/70 hover:text-white transition-colors"
                aria-label="Poprzednie"
              >
                <ChevronLeft className="w-9 h-9" />
              </button>
            )}

            {/* Image */}
            <div className="relative w-full h-full">
              <Image
                src={blobUrl(photos[selected].url)}
                alt={photos[selected].caption ?? label}
                fill
                unoptimized
                className="object-contain"
              />
            </div>

            {/* Next */}
            {photos.length > 1 && (
              <button
                onClick={next}
                className="absolute right-2 sm:right-4 z-10 p-2 text-white/70 hover:text-white transition-colors"
                aria-label="Następne"
              >
                <ChevronRight className="w-9 h-9" />
              </button>
            )}

            {/* Caption + counter */}
            <div className="absolute bottom-4 inset-x-0 text-center pointer-events-none">
              {photos[selected].caption && (
                <p className="text-white text-sm mb-1">{photos[selected].caption}</p>
              )}
              <p className="text-white/40 text-xs tabular-nums">
                {selected + 1} / {photos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
