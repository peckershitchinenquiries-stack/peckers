// Popup music configuration.
//
// This is the only file you need to edit to change the music that plays while
// the promo popup is on screen, how loud it is, or to switch it off. Nothing
// here requires a code change elsewhere — save the file, redeploy, done.
//
// How it behaves: the music starts as the popup appears and plays through
// playCount times (see below), then leaves the banner in silence. The moment
// the visitor closes the popup — by the X, the Escape key, a click on the
// darkened background, or the button on the banner — the music stops, even
// mid-run. It never comes back during that visit, so once the banner is gone
// the page is silent.

export const POPUP_AUDIO = {
  // Master switch. Set to false to turn the music off completely.
  enabled: false,

  // The music file. Put it in the "public" folder and write the path starting
  // from there, e.g. a file at public/audio/website-welcome.mp3 is
  // "/audio/website-welcome.mp3".
  src: "/audio/website-welcome.mp3",

  // How loud, from 0 (silent) to 1 (the file's own full volume). Sound nobody
  // asked for should sit under the page rather than over it, so this is a
  // little below full.
  volume: 0.7,

  // How many times the file plays each time the banner opens. After the last
  // run the banner simply goes quiet, even if the visitor leaves it on screen.
  //
  // Closing the banner stops the music immediately whatever this is set to,
  // part-way through a run included — the count is only ever a limit, never
  // something the visitor has to sit through.
  //
  // Set it to 0 to loop for as long as the banner is up. Worth thinking about
  // before you do: a short piece going round and round is the quickest way to
  // make someone close a banner they might otherwise have read, and a tab left
  // open in the background keeps playing to nobody.
  playCount: 3,

  // How long the music takes to go silent when the popup is closed, in
  // seconds. Cutting a waveform dead makes an audible click or thud on most
  // speakers, and this is short enough to still read as instant — the sound is
  // gone well before the popup has finished fading off the screen. Set it to 0
  // for a hard cut.
  stopFadeSeconds: 0.12,
};

// ---------------------------------------------------------------------------
// Everything below is the machinery. You should not need to change any of it.
//
// The hard part of playing music on a web page is that browsers refuse to make
// a sound on a page the visitor has not touched, and the two big ones refuse
// in different ways:
//
//   Chrome, Edge, Firefox   one click anywhere on the page, at any point, and
//                           sound is allowed for the rest of the visit. The
//                           cookie banner is usually answered a second or two
//                           before the popup appears, which covers it.
//
//   Safari, and every       stricter: the sound must START inside the click
//   browser on an iPhone    itself. A click now does NOT buy permission to
//                           make a sound a second and a half later on a
//                           timer, which is exactly what this popup does — so
//                           on an iPhone the banner would open in silence.
//
// The way round the Safari rule is to get in early. The moment the visitor
// first touches the page — answering the cookie banner, usually — this very
// sound file is started at zero volume and stopped again immediately. Nobody
// hears a thing, but Safari has now seen this particular player started by a
// real finger, and from then on it allows the page to start that player
// whenever it likes. When the popup opens, it is that same already-approved
// player that is asked to play, and the music comes out.
//
// That is what "priming" means below. All of it depends on reusing ONE player:
// a freshly made one would be unapproved again and Safari would silence it.
// ---------------------------------------------------------------------------

// The player and what is known about it. All of it is kept on the window
// rather than in plain variables up here, for one reason: `npm run dev`
// hot-reloads this file the instant it is saved, and a hot reload runs the
// file again from the top. Plain variables would be reset to their starting
// values and a second player would be built on the next tap, while the first
// one carried on looping with nothing left holding a reference to it — two
// copies of the music playing over each other, and no way to stop the older
// one. Hanging the state off the window means a reloaded copy of this file
// finds the player that is already going and keeps using it.
//
//   element       the single player, reused for the life of the page
//   unlocked      the player has been started by a real finger or key press,
//                 even silently, which is what buys the permission above
//   wantPlaying   true between "the popup opened" and "the popup closed".
//                 Everything below checks it before making a sound, because
//                 starting playback is asynchronous: the browser can finish
//                 getting the audio ready AFTER the visitor has closed the
//                 popup, and that late arrival would play to an empty screen
//   hasPlayed     the music has started for real. This is what stops the whole
//                 thing ever beginning again once the visitor has closed the
//                 banner
//   playsDone     runs finished since the banner opened, counted against
//                 playCount above
//   userSilenced  the visitor pressed the speaker button to turn the sound
//                 off. Nothing may start the music again while this is set —
//                 not the retry below, not a stray click — until they press
//                 the button a second time
//   cancelRetry   removes the "try again on the next click" listeners
//   fadeTimer     the fade-out currently running, if any
const STATE_KEY = "__peckersPopupAudio";

