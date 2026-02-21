import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { sql } from "@/lib/db";
import { CAUTION } from "@/lib/payout/constants";

// POST: Create a payment intent for a caution (security deposit)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, cautionType } = body;

    if (!userId || !cautionType) {
      return NextResponse.json(
        { error: "userId and cautionType are required" },
        { status: 400 }
      );
    }

    if (cautionType !== "creator" && cautionType !== "investor") {
      return NextResponse.json(
        { error: "cautionType must be 'creator' or 'investor'" },
        { status: 400 }
      );
    }

    // Check user exists
    const users = await sql`SELECT id, email, roles FROM users WHERE id = ${userId}`;
    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if caution already paid
    const existingCautions = await sql`
      SELECT id FROM cautions 
      WHERE user_id = ${userId} AND caution_type = ${cautionType} AND status = 'paid'
    `;
    if (existingCautions.length > 0) {
      return NextResponse.json(
        { error: "Caution already paid for this type" },
        { status: 409 }
      );
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
  } catch (error: unknown) {
    console.error("Caution error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
