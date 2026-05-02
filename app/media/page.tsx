export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { PageHero } from "@/components/PageHero"
import { GalleryGrid } from "@/components/GalleryGrid"

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
        {GALLERIES.map(({ slug, label }) => (
          <section key={slug}>
            <h2 className="text-2xl font-bold text-navy-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-7 bg-gold-500 rounded-full inline-block" />
              {label}
            </h2>
            <GalleryGrid photos={galleryData[slug] ?? []} label={label} />
          </section>
        ))}
      </div>
    </>
  )
}
