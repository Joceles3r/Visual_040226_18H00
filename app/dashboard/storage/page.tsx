"use client"

import { useState } from "react"
import {
  HardDrive,
  Cloud,
  Zap,
  Check,
  ArrowRight,
  FileVideo,
  FileText,
  Music,
  Loader2,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"

// Constantes de stockage
const STORAGE_CONFIG = {
  free: {
    name: "Gratuit",
    limitGb: 1,
    price: 0,
    features: [
      "1 Go de stockage",
      "Upload videos jusqu'a 500 Mo",
      "3 projets maximum",
      "Compression standard",
    ],
  },
  premium: {
    name: "Premium",
    limitGb: 50,
    priceEurMonth: 9.99,
    features: [
      "50 Go de stockage",
      "Upload videos jusqu'a 10 Go",
      "Projets illimites",
      "Compression haute qualite",
      "Priorite de traitement",
      "Support prioritaire",
    ],
  },
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} Go`
}

export default function StoragePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isUpgrading, setIsUpgrading] = useState(false)

  // Simulated storage data
  const storageData = {
    usedBytes: 234567890, // ~234 Mo
    limitBytes: STORAGE_CONFIG.free.limitGb * 1024 * 1024 * 1024,
    isPremium: false,
    files: {
      videos: { count: 2, bytes: 200000000 },
      texts: { count: 5, bytes: 2500000 },
      podcasts: { count: 1, bytes: 32000000 },
    },
  }

  const usagePercent = Math.round((storageData.usedBytes / storageData.limitBytes) * 100)
  const limitGb = storageData.isPremium ? STORAGE_CONFIG.premium.limitGb : STORAGE_CONFIG.free.limitGb

  const handleUpgrade = async () => {
    setIsUpgrading(true)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: "storage_premium",
          priceEurCents: Math.round(STORAGE_CONFIG.premium.priceEurMonth * 100),
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || "Erreur lors de la creation du paiement")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de proceder au paiement. Reessayez plus tard.",
        variant: "destructive",
      })
    } finally {
      setIsUpgrading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Mon stockage</h1>
        <p className="text-white/60">Gerez vos fichiers et votre espace de stockage</p>
      </div>

      {/* Current usage */}
      <Card className="bg-slate-900/60 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <HardDrive className="h-5 w-5 text-emerald-400" />
            Utilisation actuelle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">
              {formatBytes(storageData.usedBytes)} / {limitGb} Go utilises
            </span>
            <Badge variant={usagePercent > 80 ? "destructive" : "secondary"}>
              {usagePercent}%
            </Badge>
          </div>
          <Progress 
            value={usagePercent} 
            className="h-3 bg-slate-800"
          />

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <FileVideo className="h-5 w-5 text-red-400 mx-auto mb-2" />
              <p className="text-white font-medium">{storageData.files.videos.count}</p>
              <p className="text-white/50 text-xs">Videos</p>
              <p className="text-white/30 text-xs">{formatBytes(storageData.files.videos.bytes)}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <FileText className="h-5 w-5 text-amber-400 mx-auto mb-2" />
              <p className="text-white font-medium">{storageData.files.texts.count}</p>
              <p className="text-white/50 text-xs">Ecrits</p>
              <p className="text-white/30 text-xs">{formatBytes(storageData.files.texts.bytes)}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <Music className="h-5 w-5 text-purple-400 mx-auto mb-2" />
              <p className="text-white font-medium">{storageData.files.podcasts.count}</p>
              <p className="text-white/50 text-xs">Podcasts</p>
              <p className="text-white/30 text-xs">{formatBytes(storageData.files.podcasts.bytes)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Free plan */}
        <Card className={`border-2 ${!storageData.isPremium ? "border-emerald-500/50 bg-emerald-500/5" : "border-white/10 bg-slate-900/60"}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                {STORAGE_CONFIG.free.name}
              </CardTitle>
              {!storageData.isPremium && (
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  Actuel
                </Badge>
              )}
            </div>
            <p className="text-3xl font-bold text-white">
              Gratuit
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {STORAGE_CONFIG.free.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-white/70 text-sm">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Premium plan */}
        <Card className={`border-2 ${storageData.isPremium ? "border-amber-500/50 bg-amber-500/5" : "border-white/10 bg-slate-900/60"}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-400" />
                {STORAGE_CONFIG.premium.name}
              </CardTitle>
              {storageData.isPremium && (
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                  Actuel
                </Badge>
              )}
            </div>
            <p className="text-3xl font-bold text-white">
              {STORAGE_CONFIG.premium.priceEurMonth.toFixed(2).replace(".", ",")} EUR
              <span className="text-sm font-normal text-white/50">/mois</span>
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {STORAGE_CONFIG.premium.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-white/70 text-sm">
                  <Check className="h-4 w-4 text-amber-400 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {!storageData.isPremium && (
              <Button
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-semibold"
              >
                {isUpgrading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Redirection...
                  </>
                ) : (
                  <>
                    Passer a Premium
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info box */}
      <Card className="bg-sky-500/5 border-sky-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
            <div className="text-sm text-white/70">
              <p className="font-medium text-sky-400 mb-1">Fonctionnement du stockage</p>
              <p>
                Le stockage VIXUAL heberge vos fichiers sources (videos, podcasts, ecrits) 
                avant leur publication sur la plateforme. Une fois valide et publie, 
                le contenu est transfere sur notre CDN (Bunny.net) pour une diffusion optimale.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
