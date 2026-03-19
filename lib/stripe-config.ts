/**
 * VIXUAL — lib/stripe-config.ts
 * Chargement sécurisé de la configuration Stripe.
 *
 * Priorité :
 *   1. Base de données (table stripe_config) — modifiable depuis l'ADMIN
 *   2. Variables d'environnement (.env.local / Vercel env) — fallback
 *
 * Ce module est SERVER ONLY.
 */
import "server-only";
import { neon } from "@neondatabase/serverless";
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

// ── Chiffrement AES-256-GCM ──────────────────────────────────────────────────

const ENCRYPTION_KEY_RAW = process.env.ADMIN_ENCRYPTION_KEY || "VIXUAL_DEV_FALLBACK_KEY_32chars!!";
// Derive a 32-byte key from the raw string
const DERIVED_KEY = scryptSync(ENCRYPTION_KEY_RAW, "vixual-stripe-salt", 32);

export function encryptValue(plaintext: string): string {
  if (!plaintext) return "";
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", DERIVED_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // Format: iv(hex):tag(hex):ciphertext(hex)
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decryptValue(ciphertext: string): string {
  if (!ciphertext || !ciphertext.includes(":")) return ciphertext; // not encrypted
  try {
    const [ivHex, tagHex, encHex] = ciphertext.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");
    const enc = Buffer.from(encHex, "hex");
    const decipher = createDecipheriv("aes-256-gcm", DERIVED_KEY, iv);
    decipher.setAuthTag(tag);
    return decipher.update(enc).toString("utf8") + decipher.final("utf8");
  } catch {
    // If decryption fails, return the raw value (backward compat with unencrypted rows)
    return ciphertext;
  }
}

// ── Types ────────────────────────────────────────────────────────────────────

export type StripeMode = "test" | "live";

export interface StripeRuntimeConfig {
  secretKey: string;
  publishableKey: string;
  webhookSecret: string;
  connectClientId: string;
  mode: StripeMode;
  source: "database" | "environment";
}

// ── Chargement depuis la base ─────────────────────────────────────────────────

let _cache: (StripeRuntimeConfig & { fetchedAt: number }) | null = null;
const CACHE_TTL_MS = 60_000; // 1 minute

export async function getStripeConfig(): Promise<StripeRuntimeConfig> {
  // Use in-memory cache to avoid a DB hit on every request
  if (_cache && Date.now() - _cache.fetchedAt < CACHE_TTL_MS) {
    return _cache;
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      SELECT
        test_secret_key, test_publishable_key, test_webhook_secret,
        live_secret_key, live_publishable_key, live_webhook_secret,
        active_mode, connect_client_id
      FROM stripe_config
      WHERE id = 1
      LIMIT 1
    `;

    if (rows.length > 0) {
      const row = rows[0];
      const mode = (row.active_mode as StripeMode) || "test";

      const secretKey =
        mode === "test"
          ? decryptValue(row.test_secret_key as string || "")
          : decryptValue(row.live_secret_key as string || "");

      const publishableKey =
        mode === "test"
          ? (row.test_publishable_key as string || "")
          : (row.live_publishable_key as string || "");

      const webhookSecret =
        mode === "test"
          ? decryptValue(row.test_webhook_secret as string || "")
          : decryptValue(row.live_webhook_secret as string || "");

      // Only use DB config if there's actually a secret key configured
      if (secretKey && secretKey.startsWith("sk_")) {
        const config: StripeRuntimeConfig = {
          secretKey,
          publishableKey,
          webhookSecret,
          connectClientId: (row.connect_client_id as string) || "",
          mode,
          source: "database",
        };
        _cache = { ...config, fetchedAt: Date.now() };
        return config;
      }
    }
  } catch {
    // DB unavailable — fall through to env vars
  }

  // ── Fallback: variables d'environnement ──────────────────────────────────
  const envMode: StripeMode =
    process.env.NEXT_PUBLIC_STRIPE_TEST_MODE !== "false" ? "test" : "live";

  const config: StripeRuntimeConfig = {
    secretKey:
      envMode === "test"
        ? process.env.STRIPE_TEST_SECRET_KEY || process.env.STRIPE_SECRET_KEY || ""
        : process.env.STRIPE_LIVE_SECRET_KEY || process.env.STRIPE_SECRET_KEY || "",
    publishableKey:
      envMode === "test"
        ? process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY || ""
        : process.env.NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY || "",
    webhookSecret:
      envMode === "test"
        ? process.env.STRIPE_TEST_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET || ""
        : process.env.STRIPE_LIVE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET || "",
    connectClientId: process.env.STRIPE_CONNECT_CLIENT_ID || "",
    mode: envMode,
    source: "environment",
  };

  _cache = { ...config, fetchedAt: Date.now() };
  return config;
}

/** Invalider le cache (appelé après une mise à jour depuis l'admin) */
export function invalidateStripeConfigCache() {
  _cache = null;
}

/** Masquer une clé pour l'affichage (sk_test_xxxx...xxxx) */
export function maskKey(key: string): string {
  if (!key || key.length < 12) return "••••••••";
  return key.slice(0, 10) + "••••••••" + key.slice(-4);
}
