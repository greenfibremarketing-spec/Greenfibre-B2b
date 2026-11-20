"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuote, moqErrors } from "@/components/Quote";
import { useAuth } from "@/components/AuthContext";
import {
  CheckCircle2, ShoppingBag, AlertCircle, Lock, ShieldCheck,
  BadgePercent, Minus, Plus, Trash2, X, SlidersHorizontal,
  Clock, Copy, Check, ArrowRight, Leaf, ChevronDown, Download, Info, Loader2
} from "lucide-react";
import GreenyLoader from "@/components/GreenyLoader";
import { optimizeImageUrl } from "@/lib/imageOptimization";
import {
  validateEmail,
  validateIndianPhone,
  formatIndianPhone,
  filterPhoneInput,
  validatePinCode
} from "@/lib/validation";
import {
  validateGstin,
  computeQuoteTax,
  SUPPLIER_STATE_CODE,
  SUPPLIER_GSTIN
} from "@/lib/gstQuote";
import { useGstinVerify } from "@/hooks/useGstinVerify";
import GstBenefitCard from "@/components/GstBenefitCard";
import MobileQuoteStepFlow from "@/components/MobileQuoteStepFlow";

const ORDER_PURPOSE_OPTIONS = [
  "Corporate gifting and new joinee welcome kits",
  "Cafeteria, hotel and restaurant tableware",
  "Retail store and brand reseller",
  "Event, summit or conference merchandise",
  "Sample kit request and custom procurement",
  "Other / Custom Requirements"
];

