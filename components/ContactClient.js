"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building2,
  Sparkles,
  ShieldCheck,
  Truck,
  Layers,
  ArrowRight,
  HeadphonesIcon,
  ChevronDown,
  Check,
  RotateCcw
} from "lucide-react";
import {
  validateEmail,
  validateIndianPhone,
  formatIndianPhone,
  filterPhoneInput
} from "@/lib/validation";

const INQUIRY_OPTIONS = [
  "Bulk Wholesale Order",
  "Corporate Gifting & Hampers",
  "Institutional & Cafeteria Supply",
  "Other / General Query"
];

const QUANTITY_OPTIONS = [
  "25 - 50 units (Trial MOQ)",
  "50 - 250 units",
  "250 - 1,000 units",
  "1,000 - 5,000 units",
  "5,000+ units (Enterprise Volume)"
];

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    city: "",
    inquiryType: "Bulk Wholesale Order",
    quantity: "50 - 250 units",
    message: ""
  });

  const [inquiryDropdownOpen, setInquiryDropdownOpen] = useState(false);
  const [quantityDropdownOpen, setQuantityDropdownOpen] = useState(false);

  const inquiryRef = useRef(null);
  const quantityRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (inquiryRef.current && !inquiryRef.current.contains(e.target)) {
        setInquiryDropdownOpen(false);
      }
      if (quantityRef.current && !quantityRef.current.contains(e.target)) {
        setQuantityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSelectInquiry = (option) => {
    setFormData((prev) => ({ ...prev, inquiryType: option }));
    setInquiryDropdownOpen(false);
  };

  const handleSelectQuantity = (option) => {
    setFormData((prev) => ({ ...prev, quantity: option }));
    setQuantityDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.company.trim()) {
      setError("Please fill out your Name and Company name.");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid work/corporate email address (e.g. name@company.com).");
      return;
    }

    if (!validateIndianPhone(formData.phone)) {
      setError("Please enter a valid 10-digit Indian phone/WhatsApp number starting with 6, 7, 8, or 9 (e.g. +91 98765 43210).");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          phone: formatIndianPhone(formData.phone)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry. Please try again.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to send message. Please reach us directly via WhatsApp or Phone.");
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppLink = () => {
    const text = encodeURIComponent(
      `Hi Greenfibre Team,\n\nI am contacting from ${formData.company || "my business"}.\nName: ${formData.name || ""}\nInquiry: ${formData.inquiryType}\nQuantity: ${formData.quantity}\n\nDetails: ${formData.message || "I would like to inquire about your products."}`
    );
    return `https://wa.me/919217988874?text=${text}`;
  };

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 2-Column Main Section: Form & Direct Contact Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Interactive Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
          {/* Subtle Top Accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 via-emerald-600 to-brand-500" />

          {submitted ? (
            <div className="text-center py-10 sm:py-14 space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-brand-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-2.5 max-w-md mx-auto">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Inquiry Received!
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. Your inquiry has been received. Our team will review your requirements and contact you shortly.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-lg mx-auto">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-900/15 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-98 whitespace-nowrap"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: "",
                      company: "",
                      email: "",
                      phone: "",
                      city: "",
                      inquiryType: "Bulk Wholesale Order",
                      quantity: "50 - 250 units",
                      message: ""
                    });
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-xs sm:text-sm rounded-xl shadow-2xs hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-98 whitespace-nowrap cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-slate-500" />
                  <span>Send Another Inquiry</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Send Us a Direct Requirement
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Fill in your project details below and our team will get back with accurate specifications & bulk pricing.
                </p>
              </div>

              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Vikram Sharma"
                    className="w-full text-xs sm:text-sm px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Acme Corp / Tata Group"
                    className="w-full text-xs sm:text-sm px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. vikram@company.com"
                    className="w-full text-xs sm:text-sm px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp Number * <span className="text-[11px] text-slate-400 font-normal lowercase">(+91 10 digits)</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => {
                      const filtered = filterPhoneInput(e.target.value);
                      setFormData((prev) => ({ ...prev, phone: filtered }));
                      if (error) setError("");
                    }}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full text-xs sm:text-sm px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              {/* Custom Premium Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Premium Inquiry Type Dropdown */}
                <div className="relative" ref={inquiryRef}>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Inquiry Type
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setInquiryDropdownOpen(!inquiryDropdownOpen);
                      setQuantityDropdownOpen(false);
                    }}
                    className={`w-full text-xs sm:text-sm px-4 py-2.5 sm:py-3 bg-slate-50 border rounded-xl text-slate-900 font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      inquiryDropdownOpen
                        ? "border-brand-600 bg-white ring-2 ring-brand-500/20 shadow-xs"
                        : "border-slate-200 hover:border-emerald-300 hover:bg-slate-100/50"
                    }`}
                  >
                    <span className="truncate">{formData.inquiryType}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform duration-200 flex-shrink-0 ml-2 ${
                        inquiryDropdownOpen ? "rotate-180 text-brand-700" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {inquiryDropdownOpen && (
                    <div className="absolute left-0 right-0 z-40 mt-1.5 bg-white border border-emerald-200/90 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.1)] py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-1.5 duration-150">
                      {INQUIRY_OPTIONS.map((opt) => {
                        const isSelected = formData.inquiryType === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleSelectInquiry(opt)}
                            className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? "bg-emerald-50/90 text-emerald-950 font-bold border-l-3 border-brand-700"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                            }`}
                          >
                            <span>{opt}</span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-brand-700 flex-shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Premium Quantity Dropdown */}
                <div className="relative" ref={quantityRef}>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Estimated Quantity
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setQuantityDropdownOpen(!quantityDropdownOpen);
                      setInquiryDropdownOpen(false);
                    }}
                    className={`w-full text-xs sm:text-sm px-4 py-2.5 sm:py-3 bg-slate-50 border rounded-xl text-slate-900 font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      quantityDropdownOpen
                        ? "border-brand-600 bg-white ring-2 ring-brand-500/20 shadow-xs"
                        : "border-slate-200 hover:border-emerald-300 hover:bg-slate-100/50"
                    }`}
                  >
                    <span className="truncate">{formData.quantity}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform duration-200 flex-shrink-0 ml-2 ${
                        quantityDropdownOpen ? "rotate-180 text-brand-700" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {quantityDropdownOpen && (
                    <div className="absolute left-0 right-0 z-40 mt-1.5 bg-white border border-emerald-200/90 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.1)] py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-1.5 duration-150">
                      {QUANTITY_OPTIONS.map((opt) => {
                        const isSelected = formData.quantity === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleSelectQuantity(opt)}
                            className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? "bg-emerald-50/90 text-emerald-950 font-bold border-l-3 border-brand-700"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                            }`}
                          >
                            <span>{opt}</span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-brand-700 flex-shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Requirements / Customization Details
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Mention product lines of interest, required delivery date, logo laser engraving, or packaging preferences..."
                  className="w-full text-xs sm:text-sm p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all resize-none font-medium"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span>Submitting Inquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Direct Inquiry</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-500 text-center sm:text-right">
                  🔒 Strict NDA & Data Confidentiality Guaranteed.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Direct Contact Desk Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Direct Contacts Card - Light Executive Theme */}
          <div className="bg-gradient-to-br from-emerald-50/90 via-[#f7fcf9] to-white rounded-3xl p-6 sm:p-8 border border-emerald-200/90 shadow-sm space-y-6 relative overflow-hidden">
            {/* Top Emerald Accent Bar */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 via-emerald-600 to-brand-500" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-100/50 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Direct Contact Channels
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Connect directly with our factory managers and engineering team for instantaneous turnaround.
              </p>
            </div>

            <div className="relative z-10 space-y-3.5 text-xs sm:text-sm">
              {/* Phone */}
              <a
                href="tel:+919217328777"
                className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white hover:bg-emerald-50/50 border border-slate-200/90 hover:border-emerald-300 transition-all shadow-2xs group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-brand-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
                      Direct Phone Line
                    </div>
                    <div className="font-bold text-slate-900 text-sm sm:text-base truncate">
                      +91 92173 28777
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold group-hover:bg-brand-700 group-hover:text-white group-hover:border-brand-700 transition-all flex items-center gap-1">
                  <span>Call Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919217988874"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white hover:bg-[#25D366]/10 border border-slate-200/90 hover:border-[#25D366]/50 transition-all shadow-2xs group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
                      WhatsApp Desk (Fastest)
                    </div>
                    <div className="font-bold text-slate-900 text-sm sm:text-base truncate">
                      +91 92179 88874
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#15803d] text-xs font-bold group-hover:bg-[#25D366] group-hover:text-white group-hover:border-[#25D366] transition-all flex items-center gap-1">
                  <span>Start Chat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:support.greenfibre@gmail.com"
                className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white hover:bg-emerald-50/50 border border-slate-200/90 hover:border-emerald-300 transition-all shadow-2xs group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-brand-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
                      Corporate Email
                    </div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                      support.greenfibre@gmail.com
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold group-hover:bg-brand-700 group-hover:text-white group-hover:border-brand-700 transition-all flex items-center gap-1">
                  <span>Send Email</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </a>

              {/* Hours */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Operating Hours
                  </div>
                  <div className="font-semibold text-slate-800 text-xs">
                    Mon - Sat: 9:30 AM - 6:30 PM IST
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
