"use client"

import Link from "next/link"
import {
  User,
  Eye,
  Layers,
  Shield,
  TrendingUp,
  Film,
  FileText,
  Mic,
  Headphones,
  Wallet,
  ArrowRight,
  Check,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VisualHeader } from "@/components/visual-header"
import { Footer } from "@/components/footer"

const STEPS = [
  {
    step: 1,
    title: "Explorez en tant qu'invité ou créez votre compte",
    description:
      "Commencez à naviguer immédiatement sur VISUAL en tant qu'invité : découvrez les contenus gratuits et les extraits sans inscription. Pour débloquer toutes les fonctionnalités, inscrivez-vous gratuitement et devenez Visiteur.",
    icon: User,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
  },
  {
    step: 2,
    title: "Choisissez votre rôle",
    description:
      "Devenez Porteur (vidéo), Infoporteur (écrit), Podcasteur (podcast) pour créer du contenu, ou Investisseur, Investi-lecteur, Auditeur pour soutenir des projets.",
    icon: Layers,
    color: "text-teal-400",
    bgColor: "bg-teal-500/20",
  },
  {
    step: 3,
    title: "Payez votre caution",
    description:
      "10 EUR pour les créateurs (Porteur, Infoporteur, Podcasteur), 20 EUR pour les investisseurs (Investisseur, Investi-lecteur, Auditeur). Caution unique remboursable à la résiliation.",
    icon: Shield,
    color: "text-sky-400",
    bgColor: "bg-sky-500/20",
  },
  {
    step: 4,
    title: "Participez et gagnez",
    description:
      "Créez ou investissez dans des projets. Suivez vos statistiques et retirez vos gains via Stripe Connect.",
    icon: TrendingUp,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/20",
  },
]

