// "Visita mi oficina" (función creativa), en su propia página /oficina/. Textos del artefacto "Hero · Augusto Pinto".
// Recepción te recibe en Contacto y te lleva; adentro conversas con los tres agentes y cambias la oficina según la serie.

export const officePage = {
  title: 'Visita mi oficina',
  subtitle: 'Gira la maqueta y haz clic en un agente',
  documentTitle: 'Visita mi oficina · Augusto Pinto',
  back: { label: 'Volver a recepción', href: '/#contacto' },
};

// Correo al que llega el recado de recepción (se abre el correo del visitante con el recado listo).
// Mientras sea null, la ficha queda como boceto y lo dice.
export const leadEmail = null;

export const themes = {
  label: 'Cambia la oficina según la serie',
  nowLabel: 'Ahora',
  swapLabel: 'Cambiando de oficina',
  items: [
    { id: 'original', label: 'Original', place: 'Mi oficina de siempre' },
    { id: 'madmen', label: 'Mad Men', place: 'Agencia de los años 60' },
    { id: 'sopranos', label: 'Los Soprano', place: 'Trastienda de Nueva Jersey' },
    { id: 'odisea', label: '2001 Odisea', place: 'Estación orbital, 1968' },
  ],
};

export const stage = {
  fallback: 'No se pudo abrir la vista 3D en este navegador. Igual puedes conversar con la oficina aquí abajo.',
};

// Los tres agentes, con su nombre en minúsculas (su color, el del personaje, vive en src/styles/oficina.css).
// `intro` es lo que dice cada uno al hacerle clic; `topic`, lo que sabe (para cuando otro agente te deriva a él).
export const agents = {
  recepcion: { id: 'recepcion', name: 'recepción', topic: 'quién es Augusto y cómo dejarle un recado',
    intro: 'Hola, soy recepción. Te cuento quién es Augusto y, si quieres hablar con él, tomo tu recado.' },
  arquitecto: { id: 'arquitecto', name: 'arquitecto', topic: 'los proyectos de Augusto',
    intro: 'Soy arquitecto. Conozco los proyectos de Augusto: Rumbo a Casa, Inkvibe, Zam y Lexinova. ¿Cuál te cuento?' },
  stack: { id: 'stack', name: 'stack', topic: 'las tecnologías con que construye Augusto',
    intro: 'Soy stack. Sé con qué tecnologías construye Augusto, de la interfaz a la nube. Pregúntame por una.' },
};

