# Selector de idioma EN/ES — Plan de implementación

> **Para agentes:** SUB-SKILL REQUERIDA: usar superpowers:subagent-driven-development (recomendada) o superpowers:executing-plans para implementar este plan tarea por tarea. Los pasos usan casillas (`- [ ]`) para el seguimiento.

**Objetivo:** El portafolio abre en inglés (para los jueces de AWS) y una píldora en la navegación lo cambia a español y de vuelta, en las tres páginas (inicio, proyectos, oficina), incluido el chat con IA.

**Arquitectura:** Los módulos de contenido actuales (`src/content/home.js`, `projects.js`, `office.js`) quedan como la versión en español; se agregan espejos en inglés en `src/content/en/` con exactamente los mismos exports y la misma forma. Un módulo puro `src/lib/lang.js` y un hook `src/hooks/useLang.js` manejan el idioma (por defecto `en`, guardado en `localStorage`, aplicado a `<html lang>`); cada página elige el módulo según el idioma y pasa un objeto `langToggle` hacia la navegación. El chat envía `lang` a la Lambda, que usa `contenido.json` con ambos idiomas.

**Stack:** React 19 + Vite 8, `node --test`, Lambda Node 22 (Bedrock Haiku 4.5), CloudFormation (`infra/chat-agentes.yaml`).

**Diseño:** aprobado en el chat del 2026-11-06 (no hay archivo de spec). Resumen en la sección siguiente.

## Diseño aprobado (resumen)

- Inglés es el idioma principal; el sitio abre siempre en inglés, aunque el navegador esté en español. Sin detección automática.
- Botón: píldora `Pill` en el grupo derecho de la `NavBar`, antes de GitHub. Muestra el idioma destino: `ES` en inglés, `EN` en español; `aria-label` completo ("Ver en español" / "View in English").
- En móvil también es una píldora visible en la barra (`MobileNavBar`), junto al botón de menú, no dentro del menú.
- Cambio instantáneo sin recargar: actualiza `<html lang>`, `document.title` y se guarda en `localStorage`. Si el almacenamiento falla, queda en inglés.
- Sin rutas nuevas (`/en/`, `/es/`): las URLs no cambian.
- Contenido: `home.js`, `projects.js`, `office.js` con versión `en` y `es` de la misma forma; los textos sueltos en componentes también salen del contenido.
- Chat: el sitio envía `lang`; la Lambda responde "in English" o "en español de Chile"; sin `lang` responde en español (compatibilidad). `contenido.json` con ambos idiomas. El chat de reglas (`answer()`) bilingüe, con palabras clave en inglés.
- Desplegar la Lambda y empujar a `main` (Amplify) se confirma con el usuario antes.
- No entra: traducir el design system, imágenes con texto, detección de idioma del navegador.

## Restricciones globales

- Toda UI con tokens de `design-system/tokens.css` y clases `.ap-*`; ningún valor literal de color, tamaño, radio, fuente o duración. La píldora usa el átomo `Pill` existente.
- Atomic Design: un componente importa solo de su capa o inferiores; textos en `src/content/`, lógica no visual en `src/hooks/` y `src/lib/`.
- Sin emojis, sin Lorem ipsum, botones con verbos concretos. Inglés natural (no literal); español de Chile.
- Slugs de proyectos idénticos en ambos idiomas (`vite.config.js` genera rutas desde `caseSlugs` del módulo en español).
- Commits en español, prefijo convencional, autor `augus01`, **sin `Co-Authored-By`** (CLAUDE.md manda sobre cualquier otra instrucción).
- Hay cambios sin commit del usuario en `home.js`, `office.js`, `nucleo.mjs`, `nucleo.test.mjs`, `contenido.json`, `ProjectPage.jsx`, `CasePageTemplate.jsx`, `proyecto.css` y el borrado de `CaseBackButton`: **antes de la Tarea 1** se pregunta al usuario si se commitean tal cual en un commit propio; nunca se descartan.
- Todo lo del chat sigue la convención `chat-agentes` y se lee `docs/sensible/chat-agentes.md` antes de tocarlo.

## Foco de revisión

