"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Mail, Phone, MapPin, FileText, CheckCircle2 } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on auth pages
  if (pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password") {
    return null;
  }

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: Brand info */}
          <div className="space-y-3.5">
            <Link href="/" className="flex items-center">
              <img
                src="/images/logo.png"
                alt="Green Fibre Logo"
                className="h-12 sm:h-14 w-auto max-w-[190px] object-contain flex-shrink-0"
              />
            </Link>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              Converting agricultural rice-husk crop stubble into durable, certified food-safe tableware and premium custom-branded corporate gifts.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="badge-slate text-[11px]">
                100% BPA-Free
              </span>
              <span className="badge-slate text-[11px]">
                Made in India
              </span>
            </div>
          </div>

          {/* Column 2: Product Collections */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Product Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
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

          {/* Column 3: Company & Policies */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Company &amp; Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <Link href="/story" className="hover:text-brand-700 transition-colors flex items-center gap-1.5">
                  <span>Our Story</span>
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-brand-700 transition-colors">
                  Wholesale Product Catalog
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-700 transition-colors font-medium text-slate-700 hover:underline">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-brand-700 transition-colors font-medium text-slate-700 hover:underline">
                  Privacy &amp; Replacement Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct B2B Sales Desk */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Direct B2B Sales Desk
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-800 block">Office Address:</strong>
                  Udyog Kendra 2, Greater Noida, Gautam Buddha Nagar (U.P.) 201306
                </span>
              </div>
              <div className="pt-1.5 text-slate-700 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>
                    Email:{" "}
                    <a
                      href="mailto:support.greenfibre@gmail.com"
                      className="font-bold text-slate-900 hover:text-brand-700 underline"
                    >
                      support.greenfibre@gmail.com
                    </a>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>
                    Direct Phone:{" "}
                    <a
                      href="tel:+919217328777"
                      className="font-bold text-slate-900 hover:text-brand-700 underline"
                    >
                      +91 92173 28777
                    </a>
                  </span>
                </div>
                <div>
                  WhatsApp:{" "}
                  <a
                    href="https://wa.me/919217988874"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-brand-700 hover:underline"
                  >
                    +91 92179 88874
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Green Fibre &bull; Powered by Charvik Moulds and Product Private Limited.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-slate-800 hover:underline">
              Terms &amp; Conditions
            </Link>
            <span>&bull;</span>
            <Link href="/privacy" className="hover:text-slate-800 hover:underline">
              Privacy &amp; Replacements
            </Link>
            <span>&bull;</span>
            <span>Made in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
