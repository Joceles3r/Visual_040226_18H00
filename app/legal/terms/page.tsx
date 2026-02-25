"use client"

import Link from "next/link"
import { VisualHeader } from "@/components/visual-header"
import { Footer } from "@/components/footer"
import { VisualSlogan } from "@/components/visual-slogan"
import {
  FileText, ArrowLeft, User, CreditCard, Film, BookOpen, Mic,
  Shield, ShieldCheck, AlertTriangle, Scale, Globe, Clock, Eye, Lock,
  Ban, HelpCircle, Trash2, Award, BarChart3, Vote,
  Gavel, Handshake, BadgeCheck, Info, TrendingUp, Wallet,
  Star, Users, CheckCircle, XCircle, RefreshCw, MessageSquare,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

function Section({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500/15 text-teal-400 text-sm font-bold border border-teal-500/20">
          {num}
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h3 className="text-base font-semibold text-white/90 mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
        {title}
      </h3>
      {children}
    </div>
  )
}

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-black">
      <VisualHeader />

      <main className="pt-28 pb-20">
        {/* Hero */}
        <section className="py-12 md:py-16 cinema-section">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-500/15 border border-teal-500/20 mb-6">
              <FileText className="h-8 w-8 text-teal-400" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
              {"Conditions d'Utilisation"}
            </h1>
            <div className="mb-6">
              <VisualSlogan size="sm" opacity="high" withLines />
            </div>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              {"Les présentes Conditions Générales d'Utilisation régissent l'accès et l'utilisation de la plateforme VISUAL, combinant diffusion de contenus audiovisuels, littéraires et podcasts avec un système d'investissement participatif."}
            </p>
            <p className="text-sm text-white/35 mt-4">
              {"Derni\u00e8re mise \u00e0 jour : 23 f\u00e9vrier 2026 \u2014 Version Provisoire Internationale"}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-4xl space-y-10">

          {/* Préambule */}
          <Card className="bg-teal-500/5 border-teal-500/15">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-teal-400 mt-0.5 shrink-0" />
                <div className="space-y-2">
                  <p className="text-white/70 leading-relaxed">
                    {"VISUAL est une plateforme num\u00e9rique internationale de diffusion et de participation \u00e9conomique \u00e0 des contenus audiovisuels et litt\u00e9raires, permettant :"}
                  </p>
                  <ul className="space-y-1.5 ml-2">
                    <li className="flex gap-2 items-start text-sm">
                      <Film className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                      <span className="text-white/60">{"La diffusion et le visionnage de contenus audiovisuels (courts et longs métrages, documentaires, clips, animations)"}</span>
                    </li>
                    <li className="flex gap-2 items-start text-sm">
                      <BookOpen className="h-4 w-4 text-sky-400 mt-0.5 shrink-0" />
                      <span className="text-white/60">{"La publication et la lecture de contenus littéraires (romans, nouvelles, essais, poésies, articles)"}</span>
                    </li>
                    <li className="flex gap-2 items-start text-sm">
                      <Mic className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                      <span className="text-white/60">{"L'hébergement et l'écoute de podcasts (émissions, documentaires sonores, interviews)"}</span>
                    </li>
                    <li className="flex gap-2 items-start text-sm">
                      <TrendingUp className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-white/60">{"L'investissement participatif dans ces contenus, avec un système de répartition des gains"}</span>
                    </li>
                  </ul>
                  <p className="text-white/50 text-sm mt-3">
                    {"Toute inscription sur VISUAL implique l'acceptation pleine et enti\u00e8re des pr\u00e9sentes CGU. Si vous n'acceptez pas ces conditions, vous ne pouvez pas cr\u00e9er de compte."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations provisoires */}
          <Card className="bg-amber-500/5 border-amber-500/15">
            <CardContent className="p-5">
              <h3 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {"Informations l\u00e9gales \u00e0 compl\u00e9ter"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
                {[
                  "Forme juridique : [\u00c0 d\u00e9finir]",
                  "Si\u00e8ge social : [\u00c0 compl\u00e9ter]",
                  "SIRET / N\u00b0 immatriculation : [\u00c0 compl\u00e9ter]",
                  "RCS : [\u00c0 compl\u00e9ter]",
                  "N\u00b0 TVA intracommunautaire : [\u00c0 compl\u00e9ter]",
                  "Capital social : [\u00c0 compl\u00e9ter]",
                  "Directeur de la publication : [\u00c0 compl\u00e9ter]",
                  "T\u00e9l\u00e9phone : [\u00c0 compl\u00e9ter]",
                  "Email g\u00e9n\u00e9ral : contact@visual-platform.com",
                  "Email support : support@visual-platform.com",
                  "Email DPO : dpo@visual-platform.com",
                  "H\u00e9bergeur : Vercel Inc. (USA)",
                ].map((item, i) => (
                  <p key={i} className="text-white/45 py-0.5">{item}</p>
                ))}
              </div>
              <p className="text-amber-400/60 text-xs mt-4">
                {"Ces informations seront compl\u00e9t\u00e9es lors de l'immatriculation officielle de VISUAL. Le droit applicable sera celui du pays d'\u00e9tablissement d\u00e9finitif."}
              </p>
            </CardContent>
          </Card>

          {/* 1. Définitions */}
          <Section num={1} title="Définitions">
            <Card className="bg-slate-900/50 border-white/10">
              <CardContent className="pt-6">
                <p className="text-white/70 leading-relaxed mb-4">
                  {"Les termes suivants, employés dans les présentes CGU, ont la signification ci-dessous :"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { term: "Plateforme", def: "Le site web et l'application VISUAL, accessibles à l'adresse visual-platform.com" },
                    { term: "Utilisateur / Inscrit", def: "Toute personne physique disposant d'un compte actif sur VISUAL" },
                    { term: "Invité", def: "Personne naviguant sans compte, accès limité aux contenus gratuits et extraits" },
                    { term: "Visiteur", def: "Inscrit de base : accès aux contenus gratuits, VISUpoints, favoris, commentaires" },
                    { term: "Porteur", def: "Créateur audiovisuel : dépose des vidéos et visuels sur la plateforme" },
                    { term: "Infoporteur", def: "Créateur littéraire : publie des écrits (articles, romans, essais, etc.)" },
                    { term: "Podcasteur", def: "Créateur podcast : dépose des podcasts, émissions audio, documentaires sonores" },
                    { term: "Investisseur", def: "Inscrit qui investit de 2 à 20 EUR par projet audiovisuel" },
                    { term: "Investi-lecteur", def: "Inscrit qui investit de 2 à 20 EUR par contenu littéraire" },
                    { term: "Auditeur", def: "Inscrit qui investit de 2 à 20 EUR par podcast" },
                    { term: "VISUpoints", def: "Avantage promotionnel interne (100 pts = 1\u20ac). Plafond et convertibilit\u00e9 variables selon le profil. Ne constitue pas une monnaie \u00e9lectronique." },
                    { term: "Caution", def: "Dépôt unique remboursable (10 EUR créateurs, 20 EUR investisseurs) garantissant l'engagement" },
                    { term: "Clôture", def: "Moment où les gains d'un contenu sont calculés et distribués selon les formules VISUAL" },
                    { term: "Contenu", def: "Toute œuvre déposée : vidéo, écrit, podcast, incluant métadonnées et descriptions" },
                  ].map((d) => (
                    <div key={d.term} className="bg-black/30 rounded-xl p-3 border border-white/5">
                      <span className="text-teal-400 font-medium text-sm">{d.term}</span>
                      <p className="text-white/50 text-xs mt-1">{d.def}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Section>

          {/* 2. Inscription et rôles */}
          <Section num={2} title="Inscription, rôles et obligations">
            <Card className="bg-slate-900/50 border-white/10">
              <CardContent className="pt-6 space-y-4">
                <SubSection title="Conditions d'inscription">
                  <div className="space-y-2">
                    {[
                      "Être âgé(e) d'au moins 18 ans ou disposer de l'autorisation d'un représentant légal",
                      "Fournir des informations exactes, complètes et à jour lors de l'inscription",
                      "Disposer d'une adresse e-mail valide et personnelle",
                      "Accepter les présentes CGU ainsi que la Politique de Confidentialité",
                      "Ne détenir qu'un seul compte par personne physique (tout multi-compte est interdit)",
                    ].map((item) => (
                      <div key={item} className="flex gap-2 items-start text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                        <span className="text-white/60">{item}</span>
                      </div>
                    ))}
                  </div>
                </SubSection>

                <SubSection title="Les 7 rôles VISUAL">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {[
                      { icon: Eye, color: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/20", role: "Visiteur", caution: "Aucune", desc: "Accède aux contenus gratuits, accumule des VISUpoints, interagit avec la communauté" },
                      { icon: Film, color: "text-red-400", bg: "bg-red-500/15", border: "border-red-500/20", role: "Porteur", caution: "10 EUR", desc: "Dépose des contenus audiovisuels, reçoit des investissements et des gains" },
                      { icon: BookOpen, color: "text-sky-400", bg: "bg-sky-500/15", border: "border-sky-500/20", role: "Infoporteur", caution: "10 EUR", desc: "Publie des contenus littéraires, reçoit des investissements et des gains" },
                      { icon: Mic, color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/20", role: "Podcasteur", caution: "10 EUR", desc: "Dépose des podcasts et émissions audio, reçoit des investissements et des gains" },
                      { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/20", role: "Investisseur", caution: "20 EUR", desc: "Investit de 2 à 20 EUR par projet audiovisuel, partage les gains à la clôture" },
                      { icon: BookOpen, color: "text-indigo-400", bg: "bg-indigo-500/15", border: "border-indigo-500/20", role: "Investi-lecteur", caution: "20 EUR", desc: "Investit de 2 à 20 EUR par contenu littéraire, partage les gains à la clôture" },
                      { icon: Mic, color: "text-pink-400", bg: "bg-pink-500/15", border: "border-pink-500/20", role: "Auditeur", caution: "20 EUR", desc: "Investit de 2 à 20 EUR par podcast, partage les gains à la clôture" },
                    ].map((r) => {
                      const IconComp = r.icon
                      return (
                        <div key={r.role} className={`bg-black/30 rounded-xl p-4 border ${r.border}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-8 h-8 rounded-lg ${r.bg} flex items-center justify-center`}>
                              <IconComp className={`h-4 w-4 ${r.color}`} />
                            </div>
                            <div>
                              <span className="text-white font-medium text-sm">{r.role}</span>
                              <span className="text-white/30 text-xs ml-2">{"Caution : " + r.caution}</span>
                            </div>
                          </div>
                          <p className="text-white/50 text-xs leading-relaxed">{r.desc}</p>
                        </div>
                      )
                    })}
                  </div>
                </SubSection>

                <SubSection title="Obligations de tout inscrit">
                  <div className="space-y-2">
                    {[
                      "Utiliser la plateforme conformément à sa destination et aux lois en vigueur",
                      "Ne pas usurper l'identité d'un tiers ni créer de faux profils",
                      "Ne pas tenter de contourner les systèmes de sécurité ou de paiement de la plateforme",
                      "Respecter les autres utilisateurs : aucune injure, harcèlement, discrimination ou incitation à la haine",
                      "Ne pas publier de contenu illicite, diffamatoire, pornographique ou portant atteinte aux droits de tiers",
                      "Ne pas utiliser de systèmes automatisés (bots, scraping) pour interagir avec la plateforme",
                      "Maintenir la confidentialité de ses identifiants de connexion",
                    ].map((item) => (
                      <div key={item} className="flex gap-2 items-start text-sm">
                        <Gavel className="h-4 w-4 text-teal-400/60 mt-0.5 shrink-0" />
                        <span className="text-white/60">{item}</span>
                      </div>
                    ))}
                  </div>
                </SubSection>
              </CardContent>
            </Card>
          </Section>

          {/* 2bis. Utilisateurs mineurs */}
          <Card className="bg-amber-500/5 border-amber-500/15">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-400">{"Article 2bis \u2014 Utilisateurs mineurs (16\u201317 ans)"}</h3>
                  <p className="text-white/50 text-sm mt-1">{"Dispositions sp\u00e9cifiques conform\u00e9ment au RGPD (art. 8) et aux l\u00e9gislations nationales applicables"}</p>
                </div>
              </div>

              <SubSection title={"Conditions d'inscription des mineurs"}>
                <div className="space-y-2">
                  {[
                    "\u00catre \u00e2g\u00e9(e) de 16 \u00e0 17 ans inclus au moment de l'inscription",
                    "Fournir une autorisation expresse du repr\u00e9sentant l\u00e9gal (parent ou tuteur)",
                    "Le repr\u00e9sentant l\u00e9gal doit valider les CGU et la Politique de Confidentialit\u00e9",
                    "Fournir les informations n\u00e9cessaires \u00e0 la v\u00e9rification d'identit\u00e9 (justificatif optionnel)",
                  ].map((item) => (
                    <div key={item} className="flex gap-2 items-start text-sm">
                      <CheckCircle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                      <span className="text-white/60">{item}</span>
                    </div>
                  ))}
                </div>
              </SubSection>

              <SubSection title={"Droits du compte mineur"}>
                <div className="space-y-2">
                  {[
                    "Acc\u00e8s aux contenus gratuits disponibles sur la plateforme",
                    "Accumulation de VISUpoints dans la limite de 10 000 points (\u00e9quivalent 100\u20ac)",
                    "Participation aux missions et aux interactions communautaires (commentaires, partages)",
                  ].map((item) => (
                    <div key={item} className="flex gap-2 items-start text-sm">
                      <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-white/60">{item}</span>
                    </div>
                  ))}
                </div>
              </SubSection>

              <SubSection title={"Restrictions du compte mineur"}>
                <div className="space-y-2">
                  {[
                    "Aucun investissement autoris\u00e9 avant l'\u00e2ge de 18 ans",
                    "Aucun retrait ni conversion de VISUpoints en euros avant la majorit\u00e9",
                    "Les VISUpoints accumul\u00e9s constituent un avantage promotionnel interne et ne repr\u00e9sentent pas une cr\u00e9ance financi\u00e8re exigible",
                    "Les VISUpoints ne peuvent faire l'objet d'aucun transfert, cession ou vente",
                  ].map((item) => (
                    <div key={item} className="flex gap-2 items-start text-sm">
                      <Lock className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                      <span className="text-white/60">{item}</span>
                    </div>
                  ))}
                </div>
              </SubSection>

              <SubSection title={"\u00c0 la majorit\u00e9 (18 ans)"}>
                <div className="space-y-2">
                  {[
                    "Apr\u00e8s v\u00e9rification d'identit\u00e9 (KYC via Stripe Connect), l'utilisateur peut convertir ses VISUpoints en cr\u00e9dit interne",
                    "Le cr\u00e9dit peut \u00eatre utilis\u00e9 pour investir sur la plateforme ou faire l'objet d'un retrait bancaire",
                    "Le plafond de VISUpoints est automatiquement lev\u00e9 au passage \u00e0 la majorit\u00e9",
                  ].map((item) => (
                    <div key={item} className="flex gap-2 items-start text-sm">
                      <CheckCircle className="h-4 w-4 text-teal-400 mt-0.5 shrink-0" />
                      <span className="text-white/60">{item}</span>
                    </div>
                  ))}
                </div>
              </SubSection>

              <div className="bg-red-500/5 border border-red-500/15 rounded-lg p-3 mt-2">
                <p className="text-red-400/80 text-xs leading-relaxed">
                  {"VISUAL se r\u00e9serve le droit de suspendre ou supprimer tout compte mineur en cas de fausse d\u00e9claration d'\u00e2ge, d'absence de consentement parental valide, ou de non-respect des pr\u00e9sentes conditions."}
                </p>
              </div>

              <div className="bg-slate-800/30 border border-white/5 rounded-lg p-3 mt-1">
                <p className="text-white/40 text-xs leading-relaxed">
                  {"Droit applicable : l'\u00e2ge minimum d'inscription (16 ans) respecte le RGPD (art. 8) qui autorise les \u00c9tats membres \u00e0 fixer un seuil entre 13 et 16 ans. VISUAL applique le seuil le plus protecteur (16 ans) pour couvrir l'ensemble des juridictions europ\u00e9ennes et internationales. En cas de conflit avec la l\u00e9gislation locale du pays de l'utilisateur, la disposition la plus protectrice s'applique."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 3. Système de caution */}
          <Section num={3} title="Caution : versement, utilisation et remboursement">
            <Card className="bg-slate-900/50 border-white/10">
              <CardContent className="pt-6 space-y-4">
                <p className="text-white/70 leading-relaxed">
                  {"La caution est un dépôt unique requis pour accéder à certains rôles. Elle garantit l'engagement de l'inscrit et assure la viabilité de l'écosystème VISUAL."}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/30 rounded-xl p-5 border border-white/5">
                    <div className="flex items-center gap-2 mb-3">
                      <Wallet className="h-5 w-5 text-amber-400" />
                      <span className="text-white font-medium">Caution Créateur</span>
                      <span className="text-amber-400 font-bold ml-auto">10 EUR</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-white/50">
                      <li>{"Applicable aux rôles : Porteur, Infoporteur, Podcasteur"}</li>
                      <li>{"Versée une seule fois lors de l'activation du rôle créateur"}</li>
                      <li>{"Traitée via Stripe, sécurisée et traçable"}</li>
                    </ul>
                  </div>
                  <div className="bg-black/30 rounded-xl p-5 border border-white/5">
                    <div className="flex items-center gap-2 mb-3">
                      <Wallet className="h-5 w-5 text-emerald-400" />
                      <span className="text-white font-medium">Caution Investisseur</span>
                      <span className="text-emerald-400 font-bold ml-auto">20 EUR</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-white/50">
                      <li>{"Applicable aux rôles : Investisseur, Investi-lecteur, Auditeur"}</li>
                      <li>{"Versée une seule fois lors de l'activation du rôle investisseur"}</li>
                      <li>{"Traitée via Stripe, sécurisée et traçable"}</li>
                    </ul>
                  </div>
                </div>

                <SubSection title="Remboursement de la caution">
                  <div className="bg-teal-500/5 border border-teal-500/15 rounded-xl p-4">
                    <p className="text-white/60 text-sm leading-relaxed">
                      {"La caution est intégralement remboursable dans les cas suivants :"}
                    </p>
                    <ul className="mt-3 space-y-2">
                      {[
                        "Résiliation volontaire du compte, sous réserve qu'aucun litige ne soit en cours et que toutes les clôtures en attente soient traitées",
                        "Suppression du rôle concerné (passage d'un rôle payant à Visiteur)",
                        "Décision de VISUAL en cas de force majeure ou de fermeture de la plateforme",
                      ].map((item) => (
                        <li key={item} className="flex gap-2 items-start text-xs">
                          <RefreshCw className="h-3.5 w-3.5 text-teal-400 mt-0.5 shrink-0" />
                          <span className="text-white/55">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-white/40 text-xs mt-3">
                      {"Délai de remboursement : 30 jours ouvrés maximum après validation de la demande. Le remboursement s'effectue sur le moyen de paiement d'origine."}
                    </p>
                  </div>
                </SubSection>
              </CardContent>
            </Card>
          </Section>

          {/* 4. Investissement participatif */}
          <Section num={4} title="Investissement participatif : règles et risques">
            <Card className="bg-slate-900/50 border-white/10">
              <CardContent className="pt-6 space-y-4">
                <SubSection title="Modalités d'investissement">
                  <div className="space-y-2">
                    {[
                      "Montant : de 2 EUR à 20 EUR par projet, par transaction",
                      "Un même inscrit peut investir dans plusieurs projets simultanément",
                      "L'investissement est définitif une fois confirmé et ne peut être annulé",
                      "L'investissement s'accompagne d'un vote (favorable) pris en compte dans les classements et la répartition",
                      "Les gains potentiels dépendent du nombre de vues, votes, écoutes et du système de clôture VISUAL",
                    ].map((item) => (
                      <div key={item} className="flex gap-2 items-start text-sm">
                        <TrendingUp className="h-4 w-4 text-emerald-400/60 mt-0.5 shrink-0" />
                        <span className="text-white/60">{item}</span>
                      </div>
                    ))}
                  </div>
                </SubSection>

                <SubSection title="Répartition des gains et clôture">
                  <div className="bg-black/30 rounded-xl p-5 border border-white/5 space-y-3">
                    <p className="text-white/60 text-sm leading-relaxed">
                      {"Les gains sont calculés à chaque clôture selon les formules VISUAL, détaillées dans le document \"Formules & Répartitions\" téléchargeable depuis la plateforme. Les taux de répartition varient selon :"}
                    </p>
                    <ul className="space-y-1.5 text-xs text-white/50 ml-2">
                      <li className="flex gap-2"><span className="text-teal-400">{">"}</span> {"La catégorie du contenu (audiovisuel, littéraire, podcast)"}</li>
                      <li className="flex gap-2"><span className="text-teal-400">{">"}</span> {"Le type de revenus (investissements, ventes, publicités, abonnements)"}</li>
                      <li className="flex gap-2"><span className="text-teal-400">{">"}</span> {"Le nombre de votes favorables et de VISUpoints générés"}</li>
                      <li className="flex gap-2"><span className="text-teal-400">{">"}</span> {"La part attribuée à VISUAL (frais de plateforme), la réserve technique et la réserve événementielle"}</li>
                    </ul>
                    <p className="text-white/40 text-xs">
                      {"Les clôtures sont configurées par l'administration VISUAL et varient selon la catégorie. Les détails exacts sont consultables dans l'onglet \"Comment ça marche\"."}
                    </p>
                  </div>
                </SubSection>

                <SubSection title="Avertissement sur les risques">
                  <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                      <div className="space-y-2">
                        <p className="text-amber-400/90 text-sm font-medium">
                          {"Investir comporte des risques. Les gains ne sont pas garantis."}
                        </p>
                        <ul className="space-y-1.5 text-xs text-white/50">
                          <li>{"L'investissement sur VISUAL n'est pas un produit financier réglementé au sens de la directive MiFID II"}</li>
                          <li>{"Les performances passées d'un contenu ne garantissent pas les performances futures"}</li>
                          <li>{"Le montant investi peut ne générer aucun retour si le contenu ne rencontre pas son public"}</li>
                          <li>{"VISUAL n'est pas un intermédiaire financier agréé. Les investissements relèvent du financement participatif de projet"}</li>
                          <li>{"L'inscrit reconnaît investir en connaissance de cause et ne pas engager de sommes qu'il ne peut se permettre de perdre"}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </SubSection>
              </CardContent>
            </Card>
          </Section>

          {/* 5. VISUpoints et classements */}
          <Section num={5} title="VISUpoints, votes et classements">
            <Card className="bg-slate-900/50 border-white/10">
              <CardContent className="pt-6 space-y-4">
                <SubSection title={"Nature des VISUpoints"}>
                  <p className="text-white/60 text-sm leading-relaxed mb-3">
                    {"Les VISUpoints sont un avantage promotionnel interne \u00e0 VISUAL, attribu\u00e9s automatiquement selon les interactions de l'inscrit. Ils ne constituent ni une monnaie \u00e9lectronique au sens de la directive 2009/110/CE, ni une cr\u00e9ance financi\u00e8re exigible."}
                  </p>
                  <div className="bg-black/30 rounded-xl p-4 border border-white/5 mb-3">
                    <p className="text-white/70 text-sm font-medium mb-2">{"Taux et limites"}</p>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <span className="text-amber-400 font-bold text-lg">100</span>
                        <p className="text-white/40 text-xs">pts = 1 EUR</p>
                      </div>
                      <div>
                        <span className="text-emerald-400 font-bold text-lg">60</span>
                        <p className="text-white/40 text-xs">pts max / jour</p>
                      </div>
                      <div>
                        <span className="text-sky-400 font-bold text-lg">2 500</span>
                        <p className="text-white/40 text-xs">seuil conversion</p>
                      </div>
                    </div>
                  </div>
                </SubSection>

                <SubSection title={"Plafonds par profil"}>
                  <p className="text-white/60 text-sm leading-relaxed mb-3">
                    {"Chaque profil dispose d'un plafond sp\u00e9cifique d'accumulation de VISUpoints :"}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-white/50">
                          <th className="text-left py-2 pr-3 font-medium">Profil</th>
                          <th className="text-center py-2 px-2 font-medium">Plafond</th>
                          <th className="text-center py-2 px-2 font-medium">Type</th>
                          <th className="text-center py-2 px-2 font-medium">{"Convertible ?"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {[
                          { p: "Invit\u00e9", cap: "\u2014", type: "\u2014", conv: false },
                          { p: "Visiteur majeur", cap: "2 500", type: "Total", conv: true },
                          { p: "Visiteur mineur (16\u201317)", cap: "10 000", type: "Total", conv: false },
                          { p: "Auditeur", cap: "2 500", type: "Total", conv: true },
                          { p: "Investi-lecteur", cap: "2 500", type: "Total", conv: true },
                          { p: "Porteur", cap: "1 000", type: "/mois", conv: false },
                          { p: "Infoporteur", cap: "1 000", type: "/mois", conv: false },
                          { p: "Podcasteur", cap: "1 000", type: "/mois", conv: false },
                          { p: "Investisseur", cap: "\u2014", type: "\u2014", conv: false },
                        ].map((row) => (
                          <tr key={row.p}>
                            <td className="py-1.5 pr-3 text-white/70">{row.p}</td>
                            <td className="py-1.5 px-2 text-center text-amber-400 font-mono">{row.cap}</td>
                            <td className="py-1.5 px-2 text-center text-white/40">{row.type}</td>
                            <td className="py-1.5 px-2 text-center">{row.conv ? <CheckCircle className="h-3.5 w-3.5 text-emerald-400 mx-auto" /> : <Lock className="h-3.5 w-3.5 text-white/20 mx-auto" />}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-white/40 text-xs mt-3">
                    {"Les cr\u00e9ateurs (Porteur, Infoporteur, Podcasteur) utilisent leurs VISUpoints comme boost de visibilit\u00e9, non comme cr\u00e9dit convertible. L'Investisseur ne gagne pas de VISUpoints (il est r\u00e9mun\u00e9r\u00e9 via les gains classiques)."}
                  </p>
                </SubSection>

                <SubSection title={"Paiement hybride (achat de contenu)"}>
                  <p className="text-white/60 text-sm leading-relaxed mb-3">
                    {"Les VISUpoints peuvent \u00eatre utilis\u00e9s pour l'achat de contenu sur la plateforme, selon un syst\u00e8me de paiement hybride :"}
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/15 text-center">
                      <span className="text-emerald-400 font-bold text-xl">30%</span>
                      <p className="text-white/50 text-xs mt-1">minimum en euros</p>
                    </div>
                    <div className="bg-amber-500/10 rounded-xl p-3 border border-amber-500/15 text-center">
                      <span className="text-amber-400 font-bold text-xl">70%</span>
                      <p className="text-white/50 text-xs mt-1">maximum en VISUpoints</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs text-white/50">
                    <div className="flex gap-2 items-start"><CheckCircle className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" /><span>{"Le paiement 100% VISUpoints n'est pas autoris\u00e9 afin de garantir un mod\u00e8le \u00e9conomique durable"}</span></div>
                    <div className="flex gap-2 items-start"><CheckCircle className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" /><span>{"Bonus : 5% des points d\u00e9pens\u00e9s sont retourn\u00e9s (plafond mensuel : 200 points)"}</span></div>
                    <div className="flex gap-2 items-start"><CheckCircle className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" /><span>{"Ce m\u00e9canisme assure le maintien du flux de r\u00e9mun\u00e9ration des cr\u00e9ateurs via Stripe"}</span></div>
                  </div>
                </SubSection>

                <SubSection title={"Moteur d'engagement (Visiteurs)"}>
                  <p className="text-white/60 text-sm leading-relaxed mb-3">
                    {"\u00c0 partir de 2 000 VISUpoints, VISUAL propose aux Visiteurs majeurs deux options pour valoriser leurs points :"}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                      <p className="text-emerald-400 font-medium mb-1">{"Chemin A : Consommer du contenu"}</p>
                      <p className="text-white/50">{"Paiement hybride (30% cash / 70% VISUpoints max) + bonus 5%"}</p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                      <p className="text-purple-400 font-medium mb-1">{"Chemin B : \u00c9voluer de profil"}</p>
                      <p className="text-white/50">{"Devenir Investisseur (+500 VISUpoints bonus, plafond d\u00e9bloqu\u00e9)"}</p>
                    </div>
                  </div>
                  <p className="text-white/40 text-xs mt-3">
                    {"Ce m\u00e9canisme est purement incitatif et non contraignant. L'inscrit reste libre de conserver ses VISUpoints."}
                  </p>
                </SubSection>

                <SubSection title="Classements TOP">
                  <p className="text-white/60 text-sm leading-relaxed mb-3">
                    {"VISUAL établit des classements publics par catégorie, accessibles à tous les inscrits :"}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: "TOP Visiteur", color: "text-amber-400", bg: "bg-amber-500/15" },
                      { label: "TOP Porteur", color: "text-red-400", bg: "bg-red-500/15" },
                      { label: "TOP Infoporteur", color: "text-sky-400", bg: "bg-sky-500/15" },
                      { label: "TOP Podcasteur", color: "text-purple-400", bg: "bg-purple-500/15" },
                    ].map((cat) => (
                      <div key={cat.label} className={`${cat.bg} rounded-xl p-3 text-center border border-white/5`}>
                        <Star className={`h-5 w-5 ${cat.color} mx-auto mb-1`} />
                        <span className={`text-xs font-semibold ${cat.color}`}>{cat.label}</span>
                      </div>
                    ))}
                  </div>
                  <ul className="mt-3 space-y-1.5 text-xs text-white/50">
                    <li className="flex gap-2 items-start"><BarChart3 className="h-3.5 w-3.5 text-teal-400 mt-0.5 shrink-0" /> {"Trois niveaux de consultation : TOP 10, TOP 100, TOP 500"}</li>
                    <li className="flex gap-2 items-start"><User className="h-3.5 w-3.5 text-teal-400 mt-0.5 shrink-0" /> {"Chaque inscrit peut consulter son propre positionnement (de 1 à illimité) dans son espace personnel"}</li>
                    <li className="flex gap-2 items-start"><RefreshCw className="h-3.5 w-3.5 text-teal-400 mt-0.5 shrink-0" /> {"Les classements sont mis à jour en temps réel en fonction de l'activité"}</li>
                  </ul>
                </SubSection>
              </CardContent>
            </Card>
          </Section>

          {/* 6. Contenus déposés */}
          <Section num={6} title="Contenus déposés par les créateurs">
            <Card className="bg-slate-900/50 border-white/10">
              <CardContent className="pt-6 space-y-4">
                <SubSection title="Propriété intellectuelle">
                  <div className="space-y-2 text-sm text-white/60">
                    <p className="leading-relaxed">
                      {"Le créateur (Porteur, Infoporteur, Podcasteur) conserve l'intégralité de ses droits de propriété intellectuelle sur les contenus qu'il dépose sur VISUAL. En publiant un contenu, le créateur accorde à VISUAL une licence non exclusive, mondiale et pour la durée de la présence du contenu sur la plateforme, afin de :"}
                    </p>
                    <ul className="space-y-1.5 ml-2">
                      {[
                        "Héberger, stocker et diffuser le contenu sur la plateforme VISUAL",
                        "Reproduire des extraits à des fins promotionnelles (bandes-annonces, aperçus)",
                        "Afficher le contenu dans les classements, recommandations et résultats de recherche",
                        "Permettre aux investisseurs de consulter et voter sur le contenu",
                      ].map((item) => (
                        <li key={item} className="flex gap-2 items-start">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-400/40 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </SubSection>

                <SubSection title="Responsabilité du créateur">
                  <div className="space-y-2">
                    {[
                      "Garantir qu'il est titulaire de tous les droits nécessaires à la publication du contenu",
                      "Garantir que le contenu ne porte pas atteinte aux droits de tiers (droit d'auteur, vie privée, droit à l'image)",
                      "Ne pas déposer de contenu illicite, haineux, discriminatoire, pornographique ou incitant à la violence",
                      "Assumer l'entière responsabilité du contenu déposé vis-à-vis des tiers et de la loi",
                    ].map((item) => (
                      <div key={item} className="flex gap-2 items-start text-sm">
                        <BadgeCheck className="h-4 w-4 text-teal-400/60 mt-0.5 shrink-0" />
                        <span className="text-white/60">{item}</span>
                      </div>
                    ))}
                  </div>
                </SubSection>

                <SubSection title="Modération et retrait">
                  <p className="text-white/60 text-sm leading-relaxed">
                    {"VISUAL se réserve le droit de retirer, sans préavis, tout contenu signalé ou identifié comme contrevenant aux présentes CGU, aux lois en vigueur, ou aux droits de tiers. Le créateur en sera informé par notification sur la plateforme et pourra contester la décision via la messagerie de support."}
                  </p>
                </SubSection>
              </CardContent>
            </Card>
          </Section>

          {/* 7. Paiements et retraits */}
          <Section num={7} title="Paiements, retraits et fiscalité">
            <Card className="bg-slate-900/50 border-white/10">
              <CardContent className="pt-6 space-y-4">
                <SubSection title="Moyens de paiement">
                  <p className="text-white/60 text-sm leading-relaxed">
                    {"Tous les paiements sur VISUAL (cautions, investissements) sont traités par Stripe, prestataire de paiement certifié PCI-DSS niveau 1. VISUAL ne stocke jamais les données bancaires (numéros de carte, IBAN) sur ses propres serveurs."}
                  </p>
                </SubSection>

                <SubSection title="Retraits des gains">
                  <div className="space-y-2">
                    {[
                      "Les gains disponibles sont consultables dans le Portefeuille de l'espace personnel",
                      "Le retrait s'effectue via Stripe Connect sur le compte bancaire déclaré par l'inscrit",
                      "Montant minimum de retrait : 5 EUR",
                      "Les retraits sont traités chaque semaine (délai de virement : 2 à 5 jours ouvrés selon la banque)",
                      "Les frais de transaction sont à la charge de VISUAL (aucun frais pour l'inscrit)",
                    ].map((item) => (
                      <div key={item} className="flex gap-2 items-start text-sm">
                        <CreditCard className="h-4 w-4 text-teal-400/60 mt-0.5 shrink-0" />
                        <span className="text-white/60">{item}</span>
                      </div>
                    ))}
                  </div>
                </SubSection>

                <SubSection title="Obligations fiscales">
                  <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4">
                    <p className="text-white/60 text-sm leading-relaxed">
                      {"Les gains perçus sur VISUAL sont susceptibles d'être soumis à l'impôt sur le revenu et/ou aux prélèvements sociaux, selon la législation fiscale applicable dans le pays de résidence de l'inscrit. VISUAL ne fournit pas de conseil fiscal. Il appartient à chaque inscrit de déclarer ses gains auprès des autorités fiscales compétentes. VISUAL pourra être tenu de transmettre les informations relatives aux gains versés aux autorités fiscales conformément à la directive DAC7."}
                    </p>
                  </div>
                </SubSection>
              </CardContent>
            </Card>
          </Section>

          {/* 8. Comportements interdits */}
          <Section num={8} title="Comportements interdits et sanctions">
            <Card className="bg-slate-900/50 border-white/10">
              <CardContent className="pt-6 space-y-4">
                <SubSection title="Sont strictement interdits">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { icon: Ban, text: "Manipulation des votes, des classements ou des VISUpoints par des moyens frauduleux" },
                      { icon: Users, text: "Création de comptes multiples pour cumuler les cautions ou les gains" },
                      { icon: XCircle, text: "Investissement fictif, blanchiment d'argent ou utilisation de fonds illicites" },
                      { icon: AlertTriangle, text: "Harcèlement, menaces, injures ou propos discriminatoires envers tout utilisateur" },
                      { icon: Lock, text: "Tentative d'accès non autorisé aux systèmes, API ou données de la plateforme" },
                      { icon: Trash2, text: "Dépôt de contenu volé, plagié ou portant atteinte aux droits d'auteur de tiers" },
                    ].map((item) => {
                      const IconComp = item.icon
                      return (
                        <div key={item.text} className="flex gap-3 items-start bg-black/30 rounded-xl p-3 border border-white/5">
                          <IconComp className="h-4 w-4 text-red-400/70 mt-0.5 shrink-0" />
                          <span className="text-white/55 text-xs">{item.text}</span>
                        </div>
                      )
                    })}
                  </div>
                </SubSection>

                <SubSection title="Sanctions applicables">
                  <p className="text-white/60 text-sm leading-relaxed mb-3">
                    {"En cas de manquement aux présentes CGU, VISUAL se réserve le droit d'appliquer les mesures suivantes, de manière proportionnée et progressive :"}
                  </p>
                  <div className="space-y-2">
                    {[
                      { severity: "Avertissement", desc: "Notification par e-mail et/ou sur la plateforme rappelant les règles enfreintes", color: "text-amber-400" },
                      { severity: "Suspension temporaire", desc: "Blocage du compte pendant une durée de 7 à 90 jours selon la gravité", color: "text-orange-400" },
                      { severity: "Suspension définitive", desc: "Fermeture du compte, retrait de tous les contenus, remboursement de la caution sous conditions", color: "text-red-400" },
                      { severity: "Poursuites judiciaires", desc: "En cas de fraude, blanchiment ou infraction pénale, signalement aux autorités compétentes", color: "text-red-500" },
                    ].map((s) => (
                      <div key={s.severity} className="flex gap-3 items-start text-sm">
                        <span className={`font-semibold text-xs whitespace-nowrap ${s.color}`}>{s.severity}</span>
                        <span className="text-white/50 text-xs">{s.desc}</span>
                      </div>
                    ))}
                  </div>
                </SubSection>
              </CardContent>
            </Card>
          </Section>

          {/* 9. Responsabilité */}
          <Section num={9} title="Responsabilité de VISUAL">
            <Card className="bg-slate-900/50 border-white/10">
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3 text-sm text-white/60 leading-relaxed">
                  <p>
                    {"VISUAL met en œuvre tous les moyens raisonnables pour assurer la disponibilité, la sécurité et le bon fonctionnement de la plateforme. Toutefois, VISUAL ne peut garantir :"}
                  </p>
                  <ul className="space-y-2 ml-2">
                    {[
                      "L'absence totale d'interruptions, d'erreurs ou de dysfonctionnements techniques",
                      "La rentabilité de tout investissement réalisé sur la plateforme",
                      "La qualité, l'exactitude ou la légalité des contenus déposés par les créateurs",
                      "La disponibilité permanente des services tiers (Stripe, hébergement, CDN)",
                    ].map((item) => (
                      <li key={item} className="flex gap-2 items-start">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p>
                    {"VISUAL agit en tant qu'hébergeur des contenus au sens du DSA (Règlement européen sur les services numériques) et de la LCEN. À ce titre, VISUAL n'exerce pas de contrôle éditorial préalable sur les contenus déposés mais s'engage à retirer tout contenu manifestement illicite signalé dans les meilleurs délais."}
                  </p>
                  <p>
                    {"La responsabilité de VISUAL ne saurait être engagée en cas de force majeure, d'interruption des réseaux de télécommunication, de défaillance des prestataires de paiement ou de toute circonstance indépendante de sa volonté."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Section>

          {/* 10. Résiliation */}
          <Section num={10} title="Résiliation et clôture de compte">
            <Card className="bg-slate-900/50 border-white/10">
              <CardContent className="pt-6 space-y-4">
                <SubSection title="Résiliation par l'inscrit">
                  <div className="space-y-2">
                    {[
                      "L'inscrit peut demander la suppression de son compte à tout moment depuis les Paramètres de son espace personnel",
                      "Avant la suppression effective, les clôtures en cours doivent être finalisées et les gains disponibles retirés",
                      "La caution est remboursée dans un délai de 30 jours ouvrés après validation",
                      "Les contenus déposés sont retirés de la plateforme sauf accord contraire avec VISUAL",
                      "Les données personnelles sont supprimées conformément à la Politique de Confidentialité (sauf obligations légales de conservation)",
                    ].map((item) => (
                      <div key={item} className="flex gap-2 items-start text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-400/60 mt-0.5 shrink-0" />
                        <span className="text-white/60">{item}</span>
                      </div>
                    ))}
                  </div>
                </SubSection>

                <SubSection title="Résiliation par VISUAL">
                  <p className="text-white/60 text-sm leading-relaxed">
                    {"VISUAL peut suspendre ou résilier un compte en cas de violation des présentes CGU, de fraude avérée, ou sur injonction d'une autorité compétente. L'inscrit sera informé par e-mail des motifs de la résiliation et disposera d'un délai de 15 jours pour contester la décision. En cas de résiliation pour faute grave, la caution pourra être retenue à titre de dédommagement."}
                  </p>
                </SubSection>
              </CardContent>
            </Card>
          </Section>

          {/* 11. Données personnelles */}
          <Section num={11} title="Protection des données personnelles">
            <Card className="bg-slate-900/50 border-white/10">
              <CardContent className="pt-6 space-y-3 text-sm text-white/60 leading-relaxed">
                <p>
                  {"Le traitement des données personnelles est régi par notre "}
                  <Link href="/legal/privacy" className="text-teal-400 hover:text-teal-300 underline underline-offset-2">Politique de Confidentialité</Link>
                  {" et notre "}
                  <Link href="/legal/cookies" className="text-teal-400 hover:text-teal-300 underline underline-offset-2">Politique de Cookies</Link>
                  {", qui font partie intégrante des présentes CGU."}
                </p>
                <p>
                  {"VISUAL est responsable du traitement au sens du RGPD. Le Délégué à la Protection des Données (DPO) est joignable à l'adresse dpo@visual-platform.com. L'inscrit dispose de l'ensemble des droits prévus par les articles 15 à 22 du RGPD (accès, rectification, effacement, portabilité, opposition, limitation)."}
                </p>
              </CardContent>
            </Card>
          </Section>

          {/* 12. Modification des CGU */}
          <Section num={12} title="Modification des présentes CGU">
            <Card className="bg-slate-900/50 border-white/10">
              <CardContent className="pt-6 space-y-3 text-sm text-white/60 leading-relaxed">
                <p>
                  {"VISUAL se réserve le droit de modifier les présentes Conditions d'Utilisation à tout moment. En cas de modification substantielle, les inscrits seront informés par e-mail et/ou par notification sur la plateforme au moins 30 jours avant l'entrée en vigueur."}
                </p>
                <p>
                  {"La poursuite de l'utilisation de la plateforme après l'entrée en vigueur des modifications vaut acceptation des nouvelles CGU. En cas de refus, l'inscrit peut demander la suppression de son compte et le remboursement de sa caution."}
                </p>
              </CardContent>
            </Card>
          </Section>

          {/* 13. Droit applicable */}
          <Section num={13} title="Droit applicable et juridiction comp\u00e9tente">
            <Card className="bg-slate-900/50 border-white/10">
              <CardContent className="pt-6 space-y-3 text-sm text-white/60 leading-relaxed">
                <p>
                  {"Les pr\u00e9sentes CGU seront soumises au droit applicable dans la juridiction d'\u00e9tablissement officielle de VISUAL lors de sa mise en ligne d\u00e9finitive. En attendant, le droit fran\u00e7ais s'applique \u00e0 titre indicatif."}
                </p>
                <p>
                  {"En cas de litige, les parties s'engagent \u00e0 rechercher une solution amiable dans un d\u00e9lai de 30 jours. Conform\u00e9ment au r\u00e8glement europ\u00e9en n\u00b0524/2013, l'inscrit peut recourir \u00e0 la plateforme europ\u00e9enne de r\u00e9solution des litiges en ligne : "}
                  <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 underline underline-offset-2">{"ec.europa.eu/consumers/odr"}</a>
                </p>
                <p>
                  {"\u00c0 d\u00e9faut de r\u00e9solution amiable, le litige sera soumis aux tribunaux comp\u00e9tents du ressort du si\u00e8ge social de VISUAL, sauf disposition l\u00e9gale imp\u00e9rative contraire (notamment au b\u00e9n\u00e9fice du consommateur)."}
                </p>
              </CardContent>
            </Card>
          </Section>

          {/* 14. Contact */}
          <Section num={14} title="Nous contacter">
            <Card className="bg-teal-500/5 border-teal-500/15">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-teal-500/15 flex items-center justify-center shrink-0">
                    <MessageSquare className="h-5 w-5 text-teal-400" />
                  </div>
                  <div className="space-y-2 text-sm text-white/60">
                    <p>{"Pour toute question relative aux présentes CGU :"}</p>
                    <div className="space-y-1">
                      <p>{"Email g\u00e9n\u00e9ral : "}<span className="text-teal-400">contact@visual-platform.com</span></p>
                      <p>{"Email support : "}<span className="text-teal-400">support@visual-platform.com</span></p>
                      <p>{"DPO : "}<span className="text-teal-400">dpo@visual-platform.com</span></p>
                      <p>{"Adresse postale : "}<span className="text-white/40">{"[\u00c0 compl\u00e9ter]"}</span></p>
                      <p>{"T\u00e9l\u00e9phone : "}<span className="text-white/40">{"[\u00c0 compl\u00e9ter]"}</span></p>
                      <p>{"Messagerie : "}<Link href="/support/mailbox" className="text-teal-400 hover:text-teal-300 underline underline-offset-2">Messagerie de support</Link></p>
                    </div>
                    <p className="text-white/40 text-xs mt-3">
                      {"VISUAL s'engage à répondre à toute demande dans un délai de 15 jours ouvrés."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Section>

          {/* Retour */}
          <div className="text-center pt-6">
            <Link href="/">
              <button className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors text-sm font-medium">
                <ArrowLeft className="h-4 w-4" />
                {"Retour à l'accueil"}
              </button>
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
