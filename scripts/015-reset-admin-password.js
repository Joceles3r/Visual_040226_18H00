/**
 * VIXUAL Admin Password Reset Script
 * 
 * This script resets the admin password for jocelyndru@gmail.com
 * and ensures proper bcrypt hashing.
 * 
 * IMPORTANT: After running this script, a secure form will allow
 * the admin to set their own password.
 */

import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL)

// Generate a temporary secure token for password reset
function generateSecureToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

async function resetAdminPassword() {
  const adminEmail = "jocelyndru@gmail.com"
  const resetToken = generateSecureToken()
  const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  
  console.log("=== VIXUAL Admin Password Reset ===")
  console.log(`Admin email: ${adminEmail}`)
  
  try {
    // Check if user exists
    const existingUsers = await sql`
      SELECT id, email, name, is_admin FROM users WHERE LOWER(email) = ${adminEmail.toLowerCase()}
    `
    
    if (existingUsers.length === 0) {
      // Create admin user with temporary password (will be reset)
      const tempPasswordHash = await bcrypt.hash(resetToken, 12)
      
      await sql`
        INSERT INTO users (id, email, name, password_hash, roles, is_admin, created_at, updated_at)
        VALUES (
          gen_random_uuid(),
          ${adminEmail},
          'PATRON VIXUAL',
          ${tempPasswordHash},
          ARRAY['visitor', 'patron']::text[],
          true,
          now(),
          now()
        )
      `
      console.log("Admin user created successfully!")
    } else {
      // Update existing user to be admin
      await sql`
        UPDATE users 
        SET 
          is_admin = true,
          roles = ARRAY['visitor', 'patron']::text[],
          updated_at = now()
        WHERE LOWER(email) = ${adminEmail.toLowerCase()}
      `
      console.log("Admin privileges updated for existing user!")
    }
    
    // Create or update password reset token
    await sql`
      INSERT INTO password_reset_tokens (email, token, expires_at, created_at)
      VALUES (${adminEmail}, ${resetToken}, ${resetTokenExpiry.toISOString()}, now())
      ON CONFLICT (email) 
      DO UPDATE SET 
        token = ${resetToken},
        expires_at = ${resetTokenExpiry.toISOString()},
        created_at = now()
    `
    
    console.log("")
    console.log("=== PASSWORD RESET TOKEN GENERATED ===")
    console.log("")
    console.log("Use this URL to set your new password:")
    console.log(`/reset-password?token=${resetToken}`)
    console.log("")
    console.log("Token expires in 24 hours.")
    console.log("=================================")
    
  } catch (error) {
    console.error("Error:", error.message)
    
    // If password_reset_tokens table doesn't exist, create it
    if (error.message.includes("password_reset_tokens")) {
      console.log("Creating password_reset_tokens table...")
      await sql`
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          token TEXT NOT NULL,
          expires_at TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ DEFAULT now()
        )
      `
      console.log("Table created. Please run the script again.")
    }
  }
}

resetAdminPassword()
