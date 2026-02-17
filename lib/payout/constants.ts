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
// 6. REPARTITION DES GAINS (rappel des BPS)
// ──────────────────────────────────────────────

/** Commission VISUAL : 7% */
export const VISUAL_FEE_PERCENT = 7;
export const VISUAL_FEE_BPS = 700;

/** Investisseurs TOP 10 : 40% de G */
export const INVESTOR_TOP10_PERCENT = 40;
export const INVESTOR_TOP10_BPS: readonly number[] = [
  1366, 683, 455, 341, 273, 228, 195, 171, 152, 137,
];

/** Porteurs TOP 10 : 30% de G */
export const CREATOR_TOP10_PERCENT = 30;
export const CREATOR_TOP10_BPS: readonly number[] = [
  1024, 512, 341, 256, 205, 171, 146, 128, 114, 102,
];

/** Investisseurs rangs 11-100 : 23% de G */
export const INVESTOR_11_100_PERCENT = 23;
export const INVESTOR_11_100_BPS = 2300;

/** Porteurs rangs 11-100 : 0% en V1 */
export const CREATOR_11_100_PERCENT = 0;

/** Table de repartition pour affichage */
export const DISTRIBUTION_TABLE = [
  { label: "Commission VISUAL", percent: VISUAL_FEE_PERCENT, color: "slate" },
  { label: "Investisseurs TOP 10", percent: INVESTOR_TOP10_PERCENT, color: "emerald" },
  { label: "Porteurs/Infoporteurs TOP 10", percent: CREATOR_TOP10_PERCENT, color: "teal" },
  { label: "Investisseurs rangs 11-100", percent: INVESTOR_11_100_PERCENT, color: "sky" },
] as const;

/** Detail TOP 10 investisseurs pour affichage */
export const INVESTOR_TOP10_DETAIL = INVESTOR_TOP10_BPS.map((bps, i) => ({
  rank: i + 1,
  percentOfG: bps / 100,
  label: `Rang ${i + 1}`,
}));

/** Detail TOP 10 porteurs pour affichage */
export const CREATOR_TOP10_DETAIL = CREATOR_TOP10_BPS.map((bps, i) => ({
  rank: i + 1,
  percentOfG: bps / 100,
  label: `Rang ${i + 1}`,
}));

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
