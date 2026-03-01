import "server-only";
import Stripe from "stripe";

// ── Mode detection ──
const isTestMode = process.env.NEXT_PUBLIC_STRIPE_TEST_MODE !== "false";

// ── Key selection (test keys fall back to STRIPE_SECRET_KEY for backward compat) ──
const secretKey = isTestMode
  ? (process.env.STRIPE_TEST_SECRET_KEY || process.env.STRIPE_SECRET_KEY)
  : (process.env.STRIPE_LIVE_SECRET_KEY || process.env.STRIPE_SECRET_KEY);

const webhookSecret = isTestMode
  ? (process.env.STRIPE_TEST_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET)
  : (process.env.STRIPE_LIVE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET);

if (!secretKey) {
  throw new Error(`[VISUAL] Stripe secret key missing for ${isTestMode ? "TEST" : "LIVE"} mode`);
}

// ── Stripe client ──
export const stripe = new Stripe(secretKey, {
  apiVersion: "2025-04-30.basil",
  typescript: true,
});

// ── Exports for webhook verification ──
export const STRIPE_WEBHOOK_SECRET = webhookSecret;

// ── Publishable key (for client-side, exposed via NEXT_PUBLIC) ──
export const STRIPE_PUBLISHABLE_KEY = isTestMode
  ? (process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : (process.env.NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// ── Helpers ──
export function getStripeMode() {
  return {
    isTest: isTestMode,
    environment: isTestMode ? "TEST" : "LIVE" as const,
    warning: isTestMode
      ? "MODE TEST - Aucune transaction reelle"
      : "MODE LIVE - Transactions reelles",
  };
}

export function logStripeEvent(event: string, data: Record<string, unknown>) {
  const prefix = isTestMode ? "[STRIPE TEST]" : "[STRIPE LIVE]";
  console.log(`${prefix} ${event}`, {
    timestamp: new Date().toISOString(),
    ...data,
  });
}
