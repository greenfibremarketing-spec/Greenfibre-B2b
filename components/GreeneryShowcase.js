import { Sprout, ShieldCheck, Leaf, Wind, Recycle } from "lucide-react";

export default function GreeneryShowcase() {
  return (
    <div className="space-y-6 py-2 sm:py-4">
      {/* Header */}
      <div className="text-left max-w-3xl space-y-1.5 sm:space-y-2.5">
        <div className="badge-green">
          <Sprout className="w-3.5 h-3.5 text-brand-700" />
          <span>Nurturing Our Planet &amp; Clean Skies</span>
        </div>
        <h2 className="section-title">
          From Lush Green Fields to Sustainable Workplaces
        </h2>
        <p className="section-desc">
          Instead of allowing post-harvest crop stubble to be burned into harmful smoke, we partner with regional farmers to upcycle natural rice husk into durable, food-safe dining and drinkware—keeping our skies clean and nature flourishing.
        </p>
      </div>

      {/* Visual Showcase: 2 Rich Green Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left Card: The Green Countryside & Clean Air */}
        <div className="bg-white border border-brand-200/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-card-hover hover:border-brand-400/80 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
            <img
              src="/images/green-paddy.jpg"
              alt="Lush green organic rice paddy fields under clean sunlight"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute top-3 left-3 bg-brand-700/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5" />
              <span>Zero-Burn Agriculture</span>
            </div>
          </div>
          <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Preserving Fresh Air &amp; Green Farmlands
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                By procuring agricultural biomass directly from farmers in Haryana and Punjab, every single Green Fibre order helps prevent seasonal crop burning and reduces toxic smoke across northern India.
              </p>
            </div>
          </div>
        </div>

        {/* Right Card: Green Dining & Botanical Living */}
        <div className="bg-white border border-brand-200/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-card-hover hover:border-brand-400/80 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
            <img
              src="/images/green-tableware-plants.jpg"
              alt="Eco-friendly tableware surrounded by fresh green botanical plants"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute top-3 left-3 bg-brand-700/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5" />
              <span>100% Plastic-Free Living</span>
            </div>
          </div>
          <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Eco-Friendly Living Surrounded by Nature
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our plant-based tableware brings organic warmth to your dining room, corporate pantry, or coffee break. Made from food-grade composite with no toxic dyes, melamine, or BPA.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Green Sustainability Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/90 border border-brand-200 rounded-xl p-4 text-center space-y-1.5 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-1">
            <Sprout className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900">Natural Agricultural Husk</div>
          <div className="text-[11px] text-slate-500">65% Upcycled plant residue</div>
        </div>
        <div className="bg-white/90 border border-brand-200 rounded-xl p-4 text-center space-y-1.5 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-1">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900">Zero Microplastics</div>
          <div className="text-[11px] text-slate-500">Pure, certified food contact safe</div>
        </div>
        <div className="bg-white/90 border border-brand-200 rounded-xl p-4 text-center space-y-1.5 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-1">
            <Wind className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900">Cleaner Breathing Air</div>
          <div className="text-[11px] text-slate-500">Diverts open stubble fires</div>
        </div>
        <div className="bg-white/90 border border-brand-200 rounded-xl p-4 text-center space-y-1.5 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-1">
            <Recycle className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900">100% Regrindable</div>
          <div className="text-[11px] text-slate-500">Zero factory landfill waste</div>
        </div>
      </div>
    </div>
  );
}
