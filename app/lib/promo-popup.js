// Promo popup configuration.
//
// This is the only file you need to edit to change, schedule, or switch off the
// popup that appears on the home page. Nothing here requires a code change
// elsewhere — save the file, redeploy, done.

export const PROMO_POPUP = {
  // Master switch. Set to false to turn the popup off completely.
  enabled: true,

  // Identifies this particular promo. Once a visitor closes the popup they
  // won't see it again for the rest of their browsing session. Change this to a
  // new value (e.g. "summer-offer-2026") whenever you put up a NEW promo — that
  // makes it show again to everyone, including people who dismissed the old one.
  version: "just-eat-2026",

  // The image to show. Put the file in the "public" folder and write the path
  // starting from there, e.g. a file at public/popup/promo.png is "/popup/promo.png".
  src: "/popup/promo5-trimmed.webp",

  // Describes the image for screen readers and search engines. Write a plain
  // sentence saying what the image announces.
  alt: "Peckers nominated for the Just Eat Best Takeaway Award 2026",

  // The image's real pixel size. These must match the actual file or the popup
  // will look stretched or squashed. Check the file's dimensions before editing.
  width: 1182,
  height: 784,

  // Optional portrait version shown on phones (screens under 768px wide).
  // Tall images suit phone screens far better than wide ones. Set mobileSrc to
  // null to use the main image everywhere instead. If you do use one, its
  // mobileWidth/mobileHeight must match the file's real pixel size.
  mobileSrc: "/popup/mobile-pop-up.webp",
  mobileWidth: 1054,
  mobileHeight: 1492,

  // Optional link. Leave as null for an image that isn't clickable, or put a
  // URL in quotes to make the whole image a link, e.g. "/rewards" for a page on
  // this site, or "https://www.just-eat.co.uk" for another website.
  href: null,

  // Optional scheduling, as "YYYY-MM-DD" in quotes.
  //   startDate: the popup stays hidden before this date.
  //   endDate:   the popup stops showing after this date (the end day itself
  //              still counts as active).
  // Leave either as null for "no limit". Example: startDate: "2026-08-01".
  startDate: null,
  endDate: null,

  // How long to wait before the popup appears, in milliseconds
  // (1000 = 1 second). Gives the visitor a moment to see the page first.
  delayMs: 1500,
};

// Where the "this visitor already closed the popup" note is kept in the
// browser. There's no reason to change this.
export const PROMO_STORAGE_KEY = "peckers_promo_dismissed";

// Returns false when the popup is switched off, or when today's date falls
// outside the configured start/end dates. Used by the popup component itself —
// you don't need to call this anywhere.
export function isPromoActive(now = new Date()) {
  if (!PROMO_POPUP.enabled) return false;

  // Compare on calendar days only, so a start/end date covers its whole day
  // regardless of the visitor's clock time.
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const start = parseConfigDate(PROMO_POPUP.startDate);
  if (start && today < start) return false;

  const end = parseConfigDate(PROMO_POPUP.endDate);
  if (end && today > end) return false;

  return true;
}

// Turns "YYYY-MM-DD" into a local-time date. Returns null for null/empty or
// unparseable values, so a typo in the config can't hide the popup silently.
function parseConfigDate(value) {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value).trim());
  if (!match) return null;
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(date.getTime()) ? null : date;
}
