"use client";

import { FESTIVE_HAT, isFestiveHatActive } from "../lib/festive-hat";
import styles from "./FestiveHat.module.css";

// A Santa hat that grows out of a point behind the wordmark, comes forward
// over the "P", rests there, then shrinks back behind the letters and goes
// again. Purely decorative, so it is hidden from screen readers and takes no
// pointer events.
//
// Drop it inside the navbar's logo link. That link must be `relative` and a
// size container (`[container-type:size]`), because the hat is placed against
// where the logo artwork actually lands inside the link, not against the link
// itself — the two differ at most breakpoints, since the link's width and
// height do not share the artwork's 1049:366 ratio.
//
// Everything about it lives in app/lib/festive-hat.js.
export default function FestiveHat() {
  // Date-gated, so the hat retires on its own if an endDate is set. Evaluated
  // per render rather than in state: it only has to be right on the day, and
  // keeping it stateless means no hydration mismatch to manage.
  if (!isFestiveHatActive()) return null;

  const mask = `url(${FESTIVE_HAT.src}) center / 100% 100% no-repeat`;

  const vars = {
    "--pk-hat-width": `${FESTIVE_HAT.hatWidth}%`,
    "--pk-hat-left": `${FESTIVE_HAT.left}%`,
    "--pk-hat-top": `${FESTIVE_HAT.top}%`,
    "--pk-hat-tilt": `${FESTIVE_HAT.tilt}deg`,
    "--pk-hat-ratio": `${FESTIVE_HAT.width} / ${FESTIVE_HAT.height}`,
    "--pk-hat-mask": mask,
    "--pk-cycle": `${FESTIVE_HAT.roundSeconds}s`,
    "--pk-shadow": FESTIVE_HAT.shadowStrength,
  };

  return (
    <span className={`${styles.fit} ${styles.playing}`} style={vars} aria-hidden="true">
      <span className={styles.hatBox}>
        <span className={styles.shadow} />
        {/* A plain img: the CSS masks above have to point at this exact file,
            and next/image would rewrite the URL it serves. 55KB, decorative. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.hat}
          src={FESTIVE_HAT.src}
          alt=""
          width={FESTIVE_HAT.width}
          height={FESTIVE_HAT.height}
          decoding="async"
        />
        <span className={styles.shade} />
      </span>

      {FESTIVE_HAT.sparkles && (
        <>
          <Sparkle className={styles.s1} fill="#ffffff" />
          <Sparkle className={styles.s2} fill="#ffe3bd" />
          <Sparkle className={styles.s3} fill="#ffffff" />
        </>
      )}
    </span>
  );
}

function Sparkle({ className, fill }) {
  return (
    <span className={`${styles.star} ${className}`}>
      <svg viewBox="0 0 24 24">
        <path
          d="M12 0c.7 6 5.3 10.6 12 12-6.7 1.4-11.3 6-12 12-.7-6-5.3-10.6-12-12C6.7 10.6 11.3 6 12 0z"
          fill={fill}
        />
      </svg>
    </span>
  );
}
