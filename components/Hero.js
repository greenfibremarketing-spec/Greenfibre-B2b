"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { optimizeImageUrl } from "@/lib/imageOptimization";
import styles from "./Hero.module.css";

export const DEFAULT_HERO_SLIDES = [
  {
    id: 1,
    image: "https://res.cloudinary.com/dsebrpcyz/image/upload/v1794983284/Premium_Kraft_Paper_Gift_Set_prfuxv.webp",
    alt: "Premium Kraft Paper Sustainable Gift Sets - Green Fibre B2B",
    eyebrow: "Direct factory wholesale · Pan-India delivery",
    titleStart: "Sustainable gifts your team ",
    titleHighlight: "actually keep.",
    description: "Plant-fibre bottles, mugs and hampers, made in our own factory. Branded in bulk, priced direct, delivered across India.",
    descriptionMobile: "Plant-fibre bottles, mugs & hampers. Branded in bulk, priced direct, Pan-India delivery."
  },
  {
    id: 2,
    image: "https://res.cloudinary.com/dsebrpcyz/image/upload/v1794983323/ChatGPT_Image_Nov_18_2026_11_58_29_AM_osvc3s.webp",
    alt: "Sustainable Dining & Eco Drinkware Collection - Green Fibre B2B",
    eyebrow: "100% Food-Safe · US FDA & LFGB Certified",
    titleStart: "Eco-friendly dining & ",
    titleHighlight: "drinkware essentials.",
    description: "Upcycled agricultural rice husk tableware and thermal bottles. Chemical-free, microwave-safe, and built to last.",
    descriptionMobile: "Upcycled rice-husk dining & drinkware. Chemical-free, microwave-safe, built to last."
  },
  {
    id: 3,
    image: "https://res.cloudinary.com/dsebrpcyz/image/upload/v1794983355/ChatGPT_Image_Nov_18_2026_11_59_04_AM_l2ofdm.webp",
    alt: "Custom Branded Corporate Gifting Hampers - Green Fibre B2B",
    eyebrow: "In-House Laser Branding · Free 3D Proof in 4h",
    titleStart: "Elevate your brand with ",
    titleHighlight: "custom laser gifts.",
    description: "Permanent precision logo branding and custom employee name engraving. Crafted from crop stubble to celebrate sustainability.",
    descriptionMobile: "Precision logo branding & custom gifts. Free 3D visual proof in 4 hours."
  },
  {
    id: 4,
    image: "https://res.cloudinary.com/dsebrpcyz/image/upload/v1794983272/Green_Fibre_Eco_Gift_Arrangement_ba4ycx.webp",
    alt: "Green Fibre Luxury Eco Gift Arrangement - Direct Factory Wholesale",
    eyebrow: "Direct Manufacturer · Greater Noida Plant",
    titleStart: "Luxury eco gift sets crafted from ",
    titleHighlight: "harvest stubble.",
    description: "Conscious corporate gifting made effortless. Low MOQ of 10 units, GST invoice with ITC, and reliable Pan-India dispatch.",
    descriptionMobile: "Conscious corporate gifting made effortless. Low 10 MOQ, GST with ITC."
  }
];

const DEFAULT_TRUST_POINTS = [
  "Factory-direct pricing",
  "GST invoice with ITC",
  "Custom logo branding"
];

export default function Hero({
  variant = "clean",
  slides = DEFAULT_HERO_SLIDES,
  imageSrc = null,
  imageAlt = "Green Fibre sustainable tableware, bottles, and corporate gift hampers",
  primaryCtaText = "Contact Us →",
  primaryCtaLink = "/contact",
  secondaryCtaText = "Browse Products",
  secondaryCtaLink = "/products",
  trustPoints = DEFAULT_TRUST_POINTS
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const isGlass = variant === "glass";

  // Use explicit single image if passed, otherwise use multi-slide array
  const activeSlides = imageSrc
    ? [{ id: 1, image: imageSrc, alt: imageAlt, ...DEFAULT_HERO_SLIDES[0] }]
    : (Array.isArray(slides) && slides.length > 0 ? slides : DEFAULT_HERO_SLIDES);

  const currentSlide = activeSlides[activeIndex] || activeSlides[0];

  const heroContent = (
    <>
      {/* Dynamic Slide Text (Smooth fade transition on slide change) */}
      <div key={activeIndex} className={styles.textContent}>
        {/* 1. Eyebrow Pill */}
        {currentSlide.eyebrow && (
          <div className={styles.eyebrow}>
            <span className={styles.mintDot} aria-hidden="true" />
            <span>{currentSlide.eyebrow}</span>
          </div>
        )}

        {/* 2. Main Headline */}
        <h1 className={styles.title}>
          <span>{currentSlide.titleStart}</span>
          {currentSlide.titleHighlight && (
            <span className={styles.titleHighlight}>
              {currentSlide.titleHighlight}
            </span>
          )}
        </h1>

        {/* 3. Lead Paragraph */}
        {currentSlide.description && (
          <p className={styles.description}>
            <span className={styles.descDesktop}>{currentSlide.description}</span>
            <span className={styles.descMobile}>
              {currentSlide.descriptionMobile || currentSlide.description}
            </span>
          </p>
        )}
      </div>

      {/* 4. Action Buttons (Rock-solid anchored CTAs) */}
      <div className={styles.buttonGroup}>
        {primaryCtaText && primaryCtaLink && (
          <Link href={primaryCtaLink} className={styles.primaryBtn}>
            {primaryCtaText}
          </Link>
        )}
        {secondaryCtaText && secondaryCtaLink && (
          <Link href={secondaryCtaLink} className={styles.secondaryBtn}>
            {secondaryCtaText}
          </Link>
        )}
      </div>

      {/* 5. Trust Points Row */}
      {Array.isArray(trustPoints) && trustPoints.length > 0 && (
        <div className={styles.trustRow} aria-label="Key guarantees">
          {trustPoints.map((item, index) => (
            <div key={index} className={styles.trustItem}>
              <Check className={styles.mintCheck} strokeWidth={2.75} aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <section className={styles.hero} aria-label="Hero Introduction">
      {/* Background Smooth Transiting Swiper (No buttons / No pills) */}
      <div className={styles.bgImageWrapper}>
        <Swiper
          modules={[Autoplay]}
          speed={1100}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          loop={activeSlides.length > 1}
          grabCursor={true}
          touchRatio={1}
          resistanceRatio={0.85}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className={styles.swiperContainer}
        >
          {activeSlides.map((slide, idx) => {
            const rawSrc = slide.image || slide.src || slide;
            const src = optimizeImageUrl(rawSrc, { width: 1400, quality: "auto", format: "auto" });
            const alt = slide.alt || imageAlt;
            return (
              <SwiperSlide key={slide.id || idx} className={styles.swiperSlide}>
                <Image
                  src={src}
                  alt={alt}
                  fill
                  priority={idx === 0}
                  sizes="(max-width: 640px) 100vw, 100vw"
                  className={styles.heroImage}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Gradient Overlay for High Text Contrast */}
      <div
        className={isGlass ? styles.overlayGlass : styles.overlay}
        aria-hidden="true"
      />

      {/* Hero Content Container */}
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          {isGlass ? (
            <div className={styles.glassCard}>{heroContent}</div>
          ) : (
            heroContent
          )}
        </div>
      </div>
    </section>
  );
}
