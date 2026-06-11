import { useMemo, useState } from 'react'
import { Search, Check, X, Coffee, MousePointerClick, Phone, Clock, Package, ChevronRight, UserPlus, Plus, Users } from 'lucide-react'
import { DemoShell, eur, productIcon, btn } from '../components/ui'
import { useStore, ORDER_FLOW, ORDER_LABEL, CAPTURE_THRESHOLD, type Member, type Order, type Prospect, type VerifyResult } from '../store'

export default function Caja() {
  const { members, orders, verify, redeem, redeemedToday, advanceOrder } = useStore()
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [flash, setFlash] = useState<VerifyResult | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const qDigits = q.replace(/\D/g, '')
    const list = q
      ? members.filter(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            (qDigits.length >= 2 && m.phone.replace(/\D/g, '').includes(qDigits)),
        )
      : members
    return list.slice(0, 40)
  }, [members, query])

  const active = orders
    .filter((o) => o.status !== 'delivered')
    .sort((a, b) => etaMinutes(a.eta) - etaMinutes(b.eta) || b.placedAgoMin - a.placedAgoMin)
  const selected = members.find((m) => m.id === selectedId) ?? null
  const result = selected ? verify(selected.id) : null

  function handleRedeem() {
    if (!selected) return
    const r = redeem(selected.id)
    setFlash(r)
    setTimeout(() => setFlash(null), 2600)
  }

  return (
    <DemoShell title="Caja" subtitle="Busca al socio por nombre o teléfono y gestiona los pedidos para recoger.">
      {/* Pedidos para recoger */}
      <div className="mb-5 rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-snow">
            <Package size={16} className="text-iris" /> Pedidos para recoger
          </div>
          <span className="rounded-full bg-iris/10 px-2 py-0.5 text-xs font-semibold text-iris">{active.length}</span>
        </div>
        {active.length === 0 ? (
          <p className="mt-3 text-sm text-fog">No hay pedidos en marcha.</p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((o) => (
              <OrderCard key={o.id} order={o} onAdvance={() => advanceOrder(o.id)} />
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        {/* Lista de socios */}
        <div className="rounded-2xl border border-line bg-surface p-4">
          <div className="relative">
            <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mist" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre o teléfono…"
              className="w-full rounded-xl border border-line bg-surface2 py-2.5 pl-10 pr-4 text-sm text-snow placeholder:text-mist outline-none transition focus:border-lime/50 focus:ring-2 focus:ring-lime/20"
            />
          </div>
          <div className="mt-3 max-h-[24rem] space-y-1 overflow-y-auto pr-1">
            {filtered.map((m) => (
              <MemberRow
                key={m.id}
                member={m}
                usedToday={redeemedToday[m.id] ?? 0}
                active={m.id === selectedId}
                onClick={() => {
                  setSelectedId(m.id)
                  setFlash(null)
                }}
              />
            ))}
            {filtered.length === 0 && <div className="py-8 text-center text-sm text-fog">Sin resultados.</div>}
          </div>
        </div>

        {/* Panel de verificación */}
        <div>
          {!selected || !result ? (
            <div className="grid h-full min-h-[20rem] place-items-center rounded-2xl border-2 border-dashed border-line bg-surface/40 p-8 text-center text-fog">
              <div>
                <MousePointerClick size={32} className="mx-auto text-mist" />
                <p className="mt-3 max-w-xs text-sm">Selecciona un socio de la lista para ver su estado en caja.</p>
              </div>
            </div>
          ) : (
            <VerifyCard member={selected} result={result} flash={flash} onRedeem={handleRedeem} />
          )}
        </div>
      </div>

      <p className="mt-5 text-center text-xs text-mist">
        Prueba a buscar <strong className="text-fog">«616»</strong> (teléfono) ·{' '}
        <strong className="text-fog">Marc Soler</strong> ya tomó su café hoy ·{' '}
        <strong className="text-fog">David Lluch</strong> tiene un pago pendiente.
      </p>

      <ApuntadosPanel />
    </DemoShell>
  )
}

function ApuntadosPanel() {
  const { prospects, favorites, addProspect, addProspectVisit } = useStore()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [fav, setFav] = useState(favorites[0])

  const sorted = [...prospects].sort((a, b) => b.visitsThisMonth - a.visitsThisMonth)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    addProspect(name, phone, fav)
    setName('')
    setPhone('')
    setOpen(false)
  }

  const inputCls =
    'w-full rounded-xl border border-line bg-surface2 px-3 py-2 text-sm text-snow placeholder:text-mist outline-none transition focus:border-lime/50'

  return (
    <div className="mt-5 rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-snow">
            <Users size={16} className="text-iris" /> Clientes apuntados · nivel gratis
          </div>
          <p className="mt-1 text-xs text-fog">
            Apunta a un cliente gratis y suma sus visitas. A las {CAPTURE_THRESHOLD} pasa a tu lista de
            captación en el panel.
          </p>
        </div>
        <button onClick={() => setOpen((v) => !v)} className={btn(open ? 'outline' : 'primary')}>
          <UserPlus size={16} strokeWidth={2.2} /> {open ? 'Cerrar' : 'Apuntar cliente'}
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="mt-4 grid gap-2 rounded-xl border border-line bg-surface2 p-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" className={inputCls} />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Teléfono" className={inputCls} />
          <select value={fav} onChange={(e) => setFav(e.target.value)} className={inputCls}>
            {favorites.map((f) => (
              <option key={f} className="bg-surface2">{f}</option>
            ))}
          </select>
          <button type="submit" className={btn('primary')}>Apuntar</button>
        </form>
      )}

      <div className="mt-4 space-y-2">
        {sorted.length === 0 && <p className="py-4 text-center text-sm text-fog">Aún no hay clientes apuntados.</p>}
        {sorted.map((p) => (
          <ProspectRow key={p.id} prospect={p} onVisit={() => addProspectVisit(p.id)} />
        ))}
      </div>
    </div>
  )
}

