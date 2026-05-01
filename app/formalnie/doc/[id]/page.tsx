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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const c = await getPublishedContent("formalnie")
  const content = migrateLegalContent(c)
  const docsSection = content.sections.find((s) => s.id === "documents")
  const item = docsSection?.items.find((d) => d.id === id)
  const defItem = PAGE_DEFAULTS.formalnie.sections
    .find((s) => s.id === "documents")
    ?.items.find((d) => d.id === id)
  const name = item?.name ?? defItem?.name
  if (!name) return {}
  return { title: `${name} — KTS Kraków` }
}

export default async function DocPage({ params }: Props) {
  const { id } = await params
  const c = await getPublishedContent("formalnie")
  const content = migrateLegalContent(c)

  const docsSection = content.sections.find((s) => s.id === "documents")
  const item = docsSection?.items.find((d) => d.id === id)
  const defItem = PAGE_DEFAULTS.formalnie.sections
    .find((s) => s.id === "documents")
    ?.items.find((d) => d.id === id)

  if (!item && !defItem) notFound()

  const name = item?.name ?? defItem?.name ?? ""
  const html = item?.content !== undefined ? item.content : defItem?.content

  if (html === undefined) notFound()

  return (
    <>
      <PageHero title={name} />

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
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-neutral-700 prose-p:leading-relaxed
            prose-li:text-neutral-700
            prose-strong:text-neutral-900
            prose-a:text-navy-700 prose-a:underline hover:prose-a:text-navy-900"
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