1. `localStorage` con un valor antiguo o basura (`'fr'`, `'"es"'`) o que lanza excepción (modo privado) → el sitio abre en inglés sin errores en consola. Prueba en Tarea 1.
2. Un visitante escribe en inglés con el chat de reglas (sin `VITE_CHAT_API_URL` o con la Lambda caída/tope): "Hi", "Thanks", "What is Rumbo a Casa?", "I want to hire him" → respuestas en inglés del agente correcto. Prueba en Tarea 4.
3. Compatibilidad durante el despliegue: frontend nuevo contra Lambda vieja (ignora `lang`, responde en español, sin romper) y frontend viejo contra Lambda nueva (sin `lang` → español). `lang` inválido → español, no rechazo. Pruebas en Tarea 5.
4. Abrir directo `/proyectos/<slug>/` o `/oficina/` con `es` guardado → la página sale en español y el slug existe en ambos idiomas. Prueba de paridad de slugs en Tarea 3.
5. Cambiar de idioma con el chat a medias (con una respuesta de la API en vuelo) → la conversación se reinicia con la bienvenida del nuevo idioma y la respuesta tardía se descarta. Verificación manual en Tarea 6.

---

### Tarea 1: Estado del idioma (`lang.js` + `useLang`)

**Archivos:**
- Crear: `src/lib/lang.js`, `src/lib/lang.test.js`, `src/hooks/useLang.js`

**Interfaces:**
- Produce:
  - `LANGS = ['en', 'es']`, `DEFAULT_LANG = 'en'`, `LANG_KEY = 'ap-lang'`
  - `readLang(storage?: Storage) -> 'en'|'es'` — nunca lanza; sin storage, valor inválido o excepción → `'en'`.
  - `saveLang(storage: Storage|undefined, lang) -> void` — nunca lanza.
  - `otherLang(lang) -> 'en'|'es'`
  - `pickLang(lang, { en, es }) -> en|es` — devuelve el módulo del idioma; con `lang` inválido, `en`.
  - `useLang() -> { lang, setLang(lang), toggle() }` — estado inicial `readLang(window.localStorage)` (envuelto en try), en cada cambio pone `document.documentElement.lang = lang` y llama `saveLang`.

- [ ] **Paso 1: Escribir las pruebas que fallan** en `src/lib/lang.test.js`:
  - `readLang()` sin storage → `'en'`; con `{ getItem: () => 'es' }` → `'es'`; con `'fr'` → `'en'`; con `getItem` que lanza → `'en'`.
  - `saveLang({ setItem })` llama `setItem('ap-lang', 'es')`; con `setItem` que lanza no lanza; con `undefined` no lanza.
  - `otherLang('en') === 'es'`, `otherLang('es') === 'en'`.
  - `pickLang('es', { en: 1, es: 2 }) === 2`; `pickLang('xx', { en: 1, es: 2 }) === 1`.
- [ ] **Paso 2: Ejecutar** `node --test src/lib/lang.test.js` → FALLA (módulo no existe).
- [ ] **Paso 3: Implementar** `src/lib/lang.js` y `src/hooks/useLang.js` con las firmas de arriba.
- [ ] **Paso 4: Ejecutar** `npm test` → todo PASA.
- [ ] **Paso 5: Commit** `feat: estado del idioma con inglés por defecto y recuerdo en localStorage`

### Tarea 2: Sacar los textos sueltos de los componentes al contenido (sin cambio visible)

**Archivos:**
- Modificar: `src/content/home.js`, `src/content/office.js`, `src/content/projects.js`
- Modificar: `src/components/molecules/NavBar/NavBar.jsx` (`'Menú'`, `'Cerrar'`, `label='Principal'`), `src/components/molecules/MobileNavBar/MobileNavBar.jsx` (`'Abrir menú'`), `src/components/organisms/MobileMenu/MobileMenu.jsx` (`'Menú de navegación'`, `'Cerrar menú'`, `'Principal'`), `src/components/organisms/Hero/Hero.jsx` (`'Presentación'`), `src/lib/contactDesk.js` (`'Toca el timbre si quieres'`, `'Hoy atiendo yo'`, `'Una vez más y te llevo a la oficina'`) y todo lo que encuentre la búsqueda del Paso 1.

**Interfaces:**
- Produce (en `home.js`): `nav.labels = { region, menu, close, openMenu }`, `mobileMenu.labels = { region, close, nav }`, `hero.regionLabel`, `contact.desk = { …frases de contactDesk }`, `meta = { documentTitle }` para la portada. `office.js`/`projects.js`: las cadenas sueltas que aparezcan, en la sección que ya consume el componente.
- Los componentes reciben esos textos por props con el valor español actual como default (para que nada se rompa si una página no los pasa).

