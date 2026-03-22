/**
 * VIXUAL Secure Login API
 * 
 * Real authentication with bcrypt password verification
 * and secure HTTP-only cookie session management.
 */

import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import { SignJWT } from "jose"

const sql = neon(process.env.DATABASE_URL!)

// Secret for JWT signing (use a strong secret in production)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.DATABASE_URL?.slice(0, 32) || "vixual-secure-jwt-secret-key-2026"
)

// Session duration: 7 days
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Fetch user from database
    const users = await sql`
      SELECT 
        id, 
        email, 
        name, 
        password_hash, 
        roles,
        created_at
      FROM users 
      WHERE LOWER(email) = ${normalizedEmail}
      LIMIT 1
    `

    console.log("[v0] Login attempt for:", normalizedEmail)
    console.log("[v0] Users found:", users.length)

    if (users.length === 0) {
      // Use generic message to prevent email enumeration
      console.log("[v0] No user found for email:", normalizedEmail)
      return NextResponse.json(
        { error: "Identifiants invalides" },
        { status: 401 }
      )
    }

    const user = users[0]
    console.log("[v0] User found:", user.email, "roles:", user.roles)
    console.log("[v0] Password hash exists:", !!user.password_hash)

    // Verify password with bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    console.log("[v0] Password valid:", isValidPassword)

    if (!isValidPassword) {
      // Log failed attempt for security monitoring
      console.log(`[VIXUAL Auth] Failed login attempt for: ${normalizedEmail}`)
      return NextResponse.json(
        { error: "Identifiants invalides" },
        { status: 401 }
      )
    }

    // Check if user has patron role (admin)
    const userRoles = user.roles || ["visitor"]
    const isPatron = userRoles.includes("patron")

    // Create JWT token
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      name: user.name,
      roles: userRoles,
      isAdmin: isPatron,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET)

    // Create response with user data (excluding password)
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: userRoles,
        isAdmin: isPatron,
      },
    })

    // Set HTTP-only secure cookie
    response.cookies.set("vixual_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION / 1000,
      path: "/",
    })

    console.log(`[VIXUAL Auth] Successful login for: ${normalizedEmail}`)

    return response
  } catch (error) {
    console.error("[VIXUAL Auth] Login error:", error)
    return NextResponse.json(
      { error: "Erreur serveur lors de la connexion" },
      { status: 500 }
    )
  }
}
