import { Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'
import { AppLayout, Loader } from '../../app/AppLayout'

export default function AppHome() {
  const { profile, loading, session } = useAuth()

  if (loading) return <Loader />
  // Sesión activa pero el perfil aún cargando
  if (session && !profile) return <Loader />

  if (profile?.role === 'superadmin') return <Navigate to="/app/admin" replace />
  if (profile?.cafe_id) return <Navigate to="/app/cafe" replace />

  // Usuario sin café asignado todavía
  return (
    <AppLayout>
      <div className="mx-auto max-w-md rounded-3xl border border-line bg-surface p-8 text-center">
        <h1 className="font-display text-2xl font-semibold text-snow">Tu cuenta está lista</h1>
        <p className="mt-2 text-sm text-fog">
          Aún no tienes una cafetería asignada. El equipo de Coffee Me la activará en breve, o pídele
          al administrador que te dé acceso.
        </p>
      </div>
    </AppLayout>
  )
}
