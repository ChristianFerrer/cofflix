import { Link } from 'react-router-dom'
import { Store, Building2, Users, ArrowLeft, ArrowDown, ArrowUp, Check, X } from 'lucide-react'
import { Logo, Badge, btn, eur } from '../components/ui'
import { useStore } from '../store'

export default function Modelo() {
  const { config } = useStore()
  const club = config.clubPrice
  const saas = config.saasPrice

  return (
    <div className="min-h-screen bg-carbon">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Logo />
        <Link to="/" className="flex items-center gap-1.5 text-sm font-medium text-fog transition hover:text-snow">
          <ArrowLeft size={16} /> Volver
        </Link>
      </header>

      <section className="relative overflow-hidden bg-glow">
        <div className="mx-auto max-w-3xl px-6 pb-10 pt-8 text-center">
          <Badge>El modelo en 30 segundos</Badge>
          <h1 className="mt-5 font-display text-3xl font-semibold leading-tight text-snow sm:text-5xl">
            Vendemos software, <span className="text-gradient">no café.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-fog">
            Le damos a cada cafetería la herramienta para tener su propio club de suscripción. Ella
            se lo cobra a sus clientes; nosotros le cobramos a ella una cuota fija.
          </p>
        </div>
      </section>

      {/* Diagrama de las dos capas */}
      <section className="mx-auto max-w-2xl px-6 py-10">
        <Actor
          icon={Store}
          name="Coffee Me"
          role="Tú · el SaaS"
          desc="Das a cada café la herramienta para crear y gestionar su club."
          highlight
        />
        <Connector deliver="Software del club" money={`${eur(saas)}/mes`} note="← tu ingreso (cuota fija)" moneyHighlight />
        <Actor
          icon={Building2}
          name="La cafetería"
          role="Tu cliente que paga"
          desc="Ofrece el club a sus clientes y te paga una cuota fija por el software."
        />
        <Connector deliver="Su club de socio" money={`~${eur(club)}/mes`} note="(de la cafetería, NO tuyo)" />
        <Actor
          icon={Users}
          name="El cliente del café"
          role="El socio"
          desc="Paga su membresía a la cafetería: su café diario + pedidos y extras."
        />
      </section>

      {/* Cómo ganas tú */}
      <section className="mx-auto max-w-4xl px-6 py-6">
        <div className="rounded-3xl border border-lime/20 bg-surface p-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-snow">Cómo ganas tú</h2>
          <p className="mt-2 text-sm text-fog">Solo cobras la cuota de la cafetería. Sin comisión por venta.</p>
          <div className="mt-7 grid grid-cols-3 gap-4">
            {[
              ['1 café', eur(saas)],
              ['100 cafés', eur(saas * 100)],
              ['500 cafés', eur(saas * 500)],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-line bg-carbon p-4">
                <div className="text-xs text-fog">{k}</div>
                <div className="mt-1 font-display text-xl font-semibold text-lime sm:text-2xl">{v}<span className="text-sm text-fog">/mes</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analogía + qué no eres */}
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-4">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <h3 className="font-display text-lg font-semibold text-snow">La analogía</h3>
            <p className="mt-2 text-sm text-fog">
              Eres el <strong className="text-snow">Shopify del café por suscripción</strong>. Shopify
              no vende camisetas: da a las tiendas la herramienta para vender y les cobra una cuota.
              Tú haces lo mismo con el club de café.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6">
            <h3 className="font-display text-lg font-semibold text-snow">Lo que NO eres</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-fog">
              <li className="flex items-start gap-2"><X size={15} className="mt-0.5 shrink-0 text-rose" /> Un marketplace que junta cafés y clientes</li>
              <li className="flex items-start gap-2"><X size={15} className="mt-0.5 shrink-0 text-rose" /> Una app de cashback para el consumidor</li>
              <li className="flex items-start gap-2"><Check size={15} className="mt-0.5 shrink-0 text-lime" /> Un SaaS: cuota fija por café, ingreso recurrente</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/demo" className={btn('primary', 'lg')}>Ver la demo</Link>
          <Link to="/" className={btn('outline', 'lg')}>Volver a la web</Link>
        </div>
      </section>

      <footer className="border-t border-line bg-ink py-8 text-center text-sm text-mist">
        Coffee Me · El modelo de negocio
      </footer>
    </div>
  )
}

function Actor({
  icon: Icon,
  name,
  role,
  desc,
  highlight = false,
}: {
  icon: typeof Store
  name: string
  role: string
  desc: string
  highlight?: boolean
}) {
  return (
    <div className={`flex items-center gap-4 rounded-2xl border bg-surface p-5 ${highlight ? 'border-lime/40' : 'border-line'}`}>
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${highlight ? 'bg-lime text-ink' : 'bg-surface2 text-fog'}`}>
        <Icon size={24} strokeWidth={2} />
      </span>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-semibold text-snow">{name}</span>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${highlight ? 'bg-lime/10 text-lime' : 'bg-surface2 text-fog'}`}>{role}</span>
        </div>
        <p className="mt-0.5 text-sm text-fog">{desc}</p>
      </div>
    </div>
  )
}

function Connector({
  deliver,
  money,
  note,
  moneyHighlight = false,
}: {
  deliver: string
  money: string
  note: string
  moneyHighlight?: boolean
}) {
  return (
    <div className="flex items-stretch justify-center gap-3 py-2 pl-6">
      <div className="flex flex-col items-center">
        <div className="h-full w-px bg-line2" />
      </div>
      <div className="flex flex-1 items-center justify-between gap-3 py-1">
        <span className="flex items-center gap-1.5 text-xs text-mist">
          <ArrowDown size={13} /> {deliver}
        </span>
        <span
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
            moneyHighlight ? 'bg-lime/10 text-lime ring-1 ring-lime/20' : 'bg-surface2 text-fog'
          }`}
        >
          <ArrowUp size={13} /> {money} <span className="font-normal opacity-80">{note}</span>
        </span>
      </div>
    </div>
  )
}
