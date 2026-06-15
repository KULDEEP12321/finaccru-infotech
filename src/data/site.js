// Single source of truth for site copy and structured content.
// Keep marketing copy here; components stay presentational.

export const company = {
  name: 'Finaccru Infotech',
  short: 'Finaccru',
  tagline: 'Software that moves business forward.',
  email: 'hello@finaccru.com',
  phone: '+971 4 000 0000',
  hq: 'Dubai, United Arab Emirates',
  founded: 2016,
}

export const nav = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export const utilityNav = [
  { label: 'Careers', to: '/about' },
  { label: 'Support', to: '/contact' },
  { label: 'Client Login', to: '/contact' },
]

// Home + Services share this list. `long` is used on the Services page detail tiles.
export const services = [
  {
    id: 'software',
    name: 'Custom Software',
    tagline: 'Products built exactly to fit.',
    summary:
      'Web and platform engineering for teams who have outgrown off-the-shelf tools.',
    long: 'We design and ship custom applications end-to-end — from product discovery and architecture to a maintainable codebase your team can own. React, Node, Python, and a typed contract between every layer.',
    capabilities: ['Product discovery', 'System architecture', 'Web platforms', 'API design'],
    icon: 'code',
  },
  {
    id: 'cloud',
    name: 'Cloud & DevOps',
    tagline: 'Infrastructure that scales quietly.',
    summary:
      'Migration, automation, and observability on AWS, Azure, and GCP — billed to your actual usage.',
    long: 'We move workloads to the cloud without the drama: infrastructure as code, CI/CD pipelines, autoscaling, and the dashboards that tell you something is wrong before your customers do.',
    capabilities: ['Cloud migration', 'CI/CD pipelines', 'Kubernetes', 'Observability'],
    icon: 'cloud',
  },
  {
    id: 'apps',
    name: 'Mobile & Web Apps',
    tagline: 'One codebase, every screen.',
    summary:
      'Native-feeling iOS and Android apps and responsive web, shipped from a shared core.',
    long: 'React Native and progressive web apps that feel native on every device, with offline-first data, push, and an interface your users never have to think about.',
    capabilities: ['iOS & Android', 'React Native', 'PWA', 'Design systems'],
    icon: 'mobile',
  },
  {
    id: 'data',
    name: 'Data & AI',
    tagline: 'Decisions, not dashboards.',
    summary:
      'Pipelines, warehouses, and applied machine learning that put answers where work happens.',
    long: 'We build the data backbone — ingestion, warehousing, and modelling — then layer applied AI on top: forecasting, document understanding, and assistants wired into your own systems.',
    capabilities: ['Data pipelines', 'Warehousing', 'Applied ML', 'LLM integration'],
    icon: 'spark',
  },
  {
    id: 'security',
    name: 'Cybersecurity',
    tagline: 'Defended by design.',
    summary:
      'Audits, hardening, and continuous monitoring so security is a property, not a project.',
    long: 'Threat modelling, penetration testing, and compliance groundwork (ISO 27001, SOC 2) — baked into the build rather than bolted on after launch.',
    capabilities: ['Security audits', 'Pen testing', 'Compliance', '24/7 monitoring'],
    icon: 'shield',
  },
  {
    id: 'managed',
    name: 'Managed IT',
    tagline: 'Your systems, always on.',
    summary:
      'A dedicated team that runs, patches, and improves your stack so you can run the business.',
    long: 'Proactive maintenance, helpdesk, and a roadmap that keeps your platform current — a retained team that knows your systems as well as you do.',
    capabilities: ['24/7 helpdesk', 'Proactive maintenance', 'SLA-backed', 'Roadmapping'],
    icon: 'gear',
  },
]

export const stats = [
  { value: '200+', label: 'Products shipped' },
  { value: '60+', label: 'Clients worldwide' },
  { value: '99.98%', label: 'Platform uptime' },
  { value: '8 yrs', label: 'Engineering at scale' },
]

