# Coffee Me — Modelo de negocio y números

> Documento para conversación con inversores. Cifras **ilustrativas y a validar**
> en el piloto. Mercado España/UE. Moneda: €.

---

## 1. El negocio en una frase

Coffee Me es la **infraestructura de suscripciones para cafés de especialidad**:
le damos a cada cafetería el software para convertir a sus clientes habituales en
**socios que pagan por adelantado**, y se lo cobramos como **SaaS de cuota fija**.

---

## 2. El modelo de dos capas

| | Quién paga | A quién | Cuánto | Tipo |
|---|---|---|---|---|
| **Capa 1 — nuestro ingreso** | La cafetería | A Coffee Me | **69 €/mes** | SaaS, cuota fija |
| **Capa 2 — lo que vende el café** | El cliente final | A la cafetería | **~20 €/mes** | Membresía / suscripción |

- **No cobramos comisión por venta.** Ingreso recurrente y predecible (SaaS puro).
- La Capa 1 solo retiene si la Capa 2 funciona → **todo nuestro producto está
  diseñado para que el club del café convierta y retenga.**
- Esto **elimina el cold-start** de un marketplace: una sola cafetería ya genera
  valor e ingreso el día uno. No hay efecto red que resolver.

---

## 3. ¿Por qué la cafetería paga 69 €/mes? (Unit economics Capa 2)

Lo que gana el café con un socio a **20 €/mes** (tope de 1 café/día):

| Concepto | Importe/socio/mes |
|---|---|
| Ingreso de la cuota | +20,0 € |
| − Coste del café servido (≈16 cafés × 0,42 €) | −6,7 € |
| **Margen del café incluido** | **+13,3 €** |
| + Margen por *attach* (bollería: 16 visitas × 45% × 1,6 €) | +11,5 € |
| **Contribución total por socio/mes** | **≈ 24,8 €** |

**Lectura para el café:** con solo **40 socios** ingresa **800 €/mes recurrentes** y
**~990 €/mes de margen**. Nuestra cuota (69 €) es el **~7%** de ese ingreso y se
paga sola **>10 veces**. Y lo más importante: el margen está **blindado** (el tope
diario hace imposible perder dinero) y **sin trabajo de admin** para el dueño.

> El verdadero motor de margen del café es el **attach** y el **breakage** (socios
> que pagan y no consumen todos los días). La suscripción es el imán de tráfico.

---

## 4. Unit economics Capa 1 (NUESTRO negocio — lo que mira el inversor)

| Métrica | Valor | Nota |
|---|---|---|
| ARPU | **69 €/mes** · 828 €/año | cuota fija |
| Margen bruto | **~87%** (~60 €/mes) | infra + pasarela + soporte ≈ 9 €/mes |
| CAC | **100–300 €** | venta directa del fundador (blended ~200 €) |
| **Payback de CAC** | **~3,3 meses** | 200 € / 60 € |
| Churn mensual (supuesto) | 4% | riesgo nº1 (SMB hostelería) |
| Vida media del cliente | ~25 meses | 1 / churn |
| **LTV** | **~1.500 €** | 60 € × 25 |
| **LTV / CAC** | **~7,5x** | sano (>3x); caso conservador 4x |

**Punto de equilibrio del negocio:** con costes fijos de ~3.500 €/mes (fundador +
infra), hacen falta **~58 cafés activos** para cubrir gastos. Es un umbral
alcanzable con venta directa en 12–18 meses.

---

## 5. Proyección ilustrativa a 3 años (conservadora)

Supuestos: alta media de cafés/mes creciente (venta directa → 1 comercial),
churn 4%/mes, ARPU 69 €.

| | Fin Año 1 | Fin Año 2 | Fin Año 3 |
|---|---|---|---|
| Cafés activos | ~60 | ~200 | ~450 |
| MRR | ~4.100 € | ~13.800 € | ~31.000 € |
| **ARR** | **~50 k€** | **~165 k€** | **~370 k€** |

> No es un unicornio a 69 €/café — y conviene decirlo. El caso de escala depende de
> tres palancas claras (sección 7).

---

## 6. Mercado (TAM / SAM / SOM) — estimación a validar

| | Definición | Tamaño aprox. | ARR potencial |
|---|---|---|---|
| **TAM** | Cafés de especialidad en la UE (~60.000) | 60.000 | ~50 M€ |
| **SAM** | Cafés de especialidad en España (~4.000) | 4.000 | ~3,3 M€ |
| **SOM** | Alcanzable en 3 años (venta directa) | 300–500 | ~250–400 k€ |

---

## 7. Palancas de escala (de "lifestyle" a "venture")

1. **Niveles de precio / upsell** (multi-local, analítica, marketing) → sube ARPU.
2. **Expansión UE** con el mismo playbook → mercado 10× el de España.
3. **Take-rate sobre el GMV** de las membresías una vez probada la retención
   (opcional) → convierte un SaaS de cuota fija en ingreso que escala con el volumen.
4. Visión grande: la **capa de membresías del comercio de proximidad**, empezando
   por el café (panaderías, fruterías, peluquerías…).

---

## 8. Riesgos (los decimos nosotros antes que el inversor)

| Riesgo | Mitigación |
|---|---|
| **¿Convierte el consumidor español sin ahorro claro?** | A 20 €/mes el café sale a ~0,90 €; el ahorro **sí** se siente en especialidad (ticket 2,6 €). |
| **Churn de la cafetería (SMB)** | El producto se diseña para que el club retenga (datos, re-enganche, attach). LTV depende 100% de esto. |
| **"Lo hago con un Excel"** | Cierto < 40 socios. El dolor (cobro + fuga en barra) aparece al escalar; ahí mordemos. |
| **Techo de TAM a 69 €** | Palancas de la sección 7 (tiers, UE, take-rate). |

---

## 9. Estado actual y siguiente hito

- **Producto:** MVP funcional (web + demo navegable): alta por QR, control en caja
  con tope diario, pedido y recogida, panel del dueño con métricas y fidelización.
- **Validación:** 🟡 pendiente. Próximo hito = **piloto manual de coste 0** en 1–3
  cafés de Barcelona. Criterio de éxito doble: **≥15 de 20 regulares pagan** y el
  dueño **tira del producto** (señal de disposición a pagar los 69 €).
- **Tesis sobre la ronda:** el piloto cuesta 0 €. Lo coherente es **validar primero**
  y enseñar resultados, no levantar sobre una idea. Conversación con inversor hoy =
  *feedback, red de contactos en hostelería y co-validación*, no cheque.

---

*Cifras de trabajo, sujetas a validación. Coffee Me · Barcelona.*
