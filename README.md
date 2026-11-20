# Samuel Roland Vroom: portfolio

The source for my portfolio site. It shows ten projects across development, WordPress, UI design, project management and film, each with its own case study page.

**Figma Design:** [MY PORTFOLIO](https://www.figma.com/design/q5AXxuMRpVFZeWa5q6OKK4/MY-PORTFOLIO)

Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, three.js. Contact mail goes through [Resend](https://resend.com). Visit stats go to Postgres (I use a pooled [Neon](https://neon.tech) URL), with locations looked up from a local [MaxMind GeoLite2](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data) file.

## Run it locally

Needs Node.js 22 or newer.

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

Open http://localhost:3000. The site runs with every variable left empty; the contact form and `/stats` just tell you they aren't set up.

## Checks

```bash
npm run typecheck
```

```bash
npm test
```

```bash
npm run build
```

`typecheck` runs `next typegen` first, because `next-env.d.ts` is generated and not committed.

GitHub Actions (`.github/workflows/ci.yml`) runs `npm ci` and these three on every push to main and on pull requests, with Node 22.

## Running on a server

The site is meant for my own VPS, not a hosting platform. It's a normal Node server:

```bash
npm ci
```

```bash
npm run build
```

```bash
npm start -- -p 3000
```

Put the variables below in `.env.local` on the server, or in the process environment, before `npm run build`. `NEXT_PUBLIC_SITE_URL` is baked in at build time.

## Configuration

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public URL, used by metadata, the sitemap and share images |
| `RESEND_API_KEY` | Sends contact-form messages through Resend |
| `CONTACT_TO` | Private inbox that receives messages; not shown on the site |
| `CONTACT_FROM` | Sender on a domain verified in Resend |
| `DATABASE_URL` | Postgres connection string for visit stats; without it nothing is recorded |
| `STATS_PASSWORD` | Password for `/stats`; without it `/stats` is a 404 |
| `GEOIP_DB` | Path to a MaxMind GeoLite2-City `.mmdb` file on the server, for visitor locations; without it locations stay blank |

## Layout

- `app/`: routes, design tokens (`globals.css`), the contact and tracking APIs, metadata, icons
- `app/work/[slug]/`: one route for both case studies and discipline pages
- `components/`: header, dock, cards, work browser, contact form, the 3D ribbon (`ribbon-scene.ts`, lazy-loaded)
- `lib/content.ts`: every word a visitor reads
- `lib/contact.ts`, `lib/analytics.ts`: form validation and the stats queries
- `proxy.ts`: password gate on `/stats`
- `public/`: project covers and screenshots, the résumé PDF, the ribbon model and its posters, the SETSPACE prototype
- `tests/`: Node's built-in test runner, no extra framework

## Case Study

### What it had to show

I needed one place that holds all of my work. That work isn't all code: there are Next.js apps, two WordPress builds, Figma files, a community video series filmed at Conestoga and an interview. So the site has to show a developer, a designer, a coordinator and a filmmaker without any of them getting buried. And it can't claim anything I can't back up. No made-up clients, no testimonials, no performance numbers.

### How the work is organized

There are ten projects and five disciplines. A project can carry more than one tag, so the counts overlap: Development 8, WordPress 2, UI Design 5, Project Management 1, Film 2. The counts come from the project list itself. A discipline with no projects drops off the site on its own.

Both kinds of page live under `/work/<segment>`. `/work/orbit` is a case study and `/work/development` is a discipline page; a test checks that no project slug collides with a discipline id. The Work page sorts by Featured, which puts development first, and also offers Newest. Featured is the default because "Newest" would put the 2025 film work on top.

Each case study is built from the same parts, and each part only shows when it has something in it: summary, facts, chapters, a Figma link, a screenshot gallery, YouTube videos, an interactive prototype, a live copy of the project in an iframe. The SETSPACE prototype is a single HTML file in `public/`. The live copies run on their own subdomains, so those frames stay blank on localhost.

### Implementation decisions

All content sits in one typed file, `lib/content.ts`. There's no CMS. Nobody else edits the site, and a CMS would be one more thing to host. Every line in that file has to trace back to my own content notes, and a test fails if a phone number or one of the sample names from the mockups shows up there.

The 3D ribbon on the home page uses plain three.js with a Draco-compressed model. It loads lazily, after the page is already readable, and there are still poster images for light and dark themes. Motion elsewhere is CSS. I left out React Three Fiber, GSAP and smooth-scroll libraries; the design asked for one quiet moment per page, not a show.

The contact form posts to `/api/contact`, which validates the message and sends it with Resend. If the key is missing or Resend fails, the form says so, keeps what the visitor typed and gives them the email address. It never shows a fake success. Messages arrive at a private inbox; the site shows a different public address.

Visit stats are my own, not a third-party script. `/api/track` writes one row per page view to Postgres, skips bots and does nothing without `DATABASE_URL`. On my VPS there are no host location headers, so the country, region and city come from a GeoLite2 file read on the server; visitor IPs aren't sent anywhere. `/stats` sits behind HTTP Basic auth in `proxy.ts`, compared in constant time. Opening it marks that browser as mine so it stops counting itself. There's no rate limit on tracking yet; the code says so where it matters.

The résumé page has a PDF download. The button says "Download started", because a browser can't confirm the file was saved.

### What I checked

On a clean copy of this repository, on 2026-11-20, with Node 22.19.0:

- `npm ci` installed cleanly.
- `npm run typecheck` passed after the `next typegen` fix. Before that it failed on a fresh clone, since the image types come from the generated `next-env.d.ts`.
- `npm test` ran 12 tests, all passing: content rules, contact validation, analytics parsing and GeoIP mapping. One had failed first: the discipline counts still expected AkomaCare under Project Management.
- `npm run build` finished and prerendered 31 pages, including every case study and discipline page.

I didn't test real mail delivery or the stats database from this copy; both need private keys that aren't in the repository.

## Timeline

- 2026-11-01: project started; stack and content rules set (from the project's decision log).
- 2026-11-19: published to GitHub.

## Third-party files

- `public/draco/`: the Draco mesh decoder from Google, Apache License 2.0, as shipped with three.js.
- Fonts come from the `geist` npm package (SIL Open Font License).

## License

Apache License 2.0. See [LICENSE](LICENSE).
