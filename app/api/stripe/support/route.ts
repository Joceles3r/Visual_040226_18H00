/**
 * VIXUAL Support/Donation API
 * Endpoint pour créer une session de paiement Stripe pour un don
 */

import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { getStripe } from "@/lib/stripe"
import {
  validateDonation,
  calculateDonationFees,
  checkDailyLimit,
  detectDonationAbuse,
  createSupportPayment,
  DONATION_CONFIG,
} from "@/lib/donation-engine"
import { apiError, ErrorCodes } from "@/lib/api-errors"

const sql = neon(process.env.DATABASE_URL!)

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "vixual-secret-key-change-in-production"
)

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const cookieStore = await cookies()
    const authCookie = cookieStore.get("vixual_auth")

    if (!authCookie) {
      return apiError(ErrorCodes.ERR_AUTH_REQUIRED, "Connexion requise", 401)
    }

    let userId: string
    try {
      const { payload } = await jwtVerify(authCookie.value, JWT_SECRET)
      userId = payload.userId as string
    } catch {
      return apiError(ErrorCodes.ERR_AUTH_INVALID, "Session invalide", 401)
    }

    const { creatorId, projectId, amountCents, message } = await request.json()

    // Validate required fields
    if (!creatorId || !amountCents) {
      return apiError(
        ErrorCodes.ERR_VALIDATION_FAILED,
        "Créateur et montant requis",
        400
      )
    }

    // Validate donation
    const validation = validateDonation(userId, creatorId, amountCents)
    if (!validation.valid) {
      return apiError(ErrorCodes.ERR_VALIDATION_FAILED, validation.error!, 400)
    }

    // Check daily limit
    const dailyLimit = await checkDailyLimit(userId)
    if (!dailyLimit.allowed) {
      return apiError(
        ErrorCodes.ERR_LIMIT_EXCEEDED,
        "Limite journalière de dons atteinte",
        429
      )
    }

    if (amountCents > dailyLimit.remaining) {
      return apiError(
        ErrorCodes.ERR_LIMIT_EXCEEDED,
        `Limite restante: ${dailyLimit.remaining / 100} €`,
        429
      )
    }

    // Check for abuse
    const abuse = await detectDonationAbuse(userId)
    if (abuse.suspicious) {
      return apiError(
        ErrorCodes.ERR_FRAUD_DETECTED,
        "Activité suspecte détectée. Veuillez réessayer plus tard.",
        429
      )
    }

    // Get creator info and Stripe account
    const creators = await sql`
      SELECT id, name, email, stripe_account_id
      FROM users
      WHERE id = ${creatorId}
    `

    if (creators.length === 0) {
      return apiError(ErrorCodes.ERR_NOT_FOUND, "Créateur non trouvé", 404)
    }

    const creator = creators[0]

    if (!creator.stripe_account_id) {
      return apiError(
        ErrorCodes.ERR_STRIPE_CONNECT_REQUIRED,
        "Le créateur n'a pas configuré ses paiements",
        400
      )
    }

    // Calculate fees
    const fees = calculateDonationFees(amountCents)

    // Create pending support payment record
    const payment = await createSupportPayment({
      userId,
      creatorId,
      projectId: projectId || undefined,
      amount: fees.gross,
      fee: fees.fee,
      net: fees.net,
      status: "pending",
    })

    // Get Stripe instance
    const stripe = await getStripe()

    // Get project name if applicable
    let productName = `Soutien à ${creator.name}`
    if (projectId) {
      const projects = await sql`SELECT title FROM projects WHERE id = ${projectId}`
      if (projects.length > 0) {
        productName = `Soutien au projet "${projects[0].title}"`
      }
    }

    // Create Stripe Checkout session with Connect
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: productName,
              description: "Don de soutien - Aucune contrepartie attendue",
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: fees.fee,
        transfer_data: {
          destination: creator.stripe_account_id,
        },
        metadata: {
          type: "support",
          payment_id: payment.id,
          user_id: userId,
          creator_id: creatorId,
          project_id: projectId || "",
          message: message || "",
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://vixual.vercel.app"}/support/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://vixual.vercel.app"}/support/cancel`,
      metadata: {
        type: "support",
        payment_id: payment.id,
      },
    })

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      sessionUrl: session.url,
      paymentId: payment.id,
      fees: {
        gross: fees.gross / 100,
        fee: fees.fee / 100,
        net: fees.net / 100,
      },
    })
  } catch (error) {
    console.error("[VIXUAL Support] Error:", error)
    return apiError(
      ErrorCodes.ERR_INTERNAL,
      "Erreur lors de la création du paiement",
      500,
      error instanceof Error ? error.message : undefined
    )
  }
}
