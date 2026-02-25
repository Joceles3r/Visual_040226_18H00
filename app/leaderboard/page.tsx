"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Trophy, Crown, Star, Film, FileText, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VisualHeader } from "@/components/visual-header"
import { Footer } from "@/components/footer"
import { VisualSlogan } from "@/components/visual-slogan"
import {
  LEADERBOARD_DATA,
  LEADERBOARD_CATEGORIES,
  type LeaderboardCategoryKey,
  type LeaderboardEntry,
} from "@/lib/mock-data"

const CATEGORY_ICONS: Record<LeaderboardCategoryKey, React.ComponentType<{ className?: string }>> = {
  porteur: Film,
  infoporteur: FileText,
  podcasteur: Mic,
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <div className="w-10 h-10 rounded-full bg-amber-500/30 flex items-center justify-center">
        <Crown className="h-5 w-5 text-amber-400" />
      </div>
    )
  if (rank === 2)
    return (
      <div className="w-10 h-10 rounded-full bg-slate-400/30 flex items-center justify-center font-bold text-slate-300">
        2
      </div>
    )
  if (rank === 3)
    return (
      <div className="w-10 h-10 rounded-full bg-orange-600/30 flex items-center justify-center font-bold text-orange-400">
        3
      </div>
    )
  return (
    <div className="w-10 h-10 rounded-full bg-slate-700/60 flex items-center justify-center font-bold text-white/50 text-sm">
      {rank}
    </div>
  )
}

function LeaderboardTable({
  entries,
  catKey,
}: {
  entries: LeaderboardEntry[]
  catKey: LeaderboardCategoryKey
}) {
  const cat = LEADERBOARD_CATEGORIES.find((c) => c.key === catKey)!
  const Icon = CATEGORY_ICONS[catKey]

  return (
    <Card className="bg-slate-900/50 border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2 text-lg">
          <div className={`w-8 h-8 rounded-lg ${cat.bgColor} flex items-center justify-center`}>
            <Icon className={`h-4 w-4 ${cat.color}`} />
          </div>
          {cat.label}
          <span className="text-white/40 text-sm font-normal ml-auto">
            {entries.length} classement{entries.length > 1 ? "s" : ""}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
          {entries.map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                entry.rank <= 3
                  ? "bg-slate-800/70 border border-white/5"
                  : "bg-slate-800/30 hover:bg-slate-800/50"
              }`}
            >
              <RankBadge rank={entry.rank} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">{entry.name}</div>
              </div>
              <div className="text-right shrink-0">
                <div className={`font-bold ${cat.color}`}>{entry.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function LeaderboardPage() {
  const searchParams = useSearchParams()
  const topParam = Number(searchParams.get("top")) || 10
  const tier = ([10, 100, 500] as const).includes(topParam as 10 | 100 | 500) ? topParam : 10
  const [activeCategory, setActiveCategory] = useState<LeaderboardCategoryKey>("porteur")

  const entries = LEADERBOARD_DATA[activeCategory].slice(0, tier)

  return (
    <div className="min-h-screen bg-slate-950">
      <VisualHeader />

      <main className="pt-28 pb-20 cinema-section">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
              <Trophy className="h-8 w-8 text-amber-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              {"Classements TOP "}{tier}
            </h1>
            <div className="mb-5">
              <VisualSlogan size="sm" opacity="high" withLines />
            </div>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
{"D\u00e9couvrez les meilleurs porteurs, infoporteurs et podcasteurs de VISUAL"}
            </p>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 p-1 bg-slate-900/40 rounded-lg w-fit mx-auto">
            {LEADERBOARD_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.key]
              return (
                <Button
                  key={cat.key}
                  variant={activeCategory === cat.key ? "default" : "ghost"}
                  onClick={() => setActiveCategory(cat.key)}
                  size="sm"
                  className={
                    activeCategory === cat.key
                      ? `bg-slate-800 ${cat.color} border ${cat.borderColor}`
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }
                >
                  <Icon className="h-4 w-4 mr-1.5" />
                  {cat.label}
                </Button>
              )
            })}
          </div>

          {/* Leaderboard Content */}
          <div className="max-w-3xl mx-auto">
            <LeaderboardTable entries={entries} catKey={activeCategory} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
