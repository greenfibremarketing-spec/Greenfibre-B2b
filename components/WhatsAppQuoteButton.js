"use client";

import { ExternalLink } from "lucide-react";

export const WHATSAPP_NUMBER = "919211338066";
export const WHATSAPP_DISPLAY_PHONE = "+91 92113 38066";

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hi Greenfibre Team,\n\nI would like to request a wholesale B2B quote for sustainable tableware & corporate gifting.\n\nCould you please share your latest catalog and tier pricing?";

export const WHATSAPP_QUOTE_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_DEFAULT_MESSAGE
)}`;

/**
 * Premium Crisp Official WhatsApp Vector Icon
 */
export function WhatsAppIcon({ className = "w-4 h-4", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.711 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.414z" />
    </svg>
  );
}

/**
 * Premium Navbar WhatsApp Request Quote Button
 * Adapts seamlessly: Sleek circular icon with live indicator on mobile, luxury pill CTA on tablet & desktop.
 */
export function NavbarWhatsAppQuote({ className = "" }) {
  return (
    <a
      href={WHATSAPP_QUOTE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Request Quote on WhatsApp"
      title="Request B2B Quote on WhatsApp (+91 92113 38066)"
      className={`relative group flex items-center justify-center gap-2 h-9 sm:h-10 px-0 sm:px-3.5 w-9 sm:w-auto rounded-full bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-xs hover:shadow-[0_4px_18px_rgba(16,185,129,0.38)] border border-emerald-400/40 hover:border-emerald-300 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 flex-shrink-0 cursor-pointer ${className}`}
    >
      {/* Gloss Highlight Overlay */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-60 pointer-events-none" />

      {/* WhatsApp Icon */}
      <WhatsAppIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-200 drop-shadow-xs" />

      {/* Desktop Text */}
      <span className="hidden sm:inline-block tracking-tight text-[12.5px] font-bold text-white whitespace-nowrap drop-shadow-xs">
        Request Quote
      </span>

      {/* Live Online Pulse Dot */}
      <span className="absolute -top-0.5 -right-0.5 sm:relative sm:top-auto sm:right-auto flex h-2 sm:h-2 w-2 sm:w-2 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-80" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-200 border border-white/80" />
      </span>
    </a>
  );
}

/**
 * Floating Global WhatsApp Quick Quote Widget
 * Sticky on bottom-right on both mobile and desktop with luxury styling & animated pulse.
 */
export function FloatingWhatsAppQuote() {
  return (
    <aside
      aria-label="Quick WhatsApp Quote"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center flex-row-reverse gap-2 pointer-events-auto select-none"
    >
      {/* Floating Action Trigger */}
      <a
        href={WHATSAPP_QUOTE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Request Instant Quote on WhatsApp"
        className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-[#25D366] to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_6px_25px_rgba(22,163,74,0.45)] hover:shadow-[0_8px_32px_rgba(22,163,74,0.6)] border-2 border-white/90 transition-all duration-300 hover:scale-108 active:scale-95 group cursor-pointer"
        title="Chat on WhatsApp (+91 92113 38066) for instant quote"
      >
        {/* Soft Ambient Radiance Pulse Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping pointer-events-none" />

        {/* Gloss Top Specular Light */}
        <span className="absolute inset-x-1.5 top-1 h-3 rounded-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

        {/* WhatsApp Icon */}
        <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-md group-hover:scale-110 transition-transform duration-200 relative z-10" />
      </a>

      {/* Floating Pill Tooltip / Label (Visible on desktop or on hover) */}
      <a
        href={WHATSAPP_QUOTE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-emerald-200 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_24px_rgba(22,163,74,0.2)] text-slate-800 transition-all duration-200 hover:-translate-x-1 group/pill"
      >
        <div className="flex flex-col text-left">
          <span className="text-[12px] font-extrabold text-slate-900 group-hover/pill:text-emerald-700 transition-colors flex items-center gap-1 leading-tight">
            <span>Request Quote</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </span>
          <span className="text-[10px] text-slate-500 font-medium leading-tight">
            Direct WhatsApp Desk
          </span>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-emerald-600 group-hover/pill:translate-x-0.5 transition-transform" />
      </a>
    </aside>
  );
}
