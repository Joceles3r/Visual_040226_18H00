"use client"

import VisualSocialFeed from "@/components/visual-social-feed"
import { VisualHeader } from "@/components/visual-header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import {
  MessageCircle, Shield, Sparkles, Clock, Hash,
  Ban, Star, Users, Zap,
} from "lucide-react"
import {
  REACTION_CONFIG, REACTION_TYPES,
  MAX_POST_LENGTH, MAX_TAGS_PER_POST, MAX_POSTS_PER_DAY,
  VISUPOINTS_PER_POST, VISUPOINTS_PER_REACTION_RECEIVED,
} from "@/lib/visual-social"

function RulesCard() {
  const rules = [
    { icon: MessageCircle, text: `${MAX_POST_LENGTH} caract\u00e8res max par post`, color: "text-emerald-400" },
    { icon: Hash, text: `${MAX_TAGS_PER_POST} tags officiels max par post`, color: "text-sky-400" },
    { icon: Clock, text: `${MAX_POSTS_PER_DAY} posts maximum par jour`, color: "text-amber-400" },
    { icon: Ban, text: "Pas de liens, images ou HTML", color: "text-red-400" },
    { icon: Shield, text: "Mod\u00e9ration communautaire (5 signalements = masquage)", color: "text-purple-400" },
  ]
  return (
    <Card className="bg-slate-900/40 border-white/5">
      <CardContent className="p-4">
        <h3 className="text-white/70 text-sm font-semibold mb-3 flex items-center gap-2">
          <Shield className="h-4 w-4 text-emerald-400" />
          {"R\u00e8gles Visual Social"}
        </h3>
        <div className="space-y-2">
          {rules.map((rule) => (
            <div key={rule.text} className="flex items-start gap-2 text-xs">
              <rule.icon className={`h-3.5 w-3.5 ${rule.color} mt-0.5 shrink-0`} />
              <span className="text-white/50">{rule.text}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function PointsCard() {
  return (
    <Card className="bg-slate-900/40 border-white/5">
      <CardContent className="p-4">
        <h3 className="text-white/70 text-sm font-semibold mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-400" />
          VISUpoints
        </h3>
        <div className="space-y-2 text-xs text-white/50">
          <div className="flex justify-between items-center">
            <span>Par post publi\u00e9</span>
            <span className="text-emerald-400 font-bold">+{VISUPOINTS_PER_POST} pts</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Par r\u00e9action re\u00e7ue</span>
            <span className="text-emerald-400 font-bold">+{VISUPOINTS_PER_REACTION_RECEIVED} pt</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ReactionsCard() {
  return (
    <Card className="bg-slate-900/40 border-white/5">
      <CardContent className="p-4">
        <h3 className="text-white/70 text-sm font-semibold mb-3 flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-400" />
          {"R\u00e9actions disponibles"}
        </h3>
        <div className="space-y-1.5">
          {REACTION_TYPES.map((type) => {
            const config = REACTION_CONFIG[type]
            return (
              <div key={type} className="flex items-center gap-2 text-xs">
                <span className="text-base">{config.icon}</span>
                <span className="text-white/60">{config.label}</span>
                <span className="ml-auto text-emerald-400/60 font-mono">+{config.visupoints}pts</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default function VisualSocialPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <VisualHeader />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-4">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">Mini-r\u00e9seau social VISUAL</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 text-balance">
              Visual Social
            </h1>
            <p className="text-white/50 max-w-xl mx-auto text-balance">
              {"Partagez vos coups de c\u0153ur, \u00e9changez avec la communaut\u00e9 VISUAL et gagnez des VISUpoints."}
            </p>
          </div>

          {/* Layout : Feed + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
            {/* Feed */}
            <VisualSocialFeed />

            {/* Sidebar */}
            <div className="space-y-4 lg:sticky lg:top-24">
              <RulesCard />
              <PointsCard />
              <ReactionsCard />

              {/* Rappel comunautaire */}
              <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-emerald-400" />
                  <span className="text-white/70 text-sm font-medium">Esprit communautaire</span>
                </div>
                <p className="text-white/40 text-xs leading-relaxed">
                  {"Visual Social est un espace d'\u00e9change bienveillant. Respectez les autres membres, restez dans le th\u00e8me du cin\u00e9ma et de la cr\u00e9ation, et contribuez \u00e0 une communaut\u00e9 enrichissante."}
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
