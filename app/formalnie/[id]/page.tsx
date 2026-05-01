export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getPublishedContent } from "@/lib/content-server"
import { PAGE_DEFAULTS, migrateLegalContent } from "@/lib/content"
import { PageHero } from "@/components/PageHero"

interface Props {
  params: Promise<{ id: string }>
}

// This route handles old law URLs: /formalnie/1 through /formalnie/8
// In the new data model the ids are "law-1" through "law-8".
// We accept both bare numeric id ("1") and prefixed ("law-1").
function normaliseLawId(id: string) {
  return id.startsWith("law-") ? id : `law-${id}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const nid = normaliseLawId(id)
  const c = await getPublishedContent("formalnie")
  const content = migrateLegalContent(c)
  const lawsSection = content.sections.find((s) => s.id === "laws")
  const item = lawsSection?.items.find((i) => i.id === nid)
  const defItem = PAGE_DEFAULTS.formalnie.sections
    .find((s) => s.id === "laws")
    ?.items.find((i) => i.id === nid)
  const name = item?.name ?? defItem?.name
  if (!name) return {}
  return { title: `${name} — KTS Kraków` }
}

export default async function LawPage({ params }: Props) {
  const { id } = await params
  const nid = normaliseLawId(id)
  const c = await getPublishedContent("formalnie")
  const content = migrateLegalContent(c)

  const lawsSection = content.sections.find((s) => s.id === "laws")
  const item = lawsSection?.items.find((i) => i.id === nid)
  const defItem = PAGE_DEFAULTS.formalnie.sections
    .find((s) => s.id === "laws")
    ?.items.find((i) => i.id === nid)

  if (!item && !defItem) notFound()

  const name = item?.name ?? defItem?.name ?? ""
  const ref = item?.ref ?? defItem?.ref
  const html = item?.content !== undefined ? item.content : defItem?.content

  if (!html) notFound()

  return (
    <>
      <PageHero title={name} subtitle={ref} />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            href="/formalnie"
            className="inline-flex items-center gap-2 text-navy-700 hover:text-navy-900 font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Wróć do Formalnie
          </Link>
        </div>
        <div
          className="prose prose-neutral max-w-none
            prose-headings:text-navy-900 prose-headings:font-bold
            prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-neutral-700 prose-p:leading-relaxed
            prose-li:text-neutral-700
            prose-strong:text-neutral-900"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <div className="mt-12 pt-6 border-t border-neutral-200">
          <Link
            href="/formalnie"
            className="inline-flex items-center gap-2 text-navy-700 hover:text-navy-900 font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Wróć do Formalnie
          </Link>
        </div>
      </div>
    </>
  )
}
