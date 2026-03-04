"use client"

import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useState, useMemo, Suspense } from "react"
import {
  Search, Film, FileText, Mic, Compass, SlidersHorizontal, Eye, UserPlus,
  ChevronLeft, ChevronRight, Play, TrendingUp, Users, Clock, BookOpen, Headphones
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { VisualSlogan } from "@/components/visual-slogan"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { VisualHeader } from "@/components/visual-header"
import { Footer } from "@/components/footer"
import { ReportButton } from "@/components/report-button"
import {
  ALL_CONTENTS,
  VIDEO_CATEGORIES,
  TEXT_CATEGORIES,
  PODCAST_CATEGORIES,
  type ContentType,
  type Content,
} from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

const ITEMS_PER_PAGE = 16

/* ---------- Hero Banner ---------- */
function HeroBanner({ content, typeLabel }: { content: Content; typeLabel: string }) {
  return (
    <div className="relative w-full h-[340px] sm:h-[400px] rounded-2xl overflow-hidden mb-8">
      <Image
        src={content.coverUrl || "/placeholder.svg"}
        alt={content.title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
        <Badge className="w-fit mb-3 bg-emerald-600/90 text-white border-0 text-xs tracking-wider uppercase">
          {typeLabel}
        </Badge>
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 max-w-xl text-balance">
          {content.title}
        </h2>
        <p className="text-white/70 text-sm sm:text-base max-w-lg line-clamp-2 mb-4">
          {content.description}
        </p>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-white/50 text-sm">par {content.creatorName}</span>
          <span className="text-white/20">|</span>
          <span className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
            <Users className="h-3.5 w-3.5" />
            {content.investorCount} investisseurs
          </span>
          <span className="text-white/20">|</span>
          <span className="text-emerald-400 text-sm font-medium">
            {Math.round((content.currentInvestment / content.investmentGoal) * 100)}% financ\u00e9
          </span>
        </div>
        <div className="flex gap-3">
          <Link href={`/video/${content.id}`}>
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">
              <Play className="h-4 w-4 mr-2 fill-current" />
              D\u00e9couvrir
            </Button>
          </Link>
          <Link href={`/video/${content.id}`}>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-white/5">
              <TrendingUp className="h-4 w-4 mr-2" />
              Investir
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ---------- Streaming Card ---------- */
function StreamingCard({ content }: { content: Content }) {
  const { isAuthed } = useAuth()
  const progressPercent = Math.min((content.currentInvestment / content.investmentGoal) * 100, 100)
  const cType = content.contentType

  const badgeConfig = {
    video: { bg: "bg-red-600/90", icon: Film, label: "Vid\u00e9o" },
    text: { bg: "bg-amber-600/90", icon: FileText, label: "\u00c9crit" },
    podcast: { bg: "bg-purple-600/90", icon: Mic, label: "Podcast" },
  }[cType]

  return (
    <Link href={`/video/${content.id}`} className="group block">
      <div className="relative rounded-xl overflow-hidden bg-slate-900/60 border border-white/5 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/15 hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={content.coverUrl || "/placeholder.svg"}
            alt={content.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          {/* Badge type */}
          <Badge className={`absolute top-2.5 left-2.5 ${badgeConfig.bg} text-white border-0 text-[10px] px-2 py-0.5`}>
            <badgeConfig.icon className="h-2.5 w-2.5 mr-1" />
            {badgeConfig.label}
          </Badge>

          {/* Free / Lock */}
          {content.isFree && (
            <Badge className="absolute top-2.5 right-2.5 bg-emerald-600/90 text-white border-0 text-[10px] px-2 py-0.5">
              Gratuit
            </Badge>
          )}

          {/* Duration / Meta */}
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-white/90 text-[11px] bg-black/70 px-2 py-0.5 rounded-md backdrop-blur-sm">
            {cType === "video" && <><Clock className="h-3 w-3" />{content.duration}</>}
            {cType === "text" && <><BookOpen className="h-3 w-3" />{content.wordCount?.toLocaleString()} mots</>}
            {cType === "podcast" && <><Headphones className="h-3 w-3" />{content.episodeCount} ep.</>}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Play className="h-5 w-5 text-white fill-white" />
            </div>
          </div>
        </div>

        {/* Content info */}
        <div className="p-3.5 space-y-2">
          <h3 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-emerald-400 transition-colors">
            {content.title}
          </h3>
          <p className="text-white/50 text-xs">{content.creatorName}</p>

          {/* Progress bar */}
          <div className="space-y-1">
            <Progress value={progressPercent} className="h-1.5 bg-slate-800" />
            <div className="flex justify-between text-[10px] text-white/40">
              <span className="text-emerald-400 font-medium">{content.currentInvestment.toLocaleString()}\u20ac</span>
              <span>sur {content.investmentGoal.toLocaleString()}\u20ac</span>
            </div>
          </div>

          {/* Investors + Report */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] text-white/40">
              <Users className="h-3 w-3" />
              <span>{content.investorCount}</span>
            </div>
            {isAuthed && (
              <div onClick={(e) => e.preventDefault()}>
                <ReportButton
                  targetId={content.id}
                  targetType="content"
                  targetName={content.title}
                  variant="minimal"
                  size="sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ---------- Pagination ---------- */
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push("...")
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 w-9 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getPageNumbers().map((page, idx) =>
        typeof page === "string" ? (
          <span key={`dots-${idx}`} className="w-9 h-9 flex items-center justify-center text-white/30 text-sm">
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant="ghost"
            onClick={() => onPageChange(page)}
            className={`h-9 w-9 text-sm font-medium transition-all ${
              page === currentPage
                ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/30"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-9 w-9 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <span className="ml-4 text-white/30 text-xs">
        Page {currentPage} sur {totalPages}
      </span>
    </div>
  )
}

/* ---------- Main Page ---------- */
function ExploreContent() {
  const { isAuthed } = useAuth()
  const searchParams = useSearchParams()
  const initialType = searchParams.get("type") as ContentType | null

  const [activeFilter, setActiveFilter] = useState<ContentType | "all">(initialType || "all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [sortBy, setSortBy] = useState("recent")
  const [currentPage, setCurrentPage] = useState(1)

  const categories =
    activeFilter === "video" ? VIDEO_CATEGORIES
    : activeFilter === "text" ? TEXT_CATEGORIES
    : activeFilter === "podcast" ? PODCAST_CATEGORIES
    : ["Tous"]

  const typeLabels: Record<string, string> = {
    all: "Tous les projets",
    video: "Explorer Vid\u00e9o",
    text: "Explorer \u00c9crit",
    podcast: "Explorer Podcast",
  }

  const filteredContents = useMemo(() => {
    let contents = ALL_CONTENTS

    if (activeFilter !== "all") {
      contents = contents.filter((c) => c.contentType === activeFilter)
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      contents = contents.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.creatorName.toLowerCase().includes(query)
      )
    }
    if (selectedCategory !== "Tous") {
      contents = contents.filter((c) => c.category === selectedCategory)
    }

    switch (sortBy) {
      case "popular":
        contents = [...contents].sort((a, b) => b.investorCount - a.investorCount)
        break
      case "funded":
        contents = [...contents].sort(
          (a, b) => b.currentInvestment / b.investmentGoal - a.currentInvestment / a.investmentGoal
        )
        break
      case "recent":
      default:
        contents = [...contents].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    }

    return contents
  }, [activeFilter, searchQuery, selectedCategory, sortBy])

  const totalPages = Math.ceil(filteredContents.length / ITEMS_PER_PAGE)
  const paginatedContents = filteredContents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Hero content = highest funded content of current type
  const heroContent = useMemo(() => {
    const pool = activeFilter !== "all"
      ? ALL_CONTENTS.filter((c) => c.contentType === activeFilter)
      : ALL_CONTENTS
    return [...pool].sort((a, b) => b.investorCount - a.investorCount)[0] || null
  }, [activeFilter])

  const handleFilterChange = (filter: ContentType | "all") => {
    setActiveFilter(filter)
    setSelectedCategory("Tous")
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 420, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <VisualHeader />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {typeLabels[activeFilter]}
              </h1>
              <span className="hidden sm:block text-white/15">|</span>
              <VisualSlogan size="xs" opacity="medium" />
            </div>
            <p className="text-white/50 text-sm">
              {"D\u00e9couvrez et investissez dans des projets audiovisuels, litt\u00e9raires et podcasts uniques"}
            </p>
          </div>

          {/* Guest Banner */}
          {!isAuthed && (
            <div className="mb-6 p-4 bg-slate-900/80 border border-slate-700/50 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center shrink-0">
                  <Eye className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{"Vous naviguez en tant qu'invit\u00e9"}</p>
                  <p className="text-white/50 text-xs">{"Seuls les contenus gratuits et les extraits sont accessibles. Inscrivez-vous pour d\u00e9bloquer toute la plateforme."}</p>
                </div>
              </div>
              <Link href="/signup" className="shrink-0">
                <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white">
                  <UserPlus className="mr-2 h-4 w-4" />
                  {"S'inscrire"}
                </Button>
              </Link>
            </div>
          )}

          {/* Type Filter Tabs */}
          <div className="flex gap-1.5 mb-6 p-1 bg-slate-900/60 rounded-xl w-fit border border-white/5">
            {[
              { key: "all" as const, icon: Compass, label: "Tout", active: "bg-emerald-600" },
              { key: "video" as const, icon: Film, label: "Vid\u00e9o", active: "bg-red-600" },
              { key: "text" as const, icon: FileText, label: "\u00c9crit", active: "bg-amber-600" },
              { key: "podcast" as const, icon: Mic, label: "Podcast", active: "bg-purple-600" },
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={activeFilter === tab.key ? "default" : "ghost"}
                onClick={() => handleFilterChange(tab.key)}
                className={
                  activeFilter === tab.key
                    ? `${tab.active} text-white shadow-lg`
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Hero Banner */}
          {heroContent && <HeroBanner content={heroContent} typeLabel={typeLabels[activeFilter]} />}

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
              <Input
                placeholder="Rechercher un projet, un cr\u00e9ateur..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                className="pl-10 bg-slate-900/60 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500/50 h-11"
              />
            </div>
            <div className="flex gap-2">
              {activeFilter !== "all" && (
                <Select value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v); setCurrentPage(1) }}>
                  <SelectTrigger className="w-[180px] bg-slate-900/60 border-white/10 text-white h-11">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Cat\u00e9gorie" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-white focus:bg-emerald-600/30 focus:text-white">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[180px] bg-slate-900/60 border-white/10 text-white h-11">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  <SelectItem value="recent" className="text-white focus:bg-emerald-600/30 focus:text-white">Plus r\u00e9cents</SelectItem>
                  <SelectItem value="popular" className="text-white focus:bg-emerald-600/30 focus:text-white">Plus populaires</SelectItem>
                  <SelectItem value="funded" className="text-white focus:bg-emerald-600/30 focus:text-white">Mieux financ\u00e9s</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-sm">
              {filteredContents.length} projet{filteredContents.length > 1 ? "s" : ""} trouv\u00e9{filteredContents.length > 1 ? "s" : ""}
            </p>
            {totalPages > 1 && (
              <p className="text-white/30 text-xs">
                Page {currentPage} sur {totalPages}
              </p>
            )}
          </div>

          {/* Content Grid -- Streaming Layout */}
          {paginatedContents.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {paginatedContents.map((content) => (
                <StreamingCard key={content.id} content={content} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-slate-900/50 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-white/30" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Aucun projet trouv\u00e9</h3>
              <p className="text-white/50 text-sm">Essayez de modifier vos filtres ou votre recherche</p>
            </div>
          )}

          {/* Numbered Pagination Bar */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <ExploreContent />
    </Suspense>
  )
}
