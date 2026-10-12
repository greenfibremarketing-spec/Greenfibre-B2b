// Single source of truth for Green Fibre B2B product categories

export const categories = [
  {
    slug: "drinkware",
    name: "Drinkware",
    h1: "Sustainable Drinkware, Coffee Mugs & Reusable Bottles",
    metaTitle: "Wholesale Sustainable Drinkware & Custom Branded Bottles | Green Fibre B2B",
    metaDescription: "Source wholesale eco-friendly drinkware, insulated coffee mugs, and reusable water bottles made from upcycled rice-husk biocomposite. Bulk pricing with custom laser logo engraving.",
    intro: "Our eco-friendly drinkware collection is precision-molded from agricultural rice-husk biocomposite, delivering lightweight durability and natural thermal insulation for everyday use. Designed for corporate pantries, executive gifting, and daily commutes, each cup, tumbler, and water bottle is 100% BPA-free, non-toxic, and certified food-safe. Enhance your brand identity with in-house permanent laser branding and bulk delivery across India."
  },
  {
    slug: "gift-boxes-hampers",
    name: "Gift Boxes & Hampers",
    h1: "Sustainable Corporate Gift Boxes & Curated Eco Hampers",
    metaTitle: "Corporate Gift Sets & Eco Hampers Wholesale | Green Fibre B2B",
    metaDescription: "Order premium eco-friendly gift hampers and sustainable corporate gift sets in bulk. Custom laser engraved homeware packaged in luxury FSC-certified presentation boxes.",
    intro: "Green Fibre corporate gift sets bring together thoughtfully curated sustainable homeware essentials in premium plastic-free presentation boxes. Crafted entirely from upcycled agricultural stubble and biodegradable materials, each hamper creates an impactful unboxing experience while diverting farm waste from crop burning. Ideal for employee welcome kits, festive corporate gifting, and annual stakeholder summits with bespoke belly bands and custom logo engraving."
  },
  {
    slug: "kitchen-dining",
    name: "Kitchen & Dining",
    h1: "Commercial-Grade Eco Kitchenware & Dining Essentials",
    metaTitle: "Wholesale Kitchenware & Sustainable Dining Sets | Green Fibre B2B",
    metaDescription: "Explore durable rice-husk kitchenware, serving bowls, and microwave-safe dinner sets for hospitality and cafeteria bulk orders with volume manufacturer pricing.",
    intro: "Engineered to withstand the demanding requirements of commercial cafeterias, catering services, and hospitality venues, our kitchen and dining collection offers a durable, food-safe alternative to single-use plastics and breakable ceramics. Each bowl, casserole, and dining accessory is molded from BioDur rice-husk composite for superior thermal and impact resistance. Dishwasher safe, microwave safe, and completely non-leaching for daily commercial food service."
  },
  {
    slug: "tableware",
    name: "Tableware",
    h1: "Upcycled Agricultural Tableware & Dining Accessories",
    metaTitle: "Bulk Sustainable Tableware & Eco Dining Products | Green Fibre B2B",
    metaDescription: "Order bulk eco-friendly tableware and stylish dining accessories made from crop stubble biocomposite. High-volume direct manufacturer discounts for businesses.",
    intro: "Transform corporate meeting rooms, dining halls, and hospitality tables with minimalist eco-tableware crafted from upcycled rice husk stubble. Combining refined organic textures with long-lasting structural strength, our tableware pieces are naturally resistant to grease, odor absorption, and staining. Designed for circular economy corporate operations, they help enterprises reduce their operational carbon footprint without sacrificing aesthetics."
  },
  {
    slug: "storage-organizers",
    name: "Storage & Organizers",
    h1: "Sustainable Food Canisters & Desk Organizers",
    metaTitle: "Eco Storage Containers & Desk Organizers Wholesale | Green Fibre B2B",
    metaDescription: "Buy sustainable airtight storage canisters and modular desk organizers in bulk. Durable crop-fiber biocomposites with custom laser etching options.",
    intro: "Keep pantries, corporate workstations, and hospitality suites immaculately arranged with our modular biocomposite storage containers and organizers. Fitted with airtight seals to keep dry snacks and pantry items fresh, these durable organizers replace conventional petrochemical plastics with renewable crop fiber. Their clean Scandinavian-inspired design and customizable surfaces make them versatile assets for modern workplaces."
  },
  {
    slug: "home-living",
    name: "Home & Living",
    h1: "Eco-Conscious Home Decor, Planters & Living Accents",
    metaTitle: "Sustainable Home & Living Products Wholesale | Green Fibre B2B",
    metaDescription: "Explore upcycled rice-husk tabletop planters and green home accents for corporate gifting and eco interiors. Direct factory wholesale pricing.",
    intro: "Infuse corporate interiors, reception lounges, and home offices with natural greenery using our lightweight biocomposite tabletop planters and lifestyle accents. Each piece repurposes agricultural crop residue, transforming environmental pollutants into elegant, weather-resistant living accessories. A memorable green gift for sustainability awards, client milestones, and office greening initiatives."
  }
];

export function getCategoryBySlug(slug) {
  if (!slug) return null;
  const clean = slug.toLowerCase().trim();
  return categories.find((c) => c.slug === clean) || null;
}

export function getCategoryByName(name) {
  if (!name) return null;
  const clean = name.toLowerCase().trim();
  return categories.find((c) => c.name.toLowerCase() === clean) || null;
}

// Map any legacy or inconsistent category query value to the official slug
export function resolveCategorySlug(queryVal) {
  if (!queryVal) return null;
  const lower = decodeURIComponent(queryVal).toLowerCase().trim();

  // 1. Direct slug match
  const direct = categories.find((c) => c.slug === lower);
  if (direct) return direct.slug;

  // 2. Direct name match
  const byName = categories.find((c) => c.name.toLowerCase() === lower);
  if (byName) return byName.slug;

  // 3. Normalized keyword heuristics for legacy URLs
  if (lower.includes("gift") || lower.includes("hamper") || lower.includes("box")) {
    return "gift-boxes-hampers";
  }
  if (lower.includes("drink") || lower.includes("bottle") || lower.includes("mug") || lower.includes("tumbler")) {
    return "drinkware";
  }
  if (lower.includes("kitch") || lower.includes("dining")) {
    return "kitchen-dining";
  }
  if (lower.includes("table")) {
    return "tableware";
  }
  if (lower.includes("stor") || lower.includes("organ") || lower.includes("basket") || lower.includes("cadd")) {
    return "storage-organizers";
  }
  if (lower.includes("home") || lower.includes("living") || lower.includes("plant")) {
    return "home-living";
  }

  return null;
}
