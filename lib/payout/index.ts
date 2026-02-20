/**
 * VISUAL Payout Engine - Point d'entree
 *
 * Ce module exporte l'ensemble du moteur de calcul et des constantes
 * necessaires a la repartition des gains VISUAL.
 * Pret pour integration Stripe Connect.
 */

// Types
export type {
  Currency,
  Role,
  Bucket,
  PayoutAllocation,
  LedgerEntryType,
  LedgerStatus,
  LedgerEntry,
  PayoutEngineInput,
  PayoutEngineOutput,
} from "./types";

// Moteur de calcul
export { computePayoutAllocations } from "./payout-engine";

// Constantes VISUAL V1
export {
  // Tranches
  INVESTMENT_TIERS_EUR,
  PORTER_PRICE_TIERS_EUR,
  EXTENSION_PRICE_EUR,
  // Cautions
  CAUTION,
  CAUTION_EUR,
  // Votes
  INVESTMENT_TO_VOTES,
  getVotesForInvestment,
  // VISUpoints
  INVESTMENT_TO_VISUPOINTS,
  getVisupointsForInvestment,
  VISUPOINTS_CONVERSION_THRESHOLD,
  VISUPOINTS_PER_EUR,
  VISUPOINTS_MIN_WITHDRAW_EUR,
  convertVisupoints,
  // Repartition par categorie (nouvelles constantes)
  FILMS_INVESTOR_TOP10_PERCENT,
  FILMS_CREATOR_TOP10_PERCENT,
  FILMS_INVESTOR_11_100_PERCENT,
  FILMS_VISUAL_PERCENT,
  FILMS_INVESTOR_TOP10_RANK_BPS,
  FILMS_CREATOR_TOP10_RANK_BPS,
  VOIXINFO_SALE_AUTHOR_PERCENT,
  VOIXINFO_SALE_VISUAL_PERCENT,
  VOIXINFO_POT_AUTHORS_TOP10_PERCENT,
  VOIXINFO_POT_READERS_PERCENT,
  VOIXINFO_RANK_WEIGHT,
  LIVRES_SALE_AUTHOR_PERCENT,
  LIVRES_SALE_VISUAL_PERCENT,
  LIVRES_POT_AUTHORS_TOP10_PERCENT,
  LIVRES_POT_INVESTIREADERS_PERCENT,
  LIVRES_RANK_WEIGHT,
  LIVRES_REPECHAGE_EUR,
  LIVRES_TARGET_AUTHORS_MONTH,
  PODCASTS_SALE_CREATOR_PERCENT,
  PODCASTS_SALE_VISUAL_PERCENT,
  PODCASTS_POT_CREATORS_PERCENT,
  PODCASTS_POT_INVESTORS_PERCENT,
  PODCASTS_POT_VISUAL_PERCENT,
  PODCASTS_POT_BONUS_PERCENT,
  PODCASTS_ANTI_CAPTURE_MAX_VOTE_SHARE,
  PODCASTS_LISTEN_SCORE_WEIGHTS,
  CATEGORY_SPLITS,
  CREATOR_QUOTAS,
  // Legacy aliases (backward compat)
  VISUAL_FEE_PERCENT,
  VISUAL_FEE_BPS,
  INVESTOR_TOP10_PERCENT,
  INVESTOR_TOP10_BPS,
  CREATOR_TOP10_PERCENT,
  CREATOR_TOP10_BPS,
  INVESTOR_11_100_PERCENT,
  INVESTOR_11_100_BPS,
  CREATOR_11_100_PERCENT,
  DISTRIBUTION_TABLE,
  INVESTOR_TOP10_DETAIL,
  CREATOR_TOP10_DETAIL,
  // Vente d'article
  ARTICLE_SALE_AUTHOR_PERCENT,
  ARTICLE_SALE_VISUAL_PERCENT,
  computeArticleSale,
  // Classement
  computeEngagementCoefficient,
  // Stripe
  STRIPE_CONFIG,
} from "./constants";

export type { VisualCategory } from "./constants";
