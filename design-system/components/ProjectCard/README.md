# ProjectCard

Caso de proyecto en dos variantes: `featured`, una card con índice, nombre, rol, resumen, resultado, stack y acciones junto a una captura o un panel; y `compact`, una fila de índice para proyectos secundarios.

## Propiedades

`name: string` · `variant: 'featured'* | 'compact'` · `index?: number | string` · `year?` · `status?` · `role?` · `summary?` · `result?` · `stack?: string[]` · `links?: { label, href, external? }[]` · `image?` · `imageAlt?` · `reverse?: boolean` · `headingLevel: 'h2' | 'h3'* | 'h4'` · `className?`

`*` marca el valor por defecto.

## Teclado y accesibilidad

`featured` es un `<article>`. El nombre aparece una sola vez y es el encabezado real: en la columna de texto si hay `image`, o en el panel oscuro si no la hay (el panel no está oculto a lectores de pantalla). Los Tags que no caben se resumen en "+N" con el resto en texto oculto para lectores y en `title`. El primer link es interno; el segundo, externo, abre en otra pestaña y lo anuncia. `compact` es un solo enlace (`<a>`) con foco visible, que contiene el encabezado del proyecto.

## Uso

Orden de la columna: línea `label` con índice, año y estado como `Tag` · nombre en `wordmark` · rol · resumen · resultado · stack · acciones. Resumen de máximo dos líneas en escritorio, unos 140 caracteres: el componente no lo corta, así que revisa el largo. `result` es opcional y se escribe solo con un resultado real ("Resultado: …"); si no lo hay, no se muestra nada. Stack: hasta 4 Tags y un "+N"; en contenedores de menos de 480px, 3 y "+N" para que quepa en una línea (a 320px un stack de nombres largos todavía puede pasar a dos). Acciones: hasta 2 links. Con `image` (captura real en escala de grises sobre `surface-sunken`) la proporción es 5fr/7fr; sin imagen, panel de respaldo `surface-inverse` en 6fr/6fr con el nombre ajustado al ancho. En contenedores de menos de 720px el panel va arriba con proporción 16/10. Al pasar el cursor la imagen sube a `scale-hover` y la flecha del link se mueve 2px, con `dur-move` y `ease-in-out`; con `prefers-reduced-motion` no se mueve nada. `featured` para los 3 o 4 proyectos principales (alterna `reverse`); `compact` en una lista para el resto.
