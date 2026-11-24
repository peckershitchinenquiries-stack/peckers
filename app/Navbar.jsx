"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Script from "next/script";
import { FaChevronDown } from "react-icons/fa";
import HeaderActionButton from "./components/HeaderActionButton";
import FestiveHat from "./components/FestiveHat";
import { client } from "../sanity/lib/client";

import { urlFor } from "../sanity/lib/image";

export default function Navbar({ preloadedSettings = null }) {
  const [settings, setSettings] = useState(preloadedSettings);
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [locationsOpen, setLocationsOpen] = useState(false);
  const [journeyOpen, setJourneyOpen] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      if (pathname === "/" || pathname === "/home") {
        setIsHeroVisible(window.scrollY < window.innerHeight * 0.85);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Close mobile menu and dropdowns on page navigation or outside click
  useEffect(() => {
    const handleNavigation = () => {
      setOpen(false);
      setLocationsOpen(false);
      setJourneyOpen(false);
    };

    const handleClickOutside = (e) => {
      // If the click is outside the navbar, close all dropdowns
      if (!e.target.closest("#main-navbar")) {
        handleNavigation();
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    handleNavigation(); // Initial close on pathname change

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pathname]);

  useEffect(() => {
    if (settings) return; // Skip if already loaded

    const fetchSettings = async () => {
      try {
        const data = await client.fetch(`*[_type == "siteSettings"][0]`);
        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error("Error fetching site settings:", error);
      }
    };
    fetchSettings();
  }, [settings]);

  const logoUrl = settings?.logo ? urlFor(settings.logo).url() : null;

  const trackOutboundClick = (buttonName, destinationUrl) => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "outbound_click", {
        button_name: buttonName,
        destination_url: destinationUrl,
      });
    }
  };

  return (
    <nav
      id="main-navbar"
      className={`sticky top-0 z-9999 flex items-center md:px-[1vw] lg:px-[2.5vw] xl:px-[1.8vw] bg-black text-white font-sans transition-all duration-300 ease-in-out ${scrolled
        ? "py-2 md:py-[0.5vw] lg:py-[0.6vw] xl:py-[0.2vw]"
        : "py-4 md:py-[1.2vw] lg:py-[1.5vw] xl:py-[.4vw]"
        }`}
    >
      {/* Logo Section */}
      <div className="flex-1 flex items-center z-50 px-4 md:px-0">
        <Link
          href="/home"
          onClick={() => setOpen(false)}
          // containerType lets FestiveHat measure this box's height in CSS, so
          // it can work out where the logo artwork actually lands inside it.
          style={{ containerType: "size" }}
          className={`relative block transition-all duration-300 ease-in-out ${scrolled
            ? "w-[110px] md:w-[100px] lg:w-[120px] xl:w-[180px] h-[38px] md:h-[42px] lg:h-[50px] xl:h-[58px]"
            : "w-[140px] md:w-[130px] lg:w-[160px] xl:w-[240px] h-[50px] md:h-[60px] lg:h-[70px] xl:h-[82px]"
            }`}
        >
          <Image
            src="/Peckers Logo 1 [Vectorized].svg"
            alt="Peckers Logo"
            fill
            className="object-contain z-[2]"
            priority
          />
          <FestiveHat />
        </Link>
      </div>

      {/* Desktop Center Links */}
      <div
        className="hidden md:flex flex-1 md:mr-[3vw] lg:mr-[4vw] xl:mr-[1.5vw] md:text-[13px] lg:text-[1.2vw] xl:text-[1.3vw] justify-center md:tracking-[.03vw] lg:tracking-[.12vw] xl:tracking-[.15vw] font-semibold md:gap-[1.4vw] lg:gap-[1.8vw] xl:gap-[2vw]"
        style={{ fontFamily: "var(--font-peakers)" }}
      >
        <Link href="/menu" className="whitespace-nowrap navbar-link">
          MENU
        </Link>
        <div
          className="relative group"
          onClick={() => {
            if (window.innerWidth < 1024) {
              setLocationsOpen(!locationsOpen);
              setJourneyOpen(false);
            }
          }}
        >
          <span className="whitespace-nowrap cursor-pointer md:cursor-default navbar-link">
            <span className="flex items-center gap-1.5">
              FIND US
              <FaChevronDown className={`text-[0.65em] transition-transform duration-300 opacity-80 ${locationsOpen ? "rotate-180" : "group-hover:rotate-180"}`} />
            </span>
          </span>
          <div className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 transition-all duration-200 z-50 ${locationsOpen ? "opacity-100 visible" : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"}`}>
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg py-2 shadow-xl md:min-w-[150px] lg:min-w-[180px] xl:min-w-[200px]">
              <Link
                href="/hitchin"
                className="block px-5 py-3 hover:bg-[#262626] whitespace-nowrap md:text-[1.3vw] lg:text-[1.5vw] xl:text-[1.5vw] font-semibold tracking-[.2vw]"
              >
                Hitchin
              </Link>
              <Link
                href="/stevenage"
                className="block px-5 py-3 hover:bg-[#262626] whitespace-nowrap md:text-[1.3vw] lg:text-[1.5vw] xl:text-[1.5vw] font-semibold tracking-[.2vw]"
              >
                Stevenage
              </Link>
            </div>
          </div>
        </div>
        <div
          className="relative group"
          onClick={() => {
            if (window.innerWidth < 1024) {
              setJourneyOpen(!journeyOpen);
              setLocationsOpen(false);
            }
          }}
        >
          <span className="whitespace-nowrap cursor-pointer md:cursor-default navbar-link">
            <span className="flex items-center gap-1.5">
              OUR SECRET
              <FaChevronDown className={`text-[0.65em] transition-transform duration-300 opacity-80 ${journeyOpen ? "rotate-180" : "group-hover:rotate-180"}`} />
            </span>
          </span>
          <div className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 transition-all duration-200 z-50 ${journeyOpen ? "opacity-100 visible" : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"}`}>
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg py-2 shadow-xl md:min-w-[180px] lg:min-w-[220px] xl:min-w-[250px]">
              <Link
                href="/house-made-sauces"
                className="block px-5 py-3 hover:bg-[#262626] whitespace-nowrap md:text-[1.3vw] lg:text-[1.5vw] xl:text-[1.5vw] font-semibold tracking-[.2vw]"
              >
                House-Made Sauces
              </Link>
              <Link
                href="/the-peckers-standard"
                className="block px-5 py-3 hover:bg-[#262626] whitespace-nowrap md:text-[1.3vw] lg:text-[1.5vw] xl:text-[1.5vw] font-semibold tracking-[.2vw]"
              >
                The Peckers Standard
              </Link>
            </div>
          </div>
        </div>
        <Link href="/rewards" className="whitespace-nowrap navbar-link">
          REWARDS
        </Link>
        <Link href="/the-journey" className="whitespace-nowrap navbar-link">
          THE JOURNEY
        </Link>
        <Link
          href="/careers"
          className="whitespace-nowrap navbar-link mr-[0.7vw] lg:mr-[0.9vw] xl:mr-[1.6vw]"
        >
          CAREERS
        </Link>
      </div>

      {/* Desktop Buttons */}
      <div
        className="hidden md:flex flex-1 justify-end md:gap-[1vw] lg:gap-[1.5vw] xl:gap-[1.2vw]"
        style={{ fontFamily: "var(--font-neuzeit)" }}
      >
        <HeaderActionButton
          href="https://peckers.vmos.io/store/store-selection?app=online"
          onClick={() => trackOutboundClick("Click & Collect", "https://peckers.vmos.io/store/store-selection?app=online")}
          className="md:w-[140px] lg:w-[170px] xl:w-[200px] md:h-[38px] lg:h-[42px] xl:h-[42px] md:text-[1.2vw] lg:text-[1.3vw] xl:text-[1.15vw] whitespace-nowrap font-black xl:pt-[5px]"
          bgColor="bg-white"
          textColor="text-black"
          borderColor="border-white"
          shimmerColor="bg-red-600"
        >
          CLICK & COLLECT
        </HeaderActionButton>

        <HeaderActionButton
          href="https://peckers.vmos.io/store/store-selection?app=delivery"
          onClick={() => trackOutboundClick("Delivery", "https://peckers.vmos.io/store/store-selection?app=delivery")}
          className="flex items-center gap-2 md:w-[140px] lg:w-[170px] xl:w-[200px] md:h-[38px] lg:h-[42px] xl:h-[42px] md:text-[1.2vw] lg:text-[1.3vw] xl:text-[1.15vw] whitespace-nowrap hover:bg-red-700 font-black xl:pt-[5px]"
          bgColor="bg-red-600"
          textColor="text-white"
          borderColor="border-red-600"
          shimmerColor="bg-white"
        >
          <svg
            width="20"
            height="13"
            viewBox="0 0 17 11"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[1.2vw] h-auto"
          >
            <path d="M13.5527 3.375C15.3984 3.40137 16.9014 4.9043 16.9277 6.72363C16.9277 8.62207 15.3984 10.1514 13.5 10.125C11.6807 10.125 10.1777 8.62207 10.1777 6.77637C10.1514 5.74805 10.626 4.8252 11.3379 4.19238L11.0215 3.63867C9.99316 4.48242 9.49219 5.69531 9.54492 6.93457C9.54492 7.30371 9.25488 7.59375 8.91211 7.59375H6.69727C6.30176 9.07031 4.9834 10.125 3.42773 10.125C1.5293 10.125 0 8.5957 0.0527344 6.6709C0.0791016 4.9043 1.50293 3.4541 3.2959 3.40137C3.66504 3.375 4.03418 3.42773 4.37695 3.5332L4.66699 2.97949C4.42969 2.61035 4.06055 2.32031 3.42773 2.32031H1.95117C1.58203 2.32031 1.31836 2.05664 1.31836 1.71387C1.29199 1.34473 1.6084 1.05469 1.95117 1.05469H3.42773C4.87793 1.05469 5.58984 1.50293 6.03809 2.10938H10.0986L9.59766 1.26562H7.85742C7.62012 1.26562 7.43555 1.08105 7.43555 0.84375V0.421875C7.43555 0.210938 7.62012 0 7.85742 0H9.9668C10.1777 0 10.3887 0.131836 10.4941 0.316406L11.1006 1.31836L12.0762 0.210938C12.208 0.0791016 12.3662 0 12.5508 0H13.7637C14.1064 0 14.3965 0.290039 14.3965 0.632812V1.47656C14.3965 1.8457 14.1064 2.10938 13.7637 2.10938H11.5752L12.4453 3.55957C12.7881 3.4541 13.1836 3.375 13.5527 3.375ZM3.42773 8.85938C4.27148 8.85938 5.00977 8.3584 5.35254 7.59375H3.2168C2.71582 7.59375 2.42578 7.09277 2.66309 6.6709L3.74414 4.66699C3.63867 4.66699 3.5332 4.64062 3.42773 4.64062C2.24121 4.64062 1.31836 5.58984 1.31836 6.75C1.31836 7.93652 2.24121 8.85938 3.42773 8.85938ZM15.6357 6.88184C15.7148 5.66895 14.7393 4.64062 13.5527 4.66699C13.3945 4.66699 13.2627 4.66699 13.1309 4.69336L14.3965 6.8291C14.5283 7.04004 14.4492 7.30371 14.2646 7.40918L13.8955 7.62012C13.6846 7.75195 13.4473 7.67285 13.3154 7.48828L12.0234 5.2998C11.6543 5.69531 11.4434 6.19629 11.4434 6.75C11.4434 7.96289 12.4453 8.93848 13.6582 8.85938C14.7129 8.80664 15.583 7.93652 15.6357 6.88184Z" />
          </svg>
          DELIVERY
        </HeaderActionButton>
      </div>

      {/* Hamburger & Mobile CTAs */}
      <div className="md:hidden z-[100] flex items-center pr-4">
        <button
          onClick={() => setOpen(!open)}
          className="relative w-12 h-12 flex flex-col justify-center items-center focus:outline-none group"
          aria-label="Toggle Menu"
        >
          <div className="flex flex-col gap-1.5 w-8">
            <span className={`h-[3px] w-full bg-white rounded-full transition-all duration-500 ease-in-out ${open ? "rotate-45 translate-y-[9px]" : ""}`}></span>
            <span className={`h-[3px] w-3/4 self-end bg-white rounded-full transition-all duration-300 ${open ? "opacity-0 translate-x-4" : ""}`}></span>
            <span className={`h-[3px] w-full bg-white rounded-full transition-all duration-500 ease-in-out ${open ? "-rotate-45 -translate-y-[9px]" : ""}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Dropdown - Solid Black, Absolute to stay attached to header */}
      <div
        className={`absolute top-full -mt-px left-0 right-0 w-full h-auto max-h-[78vh] bg-black flex flex-col transition-[transform,opacity] duration-500 ease-in-out md:hidden z-40 overflow-y-auto overflow-x-hidden scrollbar-hide shadow-2xl rounded-b-[2.5rem] ${open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"}`}
      >
        <div className="flex flex-col px-[8vw] pt-[3vw] pb-[0.5vw] space-y-[1vw] relative min-h-[44vh]">
          {/* Decorative Background Text - Zinc Color */}
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-[0.05] select-none pointer-events-none whitespace-nowrap will-change-transform transform translate-z-0">
            <h2 className="text-[40vw] font-black italic transform -rotate-12 text-zinc-700">PECKERS</h2>
          </div>

          <div className="flex flex-col space-y-[0.2vw]">
            <Link
              href="/menu"
              onClick={() => setOpen(false)}
              className={`group flex items-center gap-[6vw] py-[2.7vw] transition-all duration-700 ${open ? "opacity-100 translate-x-0 delay-[100ms]" : "opacity-0 -translate-x-10"}`}
            >
              <span className="text-[6.5vw] font-peakers tracking-normal font-bold text-white uppercase">MENU</span>
            </Link>

            <div className={`transition-all duration-700 ${open ? "opacity-100 translate-x-0 delay-[200ms]" : "opacity-0 -translate-x-10"}`}>
              <button
                type="button"
                onClick={() => setLocationsOpen(!locationsOpen)}
                className="group flex items-center justify-between py-[4vw] w-full text-left outline-none"
              >
                <span className={`text-[7vw] font-peakers tracking-tight font-black uppercase transition-colors duration-300 ${locationsOpen ? "text-white" : "text-white"}`}>FIND US</span>
                <div className={`transition-transform duration-500 ${locationsOpen ? "rotate-180" : ""}`}>
                  <FaChevronDown className={`text-[4vw] ${locationsOpen ? "text-white" : "text-white/50"}`} />
                </div>
              </button>
              <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out will-change-[grid-template-rows,opacity] ${locationsOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-[5vw] pb-[6vw] pt-[2vw] pl-[6vw]">
                    <Link
                      href="/hitchin"
                      onClick={() => setOpen(false)}
                      className="text-[6vw] font-peakers font-bold text-white/90 hover:text-red-600 transition-colors"
                    >
                      HITCHIN
                    </Link>
                    <Link
                      href="/stevenage"
                      onClick={() => setOpen(false)}
                      className="text-[6vw] font-peakers font-bold text-white/90 hover:text-red-600 transition-colors"
                    >
                      STEVENAGE
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className={`transition-all duration-700 ${open ? "opacity-100 translate-x-0 delay-[300ms]" : "opacity-0 -translate-x-10"}`}>
              <button
                type="button"
                onClick={() => setJourneyOpen(!journeyOpen)}
                className="group flex items-center justify-between py-[4vw] w-full text-left outline-none"
              >
                <span className={`text-[7vw] font-peakers tracking-tight font-black uppercase transition-colors duration-300 ${journeyOpen ? "text-white" : "text-white"}`}>OUR SECRET</span>
                <div className={`transition-transform duration-500 ${journeyOpen ? "rotate-180" : ""}`}>
                  <FaChevronDown className={`text-[4vw] ${journeyOpen ? "text-white" : "text-white/50"}`} />
                </div>
              </button>
              <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out will-change-[grid-template-rows,opacity] ${journeyOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-[5vw] pb-[6vw] pt-[2vw] pl-[6vw]">
                    <Link
                      href="/house-made-sauces"
                      onClick={() => setOpen(false)}
                      className="text-[6vw] font-peakers font-bold text-white/90 hover:text-red-600 transition-colors"
                    >
                      HOUSE-MADE SAUCES
                    </Link>
                    <Link
                      href="/the-peckers-standard"
                      onClick={() => setOpen(false)}
                      className="text-[6vw] font-peakers font-bold text-white/90 hover:text-red-600 transition-colors"
                    >
                      THE PECKERS STANDARD
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/rewards"
              onClick={() => setOpen(false)}
              className={`group flex items-center gap-[6vw] py-[3.5vw] transition-all duration-700 ${open ? "opacity-100 translate-x-0 delay-[400ms]" : "opacity-0 -translate-x-10"}`}
            >
              <span className="text-[6.5vw] font-peakers tracking-normal font-bold text-white uppercase">REWARDS</span>
            </Link>

            <Link
              href="/the-journey"
              onClick={() => setOpen(false)}
              className={`group flex items-center gap-[6vw] py-[3.5vw] transition-all duration-700 ${open ? "opacity-100 translate-x-0 delay-[500ms]" : "opacity-0 -translate-x-10"}`}
            >
              <span className="text-[6.5vw] font-peakers tracking-normal font-bold text-white uppercase">THE JOURNEY</span>
            </Link>

            <Link
              href="/careers"
              onClick={() => setOpen(false)}
              className={`group flex items-center gap-[6vw] py-[3.5vw] transition-all duration-700 ${open ? "opacity-100 translate-x-0 delay-[600ms]" : "opacity-0 -translate-x-10"}`}
            >
              <span className="text-[6.5vw] font-peakers tracking-normal font-bold text-white uppercase">CAREERS</span>
            </Link>
          </div>

          {/* Mobile CTA Buttons */}
          {/* <div className={`flex flex-row gap-[3vw] pt-[19vw] transition-all duration-700 ${open ? "opacity-100 translate-x-0 delay-[700ms]" : "opacity-0 -translate-x-10"}`} style={{ fontFamily: "var(--font-neuzeit)" }}>
            <a
              href="https://peckers.vmos.io/store/store-selection?app=online"
              className="flex items-center justify-center flex-1 h-[12vw] bg-white text-black font-black text-[3.6vw] uppercase tracking-wider rounded-[4vw] border-2 border-white active:scale-95 transition-transform duration-150"
            >
              CLICK &amp; COLLECT
            </a>
            <a
              href="https://peckers.vmos.io/store/store-selection?app=delivery"
              className="flex items-center justify-center gap-[2.5vw] flex-1 h-[12vw] bg-red-600 text-white font-black text-[3.6vw] uppercase tracking-wider rounded-[4vw] border-2 border-red-600 active:scale-95 transition-transform duration-150"
            >
              <svg
                viewBox="0 0 17 11"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[5vw] h-auto"
              >
                <path d="M13.5527 3.375C15.3984 3.40137 16.9014 4.9043 16.9277 6.72363C16.9277 8.62207 15.3984 10.1514 13.5 10.125C11.6807 10.125 10.1777 8.62207 10.1777 6.77637C10.1514 5.74805 10.626 4.8252 11.3379 4.19238L11.0215 3.63867C9.99316 4.48242 9.49219 5.69531 9.54492 6.93457C9.54492 7.30371 9.25488 7.59375 8.91211 7.59375H6.69727C6.30176 9.07031 4.9834 10.125 3.42773 10.125C1.5293 10.125 0 8.5957 0.0527344 6.6709C0.0791016 4.9043 1.50293 3.4541 3.2959 3.40137C3.66504 3.375 4.03418 3.42773 4.37695 3.5332L4.66699 2.97949C4.42969 2.61035 4.06055 2.32031 3.42773 2.32031H1.95117C1.58203 2.32031 1.31836 2.05664 1.31836 1.71387C1.29199 1.34473 1.6084 1.05469 1.95117 1.05469H3.42773C4.87793 1.05469 5.58984 1.50293 6.03809 2.10938H10.0986L9.59766 1.26562H7.85742C7.62012 1.26562 7.43555 1.08105 7.43555 0.84375V0.421875C7.43555 0.210938 7.62012 0 7.85742 0H9.9668C10.1777 0 10.3887 0.131836 10.4941 0.316406L11.1006 1.31836L12.0762 0.210938C12.208 0.0791016 12.3662 0 12.5508 0H13.7637C14.1064 0 14.3965 0.290039 14.3965 0.632812V1.47656C14.3965 1.8457 14.1064 2.10938 13.7637 2.10938H11.5752L12.4453 3.55957C12.7881 3.4541 13.1836 3.375 13.5527 3.375ZM3.42773 8.85938C4.27148 8.85938 5.00977 8.3584 5.35254 7.59375H3.2168C2.71582 7.59375 2.42578 7.09277 2.66309 6.6709L3.74414 4.66699C3.63867 4.66699 3.5332 4.64062 3.42773 4.64062C2.24121 4.64062 1.31836 5.58984 1.31836 6.75C1.31836 7.93652 2.24121 8.85938 3.42773 8.85938ZM15.6357 6.88184C15.7148 5.66895 14.7393 4.64062 13.5527 4.66699C13.3945 4.66699 13.2627 4.66699 13.1309 4.69336L14.3965 6.8291C14.5283 7.04004 14.4492 7.30371 14.2646 7.40918L13.8955 7.62012C13.6846 7.75195 13.4473 7.67285 13.3154 7.48828L12.0234 5.2998C11.6543 5.69531 11.4434 6.19629 11.4434 6.75C11.4434 7.96289 12.4453 8.93848 13.6582 8.85938C14.7129 8.80664 15.583 7.93652 15.6357 6.88184Z" />
              </svg>
              DELIVERY
            </a>
          </div> */}

          {/* COOL DESIGN AT THE BOTTOM */}
          <div className="mt-8 pt-10 pb-4 border-t border-white/10">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex justify-between items-center w-full text-white/30 font-mono text-[2.2vw] tracking-[0.2em] uppercase">
                <span>EST. 2023</span>
                <span className="h-px flex-1 mx-6 bg-white/10" />
                <span>SERIOUSLY GOOD CHICKEN</span>
              </div>

              {/* Animated Red SVG Arrows */}
              <div className="flex justify-center items-center pb-4">
                <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2 1L7 6L2 11"
                    stroke="#EF4444"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-pulse"
                  />
                  <path
                    d="M10 1L15 6L10 11"
                    stroke="#EF4444"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-pulse delay-75"
                  />
                  <path
                    d="M30 1L25 6L30 11"
                    stroke="#EF4444"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-pulse"
                  />
                  <path
                    d="M38 1L33 6L38 11"
                    stroke="#EF4444"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-pulse delay-75"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* White Strip (Conditionally shown on home page, hidden after scrolling past hero or when mobile menu open) */}
      {(pathname === "/" || pathname === "/home") && (!open) && (
        <div
          className="absolute top-full left-0 w-full h-auto md:h-[4.5vw] flex items-center justify-center bg-white border-y-2 md:border-y-[3px] border-black overflow-hidden py-1.5 md:px-0 md:py-0"
          style={{
            opacity: isHeroVisible ? 1 : 0,
            pointerEvents: isHeroVisible ? "auto" : "none",
            transition: "opacity 0.4s ease",
          }}
        >
          <div
            className="text-center text-black uppercase font-black italic w-full px-2"
            style={{ fontFamily: "var(--font-peakers)" }}
          >
            <span className="text-[5vw] xs:text-[5.2vw] sm:text-[22px] md:text-[3vw] xl:text-[2.1vw] tracking-normal md:tracking-wide leading-tight font-black">
              UNLOCK THE PERKS OF THE PECKERS INNER CIRCLE!{" "}
              <a
                href="https://peckers.vmos.io/account/auth/register"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 font-black underline"
              >
                SIGN UP
              </a>{" "}
              FOR EXCLUSIVE REWARDS.
            </span>
          </div>
        </div>
      )}
    </nav>
  );
}
