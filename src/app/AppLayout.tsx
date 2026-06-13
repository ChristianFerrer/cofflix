import { Navigate, useNavigate, Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { LogOut, ShieldCheck, Store, Building2, ChartNoAxesColumn, Receipt } from 'lucide-react'
import { Logo } from '../components/ui'
import { useAuth } from '../auth/AuthProvider'

export function Loader() {
  return (
    <div className="grid min-h-screen place-items-center bg-carbon">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-lime" />
    </div>
  )
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()
  if (loading) return <Loader />
  if (!session) return <Navigate to="/login" replace />
  return <>{children}</>
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { session, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const loc = useLocation()
  const roleLabel =
    profile?.role === 'superadmin' ? 'Administración' : profile?.role === 'staff' ? 'Equipo' : 'Café'
  const RoleIcon = profile?.role === 'superadmin' ? ShieldCheck : Store

  const tabs =
    profile?.role === 'superadmin'
      ? [{ to: '/app/admin', label: 'Cafeterías', icon: Building2 }]
      : [
          { to: '/app/cafe', label: 'Panel', icon: ChartNoAxesColumn },
          { to: '/app/caja', label: 'Caja', icon: Receipt },
        ]

  async function logout() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-carbon">
      <header className="sticky top-0 z-20 border-b border-line bg-carbon/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden items-center gap-1.5 rounded-full bg-surface2 px-2.5 py-1 text-xs font-semibold text-fog sm:inline-flex">
              <RoleIcon size={13} className="text-lime" /> {roleLabel}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1 rounded-full border border-line bg-surface p-1">
              {tabs.map((t) => {
                const active = loc.pathname === t.to
                const Icon = t.icon
                return (
                  <Link
                    key={t.to}
                    to={t.to}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition ${active ? 'bg-lime text-ink' : 'text-fog hover:bg-surface2 hover:text-snow'}`}
                  >
                    <Icon size={15} strokeWidth={2.2} />
                    <span className="hidden sm:inline">{t.label}</span>
                  </Link>
                )
              })}
            </nav>
            <span className="hidden text-sm text-mist lg:inline">{session?.user.email}</span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-fog transition hover:text-snow"
            >
              <LogOut size={14} /> <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-7">{children}</main>
    </div>
  )
}
