"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Trophy, Star, Flame, TrendingUp, Award, Zap, Users, Heart, BarChart3,
  Play, Crown, CheckCircle, ArrowLeft, Film, FileText, Mic, Sparkles, Medal, ChevronRight
} from "lucide-react"
import { getTop100ByCategory } from "@/lib/discovery/engine"

type TierOption = 10 | 100 | 500
type CategoryOption = "all" | "video" | "text" | "podcast"

const TIER_CONFIG: Record<TierOption, { label: string; color: string; bg: string; border: string }> = {
  10: { label: "TOP 10", color: "text-amber-300", bg: "bg-amber-500/20", border: "border-amber-500/40" },
  100: { label: "TOP 100", color: "text-teal-300", bg: "bg-teal-500/20", border: "border-teal-500/40" },
  500: { label: "TOP 500", color: "text-slate-300", bg: "bg-slate-500/20", border: "border-slate-500/40" },
}

const CATEGORY_CONFIG: Record<CategoryOption, { label: string; icon: any; color: string; bg: string }> = {
  all: { label: "Tous", icon: Sparkles, color: "text-white", bg: "bg-white/10" },
  video: { label: "Video", icon: Film, color: "text-rose-300", bg: "bg-rose-500/15" },
  text: { label: "Ecrit", icon: FileText, color: "text-sky-300", bg: "bg-sky-500/15" },
  podcast: { label: "Podcast", icon: Mic, color: "text-violet-300", bg: "bg-violet-500/15" },
}

/* ---------- Rank Medal Component ---------- */
function RankMedal({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
        <Crown className="h-6 w-6 text-white" />
      </div>
    )
  }
  if (rank === 2) {
    return (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center shadow-lg shadow-slate-400/30">
        <Medal className="h-6 w-6 text-white" />
      </div>
    )
  }
  if (rank === 3) {
    return (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
        <Medal className="h-6 w-6 text-white" />
      </div>
    )
  }
  if (rank <= 10) {
    return (
      <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
        <span className="text-amber-300 font-bold text-sm">{rank}</span>
      </div>
    )
  }
  if (rank <= 50) {
    return (
      <div className="w-10 h-10 rounded-full bg-teal-500/15 border border-teal-500/30 flex items-center justify-center">
        <span className="text-teal-300 font-semibold text-sm">{rank}</span>
      </div>
    )
  }
  return (
    <div className="w-10 h-10 rounded-full bg-slate-700/50 border border-slate-600/50 flex items-center justify-center">
      <span className="text-slate-400 font-medium text-sm">{rank}</span>
    </div>
  )
}

/* ---------- Project Card ---------- */
function ProjectCard({ rank, project, score }: { rank: number; project: any; score: any }) {
  const visualScore = score?.visualScore ?? 0
  const waveLevel = score?.waveLevel ?? 0
  const scores = score?.scores ?? { investment: 0, engagement: 0, longevity: 0, momentum: 0, community: 0, creator: 0 }
  const progressPercent = Math.min((visualScore / 1000) * 100, 100)
  
  const isTop3 = rank <= 3
  const isTop10 = rank <= 10
  const isTop50 = rank <= 50

  const cardStyle = isTop3 
    ? "border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-600/5 shadow-lg shadow-amber-500/10" 
    : isTop10 
    ? "border-teal-500/25 bg-teal-500/5" 
    : isTop50 
    ? "border-slate-600/30 bg-slate-800/30" 
    : "border-slate-700/30 bg-slate-900/50"

  return (
    <Link href={`/video/${project.id}`}>
      <Card className={`${cardStyle} hover:border-teal-400/50 hover:bg-teal-500/5 transition-all duration-300 cursor-pointer group`}>
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center gap-4">
            {/* Rank */}
            <RankMedal rank={rank} />

            {/* Project Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <h3 className="text-white font-semibold text-base truncate group-hover:text-teal-200 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-sm truncate">{project.creatorName}</p>
                </div>
                {isTop10 && (
                  <Badge className="shrink-0 bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs">
                    <Trophy className="h-3 w-3 mr-1" />
                    Elite
                  </Badge>
                )}
              </div>

              {/* Metrics */}
              <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-teal-400" />
                  {project.investorCount}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5 text-rose-400" />
                  {project.totalVotes}
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  Wave {waveLevel}
                </span>
              </div>

              {/* Score Bar */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Score VIXUAL</span>
                  <span className={`font-bold ${isTop10 ? "text-amber-300" : "text-teal-300"}`}>
                    {visualScore.toFixed(0)}/1000
                  </span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${isTop10 ? "bg-gradient-to-r from-amber-400 to-yellow-500" : "bg-gradient-to-r from-teal-400 to-cyan-400"}`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Arrow */}
            <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-teal-400 group-hover:translate-x-1 transition-all shrink-0" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

/* ---------- Tier Selector ---------- */
function TierSelector({ value, onChange }: { value: TierOption; onChange: (v: TierOption) => void }) {
  return (
    <div className="flex items-center gap-2 p-1 bg-slate-800/50 rounded-xl border border-slate-700/50">
      {([10, 100, 500] as TierOption[]).map((tier) => {
        const config = TIER_CONFIG[tier]
        const isActive = value === tier
        return (
          <button
            key={tier}
            onClick={() => onChange(tier)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              isActive 
                ? `${config.bg} ${config.color} ${config.border} border shadow-sm` 
                : "text-slate-400 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            {config.label}
          </button>
        )
      })}
    </div>
  )
}

/* ---------- Category Selector ---------- */
function CategorySelector({ value, onChange }: { value: CategoryOption; onChange: (v: CategoryOption) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {(["all", "video", "text", "podcast"] as CategoryOption[]).map((cat) => {
        const config = CATEGORY_CONFIG[cat]
        const Icon = config.icon
        const isActive = value === cat
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              isActive 
                ? `${config.bg} ${config.color} border border-white/10 shadow-sm` 
                : "text-slate-400 hover:text-white hover:bg-slate-700/30"
            }`}
          >
            <Icon className="h-4 w-4" />
            {config.label}
          </button>
        )
      })}
    </div>
  )
}

