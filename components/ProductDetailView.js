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
  Eye
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
        title: "Tier 1 Starter",
        badge: "MOQ 10",
        isPopular: false,
        min: 10,
        max: 49,
        rangeLabel: "10–49 Sets",
        price: 1700,
        savingsPct: 20,
        leadTime: "7–10 Days",
        allowedCustomizations: 2,
        customizationAllowanceText: "Choose any 2 of 5 complimentary customizations below.",
        nextTierUnlockText: "Tier 2 (50+) unlocks 3 →",
        perks: ["20% Off MRP", "2 Free Customizations", "Standard 7-10 Day Production"]
      },
      {
        id: "tier-2",
        tierNumber: 2,
        title: "Tier 2 Growth",
        badge: "★ POPULAR",
        isPopular: true,
        min: 50,
        max: 99,
        rangeLabel: "50–99 Sets",
        price: 1530,
        savingsPct: 30,
        leadTime: "5–7 Days",
        allowedCustomizations: 3,
        customizationAllowanceText: "Choose any 3 of 5 complimentary customizations below.",
        nextTierUnlockText: "Tier 3 (100+) unlocks all 5 →",
        perks: ["30% Off MRP", "3 Free Customizations", "Priority Dispatch"]
      },
      {
        id: "tier-3",
        tierNumber: 3,
        title: "Tier 3 Enterprise",
        badge: "Max Value",
        isPopular: false,
        min: 100,
        max: null,
        rangeLabel: "100+ Sets",
        price: 1360,
        savingsPct: 40,
        leadTime: "3–5 Days",
        allowedCustomizations: 5,
        customizationAllowanceText: "All 5 complimentary customizations included.",
        nextTierUnlockText: "",
        perks: ["40% Off MRP", "All 5 Free", "Dedicated Account Manager", "Eco Certificate"]
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
        savingsPct: 18,
        leadTime: "5–7 Days",
        allowedCustomizations: 2,
        customizationAllowanceText: "Choose any 2 of 5 anniversary customizations below.",
        nextTierUnlockText: "Silver Jubilee (50+) unlocks 3 →",
        perks: ["Gold Satin Ribbon", "Anniversary Commemorative Print", "5-7 Day Production"]
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
        savingsPct: 30,
        leadTime: "5–7 Days",
        allowedCustomizations: 3,
        customizationAllowanceText: "Choose any 3 of 5 anniversary customizations below.",
        nextTierUnlockText: "Platinum (100+) unlocks all 5 →",
        perks: ["30% Off MRP", "3 Free Customizations", "Expedited 5-Day Production"]
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
        savingsPct: 40,
        leadTime: "3–5 Days",
        allowedCustomizations: 5,
        customizationAllowanceText: "All 5 anniversary customizations included complimentary.",
        nextTierUnlockText: "",
        perks: ["40% Off MRP", "All 5 Free", "White-Glove Delivery", "Commemorative Certificate"]
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
        savingsPct: 20,
        leadTime: "7–8 Days",
        allowedCustomizations: 2,
        customizationAllowanceText: "Choose any 2 of 5 wedding customizations below.",
        nextTierUnlockText: "Grand Wedding (50+) unlocks 3 →",
        perks: ["Blush Ribbon", "Couple Monogram", "7-Day Production"]
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
        savingsPct: 32,
        leadTime: "5–7 Days",
        allowedCustomizations: 3,
        customizationAllowanceText: "Choose any 3 of 5 wedding customizations below.",
        nextTierUnlockText: "Royal Wedding (100+) unlocks all 5 →",
        perks: ["32% Off MRP", "3 Free Customizations", "Free Physical Sample Kit"]
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
        savingsPct: 42,
        leadTime: "3–5 Days",
        allowedCustomizations: 5,
        customizationAllowanceText: "All 5 wedding customizations included free.",
        nextTierUnlockText: "",
        perks: ["42% Off MRP", "All 5 Free", "Doorstep Venue Delivery", "Dedicated Wedding RM"]
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
        savingsPct: 20,
        leadTime: "7 Days",
        allowedCustomizations: 2,
        customizationAllowanceText: "Choose any 2 of 5 festive customizations below.",
        nextTierUnlockText: "Festive Bulk (50+) unlocks 3 →",
        perks: ["Festive Hamper Box", "2 Free Customizations", "7-Day Production"]
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
        savingsPct: 32,
        leadTime: "5 Days",
        allowedCustomizations: 3,
        customizationAllowanceText: "Choose any 3 of 5 festive customizations free.",
        nextTierUnlockText: "Mega Festive (100+) unlocks all 5 →",
        perks: ["32% Off MRP", "3 Free Customizations", "Rush 5-Day Production"]
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
        savingsPct: 42,
        leadTime: "3 Days",
        allowedCustomizations: 5,
        customizationAllowanceText: "All 5 festive customizations included free.",
        nextTierUnlockText: "",
        perks: ["42% Off MRP", "All 5 Free", "3-Day Rush Production", "Dedicated Festive RM"]
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
        savingsPct: 20,
        leadTime: "5 Days",
        allowedCustomizations: 2,
        customizationAllowanceText: "2 complimentary onboarding customizations included.",
        nextTierUnlockText: "Growing Team (50+) unlocks 3 →",
        perks: ["Suitable for startups", "2 Free Customizations", "5-Day Express"]
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
        savingsPct: 32,
        leadTime: "4 Days",
        allowedCustomizations: 3,
        customizationAllowanceText: "Choose any 3 of 5 onboarding customizations free.",
        nextTierUnlockText: "Enterprise (100+) unlocks all 5 →",
        perks: ["32% Off MRP", "3 Free Customizations", "Priority Production"]
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
        savingsPct: 42,
        leadTime: "3 Days",
        allowedCustomizations: 5,
        customizationAllowanceText: "All 5 onboarding customizations included.",
        nextTierUnlockText: "",
        perks: ["42% Off MRP", "All 5 Free", "Dedicated HR RM", "Monthly Batch Scheduling"]
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

  // Active customization menu (5 options for this selected occasion)
  const currentCustomizations = activeOccasion.customizations;

  // Active tiers for this selected occasion dynamically scaled from the product's actual price
  const currentTiers = activeOccasion.tiers.map((t) => {
    let tierPrice = 0;
    if (productBasePrice > 0) {
      if (t.tierNumber === 1) {
        tierPrice = productBasePrice;
      } else if (t.tierNumber === 2) {
        tierPrice = Math.round(productBasePrice * (1 - (t.savingsPct || 10) / 100));
      } else {
        tierPrice = Math.round(productBasePrice * (1 - (t.savingsPct || 20) / 100));
      }
    }
    return {
      ...t,
      price: tierPrice
    };
  });
  const currentMoq = activeOccasion.moq;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColour, setSelectedColour] = useState(initialColor);
  const [qty, setQty] = useState(currentMoq || 10);
  const [qtyInput, setQtyInput] = useState(String(currentMoq || 10));
  const [brandingNotes, setBrandingNotes] = useState("");
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
    const originalPrice = rel.price || 0;
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

  const unitPrice = activeTierObj.price;
  const brandingFeePerUnit = 0; // Included in B2B Tiers
  const effectiveUnitPrice = unitPrice + brandingFeePerUnit;
  const estimatedSubtotal = effectiveUnitPrice * qty;

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
      price: effectiveUnitPrice,
      customBranding: selectedCustomizations.length > 0,
      selectedCustomizations: selectedCustomizationObjs.map((c) => c.name),
      customizationCount: selectedCustomizations.length,
      maxAllowedCustomizations: maxCustomizations,
      brandingNotes,
      packagingOption,
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

  const retailMrp = product.retailPrice || product.originalPrice || (currentTiers[0]?.price > 0 ? Math.round(currentTiers[0].price * 1.35) : 0);
  const hasRetailSavings = retailMrp > activeTierObj.price && activeTierObj.price > 0 && retailMrp > 0;
  const retailSavingsAmount = hasRetailSavings ? retailMrp - activeTierObj.price : 0;
  const retailSavingsPct = (hasRetailSavings && retailMrp > 0) ? Math.round((retailSavingsAmount / retailMrp) * 100) : 0;

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

            {/* Wholesale Price vs MRP Strikethrough Callout */}
            <div className="flex items-baseline gap-3 pt-0.5 flex-wrap">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                ₹{currentTiers[0]?.price}
                <span className="text-xs font-normal text-slate-500 ml-1">/{unitLabel} (Wholesale Bulk Rate)</span>
              </div>
              {hasRetailSavings && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 line-through font-medium">
                    MRP ₹{retailMrp}
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[11px]">
                    Save ₹{retailSavingsAmount}/{unitLabel} ({retailSavingsPct}% Off)
                  </span>
                </div>
              )}
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
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* PACKAGING & PRESENTATION BOX */}
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

          {/* 3. ORDER QUANTITY & PRICE CALCULATION CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">

            {/* Set Quantity Stepper, Quick Addons & Price Calculation */}
            <div className="bg-[#FAF7F0] border border-[#E5DAC8] rounded-xl p-3.5 sm:p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                    <span>Order Quantity ({unitLabelPlural}):</span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full border border-emerald-200">
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

                <div className="text-left sm:text-right pt-1 sm:pt-0">
                  <span className="text-[11px] font-bold text-brand-800 uppercase tracking-wider block">
                    Estimated Subtotal for {qty} {unitLabelPlural}:
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    ₹{estimatedSubtotal.toLocaleString("en-IN")}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    (₹{effectiveUnitPrice} per {unitLabel} • Excl. {product.tax?.gstRate || 18}% GST)
                  </span>
                </div>
              </div>

              {/* Quick Preset Volume Shortcuts */}
              <div className="pt-2 border-t border-[#E5DAC8]/70 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                  Quick Select:
                </span>
                <button
                  type="button"
                  onClick={() => handleSetExactQty(10)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${qty === 10
                    ? "bg-brand-600 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                >
                  10 (Tier 1)
                </button>
                <button
                  type="button"
                  onClick={() => handleSetExactQty(50)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${qty === 50
                    ? "bg-brand-600 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                >
                  50 (Tier 2 ★)
                </button>
                <button
                  type="button"
                  onClick={() => handleSetExactQty(100)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${qty === 100
                    ? "bg-brand-600 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                >
                  100 (Tier 3)
                </button>
                <button
                  type="button"
                  onClick={() => handleSetExactQty(250)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${qty === 250
                    ? "bg-brand-600 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                >
                  250
                </button>
                <button
                  type="button"
                  onClick={() => handleSetExactQty(500)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${qty === 500
                    ? "bg-brand-600 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                >
                  500+
                </button>
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

      {/* ── 2-STEP CUSTOMIZATION & RECOMMENDATION MODAL ── */}
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
            backgroundColor: "rgba(0, 0, 0, 0.72)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
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
              maxWidth: "860px",
              maxHeight: "80vh",
              background: "#ffffff",
              borderRadius: "24px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(0, 0, 0, 0.08)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              animation: "gfModalBox 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards"
            }}
          >
            {/* Step indicator bar */}
            <div className="flex items-center gap-2 px-6 pt-4 pb-2 flex-shrink-0 bg-white">
              <div
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 99,
                  background: "#22c55e"
                }}
              />
              <div
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 99,
                  background: modalStep >= 2 ? "#22c55e" : "#e2e8f0",
                  transition: "background 0.3s"
                }}
              />
              <span className="text-[11px] font-bold text-slate-500 ml-1">
                Step {modalStep} of 2
              </span>
            </div>

            {/* Header */}
            <div
              className="mx-5 mb-2 px-4 py-3 rounded-2xl flex items-center justify-between flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #16a34a, #22c55e)"
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  {modalStep === 1 ? (
                    <Sparkles className="w-4 h-4 text-white" />
                  ) : (
                    <SlidersHorizontal className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="min-w-0">
                  {modalStep === 1 ? (
                    <>
                      <h2 className="text-sm font-extrabold text-white leading-tight">
                        Frequently Bought Together &amp; Bundle Sets
                      </h2>
                      <p className="text-[11px] font-medium text-emerald-100 truncate">
                        Extra 5% bundle discount unlocked for paired items (Total up to 15% OFF)
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-sm font-extrabold text-white leading-tight">
                        Branding &amp; Customization Options
                      </h2>
                      <p className="text-[11px] font-medium text-emerald-100 truncate">
                        Select complimentary corporate personalization for your quote
                      </p>
                    </>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0 transition-all hover:bg-white/20 text-white"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── STEP 1: FREQUENTLY BOUGHT TOGETHER & BUNDLE DEALS ── */}
            {modalStep === 1 && (
              <>
                <div className="overflow-y-auto flex-1 px-5 py-3 space-y-3.5">
                  {/* Order added confirmation */}
                  <div
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
                  >
                    <span className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0 text-white shadow-xs">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-extrabold text-emerald-950 leading-tight">
                        {qty} {unitLabelPlural} added to your basket!
                      </p>
                      <p className="text-[11px] text-emerald-800">
                        Pair with complementary sets below to maximize your bulk savings.
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-extrabold text-slate-900">
                        ₹{estimatedSubtotal.toLocaleString("en-IN")}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {activeTierObj.title}
                      </p>
                    </div>
                  </div>

                  {/* Light & Vibrant Executive Bundle Savings Stacking Banner */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-[#fbfdf7] to-amber-50/60 border-2 border-emerald-300 text-slate-800 shadow-sm relative overflow-hidden">
                    {/* Subtle decorative background gradient circles */}
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-200/40 rounded-full blur-xl pointer-events-none" />
                    <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-amber-200/30 rounded-full blur-xl pointer-events-none" />

                    <div className="relative space-y-2.5">
                      {/* Top Header Row */}
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                            <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight block">
                              Executive Bundle Savings Stacking
                            </span>
                            <span className="text-[11px] text-slate-600 font-medium">
                              Add paired sets below to unlock your maximum volume tier
                            </span>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-amber-400 to-amber-300 text-amber-950 shadow-xs border border-amber-300 tracking-wide uppercase">
                          🔥 Total 15% OFF
                        </span>
                      </div>

                      {/* 3-Step Visual Discount Stacking Meter */}
                      <div className="grid grid-cols-3 gap-2">
                        {/* Step 1: Base Discount */}
                        <div className="bg-white border border-emerald-200/90 rounded-xl p-2 sm:p-2.5 text-center shadow-2xs">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                            Step 1 • Base Item
                          </span>
                          <span className="text-xs sm:text-sm font-black text-brand-700 block mt-0.5">
                            10% OFF
                          </span>
                          <span className="text-[9px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded inline-block mt-0.5">
                            Applied to primary
                          </span>
                        </div>

                        {/* Step 2: Add-on Discount */}
                        <div className="bg-white border border-amber-200/90 rounded-xl p-2 sm:p-2.5 text-center shadow-2xs relative">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                            Step 2 • Add-on
                          </span>
                          <span className="text-xs sm:text-sm font-black text-amber-600 block mt-0.5">
                            +5% EXTRA
                          </span>
                          <span className="text-[9px] text-amber-900 font-semibold bg-amber-50 px-1.5 py-0.2 rounded inline-block mt-0.5">
                            On paired items
                          </span>
                        </div>

                        {/* Step 3: Total Combined Savings */}
                        <div className="bg-gradient-to-br from-emerald-600 to-brand-700 text-white rounded-xl p-2 sm:p-2.5 text-center shadow-xs">
                          <span className="text-[9px] font-bold text-emerald-100 uppercase tracking-wider block">
                            Total Unlocked
                          </span>
                          <span className="text-xs sm:text-sm font-black text-white block mt-0.5 tracking-tight">
                            15% SAVINGS
                          </span>
                          <span className="text-[9px] text-emerald-950 font-bold bg-amber-300 px-1.5 py-0.2 rounded inline-block mt-0.5">
                            Max Enterprise Deal
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Frequently bought together grid */}
                  {relatedProducts.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Boxes className="w-3.5 h-3.5 text-brand-600" />
                          <span>Frequently Ordered With This Set</span>
                        </p>
                        <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                          Extra 5% Bundle Discount
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {relatedProducts.slice(0, 4).map((rel) => {
                          const itemQty = getPairQty(rel.slug);
                          const isItemAdded = Boolean(pairAdded[rel.slug]);
                          const originalPrice = rel.price || 0;
                          const discountedPrice = originalPrice > 0 ? Math.round(originalPrice * 0.95) : 0;
                          const savingsPerUnit = originalPrice > 0 ? originalPrice - discountedPrice : 0;

                          return (
                            <div
                              key={rel.slug}
                              className="group flex flex-col justify-between bg-white rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md border border-slate-200 hover:border-brand-400 p-3 relative"
                            >
                              {/* 5% Discount Badge */}
                              <div className="absolute top-2.5 right-2.5 z-10 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-[9.5px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 border border-emerald-400/30">
                                <Sparkles className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
                                <span>+5% OFF</span>
                              </div>

                              <div>
                                <div className="flex gap-2.5 items-center">
                                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-200 group/img">
                                    <img
                                      src={rel.image || "/images/gift-set-classic.jpg"}
                                      alt={rel.name}
                                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                                      onError={(e) => {
                                        e.currentTarget.src = "/images/gift-set-classic.jpg";
                                      }}
                                    />
                                    <Link
                                      href={`/products/${rel.slug}`}
                                      onClick={handleCloseModal}
                                      className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white"
                                      title="Preview product"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Link>
                                  </div>
                                  <div className="flex-1 min-w-0 pr-12">
                                    <Link
                                      href={`/products/${rel.slug}`}
                                      onClick={handleCloseModal}
                                      className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug hover:text-brand-600 transition-colors"
                                    >
                                      {rel.name}
                                    </Link>

                                    <div className="mt-0.5 flex items-baseline gap-1.5 flex-wrap">
                                      {discountedPrice > 0 ? (
                                        <>
                                          <span className="text-xs font-black text-brand-700">
                                            ₹{discountedPrice}
                                          </span>
                                          <span className="text-[10px] text-slate-400 line-through font-semibold">
                                            ₹{originalPrice}
                                          </span>
                                          <span className="text-[10px] font-semibold text-slate-500">
                                            /{rel.unit || "set"}
                                          </span>
                                        </>
                                      ) : (
                                        <span className="text-xs font-bold text-brand-600">
                                          Custom Tier
                                        </span>
                                      )}
                                    </div>

                                    <div className="mt-0.5 text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                                      <Sparkles className="w-2.5 h-2.5 text-amber-500 flex-shrink-0" />
                                      <span>Save ₹{(savingsPerUnit * itemQty).toLocaleString("en-IN")} on {itemQty}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Stepper + Compact Light Green Add Button */}
                              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-2">
                                {/* Quantity Stepper */}
                                <div className="h-8 inline-flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5 flex-shrink-0 shadow-2xs">
                                  <button
                                    type="button"
                                    onClick={() => handlePairQtyChange(rel.slug, itemQty - 1)}
                                    disabled={itemQty <= 1}
                                    className="w-6 h-6 rounded-md flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold cursor-pointer"
                                    title="Decrease quantity by 1"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={itemQty}
                                    onChange={(e) => {
                                      const cleaned = e.target.value.replace(/\D/g, "");
                                      handlePairQtyChange(rel.slug, cleaned);
                                    }}
                                    className="w-8 text-center text-xs font-bold text-slate-800 bg-transparent outline-none select-all"
                                    aria-label="Quantity"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handlePairQtyChange(rel.slug, itemQty + 1)}
                                    className="w-6 h-6 rounded-md flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 transition-all font-bold cursor-pointer"
                                    title="Increase quantity by 1"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>

                                {/* Compact Light Green ADD Button */}
                                <button
                                  type="button"
                                  onClick={() => handleAddPairToQuote(rel)}
                                  className={`h-8 flex-1 px-2.5 rounded-lg text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] cursor-pointer whitespace-nowrap ${isItemAdded
                                    ? "bg-brand-500 text-white ring-2 ring-brand-300 shadow-xs"
                                    : "bg-brand-600 hover:bg-brand-500 text-white hover:shadow-xs"
                                    }`}
                                >
                                  {isItemAdded ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                                      <span>Added ({itemQty})</span>
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                                      <span>Add {itemQty} (+5% Off)</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
                      <p className="text-xs font-semibold text-slate-600">No suggestions right now</p>
                    </div>
                  )}
                </div>

                {/* Step 1 Footer: Navigate to Step 2 (Branding) */}
                <div
                  className="flex-shrink-0 px-5 py-3 border-t border-slate-100 space-y-2.5"
                  style={{ background: "#f8fafc" }}
                >
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setModalStep(2)}
                      className="py-2.5 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      Skip to Branding
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalStep(2)}
                      className="py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-sm bg-brand-600 hover:bg-brand-500 transition-all cursor-pointer"
                    >
                      <span>Next: Branding Options</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── STEP 2: BRANDING & CUSTOMIZATION OPTIONS ── */}
            {modalStep === 2 && (
              <>
                <div className="overflow-y-auto flex-1 px-5 py-2 space-y-3.5">
                  {/* Tier Allowance Banner */}
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${activeTierObj.tierNumber === 1
                      ? "bg-amber-50/80 border-amber-200 text-amber-900"
                      : activeTierObj.tierNumber === 2
                        ? "bg-brand-50/80 border-brand-200 text-brand-900"
                        : "bg-emerald-50 border-emerald-300 text-emerald-950"
                      }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Sparkles className="w-4 h-4 flex-shrink-0 text-brand-600" />
                      <span className="font-medium text-[11px] leading-tight">
                        {activeTierObj.tierNumber === 1 && (
                          <>
                            <strong>Tier 1:</strong> Select any <strong>2 of 5</strong> complimentary customizations.
                          </>
                        )}
                        {activeTierObj.tierNumber === 2 && (
                          <>
                            <strong>Tier 2:</strong> Select any <strong>3 of 5</strong> complimentary customizations.
                          </>
                        )}
                        {activeTierObj.tierNumber >= 3 && (
                          <>
                            <strong>Tier 3:</strong> All <strong>5 of 5</strong> customizations complimentary!
                          </>
                        )}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full flex-shrink-0 ${selectedCustomizations.length === maxCustomizations
                        ? "bg-brand-600 text-white shadow-xs"
                        : "bg-white border border-slate-200 text-slate-700"
                        }`}
                    >
                      {selectedCustomizations.length}/{maxCustomizations} Selected
                    </span>
                  </div>

                  {/* Customization Options Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentCustomizations.map((opt) => {
                      const isSelected = selectedCustomizations.includes(opt.id);
                      const OptIcon = opt.icon;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleToggleCustomization(opt.id)}
                          className={`w-full text-left p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-center gap-3 group ${isSelected
                            ? "border-brand-500 shadow-sm"
                            : "border-slate-200 hover:border-brand-300"
                            }`}
                          style={{ background: isSelected ? "#f0fdf4" : "#f8fafc" }}
                        >
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${isSelected
                              ? "bg-brand-600 text-white"
                              : "border-2 border-slate-300 bg-white group-hover:border-brand-400"
                              }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div
                            className={`w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0 ${isSelected
                              ? "bg-white border-brand-200 text-brand-600"
                              : "bg-white border-slate-200 text-slate-400 group-hover:text-brand-600"
                              }`}
                          >
                            <OptIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-slate-900">
                                {opt.name}
                              </span>
                              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
                                {opt.tag}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                              {opt.desc}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            {isSelected ? (
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-1 rounded-full flex items-center gap-1">
                                <Check className="w-3 h-3 stroke-[3]" />
                                Included
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 group-hover:text-brand-700 px-2 py-1 rounded-full border border-transparent group-hover:border-brand-200 group-hover:bg-brand-50 transition-all">
                                Select
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Branding notes */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-brand-600" /> Branding Notes (Optional)
                    </label>
                    <textarea
                      value={brandingNotes}
                      onChange={(e) => setBrandingNotes(e.target.value)}
                      rows={2}
                      placeholder="E.g. 'Logo file will be emailed — please center on front lid.'"
                      className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 focus:bg-white placeholder:text-slate-400 transition-all"
                    />
                  </div>
                </div>

                {/* Step 2 Footer: Save & Proceed */}
                <div
                  className="flex-shrink-0 px-5 py-3 border-t border-slate-100 space-y-2.5"
                  style={{ background: "#f8fafc" }}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-brand-600" />
                      <strong className="text-slate-700">Lead Time:</strong> {activeOccasion.leadTime || "5–7 Days"}
                    </span>
                    <span className="font-extrabold text-slate-900">
                      Total: ₹{estimatedSubtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setModalStep(1)}
                      className="py-2.5 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>← Back to Bundles</span>
                    </button>
                    <Link
                      href="/quote"
                      onClick={handleSaveCustomizations}
                      className="py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-sm bg-brand-600 hover:bg-brand-500 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Review Basket &amp; Quote</span>
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
        @keyframes gfModalBackdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes gfModalBox {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(16px);
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
