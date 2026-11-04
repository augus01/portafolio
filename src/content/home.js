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
    { label: 'Contacto', href: '#contacto' },
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
  // Textos de la ficha que se abre al elegir una tecnología.
  card: { usedIn: 'Dónde lo usé', close: 'Cerrar', open: (name) => `Ver qué logré con ${name}`, dialog: (name) => `Detalle de ${name}`, alt: (name) => `Logo de ${name} en 3D` },
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
    lead: '¿Tienes un proyecto, una práctica o una idea con IA? Aquí no hay formulario: pasa por recepción y saluda.',
  },
  enter: { label: 'Pasa a la oficina', href: '/oficina/' },
  meta: 'Chile · GMT−3',
  hint: 'Tres clics en recepción y te lleva a la oficina',
  desk: {
    lines: ['¡Hola! Soy recepción', 'Deja tu mensaje para Augusto', '¿Pasas a la oficina? Te llevo', 'Toca el timbre si quieres'],
    follow: '¡Sígueme!',
    // Lo que dice con el primer y el segundo clic; al tercero te lleva a la oficina.
    tickles: ['¡Jaja, me haces cosquillas!', 'Una vez más y te llevo a la oficina'],
  },
};

export const footer = {
  links: [{ label: 'Abrir repositorio', href: 'https://github.com/augus01/portafolio', external: true }],
  note: 'Desplegado en AWS Amplify',
};
