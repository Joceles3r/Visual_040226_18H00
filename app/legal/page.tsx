/**
 * VIXUAL — app/legal/page.tsx
 *
 * Page d'index des mentions legales.
 * Referencee par :
 *   - app/minor/consent/page.tsx (lien "Conditions d'utilisation")
 *   - components/minors/minor-client-guard.tsx (route autorisee pour mineurs)
 */
"use client"

import Link from "next/link"
import { ArrowLeft, FileText, Shield, Cookie, BookOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const LEGAL_SECTIONS = [
  {
    href: "/legal/terms",
    icon: BookOpen,
    title: "Conditions Generales d'Utilisation",
    description: "Regles d'acces et d'utilisation de la plateforme VIXUAL",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
  },
  {
    href: "/legal/cgv",
    icon: FileText,
    title: "Conditions Generales de Vente",
    description: "Modalites de contribution, cautions, remboursements et gains",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    href: "/legal/privacy",
    icon: Shield,
    title: "Politique de Confidentialite",
    description: "Traitement de vos donnees personnelles et RGPD",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    href: "/legal/cookies",
    icon: Cookie,
    title: "Politique Cookies",
    description: "Utilisation des cookies et traceurs sur VIXUAL",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
]

export default function LegalIndexPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-16 max-w-3xl">

        {/* Retour */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors mb-10 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour a l&apos;accueil
        </Link>

        {/* En-tete */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-3">
            Informations legales
          </h1>
          <p className="text-white/55 text-base">
            Documents contractuels et reglementaires de la plateforme VIXUAL.
            Consultez les sections ci-dessous selon votre besoin.
          </p>
        </div>

        {/* Grille des documents */}
        <div className="space-y-3">
          {LEGAL_SECTIONS.map((section) => {
            const Icon = section.icon
            return (
              <Link key={section.href} href={section.href}>
                <Card className={`${section.bg} ${section.border} border hover:border-white/20 transition-all duration-200 cursor-pointer`}>
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl ${section.bg} border ${section.border} flex items-center justify-center shrink-0`}>
                      <Icon className={`h-5 w-5 ${section.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm mb-0.5">
                        {section.title}
                      </p>
                      <p className="text-white/45 text-xs truncate">
                        {section.description}
                      </p>
                    </div>
                    <ArrowLeft className={`h-4 w-4 ${section.color} rotate-180 shrink-0`} />
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Contact legal */}
        <div className="mt-10 p-5 rounded-xl bg-white/5 border border-white/10">
          <p className="text-white/40 text-xs text-center">
            Pour toute question legale, contactez-nous via{" "}
            <Link href="/contact" className="text-white/60 underline underline-offset-2 hover:text-white/80">
              notre formulaire de contact
            </Link>
            .
          </p>
        </div>

      </div>
    </div>
  )
}
