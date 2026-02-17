import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
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
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      // ---- Stripe Connect account updated ----
      case "account.updated": {
        const account = event.data.object;
        const stripeAccountId = account.id;

        const newStatus =
          account.charges_enabled && account.payouts_enabled
            ? "verified"
            : account.details_submitted
              ? "pending"
              : "not_started";

        await sql`
          UPDATE stripe_accounts
          SET status = ${newStatus},
              charges_enabled = ${account.charges_enabled ?? false},
              payouts_enabled = ${account.payouts_enabled ?? false},
              updated_at = now()
          WHERE stripe_account_id = ${stripeAccountId}
        `;
        break;
      }

      // ---- Payment succeeded (investment or caution) ----
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const piId = paymentIntent.id;
        const metadata = paymentIntent.metadata || {};

        if (metadata.type === "caution") {
          await sql`
            UPDATE cautions
            SET status = 'paid', paid_at = now()
            WHERE stripe_payment_intent_id = ${piId}
          `;

          // Update user roles based on caution type
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
        } else if (metadata.type === "investment") {
          // Mark investment as completed
          await sql`
            UPDATE investments
            SET status = 'completed'
            WHERE stripe_payment_intent_id = ${piId}
          `;

          // Update content investment totals
          const amountCents = paymentIntent.amount;
          await sql`
            UPDATE contents
            SET current_investment_cents = current_investment_cents + ${amountCents},
                investor_count = investor_count + 1,
                updated_at = now()
            WHERE id = ${metadata.content_id}
          `;

          // Record wallet transaction
          await sql`
            INSERT INTO wallet_transactions (user_id, type, amount_cents, description, reference_id)
            VALUES (${metadata.user_id}, 'investment', ${-amountCents}, ${'Investissement: ' + (metadata.content_title || '')}, ${piId})
          `;
        }
        break;
      }

      // ---- Payment failed ----
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const piId = paymentIntent.id;

        await sql`
          UPDATE investments SET status = 'failed' WHERE stripe_payment_intent_id = ${piId}
        `;
        await sql`
          UPDATE cautions SET status = 'pending' WHERE stripe_payment_intent_id = ${piId}
        `;
        break;
      }

      // ---- Transfer completed (payout to user) ----
      case "transfer.created": {
        const transfer = event.data.object;
        if (transfer.metadata?.withdrawal_id) {
          await sql`
            UPDATE withdrawal_requests
            SET status = 'completed',
                stripe_transfer_id = ${transfer.id},
                processed_at = now()
            WHERE id = ${transfer.metadata.withdrawal_id}
          `;
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
