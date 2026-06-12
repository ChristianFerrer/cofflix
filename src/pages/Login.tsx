import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { ArrowLeft, CircleCheck } from 'lucide-react'
import { Logo, btn } from '../components/ui'
import { useAuth } from '../auth/AuthProvider'
import { isSupabaseConfigured } from '../lib/supabase'

type Mode = 'signin' | 'signup' | 'forgot'

const inputCls =
  'w-full rounded-xl border border-line bg-surface2 px-4 py-2.5 text-snow placeholder:text-mist outline-none transition focus:border-lime/50 focus:ring-2 focus:ring-lime/20'

export default function Login() {
  const { session, loading, signInWithGoogle, signIn, signUp, resetPassword } = useAuth()
  const [mode, setMode] = useState<Mode>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!loading && session) return <Navigate to="/app" replace />

  function switchMode(m: Mode) {
    setMode(m)
    setErr(null)
    setNotice(null)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    setNotice(null)
    if (!email.trim()) return
    setBusy(true)
    if (mode === 'signin') {
      const { error } = await signIn(email.trim(), password)
      if (error) setErr(traducir(error))
    } else if (mode === 'signup') {
      if (password.length < 6) {
        setErr('La contraseña debe tener al menos 6 caracteres.')
        setBusy(false)
        return
      }
      const { error, needsConfirm } = await signUp(email.trim(), password, name.trim())
      if (error) setErr(traducir(error))
      else if (needsConfirm) setNotice(`Te enviamos un email a ${email} para confirmar tu cuenta.`)
    } else {
      const { error } = await resetPassword(email.trim())
      if (error) setErr(traducir(error))
      else setNotice(`Te enviamos un enlace a ${email} para restablecer tu contraseña.`)
    }
    setBusy(false)
  }

  const title = mode === 'signup' ? 'Crea tu cuenta' : mode === 'forgot' ? 'Recupera tu acceso' : 'Entra a tu panel'
  const cta = mode === 'signup' ? 'Crear cuenta' : mode === 'forgot' ? 'Enviar enlace' : 'Entrar'

  return (
    <div className="grid min-h-screen place-items-center bg-glow px-6 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-3xl border border-line bg-surface p-8 shadow-lift">
          <h1 className="font-display text-2xl font-semibold text-snow">{title}</h1>
          <p className="mt-1 text-sm text-fog">
            {mode === 'forgot'
              ? 'Te enviaremos un enlace para crear una nueva contraseña.'
              : 'Para dueños de café y equipo de Coffee Me.'}
          </p>

          {!isSupabaseConfigured && (
            <div className="mt-4 rounded-xl border border-rose/30 bg-rose-soft px-3 py-2 text-xs text-rose">
              Faltan las variables VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.
            </div>
          )}

          {notice ? (
            <div className="mt-6 rounded-2xl border border-mint/30 bg-mint-soft p-5 text-center">
              <CircleCheck size={28} className="mx-auto text-mint" />
              <p className="mt-2 text-sm text-snow">{notice}</p>
              <button onClick={() => switchMode('signin')} className="mt-3 text-xs font-semibold text-lime">
                Volver a entrar
              </button>
            </div>
          ) : (
            <>
              {mode !== 'forgot' && (
                <>
                  <button onClick={signInWithGoogle} className={`${btn('accent', 'lg')} mt-6 w-full`}>
                    <GoogleIcon /> Continuar con Google
                  </button>
                  <div className="my-5 flex items-center gap-3 text-xs text-mist">
                    <span className="h-px flex-1 bg-line" /> o con tu email <span className="h-px flex-1 bg-line" />
                  </div>
                </>
              )}

              <form onSubmit={submit} className={`space-y-3 ${mode === 'forgot' ? 'mt-6' : ''}`}>
                {mode === 'signup' && (
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" className={inputCls} />
                )}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  autoComplete="email"
                  className={inputCls}
                />
                {mode !== 'forgot' && (
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    className={inputCls}
                  />
                )}
                <button type="submit" disabled={busy} className={`${btn('primary', 'lg')} w-full disabled:opacity-50`}>
                  {busy ? 'Un momento…' : cta}
                </button>
              </form>
              {err && <p className="mt-3 text-center text-xs text-rose">{err}</p>}

              <div className="mt-5 space-y-1.5 text-center text-xs text-fog">
                {mode === 'signin' && (
                  <>
                    <button onClick={() => switchMode('forgot')} className="block w-full hover:text-snow">
                      ¿Olvidaste tu contraseña?
                    </button>
                    <button onClick={() => switchMode('signup')} className="block w-full hover:text-snow">
                      ¿Nuevo en Coffee Me? <span className="font-semibold text-lime">Crea tu cuenta</span>
                    </button>
                  </>
                )}
                {mode === 'signup' && (
                  <button onClick={() => switchMode('signin')} className="block w-full hover:text-snow">
                    ¿Ya tienes cuenta? <span className="font-semibold text-lime">Entra</span>
                  </button>
                )}
                {mode === 'forgot' && (
                  <button onClick={() => switchMode('signin')} className="block w-full hover:text-snow">
                    Volver a entrar
                  </button>
                )}
              </div>
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

function traducir(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes('invalid login credentials')) return 'Email o contraseña incorrectos.'
  if (m.includes('email not confirmed')) return 'Confirma tu email antes de entrar (revisa tu correo).'
  if (m.includes('user already registered')) return 'Ese email ya tiene cuenta. Entra o recupera la contraseña.'
  if (m.includes('password')) return 'La contraseña debe tener al menos 6 caracteres.'
  return msg
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
