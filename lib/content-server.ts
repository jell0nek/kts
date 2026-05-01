import { draftMode } from "next/headers"
import { prisma } from "@/lib/prisma"
import { PAGE_DEFAULTS, type PageContentMap } from "@/lib/content"

export async function getPublishedContent<K extends keyof PageContentMap>(
  slug: K
): Promise<PageContentMap[K]> {
  let previewMode = false
  try {
    const { isEnabled } = await draftMode()
    previewMode = isEnabled
  } catch {}

  try {
    const page = await prisma.pageContent.findUnique({ where: { slug } })
    if (page) {
      const data = previewMode ? page.draft : (page.published ?? page.draft)
      if (data) return data as unknown as PageContentMap[K]
    }
  } catch {
    // DB not configured yet — fall back to defaults
  }
  return PAGE_DEFAULTS[slug]
}

export async function getDraftContent<K extends keyof PageContentMap>(
  slug: K
): Promise<PageContentMap[K]> {
  try {
    const page = await prisma.pageContent.findUnique({ where: { slug } })
    if (page?.draft) return page.draft as unknown as PageContentMap[K]
  } catch {}
  return PAGE_DEFAULTS[slug]
}