export const chat = {
  regionLabel: 'Habla con la oficina',
  welcome: '¡Bienvenido! Yo atiendo, arquitecto sabe de proyectos y stack de tecnologías. ¿Qué te trae por aquí?',
  noMatch: 'Esa no la tengo clara. Prueba preguntándole a arquitecto por los proyectos o a stack por las tecnologías, o déjame tus datos y Augusto te responde.',
  visitorsLabel: '¿Qué te trae por aquí?',
  suggestionsLabel: 'Preguntas sugeridas',
  leadOptionsLabel: 'Opciones del recado',
  inputLabel: 'Tu mensaje',
  sendLabel: 'Enviar mensaje',
  historyLabel: 'Historial',
  historyAria: 'Historial de la conversación',
  closeHistory: 'Cerrar historial',
  me: 'Tú',
  typingTo: (name) => `${name} está escribiendo…`,
  // Cuando la pregunta es de otro agente: quien la recibe lo dice y la cámara viaja al escritorio del otro.
  handoff: (to) => `Esa pregunta es para ${to.name}, que sabe de ${to.topic}. Te llevo a su escritorio.`,
  // Cuando otro agente completa la respuesta: el que habló lo anuncia antes de que la cámara viaje.
  handoffMore: (to) => `${to.name.charAt(0).toUpperCase() + to.name.slice(1)} sabe de ${to.topic} y te cuenta el resto. Te llevo con él.`,
  typingAll: 'La oficina está pensando…',
  placeholder: (name) => `Pregúntale algo a ${name}`,
  placeholderAll: 'la oficina',
  // Quién visita: cada opción trae la respuesta de recepción y tres preguntas sugeridas.
  visitors: [
    { id: 'reclutador', label: 'Busco talento',
      reply: 'Perfecto. Augusto estudia Ingeniería Civil Informática en Chile y va camino a ser AI Engineer. Pregunta lo que quieras y, si te interesa conversar con él, yo tomo tus datos.',
      sugs: ['¿Qué ha construido?', '¿Qué sabe de IA y AWS?', '¿Está disponible para una práctica?'] },
    { id: 'cliente', label: 'Tengo un proyecto',
      reply: '¡Bien! Arquitecto te puede mostrar proyectos parecidos al tuyo. Cuando quieras, yo tomo tus datos para que Augusto te escriba.',
      sugs: ['¿Qué tipo de proyectos hace?', '¿Cómo funciona Rumbo a Casa?', 'Quiero contactarlo'] },
    { id: 'colega', label: 'Soy colega',
      reply: '¡Hola, colega! Stack te cuenta con qué construye y arquitecto cómo lo arma.',
      sugs: ['¿Cómo está armado Zam?', '¿Qué stack usa?', '¿Qué hizo en la hackathon de AWS?'] },
    { id: 'curioso', label: 'Solo miro',
      reply: 'Bienvenido. Gira la maqueta, cambia la oficina según la serie o pregunta lo que quieras.',
      sugs: ['¿Quién es Augusto?', '¿Qué es Inkvibe?', '¿Qué es esta oficina?'] },
  ],
  // Frases que abren el recado para Augusto (se comparan en minúsculas y sin tildes).
  leadRx: /(contrat|practica|pasant|disponib|propuesta|cotiz|presupuesto|reuni|agend|contact|escribirle|hablar con (el|augusto)|tengo un proyecto|hire|internship|get in touch)/,
  // Temas: el primero que calza responde; si calza otro de otro agente, ese completa.
  topics: [
    { rx: /zam|helix|erp|minimarket|caja|inventario/, agent: 'arquitecto', text: 'Zam es la caja, el inventario y las finanzas del minimarket de barrio: una app para el cajero y un panel web para el dueño. El backend va en NestJS con Fastify, por módulos (inventario, ventas, proveedores); la web en Next.js y la app en Expo. Todo en TypeScript, sobre Postgres en Supabase con Prisma.' },
    { rx: /inkvibe|tatu/, agent: 'arquitecto', text: 'Inkvibe es el marketplace del tatuaje para Latinoamérica. Augusto es el único desarrollador frontend: arma la web con React y Next.js, con las InkCards de los artistas, sus portafolios y el flujo para cotizar y reservar.' },
    { rx: /rumbo|subsidio|hackathon|zero to shipped/, agent: 'arquitecto', text: 'Rumbo a Casa guía a familias chilenas por cuatro subsidios habitacionales y cita el decreto detrás de cada respuesta. Ganó la categoría Social Good en la hackathon AWS Zero to Shipped.' },
    { rx: /lexinova|legal|pjud/, agent: 'arquitecto', text: 'En Lexinova, una plataforma LegalTech multi-tenant hecha sobre Cloudflare, Augusto ve integraciones y arquitectura, y mantiene en Railway el worker que trabaja con datos del Poder Judicial.' },
    { rx: /\bia\b|\bai\b|inteligencia|agente|python|bedrock|llm/, agent: 'stack', text: 'Para IA usa Python: scripts, datos y prototipos de agentes, camino a AI Engineer. En Rumbo a Casa el asistente corre con Bedrock y un motor de reglas que cita sus fuentes.' },
    { rx: /aws|nube|cloud|lambda|amplify/, agent: 'stack', text: 'En AWS construyó Rumbo a Casa con CloudFront, Lambda, Bedrock, DynamoDB y Polly, y este portafolio corre en AWS Amplify. Además trabaja con Cloudflare y Railway.' },
    { rx: /tecnolog|stack|lenguaje|react|next|node|typescript|postgres|docker|framework|herramient|sabe usar/, agent: 'stack', text: 'Frontend con React y Next.js, backend con Node.js y NestJS, TypeScript de punta a punta, Postgres con Prisma, y nube en AWS, Cloudflare y Railway. Python para IA.' },
    { rx: /proyecto|construid|hecho|hizo|trabajos?\b|portafolio/, agent: 'arquitecto', text: 'Sus proyectos principales: Rumbo a Casa (subsidios habitacionales, ganó en AWS), Inkvibe (marketplace de tatuajes), Zam (caja e inventario para minimarkets) y Lexinova (LegalTech). ¿Cuál te cuento?' },
    { rx: /oficina|serie|mad men|soprano|odisea|2001|agentes?\b/, agent: 'recepcion', text: 'Es la función creativa del portafolio: somos tres agentes que conocemos el trabajo de Augusto. Arriba puedes cambiar la oficina según la serie.' },
    { rx: /^(hola|buenas|hello|hi|hey)[\s!.,]*(.{0,12})$/, agent: 'recepcion', text: '¡Hola! Pregúntame quién es Augusto, o pídele a arquitecto un proyecto y a stack una tecnología.' },
    { rx: /^(gracias|muchas gracias|thanks)/, agent: 'recepcion', text: '¡De nada! Si quieres que Augusto te escriba, dime y tomo tus datos.' },
    { rx: /quien es|quien eres|estudia|que busca|sobre el\b|de donde/, agent: 'recepcion', text: 'Augusto Pinto estudia Ingeniería Civil Informática en Chile y va camino a ser AI Engineer. Construye productos reales: Rumbo a Casa, Inkvibe, Zam y Lexinova.' },
  ],
  // Recepción toma los datos de a uno y arma la ficha del recado.
  lead: {
    ask: '¡Genial! Te tomo los datos para que Augusto te escriba. ¿Cómo te llamas?',
    askAfter: 'Si quieres, te tomo los datos para que Augusto te escriba. ¿Cómo te llamas?',
    need: (name) => `Gracias, ${name}. En una o dos frases, ¿qué necesitas?`,
    email: '¿A qué correo te escribe Augusto?',
    badEmail: 'Ese correo no me cuadra. ¿Lo revisas?',
    review: 'Revisa tu recado abajo antes de enviarlo.',
    useCard: 'Usa “Enviar recado” o “Corregir” en la ficha de abajo.',
    sent: (email) => `¡Recado entregado! Augusto te escribirá a ${email}. Mientras, pregunta lo que quieras.`,
    sentMail: (email) => `Abrí tu correo con el recado listo: envíalo y Augusto te escribirá a ${email}. Mientras, pregunta lo que quieras.`,
    restart: 'Partamos de nuevo. ¿Cómo te llamas?',
    cancelled: 'Sin problema, seguimos conversando.',
    cancel: 'Cancelar',
    placeholders: { name: 'Tu nombre', need: 'Lo que necesitas', email: 'tu@correo.com', confirm: 'Escribe “enviar” o usa la ficha' },
    card: { title: 'Tu recado para Augusto', name: 'Nombre', need: 'Necesita', email: 'Correo', topics: 'Preguntó por', none: 'Nada todavía' },
    send: 'Enviar recado',
    fix: 'Corregir',
    subject: 'Recado desde la oficina del portafolio',
    noteDraft: 'Boceto: en el sitio final este recado le llega a Augusto por correo',
    noteMail: 'Al enviar se abre tu correo con el recado listo',
  },
};
