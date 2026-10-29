# FormField

Campo completo: etiqueta visible, ayuda, campo de una o varias líneas y mensaje de error o correcto, enlazados entre sí.

## Propiedades

`label: string` · `helperText?` · `errorText?` · `successText?` · `optional?` · `value? / defaultValue?` · `onChange? / onBlur?` · `size: 'sm' | 'md'* | 'lg'` · `status?: 'error' | 'success'` · `disabled?` · `readOnly?` · `required?` · `multiline?` · `rows: number` (4*) · `type?` · `name?` · `id?` · `placeholder?` · `autoComplete?` · `inputMode?` · `className?`

`*` marca el valor por defecto.

## Teclado y accesibilidad

La etiqueta es un `<label for>`. Ayuda y mensaje se enlazan con `aria-describedby`; el mensaje vive en una región `aria-live="polite"`. El error marca `aria-invalid` y lleva icono y frase, nunca solo borde rojo. Solo lectura sigue siendo enfocable y seleccionable (fondo hundido y borde punteado); deshabilitado no. Controlado o no controlado.

## Uso

Valida al salir del campo o al enviar, no mientras se escribe. El error dice qué pasó y qué hacer ("Revisa el correo: debe tener la forma nombre@dominio.cl."). Marca lo opcional, no lo obligatorio. El placeholder es un ejemplo, nunca la etiqueta. `multiline` con `rows` para mensajes largos.
