import type { InvestmentTierEur } from "@/lib/payout/constants"
import {
  INVESTMENT_TIERS_EUR,
  getVotesForInvestment,
  getVisupointsForInvestment,
  CAUTION_EUR,
} from "@/lib/payout/constants"

// Types de contenu
export type ContentType = "video" | "text" | "podcast"

export interface Content {
  id: string
  title: string
  description: string
  contentType: ContentType
  coverUrl: string
  creatorName: string
  creatorId: string
  createdAt: string
  investmentGoal: number
  currentInvestment: number
  investorCount: number
  totalVotes: number
  isFree: boolean
  category: string
  goldPass?: boolean // Créateur ayant le Gold Pass
  duration?: string // Pour les videos et podcasts
  wordCount?: number // Pour les ecrits
  episodeCount?: number // Pour les podcasts
}

export interface Investment {
  id: string
  contentId: string
  contentTitle: string
  contentType: ContentType
  /** Montant en euros (doit etre dans INVESTMENT_TIERS_EUR) */
  amount: InvestmentTierEur
  /** Votes gagnes pour cet investissement */
  votes: number
  /** VISUpoints gagnes pour cet investissement */
  visupointsEarned: number
  date: string
  status: "active" | "completed" | "refunded"
  returns: number
}

export interface Transaction {
  id: string
  type: "investment" | "deposit" | "withdrawal" | "return" | "visupoints" | "caution"
  description: string
  /** Montant en euros (positif = credit, negatif = debit) */
  amount: number
  date: string
  status: "completed" | "pending" | "failed"
}

// Gold Pass creators (source de vérité pour le statut Gold)
export const GOLD_CREATORS_NAMES = [
  "Marie Stellaire",
  "Karim Ondes",
  "Thomas Voix",
  "Nora Mystère",
  "Hana Sound",
]

export function isGoldCreator(creatorName: string): boolean {
  return GOLD_CREATORS_NAMES.includes(creatorName)
}

