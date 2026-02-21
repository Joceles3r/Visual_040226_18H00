import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { sql } from "@/lib/db";
import { STRIPE_CONFIG } from "@/lib/payout/constants";

// POST: Request a withdrawal from wallet to Stripe Connect account
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, amountCents } = body;

    if (!userId || !amountCents) {
      return NextResponse.json(
        { error: "userId and amountCents are required" },
        { status: 400 }
      );
    }

    if (amountCents < STRIPE_CONFIG.minWithdrawCents) {
      return NextResponse.json(
        { error: `Minimum withdrawal is ${STRIPE_CONFIG.minWithdrawCents / 100} EUR` },
        { status: 400 }
      );
    }

    // Check wallet balance
    const wallets = await sql`SELECT * FROM wallets WHERE user_id = ${userId}`;
    if (wallets.length === 0) {
      return NextResponse.json({ error: "No wallet found" }, { status: 404 });
    }
    const wallet = wallets[0];
    if ((wallet.available_cents as number) < amountCents) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Check Stripe Connect account is verified
    const stripeAccounts = await sql`
      SELECT * FROM stripe_accounts WHERE user_id = ${userId}
    `;
    if (stripeAccounts.length === 0 || stripeAccounts[0].status !== "verified") {
      return NextResponse.json(
        { error: "Stripe Connect account must be verified before withdrawal" },
        { status: 403 }
      );
    }

    const stripeAccountId = stripeAccounts[0].stripe_account_id as string;

    // Create withdrawal request
    const withdrawals = await sql`
      INSERT INTO withdrawal_requests (user_id, amount_cents, status)
      VALUES (${userId}, ${amountCents}, 'processing')
      RETURNING id
    `;
    const withdrawalId = withdrawals[0].id as string;

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
  } catch (error: unknown) {
    console.error("Withdrawal error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
