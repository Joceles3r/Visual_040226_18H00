import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { NeonFrame } from "@/components/neon-frame"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VISUAL - Investissement Audiovisuel, Litteraire & Podcast",
  description:
    "Plateforme d'investissement participatif dans les projets audiovisuels, litteraires et podcasts. Soutenez les createurs, investissez dans l'art.",
  generator: "v0.app",
  keywords: [
    "investissement",
    "audiovisuel",
    "litteraire",
    "podcast",
    "createurs",
    "financement participatif",
  ],
}

export const viewport: Viewport = {
  themeColor: "#050108",
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
      <body className={`${inter.className} antialiased bg-black text-white`}>
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
