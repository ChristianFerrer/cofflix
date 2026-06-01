# Cofflix

Infraestructura de **clubs de café por membresía** para cafés de especialidad.

El café paga una cuota fija (~69 €/mes) por un SaaS que le permite ofrecer a sus
clientes habituales una membresía (~30 €/mes): café diario incluido, cobro
recurrente automático y control del margen en la barra mediante un tope diario.

Este repo contiene la **landing web + un MVP de demostración** (datos simulados,
sin backend) pensado para presentar la idea a cafés e inversores.

## Qué incluye

| Ruta | Qué es |
|------|--------|
| `/` | Landing **B2B** — vende el SaaS al café (margen garantizado, sin admin, precio por día). |
| `/#/club` | Landing **B2C** — plantilla del club que el café muestra a sus clientes. |
| `/#/demo` | Hub de la demo interactiva. |
| `/#/demo/caja` | **Pantalla de caja**: verifica al socio (verde/rojo) y aplica el tope diario. |
| `/#/demo/alta` | **Alta de socio** por QR en menos de un minuto. |
| `/#/demo/panel` | **Panel del dueño**: ingresos, margen protegido, fidelización y clientes en riesgo. |

Toda la lógica usa datos simulados en memoria (persistidos en `localStorage`).
Un alta hecha en `/demo/alta` aparece al instante en caja y en el panel. El botón
**«Reiniciar demo»** restablece los datos de ejemplo.

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción (type-check + vite)
npm run preview  # sirve el build
```

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- React Router (HashRouter, para despliegue estático sin reescrituras)
- `qrcode.react` para el QR de alta

> **Nota:** datos 100 % simulados. No hay cobros ni backend reales; es una
> herramienta de presentación y validación, no el producto en producción.
