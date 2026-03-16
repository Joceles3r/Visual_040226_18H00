"use client"

import Link from "next/link"
import { ArrowRight, Film, FileText, Mic, Users, TrendingUp, Shield, Star, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VisualHeader } from "@/components/visual-header"
import { Footer } from "@/components/footer"
import { VisualSlogan } from "@/components/visual-slogan"
import { ContentCard } from "@/components/content-card"
import { ALL_CONTENTS } from "@/lib/mock-data"

const FEATURED_CONTENTS = ALL_CONTENTS.slice(0, 4)

const FEATURES = [
  {
    icon: Film,
    title: "Audiovisuel",
    description: "Courts et longs metrages, documentaires, clips musicaux et animations",
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
    title: "Contribution",
    description: "De 2EUR a 20EUR par projet, recevez des retours sur vos contributions",
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
  { value: "2.5M€", label: "Contribués" },
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
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-balance">
                Contribuez aux{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  talents de demain
                </span>
              </h1>

              {/* Slogan signature */}
              <div className="mb-8">
                <VisualSlogan size="base" opacity="high" withLines />
              </div>

              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto text-pretty">
                VIXUAL, la première plateforme de streaming participative pour les films, écrits et podcasts. Soutenez les créateurs en contribuant à leur succès.
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
              <p className="text-white/40 text-sm mt-4">
                Pas encore pret ?{" "}
                <Link href="/explore" className="text-white/60 underline underline-offset-4 hover:text-white/80 transition-colors">
                  Continuez en tant qu'invite
                </Link>
                {" "}- acces aux contenus gratuits, sans inscription
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-y border-white/10 bg-slate-900/30 cinema-section">
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

        {/* Section Pedagogique - Comprendre VIXUAL */}
        <section className="py-20 bg-gradient-to-b from-slate-950 via-emerald-950/10 to-slate-950 cinema-section">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 mb-4">
                Nouveau sur VIXUAL ?
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Comprendre VIXUAL en 3 points
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                Une plateforme simple, transparente et equitable pour tous
              </p>
            </div>

            {/* Les 3 cartes explicatives avec images - Palette VIXUAL Streaming */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              
              {/* Carte 1: Les 3 Familles */}
              <Card className="overflow-hidden hover:shadow-xl hover:shadow-[#7A00FF]/20 transition-all duration-300 border-[#7A00FF]/30" style={{ background: 'linear-gradient(to bottom, rgba(10, 77, 255, 0.15), rgba(122, 0, 255, 0.1))' }}>
                <div className="aspect-[16/10] relative overflow-hidden" style={{ background: '#0A4DFF' }}>
                  <img 
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vixual_familles_150326-LsTbIXa22jY23wkp61cydcX4P3UlhF.png" 
                    alt="Les 3 familles VIXUAL" 
                    className="w-full h-full object-contain mix-blend-multiply"
                    style={{ filter: 'invert(1) brightness(1.1)' }}
                  />
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold mb-2" style={{ color: '#F5F7FF' }}>Les 3 Familles</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(245, 247, 255, 0.7)' }}>
                    <span style={{ color: '#00E5FF' }} className="font-medium">Createurs</span> publient des oeuvres, <span style={{ color: '#00E5FF' }} className="font-medium">Contributeurs</span> soutiennent financierement, <span style={{ color: '#00E5FF' }} className="font-medium">Public</span> decouvre et participe.
                  </p>
                </CardContent>
              </Card>

              {/* Carte 2: Comment ca fonctionne */}
              <Card className="overflow-hidden hover:shadow-xl hover:shadow-[#0A4DFF]/20 transition-all duration-300 border-[#0A4DFF]/30" style={{ background: 'linear-gradient(to bottom, rgba(122, 0, 255, 0.15), rgba(10, 77, 255, 0.1))' }}>
                <div className="aspect-[16/10] relative overflow-hidden" style={{ background: '#7A00FF' }}>
                  <img 
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vixual_fonctionnement_150326-xo8XpxV5JzawGdHFQ4RARu5O2KsFHe.png" 
                    alt="Comment fonctionne VIXUAL" 
                    className="w-full h-full object-contain mix-blend-multiply"
                    style={{ filter: 'invert(1) brightness(1.1)' }}
                  />
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold mb-2" style={{ color: '#F5F7FF' }}>Comment ca fonctionne</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(245, 247, 255, 0.7)' }}>
                    Createur publie, contributeurs soutiennent, votes classent, meilleurs gagnent, gains redistribues equitablement.
                  </p>
                </CardContent>
              </Card>

              {/* Carte 3: Principe des gains */}
              <Card className="overflow-hidden hover:shadow-xl hover:shadow-[#00E5FF]/20 transition-all duration-300 border-[#00E5FF]/30" style={{ background: 'linear-gradient(to bottom, rgba(0, 229, 255, 0.1), rgba(122, 0, 255, 0.1))' }}>
                <div className="aspect-[16/10] relative overflow-hidden" style={{ background: '#00E5FF' }}>
                  <img 
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vixual_gains_150326-UElSPo0snOQmzKcGvDBkR1a9h7ppoy.png" 
                    alt="Principe des gains VIXUAL" 
                    className="w-full h-full object-contain mix-blend-multiply"
                    style={{ filter: 'invert(1) brightness(1.1)' }}
                  />
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold mb-2" style={{ color: '#F5F7FF' }}>Principe des gains</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(245, 247, 255, 0.7)' }}>
                    Les votes classent les projets. Les gains sont calcules au prorata de votre contribution financiere reelle.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Slogan et VIXUpoints */}
            <div className="mt-12 max-w-3xl mx-auto">
              <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 rounded-2xl p-6 border border-emerald-500/20">
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                    Regarde — Participe — Gagne
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <p className="text-amber-400 font-semibold mb-1">VIXUpoints</p>
                    <p className="text-white/60 text-xs">Debloquez des contenus, soutenez la plateforme, achetez des micro-contenus. Ils ne servent jamais a influencer les gains.</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <p className="text-emerald-400 font-semibold mb-1">Paiement hybride</p>
                    <p className="text-white/60 text-xs">Selon votre profil: euros uniquement, VIXUpoints + euros, ou VIXUpoints seuls. Equitable et transparent.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 cinema-section">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Trois univers, une plateforme
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                Explorez et contribuez a des projets audiovisuels,
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
        <section className="py-20 bg-slate-900/30 cinema-section">
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
        <section className="py-20 cinema-section">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Comment ça fonctionne ?
              </h2>
            <p className="text-white/60 mb-12 max-w-2xl mx-auto">
              En quelques etapes simples, devenez contributeur de la creation
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
                    3. Contribuez et gagnez
                  </h3>
                  <p className="text-white/60">
                    Soutenez les createurs et recevez des retours
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
        <section className="py-20 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 cinema-section">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Prêt à rejoindre VIXUAL ?
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

        {/* Guide des Profils CTA */}
        <section className="py-16 bg-gradient-to-r from-slate-900 via-teal-900/20 to-slate-900 border-y border-slate-800/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Découvrez votre profil idéal
                  </h3>
                  <p className="text-white/60 mb-4">
                    8 profils differents, 8 facons de participer a VIXUAL. Lequel vous correspond?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-slate-500/20 text-slate-300 border-slate-500/30">Invite</Badge>
                    <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30">Visiteur</Badge>
                    <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30">Porteur</Badge>
                    <Badge className="bg-sky-500/20 text-sky-300 border-sky-500/30">Infoporteur</Badge>
                    <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30">Podcasteur</Badge>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Contributeur</Badge>
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">Contribu-lecteur</Badge>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Auditeur</Badge>
                  </div>
                </div>
                <Link href="/guide-profiles">
                  <Button size="lg" className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 whitespace-nowrap">
                    Consulter le guide
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    )
  }
}
