"use client"

import { Star, Share2, Users, MessageSquare, Calendar, Gift, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"

const MISSIONS = [
  {
    id: 1,
    title: "Parrainez un ami",
    description: "Invitez un ami à rejoindre VISUAL",
    points: 100,
    icon: Users,
    completed: false,
  },
  {
    id: 2,
    title: "Partagez un projet",
    description: "Partagez un projet sur les réseaux sociaux",
    points: 25,
    icon: Share2,
    completed: true,
  },
  {
    id: 3,
    title: "Commentez",
    description: "Laissez un commentaire sur un projet",
    points: 10,
    icon: MessageSquare,
    completed: false,
  },
  {
    id: 4,
    title: "Connexion quotidienne",
    description: "Connectez-vous chaque jour",
    points: 5,
    icon: Calendar,
    completed: true,
  },
]

const LEVELS = [
  { name: "Bronze", min: 0, max: 500, color: "text-orange-400" },
  { name: "Argent", min: 500, max: 1500, color: "text-slate-300" },
  { name: "Or", min: 1500, max: 3500, color: "text-amber-400" },
  { name: "Platine", min: 3500, max: 7000, color: "text-cyan-300" },
  { name: "Diamant", min: 7000, max: Infinity, color: "text-indigo-400" },
]

const REWARDS = [
  { level: "Bronze", reward: "Badge Bronze + Accès prioritaire aux nouveautés" },
  { level: "Argent", reward: "Badge Argent + 5% de réduction sur les commissions" },
  { level: "Or", reward: "Badge Or + 10% de réduction + Support prioritaire" },
  { level: "Platine", reward: "Badge Platine + 15% de réduction + Accès anticipé" },
  { level: "Diamant", reward: "Badge Diamant + 20% de réduction + VIP exclusif" },
]

export default function VisupointsPage() {
  const { user } = useAuth()
  const currentPoints = user?.visupoints || 150

  const currentLevel = LEVELS.find(
    (l) => currentPoints >= l.min && currentPoints < l.max
  ) || LEVELS[0]
  const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1]
  const progress = nextLevel
    ? ((currentPoints - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100
    : 100

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Mes VISUpoints</h1>
        <p className="text-white/60">
          Gagnez des points et débloquez des avantages exclusifs
        </p>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-500/30 md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Star className="h-10 w-10 text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-white">
                    {currentPoints}
                  </span>
                  <span className="text-white/60">VISUpoints</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`font-medium ${currentLevel.color}`}>
                    Niveau {currentLevel.name}
                  </span>
                  {nextLevel && (
                    <span className="text-white/40">
                      → {nextLevel.min - currentPoints} pts pour {nextLevel.name}
                    </span>
                  )}
                </div>
                <Progress value={progress} className="h-2 bg-slate-800" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
            <Trophy className="h-10 w-10 text-emerald-400 mb-3" />
            <p className="text-white font-medium">Avantage actuel</p>
            <p className="text-sm text-white/60 mt-1">
              {REWARDS.find((r) => r.level === currentLevel.name)?.reward}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Missions */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Gift className="h-5 w-5 text-emerald-400" />
            Missions disponibles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {MISSIONS.map((mission) => (
            <div
              key={mission.id}
              className={`flex items-center gap-4 p-4 rounded-lg ${
                mission.completed
                  ? "bg-emerald-500/10 border border-emerald-500/30"
                  : "bg-slate-800/50"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  mission.completed ? "bg-emerald-500/20" : "bg-slate-700"
                }`}
              >
                <mission.icon
                  className={`h-6 w-6 ${
                    mission.completed ? "text-emerald-400" : "text-white/60"
                  }`}
                />
              </div>
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    mission.completed ? "text-emerald-400" : "text-white"
                  }`}
                >
                  {mission.title}
                </p>
                <p className="text-sm text-white/60">{mission.description}</p>
              </div>
              <div className="text-right">
                <span className="text-amber-400 font-bold">
                  +{mission.points} pts
                </span>
                {mission.completed ? (
                  <p className="text-xs text-emerald-400">Complété</p>
                ) : (
                  <Button
                    size="sm"
                    className="mt-1 bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    Faire
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Levels */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Niveaux et récompenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {LEVELS.filter((l) => l.max !== Infinity).map((level, idx) => {
              const reward = REWARDS.find((r) => r.level === level.name)
              const isCurrentOrPast = currentPoints >= level.min
              return (
                <div
                  key={level.name}
                  className={`flex items-center gap-4 p-3 rounded-lg ${
                    currentLevel.name === level.name
                      ? "bg-emerald-500/10 border border-emerald-500/30"
                      : isCurrentOrPast
                        ? "bg-slate-800/30"
                        : "bg-slate-800/50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCurrentOrPast ? "bg-emerald-500/20" : "bg-slate-700"
                    }`}
                  >
                    <Star
                      className={`h-5 w-5 ${
                        isCurrentOrPast ? level.color : "text-white/40"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${level.color}`}>{level.name}</p>
                    <p className="text-xs text-white/40">
                      {level.min} - {level.max} pts
                    </p>
                  </div>
                  <p className="text-sm text-white/60 max-w-xs text-right">
                    {reward?.reward}
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
