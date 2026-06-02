import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CreditCard,
  ScanLine,
  ShieldCheck,
  Check,
  X,
  TrendingDown,
  Clock,
  Database,
  RefreshCcw,
  Coffee,
} from 'lucide-react'
import { SiteNav, Logo, Badge, btn, eur } from '../components/ui'

const STEPS = [
  {
    icon: CreditCard,
    title: 'Cobro automático',
    text: 'Tus socios pagan por adelantado cada mes. Gestionamos cobros, tarjetas que fallan y bajas. Tú no persigues a nadie.',
  },
  {
    icon: ShieldCheck,
    title: 'Control en la barra',
    text: 'En caja, tu equipo ve en 2 segundos si es socio y cuántos cafés lleva hoy. El tope diario hace imposible perder margen.',
  },
  {
    icon: ScanLine,
    title: 'Alta en 60 segundos',
    text: 'El cliente escanea un QR, paga y ya es socio. Sin formularios, sin instalar apps, sin que tu equipo aprenda nada nuevo.',
  },
]

const PROBLEMS = [
  { icon: Clock, t: 'Horas muertas', d: 'sin un motivo para que el cliente vuelva' },
  { icon: Database, t: 'Cero datos', d: 'no sabes quién es tu mejor cliente' },
  { icon: RefreshCcw, t: 'Sin recurrencia', d: 'cada mes empiezas otra vez de cero' },
]

const FAQ = [
  {
    q: '«Esto lo hago yo con un Excel y un Bizum».',
    a: 'Con 15 socios, sí — y deberías. El problema llega a los 40: persigues impagos uno a uno y en caja nadie sabe quién es socio ni cuántos lleva. Ahí se te escapa el dinero y el tiempo. Te quitamos justo esa parte.',
  },
  {
    q: '¿Y si regalo demasiado café?',
    a: 'Imposible. Defines un tope (ej. 1 café al día). El sistema lo aplica solo en caja. Cada socio tiene un punto de equilibrio claro y nunca lo cruzas.',
  },
  {
    q: '¿Mis clientes pagarán una cuota?',
    a: 'Lo comprobamos sin que te cueste un euro: lanzamos un piloto con tus 20 mejores clientes. Si no pican, no montamos nada y no pagas. El riesgo es nuestro.',
  },
  {
    q: '¿Tengo que aprender otra herramienta?',
    a: 'El cliente se da de alta solo. Tu equipo solo ve una pantalla que dice verde o rojo. Si necesita manual, lo hemos hecho mal.',
  },
]

const PRICE_FEATURES = [
  'Cobro recurrente y gestión de impagos',
  'Control de socios y tope diario en caja',
  'Alta de socios por QR, sin apps',
  'Panel con tus métricas y clientes en riesgo',
  'Sin comisión por venta · cancela cuando quieras',
]

