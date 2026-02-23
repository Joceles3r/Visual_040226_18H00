/**
 * Server-side admin verification utility.
 * Uses VISUAL_ADMIN_EMAIL (server-only) as the source of truth.
 * Falls back to NEXT_PUBLIC_ADMIN_EMAIL if the server var is not set.
 *
 * IMPORTANT: This file must ONLY run on the server (route handlers, server actions).
 */

function getAdminEmail(): string | undefined {
  return (
    process.env.VISUAL_ADMIN_EMAIL?.toLowerCase() ||
    process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase()
  )
}

/**
 * Verify if a given email matches the admin email.
 * Double-check on the server to prevent client-side spoofing.
 */
export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false
  const adminEmail = getAdminEmail()
  if (!adminEmail) return false
  return email.toLowerCase() === adminEmail
}

/**
 * Guard helper for API route handlers.
 * Returns a 403 Response if the caller is not admin, or null if authorized.
 *
 * Usage:
 *   const denied = adminGuard(requestEmail)
 *   if (denied) return denied
 */
export function adminGuard(callerEmail: string | undefined | null): Response | null {
  if (!isAdminEmail(callerEmail)) {
    return new Response(
      JSON.stringify({ error: "Forbidden - Admin access required" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    )
  }
  return null
}
