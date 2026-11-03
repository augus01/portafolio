import { useCallback, useEffect, useRef, useState } from 'react';
import { answer, bubbleMap, greeting, isConfirm, isEmail, leadMailto, wantsContact } from '../lib/officeChat';

const STORE = 'ap-office-visit';
const TYPING_MS = 550;

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

  // Globos sobre cada agente, anillo en el último que habló y aviso para lectores de pantalla.
  const bubbles = useCallback((replies) => {
    const s = sceneRef.current;
    s.say(bubbleMap(replies));
    s.speak(replies.length ? replies[replies.length - 1].agent : null);
    if (replies.length) setState((st) => ({ ...st, live: replies.map((r) => `${agents[r.agent].name}: ${r.text}`).join(' ') }));
  }, [agents]);

  // El saludo de recepción aparece en su globo apenas carga la oficina.
  useEffect(() => { bubbles([{ agent: 'recepcion', text: state.greet }]); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const push = (list, patch) => setState((st) => ({ ...st, msgs: st.msgs.concat(list), ...(patch || {}) }));
  const recep = (text, patch) => { push([msg('recepcion', text)], patch); bubbles([{ agent: 'recepcion', text }]); };

  const startLead = (after, prev) => {
    const ask = after ? chat.lead.askAfter : chat.lead.ask;
    push([msg('recepcion', ask)], { lead: { step: 'name' } });
    // Si otro agente acaba de responder, su globo se queda y recepción suma el suyo.
    bubbles((prev || []).filter((r) => r.agent !== 'recepcion').concat([{ agent: 'recepcion', text: ask }]));
  };

  const leadSend = (lead) => {
    const L = { ...lead, step: 'sent' };
    if (leadEmail) {
      window.location.href = leadMailto(leadEmail, chat.lead.subject, L.card);
      recep(chat.lead.sentMail(L.email), { lead: L });
    } else recep(chat.lead.sent(L.email), { lead: L });
  };

  const leadInput = (text, lead) => {
    const L = { ...lead };
    if (L.step === 'name') {
      L.name = text.slice(0, 80); L.step = 'need';
      recep(chat.lead.need(L.name), { lead: L });
    } else if (L.step === 'need') {
      L.need = text.slice(0, 400); L.step = 'email';
      recep(chat.lead.email, { lead: L });
    } else if (L.step === 'email') {
      if (!isEmail(text)) { recep(chat.lead.badEmail); return; }
      L.email = text.trim(); L.step = 'confirm';
      const asked = askedRef.current.slice(-3);
      L.card = { name: L.name, need: L.need, email: L.email, topics: asked.length ? asked.join(' · ') : chat.lead.card.none };
      recep(chat.lead.review, { lead: L });
    } else if (L.step === 'confirm') {
      if (isConfirm(text)) leadSend(L);
      else recep(chat.lead.useCard);
    }
  };

  const send = (raw) => {
    const text = String(raw || '').trim();
    if (!text || state.typing) return;
    push([msg('visitor', text)], { draft: '' });
    const lead = state.lead;
    if (lead && lead.step !== 'sent') { leadInput(text, lead); return; }
    askedRef.current = askedRef.current.concat(text);
    if (wantsContact(text, chat.leadRx)) { startLead(); return; }
    writeStore({ last: text.slice(0, 80) });
    const to = state.to;
    setState((st) => ({ ...st, typing: true }));
    sceneRef.current.say(to ? { [to]: '…' } : {});
    timerRef.current = setTimeout(() => {
      const replies = answer(text, { topics: chat.topics, agents, to, noMatch: chat.noMatch });
      push(replies.map((r) => msg(r.agent, r.text)), { typing: false });
      bubbles(replies);
    }, TYPING_MS);
  };

  const pickVisitor = (v) => {
    if (state.visitor) return;
    writeStore({ visitor: v.id });
    push([msg('visitor', v.label), msg('recepcion', v.reply)], { visitor: v.id });
    bubbles([{ agent: 'recepcion', text: v.reply }]);
  };

  // Chips bajo la caja: quién visita, luego sus preguntas sugeridas; durante el recado, cancelar.
  const inLead = !!(state.lead && state.lead.step !== 'sent');
  const vis = chat.visitors.find((v) => v.id === state.visitor);
  let chips = [];
  let chipsLabel = chat.suggestionsLabel;
  if (inLead) { chips = [{ label: chat.lead.cancel, pick: () => recep(chat.lead.cancelled, { lead: null }) }]; chipsLabel = chat.leadOptionsLabel; }
  else if (!vis) { chips = chat.visitors.map((v) => ({ label: v.label, pick: () => pickVisitor(v) })); chipsLabel = chat.visitorsLabel; }
  else chips = vis.sugs.map((q) => ({ label: q, pick: () => send(q) }));

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
    // Elegir un agente: con `fromScene` el clic vino de la maqueta, que ya lo marcó.
    setTo: (id, fromScene) => {
      setState((st) => ({ ...st, to: id || null }));
      if (!fromScene) sceneRef.current.select(id || null);
    },
    leadSend: () => leadSend(state.lead),
    leadFix: () => recep(chat.lead.restart, { lead: { step: 'name' } }),
  };
}
