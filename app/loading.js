export default function GlobalLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-5">
      {/* Animated Brand Sprout Icon Ring */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping" />
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-600/25 animate-pulse">
          <svg
            className="w-7 h-7 text-white animate-spin"
            style={{ animationDuration: "3s" }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </div>
      </div>

      {/* Brand Text Shimmer */}
      <div className="space-y-2 text-center">
        <div className="h-5 w-40 rounded-lg skeleton-shimmer-green mx-auto" />
        <div className="h-3.5 w-60 rounded-md skeleton-shimmer mx-auto" />
      </div>
    </div>
  );
}