- [ ] **Paso 1: Inventariar** cadenas visibles o `aria-*`/`alt`/`title` en `src/components`, `src/hooks`, `src/lib` (excluye tests y comentarios): `grep -rnE "(aria-label|alt|title|placeholder)=\"[^\"{]+\"|'[^']*[áéíóúñ¿][^']*'|>[A-ZÁÉÍÓÚ¿][^<>{}]{2,}<" src/components src/hooks src/lib`. Anotar cada hallazgo en el commit.
- [ ] **Paso 2: Mover** cada cadena al contenido y pasarla por props desde la página/plantilla.
- [ ] **Paso 3: Verificar** `npm test` PASA, `npm run build` sin errores, y `npm run dev`: inicio, un proyecto y `/oficina/` se ven idénticos a antes (desktop y 375 px), consola sin errores.
- [ ] **Paso 4: Commit** `refactor: los textos de la interfaz salen del contenido`

### Tarea 3: Contenido en inglés de inicio y proyectos

**Archivos:**
- Crear: `src/content/en/home.js`, `src/content/en/projects.js`, `src/content/i18n.test.js`, `src/content/shape.js` (helper de prueba)
- Modificar: `src/content/home.js` y `src/content/en/home.js` — agregar `langToggle`

**Interfaces:**
- Produce: `src/content/en/home.js` y `src/content/en/projects.js` con **los mismos exports** que sus pares en español. `en/projects.js` reexporta `caseSlugs` y `caseHref` del módulo español (mismos slugs) y define `getCase(slug)` sobre sus `cases`.
- `langToggle` en `home.js` (es) = `{ label: 'EN', ariaLabel: 'View in English', target: 'en' }`; en `en/home.js` = `{ label: 'ES', ariaLabel: 'Ver en español', target: 'es' }`. Las páginas de proyectos y la oficina reutilizan este mismo export.
- `shape(value) -> descriptor` en `src/content/shape.js`: describe recursivamente la forma (claves de objeto ordenadas, largo de arreglos, `typeof` de hojas; `RegExp` como `'regexp'`).

- [ ] **Paso 1: Escribir las pruebas que fallan** en `src/content/i18n.test.js`:
  - `shape(es.home[k])` deep-equal `shape(en.home[k])` para cada export de `home`, y lo mismo con `projects`.
  - `en.projects.cases.map(c => c.slug)` deep-equal `es.projects.caseSlugs`.
  - Ninguna cadena del contenido `en` contiene `[áéíóúñ¿¡]` salvo nombres propios en una lista permitida explícita en la prueba (p. ej. `'Augusto Pinto'`, `'Universidad San Sebastián'`, `'Santiago'`).
  - Ningún texto `en` es idéntico a su par `es` salvo los de la lista permitida (nombres, URLs, siglas como `AWS`).
- [ ] **Paso 2: Ejecutar** `node --test src/content/i18n.test.js` → FALLA.
- [ ] **Paso 3: Traducir** `home.js` y `projects.js` a inglés natural (la portada: "About me", "Superpowers", "Projects", "Contact"; el `href` de anclas como `#sobre-mi` no cambia). Mantener `name`, enlaces, imágenes y slugs.
- [ ] **Paso 4: Ejecutar** `npm test` → PASA.
- [ ] **Paso 5: Commit** `feat: contenido en inglés de la portada y los proyectos`

### Tarea 4: Contenido en inglés de la oficina y chat de reglas bilingüe

**Archivos:**
- Crear: `src/content/en/office.js`
- Modificar: `src/content/i18n.test.js`, `src/lib/officeChat.js` (solo si quedan textos en español por defecto), `src/lib/officeChat.test.js`

**Interfaces:**
- Consume: `shape` (Tarea 3).
- Produce: `src/content/en/office.js` con los mismos exports que `office.js` (`officePage`, `leadEmail`, `themes`, `stage`, `agents`, `chat`). Los `id` de agentes (`recepcion`, `arquitecto`, `stack`) no cambian; sus `name` en inglés: `reception`, `architect`, `stack`. Las expresiones regulares (`chat.leadRx`, `chat.small.greetRx|thanksRx|helpRx`, `chat.topics[].rx|unless`) reconocen inglés **y** español (un visitante puede escribir en cualquiera). `answer()` no debe tener textos de respaldo en español: si se usan, pasan a ser obligatorios desde el contenido.

