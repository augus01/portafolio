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
- **React + Vite**, sin plantilla de ejemplo. Dependencias de animación: `gsap@3.13.0` (+ ScrollTrigger) y `lenis@1.3.4`, versiones fijas.
- `npm run dev` · `npm run build` · `npm run preview`.

## Design system — USO OBLIGATORIO
- La carpeta **`design-system/`** es el registro visual oficial ("Augusto Pinto"). Leer `design-system/README.md` antes de tocar UI.
- **Toda** la UI usa sus tokens (`tokens.css`) y clases de componentes (`components/bundle.css`). Prohibido inventar colores, espacios, radios, fuentes o duraciones fuera de los tokens (única excepción: la paleta local del hero `--hero-*`).
- Tipografía solo con las clases del sistema (`.wordmark`, `.display`, `.heading`, `.lead`, `.body`, `.label`, …).
- `components/bundle.js` es **solo referencia** del marcado aprobado: no se importa. Los componentes se reimplementan en React respetando las clases `.ap-*`.
- No modificar los archivos del design system para ajustar un caso puntual; si falta algo, se agrega como token/clase nueva y se documenta en su README.

## Arquitectura — Atomic Design OBLIGATORIO
Todo componente vive en `src/components/` en su nivel:
- `atoms/` — piezas indivisibles (Icon, Logo, Pill, GrainOverlay, HeroCanvas…)
- `molecules/` — combinaciones simples de átomos (SectionHeadline, HeroTopBar, HeroWordmark, InfoCard…)
- `organisms/` — bloques completos (NavBar, Hero, HeroStage, secciones…)
- `templates/` — estructura de página sin contenido (ImmersiveLandingTemplate)
- `pages/` — templates con contenido real (HomePage)

Reglas: cada componente en su carpeta `Nombre/Nombre.jsx` + `index.js`; un nivel solo importa niveles inferiores; el contenido (textos, links) vive en `src/content/`; la lógica no visual en `src/hooks/` y `src/lib/`.

## Commits
- Commits pequeños y frecuentes a medida que se avanza, en español, con prefijo convencional (`feat:`, `chore:`, `docs:`…).
- Autor único: la cuenta del usuario (augus01). **Sin `Co-Authored-By` ni otros colaboradores.**
- Repo: https://github.com/augus01/portafolio.git (rama `main`).

## Pendiente de definir
- Idea de la feature creativa (basada en la historia personal del usuario)
- Contenido real: historia, skills, proyectos (hoy hay lorem ipsum del artefacto aprobado)
