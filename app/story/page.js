import Link from "next/link";
import { Sprout, ShieldCheck, Leaf, Wind, Recycle, CheckCircle2, Factory, HeartHandshake, ArrowRight, Award } from "lucide-react";

export const metadata = {
  title: "Our Story & Sustainable Manufacturing",
  description:
    "Learn how Green Fibre partners with northern Indian farmers to upcycle agricultural rice stubble into durable, certified food-safe tableware and premium corporate gifts."
};

export default function StoryPage() {
  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-12">
      {/* Clean Bright Hero Banner - No Dark Overlay */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-brand-50/50 border border-brand-200/80 rounded-3xl p-6 sm:p-10 lg:p-12">
          <div className="lg:col-span-6 space-y-5">
            <div className="badge-green inline-flex items-center gap-2">
              <Sprout className="w-4 h-4 text-brand-700" />
              <span>Our Roots & Mission</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              From Stubble Smoke to Sustainable Workplaces
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal">
              Every autumn across northern India, millions of tonnes of post-harvest crop stubble are burned in open fields, creating thick smog. We built Green Fibre to turn that agricultural biomass into beautiful, durable tableware for enterprises that care.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href="/products" className="btn-primary text-xs sm:text-sm py-2.5 px-5">
                Explore Our Products →
              </Link>
              <Link href="/quote" className="btn-secondary text-xs sm:text-sm py-2.5 px-5">
                Request Corporate Quote
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden shadow-sm aspect-[16/10] bg-slate-100 border border-brand-200">
              <img
                src="/images/green-farmland.jpg"
                alt="Lush organic farm fields under blue sky"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Challenge & The Solution */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6">
            <div className="badge-green">
              The Agricultural Transformation
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              A Direct Bridge Between Regional Farmers and Corporate Dining
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              In Haryana and Punjab, rice farmers face narrow harvesting windows. Without affordable clearing alternatives, crop stubble was historically set on fire. Green Fibre establishes direct biomass aggregation centres, providing farmers with fair supplementary income while collecting stubble before it burns.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Direct Farmer Partnerships</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Over 2,400+ farming families supported with fair per-ton biomass procurement and machinery subsidies.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Zero-Smoke Clean Air Impact</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Over 1,200 metric tonnes of crop stubble diverted annually, saving thousands of tonnes of CO2 emissions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Certified Food Contact Safety</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Rigorous US FDA 21 CFR and LFGB compliance. 100% BPA-free, melamine-free, and dishwasher certified for 500+ commercial cycles.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-sm aspect-[4/5] bg-slate-100">
                <img
                  src="/images/green-paddy.jpg"
                  alt="Organic paddy farm"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200">
                <div className="text-2xl font-extrabold text-brand-800">65%</div>
                <div className="text-xs text-slate-600 mt-0.5">Natural Upcycled Biomass</div>
              </div>
            </div>
            <div className="space-y-4 pt-6">
              <div className="p-4 rounded-2xl bg-slate-900 text-white">
                <div className="text-2xl font-extrabold text-brand-400">100%</div>
                <div className="text-xs text-slate-300 mt-0.5">Food Contact Safe & BPA Free</div>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-sm aspect-[4/5] bg-slate-100">
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

      {/* Manufacturing Standards & In-House Workshop */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-8 sm:p-12 lg:p-14 space-y-10">
          <div className="max-w-3xl space-y-3">
            <div className="badge-green">
              Precision Engineering & Quality
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Inside Our Sonipat Manufacturing Facility
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Located in HSIIDC Rai, Sonipat, our facility houses proprietary biomass pulverization, high-temperature thermocompression molding, optical fiber laser engraving lines, and FSC-certified packaging wrap units.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                <Factory className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">High-Precision Molding</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Precision CNC tooling ensures seamless edges, airtight seal grooves, and uniform matte tactile grip on every single piece.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Laser Customization Lab</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                In-house optical fiber lasers engrave sharp micrometric vector logos and personalized recipient names without chemical inks or labels.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                <Recycle className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Zero Factory Landfill</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                100% of trimming scrap is reground into subsequent industrial batches, achieving zero factory landfill output.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Call to Action */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-600 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Upgrade Your Corporate Gifting & Tableware?
            </h3>
            <p className="text-xs sm:text-sm text-brand-100 max-w-xl">
              Get an official quotation with volume price tiers, custom logo mockups in 4 hours, and sample kits dispatched within 48 hours.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/products"
              className="px-5 py-3 rounded-lg bg-white text-brand-800 font-bold text-xs sm:text-sm hover:bg-brand-50 transition-colors"
            >
              Browse Catalog
            </Link>
            <Link
              href="/quote"
              className="px-5 py-3 rounded-lg bg-brand-700 text-white font-bold text-xs sm:text-sm hover:bg-brand-800 border border-brand-500 transition-colors"
            >
              Request Quote →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
