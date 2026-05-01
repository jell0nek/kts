"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Strona główna" },
  { href: "/o-nas", label: "O nas" },
  { href: "/formalnie", label: "Formalnie" },
  {
    label: "Sekcje",
    children: [
      { href: "/sekcje/sportowa", label: "Sekcja Sportowa" },
      { href: "/sekcje/kolekcjonerska", label: "Sekcja Kolekcjonerska" },
      { href: "/sekcje/szkolenie", label: "Szkolenie Ochrony" },
    ],
  },
  { href: "/media", label: "Zdjęcia" },
  { href: "/kalendarz", label: "Kalendarz" },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [sectionsOpen, setSectionsOpen] = useState(false)

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <header className="bg-navy-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg tracking-wide">
            <span className="text-white">KTS</span>
            <span className="hidden sm:block text-gold-500 font-light text-base">Kraków</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) =>
              link.children ? (
                <div key="sekcje" className="relative group">
                  <button
                    className={cn(
                      "px-3 py-2 rounded text-sm font-medium transition-colors hover:text-gold-400",
                      link.children.some((c) => isActive(c.href))
                        ? "text-gold-400"
                        : "text-navy-100"
                    )}
                  >
                    {link.label}
                    <span className="ml-1 text-xs">▾</span>
                  </button>
                  <div className="absolute top-full left-0 pt-1 hidden group-hover:block">
                    <div className="bg-navy-800 rounded-lg shadow-xl border border-navy-700 min-w-48 py-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block px-4 py-2 text-sm transition-colors hover:bg-navy-700 hover:text-gold-400",
                            isActive(child.href) ? "text-gold-400" : "text-navy-100"
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className={cn(
                    "px-3 py-2 rounded text-sm font-medium transition-colors hover:text-gold-400",
                    isActive(link.href!) ? "text-gold-400" : "text-navy-100"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded text-navy-100 hover:text-gold-400"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-navy-800 border-t border-navy-700">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            {links.map((link) =>
              link.children ? (
                <div key="sekcje-mobile">
                  <button
                    className="w-full text-left px-3 py-2 text-sm font-medium text-navy-100 hover:text-gold-400"
                    onClick={() => setSectionsOpen(!sectionsOpen)}
                  >
                    {link.label} <span className="ml-1 text-xs">{sectionsOpen ? "▴" : "▾"}</span>
                  </button>
                  {sectionsOpen && (
                    <div className="pl-4 flex flex-col gap-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "px-3 py-2 text-sm transition-colors hover:text-gold-400",
                            isActive(child.href) ? "text-gold-400" : "text-navy-100"
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-3 py-2 text-sm font-medium transition-colors hover:text-gold-400",
                    isActive(link.href!) ? "text-gold-400" : "text-navy-100"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