function ProspectRow({ prospect: p, onVisit }: { prospect: Prospect; onVisit: () => void }) {
  const captable = p.visitsThisMonth >= CAPTURE_THRESHOLD
  const left = Math.max(0, CAPTURE_THRESHOLD - p.visitsThisMonth)
  return (
    <div className={`flex items-center justify-between gap-3 rounded-xl border bg-surface2 px-3 py-2.5 ${captable ? 'border-lime/40' : 'border-line'}`}>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-snow">{p.name}</span>
          {captable && <span className="rounded-full bg-lime/10 px-2 py-0.5 text-[10px] font-semibold text-lime">captable</span>}
        </div>
        <div className="text-xs text-mist">
          {p.favorite} · {p.visitsThisMonth} visitas/mes
          {!captable && <span> · faltan {left} para captar</span>}
        </div>
      </div>
      <button
        onClick={onVisit}
        className="flex shrink-0 items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-snow transition hover:border-lime/50 hover:text-lime active:scale-95"
      >
        <Plus size={13} strokeWidth={2.5} /> visita
      </button>
    </div>
  )
}

function etaMinutes(eta: string) {
  if (/ahora/i.test(eta)) return 0
  const match = eta.match(/\d+/)
  return match ? parseInt(match[0], 10) : 99
}

const NEXT_ACTION: Record<string, string> = {
  queued: 'Empezar',
  preparing: 'Marcar listo',
  ready: 'Entregar',
}

function OrderStepper({ status }: { status: Order['status'] }) {
  const current = ORDER_FLOW.indexOf(status)
  return (
    <div className="mt-3 flex items-center gap-1">
      {ORDER_FLOW.map((s, i) => {
        const done = i <= current
        const isCurrent = i === current
        return (
          <div key={s} className="flex flex-1 items-center gap-1">
            <span
              className={`h-1.5 flex-1 rounded-full transition ${
                done ? (s === 'ready' ? 'bg-amber' : s === 'delivered' ? 'bg-mint' : 'bg-lime') : 'bg-line2'
              } ${isCurrent ? 'animate-pulse' : ''}`}
            />
          </div>
        )
      })}
    </div>
  )
}

