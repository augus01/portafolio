// Contenido del landing. La narrativa es un solo hilo: Hero (promesa) → Sobre mí (quién soy) →
// Superpoderes (cómo construyo) → Proyectos (la prueba) → Contacto (recepción, que te lleva a la oficina).

export const nav = {
  // Logo "apinto" en negro a la izquierda de la nav: lleva al inicio.
  brand: { label: 'Augusto Pinto, ir al inicio', href: '/' },
  items: [
    { label: 'Sobre mí', href: '#sobre-mi' },
    { label: 'Superpoderes', href: '#superpoderes' },
    { label: 'Proyectos', href: '#proyectos' },
  ],
  actions: [
    { label: 'GitHub', href: 'https://github.com/augus01', external: true },
    // Recepción asoma por detrás de esta píldora: al tocarla se agacha, la página baja a Contacto y saluda desde su escritorio.
    { label: 'Contacto', href: '#contacto', peek: true },
  ],
};

// Menú móvil a pantalla completa (bajo 600px): enlaces grandes, llamada principal, enlace secundario y pie.
export const mobileMenu = {
  links: [
    { label: 'Sobre mí', href: '#sobre-mi' },
    { label: 'Superpoderes', href: '#superpoderes' },
    { label: 'Proyectos', href: '#proyectos' },
    { label: 'Contacto', href: '#contacto' },
  ],
  cta: { label: 'Pasa por recepción', href: '#contacto' },
  secondary: { label: 'GitHub', href: 'https://github.com/augus01', external: true },
  meta: 'Ingeniería Civil Informática · Santiago',
};

export const hero = {
  name: 'AUGUSTO PINTO',
  uppercase: true,
  role: 'Menos promesas, más productos que ayudan cada día',
  height: '100svh',
};

export const about = {
  id: 'sobre-mi',
  // Ficha de entrada: quién habla, antes de la presentación.
  summary: [
    { label: 'Nombre', value: 'Augusto Pinto' },
    { label: 'Edad y ciudad', value: '21 años, Santiago de Chile' },
    { label: 'Carrera', value: 'Ingeniería Civil Informática' },
    { label: 'Estudios', value: '4.º año, Universidad San Sebastián' },
  ],
  // Frase de impacto: los tramos con `muted` van en gris.
  statement: [
    { text: 'Parto por lo que la gente necesita en su día y construyo ' },
    { text: 'el producto completo', muted: true },
    { text: ', desde la pantalla hasta la arquitectura.' },
  ],
  paragraphs: [
    'En la adolescencia buscaba un hobby, algo que me interesara lo suficiente como para estudiarlo. Empecé con bootcamps básicos de frontend y ahí encontré la base: ver una idea convertirse en una pantalla que alguien puede usar. Desde entonces no solté el hilo. Hoy estudio Ingeniería Civil Informática en la Universidad San Sebastián, en cuarto año, y sigo construyendo.',
    'Ahora construyo productos con IA aplicada a situaciones de la vida real: tecnología que resuelve un trámite, una duda o una decisión concreta de alguien. No me interesa la IA como demostración, sino como la pieza que hace que un producto realmente ayude. Más abajo vas a ver cómo se ve eso en la práctica.',
    'Lo que me diferencia es la ambición de hacer el mejor producto para las personas: el que más las ayude y cambie su día. Por eso lo cubro de punta a punta, desde lo visual hasta las funcionalidades y una arquitectura que sostiene al producto. Esa forma de construir tiene piezas concretas, y son mis superpoderes.',
  ],
};

