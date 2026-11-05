// Genera infra/lambda/contenido.json desde src/content/office.js (única fuente de verdad del contenido).
import { writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

export function construirContenido({ agents, chat }) {
  const agentes = {};
  const derivar = {};
  for (const [id, a] of Object.entries(agents)) {
    agentes[id] = { name: a.name, topic: a.topic, intro: a.intro };
    derivar[id] = chat.handoff(a);
  }
  return {
    agentes,
    temas: chat.topics.map(({ agent, text }) => ({ agent, text })),
    derivar,
    derivarDesconocido: chat.handoffUnknown,
    sinRespuesta: chat.noMatch,
  };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { agents, chat } = await import('../src/content/office.js');
  const destino = fileURLToPath(new URL('../infra/lambda/contenido.json', import.meta.url));
  writeFileSync(destino, JSON.stringify(construirContenido({ agents, chat }), null, 2) + '\n');
  console.log(`Escrito ${destino}`);
}
