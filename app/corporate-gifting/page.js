import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import {
  ChevronRight,
  Home as HomeIcon,
  ShieldCheck,
  Sparkles,
  Gift,
  Clock,
  Truck,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  HelpCircle,
  Layers
} from "lucide-react";

export const metadata = {
  title: "Corporate Gifts Bulk India | Eco-Friendly Corporate Gifting | Green Fibre",
  description:
    "Order eco-friendly corporate gifting solutions in bulk across India. Manufactured from upcycled rice-husk crop stubble composite (65% plant residue) with in-house laser engraving and Pan-India delivery.",
  alternates: {
    canonical: "/corporate-gifting"
  },
  openGraph: {
    type: "website",
    title: "Corporate Gifts Bulk India | Eco-Friendly Corporate Gifting | Green Fibre",
    description:
      "Sustainable bulk corporate gifting in India. Made with 65% upcycled crop stubble composite, in-house laser engraving, recycled kraft packaging, and free 3D visual proof in 4 hours.",
    url: "/corporate-gifting",
    images: [
      {
        url: "/images/gift-set-classic.jpg",
        alt: "Eco-Friendly Corporate Gifts Bulk India - Green Fibre"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Corporate Gifts Bulk India | Eco-Friendly Corporate Gifting | Green Fibre",
    description:
      "Sustainable bulk corporate gifting in India. Made with 65% upcycled crop stubble composite, in-house laser engraving, recycled kraft packaging, and free 3D visual proof in 4 hours.",
    images: ["/images/gift-set-classic.jpg"]
  }
};

export default function CorporateGiftingPage() {
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
        name: "Corporate Gifting",
        item: `${siteUrl}/corporate-gifting`
      }
    ]
  };

  const faqList = [
    {
      q: "What materials are used in Green Fibre eco-friendly corporate gifts?",
      a: "Our corporate gifts are manufactured from an upcycled rice-husk crop stubble composite containing 65% plant residue. The agricultural raw material is sourced directly from farmers in Haryana and Punjab, creating durable, BPA-free, and food-safe homeware and drinkware."
    },
    {
      q: "How does corporate logo branding work on bulk gift orders?",
      a: "We offer in-house laser engraving at our Greater Noida manufacturing unit. Our design desk provides a free 3D visual proof within 4 hours of receiving your vector logo so your team can verify layout, alignment, and scale prior to production."
    },
    {
      q: "What packaging comes standard with corporate gift sets?",
      a: "All gift sets arrive packaged in a premium recycled kraft gift box designed for safe transit and elegant presentation during employee onboarding, milestone celebrations, or client appreciation events."
    },
    {
      q: "Can Green Fibre deliver corporate gifts across multiple locations in India?",
      a: "Yes, we coordinate reliable Pan-India delivery directly from our Greater Noida facility to corporate headquarters, regional branch offices, or designated distribution hubs across the country."
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
          <span className="font-semibold text-slate-800">Corporate Gifting</span>
        </nav>

        {/* Hero Section */}
        <header className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 lg:p-12 shadow-xs space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200/80">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sustainable B2B Corporate Solutions</span>
          </div>

          <div className="space-y-4 max-w-3xl">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Eco-Friendly Corporate Gifting &amp; Bulk Sustainable Gifts in India
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Equip your enterprise with meaningful, functional corporate gifts bulk India buyers trust.
              Crafted from upcycled agricultural rice-husk crop stubble composite (65% plant residue),
              every Green Fibre gift set replaces single-use plastics with durable, certified food-safe homeware.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/quote"
              className="btn-primary text-sm font-bold inline-flex items-center gap-2 px-6 py-3 shadow-md"
            >
              <span>Request Wholesale Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/919211338066"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm font-semibold inline-flex items-center gap-2 px-6 py-3 border border-slate-300 hover:border-emerald-600 hover:text-emerald-800 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </header>

        {/* Value Proposition & Agricultural Upcycling Story */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              65%
            </div>
            <h2 className="text-lg font-bold text-slate-900">Upcycled Crop Residue</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every item is molded from an innovative bio-composite made from upcycled rice-husk crop stubble
              composite (65% plant residue). We source raw agricultural stubble from farmers in Haryana and Punjab,
              preventing field burning while delivering resilient, 100% BPA-free and food-safe products.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 text-emerald-700" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">In-House Laser Engraving</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Operating directly from Greater Noida, our manufacturing team executes high-precision in-house laser
              engraving. Share your vector insignia to receive a free 3D visual proof in 4 hours before batch
              production commences.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5 text-emerald-700" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Pan-India Delivery</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Individual gift units are presented in a protective recycled kraft gift box engineered for transit.
              We provide prompt, synchronized Pan-India delivery to fulfill annual conferences, employee onboarding,
              and executive gifting campaigns.
            </p>
          </div>
        </section>

        {/* Informative Content & Enterprise Features */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 space-y-6">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
              Direct Manufacturer Fulfillment
            </span>
            <h2 className="text-xl sm:text-3xl font-bold text-slate-900">
              Why Indian Enterprises Choose Green Fibre for Eco-Friendly Corporate Gifting
            </h2>
          </div>

          <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-600 leading-relaxed space-y-4">
            <p>
              Traditional corporate gifts often rely on generic, short-lived plastic gadgets or single-use gift baskets
              that fail to reflect modern organizational ESG commitments. Green Fibre enables organizations across
              India to present tangible environmental stewardship through useful everyday items. By utilizing crop stubble
              sourced directly from agrarian communities in Haryana and Punjab, each set embodies an authentic circular
              economy story.
            </p>
            <p>
              Based in Greater Noida, our manufacturing plant manages product molding, surface finishing, quality inspection,
              and in-house laser engraving under one roof. Whether you are outfitting a new team cohort or curating premium
              holiday gift hampers, your branding is etched with clean, enduring precision. Every package is shipped inside
              an earthy recycled kraft gift box that arrives gift-ready without excessive packaging waste.
            </p>
            <p>
              Every product in our corporate gifting catalog is certified BPA-free and food-safe, making our dinnerware,
              mugs, and desk organizers practical for daily employee use at home or in the office. Because we manufacture
              using an upcycled rice-husk crop stubble composite featuring 65% plant residue, corporate gifts carry a
              tangible connection to rural farmers across Haryana and Punjab. From our Greater Noida facility,
              our team ensures fast 3D visual proofs in 4 hours, individual protective recycled kraft gift boxes, and
              reliable Pan-India delivery for single-office dispatches and multi-city enterprise distributions.
            </p>
          </div>

          {/* TODO: Confirm minimum order quantity (MOQ) for custom-curated corporate gifting hampers */}
          {/* TODO: Confirm custom belly-band print dimensions and PMS color matching options for enterprise accounts */}

          {/* Relevant Category & Product Internal Links */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Explore Popular Corporate Gifting Collections
            </h3>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <Link
                href="/category/gift-boxes-hampers"
                className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
              >
                Gift Boxes &amp; Hampers
              </Link>
              <Link
                href="/category/drinkware"
                className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
              >
                Sustainable Drinkware
              </Link>
              <Link
                href="/category/tableware"
                className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
              >
                Rice-Husk Tableware
              </Link>
              <Link
                href="/products/dining-gift-set"
                className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-900 hover:bg-emerald-100 transition-colors"
              >
                Dining Gift Set
              </Link>
              <Link
                href="/products/desk-gift-set"
                className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-900 hover:bg-emerald-100 transition-colors"
              >
                Desk Gift Set
              </Link>
              <Link
                href="/products/statement-mug-set-of-4"
                className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-900 hover:bg-emerald-100 transition-colors"
              >
                Statement Mug Set of 4
              </Link>
            </div>
          </div>
        </section>

        {/* Visible FAQ Section */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-700" />
              <span>Frequently Asked Questions</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Questions About Bulk Corporate Gifting
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
              Ready to Upgrade Your Corporate Gifting Strategy?
            </h2>
            <p className="text-sm sm:text-base text-emerald-200/90 leading-relaxed">
              Connect with our corporate team in Greater Noida. Get a free 3D visual proof in 4 hours
              and direct manufacturer pricing with Pan-India delivery.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/quote"
              className="px-6 py-3 rounded-full bg-white text-emerald-950 hover:bg-emerald-50 text-sm font-bold shadow-md transition-all"
            >
              Request Custom Quote
            </Link>
            <a
              href="https://wa.me/919211338066"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-emerald-800/80 hover:bg-emerald-800 text-white text-sm font-semibold border border-emerald-700 transition-all inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span>Instant WhatsApp Inquiry</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
