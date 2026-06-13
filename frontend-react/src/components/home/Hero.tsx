import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import SearchWidget from './SearchWidget'

const Globe = lazy(() => import('../3d/Globe'))

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-electric-500/5 blur-[120px] animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-violet-500/5 blur-[120px] animate-float [animation-delay:2s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-cyan-500/3 blur-[100px] animate-float [animation-delay:4s]" />
      </div>

      {/* Grid noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 w-full">
        {/* Left: copy + search */}
        <div className="flex-1 flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            <span className="section-label w-fit">Premium Global Aviation</span>

            <h1 className="font-display font-black text-5xl md:text-6xl xl:text-7xl leading-[0.95] tracking-tight">
              Fly to{' '}
              <span className="gradient-text">Anywhere</span>
              <br />
              in the World
            </h1>

            <p className="text-white/50 text-lg max-w-lg leading-relaxed">
              Discover thousands of routes worldwide. Premium seats, transparent pricing, and real-time availability — all in one place.
            </p>

            {/* Trust badges */}
            <div className="flex items-center gap-6">
              {[
                { num: '500+', label: 'Airlines' },
                { num: '180+', label: 'Countries' },
                { num: '4.9★', label: 'Rating' },
              ].map(b => (
                <div key={b.label} className="flex flex-col">
                  <span className="font-display font-bold text-xl gradient-text-gold">{b.num}</span>
                  <span className="text-xs text-white/35 font-medium">{b.label}</span>
                </div>
              ))}
              <div className="h-8 w-px bg-white/10" />
              <div className="flex -space-x-2">
                {['A', 'B', 'C', 'D'].map((l, i) => (
                  <div
                    key={l}
                    className="w-8 h-8 rounded-full border-2 border-dark-950 flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: ['#3b82f6','#8b5cf6','#06b6d4','#f59e0b'][i] }}
                  >
                    {l}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-dark-950 glass flex items-center justify-center text-xs text-white/60">
                  +2M
                </div>
              </div>
            </div>
          </motion.div>

          <SearchWidget />
        </div>

        {/* Right: Globe */}
        <motion.div
          className="hidden lg:block flex-1 h-[560px] relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Glow behind globe */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-80 h-80 rounded-full bg-electric-500/10 blur-3xl animate-pulse-glow" />
          </div>
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-2 border-electric-500/40 border-t-electric-500 animate-spin" />
            </div>
          }>
            <Globe />
          </Suspense>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="text-xs tracking-widest font-mono uppercase">Scroll</span>
        <ChevronDown size={16} className="animate-bounce" />
      </motion.button>
    </section>
  )
}
