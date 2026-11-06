// English version of ../projects.js, with the same shape (same keys, array lengths and types).
import { nav as landingNav, mobileMenu as landingMenu, footer as landingFooter } from './home.js';
import { caseHref } from '../projects.js';

export { caseSlugs, caseHref } from '../projects.js';

const dir = '/proyectos/casos';

// The same nav as the landing page (pills on desktop, bar and menu on mobile), with anchors pointing to the landing
// page and Projects marked as the current section.
const toLanding = (item) => ({ ...item, href: item.href.startsWith('#') ? `/${item.href}` : item.href, current: item.href === '#proyectos' });

// Copy shared by every case page.
export const casePage = {
  nav: {
    brand: landingNav.brand,
    labels: landingNav.labels,
    items: landingNav.items.map(toLanding),
    actions: landingNav.actions.map(toLanding),
  },
  // The same footer as the landing page, with anchors pointing to the landing page.
  footer: { ...landingFooter, nav: { ...landingFooter.nav, items: landingFooter.nav.items.map((i) => ({ ...toLanding(i), current: false })) } },
  mobileMenu: {
    ...landingMenu,
    links: landingMenu.links.map(toLanding),
    cta: toLanding(landingMenu.cta),
    secondary: toLanding(landingMenu.secondary),
  },
  back: { label: 'Back to projects', href: '/#proyectos' },
  projectLabel: 'The project',
  linksLabel: 'Project links',
  stackLabel: 'Stack',
  coverLabel: 'Project cover',
  next: { label: 'More projects', all: 'See all projects', allHref: '/#proyectos' },
  documentTitle: (name) => `${name} · Project · Augusto Pinto`,
};

