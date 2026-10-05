"use client";

import { useEffect, useRef, useState } from "react";

const CIRC = 408; // ring circumference (2πr, r = 65)

/**
 * Green leaf loader (Tailwind CSS v3+).
 *
 * Usage:
 *   <GreenyLoader />                      // auto: hides when the page has loaded
 *   <GreenyLoader loading={isLoading} />  // manual: you control it
 *   <GreenyLoader minDuration={2500} />   // minimum visible time in ms
 */
export default function GreenyLoader({ loading, minDuration = 1200 }) {
  const auto = loading === undefined;

  const [pageReady, setPageReady] = useState(
    () => typeof document !== "undefined" && document.readyState === "complete"
  );
  const [mounted, setMounted] = useState(() => {
    if (auto) {
      if (typeof window !== "undefined" && window.sessionStorage?.getItem("greeny_loaded")) {
        return false;
      }
      return true;
    }
    return Boolean(loading);
  });
  const [visible, setVisible] = useState(() => {
    if (auto) return true;
    return Boolean(loading);
  });
  const ring = useRef(null);

  const isLoading = auto ? !pageReady : Boolean(loading);
  const readyRef = useRef(!isLoading);
  readyRef.current = !isLoading;

  // Auto mode: wait for the window "load" event
  useEffect(() => {
    if (!auto || pageReady) return;
    const onLoad = () => setPageReady(true);
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, [auto, pageReady]);

  // Show again if manual loading starts again
  useEffect(() => {
    if (!auto) {
      if (loading) {
        setMounted(true);
        setVisible(true);
      }
    }
  }, [auto, loading]);

  // Progress ring: eases to 90%, then completes when ready
  useEffect(() => {
    if (!mounted) return;
    let raf, timer, start;
    let value = 0;

    const tick = (t) => {
      if (!start) start = t;
      const elapsed = t - start;
      const target =
        readyRef.current && elapsed >= minDuration
          ? 100
          : Math.min(90, (elapsed / minDuration) * 90);

      value += (target - value) * 0.08;
      if (target === 100 && value > 99.4) value = 100;

      if (ring.current) {
        ring.current.style.strokeDashoffset = CIRC * (1 - value / 100);
      }
      if (value >= 100) {
        if (typeof window !== "undefined") {
          window.sessionStorage?.setItem("greeny_loaded", "true");
        }
        timer = setTimeout(() => setVisible(false), 350);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [mounted, minDuration]);

  if (!mounted) return null;

  const orbit =
    "origin-[95px_95px] animate-[greenySpin_2.4s_cubic-bezier(.45,.05,.55,.95)_infinite] motion-reduce:[animation-duration:8s]";

  return (
    <div
      role="progressbar"
      aria-label="Loading"
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget && !visible) setMounted(false);
      }}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[radial-gradient(circle_at_50%_45%,#e9f9de,#f7fdf1_70%)] transition-all duration-700 ${
        visible ? "opacity-100" : "pointer-events-none scale-105 opacity-0"
      }`}
    >
      {/* Keyframes (kept here so no tailwind.config changes are needed) */}
      <style>{`
        @keyframes greenySpin { to { transform: rotate(360deg); } }
        @keyframes greenyGrow { 0%,100% { transform: scale(.78); } 50% { transform: scale(1.04); } }
        @keyframes greenyFlutter { from { transform: rotate(-6deg); } to { transform: rotate(6deg); } }
        @keyframes greenyRise {
          0% { transform: translateY(8px); opacity: 0; }
          30% { opacity: .9; }
          100% { transform: translateY(-36px); opacity: 0; }
        }
      `}</style>

      <div className="relative h-[190px] w-[190px]">
        <svg viewBox="0 0 190 190" aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <linearGradient id="greeny-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#b2d288" />
              <stop offset="1" stopColor="#6cb675" />
            </linearGradient>
            <linearGradient id="greeny-leaf" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#b2d288" />
              <stop offset="1" stopColor="#4ea75c" />
            </linearGradient>
            <symbol id="greeny-leaf-shape" viewBox="-16 -16 32 32" overflow="visible">
              <path d="M-14,0 C-6,-13 8,-13 15,0 C8,13 -6,13 -14,0Z" fill="url(#greeny-leaf)" />
              <path
                d="M-12,0 L12,0 M-2,0 L5,-5 M-2,0 L5,5"
                stroke="#fff"
                strokeWidth="1.4"
                strokeLinecap="round"
                fill="none"
                opacity=".8"
              />
            </symbol>
          </defs>

          {/* Track + progress ring */}
          <circle cx="95" cy="95" r="65" fill="none" stroke="#bbcfad" strokeWidth="3" opacity=".6" />
          <circle
            ref={ring}
            cx="95"
            cy="95"
            r="65"
            fill="none"
            stroke="url(#greeny-ring)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC}
            className="origin-[95px_95px] -rotate-90"
          />

          {/* Three revolving leaves */}
          {[
            { delay: "0s", opacity: 0.95 },
            { delay: "-0.8s", opacity: 0.7 },
            { delay: "-1.6s", opacity: 0.45 },
          ].map((l, i) => (
            <g key={i} className={orbit} style={{ animationDelay: l.delay }}>
              <use
                href="#greeny-leaf-shape"
                x="-16"
                y="-16"
                width="32"
                height="32"
                transform="translate(95 30)"
                opacity={l.opacity}
              />
            </g>
          ))}

          {/* Growing sprout */}
          <g className="origin-[95px_128px] animate-[greenyGrow_2.4s_ease-in-out_infinite] motion-reduce:animate-none">
            <path d="M95,128 C95,118 95,110 95,102" stroke="#5eb168" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <g className="origin-[95px_104px] animate-[greenyFlutter_1.6s_ease-in-out_infinite_alternate] motion-reduce:animate-none">
              <path d="M95,104 C80,104 70,94 68,82 C82,82 93,90 95,104Z" fill="url(#greeny-leaf)" />
            </g>
            <g
              className="origin-[95px_104px] animate-[greenyFlutter_1.6s_ease-in-out_infinite_alternate] motion-reduce:animate-none"
              style={{ animationDelay: "-0.8s" }}
            >
              <path d="M95,104 C110,104 120,94 122,82 C108,82 97,90 95,104Z" fill="#90c877" />
            </g>
            <ellipse cx="95" cy="130" rx="14" ry="3.5" fill="#7a5a3a" opacity=".35" />
          </g>

          {/* Drifting particles */}
          {[
            { cx: 82, cy: 100, r: 2, d: "0s" },
            { cx: 108, cy: 104, r: 1.8, d: "-1s" },
            { cx: 95, cy: 96, r: 2.2, d: "-2s" },
          ].map((p, i) => (
            <circle
              key={i}
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              fill="#a8ce75"
              className="opacity-0 animate-[greenyRise_3s_ease-in_infinite] motion-reduce:animate-none"
              style={{ animationDelay: p.d }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
