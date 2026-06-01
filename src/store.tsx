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
  status: MemberStatus
  joinedDaysAgo: number
  monthRedemptions: number
  lastVisitDaysAgo: number
  favorite: string
  attachVisits: number // visitas en las que añadió bollería/extra
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
  clubPrice: 30,
  retailPrice: 2.6,
  cogs: 0.42,
  capPerDay: 1,
  saasPrice: 69,
  perk: 'un dulce de la casa cada semana',
}

const FAVORITES = ['Flat white', 'Cortado', 'Espresso', 'Latte', 'Cappuccino', 'V60', 'Cold brew']

/* ------------------------------------------------------------------ */
/*  Socios simulados                                                   */
/* ------------------------------------------------------------------ */

let _seq = 0
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

/* Datos históricos para los gráficos del panel */
const REDEMPTIONS_LAST_7 = [42, 51, 39, 58, 61, 47, 0] // el último día (hoy) es en vivo
const MEMBERS_GROWTH = [3, 6, 9, 12, 14, 15] // últimas 6 semanas

/* Algunos socios que ya consumieron hoy (para mostrar el estado "rojo" en caja) */
const SEED_REDEEMED_TODAY: Record<string, number> = { m2: 1, m4: 1 }

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */

interface Store {
  config: CafeConfig
  members: Member[]
  redeemedToday: Record<string, number>
  favorites: string[]
  addMember: (name: string, email: string, favorite: string) => Member
  verify: (id: string) => VerifyResult
  redeem: (id: string) => VerifyResult
  reactivate: (id: string) => void
  resetDemo: () => void
}

const StoreContext = createContext<Store | null>(null)

const LS_KEY = 'cofflix-demo-v1'

interface Persisted {
  members: Member[]
  redeemedToday: Record<string, number>
}

function load(): Persisted {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw) as Persisted
  } catch {
    /* ignore */
  }
  return { members: SEED_MEMBERS, redeemedToday: SEED_REDEEMED_TODAY }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const initial = load()
  const [members, setMembers] = useState<Member[]>(initial.members)
  const [redeemedToday, setRedeemedToday] = useState<Record<string, number>>(initial.redeemedToday)

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify({ members, redeemedToday }))
  }, [members, redeemedToday])

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

    return {
      config: CONFIG,
      members,
      redeemedToday,
      favorites: FAVORITES,
      verify: verifyInternal,
      addMember(name, email, favorite) {
        _seq += 1
        const newMember: Member = {
          id: `m${_seq}-${Date.now()}`,
          name: name.trim(),
          email: email.trim(),
          status: 'active',
          joinedDaysAgo: 0,
          monthRedemptions: 0,
          lastVisitDaysAgo: 0,
          favorite: favorite || 'Flat white',
          attachVisits: 0,
        }
        setMembers((prev) => [newMember, ...prev])
        return newMember
      },
      redeem(id) {
        const result = verifyInternal(id)
        if (result.ok) {
          setRedeemedToday((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
          setMembers((prev) =>
            prev.map((x) =>
              x.id === id ? { ...x, monthRedemptions: x.monthRedemptions + 1, lastVisitDaysAgo: 0 } : x,
            ),
          )
        }
        return result
      },
      reactivate(id) {
        setMembers((prev) => prev.map((x) => (x.id === id ? { ...x, lastVisitDaysAgo: 0 } : x)))
      },
      resetDemo() {
        localStorage.removeItem(LS_KEY)
        setMembers(SEED_MEMBERS)
        setRedeemedToday(SEED_REDEEMED_TODAY)
      },
    }
  }, [members, redeemedToday])

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
