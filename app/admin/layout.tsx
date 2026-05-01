import Link from "next/link"
import { auth, signOut } from "@/auth"
import {
  Target, LayoutDashboard, FileText, CalendarDays,
  Image, Upload, LogOut, ExternalLink, Palette,
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Panel główny", icon: LayoutDashboard },
  { href: "/admin/strony", label: "Strony", icon: FileText },
  { href: "/admin/harmonogram", label: "Harmonogram", icon: CalendarDays },
  { href: "/admin/media", label: "Media", icon: Image },
  { href: "/admin/wyglad", label: "Wygląd", icon: Palette },
  { href: "/admin/publikuj", label: "Publikuj", icon: Upload },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) return <>{children}</>

  return (
    <div className="flex h-screen bg-neutral-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-navy-900 text-white flex flex-col shrink-0">
        <div className="px-4 py-5 border-b border-navy-700">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-gold-500" />
            <span className="font-bold text-sm">KTS Admin</span>
          </div>
          <p className="text-navy-100/50 text-xs mt-0.5 truncate">{session.user?.email}</p>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-navy-100 hover:bg-navy-700 hover:text-white transition-colors group"
            >
              <Icon className="w-4 h-4 text-navy-100/60 group-hover:text-gold-400 transition-colors" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-2 border-t border-navy-700 space-y-0.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-navy-100 hover:bg-navy-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-navy-100/60" />
            Podgląd strony
          </Link>
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/admin/login" })
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-navy-100 hover:bg-red-900/50 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Wyloguj się
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
