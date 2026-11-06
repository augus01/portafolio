# Reglas por agente en la oficina — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** que recepción hable solo de Augusto, arquitecto solo de qué es y qué logra cada proyecto y stack solo de cómo se implementó, tanto en el chat de reglas como en la IA, manteniendo derivación y encadenamiento.

**Architecture:** las reglas y los hechos viven en `src/content/office.js` (campo nuevo `rules` por agente, hechos divididos por proyecto). El chat de reglas (`answer()`) los usa directo; `scripts/chat-agentes-contenido.mjs` los exporta a `infra/lambda/contenido.json`, y `armarSistema()` arma con ellos un prompt con reglas por agente. La IA gana una segunda parte opcional `sigue` para encadenar igual que las reglas.

**Tech Stack:** React + Vite, Node 22 `node --test`, Lambda Node 22 con Bedrock (Claude Haiku 4.5).

**Spec:** `docs/superpowers/specs/2026-11-05-reglas-agentes-design.md`. Fuente del contenido: `docs/sensible/perfil-augusto.md` (local, en `.gitignore`).

## Global Constraints

- Contenido en español de Chile, sin emojis y con un máximo de 3 frases por respuesta.
- Solo información profesional. Sin teléfono, correo personal ni comuna: la ubicación es "Santiago de Chile". Sin cursos ni certificaciones.
- Las organizaciones ajenas a la informática no se nombran nunca. Se dice "en las organizaciones donde se desempeña Augusto…".
- No se menciona "práctica" ni "pasantía" en ningún texto. El rol en Inkvibe es "desarrollador frontend".
- Recepción no nombra proyectos ni tecnologías, salvo una línea: "trabajó como desarrollador frontend en Inkvibe".
- Arquitecto no nombra tecnologías. Stack siempre amarra cada tecnología a un proyecto; la única excepción es Python para IA, sin inventar un proyecto.
- El chat de reglas sigue siendo el respaldo: sin `VITE_CHAT_API_URL` el sitio funciona igual.
- Commits en español con prefijo convencional y autor augus01, **sin `Co-Authored-By`**. `docs/sensible/` está en `.gitignore`: los cambios a `docs/sensible/chat-agentes.md` no se commitean.
- Nada se despliega (ni push a `main` ni Lambda) sin confirmación explícita de Augusto en el chat.

## Review Focus

- **Preguntas con tildes, mayúsculas o en inglés básico** ("¿CÓMO ESTÁ HECHO INKVIBE?", "how is inkvibe built"): deben caer en el mismo agente. Prueba en la tarea 2.
- **Preguntas de implementación sin el nombre del proyecto** ("¿qué sabe de React?", "¿usa TypeScript?"): responde stack y nombra el proyecto donde lo usó. Prueba en la tarea 2.
- **El modelo devuelve `sigue` con el mismo agente, sin texto o con `sabe:false`:** se descarta `sigue` y no se duplica nada. Prueba en la tarea 3.
- **El visitante le habla a stack y pregunta qué es un proyecto:** stack deriva a arquitecto. No encadena de vuelta a stack, para que el visitante no salte dos veces. Prueba en la tarea 2.
- **Preguntas de disponibilidad o de contacto** ("¿está disponible?"): abren el recado como hoy. "práctica" ya no lo abre. Prueba en la tarea 1.

---

### Task 1: contenido y reglas de los agentes en `office.js`

**Files:**
- Modify: `src/content/office.js` (`agents`, `chat.welcome`, `chat.noMatch`, `chat.visitors`, `chat.leadRx`, `chat.topics`)
- Create: `src/content/office.test.js`
- Modify: `package.json` (el script `test` agrega `"src/content/*.test.js"`)

**Interfaces:**
- Produces: `agents[id].rules: string[]` (entre 3 y 5 frases por agente) y `agents[id].topic` con los textos exactos de la spec:
  - recepción: "quién es Augusto y cómo dejarle un recado";
  - arquitecto: "qué es cada proyecto y qué logra";
  - stack: "cómo está construido cada proyecto".
- Produces: un campo opcional en cada tema, `unless?: RegExp`. Si calza con la pregunta normalizada, el tema no aplica. Sirve para que "¿Cómo está hecho Inkvibe?" no active el tema de arquitecto.

