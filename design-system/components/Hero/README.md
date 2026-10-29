# Hero

Apertura a pantalla completa: fondo de rayos en grises, "augusto pinto" gigante ajustado al ancho, logo, rol, disponibilidad opcional y navegación en píldoras abajo.

## Propiedades

`name: string` ('augusto pinto'*) · `role?` · `location?` · `availability?: string` · `intro?` · `image?: string` · `imageAlt?` · `uppercase?: boolean` · `nav?: NavItem[]` · `navActions?: NavItem[]` · `hint?: ReactNode` · `height: string` ('100svh'*) · `className?`

`*` marca el valor por defecto.

## Teclado y accesibilidad

El nombre es el `<h1>` de la página. El fondo es decorativo (`aria-hidden`); si pasas `image`, describe la foto en `imageAlt`. La disponibilidad es un `Tag` de texto, legible por lectores de pantalla. La navegación es la de `NavBar` con todo su teclado.

## Uso

Va una vez, al inicio. El nombre se mide y se escala para ocupar todo el ancho; en contenedores de menos de 600px se parte en dos líneas. `availability` (por ejemplo "Disponible para práctica") aparece junto al rol solo si la pasas. Con `image` la foto se pasa a blanco y negro, pero desde que se eliminó `scrim` solo lleva la viñeta de bordes oscuros: el contraste del nombre sobre una foto clara no está garantizado (decisión 8). Es la única superficie del sistema con degradado.
