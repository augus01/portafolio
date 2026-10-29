# Movimiento

El movimiento comunica causa y efecto; no decora. El portafolio es limpio y quieto: lo único que se mueve es lo que responde a una acción de la persona.

## Reglas

- Solo se animan `transform` y `opacity`. Nunca ancho, alto, margen ni posición de layout.
- Duración menor a 300ms: `dur-press` 160ms, `dur-enter` 240ms, `dur-move` 280ms.
- Entradas con `ease-out`; movimientos entre posiciones con `ease-in-out`. Ambos son tokens.
- Presión: el elemento baja a `scale-press` en `dur-press` al pointer-down, antes de soltar.
- Hover de ProjectCard: la imagen sube a `scale-hover` y la flecha del link se desplaza 2px, en `dur-move` con `ease-in-out`.
- La navegación flotante (`surface-float`) no anima su blur; solo entra con opacidad.
- El menú móvil de la NavBar entra con opacidad y un desplazamiento corto en `transform`, nunca cambiando su alto.

## prefers-reduced-motion

- Se eliminan desplazamientos y escalas; quedan cambios de opacidad o nada.
- Indicadores infinitos (spinner, barra indeterminada) pasan a un pulso suave de opacidad en vez de detenerse.
- La función creativa debe funcionar entera con reduced-motion activo; la animación nunca es la única forma de ver el resultado.

## Alta frecuencia

No se animan los enlaces de navegación entre secciones ni el envío del formulario más allá de la presión. La velocidad percibida manda sobre la elegancia.
