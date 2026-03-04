import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { StripeModeBanner } from "@/components/stripe-mode-banner"
import { CookieConsentBanner } from "@/components/cookie-consent"
import { MinorClientGuard } from "@/components/minors/minor-client-guard"

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
  themeColor: "#0f172a",
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
      <body className={`${inter.className} antialiased bg-slate-950 text-white`}>
        <StripeModeBanner />
        <AuthProvider>
          <MinorClientGuard />
          {children}
        </AuthProvider>
        <CookieConsentBanner />
        <Analytics />
      </body>
    </html>
  )
}
