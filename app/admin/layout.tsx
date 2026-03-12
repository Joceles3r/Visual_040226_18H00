"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import {
  Shield,
  BarChart3,
  Users,
  DollarSign,
  AlertTriangle,
  Settings,
  ArrowLeft,
  Lock,
  UserCog,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const ADMIN_NAV = [
  { label: "Tableau de bord", href: "/admin", icon: BarChart3 },
  { label: "Gestion Equipe", href: "/admin/roles", icon: UserCog, highlight: true },
  { label: "Utilisateurs", href: "/admin#users", icon: Users },
  { label: "Paiements", href: "/admin#payouts", icon: DollarSign },
  { label: "Signalements", href: "/admin#reports", icon: AlertTriangle },
  { label: "Securite", href: "/admin/security", icon: ShieldCheck },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isAuthed } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect non-admin users after a brief check
    if (!isAuthed) {
      router.replace("/login")
    } else if (!isAdmin) {
      router.replace("/dashboard")
    }
  }, [isAuthed, isAdmin, router])

  // Gate: show nothing while checking or if not admin
  if (!isAuthed || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Lock className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-white/60 text-lg">{"Vérification des droits d'accès..."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/80 border-r border-red-500/20 flex flex-col shrink-0 sticky top-0 h-screen">
        {/* Admin header */}
        <div className="p-5 border-b border-red-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <Shield className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">VISUAL Admin</p>
              <p className="text-xs text-red-400/70 truncate max-w-[140px]">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                item.highlight
                  ? "text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20"
                  : "text-white/60 hover:text-white hover:bg-red-500/10"
              }`}
            >
              <item.icon className={`h-4 w-4 ${item.highlight ? "text-amber-400" : "text-red-400/60"}`} />
              {item.label}
              {item.highlight && (
                <span className="ml-auto text-xs bg-amber-500 text-black px-1.5 py-0.5 rounded font-semibold">
                  3
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-red-500/20 flex flex-col gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="w-full justify-start text-white/40 hover:text-white hover:bg-white/5">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au dashboard
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
