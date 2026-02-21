/**
 * VISUAL - Constantes consolidees V1 (17/02/2026)
 * Source : VISUAL_Formules_Consolidees_V1_170226
 *
 * Ce fichier centralise TOUS les parametres configurables du moteur VISUAL.
 * Pret pour integration Stripe Connect.
 */

// ──────────────────────────────────────────────
// 1. TRANCHES D'INVESTISSEMENT
// ──────────────────────────────────────────────

/** Montants d'investissement autorises (en euros) */
export const INVESTMENT_TIERS_EUR = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20] as const;
export type InvestmentTierEur = (typeof INVESTMENT_TIERS_EUR)[number];

/** Prix porteur autorises (en euros) — max 10 EUR */
export const PORTER_PRICE_TIERS_EUR = [2, 3, 4, 5, 10] as const;
export type PorterPriceTierEur = (typeof PORTER_PRICE_TIERS_EUR)[number];

/** Prix d'extension (en euros) */
export const EXTENSION_PRICE_EUR = 25;

// ──────────────────────────────────────────────
// 2. CAUTIONS
// ──────────────────────────────────────────────

export const CAUTION = {
  /** Porteur (audiovisuel) et Infoporteur (litteraire) */
  creator: 10_00, // 10 EUR en centimes
  /** Investisseur (audiovisuel) et Investi-lecteur (litteraire) */
  investor: 20_00, // 20 EUR en centimes
} as const;

/** Cautions en euros pour affichage */
export const CAUTION_EUR = {
  creator: CAUTION.creator / 100,
  investor: CAUTION.investor / 100,
} as const;

// ──────────────────────────────────────────────
// 3. BAREME VOTES (investissement -> votes)
// ──────────────────────────────────────────────

/** Table investissement EUR -> nombre de votes */
export const INVESTMENT_TO_VOTES: ReadonlyMap<number, number> = new Map([
  [2, 1],
  [3, 2],
  [4, 3],
  [5, 4],
  [6, 5],
  [8, 6],
  [10, 7],
  [12, 8],
  [15, 9],
  [20, 10],
]);

/** Obtenir le nombre de votes pour un montant d'investissement */
export function getVotesForInvestment(amountEur: number): number {
  return INVESTMENT_TO_VOTES.get(amountEur) ?? 0;
}

// ──────────────────────────────────────────────
// 4. VISUPOINTS - BAREME FIDELITE
// ──────────────────────────────────────────────

/** Table investissement EUR -> VISUpoints gagnes */
export const INVESTMENT_TO_VISUPOINTS: ReadonlyMap<number, number> = new Map([
  [2, 10],
  [3, 15],
  [4, 20],
  [5, 25],
  [6, 30],
  [8, 40],
  [10, 50],
  [12, 60],
  [15, 80],
  [20, 110],
]);

/** Obtenir les VISUpoints pour un montant d'investissement */
export function getVisupointsForInvestment(amountEur: number): number {
  return INVESTMENT_TO_VISUPOINTS.get(amountEur) ?? 0;
}

// ──────────────────────────────────────────────
// 5. VISUPOINTS - CONVERSION EN EUROS
// ──────────────────────────────────────────────

/** Seuil minimum pour conversion : 2500 VISUpoints */
export const VISUPOINTS_CONVERSION_THRESHOLD = 2500;

/** Taux : 100 VISUpoints = 1 EUR */
export const VISUPOINTS_PER_EUR = 100;

/** Retrait minimum en euros (correspondant au seuil) */
export const VISUPOINTS_MIN_WITHDRAW_EUR = VISUPOINTS_CONVERSION_THRESHOLD / VISUPOINTS_PER_EUR; // 25 EUR

/**
 * Convertit des VISUpoints en euros.
 * @returns { eurosConverted, pointsRemaining, eligibleForConversion }
 */
export function convertVisupoints(points: number): {
  eurosConverted: number;
  pointsRemaining: number;
  eligibleForConversion: boolean;
} {
  if (points < VISUPOINTS_CONVERSION_THRESHOLD) {
    return {
      eurosConverted: 0,
      pointsRemaining: points,
      eligibleForConversion: false,
    };
  }

  const eurosConverted = Math.floor(points / VISUPOINTS_PER_EUR);
  const pointsRemaining = points - VISUPOINTS_PER_EUR * eurosConverted;

  return {
    eurosConverted,
    pointsRemaining,
    eligibleForConversion: true,
  };
}

