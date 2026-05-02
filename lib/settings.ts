import { prisma } from "@/lib/prisma"

export async function getSettings(): Promise<{ theme: string; calendarHorizonDays: number | null }> {
  try {
    const s = await prisma.siteSettings.findUnique({ where: { id: "default" } })
    return { theme: s?.theme ?? "classic", calendarHorizonDays: s?.calendarHorizonDays ?? null }
  } catch {
    return { theme: "classic", calendarHorizonDays: null }
  }
}

export async function updateSettings(data: { theme?: string; calendarHorizonDays?: number | null }) {
  return prisma.siteSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", theme: data.theme ?? "classic", calendarHorizonDays: data.calendarHorizonDays ?? null },
  })
}