export const cases = [
  {
    slug: 'rumbo-a-casa',
    name: 'Rumbo a Casa',
    eyebrow: 'Social good',
    meta: [
      { label: 'Role', value: 'Co-creator' },
      { label: 'Recognition', value: 'Social Good winner · AWS Zero to Shipped' },
      { label: 'Place and year', value: 'Chile · 2026' },
    ],
    theme: { brand: '#16406f', tint: '#e7e1d6', cta: '#b5542e', onCta: '#ffffff', next: '#16406f' },
    cta: { label: 'Open the app', href: 'https://d26duk07atmc3z.cloudfront.net/' },
    cover: {
      badge: 'Winner · AWS Zero to Shipped',
      logo: { brand: 'rumbo', symbol: '/proyectos/rumbo-simbolo-claro.svg', symbolWidth: 48, symbolHeight: 33, wordmark: 'Rumbo a Casa' },
      phones: [
        { src: `${dir}/rumbo-tel-conversacion.webp`, alt: 'Conversation on a phone: all five steps completed and demo mode on' },
        { src: `${dir}/rumbo-tel-inicio.webp`, alt: 'Home screen on a phone: Find out which housing subsidy you can apply for' },
        { src: `${dir}/rumbo-tel-plan.webp`, alt: 'Plan screen on a phone: You qualify for 3 programs, with DS49 marked as You qualify' },
      ],
    },
    intro: {
      links: [
        { label: 'Open the app', href: 'https://d26duk07atmc3z.cloudfront.net/' },
        { label: 'Open repository', href: 'https://github.com/BlasterLc/rumbo-a-casa' },
      ],
      stack: ['CloudFront', 'Lambda', 'Bedrock', 'DynamoDB', 'Polly'],
      lead: 'An assistant that walks Chilean families through four state housing subsidies and tells them which ones they can apply for, with the source behind every answer.',
      body: 'It talks in Spanish or English, by text or by voice. A rules engine decides eligibility and cites the decree and its date behind each result; then it builds the list of documents worth gathering. The family presses the final button on the MINVU site with their Clave Unica: the app never asks for it. We built it for the AWS Zero to Shipped hackathon and it won the Social Good category.',
    },
    facts: [
      { n: '4', l: 'Subsidies evaluated: DS49, DS1, DS19 and DS52' },
      { n: '2', l: 'Languages, by text or by voice' },
      { n: '~5 minutes', l: 'To find out what you can apply for' },
      { n: '0', l: 'Clave Unica credentials requested' },
    ],
    stages: [
      {
        tone: 'tint', label: 'Desktop',
        blocks: [
          { type: 'laptop', shot: { src: `${dir}/rumbo-web-inicio.webp`, alt: 'Rumbo a Casa home page on desktop: headline, the DS49, DS1, DS19 and DS52 programs, and the panel You apply. We get you ready.' },
            caption: { n: '01 — Home', text: 'Before starting, the cover makes clear what the tool does and what stays in the family\'s hands.' } },
          { type: 'laptop', shot: { src: `${dir}/rumbo-web-conversacion.webp`, alt: 'Conversation on desktop: the assistant explains that the family qualifies for DS49, DS19 and DS52 but not for DS1, with the five-step progress alongside' },
            caption: { n: '02 — Conversation', text: 'Five steps: family, housing, savings, income and region. Every answer can be played aloud.' } },
        ],
      },
      {
        tone: 'brand', label: 'Tablet and phone',
        blocks: [
          { type: 'duo',
            copy: { n: '03 — Results with sources', title: 'Every answer cites its decree.', text: 'The plan shows each program with its badge, the reason and the source: the decree, the resolution and the date of the rule applied. If a program does not apply, it says how far off the family is.' },
            tablet: { src: `${dir}/rumbo-tablet-inicio.webp`, alt: 'Rumbo a Casa home page on a tablet' },
            phone: { src: `${dir}/rumbo-tel-documentos.webp`, alt: "Documents screen on a phone: You don't need to upload anything, and the list by program showing 1 of 7 ready" } },
        ],
      },
      {
        tone: 'tint', label: 'Plan and mobile',
        blocks: [
          { type: 'laptop', shot: { src: `${dir}/rumbo-web-plan.webp`, alt: 'Plan on desktop: You qualify for 3 programs, with cards for DS49, DS19, DS52 and DS1 and the source of each one' },
            caption: { n: '04 — My plan', text: 'The programs the family qualifies for and those it does not, each with its reason and a link to its documents.' } },
          { type: 'phones',
            shots: [
              { src: `${dir}/rumbo-tel-conversacion.webp`, alt: 'Conversation on a phone' },
              { src: `${dir}/rumbo-tel-plan.webp`, alt: 'Plan on a phone' },
              { src: `${dir}/rumbo-tel-documentos.webp`, alt: 'Documents on a phone' },
            ],
            caption: { n: '05 — Mobile', text: 'On the phone, navigation drops to the thumb: Talk, My plan, Documents and Alerts.' } },
        ],
      },
    ],
  },
  {
    slug: 'inkvibe',
    name: 'Inkvibe',
    eyebrow: 'Marketplace',
    meta: [
      { label: 'Role', value: 'Frontend developer' },
      { label: 'Team', value: 'Only frontend developer, working with a separate backend' },
      { label: 'Place and year', value: 'Latin America · 2026' },
    ],
    theme: { brand: '#2a2a2c', tint: '#313131', tintInk: '#ffffff', accent: '#c8403f', cta: '#c8403f', onCta: '#ffffff', next: '#d64d4b', dark: true },
    cta: { label: 'Visit site', href: 'https://www.inkvibe.app/' },
    cover: {
      badge: 'inkvibe.app',
      logo: { brand: 'inkvibe', image: '/proyectos/inkvibe-logo-claro.png', width: 1200, height: 281, alt: 'Inkvibe logo' },
      phones: [
        { src: `${dir}/inkvibe-tel-catalogo.webp`, alt: 'Catalog on a phone: "Find the right artist"' },
        { src: `${dir}/inkvibe-tel-landing.webp`, alt: 'Landing page on a phone: "We don\'t want any more bad tattoos or bad experiences"' },
        { src: `${dir}/inkvibe-tel-descarga.webp`, alt: 'Red section on a phone: "Find your artist. Download InkVibe."' },
      ],
    },
    intro: {
      links: [
        { label: 'Visit site', href: 'https://www.inkvibe.app/' },
        { label: 'Read the blog', href: 'https://www.inkvibe.app/blog' },
      ],
      stack: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Mantine', 'Material UI', 'TanStack Query', 'Payload CMS', 'PostgreSQL', 'Prisma', 'Supabase', 'Docker', 'Railway'],
      lead: 'The tattoo marketplace for Latin America: clients discover verified artists by style and city, browse real portfolios, get quotes and book, all in one place.',
      body: 'I am the team\'s only frontend developer and I build the web app with React and Next.js on top of a separate backend. The blog runs on Payload CMS with its Local API over a dedicated Postgres: pages read the content straight from the server and the team edits it from the admin panel, without touching code. Every artist has an InkCard, a profile they share with a link.',
    },
    facts: [
      { n: '4', l: 'Product surfaces in the plan' },
      { n: '9', l: 'Weeks in the work plan' },
      { n: '6', l: 'Styles to filter artists by' },
      { n: '1', l: 'Frontend developer: me' },
    ],
    stages: [
      {
        tone: 'tint', label: 'Landing page on desktop',
        blocks: [
          { type: 'laptop', shot: { src: `${dir}/inkvibe-web-landing.webp`, alt: 'Inkvibe landing page on desktop: "We don\'t want any more bad tattoos or bad experiences", with a Download the app button' },
            caption: { n: '01 — Landing', text: 'A direct promise at the top and a single action: download the app.' } },
          { type: 'laptop', shot: { src: `${dir}/inkvibe-web-funcionalidades.webp`, alt: 'Features on desktop: 02 Schedule, "Book your slot securely", with the phone showing a confirmed booking' },
            caption: { n: '02 — Features', text: 'Discover, Schedule, Get inked and Trust: a scroll-driven walkthrough where the phone tells each step.' } },
        ],
      },
      {
        tone: 'accent', label: 'Red section of the landing page',
        blocks: [
          { type: 'split', n: '03 — Download section', title: 'Getting a tattoo should be simple.',
            text: 'The landing page closes in red and sends people to the app stores: three benefit chips and a phone showing the day\'s activity live, from quote to reminder.' },
          { type: 'combo',
            laptop: { src: `${dir}/inkvibe-web-descarga.webp`, alt: 'Red section on desktop: "Find your artist. Download InkVibe.", with App Store, Google Play and a phone showing notifications' },
            phone: { src: `${dir}/inkvibe-tel-descarga.webp`, alt: 'Red section on a phone' } },
        ],
      },
      {
        tone: 'tint', label: 'Tablet and phone',
        blocks: [
          { type: 'duo',
            copy: { n: '04 — Every screen', title: 'The same site, from tablet to phone.', text: 'The catalog filters by city and by six styles and shows the full portfolio before you ask for a quote. On the phone, the filters fold into a single button.' },
            tablet: { src: `${dir}/inkvibe-tablet-landing.webp`, alt: 'Inkvibe landing page on a tablet' },
            phone: { src: `${dir}/inkvibe-tel-artista.webp`, alt: 'Catalog on a phone: 2 artists in Chile, with an artist card and their styles' } },
          { type: 'phones',
            shots: [
              { src: `${dir}/inkvibe-tel-landing.webp`, alt: 'Landing page on a phone' },
              { src: `${dir}/inkvibe-tel-catalogo.webp`, alt: 'Artist catalog on a phone' },
              { src: `${dir}/inkvibe-tel-descarga.webp`, alt: 'Download section on a phone' },
            ],
            caption: { n: '05 — Mobile', text: 'Landing page, catalog and download on the phone.' } },
        ],
      },
      {
        tone: 'light', label: 'Blog',
        blocks: [
          { type: 'duo', wide: true,
            copy: { n: '06 — Blog', title: 'The blog lives in Payload CMS.', text: 'Payload runs inside Next.js and its Local API queries a dedicated Postgres without going over HTTP. The team publishes guides and tattoo culture from the admin panel.' },
            laptop: { src: `${dir}/inkvibe-web-blog.webp`, alt: 'Blog section on the landing page: "Ideas, guides and tattoo culture", with the article "How to choose your tattoo artist"' } },
        ],
      },
    ],
  },
  {
    slug: 'zam',
    name: 'Zam',
    eyebrow: 'Neighborhood retail',
    meta: [
      { label: 'Role', value: 'Personal project' },
      { label: 'Status', value: 'In development' },
      { label: 'Place and year', value: 'Chile · 2026' },
    ],
    theme: { brand: 'var(--surface-inverse)', tint: 'var(--surface-sunken)', cta: 'var(--surface-inverse)', onCta: 'var(--ink-on-dark)', next: 'var(--surface-inverse)' },
    // No public app yet: instead of "Open the app", an architect works on the blueprint inside the circle.
    building: { label: 'Under construction' },
    cover: {
      badge: 'In development',
      logo: { brand: 'zam', symbol: '/proyectos/zam-simbolo-claro.svg', symbolWidth: 466, symbolHeight: 466, wordmark: 'zam' },
      phones: [
        { src: `${dir}/zam-tel-caja.webp`, alt: 'Cashier screen on a phone: a sale in progress for $7.342 with bulk bread and one item without a barcode' },
        { src: `${dir}/zam-tel-alerta.webp`, alt: 'Alert on a phone: at the current pace you have about 4 days of Whole milk 1L left' },
        { src: `${dir}/zam-tel-asistente.webp`, alt: 'Conversation with Zam on a phone: a $48.600 expense read from a photo of a receipt' },
      ],
    },
    intro: {
      links: [],
      stack: ['TypeScript', 'NestJS', 'Fastify', 'Next.js', 'Expo', 'PostgreSQL', 'Prisma', 'Supabase', 'Firebase Auth'],
      lead: 'Checkout, inventory and finances for the neighborhood corner store: supermarket-grade control, built for a small shop.',
      body: 'It is my own project and it is at its first milestone: the backend is being built module by module. The screens on this page are product designs, made on a sample store with figures that add up. They show what is coming: the cashier sells from the app even when a product is not in the catalog, and the owner sees how much was sold, what is left in the stockroom and what each batch cost, with alerts that say what is happening and what to do.',
    },
    facts: [
      { n: '2', l: 'Surfaces: the cashier app and the owner\'s web dashboard' },
      { n: '7', l: 'Backend modules: identity, inventory, sales, suppliers, finances, alerts and assistant' },
      { n: '7', l: 'Alert types that explain and propose' },
      { n: '1', l: 'One language end to end: TypeScript' },
    ],
    stages: [
      {
        tone: 'tint', label: 'The owner on the web',
        blocks: [
          { type: 'laptop', shot: { src: `${dir}/zam-web-inicio.webp`, alt: 'Owner home on desktop: "How it\'s going today", with $612.480 in sales, 148 receipts and four things to review' },
            caption: { n: '01 — How it\'s going today', text: 'The day\'s sales, cash and receipts in one row, and next to them what needs sorting out, each alert with its action.' } },
          { type: 'laptop', shot: { src: `${dir}/zam-web-ingreso.webp`, alt: 'New stock intake on desktop: four products from Distribuidora Sur with freight split across them and the final cost per unit' },
            caption: { n: '02 — Stock intake', text: 'Freight is spread across the products and each batch keeps its real cost and expiry date, just like in a supermarket.' } },
        ],
      },
      {
        tone: 'light', label: 'In the store',
        blocks: [
          { type: 'split', n: '03 — The app', title: 'Sell without friction, warn in time.',
            text: 'The cashier charges with a line waiting: if a product has no barcode, they add it and keep going. The owner gets alerts with the figure and the deadline, and Zam drafts the expense from a photo of a receipt so they only have to confirm.' },
          { type: 'phones',
            shots: [
              { src: `${dir}/zam-tel-caja.webp`, alt: 'Cashier screen: a sale in progress with the Charge $7.342 button' },
              { src: `${dir}/zam-tel-alerta.webp`, alt: 'Stock-out alert for Whole milk 1L with the Order from Lacteos del Maipo button' },
              { src: `${dir}/zam-tel-asistente.webp`, alt: 'Draft expense for bottled gas at $48.600 with the Save expense and Fix buttons' },
            ],
            caption: { n: '04 — Mobile', text: 'Checkout, stock-out alert and assistant: three moments in a corner store\'s day.' } },
        ],
      },
      {
        tone: 'brand', label: 'How it is built',
        blocks: [
          { type: 'split', n: '05 — Architecture', title: 'A modular backend with two screens on top.',
            text: 'The backend runs on NestJS with Fastify and splits each module into domain, application and infrastructure. The web app and the mobile app speak the same language as the server.' },
          { type: 'columns',
            items: [
              { n: 'Cashier app', title: 'Expo', text: 'The store\'s checkout: the cashier records every sale from the phone.' },
              { n: 'Owner dashboard', title: 'Next.js', text: 'Sales, catalog, expenses and stock for the store in one place.' },
              { n: 'Backend', title: 'NestJS + Fastify', text: 'Inventory, sales and supplier modules, in domain, application and infrastructure layers.' },
              { n: 'Data and identity', title: 'Postgres + Firebase', text: 'Stores, catalog, stock, sales and suppliers in Postgres on Supabase with Prisma; Firebase Auth for owners and cashiers.' },
            ] },
        ],
      },
      {
        tone: 'light', label: 'Next stage',
        blocks: [
          { type: 'split', n: '06 — Next stage', title: 'See the store the way a supermarket sees it.',
            text: 'The plan is to build the store in 3D, shelf by shelf: what is on each one, where customers buy the most and when a product is about to run out, so it can be reordered before it is gone.' },
          { type: 'laptop', shot: { src: `${dir}/zam-web-mapa-3d.webp`, alt: 'Next stage, reference image: 3D floor plan of the corner store with purchase heat zones and the dairy shelf selected' },
            caption: { n: '07 — Next stage · reference image', text: 'Heat zones over the floor plan and the stock-out alert on the shelf where it happens. Not built yet.' } },
        ],
      },
    ],
  },
];

// Data for a project page, with its number and the other projects, starting from the next one (looping).
export function getCase(slug) {
  const i = cases.findIndex((c) => c.slug === slug);
  if (i < 0) return null;
  const others = cases.slice(i + 1).concat(cases.slice(0, i))
    .map((o) => ({ name: o.name, href: caseHref(o.slug), color: o.theme.brand, logo: o.cover.logo }));
  const pad = (n) => String(n).padStart(2, '0');
  return {
    ...cases[i],
    index: `Project ${pad(i + 1)} / ${pad(cases.length)}`,
    others,
  };
}
