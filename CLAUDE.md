# Developer notes (rebuild status – read first)

**Stack:** Next.js 16 (App Router, `output: 'export'`, `trailingSlash`), React 19, Tailwind CSS v4, TypeScript, lucide-react. No server, no DB.

## Commands
| Command | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Static export to `out/` (+ `postbuild` flattens Next 16 prefetch files – see below) |
| `npm run verify` | Checks `out/`: redirect targets exist, one `<h1>`, unique titles/descriptions, canonical, valid JSON-LD, no broken internal links/images, banned old-site text |
| `npm test` | Unit tests for price estimate + WhatsApp message (`tests/booking.test.ts`) |
| `npm run images` | Re-creates `public/images/**` WebP files + `data/image-manifest.json` from `aldy_uploads/` (git-ignored originals). Only needed when photos change |
| `npm run lint` | ESLint |

Cloudflare Pages: build command `npm run build`, output folder `out`, Node 20+.

## Where things live
- `lib/site.ts` – phone, email, address, socials, mileage rule (single source of truth)
- `data/*.json` – handover data (copied from `aldy-handover/data`). `content/*.ts` – **new, original copy**: car descriptions & cleaned specs (`content/cars.ts`), 46 location texts, proof-read FAQs, 3 blog posts
- `lib/cars.ts` – merges JSON + content + images; filters `status: active`; merges JAC J7 colour listings into `/cars/jac-j7/` with a colour picker
- `lib/pricing.ts` – estimate: <7 days day×price (capped at week price); 7–27 pro-rated weekly (capped at month); 28–30 = month; longer pro-rated monthly; missing tier → "Ask for price"
- `lib/whatsapp.ts` – booking message (HANDOVER §6 format)
- `app/cars/[slug]` – serves both car pages and the `economy` / `luxury` category pages
- `public/_redirects` – handover file with edits: JAC colour URLs → `/cars/jac-j7/`, MG GT / Toyota Rush (drafts) → `/cars/`, V6 blog post → `/blog/`

