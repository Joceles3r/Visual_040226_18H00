import Link from "next/link"
import { VisualSlogan } from "@/components/visual-slogan"

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10 cinema-footer">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-black tracking-tight">
                <span className="text-red-500">V</span>
                <span className="text-amber-400">I</span>
                <span className="text-emerald-400">S</span>
                <span className="text-teal-400">U</span>
                <span className="text-sky-400">A</span>
                <span className="text-indigo-400">L</span>
              </span>
            </Link>
            <div className="mb-3">
              <VisualSlogan size="xs" opacity="medium" />
            </div>
            <p className="text-white/60 max-w-md">
              {"La plateforme d'investissement participatif pour les projets audiovisuels, littéraires et podcasts. Soutenez les créateurs, investissez dans l'art."}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/explore" className="text-white/60 hover:text-emerald-400 transition-colors">
                  Explorer
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-white/60 hover:text-emerald-400 transition-colors">
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/60 hover:text-emerald-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-white/60 hover:text-emerald-400 transition-colors">
                  Classements TOP 10/100/500
                </Link>
              </li>
              <li>
                <Link href="/social" className="text-white/60 hover:text-emerald-400 transition-colors">
                  Visual Social
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Légal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/legal/terms" className="text-white/60 hover:text-emerald-400 transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-white/60 hover:text-emerald-400 transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/legal/cgv" className="text-white/60 hover:text-emerald-400 transition-colors">
                  {"Conditions Générales de Vente"}
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="text-white/60 hover:text-emerald-400 transition-colors">
                  Cookies
                </Link>
              </li>
              <li>
                <Link href="/support/contact" className="text-white/60 hover:text-emerald-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            2026 VISUAL. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-sm">
              Investir comporte des risques. Les gains ne sont pas garantis.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
