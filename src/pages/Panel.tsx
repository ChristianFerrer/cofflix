import { useState } from 'react'
import {
  BadgeEuro,
  Coffee,
  ShoppingBag,
  TriangleAlert,
  ShieldCheck,
  Send,
  Check,
  Crown,
  Users,
} from 'lucide-react'
import { DemoShell, Stat, eur } from '../components/ui'
import { useStore, useMetrics, type Member } from '../store'

export default function Panel() {
  const { config } = useStore()
  const mx = useMetrics()
  const saasShare = mx.mrrClub ? Math.round((config.saasPrice / mx.mrrClub) * 100) : 0

  return (
    <DemoShell title={`Panel · ${config.cafeName}`} subtitle="Tu club, de un vistazo.">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={BadgeEuro} label="Ingreso recurrente" value={eur(mx.mrrClub)} sub={`${mx.activeCount} socios activos`} accent="mint" />
        <Stat icon={Coffee} label="Cafés hoy" value={mx.redemptionsToday} sub={`${mx.monthRedemptions} este mes`} />
        <Stat icon={ShoppingBag} label="Compran extra" value={`${mx.attachRate}%`} sub="bollería al pedir café" accent="caramel" />
        <Stat icon={TriangleAlert} label="Pagos pendientes" value={mx.failedCount} sub="socios a recuperar" />
      </div>

      {/* Margen protegido + cuota */}
      <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl bg-warm bg-grain p-6 text-cream shadow-soft">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-latte">
            <ShieldCheck size={16} /> Margen protegido
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="font-display text-2xl font-semibold">{mx.breakeven}</div>
              <div className="mt-1 text-xs text-cream/60">cafés = equilibrio por socio</div>
            </div>
            <div>
              <div className="font-display text-2xl font-semibold text-latte">{config.capPerDay}/día</div>
              <div className="mt-1 text-xs text-cream/60">tope que aplica la caja</div>
            </div>
            <div>
              <div className="font-display text-2xl font-semibold text-[#7fd9bd]">{eur(mx.contributionPerMember)}</div>
              <div className="mt-1 text-xs text-cream/60">margen mínimo socio/mes</div>
            </div>
          </div>
          <p className="mt-5 rounded-xl bg-black/20 p-3.5 text-xs leading-relaxed text-cream/80">
            Con el tope diario, el coste máximo por socio es {eur(mx.maxCostCapped)}/mes. Es{' '}
            <strong className="text-cream">imposible que el club te dé pérdidas</strong>, hagan lo
            que hagan.
          </p>
        </div>

        <div className="rounded-2xl border border-sand/70 bg-paper p-6 shadow-soft">
          <div className="text-sm font-semibold text-espresso">Tu cuota Cofflix</div>
          <div className="mt-2 flex items-end gap-2">
            <span className="font-display text-3xl font-semibold text-espresso">{eur(config.saasPrice)}</span>
            <span className="mb-1 text-sm text-mocha">/mes</span>
          </div>
          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-cream">
            <div className="h-full rounded-full bg-caramel transition-all" style={{ width: `${Math.min(100, saasShare)}%` }} />
          </div>
          <p className="mt-2.5 text-sm text-mocha">
            Solo el <strong className="text-espresso">{saasShare}%</strong> de tu ingreso recurrente
            del club.
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <BarChart title="Cafés servidos · últimos 7 días" data={mx.last7} labels={['L', 'M', 'X', 'J', 'V', 'S', 'Hoy']} accent="var(--color-caramel)" />
        <BarChart title="Socios del club · últimas 6 semanas" data={mx.growth} labels={['s1', 's2', 's3', 's4', 's5', 's6']} accent="var(--color-mint)" />
      </div>

      {/* Fidelización / CRM */}
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <AtRiskPanel members={mx.atRisk} />
        <TopPanel members={mx.top} />
      </div>
    </DemoShell>
  )
}

function BarChart({ title, data, labels, accent }: { title: string; data: number[]; labels: string[]; accent: string }) {
  const max = Math.max(1, ...data)
  return (
    <div className="rounded-2xl border border-sand/70 bg-paper p-5 shadow-soft">
      <div className="text-sm font-semibold text-espresso">{title}</div>
      <div className="mt-5 flex items-end justify-between gap-2.5">
        {data.map((v, i) => (
          <div key={i} className="flex flex-1 flex-col items-center">
            <div className="text-xs font-medium text-mocha">{v}</div>
            <div className="mt-1.5 flex h-28 w-full items-end">
              <div
                className="w-full rounded-t-lg transition-all duration-700"
                style={{ height: `${(v / max) * 100}%`, backgroundColor: accent, minHeight: 4 }}
              />
            </div>
            <div className="mt-2 text-xs text-clay">{labels[i]}</div>
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
    <div className="rounded-2xl border border-sand/70 bg-paper p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-espresso">
          <Users size={16} className="text-berry" /> Clientes en riesgo de fuga
        </div>
        <span className="rounded-full bg-berry-soft px-2 py-0.5 text-xs font-semibold text-berry">
          {members.length}
        </span>
      </div>
      <p className="mt-1 text-xs text-mocha">Socios activos que llevan +10 días sin pasar.</p>
      <div className="mt-4 space-y-2">
        {members.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-6 text-center text-sm text-mocha">
            <Check size={22} className="text-mint" /> Nadie en riesgo.
          </div>
        )}
        {members.map((m) => (
          <div key={m.id} className="flex items-center justify-between rounded-xl bg-foam px-3 py-2.5">
            <div>
              <div className="text-sm font-medium text-espresso">{m.name}</div>
              <div className="text-xs text-mocha">hace {m.lastVisitDaysAgo} días · {m.favorite}</div>
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
                className="flex items-center gap-1.5 rounded-full bg-coffee px-3 py-1.5 text-xs font-semibold text-cream transition hover:bg-espresso active:scale-95"
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
    <div className="rounded-2xl border border-sand/70 bg-paper p-5 shadow-soft">
      <div className="flex items-center gap-2 text-sm font-semibold text-espresso">
        <Crown size={16} className="text-gold" /> Tus mejores socios
      </div>
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