/* ---------- Stats Summary ---------- */
function StatsSummary({ projects, tier }: { projects: any[]; tier: TierOption }) {
  const totalInvestment = projects.reduce((s, p) => s + (p.currentInvestment || 0), 0)
  const totalSupporters = projects.reduce((s, p) => s + (p.investorCount || 0), 0)
  const avgScore = projects.length > 0 
    ? (projects.reduce((s, p) => s + (p.score?.visualScore || 0), 0) / projects.length)
    : 0

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: "Projets", value: projects.length, icon: BarChart3, color: "text-teal-400" },
        { label: "Investis", value: `${(totalInvestment / 1000).toFixed(0)}k`, icon: TrendingUp, color: "text-emerald-400" },
        { label: "Soutiens", value: totalSupporters.toLocaleString(), icon: Heart, color: "text-rose-400" },
        { label: "Score moy.", value: avgScore.toFixed(0), icon: Star, color: "text-amber-400" },
      ].map((stat) => (
        <div key={stat.label} className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-3 text-center">
          <stat.icon className={`h-5 w-5 mx-auto mb-1 ${stat.color}`} />
          <p className="text-lg font-bold text-white">{stat.value}</p>
          <p className="text-xs text-slate-500">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

/* ---------- Main Page ---------- */
export default function LeaderboardPage() {
  const router = useRouter()
  const [tier, setTier] = useState<TierOption>(10)
  const [category, setCategory] = useState<CategoryOption>("all")

  const projects = useMemo(() => {
    return getTop100ByCategory(category === "all" ? undefined : category, tier)
  }, [category, tier])

  const tierConfig = TIER_CONFIG[tier]
  const catConfig = CATEGORY_CONFIG[category]

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header avec navigation retour */}
      <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
              aria-label="Retour"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <Trophy className="h-6 w-6 text-amber-400" />
                <span>VIXUAL Classements</span>
              </h1>
              <p className="text-sm text-slate-500 hidden sm:block">Decouvrez les meilleurs projets de la communaute</p>
            </div>
            <Link href="/" className="text-sm text-teal-400 hover:text-teal-300 transition-colors hidden sm:block">
              Accueil
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-teal-500/20 border border-amber-500/20 mb-4">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-slate-300">Classement officiel VIXUAL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className={tierConfig.color}>{tierConfig.label}</span>
            {category !== "all" && (
              <span className="text-slate-500"> - {catConfig.label}</span>
            )}
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Les projets les mieux notes selon notre algorithme de decouverte base sur 6 criteres d'evaluation.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <TierSelector value={tier} onChange={setTier} />
          <div className="hidden sm:block w-px h-8 bg-slate-700" />
          <CategorySelector value={category} onChange={setCategory} />
        </div>

        {/* Stats */}
        <div className="mb-8">
          <StatsSummary projects={projects} tier={tier} />
        </div>

        {/* Leaderboard */}
        <div className="space-y-3">
          {projects.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun projet dans cette categorie pour le moment.</p>
            </div>
          ) : (
            projects.map((proj, idx) => (
              <ProjectCard
                key={proj.id}
                rank={idx + 1}
                project={proj}
                score={proj.score || { visualScore: 500, waveLevel: 1, scores: {} }}
              />
            ))
          )}
        </div>

        {/* Footer Explanation */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-amber-500/20">
              <Award className="h-5 w-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold">Comment fonctionne le classement ?</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 text-sm text-slate-400">
            <div>
              <p className="font-medium text-slate-300 mb-2">Criteres principaux</p>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-teal-400" />
                  Investissement (40%) - Montants collectes
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-400" />
                  Engagement (20%) - Votes et interactions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Longevite (15%) - Constance du projet
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-slate-300 mb-2">Criteres secondaires</p>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-400" />
                  Momentum (10%) - Croissance recente
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-sky-400" />
                  Communaute (10%) - Nombre de soutiens
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-400" />
                  Createur (5%) - Credibilite et historique
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
