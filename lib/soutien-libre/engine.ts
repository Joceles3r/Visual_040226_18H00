/**
 * VIXUAL - Module Soutien Libre (Server Only)
 * 
 * Fonctions serveur pour les paiements et la base de donnees.
 * Ce module est SERVER ONLY.
 */
import "server-only";

import { sql, isDatabaseConfigured } from "@/lib/db";
import { getStripeClient, isStripeConfiguredAsync } from "@/lib/stripe";

// Re-export tout depuis shared pour backward compatibility
export * from "./shared";

// Import des types depuis shared
import { 
  SOUTIEN_LIBRE_CONFIG,
  validateSoutienAmount,
  calculateSoutienLibreDistribution,
  type Creator,
  type FreeSupportPayment,
} from "./shared";

// ── Fonctions Server (DB + Stripe) ──

/**
 * Recupere un createur par son slug
 */
export async function getCreatorBySlug(slug: string): Promise<Creator | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }
  
  try {
    const rows = await sql`
      SELECT id, username as slug, display_name as "displayName", avatar_url as "avatarUrl", 
             bio, stripe_account_id as "stripeAccountId", stripe_account_status as "stripeAccountStatus"
      FROM users 
      WHERE username = ${slug} AND role IN ('porter', 'infoporter', 'podcaster')
      LIMIT 1
    `;
    
    if (rows.length === 0) return null;
    return rows[0] as Creator;
  } catch (error) {
    console.error("[soutien-libre] Error fetching creator:", error);
    return null;
  }
}

/**
 * Recupere les stats de soutien pour un createur
 */
export async function getCreatorSoutienStats(creatorId: string): Promise<{
  totalReceived: number;
  totalSupporters: number;
  averageAmount: number;
  thisMonth: number;
  lastMonth: number;
}> {
  if (!isDatabaseConfigured()) {
    return { totalReceived: 0, totalSupporters: 0, averageAmount: 0, thisMonth: 0, lastMonth: 0 };
  }
  
  try {
    const statsRows = await sql`
      SELECT 
        COALESCE(SUM(net_amount), 0) as total_received,
        COUNT(DISTINCT donor_id) as total_supporters,
        COALESCE(AVG(net_amount), 0) as average_amount,
        COALESCE(SUM(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN net_amount ELSE 0 END), 0) as this_month,
        COALESCE(SUM(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') AND created_at < DATE_TRUNC('month', CURRENT_DATE) THEN net_amount ELSE 0 END), 0) as last_month
      FROM free_support_payments
      WHERE creator_id = ${creatorId}::uuid AND status = 'completed'
    `;
    
    const stats = statsRows[0];
    return {
      totalReceived: Number(stats.total_received || 0),
      totalSupporters: Number(stats.total_supporters || 0),
      averageAmount: Number(stats.average_amount || 0),
      thisMonth: Number(stats.this_month || 0),
      lastMonth: Number(stats.last_month || 0),
    };
  } catch (error) {
    console.error("[soutien-libre] Error fetching stats:", error);
    return { totalReceived: 0, totalSupporters: 0, averageAmount: 0, thisMonth: 0, lastMonth: 0 };
  }
}

/**
 * Cree une session Stripe Checkout pour le soutien libre
 */
export async function createSoutienLibreCheckout(params: {
  creatorId: string;
  creatorStripeAccountId: string;
  amount: number;
  donorId?: string;
  donorEmail: string;
  message?: string;
  isAnonymous?: boolean;
  includeVixualTip?: boolean;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ success: boolean; checkoutUrl?: string; sessionId?: string; error?: string }> {
  const isConfigured = await isStripeConfiguredAsync();
  if (!isConfigured) {
    return { success: false, error: "Stripe non configure" };
  }
  
  const validation = validateSoutienAmount(params.amount);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }
  
  const distribution = calculateSoutienLibreDistribution(params.amount, params.includeVixualTip);
  
  try {
    const stripe = await getStripeClient();
    if (!stripe) {
      return { success: false, error: "Impossible d'initialiser Stripe" };
    }
    
    // Creer la session Checkout
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: params.donorEmail,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: Math.round(distribution.totalPaid * 100),
            product_data: {
              name: `Soutien Libre`,
              description: `Soutien de ${params.amount}EUR`,
            },
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: Math.round((distribution.platformFee + distribution.vixualTip) * 100),
        transfer_data: {
          destination: params.creatorStripeAccountId,
        },
        metadata: {
          vixual_type: "soutien_libre",
          creator_id: params.creatorId,
          donor_id: params.donorId || "anonymous",
          amount: params.amount.toString(),
          platform_fee: distribution.platformFee.toString(),
          vixual_tip: distribution.vixualTip.toString(),
          is_anonymous: params.isAnonymous ? "true" : "false",
        },
      },
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: {
        vixual_type: "soutien_libre",
        creator_id: params.creatorId,
        message: params.message || "",
      },
    });
    
    return {
      success: true,
      checkoutUrl: session.url || undefined,
      sessionId: session.id,
    };
  } catch (error) {
    console.error("[soutien-libre] Stripe checkout error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erreur lors de la creation du paiement" 
    };
  }
}

/**
 * Enregistre un paiement complete en base
 */
export async function recordSoutienLibrePayment(payment: Omit<FreeSupportPayment, "id" | "createdAt">): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!isDatabaseConfigured()) {
    return { success: false, error: "Base de donnees non configuree" };
  }
  
  try {
    const rows = await sql`
      INSERT INTO free_support_payments (
        donor_id, donor_email, creator_id, creator_stripe_account_id,
        amount, platform_fee, stripe_fee, vixual_tip, net_amount,
        message, is_anonymous, stripe_session_id, stripe_payment_intent_id, status
      ) VALUES (
        ${payment.donorId}::uuid, ${payment.donorEmail}, ${payment.creatorId}::uuid, ${payment.creatorStripeAccountId},
        ${payment.amount}, ${payment.platformFee}, ${payment.stripeFee}, ${payment.vixualTip}, ${payment.netAmount},
        ${payment.message || null}, ${payment.isAnonymous}, ${payment.stripeSessionId}, ${payment.stripePaymentIntentId || null}, ${payment.status}
      )
      RETURNING id
    `;
    
    return { success: true, id: rows[0].id };
  } catch (error) {
    console.error("[soutien-libre] Error recording payment:", error);
    return { success: false, error: "Erreur lors de l'enregistrement" };
  }
}
