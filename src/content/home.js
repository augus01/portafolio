// Contenido del landing. La narrativa es un solo hilo: Hero (promesa) → Sobre mí (quién soy) →
// Superpoderes (cómo construyo) → Proyectos (la prueba) → Oficina (conversa con mis agentes) → Contacto.

export const nav = {
  items: [
    { label: 'Sobre mí', href: '#sobre-mi' },
    { label: 'Superpoderes', href: '#superpoderes' },
    { label: 'Proyectos', href: '#proyectos' },
  ],
  actions: [
    { label: 'GitHub', href: '#' },
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
  cta: { label: 'Escribe un mensaje', href: '#contacto' },
  secondary: { label: 'GitHub', href: '#' },
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

// Superpoderes: retoma el diferenciador de Sobre mí y lo baja a cómo construyo.
export const skills = {
  id: 'superpoderes',
  headline: {
    eyebrow: 'Superpoderes',
    title: 'CÓMO CONSTRUYO',
    lead: 'Quiero hacer el producto que más ayude a las personas. Por eso lo cubro de punta a punta: la interfaz, las funciones con IA y la arquitectura en la nube que lo sostiene.',
  },
  groups: [
    { title: 'Interfaz', description: 'Interfaces que se entienden a la primera y se mueven con intención.',
      items: ['React', 'Vite', 'JavaScript', 'GSAP', 'Three.js'] },
    { title: 'Funcionalidad e IA', description: 'Funciones con IA aplicada a situaciones reales, con reglas que se pueden explicar.',
      items: ['JavaScript', 'Amazon Bedrock'] },
    { title: 'Arquitectura en la nube', description: 'Una base en AWS que sostiene el producto y lo entrega rápido.',
      items: ['AWS Amplify', 'Amazon CloudFront', 'AWS Lambda'] },
  ],
};

export const projects = {
  id: 'proyectos',
  intro: {
    eyebrow: 'Proyectos',
    title: 'LA PRUEBA',
    lead: 'Tres proyectos muestran esos superpoderes en uso: uno con IA para familias, uno de interfaz con un objetivo de negocio y uno que aún estoy construyendo.',
  },
  // Línea de paso hacia la oficina 3D, al cierre de la sección.
  outro: 'Si prefieres conversar antes que leer, entra a la oficina: mis agentes te cuentan cada parte.',
  // Cada proyecto: nombre y rol, descripción y sus cards (el número 01, 02… se genera en orden).
  items: [
    {
      name: 'Rumbo a Casa',
      role: 'Frontend e interfaz',
      description: 'Las familias chilenas deben orientarse entre cuatro subsidios de vivienda del Estado. Construí un asistente que conversa en lenguaje simple, decide la elegibilidad con un motor de reglas que cita el decreto detrás de cada respuesta y arma la lista de documentos para postular. Es una app web en React, bilingüe y mobile-first, sobre CloudFront, Lambda y Bedrock. Ganó la categoría Social Good del hackathon AWS Zero to Shipped.',
      // Sin `image` se muestra el marco de relleno; `alt` describe la imagen.
      // Capturas de la app en vivo (modo demo, familia ficticia), compuestas con la paleta de Rumbo a Casa.
      cards: [
        { title: 'Conversación guiada', image: '/proyectos/rumbo-conversacion.jpg', alt: 'Rumbo a Casa en un teléfono: la conversación con el asistente y el avance de cinco pasos, todos completos' },
        { title: 'Elegibilidad con su fuente', image: '/proyectos/rumbo-resultado.jpg', alt: 'Rumbo a Casa en escritorio: el resultado dice que la familia califica para 3 programas, cada uno con su sello y el decreto que lo respalda' },
        { title: 'Papeles para postular', image: '/proyectos/rumbo-documentos.jpg', alt: 'Rumbo a Casa en escritorio: la lista de documentos de DS49 con su barra de avance y casillas para marcar lo que ya está guardado' },
      ],
    },
    {
      name: 'Inkvibe',
      role: 'Interfaz visual',
      description: 'La web de Inkvibe debía llevar a las personas a descargar la app móvil, el objetivo principal del equipo. Partí de una base existente y construí y mejoré la interfaz visual del landing. El recorrido presenta la app por secciones y cierra en el llamado a descargarla, en escritorio y en móvil. Es la prueba de que lo visual puede servir a un objetivo de negocio.',
      // Capturas directas del landing en vivo (inkvibe.app), recortadas a la proporción de cada card para llenarla entera.
      cards: [
        { title: 'Landing en móvil', image: '/proyectos/inkvibe-movil.jpg', alt: 'Inkvibe en un teléfono: el inicio del landing con el titular contra los malos tatuajes, el botón Descarga la app y los botones de App Store y Google Play' },
        { title: 'Descubre artistas', image: '/proyectos/inkvibe-descubre.jpg', alt: 'Inkvibe en un teléfono: la sección Descubre muestra una galería de tatuajes y un buscador de artistas, con un índice lateral de Descubre, Agenda, Tatúate y Confianza' },
        { title: 'Landing en escritorio', image: '/proyectos/inkvibe-landing.jpg', alt: 'Inkvibe en escritorio: el mismo inicio del landing con el llamado a descargar la app y los botones de App Store y Google Play' },
      ],
    },
    {
      name: 'Zam',
      role: 'Producto en construcción',
      description: 'Zam está en construcción: hoy existen el logo y la idea. El minimarket y la tienda de conveniencia compiten con supermercados que saben y controlan su información, y eso les da una ventaja enorme. Zam busca poner a esos negocios al mismo nivel, con los datos que hoy no tienen. Es el siguiente paso de lo que vengo construyendo: IA y producto al servicio de quien más lo necesita.',
      cards: [
        { title: 'Logo de Zam', alt: 'Logo de Zam' },
        { title: 'El problema', alt: 'Zam: la brecha de información entre el minimarket y el supermercado' },
        { title: 'Hacia dónde va', alt: 'Zam: hacia dónde va el producto' },
      ],
    },
  ],
};

// "Visita mi oficina" (función creativa): cada agente atiende una sección del portafolio.
export const office = {
  id: 'oficina',
  title: 'Visita mi oficina',
  subtitle: 'Gira la maqueta, elige a un agente y pregúntale lo que quieras saber de mí.',
  office: {
    viewsLabel: 'Vista',
    views: [
      { id: 'iso', label: 'Isométrica' },
      { id: 'top', label: 'Planta' },
    ],
    agentsLabel: 'Agentes',
    agents: [
      { id: 'recepcion', name: 'recepción', section: 'Sobre mí',
        role: 'Mi agente de recepción te recibe y te cuenta quién soy y de dónde vengo.',
        questions: ['¿Quién es Augusto?', '¿Cómo empezó en la programación?', '¿Qué quiere construir con IA?'] },
      { id: 'arquitecto', name: 'arquitecto', section: 'Proyectos',
        role: 'Mi agente de proyectos te explica, frente a la pizarra, qué construí y cómo.',
        questions: ['¿Cómo se construyó Rumbo a Casa?', '¿Qué hizo en Inkvibe?', '¿Qué es Zam y en qué etapa está?'] },
      { id: 'stack', name: 'stack', section: 'Superpoderes técnicos',
        role: 'Mi agente de superpoderes te muestra cómo construyo, del diseño a la arquitectura.',
        questions: ['¿Qué tecnologías usa?', '¿Cómo aplica la IA a problemas reales?', '¿Qué hace en AWS?'] },
    ],
    hint: 'Arrastra para girar · clic en un agente',
    note: 'Boceto: aquí se abre el chat del agente',
    closeLabel: 'Volver a la oficina',
    fallback: 'No se pudo abrir la vista 3D en este navegador.',
  },
};

export const contact = {
  id: 'contacto',
  headline: {
    eyebrow: 'Conversemos',
    title: 'CONSTRUYAMOS ALGO JUNTOS',
    lead: 'Recorriste mi historia, mis proyectos y mi oficina. Si tienes una idea o un problema real que resolver, escríbeme y lo conversamos.',
  },
};
