import Link from "next/link";
import {
  Sprout,
  ShieldCheck,
  Leaf,
  Wind,
  Recycle,
  CheckCircle2,
  HeartHandshake,
  Users,
  Award,
  TreePine,
  Sparkles,
  Droplets,
  PackageCheck,
  Truck,
  ArrowRight,
  Check,
  Globe2,
  Mail
} from "lucide-react";

export const metadata = {
  title: "Our Story • Engineering Green Products From Rice Husk | Green Fibre",
  description:
    "Green Fibre blends agricultural rice husk with recyclable polymers to replace virgin plastic, prevent stubble burning, and craft durable everyday essentials for modern homes."
};

const stats = [
  { value: "100k+", label: "Happy Customers", icon: Users },
  { value: "500+", label: "Eco Products", icon: Sparkles },
  { value: "250k+", label: "Trees Planted", icon: TreePine },
  { value: "100%", label: "Carbon Neutral", icon: Globe2 }
];

const values = [
  {
    icon: Leaf,
    title: "100% Sustainable",
    description:
      "Every product we offer is carefully selected to minimize environmental impact and promote sustainable living."
  },
  {
    icon: HeartHandshake,
    title: "Ethically Sourced",
    description:
      "We partner with suppliers who share our commitment to fair trade, ethical labor practices, and environmental responsibility."
  },
  {
    icon: Users,
    title: "Community Focused",
    description:
      "We believe in building a community of conscious consumers who care about the planet and future generations."
  },
  {
    icon: Award,
    title: "Quality First",
    description:
      "Sustainability never compromises quality. We ensure every product meets our high standards for durability and performance."
  }
];

const journeyMilestones = [
  {
    year: "2020",
    title: "The Beginning",
    description:
      "Green Fibre was founded with a simple mission: make sustainable living accessible to everyone."
  },
  {
    year: "2021",
    title: "Growing Impact",
    description:
      "Reached 10,000+ customers and planted our first 50,000 trees through our reforestation program."
  },
  {
    year: "2022",
    title: "Carbon Neutral",
    description:
      "Achieved carbon-neutral operations across our entire supply chain and delivery network."
  },
  {
    year: "2023",
    title: "Expansion",
    description:
      "Expanded our product line to 500+ eco-friendly items and launched our zero-waste initiative."
  },
  {
    year: "2024",
    title: "Community of 100k+",
    description:
      "Built a thriving community of conscious consumers making sustainable choices every day."
  }
];

const initiatives = [
  {
    icon: Sprout,
    title: "Rice Husk Agricultural Upcycling",
    description:
      "Every harvest, millions of tons of rice husk (the hard protective hull of rice grains) are burned in fields, polluting our air with smog. We rescue this agricultural byproduct and blend it with recyclable polymers to reduce virgin plastic usage by 40%+ while creating stronger, heat-resistant homeware.",
    highlight: "Replaces 40%+ virgin plastic & prevents crop stubble burning"
  },
  {
    icon: TreePine,
    title: "Reforestation Program",
    description:
      "For every order placed, we plant one tree in partnership with environmental organizations across India. Our goal is to plant 1 million trees by 2025.",
    highlight: "250,000 trees planted since 2020"
  },
  {
    icon: PackageCheck,
    title: "Zero-Waste Packaging",
    description:
      "All our packaging is made from 100% recycled and biodegradable materials. We've eliminated plastic completely and use plant-based inks for printing.",
    highlight: "500+ tons of plastic avoided"
  },
  {
    icon: Truck,
    title: "Carbon-Neutral Delivery",
    description:
      "We partner with eco-conscious courier services and offset 100% of carbon emissions from shipping through verified carbon credit programs.",
    highlight: "10,000 tons CO₂ offset annually"
  },
  {
    icon: Droplets,
    title: "Water Conservation",
    description:
      "Our products are sourced from manufacturers using water-efficient processes. We prioritize suppliers who implement water recycling systems.",
    highlight: "50M+ liters of water saved"
  },
  {
    icon: Recycle,
    title: "Circular Economy",
    description:
      "We encourage product returns for recycling and upcycling. Items that can't be resold are broken down and repurposed responsibly.",
    highlight: "95% waste diversion rate"
  }
];