export default function QuotePage() {
  const {
    items = [],
    lineItems = [],
    setQty,
    remove,
    clear,
    count = 0,
    hasBundleBonus = false,
    bundleBonusAmount = 0,
    totalGross = 0,
    totalItemDiscount = 0,
    totalUnitsCount = 0,
    netSubtotalBeforeBundle = 0,
    estimatedTotal = 0,
    estimatedGST = 0,
    totalWithGST = 0,
    totalSavings = 0,
    savingsPct = "0",
    getItemDiscountPct,
    getItemTierNumber,
    getItemTierLabel,
    BUNDLE_BONUS_PCT = 5,
  } = useQuote() || {};

  const { user, isAuthenticated } = useAuth() || {};

  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [purposeDropdownOpen, setPurposeDropdownOpen] = useState(false);
  const purposeRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "", company: "", email: "", phone: "",
    buyerType: "Corporate gifting and new joinee welcome kits",
    city: "", pin: "",
    date: "", gstin: "", notes: ""
  });

  const [hasGstin, setHasGstin] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    name: "", company: "", email: "", phone: "", city: "", pin: "", gstin: ""
  });

  const [catalogProducts, setCatalogProducts] = useState([]);
  const [quotationDate, setQuotationDate] = useState("");
  const [state, setState] = useState({ busy: false, error: null, ref: null });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const pageRef = useRef(null);
  const workspaceRef = useRef(null);
  const billCardRef = useRef(null);
  const itemsAreaRef = useRef(null);
  const formCardRef = useRef(null);
  const formFieldsAreaRef = useRef(null);

  // Live lookup & verification of GSTIN via gstinapi.in
  const gstinLive = useGstinVerify(formData.gstin, { enabled: hasGstin });
  const gstinValidation = gstinLive.localValidation;

  // Auto-fill company, city, and PIN code when GSTIN is verified (never overwrite user edits)
  const lastAutoFilledGstinRef = useRef("");
  useEffect(() => {
    if (!hasGstin || gstinLive.status !== "verified" || !gstinLive.data) return;

    const currentGstin = gstinLive.data.gstin;
    if (lastAutoFilledGstinRef.current === currentGstin) return;
    lastAutoFilledGstinRef.current = currentGstin;

    const { legalName, tradeName, address } = gstinLive.data;
    setFormData((prev) => {
      const updates = {};
      if (!prev.company || prev.company.trim() === "" || prev.company === "Corporate Buyer" || prev.company === "Freshworks India") {
        updates.company = legalName || tradeName || "";
      }
      if (!prev.city || prev.city.trim() === "" || prev.city === "Pan-India") {
        if (address?.city) updates.city = address.city;
      }
      if (!prev.pin || prev.pin.trim() === "") {
        if (address?.pincode) updates.pin = address.pincode;
      }
      return Object.keys(updates).length > 0 ? { ...prev, ...updates } : prev;
    });
  }, [hasGstin, gstinLive.status, gstinLive.data]);

  // Dynamic GST Tax calculation & split driven by verified/active state code
  const quoteTax = useMemo(() => {
    const isUsable = hasGstin && (gstinLive.status === "verified" || gstinLive.status === "soft");
    const activeValidation = (gstinLive.status === "verified" && gstinLive.data)
      ? {
          valid: true,
          gstin: gstinLive.data.gstin,
          stateCode: gstinLive.data.stateCode,
          stateName: gstinLive.data.stateName,
          pan: gstinLive.data.pan
        }
      : gstinValidation;

    return computeQuoteTax({
      taxable: estimatedTotal,
      buyerType: hasGstin ? "gst" : "non_gst",
      gstinValidation: isUsable ? activeValidation : { valid: false, error: null },
      supplierStateCode: SUPPLIER_STATE_CODE
    });
  }, [estimatedTotal, hasGstin, gstinLive.status, gstinLive.data, gstinValidation]);

  useEffect(() => {
    setQuotationDate(
      new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
    );
  }, []);

  // Desktop Auto-Fit & Dynamic Font Scaling
  const fitQuotePage = () => {
    if (typeof window === "undefined") return;

    // Rule 6: Mobile (900px and below) - return early, single column normal scroll
    if (window.innerWidth <= 900) {
      if (pageRef.current) {
        pageRef.current.style.removeProperty("--hdr");
      }
      if (billCardRef.current) {
        billCardRef.current.style.removeProperty("--fs-bill");
        billCardRef.current.classList.remove("compact");
      }
      if (formCardRef.current) {
        formCardRef.current.style.setProperty("--fs-form", "14px");
        formCardRef.current.classList.remove("compact-form");
      }
      return;
    }

    // 1. Measure sticky/fixed site header height and set --hdr
    const header = document.querySelector("header");
    const hdrHeight = header ? Math.round(header.getBoundingClientRect().height) : 80;
    if (pageRef.current) {
      pageRef.current.style.setProperty("--hdr", `${hdrHeight}px`);
    }

    // 2. Bill Card auto-fit (Natural height, no inner scroll)
    const billCard = billCardRef.current;
    if (billCard) {
      billCard.classList.remove("compact");
      billCard.style.setProperty("--fs-bill", "14px");
    }

    // 3. Form Card: Scaled to clean ~20% compact size with comfortable breathing room
    const formCard = formCardRef.current;
    if (formCard) {
      formCard.classList.remove("compact-form");
      formCard.style.setProperty("--fs-form", "11.5px");
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    let rafId = null;
    const scheduleFit = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        fitQuotePage();
      });
    };

    scheduleFit();

    if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(scheduleFit);
    }

    window.addEventListener("resize", scheduleFit);
    window.addEventListener("orientationchange", scheduleFit);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", scheduleFit);
      window.removeEventListener("orientationchange", scheduleFit);
    };
  }, [items.length, hasGstin]);

  const handleScrollToDetails = () => {
    const el = document.getElementById("details");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    let mounted = true;
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (mounted && Array.isArray(data?.products)) {
          setCatalogProducts(data.products);
        }
      })
      .catch((err) => console.warn("Failed to load catalog products for live stock:", err));
    return () => {
      mounted = false;
    };
  }, []);

  // Compute live available stock per line item
  const getStockInfo = (item) => {
    const itemColor = (item.colour || item.color || "").trim().toLowerCase();
    const prod = catalogProducts.find(
      (p) =>
        p.slug === item.slug ||
        p._id === item.productId ||
        (p.name && item.name && p.name.trim().toLowerCase() === item.name.trim().toLowerCase())
    );

    let available = null;
    if (prod && Array.isArray(prod.colors) && prod.colors.length > 0) {
      const matched = prod.colors.find(
        (c) => c && c.name && c.name.trim().toLowerCase() === itemColor
      );
      if (matched) {
        if (typeof matched.b2bStock === "number") available = matched.b2bStock;
        else if (typeof matched.stock === "number") available = matched.stock;
      }
    }

    if (available === null && prod) {
      if (typeof prod.b2bStock === "number") available = prod.b2bStock;
      else if (typeof prod.stockQuantity === "number") available = prod.stockQuantity;
      else if (typeof prod.totalStock === "number") available = prod.totalStock;
    }

    if (available === null) {
      available = typeof item.totalStock === "number" ? item.totalStock : (item.stockQuantity ?? 9999);
    }

    const isExceeded = typeof available === "number" && item.qty > available;
    return {
      available,
      isExceeded,
      message: isExceeded ? `Only ${available} ${item.colour || item.color} available` : null
    };
  };

  const currentMoqErrors = moqErrors(lineItems);
  const stockErrors = lineItems.map((it) => ({ item: it, ...getStockInfo(it) })).filter((s) => s.isExceeded);
  const missingColors = lineItems.filter((it) => !(it.colour || it.color)?.trim());
  const isGstEligibleForSubmit =
    !hasGstin ||
    gstinLive.status === "verified" ||
    gstinLive.status === "soft";

  const canSubmit =
    lineItems.length > 0 &&
    currentMoqErrors.length === 0 &&
    stockErrors.length === 0 &&
    missingColors.length === 0 &&
    isGstEligibleForSubmit;

  // Close order purpose dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (purposeRef.current && !purposeRef.current.contains(e.target)) {
        setPurposeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      if (user.gstin) {
        setHasGstin(true);
      }
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.fullName || user.full_name || "",
        company: prev.company || user.companyName || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
        buyerType: prev.buyerType || user.businessType || "Corporate gifting and new joinee welcome kits",
        gstin: prev.gstin || user.gstin || "",
        city: prev.city || user.billingAddress?.city || "",
        pin: prev.pin || user.billingAddress?.pincode || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (items.length === 0 && isAdjustOpen) {
      setIsAdjustOpen(false);
    }
  }, [items.length, isAdjustOpen]);

  async function handleDownloadPdf() {
    if (lineItems.length === 0 || isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    try {
      const response = await fetch("/api/quote/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: {
            name: formData.name || user?.fullName || "Valued Enterprise Client",
            company: formData.company || user?.companyName || "Corporate Buyer",
            email: formData.email || user?.email || "",
            phone: formData.phone || user?.phone || "",
            city: formData.city || "Pan-India",
            pin: formData.pin || "",
            buyerType: formData.buyerType || "Corporate gifting and new joinee welcome kits",
            gstin: hasGstin && gstinValidation?.valid ? gstinValidation.gstin : (formData.gstin || ""),
            notes: formData.notes || ""
          },
          items: lineItems,
          totalGross,
          totalItemDiscount,
          netSubtotalBeforeBundle,
          hasBundleBonus,
          bundleBonusAmount,
          estimatedTotal,
          estimatedGST,
          totalWithGST,
          buyerType: hasGstin ? "gst" : "non_gst",
          isGstinValid: hasGstin ? (gstinLive.status === "verified" || gstinLive.status === "soft") : false,
          gstin: hasGstin ? formData.gstin : "",
          gstinState: hasGstin && quoteTax?.buyerStateCode ? `${quoteTax.buyerStateName} (${quoteTax.buyerStateCode})` : null,
          pan: hasGstin ? (gstinLive.data?.pan || gstinLive.localValidation?.pan || null) : null,
          legalName: gstinLive.data?.legalName || null,
          tradeName: gstinLive.data?.tradeName || null,
          taxSplit: quoteTax.taxSplit,
          supplierGstin: SUPPLIER_GSTIN
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `GreenFibre_Quotation_${Date.now().toString(36).toUpperCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download PDF error:", err);
      alert("Could not generate PDF download right now. Please submit quote request or try again.");
    } finally {
      setIsDownloadingPdf(false);
    }
  }

  function handleRequestQuoteClick() {
    const formEl = document.getElementById("quote-details-form") || document.querySelector("form");
    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstInput = formEl.querySelector("input:not([type=hidden])");
      if (firstInput) firstInput.focus();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (state.busy) return;

    // Strict validation: Require authentication before submitting quote
    if (!isAuthenticated && !user) {
      setShowLoginModal(true);
      setState({
        busy: false,
        error: "Please log in to your account first before submitting your quotation request.",
        ref: null
      });
      return;
    }

    // Comprehensive client-side validation
    const errors = {};
    if (!formData.name?.trim()) {
      errors.name = "Please enter your full name.";
    }
    if (!formData.company?.trim()) {
      errors.company = hasGstin
        ? "Please enter your company / legal name."
        : "Please enter your company / organization name.";
    }
    if (hasGstin) {
      if (!formData.gstin?.trim()) {
        errors.gstin = "Please enter your GSTIN.";
      } else if (gstinLive.status === "checking") {
        errors.gstin = "Verifying GSTIN with official records, please wait…";
      } else if (gstinLive.status === "rejected") {
        errors.gstin = gstinLive.message || "Invalid or unregistered GSTIN.";
      } else if (!gstinLive.localValidation?.valid) {
        errors.gstin = gstinLive.localValidation?.error || "Please enter a valid 15-character GSTIN.";
      }
    }
    if (!formData.email?.trim()) {
      errors.email = "Please enter your work email address.";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid work email address (e.g. rahul@company.com).";
    }
    if (!formData.phone?.trim()) {
      errors.phone = "Please enter your phone / WhatsApp number.";
    } else if (!validateIndianPhone(formData.phone)) {
      errors.phone = "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9 (e.g. +91 98765 43210).";
    }
    if (!formData.city?.trim()) {
      errors.city = "Please enter your delivery city.";
    }
    if (!formData.pin?.trim()) {
      errors.pin = "Please enter your 6-digit PIN code.";
    } else if (!validatePinCode(formData.pin)) {
      errors.pin = "Please enter a valid 6-digit Indian PIN code (e.g. 560001).";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstError = Object.values(errors)[0];
      setState({
        busy: false,
        error: firstError,
        ref: null
      });
      return;
    }

    if (missingColors.length > 0) {
      setState({
        busy: false,
        error: `Item "${missingColors[0].name}" is missing a color selection. Color is required.`,
        ref: null
      });
      return;
    }

    if (currentMoqErrors.length > 0) {
      setState({
        busy: false,
        error: currentMoqErrors[0].message,
        ref: null
      });
      return;
    }

    if (stockErrors.length > 0) {
      setState({
        busy: false,
        error: stockErrors[0].message,
        ref: null
      });
      return;
    }

    setFieldErrors({ name: "", company: "", email: "", phone: "", city: "", pin: "", gstin: "" });
    setState({ busy: true, error: null, ref: null });
    try {
      const [response] = await Promise.all([
        fetch("/api/enquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            phone: formatIndianPhone(formData.phone),
            buyerType: hasGstin ? "gst" : "non_gst",
            orderPurpose: formData.buyerType || "Corporate gifting and new joinee welcome kits",
            gstin: hasGstin ? formData.gstin : "",
            gstinState: hasGstin && quoteTax?.buyerStateCode ? `${quoteTax.buyerStateName} (${quoteTax.buyerStateCode})` : null,
            pan: hasGstin ? (gstinLive.data?.pan || gstinLive.localValidation?.pan || null) : null,
            legalName: gstinLive.data?.legalName || null,
            tradeName: gstinLive.data?.tradeName || null,
            isLiveVerified: gstinLive.status === "verified",
            taxSplit: quoteTax.taxSplit,
            taxable: quoteTax.taxable,
            gst: quoteTax.gstAmount,
            total: quoteTax.totalWithGst,
            itcAmount: quoteTax.itcAmount,
            supplierGstin: SUPPLIER_GSTIN,
            userId: user?.id || user?._id || null,
            isB2BVerified: user?.isB2BVerified || false,
            totalGross,
            totalItemDiscount,
            totalUnitsCount,
            hasBundleBonus,
            bundleBonusAmount,
            netSubtotalBeforeBundle,
            estimatedTotal,
            estimatedGST,
            totalWithGST,
            items: lineItems.map((it) => ({
              productId: it.productId || it.product || it._id || it.id || it.slug,
              variantId: it.variantId || null,
              raw_sku: it.raw_sku || it.sku || "GF-B2B",
              channel: "b2b",
              addOn: Boolean(it.addOn === true || it.isPairItem === true || it.isPair === true),
              slug: it.slug,
              name: it.name,
              colour: (it.colour || it.color || "").trim(),
              color: (it.colour || it.color || "").trim(),
              qty: it.qty,
              unit: it.unit || "piece",
              mrp: it.mrp,
              unitPrice: it.unitPrice || it.price || it.mrp,
              price: it.unitPrice || it.price || it.mrp,
              image: it.image || "",
              lineGross: it.lineGross,
              discountPct: it.discountPct,
              tierNumber: it.tierNumber,
              lineDiscount: it.lineDiscount,
              lineNet: it.lineNet,
              isPairItem: Boolean(it.addOn === true || it.isPairItem === true || it.isPair === true),
              senderName: it.senderName || "",
              receiverName: it.receiverName || "",
              giftMessage: it.giftMessage || "",
              engravingName: it.engravingName || "",
              customProductName: it.customProductName || "",
              selectedCustomizations: it.selectedCustomizations || [],
              brandingNotes: it.brandingNotes || ""
            }))
          })
        }),
        new Promise((resolve) => setTimeout(resolve, 5000))
      ]);

      let resJson = null;
      const rawText = await response.text();
      try {
        resJson = JSON.parse(rawText);
      } catch {
        console.error("Non-JSON API response received:", rawText);
        throw new Error(
          response.status === 429
            ? "Too many requests. Please wait a moment and try again."
            : `Server encountered an error (${response.status}). Please try again.`
        );
      }

      if (!response.ok || !resJson?.reference) {
        throw new Error(resJson?.error || "Failed to submit quote enquiry. Please try again.");
      }

      clear();
      setState({ busy: false, error: null, ref: resJson.reference, emailSent: resJson.emailSent === true, warning: resJson.warning });
    } catch (err) {
      setState({ busy: false, error: err.message, ref: null });
    }
  }

  // ── Success screen (Aligned with Navbar Left Edge) ────────────────────────
  if (state.ref) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        {/* Page header banner matching Quote page layout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div className="inline-flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#15803d] text-white flex items-center justify-center text-[10px] font-black shadow-2xs">
              ✓
            </span>
            <span className="text-xs font-bold text-slate-800 tracking-tight">
              Wholesale enquiry submitted &amp; quotation dispatched
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Response within 2 business hours
          </span>
        </div>

        {/* Two-column layout spanning full container width */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-1">
          {/* Left Column: Headline, Subtext, Ticket Card, Buttons & Contact */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f3428] tracking-tight leading-[1.15]">
                We&apos;ve got your<br />request.
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                {state.emailSent ? <>Your order summary and official quotation PDF have been sent to <strong className="text-slate-900 font-bold">{formData.email}</strong>.</> : <span role="alert">{state.warning || "Your quotation was received, but email delivery could not be confirmed. Please contact our team with your reference below."}</span>}
              </p>
            </div>

            {/* Ticket-style light green card */}
            <div className="relative bg-[#ebf7ee] border border-[#cbebd4] rounded-2xl p-5 sm:p-6 overflow-hidden shadow-2xs max-w-xl">
              {/* Semicircle notches on left and right */}
              <div className="absolute left-0 top-[52%] -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-r border-[#cbebd4]" />
              <div className="absolute right-0 top-[52%] -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white rounded-full border-l border-[#cbebd4]" />

              {/* Top part of ticket */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Quotation reference
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-[#0f3428] tracking-tight mt-1 font-mono">
                    {state.ref}
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(state.ref);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#cbebd4] rounded-lg text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-600" />
                        <span>Copy reference</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Dashed divider */}
              <div className="border-t border-dashed border-[#b3e5c0] my-4" />

              {/* Bottom part of ticket */}
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Follow-up SLA</span>
                  <span className="font-bold text-slate-900">Within 2 business hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Sent to</span>
                  <span className="font-bold text-slate-900 truncate max-w-[240px]">{formData.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Tax Status</span>
                  <span className="font-bold text-slate-900">18% GST • Input credit eligible</span>
                </div>
              </div>
            </div>

            {/* Buttons & Support line */}
            <div className="pt-2 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/products"
                  className="bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  Browse product catalog
                </Link>
                <Link
                  href="/"
                  className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  Back to homepage
                </Link>
              </div>

              <p className="text-xs text-slate-500 pt-1">
                Need help now? Email{" "}
                <a
                  href="mailto:support.greenfibre@gmail.com"
                  className="font-bold text-slate-900 underline hover:text-emerald-800"
                >
                  support.greenfibre@gmail.com
                </a>{" "}
                or call / WhatsApp{" "}
                <a
                  href="tel:+919217328777"
                  className="font-bold text-slate-900 underline hover:text-emerald-800"
                >
                  +91 92173 28777
                </a>
                .
              </p>
            </div>
          </div>

          {/* Right Column: What Happens Next Stepper Box */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                What happens next
              </h3>

              <div className="space-y-4 relative">
                {/* Step 1 */}
                <div className="flex items-start gap-3 relative">
                  <div className="w-6 h-6 rounded-full bg-[#ebf7ee] text-[#15803d] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                    1
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      We check stock &amp; pricing
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Our team confirms factory stock and applies your wholesale volume discount tier.
                    </p>
                  </div>
                  {/* Connecting Line to step 2 */}
                  <div className="absolute left-3 top-7 bottom-[-16px] w-px bg-slate-200" />
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3 relative">
                  <div className="w-6 h-6 rounded-full bg-[#ebf7ee] text-[#15803d] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                    2
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      A specialist contacts you
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Expect an email or WhatsApp message with custom sleeve mockups, sample options, and timeline.
                    </p>
                  </div>
                  {/* Connecting Line to step 3 */}
                  <div className="absolute left-3 top-7 bottom-[-16px] w-px bg-slate-200" />
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3 relative">
                  <div className="w-6 h-6 rounded-full bg-[#ebf7ee] text-[#15803d] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                    3
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Production and GST invoice
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Production starts with full 18% GST input tax credit documentation &amp; Pan-India tracking.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderTotalsContent = (mode = "side") => (
    <div className="bill-totals-block w-full space-y-[0.25em]">
      <div className="bill-totals-row flex items-center justify-between text-[0.9em] text-slate-600">
        <span>Catalog gross ({totalUnitsCount} units)</span>
        <span className="font-medium text-slate-800">₹{Number(totalGross || 0).toLocaleString("en-IN")}</span>
      </div>

      {totalItemDiscount > 0 && (
        <div className="bill-totals-row flex items-center justify-between text-[#15803d]">
          <span>Volume tier discount</span>
          <span className="font-semibold">−₹{Number(totalItemDiscount || 0).toLocaleString("en-IN")}</span>
        </div>
      )}

      {hasBundleBonus && bundleBonusAmount > 0 && (
        <div className="bill-totals-row flex items-center justify-between text-[#15803d]">
          <span>Bundle pairing bonus (5%)</span>
          <span className="font-semibold">−₹{Number(bundleBonusAmount || 0).toLocaleString("en-IN")}</span>
        </div>
      )}

      <div className="bill-totals-row flex items-center justify-between pt-[0.25em] min-[861px]:pt-[9px] min-[861px]:pb-[9px] border-t border-slate-200 text-[0.95em] font-bold text-slate-900">
        <span>Taxable value</span>
        <span className="font-extrabold text-[1.05em]">₹{(estimatedTotal || 0).toLocaleString("en-IN")}</span>
      </div>

      <div className="bill-totals-row flex items-center justify-between text-[0.88em] min-[861px]:text-[0.92em] min-[861px]:py-[9px] text-slate-600">
        <span>GST @ 18% (included in price)</span>
        <span className="font-medium text-slate-700">₹{Number(estimatedGST || 0).toLocaleString("en-IN")}</span>
      </div>

      {/* Green Final quotation bar */}
      <div className="bg-[#16a34a] text-white rounded-[0.8em] py-[0.65em] px-[0.95em] min-[861px]:my-[16px] min-[861px]:p-[19px_20px] flex items-center justify-between shadow-2xs mt-[0.35em]">
        <div>
          <div className="text-[0.92em] min-[861px]:text-[1.02rem] font-bold leading-tight">Final quotation</div>
          <span className="text-[0.76em] text-emerald-100 font-normal">Incl. GST</span>
        </div>
        <div className="text-[1.5em] sm:text-[1.75em] min-[861px]:text-[1.95rem] font-black text-white tracking-tight leading-none">
          ₹{Number(totalWithGST || 0).toLocaleString("en-IN")}
        </div>
      </div>

      {/* ITC BANNER / GST Benefit Card (Mobile Animated Celebration / Desktop Fallback) */}
      <GstBenefitCard
        verified={Boolean(quoteTax.isGstValid)}
        gst={estimatedGST}
        total={totalWithGST}
        legalName={gstinLive.data?.legalName || gstinLive.data?.tradeName}
        desktopFallback={
          <div className="bill-itc-banner relative overflow-hidden bg-emerald-50/70 rounded-[0.8em] border border-emerald-200/80 p-[0.65em] shadow-2xs mt-[0.35em] text-[0.85rem]">
            <div className="flex items-center gap-[0.4em] text-slate-700">
              <Info className="w-[1.1em] h-[1.1em] text-emerald-700 flex-shrink-0" />
              <span className="font-medium">
                {quoteTax.isGstValid
                  ? `Input tax credit of ₹${Number(estimatedGST || 0).toLocaleString("en-IN")} is available against your GSTIN.`
                  : `GST of ₹${Number(estimatedGST || 0).toLocaleString("en-IN")} is included in the price. Input tax credit requires a valid GSTIN.`}
              </span>
            </div>
          </div>
        }
      />

      {/* Savings and Download PDF */}
      {mode === "standard" ? (
        <div className="flex items-center justify-between pt-[0.5em] mt-[0.35em] border-t border-slate-200 text-[0.88em]">
          {totalSavings > 0 ? (
            <span className="font-bold text-[#15803d]">
              You save ₹{Number(totalSavings || 0).toLocaleString("en-IN")} ({savingsPct}%)
            </span>
          ) : (
            <span className="text-slate-400 text-[0.8em]">Direct factory wholesale rate</span>
          )}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="inline-flex items-center gap-[0.35em] px-[0.9em] py-[0.45em] rounded-[0.5em] border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-[0.85em] transition-colors cursor-pointer disabled:opacity-60 shadow-2xs"
          >
            {isDownloadingPdf ? (
              <>
                <span className="w-[1em] h-[1em] border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
                <span>Generating…</span>
              </>
            ) : (
              <>
                <Download className="w-[1em] h-[1em] text-slate-500" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="pt-[0.5em] border-t border-slate-200 text-[0.88em] space-y-[0.35em]">
          {totalSavings > 0 ? (
            <div className="font-bold text-[#15803d] text-center">
              You save ₹{Number(totalSavings || 0).toLocaleString("en-IN")} ({savingsPct}%)
            </div>
          ) : (
            <div className="text-slate-400 text-center text-[0.8em]">Direct factory wholesale rate</div>
          )}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="w-full inline-flex items-center justify-center gap-[0.35em] px-[0.9em] py-[0.45em] rounded-[0.5em] border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-[0.85em] transition-colors cursor-pointer disabled:opacity-60 shadow-2xs"
          >
            {isDownloadingPdf ? (
              <>
                <span className="w-[1em] h-[1em] border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
                <span>Generating…</span>
              </>
            ) : (
              <>
                <Download className="w-[1em] h-[1em] text-slate-500" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );

  const renderTableContent = () => (
    <>
      {/* Desktop/Tablet > 640px */}
      <div className="hidden sm:block">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 text-[0.8rem] text-slate-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-[0.65em] min-[861px]:py-[12px] px-[0.6em] w-[2.2em] text-center">#</th>
              <th className="py-[0.65em] min-[861px]:py-[12px] px-[0.6em]">Item</th>
              <th className="py-[0.65em] min-[861px]:py-[12px] px-[0.6em] text-center w-[8.5em]">Qty</th>
              <th className="py-[0.65em] min-[861px]:py-[12px] px-[0.6em] text-right w-[8.5em]">RATE (incl. GST)</th>
              <th className="py-[0.65em] min-[861px]:py-[12px] px-[0.6em] text-right w-[6.5em]">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[0.95em]">
            {lineItems.map((item, idx) => {
              const stockInfo = getStockInfo(item);
              const colorDisplay = (item.colour || item.color || "").trim();
              const isAddon = Boolean(item.addOn || item.isPair || item.isPairItem);
              const rate = item.unitPrice || item.price || item.mrp;

              return (
                <tr key={item.key} className="bill-item-row hover:bg-slate-50/50 transition-colors">
                  <td className="py-[0.6em] min-[861px]:py-[15px] px-[0.6em] text-center text-slate-400 text-[0.85em] align-middle">
                    {idx + 1}
                  </td>
                  <td className="py-[0.6em] min-[861px]:py-[15px] px-[0.6em] align-middle leading-[1.5]">
                    {/* Line 1: [42% off] in front of name + item name (bold) + optional Add-on badge */}
                    <div className="flex items-center gap-[0.4em] leading-snug">
                      {item.discountPct > 0 && (
                        <span className="text-[0.72em] font-extrabold text-[#15803d] bg-emerald-50 px-[0.4em] py-[0.08em] rounded border border-emerald-200/80 whitespace-nowrap flex-shrink-0">
                          {item.discountPct}% off
                        </span>
                      )}
                      <span className="font-bold text-slate-900 text-[0.95em] truncate" title={item.name}>
                        {item.name}
                      </span>
                      {isAddon ? (
                        <span className="text-[0.7em] font-bold px-[0.35em] py-[0.05em] bg-emerald-50 text-emerald-700 border border-emerald-200/70 rounded whitespace-nowrap flex-shrink-0">
                          Add-on
                        </span>
                      ) : (
                        <span className="text-[0.7em] font-medium px-[0.35em] py-[0.05em] bg-slate-100 text-slate-500 border border-slate-200 rounded whitespace-nowrap flex-shrink-0">
                          Primary
                        </span>
                      )}
                    </div>

                    {/* Line 2: variant / colour · struck MRP */}
                    <div className="bill-item-subline flex items-center gap-[0.35em] text-[0.82em] text-slate-500 whitespace-nowrap mt-[0.12em]">
                      {colorDisplay ? (
                        <span className="font-medium text-slate-600">{colorDisplay}</span>
                      ) : (
                        <span className="text-[0.78em] font-bold text-rose-600 bg-rose-50 px-[0.35em] py-[0.05em] rounded border border-rose-200">
                          Color required
                        </span>
                      )}
                      {item.mrp > rate && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="line-through text-slate-400">
                            ₹{Number(item.mrp || 0).toLocaleString("en-IN")}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Stock exceeded warning */}
                    {stockInfo.isExceeded && (
                      <div className="text-[0.82em] text-rose-600 font-semibold flex items-center gap-[0.3em] mt-[0.2em]">
                        <AlertCircle className="w-[1em] h-[1em] flex-shrink-0" />
                        <span>Only {stockInfo.available} {colorDisplay} available</span>
                        <button
                          type="button"
                          onClick={() => setQty(item.key, Math.max(1, stockInfo.available))}
                          className="underline hover:text-rose-800 cursor-pointer font-bold ml-[0.2em]"
                        >
                          Set to {stockInfo.available}
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="py-[0.6em] px-[0.6em] text-center align-middle whitespace-nowrap">
                    {/* Qty: − / + stepper plus a small × remove button */}
                    <div className="inline-flex items-center gap-[0.35em]">
                      <div className="inline-flex items-center border border-slate-200 rounded-[0.4em] bg-white overflow-hidden shadow-2xs">
                        <button
                          type="button"
                          disabled={item.qty <= 1}
                          onClick={() => setQty(item.key, Math.max(1, (item.qty || 1) - 1))}
                          className="w-[1.7em] h-[1.7em] flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer font-bold text-[0.9em] select-none transition-colors"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="px-[0.4em] text-[0.9em] font-bold text-slate-800 min-w-[1.8em] text-center select-none">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          disabled={stockInfo.available !== null && item.qty >= stockInfo.available}
                          onClick={() => setQty(item.key, (item.qty || 1) + 1)}
                          className="w-[1.7em] h-[1.7em] flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer font-bold text-[0.9em] select-none transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(item.key)}
                        className="w-[1.5em] h-[1.5em] rounded-[0.3em] text-slate-300 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer text-[0.9em] font-bold"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        ×
                      </button>
                    </div>
                  </td>
                  <td className="py-[0.6em] px-[0.6em] text-right text-slate-700 font-medium text-[0.92em] align-middle whitespace-nowrap">
                    ₹{Number(rate || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="py-[0.6em] px-[0.6em] text-right font-bold text-slate-900 text-[1em] align-middle whitespace-nowrap">
                    ₹{Number(item.lineNet || 0).toLocaleString("en-IN")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Small Phones Stacked Item Cards (<= 640px) */}
      <div className="block sm:hidden divide-y divide-slate-100">
        {lineItems.map((item) => {
          const stockInfo = getStockInfo(item);
          const colorDisplay = (item.colour || item.color || "").trim();
          const isAddon = Boolean(item.addOn || item.isPair || item.isPairItem);
          const rate = item.unitPrice || item.price || item.mrp;
          return (
            <div key={`mobile-${item.key}`} className="py-[0.7em] space-y-[0.45em]">
              {/* Row 1 (full width): item name + discount badge (shown instead of Primary on mobile) */}
              <div>
                <div className="flex items-center gap-[0.4em] leading-snug">
                  <span className="font-bold text-slate-900 text-[0.98em] truncate">
                    {item.name}
                  </span>
                  {isAddon ? (
                    <span className="text-[0.7em] font-bold px-[0.35em] py-[0.05em] bg-emerald-50 text-emerald-700 border border-emerald-200/70 rounded whitespace-nowrap flex-shrink-0">
                      Add-on
                    </span>
                  ) : item.discountPct > 0 ? (
                    <span className="text-[0.72em] font-extrabold text-[#15803d] bg-emerald-50 px-[0.4em] py-[0.08em] rounded border border-emerald-200/80 whitespace-nowrap flex-shrink-0">
                      {item.discountPct}% off
                    </span>
                  ) : null}
                  {isAddon && item.discountPct > 0 && (
                    <span className="text-[0.72em] font-extrabold text-[#15803d] bg-emerald-50 px-[0.4em] py-[0.08em] rounded border border-emerald-200/80 whitespace-nowrap flex-shrink-0">
                      {item.discountPct}% off
                    </span>
                  )}
                </div>
                <div className="bill-item-subline flex items-center gap-[0.35em] text-[0.82em] text-slate-500 whitespace-nowrap mt-[0.1em]">
                  {colorDisplay ? (
                    <span className="font-medium text-slate-600">{colorDisplay}</span>
                  ) : (
                    <span className="text-[0.78em] font-bold text-rose-600 bg-rose-50 px-[0.35em] py-[0.05em] rounded border border-rose-200">
                      Color required
                    </span>
                  )}
                  {item.mrp > rate && (
                    <>
                      <span className="text-slate-300">·</span>
                      <span className="line-through text-slate-400">
                        ₹{Number(item.mrp || 0).toLocaleString("en-IN")}
                      </span>
                    </>
                  )}
                </div>
                {stockInfo.isExceeded && (
                  <div className="text-[0.8em] text-rose-600 font-semibold flex items-center gap-[0.3em] mt-[0.15em]">
                    <AlertCircle className="w-[1em] h-[1em] flex-shrink-0" />
                    <span>Only {stockInfo.available} {colorDisplay} available</span>
                    <button
                      type="button"
                      onClick={() => setQty(item.key, Math.max(1, stockInfo.available))}
                      className="underline hover:text-rose-800 cursor-pointer font-bold ml-[0.2em]"
                    >
                      Set to {stockInfo.available}
                    </button>
                  </div>
                )}
              </div>

              {/* Row 2: qty stepper and × remove on left, amount (bold) on right */}
              <div className="flex items-center justify-between pt-[0.2em]">
                <div className="inline-flex items-center gap-[0.35em]">
                  <div className="inline-flex items-center border border-slate-200 rounded-[0.4em] bg-white overflow-hidden shadow-2xs">
                    <button
                      type="button"
                      disabled={item.qty <= 1}
                      onClick={() => setQty(item.key, Math.max(1, (item.qty || 1) - 1))}
                      className="w-[1.7em] h-[1.7em] flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer font-bold text-[0.9em] select-none"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="px-[0.4em] text-[0.9em] font-bold text-slate-800 min-w-[1.8em] text-center select-none">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      disabled={stockInfo.available !== null && item.qty >= stockInfo.available}
                      onClick={() => setQty(item.key, (item.qty || 1) + 1)}
                      className="w-[1.7em] h-[1.7em] flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer font-bold text-[0.9em] select-none"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(item.key)}
                    className="w-[1.5em] h-[1.5em] rounded-[0.3em] text-slate-300 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer text-[0.9em] font-bold"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </div>

                <div className="text-right">
                  <span className="font-bold text-slate-900 text-[1.05em]">
                    ₹{Number(item.lineNet || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-white text-slate-900"
    >
      {/* Global & Scoped Styles for Quote Page Auto-Fit & Compact Modes */}
      <style jsx global>{`
        /* Floating WhatsApp widget adjustments */
        @media (max-width: 900px) {
          aside[aria-label="Quick WhatsApp Quote"] {
            bottom: calc(5.2rem + env(safe-area-inset-bottom, 0px)) !important;
          }
        }
        @media (min-width: 901px) {
          aside[aria-label="Quick WhatsApp Quote"] {
            bottom: 0.75rem !important;
            right: 1.25rem !important;
            z-index: 30 !important;
          }

          /* 1. Desktop Workspace (>900px): Natural scrolling on products, sticky fixed form on right */
          .quote-workspace-container {
            min-height: calc(100vh - var(--hdr, 80px) - 24px);
            min-height: calc(100dvh - var(--hdr, 80px) - 24px);
            height: auto;
            max-height: none;
          }
          .quote-workspace-grid {
            height: auto;
            min-height: 0;
            align-items: stretch;
          }
          .quote-bill-card {
            align-self: flex-start;
            height: auto !important;
            min-height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            overflow-y: visible !important;
          }
          .bill-items-area {
            overflow: visible !important;
            overflow-y: visible !important;
            flex: none !important;
            height: auto !important;
            max-height: none !important;
          }
          .quote-form-card {
            position: sticky;
            top: calc(var(--hdr, 80px) + 16px);
            align-self: flex-start;
            height: auto !important;
            max-height: calc(100dvh - var(--hdr, 80px) - 24px);
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 transparent;
          }
          .quote-form-card::-webkit-scrollbar {
            width: 4px;
          }
          .quote-form-card::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 9999px;
          }
          .form-fields-area {
            overflow-y: visible !important;
            flex: none !important;
            height: auto !important;
          }
        }

        @media (max-width: 900px) {
          .quote-workspace-container {
            height: auto !important;
            min-height: auto !important;
            max-height: none !important;
          }
          .quote-workspace-grid {
            height: auto !important;
            min-height: auto !important;
          }
          .quote-bill-card,
          .quote-form-card {
            position: static !important;
            height: auto !important;
            min-height: auto !important;
            max-height: none !important;
            overflow: visible !important;
          }
          .bill-items-area,
          .form-fields-area {
            overflow-y: visible !important;
            flex: none !important;
            height: auto !important;
          }
        }

        /* 3. Sticky Table Header inside Bill Items Area */
        .bill-items-area thead {
          position: sticky;
          top: 0;
          z-index: 10;
          background-color: rgba(248, 250, 252, 0.98);
          backdrop-filter: blur(4px);
        }

        /* Custom Slim Scrollbar for Bill Items Area */
        .bill-items-area {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .bill-items-area::-webkit-scrollbar {
          width: 5px;
        }
        .bill-items-area::-webkit-scrollbar-track {
          background: transparent;
        }
        .bill-items-area::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 9999px;
        }
        .bill-items-area::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }

        /* 4. Compact Mode on Bill Card */
        .quote-bill-card.compact .bill-item-row td {
          padding-top: 0.38em !important;
          padding-bottom: 0.38em !important;
        }
        .quote-bill-card.compact .bill-item-subline {
          font-size: 0.82em !important;
          margin-top: 0.08em !important;
        }
        .quote-bill-card.compact .bill-notes-block {
          display: none !important;
        }
        .quote-bill-card.compact .bill-totals-block {
          width: 100% !important;
          max-width: 100% !important;
        }
        .quote-bill-card.compact .bill-totals-row {
          padding-top: 0.16em !important;
          padding-bottom: 0.16em !important;
        }

        /* 4. Compact Mode on Form Card */
        .quote-form-card.compact-form #q-notes {
          min-height: 2.2em !important;
          height: 2.2em !important;
        }
        .quote-form-card.compact-form .form-grid {
          gap: 0.45em !important;
        }
        .quote-form-card.compact-form label {
          margin-bottom: 0.1em !important;
        }
        .quote-form-card.compact-form input,
        .quote-form-card.compact-form button.purpose-btn {
          padding-top: 0.35em !important;
          padding-bottom: 0.35em !important;
        }
      `}</style>

      {/* Main Container: Fixed-height workspace on desktop, natural scroll on mobile */}
      <div
        ref={workspaceRef}
        className="quote-workspace-container w-full max-w-[1240px] xl:max-w-[1360px] mx-auto px-[0.8em] sm:px-[1.5em] lg:px-[2em] xl:px-[2.5em] my-0 min-[901px]:my-3 pb-[5.5em] min-[901px]:pb-8 box-border"
      >
        {/* Premium Leaf Loader displayed on top during quote submission */}
        <GreenyLoader
          loading={state.busy}
          minDuration={4200}
          title="Processing Wholesale Quotation"
        />

        {/* Two-column grid on desktop (responsive split based on item count, min-height: 0) */}
        <div className={`quote-workspace-grid grid grid-cols-1 ${lineItems.length >= 4 ? "min-[1024px]:grid-cols-[1.52fr_1fr]" : "min-[901px]:grid-cols-[1.25fr_1fr]"} gap-[1.1em] lg:gap-[1.4em] xl:gap-[1.8em]`}>
          <MobileQuoteStepFlow
            totalWithGst={totalWithGST}
            itemCount={items.length}
            isSubmitting={state.busy}
            formId="quote-details-form"
          >
            {/* ── Left Card: Professional Invoice ───────────────────────────── */}
          <div
            ref={billCardRef}
            style={{ fontSize: "var(--fs-bill, 14px)" }}
            className="quote-bill-card bg-white border border-slate-200/90 rounded-[1em] sm:rounded-[1.2em] p-[1.1em] sm:py-[1.4em] sm:px-[1.4em] min-[861px]:p-[34px] shadow-none flex flex-col min-h-0"
          >
            {/* a. Top Headers: Grouped with flex: none */}
            <div className="flex-none flex-shrink-0">
              {/* 1. Header: "Your Products (N)" with "+ Add more products" button */}
              <div className="flex items-center justify-between pb-[0.95em] border-b border-slate-100 min-h-[2.8em] mb-[0.95em]">
                <div className="flex items-center gap-[0.5em]">
                  <span className="w-[1.6em] h-[1.6em] rounded-full bg-[#1b5e3f] text-white flex items-center justify-center text-[0.8em] font-bold flex-shrink-0">
                    1
                  </span>
                  <h3 className="font-bold text-slate-900 text-[1.2em] tracking-tight">
                    Your Products ({count})
                  </h3>
                </div>
                <div className="flex items-center gap-[0.6em]">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-[0.3em] text-[0.85em] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/80 px-[0.75em] py-[0.35em] rounded-[0.5em] transition-colors cursor-pointer"
                    title="Browse catalog to add more products"
                  >
                    <Plus className="w-[1em] h-[1em]" />
                    <span>+ Add more products</span>
                  </Link>
                  {items.length > 0 && (
                    <button
                      type="button"
                      onClick={clear}
                      className="text-[0.85em] text-slate-400 hover:text-rose-600 transition-colors cursor-pointer px-[0.3em]"
                      title="Clear quote basket"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* 2. Invoice header: Leaf logo tile + "Green Fibre" + subline. Right: "QUOTATION", date, "Draft". 2px green line below */}
              <div className="flex items-start justify-between pb-[0.72em] border-b-2 border-[#16a34a] flex-wrap sm:flex-nowrap gap-[0.6em]">
                <div className="flex items-center gap-[0.75em]">
                  {/* Leaf logo tile: 2.1em rounded square, light green background, 1px border, green leaf icon */}
                  <div className="w-[2.1em] h-[2.1em] rounded-[0.45em] bg-emerald-50 border border-emerald-200/90 flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <Leaf className="w-[1.2em] h-[1.2em] text-[#1b5e3f]" />
                  </div>
                  <div>
                    <div className="font-bold text-[#1b5e3f] text-[1.15em] sm:text-[1.4em] leading-tight tracking-tight">
                      Green Fibre
                    </div>
                    <p className="text-[0.78em] text-slate-500 leading-normal mt-[0.1em]">
                      Direct factory wholesale rate · Pan-India logistics
                    </p>
                  </div>
                </div>
                <div className="hidden min-[861px]:block text-right flex-shrink-0 self-end sm:self-auto ml-auto sm:ml-0">
                  <div className="font-bold text-slate-800 text-[1.05em] sm:text-[1.1em] tracking-wider uppercase">
                    {quoteTax.isGstValid ? "TAX INVOICE" : "QUOTATION"}
                  </div>
                  <div className="text-[0.82em] sm:text-[0.85em] text-slate-500 flex items-center justify-end gap-[0.4em] mt-[0.1em]">
                    <span>{quotationDate || "Draft Date"}</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-[0.5em] py-[0.1em] rounded border border-emerald-200 text-[0.8em]">
                      {quoteTax.isGstValid ? "Tax invoice" : "Draft"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. One-line supplier text (.88em, muted), then a thin divider */}
              <div className="py-[0.6em] border-b border-slate-100 text-[0.88em] text-slate-500 mb-[0.6em]">
                <span className="font-semibold text-slate-700">Supplier: </span>
                Charvik Moulds and Products Private Limited · All prices inclusive of 18% GST
              </div>
            </div>

            {items.length === 0 ? (
              <div className="py-[3.5em] text-center space-y-[0.8em] flex flex-col items-center justify-center flex-1">
                <div className="w-[3em] h-[3em] rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-[0.2em]">
                  <ShoppingBag className="w-[1.5em] h-[1.5em]" />
                </div>
                <h4 className="text-[1.15em] font-bold text-slate-900">Your quote basket is empty</h4>
                <p className="text-[0.88em] text-slate-500 max-w-[22em]">Browse our wholesale catalog to add eco drinkware, tableware, and hampers.</p>
                <div className="pt-[0.4em]">
                  <Link href="/products" className="inline-flex items-center gap-[0.4em] px-[1.2em] py-[0.6em] rounded-[0.6em] bg-[#1b5e3f] hover:bg-[#164e34] text-white text-[0.88em] font-bold transition-colors">
                    Browse Product Catalog
                  </Link>
                </div>
              </div>
            ) : lineItems.length >= 4 ? (
              /* Desktop Wide Split Layout (>= 4 products): Side-by-side with products on left and totals on right */
              <div className="flex flex-col min-[861px]:flex-row min-[861px]:gap-[38px] gap-4 flex-1 min-h-0 items-start">
                {/* Left Side: Products Table Area */}
                <div
                  ref={itemsAreaRef}
                  className="bill-items-area flex-1 min-w-0 w-full overflow-visible pr-[0.2em] pb-[0.5em]"
                >
                  {renderTableContent()}
                </div>

                {/* Right Side: Totals / Pricing Area (340px to 360px wide, sticky) */}
                <div className="bill-footer-area w-full min-[861px]:w-[350px] flex-shrink-0 min-[861px]:sticky min-[861px]:top-6 min-[861px]:border-l min-[861px]:border-slate-200/90 min-[861px]:pl-[36px] border-t min-[861px]:border-t-0 border-slate-200/90 pt-3 min-[861px]:pt-0">
                  {renderTotalsContent("side")}
                </div>
              </div>
            ) : (
              /* Single-Column Full-Width Layout (1-3 products): Clean full-width table with totals stacked below */
              <div className="flex flex-col flex-1 min-h-0">
                {/* Full-width Products Table */}
                <div
                  ref={itemsAreaRef}
                  className="bill-items-area w-full overflow-visible pb-[0.4em]"
                >
                  {renderTableContent()}
                </div>

                {/* Below Table: Full-width Totals Block */}
                <div className="bill-footer-area w-full border-t border-slate-200/90 pt-3 mt-1">
                  {renderTotalsContent("standard")}
                </div>
              </div>
            )}
          </div>

          {/* ── Right Card: Details Form ──────────────────────────────────── */}
          <div
            ref={formCardRef}
            style={{ fontSize: "var(--fs-form, 11.5px)" }}
            className="quote-form-card bg-white border border-slate-200/90 rounded-[1em] sm:rounded-[1.2em] p-[1em] sm:p-[1.25em] xl:p-[1.5em] shadow-none flex flex-col min-h-0"
          >
            {/* Header row: Numbered circle + title with id="details" (flex: none) */}
            <div
              id="details"
              className="scroll-mt-4 flex-none flex-shrink-0 flex items-center justify-between pb-[0.65em] border-b border-slate-100 min-h-[2.2em] mb-[0.65em]"
            >
              <div className="flex items-center gap-[0.5em]">
                <span className="w-[1.6em] h-[1.6em] rounded-full bg-[#1b5e3f] text-white flex items-center justify-center text-[0.8em] font-bold flex-shrink-0">
                  2
                </span>
                <h3 className="font-bold text-slate-900 text-[1.15em] tracking-tight">
                  Your Details
                </h3>
              </div>
              {isAuthenticated && user && (
                <span className="inline-flex items-center gap-[0.4em] text-[0.8em] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-[0.7em] py-[0.25em] rounded-full">
                  <ShieldCheck className="w-[1em] h-[1em] text-emerald-700" />
                  <span>Logged in as {user.fullName || user.companyName}</span>
                </span>
              )}
            </div>

            {/* Login banner for logged-out users (flex: none) */}
            {(!isAuthenticated && !user) && (
              <div className="flex-none flex-shrink-0 p-[0.6em] mb-[0.65em] bg-emerald-50/80 border border-emerald-200/90 rounded-[0.55em] flex items-center justify-between gap-[0.8em] text-[0.85em]">
                <div className="flex items-center gap-[0.5em]">
                  <Lock className="w-[1.1em] h-[1.1em] text-emerald-800 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">Login to lock in your factory wholesale rate</span>
                </div>
                <Link
                  href="/login?redirect=/quote"
                  className="text-emerald-800 font-bold hover:underline whitespace-nowrap text-[0.85em]"
                >
                  Login →
                </Link>
              </div>
            )}

            <form id="quote-details-form" onSubmit={handleSubmit} noValidate className="flex flex-col flex-1 min-h-0">
              {/* Form Fields Area (comfortable breathing room) */}
              <div
                ref={formFieldsAreaRef}
                className="form-fields-area space-y-[0.55em]"
              >
                {/* 6) Mobile Sticky Total Line (<= 900px) */}
                <div className="min-[901px]:hidden sticky top-0 z-20 -mx-[0.4em] px-[0.6em] py-[0.45em] bg-white/95 backdrop-blur-md border-b border-emerald-100 flex items-center justify-between shadow-2xs mb-[0.4em] rounded-[0.5em]">
                  <div className="flex items-center gap-[0.4em] text-[0.85em] font-semibold text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-[#16a34a]" />
                    <span>Total (Incl. GST):</span>
                  </div>
                  <div className="font-extrabold text-[1.1em] text-[#1b5e3f]">
                    ₹{Number(totalWithGST || 0).toLocaleString("en-IN")}
                  </div>
                </div>

                {/* 1) GST TOGGLE (top of "Your Details", above "Your name") */}
                <div className="mb-[0.4em]">
                  <div className="bg-slate-100 p-[0.2em] rounded-[0.65em] flex items-center gap-[0.2em] border border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setHasGstin(true);
                        if (!formData.gstin && user?.gstin) {
                          setFormData((prev) => ({ ...prev, gstin: user.gstin }));
                        }
                      }}
                      className={`flex-1 py-[0.42em] px-[0.7em] text-[0.85em] font-semibold rounded-[0.5em] transition-all text-center cursor-pointer ${
                        hasGstin
                          ? "bg-white text-[#1b5e3f] shadow-2xs border border-emerald-300 font-bold"
                          : "text-slate-600 hover:text-slate-900 border border-transparent"
                      }`}
                    >
                      I have a GSTIN
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasGstin(false)}
                      className={`flex-1 py-[0.42em] px-[0.7em] text-[0.85em] font-semibold rounded-[0.5em] transition-all text-center cursor-pointer ${
                        !hasGstin
                          ? "bg-white text-slate-900 shadow-2xs border border-slate-200 font-bold"
                          : "text-slate-600 hover:text-slate-900 border border-transparent"
                      }`}
                    >
                      I don&apos;t have a GSTIN
                    </button>
                  </div>
                </div>

                {/* 2) WHEN "I have a GSTIN" IS SELECTED: GSTIN * field with live validation & info chips */}
                {hasGstin && (
                  <div className="mb-[0.5em] p-[0.7em] sm:p-[0.8em] bg-slate-50/70 border border-slate-200/80 rounded-[0.65em] space-y-[0.35em]">
                    <div className="flex items-center justify-between">
                      <label htmlFor="q-gstin-primary" className="text-[0.88em] font-medium text-slate-700 block">
                        GSTIN *
                      </label>
                      <span className="text-[0.76em] text-slate-400 font-mono">15 characters</span>
                    </div>
                    <input
                      id="q-gstin-primary"
                      name="gstin"
                      required
                      maxLength={15}
                      placeholder="27AAPFU0939F1ZV"
                      value={formData.gstin}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase().replace(/\s+/g, "").slice(0, 15);
                        setFormData((prev) => ({ ...prev, gstin: val }));
                        if (fieldErrors.gstin) setFieldErrors((prev) => ({ ...prev, gstin: "" }));
                      }}
                      className={`w-full text-[16px] min-[900px]:text-[1em] py-[0.5em] px-[0.75em] bg-white border rounded-[0.6em] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]/20 uppercase font-mono tracking-wider transition-all ${
                        formData.gstin
                          ? gstinLive.status === "checking"
                            ? "border-amber-300 focus:ring-amber-300/20 focus:border-amber-400"
                            : gstinLive.status === "verified"
                              ? "border-emerald-500 focus:ring-emerald-500/20 focus:border-emerald-500"
                              : gstinLive.status === "soft"
                                ? "border-emerald-500/70 focus:ring-emerald-500/20 focus:border-emerald-500"
                                : "border-red-400 focus:ring-red-400/20 focus:border-red-400 bg-red-50/10"
                          : "border-slate-200"
                      }`}
                    />
                    {/* Live validation & lookup feedback */}
                    {formData.gstin ? (
                      gstinLive.status === "checking" ? (
                        <div className="flex items-center gap-[0.4em] text-[0.82em] text-slate-500 font-medium pt-[0.1em]">
                          <Loader2 className="w-[1.15em] h-[1.15em] text-[#16a34a] animate-spin flex-shrink-0" />
                          <span>Verifying with GST records…</span>
                        </div>
                      ) : gstinLive.status === "verified" && gstinLive.data ? (
                        <div className="space-y-[0.35em] pt-[0.15em]">
                          <p className="text-[0.85em] text-emerald-800 font-bold flex items-center gap-[0.35em]">
                            <Check className="w-[1.2em] h-[1.2em] text-[#16a34a] flex-shrink-0" />
                            <span>{gstinLive.data.legalName || "Valid Active GSTIN"}</span>
                          </p>
                          {/* Info chips: State, PAN, and Trade name if present */}
                          <div className="flex flex-wrap items-center gap-[0.45em] pt-[0.15em]">
                            <span className="inline-flex items-center px-[0.65em] py-[0.2em] rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[0.8em] font-semibold">
                              State: {gstinLive.data.stateName} ({gstinLive.data.stateCode})
                            </span>
                            <span className="inline-flex items-center px-[0.65em] py-[0.2em] rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[0.8em] font-semibold font-mono">
                              PAN: {gstinLive.data.pan}
                            </span>
                            {gstinLive.data.tradeName && gstinLive.data.tradeName !== gstinLive.data.legalName && (
                              <span className="inline-flex items-center px-[0.65em] py-[0.2em] rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[0.8em] font-semibold">
                                Trade: {gstinLive.data.tradeName}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : gstinLive.status === "soft" ? (
                        <div className="space-y-[0.3em] pt-[0.1em]">
                          <p className="text-[0.78em] text-slate-600 font-medium flex items-center gap-[0.3em]">
                            <Info className="w-[1.1em] h-[1.1em] text-slate-500 flex-shrink-0" />
                            <span>{gstinLive.message || "Format valid (live verification unavailable). You can proceed."}</span>
                          </p>
                          <div className="flex flex-wrap items-center gap-[0.4em] pt-[0.1em]">
                            <span className="inline-flex items-center px-[0.55em] py-[0.15em] rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[0.78em] font-semibold">
                              State: {gstinLive.localValidation?.stateName} ({gstinLive.localValidation?.stateCode})
                            </span>
                            <span className="inline-flex items-center px-[0.55em] py-[0.15em] rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[0.78em] font-semibold font-mono">
                              PAN: {gstinLive.localValidation?.pan}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[0.78em] text-red-600 font-medium">
                          {gstinLive.message || "Invalid GSTIN"}
                        </p>
                      )
                    ) : (
                      <p className="text-[0.75em] text-slate-400">
                        Enter your 15-character Goods and Services Tax Identification Number.
                      </p>
                    )}
                    {fieldErrors.gstin && (
                      <p className="text-[0.78em] text-red-600 font-medium mt-[0.25em]">
                        {fieldErrors.gstin}
                      </p>
                    )}

                    {/* GST Benefit Card (Mobile Animated Celebration / Desktop Fallback is null) */}
                    <GstBenefitCard
                      verified={Boolean(quoteTax.isGstValid || (hasGstin && gstinLive.status === "verified"))}
                      gst={estimatedGST}
                      total={totalWithGST}
                      legalName={gstinLive.data?.legalName || gstinLive.data?.tradeName}
                      desktopFallback={null}
                    />
                  </div>
                )}

                {/* Form grid: one column on <=900px, two-column on desktop */}
                <div className="form-grid grid grid-cols-1 min-[900px]:grid-cols-2 gap-[0.5em]">
                {/* 1. Your name */}
                <div>
                  <label htmlFor="q-name" className="text-[0.88em] font-medium text-slate-700 block mb-[0.2em]">
                    Your name *
                  </label>
                  <input
                    id="q-name"
                    name="name"
                    required
                    placeholder="Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    className={`w-full text-[16px] min-[900px]:text-[1em] py-[0.5em] px-[0.75em] bg-white border rounded-[0.6em] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]/20 focus:border-[#1b5e3f] transition-all ${
                      fieldErrors.name ? "border-red-400 focus:ring-red-400/20 focus:border-red-400 bg-red-50/10" : "border-slate-200"
                    }`}
                  />
                  {fieldErrors.name && <p className="text-[0.76em] text-red-600 font-medium mt-[0.2em]">{fieldErrors.name}</p>}
                </div>

                {/* 2. Company */}
                <div>
                  <label htmlFor="q-company" className="text-[0.88em] font-medium text-slate-700 block mb-[0.2em]">
                    {hasGstin ? "Company / legal name *" : "Company *"}
                  </label>
                  <input
                    id="q-company"
                    name="company"
                    required
                    placeholder="Freshworks India"
                    value={formData.company}
                    onChange={(e) => {
                      setFormData({ ...formData, company: e.target.value });
                      if (fieldErrors.company) setFieldErrors((prev) => ({ ...prev, company: "" }));
                    }}
                    className={`w-full text-[16px] min-[900px]:text-[1em] py-[0.5em] px-[0.75em] bg-white border rounded-[0.6em] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]/20 focus:border-[#1b5e3f] transition-all ${
                      fieldErrors.company ? "border-red-400 focus:ring-red-400/20 focus:border-red-400 bg-red-50/10" : "border-slate-200"
                    }`}
                  />
                  {fieldErrors.company && <p className="text-[0.76em] text-red-600 font-medium mt-[0.2em]">{fieldErrors.company}</p>}
                </div>

                {/* 3. Work email */}
                <div>
                  <label htmlFor="q-email" className="text-[0.88em] font-medium text-slate-700 block mb-[0.2em]">
                    Work email *
                  </label>
                  <input
                    id="q-email"
                    name="email"
                    type="email"
                    required
                    placeholder="rahul@freshworks.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    onBlur={() => {
                      if (formData.email && !validateEmail(formData.email)) {
                        setFieldErrors((prev) => ({ ...prev, email: "Enter a valid work email." }));
                      }
                    }}
                    className={`w-full text-[16px] min-[900px]:text-[1em] py-[0.5em] px-[0.75em] bg-white border rounded-[0.6em] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]/20 focus:border-[#1b5e3f] transition-all ${
                      fieldErrors.email ? "border-red-400 focus:ring-red-400/20 focus:border-red-400 bg-red-50/10" : "border-slate-200"
                    }`}
                  />
                  {fieldErrors.email && <p className="text-[0.76em] text-red-600 font-medium mt-[0.2em]">{fieldErrors.email}</p>}
                </div>

                {/* 4. Phone / WhatsApp */}
                <div>
                  <label htmlFor="q-phone" className="text-[0.88em] font-medium text-slate-700 block mb-[0.2em]">
                    Phone / WhatsApp *
                  </label>
                  <input
                    id="q-phone"
                    name="phone"
                    required
                    type="tel"
                    placeholder="+91 92173 28777"
                    value={formData.phone}
                    onChange={(e) => {
                      const filtered = filterPhoneInput(e.target.value);
                      setFormData({ ...formData, phone: filtered });
                      if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    onBlur={() => {
                      if (formData.phone && !validateIndianPhone(formData.phone)) {
                        setFieldErrors((prev) => ({ ...prev, phone: "Enter a valid 10-digit mobile number." }));
                      }
                    }}
                    className={`w-full text-[16px] min-[900px]:text-[1em] py-[0.5em] px-[0.75em] bg-white border rounded-[0.6em] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]/20 focus:border-[#1b5e3f] transition-all ${
                      fieldErrors.phone ? "border-red-400 focus:ring-red-400/20 focus:border-red-400 bg-red-50/10" : "border-slate-200"
                    }`}
                  />
                  {fieldErrors.phone && <p className="text-[0.76em] text-red-600 font-medium mt-[0.2em]">{fieldErrors.phone}</p>}
                </div>

                {/* 5. Order purpose (full width) */}
                <div className="min-[900px]:col-span-2 relative" ref={purposeRef}>
                  <label className="text-[0.88em] font-medium text-slate-700 block mb-[0.2em]">
                    Order purpose
                  </label>
                  <button
                    type="button"
                    onClick={() => setPurposeDropdownOpen(!purposeDropdownOpen)}
                    className={`purpose-btn w-full text-[16px] min-[900px]:text-[1em] py-[0.5em] px-[0.75em] bg-white border rounded-[0.6em] text-slate-800 flex items-center justify-between transition-all cursor-pointer ${
                      purposeDropdownOpen
                        ? "border-[#1b5e3f] ring-2 ring-[#1b5e3f]/20"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="truncate text-left font-medium">
                      {formData.buyerType || "Select order purpose"}
                    </span>
                    <ChevronDown
                      className={`w-[1em] h-[1em] text-slate-400 transition-transform duration-200 flex-shrink-0 ml-[0.5em] ${
                        purposeDropdownOpen ? "rotate-180 text-[#1b5e3f]" : ""
                      }`}
                    />
                  </button>

                  {/* Popover Dropdown Menu */}
                  {purposeDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-[0.3em] z-50 bg-white border border-slate-200 rounded-[0.6em] shadow-xl py-[0.25em] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                      {ORDER_PURPOSE_OPTIONS.map((opt) => {
                        const isSelected = formData.buyerType === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, buyerType: opt }));
                              setPurposeDropdownOpen(false);
                            }}
                            className={`w-full text-left px-[0.9em] py-[0.5em] text-[15px] min-[900px]:text-[0.88em] transition-colors flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? "bg-emerald-50 text-emerald-950 font-bold border-l-3 border-[#15803d]"
                                : "text-slate-700 hover:bg-slate-50 font-normal"
                            }`}
                          >
                            <span>{opt}</span>
                            {isSelected && (
                              <Check className="w-[1em] h-[1em] text-[#15803d] flex-shrink-0 ml-[0.5em]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 6. Delivery city */}
                <div>
                  <label htmlFor="q-city" className="text-[0.88em] font-medium text-slate-700 block mb-[0.2em]">
                    Delivery city *
                  </label>
                  <input
                    id="q-city"
                    name="city"
                    required
                    placeholder="Bengaluru"
                    value={formData.city}
                    onChange={(e) => {
                      setFormData({ ...formData, city: e.target.value });
                      if (fieldErrors.city) setFieldErrors((prev) => ({ ...prev, city: "" }));
                    }}
                    className={`w-full text-[16px] min-[900px]:text-[1em] py-[0.5em] px-[0.75em] bg-white border rounded-[0.6em] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]/20 focus:border-[#1b5e3f] transition-all ${
                      fieldErrors.city ? "border-red-400 focus:ring-red-400/20 focus:border-red-400 bg-red-50/10" : "border-slate-200"
                    }`}
                  />
                  {fieldErrors.city && <p className="text-[0.76em] text-red-600 font-medium mt-[0.2em]">{fieldErrors.city}</p>}
                </div>

                {/* 7. PIN code */}
                <div>
                  <label htmlFor="q-pin" className="text-[0.88em] font-medium text-slate-700 block mb-[0.2em]">
                    PIN code *
                  </label>
                  <input
                    id="q-pin"
                    name="pin"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    placeholder="560001"
                    value={formData.pin}
                    onChange={(e) => {
                      const filtered = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setFormData({ ...formData, pin: filtered });
                      if (fieldErrors.pin) setFieldErrors((prev) => ({ ...prev, pin: "" }));
                    }}
                    onBlur={() => {
                      if (formData.pin && !validatePinCode(formData.pin)) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          pin: "Enter a valid 6-digit Indian PIN code."
                        }));
                      }
                    }}
                    className={`w-full text-[16px] min-[900px]:text-[1em] py-[0.5em] px-[0.75em] bg-white border rounded-[0.6em] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]/20 focus:border-[#1b5e3f] transition-all ${
                      fieldErrors.pin ? "border-red-400 focus:ring-red-400/20 focus:border-red-400 bg-red-50/10" : "border-slate-200"
                    }`}
                  />
                  {fieldErrors.pin && <p className="text-[0.76em] text-red-600 font-medium mt-[0.2em]">{fieldErrors.pin}</p>}
                </div>

                {/* 8. Required by */}
                <div>
                  <label htmlFor="q-date" className="text-[0.88em] font-medium text-slate-700 block mb-[0.2em]">
                    Required by
                  </label>
                  <input
                    id="q-date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full text-[16px] min-[900px]:text-[1em] py-[0.5em] px-[0.75em] bg-white border border-slate-200 rounded-[0.6em] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]/20 focus:border-[#1b5e3f]"
                  />
                </div>

                {/* 9. GSTIN (optional) - shown when non-GST mode to maintain identical layout */}
                {!hasGstin && (
                  <div>
                    <label htmlFor="q-gstin" className="text-[0.88em] font-medium text-slate-700 block mb-[0.2em]">
                      GSTIN (optional)
                    </label>
                    <input
                      id="q-gstin"
                      name="gstin"
                      placeholder="07AAAAA0000A1Z5"
                      value={formData.gstin}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase().replace(/\s+/g, "").slice(0, 15);
                        setFormData({ ...formData, gstin: val });
                      }}
                      className="w-full text-[16px] min-[900px]:text-[1em] py-[0.5em] px-[0.75em] bg-white border border-slate-200 rounded-[0.6em] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]/20 focus:border-[#1b5e3f] uppercase font-mono"
                    />
                  </div>
                )}

                {/* 10. Additional information (full width, textarea min-height 4.2em) */}
                <div className="min-[900px]:col-span-2">
                  <div className="flex items-center justify-between mb-[0.2em]">
                    <label htmlFor="q-notes" className="text-[0.88em] font-medium text-slate-700 block">
                      Additional information <span className="font-normal text-slate-400">(optional)</span>
                    </label>
                    <span className="text-[0.76em] text-slate-400">
                      {formData.notes?.length || 0}/2000
                    </span>
                  </div>
                  <textarea
                    id="q-notes"
                    name="notes"
                    maxLength={2000}
                    placeholder="Specify custom logo laser engraving, custom gift box sleeves, multi-location dispatch, or target delivery timelines..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full min-h-[4.2em] h-[4.2em] text-[16px] min-[900px]:text-[1em] p-[0.7em] bg-white border border-slate-200 rounded-[0.6em] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]/20 focus:border-[#1b5e3f] transition-all resize-y"
                  />
                </div>
              </div>

              {/* Anti-spam honeypot */}
              <input name="website" tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: -9999, opacity: 0 }} aria-hidden="true" />

              {/* Validation & stock warnings */}
              {currentMoqErrors.map((err, i) => (
                <div key={`moq-${i}`} className="p-[0.7em] bg-amber-50 border border-amber-200 rounded-[0.65em] text-[0.85em] font-semibold text-amber-800 flex items-center gap-[0.5em]">
                  <AlertCircle className="w-[1.1em] h-[1.1em] text-amber-600 flex-shrink-0" />
                  <span>{err.message}</span>
                </div>
              ))}

              {stockErrors.map((err, i) => (
                <div key={`stock-${i}`} className="p-[0.7em] bg-rose-50 border border-rose-200 rounded-[0.65em] text-[0.85em] font-semibold text-rose-700 flex items-center justify-between gap-[0.5em]">
                  <div className="flex items-center gap-[0.5em]">
                    <AlertCircle className="w-[1.1em] h-[1.1em] text-rose-600 flex-shrink-0" />
                    <span>{err.message}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQty(err.item.key, Math.max(1, err.available))}
                    className="text-[0.78em] font-bold text-rose-800 underline cursor-pointer"
                  >
                    Adjust
                  </button>
                </div>
              ))}

              {missingColors.map((it, i) => (
                <div key={`col-${i}`} className="p-[0.7em] bg-rose-50 border border-rose-200 rounded-[0.65em] text-[0.85em] font-semibold text-rose-700 flex items-center gap-[0.5em]">
                  <AlertCircle className="w-[1.1em] h-[1.1em] text-rose-600 flex-shrink-0" />
                  <span>Line item "{it.name}" requires a color selection.</span>
                </div>
              ))}

              {state.error && (
                <div className="p-[0.7em] bg-red-50 border border-red-200 rounded-[0.65em] text-[0.85em] font-semibold text-red-700 flex items-center gap-[0.5em]">
                  <AlertCircle className="w-[1.1em] h-[1.1em] text-red-600 flex-shrink-0" />
                  <span>{state.error}</span>
                </div>
              )}

              </div>

              {/* Form Submit Area: Pinned at bottom (flex: none) */}
              <div className="form-submit-area flex-none flex-shrink-0 mt-2.5 pt-2 border-t border-slate-100">
                {!isAuthenticated && !user ? (
                  <Link
                    href="/login?redirect=/quote"
                    className="w-full py-2.5 sm:py-3 px-5 rounded-lg sm:rounded-xl font-bold text-[13.5px] sm:text-[14px] tracking-wide transition-all duration-200 flex items-center justify-center gap-2 bg-[#1b5e3f] hover:bg-[#164e34] text-white cursor-pointer shadow-sm hover:shadow-md active:scale-[0.99]"
                  >
                    <Lock className="w-4 h-4 flex-shrink-0" />
                    <span>Login first to submit quote</span>
                  </Link>
                ) : (
                  <button
                    type="submit"
                    disabled={state.busy || items.length === 0 || !canSubmit}
                    className={`w-full py-2.5 sm:py-3 px-5 rounded-lg sm:rounded-xl font-bold text-[13.5px] sm:text-[14px] tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer ${
                      state.busy
                        ? "bg-[#1b5e3f] text-white cursor-wait opacity-80"
                        : "bg-[#1b5e3f] hover:bg-[#164e34] text-white active:scale-[0.99]"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {state.busy ? (
                      <>
                        <span className="w-4 h-4 border-2 border-emerald-200 border-t-white rounded-full animate-spin flex-shrink-0" />
                        <span>Generating Official Quote…</span>
                      </>
                    ) : (
                      <>
                        <span>Submit quote request</span>
                        <ArrowRight className="w-4 h-4 flex-shrink-0" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
          </MobileQuoteStepFlow>
        </div>
      </div>

      {/* ── Adjust Quantities Modal Popup ──────────────────────────────── */}
      {isAdjustOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsAdjustOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200 flex-shrink-0">
                  <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">Adjust Quantities</h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 truncate">Update item counts or remove products from your quote</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAdjustOpen(false)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Modal Body - Items List */}
            <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 space-y-3 sm:space-y-4 divide-y divide-slate-100">
              {lineItems.map((item) => (
                <div key={item.key} className="pt-3 sm:pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  {/* Left: Image + Info */}
                  <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                    {/* Product Image */}
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex-shrink-0 flex items-center justify-center relative shadow-2xs">
                      {item.image ? (
                        <img
                          src={optimizeImageUrl(item.image, { width: 140, height: 140, crop: "fill", quality: "auto" })}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-emerald-50 text-emerald-800 font-extrabold flex items-center justify-center text-base sm:text-xl">
                          {item.name ? item.name.charAt(0).toUpperCase() : "P"}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate leading-snug">{item.name}</h4>
                        {item.addOn || item.isPair || item.isPairItem ? (
                          <span className="text-[9px] sm:text-[10px] font-extrabold text-emerald-900 bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 rounded-full flex items-center gap-0.5 flex-shrink-0">
                            <span>🔗</span> Add-on{item.parentName ? ` with ${item.parentName}` : ""}
                          </span>
                        ) : (
                          <>
                            <span className="hidden sm:inline-flex text-[9px] sm:text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded-full items-center gap-0.5 flex-shrink-0">
                              <span>📦</span> Primary
                            </span>
                            {item.discountPct > 0 && (
                              <span className="sm:hidden text-[9px] font-extrabold text-[#15803d] bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full flex items-center gap-0.5 flex-shrink-0">
                                {item.discountPct}% off
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5 sm:mt-1 text-[10.5px] sm:text-xs text-slate-500">
                        {(item.colour || item.color) ? (
                          <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                            {item.colour || item.color}
                          </span>
                        ) : (
                          <span className="text-[10px] sm:text-[11px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                            Color required
                          </span>
                        )}
                        <span className="font-semibold text-slate-800">
                          ₹{Number(item.unitPrice || item.price || item.mrp || 0).toLocaleString("en-IN")}/{item.unit || "pc"}
                        </span>
                        {item.mrp > (item.unitPrice || item.price) && (
                          <span className="line-through text-slate-400 text-[10px]">
                            ₹{Number(item.mrp || 0).toLocaleString("en-IN")}
                          </span>
                        )}
                        <span className={`text-[10px] sm:text-[11px] font-bold px-1.5 py-0.2 rounded border transition-colors ${item.tierNumber === 3
                          ? "text-emerald-900 bg-emerald-100 border-emerald-300"
                          : item.tierNumber === 2
                            ? "text-teal-900 bg-teal-50 border-teal-200"
                            : "text-emerald-700 bg-emerald-50 border-emerald-200"
                          }`}>
                          {item.discountPct}% OFF
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quantity Stepper & Net Price & Delete */}
                  <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 flex-shrink-0 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <p className="text-xs sm:text-sm font-bold text-slate-900">₹{Number(item.lineNet || 0).toLocaleString("en-IN")}</p>
                      <p className="text-[10px] sm:text-[11px] text-slate-400 line-through">₹{Number(item.lineGross || 0).toLocaleString("en-IN")}</p>
                    </div>

                    {/* Stepper */}
                    <div className="inline-flex items-center bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl p-0.5 sm:p-1 shadow-2xs">
                      <button
                        type="button"
                        disabled={item.qty <= 1}
                        onClick={() => setQty(item.key, Math.max(1, (item.qty || 1) - 1))}
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg border flex items-center justify-center transition-colors shadow-2xs ${item.qty <= 1
                          ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed opacity-50"
                          : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                          }`}
                        title={item.qty <= 1 ? "Minimum line quantity is 1" : "Decrease quantity"}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>

                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={item.qty}
                        onChange={(e) => {
                          const c = e.target.value.replace(/\D/g, "");
                          setQty(item.key, c ? parseInt(c, 10) : 1);
                        }}
                        onBlur={(e) => {
                          const c = parseInt(e.target.value, 10);
                          if (isNaN(c) || c < 1) {
                            setQty(item.key, 1);
                          }
                        }}
                        className="w-9 sm:w-12 text-center text-xs font-bold text-slate-900 bg-transparent outline-none select-all"
                        aria-label={`Quantity for ${item.name}`}
                      />

                      <button
                        type="button"
                        onClick={() => setQty(item.key, (item.qty || item.minQty) + 1)}
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
                        title="Increase quantity"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => remove(item.key)}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                      title="Remove product"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
              <div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  Total Units: <span className="font-bold text-slate-800">{totalUnitsCount}</span>
                </p>
                <p className="text-xs sm:text-sm font-bold text-emerald-800">
                  Net: ₹{(estimatedTotal || 0).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/products"
                  onClick={() => setIsAdjustOpen(false)}
                  className="inline-flex items-center gap-1 py-1.5 sm:py-2 px-3 sm:px-3.5 rounded-xl border border-emerald-300/90 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs shadow-2xs transition-all active:scale-95 whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Add Products</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsAdjustOpen(false)}
                  className="btn-primary py-1.5 sm:py-2 px-4 sm:px-5 text-xs font-bold shadow-xs cursor-pointer whitespace-nowrap"
                >
                  Save &amp; Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Login Required Modal Popup ──────────────────────────────── */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setShowLoginModal(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 overflow-hidden z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200">
                <Lock className="w-5 h-5 text-[#1b5e3f]" />
              </div>
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="w-8 h-8 rounded-full border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Account Login Required
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                To generate an official GST wholesale quotation with your custom volume pricing, please log in to your account first.
              </p>
            </div>

            <div className="p-3 bg-emerald-50/80 border border-emerald-200/90 rounded-2xl text-xs space-y-1 text-slate-700">
              <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Why is login required?</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Your quote reference, GST invoice details, and dedicated B2B account manager are linked directly to your verified account.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all cursor-pointer text-center"
              >
                Review Basket
              </button>
              <Link
                href="/login?redirect=/quote"
                className="btn-primary py-2.5 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-sm text-center cursor-pointer"
              >
                <span>Log In Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
