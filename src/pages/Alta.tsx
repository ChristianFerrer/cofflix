import { useState } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { DemoShell, eur } from '../components/ui'
import { useStore } from '../store'

export default function Alta() {
  const { config, addMember, favorites } = useStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [favorite, setFavorite] = useState(favorites[0])
  const [done, setDone] = useState<string | null>(null)

  const clubUrl =
    typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#/club` : 'https://cofflix.app/club'

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
        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-cream">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint/15 text-3xl">
            🎉
          </div>
          <h2 className="mt-4 text-2xl font-bold text-espresso">¡Bienvenido al club, {done}!</h2>
          <p className="mt-2 text-mocha">
            Ya eres socio de {config.cafeName}. A partir de mañana, solo da tu nombre en la barra.
          </p>
          <div className="mt-6 rounded-2xl bg-cream/70 p-4 text-sm text-espresso">
            Cobro de {eur(config.clubPrice)}/mes activado · 1 café/día incluido · {config.perk}
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => setDone(null)}
              className="rounded-full bg-coffee py-3 font-semibold text-cream transition hover:bg-espresso"
            >
              Dar de alta a otro socio
            </button>
            <Link to="/demo/caja" className="rounded-full py-3 text-sm font-medium text-mocha hover:underline">
              Ver cómo aparece en caja →
            </Link>
          </div>
        </div>
      </DemoShell>
    )
  }

  return (
    <DemoShell title="Alta de socio">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* QR — lo que ve el cliente en la barra */}
        <div className="rounded-3xl bg-coffee bg-grain p-8 text-center text-cream">
          <div className="text-sm font-semibold uppercase tracking-wide text-latte">
            En la barra
          </div>
          <h2 className="mt-2 text-xl font-bold">Escanea para unirte al club</h2>
          <div className="mx-auto mt-6 w-fit rounded-2xl bg-white p-4">
            <QRCodeSVG value={clubUrl} size={172} fgColor="#2a1a0f" bgColor="#ffffff" />
          </div>
          <p className="mx-auto mt-6 max-w-xs text-sm text-cream/70">
            El cliente apunta con la cámara, rellena sus datos y paga. Sin instalar nada. El alta
            tarda menos de un minuto.
          </p>
        </div>

        {/* Formulario — lo que rellena el cliente */}
        <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-cream">
          <h2 className="text-xl font-bold text-espresso">Hazte socio</h2>
          <p className="mt-1 text-sm text-mocha">Club {config.cafeName} · {eur(config.clubPrice)}/mes</p>

          <label className="mt-6 block text-sm font-medium text-espresso">
            Nombre
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="mt-1 w-full rounded-xl border border-cream bg-foam px-4 py-2.5 outline-none focus:border-caramel"
            />
          </label>

          <label className="mt-4 block text-sm font-medium text-espresso">
            Email <span className="font-normal text-mocha">(opcional)</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="mt-1 w-full rounded-xl border border-cream bg-foam px-4 py-2.5 outline-none focus:border-caramel"
            />
          </label>

          <label className="mt-4 block text-sm font-medium text-espresso">
            Tu café habitual
            <select
              value={favorite}
              onChange={(e) => setFavorite(e.target.value)}
              className="mt-1 w-full rounded-xl border border-cream bg-foam px-4 py-2.5 outline-none focus:border-caramel"
            >
              {favorites.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-coffee py-3.5 font-semibold text-cream transition hover:bg-espresso"
          >
            Unirme y pagar {eur(config.clubPrice)}/mes
          </button>
          <p className="mt-3 text-center text-xs text-mocha">
            Demo: no se realiza ningún cobro real.
          </p>
        </form>
      </div>
    </DemoShell>
  )
}