export const process = [
  {
    step: '01',
    title: 'Discover',
    body: 'We map the problem, the constraints, and what success actually looks like before a line of code is written.',
  },
  {
    step: '02',
    title: 'Design',
    body: 'Architecture and interface decided together — the system and the experience drawn on the same page.',
  },
  {
    step: '03',
    title: 'Build',
    body: 'Short, visible iterations. You see working software every week, not a slide deck every quarter.',
  },
  {
    step: '04',
    title: 'Run',
    body: 'We stay after launch — monitoring, improving, and handing your team a platform they can own.',
  },
]

export const techStack = [
  'TypeScript', 'React', 'Node.js', 'Python', 'Go', 'PostgreSQL',
  'AWS', 'Kubernetes', 'Terraform', 'React Native', 'GraphQL', 'Kafka',
]

export const values = [
  {
    title: 'Ship to learn',
    body: 'Working software in front of real users beats a perfect plan on paper. We optimise for the next deploy.',
  },
  {
    title: 'Own the outcome',
    body: 'We are measured by what your business does with what we build — not by hours logged or tickets closed.',
  },
  {
    title: 'Leave it better',
    body: 'Every engagement should hand your team a cleaner, more capable system than the one we found.',
  },
]

export const pricing = [
  {
    id: 'project',
    name: 'Fixed Project',
    price: 'from $18k',
    cadence: 'per engagement',
    summary: 'A defined scope, a fixed price, a firm date. Best when the destination is clear.',
    features: [
      'Discovery & scoping workshop',
      'Fixed timeline & budget',
      'Dedicated delivery lead',
      'Source code & docs handover',
      '30-day post-launch support',
    ],
    cta: 'Start a project',
    featured: false,
  },
  {
    id: 'team',
    name: 'Dedicated Team',
    price: 'from $9k',
    cadence: 'per month',
    summary: 'A cross-functional squad that plugs into your roadmap and moves with you.',
    features: [
      'Product, design & engineering',
      'Scales up or down monthly',
      'Your tools, your rituals',
      'Weekly demos & reporting',
      'Direct Slack access',
      'No long-term lock-in',
    ],
    cta: 'Build a team',
    featured: true,
  },
  {
    id: 'managed',
    name: 'Managed Retainer',
    price: 'Custom',
    cadence: 'tailored SLA',
    summary: 'We run and evolve your platform under an agreed service level. Always on.',
    features: [
      '24/7 monitoring & helpdesk',
      'Proactive maintenance',
      'Quarterly roadmap reviews',
      'Security & compliance upkeep',
      'Priority response SLAs',
    ],
    cta: 'Talk to us',
    featured: false,
  },
]

export const faqs = [
  {
    q: 'How quickly can we start?',
    a: 'Most engagements kick off within two weeks of a signed scope. Dedicated teams can sometimes start sooner if the fit is clear.',
  },
  {
    q: 'Do we own the code?',
    a: 'Always. Every line we write is yours, delivered in your repositories with documentation, from day one.',
  },
  {
    q: 'Can you work with our existing team?',
    a: 'Yes. We embed into your rituals and tools, and most of our work is shoulder-to-shoulder with in-house engineers.',
  },
  {
    q: 'What if the scope changes?',
    a: 'On retainers and dedicated teams, change is the default — we re-plan every sprint. On fixed projects we agree a clear change process up front.',
  },
]

export const offices = [
  { city: 'Dubai', country: 'United Arab Emirates', role: 'Headquarters' },
  { city: 'Bengaluru', country: 'India', role: 'Engineering centre' },
  { city: 'London', country: 'United Kingdom', role: 'Client partnerships' },
]

export const footerColumns = [
  {
    heading: 'Services',
    links: [
      { label: 'Custom Software', to: '/services' },
      { label: 'Cloud & DevOps', to: '/services' },
      { label: 'Mobile & Web Apps', to: '/services' },
      { label: 'Data & AI', to: '/services' },
      { label: 'Cybersecurity', to: '/services' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Careers', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Engagement models', to: '/pricing' },
      { label: 'Our process', to: '/services' },
      { label: 'Client login', to: '/contact' },
      { label: 'Support', to: '/contact' },
    ],
  },
]
