"use client"

import Link from "next/link"
import { ArrowRight, Film, FileText, Mic, Users, TrendingUp, Shield, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { VisualHeader } from "@/components/visual-header"
import { Footer } from "@/components/footer"
import { ContentCard } from "@/components/content-card"
import { ALL_CONTENTS } from "@/lib/mock-data"

const FEATURED_CONTENTS = ALL_CONTENTS.slice(0, 4)

const FEATURES = [
  {
    icon: Film,
    title: "Audiovisuel",
    description: "Courts-metrages, documentaires, clips musicaux et animations",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
  },
  {
    icon: FileText,
    title: "Litteraire",
    description: "Romans, nouvelles, essais, poesies et articles",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Mic,
    title: "Podcast",
    description: "Podcasts, voix de l'info, emissions audio et documentaires sonores",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: TrendingUp,
    title: "Investissement",
    description: "De 2EUR a 20EUR par projet, recevez des retours sur vos investissements",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: Shield,
    title: "Securise",
    description: "Caution remboursable, paiements via Stripe Connect",
    color: "text-sky-400",
    bgColor: "bg-sky-500/10",
  },
]

const STATS = [
  { value: "12,500+", label: "Utilisateurs" },
  { value: "850+", label: "Projets financés" },
  { value: "2.5M€", label: "Investis" },
  { value: "89%", label: "Projets réussis" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <VisualHeader />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-slate-950 to-slate-950" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance">
                Investissez dans{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  l'art de demain
                </span>
              </h1>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto text-pretty">
                VISUAL est la plateforme d'investissement participatif pour les
                projets audiovisuels, litteraires et podcasts. Soutenez les createurs,
                investissez dans leurs oeuvres, partagez leurs succes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-8 h-12 text-lg font-semibold shadow-lg shadow-emerald-900/30"
                  >
                    Commencer gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white/20 text-white hover:bg-white/10 px-8 h-12 text-lg"
                  >
                    Explorer les projets
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-y border-white/10 bg-slate-900/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-400">
                    {stat.value}
                  </div>
                  <div className="text-white/60 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Trois univers, une plateforme
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                Explorez et investissez dans des projets audiovisuels,
                litteraires et podcasts uniques
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {FEATURES.map((feature) => (
                <Card
                  key={feature.title}
                  className="bg-slate-900/50 border-white/10 hover:border-emerald-500/30 transition-colors"
                >
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}
                    >
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-white/60">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-20 bg-slate-900/30">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Projets en vedette
                </h2>
                <p className="text-white/60">
                  Découvrez les projets les plus populaires du moment
                </p>
              </div>
              <Link href="/explore">
                <Button
                  variant="outline"
                  className="hidden md:flex bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  Voir tout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURED_CONTENTS.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link href="/explore">
                <Button
                  variant="outline"
                  className="bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  Voir tous les projets
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Preview */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Comment ça fonctionne ?
              </h2>
              <p className="text-white/60 mb-12 max-w-2xl mx-auto">
                En quelques etapes simples, devenez acteur de la creation
                audiovisuelle, litteraire et podcast
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    1. Créez votre compte
                  </h3>
                  <p className="text-white/60">
                    Inscription gratuite et accès immédiat à la plateforme
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center mb-4">
                    <Film className="h-8 w-8 text-teal-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    2. Explorez les projets
                  </h3>
                  <p className="text-white/60">
                    Decouvrez des creations uniques en video, ecrit et podcast
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-sky-500/20 flex items-center justify-center mb-4">
                    <Star className="h-8 w-8 text-sky-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    3. Investissez et gagnez
                  </h3>
                  <p className="text-white/60">
                    Soutenez les créateurs et recevez des retours
                  </p>
                </div>
              </div>

              <Link href="/how-it-works" className="inline-block mt-12">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
                >
                  En savoir plus
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-900/30 to-teal-900/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Prêt à rejoindre VISUAL ?
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Créez votre compte gratuitement et commencez à explorer des
              milliers de projets créatifs
            </p>
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-white text-slate-900 hover:bg-white/90 px-8 h-12 text-lg font-semibold"
              >
                Créer mon compte
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
