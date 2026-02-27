"use client"

import { useAuth } from "@/lib/auth-context"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  DollarSign,
  Film,
  FileText,
  Mic,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Ban,
  RefreshCw,
  Eye,
  Shield,
  Activity,
  AlertOctagon,
  UserX,
  Trash2,
  MessageCircle,
  ShieldAlert,
  Mail,
} from "lucide-react"

interface AdminStats {
  totalUsers: number
  totalInvestments: number
  totalCreators: number
  totalRevenue: number
  pendingPayouts: number
  activeProjects: number
  reportedContent: number
  timestamp: string
}

// Mock data for users and reports
const MOCK_USERS = [
  { id: "u1", name: "Marie Stellaire", email: "marie@example.com", role: "Porteur", status: "active", joined: "2025-01-15", investments: 0, raised: 15600 },
  { id: "u2", name: "Alexandre M.", email: "alex@example.com", role: "Investisseur", status: "active", joined: "2025-02-03", investments: 2450, raised: 0 },
  { id: "u3", name: "Pierre Ecrivain", email: "pierre@example.com", role: "Infoporteur", status: "active", joined: "2025-03-12", investments: 0, raised: 9800 },
  { id: "u4", name: "Karim Ondes", email: "karim@example.com", role: "Podcasteur", status: "active", joined: "2025-04-01", investments: 0, raised: 8200 },
  { id: "u5", name: "Sophie L.", email: "sophie@example.com", role: "Investisseur", status: "suspended", joined: "2025-01-28", investments: 1890, raised: 0 },
  { id: "u6", name: "Lucas Nature", email: "lucas@example.com", role: "Porteur", status: "active", joined: "2025-02-18", investments: 0, raised: 12400 },
  { id: "u7", name: "Clara M.", email: "clara@example.com", role: "Visiteur", status: "active", joined: "2025-05-02", investments: 0, raised: 0 },
  { id: "u8", name: "Thomas R.", email: "thomas@example.com", role: "Investisseur", status: "active", joined: "2025-03-20", investments: 1650, raised: 0 },
]

const REPORT_CATEGORY_LABELS: Record<string, { label: string; severity: "low" | "medium" | "high" | "critical" }> = {
  racism: { label: "Racisme", severity: "critical" },
  homophobia: { label: "Homophobie", severity: "critical" },
  antisemitism: { label: "Antis\u00e9mitisme", severity: "critical" },
  religious_hate: { label: "Haine religieuse", severity: "critical" },
  insults: { label: "Insultes / Harc\u00e8lement", severity: "high" },
  sexual_content: { label: "Contenu sexuel", severity: "high" },
  violence: { label: "Violence", severity: "high" },
  plagiarism: { label: "Plagiat / Droits d'auteur", severity: "medium" },
  spam: { label: "Spam / Arnaque", severity: "low" },
  other: { label: "Autre", severity: "low" },
}

const MOCK_REPORTS = [
  { id: "r1", contentTitle: "Video signalement #1", reporter: "Clara M.", author: "User456", category: "insults", reason: "Insultes dans les commentaires", status: "pending", date: "2025-06-03" },
  { id: "r2", contentTitle: "Article litigieux", reporter: "Thomas R.", author: "User789", category: "plagiarism", reason: "Plagiat d'un article existant", status: "pending", date: "2025-06-02" },
  { id: "r3", contentTitle: "Podcast episode 12", reporter: "Sophie L.", author: "User321", category: "plagiarism", reason: "Musique non autoris\u00e9e", status: "reviewed", date: "2025-05-28" },
  { id: "r4", contentTitle: "Court-metrage X", reporter: "Alexandre M.", author: "User654", category: "spam", reason: "Spam promotionnel", status: "resolved", date: "2025-05-25" },
  { id: "r5", contentTitle: "Nouvelle litteraire", reporter: "Marie S.", author: "User111", category: "racism", reason: "Propos racistes dans le texte", status: "pending", date: "2025-06-03" },
  { id: "r6", contentTitle: "Commentaire social #42", reporter: "Lucas N.", author: "User222", category: "homophobia", reason: "Propos homophobes r\u00e9p\u00e9t\u00e9s", status: "pending", date: "2025-06-03" },
  { id: "r7", contentTitle: "Video profil User333", reporter: "Karim O.", author: "User333", category: "violence", reason: "Menaces envers un autre utilisateur", status: "pending", date: "2025-06-04" },
]

