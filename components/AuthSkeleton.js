export default function AuthSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px] animate-fade-in">
      {/* Left Column Skeleton */}
      <div className="lg:col-span-5 bg-gradient-to-br from-[#0f3428] via-[#155a3d] to-[#1c7a52] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
        <div className="space-y-4 relative z-10">
          <div className="h-6 w-32 rounded-lg skeleton-shimmer bg-white/20" />
          <div className="h-8 w-48 rounded-xl skeleton-shimmer bg-white/30" />
          <div className="h-4 w-full rounded skeleton-shimmer bg-white/15" />
          <div className="h-4 w-3/4 rounded skeleton-shimmer bg-white/15" />
        </div>
        <div className="space-y-3 pt-8 relative z-10">
          <div className="h-4 w-52 rounded skeleton-shimmer bg-white/20" />
          <div className="h-4 w-44 rounded skeleton-shimmer bg-white/20" />
          <div className="h-4 w-48 rounded skeleton-shimmer bg-white/20" />
        </div>
      </div>

      {/* Right Column Skeleton */}
      <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center space-y-5 bg-white">
        <div className="flex justify-center mb-2">
          <div className="h-10 w-64 rounded-xl skeleton-shimmer" />
        </div>
        <div className="space-y-2 text-center sm:text-left">
          <div className="h-6 w-48 rounded-lg skeleton-shimmer" />
          <div className="h-3.5 w-64 rounded skeleton-shimmer" />
        </div>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <div className="h-3.5 w-28 rounded skeleton-shimmer" />
            <div className="h-11 w-full rounded-xl skeleton-shimmer" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3.5 w-20 rounded skeleton-shimmer" />
            <div className="h-11 w-full rounded-xl skeleton-shimmer" />
          </div>
          <div className="h-12 w-full rounded-xl skeleton-shimmer-green border border-emerald-300/60" />
        </div>
      </div>
    </div>
  );
}
