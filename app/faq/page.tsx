"use client"

import Link from "next/link"
import { VisualSlogan } from "@/components/visual-slogan"
import { ArrowRight, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { VisualHeader } from "@/components/visual-header"
import { Footer } from "@/components/footer"

const FAQ_CATEGORIES = [
  {
    title: "Général",
    items: [
      {
        question: "Qu'est-ce que VIXUAL ?",
        answer:
          "VIXUAL est une plateforme d'investissement participatif dans les projets audiovisuels, litteraires et podcasts. Vous pouvez soutenir des createurs et potentiellement recevoir des retours sur vos investissements.",
      },
      {
        question: "Comment fonctionne l'investissement ?",
        answer:
          "Vous choisissez un projet qui vous int\u00e9resse, s\u00e9lectionnez un montant entre deux euros et vingt euros, et devenez investisseur. Si le projet g\u00e9n\u00e8re des revenus, vous recevez une part proportionnelle \u00e0 votre investissement.",
      },
      {
        question: "VIXUAL est-il un jeu de hasard ?",
        answer:
          "Non, VIXUAL n'est pas un jeu de hasard. C'est une plateforme d'investissement participatif. Les retours dépendent du succès réel des projets et non du hasard. Les gains ne sont pas garantis.",
      },
    ],
  },
  {
    title: "Comptes et Profils",
    items: [
      {
        question: "Comment créer un compte ?",
        answer:
          "Cliquez sur 'Inscription' et remplissez le formulaire. Vous devenez automatiquement Visiteur, un statut gratuit qui vous permet d'explorer la plateforme.",
      },
      {
        question: "Puis-je être créateur ET investisseur ?",
        answer:
          "Absolument ! Vous pouvez cumuler plusieurs rôles sur VIXUAL. Chaque rôle nécessite sa propre caution.",
      },
      {
        question: "Quels sont les differents profils ?",
        answer:
          "VIXUAL propose 8 profils : Invite (sans inscription, acces limite aux contenus gratuits et extraits), Visiteur (gratuit, inscription requise), Porteur (createur video), Infoporteur (createur ecrit), Podcasteur (createur podcast), Investisseur (investisseur video), Investi-lecteur (investisseur ecrit) et Auditeur (investisseur podcast).",
      },
      {
        question: "Puis-je naviguer sans m'inscrire ?",
        answer:
          "Oui, en tant qu'Invite vous pouvez naviguer librement sur toute la plateforme et acceder aux contenus gratuits ou aux extraits. Cependant, vous ne pouvez ni investir, ni gagner de VISUpoints, ni participer a la communaute. Pour debloquer toutes les fonctionnalites, il vous suffit de creer un compte gratuitement.",
      },
    ],
  },
  {
    title: "Caution et Paiements",
    items: [
      {
        question: "Qu'est-ce que la caution ?",
        answer:
          "La caution est un d\u00e9p\u00f4t unique (dix euros pour les cr\u00e9ateurs : Porteur, Infoporteur, Podcasteur ; vingt euros pour les investisseurs : Investisseur, Investi-lecteur, Auditeur) qui garantit votre engagement sur la plateforme. Elle est remboursable en cas de r\u00e9siliation de votre compte.",
      },
      {
        question: "Comment retirer mes gains ?",
        answer:
          "Vos gains sont consultables dans votre Wallet. Pour retirer, vous devez connecter votre compte Stripe. Les retraits sont traités chaque semaine.",
      },
      {
        question: "Quels moyens de paiement sont acceptés ?",
        answer:
          "Nous acceptons les cartes bancaires (Visa, Mastercard) via Stripe, notre partenaire de paiement sécurisé.",
      },
      {
        question: "La caution est-elle vraiment remboursable ?",
        answer:
          "Oui, si vous résiliez votre compte en respectant les conditions d'utilisation, votre caution vous sera remboursée intégralement.",
      },
    ],
  },
  {
    title: "Créateurs",
    items: [
      {
        question: "Comment déposer un projet ?",
        answer:
          "Apr\u00e8s avoir pay\u00e9 votre caution de cr\u00e9ateur (dix euros), acc\u00e9dez \u00e0 'Mon Espace' puis 'D\u00e9poser' pour soumettre votre projet vid\u00e9o, \u00e9crit ou podcast.",
      },
      {
        question: "Quels types de contenus puis-je déposer ?",
        answer:
          "Pour l'audiovisuel : courts-metrages, documentaires, clips musicaux, animations. Pour le litteraire : romans, nouvelles, essais, articles, poesie. Pour les podcasts : emissions audio, documentaires sonores, voix de l'info.",
      },
      {
        question: "Comment sont calculés mes gains en tant que créateur ?",
        answer:
          "La repartition depend de la categorie. Films/Videos/Documentaires : 40% investisseurs TOP 10, 30% porteurs TOP 10, 7% investisseurs rangs 11-100, 23% VIXUAL. Podcasts (pot mensuel) : 40% podcasteurs, 30% auditeurs, 20% VIXUAL, 10% bonus. Voix de l'Info (pot quotidien) : 60% auteurs TOP 10, 40% lecteurs gagnants. Livres (pot mensuel) : 60% auteurs TOP 10, 40% investi-lecteurs gagnants. Pour les ventes unitaires (articles, livres, podcasts) : 70% auteur, 30% VIXUAL.",
      },
    ],
  },
  {
    title: "Investisseurs",
    items: [
      {
        question: "Combien puis-je investir ?",
        answer:
          "Vous pouvez investir entre deux euros et vingt euros par projet (tranches : deux, trois, quatre, cinq, six, huit, dix, douze, quinze, vingt euros). Vous pouvez investir dans autant de projets que vous le souhaitez.",
      },
      {
        question: "Quand recevrai-je mes retours ?",
        answer:
          "Cela depend de la categorie. Films/Videos/Documentaires : a la cloture du cycle (configurable par l'admin). Voix de l'Info : pot quotidien distribue chaque jour a 00h15. Livres : pot mensuel distribue le dernier jour du mois. Podcasts : pot mensuel distribue le dernier jour du mois. Les retours apparaissent dans votre Wallet et peuvent etre retires via Stripe Connect.",
      },
      {
        question: "Puis-je perdre mon investissement ?",
        answer:
          "L'investissement comporte des risques. Si un projet ne génère pas de revenus, vous pourriez ne pas récupérer votre investissement. Investissez de manière responsable.",
      },
    ],
  },
  {
    title: "Invite (sans inscription)",
    items: [
      {
        question: "Que puis-je faire en tant qu'invite ?",
        answer:
          "En tant qu'invite, vous pouvez naviguer sur toute la plateforme et consulter les contenus gratuits ainsi que les extraits de contenus payants. Vous ne pouvez pas interagir avec la communaute, investir, ou gagner des recompenses.",
      },
      {
        question: "Quelles sont les limites du statut d'invite ?",
        answer:
          "L'invite ne peut pas : gagner de VISUpoints, ajouter des favoris, commenter, partager, investir, deposer du contenu, ou acceder aux contenus payants en entier. Pour debloquer ces fonctionnalites, creez un compte gratuit.",
      },
      {
        question: "L'inscription est-elle obligatoire ?",
        answer:
          "Non, l'inscription n'est pas obligatoire. Vous pouvez consulter la plateforme librement en tant qu'invite. Cependant, pour profiter de l'experience complete de VIXUAL (investissements, VISUpoints, communaute), vous devez creer un compte.",
      },
    ],
  },
  {
    title: "VISUpoints",
    items: [
      {
        question: "Que sont les VISUpoints ?",
        answer:
          "Les VISUpoints sont des points de fidélité que vous gagnez en utilisant la plateforme : parrainages, partages, commentaires, etc. Ils débloquent des avantages exclusifs.",
      },
      {
        question: "Comment gagner des VISUpoints ?",
        answer:
          "Parrainez des amis, partagez des projets sur les réseaux sociaux, commentez, suivez des créateurs, connectez-vous régulièrement, et participez aux missions spéciales.",
      },
      {
        question: "À quoi servent les VISUpoints ?",
        answer:
          "Les VISUpoints vous permettent d'obtenir des badges, de débloquer des avantages exclusifs, et d'apparaître dans le classement des utilisateurs les plus actifs.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <VisualHeader />

      <main className="pt-28 pb-20 cinema-section">
        {/* Hero */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="h-8 w-8 text-emerald-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Foire aux Questions
            </h1>
            <div className="mb-6">
              <VisualSlogan size="sm" opacity="high" withLines />
            </div>
            <p className="text-xl text-white/70">
              {"Trouvez rapidement les réponses à vos questions sur VIXUAL"}
            </p>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="container mx-auto px-4 mb-20">
          <div className="max-w-3xl mx-auto space-y-8">
            {FAQ_CATEGORIES.map((category) => (
              <div key={category.title}>
                <h2 className="text-xl font-semibold text-white mb-4 pl-2 border-l-2 border-emerald-500">
                  {category.title}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {category.items.map((item, index) => (
                    <AccordionItem
                      key={index}
                      value={`${category.title}-${index}`}
                      className="bg-slate-900/50 border border-white/10 rounded-lg px-4 data-[state=open]:border-emerald-500/50"
                    >
                      <AccordionTrigger className="text-white hover:text-emerald-400 text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-white/70">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-slate-900/30 cinema-section">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Vous n'avez pas trouvé votre réponse ?
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Notre équipe de support est là pour vous aider
            </p>
            <Link href="/support/contact">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-8"
              >
                Contacter le support
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
