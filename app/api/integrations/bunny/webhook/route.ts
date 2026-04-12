import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { apiError, ErrorCodes, withErrorHandler } from "@/lib/api-errors"
import { createHmac, timingSafeEqual } from "crypto"

// Le secret de signature est la cle API en lecture seule de la bibliotheque video
// PATCH SUPER-REMEDE: Utiliser BUNNY_READ_ONLY_API_KEY pour la signature des webhooks Stream
const BUNNY_READ_ONLY_API_KEY = process.env.BUNNY_READ_ONLY_API_KEY || process.env.BUNNY_WEBHOOK_SECRET;

/**
 * Verify Bunny Stream webhook signature (HMAC-SHA256)
 * Conforme a la documentation officielle de Bunny.net Stream.
 * 
 * PATCH SUPER-REMEDE: Support des headers officiels x-bunnystream-signature-*
 */
function verifyBunnyStreamWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  signatureVersionHeader: string | null,
  signatureAlgorithmHeader: string | null,
  secret: string
): boolean {
  // Support des anciens headers (x-bunny-signature) ET des nouveaux (x-bunnystream-signature)
  if (!signatureHeader) {
    return false;
  }

  // Verifier la version si fournie (headers officiels)
  if (signatureVersionHeader && signatureVersionHeader !== 'v1') {
    console.warn(`[Bunny Webhook] Signature version mismatch: Expected 'v1', got '${signatureVersionHeader}'`);
    return false;
  }

  // Verifier l'algorithme si fourni
  if (signatureAlgorithmHeader && signatureAlgorithmHeader !== 'hmac-sha256') {
    console.warn(`[Bunny Webhook] Signature algorithm mismatch: Expected 'hmac-sha256', got '${signatureAlgorithmHeader}'`);
    return false;
  }

  try {
    const expectedSignature = createHmac("sha256", secret)
      .update(rawBody, 'utf8')
      .digest("hex");
    
    // Comparaison en temps constant pour prevenir les attaques par synchronisation
    const signatureBuffer = Buffer.from(signatureHeader, 'utf8');
    const expectedSignatureBuffer = Buffer.from(expectedSignature, 'utf8');

    // Verifier que les longueurs correspondent avant timingSafeEqual
    if (signatureBuffer.length !== expectedSignatureBuffer.length) {
      return false;
    }

    return timingSafeEqual(signatureBuffer, expectedSignatureBuffer);
  } catch (error) {
    console.error("[BUNNY WEBHOOK] Signature verification error:", error);
    return false;
  }
}

/**
 * POST /api/integrations/bunny/webhook
 *
 * Recoit les notifications de Bunny.net concernant le statut de transcodage des videos.
 * 
 * Statuts Bunny:
 * - 0: Created
 * - 1: Uploaded
 * - 2: Processing
 * - 3: Transcoding
 * - 4: Finished (ready to play)
 * - 5: Error
 */
