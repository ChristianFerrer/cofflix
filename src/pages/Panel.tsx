import { useState } from 'react'
import { DemoShell, Stat, eur } from '../components/ui'
import { useStore, useMetrics, type Member } from '../store'

export default function Panel() {
  const { config } = useStore()
  const mx = useMetrics()
  const saasShare = mx.mrrClub ? Math.round((config.saasPrice / mx.mrrClub) * 100) : 0

  return (
    <DemoShell title={`Panel · ${config.cafeName}`}>
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Ingreso recurrente" value={eur(mx.mrrClub)} sub={`${mx.activeCount} socios activos`} accent="mint" />
        <Stat label="Cafés hoy" value={mx.redemptionsToday} sub={`${mx.monthRedemptions} este mes`} />
        <Stat label="Compran extra" value={`${mx.attachRate}%`} sub="bollería al pedir café" accent="caramel" />
        <Stat label="Pagos pendientes" value={mx.failedCount} sub="socios a recuperar" />
      </div>

      {/* Margen protegido */}
      <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl bg-espresso p-6 text-cream">
          <div className="text-sm font-semibold uppercase tracking-wide text-latte">Margen protegido</div>
          <div className="mt-3 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{mx.breakeven}</div>
              <div className="mt-1 text-xs text-cream/60">cafés = punto de equilibrio por socio</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-latte">{config.capPerDay}/día</div>
              <div className="mt-1 text-xs text-cream/60">tope que aplica la caja</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-mint">{eur(mx.contributionPerMember)}</div>
              <div className="mt-1 text-xs text-cream/60">margen mínimo por socio/mes</div>
            </div>
          </div>
          <p className="mt-4 rounded-xl bg-coffee/50 p-3 text-xs text-cream/80">
            Con el tope diario, el coste máximo por socio es {eur(mx.maxCostCapped)}/mes. Es
            <strong className="text-cream"> imposible que el club te dé pérdidas</strong>, hagan lo que hagan.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-cream">
          <div className="text-sm font-semibold text-espresso">Tu cuota Cofflix</div>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-bold text-espresso">{eur(config.saasPrice)}</span>
            <span className="mb-1 text-sm text-mocha">/mes</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-cream">
            <div className="h-full rounded-full bg-caramel" style={{ width: `${Math.min(100, saasShare)}%` }} />
          </div>
          <p className="mt-2 text-sm text-mocha">
            Solo el <strong className="text-espresso">{saasShare}%</strong> de tu ingreso recurrente del club.
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <BarChart title="Cafés servidos · últimos 7 días" data={mx.last7} labels={['L', 'M', 'X', 'J', 'V', 'S', 'Hoy']} accent="#c08552" />
        <BarChart title="Socios del club · últimas 6 semanas" data={mx.growth} labels={['s1', 's2', 's3', 's4', 's5', 's6']} accent="#2f9e7f" />
      </div>

      {/* Fidelización / CRM */}
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <AtRiskPanel members={mx.atRisk} />
        <TopPanel members={mx.top} />
      </div>
    </DemoShell>
  )
}

function BarChart({
  title,
  data,
  labels,
  accent,
}: {
  title: string
  data: number[]
  labels: string[]
  accent: string
}) {
  const max = Math.max(1, ...data)
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-cream">
      <div className="text-sm font-semibold text-espresso">{title}</div>
      <div className="mt-5 flex h-36 items-end justify-between gap-2">
        {data.map((v, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <div className="text-xs font-medium text-mocha">{v}</div>
            <div
              className="w-full rounded-t-lg transition-all"
              style={{ height: `${(v / max) * 100}%`, backgroundColor: accent, minHeight: 4 }}
            />
            <div className="text-xs text-mocha">{labels[i]}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AtRiskPanel({ members }: { members: Member[] }) {
  const { reactivate } = useStore()
  const [nudged, setNudged] = useState<Record<string, boolean>>({})
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-cream">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-espresso">Clientes en riesgo de fuga</div>
        <span className="rounded-full bg-berry/10 px-2 py-0.5 text-xs font-semibold text-berry">
          {members.length}
        </span>
      </div>
      <p className="mt-1 text-xs text-mocha">Socios activos que llevan +10 días sin pasar.</p>
      <div className="mt-4 space-y-2">
        {members.length === 0 && <div className="py-6 text-center text-sm text-mocha">Nadie en riesgo. 🎉</div>}
        {members.map((m) => (
          <div key={m.id} className="flex items-center justify-between rounded-xl bg-foam px-3 py-2.5">
            <div>
              <div className="text-sm font-medium text-espresso">{m.name}</div>
              <div className="text-xs text-mocha">hace {m.lastVisitDaysAgo} días · {m.favorite}</div>
            </div>
            {nudged[m.id] ? (
              <span className="text-xs font-semibold text-mint">✓ Enviado</span>
            ) : (
              <button
                onClick={() => {
                  setNudged((p) => ({ ...p, [m.id]: true }))
                  reactivate(m.id)
                }}
                className="rounded-full bg-coffee px-3 py-1.5 text-xs font-semibold text-cream transition hover:bg-espresso"
              >
                Enviar recordatorio
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
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-cream">
      <div className="text-sm font-semibold text-espresso">Tus mejores socios</div>
      <p className="mt-1 text-xs text-mocha">Quién sostiene tu club este mes.</p>
      <div className="mt-4 space-y-2">
        {members.map((m, i) => (
          <div key={m.id} className="flex items-center gap-3 rounded-xl bg-foam px-3 py-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-cream text-xs font-bold text-coffee">
              {i + 1}
            </span>
            <div className="flex-1">
              <div className="text-sm font-medium text-espresso">{m.name}</div>
              <div className="text-xs text-mocha">{m.favorite}</div>
            </div>
            <div className="text-sm font-semibold text-espresso">{m.monthRedemptions} cafés</div>
          </div>
        ))}
      </div>
    </div>
  )
}
