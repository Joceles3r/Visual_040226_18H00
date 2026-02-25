/**
 * VISUAL - VISUpoints Engine
 *
 * Gere l'accumulation, le plafond mineurs (16-17 ans), le blocage retrait,
 * et la detection automatique de majorite.
 *
 * Plafond mineur : 10 000 VISUpoints (equivalent 100 EUR)
 * Plafond majeur : illimite (conversion a partir de 2 500 pts)
 */

// ─── Types ───

export type ParentConsentStatus =
  | "not_required"
  | "required"
  | "pending"
  | "verified"
  | "rejected"

export interface ParentConsent {
  status: ParentConsentStatus
  acceptedByGuardian: boolean
  acceptedAt?: string
  guardianEmail?: string
  guardianName?: string
  documentUrl?: string
  documentType?: "id" | "family_record_book" | "court_order" | "other"
  verificationNote?: string
  verifiedAt?: string
  verifiedBy?: string
}

export interface UserVisupointsProfile {
  userId: string
  birthDate?: string
  isMinor: boolean
  visupointsBalance: number
  visupointsCap: number
  parentConsent: ParentConsent
  kycVerified: boolean
}

// ─── Constants ───

export const MINOR_VISUPOINTS_CAP = 10_000
export const MINOR_MIN_AGE = 16
export const MAJORITY_AGE = 18

export const DEFAULT_PARENT_CONSENT: ParentConsent = {
  status: "not_required",
  acceptedByGuardian: false,
}

export const MINOR_PARENT_CONSENT: ParentConsent = {
  status: "required",
  acceptedByGuardian: false,
}

// ─── Utilitaires ───

/** Calcule l'age a partir de la date de naissance */
export function computeAge(birthDate: string): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

/** Determine si l'utilisateur est mineur */
export function isMinor(birthDate: string): boolean {
  return computeAge(birthDate) < MAJORITY_AGE
}

/** Determine si l'age est suffisant pour s'inscrire (>= 16) */
export function isEligibleForSignup(birthDate: string): boolean {
  const age = computeAge(birthDate)
  return age >= MINOR_MIN_AGE
}

// ─── VISUpoints operations ───

/** Credite des VISUpoints en respectant le plafond mineur */
export function creditVisupoints(
  currentBalance: number,
  points: number,
  userIsMinor: boolean
): { newBalance: number; capped: boolean; pointsLost: number } {
  if (userIsMinor) {
    const newBalance = Math.min(currentBalance + points, MINOR_VISUPOINTS_CAP)
    const actualGain = newBalance - currentBalance
    return {
      newBalance,
      capped: actualGain < points,
      pointsLost: points - actualGain,
    }
  }
  return {
    newBalance: currentBalance + points,
    capped: false,
    pointsLost: 0,
  }
}

/** Verifie si un utilisateur peut retirer ses gains */
export function canWithdraw(userIsMinor: boolean, kycVerified: boolean): {
  allowed: boolean
  reason?: string
} {
  if (userIsMinor) {
    return {
      allowed: false,
      reason: "Les retraits sont bloqu\u00e9s jusqu'\u00e0 la majorit\u00e9 (18 ans). Vos VISUpoints seront convertibles \u00e0 vos 18 ans.",
    }
  }
  if (!kycVerified) {
    return {
      allowed: false,
      reason: "V\u00e9rification d'identit\u00e9 (KYC) requise avant tout retrait. Connectez Stripe pour v\u00e9rifier votre identit\u00e9.",
    }
  }
  return { allowed: true }
}

/** Verifie si un utilisateur peut investir */
export function canInvest(userIsMinor: boolean): {
  allowed: boolean
  reason?: string
} {
  if (userIsMinor) {
    return {
      allowed: false,
      reason: "L'investissement n'est pas autoris\u00e9 pour les utilisateurs mineurs (moins de 18 ans).",
    }
  }
  return { allowed: true }
}

/** Verifie si un utilisateur peut convertir ses VISUpoints en euros */
export function canConvertVisupoints(userIsMinor: boolean): {
  allowed: boolean
  reason?: string
} {
  if (userIsMinor) {
    return {
      allowed: false,
      reason: "La conversion de VISUpoints en euros n'est pas autoris\u00e9e avant 18 ans.",
    }
  }
  return { allowed: true }
}

