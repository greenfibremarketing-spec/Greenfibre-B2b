"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
  const [src, setSrc] = useState(heroSlide.image);

  return (
    <div className="w-full max-w-full bg-stone-100 select-none">
      <Link
        href={heroSlide.link}
        className="block w-full cursor-pointer"
        aria-label={heroSlide.title}
      >
        {/* Preserve the original aspect ratio so the entire banner stays visible. */}
        <Image
          src={src}
          alt={heroSlide.title}
          width={1672}
          height={941}
          priority
          sizes="100vw"
          onError={() => {
            if (heroSlide.localFallback && src !== heroSlide.localFallback) {
              setSrc(heroSlide.localFallback);
            }
          }}
          className="block w-full h-auto"
        />
      </Link>
    </div>
  );
}
