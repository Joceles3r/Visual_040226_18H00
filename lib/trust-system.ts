/**
 * VIXUAL - VIXUAL TRUST SYSTEM
 *
 * Système central de confiance (0-100) permettant de:
 * - Sécuriser les interactions
 * - Valoriser les comportements positifs
 * - Détecter les comportements suspects
 * - Encourager la participation saine
 * - Protéger les créateurs et contributeurs
 *
 * @since 2026-03-11
 */

// ─── Types ───

export type TrustScoreLevel = "exemplary" | "very_reliable" | "correct" | "to_watch" | "at_risk"
export type BadgeType =
  | "identity_verified"
  | "active_contributor"
  | "recognized_creator"
  | "top_contributor"
  | "project_promising"
  | "elite_creator"
  | "premium_contributor"
  | "vixual_ambassador"

export interface TrustScore {
  userId: string
  score: number // 0-100
  level: TrustScoreLevel
  lastUpdated: string
  components: {
    identityVerified: number // 25% max
    transactionHistory: number // 20% max
    communityParticipation: number // 15% max
    seniority: number // 15% max
    socialBehavior: number // 10% max
    financialReliability: number // 10% max
    communityBonus: number // 5% max
  }
  badges: BadgeType[]
  warnings: string[]
  riskFlags: string[]
}

export interface TrustBadge {
  id: BadgeType
  displayName: string
  description: string
  icon: string
  color: string
  rarity: "common" | "uncommon" | "rare" | "legendary"
  requirements: string[]
}

// ─── Constants ───

/** Score ranges and levels */
export const TRUST_SCORE_RANGES = {
  exemplary: { min: 90, max: 100, label: "Profil exemplaire" },
  very_reliable: { min: 75, max: 89, label: "Profil très fiable" },
  correct: { min: 60, max: 74, label: "Profil correct" },
  to_watch: { min: 40, max: 59, label: "Profil à surveiller" },
  at_risk: { min: 0, max: 39, label: "Profil à risque" },
} as const

/** Component weights */
export const TRUST_WEIGHTS = {
  identityVerified: 0.25,
  transactionHistory: 0.2,
  communityParticipation: 0.15,
  seniority: 0.15,
  socialBehavior: 0.1,
  financialReliability: 0.1,
  communityBonus: 0.05,
} as const

/** Available badges */
export const TRUST_BADGES: Record<BadgeType, TrustBadge> = {
  identity_verified: {
    id: "identity_verified",
    displayName: "Identité vérifiée",
    description: "Email, téléphone et Stripe Connect confirmés",
    icon: "CheckCircle",
    color: "text-emerald-400",
    rarity: "common",
    requirements: ["Email confirmé", "Téléphone confirmé", "Stripe Connect validé"],
  },
  active_contributor: {
    id: "active_contributor",
    displayName: "Contributeur actif",
    description: "Participation régulière à la communauté",
    icon: "Flame",
    color: "text-orange-400",
    rarity: "uncommon",
    requirements: ["5+ contributions", "Score ≥ 60", "Aucun litige"],
  },
  recognized_creator: {
    id: "recognized_creator",
    displayName: "Créateur reconnu",
    description: "Créateur avec contenu valorisé par la communauté",
    icon: "Star",
    color: "text-amber-400",
    rarity: "uncommon",
    requirements: ["10+ contenus", "Score ≥ 70", "Aucun problème signalé"],
  },
  top_contributor: {
    id: "top_contributor",
    displayName: "Top Contributeur",
    description: "Classé dans le TOP 10 des contributeurs",
    icon: "Trophy",
    color: "text-amber-300",
    rarity: "rare",
    requirements: ["TOP 10 des contributions", "Score ≥ 80", "Historique clean"],
  },
  project_promising: {
    id: "project_promising",
    displayName: "Projet prometteur",
    description: "Projet avec fort potentiel et engagement communautaire",
    icon: "Rocket",
    color: "text-sky-400",
    rarity: "uncommon",
    requirements: ["TOP 20 des projets", "100+ contributeurs", "Score ≥ 70"],
  },
  elite_creator: {
    id: "elite_creator",
    displayName: "Créateur élite",
    description: "Créateur d'exception avec reconnaissance établie",
    icon: "Crown",
    color: "text-purple-400",
    rarity: "rare",
    requirements: ["50+ contenus réussis", "Score ≥ 85", "TOP 10 historique"],
  },
  premium_contributor: {
    id: "premium_contributor",
    displayName: "Contributeur premium",
    description: "Contributeur investisseur avec historique exemplaire",
    icon: "Gem",
    color: "text-pink-400",
    rarity: "rare",
    requirements: ["1000€+ contribués", "Score ≥ 85", "Aucun litige"],
  },
  vixual_ambassador: {
    id: "vixual_ambassador",
    displayName: "Ambassadeur VIXUAL",
    description: "Acteur clé de la communauté VIXUAL",
    icon: "Users",
    color: "text-teal-400",
    rarity: "legendary",
    requirements: ["Score ≥ 90", "Contribution communautaire exceptionnelle", "Validation VIXUAL"],
  },
}