- [ ] **Paso 1: Escribir las pruebas que fallan:**
  - En `i18n.test.js`: paridad de forma de `office` (funciones como `'function'`), y mismo largo y mismos `agent` en `chat.topics`.
  - En `officeChat.test.js`, con las opciones armadas desde `en/office.js`:
    - `answer('Hi', …)[0]` → `{ agent: 'recepcion', text: en.chat.small.greet.recepcion }`.
    - `answer('Thanks!', …)` → texto de `small.thanks`.
    - `answer('What is Inkvibe?', …)[0].agent === 'arquitecto'` y el texto es el del tema en inglés.
    - `answer('How is Rumbo a Casa built on AWS?', …)` incluye una respuesta de `stack`.
    - `answer('Whats your favorite food', …)[0].text === en.chat.noMatch`.
    - `wantsContact('I want to hire him', en.chat.leadRx) === true`.
    - Ninguna respuesta de las anteriores contiene `[áéíóúñ¿]`.
- [ ] **Paso 2: Ejecutar** `npm test` → FALLA.
- [ ] **Paso 3: Traducir** `office.js` a `en/office.js` y ajustar `officeChat.js` si quedan textos de respaldo en español.
- [ ] **Paso 4: Ejecutar** `npm test` → PASA.
- [ ] **Paso 5: Commit** `feat: oficina en inglés y chat de reglas que entiende inglés`

### Tarea 5: Lambda chat-agentes bilingüe

Leer antes `docs/sensible/chat-agentes.md`. Los cambios sin commit del usuario en `nucleo.mjs` se conservan.

**Archivos:**
- Modificar: `scripts/chat-agentes-contenido.mjs`, `infra/lambda/nucleo.mjs`, `infra/lambda/nucleo.test.mjs`, `infra/lambda/contenido.json` (regenerado), `src/lib/chatAgentesApi.js`, `src/lib/chatAgentesApi.test.js`, `src/hooks/useOfficeChat.js`

**Interfaces:**
- Consume: `en/office.js` (Tarea 4).
- Produce:
  - `contenido.json` = `{ es: <forma actual>, en: <misma forma> }`; `construirContenido({ agents, chat })` no cambia y el `main` del script lo llama dos veces.
  - `validarPeticion(body)` devuelve además `lang: 'en'|'es'`; ausente o inválido → `'es'` (no rechaza).
  - `armarSistema(contenido, pedido = null, lang = 'es')` recibe el contenido **de un idioma**; la regla de idioma es `- Respond in English, with at most 3 sentences per agent, no emojis.` para `en` y la línea actual para `es`.
  - `crearHandler` elige `const c = contenido[p.lang] ?? contenido.es` y lo usa en `armarSistema` e `interpretarRespuesta`.
  - `pedirRespuesta({ url, mensaje, agente, historial, lang, … })` incluye `lang` en el cuerpo.
  - `useOfficeChat({ chat, agents, scene, leadEmail, link, lang })` pasa `lang` a `pedirRespuesta`; cuando `lang` cambia, reinicia la conversación con `chat.welcome` del nuevo contenido e ignora respuestas en vuelo del idioma anterior.

- [ ] **Paso 1: Escribir las pruebas que fallan** en `nucleo.test.mjs` (adaptar las existentes a `contenido.es`):
  - `validarPeticion({ mensaje: 'hola' }).lang === 'es'`; con `lang: 'en'` → `'en'`; con `lang: 'fr'` → `'es'` y `ok: true`.
  - `armarSistema(contenido.en, null, 'en')` incluye `'Respond in English'` y el nombre `'architect'`; `armarSistema(contenido.es)` incluye `'Responde en español de Chile'`.
  - Handler con `ev({ mensaje: 'hi', lang: 'en', agente: 'stack' })` y un modelo falso que devuelve `agente: 'arquitecto'` → el aviso de derivación es `contenido.en.derivar.arquitecto`.
  - En `chatAgentesApi.test.js`: el cuerpo enviado por `pedirRespuesta({ …, lang: 'en' })` contiene `"lang":"en"`.
- [ ] **Paso 2: Ejecutar** `npm test` → FALLA.
- [ ] **Paso 3: Implementar** según las interfaces y regenerar con `node scripts/chat-agentes-contenido.mjs`.
- [ ] **Paso 4: Ejecutar** `npm test` → PASA.
- [ ] **Paso 5: Commit** `feat: chat-agentes responde en el idioma del sitio`

