import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, Minimize2, Sparkles } from 'lucide-react'
import type { ChatMessage } from '../../types'

const GREETINGS = [
  "Hi! I'm SkyAI, your personal travel assistant. Where would you like to fly today?",
]

const SUGGESTIONS = [
  'Best deals from Dubai this week',
  'Business class to London',
  'Last minute flights to Tokyo',
  'Compare Emirates vs Qatar Airways',
]

function autoReply(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes('business') || m.includes('first class'))
    return "Great choice! Business class flights start from $899. Emirates and Qatar Airways offer exceptional business class suites. Want me to search available dates?"
  if (m.includes('cheap') || m.includes('deal') || m.includes('best price'))
    return "I found great deals! Economy flights from $149. The cheapest upcoming dates are Tue/Wed departures. Shall I show you the cheapest month to fly?"
  if (m.includes('dubai') || m.includes('dxb'))
    return "Dubai is a fantastic destination! Direct flights available from major hubs. Emirates offers 3x daily flights from London, and prices start from $449 round trip."
  if (m.includes('london') || m.includes('lhr'))
    return "London flights are very popular! British Airways and Virgin Atlantic offer excellent service. Economy from $320, Business from $1,200. Want me to check availability for specific dates?"
  if (m.includes('cancel') || m.includes('refund'))
    return "I can help with cancellations. Most SkyLux bookings offer free cancellation within 24 hours. For later cancellations, fees depend on your fare type. Would you like me to pull up your booking?"
  if (m.includes('visa') || m.includes('passport'))
    return "I can provide general visa guidance! For most destinations, check official embassy websites. Need specific info for a country? Tell me where you're headed and your nationality."
  return "I'd love to help! Could you tell me more about your travel plans — departure city, destination, or travel dates? I can find the best options for you."
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'assistant', content: GREETINGS[0], timestamp: new Date() }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = async (text: string) => {
    if (!text.trim()) return
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() }
    setMessages(m => [...m, userMsg])
    setInput('')
    setTyping(true)
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600))
    setTyping(false)
    const reply: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: autoReply(text),
      timestamp: new Date(),
    }
    setMessages(m => [...m, reply])
  }

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!open && (
          <motion.button
            className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl bg-gradient-to-br from-electric-500 to-violet-500 flex items-center justify-center shadow-glow"
            onClick={() => setOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bot size={22} className="text-white" />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-2xl animate-ping bg-electric-500/30" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 w-[360px] flex flex-col"
            style={{ height: minimized ? 'auto' : '520px' }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="glass-strong border border-white/10 rounded-t-2xl px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-electric-500 to-violet-500 flex items-center justify-center">
                <Bot size={14} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold flex items-center gap-1.5">
                  SkyAI <Sparkles size={10} className="text-gold-400" />
                </div>
                <div className="text-[10px] text-white/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </div>
              </div>
              <button className="p-1.5 rounded-lg glass text-white/40 hover:text-white transition-colors" onClick={() => setMinimized(m => !m)}>
                <Minimize2 size={12} />
              </button>
              <button className="p-1.5 rounded-lg glass text-white/40 hover:text-white transition-colors" onClick={() => setOpen(false)}>
                <X size={12} />
              </button>
            </div>

            {/* Body */}
            <AnimatePresence>
              {!minimized && (
                <motion.div
                  className="flex-1 flex flex-col glass-strong border-x border-white/10 overflow-hidden"
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                >
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: '340px' }}>
                    {messages.map(m => (
                      <div key={m.id} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {m.role === 'assistant' && (
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-electric-500 to-violet-500 flex items-center justify-center shrink-0 mt-0.5">
                            <Bot size={10} className="text-white" />
                          </div>
                        )}
                        <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                          m.role === 'user'
                            ? 'bg-electric-500/20 border border-electric-500/30 text-white'
                            : 'glass border border-white/10 text-white/80'
                        }`}>
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {typing && (
                      <div className="flex gap-2 items-center">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-electric-500 to-violet-500 flex items-center justify-center shrink-0">
                          <Bot size={10} className="text-white" />
                        </div>
                        <div className="glass border border-white/10 px-3 py-2 rounded-xl flex gap-1">
                          {[0,1,2].map(i => (
                            <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
                          ))}
                        </div>
                      </div>
                    )}
                    <div ref={bottomRef} />
                  </div>

                  {/* Quick suggestions */}
                  {messages.length === 1 && (
                    <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                      {SUGGESTIONS.map(s => (
                        <button
                          key={s}
                          onClick={() => send(s)}
                          className="text-[11px] px-2.5 py-1 rounded-full glass border border-white/10 text-white/50 hover:text-white hover:border-electric-500/40 transition-all"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="glass-strong border border-white/10 rounded-b-2xl p-3 flex gap-2">
              <input
                className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
                placeholder="Ask me anything about flights..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send(input)}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-500 to-violet-500 flex items-center justify-center disabled:opacity-40 hover:shadow-glow-sm transition-all"
              >
                <Send size={13} className="text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
