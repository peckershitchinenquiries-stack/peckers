import Link from "next/link";
import React from "react";
import {
  TbUserPlus,
  TbWallet,
  TbReceipt,
  TbLockOpen,
  TbConfetti,
  TbCircleCheck,
  TbCake,
  TbGift,
  TbSparkles,
  TbTag,
  TbBellRinging,
  TbMail,
} from "react-icons/tb";

import OrderButtons from "./OrderButtons";
import RewardsRoadmap from "./RewardsRoadmap";

import { buildPageMetadata } from "../lib/seo";

export async function generateMetadata({ searchParams }) {
  return buildPageMetadata({
    searchParams,
    title: "Peckers Rewards | Join the Inner Circle",
    description:
      "Join the Peckers Inner Circle and earn Chicken Heads every time you order. Unlock free sides, mains, and full meals as you level up.",
    keywords: [
      "Peckers rewards",
      "chicken loyalty program UK",
      "Peckers Inner Circle",
      "earn rewards chicken",
      "chicken points program Hertfordshire",
      "best chicken loyalty scheme UK",
      "Peckers Chicken Heads",
      "free food chicken Stevenage",
      "free food chicken Hitchin",
    ],
    path: "/rewards",
  });
}

const imgHero =
  "https://ehtazgziwtjqm5ww.public.blob.vercel-storage.com/REWARDS%20PAGE%20ICONS/Rewards%20page%20hero%20section.webp";
const imgRecruit =
  "https://ehtazgziwtjqm5ww.public.blob.vercel-storage.com/REWARDS%20PAGE%20ICONS/recruit.png";
const imgBeta =
  "https://ehtazgziwtjqm5ww.public.blob.vercel-storage.com/REWARDS%20PAGE%20ICONS/We%20Help%20Small%20Businesses%20%287%29%201.png";
const imgGamma =
  "https://ehtazgziwtjqm5ww.public.blob.vercel-storage.com/REWARDS%20PAGE%20ICONS/We%20Help%20Small%20Businesses%20%288%29%201%20%281%29.png";
const imgAlpha =
  "https://ehtazgziwtjqm5ww.public.blob.vercel-storage.com/REWARDS%20PAGE%20ICONS/We%20Help%20Small%20Businesses%20%289%29%201.png";

const tiers = [
  { name: "RECRUIT", img: imgRecruit, border: "#d4a838" },
  { name: "GAMMA", img: imgBeta, border: "#9b1c1c" },
  { name: "BETA", img: imgGamma, border: "#e07820" },
  { name: "ALPHA", img: imgAlpha, border: "#c82b3a" },
];

const benefits = [
  {
    title: "Earn on every order",
    desc: "Spend £12 or more in a single visit and bag a Chicken Head.",
  },
  {
    title: "Redeem in-store or online",
    desc: "Use your rewards eat-in, via Click & Collect, or on website orders.",
  },
  {
    title: "Rewards valid 30 days",
    desc: "Plenty of time to come back and put your hard-earned heads to work.",
  },
];

