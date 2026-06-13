import { useCallback, useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  BadgeEuro, Package, Target, UserPlus, ArrowLeft, Coffee, Receipt, ShieldCheck,
  ShoppingBag, UserMinus, Crown, Croissant, SlidersHorizontal,
} from 'lucide-react'
import { AppLayout, Loader } from '../../app/AppLayout'
import { Stat, btn, eur } from '../../components/ui'
import { useAuth } from '../../auth/AuthProvider'
import { supabase, type Cafe } from '../../lib/supabase'

const CAPTURE_THRESHOLD = 8
const DAY_LETTER = ['D', 'L', 'M', 'X', 'J', 'V', 'S']

interface MemberRow { id: string; name: string; phone: string | null; favorite: string | null; status: string; month_redemptions: number; last_visit_at: string | null; attach_visits: number; referrals: number }
interface ProspectRow { id: string; name: string; phone: string | null; favorite: string | null; visits_this_month: number }

export default function CafeDashboard() {
  const { profile } = useAuth()
  const [params] = useSearchParams()
  const isSuper = profile?.role === 'superadmin'
  const cafeId = (isSuper ? params.get('id') : null) ?? profile?.cafe_id ?? null

  const [cafe, setCafe] = useState<Cafe | null>(null)
  const [members, setMembers] = useState<MemberRow[]>([])
  const [prospects, setProspects] = useState<ProspectRow[]>([])
  const [pendingOrders, setPendingOrders] = useState(0)
  const [last7, setLast7] = useState<{ label: string; v: number }[]>([])
  const [topExtra, setTopExtra] = useState<{ name: string; count: number } | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    if (!cafeId) { setLoading(false); return }
    const since = new Date(); since.setHours(0, 0, 0, 0); since.setDate(since.getDate() - 6)
    const [c, m, p, o, r, items] = await Promise.all([
      supabase.from('cafes').select('*').eq('id', cafeId).maybeSingle(),
      supabase.from('members').select('id,name,phone,favorite,status,month_redemptions,last_visit_at,attach_visits,referrals').eq('cafe_id', cafeId).order('month_redemptions', { ascending: false }),
      supabase.from('prospects').select('id,name,phone,favorite,visits_this_month').eq('cafe_id', cafeId),
      supabase.from('orders').select('id', { count: 'exact', head: true }).eq('cafe_id', cafeId).neq('status', 'delivered'),
      supabase.from('redemptions').select('created_at').eq('cafe_id', cafeId).gte('created_at', since.toISOString()),
      supabase.from('order_items').select('name,qty, orders!inner(cafe_id)').eq('orders.cafe_id', cafeId),
    ])
    setCafe((c.data as Cafe) ?? null)
    setMembers((m.data as MemberRow[]) ?? [])
    setProspects((p.data as ProspectRow[]) ?? [])
    setPendingOrders(o.count ?? 0)

    // Bucket redenciones últimos 7 días
    const buckets = [...Array(7)].map((_, i) => {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (6 - i))
      return { d, v: 0 }
    })
    ;((r.data as { created_at: string }[]) ?? []).forEach((row) => {
      const t = new Date(row.created_at); t.setHours(0, 0, 0, 0)
      const b = buckets.find((x) => x.d.getTime() === t.getTime())
      if (b) b.v += 1
    })
    setLast7(buckets.map((b, i) => ({ label: i === 6 ? 'Hoy' : DAY_LETTER[b.d.getDay()], v: b.v })))

    // Extra más pedido
    const tally: Record<string, number> = {}
    ;((items.data as { name: string; qty: number }[]) ?? []).forEach((it) => { tally[it.name] = (tally[it.name] ?? 0) + it.qty })
    const top = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]
    setTopExtra(top ? { name: top[0], count: top[1] } : null)

    setLoading(false)
  }, [cafeId])

  useEffect(() => { void fetchAll() }, [fetchAll])

  if (loading) return <Loader />
  if (!cafe) {
    return (
      <AppLayout>
        <div className="rounded-2xl border border-line bg-surface p-8 text-center text-fog">
          {isSuper ? <>Elige una cafetería en <Link to="/app/admin" className="font-semibold text-lime">Cafeterías</Link>.</> : 'No tienes una cafetería asignada.'}
        </div>
      </AppLayout>
    )
  }

  const active = members.filter((x) => x.status === 'active')
  const mrr = active.length * cafe.club_price
  const captables = prospects.filter((p) => p.visits_this_month >= CAPTURE_THRESHOLD).sort((a, b) => b.visits_this_month - a.visits_this_month)
  const referralSignups = members.reduce((a, b) => a + (b.referrals ?? 0), 0)
  const monthRed = members.reduce((a, b) => a + b.month_redemptions, 0)
  const attachRate = monthRed ? Math.round((members.reduce((a, b) => a + b.attach_visits, 0) / monthRed) * 100) : 0
  const breakeven = Math.round(cafe.club_price / cafe.cogs)
  const maxCostCapped = cafe.cap_per_day * 26 * cafe.cogs
  const contribution = cafe.club_price - maxCostCapped
  const atRisk = active.filter((m) => m.last_visit_at && (Date.now() - new Date(m.last_visit_at).getTime()) / 86400000 >= 10)
  const topList = active.slice(0, 5)
  const coffeeTally: Record<string, number> = {}
  active.forEach((m) => { if (m.favorite) coffeeTally[m.favorite] = (coffeeTally[m.favorite] ?? 0) + m.month_redemptions })
  const topCoffeeEntry = Object.entries(coffeeTally).sort((a, b) => b[1] - a[1])[0]

  async function updateCfg(patch: Partial<Cafe>) {
    await supabase.from('cafes').update(patch).eq('id', cafeId)
    void fetchAll()
  }
  async function convert(p: ProspectRow) {
    await supabase.from('members').insert({ cafe_id: cafeId, name: p.name, phone: p.phone, favorite: p.favorite, status: 'active' })
    await supabase.from('prospects').delete().eq('id', p.id)
    void fetchAll()
  }

  return (
    <AppLayout>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          {isSuper && <Link to="/app/admin" className="mb-2 flex items-center gap-1.5 text-xs text-fog transition hover:text-snow"><ArrowLeft size={13} /> Volver a administración</Link>}
          <h1 className="font-display text-2xl font-semibold text-snow">{cafe.name}</h1>
          <p className="mt-1 text-sm text-fog">Club a {eur(cafe.club_price)}/mes · tope {cafe.cap_per_day}/día · plan {cafe.saas_tier}</p>
        </div>
        <Link to={`/app/caja?id=${cafeId}`} className={btn('primary')}><Receipt size={16} strokeWidth={2.2} /> Abrir caja</Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={BadgeEuro} label="Ingreso recurrente" value={eur(mrr)} sub={`${active.length} socios activos`} accent="mint" />
        <Stat icon={ShoppingBag} label="Compran extra" value={`${attachRate}%`} sub="bollería al pedir café" accent="iris" />
        <Stat icon={Package} label="Pedidos pendientes" value={pendingOrders} sub="para recoger" accent="lime" />
        <Stat icon={UserMinus} label="Riesgos de fuga" value={atRisk.length} sub="socios sin pasar +10 días" accent="rose" />
      </div>

      {/* Ajustes del club */}
      <div className="mt-5 rounded-2xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-snow"><SlidersHorizontal size={16} className="text-lime" /> Ajustes del club</div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Chips label="Cuota del socio" options={[15, 20, 25, 30]} value={Number(cafe.club_price)} fmt={(v) => `${v}€`} onSelect={(v) => updateCfg({ club_price: v })} />
            <Chips label="Cafés incluidos / día" options={[1, 2]} value={cafe.cap_per_day} fmt={(v) => String(v)} onSelect={(v) => updateCfg({ cap_per_day: v })} />
          </div>
        </div>
      </div>

      {/* Margen protegido + captación */}
      <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="relative overflow-hidden rounded-2xl border border-lime/20 bg-surface p-6">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-lime/10 blur-2xl" />
          <div className="relative flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-lime"><ShieldCheck size={16} /> Margen protegido</div>
          <div className="relative mt-4 grid grid-cols-3 gap-4 text-center">
            <div><div className="font-display text-2xl font-semibold text-snow">{breakeven}</div><div className="mt-1 text-xs text-fog">cafés = equilibrio por socio</div></div>
            <div><div className="font-display text-2xl font-semibold text-lime">{cafe.cap_per_day}/día</div><div className="mt-1 text-xs text-fog">tope que aplica la caja</div></div>
            <div><div className="font-display text-2xl font-semibold text-mint">{eur(contribution)}</div><div className="mt-1 text-xs text-fog">margen mínimo socio/mes</div></div>
          </div>
          <p className="relative mt-5 rounded-xl border border-line bg-carbon p-3.5 text-xs leading-relaxed text-fog">Con el tope diario, el coste máximo por socio es {eur(maxCostCapped)}/mes. Es <strong className="text-snow">imposible que el club te dé pérdidas</strong>.</p>
        </div>

        <Chart title="Cafés servidos · últimos 7 días" data={last7} />
      </div>

      {/* Lo más popular */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Popular icon={Coffee} tint="lime" label="Café más consumido" name={topCoffeeEntry?.[0] ?? '—'} count={topCoffeeEntry?.[1] ?? 0} />
        <Popular icon={Croissant} tint="iris" label="Extra más pedido" name={topExtra?.name ?? '—'} count={topExtra?.count ?? 0} />
      </div>

      {/* Captación */}
      <div className="mt-5 rounded-2xl border border-lime/20 bg-surface p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-snow"><Target size={16} className="text-lime" /> Capta: frecuentes que aún no son socios</div>
          <span className="flex items-center gap-1 text-xs font-medium text-iris">{referralSignups} por referido</span>
        </div>
        <div className="mt-4 space-y-2">
          {captables.length === 0 && <p className="py-4 text-center text-sm text-fog">Ningún frecuente pendiente de captar.</p>}
          {captables.map((p) => {
            const spend = p.visits_this_month * cafe.retail_price
            const savings = Math.max(0, spend - cafe.club_price)
            return (
              <div key={p.id} className="flex flex-col gap-3 rounded-xl border border-line bg-surface2 p-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2"><span className="text-sm font-semibold text-snow">{p.name}</span><span className="rounded-full bg-carbon px-2 py-0.5 text-[11px] font-semibold text-lime">{p.visits_this_month} visitas/mes</span></div>
                  <div className="mt-1 text-xs text-fog">Toma <span className="text-snow">{p.favorite}</span> · gasta ~{eur(spend)}/mes · ahorraría <span className="font-semibold text-amber">{eur(savings)}</span> con el club</div>
                </div>
                <button onClick={() => convert(p)} className="flex shrink-0 items-center gap-1.5 rounded-full bg-lime px-3.5 py-1.5 text-xs font-semibold text-ink transition hover:bg-lime-deep active:scale-95"><UserPlus size={13} strokeWidth={2.5} /> Convertir a socio</button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Fidelización + mejores socios */}
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-snow"><UserMinus size={16} className="text-rose" /> Clientes en riesgo de fuga</div>
          <div className="mt-4 space-y-2">
            {atRisk.length === 0 && <p className="py-4 text-center text-sm text-fog">Nadie en riesgo ahora mismo.</p>}
            {atRisk.map((m) => {
              const days = Math.floor((Date.now() - new Date(m.last_visit_at!).getTime()) / 86400000)
              return (<div key={m.id} className="flex items-center justify-between rounded-xl bg-surface2 px-3 py-2.5"><div><div className="text-sm font-medium text-snow">{m.name}</div><div className="text-xs text-fog">hace {days} días · {m.favorite}</div></div></div>)
            })}
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-snow"><Crown size={16} className="text-lime" /> Tus mejores socios</div>
          <div className="mt-4 space-y-2">
            {topList.map((m, i) => (<div key={m.id} className="flex items-center gap-3 rounded-xl bg-surface2 px-3 py-2.5"><span className="grid h-7 w-7 place-items-center rounded-full border border-line bg-carbon text-xs font-bold text-lime">{i + 1}</span><div className="flex-1"><div className="text-sm font-medium text-snow">{m.name}</div><div className="text-xs text-fog">{m.favorite}</div></div><div className="text-sm font-semibold text-snow">{m.month_redemptions} cafés</div></div>))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

function Chips({ label, options, value, fmt, onSelect }: { label: string; options: number[]; value: number; fmt: (v: number) => string; onSelect: (v: number) => void }) {
  return (
    <div>
      <div className="text-xs text-fog">{label}</div>
      <div className="mt-1.5 flex gap-1.5">
        {options.map((o) => (
          <button key={o} onClick={() => onSelect(o)} className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${value === o ? 'bg-lime text-ink' : 'border border-line text-fog hover:text-snow'}`}>{fmt(o)}</button>
        ))}
      </div>
    </div>
  )
}

function Chart({ title, data }: { title: string; data: { label: string; v: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.v))
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="text-sm font-semibold text-snow">{title}</div>
      <div className="mt-5 flex items-end justify-between gap-2.5">
        {data.map((d, i) => (
          <div key={i} className="flex flex-1 flex-col items-center">
            <div className="text-xs font-medium text-fog">{d.v}</div>
            <div className="mt-1.5 flex h-24 w-full items-end"><div className="w-full rounded-t-lg bg-lime transition-all" style={{ height: `${(d.v / max) * 100}%`, minHeight: 4 }} /></div>
            <div className="mt-2 text-xs text-mist">{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Popular({ icon: Icon, tint, label, name, count }: { icon: typeof Coffee; tint: 'lime' | 'iris'; label: string; name: string; count: number }) {
  const c = tint === 'iris' ? 'text-iris' : 'text-lime'
  const bg = tint === 'iris' ? 'bg-iris/10' : 'bg-lime/10'
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${bg} ${c}`}><Icon size={22} strokeWidth={2} /></span>
      <div className="min-w-0"><div className="text-xs font-medium uppercase tracking-wide text-fog">{label}</div><div className="truncate font-display text-lg font-semibold text-snow">{name}</div><div className="text-xs text-mist">{count} este mes</div></div>
    </div>
  )
}
