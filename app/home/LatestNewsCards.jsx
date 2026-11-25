"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { client } from "../../sanity/lib/client";
import { urlFor } from "../../sanity/lib/image";

let globalId = 0;
const makeCard = (imageIndex, slot) => ({
  id: globalId++,
  imageIndex,
  slot,
});

const createInitialCards = (centerIdx, totalImages) => {
  if (totalImages === 0) return [];
  const N = totalImages;
  return [
    makeCard((centerIdx - 2 + N * 100) % N, -2),
    makeCard((centerIdx - 1 + N * 100) % N, -1),
    makeCard(centerIdx % N, 0),
    makeCard((centerIdx + 1) % N, 1),
    makeCard((centerIdx + 2) % N, 2),
  ];
};

export default function LatestNewsCards({ news = [], onActiveIndexChange }) {
  // A card earns a slot if it has an image, a video, or both. The image is the
  // poster frame when a video is present, so video-only cards are allowed but
  // will show black until the first frame decodes.
  const images = news.filter((item) => item.image?.asset || item.videoUrl);
  const [cards, setCards] = useState(
    images.length > 0 ? createInitialCards(0, images.length) : [],
  );
  const [centerIdx, setCenterIdx] = useState(0);
  const animatingRef = useRef(false);

  // Video cards never autoplay: browsers block sound unless a person asks for
  // it, so the card sits on its poster until the play button is pressed. Only
  // one card may play at a time, tracked here by card id.
  const [playingId, setPlayingId] = useState(null);
  const videoRefs = useRef({});

  const N = images.length;

  useEffect(() => {
    if (onActiveIndexChange) {
      onActiveIndexChange(centerIdx);
    }
  }, [centerIdx, onActiveIndexChange]);

  // Sliding away stops whatever was playing — otherwise a clip keeps talking
  // from a card that has rotated off to the side.
  useEffect(() => {
    Object.values(videoRefs.current).forEach((el) => {
      if (!el) return;
      el.pause();
      el.currentTime = 0;
      el.muted = true;
    });
    setPlayingId(null);
  }, [centerIdx]);

  const playCard = useCallback((cardId) => {
    const el = videoRefs.current[cardId];
    if (!el) return;
    // The click itself is the user gesture that buys us sound, so unmute
    // before calling play() rather than after.
    el.muted = false;
    el.volume = 1;
    const started = el.play();
    if (started?.catch) started.catch(() => { });
    setPlayingId(cardId);
  }, []);

  if (N === 0) return null;

  const goNext = useCallback(() => {
    if (animatingRef.current || N === 0) return;
    animatingRef.current = true;

    const newCenter = (centerIdx + 1) % N;
    const newImageIdx = (newCenter + 2) % N;

    setCards((prev) => {
      const shifted = prev.map((c) => ({ ...c, slot: c.slot - 1 }));
      const filtered = shifted.filter((c) => c.slot >= -2);
      filtered.push(makeCard(newImageIdx, 2));
      return filtered;
    });

    setCenterIdx(newCenter);
    setTimeout(() => {
      animatingRef.current = false;
    }, 750);
  }, [centerIdx, N]);

  const goPrev = useCallback(() => {
    if (animatingRef.current || N === 0) return;
    animatingRef.current = true;

    const newCenter = (centerIdx - 1 + N) % N;
    const newImageIdx = (newCenter - 2 + N * 100) % N;

    setCards((prev) => {
      const shifted = prev.map((c) => ({ ...c, slot: c.slot + 1 }));
      const filtered = shifted.filter((c) => c.slot <= 2);
      filtered.push(makeCard(newImageIdx, -2));
      return filtered;
    });

    setCenterIdx(newCenter);
    setTimeout(() => {
      animatingRef.current = false;
    }, 750);
  }, [centerIdx, N]);

  // Handler for clicking on side images
  const handleCardClick = (slot) => {
    if (animatingRef.current) return;
    if (slot === -1) {
      goPrev();
    } else if (slot === 1) {
      goNext();
    }
    // No action for center (slot 0) or hidden slots
  };

  return (
    <div className="relative w-full h-full md:py-[1vw] bg-black overflow-visible">
      <style>{`
        .card-slot-m2 { transform: translate(calc(-50% - 150vw), -50%) scale(0.8); opacity: 0; z-index: 0; pointer-events: none; }
        .card-slot-m1 { transform: translate(calc(-50% - 70vw), -50%) rotate(-4deg) scale(0.9); opacity: 0.6; z-index: 2; filter: brightness(0.7); cursor: pointer; }
        .card-slot-0  { transform: translate(-50%, -50%) scale(1.02); opacity: 1; z-index: 10; filter: brightness(1); cursor: default;}
        .card-slot-1  { transform: translate(calc(-50% + 70vw), -50%) rotate(4deg) scale(0.9); opacity: 0.6; z-index: 2; filter: brightness(0.7); cursor: pointer; }
        .card-slot-2  { transform: translate(calc(-50% + 150vw), -50%) scale(0.8); opacity: 0; z-index: 0; pointer-events: none; }
        
        .latest-card {
           width: 60vw;
           height: 82vw;
           border-radius: 4vw;
        }
        @media (min-width: 768px) {
          .card-slot-m2 { transform: translate(calc(-50% - 97vw), -50%) rotateY(45deg) scale(0.6); }
          .card-slot-m1 { transform: translate(calc(-50% - 38vw), -50%) rotate(-5deg) scale(0.92); }
          .card-slot-0  { transform: translate(-50%, -50%) rotateY(0deg) scale(1.08); opacity: 1; z-index: 10; filter: brightness(1); cursor: default;}
          .card-slot-1  { transform: translate(calc(-50% + 38vw), -50%) rotate(5deg) scale(0.92); }
          .card-slot-2  { transform: translate(calc(-50% + 97vw), -50%) rotateY(-45deg) scale(0.6); }
          .latest-card {
             width: 48vw;
             height: 68vw;
             border-radius: 2.5vw;
          }
        }
        @media (min-width: 1280px) {
          .card-slot-m1 { transform: translate(calc(-50% - 32vw), -50%) rotate(-5deg) scale(0.92); }
          .card-slot-1  { transform: translate(calc(-50% + 32vw), -50%) rotate(5deg) scale(0.92); }
          .latest-card {
             width: 30vw;
             height: 44vw;
             border-radius: 1.5vw;
          }
        }
      `}</style>
      <div
        className="relative w-full h-[90vw] md:h-[750px] lg:h-[850px] xl:h-[46vw] py-0 md:py-[3vw]"
        style={{
          perspective: "1400px",
          transformStyle: "preserve-3d",
        }}
      >
        <button
          onClick={goPrev}
          className="absolute left-[1vw] top-1/2 -translate-y-1/2 z-40 w-[12vw] md:w-[60px] h-[12vw] md:h-[60px] flex items-center justify-center text-white"
        >
          <span className="text-[8vw] md:text-3xl font-bold font-sans pb-[1vw] md:pb-1">
            ‹
          </span>
        </button>

        {cards.map((card) => (
          <div
            key={card.id}
            // Only add onClick for left and right images
            onClick={
              card.slot === -1
                ? () => handleCardClick(-1)
                : card.slot === 1
                  ? () => handleCardClick(1)
                  : undefined
            }
            // Add role and tabIndex for accessibility if clickable
            role={card.slot === -1 || card.slot === 1 ? "button" : undefined}
            tabIndex={card.slot === -1 || card.slot === 1 ? 0 : undefined}
            aria-label={
              card.slot === -1
                ? "Previous slide"
                : card.slot === 1
                  ? "Next slide"
                  : undefined
            }
            // Keyboard accessibility for left/right images
            onKeyDown={
              card.slot === -1 || card.slot === 1
                ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleCardClick(card.slot);
                  }
                }
                : undefined
            }
            className={`group latest-card card-slot-${card.slot < 0 ? "m" + Math.abs(card.slot) : card.slot} absolute left-1/2 top-1/2 overflow-hidden`}
            style={{
              transition:
                "transform .75s cubic-bezier(.22,1,.36,1), opacity .5s ease, filter .5s ease",
            }}
          >
            {images[card.imageIndex].videoUrl ? (
              <>
                <video
                  ref={(el) => {
                    videoRefs.current[card.id] = el;
                  }}
                  src={images[card.imageIndex].videoUrl}
                  // Never pass "" as a poster — the browser treats it as a
                  // relative URL, re-downloads this page and fails to decode it.
                  poster={
                    images[card.imageIndex].image?.asset
                      ? urlFor(images[card.imageIndex].image)
                        .width(900)
                        .quality(75)
                        .auto("format")
                        .url()
                      : undefined
                  }
                  playsInline
                  preload="metadata"
                  controls={playingId === card.id}
                  controlsList="nodownload"
                  onEnded={() => setPlayingId(null)}
                  aria-label={`${images[card.imageIndex].title || "Latest News"} | Peckers Chicken Hertfordshire`}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${playingId === card.id ? "" : "group-hover:scale-110"
                    }`}
                />
                {/* Only the centre card is playable. The side cards are the
                    slider's own prev/next buttons, so a play button there
                    would swallow the click that moves the slider. */}
                {card.slot === 0 && playingId !== card.id && (
                  <button
                    type="button"
                    onClick={() => playCard(card.id)}
                    aria-label={`Play video: ${images[card.imageIndex].title || "Latest News"}`}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 transition-colors duration-300 hover:bg-black/25 cursor-pointer"
                  >
                    <span className="flex items-center justify-center w-[16vw] h-[16vw] md:w-[7vw] md:h-[7vw] xl:w-[5vw] xl:h-[5vw] rounded-full bg-white/90 shadow-lg transition-transform duration-300 hover:scale-110">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        className="w-[6vw] h-[6vw] md:w-[2.6vw] md:h-[2.6vw] xl:w-[1.8vw] xl:h-[1.8vw] text-black translate-x-[8%]"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </button>
                )}
              </>
            ) : (
              <Image
                src={urlFor(images[card.imageIndex].image).url()}
                alt={`${images[card.imageIndex].title || "Latest News"} | Peckers Chicken Hertfordshire`}
                fill
                sizes="(max-width:768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            )}
          </div>
        ))}

        <button
          onClick={goNext}
          className="absolute right-[1vw] top-1/2 -translate-y-1/2 z-40 w-[12vw] md:w-[60px] h-[12vw] md:h-[60px] flex items-center justify-center text-white"
        >
          <span className="text-[8vw] md:text-3xl font-bold font-sans pb-[1vw] md:pb-1">
            ›
          </span>
        </button>
      </div>

      {/* Mobile Indicator Dots/Dashes */}
      <div className="flex justify-center gap-1.5 mt-[2vw] mb-[4vw] md:hidden">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`h-[3px] w-[5vw] transition-all duration-300 ${idx === centerIdx ? "bg-white scale-x-110" : "bg-zinc-700"
              }`}
          />
        ))}
      </div>
    </div>
  );
}