### Tarea 6: Píldora de idioma en la navegación y páginas bilingües

**Archivos:**
- Modificar: `src/components/molecules/NavBar/NavBar.jsx`, `src/components/molecules/MobileNavBar/MobileNavBar.jsx`, `src/components/organisms/OfficeHeader/OfficeHeader.jsx`, `src/components/templates/ImmersiveLandingTemplate/ImmersiveLandingTemplate.jsx`, `src/components/pages/HomePage/HomePage.jsx`, `src/components/pages/ProjectPage/ProjectPage.jsx`, `src/components/pages/OfficePage/OfficePage.jsx` (y `Office` si es quien llama a `useOfficeChat`), `index.html`, la hoja de layout que posiciona `.ap-mnav` / `.ap-ofp__back` (solo con tokens)

**Interfaces:**
- Consume: `useLang`, `pickLang` (Tarea 1); módulos `en/*` y `langToggle` (Tareas 3–4); `useOfficeChat({ …, lang })` (Tarea 5).
- Produce: prop opcional `langToggle?: { label, ariaLabel, target, onSelect() }` en `NavBar`, `MobileNavBar` y `OfficeHeader`. Se renderiza como `<Pill as="button" lang={target} aria-label={ariaLabel} onClick={onSelect}>{label}</Pill>`:
  - `NavBar`: primer elemento del grupo de acciones (antes de GitHub). No entra al panel plegable.
  - `MobileNavBar`: entre la píldora de Contacto (si existe) y el botón de menú.
  - `OfficeHeader`: junto al botón de volver.

- [ ] **Paso 1: Cablear las páginas:** cada página llama `useLang()`, elige contenido con `pickLang(lang, { en, es })`, arma `langToggle` con `onSelect: toggle` y actualiza `document.title` en un efecto que depende de `lang` (la portada con `meta.documentTitle`).
- [ ] **Paso 2: `index.html`:** `lang="en"` y `<title>` en inglés (lo que se ve antes de que cargue React y lo que leen los crawlers).
- [ ] **Paso 3: Verificar** `npm test` y `npm run build` PASAN.
- [ ] **Paso 4: Verificar en el navegador** (`npm run dev`, Claude in Chrome), en desktop 1440 px y móvil 375 px y 320 px:
  - Primera visita (localStorage vacío) → inglés en inicio, un proyecto y `/oficina/`; `document.documentElement.lang === 'en'`.
  - Tocar `ES` → todo en español sin recargar; recargar → sigue en español; abrir directo `/proyectos/<slug>/` → español.
  - La píldora se alcanza con Tab, se activa con Enter/Espacio, tiene foco visible; en 320 px no se solapa con logo, Contacto ni menú.
  - Oficina: preguntar en inglés con la API local → respuesta en inglés; cambiar a `ES` con una respuesta en vuelo → la conversación se reinicia en español y la respuesta tardía no aparece.
  - Consola sin errores ni advertencias en todo el recorrido.
- [ ] **Paso 5: Commit** `feat: píldora para cambiar entre inglés y español en la navegación`

### Tarea 7: Documentación, despliegue y verificación en producción

**Archivos:**
- Modificar: `CLAUDE.md` (regla "Contenido en español de Chile" → "Contenido en inglés (principal) y español de Chile (alternativa), en `src/content/` y `src/content/en/`"), `docs/sensible/chat-agentes.md` (contrato con `lang`, forma de `contenido.json`).

- [ ] **Paso 1: Commit de docs** `docs: idioma principal inglés y contrato del chat con lang`
- [ ] **Paso 2: Confirmar con el usuario** el despliegue de la Lambda (genera cambios en AWS). Con su sí, desplegar según `docs/sensible/chat-agentes.md` (`aws login … --region us-east-1`) y probar con `curl` a la API: `{"mensaje":"Hi, what is Zam?","lang":"en"}` → `replies` en inglés; sin `lang` → español.
- [ ] **Paso 3: Confirmar con el usuario** el `git push origin main` (dispara el build de Amplify en la app `d21d1ifzfdin9a`). Esperar el build en verde.
- [ ] **Paso 4: Recorrido en la URL viva** con el mismo checklist de la Tarea 6, Paso 4, más: chat con IA en inglés y español en producción; consola limpia.
- [ ] **Paso 5: Informar** qué quedó desplegado, cómo se comprobó y qué falta (p. ej. revisión del usuario de la traducción).
