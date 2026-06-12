# Coffee Me — Puesta en marcha (Supabase + Vercel + Google)

Backend: Supabase (`uvwvwvajnrlnnmuslwck`). Frontend: Vite/React en Vercel.
Esquema multi-tenant ya aplicado (cafes, profiles, members, prospects, orders,
order_items, redemptions) con RLS por `cafe_id` y roles (`superadmin`,
`cafe_admin`, `staff`). El email **christianferbol@gmail.com** se auto-promociona
a `superadmin` al primer login; el resto entra como `cafe_admin` del café demo.

## 1. Variables de entorno

Local: archivo `.env` (no se sube). En **Vercel** → Project → Settings →
Environment Variables, añade:

```
VITE_SUPABASE_URL=https://uvwvwvajnrlnnmuslwck.supabase.co
VITE_SUPABASE_ANON_KEY=<anon o publishable key>
```

(La anon/publishable key es pública; segura en el cliente. La `service_role` NO se usa aquí.)

## 2. Auth → Google (necesario para "Continuar con Google")

1. **Google Cloud Console** → APIs & Services → Credentials → *Create OAuth client ID*
   → tipo **Web application**.
   - Authorized redirect URI: `https://uvwvwvajnrlnnmuslwck.supabase.co/auth/v1/callback`
2. Copia **Client ID** y **Client Secret**.
3. **Supabase** → Authentication → Providers → **Google** → pega Client ID + Secret → Enable.

## 3. Auth → URLs de redirección

**Supabase** → Authentication → URL Configuration:
- **Site URL:** la URL de producción (p. ej. `https://coffee-me.vercel.app`).
- **Redirect URLs (allow list):** añade tu dominio Vercel y, para pruebas,
  `http://localhost:5173` y `http://localhost:4173`.

> El enlace mágico por email funciona con el SMTP por defecto de Supabase
> (bajo volumen). Para producción, configura un SMTP propio.

## 4. Probar

- `npm run dev` → `/login` → "Continuar con Google" o enlace mágico.
- Tras entrar: `superadmin` → consola de cafeterías (`/app/admin`);
  `cafe_admin` → panel de su café (`/app/cafe`).

## Estado del build (fases)

- ✅ Fase 1: backend + auth (Google/email) + multi-rol + consola superadmin
  + panel de café leyendo datos reales + captación (convertir prospecto).
- ⏳ Fase 2: mover caja / app del socio / pedidos a Supabase (hoy son demo en
  `/demo` con datos simulados), realtime, cobro recurrente (Stripe).
