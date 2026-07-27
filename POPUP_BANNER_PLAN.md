# Home Page Promo Popup — Plan & Claude Code Prompt

**Decisions:** image lives in `/public` (swap the file, no CMS) · dismissed for the rest of the browser session (`sessionStorage`).

---

## 1. Plan

### Files

| File | Action | Notes |
|---|---|---|
| `public/popup/promo.png` | **new asset** | The image. Swap this file to change the banner. |
| `app/lib/promo-popup.js` | **new** | The only file you edit: on/off switch, filename, alt text, optional link + dates. |
| `app/components/PromoPopup.jsx` | **new** | The modal itself. Self-contained client component. |
| `app/ClientWrapper.jsx` | **2 lines added** | 1 import + 1 render line, next to `<CookieConsent />`. Nothing existing is modified. |

No new dependencies — `motion/react` and `next/image` are already in the project.

### How you change the banner later

Open `app/lib/promo-popup.js`:

```js
export const PROMO_POPUP = {
  enabled: true,                  // false = popup off entirely
  version: "just-eat-2026",       // bump this to re-show to people who already dismissed it
  src: "/popup/promo.png",        // swap the file in /public/popup, or point here at a new one
  alt: "Peckers nominated for the Just Eat Best Takeaway Award 2026",
  width: 1536,
  height: 1024,
  href: null,                     // e.g. "/rewards" or a full https:// URL — null = not clickable
  startDate: null,                // "2026-08-11" — optional auto show/hide window
  endDate: null,                  // "2026-08-25"
  delayMs: 900,                   // pause after the page loader finishes, before it fades in
};
```

Turning it off = `enabled: false`. Changing the image = drop a new file in `public/popup/` and update `src`, `width`, `height`, `alt`, and bump `version`.

### Behaviour

- Home page only (`/`, `/home`, `/home/`).
- Waits until the `PageLoader` has finished, then fades in after `delayMs`.
- Closes on the ✕ button, backdrop click, or `Esc`.
- Once closed, writes `peckers_promo_dismissed` to **sessionStorage** → stays hidden until the visitor closes the tab/browser. Bumping `version` in the config invalidates it for everyone.
- Renders `null` during SSR and first paint (sessionStorage is client-only) → no hydration mismatch.

### Why this can't break anything else

These are the specific collision points in the existing codebase and how each is handled:

