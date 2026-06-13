import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const STATS = [
  { label: 'Happy Travelers', value: 2400000, suffix: '+', prefix: '' },
  { label: 'Destinations', value: 850, suffix: '+', prefix: '' },
  { label: 'Airlines Partnered', value: 520, suffix: '', prefix: '' },
  { label: 'Avg. Savings', value: 34, suffix: '%', prefix: 'Up to ' },
]

function Counter({ value, suffix, prefix }: { value: number; suffix: string; prefix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const duration = 1800
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * value))
      if (progress < 1) requestAnimationFrame(tick)
      else setCount(value)
    }
    requestAnimationFrame(tick)
  }, [inView, value])

  const formatted = count >= 1000000
    ? `${(count / 1000000).toFixed(1)}M`
    : count >= 1000
    ? `${(count / 1000).toFixed(0)}K`
    : String(count)

  return (
    <span ref={ref} className="font-display font-black text-4xl md:text-5xl gradient-text">
      {prefix}{formatted}{suffix}
    </span>
  )
}

export default function Stats() {
  return (
    <section className="py-24 relative">
      {/* Top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className="flex flex-col items-center text-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <Counter value={s.value} suffix={s.suffix} prefix={s.prefix} />
              <span className="text-white/40 text-sm font-medium">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
