// "Visit my office" (creative feature), English version of src/content/office.js, on its own page /oficina/.
// Same structure, ids, hrefs and leadEmail as the Spanish file. The regular expressions recognize English AND Spanish,
// because the visitor can write in either language (they are compared lowercased and without accents).

export const officePage = {
  title: 'Visit my office',
  subtitle: 'Spin the model and click an agent',
  documentTitle: 'Visit my office · Augusto Pinto',
  back: { label: 'Back to reception', href: '/#contacto' },
};

// Email that receives the reception message. While it is null, the message card stays a draft and says so.
export const leadEmail = null;

export const themes = {
  label: 'Change the office to match the show',
  nowLabel: 'Now',
  swapLabel: 'Switching offices',
  items: [
    { id: 'original', label: 'Original', place: 'My usual office' },
    { id: 'madmen', label: 'Mad Men', place: 'A 1960s ad agency' },
    { id: 'sopranos', label: 'The Sopranos', place: 'A New Jersey back room' },
    { id: 'odisea', label: '2001: A Space Odyssey', place: 'Orbital station, 1968' },
  ],
};

export const stage = {
  fallback: 'The 3D view could not open in this browser. You can still talk to the office below.',
  deco: { core: 'AI core' },
};

// The three agents. Ids stay in Spanish (they are keys used by the scene, styles and the AI backend); names are English.
export const agents = {
  recepcion: { id: 'recepcion', name: 'reception', topic: 'who Augusto is and how to leave him a message',
    card: { blurb: 'Who Augusto is and how to leave him a message', questions: ['Who is Augusto?', 'I want to leave him a message'] },
    intro: 'Hi, I am reception. I can tell you who Augusto is and, if you want to talk to him, I will take your message.',
    rules: [
      'Reception only talks about Augusto as a person and a professional: who he is, what he studies, how he works, his experience and his goal.',
      'Reception does not name projects or technologies; the most it says is that Augusto worked as a frontend developer at Inkvibe.',
      'If someone asks what Augusto has done or about a project, that belongs to architect; if they ask how something is built, it belongs to stack.',
      'The organizations where Augusto works outside of computing are never named: say "at the organizations where Augusto works".',
      'Reception takes a message from anyone who wants to talk to Augusto and never gives out a phone number, email or address.',
    ] },
  arquitecto: { id: 'arquitecto', name: 'architect', topic: 'what each project is and what it achieves',
    card: { blurb: 'Augusto\'s projects and what each one achieves', questions: ['What has he built?', 'What is Rumbo a Casa?'] },
    intro: 'I am architect. I can tell you what each of Augusto\'s projects is and what it achieves: Rumbo a Casa, Inkvibe, Zam and Lexinova. Which one should I tell you about?',
    rules: [
      'Architect only talks about the projects: what each one is, who it is for, its goal and what it achieves (awards, reach, Augusto\'s role).',
      'Architect does not name technologies, frameworks or services: how a project is built belongs to stack.',
      'If someone asks who Augusto is or how he works, that belongs to reception.',
    ] },
  stack: { id: 'stack', name: 'stack', topic: 'how each project is built',
    card: { blurb: 'How each of Augusto\'s projects is built', questions: ['What does he use on AWS?', 'How is Zam built?'] },
    intro: 'I am stack. I can tell you how each of Augusto\'s projects is built, from the interface to the cloud. Ask me about one.',
    rules: [
      'Stack only talks about implementation: which technologies and which technical decisions went into each project.',
      'Stack always ties a technology to the project where Augusto used it; never a loose list. The only exception is Python, his foundation for learning programming logic.',
      'Stack describes a project in one sentence at most: what it is and what it achieves belongs to architect.',
      'If someone asks who Augusto is, that belongs to reception.',
    ] },
};

// Implementation words (Spanish and English): with them, a question about a project goes to stack (not architect).
const IMPL = String.raw`como (esta|lo|la|fue|se|construyo|hizo|hicieron|programo)|con que|programad|built|how|made (with|in|of)|is it made|under the hood|hech[oa] con|construid|armad|stack|tecnolog|technolog|arquitectura|architecture|implement|framework|codigo|\bcode\b|coded|programmed|programming|backend|back-end|frontend|front-end|base de datos|database`;
// "What is it" words: with them the question also belongs to architect even if it mentions implementation.
const QUE = String.raw`que es\b|de que se trata|para que|objetivo|que logr|que hace|que gano|premio|what is\b|what's|whats|what are|what (does|did) (it|he) (do|achieve)|what (does|did) \w+ do\b|who is it for|purpose|goal|achiev|award|prize|\bwon\b|\bwin\b`;
const deStack = (nombres) => new RegExp(`(?=.*(${nombres}))(?=.*(${IMPL}))`);
const soloImpl = new RegExp(`^(?!.*(${QUE})).*(${IMPL})`);