**Contenido (redactar desde `docs/sensible/perfil-augusto.md`):**
- **recepción:** quién es (estudia Ingeniería Civil Informática en la USS, 4.º año, Santiago, rumbo a AI Engineer); cómo trabaja; experiencia en organizaciones (NPS, reclamos, foco en el usuario); trayectoria ("trabajó como desarrollador frontend en Inkvibe"); disponibilidad (toma los datos para conversar sobre una oportunidad); saludo; gracias; "qué es esta oficina" (describe los tres papeles nuevos).
- **arquitecto:** qué es y qué logra cada uno de Rumbo a Casa, Inkvibe (4 superficies, InkCard como mayor canal de tráfico), Zam, Lexinova y el portafolio; más un resumen general de proyectos.
- **stack:** cómo se implementó cada uno de esos cinco; un resumen general amarrado a proyectos; IA y Python (excepción); AWS (Rumbo a Casa y el portafolio). Se saca Docker.
- `welcome`, `noMatch` y el `reply` de "Soy colega" describen los tres papeles. Las `sugs`:
  - reclutador: "¿Quién es Augusto?", "¿Qué ha construido?" y "¿Cómo lo contacto?";
  - colega: "¿Cómo está hecho Zam?", "¿Cómo está hecho Inkvibe?" y "¿Qué hizo en la hackathon de AWS?";
  - el resto, a criterio del implementador, pero ninguna pregunta por tecnologías sueltas.
- `leadRx` pierde `practica|pasant|internship`.
- **Saludos y agradecimientos por agente:** salen de `chat.topics` y pasan a `chat.small = { greetRx, thanksRx, greet: { recepcion, arquitecto, stack }, thanks: { recepcion, arquitecto, stack } }`. Cada texto va con la voz de su agente y una frase de su territorio. Se mantienen las expresiones actuales de saludo y gracias.

- [ ] **Step 1: escribir las pruebas de contenido que fallan, en `src/content/office.test.js`**

```js
test('topics de cada agente coinciden con la spec', () => {
  assert.equal(agents.recepcion.topic, 'quién es Augusto y cómo dejarle un recado');
  assert.equal(agents.arquitecto.topic, 'qué es cada proyecto y qué logra');
  assert.equal(agents.stack.topic, 'cómo está construido cada proyecto');
  for (const a of Object.values(agents)) assert.ok(Array.isArray(a.rules) && a.rules.length >= 3);
});
const TEC = /react|next|nest|typescript|postgres|prisma|supabase|lambda|bedrock|cloudfront|dynamo|firebase|tailwind|cloudflare|railway|expo|python/i;
const PROY = /rumbo|zam\b|lexinova|portafolio/i; // Inkvibe se permite una vez en recepción
test('recepción no habla de proyectos ni tecnologías', () => {
  for (const t of chat.topics.filter((t) => t.agent === 'recepcion')) {
    assert.doesNotMatch(t.text, TEC); assert.doesNotMatch(t.text, PROY);
  }
});
test('arquitecto no nombra tecnologías', () => {
  for (const t of chat.topics.filter((t) => t.agent === 'arquitecto')) assert.doesNotMatch(t.text, TEC);
});
test('stack siempre nombra un proyecto, salvo Python para IA', () => {
  for (const t of chat.topics.filter((t) => t.agent === 'stack' && !/python/i.test(t.text)))
    assert.match(t.text, /rumbo|inkvibe|zam|lexinova|portafolio/i);
});
test('ningún texto habla de prácticas ni filtra datos personales', () => {
  const todo = JSON.stringify({ agents, chat }, (k, v) => (v instanceof RegExp ? undefined : typeof v === 'function' ? v({ name: 'x', topic: 'y' }) : v));
  assert.doesNotMatch(todo, /pr[aá]ctica|pasant/i);
  assert.doesNotMatch(todo, /\+?56\s?9|\b\d{8,9}\b|san miguel|@(?!.*leadEmail)[a-z]+\.(com|cl)/i);
});
test('nombres de organizaciones del perfil local no aparecen', (t) => {
  // Lee la línea de docs/sensible/perfil-augusto.md que empieza con "Organizaciones que no se nombran:"; si no existe el archivo, t.skip().
});
test('leadRx: disponibilidad sí, práctica no', () => {
  assert.ok(chat.leadRx.test('esta disponible'));
  assert.ok(!chat.leadRx.test('hizo una practica'));
});
```