const certifications = [
  "Carbon Neutral Certified",
  "Plastic Free",
  "Ethical Trade",
  "100% Sustainable"
];

const commitmentsList = [
  "Source 100% of products from sustainable and ethical suppliers",
  "Maintain carbon-neutral operations across our entire supply chain",
  "Use only biodegradable and recyclable packaging materials",
  "Plant one tree for every order placed on our platform",
  "Achieve zero-waste operations by 2025",
  "Support local communities through fair trade partnerships",
  "Educate 100,000 people about sustainable living by 2025",
  "Offset 100% of shipping emissions through verified programs"
];

export default function StoryPage() {
  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-12 bg-white">
      {/* ── 1. Hero Section ──────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-gradient-to-br from-[#ebf7ee] via-[#f4faf5] to-[#f0fdf4] border border-[#cbebd4] rounded-3xl p-6 sm:p-10 lg:p-14 shadow-xs">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 bg-[#dcfce7] border border-[#86efac] text-[#14532d] px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-wide uppercase shadow-2xs">
              <Sprout className="w-3.5 h-3.5 text-[#15803d]" />
              <span>Our Story</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f3428] tracking-tight leading-[1.15]">
              Engineering Green Products From Rice Husk
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
              Green Fibre is a green material innovation brand. We blend agricultural rice husk with recyclable polymers to replace virgin plastic, prevent stubble burning, and craft stronger, high-durability everyday essentials for modern homes.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/products"
                className="bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow hover:-translate-y-0.5 active:scale-95 inline-flex items-center gap-2"
              >
                <span>Shop Sustainable</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/quote"
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-2xs hover:border-slate-400 active:scale-95"
              >
                Get in Touch
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden shadow-md aspect-[4/3] bg-slate-100 border border-[#bbf7d0] relative">
              <img
                src="/images/green-farmland.jpg"
                alt="Green Fibre - Sustainable Living"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/40 shadow-xs flex items-center justify-between text-xs">
                <span className="font-bold text-[#0f3428]">Natural Rice Husk Composite</span>
                <span className="text-[#15803d] font-extrabold text-[11px] bg-[#dcfce7] px-2 py-0.5 rounded-md">100% Upcycled</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Stats Bar ─────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((st) => {
            const IconComp = st.icon;
            return (
              <div
                key={st.label}
                className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-5 sm:p-6 text-center space-y-2 hover:border-[#86efac] hover:shadow-xs transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-[#bbf7d0] text-[#15803d] flex items-center justify-center mx-auto shadow-2xs">
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0f3428] tracking-tight font-mono">
                  {st.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-600">
                  {st.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 3. The Story: Dilemma to Innovation ─────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#dcfce7] border border-[#86efac] text-[#14532d] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <span>Origin & Purpose</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f3428] tracking-tight leading-tight">
              Our Story
            </h2>

            <div className="space-y-4 text-xs sm:text-sm md:text-[15px] text-slate-600 leading-relaxed">
              <p>
                Green Fibre was founded to solve a critical environmental dilemma: every harvest season, millions of metric tons of agricultural rice husk (the outer hull of rice grains) are burned in fields as farm waste, generating toxic smoke and severe air pollution. At the same time, our landfills are choked with non-biodegradable virgin plastics.
              </p>

              <div className="border-l-4 border-[#15803d] pl-4 py-2 my-4 bg-[#f0fdf4] rounded-r-xl">
                <p className="font-bold text-[#0f3428] text-sm sm:text-base italic">
                  &ldquo;Why treat agricultural biomass as waste when it can replace plastic?&rdquo;
                </p>
              </div>

              <p>
                By engineering an advanced compounding process, we blend pulverized rice husk fibers with durable, recyclable polymers. The resulting bio-composite delivers the best of both worlds: it significantly reduces virgin petroleum plastics, prevents crop burning, and creates homeware, planters, drinkware, and containers with higher structural rigidity, superior drop resistance, and an authentic natural speckled texture.
              </p>

              <p className="font-medium text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200">
                We are not a clothing or textile brand. We are an eco-materials company crafting long-lasting, food-safe, and sustainable lifestyle essentials that make daily green living effortless and beautiful.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-xs aspect-[4/5] bg-slate-100 border border-slate-200">
                <img
                  src="/images/green-paddy.jpg"
                  alt="Organic paddy farm"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 rounded-2xl bg-[#ebf7ee] border border-[#cbebd4] text-center">
                <div className="text-2xl font-black text-[#15803d]">40%+</div>
                <div className="text-[11px] font-semibold text-slate-600 mt-0.5">Virgin Plastic Avoided</div>
              </div>
            </div>
            <div className="space-y-4 pt-6">
              <div className="p-4 rounded-2xl bg-[#0f3428] text-white text-center">
                <div className="text-2xl font-black text-emerald-400">100%</div>
                <div className="text-[11px] font-medium text-emerald-100 mt-0.5">Food-Safe & BPA-Free</div>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xs aspect-[4/5] bg-slate-100 border border-slate-200">
                <img
                  src="/images/green-dining-nature.jpg"
                  alt="Sustainable dining tableware"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Our Values ────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#f0fdf4]/70 border border-[#bbf7d0] rounded-3xl p-8 sm:p-12 lg:p-14 space-y-10">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#dcfce7] border border-[#86efac] text-[#14532d] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <span>Guiding Principles</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f3428] tracking-tight">
              Our Values
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              These principles guide everything we do, from product selection to customer service.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => {
              const IconComp = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-white p-6 rounded-2xl border border-[#cbebd4] shadow-2xs hover:shadow-sm hover:border-[#86efac] transition-all duration-200 space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#ebf7ee] border border-[#cbebd4] text-[#15803d] flex items-center justify-center font-bold">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{v.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. Our Mission & Commitments ──────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 bg-[#dcfce7] border border-[#86efac] text-[#14532d] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <span>Our Mission</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f3428] tracking-tight leading-tight">
              Making Sustainability Accessible to All
            </h2>

            <div className="space-y-4 text-xs sm:text-sm md:text-[15px] text-slate-600 leading-relaxed">
              <p>
                Our mission is simple yet ambitious: make sustainable living the default choice, not the alternative. We believe everyone deserves access to products that are good for them and good for the planet.
              </p>
              <p>
                We&apos;re committed to breaking down the barriers—cost, convenience, and awareness—that prevent people from making eco-friendly choices. Through education, innovation, and community building, we&apos;re creating a world where sustainability is accessible, affordable, and aspirational.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[#ebf7ee] border border-[#cbebd4] rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xs">
              <div className="flex items-center gap-2 text-[#15803d]">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-base font-extrabold text-[#0f3428]">Our Commitment</h3>
              </div>

              <ul className="space-y-3">
                {[
                  "Plant one tree for every order placed",
                  "Use 100% recyclable and biodegradable packaging",
                  "Maintain carbon-neutral operations and delivery",
                  "Partner only with ethical and sustainable suppliers"
                ].map((c) => (
                  <li key={c} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                    <span className="w-5 h-5 rounded-full bg-[#15803d] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Our Journey (Milestones Timeline) ─────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#dcfce7] border border-[#86efac] text-[#14532d] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <span>Evolution</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f3428] tracking-tight">
              Our Journey
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              From a small startup to a thriving sustainable marketplace.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 pt-4">
            {journeyMilestones.map((m) => (
              <div
                key={m.year}
                className="relative bg-white border border-[#cbebd4] rounded-2xl p-5 sm:p-6 space-y-3 shadow-2xs hover:border-[#86efac] hover:shadow-xs transition-all duration-200"
              >
                <div className="inline-block px-3 py-1 bg-[#15803d] text-white text-xs font-mono font-black rounded-lg shadow-2xs">
                  {m.year}
                </div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">{m.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Key Sustainability Initiatives (6 Pillars) ───────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#dcfce7] border border-[#86efac] text-[#14532d] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <span>Impact in Action</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f3428] tracking-tight">
              Sustainability Initiatives
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Measurable ecological actions driven by circular bio-composite innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initiatives.map((init) => {
              const IconComp = init.icon;
              return (
                <div
                  key={init.title}
                  className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs hover:border-[#86efac] hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#ebf7ee] border border-[#cbebd4] text-[#15803d] flex items-center justify-center font-bold">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{init.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{init.description}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#15803d] bg-[#f0fdf4] px-3 py-1 rounded-lg border border-[#bbf7d0]">
                      <Sparkles className="w-3 h-3 text-[#15803d]" />
                      {init.highlight}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 8. Certifications ────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#ebf7ee] border border-[#cbebd4] rounded-3xl p-8 sm:p-10 text-center space-y-6">
          <div className="max-w-xl mx-auto space-y-1">
            <h3 className="text-2xl font-extrabold text-[#0f3428] tracking-tight">
              Our Certifications
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Verified commitments to sustainability and ethical practices.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {certifications.map((cert) => (
              <div
                key={cert}
                className="inline-flex items-center gap-2 bg-white border border-[#bbf7d0] px-4 py-2.5 rounded-xl shadow-2xs text-xs sm:text-sm font-bold text-[#0f3428]"
              >
                <span className="w-5 h-5 rounded-full bg-[#15803d] text-white flex items-center justify-center text-[10px]">
                  ✓
                </span>
                <span>{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Commitments Accountability Grid ───────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#dcfce7] border border-[#86efac] text-[#14532d] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <span>Accountability</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f3428] tracking-tight">
              Our Commitments
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We hold ourselves accountable to the highest standards of environmental and social responsibility. These are the promises we make to our planet and community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {commitmentsList.map((comm) => (
              <div
                key={comm}
                className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3.5"
              >
                <div className="w-5 h-5 rounded-full bg-[#15803d] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 shadow-2xs">
                  ✓
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
                  {comm}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. Join & Final Call to Action ──────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-white border border-slate-200/90 hover:border-emerald-300/80 rounded-3xl py-16 sm:py-24 lg:py-28 px-6 sm:px-12 lg:px-16 text-center shadow-[0_4px_30px_rgba(0,0,0,0.05)] transition-all flex flex-col items-center justify-center min-h-[440px] sm:min-h-[500px]">
          {/* Top Emerald Brand Accent Bar */}
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-400 via-brand-600 to-emerald-400" />

          {/* Subtle Background Glow Spheres */}
          <div className="absolute left-1/2 -top-32 -translate-x-1/2 w-[500px] h-64 bg-emerald-50/70 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/2 -bottom-32 -translate-x-1/2 w-[500px] h-64 bg-slate-50/80 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6 sm:space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-2xs">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Make a Positive Impact</span>
            </div>

            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
              Join Our Sustainable Journey
            </h3>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Be part of a growing community making a positive impact on the planet—replacing single-use plastics with certified agricultural rice-husk homeware and corporate gifts.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
              <Link
                href="/products"
                className="w-full sm:w-auto h-13 sm:h-14 px-8 bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm sm:text-base rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:scale-95 inline-flex items-center justify-center gap-2.5"
              >
                <span>Start Shopping Catalog</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </Link>
              <Link
                href="/quote"
                className="w-full sm:w-auto h-13 sm:h-14 px-8 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-sm sm:text-base rounded-2xl border border-slate-200 hover:border-slate-300 transition-all duration-200 active:scale-95 inline-flex items-center justify-center gap-2.5"
              >
                <Mail className="w-4.5 h-4.5 text-slate-500" />
                <span>Contact Us</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 pt-5 text-xs sm:text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                FDA &amp; LFGB Food-Safe
              </span>
              <span className="flex items-center gap-2">
                <Recycle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                100% Agricultural Husk
              </span>
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                Pan-India Delivery
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
