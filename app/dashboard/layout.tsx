"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Star,
  Heart,
  Film,
  FileText,
  Wallet,
  History,
  Settings,
  Upload,
} from "lucide-react"
import { VisualHeader } from "@/components/visual-header"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

const SIDEBAR_ITEMS = [
  {
    label: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["visitor", "porter", "investor", "infoporter", "investireader"],
  },
  {
    label: "Mes VISUpoints",
    href: "/dashboard/visupoints",
    icon: Star,
    roles: ["visitor"],
  },
  {
    label: "Mes favoris",
    href: "/dashboard/favorites",
    icon: Heart,
    roles: ["visitor", "porter", "investor", "infoporter", "investireader"],
  },
  {
    label: "Mes projets (vidéo)",
    href: "/dashboard/projects?type=video",
    icon: Film,
    roles: ["porter"],
  },
  {
    label: "Mes écrits",
    href: "/dashboard/projects?type=text",
    icon: FileText,
    roles: ["infoporter"],
  },
  {
    label: "Mes investissements",
    href: "/dashboard/investments",
    icon: Wallet,
    roles: ["investor", "investireader"],
  },
  {
    label: "Mon wallet",
    href: "/dashboard/wallet",
    icon: Wallet,
    roles: ["porter", "investor", "infoporter", "investireader"],
  },
  {
    label: "Historique",
    href: "/dashboard/history",
    icon: History,
    roles: ["porter", "investor", "infoporter", "investireader"],
  },
  {
    label: "Déposer une vidéo",
    href: "/upload",
    icon: Upload,
    roles: ["porter"],
  },
  {
    label: "Déposer un écrit",
    href: "/upload/text",
    icon: Upload,
    roles: ["infoporter"],
  },
  {
    label: "Paramètres",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["visitor", "porter", "investor", "infoporter", "investireader"],
  },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { roles, isAuthed } = useAuth()

  const visibleItems = SIDEBAR_ITEMS.filter(
    (item) => item.roles.some((r) => roles.includes(r as any)) || !isAuthed
  )

  return (
    <div className="min-h-screen bg-slate-950">
      <VisualHeader />

      <div className="flex pt-20">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-white/10 bg-slate-900/50 min-h-[calc(100vh-5rem)] sticky top-20">
          <nav className="flex-1 p-4 space-y-1">
            {visibleItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href.split("?")[0]))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-emerald-600/20 text-emerald-400"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
