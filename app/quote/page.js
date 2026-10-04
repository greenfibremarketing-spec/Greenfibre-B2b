"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useQuote } from "@/components/Quote";
import { useAuth } from "@/components/AuthContext";
import {
  CheckCircle2, ShoppingBag, AlertCircle, Lock, ShieldCheck,
  BadgePercent, Minus, Plus, Trash2, X, SlidersHorizontal,
  Clock, Copy, Check, ArrowRight, Leaf, ChevronDown
} from "lucide-react";
import {
  validateEmail,
  validateIndianPhone,
  formatIndianPhone,
  filterPhoneInput,
  validatePinCode
} from "@/lib/validation";

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

  const [fieldErrors, setFieldErrors] = useState({
    name: "", company: "", email: "", phone: "", city: "", pin: ""
  });

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

  const [state, setState] = useState({ busy: false, error: null, ref: null });
  const [showLoginModal, setShowLoginModal] = useState(false);

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
            gstin: formData.gstin || "",
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
          totalWithGST
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
      errors.company = "Please enter your company / organization name.";
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

    setFieldErrors({ name: "", company: "", email: "", phone: "", city: "", pin: "" });
    setState({ busy: true, error: null, ref: null });
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phone: formatIndianPhone(formData.phone),
          buyerType: formData.buyerType || "Corporate gifting and new joinee welcome kits",
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
            slug: it.slug,
            name: it.name,
            colour: it.colour || "Standard",
            qty: it.qty,
            unit: it.unit || "piece",
            mrp: it.mrp,
            lineGross: it.lineGross,
            discountPct: it.discountPct,
            tierNumber: it.tierNumber,
            lineDiscount: it.lineDiscount,
            lineNet: it.lineNet,
            isPairItem: it.isPair,
            senderName: it.senderName || "",
            receiverName: it.receiverName || "",
            giftMessage: it.giftMessage || "",
            engravingName: it.engravingName || "",
            customProductName: it.customProductName || "",
            selectedCustomizations: it.selectedCustomizations || [],
            brandingNotes: it.brandingNotes || ""
          }))
        })
      });

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
      setState({ busy: false, error: null, ref: resJson.reference });
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
                Your order summary and official quotation PDF have been generated and dispatched to{" "}
                <strong className="text-slate-900 font-bold">{formData.email}</strong>.
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

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <p className="text-sm font-medium text-slate-600">
          Review your order, add your details, and receive a formal GST quotation.
        </p>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Response within 2 business hours
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Left: Worksheet & Summary (Sticky / Fixed in view) ─────────────────────────── */}
        <div className="lg:col-span-6 space-y-5 lg:sticky lg:top-20 self-start">
          {/* Section header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#1b5e3f] text-white flex items-center justify-center text-[10.5px] sm:text-xs font-bold flex-shrink-0">1</span>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight truncate">Your Products</h3>
              <span className="text-xs font-bold text-slate-400 flex-shrink-0">({count})</span>
            </div>

            {items.length > 0 && (
              <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
                {/* Adjust Quantities button on left of Clear all */}
                <button
                  type="button"
                  onClick={() => setIsAdjustOpen(true)}
                  className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold text-[#1b5e3f] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 whitespace-nowrap"
                >
                  <SlidersHorizontal className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Adjust Quantities</span>
                  <span className="sm:hidden">Edit Quantities</span>
                </button>

                <button
                  type="button"
                  onClick={clear}
                  className="text-[11px] sm:text-xs font-medium text-slate-400 hover:text-red-500 transition-colors cursor-pointer px-1 py-1 whitespace-nowrap"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {items.length === 0 ? (
            <div className="py-12 text-center space-y-3 flex flex-col items-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-1">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Your quote basket is empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">Browse our wholesale catalog to add eco drinkware, tableware, and hampers.</p>
              <div className="pt-2">
                <Link href="/products" className="btn-primary text-xs py-2 px-4">Browse Product Catalog</Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* ── Quotation Summary Card (Exact Design from Reference) ── */}
              <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-xs sm:shadow-sm p-3.5 sm:p-6 space-y-3.5 sm:space-y-4 transition-all">
                {/* Top Header */}
                <div className="flex items-start justify-between gap-2.5 sm:gap-3">
                  <div className="space-y-0.5 sm:space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 inline-block flex-shrink-0" />
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-[17px] tracking-tight truncate">
                        Green Fibre <span className="text-slate-400 font-normal">·</span> Quotation
                      </h3>
                    </div>
                    <p className="text-[10.5px] sm:text-xs text-slate-500 truncate">
                      Direct factory wholesale rate <span className="text-slate-400">·</span> Pan-India logistics
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAdjustOpen(true)}
                    className="inline-flex items-center justify-center px-2.5 py-1 sm:px-3 sm:py-1 bg-white hover:bg-slate-50 border border-slate-200 text-[11px] sm:text-xs font-semibold text-slate-700 rounded-lg shadow-2xs hover:shadow-xs transition-all cursor-pointer whitespace-nowrap active:scale-95 flex-shrink-0"
                  >
                    Edit qty
                  </button>
                </div>

                {/* Dashed Separator */}
                <div className="border-t border-dashed border-slate-200" />

                {/* Products List */}
                <div className="space-y-3 sm:space-y-4">
                  {lineItems.map((item) => (
                    <div key={item.key} className="space-y-1">
                      <div className="flex items-start justify-between gap-2.5 sm:gap-3">
                        {/* Left Column: Name, Pair Badge, Details & Discount */}
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold text-slate-900 text-xs sm:text-[15px] leading-snug">
                              {item.name}
                            </h4>
                            {item.isPair ? (
                              <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded">
                                Pair{item.parentName ? ` with ${item.parentName}` : ""}
                              </span>
                            ) : (
                              <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded">
                                Primary
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-slate-500 flex-wrap">
                            <span>{item.colour && item.colour !== "Standard" ? item.colour : "Standard"}</span>
                            <span className="text-slate-300">·</span>
                            <span>
                              {item.qty} {
                                (item.unit === "set" || /\b(set|storage bowl)\b/i.test(item.name || ""))
                                  ? (item.qty > 1 ? "sets" : "set")
                                  : item.unit === "piece"
                                    ? (item.qty > 1 ? "pieces" : "piece")
                                    : item.unit === "box"
                                      ? (item.qty > 1 ? "boxes" : "box")
                                      : item.unit === "pack"
                                        ? (item.qty > 1 ? "packs" : "pack")
                                        : (item.unit ? (item.qty > 1 ? `${item.unit}s` : item.unit) : (item.qty > 1 ? "pieces" : "piece"))
                              } × ₹{item.mrp.toLocaleString("en-IN")}
                            </span>
                            {item.discountPct > 0 && (
                              <span className="text-[9.5px] sm:text-[10px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded ml-0.5">
                                {item.discountPct}% off
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right Column: Net Price + Strikethrough Gross */}
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm sm:text-lg font-black text-slate-900">
                            ₹{item.lineNet.toLocaleString("en-IN")}
                          </div>
                          <div className="text-[10.5px] sm:text-xs text-slate-400 line-through">
                            ₹{item.lineGross.toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dashed Separator */}
                <div className="border-t border-dashed border-slate-200" />

                {/* Financial Ledger Breakdown */}
                <div className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Catalog gross ({totalUnitsCount} units)</span>
                    <span className="font-medium text-slate-800">₹{totalGross.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-emerald-700 font-medium">Volume tier discount</span>
                    <span className="font-bold text-emerald-700">−₹{totalItemDiscount.toLocaleString("en-IN")}</span>
                  </div>

                  {hasBundleBonus && bundleBonusAmount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-700 font-medium">Bundle pairing bonus (5%)</span>
                      <span className="font-bold text-emerald-700">−₹{bundleBonusAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-0.5 sm:pt-1">
                    <span className="font-bold text-slate-900">Net taxable subtotal</span>
                    <span className="font-extrabold text-slate-900 text-xs sm:text-base">₹{(estimatedTotal || 0).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Total Savings Pill / Card */}
                {totalSavings > 0 && (
                  <div className="bg-[#eef8f2] border border-[#cbebd4] rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-bold text-[#14532d] text-[11px] sm:text-sm">
                      You save ₹{totalSavings.toLocaleString("en-IN")} ({savingsPct}%)
                    </span>
                    <span className="font-semibold text-[#15803d] text-[11px] sm:text-sm">
                      Direct factory rate
                    </span>
                  </div>
                )}

                {/* GST Row */}
                <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600">
                  <span>GST 18% (input tax credit eligible)</span>
                  <span className="font-medium text-slate-700">₹{estimatedGST.toLocaleString("en-IN")}</span>
                </div>

                {/* Big Solid Green Final Quotation Banner */}
                <div className="bg-[#16a34a] text-white rounded-xl p-3.5 sm:p-5 flex items-center justify-between shadow-xs">
                  <div>
                    <h4 className="text-sm sm:text-lg font-bold text-white leading-tight">
                      Final quotation
                    </h4>
                    <span className="text-[10.5px] sm:text-xs text-emerald-100 font-normal block mt-0.5">
                      Incl. GST
                    </span>
                  </div>
                  <div className="text-xl sm:text-3xl font-black text-white tracking-tight">
                    ₹{totalWithGST.toLocaleString("en-IN")}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={isDownloadingPdf}
                    className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isDownloadingPdf ? (
                      <>
                        <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
                        <span>Generating PDF…</span>
                      </>
                    ) : (
                      <span>Download PDF</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleRequestQuoteClick}
                    className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl bg-[#16a34a] hover:bg-[#166534] text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Request this quote</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Your Details Form ──────────────────────────────────── */}
        <div className="lg:col-span-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">2</span>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Your Details</h3>
            </div>
            {isAuthenticated && user && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                Logged in as {user.fullName || user.companyName}
              </span>
            )}
          </div>

          {(!isAuthenticated && !user) && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                    Login Required to Request Quote
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                    Please log in or register before submitting your request to lock in your direct factory wholesale rate.
                  </p>
                </div>
              </div>
              <Link
                href="/login?redirect=/quote"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-xs transition-all whitespace-nowrap cursor-pointer flex-shrink-0 active:scale-95"
              >
                <span>Login to Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          <form id="quote-details-form" onSubmit={handleSubmit} noValidate className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="q-name" className="text-xs font-medium text-slate-600">Your name *</label>
                <input id="q-name" name="name" required placeholder="Rahul Sharma" value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  className={`w-full text-xs py-2 px-3 bg-white border rounded-lg text-slate-900 placeholder:text-slate-300 focus:ring-2 outline-none transition-all ${fieldErrors.name
                    ? "border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50/10"
                    : "border-slate-200 focus:ring-[#1b5e3f] focus:border-[#1b5e3f]"
                    }`} />
                {fieldErrors.name && (
                  <p className="text-[11px] text-red-600 font-medium">{fieldErrors.name}</p>
                )}
              </div>
              <div className="space-y-1">
                <label htmlFor="q-company" className="text-xs font-medium text-slate-600">Company *</label>
                <input id="q-company" name="company" required placeholder="Freshworks India" value={formData.company}
                  onChange={(e) => {
                    setFormData({ ...formData, company: e.target.value });
                    if (fieldErrors.company) setFieldErrors((prev) => ({ ...prev, company: "" }));
                  }}
                  className={`w-full text-xs py-2 px-3 bg-white border rounded-lg text-slate-900 placeholder:text-slate-300 focus:ring-2 outline-none transition-all ${fieldErrors.company
                    ? "border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50/10"
                    : "border-slate-200 focus:ring-[#1b5e3f] focus:border-[#1b5e3f]"
                    }`} />
                {fieldErrors.company && (
                  <p className="text-[11px] text-red-600 font-medium">{fieldErrors.company}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="q-email" className="text-xs font-medium text-slate-600">Work email *</label>
                <input id="q-email" name="email" type="email" required placeholder="rahul@freshworks.com" value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  onBlur={() => {
                    if (formData.email && !validateEmail(formData.email)) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        email: "Please enter a valid work email (e.g. rahul@company.com)."
                      }));
                    }
                  }}
                  className={`w-full text-xs py-2 px-3 bg-white border rounded-lg text-slate-900 placeholder:text-slate-300 focus:ring-2 outline-none transition-all ${fieldErrors.email
                    ? "border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50/10"
                    : "border-slate-200 focus:ring-[#1b5e3f] focus:border-[#1b5e3f]"
                    }`} />
                {fieldErrors.email && (
                  <p className="text-[11px] text-red-600 font-medium">{fieldErrors.email}</p>
                )}
              </div>
              <div className="space-y-1">
                <label htmlFor="q-phone" className="text-xs font-medium text-slate-600">
                  Phone / WhatsApp * <span className="text-[10px] text-slate-400 font-normal">(+91 10 digits)</span>
                </label>
                <input id="q-phone" name="phone" required type="tel" placeholder="+91 92173 28777" value={formData.phone}
                  onChange={(e) => {
                    const filtered = filterPhoneInput(e.target.value);
                    setFormData({ ...formData, phone: filtered });
                    if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: "" }));
                  }}
                  onBlur={() => {
                    if (formData.phone && !validateIndianPhone(formData.phone)) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        phone: "Enter a valid 10-digit mobile number starting with 6-9 (e.g. +91 98765 43210)."
                      }));
                    }
                  }}
                  className={`w-full text-xs py-2 px-3 bg-white border rounded-lg text-slate-900 placeholder:text-slate-300 focus:ring-2 outline-none transition-all ${fieldErrors.phone
                    ? "border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50/10"
                    : "border-slate-200 focus:ring-[#1b5e3f] focus:border-[#1b5e3f]"
                    }`} />
                {fieldErrors.phone && (
                  <p className="text-[11px] text-red-600 font-medium">{fieldErrors.phone}</p>
                )}
              </div>
            </div>

            {/* Custom Premium Order Purpose Dropdown */}
            <div className="space-y-1 relative" ref={purposeRef}>
              <label className="text-xs font-medium text-slate-600">Order purpose</label>
              <button
                type="button"
                onClick={() => setPurposeDropdownOpen(!purposeDropdownOpen)}
                className={`w-full text-xs py-2 px-3 bg-white border rounded-lg text-slate-800 flex items-center justify-between transition-all cursor-pointer ${purposeDropdownOpen
                  ? "border-[#1b5e3f] ring-2 ring-[#1b5e3f]/20 bg-white"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
              >
                <span className="truncate text-left font-medium">
                  {formData.buyerType || "Select order purpose"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ml-2 ${purposeDropdownOpen ? "rotate-180 text-[#1b5e3f]" : ""
                    }`}
                />
              </button>

              {/* Popover Dropdown Menu */}
              {purposeDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-xl py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
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
                        className={`w-full text-left px-3.5 py-2.5 text-xs transition-all flex items-center justify-between cursor-pointer ${isSelected
                          ? "bg-emerald-50 text-emerald-950 font-bold border-l-3 border-[#15803d]"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-normal"
                          }`}
                      >
                        <span>{opt}</span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-[#15803d] flex-shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="q-city" className="text-xs font-medium text-slate-600">Delivery city *</label>
                <input id="q-city" name="city" required placeholder="Bengaluru" value={formData.city}
                  onChange={(e) => {
                    setFormData({ ...formData, city: e.target.value });
                    if (fieldErrors.city) setFieldErrors((prev) => ({ ...prev, city: "" }));
                  }}
                  className={`w-full text-xs py-2 px-3 bg-white border rounded-lg text-slate-900 placeholder:text-slate-300 focus:ring-2 outline-none transition-all ${fieldErrors.city
                    ? "border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50/10"
                    : "border-slate-200 focus:ring-[#1b5e3f] focus:border-[#1b5e3f]"
                    }`} />
                {fieldErrors.city && (
                  <p className="text-[11px] text-red-600 font-medium">{fieldErrors.city}</p>
                )}
              </div>
              <div className="space-y-1">
                <label htmlFor="q-pin" className="text-xs font-medium text-slate-600">PIN code *</label>
                <input id="q-pin" name="pin" pattern="[0-9]{6}" maxLength={6} required placeholder="560001" value={formData.pin}
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
                  className={`w-full text-xs py-2 px-3 bg-white border rounded-lg text-slate-900 placeholder:text-slate-300 focus:ring-2 outline-none transition-all ${fieldErrors.pin
                    ? "border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50/10"
                    : "border-slate-200 focus:ring-[#1b5e3f] focus:border-[#1b5e3f]"
                    }`} />
                {fieldErrors.pin && (
                  <p className="text-[11px] text-red-600 font-medium">{fieldErrors.pin}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="q-date" className="text-xs font-medium text-slate-600">Required by</label>
                <input id="q-date" name="date" type="date" value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full text-xs py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-[#1b5e3f] outline-none" />
              </div>
              <div className="space-y-1">
                <label htmlFor="q-gstin" className="text-xs font-medium text-slate-600">GSTIN (optional)</label>
                <input id="q-gstin" name="gstin" placeholder="07AAAAA0000A1Z5" value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                  className="w-full text-xs py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#1b5e3f] outline-none uppercase font-mono" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="q-notes" className="text-xs font-medium text-slate-700">
                  Additional information <span className="text-[11px] font-normal text-slate-400">(optional)</span>
                </label>
                <span className="text-[10px] text-slate-400">
                  {formData.notes?.length || 0}/2000
                </span>
              </div>
              <textarea
                id="q-notes"
                name="notes"
                rows={3}
                maxLength={2000}
                placeholder="Specify custom logo laser engraving, custom gift box sleeves, multi-location dispatch, sample kit requests, or target delivery timelines..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full text-xs p-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#1b5e3f] focus:border-[#1b5e3f] outline-none transition-all resize-y min-h-[72px]"
              />
            </div>

            {/* Anti-spam honeypot */}
            <input name="website" tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: -9999, opacity: 0 }} aria-hidden="true" />

            {state.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>{state.error}</span>
              </div>
            )}

            <div className="pt-2">
              {!isAuthenticated && !user ? (
                <Link
                  href="/login?redirect=/quote"
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md bg-brand-600 hover:bg-brand-500 text-white active:scale-[0.99] cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Please Login First to Submit Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  type="submit"
                  disabled={state.busy || items.length === 0}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md ${state.busy
                    ? "bg-gradient-to-r from-[#0d3f2c] via-[#15803d] to-[#0d3f2c] text-white cursor-wait ring-2 ring-emerald-400/40 shadow-emerald-900/20"
                    : "btn-primary hover:shadow-lg active:scale-[0.99] cursor-pointer"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {state.busy ? (
                    <>
                      {/* Revolving Circle Spinner */}
                      <span className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
                        <svg
                          className="animate-spin w-5 h-5 text-emerald-300"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3.5"
                          />
                          <path
                            className="opacity-100"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      </span>
                      {/* Eco Leaf Icon */}
                      <Leaf className="w-4 h-4 text-emerald-200 animate-pulse flex-shrink-0" />
                      <span>Generating Official Quote…</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Quote Request</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              Direct manufacturer confidentiality: We never share your company contact details.
            </p>
          </form>
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
                          src={item.image}
                          alt={item.name}
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
                        {item.isPair ? (
                          <span className="text-[9px] sm:text-[10px] font-extrabold text-emerald-900 bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 rounded-full flex items-center gap-0.5 flex-shrink-0">
                            <span>🔗</span> Pair{item.parentName ? ` with ${item.parentName}` : ""}
                          </span>
                        ) : (
                          <span className="text-[9px] sm:text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded-full flex items-center gap-0.5 flex-shrink-0">
                            <span>📦</span> Primary
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5 sm:mt-1 text-[10.5px] sm:text-xs text-slate-500">
                        {item.colour && item.colour !== "Standard" && (
                          <span className="text-[10px] sm:text-[11px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                            {item.colour}
                          </span>
                        )}
                        <span>
                          ₹{item.mrp.toLocaleString("en-IN")}/{item.unit || "pc"}
                        </span>
                        {!item.isPair && (
                          <span className="text-[9.5px] sm:text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded-md">
                            MOQ: {item.minQty}
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
                      <p className="text-xs sm:text-sm font-bold text-slate-900">₹{item.lineNet.toLocaleString("en-IN")}</p>
                      <p className="text-[10px] sm:text-[11px] text-slate-400 line-through">₹{item.lineGross.toLocaleString("en-IN")}</p>
                    </div>

                    {/* Stepper */}
                    <div className="inline-flex items-center bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl p-0.5 sm:p-1 shadow-2xs">
                      <button
                        type="button"
                        disabled={item.qty <= item.minQty}
                        onClick={() => setQty(item.key, Math.max(item.minQty, (item.qty || item.minQty) - 1))}
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg border flex items-center justify-center transition-colors shadow-2xs ${
                          item.qty <= item.minQty
                            ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed opacity-50"
                            : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                        }`}
                        title={item.qty <= item.minQty ? (item.isPair ? "Minimum quantity is 1" : "Minimum wholesale quantity is 10") : "Decrease quantity"}
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
                          setQty(item.key, c ? parseInt(c, 10) : item.minQty);
                        }}
                        onBlur={(e) => {
                          const c = parseInt(e.target.value, 10);
                          if (isNaN(c) || c < item.minQty) {
                            setQty(item.key, item.minQty);
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
            <div className="px-4 py-3 sm:px-6 sm:py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  Total Units: <span className="font-bold text-slate-800">{totalUnitsCount}</span>
                </p>
                <p className="text-xs sm:text-sm font-bold text-emerald-800">
                  Net: ₹{(estimatedTotal || 0).toLocaleString("en-IN")}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAdjustOpen(false)}
                className="btn-primary py-1.5 sm:py-2 px-4 sm:px-6 text-xs font-bold shadow-xs cursor-pointer"
              >
                Save &amp; Close
              </button>
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
