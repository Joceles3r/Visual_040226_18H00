import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { NeonFrame } from "@/components/neon-frame"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VISUAL - Investissement Audiovisuel, Littéraire & Podcast",
  description:
    "Plateforme d'investissement participatif dans les projets audiovisuels, littéraires et podcasts. Soutenez les créateurs, investissez dans l'art.",
  generator: "v0.app",
  keywords: [
    "investissement",
    "audiovisuel",
    "littéraire",
    "podcast",
    "créateurs",
    "financement participatif",
  ],
}

export const viewport: Viewport = {
  themeColor: "#050507",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} antialiased`} style={{ background: "#050507", color: "#e8e4e0" }}>
        <AuthProvider>
          <NeonFrame>
            {children}
          </NeonFrame>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
