# Icon

Icono de Lucide (ISC, trazo 1,5) en tres tamaños; es decorativo salvo que lleve `label`.

## Propiedades

`name: 'arrow-up-right' | 'arrow-right' | 'arrow-down' | 'chevron-down' | 'menu' | 'x' | 'check-circle' | 'alert-circle' | 'info' | 'mail' | 'terminal' | 'copy' | 'check'` · `size: 'sm' | 'md'* | 'lg'` · `label?: string` · `className?`

`*` marca el valor por defecto.

## Teclado y accesibilidad

Sin `label` lleva `aria-hidden`. Con `label` es `role="img"` con nombre accesible: úsalo solo cuando el icono esté solo y comunique algo.

## Uso

Toma el color del texto que lo rodea. Junto a texto, sin `label`. Error y correcto tienen forma propia (`alert-circle`, `check-circle`). Solo se agregan iconos al mapa cuando se usan.
