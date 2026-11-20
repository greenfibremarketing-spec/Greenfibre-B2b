import { applySeoSettings } from "@/lib/seo";
import { staticSeoDefaults } from "@/lib/seo-defaults";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import {
  ChevronRight, Home as HomeIcon, ShieldCheck, Truck, ArrowRight,
  CheckCircle2, HelpCircle, Leaf, Coffee
} from "lucide-react";

export const revalidate = 300;

export async function generateMetadata() {
  return applySeoSettings("/wholesale-drinkware", staticSeoDefaults["/wholesale-drinkware"]);
}

export default function WholesaleDrinkwarePage() {
  const siteUrl = "https://trade.greenfibre.org";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Wholesale Drinkware", item: `${siteUrl}/wholesale-drinkware` }
    ]
  };

  const faqList = [
    {
      q: "What wholesale drinkware products does Green Fibre manufacture?",
      a: "Green Fibre manufactures a range of wholesale drinkware including eco-friendly water bottles (600ml–1L), thermal double-wall bottles, coffee mugs, travel tumblers, and statement mugs. All products are made from upcycled rice-husk composite, BPA-free, and food-safe."
    },
    {
      q: "What is the minimum order quantity for bulk drinkware?",
      a: "Our MOQ is 10 units per product. We handle everything from small pilot orders to large enterprise bulk procurement with automatic volume discounts."
    },
    {
      q: "Can wholesale water bottles and mugs have custom logo engraving?",
      a: "Yes. We offer professional in-house laser engraving at our Greater Noida manufacturing plant. We provide a free 3D visual proof within 4 hours of receiving your vector logo file."
    },
    {
      q: "Are the eco-friendly water bottles thermal / insulated?",
      a: "Our Viora thermal bottle range features a double-wall construction with a stainless steel inner and a durable rice-husk composite shell, providing thermal insulation for both hot and cold beverages."
    },
    {
      q: "Who typically buys wholesale drinkware from Green Fibre?",
      a: "Our wholesale drinkware is purchased by HR teams for employee onboarding welcome kits, corporates for Diwali gifting, hotels and resorts for branded amenities, schools and universities for campus programs, and resellers looking for sustainable private-label drinkware in India."
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

  const products = [
    { name: "Viora Water Bottle (600ml)", desc: "Eco-friendly, BPA-free, rice-husk composite body" },
    { name: "Viora Thermal Bottle", desc: "Double-wall, stainless steel inner, rice-husk shell" },
    { name: "Statement Mug", desc: "Wide-mouth, comfortable grip, laser branding ready" },
    { name: "Flora Soup Bowl", desc: "Dual-purpose bowl — soups, beverages, snacks" }
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
            <span className="text-white font-semibold">Wholesale Drinkware</span>
          </nav>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 border border-white/30 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            Eco-Friendly Drinkware · Direct Manufacturer
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5 max-w-3xl">
            Wholesale Drinkware India — Custom Branded Water Bottles &amp; Mugs Bulk from Manufacturer
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mb-8 leading-relaxed">
            Buy eco-friendly wholesale drinkware in bulk — thermal bottles, water bottles, coffee mugs, and tumblers made from upcycled rice-husk composite. Custom laser logo branding. MOQ 10 units. Pan-India delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/quote" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-700 font-bold text-sm hover:bg-emerald-50 transition-colors shadow-lg">
              Get Bulk Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/category/drinkware" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/30 text-white font-semibold text-sm hover:bg-white/20 transition-colors">
              Browse Drinkware
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 text-center">Our Wholesale Drinkware Range</h2>
        <p className="text-slate-500 text-center mb-10 max-w-2xl mx-auto">Every product in our drinkware range is designed for bulk commercial use — durable, BPA-free, and laser-brand-ready.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {products.map((p) => (
            <div key={p.name} className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-700 text-white flex items-center justify-center">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{p.name}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">Why Buy Wholesale Drinkware from Green Fibre?</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Green Fibre is a direct manufacturer of eco-friendly wholesale drinkware based in Greater Noida. Our bottles and mugs are made from an upcycled rice-husk crop stubble composite — 65% plant residue, BPA-free, and food-safe.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                We offer custom laser engraving for corporate logo branding, making our drinkware the ideal choice for employee onboarding kits, corporate Diwali gifting, branded hotel amenities, and reseller programs.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                All wholesale drinkware prices are inclusive of 18% GST. GST-registered buyers can claim full input tax credit (ITC).
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                {[
                  ["Bulk wholesale pricing", "✓"], ["Custom logo engraving", "✓"],
                  ["BPA-free & food-safe", "✓"], ["Pan-India delivery", "✓"],
                  ["Free 3D design proof", "✓"], ["MOQ 10 units", "✓"]
                ].map(([label]) => (
                  <div key={label} />
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {["Bulk wholesale pricing", "Custom logo engraving", "BPA-free & food-safe", "Pan-India delivery", "Free 3D design proof", "MOQ from 10 units"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 text-lg mb-5">Wholesale Drinkware Specifications</h3>
              {[
                ["Material", "Upcycled rice-husk composite"],
                ["BPA-Free", "Yes — food-safe certified"],
                ["Thermal Option", "Double-wall stainless inner"],
                ["Capacities", "600ml, 750ml, 1L"],
                ["MOQ", "10 units per SKU"],
                ["Branding", "In-house laser engraving"],
                ["Proof", "Free 3D mock-up in 4 hours"],
                ["GST", "18% included — ITC claimable"],
                ["Delivery", "Pan-India from Greater Noida"]
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
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Order Wholesale Drinkware in Bulk</h2>
          <p className="text-emerald-100 mb-8 max-w-xl mx-auto">Get a customized bulk quotation with volume pricing, custom branding, and delivery timelines.</p>
          <Link href="/quote" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-brand-700 font-bold hover:bg-emerald-50 transition-colors shadow-lg">
            Get Free Bulk Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

