"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuote } from "@/components/Quote";
import { useAuth } from "@/components/AuthContext";
import {
  CheckCircle2, ShoppingBag, AlertCircle, Lock, ShieldCheck,
  BadgePercent, Minus, Plus, Trash2, X, SlidersHorizontal
} from "lucide-react";

export default function QuotePage() {
  const {
    items,
    setQty,
    remove,
    clear,
    count,
    hasBundleBonus,
    bundleBonusAmount,
    netSubtotalBeforeBundle,
    estimatedTotal,
    ITEM_DISCOUNT_PCT = 10,
    BUNDLE_BONUS_PCT  = 5,
  } = useQuote() || { items: [], count: 0, estimatedTotal: 0, hasBundleBonus: false, netSubtotalBeforeBundle: 0, bundleBonusAmount: 0 };

  const { user, isAuthenticated } = useAuth() || {};

  const [isAdjustOpen, setIsAdjustOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "", company: "", email: "", phone: "",
    buyerType: "Corporate Gifting", city: "", pin: "",
    date: "", gstin: "", notes: ""
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name:      prev.name      || user.fullName      || user.full_name || "",
        company:   prev.company   || user.companyName   || "",
        email:     prev.email     || user.email         || "",
        phone:     prev.phone     || user.phone         || "",
        buyerType: prev.buyerType || user.businessType  || "Corporate Gifting",
        gstin:     prev.gstin     || user.gstin         || "",
        city:      prev.city      || user.billingAddress?.city    || "",
        pin:       prev.pin       || user.billingAddress?.pincode || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (items.length === 0 && isAdjustOpen) {
      setIsAdjustOpen(false);
    }
  }, [items.length, isAdjustOpen]);

  const [state, setState] = useState({ busy: false, error: null, ref: null });

  async function handleSubmit(e) {
    e.preventDefault();
    if (state.busy) return;
    setState({ busy: true, error: null, ref: null });
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId: user?.id || user?._id || null,
          isB2BVerified: user?.isB2BVerified || false,
          items: items.map(({ slug, colour, qty, senderName, receiverName, giftMessage, engravingName, customProductName, selectedCustomizations, isPairItem, isPair, bundleDiscountApplied }) => ({
            slug, colour, qty, senderName, receiverName, giftMessage, engravingName, customProductName, selectedCustomizations,
            isPairItem: Boolean(isPairItem || isPair || bundleDiscountApplied)
          }))
        })
      });
      const resJson = await response.json();
      if (!response.ok) throw new Error(resJson.error || "Failed to submit quote enquiry.");
      clear();
      setState({ busy: false, error: null, ref: resJson.reference });
    } catch (err) {
      setState({ busy: false, error: err.message, ref: null });
    }
  }

  // ── Success screen ───────────────────────────────────────────────────────
  if (state.ref) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-700" />
          </div>
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
              Quote Request Received
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">We're On It!</h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Our B2B account team will respond with an official itemized GST quotation within 4 business hours.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-slate-100 px-5 py-2 rounded-lg font-mono text-xs font-semibold border border-slate-200">
            <span className="text-slate-600">Reference ID:</span>
            <span className="text-emerald-800 font-bold">{state.ref}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-1">
            <Link href="/products" className="btn-primary">Continue Browsing</Link>
            <Link href="/" className="btn-secondary">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Per-item display values ────────────────────────────────────────────────
  const lineItems = items.map((item) => {
    const isPair       = Boolean(item.isPairItem || item.isPair || item.bundleDiscountApplied || item.activeTierTitle?.includes("Bundle") || item.moq === 1);
    const minQty       = isPair ? 1 : (item.moq || 10);
    const mrp          = item.wholesalePrice || item.originalBasePrice || 0;
    const lineGross    = mrp * item.qty;
    const lineDiscount = Math.round(lineGross * (ITEM_DISCOUNT_PCT / 100));
    const lineNet      = lineGross - lineDiscount;
    return { ...item, isPair, minQty, mrp, lineGross, lineDiscount, lineNet };
  });

  const totalGross        = lineItems.reduce((s, it) => s + it.lineGross,    0);
  const totalItemDiscount = lineItems.reduce((s, it) => s + it.lineDiscount, 0);
  const totalUnitsCount   = lineItems.reduce((s, it) => s + (it.qty || 0),   0);
  const estimatedGST      = Math.round(estimatedTotal * 0.18);
  const totalWithGST      = estimatedTotal + estimatedGST;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <p className="text-sm font-medium text-slate-600">
          Review your order, add your details, and receive a formal GST quotation.
        </p>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Response within 4 business hours
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Left: Worksheet & Summary (Sticky / Fixed in view on desktop) ───────────────── */}
        <div className="lg:col-span-6 space-y-5 lg:sticky lg:top-24 self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto pr-0.5">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1b5e3f] text-white flex items-center justify-center text-xs font-bold">1</span>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Your Products</h3>
              <span className="text-xs font-bold text-slate-400">({count})</span>
            </div>

            {items.length > 0 && (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Adjust Quantities button on left of Clear all */}
                <button
                  type="button"
                  onClick={() => setIsAdjustOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1b5e3f] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Adjust Quantities</span>
                </button>

                <button
                  type="button"
                  onClick={clear}
                  className="text-xs font-medium text-slate-400 hover:text-red-500 transition-colors cursor-pointer px-1 py-1"
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
              {/* ── B2B Quotation Worksheet ── */}
              <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">B2B Quotation Worksheet</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Direct Factory Wholesale
                  </span>
                </div>

                <div className="px-5 py-4">
                  {/* Per-product rows */}
                  {lineItems.map((item, idx) => (
                    <div key={item.key} className="py-2.5 border-b border-slate-100 last:border-b-0">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-slate-400 font-mono text-[10px] w-5 flex-shrink-0">{String(idx + 1).padStart(2, "0")}</span>
                          <span className="font-semibold text-slate-800 truncate">{item.name}</span>
                          {item.isPair && (
                            <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-300 font-bold flex-shrink-0 flex items-center gap-1">
                              <span>🔗</span> Pair
                            </span>
                          )}
                          {item.colour && item.colour !== "Standard" && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded border border-slate-200 font-medium truncate flex-shrink-0">
                              {item.colour}
                            </span>
                          )}
                          <span className="text-slate-400 flex-shrink-0">× {item.qty}</span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-slate-400 line-through text-[11px]">₹{item.lineGross.toLocaleString("en-IN")}</span>
                          <span className="text-emerald-700 font-bold text-[11px]">−₹{item.lineDiscount.toLocaleString("en-IN")} ({ITEM_DISCOUNT_PCT}%)</span>
                          <span className="font-extrabold text-slate-900 w-20 text-right">₹{item.lineNet.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Subtotals */}
                  <div className="pt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Catalog Gross ({totalUnitsCount} units):</span>
                      <span className="font-semibold text-slate-800">₹{totalGross.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        Volume Discount (10% on each product):
                      </span>
                      <span className="font-semibold text-emerald-700">−₹{totalItemDiscount.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 border-t border-dashed border-slate-200 pt-2">
                      <span>Subtotal after 10% discount:</span>
                      <span className="font-bold text-slate-800">₹{(netSubtotalBeforeBundle || 0).toLocaleString("en-IN")}</span>
                    </div>

                    {hasBundleBonus && (
                      <div className="flex items-center justify-between text-xs rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2.5">
                        <span className="flex items-center gap-1.5 text-emerald-900 font-semibold">
                          <BadgePercent className="w-3.5 h-3.5 text-emerald-600" />
                          Bundle Pairing Bonus (5% on combined total):
                        </span>
                        <span className="font-extrabold text-emerald-900">−₹{(bundleBonusAmount || 0).toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    <div className="flex items-baseline justify-between pt-2 border-t border-slate-200">
                      <div>
                        <span className="text-sm font-extrabold text-slate-900">Net Taxable Subtotal:</span>
                        <span className="block text-[10px] text-slate-400 font-normal">Excl. GST — Direct factory rate</span>
                      </div>
                      <span className="text-xl sm:text-2xl font-black text-[#0f3428] tracking-tight">
                        ₹{(estimatedTotal || 0).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {(totalItemDiscount + (bundleBonusAmount || 0)) > 0 && (
                      <div className="flex items-center justify-between text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                        <span className="font-semibold text-slate-700">
                          Total Savings ({hasBundleBonus ? "10% + 5% Bundle" : "10%"}):
                        </span>
                        <span className="font-extrabold text-emerald-800">
                          −₹{(totalItemDiscount + (bundleBonusAmount || 0)).toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11.5px] text-slate-500 pt-1">
                      <span>Estimated 18% GST (Input Tax Credit Eligible):</span>
                      <span className="font-medium text-slate-700">₹{estimatedGST.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
                      <span>Final Estimated Quotation (Incl. GST):</span>
                      <span className="text-base font-black text-slate-900">₹{totalWithGST.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
                  <p className="text-[10.5px] text-slate-400 leading-relaxed">
                    * Official Green Fibre Direct Manufacturer Quotation. 18% GST Input Tax Credit provided upon invoicing.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAdjustOpen(true)}
                    className="text-[11px] font-semibold text-[#1b5e3f] hover:underline flex-shrink-0 cursor-pointer"
                  >
                    Edit Quantities →
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
              <span className="w-6 h-6 rounded-full bg-[#1b5e3f] text-white flex items-center justify-center text-xs font-bold">2</span>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Your Details</h3>
            </div>
            {isAuthenticated && user && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                Logged in as {user.fullName || user.companyName}
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="q-name" className="text-xs font-medium text-slate-600">Your name *</label>
                <input id="q-name" name="name" required placeholder="Rahul Sharma" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#1b5e3f] focus:border-[#1b5e3f] outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label htmlFor="q-company" className="text-xs font-medium text-slate-600">Company *</label>
                <input id="q-company" name="company" required placeholder="Freshworks India" value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full text-xs py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#1b5e3f] focus:border-[#1b5e3f] outline-none transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="q-email" className="text-xs font-medium text-slate-600">Work email *</label>
                <input id="q-email" name="email" type="email" required placeholder="rahul@freshworks.com" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#1b5e3f] focus:border-[#1b5e3f] outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label htmlFor="q-phone" className="text-xs font-medium text-slate-600">Phone / WhatsApp *</label>
                <input id="q-phone" name="phone" required placeholder="+91 98765 43210" value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#1b5e3f] focus:border-[#1b5e3f] outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="q-buyerType" className="text-xs font-medium text-slate-600">Order purpose</label>
              <select id="q-buyerType" name="buyerType" value={formData.buyerType}
                onChange={(e) => setFormData({ ...formData, buyerType: e.target.value })}
                className="w-full text-xs py-2.5 px-3 bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-[#1b5e3f] focus:border-[#1b5e3f] outline-none cursor-pointer">
                <option value="Corporate Gifting & HR">Corporate gifting and new joinee welcome kits</option>
                <option value="Hotel & Hospitality">Cafeteria, hotel and restaurant tableware</option>
                <option value="Retail Distributor / Reseller">Retail store and brand reseller</option>
                <option value="Eco Living Brand">Event, summit or conference merchandise</option>
                <option value="Other Enterprise">Sample kit request and custom procurement</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="q-city" className="text-xs font-medium text-slate-600">Delivery city *</label>
                <input id="q-city" name="city" required placeholder="Bengaluru" value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-xs py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#1b5e3f] focus:border-[#1b5e3f] outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label htmlFor="q-pin" className="text-xs font-medium text-slate-600">PIN code *</label>
                <input id="q-pin" name="pin" pattern="[0-9]{6}" maxLength={6} required placeholder="560001" value={formData.pin}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                  className="w-full text-xs py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#1b5e3f] focus:border-[#1b5e3f] outline-none transition-all" />
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

            <div className="space-y-1">
              <label htmlFor="q-notes" className="text-xs font-medium text-slate-600">Branding details and notes</label>
              <textarea id="q-notes" name="notes" rows={3}
                placeholder="Custom gift box sleeves, sample kit delivery, multi-location dispatch..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full text-xs p-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#1b5e3f] outline-none" />
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
              <button
                type="submit"
                disabled={state.busy || items.length === 0}
                className="btn-primary w-full py-3.5 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm hover:shadow transition-all"
              >
                {state.busy ? "Generating Official Quote…" : "Submit Quote Request →"}
              </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsAdjustOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Adjust Quantities</h3>
                  <p className="text-xs text-slate-500">Update item counts or remove products from your quote</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAdjustOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Items List */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 divide-y divide-slate-100">
              {lineItems.map((item) => (
                <div key={item.key} className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Image + Info */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex-shrink-0 flex items-center justify-center relative shadow-2xs">
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
                        <div className="w-full h-full bg-emerald-50 text-emerald-800 font-extrabold flex items-center justify-center text-xl">
                          {item.name ? item.name.charAt(0).toUpperCase() : "P"}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 truncate leading-snug">{item.name}</h4>
                        {item.isPair && (
                          <span className="text-[10px] font-extrabold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                            <span>🔗</span> Paired Item (Min: 1)
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {item.colour && item.colour !== "Standard" && (
                          <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            Color: {item.colour}
                          </span>
                        )}
                        <span className="text-xs text-slate-500">
                          MRP ₹{item.mrp.toLocaleString("en-IN")}/{item.unit || "pc"}
                        </span>
                        {!item.isPair && (
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                            MOQ: {item.minQty}
                          </span>
                        )}
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          10% OFF
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quantity Stepper & Net Price & Delete */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-slate-900">₹{item.lineNet.toLocaleString("en-IN")}</p>
                      <p className="text-[10px] text-slate-400 line-through">₹{item.lineGross.toLocaleString("en-IN")}</p>
                    </div>

                    {/* Stepper */}
                    <div className="inline-flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setQty(item.key, Math.max(item.minQty, (item.qty || 1) - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
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
                        className="w-12 text-center text-xs font-bold text-slate-900 bg-transparent outline-none select-all"
                        aria-label={`Quantity for ${item.name}`}
                      />

                      <button
                        type="button"
                        onClick={() => setQty(item.key, (item.qty || 1) + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => remove(item.key)}
                      className="w-8 h-8 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                      title="Remove product"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  Total Units: <span className="font-bold text-slate-800">{totalUnitsCount}</span>
                </p>
                <p className="text-xs font-bold text-emerald-800">
                  Net Taxable: ₹{(estimatedTotal || 0).toLocaleString("en-IN")}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAdjustOpen(false)}
                className="btn-primary py-2 px-6 text-xs font-bold shadow-xs cursor-pointer"
              >
                Save &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
