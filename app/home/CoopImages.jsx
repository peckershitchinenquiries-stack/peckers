"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { client } from "../../sanity/lib/client";
import { urlFor } from "../../sanity/lib/image";
``;
export default function CoopImages({ locations = [] }) {
  const [town, setTown] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!town.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL;

    if (!scriptUrl) {
      console.error("NEXT_PUBLIC_GOOGLE_SHEET_URL is not defined");
      setError("Configuration error. Please try again later.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors", // Necessary for Google Apps Script Web Apps to avoid CORS issues
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ town: town.trim() }),
      });

      // With mode: 'no-cors', we can't see the response, but if it doesn't throw, it likely worked.
      setSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to send. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const hitchin = locations.find(
    (l) => l.name?.trim().toLowerCase() === "hitchin",
  );
  const stevenage = locations.find(
    (l) => l.name?.trim().toLowerCase() === "stevenage",
  );

  const HITCHIN_IMG = hitchin?.image ? urlFor(hitchin.image).width(1200).quality(80).auto("format").url() : null;
  const STEVENAGE_IMG = stevenage?.image ? urlFor(stevenage.image).width(1200).quality(80).auto("format").url() : null;

  return (
    <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap gap-[8vw] md:gap-[2vw] lg:gap-[2.5vw] xl:gap-[1.5vw] w-full justify-center lg:justify-between items-stretch px-[5vw] md:px-[1.4vw] lg:px-[2.5vw] xl:px-[1.3vw] pt-[1vw] pb-[0.5vw] md:pb-[1vw] lg:pb-[1.5vw] lg:pt-[3.5vw] xl:pb-[0.5vw] xl:pt-[2.5vw]">
      {/* Hitchin Mobile & Tablet */}
      <Link
        href="/hitchin"
        className="group flex lg:hidden relative w-full md:w-[48.5%] h-[50vw] md:h-[36vw] rounded-[3vw] md:rounded-[2vw] overflow-hidden shadow-lg border border-[#333] transition-all duration-300 active:scale-95"
      >
        {HITCHIN_IMG && (
          <Image
            src={HITCHIN_IMG}
            alt={`Peckers Hitchin - Best Peri Peri Grilled Chicken and Takeaway in Hitchin`}
            fill
            className="object-cover transition-transform duration-700 group-active:scale-105"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <span
          className="absolute inset-0 flex items-center justify-center text-white text-[10vw] md:text-[7vw] uppercase tracking-wide font-semibold drop-shadow-lg"
          style={{ fontFamily: "var(--font-peakers)" }}
        >
          {hitchin?.name || "Hitchin"}
        </span>
      </Link>

      {/* Hitchin Desktop & Laptop */}
      <Link
        href="/hitchin"
        className="coop-card group hidden lg:flex relative w-[31vw] xl:w-[37vw] h-[22vw] xl:h-[19vw] items-center justify-center rounded-[1.5vw] xl:rounded-lg overflow-hidden shadow-lg bg-black/40 transition-all duration-500 hover:opacity-90 hover:scale-[1.01]"
      >
        {HITCHIN_IMG && (
          <Image
            src={HITCHIN_IMG}
            alt={`Peckers Hitchin - Premium Fried Chicken and Peri Peri Takeaway`}
            fill
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="35vw"
          />
        )}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
        <span
          className="relative z-10 text-white text-[3vw] xl:text-[2.6vw] drop-shadow-lg uppercase font-semibold"
          style={{ fontFamily: "var(--font-peakers)" }}
        >
          {hitchin?.name || "Hitchin"}
        </span>
      </Link>

      {/* Stevenage Mobile & Tablet */}
      <Link
        href="/stevenage"
        className="group flex lg:hidden relative w-full md:w-[48.5%] h-[50vw] md:h-[36vw] rounded-[3vw] md:rounded-[2vw] overflow-hidden shadow-lg border border-[#333] transition-all duration-300 active:scale-95"
      >
        {STEVENAGE_IMG && (
          <Image
            src={STEVENAGE_IMG}
            alt={`Peckers Stevenage - Best Chicken Restaurant and Delivery in Stevenage`}
            fill
            className="object-cover transition-transform duration-700 group-active:scale-105"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <span
          className="absolute inset-0 flex items-center justify-center text-white text-[10vw] md:text-[7vw] uppercase tracking-wide font-semibold drop-shadow-lg"
          style={{ fontFamily: "var(--font-peakers)" }}
        >
          {stevenage?.name || "Stevenage"}
        </span>
      </Link>

      {/* Stevenage Desktop & Laptop */}
      <Link
        href="/stevenage"
        className="coop-card group hidden lg:flex relative w-[31vw] xl:w-[37vw] h-[22vw] xl:h-[19vw] items-center justify-center rounded-[1.5vw] xl:rounded-lg overflow-hidden shadow-lg bg-black/40 transition-all duration-500 hover:opacity-90 hover:scale-[1.01]"
      >
        {STEVENAGE_IMG && (
          <Image
            src={STEVENAGE_IMG}
            alt={`Peckers Stevenage - Top Rated Peri Peri Grilled Chicken and Food Hertfordshire`}
            fill
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="35vw"
          />
        )}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
        <span
          className="relative z-10 text-white text-[3vw] xl:text-[2.6vw] drop-shadow-lg uppercase font-semibold"
          style={{ fontFamily: "var(--font-peakers)" }}
        >
          {stevenage?.name || "Stevenage"}
        </span>
      </Link>

      {/* Third Card */}
      <div className="coop-card w-full md:w-full lg:w-[31vw] xl:w-[35vw] h-[60vw] md:h-[36vw] lg:h-[22vw] xl:h-[19vw] bg-[#2222] rounded-[3vw] md:rounded-[2vw] lg:rounded-[1.5vw] xl:rounded-lg flex flex-col items-center justify-center border border-[#383838] px-[4vw] md:px-[6vw] lg:px-[2vw] xl:px-[1vw] py-[6vw] md:py-[4vw] lg:py-[1.5vw] xl:py-[1vw] relative overflow-hidden">
        {!submitted ? (
          <>
            <span
              className="text-white font-bold text-[7vw] md:text-[4.5vw] lg:text-[3.2vw] xl:text-[2.5vw] mb-[4vw] md:mb-[3vw] lg:mb-[2vw] xl:mb-[1.5vw] text-center tracking-wide"
              style={{ fontFamily: "var(--font-peakers)" }}
            >
              WE’RE EXPANDING
            </span>

            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col items-center"
            >
              <input
                type="text"
                placeholder="Suggest our next town… "
                value={town}
                onChange={(e) => setTown(e.target.value)}
                disabled={isSubmitting}
                className="w-[85%] md:w-[90%] lg:w-[85%] xl:w-[70%] bg-transparent border border-[#383838] rounded-md text-center text-white font-mono py-[3vw] md:py-[2.5vw] lg:py-[1.2vw] xl:py-[0.7vw] px-[4vw] md:px-[4vw] lg:px-[2vw] xl:px-[1vw] mb-[4vw] md:mb-[4vw] lg:mb-[2vw] xl:mb-[1.6vw] placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-white transition-all text-[4vw] md:text-[2.2vw] lg:text-[1.3vw] xl:text-[1vw] disabled:opacity-50"
                required
                suppressHydrationWarning
              />

              <button
                type="submit"
                disabled={isSubmitting || !town.trim()}
                className="w-[60%] md:w-[70%] lg:w-[65%] xl:w-[60%] py-[3vw] md:py-[2.5vw] lg:py-[0.8vw] xl:py-[0.2vw] border-2 border-[#383838] rounded-[4vw] md:rounded-[2vw] lg:rounded-[1.5vw] xl:rounded-[1vw] text-white font-mono text-[4vw] md:text-[2.2vw] lg:text-[1.5vw] xl:text-[1.2vw] tracking-widest transition-all bg-[#1111] hover:shadow-[0.4vw_0.4vw_0px_white] disabled:opacity-50 disabled:hover:shadow-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    SENDING...
                  </>
                ) : (
                  "SEND"
                )}
              </button>
              {error && (
                <p className="text-red-500 text-[3vw] lg:text-[1vw] mt-2 font-mono uppercase">
                  {error}
                </p>
              )}
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-700">
            <div className="w-[15vw] h-[15vw] lg:w-[5vw] lg:h-[5vw] bg-white text-black rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <svg
                width="60%"
                height="60%"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 13L9 17L19 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              className="text-white text-[7vw] md:text-[8vw] lg:text-[2.5vw] xl:text-[2vw] mb-2 tracking-wide"
              style={{ fontFamily: "var(--font-peakers)" }}
            >
              THANK YOU!
            </span>
            <p className="text-gray-400 font-mono text-[3.5vw] lg:text-[1.1vw] xl:text-[0.9vw] max-w-[80%] uppercase">
              We'll consider <span className="text-white">{town}</span> for
              our next location.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setTown("");
              }}
              className="mt-6 text-gray-500 hover:text-white transition-colors text-[3vw] lg:text-[0.8vw] font-mono uppercase underline decoration-1 underline-offset-4"
            >
              Suggest another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
