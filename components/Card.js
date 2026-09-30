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
    <article className="group bg-white rounded-2xl border border-slate-200/90 hover:border-brand-400/80 shadow-sm hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col overflow-hidden">
      {/* Media & Badges */}
      <div className="relative aspect-square bg-white overflow-hidden flex items-center justify-center">
        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between gap-1 pointer-events-none">
          {p.popular ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-brand-600 text-white shadow-sm">
              Bestseller
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#FAF7F0] text-slate-800 border border-[#E5DAC8] shadow-sm">
              {p.sku}
            </span>
          )}
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-white/95 text-slate-700 border border-slate-200 shadow-sm">
            {p.category}
          </span>
        </div>

        <Link href={productHref} className="block w-full h-full" aria-label={`View ${p.name}`}>
          {p.image ? (
            <img
              src={p.image}
              alt={p.name}
              loading="lazy"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold text-3xl">
              {p.name[0]}
            </div>
          )}
        </Link>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-brand-800 bg-brand-50 px-2 py-0.5 rounded border border-brand-200 text-[10px] uppercase tracking-wide">
              Gift Set • {p.size || "Multi-Piece"}
            </span>
            <span className="inline-flex items-center text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {p.colours?.length || 1} Finishes
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors line-clamp-1">
            <Link href={productHref}>
              {p.name}
            </Link>
          </h3>


          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {p.tagline || p.desc}
          </p>
        </div>

        {/* Pricing & MOQ */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-[11px] font-medium text-slate-400 block">From</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-slate-900 tracking-tight">
                  {typeof p.price === "number" ? `₹${p.price}` : "₹0"}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  /gift set
                </span>
              </div>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#FAF7F0] text-slate-800 border border-[#E5DAC8]">
              MOQ {p.moq} {p.moq === 1 ? "Gift Set" : "Gift Sets"}
            </span>
          </div>

          {/* Add to Basket Action Row */}
          <div>
            <AddToQuote p={p} />
          </div>
        </div>
      </div>
    </article>
  );
}