// ─── Calculations ───

/**
 * Calcule le score de confiance global (0-100).
 */
export function calculateTrustScore(components: {
  identityVerified: number // 0-25
  transactionHistory: number // 0-20
  communityParticipation: number // 0-15
  seniority: number // 0-15
  socialBehavior: number // 0-10
  financialReliability: number // 0-10
  communityBonus: number // 0-5
}): number {
  const score =
    components.identityVerified * TRUST_WEIGHTS.identityVerified +
    components.transactionHistory * TRUST_WEIGHTS.transactionHistory +
    components.communityParticipation * TRUST_WEIGHTS.communityParticipation +
    seniority * TRUST_WEIGHTS.seniority +
    components.socialBehavior * TRUST_WEIGHTS.socialBehavior +
    components.financialReliability * TRUST_WEIGHTS.financialReliability +
    components.communityBonus * TRUST_WEIGHTS.communityBonus

  return Math.min(100, Math.max(0, Math.round(score)))
}

/**
 * Détermine le niveau de score basé sur la valeur numérique.
 */
export function getTrustScoreLevel(score: number): TrustScoreLevel {
  if (score >= 90) return "exemplary"
  if (score >= 75) return "very_reliable"
  if (score >= 60) return "correct"
  if (score >= 40) return "to_watch"
  return "at_risk"
}

/**
 * Ajoute des points d'identité vérifiée.
 * Max 25 points.
 */
export function addIdentityVerificationPoints(
  emailVerified: boolean,
  phoneVerified: boolean,
  stripeConnected: boolean,
  kycVerified: boolean
): number {
  let points = 0
  if (emailVerified) points += 5
  if (phoneVerified) points += 5
  if (stripeConnected) points += 8
  if (kycVerified) points += 7
  return Math.min(25, points)
}

/**
 * Ajoute des points pour l'historique de transactions.
 * Max 20 points.
 */
export function addTransactionHistoryPoints(
  successfulTransactions: number,
  totalTransactions: number,
  disputes: number,
  fraudFlags: number
): number {
  let points = 0

  // Taux de réussite
  const successRate = successfulTransactions / Math.max(1, totalTransactions)
  points += successRate * 15

  // Pénalité pour litiges
  points -= disputes * 2

  // Pénalité pour fraude
  points -= fraudFlags * 5

  return Math.max(0, Math.min(20, Math.round(points)))
}

/**
 * Ajoute des points pour la participation communautaire.
 * Max 15 points.
 */
export function addCommunityParticipationPoints(
  comments: number,
  usefulVotes: number,
  projectShares: number,
  socialPosts: number
): number {
  let points = 0

  // 1-3 points par contribution utile
  points += Math.min(comments, 5) * 1
  points += Math.min(usefulVotes, 5) * 1
  points += Math.min(projectShares, 5) * 1
  points += Math.min(socialPosts, 3) * 1

  return Math.min(15, Math.round(points))
}

/**
 * Ajoute des points pour l'ancienneté du compte.
 * Max 15 points.
 */
export function addSeniorityPoints(accountAgeDays: number): number {
  if (accountAgeDays < 30) return 0
  if (accountAgeDays < 180) return 3
  if (accountAgeDays < 365) return 6
  if (accountAgeDays < 730) return 10
  return 15
}

/**
 * Ajoute des points pour le comportement social.
 * Max 10 points.
 */
export function addSocialBehaviorPoints(
  reports: number,
  spam: number,
  insults: number,
  contentFlags: number
): number {
  let points = 10

  // Pénalités
  points -= reports * 2
  points -= spam * 3
  points -= insults * 3
  points -= contentFlags * 1

  return Math.max(0, Math.min(10, points))
}

/**
 * Ajoute des points pour la fiabilité financière.
 * Max 10 points.
 */
export function addFinancialReliabilityPoints(
  regularInvestor: boolean,
  paymentsFailed: number,
  chargebacks: number,
  monthlyActivity: number
): number {
  let points = 0

  if (regularInvestor) points += 5
  points += Math.min(monthlyActivity / 2, 5)
  points -= paymentsFailed * 2
  points -= chargebacks * 5

  return Math.max(0, Math.min(10, Math.round(points)))
}

