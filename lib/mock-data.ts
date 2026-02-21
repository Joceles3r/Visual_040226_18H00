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

// Mock contenus audiovisuels
export const MOCK_VIDEO_CONTENTS: Content[] = [
  {
    id: "v1",
    title: "L'Odyssée des Étoiles",
    description: "Un court-métrage de science-fiction époustouflant explorant les confins de l'univers.",
    contentType: "video",
    coverUrl: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&h=450&fit=crop",
    creatorName: "Marie Stellaire",
    creatorId: "c1",
    createdAt: "2026-01-15",
    investmentGoal: 5000,
    currentInvestment: 3200,
    investorCount: 47,
    totalVotes: 312,
    isFree: false,
    category: "Science-Fiction",
    duration: "18:45",
  },
  {
    id: "v2",
    title: "Murmures de la Forêt",
    description: "Documentaire immersif sur la biodiversité cachée des forêts tropicales.",
    contentType: "video",
    coverUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=450&fit=crop",
    creatorName: "Lucas Nature",
    creatorId: "c2",
    createdAt: "2026-01-20",
    investmentGoal: 3000,
    currentInvestment: 2800,
    investorCount: 89,
    isFree: false,
    category: "Documentaire",
    duration: "32:10",
  },
  {
    id: "v3",
    title: "Le Dernier Café",
    description: "Un podcast captivant sur les rencontres improbables autour d'un café, ou chaque episode explore une histoire humaine unique.",
    contentType: "podcast",
    coverUrl: "/images/podcast-studio.jpg",
    creatorName: "Sophie Drama",
    creatorId: "c3",
    createdAt: "2026-02-01",
    investmentGoal: 2000,
    currentInvestment: 500,
    investorCount: 12,
    isFree: true,
    category: "Societe",
    duration: "45:00",
    episodeCount: 8,
  },
  {
    id: "v4",
    title: "Pages d'Amour",
    description: "Un recueil poetique sur la magie des rencontres litteraires.",
    contentType: "text",
    coverUrl: "/images/woman-reading-books.jpg",
    creatorName: "Claire Lettres",
    creatorId: "c4",
    createdAt: "2026-02-02",
    investmentGoal: 1500,
    currentInvestment: 1500,
    investorCount: 34,
    isFree: false,
    category: "Poésie",
    wordCount: 12000,
  },
]

// Mock contenus littéraires
export const MOCK_TEXT_CONTENTS: Content[] = [
  {
    id: "t1",
    title: "Les Chroniques du Temps Perdu",
    description: "Un roman fantastique captivant où le temps n'est qu'une illusion.",
    contentType: "text",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=450&fit=crop",
    creatorName: "Pierre Écrivain",
    creatorId: "c5",
    createdAt: "2026-01-10",
    investmentGoal: 2000,
    currentInvestment: 1800,
    investorCount: 62,
    isFree: false,
    category: "Fantastique",
    wordCount: 85000,
  },
  {
    id: "t2",
    title: "Réflexions sur l'IA",
    description: "Un essai philosophique sur notre cohabitation avec l'intelligence artificielle.",
    contentType: "text",
    coverUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=450&fit=crop",
    creatorName: "Dr. Emma Pensée",
    creatorId: "c6",
    createdAt: "2026-01-25",
    investmentGoal: 1000,
    currentInvestment: 750,
    investorCount: 28,
    isFree: true,
    category: "Essai",
    wordCount: 15000,
  },
  {
    id: "t3",
    title: "Contes de Minuit",
    description: "Une collection de nouvelles mystérieuses à lire quand la nuit tombe.",
    contentType: "text",
    coverUrl: "/images/woman-author-portrait.jpg",
    creatorName: "Nora Mystère",
    creatorId: "c7",
    createdAt: "2026-02-03",
    investmentGoal: 1500,
    currentInvestment: 400,
    investorCount: 15,
    isFree: false,
    category: "Nouvelles",
    wordCount: 45000,
  },
]

// Tous les contenus combinés
export const ALL_CONTENTS: Content[] = [...MOCK_VIDEO_CONTENTS, ...MOCK_TEXT_CONTENTS]

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

// Leaderboard data
export const LEADERBOARD_DATA = {
  topInvestors: [
    { rank: 1, name: "Alexandre M.", amount: 2450, projects: 34 },
    { rank: 2, name: "Sophie L.", amount: 1890, projects: 28 },
    { rank: 3, name: "Thomas R.", amount: 1650, projects: 45 },
    { rank: 4, name: "Julie P.", amount: 1420, projects: 22 },
    { rank: 5, name: "Marc D.", amount: 1180, projects: 19 },
  ],
  topCreators: [
    { rank: 1, name: "Marie Stellaire", projects: 8, totalRaised: 15600 },
    { rank: 2, name: "Lucas Nature", projects: 5, totalRaised: 12400 },
    { rank: 3, name: "Pierre Écrivain", projects: 12, totalRaised: 9800 },
    { rank: 4, name: "Sophie Drama", projects: 4, totalRaised: 7200 },
    { rank: 5, name: "Nora Mystère", projects: 6, totalRaised: 5900 },
  ],
  topVisupoints: [
    { rank: 1, name: "Emma V.", points: 4850 },
    { rank: 2, name: "Hugo T.", points: 3920 },
    { rank: 3, name: "Clara M.", points: 3410 },
    { rank: 4, name: "Nathan S.", points: 2890 },
    { rank: 5, name: "Léa B.", points: 2650 },
  ],
}
