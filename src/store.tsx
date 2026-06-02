import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

/* ------------------------------------------------------------------ */
/*  Tipos                                                              */
/* ------------------------------------------------------------------ */

export type MemberStatus = 'active' | 'failed' | 'cancelled'

export interface Member {
  id: string
  name: string
  email: string
  phone: string
  status: MemberStatus
  joinedDaysAgo: number
  monthRedemptions: number
  lastVisitDaysAgo: number
  favorite: string
  attachVisits: number // visitas en las que añadió bollería/extra
}

export interface Product {
  id: string
  name: string
  price: number
  tag: string
}

export interface OrderItem {
  name: string
  price: number
}

export type OrderStatus = 'pending' | 'delivered'

export interface Order {
  id: string
  memberId: string
  memberName: string
  phone: string
  includedDrink: string | null
  extras: OrderItem[]
  status: OrderStatus
  placedAgoMin: number
  eta: string
}

export interface CafeConfig {
  cafeName: string
  clubPrice: number
  retailPrice: number
  cogs: number
  capPerDay: number
  saasPrice: number
  perk: string
}

export interface VerifyResult {
  ok: boolean
  tone: 'ok' | 'deny'
  title: string
  detail: string
  remainingToday: number
}

/* ------------------------------------------------------------------ */
/*  Configuración del café (demo: café de especialidad de Barcelona)   */
/* ------------------------------------------------------------------ */

const CONFIG: CafeConfig = {
  cafeName: 'Cal Cafè',
  clubPrice: 20,
  retailPrice: 2.6,
  cogs: 0.42,
  capPerDay: 1,
  saasPrice: 69,
  perk: 'un dulce de la casa cada semana',
}

const FAVORITES = ['Flat white', 'Cortado', 'Espresso', 'Latte', 'Cappuccino', 'V60', 'Cold brew']

/* Carta de productos extra (no incluidos: se cobran aparte) */
const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Croissant artesano', price: 2.2, tag: 'Bollería' },
  { id: 'p2', name: 'Tostada con tomate', price: 3.6, tag: 'Salado' },
  { id: 'p3', name: 'Muffin de arándanos', price: 2.8, tag: 'Bollería' },
  { id: 'p4', name: 'Cookie de avena', price: 1.8, tag: 'Bollería' },
  { id: 'p5', name: 'Zumo de naranja natural', price: 3.2, tag: 'Bebidas' },
  { id: 'p6', name: 'Bocadillo de jamón', price: 4.8, tag: 'Salado' },
]

/* ------------------------------------------------------------------ */
/*  Socios simulados                                                   */
/* ------------------------------------------------------------------ */

let _seq = 0
function phoneFor(seq: number) {
  const s = String(600000000 + seq * 1010101)
  return `${s.slice(0, 3)} ${s.slice(3, 6)} ${s.slice(6, 9)}`
}
function m(
  name: string,
  status: MemberStatus,
  joinedDaysAgo: number,
  monthRedemptions: number,
  lastVisitDaysAgo: number,
  favorite: string,
  attachVisits: number,
): Member {
  _seq += 1
  return {
    id: `m${_seq}`,
    name,
    email: name.toLowerCase().replace(/[^a-z]+/g, '.') + '@email.com',
    phone: phoneFor(_seq),
    status,
    joinedDaysAgo,
    monthRedemptions,
    lastVisitDaysAgo,
    favorite,
    attachVisits,
  }
}

const SEED_MEMBERS: Member[] = [
  m('Laura Vidal', 'active', 240, 24, 0, 'Flat white', 18),
  m('Marc Soler', 'active', 180, 22, 1, 'Cortado', 6),
  m('Núria Camps', 'active', 95, 19, 0, 'Latte', 14),
  m('Pol Esteve', 'active', 310, 26, 2, 'Espresso', 4),
  m('Aina Ferrer', 'active', 60, 17, 1, 'Cappuccino', 11),
  m('Jordi Roca', 'active', 150, 20, 0, 'V60', 9),
  m('Clara Mas', 'active', 75, 14, 3, 'Cold brew', 7),
  m('Bruno Gil', 'active', 200, 23, 1, 'Flat white', 13),
  m('Sara Pons', 'active', 45, 12, 2, 'Cortado', 5),
  m('David Lluch', 'failed', 130, 9, 4, 'Latte', 3),
  m('Helena Bosch', 'active', 88, 16, 5, 'Cappuccino', 8),
  m('Oriol Vives', 'active', 270, 21, 0, 'Espresso', 10),
  m('Berta Sales', 'active', 33, 7, 14, 'V60', 2), // en riesgo
  m('Guillem Roig', 'active', 165, 18, 12, 'Cortado', 6), // en riesgo
  m('Marta Coll', 'cancelled', 210, 0, 28, 'Latte', 9),
  m('Ferran Pujol', 'active', 52, 11, 1, 'Cold brew', 4),
]

