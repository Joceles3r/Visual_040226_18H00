"use client"

import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Shield,
  Clock,
  Check,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"

const MOCK_WALLET = {
  available: 127.5,
  pending: 45.0,
  caution: {
    porter: { paid: false, amount: 10 },
    investor: { paid: true, amount: 20 },
  },
  stripeStatus: "not_started" as "not_started" | "pending" | "verified",
}

export default function WalletPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Mon Wallet</h1>
        <p className="text-white/60">Gérez vos gains et retirez votre argent</p>
      </div>

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
                  {MOCK_WALLET.available.toFixed(2)}€
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
                  {MOCK_WALLET.pending.toFixed(2)}€
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
                  +{(MOCK_WALLET.available + MOCK_WALLET.pending).toFixed(2)}€
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
            {MOCK_WALLET.stripeStatus === "verified" ? (
              <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <Check className="h-6 w-6 text-emerald-400" />
                <div>
                  <p className="font-medium text-emerald-400">Compte vérifié</p>
                  <p className="text-sm text-white/60">
                    Vous pouvez retirer vos gains
                  </p>
                </div>
              </div>
            ) : MOCK_WALLET.stripeStatus === "pending" ? (
              <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <Clock className="h-6 w-6 text-amber-400" />
                <div>
                  <p className="font-medium text-amber-400">
                    Vérification en cours
                  </p>
                  <p className="text-sm text-white/60">
                    Votre compte est en cours de vérification
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg">
                <AlertCircle className="h-6 w-6 text-white/40" />
                <div>
                  <p className="font-medium text-white">Compte non connecté</p>
                  <p className="text-sm text-white/60">
                    Connectez Stripe pour retirer vos gains
                  </p>
                </div>
              </div>
            )}

            {MOCK_WALLET.stripeStatus !== "verified" && (
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white">
                {MOCK_WALLET.stripeStatus === "pending"
                  ? "Reprendre la vérification"
                  : "Connecter Stripe"}
              </Button>
            )}

            {MOCK_WALLET.stripeStatus === "verified" && (
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white">
                Demander un retrait
              </Button>
            )}

            <p className="text-xs text-white/40 text-center">
              Vérification d'identité requise pour recevoir un paiement. Retraits
              traités chaque semaine.
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
              La caution garantit votre engagement sur VISUAL. Elle est
              remboursable en cas de résiliation.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {MOCK_WALLET.caution.investor.paid ? (
                    <Check className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-white/40" />
                  )}
                  <div>
                    <p className="text-white font-medium">Caution Investisseur</p>
                    <p className="text-xs text-white/40">
                      {MOCK_WALLET.caution.investor.amount}€
                    </p>
                  </div>
                </div>
                {MOCK_WALLET.caution.investor.paid ? (
                  <span className="text-emerald-400 text-sm">Payée</span>
                ) : (
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    Payer
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {MOCK_WALLET.caution.porter.paid ? (
                    <Check className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-white/40" />
                  )}
                  <div>
                    <p className="text-white font-medium">Caution Créateur</p>
                    <p className="text-xs text-white/40">
                      {MOCK_WALLET.caution.porter.amount}€
                    </p>
                  </div>
                </div>
                {MOCK_WALLET.caution.porter.paid ? (
                  <span className="text-emerald-400 text-sm">Payée</span>
                ) : (
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    Payer
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Dernières transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                type: "return",
                description: "Retour - L'Odyssée des Étoiles",
                amount: 2.5,
                date: "01/02/2026",
              },
              {
                type: "investment",
                description: "Investissement - Contes de Minuit",
                amount: -10,
                date: "28/01/2026",
              },
              {
                type: "return",
                description: "Retour - Murmures de la Forêt",
                amount: 4.8,
                date: "25/01/2026",
              },
              {
                type: "withdrawal",
                description: "Retrait bancaire",
                amount: -50,
                date: "20/01/2026",
              },
            ].map((tx, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tx.amount >= 0 ? "bg-emerald-500/20" : "bg-slate-700"
                    }`}
                  >
                    {tx.amount >= 0 ? (
                      <ArrowDownRight className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-white/60" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">{tx.description}</p>
                    <p className="text-xs text-white/40">{tx.date}</p>
                  </div>
                </div>
                <span
                  className={`font-semibold ${
                    tx.amount >= 0 ? "text-emerald-400" : "text-white"
                  }`}
                >
                  {tx.amount >= 0 ? "+" : ""}
                  {tx.amount.toFixed(2)}€
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
