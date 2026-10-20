import { getSeoAdmin } from "@/lib/seo-admin";
import { SITE_KEYWORDS, SITE_TITLE_TEMPLATE } from "@/lib/seo-config";
import "./globals.css";
import Link from "next/link";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import { QuoteProvider } from "@/components/Quote";
import { AuthProvider } from "@/components/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FloatingWhatsAppQuote } from "@/components/WhatsAppQuoteButton";

import JsonLd from "@/components/JsonLd";

const corporateFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-corporate",
  display: "swap"
});

export const dynamic = "force-dynamic";

const organizationAndWebsiteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://trade.greenfibre.org/#organization",
      "name": "Green Fibre",
      "url": "https://trade.greenfibre.org",
      "logo": "https://trade.greenfibre.org/images/logo.png",
      "telephone": "+919217328777",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Udyog Kendra 2",
        "addressLocality": "Greater Noida",
        "addressRegion": "Uttar Pradesh",
        "postalCode": "201306",
        "addressCountry": "IN"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+919217328777",
          "contactType": "sales",
          "areaServed": "IN",
          "availableLanguage": ["en", "hi"]
        }
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://trade.greenfibre.org/#website",
      "url": "https://trade.greenfibre.org",
      "name": "Green Fibre B2B",
      "description": "Sustainable Tableware & Corporate Gifting Direct from Manufacturer",
      "publisher": {
        "@id": "https://trade.greenfibre.org/#organization"
      }
    }
  ]
};


export const metadata = {
  metadataBase: new URL("https://trade.greenfibre.org"),
  title: {
    default: "Green Fibre B2B | Sustainable Tableware & Corporate Gifting",
    template: SITE_TITLE_TEMPLATE
  },
  description:
    "Direct manufacturer of eco-friendly tableware, coffee drinkware, lunchboxes, and corporate gift sets made from upcycled agricultural rice-husk composite.",
  keywords: SITE_KEYWORDS,
  authors: [{ name: "Green Fibre", url: "https://trade.greenfibre.org" }],
  creator: "Green Fibre",
  publisher: "Green Fibre - Charvik Moulds and Product Private Limited",
  icons: {
    icon: [
      { url: "/images/logo.png", type: "image/png" }
    ],
    apple: [
      { url: "/images/logo.png", type: "image/png" }
    ]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION } }
    : {}),
  category: "B2B Wholesale",
  openGraph: {
    type: "website",
    siteName: "Green Fibre B2B",
    locale: "en_IN",
    title: "Green Fibre B2B | Sustainable Tableware & Corporate Gifting",
    description: "Everyday durable tableware and gift sets made from upcycled rice-husk crop stubble. Custom laser branding and Pan-India delivery.",
    images: [
      {
        url: "/images/hero.jpg",
        alt: "Green Fibre B2B - Sustainable Tableware & Corporate Gifting"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Green Fibre B2B | Sustainable Tableware & Corporate Gifting",
    description: "Direct manufacturer of eco-friendly tableware, drinkware, and corporate gift sets from upcycled rice-husk composite.",
    images: ["/images/hero.jpg"]
  },
  other: {
    "theme-color": "#15803d"
  }
};

export default async function RootLayout({ children }) {
  let canManageSeo = false;
  try { canManageSeo = Boolean(await getSeoAdmin()); } catch { /* Public navigation remains available during database outages. */ }
  return (
    <html lang="en" className={corporateFont.variable}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J9GF4NBD8N"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-J9GF4NBD8N');
          `}
        </Script>
      </head>
      <body className="bg-white text-slate-800 font-sans antialiased min-h-screen flex flex-col">
        <JsonLd data={organizationAndWebsiteSchema} />
        <AuthProvider>
          <QuoteProvider>
            {/* Executive B2B Navigation Header */}
            <Navbar canManageSeo={canManageSeo} />

            <main className="flex-1">{children}</main>

            {/* Global Footer */}
            <Footer />

            {/* Global Floating WhatsApp Request Quote Trigger (Desktop & Mobile) */}
            <FloatingWhatsAppQuote />
          </QuoteProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
