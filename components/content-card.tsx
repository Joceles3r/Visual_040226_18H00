"use client"

import Image from "next/image"
import Link from "next/link"
import { Film, FileText, Mic, Users, Clock, BookOpen, Headphones } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Content } from "@/lib/mock-data"

interface ContentCardProps {
  content: Content
}

export function ContentCard({ content }: ContentCardProps) {
  const progressPercent = Math.min(
    (content.currentInvestment / content.investmentGoal) * 100,
    100
  )
  const cType = content.contentType

  const badgeConfig = {
    video: { bg: "bg-red-600/90 hover:bg-red-600", icon: Film, label: "Video" },
    text: { bg: "bg-amber-600/90 hover:bg-amber-600", icon: FileText, label: "Ecrit" },
    podcast: { bg: "bg-purple-600/90 hover:bg-purple-600", icon: Mic, label: "Podcast" },
  }[cType]

  return (
    <Link href={`/video/${content.id}`}>
      <Card className="group overflow-hidden bg-slate-900/50 border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/20 h-full">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={content.coverUrl || "/placeholder.svg"}
            alt={content.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          {/* Badge type */}
          <Badge
            className={`absolute top-3 left-3 ${badgeConfig.bg} text-white border-0`}
          >
            <badgeConfig.icon className="h-3 w-3 mr-1" />
            {badgeConfig.label}
          </Badge>

          {/* Free badge */}
          {content.isFree && (
            <Badge className="absolute top-3 right-3 bg-emerald-600/90 hover:bg-emerald-600 text-white border-0">
              Gratuit
            </Badge>
          )}

          {/* Duration/Word count/Episodes */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white/90 text-sm bg-black/60 px-2 py-1 rounded">
            {cType === "video" && (
              <>
                <Clock className="h-3 w-3" />
                {content.duration}
              </>
            )}
            {cType === "text" && (
              <>
                <BookOpen className="h-3 w-3" />
                {content.wordCount?.toLocaleString()} mots
              </>
            )}
            {cType === "podcast" && (
              <>
                <Headphones className="h-3 w-3" />
                {content.episodeCount} ep. - {content.duration}
              </>
            )}
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">
              {content.title}
            </h3>
            <p className="text-sm text-white/60 mt-1">{content.creatorName}</p>
          </div>

          <p className="text-sm text-white/70 line-clamp-2">
            {content.description}
          </p>

          {/* Progress */}
          <div className="space-y-2">
            <Progress value={progressPercent} className="h-2 bg-slate-800" />
            <div className="flex justify-between text-xs text-white/60">
              <span className="text-emerald-400 font-medium">
                {content.currentInvestment.toLocaleString()}€
              </span>
              <span>sur {content.investmentGoal.toLocaleString()}€</span>
            </div>
          </div>

          {/* Investors */}
          <div className="flex items-center gap-1 text-sm text-white/60">
            <Users className="h-4 w-4" />
            <span>{content.investorCount} investisseurs</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
