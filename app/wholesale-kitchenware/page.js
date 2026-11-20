import { applySeoSettings } from "@/lib/seo";
import { staticSeoDefaults } from "@/lib/seo-defaults";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import {
  ChevronRight,
  Home as HomeIcon,
  ShieldCheck,
  Truck,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Leaf,
  Package,
  Layers
} from "lucide-react";

export const revalidate = 300;

export async function generateMetadata() {
  return applySeoSettings("/wholesale-kitchenware", staticSeoDefaults["/wholesale-kitchenware"]);
}

export default function WholesaleKitchenwarePage() {
  const siteUrl = "https://trade.greenfibre.org";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Wholesale Kitchenware", item: `${siteUrl}/wholesale-kitchenware` }
    ]
  };

  const faqList = [
    {
      q: "What wholesale kitchenware products does Green Fibre manufacture?",
      a: "Green Fibre manufactures a comprehensive range of wholesale kitchenware including eco-friendly bowls, plates, platters, lunchboxes, bento boxes, water bottles, thermal mugs, and tableware sets. All products are made from upcycled rice-husk composite (65% plant residue) and are BPA-free and food-safe."
    },
    {
      q: "What is the minimum order quantity for bulk kitchenware orders?",
      a: "Our minimum order quantity (MOQ) starts at just 10 units per product. This makes Green Fibre ideal for startups, small businesses, hotels, restaurants, cafeterias, and large corporates alike. Volume discounts apply automatically on larger orders."
    },
    {
      q: "Are the kitchenware products microwave and dishwasher safe?",
      a: "Yes. Our rice-husk composite tableware and kitchenware is microwave-safe and dishwasher-safe. The natural biocomposite material is durable, heat-resistant, and maintains its form across repeated cycles."
    },
    {
      q: "Can I get custom logo branding on wholesale kitchenware orders?",
      a: "Absolutely. We offer in-house laser engraving at our Greater Noida manufacturing unit. Our design team provides a free 3D visual proof within 4 hours of receiving your vector logo file."
    },
    {
      q: "Do you offer Pan-India delivery for bulk kitchenware orders?",
      a: "Yes, we provide Pan-India delivery for all bulk orders. Orders are dispatched from our manufacturing unit in Greater Noida, Uttar Pradesh. Typical lead time is 7–15 days depending on order size and customization."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqList.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a }
    }))
  };

  const features = [
    { icon: <Leaf className="w-5 h-5" />, title: "100% BPA-Free", desc: "Food-safe, upcycled rice-husk composite material" },
    { icon: <Package className="w-5 h-5" />, title: "MOQ 10 Units", desc: "Low minimum order, volume discounts on large batches" },
    { icon: <ShieldCheck className="w-5 h-5" />, title: "Direct Manufacturer", desc: "No middlemen — factory prices from Greater Noida" },
    { icon: <Truck className="w-5 h-5" />, title: "Pan-India Delivery", desc: "Fast dispatch to all cities and states across India" },
    { icon: <Layers className="w-5 h-5" />, title: "Custom Laser Branding", desc: "In-house laser engraving with free 3D proof in 4 hours" },
    { icon: <CheckCircle2 className="w-5 h-5" />, title: "Microwave & Dishwasher Safe", desc: "Durable for daily commercial kitchenware use" }
  ];

  const categories = [
    { label: "Tableware & Dining", href: "/category/tableware", desc: "Bowls, plates, platters, and dining ware sets" },
    { label: "Drinkware", href: "/category/drinkware", desc: "Thermal bottles, mugs, tumblers, and cups" },
    { label: "Kitchen & Dining", href: "/category/kitchen-dining", desc: "Lunchboxes, bento boxes, and food containers" },
    { label: "Gift Boxes & Hampers", href: "/category/gift-boxes-hampers", desc: "Curated gift sets and corporate hampers" },
    { label: "Home & Living", href: "/category/home-living", desc: "Planters, organizers, and eco home decor" },
    { label: "Storage & Organizers", href: "/category/storage-organizers", desc: "Caddies, baskets, and storage solutions" }
  ];

  return (
    <div className="bg-white min-h-screen">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1b7a4b] via-[#15803d] to-[#0f5c35] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(110,231,183,0.2),transparent_60%)]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-emerald-200 mb-6">
            <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors">
              <HomeIcon className="w-3.5 h-3.5" /><span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
            <span className="text-white font-semibold">Wholesale Kitchenware</span>
          </nav>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 border border-white/30 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            Direct Manufacturer · Greater Noida, India
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5 max-w-3xl">
            Wholesale Kitchenware India — Bulk Tableware Supplier Direct from Manufacturer
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mb-8 leading-relaxed">
            Buy eco-friendly wholesale kitchenware in bulk — bowls, plates, lunchboxes, bottles, and tableware made from upcycled rice-husk composite. BPA-free, food-safe, and microwave-safe. MOQ just 10 units.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/quote" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-700 font-bold text-sm hover:bg-emerald-50 transition-colors shadow-lg">
              Get Wholesale Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/products" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/30 text-white font-semibold text-sm hover:bg-white/20 transition-colors backdrop-blur-sm">
              Browse Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 text-center">Why Buy Wholesale Kitchenware from Green Fibre?</h2>
        <p className="text-slate-500 text-center mb-10 max-w-2xl mx-auto">We are a direct manufacturer of eco-friendly kitchenware and tableware in India, offering factory prices with no intermediaries.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-700 text-white flex items-center justify-center">{f.icon}</div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{f.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 text-center">Wholesale Kitchenware Categories</h2>
          <p className="text-slate-500 text-center mb-10 max-w-xl mx-auto">Browse our complete catalog of wholesale kitchenware and tableware products.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <Link key={cat.href} href={cat.href} className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-brand-400 hover:shadow-md transition-all">
                <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-brand-700 transition-colors">{cat.label}</h3>
                <p className="text-slate-500 text-xs">{cat.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs text-brand-700 font-semibold mt-3 group-hover:gap-2 transition-all">
                  View products <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">Sustainable Wholesale Kitchenware Made in India</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Green Fibre (by Charvik Moulds and Products Private Limited) is a direct manufacturer of eco-friendly wholesale kitchenware based in Greater Noida, Uttar Pradesh. Our products are made from an upcycled rice-husk crop stubble composite — an agricultural by-product sourced from farmers in Haryana and Punjab.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              The result is a range of durable, BPA-free, food-safe, microwave-safe, and dishwasher-safe kitchenware that is both sustainable and commercially competitive. We serve hotels, restaurants, cafeterias, corporates, resellers, and NGOs across India.
            </p>
            <p className="text-slate-600 leading-relaxed">
              All products are priced inclusive of 18% GST. GST-registered buyers can claim input tax credit (ITC) on every bulk kitchenware order.
            </p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-3xl p-8 border border-emerald-200">
            <h3 className="font-bold text-slate-900 text-lg mb-5">Bulk Kitchenware Order Summary</h3>
            {[
              ["Material", "Upcycled rice-husk composite (65% plant residue)"],
              ["BPA-free & Food-safe", "Yes — certified for food contact"],
              ["Microwave-safe", "Yes"],
              ["Dishwasher-safe", "Yes"],
              ["MOQ", "10 units per product"],
              ["Custom Branding", "Laser engraving (free 3D proof in 4 hrs)"],
              ["GST", "18% included in price — ITC available"],
              ["Delivery", "Pan-India from Greater Noida"],
              ["Lead Time", "7–15 days (custom orders)"]
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between py-2 border-b border-emerald-200/60 last:border-0">
                <span className="text-slate-500 text-sm">{label}</span>
                <span className="text-slate-800 text-sm font-medium text-right max-w-[60%]">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-10 text-center flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 text-brand-600" /> Frequently Asked Questions
          </h2>
          <div className="space-y-5">
            {faqList.map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900 text-sm mb-2">{q}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-[#1b7a4b] to-[#15803d] text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Ready to Order Wholesale Kitchenware?</h2>
          <p className="text-emerald-100 mb-8 max-w-xl mx-auto">Get a customized bulk quotation with volume pricing, custom branding options, and delivery timeline in minutes.</p>
          <Link href="/quote" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-brand-700 font-bold hover:bg-emerald-50 transition-colors shadow-lg">
            Get Free Bulk Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