// ──────────────────────────────────────────────
// 6. REPARTITION DES GAINS PAR CATEGORIE
// ──────────────────────────────────────────────
// Source doc: "VISUAL - Formules Mathematiques et Repartitions Completes Optimisees"
// Hors VSLS et Petites Annonces (non implementes dans VISUAL V1)

// ─── 6A. FILMS / VIDEOS / DOCUMENTAIRES ───
// Cloture configurable (admin) — 40/30/7/23
/** Investisseurs TOP 10 : 40% */
export const FILMS_INVESTOR_TOP10_PERCENT = 40;
export const FILMS_INVESTOR_TOP10_BPS = 4000;
/** Porteurs TOP 10 : 30% */
export const FILMS_CREATOR_TOP10_PERCENT = 30;
export const FILMS_CREATOR_TOP10_BPS = 3000;
/** Investisseurs rangs 11-100 : 7% */
export const FILMS_INVESTOR_11_100_PERCENT = 7;
export const FILMS_INVESTOR_11_100_BPS = 700;
/** VISUAL (plateforme) : 23% */
export const FILMS_VISUAL_PERCENT = 23;
export const FILMS_VISUAL_BPS = 2300;

/** BPS par rang dans le TOP 10 investisseurs (pro-rata votes) */
export const FILMS_INVESTOR_TOP10_RANK_BPS: readonly number[] = [
  1366, 683, 455, 341, 273, 228, 195, 171, 152, 137,
];
/** BPS par rang dans le TOP 10 porteurs (pro-rata score) */
export const FILMS_CREATOR_TOP10_RANK_BPS: readonly number[] = [
  1024, 512, 341, 256, 205, 171, 146, 128, 114, 102,
];

// ─── 6B. VOIX DE L'INFO ───
// Vente unitaire 70/30 + Pot quotidien 60/40
// CRON quotidien a 00:15 UTC+1
export const VOIXINFO_SALE_AUTHOR_PERCENT = 70;
export const VOIXINFO_SALE_VISUAL_PERCENT = 30;
export const VOIXINFO_POT_AUTHORS_TOP10_PERCENT = 60;
export const VOIXINFO_POT_READERS_PERCENT = 40;
/** Poids degressif par rang TOP 10 (rang 1 = 10 pts, rang 10 = 1 pt) */
export const VOIXINFO_RANK_WEIGHT = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] as const;

// ─── 6C. LIVRES ───
// Vente unitaire 70/30 + Pot mensuel 60/40
export const LIVRES_SALE_AUTHOR_PERCENT = 70;
export const LIVRES_SALE_VISUAL_PERCENT = 30;
export const LIVRES_POT_AUTHORS_TOP10_PERCENT = 60;
export const LIVRES_POT_INVESTIREADERS_PERCENT = 40;
/** Poids degressif identique a Voix de l'Info */
export const LIVRES_RANK_WEIGHT = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] as const;
/** Ticket de repechage (optionnel) : 25 EUR */
export const LIVRES_REPECHAGE_EUR = 25;
/** Capacite mensuelle cible : 100 auteurs/mois */
export const LIVRES_TARGET_AUTHORS_MONTH = 100;

// ─── 6D. PODCASTS ───
// Vente episode 70/30 + Pot mensuel 40/30/20/10
export const PODCASTS_SALE_CREATOR_PERCENT = 70;
export const PODCASTS_SALE_VISUAL_PERCENT = 30;
export const PODCASTS_POT_CREATORS_PERCENT = 40;
export const PODCASTS_POT_INVESTORS_PERCENT = 30;
export const PODCASTS_POT_VISUAL_PERCENT = 20;
export const PODCASTS_POT_BONUS_PERCENT = 10;

