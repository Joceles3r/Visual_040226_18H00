/**
 * VISUAL Trust Score -- Type Definitions
 *
 * 4-level system based on a 0-100 score.
 */

export type TrustLevel = "newcomer" | "member" | "trusted" | "verified";

export interface TrustProfile {
  userId: string;
  score: number;
  level: TrustLevel;
  lastUpdate: string | null;
}

export interface TrustEvent {
  id?: string;
  userId: string;
  eventType: TrustEventType;
  delta: number;
  reason: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
}

export type TrustEventType =
  // Positive events
  | "email_verified"
  | "phone_verified"
  | "kyc_verified"
  | "first_investment"
  | "content_validated"
  | "regular_login"
  | "streak_7_days"
  | "streak_30_days"
  | "guardian_approved"
  | "profile_completed"
  | "referral_success"
  // Negative events
  | "fraud_detected"
  | "chargeback"
  | "spam_reported"
  | "abuse_reported"
  | "payment_failed"
  | "content_rejected"
  | "suspension_warning"
  | "suspension_temporary"
  | "suspension_permanent"
  | "inactivity_90_days"
  // Admin events
  | "admin_boost"
  | "admin_penalty";

export const TRUST_LEVEL_THRESHOLDS: Record<TrustLevel, { min: number; max: number }> = {
  newcomer: { min: 0, max: 29 },
  member: { min: 30, max: 59 },
  trusted: { min: 60, max: 79 },
  verified: { min: 80, max: 100 },
};

export const TRUST_LEVEL_LABELS: Record<TrustLevel, string> = {
  newcomer: "Nouveau",
  member: "Membre",
  trusted: "Fiable",
  verified: "Verifie",
};

export function scoreToLevel(score: number): TrustLevel {
  if (score >= 80) return "verified";
  if (score >= 60) return "trusted";
  if (score >= 30) return "member";
  return "newcomer";
}
