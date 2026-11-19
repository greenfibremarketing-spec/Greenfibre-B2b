"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuote, moqErrors } from "@/components/Quote";
import { useAuth } from "@/components/AuthContext";
import {
  CheckCircle2, ShoppingBag, AlertCircle, Lock, ShieldCheck,
  BadgePercent, Minus, Plus, Trash2, X, SlidersHorizontal,
  Clock, Copy, Check, ArrowRight, Leaf, ChevronDown, Download
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

  const [catalogProducts, setCatalogProducts] = useState([]);
  const [quotationDate, setQuotationDate] = useState("");
  const [mobileTab, setMobileTab] = useState("invoice"); // "invoice" | "form"

  useEffect(() => {
    setQuotationDate(
      new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
    );
  }, []);

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
  const canSubmit = lineItems.length > 0 && currentMoqErrors.length === 0 && stockErrors.length === 0 && missingColors.length === 0;

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

    setFieldErrors({ name: "", company: "", email: "", phone: "", city: "", pin: "" });
    setState({ busy: true, error: null, ref: null });
    try {
      const [response] = await Promise.all([
        fetch("/api/enquiry", {
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

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-center py-2 sm:py-4">
      <div className="w-full max-w-[1240px] mx-auto px-3 sm:px-6 h-[90dvh] max-h-[90dvh] flex flex-col">
        {/* Premium Leaf Loader displayed on top during quote submission */}
        <GreenyLoader
          loading={state.busy}
          minDuration={4200}
          title="Processing Wholesale Quotation"
        />

        {/* Mobile Tab Switcher (Visible on mobile < 900px, hidden on desktop >= 900px) */}
        <div className="flex min-[900px]:hidden bg-slate-100 p-1 rounded-xl mb-2 flex-shrink-0 border border-slate-200/80">
          <button
            type="button"
            onClick={() => setMobileTab("invoice")}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mobileTab === "invoice"
                ? "bg-white text-[#1b5e3f] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-[#1b5e3f] text-white text-[10px] flex items-center justify-center font-bold">1</span>
            <span>Quotation ({count})</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("form")}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mobileTab === "form"
                ? "bg-white text-[#1b5e3f] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-[#1b5e3f] text-white text-[10px] flex items-center justify-center font-bold">2</span>
            <span>Your Details</span>
          </button>
        </div>

        <div className="grid grid-cols-1 min-[900px]:grid-cols-[1.2fr_1fr] gap-4 lg:gap-6 flex-1 min-h-0 items-stretch">
          {/* ── Left Card: Invoice ────────────────────────────────────────── */}
          <div className={`bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex-col h-full min-h-0 overflow-hidden ${
            mobileTab === "invoice" ? "flex" : "hidden min-[900px]:flex"
          }`}>
            {/* 1. Header: "Your Products (N)" with "+ Add more products" button */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 min-h-[32px] mb-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1b5e3f] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  1
                </span>
                <h3 className="font-bold text-slate-900 text-base tracking-tight">
                  Your Products ({count})
                </h3>
              </div>
              <div className="flex items-center gap-2.5">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/80 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                  title="Browse catalog to add more products"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add more products</span>
                </Link>
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={clear}
                    className="text-xs text-slate-400 hover:text-rose-600 transition-colors cursor-pointer px-1"
                    title="Clear quote basket"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* 2. Invoice header: "Green Fibre" (bold, brand green) + subline, Right: QUOTATION, date, Draft. 2px green line under it */}
            <div className="flex items-start justify-between pb-2 border-b-2 border-[#16a34a] flex-shrink-0">
              <div>
                <div className="font-bold text-[#1b5e3f] text-lg leading-tight tracking-tight">
                  Green Fibre
                </div>
                <p className="text-xs text-slate-500 leading-normal mt-0.5">
                  Direct factory wholesale rate · Pan-India logistics
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-bold text-slate-800 text-sm tracking-wider uppercase">
                  QUOTATION
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-end gap-1.5 mt-0.5">
                  <span>{quotationDate || "Draft Date"}</span>
                  <span className="text-slate-300">·</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[11px]">
                    Draft
                  </span>
                </div>
              </div>
            </div>

            {/* 3. One-line supplier text under it (muted), then a thin divider */}
            <div className="py-1.5 border-b border-slate-100 text-xs text-slate-500 mb-2 flex-shrink-0">
              <span className="font-semibold text-slate-700">Supplier: </span>
              Green Fibre India Pvt. Ltd. · Direct factory wholesale rate · 18% GST input tax credit
            </div>

            {items.length === 0 ? (
              <div className="py-8 text-center space-y-3 flex flex-col items-center justify-center flex-1">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-1">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Your quote basket is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs">Browse our wholesale catalog to add eco drinkware, tableware, and hampers.</p>
                <div className="pt-2">
                  <Link href="/products" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1b5e3f] hover:bg-[#164e34] text-white text-xs font-bold transition-colors">
                    Browse Product Catalog
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col flex-1 min-h-0">
                {/* 4. Item table with columns #, Item, Qty, Rate, Amount */}
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto pr-1">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white z-10">
                      <tr className="bg-slate-50/95 border-b border-slate-200 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                        <th className="py-2 px-2.5 w-8 text-center">#</th>
                        <th className="py-2 px-2.5">Item</th>
                        <th className="py-2 px-2.5 text-center w-28">Qty</th>
                        <th className="py-2 px-2.5 text-right w-20">Rate</th>
                        <th className="py-2 px-2.5 text-right w-24">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {lineItems.map((item, idx) => {
                        const stockInfo = getStockInfo(item);
                        const colorDisplay = (item.colour || item.color || "").trim();
                        const isAddon = Boolean(item.addOn || item.isPair || item.isPairItem);
                        const rate = item.unitPrice || item.price || item.mrp;

                        return (
                          <tr key={item.key} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-2 px-2.5 text-center text-slate-400 text-xs align-middle">
                              {idx + 1}
                            </td>
                            <td className="py-2 px-2.5 align-middle">
                              {/* Line 1: item name (bold) + tag (Primary / Add-on) */}
                              <div className="flex items-center gap-1.5 flex-wrap leading-snug">
                                <span className="font-bold text-slate-900 text-[13.5px]">
                                  {item.name}
                                </span>
                                {isAddon ? (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/70 rounded">
                                    Add-on
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded">
                                    Primary
                                  </span>
                                )}
                              </div>

                              {/* Line 2 (muted): variant · struck-through catalog price · green "% off" badge */}
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap mt-0.5">
                                {colorDisplay ? (
                                  <span className="font-medium text-slate-600">{colorDisplay}</span>
                                ) : (
                                  <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                                    Color required
                                  </span>
                                )}
                                {item.mrp > rate && (
                                  <>
                                    <span className="text-slate-300">·</span>
                                    <span className="line-through text-slate-400 text-xs">
                                      ₹{item.mrp.toLocaleString("en-IN")}
                                    </span>
                                  </>
                                )}
                                {item.discountPct > 0 && (
                                  <>
                                    <span className="text-slate-300">·</span>
                                    <span className="text-[11px] font-bold text-[#15803d] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                                      {item.discountPct}% off
                                    </span>
                                  </>
                                )}
                              </div>

                              {/* Stock exceeded warning */}
                              {stockInfo.isExceeded && (
                                <div className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span>Only {stockInfo.available} {colorDisplay} available</span>
                                  <button
                                    type="button"
                                    onClick={() => setQty(item.key, Math.max(1, stockInfo.available))}
                                    className="underline hover:text-rose-800 cursor-pointer font-bold ml-1"
                                  >
                                    Set to {stockInfo.available}
                                  </button>
                                </div>
                              )}
                            </td>
                            <td className="py-2 px-2.5 text-center align-middle whitespace-nowrap">
                              {/* Qty: − / + stepper plus a small × remove button */}
                              <div className="inline-flex items-center gap-1.5">
                                <div className="inline-flex items-center border border-slate-200 rounded-md bg-white overflow-hidden shadow-2xs">
                                  <button
                                    type="button"
                                    disabled={item.qty <= 1}
                                    onClick={() => setQty(item.key, Math.max(1, (item.qty || 1) - 1))}
                                    className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer font-bold text-xs select-none transition-colors"
                                    aria-label="Decrease quantity"
                                  >
                                    −
                                  </button>
                                  <span className="px-2 text-xs font-bold text-slate-800 min-w-[22px] text-center select-none">
                                    {item.qty}
                                  </span>
                                  <button
                                    type="button"
                                    disabled={stockInfo.available !== null && item.qty >= stockInfo.available}
                                    onClick={() => setQty(item.key, (item.qty || 1) + 1)}
                                    className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer font-bold text-xs select-none transition-colors"
                                    aria-label="Increase quantity"
                                  >
                                    +
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => remove(item.key)}
                                  className="w-5 h-5 rounded text-slate-300 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer text-xs font-bold"
                                  title="Remove item"
                                  aria-label="Remove item"
                                >
                                  ×
                                </button>
                              </div>
                            </td>
                            <td className="py-2 px-2.5 text-right text-slate-700 font-medium text-xs align-middle whitespace-nowrap">
                              ₹{rate.toLocaleString("en-IN")}
                            </td>
                            <td className="py-2 px-2.5 text-right font-bold text-slate-900 text-sm align-middle whitespace-nowrap">
                              ₹{item.lineNet.toLocaleString("en-IN")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* 6. Totals, right-aligned, 72% width */}
                <div className="flex-shrink-0 pt-2 border-t border-slate-100 bg-white">
                  <div className="ml-auto w-full sm:w-[72%] space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Catalog gross ({totalUnitsCount} units)</span>
                      <span className="font-medium text-slate-800">₹{totalGross.toLocaleString("en-IN")}</span>
                    </div>

                    {totalItemDiscount > 0 && (
                      <div className="flex items-center justify-between text-[#15803d]">
                        <span>Volume tier discount</span>
                        <span className="font-semibold">−₹{totalItemDiscount.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    {hasBundleBonus && bundleBonusAmount > 0 && (
                      <div className="flex items-center justify-between text-[#15803d]">
                        <span>Bundle pairing bonus (5%)</span>
                        <span className="font-semibold">−₹{bundleBonusAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 font-bold text-slate-900 text-[13px]">
                      <span>Net taxable subtotal</span>
                      <span className="font-extrabold">₹{(estimatedTotal || 0).toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span>GST 18% (ITC eligible)</span>
                      <span className="font-medium text-slate-700">₹{estimatedGST.toLocaleString("en-IN")}</span>
                    </div>

                    {/* Green Final quotation bar with total */}
                    <div className="bg-[#16a34a] text-white rounded-xl py-2 px-3.5 flex items-center justify-between shadow-2xs mt-1.5">
                      <div>
                        <div className="text-xs font-bold leading-tight">Final quotation</div>
                        <span className="text-[10px] text-emerald-100 font-normal">Incl. GST</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none">
                        ₹{totalWithGST.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>

                  {/* 7. Footer: "You save ₹X (Y%)" in green on left, "Download PDF" button on right */}
                  <div className="flex items-center justify-between pt-2 mt-1.5 border-t border-slate-200 text-xs">
                    {totalSavings > 0 ? (
                      <span className="font-bold text-[#15803d]">
                        You save ₹{totalSavings.toLocaleString("en-IN")} ({savingsPct}%)
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">Direct factory wholesale rate</span>
                    )}
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      disabled={isDownloadingPdf}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer disabled:opacity-60 shadow-2xs"
                    >
                      {isDownloadingPdf ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
                          <span>Generating…</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5 text-slate-500" />
                          <span>Download PDF</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Mobile CTA: Proceed to Details */}
                  <div className="mt-2 min-[900px]:hidden">
                    <button
                      type="button"
                      onClick={() => setMobileTab("form")}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#1b5e3f] hover:bg-[#164e34] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <span>Proceed to Details & Submit</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Right Card: Details Form ────────────────────────────────────── */}
          <div className={`bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex-col h-full min-h-0 overflow-hidden ${
            mobileTab === "form" ? "flex" : "hidden min-[900px]:flex"
          }`}>
            {/* Header row: Numbered circle + title */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 min-h-[32px] mb-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1b5e3f] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  2
                </span>
                <h3 className="font-bold text-slate-900 text-base tracking-tight">
                  Your Details
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {/* On mobile: option to go back to quotation */}
                <button
                  type="button"
                  onClick={() => setMobileTab("invoice")}
                  className="min-[900px]:hidden text-xs text-emerald-800 font-bold hover:underline"
                >
                  ← View Quotation
                </button>
                {isAuthenticated && user && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Logged in as {user.fullName || user.companyName}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Login banner for logged-out users */}
            {(!isAuthenticated && !user) && (
              <div className="p-2.5 mb-2 bg-emerald-50/80 border border-emerald-200/90 rounded-xl flex items-center justify-between gap-2 text-xs flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-800 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">Login to lock in your factory wholesale rate</span>
                </div>
                <Link
                  href="/login?redirect=/quote"
                  className="text-emerald-800 font-bold hover:underline whitespace-nowrap text-xs"
                >
                  Login →
                </Link>
              </div>
            )}

            <form id="quote-details-form" onSubmit={handleSubmit} noValidate className="flex flex-col flex-1 min-h-0">
              {/* Form fields in scrollable area so it never overflows 90dvh */}
              <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
                {/* Two-column field grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* 1. Your name */}
                  <div>
                    <label htmlFor="q-name" className="text-xs font-semibold text-slate-700 block mb-1">
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
                      className={`w-full text-xs sm:text-[13px] py-2 px-3 bg-white border rounded-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]/20 focus:border-[#1b5e3f] transition-all ${
                        fieldErrors.name ? "border-red-400 focus:ring-red-400/20 focus:border-red-400 bg-red-50/10" : "border-slate-200"
                      }`}
                    />
                    {fieldErrors.name && <p className="text-[11px] text-red-600 font-medium mt-0.5">{fieldErrors.name}</p>}
                  </div>

                  {/* 2. Company */}
                  <div>
                    <label htmlFor="q-company" className="text-xs font-semibold text-slate-700 block mb-1">
                      Company *
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
                      className={`w-full text-xs sm:text-[13px] py-2 px-3 bg-white border rounded-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]/20 focus:border-[#1b5e3f] transition-all ${
                        fieldErrors.company ? "border-red-400 focus:ring-red-400/20 focus:border-red-400 bg-red-50/10" : "border-slate-200"
                      }`}
                    />
                    {fieldErrors.company && <p className="text-[11px] text-red-600 font-medium mt-0.5">{fieldErrors.company}</p>}
                  </div>

                  {/* 3. Work email */}
                  <div>
                    <label htmlFor="q-email" className="text-xs font-semibold text-slate-700 block mb-1">
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
                      className={`w-full text-xs sm:text-[13px] py-2 px-3 bg-white border rounded-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]/20 focus:border-[#1b5e3f] transition-all ${
                        fieldErrors.email ? "border-red-400 focus:ring-red-400/20 focus:border-red-400 bg-red-50/10" : "border-slate-200"
                      }`}
                    />
                    {fieldErrors.email && <p className="text-[11px] text-red-600 font-medium mt-0.5">{fieldErrors.email}</p>}
                  </div>

                  {/* 4. Phone / WhatsApp */}
                  <div>
                    <label htmlFor="q-phone" className="text-xs font-semibold text-slate-700 block mb-1">
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
                      className={`w-full text-xs sm:text-[13px] py-2 px-3 bg-white border rounded-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]/20 focus:border-[#1b5e3f] transition-all ${
                        fieldErrors.phone ? "border-red-400 focus:ring-red-400/20 focus:border-red-400 bg-red-50/10" : "border-slate-200"
                      }`}
                    />
                    {fieldErrors.phone && <p className="text-[11px] text-red-600 font-medium mt-0.5">{fieldErrors.phone}</p>}
                  </div>

                  {/* 5. Order purpose (full width) */}
                  <div className="sm:col-span-2 relative" ref={purposeRef}>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Order purpose
                    </label>
                    <button
                      type="button"
                      onClick={() => setPurposeDropdownOpen(!purposeDropdownOpen)}
                      className={`w-full text-xs sm:text-[13px] py-2 px-3 bg-white border rounded-lg text-slate-800 flex items-center justify-between transition-all cursor-pointer ${
                        purposeDropdownOpen
                          ? "border-[#1b5e3f] ring-2 ring-[#1b5e3f]/20"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <span className="truncate text-left font-medium">
                        {formData.buyerType || "Select order purpose"}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 flex-shrink-0 ml-2 ${
                          purposeDropdownOpen ? "rotate-180 text-[#1b5e3f]" : ""
                        }`}
                      />
                    </button>

                    {/* Popover Dropdown Menu */}
                    {purposeDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-lg shadow-xl py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
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
                              className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? "bg-emerald-50 text-emerald-950 font-bold border-l-3 border-[#15803d]"
                                  : "text-slate-700 hover:bg-slate-50 font-normal"
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

                  {/* 6. Delivery city */}
                  <div>
                    <label htmlFor="q-city" className="text-xs font-semibold text-slate-700 block mb-1">
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
                      className={`w-full text-xs sm:text-[13px] py-2 px-3 bg-white border rounded-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]/20 focus:border-[#1b5e3f] transition-all ${
                        fieldErrors.city ? "border-red-400 focus:ring-red-400/20 focus:border-red-400 bg-red-50/10" : "border-slate-200"
                      }`}
                    />
                    {fieldErrors.city && <p className="text-[11px] text-red-600 font-medium mt-0.5">{fieldErrors.city}</p>}
                  </div>

                  {/* 7. PIN code */}
                  <div>
                    <label htmlFor="q-pin" className="text-xs font-semibold text-slate-700 block mb-1">
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
                      className={`w-full text-xs sm:text-[13px] py-2 px-3 bg-white border rounded-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]/20 focus:border-[#1b5e3f] transition-all ${
                        fieldErrors.pin ? "border-red-400 focus:ring-red-400/20 focus:border-red-400 bg-red-50/10" : "border-slate-200"
                      }`}
                    />
                    {fieldErrors.pin && <p className="text-[11px] text-red-600 font-medium mt-0.5">{fieldErrors.pin}</p>}
                  </div>

                  {/* 8. Required by */}
                  <div>
                    <label htmlFor="q-date" className="text-xs font-semibold text-slate-700 block mb-1">
                      Required by
                    </label>
                    <input
                      id="q-date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full text-xs sm:text-[13px] py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]/20 focus:border-[#1b5e3f]"
                    />
                  </div>

                  {/* 9. GSTIN (optional) */}
                  <div>
                    <label htmlFor="q-gstin" className="text-xs font-semibold text-slate-700 block mb-1">
                      GSTIN (optional)
                    </label>
                    <input
                      id="q-gstin"
                      name="gstin"
                      placeholder="07AAAAA0000A1Z5"
                      value={formData.gstin}
                      onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                      className="w-full text-xs sm:text-[13px] py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]/20 focus:border-[#1b5e3f] uppercase font-mono"
                    />
                  </div>

                  {/* 10. Additional information (full width) */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="q-notes" className="text-xs font-semibold text-slate-700 block">
                        Additional information <span className="font-normal text-slate-400">(optional)</span>
                      </label>
                      <span className="text-[11px] text-slate-400">
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
                      className="w-full h-16 sm:h-20 min-h-[4rem] text-xs sm:text-[13px] p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1b5e3f]/20 focus:border-[#1b5e3f] transition-all resize-y"
                    />
                  </div>
                </div>

                {/* Anti-spam honeypot */}
                <input name="website" tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: -9999, opacity: 0 }} aria-hidden="true" />

                {/* Validation & stock warnings */}
                {currentMoqErrors.map((err, i) => (
                  <div key={`moq-${i}`} className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>{err.message}</span>
                  </div>
                ))}

                {stockErrors.map((err, i) => (
                  <div key={`stock-${i}`} className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700 flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                      <span>{err.message}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setQty(err.item.key, Math.max(1, err.available))}
                      className="text-[11px] font-bold text-rose-800 underline cursor-pointer"
                    >
                      Adjust
                    </button>
                  </div>
                ))}

                {missingColors.map((it, i) => (
                  <div key={`col-${i}`} className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                    <span>Line item "{it.name}" requires a color selection.</span>
                  </div>
                ))}

                {state.error && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                    <span>{state.error}</span>
                  </div>
                )}
              </div>

              {/* Submit Button & Confidentiality pinned at bottom */}
              <div className="flex-shrink-0 pt-2 border-t border-slate-100 bg-white mt-auto">
                {!isAuthenticated && !user ? (
                  <Link
                    href="/login?redirect=/quote"
                    className="w-full py-2.5 sm:py-3 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 bg-[#1b5e3f] hover:bg-[#164e34] text-white cursor-pointer shadow-sm active:scale-[0.99]"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Login first to submit quote</span>
                  </Link>
                ) : (
                  <button
                    type="submit"
                    disabled={state.busy || items.length === 0 || !canSubmit}
                    className={`w-full py-2.5 sm:py-3 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
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
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}

                {/* Confidentiality note */}
                <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1 mt-1.5">
                  <Lock className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  Direct manufacturer confidentiality: We never share your company contact details.
                </p>
              </div>
            </form>
          </div>
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
                          <span className="text-[9px] sm:text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded-full flex items-center gap-0.5 flex-shrink-0">
                            <span>📦</span> Primary
                          </span>
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
                          ₹{(item.unitPrice || item.price || item.mrp).toLocaleString("en-IN")}/{item.unit || "pc"}
                        </span>
                        {item.mrp > (item.unitPrice || item.price) && (
                          <span className="line-through text-slate-400 text-[10px]">
                            ₹{item.mrp.toLocaleString("en-IN")}
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
