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
  const hasMobileArt = Boolean(PROMO_POPUP.mobileSrc);
  const hasCta = Boolean(PROMO_POPUP.ctaLabel && PROMO_POPUP.ctaHref);

  // The dialog is sized by width alone and the image simply fills it; the CTA
  // button sits centred underneath at its own natural size.
  // The width formula picks whichever limit bites first:
  //   maxPercent      — 100% on phones (edge to edge), 96% on desktop. A
  //                     percentage rather than vw so a desktop scrollbar can't
  //                     push the dialog wider than the visible page.
  //   maxWidth        — stops the artwork ballooning on large desktops
  //   (height budget) — the height left after the button, converted back to a
  //                     width through the image's own aspect ratio, so a short
  //                     window shrinks the poster instead of clipping it.
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

  // maxPercent differs by context: phones go edge to edge, where every pixel of
  // width counts, while a desktop keeps a small even margin so the banner reads
  // as a panel over the page rather than something bleeding off the sides.
  const artWidth = (width, height, maxPercent) => {
    const ratio = artRatio(width, height);
    const reserve = hasCta ? "6rem" : "2.5rem";
    return `min(${maxPercent}, ${artMaxWidth(width, height)}px, calc((100dvh - ${reserve}) / ${ratio}))`;
  };

  const desktopWidth = artWidth(PROMO_POPUP.width, PROMO_POPUP.height, "96%");
  const mobileWidth = hasMobileArt
    ? artWidth(PROMO_POPUP.mobileWidth, PROMO_POPUP.mobileHeight, "100%")
    : artWidth(PROMO_POPUP.width, PROMO_POPUP.height, "94%");

  // Tells the browser how wide the file will actually be drawn, so it downloads
  // the right size rather than the full-resolution original.
  const desktopSizes = `(min-width: 768px) ${artMaxWidth(
    PROMO_POPUP.width,
    PROMO_POPUP.height
  )}px, 100vw`;

  const artwork = (
    <>
      {hasMobileArt && (
        <Image
          src={PROMO_POPUP.mobileSrc}
          alt={PROMO_POPUP.alt}
          width={PROMO_POPUP.mobileWidth}
          height={PROMO_POPUP.mobileHeight}
          priority={false}
          sizes="100vw"
          className="block h-auto w-full md:hidden"
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
          hasMobileArt ? "hidden h-auto w-full md:block" : "block h-auto w-full"
        }
      />
    </>
  );

  // Reuses the site's standard action button (the pill with the offset colour
  // block that slides out on hover, same as the header's Click & Collect and
  // Delivery buttons), so the promo matches the rest of the site by default.
  // Black text: white fails contrast on this orange, and the header already
  // pairs black text with its lighter button.
  const cta = hasCta ? (
    <HeaderActionButton
      href={PROMO_POPUP.ctaHref}
      onClick={dismiss}
      bgColor="bg-[#ff8000]"
      borderColor="border-[#ff8000]"
      textColor="text-black"
      shimmerColor="bg-white"
      // Height rather than vertical padding: the base button already sets
      // pb-[2px], which would fight a py-* value — the header buttons size
      // themselves the same way. pt-[2px] matches that bottom padding so the
      // label lands dead centre instead of sitting ~2px high.
      className="h-[40px] px-[7vw] pt-[7px] font-neuzeit text-[4vw] font-black uppercase tracking-wide whitespace-nowrap hover:bg-[#e57300] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:h-[42px] md:px-[28px] md:text-[16px]"
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
            style={{ "--promo-w": mobileWidth, "--promo-w-md": desktopWidth }}
            className="relative flex w-[var(--promo-w)] flex-col items-center gap-3 md:w-[var(--promo-w-md)]"
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