- [ ] **Step 2: agregar a `docs/sensible/perfil-augusto.md`, en "Reglas de uso", la línea `Organizaciones que no se nombran: …` (la lista vive solo en el perfil) y completar la prueba de la organización con ese formato (separadas por coma, comparación sin tildes ni mayúsculas)**

- [ ] **Step 3: correr `node --test src/content/office.test.js`.** Expected: FAIL (`topic`, `rules`, textos de recepción).

- [ ] **Step 4: reescribir `agents`, `chat.topics`, `welcome`, `noMatch`, `visitors` y `leadRx` en `src/content/office.js` según el contenido de arriba. Agregar el script de pruebas en `package.json`.**

- [ ] **Step 5: correr `node --test src/content/office.test.js`.** Expected: PASS. (`officeChat.test.js` puede fallar hasta la tarea 2.)

- [ ] **Step 6: commit**

```bash
git add src/content/office.js src/content/office.test.js package.json
git commit -m "feat: territorios y reglas por agente en el contenido de la oficina"
```

### Task 2: chat de reglas con territorios y encadenamiento

**Files:**
- Modify: `src/lib/officeChat.js` (`answer`)
- Modify: `src/lib/officeChat.test.js`

**Interfaces:**
- Consumes: `chat.topics[i].unless` de la tarea 1.
- Produces: `answer(question, { topics, agents, small, to, from, noMatch, noMatchHanded, handoff, handoffMore, handoffUnknown }) → { agent, text, handoff? }[]` (como máximo 4). `small` es opcional; sin `small`, el comportamiento es el de hoy.
- **Antes que los temas:** si la pregunta calza con `small.greetRx` o `small.thanksRx`, responde el agente pedido (`to || from`, o recepción si no hay) con su `greet` o `thanks`, en una sola respuesta, sin derivación ni encadenamiento.

**Comportamiento nuevo:**
- `hits` descarta los temas cuyo `unless` calza.
- Quién responde primero:
  1. el tema del agente pedido (`to || from`);
  2. si no hay, el de arquitecto cuando también calza uno de stack;
  3. si no, `hits[0]`.
- El encadenamiento (`handoffMore`) se mantiene: un solo agente extra, el primer tema de otro agente.
- **Excepción:** si hubo derivación (el pedido no tenía tema), no se encadena de vuelta al agente pedido.

- [ ] **Step 1: ajustar las pruebas existentes a los textos nuevos y agregar casos**

```js
test('recepción deriva "¿qué ha hecho Augusto?" a arquitecto', () => {
  const out = answer('¿Qué ha hecho Augusto?', { ...opts('recepcion'), handoff: chat.handoff });
  assert.deepEqual(out.map((r) => r.agent), ['recepcion', 'arquitecto']);
});
test('"¿Qué es Inkvibe?" solo arquitecto', () => {
  assert.deepEqual(answer('¿Qué es Inkvibe?', opts()).map((r) => r.agent), ['arquitecto']);
});
test('"¿Cómo está hecho Inkvibe?" solo stack, también en mayúsculas', () => {
  for (const q of ['¿Cómo está hecho Inkvibe?', '¿CÓMO ESTÁ HECHO INKVIBE?'])
    assert.deepEqual(answer(q, opts()).map((r) => r.agent), ['stack']);
});
test('"¿Qué sabe de React?" lo responde stack nombrando Inkvibe', () => {
  const out = answer('¿Qué sabe de React?', opts());
  assert.equal(out[0].agent, 'stack'); assert.match(out[0].text, /Inkvibe/);
});
test('dos territorios sin agente: arquitecto, aviso, stack', () => {
  const out = answer('¿Qué es Inkvibe y cómo está hecho?', { ...opts(), handoffMore: chat.handoffMore });
  assert.deepEqual(out.map((r) => r.agent), ['arquitecto', 'arquitecto', 'stack']);
  assert.equal(out[1].handoff, true);
});
test('cada agente responde su propio saludo y agradecimiento, sin derivar', () => {
  for (const id of ['recepcion', 'arquitecto', 'stack']) {
    for (const [q, key] of [['HOLA', 'greet'], ['gracias!', 'thanks']]) {
      const out = answer(q, { ...opts(id), small: chat.small, handoff: chat.handoff });
      assert.deepEqual(out, [{ agent: id, text: chat.small[key][id] }]);
    }
  }
  assert.equal(answer('hola', { ...opts(), small: chat.small })[0].agent, 'recepcion');
});
test('a stack le preguntan qué es Zam: deriva y no vuelve a stack', () => {
  const out = answer('¿Qué es Zam?', { ...opts('stack'), handoff: chat.handoff, handoffMore: chat.handoffMore });
  assert.deepEqual(out.map((r) => r.agent), ['stack', 'arquitecto']);
});
```

