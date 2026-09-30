"use client";

import { useEffect, useState, useRef } from "react";
import Script from "next/script";
import { RotateCw } from "lucide-react";

export default function BottleModelViewer({
  src = "https://res.cloudinary.com/dsebrpcyz/image/upload/v1789734715/bottle_xg3utw.glb",
  poster = "https://res.cloudinary.com/dsebrpcyz/image/upload/v1789543040/06_last_pic_gqoc0e.png"
}) {
  const [loaded, setLoaded] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const modelRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.customElements) {
      if (window.customElements.get("model-viewer")) {
        setLoaded(true);
      }
    }
  }, []);

  const toggleRotation = () => {
    if (modelRef.current) {
      const nextState = !isRotating;
      setIsRotating(nextState);
      if (nextState) {
        modelRef.current.setAttribute("auto-rotate", "");
      } else {
        modelRef.current.removeAttribute("auto-rotate");
      }
    }
  };

  return (
    <div className="relative w-full max-w-[380px] mx-auto h-[480px] sm:h-[530px] flex items-center justify-center bg-transparent group">
      {/* Load Google model-viewer library */}
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
        onLoad={() => setLoaded(true)}
      />

      {/* Pure, Clean 3D Model Viewer with well-calibrated hero size */}
      <model-viewer
        ref={modelRef}
        src={src}
        poster={poster}
        alt="Interactive 3D Green Fibre Eco Bottle Model"
        auto-rotate
        rotation-per-second="26deg"
        camera-controls
        disable-zoom
        disable-pan
        disable-tap
        min-polar-angle="90deg"
        max-polar-angle="90deg"
        camera-orbit="0deg 90deg 142%"
        min-camera-orbit="auto 90deg 110%"
        max-camera-orbit="auto 90deg 220%"
        field-of-view="34deg"
        shadow-intensity="1.3"
        shadow-softness="0.75"
        exposure="1.08"
        environment-image="neutral"
        loading="lazy"
        reveal="auto"
        interaction-prompt="none"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
          outline: "none",
          cursor: "ew-resize",
          "--progress-bar-height": "0px",
          "--progress-bar-color": "transparent",
          "--progress-mask": "transparent"
        }}
      >
        {/* Completely hide native brown loading progress line */}
        <div slot="progress-bar" style={{ display: "none" }} />

        {/* Transparent Fallback Slot */}
        <div
          slot="poster"
          className="w-full h-full flex items-center justify-center bg-transparent p-2"
        >
          <img
            src={poster}
            alt="3D Bottle Preview"
            className="w-full h-full max-h-[440px] sm:max-h-[480px] object-contain drop-shadow-md"
          />
        </div>
      </model-viewer>

      {/* Subtle Bottom-Right Auto-Rotate Toggle */}
      <div className="absolute bottom-2 right-2 pointer-events-auto z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          type="button"
          onClick={toggleRotation}
          className="bg-white/90 hover:bg-white border border-slate-200 hover:border-brand-300 text-slate-700 hover:text-brand-800 p-2 rounded-full shadow-xs transition-colors"
          title={isRotating ? "Pause 360 rotation" : "Start 360 rotation"}
          aria-label="Toggle 360 rotation"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? "text-brand-600 animate-spin-slow" : ""}`} />
        </button>
      </div>
    </div>
  );
}
