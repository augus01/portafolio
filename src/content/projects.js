// Páginas dedicadas de cada proyecto (/proyectos/<slug>/), según las páginas de caso del artefacto "Hero · Augusto Pinto"
// (4 nov 2026: Rumbo a Casa e Inkvibe, escritorio y móvil). Zam no tiene página en el artefacto: usa la misma estructura
// con pantallas hechas en Claude Design sobre los datos de docs/zam-pantallas/ (fuente en docs/zam-pantallas/fuente/).
// vite.config.js lee `caseSlugs` para copiar index.html a cada ruta en el build (por eso solo importa contenido plano).
import { nav as landingNav, mobileMenu as landingMenu, footer as landingFooter } from './home.js';

const dir = '/proyectos/casos';

// La misma nav del landing (píldoras en escritorio, barra y menú en móvil), con las anclas apuntando al landing y
// Proyectos marcado como sección actual.
const toLanding = (item) => ({ ...item, href: item.href.startsWith('#') ? `/${item.href}` : item.href, current: item.href === '#proyectos' });

// Textos compartidos de la página de caso.
export const casePage = {
  nav: {
    brand: landingNav.brand,
    items: landingNav.items.map(toLanding),
    actions: landingNav.actions.map(toLanding),
  },
  // El mismo pie del landing, con las anclas apuntando al landing.
  footer: { ...landingFooter, nav: { ...landingFooter.nav, items: landingFooter.nav.items.map((i) => ({ ...toLanding(i), current: false })) } },
  mobileMenu: {
    ...landingMenu,
    links: landingMenu.links.map(toLanding),
    cta: toLanding(landingMenu.cta),
    secondary: toLanding(landingMenu.secondary),
  },
  back: { label: 'Volver a proyectos', href: '/#proyectos' },
  projectLabel: 'El proyecto',
  linksLabel: 'Enlaces del proyecto',
  stackLabel: 'Stack',
  coverLabel: 'Portada del proyecto',
  next: { label: 'Otros proyectos', all: 'Ver todos los proyectos', allHref: '/#proyectos' },
  documentTitle: (name) => `${name} · Proyecto · Augusto Pinto`,
};

