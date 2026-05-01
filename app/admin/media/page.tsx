import { prisma } from "@/lib/prisma"
import { MediaManager } from "@/components/admin/MediaManager"

const GALLERIES = [
  { slug: "muzeum", label: "Muzeum" },
  { slug: "wystawy", label: "Wystawy" },
  { slug: "zawody", label: "Zawody" },
]

export default async function MediaPage() {
  let files: { id: string; gallery: string; url: string; filename: string; caption: string | null; order: number }[] = []
  try {
    files = await prisma.mediaFile.findMany({ orderBy: [{ gallery: "asc" }, { order: "asc" }] })
  } catch {}

  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">Galeria zdjęć</h1>
      <p className="text-neutral-500 text-sm mb-6">
        Zarządzaj zdjęciami w galeriach. Zdjęcia są widoczne na publicznej stronie /media.
      </p>
      <MediaManager galleries={GALLERIES} initialFiles={files} />
    </div>
  )
}
