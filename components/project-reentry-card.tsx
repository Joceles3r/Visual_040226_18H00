"use client"

/**
 * Project Reentry Card Component
 * 
 * Affiche l'encadre UX pour la reintegration prioritaire d'un projet.
 * Visible sur: page projet, page resultats, page categorie.
 */

import { useState, useEffect } from "react"
import { RefreshCw, Clock, CreditCard, AlertCircle, CheckCircle, XCircle, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { REINTEGRATION_CONFIG, formatWindowTimeRemaining } from "@/lib/ranking/reintegration"

interface ReentryStatus {
  eligible: boolean
  reason?: string
  windowExpiresAt?: string
  minutesRemaining?: number
  price?: string
  priceCents?: number
  message?: string
  isWinner?: boolean
  alreadyPaid?: boolean
  expired?: boolean
}

interface ProjectReentryCardProps {
  projectId: string
  projectTitle: string
  onReentrySuccess?: () => void
}

export function ProjectReentryCard({ projectId, projectTitle, onReentrySuccess }: ProjectReentryCardProps) {
  const [status, setStatus] = useState<ReentryStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<string>("")

  // Charger le statut de reintegration
  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch(`/api/projects/${projectId}/reentry`)
        const data = await res.json()
        setStatus(data)
        
        if (data.windowExpiresAt) {
          setTimeRemaining(formatWindowTimeRemaining(new Date(data.windowExpiresAt)))
        }
      } catch {
        setError("Erreur de chargement")
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
  }, [projectId])

  // Mettre a jour le compte a rebours
  useEffect(() => {
    if (!status?.windowExpiresAt) return

    const interval = setInterval(() => {
      const remaining = formatWindowTimeRemaining(new Date(status.windowExpiresAt!))
      setTimeRemaining(remaining)
      
      if (remaining === "Fermee") {
        setStatus(prev => prev ? { ...prev, eligible: false, expired: true } : null)
      }
    }, 10000) // Toutes les 10 secondes

    return () => clearInterval(interval)
  }, [status?.windowExpiresAt])

  // Demander la reintegration
  async function handleReentry() {
    setProcessing(true)
    setError(null)

    try {
      const res = await fetch(`/api/projects/${projectId}/reentry`, { method: "POST" })
      const data = await res.json()

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        setError(data.error || "Erreur lors de la demande")
      }
    } catch {
      setError("Erreur de connexion")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <Card className="bg-slate-900/50 border-white/10 animate-pulse">
        <CardContent className="p-6">
          <div className="h-20 bg-white/5 rounded" />
        </CardContent>
      </Card>
    )
  }

  // Si gagnant TOP 10
  if (status?.isWinner) {
    return (
      <Card className="bg-amber-500/10 border-amber-500/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
              <Crown className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-400">Votre projet fait partie des gagnants</h3>
              <p className="text-white/60 text-sm mt-1">
                {"Felicitations ! La reintegration n'est pas applicable aux projets du TOP 10."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Si deja paye
  if (status?.alreadyPaid) {
    return (
      <Card className="bg-emerald-500/10 border-emerald-500/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <CheckCircle className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-emerald-400">Reintegration activee</h3>
              <p className="text-white/60 text-sm mt-1">
                {"Votre projet a ete represente avec succes et sera prioritaire dans la prochaine selection."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Si expire
  if (status?.expired) {
    return (
      <Card className="bg-slate-900/50 border-white/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
              <XCircle className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-400">Delai de reintegration expire</h3>
              <p className="text-white/60 text-sm mt-1">
                {"Le delai d'une heure pour representer votre projet est expire. Vous pouvez deposer un nouveau projet selon les regles normales."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Si eligible
  if (status?.eligible) {
    return (
      <Card className="bg-gradient-to-br from-purple-500/10 to-indigo-600/10 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
              <RefreshCw className="h-6 w-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-purple-400">
                Votre projet peut revenir immediatement en competition
              </h3>
              <p className="text-white/60 text-sm mt-1 mb-4">
                {"Si votre projet ne fait pas partie du TOP 10, vous disposez d'1 heure apres la cloture pour le relancer en priorite."}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="bg-black/20 rounded-lg p-3 text-center">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
                  <p className="text-xs text-white/50">Acces prioritaire</p>
                  <p className="text-sm text-white/80 font-medium">Prochaine selection</p>
                </div>
                <div className="bg-black/20 rounded-lg p-3 text-center">
                  <CreditCard className="h-5 w-5 text-amber-400 mx-auto mb-1" />
                  <p className="text-xs text-white/50">Activation</p>
                  <p className="text-sm text-white/80 font-medium">{REINTEGRATION_CONFIG.priceDisplay}</p>
                </div>
                <div className="bg-black/20 rounded-lg p-3 text-center">
                  <Clock className="h-5 w-5 text-red-400 mx-auto mb-1" />
                  <p className="text-xs text-white/50">Temps restant</p>
                  <p className="text-sm text-white/80 font-medium">{timeRemaining || `${status.minutesRemaining} min`}</p>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm mb-3">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button
                onClick={handleReentry}
                disabled={processing}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-semibold"
              >
                {processing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Redirection...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Relancer mon projet ({REINTEGRATION_CONFIG.priceDisplay})
                  </>
                )}
              </Button>

              <p className="text-white/30 text-xs text-center mt-3">
                {"Une fois ce delai expire, la priorite disparait."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Non eligible (pas de session terminee ou autre raison)
  return null
}
