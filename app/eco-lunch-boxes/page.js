import { applySeoSettings } from "@/lib/seo";
import { staticSeoDefaults } from "@/lib/seo-defaults";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import {
  ChevronRight, Home as HomeIcon, ShieldCheck, Truck, ArrowRight,
  CheckCircle2, HelpCircle, Leaf, Package
} from "lucide-react";

export const revalidate = 300;

export async function generateMetadata() {
  return applySeoSettings("/eco-lunch-boxes", staticSeoDefaults["/eco-lunch-boxes"]);
}

export default function EcoLunchBoxesPage() {
  const siteUrl = "https://trade.greenfibre.org";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Eco Lunch Boxes", item: `${siteUrl}/eco-lunch-boxes` }
    ]
  };

  const faqList = [
    {
      q: "What materials are used in Green Fibre eco-friendly lunch boxes?",
      a: "Our eco lunch boxes are manufactured from an upcycled rice-husk crop stubble composite containing 65% plant residue sourced from farmers in Haryana and Punjab. The material is 100% BPA-free, food-safe, and free from melamine, phthalates, and other harmful chemicals."
    },
    {
      q: "Are the eco lunch boxes microwave and dishwasher safe?",
      a: "Yes. Our eco-friendly bento boxes and lunchboxes are both microwave-safe and dishwasher-safe. The durable rice-husk composite maintains its structural integrity across everyday use."
    },
    {
      q: "What is the minimum order quantity for bulk eco lunch box orders?",
      a: "The minimum order quantity (MOQ) starts at 10 units. We accommodate small pilot orders as well as large enterprise bulk orders. Volume discounts are automatically applied for larger quantities."
    },
    {
      q: "Can eco lunch boxes be custom branded with a company logo?",
      a: "Yes. We provide in-house laser engraving at our Greater Noida manufacturing plant. Our design desk delivers a free 3D visual proof within 4 hours of receiving your company's vector logo."
    },
    {
      q: "What uses are these eco lunch boxes suitable for?",
      a: "Our bulk eco lunch boxes are suitable for employee gifting, cafeteria supplies, school tiffin programs, NGO projects, hotel/restaurant takeaway, corporate welcome kits, and retail resale."
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

  const benefits = [
    { icon: <Leaf className="w-5 h-5" />, title: "BPA-Free & Food-Safe", desc: "Rice-husk composite, free from harmful chemicals" },
    { icon: <CheckCircle2 className="w-5 h-5" />, title: "Microwave & Dishwasher Safe", desc: "Durable for daily commercial use" },
    { icon: <Package className="w-5 h-5" />, title: "MOQ 10 Units", desc: "Order as few as 10, scale to thousands" },
    { icon: <ShieldCheck className="w-5 h-5" />, title: "Direct Manufacturer", desc: "Factory pricing, no middlemen" },
    { icon: <Truck className="w-5 h-5" />, title: "Pan-India Delivery", desc: "Shipped from Greater Noida to all states" },
    { icon: <CheckCircle2 className="w-5 h-5" />, title: "Laser Logo Branding", desc: "In-house engraving with free 3D proof" }
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
            <span className="text-white font-semibold">Eco Lunch Boxes</span>
          </nav>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 border border-white/30 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            BPA-Free · Food-Safe · Made in India
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5 max-w-3xl">
            Eco-Friendly Lunch Boxes Bulk India — BPA-Free Food Containers from Direct Manufacturer
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mb-8 leading-relaxed">
            Buy BPA-free, sustainable lunch boxes and bento boxes in bulk. Made from upcycled rice-husk composite. Perfect for employee gifting, cafeterias, schools, and corporate programs. MOQ 10 units.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/quote" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-700 font-bold text-sm hover:bg-emerald-50 transition-colors shadow-lg">
              Get Bulk Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/category/kitchen-dining" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/30 text-white font-semibold text-sm hover:bg-white/20 transition-colors">
              Browse Lunchboxes
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 text-center">Why Choose Green Fibre Eco Lunch Boxes?</h2>
        <p className="text-slate-500 text-center mb-10 max-w-2xl mx-auto">Our eco-friendly bento boxes are built for everyday commercial use — durable, food-safe, and sustainably made.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((f) => (
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

      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">Sustainable Eco Lunch Boxes for Bulk Orders</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Green Fibre's eco-friendly lunch boxes and bento boxes are designed for heavy daily use. The rice-husk composite shell is naturally antimicrobial, odour-resistant, and far more durable than standard plastic alternatives.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                They are ideal for companies setting up cafeteria programs, NGOs distributing meal kits, schools supplying tiffin boxes, hotels offering sustainable takeaway, and HR teams building employee onboarding welcome kits.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                Every bulk eco lunch box order is priced inclusive of 18% GST. GST-registered buyers can claim input tax credit (ITC) on their order.
              </p>
              <Link href="/quote" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-700 text-white font-bold text-sm hover:bg-brand-800 transition-colors">
                Request Bulk Quote <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 text-lg mb-5">Eco Lunch Box Specifications</h3>
              {[
                ["Material", "Upcycled rice-husk composite (65% plant residue)"],
                ["BPA-Free", "Yes — 100% free from BPA, phthalates, melamine"],
                ["Food-Safe", "Yes — certified food contact safe"],
                ["Microwave-Safe", "Yes"],
                ["Dishwasher-Safe", "Yes"],
                ["MOQ", "10 units per product"],
                ["Branding", "Laser engraving (free 3D proof in 4 hrs)"],
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
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Order Eco Lunch Boxes in Bulk Today</h2>
          <p className="text-emerald-100 mb-8 max-w-xl mx-auto">Get a free bulk quotation with volume pricing, custom branding options, and delivery estimate.</p>
          <Link href="/quote" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-brand-700 font-bold hover:bg-emerald-50 transition-colors shadow-lg">
            Get Free Bulk Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

