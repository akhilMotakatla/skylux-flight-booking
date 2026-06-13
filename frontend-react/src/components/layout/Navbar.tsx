import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, Menu, X, User, LogIn } from 'lucide-react'

const NAV = [
  { label: 'Flights', href: '/' },
  { label: 'Business Class', href: '/' },
  { label: 'Destinations', href: '/' },
  { label: 'Deals', href: '/' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-dark-950/80 backdrop-blur-xl border-b border-white/5 shadow-glass'
          : 'bg-transparent'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-electric-500 to-violet-500 flex items-center justify-center shadow-glow-sm">
            <Plane size={18} className="text-white rotate-45" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-electric-400 to-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            Sky<span className="gradient-text">Lux</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(item => (
            <Link
              key={item.label}
              to={item.href}
              className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">
            <LogIn size={15} />
            Sign in
          </Link>
          <Link
            to="/login"
            className="btn-primary text-sm py-2 px-5"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg glass"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden absolute inset-x-0 top-full glass-strong border-t border-white/5 px-6 py-4 flex flex-col gap-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {NAV.map(item => (
              <Link
                key={item.label}
                to={item.href}
                className="px-4 py-3 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-white/5 flex gap-3">
              <Link to="/login" className="flex-1 btn-ghost text-center text-sm py-2" onClick={() => setOpen(false)}>
                Sign in
              </Link>
              <Link to="/login" className="flex-1 btn-primary text-center text-sm py-2" onClick={() => setOpen(false)}>
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
