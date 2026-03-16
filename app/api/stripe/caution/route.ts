import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { sql } from "@/lib/db";
import { CAUTION } from "@/lib/payout/constants";
import { apiError, ErrorCodes, withErrorHandler } from "@/lib/api-errors";

// POST: Create a payment intent for a caution (security deposit)
export const POST = withErrorHandler(async (req: Request) => {
  const body = await req.json();
  const { userId, cautionType } = body;

  if (!userId || !cautionType) {
    return apiError(ErrorCodes.ERR_MISSING_FIELD, "userId and cautionType are required", 400);
  }

  if (cautionType !== "creator" && cautionType !== "investor") {
    return apiError(ErrorCodes.ERR_INVALID_INPUT, "cautionType must be 'creator' or 'investor'", 400);
  }

  // Check user exists and account is active
  const users = await sql`SELECT id, email, roles, account_status FROM users WHERE id = ${userId}`;
  if (users.length === 0) {
    return apiError(ErrorCodes.ERR_USER_NOT_FOUND, "User not found", 404);
  }

  const user = users[0];
  if (user.account_status === "suspended" || user.account_status === "banned") {
    return apiError(ErrorCodes.ERR_ACCOUNT_SUSPENDED, "Account is suspended or banned. Financial operations are blocked.", 403);
  }

  // Check if caution already paid
  const existingCautions = await sql`
    SELECT id FROM cautions 
    WHERE user_id = ${userId} AND caution_type = ${cautionType} AND status = 'paid'
  `;
  if (existingCautions.length > 0) {
    return apiError(ErrorCodes.ERR_CAUTION_ALREADY_PAID, "Caution already paid for this type", 409);
  }

  const amountCents = cautionType === "creator" ? CAUTION.creator : CAUTION.investor;

  // Create Stripe Payment Intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: "eur",
    metadata: {
      type: "caution",
      caution_type: cautionType,
      user_id: userId,
    },
  });

  // Record caution in DB
  await sql`
    INSERT INTO cautions (user_id, caution_type, amount_cents, stripe_payment_intent_id, status)
    VALUES (${userId}, ${cautionType}, ${amountCents}, ${paymentIntent.id}, 'pending')
  `;

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    amountCents,
    cautionType,
  });
});