function findSeed(id: string) {
  return SEED_MEMBERS.find((x) => x.id === id)!
}
function seedOrder(id: string, memberId: string, includedDrink: string | null, extras: OrderItem[], placedAgoMin: number, eta: string): Order {
  const mem = findSeed(memberId)
  return { id, memberId, memberName: mem.name, phone: mem.phone, includedDrink, extras, status: 'pending', placedAgoMin, eta }
}

const SEED_ORDERS: Order[] = [
  seedOrder('o1', 'm5', 'Cappuccino', [{ name: 'Croissant artesano', price: 2.2 }], 4, 'En 10 min'),
  seedOrder('o2', 'm7', 'Cold brew', [], 1, 'Ahora'),
  seedOrder('o3', 'm8', 'Flat white', [{ name: 'Muffin de arándanos', price: 2.8 }, { name: 'Zumo de naranja natural', price: 3.2 }], 7, 'En 20 min'),
]

/* Datos históricos para los gráficos del panel */
const REDEMPTIONS_LAST_7 = [42, 51, 39, 58, 61, 47, 0] // el último día (hoy) es en vivo
const MEMBERS_GROWTH = [3, 6, 9, 12, 14, 15] // últimas 6 semanas

/* Algunos socios que ya consumieron hoy (para mostrar el estado "rojo" en caja) */
const SEED_REDEEMED_TODAY: Record<string, number> = { m2: 1, m4: 1 }

const DEFAULT_MEMBER = 'm1' // "sesión" por defecto en la app del socio (Laura)

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */

interface Store {
  config: CafeConfig
  members: Member[]
  orders: Order[]
  products: Product[]
  redeemedToday: Record<string, number>
  favorites: string[]
  currentMemberId: string
  setCurrentMember: (id: string) => void
  addMember: (name: string, phone: string, favorite: string) => Member
  verify: (id: string) => VerifyResult
  redeem: (id: string) => VerifyResult
  placeOrder: (memberId: string, includedDrink: string | null, extras: OrderItem[], eta: string) => void
  deliverOrder: (orderId: string) => void
  reactivate: (id: string) => void
  resetDemo: () => void
}

const StoreContext = createContext<Store | null>(null)

const LS_KEY = 'coffeeprime-demo-v2'

interface Persisted {
  members: Member[]
  redeemedToday: Record<string, number>
  orders: Order[]
  currentMemberId: string
}