function state() {
  if (typeof window === "undefined") return null;
  if (!window[STATE_KEY]) {
    window[STATE_KEY] = {
      element: null,
      unlocked: false,
      wantPlaying: false,
      hasPlayed: false,
      playsDone: 0,
      userSilenced: false,
      cancelRetry: null,
      fadeTimer: null,
    };
  }
  return window[STATE_KEY];
}

function targetVolume() {
  return Math.min(1, Math.max(0, Number(POPUP_AUDIO.volume) ?? 1));
}

// How many runs are allowed. 0, blank or anything that isn't a sensible number
// means "keep going while the banner is up", which is what element.loop does
// natively — so that case never reaches the counting code below.
function playLimit() {
  const raw = Number(POPUP_AUDIO.playCount);
  if (!Number.isFinite(raw) || raw <= 0) return Infinity;
  return Math.floor(raw);
}

function player(s) {
  if (s.element) return s.element;
  const element = new Audio(POPUP_AUDIO.src);
  // Endless play is the browser's own loop flag; a fixed number of runs is
  // counted here instead, because loop:true never fires "ended" at all.
  element.loop = playLimit() === Infinity;
  element.preload = "auto";
  element.volume = targetVolume();

  // One run finished. Start the next unless the visitor has closed the banner
  // (wantPlaying) or the last allowed run has just played.
  //
  // Reads the state through state() rather than the `s` in scope: this
  // listener outlives a hot reload, and `s` would be a stale object from the
  // copy of this file that created the player.
  element.addEventListener("ended", () => {
    const current = state();
    if (!current) return;

    current.playsDone += 1;

    if (!current.wantPlaying || current.userSilenced) return;
    if (current.playsDone >= playLimit()) {
      rewind(current);
      return;
    }

    element.volume = targetVolume();
    try {
      element.currentTime = 0;
    } catch {
      /* already at the start */
    }
    element.play().catch(() => {
      /* nothing to recover: the banner is simply quiet from here */
    });
  });

  s.element = element;
  return element;
}

function rewind(s) {
  if (!s.element) return;
  s.element.pause();
  try {
    s.element.currentTime = 0;
  } catch {
    /* not loaded far enough to seek; it is already at the start */
  }
  s.element.volume = targetVolume();
}

// Silently starts and stops the player so the browser has seen it begin under
// a real finger. Does nothing once the music is wanted for real, or once it
// has played, so it is safe to call on every tap.
//
// Call it from a genuine click, tap or key press — and from the RIGHT one. A
// browser only hands out the permission during an event it reads as a settled,
// deliberate action, and on a touchscreen pointerdown is not one of them: a
// finger that has gone down may still be about to scroll, so nothing is
// granted until pointerup, touchend or click. PromoPopup listens for all of
// them; see the note there.
export function primePopupAudio() {
  const s = state();
  if (!s) return;
  if (!POPUP_AUDIO.enabled || !POPUP_AUDIO.src) return;
  if (s.unlocked || s.hasPlayed || s.wantPlaying) return;

  const audio = player(s);
  audio.volume = 0;

  audio
    .play()
    .then(() => {
      s.unlocked = true;
      // The popup opened while this silent start was still getting going —
      // leave it running and let the volume come up, rather than stopping the
      // music the visitor is now meant to be hearing.
      if (s.wantPlaying) {
        audio.volume = targetVolume();
        s.hasPlayed = true;
        return;
      }
      rewind(s);
    })
    .catch(() => {
      // Nothing to do: this was only ever an attempt to ask permission early.
      audio.volume = targetVolume();
    });
}