## Decisions taken (Nov 2026)
- 2 categories kept (Economy, Luxury) – user decision; Mercedes C300 / Tesla / Land Cruiser stay in Economy
- JAC J7 = one page, colours Blue (base listing), Red, Black, White
- All 46 location pages built with unique copy; delivery fee/time always "confirmed on WhatsApp"
- Design: GREY theme (user palette, 19 Nov 2026 – replaces "desert sunrise"). Tokens in `app/globals.css` `@theme`: page `canvas` #F4F5F7, cards `surface` #FFF, text `ink` #3F4248, `muted` #6B7079 (darkened from the brief's #8A8F98 for AA), `line` #D9DCE1, `charcoal` #2B2D31 header, `brand-*` = neutral grey/charcoal scale, ONE accent `accent-500` = sand/peach #FDA57C (user swapped the brief's orange #F77F00 back to the earlier "delivered to you" colour, 19 Nov 2026; +600 #FB9466 hover, 700 #B8461E for accent text on light). Rule: accent FILLS carry dark text (`text-brand-700`) – white on #FDA57C fails AA. Accent only on primary CTAs (`.btn-primary`, card "Book" pill), prices, stars, active nav underline, small highlights. Footer tokens `footer-bg/bottom/text/muted/line`. No teal/sun gradients any more. Headings Bricolage Grotesque, body Plus Jakarta Sans. WhatsApp green `#0f7a40`
- Header (`components/HeaderShell.tsx`): charcoal bar on every page; on the home page it stays transparent over the video hero (`[data-hero]` in `video-hero.tsx`) and turns charcoal once the hero has scrolled away. Menu = Home, Cars (drop-down), FAQ, About, Contact (`lib/site.ts` `nav`, user choice 19 Nov 2026 – Locations left out because the booking form has the area picker, Blog moved to the footer)
- Footer (`components/Footer.tsx`): dark, brand row (logo, orange "Chat on WhatsApp", socials) + Company / Rentals / Support / Contact columns + bottom bar with "Powered by AiTion Labs" (plain text; TODO link). Only real pages are linked; TODOs mark Careers, SUV, Monthly, office hours, X/TikTok
- Floating contact (`components/StickyContactBar.tsx`): ONLY a round WhatsApp button on phones and desktop – the floating Call button and the mobile Call/WhatsApp bottom bar were removed (user decision 19 Nov 2026, overrides HANDOVER §4 "sticky Call + WhatsApp"). Calling stays in the mobile menu, booking form, contact page and footer
- FAQ (`components/FaqList.tsx` + `FaqGroup.tsx`): one answer open at a time (shared `<details name>` + capture-phase toggle fallback); `/faq/#slug` opens that answer
- Motion (landing-page-design B7): `components/ScrollReveal.tsx` (mounted in layout; re-observes on every route change – track watched elements per effect run, never with a DOM flag, or the persistent footer stays hidden; boot script shows everything if it hasn't started 4 s after load) reveals `[data-reveal]`, `[data-reveal-stagger]` (children step 80 ms) and `[data-reveal-line]` once on scroll; CSS in `globals.css`. Hidden only when `<html class="reveal">` (inline boot script, skipped for reduced motion) – never put `data-reveal` on above-the-fold content or the LCP element. Hero / page-header entrance via `.hero-in-1/2/3` (h1 moves without fading). Mobile menu links `.menu-item-in`. Buttons and cards lift on hover
- Not published (unverified): opening hours, payment-card logos, "12 car types / 179 cars", Rolls-Royce deposit (shown "On request"), Rolls-Royce spec lines, fuel-economy figures (several were wrong in the data)
- Favicon: the real Aldy favicon (white "a" on black), copied unchanged to `app/icon.png` by `npm run images` – do not recolour it to the theme. Apple/512 px icons are the same design, rebuilt from the logo's "a" for sharpness
- Header parts: desktop links + Cars drop-down in `components/NavLinks.tsx` (CSS hover/focus, active page via `usePathname`), slide-in mobile menu in `components/MobileMenu.tsx`
- shadcn/ui structure (set up by hand – `npx shadcn init` would overwrite `app/globals.css`): `components.json`, `lib/utils.ts` (`cn`), shadcn colour tokens mapped to the theme in `@theme`, primitives in `components/ui/` (`button.tsx`, `contact-with-globe.tsx`). Page helpers moved from `components/ui.tsx` to `components/common.tsx` to free the `ui/` folder. Add more with `npx shadcn@latest add <name>`
- Contact page uses `components/ContactSection.tsx` → `components/ui/contact-with-globe.tsx` (d3 + motion, loaded on /contact/ only). Form has no backend: it opens WhatsApp / mailto with the message. World map is a local copy at `public/geo/countries-110m.json` (from the `world-atlas` package)
- Home page motion (adapted from the "Daytake" GSAP landing page, user choice 17 Nov 2026): `components/ui/car-motion.tsx` → `MosaicHero` (tilted 3D wall of car photos that straightens on scroll, pinned on large screens), `CarLanes` (two tilted, auto-gliding, swipeable rows of car cards + pause button), `Reveal` (staggered card entrance). GSAP is loaded lazily on browser idle (`useLazyGsap`) to protect load performance; all motion off for prefers-reduced-motion. Do not use CSS mask/blend/blur on the 3D wall (costs seconds of main-thread time on phones)
- The Rolls-Royce cut-out (`public/images/hero-phantom*.webp`, made by `scripts/convert-images.mjs`) is no longer used on the home hero but kept for reuse
- Home hero (17 Nov 2026, idea from alfareedbm.com): `components/ui/video-hero.tsx` – full-screen background video under a DARK overlay with centred white text (user choice; the only dark section), no play/pause button (user choice). The poster `<img>` is the LCP; the video mounts after load + idle, is skipped for reduced motion / Data Saver / 2g-3g, and pauses off screen. Current clip = montage of the Rolls-Royce photos (`scripts/make-montage.mjs` → `hero_source/`, git-ignored), converted with `npm run video -- <input> [start] [duration] [source] [licence]` (ffmpeg-static) → `public/video/` + `data/video-manifest.json`. Several Rolls-Royce photos look like manufacturer press images from the old site – confirm usage rights with Aldy. Replace with Aldy's own footage later using the same command
- Testimonials: `content/testimonials.ts` – REAL Google reviews only (never invent); the home-page section renders only with 3+ reviews. No Review/AggregateRating schema (Google ignores self-serving reviews). UI: `components/Testimonials.tsx` (adapter) → `components/ui/animated-testimonials.tsx` (21st.dev AnimatedTestimonials, adapted: `motion/react` via LazyMotion, theme tokens, stacked cards in one grid cell, visible without JS, pauses on hover/off screen, no logo cloud). shadcn `avatar` + `separator` in `components/ui/`. Reviews must be copied by hand from the Google listing – Google blocks automated fetching
- About "Meet the team": `content/team.ts` + photos in `team_photos/<slug>.jpg` (git-ignored) → `npm run images` makes square, face-centred crops in `public/images/team/`. Hidden while the list is empty
- Home page slimmed to 6 sections (user choice 19 Nov 2026): hero → featured cars → how it works (+ one row of 4 "why Aldy" points) → Google reviews → FAQ preview (4) → Call/WhatsApp CTA. Categories, trust line, "Who we rent to", plans, locations and blog were removed from home (they live on /cars/, /locations/, /blog/ and the footer). Keep it short – ask before adding sections back
- Car photos change on their own: cards cross-fade through up to 4 photos every ~3.5 s (`components/CardPhotos.tsx`, extra photos load only once the card is on screen, staggered start, pause on hover / off screen / hidden tab); the car-page gallery (`components/CarShowcase.tsx`) advances every 4 s and stops for good once the visitor uses arrows, thumbnails or colours. Both off for prefers-reduced-motion. Photo 1 is still the server-rendered LCP image
- MosaicHero (3D photo wall) is no longer on the home page but kept in `components/ui/car-motion.tsx`
- CarLanes (scrolling car rows) removed from the home page (user request 18 Nov 2026) – home "Find your next car" now shows 6 normal `CarCard`s (list in `app/page.tsx` `featured`). CarLanes is kept in `components/ui/car-motion.tsx`
- (old) Hero image is a transparent cut-out made by `scripts/convert-images.mjs` (CSS blend modes cost ~2 s of main-thread time on mobile)
- `scripts/flatten-segments.mjs`: Next 16 export writes prefetch payloads as nested folders but the router requests flat `__next.a.b.txt` files → copies them flat so prefetches don't 404

- Design checklist: `.claude/skills/landing-page-design/` (from elayadesign/ai-design-skills, MIT, locked in `skills-lock.json`). Its top "aldy.ae overrides" block lists which rules we skip (fonts, gradients, icons, nav, hero). Adopted: single easing curve `ease-smooth` (also the default transition curve in `@theme`), text-wrap balance/pretty, scale-only font sizes, no extra-bold

## Still open (ask Aldy)
1. Mileage rule – site shows "250 km per day" everywhere (`lib/site.ts`)
2. Rolls-Royce weekly/monthly prices, deposit, min days
3. Office opening hours (add to `lib/site.ts` + `lib/schema.ts`)
4. Exact map coordinates (currently approximate Garhoud in `lib/site.ts`)
5. Documents list on car pages and FAQ payment methods – confirm still correct
6. Terms and Privacy Policy pages – legal review (PDPL wording added)
7. GA / GTM ID, Search Console access
8. Data that looked wrong and was corrected/omitted: Land Cruiser seats (7), Xpander body type (MPV), C300 body type (sedan), JAC black listing photos named "White"

## Lighthouse (local, mobile, Nov 2026)
Accessibility 100, SEO 100, Best practices 100, CLS 0 on all tested pages. Performance 70–96 locally (very noisy on the dev machine under 4× CPU throttle). Re-check with PageSpeed Insights on the `*.pages.dev` deploy.

---

# aldy.ae rebuild – developer handover

Prepared by AiTion Labs · 16 November 2026
Put this file in the repo root (or rename to `CLAUDE.md`) so Claude Code reads it at the start of each session.

---

## 1. Project in one paragraph

Rebuild **aldy.ae** (Aldy Rent A Car LLC, Dubai) as a fast, static React website hosted on **Cloudflare Pages**. Visitors browse cars, pick a car and dates, and press a button that opens **WhatsApp** with the booking details filled in. There is **no online payment, no online booking engine, no database, no admin panel and no server**. Only the developer changes content (edit data files → push to GitHub → Cloudflare deploys). The current WordPress site on AWS stays live until the new site is ready, then the domain is switched and AWS is closed.

## 2. Decisions already made (do not change without asking)

| Area | Decision |
|---|---|
| Framework | React with TypeScript. **Use Next.js with static export** (`output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }`) so every page is pre-rendered HTML that Google can read. A plain client-side React app is not acceptable for SEO. |
| Hosting | **Cloudflare Pages** (free), deployed from GitHub. Build output folder: `out`. |
| DNS | **Cloudflare** (free). See section 10. |
| Data | JSON files in `/data` (provided). No database. |
| Images | Static files in `/public/images`, converted to WebP. No CMS, no R2. |
| Booking | WhatsApp deep link (section 6). Optional simple enquiry form is out of scope unless asked. |
| Payments | None. Do not add Stripe, Telr or any checkout. |
| Admin | None. |
| Running cost target | $0 a month (client report quotes $5–10 as a safe figure). |

## 3. Client details (use exactly)

| Item | Value |
|---|---|
| Company | Aldy Rent A Car LLC |
| Phone / WhatsApp | +971 50 677 1216 → links: `tel:+971506771216`, `https://wa.me/971506771216` |
| Email | info@aldy.ae (the old Privacy Policy says "quarries@aldy.ae" – wrong, use info@) |
| Address | Prime Executive Business Center, Al Fajer Business Centre Building, Office No 78, Garhoud, Dubai |
| Google Maps | https://goo.gl/maps/X7bTbzSXR8eg3u6Q7 (Google rating shown on old site: 4.8 ★) |
| Facebook | https://www.facebook.com/aldyrentacar |
| Instagram | https://www.instagram.com/aldyrentacar/ |
| YouTube | https://youtube.com/@AldyRentACar |
| LinkedIn | https://www.linkedin.com/company/aldy-rent-a-car/ |
| Payment logos (old footer) | Visa, Mastercard, UnionPay – only show if Aldy still accepts them in person |

Do **not** call the phone number "toll free" (it is a mobile number).

## 4. Pages and routes

All routes end with a slash (`trailingSlash: true`).

| Route | Content |
|---|---|
| `/` | Hero, quick car search (category + pick-up/drop-off date → filters `/cars/`), featured cars, why choose us, how it works (choose car → send on WhatsApp → delivery), FAQ preview, contact strip |
| `/cars/` | All active cars with filter by category, make, price; sort by price |
| `/cars/economy/` and `/cars/luxury/` | Category listings (add `/cars/premium/` if Aldy agrees to re-categorise – see section 8) |
| `/cars/[slug]/` | Car page: photos, name, year, specs, day/week/month price, deposit, min days, km rule, features, included, documents required, **date picker + "Book on WhatsApp"** button, call button |
| `/locations/` and `/locations/[slug]/` | 46 delivery areas from `locations.json`. Each page must have **real, unique content** (area name, delivery note, popular cars, WhatsApp button). If there is no time to write content, build `/locations/` only and redirect the old location URLs there. Never publish empty pages. |
| `/faq/` | 15 FAQs from `faqs.json`, with FAQPage structured data |
| `/blog/` and `/blog/[slug]/` | 3 unique posts (see section 8) |
| `/about/`, `/contact/`, `/terms/`, `/privacy-policy/` | Text pages. Old Terms and Privacy text is in `data/pages-old.json` (review before reuse) |
| `404` | Friendly page with links to cars and WhatsApp |

Sticky bar on every page (mobile and desktop): **Call** and **WhatsApp**.

## 5. Data files (in `/data`)

| File | Contents | Notes |
|---|---|---|
| `cars.json` | 19 cars (17 active, 2 drafts: MG GT, Toyota Rush) | Fields: slug, old_slug, status, name, make, model, year, category, transmission, seats, doors, bags, fuel, price_aed {day, week, month}, deposit_aed, min_days, km_limit, extra_km_fee, discounts, features[], included[], luxury_specs, description_old, images_old[] (paths inside the uploads zip), content_issues[] |
| `faqs.json` | 15 FAQs | Typos already trimmed; still proof-read |
| `locations.json` | 46 areas with slug and old_slug | "ASharjah" typo already fixed to Sharjah |
| `blog-posts.json` | 6 old posts with `duplicate_of` and `off_topic` flags | Publish only the unique, on-topic ones |
| `flexible-plans.json` | Long term / Monthly / Short term texts | Must be rewritten (old text says "we at DBC") |
| `pages-old.json` | Old Privacy Policy, Terms and Luxury intro text | Review and update before reuse |

Show only `status: "active"` cars. Read every `content_issues` entry: these are known problems from the old site that must not be copied over.

Prices are in AED. Display as `AED 150 / day`, `AED 900 / week`, `AED 3,250 / month`. If a price is `null` (Rolls-Royce week/month), show "Ask for price" with a WhatsApp link, never an empty value.

## 6. WhatsApp booking flow

1. On a car page (or from the search), the visitor chooses **pick-up date**, **drop-off date** and optionally **pick-up location** (from `locations.json`) and their name.
2. Validate: drop-off after pick-up, and rental length ≥ `min_days`.
3. Show an estimate: days × day price (use week/month price when the length reaches 7 / 28+ days). Label it "Estimated price – final price confirmed on WhatsApp".
4. Button **Book on WhatsApp** opens `https://wa.me/971506771216?text=` + URL-encoded message:

```
Hello Aldy Rent A Car, I would like to book:
Car: Mazda CX30 (2021)
Pick-up: 20 Nov 2026
Drop-off: 27 Nov 2026 (7 days)
Pick-up location: Business Bay
Estimated price: AED 900
Name: ____
Page: https://aldy.ae/cars/mazda-cx30/
```

Use `encodeURIComponent`. Works on mobile (opens the app) and desktop (WhatsApp Web).

## 7. Images

- Source: `aldy_uploads.zip` (143 MB, originals only) and `aldy_theme_assets.zip` (logo, icons, social icons, payment logos).
- Logo: `wp-content/themes/carrental/assets/img/logo.png` and `footer-logo.png` in the theme zip.
- Each car's photos are listed in `cars.json → images_old` (first one = main photo). Copy only these, plus blog images.
- Convert to **WebP**, max 1600 px wide, quality ~80 (e.g. `sharp` or `squoosh`), and also a 600 px thumbnail. Target 100–300 KB each. Some originals are 3 MB PNGs (Land Cruiser).
- Save as `/public/images/cars/<slug>/<n>.webp` and descriptive alt text: "Mazda CX30 2021 white – front view".
- Lazy-load everything below the fold; set width/height to avoid layout shift.

## 8. Content fixes required (from the audit)

1. **Rolls-Royce Phantom** page said "GHOST" – use the correct name. All three Rolls-Royce pages had the same copied spec line; verify specs per model or leave the spec line out.
2. **"we at DBC"** text (another company's name) – do not reuse; rewrite the flexible plans section.
3. **Copied car descriptions** (e.g. Mazda CX30 "Editors' Choice award") – write short original descriptions.
4. **Mileage rule** – old site showed both "250 km / Day" and "4500Km / Month". Confirm with Aldy and show one rule everywhere.
5. **JAC J7** listed 4 times (base, black, white, red) – suggest one car page with colour options; keep old URLs redirecting.
6. **Categories** – Mercedes C300, Tesla Model 3 and Toyota Land Cruiser (AED 590/day) were under "Economic". Suggest a Premium category. Luxury page claimed "Rolls Royce, Mercedes, Bentley" – only list cars that exist.
7. **Blog** – 3 posts had identical text (`aldyrentacar` and `learn-more-about-rent-a-car` duplicate `a-guide-to-renting-a-luxury-car-in-dubai`). Keep the guide, Road Trips from Dubai and Quick Rental Car Tips. Drop or rewrite the V6 engine post (off-topic). Add a date to each post.
8. **FAQ** typos: "Frequently Ask Questions" → "Frequently Asked Questions"; "Is that possible…" → "Is it possible…".
9. **Privacy Policy** mentions only EU GDPR – add UAE data protection wording (client/lawyer to confirm).
10. Remove "Secure transaction" / "Trusted payments" badges (there is no online payment).
11. The old About page claimed "12 car types, 179 cars" – confirm real numbers with Aldy or remove.

## 9. SEO requirements

- Unique `<title>` and meta description per page (old site used one description on every page). Example car title: "Rent Mazda CX30 2021 in Dubai – AED 150/day | Aldy Rent A Car".
- One `<h1>` per page.
- Canonical URL, Open Graph and Twitter tags, favicon.
- Structured data: `AutoRental` / `LocalBusiness` (name, address, phone, geo, opening hours) on home and contact; `Product` or `Vehicle` with `Offer` on car pages; `FAQPage` on /faq/; `BreadcrumbList`.
- `sitemap.xml` (generated at build) and `robots.txt` pointing to it.
- **Redirects:** copy `_redirects` (provided, 94 rules) into `/public/`. It maps every old WordPress URL (cars, categories, 46 locations, FAQs, blogs, shop/cart pages) to the new routes so Google rankings carry over. If you change any route or slug, update `_redirects`.
- Lighthouse targets: Performance ≥ 90 mobile, SEO 100, Accessibility ≥ 95.

## 10. Domain and DNS switch (do last, with Aldy's approval)

- Registrar: **Etisalat** (whois.aeda.ae). Registrant: Aamir Shahzad / Pacific Partners Real Estate. We have the Etisalat login.
- Current nameservers: AWS Lightsail (`ns-451.awsdns-56.com`, `ns-1748.awsdns-26.co.uk`, `ns-795.awsdns-35.net`, `ns-1057.awsdns-04.org`).
- Current records to recreate in Cloudflare (**email depends on these**):

| Type | Name | Value |
|---|---|---|
| MX 1 | aldy.ae | ASPMX.L.GOOGLE.COM |
| MX 5 | aldy.ae | ALT1.ASPMX.L.GOOGLE.COM |
| MX 5 | aldy.ae | ALT2.ASPMX.L.GOOGLE.COM |
| MX 10 | aldy.ae | ALT3.ASPMX.L.GOOGLE.COM |
| MX 10 | aldy.ae | ALT4.ASPMX.L.GOOGLE.COM |
| CNAME | fxffd7ygj5pa | gv-rfi2j5dqdexpbu.dv.go… (copy full value from Lightsail – Google Workspace verification) |
| TXT | aldy.ae | facebook-domain-verification=… (copy full value) |
| TXT | aldy.ae | tr-claim-record=a32d60… (copy full value) |
| A | aldy.ae, www | 18.192.32.155 (old AWS server) – **replace** with the Cloudflare Pages custom domain |

- Add (missing today): `TXT aldy.ae "v=spf1 include:_spf.google.com ~all"`, DKIM from Google Workspace Admin → Gmail → Authenticate email, `TXT _dmarc "v=DMARC1; p=none; rua=mailto:info@aldy.ae"`.

Steps:
1. Build and test on `*.pages.dev`.
2. Add aldy.ae to Cloudflare (free); check every record above is present.
3. In the Pages project → Custom domains → add `aldy.ae` and `www.aldy.ae` (redirect www → apex or the reverse, pick one).
4. In Etisalat, replace the 4 AWS nameservers with the 2 Cloudflare nameservers.
5. Check: site loads with HTTPS on both hosts, old URLs redirect, email to and from info@aldy.ae works.
6. Keep AWS 1–2 weeks as fallback, then delete servers, WAF, CloudFront and DNS zones, and close the account.

## 11. Definition of done

- [ ] All active cars shown with correct prices, specs and WebP photos
- [ ] WhatsApp message correct on mobile and desktop for every car
- [ ] Date validation and minimum days work
- [ ] No empty pages; every location page has real content or redirects
- [ ] All `content_issues` and section 8 fixes handled
- [ ] Unique titles and descriptions; sitemap, robots, structured data
- [ ] `_redirects` live and tested with 10+ old URLs
- [ ] Lighthouse targets met on mobile
- [ ] Works at 360 px wide; Call and WhatsApp always visible; menu includes Cars, Locations, FAQ, About, Contact
- [ ] Google Analytics / Tag Manager added if Aldy provides the ID
- [ ] DNS switched, email tested, AWS closed

## 12. Open questions for Aldy

1. Real mileage rule (per day or per month)?
2. Rolls-Royce weekly/monthly prices, deposit and minimum days?
3. Keep JAC J7 as one car with colours?
4. Add a Premium category for Mercedes, Tesla, Land Cruiser?
5. Which location areas to keep (all 46 or the main ones)?
6. Google Analytics / Tag Manager ID and Search Console access?
7. Do they still accept Visa, Mastercard, UnionPay in person?

## 13. Do not

- Copy any text from the old site without checking section 8.
- Include customer data from the old database (orders, names, phones). It is not in these data files and must not be added.
- Add payments, logins, databases or a server.
- Publish a page with placeholder or empty content.
