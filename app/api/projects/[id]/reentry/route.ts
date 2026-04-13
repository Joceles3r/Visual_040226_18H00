/**
 * API Route: Project Reintegration (Reentry)
 * 
 * GET  - Verifier eligibilite a la reintegration
 * POST - Demander la reintegration (cree checkout Stripe 25 EUR)
 */

import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth-session";
import { sql, isDatabaseConfigured } from "@/lib/db";
import { getStripeClient, isStripeConfiguredAsync } from "@/lib/stripe";
import { REINTEGRATION_CONFIG, canRequestReintegration } from "@/lib/ranking/reintegration";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://vixual.app";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json({ 
        eligible: false, 
        reason: "Base de donnees non configuree" 
      });
    }

    // Recuperer le projet et verifier la propriete
    const projects = await sql`
      SELECT 
        c.id, c.creator_id, c.type, c.session_id,
        c.reentry_eligible, c.reentry_window_starts_at, c.reentry_window_expires_at,
        c.reentry_paid, c.is_top10_winner,
        s.id as current_session_id, s.closed_at as session_closed_at
      FROM contents c
      LEFT JOIN category_sessions s ON c.session_id = s.id
      WHERE c.id = ${projectId}::uuid
    `;

    if (projects.length === 0) {
      return NextResponse.json({ error: "Projet non trouve" }, { status: 404 });
    }

    const project = projects[0];

    if (project.creator_id !== user.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 403 });
    }

    // Verifier si TOP 10 gagnant
    if (project.is_top10_winner) {
      return NextResponse.json({
        eligible: false,
        reason: "Votre projet fait partie des gagnants. La reintegration n'est pas applicable.",
        isWinner: true,
      });
    }

    // Verifier si deja paye
    if (project.reentry_paid) {
      return NextResponse.json({
        eligible: false,
        reason: "Vous avez deja utilise la reintegration pour ce cycle",
        alreadyPaid: true,
      });
    }

    // Verifier la fenetre de temps
    const windowExpiresAt = project.reentry_window_expires_at 
      ? new Date(project.reentry_window_expires_at) 
      : null;

    if (!project.reentry_eligible || !windowExpiresAt) {
      return NextResponse.json({
        eligible: false,
        reason: "Ce projet n'est pas eligible a la reintegration prioritaire",
      });
    }

    const now = new Date();
    if (now > windowExpiresAt) {
      return NextResponse.json({
        eligible: false,
        reason: "Le delai d'une heure pour representer votre projet est expire. Vous pouvez deposer un nouveau projet selon les regles normales.",
        expired: true,
      });
    }

    // Calculer le temps restant
    const timeRemainingMs = windowExpiresAt.getTime() - now.getTime();
    const minutesRemaining = Math.floor(timeRemainingMs / (1000 * 60));

    return NextResponse.json({
      eligible: true,
      windowExpiresAt: windowExpiresAt.toISOString(),
      minutesRemaining,
      price: REINTEGRATION_CONFIG.priceDisplay,
      priceCents: REINTEGRATION_CONFIG.priceEurCents,
      message: `Votre projet peut etre represente en priorite. Temps restant : ${minutesRemaining} minutes`,
    });

  } catch (error) {
    console.error("[v0] Error checking reentry eligibility:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Base de donnees non configuree" }, { status: 503 });
    }

    const isStripeReady = await isStripeConfiguredAsync();
    if (!isStripeReady) {
      return NextResponse.json({ error: "Stripe non configure" }, { status: 503 });
    }

    // Verifier eligibilite
    const projects = await sql`
      SELECT 
        c.id, c.title, c.creator_id, c.type, c.session_id,
        c.reentry_eligible, c.reentry_window_expires_at, c.reentry_paid
      FROM contents c
      WHERE c.id = ${projectId}::uuid
    `;

    if (projects.length === 0) {
      return NextResponse.json({ error: "Projet non trouve" }, { status: 404 });
    }

    const project = projects[0];

    if (project.creator_id !== user.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 403 });
    }

    if (project.reentry_paid) {
      return NextResponse.json({ error: "Reintegration deja payee" }, { status: 400 });
    }

    if (!project.reentry_eligible) {
      return NextResponse.json({ error: "Projet non eligible" }, { status: 400 });
    }

    const windowExpiresAt = project.reentry_window_expires_at 
      ? new Date(project.reentry_window_expires_at) 
      : null;

    if (!windowExpiresAt || new Date() > windowExpiresAt) {
      return NextResponse.json({ error: "Fenetre de reintegration expiree" }, { status: 400 });
    }

    // Creer la session Stripe Checkout
    const stripe = await getStripeClient();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe non disponible" }, { status: 503 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: {
            name: REINTEGRATION_CONFIG.displayName,
            description: `Reintegration prioritaire du projet "${project.title}"`,
          },
          unit_amount: REINTEGRATION_CONFIG.priceEurCents,
        },
        quantity: 1,
      }],
      success_url: `${BASE_URL}/dashboard/projects/${projectId}?reentry=success`,
      cancel_url: `${BASE_URL}/dashboard/projects/${projectId}?reentry=cancelled`,
      metadata: {
        product_type: "reintegration_top100",
        project_id: projectId,
        user_id: user.id,
        session_id: project.session_id || "",
      },
    });

    // Enregistrer la demande de paiement
    await sql`
      INSERT INTO project_reentry_payments 
        (project_id, owner_user_id, session_id, stripe_checkout_session_id, expires_at)
      VALUES 
        (${projectId}::uuid, ${user.id}::uuid, ${project.session_id}::uuid, ${checkoutSession.id}, ${windowExpiresAt.toISOString()}::timestamp)
      ON CONFLICT (project_id, session_id) DO UPDATE SET
        stripe_checkout_session_id = ${checkoutSession.id},
        payment_status = 'pending',
        created_at = NOW()
    `;

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id,
    });

  } catch (error) {
    console.error("[v0] Error creating reentry checkout:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
