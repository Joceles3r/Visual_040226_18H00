import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VISUAL - Investissement Audiovisuel & Littéraire",
  description:
    "Plateforme d'investissement participatif dans les projets audiovisuels et littéraires. Soutenez les créateurs, investissez dans l'art.",
  generator: "v0.app",
  keywords: [
    "investissement",
    "audiovisuel",
    "littéraire",
    "créateurs",
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
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
