import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe, STRIPE_WEBHOOK_SECRET, logStripeEvent } from "@/lib/stripe";
import { sql } from "@/lib/db";
import { stripeConnectService } from "@/lib/integrations/stripe/stripe-connect-service";

/**
 * POST /api/integrations/stripe/webhooks
 * Handle Stripe Connect webhooks with idempotency
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  
  if (!signature || !STRIPE_WEBHOOK_SECRET) {
    console.error("[Stripe Webhook] Missing signature or webhook secret");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  
  // Check for duplicate event (idempotency)
  const existingEvent = await sql`
    SELECT id FROM webhook_events WHERE event_id = ${event.id}
  `;
  
  if (existingEvent.length > 0) {
    logStripeEvent("Duplicate webhook ignored", { eventId: event.id, type: event.type });
    return NextResponse.json({ received: true, duplicate: true });
  }
  
  // Record event before processing (for idempotency)
  await sql`
    INSERT INTO webhook_events (event_id, event_type, payload)
    VALUES (${event.id}, ${event.type}, ${JSON.stringify(event.data)})
  `;
  
  try {
    // Process event based on type
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
        
      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
        
      case "charge.refunded":
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;
        
      case "transfer.failed":
        await handleTransferFailed(event.data.object as Stripe.Transfer);
        break;
        
      case "account.updated":
        await handleAccountUpdated(event.data.object as Stripe.Account);
        break;
        
      case "account.application.deauthorized":
        await handleAccountDeauthorized(event.data.object as Stripe.Account);
        break;
        
      case "payout.paid":
        await handlePayoutPaid(event.data.object as Stripe.Payout);
        break;
        
      case "payout.failed":
        await handlePayoutFailed(event.data.object as Stripe.Payout);
        break;
        
      default:
        logStripeEvent("Unhandled webhook event", { type: event.type });
    }
    
    // Mark event as processed
    await sql`
      UPDATE webhook_events 
      SET processed_at = NOW() 
      WHERE event_id = ${event.id}
    `;
    
    return NextResponse.json({ received: true });
    
  } catch (error) {
    // Record error but don't fail (Stripe will retry)
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    await sql`
      UPDATE webhook_events 
      SET error = ${errorMessage}
      WHERE event_id = ${event.id}
    `;
    
    console.error("[Stripe Webhook] Processing error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// ── Event Handlers ──

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  logStripeEvent("Payment Intent succeeded", { 
    id: paymentIntent.id, 
    amount: paymentIntent.amount 
  });
  
  const metadata = paymentIntent.metadata;
  
  if (metadata.type === "investment" && metadata.visual_user_id) {
    // Update investment status
    await sql`
      UPDATE investments 
      SET status = 'completed', completed_at = NOW()
      WHERE stripe_payment_intent_id = ${paymentIntent.id}
    `;
    
    // Credit VISUpoints to investor
    const visupointsGranted = parseInt(metadata.visupoints_granted || "0", 10);
    if (visupointsGranted > 0) {
      await sql`
        UPDATE users 
        SET visupoints = COALESCE(visupoints, 0) + ${visupointsGranted}
        WHERE id = ${metadata.visual_user_id}
      `;
    }
    
    // Update content funding
    if (metadata.visual_content_id) {
      await sql`
        UPDATE contents 
        SET current_investment = COALESCE(current_investment, 0) + ${paymentIntent.amount}
        WHERE id = ${metadata.visual_content_id}
      `;
    }
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  logStripeEvent("Payment Intent failed", { 
    id: paymentIntent.id, 
    error: paymentIntent.last_payment_error?.message 
  });
  
  await sql`
    UPDATE investments 
    SET status = 'failed', error = ${paymentIntent.last_payment_error?.message || 'Payment failed'}
    WHERE stripe_payment_intent_id = ${paymentIntent.id}
  `;
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  logStripeEvent("Charge refunded", { 
    id: charge.id, 
    amount: charge.amount_refunded 
  });
  
  // Find original transaction and create refund record
  const paymentIntentId = typeof charge.payment_intent === "string" 
    ? charge.payment_intent 
    : charge.payment_intent?.id;
    
  if (paymentIntentId) {
    await sql`
      UPDATE investments 
      SET status = 'refunded', refunded_at = NOW()
      WHERE stripe_payment_intent_id = ${paymentIntentId}
    `;
  }
}

async function handleTransferFailed(transfer: Stripe.Transfer) {
  logStripeEvent("Transfer failed", { 
    id: transfer.id, 
    destination: transfer.destination 
  });
  
  // Update payout status
  await sql`
    UPDATE payouts 
    SET status = 'failed', error = 'Transfer failed'
    WHERE stripe_transfer_id = ${transfer.id}
  `;
  
  // TODO: Notify admin
}

async function handleAccountUpdated(account: Stripe.Account) {
  logStripeEvent("Account updated", { 
    id: account.id, 
    chargesEnabled: account.charges_enabled,
    payoutsEnabled: account.payouts_enabled
  });
  
  // Find user with this account
  const users = await sql`
    SELECT id FROM users WHERE stripe_account_id = ${account.id}
  `;
  
  if (users.length > 0) {
    await stripeConnectService.syncAccountStatus(account.id, users[0].id as string);
  }
}

async function handleAccountDeauthorized(account: Stripe.Account) {
  logStripeEvent("Account deauthorized", { id: account.id });
  
  // Disable the account in our system
  await sql`
    UPDATE users 
    SET stripe_account_status = 'disabled'
    WHERE stripe_account_id = ${account.id}
  `;
}

async function handlePayoutPaid(payout: Stripe.Payout) {
  logStripeEvent("Payout paid", { 
    id: payout.id, 
    amount: payout.amount 
  });
  
  // Update payout status if we have a record
  // Note: This is for account-level payouts, not our transfers
}

async function handlePayoutFailed(payout: Stripe.Payout) {
  logStripeEvent("Payout failed", { 
    id: payout.id, 
    failureMessage: payout.failure_message 
  });
  
  // TODO: Notify admin and affected user
}
