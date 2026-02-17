import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { sql } from "@/lib/db";
import {
  INVESTMENT_TIERS_EUR,
  getVotesForInvestment,
  getVisupointsForInvestment,
} from "@/lib/payout/constants";

// POST: Create a payment intent for an investment
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, contentId, amountEur } = body;

    if (!userId || !contentId || !amountEur) {
      return NextResponse.json(
        { error: "userId, contentId, and amountEur are required" },
        { status: 400 }
      );
    }

    // Validate the investment tier
    if (!INVESTMENT_TIERS_EUR.includes(amountEur)) {
      return NextResponse.json(
        { error: `Invalid investment amount. Allowed: ${INVESTMENT_TIERS_EUR.join(", ")} EUR` },
        { status: 400 }
      );
    }

    // Check user exists and has investor role
    const users = await sql`SELECT id, roles FROM users WHERE id = ${userId}`;
    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const user = users[0];
    const roles = user.roles as string[];
    if (!roles.includes("investor") && !roles.includes("investireader")) {
      return NextResponse.json(
        { error: "User must have investor or investireader role" },
        { status: 403 }
      );
    }

    // Check content exists and is published
    const contents = await sql`SELECT id, title, status FROM contents WHERE id = ${contentId}`;
    if (contents.length === 0) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }
    const content = contents[0];
    if (content.status !== "published" && content.status !== "funded") {
      return NextResponse.json(
        { error: "Content is not open for investment" },
        { status: 400 }
      );
    }

    const amountCents = amountEur * 100;
    const votesGranted = getVotesForInvestment(amountEur);
    const visupointsGranted = getVisupointsForInvestment(amountEur);

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "eur",
      metadata: {
        type: "investment",
        user_id: userId,
        content_id: contentId,
        content_title: content.title as string,
        amount_eur: amountEur.toString(),
        votes_granted: votesGranted.toString(),
        visupoints_granted: visupointsGranted.toString(),
      },
    });

    // Record the investment in DB
    await sql`
      INSERT INTO investments (user_id, content_id, amount_cents, votes_granted, visupoints_granted, stripe_payment_intent_id, status)
      VALUES (${userId}, ${contentId}, ${amountCents}, ${votesGranted}, ${visupointsGranted}, ${paymentIntent.id}, 'pending')
    `;

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amountCents,
      votesGranted,
      visupointsGranted,
    });
  } catch (error: unknown) {
    console.error("Investment error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