/**
 * Detail du bonus 10% Podcasts (source: README payout-engine V2)
 *   6% : primes performance TOP 10 podcasters
 *   2% : reserve technique (arrondis) — comptabilisee cote plateforme
 *   2% : reserve evenementielle — comptabilisee cote plateforme
 */
export const PODCASTS_BONUS_BREAKDOWN = {
  performancePrimesPercent: 6,
  technicalReservePercent: 2,
  eventReservePercent: 2,
} as const;

/** CAP anti-capture: un investisseur ne peut representer plus de 20% des votes globaux mensuels */
export const PODCASTS_ANTI_CAPTURE_MAX_VOTE_SHARE = 0.20;
/**
 * Score audio pour ponderation investisseurs podcasts :
 * listen_score = 0.7 * completion + 0.3 * unique_listeners_norm
 */
export const PODCASTS_LISTEN_SCORE_WEIGHTS = {
  completion: 0.7,
  uniqueListenersNorm: 0.3,
} as const;

// ─── 6E. LEGACY ALIASES (backward compat) ───
// Pour le code existant qui reference les anciens noms

/** @deprecated Use FILMS_VISUAL_BPS instead */
export const VISUAL_FEE_PERCENT = FILMS_VISUAL_PERCENT;
export const VISUAL_FEE_BPS = FILMS_VISUAL_BPS;

/** @deprecated Use FILMS_INVESTOR_TOP10_PERCENT instead */
export const INVESTOR_TOP10_PERCENT = FILMS_INVESTOR_TOP10_PERCENT;
export const INVESTOR_TOP10_BPS = FILMS_INVESTOR_TOP10_RANK_BPS;

/** @deprecated Use FILMS_CREATOR_TOP10_PERCENT instead */
export const CREATOR_TOP10_PERCENT = FILMS_CREATOR_TOP10_PERCENT;
export const CREATOR_TOP10_BPS = FILMS_CREATOR_TOP10_RANK_BPS;

/** @deprecated Use FILMS_INVESTOR_11_100_BPS instead */
export const INVESTOR_11_100_PERCENT = FILMS_INVESTOR_11_100_PERCENT;
export const INVESTOR_11_100_BPS = FILMS_INVESTOR_11_100_BPS;

/** Porteurs rangs 11-100 : 0% en V1 */
export const CREATOR_11_100_PERCENT = 0;

// ─── 6F. CATEGORY SPLITS (pour affichage + settlement) ───

export type VisualCategory = "films" | "voix_info" | "livres" | "podcasts";

export const CATEGORY_SPLITS: Record<VisualCategory, {
  label: string;
  frequency: string;
  splits: { label: string; percent: number; color: string }[];
}> = {
  films: {
    label: "Films / Videos / Documentaires",
    frequency: "Configurable (admin)",
    splits: [
      { label: "Investisseurs TOP 10", percent: FILMS_INVESTOR_TOP10_PERCENT, color: "emerald" },
      { label: "Porteurs TOP 10", percent: FILMS_CREATOR_TOP10_PERCENT, color: "teal" },
      { label: "Investisseurs rangs 11-100", percent: FILMS_INVESTOR_11_100_PERCENT, color: "sky" },
      { label: "VISUAL (plateforme)", percent: FILMS_VISUAL_PERCENT, color: "slate" },
    ],
  },
  voix_info: {
    label: "Voix de l'Info (articles)",
    frequency: "Quotidien (CRON 00:15 UTC+1)",
    splits: [
      { label: "Auteurs TOP 10", percent: VOIXINFO_POT_AUTHORS_TOP10_PERCENT, color: "amber" },
      { label: "Lecteurs gagnants", percent: VOIXINFO_POT_READERS_PERCENT, color: "sky" },
    ],
  },
  livres: {
    label: "Livres",
    frequency: "Mensuel (dernier jour du mois)",
    splits: [
      { label: "Auteurs TOP 10", percent: LIVRES_POT_AUTHORS_TOP10_PERCENT, color: "amber" },
      { label: "Investi-lecteurs gagnants", percent: LIVRES_POT_INVESTIREADERS_PERCENT, color: "sky" },
    ],
  },
  podcasts: {
    label: "Podcasts",
    frequency: "Mensuel (dernier jour du mois)",
    splits: [
      { label: "Podcasteurs TOP 10 (base)", percent: PODCASTS_POT_CREATORS_PERCENT, color: "purple" },
      { label: "Auditeurs TOP 10 (investisseurs)", percent: PODCASTS_POT_INVESTORS_PERCENT, color: "emerald" },
      { label: "VISUAL (plateforme)", percent: PODCASTS_POT_VISUAL_PERCENT, color: "slate" },
      { label: "Bonus : primes perf. TOP 10", percent: PODCASTS_BONUS_BREAKDOWN.performancePrimesPercent, color: "amber" },
      { label: "Bonus : reserve technique", percent: PODCASTS_BONUS_BREAKDOWN.technicalReservePercent, color: "zinc" },
      { label: "Bonus : reserve evenementielle", percent: PODCASTS_BONUS_BREAKDOWN.eventReservePercent, color: "zinc" },
    ],
  },
};