/**
 * Ajoute des points bonus communauté.
 * Max 5 points.
 */
export function addCommunityBonusPoints(
  communityLikes: number,
  helpfulVotes: number,
  publicRecognition: number
): number {
  let points = 0

  points += Math.min(communityLikes / 10, 2)
  points += Math.min(helpfulVotes / 10, 2)
  points += publicRecognition * 1

  return Math.min(5, Math.round(points))
}

// ─── Badges ───

/**
 * Détermine quels badges l'utilisateur mérite.
 */
export function determineBadges(trustProfile: TrustScore): BadgeType[] {
  const badges: BadgeType[] = []

  // Identity verified
  if (trustProfile.components.identityVerified >= 20) {
    badges.push("identity_verified")
  }

  // Active contributor
  if (
    trustProfile.components.communityParticipation >= 10 &&
    trustProfile.score >= 60 &&
    !trustProfile.riskFlags.includes("disputes")
  ) {
    badges.push("active_contributor")
  }

  // Recognized creator
  if (
    trustProfile.components.communityParticipation >= 12 &&
    trustProfile.score >= 70 &&
    trustProfile.riskFlags.length === 0
  ) {
    badges.push("recognized_creator")
  }

  // Top contributor
  if (trustProfile.score >= 80 && trustProfile.riskFlags.length === 0) {
    badges.push("top_contributor")
  }

  // Elite creator
  if (trustProfile.score >= 85 && trustProfile.warnings.length === 0) {
    badges.push("elite_creator")
  }

  // Premium contributor
  if (
    trustProfile.components.financialReliability >= 8 &&
    trustProfile.score >= 85 &&
    !trustProfile.riskFlags.includes("chargebacks")
  ) {
    badges.push("premium_contributor")
  }

  // VIXUAL ambassador (manual validation required)
  // Assigné par validation VIXUAL seulement

  return badges
}

/**
 * Génère un résumé du profil de confiance pour affichage.
 */
export function getTrustSummary(score: number): {
  level: TrustScoreLevel
  label: string
  description: string
  color: string
  recommendations: string[]
} {
  const level = getTrustScoreLevel(score)
  const range = TRUST_SCORE_RANGES[level]

  const recommendations: Record<TrustScoreLevel, string[]> = {
    exemplary: [
      "Profil hautement recommandé",
      "Accès prioritaire aux nouveaux projets",
      "Éligible aux programmes premium",
    ],
    very_reliable: [
      "Profil fiable",
      "Bon historique établi",
      "Accès complet à la plateforme",
    ],
    correct: [
      "Profil standard",
      "Continuer à améliorer votre historique",
      "Respecter les règles de la plateforme",
    ],
    to_watch: [
      "Attention requise",
      "Améliorer votre comportement communautaire",
      "Éviter les litiges",
      "Vérifier votre identité",
    ],
    at_risk: [
      "Compte à risque",
      "Action immédiate requise",
      "Contactez le support VIXUAL",
      "Amélioration du profil nécessaire pour continuer",
    ],
  }

  return {
    level,
    label: range.label,
    description: range.label,
    color:
      level === "exemplary"
        ? "text-emerald-400"
        : level === "very_reliable"
          ? "text-teal-400"
          : level === "correct"
            ? "text-blue-400"
            : level === "to_watch"
              ? "text-amber-400"
              : "text-rose-400",
    recommendations: recommendations[level],
  }
}

/**
 * Détecte les signaux d'alerte et fraude.
 */
export function detectRiskFlags(
  transactionHistory: { failed: number; disputed: number; chargebacks: number },
  behavior: { reports: number; spam: number; insults: number },
  temporal: { accountAgeDays: number; lastActivityDaysAgo: number }
): string[] {
  const flags: string[] = []

  // Fraude potentielle
  if (transactionHistory.chargebacks > 0) {
    flags.push("chargebacks")
  }

  // Litiges répétés
  if (transactionHistory.disputed > 2) {
    flags.push("disputes")
  }

  // Comportement toxique
  if (behavior.reports > 2 || behavior.insults > 5) {
    flags.push("toxic_behavior")
  }

  // Spam
  if (behavior.spam > 10) {
    flags.push("spam")
  }

  // Compte très nouveau avec activité suspecte
  if (temporal.accountAgeDays < 7 && transactionHistory.failed > 2) {
    flags.push("new_account_suspicious")
  }

  // Inactivité prolongée (peut être redémarrage suspect)
  if (
    temporal.lastActivityDaysAgo > 90 &&
    temporal.lastActivityDaysAgo < 180 &&
    transactionHistory.failed > 0
  ) {
    flags.push("suspended_account")
  }

  return flags
}
