export default function ContactLoading() {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-5 w-28 rounded-full skeleton-shimmer-green" />
        <div className="h-8 sm:h-10 w-72 sm:w-[480px] rounded-xl skeleton-shimmer" />
        <div className="h-4 w-full max-w-2xl rounded skeleton-shimmer" />
      </div>

      {/* Main 2-Column Contact Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Skeleton (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 space-y-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="h-3.5 w-20 rounded skeleton-shimmer" />
              <div className="h-10 w-full rounded-xl skeleton-shimmer" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3.5 w-24 rounded skeleton-shimmer" />
              <div className="h-10 w-full rounded-xl skeleton-shimmer" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="h-3.5 w-28 rounded skeleton-shimmer" />
              <div className="h-10 w-full rounded-xl skeleton-shimmer" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3.5 w-20 rounded skeleton-shimmer" />
              <div className="h-10 w-full rounded-xl skeleton-shimmer" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="h-3.5 w-32 rounded skeleton-shimmer" />
            <div className="h-24 w-full rounded-xl skeleton-shimmer" />
          </div>
          <div className="h-12 w-full rounded-xl skeleton-shimmer-green border border-emerald-300" />
        </div>

        {/* Right Column: Contact Cards Skeleton (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-2 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl skeleton-shimmer-green flex-shrink-0" />
                <div className="space-y-1 flex-1">
                  <div className="h-4 w-32 rounded skeleton-shimmer" />
                  <div className="h-3 w-48 rounded skeleton-shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
