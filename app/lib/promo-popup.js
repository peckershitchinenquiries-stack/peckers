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
  // new value (e.g. "summer-offer-2027") whenever you put up a NEW promo — that
  // makes it show again to everyone, including people who dismissed the old one.
  version: "christmas-menu-2026",

  // The image to show. Put the file in the "public" folder and write the path
  // starting from there, e.g. a file at public/popup/promo.png is "/popup/promo.png".
  src: "/popup/banner-pc-final.webp",

  // Describes the image for screen readers and search engines. Write a plain
  // sentence saying what the image announces.
  alt: "Unwrapping soon: the Peckers Christmas menu. New festive flavours, made for sharing, coming this Christmas.",

  // The image's real pixel size. These must match the actual file or the popup
  // will look stretched or squashed. Check the file's dimensions before editing.
  width: 1920,
  height: 1080,

  // Optional portrait version shown on phones held upright. Tall images suit
  // phone screens far better than wide ones. Set mobileSrc to null to use the
  // main image everywhere instead. If you do use one, its mobileWidth and
  // mobileHeight must match the file's real pixel size.
  // The portrait poster is used on upright phones; the landscape one above
  // takes over from 768px up, and on any phone turned sideways, where a wide
  // banner suits the screen far better.
  mobileSrc: "/popup/banner-mobile-final.webp",
  mobileWidth: 1333,
  mobileHeight: 2000,

  // Optional link. Leave as null for an image that isn't clickable, or put a
  // URL in quotes to make the whole image a link, e.g. "/rewards" for a page on
  // this site, or "https://www.just-eat.co.uk" for another website.
  // Null here: this is a "coming soon" teaser, so there is nowhere to send
  // people yet. Point it at "/menu" once the festive menu is live.
  href: null,

  // Optional call-to-action button shown directly under the image, the same
  // width as the image on every screen size. Set ctaLabel (or ctaHref) to null
  // to hide the button completely.
  // Null here for the same reason as href — nothing to click through to yet.
  // With no button the artwork gets the whole screen to fill.
  ctaLabel: null,
  ctaHref: null,

  // Whether the popup may trim a sliver off the top and bottom of the artwork
  // when the window is too short to show all of it at full width.
  //
  // Leave it out (or set true) for an ordinary poster: the banner then fills
  // noticeably more of a widescreen monitor, losing only background from its
  // outermost rows, and the margins down either side stay narrow.
  //
  // Set it to false when the artwork has a border, frame or any other detail
  // baked right into its edge. Trimming would cut the top and bottom off that
  // border and leave the two sides behind, which reads as a bug rather than a
  // design. With it off, the banner shrinks to fit the window whole instead,
  // so the margins either side are wider.
  //
  // True here: this artwork runs background off every edge and has nothing at
  // them worth keeping. The frame below is drawn by the site rather than being
  // part of the file, so it is unaffected by any of this.
  allowCrop: true,

  // Optional frame drawn around the banner by the site. Because it is drawn
  // outside the image rather than painted into it, it is never trimmed by the
  // crop above: it stays an even, exact width on all four sides at every
  // screen size, and the artwork can still fill the window. A border baked
  // into the file can do neither, so prefer this.
  //
  // borderWidth is in CSS pixels and borderColor is any CSS colour. Set
  // borderColor to null for no frame at all.
  borderWidth: 2,
  borderColor: "#fd5d01",

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
