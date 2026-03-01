import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * POST /api/consent/cookies
 *
 * Logs cookie consent choices for RGPD audit trail.
 * Non-blocking, fire-and-forget from the client.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { preferences, timestamp } = body;

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    await sql`
      INSERT INTO consent_logs (
        consent_type, preferences, ip_hash, user_agent, consented_at
      ) VALUES (
        'cookies',
        ${JSON.stringify(preferences)},
        encode(sha256(${ip}::bytea), 'hex'),
        ${userAgent.substring(0, 255)},
        ${timestamp || new Date().toISOString()}
      )
    `;

    return NextResponse.json({ logged: true });
  } catch (error) {
    // Non-critical: log but don't fail
    console.error("[VISUAL] Failed to log cookie consent:", error);
    return NextResponse.json({ logged: false }, { status: 200 });
  }
}
