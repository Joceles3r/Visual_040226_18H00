import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { StripeModeBanner } from "@/components/stripe-mode-banner"
import { CookieConsentBanner } from "@/components/cookie-consent"
import { MinorClientGuard } from "@/components/minors/minor-client-guard"
import { SoundProvider } from "@/components/sound-provider"
import { ResizeObserverFix } from "@/components/resize-observer-fix"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VIXUAL - Contribution Participative Audiovisuel, Litteraire & Podcast",
  description:
    "Plateforme de contribution participative dans les projets audiovisuels, litteraires et podcasts. Regarde - Participe - Gagne. Soutenez les createurs, participez a l'art.",
  generator: "v0.app",
  keywords: [
    "contribution participative",
    "audiovisuel",
    "litteraire",
    "podcast",
    "createurs",
    "streaming",
    "regarde participe gagne",
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
        <ResizeObserverFix />
        <StripeModeBanner />
        <AuthProvider>
          <SoundProvider>
            <MinorClientGuard />
            {children}
          </SoundProvider>
        </AuthProvider>
        <CookieConsentBanner />
        <Analytics />
      </body>
    </html>
  )
}
