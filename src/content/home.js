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

export const contact = {
  id: 'contacto',
  headline: {
    eyebrow: 'Lorem ipsum',
    title: 'AMET CONSECTETUR',
    lead: 'Curabitur sodales ligula in libero. Sed dignissim lacinia nunc, curabitur tortor pellentesque nibh.',
  },
};
