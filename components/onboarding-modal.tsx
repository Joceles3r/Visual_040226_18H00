"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  Film, FileText, Mic, TrendingUp, Heart, Headphones,
  ArrowRight, X, Star, Shield, CheckCircle, Sparkles,
} from "lucide-react"

// Cle localStorage pour ne montrer le modal qu'une seule fois par utilisateur
const ONBOARDING_KEY = "vixual_onboarding_done"

interface OnboardingStep {
  icon: typeof Film
  color: string
  bgColor: string
  title: string
  body: string
  cta?: string
  ctaHref?: string
}

function getStepsForRoles(roles: string[], name: string): OnboardingStep[] {
  const isPorter = roles.includes("porter")
  const isInfoporter = roles.includes("infoporter")
  const isPodcaster = roles.includes("podcaster")
  const isContributor = roles.includes("contributor") || roles.includes("investor")
  const isContribuReader = roles.includes("contribureader") || roles.includes("investireader")
  const isListener = roles.includes("listener")

  const welcome: OnboardingStep = {
    icon: Sparkles,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    title: `Bienvenue sur VIXUAL, ${name} !`,
    body: "VIXUAL est la premiere plateforme de streaming participative. Vous pouvez regarder, soutenir des createurs, et potentiellement generer des gains selon votre implication.",
  }

  if (isPorter) return [
    welcome,
    {
      icon: Film,
      color: "text-rose-400",
      bgColor: "bg-rose-500/20",
      title: "Votre role : Porteur",
      body: "Vous publiez des contenus audiovisuels. Si votre projet figure dans le TOP 10 sur 100, vous touchez une part des gains. Payez d'abord votre caution de 10 euros pour activer vos depots.",
      cta: "Deposer ma premiere video",
      ctaHref: "/upload",
    },
    {
      icon: Shield,
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
      title: "La caution createur",
      body: "10 euros uniques, remboursables si vous resiliez votre compte. Elle garantit votre engagement sur la plateforme et debloque la publication de vos contenus.",
      cta: "Payer ma caution",
      ctaHref: "/dashboard/wallet",
    },
  ]

  if (isInfoporter) return [
    welcome,
    {
      icon: FileText,
      color: "text-sky-400",
      bgColor: "bg-sky-500/20",
      title: "Votre role : Infoporteur",
      body: "Vous publiez articles et livres. Deux modeles : vente unitaire (70 % pour vous) + pot mensuel pour les TOP auteurs. Payez votre caution de 10 euros pour commencer.",
      cta: "Deposer mon premier ecrit",
      ctaHref: "/upload/text",
    },
    {
      icon: Star,
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
      title: "Article ou Livre ?",
      body: "Articles (Voix de l'Info) : vente rapide, pot mensuel partage avec les Contribu-lecteurs. Livres : vente longue duree avec royalties progressives. Choisissez au moment du depot.",
    },
  ]

  if (isPodcaster) return [
    welcome,
    {
      icon: Mic,
      color: "text-violet-400",
      bgColor: "bg-violet-500/20",
      title: "Votre role : Podcasteur",
      body: "Vous deposez vos episodes et construisez une audience d'Auditeurs-soutien. Vos gains : 40 % du pot mensuel si votre podcast est dans le TOP + 70 % sur chaque vente unitaire.",
      cta: "Deposer mon premier podcast",
      ctaHref: "/upload/podcast",
    },
    {
      icon: Shield,
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
      title: "La caution createur",
      body: "10 euros uniques, remboursables a la resiliation. Elle active votre acces a la publication et au retrait de vos gains via Stripe Connect.",
      cta: "Payer ma caution",
      ctaHref: "/dashboard/wallet",
    },
  ]

  if (isContributor) return [
    welcome,
    {
      icon: TrendingUp,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
      title: "Votre role : Contributeur",
      body: "Vous soutenez des projets video de 2 euros a 20 euros. Si le projet se classe dans le TOP 10 sur 100, vous recevez une part des gains redistribues le 1er du mois suivant.",
      cta: "Explorer les projets video",
      ctaHref: "/explore?type=video",
    },
    {
      icon: Shield,
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
      title: "Votre caution de 20 euros",
      body: "Elle garantit votre engagement. Elle est remboursable si vous resiliez. Activez Stripe Connect dans votre Wallet pour pouvoir retirer vos gains.",
      cta: "Activer Stripe Connect",
      ctaHref: "/dashboard/wallet",
    },
  ]

  if (isContribuReader) return [
    welcome,
    {
      icon: Heart,
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
      title: "Votre role : Contribu-lecteur",
      body: "Vous soutenez des auteurs en contribuant a leurs ecrits. Si l'auteur finit dans le TOP, vous recevez une part du pot mensuel litteraire. Redistribution le dernier jour du mois.",
      cta: "Explorer les ecrits",
      ctaHref: "/explore?type=text",
    },
    {
      icon: Shield,
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
      title: "Paiement hybride disponible",
      body: "En tant que Contribu-lecteur, vous pouvez regler 30 % en euros et 70 % en VIXUpoints. Economique et flexible selon votre solde de points.",
    },
  ]

  if (isListener) return [
    welcome,
    {
      icon: Headphones,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      title: "Votre role : Auditeur-soutien",
      body: "Vous soutenez des podcasteurs financierement. 30 % du pot mensuel podcasts vous revient si vous etes dans le classement. Redistribution chaque mois.",
      cta: "Decouvrir les podcasts",
      ctaHref: "/explore?type=podcast",
    },
    {
      icon: Star,
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
      title: "VIXUpoints + paiement hybride",
      body: "Vous beneficiez du paiement hybride : 30 % euros + 70 % VIXUpoints. Gagnez des VIXUpoints en interagissant et utilisez-les pour reduire vos futures contributions.",
    },
  ]

  // Visiteur par defaut
  return [
    welcome,
    {
      icon: Star,
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
      title: "Les VIXUpoints",
      body: "Gagnez des VIXUpoints en regardant des extraits, en interagissant et en partageant. 2 500 points = 25 euros utilisables comme cagnotte pour acheter du contenu.",
      cta: "Voir mon Pass Decouverte",
      ctaHref: "/dashboard/visitor",
    },
    {
      icon: TrendingUp,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
      title: "Pret a aller plus loin ?",
      body: "Devenez Contributeur, Contribu-lecteur ou Auditeur-soutien pour soutenir des createurs et potentiellement generer des gains. Ou devenez Porteur, Infoporteur, Podcasteur pour publier.",
      cta: "Choisir un profil",
      ctaHref: "/guide-profiles",
    },
  ]
}

