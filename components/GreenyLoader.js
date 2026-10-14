"use client";

import { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  ClipboardList,
  Calculator,
  BadgePercent,
  FileText,
  CheckCircle2
} from "lucide-react";

const CIRC = 408; // 2 * Math.PI * 65

export default function GreenyLoader({
  loading = false,
  minDuration = 4200,
  title = "Processing Wholesale Quotation",
  subtitle = null
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const ringRef = useRef(null);

  // 5 Explicit Stages requested by user
  const stages = [
    {
      range: "0–25%",
      label: "Reviewing your order details…",
      icon: ClipboardList,
      color: "text-emerald-800"
    },
    {
      range: "25–50%",
      label: "Calculating wholesale pricing…",
      icon: Calculator,
      color: "text-emerald-800"
    },
    {
      range: "50–75%",
      label: "Applying bulk discounts…",
      icon: BadgePercent,
      color: "text-emerald-800"
    },
    {
      range: "75–99%",
      label: "Generating your official PDF…",
      icon: FileText,
      color: "text-emerald-800"
    },
    {
      range: "100%",
      label: "Quotation sent! Check your inbox.",
      icon: CheckCircle2,
      color: "text-emerald-950 font-bold"
    }
  ];

  // Synchronize mounted state with loading prop
  useEffect(() => {
    if (loading) {
      setMounted(true);
      const enterTimer = setTimeout(() => setVisible(true), 20);
      return () => clearTimeout(enterTimer);
    } else {
      setVisible(false);
      const exitTimer = setTimeout(() => {
        setMounted(false);
        setProgress(0);
        setStageIndex(0);
      }, 400);
      return () => clearTimeout(exitTimer);
    }
  }, [loading]);

  // Dynamic progress easing animation across the 5 stages with full 4.2+ sec duration
  useEffect(() => {
    if (!mounted || !visible) return;

    let startTime = null;
    let animFrameId = null;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;

      let currentVal = 0;
      if (elapsed < minDuration * 0.25) {
        // 0 to 25% (~0s to 1.05s)
        currentVal = Math.min(25, (elapsed / (minDuration * 0.25)) * 25);
        setStageIndex(0);
      } else if (elapsed < minDuration * 0.5) {
        // 25 to 50% (~1.05s to 2.1s)
        currentVal = Math.min(50, 25 + ((elapsed - minDuration * 0.25) / (minDuration * 0.25)) * 25);
        setStageIndex(1);
      } else if (elapsed < minDuration * 0.75) {
        // 50 to 75% (~2.1s to 3.15s)
        currentVal = Math.min(75, 50 + ((elapsed - minDuration * 0.5) / (minDuration * 0.25)) * 25);
        setStageIndex(2);
      } else if (elapsed < minDuration * 0.96) {
        // 75 to 99% (~3.15s to 4.0s)
        currentVal = Math.min(99, 75 + ((elapsed - minDuration * 0.75) / (minDuration * 0.21)) * 24);
        setStageIndex(3);
      } else {
        // 100% (~4.0s onwards)
        currentVal = 100;
        setStageIndex(4);
      }

      const rounded = Math.round(currentVal);
      setProgress(rounded);

      if (ringRef.current) {
        const offset = CIRC * (1 - rounded / 100);
        ringRef.current.style.strokeDashoffset = `${offset}px`;
      }

      if (elapsed < minDuration) {
        animFrameId = requestAnimationFrame(animate);
      }
    };

    animFrameId = requestAnimationFrame(animate);

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [mounted, visible, minDuration]);

  if (!mounted) return null;

  const currentStage = stages[stageIndex] || stages[0];
  const StageIcon = currentStage.icon;
  const isComplete = progress >= 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Processing quotation request"
      className={`fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-4 transition-all duration-400 select-none ${
        visible
          ? "opacity-100 bg-slate-900/60 backdrop-blur-md"
          : "opacity-0 pointer-events-none bg-slate-900/0 backdrop-blur-none"
      }`}
    >
      {/* Luxury Keyframes */}
      <style>{`
        @keyframes greenySpin {
          to { transform: rotate(360deg); }
        }
        @keyframes greenyGrow {
          0%, 100% { transform: scale(0.85); }
          50% { transform: scale(1.08); }
        }
        @keyframes greenyFlutter {
          0% { transform: rotate(-8deg); }
          100% { transform: rotate(8deg); }
        }
        @keyframes greenyPulseRing {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.06); opacity: 0.5; }
        }
        @keyframes greenyRise {
          0% { transform: translateY(6px); opacity: 0; }
          40% { opacity: 0.8; }
          100% { transform: translateY(-28px); opacity: 0; }
        }
      `}</style>

      {/* Floating Center Glassmorphic Card (Optimized for Mobile & Desktop) */}
      <div
        className={`relative w-full max-w-[340px] sm:max-w-md bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-emerald-100/90 shadow-2xl shadow-emerald-950/25 p-5 sm:p-8 flex flex-col items-center text-center overflow-hidden transition-all duration-400 transform ${
          visible ? "scale-100 translate-y-0" : "scale-95 translate-y-2 sm:translate-y-3"
        }`}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 sm:-top-24 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-28 sm:h-36 bg-gradient-to-b from-emerald-400/25 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Top Status Pill */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[10px] sm:text-[11px] font-bold shadow-2xs mb-3.5 sm:mb-5">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#16a34a] animate-ping" />
          <span className="flex items-center gap-1 sm:gap-1.5">
            <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-700" />
            <span>Green Fibre Enterprise B2B Desk</span>
          </span>
        </div>

        {/* Botanical 3D Center Artwork (Responsive dimensions) */}
        <div className="relative h-[140px] w-[140px] sm:h-[170px] sm:w-[170px] flex items-center justify-center my-0.5 sm:my-1">
          {/* Subtle Outer Glow Disk */}
          <div className="absolute inset-1 sm:inset-2 rounded-full bg-gradient-to-tr from-emerald-100/60 to-emerald-50/30 animate-[greenyPulseRing_3s_ease-in-out_infinite]" />

          <svg
            viewBox="0 0 190 190"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient id="premium-green-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#15803d" />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#86efac" />
              </linearGradient>

              <linearGradient id="leaf-gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#166534" />
                <stop offset="60%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#86efac" />
              </linearGradient>

              <linearGradient id="leaf-gradient-accent" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14532d" />
                <stop offset="70%" stopColor="#16a34a" />
                <stop offset="100%" stopColor="#4ade80" />
              </linearGradient>

              <filter id="leaf-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#064e3b" floodOpacity="0.25" />
              </filter>

              {/* Botanical Leaf Symbol */}
              <symbol id="leaf-shape" viewBox="-16 -16 32 32" overflow="visible">
                <path
                  d="M-14,0 C-6,-13 8,-13 15,0 C8,13 -6,13 -14,0Z"
                  fill="url(#leaf-gradient-primary)"
                  filter="url(#leaf-shadow)"
                />
                <path
                  d="M-12,0 L12,0 M-2,0 L5,-5 M-2,0 L5,5"
                  stroke="#ffffff"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.85"
                />
              </symbol>
            </defs>

            {/* Inactive Track Ring */}
            <circle
              cx="95"
              cy="95"
              r="65"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="4"
              opacity="0.7"
            />

            {/* Active Rotating Progress Ring */}
            <circle
              ref={ringRef}
              cx="95"
              cy="95"
              r="65"
              fill="none"
              stroke="url(#premium-green-ring)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - progress / 100)}
              className="origin-[95px_95px] -rotate-90 transition-all duration-150 ease-out"
            />

            {/* Three Orbiting Rice-Husk Leaves */}
            {[
              { delay: "0s", opacity: 0.95 },
              { delay: "-0.8s", opacity: 0.75 },
              { delay: "-1.6s", opacity: 0.55 },
            ].map((l, i) => (
              <g
                key={i}
                className="origin-[95px_95px] animate-[greenySpin_2.2s_cubic-bezier(.45,.05,.55,.95)_infinite]"
                style={{ animationDelay: l.delay }}
              >
                <use
                  href="#leaf-shape"
                  x="-16"
                  y="-16"
                  width="32"
                  height="32"
                  transform="translate(95 30)"
                  opacity={l.opacity}
                />
              </g>
            ))}

            {/* Center Growing Sprout Stem */}
            <g className="origin-[95px_128px] animate-[greenyGrow_2.4s_ease-in-out_infinite]">
              <path
                d="M95,128 C95,118 95,110 95,102"
                stroke="#15803d"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              {/* Left Sprout Leaf */}
              <g className="origin-[95px_104px] animate-[greenyFlutter_1.6s_ease-in-out_infinite_alternate]">
                <path
                  d="M95,104 C80,104 70,94 68,82 C82,82 93,90 95,104Z"
                  fill="url(#leaf-gradient-accent)"
                  filter="url(#leaf-shadow)"
                />
              </g>
              {/* Right Sprout Leaf */}
              <g
                className="origin-[95px_104px] animate-[greenyFlutter_1.6s_ease-in-out_infinite_alternate]"
                style={{ animationDelay: "-0.8s" }}
              >
                <path
                  d="M95,104 C110,104 120,94 122,82 C108,82 97,90 95,104Z"
                  fill="url(#leaf-gradient-primary)"
                  filter="url(#leaf-shadow)"
                />
              </g>
              {/* Natural Soil Mound */}
              <ellipse cx="95" cy="130" rx="15" ry="4" fill="#78350f" opacity="0.3" />
            </g>

            {/* Rising Floating Micro-Spores */}
            {[
              { cx: 80, cy: 100, r: 2.2, d: "0s" },
              { cx: 110, cy: 104, r: 2.0, d: "-1s" },
              { cx: 95, cy: 96, r: 2.4, d: "-2s" },
            ].map((p, i) => (
              <circle
                key={i}
                cx={p.cx}
                cy={p.cy}
                r={p.r}
                fill="#22c55e"
                className="opacity-0 animate-[greenyRise_2.6s_ease-in_infinite]"
                style={{ animationDelay: p.d }}
              />
            ))}
          </svg>

          {/* Center Progress Indicator Badge */}
          <div className="absolute inset-0 flex items-center justify-center pt-8 sm:pt-10 pointer-events-none">
            <span
              className={`text-[10px] sm:text-[11px] font-black px-2 sm:px-2.5 py-0.5 rounded-full border shadow-2xs transition-all duration-300 ${
                isComplete
                  ? "bg-emerald-500 text-white border-emerald-400 scale-105"
                  : "bg-white/90 text-emerald-900 border-emerald-200/80 backdrop-blur-xs"
              }`}
            >
              {progress}%
            </span>
          </div>
        </div>

        {/* Headline without star icon */}
        <div className="mt-3 sm:mt-4">
          <h3 className="text-base sm:text-lg lg:text-xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-slate-500 max-w-xs font-normal mt-0.5 sm:mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Dynamic 5-Stage Animated Status Box (Mobile & Desktop tuned) */}
        <div
          className={`mt-3.5 sm:mt-5 w-full rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 flex items-center justify-center gap-2 sm:gap-2.5 transition-all duration-300 border ${
            isComplete
              ? "bg-emerald-50 border-emerald-300 shadow-sm"
              : "bg-slate-50 border-slate-200/80"
          }`}
        >
          {isComplete ? (
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0 animate-bounce" />
          ) : (
            <StageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 flex-shrink-0 animate-pulse" />
          )}

          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[10px] sm:text-[11px] font-mono font-bold text-emerald-700/80 flex-shrink-0">
              [{currentStage.range}]
            </span>
            <p className={`text-[11px] sm:text-xs font-semibold truncate ${currentStage.color}`}>
              {currentStage.label}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
