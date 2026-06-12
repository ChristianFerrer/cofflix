import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CircleCheck } from 'lucide-react'
import { Logo, btn } from '../components/ui'
import { useAuth } from '../auth/AuthProvider'

const inputCls =
  'w-full rounded-xl border border-line bg-surface2 px-4 py-2.5 text-snow placeholder:text-mist outline-none transition focus:border-lime/50 focus:ring-2 focus:ring-lime/20'

export default function ResetPassword() {
  const { session, updatePassword } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    if (password.length < 6) return setErr('La contraseña debe tener al menos 6 caracteres.')
    if (password !== confirm) return setErr('Las contraseñas no coinciden.')
    setBusy(true)
    const { error } = await updatePassword(password)
    setBusy(false)
    if (error) setErr(error)
    else {
      setDone(true)
      setTimeout(() => navigate('/app', { replace: true }), 1500)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-glow px-6 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-3xl border border-line bg-surface p-8 shadow-lift">
          <h1 className="font-display text-2xl font-semibold text-snow">Nueva contraseña</h1>

          {done ? (
            <div className="mt-6 rounded-2xl border border-mint/30 bg-mint-soft p-5 text-center">
              <CircleCheck size={28} className="mx-auto text-mint" />
              <p className="mt-2 text-sm text-snow">Contraseña actualizada. Entrando…</p>
            </div>
          ) : !session ? (
            <p className="mt-3 text-sm text-fog">
              Abre el enlace de recuperación desde tu correo para llegar aquí.{' '}
              <Link to="/login" className="font-semibold text-lime">Volver a entrar</Link>.
            </p>
          ) : (
            <>
              <p className="mt-1 text-sm text-fog">Crea una contraseña nueva para tu cuenta.</p>
              <form onSubmit={submit} className="mt-6 space-y-3">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nueva contraseña" autoComplete="new-password" className={inputCls} />
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repite la contraseña" autoComplete="new-password" className={inputCls} />
                <button type="submit" disabled={busy} className={`${btn('primary', 'lg')} w-full disabled:opacity-50`}>
                  {busy ? 'Guardando…' : 'Guardar contraseña'}
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
