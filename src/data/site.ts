// Single source of truth for site copy and structured content.
// Keep marketing copy here; components stay presentational.

// ── Shared content types ───────────────────────────────────────────────
export interface NavItem {
  label: string
  to: string
}
export interface Company {
  name: string
  short: string
  tagline: string
  email: string
  phone: string
  hq: string
  founded: number
}
export interface Service {
  id: string
  name: string
  tagline: string
  summary: string
  long: string
  capabilities: string[]
  icon: string
}
export interface Subservice {
  title: string
  icon: string
  desc: string
  tech?: string[]
}
export interface ProcessStep {
  step: string
  title: string
  body: string
}
export interface Metric {
  value: string
  label: string
}
export interface ServiceCategory {
  slug: string
  name: string
  label: string
  icon: string
  summary: string
  heroTitle: string
  heroLead: string
  subhead: string
  subLead: string
  subservices: Subservice[]
  benefitsTitle: string
  benefits: string[]
  process?: ProcessStep[]
  metrics?: Metric[]
}
export interface Stat {
  value: string
  label: string
}
export interface Value {
  title: string
  body: string
}
export interface PricingPlan {
  id: string
  name: string
  price: string
  cadence: string
  summary: string
  features: string[]
  cta: string
  featured: boolean
}
export interface Faq {
  q: string
  a: string
}
export interface Office {
  city: string
  country: string
  role: string
}
export interface FooterColumn {
  heading: string
  links: NavItem[]
}

export const company: Company = {
  name: 'Finaccru Infotech',
  short: 'Finaccru',
  tagline: 'Software that moves business forward.',
  email: 'hello@finaccru.com',
  phone: '+971 4 000 0000',
  hq: 'Dubai, United Arab Emirates',
  founded: 2016,
}

export const nav: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export const utilityNav: NavItem[] = [
  { label: 'Careers', to: '/about' },
  { label: 'Support', to: '/contact' },
  { label: 'Client Login', to: '/contact' },
]