// Filtre les contenus des créateurs Gold
export const MOCK_VIDEO_CONTENTS: Content[] = [
  { id: "v1", title: "L'Odyss\u00e9e des \u00c9toiles", description: "Un court-m\u00e9trage de science-fiction \u00e9poustouflant explorant les confins de l'univers.", contentType: "video", coverUrl: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&h=450&fit=crop", creatorName: "Marie Stellaire", creatorId: "c1", createdAt: "2026-01-15", investmentGoal: 5000, currentInvestment: 3200, investorCount: 47, totalVotes: 312, isFree: false, category: "Science-Fiction", duration: "18:45" },
  { id: "v2", title: "Murmures de la For\u00eat", description: "Documentaire immersif sur la biodiversit\u00e9 cach\u00e9e des for\u00eats tropicales.", contentType: "video", coverUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=450&fit=crop", creatorName: "Lucas Nature", creatorId: "c2", createdAt: "2026-01-20", investmentGoal: 3000, currentInvestment: 2800, investorCount: 89, totalVotes: 245, isFree: false, category: "Documentaire", duration: "32:10" },
  { id: "v3", title: "M\u00e9tropolis 2050", description: "Vision futuriste d'une m\u00e9gapole o\u00f9 technologie et humanit\u00e9 coexistent.", contentType: "video", coverUrl: "/images/explore/v-metropolis-2050.jpg", creatorName: "F\u00e9lix Cin\u00e9ma", creatorId: "c8", createdAt: "2026-01-25", investmentGoal: 8000, currentInvestment: 5600, investorCount: 73, totalVotes: 410, isFree: false, category: "Science-Fiction", duration: "24:30" },
  { id: "v4", title: "Danse des Flammes", description: "Court-m\u00e9trage sur l'art du flamenco et la passion qui consume tout.", contentType: "video", coverUrl: "/images/explore/v-danse-flammes.jpg", creatorName: "Amina Vision", creatorId: "c9", createdAt: "2026-01-28", investmentGoal: 2500, currentInvestment: 2500, investorCount: 56, totalVotes: 189, isFree: false, category: "Drame", duration: "14:20" },
  { id: "v5", title: "Les Abysses", description: "Plong\u00e9e vertigineuse dans les profondeurs oc\u00e9aniques et ses cr\u00e9atures.", contentType: "video", coverUrl: "/images/explore/v-abysses.jpg", creatorName: "Paul R\u00e9al", creatorId: "c10", createdAt: "2026-02-01", investmentGoal: 4000, currentInvestment: 1200, investorCount: 29, totalVotes: 156, isFree: true, category: "Documentaire", duration: "28:45" },
  { id: "v6", title: "Jazz \u00e0 Minuit", description: "Un hommage cin\u00e9matographique au jazz des ann\u00e9es folles dans les clubs parisiens.", contentType: "video", coverUrl: "/images/explore/v-jazz-minuit.jpg", creatorName: "Lina Studio", creatorId: "c11", createdAt: "2026-02-03", investmentGoal: 3500, currentInvestment: 3100, investorCount: 67, totalVotes: 278, isFree: false, category: "Musique", duration: "21:15" },
  { id: "v7", title: "Saveurs du Monde", description: "Tour gastronomique en images \u00e0 travers cinq continents.", contentType: "video", coverUrl: "/images/explore/v-saveurs-monde.jpg", creatorName: "Yann Film", creatorId: "c12", createdAt: "2026-02-05", investmentGoal: 2000, currentInvestment: 1800, investorCount: 41, totalVotes: 198, isFree: false, category: "Documentaire", duration: "35:00" },
  { id: "v8", title: "Le Silence de la Montagne", description: "M\u00e9ditation visuelle sur la solitude et la grandeur des sommets alpins.", contentType: "video", coverUrl: "/images/explore/v-silence-montagne.jpg", creatorName: "Eva Regard", creatorId: "c13", createdAt: "2026-02-07", investmentGoal: 1500, currentInvestment: 900, investorCount: 22, totalVotes: 134, isFree: true, category: "Documentaire", duration: "19:30" },
  { id: "v9", title: "Robots \u00e0 Sentiments", description: "Com\u00e9die dramatique o\u00f9 une IA d\u00e9couvre les \u00e9motions humaines.", contentType: "video", coverUrl: "/images/explore/v-robots-sentiments.jpg", creatorName: "Marco Pixel", creatorId: "c14", createdAt: "2026-02-09", investmentGoal: 6000, currentInvestment: 4800, investorCount: 95, totalVotes: 520, isFree: false, category: "Com\u00e9die", duration: "22:00" },
  { id: "v10", title: "Le Dernier Train", description: "Thriller nocturne \u00e0 bord d'un train myst\u00e9rieux traversant l'Europe.", contentType: "video", coverUrl: "/images/explore/v-dernier-train.jpg", creatorName: "Nadia Cam\u00e9ra", creatorId: "c15", createdAt: "2026-02-11", investmentGoal: 4500, currentInvestment: 2100, investorCount: 38, totalVotes: 267, isFree: false, category: "Drame", duration: "26:40" },
  { id: "v11", title: "Aurore Bor\u00e9ale", description: "Voyage po\u00e9tique sous les lumi\u00e8res du Grand Nord scandinave.", contentType: "video", coverUrl: "/images/explore/v-aurore-boreale.jpg", creatorName: "Romain Sc\u00e8ne", creatorId: "c16", createdAt: "2026-02-13", investmentGoal: 3000, currentInvestment: 2400, investorCount: 52, totalVotes: 301, isFree: false, category: "Documentaire", duration: "30:15" },
  { id: "v12", title: "Graffiti Vivant", description: "L'art urbain prend vie dans les rues de Marseille en r\u00e9alit\u00e9 augment\u00e9e.", contentType: "video", coverUrl: "/images/explore/v-graffiti-vivant.jpg", creatorName: "Chlo\u00e9 Script", creatorId: "c17", createdAt: "2026-02-15", investmentGoal: 2000, currentInvestment: 1600, investorCount: 44, totalVotes: 213, isFree: true, category: "Animation", duration: "12:50" },
  { id: "v13", title: "Oc\u00e9an Profond", description: "Exploration sous-marine des r\u00e9cifs coralliens en danger.", contentType: "video", coverUrl: "/images/explore/v-ocean-profond.jpg", creatorName: "Karim Prod", creatorId: "c18", createdAt: "2026-02-17", investmentGoal: 5500, currentInvestment: 3300, investorCount: 61, totalVotes: 345, isFree: false, category: "Documentaire", duration: "40:20" },
  { id: "v14", title: "Origami Vivant", description: "Animation en stop-motion o\u00f9 des origamis explorent un monde de papier.", contentType: "video", coverUrl: "/images/explore/v-origami-vivant.jpg", creatorName: "Iris Lumi\u00e8re", creatorId: "c19", createdAt: "2026-02-19", investmentGoal: 1800, currentInvestment: 1800, investorCount: 35, totalVotes: 178, isFree: false, category: "Animation", duration: "9:45" },
  { id: "v15", title: "Danseurs du Vent", description: "Performance de danse contemporaine film\u00e9e sur les toits de Lyon.", contentType: "video", coverUrl: "/images/explore/v-danseurs-vent.jpg", creatorName: "L\u00e9o Motion", creatorId: "c20", createdAt: "2026-02-21", investmentGoal: 2200, currentInvestment: 800, investorCount: 18, totalVotes: 97, isFree: false, category: "Drame", duration: "16:10" },
  { id: "v16", title: "Lumi\u00e8res de Berlin", description: "Documentaire nocturne sur la sc\u00e8ne artistique underground berlinoise.", contentType: "video", coverUrl: "/images/explore/v-lumiere-berlin.jpg", creatorName: "Hana Screen", creatorId: "c21", createdAt: "2026-02-23", investmentGoal: 3800, currentInvestment: 2700, investorCount: 58, totalVotes: 289, isFree: false, category: "Documentaire", duration: "33:25" },
]

// Mock contenus litteraires (16 ecrits)
export const MOCK_TEXT_CONTENTS: Content[] = [
  { id: "t1", title: "Les Chroniques du Temps Perdu", description: "Un roman fantastique captivant o\u00f9 le temps n'est qu'une illusion.", contentType: "text", coverUrl: "/images/explore/t-chroniques-temps.jpg", creatorName: "Pierre Michel", creatorId: "c5", createdAt: "2026-01-10", investmentGoal: 2000, currentInvestment: 1800, investorCount: 62, totalVotes: 287, isFree: false, category: "Fantastique", wordCount: 85000 },
  { id: "t2", title: "R\u00e9flexions sur l'IA", description: "Un essai philosophique sur notre cohabitation avec l'intelligence artificielle.", contentType: "text", coverUrl: "/images/explore/t-algorithme-amour.jpg", creatorName: "Dr. Emma Pens\u00e9e", creatorId: "c6", createdAt: "2026-01-25", investmentGoal: 1000, currentInvestment: 750, investorCount: 28, totalVotes: 134, isFree: true, category: "Essai", wordCount: 15000 },
  { id: "t3", title: "Contes de Minuit", description: "Une collection de nouvelles myst\u00e9rieuses \u00e0 lire quand la nuit tombe.", contentType: "text", coverUrl: "/images/explore/t-ombres-venise.jpg", creatorName: "Nora Myst\u00e8re", creatorId: "c7", createdAt: "2026-02-03", investmentGoal: 1500, currentInvestment: 400, investorCount: 15, totalVotes: 89, isFree: false, category: "Nouvelles", wordCount: 45000 },
  { id: "t4", title: "Pages d'Amour", description: "Un recueil po\u00e9tique sur la magie des rencontres litt\u00e9raires.", contentType: "text", coverUrl: "/images/woman-reading-books.jpg", creatorName: "Claire Lettres", creatorId: "c4", createdAt: "2026-02-02", investmentGoal: 1500, currentInvestment: 1500, investorCount: 34, totalVotes: 156, isFree: false, category: "Po\u00e9sie", wordCount: 12000 },
  { id: "t5", title: "La Biblioth\u00e8que Oubli\u00e9e", description: "Roman policier au c\u0153ur d'une biblioth\u00e8que ancestrale renfermant des secrets.", contentType: "text", coverUrl: "/images/explore/t-bibliotheque-oubliee.jpg", creatorName: "Andr\u00e9 Plume", creatorId: "c30", createdAt: "2026-02-05", investmentGoal: 2500, currentInvestment: 2100, investorCount: 48, totalVotes: 234, isFree: false, category: "Thriller", wordCount: 92000 },
  { id: "t6", title: "L'Encre de la M\u00e9moire", description: "R\u00e9cit autobiographique d'une calligraphe qui perd progressivement la vue.", contentType: "text", coverUrl: "/images/explore/t-encre-memoire.jpg", creatorName: "Luna Pages", creatorId: "c31", createdAt: "2026-02-07", investmentGoal: 1800, currentInvestment: 1200, investorCount: 37, totalVotes: 178, isFree: false, category: "Roman", wordCount: 67000 },
  { id: "t7", title: "Le Samoura\u00ef Digital", description: "Science-fiction cyberpunk o\u00f9 un guerrier virtuel d\u00e9fend le dernier firewall.", contentType: "text", coverUrl: "/images/explore/t-samourai-digital.jpg", creatorName: "Sami Texte", creatorId: "c32", createdAt: "2026-02-09", investmentGoal: 3000, currentInvestment: 2400, investorCount: 55, totalVotes: 312, isFree: false, category: "Science-Fiction", wordCount: 78000 },
  { id: "t8", title: "Le Caf\u00e9 des Philosophes", description: "Dialogues fictifs entre grands penseurs de toutes les \u00e9poques.", contentType: "text", coverUrl: "/images/explore/t-cafe-philosophes.jpg", creatorName: "Elsa Roman", creatorId: "c33", createdAt: "2026-02-11", investmentGoal: 1200, currentInvestment: 900, investorCount: 31, totalVotes: 145, isFree: true, category: "Essai", wordCount: 28000 },
  { id: "t9", title: "Le Jardinier des \u00c9toiles", description: "Conte fantastique o\u00f9 un jardinier cultive des galaxies dans son jardin.", contentType: "text", coverUrl: "/images/explore/t-jardinier-etoiles.jpg", creatorName: "Marc Prose", creatorId: "c34", createdAt: "2026-02-13", investmentGoal: 1600, currentInvestment: 1600, investorCount: 43, totalVotes: 256, isFree: false, category: "Fantastique", wordCount: 52000 },
  { id: "t10", title: "Les Ombres de Venise", description: "Thriller historique dans les ruelles sombres de la S\u00e9r\u00e9nissime.", contentType: "text", coverUrl: "/images/explore/t-dernier-mot.jpg", creatorName: "Julie Encre", creatorId: "c35", createdAt: "2026-02-15", investmentGoal: 2200, currentInvestment: 1100, investorCount: 26, totalVotes: 167, isFree: false, category: "Thriller", wordCount: 88000 },
  { id: "t11", title: "La R\u00e9volution Douce", description: "Essai engag\u00e9 sur les mouvements citoyens pacifiques du vingt-et-uni\u00e8me si\u00e8cle.", contentType: "text", coverUrl: "/images/explore/t-revolution-douce.jpg", creatorName: "Youssef Chapitre", creatorId: "c36", createdAt: "2026-02-17", investmentGoal: 1400, currentInvestment: 800, investorCount: 19, totalVotes: 98, isFree: true, category: "Essai", wordCount: 35000 },
  { id: "t12", title: "Lettres Invisibles", description: "Roman \u00e9pistolaire entre deux inconnus qui s'\u00e9crivent sans jamais se rencontrer.", contentType: "text", coverUrl: "/images/explore/t-lettres-invisible.jpg", creatorName: "Mina Verso", creatorId: "c37", createdAt: "2026-02-19", investmentGoal: 1700, currentInvestment: 1500, investorCount: 40, totalVotes: 201, isFree: false, category: "Roman", wordCount: 61000 },
  { id: "t13", title: "Paris \u00c9ternel", description: "Recueil de nouvelles romantiques se d\u00e9roulant dans le Paris de toutes les \u00e9poques.", contentType: "text", coverUrl: "/images/explore/t-paris-eternel.jpg", creatorName: "Romain Ligne", creatorId: "c38", createdAt: "2026-02-21", investmentGoal: 1900, currentInvestment: 700, investorCount: 21, totalVotes: 112, isFree: false, category: "Nouvelles", wordCount: 48000 },
  { id: "t14", title: "Le Code Quantique", description: "Thriller technologique o\u00f9 un physicien d\u00e9couvre une faille dans la r\u00e9alit\u00e9.", contentType: "text", coverUrl: "/images/explore/t-code-quantique.jpg", creatorName: "\u00c9lodie Style", creatorId: "c39", createdAt: "2026-02-22", investmentGoal: 2800, currentInvestment: 2200, investorCount: 64, totalVotes: 345, isFree: false, category: "Science-Fiction", wordCount: 95000 },
  { id: "t15", title: "Jardin de Po\u00e8mes", description: "Po\u00e9sie contemplative sur la nature, les saisons et l'\u00e9merveillement.", contentType: "text", coverUrl: "/images/explore/t-jardin-poemes.jpg", creatorName: "Tarik R\u00e9cit", creatorId: "c40", createdAt: "2026-02-24", investmentGoal: 800, currentInvestment: 600, investorCount: 16, totalVotes: 78, isFree: true, category: "Po\u00e9sie", wordCount: 8000 },
  { id: "t16", title: "Nuit Polaire", description: "Huis clos psychologique dans une station arctique coup\u00e9e du monde.", contentType: "text", coverUrl: "/images/explore/t-nuit-polaire.jpg", creatorName: "Margot Fable", creatorId: "c41", createdAt: "2026-02-26", investmentGoal: 2400, currentInvestment: 1900, investorCount: 51, totalVotes: 278, isFree: false, category: "Thriller", wordCount: 82000 },
]

// Mock contenus podcasts (16 podcasts)
export const MOCK_PODCAST_CONTENTS: Content[] = [
  { id: "p1", title: "Le Dernier Caf\u00e9", description: "Rencontres improbables autour d'un caf\u00e9, chaque \u00e9pisode explore une histoire humaine unique.", contentType: "podcast", coverUrl: "/images/explore/p-dernier-cafe.jpg", creatorName: "Sophie Drama", creatorId: "c3", createdAt: "2026-02-01", investmentGoal: 2000, currentInvestment: 500, investorCount: 12, totalVotes: 89, isFree: true, category: "Societe", duration: "45:00", episodeCount: 8 },
  { id: "p2", title: "Les Voix de la Nuit", description: "T\u00e9moignages nocturnes de personnes qui vivent quand le monde dort.", contentType: "podcast", coverUrl: "/images/explore/p-voix-nuit.jpg", creatorName: "Karim Ondes", creatorId: "c50", createdAt: "2026-01-18", investmentGoal: 3000, currentInvestment: 2400, investorCount: 56, totalVotes: 312, isFree: false, category: "Societe", duration: "38:00", episodeCount: 12 },
  { id: "p3", title: "Ondes Urbaines", description: "Le pouls des grandes villes du monde captur\u00e9 en sons et en mots.", contentType: "podcast", coverUrl: "/images/explore/p-ondes-urbaines.jpg", creatorName: "Lina Audio", creatorId: "c51", createdAt: "2026-01-22", investmentGoal: 2500, currentInvestment: 1800, investorCount: 43, totalVotes: 234, isFree: false, category: "Culture", duration: "42:00", episodeCount: 10 },
  { id: "p4", title: "Tech de Demain", description: "D\u00e9cryptage des innovations technologiques qui fa\u00e7onnent notre avenir.", contentType: "podcast", coverUrl: "/images/explore/p-tech-demain.jpg", creatorName: "Thomas Voix", creatorId: "c52", createdAt: "2026-01-28", investmentGoal: 4000, currentInvestment: 3600, investorCount: 78, totalVotes: 456, isFree: false, category: "Technologie", duration: "35:00", episodeCount: 15 },
  { id: "p5", title: "Histoires Oubli\u00e9es", description: "Red\u00e9couverte d'\u00e9v\u00e9nements historiques m\u00e9connus qui ont chang\u00e9 le monde.", contentType: "podcast", coverUrl: "/images/explore/p-histoires-oubliees.jpg", creatorName: "Mina Podcast", creatorId: "c53", createdAt: "2026-02-02", investmentGoal: 2800, currentInvestment: 2200, investorCount: 52, totalVotes: 289, isFree: false, category: "Histoire", duration: "50:00", episodeCount: 9 },
  { id: "p6", title: "Rires et Compagnie", description: "Spectacle d'humour enregistr\u00e9 en live avec des invit\u00e9s surprises.", contentType: "podcast", coverUrl: "/images/explore/p-rires-compagnie.jpg", creatorName: "Sami Micro", creatorId: "c54", createdAt: "2026-02-04", investmentGoal: 1500, currentInvestment: 1500, investorCount: 38, totalVotes: 201, isFree: true, category: "Humour", duration: "55:00", episodeCount: 20 },
  { id: "p7", title: "Secrets de Cuisine", description: "Les chefs les plus talentueux r\u00e9v\u00e8lent leurs recettes et philosophies culinaires.", contentType: "podcast", coverUrl: "/images/explore/p-secrets-cuisine.jpg", creatorName: "\u00c9va Studio", creatorId: "c55", createdAt: "2026-02-06", investmentGoal: 1800, currentInvestment: 1200, investorCount: 33, totalVotes: 167, isFree: false, category: "Culture", duration: "40:00", episodeCount: 11 },
  { id: "p8", title: "L'Affaire en Cours", description: "Enqu\u00eates approfondies sur des affaires judiciaires non r\u00e9solues.", contentType: "podcast", coverUrl: "/images/explore/p-investigation.jpg", creatorName: "Yann \u00c9coute", creatorId: "c56", createdAt: "2026-02-08", investmentGoal: 5000, currentInvestment: 4200, investorCount: 91, totalVotes: 534, isFree: false, category: "Investigation", duration: "60:00", episodeCount: 6 },
  { id: "p9", title: "\u00c9chos de Voyage", description: "Carnets sonores d'un globe-trotteur \u00e0 travers les cinq continents.", contentType: "podcast", coverUrl: "/images/explore/p-echos-voyage.jpg", creatorName: "Hana Sound", creatorId: "c57", createdAt: "2026-02-10", investmentGoal: 2200, currentInvestment: 1600, investorCount: 39, totalVotes: 198, isFree: false, category: "Culture", duration: "32:00", episodeCount: 14 },
  { id: "p10", title: "Galaxie Sonore", description: "Exploration de l'univers \u00e0 travers les sons de l'espace et la science.", contentType: "podcast", coverUrl: "/images/explore/p-science-fiction.jpg", creatorName: "Marco Fr\u00e9quence", creatorId: "c58", createdAt: "2026-02-12", investmentGoal: 3500, currentInvestment: 2800, investorCount: 65, totalVotes: 378, isFree: false, category: "Technologie", duration: "45:00", episodeCount: 8 },
  { id: "p11", title: "Philosophie du Quotidien", description: "R\u00e9flexions philosophiques appliqu\u00e9es aux situations de la vie courante.", contentType: "podcast", coverUrl: "/images/explore/p-philosophie-quotidien.jpg", creatorName: "Nadia Canal", creatorId: "c59", createdAt: "2026-02-14", investmentGoal: 1200, currentInvestment: 800, investorCount: 24, totalVotes: 134, isFree: true, category: "Societe", duration: "28:00", episodeCount: 18 },
  { id: "p12", title: "Musiques du Monde", description: "Voyage musical \u00e0 travers les traditions sonores de chaque continent.", contentType: "podcast", coverUrl: "/images/explore/p-musique-monde.jpg", creatorName: "Romain \u00c9pisode", creatorId: "c60", createdAt: "2026-02-16", investmentGoal: 2000, currentInvestment: 1400, investorCount: 36, totalVotes: 189, isFree: false, category: "Culture", duration: "50:00", episodeCount: 12 },
  { id: "p13", title: "Le Mental du Champion", description: "Psychologie du sport et pr\u00e9paration mentale des athl\u00e8tes de haut niveau.", contentType: "podcast", coverUrl: "/images/explore/p-sport-mental.jpg", creatorName: "Chlo\u00e9 Wave", creatorId: "c61", createdAt: "2026-02-18", investmentGoal: 2600, currentInvestment: 2000, investorCount: 47, totalVotes: 256, isFree: false, category: "Societe", duration: "36:00", episodeCount: 10 },
  { id: "p14", title: "\u00c9cologie en Action", description: "Initiatives \u00e9cologiques concr\u00e8tes et t\u00e9moignages d'acteurs du changement.", contentType: "podcast", coverUrl: "/images/explore/p-ecologie-action.jpg", creatorName: "F\u00e9lix Bande", creatorId: "c62", createdAt: "2026-02-20", investmentGoal: 1600, currentInvestment: 1100, investorCount: 29, totalVotes: 145, isFree: true, category: "Societe", duration: "44:00", episodeCount: 16 },
  { id: "p15", title: "L'Esprit Entrepreneur", description: "Parcours inspirants de cr\u00e9ateurs d'entreprises et le\u00e7ons de r\u00e9silience.", contentType: "podcast", coverUrl: "/images/explore/p-entrepreneuriat.jpg", creatorName: "Iris Talk", creatorId: "c63", createdAt: "2026-02-22", investmentGoal: 3200, currentInvestment: 2600, investorCount: 58, totalVotes: 312, isFree: false, category: "Societe", duration: "48:00", episodeCount: 7 },
  { id: "p16", title: "Cin\u00e9ma : Les Coulisses", description: "D\u00e9couverte des m\u00e9tiers et secrets de fabrication du septi\u00e8me art.", contentType: "podcast", coverUrl: "/images/explore/p-cinema-coulisses.jpg", creatorName: "Paul \u00c9mission", creatorId: "c64", createdAt: "2026-02-24", investmentGoal: 2400, currentInvestment: 1700, investorCount: 42, totalVotes: 223, isFree: false, category: "Culture", duration: "52:00", episodeCount: 9 },
]

// Tous les contenus combines (48 total)
export const ALL_CONTENTS: Content[] = [...MOCK_VIDEO_CONTENTS, ...MOCK_TEXT_CONTENTS, ...MOCK_PODCAST_CONTENTS]

// Mock investissements (montants alignes sur INVESTMENT_TIERS_EUR)
export const MOCK_INVESTMENTS: Investment[] = [
  {
    id: "inv1",
    contentId: "v1",
    contentTitle: "L'Odyssee des Etoiles",
    contentType: "video",
    amount: 15,
    votes: getVotesForInvestment(15),         // 9 votes
    visupointsEarned: getVisupointsForInvestment(15), // 80 pts
    date: "2026-01-20",
    status: "active",
    returns: 2.5,
  },
  {
    id: "inv2",
    contentId: "t1",
    contentTitle: "Les Chroniques du Temps Perdu",
    contentType: "text",
    amount: 10,
    votes: getVotesForInvestment(10),         // 7 votes
    visupointsEarned: getVisupointsForInvestment(10), // 50 pts
    date: "2026-01-22",
    status: "active",
    returns: 1.8,
  },
  {
    id: "inv3",
    contentId: "v2",
    contentTitle: "Murmures de la Foret",
    contentType: "video",
    amount: 5,
    votes: getVotesForInvestment(5),          // 4 votes
    visupointsEarned: getVisupointsForInvestment(5),  // 25 pts
    date: "2026-02-05",
    status: "active",
    returns: 0.6,
  },
  {
    id: "inv4",
    contentId: "v4",
    contentTitle: "Pages d'Amour",
    contentType: "text",
    amount: 20,
    votes: getVotesForInvestment(20),         // 10 votes
    visupointsEarned: getVisupointsForInvestment(20), // 110 pts
    date: "2026-02-10",
    status: "completed",
    returns: 5.2,
  },
]

// Mock transactions (alignees avec les formules V1)
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tr0",
    type: "caution",
    description: `Caution Investisseur (${CAUTION_EUR.investor}EUR)`,
    amount: -CAUTION_EUR.investor,
    date: "2026-01-15",
    status: "completed",
  },
  {
    id: "tr1",
    type: "investment",
    description: "Investissement 15EUR - L'Odyssee des Etoiles (9 votes, +80 pts)",
    amount: -15,
    date: "2026-01-20",
    status: "completed",
  },
  {
    id: "tr2",
    type: "investment",
    description: "Investissement 10EUR - Chroniques du Temps Perdu (7 votes, +50 pts)",
    amount: -10,
    date: "2026-01-22",
    status: "completed",
  },
  {
    id: "tr3",
    type: "return",
    description: "Retour sur investissement - L'Odyssee des Etoiles",
    amount: 2.5,
    date: "2026-02-01",
    status: "completed",
  },
  {
    id: "tr4",
    type: "investment",
    description: "Investissement 5EUR - Murmures de la Foret (4 votes, +25 pts)",
    amount: -5,
    date: "2026-02-05",
    status: "completed",
  },
  {
    id: "tr5",
    type: "investment",
    description: "Investissement 20EUR - Pages d'Amour (10 votes, +110 pts)",
    amount: -20,
    date: "2026-02-10",
    status: "completed",
  },
  {
    id: "tr6",
    type: "return",
    description: "Retour sur investissement - Pages d'Amour (rang 4, 3.41% de G)",
    amount: 5.2,
    date: "2026-02-15",
    status: "completed",
  },
]

