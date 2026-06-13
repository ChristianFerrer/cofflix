import { useCallback, useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { BadgeEuro, Users, Package, Target, UserPlus, ArrowLeft, Coffee, Receipt } from 'lucide-react'
import { AppLayout, Loader } from '../../app/AppLayout'
import { Stat, btn, eur } from '../../components/ui'
import { useAuth } from '../../auth/AuthProvider'
import { supabase, type Cafe } from '../../lib/supabase'

interface MemberRow {
  id: string
  name: string
  phone: string | null
  favorite: string | null
  status: string
  month_redemptions: number
  last_visit_at: string | null
  referrals: number
}
interface ProspectRow {
  id: string
  name: string
  phone: string | null
  favorite: string | null
  visits_this_month: number
}

const CAPTURE_THRESHOLD = 8

export default function CafeDashboard() {
  const { profile } = useAuth()
  const [params] = useSearchParams()
  const cafeId = params.get('id') ?? profile?.cafe_id ?? null
  const isSuper = profile?.role === 'superadmin'

  const [cafe, setCafe] = useState<Cafe | null>(null)
  const [members, setMembers] = useState<MemberRow[]>([])
  const [prospects, setProspects] = useState<ProspectRow[]>([])
  const [pendingOrders, setPendingOrders] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    if (!cafeId) {
      setLoading(false)
      return
    }
    const [c, m, p, o] = await Promise.all([
      supabase.from('cafes').select('*').eq('id', cafeId).maybeSingle(),
      supabase.from('members').select('id,name,phone,favorite,status,month_redemptions,last_visit_at,referrals').eq('cafe_id', cafeId).order('month_redemptions', { ascending: false }),
      supabase.from('prospects').select('id,name,phone,favorite,visits_this_month').eq('cafe_id', cafeId),
      supabase.from('orders').select('id', { count: 'exact', head: true }).eq('cafe_id', cafeId).neq('status', 'delivered'),
    ])
    setCafe((c.data as Cafe) ?? null)
    setMembers((m.data as MemberRow[]) ?? [])
    setProspects((p.data as ProspectRow[]) ?? [])
    setPendingOrders(o.count ?? 0)
    setLoading(false)
  }, [cafeId])

  useEffect(() => {
    void fetchAll()
  }, [fetchAll])

  if (loading) return <Loader />

  if (!cafe) {
    return (
      <AppLayout>
        <div className="rounded-2xl border border-line bg-surface p-8 text-center text-fog">
          No se encontró la cafetería o no tienes acceso.
        </div>
      </AppLayout>
    )
  }

  const active = members.filter((x) => x.status === 'active')
  const mrr = active.length * cafe.club_price
  const captables = prospects
    .filter((p) => p.visits_this_month >= CAPTURE_THRESHOLD)
    .sort((a, b) => b.visits_this_month - a.visits_this_month)
  const referralSignups = members.reduce((a, b) => a + (b.referrals ?? 0), 0)

  async function convert(p: ProspectRow) {
    await supabase.from('members').insert({
      cafe_id: cafeId,
      name: p.name,
      phone: p.phone,
      favorite: p.favorite,
      status: 'active',
    })
    await supabase.from('prospects').delete().eq('id', p.id)
    void fetchAll()
  }

  return (
    <AppLayout>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          {isSuper && (
            <Link to="/app/admin" className="mb-2 flex items-center gap-1.5 text-xs text-fog transition hover:text-snow">
              <ArrowLeft size={13} /> Volver a administración
            </Link>
          )}
          <h1 className="font-display text-2xl font-semibold text-snow">{cafe.name}</h1>
          <p className="mt-1 text-sm text-fog">
            Club a {eur(cafe.club_price)}/mes · tope {cafe.cap_per_day}/día · plan {cafe.saas_tier}
          </p>
        </div>
        <Link to={`/app/caja?id=${cafeId}`} className={btn('primary')}>
          <Receipt size={16} strokeWidth={2.2} /> Abrir caja
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={BadgeEuro} label="Ingreso recurrente" value={eur(mrr)} sub={`${active.length} socios activos`} accent="mint" />
        <Stat icon={Users} label="Socios" value={members.length} sub={`${members.filter((m) => m.status === 'failed').length} con pago pendiente`} accent="lime" />
        <Stat icon={Package} label="Pedidos pendientes" value={pendingOrders} sub="para recoger" accent="iris" />
        <Stat icon={Target} label="Captables" value={captables.length} sub={`${referralSignups} altas por referido`} accent="lime" />
      </div>

      {/* Captación */}
      <div className="mt-6 rounded-2xl border border-lime/20 bg-surface p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-snow">
          <Target size={16} className="text-lime" /> Capta: frecuentes que aún no son socios
        </div>
        <div className="mt-4 space-y-2">
          {captables.length === 0 && <p className="py-4 text-center text-sm text-fog">Ningún frecuente pendiente de captar.</p>}
          {captables.map((p) => {
            const spend = p.visits_this_month * cafe.retail_price
            const savings = Math.max(0, spend - cafe.club_price)
            return (
              <div key={p.id} className="flex flex-col gap-3 rounded-xl border border-line bg-surface2 p-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-snow">{p.name}</span>
                    <span className="rounded-full bg-carbon px-2 py-0.5 text-[11px] font-semibold text-lime">{p.visits_this_month} visitas/mes</span>
                  </div>
                  <div className="mt-1 text-xs text-fog">
                    Toma <span className="text-snow">{p.favorite}</span> · gasta ~{eur(spend)}/mes · ahorraría{' '}
                    <span className="font-semibold text-amber">{eur(savings)}</span> con el club
                  </div>
                </div>
                <button
                  onClick={() => convert(p)}
                  className="flex shrink-0 items-center gap-1.5 rounded-full bg-lime px-3.5 py-1.5 text-xs font-semibold text-ink transition hover:bg-lime-deep active:scale-95"
                >
                  <UserPlus size={13} strokeWidth={2.5} /> Convertir a socio
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Socios */}
      <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-snow">
          <Coffee size={16} className="text-lime" /> Socios del club
        </div>
        <div className="mt-4 space-y-1.5">
          {members.map((m) => {
            const days = m.last_visit_at ? Math.floor((Date.now() - new Date(m.last_visit_at).getTime()) / 86400000) : null
            const dot = m.status === 'cancelled' ? 'bg-mist' : m.status === 'failed' ? 'bg-rose' : 'bg-mint'
            return (
              <div key={m.id} className="flex items-center gap-3 rounded-xl bg-surface2 px-3 py-2.5">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-snow">{m.name}</div>
                  <div className="text-xs text-mist">{m.phone} · {m.favorite}</div>
                </div>
                <div className="text-right text-xs text-fog">
                  <div>{m.month_redemptions} cafés/mes</div>
                  {days !== null && <div className={days >= 10 ? 'text-rose' : 'text-mist'}>{days === 0 ? 'hoy' : `hace ${days}d`}</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
