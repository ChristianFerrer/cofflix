import { Link, useLocation } from 'react-router-dom'
import type { ComponentType, ReactNode } from 'react'
import {
  Coffee,
  Receipt,
  UserPlus,
  Smartphone,
  ChartNoAxesColumn,
  RotateCcw,
  Croissant,
  Cookie,
  Sandwich,
  CakeSlice,
  CupSoda,
  ShoppingBag,
} from 'lucide-react'
import { useStore } from '../store'

type IconType = ComponentType<{ size?: number; strokeWidth?: number; className?: string }>

const PRODUCT_ICONS: Record<string, IconType> = {
  'Croissant artesano': Croissant,
  'Tostada con tomate': Sandwich,
  'Muffin de arándanos': CakeSlice,
  'Cookie de avena': Cookie,
  'Zumo de naranja natural': CupSoda,
  'Bocadillo de jamón': Sandwich,
}

export function productIcon(name: string): IconType {
  return PRODUCT_ICONS[name] ?? ShoppingBag
}

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
  primary: 'bg-lime text-ink hover:bg-lime-deep shadow-lime',
  accent: 'bg-snow text-ink hover:bg-white',
  outline: 'border border-line2 text-snow hover:bg-surface2',
  outlineLight: 'border border-line2 text-snow hover:bg-surface2',
  ghost: 'text-fog hover:text-snow',
}

export function btn(variant: Variant = 'primary', size: Size = 'md') {
  return [
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200',
    'active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-carbon focus-visible:ring-lime/60',
    SIZES[size],
    VARIANTS[variant],
  ].join(' ')
}

/* ------------------------------------------------------------------ */
/*  Marca                                                              */
/* ------------------------------------------------------------------ */

export function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-lime text-ink shadow-lime transition group-hover:bg-lime-deep">
        <Coffee size={18} strokeWidth={2.4} />
      </span>
      <span className="font-display text-xl font-semibold tracking-tight text-snow">
        Coffee <span className="text-lime">Me</span>
      </span>
    </Link>
  )
}

/* Navegación pública (landings) */
export function SiteNav() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <div className="flex items-center gap-2 text-sm font-medium text-fog">
          <Link to="/club" className="hidden rounded-full px-4 py-2 transition hover:text-snow sm:inline">
            Para clientes
          </Link>
          <Link to="/demo" className={btn('primary')}>
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
    { to: '/demo/alta', label: 'Alta', icon: UserPlus },
    { to: '/demo/socio', label: 'App socio', icon: Smartphone },
    { to: '/demo/panel', label: 'Panel', icon: ChartNoAxesColumn },
  ]
  return (
    <div className="min-h-screen bg-carbon">
      <div className="sticky top-0 z-20 border-b border-line bg-carbon/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Logo />
            <span className="hidden truncate text-sm text-mist sm:inline">· {config.cafeName}</span>
          </div>
          <nav className="flex items-center gap-1 rounded-full border border-line bg-surface p-1">
            {tabs.map((t) => {
              const active = loc.pathname === t.to
              const Icon = t.icon
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                    active ? 'bg-lime text-ink' : 'text-fog hover:bg-surface2 hover:text-snow'
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
            <h1 className="font-display text-2xl font-semibold text-snow">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-fog">{subtitle}</p>}
          </div>
          <button
            onClick={resetDemo}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-fog transition hover:text-snow"
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
  accent = 'lime',
}: {
  icon?: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  label: string
  value: ReactNode
  sub?: string
  accent?: 'mint' | 'lime' | 'iris' | 'rose'
}) {
  const tint =
    accent === 'mint' ? 'text-mint' : accent === 'iris' ? 'text-iris' : accent === 'rose' ? 'text-rose' : 'text-lime'
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-center gap-2">
        {Icon && (
          <span className={`grid h-7 w-7 place-items-center rounded-lg bg-surface2 ${tint}`}>
            <Icon size={15} strokeWidth={2.2} />
          </span>
        )}
        <span className="text-xs font-medium uppercase tracking-wide text-fog">{label}</span>
      </div>
      <div className="mt-2 font-display text-[1.7rem] font-semibold leading-none text-snow">{value}</div>
      {sub && <div className="mt-1.5 text-xs text-mist">{sub}</div>}
    </div>
  )
}

export function Badge({ children, tone = 'lime' }: { children: ReactNode; tone?: 'lime' | 'mint' | 'rose' | 'iris' }) {
  const tones = {
    lime: 'bg-lime/10 text-lime ring-1 ring-lime/20',
    mint: 'bg-mint-soft text-mint',
    rose: 'bg-rose-soft text-rose',
    iris: 'bg-iris/10 text-iris ring-1 ring-iris/20',
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
