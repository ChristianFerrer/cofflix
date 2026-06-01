import { Link } from 'react-router-dom'
import { SiteNav, eur } from '../components/ui'

const STEPS = [
  {
    icon: '💳',
    title: 'Cobro automático',
    text: 'Tus socios pagan por adelantado cada mes. Nosotros gestionamos cobros, tarjetas que fallan y bajas. Tú no persigues a nadie.',
  },
  {
    icon: '🟢',
    title: 'Control en la barra',
    text: 'En caja, tu equipo ve en 2 segundos si es socio y cuántos cafés lleva hoy. El tope diario hace imposible perder margen.',
  },
  {
    icon: '📲',
    title: 'Alta en 60 segundos',
    text: 'El cliente escanea un QR, paga y ya es socio. Sin formularios, sin instalar apps, sin que tu equipo aprenda nada nuevo.',
  },
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

export default function LandingB2B() {
  const clubPrice = 30
  const saas = 69

  return (
    <div className="bg-foam">
      <SiteNav light />

      {/* HERO */}
      <section className="relative overflow-hidden bg-coffee bg-grain text-cream">
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-36 sm:pt-44">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-latte/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-latte">
              Para cafés de especialidad
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Convierte a tus clientes de siempre en{' '}
              <span className="text-latte">socios que pagan por adelantado</span>.
            </h1>
            <p className="mt-5 text-lg text-cream/80">
              Cofflix te da el club de café que llena tus horas muertas y fideliza a tus regulares.
              Sin papeleo y sin perder margen. Tú solo sirves café.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/demo"
                className="rounded-full bg-latte px-6 py-3 font-semibold text-espresso transition hover:bg-caramel"
              >
                Ver la demo en 2 min →
              </Link>
              <Link
                to="/club"
                className="rounded-full border border-cream/30 px-6 py-3 font-semibold text-cream transition hover:bg-cream/10"
              >
                Ver el club del cliente
              </Link>
            </div>
            <p className="mt-6 text-sm text-cream/60">
              Sin comisión por venta · Cuota fija de {eur(saas)}/mes · Cancela cuando quieras
            </p>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-espresso">
              Tu café es bueno. Tus ingresos, impredecibles.
            </h2>
            <p className="mt-4 text-mocha">
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
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-cream">
            <div className="space-y-5">
              {[
                ['Horas muertas', 'sin un motivo para que el cliente venga'],
                ['Cero datos', 'no sabes quién es tu mejor cliente'],
                ['Sin recurrencia', 'cada mes vuelves a empezar de cero'],
              ].map(([t, d]) => (
                <div key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 text-berry">✕</span>
                  <div>
                    <div className="font-semibold text-espresso">{t}</div>
                    <div className="text-sm text-mocha">{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="bg-cream/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold text-espresso">Tres piezas. Cero fricción.</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-mocha">
            No es «una app más». Es la infraestructura que hace que tu club traiga dinero sin darte
            trabajo.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-cream">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream text-2xl">
                  {s.icon}
                </div>
                <div className="mt-4 text-xs font-bold uppercase tracking-wide text-caramel">
                  Paso {i + 1}
                </div>
                <h3 className="mt-1 text-lg font-bold text-espresso">{s.title}</h3>
                <p className="mt-2 text-sm text-mocha">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARGEN GARANTIZADO */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="order-2 rounded-3xl bg-espresso p-8 text-cream md:order-1">
            <div className="text-sm font-semibold uppercase tracking-wide text-latte">
              El número que cambia todo
            </div>
            <p className="mt-3 text-cream/80">
              A {eur(clubPrice)}/mes con café incluido, cada socio puede tomar unos{' '}
              <strong className="text-cream">71 cafés</strong> antes de que pierdas dinero. Suena
              imposible de cruzar… hasta que alguien se toma 3 al día o pasa el código a su pareja.
            </p>
            <div className="mt-6 rounded-2xl bg-coffee/60 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-cream/70">Sin control (libreta)</span>
                <span className="font-bold text-berry">Fuga de margen</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-cream/70">Con tope de 1/día</span>
                <span className="font-bold text-latte">Margen imposible de perder</span>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold text-espresso">
              El descuento no es el riesgo. <span className="text-caramel">La fuga sí.</span>
            </h2>
            <p className="mt-4 text-mocha">
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
      <section className="bg-cream/60 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-espresso">Un precio. Sin sorpresas.</h2>
          <div className="mx-auto mt-10 max-w-md rounded-3xl bg-white p-8 shadow-md ring-1 ring-cream">
            <div className="text-sm font-semibold uppercase tracking-wide text-caramel">
              Cuota fija mensual
            </div>
            <div className="mt-2 flex items-end justify-center gap-1">
              <span className="text-5xl font-extrabold text-espresso">{eur(saas)}</span>
              <span className="mb-2 text-mocha">/mes</span>
            </div>
            <div className="mt-1 text-sm font-medium text-mint">= {eur(2.3, 2)} al día</div>
            <ul className="mt-6 space-y-3 text-left text-sm text-mocha">
              {[
                'Cobro recurrente y gestión de impagos',
                'Control de socios y tope diario en caja',
                'Alta de socios por QR, sin apps',
                'Panel con tus métricas y clientes en riesgo',
                'Sin comisión por venta. Cancela cuando quieras',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-mint">✓</span> {f}
                </li>
              ))}
            </ul>
            <div className="mt-7 rounded-2xl bg-cream p-4 text-sm text-espresso">
              30 socios × {eur(clubPrice)} ={' '}
              <strong>{eur(900)}/mes recurrentes</strong>. Cofflix es el ~8% de eso.
            </div>
            <Link
              to="/demo"
              className="mt-6 block rounded-full bg-coffee px-6 py-3 font-semibold text-cream transition hover:bg-espresso"
            >
              Ver la demo
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-espresso">Lo que nos preguntan</h2>
        <div className="mt-10 space-y-4">
          {FAQ.map((f) => (
            <div key={f.q} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-cream">
              <div className="font-semibold text-espresso">{f.q}</div>
              <p className="mt-2 text-sm text-mocha">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-coffee bg-grain py-20 text-center text-cream">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-3xl font-bold sm:text-4xl">Pruébalo sin arriesgar un euro.</h2>
          <p className="mt-4 text-cream/80">
            Lanzamos juntos el club con tus 20 mejores clientes. Si en una semana no consiguen
            apuntarse 15, lo dejamos y no nos debes nada.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/demo"
              className="rounded-full bg-latte px-6 py-3 font-semibold text-espresso transition hover:bg-caramel"
            >
              Ver la demo
            </Link>
            <a
              href="mailto:hola@cofflix.app"
              className="rounded-full border border-cream/30 px-6 py-3 font-semibold text-cream transition hover:bg-cream/10"
            >
              Hablar con nosotros
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-espresso py-8 text-center text-sm text-cream/50">
        Cofflix · El club de café para tus mejores clientes · Barcelona
      </footer>
    </div>
  )
}
