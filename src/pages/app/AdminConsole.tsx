import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, BadgeEuro, Users, Plus, ArrowRight } from 'lucide-react'
import { AppLayout, Loader } from '../../app/AppLayout'
import { Stat, btn, eur } from '../../components/ui'
import { supabase, type Cafe } from '../../lib/supabase'

const TIER_PRICE: Record<string, number> = { lite: 39, pro: 69, plus: 129 }

export default function AdminConsole() {
  const [cafes, setCafes] = useState<Cafe[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [tier, setTier] = useState<'lite' | 'pro' | 'plus'>('pro')
  const [price, setPrice] = useState(20)
  const [busy, setBusy] = useState(false)

  const fetchAll = useCallback(async () => {
    const [c, m] = await Promise.all([
      supabase.from('cafes').select('*').order('created_at', { ascending: false }),
      supabase.from('members').select('cafe_id,status'),
    ])
    setCafes((c.data as Cafe[]) ?? [])
    const map: Record<string, number> = {}
    ;((m.data as { cafe_id: string; status: string }[]) ?? []).forEach((row) => {
      if (row.status === 'active') map[row.cafe_id] = (map[row.cafe_id] ?? 0) + 1
    })
    setCounts(map)
    setLoading(false)
  }, [])

  useEffect(() => {
    void fetchAll()
  }, [fetchAll])

  async function createCafe(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setBusy(true)
    await supabase.from('cafes').insert({
      name: name.trim(),
      slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      club_price: price,
      saas_tier: tier,
      saas_price: TIER_PRICE[tier],
    })
    setName('')
    setBusy(false)
    setOpen(false)
    void fetchAll()
  }

  if (loading) return <Loader />

  const activeCafes = cafes.filter((c) => c.active)
  const mrrSaas = activeCafes.reduce((a, c) => a + Number(c.saas_price), 0)
  const totalMembers = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <AppLayout>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-snow">Cafeterías</h1>
          <p className="mt-1 text-sm text-fog">Administración general de Coffee Me.</p>
        </div>
        <button onClick={() => setOpen((v) => !v)} className={btn(open ? 'outline' : 'primary')}>
          <Plus size={16} strokeWidth={2.2} /> {open ? 'Cerrar' : 'Nueva cafetería'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Stat icon={Building2} label="Cafeterías activas" value={activeCafes.length} sub={`${cafes.length} en total`} accent="lime" />
        <Stat icon={BadgeEuro} label="MRR SaaS" value={eur(mrrSaas)} sub="lo que pagan los cafés" accent="mint" />
        <Stat icon={Users} label="Socios totales" value={totalMembers} sub="en todos los clubs" accent="iris" />
      </div>

      {open && (
        <form onSubmit={createCafe} className="mt-5 rounded-2xl border border-line bg-surface p-5">
          <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end">
            <label className="block text-sm font-medium text-snow">
              Nombre del café
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Cafetería…" className="mt-1.5 w-full rounded-xl border border-line bg-surface2 px-3 py-2 text-sm text-snow outline-none focus:border-lime/50" />
            </label>
            <label className="block text-sm font-medium text-snow">
              Plan
              <select value={tier} onChange={(e) => setTier(e.target.value as 'lite' | 'pro' | 'plus')} className="mt-1.5 w-full rounded-xl border border-line bg-surface2 px-3 py-2 text-sm text-snow outline-none focus:border-lime/50">
                <option value="lite">Lite · 39€</option>
                <option value="pro">Pro · 69€</option>
                <option value="plus">Plus · 129€</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-snow">
              Cuota socio (€)
              <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-1.5 w-full rounded-xl border border-line bg-surface2 px-3 py-2 text-sm text-snow outline-none focus:border-lime/50" />
            </label>
            <button type="submit" disabled={busy} className={`${btn('primary')} disabled:opacity-50`}>Crear</button>
          </div>
        </form>
      )}

      <div className="mt-6 space-y-2">
        {cafes.length === 0 && <p className="py-8 text-center text-sm text-fog">Aún no hay cafeterías. Crea la primera.</p>}
        {cafes.map((c) => (
          <Link
            key={c.id}
            to={`/app/cafe?id=${c.id}`}
            className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 transition hover:border-lime/40"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface2 text-lime">
                <Building2 size={18} />
              </span>
              <div>
                <div className="font-semibold text-snow">{c.name}</div>
                <div className="text-xs text-mist">
                  Plan {c.saas_tier} · {eur(c.saas_price)}/mes · club {eur(c.club_price)} · {counts[c.id] ?? 0} socios
                </div>
              </div>
            </div>
            <span className="flex items-center gap-1 text-sm font-semibold text-lime">
              Abrir <ArrowRight size={15} strokeWidth={2.2} />
            </span>
          </Link>
        ))}
      </div>
    </AppLayout>
  )
}
