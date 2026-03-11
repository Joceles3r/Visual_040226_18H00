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
  MessageCircle,
  Share2,
  Crown,
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
    { label: "Guide des profils", href: "/guide-profiles", icon: Crown },
    { label: "Comment ça marche", href: "/how-it-works", icon: BookOpen },
    { label: "FAQ", href: "/faq", icon: HelpCircle },
    { label: "Classements TOP 10/100/500", href: "/leaderboard", icon: Trophy },
    { label: "Vixual Social", href: "/social", icon: MessageCircle },
  ],
}

// Menu "Explorer" (public)
export const EXPLORE_MENU: NavMenu = {
  label: "Explorer",
  items: [
    { label: "Explorer (Films & Vidéos)", href: "/explore?type=video", icon: Film },
    { label: "Explorer (Livres & Articles)", href: "/explore?type=text", icon: FileText },
    { label: "Explorer (Podcasts)", href: "/explore?type=podcast", icon: Mic },
    { label: "Tout voir", href: "/explore", icon: Compass },
    { label: "Gold Pass", href: "/explore?type=goldpass", icon: Crown },
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
      roles: ["visitor", "porter", "investor", "infoporter", "investireader", "podcaster", "listener"],
    },
    {
      label: "Mon profil",
      href: "/dashboard/profile",
      icon: User,
      roles: ["visitor", "porter", "investor", "infoporter", "investireader", "podcaster", "listener"],
    },
    {
      label: "Paramètres",
      href: "/dashboard/settings",
      icon: Settings,
      roles: ["visitor", "porter", "investor", "infoporter", "investireader", "podcaster", "listener"],
    },
    {
      label: "Support (Boîte interne)",
      href: "/support/mailbox",
      icon: Mail,
      roles: ["visitor", "porter", "investor", "infoporter", "investireader", "podcaster", "listener"],
    },

    // VISITEUR (+ tous les inscrits)
    {
      label: "Mes VISUpoints",
      href: "/dashboard/visupoints",
      icon: Star,
      roles: ["visitor", "porter", "investor", "infoporter", "investireader", "podcaster", "listener"],
    },
    {
      label: "Mes favoris / suivis",
      href: "/dashboard/favorites",
      icon: Heart,
      roles: ["visitor", "porter", "investor", "infoporter", "investireader", "podcaster", "listener"],
    },

    // PORTEUR (video)
    {
      label: "Deposer un film/video",
      href: "/upload",
      icon: Upload,
      roles: ["porter"],
    },
    {
      label: "Mes films & videos",
      href: "/dashboard/projects?type=video",
      icon: Film,
      roles: ["porter"],
    },

    // INFOPORTEUR (ecrit)
    {
      label: "Deposer un livre/article",
      href: "/upload/text",
      icon: Upload,
      roles: ["infoporter"],
    },
    {
      label: "Mes livres & articles",
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
      label: "Mes contributions (films & videos)",
      href: "/dashboard/investments?type=video",
      icon: Film,
      roles: ["investor"],
    },

    // INVESTI-LECTEUR (ecrit)
    {
      label: "Mes contributions (livres & articles)",
      href: "/dashboard/investments?type=text",
      icon: FileText,
      roles: ["investireader"],
    },

    // AUDITEUR (podcast)
    {
      label: "Explorer les podcasts",
      href: "/explore?type=podcast",
      icon: Compass,
      roles: ["listener"],
    },
    {
      label: "Mes investissements (podcast)",
      href: "/dashboard/investments?type=podcast",
      icon: Mic,
      roles: ["listener"],
    },

    // PROMOTION / PARRAINAGE (tous les inscrits)
    {
      label: "Promotion / Parrainage",
      href: "/dashboard/promo",
      icon: Share2,
      roles: ["visitor", "porter", "investor", "infoporter", "investireader", "podcaster", "listener"],
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

// Admin (hors profils — visibilite geree par isAdmin, pas par roles)
export const ADMIN_ITEM = {
  label: "Administration",
  href: "/admin",
  icon: Settings,
} as const

// Helper pour vérifier les rôles
export function hasAnyRole(userRoles: VisualRole[], itemRoles?: VisualRole[]) {
  if (!itemRoles || itemRoles.length === 0) return true
  return itemRoles.some((r) => userRoles.includes(r))
}
