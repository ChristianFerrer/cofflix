import { useMemo, useState } from 'react'
import { Coffee, Plus, Minus, Clock, Phone, ShoppingBag, CircleCheck, Bell, Gift, Share2, Check } from 'lucide-react'
import { DemoShell, btn, eur, productIcon } from '../components/ui'
import { useStore, ORDER_FLOW, type Order, type OrderItem } from '../store'

const ETAS = ['Ahora', 'En 10 min', 'En 20 min']

export default function Socio() {
  const { config, members, products, favorites, currentMemberId, setCurrentMember, redeemedToday, placeOrder, orders } =
    useStore()

  const activeMembers = members.filter((x) => x.status === 'active')
  const me = members.find((x) => x.id === currentMemberId) ?? activeMembers[0]

  const remaining = Math.max(0, config.capPerDay - (redeemedToday[me.id] ?? 0))
  const [includeCoffee, setIncludeCoffee] = useState(true)
  const [drink, setDrink] = useState(me.favorite)
  const [extraQty, setExtraQty] = useState<Record<string, number>>({})
  const [eta, setEta] = useState(ETAS[1])
  const [justSent, setJustSent] = useState(false)

  const myOrders = orders.filter((o) => o.memberId === me.id)
  const readyOrders = myOrders.filter((o) => o.status === 'ready')
  const hasExtras = Object.values(extraQty).some((q) => q > 0)

  const coffeeCharged = includeCoffee && remaining <= 0
  const total = useMemo(() => {
    const extrasSum = products.reduce((a, p) => a + p.price * (extraQty[p.id] ?? 0), 0)
    return extrasSum + (coffeeCharged ? config.retailPrice : 0)
  }, [extraQty, products, coffeeCharged, config.retailPrice])

  function setQty(id: string, delta: number) {
    setExtraQty((prev) => {
      const next = { ...prev }
      const q = (next[id] ?? 0) + delta
      if (q <= 0) delete next[id]
      else next[id] = q
      return next
    })
  }

  function send() {
    const items: OrderItem[] = products
      .filter((p) => (extraQty[p.id] ?? 0) > 0)
      .map((p) => ({ name: p.name, price: p.price, qty: extraQty[p.id] }))
    placeOrder(me.id, includeCoffee ? drink : null, items, eta)
    setExtraQty({})
    setJustSent(true)
    setTimeout(() => setJustSent(false), 3000)
  }

  return (
    <DemoShell title="App del socio" subtitle="Lo que ve tu cliente en el móvil: pide y recoge sin cola.">
      {/* Selector de "sesión" para la demo */}
      <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-fog">
        <span className="text-mist">Ver como:</span>
        <select
          value={me.id}
          onChange={(e) => setCurrentMember(e.target.value)}
          className="rounded-full border border-line bg-surface2 px-3 py-1.5 text-snow outline-none focus:border-lime/50"
        >
          {activeMembers.map((x) => (
            <option key={x.id} value={x.id} className="bg-surface2">
              {x.name}
            </option>
          ))}
        </select>
      </div>

      {/* Marco tipo móvil */}
      <div className="mx-auto max-w-md space-y-4">
        {/* Aviso: pedido listo para recoger */}
        {readyOrders.length > 0 && (
          <div className="flex animate-fade-in items-center gap-3 rounded-2xl border border-amber/40 bg-amber/10 p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber text-ink">
              <Bell size={20} strokeWidth={2.2} />
            </span>
            <div>
              <div className="font-semibold text-snow">¡Tu pedido está listo para recoger!</div>
              <div className="text-xs text-fog">
                Pásate por la barra de {config.cafeName}. Da tu teléfono si te lo piden.
              </div>
            </div>
          </div>
        )}

        {/* Cabecera socio */}
        <div className="rounded-3xl border border-line bg-glow p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-lime">Club {config.cafeName}</div>
              <div className="mt-1 font-display text-2xl font-semibold text-snow">Hola, {me.name.split(' ')[0]}</div>
            </div>
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-lime text-ink">
              <Coffee size={22} strokeWidth={2.2} />
            </span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-fog">
            <Phone size={14} className="text-mist" /> {me.phone}
            <span className="text-mist">· te identifica en la barra</span>
          </div>
          <div
            className={`mt-4 flex items-center gap-3 rounded-2xl border p-4 ${
              remaining > 0 ? 'border-lime/30 bg-lime/5' : 'border-line bg-surface2'
            }`}
          >
            <span className={`grid h-10 w-10 place-items-center rounded-xl ${remaining > 0 ? 'bg-lime text-ink' : 'bg-carbon text-mist'}`}>
              <Coffee size={20} strokeWidth={2.2} />
            </span>
            <div>
              {remaining > 0 ? (
                <>
                  <div className="font-semibold text-snow">Tienes 1 café incluido hoy</div>
                  <div className="text-xs text-fog">Se reinicia cada día. Pídelo abajo o en la barra.</div>
                </>
              ) : (
                <>
                  <div className="font-semibold text-snow">Ya disfrutaste tu café de hoy</div>
                  <div className="text-xs text-fog">Vuelve mañana — o pide uno extra ahora.</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Constructor de pedido */}
        <div className="rounded-3xl border border-line bg-surface p-6">
          <h3 className="font-display text-lg font-semibold text-snow">Pide y recoge sin cola</h3>

          {/* Café */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-medium text-snow">Tu café</span>
            <button
              onClick={() => setIncludeCoffee((v) => !v)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                includeCoffee ? 'bg-lime text-ink' : 'border border-line text-fog hover:text-snow'
              }`}
            >
              {includeCoffee ? 'Añadido' : 'Añadir'}
            </button>
          </div>
          {includeCoffee && (
            <>
              <div className="mt-3 flex flex-wrap gap-2">
                {favorites.map((f) => (
                  <button
                    key={f}
                    onClick={() => setDrink(f)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      drink === f ? 'bg-snow text-ink' : 'border border-line text-fog hover:border-line2 hover:text-snow'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="mt-2 text-xs">
                {coffeeCharged ? (
                  <span className="text-fog">Hoy ya usaste tu café incluido — este se cobra a {eur(config.retailPrice, 2)}.</span>
                ) : (
                  <span className="font-semibold text-lime">Incluido en tu membresía · €0</span>
                )}
              </div>
            </>
          )}

          {/* Extras */}
          <div className="mt-6 flex items-center gap-2 text-sm font-medium text-snow">
            <ShoppingBag size={15} className="text-iris" /> Añade algo más
          </div>
          <div className="mt-3 space-y-2">
            {products.map((p) => {
              const Icon = productIcon(p.name)
              const q = extraQty[p.id] ?? 0
              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 transition ${
                    q > 0 ? 'border-lime/40 bg-lime/5' : 'border-line bg-surface2'
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-carbon text-fog">
                      <Icon size={16} strokeWidth={2} />
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-snow">{p.name}</div>
                      <div className="text-xs text-mist">{p.tag} · {eur(p.price, 2)}</div>
                    </div>
                  </div>
                  {q > 0 ? (
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={() => setQty(p.id, -1)}
                        className="grid h-7 w-7 place-items-center rounded-full border border-line text-snow transition hover:bg-surface"
                        aria-label="Quitar uno"
                      >
                        <Minus size={14} strokeWidth={2.5} />
                      </button>
                      <span className="w-4 text-center text-sm font-semibold text-snow">{q}</span>
                      <button
                        onClick={() => setQty(p.id, 1)}
                        className="grid h-7 w-7 place-items-center rounded-full bg-lime text-ink transition hover:bg-lime-deep"
                        aria-label="Añadir uno"
                      >
                        <Plus size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setQty(p.id, 1)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-carbon text-fog transition hover:text-snow"
                      aria-label="Añadir"
                    >
                      <Plus size={15} strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* ETA */}
          <div className="mt-6 flex items-center gap-2 text-sm font-medium text-snow">
            <Clock size={15} className="text-fog" /> ¿Cuándo lo recoges?
          </div>
          <div className="mt-3 flex gap-2">
            {ETAS.map((e) => (
              <button
                key={e}
                onClick={() => setEta(e)}
                className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition ${
                  eta === e ? 'bg-snow text-ink' : 'border border-line text-fog hover:text-snow'
                }`}
              >
                {e}
              </button>
            ))}
          </div>

          {/* Total + enviar */}
          <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
            <div className="text-sm text-fog">
              A pagar al recoger
              <div className="font-display text-xl font-semibold text-snow">{eur(total, 2)}</div>
            </div>
            <button
              onClick={send}
              disabled={!includeCoffee && !hasExtras}
              className={`${btn('primary')} disabled:cursor-not-allowed disabled:opacity-40`}
            >
              Enviar pedido
            </button>
          </div>
          {justSent && (
            <div className="mt-3 flex items-center justify-center gap-1.5 text-sm font-semibold text-mint">
              <CircleCheck size={16} /> Pedido enviado · lo verás abajo y en la barra
            </div>
          )}
        </div>

        {/* Invita y gana */}
        <InviteCard name={me.name} phone={me.phone} referrals={me.referrals} cafe={config.cafeName} />

        {/* Mis pedidos */}
        <div className="rounded-3xl border border-line bg-surface p-6">
          <h3 className="font-display text-lg font-semibold text-snow">Mis pedidos</h3>
          {myOrders.length === 0 && <p className="mt-2 text-sm text-fog">Aún no has hecho ningún pedido.</p>}
          <div className="mt-3 space-y-3">
            {myOrders.map((o) => (
              <OrderProgress key={o.id} order={o} />
            ))}
          </div>
        </div>
      </div>
    </DemoShell>
  )
}

