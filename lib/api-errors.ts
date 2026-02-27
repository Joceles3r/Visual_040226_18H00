/**
 * VISUAL - Centralized API Error Handler
 *
 * Standardized error codes and response format for all API routes.
 * Replaces ad-hoc error handling with consistent, debuggable error responses.
 */

import { NextResponse } from "next/server";

// ── Error Codes ──

export const ErrorCodes = {
  // Auth / Access
  ERR_UNAUTHORIZED: "ERR_UNAUTHORIZED",
  ERR_FORBIDDEN: "ERR_FORBIDDEN",
  ERR_USER_NOT_FOUND: "ERR_USER_NOT_FOUND",

  // Input validation
  ERR_INVALID_INPUT: "ERR_INVALID_INPUT",
  ERR_MISSING_FIELD: "ERR_MISSING_FIELD",
  ERR_INVALID_AMOUNT: "ERR_INVALID_AMOUNT",

  // Payment / Stripe
  ERR_PAYMENT_FAILED: "ERR_PAYMENT_FAILED",
  ERR_PAYMENT_DUPLICATE: "ERR_PAYMENT_DUPLICATE",
  ERR_STRIPE_WEBHOOK_INVALID: "ERR_STRIPE_WEBHOOK_INVALID",
  ERR_STRIPE_CONNECT_REQUIRED: "ERR_STRIPE_CONNECT_REQUIRED",

  // Business rules
  ERR_SELF_INVESTMENT: "ERR_SELF_INVESTMENT",
  ERR_KYC_REQUIRED: "ERR_KYC_REQUIRED",
  ERR_MINOR_RESTRICTED: "ERR_MINOR_RESTRICTED",
  ERR_INSUFFICIENT_POINTS: "ERR_INSUFFICIENT_POINTS",
  ERR_CONTENT_NOT_OPEN: "ERR_CONTENT_NOT_OPEN",
  ERR_CONTENT_NOT_FOUND: "ERR_CONTENT_NOT_FOUND",
  ERR_ROLE_REQUIRED: "ERR_ROLE_REQUIRED",

  // Payout
  ERR_PAYOUT_INTEGRITY: "ERR_PAYOUT_INTEGRITY",
  ERR_PAYOUT_NO_INVESTMENTS: "ERR_PAYOUT_NO_INVESTMENTS",
  ERR_PAYOUT_ALREADY_DISTRIBUTED: "ERR_PAYOUT_ALREADY_DISTRIBUTED",

  // Webhook
  ERR_WEBHOOK_DUPLICATE: "ERR_WEBHOOK_DUPLICATE",
  ERR_WEBHOOK_PROCESSING: "ERR_WEBHOOK_PROCESSING",

  // Generic
  ERR_INTERNAL: "ERR_INTERNAL",
  ERR_DATABASE: "ERR_DATABASE",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

// ── Standard error response ──

export interface ApiErrorResponse {
  error: string;
  code: ErrorCode;
  details?: string;
  timestamp: string;
}

/**
 * Creates a standardized JSON error response.
 */
export function apiError(
  code: ErrorCode,
  message: string,
  status: number,
  details?: string
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      error: message,
      code,
      details,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Wraps an async route handler with consistent error catching.
 * Catches unhandled errors and returns a standardized 500 response.
 */
export function withErrorHandler(
  handler: (req: Request) => Promise<NextResponse>
) {
  return async (req: Request): Promise<NextResponse> => {
    try {
      return await handler(req);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal server error";
      console.error(`[VISUAL API ERROR] ${message}`, error);
      return apiError(ErrorCodes.ERR_INTERNAL, message, 500);
    }
  };
}
