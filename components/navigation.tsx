"use client"

import React from "react"

import {
  BookOpen,
  HelpCircle,
  Trophy,
  Compass,
  Film,
  FileText,
  LayoutDashboard,
  User,
  Settings,
  Mail,
  Star,
  Upload,
  Wallet,
  History,
  Heart,
} from "lucide-react"

export type VisualRole =
  | "guest"
  | "visitor"
  | "porter"
  | "investor"
  | "infoporter"
  | "investireader"
  | "admin"

export type NavItem = {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  roles?: VisualRole[]
}

export type NavMenu = {
  label: string
  items: NavItem[]
}

// Menu "Découvrir" (public)
export const DISCOVER_MENU: NavMenu = {
  label: "Découvrir",
  items: [
    { label: "Comment ça marche", href: "/how-it-works", icon: BookOpen },
    { label: "FAQ", href: "/faq", icon: HelpCircle },
    { label: "Classement / Top 10", href: "/leaderboard", icon: Trophy },
  ],
}

// Menu "Explorer" (public)
export const EXPLORE_MENU: NavMenu = {
  label: "Explorer",
  items: [
    { label: "Explorer (Vidéo)", href: "/explore?type=video", icon: Film },
    { label: "Explorer (Écrit)", href: "/explore?type=text", icon: FileText },
    { label: "Tout voir", href: "/explore", icon: Compass },
  ],
}

// Menu "Mon Espace" (inscrits) + items conditionnels par rôles
export const MY_SPACE_MENU: NavMenu = {
  label: "Mon Espace",
  items: [
    // Commun (tous les inscrits)
    {
      label: "Tableau de bord",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["visitor", "porter", "investor", "infoporter", "investireader", "admin"],
    },
    {
      label: "Mon profil",
      href: "/profile/me",
      icon: User,
      roles: ["visitor", "porter", "investor", "infoporter", "investireader", "admin"],
    },
    {
      label: "Paramètres",
      href: "/dashboard/settings",
      icon: Settings,
      roles: ["visitor", "porter", "investor", "infoporter", "investireader", "admin"],
    },
    {
      label: "Support (Boîte interne)",
      href: "/support/mailbox",
      icon: Mail,
      roles: ["visitor", "porter", "investor", "infoporter", "investireader", "admin"],
    },

    // VISITEUR
    {
      label: "Mes VISUpoints",
      href: "/dashboard/visupoints",
      icon: Star,
      roles: ["visitor"],
    },
    {
      label: "Mes favoris / suivis",
      href: "/dashboard/favorites",
      icon: Heart,
      roles: ["visitor"],
    },

    // PORTEUR (vidéo)
    {
      label: "Déposer une vidéo",
      href: "/upload",
      icon: Upload,
      roles: ["porter"],
    },
    {
      label: "Mes projets (vidéo)",
      href: "/dashboard/projects?type=video",
      icon: Film,
      roles: ["porter"],
    },

    // INFOPORTEUR (écrit)
    {
      label: "Déposer un écrit",
      href: "/upload/text",
      icon: Upload,
      roles: ["infoporter"],
    },
    {
      label: "Mes écrits",
      href: "/dashboard/projects?type=text",
      icon: FileText,
      roles: ["infoporter"],
    },

    // INVESTISSEUR (vidéo)
    {
      label: "Mes investissements (vidéo)",
      href: "/dashboard/investments?type=video",
      icon: Film,
      roles: ["investor"],
    },

    // INVESTI-LECTEUR (écrit)
    {
      label: "Mes investissements (écrit)",
      href: "/dashboard/investments?type=text",
      icon: FileText,
      roles: ["investireader"],
    },

    // WALLET (investisseurs)
    {
      label: "Mon wallet / gains",
      href: "/dashboard/wallet",
      icon: Wallet,
      roles: ["investor", "investireader", "porter", "infoporter"],
    },
    {
      label: "Historique",
      href: "/dashboard/history",
      icon: History,
      roles: ["investor", "investireader", "porter", "infoporter"],
    },
  ],
}

// Admin (hors profils)
export const ADMIN_ITEM: NavItem = {
  label: "Administration",
  href: "/admin",
  icon: Settings,
  roles: ["admin"],
}

// Helper pour vérifier les rôles
export function hasAnyRole(userRoles: VisualRole[], itemRoles?: VisualRole[]) {
  if (!itemRoles || itemRoles.length === 0) return true
  return itemRoles.some((r) => userRoles.includes(r))
}