// Superpoderes ("Con qué construyo", artefacto "Hero · Augusto Pinto"): cinta de logos 3D en dos filas a velocidades
// distintas; se detiene al pasar el cursor. Cada logo es un botón: al pasar gira y muestra su versión a color
// (/habilidades/<logo>-color.webp) y al hacer clic abre la ficha con qué logré con esa tecnología y dónde la usé.
// `tint` es el color de la marca, para el halo detrás del logo en la ficha. Logos 3D de Vitrum (vista Angle).
export const skills = {
  id: 'superpoderes',
  // La segunda parte del título va en gris.
  title: ['Con qué', 'construyo'],
  lead: 'Las 17 tecnologías que uso en mis proyectos, de la interfaz al despliegue. Pasa el cursor sobre una fila para detenerla y haz clic en una para ver qué logré con ella.',
  // Textos de la ficha. Stack presenta la herramienta: preguntas listas, su respuesta y el paso a la oficina con la pregunta ya escrita.
  card: {
    usedIn: 'Dónde lo usé', close: 'Cerrar', open: (name) => `Ver qué logré con ${name}`, dialog: (name) => `Detalle de ${name}`, alt: (name) => `Logo de ${name} en 3D`,
    agent: 'stack', askLabel: 'Pregúntale a stack', toOffice: 'Seguir con stack en la oficina', office: '/oficina/',
    draft: (name) => `¿Qué más hizo Augusto con ${name}?`,
  },
  // stack sentado leyendo en la cinta: en la fila de arriba va justo antes de `before`; al pasar el cursor salta asustado
  // y al pasar por un logo salta de emoción con `excited`.
  reader: { scare: '¡AAH! ¡Me asustaste!', excited: (name) => `¡Me encanta ${name}!`, before: 'nextjs' },
  // Preguntas listas de stack en la ficha de cada tecnología (por `logo`), con datos reales de los proyectos.
  ask: {
    react: [
      { q: '¿Qué es Inkvibe?', a: 'El marketplace del tatuaje para Latinoamérica: descubres artistas verificados por estilo y ciudad, revisas portafolios, cotizas y reservas en un solo lugar.' },
      { q: '¿Con qué más arma interfaces?', a: 'Con Next.js como base de la web, y con Material UI y Vite cuando necesita armar interfaces en React rápido.' },
    ],
    python: [
      { q: '¿Para qué la usa?', a: 'Para IA y automatización: scripts, manejo de datos y prototipos de agentes. Es su camino a convertirse en AI Engineer.' },
      { q: '¿Dónde hay IA en sus proyectos?', a: 'En Rumbo a Casa: el asistente conversa con Bedrock y un motor de reglas cita el decreto detrás de cada respuesta.' },
    ],
    aws: [
      { q: '¿Qué es Rumbo a Casa?', a: 'Un asistente que guía a familias chilenas por cuatro subsidios habitacionales del Estado (DS49, DS1, DS19 y DS52) y arma la lista de papeles.' },
      { q: '¿Qué ganó con él?', a: 'La categoría Social Good en la hackathon AWS Zero to Shipped.' },
    ],
    nextjs: [
      { q: '¿Qué ve el dueño en Zam?', a: 'Las ventas, el catálogo, los gastos y el stock de su minimarket, en un solo lugar.' },
      { q: '¿Cómo está armado Zam?', a: 'Backend en NestJS con Fastify, ordenado por módulos; web en Next.js y app en Expo. Todo en TypeScript, sobre Postgres en Supabase con Prisma.' },
    ],
    nodejs: [
      { q: '¿Qué módulos tiene Zam?', a: 'Inventario, ventas y proveedores, cada uno en capas de dominio, aplicación e infraestructura.' },
      { q: '¿Sobre qué base de datos?', a: 'Postgres en Supabase, con Prisma para el esquema, las migraciones y las consultas tipadas.' },
    ],
    cloudflare: [
      { q: '¿Qué es Lexinova?', a: 'Una plataforma LegalTech multi-tenant construida Cloudflare-first. Augusto se encarga de integraciones y arquitectura.' },
      { q: '¿Qué más mantiene ahí?', a: 'El worker de PJUD, en Railway: el módulo que trabaja con la información del Poder Judicial.' },
    ],
    typescript: [
      { q: '¿Sobre qué base de datos?', a: 'Postgres en Supabase, con Prisma para el esquema, las migraciones y las consultas tipadas.' },
      { q: '¿Y el inicio de sesión?', a: 'Firebase Auth maneja el inicio de sesión de dueños y cajeros.' },
    ],
    postgresql: [
      { q: '¿Qué guarda Zam ahí?', a: 'Tiendas, catálogo, stock, ventas y proveedores.' },
      { q: '¿Cómo separa cada tienda?', a: 'Con multi-tenancy resuelto en la capa de aplicación. La base vive en Supabase y Prisma lleva el esquema.' },
    ],
    railway: [
      { q: '¿Qué hace el worker de PJUD?', a: 'Trabaja con la información del Poder Judicial para la plataforma de Lexinova.' },
      { q: '¿Dónde más despliega?', a: 'En AWS y Cloudflare, según el proyecto.' },
    ],
    javascript: [
      { q: '¿Cómo empezó a programar?', a: 'En la adolescencia, con bootcamps básicos de frontend: ahí encontró lo que le gusta, ver una idea convertirse en una pantalla que alguien puede usar.' },
      { q: '¿Y hoy qué usa más?', a: 'TypeScript de punta a punta, como en Zam: backend, web y app móvil.' },
    ],
    prisma: [
      { q: '¿Sobre qué base trabaja?', a: 'Sobre Postgres en Supabase, la base de Zam. Prisma lleva el esquema, corre las migraciones y arma consultas tipadas.' },
      { q: '¿Con qué backend se conecta?', a: 'Con el backend de Zam en NestJS con Fastify, ordenado por módulos. Todo en TypeScript.' },
    ],
    docker: [
      { q: '¿Dónde despliega?', a: 'En AWS, Cloudflare y Railway, según el proyecto.' },
      { q: '¿Qué más usa a diario?', a: 'GitHub, para repositorios, pull requests y trabajo en equipo.' },
    ],
    vite: [
      { q: '¿Con qué lo combina?', a: 'Con React y Material UI, para armar interfaces rápido.' },
      { q: '¿Y para la web de un producto?', a: 'Next.js, como en la web de Inkvibe y el panel de Zam.' },
    ],
    supabase: [
      { q: '¿Qué guarda?', a: 'La base Postgres de Zam: tiendas, catálogo, stock, ventas y proveedores.' },
      { q: '¿Con qué la consulta?', a: 'Con Prisma: esquema, migraciones y consultas tipadas.' },
    ],
    github: [
      { q: '¿Qué es Rumbo a Casa?', a: 'Un asistente que guía a familias chilenas por cuatro subsidios habitacionales y cita el decreto detrás de cada respuesta. Ganó Social Good en la hackathon AWS Zero to Shipped.' },
      { q: '¿Sobre qué corre?', a: 'CloudFront, Lambda, Bedrock, DynamoDB y Polly.' },
    ],
    'material-ui': [
      { q: '¿Con qué lo combina?', a: 'Con React y Vite, cuando necesita armar interfaces rápido.' },
      { q: '¿Qué más usa en frontend?', a: 'React y Next.js. Next.js es la base de la web de Inkvibe.' },
    ],
    firebase: [
      { q: '¿Quién inicia sesión?', a: 'Los dueños y los cajeros de los minimarkets que usan Zam.' },
      { q: '¿Qué más usa Zam?', a: 'Backend en NestJS con Fastify, web en Next.js y app en Expo, todo en TypeScript.' },
    ],
  },
  rows: [
    [
      { name: 'React', logo: 'react', tint: '#61DAFB', cat: 'Frontend',
        desc: 'Construyo, como único desarrollador frontend, la web de Inkvibe: el marketplace del tatuaje para Latinoamérica, con InkCards de artistas, portafolios y el flujo para cotizar y reservar.',
        projects: ['Inkvibe'] },
      { name: 'Python', logo: 'python', tint: '#3776AB', cat: 'Lenguaje',
        desc: 'Mi lenguaje para IA y automatización: scripts, manejo de datos y prototipos de agentes, en el camino a convertirme en AI Engineer.',
        projects: [] },
      { name: 'AWS', logo: 'aws', tint: '#FF9900', cat: 'Nube',
        desc: 'Con Rumbo a Casa ganamos la categoría Social Good en la hackathon AWS Zero to Shipped. Corre sobre CloudFront, Lambda, Bedrock, DynamoDB y Polly. Este portafolio se despliega con AWS Amplify.',
        projects: ['Rumbo a Casa'] },
      { name: 'Next.js', logo: 'nextjs', tint: '#111111', cat: 'Frontend',
        desc: 'Base de la web de Inkvibe y del panel web de Zam, donde el dueño de un minimarket revisa ventas, catálogo, gastos y stock.',
        projects: ['Inkvibe', 'Zam'] },
      { name: 'Node.js', logo: 'nodejs', tint: '#5FA04E', cat: 'Backend',
        desc: 'El backend de Zam corre en NestJS con Fastify, organizado por módulos (inventario, ventas, proveedores) en capas de dominio, aplicación e infraestructura.',
        projects: ['Zam'] },
      { name: 'Cloudflare', logo: 'cloudflare', tint: '#F38020', cat: 'Nube',
        desc: 'Trabajo en la plataforma de Lexinova, un LegalTech multi-tenant construido Cloudflare-first, donde me encargo de integraciones y arquitectura.',
        projects: ['Lexinova'] },
      { name: 'TypeScript', logo: 'typescript', tint: '#3178C6', cat: 'Lenguaje',
        desc: 'Tipado de punta a punta en Zam: el backend NestJS, la web en Next.js y la app móvil en Expo hablan el mismo lenguaje.',
        projects: ['Zam'] },
      { name: 'PostgreSQL', logo: 'postgresql', tint: '#4169E1', cat: 'Base de datos',
        desc: 'El modelo de datos de Zam vive en Postgres: tiendas, catálogo, stock, ventas y proveedores, con multi-tenancy resuelto en la capa de aplicación.',
        projects: ['Zam'] },
      { name: 'Railway', logo: 'railway', tint: '#6B6B78', cat: 'Despliegue',
        desc: 'Mantengo en Railway el worker de PJUD de Lexinova, el módulo que trabaja con la información del Poder Judicial para la plataforma.',
        projects: ['Lexinova'] },
    ],
    [
      { name: 'JavaScript', logo: 'javascript', tint: '#F7DF1E', cat: 'Lenguaje',
        desc: 'El lenguaje con el que empecé en la web y que sigue debajo de todo mi trabajo en el navegador y en Node.',
        projects: [] },
      { name: 'Prisma', logo: 'prisma', tint: '#2D3748', cat: 'ORM',
        desc: 'El ORM de Zam: esquema, migraciones y consultas tipadas sobre Postgres en Supabase.',
        projects: ['Zam'] },
      { name: 'Docker', logo: 'docker', tint: '#2496ED', cat: 'Herramientas',
        desc: 'Contenedores para levantar servicios y bases de datos igual en mi máquina que en el servidor.',
        projects: [] },
      { name: 'Vite', logo: 'vite', tint: '#9135FF', cat: 'Herramientas',
        desc: 'Mi punto de partida para prototipos y apps en React: arranca en segundos y recarga al instante.',
        projects: [] },
      { name: 'Supabase', logo: 'supabase', tint: '#3ECF8E', cat: 'Base de datos',
        desc: 'Aloja la base Postgres de Zam: base de datos gestionada sin montar infraestructura propia.',
        projects: ['Zam'] },
      { name: 'GitHub', logo: 'github', tint: '#181717', cat: 'Herramientas',
        desc: 'Repositorios, pull requests y trabajo en equipo. Aquí vive el código de Rumbo a Casa.',
        projects: ['Rumbo a Casa'] },
      { name: 'Material UI', logo: 'material-ui', tint: '#007FFF', cat: 'Frontend',
        desc: 'Componentes listos para armar interfaces React consistentes y accesibles sin partir de cero.',
        projects: [] },
      { name: 'Firebase', logo: 'firebase', tint: '#FF9100', cat: 'Autenticación',
        desc: 'La identidad de Zam: Firebase Auth maneja el inicio de sesión de dueños y cajeros.',
        projects: ['Zam'] },
    ],
  ],
};