export const POST = withErrorHandler(async (req: Request) => {
  const rawBody = await req.text();
  let body: Record<string, unknown>;
  
  try {
    body = JSON.parse(rawBody);
  } catch {
    console.error("[BUNNY WEBHOOK] Invalid JSON body");
    return apiError(ErrorCodes.ERR_INVALID_BODY, "Invalid JSON body", 400);
  }
  
  // Verifier la signature du webhook si le secret est configure
  if (BUNNY_READ_ONLY_API_KEY) {
    // Support des deux formats de headers (ancien et nouveau)
    const signature = req.headers.get("x-bunnystream-signature") || req.headers.get("x-bunny-signature") || req.headers.get("x-signature");
    const version = req.headers.get("x-bunnystream-signature-version");
    const algorithm = req.headers.get("x-bunnystream-signature-algorithm");

    if (!verifyBunnyStreamWebhookSignature(rawBody, signature, version, algorithm, BUNNY_READ_ONLY_API_KEY)) {
      console.error("[Bunny Webhook] Invalid signature detected - possible spoofing attempt");
      return apiError(ErrorCodes.ERR_UNAUTHORIZED, "Invalid webhook signature", 403);
    }
    console.log("[Bunny Webhook] Signature verified successfully");
  } else if (process.env.NODE_ENV === "production") {
    console.error("[BUNNY WEBHOOK] CRITICAL: BUNNY_READ_ONLY_API_KEY not set in production! Webhooks are insecure.");
    return apiError(ErrorCodes.ERR_INTERNAL, "Bunny webhook secret not configured", 500);
  } else {
    console.warn("[Bunny Webhook] DEV MODE: BUNNY_READ_ONLY_API_KEY not set - skipping signature validation");
  }

  const { VideoGuid, Status, Length, Width, Height, ErrorMessage } = body;
  
  // Validation des champs requis
  if (!VideoGuid) {
    return apiError(ErrorCodes.ERR_MISSING_FIELD, "VideoGuid is required", 400);
  }
  
  if (Status === undefined || Status === null) {
    return apiError(ErrorCodes.ERR_MISSING_FIELD, "Status is required", 400);
  }
  
  // Mapper le statut numerique vers un texte lisible
  const statusMap: Record<number, string> = {
    0: "created",
    1: "uploaded",
    2: "processing",
    3: "transcoding",
    4: "finished",
    5: "error",
  };
  
  const statusText = statusMap[Status as number] || "unknown";
  
  // Mettre a jour le statut de la video dans la base de donnees
  try {
    // Verifier si la video existe
    const existingVideo = await sql`
      SELECT id, content_id, creator_id FROM video_uploads 
      WHERE bunny_video_id = ${VideoGuid as string}
    `;
    
    if (existingVideo.length === 0) {
      console.warn(`[BUNNY WEBHOOK] Video ${VideoGuid} not found in database`);
      return NextResponse.json({
        success: false,
        message: `Video ${VideoGuid} not found in database`,
      }, { status: 404 });
    }
    
    // Mettre a jour le statut
    await sql`
      UPDATE video_uploads
      SET 
        bunny_status = ${statusText},
        bunny_status_code = ${Status as number},
        duration_seconds = ${(Length as number) || null},
        width = ${(Width as number) || null},
        height = ${(Height as number) || null},
        error_message = ${(ErrorMessage as string) || null},
        updated_at = NOW()
      WHERE bunny_video_id = ${VideoGuid as string}
    `;
    
    // Si le transcodage est termine avec succes, mettre a jour le contenu associe
    if (Status === 4) {
      const video = existingVideo[0];
      await sql`
        UPDATE contents
        SET 
          video_status = 'ready',
          video_duration = ${(Length as number) || null},
          updated_at = NOW()
        WHERE id = ${video.content_id}
      `;
      
      console.log(`[BUNNY WEBHOOK] Video ${VideoGuid} transcoding completed successfully`);
    }
    
    // Si erreur de transcodage, logger et marquer le contenu
    if (Status === 5) {
      const video = existingVideo[0];
      await sql`
        UPDATE contents
        SET 
          video_status = 'error',
          video_error = ${(ErrorMessage as string) || 'Transcoding failed'},
          updated_at = NOW()
        WHERE id = ${video.content_id}
      `;
      
      console.error(`[BUNNY WEBHOOK] Video ${VideoGuid} transcoding failed: ${ErrorMessage}`);
    }
    
    return NextResponse.json({
      success: true,
      message: `Video ${VideoGuid} status updated to ${statusText}`,
      data: {
        videoId: VideoGuid,
        status: statusText,
        statusCode: Status,
        duration: Length,
      },
    });
  } catch (error) {
    console.error("[BUNNY WEBHOOK] Database error:", error);
    return apiError(
      ErrorCodes.ERR_DATABASE,
      "Failed to update video status",
      500
    );
  }
});

/**
 * GET /api/integrations/bunny/webhook
 * 
 * Endpoint de verification pour Bunny.com (health check)
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "VIXUAL Bunny Webhook Handler",
    timestamp: new Date().toISOString(),
  });
}
