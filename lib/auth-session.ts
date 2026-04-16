import "server-only";

/**
 * VIXUAL Auth Session - Server-side user authentication
 * 
 * This module provides server-side authentication utilities.
 * In production, it verifies JWT tokens from the Authorization header.
 * In mock mode, it returns a demo admin user for development.
 */

export interface ServerUser {
  id: string;
  email: string;
  role: string;
  isAdmin: boolean;
}

/**
 * Get user from request headers (set by middleware)
 * Falls back to mock user in demo mode
 */
export async function getServerUser(request?: Request): Promise<ServerUser | null> {
  // Check for mock auth mode
  if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true") {
    // Return demo admin user in mock mode
    return {
      id: "mock-admin-001",
      email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@vixual.fr",
      role: "admin",
      isAdmin: true,
    };
  }

  // In production, extract from JWT in Authorization header
  const authHeader = request?.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  // TODO: Verify JWT and extract user info using jose library
  // For now, return null if not mock mode and no valid token
  try {
    const token = authHeader.substring(7);
    // In a real implementation, verify the token here
    // const payload = await jwtVerify(token, secret)
    // return payload as ServerUser
    
    // Placeholder: return null for unverified tokens
    if (!token) return null;
    return null;
  } catch {
    return null;
  }
}

/**
 * Check if request is from an authenticated admin
 */
export async function isAdminRequest(request?: Request): Promise<boolean> {
  const user = await getServerUser(request);
  return user?.isAdmin === true;
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(request?: Request): Promise<ServerUser> {
  const user = await getServerUser(request);
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

/**
 * Require admin role - throws if not admin
 */
export async function requireAdmin(request?: Request): Promise<ServerUser> {
  const user = await requireAuth(request);
  if (!user.isAdmin) {
    throw new Error("Admin access required");
  }
  return user;
}
