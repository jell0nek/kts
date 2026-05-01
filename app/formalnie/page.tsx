export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import Link from "next/link"
import { FileText, BookOpen, Scale, Shield, ScrollText, Building2, Users, Gavel, Folder, Star, Download, ChevronRight } from "lucide-react"
import { getPublishedContent } from "@/lib/content-server"
import { PAGE_DEFAULTS, migrateLegalContent } from "@/lib/content"
import { PageHero } from "@/components/PageHero"

export const metadata: Metadata = { title: "Formalnie — KTS Kraków" }

const sectionIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, BookOpen, Scale, Shield, ScrollText, Building2, Users, Gavel, Folder, Star,
}

function SectionIconComponent({ name, className }: { name: string; className?: string }) {
  const Icon = sectionIconMap[name] ?? FileText
  return <Icon className={className} />
}

export default async function LegalPage() {
  const c = await getPublishedContent("formalnie")
  const content = migrateLegalContent(c)

  return (
    <>
      <PageHero title="Formalnie" subtitle="Dokumenty i podstawy prawne działalności KTS" />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div
          className="prose text-neutral-700 text-lg mb-10"
          dangerouslySetInnerHTML={{ __html: content.introHtml }}
        />

        {content.sections.map((section) => {
          const defSection = PAGE_DEFAULTS.formalnie.sections.find((s) => s.id === section.id)
          return (
            <div key={section.id} className="mb-10">
              <div className="flex items-center gap-2 mb-5">
                <SectionIconComponent name={section.icon} className="w-5 h-5 text-gold-500" />
                <h2 className="text-2xl font-bold text-navy-900">{section.title}</h2>
              </div>
              <div className="space-y-3">
                {section.items.map((item) => {
                  const defItem = defSection?.items.find((di) => di.id === item.id)
                  const effectiveContent =
                    item.content !== undefined ? item.content : defItem?.content
                  const hasContent = effectiveContent !== undefined
                  const showRead = item.category !== "pobierz" && hasContent
                  const effectiveUrl =
                    item.url && item.url !== "#"
                      ? item.url
                      : defItem?.url && defItem.url !== "#"
                      ? defItem.url
                      : ""
                  const showDownload = item.category === "pobierz" && !!effectiveUrl

                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-gold-300 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 bg-gold-50 rounded-lg flex items-center justify-center shrink-0">
                          <SectionIconComponent
                            name={section.icon}
                            className="w-4 h-4 text-gold-500"
                          />
                        </div>
                        <div className="min-w-0">
                          {showRead ? (
                            <Link
                              href={`/formalnie/item/${item.id}`}
                              className="font-semibold text-navy-900 hover:text-navy-600 hover:underline"
                            >
                              {item.name}
                            </Link>
                          ) : (
                            <p className="font-semibold text-navy-900">{item.name}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {showRead && (
                          <Link
                            href={`/formalnie/item/${item.id}`}
                            className="flex items-center justify-center gap-1.5 w-28 bg-navy-50 text-navy-800 text-sm font-medium px-4 py-2 rounded-lg hover:bg-navy-100 transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                            Czytaj
                          </Link>
                        )}
                        {showDownload && (
                          <a
                            href={effectiveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 w-28 bg-navy-50 text-navy-800 text-sm font-medium px-4 py-2 rounded-lg hover:bg-navy-100 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Pobierz
                          </a>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
