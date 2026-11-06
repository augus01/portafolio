# Reglas por agente en la oficina (chat-agentes) — diseño

Fecha: 2026-11-05. Estado: por aprobar.

## Intención

Hoy los tres agentes de `/oficina/` comparten un solo prompt (`armarSistema()` en `infra/lambda/nucleo.mjs`) y hechos que mezclan temas. Recepción enumera proyectos; arquitecto cuenta el stack de Zam y de Inkvibe; stack cuenta qué hace Rumbo a Casa. Para el visitante, los tres suenan igual y la idea de "una oficina con especialistas" se pierde. La función creativa pesa el 30 % de la rúbrica, y que cada agente tenga un papel nítido es lo que la hace memorable.

Augusto quiere que cada agente tenga un territorio estricto, que el visitante decida con quién habla y que todo lo que se diga de él salga de información profesional real.

## Los tres territorios (decididos por Augusto)

| Agente | Habla de | No habla de |
|---|---|---|
| **recepción** | Augusto como persona y profesional: quién es, qué estudia, dónde (Santiago de Chile), su meta (AI Engineer), cómo trabaja, sus habilidades blandas, su experiencia de cara al cliente "en las organizaciones donde se desempeña", disponibilidad. Toma el recado. | Proyectos (ni los enumera) ni tecnologías. "¿Qué ha hecho Augusto?" lo deriva a arquitecto. |
| **arquitecto** | Los proyectos: qué es cada uno, su objetivo, para quién es y qué logra (premios, superficies de producto, alcance, rol de Augusto). | Tecnologías, frameworks, cómo está construido. |
| **stack** | La implementación: cómo se construyó cada proyecto (tecnologías, arquitectura técnica, decisiones, métricas de rendimiento). **Siempre amarrado a un proyecto concreto**: "¿qué sabe de React?" se responde con cómo usó React en Inkvibe, nunca con una lista suelta. | Qué es un proyecto o para qué sirve, más allá de una frase de contexto. Datos personales. |

## Quién habla y cuándo (decidido por Augusto)

- El visitante elige con quién habla. Cada agente responde solo la parte de su territorio.
- Si se le pregunta a un agente algo de otro territorio, ese agente avisa y la cámara viaja al dueño del tema (el mecanismo de `handoff` que ya existe se mantiene).
- **Se mantiene el encadenamiento.** Si una pregunta toca dos territorios ("¿Qué es Inkvibe y cómo está hecho?"), el primer agente responde su parte, anuncia al otro (`handoffMore`: "stack sabe de… y te cuenta el resto"), la cámara viaja y el segundo responde la suya. Cada uno dice solo lo de su territorio.
- **Decisión del diseñador:** el orden del encadenamiento es el natural: primero qué es (arquitecto), después cómo está hecho (stack). Si el visitante le habló a uno de los dos, ese responde primero.
- **Decisión del diseñador:** la IA también encadena, para que el chat de reglas y la IA se comporten igual. El JSON del modelo admite una segunda parte opcional: `{"agente","sabe","texto","sigue":{"agente","texto"}}`. `interpretarRespuesta` intercala el aviso `handoffMore` entre las dos partes y descarta `sigue` si es del mismo agente o si no es válido. Hoy la Lambda no encadena: esto es nuevo.

## Fuente del contenido (decidido por Augusto)

- `docs/sensible/perfil-augusto.md` reúne el CV, LinkedIn (revisado el 5 nov 2026 en el navegador de Augusto) y el "Sobre mí" de `src/content/home.js`. Es la referencia para escribir los hechos. `docs/sensible/` está en `.gitignore`, así que no se publica.
- Reglas de privacidad del contenido:
  - Solo información profesional.
  - Sin teléfono, correo ni comuna (se usa "Santiago de Chile").
  - Sin cursos ni certificaciones.
  - Las experiencias fuera de la informática no se nombran (la lista está solo en `docs/sensible/perfil-augusto.md`). Se dice "en las organizaciones donde se desempeña Augusto…" y se cuenta qué hace y qué logra.
  - Las experiencias de la profesión sí se nombran (Inkvibe, Lexinova, Rumbo a Casa, Zam).
