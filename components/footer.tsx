import Link from "next/link"
import { VisualSlogan } from "@/components/visual-slogan"
import { Phone, Mail, MapPin, Users, MessageCircle, Lock } from "lucide-react"

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
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-teal-400" />
              Vixual Social
            </h4>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 mb-3">
              <p className="text-white/70 text-sm mb-3">
                Le mini reseau social reserve aux inscrits de VIXUAL
              </p>
              <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
                <Lock className="h-3 w-3" />
                <span>Acces reserve aux membres</span>
              </div>
              <Link 
                href="/social" 
                className="inline-flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Acceder a Vixual Social
              </Link>
            </div>
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
            <Link href="/contact" className="group">
              <h4 className="text-white font-semibold mb-4 group-hover:text-emerald-400 transition-colors">
                Contact VIXUAL
              </h4>
            </Link>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-white/70 text-sm">+33 (0)1 XX XX XX XX</p>
                  <p className="text-white/40 text-xs">Lun-Ven 9h-18h</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-emerald-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-white/70 text-sm">contact@vixual.fr</p>
                  <p className="text-white/70 text-sm">support@vixual.fr</p>
                  <p className="text-white/70 text-sm">partenaires@vixual.fr</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-white/70 text-sm">VIXUAL SAS</p>
                  <p className="text-white/50 text-xs">Adresse a completer</p>
                  <p className="text-white/50 text-xs">France</p>
                </div>
              </div>
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors mt-2"
              >
                <Mail className="h-4 w-4" />
                Nous contacter
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            2026 VIXUAL. Tous droits réservés.
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
