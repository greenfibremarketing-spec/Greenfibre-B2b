import { applySeoSettings } from "@/lib/seo";
import { staticSeoDefaults } from "@/lib/seo-defaults";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import {
  ChevronRight,
  Home as HomeIcon,
  ShieldCheck,
  Sparkles,
  Coffee,
  Clock,
  Truck,
  ArrowRight,
  MessageCircle,
  HelpCircle,
  CheckCircle2
} from "lucide-react";

export const revalidate = 300;

export async function generateMetadata() {
  return applySeoSettings("/custom-branded-water-bottles", staticSeoDefaults["/custom-branded-water-bottles"]);
}

export default function CustomBrandedWaterBottlesPage() {
  const siteUrl = "https://trade.greenfibre.org";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Custom Branded Water Bottles",
        item: `${siteUrl}/custom-branded-water-bottles`
      }
    ]
  };

  const faqList = [
    {
      q: "What is a rice husk water bottle made from?",
      a: "Our bottles are molded from an upcycled rice-husk crop stubble composite containing 65% plant residue. The crop residue is sourced directly from farmers in Haryana and Punjab, creating an eco-conscious alternative that is 100% BPA-free and food-safe."
    },
    {
      q: "How does the double-wall thermal bottle design work?",
      a: "The double-wall thermal bottle construction provides thermal insulation to protect hands and maintain beverage temperatures, combining the durable bio-composite shell with a stainless steel inner."
    },
    {
      q: "How are corporate logos engraved onto custom bottles?",
      a: "All custom logo engraved bottles are personalized utilizing in-house laser engraving at our Greater Noida plant. We deliver crisp, permanent laser engraving that does not fade or peel during everyday handling."
    },
    {
      q: "How quickly can my team preview our bottle design?",
      a: "Once you submit your brand artwork, our design desk generates a free 3D visual proof in 4 hours. You can review the exact scale, placement, and finish before authorizing full production."
    },
    {
      q: "What packaging and delivery logistics are provided?",
      a: "Each bottle is safely encased in an individual recycled kraft gift box. We provide comprehensive Pan-India delivery directly to enterprise headquarters or distributed campus locations."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqList.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a
      }
    }))
  };

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap"
        >
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-brand-700 transition-colors"
          >
            <HomeIcon className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800">Custom Branded Water Bottles</span>
        </nav>

        {/* Hero Section */}
        <header className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 lg:p-12 shadow-xs space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200/80">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sustainable Drinkware for Corporate Workplaces</span>
          </div>

          <div className="space-y-4 max-w-3xl">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Rice Husk Water Bottle &amp; Custom Logo Engraved Bottles
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Elevate employee hydration and brand identity with sustainable drinkware. Crafted from an upcycled
              rice-husk crop stubble composite (65% plant residue), each double-wall thermal bottle offers food-safe,
              BPA-free everyday durability with in-house laser engraving.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/quote"
              className="btn-primary text-sm font-bold inline-flex items-center gap-2 px-6 py-3 shadow-md"
            >
              <span>Get Wholesale Bottle Pricing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/919217988874"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm font-semibold inline-flex items-center gap-2 px-6 py-3 border border-slate-300 hover:border-emerald-600 hover:text-emerald-800 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Discuss on WhatsApp</span>
            </a>
          </div>
        </header>

        {/* Technical Highlights & Sustainable Materials */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              65%
            </div>
            <h2 className="text-lg font-bold text-slate-900">Crop Residue Composite</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every rice husk water bottle is made from upcycled agricultural stubble (65% plant residue).
              Sourced from farmers in Haryana and Punjab, the composite prevents seasonal crop burning while providing
              a lightweight, impact-resistant, BPA-free and food-safe vessel.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 text-emerald-700" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Fast 4-Hour Visual Proof</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We execute in-house laser engraving directly inside our Greater Noida facility. Submit your company
              emblem or team vector file to receive a complimentary, photo-realistic 3D visual proof in 4 hours.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5 text-emerald-700" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Recycled Gift Packaging</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Each unit is presented in a recycled kraft gift box ready for company orientation welcome kits or executive
              gifting. We coordinate Pan-India delivery to single or multiple corporate hubs.
            </p>
          </div>
        </section>

        {/* Detailed Content & Engineering Excellence */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 space-y-6">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
              Workplace Hydration Engineered for Sustainability
            </span>
            <h2 className="text-xl sm:text-3xl font-bold text-slate-900">
              Why Upgrade Your Organization to Custom Logo Engraved Bottles
            </h2>
          </div>

          <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-600 leading-relaxed space-y-4">
            <p>
              Corporate gifting programs often struggle with disposable merchandise that ends up forgotten in desk drawers.
              A custom logo engraved bottle offers daily practical utility for employees working across desks, conference
              rooms, and commutes. By transitioning to Green Fibre bottles molded from upcycled crop stubble composite
              (65% plant residue), your organization reinforces its tangible environmental commitment every single day.
            </p>
            <p>
              Our double-wall thermal bottle architecture ensures comfort and reliability during busy workdays.
              Manufactured with agricultural residue sourced from farmers in Haryana and Punjab and processed at our Greater
              Noida manufacturing site, each bottle undergoes thorough quality checks. High-contrast in-house laser engraving
              applies your organizational logo with permanent clarity. After packaging inside sturdy recycled kraft gift boxes,
              we coordinate Pan-India delivery.
            </p>
            <p>
              Unlike conventional plastic drinkware, our double-wall thermal bottles are 100% BPA-free and
              food-safe for both hot and cold beverages. Fabricated using an upcycled rice-husk crop stubble composite
              (65% plant residue) sourced from farmers in Haryana and Punjab, every bottle helps divert crop residue from open burning.
              Our in-house design unit in Greater Noida turns your logo into a free 3D visual proof in 4 hours, and packages
              every bottle inside a protective recycled kraft gift box with Pan-India delivery.
            </p>
          </div>

          {/* TODO: Confirm exact minimum order quantity (MOQ) for custom color-molded bottle production runs */}
          {/* TODO: Confirm hours of thermal temperature retention (hot/cold) tested for the double-wall thermal bottle */}

          {/* Internal Navigation Links */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Browse Related Bottles &amp; Collections
            </h3>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <Link
                href="/products/viora-water-bottle-400ml"
                className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-900 hover:bg-emerald-100 transition-colors"
              >
                Viora Water Bottle 400ml
              </Link>
              <Link
                href="/products/viora-water-bottle-900ml"
                className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-900 hover:bg-emerald-100 transition-colors"
              >
                Viora Water Bottle 900ml
              </Link>
              <Link
                href="/category/drinkware"
                className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
              >
                All Sustainable Drinkware
              </Link>
              <Link
                href="/corporate-gifting"
                className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
              >
                Corporate Gifting Catalog
              </Link>
              <Link
                href="/products"
                className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
              >
                Full Product Catalog
              </Link>
            </div>
          </div>
        </section>

        {/* Visible FAQ Section */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-700" />
              <span>Bottle Ordering Guidelines</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Frequently Asked Questions About Custom Bottles
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {faqList.map((item, idx) => (
              <div key={idx} className="py-4 space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {item.q}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Order Custom Engraved Bottles for Your Team Today
            </h2>
            <p className="text-sm sm:text-base text-emerald-200/90 leading-relaxed">
              Share your company logo and quantity requirements. Our team in Greater Noida will supply
              a free 3D visual proof in 4 hours and deliver across India.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/quote"
              className="px-6 py-3 rounded-full bg-white text-emerald-950 hover:bg-emerald-50 text-sm font-bold shadow-md transition-all"
            >
              Start Bottle Quote
            </Link>
            <a
              href="https://wa.me/919217988874"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-emerald-800/80 hover:bg-emerald-800 text-white text-sm font-semibold border border-emerald-700 transition-all inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span>Inquire via WhatsApp</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
