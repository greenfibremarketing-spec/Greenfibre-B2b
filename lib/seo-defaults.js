import { getProduct } from "@/lib/products";

import { getCategoryBySlug } from "@/lib/categories";

const categoryOgImages = {
  drinkware: "/images/thermal-bottle.jpg",
  "gift-boxes-hampers": "/images/gift-set-classic.jpg",
  "kitchen-dining": "/images/bento-box.jpg",
  tableware: "/images/green-tableware-plants.jpg",
  "storage-organizers": "/images/storage-basket.jpg",
  "home-living": "/images/planter-medium.jpg"
};

export const staticSeoDefaults = {

  "/": {
  title: { absolute: "Green Fibre B2B | Sustainable Tableware & Corporate Gifting" },
  description:
    "Direct manufacturer of eco-friendly tableware, coffee drinkware, lunchboxes, and corporate gift sets made from upcycled agricultural rice-husk composite.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    title: "Green Fibre B2B | Sustainable Tableware & Corporate Gifting",
    description:
      "Direct manufacturer of eco-friendly tableware, coffee drinkware, lunchboxes, and corporate gift sets made from upcycled agricultural rice-husk composite.",
    url: "/",
    images: [
      {
        url: "/images/hero.jpg",
        alt: "Green Fibre B2B Sustainable Rice Husk Tableware & Corporate Gifting"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Green Fibre B2B | Sustainable Tableware & Corporate Gifting",
    description:
      "Direct manufacturer of eco-friendly tableware, coffee drinkware, lunchboxes, and corporate gift sets made from upcycled agricultural rice-husk composite.",
    images: ["/images/hero.jpg"]
  }
},

  "/story": {
  title: "Our Story - Engineering Green Products From Rice Husk",
  description:
    "Green Fibre blends agricultural rice husk with recyclable polymers to replace virgin plastic, prevent stubble burning, and craft durable everyday essentials for modern homes.",
  alternates: {
    canonical: "/story"
  },
  openGraph: {
    type: "website",
    title: "Our Story - Engineering Green Products From Rice Husk | Green Fibre",
    description:
      "Green Fibre blends agricultural rice husk with recyclable polymers to replace virgin plastic and craft durable, food-safe everyday essentials.",
    url: "/story",
    images: [
      {
        url: "/images/green-farmland.jpg",
        alt: "Green Fibre - Sustainable Rice Husk Agricultural Composite"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Story | Green Fibre B2B",
    description:
      "From crop stubble to durable tableware. How Green Fibre upcycles rice husk into sustainable corporate gifts.",
    images: ["/images/green-farmland.jpg"]
  }
},

  "/contact": {
  title: "Contact Us | Corporate Desk & Factory Inquiries",
  description:
    "Connect with Greenfibre for wholesale inquiries, custom Pantone color-matching, bespoke compression molds, corporate hampers, and physical sample requests.",
  alternates: {
    canonical: "/contact"
  },
  openGraph: {
    type: "website",
    title: "Contact Us | Greenfibre B2B Corporate Desk & Factory Inquiries",
    description:
      "Connect with Greenfibre for wholesale inquiries, custom branding, corporate hampers, and physical sample requests. Direct manufacturer based in Greater Noida.",
    url: "/contact",
    images: ["/images/hero.jpg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Greenfibre B2B Corporate Desk",
    description:
      "Reach the Greenfibre B2B sales desk for wholesale pricing, custom laser branding, and pan-India bulk delivery inquiries.",
    images: ["/images/hero.jpg"]
  }
},

  "/terms": {
  title: "Terms & Conditions - B2B Wholesale Supply",
  description:
    "Official Terms and Conditions governing B2B wholesale orders, custom corporate branding, purchase order finalization, inventory locking, and replacement policies for Green Fibre products.",
  alternates: {
    canonical: "/terms"
  },
  openGraph: {
    type: "website",
    title: "Terms & Conditions | Green Fibre B2B",
    description:
      "Official Terms governing B2B wholesale orders, custom corporate branding, PO finalization, inventory locking, and replacement policies.",
    url: "/terms",
    images: ["/images/hero.jpg"]
  },
  twitter: {
    card: "summary",
    title: "Terms & Conditions | Green Fibre B2B",
    description:
      "B2B wholesale supply terms, PO finalization, inventory lock policies, and transit damage replacement guarantee.",
    images: ["/images/hero.jpg"]
  }
},

  "/privacy": {
  title: "Privacy & Replacement Policy - B2B Enterprise Protection",
  description:
    "Official Privacy, Data Protection, and Transit Damage Replacement Policy for Green Fibre B2B wholesale buyers, enterprise clients, and institutional partners.",
  alternates: {
    canonical: "/privacy"
  },
  openGraph: {
    type: "website",
    title: "Privacy & Replacement Policy | Green Fibre B2B",
    description:
      "Official Privacy, Data Protection, and Transit Damage Replacement Policy for Green Fibre B2B wholesale buyers and enterprise clients.",
    url: "/privacy",
    images: ["/images/hero.jpg"]
  },
  twitter: {
    card: "summary",
    title: "Privacy & Replacement Policy | Green Fibre B2B",
    description:
      "Corporate data confidentiality, enterprise procurement privacy, and transparent replacement policies for B2B wholesale buyers.",
    images: ["/images/hero.jpg"]
  }
},

  "/corporate-gifting": {
  title: "Eco-Friendly Corporate Gifts in Bulk, India",
  description:
    "Order eco-friendly corporate gifting solutions in bulk across India. Manufactured from upcycled rice-husk crop stubble composite (65% plant residue) with in-house laser engraving and Pan-India delivery.",
  alternates: {
    canonical: "/corporate-gifting"
  },
  openGraph: {
    type: "website",
    title: "Corporate Gifts Bulk India | Eco-Friendly Corporate Gifting | Green Fibre",
    description:
      "Sustainable bulk corporate gifting in India. Made with 65% upcycled crop stubble composite, in-house laser engraving, recycled kraft packaging, and free 3D visual proof in 4 hours.",
    url: "/corporate-gifting",
    images: [
      {
        url: "/images/gift-set-classic.jpg",
        alt: "Eco-Friendly Corporate Gifts Bulk India - Green Fibre"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Corporate Gifts Bulk India | Eco-Friendly Corporate Gifting | Green Fibre",
    description:
      "Sustainable bulk corporate gifting in India. Made with 65% upcycled crop stubble composite, in-house laser engraving, recycled kraft packaging, and free 3D visual proof in 4 hours.",
    images: ["/images/gift-set-classic.jpg"]
  }
},

  "/custom-branded-water-bottles": {
  title: "Custom Logo Rice Husk Water Bottles",
  description:
    "Order double-wall thermal rice husk water bottles and custom logo engraved bottles in bulk. Crafted from upcycled crop stubble (65% plant residue) with in-house laser engraving and Pan-India delivery.",
  alternates: {
    canonical: "/custom-branded-water-bottles"
  },
  openGraph: {
    type: "website",
    title: "Rice Husk Water Bottle | Custom Logo Engraved Bottles | Green Fibre",
    description:
      "Enterprise custom logo engraved bottles made from upcycled rice-husk crop stubble composite (65% plant residue). Double-wall thermal bottle with free 3D visual proof in 4 hours.",
    url: "/custom-branded-water-bottles",
    images: [
      {
        url: "/images/thermal-bottle.jpg",
        alt: "Custom Logo Engraved Thermal Water Bottles - Green Fibre B2B"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Rice Husk Water Bottle | Custom Logo Engraved Bottles | Green Fibre",
    description:
      "Enterprise custom logo engraved bottles made from upcycled rice-husk crop stubble composite (65% plant residue). Double-wall thermal bottle with free 3D visual proof in 4 hours.",
    images: ["/images/thermal-bottle.jpg"]
  }
},

  "/diwali-corporate-gifts": {
  title: "Sustainable Diwali Corporate Gifts in Bulk",
  description:
    "Order sustainable Diwali hampers and bulk Diwali corporate gifts in India. Made from upcycled rice-husk crop stubble composite (65% plant residue) with in-house laser engraving and recycled kraft gift boxes.",
  alternates: {
    canonical: "/diwali-corporate-gifts"
  },
  openGraph: {
    type: "website",
    title: "Diwali Corporate Gifts Bulk | Sustainable Diwali Hampers | Green Fibre",
    description:
      "Celebrate festive season with sustainable Diwali hampers and corporate gifts bulk India orders. Made with upcycled crop stubble composite, laser engraving, and Pan-India delivery.",
    url: "/diwali-corporate-gifts",
    images: [
      {
        url: "/images/gift-set-classic.jpg",
        alt: "Sustainable Diwali Hampers & Corporate Gifts Bulk India - Green Fibre"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Diwali Corporate Gifts Bulk | Sustainable Diwali Hampers | Green Fibre",
    description:
      "Celebrate festive season with sustainable Diwali hampers and corporate gifts bulk India orders. Made with upcycled crop stubble composite, laser engraving, and Pan-India delivery.",
    images: ["/images/gift-set-classic.jpg"]
  }
},

};

export async function catalogMetadata({ searchParams = {} }) {
  const hasFilter = Boolean(
    searchParams.q || searchParams.category || searchParams.type || searchParams.context
  );

  return {
    title: "Wholesale Product Catalog & Eco Gifting",
    description:
      "Explore our complete collection of sustainable rice-husk composite tableware, drinkware, lunchboxes, and luxury corporate gift hampers for bulk orders.",
    alternates: { canonical: "/products" },
    openGraph: {
      type: "website",
      title: "Wholesale Product Catalog & Eco Gifting | Green Fibre B2B",
      description:
        "Explore our complete collection of sustainable rice-husk composite tableware, drinkware, lunchboxes, and luxury corporate gift hampers for bulk orders.",
      url: "/products",
      images: [
        {
          url: "/images/green-dining-nature.jpg",
          alt: "Green Fibre B2B Wholesale Sustainable Product Catalog"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: "Wholesale Product Catalog & Eco Gifting | Green Fibre B2B",
      description:
        "Direct manufacturer catalog: eco-friendly rice-husk tableware, coffee mugs, and corporate gift hampers.",
      images: ["/images/green-dining-nature.jpg"]
    },
    ...(hasFilter && { robots: { index: false, follow: true } })
  };
}

export async function productMetadata({ params }) {
  const p = await getProduct(params.slug);
  if (!p) {
    return { robots: { index: false, follow: false } };
  }

  const descParts = [
    `${p.name} for bulk B2B orders.`,
    p.moq ? `Minimum order: ${p.moq} ${p.unit || "units"}.` : null,
    p.leadTime ? `Lead time: ${p.leadTime}.` : null,
    "Custom laser branding and Pan-India dispatch available."
  ].filter(Boolean);

  const ogImage = p.images?.[0] || p.image || null;

  return {
    title: `${p.name} - Bulk Order & Custom Branding`,
    description: descParts.join(" "),
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: {
      title: `${p.name} | Green Fibre B2B`,
      description: descParts.join(" "),
      images: ogImage ? [{ url: ogImage }] : []
    },
    twitter: {
      card: "summary_large_image",
      images: ogImage ? [ogImage] : []
    }
  };
}

export async function categoryMetadata({ params }) {
  const category = getCategoryBySlug(params.slug);
  if (!category) {
    return {
      title: "Category Not Found",
      robots: { index: false, follow: false }
    };
  }

  const ogImage = categoryOgImages[category.slug] || "/images/hero.jpg";

  return {
    title: { absolute: category.metaTitle },
    description: category.metaDescription,
    alternates: {
      canonical: `/category/${category.slug}`
    },
    openGraph: {
      type: "website",
      title: category.metaTitle,
      description: category.metaDescription,
      url: `/category/${category.slug}`,
      images: [
        {
          url: ogImage,
          alt: `${category.name} - Green Fibre Sustainable B2B Collection`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: category.metaTitle,
      description: category.metaDescription,
      images: [ogImage]
    }
  };
}


export async function getPageSeoDefaults(pagePath) {
  if (staticSeoDefaults[pagePath]) return staticSeoDefaults[pagePath];
  if (pagePath === "/products") return catalogMetadata({});
  if (pagePath.startsWith("/products/")) return productMetadata({ params: { slug: pagePath.slice(10) } });
  if (pagePath.startsWith("/category/")) return categoryMetadata({ params: { slug: pagePath.slice(10) } });
  return null;
}