function load(): Persisted {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw) as Persisted
  } catch {
    /* ignore */
  }
  return { members: SEED_MEMBERS, redeemedToday: SEED_REDEEMED_TODAY, orders: SEED_ORDERS, currentMemberId: DEFAULT_MEMBER }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const initial = load()
  const [members, setMembers] = useState<Member[]>(initial.members)
  const [redeemedToday, setRedeemedToday] = useState<Record<string, number>>(initial.redeemedToday)
  const [orders, setOrders] = useState<Order[]>(initial.orders ?? SEED_ORDERS)
  const [currentMemberId, setCurrentMemberId] = useState<string>(initial.currentMemberId ?? DEFAULT_MEMBER)

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify({ members, redeemedToday, orders, currentMemberId }))
  }, [members, redeemedToday, orders, currentMemberId])

  const value = useMemo<Store>(() => {
    function verifyInternal(id: string): VerifyResult {
      const member = members.find((x) => x.id === id)
      if (!member) {
        return { ok: false, tone: 'deny', title: 'No es socio', detail: 'Cliente sin membresía activa.', remainingToday: 0 }
      }
      if (member.status === 'cancelled') {
        return { ok: false, tone: 'deny', title: 'No es socio activo', detail: 'La membresía está cancelada.', remainingToday: 0 }
      }
      if (member.status === 'failed') {
        return {
          ok: false,
          tone: 'deny',
          title: 'Pago pendiente',
          detail: 'El último cobro falló. Pídele que actualice el método de pago.',
          remainingToday: 0,
        }
      }
      const used = redeemedToday[id] ?? 0
      const remaining = CONFIG.capPerDay - used
      if (remaining <= 0) {
        return {
          ok: false,
          tone: 'deny',
          title: 'Ya tomó su café de hoy',
          detail: `Tope alcanzado (${used}/${CONFIG.capPerDay}). Su próximo café incluido es mañana.`,
          remainingToday: 0,
        }
      }
      return {
        ok: true,
        tone: 'ok',
        title: 'Socio activo',
        detail: `Café incluido. Le queda ${remaining} hoy.`,
        remainingToday: remaining,
      }
    }

    function doRedeem(id: string, withAttach: boolean) {
      setRedeemedToday((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
      setMembers((prev) =>
        prev.map((x) =>
          x.id === id
            ? { ...x, monthRedemptions: x.monthRedemptions + 1, lastVisitDaysAgo: 0, attachVisits: x.attachVisits + (withAttach ? 1 : 0) }
            : x,
        ),
      )
    }

    return {
      config: CONFIG,
      members,
      orders,
      products: PRODUCTS,
      redeemedToday,
      favorites: FAVORITES,
      currentMemberId,
      setCurrentMember: (id) => setCurrentMemberId(id),
      verify: verifyInternal,
      addMember(name, phone, favorite) {
        _seq += 1
        const newMember: Member = {
          id: `m${_seq}-${Date.now()}`,
          name: name.trim(),
          email: `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@email.com`,
          phone: phone.trim() || phoneFor(_seq),
          status: 'active',
          joinedDaysAgo: 0,
          monthRedemptions: 0,
          lastVisitDaysAgo: 0,
          favorite: favorite || 'Flat white',
          attachVisits: 0,
        }
        setMembers((prev) => [newMember, ...prev])
        setCurrentMemberId(newMember.id)
        return newMember
      },
      redeem(id) {
        const result = verifyInternal(id)
        if (result.ok) doRedeem(id, false)
        return result
      },
      placeOrder(memberId, includedDrink, extras, eta) {
        const mem = members.find((x) => x.id === memberId)
        if (!mem) return
        const order: Order = {
          id: `o${Date.now()}`,
          memberId,
          memberName: mem.name,
          phone: mem.phone,
          includedDrink,
          extras,
          status: 'pending',
          placedAgoMin: 0,
          eta,
        }
        setOrders((prev) => [order, ...prev])
      },
      deliverOrder(orderId) {
        const order = orders.find((o) => o.id === orderId)
        if (!order || order.status === 'delivered') return
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'delivered' } : o)))
        // El café incluido descuenta del tope diario (si le queda); los extras se cobran aparte.
        if (order.includedDrink) {
          const v = verifyInternal(order.memberId)
          if (v.ok) doRedeem(order.memberId, order.extras.length > 0)
        }
      },
      reactivate(id) {
        setMembers((prev) => prev.map((x) => (x.id === id ? { ...x, lastVisitDaysAgo: 0 } : x)))
      },
      resetDemo() {
        localStorage.removeItem(LS_KEY)
        setMembers(SEED_MEMBERS)
        setRedeemedToday(SEED_REDEEMED_TODAY)
        setOrders(SEED_ORDERS)
        setCurrentMemberId(DEFAULT_MEMBER)
      },
    }
  }, [members, redeemedToday, orders, currentMemberId])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): Store {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore debe usarse dentro de StoreProvider')
  return ctx
}

/* ------------------------------------------------------------------ */
/*  Métricas derivadas (para el panel)                                 */
/* ------------------------------------------------------------------ */

export function useMetrics() {
  const { members, redeemedToday, config } = useStore()
  return useMemo(() => {
    const active = members.filter((x) => x.status === 'active')
    const failed = members.filter((x) => x.status === 'failed')
    const mrrClub = active.length * config.clubPrice
    const redemptionsToday = Object.values(redeemedToday).reduce((a, b) => a + b, 0)
    const monthRedemptions = members.reduce((a, b) => a + b.monthRedemptions, 0)
    const attachVisits = members.reduce((a, b) => a + b.attachVisits, 0)
    const attachRate = monthRedemptions ? Math.round((attachVisits / monthRedemptions) * 100) : 0

    // Punto de equilibrio de cafés por socio: clubPrice / cogs
    const breakeven = Math.round(config.clubPrice / config.cogs)
    // Coste máximo por socio/mes con el tope (≈26 días operativos)
    const maxCostCapped = config.capPerDay * 26 * config.cogs
    const contributionPerMember = config.clubPrice - maxCostCapped

    const atRisk = active
      .filter((x) => x.lastVisitDaysAgo >= 10)
      .sort((a, b) => b.lastVisitDaysAgo - a.lastVisitDaysAgo)
    const top = [...active].sort((a, b) => b.monthRedemptions - a.monthRedemptions).slice(0, 5)

    const last7 = [...REDEMPTIONS_LAST_7]
    last7[last7.length - 1] = redemptionsToday

    return {
      activeCount: active.length,
      failedCount: failed.length,
      mrrClub,
      redemptionsToday,
      monthRedemptions,
      attachRate,
      breakeven,
      contributionPerMember,
      maxCostCapped,
      atRisk,
      top,
      last7,
      growth: MEMBERS_GROWTH,
    }
  }, [members, redeemedToday, config])
}
