import { prisma } from "@/lib/prisma"
import { HarmonogramEditor } from "@/components/admin/HarmonogramEditor"

export default async function HarmonogramPage() {
  let events: {
    id: string; title: string; date: Date; endTime: Date | null
    location: string | null; section: string; description: string | null
    isPublished: boolean; recurrence: string | null; eventType: string
  }[] = []

  try {
    events = await prisma.event.findMany({
      orderBy: { date: "asc" },
    })
  } catch {}

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">Harmonogram</h1>
      <p className="text-neutral-500 text-sm mb-6">
        Zarządzaj wydarzeniami widocznymi w kalendarzu na stronie publicznej.
      </p>
      <HarmonogramEditor
        initialEvents={events.map((e) => ({
          ...e,
          date: e.date.toISOString(),
          endTime: e.endTime?.toISOString() ?? null,
        }))}
      />
    </div>
  )
}
