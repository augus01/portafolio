# Datos de la tienda para las pantallas de Zam

Es la única fuente de nombres, productos, cifras y fechas de las 6 pantallas. Todos los datos son ficticios: la tienda, las personas, los proveedores y los códigos de barra (prefijo `7809999`, con dígito verificador válido). Los productos son genéricos, sin marcas reales.

## Negocio y tienda

- Negocio: Comercial El Roble SpA. RUT 77.418.205-3 (ficticio). Giro: minimarket.
- Tienda: **Minimarket El Roble**, Av. Irarrázaval 3150, Ñuñoa, Santiago. Moneda CLP. Política de stock `PERMITE_FALTANTE`.
- Dueña: **Carmen Soto** (iniciales CS). Cajero: **Matías Rojas** (iniciales MR).
- Fecha de referencia: **jueves 6 de noviembre de 2026, 18:40**.

## Proveedores

| Proveedor | Qué trae | Lead time |
|---|---|---|
| Distribuidora Sur | Abarrotes, bebidas, aseo, termos | 3 días |
| Lácteos del Maipo | Leche, yogurt, queso | 2 días |

## Productos (precio de venta con IVA)

| # | Producto | Código | Unidad | Precio | Stock | Venta diaria prom. | Proveedor |
|---|---|---|---|---|---|---|---|
| 1 | Leche entera 1L | 7809999000014 | unidad | $1.190 | 48 | 12 | Lácteos del Maipo |
| 2 | Pan amasado | 7809999000021 | kg (granel) | $2.490/kg | 18,4 kg | 9 kg | (elaborado en la tienda) |
| 3 | Huevos bandeja 30 | 7809999000038 | unidad | $6.990 | 14 | 3 | Distribuidora Sur |
| 4 | Bebida cola 3L | 7809999000045 | unidad | $2.890 | 36 | 8 | Distribuidora Sur |
| 5 | Arroz grado 2 1kg | 7809999000052 | unidad | $1.490 | -3 (faltante) | 5 | Distribuidora Sur |
| 6 | Aceite maravilla 1L | 7809999000069 | unidad | $2.790 | 22 | 2 | Distribuidora Sur |
| 7 | Yogurt batido 1L | 7809999000076 | unidad | $1.890 | 8 (lote vence 16 nov) | 1 | Lácteos del Maipo |
| 8 | Termo 2L | 7809999000083 | unidad | $14.990 | 20 (costo $9.000 c/u) | 0 hace 30 días | Distribuidora Sur |
| 9 | Detergente 3L | 7809999000090 | unidad | $5.990 | 11 | 1 | Distribuidora Sur |
| 10 | Papel higiénico 4 rollos | 7809999000106 | unidad | $2.590 | 30 | 4 | Distribuidora Sur |
| 11 | Cerveza lata 470cc pack 6 | 7809999000113 | unidad | $5.490 | 18 | 3 | Distribuidora Sur |
| 12 | Queso gauda laminado 250g | 7809999000120 | unidad | $2.690 | 16 | 3 | Lácteos del Maipo |

## Ventas de hoy (hasta las 18:40)

- Total: **$612.480**. **148 boletas**. Ticket promedio: **$4.138**.
- Por medio de pago: efectivo **$248.150**, tarjeta **$301.830**, transferencia **$62.500**. Suman $612.480.
- Ayer, a la misma hora, se llevaban $571.900 (+7 %).

Últimas 6 ventas (boleta, hora, monto, medio de pago):

| Boleta | Hora | Monto | Medio |
|---|---|---|---|
| 004817 | 18:38 | $3.580 | Tarjeta |
| 004816 | 18:36 | $12.470 | Efectivo |
| 004815 | 18:33 | $1.190 | Efectivo |
| 004814 | 18:31 | $6.990 | Transferencia |
| 004813 | 18:27 | $2.890 | Tarjeta |
| 004812 | 18:24 | $5.380 | Efectivo |

## Caja

- **Caja 1**, abierta a las **08:02** por Matías Rojas. Fondo inicial: $40.000.
- Ventas en efectivo: $248.150. Retiro de efectivo de Carmen Soto a las 14:10: -$100.000.
- **Efectivo esperado: $188.150** (40.000 + 248.150 − 100.000).

## Alertas de hoy (regla de `06-modulos/alerts.md`)

| Tipo | Severidad | Texto | Acción |
|---|---|---|---|
| QUIEBRE_STOCK | Atención | Al ritmo actual te quedan ~4 días de Leche entera 1L. Pide a Lácteos del Maipo antes del sábado. | Pedir a Lácteos del Maipo |
| VENCIMIENTO_PROXIMO | Atención | 8 unidades de Yogurt batido 1L vencen en 10 días. Considera una promoción. | Ver el lote |
| CAPITAL_ESTANCADO | Informativa | Tienes $180.000 inmovilizados en Termo 2L sin ventas en 30 días. | Ver el producto |
| INFLACION_PROVEEDOR | Informativa | Distribuidora Sur subió Arroz grado 2 1kg un 18 % en 3 meses. | Comparar precios |

Cálculo del quiebre de la leche: punto de reorden = 12 u/día × (2 días de lead time + 2 de margen) = 48. Como el stock es 48, la alerta dispara. 48 ÷ 12 = 4 días, así que se acaba el lunes 10. Pedir antes del sábado deja llegar el pedido a tiempo.
El arroz pasó de $890 a $1.050 de compra en 90 días: +18 %.

## Venta en curso (pantalla de caja)

| Línea | Cantidad | Monto |
|---|---|---|
| Leche entera 1L | 2 × $1.190 | $2.380 |
| Pan amasado | 0,350 kg × $2.490 | $872 |
| Bebida cola 3L | 1 × $2.890 | $2.890 |
| Sin código (línea libre, queda como venta suelta) | 1 | $1.200 |
| **Total** | | **$7.342** |

## Ingreso de mercadería (pantalla web)

Distribuidora Sur, factura n.º 58213, 6 nov 2026. Flete: $12.000, repartido según el subtotal de cada línea.

| Producto | Presentación | Cant. | Unidades | Costo compra c/u | Subtotal | Flete repartido | Costo final c/u | Vence |
|---|---|---|---|---|---|---|---|---|
| Arroz grado 2 1kg | fardo x10 | 2 | 20 | $1.050 | $21.000 | $2.422 | $1.171,11 | — |
| Aceite maravilla 1L | caja x12 | 1 | 12 | $1.790 | $21.480 | $2.478 | $1.996,46 | — |
| Bebida cola 3L | pack x6 | 4 | 24 | $1.690 | $40.560 | $4.678 | $1.884,93 | — |
| Huevos bandeja 30 | unidad | 5 | 5 | $4.200 | $21.000 | $2.422 | $4.684,43 | 27 nov 2026 (obligatorio, perecible) |

Subtotal: $104.040. Flete: $12.000. **Total del ingreso: $116.040.**
Aviso: el ingreso cubre primero las 3 unidades de Arroz grado 2 1kg que se vendieron sin stock registrado. El stock queda en 17.

## Gasto por el asistente (pantalla de asistente)

- Carmen manda la foto de una boleta: "Gas licuado 45 kg". Emisor: Distribuidora de Gas Los Andes (ficticia). 5 nov 2026. **$48.600**.
- Zam responde con un borrador: Proveedor: Distribuidora de Gas Los Andes · Monto: $48.600 · Categoría: Servicios básicos · Fecha: 5 nov 2026 · Estado: por pagar.
- Botones: `Guardar gasto` (primario) y `Corregir`.
