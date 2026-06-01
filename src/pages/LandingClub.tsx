import { Link } from 'react-router-dom'
import { Logo, eur } from '../components/ui'
import { useStore } from '../store'

export default function LandingClub() {
  const { config } = useStore()
  const perDay = config.clubPrice / 30

  const perks = [
    { icon: '☕', title: 'Tu café diario', text: `Un café de especialidad cada día, incluido en tu membresía.` },
    { icon: '🥐', title: 'Un capricho semanal', text: `Cada semana, ${config.perk}.` },
    { icon: '⭐', title: 'Trato de socio', text: 'Acceso a cafés de origen reservados y a lo nuevo antes que nadie.' },
    { icon: '📲', title: 'Sin complicaciones', text: 'Enseñas tu nombre en la barra y listo. Sin tarjetas que sellar.' },
  ]

  return (
    <div className="min-h-screen bg-foam">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Logo />
        <Link to="/" className="text-sm font-medium text-mocha hover:opacity-70">
          ← Volver
        </Link>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-8">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-cream px-3 py-1 text-xs font-semibold uppercase tracking-wide text-caramel">
              Plazas de fundador limitadas · {config.cafeName}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-espresso sm:text-5xl">
              Tu café de cada día, <span className="text-caramel">y algo más</span>.
            </h1>
            <p className="mt-5 text-lg text-mocha">
              Únete al club de {config.cafeName}. Tu café diario, un capricho cada semana y trato de
              socio — por menos de lo que cuesta un café al día.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link
                to="/demo/alta"
                className="rounded-full bg-coffee px-7 py-3.5 font-semibold text-cream transition hover:bg-espresso"
              >
                Quiero ser socio
              </Link>
              <div className="text-sm text-mocha">
                <div className="text-2xl font-bold text-espresso">{eur(config.clubPrice)}/mes</div>
                <div>≈ {eur(perDay, 2)} al día</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] bg-coffee bg-grain p-8 text-cream shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-wide text-latte">
                  Club {config.cafeName}
                </span>
                <span className="text-2xl">☕</span>
              </div>
              <div className="mt-10">
                <div className="text-sm text-cream/60">Socio fundador</div>
                <div className="mt-1 text-2xl font-bold">Tu nombre aquí</div>
              </div>
              <div className="mt-8 flex items-end justify-between">
                <div>
                  <div className="text-xs text-cream/60">Incluye</div>
                  <div className="font-semibold">1 café / día</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-cream/60">Desde</div>
                  <div className="font-semibold">{eur(perDay, 2)}/día</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERKS */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-5 sm:grid-cols-2">
          {perks.map((p) => (
            <div key={p.title} className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-cream">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cream text-2xl">
                {p.icon}
              </span>
              <div>
                <h3 className="font-bold text-espresso">{p.title}</h3>
                <p className="mt-1 text-sm text-mocha">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CÁLCULO DE VALOR */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-3xl bg-cream/70 p-8 text-center">
          <h2 className="text-2xl font-bold text-espresso">¿Te sale a cuenta?</h2>
          <p className="mx-auto mt-3 max-w-lg text-mocha">
            Si pasas por aquí 4 o 5 días a la semana, ya lo amortizas. Y no es solo el café: es no
            pensar, no pagar cada vez y sentirte de casa.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-2xl bg-white p-4">
              <div className="text-2xl font-bold text-espresso">20+</div>
              <div className="text-mocha">cafés al mes</div>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <div className="text-2xl font-bold text-espresso">{eur(config.clubPrice)}</div>
              <div className="text-mocha">cuota fija</div>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <div className="text-2xl font-bold text-mint">{eur(perDay, 2)}</div>
              <div className="text-mocha">por día</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 pb-24 pt-6 text-center">
        <h2 className="text-3xl font-bold text-espresso">Hazte socio en 1 minuto.</h2>
        <p className="mt-3 text-mocha">Escanea, paga y la próxima vez solo das tu nombre en la barra.</p>
        <Link
          to="/demo/alta"
          className="mt-7 inline-block rounded-full bg-coffee px-8 py-4 font-semibold text-cream transition hover:bg-espresso"
        >
          Quiero ser socio del club
        </Link>
      </section>

      <footer className="bg-espresso py-8 text-center text-sm text-cream/50">
        Club {config.cafeName} · con tecnología de Cofflix
      </footer>
    </div>
  )
}
