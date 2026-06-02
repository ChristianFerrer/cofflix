import { Link, useLocation } from 'react-router-dom'
import type { ComponentType, ReactNode } from 'react'
import { Coffee, Receipt, UserPlus, ChartNoAxesColumn, RotateCcw } from 'lucide-react'
import { useStore } from '../store'

/* ------------------------------------------------------------------ */
/*  Botones                                                            */
/* ------------------------------------------------------------------ */

type Variant = 'primary' | 'accent' | 'outline' | 'outlineLight' | 'ghost'
type Size = 'md' | 'lg'

const SIZES: Record<Size, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-[15px]',
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-coffee text-cream hover:bg-espresso shadow-soft',
  accent: 'bg-latte text-espresso hover:bg-gold shadow-soft',
  outline: 'border border-sand bg-paper text-espresso hover:bg-cream',
  outlineLight: 'border border-cream/30 text-cream hover:bg-cream/10',
  ghost: 'text-mocha hover:text-espresso',
}

export function btn(variant: Variant = 'primary', size: Size = 'md') {
  return [
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200',
    'active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-caramel/50',
    SIZES[size],
    VARIANTS[variant],
  ].join(' ')
}

/* ------------------------------------------------------------------ */
/*  Marca                                                              */
/* ------------------------------------------------------------------ */

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-coffee text-latte shadow-soft transition group-hover:bg-espresso">
        <Coffee size={18} strokeWidth={2.2} />
      </span>
      <span className={`font-display text-xl font-semibold tracking-tight ${light ? 'text-cream' : 'text-espresso'}`}>
        Cof<span className="text-caramel">flix</span>
      </span>
    </Link>
  )
}

/* Navegación pública (landings) */
export function SiteNav({ light = false }: { light?: boolean }) {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo light={light} />
        <div className={`flex items-center gap-2 text-sm font-medium ${light ? 'text-cream/90' : 'text-mocha'}`}>
          <Link to="/club" className="hidden rounded-full px-4 py-2 transition hover:opacity-70 sm:inline">
            Para clientes
          </Link>
          <Link to="/demo" className={btn(light ? 'accent' : 'primary')}>
            Ver demo
          </Link>
        </div>
      </nav>
    </header>
  )
}

/* ------------------------------------------------------------------ */
/*  Shell de las pantallas del producto                                */
/* ------------------------------------------------------------------ */

export function DemoShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const { config, resetDemo } = useStore()
  const loc = useLocation()
  const tabs = [
    { to: '/demo/caja', label: 'Caja', icon: Receipt },
    { to: '/demo/alta', label: 'Alta socio', icon: UserPlus },
    { to: '/demo/panel', label: 'Panel', icon: ChartNoAxesColumn },
  ]
  return (
    <div className="min-h-screen bg-foam">
      <div className="sticky top-0 z-20 border-b border-sand/70 bg-foam/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Logo />
            <span className="hidden truncate text-sm text-mocha sm:inline">· {config.cafeName}</span>
          </div>
          <nav className="flex items-center gap-1 rounded-full border border-sand/70 bg-paper p-1 shadow-soft">
            {tabs.map((t) => {
              const active = loc.pathname === t.to
              const Icon = t.icon
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                    active ? 'bg-coffee text-cream shadow-soft' : 'text-mocha hover:bg-cream'
                  }`}
                >
                  <Icon size={16} strokeWidth={2.2} />
                  <span className="hidden sm:inline">{t.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
      <main className="mx-auto max-w-5xl px-4 py-7">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold text-espresso">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-mocha">{subtitle}</p>}
          </div>
          <button
            onClick={resetDemo}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-sand bg-paper px-3 py-1.5 text-xs font-medium text-mocha transition hover:text-espresso"
            title="Restablecer los datos de la demo"
          >
            <RotateCcw size={13} strokeWidth={2.2} /> Reiniciar
          </button>
        </div>
        {children}
      </main>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Primitivas                                                         */
/* ------------------------------------------------------------------ */

export function Stat({
  icon: Icon,
  label,
  value,
  sub,
  accent = 'coffee',
}: {
  icon?: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  label: string
  value: ReactNode
  sub?: string
  accent?: 'mint' | 'caramel' | 'coffee'
}) {
  const tint =
    accent === 'mint'
      ? 'bg-mint-soft text-mint'
      : accent === 'caramel'
        ? 'bg-cream text-caramel'
        : 'bg-cream text-coffee'
  return (
    <div className="rounded-2xl border border-sand/70 bg-paper p-4 shadow-soft">
      <div className="flex items-center gap-2">
        {Icon && (
          <span className={`grid h-7 w-7 place-items-center rounded-lg ${tint}`}>
            <Icon size={15} strokeWidth={2.2} />
          </span>
        )}
        <span className="text-xs font-medium uppercase tracking-wide text-mocha">{label}</span>
      </div>
      <div className="mt-2 font-display text-[1.7rem] font-semibold leading-none text-espresso">{value}</div>
      {sub && <div className="mt-1.5 text-xs text-mocha">{sub}</div>}
    </div>
  )
}

export function Badge({ children, tone = 'cream' }: { children: ReactNode; tone?: 'cream' | 'mint' | 'berry' | 'dark' }) {
  const tones = {
    cream: 'bg-cream text-caramel',
    mint: 'bg-mint-soft text-mint',
    berry: 'bg-berry-soft text-berry',
    dark: 'bg-latte/20 text-latte',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function eur(n: number, decimals = 0) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n)
}
