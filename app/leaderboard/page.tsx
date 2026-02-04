"use client"

import { useState } from "react"
import { Trophy, TrendingUp, Star, Film, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VisualHeader } from "@/components/visual-header"
import { Footer } from "@/components/footer"
import { LEADERBOARD_DATA } from "@/lib/mock-data"

type LeaderboardTab = "investors" | "creators" | "visupoints"

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("investors")

  return (
    <div className="min-h-screen bg-slate-950">
      <VisualHeader />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
              <Trophy className="h-8 w-8 text-amber-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Classement
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Découvrez les meilleurs investisseurs, créateurs et utilisateurs
              les plus actifs de VISUAL
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-8 p-1 bg-slate-900/50 rounded-lg w-fit mx-auto">
            <Button
              variant={activeTab === "investors" ? "default" : "ghost"}
              onClick={() => setActiveTab("investors")}
              className={
                activeTab === "investors"
                  ? "bg-emerald-600 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Top Investisseurs
            </Button>
            <Button
              variant={activeTab === "creators" ? "default" : "ghost"}
              onClick={() => setActiveTab("creators")}
              className={
                activeTab === "creators"
                  ? "bg-red-600 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }
            >
              <Film className="h-4 w-4 mr-2" />
              Top Créateurs
            </Button>
            <Button
              variant={activeTab === "visupoints" ? "default" : "ghost"}
              onClick={() => setActiveTab("visupoints")}
              className={
                activeTab === "visupoints"
                  ? "bg-amber-600 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }
            >
              <Star className="h-4 w-4 mr-2" />
              Top VISUpoints
            </Button>
          </div>

          {/* Leaderboard Content */}
          <div className="max-w-3xl mx-auto">
            {activeTab === "investors" && (
              <Card className="bg-slate-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                    Top 5 Investisseurs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {LEADERBOARD_DATA.topInvestors.map((user) => (
                    <div
                      key={user.rank}
                      className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          user.rank === 1
                            ? "bg-amber-500/30 text-amber-400"
                            : user.rank === 2
                              ? "bg-slate-400/30 text-slate-300"
                              : user.rank === 3
                                ? "bg-orange-600/30 text-orange-400"
                                : "bg-slate-700 text-white/60"
                        }`}
                      >
                        {user.rank === 1 ? (
                          <Crown className="h-5 w-5" />
                        ) : (
                          user.rank
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-white/60">
                          {user.projects} projets soutenus
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-400 font-bold">
                          {user.amount.toLocaleString()}€
                        </div>
                        <div className="text-xs text-white/60">investis</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeTab === "creators" && (
              <Card className="bg-slate-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Film className="h-5 w-5 text-red-400" />
                    Top 5 Créateurs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {LEADERBOARD_DATA.topCreators.map((user) => (
                    <div
                      key={user.rank}
                      className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          user.rank === 1
                            ? "bg-amber-500/30 text-amber-400"
                            : user.rank === 2
                              ? "bg-slate-400/30 text-slate-300"
                              : user.rank === 3
                                ? "bg-orange-600/30 text-orange-400"
                                : "bg-slate-700 text-white/60"
                        }`}
                      >
                        {user.rank === 1 ? (
                          <Crown className="h-5 w-5" />
                        ) : (
                          user.rank
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-white/60">
                          {user.projects} projets publiés
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-400 font-bold">
                          {user.totalRaised.toLocaleString()}€
                        </div>
                        <div className="text-xs text-white/60">collectés</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeTab === "visupoints" && (
              <Card className="bg-slate-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-400" />
                    Top 5 VISUpoints
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {LEADERBOARD_DATA.topVisupoints.map((user) => (
                    <div
                      key={user.rank}
                      className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          user.rank === 1
                            ? "bg-amber-500/30 text-amber-400"
                            : user.rank === 2
                              ? "bg-slate-400/30 text-slate-300"
                              : user.rank === 3
                                ? "bg-orange-600/30 text-orange-400"
                                : "bg-slate-700 text-white/60"
                        }`}
                      >
                        {user.rank === 1 ? (
                          <Crown className="h-5 w-5" />
                        ) : (
                          user.rank
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white">
                          {user.name}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-amber-400 font-bold">
                          {user.points.toLocaleString()}
                        </div>
                        <div className="text-xs text-white/60">points</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