- Tono: el de Augusto en su CV y LinkedIn. Concreto, orientado a logros, con verbos de acción.
- **Decisión del diseñador:** recepción puede decir que Augusto trabajó como desarrollador frontend en Inkvibe (una línea de trayectoria), pero sin detalles del producto.
- **Sin prácticas (decidido por Augusto):** ya terminó sus prácticas. Ningún texto habla de práctica ni de pasantía: ni el rol en Inkvibe, ni la disponibilidad, ni las sugerencias. La sugerencia del reclutador "¿Está disponible para una práctica?" se reemplaza (por ejemplo, "¿Cómo lo contacto?"), y `practica|pasant|internship` sale de `leadRx`.
- **Disponibilidad (decisión del diseñador):** recepción no inventa una situación laboral. Ante "¿está disponible?" responde que, para conversar sobre una oportunidad, toma los datos, y abre el recado como hoy.
- **Python e IA (decidido por Augusto):** es la única excepción a "stack siempre habla de un proyecto concreto". Stack puede decir que Augusto usa Python para IA (scripts, datos y prototipos de agentes) camino a AI Engineer, aunque no haya un proyecto del portafolio que lo muestre. No debe inventar un proyecto en Python. Docker sale de las expresiones, porque no aparece en el perfil.

## Cómo se definen las reglas (cambio de estructura)

Una sola fuente: `src/content/office.js`.

1. **Reglas por agente.** Cada entrada de `agents` gana un campo `rules` (lista de frases en español) con su territorio, lo que no toca y a quién deriva. `topic` se reescribe para que coincida con la tabla:
   - recepción: "quién es Augusto y cómo dejarle un recado";
   - arquitecto: "qué es cada proyecto y qué logra";
   - stack: "cómo está construido cada proyecto".
2. **Hechos divididos por proyecto.** Cada proyecto (Rumbo a Casa, Inkvibe, Zam, Lexinova, este portafolio) tiene dos temas en `chat.topics`:
   - uno de arquitecto, sobre qué es y qué logra;
   - uno de stack, sobre cómo se implementó.

   Ningún texto de arquitecto nombra tecnologías y ningún texto de stack describe el producto más allá de una frase.
3. **Hechos de recepción** (sin proyectos): quién es, cómo trabaja, experiencia en organizaciones, meta y habilidades blandas, más el saludo, el agradecimiento y "¿qué es esta oficina?". Recepción sigue siendo la anfitriona.
4. **Los hechos generales** ("¿qué tecnologías usa?", "¿qué proyectos tiene?") se reescriben según la regla de cada territorio. El de stack resume las tecnologías nombrando en qué proyecto se usó cada grupo.
5. **El orden de `chat.topics` importa** (gana el primero que calza). Las expresiones de stack exigen el nombre del proyecto o de la tecnología más palabras de implementación (`cómo`, `hecho`, `construid`, `armado`, `stack`, `tecnolog`, `arquitectura de`…) y van antes que las de arquitecto. El nombre del proyecto solo va a arquitecto.
6. **Textos de bienvenida que hoy contradicen los territorios** se ajustan:
   - `welcome` y el `reply` del visitante "Soy colega" ("arquitecto cómo lo arma") pasan a describir los tres papeles nuevos;
   - las sugerencias como "¿Qué stack usa?" se amarran a un proyecto (por ejemplo, "¿Cómo está hecho Inkvibe?").

## Cambios en el prompt de la Lambda

