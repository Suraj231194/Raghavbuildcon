# Raghav Buildcon — corporate website

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4. Every page is statically pre-rendered.

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
| `CONTACT_WEBHOOK_URL` | HTTPS endpoint that receives enquiry-form submissions as JSON. Without it, production visitors are told to phone or email instead, so no enquiry is silently lost. |

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
    motion/       scroll-reveal observer, counters
    sections/     page hero, CTA band, stats, process, feature grid, credibility, project explorer
    ui/           container, buttons, headings, icons, placeholders
  content/        all site content and data
  lib/            SEO helpers, site URL, enquiry validation
```

Motion respects `prefers-reduced-motion`. Scroll-reveal content stays visible without JavaScript.

## Note on location

This folder lives inside OneDrive. OneDrive will try to sync `node_modules/` and `.next/` (tens of thousands of files). Consider moving the project outside OneDrive, or excluding those folders from sync.

## Deploy to Vercel

This project includes `vercel.json` with the Next.js preset, reproducible `npm ci` installation, and the production build command. Use Node.js 24.x in Vercel project settings (the locally verified version).

1. Push this project to your Git provider and import the repository in Vercel, or run `vercel --prod` from this folder after signing in.
2. Set the Root Directory to the folder containing `package.json` and `vercel.json`. Keep the default Next.js output directory.
3. Optionally set `NEXT_PUBLIC_SITE_URL` to your custom HTTPS domain, with no trailing slash. When omitted, metadata and sitemap URLs use Vercel's production domain automatically.
4. Set `CONTACT_WEBHOOK_URL` to your HTTPS enquiry receiver to enable form delivery. Without it, the production form directs visitors to phone or email.
5. Deploy. Check the home page, contact page, `/sitemap.xml`, and `/robots.txt` at the deployed URL.

Environment variable changes require a new deployment. No Vercel account or credentials are included in this project; publishing requires signing into your own Vercel account.
