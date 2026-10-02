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
    image: "https://res.cloudinary.com/dsebrpcyz/image/upload/v1790920945/Untitled_-_September_30_2026_at_12.51.23-1_h6plax.png",
    localFallback: "/images/hero/hero-slide-1.png",
    title: "Sustainable Living Beautifully Yours",
    badge: "100% Upcycled Rice Husk",
    link: "/products"
  },
  {
    id: 2,
    image: "https://res.cloudinary.com/dsebrpcyz/image/upload/v1790920038/Untitled_-_October_02_2026_at_10.26.07-1_ibu6ry.png",
    localFallback: "/images/hero/hero-slide-1.png",
    title: "Thoughtful Living Begins at Home",
    badge: "FDA Certified & Food-Safe",
    link: "/products"
  },
  {
    id: 3,
    image: "https://res.cloudinary.com/dsebrpcyz/image/upload/v1790920038/Untitled_-_October_02_2026_at_10.26.07-2_f8nrvt.png",
    localFallback: "/images/hero/hero-slide-2.png",
    title: "Everyday Essentials, Beautifully Reimagined",
    badge: "Direct Factory Wholesale",
    link: "/products"
  },
  {
    id: 4,
    image: "https://res.cloudinary.com/dsebrpcyz/image/upload/v1790920497/Untitled_-_October_02_2026_at_10.26.07-2_eziibm.png",
    localFallback: "/images/hero/hero-slide-2.png",
    title: "Eco-Conscious Excellence by Greenfibre",
    badge: "100% Biodegradable & Safe",
    link: "/products"
  }
];

export default function HeroSwiper() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);

  return (
    <div className="relative w-full max-w-full overflow-hidden bg-stone-100 group select-none">
      <Swiper
        modules={[Autoplay, Pagination]}
        speed={800}
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
        className="w-full max-w-full aspect-[16/9]"
      >
        {heroSlides.map((s, index) => (
          <SwiperSlide
            key={s.id}
            className="relative w-full max-w-full h-full flex items-center justify-center overflow-hidden bg-stone-100"
          >
            <Link
              href={s.link}
              className="relative w-full h-full block cursor-pointer overflow-hidden group/slide"
              aria-label={s.title}
            >
              {/* Full-Bleed 16:9 Slide Banner: 100% width, 100% height, zero black bars, zero cropping */}
              <img
                src={s.image}
                alt={s.title}
                loading={index === 0 ? "eager" : "lazy"}
                onError={(e) => {
                  if (s.localFallback && e.currentTarget.src !== s.localFallback) {
                    e.currentTarget.src = s.localFallback;
                  }
                }}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover/slide:scale-[1.01]"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Left Navigation Arrow */}
      <button
        type="button"
        onClick={() => swiperInstance?.slidePrev()}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-slate-900/50 hover:bg-slate-900/85 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Right Navigation Arrow */}
      <button
        type="button"
        onClick={() => swiperInstance?.slideNext()}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-slate-900/50 hover:bg-slate-900/85 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Floating Bottom Bar: Quick Trust Info & Interactive Pagination */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-3 sm:left-6 md:left-8 right-3 sm:right-6 md:right-8 z-20 flex items-center justify-between pointer-events-none">
        {/* Left Side: Floating Trust Pills & CTA (Desktop & Tablet) */}
        <div className="hidden md:flex items-center gap-2 pointer-events-auto">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/85 hover:bg-brand-600 text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <Sprout className="w-3.5 h-3.5 text-brand-300" />
            <span>Explore Wholesale Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-300" />
          </Link>
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-semibold text-white/95 bg-slate-900/75 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/15 shadow-md">
            <span>✓ 25 MOQ</span>
            <span>•</span>
            <span>✓ Free 4h 3D Proof</span>
            <span>•</span>
            <span>✓ PAN-India Delivery</span>
          </div>
        </div>

        {/* Right Side: Slide Counter & Bullets */}
        <div className="flex items-center gap-2 sm:gap-2.5 ml-auto pointer-events-auto">
          <div className="text-[11px] sm:text-xs font-semibold text-white/95 bg-slate-900/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 shadow-md">
            <strong className="text-white font-extrabold">{String(activeIndex + 1).padStart(2, "0")}</strong>
            <span className="text-white/60 mx-1">/</span>
            <span className="text-white/70">{String(heroSlides.length).padStart(2, "0")}</span>
          </div>
          <div className="hero-custom-pagination flex items-center gap-1.5 bg-slate-900/75 backdrop-blur-md px-2.5 sm:px-3 py-2 rounded-full border border-white/15 shadow-md" />
        </div>
      </div>
    </div>
  );
}
