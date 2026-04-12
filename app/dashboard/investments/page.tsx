"use client"

import Link from "next/link"
import { TrendingUp, Film, FileText, Mic, ArrowUpRight, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

// Donnees reelles - etat vide par defaut
interface Investment {
  id: string
  contentId?: string
  contentTitle: string
  contentType: "video" | "text" | "podcast"
  amount: number
  returns: number
  status: "active" | "completed" | "refunded"
  date: string
}

function InvestmentsContent() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const typeParam = searchParams.get("type") as "video" | "text" | "podcast" | null
  
  // TODO: Charger les vraies contributions depuis l'API
  const investments: Investment[] = []
  
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalReturns = investments.reduce((sum, inv) => sum + inv.returns, 0)
  
  // Determiner le type de contenu en fonction du role
  const userRole = user?.roles?.[0] || "contributor"
  const defaultType = userRole === "listener" ? "podcast" : userRole === "contribureader" ? "text" : "video"
  // FIX: URL param prend la priorite sur le role
  const contentType = typeParam || defaultType
  const exploreHref = `/explore?tab=${contentType}`
  const emptyMessage = userRole === "listener" 
    ? "Decouvrez les podcasts et soutenez vos preferes. Si le podcast est dans le TOP 10, vous recevez 30% du pot mensuel."
    : userRole === "contribureader"
      ? "Decouvrez les ecrits et soutenez les auteurs. Si l'auteur est dans le TOP 10, vous touchez une part des gains."
      : "Partez a la decouverte des projets video et contribuez a ceux qui vous inspirent. Vos contributions peuvent vous rapporter si le projet atteint le TOP 10."

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Mes contributions</h1>
        <p className="text-white/60">
          Suivez vos contributions et leurs performances
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900/50 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Total contribue</p>
                <p className="text-2xl font-bold text-white">{totalInvested}€</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-teal-500/20 flex items-center justify-center">
                <ArrowUpRight className="h-6 w-6 text-teal-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Retours totaux</p>
                <p className="text-2xl font-bold text-emerald-400">
                  +{totalReturns.toFixed(2)}€
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-sky-500/20 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-sky-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Projets soutenus</p>
                <p className="text-2xl font-bold text-white">
                  {MOCK_INVESTMENTS.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investments List */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Liste des contributions</CardTitle>
          <Link href="/explore">
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white">
              Explorer plus de projets
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {investments.length > 0 ? (
            <div className="space-y-4">
              {investments.map((investment) => (
                <div
                  key={investment.id}
                  className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg"
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      investment.contentType === "video"
                        ? "bg-red-500/20"
                        : investment.contentType === "podcast"
                          ? "bg-purple-500/20"
                          : "bg-amber-500/20"
                    }`}
                  >
                    {investment.contentType === "video" ? (
                      <Film className="h-6 w-6 text-red-400" />
                    ) : investment.contentType === "podcast" ? (
                      <Mic className="h-6 w-6 text-purple-400" />
                    ) : (
                      <FileText className="h-6 w-6 text-amber-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">
                        {investment.contentTitle}
                      </p>
                      <Badge
                        className={`${
                          investment.status === "active"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : investment.status === "completed"
                              ? "bg-sky-500/20 text-sky-400"
                              : "bg-red-500/20 text-red-400"
                        } border-0`}
                      >
                        {investment.status === "active"
                          ? "Actif"
                          : investment.status === "completed"
                            ? "Terminé"
                            : "Remboursé"}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/60">
                      Investi le {investment.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{investment.amount}€</p>
                    <p className="text-sm text-emerald-400">
                      +{investment.returns.toFixed(2)}€
                    </p>
                  </div>
                  <Link href={`/video/${investment.contentId}`} onClick={(e) => {
                    if (!investment.contentId) e.preventDefault()
                  }}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-white/20 text-white hover:bg-white/10"
                      disabled={!investment.contentId}
                    >
                      Voir
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-white/5 rounded-xl">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-7 w-7 text-emerald-400/40" />
              </div>
              <p className="text-white/40 font-medium mb-2">Aucune contribution realisee</p>
              <p className="text-white/25 text-sm mb-5 max-w-sm mx-auto">
                {emptyMessage}
              </p>
              <Link href={exploreHref}>
                <Button className="bg-emerald-600 hover:bg-emerald-500">
                  Explorer les projets {contentType === "podcast" ? "podcasts" : contentType === "text" ? "ecrits" : "video"}
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function InvestmentsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <InvestmentsContent />
    </Suspense>
  )
}