export const chat = {
  regionLabel: 'Talk to the office',
  pick: {
    title: 'Who do you want to talk to?', lead: 'Each agent knows about something different. Pick one and ask away.',
    talking: 'Talking', talkTo: (name) => `Talk to ${name}`, change: 'Switch agent',
    thread: (name) => `Conversation with ${name}`, input: (name) => `Your question for ${name}`,
  },
  welcomeBack: (last) => `You are back! Last time you asked “${last}”. Want to pick up from there?`,
  welcome: 'Welcome! I can tell you who Augusto is, architect what each project does and stack how it is built. What brings you here?',
  noMatch: 'I am not sure about that one. Ask architect what a project does or stack how it is built, or leave me your details and Augusto will get back to you.',
  visitorsLabel: 'What brings you here?',
  suggestionsLabel: 'Suggested questions',
  leadOptionsLabel: 'Message options',
  inputLabel: 'Your message',
  sendLabel: 'Send message',
  historyLabel: 'History',
  historyAria: 'Conversation history',
  closeHistory: 'Close history',
  me: 'You',
  typingTo: (name) => `${name} is typing…`,
  handoff: (to) => `That question is for ${to.name}, who knows about ${to.topic}. Let me take you to their desk.`,
  handoffLead: 'Reception takes messages for Augusto. Let me take you to their desk.',
  handoffBack: 'Reception handles that. Let me take you to their desk.',
  handoffUnknown: 'I do not know that one. Reception can pass your question on to Augusto. Let me take you to their desk.',
  noMatchHanded: 'Augusto can answer that one better himself. If you like, I will take your details and pass your question on: type “I want to contact him”.',
  handoffMore: (to) => `${to.name.charAt(0).toUpperCase() + to.name.slice(1)} knows about ${to.topic} and will tell you the rest. Let me take you over.`,
  typingAll: 'The office is thinking…',
  placeholder: (name) => `Ask ${name} something`,
  placeholderAll: 'the office',
  visitors: [
    { id: 'reclutador', label: 'Looking for talent',
      reply: 'Great. Augusto studies Ingeniería Civil Informática (Computer Engineering) and is on his way to becoming an AI Engineer. Ask me about him, architect about his projects and stack about how he built them; if you want to talk to him, I will take your details.',
      sugs: ['Who is Augusto?', 'What has he built?', 'How do I contact him?'] },
    { id: 'cliente', label: 'I have a project',
      reply: 'Nice! Architect can show you projects similar to yours and stack how they are built. Whenever you are ready, I will take your details so Augusto can write to you.',
      sugs: ['What kind of projects does he do?', 'What is Rumbo a Casa?', 'I want to contact him'] },
    { id: 'colega', label: 'Fellow developer',
      reply: 'Hey, fellow dev! Architect will tell you what each project does and stack how it is built.',
      sugs: ['How is Zam built?', 'How is Inkvibe built?', 'What did he do at the AWS hackathon?'] },
    { id: 'curioso', label: 'Just looking',
      reply: 'Welcome. Spin the model, change the office to match the show or ask anything you like.',
      sugs: ['Who is Augusto?', 'What is Inkvibe?', 'What is this office?'] },
  ],
  // Phrases that open the message for Augusto (Spanish and English).
  leadRx: /(contrat|disponib|propuesta|cotiz|presupuesto|reuni|agend|contact|escribirle|recado|hablar con (el|augusto)|tengo un proyecto|have a project|hire|hiring|get in touch|available|availability|quote|budget|meeting|schedule a|book a call|message|reach (him|out)|talk to (him|augusto)|work with (him|augusto))/,
  small: {
    greetRx: /^[¡!\s]*(hola|holi|buenas|buenos dias|buenas tardes|buenas noches|hello|hi|hey|howdy|good (morning|afternoon|evening)|que tal)\b[\s!.,¡?]*(.{0,12})$/,
    thanksRx: /^[¡!\s]*(gracias|muchas gracias|mil gracias|thanks|thank you|thx|cheers)/,
    greet: {
      recepcion: 'Hi! I am reception. Ask me who Augusto is or, if you want to talk to him, I will take your message.',
      arquitecto: 'Hi! I am architect. Ask me what each of Augusto\'s projects is and what it achieves.',
      stack: 'Hi! I am stack. Ask me how any of Augusto\'s projects is built.',
    },
    helpRx: /que (te|le|les) (puedo|podria) preguntar|que (se )?puedo preguntar|en que (me )?(puedes )?ayuda|de que sabes|^[¿]?(y )?(tu )?que sabes( tu)?[?]?$|como funciona (esto|la oficina|esta oficina)|^[¿]?ayuda[?!.]?$|what (can|should|could) i ask|what can you (do|tell me)|how (can|could) you help|can you help( me)?[?!.]?$|^(and )?what do you know[?]?$|how does (this|the office|this office) work|^help[?!.]?$/,
    help: {
      recepcion: 'I can tell you who Augusto is, what he studies, how he works and what his goal is, and take your message if you want to talk to him: try "Who is Augusto?". In this office each agent knows about something different: I, reception, know about Augusto; architect, about his projects; and stack, about how they are built.',
      arquitecto: 'I can tell you what each of Augusto\'s projects is and what it achieves: Rumbo a Casa, Inkvibe, Zam and Lexinova. Try "What is Rumbo a Casa?" or "What has he built?". In this office each agent knows about something different: reception, about Augusto; I, architect, about his projects; and stack, about how they are built.',
      stack: 'I can tell you how each of Augusto\'s projects is built, from the interface to the cloud. Try "How is Zam built?" or "What does he use on AWS?". In this office each agent knows about something different: reception, about Augusto; architect, about his projects; and I, stack, about how they are built.',
    },
    thanks: {
      recepcion: 'You are welcome! If you want Augusto to write to you, just say so and I will take your details.',
      arquitecto: 'You are welcome! If you want to hear about another project, just ask.',
      stack: 'You are welcome! If you want to know how another project is built, just ask.',
    },
  },
  topics: [
    // stack: how each project is built (project name + implementation word).
    { rx: deStack('rumbo|subsid|hackathon'), agent: 'stack',
      text: 'Rumbo a Casa runs on AWS: CloudFront serves the web app, Lambda handles the queries, DynamoDB stores the data and Polly gives it a voice. The assistant uses Bedrock with a rules engine that cites the decree behind every answer.' },
    { rx: deStack('inkvibe|tatu|tattoo|inkcard'), agent: 'stack',
      text: 'Inkvibe is built with Next.js (App Router), React and TypeScript, with Tailwind, Mantine, Material UI and TanStack Query. The blog runs on Payload CMS and the data lives in Postgres on Supabase with Prisma; it uses Docker and deploys services on Railway. Augusto organized it feature-first with Clean Architecture, role guards from day one and targets of LCP under 2.5 s and CLS under 0.1 on mobile. Every feature goes through an OpenSpec spec before being implemented with Claude Code and Cursor.' },
    { rx: deStack('zam|minimarket|inventario|inventory'), agent: 'stack',
      text: 'Zam has its backend in NestJS with Fastify, split into modules (inventory, sales, suppliers) with domain, application and infrastructure layers. The web app uses Next.js with Material UI and the mobile app uses Expo, all in TypeScript, on Postgres on Supabase with Prisma, Firebase Auth for owners and cashiers, and Docker to run the services.' },
    { rx: deStack('lexinova|legal|pjud'), agent: 'stack',
      text: 'Lexinova is built Cloudflare-first, with its data on Supabase, and Augusto works on its integrations and architecture.' },
    { rx: deStack('portafolio|portfolio|este sitio|this (site|website|page|office)|esta (web|pagina|oficina)|el chat|the chat|los agentes|the agents'), agent: 'stack',
      text: 'This portfolio is built with React and Vite, with the office in 3D, and deploys on AWS Amplify. The agents\' chat uses Claude Haiku 4.5 on Bedrock behind API Gateway and Lambda, with a monthly spending cap.' },
    // stack: technologies, always tied to the project where he used them.
    { rx: /\bia\b|\bai\b|inteligencia artificial|artificial intelligence|python|bedrock|llm|machine learning/, agent: 'stack',
      unless: /ai engineer/,
      text: 'Python was the foundation Augusto used to learn programming logic, and he is on his way to becoming an AI Engineer. In Rumbo a Casa the assistant runs on Bedrock with a rules engine that cites its sources, and in this portfolio the agents answer with Claude on Bedrock.' },
    { rx: /aws|amazon|nube|cloud|lambda|amplify|dynamo/, agent: 'stack',
      text: 'On AWS he built Rumbo a Casa with CloudFront, Lambda, Bedrock, DynamoDB and Polly, and this portfolio runs on AWS Amplify with the chat on API Gateway and Lambda. Lexinova, on the other hand, lives on Cloudflare, and Inkvibe deploys services on Railway.' },
    { rx: /react|\bnext\b(?!\s+(for|step|steps|goal|plan|year))|nextjs|tailwind|mantine|tanstack|frontend|front-end|interfaz|interface|\bui\b/, agent: 'stack',
      text: 'React and Next.js are his frontend foundation: with them he builds, as the only frontend developer, the Inkvibe web app (App Router, Tailwind, Mantine, Material UI and TanStack Query) and the Zam web dashboard with Material UI. This portfolio is also built with React.' },
    { rx: /nest|node|fastify|backend|back-end|\bapi\b|servidor|server/, agent: 'stack',
      text: 'He built the Zam backend in NestJS with Fastify on Node.js, organized into modules (inventory, sales, suppliers) with domain, application and infrastructure layers.' },
    { rx: /postgres|prisma|supabase|base de datos|database|sql|firestore|firebase/, agent: 'stack',
      text: 'The data for Inkvibe and Zam lives in Postgres on Supabase, with Prisma for the schema and migrations; Lexinova also stores its data on Supabase. In Zam, Firebase Auth handles sign-in for owners and cashiers.' },
    { rx: /typescript|javascript|\bts\b/, agent: 'stack',
      text: 'TypeScript runs end to end in Zam (NestJS backend, Next.js web app and Expo mobile app) and in the Inkvibe web app.' },
    { rx: /cloudflare|railway|worker/, agent: 'stack',
      text: 'At Lexinova he works on a platform built Cloudflare-first, with its data on Supabase. He uses Railway to deploy Inkvibe services.' },
    { rx: /tecnolog|technolog|stack|lenguaje|language|herramient|\btools?\b|sabe usar|que usa|what does he use|what (tools|languages)|con que (construye|trabaja|programa)|what does he (build|work|code) with|framework/, agent: 'stack',
      text: 'It depends on the project: Inkvibe uses Next.js, React and TypeScript with Postgres and Prisma; Zam uses NestJS, Next.js, Expo and Postgres with Prisma; Rumbo a Casa runs on AWS with Bedrock; and Lexinova runs on Cloudflare with Supabase. Which one should I break down?' },
    // architect: what each project is and what it achieves (if the question is only about implementation, `unless` leaves it to stack).
    { rx: /rumbo|subsid|hackathon|zero to shipped|vivienda|housing|premi|prize|award|gano|\bwon\b|\bwin\b/, agent: 'arquitecto', unless: soloImpl,
      text: 'Rumbo a Casa guides Chilean families through four housing subsidies (DS49, DS1, DS19 and DS52) and cites the decree behind every answer. Augusto is a co-creator, and the project won the Social Good category at the AWS Zero to Shipped hackathon.' },
    { rx: /inkvibe|tatu|tattoo|inkcard/, agent: 'arquitecto', unless: soloImpl,
      text: 'Inkvibe is the first digital tattoo marketplace for Latin America: verified artists, quotes and bookings in one place. Augusto was the only frontend developer and shipped four surfaces in 9 weeks: the InkCard for the Instagram bio, projected to be the biggest traffic channel; the studio dashboard; the internal back office; and the public website by city and style.' },
    { rx: /zam|helix|erp|minimarket|caja|cash register|inventario|inventory/, agent: 'arquitecto', unless: soloImpl,
      text: 'Zam is the cash register, inventory and finances for the neighborhood minimarket: the cashier sells from an app and the owner reviews sales, catalog, expenses and stock on a web dashboard. It is Augusto\'s own project and is in development.' },
    { rx: /lexinova|legal|pjud/, agent: 'arquitecto', unless: soloImpl,
      text: 'Lexinova is a multi-tenant LegalTech platform for legal work. Augusto handles its integrations and its architecture.' },
    { rx: /portafolio|portfolio|este sitio|this (site|website|page)|esta (web|pagina)/, agent: 'arquitecto', unless: soloImpl,
      text: 'This portfolio tells who Augusto is, how he builds and what he has done, and its creative feature is this office: three agents who know his work and answer with AI.' },
    { rx: /proyecto|project|ha construido|ha hecho|que hizo|que ha creado|trabajos\b|en que ha trabajado|has he built|what has he (made|done|created)|what did he (build|make|create)|worked on/, agent: 'arquitecto',
      unless: /rumbo|subsid|hackathon|inkvibe|tatu|tattoo|zam|minimarket|lexinova|legal|portafolio|portfolio|como (esta|lo|la|fue|se)|how (is|was|are|were|did|does|do)|tecnolog|technolog|stack/,
      text: 'His main projects: Rumbo a Casa (housing subsidies, a winner at the AWS hackathon), Inkvibe (tattoo marketplace), Zam (cash register and inventory for minimarkets) and Lexinova (LegalTech). Which one should I tell you about?' },
    // reception: Augusto as a person and professional, no projects or technologies.
    { rx: /oficina|office|serie|\bshow\b|mad men|soprano|odisea|odyssey|2001|que agentes|(which|what) agents/, agent: 'recepcion', unless: soloImpl,
      text: 'It is the creative feature of this site: I tell you who Augusto is, architect what each project does and stack how it is built. Up top you can change the office to match the show.' },
    { rx: /como trabaja|forma de trabajar|habilidad|fortaleza|blandas|personalidad|como es (el|augusto)|productiv|en equipo|metodolog|how (does )?he work|work(ing)? style|way of working|skill|strength|personality|what is he like|whats he like|teamwork|team player|methodolog/, agent: 'recepcion',
      text: 'Augusto is organized and proactive: he anticipates problems, proposes solutions and looks for concrete strategies that make the team more efficient. He defines the structure before writing code, works from specifications and measures what he builds. He relies on clear communication, critical thinking and time management.' },
    { rx: /experiencia|donde (ha )?trabaj|trabaja en|laboral|empleo|clientes?\b|atencion|nps|experience|where (has he |did he |does he )?work|works? (at|for)|\bjob|employ|clients?\b|customers?\b/, agent: 'recepcion',
      text: 'He worked as a frontend developer at Inkvibe. On top of that, at the organizations where Augusto works he deals directly with customers: he analyzes NPS scores to evaluate the experience and resolves complaints with an empathetic, agile approach, so he understands the end user because he serves them every day.' },
    { rx: /meta|objetivo profesional|futuro|ai engineer|que busca|aspira|a que se quiere dedicar|career goal|his goal|what'?s next|what is next|future|looking for|aspir|what does he want to (do|become|be)/, agent: 'recepcion',
      text: 'Augusto is on his way to becoming an AI Engineer: he wants to build AI products for real-life situations that solve a paperwork process, a question or a concrete decision. What drives him is building the product that helps people the most.' },
    { rx: /quien es|quien eres|sobre (el|augusto)|de donde|edad|cuantos anos|estudia|universidad|carrera|^[¿]?(y )?augusto[?]?$|who is|who are you|about (him|augusto)|where is he from|where does he (come from|live)|how old|\bage\b|stud(y|ies|ying|ent)|university|degree|\bmajor\b|^(and )?augusto[?]?$/, agent: 'recepcion',
      unless: /ha hecho|ha construido|proyecto|project|has he (done|built|made)|did he (do|build|make)/,
      text: 'Augusto Pinto is 21 and in his fourth year of Ingeniería Civil Informática (Computer Engineering) at Universidad San Sebastián in Santiago, Chile. He is on his way to becoming an AI Engineer and builds complete products, from the screen to the architecture.' },
  ],
  lead: {
    ask: 'Great! I will take your details so Augusto can write to you. What is your name?',
    askAfter: 'If you like, I can take your details so Augusto can write to you. What is your name?',
    need: (name) => `Thanks, ${name}. In a sentence or two, what do you need?`,
    email: 'Which email should Augusto write to?',
    badEmail: 'That email does not look right. Could you check it?',
    badName: 'I need your name for the message. What is your name?',
    badNeed: 'Tell me in a sentence or two what you need, so Augusto comes prepared.',
    badEmailCancel: 'That email does not look right. Check it or, if you prefer, use Cancel.',
    resume: 'Let us get back to your message.',
    askName: 'What is your name?',
    handoffOpen: 'Your message is still open at reception. Let me take you to their desk.',
    review: 'Review your message below before sending it.',
    useCard: 'Use “Send to Augusto” or “Edit” on the card below.',
    sent: (email) => `Message delivered! Augusto will write to you at ${email}. In the meantime, ask anything you like.`,
    sentMail: (email) => `I opened your email with the message ready: send it and Augusto will write to you at ${email}. In the meantime, ask anything you like.`,
    restart: 'Let us start over. What is your name?',
    cancelled: 'No problem, let us keep talking.',
    cancel: 'Cancel',
    placeholders: { name: 'Your name', need: 'What you need', email: 'you@email.com', confirm: 'Type “send” or use the card' },
    card: { title: 'Your message for Augusto', name: 'Name', need: 'Needs', email: 'Email', topics: 'Asked about', none: 'Nothing yet' },
    send: 'Send to Augusto',
    fix: 'Edit',
    subject: 'Message from the portfolio office',
    noteDraft: 'Draft: on the final site this message reaches Augusto by email',
    noteMail: 'Sending opens your email with the message ready',
  },
};
