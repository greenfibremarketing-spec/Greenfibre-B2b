"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useQuote } from "./Quote";
import { optimizeImageUrl, getImageSrcSet, IMAGE_SIZES } from "@/lib/imageOptimization";
import {
  Zap,
  ShieldCheck,
  Check,
  Sprout,
  Flame,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Maximize2,
  X,
  PackageCheck,
  CheckCircle2,
  ShoppingBag,
  Gift,
  Layers,
  Award,
  Truck,
  FileCheck2,
  Info,
  SlidersHorizontal,
  Star,
  Minus,
  Plus,
  ArrowRight,
  Package,
  Palette,
  Leaf,
  Box,
  Crown,
  FileText,
  BadgeCheck,
  Scale,
  Ruler,
  QrCode,
  CheckCheck,
  Clock,
  Percent,
  Tag,
  Boxes,
  MapPin,
  Building2,
  Heart,
  Users,
  Eye,
  Lock,
  PhoneCall
} from "lucide-react";

// Standard 5 Contexts & Occasions for B2B Gifting
export const B2B_OCCASIONS = [
  {
    key: "corporate",
    label: "Corporate Gifting",
    subtitle: "Enterprise & Client Gifting",
    comesUnder: "Corporate Gifting & Client Hampers",
    badgeText: "Corporate Gifting Edition",
    plainExplanation: "This product comes under Corporate Gifting — tailored specifically for enterprise client gifts, business partner appreciation, executive welcome kits, and annual company conferences.",
    bestSuitedFor: "Corporate Clients, Executive Kits, Business Partners, Sales Meets & Annual General Meetings",
    packagingDetails: "Standard Recyclable Eco Kraft Gift Box with Custom Sleeve & Plantable Story Card",
    moq: 10,
    icon: Building2,
    leadTime: "7–10 Days",
    tiers: [
      {
        id: "tier-1",
        tierNumber: 1,
        title: "Tier 1 — Starter",
        badge: "MOQ 10",
        isPopular: false,
        min: 10,
        max: 100,
        rangeLabel: "10–100 Sets",
        price: 1700,
        savingsPct: 15,
        leadTime: "7–10 Days",
        allowedCustomizations: 2,
        customizationAllowanceText: "Choose any 2 of 5 complimentary customizations below.",
        nextTierUnlockText: "Tier 2 (101+) unlocks 3 →",
        perks: ["15% Off MRP", "Welcome & Thank-You Kit Included", "Standard 7-10 Day Production"]
      },
      {
        id: "tier-2",
        tierNumber: 2,
        title: "Tier 2 — Personalized",
        badge: "20% OFF",
        isPopular: false,
        min: 101,
        max: 200,
        rangeLabel: "101–200 Sets",
        price: 1445,
        savingsPct: 20,
        leadTime: "5–7 Days",
        allowedCustomizations: 3,
        customizationAllowanceText: "Choose any 3 of 5 complimentary customizations below.",
        nextTierUnlockText: "Tier 3 (201+) unlocks all 5 →",
        perks: ["20% Off MRP", "Your Name Engraved on Product", "Priority Dispatch"]
      },
      {
        id: "tier-3",
        tierNumber: 3,
        title: "Tier 3 — Fully Custom",
        badge: "25% OFF",
        isPopular: false,
        min: 201,
        max: null,
        rangeLabel: "201+ Sets",
        price: 1360,
        savingsPct: 25,
        leadTime: "3–5 Days",
        allowedCustomizations: 5,
        customizationAllowanceText: "All 5 complimentary customizations included.",
        nextTierUnlockText: "",
        perks: ["25% Off MRP", "Custom Product Name + Branded Sleeve", "Dedicated Account Manager"]
      }
    ],
    customizations: [
      {
        id: "corp_gift_box",
        name: "Bespoke Recyclable Gift Packaging",
        tag: "Custom Box",
        badge: "Eco Kraft",
        desc: "Recycled kraft presentation gift box with custom branded outer sleeve & ribbon.",
        icon: Gift
      },
      {
        id: "pantone_colorway",
        name: "Custom Pantone Brand Colorway",
        tag: "Brand Tone",
        badge: "Custom Hue",
        desc: "Custom rice husk bio-composite body tone matched to your corporate brand guideline.",
        icon: Palette
      },
      {
        id: "custom_sleeve",
        name: "Custom Box Sleeve & Belly Band",
        tag: "Branded Sleeve",
        badge: "Full Color",
        desc: "High-resolution custom corporate belly band and gift sleeve wrap.",
        icon: Layers
      },
      {
        id: "insert_card",
        name: "Personalized Greeting & Story Card",
        tag: "Insert Card",
        badge: "300 GSM Seed Paper",
        desc: "Custom printed plantable seed paper or kraft story card inside each box with your message.",
        icon: FileText
      },
      {
        id: "recipient_monogram",
        name: "Individual Recipient Name Monogram",
        tag: "Per-Piece",
        badge: "VIP Personalization",
        desc: "Laser engraving of individual employee or recipient names for high-touch VIP gifting.",
        icon: BadgeCheck
      }
    ]
  },
  {
    key: "anniversary",
    label: "Anniversary & Milestone",
    subtitle: "Celebrations & Long Service",
    comesUnder: "Anniversary & Milestone Celebrations",
    badgeText: "Anniversary Gifting Edition",
    plainExplanation: "This product comes under Anniversary & Milestone Celebrations — specially curated for company foundation days, work anniversaries (5/10/25 years), and major milestone honors.",
    bestSuitedFor: "Company Foundation Days, Work Anniversaries, Milestone Recognition & Long-Standing Clients",
    packagingDetails: "Handcrafted Luxury Keepsake Ribbon Box with Milestone Plaque Tag",
    moq: 10,
    icon: Award,
    leadTime: "5–7 Days",
    tiers: [
      {
        id: "tier-1",
        tierNumber: 1,
        title: "Milestone Starter",
        badge: "MOQ 10",
        isPopular: false,
        min: 10,
        max: 100,
        rangeLabel: "10–100 Sets",
        price: 1900,
        savingsPct: 15,
        leadTime: "5–7 Days",
        allowedCustomizations: 2,
        customizationAllowanceText: "Choose any 2 of 5 anniversary customizations below.",
        nextTierUnlockText: "Silver Jubilee (101+) unlocks 3 →",
        perks: ["15% Off MRP", "Gold Satin Ribbon", "5-7 Day Production"]
      },
      {
        id: "tier-2",
        tierNumber: 2,
        title: "Silver Jubilee",
        badge: "20% OFF",
        isPopular: false,
        min: 101,
        max: 200,
        rangeLabel: "101–200 Sets",
        price: 1530,
        savingsPct: 20,
        leadTime: "5–7 Days",
        allowedCustomizations: 3,
        customizationAllowanceText: "Choose any 3 of 5 anniversary customizations below.",
        nextTierUnlockText: "Platinum (201+) unlocks all 5 →",
        perks: ["20% Off MRP", "3 Free Customizations", "Expedited 5-Day Production"]
      },
      {
        id: "tier-3",
        tierNumber: 3,
        title: "Platinum Jubilee",
        badge: "25% OFF",
        isPopular: false,
        min: 201,
        max: null,
        rangeLabel: "201+ Sets",
        price: 1440,
        savingsPct: 25,
        leadTime: "3–5 Days",
        allowedCustomizations: 5,
        customizationAllowanceText: "All 5 anniversary customizations included complimentary.",
        nextTierUnlockText: "",
        perks: ["25% Off MRP", "All 5 Free", "White-Glove Delivery", "Commemorative Certificate"]
      }
    ],
    customizations: [
      {
        id: "gold_foil_monogram",
        name: "Gold Foil Monogram & Years Engraving",
        tag: "Gold Foil",
        badge: "Gold Foil",
        desc: "Luxury gold metallic stamp commemorating your company's anniversary years.",
        icon: Award
      },
      {
        id: "anniversary_box",
        name: "Anniversary Keepsake Ribbon Box",
        tag: "Keepsake Box",
        badge: "Keepsake Box",
        desc: "Handcrafted rigid luxury keepsake box with silver/gold satin ribbon.",
        icon: Box
      },
      {
        id: "founder_note_card",
        name: "Personalized Founder Note Card",
        tag: "Insert Card",
        badge: "Insert Card",
        desc: "Embossed founder message on premium plantable seed paper.",
        icon: FileText
      },
      {
        id: "milestone_plaque",
        name: "Milestone Achievement Plaque Tag",
        tag: "Plaque Tag",
        badge: "Plaque Tag",
        desc: "Mini laser-engraved metal plaque tag showing milestone year and company name.",
        icon: Award
      },
      {
        id: "name_monogram_anniv",
        name: "Recipient Name Laser Monogram",
        tag: "Per-Piece",
        badge: "Per-Piece",
        desc: "Individual recipient names laser-engraved for a personalised commemorative touch.",
        icon: BadgeCheck
      }
    ]
  },
  {
    key: "wedding",
    label: "Wedding & Celebrations",
    subtitle: "Bridal Favours & Trousseau",
    comesUnder: "Wedding & Celebration Return Gifts",
    badgeText: "Wedding & Celebrations Edition",
    plainExplanation: "This product comes under Wedding & Celebrations — designed as premium, eco-luxury return gifts and bridesmaid / groomsmen celebration hampers.",
    bestSuitedFor: "Wedding Return Favours, Bridal Favours, Mehendi & Sangeet Hampers, Destination Events",
    packagingDetails: "Blush Bridal Gift Box with Silk Ribbon Wrap & Plantable Couple Note Card",
    moq: 10,
    icon: Heart,
    leadTime: "5–8 Days",
    tiers: [
      {
        id: "tier-1",
        tierNumber: 1,
        title: "Intimate Wedding",
        badge: "MOQ 10",
        isPopular: false,
        min: 10,
        max: 100,
        rangeLabel: "10–100 Sets",
        price: 1800,
        savingsPct: 15,
        leadTime: "7–8 Days",
        allowedCustomizations: 2,
        customizationAllowanceText: "Choose any 2 of 5 wedding customizations below.",
        nextTierUnlockText: "Grand Wedding (101+) unlocks 3 →",
        perks: ["15% Off MRP", "Blush Ribbon", "7-Day Production"]
      },
      {
        id: "tier-2",
        tierNumber: 2,
        title: "Grand Wedding",
        badge: "20% OFF",
        isPopular: false,
        min: 101,
        max: 200,
        rangeLabel: "101–200 Sets",
        price: 1530,
        savingsPct: 20,
        leadTime: "5–7 Days",
        allowedCustomizations: 3,
        customizationAllowanceText: "Choose any 3 of 5 wedding customizations below.",
        nextTierUnlockText: "Royal Wedding (201+) unlocks all 5 →",
        perks: ["20% Off MRP", "3 Free Customizations", "Free Physical Sample Kit"]
      },
      {
        id: "tier-3",
        tierNumber: 3,
        title: "Royal Wedding",
        badge: "25% OFF",
        isPopular: false,
        min: 201,
        max: null,
        rangeLabel: "201+ Sets",
        price: 1440,
        savingsPct: 25,
        leadTime: "3–5 Days",
        allowedCustomizations: 5,
        customizationAllowanceText: "All 5 wedding customizations included free.",
        nextTierUnlockText: "",
        perks: ["25% Off MRP", "All 5 Free", "Doorstep Venue Delivery", "Dedicated Wedding RM"]
      }
    ],
    customizations: [
      {
        id: "couple_monogram",
        name: "Couple Name & Date Monogram",
        tag: "Laser Etched",
        badge: "Bridal Monogram",
        desc: "Both names and wedding date laser-engraved on each canister lid.",
        icon: BadgeCheck
      },
      {
        id: "blush_gift_box",
        name: "Blush Pink Bridal Gift Box",
        tag: "Bridal Box",
        badge: "Rigid Box",
        desc: "Premium blush pink rigid box with gold foil embossed lid and satin ribbon.",
        icon: Box
      },
      {
        id: "wedding_seed_card",
        name: "Plantable Seed Paper Wedding Card",
        tag: "Plantable",
        badge: "Eco Card",
        desc: "Eco-friendly seed paper insert card with personalized wedding wishes.",
        icon: FileText
      },
      {
        id: "floral_motif_print",
        name: "Floral / Block-Print Motif",
        tag: "Motif Print",
        badge: "Artisan Motif",
        desc: "Rajasthani or floral block-print motif screen printed on canister body.",
        icon: Palette
      },
      {
        id: "wedding_ribbon_wrap",
        name: "Silk Ribbon & Wax Seal Wrap",
        tag: "Ribbon Wrap",
        badge: "Wax Seal",
        desc: "Ivory silk ribbon tied around each box with a custom wax seal impression.",
        icon: Gift
      }
    ]
  },
  {
    key: "festive",
    label: "Festive Season Gifting",
    subtitle: "Diwali, Eid, New Year Hampers",
    comesUnder: "Festive Season Gifting & Hampers",
    badgeText: "Festive Season Edition",
    plainExplanation: "This product comes under Festive Season Gifting — packaged with festive hampers, traditional motif screen prints, and greeting cards for Diwali, New Year, and festivals.",
    bestSuitedFor: "Diwali Hampers, New Year Gifts, Employee Festive Packs, Family Celebrations & Eid/Christmas",
    packagingDetails: "Decorative Festive Hamper Gift Box with Gold Motif & Greetings Card",
    moq: 10,
    icon: Flame,
    leadTime: "5–8 Days",
    tiers: [
      {
        id: "tier-1",
        tierNumber: 1,
        title: "Festive Starter",
        badge: "MOQ 10",
        isPopular: false,
        min: 10,
        max: 100,
        rangeLabel: "10–100 Sets",
        price: 1750,
        savingsPct: 15,
        leadTime: "7 Days",
        allowedCustomizations: 2,
        customizationAllowanceText: "Choose any 2 of 5 festive customizations below.",
        nextTierUnlockText: "Festive Bulk (101+) unlocks 3 →",
        perks: ["15% Off MRP", "Festive Hamper Box", "2 Free Customizations"]
      },
      {
        id: "tier-2",
        tierNumber: 2,
        title: "Festive Bulk",
        badge: "20% OFF",
        isPopular: false,
        min: 101,
        max: 200,
        rangeLabel: "101–200 Sets",
        price: 1485,
        savingsPct: 20,
        leadTime: "5 Days",
        allowedCustomizations: 3,
        customizationAllowanceText: "Choose any 3 of 5 festive customizations free.",
        nextTierUnlockText: "Mega Festive (201+) unlocks all 5 →",
        perks: ["20% Off MRP", "3 Free Customizations", "Rush 5-Day Production"]
      },
      {
        id: "tier-3",
        tierNumber: 3,
        title: "Mega Festive",
        badge: "25% OFF",
        isPopular: false,
        min: 201,
        max: null,
        rangeLabel: "201+ Sets",
        price: 1400,
        savingsPct: 25,
        leadTime: "3 Days",
        allowedCustomizations: 5,
        customizationAllowanceText: "All 5 festive customizations included free.",
        nextTierUnlockText: "",
        perks: ["25% Off MRP", "All 5 Free", "3-Day Rush Production", "Dedicated Festive RM"]
      }
    ],
    customizations: [
      {
        id: "festive_hamper_box",
        name: "Festive Hamper Gift Box",
        tag: "Hamper Box",
        badge: "Festive Edition",
        desc: "Decorative hamper box with shredded kraft filler, tissue, and ribbon bow.",
        icon: Box
      },
      {
        id: "festive_motif_print",
        name: "Festive Motif Screen Print",
        tag: "Seasonal Print",
        badge: "Gold Print",
        desc: "Season motif: diya, crescent star, snowflake, or rangoli on the lid.",
        icon: Palette
      },
      {
        id: "season_greet_card",
        name: "Season's Greetings Insert Card",
        tag: "Insert Card",
        badge: "Embossed",
        desc: "Custom festival greetings card with company logo and personalized message.",
        icon: FileText
      },
      {
        id: "festive_colourway",
        name: "Festive Edition Body Colour",
        tag: "Festive Tone",
        badge: "Seasonal Color",
        desc: "Seasonal colour variant: Diwali gold, Eid ivory, or Christmas red.",
        icon: Palette
      },
      {
        id: "name_monogram_festive",
        name: "Recipient Name Monogram",
        tag: "Per-Piece",
        badge: "Personalized",
        desc: "Individual recipient name laser-engraved for a personalised festive touch.",
        icon: BadgeCheck
      }
    ]
  },
  {
    key: "employee-onboarding",
    label: "Employee Onboarding",
    subtitle: "New Joiner Welcome Kits",
    comesUnder: "Employee Onboarding & HR Welcome Kits",
    badgeText: "Employee Onboarding Edition",
    plainExplanation: "This product comes under Employee Onboarding & HR Kits — curated for welcoming new hires, campus recruits, and remote team packages with individual name monograms.",
    bestSuitedFor: "HR New Joiner Welcome Kits, Induction Day Gifts, Campus Recruits & Remote Team Packs",
    packagingDetails: "Branded New Hire Welcome Kit Box with HR Welcome Card & Monogram",
    moq: 10,
    icon: Users,
    leadTime: "3–5 Days",
    tiers: [
      {
        id: "tier-1",
        tierNumber: 1,
        title: "Starter Team",
        badge: "MOQ 10",
        isPopular: false,
        min: 10,
        max: 100,
        rangeLabel: "10–100 Sets",
        price: 1700,
        savingsPct: 15,
        leadTime: "5 Days",
        allowedCustomizations: 2,
        customizationAllowanceText: "2 complimentary onboarding customizations included.",
        nextTierUnlockText: "Growing Team (101+) unlocks 3 →",
        perks: ["15% Off MRP", "Suitable for startups", "2 Free Customizations"]
      },
      {
        id: "tier-2",
        tierNumber: 2,
        title: "Growing Team",
        badge: "20% OFF",
        isPopular: false,
        min: 101,
        max: 200,
        rangeLabel: "101–200 Sets",
        price: 1445,
        savingsPct: 20,
        leadTime: "4 Days",
        allowedCustomizations: 3,
        customizationAllowanceText: "Choose any 3 of 5 onboarding customizations free.",
        nextTierUnlockText: "Enterprise (201+) unlocks all 5 →",
        perks: ["20% Off MRP", "3 Free Customizations", "Priority Production"]
      },
      {
        id: "tier-3",
        tierNumber: 3,
        title: "Enterprise Hiring",
        badge: "25% OFF",
        isPopular: false,
        min: 201,
        max: null,
        rangeLabel: "201+ Sets",
        price: 1360,
        savingsPct: 25,
        leadTime: "3 Days",
        allowedCustomizations: 5,
        customizationAllowanceText: "All 5 onboarding customizations included.",
        nextTierUnlockText: "",
        perks: ["25% Off MRP", "All 5 Free", "Dedicated HR RM", "Monthly Batch Scheduling"]
      }
    ],
    customizations: [
      {
        id: "company_logo_engrave",
        name: "Company Logo Laser Engraving",
        tag: "Laser Etched",
        badge: "Logo Print",
        desc: "Laser-engraved company logo and tagline on the canister lid.",
        icon: BadgeCheck
      },
      {
        id: "welcome_kit_box",
        name: "Branded Welcome Kit Box",
        tag: "Welcome Box",
        badge: "HR Welcome Kit",
        desc: "Custom-printed rigid box with company colors, shredded filler, and joining note.",
        icon: Box
      },
      {
        id: "emp_name_monogram",
        name: "Employee Name Monogram",
        tag: "Per-Piece",
        badge: "Personalized",
        desc: "Individual employee name laser-engraved on each canister.",
        icon: BadgeCheck
      },
      {
        id: "welcome_note_card",
        name: "Personalized Welcome Note Card",
        tag: "Insert Card",
        badge: "Seed Paper",
        desc: "Custom printed plantable seed paper card with HR welcome message.",
        icon: FileText
      },
      {
        id: "brand_colorway_kit",
        name: "Company Brand Colorway",
        tag: "Brand Tone",
        badge: "Custom Tone",
        desc: "Rice husk body tone matched to company brand color for cohesive kit look.",
        icon: Palette
      }
    ]
  }
];

