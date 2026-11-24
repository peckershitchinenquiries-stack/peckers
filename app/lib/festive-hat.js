// Festive hat configuration.
//
// This is the only file you need to edit to move the Santa hat, change how long
// a round takes, schedule it, or switch it off. Nothing here requires a code
// change elsewhere — save the file, redeploy, done.
//
// The hat sits on the "P" of the Peckers wordmark in the navbar. Each round it
// grows out of a point hidden behind the letters, comes forward over the P,
// rests there, then shrinks back behind the letters and goes again.

export const FESTIVE_HAT = {
  // Master switch. Set to false to turn the hat off completely.
  enabled: true,

  // The artwork. Put the file in the "public" folder and write the path
  // starting from there, e.g. a file at public/festive/santa-hat.webp is
  // "/festive/santa-hat.webp". It must have a transparent background and be
  // trimmed tight to the hat, with no empty margin, or the placement numbers
  // below will not line up.
  src: "/festive/santa-hat.webp",

  // The artwork's real pixel size. These must match the actual file.
  width: 560,
  height: 393,

  // --- Placement -----------------------------------------------------------
  // All four are percentages of the LOGO artwork, not pixels, so one set of
  // numbers holds at every screen size and through the navbar's shrink-on-
  // scroll. The logo is 1049 x 366 units, and the "P" occupies x 73-186,
  // y 71-294 of that, if you ever need to work a number out by hand.
  //
  // hatWidth  how wide the hat is, as a % of the logo's width
  // left      the hat's left edge, as a % of the logo's width
  // top       the hat's top edge, as a % of the logo's height (negative sits
  //           it above the top of the logo box, which is what you want)
  // tilt      the resting tilt in degrees; negative leans left
  hatWidth: 22,
  left: -2.4,
  top: -6.5,
  tilt: -7.5,

  // --- Timing --------------------------------------------------------------
  // One full round in seconds: the hat grows for 49% of it, rests on the P for
  // 19%, shrinks away over 29%, then waits out a 2% gap before going again.
  // Raise this to make the whole thing slower and less frequent.
  roundSeconds: 3.75,

  // --- Shadow --------------------------------------------------------------
  // How dark the shadow under the hat gets once it has settled on the letter,
  // from 0 (no shadow) to 1 (black). It fades in as the hat comes in front of
  // the P and fades out again before it slips behind, so it never appears or
  // vanishes abruptly. Keep it modest: the shadow only shows where it falls on
  // the white letter, and too much of it makes the P look like a different
  // shape.
  shadowStrength: 0.5,

  // Whether the little sparkles pop once the hat has landed.
  sparkles: true,

  // --- Scheduling ----------------------------------------------------------
  // As "YYYY-MM-DD" in quotes.
  //   startDate: the hat stays hidden before this date.
  //   endDate:   the hat stops showing after this date (the end day itself
  //              still counts as active).
  // Leave either as null for "no limit". Setting endDate is the tidy way to
  // retire the hat in January without having to remember to edit anything.
  startDate: null,
  endDate: null,
};

// Returns false when the hat is switched off, or when today's date falls
// outside the configured start/end dates. Used by the component itself — you
// don't need to call this anywhere.
export function isFestiveHatActive(now = new Date()) {
  if (!FESTIVE_HAT.enabled) return false;

  // Compare on calendar days only, so a start/end date covers its whole day
  // regardless of the visitor's clock time.
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const start = parseConfigDate(FESTIVE_HAT.startDate);
  if (start && today < start) return false;

  const end = parseConfigDate(FESTIVE_HAT.endDate);
  if (end && today > end) return false;

  return true;
}

// Turns "YYYY-MM-DD" into a local-time date. Returns null for null/empty or
// unparseable values, so a typo in the config can't hide the hat silently.
function parseConfigDate(value) {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value).trim());
  if (!match) return null;
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(date.getTime()) ? null : date;
}