- [ ] **Step 2: correr `node --test src/lib/officeChat.test.js`.** Expected: FAIL en la prioridad de arquitecto y en el "no vuelve a stack".

- [ ] **Step 3: implementar en `answer()` el filtro `unless`, la prioridad y la excepción sin vuelta atrás.**

- [ ] **Step 4: correr `npm test`.** Expected: PASS en `src/lib`, `src/content` y `scripts`. `nucleo.test.mjs` puede fallar hasta la tarea 3 si depende del `contenido.json` viejo.

- [ ] **Step 5: commit** `feat: el chat de reglas respeta los territorios de cada agente`.

### Task 3: prompt con reglas por agente y encadenamiento en la Lambda

**Files:**
- Modify: `scripts/chat-agentes-contenido.mjs` (`construirContenido`)
- Modify: `scripts/chat-agentes-contenido.test.mjs`
- Modify: `infra/lambda/nucleo.mjs` (`armarSistema`, `interpretarRespuesta`, `crearHandler`)
- Modify: `infra/lambda/nucleo.test.mjs`
- Modify: `infra/lambda/chat-agentes.mjs` (`maxTokens` 300 → 500, para que entren dos partes)
- Regenerate: `infra/lambda/contenido.json`

**Interfaces:**
- Produces: `contenido.agentes[id].reglas: string[]` y `contenido.derivarMas[id] = chat.handoffMore(agents[id])`.
- Produces: `armarSistema(contenido, pedido = null) → string`.
  - Agrega la sección "Reglas de cada agente:" con las `reglas` de cada uno.
  - Agrega las reglas de territorio de la spec.
  - Si hay `pedido`: "El visitante le está hablando a <name>."
  - La regla "Los saludos y agradecimientos los responde el agente al que le hablan, sin derivar; sin agente elegido, recepción". Se prueba con `assert.match(s, /saludos y agradecimientos/i)`.
  - El formato JSON pasa a `{"agente":"<id>","sabe":true|false,"texto":"…","sigue":{"agente":"<id>","texto":"…"}}`, donde `sigue` es opcional y solo va si la pregunta toca dos territorios.
- Produces: `interpretarRespuesta(texto, { pedido, contenido })`. Con un `sigue` válido (agente distinto de `obj.agente`, texto no vacío y `sabe` distinto de `false`) agrega `{agent: obj.agente, handoff: true, text: contenido.derivarMas[sigue.agente]}` y `{agent: sigue.agente, text}` después de la respuesta principal. Recorta a 4 respuestas como máximo.
- `crearHandler` pasa `p.agente` a `armarSistema`.

- [ ] **Step 1: escribir las pruebas que fallan**

```js
// chat-agentes-contenido.test.mjs
assert.deepEqual(c.agentes.stack.reglas, agents.stack.rules);
assert.equal(c.derivarMas.stack, chat.handoffMore(agents.stack));
// nucleo.test.mjs
test('armarSistema incluye las reglas de cada agente y el agente pedido', () => {
  const s = armarSistema(contenido, 'stack');
  for (const r of contenido.agentes.recepcion.reglas) assert.ok(s.includes(r));
  assert.match(s, /le está hablando a stack/);
  assert.match(s, /"sigue"/);
});
test('sigue encadena con aviso', () => {
  const r = interpretarRespuesta('{"agente":"arquitecto","texto":"Inkvibe es…","sigue":{"agente":"stack","texto":"Está hecho con Next.js."}}', { pedido: null, contenido });
  assert.deepEqual(r.map((x) => [x.agent, !!x.handoff]), [['arquitecto', false], ['arquitecto', true], ['stack', false]]);
  assert.equal(r[1].text, contenido.derivarMas.stack);
});
test('sigue inválido, del mismo agente o con sabe:false se descarta', () => {
  for (const s of ['{"agente":"stack","texto":""}', '{"agente":"arquitecto","texto":"x"}', '"x"'])
    assert.equal(interpretarRespuesta(`{"agente":"arquitecto","texto":"Hola.","sigue":${s}}`, { pedido: null, contenido }).length, 1);
  assert.equal(interpretarRespuesta('{"agente":"recepcion","sabe":false,"texto":"No lo sé.","sigue":{"agente":"stack","texto":"x"}}', { pedido: null, contenido }).length, 1);
});
```

