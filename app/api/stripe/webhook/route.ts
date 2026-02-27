import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { sql } from "@/lib/db";
import { ErrorCodes, apiError } from "@/lib/api-errors";

/**
 * POST /api/stripe/webhook
 *
 * Hardened V2:
 * - Idempotency guard: checks ledger_entries for duplicate stripe_payment_intent_id
 *   before applying any state change, preventing double-credits.
 * - Business logic is extracted into dedicated handler functions.
 * - Standardized error codes via api-errors.ts.
 * - Event ID is logged for replay/reconciliation capability.
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return apiError(ErrorCodes.ERR_STRIPE_WEBHOOK_INVALID, "No Stripe signature", 400);
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("[VISUAL Webhook] Signature verification failed:", message);
    return apiError(ErrorCodes.ERR_STRIPE_WEBHOOK_INVALID, message, 400);
  }

  // ── Log incoming event for reconciliation ──
  const eventId = event.id;
  const eventType = event.type;
  console.log(`[VISUAL Webhook] Received event ${eventId} (${eventType})`);

  try {
    switch (eventType) {
      case "account.updated":
        await handleAccountUpdated(event.data.object);
        break;

      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object, eventId);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;

      case "transfer.created":
        await handleTransferCreated(event.data.object);
        break;

      default:
        console.log(`[VISUAL Webhook] Unhandled event type: ${eventType}`);
    }
  } catch (error) {
    console.error(`[VISUAL Webhook] Processing error for event ${eventId}:`, error);
    return apiError(
      ErrorCodes.ERR_WEBHOOK_PROCESSING,
      "Webhook processing failed",
      500,
      `Event ID: ${eventId} -- use this to replay via admin reconciliation.`
    );
  }

  return NextResponse.json({ received: true, eventId });
}

// ── Idempotency guard ──

async function isPaymentAlreadyProcessed(paymentIntentId: string): Promise<boolean> {
  const existing = await sql`
    SELECT id FROM ledger_entries
    WHERE meta->>'stripe_payment_intent_id' = ${paymentIntentId}
    LIMIT 1
  `;
  if (existing.length > 0) return true;

  // Also check investments table for completed status
  const existingInvestment = await sql`
    SELECT id FROM investments
    WHERE stripe_payment_intent_id = ${paymentIntentId}
      AND status = 'completed'
    LIMIT 1
  `;
  return existingInvestment.length > 0;
}

// ── Handler: account.updated ──

async function handleAccountUpdated(account: Record<string, unknown>) {
  const stripeAccountId = account.id as string;

  const newStatus =
    (account.charges_enabled && account.payouts_enabled)
      ? "verified"
      : (account.details_submitted)
        ? "pending"
        : "not_started";

  await sql`
    UPDATE stripe_accounts
    SET status = ${newStatus},
        charges_enabled = ${(account.charges_enabled ?? false) as boolean},
        payouts_enabled = ${(account.payouts_enabled ?? false) as boolean},
        updated_at = now()
    WHERE stripe_account_id = ${stripeAccountId}
  `;
}

// ── Handler: payment_intent.succeeded ──

async function handlePaymentSucceeded(paymentIntent: Record<string, unknown>, eventId: string) {
  const piId = paymentIntent.id as string;
  const metadata = (paymentIntent.metadata || {}) as Record<string, string>;

  // ── IDEMPOTENCY CHECK ──
  if (await isPaymentAlreadyProcessed(piId)) {
    console.warn(`[VISUAL Webhook] DUPLICATE detected: payment_intent ${piId} already processed. Skipping. Event: ${eventId}`);
    return; // Return 200 to Stripe so it stops retrying
  }

  if (metadata.type === "caution") {
    await handleCautionPayment(piId, metadata);
  } else if (metadata.type === "investment") {
    await handleInvestmentPayment(piId, metadata, paymentIntent);
  }
}

// ── Sub-handler: Caution payment ──

async function handleCautionPayment(piId: string, metadata: Record<string, string>) {
  await sql`
    UPDATE cautions
    SET status = 'paid', paid_at = now()
    WHERE stripe_payment_intent_id = ${piId}
  `;

  if (metadata.caution_type === "creator") {
    await sql`
      UPDATE users
      SET roles = array_append(
        CASE WHEN 'porter' = ANY(roles) THEN roles ELSE array_append(roles, 'porter') END,
        'infoporter'
      ),
      updated_at = now()
      WHERE id = ${metadata.user_id}
        AND NOT ('infoporter' = ANY(roles))
    `;
  } else if (metadata.caution_type === "investor") {
    await sql`
      UPDATE users
      SET roles = array_append(roles, 'investor'),
      updated_at = now()
      WHERE id = ${metadata.user_id}
        AND NOT ('investor' = ANY(roles))
    `;
  }
}

// ── Sub-handler: Investment payment ──

async function handleInvestmentPayment(
  piId: string,
  metadata: Record<string, string>,
  paymentIntent: Record<string, unknown>
) {
  // Mark investment as completed
  await sql`
    UPDATE investments
    SET status = 'completed'
    WHERE stripe_payment_intent_id = ${piId}
  `;

  // Update content investment totals
  const amountCents = paymentIntent.amount as number;
  await sql`
    UPDATE contents
    SET current_investment_cents = current_investment_cents + ${amountCents},
        investor_count = investor_count + 1,
        updated_at = now()
    WHERE id = ${metadata.content_id}
  `;

  // Record wallet transaction with stripe_payment_intent_id in reference for traceability
  await sql`
    INSERT INTO wallet_transactions (user_id, type, amount_cents, description, reference_id)
    VALUES (
      ${metadata.user_id},
      'investment',
      ${-amountCents},
      ${'Investissement: ' + (metadata.content_title || '')},
      ${piId}
    )
  `;
}

// ── Handler: payment_intent.payment_failed ──

async function handlePaymentFailed(paymentIntent: Record<string, unknown>) {
  const piId = paymentIntent.id as string;

  await sql`
    UPDATE investments SET status = 'failed' WHERE stripe_payment_intent_id = ${piId}
  `;
  await sql`
    UPDATE cautions SET status = 'pending' WHERE stripe_payment_intent_id = ${piId}
  `;
}

// ── Handler: transfer.created ──

async function handleTransferCreated(transfer: Record<string, unknown>) {
  const metadata = (transfer.metadata || {}) as Record<string, string>;
  if (metadata.withdrawal_id) {
    await sql`
      UPDATE withdrawal_requests
      SET status = 'completed',
          stripe_transfer_id = ${transfer.id as string},
          processed_at = now()
      WHERE id = ${metadata.withdrawal_id}
    `;
  }
}
