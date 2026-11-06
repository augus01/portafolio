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
// `intro` es lo que dice cada uno al hacerle clic; `topic`, lo que sabe (para cuando otro agente te deriva a él);
// `card`, su tarjeta en "¿Con quién quieres hablar?" (qué sabe y dos preguntas listas); `rules`, su territorio: el chat de reglas lo respeta con los temas de abajo y la IA las recibe en su prompt.
// Fuente del contenido: docs/sensible/perfil-augusto.md (CV y LinkedIn, solo lo profesional).
export const agents = {
  recepcion: { id: 'recepcion', name: 'recepción', topic: 'quién es Augusto y cómo dejarle un recado',
    card: { blurb: 'Quién es Augusto y cómo dejarle un recado', questions: ['¿Quién es Augusto?', 'Quiero dejarle un recado'] },
    intro: 'Hola, soy recepción. Te cuento quién es Augusto y, si quieres hablar con él, tomo tu recado.',
    rules: [
      'Recepción habla solo de Augusto como persona y profesional: quién es, qué estudia, cómo trabaja, su experiencia y su meta.',
      'Recepción no nombra proyectos ni tecnologías; lo más que dice es que Augusto trabajó como desarrollador frontend en Inkvibe.',
      'Si preguntan qué ha hecho Augusto o por un proyecto, eso es de arquitecto; si preguntan cómo está construido algo, es de stack.',
      'Las organizaciones donde Augusto trabaja fuera de la informática no se nombran: se dice "en las organizaciones donde se desempeña Augusto".',
      'Recepción toma el recado de quien quiera hablar con Augusto y nunca da teléfono, correo ni dirección.',
    ] },
  arquitecto: { id: 'arquitecto', name: 'arquitecto', topic: 'qué es cada proyecto y qué logra',
    card: { blurb: 'Los proyectos de Augusto y qué logra cada uno', questions: ['¿Qué ha construido?', '¿Qué es Rumbo a Casa?'] },
    intro: 'Soy arquitecto. Te cuento qué es cada proyecto de Augusto y qué logra: Rumbo a Casa, Inkvibe, Zam y Lexinova. ¿Cuál te cuento?',
    rules: [
      'Arquitecto habla solo de los proyectos: qué es cada uno, para quién es, su objetivo y qué logra (premios, alcance, rol de Augusto).',
      'Arquitecto no nombra tecnologías, frameworks ni servicios: cómo está construido un proyecto es de stack.',
      'Si preguntan quién es Augusto o cómo trabaja, eso es de recepción.',
    ] },
  stack: { id: 'stack', name: 'stack', topic: 'cómo está construido cada proyecto',
    card: { blurb: 'Cómo está construido cada proyecto de Augusto', questions: ['¿Qué usa en AWS?', '¿Cómo está hecho Zam?'] },
    intro: 'Soy stack. Te cuento cómo está construido cada proyecto de Augusto, de la interfaz a la nube. Pregúntame por uno.',
    rules: [
      'Stack habla solo de la implementación: con qué tecnologías y qué decisiones técnicas se construyó cada proyecto.',
      'Stack siempre amarra una tecnología al proyecto donde Augusto la usó; nunca da una lista suelta. La única excepción es Python, su base para aprender la lógica de programación.',
      'Stack describe un proyecto en una frase como mucho: qué es y qué logra es de arquitecto.',
      'Si preguntan quién es Augusto, eso es de recepción.',
    ] },
};

// Palabras de implementación: con ellas una pregunta por un proyecto es de stack (y no de arquitecto).
const IMPL = String.raw`como (esta|lo|la|fue|se|construyo|hizo|hicieron|programo)|con que|programad|built|how|hech[oa] con|construid|armad|stack|tecnolog|arquitectura|implement|framework|codigo|backend|frontend|base de datos`;
// Palabras de "qué es": con ellas la pregunta también es de arquitecto aunque traiga implementación.
const QUE = String.raw`que es\b|de que se trata|para que|objetivo|que logr|que hace|que gano|premio`;
const deStack = (nombres) => new RegExp(`(?=.*(${nombres}))(?=.*(${IMPL}))`);
const soloImpl = new RegExp(`^(?!.*(${QUE})).*(${IMPL})`);

