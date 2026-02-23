"use client"

import Link from "next/link"
import { VisualHeader } from "@/components/visual-header"
import { Footer } from "@/components/footer"
import { VisualSlogan } from "@/components/visual-slogan"
import {
  FileText, ArrowLeft, User, CreditCard, Film, BookOpen, Mic,
  Shield, AlertTriangle, Scale, Globe, Clock, Eye, Lock,
  Ban, Vote, Gavel, Wallet, Star, Users, CheckCircle,
  BadgeCheck, Info, TrendingUp, Award, BarChart3, Handshake,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

/* ── Shared sub-components ──────────────────────────── */

function Section({ num, title, icon: Icon, children }: { num: number; title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-500/15 text-amber-400 text-sm font-bold border border-amber-500/20">
          {num}
        </span>
        <Icon className="h-5 w-5 text-amber-400/70" />
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-white/65 leading-relaxed mb-3">{children}</p>
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60 mt-2 shrink-0" />
      <span className="text-white/65 leading-relaxed">{children}</span>
    </li>
  )
}

function HighlightCard({ icon: Icon, title, children, color = "amber" }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode; color?: string }) {
  const colors: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
    amber: { bg: "bg-amber-500/5", border: "border-amber-500/15", text: "text-amber-400", iconBg: "bg-amber-500/15" },
    red: { bg: "bg-red-500/5", border: "border-red-500/15", text: "text-red-400", iconBg: "bg-red-500/15" },
    emerald: { bg: "bg-emerald-500/5", border: "border-emerald-500/15", text: "text-emerald-400", iconBg: "bg-emerald-500/15" },
    sky: { bg: "bg-sky-500/5", border: "border-sky-500/15", text: "text-sky-400", iconBg: "bg-sky-500/15" },
    purple: { bg: "bg-purple-500/5", border: "border-purple-500/15", text: "text-purple-400", iconBg: "bg-purple-500/15" },
  }
  const c = colors[color] || colors.amber
  return (
    <Card className={`${c.bg} border ${c.border}`}>
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-8 h-8 rounded-lg ${c.iconBg} flex items-center justify-center`}>
            <Icon className={`h-4 w-4 ${c.text}`} />
          </div>
          <h3 className={`font-semibold ${c.text}`}>{title}</h3>
        </div>
        <div className="text-white/60 text-sm leading-relaxed space-y-2">{children}</div>
      </CardContent>
    </Card>
  )
}

/* ── Page ──────────────────────────────────────────── */

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <VisualHeader />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Back link */}
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            {"Retour à l'accueil"}
          </Link>

          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-sm mb-6">
              <Gavel className="h-4 w-4" />
              {"Conditions Générales de Vente"}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {"Conditions Générales de Vente"}
            </h1>
            <div className="mb-4">
              <VisualSlogan size="sm" opacity="high" withLines />
            </div>
            <p className="text-white/50 text-sm">
              {"Version Provisoire Internationale \u2013 23 f\u00e9vrier 2026"}
            </p>
          </div>

          {/* Table of contents */}
          <Card className="bg-slate-900/40 border-white/10 mb-10">
            <CardContent className="p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-400" />
                Sommaire
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
                {[
                  "Identité de la plateforme",
                  "Objet des CGV",
                  "Profils utilisateurs",
                  "Conditions d'inscription",
                  "Cautions",
                  "Nature des participations",
                  "Système de votes",
                  "Répartition des gains",
                  "Règle d'arrondi",
                  "Wallet et paiements",
                  "Absence de garantie",
                  "Interdictions et sanctions",
                  "Propriété intellectuelle",
                  "Responsabilité de VISUAL",
                  "Données personnelles",
                  "Droit applicable",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/50 py-1">
                    <span className="text-amber-400/60 font-mono text-xs w-5 text-right">{i + 1}.</span>
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Informations provisoires */}
          <Card className="bg-amber-500/5 border-amber-500/15 mb-10">
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
                ].map((item, i) => (
                  <p key={i} className="text-white/45 py-0.5">{item}</p>
                ))}
              </div>
              <p className="text-amber-400/60 text-xs mt-4">
                {"Ce document est une version provisoire internationale. Les informations seront compl\u00e9t\u00e9es lors de l'immatriculation officielle de VISUAL."}
              </p>
            </CardContent>
          </Card>

          {/* Articles */}
          <div className="space-y-10">

            {/* Article 1 */}
            <Section num={1} title={"Identité de la plateforme"} icon={Globe}>
              <P>{"VISUAL est une plateforme numérique de diffusion et de participation économique à des contenus audiovisuels et littéraires, accessible à l'adresse visual.app (ou tout autre domaine exploité par VISUAL)."}</P>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                <HighlightCard icon={Handshake} title="Intermédiaire technique" color="amber">
                  <p>{"VISUAL agit en qualité d'intermédiaire technique entre les créateurs de contenus et les utilisateurs participants."}</p>
                </HighlightCard>
                <HighlightCard icon={Ban} title="Pas un établissement financier" color="red">
                  <p>{"VISUAL n'est ni une banque, ni un établissement financier, ni un prestataire de services d'investissement au sens du Code monétaire et financier."}</p>
                </HighlightCard>
                <HighlightCard icon={Shield} title="Cadre juridique" color="emerald">
                  <p>{"VISUAL opère dans le cadre du droit français et du règlement européen sur les services numériques (DSA)."}</p>
                </HighlightCard>
              </div>
            </Section>

            {/* Article 2 */}
            <Section num={2} title="Objet des CGV" icon={FileText}>
              <P>{"Les présentes Conditions Générales de Vente encadrent l'ensemble des relations contractuelles entre VISUAL et ses utilisateurs inscrits, notamment :"}</P>
              <ul className="space-y-2 ml-1">
                <Bullet>{"Les participations financières aux projets diffusés"}</Bullet>
                <Bullet>{"Les règles de classement (TOP Visiteur, TOP Porteur, TOP Infoporteur, TOP Podcasteur)"}</Bullet>
                <Bullet>{"Les modalités de redistribution des gains"}</Bullet>
                <Bullet>{"Le système de cautions"}</Bullet>
                <Bullet>{"Les paiements et retraits via Stripe Connect"}</Bullet>
                <Bullet>{"Les bonus applicables aux contenus podcast"}</Bullet>
              </ul>
              <P>{"En s'inscrivant et en utilisant les services de VISUAL, l'utilisateur reconnaît avoir lu, compris et accepté sans réserve les présentes CGV."}</P>
            </Section>

            {/* Article 3 */}
            <Section num={3} title="Profils utilisateurs" icon={Users}>
              <P>{"VISUAL distingue plusieurs profils, chacun associé à des droits et obligations spécifiques :"}</P>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {[
                  { icon: Eye, name: "Invité", desc: "Accès libre en consultation sans compte", color: "amber" },
                  { icon: Eye, name: "Visiteur", desc: "Inscrit, peut consulter et voter", color: "amber" },
                  { icon: Film, name: "Porteur", desc: "Créateur de contenus audiovisuels", color: "red" },
                  { icon: TrendingUp, name: "Investisseur", desc: "Participe financièrement aux projets vidéo", color: "emerald" },
                  { icon: BookOpen, name: "Infoporteur", desc: "Créateur de contenus littéraires", color: "sky" },
                  { icon: BookOpen, name: "Investi-lecteur", desc: "Participe financièrement aux contenus écrits", color: "sky" },
                  { icon: Mic, name: "Podcasteur", desc: "Créateur de contenus audio/podcast", color: "purple" },
                  { icon: Mic, name: "Auditeur", desc: "Écoute et participe aux contenus podcast", color: "purple" },
                ].map((p) => (
                  <HighlightCard key={p.name} icon={p.icon} title={p.name} color={p.color}>
                    <p>{p.desc}</p>
                  </HighlightCard>
                ))}
              </div>
              <Card className="bg-red-500/5 border-red-500/15 mt-4">
                <CardContent className="p-4 flex items-start gap-3">
                  <Shield className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-white/60 text-sm leading-relaxed">
                    {"L'accès ADMIN est un accès privé interne réservé à l'administration de la plateforme. Il ne constitue pas un profil public, n'apparaît dans aucun classement et n'est accessible qu'aux personnes autorisées par VISUAL."}
                  </p>
                </CardContent>
              </Card>
            </Section>

            {/* Article 4 */}
            <Section num={4} title={"Conditions d'inscription"} icon={BadgeCheck}>
              <P>{"Pour s'inscrire sur VISUAL, l'utilisateur doit satisfaire aux conditions suivantes :"}</P>
              <ul className="space-y-2 ml-1">
                <Bullet>{"Être âgé de 18 ans minimum au moment de l'inscription"}</Bullet>
                <Bullet>{"Ne détenir qu'un seul et unique compte par personne physique"}</Bullet>
                <Bullet>{"Fournir des informations exactes, complètes et à jour"}</Bullet>
                <Bullet>{"Disposer d'un compte Stripe Connect pour percevoir des gains (requis avant tout retrait)"}</Bullet>
              </ul>
              <P>{"Tout manquement à ces conditions peut entraîner la suspension ou la suppression du compte, sans préjudice des recours de VISUAL."}</P>
            </Section>

            {/* Article 5 */}
            <Section num={5} title="Cautions" icon={Wallet}>
              <P>{"Le système de cautions garantit l'engagement des utilisateurs sur la plateforme. La caution est un dépôt unique exigé selon le type de profil :"}</P>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Card className="bg-emerald-500/5 border-emerald-500/15">
                  <CardContent className="p-5 text-center">
                    <div className="text-3xl font-bold text-emerald-400 mb-1">10 EUR</div>
                    <p className="text-white/50 text-sm">{"Créateurs (Porteur, Infoporteur, Podcasteur)"}</p>
                  </CardContent>
                </Card>
                <Card className="bg-sky-500/5 border-sky-500/15">
                  <CardContent className="p-5 text-center">
                    <div className="text-3xl font-bold text-sky-400 mb-1">20 EUR</div>
                    <p className="text-white/50 text-sm">{"Participants financiers (Investisseur, Investi-lecteur, Auditeur)"}</p>
                  </CardContent>
                </Card>
              </div>
              <Card className="bg-amber-500/5 border-amber-500/15 mt-4">
                <CardContent className="p-4 flex items-start gap-3">
                  <Info className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-white/60 text-sm leading-relaxed space-y-1">
                    <p>{"Les cautions sont remboursables en cas de résiliation volontaire du compte, sous réserve qu'aucune fraude, multi-compte ou violation grave des CGV n'ait été constatée."}</p>
                    <p>{"Le remboursement est effectué via Stripe Connect dans un délai raisonnable."}</p>
                  </div>
                </CardContent>
              </Card>
            </Section>

            {/* Article 6 */}
            <Section num={6} title="Nature des participations" icon={TrendingUp}>
              <P>{"Les sommes engagées par les utilisateurs sur VISUAL donnent droit à des votes et peuvent générer un gain proportionnel au classement du contenu soutenu."}</P>
              <Card className="bg-red-500/5 border-red-500/15 mt-3">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    <div className="text-white/60 text-sm leading-relaxed space-y-2">
                      <p className="font-semibold text-red-400">{"Avertissement important"}</p>
                      <p>{"Les participations financières sur VISUAL ne constituent en aucun cas un produit financier, une action, un prêt, une obligation ou tout autre instrument financier au sens du Code monétaire et financier."}</p>
                      <p className="font-medium text-white/70">{"Aucun rendement n'est garanti. Les résultats dépendent exclusivement du classement et de l'activité sur la plateforme."}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Section>

            {/* Article 7 */}
            <Section num={7} title={"Système de votes"} icon={Vote}>
              <P>{"Le système de vote de VISUAL repose sur un mécanisme transparent et proportionnel :"}</P>
              <ul className="space-y-2 ml-1">
                <Bullet>{"Les votes sont proportionnels aux montants engagés par chaque utilisateur"}</Bullet>
                <Bullet>{"Aucun mécanisme aléatoire, tirage au sort ou algorithme opaque n'intervient dans le classement"}</Bullet>
                <Bullet>{"Le classement est déterminé uniquement par le cumul des participations reçues par chaque contenu"}</Bullet>
              </ul>
              <P>{"Ce système garantit l'équité entre les participants et la transparence des résultats."}</P>
            </Section>

            {/* Article 8 */}
            <Section num={8} title={"Répartition des gains"} icon={BarChart3}>
              <P>{"À la clôture de chaque période, les gains sont redistribués selon des grilles propres à chaque catégorie de contenu :"}</P>

              {/* Video */}
              <Card className="bg-red-500/5 border-red-500/15 mt-4">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                    <Film className="h-4 w-4" />
                    {"Contenus audiovisuels (Vidéos)"}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    {[
                      { label: "Investisseurs TOP 10", value: "40%", color: "text-emerald-400" },
                      { label: "Porteurs TOP 10", value: "30%", color: "text-red-400" },
                      { label: "Investisseurs 11-100", value: "7%", color: "text-amber-400" },
                      { label: "VISUAL", value: "23%", color: "text-white/50" },
                    ].map((r) => (
                      <div key={r.label} className="text-center p-3 rounded-lg bg-slate-800/40">
                        <div className={`text-xl font-bold ${r.color}`}>{r.value}</div>
                        <div className="text-white/40 text-xs mt-1">{r.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Ecrit */}
              <Card className="bg-sky-500/5 border-sky-500/15 mt-4">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-sky-400 mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {"Contenus littéraires (Écrits)"}
                  </h3>
                  <div className="text-white/60 text-sm leading-relaxed space-y-2">
                    <p>{"Vente unitaire : 70% pour l'auteur, 30% pour VISUAL."}</p>
                    <p>{"Pot de redistribution : 60% redistribués aux auteurs, 40% redistribués aux lecteurs participants."}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Podcast */}
              <Card className="bg-purple-500/5 border-purple-500/15 mt-4">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-purple-400 mb-3 flex items-center gap-2">
                    <Mic className="h-4 w-4" />
                    {"Contenus podcast"}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    {[
                      { label: "Podcasteurs", value: "40%", color: "text-purple-400" },
                      { label: "Auditeurs", value: "30%", color: "text-amber-400" },
                      { label: "VISUAL", value: "20%", color: "text-white/50" },
                      { label: "Bonus", value: "10%", color: "text-emerald-400" },
                    ].map((r) => (
                      <div key={r.label} className="text-center p-3 rounded-lg bg-slate-800/40">
                        <div className={`text-xl font-bold ${r.color}`}>{r.value}</div>
                        <div className="text-white/40 text-xs mt-1">{r.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 bg-slate-800/40 rounded-lg p-3">
                    <p className="text-white/60 text-xs font-medium mb-2">{"D\u00e9tail du bonus 10% :"}</p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <span className="text-emerald-400 font-bold">6%</span>
                        <p className="text-white/40 mt-0.5">Primes performance</p>
                      </div>
                      <div className="text-center">
                        <span className="text-sky-400 font-bold">2%</span>
                        <p className="text-white/40 mt-0.5">{"R\u00e9serve technique"}</p>
                      </div>
                      <div className="text-center">
                        <span className="text-amber-400 font-bold">2%</span>
                        <p className="text-white/40 mt-0.5">{"R\u00e9serve \u00e9v\u00e9nementielle"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Section>

            {/* Article 9 */}
            <Section num={9} title={"Règle d'arrondi"} icon={Clock}>
              <P>{"Tous les calculs de gains sont effectués au centime inférieur (arrondi par défaut). Les résidus issus de cet arrondi sont automatiquement intégrés à la réserve technique de VISUAL, garantissant l'équilibre comptable de la plateforme."}</P>
            </Section>

            {/* Article 10 */}
            <Section num={10} title="Wallet et paiements" icon={CreditCard}>
              <P>{"Chaque utilisateur inscrit dispose d'un wallet (portefeuille interne) qui centralise ses opérations financières sur VISUAL :"}</P>
              <ul className="space-y-2 ml-1">
                <Bullet>{"Les gains issus des classements sont automatiquement crédités dans le wallet"}</Bullet>
                <Bullet>{"Les gains valid\u00e9s sont vers\u00e9s le premier jour du mois suivant la p\u00e9riode de cl\u00f4ture"}</Bullet>
                <Bullet>{"Les retraits sont effectu\u00e9s via Stripe Connect vers le compte bancaire de l'utilisateur"}</Bullet>
                <Bullet>{"Les retraits sont trait\u00e9s chaque semaine par VISUAL"}</Bullet>
                <Bullet>{"VISUAL s'appuie sur les obligations de vérification d'identité (KYC) de Stripe en tant que prestataire de paiement"}</Bullet>
              </ul>
              <P>{"L'utilisateur est responsable de la validité et de l'exactitude de ses informations bancaires renseignées sur Stripe Connect."}</P>
            </Section>

            {/* Article 11 */}
            <Section num={11} title="Absence de garantie" icon={AlertTriangle}>
              <Card className="bg-amber-500/5 border-amber-500/15">
                <CardContent className="p-5 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-white/60 text-sm leading-relaxed space-y-2">
                    <p className="font-semibold text-amber-400">{"Clause essentielle"}</p>
                    <p>{"Aucun gain n'est garanti sur VISUAL. Les résultats financiers de chaque utilisateur dépendent exclusivement du classement obtenu par les contenus soutenus et de l'activité globale sur la plateforme."}</p>
                    <p>{"En acceptant les présentes CGV, l'utilisateur reconnaît avoir été informé de l'absence de toute garantie de rendement et assume l'intégralité des risques liés à ses participations."}</p>
                  </div>
                </CardContent>
              </Card>
            </Section>

            {/* Article 12 */}
            <Section num={12} title="Interdictions et sanctions" icon={Ban}>
              <P>{"Sont strictement interdits sur VISUAL :"}</P>
              <ul className="space-y-2 ml-1">
                <Bullet>{"La détention de plusieurs comptes (multi-comptes)"}</Bullet>
                <Bullet>{"Toute manipulation, artificielle ou concertée, des votes et classements"}</Bullet>
                <Bullet>{"La diffusion de contenus illicites, contrefaits, diffamatoires, haineux ou portant atteinte aux droits des tiers"}</Bullet>
                <Bullet>{"Toute tentative de fraude, de contournement des systèmes de sécurité ou d'exploitation abusive de la plateforme"}</Bullet>
              </ul>
              <P>{"En cas de manquement constaté, VISUAL se réserve le droit de suspendre ou supprimer le compte de l'utilisateur, de retenir la caution, et le cas échéant d'engager toute action en justice."}</P>
            </Section>

            {/* Article 13 */}
            <Section num={13} title={"Propriété intellectuelle"} icon={Award}>
              <P>{"Les créateurs de contenus diffusés sur VISUAL conservent l'intégralité de leurs droits de propriété intellectuelle sur leurs œuvres."}</P>
              <P>{"En publiant un contenu sur VISUAL, le créateur accorde à la plateforme une licence non exclusive, mondiale et révocable, pour les besoins de la diffusion, de la promotion et du fonctionnement du service (affichage, streaming, extraits promotionnels)."}</P>
              <P>{"Le créateur garantit être titulaire des droits sur les contenus publiés et s'engage à ne diffuser aucun contenu portant atteinte aux droits de tiers. VISUAL ne pourra être tenu responsable en cas de contrefaçon commise par un utilisateur."}</P>
            </Section>

            {/* Article 14 */}
            <Section num={14} title={"Responsabilité de VISUAL"} icon={Shield}>
              <P>{"VISUAL agit en qualité d'intermédiaire technique et d'hébergeur au sens de la loi pour la confiance dans l'économie numérique (LCEN) et du règlement européen sur les services numériques (DSA)."}</P>
              <ul className="space-y-2 ml-1">
                <Bullet>{"VISUAL n'exerce aucun contrôle éditorial préalable sur les contenus publiés par les utilisateurs"}</Bullet>
                <Bullet>{"VISUAL met en œuvre un système de signalement permettant de retirer tout contenu manifestement illicite dans les meilleurs délais"}</Bullet>
                <Bullet>{"La responsabilité de VISUAL est limitée aux fautes directes et prouvées qui lui sont exclusivement imputables"}</Bullet>
                <Bullet>{"VISUAL ne saurait être tenu responsable des pertes financières résultant des participations des utilisateurs, du comportement de tiers ou de toute interruption du service indépendante de sa volonté"}</Bullet>
              </ul>
            </Section>

            {/* Article 15 */}
            <Section num={15} title={"Données personnelles"} icon={Lock}>
              <P>{"Le traitement des données personnelles des utilisateurs est régi par la Politique de Confidentialité de VISUAL, accessible à tout moment depuis la plateforme."}</P>
              <P>{"VISUAL s'engage à traiter les données personnelles conformément au Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679), à la loi Informatique et Libertés du 6 janvier 1978 modifiée, et à toute réglementation applicable en matière de protection des données."}</P>
              <div className="mt-3">
                <Link href="/legal/privacy" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm transition-colors">
                  <FileText className="h-4 w-4" />
                  {"Consulter la Politique de Confidentialité"}
                </Link>
              </div>
            </Section>

            {/* Article 16 */}
            <Section num={16} title="Droit applicable" icon={Scale}>
              <P>{"Le droit applicable aux pr\u00e9sentes CGV sera celui du pays d'\u00e9tablissement officiel de VISUAL lors de sa mise en ligne d\u00e9finitive. En attendant, le droit fran\u00e7ais s'applique \u00e0 titre indicatif."}</P>
              <P>{"En cas de litige, les parties s'engagent \u00e0 rechercher une solution amiable dans un d\u00e9lai de 30 jours avant toute action judiciaire."}</P>
              <P>{"\u00c0 d\u00e9faut d'accord amiable, les juridictions comp\u00e9tentes du ressort du si\u00e8ge social de VISUAL seront saisies, sauf disposition l\u00e9gale imp\u00e9rative contraire au b\u00e9n\u00e9fice du consommateur."}</P>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <HighlightCard icon={Handshake} title={"Médiation"} color="emerald">
                  <p>{"Conformément aux articles L.611-1 et suivants du Code de la consommation, l'utilisateur peut recourir gratuitement au service de médiation de la consommation."}</p>
                </HighlightCard>
                <HighlightCard icon={Globe} title={"Plateforme européenne"} color="sky">
                  <p>{"Plateforme de résolution des litiges en ligne de la Commission européenne : "}<a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-sky-400 underline">{"ec.europa.eu/consumers/odr"}</a></p>
                </HighlightCard>
              </div>
            </Section>

          </div>

          {/* Signature */}
          <Card className="bg-slate-900/40 border-white/10 mt-12">
            <CardContent className="p-6 text-center">
              <p className="text-white/40 text-sm mb-2">
                {"Version Provisoire Internationale \u2013 23 f\u00e9vrier 2026"}
              </p>
              <p className="text-white/30 text-xs">
                {"VISUAL se réserve le droit de modifier les présentes CGV à tout moment. Les utilisateurs seront informés de toute modification substantielle par notification sur la plateforme. La poursuite de l'utilisation des services après modification vaut acceptation des nouvelles conditions."}
              </p>
            </CardContent>
          </Card>

        </div>
      </main>
      <Footer />
    </div>
  )
}