- `scripts/chat-agentes-contenido.mjs` exporta `rules` de cada agente a `infra/lambda/contenido.json`.
- `armarSistema()` agrega una sección "Reglas de cada agente" con las `rules` de cada uno. Las reglas generales actuales se mantienen, más estas:
  - "Responde solo con hechos del territorio del agente elegido";
  - "Si la pregunta toca dos territorios, la primera parte la responde un agente y la segunda (`sigue`) el otro, cada uno solo con lo suyo";
  - "Recepción nunca nombra proyectos ni tecnologías";
  - "Stack siempre habla de cómo se implementó algo en un proyecto concreto".
- Se mantienen el contrato JSON (`agente`, `sabe`, `texto`) y la derivación; se agrega `sigue`, opcional, para el encadenamiento. `construirContenido` exporta también el texto de `handoffMore` por agente (`derivarMas`).

## Restricciones

- El chat de reglas (`answer()`) sigue siendo el respaldo y debe cumplir los mismos territorios sin la IA.
- Sin `VITE_CHAT_API_URL` el sitio funciona igual.
- Contenido en español de Chile, sin emojis y con un máximo de 3 frases por respuesta (regla actual).
- **El despliegue de la Lambda (nuevo `contenido.json` y `nucleo.mjs`) es un cambio en AWS: se confirma con Augusto antes de hacerlo.** El costo debería quedar casi igual: el prompt crece unos cientos de tokens por mensaje, bajo el tope de USD 10 al mes.
- Se actualiza `docs/sensible/chat-agentes.md` (sección de derivación y contenido) para que describa las reglas por agente.

## No es objetivo

- Cambiar la cámara, la escena 3D o la interfaz del chat.
- El envío real del recado (Lambda + SES) ni definir `leadEmail`.
- Cambiar el modelo, los presupuestos ni la infraestructura.

## Anti-objetivos (fracaso aunque funcione)

- Recepción enumera proyectos o nombra una empresa ajena a la informática.
- Aparece un dato personal (teléfono, correo, comuna, cursos).
- Stack responde una lista de tecnologías sin decir dónde las usó.
- Un agente encadenado repite lo que dijo el otro o se sale de su territorio.
- El modelo inventa logros que no están en los hechos.

## Cómo se verifica

- Las pruebas de `src/lib/officeChat.test.js` y `infra/lambda/nucleo.test.mjs` se actualizan.
  - Las pruebas actuales del encadenamiento ("dos temas de agentes distintos se completan" y la de la hackathon) se mantienen y se ajustan a los textos nuevos.
  - Se agregan casos:
    - "¿Qué ha hecho Augusto?" a recepción deriva a arquitecto;
    - "¿Qué es Inkvibe?" lo responde arquitecto, sin tecnologías;
    - "¿Cómo está hecho Inkvibe?" lo responde stack;
    - "¿Qué sabe de React?" lo responde stack, nombrando Inkvibe;
    - "¿Qué es Inkvibe y cómo está hecho?" responde arquitecto, luego el aviso y luego stack;
    - en `nucleo.test.mjs`, una respuesta con `sigue` produce las tres partes, y un `sigue` inválido o del mismo agente se descarta.
  - Una prueba recorre todos los textos de `office.js` y falla si aparece un nombre de la lista de organizaciones prohibidas, el teléfono o el correo.
- Para la IA: tras el despliegue (con confirmación), una ronda manual de unas 10 preguntas en `/oficina/`, una por caso de arriba más intentos de sacar a recepción de su territorio.

## Decisiones del diseñador tras la revisión

- **Prueba anti-filtración sin publicar los nombres.** La prueba de `office.js` busca patrones genéricos: teléfono chileno (`+56 9`, `9 dígitos`), cualquier correo salvo el de `leadEmail` y "San Miguel". La lista de organizaciones prohibidas vive solo en `docs/sensible/perfil-augusto.md` (fuera del repo). Si el archivo existe, la prueba lo lee y busca esos nombres; si no existe, como en un clon limpio, esa parte se salta.
- **El agente elegido llega al prompt.** `armarMensajes` o `armarSistema` le dicen al modelo a qué agente le habló el visitante (`pedido`), para que pueda aplicar la regla de territorio.
- **Pregunta de dos territorios sin agente elegido** ("¿Qué es Inkvibe y cómo está hecho?"): arquitecto responde primero y encadena a stack.
- **Publicación en un solo tiempo.** El frontend (push a `main`, que despliega Amplify) y la Lambda (nuevo `contenido.json` y `nucleo.mjs`) salen juntos, para que el chat de reglas y la IA nunca tengan territorios distintos. Las dos acciones se confirman con Augusto en ese momento. Si algo falla, se revierte el commit y se vuelve a desplegar la Lambda anterior.

