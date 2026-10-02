"use client";

import Link from "next/link";
import { AddToQuote } from "./Quote";

export default function Card({ p, context }) {
  const targetContext =
    context ||
    p.activeContext?.key ||
    (p.category === "Corporate"
      ? "corporate"
      : p.category === "Anniversary"
        ? "anniversary"
        : p.category === "Wedding"
          ? "wedding"
          : null);

  const productHref = targetContext
    ? `/products/${p.slug}?context=${encodeURIComponent(targetContext)}`
    : `/products/${p.slug}`;

  return (
    <article className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 hover:border-brand-400/80 shadow-2xs hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col overflow-hidden">
      {/* Media & Badges */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden flex items-center justify-center">
        {/* Category Badge - floating top-left */}
        {p.category && (
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/95 text-slate-700 border border-slate-200/70 shadow-2xs">
              {p.category}
            </span>
          </div>
        )}

        {/* Finishes Badge - floating top-right */}
        {p.colours?.length > 1 && (
          <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-slate-900/65 text-white backdrop-blur-xs">
              {p.colours.length} finishes
            </span>
          </div>
        )}

        <Link href={productHref} className="block w-full h-full relative" aria-label={`View ${p.name}`}>
          {p.image ? (
            <img
              src={p.image}
              alt={p.name}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = "none";
                const fallback = e.currentTarget.parentElement?.querySelector(".img-fallback-badge");
                if (fallback) fallback.style.display = "flex";
              }}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
            />
          ) : null}
          <div
            className="img-fallback-badge w-full h-full flex flex-col items-center justify-center bg-slate-50 text-emerald-800 p-4"
            style={{ display: p.image ? "none" : "flex" }}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center justify-center text-xl font-black shadow-2xs">
              {p.name ? p.name[0].toUpperCase() : "G"}
            </div>
          </div>
        </Link>
      </div>

      {/* Body Content */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between gap-2.5">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors line-clamp-1">
            <Link href={productHref}>
              {p.name}
            </Link>
          </h3>

          <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-1 leading-snug">
            {p.tagline || p.desc}
          </p>

          {/* Pricing & MOQ */}
          <div className="flex items-baseline justify-between mt-1.5">
            <div className="flex items-baseline gap-1">
              <span className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                {typeof p.price === "number" ? `₹${p.price}` : "₹0"}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                /{p.unit || "unit"}
              </span>
            </div>
            <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[10px] font-bold bg-slate-50 text-slate-800 border border-slate-200 whitespace-nowrap">
              MOQ {p.moq}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-slate-100">
          <AddToQuote p={p} />
        </div>
      </div>
    </article>
  );
}
