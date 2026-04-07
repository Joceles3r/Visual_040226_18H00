import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getStripeConfig } from "@/lib/stripe-config";
import { STRIPE_CANONICAL_WEBHOOK_PATH, validateModeKeyConsistency } from "@/lib/integrations/stripe/constants";
import { runtimeFlags, isProduction } from "@/lib/runtime-flags";

/**
 * GET /api/admin/stripe-health
 * 
 * Endpoint de health-check Stripe pour l'admin.
 * Verifie:
 * - Acces DB config
 * - Source config (database ou memory)
 * - Mode actif (test/live)
 * - Presence des cles
 * - Coherence mode/cles
 * - Derniere date de mise a jour
 */
export async function GET() {
  const health: {
    ok: boolean;
    source: "database" | "memory" | "error";
    mode: "test" | "live" | null;
    has_secret_key: boolean;
    has_publishable_key: boolean;
    has_webhook_secret: boolean;
    webhook_url: string;
    updated_at: string | null;
    updated_by: string | null;
    warnings: string[];
    errors: string[];
    can_process_payments: boolean;
    can_receive_webhooks: boolean;
    mode_key_consistent: boolean;
  } = {
    ok: false,
    source: "error",
    mode: null,
    has_secret_key: false,
    has_publishable_key: false,
    has_webhook_secret: false,
    webhook_url: STRIPE_CANONICAL_WEBHOOK_PATH,
    updated_at: null,
    updated_by: null,
    warnings: [],
    errors: [],
    can_process_payments: false,
    can_receive_webhooks: false,
    mode_key_consistent: false,
  };

  try {
    // Tenter de charger la config depuis la DB
    let dbAvailable = false;
    let dbConfig: Record<string, unknown> | null = null;

    try {
      const rows = await sql`SELECT * FROM stripe_config WHERE id = 1 LIMIT 1`;
      if (rows.length > 0) {
        dbConfig = rows[0] as Record<string, unknown>;
        dbAvailable = true;
        health.source = "database";
      }
    } catch (dbError) {
      health.warnings.push("Base de donnees inaccessible - fallback memoire");
    }

    // Si pas de DB, utiliser le cache memoire
    if (!dbAvailable) {
      health.source = "memory";
      health.warnings.push("Configuration en memoire volatile - sera perdue au redemarrage");
      
      if (isProduction() && runtimeFlags.requireDatabaseForStripe) {
        health.errors.push("CRITIQUE: Configuration memoire interdite en production");
      }
    }

    // Charger la config (depuis DB ou memoire)
    const config = await getStripeConfig();
    
    health.mode = config.mode;
    health.has_secret_key = !!config.secretKey;
    health.has_publishable_key = !!config.publishableKey;
    health.has_webhook_secret = !!config.webhookSecret;
    health.updated_at = config.updatedAt || null;
    health.updated_by = config.updatedBy || null;

    // Verifications de coherence
    if (!health.has_secret_key) {
      health.errors.push("Cle secrete Stripe manquante");
    }
    if (!health.has_publishable_key) {
      health.warnings.push("Cle publique Stripe manquante");
    }
    if (!health.has_webhook_secret) {
      health.warnings.push("Secret webhook Stripe manquant - webhooks non securises");
    }

    // Validation coherence mode/cles
    if (config.secretKey && config.mode) {
      const consistency = validateModeKeyConsistency(
        config.mode,
        config.secretKey,
        config.publishableKey
      );
      health.mode_key_consistent = consistency.valid;
      if (!consistency.valid) {
        health.errors.push(...consistency.errors);
      }
    }

    // Determiner les capacites
    health.can_process_payments = health.has_secret_key && health.mode_key_consistent;
    health.can_receive_webhooks = health.has_webhook_secret;

    // Verdict final
    health.ok = 
      health.errors.length === 0 && 
      health.source === "database" &&
      health.can_process_payments;

    // Warnings supplementaires
    if (health.mode === "live" && health.source === "memory") {
      health.errors.push("DANGER: Mode LIVE avec stockage memoire volatile");
    }

    if (health.mode === "live" && !isProduction()) {
      health.warnings.push("Mode LIVE actif en environnement de developpement");
    }

    return NextResponse.json(health);

  } catch (error) {
    health.errors.push(`Erreur systeme: ${error instanceof Error ? error.message : "Inconnue"}`);
    return NextResponse.json(health, { status: 500 });
  }
}
