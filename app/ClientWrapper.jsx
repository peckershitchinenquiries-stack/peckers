"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import PageLoader from "./components/Pageloader";
import SmoothScroll from "./SmoothScroll";
import MobileBottomBar from "./components/MobileBottomBar";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "./Navbar";
import ConditionalFooter from "./ConditionalFooter";
import CookieConsent from "./components/CookieConsent";
import PromoPopup from "./components/PromoPopup";

export default function ClientWrapper({ children, preloadedSettings, preloadedFooter }) {
  const pathname = usePathname();

  // Initialize loading state based on path to prevent flash on direct landing
  const [isPageLoading, setIsPageLoading] = useState(() => {
    const isHome = pathname === "/" || pathname === "/home" || pathname === "/home/";
    const isStudio = pathname?.startsWith("/studio");
    return !isHome && !isStudio;
  });

  const prevPathname = useRef(pathname);
  const lenisRef = useRef(null);

  const isMenuPath = (path) => typeof path === "string" && path.startsWith("/menu");

  // Instantly trigger PageLoader on route changes (during render)
  if (prevPathname.current !== pathname) {
    const fromMenu = isMenuPath(prevPathname.current);
    const toMenu = isMenuPath(pathname);
    const isMenuTabSwitch = fromMenu && toMenu;

    if (!isPageLoading && !isMenuTabSwitch) {
      setIsPageLoading(true);
    }
    prevPathname.current = pathname;
  }

  // Lock body scroll while the page loader is visible
  useEffect(() => {
    if (isPageLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isPageLoading]);

  // After PageLoader hides, force Lenis to recalculate its scroll limit.
  // Lenis caches scrollHeight on init — if the DOM changes it will have a stale
  // limit, causing phantom scroll past the real bottom.
  useEffect(() => {
    if (isPageLoading) return;

    const timer = setTimeout(() => {
      if (lenisRef.current) {
        lenisRef.current.resize();
        lenisRef.current.start();
      }
      ScrollTrigger.refresh();
    }, 300);

    return () => clearTimeout(timer);
  }, [isPageLoading]);

  const isHome = pathname === "/" || pathname === "/home" || pathname === "/home/";
  const isStudio = pathname?.startsWith("/studio");

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <>
      <PageLoader
        loading={isPageLoading}
        minimal={isStudio}
        onComplete={() => setIsPageLoading(false)}
      />

      <motion.div
        initial={false}
        animate={{
          opacity: isPageLoading ? 0 : 1,
          visibility: isPageLoading ? "hidden" : "visible"
        }}
        transition={{ duration: isPageLoading ? 0 : 0.4 }}
        className={pathname === "/house-made-sauces" ? "h-[100dvh] overflow-hidden flex flex-col" : ""}
      >
        <Navbar preloadedSettings={preloadedSettings} />
        {pathname === "/house-made-sauces" || pathname === "/menu/allergens" ? (
          <div
            id="main-content"
            className={`w-full flex-1 overflow-hidden ${pathname === "/house-made-sauces" ? "![will-change:opacity,visibility]" : ""} ${pathname === "/menu/allergens" ? "h-screen" : ""}`}
          >
            {children}
          </div>
        ) : (
          <SmoothScroll lenisRef={lenisRef}>
            <div
              id="main-content"
              className="w-full min-h-screen overflow-x-clip pb-[18vw] md:pb-0 h-auto overflow-visible"
            >
              {children}
            </div>
          </SmoothScroll>
        )}
        <ConditionalFooter preloadedData={preloadedFooter} />
        {!pathname.startsWith('/menu') && <MobileBottomBar />}
      </motion.div>

      <CookieConsent />
      <PromoPopup show={!isPageLoading && isHome} />
    </>
  );
}