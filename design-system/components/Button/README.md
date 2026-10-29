# Button

Botón de acción con dos jerarquías, dos tamaños y estados de carga y presión.

## Propiedades

`variant: 'primary'* | 'secondary'` · `size: 'md'* | 'lg'` · `onDark?: boolean` · `loading?: boolean` · `disabled?: boolean` · `fullWidth?: boolean` · `startIcon? / endIcon?: IconName` · `href?: string` · `type: 'button'* | 'submit' | 'reset'` · `onClick?` · `className?`

`*` marca el valor por defecto.

## Teclado y accesibilidad

Enter y Espacio activan. Con `href` se vuelve enlace (`<a>`). El foco por teclado dibuja `focus-ring` de 2px separado 2px. `loading` mantiene el tamaño, marca `aria-busy` y `aria-disabled` y conserva el foco. Ambos tamaños cumplen `target-min`.

## Uso

Una sola `primary` por pantalla. Etiquetas con verbo concreto (`Ver proyecto`, `Enviar mensaje`). `secondary` para la alternativa. Para acciones de baja jerarquía o junto a texto usa `Link`, no un botón fantasma. `onDark` sobre `surface-inverse` (Hero, pie). Si lo deshabilitas, explica el motivo en texto cercano. No hay variante destructiva: el portafolio no borra nada.
