"use client";

import Link from "next/link";
import { optimizeImageUrl, getImageSrcSet, IMAGE_SIZES } from "@/lib/imageOptimization";

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
  const optimizedSrc = optimizeImageUrl(heroSlide.image, { width: 1600, quality: "auto" });
  const srcSet = getImageSrcSet(heroSlide.image, [480, 768, 1200, 1600, 1920]);

  return (
    <div className="relative w-full max-w-full overflow-hidden bg-stone-100 group select-none h-[42vh] min-h-[260px] sm:h-[55vh] md:h-[66vh] lg:h-[76vh] xl:h-[82vh] max-h-[720px]">
      <Link
        href={heroSlide.link}
        className="relative w-full h-full block cursor-pointer overflow-hidden group/slide"
        aria-label={heroSlide.title}
      >
        {/* Full Cover Static Banner with Next-Gen Optimization */}
        <img
          src={optimizedSrc}
          srcSet={srcSet || undefined}
          sizes={IMAGE_SIZES.hero}
          alt={heroSlide.title}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          onError={(e) => {
            if (heroSlide.localFallback && e.currentTarget.src !== heroSlide.localFallback) {
              e.currentTarget.src = heroSlide.localFallback;
            }
          }}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover/slide:scale-[1.01]"
        />
      </Link>
    </div>
  );
}

