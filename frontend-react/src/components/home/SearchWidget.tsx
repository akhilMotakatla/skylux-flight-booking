import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, Users, ArrowRight, ArrowLeftRight, Search } from 'lucide-react'
import { searchAirports } from '../../services/api'
import type { Airport } from '../../types'

const CLASSES = ['Economy', 'Premium Economy', 'Business', 'First Class']

interface AirportDropdownProps {
  value: string
  onChange: (v: string) => void
  placeholder: string
  icon: React.ReactNode
}

function AirportDropdown({ value, onChange, placeholder, icon }: AirportDropdownProps) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<Airport[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length >= 1) {
      setResults(searchAirports(query))
      setOpen(true)
    } else {
      setResults([])
      setOpen(false)
    }
  }, [query])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const select = (a: Airport) => {
    setQuery(`${a.city} (${a.iata})`)
    onChange(a.iata)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative flex-1">
      <div className="flex items-center gap-3 px-4 py-3.5">
        <span className="text-white/30 shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <input
            className="w-full bg-transparent text-white placeholder-white/30 text-sm outline-none font-medium"
            placeholder={placeholder}
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              if (!e.target.value) onChange('')
            }}
            onFocus={() => query.length >= 1 && setOpen(true)}
          />
        </div>
      </div>
      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-1 glass-strong border border-white/10 rounded-xl overflow-hidden z-50 shadow-card"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {results.map(a => (
              <button
                key={a.id}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                onClick={() => select(a)}
              >
                <span className="font-mono text-xs font-bold text-electric-400 bg-electric-500/10 px-2 py-0.5 rounded-md">
                  {a.iata}
                </span>
                <div>
                  <div className="text-sm text-white">{a.city}</div>
                  <div className="text-xs text-white/40">{a.name}</div>
                </div>
                <span className="ml-auto text-xs text-white/30">{a.country}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SearchWidget() {
  const navigate = useNavigate()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [fromLabel, setFromLabel] = useState('')
  const [toLabel, setToLabel] = useState('')
  const [date, setDate] = useState('')
  const [passengers, setPassengers] = useState(1)
  const [travelClass, setTravelClass] = useState('Economy')
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way')

  const swap = () => {
    setFrom(to); setTo(from)
    setFromLabel(toLabel); setToLabel(fromLabel)
  }

  const search = () => {
    if (!from || !to || !date) return
    const params = new URLSearchParams({ from, to, date, passengers: String(passengers), class: travelClass })
    navigate(`/flights?${params}`)
  }

  return (
    <motion.div
      className="w-full max-w-4xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Trip type toggle */}
      <div className="flex gap-2 mb-4">
        {(['one-way', 'round-trip'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTripType(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              tripType === t
                ? 'bg-electric-500 text-white shadow-glow-sm'
                : 'glass text-white/50 hover:text-white'
            }`}
          >
            {t === 'one-way' ? 'One Way' : 'Round Trip'}
          </button>
        ))}
        <div className="ml-4 flex gap-2">
          {CLASSES.map(c => (
            <button
              key={c}
              onClick={() => setTravelClass(c)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                travelClass === c
                  ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40'
                  : 'text-white/30 hover:text-white/60'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Main widget */}
      <div className="glass-strong border border-white/10 rounded-2xl shadow-card overflow-visible">
        <div className="flex flex-col md:flex-row">
          {/* From */}
          <AirportDropdown
            value={fromLabel}
            onChange={v => { setFrom(v); setFromLabel(v) }}
            placeholder="From — city or airport"
            icon={<MapPin size={16} />}
          />

          {/* Swap */}
          <div className="flex items-center justify-center px-2 py-2 md:py-0">
            <button
              onClick={swap}
              className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all md:rotate-0 rotate-90"
            >
              <ArrowLeftRight size={14} />
            </button>
          </div>

          {/* To */}
          <AirportDropdown
            value={toLabel}
            onChange={v => { setTo(v); setToLabel(v) }}
            placeholder="To — city or airport"
            icon={<MapPin size={16} />}
          />

          <div className="w-px bg-white/5 hidden md:block" />

          {/* Date */}
          <div className="flex items-center gap-3 px-4 py-3.5 flex-1">
            <Calendar size={16} className="text-white/30 shrink-0" />
            <input
              type="date"
              className="w-full bg-transparent text-white text-sm outline-none [color-scheme:dark]"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setDate(e.target.value)}
            />
          </div>

          <div className="w-px bg-white/5 hidden md:block" />

          {/* Passengers */}
          <div className="flex items-center gap-3 px-4 py-3.5 min-w-[130px]">
            <Users size={16} className="text-white/30 shrink-0" />
            <div className="flex items-center gap-2">
              <button
                className="w-6 h-6 rounded-full glass flex items-center justify-center text-white/60 hover:text-white transition-colors text-xs"
                onClick={() => setPassengers(p => Math.max(1, p - 1))}
              >−</button>
              <span className="text-sm text-white font-medium w-4 text-center">{passengers}</span>
              <button
                className="w-6 h-6 rounded-full glass flex items-center justify-center text-white/60 hover:text-white transition-colors text-xs"
                onClick={() => setPassengers(p => Math.min(9, p + 1))}
              >+</button>
              <span className="text-xs text-white/40 ml-1">pax</span>
            </div>
          </div>
        </div>

        {/* Search button */}
        <div className="px-4 pb-4">
          <button
            onClick={search}
            disabled={!from || !to || !date}
            className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed text-base"
          >
            <Search size={18} />
            Search Flights
            <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
