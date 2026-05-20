"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { urlFor } from "../../sanity/lib/image";

export default function SignUpSection({ initialData = null }) {
  const glossRef = useRef(null);
  const data = initialData;

  useEffect(() => {
    if (!data) return;
    const gloss = glossRef.current;
    if (!gloss) return;
    gsap.set(gloss, { left: "-60%", opacity: 0.34 });
    const loop = gsap.to(gloss, {
      left: "120%",
      opacity: 0.54,
      duration: 1.3,
      repeat: -1,
      ease: "power2.inOut",
      yoyo: false,
      delay: 0.3,
      onUpdate: () => { },
      onRepeat: () => {
        gsap.set(gloss, { left: "-60%", opacity: 0.34 });
      },
    });
    return () => loop && loop.kill();
  }, [data]);

  if (!data) return null;

  const bgImageUrl = data.backgroundImage
    ? urlFor(data.backgroundImage).width(1920).quality(80).auto("format").url()
    : "https://ehtazgziwtjqm5ww.public.blob.vercel-storage.com/HomePage/Sign%20Up%20Section.webp";

  return (
    <div
      className="w-full flex justify-center items-center pt-0 pb-[5vw] md:pb-[6vw] lg:pb-[3vw] xl:pb-[2.5vw] px-[3.5vw] md:px-[4vw] lg:px-[3vw] xl:px-[2vw] border-b border-[#262626]"
      style={{ overflow: "visible" }}
    >
      <div
        className="w-full max-w-7xl mx-auto rounded-[2.5vw] md:rounded-[3vw] lg:rounded-[1.5vw] xl:rounded-[0.9vw] shadow-lg flex flex-col items-center justify-center p-[4vw] md:p-[5vw_3vw] lg:p-[4vw_2vw] xl:p-[2.2vw_1.5vw] min-h-[38vw] md:min-h-[40vw] lg:min-h-[25vw] xl:min-h-[20vw]"
        style={{
          backgroundImage: `url('${bgImageUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          border: "1px solid #333",
          boxShadow: "0 6px 30px 0 #16161669",
          position: "relative",
          overflow: "visible",
        }}
      >
        <h2
          className="text-white px-[2vw] font-bold text-[7.2vw] sm:text-[6.2vw] md:text-[3.3vw] mb-[0.6vw] md:mb-[0.8vw] lg:mb-[0.8vw] xl:mb-[0.3vw] leading-tight font-sans text-center"
          style={{ letterSpacing: "0.04em", fontFamily: "var(--font-peakers)" }}
        >
          {data.heading || "JOIN THE FAMILY"}
        </h2>

        <p
          className="text-[#e7e7e7e0] text-[3.5vw] sm:text-[3vw] md:text-[3.5vw] lg:text-[2vw] xl:text-[1.35vw] font-sans mb-[6vw] md:mb-[6vw] lg:mb-[3.5vw] xl:mb-[2.8vw] mt-[0.5vw] md:mt-[1vw] lg:mt-0 text-center max-w-[95vw] md:max-w-[80vw] lg:max-w-[60vw] xl:max-w-max"
          style={{
            fontWeight: 300,
            letterSpacing: "0.01em",
            lineHeight: "1.4",
          }}
        >
          {data.description ||
            "Sign up for the Peckers loyalty scheme and get a free milkshake on us today."}
        </p>


        <div style={{ position: "relative", width: "fit-content" }}>
          <button
            onClick={() => window.location.href = "https://peckers.vmos.io/account/auth/register"}
            className="bg-black cursor-pointer text-white px-[5vw] md:px-[6vw] lg:px-[3vw] xl:px-[2vw] py-[2.5vw] md:py-[3.5vw] lg:py-[1.5vw] xl:py-[1.2vw] rounded-[2.5vw] md:rounded-[3vw] lg:rounded-[1vw] xl:rounded-[0.8vw] font-mono text-[3.2vw] md:text-[3.5vw] lg:text-[1.5vw] xl:text-[1.15vw] tracking-[0.07em] transition-all duration-150 hover:bg-[#232323] hover:scale-[1.04] focus:outline-none mx-auto relative overflow-hidden border-0 border-white"
            style={{
              letterSpacing: "0.11em",
              fontWeight: 500,
              boxShadow: "0 2px 10px #0004",
              display: "block",
              backgroundClip: "padding-box",
            }}
          >
            <span
              ref={glossRef}
              style={{
                position: "absolute",
                top: "-30%",
                left: "-60%",
                width: "44%",
                height: "165%",
                background:
                  "linear-gradient(120deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.82) 48%, rgba(255,255,255,0.11) 80%)",
                filter: "blur(0.05vw)",
                borderRadius: "inherit",
                pointerEvents: "none",
                opacity: 0.44,
                zIndex: 2,
                transform: "rotate(-14deg)",
              }}
            ></span>
            <span style={{ position: "relative", zIndex: 3 }}>
              {data.buttonText || "CLAIM MY SHAKE"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
