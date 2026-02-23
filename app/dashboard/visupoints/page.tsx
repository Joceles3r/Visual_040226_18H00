"use client"

import { Star, Share2, Users, MessageSquare, Calendar, Gift, Trophy, Lock, ArrowRight, ShieldAlert, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import {
  VISUPOINTS_CONVERSION_THRESHOLD,
  VISUPOINTS_PER_EUR,
  convertVisupoints,
} from "@/lib/payout/constants"
import {
  canWithdraw,
  canInvest,
  canConvertVisupoints,
  MINOR_VISUPOINTS_CAP,
} from "@/lib/visupoints-engine"

const MISSIONS = [
  {
    id: 1,
    title: "Parrainez un ami",
    description: "Invitez un ami \u00e0 rejoindre VISUAL",
    points: 100,
    icon: Users,
    completed: false,
  },
  {
    id: 2,
    title: "Partagez un projet",
    description: "Partagez un projet sur les r\u00e9seaux sociaux",
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
  { level: "Bronze", reward: "Badge Bronze + Acc\u00e8s prioritaire aux nouveaut\u00e9s" },
  { level: "Argent", reward: "Badge Argent + 5% de r\u00e9duction sur les commissions" },
  { level: "Or", reward: "Badge Or + 10% de r\u00e9duction + Support prioritaire" },
  { level: "Platine", reward: "Badge Platine + 15% de r\u00e9duction + Acc\u00e8s anticip\u00e9" },
  { level: "Diamant", reward: "Badge Diamant + 20% de r\u00e9duction + VIP exclusif" },
]

export default function VisupointsPage() {
  const { user } = useAuth()
  const currentPoints = user?.visupoints || 150
  const userIsMinor = user?.isMinor ?? false
  const kycVerified = user?.kycVerified ?? false

  // Restrictions
  const withdrawStatus = canWithdraw(userIsMinor, kycVerified)
  const investStatus = canInvest(userIsMinor)
  const convertStatus = canConvertVisupoints(userIsMinor)
  const conversion = convertVisupoints(currentPoints)

  // Plafond et niveaux
  const cap = userIsMinor ? MINOR_VISUPOINTS_CAP : null
  const capProgress = cap ? Math.min((currentPoints / cap) * 100, 100) : null

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
          {"Gagnez des points et d\u00e9bloquez des avantages exclusifs"}
        </p>
      </div>

      {/* Alerte Mineur */}
      {userIsMinor && (
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
              <ShieldAlert className="h-5 w-5 text-amber-400" />
            </div>
            <div className="space-y-2">
              <p className="text-white font-medium">{"Compte mineur (16\u201317 ans)"}</p>
              <ul className="text-white/60 text-sm space-y-1">
                <li className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  {"Plafond : 10 000 VISUpoints (100\u20ac)"}
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  {"Aucun retrait ni investissement avant 18 ans"}
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  {"Conversion en euros bloqu\u00e9e jusqu'\u00e0 la majorit\u00e9"}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  {"Vos VISUpoints sont conserv\u00e9s et seront d\u00e9bloqu\u00e9s \u00e0 vos 18 ans"}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

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
                    {currentPoints.toLocaleString("fr-FR")}
                  </span>
                  <span className="text-white/60">VISUpoints</span>
                  {cap && (
                    <span className="text-amber-400/70 text-sm">/ {cap.toLocaleString("fr-FR")}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`font-medium ${currentLevel.color}`}>
                    {"Niveau " + currentLevel.name}
                  </span>
                  {nextLevel && (
                    <span className="text-white/40">
                      {"\u2192 " + (nextLevel.min - currentPoints).toLocaleString("fr-FR") + " pts pour " + nextLevel.name}
                    </span>
                  )}
                </div>
                <Progress value={progress} className="h-2 bg-slate-800" />

                {/* Barre plafond mineur */}
                {capProgress !== null && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-white/40 mb-1">
                      <span>Plafond mineur</span>
                      <span>{Math.round(capProgress)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${capProgress >= 90 ? "bg-red-500" : capProgress >= 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                        style={{ width: `${capProgress}%` }}
                      />
                    </div>
                    {capProgress >= 90 && (
                      <p className="text-red-400/70 text-xs mt-1">
                        {"Vous approchez du plafond. Les points au-del\u00e0 de 10 000 ne seront pas cr\u00e9dit\u00e9s."}
                      </p>
                    )}
                  </div>
                )}
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

      {/* Conversion Card */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-emerald-400" />
            Conversion en euros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              <p className="text-white/50 text-sm">Taux</p>
              <p className="text-white font-bold text-lg mt-1">{VISUPOINTS_PER_EUR + " pts = 1\u20ac"}</p>
            </div>
            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              <p className="text-white/50 text-sm">Seuil minimum</p>
              <p className="text-white font-bold text-lg mt-1">{VISUPOINTS_CONVERSION_THRESHOLD.toLocaleString("fr-FR") + " pts"}</p>
              <p className="text-white/40 text-xs mt-0.5">{(VISUPOINTS_CONVERSION_THRESHOLD / VISUPOINTS_PER_EUR) + "\u20ac"}</p>
            </div>
            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              <p className="text-white/50 text-sm">Montant convertible</p>
              {convertStatus.allowed ? (
                <>
                  <p className="text-emerald-400 font-bold text-lg mt-1">{conversion.eurosConverted + "\u20ac"}</p>
                  <p className="text-white/40 text-xs mt-0.5">{conversion.pointsRemaining + " pts restants"}</p>
                </>
              ) : (
                <div className="mt-1 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-amber-400" />
                  <p className="text-amber-400/80 text-sm">{"Bloqu\u00e9"}</p>
                </div>
              )}
            </div>
          </div>

          {!convertStatus.allowed && convertStatus.reason && (
            <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-amber-400/80 text-sm">{convertStatus.reason}</p>
            </div>
          )}

          {convertStatus.allowed && conversion.eligibleForConversion && (
            <div className="mt-4 flex items-center gap-3">
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">
                {"Convertir " + conversion.eurosConverted + "\u20ac en cr\u00e9dit interne"}
              </Button>
              <p className="text-white/40 text-xs">
                {"Le cr\u00e9dit sera ajout\u00e9 \u00e0 votre Wallet VISUAL."}
              </p>
            </div>
          )}

          {!withdrawStatus.allowed && !userIsMinor && withdrawStatus.reason && (
            <div className="mt-3 bg-sky-500/10 border border-sky-500/20 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
              <p className="text-sky-400/80 text-sm">{withdrawStatus.reason}</p>
            </div>
          )}
        </CardContent>
      </Card>

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
                  <p className="text-xs text-emerald-400">{"Compl\u00e9t\u00e9"}</p>
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
          <CardTitle className="text-white">{"Niveaux et r\u00e9compenses"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {LEVELS.filter((l) => l.max !== Infinity).map((level) => {
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
                      {level.min.toLocaleString("fr-FR") + " - " + level.max.toLocaleString("fr-FR") + " pts"}
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

      {/* Note juridique VISUpoints */}
      <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5 text-center">
        <p className="text-white/30 text-xs leading-relaxed">
          {"Les VISUpoints constituent un avantage promotionnel interne \u00e0 VISUAL. Ils ne repr\u00e9sentent pas une cr\u00e9ance financi\u00e8re exigible. La conversion en euros est soumise aux conditions d\u00e9finies dans les "}
          <a href="/legal/cgv" className="text-emerald-400/50 hover:text-emerald-400/70 underline underline-offset-2">CGV</a>
          {" et les "}
          <a href="/legal/terms" className="text-emerald-400/50 hover:text-emerald-400/70 underline underline-offset-2">CGU</a>
          {" de la plateforme."}
        </p>
      </div>
    </div>
  )
}