// ─── Engagement Redirect Engine ───

export type EngagementRedirectLevel = "none" | "info" | "warning" | "critical"

export interface EngagementRedirectResult {
  level: EngagementRedirectLevel
  title: string
  message: string
  showPathA: boolean // Chemin A : consommer du contenu
  showPathB: boolean // Chemin B : evoluer vers profil avance
}

const ENGAGEMENT_INFO_THRESHOLD = 2_000
const ENGAGEMENT_WARNING_THRESHOLD = 2_300
const ENGAGEMENT_CRITICAL_THRESHOLD = 2_450

/**
 * Moteur d'incitation a l'engagement.
 * Se declenche uniquement pour les Visiteurs majeurs
 * avec 2000+ VISUpoints.
 *
 * Deux chemins proposes :
 * A) Consommer du contenu (paiement hybride 30% cash min / 70% VISUpoints max)
 * B) Evoluer vers un profil avance (Investisseur, Auditeur, etc.)
 */
export function engagementRedirectEngine(
  role: string,
  visupoints: number,
  isUserMinor: boolean
): EngagementRedirectResult | null {
  // Ne s'applique qu'aux visiteurs majeurs
  if (role !== "visitor" || isUserMinor) return null
  if (visupoints < ENGAGEMENT_INFO_THRESHOLD) return null

  if (visupoints >= ENGAGEMENT_CRITICAL_THRESHOLD) {
    return {
      level: "critical",
      title: "Vous approchez du plafond de 2 500 pts !",
      message: "Il est temps d'utiliser vos VISUpoints : consommez du contenu ou passez au niveau sup\u00e9rieur pour d\u00e9bloquer plus de fonctionnalit\u00e9s.",
      showPathA: true,
      showPathB: true,
    }
  }
  if (visupoints >= ENGAGEMENT_WARNING_THRESHOLD) {
    return {
      level: "warning",
      title: "Vos VISUpoints s'accumulent !",
      message: "Profitez-en pour acc\u00e9der \u00e0 du contenu premium ou explorez de nouveaux r\u00f4les sur VISUAL.",
      showPathA: true,
      showPathB: true,
    }
  }
  return {
    level: "info",
    title: "Vous avez d\u00e9j\u00e0 2 000 VISUpoints !",
    message: "Saviez-vous que vous pouvez utiliser vos points pour acc\u00e9der \u00e0 du contenu ? D\u00e9couvrez les possibilit\u00e9s.",
    showPathA: true,
    showPathB: false,
  }
}

/**
 * Calcule le paiement hybride pour l'achat de contenu (Chemin A).
 * Minimum 30% en euros, maximum 70% en VISUpoints.
 * Bonus : 5% des points depenses sont regagnes (max 200/mois).
 */
export function computeHybridPurchase(
  priceCents: number,
  userPoints: number,
  bonusUsedThisMonth: number = 0
): {
  cashCents: number
  pointsUsed: number
  bonusEarned: number
  remainingPoints: number
} {
  const cashMinCents = Math.ceil(priceCents * 0.30)
  const pointsPartCents = priceCents - cashMinCents
  // 1 point = 1 centime (100 pts = 1 EUR)
  const pointsNeeded = pointsPartCents
  const pointsUsed = Math.min(pointsNeeded, userPoints)
  const cashCents = priceCents - pointsUsed

  // Bonus 5% plafonné à 200/mois
  const rawBonus = Math.floor(pointsUsed * 0.05)
  const bonusCap = Math.max(0, 200 - bonusUsedThisMonth)
  const bonusEarned = Math.min(rawBonus, bonusCap)

  return {
    cashCents,
    pointsUsed,
    bonusEarned,
    remainingPoints: userPoints - pointsUsed,
  }
}

/** Deblocage automatique a la majorite (a appeler au login) */
export function checkMajorityUnlock(
  profile: UserVisupointsProfile
): UserVisupointsProfile {
  if (!profile.birthDate) return profile
  if (!profile.isMinor) return profile

  if (!isMinor(profile.birthDate)) {
    return {
      ...profile,
      isMinor: false,
      visupointsCap: Infinity,
      parentConsent: {
        ...profile.parentConsent,
        status: "not_required",
      },
    }
  }
  return profile
}
