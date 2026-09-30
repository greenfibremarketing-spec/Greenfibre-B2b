"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Sprout, Leaf, Sun, ShieldCheck } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/images/green-farmland.jpg",
    badge: "100% Zero-Burn Agriculture",
    title: "Sustainable Tableware & Corporate Gifts Direct From Manufacturer",
    desc: "Instead of burning crop residue, we convert agricultural rice husk into durable, certified food-safe drinkware, dining bowls, and gift hampers—custom laser engraved with your company logo.",
    tag: "Farmer Partnerships in Haryana & Punjab",
    icon: Sprout
  },
  {
    id: 2,
    image: "/images/green-dining-nature.jpg",
    badge: "100% Plant-Based Living",
    title: "Eco-Friendly Dining Tableware in Nature's Harmony",
    desc: "Non-toxic, BPA-free dinnerware and tumblers crafted from upcycled crop stubble. Tested for 500+ commercial dishwasher cycles and microwave safe.",
    tag: "US FDA 21 CFR Certified & Food-Safe",
    icon: Leaf
  },
  {
    id: 3,
    image: "/images/green-paddy.jpg",
    badge: "Clean Air & Skies",
    title: "Preserving Fresh Air & Organic Paddy Farmlands",
    desc: "Every Green Fibre bulk order prevents seasonal crop burning and replaces thousands of single-use corporate plastics with circular bio-composite.",
    tag: "65% Upcycled Natural Agricultural Husk",
    icon: Sun
  },
  {
    id: 4,
    image: "/images/green-tableware-plants.jpg",
    badge: "In-House Fiber Laser Studio",
    title: "Permanent Precision Laser Branding That Never Rubs Off",
    desc: "Chemical-free optical fiber laser engraving executed in-house. Free 3D visual proofs within 4 hours and PAN-India delivery to 19,000+ PIN codes.",
    tag: "Zero Chemical Inks & Fast Turnaround",
    icon: ShieldCheck
  }
];

export default function HeroSwiper() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative w-full max-w-full overflow-hidden bg-slate-950">
      <Swiper
        modules={[Autoplay, Pagination]}
        speed={1100}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        loop={true}
        grabCursor={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        pagination={{
          clickable: true,
          el: ".hero-custom-pagination",
          bulletClass: "hero-bullet",
          bulletActiveClass: "hero-bullet-active"
        }}
        className="w-full max-w-full h-[630px]"
      >
        {slides.map((s) => {
          const Icon = s.icon;
          return (
            <SwiperSlide
              key={s.id}
              className="relative w-full max-w-full h-[630px] flex items-center overflow-hidden"
            >
              {/* Full Width Background Image */}
              <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover object-center"
                />
                {/* Lighter, Soft Natural Contrast Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/35 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/20" />
              </div>

              {/* Foreground Text on Top of Full Width Image */}
              <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="max-w-2xl sm:max-w-3xl space-y-4 text-left">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-white/20 text-brand-300 text-xs font-bold backdrop-blur-md shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                    <Icon className="w-3.5 h-3.5 text-brand-400" />
                    <span>{s.badge}</span>
                  </div>

                  {/* Headline */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.12] drop-shadow-md">
                    {s.title}
                  </h1>

                  {/* Subtitle / Paragraph */}
                  <p className="text-sm sm:text-base lg:text-lg text-slate-100/90 leading-relaxed font-normal max-w-2xl drop-shadow-sm">
                    {s.desc}
                  </p>

                  {/* Simple Trust Points Bar */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-3 text-xs font-semibold text-white/90">
                    <span className="bg-slate-900/60 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/15">
                      ✓ 25 Units MOQ
                    </span>
                    <span className="bg-slate-900/60 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/15">
                      ✓ 4h 3D Digital Proof
                    </span>
                    <span className="bg-slate-900/60 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/15">
                      ✓ Pan-India Dispatch
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Floating Bottom Pagination Dots & Counter */}
      <div className="absolute bottom-6 right-6 sm:right-10 z-20 flex items-center gap-3">
        <div className="text-xs font-semibold text-white/80 bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
          <strong className="text-white font-bold">0{activeIndex + 1}</strong> / 0{slides.length}
        </div>
        <div className="hero-custom-pagination flex items-center gap-1.5" />
      </div>
    </div>
  );
}
