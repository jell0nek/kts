import { prisma } from "@/lib/prisma"

export async function getSettings(): Promise<{ theme: string }> {
  try {
    const s = await prisma.siteSettings.findUnique({ where: { id: "default" } })
    return { theme: s?.theme ?? "classic" }
  } catch {
    return { theme: "classic" }
  }
}

export async function updateSettings(data: { theme?: string }) {
  return prisma.siteSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", theme: data.theme ?? "classic" },
  })
}
