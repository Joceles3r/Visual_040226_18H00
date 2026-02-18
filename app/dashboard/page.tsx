"use client"

import Link from "next/link"
import {
  Star,
  Heart,
  Film,
  FileText,
  Mic,
  Wallet,
  TrendingUp,
  Upload,
  ArrowRight,
  Compass,
  AlertCircle,
  CreditCard,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { MOCK_INVESTMENTS, MOCK_TRANSACTIONS } from "@/lib/mock-data"

export default function DashboardPage() {
  const { user, roles, isAuthed } = useAuth()

  if (!isAuthed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
          <Compass className="h-8 w-8 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">
          Connectez-vous pour accéder à votre espace
        </h1>
        <p className="text-white/60 mb-8 max-w-md">
          Créez un compte ou connectez-vous pour accéder à toutes les
          fonctionnalités de VISUAL
        </p>
        <div className="flex gap-4">
          <Link href="/login">
            <Button
              variant="outline"
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              Se connecter
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white">
              Créer un compte
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const isVisitor = roles.includes("visitor")
  const isPorter = roles.includes("porter")
  const isInvestor = roles.includes("investor")
  const isInfoporter = roles.includes("infoporter")
  const isInvestireader = roles.includes("investireader")
  const isPodcaster = roles.includes("podcaster")
  const isListener = roles.includes("listener")
  const hasCreatorRole = isPorter || isInfoporter || isPodcaster
  const hasInvestorRole = isInvestor || isInvestireader || isListener

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Bienvenue, {user?.name || "Utilisateur"}
        </h1>
        <p className="text-white/60">
          Voici un aperçu de votre activité sur VISUAL
        </p>
      </div>

      {/* Stripe Connect Banner */}
      {(hasInvestorRole || hasCreatorRole) &&
        user?.stripeConnect?.status !== "verified" && (
          <Card className="bg-gradient-to-r from-[#635BFF]/10 to-[#635BFF]/5 border-[#635BFF]/30">
            <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#635BFF]/20 flex items-center justify-center shrink-0">
                  <CreditCard className="h-5 w-5 text-[#635BFF]" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    {user?.stripeConnect?.status === "pending"
                      ? "Verification Stripe en cours"
                      : "Connectez Stripe pour retirer vos gains"}
                  </p>
                  <p className="text-white/50 text-xs">
                    {"Vérification d'identité requise pour recevoir des paiements. Retraits traités chaque semaine."}
                  </p>
                </div>
              </div>
              <Link href="/dashboard/wallet" className="shrink-0">
                <Button
                  size="sm"
                  className="bg-[#635BFF] hover:bg-[#5851DB] text-white"
                >
                  {user?.stripeConnect?.status === "pending"
                    ? "Reprendre"
                    : "Connecter Stripe"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

      {/* Caution Reminder */}
      {hasCreatorRole &&
        user?.depositStatus &&
        ((!user.depositStatus.porter10 && isPorter) ||
          (!user.depositStatus.infoporter10 && isInfoporter) ||
          (!user.depositStatus.podcaster10 && isPodcaster)) && (
          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                  <Shield className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    {"Caution créateur requise"}
                  </p>
                  <p className="text-white/50 text-xs">
                    {"Payez votre caution de 10€ pour pouvoir publier vos contenus. Remboursable en cas de résiliation."}
                  </p>
                </div>
              </div>
              <Link href="/dashboard/wallet" className="shrink-0">
                <Button
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-500 text-white"
                >
                  {"Payer la caution"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* VISUpoints - for all */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Star className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">VISUpoints</p>
                <p className="text-2xl font-bold text-white">
                  {user?.visupoints || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Favorites */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                <Heart className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Favoris</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investments or Projects count based on role */}
        {hasInvestorRole && (
          <Card className="bg-slate-900/50 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Investissements</p>
                  <p className="text-2xl font-bold text-white">
                    {MOCK_INVESTMENTS.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {hasCreatorRole && (
          <Card className="bg-slate-900/50 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-sky-500/20 flex items-center justify-center">
                  <Film className="h-6 w-6 text-sky-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Mes projets</p>
                  <p className="text-2xl font-bold text-white">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Wallet */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-teal-500/20 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-teal-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Solde</p>
                <p className="text-2xl font-bold text-white">
                  {(user?.wallet?.available || 0).toFixed(2)}€
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/explore">
          <Card className="bg-slate-900/50 border-white/10 hover:border-emerald-500/50 transition-colors cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Compass className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">Explorer</h3>
                <p className="text-sm text-white/60">
                  Découvrez de nouveaux projets
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-white/40" />
            </CardContent>
          </Card>
        </Link>

        {isPorter && (
          <Link href="/upload">
            <Card className="bg-slate-900/50 border-white/10 hover:border-red-500/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">Déposer une vidéo</h3>
                  <p className="text-sm text-white/60">
                    Publiez votre contenu audiovisuel
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-white/40" />
              </CardContent>
            </Card>
          </Link>
        )}

        {isInfoporter && (
          <Link href="/upload/text">
            <Card className="bg-slate-900/50 border-white/10 hover:border-amber-500/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{"Déposer un écrit"}</h3>
                  <p className="text-sm text-white/60">
                    {"Publiez votre contenu littéraire"}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-white/40" />
              </CardContent>
            </Card>
          </Link>
        )}

        {isPodcaster && (
          <Link href="/upload/podcast">
            <Card className="bg-slate-900/50 border-white/10 hover:border-purple-500/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Mic className="h-6 w-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{"Déposer un podcast"}</h3>
                  <p className="text-sm text-white/60">
                    {"Publiez vos épisodes audio"}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-white/40" />
              </CardContent>
            </Card>
          </Link>
        )}

        {hasInvestorRole && (
          <Link href="/dashboard/wallet">
            <Card className="bg-slate-900/50 border-white/10 hover:border-teal-500/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-teal-500/20 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-teal-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{"Accéder à mon wallet"}</h3>
                  <p className="text-sm text-white/60">
                    {"Gérez vos gains et retraits Stripe"}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-white/40" />
              </CardContent>
            </Card>
          </Link>
        )}

        {!hasCreatorRole && !hasInvestorRole && (
          <Link href="/dashboard/settings">
            <Card className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border-emerald-500/30 hover:border-emerald-500/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">
                    Passer au niveau supérieur
                  </h3>
                  <p className="text-sm text-white/60">
                    Devenez créateur ou investisseur
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-white/40" />
              </CardContent>
            </Card>
          </Link>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investments */}
        {hasInvestorRole && MOCK_INVESTMENTS.length > 0 && (
          <Card className="bg-slate-900/50 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">
                Derniers investissements
              </CardTitle>
              <Link href="/dashboard/investments">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-600/20"
                >
                  Voir tout
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {MOCK_INVESTMENTS.slice(0, 3).map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      inv.contentType === "video"
                        ? "bg-red-500/20"
                        : inv.contentType === "podcast"
                          ? "bg-purple-500/20"
                          : "bg-amber-500/20"
                    }`}
                  >
                    {inv.contentType === "video" ? (
                      <Film className="h-5 w-5 text-red-400" />
                    ) : inv.contentType === "podcast" ? (
                      <Mic className="h-5 w-5 text-purple-400" />
                    ) : (
                      <FileText className="h-5 w-5 text-amber-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{inv.contentTitle}</p>
                    <p className="text-sm text-white/60">{inv.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{inv.amount}€</p>
                    <p className="text-sm text-emerald-400">
                      +{inv.returns.toFixed(2)}€
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Recent transactions */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Activité récente</CardTitle>
            <Link href="/dashboard/history">
              <Button
                variant="ghost"
                size="sm"
                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-600/20"
              >
                Voir tout
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_TRANSACTIONS.slice(0, 4).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
              >
                <div>
                  <p className="text-sm text-white">{tx.description}</p>
                  <p className="text-xs text-white/40">{tx.date}</p>
                </div>
                <span
                  className={`font-medium ${
                    tx.amount >= 0 ? "text-emerald-400" : "text-white"
                  }`}
                >
                  {tx.amount >= 0 ? "+" : ""}
                  {tx.amount.toFixed(2)}€
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* VISUpoints Progress (for visitors) */}
      {isVisitor && (
        <Card className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-400" />
              Progression VISUpoints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Niveau actuel</span>
                <span className="text-amber-400 font-medium">Bronze</span>
              </div>
              <Progress value={30} className="h-2 bg-slate-800" />
              <div className="flex justify-between text-sm">
                <span className="text-white/60">
                  {user?.visupoints || 0} / 500 points
                </span>
                <span className="text-white/40">Prochain: Argent</span>
              </div>
              <Link href="/dashboard/visupoints">
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-amber-500/50 text-amber-400 hover:bg-amber-600/20"
                >
                  Gagner plus de points
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