- [ ] **Step 2: correr `npm test`.** Expected: FAIL en estas pruebas nuevas.

- [ ] **Step 3: implementar `construirContenido`, `armarSistema(contenido, pedido)`, `interpretarRespuesta` con `sigue`, el paso de `p.agente` en `crearHandler` y `maxTokens: 500`.**

- [ ] **Step 4: correr `node scripts/chat-agentes-contenido.mjs` y después `npm test`.** Expected: `Escrito …contenido.json` y todas las pruebas en PASS.

- [ ] **Step 5: commit** `feat: prompt de chat-agentes con reglas por agente y encadenamiento`, que incluye `infra/lambda/contenido.json`.

### Task 4: el recado no atrapa la conversación

Arregla lo de la captura del 6 nov 2026: "HOLA" quedó guardado como nombre, "hola" como necesidad y "al mio" como intento de correo, todo con stack de por medio. Detalle en la sección "Recado" de la spec.

**Files:**
- Modify: `src/lib/officeChat.js` (función pura nueva `leadNext`)
- Modify: `src/lib/officeChat.test.js`
- Modify: `src/hooks/useOfficeChat.js` (`send`, `leadInput`, `startLead`, la selección de agente y `toRecep`)
- Modify: `src/content/office.js` (`chat.lead`: textos nuevos)

**Interfaces:**
- Produces: `leadNext(lead, text, { isQuestion }) → { lead, say }`.
  - `lead`: `{ step: 'name'|'need'|'email'|'confirm'|'sent', name?, need?, email?, tries? }`.
  - `say`: `'need'|'email'|'review'|'badName'|'badNeed'|'badEmail'|'badEmailCancel'|'exit'`.
  - `'exit'` significa que el texto no es un dato del recado: el hook deja el recado en pausa y responde el texto con `answer` o la IA.
- Produces: `isQuestion(text, topics) → boolean`. Es `true` si el texto trae "?", empieza con una palabra interrogativa (qué, cómo, quién, cuál, dónde, cuándo, por qué) o calza con algún tema.
- Produces, en `chat.lead`:
  - `badName: 'Para el recado necesito tu nombre. ¿Cómo te llamas?'`
  - `badNeed: 'Cuéntame en una o dos frases qué necesitas, así Augusto llega preparado.'`
  - `badEmailCancel: 'Ese correo no me cuadra. Revísalo o, si prefieres, usa Cancelar.'`
  - `paused: 'Dejo tu recado en pausa; cuando quieras seguimos.'`
  - `resume: 'Sigamos con tu recado.'`
  - `handoffOpen: 'Tu recado sigue abierto en recepción. Te llevo a su escritorio.'`
- Estado del hook: el recado en pausa se guarda como `lead.paused = true`. `send` solo llama a `leadInput` si hay `lead` sin `paused` y con `step !== 'sent'`. `startLead` retoma desde el paso pendiente, anteponiendo `resume`, si existe un `lead` en pausa.

- [ ] **Step 1: escribir las pruebas que fallan**

