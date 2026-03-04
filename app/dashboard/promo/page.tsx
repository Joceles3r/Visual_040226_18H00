"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Share2,
  Mail,
  Link2,
  Globe,
  Copy,
  Check,
  BarChart3,
  Clock,
} from "lucide-react";

interface PromoStats {
  monthlyEmails: number;
  monthlyEmailCap: number;
  monthlyShares: number;
  totalShares: number;
  cooldownHours: number;
}

export default function PromoPage() {
  const { user, isAuthed } = useAuth();
  const [stats, setStats] = useState<PromoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [shareLoading, setShareLoading] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/promo/email?userId=${user.id}`);
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isAuthed) fetchStats();
  }, [isAuthed, fetchStats]);

  const referralLink = typeof window !== "undefined"
    ? `${window.location.origin}?ref=${user?.id?.slice(0, 8) || "visual"}`
    : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async (channel: "email" | "link" | "social") => {
    if (!user?.id) return;
    setShareLoading(channel);
    try {
      await fetch("/api/promo/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, channel }),
      });
      await fetchStats();
    } catch { /* silent */ } finally {
      setShareLoading(null);
    }
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/50">{"Connectez-vous pour acc\u00e9der \u00e0 la promotion."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Promotion / Parrainage</h1>
          <p className="text-white/50 mt-2">
            {"Partagez VISUAL avec vos proches et suivez l'impact de vos actions."}
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-slate-900/60 border-white/10">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/15 flex items-center justify-center">
                <Mail className="h-6 w-6 text-sky-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {loading ? "--" : `${stats?.monthlyEmails ?? 0}/${stats?.monthlyEmailCap ?? 4}`}
                </p>
                <p className="text-white/40 text-xs">Emails promo ce mois</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/60 border-white/10">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                <Share2 className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {loading ? "--" : stats?.monthlyShares ?? 0}
                </p>
                <p className="text-white/40 text-xs">Partages ce mois</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/60 border-white/10">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {loading ? "--" : stats?.totalShares ?? 0}
                </p>
                <p className="text-white/40 text-xs">Partages au total</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral link */}
        <Card className="bg-slate-900/60 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <Link2 className="h-5 w-5 text-sky-400" />
              Votre lien de parrainage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white/70 text-sm font-mono truncate">
                {referralLink || "Chargement..."}
              </div>
              <Button
                onClick={handleCopy}
                variant="outline"
                className="border-white/15 text-white/70 hover:bg-white/5 shrink-0 gap-2"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copie !" : "Copier"}
              </Button>
            </div>
            <p className="text-white/30 text-xs mt-3">
              {"Partagez ce lien pour inviter vos amis. Chaque inscription via ce lien sera comptabilis\u00e9e."}
            </p>
          </CardContent>
        </Card>

        {/* Share actions */}
        <Card className="bg-slate-900/60 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <Share2 className="h-5 w-5 text-emerald-400" />
              Partager VISUAL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { channel: "email" as const, label: "Par email", icon: Mail, color: "text-sky-400", bg: "bg-sky-500/15" },
                { channel: "link" as const, label: "Par lien", icon: Link2, color: "text-amber-400", bg: "bg-amber-500/15" },
                { channel: "social" as const, label: "Reseaux sociaux", icon: Globe, color: "text-emerald-400", bg: "bg-emerald-500/15" },
              ].map((item) => (
                <Button
                  key={item.channel}
                  onClick={() => handleShare(item.channel)}
                  disabled={shareLoading === item.channel}
                  variant="outline"
                  className="border-white/10 text-white/70 hover:bg-white/5 h-auto py-4 flex flex-col items-center gap-2"
                >
                  <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center`}>
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <span className="text-sm">{item.label}</span>
                </Button>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-white/30 text-xs">
              <Clock className="h-3 w-3" />
              <span>{`Cooldown entre emails : ${stats?.cooldownHours ?? 72}h | Limite : 10 partages/jour`}</span>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="bg-sky-500/5 border border-sky-500/15 rounded-xl p-4">
          <p className="text-sky-400/80 text-sm leading-relaxed">
            {"Le syst\u00e8me de promotion VISUAL est con\u00e7u pour r\u00e9compenser le bouche-\u00e0-oreille authentique. Les actions de partage sont soumises \u00e0 des limites anti-abus (dix par jour, d\u00e9lai de soixante-douze heures entre emails). Vos statistiques sont mises \u00e0 jour en temps r\u00e9el."}
          </p>
        </div>
      </div>
    </div>
  );
}
