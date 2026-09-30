"use client";

import { useState } from "react";

const faqs = [
  {
    q: "What is your Minimum Order Quantity (MOQ) for custom branded orders?",
    a: "Our standard MOQ is 25 units for gift hampers and 50–100 units for individual tumblers, mugs, and bowls. For unbranded plain stock, we can often accommodate lower quantities."
  },
  {
    q: "How does laser engraving and logo branding work?",
    a: "You send us your logo file (.ai, .svg, .pdf, or high-res png). Our design team prepares a 3D digital proof showing the exact placement, size, and finish within 4 hours. Once you approve the digital proof, we run it on our fiber laser machines—resulting in a permanent, clean finish that won't fade or peel."
  },
  {
    q: "Are the products genuinely dishwasher and microwave safe?",
    a: "Yes. Our rice-husk composite tableware is rigorously tested to US FDA 21 CFR and LFGB standards. It is 100% BPA-free, tested for 500+ cycles in commercial dishwashers, and safe for microwave reheating (up to 3 minutes at 120°C)."
  },
  {
    q: "Can we order a physical sample before placing the full bulk order?",
    a: "Yes, definitely. You can order our ₹499 Sample Box with 4 popular products, or request a custom pre-production sample with your actual logo. We dispatch sample kits within 24–48 hours, and credit the sample cost toward your bulk order."
  },
  {
    q: "What are your payment terms and GST invoicing?",
    a: "We provide official GST tax invoices with 18% HSN input tax credit. Standard terms are 50% advance upon PO confirmation and 50% prior to dispatch. For established corporate enterprises and vendor portals (e.g. Coupa, SAP Ariba), we support 30-day net payment terms."
  },
  {
    q: "Do you offer multi-location doorstep delivery for remote employees?",
    a: "Yes. For hybrid employee welcome kits and festive gifting, we handle individual packaging and doorstep delivery across 19,000+ PIN codes in India with live tracking updates."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`bg-white border transition-all duration-300 rounded-2xl overflow-hidden ${
              isOpen
                ? "border-brand-500/80 shadow-md ring-1 ring-brand-400/20"
                : "border-slate-200/90 hover:border-slate-300 hover:shadow-sm"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : idx)}
              className="w-full px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer select-none"
              aria-expanded={isOpen}
            >
              <span className="font-bold text-slate-900 text-sm sm:text-base">
                {faq.q}
              </span>
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  isOpen
                    ? "bg-brand-600 text-white rotate-45 shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                +
              </span>
            </button>
            <div
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                {faq.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
