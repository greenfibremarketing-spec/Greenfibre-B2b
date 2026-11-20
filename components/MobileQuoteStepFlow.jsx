"use client";

import React, { useState } from "react";
import styles from "./MobileQuoteStepFlow.module.css";

/**
 * Formats currency in Indian locale (e.g. ₹18,327).
 */
const formatINR = (val) => {
  return "₹" + Math.round(Number(val) || 0).toLocaleString("en-IN");
};

/**
 * MobileQuoteStepFlow
 *
 * Provides a dedicated mobile 2-step flow (<= 860px):
 * - Step 1: Your Products
 * - Step 2: Your Details
 *
 * Includes:
 * - Top step progress indicator ("1 Products ——— 2 Details")
 * - Slide transitions (from right forward, from left backward)
 * - Auto-scroll to top on step change
 * - Fixed bottom action bar with safe-area support
 *
 * On desktop (>= 861px), this component completely steps aside using
 * CSS `display: contents` so the existing 2-column desktop grid is 100% untouched.
 */
export default function MobileQuoteStepFlow({
  children,
  totalWithGst = 0,
  itemCount = 0,
  isSubmitting = false,
  formId = "quote-details-form",
  onStepChange,
}) {
  const [currentStep, setCurrentStep] = useState(1); // 1 = Products, 2 = Details
  const [slideDirection, setSlideDirection] = useState("forward");

  const hasItems = itemCount > 0;

  const goToStep = (step) => {
    if (step === currentStep) return;
    if (step === 2 && !hasItems) return; // disabled if empty

    const direction = step > currentStep ? "forward" : "backward";
    setSlideDirection(direction);
    setCurrentStep(step);

    if (onStepChange) onStepChange(step);

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const childrenArray = React.Children.toArray(children);
  const productsChild = childrenArray[0] || null;
  const detailsChild = childrenArray[1] || null;

  return (
    <>
      {/* ── Mobile Top Progress Bar ("1 Products ——— 2 Details") ─────────── */}
      <div className={styles.mobileProgressHeader} role="navigation" aria-label="Quote checkout steps">
        {/* Step 1: Products */}
        <button
          type="button"
          onClick={() => goToStep(1)}
          className={`${styles.stepTab} ${currentStep === 1 ? styles.active : ""} ${currentStep > 1 ? styles.completed : ""}`}
          aria-current={currentStep === 1 ? "step" : undefined}
          aria-label="Step 1: Your Products"
        >
          <span className={styles.stepBadge}>
            {currentStep > 1 ? (
              <svg
                className={styles.checkSvg}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              "1"
            )}
          </span>
          <span>Products</span>
        </button>

        {/* Step Connector Line */}
        <div
          className={`${styles.stepLine} ${currentStep === 2 ? styles.active : ""}`}
          aria-hidden="true"
        />

        {/* Step 2: Details */}
        <button
          type="button"
          onClick={() => goToStep(2)}
          disabled={!hasItems}
          className={`${styles.stepTab} ${currentStep === 2 ? styles.active : ""}`}
          aria-current={currentStep === 2 ? "step" : undefined}
          aria-label="Step 2: Your Details"
        >
          <span className={styles.stepBadge}>2</span>
          <span>Details</span>
        </button>
      </div>

      {/* ── Steps Wrapper: display: contents on desktop, slide animated on mobile ── */}
      <div className={styles.stepsWrapper}>
        {/* Slide 1: Products */}
        <div
          className={`${styles.stepSlide} ${
            currentStep === 1
              ? `${styles.visible} ${slideDirection === "backward" ? styles.slideBackward : styles.slideForward}`
              : styles.hidden
          }`}
        >
          {productsChild}
        </div>

        {/* Slide 2: Details */}
        <div
          className={`${styles.stepSlide} ${
            currentStep === 2
              ? `${styles.visible} ${slideDirection === "forward" ? styles.slideForward : styles.slideBackward}`
              : styles.hidden
          }`}
        >
          {detailsChild}
        </div>
      </div>

      {/* ── Mobile Fixed Bottom Bar (safe-area aware, hidden on desktop) ─── */}
      <aside className={styles.mobileFixedBottomBar} aria-label="Quotation action bar">
        <div className={styles.bottomBarInner}>
          {/* Price Block */}
          <div className={styles.priceBlock}>
            <span className={styles.priceLabel}>Final quotation · incl. GST</span>
            <span className={styles.priceValue}>{formatINR(totalWithGst)}</span>
          </div>

          {/* Action CTAs */}
          {currentStep === 1 ? (
            /* Step 1 CTA: Enter details */
            <button
              type="button"
              onClick={() => goToStep(2)}
              disabled={!hasItems}
              className={styles.primaryCtaBtn}
              aria-label="Proceed to enter company and delivery details"
            >
              <span>Enter details</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          ) : (
            /* Step 2 CTAs: Back button & Submit quote */
            <div className={styles.step2Actions}>
              <button
                type="button"
                onClick={() => goToStep(1)}
                className={styles.backBtn}
                aria-label="Back to your products"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back</span>
              </button>

              <button
                type="submit"
                form={formId}
                disabled={isSubmitting}
                className={styles.primaryCtaBtn}
                aria-label="Submit official wholesale quotation request"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-spin"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    <span>Submitting…</span>
                  </>
                ) : (
                  <>
                    <span>Submit quote</span>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

