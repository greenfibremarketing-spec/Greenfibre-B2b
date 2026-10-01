"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuote } from "@/components/Quote";
import { useAuth } from "@/components/AuthContext";
import { CheckCircle2, ShoppingBag, PhoneCall, AlertCircle, Lock, ShieldCheck, Building, User, Mail, Phone, MapPin, FileText, Sparkles, Check } from "lucide-react";

export default function QuotePage() {
  const { items, setQty, remove, clear, count, estimatedTotal } = useQuote() || {
    items: [],
    count: 0,
    estimatedTotal: 0
  };

  const { user, isAuthenticated } = useAuth() || {};

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    buyerType: "Corporate Gifting",
    city: "",
    pin: "",
    date: "",
    gstin: "",
    notes: ""
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.fullName || user.full_name || "",
        company: prev.company || user.companyName || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
        buyerType: prev.buyerType || user.businessType || "Corporate Gifting",
        gstin: prev.gstin || user.gstin || "",
        city: prev.city || user.billingAddress?.city || "",
        pin: prev.pin || user.billingAddress?.pincode || ""
      }));
    }
  }, [user]);

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
          items: items.map(({ slug, colour, qty, senderName, receiverName, giftMessage, engravingName, customProductName, selectedCustomizations }) => ({
            slug,
            colour,
            qty,
            senderName,
            receiverName,
            giftMessage,
            engravingName,
            customProductName,
            selectedCustomizations
          }))
        })
      });

      const resJson = await response.json();
      if (!response.ok) {
        throw new Error(resJson.error || "Failed to submit quote enquiry.");
      }

      clear();
      setState({ busy: false, error: null, ref: resJson.reference });
    } catch (err) {
      setState({ busy: false, error: err.message, ref: null });
    }
  }

  // Success Confirmation Screen
  if (state.ref) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center mx-auto border border-brand-200">
            <CheckCircle2 className="w-8 h-8 text-brand-700" />
          </div>

          <div className="space-y-1.5">
            <span className="badge-green">
              Quote Request Received
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              We&apos;re On It!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you for your enquiry. We&apos;ve routed your request to our B2B account team in Gurugram.
            </p>
          </div>

          {/* Reference ID Pill */}
          <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-800 px-5 py-2 rounded-lg font-mono text-xs sm:text-sm font-semibold border border-slate-200">
            <span>Reference ID:</span>
            <span className="text-brand-800 font-bold">{state.ref}</span>
          </div>

          {/* Timeline */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left space-y-2.5 text-xs text-slate-700">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              What to expect next:
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-brand-700 font-bold">•</span>
                <span>An account manager will review your quantities and logo specs.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-700 font-bold">•</span>
                <span>You will receive an official itemized GST quotation and 3D digital branding proof via email within <strong>4 business hours</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-700 font-bold">•</span>
                <span>If you requested physical samples, we’ll dispatch them within 24–48 hours from Sonipat.</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-1">
            <Link href="/products" className="btn-primary">
              Continue Browsing Products
            </Link>
            <Link href="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="badge-green">
          Direct Manufacturing Desk
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Quote Basket &amp; RFQ Builder
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          Review your selected products, adjust quantities, and submit your requirements. We’ll email you an itemized GST quotation and digital 3D logo proof within 4 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Basket Items */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Selected Products ({count})
              </h3>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clear}
                  className="text-xs font-semibold text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <div className="py-10 text-center space-y-3 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-1">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Your quote basket is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse our wholesale catalog to add coffee mugs, tumblers, dining bowls, or gift sets.
                </p>
                <div className="pt-1">
                  <Link href="/products" className="btn-primary text-xs py-2 px-4">
                    Browse Product Catalog
                  </Link>
                </div>
              </div>
            ) : (
              (() => {
                const computedItems = items.map((item) => {
                  const isAddon = Boolean(item.bundleDiscountApplied || item.activeTierTitle?.toLowerCase().includes("bundle"));
                  // For main products: use wholesalePrice (from payload). For add-ons: their price field IS the 5%-discounted price.
                  const addonDiscountPct = 5;
                  const tierNum = isAddon ? 0 : (item.qty >= 100 ? 3 : item.qty >= 50 ? 2 : 1);
                  const discountPct = isAddon ? addonDiscountPct : (tierNum === 3 ? 15 : tierNum === 2 ? 12 : 10);

                  // Wholesale unit price = the base price BEFORE discount
                  // For main products, prefer wholesalePrice set in payload, fallback to originalBasePrice, then back-calculate
                  const wholesaleUnitP = isAddon
                    ? (item.originalBasePrice || (item.price > 0 ? Math.round(item.price / (1 - addonDiscountPct / 100)) : 0))
                    : (item.wholesalePrice || item.originalBasePrice || item.retailPrice || (item.price > 0 ? Math.round(item.price / (1 - discountPct / 100)) : 550));

                  // Gross wholesale total (before discount)
                  const lineGross = wholesaleUnitP * item.qty;
                  // Discount amount on total
                  const lineDiscount = Math.round(lineGross * discountPct / 100);
                  // Final you-pay total
                  const lineTotal = lineGross - lineDiscount;
                  // Effective per-unit after discount
                  const unitPrice = item.qty > 0 ? Math.round(lineTotal / item.qty) : 0;

                  return {
                    ...item,
                    isAddon,
                    tierNum,
                    discountPct,
                    wholesaleUnitP,
                    lineGross,
                    lineDiscount,
                    lineTotal,
                    unitPrice
                  };
                });

                // Separate main products and add-ons for summary
                const mainItems = computedItems.filter((it) => !it.isAddon);
                const addonItems = computedItems.filter((it) => it.isAddon);
                const mainGross = mainItems.reduce((acc, it) => acc + it.lineGross, 0);
                const mainDiscount = mainItems.reduce((acc, it) => acc + it.lineDiscount, 0);
                const mainNet = mainItems.reduce((acc, it) => acc + it.lineTotal, 0);
                const addonGross = addonItems.reduce((acc, it) => acc + it.lineGross, 0);
                const addonDiscount = addonItems.reduce((acc, it) => acc + it.lineDiscount, 0);
                const addonNet = addonItems.reduce((acc, it) => acc + it.lineTotal, 0);
                const totalNetSubtotal = mainNet + addonNet;
                const totalSavingsAmount = mainDiscount + addonDiscount;

                return (
                  <div className="divide-y divide-slate-100 mt-1">
                    {computedItems.map((item) => (
                      <div key={item.key} className="py-3.5 flex gap-3.5 items-center">
                        {/* Thumbnail */}
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-400">
                              GF
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500 flex-wrap">
                            {item.isAddon ? (
                              <span className="font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                Add-On · 5% OFF
                              </span>
                            ) : (
                              <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                {item.activeTierTitle || `Tier ${item.tierNum}`} · {item.discountPct}% OFF
                              </span>
                            )}
                            <span>SKU: {item.sku || "GF-B2B"}</span>
                          </div>

                          {Array.isArray(item.selectedCustomizations) && item.selectedCustomizations.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {item.selectedCustomizations.map((c, ci) => (
                                <span
                                  key={ci}
                                  className="text-[10px] bg-brand-50 text-brand-900 border border-brand-200 px-1.5 py-0.2 rounded font-medium"
                                >
                                  ✓ {c}
                                </span>
                              ))}
                            </div>
                          )}

                          {(item.senderName || item.receiverName || item.giftMessage || item.engravingName || item.customProductName) && (
                            <div className="mt-1.5 p-2 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[10.5px] space-y-1">
                              {(item.senderName || item.receiverName || item.giftMessage) && (
                                <div className="space-y-0.5">
                                  <div className="font-bold text-emerald-900 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-emerald-600" />
                                    <span>Kit Card Message:</span>
                                  </div>
                                  {item.senderName && (
                                    <div className="text-slate-700">
                                      <span className="font-semibold text-slate-900">From:</span> {item.senderName}
                                    </div>
                                  )}
                                  {item.receiverName && (
                                    <div className="text-slate-700">
                                      <span className="font-semibold text-slate-900">To:</span> {item.receiverName}
                                    </div>
                                  )}
                                  {item.giftMessage && (
                                    <div className="italic text-slate-600 line-clamp-2">
                                      &ldquo;{item.giftMessage}&rdquo;
                                    </div>
                                  )}
                                </div>
                              )}

                              {item.engravingName && (
                                <div className="text-slate-700 pt-0.5 border-t border-emerald-200/60">
                                  <span className="font-semibold text-slate-900">Laser Engraving:</span> {item.engravingName}
                                </div>
                              )}

                              {item.customProductName && (
                                <div className="text-slate-700 pt-0.5 border-t border-emerald-200/60">
                                  <span className="font-semibold text-slate-900">Custom Box Sleeve Title:</span> {item.customProductName}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Clear 3-line pricing breakdown per item */}
                          <div className="mt-1.5 space-y-0.5 text-[11px]">
                            <div className="flex items-center gap-2 text-slate-500">
                              <span>{item.qty} × ₹{item.wholesaleUnitP}</span>
                              <span className="font-semibold text-slate-700">= ₹{item.lineGross.toLocaleString("en-IN")}</span>
                            </div>
                            {item.lineDiscount > 0 && (
                              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                                <span>{item.discountPct}% {item.isAddon ? "Add-on" : "Bulk"} Discount</span>
                                <span>− ₹{item.lineDiscount.toLocaleString("en-IN")}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 font-bold text-slate-900">
                              <span>You Pay:</span>
                              <span>₹{item.lineTotal.toLocaleString("en-IN")}</span>
                            </div>
                          </div>
                        </div>

                        {/* Quantity Stepper & Remove */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={item.qty}
                              onChange={(e) => {
                                const cleaned = e.target.value.replace(/\D/g, "");
                                setQty(item.key, cleaned ? parseInt(cleaned, 10) : (item.moq || 1));
                              }}
                              className="w-14 text-center text-xs font-bold py-1 px-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none select-all"
                              aria-label={`Quantity for ${item.name}`}
                            />
                            <span className="text-[10px] text-slate-500">{item.unit || "set"}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => remove(item.key)}
                            className="w-6 h-6 rounded text-slate-400 hover:text-red-600 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Subtotal & Detailed Discount Breakdown */}
                    <div className="pt-4 border-t border-slate-200 space-y-2.5">
                      <div className="space-y-1.5 text-xs">
                        {/* Main Products */}
                        {mainGross > 0 && (
                          <div className="flex items-center justify-between text-slate-700">
                            <span>Main Products (Wholesale Total):</span>
                            <span className="font-semibold">₹{mainGross.toLocaleString("en-IN")}</span>
                          </div>
                        )}
                        {mainDiscount > 0 && (
                          <div className="flex items-center justify-between text-emerald-800">
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span>Volume Tier Discounts (10%–15% on total):</span>
                            </span>
                            <span className="font-bold">−₹{mainDiscount.toLocaleString("en-IN")}</span>
                          </div>
                        )}

                        {/* Add-ons */}
                        {addonGross > 0 && (
                          <div className="flex items-center justify-between text-slate-700">
                            <span>Add-On Items (Wholesale Total):</span>
                            <span className="font-semibold">₹{addonGross.toLocaleString("en-IN")}</span>
                          </div>
                        )}
                        {addonDiscount > 0 && (
                          <div className="flex items-center justify-between text-emerald-800">
                            <span className="flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                              <span>Add-On Bundle Discounts (5% on add-on total):</span>
                            </span>
                            <span className="font-bold">−₹{addonDiscount.toLocaleString("en-IN")}</span>
                          </div>
                        )}

                        {/* Total Savings */}
                        {totalSavingsAmount > 0 && (
                          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-950 font-bold">
                            <span>Total Savings Unlocked:</span>
                            <span className="text-emerald-800 font-extrabold">
                              −₹{totalSavingsAmount.toLocaleString("en-IN")}
                            </span>
                          </div>
                        )}

                        {/* You Pay */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-slate-900">
                          <span className="text-xs sm:text-sm font-bold">Total You Pay:</span>
                          <span className="text-lg sm:text-xl font-black text-slate-900">
                            ₹{totalNetSubtotal.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        * B2B wholesale pricing. Tier discounts (10–15%) applied on main product totals; add-ons get 5% off their own totals separately. Final official quotation will include GST (18%) credit and Pan-India dispatch logistics.
                      </p>
                    </div>
                  </div>
                );
              })()
            )}
          </div>

          {/* Quick Help Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Need a fast custom proposal today?</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Speak directly with our Gurugram B2B desk.
              </p>
            </div>
            <div className="text-xs font-bold text-brand-700 whitespace-nowrap flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>+91 124 489 3200</span>
            </div>
          </div>
        </div>

        {/* Right Column: B2B Quote Submission Form */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Request Official Quotation
                </h2>
                {isAuthenticated && user && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-800 bg-brand-50 border border-brand-200 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-brand-700" />
                    <span>Logged in as {user.fullName || user.companyName}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Fill in your details below. We guarantee a response within 4 business hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-xs font-semibold text-slate-700">
                    Your Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="company" className="text-xs font-semibold text-slate-700">
                    Company / Organization *
                  </label>
                  <input
                    id="company"
                    name="company"
                    required
                    placeholder="e.g. Freshworks India"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs font-semibold text-slate-700">
                    Work Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="rahul@freshworks.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                    Phone / WhatsApp *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="buyerType" className="text-xs font-semibold text-slate-700">
                  Order Category / Purpose
                </label>
                <select
                  id="buyerType"
                  name="buyerType"
                  value={formData.buyerType}
                  onChange={(e) => setFormData({ ...formData, buyerType: e.target.value })}
                  className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none cursor-pointer"
                >
                  <option value="Corporate Gifting & HR">Corporate Gifting &amp; New Joinee Welcome Kits</option>
                  <option value="Hotel & Hospitality">Cafeteria, Hotel &amp; Restaurant Tableware</option>
                  <option value="Retail Distributor / Reseller">Retail Store / Brand Reseller</option>
                  <option value="Eco Living Brand">Event, Summit or Conference Merchandise</option>
                  <option value="Other Enterprise">Sample Kit Request &amp; Custom Procurement</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label htmlFor="city" className="text-xs font-semibold text-slate-700">
                    Delivery City *
                  </label>
                  <input
                    id="city"
                    name="city"
                    required
                    placeholder="e.g. Bengaluru"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="pin" className="text-xs font-semibold text-slate-700">
                    PIN Code (6 Digits) *
                  </label>
                  <input
                    id="pin"
                    name="pin"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    placeholder="560001"
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                    className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label htmlFor="date" className="text-xs font-semibold text-slate-700">
                    Required By Date
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="gstin" className="text-xs font-semibold text-slate-700">
                    GSTIN (Optional, for 18% Input Credit)
                  </label>
                  <input
                    id="gstin"
                    name="gstin"
                    placeholder="07AAAAA0000A1Z5"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                    className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none uppercase font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="notes" className="text-xs font-semibold text-slate-700">
                  Branding Details &amp; Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Mention if you need laser engraving, custom gift box sleeves, sample kit delivery, or multi-location dispatches..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>

              {/* Anti-spam honeypot */}
              <input
                name="website"
                tabIndex={-1}
                autoComplete="off"
                style={{ position: "absolute", left: -9999, opacity: 0 }}
                aria-hidden="true"
              />

              {state.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>{state.error}</span>
                </div>
              )}

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={state.busy || items.length === 0}
                  className="btn-primary w-full py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {state.busy ? "Generating Quote…" : "Submit Quote Request →"}
                </button>
              </div>

              <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Direct manufacturer privacy: We never share your company contact details.</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