export const chat = {
  regionLabel: 'Habla con la oficina',
  // Tarjetas de los tres agentes al pie de la maqueta (artefacto "Chat B · Elige con quién hablar").
  pick: {
    title: '¿Con quién quieres hablar?', lead: 'Cada agente sabe de algo distinto. Elige uno y pregúntale.',
    talking: 'Conversando', talkTo: (name) => `Hablar con ${name}`, change: 'Cambiar de agente',
    thread: (name) => `Conversación con ${name}`, input: (name) => `Tu pregunta para ${name}`,
  },
  welcome: '¡Bienvenido! Yo te cuento quién es Augusto, arquitecto qué hace cada proyecto y stack cómo está construido. ¿Qué te trae por aquí?',
  noMatch: 'Esa no la tengo clara. Pregúntale a arquitecto qué hace un proyecto o a stack cómo está construido, o déjame tus datos y Augusto te responde.',
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
  // Arquitecto o stack te pasan a recepción: para dejar un recado, o cuando la pregunta no es de nadie.
  handoffLead: 'Para dejarle un recado a Augusto te atiende recepción. Te llevo a su escritorio.',
  handoffBack: 'De eso se encarga recepción. Te llevo a su escritorio.',
  handoffUnknown: 'Eso no lo sé yo. Recepción puede dejarle tu pregunta a Augusto. Te llevo a su escritorio.',
  // Lo que dice recepción cuando llegas derivado con una pregunta que nadie sabe (sin volver a mandarte a otro agente).
  noMatchHanded: 'Esa la responde mejor Augusto en persona. Si quieres, tomo tus datos y le dejo tu pregunta: escribe “quiero contactarlo”.',
  handoffMore: (to) => `${to.name.charAt(0).toUpperCase() + to.name.slice(1)} sabe de ${to.topic} y te cuenta el resto. Te llevo con él.`,
  typingAll: 'La oficina está pensando…',
  placeholder: (name) => `Pregúntale algo a ${name}`,
  placeholderAll: 'la oficina',
  // Quién visita: cada opción trae la respuesta de recepción y tres preguntas sugeridas.
  visitors: [
    { id: 'reclutador', label: 'Busco talento',
      reply: 'Perfecto. Augusto estudia Ingeniería Civil Informática y va camino a ser AI Engineer. Pregúntame por él, a arquitecto por sus proyectos y a stack por cómo los construyó; si quieres conversar con él, tomo tus datos.',
      sugs: ['¿Quién es Augusto?', '¿Qué ha construido?', '¿Cómo lo contacto?'] },
    { id: 'cliente', label: 'Tengo un proyecto',
      reply: '¡Bien! Arquitecto te muestra proyectos parecidos al tuyo y stack cómo están construidos. Cuando quieras, yo tomo tus datos para que Augusto te escriba.',
      sugs: ['¿Qué tipo de proyectos hace?', '¿Qué es Rumbo a Casa?', 'Quiero contactarlo'] },
    { id: 'colega', label: 'Soy colega',
      reply: '¡Hola, colega! Arquitecto te cuenta qué hace cada proyecto y stack cómo está construido.',
      sugs: ['¿Cómo está hecho Zam?', '¿Cómo está hecho Inkvibe?', '¿Qué hizo en la hackathon de AWS?'] },
    { id: 'curioso', label: 'Solo miro',
      reply: 'Bienvenido. Gira la maqueta, cambia la oficina según la serie o pregunta lo que quieras.',
      sugs: ['¿Quién es Augusto?', '¿Qué es Inkvibe?', '¿Qué es esta oficina?'] },
  ],
  // Frases que abren el recado para Augusto (se comparan en minúsculas y sin tildes).
  leadRx: /(contrat|disponib|propuesta|cotiz|presupuesto|reuni|agend|contact|escribirle|hablar con (el|augusto)|tengo un proyecto|hire|get in touch)/,
  // Saludos y agradecimientos: los responde el agente al que le hablas, con su voz, sin derivar (sin agente, recepción).
  small: {
    greetRx: /^[¡!\s]*(hola|holi|buenas|buenos dias|buenas tardes|buenas noches|hello|hi|hey|que tal)\b[\s!.,¡?]*(.{0,12})$/,
    thanksRx: /^[¡!\s]*(gracias|muchas gracias|mil gracias|thanks|thank you)/,
    greet: {
      recepcion: '¡Hola! Soy recepción. Pregúntame quién es Augusto o, si quieres hablar con él, te tomo el recado.',
      arquitecto: '¡Hola! Soy arquitecto. Pregúntame qué es cada proyecto de Augusto y qué logra.',
      stack: '¡Hola! Soy stack. Pregúntame cómo está construido un proyecto de Augusto.',
    },
    // "¿Qué te puedo preguntar?": respaldo cuando no hay IA; con IA, el modelo lo reconoce como intención "ayuda".
    helpRx: /que (te|le|les) (puedo|podria) preguntar|que (se )?puedo preguntar|en que (me )?(puedes )?ayuda|de que sabes|^[¿]?(y )?(tu )?que sabes( tu)?[?]?$|como funciona (esto|la oficina|esta oficina)|^[¿]?ayuda[?!.]?$/,
    help: {
      recepcion: 'Puedo contarte quién es Augusto, qué estudia, cómo trabaja y cuál es su meta, y tomar tu recado si quieres hablar con él: prueba con "¿Quién es Augusto?". En esta oficina cada agente sabe de algo distinto: yo, recepción, de Augusto; arquitecto, de sus proyectos, y stack, de cómo están construidos.',
      arquitecto: 'Puedo contarte qué es cada proyecto de Augusto y qué logra: Rumbo a Casa, Inkvibe, Zam y Lexinova. Prueba con "¿Qué es Rumbo a Casa?" o "¿Qué ha construido?". En esta oficina cada agente sabe de algo distinto: recepción, de Augusto; yo, arquitecto, de sus proyectos, y stack, de cómo están construidos.',
      stack: 'Puedo contarte cómo está construido cada proyecto de Augusto, de la interfaz a la nube. Prueba con "¿Cómo está hecho Zam?" o "¿Qué usa en AWS?". En esta oficina cada agente sabe de algo distinto: recepción, de Augusto; arquitecto, de sus proyectos, y yo, stack, de cómo están construidos.',
    },
    thanks: {
      recepcion: '¡De nada! Si quieres que Augusto te escriba, dime y tomo tus datos.',
      arquitecto: '¡De nada! Si quieres conocer otro proyecto, pregúntame.',
      stack: '¡De nada! Si quieres saber cómo está hecho otro proyecto, pregúntame.',
    },
  },
  // Temas (se comparan en minúsculas y sin tildes): responde el del agente al que le hablas; si no, arquitecto antes
  // que stack; si calza otro de otro agente, ese completa. `unless` descarta el tema: así "¿cómo está hecho Inkvibe?"
  // va solo a stack y "¿qué es Inkvibe?" solo a arquitecto.
  topics: [
    // stack: cómo está construido cada proyecto (nombre del proyecto + palabra de implementación).
    { rx: deStack('rumbo|subsidio|hackathon'), agent: 'stack',
      text: 'Rumbo a Casa corre sobre AWS: CloudFront sirve la web, Lambda atiende las consultas, DynamoDB guarda los datos y Polly le pone voz. El asistente usa Bedrock con un motor de reglas que cita el decreto detrás de cada respuesta.' },
    { rx: deStack('inkvibe|tatu|inkcard'), agent: 'stack',
      text: 'Inkvibe está hecho con Next.js (App Router), React y TypeScript, con Tailwind, Mantine, Material UI y TanStack Query. El blog corre en Payload CMS y los datos en Postgres sobre Supabase con Prisma; usa Docker y despliega servicios en Railway. Augusto lo ordenó feature-first con Clean Architecture, guards por rol desde el día uno y metas de LCP bajo 2,5 s y CLS bajo 0,1 en móvil. Cada funcionalidad pasa por una spec en OpenSpec antes de implementarse con Claude Code y Cursor.' },
    { rx: deStack('zam|minimarket|inventario'), agent: 'stack',
      text: 'Zam tiene el backend en NestJS con Fastify, por módulos (inventario, ventas, proveedores) en capas de dominio, aplicación e infraestructura. La web va en Next.js con Material UI y la app en Expo, todo en TypeScript, sobre Postgres en Supabase con Prisma, Firebase Auth para dueños y cajeros y Docker para levantar los servicios.' },
    { rx: deStack('lexinova|legal|pjud'), agent: 'stack',
      text: 'Lexinova está construida Cloudflare-first, con los datos en Supabase, y Augusto ve sus integraciones y su arquitectura.' },
    { rx: deStack('portafolio|este sitio|esta (web|pagina|oficina)|el chat|los agentes'), agent: 'stack',
      text: 'Este portafolio está hecho con React y Vite, con la oficina en 3D, y se despliega en AWS Amplify. El chat de los agentes usa Claude Haiku 4.5 en Bedrock detrás de API Gateway y Lambda, con un tope de gasto mensual.' },
    // stack: tecnologías, siempre amarradas al proyecto donde las usó.
    { rx: /\bia\b|\bai\b|inteligencia artificial|python|bedrock|llm|machine learning/, agent: 'stack',
      unless: /ai engineer/,
      text: 'Python fue la base con la que Augusto entendió la lógica de programación, y va camino a AI Engineer. En Rumbo a Casa el asistente corre con Bedrock y un motor de reglas que cita sus fuentes, y en este portafolio los agentes responden con Claude en Bedrock.' },
    { rx: /aws|amazon|nube|cloud|lambda|amplify|dynamo/, agent: 'stack',
      text: 'En AWS construyó Rumbo a Casa con CloudFront, Lambda, Bedrock, DynamoDB y Polly, y este portafolio corre en AWS Amplify con el chat sobre API Gateway y Lambda. Lexinova, en cambio, vive en Cloudflare, e Inkvibe despliega servicios en Railway.' },
    { rx: /react|next|tailwind|mantine|tanstack|frontend|interfaz/, agent: 'stack',
      text: 'React y Next.js son su base de frontend: con ellos construye, como único desarrollador frontend, la web de Inkvibe (App Router, Tailwind, Mantine, Material UI y TanStack Query) y el panel web de Zam con Material UI. Este portafolio también está hecho en React.' },
    { rx: /nest|node|fastify|backend|\bapi\b|servidor/, agent: 'stack',
      text: 'El backend de Zam lo hizo en NestJS con Fastify sobre Node.js, organizado por módulos (inventario, ventas, proveedores) en capas de dominio, aplicación e infraestructura.' },
    { rx: /postgres|prisma|supabase|base de datos|sql|firestore|firebase/, agent: 'stack',
      text: 'Los datos de Inkvibe y Zam viven en Postgres sobre Supabase, con Prisma para el esquema y las migraciones; Lexinova también guarda sus datos en Supabase. En Zam, Firebase Auth maneja el inicio de sesión de dueños y cajeros.' },
    { rx: /typescript|javascript|\bts\b/, agent: 'stack',
      text: 'TypeScript va de punta a punta en Zam (backend NestJS, web Next.js y app Expo) y en la web de Inkvibe.' },
    { rx: /cloudflare|railway|worker/, agent: 'stack',
      text: 'En Lexinova trabaja con una plataforma construida Cloudflare-first, con los datos en Supabase. Railway lo usa para desplegar servicios de Inkvibe.' },
    { rx: /tecnolog|stack|lenguaje|herramient|sabe usar|que usa|con que (construye|trabaja|programa)|framework/, agent: 'stack',
      text: 'Depende del proyecto: Inkvibe va en Next.js, React y TypeScript con Postgres y Prisma; Zam en NestJS, Next.js, Expo y Postgres con Prisma; Rumbo a Casa sobre AWS con Bedrock; y Lexinova en Cloudflare con Supabase. ¿Cuál te detallo?' },
    // arquitecto: qué es cada proyecto y qué logra (si la pregunta es solo de implementación, `unless` la deja a stack).
    { rx: /rumbo|subsidio|hackathon|zero to shipped|vivienda|premi|gano/, agent: 'arquitecto', unless: soloImpl,
      text: 'Rumbo a Casa guía a familias chilenas por cuatro subsidios habitacionales (DS49, DS1, DS19 y DS52) y cita el decreto detrás de cada respuesta. Augusto es co-creador y el proyecto ganó la categoría Social Good en la hackathon AWS Zero to Shipped.' },
    { rx: /inkvibe|tatu|inkcard/, agent: 'arquitecto', unless: soloImpl,
      text: 'Inkvibe es el primer marketplace digital del tatuaje para Latinoamérica: artistas verificados, cotización y reserva en un solo lugar. Augusto fue el único desarrollador frontend y entregó cuatro superficies en 9 semanas: la InkCard para la bio de Instagram, proyectada como el mayor canal de tráfico; el panel de los estudios; el backoffice interno y la web pública por ciudad y estilo.' },
    { rx: /zam|helix|erp|minimarket|caja|inventario/, agent: 'arquitecto', unless: soloImpl,
      text: 'Zam es la caja, el inventario y las finanzas del minimarket de barrio: el cajero vende desde una app y el dueño revisa ventas, catálogo, gastos y stock en un panel web. Es un proyecto propio de Augusto y está en desarrollo.' },
    { rx: /lexinova|legal|pjud/, agent: 'arquitecto', unless: soloImpl,
      text: 'Lexinova es una plataforma LegalTech multi-tenant para el trabajo legal. Augusto se encarga de sus integraciones y su arquitectura.' },
    { rx: /portafolio|este sitio|esta (web|pagina)/, agent: 'arquitecto', unless: soloImpl,
      text: 'Este portafolio cuenta quién es Augusto, cómo construye y qué ha hecho, y su función creativa es esta oficina: tres agentes que conocen su trabajo y responden con IA.' },
    { rx: /proyecto|ha construido|ha hecho|que hizo|que ha creado|trabajos\b|en que ha trabajado/, agent: 'arquitecto',
      unless: /rumbo|subsidio|hackathon|inkvibe|tatu|zam|minimarket|lexinova|legal|portafolio|como (esta|lo|la|fue|se)|tecnolog|stack/,
      text: 'Sus proyectos principales: Rumbo a Casa (subsidios habitacionales, ganó en la hackathon de AWS), Inkvibe (marketplace del tatuaje), Zam (caja e inventario para minimarkets) y Lexinova (LegalTech). ¿Cuál te cuento?' },
    // recepción: Augusto como persona y profesional, sin proyectos ni tecnologías.
    { rx: /oficina|serie|mad men|soprano|odisea|2001|que agentes/, agent: 'recepcion', unless: soloImpl,
      text: 'Es la función creativa de este sitio: yo te cuento quién es Augusto, arquitecto qué hace cada proyecto y stack cómo está construido. Arriba puedes cambiar la oficina según la serie.' },
    { rx: /como trabaja|forma de trabajar|habilidad|fortaleza|blandas|personalidad|como es (el|augusto)|productiv|en equipo|metodolog/, agent: 'recepcion',
      text: 'Augusto es organizado y proactivo: se anticipa a los problemas, propone soluciones y busca estrategias concretas que mejoren la eficiencia del equipo. Define la estructura antes de escribir código, trabaja con especificaciones y mide lo que construye. Se apoya en la comunicación efectiva, el pensamiento crítico y la gestión del tiempo.' },
    { rx: /experiencia|donde (ha )?trabaj|trabaja en|laboral|empleo|clientes?\b|atencion|nps/, agent: 'recepcion',
      text: 'Trabajó como desarrollador frontend en Inkvibe. Además, en las organizaciones donde se desempeña Augusto trabaja de cara al cliente: analiza indicadores NPS para evaluar la experiencia y resuelve reclamos con un enfoque empático y ágil, así que entiende al usuario final porque lo atiende todos los días.' },
    { rx: /meta|objetivo profesional|futuro|ai engineer|que busca|aspira|a que se quiere dedicar/, agent: 'recepcion',
      text: 'Augusto va camino a ser AI Engineer: quiere construir productos con IA aplicada a situaciones de la vida real, que resuelvan un trámite, una duda o una decisión concreta. Lo que lo mueve es hacer el producto que más ayude a las personas.' },
    { rx: /quien es|quien eres|sobre (el|augusto)|de donde|edad|cuantos anos|estudia|universidad|carrera|^[¿]?(y )?augusto[?]?$/, agent: 'recepcion',
      unless: /ha hecho|ha construido|proyecto/,
      text: 'Augusto Pinto tiene 21 años y estudia Ingeniería Civil Informática en la Universidad San Sebastián, en cuarto año, en Santiago de Chile. Va camino a ser AI Engineer y construye productos completos, desde la pantalla hasta la arquitectura.' },
  ],
  // Recepción toma los datos de a uno y arma la ficha del recado.
  lead: {
    ask: '¡Genial! Te tomo los datos para que Augusto te escriba. ¿Cómo te llamas?',
    askAfter: 'Si quieres, te tomo los datos para que Augusto te escriba. ¿Cómo te llamas?',
    need: (name) => `Gracias, ${name}. En una o dos frases, ¿qué necesitas?`,
    email: '¿A qué correo te escribe Augusto?',
    badEmail: 'Ese correo no me cuadra. ¿Lo revisas?',
    // Datos que no sirven: un saludo como nombre, una necesidad de una palabra, el segundo correo inválido.
    badName: 'Para el recado necesito tu nombre. ¿Cómo te llamas?',
    badNeed: 'Cuéntame en una o dos frases qué necesitas, así Augusto llega preparado.',
    badEmailCancel: 'Ese correo no me cuadra. Revísalo o, si prefieres, usa Cancelar.',
    // Si preguntas otra cosa o eliges otro agente, el recado queda en pausa; al pedir contacto de nuevo, se retoma.
    resume: 'Sigamos con tu recado.',
    askName: '¿Cómo te llamas?',
    handoffOpen: 'Tu recado sigue abierto en recepción. Te llevo a su escritorio.',
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