// `theme`: color de marca (portada y escenarios de marca), fondo de los escenarios, acento, círculo del enlace principal
// y color con que aparece en "Otros proyectos". `stages`: secciones a sangre; cada bloque es un dispositivo con su
// captura (laptop, teléfonos, tablet + teléfono) o texto.
export const cases = [
  {
    slug: 'rumbo-a-casa',
    name: 'Rumbo a Casa',
    eyebrow: 'Social good',
    meta: [
      { label: 'Rol', value: 'Co-creador' },
      { label: 'Reconocimiento', value: 'Ganador Social Good · AWS Zero to Shipped' },
      { label: 'Lugar y año', value: 'Chile © 2026' },
    ],
    theme: { brand: '#16406f', tint: '#e7e1d6', cta: '#b5542e', onCta: '#ffffff', next: '#16406f' },
    cta: { label: 'Ver la app', href: 'https://d26duk07atmc3z.cloudfront.net/' },
    cover: {
      badge: 'Ganador · AWS Zero to Shipped',
      logo: { brand: 'rumbo', symbol: '/proyectos/rumbo-simbolo-claro.svg', symbolWidth: 48, symbolHeight: 33, wordmark: 'Rumbo a Casa' },
      phones: [
        { src: `${dir}/rumbo-tel-conversacion.webp`, alt: 'Conversación en el teléfono: los cinco pasos completados y el modo demo activo' },
        { src: `${dir}/rumbo-tel-inicio.webp`, alt: 'Inicio en el teléfono: Find out which housing subsidy you can apply for' },
        { src: `${dir}/rumbo-tel-plan.webp`, alt: 'Plan en el teléfono: You qualify for 3 programs, con DS49 marcado como You qualify' },
      ],
    },
    intro: {
      links: [
        { label: 'Ver la app', href: 'https://d26duk07atmc3z.cloudfront.net/' },
        { label: 'Abrir repositorio', href: 'https://github.com/BlasterLc/rumbo-a-casa' },
      ],
      stack: ['CloudFront', 'Lambda', 'Bedrock', 'DynamoDB', 'Polly'],
      lead: 'Un asistente que guía a familias chilenas por cuatro subsidios habitacionales del Estado y les dice a cuál pueden postular, con la fuente de cada respuesta.',
      body: 'Conversa en español o inglés, por texto o por voz. Un motor de reglas decide la elegibilidad y cita el decreto y su fecha detrás de cada resultado; después arma la lista de papeles que conviene reunir. La familia aprieta el botón final en el sitio del MINVU con su Clave Única: la app nunca se la pide. Lo construimos para la hackathon AWS Zero to Shipped y ganó la categoría Social Good.',
    },
    facts: [
      { n: '4', l: 'Subsidios evaluados: DS49, DS1, DS19 y DS52' },
      { n: '2', l: 'Idiomas, por texto o por voz' },
      { n: '~5 min', l: 'Para saber a qué puedes postular' },
      { n: '0', l: 'Claves Únicas pedidas' },
    ],
    stages: [
      {
        tone: 'tint', label: 'Escritorio',
        blocks: [
          { type: 'laptop', shot: { src: `${dir}/rumbo-web-inicio.webp`, alt: 'Inicio de Rumbo a Casa en escritorio: título, programas DS49, DS1, DS19 y DS52, y el panel You apply. We get you ready.' },
            caption: { n: '01 — Inicio', text: 'Antes de empezar, la portada deja claro qué hace la herramienta y qué queda en manos de la familia.' } },
          { type: 'laptop', shot: { src: `${dir}/rumbo-web-conversacion.webp`, alt: 'Conversación en escritorio: el asistente explica que la familia califica para DS49, DS19 y DS52 y no para DS1, con el progreso de cinco pasos al lado' },
            caption: { n: '02 — Conversación', text: 'Cinco pasos: familia, vivienda, ahorro, ingreso y región. Cada respuesta se puede escuchar.' } },
        ],
      },
      {
        tone: 'brand', label: 'Tablet y teléfono',
        blocks: [
          { type: 'duo',
            copy: { n: '03 — Resultado con fuentes', title: 'Cada respuesta cita su decreto.', text: 'El plan muestra cada programa con su sello, la razón y la fuente: el decreto, la resolución y la fecha de la regla aplicada. Si un programa no aplica, dice cuánto falta.' },
            tablet: { src: `${dir}/rumbo-tablet-inicio.webp`, alt: 'Inicio de Rumbo a Casa en tablet' },
            phone: { src: `${dir}/rumbo-tel-documentos.webp`, alt: "Documentos en el teléfono: You don't need to upload anything, y la lista por programa con 1 of 7 ready" } },
        ],
      },
      {
        tone: 'tint', label: 'Plan y móvil',
        blocks: [
          { type: 'laptop', shot: { src: `${dir}/rumbo-web-plan.webp`, alt: 'Plan en escritorio: You qualify for 3 programs, con tarjetas de DS49, DS19, DS52 y DS1 y la fuente de cada una' },
            caption: { n: '04 — Mi plan', text: 'Los programas a los que la familia califica y los que no, cada uno con su razón y el acceso a sus documentos.' } },
          { type: 'phones',
            shots: [
              { src: `${dir}/rumbo-tel-conversacion.webp`, alt: 'Conversación en el teléfono' },
              { src: `${dir}/rumbo-tel-plan.webp`, alt: 'Plan en el teléfono' },
              { src: `${dir}/rumbo-tel-documentos.webp`, alt: 'Documentos en el teléfono' },
            ],
            caption: { n: '05 — Móvil', text: 'En el teléfono la navegación baja al pulgar: Talk, My plan, Documents y Alerts.' } },
        ],
      },
    ],
  },
  {
    slug: 'inkvibe',
    name: 'Inkvibe',
    eyebrow: 'Marketplace',
    meta: [
      { label: 'Rol', value: 'Desarrollador frontend' },
      { label: 'Equipo', value: 'Único frontend, con un backend separado' },
      { label: 'Lugar y año', value: 'Latinoamérica © 2026' },
    ],
    theme: { brand: '#2a2a2c', tint: '#313131', tintInk: '#ffffff', accent: '#c8403f', cta: '#c8403f', onCta: '#ffffff', next: '#d64d4b', dark: true },
    cta: { label: 'Ver sitio', href: 'https://www.inkvibe.app/' },
    cover: {
      badge: 'inkvibe.app',
      logo: { brand: 'inkvibe', image: '/proyectos/inkvibe-logo-claro.png', width: 1200, height: 281, alt: 'Inkvibe' },
      phones: [
        { src: `${dir}/inkvibe-tel-catalogo.webp`, alt: 'Catálogo en el teléfono: Encuentra al artista correcto' },
        { src: `${dir}/inkvibe-tel-landing.webp`, alt: 'Landing en el teléfono: No queremos más malos tatuajes, ni malas experiencias' },
        { src: `${dir}/inkvibe-tel-descarga.webp`, alt: 'Sección roja en el teléfono: Encuentra a tu artista. Descarga InkVibe.' },
      ],
    },
    intro: {
      links: [
        { label: 'Ver sitio', href: 'https://www.inkvibe.app/' },
        { label: 'Leer el blog', href: 'https://www.inkvibe.app/blog' },
      ],
      stack: ['Next.js', 'React', 'Payload CMS', 'PostgreSQL'],
      lead: 'El marketplace del tatuaje para Latinoamérica: los clientes descubren artistas verificados por estilo y ciudad, revisan portafolios reales, cotizan y reservan en un solo lugar.',
      body: 'Soy el único desarrollador frontend del equipo y construyo la web con React y Next.js sobre un backend separado. El blog corre en Payload CMS con su Local API sobre un Postgres dedicado: las páginas leen el contenido directo desde el servidor y el equipo lo edita desde el panel, sin tocar código. Cada artista tiene su InkCard, un perfil que comparte con un link.',
    },
    facts: [
      { n: '4', l: 'Superficies de producto en el plan' },
      { n: '9', l: 'Semanas de plan de trabajo' },
      { n: '6', l: 'Estilos para filtrar artistas' },
      { n: '1', l: 'Desarrollador frontend: yo' },
    ],
    stages: [
      {
        tone: 'tint', label: 'Landing en escritorio',
        blocks: [
          { type: 'laptop', shot: { src: `${dir}/inkvibe-web-landing.webp`, alt: 'Landing de Inkvibe en escritorio: No queremos más malos tatuajes, ni malas experiencias, con Descarga la app' },
            caption: { n: '01 — Landing', text: 'Una promesa directa arriba y una sola acción: descargar la app.' } },
          { type: 'laptop', shot: { src: `${dir}/inkvibe-web-funcionalidades.webp`, alt: 'Funcionalidades en escritorio: 02 Agenda, Reserva tu hora de manera segura, con el teléfono mostrando Reserva asegurada' },
            caption: { n: '02 — Funcionalidades', text: 'Descubre, Agenda, Tatúate y Confianza: un recorrido con scroll donde el teléfono cuenta cada paso.' } },
        ],
      },
      {
        tone: 'accent', label: 'Sección roja del landing',
        blocks: [
          { type: 'split', n: '03 — Sección de descarga', title: 'Tatuarse debería ser simple.',
            text: 'El cierre del landing es rojo y lleva a las tiendas: beneficios en tres chips y un teléfono con la actividad del día en vivo, de la cotización al recordatorio.' },
          { type: 'combo',
            laptop: { src: `${dir}/inkvibe-web-descarga.webp`, alt: 'Sección roja en escritorio: Encuentra a tu artista. Descarga InkVibe., con App Store, Google Play y un teléfono con notificaciones' },
            phone: { src: `${dir}/inkvibe-tel-descarga.webp`, alt: 'Sección roja en el teléfono' } },
        ],
      },
      {
        tone: 'tint', label: 'Tablet y teléfono',
        blocks: [
          { type: 'duo',
            copy: { n: '04 — Todas las pantallas', title: 'La misma web, de la tablet al teléfono.', text: 'El catálogo filtra por ciudad y por seis estilos y muestra el portafolio completo antes de cotizar. En el teléfono los filtros se pliegan en un solo botón.' },
            tablet: { src: `${dir}/inkvibe-tablet-landing.webp`, alt: 'Landing de Inkvibe en tablet' },
            phone: { src: `${dir}/inkvibe-tel-artista.webp`, alt: 'Catálogo en el teléfono: 2 artistas en Chile, con la tarjeta de un artista y sus estilos' } },
          { type: 'phones',
            shots: [
              { src: `${dir}/inkvibe-tel-landing.webp`, alt: 'Landing en el teléfono' },
              { src: `${dir}/inkvibe-tel-catalogo.webp`, alt: 'Catálogo de artistas en el teléfono' },
              { src: `${dir}/inkvibe-tel-descarga.webp`, alt: 'Sección de descarga en el teléfono' },
            ],
            caption: { n: '05 — Móvil', text: 'Landing, catálogo y descarga en el teléfono.' } },
        ],
      },
      {
        tone: 'light', label: 'Blog',
        blocks: [
          { type: 'duo', wide: true,
            copy: { n: '06 — Blog', title: 'El blog vive en Payload CMS.', text: 'Payload corre dentro de Next.js y su Local API consulta un Postgres dedicado sin pasar por HTTP. El equipo publica guías y cultura tattoo desde el panel.' },
            laptop: { src: `${dir}/inkvibe-web-blog.webp`, alt: 'Sección de blog en el landing: Ideas, guías y cultura tattoo, con el artículo Cómo elegir a tu tatuador(a)' } },
        ],
      },
    ],
  },
  {
    slug: 'zam',
    name: 'Zam',
    eyebrow: 'Retail de barrio',
    meta: [
      { label: 'Rol', value: 'Proyecto propio' },
      { label: 'Estado', value: 'En desarrollo' },
      { label: 'Lugar y año', value: 'Chile © 2026' },
    ],
    theme: { brand: 'var(--surface-inverse)', tint: 'var(--surface-sunken)', next: 'var(--surface-inverse)' },
    cover: {
      badge: 'En desarrollo',
      logo: { brand: 'zam', symbol: '/proyectos/zam-simbolo-claro.svg', symbolWidth: 466, symbolHeight: 466, wordmark: 'zam' },
      phones: [
        { src: `${dir}/zam-tel-caja.webp`, alt: 'Caja del cajero en el teléfono: venta en curso de $7.342 con pan a granel y una línea sin código' },
        { src: `${dir}/zam-tel-alerta.webp`, alt: 'Alerta en el teléfono: al ritmo actual te quedan unos 4 días de Leche entera 1L' },
        { src: `${dir}/zam-tel-asistente.webp`, alt: 'Conversación con Zam en el teléfono: un gasto de $48.600 leído desde la foto de una boleta' },
      ],
    },
    intro: {
      links: [],
      stack: ['TypeScript', 'NestJS', 'Fastify', 'Next.js', 'Expo', 'PostgreSQL', 'Prisma', 'Supabase', 'Firebase Auth'],
      lead: 'Caja, inventario y finanzas para el minimarket de barrio: el control de un supermercado, hecho para un almacén.',
      body: 'Es mi proyecto propio y está en su primer hito: el backend se está construyendo módulo por módulo. Las pantallas de esta página son diseños del producto, hechos sobre una tienda de ejemplo con cifras que calzan entre sí. Muestran lo que viene: el cajero vende desde la app aunque el producto no esté en el catálogo, y el dueño ve cuánto vendió, qué le queda en bodega y cuánto le costó cada lote, con avisos que le dicen qué pasa y qué hacer.',
    },
    facts: [
      { n: '2', l: 'Superficies: app del cajero y panel web del dueño' },
      { n: '7', l: 'Módulos del backend: identidad, inventario, ventas, proveedores, finanzas, alertas y asistente' },
      { n: '7', l: 'Tipos de alerta que explican y proponen' },
      { n: '1', l: 'Lenguaje de punta a punta: TypeScript' },
    ],
    stages: [
      {
        tone: 'tint', label: 'El dueño en la web',
        blocks: [
          { type: 'laptop', shot: { src: `${dir}/zam-web-inicio.webp`, alt: 'Inicio del dueño en escritorio: Cómo va hoy, con $612.480 en ventas, 148 boletas y cuatro cosas para revisar' },
            caption: { n: '01 — Cómo va hoy', text: 'Ventas, caja y boletas del día en una fila, y al lado lo que hay que resolver, cada aviso con su acción.' } },
          { type: 'laptop', shot: { src: `${dir}/zam-web-ingreso.webp`, alt: 'Nuevo ingreso de mercadería en escritorio: cuatro productos de Distribuidora Sur con el flete repartido y el costo final por unidad' },
            caption: { n: '02 — Ingreso de mercadería', text: 'El flete se reparte entre los productos y cada lote guarda su costo real y su vencimiento, como en un supermercado.' } },
        ],
      },
      {
        tone: 'light', label: 'En la tienda',
        blocks: [
          { type: 'split', n: '03 — La app', title: 'Vender sin trabas, avisar a tiempo.',
            text: 'El cajero cobra con fila esperando: si un producto no tiene código, lo agrega y sigue. Al dueño le llegan avisos con la cifra y el plazo, y Zam le arma el gasto desde la foto de una boleta para que solo confirme.' },
          { type: 'phones',
            shots: [
              { src: `${dir}/zam-tel-caja.webp`, alt: 'Caja del cajero: venta en curso con el botón Cobrar $7.342' },
              { src: `${dir}/zam-tel-alerta.webp`, alt: 'Alerta de quiebre de Leche entera 1L con el botón Pedir a Lácteos del Maipo' },
              { src: `${dir}/zam-tel-asistente.webp`, alt: 'Borrador de gasto de gas licuado por $48.600 con los botones Guardar gasto y Corregir' },
            ],
            caption: { n: '04 — Móvil', text: 'Caja, alerta de quiebre y asistente: tres momentos del día de un almacén.' } },
        ],
      },
      {
        tone: 'brand', label: 'Cómo está armado',
        blocks: [
          { type: 'split', n: '05 — Arquitectura', title: 'Un backend por módulos, dos pantallas encima.',
            text: 'El backend corre en NestJS con Fastify y separa cada módulo en dominio, aplicación e infraestructura. La web y la app hablan el mismo lenguaje que el servidor.' },
          { type: 'columns',
            items: [
              { n: 'App del cajero', title: 'Expo', text: 'La caja del minimarket: el cajero registra cada venta desde el teléfono.' },
              { n: 'Panel del dueño', title: 'Next.js', text: 'Ventas, catálogo, gastos y stock de la tienda en un solo lugar.' },
              { n: 'Backend', title: 'NestJS + Fastify', text: 'Módulos de inventario, ventas y proveedores, en capas de dominio, aplicación e infraestructura.' },
              { n: 'Datos e identidad', title: 'Postgres + Firebase', text: 'Tiendas, catálogo, stock, ventas y proveedores en Postgres sobre Supabase con Prisma; Firebase Auth para dueños y cajeros.' },
            ] },
        ],
      },
      {
        tone: 'light', label: 'Próxima etapa',
        blocks: [
          { type: 'split', n: '06 — Próxima etapa', title: 'Ver la tienda como la ve un supermercado.',
            text: 'El plan es armar la tienda en 3D, estante por estante: qué hay en cada uno, dónde compran más los clientes y cuándo se va a vaciar un producto, para pedirlo antes de que falte.' },
          { type: 'laptop', shot: { src: `${dir}/zam-web-mapa-3d.webp`, alt: 'Próxima etapa, imagen referencial: planta 3D del minimarket con zonas de calor de compra y el estante de lácteos seleccionado' },
            caption: { n: '07 — Próxima etapa · imagen referencial', text: 'Zonas de calor sobre la planta y el aviso de quiebre en el estante donde ocurre. Todavía no está construido.' } },
        ],
      },
    ],
  },
];

export const caseSlugs = cases.map((c) => c.slug);
export const caseHref = (slug) => `/proyectos/${slug}/`;

// Datos de la página de un proyecto, con su número y los otros proyectos, empezando por el siguiente (en bucle).
export function getCase(slug) {
  const i = cases.findIndex((c) => c.slug === slug);
  if (i < 0) return null;
  const others = cases.slice(i + 1).concat(cases.slice(0, i))
    .map((o) => ({ name: o.name, href: caseHref(o.slug), color: o.theme.next, logo: o.cover.logo }));
  const pad = (n) => String(n).padStart(2, '0');
  return {
    ...cases[i],
    index: `Proyecto ${pad(i + 1)} / ${pad(cases.length)}`,
    others,
  };
}