```js
const q = { isQuestion: (t) => isQuestion(t, chat.topics) };
test('leadNext rechaza saludos y preguntas como nombre', () => {
  assert.equal(leadNext({ step: 'name' }, 'HOLA', q).say, 'badName');
  assert.equal(leadNext({ step: 'name' }, 'ok', q).say, 'badName');
  assert.equal(leadNext({ step: 'name' }, '¿Qué es Zam?', q).say, 'exit');
});
test('leadNext acepta un nombre y lo capitaliza', () => {
  const r = leadNext({ step: 'name' }, 'ANA MARÍA', q);
  assert.equal(r.say, 'need'); assert.equal(r.lead.name, 'Ana María'); assert.equal(r.lead.step, 'need');
});
test('leadNext pide una necesidad de verdad', () => {
  assert.equal(leadNext({ step: 'need', name: 'Ana' }, 'hola', q).say, 'badNeed');
  assert.equal(leadNext({ step: 'need', name: 'Ana' }, 'Necesito una web para mi tienda', q).say, 'email');
});
test('leadNext: el segundo correo inválido ofrece cancelar', () => {
  const a = leadNext({ step: 'email', name: 'Ana', need: 'x y z' }, 'al mio', q);
  assert.equal(a.say, 'badEmail');
  assert.equal(leadNext(a.lead, 'tampoco', q).say, 'badEmailCancel');
});
test('isQuestion detecta preguntas y temas', () => {
  assert.ok(isQuestion('¿Cómo está hecho Inkvibe?', chat.topics));
  assert.ok(isQuestion('como esta hecho zam', chat.topics));
  assert.ok(!isQuestion('Ana', chat.topics));
});
```

- [ ] **Step 2: correr `node --test src/lib/officeChat.test.js`.** Expected: FAIL (`leadNext is not a function`).

- [ ] **Step 3: implementar `isQuestion` y `leadNext` en `src/lib/officeChat.js`, con las reglas de la spec** (nombre de 2 a 60 letras, necesidad de 3 palabras o más, lista de saludos y cortesías, `tries` para el correo).

- [ ] **Step 4: cablear el hook.**
  - `leadInput` usa `leadNext`. Con `'exit'`, marca `paused`, responde con `answer` o la IA y agrega `chat.lead.paused` al final, dicho por recepción.
  - Al elegir arquitecto o stack (`select`) con un recado activo, se marca `paused`.
  - En `toRecep`, si hay un recado en curso, el aviso es `chat.lead.handoffOpen` en vez de `chat.handoffBack`.

- [ ] **Step 5: correr `npm test`.** Expected: PASS.

- [ ] **Step 6: prueba manual en `npm run dev`, reproduciendo la captura.**
  1. Abrir el recado con "Quiero contactarlo".
  2. Hacer clic en stack.
  3. Escribir "HOLA".

  Expected: **stack responde su propio saludo**, sin aviso de paso a recepción, y el recado queda en pausa sin guardar "HOLA". Después, "Quiero contactarlo" retoma con "Sigamos con tu recado. ¿Cómo te llamas?".

- [ ] **Step 7: commit** `fix: el recado de recepción valida los datos y no atrapa la conversación`.

### Task 5: verificación local, documentación y publicación

**Files:**
- Modify: `docs/sensible/chat-agentes.md` (secciones "Derivación" y "Contenido": reglas por agente, `sigue`, `derivarMas`). Es un archivo local, no se commitea.

- [ ] **Step 1: correr `npm test` y `npm run build`.** Expected: 0 fallas y build sin errores.
- [ ] **Step 2: correr `npm run dev` y, sin `VITE_CHAT_API_URL`, probar en `/oficina/` las 10 preguntas de la spec.** Revisar que haya cero errores en la consola y que la cámara siga a cada agente.
- [ ] **Step 3: actualizar `docs/sensible/chat-agentes.md`.**
- [ ] **Step 4: pedir confirmación a Augusto para (a) `git push origin main` y (b) `bash scripts/desplegar-chat-agentes.sh` con los parámetros del despliegue actual** (en `docs/sensible/chat-agentes.md` y en la memoria `chat-agentes-desplegado`). No hacerlo sin un "sí" explícito.
- [ ] **Step 5: con la confirmación, desplegar la Lambda primero y hacer el push después.** Verificar que el build de Amplify quede en verde.
- [ ] **Step 6: hacer la ronda manual en el sitio publicado.** Incluir 3 intentos de sacar a recepción de su territorio y "¿Qué es Inkvibe y cómo está hecho?" para ver el encadenamiento de la IA. Si algo falla, revertir el commit y volver a desplegar la Lambda anterior.
