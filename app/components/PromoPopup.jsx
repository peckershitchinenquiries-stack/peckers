"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
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

export default function PromoPopup({ show }) {
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

  const artwork = (
    <Image
      src={PROMO_POPUP.src}
      alt={PROMO_POPUP.alt}
      width={PROMO_POPUP.width}
      height={PROMO_POPUP.height}
      priority={false}
      sizes="(max-width: 768px) 94vw, 1400px"
      className="block w-[94vw] h-auto md:w-auto md:h-[88dvh] md:max-w-[92vw]"
    />
  );

  let content = artwork;
  if (PROMO_POPUP.href) {
    content = isExternalHref(PROMO_POPUP.href) ? (
      <a
        href={PROMO_POPUP.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={dismiss}
        className="block"
      >
        {artwork}
      </a>
    ) : (
      <Link href={PROMO_POPUP.href} onClick={dismiss} className="block">
        {artwork}
      </Link>
    );
  }

  return (
    <AnimatePresence>
      {open && show && (
        <motion.div
          className="fixed inset-0 z-[10005] flex items-center justify-center p-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
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
            className="relative"
          >
            {content}

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
