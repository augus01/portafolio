# ContactForm

Formulario de contacto con nombre, correo y mensaje, validación en línea, envío con carga y avisos de error o confirmación dentro del propio formulario.

## Propiedades

`onSubmit?: (data: { name, email, message }) => Promise<void> | void` · `email?: string` · `className?`

## Teclado y accesibilidad

Valida al salir de cada campo y al enviar; los errores se anuncian en su campo. El botón entra en carga sin perder el foco. Si `onSubmit` falla, aparece un aviso de error en línea (`role="alert"`) y nada de lo escrito se pierde; si funciona, aparece una confirmación en línea (`role="status"`) que desaparece al volver a escribir.

## Uso

Pasa `onSubmit` conectado a tu backend en AWS (por ejemplo una función Lambda detrás de API Gateway). `email` agrega un correo alternativo en el aviso de error.
