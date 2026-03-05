"use client"

import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useState, useMemo } from "react"
import {
  ArrowLeft, Film, FileText, Mic, Headphones, Clock, BookOpen, Users,
  Heart, Share2, TrendingUp, Play, Pause, Lock, Unlock, UserPlus,
  Sparkles, CreditCard, Star, Download, MessageSquare, Bookmark,
  Maximize2, Volume2, Settings2, Shield, Flame, Award, Clapperboard,
  Eye, ChevronRight, CheckCircle, AlertCircle,
} from "lucide-react"
import { ReportButton } from "@/components/report-button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VisualHeader } from "@/components/visual-header"
import { Footer } from "@/components/footer"
import VisualSocialFeed from "@/components/visual-social-feed"
import { ALL_CONTENTS } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import type { ContentType } from "@/lib/visual-social/hybrid"

/* ---------- VISUAL Badges ---------- */
function getVisualBadges(content: typeof ALL_CONTENTS[0]) {
  const badges: { label: string; icon: typeof Flame; color: string; bg: string }[] = []
  const daysSinceCreation = Math.floor(
    (Date.now() - new Date(content.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  )
  const fundingPercent = (content.currentInvestment / content.investmentGoal) * 100
  if (daysSinceCreation <= 14) badges.push({ label: "Nouveau", icon: Clapperboard, color: "text-sky-300", bg: "bg-sky-500/80" })
  if (content.investorCount >= 50) badges.push({ label: "Tendance", icon: Flame, color: "text-orange-300", bg: "bg-orange-500/80" })
  if (content.totalVotes >= 250) badges.push({ label: "Soutenu par la communaut\u00e9", icon: Star, color: "text-amber-300", bg: "bg-amber-500/80" })
  if (fundingPercent >= 90) badges.push({ label: "Top projet", icon: Award, color: "text-emerald-300", bg: "bg-emerald-500/80" })
  return badges
}

export default function VideoPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { isAuthed, roles } = useAuth()

  const content = ALL_CONTENTS.find((c) => c.id === id)
  if (!content) notFound()

  const [isPlaying, setIsPlaying] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(content.isFree)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showUnlockConfirm, setShowUnlockConfirm] = useState(false)

  const progressPercent = Math.min((content.currentInvestment / content.investmentGoal) * 100, 100)
  const cType = content.contentType
  const isVideo = cType === "video"
  const isPodcast = cType === "podcast"
  const isGuest = !isAuthed
  const canInvest = isAuthed && (roles.includes("investor") || roles.includes("investireader") || roles.includes("listener"))
  const badges = getVisualBadges(content)

  // Recommendations: same type, exclude current, top 8 by investors
  const recommendations = useMemo(() => {
    return ALL_CONTENTS
      .filter((c) => c.contentType === cType && c.id !== content.id)
      .sort((a, b) => b.investorCount - a.investorCount)
      .slice(0, 8)
  }, [cType, content.id])

  const handleUnlock = () => {
    setShowUnlockConfirm(false)
    setIsUnlocked(true)
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <VisualHeader />

      <main className="pt-24 pb-20 cinema-section">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <Link href="/explore" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            {"Retour \u00e0 l'exploration"}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content - 2 cols */}
            <div className="lg:col-span-2 space-y-6">

              {/* ---------- STREAM PLAYER ---------- */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 cinema-panel group/player">
                <Image src={content.coverUrl || "/placeholder.svg"} alt={content.title} fill className="object-cover" />

                {/* Dark overlay */}
                <div className={`absolute inset-0 transition-colors ${isPlaying ? "bg-black/20" : "bg-black/50"}`} />

                {/* Locked overlay for guests */}
                {isGuest && !content.isFree ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-6 z-10">
                    <div className="w-20 h-20 rounded-full bg-slate-800/80 backdrop-blur-sm flex items-center justify-center border border-white/20">
                      <Lock className="h-10 w-10 text-white/70" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg mb-1">{"Contenu r\u00e9serv\u00e9 aux membres"}</p>
                      <p className="text-white/60 text-sm mb-4">{"Inscrivez-vous pour acc\u00e9der \u00e0 ce contenu"}</p>
                    </div>
                    <div className="flex gap-3">
                      <Link href="/signup">
                        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white">
                          <UserPlus className="mr-2 h-4 w-4" />
                          {"Cr\u00e9er un compte"}
                        </Button>
                      </Link>
                      <Link href="/login">
                        <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                          Se connecter
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : !isUnlocked ? (
                  /* Token unlock overlay */
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-6 z-10">
                    {showUnlockConfirm ? (
                      <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-8 border border-emerald-500/20 max-w-sm">
                        <Unlock className="h-10 w-10 text-emerald-400 mx-auto mb-4" />
                        <h3 className="text-white font-bold text-lg mb-2">{"D\u00e9bloquer ce contenu"}</h3>
                        <p className="text-white/60 text-sm mb-4">
                          {"Un jeton d'acc\u00e8s temporaire sera g\u00e9n\u00e9r\u00e9. Vous pourrez visionner ou t\u00e9l\u00e9charger ce contenu."}
                        </p>
                        <div className="space-y-2 mb-4 text-left">
                          <div className="flex items-center gap-2 text-white/50 text-xs">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                            {"Jeton streaming : acc\u00e8s imm\u00e9diat"}
                          </div>
                          <div className="flex items-center gap-2 text-white/50 text-xs">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                            {"Jeton t\u00e9l\u00e9chargement : sauvegarde locale"}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleUnlock} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white">
                            Confirmer
                          </Button>
                          <Button onClick={() => setShowUnlockConfirm(false)} variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => setShowUnlockConfirm(true)}
                          className="w-20 h-20 rounded-full bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center hover:bg-emerald-500/30 transition-colors border border-emerald-500/30"
                        >
                          <Unlock className="h-10 w-10 text-emerald-400" />
                        </button>
                        <p className="text-white/70 text-sm font-medium">{"Cliquez pour d\u00e9bloquer le contenu complet"}</p>
                      </>
                    )}
                  </div>
                ) : (
                  /* Playable content */
                  <>
                    {/* Center play/pause */}
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`absolute inset-0 flex items-center justify-center z-10 transition-opacity ${isPlaying ? "opacity-0 group-hover/player:opacity-100" : "opacity-100"}`}
                    >
                      <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors group border border-white/30">
                        {isPlaying ? (
                          <Pause className="h-10 w-10 text-white" />
                        ) : isVideo ? (
                          <Play className="h-10 w-10 text-white ml-1" />
                        ) : isPodcast ? (
                          <Headphones className="h-10 w-10 text-white" />
                        ) : (
                          <BookOpen className="h-10 w-10 text-white" />
                        )}
                      </div>
                    </button>

                    {/* Player controls bar */}
                    <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 z-20 transition-opacity ${isPlaying ? "opacity-0 group-hover/player:opacity-100" : "opacity-100"}`}>
                      {/* Progress bar */}
                      <div className="w-full h-1 bg-white/20 rounded-full mb-3 cursor-pointer group/bar">
                        <div className="h-full bg-emerald-500 rounded-full relative w-[35%] group-hover/bar:h-1.5 transition-all">
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-400 rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-emerald-400 transition-colors">
                            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
                          </button>
                          <button className="text-white/60 hover:text-white transition-colors">
                            <Volume2 className="h-5 w-5" />
                          </button>
                          <span className="text-white/50 text-xs">{"05:32 / "}{content.duration || "18:45"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="text-white/60 hover:text-white transition-colors">
                            <Settings2 className="h-4 w-4" />
                          </button>
                          <button className="text-white/60 hover:text-white transition-colors">
                            <Maximize2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Badge type */}
                <Badge className={`absolute top-4 left-4 z-30 ${isVideo ? "bg-red-600/90" : isPodcast ? "bg-purple-600/90" : "bg-amber-600/90"} text-white border-0`}>
                  {isVideo && <><Film className="h-3 w-3 mr-1" />{"Vid\u00e9o"}</>}
                  {cType === "text" && <><FileText className="h-3 w-3 mr-1" />{"\u00c9crit"}</>}
                  {isPodcast && <><Mic className="h-3 w-3 mr-1" />Podcast</>}
                </Badge>

                {/* VISUAL badges */}
                {badges.length > 0 && (
                  <div className="absolute top-12 left-4 z-30 flex gap-1">
                    {badges.map((b) => (
                      <Badge key={b.label} className={`${b.bg} text-white border-0 text-[10px]`}>
                        <b.icon className="h-3 w-3 mr-1" />
                        {b.label}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Free badge */}
                {content.isFree && (
                  <Badge className="absolute top-4 right-4 z-30 bg-emerald-600/90 text-white border-0">
                    Gratuit
                  </Badge>
                )}
              </div>

              {/* Title and info */}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{content.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-white/60">
                  <span className="text-emerald-400 font-medium">{content.creatorName}</span>
                  <span className="flex items-center gap-1">
                    {isVideo && <><Clock className="h-4 w-4" />{content.duration}</>}
                    {cType === "text" && <><BookOpen className="h-4 w-4" />{content.wordCount?.toLocaleString()} mots</>}
                    {isPodcast && <><Headphones className="h-4 w-4" />{content.episodeCount} {"\u00e9pisodes"} - {content.duration}</>}
                  </span>
                  <span>{content.category}</span>
                </div>
              </div>

              {/* Action buttons row */}
              <div className="flex flex-wrap gap-2">
                {isGuest ? (
                  <Link href="/signup">
                    <Button variant="outline" className="bg-transparent border-white/20 text-white/50 hover:bg-white/10">
                      <Lock className="h-4 w-4 mr-2" />
                      Inscrivez-vous pour interagir
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`bg-transparent border-white/20 hover:bg-white/10 ${isFavorite ? "text-red-400 border-red-500/30" : "text-white"}`}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                      {isFavorite ? "Favori" : "Soutenir"}
                    </Button>
                    <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Commenter
                    </Button>
                    <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Favoris
                    </Button>
                    <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                      <Share2 className="h-4 w-4 mr-2" />
                      Partager
                    </Button>
                    {isUnlocked && !content.isFree && (
                      <Button variant="outline" className="bg-transparent border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10">
                        <Download className="h-4 w-4 mr-2" />
                        {"T\u00e9l\u00e9charger"}
                      </Button>
                    )}
                    <ReportButton targetId={content.id} targetType="content" targetName={content.title} variant="full" size="sm" />
                  </>
                )}
              </div>

              {/* Description */}
              <Card className="bg-slate-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 leading-relaxed">{content.description}</p>
                </CardContent>
              </Card>

              {/* Visual Social Thread */}
              <Card className="bg-slate-900/50 border-white/10">
                <CardContent className="p-4 sm:p-6">
                  <VisualSocialFeed mode="content" contentType={cType as ContentType} contentId={content.id} />
                </CardContent>
              </Card>

              {/* ---------- Recommendations ---------- */}
              {recommendations.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-400" />
                    Vous aimerez aussi
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {recommendations.map((rec) => (
                      <Link key={rec.id} href={`/video/${rec.id}`} className="group/rec block">
                        <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-2">
                          <Image src={rec.coverUrl || "/placeholder.svg"} alt={rec.title} fill className="object-cover transition-transform duration-300 group-hover/rec:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-2">
                            <p className="text-white text-xs font-medium line-clamp-1">{rec.title}</p>
                            <p className="text-white/50 text-[10px]">{rec.creatorName}</p>
                          </div>
                          {/* Duration pill */}
                          <div className="absolute top-1.5 right-1.5 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded backdrop-blur-sm">
                            {rec.duration || `${rec.wordCount?.toLocaleString()} mots`}
                          </div>
                          {/* Hover play */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/rec:opacity-100 transition-opacity bg-emerald-600/10">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                              <Play className="h-4 w-4 text-white fill-white" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ---------- SIDEBAR ---------- */}
            <div className="space-y-6">
              {/* Support Block */}
              <Card className="bg-gradient-to-br from-emerald-950/50 to-teal-950/50 border-emerald-500/20">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="h-5 w-5 text-emerald-400" />
                    <h3 className="text-white font-semibold">Soutenez ce projet</h3>
                  </div>
                  <p className="text-white/60 text-sm mb-4">
                    {"Une participation m\u00eame minime peut aider un cr\u00e9ateur. Si le projet r\u00e9ussit, un partage des gains peut \u00eatre attribu\u00e9."}
                  </p>
                  <div className="space-y-3">
                    <Progress value={progressPercent} className="h-3 bg-slate-800" />
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-400 font-bold text-lg">{content.currentInvestment.toLocaleString()}{"\u20ac"}</span>
                      <span className="text-white/60">sur {content.investmentGoal.toLocaleString()}{"\u20ac"}</span>
                    </div>
                    <div className="text-center text-white/60 text-sm">{progressPercent.toFixed(0)}% {"financ\u00e9"}</div>
                  </div>
                  <div className="flex items-center justify-center gap-2 py-3 mt-3 bg-slate-800/50 rounded-lg">
                    <Users className="h-5 w-5 text-emerald-400" />
                    <span className="text-white font-medium">{content.investorCount} investisseurs</span>
                  </div>
                </CardContent>
              </Card>

              {/* Investment Card */}
              <Card className="bg-slate-900/50 border-white/10 sticky top-28">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                    Investissement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {canInvest ? (
                    <div className="space-y-3">
                      <p className="text-white/60 text-sm text-center">{"Choisissez votre montant d'investissement"}</p>
                      <div className="grid grid-cols-4 gap-2">
                        {[2, 5, 10, 20].map((amount) => (
                          <Button key={amount} variant="outline" className="bg-transparent border-emerald-500/50 text-emerald-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600">
                            {amount}{"\u20ac"}
                          </Button>
                        ))}
                      </div>
                      <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white h-12 text-lg">
                        Investir maintenant
                      </Button>
                    </div>
                  ) : isAuthed ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg border border-emerald-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-5 w-5 text-emerald-400" />
                          <h4 className="text-white font-semibold text-sm">Soutenez les projets qui vous inspirent</h4>
                        </div>
                        <p className="text-white/60 text-sm mb-3">
                          {"Investissez dans ce "}
                          {isVideo ? "projet audiovisuel" : isPodcast ? "podcast" : "contenu litt\u00e9raire"}
                          {" et recevez des retours sur vos gains. Choisissez un montant entre deux et vingt euros."}
                        </p>
                        <Link href="/dashboard/settings">
                          <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white">
                            <CreditCard className="h-4 w-4 mr-2" />
                            {"Devenir "}
                            {isVideo ? "Investisseur" : isPodcast ? "Auditeur" : "Investi-lecteur"}
                          </Button>
                        </Link>
                        <p className="text-xs text-white/40 text-center mt-2">{"Caution remboursable en cas de r\u00e9siliation"}</p>
                      </div>
                      <Link href="/dashboard/visupoints">
                        <Button variant="outline" className="w-full bg-transparent border-amber-500/30 text-amber-400 hover:bg-amber-600/10">
                          <Star className="h-4 w-4 mr-2" />
                          Gagner des VISUpoints en partageant
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center space-y-3">
                      <p className="text-white/60 text-sm">{"Connectez-vous pour investir dans ce projet"}</p>
                      <Link href="/signup">
                        <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white">
                          {"Cr\u00e9er un compte"}
                        </Button>
                      </Link>
                      <Link href="/login">
                        <Button variant="outline" className="w-full bg-transparent border-white/20 text-white hover:bg-white/10">
                          Se connecter
                        </Button>
                      </Link>
                    </div>
                  )}

                  {/* Legal */}
                  <div className="space-y-1 pt-2 border-t border-white/5">
                    <p className="text-xs text-white/40 text-center">
                      {"Investir comporte des risques. Les gains ne sont pas garantis. VISUAL n'est pas un jeu de hasard."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Creator Card */}
              <Card className="bg-slate-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Eye className="h-5 w-5 text-emerald-400" />
                    {"\u00c0 propos du cr\u00e9ateur"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <span className="text-emerald-400 font-bold">{content.creatorName.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-medium text-white">{content.creatorName}</div>
                      <div className="text-sm text-white/60">{"Cr\u00e9ateur VISUAL"}</div>
                    </div>
                  </div>
                  <p className="text-white/50 text-xs mb-3">
                    {"Votre projet peut trouver son public sur VISUAL."}
                  </p>
                  <Button variant="outline" className="w-full bg-transparent border-white/20 text-white hover:bg-white/10">
                    Voir le profil
                  </Button>
                </CardContent>
              </Card>

              {/* Anti-piracy */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-900/30 border border-white/5">
                <Shield className="h-4 w-4 text-emerald-500 shrink-0" />
                <p className="text-white/40 text-[11px]">
                  {"Sur VISUAL, chaque visionnage contribue \u00e0 soutenir les cr\u00e9ateurs."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
