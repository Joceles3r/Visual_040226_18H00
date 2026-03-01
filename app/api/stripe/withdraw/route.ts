import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { sql } from "@/lib/db";
import { STRIPE_CONFIG } from "@/lib/payout/constants";
import { apiError, ErrorCodes, withErrorHandler } from "@/lib/api-errors";

/** Seuil en centimes au-dela duquel un retrait passe en revue manuelle 72h */
const REVIEW_THRESHOLD_CENTS = 100_000; // 1000 EUR
/** Duree du hold en heures */
const REVIEW_HOLD_HOURS = 72;

// POST: Request a withdrawal from wallet to Stripe Connect account
export const POST = withErrorHandler(async (req: Request) => {
  const body = await req.json();
  const { userId, amountCents } = body;

  if (!userId || !amountCents) {
    return apiError(ErrorCodes.ERR_MISSING_FIELD, "userId and amountCents are required", 400);
  }

  if (typeof amountCents !== "number" || amountCents <= 0) {
    return apiError(ErrorCodes.ERR_INVALID_AMOUNT, "amountCents must be a positive number", 400);
  }

  if (amountCents < STRIPE_CONFIG.minWithdrawCents) {
    return apiError(
      ErrorCodes.ERR_INVALID_AMOUNT,
      `Minimum withdrawal is ${STRIPE_CONFIG.minWithdrawCents / 100} EUR`,
      400
    );
  }

  // Check user exists and account is active
  const users = await sql`SELECT id, account_status FROM users WHERE id = ${userId}`;
  if (users.length === 0) {
    return apiError(ErrorCodes.ERR_USER_NOT_FOUND, "User not found", 404);
  }

  if (users[0].account_status === "suspended" || users[0].account_status === "banned") {
    return apiError(
      ErrorCodes.ERR_ACCOUNT_SUSPENDED,
      "Account is suspended or banned. Withdrawals are blocked.",
      403
    );
  }

  // Check wallet balance
  const wallets = await sql`SELECT * FROM wallets WHERE user_id = ${userId}`;
  if (wallets.length === 0) {
    return apiError(ErrorCodes.ERR_WALLET_NOT_FOUND, "No wallet found", 404);
  }
  const wallet = wallets[0];
  if ((wallet.available_cents as number) < amountCents) {
    return apiError(
      ErrorCodes.ERR_INSUFFICIENT_BALANCE,
      `Insufficient balance. Available: ${(wallet.available_cents as number) / 100} EUR, Requested: ${amountCents / 100} EUR`,
      400
    );
  }

  // Check Stripe Connect account is verified with charges and payouts enabled
  const stripeAccounts = await sql`
    SELECT * FROM stripe_accounts WHERE user_id = ${userId}
  `;
  if (stripeAccounts.length === 0) {
    return apiError(ErrorCodes.ERR_STRIPE_CONNECT_REQUIRED, "No Stripe Connect account found. Please complete onboarding first.", 403);
  }
  if (stripeAccounts[0].status !== "verified") {
    return apiError(ErrorCodes.ERR_STRIPE_CONNECT_REQUIRED, "Stripe Connect account must be verified before withdrawal", 403);
  }
  if (!stripeAccounts[0].charges_enabled || !stripeAccounts[0].payouts_enabled) {
    return apiError(
      ErrorCodes.ERR_STRIPE_CONNECT_REQUIRED,
      "Stripe Connect charges_enabled and payouts_enabled must both be active",
      403,
      "Please complete Stripe Connect onboarding and wait for verification."
    );
  }

  const stripeAccountId = stripeAccounts[0].stripe_account_id as string;

  // ── 72h hold for large withdrawals (>= 1000 EUR) ──
  const requiresReview = amountCents >= REVIEW_THRESHOLD_CENTS;

  if (requiresReview) {
    const holdUntil = new Date(Date.now() + REVIEW_HOLD_HOURS * 3600 * 1000);

    // Create withdrawal request in "pending" review status
    const withdrawals = await sql`
      INSERT INTO withdrawal_requests (user_id, amount_cents, status, review_status, hold_until)
      VALUES (${userId}, ${amountCents}, 'held', 'pending', ${holdUntil.toISOString()})
      RETURNING id
    `;
    const withdrawalId = (withdrawals[0] as { id: string }).id;

    // Debit wallet immediately (funds are locked)
    await sql`
      UPDATE wallets
      SET available_cents = available_cents - ${amountCents},
          updated_at = now()
      WHERE user_id = ${userId}
    `;

    // Log the hold transaction
    await sql`
      INSERT INTO wallet_transactions (user_id, type, amount_cents, description, reference_id, status)
      VALUES (${userId}, 'withdrawal_hold', ${-amountCents}, ${"Retrait en attente de validation (72h) -- montant >= 1000 EUR"}, ${withdrawalId}, 'pending')
    `;

    return NextResponse.json({
      withdrawalId,
      amountCents,
      status: "held",
      reviewStatus: "pending",
      holdUntil: holdUntil.toISOString(),
      message: `Retrait de ${amountCents / 100} EUR place en revue manuelle. Delai: ${REVIEW_HOLD_HOURS}h.`,
    });
  }

  // ── Standard withdrawal (< 1000 EUR) -- immediate transfer ──

  // Create withdrawal request
  const withdrawals = await sql`
    INSERT INTO withdrawal_requests (user_id, amount_cents, status, review_status)
    VALUES (${userId}, ${amountCents}, 'processing', 'approved')
    RETURNING id
  `;
  const withdrawalId = (withdrawals[0] as { id: string }).id;

  // Create Stripe Transfer to the connected account
  const transfer = await stripe.transfers.create({
    amount: amountCents,
    currency: "eur",
    destination: stripeAccountId,
    metadata: {
      withdrawal_id: withdrawalId,
      user_id: userId,
    },
  });

  // Update wallet
  await sql`
    UPDATE wallets
    SET available_cents = available_cents - ${amountCents},
        total_withdrawn_cents = total_withdrawn_cents + ${amountCents},
        updated_at = now()
    WHERE user_id = ${userId}
  `;

  // Record wallet transaction
  await sql`
    INSERT INTO wallet_transactions (user_id, type, amount_cents, description, reference_id, status)
    VALUES (${userId}, 'withdrawal', ${-amountCents}, 'Retrait vers compte bancaire', ${transfer.id}, 'completed')
  `;

  // Update withdrawal request
  await sql`
    UPDATE withdrawal_requests
    SET stripe_transfer_id = ${transfer.id}, status = 'completed', processed_at = now()
    WHERE id = ${withdrawalId}
  `;

  return NextResponse.json({
    transferId: transfer.id,
    amountCents,
    status: "completed",
  });
});