export default function RewardsPage() {
  const showComingSoon = false;

  if (showComingSoon) {
    return (
      <div className="bg-[#141311] min-h-screen text-white w-full overflow-hidden flex items-center justify-center p-4 xl:p-12 mb-16 lg:mb-32">
        <div className="bg-[#1c1b19] border-[2px] border-[#222] rounded-[27px] w-full relative overflow-hidden py-24 md:py-32 flex flex-col items-center justify-center max-w-7xl mt-20">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] md:text-[360px] text-white/[0.03] whitespace-nowrap select-none overflow-hidden"
            style={{ fontFamily: "var(--font-peakers-bold)" }}
          >
            PECKERS
          </div>

          <div className="relative z-10 flex flex-col items-center gap-6 px-4 text-center max-w-5xl">
            <h1
              className="text-white text-5xl sm:text-[80px] md:text-[100px] leading-[0.9] uppercase"
              style={{
                fontFamily: "var(--font-peakers-bold)",
                letterSpacing: "0.02em",
              }}
            >
              BE PART OF THE <span className="text-[#C41718]">PECKERS</span>{" "}
              INNER CIRCLE
            </h1>

            <h2
              className="text-white text-3xl sm:text-[40px] md:text-[60px] leading-[1] uppercase mt-2"
              style={{
                fontFamily: "var(--font-peakers-bold)",
                letterSpacing: "0.02em",
              }}
            >
              LAUNCHING TOMORROW <span className="text-[#C41718]">-</span> STAY
              TUNED.
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#141311] min-h-screen text-white w-full overflow-hidden">
      {/* 1. Hero Section — fixed height for consistency across all devices */}
      <section className="relative w-full h-[680px] md:h-[720px] lg:h-[760px] flex items-center justify-center -mt-[80px] pt-[80px] px-6 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={imgHero}
            className="w-full h-full object-cover opacity-50"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#141311] via-[#141311]/70 to-[#141311]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#141311] via-transparent to-[#141311]"></div>
        </div>

        {/* PECKERS watermark behind */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[140px] sm:text-[220px] md:text-[300px] lg:text-[380px] text-white/[0.025] whitespace-nowrap select-none pointer-events-none leading-none"
          style={{ fontFamily: "var(--font-peakers-bold)" }}
        >
          PECKERS
        </div>

        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_35%,_#141311_85%)] pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-[1000px] mx-auto">
          {/* Eyebrow with side rules */}
          <div className="flex items-center gap-4 mb-5 md:mb-6">
            <span className="hidden sm:block h-px w-10 bg-[#d4a838]/60"></span>
            <p
              className="text-[#d4a838] tracking-[5.8px] text-xs sm:text-sm md:text-base font-bold uppercase"
              style={{ fontFamily: "var(--font-peakers)" }}
            >
              THE INNER CIRCLE
            </p>
            <span className="hidden sm:block h-px w-10 bg-[#d4a838]/60"></span>
          </div>

          {/* Headline */}
          <h1
            className="text-[#e6e2de] text-5xl sm:text-7xl md:text-[100px] lg:text-[120px] leading-[0.88] uppercase mb-8 md:mb-10 flex flex-col items-center"
            style={{ fontFamily: "var(--font-peakers-bold)" }}
          >
            <span>
              COLLECT <span className="text-[#9b091b]">CHICKEN</span>
            </span>
            <span>HEAD STAMPS</span>
          </h1>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8 mb-10 md:mb-14">
            <Link
              href="https://peckers.vmos.io/account/auth/register"
              target="_blank"
              className="bg-[#9a081c] hover:bg-[#b00a23] transition-colors text-white text-sm md:text-base tracking-[2.5px] px-12 py-4 rounded-full font-bold uppercase cursor-pointer shadow-[0_10px_40px_-10px_rgba(154,8,28,0.6)]"
              style={{ fontFamily: "var(--font-peakers)" }}
            >
              JOIN NOW
            </Link>
            <Link
              href="https://peckers.vmos.io/account/auth/login"
              target="_blank"
              className="text-[#e6e2de] hover:text-white text-sm md:text-base tracking-[1.5px] uppercase underline underline-offset-[6px] decoration-[#d4a838]/60 hover:decoration-[#d4a838] transition-colors"
              style={{ fontFamily: "var(--font-peakers)" }}
            >
              I&apos;m already a member
            </Link>
          </div>

          {/* Tier preview row */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-10">
            {tiers.map((t, i) => (
              <React.Fragment key={t.name}>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="bg-[#0f0e0c] rounded-full p-2 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border-2"
                    style={{ borderColor: t.border }}
                  >
                    <img
                      src={t.img}
                      className="w-6 sm:w-7 object-contain"
                      alt={t.name}
                    />
                  </div>
                  <p
                    className="text-[#a1a1aa] text-[10px] sm:text-xs font-bold tracking-[2px] uppercase"
                    style={{ fontFamily: "var(--font-peakers-bold)" }}
                  >
                    {t.name}
                  </p>
                </div>
                {i < tiers.length - 1 && (
                  <span className="hidden sm:block w-5 md:w-10 h-px bg-white/15 mb-5"></span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORK$ */}
      <section className="bg-[#1c1b19] px-6 py-12 md:py-16 md:px-12 lg:px-20">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-10 md:gap-14">
          <div
            className="border-l-[8px] border-[#e51a38] pl-6 text-white text-5xl md:text-[72px] leading-none uppercase"
            style={{ fontFamily: "var(--font-peakers-bold)" }}
          >
            HOW IT WORK$
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
            {/* Step 1 */}
            <div className="bg-[#211f1d] rounded-xl px-8 py-4 flex flex-col gap-4 relative overflow-hidden">
              <div className="bg-[#d4a838] w-14 h-14 rounded-lg flex items-center justify-center relative z-10">
                <TbUserPlus className="text-black text-2xl" />
              </div>
              <TbUserPlus className="absolute -top-4 -right-8 text-[140px] text-white/[0.04] pointer-events-none z-0" />
              <h3
                className="text-[#e6e2de] text-2xl md:text-xl xl:text-lg uppercase mt-2 relative z-10 whitespace-nowrap"
                style={{ fontFamily: "var(--font-peakers-bold)" }}
              >
                JOIN
              </h3>
              <p
                className="text-[#a1a1aa] text-base leading-relaxed relative z-10"
                style={{ fontFamily: "var(--font-neuzeit)" }}
              >
                Sign up online in seconds to become a member of the Peckers
                Inner Circle.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#211f1d] rounded-xl px-8 py-4 flex flex-col gap-4 relative overflow-hidden">
              <div className="bg-[#9b1c1c] w-14 h-14 rounded-lg flex items-center justify-center relative z-10">
                <TbWallet className="text-[#141311] text-2xl" />
              </div>
              <h3
                className="text-[#e6e2de] text-2xl md:text-xl xl:text-lg uppercase mt-2 relative z-10 whitespace-nowrap"
                style={{ fontFamily: "var(--font-peakers-bold)" }}
              >
                ADD TO WALLET
              </h3>
              <p
                className="text-[#a1a1aa] text-base leading-relaxed relative z-10"
                style={{ fontFamily: "var(--font-neuzeit)" }}
              >
                Add your card to DIGITAL WALLET for easy scanning, or use your
                MEMBER CODE online.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#211f1d] rounded-xl px-8 py-4 flex flex-col gap-4 relative overflow-hidden">
              <div className="bg-[#e07820] w-14 h-14 rounded-lg flex items-center justify-center relative z-10">
                <TbReceipt className="text-[#141311] text-2xl" />
              </div>
              <h3
                className="text-[#e6e2de] text-2xl md:text-xl xl:text-lg uppercase mt-2 relative z-10 whitespace-nowrap"
                style={{ fontFamily: "var(--font-peakers-bold)" }}
              >
                EARN CHICKEN HEADS
              </h3>
              <p
                className="text-[#a1a1aa] text-base leading-relaxed relative z-10"
                style={{ fontFamily: "var(--font-neuzeit)" }}
              >
                Get one every day you spend 12 OR MORE. Valid for Eat in, Click
                & Collect, or Website orders.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#211f1d] rounded-xl px-8 py-4 flex flex-col gap-4 relative overflow-hidden">
              <div className="bg-[#c82b3a] w-14 h-14 rounded-lg flex items-center justify-center relative z-10">
                <TbLockOpen className="text-[#141311] text-2xl" />
              </div>
              <h3
                className="text-[#e6e2de] text-2xl md:text-xl xl:text-lg uppercase mt-2 relative z-10 whitespace-nowrap"
                style={{ fontFamily: "var(--font-peakers-bold)" }}
              >
                UNLOCK
              </h3>
              <p
                className="text-[#a1a1aa] text-base leading-relaxed relative z-10"
                style={{ fontFamily: "var(--font-neuzeit)" }}
              >
                Collect Chicken heads to level up: GAMMA Free side | BETA Free
                main | ALPHA Free Meal
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-[#9a091c] rounded-xl px-8 py-4 flex flex-col gap-4 relative overflow-hidden">
              <div className="bg-white w-14 h-14 rounded-lg flex items-center justify-center relative z-10">
                <TbConfetti className="text-[#9a091c] text-3xl" />
              </div>
              <h3
                className="text-[#e6e2de] text-2xl md:text-xl xl:text-lg uppercase mt-2 relative z-10 whitespace-nowrap"
                style={{ fontFamily: "var(--font-peakers-bold)" }}
              >
                REDEEM
              </h3>
              <p
                className="text-[#f4f4f5] text-base leading-relaxed relative z-10"
                style={{ fontFamily: "var(--font-neuzeit)" }}
              >
                Redeem your REWARDS at checkout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE CHICKEN HEADS TIER SYSTEM — original Figma roadmap, animations stripped */}
      <section className="bg-[#141311] py-12 md:py-16 px-3 sm:px-4 md:px-6 border-t border-t-white/5 relative">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-2 sm:mb-3 md:mb-4 px-2 sm:px-0 items-center">
            <div className="flex flex-col gap-2 text-center md:text-left">
              <h2
                className="text-[#e6e2de] text-3xl sm:text-4xl md:text-5xl lg:text-[64px] leading-none uppercase"
                style={{ fontFamily: "var(--font-peakers-bold)" }}
              >
                THE CHICKEN HEADS
                <br />
                <span className="text-[#d8192a]">TIER SYSTEM</span>
              </h2>
            </div>
            <div
              className="border border-white/20 rounded-md px-4 sm:px-5 py-2 sm:py-2.5 text-white text-xs sm:text-sm tracking-[2px] uppercase whitespace-nowrap self-start md:self-auto"
              style={{ fontFamily: "var(--font-peakers-bold)" }}
            >
              10 HEADS = ALPHA STATUS
            </div>
          </div>
          <div className="px-0 sm:px-2 md:px-0 w-full">
            <RewardsRoadmap />
          </div>
        </div>
      </section>

      {/* 4. YOUR CHICKEN HEADS. YOUR CALL. — benefits checklist */}
      <section className="bg-[#0f0e0c] px-6 py-12 md:py-16 md:px-12 lg:px-20">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="flex flex-col gap-8">
            <h2
              className="text-[#e6e2de] text-5xl sm:text-[64px] md:text-[72px] leading-none uppercase"
              style={{ fontFamily: "var(--font-peakers-bold)" }}
            >
              YOUR CHICKEN HEADS.
              <br />
              <span className="text-[#d8192a]">YOUR CALL.</span>
            </h2>
            <p
              className="text-[#a1a1aa] text-lg sm:text-[20px] max-w-[520px] leading-relaxed"
              style={{ fontFamily: "var(--font-neuzeit)" }}
            >
              Earn rewards and use them however you like, stick with your favourites or discover something new. Sign up today and start collecting Chicken Heads to unlock more!
            </p>
            <p
              className="text-[#a1a1aa] text-base sm:text-lg max-w-[520px] leading-relaxed"
              style={{ fontFamily: "var(--font-neuzeit)" }}
            >
              <span className="text-[#e6e2de] font-bold" style={{ fontFamily: "var(--font-peakers-bold)" }}>How to redeem:</span> Just add your choice of food to your cart and scan your loyalty card or enter your member code at checkout.
            </p>
            <OrderButtons />
          </div>

          <div className="flex flex-col gap-4">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="flex items-start gap-5 bg-[#1c1b19] border border-white/5 rounded-2xl px-6 py-5 hover:border-[#d8192a]/40 transition-colors"
              >
                <div className="shrink-0 w-11 h-11 rounded-full bg-[#9a081c]/15 border border-[#9a081c]/40 flex items-center justify-center">
                  <TbCircleCheck className="text-[#d8192a] text-2xl" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3
                    className="text-[#e6e2de] text-xl uppercase tracking-wide"
                    style={{ fontFamily: "var(--font-peakers-bold)" }}
                  >
                    {b.title}
                  </h3>
                  <p
                    className="text-[#a1a1aa] text-base leading-relaxed"
                    style={{ fontFamily: "var(--font-neuzeit)" }}
                  >
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BIRTHDAY PERK */}
      <section className="bg-[#141311] px-4 sm:px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <div className="max-w-[1240px] mx-auto">
          <div className="relative grid grid-cols-1 lg:grid-cols-2 lg:min-h-[520px] rounded-[27px] overflow-hidden border border-white/5">
            {/* Left — cream side */}
            <div className="bg-[#f3ece2] p-10 sm:p-14 md:p-16 flex flex-col justify-center gap-6">
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#9a081c]/60"></span>
                <p
                  className="text-[#9a081c] tracking-[4px] text-xs sm:text-sm font-bold uppercase"
                  style={{ fontFamily: "var(--font-peakers)" }}
                >
                  BIRTHDAY PERK
                </p>
              </div>
              <h2
                className="text-[#1c1b19] text-4xl sm:text-5xl md:text-[64px] leading-[0.95] uppercase"
                style={{ fontFamily: "var(--font-peakers-bold)" }}
              >
                Free churros
                <br />
                on your birthday
              </h2>
              <p
                className="text-[#3a3733] text-base sm:text-lg leading-relaxed max-w-[460px]"
                style={{ fontFamily: "var(--font-neuzeit)" }}
              >
                Celebrate your birthday the PECKERS way. Join our loyalty
                program, add your birthday, and enjoy free churros on your
                special day.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-2">
                <Link
                  href="https://peckers.vmos.io/account/auth/register"
                  target="_blank"
                  className="bg-[#9a081c] hover:bg-[#b00a23] transition-colors text-white text-sm md:text-base tracking-[2.5px] px-10 py-4 rounded-full font-bold uppercase shadow-[0_10px_40px_-12px_rgba(154,8,28,0.5)] text-center"
                  style={{ fontFamily: "var(--font-peakers)" }}
                >
                  JOIN NOW & CLAIM
                </Link>
                <span
                  className="text-[#6b6660] text-[10px] sm:text-xs tracking-[2px] uppercase"
                  style={{ fontFamily: "var(--font-peakers)" }}
                >
                  Peckers Inner Circle members only*
                </span>
              </div>
            </div>

            {/* Curved cream divider — bulges from cream side into the burgundy half on lg+ */}
            <div className="hidden lg:block absolute inset-y-0 left-1/2 w-16 pointer-events-none z-10">
              <svg className="h-full w-full" viewBox="0 0 64 460" preserveAspectRatio="none">
                <path d="M0 0 Q64 230 0 460 Z" fill="#f3ece2" />
              </svg>
            </div>

            {/* Right — burgundy celebration side */}
            <div className="relative bg-gradient-to-br from-[#9a081c] via-[#7a0617] to-[#5c0411] p-10 sm:p-14 md:p-16 min-h-[340px] md:min-h-[460px] flex items-center justify-center overflow-hidden">
              {/* Decorative watermark */}
              <div
                className="absolute -top-6 -left-4 text-[140px] md:text-[220px] text-white/[0.04] whitespace-nowrap select-none pointer-events-none leading-none"
                style={{ fontFamily: "var(--font-peakers-bold)" }}
              >
                HAPPY
              </div>
              <div
                className="absolute -bottom-10 -right-2 text-[140px] md:text-[220px] text-white/[0.04] whitespace-nowrap select-none pointer-events-none leading-none"
                style={{ fontFamily: "var(--font-peakers-bold)" }}
              >
                B-DAY
              </div>

              {/* Floating sparkles */}
              <TbSparkles className="absolute top-10 left-12 text-[#d4a838] text-3xl md:text-4xl opacity-80" />
              <TbSparkles className="absolute bottom-14 right-10 text-[#d4a838] text-2xl md:text-3xl opacity-70" />
              <TbConfetti className="absolute top-16 right-14 text-[#f3ece2] text-3xl md:text-4xl opacity-50 rotate-12" />
              <TbGift className="absolute bottom-10 left-14 text-[#f3ece2] text-3xl md:text-4xl opacity-40 -rotate-12" />

              {/* Center cake icon stack */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="bg-[#f3ece2] w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center shadow-[0_20px_60px_-10px_rgba(0,0,0,0.4)] border-4 border-[#d4a838]">
                  <TbCake className="text-[#9a081c] text-6xl sm:text-7xl md:text-8xl" />
                </div>
                <p
                  className="text-[#d4a838] tracking-[6px] text-sm md:text-base font-bold uppercase mt-2"
                  style={{ fontFamily: "var(--font-peakers-bold)" }}
                >
                  + EXCLUSIVE REWARDS
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EXCLUSIVE OFFERS */}
      <section className="bg-[#141311] px-4 sm:px-6 md:px-12 lg:px-20 pb-12 md:pb-16">
        <div className="max-w-[1240px] mx-auto">
          <div className="relative grid grid-cols-1 lg:grid-cols-2 lg:min-h-[520px] rounded-[27px] overflow-hidden border border-white/5">
            {/* Left — burgundy visual side */}
            <div className="relative bg-gradient-to-br from-[#9a081c] via-[#7a0617] to-[#5c0411] p-10 sm:p-14 md:p-16 min-h-[340px] md:min-h-[460px] flex items-center justify-center overflow-hidden order-2 lg:order-1">
              {/* Decorative watermark */}
              <div
                className="absolute -top-6 -left-4 text-[140px] md:text-[220px] text-white/[0.04] whitespace-nowrap select-none pointer-events-none leading-none"
                style={{ fontFamily: "var(--font-peakers-bold)" }}
              >
                PERKS
              </div>
              <div
                className="absolute -bottom-10 -right-2 text-[140px] md:text-[220px] text-white/[0.04] whitespace-nowrap select-none pointer-events-none leading-none"
                style={{ fontFamily: "var(--font-peakers-bold)" }}
              >
                ONLY
              </div>

              {/* Floating sparkles & icons */}
              <TbSparkles className="absolute top-10 left-12 text-[#d4a838] text-3xl md:text-4xl opacity-80" />
              <TbSparkles className="absolute bottom-14 right-10 text-[#d4a838] text-2xl md:text-3xl opacity-70" />
              <TbTag className="absolute top-16 right-14 text-[#f3ece2] text-3xl md:text-4xl opacity-50 -rotate-12" />
              <TbBellRinging className="absolute bottom-10 left-14 text-[#f3ece2] text-3xl md:text-4xl opacity-40 rotate-12" />

              {/* Center icon */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="bg-[#f3ece2] w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center shadow-[0_20px_60px_-10px_rgba(0,0,0,0.4)] border-4 border-[#d4a838]">
                  <TbGift className="text-[#9a081c] text-6xl sm:text-7xl md:text-8xl" />
                </div>
                <p
                  className="text-[#d4a838] tracking-[6px] text-sm md:text-base font-bold uppercase mt-2"
                  style={{ fontFamily: "var(--font-peakers-bold)" }}
                >
                  + SURPRISE DROPS
                </p>
              </div>
            </div>

            {/* Curved cream divider — bulges from cream side into the burgundy half on lg+ */}
            <div className="hidden lg:block absolute inset-y-0 left-1/2 w-16 -translate-x-full pointer-events-none z-10">
              <svg className="h-full w-full" viewBox="0 0 64 460" preserveAspectRatio="none">
                <path d="M64 0 Q0 230 64 460 Z" fill="#f3ece2" />
              </svg>
            </div>

            {/* Right — cream text side */}
            <div className="bg-[#f3ece2] p-10 sm:p-14 md:p-16 flex flex-col justify-center gap-6 order-1 lg:order-2">
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#9a081c]/60"></span>
                <p
                  className="text-[#9a081c] tracking-[4px] text-xs sm:text-sm font-bold uppercase"
                  style={{ fontFamily: "var(--font-peakers)" }}
                >
                  EXCLUSIVE PERKS
                </p>
              </div>
              <h2
                className="text-[#1c1b19] text-4xl sm:text-5xl md:text-[64px] leading-[0.95] uppercase"
                style={{ fontFamily: "var(--font-peakers-bold)" }}
              >
                Exclusive offers,
                <br />
                just for you
              </h2>
              <p
                className="text-[#3a3733] text-base sm:text-lg leading-relaxed max-w-[460px]"
                style={{ fontFamily: "var(--font-neuzeit)" }}
              >
                Opt in to our marketing emails when you join the Peckers Inner
                Circle, and unlock surprise drops, payday deals, and unexpected
                free food year-round.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-2">
                <Link
                  href="https://peckers.vmos.io/account/auth/register"
                  target="_blank"
                  className="bg-[#9a081c] hover:bg-[#b00a23] transition-colors text-white text-sm md:text-base tracking-[2.5px] px-10 py-4 rounded-full font-bold uppercase shadow-[0_10px_40px_-12px_rgba(154,8,28,0.5)] text-center"
                  style={{ fontFamily: "var(--font-peakers)" }}
                >
                  JOIN & GET REWARDS
                </Link>
                <span
                  className="text-[#6b6660] text-[10px] sm:text-xs tracking-[2px] uppercase flex items-center gap-2"
                  style={{ fontFamily: "var(--font-peakers)" }}
                >
                  <TbMail className="text-[#9a081c] text-sm" />
                  Opt-in required
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
