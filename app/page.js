import Link from "next/link";
import Card from "@/components/Card";
import GreeneryShowcase from "@/components/GreeneryShowcase";
import HeroSwiper from "@/components/HeroSwiper";
import BottleModelViewer from "@/components/BottleModelViewer";
import { categories, getProducts } from "@/lib/products";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  const allProducts = await getProducts();
  const featuredProducts = allProducts.slice(0, 8);

  return (
    <div className="bg-slate-100 space-y-8 sm:space-y-10 pb-12 overflow-x-hidden w-full max-w-full">
      {/* Full Width Hero Swiper */}
      <section className="w-full max-w-full overflow-hidden max-h-[96vh]">
        <HeroSwiper />
      </section>

      {/* Featured Products Catalog */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <div className="badge-green mb-1.5 sm:mb-2">
              Wholesale Catalog
            </div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Featured Products for Bulk Orders
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 active:scale-95 flex-shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5 sm:mb-6 no-scrollbar touch-pan-x">
          <Link
            href="/products"
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#15803d] text-white hover:bg-[#166534] whitespace-nowrap shadow-2xs transition-all duration-150 active:scale-95 flex-shrink-0"
          >
            All Products
          </Link>
          {categories
            .filter((c) => c !== "All Products")
            .map((c) => (
              <Link
                key={c}
                href={`/products?category=${encodeURIComponent(c)}`}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:border-brand-500 hover:text-brand-800 hover:bg-brand-50 whitespace-nowrap shadow-2xs transition-all duration-150 hover:-translate-y-0.5 active:scale-95 flex-shrink-0"
              >
                {c}
              </Link>
            ))}
        </div>

        {/* Products Grid */}
        {featuredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
              {featuredProducts.map((p) => (
                <Card key={p.slug} p={p} />
              ))}
            </div>

            {/* Bottom View All Button */}
            <div className="mt-6 sm:mt-8 flex justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-brand-500 text-slate-900 hover:text-brand-800 text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:scale-98"
              >
                <span>Explore Full Catalog ({allProducts.length} Products)</span>
                <ArrowRight className="w-4 h-4 text-brand-700" />
              </Link>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-3 flex flex-col items-center">
            <p className="text-sm font-semibold text-slate-700">No products in catalog yet</p>
            <p className="text-xs text-slate-500 max-w-sm">
              Products added to your inventory or database will appear here automatically.
            </p>
          </div>
        )}
      </section>

      {/* Lush Greenery & Sustainability Showcase Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <GreeneryShowcase />
      </section>

      {/* 3D Interactive Bottle & Laser Workshop Showcase - 3-Column Centerpiece Layout */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10" id="branding">
        {/* Section Header */}
        <div className="text-left max-w-3xl mb-8 sm:mb-10 space-y-1.5 sm:space-y-2">
          <h2 className="section-title">
            Eco Bottle Engineering &amp; Custom Corporate Branding
          </h2>
          <p className="section-desc">
            Explore our rice-husk thermal bottle in 3D. We handle permanent laser engraving in-house for crisp detail, zero chemical inks, and fast turnaround.
          </p>
        </div>

        {/* 3-Column Grid: Points Left - Center 3D Model - Points Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Material & Insulation Specs */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brand-400 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center border border-brand-200">
                  01
                </span>
                <h4 className="text-sm font-bold text-slate-900">Upcycled Rice Husk Shell</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                65% natural agricultural crop stubble composite diverts open-field burning and replaces single-use plastics.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brand-400 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center border border-brand-200">
                  02
                </span>
                <h4 className="text-sm font-bold text-slate-900">Double-Wall Thermal Insulation</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Maintains beverage heat for 4+ hours and keeps cold drinks chilled for 8+ hours with zero exterior condensation.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brand-400 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center border border-brand-200">
                  03
                </span>
                <h4 className="text-sm font-bold text-slate-900">100% Food-Safe & BPA-Free</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                US FDA 21 CFR and LFGB certified. Odor-resistant, non-leaching, and safe for hot tea, coffee, and water.
              </p>
            </div>
          </div>

          {/* Center Column: Interactive 3D GLB Model Viewer */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <BottleModelViewer
              src="https://res.cloudinary.com/dsebrpcyz/image/upload/v1789734715/bottle_xg3utw.glb"
              poster="https://res.cloudinary.com/dsebrpcyz/image/upload/v1789543040/06_last_pic_gqoc0e.png"
            />
          </div>

          {/* Right Column: Laser Branding & Packaging */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brand-400 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center border border-brand-200">
                  04
                </span>
                <h4 className="text-sm font-bold text-slate-900">360° Fiber Laser Etching</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Permanent micrometric corporate logos and personalized employee names that never peel or wash off.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brand-400 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center border border-brand-200">
                  05
                </span>
                <h4 className="text-sm font-bold text-slate-900">Leak-Proof Cap & Jute Loop</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Precision threaded airtight silicone seal with durable natural jute carrying strap for daily commutes.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brand-400 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center border border-brand-200">
                  06
                </span>
                <h4 className="text-sm font-bold text-slate-900">Custom Packaging & 4h Proof</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Recycled FSC kraft gift box with debossed wrap. Free 3D visual proof in 4 hours and Pan-India dispatch.
              </p>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}