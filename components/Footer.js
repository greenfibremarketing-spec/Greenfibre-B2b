"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on auth pages
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand info */}
          <div className="space-y-3">
            <div className="flex items-center">
              <img
                src="/images/logo.png"
                alt="Green Fibre Logo"
                className="h-12 sm:h-14 w-auto max-w-[190px] object-contain flex-shrink-0"
              />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              Direct manufacturer converting agricultural rice-husk crop stubble into durable, certified food-safe tableware and premium custom-branded corporate gifts.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="badge-slate">
                US FDA 21 CFR Certified
              </span>
              <span className="badge-slate">
                100% BPA-Free
              </span>
              <span className="badge-slate">
                Made in India
              </span>
            </div>
          </div>

          {/* Column 2: Product Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Product Collections
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/products?category=Drinkware" className="hover:text-brand-700 transition-colors">
                  Eco Tumblers &amp; Coffee Mugs
                </Link>
              </li>
              <li>
                <Link href="/products?category=Gift+Boxes+%26+Hampers" className="hover:text-brand-700 transition-colors">
                  Corporate Gift Sets &amp; Hampers
                </Link>
              </li>
              <li>
                <Link href="/products?category=Kitchen+%26+Dining" className="hover:text-brand-700 transition-colors">
                  Dining Bowls &amp; Bento Lunchboxes
                </Link>
              </li>
              <li>
                <Link href="/products?category=Home+%26+Living" className="hover:text-brand-700 transition-colors">
                  Tabletop Planters &amp; Accessories
                </Link>
              </li>
              <li>
                <Link href="/products?category=Storage+%26+Baskets" className="hover:text-brand-700 transition-colors">
                  Desk Organizers &amp; Caddies
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: For Procurement Teams */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              For Procurement Teams
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/story" className="hover:text-brand-700 transition-colors">
                  Our Story &amp; Farmer Roots
                </Link>
              </li>
              <li>
                <Link href="/#branding" className="hover:text-brand-700 transition-colors">
                  In-House Fiber Laser Engraving
                </Link>
              </li>
              <li>
                <Link href="/#branding" className="hover:text-brand-700 transition-colors">
                  Custom Kraft Packaging
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-brand-700 transition-colors">
                  Order Sample Kit (48h Dispatch)
                </Link>
              </li>
              <li>
                <Link href="/quote" className="hover:text-brand-700 transition-colors">
                  Request Official GST Quotation
                </Link>
              </li>
              <li>
                <Link href="/quote" className="hover:text-brand-700 transition-colors">
                  Volume Pricing &amp; Custom Quotes
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Sales Desk */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Direct B2B Sales Desk
            </h4>
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <div>
                <strong className="text-slate-800 block">Manufacturing Works:</strong>
                Plot 48, Sector 38 Phase II, HSIIDC Rai, Sonipat, Haryana
              </div>
              <div>
                <strong className="text-slate-800 block">Corporate Office:</strong>
                Tower B, DLF Cyber City, Phase 2, Gurugram, Haryana 122002
              </div>
              <div className="pt-2 text-slate-700">
                Email: <strong className="text-slate-900">orders@greenfibre.org</strong><br />
                Direct Phone: <strong className="text-slate-900">+91 124 489 3200</strong><br />
                WhatsApp Desk: <strong className="text-brand-700">+91 98108 44210</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Green Fibre Manufacturing Pvt. Ltd. GSTIN: 06AAACG8412F1Z8.
          </div>
          <div className="flex items-center gap-4">
            <span>100% Upcycled Agricultural Stubble</span>
            <span>•</span>
            <span>Made in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
