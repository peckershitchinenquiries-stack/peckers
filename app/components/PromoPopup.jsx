"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import HeaderActionButton from "./HeaderActionButton";
import { readConsent } from "../lib/cookie-consent";
import {
  PROMO_POPUP,
  PROMO_STORAGE_KEY,
  isPromoActive,
} from "../lib/promo-popup";

// How often to re-check whether the visitor has answered the cookie banner, and
// how long to keep waiting before showing the promo regardless. Stacking two
// dialogs looks broken, so the promo queues behind the cookie decision — but it
// must never be blocked forever by someone who simply ignores the banner.
const CONSENT_POLL_MS = 500;
const CONSENT_TIMEOUT_MS = 30000;

// Absolute URLs open in a new tab; anything else is treated as an internal route.
const isExternalHref = (href) =>
  typeof href === "string" && /^(https?:)?\/\//i.test(href);

export default function PromoPopup({ show, lenisRef }) {
  // Starts closed so SSR and the first client paint render nothing at all —
  // every "should this appear?" check reads the browser, and none of it is safe
  // during render (same reasoning as CookieConsent).
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const closeButtonRef = useRef(null);

  const dismiss = useCallback(() => {
    setOpen(false);
    setDismissed(true);
    try {
      window.sessionStorage.setItem(PROMO_STORAGE_KEY, PROMO_POPUP.version);
    } catch {
      /* storage may be unavailable (Safari private mode); fail silently */
    }
  }, []);

  // Decide whether — and when — to open. Runs only after mount, so sessionStorage
  // and the consent record are safe to read here.
  useEffect(() => {
    if (!show || dismissed) return;
    if (!isPromoActive()) return;

    try {
      if (
        window.sessionStorage.getItem(PROMO_STORAGE_KEY) === PROMO_POPUP.version
      ) {
        return;
      }
    } catch {
      /* storage unreadable — treat the visitor as not having dismissed it */
    }

    let delayTimer;
    let consentPoll;
    let consentTimeout;

    const reveal = () => {
      delayTimer = setTimeout(() => setOpen(true), PROMO_POPUP.delayMs);
    };

    if (readConsent()) {
      reveal();
    } else {
      consentPoll = setInterval(() => {
        if (readConsent()) {
          clearInterval(consentPoll);
          clearTimeout(consentTimeout);
          reveal();
        }
      }, CONSENT_POLL_MS);

      consentTimeout = setTimeout(() => {
        clearInterval(consentPoll);
        reveal();
      }, CONSENT_TIMEOUT_MS);
    }

    return () => {
      clearTimeout(delayTimer);
      clearInterval(consentPoll);
      clearTimeout(consentTimeout);
    };
  }, [show, dismissed]);

  // Escape closes it. Listener exists only while the popup is on screen.
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, dismiss]);

  // Move focus to the close button so keyboard users land on the way out.
  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
  }, [open]);

  // Freeze the page while the popup is up. Without this the page scrolls behind
  // the dialog, and because the mobile order bar is fixed it stays put while the
  // content slides past it under the scrim — which is what reads as a glitch.
  // Native overflow alone is not enough here: Lenis runs its own scroll loop and
  // has to be told to stop, and iOS still rubber-bands a body set to
  // overflow:hidden, so touch drags are swallowed too.
  useEffect(() => {
    if (!open) return;

    const body = document.body;
    const previousOverflow = body.style.overflow;
    const lenis = lenisRef?.current;

    body.style.overflow = "hidden";
    lenis?.stop();

    const blockTouchScroll = (event) => event.preventDefault();
    // Must be non-passive or the browser ignores preventDefault on touchmove.
    window.addEventListener("touchmove", blockTouchScroll, { passive: false });

    return () => {
      body.style.overflow = previousOverflow;
      lenis?.start();
      window.removeEventListener("touchmove", blockTouchScroll);
    };
  }, [open, lenisRef]);

  // A portrait crop suits phones much better than the wide desktop artwork, so
  // when mobileSrc is set we ship both and let CSS pick. The hidden one is
  // display:none, which also removes it from the accessibility tree — screen
  // readers only ever announce the visible image.
  //
  // The split is by SHAPE, not by width: an upright screen gets the portrait
  // file, a sideways one gets the landscape file. Width alone gets both ends
  // wrong — a tablet held upright is wider than 768px but still tall, so the
  // wide artwork would sit in the middle of it filling less than half the
  // screen, while a phone turned sideways is narrow by breakpoint yet has
  // almost no height, so a 2:3 poster there would shrink to a stamp. Matching
  // the artwork's shape to the screen's keeps it filling the window on both.
  const hasMobileArt = Boolean(PROMO_POPUP.mobileSrc);
  const hasCta = Boolean(PROMO_POPUP.ctaLabel && PROMO_POPUP.ctaHref);

  // The frame around the banner, drawn here rather than painted into the
  // artwork. That is the whole point of it: a border baked into the file is
  // part of the image, so the crop below trims it off the top and bottom and
  // leaves the two sides, and it thickens or thins with whatever scale the
  // file happens to be drawn at. Drawn here it is exactly borderWidth pixels
  // on every edge at every screen size, and the crop cannot reach it.
  //
  // The site sets box-sizing: border-box throughout, so the frame is laid
  // inside the width the dialog was given: the banner's outer size is exactly
  // what the sizing below worked out, and the artwork gives up the pixels.
  const frameBorder = PROMO_POPUP.borderColor
    ? {
        borderStyle: "solid",
        borderWidth: `${PROMO_POPUP.borderWidth ?? 2}px`,
        borderColor: PROMO_POPUP.borderColor,
      }
    : undefined;

  // The dialog is sized by width alone and the image simply fills it; the CTA
  // button sits centred underneath at its own natural size.
  // The width formula picks whichever limit bites first:
  //   maxPercent      — 96%, so there is always an even margin down both
  //                     sides. A percentage rather than vw so a desktop
  //                     scrollbar can't push the dialog wider than the
  //                     visible page.
  //   maxWidth        — stops the artwork ballooning on large desktops
  //   (height budget) — the height left after the button, widened by the crop
  //                     allowance below and converted back to a width through
  //                     the image's own aspect ratio, so a short window trims
  //                     the poster a little before it starts shrinking it.
  //
  // On phones the first limit almost always wins, so every handset shows the
  // poster at full width. How much of the SCREEN that fills still varies with
  // the handset's shape — a 2:3 poster covers ~82% of a stubby iPhone SE but
  // only ~69% of a tall 16 Pro Max, and no sizing rule can change that. Only a
  // taller mobile crop (set via mobileSrc) closes that gap.
  const artRatio = (width, height) => (width && height ? height / width : 1);

  // A portrait poster never needs to be wide, so it gets a modest cap. A
  // landscape banner is meant to run wide, so it may grow to a quarter past its
  // own pixel width — enough headroom to keep the gap to the page edge small on
  // a large monitor, while bounding how far the file is ever stretched. Flat
  // artwork like this survives a fraction of upscaling invisibly; beyond that it
  // starts to soften, and the fix is a wider export rather than a bigger cap.
  const artMaxWidth = (width, height) =>
    artRatio(width, height) >= 1 ? 620 : Math.round((width || 960) * 1.25);

  // Vertical space held back for the CTA button, its gap, and a little
  // breathing room. Raise it to shrink the artwork, lower it to grow the
  // artwork — but keep it above (button height + 12px gap) or the two crowd.
  // With no button the artwork takes nearly the whole window, holding back
  // only a hairline so it never sits flush against the top and bottom edges.
  const reserve = hasCta ? "7.5rem" : "1.5rem";

  // The height of the box the artwork is drawn into, whatever shape it is.
  const maxArtHeight = `calc(100dvh - ${reserve})`;

  // How much of the artwork's own height may be trimmed when the window is too
  // short to show all of it at the width we want.
  //
  // A 3:2 poster in a 16:9 window runs out of height long before it runs out of
  // width, so the only way to fit the whole thing in is to shrink it — and that
  // is what leaves wide empty bands down either side. Taking a little off the
  // top and bottom instead buys about 11% more width and closes most of that
  // gap.
  //
  // The trim is split evenly between the two edges, so the value here is twice
  // what any one edge loses: at 0.10 the artwork must keep 5% of its height
  // clear of wording at the top AND at the bottom. The current pair have 6.9%
  // and 10.5% (desktop) and 12.5% and 8.0% (mobile), so both clear it. Check
  // the same before raising this or before swapping in artwork with tighter
  // margins — past that point the crop starts cutting into the design.
  //
  // It only ever applies when height is the binding limit: on a phone held
  // upright the portrait artwork is limited by width, and nothing is trimmed.
  //
  // allowCrop: false in the config switches it off, for artwork that cannot
  // lose its edges at all — see the note there.
  const MAX_CROP = PROMO_POPUP.allowCrop === false ? 0 : 0.1;

  // The margin is the same on both: wide enough that the banner reads as a
  // panel laid over the page rather than something bleeding off the sides, and
  // no wider, because every pixel it gives up is a pixel of artwork.
  const artWidth = (width, height, maxPercent) => {
    const ratio = artRatio(width, height) * (1 - MAX_CROP);
    return `min(${maxPercent}, ${artMaxWidth(width, height)}px, calc(${maxArtHeight} / ${ratio}))`;
  };

  const desktopWidth = artWidth(PROMO_POPUP.width, PROMO_POPUP.height, "96%");
  const mobileWidth = hasMobileArt
    ? artWidth(PROMO_POPUP.mobileWidth, PROMO_POPUP.mobileHeight, "96%")
    : artWidth(PROMO_POPUP.width, PROMO_POPUP.height, "96%");

  // Each artwork's own shape, handed to the frame as an aspect-ratio so its
  // height follows whatever width the dialog settled on. Written as a ratio
  // rather than a computed length on purpose: the widths above are percentages
  // of the viewport, and a percentage read in a height context would resolve
  // against the wrong axis.
  const artAspect = (width, height) => `${width || 1} / ${height || 1}`;

  const desktopAspect = artAspect(PROMO_POPUP.width, PROMO_POPUP.height);
  const mobileAspect = hasMobileArt
    ? artAspect(PROMO_POPUP.mobileWidth, PROMO_POPUP.mobileHeight)
    : desktopAspect;

  // Tells the browser how wide the file will actually be drawn, so it downloads
  // the right size rather than the full-resolution original.
  // Keyed off orientation to match the rule that decides which file shows at
  // all, so neither image is ever described by the other's layout.
  const desktopSizes = `(orientation: landscape) ${artMaxWidth(
    PROMO_POPUP.width,
    PROMO_POPUP.height
  )}px, 100vw`;

  const mobileSizes = `(orientation: portrait) ${artMaxWidth(
    PROMO_POPUP.mobileWidth,
    PROMO_POPUP.mobileHeight
  )}px, 100vw`;

  // The frame the artwork is drawn into. aspect-ratio gives it the artwork's
  // own shape at whatever width the dialog ended up, and max-height clips it
  // when that comes out taller than the window has room for — which is only
  // ever by the crop allowance, because the width was derived from this same
  // budget. object-cover inside centres the overflow, so the trim lands evenly
  // on the top and bottom edges rather than all at one end.
  const artwork = (
    <div
      style={frameBorder}
      className="w-full overflow-hidden aspect-[var(--promo-ar)] max-h-[var(--promo-maxh)] landscape:aspect-[var(--promo-ar-land)]"
    >
      {hasMobileArt && (
        <Image
          src={PROMO_POPUP.mobileSrc}
          alt={PROMO_POPUP.alt}
          width={PROMO_POPUP.mobileWidth}
          height={PROMO_POPUP.mobileHeight}
          priority={false}
          sizes={mobileSizes}
          className="block h-full w-full object-cover landscape:hidden"
        />
      )}

      <Image
        src={PROMO_POPUP.src}
        alt={PROMO_POPUP.alt}
        width={PROMO_POPUP.width}
        height={PROMO_POPUP.height}
        priority={false}
        sizes={desktopSizes}
        className={
          hasMobileArt
            ? "hidden h-full w-full object-cover landscape:block"
            : "block h-full w-full object-cover"
        }
      />
    </div>
  );

  // Reuses the site's standard action button (the pill with the offset colour
  // block that slides out on hover, same as the header's Click & Collect and
  // Delivery buttons), so the promo matches the rest of the site by default.
  // White text: #851425 is a deep red, so black on it is barely legible while
  // white clears the contrast bar comfortably — the same pairing the header's
  // red Delivery button uses.
  const cta = hasCta ? (
    <HeaderActionButton
      href={PROMO_POPUP.ctaHref}
      onClick={dismiss}
      bgColor="bg-[#c20e0e]"
      borderColor="border-[#851425]"
      textColor="text-white"
      shimmerColor="bg-white"
      // Height rather than vertical padding: the base button already sets
      // pb-[2px], which would fight a py-* value — the header buttons size
      // themselves the same way. pt-* counterweights that bottom padding so the
      // label lands centred rather than sitting high.
      className="h-[52px] px-[9vw] pt-[7px] font-neuzeit text-[4.6vw] font-black uppercase tracking-wide whitespace-nowrap hover:bg-[#6d101e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:h-[56px] md:px-[38px] md:text-[20px]"
    >
      {PROMO_POPUP.ctaLabel}
    </HeaderActionButton>
  ) : null;

  let content = artwork;
  if (PROMO_POPUP.href) {
    content = isExternalHref(PROMO_POPUP.href) ? (
      <a
        href={PROMO_POPUP.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={dismiss}
        className="block w-full"
      >
        {artwork}
      </a>
    ) : (
      <Link href={PROMO_POPUP.href} onClick={dismiss} className="block w-full">
        {artwork}
      </Link>
    );
  }

  return (
    <AnimatePresence>
      {open && show && (
        <motion.div
          className="fixed inset-0 z-[10005] flex items-center justify-center p-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={dismiss}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={PROMO_POPUP.alt}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{
              "--promo-w": mobileWidth,
              "--promo-w-land": desktopWidth,
              "--promo-ar": mobileAspect,
              "--promo-ar-land": desktopAspect,
              "--promo-maxh": maxArtHeight,
            }}
            // One width per artwork, switched on the same orientation query
            // that switches the image itself, so the box can never be sized
            // from the aspect ratio of the file that isn't showing.
            className="relative flex w-[var(--promo-w)] flex-col items-center gap-3 landscape:w-[var(--promo-w-land)]"
          >
            {content}

            {cta}

            <button
              type="button"
              ref={closeButtonRef}
              onClick={dismiss}
              aria-label="Close announcement"
              className="absolute right-2 top-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/70 text-white transition-colors hover:bg-black/90"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