function OrderCard({ order, onAdvance }: { order: Order; onAdvance: () => void }) {
  const extrasTotal = order.extras.reduce((a, e) => a + e.price * e.qty, 0)
  const free = extrasTotal === 0
  const ready = order.status === 'ready'
  const statusColor =
    order.status === 'ready' ? 'text-amber' : order.status === 'preparing' ? 'text-lime' : 'text-fog'
  return (
    <div className={`rounded-xl border bg-surface2 p-3.5 ${ready ? 'border-amber/40 ring-1 ring-amber/20' : 'border-line'}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-snow">{order.memberName}</div>
          <div className="flex items-center gap-1 text-xs text-mist"><Phone size={11} /> {order.phone}</div>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-iris/10 px-2 py-0.5 text-[11px] font-semibold text-iris">
          <Clock size={11} /> {order.eta}
        </span>
      </div>

      <OrderStepper status={order.status} />
      <div className={`mt-1.5 text-xs font-semibold ${statusColor}`}>{ORDER_LABEL[order.status]}</div>

      <div className="mt-2.5 space-y-1.5 text-sm">
        {order.includedDrink && (
          <div className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-2 text-snow">
              <Coffee size={15} className="shrink-0 text-fog" />
              <span className="truncate">{order.includedDrink}</span>
              <span className="text-xs text-mist">×1</span>
            </span>
            <span className="shrink-0 text-xs font-semibold text-lime">incluido</span>
          </div>
        )}
        {order.extras.map((e, i) => {
          const Icon = productIcon(e.name)
          return (
            <div key={i} className="flex items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-2 text-snow">
                <Icon size={15} className="shrink-0 text-fog" />
                <span className="truncate">{e.name}</span>
                <span className="text-xs text-mist">×{e.qty}</span>
              </span>
              <span className="shrink-0 font-semibold text-amber">{eur(e.price * e.qty, 2)}</span>
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
        {free ? (
          <span className="flex items-center gap-1.5 rounded-lg bg-mint/15 px-2.5 py-1.5 font-display text-base font-semibold text-mint">
            <Check size={16} strokeWidth={3} /> Sin cobro
          </span>
        ) : (
          <div className="leading-none">
            <div className="text-[10px] font-medium uppercase tracking-wide text-mist">A cobrar</div>
            <div className="mt-0.5 font-display text-2xl font-semibold text-amber">{eur(extrasTotal, 2)}</div>
          </div>
        )}
        <button
          onClick={onAdvance}
          className="flex items-center gap-1.5 rounded-full bg-lime px-3.5 py-2 text-xs font-semibold text-ink transition hover:bg-lime-deep active:scale-95"
        >
          {NEXT_ACTION[order.status]} <ChevronRight size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}

function MemberRow({
  member,
  usedToday,
  active,
  onClick,
}: {
  member: Member
  usedToday: number
  active: boolean
  onClick: () => void
}) {
  const dot =
    member.status === 'cancelled'
      ? 'bg-mist'
      : member.status === 'failed'
        ? 'bg-rose'
        : usedToday > 0
          ? 'bg-iris'
          : 'bg-mint'
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
        active ? 'bg-lime text-ink' : 'text-snow hover:bg-surface2'
      }`}
    >
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{member.name}</span>
        <span className={`block truncate text-xs ${active ? 'text-ink/60' : 'text-mist'}`}>{member.phone}</span>
      </span>
      <span className={`text-xs ${active ? 'text-ink/60' : 'text-mist'}`}>{member.favorite}</span>
    </button>
  )
}

function VerifyCard({
  member,
  result,
  flash,
  onRedeem,
}: {
  member: Member
  result: VerifyResult
  flash: VerifyResult | null
  onRedeem: () => void
}) {
  const ok = result.ok
  return (
    <div
      key={member.id}
      className={`animate-fade-in overflow-hidden rounded-2xl border ${
        ok ? 'border-mint/30 bg-mint-soft' : 'border-rose/30 bg-rose-soft'
      }`}
    >
      <div className={`px-6 py-7 text-center text-ink ${ok ? 'bg-mint' : 'bg-rose'}`}>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ink/15">
          {ok ? <Check size={30} strokeWidth={3} /> : <X size={30} strokeWidth={3} />}
        </div>
        <div className="mt-3 font-display text-xl font-semibold">{result.title}</div>
        <div className="mx-auto mt-1 max-w-xs text-sm text-ink/75">{result.detail}</div>
      </div>

      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-lg font-semibold text-snow">{member.name}</div>
            <div className="flex items-center gap-1.5 text-sm text-fog"><Phone size={13} className="text-mist" /> {member.phone}</div>
          </div>
          <div className="text-right text-sm text-fog">
            <div>{member.favorite}</div>
            <div>{member.monthRedemptions} cafés este mes</div>
          </div>
        </div>

        {ok ? (
          <button
            onClick={onRedeem}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime py-3.5 font-semibold text-ink transition hover:bg-lime-deep active:scale-[0.99]"
          >
            <Coffee size={18} strokeWidth={2.2} /> Registrar café incluido
          </button>
        ) : (
          <div className="rounded-xl border border-rose/30 bg-surface px-4 py-3 text-center text-sm font-medium text-rose">
            Cobra este café a precio normal — no descuenta del club.
          </div>
        )}
      </div>

      {flash && (
        <div
          className={`flex items-center justify-center gap-2 px-6 pb-5 text-center text-sm font-semibold ${
            flash.ok ? 'text-mint' : 'text-rose'
          }`}
        >
          {flash.ok ? (
            <>
              <Check size={16} strokeWidth={2.5} /> Café registrado. Margen protegido por el tope.
            </>
          ) : (
            <>
              <X size={16} strokeWidth={2.5} /> {flash.title}
            </>
          )}
        </div>
      )}
    </div>
  )
}
