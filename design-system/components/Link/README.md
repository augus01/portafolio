# Link

Enlace de texto subrayado siempre, con variante externa que agrega flecha y abre en otra pestaña.

## Propiedades

`href: string` · `external?: boolean` · `size: 'sm' | 'md'* | 'lg'` · `onDark?: boolean` · `className?` · más atributos de `<a>`

`*` marca el valor por defecto.

## Teclado y accesibilidad

El subrayado nunca desaparece; en hover se engrosa. `external` agrega `target="_blank"`, `rel="noopener noreferrer"` y el texto oculto "(abre en otra pestaña)".

## Uso

Para navegar. Si ejecuta una acción, usa `Button`. El texto del enlace describe el destino (`Repositorio en GitHub`), nunca "clic aquí".