function InviteCard({ name, phone, referrals, cafe }: { name: string; phone: string; referrals: number; cafe: string }) {
  const [copied, setCopied] = useState(false)
  const code = `CLUB-${name.split(' ')[0].toUpperCase()}${phone.replace(/\D/g, '').slice(-2)}`
  const text = `Únete al Club de ${cafe} con mi código ${code} y los dos ganamos una semana gratis · https://coffeeme.app/club`

  function share() {
    try {
      navigator.clipboard?.writeText(text)
    } catch {
      /* ignore */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="rounded-3xl border border-lime/20 bg-surface p-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-snow">
        <Gift size={16} className="text-lime" /> Invita y gana
      </div>
      <p className="mt-1 text-sm text-fog">
        Por cada amigo que se una al club, <strong className="text-snow">una semana gratis para los dos</strong>.
      </p>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-dashed border-line2 bg-surface2 px-4 py-3">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-mist">Tu código</div>
          <div className="font-display text-lg font-semibold text-lime">{code}</div>
        </div>
        <button onClick={share} className={btn(copied ? 'outline' : 'primary')}>
          {copied ? <><Check size={16} strokeWidth={2.5} /> Copiado</> : <><Share2 size={16} strokeWidth={2.2} /> Compartir</>}
        </button>
      </div>

      <div className="mt-3 text-xs text-fog">
        Has invitado a <strong className="text-snow">{referrals}</strong> amigo{referrals === 1 ? '' : 's'}
        {referrals > 0 && <span className="text-mint"> · {referrals} semana{referrals === 1 ? '' : 's'} gratis ganadas</span>}
      </div>
    </div>
  )
}

const STEP_SHORT = ['En cola', 'Preparando', 'Listo', 'Entregado']

function OrderProgress({ order }: { order: Order }) {
  const current = ORDER_FLOW.indexOf(order.status)
  return (
    <div className={`rounded-xl border bg-surface2 p-3.5 ${order.status === 'ready' ? 'border-amber/40' : 'border-line'}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-mist">Pedido</span>
        <span className="flex items-center gap-1 text-xs text-mist">
          <Clock size={12} /> {order.eta}
        </span>
      </div>
      <div className="mt-2 space-y-1.5 text-sm">
        {order.includedDrink && (
          <div className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-2 text-snow">
              <Coffee size={14} className="shrink-0 text-fog" />
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
                <Icon size={14} className="shrink-0 text-fog" />
                <span className="truncate">{e.name}</span>
                <span className="text-xs text-mist">×{e.qty}</span>
              </span>
              <span className="shrink-0 font-semibold text-amber">{eur(e.price * e.qty, 2)}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {ORDER_FLOW.map((s, i) => {
          const done = i <= current
          const color = s === 'delivered' ? 'bg-mint' : s === 'ready' ? 'bg-amber' : 'bg-lime'
          return (
            <div key={s} className="space-y-1">
              <div className={`h-1.5 rounded-full ${done ? color : 'bg-line2'} ${i === current ? 'animate-pulse' : ''}`} />
              <div className={`text-[10px] leading-tight ${i === current ? 'font-semibold text-snow' : 'text-mist'}`}>
                {STEP_SHORT[i]}
              </div>
            </div>
          )
        })}
      </div>
      {order.status === 'ready' && (
        <div className="mt-2.5 text-xs font-semibold text-amber">Listo para recoger · pásate por la barra</div>
      )}
    </div>
  )
}
