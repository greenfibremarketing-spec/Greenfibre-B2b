export default function QuoteLoading() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 animate-fade-in">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="h-4 w-72 sm:w-96 rounded skeleton-shimmer" />
        <div className="h-6 w-48 rounded-full skeleton-shimmer-green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Quotation Summary Card Skeleton */}
        <div className="lg:col-span-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="h-6 w-40 rounded skeleton-shimmer" />
            <div className="h-6 w-24 rounded skeleton-shimmer" />
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="h-5 w-44 rounded skeleton-shimmer" />
                <div className="h-3.5 w-60 rounded skeleton-shimmer" />
              </div>
              <div className="h-7 w-20 rounded-lg skeleton-shimmer" />
            </div>

            <div className="border-t border-dashed border-slate-200" />

            {/* 3 Item Rows */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center py-2">
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-48 rounded skeleton-shimmer" />
                  <div className="h-3 w-32 rounded skeleton-shimmer" />
                </div>
                <div className="h-5 w-20 rounded skeleton-shimmer" />
              </div>
            ))}

            <div className="border-t border-dashed border-slate-200" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-3.5 w-32 rounded skeleton-shimmer" />
                <div className="h-3.5 w-20 rounded skeleton-shimmer" />
              </div>
              <div className="flex justify-between">
                <div className="h-3.5 w-40 rounded skeleton-shimmer" />
                <div className="h-3.5 w-24 rounded skeleton-shimmer" />
              </div>
            </div>

            {/* Big Green Summary Banner Skeleton */}
            <div className="h-16 rounded-xl skeleton-shimmer-green border border-emerald-300/70" />

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="h-11 rounded-xl skeleton-shimmer" />
              <div className="h-11 rounded-xl skeleton-shimmer-green" />
            </div>
          </div>
        </div>

        {/* Right Column: Details Form Skeleton */}
        <div className="lg:col-span-6 space-y-5">
          <div className="h-6 w-36 rounded skeleton-shimmer" />
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="space-y-1.5">
              <div className="h-3.5 w-24 rounded skeleton-shimmer" />
              <div className="h-10 w-full rounded-lg skeleton-shimmer" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="h-3.5 w-28 rounded skeleton-shimmer" />
                <div className="h-10 w-full rounded-lg skeleton-shimmer" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3.5 w-28 rounded skeleton-shimmer" />
                <div className="h-10 w-full rounded-lg skeleton-shimmer" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="h-3.5 w-20 rounded skeleton-shimmer" />
                <div className="h-10 w-full rounded-lg skeleton-shimmer" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3.5 w-20 rounded skeleton-shimmer" />
                <div className="h-10 w-full rounded-lg skeleton-shimmer" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-3.5 w-32 rounded skeleton-shimmer" />
              <div className="h-20 w-full rounded-lg skeleton-shimmer" />
            </div>
            <div className="h-12 w-full rounded-xl skeleton-shimmer-green border border-emerald-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
