"use client"

import { useState, useMemo, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  MessageCircle, TrendingUp, Send, Hash, AlertTriangle,
  Flag, ChevronDown, X, Sparkles, Filter,
} from "lucide-react"
import {
  type SocialPost, type SocialTag, type ReactionType,
  REACTION_CONFIG, REACTION_TYPES,
  OFFICIAL_TAGS, TAG_CATEGORIES,
  MOCK_SOCIAL_POSTS, getTrendingTags, validatePost, timeAgo,
  MAX_POST_LENGTH, MAX_TAGS_PER_POST,
  ROLE_SOCIAL_CONFIG,
} from "@/lib/visual-social"

// ─── Role Badge ───
function RoleBadge({ role }: { role: string }) {
  const config = ROLE_SOCIAL_CONFIG[role] || ROLE_SOCIAL_CONFIG.guest
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white ${config.badgeColor}`}>
      {config.badgeLabel}
    </span>
  )
}

// ─── Avatar ───
function UserAvatar({ name, role }: { name: string; role: string }) {
  const config = ROLE_SOCIAL_CONFIG[role] || ROLE_SOCIAL_CONFIG.guest
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white ${config.badgeColor} ring-2 ring-white/10`}>
      {initials}
    </div>
  )
}

// ─── Tag Pill ───
function TagPill({ tag, selected, onClick }: { tag: SocialTag; selected?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${tag.color} ${selected ? "ring-2 ring-white/30 scale-105" : "hover:brightness-125"}`}
    >
      {tag.label}
    </button>
  )
}

// ─── Reaction Button ───
function ReactionButton({
  type, count, hasReacted, onToggle,
}: {
  type: ReactionType; count: number; hasReacted: boolean; onToggle: () => void
}) {
  const config = REACTION_CONFIG[type]
  return (
    <button
      onClick={onToggle}
      className={`group inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all ${
        hasReacted
          ? `bg-white/10 ${config.color} ring-1 ring-current/30`
          : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70"
      }`}
      title={config.label}
    >
      <span className={`transition-transform ${hasReacted ? "scale-110" : "group-hover:scale-110"}`}>
        {config.icon}
      </span>
      {count > 0 && <span className="font-mono">{count}</span>}
    </button>
  )
}

// ─── Post Card ───
function PostCard({
  post, onReact, onReport,
}: {
  post: SocialPost
  onReact: (postId: string, type: ReactionType) => void
  onReport: (postId: string) => void
}) {
  return (
    <div className="group relative bg-slate-900/60 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all hover:bg-slate-900/80">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <UserAvatar name={post.authorName} role={post.authorRole} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-medium text-sm">{post.authorName}</span>
            <RoleBadge role={post.authorRole} />
            <span className="text-white/30 text-xs">{timeAgo(post.createdAt)}</span>
          </div>
        </div>
        <button
          onClick={() => onReport(post.id)}
          className="opacity-0 group-hover:opacity-100 p-1 rounded text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all"
          title="Signaler"
        >
          <Flag className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Content */}
      <p className="text-white/80 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((tag) => (
            <TagPill key={tag.id} tag={tag} />
          ))}
        </div>
      )}

      {/* Reactions */}
      <div className="flex flex-wrap gap-1.5">
        {REACTION_TYPES.map((type) => (
          <ReactionButton
            key={type}
            type={type}
            count={post.reactions[type].count}
            hasReacted={post.reactions[type].hasReacted}
            onToggle={() => onReact(post.id, type)}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Composer ───
function PostComposer({
  onSubmit,
}: {
  onSubmit: (content: string, tags: SocialTag[]) => void
}) {
  const [content, setContent] = useState("")
  const [selectedTags, setSelectedTags] = useState<SocialTag[]>([])
  const [showTagPicker, setShowTagPicker] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, role } = useAuth()

  const roleConfig = ROLE_SOCIAL_CONFIG[role?.[0] || "guest"]
  const charsLeft = MAX_POST_LENGTH - content.length
  const charsColor = charsLeft < 0 ? "text-red-400" : charsLeft < 40 ? "text-amber-400" : "text-white/30"

  const handleSubmit = () => {
    const validation = validatePost(content, selectedTags)
    if (!validation.valid) {
      setError(validation.error || null)
      return
    }
    onSubmit(content, selectedTags)
    setContent("")
    setSelectedTags([])
    setError(null)
  }

  const toggleTag = (tag: SocialTag) => {
    if (selectedTags.find((t) => t.id === tag.id)) {
      setSelectedTags(selectedTags.filter((t) => t.id !== tag.id))
    } else if (selectedTags.length < MAX_TAGS_PER_POST) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  if (!roleConfig?.canPost) return null

  return (
    <Card className="bg-slate-900/80 border-white/10">
      <CardContent className="p-4 space-y-3">
        <div className="flex gap-3">
          <UserAvatar name={user?.name || "Moi"} role={role?.[0] || "guest"} />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => { setContent(e.target.value); setError(null) }}
              placeholder={"Partagez votre exp\u00e9rience sur VISUAL\u2026"}
              rows={3}
              className="w-full bg-transparent text-white/90 text-sm placeholder:text-white/25 resize-none focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pl-12">
            {selectedTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag)}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${tag.color}`}
              >
                {tag.label}
                <X className="h-3 w-3 opacity-50" />
              </button>
            ))}
          </div>
        )}

        {/* Tag Picker */}
        {showTagPicker && (
          <div className="pl-12 space-y-3 bg-black/20 rounded-lg p-3 border border-white/5">
            {TAG_CATEGORIES.map((cat) => {
              const catTags = OFFICIAL_TAGS.filter((t) => t.category === cat.key)
              return (
                <div key={cat.key}>
                  <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1.5">{cat.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {catTags.map((tag) => (
                      <TagPill
                        key={tag.id}
                        tag={tag}
                        selected={!!selectedTags.find((t) => t.id === tag.id)}
                        onClick={() => toggleTag(tag)}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="pl-12 flex items-center gap-2 text-red-400 text-xs">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pl-12">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTagPicker(!showTagPicker)}
              className={`h-8 px-2 text-xs ${showTagPicker ? "text-emerald-400 bg-emerald-500/10" : "text-white/40 hover:text-white/70"}`}
            >
              <Hash className="h-3.5 w-3.5 mr-1" />
              Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
            </Button>
            <span className={`text-xs font-mono ${charsColor}`}>{charsLeft}</span>
          </div>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={content.trim().length === 0 || charsLeft < 0}
            className="bg-emerald-600 hover:bg-emerald-500 text-white h-8 px-4 text-xs font-semibold disabled:opacity-30"
          >
            <Send className="h-3.5 w-3.5 mr-1.5" />
            Publier
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main Feed Component ───
export default function VisualSocialFeed() {
  const { user, role } = useAuth()
  const [posts, setPosts] = useState<SocialPost[]>(MOCK_SOCIAL_POSTS)
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [reportedPosts, setReportedPosts] = useState<Set<string>>(new Set())
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const trending = useMemo(() => getTrendingTags(posts), [posts])

  const filteredPosts = useMemo(() => {
    let result = posts.filter((p) => !p.isHidden)
    if (filterTag) {
      result = result.filter((p) => p.tags.some((t) => t.id === filterTag))
    }
    return result
  }, [posts, filterTag])

  const handleNewPost = useCallback((content: string, tags: SocialTag[]) => {
    const newPost: SocialPost = {
      id: `sp-new-${Date.now()}`,
      authorId: user?.id || "me",
      authorName: user?.name || "Moi",
      authorRole: (role?.[0] || "visitor"),
      content,
      tags,
      reactions: {
        clap:  { type: "clap",  count: 0, hasReacted: false },
        fire:  { type: "fire",  count: 0, hasReacted: false },
        idea:  { type: "idea",  count: 0, hasReacted: false },
        heart: { type: "heart", count: 0, hasReacted: false },
        star:  { type: "star",  count: 0, hasReacted: false },
      },
      createdAt: new Date().toISOString(),
      reportCount: 0,
      isHidden: false,
    }
    setPosts((prev) => [newPost, ...prev])
    setSuccessMsg("+5 VISUpoints !")
    setTimeout(() => setSuccessMsg(null), 3000)
  }, [user, role])

  const handleReact = useCallback((postId: string, type: ReactionType) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p
        const reaction = p.reactions[type]
        return {
          ...p,
          reactions: {
            ...p.reactions,
            [type]: {
              ...reaction,
              count: reaction.hasReacted ? reaction.count - 1 : reaction.count + 1,
              hasReacted: !reaction.hasReacted,
            },
          },
        }
      })
    )
  }, [])

  const handleReport = useCallback((postId: string) => {
    if (reportedPosts.has(postId)) return
    setReportedPosts((prev) => new Set(prev).add(postId))
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p
        const newCount = p.reportCount + 1
        return { ...p, reportCount: newCount, isHidden: newCount >= 5 }
      })
    )
  }, [reportedPosts])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Visual Social</h2>
            <p className="text-white/40 text-xs">{"La communaut\u00e9 VISUAL s'exprime"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {successMsg && (
            <span className="text-emerald-400 text-xs font-bold animate-pulse bg-emerald-500/10 px-3 py-1 rounded-full">
              {successMsg}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={`h-8 px-3 text-xs ${showFilters ? "text-emerald-400 bg-emerald-500/10" : "text-white/40"}`}
          >
            <Filter className="h-3.5 w-3.5 mr-1.5" />
            Filtrer
            {filterTag && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />}
          </Button>
        </div>
      </div>

      {/* Trending Tags */}
      {showFilters && (
        <Card className="bg-slate-900/60 border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-white/70 text-sm font-medium">Tags tendance</span>
              {filterTag && (
                <button
                  onClick={() => setFilterTag(null)}
                  className="ml-auto text-xs text-white/30 hover:text-white/60 flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Effacer le filtre
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {trending.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setFilterTag(filterTag === tag.id ? null : tag.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${tag.color} ${
                    filterTag === tag.id ? "ring-2 ring-white/30 scale-105" : "hover:brightness-125"
                  }`}
                >
                  {tag.label}
                  <span className="text-white/30 font-mono text-[10px]">{tag.count}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Composer */}
      <PostComposer onSubmit={handleNewPost} />

      {/* Feed */}
      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-10 w-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">Aucun post pour ce filtre.</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onReact={handleReact}
              onReport={handleReport}
            />
          ))
        )}
      </div>

      {/* Stats footer */}
      <div className="flex items-center justify-center gap-4 py-4 text-white/20 text-xs">
        <span>{posts.filter((p) => !p.isHidden).length} posts</span>
        <span className="w-1 h-1 rounded-full bg-white/10" />
        <span>{OFFICIAL_TAGS.length} tags officiels</span>
        <span className="w-1 h-1 rounded-full bg-white/10" />
        <span>5 VISUpoints / post</span>
      </div>
    </div>
  )
}