// Home + Services share this list. `long` is used on the Services page detail tiles.
export const services: Service[] = [
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

// ── Specialized practices ────────────────────────────────────────────────
// Deeper, sub-service-rich offerings (catalogue ported from ProTech Planner).
// Each renders a dedicated detail page at /services/<slug> via ServiceCategory.
export const serviceCategories: ServiceCategory[] = [
  {
    slug: 'ai-ml-development',
    name: 'AI and ML Development',
    label: 'AI & ML Development',
    icon: 'spark',
    summary:
      'Custom AI and machine learning that automates work and turns your data into decisions.',
    heroTitle: 'Empower your business with intelligence.',
    heroLead:
      'Harness the power of Artificial Intelligence and Machine Learning to automate complex tasks, gain deep insights from your data, and create innovative experiences.',
    subhead: 'What we build',
    subLead: 'Comprehensive solutions to streamline your operations.',
    subservices: [
      { title: 'Custom AI Solutions', icon: 'network', desc: 'Bespoke AI solutions tailored to your unique business needs, from strategy to implementation.' },
      { title: 'Machine Learning Models', icon: 'grid', desc: 'Advanced ML models designed for classification, regression, and clustering to solve complex problems.' },
      { title: 'Natural Language Processing', icon: 'chat', desc: 'Intelligent NLP systems for sentiment analysis, chatbots, language translation, and text summarization.' },
      { title: 'Computer Vision', icon: 'eye', desc: 'State-of-the-art vision systems for object detection, image recognition, and facial recognition.' },
      { title: 'Predictive Analytics', icon: 'chart', desc: 'Harness the power of your data to predict future trends, customer behavior, and market shifts.' },
      { title: 'AI Integration & Consulting', icon: 'layers', desc: 'Expert guidance on integrating AI into your existing systems and a strategy built for long-term success.' },
    ],
    benefitsTitle: 'Why teams build their AI with us',
    benefits: [
      'Expert AI/ML engineers with deep industry experience',
      'Data-driven insights for smarter decision making',
      'Automated workflows that save time and reduce costs',
      'Scalable AI infrastructure built for growth',
      'Real-time predictive modeling and analytics',
      'Secure and ethical AI development practices',
    ],
  },
  {
    slug: 'hire-developers',
    name: 'Hire Developers',
    label: 'Hire Developers',
    icon: 'code',
    summary:
      'Pre-vetted senior engineers who slot into your team and start shipping within days.',
    heroTitle: 'Hire expert developers, build faster.',
    heroLead:
      'Access a global pool of pre-vetted, experienced developers ready to join your team and accelerate your product development.',
    subhead: 'Roles you can hire',
    subLead: 'Comprehensive solutions to streamline your operations.',
    subservices: [
      { title: 'Frontend Developers', icon: 'code', desc: 'Expert React, Vue, and Angular developers who create stunning, responsive user interfaces and experiences.' },
      { title: 'Backend Developers', icon: 'server', desc: 'Skilled Node.js, Python, and Java developers who build robust, scalable server-side applications.' },
      { title: 'Full Stack Developers', icon: 'layers', desc: 'Versatile developers proficient in both frontend and backend technologies for end-to-end solutions.' },
      { title: 'Mobile Developers', icon: 'mobile', desc: 'iOS, Android, and React Native developers who create native and cross-platform mobile apps.' },
      { title: 'DevOps Engineers', icon: 'gear', desc: 'DevOps experts who streamline deployment, automate workflows, and manage cloud infrastructure.' },
      { title: 'Specialized Developers', icon: 'briefcase', desc: 'AI/ML, blockchain, IoT, and other specialized developers for cutting-edge technology projects.' },
    ],
    benefitsTitle: 'Why hire through Finaccru',
    benefits: [
      'Pre-vetted developers with 5+ years of experience',
      'Flexible hiring models — hourly, monthly, or project-based',
      'Start within 48 hours of approval',
      'Save up to 60% on development costs',
      'Direct communication with your developers',
      'Seamless integration with your existing team',
    ],
  },
  {
    slug: 'mobile-app-development',
    name: 'Mobile App Development',
    label: 'Mobile App Development',
    icon: 'mobile',
    summary:
      'High-performance iOS and Android apps, taken from concept to store launch.',
    heroTitle: 'Build apps users love, launch faster.',
    heroLead:
      'Professional mobile app development for iOS and Android. From concept to launch, we build high-performance apps that drive business growth.',
    subhead: 'What we deliver',
    subLead: 'Comprehensive solutions to streamline your operations.',
    subservices: [
      { title: 'Native iOS Development', icon: 'mobile', desc: 'High-performance native iOS apps built with Swift and SwiftUI for an optimal user experience.' },
      { title: 'Native Android Development', icon: 'mobile', desc: 'Robust native Android apps developed with Kotlin and Jetpack Compose for seamless performance.' },
      { title: 'Cross-Platform Development', icon: 'layers', desc: 'Cost-effective cross-platform apps using React Native and Flutter for iOS and Android.' },
      { title: 'UI/UX Design', icon: 'palette', desc: 'Intuitive, beautiful mobile app interfaces designed for maximum user engagement and retention.' },
      { title: 'Backend Development', icon: 'server', desc: 'Scalable backend infrastructure and APIs to power your mobile applications.' },
      { title: 'App Security & Testing', icon: 'shield', desc: 'Comprehensive security audits and testing to ensure your app is secure and bug-free.' },
    ],
    benefitsTitle: 'Why launch with us',
    benefits: [
      'Expert developers with 8+ years of experience',
      'Launch apps 40% faster than the industry average',
      '99.9% crash-free rate in production',
      'App Store and Play Store optimization',
      'Post-launch support and maintenance',
      'Agile development with bi-weekly sprints',
    ],
  },
  {
    slug: 'cybersecurity-services',
    name: 'Cybersecurity Services',
    label: 'Cybersecurity Services',
    icon: 'shield',
    summary:
      'Offensive security testing that finds the holes in your stack before attackers do.',
    heroTitle: 'Fortify your digital fortress.',
    heroLead:
      "Don't wait for a breach to happen. We simulate real-world attacks to identify vulnerabilities in your web, mobile, and cloud environments before malicious actors do.",
    subhead: 'Advanced security capabilities',
    subLead: 'Comprehensive solutions to streamline your operations.',
    subservices: [
      { title: 'Web Application Pentesting', icon: 'globe', desc: 'Comprehensive security testing for web applications to identify vulnerabilities like SQLi, XSS, and broken auth before attackers do.', tech: ['OWASP Top 10', 'Burp Suite', 'Manual Testing', 'DAST'] },
      { title: 'API Penetration Testing', icon: 'braces', desc: 'Thorough security assessment of REST, GraphQL, and SOAP APIs to ensure robust protection of your data exchange layers.', tech: ['Postman', 'OWASP API Top 10', 'JWT', 'OAuth'] },
      { title: 'Cloud Penetration Testing', icon: 'cloud', desc: 'Security evaluation of AWS, Azure, and GCP cloud infrastructure, configurations, and IAM policies to prevent data leaks.', tech: ['AWS', 'Azure', 'GCP', 'Kubernetes'] },
      { title: 'Mobile App Pentesting', icon: 'mobile', desc: 'In-depth security testing for iOS and Android applications to protect user data and prevent reverse engineering.', tech: ['Android', 'iOS', 'MobSF', 'Frida'] },
      { title: 'Network Security Audit', icon: 'network', desc: 'Complete network infrastructure assessment to identify security gaps across your internal and external IT environments.', tech: ['Nmap', 'Nessus', 'Wireshark', 'Metasploit'] },
      { title: 'Vulnerability Assessment', icon: 'alert', desc: 'Systematic identification and prioritization of security vulnerabilities across your entire digital landscape.', tech: ['Qualys', 'Tenable', 'Automation', 'Risk Scoring'] },
      { title: 'Red Teaming', icon: 'target', desc: 'Goal-based adversary simulation across people, process, and technology to test how well your team detects and responds to a real attack.', tech: ['MITRE ATT&CK', 'C2 Frameworks', 'Social Engineering', 'Evasion'] },
      { title: 'Compliance & Audit', icon: 'clipboard', desc: 'Gap assessments and audit-readiness for ISO 27001, SOC 2, PCI-DSS, GDPR, and HIPAA — so your security maps cleanly to the standards you are held to.', tech: ['ISO 27001', 'SOC 2', 'PCI-DSS', 'GDPR'] },
    ],
    benefitsTitle: 'Why choose our offensive team',
    benefits: [
      'Offensive security mindset — we think like attackers to uncover what automated scanners miss',
      'Actionable reporting with proof-of-concept and remediation steps your dev team can act on immediately',
      'Continuous validation through recurring testing cycles, not a one-time event',
    ],
    process: [
      { step: '01', title: 'Scoping & Recon', body: 'Defining engagement boundaries and identifying exposed assets.' },
      { step: '02', title: 'Vuln Analysis', body: 'Systematic identification of security weaknesses and entry points.' },
      { step: '03', title: 'Exploitation', body: 'Controlled simulation of real-world attacks to validate risks.' },
      { step: '04', title: 'Reporting', body: 'Actionable findings with clear remediation steps and PoCs.' },
    ],
    metrics: [
      { value: '500+', label: 'Security audits' },
      { value: '10k+', label: 'Bugs identified' },
      { value: '100%', label: 'Certified team' },
    ],
  },
]

export const stats: Stat[] = [
  { value: '200+', label: 'Products shipped' },
  { value: '60+', label: 'Clients worldwide' },
  { value: '99.98%', label: 'Platform uptime' },
  { value: '8 yrs', label: 'Engineering at scale' },
]

export const process: ProcessStep[] = [
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

export const techStack: string[] = [
  'TypeScript', 'React', 'Node.js', 'Python', 'Go', 'PostgreSQL',
  'AWS', 'Kubernetes', 'Terraform', 'React Native', 'GraphQL', 'Kafka',
]

export const values: Value[] = [
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

export const pricing: PricingPlan[] = [
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

export const faqs: Faq[] = [
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

export const offices: Office[] = [
  { city: 'Dubai', country: 'United Arab Emirates', role: 'Headquarters' },
  { city: 'Bengaluru', country: 'India', role: 'Engineering centre' },
  { city: 'London', country: 'United Kingdom', role: 'Client partnerships' },
]

export const footerColumns: FooterColumn[] = [
  {
    heading: 'Services',
    links: [
      { label: 'AI & ML Development', to: '/services/ai-ml-development' },
      { label: 'Hire Developers', to: '/services/hire-developers' },
      { label: 'Mobile App Development', to: '/services/mobile-app-development' },
      { label: 'Cybersecurity Services', to: '/services/cybersecurity-services' },
      { label: 'All services', to: '/services' },
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
