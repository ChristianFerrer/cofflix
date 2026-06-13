import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Search, Check, X, Coffee, MousePointerClick, Phone, Clock, Package, ChevronRight, UserPlus, Plus, Users,
} from 'lucide-react'
import { AppLayout, Loader } from '../../app/AppLayout'
import { eur, productIcon, btn } from '../../components/ui'
import { useAuth } from '../../auth/AuthProvider'
import { supabase, type Cafe } from '../../lib/supabase'

const FLOW = ['queued', 'preparing', 'ready', 'delivered'] as const
type Status = (typeof FLOW)[number]
const NEXT_ACTION: Record<string, string> = { queued: 'Empezar', preparing: 'Marcar listo', ready: 'Entregar' }
const STATUS_LABEL: Record<Status, string> = { queued: 'En cola', preparing: 'En preparación', ready: 'Listo para recoger', delivered: 'Entregado' }
const CAPTURE_THRESHOLD = 8
const FAVORITES = ['Flat white', 'Cortado', 'Espresso', 'Latte', 'Cappuccino', 'V60', 'Cold brew']

interface Member { id: string; name: string; phone: string | null; favorite: string | null; status: string; month_redemptions: number }
interface Prospect { id: string; name: string; phone: string | null; favorite: string | null; visits_this_month: number }
interface OrderItemRow { name: string; price: number; qty: number }
interface OrderRow { id: string; member_id: string | null; member_name: string | null; phone: string | null; included_drink: string | null; status: Status; eta: string | null; order_items: OrderItemRow[] }

function todayStartISO() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

