export default function ProductDetailLoading() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-12 rounded-md skeleton-shimmer" />
        <div className="h-4 w-3 rounded-md skeleton-shimmer" />
        <div className="h-4 w-20 rounded-md skeleton-shimmer" />
        <div className="h-4 w-3 rounded-md skeleton-shimmer" />
        <div className="h-4 w-32 rounded-md skeleton-shimmer-green" />
      </div>

      {/* Main 2-Column Product Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* LEFT: Image Gallery Skeleton (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image */}
          <div className="w-full aspect-square rounded-2xl skeleton-shimmer relative overflow-hidden border border-slate-200/80 shadow-sm">
            <div className="absolute top-4 left-4 h-6 w-28 rounded-full skeleton-shimmer-green" />
            <div className="absolute top-4 right-4 h-6 w-20 rounded-full skeleton-shimmer" />
          </div>

          {/* Thumbnails Row */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-20 h-20 rounded-xl skeleton-shimmer border border-slate-200/80 flex-shrink-0"
              />
            ))}
          </div>

          {/* Sustainability Callout Box */}
          <div className="p-4 rounded-2xl skeleton-shimmer-green border border-emerald-200/60 space-y-2">
            <div className="h-4 w-44 rounded-md skeleton-shimmer" />
            <div className="h-3 w-full rounded-md skeleton-shimmer" />
            <div className="h-3 w-3/4 rounded-md skeleton-shimmer" />
          </div>
        </div>

        {/* RIGHT: Product Info & B2B Actions (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Badge & Title */}
          <div className="space-y-3">
            <div className="inline-flex h-6 w-32 rounded-full skeleton-shimmer-green border border-emerald-200/60" />
            <div className="h-8 sm:h-10 w-4/5 rounded-xl skeleton-shimmer" />
            <div className="h-4 w-full rounded-lg skeleton-shimmer" />
            <div className="h-4 w-2/3 rounded-lg skeleton-shimmer" />
          </div>

          {/* Price & Discount Banner */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-baseline gap-3">
              <div className="h-8 w-36 rounded-lg skeleton-shimmer" />
              <div className="h-5 w-24 rounded-md skeleton-shimmer" />
              <div className="h-6 w-20 rounded-full skeleton-shimmer-green" />
            </div>
            <div className="h-3.5 w-64 rounded-md skeleton-shimmer" />
          </div>

          {/* 3 Tier Pricing Cards Skeleton */}
          <div className="space-y-2.5">
            <div className="h-4 w-40 rounded-md skeleton-shimmer" />
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((tier) => (
                <div
                  key={tier}
                  className={`p-3.5 rounded-xl border space-y-2 ${
                    tier === 2
                      ? "skeleton-shimmer-green border-emerald-300"
                      : "skeleton-shimmer border-slate-200"
                  }`}
                >
                  <div className="h-3.5 w-16 rounded-md skeleton-shimmer" />
                  <div className="h-6 w-20 rounded-md skeleton-shimmer" />
                  <div className="h-3 w-12 rounded-md skeleton-shimmer" />
                </div>
              ))}
            </div>
          </div>

          {/* Quantity & CTA Button Skeleton */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded-md skeleton-shimmer" />
              <div className="h-9 w-32 rounded-lg skeleton-shimmer" />
            </div>
            <div className="h-12 w-full rounded-xl skeleton-shimmer-green border border-emerald-300 shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