const MOCK_PAYOUTS = [
  { id: "p1", creator: "Marie Stellaire", amount: 1240, status: "pending", type: "Audiovisuel", date: "2025-06-01" },
  { id: "p2", creator: "Pierre Ecrivain", amount: 680, status: "pending", type: "Litteraire", date: "2025-06-01" },
  { id: "p3", creator: "Karim Ondes", amount: 520, status: "pending", type: "Podcast", date: "2025-06-02" },
  { id: "p4", creator: "Lucas Nature", amount: 890, status: "processed", type: "Audiovisuel", date: "2025-05-28" },
  { id: "p5", creator: "Marie Stellaire", amount: 1100, status: "processed", type: "Audiovisuel", date: "2025-05-21" },
]

export default function AdminPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "payouts" | "reports">("overview")

  const fetchStats = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/secure-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email, action: "get_stats" }),
      })
      if (res.ok) {
        const data = await res.json()
        setStats(data.data)
      }
    } catch {
      // Fallback stats for demo
      setStats({
        totalUsers: 1247,
        totalInvestments: 8934,
        totalCreators: 312,
        totalRevenue: 187650,
        pendingPayouts: 23,
        activeProjects: 89,
        reportedContent: 7,
        timestamp: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }, [user?.email])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const tabs = [
    { key: "overview" as const, label: "Vue d'ensemble", icon: Activity },
    { key: "users" as const, label: "Utilisateurs", icon: Users },
    { key: "payouts" as const, label: "Paiements", icon: DollarSign },
    { key: "reports" as const, label: "Signalements", icon: AlertTriangle },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Shield className="h-8 w-8 text-red-400" />
            Administration VISUAL
          </h1>
          <p className="text-white/50 mt-1">
            {"Panneau d'administration -- Acces restreint"}
          </p>
        </div>
        <Button
          onClick={fetchStats}
          variant="outline"
          className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-slate-900/50 p-1 rounded-xl border border-white/5 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Utilisateurs", value: stats?.totalUsers.toLocaleString() || "--", icon: Users, color: "text-blue-400", bg: "bg-blue-500/15" },
              { label: "Investissements", value: stats?.totalInvestments.toLocaleString() || "--", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/15" },
              { label: "Revenus totaux", value: stats ? `${stats.totalRevenue.toLocaleString()} EUR` : "--", icon: DollarSign, color: "text-amber-400", bg: "bg-amber-500/15" },
              { label: "Projets actifs", value: stats?.activeProjects.toString() || "--", icon: Film, color: "text-purple-400", bg: "bg-purple-500/15" },
            ].map((stat) => (
              <Card key={stat.label} className="bg-slate-900/60 border-white/10">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/40 mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Secondary stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-900/60 border-white/10">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-400">{stats?.reportedContent || "--"}</p>
                  <p className="text-xs text-white/40">Contenus signales</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/60 border-white/10">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-400">{stats?.pendingPayouts || "--"}</p>
                  <p className="text-xs text-white/40">Paiements en attente</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/60 border-white/10">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-500/15 flex items-center justify-center">
                  <Users className="h-6 w-6 text-teal-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-teal-400">{stats?.totalCreators || "--"}</p>
                  <p className="text-xs text-white/40">Createurs actifs</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity feed */}
          <Card className="bg-slate-900/60 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">{"Activite recente"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { text: "Nouveau Porteur inscrit : Lucas Nature", time: "Il y a 2 min", icon: Film, color: "text-red-400" },
                  { text: "Investissement de 15 EUR sur 'L'Odyssee des Etoiles'", time: "Il y a 8 min", icon: TrendingUp, color: "text-emerald-400" },
                  { text: "Paiement de 1 240 EUR traite pour Marie Stellaire", time: "Il y a 23 min", icon: DollarSign, color: "text-amber-400" },
                  { text: "Nouvel article publie par Pierre Ecrivain", time: "Il y a 45 min", icon: FileText, color: "text-sky-400" },
                  { text: "Nouveau podcast de Karim Ondes", time: "Il y a 1h", icon: Mic, color: "text-purple-400" },
                  { text: "Signalement recu sur un contenu video", time: "Il y a 2h", icon: AlertTriangle, color: "text-red-400" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <item.icon className={`h-4 w-4 ${item.color} shrink-0`} />
                    <p className="text-sm text-white/70 flex-1">{item.text}</p>
                    <span className="text-xs text-white/30 whitespace-nowrap">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-4" id="users">
          <Card className="bg-slate-900/60 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                Gestion des utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-3 text-white/40 font-medium">Nom</th>
                      <th className="text-left py-3 px-3 text-white/40 font-medium">Email</th>
                      <th className="text-left py-3 px-3 text-white/40 font-medium">{"Rôle"}</th>
                      <th className="text-left py-3 px-3 text-white/40 font-medium">Statut</th>
                      <th className="text-left py-3 px-3 text-white/40 font-medium">Inscription</th>
                      <th className="text-right py-3 px-3 text-white/40 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_USERS.map((u) => (
                      <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="py-3 px-3 text-white font-medium">{u.name}</td>
                        <td className="py-3 px-3 text-white/50">{u.email}</td>
                        <td className="py-3 px-3">
                          <Badge
                            variant="outline"
                            className={
                              u.role === "Porteur" ? "border-red-500/40 text-red-400" :
                              u.role === "Infoporteur" ? "border-sky-500/40 text-sky-400" :
                              u.role === "Podcasteur" ? "border-purple-500/40 text-purple-400" :
                              u.role === "Investisseur" ? "border-emerald-500/40 text-emerald-400" :
                              "border-white/20 text-white/50"
                            }
                          >
                            {u.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-3">
                          {u.status === "active" ? (
                            <span className="flex items-center gap-1.5 text-emerald-400 text-xs">
                              <CheckCircle className="h-3.5 w-3.5" /> Actif
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-red-400 text-xs">
                              <Ban className="h-3.5 w-3.5" /> Suspendu
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-white/40">{u.joined}</td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" className="text-white/40 hover:text-white h-8" title="Voir le profil">
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost" size="sm"
                              className="text-amber-400/60 hover:text-amber-400 hover:bg-amber-500/10 h-8"
                              title="Envoyer un avertissement"
                              onClick={async () => {
                                await fetch("/api/admin/secure-action", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ email: user?.email, action: "moderate_content", payload: { decision: "warn", targetUser: u.id } }),
                                })
                              }}
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                            </Button>
                            {u.status === "active" ? (
                              <Button
                                variant="ghost" size="sm"
                                className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10 h-8"
                                title="Suspendre le compte"
                                onClick={async () => {
                                  await fetch("/api/admin/secure-action", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ email: user?.email, action: "moderate_content", payload: { decision: "suspend_account", targetUser: u.id } }),
                                  })
                                }}
                              >
                                <Ban className="h-3.5 w-3.5" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost" size="sm"
                                className="text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-500/10 h-8"
                                title="R\u00e9activer le compte"
                                onClick={async () => {
                                  await fetch("/api/admin/secure-action", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ email: user?.email, action: "moderate_content", payload: { decision: "reactivate", targetUser: u.id } }),
                                  })
                                }}
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payouts Tab */}
      {activeTab === "payouts" && (
        <div className="space-y-4" id="payouts">
          <Card className="bg-slate-900/60 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-amber-400" />
                Gestion des paiements
              </CardTitle>
              <Button
                size="sm"
                className="bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30"
                onClick={async () => {
                  await fetch("/api/admin/secure-action", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: user?.email, action: "execute_payout", payload: { batchId: "batch-001" } }),
                  })
                }}
              >
                {"Exécuter les paiements"}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-3 text-white/40 font-medium">{"Créateur"}</th>
                      <th className="text-left py-3 px-3 text-white/40 font-medium">Type</th>
                      <th className="text-right py-3 px-3 text-white/40 font-medium">Montant</th>
                      <th className="text-left py-3 px-3 text-white/40 font-medium">Statut</th>
                      <th className="text-left py-3 px-3 text-white/40 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_PAYOUTS.map((p) => (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="py-3 px-3 text-white font-medium">{p.creator}</td>
                        <td className="py-3 px-3">
                          <Badge variant="outline" className="border-white/20 text-white/50">{p.type}</Badge>
                        </td>
                        <td className="py-3 px-3 text-right text-white font-mono">{p.amount.toLocaleString()} EUR</td>
                        <td className="py-3 px-3">
                          {p.status === "pending" ? (
                            <span className="flex items-center gap-1.5 text-amber-400 text-xs">
                              <Clock className="h-3.5 w-3.5" /> En attente
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-emerald-400 text-xs">
                              <CheckCircle className="h-3.5 w-3.5" /> {"Traité"}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-white/40">{p.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reports Tab - Full Moderation Pipeline */}
      {activeTab === "reports" && (
        <div className="space-y-4" id="reports">
          {/* Moderation summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "En attente", count: MOCK_REPORTS.filter(r => r.status === "pending").length, color: "text-red-400", bg: "bg-red-500/15", dot: "bg-red-400" },
              { label: "En cours", count: MOCK_REPORTS.filter(r => r.status === "reviewed").length, color: "text-amber-400", bg: "bg-amber-500/15", dot: "bg-amber-400" },
              { label: "R\u00e9solus", count: MOCK_REPORTS.filter(r => r.status === "resolved").length, color: "text-emerald-400", bg: "bg-emerald-500/15", dot: "bg-emerald-400" },
              { label: "Critiques", count: MOCK_REPORTS.filter(r => REPORT_CATEGORY_LABELS[r.category]?.severity === "critical").length, color: "text-red-500", bg: "bg-red-600/15", dot: "bg-red-500" },
            ].map((s) => (
              <Card key={s.label} className="bg-slate-900/60 border-white/10">
                <CardContent className="p-4 flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${s.dot}`} />
                  <div>
                    <p className={`text-xl font-bold ${s.color}`}>{s.count}</p>
                    <p className="text-xs text-white/40">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Reports list with full moderation actions */}
          <Card className="bg-slate-900/60 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-400" />
                {"Signalements -- Mod\u00e9ration compl\u00e8te"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_REPORTS.map((r) => {
                  const catInfo = REPORT_CATEGORY_LABELS[r.category] || { label: r.category, severity: "low" }
                  const severityColors = {
                    critical: "border-red-500/30 bg-red-500/5",
                    high: "border-orange-500/20 bg-orange-500/5",
                    medium: "border-amber-500/15 bg-amber-500/5",
                    low: "border-white/5 bg-white/[0.02]",
                  }
                  const severityBadge = {
                    critical: "bg-red-500/20 text-red-400 border-red-500/40",
                    high: "bg-orange-500/20 text-orange-400 border-orange-500/40",
                    medium: "bg-amber-500/20 text-amber-400 border-amber-500/40",
                    low: "bg-white/10 text-white/50 border-white/20",
                  }

                  return (
                    <div key={r.id} className={`p-4 rounded-xl border ${severityColors[catInfo.severity]}`}>
                      {/* Report header */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${
                          r.status === "pending" ? "bg-red-400 animate-pulse" :
                          r.status === "reviewed" ? "bg-amber-400" :
                          "bg-emerald-400"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <p className="text-sm text-white font-medium">{r.contentTitle}</p>
                            <Badge variant="outline" className={`text-[10px] ${severityBadge[catInfo.severity]}`}>
                              {catInfo.label}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={
                                r.status === "pending" ? "border-red-500/40 text-red-400 text-[10px]" :
                                r.status === "reviewed" ? "border-amber-500/40 text-amber-400 text-[10px]" :
                                "border-emerald-500/40 text-emerald-400 text-[10px]"
                              }
                            >
                              {r.status === "pending" ? "En attente" : r.status === "reviewed" ? "En cours" : "R\u00e9solu"}
                            </Badge>
                          </div>
                          <p className="text-xs text-white/40">
                            {"Signal\u00e9 par "}{r.reporter}{" -- Auteur : "}{r.author}{" -- "}{r.date}
                          </p>
                          <p className="text-xs text-white/50 mt-1 italic">{"\u00ab\u00a0"}{r.reason}{"\u00a0\u00bb"}</p>
                        </div>
                      </div>

                      {/* Moderation actions -- full pipeline */}
                      {r.status === "pending" && (
                        <div className="flex flex-wrap items-center gap-2 ml-5.5 pt-3 border-t border-white/5">
                          {/* Approve (false alarm) */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2.5 text-xs text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                            title="Approuver (fausse alerte)"
                            onClick={async () => {
                              await fetch("/api/admin/secure-action", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ email: user?.email, action: "moderate_content", payload: { contentId: r.id, decision: "approved" } }),
                              })
                            }}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approuver
                          </Button>

                          {/* Warn user */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2.5 text-xs text-amber-400 hover:bg-amber-500/20 border border-amber-500/20"
                            title="Envoyer un avertissement"
                            onClick={async () => {
                              await fetch("/api/admin/secure-action", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ email: user?.email, action: "moderate_content", payload: { contentId: r.id, decision: "warn", targetUser: r.author } }),
                              })
                            }}
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            Avertir
                          </Button>

                          {/* Delete content */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2.5 text-xs text-orange-400 hover:bg-orange-500/20 border border-orange-500/20"
                            title="Supprimer le contenu"
                            onClick={async () => {
                              await fetch("/api/admin/secure-action", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ email: user?.email, action: "moderate_content", payload: { contentId: r.id, decision: "delete_content" } }),
                              })
                            }}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Supprimer contenu
                          </Button>

                          {/* Suspend account */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2.5 text-xs text-red-400 hover:bg-red-500/20 border border-red-500/20"
                            title="Suspendre le compte"
                            onClick={async () => {
                              await fetch("/api/admin/secure-action", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ email: user?.email, action: "moderate_content", payload: { contentId: r.id, decision: "suspend_account", targetUser: r.author } }),
                              })
                            }}
                          >
                            <Ban className="h-3 w-3 mr-1" />
                            Suspendre
                          </Button>

                          {/* Ban account */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2.5 text-xs text-red-500 hover:bg-red-600/20 border border-red-600/20"
                            title="Supprimer le compte d\u00e9finitivement"
                            onClick={async () => {
                              await fetch("/api/admin/secure-action", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ email: user?.email, action: "moderate_content", payload: { contentId: r.id, decision: "ban_account", targetUser: r.author } }),
                              })
                            }}
                          >
                            <UserX className="h-3 w-3 mr-1" />
                            Supprimer compte
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Moderation guidelines reminder */}
          <Card className="bg-emerald-500/5 border-emerald-500/15">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertOctagon className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-emerald-400 font-medium text-sm">{"Rappel -- Charte de mod\u00e9ration VISUAL"}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-white/50">{"Signalements critiques (racisme, homophobie, antis\u00e9mitisme) : traitement prioritaire sous 24h."}</div>
                    <div className="text-white/50">{"Pipeline : Signalement > Examen > D\u00e9cision (approuver / avertir / supprimer contenu / suspendre / bannir)."}</div>
                    <div className="text-white/50">{"L'avertissement rappelle les r\u00e8gles de respect et de courtoisie entre utilisateurs."}</div>
                    <div className="text-white/50">{"La suspension temporaire bloque le compte de 7 \u00e0 90 jours. La suppression est d\u00e9finitive."}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Timestamp */}
      {stats?.timestamp && (
        <p className="text-xs text-white/20 mt-8 text-right">
          {"Dernière actualisation :"} {new Date(stats.timestamp).toLocaleString("fr-FR")}
        </p>
      )}
    </div>
  )
}
