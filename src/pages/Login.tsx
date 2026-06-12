import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { Mail, ArrowLeft, CircleCheck } from 'lucide-react'
import { Logo, btn } from '../components/ui'
import { useAuth } from '../auth/AuthProvider'
import { isSupabaseConfigured } from '../lib/supabase'

export default function Login() {
  const { session, loading, signInWithGoogle, signInWithEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!loading && session) return <Navigate to="/app" replace />

  async function magicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setBusy(true)
    setErr(null)
    const { error } = await signInWithEmail(email.trim())
    setBusy(false)
    if (error) setErr(error)
    else setSent(true)
  }

  return (
    <div className="grid min-h-screen place-items-center bg-glow px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-3xl border border-line bg-surface p-8 shadow-lift">
          <h1 className="font-display text-2xl font-semibold text-snow">Entra a tu panel</h1>
          <p className="mt-1 text-sm text-fog">Para dueños de café y equipo de Coffee Me.</p>

          {!isSupabaseConfigured && (
            <div className="mt-4 rounded-xl border border-rose/30 bg-rose-soft px-3 py-2 text-xs text-rose">
              Faltan las variables VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.
            </div>
          )}

          {sent ? (
            <div className="mt-6 rounded-2xl border border-mint/30 bg-mint-soft p-5 text-center">
              <CircleCheck size={28} className="mx-auto text-mint" />
              <p className="mt-2 text-sm text-snow">Te enviamos un enlace de acceso a <strong>{email}</strong>.</p>
              <p className="mt-1 text-xs text-fog">Ábrelo en este dispositivo para entrar.</p>
            </div>
          ) : (
            <>
              <button onClick={signInWithGoogle} className={`${btn('accent', 'lg')} mt-6 w-full`}>
                <GoogleIcon /> Continuar con Google
              </button>

              <div className="my-5 flex items-center gap-3 text-xs text-mist">
                <span className="h-px flex-1 bg-line" /> o con tu email <span className="h-px flex-1 bg-line" />
              </div>

              <form onSubmit={magicLink} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full rounded-xl border border-line bg-surface2 px-4 py-2.5 text-snow placeholder:text-mist outline-none transition focus:border-lime/50 focus:ring-2 focus:ring-lime/20"
                />
                <button type="submit" disabled={busy} className={`${btn('outline', 'lg')} w-full disabled:opacity-50`}>
                  <Mail size={17} strokeWidth={2.2} /> {busy ? 'Enviando…' : 'Enviar enlace de acceso'}
                </button>
              </form>
              {err && <p className="mt-3 text-center text-xs text-rose">{err}</p>}
            </>
          )}
        </div>

        <Link to="/" className="mt-6 flex items-center justify-center gap-1.5 text-sm text-fog transition hover:text-snow">
          <ArrowLeft size={15} /> Volver a la web
        </Link>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  )
}
