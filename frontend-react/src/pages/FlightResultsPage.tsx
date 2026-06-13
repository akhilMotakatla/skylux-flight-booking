import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Filter, SlidersHorizontal, Clock, Plane, ChevronDown, CheckCircle } from 'lucide-react'
import { searchFlights } from '../services/api'
import type { Flight } from '../types'

function duration(mins: number) {
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}

function FlightCard({ flight, i }: { flight: Flight; i: number }) {
  const [expanded, setExpanded] = useState(false)
  const logoUrl = `https://www.gstatic.com/flights/airline_logos/70px/${flight.airlineCode}.png`

  return (
    <motion.div
      className="glass border border-white/8 rounded-2xl overflow-hidden hover:border-white/15 transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.07, duration: 0.5 }}
    >
      <div className="p-5 flex flex-col md:flex-row items-start md:items-center gap-5">
        {/* Airline logo */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500/10 to-dark-900 border border-gold-500/20 flex items-center justify-center shrink-0">
          <img
            src={logoUrl}
            alt={flight.airlineName}
            className="w-8 h-8 object-contain"
            onError={e => {
              const img = e.target as HTMLImageElement
              img.style.display = 'none'
              const fb = img.nextElementSibling as HTMLElement
              if (fb) fb.style.display = 'flex'
            }}
          />
          <span
            className="font-mono text-xs font-bold text-gold-400 hidden items-center justify-center w-full h-full"
            style={{ display: 'none' }}
          >
            {flight.airlineCode}
          </span>
        </div>

        {/* Route info */}
        <div className="flex-1 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          {/* Departure */}
          <div className="text-center md:text-left">
            <div className="font-display font-bold text-2xl text-white">
              {new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xs font-mono text-white/40">{flight.departureIATA}</div>
            <div className="text-xs text-white/30">{flight.departureCity}</div>
          </div>

          {/* Duration bar */}
          <div className="flex-1 flex flex-col items-center gap-1 min-w-[120px]">
            <div className="text-xs text-white/30 font-mono">{duration(flight.durationMinutes)}</div>
            <div className="w-full flex items-center gap-1">
              <div className="flex-1 h-px bg-white/10" />
              <Plane size={10} className="text-white/20 rotate-90" />
              <div className="flex-1 h-px bg-white/10" />
            </div>
            {flight.isConnecting ? (
              <div className="text-[10px] text-amber-400/70 font-mono">
                1 stop · {flight.connectionIATA}
              </div>
            ) : (
              <div className="text-[10px] text-emerald-400/70 font-mono">Nonstop</div>
            )}
          </div>

          {/* Arrival */}
          <div className="text-center md:text-left">
            <div className="font-display font-bold text-2xl text-white">
              {new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xs font-mono text-white/40">{flight.arrivalIATA}</div>
            <div className="text-xs text-white/30">{flight.arrivalCity}</div>
          </div>

          {/* Airline name + flight # */}
          <div className="hidden md:block text-center">
            <div className="text-sm text-white/60">{flight.airlineName}</div>
            <div className="text-xs font-mono text-white/30">{flight.flightNumber}</div>
            <div className="text-xs text-white/20 mt-0.5">{flight.class}</div>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center md:flex-col gap-4 md:gap-2 md:text-right w-full md:w-auto">
          <div className="flex-1 md:flex-none">
            <div className="font-display font-black text-2xl gradient-text-gold">${flight.price}</div>
            <div className="text-xs text-white/30">per person</div>
          </div>
          <div className="flex flex-col gap-2">
            <button className="btn-primary text-sm py-2 px-4 whitespace-nowrap">
              Select
            </button>
            <button
              className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1 justify-end"
              onClick={() => setExpanded(e => !e)}
            >
              Details
              <ChevronDown size={11} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="border-t border-white/5 px-5 py-4 grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Class</div>
              <div className="text-sm text-white/70">{flight.class}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Seats left</div>
              <div className="text-sm text-white/70">{flight.availableSeats}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Flight</div>
              <div className="text-sm font-mono text-white/70">{flight.flightNumber}</div>
            </div>
            {flight.isConnecting && (
              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Layover</div>
                <div className="text-sm text-amber-400/70">{duration(flight.layoverMinutes ?? 0)} in {flight.connectionCity}</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FlightResultsPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price')

  const from = params.get('from') ?? ''
  const to = params.get('to') ?? ''
  const date = params.get('date') ?? ''
  const passengers = params.get('passengers') ?? '1'
  const cls = params.get('class') ?? 'Economy'

  useEffect(() => {
    if (!from || !to || !date) return
    setLoading(true)
    setError('')
    searchFlights({ from, to, date, passengers: Number(passengers), class: cls })
      .then(data => setFlights(data))
      .catch(() => setError('Could not load flights. Make sure the backend is running.'))
      .finally(() => setLoading(false))
  }, [from, to, date, passengers, cls])

  const sorted = [...flights].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price
    if (sortBy === 'duration') return a.durationMinutes - b.durationMinutes
    return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
  })

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate('/')} className="text-sm text-white/40 hover:text-white/70 transition-colors mb-4 flex items-center gap-1">
            ← Back to search
          </button>
          <h1 className="font-display font-bold text-3xl flex items-center gap-3">
            <span className="gradient-text">{from}</span>
            <ArrowRight size={20} className="text-white/30" />
            <span className="gradient-text">{to}</span>
          </h1>
          <p className="text-white/40 mt-1 text-sm">
            {date} · {passengers} passenger{Number(passengers) > 1 ? 's' : ''} · {cls}
          </p>
        </div>

        {/* Sort bar */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-xs text-white/40 flex items-center gap-1.5">
            <SlidersHorizontal size={12} />
            Sort by
          </span>
          {(['price', 'duration', 'departure'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`text-xs px-3 py-1.5 rounded-full transition-all capitalize ${
                sortBy === s
                  ? 'bg-electric-500/20 border border-electric-500/40 text-electric-400'
                  : 'glass text-white/40 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
          {!loading && (
            <span className="ml-auto text-xs text-white/30">
              {flights.length} flight{flights.length !== 1 ? 's' : ''} found
            </span>
          )}
        </div>

        {/* Results */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-electric-500/40 border-t-electric-500 animate-spin" />
            <p className="text-white/40 text-sm">Searching the best flights...</p>
          </div>
        )}

        {error && (
          <div className="glass border border-red-500/20 rounded-2xl p-8 text-center">
            <p className="text-red-400 text-sm">{error}</p>
            <p className="text-white/30 text-xs mt-2">Check that the .NET backend is running on port 5000</p>
          </div>
        )}

        {!loading && !error && sorted.length === 0 && (
          <div className="glass border border-white/8 rounded-2xl p-12 text-center">
            <Plane size={40} className="text-white/10 mx-auto mb-4" />
            <p className="text-white/50 text-lg font-display font-bold">No flights found</p>
            <p className="text-white/30 text-sm mt-2">Try different dates or routes</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {sorted.map((f, i) => (
            <FlightCard key={f.flightNumber} flight={f} i={i} />
          ))}
        </div>
      </div>
    </main>
  )
}
