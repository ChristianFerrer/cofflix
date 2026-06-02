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
    <div className="min-h-screen bg-carbon">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Logo />
        <Link to="/" className="flex items-center gap-1.5 text-sm font-medium text-fog transition hover:text-snow">
          <ArrowLeft size={16} /> Volver
        </Link>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-glow">
        <div className="mx-auto grid max-w-5xl items-center gap-12 px-6 pb-16 pt-10 md:grid-cols-2">
          <div>
            <div className="animate-fade-up">
              <Badge>Plazas de fundador · {config.cafeName}</Badge>
            </div>
            <h1 className="animate-fade-up delay-1 mt-6 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-snow sm:text-6xl">
              Tu café de cada día, <span className="text-gradient">y algo más.</span>
            </h1>
            <p className="animate-fade-up delay-2 mt-6 text-lg text-fog">
              Únete al club de {config.cafeName}. Tu café diario, un capricho cada semana y trato de
              socio — por menos de lo que cuesta un café al día.
            </p>
            <div className="animate-fade-up delay-3 mt-9 flex flex-wrap items-center gap-5">
              <Link to="/demo/alta" className={btn('primary', 'lg')}>
                Quiero ser socio <ArrowRight size={18} strokeWidth={2.2} />
              </Link>
              <div className="text-sm text-fog">
                <div className="font-display text-2xl font-semibold text-snow">
                  {eur(config.clubPrice)}/mes
                </div>
                <div>≈ {eur(perDay, 2)} al día</div>
              </div>
            </div>
          </div>

          {/* Tarjeta de socio */}
          <div className="animate-fade-in delay-2 relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-lime/10 blur-3xl" />
            <div className="relative aspect-[1.6/1] overflow-hidden rounded-[1.75rem] border border-line bg-surface bg-grain p-7 shadow-lift">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-lime">
                  Club {config.cafeName}
                </span>
                <Coffee size={22} className="text-lime" />
              </div>
              <div className="mt-9">
                <div className="text-xs uppercase tracking-wide text-mist">Socio fundador</div>
                <div className="mt-1 font-display text-2xl font-semibold text-snow">Tu nombre aquí</div>
              </div>
              <div className="mt-7 flex items-end justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-mist">Incluye</div>
                  <div className="font-semibold text-snow">1 café / día</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-wide text-mist">Desde</div>
                  <div className="font-semibold text-lime">{eur(perDay, 2)}/día</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERKS */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-5 sm:grid-cols-2">
          {perks.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-6 transition hover:-translate-y-0.5 hover:border-lime/40">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-surface2 text-lime">
                <Icon size={22} strokeWidth={2} />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-snow">{title}</h3>
                <p className="mt-1 text-sm text-fog">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VALOR */}
      <section className="mx-auto max-w-3xl px-6 py-8">
        <div className="rounded-3xl border border-line bg-surface p-8 text-center sm:p-10">
          <h2 className="font-display text-2xl font-semibold text-snow sm:text-3xl">
            ¿Te sale a cuenta?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-fog">
            Si pasas por aquí 4 o 5 días a la semana, ya lo amortizas. Y no es solo el café: es no
            pensar, no pagar cada vez y sentirte de casa.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              ['20+', 'cafés al mes'],
              [eur(config.clubPrice), 'cuota fija'],
              [eur(perDay, 2), 'por día', true],
            ].map(([v, l, hl]) => (
              <div key={l as string} className="rounded-2xl border border-line bg-carbon p-5">
                <div className={`font-display text-2xl font-semibold ${hl ? 'text-lime' : 'text-snow'}`}>
                  {v}
                </div>
                <div className="mt-1 text-xs text-fog">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 pb-24 pt-8 text-center">
        <h2 className="font-display text-3xl font-semibold text-snow sm:text-4xl">
          Hazte socio en 1 minuto.
        </h2>
        <p className="mt-3 text-fog">
          Escanea, paga y la próxima vez solo das tu nombre en la barra.
        </p>
        <Link to="/demo/alta" className={`${btn('primary', 'lg')} mt-8`}>
          Quiero ser socio del club <ArrowRight size={18} strokeWidth={2.2} />
        </Link>
      </section>

      <footer className="border-t border-line bg-ink py-10 text-center text-sm text-mist">
        Club {config.cafeName} · con tecnología de Cofflix
      </footer>
    </div>
  )
}
