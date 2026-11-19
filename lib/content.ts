// Every string about Samuel comes from design-research/screens/CONTENT.md, which traces
// each fact to his résumé or portfolio brief. Add nothing here that isn't traceable there.

export const site = {
  name: "Samuel Roland Vroom",
  title: "Full-Stack Developer",
  location: "Southwestern Ontario",
  email: "sr.vroom@outlook.com",
  linkedin: "https://linkedin.com/in/samuel-roland-vroom",
  linkedinLabel: "linkedin.com/in/samuel-roland-vroom",
  github: "https://github.com/ninjaVroom",
  githubLabel: "github.com/ninjaVroom",
  resumePdf: "/resume/Samuel_Roland_Vroom_Developer_Resume.pdf",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

/** Each project runs on its own subdomain of the portfolio's domain. */
const sub = (name: string) => `https://${name}.samuelrolandvroom.com`;

export type DisciplineId = "development" | "wordpress" | "ui-design" | "project-management" | "film";

export type Discipline = { id: DisciplineId; name: string; description?: string; tools: string[] };

export const disciplines: Discipline[] = [
  {
    id: "development",
    name: "Development",
    description: "I build web and mobile products, from requirements and interface through APIs, databases and deployment.",
    tools: ["React", "Next.js", "TypeScript", "Node.js", "Python", "PHP", "WordPress", "Elementor", "Flutter", "PostgreSQL", "Docker"],
  },
  {
    id: "wordpress",
    name: "WordPress",
    description: "I build WordPress sites two ways: native block themes with a custom plugin, and Elementor sites built from custom widgets.",
    tools: ["WordPress", "Elementor", "Block themes", "PHP", "Secure Custom Fields", "WP-CLI"],
  },
  { id: "ui-design", name: "UI Design", tools: ["Figma", "UI/UX wireframing", "A/B testing"] },
  {
    id: "project-management",
    name: "Project Management",
    tools: ["Agile", "Waterfall", "Jira", "Asana", "Stakeholder management", "Risk management"],
  },
  { id: "film", name: "Film", tools: ["Premiere Pro", "After Effects", "Photoshop", "Motion graphics"] },
];

export type Chapter = { id: string; anchor: string; title: string; body: string; problem?: string };

export type Project = {
  slug: string;
  title: string;
  /** Title split for the local nav, where the full title doesn't fit. */
  shortTitle?: string;
  oneLiner: string;
  period: string;
  year: string;
  role: string;
  tags: DisciplineId[];
  featured?: boolean;
  /** Path under /public once an approved image exists. */
  cover?: string;
  /** Interactive mockup embedded on the case study. */
  demo?: { src: string; note: string; landscape?: boolean; heading?: string };
  /** A deployed, working copy of the project, embedded on the case study. Hidden when unset. */
  live?: { src: string; note: string };
  /** Public Figma design file. */
  figma?: string;
  /** Screenshots shown on the case study, 16:10. */
  gallery?: { src: string; caption: string }[];
  /** YouTube videos embedded on the case study. */
  videos?: { id: string; title: string }[];
  facts: { label: string; value: string }[];
  summary: string;
  chapters?: Chapter[];
};

export const projects: Project[] = [
  {
    slug: "gateway",
    figma: "https://www.figma.com/design/AEXziFfYt0eOxTHdhB5F9h/GatePass-Events",
    title: "Gateway",
    shortTitle: "Gateway",
    oneLiner: "A QR workflow that kept credentialing running at the 30th Afreximbank Annual Meetings.",
    period: "2023",
    year: "2023",
    role: "Senior Project Manager & Technical Lead",
    tags: ["development", "project-management"],
    featured: true,
    cover: "/images/work/gateway-cover.jpg",
    demo: {
      src: sub("gatepass"),
      landscape: true,
      note: "This is a mockup recreated for this portfolio to demonstrate an on-site QR check-in flow. It is not the original system or the work delivered at Bisa Technologies, and every name and record in it is made up.",
    },
    facts: [
      { label: "Role", value: "Senior Project Manager & Technical Lead" },
      { label: "Type", value: "Client" },
      { label: "Organization", value: "Bisa Technologies" },
      { label: "Timeline", value: "2023" },
    ],
    summary:
      "At the 30th Annual Meetings of Afreximbank, a critical credentialing failure put entry for international participants at risk. As Senior Project Manager and Technical Lead at Bisa Technologies, I rapidly implemented an alternative QR-based workflow on site, which kept operations running.",
    chapters: [
      {
        id: "problem",
        anchor: "Problem",
        title: "Background & problem",
        body: "At the 30th Annual Meetings of Afreximbank, a critical credentialing failure affected international participants. The priority was practical: get an alternative working on site so verification and entry could continue.",
        problem: "Credentialing failed during the event, and entry could not wait.",
      },
      {
        id: "role",
        anchor: "Role",
        title: "My role",
        body: "I led cross-functional developers and data analysts at Bisa Technologies and contributed directly to technical delivery, workflow design, debugging and implementation. During the failure, I rapidly implemented the QR-based alternative on site.",
      },
      {
        id: "result",
        anchor: "Result",
        title: "Result",
        body: "The alternative maintained operational continuity for international participants.",
      },
      {
        id: "reflection",
        anchor: "Reflection",
        title: "Reflection",
        body: "This project reinforced the value of clear priorities under pressure. A working response has to make sense both technically and to the people who depend on it in the moment.",
      },
    ],
  },
  {
    slug: "setspace",
    figma: "https://www.figma.com/design/kwk5Fp8gmnIetmyjON1SmP/SETSPACE",
    title: "SETSPACE",
    shortTitle: "SETSPACE",
    oneLiner: "A studio-booking marketplace where Postgres itself refuses double bookings. A personal build.",
    period: "2026",
    year: "2026",
    role: "Design & full-stack development",
    tags: ["development", "ui-design"],
    featured: true,
    cover: "/images/work/setspace-cover.jpg",
    live: {
      src: sub("setspace"),
      note: "The real site, running on a server with its own Postgres database. Sign in as the guest or host in one click, book a studio, then try to book the same slot again. Every account, studio and booking is demo data, and checkout takes test cards only.",
    },
    demo: {
      src: "/setspace-prototype/index.html",
      landscape: true,
      heading: "Design prototype",
      note: "The connected Figma prototype from the design stage, before the site moved to Canadian cities and prices. Click through search, a studio, checkout, the guest account and the host dashboard.",
    },
    gallery: [
      { src: "/images/work/setspace/explore.jpg", caption: "Explore: filters, instant-book badges and a map of the four cities" },
      { src: "/images/work/setspace/studio.jpg", caption: "Studio page: photos, specs and the booking card in CAD" },
      { src: "/images/work/setspace/host.jpg", caption: "Host dashboard: earnings, the week's schedule and requests to accept" },
      { src: "/images/work/setspace/case-study.jpg", caption: "The built-in case study, with the exclusion constraint" },
      { src: "/images/work/setspace/journal.jpg", caption: "Journal: editorial pages in Bodoni Moda" },
    ],
    facts: [
      { label: "Role", value: "Design & full-stack development" },
      { label: "Type", value: "Personal project" },
      { label: "Stack", value: "Next.js 15, Payload CMS 3, Postgres 17, Stripe" },
      { label: "Timeline", value: "2026" },
    ],
    summary:
      "SETSPACE is a personal project, not a real company. I built it to show what I can do with the tools behind it: a marketplace for booking photo, film and podcast studios in Toronto, Montréal, Vancouver and Calgary. I researched the references, set the design system and designed every screen in Figma, then built it with Next.js, Payload CMS, Postgres and Stripe in test mode. Every studio, account, price and booking in it is demo data.",
    chapters: [
      {
        id: "design",
        anchor: "Design",
        title: "Research & design",
        body: "I started by taking apart Peerspace, Giggster, Airbnb's total-price display and Calendly's time-zone handling, then wrote the design system: paper, ink and a single lime signal colour, Geist for the product and Bodoni Moda for names and prices. I built 19 editable screens in Figma (desktop, mobile and dark mode) with colour variables, type styles, component variants and a connected prototype, plus a small Figma plugin that imports the whole package.",
      },
      {
        id: "booking",
        anchor: "Booking",
        title: "One room, one booking",
        body: "Two people can press Pay on the same slot in the same second, and checking availability in the app only narrows that gap. So the database holds the rule: a Postgres exclusion constraint refuses any two live bookings for one studio whose time ranges overlap. The API turns the refusal into a 409 with the three nearest free slots, and a test fires two parallel inserts to prove exactly one wins. Continuing to payment places a ten-minute hold that the same constraint guards, so no cron job is needed to free a slot.",
        problem: "Checking first only narrows the race. The database has to say no.",
      },
      {
        id: "canada",
        anchor: "Canada",
        title: "Time zones, tax & payments",
        body: "Each studio stores its own IANA time zone and every booking is a UTC instant, with unit tests for spring-forward and fall-back days in Toronto, Calgary and Vancouver. Checkout adds the province's sales tax on the booking and service fee: HST in Ontario, GST and QST in Québec, GST in BC and Alberta. Stripe runs in test mode; instant studios charge on confirm, request-to-book studios authorise and capture only when the host accepts, and cancellations refund by the studio's tier.",
      },
      {
        id: "access",
        anchor: "Access",
        title: "Who can see what",
        body: "Booking numbers run in order, so a guest's link carries a random token, and without it or the right session the page is a 404. Payload's access rules keep bookings readable only by their guest, the studio's host or an admin, never writable over REST, and sign-up can't grant itself a role. Guest, host and admin each have their own views, including a host dashboard with schedule, requests and analytics.",
      },
    ],
  },
  {
    slug: "orbit",
    figma: "https://www.figma.com/design/k2LmpOIT2veeVPeGJjgm3B/orbit",
    title: "orbit.",
    shortTitle: "orbit.",
    oneLiner: "A project board and client-approval portal for creative studios, where the invoice follows the sign-off. A personal build.",
    period: "2026",
    year: "2026",
    role: "Design & full-stack development",
    tags: ["development", "ui-design"],
    featured: true,
    cover: "/images/work/orbit-cover.png",
    live: {
      src: sub("orbit"),
      note: "The real app. Press approve as Morgan on the home page, open the Atlas board and try to drag a card to done before the client signs off, or switch people in the sidebar to see what each one is allowed to do. Northstar Studio and everyone in it are made up; every number is sample data.",
    },
    gallery: [
      { src: "/images/work/orbit/home.png", caption: "Home: the live sync demo. Approve as the client and the card moves on the board" },
      { src: "/images/work/orbit/overview.png", caption: "Workspace overview: KPIs with “how is this counted?”, projects and milestones" },
      { src: "/images/work/orbit/board.png", caption: "Project board: cards waiting on the client can't be marked done" },
      { src: "/images/work/orbit/portal.png", caption: "Client portal: approve or ask for changes, with every decision kept" },
      { src: "/images/work/orbit/pricing.png", caption: "Pricing in CAD with a plan comparison" },
    ],
    facts: [
      { label: "Role", value: "Design & full-stack development" },
      { label: "Type", value: "Personal project" },
      { label: "Stack", value: "Next.js 16, React 19, TypeScript, Payload 3, PostgreSQL" },
      { label: "Timeline", value: "2026" },
    ],
    summary:
      "orbit. is a personal project, not a real company. I built it to show what I can do with the tools behind it: a workspace for creative studios where the team works on a board, clients approve in their own portal, and the invoice follows. The demo world is a made-up Toronto studio, Northstar, with clients in Montréal, Vancouver, Halifax and Calgary. All of it is sample data.",
    chapters: [
      {
        id: "record",
        anchor: "Record",
        title: "One record, one reducer",
        body: "The rules live in one reducer with no React, so the browser and the server import the same code. The browser applies an action at once; the server then runs the same action as the signed-in person, loads the record from Postgres, checks it, and writes back only the documents that changed. Its answer replaces the browser's copy, and a refusal shows as a toast with the saved version restored.",
        problem: "The board, the portal and the server all have to agree on what just happened.",
      },
      {
        id: "rules",
        anchor: "Rules",
        title: "Rules on the server",
        body: "A card waiting on the client can't be dragged to done until they approve. Only the owner sends invoices or marks them paid, members can't approve, clients act only on their own projects, and a change request needs a note. Clients read only their own projects, only comments shared with them, and never draft invoices, and that filter runs on the server, not just in the portal's UI.",
      },
      {
        id: "canada",
        anchor: "Canada",
        title: "Canadian invoicing",
        body: "Prices and invoices are in CAD, formatted en-CA. Sales tax follows the client's province: HST in Ontario and the Atlantic provinces, GST and QST in Quebec, GST elsewhere, in integer cents with each tax rounded on its own and a check script for the maths. Invoices carry a GST/HST number, net 15 or 30 terms and payment by Interac e-Transfer or EFT.",
      },
      {
        id: "craft",
        anchor: "Craft",
        title: "Motion & access",
        body: "Plain CSS with design tokens and no UI or state libraries. Scroll reveals, parallax, a count-up and an approval dot on a CSS offset-path, all on transform or opacity and off under reduced motion. Every control has a focus ring, each card has a move menu as a keyboard alternative to drag, and the drawer and command palette use native dialog.",
      },
    ],
  },
  {
    slug: "alderframe",
    figma: "https://www.figma.com/design/NoaCEk53nEXkMcn6CNAVdA/Alderframe-Studio---Editable-Website-Design",
    title: "Alderframe Studio",
    shortTitle: "Alderframe",
    oneLiner: "A native WordPress block theme and site plugin for a landscape studio, with no page builder and no paid plugins. A personal build.",
    period: "2026",
    year: "2026",
    role: "Design & WordPress development",
    tags: ["development", "wordpress", "ui-design"],
    cover: "/images/work/alderframe-cover.jpg",
    live: {
      src: sub("alderframe"),
      note: "The running WordPress site. Scroll the home page to turn the 3D garden, filter the gardens archive and open a garden record. Alderframe is made up, and its photos are illustrative images.",
    },
    gallery: [
      { src: "/images/work/alderframe/home.jpg", caption: "Home: the studio's pitch, then completed gardens on the canvas with no boxed cards" },
      { src: "/images/work/alderframe/gardens.jpg", caption: "Completed gardens: an archive filtered by site condition" },
      { src: "/images/work/alderframe/garden.jpg", caption: "A garden record: locality, area, condition and services, all from fields" },
      { src: "/images/work/alderframe/services.jpg", caption: "Services: four engagement types with fees in CAD and timelines" },
      { src: "/images/work/alderframe/fees.jpg", caption: "Design fees as aligned rows instead of pricing cards" },
      { src: "/images/work/alderframe/site-visit.jpg", caption: "Request a site visit: the first-party intake form" },
    ],
    facts: [
      { label: "Role", value: "Design & WordPress development" },
      { label: "Type", value: "Personal project" },
      { label: "Stack", value: "WordPress block theme, custom plugin, PHP 8.3, Blender" },
      { label: "Timeline", value: "2026" },
    ],
    summary:
      "Alderframe is a personal project, not a real company. I built it to show I can do WordPress the native way: a residential landscape architecture studio in Toronto, built as a block theme and a site plugin with no page builder and no paid plugins. I designed it in Figma first, then built the theme, the content model and the intake form, and rendered a 3D garden in Blender for the home page. Every garden, person and price in it is demo content.",
    chapters: [
      {
        id: "theme",
        anchor: "Theme",
        title: "A block theme, not a page builder",
        body: "The design lives in theme.json and 13 block templates: colour, type and spacing tokens, then templates for the home page, gardens, services, journal, search and 404. Editors work in the normal block editor and can't break the layout, because the parts that matter are blocks that render from data.",
      },
      {
        id: "records",
        anchor: "Records",
        title: "Records, fields and blocks",
        body: "The site plugin registers six record types (services, completed gardens, designers, owner quotes, visit FAQs and visit requests) and three taxonomies, with a field contract for each. Twenty-six dynamic blocks read those records, so a garden's locality, area, condition and services are entered once and show up on its page, in the archive and in related gardens. A WP-CLI command seeds the whole site from code.",
      },
      {
        id: "permission",
        anchor: "Permission",
        title: "Only with the owners' permission",
        body: "A garden appears only while its owners have approved it. The rule lives in the queries, not the templates, so the archive, related gardens, quotes, search and the sitemap all obey it, and a withdrawn garden's page answers 410 Gone instead of lingering.",
        problem: "A private garden can't stay online after the owners say no.",
      },
      {
        id: "intake",
        anchor: "Intake",
        title: "The site-visit form",
        body: "The request form is first-party: a nonce, a honeypot and a submission ID so a double click can't create two requests. Each request is saved as a private record before any email goes out, and errors come back with the visitor's answers kept.",
      },
      {
        id: "motion",
        anchor: "3D",
        title: "A garden in Blender",
        body: "I modelled a ravine garden in Blender and rendered it as a 72-frame sequence. On the home page the frames scrub with scroll, so the garden turns as you read, and it holds still for people who turn motion off.",
      },
    ],
  },
  {
    slug: "northline",
    figma: "https://www.figma.com/design/NDVgk2IaX0d6WQhdut8Zv1/NORTHLINE---Elementor",
    title: "Northline Operations Advisory",
    shortTitle: "Northline",
    oneLiner: "A WordPress and Elementor site for a manufacturing consultancy, built from custom Elementor widgets on the free stack. A personal build.",
    period: "2026",
    year: "2026",
    role: "Design & WordPress development",
    tags: ["development", "wordpress", "ui-design"],
    cover: "/images/work/northline-cover.jpg",
    live: {
      src: sub("northline"),
      note: "The running WordPress and Elementor site. Scroll the home page to turn the gearbox, then look at the case studies and the booking page. Northline is made up; its people, quotes, prices and results are illustrative.",
    },
    gallery: [
      { src: "/images/work/northline/home.jpg", caption: "Home: built in Elementor from the site's own section widgets" },
      { src: "/images/work/northline/services.jpg", caption: "Services: results pulled from the case-study records" },
      { src: "/images/work/northline/case-study.jpg", caption: "A case study with its metrics band" },
      { src: "/images/work/northline/pricing.jpg", caption: "Pricing: four engagement models that stack on mobile" },
      { src: "/images/work/northline/book.jpg", caption: "Booking: the built-in scheduler with 30-minute slots" },
      { src: "/images/work/northline/contact.jpg", caption: "Contact: step one of the three-step intake form" },
    ],
    facts: [
      { label: "Role", value: "Design & WordPress development" },
      { label: "Type", value: "Personal project" },
      { label: "Stack", value: "WordPress, Elementor, Hello Elementor child theme, Secure Custom Fields" },
      { label: "Timeline", value: "2026" },
    ],
    summary:
      "Northline is a personal project, not a real company. I built it to show I can build with WordPress and Elementor: an operations consultancy for mid-market manufacturers, made with free Elementor, a Hello Elementor child theme and a custom plugin. I designed it in Figma, then built the content model, 15 Elementor widgets, an intake form and a booking calendar, and rendered a gearbox in Blender for the home page. Every person, client, price and result in it is demo content.",
    chapters: [
      {
        id: "widgets",
        anchor: "Widgets",
        title: "Elementor, with guard rails",
        body: "Pages are built in the Elementor editor, but from 15 Northline widgets instead of loose headings and boxes: hero, proof strip, metric band, service list, packages, case grid, team, FAQ and the rest. Each widget reads its records directly, so a result changed on a case study updates everywhere it's quoted, and nobody can drag the design out of line.",
        problem: "Elementor makes it easy to edit a page and quietly break the design.",
      },
      {
        id: "content",
        anchor: "Content",
        title: "Content model",
        body: "The plugin registers the content types and taxonomies, defines the fields with Secure Custom Fields, and adds a settings page for the details that appear site-wide. A WP-CLI seed builds the whole site from code and matches records by a stable key, so running it twice updates instead of duplicating.",
      },
      {
        id: "forms",
        anchor: "Forms",
        title: "Intake and booking",
        body: "The three-step intake form saves each inquiry as a private record before it sends any email, with a token so a double submit counts once, plus a honeypot and a nonce. The booking page offers 30-minute slots over the next ten business days, refuses a slot that's already taken and emails an .ics invite. Both have test scripts for the invalid, duplicate and taken-slot cases.",
      },
      {
        id: "free",
        anchor: "Free stack",
        title: "Built on the free stack",
        body: "The plan called for Elementor Pro, ACF Pro, Gravity Forms and Calendly. I built it on the free tools instead: Secure Custom Fields uses the same field API, child-theme templates stand in for the Theme Builder, and the forms and scheduler are first-party, each with a clear upgrade path.",
      },
      {
        id: "craft",
        anchor: "Craft",
        title: "3D and access",
        body: "The gearbox on the home page is a procedural Blender model rendered as a frame sequence that plays with scroll. Fonts are self-hosted, and an accessibility check runs across 18 routes.",
      },
    ],
  },
  {
    slug: "saemil-ai",
    figma: "https://www.figma.com/design/b7VfoPB7QihNIqWMJUVi2v/SAEMIL",
    title: "Saemil AI",
    shortTitle: "Saemil AI",
    oneLiner: "A neural-network engine written from scratch in NumPy, training three unrelated models. A personal build.",
    period: "2026",
    year: "2026",
    role: "Machine learning & full-stack development",
    tags: ["development"],
    featured: true,
    cover: "/images/work/saemil-cover.png",
    live: {
      src: sub("saemil"),
      note: "Saemil Studio on its real FastAPI server, running the trained NumPy models. Draw a digit, generate names, move the shopping-session sliders, then press Explain results.",
    },
    gallery: [
      { src: "/images/work/saemil/report.png", caption: "Results: the three heads side by side, with the offline explanation" },
      { src: "/images/work/saemil/vision.png", caption: "Vision head: draw a digit, get the top three guesses" },
      { src: "/images/work/saemil/names.png", caption: "Names head: count, temperature and seed, with a novelty check" },
      { src: "/images/work/saemil/tabular.png", caption: "Tabular head: six session totals, set against the training percentiles" },
      { src: "/images/work/saemil/start.png", caption: "Start screen: pick a task, with sessions kept in the sidebar" },
      { src: "/images/work/saemil/providers.png", caption: "AI bridge: offline template, local CLI or a cloud API, explanation only" },
    ],
    facts: [
      { label: "Role", value: "Machine learning & full-stack development" },
      { label: "Type", value: "Personal project" },
      { label: "Stack", value: "Python, NumPy, FastAPI, vanilla JavaScript" },
      { label: "Timeline", value: "2026" },
    ],
    summary:
      "Saemil AI is a personal project, not a product or a company. I built it to show what I can do with the tools behind it: a neural-network engine written from scratch in NumPy, with no PyTorch, TensorFlow or scikit-learn doing any learning. The same forward, backward and optimizer code trains three unrelated models: a handwritten-digit classifier, a name generator and a purchase-probability model. Saemil Studio, a FastAPI app with a vanilla-JS page, lets you try all three.",
    chapters: [
      {
        id: "engine",
        anchor: "Engine",
        title: "Backprop by hand",
        body: "Linear, Embedding and Flatten layers each have an explicit forward and backward pass. Every layer, activation and loss is checked against float64 numerical gradients, and Adam against a reference implementation. The embedding's backward pass uses np.add.at, so a letter that appears twice in one window gets both gradient updates; a plain indexed add would silently drop one.",
        problem: "Is the engine actually general, or just tuned for one task?",
      },
      {
        id: "results",
        anchor: "Results",
        title: "Three heads, measured",
        body: "Each model is scored on a held-out test split against a simple baseline. The digit model reaches 93.3% accuracy (93.75% on the full 10,000-image MNIST test set). The name model's cross-entropy is 2.346 against a unigram baseline of 2.830. The shopping model's log loss is 0.4025 against 0.4306 for the base rate. Each trains on a laptop CPU in under two seconds, and retraining with the default seeds reproduces the model files byte for byte.",
      },
      {
        id: "safety",
        anchor: "Safety",
        title: "Safe files, honest limits",
        body: "Models save as .npz with a JSON manifest and no pickle; on load, every shape, dtype and layer connection is checked before anything is built, and saves are validated before being swapped in. The studio runs on loopback only with a Host allowlist and a body-size cap. The AI bridge only writes the plain-English explanation, never a prediction, and falls back to an offline template if a provider fails.",
      },
      {
        id: "tests",
        anchor: "Tests",
        title: "Tests & CI",
        body: "332 tests at 97% line coverage, with warnings treated as errors, plus ruff and mypy. CI runs them on Python 3.10 to 3.13 on every push. The browser and the server centre drawn digits the same way, and a test runs the JavaScript under Node to compare it with the Python version on 66 shared cases.",
      },
    ],
  },
  {
    slug: "akwaaba-database",
    figma: "https://www.figma.com/design/Ifrup7NhbPOujtqxHGDgQo/Akwaaba-DB",
    title: "Akwaaba Database",
    oneLiner: "Subscription platform with accounts, payment workflows and database-driven features.",
    period: "2018–2023",
    year: "2018–2023",
    role: "Development contributor",
    tags: ["development"],
    featured: true,
    cover: "/images/work/akwaaba-cover.jpg",
    demo: {
      src: sub("akwaaba"),
      note: "This is a mockup recreated for this portfolio to demonstrate the app's design and flows. It is not the original Akwaaba app or the work delivered at Click Communications.",
    },
    facts: [
      { label: "Role", value: "Development contributor" },
      { label: "Organization", value: "Click Communications" },
      { label: "Timeline", value: "2018–2023" },
    ],
    summary:
      "I contributed to the development of the Akwaaba Database at Click Communications, a subscription-based platform with user accounts, subscription management, payment-related workflows and database-driven functionality.",
  },
  {
    slug: "akomacare",
    figma: "https://www.figma.com/design/0Y3vUwvotn0gbYfrB63j6p/Akomacare",
    title: "AkomaCare demonstrations",
    oneLiner: "Technical demos of a heart-care guidelines app for the Ghana Heart Initiative board.",
    period: "2023",
    year: "2023",
    role: "Technical demonstration lead",
    tags: ["project-management"],
    cover: "/images/work/akomacare-cover.jpg",
    demo: {
      src: sub("akomacare"),
      note: "This is a mockup recreated for this portfolio to show the app's v1 design and flows. It is not the original AkomaCare app or the work delivered at Bisa Technologies.",
    },
    facts: [
      { label: "Role", value: "Technical demonstration lead" },
      { label: "Type", value: "Client" },
      { label: "Organization", value: "Bisa Technologies" },
      { label: "Timeline", value: "2023" },
    ],
    summary:
      "AkomaCare is a mobile and web app that gives frontline health workers, students and professionals pocket access to Ghana's national guidelines for managing cardiovascular disease. I led technical demonstrations for the Ghana Heart Initiative board, translating software and health data into actionable business information. The platform's later redesign was outside my scope.",
  },
  {
    slug: "conestoga-community-video",
    title: "Agents of Change",
    oneLiner: "A four-episode community video series bringing Kitchener-Waterloo charities' work to light.",
    period: "2024–2025",
    year: "2025",
    role: "Media production practicum",
    tags: ["film"],
    cover: "/images/work/agents-of-change-cover.jpg",
    facts: [
      { label: "Role", value: "Media production practicum" },
      { label: "Type", value: "4-episode show" },
      { label: "Organization", value: "Conestoga Connected & CCDTV" },
      { label: "Timeline", value: "2024–2025" },
    ],
    summary:
      "Agents of Change is a four-episode show I made for Conestoga Connected during my practicum at Conestoga Connected & CCDTV, while I was a student at Conestoga College. My project partner Vlad and I visited charity organizations in the Kitchener-Waterloo area, interviewed the people behind them and brought their work to light. I worked across script writing, shooting and video editing on every episode, sharing that work with Vlad, and coordinated timelines, production logistics and equipment from concept through delivery.",
    videos: [
      { id: "zmMCBgmMCYA", title: "Episode 1: Ray of Hope" },
      { id: "54OsqEsZuqQ", title: "Episode 2: Brain Injury Association Waterloo-Wellington" },
      { id: "pMpTCOJ8GS4", title: "Episode 3: Uptown Thrift" },
      { id: "kRsrsVX4MVQ", title: "Episode 4: Habitat for Humanity" },
    ],
  },
  {
    slug: "23-dreamz-interview",
    title: "Interview with 23 Dreamz",
    oneLiner: "A Johnson Ebiminu film profiling Kitchener-Waterloo producer and musician 23 Dreamz.",
    period: "2025",
    year: "2025",
    role: "Assistant Director",
    tags: ["film"],
    cover: "/images/work/23-dreamz-cover.jpg",
    facts: [
      { label: "Role", value: "Assistant Director" },
      { label: "Director", value: "Johnson Ebiminu" },
      { label: "Type", value: "Independent" },
      { label: "Timeline", value: "2025" },
    ],
    summary:
      "Interview with 23 Dreamz is a project by director Johnson Ebiminu, profiling a producer and musician in Kitchener-Waterloo. I'm credited as Assistant Director and made it outside of school. Beyond that role, I was involved across many parts of the production, including script writing and shooting.",
    videos: [{ id: "hCcfDNW4Vno", title: "Interview with 23 Dreamz" }],
  },
];

export const disciplineName = (id: DisciplineId) => disciplines.find((d) => d.id === id)!.name;
export const projectsIn = (id: DisciplineId) => projects.filter((p) => p.tags.includes(id));
/** Show only what exists: a discipline with no published project never renders. */
export const activeDisciplines = disciplines.filter((d) => projectsIn(d.id).length > 0);
export const metaLine = (p: Project) => `${p.period} · ${p.role}`;

export const about = {
  headline: "A developer, shaped by marketing, delivery and broadcasting.",
  teaser:
    "My route into development runs through marketing, agency project leadership and broadcasting. Each has changed how I approach the work.",
  now: "Now: completing the Google Project Management Certificate.",
  bio: [
    "I'm Samuel, a full-stack developer based in Southwestern Ontario. I like taking a complicated brief and turning it into something people can use.",
    "My route into development runs through communication, project leadership and broadcasting. Each has changed how I approach the work.",
    "I'm looking for a full-time developer role in Southwestern Ontario or remote across Canada, and I'm open to relocating to Sarnia or London.",
  ],
  skills: [
    { heading: "Development", items: ["React", "Next.js", "TypeScript", "Node.js", "Python", "FastAPI", "PHP", "Flutter"] },
    { heading: "UI Design", items: ["Figma", "UI/UX wireframing", "A/B testing"] },
    {
      heading: "Project Management",
      items: ["Agile", "Waterfall", "Jira", "Asana", "Stakeholder management", "Risk management"],
    },
    { heading: "Film", items: ["Premiere Pro", "After Effects", "Photoshop", "Motion graphics"] },
  ],
  tools: ["PostgreSQL", "MySQL", "Docker", "AWS", "Ubuntu VPS", "Git", "GitHub", "CI/CD", "WordPress", "Payload CMS", "Stripe"],
};

// From the Nov 2026 developer PDF, plus the LSP and Conestoga entries from the earlier resume (Resume/resumes.ts).
export const resume = {
  updated: "Updated November 2026",
  summary:
    "Full-stack developer with 5+ years of experience designing in Figma and shipping production web applications in React, Next.js, TypeScript, Node.js, Python, PHP and WordPress. Proven track record modernizing legacy systems, modeling relational databases in PostgreSQL, implementing Canadian tax and payment workflows, and leading small engineering teams. Seeking a full-time developer role in Southwestern Ontario or remote across Canada.",
  competencies: [
    { label: "Frontend", items: "React, Next.js, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS, Flutter, Three.js, Figma" },
    { label: "Backend & CMS", items: "Node.js, Python, FastAPI, PHP, Payload CMS, WordPress (Block Themes, Custom PHP, Elementor, WP-CLI), REST APIs, Stripe" },
    { label: "Data & ML", items: "PostgreSQL, MySQL, SQL, NumPy" },
    { label: "DevOps & Tools", items: "Git, GitHub, CI/CD, Docker, Ubuntu VPS, AWS, Automated Testing" },
  ],
  experience: [
    {
      role: "Guest Service Agent & Night Auditor",
      org: "Home2 Suites by Hilton — Brantford, ON",
      dates: "Mar 2026 – Present",
      bullets: [
        "Manage solo overnight hotel operations, reconcile nightly revenue ledgers, trace billing discrepancies and resolve guest issues independently.",
      ],
    },
    {
      role: "Location Support Personnel (LSP)",
      org: "Take 1 & Concepts Location Services — Ontario",
      dates: "Aug 2024 – Present (seasonal, on call)",
      bullets: ["Keep production crews within permit, safety and schedule rules on public sites; settle problems on site."],
    },
    {
      role: "Media Production Practicum",
      org: "Conestoga Connected & CCDTV — Kitchener, ON",
      dates: "Jan 2024 – Apr 2025",
      bullets: [
        "Wrote, shot and edited Agents of Change, a four-episode series on Kitchener-Waterloo charities.",
        "Coordinated a team of about six on the program's final production and capstone: schedule, crew, equipment.",
      ],
    },
    {
      role: "Senior Project Manager & Technical Lead",
      org: "Bisa Technologies — Accra, Ghana",
      dates: "Jun 2023 – Oct 2023",
      bullets: [
        "Led frontend architecture and product delivery across a 4-person team (3 developers, 1 designer), shipping web event systems and mobile applications under tight launch deadlines.",
        "Built an emergency on-site QR quick-pass workflow during the 30th Afreximbank Annual Meetings when unregistered dignitaries failed database lookups, verifying IDs and generating instant QR passes so venue entry kept moving until permanent badges were printed the next day.",
        "Took sole ownership of the AkomaCare mobile application, executing a full visual rebrand and shipping gamified engagement features.",
      ],
    },
    {
      role: "Project Lead & Full-Stack Developer",
      org: "Click Communications (formerly Advocacy Media Services; now Akwaba Solutions) — Accra, Ghana",
      dates: "2017 – Jan 2023",
      bullets: [
        "Architected and maintained Akwaba Database, a member management, outreach and employee attendance platform serving 200–300+ users across 3–4 institutions, including hospitals.",
        "Led a full-stack modernization alongside a 3–4 developer team, migrating the legacy PHP backend to Python, rebuilding the frontend in React and shipping a companion mobile app.",
        "Built user account, subscription and payment workflows, lifting user engagement 30% across client web products through responsive redesigns, SEO tracking and analytics.",
      ],
    },
  ],
  education: [
    { title: "Google Project Management Professional Certificate", org: "Coursera", dates: "2026" },
    { title: "Ontario College Diploma, Broadcasting – Television and Independent Production", org: "Conestoga College", dates: "2024 – 2025" },
    { title: "B.Sc. Marketing", org: "University of Professional Studies, Accra", dates: "2012 – 2016" },
  ],
};

export const contactTypes = [
  { value: "Job", hint: "Full-time or contract roles", placeholder: "Tell me about the role and the team." },
  { value: "Freelance", hint: "A project with a scope and a budget", placeholder: "What are you building, and by when?" },
  { value: "Collaboration", hint: "Something we make together", placeholder: "What would we make together?" },
  { value: "Other", hint: "Anything else", placeholder: "What's on your mind?" },
];
