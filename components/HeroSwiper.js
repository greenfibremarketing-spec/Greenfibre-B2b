"use client";

import { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Register Swiper styles (if needed)
import "swiper/css";
import "swiper/css/pagination";

const heroSlides = [
  {
    id: 1,
    image: "https://res.cloudinary.com/dsebrpcyz/image/upload/v1790933651/Untitled_-_September_30_2026_at_12.51.23-1_1_oys5gq.png",
    localFallback: "/images/hero/hero-slide-1.png",
    title: "Sustainable Living Beautifully Yours",
    badge: "100% Upcycled Rice Husk",
    link: "/products"
  },
  {
    id: 2,
    image: "https://res.cloudinary.com/dsebrpcyz/image/upload/v1790932626/Untitled_-_September_30_2026_at_12.51.23-6_2_gkzki9.png",
    localFallback: "/images/hero/hero-slide-1.png",
    title: "Thoughtful Living Begins at Home",
    badge: "FDA Certified & Food-Safe",
    link: "/products"
  },
  {
    id: 3,
    image: "https://res.cloudinary.com/dsebrpcyz/image/upload/v1790936352/Untitled_design_cn2svf.png",
    localFallback: "/images/hero/hero-slide-2.png",
    title: "Everyday Essentials, Beautifully Reimagined",
    badge: "Direct Factory Wholesale",
    link: "/products"
  },
  {
    id: 4,
    image: "https://res.cloudinary.com/dsebrpcyz/image/upload/v1790927773/Untitled_-_September_30_2026_at_12.51.23-3_djwy5n.png",
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
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-6">
      <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-stone-100 group select-none">
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
                {/* 16:9 Slide Banner: Contained within website width with perfect aspect ratio */}
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
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-900/50 hover:bg-slate-900/85 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Right Navigation Arrow */}
        <button
          type="button"
          onClick={() => swiperInstance?.slideNext()}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-900/50 hover:bg-slate-900/85 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Floating Bottom Bar: Slide Counter & Bullets */}
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-5 right-3 sm:right-5 md:right-6 z-20 flex items-center gap-2 sm:gap-2.5 pointer-events-auto">
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