## Recado: problemas encontrados por Augusto (6 nov 2026)

En una conversación real el recado quedó abierto: el visitante saludó a stack ("HOLA"), stack lo mandó a recepción con "De eso se encarga recepción" y recepción guardó "HOLA" como nombre, "hola" como necesidad y siguió pidiendo el correo ante "al mio". Las causas, en `useOfficeChat.js`:

1. **El recado atrapa todo.** Mientras `lead.step` no es `sent`, cualquier texto va a `leadInput`, aunque el visitante haya elegido otro agente o esté haciendo una pregunta.
2. **No hay validación del nombre:** un saludo, una pregunta o una palabra suelta en mayúsculas se aceptan como nombre.
3. **No hay validación de la necesidad:** "hola" se acepta.
4. **El aviso de paso confunde:** stack dice "De eso se encarga recepción" ante un saludo, sin explicar que hay un recado en curso.
5. **El correo inválido no tiene salida:** se repite "Ese correo no me cuadra" sin recordar que se puede cancelar.

**El problema principal (señalado por Augusto): stack no aceptó el saludo.** El saludo y el agradecimiento son temas de recepción, así que un "hola" dicho a stack se deriva a recepción como si fuera una pregunta de otro territorio. Regla nueva (decidida por Augusto):
- **Los saludos y agradecimientos los responde el agente al que se le habla**, con su propia voz, y nunca derivan. Cada agente tiene su saludo ("¡Hola! Soy stack. Pregúntame cómo está hecho un proyecto de Augusto.") y su agradecimiento.
- Recepción responde los saludos solo cuando no hay agente elegido.
- La misma regla va en el prompt de la IA: "Los saludos y agradecimientos los responde el agente al que le hablan, sin derivar".

Comportamiento esperado (decisiones del diseñador):
- **Salir del recado:** si durante el recado el visitante elige otro agente o escribe algo que es una pregunta o calza con un tema, el recado queda en pausa. Recepción no responde como si fuera un dato y la pregunta se contesta normalmente. Los datos ya dados se guardan. Si después pide contacto otra vez, recepción retoma en el paso pendiente ("Sigamos con tu recado. …").
- **Nombre válido:** de 2 a 60 letras (con espacios, tildes, guion o apóstrofo), sin "?" y que no sea un saludo ni una palabra de la lista de saludos o cortesías (hola, buenas, hey, gracias, ok, sí, no). Si no es válido: "Para el recado necesito tu nombre. ¿Cómo te llamas?". Un nombre en mayúsculas se guarda con la primera letra de cada palabra en mayúscula.
- **Necesidad válida:** al menos 3 palabras y que no sea un saludo. Si no: "Cuéntame en una o dos frases qué necesitas, así Augusto llega preparado."
- **Correo inválido:** a partir del segundo intento, el texto agrega "Si prefieres, usa Cancelar".
- **Aviso de paso con recado en curso:** si el recado está en curso y el visitante está con arquitecto o stack, el aviso es "Tu recado sigue abierto en recepción. Te llevo a su escritorio." y no "De eso se encarga recepción".

## Lo que queda al criterio del implementador

- La redacción exacta de cada hecho y de cada regla, siguiendo `docs/sensible/perfil-augusto.md` y el tono de Augusto.
- Las expresiones regulares y su orden.
- Cómo nombrar el campo de reglas en `contenido.json` (consistente con el español del resto: `reglas`).
