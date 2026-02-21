"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState, useMemo, Suspense } from "react"
import { Search, Film, FileText, Mic, Compass, SlidersHorizontal, Eye, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { VisualHeader } from "@/components/visual-header"
import { Footer } from "@/components/footer"
import { ContentCard } from "@/components/content-card"
import {
  ALL_CONTENTS,
  VIDEO_CATEGORIES,
  TEXT_CATEGORIES,
  PODCAST_CATEGORIES,
  type ContentType,
} from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

function ExploreContent() {
  const { isAuthed } = useAuth()
  const searchParams = useSearchParams()
  const initialType = searchParams.get("type") as ContentType | null

  const [activeFilter, setActiveFilter] = useState<ContentType | "all">(
    initialType || "all"
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [sortBy, setSortBy] = useState("recent")

  const categories =
    activeFilter === "video"
      ? VIDEO_CATEGORIES
      : activeFilter === "text"
        ? TEXT_CATEGORIES
        : activeFilter === "podcast"
          ? PODCAST_CATEGORIES
          : ["Tous"]

  const filteredContents = useMemo(() => {
    let contents = ALL_CONTENTS

    // Filter by type
    if (activeFilter !== "all") {
      contents = contents.filter((c) => c.contentType === activeFilter)
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      contents = contents.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.creatorName.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (selectedCategory !== "Tous") {
      contents = contents.filter((c) => c.category === selectedCategory)
    }

    // Sort
    switch (sortBy) {
      case "popular":
        contents = [...contents].sort(
          (a, b) => b.investorCount - a.investorCount
        )
        break
      case "funded":
        contents = [...contents].sort(
          (a, b) =>
            b.currentInvestment / b.investmentGoal -
            a.currentInvestment / a.investmentGoal
        )
        break
      case "recent":
      default:
        contents = [...contents].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    }

    return contents
  }, [activeFilter, searchQuery, selectedCategory, sortBy])

  return (
    <div className="min-h-screen">
      <VisualHeader />

      <main className="pt-28 pb-20 cinema-section">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Explorer
            </h1>
            <p className="text-white/60">
              Découvrez et investissez dans des projets audiovisuels et
              littéraires uniques
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
                  <p className="text-white font-medium text-sm">Vous naviguez en tant qu'invite</p>
                  <p className="text-white/50 text-xs">Seuls les contenus gratuits et les extraits sont accessibles. Inscrivez-vous pour debloquer toute la plateforme.</p>
                </div>
              </div>
              <Link href="/signup" className="shrink-0">
                <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white">
                  <UserPlus className="mr-2 h-4 w-4" />
                  S'inscrire
                </Button>
              </Link>
            </div>
          )}

          {/* Type Filter Tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-slate-900/50 rounded-lg w-fit">
            <Button
              variant={activeFilter === "all" ? "default" : "ghost"}
              onClick={() => {
                setActiveFilter("all")
                setSelectedCategory("Tous")
              }}
              className={
                activeFilter === "all"
                  ? "bg-emerald-600 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }
            >
              <Compass className="h-4 w-4 mr-2" />
              Tout
            </Button>
            <Button
              variant={activeFilter === "video" ? "default" : "ghost"}
              onClick={() => {
                setActiveFilter("video")
                setSelectedCategory("Tous")
              }}
              className={
                activeFilter === "video"
                  ? "bg-red-600 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }
            >
              <Film className="h-4 w-4 mr-2" />
              Vidéo
            </Button>
            <Button
              variant={activeFilter === "text" ? "default" : "ghost"}
              onClick={() => {
                setActiveFilter("text")
                setSelectedCategory("Tous")
              }}
              className={
                activeFilter === "text"
                  ? "bg-amber-600 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }
            >
              <FileText className="h-4 w-4 mr-2" />
              Écrit
            </Button>
            <Button
              variant={activeFilter === "podcast" ? "default" : "ghost"}
              onClick={() => {
                setActiveFilter("podcast")
                setSelectedCategory("Tous")
              }}
              className={
                activeFilter === "podcast"
                  ? "bg-purple-600 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }
            >
              <Mic className="h-4 w-4 mr-2" />
              Podcast
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input
                placeholder="Rechercher un projet, un créateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-900/50 border-white/10 text-white placeholder:text-white/40 focus:border-emerald-500/50"
              />
            </div>

            <div className="flex gap-2">
              {activeFilter !== "all" && (
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-[180px] bg-slate-900/50 border-white/10 text-white">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className="text-white focus:bg-emerald-600/30 focus:text-white"
                      >
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-slate-900/50 border-white/10 text-white">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  <SelectItem
                    value="recent"
                    className="text-white focus:bg-emerald-600/30 focus:text-white"
                  >
                    Plus récents
                  </SelectItem>
                  <SelectItem
                    value="popular"
                    className="text-white focus:bg-emerald-600/30 focus:text-white"
                  >
                    Plus populaires
                  </SelectItem>
                  <SelectItem
                    value="funded"
                    className="text-white focus:bg-emerald-600/30 focus:text-white"
                  >
                    Mieux financés
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results count */}
          <p className="text-white/60 mb-6">
            {filteredContents.length} projet
            {filteredContents.length > 1 ? "s" : ""} trouvé
            {filteredContents.length > 1 ? "s" : ""}
          </p>

          {/* Content Grid */}
          {filteredContents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredContents.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-slate-900/50 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-white/40" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Aucun projet trouvé
              </h3>
              <p className="text-white/60">
                Essayez de modifier vos filtres ou votre recherche
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ExploreContent />
    </Suspense>
  )
}
