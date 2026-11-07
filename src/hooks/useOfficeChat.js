import { useCallback, useEffect, useRef, useState } from 'react';
import { answer, bubbleMap, greeting, isConfirm, isQuestion, leadMailto, leadNext, wantsContact } from '../lib/officeChat';
import { historialParaApi, pedirRespuesta } from '../lib/chatAgentesApi';
import { detectLang } from '../lib/detectLang';

const STORE = 'ap-office-visit';
// Recepción atiende primero y es a quien le hablas si no eliges a otro.
const MAIN = 'recepcion';
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
 * Recepción es la principal: saluda, recibe la primera pregunta y deriva al que sabe. La cámara solo se acerca a un
 * agente si lo eliges antes de empezar a hablar; desde tu primer mensaje queda en la vista general, con el globo del que habla.
 * `scene` es el control de useOfficeScene (globos y anillo del que habla). `link` ({ to, draft }) llega desde el landing
 * ("Seguir con stack en la oficina"): ese agente queda elegido y la pregunta escrita. Devuelve el estado y las acciones.
 * Los agentes responden en el idioma en que les escriben (lib/detectLang), aunque el sitio esté en el otro: `alt`
 * ({ chat, agents }) es el contenido del otro idioma para las reglas locales y para reconocer un recado.
 */
