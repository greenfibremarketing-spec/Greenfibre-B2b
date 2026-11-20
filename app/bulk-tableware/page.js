import { applySeoSettings } from "@/lib/seo";
import { staticSeoDefaults } from "@/lib/seo-defaults";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import {
  ChevronRight, Home as HomeIcon, ShieldCheck, Truck, ArrowRight,
  CheckCircle2, HelpCircle, Leaf, Layers
} from "lucide-react";

export const revalidate = 300;

export async function generateMetadata() {
  return applySeoSettings("/bulk-tableware", staticSeoDefaults["/bulk-tableware"]);
}

export default function BulkTablewarePage() {
  const siteUrl = "https://trade.greenfibre.org";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Bulk Tableware", item: `${siteUrl}/bulk-tableware` }
    ]
  };

  const faqList = [
    {
      q: "What bulk tableware products does Green Fibre supply?",
      a: "Green Fibre supplies a comprehensive range of bulk tableware including eco-friendly dinner plates, soup bowls, salad bowls, serving platters, lunchboxes, and dining ware sets. All products are made from upcycled rice-husk composite and are BPA-free, food-safe, microwave-safe, and dishwasher-safe."
    },
    {
      q: "Are your tableware products suitable for hotels and restaurants?",
      a: "Yes. Our bulk tableware is designed for commercial use. The durable rice-husk composite withstands daily dishwasher cycles, is heat-resistant, and maintains its appearance over time. We supply hotels, restaurants, cafeterias, cloud kitchens, and catering businesses across India."
    },
    {
      q: "What is the minimum order quantity for bulk tableware?",
      a: "Our minimum order quantity starts at 10 units per product. Volume discounts apply automatically for larger order quantities. We accommodate both pilot orders and large-scale bulk procurement."
    },
    {
      q: "Can tableware be custom branded with a restaurant or hotel logo?",
      a: "Yes. We offer in-house laser engraving at our Greater Noida manufacturing unit. Our design team provides a free 3D visual proof within 4 hours of receiving your vector logo."
    },
    {
      q: "What GST benefit is available on bulk tableware orders?",
      a: "All our tableware prices are inclusive of 18% GST. GST-registered buyers (hotels, restaurants, corporates) can claim full input tax credit (ITC) on every bulk tableware order placed through Green Fibre B2B."
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

  const useCases = [
    "Hotels & Resorts", "Restaurants & Cafés", "Corporate Cafeterias",
    "Cloud Kitchens", "Catering Companies", "Airlines & Railways",
    "Schools & Colleges", "NGOs & Non-profits", "Corporate Gifting"
  ];

  return (
    <div className="bg-white min-h-screen">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#1b7a4b] via-[#15803d] to-[#0f5c35] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(110,231,183,0.2),transparent_60%)]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-emerald-200 mb-6">
            <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors"><HomeIcon className="w-3.5 h-3.5" /><span>Home</span></Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
            <span className="text-white font-semibold">Bulk Tableware</span>
          </nav>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 border border-white/30 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            Wholesale Tableware Supplier · India
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5 max-w-3xl">
            Bulk Tableware Supplier India — Wholesale Eco-Friendly Dining Ware Direct from Manufacturer
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mb-8 leading-relaxed">
            Buy bulk tableware — eco-friendly plates, bowls, platters, and dining ware made from upcycled rice-husk composite. BPA-free, microwave-safe. Ideal for hotels, restaurants, corporates. MOQ 10 units.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/quote" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-700 font-bold text-sm hover:bg-emerald-50 transition-colors shadow-lg">
              Get Bulk Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/category/tableware" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/30 text-white font-semibold text-sm hover:bg-white/20 transition-colors">
              Browse Tableware
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 text-center">Bulk Tableware for Every Commercial Use Case</h2>
        <p className="text-slate-500 text-center mb-10 max-w-2xl mx-auto">From single-restaurant pilots to large hospitality chains — we supply bulk tableware at factory prices across India.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {useCases.map((uc) => (
            <div key={uc} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
              <span className="text-slate-700 text-sm font-medium">{uc}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">About Our Bulk Tableware</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Green Fibre's bulk tableware range includes dinner plates, soup bowls, salad bowls, serving platters, and complete dining ware sets. All products are manufactured from upcycled rice-husk composite — a durable, food-safe, and eco-friendly alternative to conventional plastic or melamine tableware.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                Our tableware is microwave-safe, dishwasher-safe, and heat-resistant, making it ideal for heavy commercial use in hotels, restaurants, cafeterias, and large-scale catering operations.
              </p>
              <p className="text-slate-600 leading-relaxed">
                All prices are inclusive of 18% GST. GST-registered buyers can claim input tax credit (ITC) on bulk tableware orders.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 text-lg mb-5">Bulk Tableware Specifications</h3>
              {[
                ["Material", "Upcycled rice-husk composite"],
                ["BPA-Free", "Yes — food-safe certified"],
                ["Microwave-Safe", "Yes"],
                ["Dishwasher-Safe", "Yes"],
                ["Finish", "Matte or glossy options"],
                ["MOQ", "10 units per SKU"],
                ["Custom Branding", "Laser engraving available"],
                ["GST Rate", "18% included in price"],
                ["Pan-India Delivery", "Yes — from Greater Noida"]
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-slate-500 text-sm">{label}</span>
                  <span className="text-slate-800 text-sm font-medium text-right max-w-[60%]">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
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

      <section className="bg-gradient-to-br from-[#1b7a4b] to-[#15803d] text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Get a Bulk Tableware Quote</h2>
          <p className="text-emerald-100 mb-8 max-w-xl mx-auto">Volume pricing, custom branding options, and delivery estimates — in one quick quotation request.</p>
          <Link href="/quote" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-brand-700 font-bold hover:bg-emerald-50 transition-colors shadow-lg">
            Request Free Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

