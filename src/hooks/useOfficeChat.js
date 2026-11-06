import { useCallback, useEffect, useRef, useState } from 'react';
import { answer, bubbleMap, greeting, isConfirm, isQuestion, isSmallTalk, leadMailto, leadNext, wantsContact } from '../lib/officeChat';
import { historialParaApi, pedirRespuesta } from '../lib/chatAgentesApi';

const STORE = 'ap-office-visit';
const TYPING_MS = 550;
// Cuánto se queda la cámara en cada agente cuando responden varios seguidos: el aviso de derivación se lee rápido; una
// respuesta, según su largo. La última respuesta se queda hasta que pase otra cosa.
const HANDOFF_MS = 2200;
const holdFor = (r) => (r.handoff ? HANDOFF_MS : Math.min(9000, Math.max(2600, r.text.length * 45)));

// Recuerda quién visita y su última pregunta (solo en este navegador; sin acceso, la oficina funciona igual).
const readStore = () => { try { return JSON.parse(localStorage.getItem(STORE) || 'null'); } catch (e) { return null; } };
const writeStore = (patch) => { try { localStorage.setItem(STORE, JSON.stringify({ ...(readStore() || {}), ...patch })); } catch (e) { /* sin almacenamiento */ } };

/**
 * Conversación común de la oficina: los tres agentes responden en un solo hilo y recepción toma el recado.
 * `scene` es el control de useOfficeScene (globos y anillo del que habla). Devuelve el estado para la UI y las acciones.
 */
