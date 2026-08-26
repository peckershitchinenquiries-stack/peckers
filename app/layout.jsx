import "./globals.css";
import localFont from "next/font/local";
import ClientWrapper from "./ClientWrapper";
import { sanityFetch, SanityLive } from "../sanity/lib/live";
import { SEO_CONFIG } from "./lib/seo";

const peakersFont = localFont({
  src: "./fonts/Supernett-Cn-Regular.woff2",
  display: "swap",
  variable: "--font-peakers",
});

const peakersBold = localFont({
  src: "./fonts/Supernett Cn Bold.otf",
  display: "swap",
  variable: "--font-peakers-bold",
  weight: "700",
});

const neuzeit = localFont({
  src: "./fonts/NeuzeitGrotesk-Regular.otf",
  display: "swap",
  variable: "--font-neuzeit",
  weight: "400",
});

export const metadata = {
  metadataBase: new URL(SEO_CONFIG.baseUrl),
  title: {
    default: "Peckers | Seriously Good Chicken | Stevenage & Hitchin",
    template: "%s",
  },
  description:
    "Peckers serves freshly prepared fried and flame-grilled chicken in Stevenage and Hitchin. Gourmet burgers, crispy wings, peri-peri chicken, and signature shakes. Order online for delivery or collect in store.",
  applicationName: SEO_CONFIG.siteName,
  authors: [{ name: SEO_CONFIG.siteName, url: SEO_CONFIG.baseUrl }],
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  keywords: [
    "Peckers chicken",
    "best chicken in Stevenage",
    "best chicken in Hitchin",
    "best chicken in Hertfordshire",
    "fried chicken near me",
    "grilled chicken near me",
    "peri peri chicken near me",
    "best chicken takeaway near me",
    "chicken delivery Stevenage",
    "chicken delivery Hitchin",
    "where to eat in Stevenage",
    "where to eat in Hitchin",
    "food near me Stevenage",
    "food near me Hitchin",
    "chicken restaurant Hertfordshire",
    "best burgers Stevenage",
    "best burgers Hitchin",
    "peri peri Stevenage",
    "peri peri Hitchin",
    "late night food Stevenage",
    "late night food Hitchin",
    "chicken wings near me",
    "takeaway near me Hertfordshire",
    "gourmet chicken burgers",
    "Seriously Good Chicken",
    "Peckers Stevenage",
    "Peckers Hitchin",
    "restaurants Hertfordshire",
  ],
  alternates: {
    canonical: SEO_CONFIG.baseUrl,
  },
  openGraph: {
    title: "Peckers | Seriously Good Chicken | Stevenage & Hitchin",
    description:
      "Freshly fried and flame-grilled chicken, gourmet burgers, peri-peri, wings and signature shakes from Peckers in Stevenage and Hitchin.",
    url: SEO_CONFIG.baseUrl,
    siteName: SEO_CONFIG.siteName,
    locale: "en_GB",
    type: "website",
    images: [{ url: SEO_CONFIG.defaultImage }],
  },
  twitter: {
    card: "summary_large_image",
    site: SEO_CONFIG.twitterHandle,
    creator: SEO_CONFIG.twitterHandle,
    title: "Peckers | Seriously Good Chicken | Stevenage & Hitchin",
    description:
      "Freshly fried and flame-grilled chicken, gourmet burgers, peri-peri, wings and signature shakes from Peckers in Stevenage and Hitchin.",
    images: [SEO_CONFIG.defaultImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};


export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({ children }) {
  // Fetch common data once on the server to prevent pulses in Navbar/Footer
  // Wrap in try/catch to prevent hydration errors when Sanity isn't reachable.
  let siteSettings = null;
  let footerData = null;

  try {
    const { data } = await sanityFetch({
      query: `*[_type == "siteSettings"][0]`,
    });
    siteSettings = data;
  } catch (error) {
    console.error("Failed to load site settings:", error);
  }

  try {
    const { data } = await sanityFetch({
      query: `*[_type == "footer"][0] {
      logo,
      tagline,
      socialLinks,
      quickLinks,
      locations,
      legalLinks,
      copyright,
      bottomLogo
    }`,
    });
    footerData = data;
  } catch (error) {
    console.error("Failed to load footer data:", error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          The hero video is streamed straight from cdn.sanity.io. Without these
          hints the browser only starts the DNS lookup + TLS handshake for that
          host once it reaches the <video> tag, which delays the hero.
          (next-sanity already preconnects to the *API* host — a different
          origin, so it doesn't help here.)

          No crossOrigin attribute on purpose: the video is fetched in plain
          no-CORS mode, and a CORS-mode preconnect opens a separate connection
          that the video request would not reuse.
        */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        {/*
          Google Consent Mode v2. This MUST run before gtag.js loads so the
          default state is "denied" — no analytics/ads cookies are set until the
          visitor opts in via the cookie banner (UK PECR / GDPR requirement).
          Any consent already stored from a previous visit is re-applied here so
          GA respects the visitor's choice on every page load.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'wait_for_update': 500
              });
              try {
                var stored = JSON.parse(localStorage.getItem('peckers_cookie_consent'));
                if (stored && stored.version === 1 && stored.categories) {
                  var a = stored.categories.analytics ? 'granted' : 'denied';
                  var m = stored.categories.marketing ? 'granted' : 'denied';
                  gtag('consent', 'update', {
                    'analytics_storage': a,
                    'ad_storage': m,
                    'ad_user_data': m,
                    'ad_personalization': m
                  });
                }
              } catch (e) {}
              gtag('js', new Date());
              gtag('config', 'G-256TPVH0TH');
            `,
          }}
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-256TPVH0TH"
        />
      </head>
      <body
        className={`${peakersFont.variable} ${peakersBold.variable} ${neuzeit.variable} antialiased`}
      >
        <ClientWrapper
          preloadedSettings={siteSettings}
          preloadedFooter={footerData}
        >
          {children}
        </ClientWrapper>
        <SanityLive />
      </body>
    </html>
  );
}