1. **z-index stack.** Current values: mobile bottom bar `z-50`, navbar `z-9999`, cookie banner `z-9990`, `PageLoader` `z-[10000]`, cookie preferences modal `z-10010`. The popup uses **`z-[10005]`** — above the navbar and loader, deliberately *below* the cookie preferences modal so the legal/GDPR UI always wins.
2. **Cookie banner overlap.** The popup waits for a cookie decision before showing (polls `readConsent()` from `app/lib/cookie-consent`, max ~30s, then gives up and shows anyway). No edits to `CookieConsent.jsx` — it just reads the same helper.
3. **Body scroll lock.** `ClientWrapper` and `CookieConsent` both already write `document.body.style.overflow`. The popup **does not touch it** — a third writer would fight them and could leave the page unscrollable. Background scroll behind the modal is harmless.
4. **Lenis / GSAP ScrollTrigger.** The popup is `position: fixed` outside `#main-content` and `SmoothScroll`, adds no page height, and never calls `ScrollTrigger.refresh()` or `lenis.resize()`. Layout measurements are untouched.
5. **Page loader.** Gated on `!isPageLoading`, so it can never flash over or under the loader mid-transition.
6. **Route changes.** Mounted once in `ClientWrapper` and returns `null` off-home — no per-route remount, no effect on the menu tab-switch logic.
7. **Images config.** A `/public` file needs no `next.config.mjs` `remotePatterns` change (that's for `cdn.sanity.io` remote images only).
8. **React Compiler** (`reactCompiler: true`) — component is written with plain hooks, no ref mutation during render.

### Verify after building

`npm run lint` → `npm run build` → `npm run dev`, then check: popup appears on `/` after the loader; ✕/Esc/backdrop all close it; reload → does **not** return; new browser session → returns; navigate to `/menu` and `/stevenage` → no popup, page scrolls normally; mobile 375px width → image fits and ✕ is tappable; cookie banner still reachable on a fresh profile.

---

## 2. Claude Code prompt

Copy everything below into Claude Code, in the `C:\NextJs\peckers` repo.

---

> **Task: add a dismissible promo popup to the Peckers home page.**
>
> The image is at `pop_up_design10.png` (I'll place it in the repo root — move it, don't copy). It's a 1536×1024 PNG announcing a Just Eat Best Takeaway Award 2026 nomination.
>
> **Scope rule: create three new files and add exactly two lines to `app/ClientWrapper.jsx`. Do not modify any other existing file.** Do not add dependencies. Do not touch `next.config.mjs`, `CookieConsent.jsx`, `Pageloader.tsx`, `SmoothScroll.jsx`, or any Sanity schema.
>
> **1. Asset** — move the image to `public/popup/promo.png`.
>
> **2. `app/lib/promo-popup.js`** — a single exported config object plus a small `isPromoActive()` helper that returns false when `enabled` is false or today falls outside `startDate`/`endDate`:
>
> ```js
> export const PROMO_POPUP = {
>   enabled: true,
>   version: "just-eat-2026",
>   src: "/popup/promo.png",
>   alt: "Peckers nominated for the Just Eat Best Takeaway Award 2026",
>   width: 1536,
>   height: 1024,
>   href: null,
>   startDate: null,
>   endDate: null,
>   delayMs: 900,
> };
> export const PROMO_STORAGE_KEY = "peckers_promo_dismissed";
> ```
>
> Comment each field so a non-developer can edit it safely.
>
> **3. `app/components/PromoPopup.jsx`** — `"use client"`, default export, props `{ show }` (the parent passes `!isPageLoading && isHome`). Requirements:
>
> - Returns `null` during SSR and before mount — read `sessionStorage` in a `useEffect`, never during render. Follow the mount pattern already used in `app/components/CookieConsent.jsx`.
> - Skip entirely if `!isPromoActive()` or if `sessionStorage.getItem(PROMO_STORAGE_KEY) === PROMO_POPUP.version`.
> - Before showing, wait for a cookie decision: import `readConsent` from `../lib/cookie-consent`; if it returns `null`, poll every 500ms and show as soon as it's non-null, giving up and showing anyway after 30s. Clear the interval on unmount.
> - Then wait `delayMs` and fade/scale in with `AnimatePresence` + `motion` from `motion/react`, matching the easing already used in `CookieConsent.jsx` (`duration: 0.32, ease: [0.22, 1, 0.36, 1]`).
> - Markup: fixed full-screen flex-centre wrapper at **`z-[10005]`**, `bg-black/75 backdrop-blur-sm` backdrop that closes on click, and a card holding the image.
> - Image via `next/image` with the configured `width`/`height`, `priority={false}`, `sizes="(max-width: 768px) 92vw, 720px"`, `className="h-auto w-full rounded-2xl"`. Container `w-[92vw] max-w-[560px] md:max-w-[720px] max-h-[85dvh] object-contain`. If `href` is set, wrap the image in `next/link` (or a plain `<a target="_blank" rel="noopener noreferrer">` for external URLs) and dismiss on click.
> - Close button: absolute top-right, at least 44×44px, `aria-label="Close announcement"`, white ✕ on a `bg-black/70 border border-white/20 rounded-full` chip so it stays visible against the dark artwork. Reuse the ✕ SVG path from `CookieConsent.jsx`.
> - Also close on `Escape` (listener added only while open, removed on cleanup).
> - `role="dialog"`, `aria-modal="true"`, `aria-label` from the config `alt`. Focus the close button on open.
> - Dismissing writes `PROMO_POPUP.version` to `sessionStorage[PROMO_STORAGE_KEY]` inside a `try/catch` (Safari private mode throws).
> - **Do not write to `document.body.style.overflow`** — `ClientWrapper` and `CookieConsent` already own it and a third writer can leave the page unscrollable. Do not call `ScrollTrigger.refresh()` or any Lenis method.
>
> **4. `app/ClientWrapper.jsx`** — add `import PromoPopup from "./components/PromoPopup";` with the other component imports, and render `<PromoPopup show={!isPageLoading && isHome} />` immediately after `<CookieConsent />`. Change nothing else in that file. Note `isHome` is already computed there.
>
> **Then verify:** run `npm run lint` and `npm run build`, both must pass clean. Show me `git diff --stat` and confirm `app/ClientWrapper.jsx` is the only pre-existing file touched, with a 2-line diff.