// Catégories
export const VIDEO_CATEGORIES = [
  "Tous",
  "Court-métrage",
  "Documentaire",
  "Animation",
  "Musique",
  "Comédie",
  "Science-Fiction",
  "Drame",
]

export const TEXT_CATEGORIES = [
  "Tous",
  "Roman",
  "Nouvelles",
  "Essai",
  "Poésie",
  "Fantastique",
  "Science-Fiction",
  "Thriller",
]

export const PODCAST_CATEGORIES = [
  "Tous",
  "Societe",
  "Culture",
  "Technologie",
  "Histoire",
  "Humour",
  "Investigation",
  "Voix de l'Info",
]

// FAQ data
export const FAQ_ITEMS = [
  {
    question: "Qu'est-ce que VISUAL ?",
    answer: "VISUAL est une plateforme d'investissement participatif dans les projets audiovisuels, litteraires et podcasts. Vous pouvez soutenir des createurs et potentiellement recevoir des retours sur vos investissements.",
  },
  {
    question: "Comment fonctionne l'investissement ?",
    answer: "Vous choisissez un projet qui vous interesse, selectionnez un montant entre 2 EUR et 20 EUR (tranches : 2, 3, 4, 5, 6, 8, 10, 12, 15, 20 EUR), et devenez investisseur. Si le projet genere des revenus, vous recevez une part proportionnelle a votre investissement.",
  },
  {
    question: "Qu'est-ce que la caution ?",
    answer: "La caution est un depot unique (10 EUR pour les createurs : Porteur, Infoporteur, Podcasteur ; 20 EUR pour les investisseurs : Investisseur, Investi-lecteur, Auditeur) qui garantit votre engagement. Elle est remboursable en cas de resiliation.",
  },
  {
    question: "Comment retirer mes gains ?",
    answer: "Vos gains sont consultables dans votre Wallet. Pour retirer, vous devez connecter votre compte Stripe. Les retraits sont traités chaque semaine.",
  },
  {
    question: "Que sont les VISUpoints ?",
    answer: "Les VISUpoints sont des points de fidélité que vous gagnez en utilisant la plateforme : parrainages, partages, commentaires, etc. Ils débloquent des avantages exclusifs.",
  },
  {
    question: "Puis-je être créateur ET investisseur ?",
    answer: "Absolument ! Vous pouvez cumuler plusieurs rôles sur VISUAL. Chaque rôle nécessite sa propre caution.",
  },
]

