# Raghav Buildcon — corporate website

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · GSAP ScrollTrigger · three.js. Every page is statically pre-rendered.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run start        # serve the production build
npm run lint         # ESLint (next/core-web-vitals + TypeScript)
npm run typecheck    # tsc --noEmit
```

Requires Node.js 20.9 or later. Copy `.env.example` to `.env.local` and set:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap, robots and structured data. |
| `CONTACT_WEBHOOK_URL` | Optional legacy server-action receiver; the enquiry forms now open WhatsApp and do not require it. |

## Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about` | About, values, milestones, leadership, credentials |
| `/expertise`, `/expertise/[slug]` | Verticals: roads-highways, bridges-structures, buildings, epc-construction |
| `/projects`, `/projects/[slug]` | Infrastructure Projects (filterable) and project detail pages |
| `/signature-projects` | Signature project stories |
| `/sustainability` | Sustainability & ESG |
| `/safety-quality` | Safety & Quality |
| `/careers` | Careers and register-your-interest form |
| `/news`, `/news/[slug]` | News & updates |
| `/contact` | Contact details and enquiry form |

Also generated: `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, the favicon (`src/app/icon.svg`), the Apple touch icon and the Open Graph share image.

## Replacing placeholder content

Company details supplied so far (in `src/content/company.ts`): office address, phone, email, the founding date (March 2026), the official About text, the list of works undertaken, and the tagline "Building Infrastructure. Delivering Trust." Nothing beyond that was invented. Every missing fact is `null` and renders as a dashed **"To be updated"** marker. Illustrative entries are badged **"Sample content"**. Replace content in `src/content/`:

| File | What to fill in |
| --- | --- |
| `company.ts` | Legal name, founding year, HQ, registration/CIN, regions, contact details, social links, headline **stats**, **leadership** and **credentials**, milestones |
| `projects.ts` | **All 7 projects are samples.** Replace them with verified projects, fill in `facts`, and set `sample: false` |
| `news.ts` | **All 3 posts are samples.** Replace them with real announcements and dates, and set `sample: false` |
| `verticals.ts` | Review the capability and scope lists and remove anything the company does not do |
| `images.ts` | Photo registry (see below) |
| `src/app/careers/page.tsx` | `openings` list. While it is empty, the page shows a "no openings" message |

All page copy is a **draft for review**, including taglines, vision and mission (`about/page.tsx`), values and the "Why Raghav Buildcon" commitments. Confirm it with the company before launch.

## Photography

`public/images/*.jpg` are **generic stock photos** used as placeholders. **None of them shows a Raghav Buildcon project.** Replace each one with the company's own site photography, either by keeping the file name or by editing `src/content/images.ts`, and update the `alt` text. Do not use photos of other companies' projects, and do not reuse images from other construction-company websites.

The current files come from Unsplash under the [Unsplash Licence](https://unsplash.com/license): free for commercial use, attribution not required. Credits:

| File | Photographer | Source |
| --- | --- | --- |
| hero-expressway.jpg | J F | Unsplash |
| roads-highways.jpg | Mohamed Adil | Unsplash |
| bridges-structures.jpg | Red Shuheart | Unsplash |
| buildings.jpg | Marek Minor | Unsplash |
| epc-construction.jpg | Troy Mortier | Unsplash |
| aerial-interchange.jpg | Ed 259 | Unsplash |
| engineers-site.jpg | Glenov Brankovic | Unsplash |
| metro-viaduct.jpg | Albert Stoynov | Unsplash |
| ghat-highway.jpg | jaikishan patel | Unsplash |
| sustainability.jpg | Andreas Gücklhorn | Unsplash |
| safety-quality.jpg | Mufid Majnun | Unsplash |
| careers-team.jpg | Marcus Reubenstein | Unsplash |

Before launch, open each photo at full size and check it for third-party logos or branding.

## Brand

- **Logo:** the official Raghav Buildcon shield emblem. `public/brand/raghav-buildcon-logo.png` is the master copy, cut out onto a transparent background from the supplied JPEG. It is used in the header, footer, favicon (`src/app/icon.png`), Apple touch icon (`src/app/apple-icon.png`, on navy), share image (`src/assets/og-logo.png`), error screen and Organization structured data.
- `src/components/brand/Logo.tsx`: `LogoMark` (the emblem) and `Logo` (the emblem plus the "RAGHAV BUILDCON" wordmark), in `light` (for dark backgrounds) and `dark` (for light backgrounds) variants.
- If a vector (SVG/AI/EPS) or higher-resolution original of the emblem exists, use it to replace these files. The supplied JPEG is 1024 px, so the favicon is the most compressed rendering.
- Colour and type tokens: `src/app/globals.css`. The palette is charcoal-navy `ink`, construction `gold`, `sand` and `leaf`. Fonts are Archivo for headings and Manrope for body text, both via `next/font`.

## Architecture

```
src/
  app/            routes, metadata files (sitemap, robots, manifest, icons, OG image), error/loading/404
  components/
    brand/        logo
    cards/        project, vertical and news cards
    forms/        enquiry form (client) → lib/actions/enquiry.ts (server action)
    layout/       header (mega menu + mobile menu), footer
    motion/       reveal observer, counters, page effects, 3D assembly models (assembly/)
    sections/     page hero, CTA band, stats, process, feature grid, credibility, project explorer
    ui/           container, buttons, headings, icons, placeholders
  content/        all site content and data (assembly.ts: the build stages shown with the 3D models)
  lib/            SEO helpers, site URL, enquiry validation, motion mode and timing
```

Motion respects `prefers-reduced-motion`. Revealed content stays visible without JavaScript.

## Motion and 3D models

- **Motion mode** (`lib/motion.ts`, one constant). `"auto"` (the default): every animation plays by itself — a reveal once, at its own pace, as it comes into view; a 3D model through its build when its section appears, pausing while the section is off screen and holding the finished model afterwards, with a **Replay** button to build it again; the hero model as the page opens. Nothing is pinned and nothing follows the scroll position. `"scroll"`: everything is scrubbed by the scroll position — the 3D sections pin while their model builds, scrolling back takes it apart, and the reveals progress as they are scrolled through. `STAGE_SECONDS` in the same file sets how long each build stage takes in auto mode. Both modes honour reduced motion.
- **3D build sequences** (`components/motion/assembly/`). A full-screen section in which a model assembles itself stage by stage: each part travels into place (or grows out of its base) during its stage, glowing gold while it moves, and is drawn as a gold blueprint outline until it arrives. The list of stages beside it highlights the one being built. `drive.ts` plays the build (auto) or scrubs it (scroll) for every 3D view.
  - Home: a bridge (foundations → piers → girders → deck → finishing → traffic).
  - Expertise pages: a road built layer by layer, the bridge, a building floor by floor, and a pipeline laid joint by joint (`verticalAssembly` in `content/assembly.ts`).
- **3D hero** (`HeroScene.tsx`, home page). A township — a tower beside two houses on a new street — builds itself behind the headline as the page opens (in scroll mode it keeps building, and the camera rises, as the hero scrolls away) and leans towards the mouse. It loads after the page has loaded and fades in over the hero photo, which remains the first paint and the fallback without WebGL.
- **Framed models** (`AssemblyFrame.tsx`). A model in a card that assembles while the card is on screen, with no pinning; the caption names the current stage. Home "What we build" (a house, a multi-storey building, a box culvert — `showcase` in `content/assembly.ts`), About (the multi-storey building) and Sustainability (a portal-frame shed with rooftop solar and rainwater storage).
- **Four verticals** (`VerticalsShowcase.tsx`, home page). One section and one 3D world: a road, the bridge, a building and a pipeline on a single landscape (`verticalsWorld` in `models-world.ts`). The camera follows each build and flies on to the next site while the panel beside it changes vertical; the tabs jump to a vertical.
- **Infrastructure network** (home "Featured projects", and the Expertise and Projects heroes). A road winds from a town of homes over a river bridge to a tower; it is paved along its length, each segment meeting the next at a round joint (`network` in `models-world.ts`).
- **Inner page heroes.** `PageHero` takes `scene`: About and News (township), Expertise and Projects (network), Signature projects (bridge), Sustainability (solar shed), Safety & quality (tower), Careers and Contact (house).
- Models: `kit.ts` (part types, a builder that places a structure at an origin and can renumber its stages, shared pieces such as pegs, vehicles and trees), `models.ts` (bridge, road, building, pipeline), `models-homes.ts` (house, tower, culvert, shed, and the hero township) and `models-world.ts` (the verticals world and the network); `catalog.ts` lists them all. Each describes the model as plain data (solids, finished positions, stages, camera path); `scene.ts` renders it with three.js, with studio reflections (RoomEnvironment), soft shadows and surface detail painted once on canvases and scaled to metres (`textures.ts`: concrete and earth grain, curtain-wall mullions, roof courses, ribbed sheeting, solar cells). `mount.ts` is the lifecycle every view shares: a canvas redraws only when the build, pointer or size changes; three.js loads only when a model comes near the screen and is released when it is far away, so no more than three WebGL views are alive at once.
  - The models are illustrations, labelled "Illustrative model" on the page; they do not depict a Raghav Buildcon project. The stage captions describe the usual sequence of each kind of work; review them with the company like the rest of the copy.
  - With reduced motion, or on a device without WebGL, nothing is pinned or animated: every stage is listed, and the finished models are shown when they can be drawn.
- **Page effects** (`components/motion/ScrollEffects.tsx`), opted into with data attributes: `data-hero` (the hero photo breathes slowly; in scroll mode the text lifts and fades and the photo drifts as the hero scrolls away), `data-parallax` (a photo drifts inside its frame), `data-depth` (decorative layers move at their own speed), `data-assemble` (cards fly in from spread-out 3D positions and lock into the grid), `data-tilt` (a block tips up from a 3D tilt), `data-words` (a heading brightens word by word as it is read — every `SectionHeading` has it), `data-clip` (a photo opens from a cropped window), `data-draw` (an SVG draws its strokes — `FeatureGrid` icons and the "Why" emblems), `data-fill-sequence` (gold lines fill step by step — `ProcessSteps` and the delivery rail), `data-hover-tilt` (a card tilts towards the mouse). In auto mode the reveals play once as they come into view and the drifts run while on screen; in scroll mode all are scrubbed by the scroll position. All are skipped with reduced motion.
- **Home sections**: `IntroStory` (the "Who we are" statement, layered photo and facts), `WhyCommitments` (a self-drawing bridge elevation, emblem cards and the delivery lifecycle rail) and `NewsShowcase` (an editorial spread with a category ticker — also used on `/news`).
- Screen sizes: the full-screen 3D sections lay their text beside the model on desktop (`lg:`), stack it on phones and tablets, and on landscape phones (`short:`, under 520px tall) go back to the side-by-side layout so nothing is cut off. With reduced motion or without WebGL (`still:`) nothing is pinned.
- `lib/keep-place.ts` (scroll mode) keeps the visitor's place when the layout switches between phone and desktop (window resize, tablet rotation); without it ScrollTrigger 3.15 jumps to the top of the page when a pin is rebuilt.

## Note on location

This folder lives inside OneDrive. OneDrive will try to sync `node_modules/` and `.next/` (tens of thousands of files). Consider moving the project outside OneDrive, or excluding those folders from sync.

## Deploy to Vercel

This project includes `vercel.json` with the Next.js preset, reproducible `npm ci` installation, and the production build command. Use Node.js 24.x in Vercel project settings (the locally verified version).

1. Push this project to your Git provider and import the repository in Vercel, or run `vercel --prod` from this folder after signing in.
2. Set the Root Directory to the folder containing `package.json` and `vercel.json`. Keep the default Next.js output directory.
3. Optionally set `NEXT_PUBLIC_SITE_URL` to your custom HTTPS domain, with no trailing slash. When omitted, metadata and sitemap URLs use Vercel's production domain automatically.
4. Enquiry forms open WhatsApp to the published company phone number in `src/content/company.ts`. Ensure this number is registered with WhatsApp. Visitors review the formatted draft and tap Send; no webhook or email credentials are required.
5. Deploy. Check the home page, contact page, `/sitemap.xml`, and `/robots.txt` at the deployed URL.

Environment variable changes require a new deployment. No Vercel account or credentials are included in this project; publishing requires signing into your own Vercel account.

## WhatsApp enquiries

Contact and careers forms validate required fields and consent, then open `wa.me` with a URL-encoded message containing name, organisation, email, phone, enquiry type and the original message. Optional empty details are marked "Not provided". The visitor must tap Send in WhatsApp; opening the draft does not confirm delivery. Form values remain available when returning to the page. No WhatsApp message is sent by the website itself.
