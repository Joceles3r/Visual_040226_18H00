"use client"

import { useState, useCallback } from "react"
import useSWR from "swr"
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Shield,
  Clock,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { CAUTION_EUR, STRIPE_CONFIG } from "@/lib/payout/constants"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function formatCents(cents: number): string {
  return (cents / 100).toFixed(2)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

const TX_TYPE_LABELS: Record<string, string> = {
  investment: "Investissement",
  return: "Retour de gain",
  caution: "Caution",
  caution_refund: "Remboursement caution",
  withdrawal: "Retrait bancaire",
  visupoints_conversion: "Conversion VISUpoints",
  article_sale: "Vente d'article",
}

export default function WalletPage() {
  const { user } = useAuth()
  const [connectLoading, setConnectLoading] = useState(false)
  const [cautionLoading, setCautionLoading] = useState<string | null>(null)
  const [withdrawLoading, setWithdrawLoading] = useState(false)

  const { data, error, mutate } = useSWR(
    user ? `/api/wallet?userId=${user.id}` : null,
    fetcher,
    { refreshInterval: 30000 }
  )

  const handleConnectStripe = useCallback(async () => {
    if (!user) return
    setConnectLoading(true)
    try {
      const res = await fetch("/api/stripe/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      })
      const result = await res.json()
      if (result.url) {
        window.open(result.url, "_blank")
      }
      mutate()
    } catch (err) {
      console.error("Connect error:", err)
    } finally {
      setConnectLoading(false)
    }
  }, [user, mutate])

  const handlePayCaution = useCallback(
    async (cautionType: "creator" | "investor") => {
      if (!user) return
      setCautionLoading(cautionType)
      try {
        const res = await fetch("/api/stripe/caution", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, cautionType }),
        })
        const result = await res.json()
        if (result.error) {
          alert(result.error)
        } else {
          alert(
            `Caution ${cautionType === "creator" ? "Createur" : "Investisseur"} : Payment Intent cree. En production, le formulaire de paiement Stripe s'affichera ici.`
          )
          mutate()
        }
      } catch (err) {
        console.error("Caution error:", err)
      } finally {
        setCautionLoading(null)
      }
    },
    [user, mutate]
  )

  const handleWithdraw = useCallback(async () => {
    if (!user || !data?.wallet) return
    const available = data.wallet.availableCents as number
    if (available < STRIPE_CONFIG.minWithdrawCents) {
      alert(`Solde insuffisant. Minimum de retrait : ${STRIPE_CONFIG.minWithdrawCents / 100} EUR`)
      return
    }
    setWithdrawLoading(true)
    try {
      const res = await fetch("/api/stripe/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, amountCents: available }),
      })
      const result = await res.json()
      if (result.error) {
        alert(result.error)
      } else {
        alert(`Retrait de ${formatCents(available)} EUR effectue avec succes.`)
        mutate()
      }
    } catch (err) {
      console.error("Withdraw error:", err)
    } finally {
      setWithdrawLoading(false)
    }
  }, [user, data, mutate])

  const wallet = data?.wallet || {
    availableCents: 0,
    pendingCents: 0,
    totalEarnedCents: 0,
    totalWithdrawnCents: 0,
  }
  const transactions = data?.transactions || []
  const stripeConnect = data?.stripeConnect || {
    status: "not_started",
    chargesEnabled: false,
    payoutsEnabled: false,
    hasAccount: false,
  }

  const isLoading = !data && !error

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Mon Wallet</h1>
        <p className="text-white/60">
          Gerez vos gains et retirez votre argent
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          <span className="ml-3 text-white/60">Chargement du wallet...</span>
        </div>
      )}

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Solde disponible</p>
                <p className="text-3xl font-bold text-white">
                  {formatCents(wallet.availableCents)}{"€"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">En attente</p>
                <p className="text-2xl font-bold text-white">
                  {formatCents(wallet.pendingCents)}{"€"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-sky-500/20 flex items-center justify-center">
                <ArrowUpRight className="h-6 w-6 text-sky-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Total gains</p>
                <p className="text-2xl font-bold text-emerald-400">
                  +{formatCents(wallet.totalEarnedCents)}{"€"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stripe Connect */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-400" />
              Stripe Connect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stripeConnect.status === "verified" ? (
              <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <Check className="h-6 w-6 text-emerald-400" />
                <div>
                  <p className="font-medium text-emerald-400">
                    Compte verifie
                  </p>
                  <p className="text-sm text-white/60">
                    Vous pouvez retirer vos gains
                  </p>
                </div>
              </div>
            ) : stripeConnect.status === "pending" ? (
              <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <Clock className="h-6 w-6 text-amber-400" />
                <div>
                  <p className="font-medium text-amber-400">
                    Verification en cours
                  </p>
                  <p className="text-sm text-white/60">
                    Votre compte est en cours de verification
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg">
                <AlertCircle className="h-6 w-6 text-white/40" />
                <div>
                  <p className="font-medium text-white">
                    Compte non connecte
                  </p>
                  <p className="text-sm text-white/60">
                    Connectez Stripe pour retirer vos gains
                  </p>
                </div>
              </div>
            )}

            {stripeConnect.status !== "verified" && (
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                onClick={handleConnectStripe}
                disabled={connectLoading}
              >
                {connectLoading && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                {stripeConnect.status === "pending"
                  ? "Reprendre la verification"
                  : "Connecter Stripe"}
              </Button>
            )}

            {stripeConnect.status === "verified" && (
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                onClick={handleWithdraw}
                disabled={
                  withdrawLoading ||
                  wallet.availableCents < STRIPE_CONFIG.minWithdrawCents
                }
              >
                {withdrawLoading && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                Demander un retrait
              </Button>
            )}

            <p className="text-xs text-white/40 text-center">
              {"Verification d'identite requise pour recevoir un paiement. Retraits traites sous "}
              {STRIPE_CONFIG.withdrawProcessingDays}
              {" jours."}
            </p>
          </CardContent>
        </Card>

        {/* Caution */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-400" />
              Caution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white/60 text-sm">
              {
                "La caution garantit votre engagement sur VISUAL. Elle est remboursable en cas de resiliation."
              }
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-white/40" />
                  <div>
                    <p className="text-white font-medium">
                      Caution Investisseur
                    </p>
                    <p className="text-xs text-white/40">
                      {CAUTION_EUR.investor}{"€"}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white"
                  onClick={() => handlePayCaution("investor")}
                  disabled={cautionLoading === "investor"}
                >
                  {cautionLoading === "investor" && (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  )}
                  Payer
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-white/40" />
                  <div>
                    <p className="text-white font-medium">
                      Caution Createur
                    </p>
                    <p className="text-xs text-white/40">
                      {CAUTION_EUR.creator}{"€"}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white"
                  onClick={() => handlePayCaution("creator")}
                  disabled={cautionLoading === "creator"}
                >
                  {cautionLoading === "creator" && (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  )}
                  Payer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Dernieres transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-center text-white/40 py-8">
              Aucune transaction pour le moment
            </p>
          ) : (
            <div className="space-y-3">
              {transactions.map(
                (tx: {
                  id: string
                  type: string
                  amountCents: number
                  description: string
                  status: string
                  createdAt: string
                }) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          tx.amountCents >= 0
                            ? "bg-emerald-500/20"
                            : "bg-slate-700"
                        }`}
                      >
                        {tx.amountCents >= 0 ? (
                          <ArrowDownRight className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-white/60" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {tx.description ||
                            TX_TYPE_LABELS[tx.type] ||
                            tx.type}
                        </p>
                        <p className="text-xs text-white/40">
                          {formatDate(tx.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-semibold ${
                        tx.amountCents >= 0
                          ? "text-emerald-400"
                          : "text-white"
                      }`}
                    >
                      {tx.amountCents >= 0 ? "+" : ""}
                      {formatCents(tx.amountCents)}{"€"}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
