"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import type { VisualRole } from "@/components/navigation"
import type { ParentConsent } from "@/lib/visupoints-engine"
import { isMinor as checkIsMinor, isEligibleForSignup, MINOR_VISUPOINTS_CAP, DEFAULT_PARENT_CONSENT, MINOR_PARENT_CONSENT, checkMajorityUnlock } from "@/lib/visupoints-engine"

export interface User {
  id: string
  name: string
  email: string
  roles: VisualRole[]
  avatarUrl?: string
  birthDate?: string
  isMinor: boolean
  visupointsCap: number
  parentConsent: ParentConsent
  kycVerified: boolean
  depositStatus?: {
    porter10: boolean
    investor20: boolean
    infoporter10: boolean
    investireader20: boolean
    podcaster10: boolean
    listener20: boolean
  }
  stripeConnect?: {
    accountId?: string
    status: "not_started" | "pending" | "verified"
  }
  wallet?: {
    available: number
    pending: number
  }
  visupoints?: number
}

interface AuthContextType {
  user: User | null
  isAuthed: boolean
  isAdmin: boolean
  roles: VisualRole[]
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (data: { name: string; email: string; password: string; birthDate?: string }) => Promise<void>
  updateRoles: (newRoles: VisualRole[]) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user pour demonstration
const MOCK_USER: User = {
  id: "1",
  name: "Jean Dupont",
  email: "jean@example.com",
  roles: ["visitor"],
  visupoints: 150,
  birthDate: undefined,
  isMinor: false,
  visupointsCap: Infinity,
  parentConsent: DEFAULT_PARENT_CONSENT,
  kycVerified: false,
  depositStatus: {
    porter10: false,
    investor20: false,
    infoporter10: false,
    investireader20: false,
    podcaster10: false,
    listener20: false,
  },
  stripeConnect: {
    status: "not_started",
  },
  wallet: {
    available: 0,
    pending: 0,
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const isAuthed = user !== null
  const roles: VisualRole[] = user?.roles ?? ["guest"]
  // Admin est un flag prive derive de l'email, pas un role de profil
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase()
  const isAdmin = !!(user?.email && adminEmail && user.email.toLowerCase() === adminEmail)

  const login = async (email: string, password: string) => {
    // Simulation d'authentification
    await new Promise((resolve) => setTimeout(resolve, 500))
    setUser({
      ...MOCK_USER,
      name: email.split("@")[0],
      email: email,
    })
  }

  const logout = () => {
    setUser(null)
  }

  const signup = async (data: { name: string; email: string; password: string; birthDate?: string }) => {
    // Simulation d'inscription
    await new Promise((resolve) => setTimeout(resolve, 500))
    const minor = data.birthDate ? checkIsMinor(data.birthDate) : false
    setUser({
      ...MOCK_USER,
      name: data.name,
      email: data.email,
      birthDate: data.birthDate,
      isMinor: minor,
      visupointsCap: minor ? MINOR_VISUPOINTS_CAP : Infinity,
      parentConsent: minor ? MINOR_PARENT_CONSENT : DEFAULT_PARENT_CONSENT,
    })
  }

  const updateRoles = (newRoles: VisualRole[]) => {
    if (user) {
      setUser({ ...user, roles: newRoles })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthed,
        isAdmin,
        roles,
        login,
        logout,
        signup,
        updateRoles,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