export const projects = {
  id: 'proyectos',
  // Encabezado de la galería: la segunda línea va en gris.
  title: ['Lo que he', 'construido'],
  count: '3 proyectos',
  // Arquitecto asoma por el borde de cada portada; al tocarlo abre el plano del proyecto.
  architect: {
    agent: 'arquitecto', tip: 'Ver el plano', open: (name) => `Ver el plano de ${name}`, eyebrow: (name) => `Plano · ${name}`,
    title: 'Toca una pieza y arquitecto te la explica', close: 'Cerrar el plano', dialog: (name) => `Plano de ${name}`,
    figure: 'Arquitecto en 3D con su plano enrollado', toOffice: 'Seguir con arquitecto en la oficina', office: '/oficina/',
  },
  // Cada proyecto es una portada en el color de su app con el logo en blanco, y debajo
  // nombre, descripción y rol. `logo.image` es un archivo con el nombre incluido; `logo.symbol` + `logo.wordmark`
  // compone el símbolo con el nombre escrito en la fuente de esa marca (`logo.brand` elige la fuente).
  // `href` lleva a la página dedicada del proyecto (contenido en src/content/projects.js).
  items: [
    {
      name: 'Rumbo a Casa',
      href: '/proyectos/rumbo-a-casa/',
      description: 'A qué subsidio de vivienda puede postular tu familia, con la fuente de cada respuesta.',
      role: 'Co-creador',
      award: 'Ganador AWS Zero to Shipped',
      // Sello de AWS Builder Center en la esquina de la portada: marca "aws" de Amazon Web Services (Wikimedia Commons,
      // Apache 2.0, © AWS) en blanco y el nombre en mono, como en la imagen oficial de builder.aws.com.
      badge: { mark: '/proyectos/aws-logo-claro.svg', markWidth: 304, markHeight: 182, label: 'Builder Center' },
      // Símbolo y tipografía (Bricolage Grotesque 700) tomados del repositorio augus01/rumbo-a-casa; en la portada
      // azul van como en el encabezado de la app: barras blancas y casa óxido. Las capturas son de la app real.
      logo: { brand: 'rumbo', symbol: '/proyectos/rumbo-simbolo-claro.svg', symbolWidth: 48, symbolHeight: 33, wordmark: 'Rumbo a Casa' },
      // Plano que abre arquitecto desde la portada: `chain` va en línea y `legs` se reparten debajo; `def` es la pieza inicial.
      plan: {
        def: 'reglas', ask: '¿Cómo está armado Rumbo a Casa?',
        chain: [
          { id: 'familia', label: 'Familia', sub: 'Web · español o inglés', text: 'La familia conversa con el asistente en español o inglés y recibe la lista de papeles que necesita.' },
          { id: 'cloudfront', label: 'CloudFront', sub: 'Entrega el sitio', text: 'Entrega el sitio rápido a cualquier familia en Chile.' },
          { id: 'lambda', label: 'Lambda', sub: 'Recibe cada mensaje', text: 'Recibe cada mensaje y llama a las piezas que hacen falta para responder.' },
        ],
        legs: [
          { id: 'bedrock', label: 'Bedrock', sub: 'Conversa', text: 'Es el modelo que entiende lo que la familia cuenta y arma la conversación.' },
          { id: 'reglas', label: 'Motor de reglas', sub: 'Cita el decreto', text: 'Decide a qué subsidio puede postular la familia (DS49, DS1, DS19 o DS52) y cita el decreto detrás de cada respuesta.' },
          { id: 'dynamo', label: 'DynamoDB', sub: 'Datos', text: 'Guarda los datos que el asistente necesita entre un mensaje y otro.' },
          { id: 'polly', label: 'Polly', sub: 'Voz', text: 'Convierte las respuestas en voz para quien prefiere escuchar.' },
        ],
      },
      shots: [
        { src: '/proyectos/portada-rumbo-resultado-movil.webp', width: 480, height: 780 },
        { src: '/proyectos/portada-rumbo-conversacion.webp', width: 480, height: 640 },
        { src: '/proyectos/portada-rumbo-documentos-movil.webp', width: 480, height: 780 },
      ],
    },
    {
      name: 'Inkvibe',
      href: '/proyectos/inkvibe/',
      description: 'Marketplace del tatuaje para Latinoamérica: artistas verificados, cotización y reserva en un solo lugar.',
      role: 'Desarrollador frontend',
      // Logotipo horizontal de inkvibe.app con el nombre en blanco, como en su encabezado sobre fondo oscuro.
      logo: { brand: 'inkvibe', image: '/proyectos/inkvibe-logo-claro.png', width: 1200, height: 281 },
      // Plano que abre arquitecto desde la portada: `chain` va en línea y `legs` se reparten debajo; `def` es la pieza inicial.
      plan: {
        def: 'web', ask: '¿Cómo está armado Inkvibe?',
        chain: [
          { id: 'clientes', label: 'Clientes', sub: 'Buscan artista', text: 'Descubren artistas verificados por estilo y ciudad, en cualquier parte de Latinoamérica.' },
          { id: 'web', label: 'Web', sub: 'React y Next.js', text: 'Es lo que construye Augusto, como único desarrollador frontend: toda la web en React y Next.js.' },
        ],
        legs: [
          { id: 'inkcards', label: 'InkCards', sub: 'Cada artista', text: 'Cada artista tiene su InkCard dentro del marketplace.' },
          { id: 'portafolios', label: 'Portafolios', sub: 'Su trabajo', text: 'Los clientes revisan el portafolio de cada artista antes de elegir.' },
          { id: 'reserva', label: 'Cotizar y reservar', sub: 'Un solo lugar', text: 'El flujo para cotizar y reservar con el artista, sin salir del sitio.' },
          { id: 'backend', label: 'Backend', sub: 'Separado', text: 'La web habla con un backend separado, aparte del frontend que construye Augusto.' },
        ],
      },
      shots: [
        { src: '/proyectos/portada-inkvibe-movil.webp', width: 480, height: 862 },
        { src: '/proyectos/portada-inkvibe-descubre.webp', width: 480, height: 690 },
        { src: '/proyectos/portada-inkvibe-descarga-movil.webp', width: 480, height: 492 },
      ],
    },
    {
      name: 'Zam',
      href: '/proyectos/zam/',
      description: 'Caja, inventario y finanzas del minimarket de barrio: app para el cajero y panel web para el dueño.',
      role: 'Proyecto propio · En desarrollo',
      // Símbolo de Zam (cuadrado redondeado con cuatro círculos superpuestos que dejan pétalos en las esquinas),
      // redibujado en SVG desde la referencia de Augusto, en blanco para la portada; el nombre va en minúsculas en
      // Plus Jakarta Sans 500, la fuente de la marca. Sin capturas todavía: solo el logo.
      logo: { brand: 'zam', symbol: '/proyectos/zam-simbolo-claro.svg', symbolWidth: 466, symbolHeight: 466, wordmark: 'zam' },
      // Plano que abre arquitecto desde la portada: `chain` va en línea y `legs` se reparten debajo; `def` es la pieza inicial.
      plan: {
        def: 'zam', ask: '¿Cómo está armado Zam?',
        chain: [
          { id: 'zam', label: 'Zam', sub: 'Minimarket de barrio', text: 'Caja, inventario y finanzas del minimarket de barrio, en dos superficies pensadas para quien las usa.' },
        ],
        legs: [
          { id: 'app', label: 'App móvil', sub: 'Cajero y dueño', text: 'Para operar con una mano: caja, escáner, mermas, precios, alertas y ventas del día.' },
          { id: 'panel', label: 'Panel web', sub: 'Solo el dueño', text: 'En Next.js, para analizar y administrar: panel financiero, catálogo, gastos, usuarios y alertas.' },
          { id: 'asistente', label: 'Asistente', sub: 'Habla con Zam', text: 'Desde la app se habla con Zam: responde en frases cortas, con la cifra primero.' },
        ],
      },
    },
  ],
};

