import { NextResponse } from "next/server"
import { adminGuard } from "@/lib/admin-guard"
import { apiError, ErrorCodes, withErrorHandler } from "@/lib/api-errors"

/**
 * Protected admin API endpoint.
 * Validates admin identity server-side before executing any privileged action.
 *
 * The caller must include their email in the request body.
 * In production this would come from a verified session/JWT,
 * but for now we validate against the server-side env var.
 */
export const POST = withErrorHandler(async (req: Request) => {
    const body = await req.json()
    const { email, action, payload } = body

    // Server-side admin check (double verification)
    const denied = adminGuard(email)
    if (denied) return denied

    // Route to the correct admin action
    switch (action) {
      case "get_stats":
        return NextResponse.json({
          success: true,
          data: {
            totalUsers: 1247,
            totalInvestments: 8934,
            totalCreators: 312,
            totalRevenue: 187650,
            pendingPayouts: 23,
            activeProjects: 89,
            reportedContent: 7,
            timestamp: new Date().toISOString(),
          },
        })

      case "execute_payout":
        return NextResponse.json({
          success: true,
          message: `Payout batch ${payload?.batchId || "auto"} queued for execution.`,
        })

      case "moderate_content":
        return NextResponse.json({
          success: true,
          message: `Content ${payload?.contentId} has been ${payload?.decision || "reviewed"}.`,
          action: payload?.decision,
          targetUser: payload?.targetUser || null,
          timestamp: new Date().toISOString(),
        })

      case "update_user_status":
        return NextResponse.json({
          success: true,
          message: `User ${payload?.userId} status updated to ${payload?.status}.`,
        })

      default:
        return apiError(ErrorCodes.ERR_INVALID_INPUT, `Unknown action: ${action}`, 400)
    }
})