export function useOfficeChat({ chat, agents, scene, leadEmail, link, lang, alt, themeId, themes }) {
  // Lo que recepción cuenta de la oficina en que estás (themes.items[].about).
  const aboutOf = (id) => (themes.items.find((t) => t.id === id) || themes.items[0]).about;
  const sceneRef = useRef(scene);
  sceneRef.current = scene;
  const idRef = useRef(0);
  const askedRef = useRef([]);
  const timerRef = useRef(0);
  const seqRef = useRef(0);
  // Último agente que habló: al entrar, recepción (saluda ella).
  const lastRef = useRef(MAIN);
  const vivoRef = useRef(true);
  // Agente con quien conversas de cerca (null: vista general con las tres tarjetas). Mientras hay uno, la cámara se
  // queda acercada al que habla y solo se ve su tarjeta.
  const focusRef = useRef(null);
  // `to` (solo en los del visitante): a qué agente le hablaste, para separar el historial por agente.
  const msg = (who, text, to) => ({ id: ++idRef.current, who, text, ...(to ? { to } : {}) });

  const [state, setState] = useState(() => {
    const seen = readStore();
    const about = aboutOf(themeId);
    const text = greeting(seen, { welcome: chat.welcome(about), welcomeBack: (last) => chat.welcomeBack(last, about), leadRx: chat.leadRx });
    return {
      msgs: [{ id: ++idRef.current, who: 'recepcion', text }],
      visitor: seen?.visitor || null,
      lead: null,
      to: null,
      draft: (link && link.draft) || '',
      typing: false,
      live: '',
      histOpen: false,
      focus: null,
      greet: text,
    };
  });

  // Globos: cada agente que responde, uno tras otro (primero quien deriva, después a quien deriva), con su globo y su
  // anillo. Con un agente elegido (vista cercana) la cámara se acerca a cada uno que habla; en la vista general no se
  // mueve. Aviso completo para lectores de pantalla.
  const bubbles = useCallback((replies) => {
    clearTimeout(seqRef.current);
    const s = sceneRef.current;
    const focus = !!focusRef.current;
    const play = (i) => {
      const r = replies[i];
      if (!r) return;
      s.say({ [r.agent]: r.text }, { focus });
      s.speak(r.agent);
      lastRef.current = r.agent;
      // De cerca, la tarjeta y la cámara siguen al agente que toma la conversación (también al derivar).
      if (focusRef.current && focusRef.current !== r.agent) {
        focusRef.current = r.agent;
        setState((st) => ({ ...st, focus: r.agent, to: st.to ? r.agent : st.to }));
      }
      if (i < replies.length - 1) seqRef.current = setTimeout(() => play(i + 1), holdFor(r));
    };
    if (!replies.length) { s.say({}, { focus: false }); s.speak(null); return; }
    play(0);
    setState((st) => ({ ...st, live: replies.map((r) => `${agents[r.agent].name}: ${r.text}`).join(' ') }));
  }, [agents]);

  // El saludo de recepción aparece en su globo apenas carga la oficina, con la oficina entera a la vista (sin zoom).
  // Si llegas desde el landing con un agente, ese agente te recibe: la cámara se le acerca y se presenta.
  useEffect(() => {
    if (link && link.to && link.to !== MAIN) { pick(link.to); return; }
    bubbles([{ agent: MAIN, text: state.greet }]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // Al cambiar de oficina, recepción te da la bienvenida a la nueva y la explica en una frase (queda en su historial).
  // Su globo sale solo si no interrumpe: no mientras conversas de cerca con arquitecto o stack, hay un recado en curso
  // o viene una respuesta en camino.
  const themeRef = useRef(themeId);
  useEffect(() => {
    if (themeRef.current === themeId) return;
    themeRef.current = themeId;
    const text = chat.themeWelcome(aboutOf(themeId));
    push([msg(MAIN, text)]);
    const busy = (focusRef.current && focusRef.current !== MAIN) || leadOpen(state.lead) || state.typing;
    if (busy) setState((st) => ({ ...st, live: `${agents[MAIN].name}: ${text}` }));
    else bubbles([{ agent: MAIN, text }]);
  }, [themeId]); // eslint-disable-line react-hooks/exhaustive-deps
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
    const from = lastRef.current || state.to;
    const text = passText || (leadOpen(state.lead) ? chat.lead.handoffOpen : chat.handoffBack);
    return from && from !== 'recepcion' ? [{ agent: from, handoff: true, text }] : [];
  };
  // Cualquier respuesta de recepción pasa por aquí, así ningún cambio a ella es abrupto.
  const recep = (text, patch, passText) => {
    const pass = toRecep(passText);
    push(pass.map((r) => msg(r.agent, r.text)).concat([msg('recepcion', text)]), { ...(patch || {}), ...(pass.length ? { to: null } : {}) });
    if (pass.length) sceneRef.current.select(focusRef.current ? 'recepcion' : null);
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
    sceneRef.current.select(focusRef.current ? 'recepcion' : null);
    // Si otro agente acaba de responder, su globo va antes y recepción suma el suyo.
    bubbles((prev || []).filter((r) => r.agent !== 'recepcion').concat(pass, [{ agent: 'recepcion', text: ask }]));
  };

  const leadSend = (lead) => {
    const L = { ...lead, step: 'sent' };
    if (leadEmail) {
      window.location.href = leadMailto(leadEmail, chat.lead.subject, L.card, chat.lead.card);
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

  // `opts.to` le habla a ese agente (pregunta lista de su tarjeta) aunque no estuviera elegido.
  const send = (raw, opts) => {
    const text = String(raw || '').trim();
    if (!text || state.typing) return;
    const toNow = opts && opts.to !== undefined ? opts.to : state.to;
    const lead = state.lead;
    const explicit = opts && opts.to !== undefined;
    const heard = (!explicit || opts.to === MAIN) && leadOpen(lead) ? MAIN : toNow || lastRef.current || MAIN;
    push([msg('visitor', text, heard)], { draft: '', to: toNow });
    if ((!opts || opts.to === undefined || opts.to === MAIN) && leadOpen(lead) && leadInput(text, lead)) return;
    askedRef.current = askedRef.current.concat(text);
    // Idioma del mensaje: el del sitio salvo que escribas claramente en el otro.
    const msgLang = alt ? detectLang(text, lang) : lang;
    const own = msgLang === lang || !alt ? { chat, agents } : alt;
    if (wantsContact(text, chat.leadRx) || wantsContact(text, own.chat.leadRx)) { startLead(); return; }
    writeStore({ last: text.slice(0, 80) });
    const to = toNow;
    const from = to || lastRef.current;
    setState((st) => ({ ...st, typing: true }));
    clearTimeout(seqRef.current);
    // Mientras piensa, la cámara se queda con el agente al que le hablaste (o el último que habló), con sus puntos.
    sceneRef.current.say(from ? { [from]: '…' } : {}, { focus: !!focusRef.current });
    const c = own.chat;
    const local = () => answer(text, { topics: c.topics, agents: own.agents, small: c.small, to, from, noMatch: c.noMatch, noMatchHanded: c.noMatchHanded, handoff: c.handoff, handoffMore: c.handoffMore, handoffUnknown: c.handoffUnknown });
    // Con VITE_CHAT_API_URL pide la respuesta a la IA; si no hay URL o falla (null), responde con las reglas locales.
    // Todo pasa por la IA, también saludos y agradecimientos: el modelo distingue la intención del visitante.
    // En todo caso espera al menos TYPING_MS para que los puntos se vean.
    const espera = new Promise((resolve) => { timerRef.current = setTimeout(resolve, TYPING_MS); });
    Promise.all([
      pedirRespuesta({ url: import.meta.env.VITE_CHAT_API_URL, mensaje: text, agente: to || from || null, historial: historialParaApi(state.msgs), lang: msgLang }),
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
    push([msg('visitor', v.label, MAIN)]);
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

  // Entra a la vista cercana con `id`: la cámara se le acerca y queda solo su tarjeta.
  const focusOn = (id) => {
    // Al entrar a otro agente el historial parte cerrado: se abre de nuevo con "Historial".
    if (focusRef.current !== id) setState((st) => ({ ...st, focus: id, histOpen: false }));
    focusRef.current = id;
  };

  // Elegir un agente ("Hablar con …" o clic en la maqueta; con `fromScene` el clic vino de la maqueta, que ya lo marcó):
  // la cámara se le acerca, se presenta y su tarjeta es la única a la vista. Al soltarlo vuelve la vista general.
  function pick(id, fromScene) {
    // Elegir a arquitecto o stack deja en pausa un recado en curso: lo que escribas va para ellos.
    setState((st) => ({ ...st, to: id || null, ...(id && id !== MAIN && leadOpen(st.lead) ? { lead: { ...st.lead, paused: true } } : {}) }));
    if (!fromScene) sceneRef.current.select(id || null);
    if (!id) { unfocus(); return; }
    focusOn(id);
    if (state.typing) return;
    const intro = agents[id].intro;
    push([msg(id, intro)]);
    bubbles([{ agent: id, text: intro }]);
  }

  // Esc, "Cambiar de agente" o soltar al agente: corta la secuencia de respuestas y vuelve a la vista general, con las
  // tres tarjetas y sin globo.
  function unfocus() {
    clearTimeout(seqRef.current);
    focusRef.current = null;
    // Salir de la vista cercana cierra el historial.
    setState((st) => ({ ...st, focus: null, to: null, histOpen: false }));
    sceneRef.current.select(null);
    sceneRef.current.speak(null);
    sceneRef.current.unfocus();
  }

  const mine = [...state.msgs].reverse().find((m) => m.who === 'visitor');
  // Le hablas al agente elegido o, si no elegiste, al último que habló (al entrar, recepción).
  const lastAgent = [...state.msgs].reverse().find((m) => m.who !== 'visitor')?.who;
  const toName = state.to ? agents[state.to].name : null;
  // Agente con quien conversas: su tarjeta es la que se abre con el hilo y la caja para escribir.
  const active = state.focus || state.to || lastAgent || MAIN;
  const withName = agents[active]?.name || chat.placeholderAll;
  // Escribirle o usar un chip desde la vista general también te acerca al agente de la tarjeta abierta.
  const enter = () => { if (!focusRef.current) { sceneRef.current.select(active); focusOn(active); } };
  chips = chips.map((c) => ({ ...c, pick: () => { if (state.typing) return; enter(); c.pick(); } }));
  const placeholder = inLead ? chat.lead.placeholders[state.lead.step] : chat.placeholder(withName);

  return {
    msgs: state.msgs,
    to: state.to,
    active,
    focus: state.focus,
    // Pregunta lista de la tarjeta de un agente: le habla a él directo y la cámara se le acerca.
    ask: (id, q) => {
      // Como al elegirlo: hablarle a arquitecto o stack deja en pausa un recado en curso.
      if (id !== MAIN) setState((st) => (leadOpen(st.lead) ? { ...st, lead: { ...st.lead, paused: true } } : st));
      sceneRef.current.select(id);
      focusOn(id);
      send(q, { to: id });
    },
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
    submit: () => {
      if (!String(state.draft || '').trim() || state.typing) return;
      enter();
      send(state.draft);
    },
    toggleHist: () => setState((st) => ({ ...st, histOpen: !st.histOpen })),
    setTo: (id, fromScene) => pick(id, fromScene),
    unfocus,
    leadSend: () => leadSend(state.lead),
    leadFix: () => recep(chat.lead.restart, { lead: { step: 'name' } }),
  };
}
