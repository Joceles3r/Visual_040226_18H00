"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Crown,
  Star,
  Zap,
  Shield,
  Eye,
  TrendingUp,
  Gift,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  Users,
  Award,
} from "lucide-react"
import { VisualHeader } from "@/components/visual-header"
import { Footer } from "@/components/footer"

const GOLD_BENEFITS = [
  {
    icon: Eye,
    title: "Visibilite prioritaire",
    description: "Vos contenus apparaissent en premier dans les recommandations et la page Explorer.",
    color: "text-amber-400",
    bg: "bg-amber-500/15",
  },
  {
    icon: TrendingUp,
    title: "Boost de diffusion",
    description: "Acceleration de la diffusion en vagues avec un multiplicateur x1.5 sur le score VISUAL.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
  },
  {
    icon: Shield,
    title: "Trust Score renforce",
    description: "Bonus de +10 points sur votre Trust Score pour une credibilite maximale.",
    color: "text-sky-400",
    bg: "bg-sky-500/15",
  },
  {
    icon: Gift,
    title: "VIXUpoints bonus",
    description: "Gagnez 2x plus de VIXUpoints sur toutes vos interactions et activites.",
    color: "text-violet-400",
    bg: "bg-violet-500/15",
  },
  {
    icon: Star,
    title: "Badge Gold exclusif",
    description: "Affichez fierement votre statut Gold sur votre profil et vos contenus.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/15",
  },
  {
    icon: Users,
    title: "Acces VIP communaute",
    description: "Participez aux evenements exclusifs et echangez avec les autres membres Gold.",
    color: "text-pink-400",
    bg: "bg-pink-500/15",
  },
]

export default function GoldPassPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <VisualHeader />

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-white/60 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        {/* Hero Section with explanation */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Crown className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Gold Pass <span className="text-amber-400">VIXUAL</span>
          </h1>
          
          {/* Explanation in 3 lines */}
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-xl p-6 mb-8">
            <p className="text-lg text-white/90 leading-relaxed">
              Le <strong className="text-amber-400">Gold Pass</strong> est votre passeport premium sur VIXUAL.
              Il offre une visibilite accrue, des bonus exclusifs et un statut reconnu par toute la communaute.
              Devenez Gold pour maximiser votre impact et accelerer votre succes sur la plateforme.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-white/60">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <span>Rejoignez les createurs et contributeurs d&apos;elite</span>
            <Sparkles className="h-5 w-5 text-amber-400" />
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {GOLD_BENEFITS.map((benefit, index) => (
            <Card 
              key={index} 
              className="bg-slate-900/50 border-white/10 hover:border-amber-500/30 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl ${benefit.bg} flex items-center justify-center mb-4`}>
                  <benefit.icon className={`h-6 w-6 ${benefit.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pricing Section */}
        <Card className="bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-amber-500/10 border-amber-500/30 overflow-hidden">
          <CardContent className="p-8 text-center">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-4">
              Offre de lancement
            </Badge>
            <div className="flex items-baseline justify-center gap-2 mb-4">
              <span className="text-5xl font-bold text-white">9,99</span>
              <span className="text-2xl text-white/60">EUR/mois</span>
            </div>
            <p className="text-white/60 mb-6">Annulable a tout moment. Sans engagement.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-semibold px-8 py-6 text-lg">
                <Crown className="mr-2 h-5 w-5" />
                Devenir Gold
              </Button>
              <Link href="/explore">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Explorer d&apos;abord
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-white/50">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                Paiement securise
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                Activation immediate
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                Support prioritaire
              </span>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