// Starts the music. Safe to call more than once. Used by the popup itself —
// you don't need to call this anywhere.
export function startPopupAudio() {
  const s = state();
  if (!s) return;
  if (!POPUP_AUDIO.enabled || !POPUP_AUDIO.src) return;
  if (s.hasPlayed) return;
  if (s.userSilenced) return;

  s.wantPlaying = true;
  s.playsDone = 0;

  clearInterval(s.fadeTimer);
  s.fadeTimer = null;

  const audio = player(s);

  // Already running: the silent priming start was still going when the popup
  // opened. Turn it up rather than restarting it.
  if (!audio.paused) {
    audio.volume = targetVolume();
    s.hasPlayed = true;
    return;
  }

  audio.volume = targetVolume();
  try {
    audio.currentTime = 0;
  } catch {
    /* not loaded far enough to seek; it is already at the start */
  }

  audio
    .play()
    .then(() => {
      s.hasPlayed = true;
      // The popup was closed while the browser was still getting ready.
      if (!s.wantPlaying) rewind(s);
    })
    .catch(() => {
      // Refused. On a first visit this should not happen — the cookie banner
      // was answered a moment ago, which primed the player above. But a
      // returning visitor whose cookie answer is already remembered reaches
      // the popup without having touched anything at all, and no browser will
      // make a sound for them yet. Wait for their first click or key press.
      //
      // Both listeners sit on the window in the bubble phase, so they run
      // AFTER the popup's own handlers. If that first click IS the close, the
      // popup has already asked for silence by the time these fire, and the
      // guard below stops a split second of sound escaping.
      if (!s.wantPlaying) return;

      const retry = () => {
        s.cancelRetry?.();
        if (!s.wantPlaying || s.hasPlayed) return;
        startPopupAudio();
      };

      s.cancelRetry = () => {
        window.removeEventListener("click", retry);
        window.removeEventListener("keydown", retry);
        s.cancelRetry = null;
      };

      window.addEventListener("click", retry);
      window.addEventListener("keydown", retry);
    });
}

// ---------------------------------------------------------------------------
// The speaker button on the banner.
//
// It exists because of the rule described at the top of this file: a browser
// will not make a sound on a page the visitor has not touched yet. A visitor
// who already answered the cookie banner on an earlier visit reaches this
// popup without having tapped anything, so the music is refused and the
// banner opens in silence. The button is how they ask for it — and, for
// everyone who does get the music automatically, how they get rid of it
// without having to close the banner.
// ---------------------------------------------------------------------------

// Whether there is any music to offer at all. The button hides itself when
// there isn't, rather than sitting there doing nothing.
export function popupAudioAvailable() {
  return Boolean(POPUP_AUDIO.enabled && POPUP_AUDIO.src);
}

// Whether sound is coming out RIGHT NOW. This is what the button draws itself
// from, so it tells the truth in every case: playing for the visitor who got
// the music automatically, silent for the one the browser refused, and silent
// again once the last run has finished.
export function isPopupAudioSounding() {
  const s = state();
  const audio = s?.element;
  if (!audio) return false;
  return !audio.paused && !audio.muted && audio.volume > 0;
}

// What the button does. Sound on turns it off; silence starts it from the top.
//
// Starting here is allowed where the automatic start was not, because this
// runs inside the visitor's own press — which is exactly the permission the
// browser was waiting for.
export function togglePopupAudio() {
  const s = state();
  if (!s || !popupAudioAvailable()) return;

  if (isPopupAudioSounding()) {
    // Stop, and remember that the silence was asked for: without this flag the
    // next click anywhere on the page would hit the retry listener below and
    // start the music again, over the visitor's wishes.
    s.userSilenced = true;
    stopPopupAudio();
    return;
  }

  // Play again from the first run, whatever happened before — refused,
  // silenced, or all its runs finished.
  s.userSilenced = false;
  s.hasPlayed = false;
  s.playsDone = 0;
  startPopupAudio();
}

// Stops the music. Safe to call when nothing is playing. Used by the popup
// itself — you don't need to call this anywhere.
export function stopPopupAudio() {
  const s = state();
  if (!s) return;

  s.wantPlaying = false;
  s.cancelRetry?.();

  if (!s.element || s.element.paused) return;

  const audio = s.element;
  const fadeMs = Math.max(0, Number(POPUP_AUDIO.stopFadeSeconds) || 0) * 1000;

  if (fadeMs === 0) {
    rewind(s);
    return;
  }

  const startVolume = audio.volume;
  const startedAt = Date.now();

  clearInterval(s.fadeTimer);
  s.fadeTimer = setInterval(() => {
    const progress = Math.min(1, (Date.now() - startedAt) / fadeMs);
    audio.volume = startVolume * (1 - progress);
    if (progress < 1) return;
    clearInterval(s.fadeTimer);
    s.fadeTimer = null;
    rewind(s);
  }, 20);
}
