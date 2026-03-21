import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json()

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Mot de passe actuel et nouveau mot de passe requis" },
        { status: 400 }
      )
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Le nouveau mot de passe doit contenir au moins 8 caracteres" },
        { status: 400 }
      )
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir une majuscule, une minuscule et un chiffre" },
        { status: 400 }
      )
    }

    // Get user from session cookie
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("vixual_session")
    
    if (!sessionCookie) {
      return NextResponse.json(
        { error: "Session invalide. Veuillez vous reconnecter." },
        { status: 401 }
      )
    }

    // Parse session
    let session
    try {
      session = JSON.parse(sessionCookie.value)
    } catch {
      return NextResponse.json(
        { error: "Session corrompue. Veuillez vous reconnecter." },
        { status: 401 }
      )
    }

    // Fetch user from database
    const users = await sql`
      SELECT id, email, password_hash
      FROM users
      WHERE id = ${session.userId}
    `

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Utilisateur non trouve" },
        { status: 404 }
      )
    }

    const user = users[0]

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Mot de passe actuel incorrect" },
        { status: 401 }
      )
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12)

    // Update password in database
    await sql`
      UPDATE users
      SET password_hash = ${newPasswordHash}, updated_at = NOW()
      WHERE id = ${user.id}
    `

    return NextResponse.json({
      success: true,
      message: "Mot de passe modifie avec succes",
    })

  } catch (error) {
    console.error("[VIXUAL] Change password error:", error)
    return NextResponse.json(
      { error: "Erreur serveur. Veuillez reessayer." },
      { status: 500 }
    )
  }
}
