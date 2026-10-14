export default function StoryLoading() {
  return (
    <div className="bg-slate-50 min-h-screen space-y-12 sm:space-y-16 pb-16 animate-fade-in">
      {/* Hero Skeleton */}
      <section className="bg-white border-b border-slate-200/80 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="h-6 w-32 rounded-full skeleton-shimmer-green mx-auto" />
          <div className="h-10 sm:h-12 w-3/4 sm:w-2/3 rounded-2xl skeleton-shimmer mx-auto" />
          <div className="h-4 w-full max-w-xl rounded-lg skeleton-shimmer mx-auto" />
          <div className="h-4 w-4/5 max-w-lg rounded-lg skeleton-shimmer mx-auto" />
        </div>
      </section>

      {/* 4 Stats Grid Skeleton */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 text-center">
              <div className="h-8 w-20 rounded-lg skeleton-shimmer-green mx-auto" />
              <div className="h-3.5 w-24 rounded skeleton-shimmer mx-auto" />
            </div>
          ))}
        </div>
      </section>

      {/* 2-Column Story Showcase Skeleton */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10">
          <div className="lg:col-span-6 space-y-4">
            <div className="h-5 w-28 rounded-full skeleton-shimmer-green" />
            <div className="h-8 sm:h-10 w-4/5 rounded-xl skeleton-shimmer" />
            <div className="h-4 w-full rounded skeleton-shimmer" />
            <div className="h-4 w-5/6 rounded skeleton-shimmer" />
            <div className="h-4 w-3/4 rounded skeleton-shimmer" />
          </div>
          <div className="lg:col-span-6">
            <div className="w-full aspect-[4/3] rounded-2xl skeleton-shimmer" />
          </div>
        </div>
      </section>
    </div>
  );
}
