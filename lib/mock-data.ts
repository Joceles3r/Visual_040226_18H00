// Types de contenu
export type ContentType = "video" | "text"

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
  isFree: boolean
  category: string
  duration?: string // Pour les vidéos
  wordCount?: number // Pour les écrits
}

export interface Investment {
  id: string
  contentId: string
  contentTitle: string
  contentType: ContentType
  amount: number
  date: string
  status: "active" | "completed" | "refunded"
  returns: number
}

export interface Transaction {
  id: string
  type: "investment" | "deposit" | "withdrawal" | "return" | "visupoints"
  description: string
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
    description: "Une comédie dramatique touchante sur les rencontres improbables.",
    contentType: "video",
    coverUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=450&fit=crop",
    creatorName: "Sophie Drama",
    creatorId: "c3",
    createdAt: "2026-02-01",
    investmentGoal: 2000,
    currentInvestment: 500,
    investorCount: 12,
    isFree: true,
    category: "Comédie",
    duration: "12:30",
  },
  {
    id: "v4",
    title: "Rythmes Urbains",
    description: "Un clip musical capturant l'énergie vibrante des rues de Paris.",
    contentType: "video",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=450&fit=crop",
    creatorName: "DJ Rhythm",
    creatorId: "c4",
    createdAt: "2026-02-02",
    investmentGoal: 1500,
    currentInvestment: 1500,
    investorCount: 34,
    isFree: false,
    category: "Musique",
    duration: "4:20",
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
    coverUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop",
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

// Mock investissements
export const MOCK_INVESTMENTS: Investment[] = [
  {
    id: "inv1",
    contentId: "v1",
    contentTitle: "L'Odyssée des Étoiles",
    contentType: "video",
    amount: 15,
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
    date: "2026-01-22",
    status: "active",
    returns: 1.8,
  },
]

// Mock transactions
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tr1",
    type: "investment",
    description: "Investissement - L'Odyssée des Étoiles",
    amount: -15,
    date: "2026-01-20",
    status: "completed",
  },
  {
    id: "tr2",
    type: "return",
    description: "Retour sur investissement - L'Odyssée des Étoiles",
    amount: 2.5,
    date: "2026-02-01",
    status: "completed",
  },
  {
    id: "tr3",
    type: "visupoints",
    description: "Bonus VISUpoints - Parrainage",
    amount: 50,
    date: "2026-01-25",
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

// FAQ data
export const FAQ_ITEMS = [
  {
    question: "Qu'est-ce que VISUAL ?",
    answer: "VISUAL est une plateforme d'investissement participatif dans les projets audiovisuels et littéraires. Vous pouvez soutenir des créateurs et potentiellement recevoir des retours sur vos investissements.",
  },
  {
    question: "Comment fonctionne l'investissement ?",
    answer: "Vous choisissez un projet qui vous intéresse, sélectionnez un montant entre 1€ et 20€, et devenez investisseur. Si le projet génère des revenus, vous recevez une part proportionnelle à votre investissement.",
  },
  {
    question: "Qu'est-ce que la caution ?",
    answer: "La caution est un dépôt unique (10€ pour les créateurs, 20€ pour les investisseurs) qui garantit votre engagement sur la plateforme. Elle est remboursable en cas de résiliation de votre compte.",
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
