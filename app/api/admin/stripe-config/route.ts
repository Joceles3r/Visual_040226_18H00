/**
 * VIXUAL — app/api/admin/stripe-config/route.ts
 *
 * API sécurisée pour lire et mettre à jour la configuration Stripe.
 * Réservée au PATRON (jocelyndru@gmail.com).
 *
 * GET  /api/admin/stripe-config       → lit la config (clés masquées)
 * POST /api/admin/stripe-config       → met à jour la config
 * PATCH /api/admin/stripe-config      → bascule le mode test/live
 */
import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { encryptValue, decryptValue, maskKey, invalidateStripeConfigCache } from "@/lib/stripe-config";
import { PATRON_EMAIL } from "@/lib/admin/roles";

// ── Auth guard ────────────────────────────────────────────────────────────────

function getAdminEmail(req: NextRequest): string | null {
  // Accept email from JSON body or query param (for GET)
  // In production, replace with session/cookie verification
  const email = req.headers.get("x-admin-email") || req.nextUrl.searchParams.get("email");
  return email;
}

function isPatron(email: string | null): boolean {
  return email === PATRON_EMAIL;
}

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const email = getAdminEmail(req);
  if (!isPatron(email)) {
    return NextResponse.json({ error: "Accès réservé au PATRON" }, { status: 403 });
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      SELECT
        test_secret_key, test_publishable_key, test_webhook_secret,
        live_secret_key, live_publishable_key, live_webhook_secret,
        active_mode, connect_client_id,
        updated_by, updated_at
      FROM stripe_config
      WHERE id = 1
      LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json({ configured: false, active_mode: "test" });
    }

    const row = rows[0];

    // Decrypt then re-mask for display
    const testSecretRaw = decryptValue(row.test_secret_key as string || "");
    const liveSecretRaw = decryptValue(row.live_secret_key as string || "");
    const testWebhookRaw = decryptValue(row.test_webhook_secret as string || "");
    const liveWebhookRaw = decryptValue(row.live_webhook_secret as string || "");

    return NextResponse.json({
      configured: !!(testSecretRaw || liveSecretRaw),
      active_mode: row.active_mode,
      updated_by: row.updated_by,
      updated_at: row.updated_at,
      // Masked values for display
      test_secret_key_masked: maskKey(testSecretRaw),
      test_publishable_key: row.test_publishable_key || "",
      test_webhook_secret_masked: maskKey(testWebhookRaw),
      live_secret_key_masked: maskKey(liveSecretRaw),
      live_publishable_key: row.live_publishable_key || "",
      live_webhook_secret_masked: maskKey(liveWebhookRaw),
      connect_client_id: row.connect_client_id || "",
      // Presence flags (so the UI knows what's filled)
      has_test_secret: testSecretRaw.startsWith("sk_test_"),
      has_live_secret: liveSecretRaw.startsWith("sk_live_"),
      has_test_webhook: testWebhookRaw.startsWith("whsec_"),
      has_live_webhook: liveWebhookRaw.startsWith("whsec_"),
    });
  } catch (err) {
    console.error("[Admin/StripeConfig] GET error:", err);
    return NextResponse.json({ error: "Erreur base de données" }, { status: 500 });
  }
}

// ── POST ──────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
  }

  const { email } = body;
  if (!isPatron(email)) {
    return NextResponse.json({ error: "Accès réservé au PATRON" }, { status: 403 });
  }

  // Validate keys format
  const validations: string[] = [];
  if (body.test_secret_key && !body.test_secret_key.startsWith("sk_test_")) {
    validations.push("La clé secrète TEST doit commencer par sk_test_");
  }
  if (body.live_secret_key && !body.live_secret_key.startsWith("sk_live_")) {
    validations.push("La clé secrète LIVE doit commencer par sk_live_");
  }
  if (body.test_publishable_key && !body.test_publishable_key.startsWith("pk_test_")) {
    validations.push("La clé publique TEST doit commencer par pk_test_");
  }
  if (body.live_publishable_key && !body.live_publishable_key.startsWith("pk_live_")) {
    validations.push("La clé publique LIVE doit commencer par pk_live_");
  }
  if (body.test_webhook_secret && !body.test_webhook_secret.startsWith("whsec_")) {
    validations.push("Le secret webhook TEST doit commencer par whsec_");
  }
  if (body.live_webhook_secret && !body.live_webhook_secret.startsWith("whsec_")) {
    validations.push("Le secret webhook LIVE doit commencer par whsec_");
  }
  if (body.active_mode && !["test", "live"].includes(body.active_mode)) {
    validations.push("active_mode doit être 'test' ou 'live'");
  }

  if (validations.length > 0) {
    return NextResponse.json({ error: validations.join(" | ") }, { status: 422 });
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);

    // Build update fields dynamically
    const updates: Record<string, string | null> = {
      updated_by: email,
      updated_at: new Date().toISOString(),
    };

    if (body.test_secret_key !== undefined)
      updates.test_secret_key = body.test_secret_key ? encryptValue(body.test_secret_key) : null;
    if (body.test_publishable_key !== undefined)
      updates.test_publishable_key = body.test_publishable_key || null;
    if (body.test_webhook_secret !== undefined)
      updates.test_webhook_secret = body.test_webhook_secret ? encryptValue(body.test_webhook_secret) : null;
    if (body.live_secret_key !== undefined)
      updates.live_secret_key = body.live_secret_key ? encryptValue(body.live_secret_key) : null;
    if (body.live_publishable_key !== undefined)
      updates.live_publishable_key = body.live_publishable_key || null;
    if (body.live_webhook_secret !== undefined)
      updates.live_webhook_secret = body.live_webhook_secret ? encryptValue(body.live_webhook_secret) : null;
    if (body.active_mode !== undefined)
      updates.active_mode = body.active_mode;
    if (body.connect_client_id !== undefined)
      updates.connect_client_id = body.connect_client_id || null;

    await sql`
      INSERT INTO stripe_config (id, ${sql(Object.keys(updates))})
      VALUES (1, ${sql(Object.values(updates) as string[])})
      ON CONFLICT (id) DO UPDATE
        SET ${sql(updates)}
    `;

    // Invalidate the in-memory cache so next request picks up new keys
    invalidateStripeConfigCache();

    return NextResponse.json({
      success: true,
      message: "Configuration Stripe mise à jour avec succès",
      active_mode: body.active_mode || "inchangé",
    });
  } catch (err) {
    console.error("[Admin/StripeConfig] POST error:", err);
    return NextResponse.json({ error: "Erreur lors de la sauvegarde" }, { status: 500 });
  }
}

// ── PATCH — basculer mode test/live ──────────────────────────────────────────

export async function PATCH(req: NextRequest) {
  let body: { email: string; mode: "test" | "live" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
  }

  if (!isPatron(body.email)) {
    return NextResponse.json({ error: "Accès réservé au PATRON" }, { status: 403 });
  }

  if (!["test", "live"].includes(body.mode)) {
    return NextResponse.json({ error: "mode doit être 'test' ou 'live'" }, { status: 422 });
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    await sql`
      UPDATE stripe_config
      SET active_mode = ${body.mode}, updated_by = ${body.email}, updated_at = NOW()
      WHERE id = 1
    `;
    invalidateStripeConfigCache();

    return NextResponse.json({
      success: true,
      message: `Mode basculé en ${body.mode.toUpperCase()}`,
      active_mode: body.mode,
    });
  } catch (err) {
    console.error("[Admin/StripeConfig] PATCH error:", err);
    return NextResponse.json({ error: "Erreur lors du basculement de mode" }, { status: 500 });
  }
}
