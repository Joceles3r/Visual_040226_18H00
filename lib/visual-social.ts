"use client"

// ─── Visual Social Engine ───
// Mini-reseau social interne a VISUAL
// Mode B : tags pre-approuves, 280 chars max, reactions custom, pas de liens/images

import type { VisualRole } from "@/components/navigation"

// ─── Types ───

export type ReactionType = "clap" | "fire" | "idea" | "heart" | "star"

export interface SocialReaction {
  type: ReactionType
  count: number
  hasReacted: boolean
}

export interface SocialTag {
  id: string
  slug: string
  label: string
  category: "genre" | "mood" | "platform" | "event"
  color: string
}

export interface SocialPost {
  id: string
  authorId: string
  authorName: string
  authorRole: VisualRole
  content: string
  tags: SocialTag[]
  reactions: Record<ReactionType, SocialReaction>
  createdAt: string
  reportCount: number
  isHidden: boolean
}

export interface SocialFeedFilters {
  tag?: string
  role?: VisualRole
}

// ─── Reaction Config ───

export const REACTION_CONFIG: Record<ReactionType, {
  label: string
  icon: string
  color: string
  visupoints: number
}> = {
  clap:  { label: "Bravo",       icon: "👏", color: "text-amber-400",   visupoints: 2 },
  fire:  { label: "Feu",         icon: "🔥", color: "text-orange-400",  visupoints: 2 },
  idea:  { label: "Inspirant",   icon: "💡", color: "text-yellow-300",  visupoints: 3 },
  heart: { label: "Coup de coeur", icon: "❤️", color: "text-red-400",   visupoints: 2 },
  star:  { label: "Star",        icon: "⭐", color: "text-emerald-400", visupoints: 3 },
}

export const REACTION_TYPES = Object.keys(REACTION_CONFIG) as ReactionType[]

// ─── Constants ───

export const MAX_POST_LENGTH = 280
export const MAX_TAGS_PER_POST = 3
export const MAX_POSTS_PER_DAY = 5
export const VISUPOINTS_PER_POST = 5
export const VISUPOINTS_PER_REACTION_RECEIVED = 1
export const REPORT_THRESHOLD_HIDE = 5
export const COOLDOWN_BETWEEN_POSTS_MS = 60_000 // 1 minute

// ─── Official Tags ───

