'use client';

import { AlertCircle, TrendingUp, Users, Lock, DollarSign, Shield } from 'lucide-react';

export default function SecurityControlCenter() {
  const alerts = [
    {
      id: 1,
      severity: 'critical',
      type: 'multi_account',
      title: 'Cluster multi-comptes détecté',
      description: '3 comptes liés: user_248, user_251, user_263 (87% suspicion)',
      timestamp: '2 min ago',
    },
    {
      id: 2,
      severity: 'critical',
      type: 'vixupoints_spike',
      title: 'Accumulation anormale de VIXUpoints',
      description: 'user_4521: +456 VIXUpoints en 12 min (attendu: ~50)',
      timestamp: '5 min ago',
    },
    {
      id: 3,
      severity: 'suspect',
      type: 'payment_anomaly',
      title: 'Retrait suspect détecté',
      description: 'user_2891: 2400€ via VPN depuis compte 8j (high-risk)',
      timestamp: '8 min ago',
    },
    {
      id: 4,
      severity: 'watch',
      type: 'content_manipulation',
      title: 'Manipulation de contenu détectée',
      description: 'Projet #4782: 245 contributions en 45 min (unnatural engagement)',
      timestamp: '12 min ago',
    },
  ];

  const riskMetrics = [
    { label: 'Alertes critiques', value: 23, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Comptes à surveiller', value: 15, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Retraits bloqués', value: 5, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Contenus masqués', value: 8, color: 'text-sky-400', bg: 'bg-sky-500/10' },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 border-red-500/30 text-red-300';
      case 'suspect':
        return 'bg-orange-500/10 border-orange-500/30 text-orange-300';
      case 'watch':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-300';
      default:
        return 'bg-slate-800 border-slate-700 text-white';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '🔴';
      case 'suspect':
        return '🟠';
      case 'watch':
        return '🟡';
      default:
        return '⚪';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Shield className="h-8 w-8 text-red-500" />
            Security Control Center
          </h1>
          <p className="text-white/60">Détection IA, risques financiers, multi-comptes, VIXUpoints intégrité</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {riskMetrics.map((metric) => (
            <div key={metric.label} className={`${metric.bg} border border-slate-800 rounded-lg p-4`}>
              <div className="text-sm text-white/60 mb-2">{metric.label}</div>
              <div className={`text-3xl font-bold ${metric.color}`}>{metric.value}</div>
            </div>
          ))}
        </div>

        {/* Fraud AI Engine Status */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              VIXUAL Fraud AI - Status en temps réel
            </h2>
            <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded text-emerald-400 text-sm font-semibold">
              🟢 Actif
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-white/60 mb-1">Modèles actifs</div>
              <div className="text-lg font-semibold">6 moteurs</div>
            </div>
            <div>
              <div className="text-white/60 mb-1">Analyses / minute</div>
              <div className="text-lg font-semibold">142</div>
            </div>
            <div>
              <div className="text-white/60 mb-1">Alertes générées (24h)</div>
              <div className="text-lg font-semibold">384</div>
            </div>
          </div>
        </div>

        {/* Live Alert Feed */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            Alertes en direct (Live Feed)
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border rounded-lg p-4 flex items-start gap-4 cursor-pointer hover:bg-slate-800/50 transition-colors ${getSeverityColor(
                  alert.severity,
                )}`}
              >
                <div className="text-2xl flex-shrink-0">{getSeverityIcon(alert.severity)}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{alert.title}</div>
                  <div className="text-sm text-white/70 mt-1">{alert.description}</div>
                  <div className="text-xs text-white/50 mt-2">{alert.timestamp}</div>
                </div>
                <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs font-semibold flex-shrink-0 transition-colors">
                  Voir
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Detection Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Multi-Account Detection</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Clusters actifs</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Comptes impliqués</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Détection moyenne</span>
                <span className="font-semibold text-amber-400">73%</span>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded text-red-400 hover:bg-red-500/30 transition-colors text-sm font-semibold">
                Voir tous les clusters
              </button>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">VIXUpoints Integrity Monitor</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Anomalies (24h)</span>
                <span className="font-semibold text-red-400">7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Points annulés</span>
                <span className="font-semibold">2,847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Comptes en gel</span>
                <span className="font-semibold">5</span>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded text-red-400 hover:bg-red-500/30 transition-colors text-sm font-semibold">
                Revoir les anomalies
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
