"use client";

import { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight, ArrowRight, Sprout } from "lucide-react";
import { optimizeImageUrl, getImageSrcSet, IMAGE_SIZES } from "@/lib/imageOptimization";

// Import Swiper styling
import "swiper/css";
import "swiper/css/pagination";

const heroSlides = [
  {
    id: 1,
    image: "https://res.cloudinary.com/dsebrpcyz/image/upload/v1794983284/Premium_Kraft_Paper_Gift_Set_prfuxv.webp",
    localFallback: "/images/hero/hero-slide-1.png",
    title: "Premium Kraft Paper Sustainable Gift Sets",
    badge: "100% Upcycled Rice Husk",
    link: "/products"
  },
  {
    id: 2,
    image: "https://res.cloudinary.com/dsebrpcyz/image/upload/v1794983323/ChatGPT_Image_Nov_18_2026_11_58_29_AM_osvc3s.webp",
    localFallback: "/images/hero/hero-slide-2.png",
    title: "Sustainable Dining & Eco Drinkware Collection",
    badge: "FDA Certified & Food-Safe",
    link: "/products"
  },
  {
    id: 3,
    image: "https://res.cloudinary.com/dsebrpcyz/image/upload/v1794983355/ChatGPT_Image_Nov_18_2026_11_59_04_AM_l2ofdm.webp",
    localFallback: "/images/hero/hero-slide-3.png",
    title: "Custom Branded Corporate Gifting Hampers",
    badge: "In-House Laser Branding",
    link: "/products"
  },
  {
    id: 4,
    image: "https://res.cloudinary.com/dsebrpcyz/image/upload/v1794983272/Green_Fibre_Eco_Gift_Arrangement_ba4ycx.webp",
    localFallback: "/images/hero/hero-slide-4.png",
    title: "Green Fibre Luxury Eco Gift Arrangement",
    badge: "Direct Factory Wholesale",
    link: "/products"
  }
];

export default function HeroSwiper() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);

  return (
    <div className="hero-swiper-container relative w-full max-w-full overflow-hidden bg-stone-100 group select-none aspect-[1672/941] sm:aspect-auto sm:h-[66vh] md:h-[80vh] lg:h-[89vh] xl:h-[91vh] sm:min-h-[494px] md:min-h-[589px] lg:min-h-[684px] sm:max-h-[91vh]">
      <Swiper
        modules={[Autoplay, Pagination]}
        speed={1100}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        loop={true}
        grabCursor={true}
        touchRatio={1}
        resistanceRatio={0.85}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full h-full"
      >
        {heroSlides.map((s, index) => {
          const optimizedSrc = optimizeImageUrl(s.image, { width: 1600, quality: "auto" });
          const srcSet = getImageSrcSet(s.image, [480, 768, 1200, 1600, 1920]);

          return (
            <SwiperSlide
              key={s.id}
              className="relative w-full h-full flex items-center justify-center overflow-hidden bg-stone-100"
            >
              <Link
                href={s.link}
                className="relative w-full h-full block cursor-pointer overflow-hidden group/slide"
                aria-label={s.title}
              >
                <img
                  src={optimizedSrc}
                  srcSet={srcSet || undefined}
                  sizes={IMAGE_SIZES.hero}
                  alt={s.title}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "low"}
                  decoding={index === 0 ? "sync" : "async"}
                  onError={(e) => {
                    if (s.localFallback && e.currentTarget.src !== s.localFallback) {
                      e.currentTarget.src = s.localFallback;
                    }
                  }}
                  className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover/slide:scale-[1.01]"
                />
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Left Navigation Arrow (Luxury Frosted Glass - Visible on hover on desktop) */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          swiperInstance?.slidePrev();
        }}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/40 hover:bg-slate-900/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Right Navigation Arrow (Luxury Frosted Glass - Visible on hover on desktop) */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          swiperInstance?.slideNext();
        }}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/40 hover:bg-slate-900/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Floating Bottom Bar: Quick Trust Info & Luxury Interactive Pagination */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-3 sm:left-6 md:left-8 right-3 sm:right-6 md:right-8 z-20 flex items-center justify-between pointer-events-none">
        {/* Left Side: Floating Trust Pills & CTA (Desktop & Tablet) */}
        <div className="hidden md:flex items-center gap-2 pointer-events-auto">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 hover:bg-brand-600 text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Sprout className="w-3.5 h-3.5 text-brand-300" />
            <span>Explore Wholesale Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-300" />
          </Link>
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-semibold text-white/95 bg-slate-900/70 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/15 shadow-md">
            <span>✓ 10 MOQ</span>
            <span>•</span>
            <span>✓ Free 4h 3D Proof</span>
            <span>•</span>
            <span>✓ Pan-India Delivery</span>
          </div>
        </div>

        {/* Right Side: Slide Counter & Luxury Bullets */}
        <div className="flex items-center gap-2 sm:gap-2.5 ml-auto pointer-events-auto">
          <div className="text-[11px] sm:text-xs font-semibold text-white/95 bg-slate-900/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 shadow-md tracking-wider">
            <strong className="text-white font-extrabold">{String(activeIndex + 1).padStart(2, "0")}</strong>
            <span className="text-white/60 mx-1">/</span>
            <span className="text-white/70">{String(heroSlides.length).padStart(2, "0")}</span>
          </div>

          {/* Luxury Interactive Bullets */}
          <div className="flex items-center gap-1.5 bg-slate-900/75 backdrop-blur-md px-2.5 sm:px-3 py-2 rounded-full border border-white/15 shadow-md">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  swiperInstance?.slideToLoop(idx);
                }}
                className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                  activeIndex === idx
                    ? "w-6 bg-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