// Contacto: en vez de formulario, el agente de recepción en su escritorio 3D. "Pasa a la oficina" es la pista
// visible de la función creativa ("Visita mi oficina", en /oficina/; contenido en src/content/office.js).
export const contact = {
  id: 'contacto',
  headline: {
    eyebrow: 'Contacto',
    title: ['Pasa por', 'recepción'],
    lead: '¿Tienes un proyecto, una oportunidad o una idea con IA? Aquí no hay formulario: pasa por recepción y saluda.',
  },
  enter: { label: 'Pasa a la oficina', href: '/oficina/' },
  meta: 'Chile · GMT−3',
  hint: 'Tres clics en recepción y te lleva a la oficina',
  desk: {
    lines: ['¡Hola! Soy recepción', 'Deja tu mensaje para Augusto', '¿Pasas a la oficina? Te llevo', 'Toca el timbre si quieres'],
    follow: '¡Sígueme!',
    // Lo que dice al llegar desde la píldora Contacto de la nav.
    greet: 'Hola, soy recepción. ¿En qué te ayudo?',
    // Lo que dice con el primer y el segundo clic; al tercero te lleva a la oficina.
    tickles: ['¡Jaja, me haces cosquillas!', 'Una vez más y te llevo a la oficina'],
  },
};

// Pie: pregunta grande con la llamada a la oficina, los menús de la nav y, abajo a la izquierda, los tres agentes.
export const footer = {
  brand: { label: 'Augusto Pinto, ir al inicio', href: '/' },
  title: '¿Tienes una idea?',
  cta: { label: 'Pasa a la oficina', href: '/oficina/' },
  nav: {
    label: 'Pie de página',
    items: [
      { label: 'Sobre mí', href: '#sobre-mi' },
      { label: 'Superpoderes', href: '#superpoderes' },
      { label: 'Proyectos', href: '#proyectos' },
      { label: 'Contacto', href: '#contacto' },
      { label: 'GitHub', href: 'https://github.com/augus01', external: true },
    ],
  },
  agents: { label: 'Visita mi oficina: recepción, arquitecto y stack te esperan', href: '/oficina/', items: ['recepcion', 'arquitecto', 'stack'] },
  copyright: '© 2026 Augusto Pinto',
  note: 'Desplegado en AWS Amplify',
  links: [{ label: 'Abrir repositorio', href: 'https://github.com/augus01/portafolio', external: true }],
};
