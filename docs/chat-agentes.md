# chat-agentes: cómo funciona el chat de la oficina

Los tres agentes de `/oficina/` (recepción, arquitecto y stack) responden con Claude Haiku 4.5 en Amazon Bedrock. El gasto está acotado a USD 10 al mes. Si la IA falla o se llega al tope, responde el chat de reglas de siempre (`src/lib/officeChat.js`) y la página nunca se rompe.

**Estado (2026-11-05):** el código y la plantilla están escritos y probados localmente (`npm test`). **El stack todavía no está desplegado.** Faltan las Tasks 0, 4 (despliegue y curl), 6 y 7 del plan `docs/superpowers/plans/2026-11-05-chat-agentes.md`.

## Recorrido de un mensaje

```
Visitante en /oficina/ (Amplify d21d1ifzfdin9a)
  │ useOfficeChat.send → pedirRespuesta (timeout 8 s)
  │ POST /chat  { mensaje, agente, historial }
  ▼
API Gateway HTTP API "chat-agentes"   throttling 2/s, ráfaga 5 · CORS solo para el sitio y localhost
  ▼
Lambda "chat-agentes" (Node 22, 10 s, concurrencia 2)
  1. valida (mensaje ≤ 500, agente válido, historial ≤ 6)   → 400 si falla, sin gastar
  2. lee el gasto del mes en DynamoDB "chat-agentes-gasto"  → respaldo si ≥ USD 8
  3. llama a Bedrock (perfil "chat-agentes-haiku", maxTokens 300)
  4. suma el costo real de la respuesta al contador
  5. arma la secuencia de respuestas, con derivaciones
  ▼
{ replies: [{ agent, text, handoff? }] }  o  { respaldo: true, motivo }
  ▼
Sitio: con replies anima globos y cámara (bubbles); con null usa answer() local
```

## Contrato de la API

- **Petición:** `POST /chat` con `{ "mensaje": string, "agente": "recepcion"|"arquitecto"|"stack"|null, "historial": [{ "quien": "visitor"|<agente>, "texto": string }] }`.
- **Respuestas:**

| Caso | Código | Cuerpo |
|---|---|---|
| Respuesta normal | 200 | `{ replies: [...] }` (1 a 4 elementos, misma forma que `answer()`) |
| Petición inválida | 400 | `{ error: "peticion-invalida" }` |
| Se llegó al tope de USD 8 | 200 | `{ respaldo: true, motivo: "tope" }` |
| Bedrock o DynamoDB fallaron | 200 | `{ respaldo: true, motivo: "error" }` |
| El modelo no devolvió JSON válido | 200 | `{ respaldo: true, motivo: "formato" }` |
| Ráfaga sobre el throttling | 429 | La devuelve API Gateway |

Los cortes devuelven 200 para que la consola del navegador quede limpia.

## Derivación entre agentes

El modelo responde `{ agente, sabe, texto }`. `agente` es quien sabe del tema, aunque la pregunta se la hayan hecho a otro. La Lambda arma la secuencia con los mismos textos del chat de reglas (`src/content/office.js`):

| Caso | Secuencia de `replies` |
|---|---|
| El agente pedido sabe | Él responde |
| Otro agente sabe | Aviso del agente pedido (`chat.handoff`, `handoff: true`), luego responde el otro |
| Nadie sabe (`sabe: false`) | Aviso del agente pedido (`chat.handoffUnknown`), luego recepción dice "no lo sé" y ofrece el recado |

`bubbles()` del hook anima la secuencia: la cámara viaja de un agente a otro. El recado sigue local, sin SES.

## Archivos

| Archivo | Qué hace |
|---|---|
| `src/content/office.js` | Única fuente de los agentes, temas y frases de derivación |
| `scripts/chat-agentes-contenido.mjs` | Genera `infra/lambda/contenido.json` desde `office.js` (correr tras cambiar `office.js`; el script de despliegue lo hace solo) |
| `infra/lambda/nucleo.mjs` | Lógica pura con tests: validación, costo, system prompt, mensajes, derivación y `crearHandler` (contador y respaldo) |
| `infra/lambda/chat-agentes.mjs` | Handler real: conecta el núcleo con Bedrock (Converse) y DynamoDB, sin lógica propia |
| `infra/chat-agentes.yaml` | Plantilla de CloudFormation de toda la infraestructura |
| `scripts/desplegar-chat-agentes.sh` | Genera el contenido, sube el código a S3 y despliega el stack con las etiquetas |
| `src/lib/chatAgentesApi.js` | Cliente del sitio: `historialParaApi` y `pedirRespuesta` (nunca lanza; devuelve `null` ante cualquier fallo) |
| `src/hooks/useOfficeChat.js` | `send` usa la API si existe `VITE_CHAT_API_URL`; si no, o si devuelve `null`, usa `answer()` |

