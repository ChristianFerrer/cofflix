import { Link } from 'react-router-dom'
import { Logo } from '../components/ui'
import { useStore } from '../store'

const CARDS = [
  {
    to: '/demo/caja',
    icon: '🧾',
    title: 'Pantalla de caja',
    text: 'Lo que ve tu equipo en la barra: verifica al socio y aplica el tope diario en 2 segundos.',
  },
  {
    to: '/demo/alta',
    icon: '➕',
    title: 'Alta de socio',
    text: 'El cliente escanea un QR, se apunta y paga en menos de un minuto. Sin apps.',
  },
  {
    to: '/demo/panel',
    icon: '📊',
    title: 'Panel del dueño',
    text: 'Ingresos del club, margen protegido, fidelización y clientes en riesgo de fuga.',
  },
]

export default function DemoHub() {
  const { config } = useStore()
  return (
    <div className="min-h-screen bg-foam">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Logo />
        <Link to="/" className="text-sm font-medium text-mocha hover:opacity-70">
          ← Volver a la web
        </Link>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="max-w-2xl">
          <span className="inline-block rounded-full bg-cream px-3 py-1 text-xs font-semibold uppercase tracking-wide text-caramel">
            Demo interactiva · datos de ejemplo
          </span>
          <h1 className="mt-4 text-3xl font-bold text-espresso sm:text-4xl">
            Así funciona Cofflix en {config.cafeName}.
          </h1>
          <p className="mt-3 text-mocha">
            Tres pantallas, una para cada momento: la barra, el alta del cliente y el control del
            negocio. Todo con datos simulados — toca, prueba y, si te lías, pulsa «Reiniciar demo».
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {CARDS.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group rounded-3xl bg-white p-7 shadow-sm ring-1 ring-cream transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream text-2xl">
                {c.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold text-espresso">{c.title}</h3>
              <p className="mt-2 text-sm text-mocha">{c.text}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-caramel group-hover:translate-x-1">
                Abrir →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-cream/70 p-5 text-sm text-mocha">
          <strong className="text-espresso">Para la presentación:</strong> empieza por la pantalla
          de caja (toca un socio para ver el verde/rojo y el tope), luego da de alta a alguien en
          «Alta de socio» y comprueba cómo aparece al instante en la caja y en el panel.
        </div>
      </main>
    </div>
  )
}
