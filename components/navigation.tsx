"use client"

import React from "react"

import {
  BookOpen,
  HelpCircle,
  Trophy,
  Compass,
  Film,
  FileText,
  Mic,
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
  | "podcaster"
  | "listener"
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
    { label: "Explorer (Video)", href: "/explore?type=video", icon: Film },
    { label: "Explorer (Ecrit)", href: "/explore?type=text", icon: FileText },
    { label: "Explorer (Podcast)", href: "/explore?type=podcast", icon: Mic },
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
      roles: ["visitor", "porter", "investor", "infoporter", "investireader", "podcaster", "listener", "admin"],
    },
    {
      label: "Mon profil",
      href: "/profile/me",
      icon: User,
      roles: ["visitor", "porter", "investor", "infoporter", "investireader", "podcaster", "listener", "admin"],
    },
    {
      label: "Paramètres",
      href: "/dashboard/settings",
      icon: Settings,
      roles: ["visitor", "porter", "investor", "infoporter", "investireader", "podcaster", "listener", "admin"],
    },
    {
      label: "Support (Boîte interne)",
      href: "/support/mailbox",
      icon: Mail,
      roles: ["visitor", "porter", "investor", "infoporter", "investireader", "podcaster", "listener", "admin"],
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

    // PORTEUR (video)
    {
      label: "Deposer une video",
      href: "/upload",
      icon: Upload,
      roles: ["porter"],
    },
    {
      label: "Mes projets (video)",
      href: "/dashboard/projects?type=video",
      icon: Film,
      roles: ["porter"],
    },

    // INFOPORTEUR (ecrit)
    {
      label: "Deposer un ecrit",
      href: "/upload/text",
      icon: Upload,
      roles: ["infoporter"],
    },
    {
      label: "Mes ecrits",
      href: "/dashboard/projects?type=text",
      icon: FileText,
      roles: ["infoporter"],
    },

    // PODCASTEUR (podcast)
    {
      label: "Deposer un podcast",
      href: "/upload/podcast",
      icon: Upload,
      roles: ["podcaster"],
    },
    {
      label: "Mes podcasts",
      href: "/dashboard/projects?type=podcast",
      icon: Mic,
      roles: ["podcaster"],
    },

    // INVESTISSEUR (video)
    {
      label: "Mes investissements (video)",
      href: "/dashboard/investments?type=video",
      icon: Film,
      roles: ["investor"],
    },

    // INVESTI-LECTEUR (ecrit)
    {
      label: "Mes investissements (ecrit)",
      href: "/dashboard/investments?type=text",
      icon: FileText,
      roles: ["investireader"],
    },

    // AUDITEUR (podcast)
    {
      label: "Mes investissements (podcast)",
      href: "/dashboard/investments?type=podcast",
      icon: Mic,
      roles: ["listener"],
    },

    // WALLET (investisseurs + createurs)
    {
      label: "Mon wallet / gains",
      href: "/dashboard/wallet",
      icon: Wallet,
      roles: ["investor", "investireader", "listener", "porter", "infoporter", "podcaster"],
    },
    {
      label: "Historique",
      href: "/dashboard/history",
      icon: History,
      roles: ["investor", "investireader", "listener", "porter", "infoporter", "podcaster"],
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
