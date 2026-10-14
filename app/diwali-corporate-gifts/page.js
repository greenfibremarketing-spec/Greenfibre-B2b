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
  HelpCircle,
  CheckCircle2
} from "lucide-react";

export const metadata = {
  title: "Sustainable Diwali Corporate Gifts in Bulk",
  description:
    "Order sustainable Diwali hampers and bulk Diwali corporate gifts in India. Made from upcycled rice-husk crop stubble composite (65% plant residue) with in-house laser engraving and recycled kraft gift boxes.",
  alternates: {
    canonical: "/diwali-corporate-gifts"
  },
  openGraph: {
    type: "website",
    title: "Diwali Corporate Gifts Bulk | Sustainable Diwali Hampers | Green Fibre",
    description:
      "Celebrate festive season with sustainable Diwali hampers and corporate gifts bulk India orders. Made with upcycled crop stubble composite, laser engraving, and Pan-India delivery.",
    url: "/diwali-corporate-gifts",
    images: [
      {
        url: "/images/gift-set-classic.jpg",
        alt: "Sustainable Diwali Hampers & Corporate Gifts Bulk India - Green Fibre"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Diwali Corporate Gifts Bulk | Sustainable Diwali Hampers | Green Fibre",
    description:
      "Celebrate festive season with sustainable Diwali hampers and corporate gifts bulk India orders. Made with upcycled crop stubble composite, laser engraving, and Pan-India delivery.",
    images: ["/images/gift-set-classic.jpg"]
  }
};

export default function DiwaliCorporateGiftsPage() {
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
        name: "Diwali Corporate Gifts",
        item: `${siteUrl}/diwali-corporate-gifts`
      }
    ]
  };

  const faqList = [
    {
      q: "What makes Green Fibre Diwali hampers sustainable?",
      a: "Our festive tableware, dinnerware, and drinkware hampers are made from an upcycled rice-husk crop stubble composite (65% plant residue) sourced from farmers in Haryana and Punjab. Instead of stubble burning that pollutes North India around Diwali, the residue is upcycled into food-safe, BPA-free gifts."
    },
    {
      q: "Can festive gift boxes be customized with company greetings?",
      a: "Yes, we provide in-house laser engraving at our Greater Noida plant to imprint corporate logos, festive wishes, or recipient names onto gift products. Our design desk supplies a free 3D visual proof in 4 hours."
    },
    {
      q: "What packaging is used for corporate Diwali hampers?",
      a: "Each curated festive set is enclosed in an eco-friendly recycled kraft gift box, presenting a distinguished, premium aesthetic."
    },
    {
      q: "Do you offer multi-location dispatch across India for festive orders?",
      a: "Yes, our team manages coordinated Pan-India delivery directly from Greater Noida to corporate offices, regional hubs, or individual branch addresses across the nation."
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
          <span className="font-semibold text-slate-800">Diwali Corporate Gifts</span>
        </nav>

        {/* Hero Section */}
        <header className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 lg:p-12 shadow-xs space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200/80">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Festive Gifting for Organizations</span>
          </div>

          <div className="space-y-4 max-w-3xl">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Sustainable Diwali Hampers &amp; Bulk Corporate Gifts in India
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Celebrate the festival of lights with purposeful Diwali corporate gifts bulk orders.
              Crafted from an upcycled rice-husk crop stubble composite (65% plant residue) sourced from farmers
              in Haryana and Punjab, our sustainable Diwali hampers offer 100% BPA-free and food-safe tableware
              packaged in recycled kraft gift boxes.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/quote"
              className="btn-primary text-sm font-bold inline-flex items-center gap-2 px-6 py-3 shadow-md"
            >
              <span>Request Diwali Hamper Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/919217988874"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm font-semibold inline-flex items-center gap-2 px-6 py-3 border border-slate-300 hover:border-emerald-600 hover:text-emerald-800 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Inquire via WhatsApp</span>
            </a>
          </div>
        </header>

        {/* Sustainable Significance & Festive Gifting Story */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              65%
            </div>
            <h2 className="text-lg font-bold text-slate-900">Crop Residue Solutions</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Post-harvest paddy stubble burning traditionally coincides with Diwali festivities. By sourcing
              rice husk from farmers in Haryana and Punjab and transforming it into a 65% plant-residue composite,
              our festive hampers help divert crop residue from open burning while providing durable homeware.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 text-emerald-700" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Laser Engraving in 4 Hours</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Operating out of Greater Noida, our in-house laser engraving delivers custom company logos and festive
              salutations. We supply a free 3D visual proof in 4 hours to confirm precise layout before running bulk
              batches.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5 text-emerald-700" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Recycled Kraft Packaging</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every festive set is housed inside an earthy recycled kraft gift box ready for distribution.
              Contact our team early to confirm order deadlines and lead times.
            </p>
          </div>
        </section>

        {/* Informative Body Content */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 space-y-6">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
              Meaningful Festive Celebrations for Teams &amp; Clients
            </span>
            <h2 className="text-xl sm:text-3xl font-bold text-slate-900">
              Why Choose Sustainable Diwali Hampers Over Conventional Gifts
            </h2>
          </div>

          <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-600 leading-relaxed space-y-4">
            <p>
              Many Diwali corporate gifts are perishable or single-use; durable, reusable gifts stay useful long after the festival. Sustainable Diwali hampers offer a thoughtful, enduring
              alternative that employees and clients welcome into their family dining rooms. Crafted from upcycled
              rice-husk crop stubble composite (65% plant residue), each tableware and drinkware piece is food-safe,
              BPA-free, and designed for daily household use.
            </p>
            <p>
              Every gift is manufactured and customized at our Greater Noida facility. Sourcing agricultural crop residue
              directly from farmers in Haryana and Punjab turns stubble into high-value products, creating a heartfelt story
              of environmental responsibility. Our design team executes sharp in-house laser engraving, while each curated
              ensemble is packed in a clean recycled kraft gift box. With dedicated Pan-India delivery, your organization
              can delight teams across multiple branches simultaneously.
            </p>
          </div>

          {/* TODO: Confirm seasonal order cut-off date and lead times for high-volume customized Diwali production */}
          {/* TODO: Confirm minimum order quantity (MOQ) for bespoke multi-product Diwali festive gift hampers */}

          {/* Internal Navigation Links */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Curated Festive Hampers &amp; Catalog Links
            </h3>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <Link
                href="/category/gift-boxes-hampers"
                className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
              >
                All Gift Boxes &amp; Hampers
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
                href="/products/greenfibre-family-pack"
                className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-900 hover:bg-emerald-100 transition-colors"
              >
                Green Fibre Family Pack
              </Link>
              <Link
                href="/category/tableware"
                className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
              >
                Festive Tableware Collection
              </Link>
              <Link
                href="/corporate-gifting"
                className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
              >
                Corporate Gifting Overview
              </Link>
            </div>
          </div>
        </section>

        {/* Visible FAQ Section */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-700" />
              <span>Festive Gifting FAQs</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Frequently Asked Questions About Diwali Corporate Orders
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
              Book Your Sustainable Diwali Corporate Gifts Early
            </h2>
            <p className="text-sm sm:text-base text-emerald-200/90 leading-relaxed">
              Secure factory allocation for Diwali hampers. Connect with our Greater Noida team,
              receive a free 3D visual proof in 4 hours, and coordinate Pan-India dispatch.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/quote"
              className="px-6 py-3 rounded-full bg-white text-emerald-950 hover:bg-emerald-50 text-sm font-bold shadow-md transition-all"
            >
              Request Festive Quote
            </Link>
            <a
              href="https://wa.me/919217988874"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-emerald-800/80 hover:bg-emerald-800 text-white text-sm font-semibold border border-emerald-700 transition-all inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
