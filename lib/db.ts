import "server-only";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/**
 * VIXUAL Database Connection v2.0.0
 * 
 * Uses lazy initialization via Proxy to avoid build-time errors
 * when DATABASE_URL is not set. The actual connection is only
 * created when the sql function is first called at runtime.
 */

let _sql: NeonQueryFunction<false, false> | null = null;

function getDatabaseConnection(): NeonQueryFunction<false, false> {
  // Return cached connection
  if (_sql) return _sql;

  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.warn("[VIXUAL] DATABASE_URL not configured - using mock database");
    // Return a mock function that returns empty results
    const mockSql = (async () => []) as unknown as NeonQueryFunction<false, false>;
    mockSql.transaction = async () => [];
    _sql = mockSql;
    return _sql;
  }

  _sql = neon(dbUrl);
  return _sql;
}

// Export sql as a Proxy to enable lazy initialization
// This avoids module-level neon() call that would fail at build time
export const sql = new Proxy({} as NeonQueryFunction<false, false>, {
  get(_target, prop) {
    const conn = getDatabaseConnection();
    const value = (conn as any)[prop];
    if (typeof value === "function") {
      return value.bind(conn);
    }
    return value;
  },
  apply(_target, _thisArg, args) {
    const conn = getDatabaseConnection();
    return (conn as any)(...args);
  },
}) as NeonQueryFunction<false, false>;

/**
 * Check if database is configured
 */
export function isDatabaseConfigured(): boolean {
  return !!process.env.DATABASE_URL;
}
