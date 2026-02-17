"use client"

import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Film,
  FileText,
  Mic,
  Headphones,
  Clock,
  BookOpen,
  Users,
  Heart,
  Share2,
  TrendingUp,
  Play,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VisualHeader } from "@/components/visual-header"
import { Footer } from "@/components/footer"
import { ALL_CONTENTS } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

export default function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { isAuthed, roles } = useAuth()

  const content = ALL_CONTENTS.find((c) => c.id === id)

  if (!content) {
    notFound()
  }

  const progressPercent = Math.min(
    (content.currentInvestment / content.investmentGoal) * 100,
    100
  )
  const cType = content.contentType
  const isVideo = cType === "video"
  const isPodcast = cType === "podcast"
  const canInvest =
    isAuthed &&
    (roles.includes("investor") || roles.includes("investireader"))

  return (
    <div className="min-h-screen bg-slate-950">
      <VisualHeader />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'exploration
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video/Image player */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
                <Image
                  src={content.coverUrl || "/placeholder.svg"}
                  alt={content.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  {isVideo && (
                    <button className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors group">
                      <Play className="h-10 w-10 text-white ml-1 group-hover:scale-110 transition-transform" />
                    </button>
                  )}
                  {cType === "text" && (
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white"
                    >
                      <BookOpen className="mr-2 h-5 w-5" />
                      Commencer la lecture
                    </Button>
                  )}
                  {isPodcast && (
                    <button className="w-20 h-20 rounded-full bg-purple-500/30 backdrop-blur-sm flex items-center justify-center hover:bg-purple-500/40 transition-colors group">
                      <Headphones className="h-10 w-10 text-white group-hover:scale-110 transition-transform" />
                    </button>
                  )}
                </div>

                {/* Badge type */}
                <Badge
                  className={`absolute top-4 left-4 ${
                    isVideo
                      ? "bg-red-600/90 hover:bg-red-600"
                      : isPodcast
                        ? "bg-purple-600/90 hover:bg-purple-600"
                        : "bg-amber-600/90 hover:bg-amber-600"
                  } text-white border-0`}
                >
                  {isVideo && (
                    <>
                      <Film className="h-3 w-3 mr-1" />
                      Video
                    </>
                  )}
                  {cType === "text" && (
                    <>
                      <FileText className="h-3 w-3 mr-1" />
                      Ecrit
                    </>
                  )}
                  {isPodcast && (
                    <>
                      <Mic className="h-3 w-3 mr-1" />
                      Podcast
                    </>
                  )}
                </Badge>

                {/* Free badge */}
                {content.isFree && (
                  <Badge className="absolute top-4 right-4 bg-emerald-600/90 hover:bg-emerald-600 text-white border-0">
                    Gratuit
                  </Badge>
                )}
              </div>

              {/* Title and info */}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {content.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/60">
                  <span className="text-emerald-400 font-medium">
                    {content.creatorName}
                  </span>
                  <span className="flex items-center gap-1">
                    {isVideo && (
                      <>
                        <Clock className="h-4 w-4" />
                        {content.duration}
                      </>
                    )}
                    {cType === "text" && (
                      <>
                        <BookOpen className="h-4 w-4" />
                        {content.wordCount?.toLocaleString()} mots
                      </>
                    )}
                    {isPodcast && (
                      <>
                        <Headphones className="h-4 w-4" />
                        {content.episodeCount} episodes - {content.duration}
                      </>
                    )}
                  </span>
                  <span>{content.category}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Ajouter aux favoris
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </div>

              {/* Description */}
              <Card className="bg-slate-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 leading-relaxed">
                    {content.description}
                  </p>
                  <p className="text-white/70 leading-relaxed mt-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Investment */}
            <div className="space-y-6">
              {/* Investment Card */}
              <Card className="bg-slate-900/50 border-white/10 sticky top-28">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                    Investissement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress */}
                  <div className="space-y-3">
                    <Progress
                      value={progressPercent}
                      className="h-3 bg-slate-800"
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-400 font-bold text-lg">
                        {content.currentInvestment.toLocaleString()}€
                      </span>
                      <span className="text-white/60">
                        sur {content.investmentGoal.toLocaleString()}€
                      </span>
                    </div>
                    <div className="text-center text-white/60 text-sm">
                      {progressPercent.toFixed(0)}% financé
                    </div>
                  </div>

                  {/* Investors */}
                  <div className="flex items-center justify-center gap-2 py-3 bg-slate-800/50 rounded-lg">
                    <Users className="h-5 w-5 text-emerald-400" />
                    <span className="text-white font-medium">
                      {content.investorCount} investisseurs
                    </span>
                  </div>

                  {/* Investment buttons */}
                  {canInvest ? (
                    <div className="space-y-3">
                      <p className="text-white/60 text-sm text-center">
                        Choisissez votre montant d'investissement
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 5, 10, 20].map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            className="bg-transparent border-emerald-500/50 text-emerald-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600"
                          >
                            {amount}€
                          </Button>
                        ))}
                      </div>
                      <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white h-12 text-lg">
                        Investir maintenant
                      </Button>
                    </div>
                  ) : isAuthed ? (
                    <div className="text-center space-y-3">
                      <p className="text-white/60 text-sm">
                        Pour investir, devenez Investisseur ou Investi-lecteur
                      </p>
                      <Link href="/dashboard/settings">
                        <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white">
                          Devenir investisseur
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center space-y-3">
                      <p className="text-white/60 text-sm">
                        Connectez-vous pour investir dans ce projet
                      </p>
                      <Link href="/signup">
                        <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white">
                          Créer un compte
                        </Button>
                      </Link>
                      <Link href="/login">
                        <Button
                          variant="outline"
                          className="w-full bg-transparent border-white/20 text-white hover:bg-white/10"
                        >
                          Se connecter
                        </Button>
                      </Link>
                    </div>
                  )}

                  {/* Warning */}
                  <p className="text-xs text-white/40 text-center">
                    Investir comporte des risques. Les gains ne sont pas
                    garantis.
                  </p>
                </CardContent>
              </Card>

              {/* Creator Card */}
              <Card className="bg-slate-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    À propos du créateur
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <span className="text-emerald-400 font-bold">
                        {content.creatorName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {content.creatorName}
                      </div>
                      <div className="text-sm text-white/60">Créateur VISUAL</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 bg-transparent border-white/20 text-white hover:bg-white/10"
                  >
                    Voir le profil
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
