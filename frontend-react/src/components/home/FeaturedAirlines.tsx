import { motion } from 'framer-motion'

const AIRLINES = [
  { code: 'EK', name: 'Emirates' },
  { code: 'QR', name: 'Qatar Airways' },
  { code: 'SQ', name: 'Singapore Airlines' },
  { code: 'LH', name: 'Lufthansa' },
  { code: 'BA', name: 'British Airways' },
  { code: 'AF', name: 'Air France' },
  { code: 'AA', name: 'American Airlines' },
  { code: 'UA', name: 'United Airlines' },
  { code: 'NH', name: 'All Nippon Airways' },
  { code: 'CX', name: 'Cathay Pacific' },
  { code: 'TK', name: 'Turkish Airlines' },
  { code: 'KL', name: 'KLM' },
]

function AirlineLogo({ code, name }: { code: string; name: string }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl glass hover:bg-white/5 transition-all cursor-default group shrink-0">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden">
        <img
          src={`https://www.gstatic.com/flights/airline_logos/70px/${code}.png`}
          alt={name}
          className="w-9 h-9 object-contain"
          onError={e => {
            const img = e.target as HTMLImageElement
            img.style.display = 'none'
            const sibling = img.nextElementSibling as HTMLElement
            if (sibling) sibling.style.display = 'flex'
          }}
        />
        <span
          className="hidden w-full h-full items-center justify-center font-mono font-bold text-xs text-electric-400"
          style={{ display: 'none' }}
        >
          {code}
        </span>
      </div>
      <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors text-center whitespace-nowrap max-w-[80px] truncate">
        {name}
      </span>
    </div>
  )
}

export default function FeaturedAirlines() {
  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="text-center">
          <span className="section-label">Partners</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mt-3">
            World-Class <span className="gradient-text">Airlines</span>
          </h2>
          <p className="text-white/40 mt-4 max-w-md mx-auto">
            We partner with over 500 airlines to bring you the best routes and prices globally.
          </p>
        </div>
      </div>

      {/* Marquee row 1 */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-dark-950 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-dark-950 to-transparent z-10" />
        <div className="flex animate-marquee">
          {[...AIRLINES, ...AIRLINES].map((a, i) => (
            <AirlineLogo key={`${a.code}-${i}`} code={a.code} name={a.name} />
          ))}
        </div>
      </div>

      {/* Marquee row 2 (reverse) */}
      <div className="relative mt-4">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-dark-950 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-dark-950 to-transparent z-10" />
        <div className="flex animate-marquee [animation-direction:reverse] [animation-delay:-3s]">
          {[...AIRLINES, ...AIRLINES].map((a, i) => (
            <AirlineLogo key={`rev-${a.code}-${i}`} code={a.code} name={a.name} />
          ))}
        </div>
      </div>
    </section>
  )
}
