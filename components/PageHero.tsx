import Image from "next/image"
import type { ReactNode } from "react"

interface PageHeroProps {
  title: string
  subtitle?: ReactNode
  children?: ReactNode
}

export function PageHero({ title, subtitle, children }: PageHeroProps) {
  return (
    <section className="bg-navy-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        {children && <div className="mb-4">{children}</div>}
        <div className="flex items-center gap-6 md:gap-8">
          <Image
            src="/logo.png"
            alt="Krakowskie Towarzystwo Strzeleckie"
            width={160}
            height={160}
            className="w-20 h-20 md:w-28 md:h-28 object-contain shrink-0"
            priority
          />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">{title}</h1>
            {subtitle && <p className="text-navy-100/70 text-lg mt-2">{subtitle}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
