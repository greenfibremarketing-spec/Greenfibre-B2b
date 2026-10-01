"use client";

import { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight, ArrowRight, Sprout } from "lucide-react";

// Register Swiper styles (if needed)
import "swiper/css";
import "swiper/css/pagination";

const heroSlides = [
  {
    id: 1,
    image: "https://res.cloudinary.com/dsebrpcyz/image/upload/v1790758685/Untitled_-_September_30_2026_at_12.51.23-1_jk7nno.png",
    localFallback: "/images/hero/hero-slide-1.png",
    title: "Sustainable Living Beautifully Yours",
    badge: "100% Upcycled Rice Husk",
    link: "/products"
  },
  {
    id: 2,
    image: "https://res.cloudinary.com/dsebrpcyz/image/upload/v1790861609/Untitled_-_September_30_2026_at_12.51.23-2_xor5g4.png",
    localFallback: "/images/hero/hero-slide-2.png",
    title: "Everyday Essentials, Beautifully Reimagined",
    badge: "Direct Factory Wholesale",
    link: "/products"
  },
  {
    id: 3,
    image: "https://res.cloudinary.com/dsebrpcyz/image/upload/v1790861609/Untitled_-_September_30_2026_at_12.51.23-5_zpvafy.png",
    localFallback: "/images/hero/hero-slide-3.png",
    title: "Made to Reuse. Made to Impress.",
    badge: "Permanent Laser Branding",
    link: "/products"
  },
  {
    id: 4,
    image: "https://res.cloudinary.com/dsebrpcyz/image/upload/v1790758683/Untitled_-_September_30_2026_at_12.51.23-6_rg4yc1.png",
    localFallback: "/images/hero/hero-slide-4.png",
    title: "Thoughtful Living Begins at Home",
    badge: "FDA Certified & Food-Safe",
    link: "/products"
  },
  {
    id: 5,
    image: "https://res.cloudinary.com/dsebrpcyz/image/upload/v1790758676/Untitled_-_September_30_2026_at_12.51.23-4_s1wtaj.png",
    localFallback: "/images/hero/hero-slide-5.png",
    title: "Thoughtful Products For Everyday Living",
    badge: "Zero Chemical Inks",
    link: "/products"
  },
  {
    id: 6,
    image: "https://res.cloudinary.com/dsebrpcyz/image/upload/v1790758676/Untitled_-_September_30_2026_at_12.51.23-3_kq6ei5.png",
    localFallback: "/images/hero/hero-slide-6.png",
    title: "Sustainable Style for Everyday Use",
    badge: "PAN-India Bulk Delivery",
    link: "/products"
  }
];

export default function HeroSwiper() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);

  return (
    <div className="relative w-full max-w-full overflow-hidden bg-slate-950 group select-none">
      <Swiper
        modules={[Autoplay, Pagination]}
        speed={1000}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        loop={true}
        grabCursor={true}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        pagination={{
          clickable: true,
          el: ".hero-custom-pagination",
          bulletClass: "hero-bullet",
          bulletActiveClass: "hero-bullet-active"
        }}
        className="w-full max-w-full h-[320px] sm:h-[440px] md:h-[520px] lg:h-[600px] xl:h-[650px]"
      >
        {heroSlides.map((s, index) => (
          <SwiperSlide
            key={s.id}
            className="relative w-full max-w-full h-full flex items-center justify-center overflow-hidden bg-slate-900"
          >
            <Link
              href={s.link}
              className="block relative w-full h-full cursor-pointer overflow-hidden group/slide"
              aria-label={s.title}
            >
              {/* Full Width High-Resolution Hero Banner */}
              <img
                src={s.image}
                alt={s.title}
                loading={index === 0 ? "eager" : "lazy"}
                onError={(e) => {
                  if (s.localFallback && e.currentTarget.src !== s.localFallback) {
                    e.currentTarget.src = s.localFallback;
                  }
                }}
                className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover/slide:scale-[1.02]"
              />

              {/* Ultra-subtle bottom shadow to give high contrast for floating controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Left Navigation Arrow */}
      <button
        type="button"
        onClick={() => swiperInstance?.slidePrev()}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-slate-900/40 hover:bg-slate-900/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Right Navigation Arrow */}
      <button
        type="button"
        onClick={() => swiperInstance?.slideNext()}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-slate-900/40 hover:bg-slate-900/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Floating Bottom Bar: Quick Trust Info & Interactive Pagination */}
      <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-8 right-4 sm:right-8 z-20 flex items-center justify-between pointer-events-none">
        {/* Left Side: Floating Trust Pills & CTA */}
        <div className="hidden sm:flex items-center gap-2 pointer-events-auto">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/70 hover:bg-brand-700 text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-md transition-all hover:scale-105"
          >
            <Sprout className="w-3.5 h-3.5 text-brand-300" />
            <span>Explore Wholesale Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-300" />
          </Link>
          <div className="hidden md:flex items-center gap-2 text-[11px] font-semibold text-white/90 bg-slate-900/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <span>✓ 25 MOQ</span>
            <span>•</span>
            <span>✓ Free 4h 3D Proof</span>
            <span>•</span>
            <span>✓ PAN-India</span>
          </div>
        </div>

        {/* Right Side: Slide Counter & Bullets */}
        <div className="flex items-center gap-3 ml-auto pointer-events-auto">
          <div className="text-xs font-semibold text-white/90 bg-slate-900/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-sm">
            <strong className="text-white font-extrabold">0{activeIndex + 1}</strong>
            <span className="text-white/60 mx-1">/</span>
            <span className="text-white/70">0{heroSlides.length}</span>
          </div>
          <div className="hero-custom-pagination flex items-center gap-1.5 bg-slate-900/50 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/15" />
        </div>
      </div>
    </div>
  );
}