export const OFFICIAL_TAGS: SocialTag[] = [
  // Genre
  { id: "t1",  slug: "cinema-inde",       label: "#Cin\u00e9maInd\u00e9",       category: "genre",    color: "bg-red-500/20 text-red-400 border-red-500/30" },
  { id: "t2",  slug: "documentaire",      label: "#Documentaire",      category: "genre",    color: "bg-sky-500/20 text-sky-400 border-sky-500/30" },
  { id: "t3",  slug: "court-metrage",     label: "#CourtM\u00e9trage",     category: "genre",    color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  { id: "t4",  slug: "thriller",          label: "#Thriller",          category: "genre",    color: "bg-slate-500/20 text-slate-300 border-slate-500/30" },
  { id: "t5",  slug: "comedie",           label: "#Com\u00e9die",           category: "genre",    color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
  { id: "t6",  slug: "sf-fantasy",        label: "#SFFantasy",         category: "genre",    color: "bg-violet-500/20 text-violet-400 border-violet-500/30" },
  { id: "t7",  slug: "drame",             label: "#Drame",             category: "genre",    color: "bg-rose-500/20 text-rose-400 border-rose-500/30" },
  // Mood
  { id: "t8",  slug: "coup-de-coeur",     label: "#CoupDeCoeur",       category: "mood",     color: "bg-red-500/20 text-red-400 border-red-500/30" },
  { id: "t9",  slug: "a-decouvrir",       label: "#AD\u00e9couvrir",       category: "mood",     color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  { id: "t10", slug: "pepite",            label: "#P\u00e9pite",            category: "mood",     color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  { id: "t11", slug: "emotion-forte",     label: "#\u00c9motionForte",     category: "mood",     color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  // Platform
  { id: "t12", slug: "visual-original",   label: "#VisualOriginal",    category: "platform", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  { id: "t13", slug: "premier-projet",    label: "#PremierProjet",     category: "platform", color: "bg-teal-500/20 text-teal-400 border-teal-500/30" },
  { id: "t14", slug: "top-investissement",label: "#TopInvestissement", category: "platform", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  { id: "t15", slug: "nouveau-talent",    label: "#NouveauTalent",     category: "platform", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  // Events
  { id: "t16", slug: "visual-awards",     label: "#VisualAwards",      category: "event",    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { id: "t17", slug: "festival",          label: "#Festival",          category: "event",    color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  { id: "t18", slug: "live-visual",       label: "#LiveVisual",        category: "event",    color: "bg-red-500/20 text-red-400 border-red-500/30" },
]

export const TAG_CATEGORIES = [
  { key: "genre" as const, label: "Genres" },
  { key: "mood" as const, label: "Ambiances" },
  { key: "platform" as const, label: "Plateforme" },
  { key: "event" as const, label: "\u00c9v\u00e9nements" },
] as const

// ─── Role config for social ───

export const ROLE_SOCIAL_CONFIG: Record<string, {
  canPost: boolean
  canReact: boolean
  badgeColor: string
  badgeLabel: string
}> = {
  guest:          { canPost: false, canReact: false, badgeColor: "bg-slate-600",   badgeLabel: "Invit\u00e9" },
  visitor:        { canPost: true,  canReact: true,  badgeColor: "bg-emerald-600", badgeLabel: "Visiteur" },
  listener:       { canPost: true,  canReact: true,  badgeColor: "bg-sky-600",     badgeLabel: "Auditeur" },
  investireader:  { canPost: true,  canReact: true,  badgeColor: "bg-indigo-600",  badgeLabel: "Investi-lecteur" },
  porter:         { canPost: true,  canReact: true,  badgeColor: "bg-red-600",     badgeLabel: "Porteur" },
  infoporter:     { canPost: true,  canReact: true,  badgeColor: "bg-sky-600",     badgeLabel: "Infoporteur" },
  podcaster:      { canPost: true,  canReact: true,  badgeColor: "bg-purple-600",  badgeLabel: "Podcasteur" },
  investor:       { canPost: true,  canReact: true,  badgeColor: "bg-amber-600",   badgeLabel: "Investisseur" },
}

// ─── Mock Data ───

const MOCK_AUTHORS: { name: string; role: VisualRole }[] = [
  { name: "Marie C.", role: "visitor" },
  { name: "Lucas D.", role: "porter" },
  { name: "Sophie M.", role: "investor" },
  { name: "Thomas B.", role: "listener" },
  { name: "Julie R.", role: "podcaster" },
  { name: "Alex P.", role: "infoporter" },
  { name: "Camille V.", role: "visitor" },
  { name: "Nathan L.", role: "porter" },
]

function randomReactions(): Record<ReactionType, SocialReaction> {
  return {
    clap:  { type: "clap",  count: Math.floor(Math.random() * 30), hasReacted: false },
    fire:  { type: "fire",  count: Math.floor(Math.random() * 20), hasReacted: false },
    idea:  { type: "idea",  count: Math.floor(Math.random() * 15), hasReacted: false },
    heart: { type: "heart", count: Math.floor(Math.random() * 25), hasReacted: false },
    star:  { type: "star",  count: Math.floor(Math.random() * 10), hasReacted: false },
  }
}

function pickTags(count: number): SocialTag[] {
  const shuffled = [...OFFICIAL_TAGS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

const MOCK_POSTS_CONTENT = [
  "Je viens de d\u00e9couvrir un court-m\u00e9trage incroyable sur VISUAL. La photographie est magnifique, chaque plan raconte une histoire. Bravo au porteur !",
  "Premi\u00e8re fois que j'investis sur un projet documentaire. Le pitch m'a convaincu d\u00e8s les premi\u00e8res lignes. H\u00e2te de voir le r\u00e9sultat final !",
  "Le podcast \u00abVoix du Cin\u00e9ma\u00bb est une p\u00e9pite. Deux \u00e9pisodes \u00e9cout\u00e9s d'affil\u00e9e, l'analyse des techniques de narration est passionnante.",
  "Mon projet vient d'atteindre 75% de financement ! Merci \u00e0 tous les investisseurs. Le tournage commence dans 3 semaines.",
  "Quelqu'un a vu \u00abLumi\u00e8res de Belleville\u00bb ? L'esth\u00e9tique est folle, c'est du pur cin\u00e9ma d'auteur.",
  "Apr\u00e8s 6 mois sur VISUAL, je suis pass\u00e9 de simple visiteur \u00e0 investisseur. La communaut\u00e9 ici est vraiment unique.",
  "Nouvelle sur la plateforme ! Impressionn\u00e9e par la qualit\u00e9 des projets propos\u00e9s. Par o\u00f9 commencer ?",
  "Le syst\u00e8me de VISUpoints m'a motiv\u00e9 \u00e0 d\u00e9couvrir des genres que je n'aurais jamais regard\u00e9s. Le documentaire sur l'art urbain est une claque.",
  "En tant que podcasteur, Visual Social c'est exactement ce qu'il manquait pour \u00e9changer avec notre communaut\u00e9.",
  "La s\u00e9lection du mois est incroyable. 3 courts-m\u00e9trages que je recommande les yeux ferm\u00e9s.",
  "Premi\u00e8re exp\u00e9rience en tant que porteur de projet. L'accompagnement est top et le retour des investisseurs tr\u00e8s constructif.",
  "Ce thriller psychologique m'a scotch\u00e9. Le twist final est magistral. Courez le voir !",
]

export const MOCK_SOCIAL_POSTS: SocialPost[] = MOCK_POSTS_CONTENT.map((content, i) => {
  const author = MOCK_AUTHORS[i % MOCK_AUTHORS.length]
  const daysAgo = Math.floor(Math.random() * 7)
  const hoursAgo = Math.floor(Math.random() * 24)
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  date.setHours(date.getHours() - hoursAgo)
  return {
    id: `sp-${i + 1}`,
    authorId: `user-${i + 1}`,
    authorName: author.name,
    authorRole: author.role,
    content,
    tags: pickTags(Math.floor(Math.random() * 3) + 1),
    reactions: randomReactions(),
    createdAt: date.toISOString(),
    reportCount: 0,
    isHidden: false,
  }
}).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

// ─── Trending Tags ───

export function getTrendingTags(posts: SocialPost[]): (SocialTag & { count: number })[] {
  const tagCount: Record<string, number> = {}
  for (const post of posts) {
    for (const tag of post.tags) {
      tagCount[tag.id] = (tagCount[tag.id] || 0) + 1
    }
  }
  return OFFICIAL_TAGS.map((tag) => ({
    ...tag,
    count: tagCount[tag.id] || 0,
  }))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
}

// ─── Validation ───

export function validatePost(content: string, tags: SocialTag[]): { valid: boolean; error?: string } {
  const trimmed = content.trim()
  if (trimmed.length === 0) return { valid: false, error: "Le message ne peut pas \u00eatre vide." }
  if (trimmed.length > MAX_POST_LENGTH) return { valid: false, error: `Maximum ${MAX_POST_LENGTH} caract\u00e8res.` }
  if (tags.length > MAX_TAGS_PER_POST) return { valid: false, error: `Maximum ${MAX_TAGS_PER_POST} tags.` }
  if (/https?:\/\//i.test(trimmed)) return { valid: false, error: "Les liens externes ne sont pas autoris\u00e9s." }
  if (/<[^>]*>/.test(trimmed)) return { valid: false, error: "Le HTML n'est pas autoris\u00e9." }
  return { valid: true }
}

// ─── Time formatting ───

export function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = now - then
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return "\u00c0 l'instant"
  if (mins < 60) return `il y a ${mins}min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `il y a ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `il y a ${days}j`
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
}
