import "./globals.css";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { QuoteProvider } from "@/components/Quote";
import { AuthProvider } from "@/components/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const corporateFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-corporate",
  display: "swap"
});


export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://trade.greenfibre.org"),
  title: {
    default: "Green Fibre B2B | Sustainable Tableware & Corporate Gifting",
    template: "%s | Green Fibre B2B"
  },
  description:
    "Direct manufacturer of eco-friendly tableware, coffee drinkware, lunchboxes, and corporate gift sets made from upcycled agricultural rice-husk composite.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Green Fibre B2B",
    locale: "en_IN",
    title: "Green Fibre B2B | Sustainable Tableware & Corporate Gifting",
    description: "Everyday durable tableware and gift sets made from upcycled rice-husk crop stubble. Custom laser branding and Pan-India delivery.",
    images: [{ url: "/images/logo.png", width: 1200, height: 630, alt: "Green Fibre B2B" }]
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/logo.png"]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={corporateFont.variable}>
      <body className="bg-white text-slate-800 font-sans antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <QuoteProvider>
            {/* Executive B2B Navigation Header */}
            <Navbar />

            <main className="flex-1">{children}</main>

            {/* Global Footer */}
            <Footer />
          </QuoteProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
