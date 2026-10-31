// Contenido del landing. Es el relleno del artefacto aprobado (lorem ipsum):
// el design system lo prohíbe en producción, así que se reemplaza por textos reales antes de publicar.

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
  cta: { label: 'Hablemos', href: '#contacto' },
  secondary: { label: 'GitHub', href: '#' },
  meta: 'Ingeniería Civil Informática · Chile',
};

export const hero = {
  name: 'AUGUSTO PINTO',
  uppercase: true,
  role: 'Ingeniería Civil Informática',
  location: 'Chile',
  height: 'min(100svh, 900px)',
};

export const about = {
  id: 'sobre-mi',
  // Frase de impacto: los tramos con `muted` van en gris.
  statement: [
    { text: 'Lorem ipsum ' },
    { text: 'dolor sit', muted: true },
    { text: ' amet consectetur, adipiscing elit sed do eiusmod tempor incididunt ut labore.' },
  ],
  paragraphs: [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Curabitur pretium tincidunt lacus, nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.',
  ],
};

export const projects = {
  id: 'proyectos',
  // Cada proyecto: nombre y rol, descripción y sus cards (el número 01, 02… se genera en orden).
  items: [
    {
      name: 'Nombre del proyecto',
      role: 'Rol en el proyecto',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      // Sin `image` se muestra el marco de relleno; `alt` describe la imagen.
      cards: [
        { title: 'Título de la card', alt: 'Imagen de ejemplo' },
        { title: 'Título de la card', alt: 'Imagen de ejemplo' },
        { title: 'Título de la card', alt: 'Imagen de ejemplo' },
      ],
    },
    {
      name: 'Nombre del proyecto',
      role: 'Rol en el proyecto',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      cards: [
        { title: 'Título de la card', alt: 'Imagen de ejemplo' },
        { title: 'Título de la card', alt: 'Imagen de ejemplo' },
        { title: 'Título de la card', alt: 'Imagen de ejemplo' },
      ],
    },
    {
      name: 'Nombre del proyecto',
      role: 'Rol en el proyecto',
      description: 'Curabitur pretium tincidunt lacus, nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.',
      cards: [
        { title: 'Título de la card', alt: 'Imagen de ejemplo' },
        { title: 'Título de la card', alt: 'Imagen de ejemplo' },
        { title: 'Título de la card', alt: 'Imagen de ejemplo' },
      ],
    },
  ],
};

// "Visita mi oficina" (función creativa): cada agente atiende una sección del portafolio.
export const office = {
  id: 'oficina',
  title: 'Visita mi oficina',
  subtitle: 'Gira la maqueta y haz clic en un agente',
  office: {
    viewsLabel: 'Vista',
    views: [
      { id: 'iso', label: 'Isométrica' },
      { id: 'top', label: 'Planta' },
    ],
    agentsLabel: 'Agentes',
    agents: [
      { id: 'recepcion', name: 'recepción', section: 'Sobre mí',
        role: 'Te recibe en la entrada y te cuenta quién soy.',
        questions: ['¿Quién es Augusto?', '¿Qué estudia?', '¿Qué está buscando?'] },
      { id: 'arquitecto', name: 'arquitecto', section: 'Proyectos',
        role: 'Explica mis proyectos y cómo los construí, frente a la pizarra.',
        questions: ['¿Qué es Helix?', '¿Qué hizo en Inkvibe?', '¿Cómo diseña una arquitectura?'] },
      { id: 'stack', name: 'stack', section: 'Superpoderes técnicos',
        role: 'Mis tecnologías, lo que sé de IA y cómo contactarme.',
        questions: ['¿Qué tecnologías usa?', '¿Qué sabe de IA?', '¿Cómo lo contacto?'] },
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
    eyebrow: 'Lorem ipsum',
    title: 'AMET CONSECTETUR',
    lead: 'Curabitur sodales ligula in libero. Sed dignissim lacinia nunc, curabitur tortor pellentesque nibh.',
  },
};
