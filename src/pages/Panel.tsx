import { useState, type ComponentType } from 'react'
import {
  BadgeEuro,
  Coffee,
  ShoppingBag,
  UserMinus,
  ShieldCheck,
  Send,
  Check,
  Crown,
  Users,
  Croissant,
  SlidersHorizontal,
  Target,
  UserPlus,
} from 'lucide-react'
import { DemoShell, Stat, eur } from '../components/ui'
import { useStore, useMetrics, CAPTURE_THRESHOLD, type Member } from '../store'

export default function Panel() {
  const { config, updateConfig } = useStore()
  const mx = useMetrics()
  const saasShare = mx.mrrClub ? Math.round((config.saasPrice / mx.mrrClub) * 100) : 0

  return (
    <DemoShell title={`Panel · ${config.cafeName}`} subtitle="Tu club, de un vistazo.">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={BadgeEuro} label="Ingreso recurrente" value={eur(mx.mrrClub)} sub={`${mx.activeCount} socios activos`} accent="mint" />
        <Stat icon={Coffee} label="Cafés hoy" value={mx.redemptionsToday} sub={`${mx.monthRedemptions} este mes`} accent="lime" />
        <Stat icon={ShoppingBag} label="Compran extra" value={`${mx.attachRate}%`} sub="bollería al pedir café" accent="iris" />
        <Stat icon={UserMinus} label="Riesgos de fuga" value={mx.atRisk.length} sub="socios sin pasar +10 días" accent="rose" />
      </div>

      {/* Ajustes del club */}
      <div className="mt-4 rounded-2xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-snow">
            <SlidersHorizontal size={16} className="text-lime" /> Ajustes del club
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <ChipGroup
              label="Cuota del socio"
              options={[15, 20, 25, 30]}
              value={config.clubPrice}
              onSelect={(v) => updateConfig({ clubPrice: v })}
              format={(v) => `${v}€`}
            />
            <ChipGroup
              label="Cafés incluidos / día"
              options={[1, 2]}
              value={config.capPerDay}
              onSelect={(v) => updateConfig({ capPerDay: v })}
              format={(v) => String(v)}
            />
          </div>
        </div>
        <p className="mt-3 text-xs text-mist">
          Cambia los valores y mira cómo se recalculan al instante el ingreso, el margen y la web del
          club.
        </p>
      </div>

      {/* Margen protegido + cuota */}
      <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="relative overflow-hidden rounded-2xl border border-lime/20 bg-surface p-6">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-lime/10 blur-2xl" />
          <div className="relative flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-lime">
            <ShieldCheck size={16} /> Margen protegido
          </div>
          <div className="relative mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="font-display text-2xl font-semibold text-snow">{mx.breakeven}</div>
              <div className="mt-1 text-xs text-fog">cafés = equilibrio por socio</div>
            </div>
            <div>
              <div className="font-display text-2xl font-semibold text-lime">{config.capPerDay}/día</div>
              <div className="mt-1 text-xs text-fog">tope que aplica la caja</div>
            </div>
            <div>
              <div className="font-display text-2xl font-semibold text-mint">{eur(mx.contributionPerMember)}</div>
              <div className="mt-1 text-xs text-fog">margen mínimo socio/mes</div>
            </div>
          </div>
          <p className="relative mt-5 rounded-xl border border-line bg-carbon p-3.5 text-xs leading-relaxed text-fog">
            Con el tope diario, el coste máximo por socio es {eur(mx.maxCostCapped)}/mes. Es{' '}
            <strong className="text-snow">imposible que el club te dé pérdidas</strong>, hagan lo que
            hagan.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6">
          <div className="text-sm font-semibold text-snow">Tu cuota Coffee Me</div>
          <div className="mt-2 flex items-end gap-2">
            <span className="font-display text-3xl font-semibold text-snow">{eur(config.saasPrice)}</span>
            <span className="mb-1 text-sm text-fog">/mes</span>
          </div>
          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-surface2">
            <div className="h-full rounded-full bg-lime transition-all" style={{ width: `${Math.min(100, saasShare)}%` }} />
          </div>
          <p className="mt-2.5 text-sm text-fog">
            Solo el <strong className="text-snow">{saasShare}%</strong> de tu ingreso recurrente del
            club.
          </p>
        </div>
      </div>

      {/* Captación: frecuentes que aún no son socios */}
      <div className="mt-5">
        <CapturePanel />
      </div>

      {/* Gráficos */}
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <LineChart title="Cafés servidos · últimos 7 días" data={mx.last7} labels={['L', 'M', 'X', 'J', 'V', 'S', 'Hoy']} accent="var(--color-lime)" />
        <LineChart title="Socios del club · últimas 6 semanas" data={mx.growth} labels={['s1', 's2', 's3', 's4', 's5', 's6']} accent="var(--color-iris)" />
      </div>

      {/* Lo más popular */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <PopularCard icon={Coffee} tint="lime" label="Café más consumido" name={mx.topCoffee.name} count={mx.topCoffee.count} />
        <PopularCard icon={Croissant} tint="iris" label="Extra más pedido" name={mx.topExtra.name} count={mx.topExtra.count} />
      </div>

      {/* Fidelización / CRM */}
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <AtRiskPanel members={mx.atRisk} />
        <TopPanel members={mx.top} />
      </div>
    </DemoShell>
  )
}

function LineChart({ title, data, labels, accent }: { title: string; data: number[]; labels: string[]; accent: string }) {
  const max = Math.max(1, ...data)
  const n = data.length
  const pts = data.map((v, i) => ({
    x: n > 1 ? (i / (n - 1)) * 100 : 50,
    y: 100 - 8 - (v / max) * 84,
    v,
  }))
  const line = pts.map((p) => `${p.x},${p.y}`).join(' ')
  const area = `0,100 ${line} 100,100`
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="text-sm font-semibold text-snow">{title}</div>
      <div className="relative mt-5 h-28">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
          <polygon points={area} fill={accent} fillOpacity={0.1} />
          <polyline
            points={line}
            fill="none"
            stroke={accent}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {/* Puntos y valores (overlay HTML para no deformarse) */}
        {pts.map((p, i) => (
          <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
            <div
              className={`h-2 w-2 rounded-full ring-2 ring-surface ${i === n - 1 ? 'ring-2' : ''}`}
              style={{ backgroundColor: accent }}
            />
            <div className="absolute left-1/2 -top-4 -translate-x-1/2 text-[10px] font-medium text-fog">{p.v}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between">
        {labels.map((l, i) => (
          <span key={i} className="text-xs text-mist">{l}</span>
        ))}
      </div>
    </div>
  )
}

function CapturePanel() {
  const { prospects, config, convertProspect, markProspectOffered } = useStore()
  const sorted = prospects
    .filter((p) => p.visitsThisMonth >= CAPTURE_THRESHOLD)
    .sort((a, b) => b.visitsThisMonth - a.visitsThisMonth)

  return (
    <div className="rounded-2xl border border-lime/20 bg-surface p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-snow">
          <Target size={16} className="text-lime" /> Capta: frecuentes que aún no son socios
        </div>
        <span className="rounded-full bg-lime/10 px-2 py-0.5 text-xs font-semibold text-lime ring-1 ring-lime/20">
          {sorted.length}
        </span>
      </div>
      <p className="mt-1 text-xs text-fog">
        Apuntados (nivel gratis) que ya vienen +{CAPTURE_THRESHOLD} veces/mes. Tu mejor lista para captar — con la frase de venta hecha.
      </p>

      <div className="mt-4 space-y-2">
        {sorted.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-6 text-center text-sm text-fog">
            <Check size={22} className="text-mint" /> Ningún frecuente pendiente de captar por ahora.
          </div>
        )}
        {sorted.map((p) => {
          const spend = p.visitsThisMonth * config.retailPrice
          const savings = Math.max(0, spend - config.clubPrice)
          return (
            <div
              key={p.id}
              className={`flex flex-col gap-3 rounded-xl border bg-surface2 p-3.5 sm:flex-row sm:items-center sm:justify-between ${
                p.offered ? 'border-line opacity-60' : 'border-line'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-snow">{p.name}</span>
                  <span className="rounded-full bg-carbon px-2 py-0.5 text-[11px] font-semibold text-lime">
                    {p.visitsThisMonth} visitas/mes
                  </span>
                  {p.offered && <span className="text-[11px] font-semibold text-mint">· Ofrecido</span>}
                </div>
                <div className="mt-1 text-xs text-fog">
                  Toma <span className="text-snow">{p.favorite}</span> · gasta ~{eur(spend)}/mes ·{' '}
                  {savings > 0 ? (
                    <>ahorraría <span className="font-semibold text-amber">{eur(savings)}</span> con el club</>
                  ) : (
                    <>aún no le sale a cuenta</>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => markProspectOffered(p.id)}
                  className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-fog transition hover:text-snow"
                >
                  {p.offered ? 'Quitar' : 'Ofrecido'}
                </button>
                <button
                  onClick={() => convertProspect(p.id)}
                  className="flex items-center gap-1.5 rounded-full bg-lime px-3.5 py-1.5 text-xs font-semibold text-ink transition hover:bg-lime-deep active:scale-95"
                >
                  <UserPlus size={13} strokeWidth={2.5} /> Convertir a socio
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ChipGroup({
  label,
  options,
  value,
  onSelect,
  format,
}: {
  label: string
  options: number[]
  value: number
  onSelect: (v: number) => void
  format: (v: number) => string
}) {
  return (
    <div>
      <div className="text-xs text-fog">{label}</div>
      <div className="mt-1.5 flex gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onSelect(o)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
              value === o ? 'bg-lime text-ink' : 'border border-line text-fog hover:text-snow'
            }`}
          >
            {format(o)}
          </button>
        ))}
      </div>
    </div>
  )
}

function PopularCard({
  icon: Icon,
  tint,
  label,
  name,
  count,
}: {
  icon: ComponentType<{ size?: number; strokeWidth?: number }>
  tint: 'lime' | 'iris'
  label: string
  name: string
  count: number
}) {
  const c = tint === 'iris' ? 'text-iris' : 'text-lime'
  const bg = tint === 'iris' ? 'bg-iris/10' : 'bg-lime/10'
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${bg} ${c}`}>
        <Icon size={22} strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <div className="text-xs font-medium uppercase tracking-wide text-fog">{label}</div>
        <div className="truncate font-display text-lg font-semibold text-snow">{name}</div>
        <div className="text-xs text-mist">{count} este mes</div>
      </div>
    </div>
  )
}

function AtRiskPanel({ members }: { members: Member[] }) {
  const { reactivate } = useStore()
  const [nudged, setNudged] = useState<Record<string, boolean>>({})
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-snow">
          <Users size={16} className="text-rose" /> Clientes en riesgo de fuga
        </div>
        <span className="rounded-full bg-rose-soft px-2 py-0.5 text-xs font-semibold text-rose">
          {members.length}
        </span>
      </div>
      <p className="mt-1 text-xs text-fog">Socios activos que llevan +10 días sin pasar.</p>
      <div className="mt-4 space-y-2">
        {members.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-6 text-center text-sm text-fog">
            <Check size={22} className="text-mint" /> Nadie en riesgo.
          </div>
        )}
        {members.map((m) => (
          <div key={m.id} className="flex items-center justify-between rounded-xl bg-surface2 px-3 py-2.5">
            <div>
              <div className="text-sm font-medium text-snow">{m.name}</div>
              <div className="text-xs text-fog">hace {m.lastVisitDaysAgo} días · {m.favorite}</div>
            </div>
            {nudged[m.id] ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-mint">
                <Check size={14} strokeWidth={2.5} /> Enviado
              </span>
            ) : (
              <button
                onClick={() => {
                  setNudged((p) => ({ ...p, [m.id]: true }))
                  reactivate(m.id)
                }}
                className="flex items-center gap-1.5 rounded-full bg-lime px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-lime-deep active:scale-95"
              >
                <Send size={13} strokeWidth={2.2} /> Recordatorio
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function TopPanel({ members }: { members: Member[] }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-snow">
        <Crown size={16} className="text-lime" /> Tus mejores socios
      </div>
      <p className="mt-1 text-xs text-fog">Quién sostiene tu club este mes.</p>
      <div className="mt-4 space-y-2">
        {members.map((m, i) => (
          <div key={m.id} className="flex items-center gap-3 rounded-xl bg-surface2 px-3 py-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-line bg-carbon text-xs font-bold text-lime">
              {i + 1}
            </span>
            <div className="flex-1">
              <div className="text-sm font-medium text-snow">{m.name}</div>
              <div className="text-xs text-fog">{m.favorite}</div>
            </div>
            <div className="text-sm font-semibold text-snow">{m.monthRedemptions} cafés</div>
          </div>
        ))}
      </div>
    </div>
  )
}
