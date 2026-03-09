"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trophy, Star, Flame, TrendingUp, Award, Target, Zap, Users, Heart, BarChart3,
  Lock, Unlock, Play, Download, Share2, Crown, CheckCircle, AlertCircle
} from "lucide-react"
import { ALL_CONTENTS } from "@/lib/mock-data"
import { getTop100ByCategory } from "@/lib/discovery/engine"
import { useAuth } from "@/lib/auth-context"

/* ---------- Wave Visualization ---------- */
function WaveIndicator({ level }: { level: number }) {
  const stages = [
    { name: "Explorer", level: 0, color: "text-blue-400", bg: "bg-blue-500/10" },
    { name: "Populaire", level: 1, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { name: "Tendance", level: 2, color: "text-amber-400", bg: "bg-amber-500/10" },
    { name: "Viral", level: 3, color: "text-red-400", bg: "bg-red-500/10" },
  ];
  const stage = stages[Math.min(level, 3)];

  return (
    <div className={`${stage.bg} rounded-full px-3 py-1 flex items-center gap-1.5 w-fit`}>
      <Zap className={`h-3.5 w-3.5 ${stage.color}`} />
      <span className={`${stage.color} text-xs font-semibold`}>Wave {level}</span>
    </div>
  );
}

/* ---------- Badge System ---------- */
function BadgeDisplay({ badge }: { badge?: string }) {
  if (!badge) return null;
  
  const badges: Record<string, { icon: any; label: string; color: string; bg: string }> = {
    prometteur: { icon: Star, label: "Prometteur", color: "text-cyan-400", bg: "bg-cyan-500/15" },
    star: { icon: Crown, label: "Star", color: "text-amber-400", bg: "bg-amber-500/15" },
    analyse: { icon: BarChart3, label: "En Analyse", color: "text-purple-400", bg: "bg-purple-500/15" },
  };

  const b = badges[badge] || badges.prometteur;
  return (
    <div className={`${b.bg} rounded-lg px-2.5 py-1 flex items-center gap-1.5 w-fit`}>
      <b.icon className={`h-3.5 w-3.5 ${b.color}`} />
      <span className={`${b.color} text-xs font-semibold`}>{b.label}</span>
    </div>
  );
}

/* ---------- Leaderboard Table Row ---------- */
function LeaderboardRow({
  rank,
  project,
  score,
  index,
}: {
  rank: number;
  project: any;
  score: any;
  index: number;
}) {
  const visualScore = score?.visualScore ?? 0;
  const waveLevel = score?.waveLevel ?? 0;
  const badge = score?.badge;
  const scores = score?.scores ?? { investment: 0, engagement: 0, longevity: 0, momentum: 0, community: 0, creator: 0 };
  const progressPercent = Math.min((visualScore / 1000) * 100, 100);
  const isTop10 = rank <= 10;
  const isTop20 = rank <= 20;

  return (
    <Link href={`/video/${project.id}`}>
      <Card className={`${isTop10 ? "border-amber-500/30 bg-amber-500/5" : isTop20 ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/10 bg-white/[0.02]"} hover:border-emerald-500/50 transition-all cursor-pointer`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Rank Badge */}
            <div className={`text-center shrink-0 ${isTop10 ? "text-amber-400" : isTop20 ? "text-emerald-400" : "text-white/50"}`}>
              <div className={`text-lg font-bold ${isTop10 ? "bg-gradient-to-b from-amber-400 to-yellow-500 bg-clip-text text-transparent" : ""}`}>
                #{rank}
              </div>
              {isTop10 && <Trophy className="h-4 w-4 mx-auto text-amber-400" />}
            </div>

            {/* Project Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-sm truncate">{project.title}</h3>
                  <p className="text-white/50 text-xs truncate">{project.creatorName}</p>
                </div>
                <BadgeDisplay badge={badge} />
              </div>

              {/* Metrics Row */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <WaveIndicator level={waveLevel} />
                <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-md text-[10px] text-white/70">
                  <Users className="h-3 w-3" />
                  {project.investorCount} soutiens
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-md text-[10px] text-white/70">
                  <Heart className="h-3 w-3" />
                  {project.totalVotes} votes
                </div>
              </div>

              {/* VIXUAL Score Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/60">VIXUAL Score</span>
                  <span className={`text-sm font-bold ${isTop10 ? "text-amber-400" : "text-emerald-400"}`}>
                    {visualScore.toFixed(0)}/1000
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2 bg-slate-800" />
              </div>

              {/* Sub-Scores (horizontal bars) */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mt-3">
                {[
                  { label: "Inv", val: scores.investment, icon: TrendingUp },
                  { label: "Eng", val: scores.engagement, icon: Heart },
                  { label: "Long", val: scores.longevity, icon: Award },
                  { label: "Mom", val: scores.momentum, icon: Flame },
                  { label: "Com", val: scores.community, icon: Users },
                  { label: "Créa", val: scores.creator, icon: Star },
                ].map((metric) => (
                  <div key={metric.label} className="text-[10px]">
                    <div className="flex items-center gap-1 mb-0.5">
                      <metric.icon className="h-3 w-3 text-white/40" />
                      <span className="text-white/60">{metric.label}</span>
                    </div>
                    <Progress value={Math.min((metric.val / 200) * 100, 100)} className="h-1 bg-slate-800" />
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="shrink-0 text-right">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-8 px-3 text-xs">
                <Play className="h-3 w-3 mr-1 fill-current" />
                Voir
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/* ---------- Motivational Messages ---------- */
function MotivationalSection({ rank }: { rank: number }) {
  if (rank > 100) return null;

  const messages: Record<string, { icon: any; text: string; color: string }> = {
    top3: { icon: Crown, text: "Vous êtes dans le TOP 3 ! Bravo, vous dominez la communauté VIXUAL.", color: "text-amber-400" },
    top10: { icon: Trophy, text: "TOP 10 atteint ! Vous êtes parmi les élites de VIXUAL.", color: "text-amber-400" },
    top20: { icon: Star, text: "TOP 20 ! Félicitations, vous suscitez beaucoup d'intérêt.", color: "text-yellow-400" },
    top50: { icon: Flame, text: "TOP 50 ! Vous montez rapidement dans les classements.", color: "text-orange-400" },
    top100: { icon: CheckCircle, text: "TOP 100 ! Bienvenue dans l'élite. Continuez vos efforts.", color: "text-emerald-400" },
  };

  let msg;
  if (rank <= 3) msg = messages.top3;
  else if (rank <= 10) msg = messages.top10;
  else if (rank <= 20) msg = messages.top20;
  else if (rank <= 50) msg = messages.top50;
  else msg = messages.top100;

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
      <msg.icon className={`h-6 w-6 ${msg.color} shrink-0`} />
      <p className={`${msg.color} text-sm font-medium`}>{msg.text}</p>
    </div>
  );
}

/* ---------- Main Page ---------- */
export default function LeaderboardPage() {
  const { isAuthed } = useAuth();
  const [activeTab, setActiveTab] = useState<"all" | "video" | "text" | "podcast">("all");
  const [sortBy, setSortBy] = useState<"score" | "trending">("score");

  const top100 = useMemo(() => {
    let results = getTop100ByCategory(activeTab === "all" ? undefined : activeTab, 100);
    if (sortBy === "trending") {
      results = [...results].sort((a, b) => (b.score?.scores?.momentum || 0) - (a.score?.scores?.momentum || 0));
    }
    return results;
  }, [activeTab, sortBy]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <Trophy className="h-8 w-8 text-amber-400" />
            <h1 className="text-4xl sm:text-5xl font-bold text-balance">VIXUAL Classements</h1>
          </div>
          <p className="text-white/60 text-lg max-w-2xl mb-4">
            Les 100 meilleurs projets sélectionnés par le système de découverte VIXUAL. Chaque projet est évalué selon 6 métriques : investissement, engagement, longévité, momentum, communauté et crédibilité créateur.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-emerald-600/30 text-emerald-300 border-emerald-500/30">Mis à jour quotidiennement</Badge>
            <Badge className="bg-amber-600/30 text-amber-300 border-amber-500/30">100 projets sélectionnés</Badge>
            <Badge className="bg-purple-600/30 text-purple-300 border-purple-500/30">6 critères d'évaluation</Badge>
          </div>
        </div>

        {/* Category Tabs + Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-4 sm:w-auto">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="video">Vidéo</TabsTrigger>
              <TabsTrigger value="text">Écrit</TabsTrigger>
              <TabsTrigger value="podcast">Podcast</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex gap-2">
            <Button
              variant={sortBy === "score" ? "default" : "outline"}
              onClick={() => setSortBy("score")}
              size="sm"
              className="text-xs"
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              VIXUAL Score
            </Button>
            <Button
              variant={sortBy === "trending" ? "default" : "outline"}
              onClick={() => setSortBy("trending")}
              size="sm"
              className="text-xs"
            >
              <Flame className="h-4 w-4 mr-1" />
              Tendance
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Projets évalués", value: String(top100.length), icon: BarChart3, color: "text-emerald-400" },
            { label: "Investissements", value: top100.reduce((s, p) => s + (p.currentInvestment || 0), 0).toLocaleString() + "€", icon: TrendingUp, color: "text-sky-400" },
            { label: "Soutiens totaux", value: top100.reduce((s, p) => s + (p.investorCount || 0), 0).toLocaleString(), icon: Heart, color: "text-red-400" },
            { label: "VIXUAL moyen", value: ((top100.reduce((s, p) => s + (p.score?.visualScore || 0), 0) / top100.length) || 0).toFixed(0), icon: Star, color: "text-amber-400" },
          ].map((stat) => (
            <Card key={stat.label} className="bg-white/[0.02] border-white/10">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/60 text-xs mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Leaderboard List */}
        <div className="space-y-3">
          {top100.map((proj, idx) => (
            <div key={proj.id}>
              {idx === 0 && <MotivationalSection rank={1} />}
              {idx === 10 && <MotivationalSection rank={11} />}
              {idx === 20 && <MotivationalSection rank={21} />}
              {idx === 50 && <MotivationalSection rank={51} />}
              <LeaderboardRow
                rank={idx + 1}
                project={proj}
                score={proj.score || { visualScore: 500, waveLevel: 1, badge: "prometteur", scores: { investment: 100, engagement: 80, longevity: 90, momentum: 75, community: 85, creator: 70 } }}
                index={idx}
              />
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 p-6 rounded-xl bg-white/[0.02] border border-white/10">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-400" />
            Comment fonctionne le classement
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-white/70">
            <div>
              <p className="font-semibold text-white mb-1">Les 6 critères d'évaluation :</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Investissement (40%) — Montants investis et progression</li>
                <li>Engagement (20%) — Votes et interaction communauté</li>
                <li>Longévité (15%) — Ancienneté et constance du projet</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Continué :</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Momentum (10%) — Croissance récente et tendance</li>
                <li>Communauté (10%) — Nombre de soutiens distincts</li>
                <li>Créateur (5%) — Historique et confiance créateur</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