// How it works steps
export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: "Créez votre compte",
    description: "Inscrivez-vous gratuitement et devenez Visiteur. Explorez la plateforme et gagnez des VISUpoints.",
    icon: "user",
  },
  {
    step: 2,
    title: "Choisissez votre rôle",
    description: "Devenez Porteur pour créer du contenu audiovisuel, Infoporteur pour publier des écrits, ou Investisseur pour soutenir des projets.",
    icon: "layers",
  },
  {
    step: 3,
    title: "Payez votre caution",
    description: "10€ pour les créateurs, 20€ pour les investisseurs. Cette caution est remboursable si vous résiliez votre compte.",
    icon: "shield",
  },
  {
    step: 4,
    title: "Participez et gagnez",
    description: "Créez ou investissez dans des projets. Suivez vos statistiques et retirez vos gains via Stripe Connect.",
    icon: "trending-up",
  },
]

// ---------- LEADERBOARD DATA ----------

export type LeaderboardEntry = {
  rank: number
  name: string
  score: number
  detail: string
}

function generateEntries(
  baseName: string[],
  baseScore: number,
  detailFn: (score: number) => string,
  count: number
): LeaderboardEntry[] {
  return Array.from({ length: count }, (_, i) => {
    const score = Math.max(10, Math.round(baseScore * (1 - i * 0.04) + (count - i) * 2))
    return {
      rank: i + 1,
      name: baseName[i % baseName.length] + (i >= baseName.length ? ` (${Math.floor(i / baseName.length) + 1})` : ""),
      score,
      detail: detailFn(score),
    }
  })
}