export function OnboardingModal() {
  const { user, roles, isAuthed } = useAuth()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!isAuthed || !user?.id) return
    const key = `${ONBOARDING_KEY}_${user.id}`
    if (typeof window !== "undefined" && !localStorage.getItem(key)) {
      // Legere temporisation pour laisser la page se charger
      setTimeout(() => setOpen(true), 800)
    }
  }, [isAuthed, user?.id])

  const dismiss = () => {
    if (user?.id && typeof window !== "undefined") {
      localStorage.setItem(`${ONBOARDING_KEY}_${user.id}`, "1")
    }
    setOpen(false)
  }

  if (!open || !user) return null

  const steps = getStepsForRoles(roles, user.name || "")
  const current = steps[step]
  const isLast = step === steps.length - 1
  const Icon = current.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-slate-900 border border-white/15 rounded-2xl shadow-2xl overflow-hidden">

        {/* Progress dots */}
        <div className="flex gap-1.5 justify-center pt-5 pb-0">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "w-6 bg-emerald-400" : i < step ? "w-3 bg-emerald-400/40" : "w-3 bg-white/15"
              }`}
            />
          ))}
        </div>

        {/* Bouton fermer */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 p-1.5 rounded-full text-white/30 hover:text-white/70 hover:bg-white/10 transition-all"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Contenu */}
        <div className="p-8 pt-4">
          <div className={`w-16 h-16 rounded-2xl ${current.bgColor} flex items-center justify-center mx-auto mb-5`}>
            <Icon className={`h-8 w-8 ${current.color}`} />
          </div>

          <h2 className="text-xl font-bold text-white text-center mb-3 text-balance">
            {current.title}
          </h2>
          <p className="text-white/65 text-sm text-center leading-relaxed mb-7">
            {current.body}
          </p>

          <div className="flex flex-col gap-2">
            {current.cta && current.ctaHref && (
              <a href={current.ctaHref}>
                <Button
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white h-11"
                  onClick={isLast ? dismiss : undefined}
                >
                  {current.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            )}

            <Button
              variant="outline"
              className="w-full border-white/10 text-white/60 hover:bg-white/5 hover:text-white h-11"
              onClick={isLast ? dismiss : () => setStep(s => s + 1)}
            >
              {isLast ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4 text-emerald-400" />
                  C&apos;est parti !
                </>
              ) : (
                <>
                  Suivant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <button
              onClick={dismiss}
              className="text-center text-white/25 text-xs hover:text-white/45 transition-colors py-1"
            >
              Passer l&apos;introduction
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
