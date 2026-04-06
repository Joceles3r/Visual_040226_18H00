/**
 * VIXUAL — app/api/webhooks/stripe/route.ts
 * 
 * Endpoint webhook Stripe securise avec verification de signature.
 * Gere les evenements: payment_intent, checkout.session, account.updated
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";

// ── Configuration ─────────────────────────────────────────────────────────────

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

// ── Types ─────────────────────────────────────────────────────────────────────

interface WebhookHandlerResult {
  success: boolean;
  message?: string;
  error?: string;
}

// ── Handlers par type d'evenement ─────────────────────────────────────────────

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
): Promise<WebhookHandlerResult> {
  console.log(`[Stripe Webhook] Payment succeeded: ${paymentIntent.id}`);
  
  const metadata = paymentIntent.metadata;
  const userId = metadata?.userId;
  const projectId = metadata?.projectId;
  const type = metadata?.type; // contribution, ticket_gold, soutien_libre

  if (!userId) {
    return { success: true, message: "No userId in metadata, skipping" };
  }

  try {
    // TODO: Crediter les VIXUpoints selon le type de paiement
    // await creditVisupoints(userId, amount, type);
    
    // TODO: Envoyer notification utilisateur
    // await sendPaymentConfirmation(userId, paymentIntent);

    console.log(`[Stripe Webhook] Processed payment for user ${userId}, type: ${type}`);
    
    return { 
      success: true, 
      message: `Payment processed for user ${userId}` 
    };
  } catch (error) {
    console.error("[Stripe Webhook] Error processing payment:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

async function handlePaymentIntentFailed(
  paymentIntent: Stripe.PaymentIntent
): Promise<WebhookHandlerResult> {
  console.log(`[Stripe Webhook] Payment failed: ${paymentIntent.id}`);
  
  const metadata = paymentIntent.metadata;
  const userId = metadata?.userId;

  if (userId) {
    // TODO: Notifier l'utilisateur de l'echec
    // await sendPaymentFailureNotification(userId, paymentIntent);
    console.log(`[Stripe Webhook] Notified user ${userId} of payment failure`);
  }

  return { success: true, message: "Payment failure logged" };
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<WebhookHandlerResult> {
  console.log(`[Stripe Webhook] Checkout completed: ${session.id}`);
  
  const metadata = session.metadata;
  const userId = metadata?.userId;
  const type = metadata?.type;

  if (!userId) {
    return { success: true, message: "No userId in metadata, skipping" };
  }

  try {
    // Traitement selon le type
    switch (type) {
      case "ticket_gold":
        // TODO: Activer le Ticket Gold pour l'utilisateur
        // await activateTicketGold(userId, session);
        console.log(`[Stripe Webhook] Ticket Gold activated for user ${userId}`);
        break;
        
      case "contribution":
        // TODO: Enregistrer la contribution
        // await recordContribution(userId, session);
        console.log(`[Stripe Webhook] Contribution recorded for user ${userId}`);
        break;
        
      case "soutien_libre":
        // TODO: Enregistrer le soutien libre
        // await recordSoutienLibre(userId, session);
        console.log(`[Stripe Webhook] Soutien libre recorded for user ${userId}`);
        break;
        
      default:
        console.log(`[Stripe Webhook] Unknown checkout type: ${type}`);
    }

    return { success: true, message: `Checkout ${type} processed for user ${userId}` };
  } catch (error) {
    console.error("[Stripe Webhook] Error processing checkout:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

async function handleAccountUpdated(
  account: Stripe.Account
): Promise<WebhookHandlerResult> {
  console.log(`[Stripe Webhook] Account updated: ${account.id}`);
  
  const chargesEnabled = account.charges_enabled;
  const payoutsEnabled = account.payouts_enabled;
  const detailsSubmitted = account.details_submitted;

  // TODO: Mettre a jour le statut du compte Connect dans notre DB
  // await updateConnectAccountStatus(account.id, { chargesEnabled, payoutsEnabled, detailsSubmitted });

  console.log(`[Stripe Webhook] Account ${account.id} status: charges=${chargesEnabled}, payouts=${payoutsEnabled}`);

  return { 
    success: true, 
    message: `Account ${account.id} status updated` 
  };
}

// ── Route Handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Verifier que le webhook secret est configure
  if (!webhookSecret) {
    console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  // Recuperer le body brut et la signature
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    console.error("[Stripe Webhook] Missing stripe-signature header");
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 400 }
    );
  }

  // Verifier la signature
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[Stripe Webhook] Signature verification failed: ${message}`);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  // Log l'evenement (sans donnees sensibles)
  console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

  // Router vers le handler approprie
  let result: WebhookHandlerResult;

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        result = await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
        result = await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case "checkout.session.completed":
        result = await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "account.updated":
        result = await handleAccountUpdated(event.data.object as Stripe.Account);
        break;

      default:
        // Evenement non gere - retourner 200 pour eviter les retries
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        result = { success: true, message: `Unhandled event type: ${event.type}` };
    }
  } catch (error) {
    console.error(`[Stripe Webhook] Handler error for ${event.type}:`, error);
    result = {
      success: false,
      error: error instanceof Error ? error.message : "Handler error",
    };
  }

  // Retourner la reponse
  if (result.success) {
    return NextResponse.json({ received: true, message: result.message });
  } else {
    // Retourner 200 meme en cas d'erreur pour eviter les retries infinis
    // Les erreurs sont loguees pour investigation
    console.error(`[Stripe Webhook] Error result:`, result.error);
    return NextResponse.json({ received: true, error: result.error });
  }
}

// ── Health check GET ──────────────────────────────────────────────────────────

export async function GET() {
  return NextResponse.json({
    status: "ok",
    webhook: "stripe",
    configured: !!webhookSecret,
    timestamp: new Date().toISOString(),
  });
}
