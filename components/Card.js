"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AddToQuote } from "./Quote";

export default function Card({ p, context }) {
  const [imgError, setImgError] = useState(false);

  // Always use the clean canonical URL for internal links (no ?context= query param)
  const productHref = `/products/${p.slug}`;

  // Descriptive alt text: "<product name> - <short material descriptor>"
  const materialDescriptor =
    p.material ||
    "Upcycled Rice-Husk Biocomposite Tableware";
  const imageAlt = `${p.name} - ${materialDescriptor}`;
  const showImage = Boolean(p.image && !imgError);

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

        <Link href={productHref} className="block w-full h-full relative" aria-label={`View ${p.name}`}>
          {showImage ? (
            <Image
              src={p.image}
              alt={imageAlt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImgError(true)}
              className="object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
            />
          ) : (
            <div className="img-fallback-badge w-full h-full flex flex-col items-center justify-center bg-slate-50 text-emerald-800 p-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center justify-center text-xl font-black shadow-2xs">
                {p.name ? p.name[0].toUpperCase() : "G"}
              </div>
            </div>
          )}
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

          {/* Pricing */}
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
              {typeof p.price === "number" ? `₹${p.price}` : "₹0"}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              /{p.unit || "unit"}
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