/** Table de repartition Films (affichage principal, backward compat) */
export const DISTRIBUTION_TABLE = CATEGORY_SPLITS.films.splits;

/** Detail TOP 10 investisseurs pour affichage */
export const INVESTOR_TOP10_DETAIL = FILMS_INVESTOR_TOP10_RANK_BPS.map((bps, i) => ({
  rank: i + 1,
  percentOfG: bps / 100,
  label: `Rang ${i + 1}`,
}));

/** Detail TOP 10 porteurs pour affichage */
export const CREATOR_TOP10_DETAIL = FILMS_CREATOR_TOP10_RANK_BPS.map((bps, i) => ({
  rank: i + 1,
  percentOfG: bps / 100,
  label: `Rang ${i + 1}`,
}));

// ──────────────────────────────────────────────
// 6G. QUOTAS CREATEURS (mise en ligne Bunny.net)
// ──────────────────────────────────────────────

export const CREATOR_QUOTAS = {
  clips: { maxDuration: 5 * 60, perMonth: 2, priceEur: 2, label: "Clips (< 5 min)" },
  documentaires: { maxDuration: 30 * 60, perMonth: 1, priceEur: 5, label: "Documentaires (5-30 min)" },
  films: { maxDuration: Infinity, perQuarter: 1, priceEur: 7, label: "Films (> 30 min)" },
} as const;

// ──────────────────────────────────────────────
// 7. VENTE D'ARTICLE (Infoporteur) - 70/30
// ──────────────────────────────────────────────

/** Part de l'auteur sur la vente d'un article */
export const ARTICLE_SALE_AUTHOR_PERCENT = 70;

/** Part de VISUAL sur la vente d'un article */
export const ARTICLE_SALE_VISUAL_PERCENT = 30;

/**
 * Calcule la repartition pour une vente d'article.
 * @param priceEurCents Prix en centimes
 */
export function computeArticleSale(priceEurCents: number): {
  authorCents: number;
  visualCents: number;
} {
  const authorCents = Math.floor((priceEurCents * ARTICLE_SALE_AUTHOR_PERCENT) / 100);
  const visualCents = priceEurCents - authorCents;
  return { authorCents, visualCents };
}

// ──────────────────────────────────────────────
// 8. CLASSEMENT / COEFFICIENT D'ENGAGEMENT
// ──────────────────────────────────────────────

/**
 * Coefficient d'engagement pour departager les TOP 10 :
 * coeff(p) = round(montantTotal(p) / max(1, nbInvestisseurs(p)), 2)
 */
export function computeEngagementCoefficient(
  totalAmountEur: number,
  investorCount: number,
): number {
  return Math.round((totalAmountEur / Math.max(1, investorCount)) * 100) / 100;
}

// ──────────────────────────────────────────────
// 9. STRIPE CONNECT - CONFIGURATION FUTURE
// ──────────────────────────────────────────────

export const STRIPE_CONFIG = {
  /** Devise */
  currency: "eur" as const,
  /** Retrait minimum en centimes */
  minWithdrawCents: 25_00, // 25 EUR
  /** Delai de traitement des retraits (en jours) */
  withdrawProcessingDays: 7,
  /** Type de compte Stripe Connect */
  accountType: "express" as const,
} as const;
