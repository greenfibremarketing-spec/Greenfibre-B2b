"use client";

import { useState, useEffect, useRef } from "react";
import { validateGstin } from "@/lib/gstQuote";

/**
 * Custom React hook for live GSTIN verification with gstinapi.in.
 * Performs local format validation first to save credits, debounces 400ms, and aborts stale requests.
 *
 * Statuses:
 * - "idle": Empty or disabled
 * - "invalid": Local format validation failed (length, checksum, regex)
 * - "checking": Live verification in flight
 * - "verified": Successfully verified with official GST records (Active)
 * - "rejected": Hard failure (Not found, Cancelled, Suspended) - BLOCKS submit
 * - "soft": Format valid, but live API unreachable/exhausted/rate-limited - PERMITS submit
 *
 * @param {string} gstin - The raw GSTIN entered by the user
 * @param {Object} [options]
 * @param {boolean} [options.enabled=true] - Whether GST verification is active
 * @returns {{
 *   status: "idle" | "invalid" | "checking" | "verified" | "rejected" | "soft",
 *   data: Object | null,
 *   message: string | null,
 *   localValidation: Object
 * }}
 */
export function useGstinVerify(gstin, options = {}) {
  const enabled = options.enabled !== false;
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState(null);
  const [message, setMessage] = useState(null);

  const abortControllerRef = useRef(null);
  const timeoutIdRef = useRef(null);

  const clean = String(gstin || "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "");

  const allowTestNumber =
    typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_GSTIN_ALLOW_TEST_NUMBER === "true" &&
    process.env.NODE_ENV !== "production";
  const isTestNumber = allowTestNumber && clean === "00AAAAA0000A1ZT";
  const localValidation = isTestNumber
    ? {
        valid: true,
        gstin: clean,
        stateCode: "00",
        stateName: "Test Sandbox State",
        pan: "AAAAA0000A",
        error: null
      }
    : validateGstin(clean);

  useEffect(() => {
    // 1. If not enabled or empty, reset to idle
    if (!enabled || !clean) {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
      setStatus("idle");
      setData(null);
      setMessage(null);
      return;
    }

    // 2. Local format check
    if (!localValidation.valid) {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
      setStatus("invalid");
      setData(null);
      setMessage(localValidation.error);
      return;
    }

    // 3. Local check passed -> Debounce live lookup (400ms)
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();

    setStatus("checking");
    setMessage("Verifying with GST records…");

    timeoutIdRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const res = await fetch("/api/gstin/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ gstin: clean }),
          signal: controller.signal
        });

        const result = await res.json();

        if (controller.signal.aborted) return;

        if (result.ok && result.data) {
          if (result.data.isActive) {
            setStatus("verified");
            setData(result.data);
            setMessage(`✓ ${result.data.legalName || result.data.tradeName || "Valid Active GSTIN"}`);
          } else {
            // Cancelled or Suspended -> Hard reject
            setStatus("rejected");
            setData(result.data);
            setMessage(
              `GSTIN status is ${result.data.status || "Inactive"}. An active GSTIN is required.`
            );
          }
        } else if (!result.ok) {
          if (result.soft) {
            // Soft failure: local format passed, live service unavailable
            setStatus("soft");
            setData(null);
            setMessage(
              "GST records service temporarily unavailable. Format is valid; you can proceed with your quote."
            );
          } else {
            // Hard failure: NOT_FOUND or invalid
            setStatus("rejected");
            setData(null);
            setMessage(result.message || "GSTIN not found in official GST records.");
          }
        }
      } catch (err) {
        if (err.name === "AbortError" || controller.signal.aborted) return;
        // Network or fetch error is soft
        setStatus("soft");
        setData(null);
        setMessage(
          "GST live verification offline. Format is valid; you can proceed with your quote."
        );
      }
    }, 400);

    return () => {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [clean, enabled, localValidation.valid, localValidation.error]);

  return {
    status,
    data,
    message,
    localValidation
  };
}

