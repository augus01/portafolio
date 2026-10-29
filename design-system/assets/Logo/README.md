Logo de Augusto Pinto: "apinto" en trazo continuo de 6 unidades, con el monograma "ap" como versión corta. Solo existen en blanco y negro.

- `apinto-logotipo-negro.svg` y `ap-monograma-negro.svg`: tinta `ink-primary` (#0e0f12) sobre `surface-canvas`, `surface-raised` y `surface-sunken`.
- `apinto-logotipo-blanco.svg` y `ap-monograma-blanco.svg`: blanco sobre `surface-inverse`. Son monocromos: el naranja de los archivos originales se pasó a blanco.
- `ap-icono-app.svg` y `favicon.svg`: monograma blanco sobre fondo `surface-inverse`, para icono de app y pestaña del navegador.
- Se muestran con `<img>`; el nombre accesible va en el `alt` ("Augusto Pinto") y, si el logo acompaña al texto de la marca, `alt=""`.
- Área libre: la altura del círculo de la "a" a cada lado. Alto mínimo del logotipo: 24px; del monograma: 20px.
- No se recolorea, no se estira, no se le agregan sombras ni degradados y no se pone sobre fotos.

> En este repo el logo se dibuja con el átomo `src/components/atoms/Logo` (mismos trazos SVG del sistema, `currentColor`). Los `.svg` sueltos del artefacto no se pudieron exportar: si se necesitan (favicon), se generan desde ese átomo.
