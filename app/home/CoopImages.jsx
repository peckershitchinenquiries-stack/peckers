"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "../../sanity/lib/image";
import { mergeStores } from "../lib/locations";

/**
 * Homepage locations band — a plain scroll row.
 *
 * No slots, no conveyor, no transforms. The cards sit side by side in a
 * horizontally scrollable strip and the arrows simply scroll it by one card,
 * which is the browser's own scroll rather than an animation we drive. Each
 * card stays itself the whole time: nothing fades, rotates, dims or changes
 * place, so there is no motion to get wrong.
 *
 * Two shapes, one set of cards. From tablet up every town is in the one
 * strip, three across on a laptop. On a phone the open stores stack full
 * width exactly as they do on the live site, and only the towns that have
 * not opened yet scroll — they take the slot the "We're expanding" card
 * used to hold. The grouping is done with a wrapper that is display:
 * contents above the phone breakpoint, so the same markup gives both
 * layouts and no card is rendered twice.
 */
export default function CoopImages({ locations = [] }) {
  const stores = useMemo(() => mergeStores(locations), [locations]);
  const openStores = useMemo(
    () => stores.filter((s) => s.status !== "comingSoon"),
    [stores],
  );
  const soonStores = useMemo(
    () => stores.filter((s) => s.status === "comingSoon"),
    [stores],
  );

  const rowRef = useRef(null);
  const soonRef = useRef(null);
  // Both arrows start hidden and are shown by the first measurement, so a row
  // that fits on screen never flashes a control that does nothing.
  const [edges, setEdges] = useState({ start: true, end: true });

  // Whichever element is actually doing the scrolling right now. On a phone
  // that is the coming-soon strip; above it that strip is display: contents
  // and so has no box at all, which leaves the whole row.
  const getScroller = () => {
    const soon = soonRef.current;
    return soon && soon.clientWidth > 0 ? soon : rowRef.current;
  };

  useEffect(() => {
    const update = () => {
      const el = getScroller();
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      // A couple of pixels of slack: fractional layout widths mean scrollLeft
      // rarely lands exactly on 0 or on the maximum.
      setEdges({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 });
    };

    const row = rowRef.current;
    const soon = soonRef.current;
    update();
    row?.addEventListener("scroll", update, { passive: true });
    soon?.addEventListener("scroll", update, { passive: true });
    // Catches the breakpoint change too, which swaps which element scrolls.
    const ro = new ResizeObserver(update);
    if (row) ro.observe(row);
    if (soon) ro.observe(soon);
    return () => {
      row?.removeEventListener("scroll", update);
      soon?.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const scrollByCard = (dir) => {
    const el = getScroller();
    if (!el) return;
    // One card plus the gap, read off the layout rather than hard-coded, so
    // every breakpoint moves by exactly one card.
    const cards = el.querySelectorAll(".coop-card");
    const step =
      cards.length > 1
        ? cards[1].offsetLeft - cards[0].offsetLeft
        : el.clientWidth;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: step * dir, behavior: reduced ? "auto" : "smooth" });
  };

  const renderCard = (store) => {
    const isSoon = store.status === "comingSoon";
    const src = store.image
      ? urlFor(store.image).width(1000).quality(80).auto("format").url()
      : null;

    const className = [
      "coop-card",
      isSoon ? "coop-card--soon" : "coop-card--open",
    ].join(" ");

    const body = (
      <>
        {src && (
          <Image
            src={src}
            alt={store.cardAlt}
            fill
            sizes="(max-width: 767px) 90vw, (max-width: 1023px) 48vw, 32vw"
            className="coop-card__img absolute inset-0 w-full h-full object-cover"
          />
        )}
        <span className="coop-card__scrim" />
        {isSoon && (
          <span className="coop-card__badge font-mono">{store.badgeText}</span>
        )}
        <span className="coop-card__town">{store.name}</span>
      </>
    );

    // A town with a page is a link to it; one without is a plain tile.
    return store.path ? (
      <Link key={store.slug} href={store.path} className={className}>
        {body}
      </Link>
    ) : (
      <div key={store.slug} className={className}>
        {body}
      </div>
    );
  };

  if (stores.length === 0) return null;

  return (
    <div className="coop-band">
      <style>{`
        .coop-band {
          position: relative;
          width: 100%;
          --coop-gap: 4vw;
          --coop-gutter: 5vw;
          /* Breathing room under "Find your nearest Peckers.", which the
             heading component only provides on a phone (pb-[5vw] md:pb-0).
             Above md the space has to come from the row. */
          --coop-pad-top: 0px;
          /* Half the difference between the font's descender space and the
             gap its ascent leaves above a capital, in ems of the badge. */
          --coop-badge-nudge: .045em;
        }

        /* Phone: a plain column, like the live site. The row does no
           scrolling of its own here — the coming-soon strip inside it does. */
        .coop-row {
          display: block;
          padding: var(--coop-pad-top) var(--coop-gutter) 0;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .coop-row::-webkit-scrollbar { display: none; }
        .coop-row > .coop-card { margin-bottom: 8vw; }

        /* The towns that have not opened yet, in the slot the "We're
           expanding" card used to occupy. Above the phone breakpoint this
           wrapper disappears (display: contents) and its cards join the row
           as ordinary members of it. */
        .coop-soon {
          display: flex;
          gap: var(--coop-gap);
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          overscroll-behavior-x: contain;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .coop-soon::-webkit-scrollbar { display: none; }
        .coop-soon > .coop-card { flex: 0 0 100%; }

        .coop-card {
          position: relative;
          flex: 0 0 auto;
          /* w-full h-[50vw] on the live site, where full width is 90vw. */
          width: 100%;
          height: 50vw;
          scroll-snap-align: start;
          container-type: inline-size;
          border-radius: 3vw;
          overflow: hidden;
          border: 1px solid #333;
          background: #0e0e0e;
          display: grid;
          place-items: center;
          text-decoration: none;
          isolation: isolate;
        }

        .coop-card__img { transition: transform .7s cubic-bezier(0,0,.2,1); }
        .coop-card:hover .coop-card__img { transform: scale(1.1); }

        /* The live site's own values: bg-black/40 on phone and tablet, where
           the name is huge and sits across the whole picture, and only
           bg-black/10 from laptop up (hover bg-black/20). Enough to seat the
           name on the photograph without washing the colour out of it. */
        .coop-card__scrim {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,.4);
          transition: background .4s ease;
        }

        .coop-card__town {
          position: relative;
          z-index: 2;
          font-family: var(--font-peakers);
          font-weight: 600;
          text-transform: uppercase;
          color: #fff;
          /* Sized against the card, not the viewport, but set to the ratio
             the live site works out to: text-[10vw] in a 90vw card. */
          font-size: 11.1cqw;
          line-height: .95;
          letter-spacing: .025em;
          text-align: center;
          padding-inline: 6cqw;
          /* Tailwind's drop-shadow-lg, which is what the live site uses. */
          filter: drop-shadow(0 10px 8px rgba(0,0,0,.04)) drop-shadow(0 4px 3px rgba(0,0,0,.1));
        }
        .coop-card__badge {
          position: absolute;
          z-index: 3;
          top: 4cqw;
          left: 4cqw;
          /* A pill, not a run of inline text: the box centres the letters
             itself instead of leaving them to the font's own line box. */
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 3.1cqw;
          font-weight: 500;
          letter-spacing: .18em;
          /* No line-height here on purpose: the pill is positioned, so it
             blockifies and takes its height from the inherited line-height.
             Setting it to 1 would shave about a fifth off the capsule. */
          text-transform: uppercase;
          color: #fff;
          border: 1px solid rgba(255,255,255,.65);
          border-radius: 999px;
          /* The pill keeps exactly the size it had: every correction below
             adds on one side what it takes off the other, so the padding
             still totals 2.8cqw tall and 6cqw wide.
             Across: letter-spacing is added after the last letter too, so
             the text sat left-heavy in a symmetrical pill.
             Down: capitals leave the font's descender space empty under
             them, so centring the line box left the letters sitting high. */
          padding: calc(1.4cqw + var(--coop-badge-nudge)) calc(3cqw - .09em)
                   calc(1.4cqw - var(--coop-badge-nudge)) calc(3cqw + .09em);
          background: rgba(0,0,0,.65);
        }

        /* Unopened towns read as announcements, not as places to order from. */
        .coop-card--soon { border-style: dashed; border-color: #4a4a4a; }
        .coop-card--soon .coop-card__img { filter: grayscale(.7) brightness(.62); }
        .coop-card--soon .coop-card__scrim { background: rgba(0,0,0,.45); }

        /* The arrow sits on the edge of the outermost card rather than beside
           the row: with the cards filling the width exactly, it is the only
           thing telling you another town is parked just off screen. On a
           phone the strip it belongs to is the last thing in the band, so the
           arrow is placed from the bottom — half a card up from it. */
        .coop-nav {
          position: absolute;
          bottom: 25vw;
          transform: translateY(50%);
          z-index: 20;
          width: 11vw;
          height: 11vw;
          max-width: 56px;
          max-height: 56px;
          display: grid;
          place-items: center;
          color: #fff;
          font-size: 7vw;
          line-height: 1;
          cursor: pointer;
          /* Just the chevron. The box is still 56px so there is something
             to tap, but nothing is drawn behind it — the shadow is what
             keeps it readable over a photograph. */
          background: none;
          border: 0;
          text-shadow: 0 2px 12px rgba(0,0,0,.95), 0 0 4px rgba(0,0,0,.8);
        }
        .coop-nav--prev { left: 2vw; }
        .coop-nav--next { right: 2vw; }
        /* display: grid above is an author rule, so it would otherwise beat
           the browser's own [hidden] rule and keep the button on screen. */
        .coop-nav[hidden] { display: none; }

        /* From tablet up the gutter matches the heading above the row
           (px-[1.4vw] on CoopHeading), so the first card lines up with the
           "O" of OUR LOCATIONS. */
        @media (min-width: 768px) {
          .coop-band { --coop-gap: 1.5vw; --coop-gutter: 1.4vw; --coop-pad-top: 2.6vw; }

          /* One strip again: the row scrolls and the coming-soon wrapper
             stops being a box, so its cards sit in the row directly. */
          .coop-row {
            display: flex;
            gap: var(--coop-gap);
            overflow-x: auto;
            overflow-y: hidden;
            scroll-snap-type: x mandatory;
            scroll-padding-left: var(--coop-gutter);
            overscroll-behavior-x: contain;
          }
          .coop-row > .coop-card { margin-bottom: 0; }
          .coop-soon { display: contents; }
          /* The full-width basis belongs to the phone strip only; in the row
             the card is sized by its width like every other one. */
          .coop-soon > .coop-card { flex: 0 0 auto; }

          /* Two whole cards across, worked out from the row's own content
             width rather than from vw, so the maths is right whether or not
             a scrollbar is taking up room. */
          .coop-card {
            /* The live site fixes the height per breakpoint rather than
               keeping one ratio — h-[36vw] here, 22vw at lg, 19vw at xl —
               so the cards are matched to those, not to an aspect ratio. */
            width: calc((100% - var(--coop-gap)) / 2);
            height: 36vw;
            border-radius: 2vw;
          }
          /* text-[7vw] in a 47vw card. */
          .coop-card__town { font-size: 14.8cqw; }
          .coop-card__badge {
            font-size: 2.6cqw;
            top: 3.2cqw;
            left: 3.2cqw;
            padding: calc(1.2cqw + var(--coop-badge-nudge)) calc(2.4cqw - .09em)
                     calc(1.2cqw - var(--coop-badge-nudge)) calc(2.4cqw + .09em);
          }
          /* The journal slider's chevron: text-3xl, a fixed 30px, not a vw
             that grows with the screen. */
          /* Centred on the cards, not on the band: the band is taller than
             the row of cards by --coop-pad-top, so a plain top: 50% lands
             half that padding high. Pinning the box to the card strip and
             letting the auto margins share what is left centres it on the
             picture itself. */
          .coop-nav {
            top: var(--coop-pad-top);
            bottom: 0;
            transform: none;
            margin-block: auto;
            font-size: 1.875rem;
            width: 56px;
            height: 56px;
          }
        }

        /* Three whole cards, the width the live site uses. The fourth waits
           off the right-hand edge behind the arrow. */
        @media (min-width: 1024px) {
          .coop-card {
            width: calc((100% - 2 * var(--coop-gap)) / 3);
            height: 22vw;
            border-radius: 1.5vw;
          }
          /* text-[3vw] in a 30vw card. */
          .coop-card__town { font-size: 10cqw; }
          /* From laptop up the live site barely tints the photograph. */
          .coop-card--open .coop-card__scrim { background: rgba(0,0,0,.1); }
          .coop-card--open:hover .coop-card__scrim { background: rgba(0,0,0,.2); }
        }

        @media (min-width: 1280px) {
          .coop-card { height: 19vw; border-radius: 8px; }
          /* text-[2.6vw] in a 32vw card. */
          .coop-card__town { font-size: 8.1cqw; }
        }

        @media (prefers-reduced-motion: reduce) {
          .coop-card__img, .coop-card__scrim { transition-duration: .01ms; }
        }
      `}</style>

      <div
        ref={rowRef}
        className="coop-row"
        role="group"
        aria-label="Peckers locations"
      >
        {openStores.map(renderCard)}
        <div ref={soonRef} className="coop-soon">
          {soonStores.map(renderCard)}
        </div>
      </div>

      {/* The arrows leave the page entirely at each end rather than sitting
          there inert — from the outside that is the only way to tell. */}
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        aria-label="Scroll locations left"
        className="coop-nav coop-nav--prev"
        hidden={edges.start}
      >
        <span className="pb-[1vw] md:pb-1 font-sans font-bold">&lsaquo;</span>
      </button>
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        aria-label="Scroll locations right"
        className="coop-nav coop-nav--next"
        hidden={edges.end}
      >
        <span className="pb-[1vw] md:pb-1 font-sans font-bold">&rsaquo;</span>
      </button>
    </div>
  );
}
