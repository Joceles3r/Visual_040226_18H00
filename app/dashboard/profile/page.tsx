"use client"

import React from "react"

import { useState } from "react"
import Image from "next/image"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Camera,
  Shield,
  Film,
  FileText,
  TrendingUp,
  BookOpen,
  Award,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"

const ROLE_LABELS: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  visitor: { label: "Visiteur", color: "bg-slate-500", icon: User },
  porter: { label: "Porteur", color: "bg-red-500", icon: Film },
  infoporter: { label: "Infoporteur", color: "bg-amber-500", icon: FileText },
  investor: { label: "Investisseur", color: "bg-emerald-500", icon: TrendingUp },
  investireader: { label: "Investi-lecteur", color: "bg-sky-500", icon: BookOpen },
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "Jean",
    lastName: "Dupont",
    email: user?.email || "",
    phone: "+33 6 12 34 56 78",
    location: "Paris, France",
    bio: "Passionné de cinéma et de littérature, je soutiens les créateurs indépendants sur VISUAL.",
  })

  const handleSave = () => {
    setIsEditing(false)
    // Save logic would go here
  }

  const stats = [
    { label: "Projets soutenus", value: "12", icon: Star },
    { label: "Total investi", value: "245€", icon: TrendingUp },
    { label: "VISUpoints", value: "1,850", icon: Award },
    { label: "Membre depuis", value: "Jan 2026", icon: Calendar },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mon profil</h1>
          <p className="text-white/60">Gérez vos informations personnelles</p>
        </div>
        <Button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className={
            isEditing
              ? "bg-emerald-600 hover:bg-emerald-500 text-white"
              : "bg-transparent border border-white/20 text-white hover:bg-white/10"
          }
        >
          {isEditing ? (
            "Enregistrer"
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <Card className="lg:col-span-1 bg-slate-900/50 border-white/10">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-500">
                  <Image
                    src="/placeholder.svg?height=128&width=128"
                    alt="Avatar"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                {isEditing && (
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white hover:bg-emerald-500 transition-colors"
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                )}
              </div>

              <h2 className="text-xl font-bold text-white mb-1">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-white/60 mb-4">{formData.email}</p>

              {/* Roles */}
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {user?.roles.map((role) => {
                  const roleInfo = ROLE_LABELS[role]
                  if (!roleInfo) return null
                  return (
                    <Badge
                      key={role}
                      className={`${roleInfo.color} text-white border-0`}
                    >
                      <roleInfo.icon className="h-3 w-3 mr-1" />
                      {roleInfo.label}
                    </Badge>
                  )
                })}
              </div>

              {/* Quick stats */}
              <div className="w-full grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="p-3 bg-slate-800/50 rounded-lg"
                  >
                    <stat.icon className="h-4 w-4 text-emerald-400 mb-1 mx-auto" />
                    <div className="text-lg font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-white/60">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile details */}
        <Card className="lg:col-span-2 bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-400" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white">
                  Prénom
                </Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="bg-slate-800 border-white/20 text-white"
                  />
                ) : (
                  <p className="text-white/80 p-2">{formData.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white">
                  Nom
                </Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="bg-slate-800 border-white/20 text-white"
                  />
                ) : (
                  <p className="text-white/80 p-2">{formData.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white flex items-center gap-2">
                <Mail className="h-4 w-4 text-white/60" />
                Email
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-slate-800 border-white/20 text-white"
                />
              ) : (
                <p className="text-white/80 p-2">{formData.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white flex items-center gap-2">
                  <Phone className="h-4 w-4 text-white/60" />
                  Téléphone
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="bg-slate-800 border-white/20 text-white"
                  />
                ) : (
                  <p className="text-white/80 p-2">{formData.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-white flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-white/60" />
                  Localisation
                </Label>
                {isEditing ? (
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="bg-slate-800 border-white/20 text-white"
                  />
                ) : (
                  <p className="text-white/80 p-2">{formData.location}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-white">
                Bio
              </Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="bg-slate-800 border-white/20 text-white min-h-[100px]"
                />
              ) : (
                <p className="text-white/80 p-2">{formData.bio}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security card */}
        <Card className="lg:col-span-3 bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-400" />
              Sécurité et vérification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Email vérifié</p>
                    <p className="text-white/60 text-sm">Vérifié le 15/01/2026</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Téléphone vérifié</p>
                    <p className="text-white/60 text-sm">Vérifié le 16/01/2026</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Identité vérifiée</p>
                    <p className="text-white/60 text-sm">KYC complété</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
