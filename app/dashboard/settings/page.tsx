"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import {
  Settings,
  Bell,
  Lock,
  Globe,
  CreditCard,
  Shield,
  Trash2,
  ExternalLink,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/lib/auth-context"

export default function SettingsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState({
    email: true,
    investments: true,
    updates: false,
    marketing: false,
  })
  const [language, setLanguage] = useState("fr")
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Paramètres</h1>
          <p className="text-white/60">Gérez vos préférences et votre compte</p>
        </div>
        <Button
          onClick={handleSave}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
        >
          {saved ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Enregistré
            </>
          ) : (
            "Enregistrer"
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-emerald-400" />
              Notifications
            </CardTitle>
            <CardDescription className="text-white/60">
              Choisissez comment vous souhaitez être notifié
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Notifications par email</p>
                <p className="text-white/60 text-sm">
                  Recevez les notifications importantes par email
                </p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, email: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Alertes investissements</p>
                <p className="text-white/60 text-sm">
                  Soyez notifié des retours sur vos investissements
                </p>
              </div>
              <Switch
                checked={notifications.investments}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, investments: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Mises à jour projets</p>
                <p className="text-white/60 text-sm">
                  Recevez les actualités des projets suivis
                </p>
              </div>
              <Switch
                checked={notifications.updates}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, updates: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Emails marketing</p>
                <p className="text-white/60 text-sm">
                  Recevez nos offres et actualités
                </p>
              </div>
              <Switch
                checked={notifications.marketing}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, marketing: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Language & Region */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-emerald-400" />
              Langue et région
            </CardTitle>
            <CardDescription className="text-white/60">
              Configurez vos préférences régionales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language" className="text-white">
                Langue de l'interface
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-slate-800 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/20">
                  <SelectItem value="fr" className="text-white hover:bg-white/10">
                    Français
                  </SelectItem>
                  <SelectItem value="en" className="text-white hover:bg-white/10">
                    English
                  </SelectItem>
                  <SelectItem value="es" className="text-white hover:bg-white/10">
                    Español
                  </SelectItem>
                  <SelectItem value="de" className="text-white hover:bg-white/10">
                    Deutsch
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone" className="text-white">
                Fuseau horaire
              </Label>
              <Select defaultValue="europe-paris">
                <SelectTrigger className="bg-slate-800 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/20">
                  <SelectItem
                    value="europe-paris"
                    className="text-white hover:bg-white/10"
                  >
                    Europe/Paris (UTC+1)
                  </SelectItem>
                  <SelectItem
                    value="europe-london"
                    className="text-white hover:bg-white/10"
                  >
                    Europe/London (UTC+0)
                  </SelectItem>
                  <SelectItem
                    value="america-new_york"
                    className="text-white hover:bg-white/10"
                  >
                    America/New_York (UTC-5)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency" className="text-white">
                Devise d'affichage
              </Label>
              <Select defaultValue="eur">
                <SelectTrigger className="bg-slate-800 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/20">
                  <SelectItem value="eur" className="text-white hover:bg-white/10">
                    Euro (€)
                  </SelectItem>
                  <SelectItem value="usd" className="text-white hover:bg-white/10">
                    Dollar ($)
                  </SelectItem>
                  <SelectItem value="gbp" className="text-white hover:bg-white/10">
                    Livre Sterling (£)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="h-5 w-5 text-emerald-400" />
              Sécurité
            </CardTitle>
            <CardDescription className="text-white/60">
              Protégez votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-white">
                Mot de passe actuel
              </Label>
              <Input
                id="current-password"
                type="password"
                placeholder="••••••••"
                className="bg-slate-800 border-white/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-white">
                Nouveau mot de passe
              </Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                className="bg-slate-800 border-white/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-white">
                Confirmer le mot de passe
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                className="bg-slate-800 border-white/20 text-white"
              />
            </div>

            <Button
              variant="outline"
              className="w-full bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              <Shield className="h-4 w-4 mr-2" />
              Activer l'authentification à deux facteurs
            </Button>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-400" />
              Moyens de paiement
            </CardTitle>
            <CardDescription className="text-white/60">
              Gérez vos méthodes de paiement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">
                  VISA
                </div>
                <div>
                  <p className="text-white font-medium">•••• •••• •••• 4242</p>
                  <p className="text-white/60 text-sm">Expire 12/28</p>
                </div>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
                Par défaut
              </Badge>
            </div>

            <Button
              variant="outline"
              className="w-full bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Ajouter une carte
            </Button>

            <div className="pt-4 border-t border-white/10">
              <p className="text-white font-medium mb-2">Compte Stripe Connect</p>
              <p className="text-white/60 text-sm mb-3">
                Pour recevoir vos gains, connectez votre compte Stripe
              </p>
              <Button className="bg-[#635BFF] hover:bg-[#5851DB] text-white">
                <ExternalLink className="h-4 w-4 mr-2" />
                Connecter Stripe
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="lg:col-span-2 bg-slate-900/50 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Zone de danger
            </CardTitle>
            <CardDescription className="text-white/60">
              Actions irréversibles sur votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
              <div>
                <p className="text-white font-medium">Supprimer mon compte</p>
                <p className="text-white/60 text-sm">
                  Cette action est irréversible. Toutes vos données seront
                  supprimées définitivement.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="shrink-0">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer le compte
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-slate-900 border-white/10">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">
                      Êtes-vous absolument sûr ?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-white/60">
                      Cette action ne peut pas être annulée. Cela supprimera
                      définitivement votre compte et toutes vos données de nos
                      serveurs.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/10">
                      Annuler
                    </AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-500 text-white">
                      Supprimer définitivement
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
