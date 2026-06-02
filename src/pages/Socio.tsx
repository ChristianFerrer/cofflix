import { useMemo, useState } from 'react'
import { Coffee, Plus, Clock, Phone, ShoppingBag, Check, CircleCheck, Bell } from 'lucide-react'
import { DemoShell, btn, eur } from '../components/ui'
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
  const [extras, setExtras] = useState<string[]>([])
  const [eta, setEta] = useState(ETAS[1])
  const [justSent, setJustSent] = useState(false)

  const myOrders = orders.filter((o) => o.memberId === me.id)
  const readyOrders = myOrders.filter((o) => o.status === 'ready')

  const coffeeCharged = includeCoffee && remaining <= 0
  const total = useMemo(() => {
    const extrasSum = extras.reduce((a, id) => a + (products.find((p) => p.id === id)?.price ?? 0), 0)
    return extrasSum + (coffeeCharged ? config.retailPrice : 0)
  }, [extras, products, coffeeCharged, config.retailPrice])

  function toggleExtra(id: string) {
    setExtras((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function send() {
    const items: OrderItem[] = extras.map((id) => {
      const p = products.find((x) => x.id === id)!
      return { name: p.name, price: p.price }
    })
    placeOrder(me.id, includeCoffee ? drink : null, items, eta)
    setExtras([])
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
              const on = extras.includes(p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => toggleExtra(p.id)}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left transition ${
                    on ? 'border-lime/40 bg-lime/5' : 'border-line bg-surface2 hover:border-line2'
                  }`}
                >
                  <div>
                    <div className="text-sm font-medium text-snow">{p.name}</div>
                    <div className="text-xs text-mist">{p.tag}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-snow">{eur(p.price, 2)}</span>
                    <span className={`grid h-6 w-6 place-items-center rounded-full ${on ? 'bg-lime text-ink' : 'bg-carbon text-fog'}`}>
                      {on ? <Check size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={2.5} />}
                    </span>
                  </div>
                </button>
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
              disabled={!includeCoffee && extras.length === 0}
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

const STEP_SHORT = ['En cola', 'Preparando', 'Listo', 'Entregado']

function OrderProgress({ order }: { order: Order }) {
  const current = ORDER_FLOW.indexOf(order.status)
  return (
    <div className={`rounded-xl border bg-surface2 p-3.5 ${order.status === 'ready' ? 'border-amber/40' : 'border-line'}`}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-snow">
          {order.includedDrink ?? 'Pedido'}
          {order.extras.length > 0 && (
            <span className="text-fog"> · +{order.extras.length} extra{order.extras.length > 1 ? 's' : ''}</span>
          )}
        </div>
        <span className="flex items-center gap-1 text-xs text-mist">
          <Clock size={12} /> {order.eta}
        </span>
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
