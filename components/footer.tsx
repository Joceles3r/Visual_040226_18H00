import Link from "next/link"
import { VisualSlogan } from "@/components/visual-slogan"
import { Phone, Mail, MapPin, Users, MessageCircle, Lock, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10 cinema-footer">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-black tracking-tight">
                <span className="text-red-500">V</span>
                <span className="text-amber-400">I</span>
                <span className="text-emerald-400">X</span>
                <span className="text-teal-400">U</span>
                <span className="text-sky-400">A</span>
                <span className="text-indigo-400">L</span>
              </span>
            </Link>
            <div className="mb-3">
              <VisualSlogan size="xs" opacity="medium" />
            </div>
            <p className="text-white/60 max-w-md">
              {"La plateforme de contribution participative pour les projets audiovisuels, litteraires et podcasts. Soutenez les createurs, contribuez a l'art."}
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
                  Comment ca marche
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
                <Link href="/guide-profiles" className="text-white/60 hover:text-emerald-400 transition-colors">
                  Guide des 8 profils
                </Link>
              </li>
            </ul>
          </div>

          {/* Vixual Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Vixual Social</h4>
            <Link 
              href="/social" 
              className="inline-flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Acceder a Vixual Social
            </Link>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/legal/terms" className="text-white/60 hover:text-emerald-400 transition-colors text-sm">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-white/60 hover:text-emerald-400 transition-colors text-sm">
                  Politique de confidentialite
                </Link>
              </li>
              <li>
                <Link href="/legal/cgv" className="text-white/60 hover:text-emerald-400 transition-colors text-sm">
                  CGV
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Mail className="h-4 w-4" />
              Nous contacter
            </Link>
          </div>
        </div>

        {/* Soutien Libre Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Heart className="h-5 w-5 text-rose-400" />
              <span className="text-rose-300 font-semibold">Vous connaissez un createur sur VIXUAL ?</span>
            </div>
            <p className="text-white/60 text-sm mb-4">
              Un petit geste peut faire une grande difference. Aidez un projet a demarrer, 
              encouragez un createur a continuer, participez a une aventure.
            </p>
            <Link 
              href="/soutien-libre" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 transition-colors"
            >
              <Heart className="h-4 w-4" />
              Soutenir un createur
            </Link>
            <p className="text-white/40 text-xs mt-3">
              Soutien libre, sans impact sur le classement
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            2026 VIXUAL. Tous droits reserves.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-sm">
              Contribuer comporte des risques. Les gains ne sont pas garantis.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
