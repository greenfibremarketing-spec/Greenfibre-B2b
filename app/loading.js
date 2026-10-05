export default function GlobalLoading() {
  return (
    <div className="bg-slate-100 space-y-8 sm:space-y-10 pb-12 overflow-x-hidden w-full max-w-full animate-fade-in">
      {/* ── 1. Full-Width Hero Banner Skeleton ───────────────────────────── */}
      <section className="w-full max-w-full overflow-hidden h-[58vh] min-h-[350px] sm:h-[70vh] md:h-[82vh] lg:h-[96vh] max-h-[96vh] skeleton-shimmer relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
        <div className="max-w-[1440px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16 lg:pb-20 space-y-4">
          <div className="h-6 w-36 rounded-full skeleton-shimmer-green border border-emerald-300/40" />
          <div className="h-9 sm:h-12 lg:h-16 w-3/4 sm:w-1/2 rounded-2xl skeleton-shimmer bg-white/70 backdrop-blur-xs" />
          <div className="h-4 sm:h-5 w-2/3 sm:w-1/3 rounded-lg skeleton-shimmer bg-white/50" />
          <div className="flex gap-3 pt-2">
            <div className="h-10 sm:h-12 w-36 sm:w-44 rounded-xl skeleton-shimmer-green border border-emerald-400/50" />
            <div className="h-10 sm:h-12 w-32 sm:w-40 rounded-xl skeleton-shimmer bg-white/80" />
          </div>
        </div>
      </section>

      {/* ── 2. Featured Products Catalog Section Skeleton ─────────────────── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Header */}
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-2">
            <div className="h-5 w-28 rounded-full skeleton-shimmer-green border border-emerald-200/60" />
            <div className="h-7 sm:h-9 w-64 sm:w-96 rounded-xl skeleton-shimmer" />
          </div>
          <div className="h-8 sm:h-9 w-24 sm:w-28 rounded-xl skeleton-shimmer" />
        </div>

        {/* Category Filter Pills Skeleton */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <div className="h-7 w-24 rounded-lg skeleton-shimmer-green border border-emerald-200 flex-shrink-0" />
          <div className="h-7 w-32 rounded-lg skeleton-shimmer flex-shrink-0" />
          <div className="h-7 w-36 rounded-lg skeleton-shimmer flex-shrink-0" />
          <div className="h-7 w-28 rounded-lg skeleton-shimmer flex-shrink-0" />
          <div className="h-7 w-32 rounded-lg skeleton-shimmer flex-shrink-0" />
          <div className="h-7 w-28 rounded-lg skeleton-shimmer flex-shrink-0" />
        </div>

        {/* Product Cards Grid Skeleton (8 Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div
              key={item}
              className="bg-white border border-slate-200/90 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-3 shadow-2xs flex flex-col justify-between"
            >
              <div className="space-y-2.5 sm:space-y-3">
                {/* Product Image Placeholder */}
                <div className="w-full aspect-square rounded-lg sm:rounded-xl skeleton-shimmer relative overflow-hidden">
                  <div className="absolute top-2 left-2 h-4 sm:h-5 w-12 sm:w-16 rounded skeleton-shimmer-green" />
                  <div className="absolute top-2 right-2 h-4 sm:h-5 w-10 sm:w-12 rounded skeleton-shimmer" />
                </div>

                {/* Category & Badge */}
                <div className="flex items-center justify-between">
                  <div className="h-3 w-16 sm:w-20 rounded skeleton-shimmer" />
                  <div className="h-3 w-10 sm:w-12 rounded skeleton-shimmer" />
                </div>

                {/* Title & Tagline */}
                <div className="space-y-1.5">
                  <div className="h-4 sm:h-5 w-4/5 rounded skeleton-shimmer" />
                  <div className="h-3 w-full rounded skeleton-shimmer" />
                </div>

                {/* 3 Tier Pricing preview */}
                <div className="grid grid-cols-3 gap-1 pt-0.5">
                  <div className="h-7 sm:h-8 rounded skeleton-shimmer-green border border-emerald-100" />
                  <div className="h-7 sm:h-8 rounded skeleton-shimmer border border-slate-100" />
                  <div className="h-7 sm:h-8 rounded skeleton-shimmer border border-slate-100" />
                </div>
              </div>

              {/* Price & Action Button */}
              <div className="pt-2 sm:pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-baseline justify-between">
                  <div className="h-4 sm:h-5 w-20 sm:w-24 rounded skeleton-shimmer" />
                  <div className="h-3 w-12 rounded skeleton-shimmer" />
                </div>
                <div className="h-8 sm:h-9 w-full rounded-lg sm:rounded-xl skeleton-shimmer-green border border-emerald-200/70" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Showcase Section Skeleton ──────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="h-5 w-32 rounded-full skeleton-shimmer-green" />
            <div className="h-7 sm:h-8 w-72 sm:w-96 rounded-xl skeleton-shimmer" />
            <div className="h-4 w-full max-w-xl rounded skeleton-shimmer" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="h-32 rounded-xl skeleton-shimmer" />
            <div className="h-32 rounded-xl skeleton-shimmer" />
            <div className="h-32 rounded-xl skeleton-shimmer" />
          </div>
        </div>
      </section>
    </div>
  );
}
