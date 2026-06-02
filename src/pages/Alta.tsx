import { useState } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { CircleCheck, ScanLine, ArrowRight, UserPlus } from 'lucide-react'
import { DemoShell, btn, eur } from '../components/ui'
import { useStore } from '../store'

export default function Alta() {
  const { config, addMember, favorites } = useStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [favorite, setFavorite] = useState(favorites[0])
  const [done, setDone] = useState<string | null>(null)

  const clubUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}#/club`
      : 'https://cofflix.app/club'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    addMember(name, email || `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@email.com`, favorite)
    setDone(name.trim())
    setName('')
    setEmail('')
  }

  if (done) {
    return (
      <DemoShell title="Alta de socio">
        <div className="mx-auto max-w-md animate-fade-up rounded-3xl border border-sand/70 bg-paper p-8 text-center shadow-lift">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint-soft text-mint">
            <CircleCheck size={36} strokeWidth={2} />
          </div>
          <h2 className="mt-4 font-display text-2xl font-semibold text-espresso">
            ¡Bienvenido al club, {done}!
          </h2>
          <p className="mt-2 text-mocha">
            Ya eres socio de {config.cafeName}. A partir de mañana, solo da tu nombre en la barra.
          </p>
          <div className="mt-6 rounded-2xl bg-cream px-4 py-4 text-sm text-espresso">
            Cobro de {eur(config.clubPrice)}/mes activado · 1 café/día incluido · {config.perk}
          </div>
          <div className="mt-6 flex flex-col gap-2.5">
            <button onClick={() => setDone(null)} className={btn('primary')}>
              <UserPlus size={17} strokeWidth={2.2} /> Dar de alta a otro socio
            </button>
            <Link
              to="/demo/caja"
              className="flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-mocha transition hover:text-espresso"
            >
              Ver cómo aparece en caja <ArrowRight size={15} strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </DemoShell>
    )
  }

  return (
    <DemoShell title="Alta de socio" subtitle="El cliente se apunta en menos de un minuto, sin instalar nada.">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* QR — lo que ve el cliente en la barra */}
        <div className="flex flex-col items-center justify-center rounded-3xl bg-warm bg-grain p-8 text-center text-cream shadow-soft">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-latte">
            <ScanLine size={16} /> En la barra
          </div>
          <h2 className="mt-2 font-display text-xl font-semibold">Escanea para unirte al club</h2>
          <div className="mt-6 rounded-2xl bg-white p-4 shadow-lift">
            <QRCodeSVG value={clubUrl} size={172} fgColor="#2c1c11" bgColor="#ffffff" />
          </div>
          <p className="mt-6 max-w-xs text-sm text-cream/70">
            El cliente apunta con la cámara, rellena sus datos y paga. El alta tarda menos de un
            minuto.
          </p>
        </div>

        {/* Formulario — lo que rellena el cliente */}
        <form onSubmit={handleSubmit} className="rounded-3xl border border-sand/70 bg-paper p-8 shadow-soft">
          <h2 className="font-display text-xl font-semibold text-espresso">Hazte socio</h2>
          <p className="mt-1 text-sm text-mocha">
            Club {config.cafeName} · {eur(config.clubPrice)}/mes
          </p>

          <label className="mt-6 block text-sm font-medium text-espresso">
            Nombre
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="mt-1.5 w-full rounded-xl border border-sand bg-foam px-4 py-2.5 outline-none transition focus:border-caramel focus:ring-2 focus:ring-caramel/20"
            />
          </label>

          <label className="mt-4 block text-sm font-medium text-espresso">
            Email <span className="font-normal text-clay">(opcional)</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="mt-1.5 w-full rounded-xl border border-sand bg-foam px-4 py-2.5 outline-none transition focus:border-caramel focus:ring-2 focus:ring-caramel/20"
            />
          </label>

          <label className="mt-4 block text-sm font-medium text-espresso">
            Tu café habitual
            <select
              value={favorite}
              onChange={(e) => setFavorite(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-sand bg-foam px-4 py-2.5 outline-none transition focus:border-caramel focus:ring-2 focus:ring-caramel/20"
            >
              {favorites.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </label>

          <button type="submit" className={`${btn('primary', 'lg')} mt-6 w-full`}>
            Unirme y pagar {eur(config.clubPrice)}/mes
          </button>
          <p className="mt-3 text-center text-xs text-clay">Demo: no se realiza ningún cobro real.</p>
        </form>
      </div>
    </DemoShell>
  )
}
