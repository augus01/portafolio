# CLAUDE.md — AWS Student Builder Challenge: "Build Your Tech Superpower"

> **Objetivo: GANAR.** Somos 1 de 5 ganadores. Cada decisión se evalúa contra la rúbrica de abajo.

## Qué hay que construir
Un **portfolio personal** público, hosteado en **AWS Amplify Hosting**, con:
1. **About Me** (historia personal)
2. **Skills / Tech Superpowers**
3. **Projects / Achievements** (proyectos de aprendizaje cuentan)
4. **UNA feature creativa** interactiva, que refleje a la persona, que:
   - se descubra mediante una **pista visible**,
   - **funcione** al activarse,
   - **no estorbe** la navegación del portfolio.

## Fechas clave (hora PT)
| Hito | Fecha |
|---|---|
| Guías diarias (cuenta AWS → agente de código → portfolio local → deploy global) | 27–30 oct 2026 |
| **Deadline de entrega** | **6 nov 2026, 11:59 p.m. PT** (no apurar al final) |
| Gate 1 (IA + humanos, top 50 avanzan) | semana del 9 nov |
| Gate 2 (panel de expertos AWS elige 5) | semana del 16 nov |
| Ganadores | semana del 23 nov |

**El sitio debe seguir online durante todo el periodo de jueces (hasta el 23 nov como mínimo). No romper `main` ni borrar recursos AWS.**

## Checklist de calificación (PASS/FAIL — si falta uno, quedamos fuera)
- [ ] Sitio público en AWS (Amplify Hosting) cargando en una URL viva
- [ ] Link al repo de GitHub (público)
- [ ] Las 3 secciones core + la feature creativa
- [ ] Proyecto publicado en Builder Center ("your project") que incluya:
  - descripción de la feature creativa
  - screenshots del portfolio **y** de la configuración en AWS (consola Amplify, etc.)
  - documentación de los servicios AWS usados
  - aprendizajes y desafíos
- [ ] Portfolio original, no publicado antes
- [ ] Usuario: estudiante verificado en Builder Center, 18+, país elegible (Chile ✅), individual

## Rúbrica (cómo maximizar puntaje)
| Criterio | Peso | Estrategia |
|---|---|---|
| **Creatividad y memorabilidad** | **30%** | Feature única y personal, no un clon de los ejemplos (terminal, Win98, arcade). Debe contar algo de la persona. También es el **desempate**. |
| **Implementación AWS funcionando** | 25% | Amplify Hosting + CI/CD desde GitHub, todos los links funcionan, cero errores en consola. Documentar cada servicio (Amplify, S3, CloudFront; opcional: formulario de contacto con Lambda/API Gateway/SES). |
| **Calidad de comunicación** | 25% | Write-up claro y bien estructurado, screenshots limpios, diagrama de arquitectura, narrativa de proceso + aprendizajes. Lo evalúa una IA primero: usar encabezados claros y las palabras de la rúbrica. |
| **Completitud y usabilidad** | 20% | 3 secciones fáciles de encontrar, navegación clara, responsive (desktop + móvil), accesible, rápido. |

## Principios de trabajo
- **Primero lo que da PASS**, luego pulir: deploy temprano en Amplify y mantenerlo verde siempre.
- La feature creativa nunca debe bloquear el contenido; debe tener fallback y funcionar en móvil.
- Performance y accesibilidad cuentan (Lighthouse alto, contraste, teclado, `prefers-reduced-motion`).
- Ir guardando screenshots y notas de desafíos **durante** el desarrollo para el write-up final.
- No incluir código malicioso, contenido ofensivo ni material con derechos de terceros.
- Mantener el costo en Free Tier.

## Stack (definido)
- **React + Vite**, sin plantilla de ejemplo. Dependencias de animación: `gsap@3.13.0` (+ ScrollTrigger) y `lenis@1.3.4`; 3D de la oficina: `three@0.128.0` (carga diferida). Versiones fijas.
- `npm run dev` · `npm run build` · `npm run preview`.

## Design system — USO OBLIGATORIO
La carpeta **`design-system/`** es el registro visual oficial ("Augusto Pinto" v8, copiado del artefacto del design system). **Antes de tocar cualquier UI, leer:**
1. `design-system/README.md` — fundamentos de contenido, color, tipografía, espacio, materiales y lo prohibido.
2. `design-system/INTEGRACION.md` — cómo se usa en este repo y las **excepciones aprobadas del hero inmersivo**.
3. `design-system/components/<Nombre>/README.md` e `index.d.ts` — props, teclado y uso del componente que se va a construir.
4. `design-system/movimiento.md`, `inventario.md`, `contexto.md`, `tokens.json` según haga falta.

