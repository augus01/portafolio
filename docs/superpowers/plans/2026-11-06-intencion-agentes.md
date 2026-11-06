# Intención del visitante en chat-agentes — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** que cada agente de `/oficina/` distinga la intención del visitante: saludos, agradecimientos y "¿qué te puedo preguntar?" los responde el agente al que le hablan, sin derivar; solo una pregunta de otro territorio deriva.

**Architecture:** el modelo (Haiku 4.5 en Bedrock) clasifica la intención en un campo `intencion` del JSON; el prompt fija quién responde según la intención y `interpretarRespuesta` lo hace cumplir. El sitio deja de cortar los saludos antes de la IA. El respaldo local (`answer()`) suma la intención de ayuda para no derivar cuando la API no está.

**Tech Stack:** Node 22 (`node --test`), React + Vite, Lambda + Bedrock (Converse).

**Spec:** acordada en chat el 2026-11-06 (descripción aprobada por el usuario: campo `intencion` con `saludo|gracias|ayuda|pregunta|recado`, reglas por intención, el código respeta al agente pedido, saludos pasan por el modelo, respaldo con ayuda por agente).

## Global Constraints

- Contenido de los agentes solo en `src/content/office.js`; `infra/lambda/contenido.json` se regenera con `node scripts/chat-agentes-contenido.mjs`.
- Español de Chile, máx. 3 frases por agente, sin emojis.
- Sin `VITE_CHAT_API_URL` el sitio funciona igual (respaldo `answer()`).
- Desplegar la Lambda se confirma con el usuario antes (`scripts/desplegar-chat-agentes.sh`).
- Commits en español con prefijo convencional, sin `Co-Authored-By`.

## Review Focus

- Modelo devuelve `intencion` desconocida o ausente → se trata como `pregunta` (comportamiento de hoy).
- `intencion: "ayuda"` sin agente pedido → responde recepción, sin aviso de derivación.
- `intencion: "saludo"` con `sabe:false` → igual responde el agente pedido (un saludo no es "no lo sé").
- `intencion: "ayuda"` con `sigue` → se descarta `sigue` (la ayuda la da un solo agente).
- Respaldo local: "¿qué te puedo preguntar?" a arquitecto no deriva a recepción.

---

### Task 1: Lambda — intención en el prompt y en `interpretarRespuesta`

**Files:**
- Modify: `infra/lambda/nucleo.mjs` (`armarSistema`, `interpretarRespuesta`)
- Test: `infra/lambda/nucleo.test.mjs`

**Interfaces:**
- Produces: `export const INTENCIONES_PROPIAS = ['saludo', 'gracias', 'ayuda']`; `interpretarRespuesta(texto, { pedido, contenido })` con la misma firma y forma de salida.

- [ ] **Step 1: tests que fallan**
  - `armarSistema` menciona `"intencion"` y los cinco valores, y una regla de ayuda ("qué puede aclarar" + cómo funciona la oficina).
  - `{"intencion":"ayuda","agente":"recepcion","texto":"Puedo…"}` con `pedido:'arquitecto'` → `[{agent:'arquitecto', text:'Puedo…'}]`.
  - `{"intencion":"saludo","agente":"recepcion","sabe":false,"texto":"¡Hola!"}` con `pedido:'stack'` → `[{agent:'stack', text:'¡Hola!'}]`.
  - `{"intencion":"ayuda","agente":"stack","texto":"x","sigue":{"agente":"arquitecto","texto":"y"}}` con `pedido:null` → `[{agent:'recepcion', text:'x'}]`.
  - `{"intencion":"pregunta","agente":"stack","texto":"x"}` con `pedido:'arquitecto'` → deriva como hoy.
- [ ] **Step 2:** `npm test` → fallan los nuevos.
- [ ] **Step 3:** en `interpretarRespuesta`, si `INTENCIONES_PROPIAS.includes(obj.intencion)` devolver `[{ agent: pedido || 'recepcion', text }]`. En `armarSistema`: reemplazar la regla de saludos por reglas por intención; acotar la de la oficina (recepción explica qué es la oficina; la ayuda la da cada agente); formato JSON con `"intencion"`.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** commit `feat: los agentes del chat distinguen la intención del visitante`.

### Task 2: Sitio — saludos por la IA y ayuda en el respaldo

**Files:**
- Modify: `src/content/office.js` (`chat.small`: `helpRx`, `help` por agente; regla de recepción sobre la oficina si hace falta)
- Modify: `src/lib/officeChat.js` (`answer`: clave `help`)
- Modify: `src/hooks/useOfficeChat.js` (sin `isSmallTalk` al pedir a la API)
- Test: `src/lib/officeChat.test.js`, `src/content/office.test.js`

**Interfaces:**
- Consumes: nada de Task 1.
- Produces: `chat.small.helpRx: RegExp`, `chat.small.help: Record<agentId, string>`.

- [ ] **Step 1: tests que fallan**
  - `answer('¿Qué te puedo preguntar?', {…, to:'arquitecto'})` → `[{agent:'arquitecto', text: chat.small.help.arquitecto}]`; ídem stack; sin `to` → recepción.
  - `chat.small.help[id]` existe para los tres y `helpRx` calza "que te puedo preguntar", "en que me ayudas", "de que sabes", "como funciona esto", "ayuda".
- [ ] **Step 2:** `npm test` → fallan.
- [ ] **Step 3:** agregar `helpRx`/`help` (cada texto: qué aclara con dos preguntas de ejemplo + una frase de cómo funciona la oficina); `answer` prueba `help` junto a `greet`/`thanks`; `useOfficeChat` manda siempre `import.meta.env.VITE_CHAT_API_URL`. Regenerar `contenido.json`.
- [ ] **Step 4:** `npm test` y `npm run build` → PASS.
- [ ] **Step 5:** commit `feat: los saludos pasan por la IA y el respaldo responde la ayuda de cada agente`.

### Task 3: Verificación real contra Bedrock y despliegue

- [ ] **Step 1:** con credenciales locales, invocar Bedrock con `armarSistema` real: 3 agentes × ("¿qué te puedo preguntar?", "en qué me ayudas", "hola", "gracias", "¿cómo está hecho Zam?") × 3 repeticiones. Esperado: ayuda/saludo/gracias responde el agente pedido; Zam a arquitecto deriva a stack.
- [ ] **Step 2:** pedir confirmación al usuario y desplegar con `scripts/desplegar-chat-agentes.sh`.
- [ ] **Step 3:** repetir 3 preguntas contra la API desplegada; push a `main` para Amplify.
