import { Link } from 'react-router-dom'
import { Coffee, Croissant, Star, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react'
import { Logo, Badge, btn, eur } from '../components/ui'
import { useStore } from '../store'

export default function LandingClub() {
  const { config } = useStore()
  const perDay = config.clubPrice / 30

  const perks = [
    { icon: Coffee, title: 'Tu café diario', text: 'Un café de especialidad cada día, incluido en tu membresía.' },
    { icon: Croissant, title: 'Un capricho semanal', text: `Cada semana, ${config.perk}.` },
    { icon: Star, title: 'Trato de socio', text: 'Acceso a cafés de origen reservados y a lo nuevo antes que nadie.' },
    { icon: Sparkles, title: 'Sin complicaciones', text: 'Enseñas tu nombre en la barra y listo. Sin tarjetas que sellar.' },
  ]

  return (
    <div className="min-h-screen bg-foam">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Logo />
        <Link to="/" className="flex items-center gap-1.5 text-sm font-medium text-mocha transition hover:text-espresso">
          <ArrowLeft size={16} /> Volver
        </Link>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-10">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <div className="animate-fade-up">
              <Badge>Plazas de fundador · {config.cafeName}</Badge>
            </div>
            <h1 className="animate-fade-up delay-1 mt-6 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-espresso sm:text-6xl">
              Tu café de cada día, <span className="text-caramel">y algo más.</span>
            </h1>
            <p className="animate-fade-up delay-2 mt-6 text-lg text-mocha">
              Únete al club de {config.cafeName}. Tu café diario, un capricho cada semana y trato de
              socio — por menos de lo que cuesta un café al día.
            </p>
            <div className="animate-fade-up delay-3 mt-9 flex flex-wrap items-center gap-5">
              <Link to="/demo/alta" className={btn('primary', 'lg')}>
                Quiero ser socio <ArrowRight size={18} strokeWidth={2.2} />
              </Link>
              <div className="text-sm text-mocha">
                <div className="font-display text-2xl font-semibold text-espresso">
                  {eur(config.clubPrice)}/mes
                </div>
                <div>≈ {eur(perDay, 2)} al día</div>
              </div>
            </div>
          </div>

          {/* Tarjeta de socio */}
          <div className="animate-fade-in delay-2 relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-caramel/10 blur-2xl" />
            <div className="relative aspect-[1.6/1] overflow-hidden rounded-[1.75rem] bg-warm bg-grain p-7 text-cream shadow-lift">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-latte">
                  Club {config.cafeName}
                </span>
                <Coffee size={22} className="text-latte" />
              </div>
              <div className="mt-9">
                <div className="text-xs uppercase tracking-wide text-cream/50">Socio fundador</div>
                <div className="mt-1 font-display text-2xl font-semibold">Tu nombre aquí</div>
              </div>
              <div className="mt-7 flex items-end justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-cream/50">Incluye</div>
                  <div className="font-semibold">1 café / día</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-wide text-cream/50">Desde</div>
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
          {perks.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-4 rounded-2xl border border-sand/70 bg-paper p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cream text-caramel">
                <Icon size={22} strokeWidth={2} />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-espresso">{title}</h3>
                <p className="mt-1 text-sm text-mocha">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VALOR */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-3xl border border-sand/70 bg-cream/60 p-8 text-center sm:p-10">
          <h2 className="font-display text-2xl font-semibold text-espresso sm:text-3xl">
            ¿Te sale a cuenta?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-mocha">
            Si pasas por aquí 4 o 5 días a la semana, ya lo amortizas. Y no es solo el café: es no
            pensar, no pagar cada vez y sentirte de casa.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              ['20+', 'cafés al mes'],
              [eur(config.clubPrice), 'cuota fija'],
              [eur(perDay, 2), 'por día', true],
            ].map(([v, l, hl]) => (
              <div key={l as string} className="rounded-2xl border border-sand/60 bg-paper p-5 shadow-soft">
                <div className={`font-display text-2xl font-semibold ${hl ? 'text-mint' : 'text-espresso'}`}>
                  {v}
                </div>
                <div className="mt-1 text-xs text-mocha">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 pb-24 pt-8 text-center">
        <h2 className="font-display text-3xl font-semibold text-espresso sm:text-4xl">
          Hazte socio en 1 minuto.
        </h2>
        <p className="mt-3 text-mocha">
          Escanea, paga y la próxima vez solo das tu nombre en la barra.
        </p>
        <Link to="/demo/alta" className={`${btn('primary', 'lg')} mt-8`}>
          Quiero ser socio del club <ArrowRight size={18} strokeWidth={2.2} />
        </Link>
      </section>

      <footer className="bg-ink py-10 text-center text-sm text-cream/45">
        Club {config.cafeName} · con tecnología de Cofflix
      </footer>
    </div>
  )
}
