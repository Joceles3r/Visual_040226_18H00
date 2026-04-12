import { NextResponse } from "next/server";
import { validateBunnyEnv, type IntegrationHealthCheck } from "@/lib/integrations/config";
import { getStripeMode, isStripeConfiguredAsync, getStripeClient } from "@/lib/stripe";
import { getStripeConfig } from "@/lib/stripe-config";
import { bunnyCDNService } from "@/lib/integrations/bunny/bunny-cdn-service";

/**
 * GET /api/integrations/health
 * Health check for all integrations
 * 
 * PATCH SUPER-REMEDE: Utilise isStripeConfiguredAsync() et getStripeConfig() 
 * au lieu des variables d'environnement directes.
 */
export async function GET() {
  const bunnyEnv = validateBunnyEnv();
  const stripeMode = getStripeMode();
  
  let stripeConnected = false;
  let stripeWebhooksConfigured = false;
  let stripeConnectEnabled = false;

  try {
    stripeConnected = await isStripeConfiguredAsync();
    if (stripeConnected) {
      // Verifier si le secret de webhook est configure via la DB
      const config = await getStripeConfig();
      stripeWebhooksConfigured = !!config.webhookSecret;
      // Stripe Connect est active si une cle secrete est presente
      stripeConnectEnabled = !!config.secretKey;
    }
  } catch (error) {
    console.error("[Integrations Health] Stripe health check failed:", error);
    stripeConnected = false;
  }

  let bunnyHealth = { storage: false, cdn: false, videoLibrary: false };
  
  if (bunnyEnv.valid) {
    try {
      bunnyHealth = await bunnyCDNService.healthCheck();
    } catch (error) {
      console.error("[Integrations Health] Bunny health check failed:", error);
    }
  }
  
  const health: IntegrationHealthCheck = {
    stripe: {
      connected: stripeConnected,
      mode: stripeMode.isTest ? "test" : "live",
      webhooksConfigured: stripeWebhooksConfigured,
      connectEnabled: stripeConnectEnabled,
    },
    bunny: {
      connected: bunnyEnv.valid,
      storageConfigured: bunnyHealth.storage,
      cdnConfigured: bunnyHealth.cdn,
      videoLibraryConfigured: bunnyHealth.videoLibrary,
    },
    timestamp: new Date().toISOString(),
  };
  
  const allHealthy = health.stripe.connected && health.bunny.connected;
  
  return NextResponse.json(health, {
    status: allHealthy ? 200 : 503,
  });
}