Reglas:
- **Toda** la UI usa los tokens de `tokens.css` y las clases `.ap-*` de `components/bundle.css`. Prohibido usar valores literales de color, tamaño, radio, fuente o duración: si falta un token, se detiene y se propone.
- Tipografía solo con las clases del sistema (`.wordmark`, `.hero`, `.display`, `.heading`, `.subheading`, `.lead`, `.body`, `.body-sm`, `.meta`, `.label`, `.code`).
- Monocromo, sin acentos ni degradados, salvo las excepciones del hero documentadas en `INTEGRACION.md`.
- Contenido en español de Chile, sin Lorem ipsum, sin emojis, botones con verbos concretos.
- No se modifican los archivos de `design-system/` para un caso puntual; los cambios del sistema se documentan ahí mismo.
- Sin MUI: los componentes se reimplementan en React con el mismo marcado, clases y props del sistema.

## Arquitectura — Atomic Design OBLIGATORIO
Todo componente vive en `src/components/` en su capa, siguiendo las capas del design system:
- `atoms/` — Icon, Logo, Tag, Link, Button, Divider, Pill, Wordmark, HeroCanvas, GrainOverlay…
- `molecules/` — NavBar, FormField, SocialLinks, SkillGroup, InfoCard…
- `organisms/` — Hero, SectionHeadline, ProjectCard, StoryTimeline, DiscoveryHint, ContactForm, Footer, HeroStage, secciones de la página…
- `templates/` — estructura de página sin contenido (ImmersiveLandingTemplate)
- `pages/` — plantillas con contenido real (HomePage)

Reglas: cada componente en su carpeta `Nombre/Nombre.jsx` + `index.js`; un componente importa solo de su misma capa o de capas inferiores (nunca de una superior); el contenido (textos, links) vive en `src/content/`; la lógica no visual en `src/hooks/` y `src/lib/`.

## Commits
- Commits pequeños y frecuentes a medida que se avanza, en español, con prefijo convencional (`feat:`, `chore:`, `docs:`…).
- Autor único: la cuenta del usuario (augus01). **Sin `Co-Authored-By` ni otros colaboradores.**
- Repo: https://github.com/augus01/portafolio.git (rama `main`).

## Chat de la oficina con IA (chat-agentes)
Los agentes de `/oficina/` responden con Claude Haiku 4.5 en Bedrock, detrás de API Gateway y Lambda, con un tope de gasto de USD 10 al mes. **Antes de tocar el chat, su infraestructura o los presupuestos de AWS, leer:**
1. `docs/sensible/chat-agentes.md` (local, en `.gitignore`) — cómo funciona: recorrido de un mensaje, contrato de la API, derivación entre agentes, archivos, infraestructura, costos, budgets y estado actual.
2. `docs/sensible/plan-chat-agentes.md` (local) — plan de implementación con las tareas pendientes y sus verificaciones.

Reglas:
- Todo lo del chat se llama `chat-agentes` (stack, Lambda, tabla, API, budget, perfil `chat-agentes-haiku`) y lleva las etiquetas `project=portafolio` y `componente=chat-agentes`.
- El contenido de los agentes sale solo de `src/content/office.js`; `infra/lambda/contenido.json` se regenera con `node scripts/chat-agentes-contenido.mjs`.
- El chat de reglas (`answer()`) es siempre el respaldo; sin `VITE_CHAT_API_URL` el sitio funciona igual.
- Desplegar, cambiar budgets o etiquetas, o tocar Amplify genera cambios o gasto en AWS: se confirma con el usuario antes.

## Pendiente de definir
- Feature creativa: **"Visita mi oficina"**, página propia `/oficina/` (maqueta 3D con cuatro oficinas y chat con los tres agentes); la pista visible es "Pasa a la oficina" en Contacto. Falta definir a qué correo llega el recado de recepción (`leadEmail` en `src/content/office.js`) o un envío real con Lambda + SES.
- Contenido real: historia, skills, proyectos (hoy hay lorem ipsum del artefacto aprobado)
