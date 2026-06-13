import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ROUTES = [
  { from: 'Dubai', fromCode: 'DXB', to: 'London', toCode: 'LHR', price: 449, duration: '7h 30m', badge: 'Most Popular', color: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/20' },
  { from: 'New York', fromCode: 'JFK', to: 'Paris', toCode: 'CDG', price: 520, duration: '7h 10m', badge: 'Best Value', color: 'from-blue-500/20 to-cyan-500/10', border: 'border-blue-500/20' },
  { from: 'Singapore', fromCode: 'SIN', to: 'Tokyo', toCode: 'NRT', price: 310, duration: '6h 55m', badge: null, color: 'from-violet-500/20 to-purple-500/10', border: 'border-violet-500/20' },
  { from: 'London', fromCode: 'LHR', to: 'Mumbai', toCode: 'BOM', price: 390, duration: '9h 05m', badge: null, color: 'from-cyan-500/20 to-teal-500/10', border: 'border-cyan-500/20' },
  { from: 'Los Angeles', fromCode: 'LAX', to: 'Singapore', toCode: 'SIN', price: 680, duration: '18h 30m', badge: 'Long Haul', color: 'from-rose-500/20 to-pink-500/10', border: 'border-rose-500/20' },
  { from: 'Frankfurt', fromCode: 'FRA', to: 'Dubai', toCode: 'DXB', price: 370, duration: '5h 45m', badge: null, color: 'from-emerald-500/20 to-green-500/10', border: 'border-emerald-500/20' },
]

export default function PopularRoutes() {
  const navigate = useNavigate()

  const go = (r: typeof ROUTES[0]) => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
    navigate(`/flights?from=${r.fromCode}&to=${r.toCode}&date=${tomorrow}&passengers=1&class=Economy`)
  }

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="section-label">Routes</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl mt-3 leading-tight">
              Popular<br />
              <span className="gradient-text">Destinations</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <TrendingUp size={14} />
            Live pricing
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROUTES.map((route, i) => (
            <motion.button
              key={`${route.fromCode}-${route.toCode}`}
              onClick={() => go(route)}
              className={`relative group text-left p-5 rounded-2xl bg-gradient-to-br ${route.color} border ${route.border} hover:scale-[1.02] transition-all duration-300 shadow-card hover:shadow-glow`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              {route.badge && (
                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                  {route.badge}
                </span>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div>
                  <div className="text-lg font-display font-bold text-white leading-tight">{route.from}</div>
                  <div className="text-xs font-mono text-white/40">{route.fromCode}</div>
                </div>
                <ArrowRight size={16} className="text-white/30 shrink-0" />
                <div>
                  <div className="text-lg font-display font-bold text-white leading-tight">{route.to}</div>
                  <div className="text-xs font-mono text-white/40">{route.toCode}</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-display font-black text-white">
                    ${route.price}
                  </span>
                  <span className="text-xs text-white/40 ml-1">per person</span>
                </div>
                <span className="text-xs text-white/40 font-mono">{route.duration}</span>
              </div>

              {/* Hover arrow */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                  <ArrowRight size={12} className="text-white" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
