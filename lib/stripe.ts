/**
 * VIXUAL — lib/stripe.ts (version unifiee)
 *
 * Configuration Stripe centralisee via la base de donnees (table stripe_config).
 * Les variables d'environnement sont utilisees en fallback uniquement.
 *
 * PATCH SUPER-REMEDE: Suppression des exports synchrones obsoletes (_stripeSync, stripe, STRIPE_WEBHOOK_SECRET)
 * Seules les fonctions asynchrones sont desormais supportees pour garantir la coherence.
 *
 * SERVER ONLY.
 */
import "server-only";
import Stripe from "stripe";
import { getStripeConfig } from "./stripe-config";

// ── Client Stripe (initialise de facon lazy pour permettre la config DB) ──

let _stripeClient: Stripe | null = null;
let _clientMode: string | null = null;

/**
 * Retourne une instance Stripe configuree avec les cles actives (depuis la DB ou l'environnement).
 * Initialisation lazy et singleton pour optimiser les performances.
 */
export async function getStripeClient(): Promise<Stripe> {
  const config = await getStripeConfig();

  // Re-creer le client si le mode ou la cle secrete a change
  if (!_stripeClient || _clientMode !== config.secretKey) {
    if (!config.secretKey) {
      throw new Error(
        "[VIXUAL] Aucune cle secrete Stripe configuree. " +
        "Ajoutez vos cles depuis l'Admin → Config Stripe, " +
        "ou definissez STRIPE_TEST_SECRET_KEY dans .env.local"
      );
    }
    _stripeClient = new Stripe(config.secretKey, {
      apiVersion: "2026-01-28.clover",
      typescript: true,
    });
    _clientMode = config.secretKey;
  }

  return _stripeClient;
}

/**
 * Verifie si Stripe est configure (asynchrone, utilise la config DB).
 */
export async function isStripeConfiguredAsync(): Promise<boolean> {
  const config = await getStripeConfig();
  return !!config.secretKey;
}

/**
 * Recupere le secret du webhook (asynchrone, utilise la config DB).
 */
export async function getWebhookSecret(): Promise<string> {
  const config = await getStripeConfig();
  if (!config.webhookSecret) {
    throw new Error("[VIXUAL] Secret de webhook Stripe non configure.");
  }
  return config.webhookSecret;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getStripeMode() {
  const isTest = process.env.NEXT_PUBLIC_STRIPE_TEST_MODE !== "false";
  return {
    isTest,
    environment: (isTest ? "TEST" : "LIVE") as "TEST" | "LIVE",
    warning: isTest
      ? "MODE TEST - Aucune transaction reelle"
      : "MODE LIVE - Transactions reelles actives",
  };
}

export function logStripeEvent(event: string, data: Record<string, unknown>) {
  const mode = getStripeMode();
  const prefix = mode.isTest ? "[STRIPE TEST]" : "[STRIPE LIVE]";
  console.log(`${prefix} ${event}`, {
    timestamp: new Date().toISOString(),
    ...data,
  });
}

// Alias pour la compatibilite (a terme, tous les appels devraient utiliser getStripeClient directement)
export const getStripe = getStripeClient;
