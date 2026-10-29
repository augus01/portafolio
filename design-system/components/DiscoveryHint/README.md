# DiscoveryHint

Pista visible que invita a descubrir la función creativa, con atajo de teclado opcional.

## Propiedades

`children` · `shortcut?: string` · `onActivate?: () => void` · `tone: 'light'* | 'dark'` · `className?`

`*` marca el valor por defecto.

## Teclado y accesibilidad

Es un botón: Enter y Espacio lo activan. El atajo se muestra en `<kbd>`; el componente no registra el atajo, eso lo hace la función creativa.

## Uso

Obligatoria por las reglas del reto: la función creativa debe tener una pista visible. Una sola por página, normalmente dentro del Hero. El texto cambia cuando se decida la función.
