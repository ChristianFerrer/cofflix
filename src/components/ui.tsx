import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useStore } from '../store'

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-latte text-espresso text-lg">☕</span>
      <span className={light ? 'text-cream' : 'text-espresso'}>
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
        <div className={`flex items-center gap-6 text-sm font-medium ${light ? 'text-cream/90' : 'text-mocha'}`}>
          <Link to="/club" className="hidden hover:opacity-70 sm:inline">
            Para clientes
          </Link>
          <Link
            to="/demo"
            className="rounded-full bg-coffee px-4 py-2 font-semibold text-cream transition hover:bg-espresso"
          >
            Ver demo
          </Link>
        </div>
      </nav>
    </header>
  )
}

/* Shell de las pantallas del producto (caja / alta / panel) */
export function DemoShell({ title, children }: { title: string; children: ReactNode }) {
  const { config, resetDemo } = useStore()
  const loc = useLocation()
  const tabs = [
    { to: '/demo/caja', label: 'Caja', icon: '🧾' },
    { to: '/demo/alta', label: 'Alta socio', icon: '➕' },
    { to: '/demo/panel', label: 'Panel', icon: '📊' },
  ]
  return (
    <div className="min-h-screen bg-foam">
      <div className="sticky top-0 z-20 border-b border-cream bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden text-sm text-mocha sm:inline">· {config.cafeName}</span>
          </div>
          <nav className="flex items-center gap-1 rounded-full bg-cream p-1">
            {tabs.map((t) => {
              const active = loc.pathname === t.to
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                    active ? 'bg-coffee text-cream' : 'text-mocha hover:bg-white'
                  }`}
                >
                  <span className="mr-1">{t.icon}</span>
                  <span className="hidden sm:inline">{t.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-xl font-bold text-espresso">{title}</h1>
          <button
            onClick={resetDemo}
            className="text-xs font-medium text-mocha underline-offset-2 hover:underline"
            title="Restablecer los datos de la demo"
          >
            ↺ Reiniciar demo
          </button>
        </div>
        {children}
      </main>
    </div>
  )
}

export function Stat({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: ReactNode
  sub?: string
  accent?: 'mint' | 'caramel' | 'coffee'
}) {
  const ring =
    accent === 'mint'
      ? 'ring-mint/20'
      : accent === 'caramel'
        ? 'ring-caramel/20'
        : 'ring-cream'
  return (
    <div className={`rounded-2xl bg-white p-4 ring-1 ${ring} shadow-sm`}>
      <div className="text-xs font-medium uppercase tracking-wide text-mocha">{label}</div>
      <div className="mt-1 text-2xl font-bold text-espresso">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-mocha">{sub}</div>}
    </div>
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
