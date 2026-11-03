// Contenido del landing. La narrativa es un solo hilo: Hero (promesa) → Sobre mí (quién soy) →
// Superpoderes (cómo construyo) → Proyectos (la prueba) → Contacto (recepción, que te lleva a la oficina).

export const nav = {
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
  height: 'min(100svh, 900px)',
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

// Superpoderes ("Con qué construyo", artefacto "Hero"): cinta de logos 3D en dos filas que avanzan en sentidos
// de velocidad distinta; no se detiene. Cada tecnología usa /habilidades/<logo>.webp
// (logos 3D de Vitrum, vista Angle, material Black).
export const skills = {
  id: 'superpoderes',
  // La segunda parte del título va en gris.
  title: ['Con qué', 'construyo'],
  lead: 'Las 17 tecnologías que uso en mis proyectos, de la interfaz al despliegue.',
  rows: [
    [
      { name: 'React', logo: 'react' },
      { name: 'Python', logo: 'python' },
      { name: 'AWS', logo: 'aws' },
      { name: 'Next.js', logo: 'nextjs' },
      { name: 'Node.js', logo: 'nodejs' },
      { name: 'Cloudflare', logo: 'cloudflare' },
      { name: 'TypeScript', logo: 'typescript' },
      { name: 'PostgreSQL', logo: 'postgresql' },
      { name: 'Railway', logo: 'railway' },
    ],
    [
      { name: 'JavaScript', logo: 'javascript' },
      { name: 'Prisma', logo: 'prisma' },
      { name: 'Docker', logo: 'docker' },
      { name: 'Vite', logo: 'vite' },
      { name: 'Supabase', logo: 'supabase' },
      { name: 'GitHub', logo: 'github' },
      { name: 'Material UI', logo: 'material-ui' },
      { name: 'Firebase', logo: 'firebase' },
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
  // Las capturas de cada app siguen en /public/proyectos/ para una futura página de detalle.
  items: [
    {
      name: 'Rumbo a Casa',
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
  hint: 'Clic en el personaje o en el timbre',
  desk: {
    lines: ['¡Hola! Soy recepción', 'Deja tu mensaje para Augusto', '¿Pasas a la oficina? Te llevo', 'Toca el timbre si quieres'],
    follow: '¡Sígueme!',
  },
};

export const footer = {
  links: [{ label: 'Abrir repositorio', href: 'https://github.com/augus01/portafolio', external: true }],
  note: 'Desplegado en AWS Amplify',
};
