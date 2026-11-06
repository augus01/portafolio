// Landing content in English: same exports and shape as ../home.js (the Spanish version). English is the main language.
// Anchors (#sobre-mi, #superpoderes…) and routes stay the same in both languages.

export const nav = {
  brand: { label: 'Augusto Pinto, go to home', href: '/' },
  labels: { region: 'Main', menu: 'Menu', close: 'Close', openMenu: 'Open menu' },
  items: [
    { label: 'About me', href: '#sobre-mi' },
    { label: 'Superpowers', href: '#superpoderes' },
    { label: 'Projects', href: '#proyectos' },
  ],
  actions: [
    { label: 'GitHub', href: 'https://github.com/augus01', external: true },
    { label: 'Contact', href: '#contacto', peek: true },
  ],
};

// Language pill: shows the language it switches to.
export const langToggle = { label: 'ES', ariaLabel: 'Ver en español', target: 'es' };

export const meta = { documentTitle: 'Augusto Pinto · Portfolio' };

export const mobileMenu = {
  links: [
    { label: 'About me', href: '#sobre-mi' },
    { label: 'Superpowers', href: '#superpoderes' },
    { label: 'Projects', href: '#proyectos' },
    { label: 'Contact', href: '#contacto' },
  ],
  cta: { label: 'Stop by reception', href: '#contacto' },
  secondary: { label: 'GitHub', href: 'https://github.com/augus01', external: true },
  meta: 'Computer Science Engineering · Santiago, Chile',
  labels: { dialog: 'Navigation menu', close: 'Close menu', nav: 'Main' },
};

export const hero = {
  name: 'AUGUSTO PINTO',
  uppercase: true,
  role: 'Fewer promises, more products that help every day',
  height: '100svh',
  regionLabel: 'Introduction',
};

export const about = {
  id: 'sobre-mi',
  summary: [
    { label: 'Name', value: 'Augusto Pinto' },
    { label: 'Age and city', value: '21, Santiago, Chile' },
    { label: 'Degree', value: 'Computer Science Engineering' },
    { label: 'Studies', value: '4th year, Universidad San Sebastián' },
  ],
  statement: [
    { text: 'I start from what people need in their day and build ' },
    { text: 'the whole product', muted: true },
    { text: ', from the screen to the architecture.' },
  ],
  paragraphs: [
    'As a teenager I was looking for a hobby, something interesting enough to study for real. I started with basic frontend bootcamps and found my foundation there: watching an idea turn into a screen someone can use. I never let go of that thread. Today I study Computer Science Engineering at Universidad San Sebastián, in my fourth year, and I keep building.',
    'Now I build products with AI applied to real-life situations: technology that solves a paperwork process, a question or a concrete decision for someone. I am not interested in AI as a demo, but as the piece that makes a product actually help. Further down you will see what that looks like in practice.',
    'What sets me apart is the drive to build the best product for people: the one that helps them most and changes their day. That is why I cover it end to end, from the visuals to the features and an architecture that holds the product up. That way of building has concrete pieces, and they are my superpowers.',
  ],
};

