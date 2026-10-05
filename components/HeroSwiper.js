"use client";

import Link from "next/link";

// Displaying only the 1st hero image banner as requested (paused slider)
const heroSlide = {
  id: 1,
  image: "https://res.cloudinary.com/dsebrpcyz/image/upload/v1790920945/Untitled_-_September_30_2026_at_12.51.23-1_h6plax.png",
  localFallback: "/images/hero/hero-slide-1.png",
  title: "Sustainable Living Beautifully Yours",
  badge: "100% Upcycled Rice Husk",
  link: "/products"
};

export default function HeroSwiper() {
  return (
    <div className="relative w-full max-w-full overflow-hidden bg-stone-100 group select-none h-[58vh] min-h-[350px] sm:h-[70vh] md:h-[82vh] lg:h-[96vh] max-h-[96vh]">
      <Link
        href={heroSlide.link}
        className="relative w-full h-full block cursor-pointer overflow-hidden group/slide"
        aria-label={heroSlide.title}
      >
        {/* Full Cover Static Banner */}
        <img
          src={heroSlide.image}
          alt={heroSlide.title}
          loading="eager"
          onError={(e) => {
            if (heroSlide.localFallback && e.currentTarget.src !== heroSlide.localFallback) {
              e.currentTarget.src = heroSlide.localFallback;
            }
          }}
          className="w-full h-full object-cover object-left sm:object-center transition-transform duration-700 ease-out group-hover/slide:scale-[1.01]"
        />
      </Link>
    </div>
  );
}
