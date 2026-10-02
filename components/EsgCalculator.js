"use client";

import { useState } from "react";
import Link from "next/link";

export default function EsgCalculator() {
  const [units, setUnits] = useState(500);

  const plasticSaved = (units * 0.28).toFixed(1); // 280g single-use plastic replaced per item
  const stubbleDiverted = (units * 0.65).toFixed(1); // 650g crop stubble diverted
  const co2Avoided = (units * 1.3).toFixed(1); // 1.3 kg CO2e avoided
  const treesEquivalent = Math.round(units * 0.06);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Header & Dynamic Volume display */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-1.5">
          <div className="badge-green">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
            Interactive ESG Impact Calculator
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Estimate Your Environmental Savings
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Every Green Fibre order directly prevents crop stubble burning and offsets single-use virgin plastics.
          </p>
        </div>

        {/* Volume badge */}
        <div className="flex-shrink-0 bg-brand-50 text-brand-900 border border-brand-200 rounded-xl p-4 text-right min-w-[170px]">
          <span className="text-[11px] font-bold text-brand-700 tracking-wider uppercase block">
            Order Volume
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-0.5">
            {units.toLocaleString()} <span className="text-xs font-semibold text-slate-500">Units</span>
          </div>
        </div>
      </div>

      {/* Interactive Range Slider */}
      <div className="py-6">
        <div className="flex justify-between items-center text-[10.5px] sm:text-xs font-semibold text-slate-500 mb-2">
          <span>50 <span className="hidden sm:inline">units (Trial MOQ)</span><span className="sm:hidden">(MOQ)</span></span>
          <span className="hidden xs:inline">500 <span className="hidden sm:inline">units</span></span>
          <span className="hidden sm:inline">2,500 units</span>
          <span className="text-brand-800 font-bold">5,000+ <span className="hidden sm:inline">units (Enterprise)</span><span className="sm:hidden">(Bulk)</span></span>
        </div>

        <div className="relative flex items-center">
          <input
            type="range"
            min="50"
            max="5000"
            step="50"
            value={units}
            onChange={(e) => setUnits(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* 4 Clean Light-Green KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        <div className="bg-brand-50/60 border border-brand-200/80 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🌾</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-800 px-2 py-0.5 rounded">
              Bio Waste
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {stubbleDiverted} <span className="text-xs font-semibold text-slate-500">kg</span>
          </div>
          <div className="text-xs font-medium text-slate-600 mt-1">
            Crop Stubble Upcycled
          </div>
        </div>

        <div className="bg-brand-50/60 border border-brand-200/80 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🛡️</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-800 px-2 py-0.5 rounded">
              Plastic
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {plasticSaved} <span className="text-xs font-semibold text-slate-500">kg</span>
          </div>
          <div className="text-xs font-medium text-slate-600 mt-1">
            Virgin Plastic Replaced
          </div>
        </div>

        <div className="bg-brand-50/60 border border-brand-200/80 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">☁️</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-800 px-2 py-0.5 rounded">
              Clean Air
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {co2Avoided} <span className="text-xs font-semibold text-slate-500">kg</span>
          </div>
          <div className="text-xs font-medium text-slate-600 mt-1">
            CO₂e Emissions Prevented
          </div>
        </div>

        <div className="bg-brand-50/60 border border-brand-200/80 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🌲</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-800 px-2 py-0.5 rounded">
              Trees
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {treesEquivalent} <span className="text-xs font-semibold text-slate-500">Trees</span>
          </div>
          <div className="text-xs font-medium text-slate-600 mt-1">
            Annual Carbon Offset Equiv.
          </div>
        </div>
      </div>

      {/* Footer / CTA Bar */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500">
          * Calculated based on Life Cycle Assessment (LCA) peer metrics comparing agro-composite vs virgin PP/PET plastics.
        </p>
        <Link
          href="/quote"
          className="btn-primary w-full sm:w-auto text-center"
        >
          Include ESG Report in Quote Request →
        </Link>
      </div>
    </div>
  );
}