export const skills = {
  id: 'superpoderes',
  title: ['What I', 'build with'],
  rowLabel: (n) => `Technologies, row ${n}`,
  lead: 'The 17 technologies I use in my projects, from the interface to deployment. Hover over a row to pause it and click one to see what I achieved with it.',
  card: {
    usedIn: 'Where I used it', close: 'Close', open: (name) => `See what I achieved with ${name}`, dialog: (name) => `${name} details`, alt: (name) => `3D ${name} logo`,
    agent: 'stack', askLabel: 'Ask stack', toOffice: 'Continue with stack in the office', office: '/oficina/',
    draft: (name) => `What else did Augusto build with ${name}?`,
  },
  reader: { scare: 'AAH! You scared me!', excited: (name) => `I love ${name}!`, before: 'nextjs' },
  ask: {
    react: [
      { q: 'Where does he use it?', a: 'In the Inkvibe website, the Zam web dashboard and this portfolio.' },
      { q: 'What else does he build interfaces with?', a: 'Next.js as the web foundation, Material UI in Inkvibe and Zam, and Mantine in Inkvibe.' },
    ],
    python: [
      { q: 'What was it useful for?', a: 'It was his foundation for understanding programming logic, before building products for the web.' },
      { q: 'Where is there AI in his projects?', a: 'In Rumbo a Casa: the assistant talks through Bedrock and a rules engine cites the decree behind every answer.' },
    ],
    aws: [
      { q: 'What is Rumbo a Casa?', a: 'An assistant that guides Chilean families through four government housing subsidies (DS49, DS1, DS19 and DS52) and builds their document checklist.' },
      { q: 'What did it win?', a: 'The Social Good category at the AWS Zero to Shipped hackathon.' },
    ],
    nextjs: [
      { q: 'What does the owner see in Zam?', a: 'Sales, catalog, expenses and stock of their corner store, all in one place.' },
      { q: 'And in Inkvibe?', a: 'It is the foundation of the website, with App Router, Tailwind, Mantine and TanStack Query.' },
    ],
    nodejs: [
      { q: 'What modules does Zam have?', a: 'Inventory, sales and suppliers, each one in domain, application and infrastructure layers.' },
      { q: 'On which database?', a: 'Postgres on Supabase, with Prisma for the schema, migrations and typed queries.' },
    ],
    cloudflare: [
      { q: 'What is Lexinova?', a: 'A multi-tenant LegalTech platform built Cloudflare-first. Augusto handles integrations and architecture.' },
      { q: 'Where does it store data?', a: 'In Supabase, the same managed database he uses in Inkvibe and Zam.' },
    ],
    typescript: [
      { q: 'Where does he use it?', a: 'End to end in Zam (NestJS backend, Next.js web and Expo app) and in the Inkvibe website.' },
      { q: 'On which database?', a: 'Postgres on Supabase with Prisma, in Inkvibe and Zam.' },
    ],
    postgresql: [
      { q: 'What does Zam store there?', a: 'Stores, catalog, stock, sales and suppliers, with multi-tenancy handled in the application layer.' },
      { q: 'And in Inkvibe?', a: 'The website data and the blog content, which runs on Payload CMS. Prisma manages the schema.' },
    ],
    railway: [
      { q: 'What does he deploy there?', a: 'Inkvibe services.' },
      { q: 'Where else does he deploy?', a: 'On AWS, with Rumbo a Casa and this portfolio, and on Cloudflare, with Lexinova.' },
    ],
    javascript: [
      { q: 'How did he start programming?', a: 'As a teenager, with basic frontend bootcamps: that is where he found what he loves, watching an idea turn into a screen someone can use.' },
      { q: 'And what does he use most today?', a: 'TypeScript end to end, as in Zam and Inkvibe.' },
    ],
    prisma: [
      { q: 'In which projects?', a: 'In Inkvibe and Zam, on Postgres in Supabase: schema, migrations and typed queries.' },
      { q: 'Which backend does it connect to in Zam?', a: 'The NestJS backend with Fastify, organized by modules. All in TypeScript.' },
    ],
    docker: [
      { q: 'Where does he use it?', a: 'In Inkvibe and Zam, to run services and databases the same way on his machine as on the server.' },
      { q: 'Where does he deploy?', a: 'On AWS, Cloudflare and Railway, depending on the project.' },
    ],
    vite: [
      { q: 'Where does he use it?', a: 'In this portfolio and in smaller React learning projects.' },
      { q: 'And for a product website?', a: 'Next.js, as in the Inkvibe website and the Zam dashboard.' },
    ],
    supabase: [
      { q: 'What does it store?', a: 'The Postgres databases of Inkvibe and Zam, and the Lexinova data.' },
      { q: 'What does he query it with?', a: 'With Prisma, in Inkvibe and Zam: schema, migrations and typed queries.' },
    ],
    github: [
      { q: 'What does he use it for?', a: 'In all his projects: repositories, pull requests, CI and GitHub Projects to organize the work.' },
      { q: 'And this portfolio?', a: 'It lives on GitHub and every change to main deploys automatically to AWS Amplify.' },
    ],
    'material-ui': [
      { q: 'Where does he use it?', a: 'In Inkvibe and Zam, to build consistent React interfaces.' },
      { q: 'What else does he use on the frontend?', a: 'React and Next.js, plus Mantine in the Inkvibe website.' },
    ],
    firebase: [
      { q: 'Who signs in?', a: 'The owners and cashiers of the corner stores that use Zam.' },
      { q: 'What else does Zam use?', a: 'A NestJS backend with Fastify, a Next.js web app and an Expo mobile app, all in TypeScript.' },
    ],
  },
  rows: [
    [
      { name: 'React', logo: 'react', tint: '#61DAFB', cat: 'Frontend',
        desc: 'I build the Inkvibe website with React, as its only frontend developer, and the Zam web dashboard. This portfolio too.',
        projects: ['Inkvibe', 'Zam', 'This portfolio'] },
      { name: 'Python', logo: 'python', tint: '#3776AB', cat: 'Language',
        desc: 'My foundation for understanding programming logic, before building products for the web.',
        projects: [] },
      { name: 'AWS', logo: 'aws', tint: '#FF9900', cat: 'Cloud',
        desc: 'With Rumbo a Casa we won the Social Good category at the AWS Zero to Shipped hackathon. It runs on CloudFront, Lambda, Bedrock, DynamoDB and Polly. This portfolio is deployed with AWS Amplify.',
        projects: ['Rumbo a Casa', 'This portfolio'] },
      { name: 'Next.js', logo: 'nextjs', tint: '#111111', cat: 'Frontend',
        desc: 'The foundation of the Inkvibe website and the Zam web dashboard, where a corner store owner reviews sales, catalog, expenses and stock.',
        projects: ['Inkvibe', 'Zam'] },
      { name: 'Node.js', logo: 'nodejs', tint: '#5FA04E', cat: 'Backend',
        desc: 'The Zam backend runs on NestJS with Fastify, organized by modules (inventory, sales, suppliers) in domain, application and infrastructure layers.',
        projects: ['Zam'] },
      { name: 'Cloudflare', logo: 'cloudflare', tint: '#F38020', cat: 'Cloud',
        desc: 'I work on the Lexinova platform, a multi-tenant LegalTech built Cloudflare-first, where I handle integrations and architecture.',
        projects: ['Lexinova'] },
      { name: 'TypeScript', logo: 'typescript', tint: '#3178C6', cat: 'Language',
        desc: 'End-to-end typing in Zam, where the NestJS backend, the Next.js web app and the Expo mobile app speak the same language, and in the Inkvibe website.',
        projects: ['Inkvibe', 'Zam'] },
      { name: 'PostgreSQL', logo: 'postgresql', tint: '#4169E1', cat: 'Database',
        desc: 'The database of Inkvibe and Zam. In Zam it stores shops, catalog, stock, sales and suppliers, with multi-tenancy handled in the application layer.',
        projects: ['Inkvibe', 'Zam'] },
      { name: 'Railway', logo: 'railway', tint: '#6B6B78', cat: 'Deployment',
        desc: 'Where I deploy Inkvibe services without managing my own servers.',
        projects: ['Inkvibe'] },
    ],
    [
      { name: 'JavaScript', logo: 'javascript', tint: '#F7DF1E', cat: 'Language',
        desc: 'The language I started the web with, and it is still underneath all my work in the browser and in Node.',
        projects: [] },
      { name: 'Prisma', logo: 'prisma', tint: '#2D3748', cat: 'ORM',
        desc: 'The ORM of Inkvibe and Zam: schema, migrations and typed queries on Postgres in Supabase.',
        projects: ['Inkvibe', 'Zam'] },
      { name: 'Docker', logo: 'docker', tint: '#2496ED', cat: 'Tooling',
        desc: 'Containers in Inkvibe and Zam to run services and databases the same way on my machine as on the server.',
        projects: ['Inkvibe', 'Zam'] },
      { name: 'Vite', logo: 'vite', tint: '#9135FF', cat: 'Tooling',
        desc: 'My starting point for this portfolio and for small React learning projects: it starts in seconds and reloads instantly.',
        projects: ['This portfolio'] },
      { name: 'Supabase', logo: 'supabase', tint: '#3ECF8E', cat: 'Database',
        desc: 'Hosts the Postgres databases of Inkvibe and Zam, and the Lexinova data: a managed database without running my own infrastructure.',
        projects: ['Inkvibe', 'Zam', 'Lexinova'] },
      { name: 'GitHub', logo: 'github', tint: '#181717', cat: 'Tooling',
        desc: 'Repositories, pull requests, CI and GitHub Projects in all my projects. The code of this portfolio lives here too.',
        projects: ['Rumbo a Casa', 'Inkvibe', 'Zam', 'Lexinova', 'This portfolio'] },
      { name: 'Material UI', logo: 'material-ui', tint: '#007FFF', cat: 'Frontend',
        desc: 'Components to build consistent, accessible React interfaces in Inkvibe and Zam.',
        projects: ['Inkvibe', 'Zam'] },
      { name: 'Firebase', logo: 'firebase', tint: '#FF9100', cat: 'Authentication',
        desc: 'The identity layer of Zam: Firebase Auth handles sign-in for owners and cashiers.',
        projects: ['Zam'] },
    ],
  ],
};