export const B2B_CUSTOMIZATIONS = B2B_OCCASIONS[0].customizations;

function DishwasherIcon({ className = "w-4 h-4", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
      aria-hidden="true"
    >
      <rect width="18" height="18" x="3" y="3" rx="2.5" />
      <line x1="3" x2="21" y1="8" y2="8" />
      <circle cx="7" cy="5.5" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="10" cy="5.5" r="0.75" fill="currentColor" stroke="none" />
      <path d="M7 17h10" />
      <path d="M8.5 17a3.5 3.5 0 0 1 7 0" />
      <path d="M9 11l.5 1.5M12 10.5v2M15 11l-.5 1.5" />
    </svg>
  );
}

function normalizeImageUrl(img) {
  if (!img) return "/images/placeholder.jpg";
  if (typeof img === "object" && img !== null) {
    img = img.url || img.secure_url || img.src || img.path || "";
  }
  if (typeof img !== "string" || !img.trim()) return "/images/placeholder.jpg";
  img = img.trim();
  if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("/")) {
    return img;
  }
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://api.greenfibre.org";
  return `${apiBase}/${img.replace(/^\/+/, "")}`;
}

export default function ProductDetailView({ product, context, relatedProducts: rawRelated = [] }) {
  const relatedProducts = (rawRelated || []).filter(
    (rel) => rel && !String(rel.slug || rel.name || "").toLowerCase().includes("tulsi")
  );
  const { add, addBatch, updateCustomizations, items } = useQuote() || {};
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSetProduct =
    product.unit?.toLowerCase() === "set" ||
    /\b(set|sets|storage bowl|storage bowls|bowl set|bowls set|dining set|hamper|combo|pack of|gift set|kit)\b/i.test(product.name || "") ||
    /\b(set|sets|storage bowl|storage bowls|bowl set|bowls set|dining set|hamper|combo|pack of|gift set|kit)\b/i.test(product.slug || "");

  const unitLabel = isSetProduct ? "set" : (product.unit || "piece");
  const unitLabelPlural = isSetProduct
    ? "Sets"
    : (product.unit?.toLowerCase() === "box"
      ? "Boxes"
      : product.unit?.toLowerCase() === "pack"
        ? "Packs"
        : product.unit?.toLowerCase() === "set"
          ? "Sets"
          : "Pieces");

  // Extract all unique images
  const rawImagesList = [
    product.image,
    ...(Array.isArray(product.images) ? product.images : []),
    ...(Array.isArray(product.colors)
      ? product.colors.flatMap((c) => (Array.isArray(c.images) ? c.images : [c.image]))
      : []),
    ...(Array.isArray(product.giftBoxImages) ? product.giftBoxImages : []),
    ...(Array.isArray(product.giftPackaging?.images) ? product.giftPackaging.images : [])
  ]
    .filter(Boolean)
    .map(normalizeImageUrl);

  const allImages = Array.from(new Set(rawImagesList));
  const images = allImages.length > 0 ? allImages : ["/images/placeholder.jpg"];

  // Color shade hex resolution helper
  const getColorHex = (cName = "", defaultHex = "") => {
    if (defaultHex && typeof defaultHex === "string" && defaultHex.startsWith("#")) return defaultHex;
    const name = String(cName).toLowerCase();
    if (name.includes("sage") || name.includes("green") || name.includes("olive")) return "#6A9955";
    if (name.includes("charcoal") || name.includes("black") || name.includes("slate") || name.includes("grey") || name.includes("gray")) return "#2D3748";
    if (name.includes("orange") || name.includes("terracotta") || name.includes("coral") || name.includes("rust")) return "#D97757";
    if (name.includes("brown") || name.includes("coffee") || name.includes("husk") || name.includes("wood")) return "#8C6239";
    if (name.includes("teal") || name.includes("blue") || name.includes("cyan") || name.includes("ocean")) return "#2A9D8F";
    if (name.includes("pink") || name.includes("rose") || name.includes("blush")) return "#E8A598";
    if (name.includes("white") || name.includes("cream") || name.includes("ivory")) return "#FAF7F2";
    if (name.includes("yellow") || name.includes("mustard") || name.includes("ochre")) return "#E9C46A";
    return "#E5DAC8"; // Natural Husk Sand
  };

  // Normalize colors
  const rawColorList = Array.isArray(product.colors) && product.colors.length > 0
    ? product.colors
    : Array.isArray(product.colours) && product.colours.length > 0
      ? product.colours
      : ["Natural Sand", "Sage Green"];

  const colorVariants = rawColorList.map((c, idx) => {
    const name = typeof c === "string" ? c : c?.name || `Variant ${idx + 1}`;
    const id = typeof c === "object" ? (c?._id || c?.id || `variant-${idx}`) : `variant-${idx}`;
    const rawImgs = typeof c === "object" ? (c?.images || (c?.image ? [c.image] : [])) : [];
    const cImgs = Array.isArray(rawImgs)
      ? rawImgs.map(normalizeImageUrl)
      : typeof rawImgs === "string"
        ? [normalizeImageUrl(rawImgs)]
        : [];
    const colorHex = getColorHex(name, typeof c === "object" ? (c?.colorHex || c?.hex) : "");
    const colorStock = typeof c === "object" && typeof c?.stock === "number"
      ? c.stock
      : (typeof c === "object" && typeof c?.b2bStock === "number" ? c.b2bStock : null);
    return {
      id,
      name,
      colorHex,
      stock: colorStock ?? product.totalStock ?? product.stockQuantity ?? 100,
      b2bStock: typeof c === "object" ? c?.b2bStock : undefined,
      images: cImgs
    };
  });

  // Calculate verified total stock across product or variants
  const totalStock = (function () {
    if (typeof product.totalStock === "number" && product.totalStock >= 0) return product.totalStock;
    if (typeof product.stockQuantity === "number" && product.stockQuantity >= 0) return product.stockQuantity;
    if (colorVariants.length > 0 && colorVariants.some((c) => typeof c.stock === "number")) {
      const sum = colorVariants.reduce((acc, c) => acc + (typeof c.stock === "number" ? c.stock : 0), 0);
      if (sum > 0) return sum;
    }
    if (typeof product.stock === "number" && product.stock >= 0) return product.stock;
    return 448;
  })();

  const initialColor = colorVariants[0]?.name || "Natural Sand";

  // Context / Occasion resolved from previous page selection
  const resolvedOccasionKey = (function () {
    const raw = context || product.activeContext?.key || (typeof product.category === "string" ? product.category : "");
    const lower = String(raw).toLowerCase().trim();
    if (lower === "anniversary" || lower.includes("anniv")) return "anniversary";
    if (lower === "wedding" || lower.includes("wed")) return "wedding";
    if (lower === "festive" || lower.includes("festiv") || lower.includes("birth") || lower.includes("house") || lower.includes("diwali")) return "festive";
    if (lower === "employee-onboarding" || lower === "onboarding" || lower.includes("onboard") || lower.includes("employ") || lower.includes("inst")) return "employee-onboarding";
    return "corporate";
  })();

  // Find active occasion config
  const activeOccasion =
    B2B_OCCASIONS.find((o) => o.key === resolvedOccasionKey) || B2B_OCCASIONS[0];

  const mrp =
    typeof product.mrp === "number" && product.mrp > 0
      ? product.mrp
      : typeof product.retailPrice === "number" && product.retailPrice > 0
        ? product.retailPrice
        : typeof product.originalPrice === "number" && product.originalPrice > 0
          ? product.originalPrice
          : (typeof product.price === "number" ? product.price : 0);

  // The base reference price is the MRP (user gives 20% off MRP per piece for Tier 1)
  const basePrice = mrp > 0 ? mrp : (typeof product.price === "number" ? product.price : 0);
  const wholesaleUnitPrice = basePrice;
  const currentCustomizations = activeOccasion.customizations;

  // Tiers: base discount percentages + 5% Extra Diwali Special discount for primary products.
  const currentTiers = activeOccasion.tiers.map((t) => {
    const baseDiscount = t.tierNumber === 1 ? 15 : t.tierNumber === 2 ? 20 : 25;
    const discountPct = baseDiscount + 5; // 20%, 25%, 30%
    const effectivePricePerUnit = basePrice > 0
      ? Math.round(basePrice * (1 - discountPct / 100))
      : Math.round(t.price * 0.95);
    return {
      ...t,
      badge: `-${discountPct}%`,
      savingsPct: discountPct,
      price: effectivePricePerUnit
    };
  });
  const currentMoq = activeOccasion.moq || 10;
  const minMoq = Math.max(1, currentMoq);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColour, setSelectedColour] = useState(initialColor);

  // Helper: Account for quantities of each variant already in the basket without subtracting twice
  const getBasketQtyForColor = (colorName) => {
    if (!Array.isArray(items)) return 0;
    return items
      .filter(
        (it) =>
          it.slug === product.slug &&
          (it.colour === colorName || it.selectedColor === colorName || it.color === colorName)
      )
      .reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
  };

  // Max addable limit per variant
  const variantMaxStock = {};
  colorVariants.forEach((v) => {
    const inBasket = getBasketQtyForColor(v.name);
    variantMaxStock[v.name] = Math.max(0, v.stock - inBasket);
  });

  // Independent quantities state per color variant
  const [variantQtys, setVariantQtys] = useState(() => {
    const initial = {};
    let allocated = 0;
    const target = minMoq;
    for (let i = 0; i < colorVariants.length; i++) {
      const v = colorVariants[i];
      const maxStock = variantMaxStock[v.name] ?? v.stock ?? 0;
      if (allocated < target && maxStock > 0) {
        const take = Math.min(target - allocated, maxStock);
        initial[v.name] = take;
        allocated += take;
      } else {
        initial[v.name] = 0;
      }
    }
    return initial;
  });

  const [variantQtyInputs, setVariantQtyInputs] = useState(() => {
    const initial = {};
    for (const v of colorVariants) {
      initial[v.name] = String(variantQtys?.[v.name] ?? 0);
    }
    return initial;
  });

  // Combined selected quantity across all variants
  const totalCombinedQty = Object.values(variantQtys).reduce(
    (acc, q) => acc + (Number(q) || 0),
    0
  );
  const qty = totalCombinedQty;

  const [brandingNotes, setBrandingNotes] = useState("");
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [engravingName, setEngravingName] = useState("");
  const [customProductName, setCustomProductName] = useState("");
  const [packagingOption, setPackagingOption] = useState("Standard Recyclable Eco Kraft Box");
  const [added, setAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, images.length]);

  const [modalStep, setModalStep] = useState(1);
  const [activeTab, setActiveTab] = useState("set_contents");
  const [showAllSpecs, setShowAllSpecs] = useState(false);

  const [pairQtys, setPairQtys] = useState({});
  const [pairAdded, setPairAdded] = useState({});

  const getPairQty = (slug) => pairQtys[slug] ?? 0;

  const handlePairQtyChange = (slug, newQty) => {
    const raw = typeof newQty === "string" ? newQty.replace(/\D/g, "") : newQty;
    const parsed = typeof raw === "number" ? raw : parseInt(raw, 10);
    setPairQtys((prev) => ({
      ...prev,
      [slug]: isNaN(parsed) ? 0 : Math.max(0, parsed)
    }));
  };

  const handleAddPairToQuote = (rel, explicitQty) => {
    if (!add) return;
    const specified = typeof explicitQty === "number" ? explicitQty : getPairQty(rel.slug);
    const relQty = specified > 0 ? specified : 1;
    if (getPairQty(rel.slug) === 0) {
      setPairQtys((prev) => ({ ...prev, [rel.slug]: relQty }));
    }
    const originalPrice =
      rel.price || rel.wholesalePrice || rel.originalBasePrice || rel.discountedPrice || rel.originalPrice || rel.retailPrice || 0;
    const discountedPrice = originalPrice > 0 ? Math.round(originalPrice * 0.90) : 0;

    const pairColour = (rel.colours && rel.colours[0]) || (rel.colors && rel.colors[0]?.name) || "Default";

    const pairPayload = {
      ...rel,
      productId: rel._id || rel.id,
      raw_sku: rel.sku || "GF-B2B",
      channel: "b2b",
      addOn: true,
      isPair: true,
      isPairItem: true,
      colour: pairColour,
      color: pairColour,
      selectedColor: pairColour,
      selectedColour: pairColour,
      variantId: (rel.colors && rel.colors[0]?.id) || (rel.colors && rel.colors[0]?._id) || "addon-var-1",
      wholesalePrice: originalPrice,
      price: discountedPrice > 0 ? discountedPrice : originalPrice,
      originalBasePrice: originalPrice,
      retailPrice: originalPrice,
      activeTierTitle: "Bundle 5% Off Pairing",
      bundleDiscountApplied: true,
      parentSlug: product.slug,
      pairedWithSlug: product.slug,
      pairedWithKey: `${product.slug}-${selectedColour}`,
      parentName: product.name
    };

    add(pairPayload, pairColour, relQty);
    setPairAdded((prev) => ({ ...prev, [rel.slug]: true }));
    setTimeout(() => {
      setPairAdded((prev) => ({ ...prev, [rel.slug]: false }));
    }, 2500);
  };

  // Determine active tier based on total combined quantity
  const activeTierObj =
    currentTiers.slice().reverse().find((t) => totalCombinedQty >= t.min) || currentTiers[0];

  const maxCustomizations =
    activeTierObj.tierNumber === 1 ? 2 : activeTierObj.tierNumber === 2 ? 3 : 5;

  const [selectedCustomizations, setSelectedCustomizations] = useState(() => [
    currentCustomizations[0].id,
    currentCustomizations[2] ? currentCustomizations[2].id : currentCustomizations[1].id
  ]);

  useEffect(() => {
    setSelectedCustomizations((prev) => {
      if (prev.length > maxCustomizations) {
        return prev.slice(0, maxCustomizations);
      }
      return prev;
    });
  }, [maxCustomizations]);

  // Pricing calculations based on combined total
  const baseTierDiscountPct = activeTierObj.tierNumber === 1 ? 15 : activeTierObj.tierNumber === 2 ? 20 : 25;
  const activeTierDiscountPct = baseTierDiscountPct + 5; // 20%, 25%, 30%
  const grossWholesaleSubtotal = wholesaleUnitPrice * totalCombinedQty;
  const mainDiscountAmount = Math.round(grossWholesaleSubtotal * activeTierDiscountPct / 100);
  const estimatedSubtotal = grossWholesaleSubtotal - mainDiscountAmount;
  const effectiveUnitPrice = wholesaleUnitPrice > 0
    ? Math.round(wholesaleUnitPrice * (1 - activeTierDiscountPct / 100))
    : activeTierObj.price;

  // Independent Stepper & Input Handlers
  const handleAdjustVariantQty = (colorName, delta) => {
    const cur = variantQtys[colorName] || 0;
    const maxLimit = variantMaxStock[colorName] ?? 999999;
    const target = cur + delta;
    const clamped = Math.max(0, Math.min(maxLimit, target));
    setVariantQtys((prev) => ({ ...prev, [colorName]: clamped }));
    setVariantQtyInputs((prev) => ({ ...prev, [colorName]: String(clamped) }));
  };

  const handleVariantInputChange = (colorName, val) => {
    const cleaned = val.replace(/\D/g, "");
    setVariantQtyInputs((prev) => ({ ...prev, [colorName]: cleaned }));
    if (cleaned !== "") {
      const parsed = parseInt(cleaned, 10);
      if (!isNaN(parsed)) {
        const maxLimit = variantMaxStock[colorName] ?? 999999;
        const clamped = Math.max(0, Math.min(maxLimit, parsed));
        setVariantQtys((prev) => ({ ...prev, [colorName]: clamped }));
      }
    }
  };

  const handleVariantInputBlur = (colorName) => {
    const raw = variantQtyInputs[colorName];
    const parsed = parseInt(raw, 10);
    const maxLimit = variantMaxStock[colorName] ?? 999999;
    const finalVal = isNaN(parsed) ? 0 : Math.max(0, Math.min(maxLimit, parsed));
    setVariantQtys((prev) => ({ ...prev, [colorName]: finalVal }));
    setVariantQtyInputs((prev) => ({ ...prev, [colorName]: String(finalVal) }));
  };

  const handleSelectTier = (tier) => {
    // Distribute tier min evenly or set to active variant
    const activeVar = colorVariants.find((c) => c.name === selectedColour) || colorVariants[0];
    const maxForActive = variantMaxStock[activeVar.name] || 0;
    if (maxForActive >= tier.min) {
      setVariantQtys((prev) => ({ ...prev, [activeVar.name]: tier.min }));
      setVariantQtyInputs((prev) => ({ ...prev, [activeVar.name]: String(tier.min) }));
    } else {
      // Allocate across variants up to tier.min
      let remaining = tier.min;
      const nextQtys = {};
      for (const v of colorVariants) {
        const vMax = variantMaxStock[v.name] || 0;
        const take = Math.min(remaining, vMax);
        nextQtys[v.name] = take;
        remaining -= take;
      }
      setVariantQtys(nextQtys);
      const nextInputs = {};
      for (const v of colorVariants) {
        nextInputs[v.name] = String(nextQtys[v.name] || 0);
      }
      setVariantQtyInputs(nextInputs);
    }
  };

  const handleSetExactQty = (targetQty) => {
    const activeVar = colorVariants.find((c) => c.name === selectedColour) || colorVariants[0];
    const maxForActive = variantMaxStock[activeVar.name] || 0;
    if (maxForActive >= targetQty) {
      setVariantQtys((prev) => ({ ...prev, [activeVar.name]: targetQty }));
      setVariantQtyInputs((prev) => ({ ...prev, [activeVar.name]: String(targetQty) }));
    } else {
      let remaining = targetQty;
      const nextQtys = {};
      for (const v of colorVariants) {
        const vMax = variantMaxStock[v.name] || 0;
        const take = Math.min(remaining, vMax);
        nextQtys[v.name] = take;
        remaining -= take;
      }
      setVariantQtys(nextQtys);
      const nextInputs = {};
      for (const v of colorVariants) {
        nextInputs[v.name] = String(nextQtys[v.name] || 0);
      }
      setVariantQtyInputs(nextInputs);
    }
  };

  const handleSelectImage = (idx) => {
    setActiveImageIndex(idx);
    const clickedImg = images[idx];
    const matchingColor = colorVariants.find(
      (c) => Array.isArray(c.images) && c.images.includes(clickedImg)
    );
    if (matchingColor) {
      setSelectedColour(matchingColor.name);
    }
  };

  const handleSelectColor = (colorName) => {
    setSelectedColour(colorName);
    const matched = colorVariants.find((c) => c.name === colorName);
    if (matched && Array.isArray(matched.images) && matched.images.length > 0) {
      const targetImg = matched.images[0];
      const imgIdx = images.findIndex((img) => img === targetImg);
      if (imgIdx !== -1) {
        setActiveImageIndex(imgIdx);
      }
    }
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const buildProductPayloadForVariant = (variant, variantQty) => {
    const selectedCustomizationObjs = currentCustomizations.filter((c) =>
      selectedCustomizations.includes(c.id)
    );
    const variantGross = wholesaleUnitPrice * variantQty;
    const variantDiscount = Math.round(variantGross * activeTierDiscountPct / 100);

    return {
      ...product,
      productId: product._id || product.id,
      raw_sku: product.sku || "GF-B2B",
      channel: "b2b",
      addOn: false,
      isPrimary: true,
      isPair: false,
      isPairItem: false,
      unit: unitLabel,
      // Explicitly set colour/color/selectedColor/selectedColour/variantId AFTER ...product so product.colour can never win
      colour: variant.name,
      color: variant.name,
      selectedColor: variant.name,
      selectedColour: variant.name,
      variantId: variant.id || variant._id || `var-${variant.name}`,
      price: effectiveUnitPrice,
      wholesalePrice: wholesaleUnitPrice,
      discountPct: activeTierDiscountPct,
      grossTotal: variantGross,
      discountAmount: variantDiscount,
      originalBasePrice: wholesaleUnitPrice,
      retailMrp: mrp,
      mrp: mrp,
      customBranding: selectedCustomizations.length > 0,
      selectedCustomizations: selectedCustomizationObjs.map((c) => c.name),
      customizationCount: selectedCustomizations.length,
      maxAllowedCustomizations: maxCustomizations,
      brandingNotes,
      packagingOption,
      senderName: senderName.trim(),
      receiverName: receiverName.trim(),
      giftMessage: giftMessage.trim(),
      engravingName: engravingName.trim(),
      customProductName: customProductName.trim(),
      activeOccasion: activeOccasion.label,
      activeOccasionKey: activeOccasion.key,
      activeTierTitle: activeTierObj.title,
      activeTierNumber: activeTierObj.tierNumber
    };
  };

  const handleAddToCart = () => {
    if (isAdding) return;
    if (!add) return;

    if (totalCombinedQty < minMoq) {
      alert(`Minimum order quantity is ${minMoq} ${unitLabelPlural}.`);
      return;
    }

    const selectedVariantsToAdd = colorVariants.filter(
      (v) => (variantQtys[v.name] || 0) > 0
    );

    if (selectedVariantsToAdd.length === 0) {
      return;
    }

    setIsAdding(true);

    const batch = selectedVariantsToAdd.map((v) => ({
      product: buildProductPayloadForVariant(v, variantQtys[v.name]),
      colour: v.name,
      qty: variantQtys[v.name]
    }));

    try {
      if (addBatch) {
        addBatch(batch);
      } else {
        for (const item of batch) {
          add(item.product, item.colour, item.qty);
        }
      }

      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
      setModalStep(1);
      setIsCustomizeModalOpen(true);
      if (typeof document !== "undefined") document.body.style.overflow = "hidden";
    } catch (err) {
      console.error("Failed to add items to basket:", err);
      alert("Failed to add items to basket. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleSaveCustomizations = () => {
    if (updateCustomizations) {
      const selectedVariants = colorVariants.filter((v) => (variantQtys[v.name] || 0) > 0);
      const updates = {};
      for (const v of selectedVariants) {
        const key = `${product.slug}-${v.name}`;
        updates[key] = buildProductPayloadForVariant(v, variantQtys[v.name]);
      }
      updateCustomizations(updates);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    if (updateCustomizations) {
      const selectedVariants = colorVariants.filter((v) => (variantQtys[v.name] || 0) > 0);
      const updates = {};
      for (const v of selectedVariants) {
        const key = `${product.slug}-${v.name}`;
        updates[key] = buildProductPayloadForVariant(v, variantQtys[v.name]);
      }
      updateCustomizations(updates);
    }
    setIsCustomizeModalOpen(false);
    setModalStep(1);
    if (typeof document !== "undefined") document.body.style.overflow = "";
  };

  const activeImage = images[activeImageIndex] || images[0];

  const setContentsText =
    product.specs?.["Set Contents"] ||
    product.specs?.["Set Includes"] ||
    product.package?.contents ||
    (product.desc?.includes("Set of")
      ? product.desc.split(".")[0]
      : `${product.name}`);

  const totalSavings = mainDiscountAmount;
  const effectiveSavingsPct = activeTierDiscountPct;

  const rawSpecs = product.specs || {};
  const hasDimensionInSpecs = Object.keys(rawSpecs).some((k) =>
    /length|width|height|dimension|size/i.test(k)
  );
  const hasWeightInSpecs = Object.keys(rawSpecs).some((k) => /weight/i.test(k));
  const hasMaterialInSpecs = Object.keys(rawSpecs).some((k) => /material/i.test(k));

  const extraSpecs = {
    "Gifting Classification": activeOccasion.comesUnder,
    "Best Suited For": activeOccasion.bestSuitedFor,
    "Gift Packaging Format": activeOccasion.packagingDetails,
    "Customization Allowance": "Tier 1: 2 of 5 | Tier 2: 3 of 5 | Tier 3: All 5"
  };
  if (!hasMaterialInSpecs && product.material) {
    extraSpecs["Material Formulation"] = product.material;
  }
  if (!hasDimensionInSpecs && product.dimensions?.length && product.dimensions.length > 0) {
    extraSpecs["Dimensions (L × W × H)"] = `${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} ${product.dimensions.unit || "cm"}`;
  } else if (!hasDimensionInSpecs && product.size) {
    extraSpecs["Dimensions / Size"] = product.size;
  }
  if (!hasWeightInSpecs && product.productWeight?.value && product.productWeight.value > 0) {
    extraSpecs["Product Weight"] = `${product.productWeight.value} ${product.productWeight.unit || "gm"}`;
  }

  const combinedSpecs = { ...extraSpecs, ...rawSpecs };

  const technicalSpecsList = useMemo(() => {
    const list = [
      { key: "material", label: "Material", value: product.material || "Rice husk biocomposite" },
      { key: "colour", label: "Colour", value: colorVariants.map((c) => c.name).join(" / ") || selectedColour },
    ];

    if (product.specs?.Capacity || product.specs?.capacity || product.size) {
      list.push({ key: "capacity", label: "Capacity", value: product.specs?.Capacity || product.specs?.capacity || product.size });
    }

    if (product.productWeight?.value || product.specs?.Weight || product.specs?.weight) {
      list.push({
        key: "weight",
        label: "Product Weight",
        value: product.productWeight?.value
          ? `${product.productWeight.value} ${product.productWeight.unit || "gm"}`
          : (product.specs?.Weight || product.specs?.weight || "240 gm")
      });
    }

    if (product.dimensions?.length || product.specs?.Length || product.specs?.length) {
      list.push({
        key: "length",
        label: "Product Length",
        value: product.dimensions?.length ? `${product.dimensions.length} cm` : (product.specs?.Length || product.specs?.length || "16 cm")
      });
    }

    if (product.dimensions?.width || product.specs?.Width || product.specs?.width) {
      list.push({
        key: "width",
        label: "Product Width",
        value: product.dimensions?.width ? `${product.dimensions.width} cm` : (product.specs?.Width || product.specs?.width || "16 cm")
      });
    }

    if (product.dimensions?.height || product.specs?.Height || product.specs?.height) {
      list.push({
        key: "height",
        label: "Product Height",
        value: product.dimensions?.height ? `${product.dimensions.height} cm` : (product.specs?.Height || product.specs?.height || "6.5 cm")
      });
    }

    if (setContentsText) {
      list.push({ key: "setContents", label: "Set Contents", value: setContentsText });
    }

    Object.entries(rawSpecs)
      .filter(([k]) => !/capacity|weight|material|contents|length|width|height/i.test(k))
      .forEach(([k, v]) => {
        list.push({ key: k, label: k, value: typeof v === "object" ? JSON.stringify(v) : String(v) });
      });

    return list;
  }, [product, colorVariants, selectedColour, setContentsText, rawSpecs]);

  const visibleSpecs = showAllSpecs ? technicalSpecsList : technicalSpecsList.slice(0, 4);

  const giftItems =
    Array.isArray(product.giftSetContents?.products) && product.giftSetContents.products.length > 0
      ? product.giftSetContents.products
      : Array.isArray(product.giftBox?.products) && product.giftBox.products.length > 0
        ? product.giftBox.products
        : [];

  // Limit banner helper
  const renderLimitBanner = () => {
    const maxedVariants = colorVariants.filter((v) => {
      const max = variantMaxStock[v.name] || 0;
      const q = variantQtys[v.name] || 0;
      return max > 0 && q >= max;
    });

    const availableVariants = colorVariants.filter((v) => {
      const max = variantMaxStock[v.name] || 0;
      const q = variantQtys[v.name] || 0;
      return max > 0 && q < max;
    });

    if (maxedVariants.length > 0 && availableVariants.length === 0) {
      return (
        <div className="p-2 sm:p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>All available quantities selected.</span>
        </div>
      );
    }

    if (maxedVariants.length > 0 && availableVariants.length > 0) {
      const maxedV = maxedVariants[0];
      const availV = availableVariants[0];

      return (
        <div className="p-2 sm:p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 font-medium">
            <Info className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
            <span>
              <strong>{maxedV.name}</strong> limit reached. Add <strong>{availV.name}</strong> to continue.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              handleSelectColor(availV.name);
              if (typeof document !== "undefined") {
                const el = document.getElementById(`variant-input-${availV.name}`);
                if (el) {
                  el.focus();
                  el.select();
                }
              }
            }}
            className="px-2.5 py-1 rounded-md text-xs font-bold text-emerald-800 bg-white border border-emerald-300 hover:bg-emerald-50 transition-colors shadow-2xs cursor-pointer"
          >
            Select {availV.name}
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* =========================================================================
          HERO SECTION: FIT TO ONE DESKTOP SCREEN (1366x768 & 1920x1080)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

        {/* LEFT COLUMN: Gallery & Packaging Card (approx 38% width) */}
        <div className="lg:col-span-5 space-y-2.5 w-full min-w-0">
          {/* Main Stage Image Frame */}
          <div
            onClick={() => setIsLightboxOpen(true)}
            className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF7F2] border border-slate-200/90 shadow-2xs flex items-center justify-center group cursor-zoom-in"
          >
            <img
              src={optimizeImageUrl(activeImage, { width: 900, quality: "auto" })}
              srcSet={getImageSrcSet(activeImage, [480, 720, 960, 1200]) || undefined}
              sizes={IMAGE_SIZES.detail}
              alt={`${product.name} - ${selectedColour}`}
              loading="eager"
              decoding="async"
              className="w-full h-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-103"
              onError={(e) => {
                e.currentTarget.src = "/images/placeholder.jpg";
              }}
            />

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  aria-label="Previous photo"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md border border-slate-200/80 flex items-center justify-center transition-all opacity-85 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer z-10"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-800" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  aria-label="Next photo"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md border border-slate-200/80 flex items-center justify-center transition-all opacity-85 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer z-10"
                >
                  <ChevronRight className="w-4 h-4 text-slate-800" />
                </button>
              </>
            )}

            {/* Lightbox Zoom Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(true);
              }}
              aria-label="Zoom image"
              title="Inspect high-res image"
              className="absolute top-2.5 right-2.5 w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-slate-700 hover:text-emerald-800 shadow-sm border border-slate-200/80 flex items-center justify-center transition-colors cursor-pointer z-10"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Horizontal Thumbnails Row (48-56px rail) */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-0.5">
              {images.map((img, idx) => {
                const isActive = activeImageIndex === idx;
                return (
                  <button
                    key={img + idx}
                    type="button"
                    onClick={() => handleSelectImage(idx)}
                    className={`relative w-12 h-12 sm:w-13 sm:h-13 aspect-square rounded-xl overflow-hidden border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                      isActive
                        ? "border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs scale-102 bg-white"
                        : "border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100 bg-slate-50"
                    }`}
                    aria-label={`View angle ${idx + 1}`}
                  >
                    <img
                      src={optimizeImageUrl(img, { width: 140, height: 140, crop: "fill", quality: "auto" })}
                      alt={`Thumbnail ${idx + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        e.currentTarget.src = "/images/placeholder.jpg";
                      }}
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Compact Packaging & Presentation Card in Left Column */}
          <div className="hidden sm:flex bg-white border border-slate-200/90 rounded-xl p-2.5 sm:p-3 shadow-2xs items-center justify-between gap-3 mt-1.5">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Box className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Packaging &amp; Presentation</span>
              </div>
              <div className="text-xs font-semibold text-slate-800">
                Standard Recyclable Eco Kraft Gift Box
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Securely packed for safe transit. Ideal for corporate gifting.
              </p>
            </div>

            <div className="w-20 h-14 sm:w-24 sm:h-16 flex items-center justify-center flex-shrink-0">
              <img
                src="/images/packaging-box.webp"
                alt="Standard Recyclable Eco Kraft Gift Box"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/images/branding-demo.jpg";
                }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Product Identity, Pricing, Independent Quantities & Actions (approx 62% width) */}
        <div className="lg:col-span-7 space-y-2.5 sm:space-y-3 min-w-0">

          {/* Category Pill & Festival Badges */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                <span className="capitalize">
                  {typeof product.category === "string" ? product.category : product.category?.name || "Pet Care"}
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200/90 shadow-2xs">
                <span>🪔</span>
                <span>Extra 5% Off Diwali Special</span>
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-[28px] lg:text-[30px] font-bold text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Short Description */}
            <p className="text-xs sm:text-[13px] text-slate-600 line-clamp-2 leading-relaxed">
              {product.shortDescription || product.tagline || product.desc}
            </p>

            {/* Unit Price & MRP Display */}
            <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap pt-0.5">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                ₹{effectiveUnitPrice.toLocaleString("en-IN")}
                <span className="text-sm sm:text-base font-normal text-slate-500 ml-1">
                  /{unitLabel}
                </span>
              </div>
              {mrp > effectiveUnitPrice && (
                <div className="text-sm sm:text-base text-slate-400 line-through font-normal">
                  ₹{mrp.toLocaleString("en-IN")}
                </div>
              )}
            </div>
          </div>

          {/* Volume Pricing Card (Light Mint Surface) */}
          <div className="bg-emerald-50/40 border border-emerald-200/90 rounded-xl p-2.5 sm:p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-emerald-900 uppercase tracking-wide">
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
                <span>VOLUME PRICING<span className="hidden sm:inline"> (ACTIVE TIER)</span></span>
              </div>
              <span className="text-[10.5px] sm:text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 border border-emerald-200/60 px-2 py-0.5 rounded-full whitespace-nowrap">
                <span className="sm:hidden">Live Avail: {totalStock.toLocaleString("en-IN")}</span>
                <span className="hidden sm:inline">Total Stock: {totalStock.toLocaleString("en-IN")} Units</span>
              </span>
            </div>

            {/* 3 Tier Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {currentTiers.map((tier) => {
                const isActive = activeTierObj.id === tier.id;
                const exceedsStock = totalStock > 0 && tier.min > totalStock;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => handleSelectTier(tier)}
                    disabled={exceedsStock}
                    className={`p-2 sm:p-2.5 rounded-lg text-left transition-all relative border flex flex-col justify-between ${
                      exceedsStock
                        ? "bg-slate-50 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed"
                        : isActive
                          ? "bg-white border-2 border-emerald-600 shadow-sm ring-1 ring-emerald-500/20 cursor-pointer"
                          : "bg-white hover:border-emerald-300 border-slate-200 shadow-2xs hover:bg-slate-50/50 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <div className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
                        ₹{tier.price}
                        <span className="text-[10px] sm:text-[11px] font-normal text-slate-500 ml-0.5">
                          /{unitLabel}
                        </span>
                      </div>
                      {isActive && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      )}
                    </div>

                    <div className="text-[11px] text-slate-600 font-medium truncate">
                      {tier.rangeLabel}
                    </div>

                    <div className="text-[10px] sm:text-[11px] font-bold text-emerald-700 mt-0.5">
                      Save {tier.savingsPct}%<span className="hidden sm:inline"> vs MRP</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* INDEPENDENT VARIANT QUANTITY SELECTION */}
          <div className="space-y-2">
            {/* Header row */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  Choose quantities by colour
                </h3>
                <p className="text-[11px] text-slate-500 leading-tight">
                  You can add both colours to your order.
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md flex-shrink-0">
                MOQ: {minMoq} {unitLabelPlural}
              </span>
            </div>

            {/* Subgrid: Left = Variant rows + Limit banner; Right = Price Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-3.5 items-start">
              {/* Left sub-column: Variant rows */}
              <div className="md:col-span-7 space-y-2">
                {colorVariants.map((v) => {
                  const vQty = variantQtys[v.name] || 0;
                  const vMax = variantMaxStock[v.name] ?? v.stock ?? 0;
                  const vLeft = Math.max(0, vMax - vQty);
                  const isOutOfStock = v.stock <= 0;
                  const isAtLimit = vMax > 0 && vQty >= vMax;

                  return (
                    <div
                      key={v.id || v.name}
                      className={`p-2 sm:p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                        selectedColour === v.name
                          ? "bg-emerald-50/30 border-emerald-500/80 shadow-2xs"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {/* Color Swatch & Name + Stock */}
                      <div
                        className="flex items-center gap-2 min-w-0 cursor-pointer flex-1 select-none"
                        onClick={() => handleSelectColor(v.name)}
                        title={`Switch gallery preview to ${v.name}`}
                      >
                        <span
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-black/15 shadow-2xs flex-shrink-0"
                          style={{ backgroundColor: v.colorHex }}
                        />
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {v.name}
                          </div>
                          <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">
                            {isOutOfStock ? (
                              <span className="text-rose-600 font-semibold">Out of stock</span>
                            ) : (
                              <span>{vMax} available</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stepper + Status */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="inline-flex items-center bg-white rounded-lg border border-slate-200 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => handleAdjustVariantQty(v.name, -1)}
                            disabled={vQty <= 0}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer rounded-l-lg"
                            aria-label={`Decrease ${v.name} quantity`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            id={`variant-input-${v.name}`}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            disabled={isOutOfStock}
                            value={variantQtyInputs[v.name] ?? String(vQty)}
                            onChange={(e) => handleVariantInputChange(v.name, e.target.value)}
                            onBlur={() => handleVariantInputBlur(v.name)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleVariantInputBlur(v.name);
                            }}
                            className="w-9 sm:w-11 bg-transparent text-center font-extrabold text-slate-900 text-xs sm:text-sm focus:outline-none select-all"
                            aria-label={`${v.name} order quantity`}
                          />
                          <button
                            type="button"
                            onClick={() => handleAdjustVariantQty(v.name, 1)}
                            disabled={isOutOfStock || isAtLimit}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer rounded-r-lg"
                            title={isAtLimit ? `${v.name} limit reached (${vMax})` : `Add 1 ${v.name}`}
                            aria-label={`Increase ${v.name} quantity`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Status label: "X left to add" */}
                        <div className="w-16 sm:w-20 text-right text-[10px] sm:text-[11px] font-medium leading-tight">
                          {isOutOfStock ? (
                            <span className="text-slate-400">Unavailable</span>
                          ) : isAtLimit ? (
                            <span className="text-slate-500 font-semibold">0 left to add</span>
                          ) : (
                            <span className="text-slate-500">{vLeft} left to add</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Limit Banner */}
                {renderLimitBanner()}
              </div>

              {/* Right sub-column: PRICE BREAKDOWN Card */}
              <div className="md:col-span-5">
                <div className="bg-slate-50/90 border border-slate-200/90 rounded-xl p-2.5 sm:p-3 space-y-1.5">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    PRICE BREAKDOWN
                  </span>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Subtotal ({totalCombinedQty} {unitLabelPlural.toLowerCase()})</span>
                    <span className="font-semibold text-slate-800">
                      ₹{grossWholesaleSubtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {mainDiscountAmount > 0 && (
                    <div className="flex items-center justify-between text-xs text-emerald-700 font-bold">
                      <span>Bulk discount ({activeTierDiscountPct}% off)</span>
                      <span>− ₹{mainDiscountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="border-t border-slate-200/90 pt-1.5 mt-0.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-bold text-slate-700">Total ({totalCombinedQty} Pieces)</span>
                      <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                        ₹{estimatedSubtotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="text-right text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
                      (₹{effectiveUnitPrice.toLocaleString("en-IN")} / {unitLabel})
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Combined Quantity Summary Line */}
            {totalCombinedQty > 0 && (
              <div className="text-xs sm:text-sm font-semibold text-slate-800 pt-0.5">
                {colorVariants
                  .filter((v) => (variantQtys[v.name] || 0) > 0)
                  .map((v) => `${v.name} ${variantQtys[v.name]}`)
                  .join(" + ")}{" "}
                ={" "}
                <span className="text-emerald-700 font-extrabold text-sm sm:text-base">
                  {totalCombinedQty} {unitLabelPlural.toLowerCase()}
                </span>
              </div>
            )}

            {/* Action Buttons: Add to Basket & Review Basket */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding || totalCombinedQty < minMoq}
                className={`w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors min-h-[44px] ${
                  totalCombinedQty < minMoq
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : added
                      ? "bg-green-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white active:scale-[0.99]"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Added {totalCombinedQty} {unitLabelPlural} to Basket!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {totalCombinedQty < minMoq
                        ? `Select MOQ ${minMoq} ${unitLabelPlural}`
                        : `Add ${totalCombinedQty} ${unitLabelPlural} to Basket`}
                    </span>
                  </>
                )}
              </button>

              <Link
                href="/quote"
                className="w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 border border-slate-300 hover:border-green-600 hover:bg-green-50/60 text-slate-800 hover:text-green-800 transition-colors cursor-pointer text-center min-h-[44px]"
              >
                <span>Review Basket &amp; Order</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust / Logistics Row */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 text-[11px] sm:text-xs text-slate-500 pt-1.5 border-t border-slate-100">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Lead Time: {activeOccasion.leadTime || "7–10 Days"}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Pan-India Delivery</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Tax Invoice: {product.tax?.gstRate || 18}% GST Credit</span>
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* =========================================================================
          PRODUCT INFORMATION TABS (SPECIFICATIONS, SUSTAINABILITY, LOGISTICS)
         ========================================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/60 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("set_contents")}
            className={`px-5 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "set_contents"
                ? "border-emerald-600 text-emerald-800 bg-white"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Product Details &amp; All Specifications</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ordering")}
            className={`px-5 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "ordering"
                ? "border-emerald-600 text-emerald-800 bg-white"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
            }`}
          >
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>B2B Ordering &amp; Logistics</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 lg:p-7">
          {/* TAB 1: Product Details & All Specifications */}
          {activeTab === "set_contents" && (
            <div className="space-y-6">
              {giftItems.length > 0 && (
                <div className="space-y-3 pb-6 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Gift Set Contents ({giftItems.length} Products Included)
                    </h3>
                    <p className="text-xs text-slate-600">
                      Each product in this set is crafted from sustainable bio-composite.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {giftItems.map((item, idx) => (
                      <div key={item._id || idx} className="border border-slate-200/90 rounded-xl p-3 bg-slate-50/60 space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            Qty: {item.quantity} {item.unit || "pc"}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Two-Column Balanced Content for Tab 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                {/* Left Column: Technical Specifications Table */}
                <div className="lg:col-span-6 space-y-3">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Technical Specifications
                  </h3>
                  <div className="border border-slate-200/90 rounded-xl overflow-hidden">
                    <table className="w-full text-xs sm:text-sm">
                      <tbody className="divide-y divide-slate-100">
                        {visibleSpecs.map((spec) => (
                          <tr key={spec.key} className="hover:bg-slate-50/50">
                            <td className="py-2 px-3.5 font-semibold text-slate-600 bg-slate-50/60 w-2/5">
                              {spec.label}
                            </td>
                            <td className="py-2 px-3.5 text-slate-900 font-medium">
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {technicalSpecsList.length > 4 && (
                    <button
                      type="button"
                      onClick={() => setShowAllSpecs((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100/80 border border-green-200/80 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.98]"
                    >
                      <span>
                        {showAllSpecs
                          ? "View Less"
                          : `View All Specifications (${technicalSpecsList.length})`}
                      </span>
                      {showAllSpecs ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                {/* Right Column: Key Features & Gifting Occasions */}
                <div className="lg:col-span-6 space-y-5">
                  {/* Key Features & Material Benefits */}
                  <div className="space-y-2.5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      Key Features &amp; Material Benefits
                    </h3>
                    <div className="space-y-2">
                      {(Array.isArray(product.productFeatures) && product.productFeatures.length > 0
                        ? product.productFeatures
                        : [
                            "Made with bio-based rice husk composite",
                            "Hygienic non-porous finish resists odours & bacteria",
                            "Food grade safe, BPA-free and dishwasher safe",
                            "Durable and impact-resistant for daily use"
                          ]
                      ).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ideal For Corporate Gifting Occasions */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900">
                      <Gift className="w-4 h-4 text-emerald-600" />
                      <span>Ideal For Corporate Gifting Occasions</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {B2B_OCCASIONS.map((occ) => {
                        const OccIcon = occ.icon;
                        return (
                          <div
                            key={occ.key}
                            className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50/80 border border-slate-200/70"
                          >
                            <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <OccIcon className="w-3 h-3" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900">{occ.label}</h4>
                              <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{occ.subtitle}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: B2B Ordering & Logistics */}
          {activeTab === "ordering" && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                  Seamless B2B Ordering, Dispatch &amp; Logistics
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We supply enterprises, multinational companies, and event organizers across India with reliable dispatch schedules and dedicated support.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="border border-slate-200/90 rounded-xl p-3.5 space-y-1 bg-slate-50/50">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>Pan-India Logistics Support</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Direct door-to-door delivery to corporate offices, distribution centers, or multi-location branches across India with live consignment tracking.
                  </p>
                </div>

                <div className="border border-slate-200/90 rounded-xl p-3.5 space-y-1 bg-slate-50/50">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>GST Invoicing &amp; Credit Terms</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Official tax invoices with valid HSN codes for 18% GST Input Tax Credit. Verified enterprise buyers can request standard corporate procurement terms.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          PRODUCT FEATURE ICONS STRIP (4 EQUAL COLUMNS)
         ========================================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 sm:p-4 shadow-2xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="flex flex-col items-center justify-center p-1.5">
            <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mb-1" />
            <span className="text-xs font-bold text-slate-900">Rice Husk</span>
            <span className="text-[11px] text-slate-500">Bio-Composite</span>
          </div>
          <div className="flex flex-col items-center justify-center p-1.5 pt-2.5 md:pt-1.5">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mb-1" />
            <span className="text-xs font-bold text-slate-900">Food Grade</span>
            <span className="text-[11px] text-slate-500">TUV Certified</span>
          </div>
          <div className="flex flex-col items-center justify-center p-1.5 pt-2.5 md:pt-1.5">
            <DishwasherIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mb-1" />
            <span className="text-xs font-bold text-slate-900">Dishwasher</span>
            <span className="text-[11px] text-slate-500">Commercial Safe</span>
          </div>
          <div className="flex flex-col items-center justify-center p-1.5 pt-2.5 md:pt-1.5">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mb-1" />
            <span className="text-xs font-bold text-slate-900">Microwave</span>
            <span className="text-[11px] text-slate-500">Heat Safe</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          B2B BULK ORDER POLICY (2-COLUMN GRID ON DESKTOP)
         ========================================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3.5">
        <div className="flex items-center gap-2 text-slate-900 text-base sm:text-lg font-bold tracking-tight">
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>B2B Bulk Order Policy</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50/70 border border-slate-200/70">
            <Boxes className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-900">Minimum Order Quantity</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                MOQ starts at {minMoq} {unitLabelPlural}. Tier rates auto-apply on larger lots.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50/70 border border-slate-200/70">
            <PackageCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-900">Sampling Policy</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Samples available as per policy for qualified B2B buyers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50/70 border border-slate-200/70">
            <Truck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-900">Production &amp; Dispatch</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Standard lead time 5 – 7 business days. Post dispatch 3 – 7 days via trusted logistics partners.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50/70 border border-slate-200/70">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-900">Quality &amp; Compliance</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Consistent quality as per Green Fibre standards.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          FREQUENTLY ORDERED TOGETHER SECTION
         ========================================================================= */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="space-y-3.5 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Frequently Ordered Together
              </h3>
            </div>
            <Link
              href="/products"
              className="text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 transition-colors"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {relatedProducts.slice(0, 4).map((rel) => {
              const relMrp = Number(rel.mrp || rel.retailPrice || rel.originalPrice || 0);
              const relBase = relMrp > 0 ? relMrp : Number(rel.wholesalePrice || rel.price || 0);
              const relOffer = rel.offerPrice || (relBase > 0 ? Math.round(relBase * 0.80) : 0);

              return (
                <div
                  key={rel.slug}
                  className="group bg-white rounded-xl border border-slate-200/90 hover:border-emerald-300 shadow-2xs hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden p-2.5 sm:p-3 space-y-2.5"
                >
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
                    <Link href={`/products/${rel.slug}`} className="block w-full h-full relative">
                      {rel.image ? (
                        <img
                          src={optimizeImageUrl(rel.image, { width: 400, quality: "auto" })}
                          alt={rel.name}
                          loading="lazy"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-emerald-800 font-extrabold text-2xl">
                          {rel.name ? rel.name[0] : "G"}
                        </div>
                      )}
                    </Link>
                  </div>

                  <div className="space-y-1 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                        <Link href={`/products/${rel.slug}`}>{rel.name}</Link>
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {rel.shortDescription || rel.tagline || rel.desc}
                      </p>

                      <div className="flex items-baseline gap-1.5 flex-wrap pt-1">
                        <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                          ₹{relOffer.toLocaleString("en-IN")}
                        </span>
                        {relMrp > relOffer && (
                          <span className="text-[11px] text-slate-400 line-through">
                            ₹{relMrp.toLocaleString("en-IN")}
                          </span>
                        )}
                        <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.2 rounded">
                          20% OFF
                        </span>
                      </div>
                    </div>

                    <div className="pt-1.5">
                      <button
                        type="button"
                        onClick={() => handleAddPairToQuote(rel)}
                        className={`w-full py-1.5 sm:py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[36px] ${
                          pairAdded[rel.slug]
                            ? "bg-green-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{pairAdded[rel.slug] ? "Added to Basket ✓" : "Add to Basket"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Spacing bottom before modals and mobile bar */}
      <div className="pb-4" />

      {/* MOBILE FIXED BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 flex items-center justify-between gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] md:hidden">
        <div className="flex-shrink-0">
          <div className="text-[10px] text-slate-500 uppercase tracking-wide font-medium leading-tight">You pay</div>
          <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
            ₹{estimatedSubtotal.toLocaleString("en-IN")}
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding || totalCombinedQty < minMoq}
          className={`px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm flex-shrink-0 min-h-[44px] ${
            totalCombinedQty < minMoq
              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
              : added
                ? "bg-green-700 text-white"
                : "bg-green-600 hover:bg-green-700 active:bg-green-800 text-white active:scale-[0.98]"
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Added!</span>
            </>
          ) : (
            <span>
              {totalCombinedQty < minMoq
                ? `MOQ: ${minMoq}`
                : `Add ${totalCombinedQty} ${unitLabelPlural.toLowerCase()} to basket`}
            </span>
          )}
        </button>
      </div>

      {/* 100% FULL SCREEN LIGHTBOX MODAL (PORTAL TO DOCUMENT.BODY) */}
      {mounted && isLightboxOpen && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full screen image inspection"
          className="fixed inset-0 w-screen h-screen flex flex-col items-center justify-between p-3 sm:p-6 md:p-8 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200 select-none overflow-hidden"
          style={{ zIndex: 99999999 }}
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar: Product Name & Close Button */}
          <div
            className="w-full flex items-center justify-between z-30 pt-1 sm:pt-2 px-2 sm:px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 min-w-0 pr-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <span className="text-white font-bold text-xs sm:text-sm md:text-base tracking-tight truncate">
                {product.name}
              </span>
              <span className="hidden sm:inline text-white/40 text-xs">•</span>
              <span className="hidden sm:inline text-emerald-300 text-xs font-medium truncate">
                {activeOccasion.label}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/15 hover:bg-white text-white hover:text-slate-900 border border-white/25 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xl backdrop-blur-md active:scale-95 flex-shrink-0"
              aria-label="Close full screen view"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.2} />
            </button>
          </div>

          {/* Center Image Container with Navigation Chevrons */}
          <div
            className="relative w-full flex-1 flex items-center justify-center py-2 sm:py-4 px-2 sm:px-12 min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous Image Arrow */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 sm:bg-white/15 hover:bg-white text-white hover:text-slate-900 border border-white/20 flex items-center justify-center transition-all duration-200 cursor-pointer z-30 shadow-2xl backdrop-blur-md active:scale-90"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
            )}

            {/* High-Res Full-screen Image */}
            <div className="relative max-h-full max-w-full flex items-center justify-center">
              <img
                src={optimizeImageUrl(activeImage, { width: 1600, quality: "auto" })}
                alt={`${product.name} Fullscreen Inspection`}
                className="max-h-[75vh] sm:max-h-[82vh] max-w-[95vw] sm:max-w-[85vw] object-contain rounded-xl sm:rounded-2xl shadow-2xl"
                onError={(e) => {
                  e.currentTarget.src = "/images/placeholder.jpg";
                }}
              />
            </div>

            {/* Next Image Arrow */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 sm:bg-white/15 hover:bg-white text-white hover:text-slate-900 border border-white/20 flex items-center justify-center transition-all duration-200 cursor-pointer z-30 shadow-2xl backdrop-blur-md active:scale-90"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
            )}
          </div>

          {/* Bottom Caption / Thumbnail Indicators */}
          <div
            className="w-full flex flex-col items-center justify-center gap-2 pb-1 sm:pb-2 z-30"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gallery Thumbnail Dots */}
            {images.length > 1 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 border border-white/15 backdrop-blur-md">
                {images.map((imgUrl, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setActiveImageIndex(dotIdx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${dotIdx === activeImageIndex ? "w-6 bg-emerald-400" : "w-2 bg-white/40 hover:bg-white/70"
                      }`}
                    aria-label={`View image ${dotIdx + 1}`}
                  />
                ))}
              </div>
            )}

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/20 text-white/90 text-[11px] sm:text-xs font-semibold backdrop-blur-md shadow-md">
              <span>{activeImageIndex + 1} of {images.length}</span>
              <span className="text-white/40">•</span>
              <span>{activeOccasion.label}</span>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── 2-STEP BUNDLE ADD-ONS & CELEBRATORY UNLOCKED TIER PERKS MODAL ── */}
      {mounted && isCustomizeModalOpen && createPortal(
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
            backgroundColor: "rgba(15, 23, 42, 0.72)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            animation: "gfModalBackdrop 0.25s ease-out forwards"
          }}
          onClick={handleCloseModal}
        >
          {/* Modal Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "480px",
              maxHeight: "90vh",
              background: "#ffffff",
              borderRadius: "20px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.06)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              animation: "gfModalBox 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards"
            }}
          >
            {/* ── STEP 1: BUNDLE OFFER (MATCHING USER SCREENSHOT DESIGN) ── */}
            {modalStep === 1 && (() => {
              const primaryAddon = relatedProducts && relatedProducts.length > 0 ? relatedProducts[0] : null;
              const hasAddons = relatedProducts && relatedProducts.length > 0;
              const anyItemAdded = Object.values(pairAdded).some(Boolean);
              const primaryIsAdded = primaryAddon ? Boolean(pairAdded[primaryAddon.slug]) : false;
              const primaryPairQty = primaryAddon ? getPairQty(primaryAddon.slug) : 0;

              return (
                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 bg-white overflow-y-auto flex-1">
                  {/* Top row: Bundle Offer Pill & Close Button */}
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 text-emerald-800 text-xs sm:text-[13px] font-semibold tracking-wide">
                      <span className="w-4 sm:w-5 h-[2px] bg-emerald-600 rounded-full inline-block"></span>
                      <span>Bundle offer</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer"
                      aria-label="Close"
                    >
                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>

                  {/* Headline & Subtitle */}
                  <div className="space-y-1 sm:space-y-1.5">
                    <h2 className="text-lg sm:text-[23px] font-bold text-[#0f3428] tracking-tight leading-snug sm:leading-tight">
                      Enjoy an Extra 5% Savings
                    </h2>
                    <p className="text-slate-500 text-[11.5px] sm:text-[13px] leading-relaxed">
                      You&apos;re already saving {activeTierDiscountPct}% on your cart. Add {primaryAddon ? (primaryAddon.name.match(/^[aeiou]/i) ? `an ${primaryAddon.name}` : `a ${primaryAddon.name}`) : "a companion product"} and{" "}
                      <strong className="font-semibold text-slate-800">save 5% more on your overall order.</strong>
                    </p>
                  </div>

                  {/* Progress Bar (10% unlocked -> 15% with bundle) */}
                  <div className="pt-1 pb-0.5 space-y-1.5">
                    <div className="relative flex items-center">
                      <div className="h-1 bg-slate-100 w-full rounded-full overflow-hidden">
                        <div className={`h-full bg-brand-600 transition-all duration-300 ${primaryIsAdded || anyItemAdded ? "w-full" : "w-[4%]"}`} />
                      </div>
                      {/* Left Dot */}
                      <div className="absolute left-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-brand-600 ring-4 ring-brand-500/20 -translate-x-0.5" />
                      {/* Right Dot */}
                      <div className={`absolute right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 translate-x-0.5 ${primaryIsAdded || anyItemAdded
                        ? "bg-brand-600 ring-4 ring-brand-500/20"
                        : "border-2 border-slate-300 bg-white"
                        }`} />
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-brand-700 font-semibold text-[10.5px] sm:text-[11.5px]">
                        {activeTierDiscountPct}% off • unlocked
                      </span>
                      <span className={`text-[10.5px] sm:text-[11.5px] transition-colors ${primaryIsAdded || anyItemAdded ? "text-brand-700 font-bold" : "text-slate-400 font-normal"}`}>
                        {activeTierDiscountPct + 5}% off with bundle
                      </span>
                    </div>
                  </div>

                  {/* Add-on Product Card(s) with Quantity Stepper strictly for pair item */}
                  {hasAddons ? (
                    <div className="space-y-2 pt-0.5">
                      {relatedProducts.slice(0, 2).map((rel) => {
                        const isAdded = Boolean(pairAdded[rel.slug]);
                        const relQty = getPairQty(rel.slug);
                        const origP = rel.wholesalePrice || rel.originalBasePrice || rel.price || rel.discountedPrice || rel.originalPrice || rel.retailPrice || 0;
                        const discP = origP > 0 ? Math.round(origP * 0.90) : 0;

                        return (
                          <div
                            key={rel.slug}
                            className={`rounded-xl sm:rounded-2xl border p-2.5 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 transition-all ${isAdded
                              ? "border-emerald-500 bg-emerald-50/20 shadow-xs"
                              : "border-slate-200/90 bg-[#fafbfc] hover:border-slate-300"
                              }`}
                          >
                            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 p-0.5 sm:p-1 relative">
                                {rel.image ? (
                                  <img
                                    src={optimizeImageUrl(rel.image, { width: 160, height: 160, crop: "fill", quality: "auto" })}
                                    alt={rel.name}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-emerald-50 text-emerald-800 font-extrabold flex items-center justify-center text-base sm:text-lg">
                                    {rel.name ? rel.name.charAt(0).toUpperCase() : "G"}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs sm:text-sm font-semibold text-slate-900 truncate leading-tight sm:leading-snug">
                                  {rel.name}
                                </h4>
                                <div className="flex items-baseline gap-1 sm:gap-1.5 mt-0.5">
                                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                                    ₹{discP.toLocaleString("en-IN")}
                                  </span>
                                  {origP > 0 && discP < origP && (
                                    <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                                      ₹{origP.toLocaleString("en-IN")}
                                    </span>
                                  )}
                                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-normal">
                                    /{rel.unit || "pc"}
                                  </span>
                                </div>
                                <span className="inline-block mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] font-medium text-emerald-800 border border-emerald-200 bg-emerald-50/80 px-1.5 py-0.5 rounded-full">
                                  +5% more off on combined order
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-2 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-slate-100/80 flex-shrink-0">
                              {/* Quantity Stepper for pair item */}
                              <div className="inline-flex items-center bg-white border border-slate-200 rounded-lg sm:rounded-xl p-0.5 shadow-2xs">
                                <button
                                  type="button"
                                  disabled={relQty <= 0}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePairQtyChange(rel.slug, Math.max(0, relQty - 1));
                                  }}
                                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                  aria-label="Decrease pair quantity"
                                >
                                  <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                </button>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  value={relQty}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handlePairQtyChange(rel.slug, e.target.value);
                                  }}
                                  className="w-7 sm:w-9 text-center text-xs font-bold text-slate-900 bg-transparent outline-none select-all"
                                  aria-label={`Quantity for ${rel.name}`}
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePairQtyChange(rel.slug, relQty + 1);
                                  }}
                                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                                  aria-label="Increase pair quantity"
                                >
                                  <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                </button>
                              </div>

                              {/* Add / Added Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  const qtyToAdd = relQty > 0 ? relQty : 1;
                                  if (relQty === 0) {
                                    handlePairQtyChange(rel.slug, 1);
                                  }
                                  handleAddPairToQuote(rel, qtyToAdd);
                                }}
                                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer shadow-2xs ${isAdded
                                  ? "bg-green-600 text-white"
                                  : "border border-green-600 text-green-700 hover:bg-green-600 hover:text-white"
                                  }`}
                                aria-label={isAdded ? "Added to order" : `Add ${rel.name}`}
                              >
                                {isAdded ? (
                                  <>
                                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                                    <span>Added ({relQty || 1})</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                                    <span>{relQty > 0 ? `Add (${relQty})` : "Add"}</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}

                  {/* Bottom Action CTAs */}
                  <div className="space-y-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setModalStep(2)}
                      className="w-full py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white bg-green-600 hover:bg-green-700 active:bg-green-800 shadow-sm hover:shadow-md transition-all cursor-pointer text-center flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      <span>Continue to perks &amp; customizations →</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalStep(2)}
                      className="w-full py-0.5 sm:py-1 text-[11px] sm:text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer text-center"
                    >
                      No thanks, continue
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* ── STEP 2: CELEBRATORY UNLOCKED TIER PERKS ── */}
            {modalStep === 2 && (
              <>
                {/* Step 2 Header: Slim Dark Brand Green */}
                <div className="bg-brand-700 text-white px-3.5 py-2.5 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3 flex-shrink-0 border-b border-brand-800">
                  <h2 className="text-sm sm:text-lg font-bold text-white tracking-tight flex items-center gap-2 truncate">
                    <span>🎉</span>
                    <span>You&apos;ve unlocked {activeTierObj.tierNumber === 1 ? "Tier 1 — Starter" : activeTierObj.tierNumber === 2 ? "Tier 2 — Personalized" : "Tier 3 — Fully Custom"}!</span>
                  </h2>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0 transition-all bg-white/20 hover:bg-white/35 text-white shadow-xs"
                    aria-label="Close"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>

                {/* Step 2 Body: Checklist of Included Perks */}
                <div className="overflow-y-auto flex-1 p-3 sm:p-5 space-y-2.5 sm:space-y-3 bg-slate-50/50">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      Included Perks Checklist
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                      Cumulative Value
                    </span>
                  </div>

                  {/* Perk 1: Tier 1 Starter (Always Unlocked at MOQ 10+) */}
                  <div
                    className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all duration-300 bg-white border-emerald-300 shadow-2xs relative overflow-hidden group"
                    style={{ animation: "gfPerkPopIn 0.35s ease-out forwards" }}
                  >
                    <div className="flex items-start gap-2.5 sm:gap-3">
                      <div
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-brand-700 text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5"
                        style={{ animation: "gfCheckPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards" }}
                      >
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 sm:gap-2 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                            Welcome &amp; Thank-You Kit included
                          </h4>
                          <span className="text-[9px] sm:text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Tier 1 Starter
                          </span>
                        </div>
                        <p className="text-[10.5px] sm:text-xs text-slate-600 leading-relaxed mt-0.5 sm:mt-1">
                          A little something extra, free with your order. (Personalize message in Step 3)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Perk 2: Tier 2 Personalized (Unlocked at 101+ sets) */}
                  {activeTierObj.tierNumber >= 2 ? (
                    <div
                      className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all duration-300 bg-white border-emerald-400 shadow-2xs relative overflow-hidden group"
                      style={{ animation: "gfPerkPopIn 0.45s ease-out forwards" }}
                    >
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        <div
                          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-brand-700 text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5"
                          style={{ animation: "gfCheckPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 0.1s" }}
                        >
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 sm:gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                              Your Name Engraved on the Product
                            </h4>
                            <span className="text-[9px] sm:text-[10px] font-extrabold text-brand-800 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                              Tier 2 Perk ✨
                            </span>
                          </div>
                          <p className="text-[10.5px] sm:text-xs text-slate-600 leading-relaxed mt-0.5 sm:mt-1">
                            Free laser engraving of individual recipient names or company text. (Enter in Step 3)
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Dimmed Locked State for Tier 2 */
                    <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 opacity-75 hover:opacity-100 transition-all duration-200 space-y-1.5 sm:space-y-2">
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 sm:gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-700 leading-tight">
                              Your Name Engraved on the Product
                            </h4>
                            <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                              Tier 2 (101–200 Sets)
                            </span>
                          </div>
                          <p className="text-[10.5px] sm:text-xs text-slate-500 leading-relaxed mt-0.5 sm:mt-1">
                            Free laser engraving of individual recipient names or company text.
                          </p>
                        </div>
                      </div>
                      <div className="pl-8 sm:pl-10 pt-0.5 flex items-center justify-between gap-2">
                        <span className="text-[9.5px] sm:text-[10px] text-slate-500 font-medium">
                          Add {Math.max(0, 101 - qty)} more sets to unlock
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSetExactQty(101)}
                          className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-bold bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 hover:border-brand-300 transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                        >
                          <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brand-600" />
                          <span>Upgrade to 101 sets</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Perk 3: Tier 3 Fully Custom (Unlocked at 201+ sets) */}
                  {activeTierObj.tierNumber >= 3 ? (
                    <div
                      className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all duration-300 bg-gradient-to-r from-amber-50/50 via-white to-emerald-50/50 border-amber-300 shadow-2xs relative overflow-hidden group"
                      style={{ animation: "gfPerkPopIn 0.55s ease-out forwards" }}
                    >
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        <div
                          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5"
                          style={{ animation: "gfCheckPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 0.2s" }}
                        >
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 sm:gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                              Custom Product Name + Branded Box Sleeve
                            </h4>
                            <span className="text-[9px] sm:text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                              Tier 3 VIP 👑
                            </span>
                          </div>
                          <p className="text-[10.5px] sm:text-xs text-slate-600 leading-relaxed mt-0.5 sm:mt-1">
                            Custom product naming &amp; branded sleeve. (Set name in Step 3; logo collected via phone/WhatsApp)
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Dimmed Locked State for Tier 3 */
                    <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 opacity-75 hover:opacity-100 transition-all duration-200 space-y-1.5 sm:space-y-2">
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 sm:gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-700 leading-tight">
                              Custom Product Name + Branded Box Sleeve
                            </h4>
                            <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                              Tier 3 (201+ Sets)
                            </span>
                          </div>
                          <p className="text-[10.5px] sm:text-xs text-slate-500 leading-relaxed mt-0.5 sm:mt-1">
                            Custom product naming &amp; branded sleeve. (Logo collected via phone/WhatsApp)
                          </p>
                        </div>
                      </div>
                      <div className="pl-8 sm:pl-10 pt-0.5 flex items-center justify-between gap-2">
                        <span className="text-[9.5px] sm:text-[10px] text-slate-500 font-medium">
                          Add {Math.max(0, 201 - qty)} more sets to unlock
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSetExactQty(201)}
                          className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 hover:border-amber-300 transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                        >
                          <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-600" />
                          <span>Upgrade to 201 sets</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 2 Footer: Order Summary & Actions */}
                <div className="flex-shrink-0 px-3.5 py-3 sm:px-5 sm:py-4 border-t border-slate-200 bg-white space-y-2.5 sm:space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] sm:text-[11px] font-medium block">Order Snapshot:</span>
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        {qty} {unitLabelPlural} • ₹{estimatedSubtotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                    {totalSavings > 0 && (
                      <span className="text-[10px] sm:text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-emerald-200">
                        Saved ₹{totalSavings.toLocaleString("en-IN")} ({activeTierDiscountPct}% OFF)
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setModalStep(1)}
                      className="py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer text-center"
                    >
                      ← Back to Add-ons
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalStep(3)}
                      className="py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm bg-green-600 hover:bg-green-700 transition-all cursor-pointer text-center"
                    >
                      <span>Next: Personalize</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── STEP 3: ORDER PERSONALIZATION (CARD MESSAGE, ENGRAVING & CUSTOM BRANDING) ── */}
            {modalStep === 3 && (
              <>
                {/* Step 3 Header: Slim Dark Brand Green */}
                <div className="bg-brand-700 text-white px-3.5 py-2.5 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3 flex-shrink-0 border-b border-brand-800">
                  <h2 className="text-sm sm:text-lg font-bold text-white tracking-tight flex items-center gap-2 truncate">
                    <span>💌</span>
                    <span>Personalize Order &amp; Customizations</span>
                  </h2>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0 transition-all bg-white/20 hover:bg-white/35 text-white shadow-xs"
                    aria-label="Close"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>

                {/* Step 3 Body: Form Inputs for Card, Engraving, and Custom Product Name */}
                <div className="overflow-y-auto flex-1 p-3 sm:p-5 space-y-3 sm:space-y-4 bg-slate-50/50">
                  {/* Section 1: Kit Card Message (Tier 1+) */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-brand-700 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                        <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-emerald-950 block text-[11px] sm:text-xs">
                          Tier 1 Starter Perk (Included in all {qty} {unitLabelPlural}):
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-emerald-800">
                          Custom printed plantable seed paper or kraft story card inside each gift box.
                        </span>
                      </div>
                    </div>

                    {/* Input 1: Sender Name */}
                    <div className="space-y-1 bg-white p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs">
                      <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-700" />
                          <span>Sender Name / Org (From)</span>
                        </span>
                        <span className="text-[9.5px] text-slate-400 font-normal">Optional</span>
                      </label>
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="e.g. Acme Corp / Rajesh Sharma"
                        className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none text-slate-900 transition-all font-medium"
                      />
                    </div>

                    {/* Input 2: Receiver Name */}
                    <div className="space-y-1 bg-white p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs">
                      <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-700" />
                          <span>Receiver Name / Group (To)</span>
                        </span>
                        <span className="text-[9.5px] text-slate-400 font-normal">Optional</span>
                      </label>
                      <input
                        type="text"
                        value={receiverName}
                        onChange={(e) => setReceiverName(e.target.value)}
                        placeholder="e.g. Valued Partner / Jane Smith"
                        className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none text-slate-900 transition-all font-medium"
                      />
                    </div>

                    {/* Input 3: Gift Message with 50-60 Word Counter */}
                    <div className="space-y-1.5 bg-white p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs">
                      {(() => {
                        const messageWordCount = giftMessage.trim()
                          ? giftMessage.trim().split(/\s+/).filter(Boolean).length
                          : 0;

                        return (
                          <>
                            <div className="flex items-center justify-between flex-wrap gap-1">
                              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-700" />
                                <span>Card Message (50–60 words)</span>
                              </label>
                              <span
                                className={`text-[9.5px] sm:text-[10.5px] font-extrabold px-2 py-0.5 rounded-full border transition-all ${messageWordCount >= 50 && messageWordCount <= 60
                                  ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                                  : messageWordCount > 60
                                    ? "bg-amber-100 text-amber-900 border-amber-300"
                                    : "bg-slate-100 text-slate-600 border-slate-200"
                                  }`}
                              >
                                {messageWordCount >= 50 && messageWordCount <= 60 ? (
                                  <span>✓ {messageWordCount} / 60 words</span>
                                ) : messageWordCount > 60 ? (
                                  <span>⚠ {messageWordCount} words (+{messageWordCount - 60})</span>
                                ) : (
                                  <span>{messageWordCount}/60 ({Math.max(0, 50 - messageWordCount)} to 50)</span>
                                )}
                              </span>
                            </div>

                            <textarea
                              rows={3}
                              value={giftMessage}
                              onChange={(e) => setGiftMessage(e.target.value)}
                              placeholder="Write your personalized greeting or thank-you message to print on the card..."
                              className="w-full p-2.5 sm:p-3 rounded-lg sm:rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none text-slate-900 transition-all resize-none font-medium leading-relaxed"
                            />
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Section 2: Tier 2 Product Name Engraving */}
                  {activeTierObj.tierNumber >= 2 ? (
                    <div className="space-y-1 bg-white p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-emerald-300 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <BadgeCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-700" />
                          <span>Name / Text to Engrave on Product</span>
                        </label>
                        <span className="text-[9px] sm:text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Tier 2 Perk ✨
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 leading-snug">
                        Recipient name(s) or text to laser engrave:
                      </p>
                      <input
                        type="text"
                        value={engravingName}
                        onChange={(e) => setEngravingName(e.target.value)}
                        placeholder="e.g. John Doe, Sarah Smith / Company Tagline"
                        className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none text-slate-900 transition-all font-medium"
                      />
                    </div>
                  ) : (
                    <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 text-xs space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center flex-shrink-0">
                            <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-700">Product Name Laser Engraving</h4>
                            <p className="text-[10px] sm:text-[11px] text-slate-500">Unlocked at 101–200 sets (Tier 2)</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSetExactQty(101)}
                          className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-bold bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 hover:border-brand-300 transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                        >
                          <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brand-600" />
                          <span>Unlock (101 sets)</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Section 3: Tier 3 Custom Product Name & Logo Note */}
                  {activeTierObj.tierNumber >= 3 ? (
                    <div className="space-y-2 bg-gradient-to-r from-amber-50/40 via-white to-emerald-50/30 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-amber-300 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600" />
                          <span>Custom Product Name for Box Sleeve</span>
                        </label>
                        <span className="text-[9px] sm:text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                          Tier 3 VIP 👑
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-slate-600 leading-snug">
                        Custom edition name or branded collection title for box sleeve:
                      </p>
                      <input
                        type="text"
                        value={customProductName}
                        onChange={(e) => setCustomProductName(e.target.value)}
                        placeholder="e.g. Acme Leadership Onboarding Set 2026"
                        className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm bg-white border border-amber-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none text-slate-900 transition-all font-medium"
                      />

                      {/* Logo Collection Notification Callout */}
                      <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-amber-50/90 border border-amber-200 flex items-start gap-2 text-xs">
                        <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-800 flex-shrink-0 mt-0.5" />
                        <div className="text-[10px] sm:text-[11px] text-amber-950 leading-relaxed">
                          <span className="font-bold text-amber-900 block">Company Logo Artwork:</span>
                          Our B2B team will contact you shortly via phone / WhatsApp after quote submission to collect your high-res logo file and share a 3D digital mockup.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border-2 border-dashed border-amber-200/80 bg-amber-50/30 text-xs space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                            <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-amber-950">Custom Product Name &amp; Box Sleeve / Logo</h4>
                            <p className="text-[10px] sm:text-[11px] text-amber-900/80">Unlocked at 201+ sets (Tier 3 VIP)</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSetExactQty(201)}
                          className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                        >
                          <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span>Unlock (201 sets)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 3 Footer: Order Summary & Review Basket */}
                <div className="flex-shrink-0 px-3.5 py-3 sm:px-5 sm:py-4 border-t border-slate-200 bg-white space-y-2.5 sm:space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] sm:text-[11px] font-medium block">Order Snapshot:</span>
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        {qty} {unitLabelPlural} • ₹{estimatedSubtotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                    {totalSavings > 0 && (
                      <span className="text-[10px] sm:text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-emerald-200">
                        Saved ₹{totalSavings.toLocaleString("en-IN")} ({activeTierDiscountPct}% OFF)
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setModalStep(2)}
                      className="py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer text-center"
                    >
                      ← Back to Perks
                    </button>
                    <Link
                      href="/quote"
                      onClick={handleSaveCustomizations}
                      className="py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm bg-green-600 hover:bg-green-700 transition-all cursor-pointer text-center"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Review Basket</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}

      <style>{`
        @keyframes gfPerkPopIn {
          0% {
            opacity: 0;
            transform: translateY(8px) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes gfCheckPop {
          0% {
            transform: scale(0);
          }
          70% {
            transform: scale(1.3);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes gfModalBackdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes gfModalBox {
          from {
            opacity: 0;
            transform: scale(0.94) translateY(14px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
