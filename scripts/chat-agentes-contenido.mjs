// Genera infra/lambda/contenido.json ({ es, en }) desde src/content/office.js y src/content/en/office.js (única fuente de verdad del contenido).
import { writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

export function construirContenido({ agents, chat }) {
  const agentes = {};
  const derivar = {};
  const derivarMas = {};
  for (const [id, a] of Object.entries(agents)) {
    agentes[id] = { name: a.name, topic: a.topic, intro: a.intro, reglas: a.rules };
    derivar[id] = chat.handoff(a);
    derivarMas[id] = chat.handoffMore(a);
  }
  return {
    agentes,
    temas: chat.topics.map(({ agent, text }) => ({ agent, text })),
    derivar,
    derivarMas,
    derivarDesconocido: chat.handoffUnknown,
    sinRespuesta: chat.noMatch,
  };
}

// El contenido de la Lambda en los dos idiomas del sitio: { es, en }.
export const construirIdiomas = ({ es, en }) => ({ es: construirContenido(es), en: construirContenido(en) });

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const es = await import('../src/content/office.js');
  const en = await import('../src/content/en/office.js');
  const destino = fileURLToPath(new URL('../infra/lambda/contenido.json', import.meta.url));
  writeFileSync(destino, JSON.stringify(construirIdiomas({ es, en }), null, 2) + '\n');
  console.log(`Escrito ${destino}`);
}
