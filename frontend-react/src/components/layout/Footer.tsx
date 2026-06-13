import { Plane, Twitter, Instagram, Linkedin, Github } from 'lucide-react'
import { Link } from 'react-router-dom'

const LINKS = {
  Company: ['About', 'Careers', 'Press', 'Contact'],
  Product: ['Flights', 'Business Class', 'Hotels', 'Packages'],
  Support: ['Help Center', 'Safety', 'Accessibility', 'Sitemap'],
  Legal: ['Privacy', 'Terms', 'Cookie Policy', 'Licenses'],
}

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-950 mt-32">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-500 to-violet-500 flex items-center justify-center">
                <Plane size={14} className="text-white rotate-45" />
              </div>
              <span className="font-display font-bold text-lg">Sky<span className="gradient-text">Lux</span></span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-5">
              Premium flights for the discerning traveler. Luxury at altitude.
            </p>
            <div className="flex gap-3">
              {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([cat, items]) => (
            <div key={cat}>
              <p className="section-label mb-4">{cat}</p>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-white/40 hover:text-white/80 text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-sm">
            © 2026 SkyLux Aviation. All rights reserved.
          </p>
          <p className="text-white/20 text-xs font-mono">
            Fly smarter. Live better.
          </p>
        </div>
      </div>
    </footer>
  )
}
