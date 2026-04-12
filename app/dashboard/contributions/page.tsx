/**
 * VIXUAL — app/dashboard/contributions/page.tsx
 *
 * Redirection transparente : /dashboard/contributions → /dashboard/investments
 * La sidebar pointe vers /dashboard/contributions mais la page reelle
 * s'appelle /dashboard/investments (contenu identique : "Mes contributions").
 */
"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

function ContributionsRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get("type")

  useEffect(() => {
    const dest = type
      ? `/dashboard/investments?type=${type}`
      : "/dashboard/investments"
    router.replace(dest)
  }, [router, type])

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function ContributionsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ContributionsRedirect />
    </Suspense>
  )
}
