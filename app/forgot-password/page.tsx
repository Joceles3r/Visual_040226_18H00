"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import { VisualSlogan } from "@/components/visual-slogan"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Une erreur est survenue")
        return
      }

      setSubmitted(true)
    } catch {
      setError("Erreur de connexion au serveur")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-slate-950 to-slate-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo + Slogan */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex justify-center">
            <span className="text-3xl font-black tracking-tight">
              <span className="text-red-500">V</span>
              <span className="text-amber-400">I</span>
              <span className="text-emerald-400">S</span>
              <span className="text-teal-400">U</span>
              <span className="text-sky-400">A</span>
              <span className="text-indigo-400">L</span>
            </span>
          </Link>
          <div className="mt-2">
            <VisualSlogan size="xs" opacity="medium" />
          </div>
        </div>

        <Card className="bg-slate-900/70 border-white/10 backdrop-blur-xl cinema-panel">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">
              Mot de passe oublie
            </CardTitle>
            <p className="text-white/60 mt-2">
              Entrez votre email pour recevoir un lien de reinitialisation
            </p>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Email envoye
                </h3>
                <p className="text-white/60 mb-6">
                  Si un compte existe avec cette adresse email, vous recevrez un lien de reinitialisation dans quelques minutes.
                </p>
                <p className="text-white/40 text-sm mb-6">
                  Pensez a verifier votre dossier spam.
                </p>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="bg-transparent border-white/20 text-white hover:bg-white/10"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour a la connexion
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                    <span className="text-red-400 text-sm">{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Adresse email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 bg-slate-800/50 border-white/10 text-white placeholder:text-white/40 focus:border-emerald-500/50"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white h-11"
                >
                  {isLoading ? "Envoi en cours..." : "Envoyer le lien de reinitialisation"}
                </Button>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Retour a la connexion
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-white/40 text-sm mt-6">
          Besoin d&apos;aide ?{" "}
          <Link
            href="/support/mailbox"
            className="text-emerald-400 hover:underline"
          >
            Contactez le support
          </Link>
        </p>
      </div>
    </div>
  )
}
