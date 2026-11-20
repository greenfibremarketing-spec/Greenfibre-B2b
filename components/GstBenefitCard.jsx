"use client";

import React, { useState, useEffect } from "react";
import styles from "./GstBenefitCard.module.css";

/**
 * Standard Indian GSTIN regex validator helper.
 */
export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export const isValidGstin = (value) => {
  if (!value || typeof value !== "string") return false;
  return GSTIN_REGEX.test(value.trim().toUpperCase());
};

/**
 * Formats numbers into Indian currency format (e.g. ₹18,327).
 */
export const formatINR = (val) => {
  return "₹" + Math.round(Number(val) || 0).toLocaleString("en-IN");
};

/**
 * GstBenefitCard
 *
 * Displays a celebratory green animated benefit card on mobile (<= 860px) when GSTIN is verified:
 * - Animated self-drawing SVG checkmark
 * - Count-up animation for the GST amount (1.3s ease-out)
 * - Light shine sweep and confetti burst
 * - Price you pay (struck through) vs Real cost after ITC
 *
 * On desktop (>= 861px), it renders ONLY `desktopFallback` so desktop remains 100% unchanged.
 * If not verified on mobile, it renders `desktopFallback` (normal hint text).
 */
export default function GstBenefitCard({
  verified = false,
  gst = 0,
  total = 0,
  legalName = "",
  desktopFallback = null,
}) {
  const [displayGst, setDisplayGst] = useState(0);
  const numericGst = Math.round(Number(gst) || 0);
  const numericTotal = Math.round(Number(total) || 0);
  const realCost = Math.max(0, numericTotal - numericGst);

  // 1.3s ease-out count-up animation
  useEffect(() => {
    if (!verified || numericGst <= 0) {
      setDisplayGst(0);
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplayGst(numericGst);
      return;
    }

    let startTime = null;
    const duration = 1300; // 1.3 seconds
    let rafId;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(easeOut * numericGst);

      setDisplayGst(current);

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [verified, numericGst]);

  return (
    <>
      {/* ── Desktop Fallback: Rendered with display: contents on desktop, hidden on mobile ── */}
      <div className={styles.desktopFallbackWrapper}>
        {desktopFallback}
      </div>

      {/* ── Mobile View (<= 860px): Shows animated card if verified, else fallback ── */}
      <div className={styles.mobileCardContainer}>
        {verified ? (
          <div
            className={styles.card}
            role="status"
            aria-live="polite"
            aria-label={`GSTIN verified. You get ${formatINR(numericGst)} back as Input Tax Credit.`}
          >
            {/* Confetti particles */}
            <div className={styles.confettiBox} aria-hidden="true">
              <span className={`${styles.dot} ${styles.d1}`} />
              <span className={`${styles.dot} ${styles.d2}`} />
              <span className={`${styles.dot} ${styles.d3}`} />
              <span className={`${styles.dot} ${styles.d4}`} />
              <span className={`${styles.dot} ${styles.d5}`} />
              <span className={`${styles.dot} ${styles.d6}`} />
            </div>

            {/* Header: Self-drawing Checkmark + "GSTIN verified" */}
            <div className={styles.headerRow}>
              <div className={styles.titleGroup}>
                <div className={styles.checkBadge}>
                  <svg
                    className={styles.checkSvg}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline
                      className={styles.checkPolyline}
                      points="20 6 9 17 4 12"
                    />
                  </svg>
                </div>
                <h4 className={styles.title}>GSTIN verified</h4>
              </div>

              {legalName && (
                <span className={styles.legalBadge} title={legalName}>
                  {legalName}
                </span>
              )}
            </div>

            {/* Main Benefit: "You get ₹X back" (count-up) */}
            <div className={styles.benefitBlock}>
              <div className={styles.amountLine}>
                You get{" "}
                <span className={styles.amountNumber}>
                  {formatINR(displayGst)}
                </span>{" "}
                back
              </div>
              <p className={styles.benefitSub}>
                as GST input tax credit (ITC) on this order
              </p>
            </div>

            {/* Comparison Line: Struck Total -> Real Cost */}
            {numericTotal > 0 && (
              <div className={styles.comparisonLine}>
                <span>Price you pay</span>
                <span className={styles.strikePrice}>
                  {formatINR(numericTotal)}
                </span>
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
                <span className={styles.realCostGroup}>
                  Your real cost after ITC{" "}
                  <span className={styles.realCostNumber}>
                    {formatINR(realCost)}
                  </span>
                </span>
              </div>
            )}
          </div>
        ) : (
          /* When NOT verified on mobile, show the normal hint text fallback */
          desktopFallback
        )}
      </div>
    </>
  );
}