export const projects = {
  id: 'proyectos',
  title: ['What I have', 'built'],
  count: '3 projects',
  architect: {
    agent: 'arquitecto', tip: 'See the blueprint', open: (name) => `See the ${name} blueprint`, eyebrow: (name) => `Blueprint · ${name}`,
    title: 'Tap a piece and architect explains it', close: 'Close the blueprint', dialog: (name) => `${name} blueprint`,
    figure: 'Architect in 3D with his rolled-up blueprint', toOffice: 'Continue with architect in the office', office: '/oficina/',
  },
  items: [
    {
      name: 'Rumbo a Casa',
      href: '/proyectos/rumbo-a-casa/',
      description: 'Which housing subsidy your family can apply for, with the source behind every answer.',
      role: 'Co-creator',
      award: 'AWS Zero to Shipped winner',
      badge: { mark: '/proyectos/aws-logo-claro.svg', markWidth: 304, markHeight: 182, label: 'Builder Center' },
      logo: { brand: 'rumbo', symbol: '/proyectos/rumbo-simbolo-claro.svg', symbolWidth: 48, symbolHeight: 33, wordmark: 'Rumbo a Casa' },
      plan: {
        def: 'reglas', ask: 'How is Rumbo a Casa put together?',
        chain: [
          { id: 'familia', label: 'Family', sub: 'Web · Spanish or English', text: 'The family talks to the assistant in Spanish or English and gets the list of documents they need.' },
          { id: 'cloudfront', label: 'CloudFront', sub: 'Delivers the site', text: 'Delivers the site quickly to any family in Chile.' },
          { id: 'lambda', label: 'Lambda', sub: 'Receives each message', text: 'Receives each message and calls the pieces needed to answer.' },
        ],
        legs: [
          { id: 'bedrock', label: 'Bedrock', sub: 'Converses', text: 'The model that understands what the family tells it and drives the conversation.' },
          { id: 'reglas', label: 'Rules engine', sub: 'Cites the decree', text: 'Decides which subsidy the family can apply for (DS49, DS1, DS19 or DS52) and cites the decree behind every answer.' },
          { id: 'dynamo', label: 'DynamoDB', sub: 'Data', text: 'Stores the data the assistant needs between one message and the next.' },
          { id: 'polly', label: 'Polly', sub: 'Voice', text: 'Turns the answers into speech for those who prefer to listen.' },
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
      description: 'The tattoo marketplace for Latin America: verified artists, quotes and booking in one place.',
      role: 'Frontend developer',
      logo: { brand: 'inkvibe', image: '/proyectos/inkvibe-logo-claro.png', width: 1200, height: 281 },
      plan: {
        def: 'web', ask: 'How is Inkvibe put together?',
        chain: [
          { id: 'clientes', label: 'Clients', sub: 'Looking for an artist', text: 'They discover verified artists by style and city, anywhere in Latin America.' },
          { id: 'web', label: 'Website', sub: 'React and Next.js', text: 'This is what Augusto builds, as the only frontend developer: the whole website in React and Next.js.' },
        ],
        legs: [
          { id: 'inkcards', label: 'InkCards', sub: 'Every artist', text: 'Every artist has their own InkCard inside the marketplace.' },
          { id: 'portafolios', label: 'Portfolios', sub: 'Their work', text: 'Clients review each artist portfolio before choosing.' },
          { id: 'reserva', label: 'Quote and book', sub: 'One place', text: 'The flow to get a quote and book with the artist, without leaving the site.' },
          { id: 'backend', label: 'Backend', sub: 'Separate', text: 'The website talks to a separate backend, apart from the frontend Augusto builds.' },
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
      description: 'Checkout, inventory and finances for the neighborhood corner store: an app for the cashier and a web dashboard for the owner.',
      role: 'Own project · In development',
      logo: { brand: 'zam', symbol: '/proyectos/zam-simbolo-claro.svg', symbolWidth: 466, symbolHeight: 466, wordmark: 'zam' },
      plan: {
        def: 'zam', ask: 'How is Zam put together?',
        chain: [
          { id: 'zam', label: 'Zam', sub: 'Neighborhood corner store', text: 'Checkout, inventory and finances for the neighborhood corner store, on two surfaces designed for the people who use them.' },
        ],
        legs: [
          { id: 'app', label: 'Mobile app', sub: 'Cashier and owner', text: 'Built to operate one-handed: checkout, scanner, shrinkage, prices, alerts and daily sales.' },
          { id: 'panel', label: 'Web dashboard', sub: 'Owner only', text: 'In Next.js, to analyze and manage: financial dashboard, catalog, expenses, users and alerts.' },
          { id: 'asistente', label: 'Assistant', sub: 'Talk to Zam', text: 'From the app you talk to Zam: it answers in short sentences, with the number first.' },
        ],
      },
    },
  ],
};

export const contact = {
  id: 'contacto',
  headline: {
    eyebrow: 'Contact',
    title: ['Stop by', 'reception'],
    lead: 'Have a project, an opportunity or an idea with AI? There is no form here: stop by reception and say hi.',
  },
  enter: { label: 'Step into the office', href: '/oficina/' },
  meta: 'Chile · GMT−3',
  hint: 'Click reception three times and you will be taken to the office',
  desk: {
    lines: ['Hi! I am reception', 'Leave a message for Augusto', 'Coming to the office? I will take you', 'Ring the bell if you like'],
    follow: 'Follow me!',
    greet: 'Hi, I am reception. How can I help?',
    tickles: ['Haha, that tickles!', 'One more time and I will take you to the office'],
    ding: 'Ding! Coming',
    elsewhere: 'Over there too!',
  },
};

export const footer = {
  brand: { label: 'Augusto Pinto, go to home', href: '/' },
  title: 'Have an idea?',
  cta: { label: 'Step into the office', href: '/oficina/' },
  nav: {
    label: 'Footer',
    items: [
      { label: 'About me', href: '#sobre-mi' },
      { label: 'Superpowers', href: '#superpoderes' },
      { label: 'Projects', href: '#proyectos' },
      { label: 'Contact', href: '#contacto' },
      { label: 'GitHub', href: 'https://github.com/augus01', external: true },
    ],
  },
  agents: { label: 'Visit my office: reception, architect and stack are waiting for you', href: '/oficina/', items: ['recepcion', 'arquitecto', 'stack'] },
  copyright: '© 2026 Augusto Pinto',
  note: 'Deployed on AWS Amplify',
  links: [{ label: 'Open repository', href: 'https://github.com/augus01/portafolio', external: true }],
};