export default function CafeCaja() {
  const { profile } = useAuth()
  const cafeId = profile?.cafe_id ?? null

  const [cafe, setCafe] = useState<Cafe | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [redeemedToday, setRedeemedToday] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    if (!cafeId) { setLoading(false); return }
    const [c, m, p, o, r] = await Promise.all([
      supabase.from('cafes').select('*').eq('id', cafeId).maybeSingle(),
      supabase.from('members').select('id,name,phone,favorite,status,month_redemptions').eq('cafe_id', cafeId).order('name'),
      supabase.from('prospects').select('id,name,phone,favorite,visits_this_month').eq('cafe_id', cafeId).order('visits_this_month', { ascending: false }),
      supabase.from('orders').select('id,member_id,member_name,phone,included_drink,status,eta, order_items(name,price,qty)').eq('cafe_id', cafeId).neq('status', 'delivered'),
      supabase.from('redemptions').select('member_id').eq('cafe_id', cafeId).gte('created_at', todayStartISO()),
    ])
    setCafe((c.data as Cafe) ?? null)
    setMembers((m.data as Member[]) ?? [])
    setProspects((p.data as Prospect[]) ?? [])
    setOrders((o.data as OrderRow[]) ?? [])
    const map: Record<string, number> = {}
    ;((r.data as { member_id: string }[]) ?? []).forEach((x) => { map[x.member_id] = (map[x.member_id] ?? 0) + 1 })
    setRedeemedToday(map)
    setLoading(false)
  }, [cafeId])

  useEffect(() => { void fetchAll() }, [fetchAll])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const qd = q.replace(/\D/g, '')
    const list = q
      ? members.filter((m) => m.name.toLowerCase().includes(q) || (qd.length >= 2 && (m.phone ?? '').replace(/\D/g, '').includes(qd)))
      : members
    return list.slice(0, 40)
  }, [members, query])

  if (loading) return <Loader />
  if (!cafe) return <AppLayout><div className="rounded-2xl border border-line bg-surface p-8 text-center text-fog">No tienes una cafetería asignada.</div></AppLayout>

  const cap = cafe.cap_per_day
  const selected = members.find((m) => m.id === selectedId) ?? null
  const pending = [...orders].sort((a, b) => etaMin(a.eta) - etaMin(b.eta))

  function verify(m: Member): { ok: boolean; title: string; detail: string } {
    if (m.status === 'cancelled') return { ok: false, title: 'No es socio activo', detail: 'La membresía está cancelada.' }
    if (m.status === 'failed') return { ok: false, title: 'Pago pendiente', detail: 'El último cobro falló. Pídele actualizar el método de pago.' }
    const used = redeemedToday[m.id] ?? 0
    if (used >= cap) return { ok: false, title: 'Ya tomó su café de hoy', detail: `Tope alcanzado (${used}/${cap}).` }
    return { ok: true, title: 'Socio activo', detail: `Café incluido. Le queda ${cap - used} hoy.` }
  }

  async function redeem(m: Member) {
    if (!verify(m).ok) return
    await supabase.from('redemptions').insert({ cafe_id: cafeId, member_id: m.id })
    await supabase.from('members').update({ month_redemptions: m.month_redemptions + 1, last_visit_at: new Date().toISOString() }).eq('id', m.id)
    setFlash('Café registrado. Margen protegido por el tope.')
    setTimeout(() => setFlash(null), 2600)
    void fetchAll()
  }

  async function advance(o: OrderRow) {
    const idx = FLOW.indexOf(o.status)
    if (idx < 0 || idx >= FLOW.length - 1) return
    const next = FLOW[idx + 1]
    await supabase.from('orders').update({ status: next }).eq('id', o.id)
    if (next === 'delivered' && o.included_drink && o.member_id) {
      const mem = members.find((m) => m.id === o.member_id)
      if (mem && verify(mem).ok) {
        await supabase.from('redemptions').insert({ cafe_id: cafeId, member_id: o.member_id })
        await supabase.from('members').update({ month_redemptions: mem.month_redemptions + 1, last_visit_at: new Date().toISOString() }).eq('id', o.member_id)
      }
    }
    void fetchAll()
  }

  const result = selected ? verify(selected) : null

  return (
    <AppLayout>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-semibold text-snow">Caja · {cafe.name}</h1>
        <p className="mt-1 text-sm text-fog">Verifica al socio, aplica el tope diario y gestiona los pedidos para recoger.</p>
      </div>

      {/* Pedidos para recoger */}
      <div className="mb-5 rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-snow"><Package size={16} className="text-iris" /> Pedidos para recoger</div>
          <span className="rounded-full bg-iris/10 px-2 py-0.5 text-xs font-semibold text-iris">{pending.length}</span>
        </div>
        {pending.length === 0 ? (
          <p className="mt-3 text-sm text-fog">No hay pedidos en marcha.</p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pending.map((o) => <OrderCard key={o.id} order={o} onAdvance={() => advance(o)} />)}
          </div>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-2xl border border-line bg-surface p-4">
          <div className="relative">
            <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mist" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre o teléfono…" className="w-full rounded-xl border border-line bg-surface2 py-2.5 pl-10 pr-4 text-sm text-snow placeholder:text-mist outline-none focus:border-lime/50" />
          </div>
          <div className="mt-3 max-h-[24rem] space-y-1 overflow-y-auto pr-1">
            {filtered.map((m) => {
              const used = redeemedToday[m.id] ?? 0
              const dot = m.status === 'cancelled' ? 'bg-mist' : m.status === 'failed' ? 'bg-rose' : used > 0 ? 'bg-iris' : 'bg-mint'
              return (
                <button key={m.id} onClick={() => { setSelectedId(m.id); setFlash(null) }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${selectedId === m.id ? 'bg-lime text-ink' : 'text-snow hover:bg-surface2'}`}>
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{m.name}</span>
                    <span className={`block truncate text-xs ${selectedId === m.id ? 'text-ink/60' : 'text-mist'}`}>{m.phone}</span>
                  </span>
                  <span className={`text-xs ${selectedId === m.id ? 'text-ink/60' : 'text-mist'}`}>{m.favorite}</span>
                </button>
              )
            })}
            {filtered.length === 0 && <div className="py-8 text-center text-sm text-fog">Sin resultados.</div>}
          </div>
        </div>

        <div>
          {!selected || !result ? (
            <div className="grid h-full min-h-[20rem] place-items-center rounded-2xl border-2 border-dashed border-line bg-surface/40 p-8 text-center text-fog">
              <div><MousePointerClick size={32} className="mx-auto text-mist" /><p className="mt-3 max-w-xs text-sm">Selecciona un socio para ver su estado en caja.</p></div>
            </div>
          ) : (
            <div className={`overflow-hidden rounded-2xl border ${result.ok ? 'border-mint/30 bg-mint-soft' : 'border-rose/30 bg-rose-soft'}`}>
              <div className={`px-6 py-7 text-center text-ink ${result.ok ? 'bg-mint' : 'bg-rose'}`}>
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ink/15">{result.ok ? <Check size={30} strokeWidth={3} /> : <X size={30} strokeWidth={3} />}</div>
                <div className="mt-3 font-display text-xl font-semibold">{result.title}</div>
                <div className="mx-auto mt-1 max-w-xs text-sm text-ink/75">{result.detail}</div>
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <div><div className="font-display text-lg font-semibold text-snow">{selected.name}</div><div className="flex items-center gap-1.5 text-sm text-fog"><Phone size={13} className="text-mist" /> {selected.phone}</div></div>
                  <div className="text-right text-sm text-fog"><div>{selected.favorite}</div><div>{selected.month_redemptions} cafés/mes</div></div>
                </div>
                {result.ok ? (
                  <button onClick={() => redeem(selected)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime py-3.5 font-semibold text-ink transition hover:bg-lime-deep active:scale-[0.99]"><Coffee size={18} strokeWidth={2.2} /> Registrar café incluido</button>
                ) : (
                  <div className="rounded-xl border border-rose/30 bg-surface px-4 py-3 text-center text-sm font-medium text-rose">Cobra este café a precio normal — no descuenta del club.</div>
                )}
                {flash && <div className="flex items-center justify-center gap-2 text-center text-sm font-semibold text-mint"><Check size={16} strokeWidth={2.5} /> {flash}</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      <ApuntadosPanel cafeId={cafeId!} prospects={prospects} onChange={fetchAll} />
    </AppLayout>
  )
}

function etaMin(eta: string | null) {
  if (!eta) return 99
  if (/ahora/i.test(eta)) return 0
  const m = eta.match(/\d+/)
  return m ? parseInt(m[0], 10) : 99
}

function OrderCard({ order, onAdvance }: { order: OrderRow; onAdvance: () => void }) {
  const items = order.order_items ?? []
  const extrasTotal = items.reduce((a, e) => a + Number(e.price) * e.qty, 0)
  const free = extrasTotal === 0
  const ready = order.status === 'ready'
  const idx = FLOW.indexOf(order.status)
  return (
    <div className={`rounded-xl border bg-surface2 p-3.5 ${ready ? 'border-amber/40 ring-1 ring-amber/20' : 'border-line'}`}>
      <div className="flex items-start justify-between">
        <div><div className="text-sm font-semibold text-snow">{order.member_name}</div><div className="flex items-center gap-1 text-xs text-mist"><Phone size={11} /> {order.phone}</div></div>
        <span className="flex items-center gap-1 rounded-full bg-iris/10 px-2 py-0.5 text-[11px] font-semibold text-iris"><Clock size={11} /> {order.eta}</span>
      </div>
      <div className="mt-2 flex items-center gap-1">{FLOW.map((s, i) => (<span key={s} className={`h-1.5 flex-1 rounded-full ${i <= idx ? (s === 'ready' ? 'bg-amber' : s === 'delivered' ? 'bg-mint' : 'bg-lime') : 'bg-line2'}`} />))}</div>
      <div className="mt-1.5 text-xs font-semibold text-fog">{STATUS_LABEL[order.status]}</div>
      <div className="mt-2.5 space-y-1.5 text-sm">
        {order.included_drink && <div className="flex items-center justify-between gap-2"><span className="flex min-w-0 items-center gap-2 text-snow"><Coffee size={15} className="shrink-0 text-fog" /><span className="truncate">{order.included_drink}</span><span className="text-xs text-mist">×1</span></span><span className="shrink-0 text-xs font-semibold text-lime">incluido</span></div>}
        {items.map((e, i) => { const Icon = productIcon(e.name); return (<div key={i} className="flex items-center justify-between gap-2"><span className="flex min-w-0 items-center gap-2 text-snow"><Icon size={15} className="shrink-0 text-fog" /><span className="truncate">{e.name}</span><span className="text-xs text-mist">×{e.qty}</span></span><span className="shrink-0 font-semibold text-amber">{eur(Number(e.price) * e.qty, 2)}</span></div>) })}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
        {free ? <span className="flex items-center gap-1.5 rounded-lg bg-mint/15 px-2.5 py-1.5 font-display text-base font-semibold text-mint"><Check size={16} strokeWidth={3} /> Sin cobro</span> : <div className="leading-none"><div className="text-[10px] font-medium uppercase tracking-wide text-mist">A cobrar</div><div className="mt-0.5 font-display text-2xl font-semibold text-amber">{eur(extrasTotal, 2)}</div></div>}
        <button onClick={onAdvance} className="flex items-center gap-1.5 rounded-full bg-lime px-3.5 py-2 text-xs font-semibold text-ink transition hover:bg-lime-deep active:scale-95">{NEXT_ACTION[order.status]} <ChevronRight size={14} strokeWidth={2.5} /></button>
      </div>
    </div>
  )
}

function ApuntadosPanel({ cafeId, prospects, onChange }: { cafeId: string; prospects: Prospect[]; onChange: () => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [fav, setFav] = useState(FAVORITES[0])
  const inputCls = 'w-full rounded-xl border border-line bg-surface2 px-3 py-2 text-sm text-snow placeholder:text-mist outline-none focus:border-lime/50'

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    await supabase.from('prospects').insert({ cafe_id: cafeId, name: name.trim(), phone: phone.trim(), favorite: fav, visits_this_month: 1 })
    setName(''); setPhone(''); setOpen(false); onChange()
  }
  async function addVisit(p: Prospect) {
    await supabase.from('prospects').update({ visits_this_month: p.visits_this_month + 1 }).eq('id', p.id)
    onChange()
  }

  return (
    <div className="mt-5 rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-snow"><Users size={16} className="text-iris" /> Clientes apuntados · nivel gratis</div>
          <p className="mt-1 text-xs text-fog">Apunta gratis y suma visitas. A las {CAPTURE_THRESHOLD}/mes pasa a tu lista de captación en el panel.</p>
        </div>
        <button onClick={() => setOpen((v) => !v)} className={btn(open ? 'outline' : 'primary')}><UserPlus size={16} strokeWidth={2.2} /> {open ? 'Cerrar' : 'Apuntar'}</button>
      </div>
      {open && (
        <form onSubmit={submit} className="mt-4 grid gap-2 rounded-xl border border-line bg-surface2 p-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" className={inputCls} />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Teléfono" className={inputCls} />
          <select value={fav} onChange={(e) => setFav(e.target.value)} className={inputCls}>{FAVORITES.map((f) => <option key={f} className="bg-surface2">{f}</option>)}</select>
          <button type="submit" className={btn('primary')}>Apuntar</button>
        </form>
      )}
      <div className="mt-4 space-y-2">
        {prospects.length === 0 && <p className="py-4 text-center text-sm text-fog">Aún no hay clientes apuntados.</p>}
        {prospects.map((p) => {
          const captable = p.visits_this_month >= CAPTURE_THRESHOLD
          const left = Math.max(0, CAPTURE_THRESHOLD - p.visits_this_month)
          return (
            <div key={p.id} className={`flex items-center justify-between gap-3 rounded-xl border bg-surface2 px-3 py-2.5 ${captable ? 'border-lime/40' : 'border-line'}`}>
              <div className="min-w-0">
                <div className="flex items-center gap-2"><span className="truncate text-sm font-medium text-snow">{p.name}</span>{captable && <span className="rounded-full bg-lime/10 px-2 py-0.5 text-[10px] font-semibold text-lime">captable</span>}</div>
                <div className="text-xs text-mist">{p.favorite} · {p.visits_this_month} visitas/mes{!captable && ` · faltan ${left}`}</div>
              </div>
              <button onClick={() => addVisit(p)} className="flex shrink-0 items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-snow transition hover:border-lime/50 hover:text-lime active:scale-95"><Plus size={13} strokeWidth={2.5} /> visita</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
