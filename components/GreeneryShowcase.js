import Image from "next/image";
import { Sprout, ShieldCheck, Leaf, Wind, Recycle } from "lucide-react";

export default function GreeneryShowcase() {
  return (
    <div className="space-y-6 sm:space-y-8 py-2 sm:py-4">
      {/* Header */}
      <div className="text-left max-w-3xl space-y-1.5 sm:space-y-2.5">
        <div className="badge-green">
          <Sprout className="w-3.5 h-3.5 text-brand-700" />
          <span>About Our Material</span>
        </div>
        <h2 className="section-title">
          Tableware for Everyday Use
        </h2>
        <p className="section-desc">
          Plain, natural tableware for the places you eat every day. Plates, bowls, cups and cutlery with a soft, earthy finish that suits any table.
        </p>
      </div>

      {/* Visual Showcase: 2 Rich Green Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left Card */}
        <div className="bg-white border border-brand-200/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-card-hover hover:border-brand-400/80 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
          <div className="relative h-[220px] sm:h-[280px] lg:h-[340px] overflow-hidden bg-slate-50 flex items-center justify-center">
            <Image
              src="https://res.cloudinary.com/dsebrpcyz/image/upload/v1790857481/Eco-Friendly_Ribbed_Pots_with_Plants_and_Peat_Discs_eci3q7.webp"
              alt="Rice Husk and Bamboo Fibre"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-2 sm:p-3 group-hover:scale-[1.02] transition-transform duration-500 ease-out"
            />
            <div className="absolute top-3 left-3 bg-brand-700/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 z-10">
              <Sprout className="w-3.5 h-3.5" />
              <span>Rice Husk and Bamboo Fibre</span>
            </div>
          </div>
          <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Made From Rice Husk and Bamboo Fibre
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our tableware is made from rice husk and bamboo fibre. It is simple, light and ready for daily use.
              </p>
            </div>
          </div>
        </div>

        {/* Right Card */}
        <div className="bg-white border border-brand-200/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-card-hover hover:border-brand-400/80 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
          <div className="relative h-[220px] sm:h-[280px] lg:h-[340px] overflow-hidden bg-slate-50 flex items-center justify-center">
            <Image
              src="https://res.cloudinary.com/dsebrpcyz/image/upload/v1790683973/Eco-Dining_set-8_v0ygzy.webp"
              alt="Natural Fibre Tableware"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-2 sm:p-3 group-hover:scale-[1.02] transition-transform duration-500 ease-out"
            />
            <div className="absolute top-3 left-3 bg-brand-700/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 z-10">
              <Leaf className="w-3.5 h-3.5" />
              <span>Natural Fibre Tableware</span>
            </div>
          </div>
          <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Made for Every Table
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our range works for home dining, office pantries, cafes and events. It has a natural look and a light feel in the hand.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/90 border border-brand-200 rounded-xl p-4 text-center space-y-1.5 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-1">
            <Sprout className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900">Rice Husk</div>
          <div className="text-[11px] text-slate-500">A natural fibre material</div>
        </div>
        <div className="bg-white/90 border border-brand-200 rounded-xl p-4 text-center space-y-1.5 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-1">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900">Bamboo Fibre</div>
          <div className="text-[11px] text-slate-500">A natural fibre material</div>
        </div>
        <div className="bg-white/90 border border-brand-200 rounded-xl p-4 text-center space-y-1.5 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-1">
            <Wind className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900">Natural Look</div>
          <div className="text-[11px] text-slate-500">Soft, earthy finish for any table</div>
        </div>
        <div className="bg-white/90 border border-brand-200 rounded-xl p-4 text-center space-y-1.5 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-1">
            <Recycle className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900">Light to Carry</div>
          <div className="text-[11px] text-slate-500">Easy to use at home, office and events</div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="bg-white border border-brand-200/90 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm space-y-5">
        <div className="space-y-1.5">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            Where You Can Use It
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Our tableware is made for daily use in homes, workplaces and food businesses.
          </p>
        </div>

        <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-700 mt-2 flex-shrink-0" />
            <span><strong>Offices:</strong> Plates, bowls, cups and cutlery for the pantry, lunch room and meetings.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-700 mt-2 flex-shrink-0" />
            <span><strong>Cafes and restaurants:</strong> Serveware for dine-in and takeaway orders.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-700 mt-2 flex-shrink-0" />
            <span><strong>Hotels and catering:</strong> Tableware for buffets, banquets and events with large guest counts.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-700 mt-2 flex-shrink-0" />
            <span><strong>Homes:</strong> Everyday meals, family gatherings and parties.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-700 mt-2 flex-shrink-0" />
            <span><strong>Gifting:</strong> Branded sets for corporate gifts and festival hampers.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
