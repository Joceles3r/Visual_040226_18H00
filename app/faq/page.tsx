"use client"

import Link from "next/link"
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
        question: "Qu'est-ce que VISUAL ?",
        answer:
          "VISUAL est une plateforme d'investissement participatif dans les projets audiovisuels et littéraires. Vous pouvez soutenir des créateurs et potentiellement recevoir des retours sur vos investissements.",
      },
      {
        question: "Comment fonctionne l'investissement ?",
        answer:
          "Vous choisissez un projet qui vous intéresse, sélectionnez un montant entre 1€ et 20€, et devenez investisseur. Si le projet génère des revenus, vous recevez une part proportionnelle à votre investissement.",
      },
      {
        question: "VISUAL est-il un jeu de hasard ?",
        answer:
          "Non, VISUAL n'est pas un jeu de hasard. C'est une plateforme d'investissement participatif. Les retours dépendent du succès réel des projets et non du hasard. Les gains ne sont pas garantis.",
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
          "Absolument ! Vous pouvez cumuler plusieurs rôles sur VISUAL. Chaque rôle nécessite sa propre caution.",
      },
      {
        question: "Quels sont les différents profils ?",
        answer:
          "VISUAL propose plusieurs profils : Visiteur (gratuit), Porteur (créateur vidéo), Infoporteur (créateur écrit), Investisseur (investisseur vidéo) et Investi-lecteur (investisseur écrit).",
      },
    ],
  },
  {
    title: "Caution et Paiements",
    items: [
      {
        question: "Qu'est-ce que la caution ?",
        answer:
          "La caution est un dépôt unique (10€ pour les créateurs, 20€ pour les investisseurs) qui garantit votre engagement sur la plateforme. Elle est remboursable en cas de résiliation de votre compte.",
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
          "Après avoir payé votre caution de créateur (10€), accédez à 'Mon Espace' puis 'Déposer' pour soumettre votre projet vidéo ou écrit.",
      },
      {
        question: "Quels types de contenus puis-je déposer ?",
        answer:
          "Pour l'audiovisuel : courts-métrages, documentaires, clips musicaux, animations. Pour le littéraire : romans, nouvelles, essais, articles, poésie.",
      },
      {
        question: "Comment sont calculés mes gains en tant que créateur ?",
        answer:
          "Vos gains dépendent des investissements reçus et des performances de votre projet. Une commission VISUAL est prélevée sur les revenus générés.",
      },
    ],
  },
  {
    title: "Investisseurs",
    items: [
      {
        question: "Combien puis-je investir ?",
        answer:
          "Vous pouvez investir entre 1€ et 20€ par projet. Vous pouvez investir dans autant de projets que vous le souhaitez.",
      },
      {
        question: "Quand recevrai-je mes retours ?",
        answer:
          "Les retours sont versés lorsque le projet génère des revenus. Ils apparaissent dans votre Wallet et peuvent être retirés lors des sessions de retrait hebdomadaires.",
      },
      {
        question: "Puis-je perdre mon investissement ?",
        answer:
          "L'investissement comporte des risques. Si un projet ne génère pas de revenus, vous pourriez ne pas récupérer votre investissement. Investissez de manière responsable.",
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

      <main className="pt-28 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="h-8 w-8 text-emerald-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Foire aux Questions
            </h1>
            <p className="text-xl text-white/70">
              Trouvez rapidement les réponses à vos questions sur VISUAL
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
        <section className="py-16 bg-slate-900/30">
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
