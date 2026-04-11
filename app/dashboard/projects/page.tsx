"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Film, FileText, Mic, Upload, Users, TrendingUp, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Donnees reelles - etat vide par defaut
// TODO: Charger les vrais projets depuis l'API
interface Project {
  id: string
  title: string
  type: "video" | "text" | "podcast"
  status: "active" | "funded"
  investment: number
  goal: number
  investors: number
  views: number
  createdAt: string
}

const MOCK_PROJECTS: Project[] = []

function ProjectsContent() {
  const searchParams = useSearchParams()
  const typeFilter = searchParams.get("type")

  const filteredProjects = typeFilter
    ? MOCK_PROJECTS.filter((p) => p.type === typeFilter)
    : MOCK_PROJECTS

  const isVideoFilter = typeFilter === "video"
  const isTextFilter = typeFilter === "text"
  const isPodcastFilter = typeFilter === "podcast"

  const getTitle = () => {
    if (isVideoFilter) return "Mes projets video"
    if (isTextFilter) return "Mes ecrits"
    if (isPodcastFilter) return "Mes podcasts"
    return "Mes projets"
  }

  const getUploadHref = () => {
    if (isTextFilter) return "/upload/text"
    if (isPodcastFilter) return "/upload/podcast"
    return "/upload"
  }

  const getUploadLabel = () => {
    if (isTextFilter) return "Deposer un ecrit"
    if (isPodcastFilter) return "Deposer un podcast"
    return "Deposer une video"
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{getTitle()}</h1>
          <p className="text-white/60">Gerez et suivez vos creations</p>
        </div>

        <Link href={getUploadHref()}>
          <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white">
            <Upload className="mr-2 h-4 w-4" />
            {getUploadLabel()}
          </Button>
        </Link>
      </div>

      {/* Filter tabs */}
      {!typeFilter && (
        <div className="flex gap-2 flex-wrap">
          <Link href="/dashboard/projects?type=video">
            <Button
              variant="outline"
              className="bg-transparent border-white/20 text-white hover:bg-red-600/20 hover:border-red-500/50"
            >
              <Film className="mr-2 h-4 w-4 text-red-400" />
              Videos
            </Button>
          </Link>
          <Link href="/dashboard/projects?type=text">
            <Button
              variant="outline"
              className="bg-transparent border-white/20 text-white hover:bg-amber-600/20 hover:border-amber-500/50"
            >
              <FileText className="mr-2 h-4 w-4 text-amber-400" />
              Ecrits
            </Button>
          </Link>
          <Link href="/dashboard/projects?type=podcast">
            <Button
              variant="outline"
              className="bg-transparent border-white/20 text-white hover:bg-violet-600/20 hover:border-violet-500/50"
            >
              <Mic className="mr-2 h-4 w-4 text-violet-400" />
              Podcasts
            </Button>
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900/50 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isTextFilter ? "bg-amber-500/20" : "bg-red-500/20"
                }`}
              >
                {isTextFilter ? (
                  <FileText className="h-6 w-6 text-amber-400" />
                ) : (
                  <Film className="h-6 w-6 text-red-400" />
                )}
              </div>
              <div>
                <p className="text-white/60 text-sm">Projets publiés</p>
                <p className="text-2xl font-bold text-white">
                  {filteredProjects.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Total collecté</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {filteredProjects
                    .reduce((sum, p) => sum + p.investment, 0)
                    .toLocaleString()}
                  €
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-sky-500/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-sky-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Participants</p>
                <p className="text-2xl font-bold text-white">
                  {filteredProjects.reduce((sum, p) => sum + p.investors, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Mes projets</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProjects.length > 0 ? (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 bg-slate-800/50 rounded-lg space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        project.type === "video"
                          ? "bg-red-500/20"
                          : "bg-amber-500/20"
                      }`}
                    >
                      {project.type === "video" ? (
                        <Film className="h-6 w-6 text-red-400" />
                      ) : (
                        <FileText className="h-6 w-6 text-amber-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">
                          {project.title}
                        </h3>
                        <Badge
                          className={`${
                            project.status === "active"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-sky-500/20 text-sky-400"
                          } border-0`}
                        >
                          {project.status === "active" ? "Actif" : "Financé"}
                        </Badge>
                      </div>
                      <p className="text-sm text-white/60">
                        Créé le {project.createdAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {project.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {project.investors}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-white/20 text-white hover:bg-white/10"
                    >
                      Gérer
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Progress
                      value={(project.investment / project.goal) * 100}
                      className="h-2 bg-slate-700"
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-400 font-medium">
                        {project.investment.toLocaleString()}€
                      </span>
                      <span className="text-white/60">
                        sur {project.goal.toLocaleString()}€
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-white/5 rounded-xl">
              <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="h-7 w-7 text-purple-400/40" />
              </div>
              <p className="text-white/40 font-medium mb-2">Aucun contenu publie</p>
              <p className="text-white/25 text-sm mb-5 max-w-sm mx-auto">
                Deposez votre premier contenu pour commencer a recevoir des contributions 
                et avoir une chance de figurer dans le TOP 10.
              </p>
              <Link href={getUploadHref()}>
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600">
                  <Upload className="h-4 w-4 mr-2" />
                  {getUploadLabel()}
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div />}>
      <ProjectsContent />
    </Suspense>
  )
}
