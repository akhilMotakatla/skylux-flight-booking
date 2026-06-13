import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Plane, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { login, register } from '../services/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    setLoading(true)
    setError('')
    try {
      let user
      if (mode === 'login') {
        user = await login(email, password)
      } else {
        user = await register(name, email, password)
      }
      localStorage.setItem('skylux_token', user.token)
      navigate('/')
    } catch {
      setError(mode === 'login' ? 'Invalid email or password.' : 'Registration failed. Email may already be in use.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 pt-20 pb-10 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-electric-500/5 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-500/5 blur-[100px]" />

      <motion.div
        className="w-full max-w-md relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-electric-500 to-violet-500 flex items-center justify-center shadow-glow">
            <Plane size={22} className="text-white rotate-45" />
          </div>
          <h1 className="font-display font-bold text-2xl">
            Sky<span className="gradient-text">Lux</span>
          </h1>
        </div>

        {/* Card */}
        <div className="glass-strong border border-white/10 rounded-2xl p-8 shadow-card">
          {/* Mode toggle */}
          <div className="flex gap-1 p-1 glass rounded-xl mb-6">
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === m
                    ? 'bg-electric-500/20 border border-electric-500/30 text-white'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {mode === 'register' && (
              <div className="input-glass flex items-center gap-3">
                <User size={15} className="text-white/30 shrink-0" />
                <input
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
                  placeholder="Full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            )}

            <div className="input-glass flex items-center gap-3">
              <Mail size={15} className="text-white/30 shrink-0" />
              <input
                type="email"
                className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}
              />
            </div>

            <div className="input-glass flex items-center gap-3">
              <Lock size={15} className="text-white/30 shrink-0" />
              <input
                type={showPw ? 'text' : 'password'}
                className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}
              />
              <button
                className="text-white/30 hover:text-white/60 transition-colors"
                onClick={() => setShowPw(s => !s)}
                tabIndex={-1}
              >
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {error && (
              <motion.p
                className="text-red-400 text-xs text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.p>
            )}

            <button
              onClick={submit}
              disabled={loading || !email || !password || (mode === 'register' && !name)}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 mt-2 disabled:opacity-40"
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>

          {mode === 'login' && (
            <p className="text-center text-xs text-white/30 mt-4">
              Demo: use any registered account or create one above
            </p>
          )}
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          By continuing, you agree to SkyLux's Terms and Privacy Policy
        </p>
      </motion.div>
    </main>
  )
}
