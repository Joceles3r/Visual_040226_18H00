import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { sql } from "@/lib/db";

// POST: Create a Stripe Connect Express account and return onboarding URL
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Check if user exists
    const users = await sql`SELECT id, email, name FROM users WHERE id = ${userId}`;
    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const user = users[0];

    // Check if a Stripe account already exists
    const existing = await sql`SELECT * FROM stripe_accounts WHERE user_id = ${userId}`;

    let stripeAccountId: string;

    if (existing.length > 0 && existing[0].stripe_account_id) {
      stripeAccountId = existing[0].stripe_account_id;
    } else {
      // Create a Stripe Connect Express account
      const account = await stripe.accounts.create({
        type: "express",
        country: "FR",
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: "individual",
        metadata: {
          visual_user_id: userId,
        },
      });
      stripeAccountId = account.id;

      if (existing.length > 0) {
        await sql`
          UPDATE stripe_accounts 
          SET stripe_account_id = ${stripeAccountId}, status = 'pending', updated_at = now()
          WHERE user_id = ${userId}
        `;
      } else {
        await sql`
          INSERT INTO stripe_accounts (user_id, stripe_account_id, status)
          VALUES (${userId}, ${stripeAccountId}, 'pending')
        `;
      }
    }

    // Create an Account Link for onboarding
    const origin = req.headers.get("origin") || "https://localhost:3000";
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${origin}/dashboard/wallet?stripe=refresh`,
      return_url: `${origin}/dashboard/wallet?stripe=success`,
      type: "account_onboarding",
    });

    await sql`
      UPDATE stripe_accounts 
      SET onboarding_url = ${accountLink.url}, updated_at = now()
      WHERE user_id = ${userId}
    `;

    return NextResponse.json({
      url: accountLink.url,
      accountId: stripeAccountId,
    });
  } catch (error: unknown) {
    console.error("Stripe Connect error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET: Check the status of a user's Stripe Connect account
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const rows = await sql`SELECT * FROM stripe_accounts WHERE user_id = ${userId}`;

    if (rows.length === 0) {
      return NextResponse.json({
        status: "not_started",
        chargesEnabled: false,
        payoutsEnabled: false,
      });
    }

    const record = rows[0];

    // If we have a Stripe account, fetch live status
    if (record.stripe_account_id) {
      const account = await stripe.accounts.retrieve(record.stripe_account_id);

      const newStatus = account.charges_enabled && account.payouts_enabled
        ? "verified"
        : account.details_submitted
          ? "pending"
          : "not_started";

      // Update DB with latest status
      await sql`
        UPDATE stripe_accounts
        SET status = ${newStatus},
            charges_enabled = ${account.charges_enabled},
            payouts_enabled = ${account.payouts_enabled},
            updated_at = now()
        WHERE user_id = ${userId}
      `;

      return NextResponse.json({
        status: newStatus,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        stripeAccountId: record.stripe_account_id,
      });
    }

    return NextResponse.json({
      status: record.status,
      chargesEnabled: record.charges_enabled,
      payoutsEnabled: record.payouts_enabled,
    });
  } catch (error: unknown) {
    console.error("Stripe Connect status error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