export default function LandingB2B() {
  const clubPrice = 30
  const saas = 69

  return (
    <div className="bg-foam">
      <SiteNav light />

      {/* HERO */}
      <section className="relative overflow-hidden bg-warm bg-grain text-cream">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-36 sm:pt-44 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="animate-fade-up">
              <Badge tone="dark">Para cafés de especialidad</Badge>
            </div>
            <h1 className="animate-fade-up delay-1 mt-6 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Tus clientes de siempre,{' '}
              <span className="text-latte">socios que pagan por adelantado.</span>
            </h1>
            <p className="animate-fade-up delay-2 mt-6 max-w-xl text-lg text-cream/75">
              Cofflix es el club de café que llena tus horas muertas y fideliza a tus regulares. Sin
              papeleo y sin perder margen. Tú solo sirves café.
            </p>
            <div className="animate-fade-up delay-3 mt-9 flex flex-wrap gap-3">
              <Link to="/demo" className={btn('accent', 'lg')}>
                Ver la demo en 2 min <ArrowRight size={18} strokeWidth={2.2} />
              </Link>
              <Link to="/club" className={btn('outlineLight', 'lg')}>
                Ver el club del cliente
              </Link>
            </div>
            <p className="animate-fade-up delay-4 mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-cream/55">
              <span className="flex items-center gap-1.5"><Check size={15} /> Sin comisión por venta</span>
              <span className="flex items-center gap-1.5"><Check size={15} /> Cuota fija {eur(saas)}/mes</span>
              <span className="flex items-center gap-1.5"><Check size={15} /> Cancela cuando quieras</span>
            </p>
          </div>

          {/* Mockup del producto */}
          <div className="animate-fade-in delay-3 relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-latte/10 blur-2xl" />
            <div className="relative rounded-[2rem] border border-cream/10 bg-espresso/60 p-3 shadow-lift backdrop-blur">
              <div className="rounded-[1.5rem] bg-foam p-5 text-ink">
                <div className="flex items-center justify-between text-xs text-mocha">
                  <span className="font-semibold uppercase tracking-wide">Caja · Cal Cafè</span>
                  <Coffee size={16} className="text-caramel" />
                </div>
                <div className="mt-4 rounded-2xl bg-mint px-4 py-5 text-center text-white">
                  <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-white/20">
                    <Check size={26} strokeWidth={3} />
                  </div>
                  <div className="mt-2 font-display text-lg font-semibold">Socio activo</div>
                  <div className="text-sm text-white/85">Café incluido · le queda 1 hoy</div>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-paper px-3 py-2.5 shadow-soft">
                  <div>
                    <div className="text-sm font-semibold text-espresso">Laura Vidal</div>
                    <div className="text-xs text-mocha">Flat white · 24 cafés/mes</div>
                  </div>
                  <div className="rounded-full bg-coffee px-3 py-1.5 text-xs font-semibold text-cream">
                    Registrar
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold leading-tight text-espresso sm:text-[2.5rem]">
              Tu café es bueno. Tus ingresos, impredecibles.
            </h2>
            <p className="mt-5 text-mocha">
              Conoces a tus mejores clientes de cara, pero no tienes forma de que vuelvan más a
              menudo ni de saber quiénes son. Las mañanas flojean, la competencia está a 50 metros y
              cada mes empiezas de cero.
            </p>
            <p className="mt-4 text-mocha">
              Un club de socios resuelve eso —ingreso recurrente y regulares que eligen tu barra—
              pero montarlo a mano da pereza y miedo a regalar margen. Por eso casi nadie lo hace
              bien.
            </p>
          </div>
          <div className="space-y-3">
            {PROBLEMS.map(({ icon: Icon, t, d }) => (
              <div key={t} className="flex items-start gap-4 rounded-2xl border border-sand/70 bg-paper p-5 shadow-soft">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-berry-soft text-berry">
                  <Icon size={20} strokeWidth={2} />
                </span>
                <div>
                  <div className="flex items-center gap-2 font-semibold text-espresso">
                    <X size={15} className="text-berry" /> {t}
                  </div>
                  <div className="mt-0.5 text-sm text-mocha">{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="border-y border-sand/60 bg-cream/50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-xl text-center">
            <Badge>Cómo funciona</Badge>
            <h2 className="mt-4 font-display text-3xl font-semibold text-espresso sm:text-[2.5rem]">
              Tres piezas. Cero fricción.
            </h2>
            <p className="mt-4 text-mocha">
              No es «una app más». Es la infraestructura que hace que tu club traiga dinero sin darte
              trabajo.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              return (
                <div
                  key={s.title}
                  className="group rounded-3xl border border-sand/70 bg-paper p-7 shadow-soft transition hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-coffee text-latte transition group-hover:bg-espresso">
                    <Icon size={22} strokeWidth={2} />
                  </span>
                  <div className="mt-5 text-xs font-bold uppercase tracking-wide text-caramel">
                    Paso {i + 1}
                  </div>
                  <h3 className="mt-1 font-display text-xl font-semibold text-espresso">{s.title}</h3>
                  <p className="mt-2 text-sm text-mocha">{s.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* MARGEN GARANTIZADO */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="order-2 md:order-1">
            <div className="rounded-3xl bg-warm bg-grain p-8 text-cream shadow-lift">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-latte">
                <TrendingDown size={16} /> El número que cambia todo
              </div>
              <p className="mt-4 text-cream/80">
                A {eur(clubPrice)}/mes con café incluido, cada socio puede tomar unos{' '}
                <strong className="text-cream">71 cafés</strong> antes de que pierdas dinero. Suena
                imposible de cruzar… hasta que alguien se toma 3 al día o pasa el código a su pareja.
              </p>
              <div className="mt-7 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3.5">
                  <span className="flex items-center gap-2 text-sm text-cream/70">
                    <X size={16} className="text-berry" /> Sin control (libreta)
                  </span>
                  <span className="text-sm font-semibold text-[#e6907f]">Fuga de margen</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3.5">
                  <span className="flex items-center gap-2 text-sm text-cream/70">
                    <ShieldCheck size={16} className="text-latte" /> Con tope de 1/día
                  </span>
                  <span className="text-sm font-semibold text-latte">Margen blindado</span>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="font-display text-3xl font-semibold leading-tight text-espresso sm:text-[2.5rem]">
              El descuento no es el riesgo. <span className="text-caramel">La fuga sí.</span>
            </h2>
            <p className="mt-5 text-mocha">
              La gracia no está en regalar café, sino en que el sistema sepa exactamente quién es
              socio y cuántos lleva hoy. Pones un tope y es matemáticamente imposible perder margen.
            </p>
            <p className="mt-4 text-mocha">
              El club te trae a la gente. Tú ganas con el croissant que se pide al lado. Eso es lo
              que convierte la fidelización en beneficio de verdad.
            </p>
          </div>
        </div>
      </section>

      {/* PRECIO */}
      <section className="border-y border-sand/60 bg-cream/50 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Badge>Precio</Badge>
          <h2 className="mt-4 font-display text-3xl font-semibold text-espresso sm:text-[2.5rem]">
            Un precio. Sin sorpresas.
          </h2>
          <div className="mx-auto mt-12 max-w-md overflow-hidden rounded-[1.75rem] border border-sand/70 bg-paper text-left shadow-lift">
            <div className="bg-coffee bg-grain px-8 py-7 text-cream">
              <div className="text-xs font-semibold uppercase tracking-wide text-latte">
                Cuota fija mensual
              </div>
              <div className="mt-2 flex items-end gap-1.5">
                <span className="font-display text-5xl font-semibold">{eur(saas)}</span>
                <span className="mb-2 text-cream/70">/mes</span>
              </div>
              <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-mint/20 px-2.5 py-1 text-sm font-medium text-[#7fd9bd]">
                = {eur(2.3, 2)} al día
              </div>
            </div>
            <div className="px-8 py-7">
              <ul className="space-y-3 text-sm text-mocha">
                {PRICE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check size={17} className="mt-0.5 shrink-0 text-mint" /> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-2xl bg-cream px-4 py-3.5 text-sm text-espresso">
                30 socios × {eur(clubPrice)} = <strong>{eur(900)}/mes recurrentes</strong>. Cofflix es
                el ~8% de eso.
              </div>
              <Link to="/demo" className={`${btn('primary', 'lg')} mt-6 w-full`}>
                Ver la demo <ArrowRight size={18} strokeWidth={2.2} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <div className="text-center">
          <Badge>Dudas frecuentes</Badge>
          <h2 className="mt-4 font-display text-3xl font-semibold text-espresso sm:text-[2.5rem]">
            Lo que nos preguntan
          </h2>
        </div>
        <div className="mt-12 space-y-4">
          {FAQ.map((f) => (
            <div key={f.q} className="rounded-2xl border border-sand/70 bg-paper p-6 shadow-soft">
              <div className="font-semibold text-espresso">{f.q}</div>
              <p className="mt-2 text-sm text-mocha">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-warm bg-grain py-24 text-center text-cream">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-display text-3xl font-semibold sm:text-[2.75rem]">
            Pruébalo sin arriesgar un euro.
          </h2>
          <p className="mt-5 text-cream/75">
            Lanzamos juntos el club con tus 20 mejores clientes. Si en una semana no consiguen
            apuntarse 15, lo dejamos y no nos debes nada.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/demo" className={btn('accent', 'lg')}>
              Ver la demo <ArrowRight size={18} strokeWidth={2.2} />
            </Link>
            <a href="mailto:hola@cofflix.app" className={btn('outlineLight', 'lg')}>
              Hablar con nosotros
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-ink py-10 text-center text-sm text-cream/45">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6">
          <Logo light />
          <p>El club de café para tus mejores clientes · Barcelona</p>
        </div>
      </footer>
    </div>
  )
}
