// Frena el CPU de las pestañas de un Chrome abierto con --remote-debugging-port (lo usa chrome-bajo-recursos.ps1).
// Uso: node scripts/chrome-freno-cpu.mjs <puerto> <veces>. Se queda conectado mientras Chrome siga abierto: al
// desconectarse, Chrome vuelve a la velocidad normal. También frena las pestañas que se abran después.
const [port, rateArg] = process.argv.slice(2);
const rate = Number(rateArg) || 1;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const base = `http://127.0.0.1:${port}`;

let browserUrl = null;
for (let i = 0; i < 80 && !browserUrl; i++) {
  try { browserUrl = (await (await fetch(`${base}/json/version`)).json()).webSocketDebuggerUrl; } catch { await sleep(250); }
}
if (!browserUrl) { console.error('No encontré el Chrome de prueba.'); process.exit(1); }

const ws = new WebSocket(browserUrl);
let id = 0;
const send = (method, params = {}, sessionId) => ws.send(JSON.stringify({ id: ++id, method, params, ...(sessionId ? { sessionId } : {}) }));
ws.addEventListener('open', () => {
  // Avisa de cada pestaña (las que hay y las nuevas); a cada una se engancha una vez y le aplica el freno.
  send('Target.setDiscoverTargets', { discover: true });
});
const seen = new Set();
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.method === 'Target.targetCreated' && m.params.targetInfo.type === 'page' && !seen.has(m.params.targetInfo.targetId)) {
    seen.add(m.params.targetInfo.targetId);
    send('Target.attachToTarget', { targetId: m.params.targetInfo.targetId, flatten: true });
  }
  if (m.method === 'Target.attachedToTarget' && m.params.targetInfo.type === 'page') {
    send('Emulation.setCPUThrottlingRate', { rate }, m.params.sessionId);
    console.log(`CPU ${rate}x más lento en: ${m.params.targetInfo.url || 'pestaña nueva'}`);
  }
});
ws.addEventListener('close', () => process.exit(0));
ws.addEventListener('error', () => process.exit(0));
