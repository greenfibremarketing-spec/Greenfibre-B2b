export default function ProductsLoading() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5 pb-12 sm:pb-16 space-y-6">
      {/* Dynamic Page Header Skeleton */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeleton-shimmer-green border border-emerald-200/50 w-36 h-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="h-8 sm:h-9 w-72 sm:w-[420px] rounded-xl skeleton-shimmer" />
        <div className="h-4 w-full max-w-2xl rounded-lg skeleton-shimmer" />
      </div>

      {/* Filter and Search Bar Skeleton */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Category Tabs Skeleton */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
            <div className="h-7 w-24 rounded-lg skeleton-shimmer-green border border-emerald-200/60 flex-shrink-0" />
            <div className="h-7 w-28 rounded-lg skeleton-shimmer flex-shrink-0" />
            <div className="h-7 w-36 rounded-lg skeleton-shimmer flex-shrink-0" />
            <div className="h-7 w-28 rounded-lg skeleton-shimmer flex-shrink-0" />
            <div className="h-7 w-24 rounded-lg skeleton-shimmer flex-shrink-0" />
            <div className="h-7 w-28 rounded-lg skeleton-shimmer flex-shrink-0" />
            <div className="h-7 w-36 rounded-lg skeleton-shimmer flex-shrink-0" />
          </div>

          {/* Search Form Skeleton */}
          <div className="relative flex-shrink-0 min-w-[260px] h-9 rounded-lg skeleton-shimmer border border-slate-200" />
        </div>

        {/* Results summary bar */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="h-3.5 w-48 rounded-md skeleton-shimmer" />
          <div className="h-3.5 w-20 rounded-md skeleton-shimmer" />
        </div>
      </div>

      {/* Products Grid Skeleton (8 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div
            key={item}
            className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3.5 shadow-2xs hover:shadow-sm transition-all overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Image with badges */}
              <div className="w-full aspect-square rounded-xl skeleton-shimmer relative overflow-hidden">
                <div className="absolute top-2.5 left-2.5 h-5 w-16 rounded-md skeleton-shimmer-green" />
                <div className="absolute top-2.5 right-2.5 h-5 w-12 rounded-md skeleton-shimmer" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 h-5 rounded-md skeleton-shimmer-green/60" />
              </div>

              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <div className="h-3.5 w-20 rounded-md skeleton-shimmer" />
                <div className="h-3.5 w-12 rounded-md skeleton-shimmer" />
              </div>

              {/* Title & Tagline */}
              <div className="space-y-1.5">
                <div className="h-5 w-4/5 rounded-md skeleton-shimmer" />
                <div className="h-3.5 w-full rounded-md skeleton-shimmer" />
              </div>

              {/* 3 Tier Pricing Preview Pills */}
              <div className="grid grid-cols-3 gap-1 pt-1">
                <div className="h-9 rounded-lg skeleton-shimmer-green border border-emerald-100" />
                <div className="h-9 rounded-lg skeleton-shimmer border border-slate-100" />
                <div className="h-9 rounded-lg skeleton-shimmer border border-slate-100" />
              </div>
            </div>

            {/* Price & CTA Action */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-baseline justify-between">
                <div className="h-5 w-24 rounded-md skeleton-shimmer" />
                <div className="h-3.5 w-14 rounded-md skeleton-shimmer" />
              </div>
              <div className="h-9 w-full rounded-xl skeleton-shimmer-green border border-emerald-200/70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