Tests: `npm test` (incluye `infra/lambda/*.test.mjs`, `scripts/*.test.mjs` y `src/lib/*.test.js`).

## Infraestructura (`infra/chat-agentes.yaml`)

Región `us-east-1`, cuenta `810249680029`, stack `chat-agentes`.

| Recurso | Nombre | Para qué |
|---|---|---|
| API Gateway HTTP API | `chat-agentes` | Ruta `POST /chat`, CORS, throttling |
| Lambda | `chat-agentes` | Valida, cuenta el gasto y llama a Bedrock |
| Perfil de inferencia de Bedrock | `chat-agentes-haiku` | Alias etiquetado de `us.anthropic.claude-haiku-4-5-20251001-v1:0`; reparte entre us-east-1, us-east-2 y us-west-2 |
| DynamoDB | `chat-agentes-gasto` | Clave `mes` (`AAAA-MM`, UTC), atributo `microUsd` |
| Rol IAM | `chat-agentes-lambda` | Solo `bedrock:InvokeModel` sobre Haiku y Get/Update en la tabla |
| Política IAM | `chat-agentes-freno` | Deniega Bedrock; la adjunta el budget al 100 % |
| Rol IAM | `BudgetActionRole` | Permite a Budgets adjuntar o quitar el freno solo en `chat-agentes-lambda` |
| Budget y acción | `chat-agentes` | USD 10 al mes |
| CloudWatch Logs | `/aws/lambda/chat-agentes` | Retención de 7 días |
| S3 | `chat-agentes-despliegue-810249680029` | Código empaquetado para el despliegue, sin acceso público |

**Parámetros:** `TopeUsd` (8), `LimiteBudgetUsd` (10), `CorreoAlertas` (`augustojpintob@gmail.com`), `FiltroBudget` (`etiqueta` o `servicio`) y `PerfilSistemaArn`. **Salida:** `ApiUrl`, que va en la variable `VITE_CHAT_API_URL` de la app de Amplify.

**Desplegar:** `bash scripts/desplegar-chat-agentes.sh PerfilSistemaArn=<arn> FiltroBudget=<etiqueta|servicio> TopeUsd=8`. Crea recursos con costo: se confirma con el usuario antes.

## Costos y presupuestos

### Capas de defensa

| Capa | Mecanismo | Corta en |
|---|---|---|
| Por petición | Mensaje ≤ 500, historial ≤ 6, `maxTokens` 300 | Cada mensaje tiene un costo máximo |
| Tráfico | Throttling 2/s con ráfaga 5, concurrencia 2 | Ráfagas (429) |
| Contador interno | Costo real por respuesta en `chat-agentes-gasto` | **USD 8, al instante** |
| Budget con acción | `chat-agentes` adjunta `chat-agentes-freno` al rol | USD 10, con horas de retraso |
| Manual | `aws lambda put-function-concurrency --function-name chat-agentes --reserved-concurrent-executions 0` (volver a `2` para reactivar) | Segundos |

El contador corta antes que el budget porque Budgets actualiza sus datos pocas veces al día.

### Etiquetas

| Etiqueta | Dónde |
|---|---|
| `project=portafolio` | Todo el portfolio: la app de Amplify y el stack completo |
| `componente=chat-agentes` | Solo los recursos del chat (se ponen con `--tags` al desplegar) |

Los budgets filtran por estas etiquetas, que deben estar activadas en Billing → Cost allocation tags. Solo cuenta el gasto posterior a la activación.

### Budgets (todos sin créditos ni reembolsos)

| Budget | Mide | Límite | Avisos | Acción |
|---|---|---|---|---|
| `portafolio` | Toda la cuenta | USD 15 (hoy USD 5; sube en la Task 0) | 85 %, 100 % y pronóstico al 100 % | No |
| `portafolio-total` | `project=portafolio` | USD 12 (se crea en la Task 0) | 50 %, 80 %, 100 % | No |
| `chat-agentes` | `componente=chat-agentes` (o el servicio de Haiku) | USD 10 | 50 % y 90 % | Al 100 %, freno de Bedrock |

Las alertas llegan a `augustojpintob@gmail.com`. El budget `casafy` no se toca.

**Costo esperado:** unos USD 0,003 por mensaje normal, con Haiku a USD 1 y USD 5 por millón de tokens de entrada y salida (precio a confirmar). Eso da unos 2.600 mensajes antes del corte. Con uso normal cuesta centavos, cubiertos por los créditos; con abuso, el máximo es de unos USD 8.

## Qué no protege

CORS no frena scripts, esconder la URL no sirve y nunca hay claves en el JavaScript. No hay límite por IP: alguien podría agotar el tope mensual, pero en ese caso los demás visitantes reciben las respuestas de reglas.

## No tocar

La app de Amplify `ps2-room-portfolio` (`d5w3zjhtyz0vy`), los stacks `PortfolioApi`, `RumboACasa` y `CDKToolkit`, y el budget `casafy`.
