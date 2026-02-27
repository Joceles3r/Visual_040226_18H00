import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { sql } from "@/lib/db";
import {
  INVESTMENT_TIERS_EUR,
  getVotesForInvestment,
  getVisupointsForInvestment,
} from "@/lib/payout/constants";
import { checkSelfInvestment } from "@/lib/visual-rules-engine";
import { ErrorCodes, apiError } from "@/lib/api-errors";

/**
 * POST /api/stripe/invest
 *
 * Hardened V2:
 * - KYC verification gate: blocks investment if kycVerified is false for adults
 * - Minor restriction: blocks all investment for users under 18
 * - Self-investment check (R3): prevents investing in own content
 * - Standardized error codes via api-errors.ts
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, contentId, amountEur } = body;

    // ── Input validation ──
    if (!userId || !contentId || !amountEur) {
      return apiError(
        ErrorCodes.ERR_MISSING_FIELD,
        "userId, contentId, and amountEur are required",
        400
      );
    }

    if (!INVESTMENT_TIERS_EUR.includes(amountEur)) {
      return apiError(
        ErrorCodes.ERR_INVALID_AMOUNT,
        `Invalid investment amount. Allowed: ${INVESTMENT_TIERS_EUR.join(", ")} EUR`,
        400
      );
    }

    // ── User verification ──
    const users = await sql`
      SELECT id, roles, birth_date, kyc_verified
      FROM users WHERE id = ${userId}
    `;
    if (users.length === 0) {
      return apiError(ErrorCodes.ERR_USER_NOT_FOUND, "User not found", 404);
    }
    const user = users[0];
    const roles = user.roles as string[];

    // ── Minor restriction (R3 - visupoints-engine) ──
    if (user.birth_date) {
      const birthDate = new Date(user.birth_date as string);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        return apiError(
          ErrorCodes.ERR_MINOR_RESTRICTED,
          "L'investissement n'est pas autorise pour les utilisateurs mineurs (moins de 18 ans).",
          403
        );
      }
    }

    // ── KYC verification gate ──
    // Block investment if the user has not completed identity verification
    if (user.kyc_verified === false || user.kyc_verified === null) {
      return apiError(
        ErrorCodes.ERR_KYC_REQUIRED,
        "Verification d'identite (KYC) requise avant tout investissement. Connectez Stripe Identity pour verifier votre identite.",
        403
      );
    }

    // ── Role check ──
    const investorRoles = ["investor", "investireader", "listener"];
    if (!investorRoles.some(r => roles.includes(r))) {
      return apiError(
        ErrorCodes.ERR_ROLE_REQUIRED,
        "User must have investor, investireader, or listener (auditeur) role",
        403
      );
    }

    // ── Content verification ──
    const contents = await sql`
      SELECT id, title, status, creator_id
      FROM contents WHERE id = ${contentId}
    `;
    if (contents.length === 0) {
      return apiError(ErrorCodes.ERR_CONTENT_NOT_FOUND, "Content not found", 404);
    }
    const content = contents[0];

    if (content.status !== "published" && content.status !== "funded") {
      return apiError(
        ErrorCodes.ERR_CONTENT_NOT_OPEN,
        "Content is not open for investment",
        400
      );
    }

    // ── Self-investment check (R3) ──
    const selfCheck = checkSelfInvestment(userId, content.creator_id as string);
    if (!selfCheck.allowed) {
      return apiError(
        ErrorCodes.ERR_SELF_INVESTMENT,
        selfCheck.reason || "Auto-investissement interdit.",
        403
      );
    }

    // ── Create Stripe Payment Intent ──
    const amountCents = amountEur * 100;
    const votesGranted = getVotesForInvestment(amountEur);
    const visupointsGranted = getVisupointsForInvestment(amountEur);

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
    console.error("[VISUAL API] Investment error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return apiError(ErrorCodes.ERR_INTERNAL, message, 500);
  }
}
