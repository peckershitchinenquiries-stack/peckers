# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Peckers** is a Next.js website for a chicken restaurant chain with locations in Stevenage and Hitchin. The site serves as the public-facing web presence and order information hub.

**Tech Stack:**
- Next.js 16.1.6 with App Router
- React 19 with TypeScript
- Sanity CMS for all content management
- Tailwind CSS for styling
- Framer Motion + GSAP for animations
- Google Places API for customer reviews
- Google Analytics with GDPR-compliant cookie consent

## Getting Started

```bash
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Build for production
npm run start      # Run production build locally
npm run lint       # Run ESLint
```

**Environment Setup:**
Create a `.env.local` file with:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` (default: 3gu4dx3n)
- `NEXT_PUBLIC_SANITY_DATASET` (default: production)
- `NEXT_PUBLIC_SANITY_API_VERSION` (default: 2026-03-07)
- `GOOGLE_MAPS_API_KEY` (required for reviews API)

## Architecture & Data Flow

### Root Layout Pattern
The `app/layout.jsx` server component fetches common data once at build/request time:
- **siteSettings**: Site-wide configuration (passed as `preloadedSettings`)
- **footer**: Footer data including social links, locations, legal links (passed as `preloadedFooter`)

These are passed to `ClientWrapper`, preventing unnecessary data fetches and preventing UI "flashing" as common components load.

### Sanity CMS Integration
**Live Content Updates:** The app uses Sanity's `defineLive()` API via `sanityFetch()` for automatic content updates without rebuilds. The `<SanityLive />` component in the root layout enables this.

**Schema Organization:**
- Schemas are in `sanity/schemaTypes/` with one file per document type
- Key schemas: `homepage`, `menupage`, `location`, `siteSettings`, `footer`, `crewpage`, `timeline`
- Use `sanityFetch()` to query data server-side in components/pages

**Structure:**
```
sanity/
├── env.ts              # API version, dataset, projectId config
├── lib/
│   ├── client.ts       # Sanity client configuration
│   ├── live.ts         # Live content API setup
│   └── image.ts        # Image URL builder
├── schemaTypes/        # CMS document type definitions
└── structure.ts        # Sanity Studio navigation structure
```

### Page Organization
Pages are organized by route with supporting client components:

```
app/
├── home/               # Home page (no loader on direct landing)
├── menu/
│   ├── page.jsx       # Menu landing
│   └── [category]/    # Dynamic category pages (burgers, wings, salads, etc.)
├── careers/           # Career opportunities
├── hitchin/           # Location-specific pages
├── stevenage/
├── the-journey/       # About/history
├── house-made-sauces/ # Sauce showcase
├── api/reviews/       # Google Places reviews API endpoint
└── [other routes]/    # FAQ, Privacy, Terms, Rewards, etc.
```

### Client-Side State Management
**ClientWrapper** (`app/ClientWrapper.jsx`) handles:
- Page loader (smooth transition between routes)
- Smooth scroll via Lenis (`SmoothScroll` component)
- Mobile bottom navigation bar
- Cookie consent banner
- Route-specific loading logic (skips loader for home page and menu tab switches)

**Page Loader Logic:** 
- Triggers on route changes (except home page and menu subcategory switches)
- Locks body scroll while animating
- Syncs with Lenis scroll position after animation completes

## Key Features & Implementation Details

### Google Reviews API (`app/api/reviews/route.js`)
- Fetches reviews from Google Places API for both Stevenage and Hitchin locations
- Uses place IDs: `ChIJVVweuNo1dkgRi-IfLyhtgyU` (Hitchin), `ChIJxVydIDgvdkgR3vKTXPIOuYo` (Stevenage)
- Maps Google reviews to consistent format for frontend consumption
- Returns sorted by publication time (newest first)
- Requires `GOOGLE_MAPS_API_KEY` environment variable

### GDPR-Compliant Analytics
Implements Google Consent Mode v2:
- Defaults to "denied" for all tracking until user opts in
- Stores user preferences in localStorage (`peckers_cookie_consent`)
- Re-applies stored consent on every page load
- Controlled by `CookieConsent` component
- GA tracking ID: `G-256TPVH0TH`

### SEO & Structured Data
- Comprehensive metadata in root layout (title, description, OG tags, Twitter cards)
- Robots config (indexing enabled, max-snippet -1, large images allowed)
- Canonical URLs
- JSON-LD structured data generated in components where needed
- Location-specific keywords targeting Stevenage and Hitchin

### Responsive Design
- Custom fonts: Supernett (regular/bold), Neuzeit Grotesk
- Mobile-specific component: `MobileBottomBar` (navigation, order buttons)
- Tailwind CSS with custom configuration
- Animations on scroll using GSAP ScrollTrigger

## Common Development Tasks

**Adding a New Menu Category:**
1. Create page at `app/menu/[category-name]/page.jsx`
2. Add schema to Sanity if needed
3. Query via `sanityFetch()` with appropriate GROQ filter
4. Use existing menu page patterns (see `MenuPageClient`, `MenuPageText`, `MenuTitleSection`)

**Modifying Site Content:**
1. Edit relevant schema in `sanity/schemaTypes/`
2. Content updates flow automatically via `sanityFetch()` and `<SanityLive />`
3. No rebuild required for content changes

**Adding New Page with Location-Specific Data:**
1. Follow pattern from `app/stevenage/` and `app/hitchin/`
2. Query location data from Sanity in server component
3. Pass to client components for interactivity
4. Wrap in `ClientWrapper` for page loader and navigation

**Fetching Data from Sanity:**
```jsx
const { data } = await sanityFetch({
  query: `*[_type == "menupage"][0] { /* your fields */ }`
});
```

## Performance Considerations

- Root layout data fetching is done server-side to avoid duplicate requests
- Images optimized via `next/image` and Sanity image URL builder
- Font optimization with `next/font/local`
- Framer Motion used with `motion/react` for performance
- GSAP ScrollTrigger for efficient scroll animations

## File Naming & Conventions

- Page files: `page.jsx` or `page.tsx`
- Client components: include `"use client"` directive
- Layout files: `layout.jsx`
- Dynamic routes: `[param]/page.jsx`
- Client-specific versions: `*-client.jsx` (e.g., `page-client.jsx`)
- API routes: `app/api/[route]/route.js`

## Important Notes

- The app redirects menu-to-menu navigation without the page loader for UX smoothness
- Homepage (`/` or `/home`) doesn't trigger the page loader on direct landing
- Sanity Studio is accessible at `/studio` route (uses `[[...tool]]` dynamic route)
- Google Places API calls include error handling and logging—check console if reviews don't load
- All tracking is GDPR-compliant; analytics only fire after user consent