export function useOfficeChat({ chat, agents, scene, leadEmail }) {
  const sceneRef = useRef(scene);
  sceneRef.current = scene;
  const idRef = useRef(0);
  const askedRef = useRef([]);
  const timerRef = useRef(0);
  const seqRef = useRef(0);
  const lastRef = useRef(null);
  const vivoRef = useRef(true);
  const msg = (who, text) => ({ id: ++idRef.current, who, text });

  const [state, setState] = useState(() => {
    const seen = readStore();
    const text = greeting(seen, { welcome: chat.welcome, leadRx: chat.leadRx });
    return {
      msgs: [{ id: ++idRef.current, who: 'recepcion', text }],
      visitor: seen?.visitor || null,
      lead: null,
      to: null,
      draft: '',
      typing: false,
      live: '',
      histOpen: false,
      greet: text,
    };
  });

  // Globos: la cámara se acerca a cada agente que responde, uno tras otro (primero quien deriva, después a quien deriva),
  // con su globo y su anillo. Con `focus: false` no hay zoom ni globo. Aviso completo para lectores de pantalla.
  const bubbles = useCallback((replies, opts) => {
    clearTimeout(seqRef.current);
    const s = sceneRef.current;
    if (opts && opts.focus === false) { s.say(bubbleMap(replies), opts); s.speak(null); return; }
    const play = (i) => {
      const r = replies[i];
      if (!r) return;
      s.say({ [r.agent]: r.text });
      s.speak(r.agent);
      lastRef.current = r.agent;
      if (i < replies.length - 1) seqRef.current = setTimeout(() => play(i + 1), holdFor(r));
    };
    if (!replies.length) { s.say({}); s.speak(null); return; }
    play(0);
    setState((st) => ({ ...st, live: replies.map((r) => `${agents[r.agent].name}: ${r.text}`).join(' ') }));
  }, [agents]);

  // El saludo de recepción aparece en su globo apenas carga la oficina, con la oficina entera a la vista (sin zoom).
  useEffect(() => { bubbles([{ agent: 'recepcion', text: state.greet }], { focus: false }); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    vivoRef.current = true;
    return () => { vivoRef.current = false; clearTimeout(timerRef.current); clearTimeout(seqRef.current); };
  }, []);

  const push = (list, patch) => setState((st) => ({ ...st, msgs: st.msgs.concat(list), ...(patch || {}) }));
  // Aviso de paso a recepción: si estabas con arquitecto o stack (elegido o el último que habló), él lo dice primero y
  // la cámara viaja después. Sin agente previo, o si ya estabas con recepción, no hay aviso.
  // Recado en curso (ni enviado ni en pausa): todo lo que escribes es un dato del recado.
  const leadOpen = (lead) => !!(lead && !lead.paused && lead.step !== 'sent');
  const toRecep = (passText) => {
    const from = state.to || lastRef.current;
    const text = passText || (leadOpen(state.lead) ? chat.lead.handoffOpen : chat.handoffBack);
    return from && from !== 'recepcion' ? [{ agent: from, handoff: true, text }] : [];
  };
  // Cualquier respuesta de recepción pasa por aquí, así ningún cambio a ella es abrupto.
  const recep = (text, patch, passText) => {
    const pass = toRecep(passText);
    push(pass.map((r) => msg(r.agent, r.text)).concat([msg('recepcion', text)]), { ...(patch || {}), ...(pass.length ? { to: null } : {}) });
    if (pass.length) sceneRef.current.select(null);
    bubbles(pass.concat([{ agent: 'recepcion', text }]));
  };

  // Lo que pide recepción en cada paso del recado (para retomarlo donde quedó).
  const stepText = (L) => ({ name: chat.lead.askName, need: chat.lead.need(L.name), email: chat.lead.email, confirm: chat.lead.review }[L.step]);

  const startLead = (after, prev) => {
    // Un recado que quedó en pausa se retoma en el paso pendiente, con lo que ya diste.
    const pending = state.lead && state.lead.step !== 'sent' ? { ...state.lead, paused: false } : null;
    const ask = pending ? `${chat.lead.resume} ${stepText(pending)}` : after ? chat.lead.askAfter : chat.lead.ask;
    // Si estabas con arquitecto o stack, primero te avisa que el recado lo toma recepción y la cámara viaja a ella.
    const pass = toRecep(chat.handoffLead);
    push(pass.map((r) => msg(r.agent, r.text)).concat([msg('recepcion', ask)]), { lead: pending || { step: 'name' }, to: null });
    sceneRef.current.select(null);
    // Si otro agente acaba de responder, su globo va antes y recepción suma el suyo.
    bubbles((prev || []).filter((r) => r.agent !== 'recepcion').concat(pass, [{ agent: 'recepcion', text: ask }]));
  };

  const leadSend = (lead) => {
    const L = { ...lead, step: 'sent' };
    if (leadEmail) {
      window.location.href = leadMailto(leadEmail, chat.lead.subject, L.card);
      recep(chat.lead.sentMail(L.email), { lead: L });
    } else recep(chat.lead.sent(L.email), { lead: L });
  };

  // Un dato del recado. Devuelve false si no lo era (una pregunta): el recado queda en pausa y la pregunta se responde.
  const leadInput = (text, lead) => {
    if (lead.step === 'confirm') {
      if (isConfirm(text)) leadSend(lead);
      else recep(chat.lead.useCard);
      return true;
    }
    const { lead: L, say } = leadNext(lead, text, { isQuestion });
    if (say === 'exit') { setState((st) => ({ ...st, lead: { ...st.lead, paused: true } })); return false; }
    if (say === 'review') {
      const asked = askedRef.current.slice(-3);
      L.card = { name: L.name, need: L.need, email: L.email, topics: asked.length ? asked.join(' · ') : chat.lead.card.none };
    }
    const text2 = { need: chat.lead.need(L.name), email: chat.lead.email, review: chat.lead.review, badName: chat.lead.badName,
      badNeed: chat.lead.badNeed, badEmail: chat.lead.badEmail, badEmailCancel: chat.lead.badEmailCancel }[say];
    recep(text2, { lead: L });
    return true;
  };

  const send = (raw) => {
    const text = String(raw || '').trim();
    if (!text || state.typing) return;
    push([msg('visitor', text)], { draft: '' });
    const lead = state.lead;
    if (leadOpen(lead) && leadInput(text, lead)) return;
    askedRef.current = askedRef.current.concat(text);
    if (wantsContact(text, chat.leadRx)) { startLead(); return; }
    writeStore({ last: text.slice(0, 80) });
    const to = state.to;
    const from = to || lastRef.current;
    setState((st) => ({ ...st, typing: true }));
    clearTimeout(seqRef.current);
    // Mientras piensa, la cámara se queda con el agente al que le hablaste (o el último que habló), con sus puntos.
    sceneRef.current.say(from ? { [from]: '…' } : {});
    const local = () => answer(text, { topics: chat.topics, agents, small: chat.small, to, from, noMatch: chat.noMatch, noMatchHanded: chat.noMatchHanded, handoff: chat.handoff, handoffMore: chat.handoffMore, handoffUnknown: chat.handoffUnknown });
    // Con VITE_CHAT_API_URL pide la respuesta a la IA; si no hay URL o falla (null), responde con las reglas locales.
    // Los saludos y agradecimientos los responde siempre el agente local, con su voz y sin derivar.
    // En todo caso espera al menos TYPING_MS para que los puntos se vean.
    const espera = new Promise((resolve) => { timerRef.current = setTimeout(resolve, TYPING_MS); });
    Promise.all([
      pedirRespuesta({ url: isSmallTalk(text, chat.small) ? null : import.meta.env.VITE_CHAT_API_URL, mensaje: text, agente: to || from || null, historial: historialParaApi(state.msgs) }),
      espera,
    ]).then(([remotas]) => {
      if (!vivoRef.current) return;
      const replies = remotas || local();
      push(replies.map((r) => msg(r.agent, r.text)), { typing: false });
      bubbles(replies);
    });
  };

  const pickVisitor = (v) => {
    if (state.visitor) return;
    writeStore({ visitor: v.id });
    push([msg('visitor', v.label)]);
    recep(v.reply, { visitor: v.id });
  };

  // Chips bajo la caja: quién visita, luego sus preguntas sugeridas; durante el recado, cancelar.
  const inLead = leadOpen(state.lead);
  const vis = chat.visitors.find((v) => v.id === state.visitor);
  let chips = [];
  let chipsLabel = chat.suggestionsLabel;
  if (inLead) { chips = [{ label: chat.lead.cancel, pick: () => recep(chat.lead.cancelled, { lead: null }) }]; chipsLabel = chat.leadOptionsLabel; }
  else if (!vis) { chips = chat.visitors.map((v) => ({ label: v.label, pick: () => pickVisitor(v) })); chipsLabel = chat.visitorsLabel; }
  else chips = vis.sugs.map((q) => ({ label: q, pick: () => send(q) }));

  // Esc o soltar al agente: corta la secuencia de respuestas y vuelve a la vista general, sin globo.
  function unfocus() {
    clearTimeout(seqRef.current);
    lastRef.current = null;
    sceneRef.current.speak(null);
    sceneRef.current.unfocus();
  }

  const mine = [...state.msgs].reverse().find((m) => m.who === 'visitor');
  const toName = state.to ? agents[state.to].name : null;
  const placeholder = inLead ? chat.lead.placeholders[state.lead.step] : chat.placeholder(toName || chat.placeholderAll);

  return {
    msgs: state.msgs,
    to: state.to,
    typing: state.typing,
    typingText: toName ? chat.typingTo(toName) : chat.typingAll,
    lastMine: state.typing ? null : mine?.text || null,
    card: inLead && state.lead.step === 'confirm' ? state.lead.card : null,
    chips,
    chipsLabel,
    draft: state.draft,
    placeholder,
    live: state.live,
    histOpen: state.histOpen,
    setDraft: (draft) => setState((st) => ({ ...st, draft })),
    submit: () => send(state.draft),
    toggleHist: () => setState((st) => ({ ...st, histOpen: !st.histOpen })),
    // Elegir un agente: con `fromScene` el clic vino de la maqueta, que ya lo marcó. Al elegirlo, la cámara se le
    // acerca y dice su presentación; al soltarlo, vuelve a la vista general.
    setTo: (id, fromScene) => {
      // Elegir a arquitecto o stack deja en pausa un recado en curso: lo que escribas va para ellos.
      setState((st) => ({ ...st, to: id || null, ...(id && id !== 'recepcion' && leadOpen(st.lead) ? { lead: { ...st.lead, paused: true } } : {}) }));
      if (!fromScene) sceneRef.current.select(id || null);
      if (!id) { unfocus(); return; }
      if (state.typing) return;
      const intro = agents[id].intro;
      push([msg(id, intro)]);
      bubbles([{ agent: id, text: intro }]);
    },
    unfocus,
    leadSend: () => leadSend(state.lead),
    leadFix: () => recep(chat.lead.restart, { lead: { step: 'name' } }),
  };
}