const VISITEUR_NAMES = ["Emma V.", "Hugo T.", "Clara M.", "Nathan S.", "Léa B.", "Théo R.", "Inès D.", "Lucas P.", "Manon G.", "Noah L.", "Jade K.", "Raphaël F.", "Camille S.", "Axel M.", "Zoé C.", "Arthur B.", "Louise N.", "Ethan J.", "Chloé W.", "Liam A.", "Alice H.", "Maxime T.", "Éva R.", "Tom D.", "Sarah P."]
const PORTEUR_NAMES = ["Marie Stellaire", "Lucas Nature", "Sophie Drama", "Félix Cinéma", "Amina Vision", "Paul Réal", "Lina Studio", "Yann Film", "Eva Regard", "Marco Pixel", "Nadia Caméra", "Romain Scène", "Chloé Script", "Karim Prod", "Iris Lumière", "Léo Motion", "Hana Screen", "Dario Cut", "Mila Format", "Oscar Take", "Jade Shot", "Hugo Frame", "Alice Montage", "Noah Edit", "Sara Lens"]
const INFOPORTEUR_NAMES = ["Pierre Michel", "Nora Mystère", "Claire Lettres", "André Plume", "Luna Pages", "Sami Texte", "Elsa Roman", "Marc Prose", "Julie Encre", "Youssef Chapitre", "Mina Verso", "Romain Ligne", "Élodie Style", "Tarik Récit", "Margot Fable", "Léon Essai", "Inès Poème", "David Mot", "Lana Conte", "Oscar Critique", "Jade Chronique", "Hugo Nouvelle", "Alice Saga", "Noah Tome", "Sara Verset"]
const PODCASTEUR_NAMES = ["Karim Ondes", "Lina Audio", "Thomas Voix", "Mina Podcast", "Sami Micro", "Éva Studio", "Yann Écoute", "Hana Sound", "Marco Fréquence", "Nadia Canal", "Romain Épisode", "Chloé Wave", "Félix Bande", "Iris Talk", "Paul Émission", "Léo Direct", "Dario Cast", "Mila Capsule", "Oscar Pod", "Jade Stream", "Hugo Série", "Alice Show", "Noah Radio", "Sara Live", "Tom Replay"]

