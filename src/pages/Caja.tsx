import { useMemo, useState } from 'react'
import { Search, Check, X, Coffee, MousePointerClick } from 'lucide-react'
import { DemoShell } from '../components/ui'
import { useStore, type Member, type VerifyResult } from '../store'

export default function Caja() {
  const { members, verify, redeem, redeemedToday } = useStore()
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [flash, setFlash] = useState<VerifyResult | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q ? members.filter((m) => m.name.toLowerCase().includes(q)) : members
    return list.slice(0, 40)
  }, [members, query])

  const selected = members.find((m) => m.id === selectedId) ?? null
  const result = selected ? verify(selected.id) : null

  function handleRedeem() {
    if (!selected) return
    const r = redeem(selected.id)
    setFlash(r)
    setTimeout(() => setFlash(null), 2600)
  }

  return (
    <DemoShell title="Caja" subtitle="Verifica al socio y aplica el tope diario en 2 segundos.">
      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        {/* Lista de socios */}
        <div className="rounded-2xl border border-sand/70 bg-paper p-4 shadow-soft">
          <div className="relative">
            <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-clay" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar socio por nombre…"
              className="w-full rounded-xl border border-sand bg-foam py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-caramel focus:ring-2 focus:ring-caramel/20"
            />
          </div>
          <div className="mt-3 max-h-[26rem] space-y-1 overflow-y-auto pr-1">
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
            {filtered.length === 0 && (
              <div className="py-8 text-center text-sm text-mocha">Sin resultados.</div>
            )}
          </div>
        </div>

        {/* Panel de verificación */}
        <div>
          {!selected || !result ? (
            <div className="grid h-full min-h-[20rem] place-items-center rounded-2xl border-2 border-dashed border-sand bg-paper/40 p-8 text-center text-mocha">
              <div>
                <MousePointerClick size={32} className="mx-auto text-clay" />
                <p className="mt-3 max-w-xs text-sm">
                  Selecciona un socio de la lista para ver su estado en caja.
                </p>
              </div>
            </div>
          ) : (
            <VerifyCard member={selected} result={result} flash={flash} onRedeem={handleRedeem} />
          )}
        </div>
      </div>

      <p className="mt-5 text-center text-xs text-mocha">
        Prueba: <strong>Marc Soler</strong> y <strong>Pol Esteve</strong> ya tomaron su café hoy ·{' '}
        <strong>David Lluch</strong> tiene un pago pendiente · <strong>Marta Coll</strong> canceló.
      </p>
    </DemoShell>
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
      ? 'bg-clay'
      : member.status === 'failed'
        ? 'bg-berry'
        : usedToday > 0
          ? 'bg-gold'
          : 'bg-mint'
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
        active ? 'bg-coffee text-cream shadow-soft' : 'hover:bg-cream'
      }`}
    >
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} />
      <span className="flex-1 truncate text-sm font-medium">{member.name}</span>
      <span className={`text-xs ${active ? 'text-cream/70' : 'text-mocha'}`}>{member.favorite}</span>
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
      className={`animate-fade-in overflow-hidden rounded-2xl border shadow-soft ${
        ok ? 'border-mint/30 bg-mint-soft' : 'border-berry/20 bg-berry-soft'
      }`}
    >
      <div className={`px-6 py-7 text-center text-white ${ok ? 'bg-mint' : 'bg-berry'}`}>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/20">
          {ok ? <Check size={30} strokeWidth={3} /> : <X size={30} strokeWidth={3} />}
        </div>
        <div className="mt-3 font-display text-xl font-semibold">{result.title}</div>
        <div className="mx-auto mt-1 max-w-xs text-sm text-white/90">{result.detail}</div>
      </div>

      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-lg font-semibold text-espresso">{member.name}</div>
            <div className="text-sm text-mocha">Habitual: {member.favorite}</div>
          </div>
          <div className="text-right text-sm text-mocha">
            <div>{member.monthRedemptions} cafés este mes</div>
            <div>socio desde hace {Math.max(1, Math.round(member.joinedDaysAgo / 30))} meses</div>
          </div>
        </div>

        {ok ? (
          <button
            onClick={onRedeem}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-coffee py-3.5 font-semibold text-cream transition hover:bg-espresso active:scale-[0.99]"
          >
            <Coffee size={18} strokeWidth={2.2} /> Registrar café incluido
          </button>
        ) : (
          <div className="rounded-xl border border-berry/20 bg-paper px-4 py-3 text-center text-sm font-medium text-berry">
            Cobra este café a precio normal — no descuenta del club.
          </div>
        )}
      </div>

      {flash && (
        <div
          className={`flex items-center justify-center gap-2 px-6 pb-5 text-center text-sm font-semibold ${
            flash.ok ? 'text-mint' : 'text-berry'
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