const ROLES = [
  {
    title: "Invité",
    subtitle: "Sans inscription",
    description:
      "Naviguez librement sur VISUAL sans créer de compte. Accès limité aux contenus gratuits et extraits uniquement.",
    features: [
      "Accès aux contenus gratuits et extraits",
      "Navigation libre sur la plateforme",
    ],
    restrictions: [
      "Aucun VISUpoint",
      "Aucun gain ni investissement",
      "Pas de participation à la communauté",
      "Pas de favoris ni de commentaires",
    ],
    caution: null,
    icon: Eye,
    color: "border-slate-500/30",
  },
  {
    title: "Visiteur",
    subtitle: "Gratuit (inscription requise)",
    description:
      "Parcourez la plateforme, gagnez des VISUpoints, promouvez VISUAL",
    features: [
      "Accès aux contenus gratuits",
      "VISUpoints et badges",
      "Favoris et suivis",
      "Commentaires et partages",
    ],
    restrictions: [],
    caution: null,
    icon: User,
    color: "border-white/20",
  },
  {
    title: "Porteur",
    subtitle: "Créateur audiovisuel",
    description: "Déposez vos vidéos et visuels, recevez des investissements",
    features: [
      "Dépôt de contenu vidéo",
      "Statistiques détaillées",
      "Gestion des projets",
      "Retrait des gains",
    ],
    restrictions: [],
    caution: "10 EUR",
    icon: Film,
    color: "border-red-500/50",
  },
  {
    title: "Investisseur",
    subtitle: "Audiovisuel",
    description: "Investissez sur des projets video et recevez des retours",
    features: [
      "Investissement 2-20 EUR",
      "Portefeuille de projets",
      "Historique des gains",
      "Retrait via Stripe",
    ],
    restrictions: [],
    caution: "20 EUR",
    icon: TrendingUp,
    color: "border-emerald-500/50",
  },
  {
    title: "Infoporteur",
    subtitle: "Créateur littéraire",
    description:
      "Publiez vos écrits : articles, histoires, livres, et plus encore",
    features: [
      "Dépôt de contenu écrit",
      "Statistiques de lecture",
      "Gestion des publications",
      "Retrait des gains",
    ],
    restrictions: [],
    caution: "10 EUR",
    icon: FileText,
    color: "border-amber-500/50",
  },
  {
    title: "Investi-lecteur",
    subtitle: "Investisseur littéraire",
    description: "Investissez sur des contenus écrits et soutenez les auteurs",
    features: [
      "Investissement 2-20 EUR",
      "Portefeuille littéraire",
      "Historique des gains",
      "Retrait via Stripe",
    ],
    restrictions: [],
    caution: "20 EUR",
    icon: Wallet,
    color: "border-amber-500/50",
  },
  {
    title: "Podcasteur",
    subtitle: "Créateur podcast",
    description: "Déposez vos podcasts, émissions audio et documentaires sonores",
    features: [
      "Dépôt de contenu podcast",
      "Statistiques d'écoute",
      "Gestion des épisodes",
      "Retrait des gains",
    ],
    restrictions: [],
    caution: "10 EUR",
    icon: Mic,
    color: "border-purple-500/50",
  },
  {
    title: "Auditeur",
    subtitle: "Investisseur podcast",
    description: "Investissez sur des podcasts et soutenez les podcasteurs",
    features: [
      "Investissement 2-20 EUR",
      "Portefeuille podcasts",
      "Historique des gains",
      "Retrait via Stripe",
    ],
    restrictions: [],
    caution: "20 EUR",
    icon: Headphones,
    color: "border-purple-500/50",
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      <VisualHeader />

      <main className="pt-28 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-4 mb-20 cinema-section">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Comment ça marche ?
            </h1>
            <p className="text-xl text-white/70">
              VISUAL simplifie l'investissement participatif dans les projets
              audiovisuels, litteraires et podcasts. Decouvrez comment devenir acteur de la
              creation.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="container mx-auto px-4 mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-teal-500 to-indigo-500 hidden md:block" />

              <div className="space-y-12">
                {STEPS.map((step, index) => (
                  <div key={step.step} className="relative flex gap-6">
                    {/* Step number */}
                    <div
                      className={`shrink-0 w-16 h-16 rounded-full ${step.bgColor} flex items-center justify-center z-10`}
                    >
                      <step.icon className={`h-8 w-8 ${step.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-8">
                      <div className="text-sm text-emerald-400 font-medium mb-1">
                        Étape {step.step}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {step.title}
                      </h3>
                      <p className="text-white/70 text-lg">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section className="py-20 bg-slate-900/15 cinema-section">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Les profils VISUAL
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                Choisissez le rôle qui vous correspond. Vous pouvez cumuler
                plusieurs rôles sur la plateforme.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {ROLES.map((role) => (
                <Card
                  key={role.title}
                  className={`bg-slate-900/50 ${role.color} hover:border-emerald-500/50 transition-colors`}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                        <role.icon className="h-5 w-5 text-emerald-400" />
                      </div>
                      {role.caution && (
                        <span className="text-sm text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded">
                          Caution : {role.caution}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-white">{role.title}</CardTitle>
                    <p className="text-sm text-white/60">{role.subtitle}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/70 mb-4">{role.description}</p>
                    <ul className="space-y-2">
                      {role.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm text-white/80"
                        >
                          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                          {feature}
                        </li>
                      ))}
                      {role.restrictions?.map((restriction) => (
                        <li
                          key={restriction}
                          className="flex items-center gap-2 text-sm text-red-400/80"
                        >
                          <X className="h-4 w-4 text-red-400 shrink-0" />
                          {restriction}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Investment Info */}
        <section className="py-20 cinema-section">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
                L'investissement sur VISUAL
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900/50 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="h-5 w-5 text-emerald-400" />
                      La caution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-white/70 space-y-3">
                    <p>
                      La caution est un depot unique qui garantit votre
                      engagement sur la plateforme.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400">•</span>
                        <span>10 EUR pour les createurs (Porteur, Infoporteur, Podcasteur)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400">•</span>
                        <span>
                          20 EUR pour les investisseurs (Investisseur,
                          Investi-lecteur, Auditeur)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400">•</span>
                        <span>Remboursable en cas de resiliation du compte</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-emerald-400" />
                      Les gains
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-white/70 space-y-3">
                    <p>
                      Vos gains sont consultables dans votre Wallet personnel et
                      retirables via Stripe Connect.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400">•</span>
                        <span>Investissez de 2 EUR a 20 EUR par projet</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400">•</span>
                        <span>Recevez des retours proportionnels</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400">•</span>
                        <span>Retraits traites chaque semaine</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-amber-200 text-sm text-center">
                  Attention : Investir comporte des risques. Les gains ne sont
                  pas garantis. VISUAL n'est pas un jeu de hasard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Distribution par catégorie */}
        <section className="py-20 bg-slate-900/15 cinema-section">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
              Répartition des gains par catégorie
            </h2>
            <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
              Chaque catégorie de contenu a ses propres règles de répartition et fréquences de clôture.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Films */}
                <Card className="bg-slate-900/50 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Film className="h-5 w-5 text-red-400" />
                      Films / Videos / Documentaires
                    </CardTitle>
                    <p className="text-sm text-white/50">Cloture configurable (admin)</p>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-emerald-400">Investisseurs TOP 10</span><span className="text-white font-semibold">40%</span></div>
                    <div className="flex justify-between text-sm"><span className="text-teal-400">Porteurs TOP 10</span><span className="text-white font-semibold">30%</span></div>
                    <div className="flex justify-between text-sm"><span className="text-sky-400">Investisseurs rangs 11-100</span><span className="text-white font-semibold">7%</span></div>
                    <div className="flex justify-between text-sm"><span className="text-white/50">VISUAL (plateforme)</span><span className="text-white font-semibold">23%</span></div>
                  </CardContent>
                </Card>

                {/* Voix de l'Info */}
                <Card className="bg-slate-900/50 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <FileText className="h-5 w-5 text-amber-400" />
                      Voix de l'Info (articles)
                    </CardTitle>
                    <p className="text-sm text-white/50">Vente 70/30 + Pot quotidien</p>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs text-white/40 mb-1">Vente unitaire :</p>
                    <div className="flex justify-between text-sm"><span className="text-amber-400">Auteur</span><span className="text-white font-semibold">70%</span></div>
                    <div className="flex justify-between text-sm"><span className="text-white/50">VISUAL</span><span className="text-white font-semibold">30%</span></div>
                    <div className="border-t border-white/10 my-2" />
                    <p className="text-xs text-white/40 mb-1">Pot du jour :</p>
                    <div className="flex justify-between text-sm"><span className="text-amber-400">Auteurs TOP 10</span><span className="text-white font-semibold">60%</span></div>
                    <div className="flex justify-between text-sm"><span className="text-sky-400">Lecteurs gagnants</span><span className="text-white font-semibold">40%</span></div>
                  </CardContent>
                </Card>

                {/* Livres */}
                <Card className="bg-slate-900/50 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <FileText className="h-5 w-5 text-amber-400" />
                      Livres
                    </CardTitle>
                    <p className="text-sm text-white/50">Vente 70/30 + Pot mensuel</p>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs text-white/40 mb-1">Vente unitaire :</p>
                    <div className="flex justify-between text-sm"><span className="text-amber-400">Auteur</span><span className="text-white font-semibold">70%</span></div>
                    <div className="flex justify-between text-sm"><span className="text-white/50">VISUAL</span><span className="text-white font-semibold">30%</span></div>
                    <div className="border-t border-white/10 my-2" />
                    <p className="text-xs text-white/40 mb-1">Pot mensuel :</p>
                    <div className="flex justify-between text-sm"><span className="text-amber-400">Auteurs TOP 10</span><span className="text-white font-semibold">60%</span></div>
                    <div className="flex justify-between text-sm"><span className="text-sky-400">Investi-lecteurs gagnants</span><span className="text-white font-semibold">40%</span></div>
                  </CardContent>
                </Card>

                {/* Podcasts */}
                <Card className="bg-slate-900/50 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Mic className="h-5 w-5 text-purple-400" />
                      Podcasts
                    </CardTitle>
                    <p className="text-sm text-white/50">Vente 70/30 + Pot mensuel</p>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs text-white/40 mb-1">Vente episode :</p>
                    <div className="flex justify-between text-sm"><span className="text-purple-400">Podcasteur</span><span className="text-white font-semibold">70%</span></div>
                    <div className="flex justify-between text-sm"><span className="text-white/50">VISUAL</span><span className="text-white font-semibold">30%</span></div>
                    <div className="border-t border-white/10 my-2" />
                    <p className="text-xs text-white/40 mb-1">Pot mensuel :</p>
                    <div className="flex justify-between text-sm"><span className="text-purple-400">Podcasteurs</span><span className="text-white font-semibold">40%</span></div>
                    <div className="flex justify-between text-sm"><span className="text-emerald-400">Auditeurs (investisseurs)</span><span className="text-white font-semibold">30%</span></div>
                    <div className="flex justify-between text-sm"><span className="text-white/50">VISUAL (plateforme)</span><span className="text-white font-semibold">20%</span></div>
                    <div className="flex justify-between text-sm"><span className="text-amber-400">Bonus Pool</span><span className="text-white font-semibold">10%</span></div>
                    <div className="pl-4 mt-1 space-y-1 border-l-2 border-amber-400/30">
                      <div className="flex justify-between text-xs"><span className="text-amber-300/70">Primes perf. TOP 10</span><span className="text-white/70">6%</span></div>
                      <div className="flex justify-between text-xs"><span className="text-white/40">Reserve technique</span><span className="text-white/70">2%</span></div>
                      <div className="flex justify-between text-xs"><span className="text-white/40">Réserve événementielle</span><span className="text-white/70">2%</span></div>
                    </div>
                  </CardContent>
                </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 cinema-section">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Prêt à commencer ?
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Créez votre compte gratuitement et explorez des milliers de projets
              créatifs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-8"
                >
                  Créer mon compte
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white/20 text-white hover:bg-white/10 px-8"
                >
                  Explorer les projets
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
