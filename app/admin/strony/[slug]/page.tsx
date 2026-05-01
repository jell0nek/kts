import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getDraftContent } from "@/lib/content-server"
import { PAGE_CONFIGS } from "@/lib/page-fields"
import { PageEditorClient } from "@/components/admin/PageEditorClient"
import { migrateLegalContent, type PageContentMap } from "@/lib/content"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PageEditorPage({ params }: Props) {
  const { slug } = await params
  const config = PAGE_CONFIGS[slug]
  if (!config) notFound()

  const draft = await getDraftContent(slug as keyof PageContentMap)

  if (slug === "formalnie") {
    const migrated = migrateLegalContent(draft)
    return (
      <div className="p-6 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/strony" className="flex items-center gap-1 text-neutral-500 hover:text-neutral-800 text-sm">
            <ChevronLeft className="w-4 h-4" /> Strony
          </Link>
          <span className="text-neutral-300">/</span>
          <h1 className="text-xl font-bold text-neutral-900">{config.title}</h1>
        </div>

        <PageEditorClient
          slug={slug}
          initialContent={migrated as unknown as Record<string, unknown>}
          fields={config.fields}
        />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/strony" className="flex items-center gap-1 text-neutral-500 hover:text-neutral-800 text-sm">
          <ChevronLeft className="w-4 h-4" /> Strony
        </Link>
        <span className="text-neutral-300">/</span>
        <h1 className="text-xl font-bold text-neutral-900">{config.title}</h1>
      </div>

      <PageEditorClient
        slug={slug}
        initialContent={draft as unknown as Record<string, unknown>}
        fields={config.fields}
      />
    </div>
  )
}
