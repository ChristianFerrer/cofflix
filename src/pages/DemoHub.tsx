import { Link } from 'react-router-dom'
import { Receipt, UserPlus, ChartNoAxesColumn, ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react'
import { Logo, Badge } from '../components/ui'
import { useStore } from '../store'

const CARDS = [
  {
    to: '/demo/caja',
    icon: Receipt,
    title: 'Pantalla de caja',
    text: 'Lo que ve tu equipo en la barra: verifica al socio y aplica el tope diario en 2 segundos.',
  },
  {
    to: '/demo/alta',
    icon: UserPlus,
    title: 'Alta de socio',
    text: 'El cliente escanea un QR, se apunta y paga en menos de un minuto. Sin apps.',
  },
  {
    to: '/demo/panel',
    icon: ChartNoAxesColumn,
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
        <Link to="/" className="flex items-center gap-1.5 text-sm font-medium text-mocha transition hover:text-espresso">
          <ArrowLeft size={16} /> Volver a la web
        </Link>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="max-w-2xl animate-fade-up">
          <Badge>Demo interactiva · datos de ejemplo</Badge>
          <h1 className="mt-5 font-display text-3xl font-semibold leading-tight text-espresso sm:text-[2.75rem]">
            Así funciona Cofflix en {config.cafeName}.
          </h1>
          <p className="mt-4 text-mocha">
            Tres pantallas, una para cada momento: la barra, el alta del cliente y el control del
            negocio. Todo con datos simulados — toca, prueba y, si te lías, pulsa «Reiniciar».
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {CARDS.map((c, i) => {
            const Icon = c.icon
            return (
              <Link
                key={c.to}
                to={c.to}
                className={`group animate-fade-up delay-${i + 1} rounded-3xl border border-sand/70 bg-paper p-7 shadow-soft transition hover:-translate-y-1 hover:shadow-lift`}
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-coffee text-latte transition group-hover:bg-espresso">
                  <Icon size={22} strokeWidth={2} />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-espresso">{c.title}</h3>
                <p className="mt-2 text-sm text-mocha">{c.text}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-caramel transition group-hover:gap-2.5">
                  Abrir <ArrowRight size={16} strokeWidth={2.2} />
                </span>
              </Link>
            )
          })}
        </div>

        <div className="mt-10 flex items-start gap-3 rounded-2xl border border-sand/70 bg-cream/60 p-5 text-sm text-mocha">
          <Lightbulb size={20} className="mt-0.5 shrink-0 text-caramel" />
          <p>
            <strong className="text-espresso">Para la presentación:</strong> empieza por la pantalla
            de caja (toca un socio para ver el verde/rojo y el tope), luego da de alta a alguien en
            «Alta de socio» y comprueba cómo aparece al instante en la caja y en el panel.
          </p>
        </div>
      </main>
    </div>
  )
}