export const LEADERBOARD_CATEGORIES = [
  { key: "porteur" as const, label: "TOP Porteur", color: "text-red-400", bgColor: "bg-red-500/20", borderColor: "border-red-500/30" },
  { key: "infoporteur" as const, label: "TOP Infoporteur", color: "text-sky-400", bgColor: "bg-sky-500/20", borderColor: "border-sky-500/30" },
  { key: "podcasteur" as const, label: "TOP Podcasteur", color: "text-purple-400", bgColor: "bg-purple-500/20", borderColor: "border-purple-500/30" },
] as const

export type LeaderboardCategoryKey = typeof LEADERBOARD_CATEGORIES[number]["key"]

export const LEADERBOARD_DATA: Record<LeaderboardCategoryKey, LeaderboardEntry[]> = {
  porteur: generateEntries(PORTEUR_NAMES, 15600, (s) => `${s.toLocaleString()}\u20ac collect\u00e9s`, 500),
  infoporteur: generateEntries(INFOPORTEUR_NAMES, 9800, (s) => `${s.toLocaleString()}\u20ac collect\u00e9s`, 500),
  podcasteur: generateEntries(PODCASTEUR_NAMES, 8200, (s) => `${s.toLocaleString()}\u20ac collect\u00e9s`, 500),
}

// Current user mock rankings (for dashboard)
export const USER_RANKINGS: Record<LeaderboardCategoryKey, number> = {
  porteur: 128,
  infoporteur: 256,
  podcasteur: 87,
}
