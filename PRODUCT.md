# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Jurado del AWS Student Builder Challenge "Build Your Tech Superpower"** (audiencia principal). Gate 1 lo revisa una IA más humanos (semana del 9 nov 2026); Gate 2, un panel de expertos AWS (semana del 16 nov). Necesitan confirmar en poco tiempo que existen las tres secciones core, que la función creativa se descubre por una pista visible y funciona, y que el sitio corre en AWS sin errores.
- **Reclutadores e internships en Chile.** Buscan quién es Augusto, qué sabe, qué ha construido y cómo contactarlo.
- **Compañeros y contactos.** Quieren ver el trabajo y llegar a los repositorios.

## Product Purpose

Portafolio personal de Augusto Pinto (21 años, Santiago de Chile), estudiante de 4.º año de Ingeniería Civil Informática en la Universidad San Sebastián, con meta de convertirse en AI Engineer. Existe para competir en el reto de AWS (objetivo: quedar entre los 5 ganadores) y, después, como carta de presentación profesional.

Éxito = pasar el checklist PASS/FAIL del reto y maximizar la rúbrica: creatividad y memorabilidad (30 %, también desempate), implementación AWS funcionando (25 %), calidad de comunicación (25 %), completitud y usabilidad (20 %).

## Positioning

Augusto construye el producto completo para las personas, de la pantalla a la arquitectura, con IA aplicada a situaciones reales (un trámite, una duda, una decisión), no como demostración. La función creativa "Visita mi oficina" lo refleja: una maqueta 3D de su oficina donde cada agente atiende una sección del portafolio (recepción → Sobre mí, arquitecto → Proyectos, stack → Superpoderes). Evita deliberadamente los clones de los ejemplos del reto (terminal, Windows 98, arcade).

## Operating Context

- Sitio estático (React + Vite) publicado en **AWS Amplify Hosting** con CI/CD desde GitHub (`augus01/portafolio`, rama `main`).
- Deadline de entrega: **6 nov 2026, 11:59 p.m. PT**. El sitio debe seguir online y estable al menos hasta el 23 nov 2026: no romper `main` ni borrar recursos AWS.
- La entrega incluye un proyecto en AWS Builder Center con descripción de la función creativa, screenshots del portafolio y de la consola AWS, documentación de servicios usados, aprendizajes y desafíos. El write-up lo lee primero una IA: encabezados claros y vocabulario de la rúbrica.
- Costo dentro del Free Tier.

## Capabilities and Constraints

- Secciones: Hero, Sobre mí, Superpoderes ("Con qué construyo", cinta de 17 tecnologías), Proyectos (3), Visita mi oficina (`#oficina`), Contacto.
- La función creativa nunca bloquea el contenido: pista visible, fallback si el 3D no carga (three@0.128.0 con carga diferida), funciona en móvil y no estorba la navegación.
- Cero errores en consola; todos los enlaces funcionan.
- Arquitectura Atomic Design en `src/components/`; contenido en `src/content/`; design system obligatorio en `design-system/` (ver `CLAUDE.md`).
- **Decisiones abiertas (no inventar):**
  - Qué hace cada agente al recibir una pregunta: IA real en AWS (p. ej. Lambda + API Gateway + Bedrock), respuestas guionadas o híbrido. Hoy el panel es un boceto ("aquí se abre el chat del agente").
  - Cómo funciona Contacto: formulario con backend AWS (Lambda + API Gateway + SES) o solo enlaces directos.

## Brand Commitments

- Nombre y marca: logo "apinto" y monograma "ap", solo en blanco y negro (`design-system/assets/Logo/`).
- Voz: español de Chile, primera persona, seguro, directo y concreto; frases con cifras reales. Humor permitido solo dentro de la función creativa. Sin emojis, sin Lorem ipsum, sin signos de exclamación en mensajes del sistema; botones con verbos concretos.
- Lema del Hero: "Menos promesas, más productos que ayudan cada día".
- Autoría: el portafolio debe ser original y no publicado antes.

## Evidence on Hand

Confirmado por Augusto:
- **Rumbo a Casa**: co-creador; ganador del AWS Zero to Shipped. Indica a qué subsidio de vivienda puede postular una familia, con la fuente de cada respuesta. Símbolo en `public/proyectos/rumbo-simbolo.svg`.
- **Inkvibe**: único desarrollador frontend; marketplace del tatuaje para Latinoamérica. Logo en `public/proyectos/inkvibe-logo.png`.
- **Zam**: proyecto propio en desarrollo (caja, inventario y finanzas para minimarket de barrio); sin usuarios ni resultados que afirmar. Isotipo provisorio en `public/proyectos/zam-isotipo.svg`.
- Existen enlaces públicos (repos/sitios de los proyectos y perfil de GitHub), pero las URLs aún no están en el código (hoy `href: '#'`); deben pedirse, no suponerse.
- Capturas de las apps en `public/proyectos/`; logos 3D de tecnologías en `public/habilidades/`.

No existen y no deben fabricarse: testimonios, métricas de uso, clientes o cifras de impacto no confirmadas.

## Product Principles

1. **Primero lo que da PASS.** Checklist del reto y deploy verde antes que cualquier pulido.
2. **La función creativa cuenta algo de Augusto.** Memorable y personal, nunca a costa del contenido core ni de la navegación.
3. **Solo afirmar lo demostrable.** Cada logro, cifra o capacidad tiene respaldo real; lo pendiente se dice como pendiente.
4. **Legible en menos de un minuto.** Un jurado (humano o IA) debe entender quién es, qué hace y dónde está la prueba sin buscar.
5. **Estable durante todo el juzgamiento.** Nada que pueda caerse, salir del Free Tier o romper `main` entre el 6 y el 23 nov.

## Accessibility & Inclusion

- Responsive desde 320 px sin scroll horizontal; objetivos táctiles de 44 px o más.
- Navegación completa con teclado y foco siempre visible.
- Respeta `prefers-reduced-motion`; contraste suficiente; nada se comunica solo con color, posición o hover.
- Lighthouse alto en performance y accesibilidad.
