"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useQuote } from "./Quote";
import {
  Zap,
  ShieldCheck,
  Check,
  Sprout,
  Sparkles,
  Flame,
  ChevronLeft,
  ChevronRight,
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
        max: 49,
        rangeLabel: "10–49 Sets",
        price: 1700,
        savingsPct: 10,
        leadTime: "7–10 Days",
        allowedCustomizations: 2,
        customizationAllowanceText: "Choose any 2 of 5 complimentary customizations below.",
        nextTierUnlockText: "Tier 2 (50+) unlocks 3 →",
        perks: ["10% Off MRP", "Welcome & Thank-You Kit Included", "Standard 7-10 Day Production"]
      },
      {
        id: "tier-2",
        tierNumber: 2,
        title: "Tier 2 — Personalized",
        badge: "★ POPULAR",
        isPopular: true,
        min: 50,
        max: 99,
        rangeLabel: "50–99 Sets",
        price: 1530,
        savingsPct: 12,
        leadTime: "5–7 Days",
        allowedCustomizations: 3,
        customizationAllowanceText: "Choose any 3 of 5 complimentary customizations below.",
        nextTierUnlockText: "Tier 3 (100+) unlocks all 5 →",
        perks: ["12% Off MRP", "Your Name Engraved on Product", "Priority Dispatch"]
      },
      {
        id: "tier-3",
        tierNumber: 3,
        title: "Tier 3 — Fully Custom",
        badge: "Max Value",
        isPopular: false,
        min: 100,
        max: null,
        rangeLabel: "100+ Sets",
        price: 1360,
        savingsPct: 15,
        leadTime: "3–5 Days",
        allowedCustomizations: 5,
        customizationAllowanceText: "All 5 complimentary customizations included.",
        nextTierUnlockText: "",
        perks: ["15% Off MRP", "Custom Product Name + Branded Sleeve", "Dedicated Account Manager"]
      }
    ],
    customizations: [
      {
        id: "laser_logo",
        name: "Custom Laser Logo Engraving",
        tag: "Laser Etched",
        badge: "Most Popular",
        desc: "Permanent high-precision laser etching of your brand logo on the front surface.",
        icon: Sparkles
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
        id: "corp_gift_box",
        name: "Bespoke Recyclable Gift Packaging",
        tag: "Custom Box",
        badge: "Eco Kraft",
        desc: "Recycled kraft presentation gift box with custom branded outer sleeve & ribbon.",
        icon: Box
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
        max: 49,
        rangeLabel: "10–49 Sets",
        price: 1900,
        savingsPct: 10,
        leadTime: "5–7 Days",
        allowedCustomizations: 2,
        customizationAllowanceText: "Choose any 2 of 5 anniversary customizations below.",
        nextTierUnlockText: "Silver Jubilee (50+) unlocks 3 →",
        perks: ["10% Off MRP", "Gold Satin Ribbon", "5-7 Day Production"]
      },
      {
        id: "tier-2",
        tierNumber: 2,
        title: "Silver Jubilee",
        badge: "★ POPULAR",
        isPopular: true,
        min: 50,
        max: 99,
        rangeLabel: "50–99 Sets",
        price: 1600,
        savingsPct: 12,
        leadTime: "5–7 Days",
        allowedCustomizations: 3,
        customizationAllowanceText: "Choose any 3 of 5 anniversary customizations below.",
        nextTierUnlockText: "Platinum (100+) unlocks all 5 →",
        perks: ["12% Off MRP", "3 Free Customizations", "Expedited 5-Day Production"]
      },
      {
        id: "tier-3",
        tierNumber: 3,
        title: "Platinum Jubilee",
        badge: "Max Value",
        isPopular: false,
        min: 100,
        max: null,
        rangeLabel: "100+ Sets",
        price: 1400,
        savingsPct: 15,
        leadTime: "3–5 Days",
        allowedCustomizations: 5,
        customizationAllowanceText: "All 5 anniversary customizations included complimentary.",
        nextTierUnlockText: "",
        perks: ["15% Off MRP", "All 5 Free", "White-Glove Delivery", "Commemorative Certificate"]
      }
    ],
    customizations: [
      {
        id: "gold_foil_monogram",
        name: "Gold Foil Monogram & Years Engraving",
        tag: "Gold Foil",
        badge: "Gold Foil",
        desc: "Luxury gold metallic stamp commemorating your company's anniversary years.",
        icon: Sparkles
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
        max: 49,
        rangeLabel: "10–49 Sets",
        price: 1800,
        savingsPct: 10,
        leadTime: "7–8 Days",
        allowedCustomizations: 2,
        customizationAllowanceText: "Choose any 2 of 5 wedding customizations below.",
        nextTierUnlockText: "Grand Wedding (50+) unlocks 3 →",
        perks: ["10% Off MRP", "Blush Ribbon", "7-Day Production"]
      },
      {
        id: "tier-2",
        tierNumber: 2,
        title: "Grand Wedding",
        badge: "★ POPULAR",
        isPopular: true,
        min: 50,
        max: 99,
        rangeLabel: "50–99 Sets",
        price: 1550,
        savingsPct: 12,
        leadTime: "5–7 Days",
        allowedCustomizations: 3,
        customizationAllowanceText: "Choose any 3 of 5 wedding customizations below.",
        nextTierUnlockText: "Royal Wedding (100+) unlocks all 5 →",
        perks: ["12% Off MRP", "3 Free Customizations", "Free Physical Sample Kit"]
      },
      {
        id: "tier-3",
        tierNumber: 3,
        title: "Royal Wedding",
        badge: "Max Value",
        isPopular: false,
        min: 100,
        max: null,
        rangeLabel: "100+ Sets",
        price: 1350,
        savingsPct: 15,
        leadTime: "3–5 Days",
        allowedCustomizations: 5,
        customizationAllowanceText: "All 5 wedding customizations included free.",
        nextTierUnlockText: "",
        perks: ["15% Off MRP", "All 5 Free", "Doorstep Venue Delivery", "Dedicated Wedding RM"]
      }
    ],
    customizations: [
      {
        id: "couple_monogram",
        name: "Couple Name & Date Monogram",
        tag: "Laser Etched",
        badge: "Bridal Monogram",
        desc: "Both names and wedding date laser-engraved on each canister lid.",
        icon: Sparkles
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
        max: 49,
        rangeLabel: "10–49 Sets",
        price: 1750,
        savingsPct: 10,
        leadTime: "7 Days",
        allowedCustomizations: 2,
        customizationAllowanceText: "Choose any 2 of 5 festive customizations below.",
        nextTierUnlockText: "Festive Bulk (50+) unlocks 3 →",
        perks: ["10% Off MRP", "Festive Hamper Box", "2 Free Customizations"]
      },
      {
        id: "tier-2",
        tierNumber: 2,
        title: "Festive Bulk",
        badge: "★ POPULAR",
        isPopular: true,
        min: 50,
        max: 99,
        rangeLabel: "50–99 Sets",
        price: 1500,
        savingsPct: 12,
        leadTime: "5 Days",
        allowedCustomizations: 3,
        customizationAllowanceText: "Choose any 3 of 5 festive customizations free.",
        nextTierUnlockText: "Mega Festive (100+) unlocks all 5 →",
        perks: ["12% Off MRP", "3 Free Customizations", "Rush 5-Day Production"]
      },
      {
        id: "tier-3",
        tierNumber: 3,
        title: "Mega Festive",
        badge: "Max Value",
        isPopular: false,
        min: 100,
        max: null,
        rangeLabel: "100+ Sets",
        price: 1300,
        savingsPct: 15,
        leadTime: "3 Days",
        allowedCustomizations: 5,
        customizationAllowanceText: "All 5 festive customizations included free.",
        nextTierUnlockText: "",
        perks: ["15% Off MRP", "All 5 Free", "3-Day Rush Production", "Dedicated Festive RM"]
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
        max: 49,
        rangeLabel: "10–49 Sets",
        price: 1700,
        savingsPct: 10,
        leadTime: "5 Days",
        allowedCustomizations: 2,
        customizationAllowanceText: "2 complimentary onboarding customizations included.",
        nextTierUnlockText: "Growing Team (50+) unlocks 3 →",
        perks: ["10% Off MRP", "Suitable for startups", "2 Free Customizations"]
      },
      {
        id: "tier-2",
        tierNumber: 2,
        title: "Growing Team",
        badge: "★ POPULAR",
        isPopular: true,
        min: 50,
        max: 99,
        rangeLabel: "50–99 Sets",
        price: 1550,
        savingsPct: 12,
        leadTime: "4 Days",
        allowedCustomizations: 3,
        customizationAllowanceText: "Choose any 3 of 5 onboarding customizations free.",
        nextTierUnlockText: "Enterprise (100+) unlocks all 5 →",
        perks: ["12% Off MRP", "3 Free Customizations", "Priority Production"]
      },
      {
        id: "tier-3",
        tierNumber: 3,
        title: "Enterprise Hiring",
        badge: "Max Value",
        isPopular: false,
        min: 100,
        max: null,
        rangeLabel: "100+ Sets",
        price: 1350,
        savingsPct: 15,
        leadTime: "3 Days",
        allowedCustomizations: 5,
        customizationAllowanceText: "All 5 onboarding customizations included.",
        nextTierUnlockText: "",
        perks: ["15% Off MRP", "All 5 Free", "Dedicated HR RM", "Monthly Batch Scheduling"]
      }
    ],
    customizations: [
      {
        id: "company_logo_engrave",
        name: "Company Logo Laser Engraving",
        tag: "Laser Etched",
        badge: "Logo Print",
        desc: "Laser-engraved company logo and tagline on the canister lid.",
        icon: Sparkles
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
  return `http://localhost:5500/${img.replace(/^\/+/, "")}`;
}

export default function ProductDetailView({ product, context, relatedProducts = [] }) {
  const { add, updateCustomizations } = useQuote() || {};
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const unitLabel = product.unit || "set";
  const unitLabelPlural =
    unitLabel.toLowerCase() === "set"
      ? "Sets"
      : unitLabel.toLowerCase() === "piece"
        ? "Pieces"
        : `${unitLabel}s`;

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

  // Normalize colors
  const colorVariants = Array.isArray(product.colors) && product.colors.length > 0
    ? product.colors.map((c) => {
      if (typeof c === "string") return { name: c, stock: product.totalStock || product.stockQuantity || 100, images: [] };
      const cImgs = Array.isArray(c.images)
        ? c.images.map(normalizeImageUrl)
        : c.image
          ? [normalizeImageUrl(c.image)]
          : [];
      return {
        ...c,
        name: c.name || "Natural Sand",
        stock: c.stock ?? product.totalStock ?? product.stockQuantity ?? 100,
        images: cImgs
      };
    })
    : (Array.isArray(product.colours) ? product.colours : ["Natural Sand"]).map((c) => ({
      name: typeof c === "string" ? c : c.name || "Natural Sand",
      stock: product.totalStock || product.stockQuantity || 100,
      images: []
    }));

  const initialColor = colorVariants[0]?.name || product.colours?.[0] || "Natural Sand";

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

  const productBasePrice = typeof product.price === "number" ? product.price : 0;
  const currentCustomizations = activeOccasion.customizations;
  const wholesaleUnitPrice = productBasePrice;

  // Tiers: same discount percentages but now just for unlocking perks / displaying the tier.
  // The actual final price = wholesaleUnitPrice × qty × (1 - discountPct/100)
  const currentTiers = activeOccasion.tiers.map((t) => {
    const discountPct = t.tierNumber === 1 ? 10 : t.tierNumber === 2 ? 12 : 15;
    // Effective per-unit after discount (for display in tier chips)
    const effectivePricePerUnit = wholesaleUnitPrice > 0
      ? Math.round(wholesaleUnitPrice * (1 - discountPct / 100))
      : t.price;
    return {
      ...t,
      savingsPct: discountPct,
      price: effectivePricePerUnit // shown in tier chips as "after discount" per unit
    };
  });
  const currentMoq = activeOccasion.moq;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColour, setSelectedColour] = useState(initialColor);
  const [qty, setQty] = useState(currentMoq || 10);
  const [qtyInput, setQtyInput] = useState(String(currentMoq || 10));
  const [brandingNotes, setBrandingNotes] = useState("");
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [engravingName, setEngravingName] = useState("");
  const [customProductName, setCustomProductName] = useState("");
  const [packagingOption, setPackagingOption] = useState("Standard Recyclable Eco Kraft Box");
  const [added, setAdded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1 = customize, 2 = suggested
  const [activeTab, setActiveTab] = useState("set_contents");

  // Pair additions & custom quantity state for Step 2 modal
  const [pairQtys, setPairQtys] = useState({});
  const [pairAdded, setPairAdded] = useState({});

  const getPairQty = (slug) => pairQtys[slug] ?? 1;

  const handlePairQtyChange = (slug, newQty) => {
    const min = 1;
    const raw = typeof newQty === "string" ? newQty.replace(/\D/g, "") : newQty;
    const parsed = typeof raw === "number" ? raw : parseInt(raw, 10);
    setPairQtys((prev) => ({
      ...prev,
      [slug]: isNaN(parsed) ? min : Math.max(min, parsed)
    }));
  };

  const handleAddPairToQuote = (rel) => {
    if (!add) return;
    const relQty = getPairQty(rel.slug);
    const originalPrice =
      rel.price || rel.discountedPrice || rel.originalPrice || rel.retailPrice || 0;
    const discountedPrice = originalPrice > 0 ? Math.round(originalPrice * 0.95) : 0;

    const pairPayload = {
      ...rel,
      price: discountedPrice > 0 ? discountedPrice : originalPrice,
      originalBasePrice: originalPrice,
      activeTierTitle: "Bundle 5% Off Pairing",
      bundleDiscountApplied: true
    };

    add(pairPayload, rel.colours ? rel.colours[0] : "Standard", relQty);
    setPairAdded((prev) => ({ ...prev, [rel.slug]: true }));
    setTimeout(() => {
      setPairAdded((prev) => ({ ...prev, [rel.slug]: false }));
    }, 2500);
  };

  // Determine active tier based on quantity
  const activeTierObj =
    currentTiers.slice().reverse().find((t) => qty >= t.min) || currentTiers[0];

  // Tier-based customization limits:
  // Tier 1 -> max 2 of 5
  // Tier 2 -> max 3 of 5
  // Tier 3 -> max 5 of 5
  const maxCustomizations =
    activeTierObj.tierNumber === 1 ? 2 : activeTierObj.tierNumber === 2 ? 3 : 5;

  const [selectedCustomizations, setSelectedCustomizations] = useState(() => [
    currentCustomizations[0].id,
    currentCustomizations[2] ? currentCustomizations[2].id : currentCustomizations[1].id
  ]);
  const [customizationNotice, setCustomizationNotice] = useState("");

  // Enforce tier limit whenever maxCustomizations changes
  useEffect(() => {
    setSelectedCustomizations((prev) => {
      if (prev.length > maxCustomizations) {
        return prev.slice(0, maxCustomizations);
      }
      return prev;
    });
  }, [maxCustomizations]);

  const handleToggleCustomization = (id) => {
    setSelectedCustomizations((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length < maxCustomizations) {
        return [...prev, id];
      }
      // If limit reached, smoothly replace the oldest selection so the UI remains intuitive
      const next = [...prev.slice(1), id];
      setCustomizationNotice(
        `Tier ${activeTierObj.tierNumber} allows up to ${maxCustomizations} of 5 customizations. Selection updated.`
      );
      setTimeout(() => setCustomizationNotice(""), 3200);
      return next;
    });
  };

  // Pricing breakdown:
  const activeTierDiscountPct = activeTierObj.tierNumber === 1 ? 10 : activeTierObj.tierNumber === 2 ? 12 : 15;
  // Gross wholesale subtotal before discount
  const grossWholesaleSubtotal = wholesaleUnitPrice * qty;
  // Discount amount on the total
  const mainDiscountAmount = Math.round(grossWholesaleSubtotal * activeTierDiscountPct / 100);
  // Final amount to pay
  const estimatedSubtotal = grossWholesaleSubtotal - mainDiscountAmount;
  // Effective per-unit after discount (for breakdown display)
  const effectiveUnitPrice = wholesaleUnitPrice > 0 ? Math.round(wholesaleUnitPrice * (1 - activeTierDiscountPct / 100)) : activeTierObj.price;

  const handleQtyInputChange = (val) => {
    // Strictly allow only numeric digits (0-9)
    const cleaned = val.replace(/\D/g, "");
    setQtyInput(cleaned);
    if (cleaned !== "") {
      const parsed = parseInt(cleaned, 10);
      if (!isNaN(parsed) && parsed > 0) {
        setQty(parsed);
      }
    }
  };

  const handleQtyInputBlur = () => {
    const minMoq = currentMoq || 10;
    const parsed = parseInt(qtyInput, 10);
    if (isNaN(parsed) || parsed < minMoq) {
      setQty(minMoq);
      setQtyInput(String(minMoq));
    } else {
      setQty(parsed);
      setQtyInput(String(parsed));
    }
  };

  const handleAdjustQty = (delta) => {
    const minMoq = currentMoq || 10;
    const newQty = Math.max(minMoq, (qty || minMoq) + delta);
    setQty(newQty);
    setQtyInput(String(newQty));
  };

  const handleSetExactQty = (targetQty) => {
    const minMoq = currentMoq || 10;
    const finalQty = Math.max(minMoq, targetQty);
    setQty(finalQty);
    setQtyInput(String(finalQty));
  };

  const handleSelectTier = (tier) => {
    handleSetExactQty(tier.min);
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

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const buildProductPayload = () => {
    const selectedCustomizationObjs = currentCustomizations.filter((c) =>
      selectedCustomizations.includes(c.id)
    );
    return {
      ...product,
      price: effectiveUnitPrice,                   // after-discount per-unit price
      wholesalePrice: wholesaleUnitPrice,           // original wholesale unit price
      discountPct: activeTierDiscountPct,           // tier discount applied on total
      grossTotal: grossWholesaleSubtotal,           // qty × wholesale (before discount)
      discountAmount: mainDiscountAmount,           // discount deducted from gross
      originalBasePrice: wholesaleUnitPrice,        // for quote page calculations
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
    if (!add) return;
    // Immediately add to basket
    add(buildProductPayload(), selectedColour, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
    // Open step-1 modal
    setModalStep(1);
    setIsCustomizeModalOpen(true);
    if (typeof document !== "undefined") document.body.style.overflow = "hidden";
  };

  const handleSaveCustomizations = () => {
    const payload = buildProductPayload();
    const key = `${product.slug}-${selectedColour || "standard"}`;
    if (updateCustomizations) {
      updateCustomizations(key, payload);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    const payload = buildProductPayload();
    const key = `${product.slug}-${selectedColour || "standard"}`;
    if (updateCustomizations) {
      updateCustomizations(key, payload);
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

  // Total savings = the discount amount applied on wholesale subtotal
  const totalSavings = mainDiscountAmount;
  const effectiveSavingsPct = activeTierDiscountPct;

  // Build combined specs
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
    "Customization Allowance": `Tier 1: 2 of 5 | Tier 2: 3 of 5 | Tier 3: All 5`
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

  const giftItems =
    Array.isArray(product.giftSetContents?.products) && product.giftSetContents.products.length > 0
      ? product.giftSetContents.products
      : Array.isArray(product.giftBox?.products) && product.giftBox.products.length > 0
        ? product.giftBox.products
        : [];

  return (
    <div className="space-y-8">
      {/* TOP SECTION: Gallery & Gifting Customization */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-start">

        {/* LEFT COLUMN: Large Gallery & Compliance Trust Bar */}
        <div className="md:col-span-6 lg:col-span-6 space-y-4 w-full max-w-[540px] mx-auto md:mx-0 min-w-0 md:sticky md:top-24">

          {/* Gallery Canvas with Left Vertical Thumbnails */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 items-start min-w-0 w-full">
            {/* Left Vertical Thumbnails Strip */}
            {images.length > 1 && (
              <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[460px] w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar flex-shrink-0">
                {images.map((img, idx) => {
                  const isActive = activeImageIndex === idx;
                  return (
                    <button
                      key={img + idx}
                      type="button"
                      onClick={() => handleSelectImage(idx)}
                      className={`relative w-15 h-15 sm:w-16 sm:h-16 aspect-square rounded-xl overflow-hidden border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${isActive
                        ? "ring-2 ring-brand-600 border-brand-600 shadow-sm scale-102 bg-white"
                        : "border-slate-200 hover:border-brand-400 opacity-75 hover:opacity-100 bg-slate-50"
                        }`}
                      aria-label={`View angle ${idx + 1}`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          e.currentTarget.src = "/images/placeholder.jpg";
                        }}
                      />
                      {isActive && (
                        <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-brand-600 text-white rounded-full flex items-center justify-center shadow-xs">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Main Stage Image Frame */}
            <div className="relative aspect-square max-h-[460px] w-full rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-sm flex items-center justify-center group flex-1 min-w-0">
              <img
                src={activeImage}
                alt={`${product.name} - ${selectedColour}`}
                className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-103"
                onError={(e) => {
                  e.currentTarget.src = "/images/placeholder.jpg";
                }}
              />

              {/* Floating Gift Set Badge */}
              <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200/80 text-xs font-bold shadow-xs">
                <Gift className="w-3.5 h-3.5 text-brand-700" />
                <span>GIFT SET</span>
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    aria-label="Previous photo"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition-all opacity-85 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer z-10"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-800" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition-all opacity-85 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer z-10"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-800" />
                  </button>
                </>
              )}

              {/* Lightbox Zoom Button */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                aria-label="Zoom image"
                title="Inspect high-res image"
                className="absolute top-3.5 right-3.5 w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-slate-700 hover:text-brand-800 shadow-sm border border-slate-200 flex items-center justify-center transition-colors cursor-pointer z-10"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              {/* Bottom Badge: Photo Index */}
              <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/75 backdrop-blur-md text-white text-[10px] font-medium shadow-xs pointer-events-none">
                <span>
                  {activeImageIndex + 1} / {images.length}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-brand-200 font-semibold">{activeOccasion.label}</span>
              </div>
            </div>
          </div>

          {/* 4 Compliance Trust Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center flex flex-col items-center justify-center">
              <Sprout className="w-4 h-4 text-brand-700 mb-0.5" />
              <span className="text-[11px] font-bold text-slate-900 block">Rice Husk</span>
              <span className="text-[10px] text-slate-500">Bio-Composite</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center flex flex-col items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-brand-700 mb-0.5" />
              <span className="text-[11px] font-bold text-slate-900 block">Food Grade</span>
              <span className="text-[10px] text-slate-500">TUV Certified</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center flex flex-col items-center justify-center">
              <DishwasherIcon className="w-4 h-4 text-brand-700 mb-0.5" />
              <span className="text-[11px] font-bold text-slate-900 block">Dishwasher</span>
              <span className="text-[10px] text-slate-500">Commercial Safe</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center flex flex-col items-center justify-center">
              <Flame className="w-4 h-4 text-brand-700 mb-0.5" />
              <span className="text-[11px] font-bold text-slate-900 block">Microwave</span>
              <span className="text-[10px] text-slate-500">Reheat Safe</span>
            </div>
          </div>

          {/* Packaging Guarantee & Factory Stock Note */}
          <div className="bg-[#FAF7F0] border border-[#E5DAC8] rounded-xl p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                <Gift className="w-3.5 h-3.5 text-brand-700" />
                <span>Gifting &amp; Bulk Dispatch Ready</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>{product.totalStock || product.stockQuantity || "1,000+"} Units Available</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {product.package?.type
                ? `Packaged in protective ${product.package.type} with cushioning. Ready for corporate distribution and Pan-India logistics.`
                : "Every item is individually packed in a recyclable kraft gift box with cushioning and story booklet. Ready for corporate distribution."}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Product Details & Gifting Customizer */}
        <div className="md:col-span-6 lg:col-span-6 space-y-4 min-w-0">

          {/* Header Badges & Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge-green text-[11px] py-0.5 px-2 inline-flex items-center gap-1">
                <Package className="w-3 h-3 text-emerald-800" />
                <span>{typeof product.category === "string" ? product.category : product.category?.name || "Gifting Collection"}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-brand-700 text-white shadow-xs">
                <Gift className="w-3 h-3" />
                <span>{activeOccasion.label}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCheck className="w-3 h-3 text-emerald-600" />
                <span>{activeOccasion.subtitle}</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.shortDescription || product.tagline || product.desc}
            </p>

            {/* Wholesale Price + Tier Discount Callout */}
            <div className="pt-1 space-y-1.5">
              <div className="flex items-baseline gap-3 flex-wrap">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  ₹{wholesaleUnitPrice > 0 ? wholesaleUnitPrice : activeTierObj.price}
                  <span className="text-xs font-normal text-slate-500 ml-1">/{unitLabel} (B2B Wholesale Price)</span>
                </div>
                {wholesaleUnitPrice > 0 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    <Percent className="w-3 h-3" />
                    {activeTierDiscountPct}% Bulk Discount Applied on Total
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* COMPACT VOLUME TIER WIDGET (UNIFORM BRAND GREEN - NO MODAL POPUP) */}
          <div className="bg-brand-600 rounded-2xl p-3.5 text-white shadow-md relative overflow-hidden border border-brand-500">
            <div className="relative z-10 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 select-none">
                  <div className="w-7 h-7 rounded-lg bg-brand-700 text-white flex items-center justify-center shadow-xs border border-brand-400/50 ring-1 ring-white/30">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold tracking-wide uppercase text-white block leading-tight">
                      Volume Pricing Tiers
                    </span>
                    <span className="text-[10px] text-emerald-100 font-medium">
                      Active: Tier {activeTierObj.tierNumber} (₹{activeTierObj.price}/{unitLabel}) • {activeOccasion.label}
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-white/20 text-white border border-white/30">
                  3 TIERS
                </span>
              </div>

              {/* 3 Interactive Horizontal Quick-Select Chips */}
              <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                {currentTiers.map((tier) => {
                  const isActive = activeTierObj.id === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => handleSelectTier(tier)}
                      className={`p-2 rounded-xl text-left transition-all relative border cursor-pointer ${isActive
                        ? "bg-white text-slate-900 border-white shadow-xl ring-2 ring-emerald-300 scale-[1.02]"
                        : "bg-brand-700/40 hover:bg-brand-700/60 text-white border-white/25 hover:border-white/40 shadow-xs"
                        }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-brand-800" : "text-emerald-100"}`}>
                          Tier {tier.tierNumber}
                        </span>
                        {tier.isPopular ? (
                          <span className="text-[8px] font-extrabold uppercase bg-amber-400 text-amber-950 px-1 py-0.2 rounded font-mono shadow-xs">
                            ★ POPULAR
                          </span>
                        ) : tier.savingsPct > 0 ? (
                          <span className={`text-[8px] font-bold px-1 py-0.2 rounded ${isActive ? "bg-emerald-100 text-emerald-800" : "bg-black/20 text-white border border-white/20"}`}>
                            -{tier.savingsPct}%
                          </span>
                        ) : null}
                      </div>

                      <div className={`text-xs sm:text-sm font-black tracking-tight ${isActive ? "text-slate-900" : "text-white"}`}>
                        ₹{tier.price}
                        <span className={`text-[10px] font-normal ${isActive ? "text-slate-500" : "text-emerald-100/70"}`}>/{unitLabel}</span>
                      </div>

                      <div className={`text-[10px] truncate ${isActive ? "text-brand-900 font-bold" : "text-emerald-100/90 font-medium"}`}>
                        {tier.rangeLabel}
                      </div>
                      {isActive && wholesaleUnitPrice > 0 && (
                        <div className="text-[9px] text-brand-600 font-semibold mt-0.5">
                          Save {tier.savingsPct}% on total
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. ORDER QUANTITY & PRICE CALCULATION CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">

            {/* Set Quantity Stepper, Quick Addons & Price Calculation */}
            <div className="bg-[#FAF7F0] border border-[#E5DAC8] rounded-xl p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                    <span>Order Quantity ({unitLabelPlural}):</span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                      MOQ: {currentMoq} {unitLabelPlural}
                    </span>
                  </label>

                  {/* Stepper + Free Typing Input + Quick Addons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="inline-flex items-center bg-white rounded-xl p-1 border-2 border-[#D5CABB] shadow-xs focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-200 transition-all">
                      <button
                        type="button"
                        onClick={() => handleAdjustQty(-1)}
                        disabled={qty <= (currentMoq || 10)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        title="Decrease quantity by 1"
                        aria-label="Decrease quantity by 1"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={qtyInput}
                        onChange={(e) => handleQtyInputChange(e.target.value)}
                        onBlur={handleQtyInputBlur}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleQtyInputBlur();
                        }}
                        className="w-16 bg-transparent text-center font-extrabold text-slate-900 text-sm sm:text-base focus:outline-none select-all"
                        aria-label={`Order quantity in ${unitLabelPlural}`}
                      />
                      <button
                        type="button"
                        onClick={() => handleAdjustQty(1)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Increase quantity by 1"
                        aria-label="Increase quantity by 1"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quick Add-ons (+10, +50, +100) */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleAdjustQty(10)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 shadow-2xs transition-all cursor-pointer"
                        title="Add 10 more sets"
                      >
                        +10
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustQty(50)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 shadow-2xs transition-all cursor-pointer"
                        title="Add 50 more sets"
                      >
                        +50
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustQty(100)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 shadow-2xs transition-all cursor-pointer"
                        title="Add 100 more sets"
                      >
                        +100
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown: Gross → Discount → Net */}
                <div className="text-left sm:text-right pt-2 sm:pt-0 min-w-[220px] sm:pl-4 space-y-1">
                  <span className="text-[11px] font-bold text-brand-800 uppercase tracking-wider block mb-1.5">
                    Price Breakdown:
                  </span>

                  {/* Row 1: Gross wholesale */}
                  <div className="flex items-center sm:justify-end gap-2 text-xs text-slate-600">
                    <span className="text-slate-500">{qty} {unitLabelPlural} × ₹{wholesaleUnitPrice}</span>
                    <span className="font-semibold text-slate-800">= ₹{grossWholesaleSubtotal.toLocaleString("en-IN")}</span>
                  </div>

                  {/* Row 2: Discount deduction */}
                  {mainDiscountAmount > 0 && (
                    <div className="flex items-center sm:justify-end gap-2 text-xs text-emerald-700 font-bold">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>{activeTierDiscountPct}% Bulk Discount</span>
                      </span>
                      <span>− ₹{mainDiscountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  {/* Divider + You Pay */}
                  <div className="mt-1.5 pt-1.5 border-t border-[#D5CABB]">
                    <div className="flex items-baseline sm:justify-end gap-2">
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">You Pay:</span>
                      <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        ₹{estimatedSubtotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center sm:justify-end gap-1.5 mt-0.5 flex-wrap">
                      {totalSavings > 0 && (
                        <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
                          Save ₹{totalSavings.toLocaleString("en-IN")} ({effectiveSavingsPct}% OFF)
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 font-medium">
                        Excl. {product.tax?.gstRate || 18}% GST
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons: Add to Basket & Review Basket */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`btn-primary w-full py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer ${added ? "bg-brand-500 border-brand-600" : ""
                  }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Added {qty} {unitLabelPlural} to Basket</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add {qty} {unitLabelPlural} to Basket</span>
                  </>
                )}
              </button>

              <Link
                href="/quote"
                className="btn-secondary w-full py-2.5 text-xs sm:text-sm text-center font-bold flex items-center justify-center gap-1.5"
              >
                <span>Review Basket &amp; Order</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Assurance & Lead Time */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-3 border-t border-slate-100">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-600" />
                <span>
                  <strong>Lead Time:</strong> {activeOccasion.leadTime || "5–7 Days"}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-brand-600" />
                <span>
                  <strong>Logistics:</strong> Pan-India Direct
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-brand-600" />
                <span>
                  <strong>Tax Invoice:</strong> {product.tax?.gstRate || 18}% GST Credit
                </span>
              </span>
            </div>
          </div>

          {/* PACKAGING & PRESENTATION BOX (Located under Quantity & Price Calculation Card) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-brand-700" />
              <span>Packaging &amp; Presentation:</span>
            </label>
            <div className="p-3 bg-brand-50/70 border border-brand-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Box className="w-4 h-4 text-brand-700" />
                <span>Standard Recyclable Eco Kraft Gift Box</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                Included FREE
              </span>
            </div>
          </div>

          {/* 4. B2B BULK ORDER POLICY BOX */}
          <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  B2B Bulk Order Policy &amp; Procurement Terms
                </span>
              </div>
              <span className="text-[10px] font-bold text-brand-800 bg-brand-100/80 px-2 py-0.5 rounded-full border border-brand-200">
                Verified B2B Direct
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <Boxes className="w-3.5 h-3.5 text-brand-700 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-slate-900 block font-semibold text-[11px]">Minimum Order Quantity</strong>
                  <span className="text-[11px] text-slate-500">MOQ starts at {currentMoq} {unitLabelPlural}. Tier rates auto-apply on larger lots.</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <PackageCheck className="w-3.5 h-3.5 text-brand-700 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-slate-900 block font-semibold text-[11px]">Sampling Policy</strong>
                  <span className="text-[11px] text-slate-500">Sample evaluation kits dispatched within 24–48h. Sample fee credited on bulk orders.</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-brand-700 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-slate-900 block font-semibold text-[11px]">Production &amp; Dispatch</strong>
                  <span className="text-[11px] text-slate-500">Standard batch dispatch in {activeOccasion.leadTime || "5–7 business days"} with live GPS tracking.</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-700 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-slate-900 block font-semibold text-[11px]">Quality &amp; GST Compliance</strong>
                  <span className="text-[11px] text-slate-500">100% factory QA inspected. Official B2B tax invoice issued for 18% input tax credit.</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. KEY PRODUCT FEATURES & MATERIAL BENEFITS BOX */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-700" />
              <span>Key Product Features &amp; Material Benefits</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              {Array.isArray(product.productFeatures) && product.productFeatures.length > 0 ? (
                product.productFeatures.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-brand-700 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-brand-700 flex-shrink-0" />
                    <span>Made from Agricultural Rice Husk Biocomposite</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-brand-700 flex-shrink-0" />
                    <span>100% Food Contact Safe (US FDA / LFGB Certified)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-brand-700 flex-shrink-0" />
                    <span>Microwave Reheat &amp; Dishwasher Safe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-brand-700 flex-shrink-0" />
                    <span>Durable, Lightweight &amp; Break-Resistant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-brand-700 flex-shrink-0" />
                    <span>Zero Melamine, BPA &amp; Formaldehyde</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-brand-700 flex-shrink-0" />
                    <span>Individual Recyclable Kraft Gift Box Included</span>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* LOWER SECTION: Complete Detailed Information Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/60 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("set_contents")}
            className={`px-5 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === "set_contents"
              ? "border-brand-600 text-brand-800 bg-white shadow-xs"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
              }`}
          >
            <Layers className="w-4 h-4" />
            <span>Product Details &amp; All Specifications</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sustainability")}
            className={`px-5 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === "sustainability"
              ? "border-brand-600 text-brand-800 bg-white shadow-xs"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
              }`}
          >
            <Leaf className="w-4 h-4" />
            <span>Sustainability &amp; Footprint</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ordering")}
            className={`px-5 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === "ordering"
              ? "border-brand-600 text-brand-800 bg-white shadow-xs"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
              }`}
          >
            <Truck className="w-4 h-4" />
            <span>B2B Ordering &amp; Logistics</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6">
          {/* TAB 1: Product Details & All Specifications */}
          {activeTab === "set_contents" && (
            <div className="space-y-6">
              {giftItems.length > 0 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Gift Set Contents ({giftItems.length} Products Included)
                    </h3>
                    <p className="text-xs text-slate-600">
                      Each product in this set is crafted from sustainable BioDur biocomposite.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {giftItems.map((item, idx) => (
                      <div key={item._id || idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                          <span className="text-[11px] font-bold text-brand-800 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded">
                            Qty: {item.quantity} {item.unit || "pc"}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                        )}
                        {item.specifications && Object.keys(item.specifications).length > 0 && (
                          <div className="pt-2 border-t border-slate-200/80">
                            <table className="w-full text-[11px]">
                              <tbody className="divide-y divide-slate-200/60">
                                {Object.entries(item.specifications).slice(0, 5).map(([sk, sv]) => (
                                  <tr key={sk}>
                                    <td className="py-1 font-semibold text-slate-500 w-1/2">{sk}</td>
                                    <td className="py-1 text-slate-800">{String(sv)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comprehensive Gifting Classification & Event Purpose Breakdown */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-brand-700 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                        <span>Gifting Classification &amp; Purpose</span>
                        <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {activeOccasion.badgeText}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        This product comes under: <strong className="text-brand-800">{activeOccasion.comesUnder}</strong>
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
                    Package Type: {activeOccasion.label}
                  </span>
                </div>

                {/* Plain-English Explanation Banner */}
                <div className="bg-white border border-emerald-200/80 rounded-xl p-3.5 shadow-2xs">
                  <div className="flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-brand-700 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-900">
                        Why this product is listed under {activeOccasion.label}:
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {activeOccasion.plainExplanation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4 Detail Specification Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-white border border-slate-200/80 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      🏷️ Gifting Category
                    </span>
                    <span className="text-xs font-bold text-slate-900 block">
                      {activeOccasion.label}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {activeOccasion.subtitle}
                    </span>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      🎯 Best Suited For
                    </span>
                    <span className="text-xs font-semibold text-slate-800 block line-clamp-2">
                      {activeOccasion.bestSuitedFor}
                    </span>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      📦 Packaging Format
                    </span>
                    <span className="text-xs font-semibold text-slate-800 block line-clamp-2">
                      {activeOccasion.packagingDetails}
                    </span>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      ⚡ MOQ &amp; Lead Time
                    </span>
                    <span className="text-xs font-bold text-emerald-800 block">
                      MOQ: {currentMoq} {unitLabelPlural}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Lead Time: {activeOccasion.leadTime || "5–7 Days"}
                    </span>
                  </div>
                </div>

                {/* 5 Gifting Categories Comparison Grid */}
                <div className="pt-2 border-t border-slate-200/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-brand-700" />
                      <span>How this product serves different gifting occasions:</span>
                    </h5>
                    <span className="text-[10px] text-slate-400">5 Event Packages Available</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                    {B2B_OCCASIONS.map((occ) => {
                      const isCurrent = occ.key === activeOccasion.key;
                      const OccIcon = occ.icon;
                      return (
                        <Link
                          key={occ.key}
                          href={`/products/${product.slug}?context=${occ.key}`}
                          className={`p-2.5 rounded-xl border text-left transition-all block ${isCurrent
                            ? "bg-emerald-50 border-brand-600 ring-1 ring-brand-600 shadow-xs"
                            : "bg-white border-slate-200 hover:border-brand-400 hover:bg-slate-50"
                            }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <div className={`w-5 h-5 rounded flex items-center justify-center ${isCurrent ? "bg-brand-700 text-white" : "bg-slate-100 text-slate-600"}`}>
                              <OccIcon className="w-3 h-3" />
                            </div>
                            {isCurrent ? (
                              <span className="text-[8px] font-extrabold uppercase bg-brand-700 text-white px-1.5 py-0.2 rounded">
                                Current
                              </span>
                            ) : (
                              <span className="text-[9px] font-semibold text-slate-400">
                                MOQ {occ.moq}
                              </span>
                            )}
                          </div>
                          <div className={`text-xs font-bold leading-tight ${isCurrent ? "text-brand-900" : "text-slate-800"}`}>
                            {occ.label}
                          </div>
                          <div className="text-[10px] text-slate-500 leading-tight mt-0.5 line-clamp-1">
                            {occ.subtitle}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Master Technical Specifications & Dimensions Table */}
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Technical Specifications &amp; Material Data
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Precision-engineered tableware made from upcycled agricultural rice husk composite. Designed for commercial durability and everyday corporate gifting.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-xs">
                      <tbody className="divide-y divide-slate-100">
                        {Object.entries(combinedSpecs).map(([key, val]) => (
                          <tr key={key} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-4 font-semibold text-slate-600 bg-slate-50/60 w-2/5">
                              {key}
                            </td>
                            <td className="py-2.5 px-4 text-slate-900 font-medium">
                              {typeof val === "object" ? JSON.stringify(val) : String(val)}
                            </td>
                          </tr>
                        ))}
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-4 font-semibold text-slate-600 bg-slate-50/60">
                            Set Contents
                          </td>
                          <td className="py-2.5 px-4 text-slate-900 font-medium">
                            {setContentsText}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-[#FAF7F0] border border-[#E5DAC8] rounded-xl p-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-brand-700" />
                      <span>Compliance &amp; Quality Assurances</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700">
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-brand-700 mt-0.5 flex-shrink-0" />
                        <span><strong>Thermal Tolerance:</strong> Tested from -20°C up to +120°C for microwave and cold dish applications.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-brand-700 mt-0.5 flex-shrink-0" />
                        <span><strong>Commercial Dishwasher:</strong> Safe for up to 1,000 commercial wash cycles without surface degradation.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-brand-700 mt-0.5 flex-shrink-0" />
                        <span><strong>Zero Migration:</strong> 100% free from heavy metals, formaldehyde, BPA, and microplastics.</span>
                      </li>
                    </ul>

                    {product.careInstructions && (
                      <div className="pt-2 border-t border-[#E5DAC8]/80">
                        <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1">
                          Care &amp; Cleaning Instructions:
                        </h5>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {product.careInstructions}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Sustainability & Footprint */}
          {activeTab === "sustainability" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Environmental Impact &amp; Circular Bio-Economy
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Green Fibre transforms agricultural crop residue into high-performance, carbon-negative dining goods, preventing open stubble burning in India.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-emerald-800 mb-1">0%</div>
                  <div className="text-xs font-bold text-slate-900 mb-1">Virgin Plastic Used</div>
                  <p className="text-[11px] text-slate-600">Replaces petroleum plastics with agricultural rice husk composite.</p>
                </div>
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-emerald-800 mb-1">70%</div>
                  <div className="text-xs font-bold text-slate-900 mb-1">Carbon Reduction</div>
                  <p className="text-[11px] text-slate-600">Significant lifecycle CO2 savings compared to conventional tableware.</p>
                </div>
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-emerald-800 mb-1">100%</div>
                  <div className="text-xs font-bold text-slate-900 mb-1">Stubble Burning Prevention</div>
                  <p className="text-[11px] text-slate-600">Every ton of crop waste processed prevents toxic open field burning smoke.</p>
                </div>
              </div>

              {product.sustainability?.madeWith && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sprout className="w-4 h-4 text-brand-700" />
                    <span>Bio-Composite Formulation &amp; Traceability</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {product.sustainability.madeWith}
                  </p>
                  {Array.isArray(product.sustainability.highlights) && product.sustainability.highlights.length > 0 && (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2 text-xs text-slate-700">
                      {product.sustainability.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-brand-700 flex-shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: B2B Ordering & Logistics */}
          {activeTab === "ordering" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Seamless B2B Ordering, Dispatch &amp; Logistics
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  We supply enterprises, multinational companies, and event organizers across India with reliable dispatch schedules and dedicated support.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <Truck className="w-4 h-4 text-brand-700" />
                    <span>Pan-India Logistics Support</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Direct door-to-door delivery to corporate offices, distribution centers, or multi-location branches across India with live consignment tracking.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <FileText className="w-4 h-4 text-brand-700" />
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

      {/* LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close zoom modal"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={activeImage}
              alt={`${product.name} High-Res Inspection`}
              className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl bg-white"
              onError={(e) => {
                e.currentTarget.src = "/images/placeholder.jpg";
              }}
            />
            <div className="mt-3 text-white/90 text-xs font-semibold text-center">
              {product.name} • {activeOccasion.label} ({activeImageIndex + 1} of {images.length})
            </div>
          </div>
        </div>
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
            padding: "16px",
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
              maxWidth: "520px",
              maxHeight: "90vh",
              background: "#ffffff",
              borderRadius: "28px",
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

              // Price math
              const addonOrigPrice = primaryAddon
                ? (primaryAddon.price || primaryAddon.discountedPrice || primaryAddon.originalPrice || primaryAddon.retailPrice || 0)
                : 0;
              const addonDiscPrice = addonOrigPrice > 0 ? Math.round(addonOrigPrice * 0.95) : 0;
              const addonSavings = addonOrigPrice > 0 ? (addonOrigPrice - addonDiscPrice) : 0;

              // Extra 5% bundle discount calculation
              const extra5PctDiscountAmount = Math.round(grossWholesaleSubtotal * 0.05) + (primaryIsAdded ? addonSavings : addonSavings);
              const totalDisplaySubtotal = primaryIsAdded ? (estimatedSubtotal + addonDiscPrice) : estimatedSubtotal;

              return (
                <div className="p-5 sm:p-7 space-y-4 bg-white overflow-y-auto flex-1">
                  {/* Top row: Bundle Offer Pill & Close Button */}
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 text-[#9b6f38] text-xs sm:text-[13px] font-semibold tracking-wide">
                      <span className="w-5 h-[2px] bg-[#9b6f38] rounded-full inline-block"></span>
                      <span>Bundle offer</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="w-8 h-8 rounded-full border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Headline & Subtitle */}
                  <div className="space-y-1.5 pt-0.5">
                    <h2 className="text-2xl sm:text-[26px] font-bold text-[#0f3428] tracking-tight leading-tight">
                      Enjoy an Extra 5% Savings
                    </h2>
                    <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed">
                      You&apos;re already saving {activeTierDiscountPct}% on your cart. Add {primaryAddon ? (primaryAddon.name.match(/^[aeiou]/i) ? `an ${primaryAddon.name}` : `a ${primaryAddon.name}`) : "a companion product"} and{" "}
                      <strong className="font-semibold text-slate-800">save 5% more on your overall order.</strong>
                    </p>
                  </div>

                  {/* Progress Bar (10% unlocked -> 15% with bundle) */}
                  <div className="pt-2 pb-1 space-y-2">
                    <div className="relative flex items-center">
                      <div className="h-1 bg-slate-100 w-full rounded-full overflow-hidden">
                        <div className={`h-full bg-[#1b5e3f] transition-all duration-300 ${primaryIsAdded || anyItemAdded ? "w-full" : "w-[4%]"}`} />
                      </div>
                      {/* Left Dot */}
                      <div className="absolute left-0 w-3 h-3 rounded-full bg-[#1b5e3f] ring-4 ring-[#1b5e3f]/20 -translate-x-0.5" />
                      {/* Right Dot */}
                      <div className={`absolute right-0 w-3 h-3 rounded-full transition-all duration-300 translate-x-0.5 ${
                        primaryIsAdded || anyItemAdded
                          ? "bg-[#1b5e3f] ring-4 ring-[#1b5e3f]/20"
                          : "border-2 border-slate-300 bg-white"
                      }`} />
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-[#1b5e3f] font-semibold text-[11.5px]">
                        {activeTierDiscountPct}% off • unlocked
                      </span>
                      <span className={`text-[11.5px] transition-colors ${primaryIsAdded || anyItemAdded ? "text-[#1b5e3f] font-bold" : "text-slate-400 font-normal"}`}>
                        {activeTierDiscountPct + 5}% off with bundle
                      </span>
                    </div>
                  </div>

                  {/* Add-on Product Card(s) */}
                  {hasAddons ? (
                    <div className="space-y-2.5 pt-1">
                      {relatedProducts.slice(0, 2).map((rel) => {
                        const isAdded = Boolean(pairAdded[rel.slug]);
                        const origP = rel.price || rel.discountedPrice || rel.originalPrice || rel.retailPrice || 0;
                        const discP = origP > 0 ? Math.round(origP * 0.95) : 0;

                        return (
                          <div
                            key={rel.slug}
                            className={`rounded-2xl border p-3 sm:p-3.5 flex items-center justify-between gap-3 transition-all ${
                              isAdded
                                ? "border-emerald-500 bg-emerald-50/20 shadow-xs"
                                : "border-slate-200/90 bg-[#fafbfc] hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0 flex-1">
                              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 p-1">
                                <img
                                  src={rel.image || "/images/gift-set-classic.jpg"}
                                  alt={rel.name}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.currentTarget.src = "/images/gift-set-classic.jpg";
                                  }}
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm font-semibold text-slate-900 truncate leading-snug">
                                  {rel.name}
                                </h4>
                                <div className="flex items-baseline gap-1.5 mt-0.5">
                                  <span className="text-sm font-bold text-slate-900">
                                    ₹{discP.toLocaleString("en-IN")}
                                  </span>
                                  {origP > 0 && discP < origP && (
                                    <span className="text-xs text-slate-400 line-through">
                                      ₹{origP.toLocaleString("en-IN")}
                                    </span>
                                  )}
                                </div>
                                <span className="inline-block mt-1 text-[10px] font-medium text-[#8c5e28] border border-[#dfc3a1] bg-[#fefbf7] px-2 py-0.5 rounded-full">
                                  +5% more off on all items
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddPairToQuote(rel)}
                              className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all flex-shrink-0 ${
                                isAdded
                                  ? "bg-[#1b5e3f] text-white shadow-xs"
                                  : "border border-[#1b5e3f] text-[#1b5e3f] hover:bg-[#1b5e3f] hover:text-white"
                              }`}
                              aria-label={isAdded ? "Added to order" : `Add ${rel.name}`}
                            >
                              {isAdded ? (
                                <Check className="w-4 h-4 stroke-[3]" />
                              ) : (
                                <Plus className="w-4 h-4 stroke-[2.5]" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}

                  {/* Pricing Breakdown Rows */}
                  <div className="space-y-2 pt-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Your items ({activeTierDiscountPct}% off each)</span>
                      <span className="font-medium text-slate-900">
                        ₹{estimatedSubtotal.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {primaryAddon && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span>{primaryAddon.name}</span>
                        <span className="font-medium text-slate-900">
                          ₹{addonOrigPrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[#1b5e3f] font-semibold">
                      <span>Extra 5% bundle discount</span>
                      <span>-₹{extra5PctDiscountAmount.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="border-t border-slate-100 pt-2 flex items-baseline justify-between">
                      <span className="font-bold text-slate-900 text-sm">Subtotal</span>
                      <span className="text-2xl sm:text-[26px] font-extrabold text-[#0d3b2e] tracking-tight">
                        ₹{totalDisplaySubtotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Action CTAs */}
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (primaryAddon && !pairAdded[primaryAddon.slug]) {
                          handleAddPairToQuote(primaryAddon);
                        }
                        setModalStep(2);
                      }}
                      className="w-full py-3.5 rounded-2xl text-sm font-bold text-white bg-[#1b5e3f] hover:bg-[#154c32] shadow-sm hover:shadow-md transition-all cursor-pointer text-center flex items-center justify-center gap-2"
                    >
                      <span>
                        Add {primaryAddon ? primaryAddon.name.toLowerCase() : "companion"} &amp; get {activeTierDiscountPct + 5}% off
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalStep(2)}
                      className="w-full py-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer text-center"
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
                <div className="bg-brand-700 text-white px-5 py-3.5 flex items-center justify-between gap-3 flex-shrink-0 border-b border-brand-800">
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2 truncate">
                    <span>🎉</span>
                    <span>You&apos;ve unlocked {activeTierObj.tierNumber === 1 ? "Tier 1 — Starter" : activeTierObj.tierNumber === 2 ? "Tier 2 — Personalized" : "Tier 3 — Fully Custom"}!</span>
                  </h2>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0 transition-all bg-white/20 hover:bg-white/35 text-white shadow-xs"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Step 2 Body: Checklist of Included Perks */}
                <div className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-3 bg-slate-50/50">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      Included Perks Checklist
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                      Cumulative Value
                    </span>
                  </div>

                  {/* Perk 1: Tier 1 Starter (Always Unlocked at MOQ 10+) */}
                  <div
                    className="p-3.5 rounded-2xl border transition-all duration-300 bg-white border-emerald-300 shadow-2xs relative overflow-hidden group"
                    style={{ animation: "gfPerkPopIn 0.35s ease-out forwards" }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-7 h-7 rounded-full bg-brand-700 text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5"
                        style={{ animation: "gfCheckPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards" }}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                            Welcome &amp; Thank-You Kit included
                          </h4>
                          <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Tier 1 Starter
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed mt-1">
                          A little something extra, free with your order. (Personalize message in Step 3)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Perk 2: Tier 2 Personalized (Unlocked at 50+ sets) */}
                  {activeTierObj.tierNumber >= 2 ? (
                    <div
                      className="p-3.5 rounded-2xl border transition-all duration-300 bg-white border-emerald-400 shadow-2xs relative overflow-hidden group"
                      style={{ animation: "gfPerkPopIn 0.45s ease-out forwards" }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-7 h-7 rounded-full bg-brand-700 text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5"
                          style={{ animation: "gfCheckPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 0.1s" }}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                              Your Name Engraved on the Product
                            </h4>
                            <span className="text-[10px] font-extrabold text-brand-800 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                              Tier 2 Perk ✨
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed mt-1">
                            Free laser engraving of individual recipient names or company text. (Enter in Step 3)
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Dimmed Locked State for Tier 2 */
                    <div className="p-3.5 rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 opacity-75 hover:opacity-100 transition-all duration-200 space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-700 leading-tight">
                              Your Name Engraved on the Product
                            </h4>
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                              Tier 2 (50+ Sets)
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed mt-1">
                            Free laser engraving of individual recipient names or company text.
                          </p>
                        </div>
                      </div>
                      <div className="pl-10 pt-1 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-500 font-medium">
                          Add {Math.max(0, 50 - qty)} more sets to unlock
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSetExactQty(50)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 hover:border-brand-300 transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3 text-brand-600" />
                          <span>Upgrade to 50 sets</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Perk 3: Tier 3 Fully Custom (Unlocked at 100+ sets) */}
                  {activeTierObj.tierNumber >= 3 ? (
                    <div
                      className="p-3.5 rounded-2xl border transition-all duration-300 bg-gradient-to-r from-amber-50/50 via-white to-emerald-50/50 border-amber-300 shadow-2xs relative overflow-hidden group"
                      style={{ animation: "gfPerkPopIn 0.55s ease-out forwards" }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5"
                          style={{ animation: "gfCheckPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 0.2s" }}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                              Custom Product Name + Branded Box Sleeve
                            </h4>
                            <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                              Tier 3 VIP 👑
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed mt-1">
                            Custom product naming &amp; branded sleeve. (Set name in Step 3; logo collected via phone/WhatsApp)
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Dimmed Locked State for Tier 3 */
                    <div className="p-3.5 rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 opacity-75 hover:opacity-100 transition-all duration-200 space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-700 leading-tight">
                              Custom Product Name + Branded Box Sleeve
                            </h4>
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                              Tier 3 (100+ Sets)
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed mt-1">
                            Custom product naming &amp; branded sleeve. (Logo collected via phone/WhatsApp)
                          </p>
                        </div>
                      </div>
                      <div className="pl-10 pt-1 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-500 font-medium">
                          Add {Math.max(0, 100 - qty)} more sets to unlock
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSetExactQty(100)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 hover:border-amber-300 transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                        >
                          <Crown className="w-3 h-3 text-amber-600" />
                          <span>Upgrade to 100 sets</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 2 Footer: Order Summary & Actions */}
                <div className="flex-shrink-0 px-5 py-4 border-t border-slate-200 bg-white space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 text-[11px] font-medium block">Order Snapshot:</span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {qty} {unitLabelPlural} • ₹{estimatedSubtotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                    {totalSavings > 0 && (
                      <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                        Saved ₹{totalSavings.toLocaleString("en-IN")} ({activeTierDiscountPct}% OFF)
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setModalStep(1)}
                      className="py-2.5 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer text-center"
                    >
                      ← Back to Add-ons
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalStep(3)}
                      className="py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-sm bg-brand-700 hover:bg-brand-600 transition-all cursor-pointer text-center"
                    >
                      <span>Next: Personalize Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── STEP 3: ORDER PERSONALIZATION (CARD MESSAGE, ENGRAVING & CUSTOM BRANDING) ── */}
            {modalStep === 3 && (
              <>
                {/* Step 3 Header: Slim Dark Brand Green */}
                <div className="bg-brand-700 text-white px-5 py-3.5 flex items-center justify-between gap-3 flex-shrink-0 border-b border-brand-800">
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2 truncate">
                    <span>💌</span>
                    <span>Personalize Order &amp; Customizations</span>
                  </h2>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0 transition-all bg-white/20 hover:bg-white/35 text-white shadow-xs"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Step 3 Body: Form Inputs for Card, Engraving, and Custom Product Name */}
                <div className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-4 bg-slate-50/50">
                  {/* Section 1: Kit Card Message (Tier 1+) */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                      <div className="w-7 h-7 rounded-lg bg-brand-700 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-emerald-950 block">
                          Tier 1 Starter Perk (Included in all {qty} {unitLabelPlural}):
                        </span>
                        <span className="text-[11px] text-emerald-800">
                          Custom printed plantable seed paper or kraft story card inside each gift box.
                        </span>
                      </div>
                    </div>

                    {/* Input 1: Sender Name */}
                    <div className="space-y-1.5 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                      <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-brand-700" />
                          <span>Sender Name / Organization (From)</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                      </label>
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="e.g. Acme Corp Leadership Team / Rajesh Sharma"
                        className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none text-slate-900 transition-all font-medium"
                      />
                    </div>

                    {/* Input 2: Receiver Name */}
                    <div className="space-y-1.5 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                      <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-brand-700" />
                          <span>Receiver Name / Recipient Group (To)</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                      </label>
                      <input
                        type="text"
                        value={receiverName}
                        onChange={(e) => setReceiverName(e.target.value)}
                        placeholder="e.g. Valued Partner / Jane Smith / Team Member"
                        className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none text-slate-900 transition-all font-medium"
                      />
                    </div>

                    {/* Input 3: Gift Message with 50-60 Word Counter */}
                    <div className="space-y-2 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                      {(() => {
                        const messageWordCount = giftMessage.trim()
                          ? giftMessage.trim().split(/\s+/).filter(Boolean).length
                          : 0;

                        return (
                          <>
                            <div className="flex items-center justify-between flex-wrap gap-1.5">
                              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-brand-700" />
                                <span>Card Message (50–60 words)</span>
                              </label>
                              <span
                                className={`text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full border transition-all ${messageWordCount >= 50 && messageWordCount <= 60
                                  ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                                  : messageWordCount > 60
                                    ? "bg-amber-100 text-amber-900 border-amber-300"
                                    : "bg-slate-100 text-slate-600 border-slate-200"
                                  }`}
                              >
                                {messageWordCount >= 50 && messageWordCount <= 60 ? (
                                  <span>✓ {messageWordCount} / 60 words (Target met!)</span>
                                ) : messageWordCount > 60 ? (
                                  <span>⚠ {messageWordCount} words ({messageWordCount - 60} words over target)</span>
                                ) : (
                                  <span>{messageWordCount} / 60 words ({Math.max(0, 50 - messageWordCount)} more for 50)</span>
                                )}
                              </span>
                            </div>

                            <textarea
                              rows={4}
                              value={giftMessage}
                              onChange={(e) => setGiftMessage(e.target.value)}
                              placeholder="Write your personalized 50 to 60 word greeting or thank-you message to print on the kit card..."
                              className="w-full p-3 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none text-slate-900 transition-all resize-none font-medium leading-relaxed"
                            />
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Section 2: Tier 2 Product Name Engraving */}
                  {activeTierObj.tierNumber >= 2 ? (
                    <div className="space-y-1.5 bg-white p-3.5 rounded-2xl border border-emerald-300 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-brand-700" />
                          <span>Name / Text to Engrave on Product</span>
                        </label>
                        <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Tier 2 Perk ✨
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Enter recipient individual name(s), comma-separated list, or text to be laser engraved on each product:
                      </p>
                      <input
                        type="text"
                        value={engravingName}
                        onChange={(e) => setEngravingName(e.target.value)}
                        placeholder="e.g. John Doe, Sarah Smith, Alex Wong / Company Tagline"
                        className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none text-slate-900 transition-all font-medium"
                      />
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 text-xs space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center flex-shrink-0">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-700">Product Name Laser Engraving</h4>
                            <p className="text-[11px] text-slate-500">Unlocked at 50+ sets (Tier 2)</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSetExactQty(50)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 hover:border-brand-300 transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3 text-brand-600" />
                          <span>Unlock (50 sets)</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Section 3: Tier 3 Custom Product Name & Logo Note */}
                  {activeTierObj.tierNumber >= 3 ? (
                    <div className="space-y-2.5 bg-gradient-to-r from-amber-50/40 via-white to-emerald-50/30 p-3.5 rounded-2xl border border-amber-300 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Crown className="w-3.5 h-3.5 text-amber-600" />
                          <span>Custom Product Name for Box Sleeve</span>
                        </label>
                        <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                          Tier 3 VIP 👑
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        Give your gift sets a custom edition name or branded collection title for the box sleeve:
                      </p>
                      <input
                        type="text"
                        value={customProductName}
                        onChange={(e) => setCustomProductName(e.target.value)}
                        placeholder="e.g. Acme Leadership Onboarding Set 2026 / The Eco-Executive Kit"
                        className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-white border border-amber-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none text-slate-900 transition-all font-medium"
                      />

                      {/* Logo Collection Notification Callout */}
                      <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200 flex items-start gap-2.5 text-xs">
                        <PhoneCall className="w-4 h-4 text-amber-800 flex-shrink-0 mt-0.5" />
                        <div className="text-[11px] text-amber-950 leading-relaxed">
                          <span className="font-bold text-amber-900 block">Company Logo / Vector Artwork:</span>
                          In case of logo branding, our B2B team will contact you shortly via phone / WhatsApp after quote submission to collect your high-res logo file and share a digital 3D mockup for your approval.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl border-2 border-dashed border-amber-200/80 bg-amber-50/30 text-xs space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-amber-950">Custom Product Name &amp; Branded Box Sleeve / Logo</h4>
                            <p className="text-[11px] text-amber-900/80">Unlocked at 100+ sets (Tier 3 VIP)</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSetExactQty(100)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                        >
                          <Crown className="w-3 h-3" />
                          <span>Unlock (100 sets)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 3 Footer: Order Summary & Review Basket */}
                <div className="flex-shrink-0 px-5 py-4 border-t border-slate-200 bg-white space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 text-[11px] font-medium block">Order Snapshot:</span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {qty} {unitLabelPlural} • ₹{estimatedSubtotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                    {totalSavings > 0 && (
                      <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                        Saved ₹{totalSavings.toLocaleString("en-IN")} ({activeTierDiscountPct}% OFF)
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setModalStep(2)}
                      className="py-2.5 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer text-center"
                    >
                      ← Back to Perks
                    </button>
                    <Link
                      href="/quote"
                      onClick={handleSaveCustomizations}
                      className="py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-sm bg-brand-700 hover:bg-brand-600 transition-all cursor-pointer text-center"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Review Basket</span>
                      <ArrowRight className="w-4 h-4" />
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
