export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import Image from "next/image"
import { ImageOff } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { PageHero } from "@/components/PageHero"

export const metadata: Metadata = { title: "Zdjęcia — KTS Kraków" }

const GALLERIES = [
  { slug: "muzeum", label: "Muzeum" },
  { slug: "wystawy", label: "Wystawy" },
  { slug: "zawody", label: "Zawody" },
]

export default async function MediaPage() {
  let galleryData: Record<string, { id: string; url: string; caption: string | null }[]> = {}
  try {
    const files = await prisma.mediaFile.findMany({
      orderBy: [{ gallery: "asc" }, { order: "asc" }],
      select: { id: true, gallery: true, url: true, caption: true },
    })
    for (const f of files) {
      if (!galleryData[f.gallery]) galleryData[f.gallery] = []
      galleryData[f.gallery].push(f)
    }
  } catch {}

  return (
    <>
      <PageHero title="Galeria zdjęć" subtitle="Muzeum, wystawy i zawody strzeleckie" />

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-14">
        {GALLERIES.map(({ slug, label }) => {
          const photos = galleryData[slug] ?? []
          return (
            <section key={slug}>
              <h2 className="text-2xl font-bold text-navy-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-gold-500 rounded-full inline-block" />
                {label}
              </h2>
              {photos.length === 0 ? (
                <div className="flex flex-col items-center justify-center bg-neutral-100 rounded-xl py-16 text-neutral-400 gap-3">
                  <ImageOff className="w-10 h-10" />
                  <p className="text-sm">Brak zdjęć w tej galerii</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {photos.map((photo) => (
                    <div key={photo.id} className="group relative aspect-square rounded-lg overflow-hidden bg-neutral-200">
                      <Image
                        src={photo.url}
                        alt={photo.caption ?? label}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      {photo.caption && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                          <p className="text-white text-xs">{photo.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </>
  )
}
