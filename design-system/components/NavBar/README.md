# NavBar

Navegación en píldoras flotantes con grupo principal y de acciones; en contenedores angostos se pliega en un botón de menú.

## Propiedades

`items: { label, href, current? }[]` · `actions?: NavItem[]` · `tone: 'light'* | 'dark'` · `menuPlacement: 'down'* | 'up'` · `label: string` ('Principal'*) · `className?`

`*` marca el valor por defecto.

## Teclado y accesibilidad

Es un `<nav>` con listas. La página actual lleva `aria-current="page"`. El botón de menú es de solo icono con nombre ("Abrir menú" / "Cerrar menú"), `aria-expanded` y `aria-controls`; Esc cierra y devuelve el foco al botón; un clic fuera también cierra.

## Uso

Es el único material flotante del sistema: píldoras en `surface-float` con `blur-float` y `shadow-float`. El menú móvil que se abre desde ellas es sólido (`surface-raised`) y vive en `z-nav`. `tone="dark"` dentro del Hero. Se adapta al ancho de su contenedor, no al de la ventana.
