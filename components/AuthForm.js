"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "./AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building,
  Phone,
  Briefcase,
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sprout,
  ChevronDown,
  Gift,
  Hotel,
  Coffee,
  Store,
  Leaf,
  Check,
  AlertCircle,
  Loader2
} from "lucide-react";

const businessSegments = [
  {
    id: "Corporate Gifting & HR",
    label: "Corporate Gifting & HR",
    desc: "Curated gift hampers, welcome kits & festive sets",
    icon: Gift,
    badge: "Most Popular"
  },
  {
    id: "Hotel & Hospitality",
    label: "Hotel & Hospitality",
    desc: "Durable luxury dinnerware, buffet bowls & amenities",
    icon: Hotel,
    badge: "Volume Supply"
  },
  {
    id: "Cafes & Restaurants",
    label: "Cafes & Restaurants",
    desc: "Eco coffee tumblers, café mugs & takeaway ware",
    icon: Coffee
  },
  {
    id: "Retail Distributor / Reseller",
    label: "Retail Distributor / Reseller",
    desc: "Wholesale carton shipments & retail packaging",
    icon: Store
  },
  {
    id: "Eco Living Brand",
    label: "Eco Living Brand",
    desc: "Co-branded sustainable collections & bespoke molds",
    icon: Leaf
  },
  {
    id: "Other Enterprise",
    label: "Other Enterprise",
    desc: "Custom institutional procurement requirements",
    icon: Briefcase
  }
];

function cleanEmailString(val) {
  if (!val) return "";
  let clean = String(val).trim().toLowerCase();
  // Auto-correct comma before domain extension (e.g. puneetwork12@gmail,com -> puneetwork12@gmail.com)
  clean = clean.replace(/,([a-zA-Z0-9-]+)/g, ".$1");
  // Replace any remaining accidental commas with dots
  clean = clean.replace(/,/g, ".");
  return clean;
}

function isValidEmailAddress(val) {
  const clean = cleanEmailString(val);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(clean);
}

export default function AuthForm({ defaultMode = "signin" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams?.get("mode") || defaultMode;
  const redirectTarget = searchParams?.get("redirect") || "/";

  const { login, register, isAuthenticated, user } = useAuth() || {};

  const [mode, setMode] = useState(initialMode); // "signin" | "signup"
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // If already logged in, redirect
  useEffect(() => {
    if (isAuthenticated && user && !isLoading && !successMessage) {
      router.push(redirectTarget);
    }
  }, [isAuthenticated, user, isLoading, redirectTarget, router, successMessage]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Sign In Form State
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
    rememberMe: true
  });

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    businessType: "Corporate Gifting & HR",
    gstin: "",
    password: "",
    confirmPassword: "",
    agreeTerms: true
  });

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const cleanEmail = cleanEmailString(signInData.email);
    const password = (signInData.password || "").trim();

    if (!cleanEmail || !password) {
      setErrorMessage("Please enter both work email and password.");
      return;
    }

    if (!isValidEmailAddress(cleanEmail)) {
      setErrorMessage("Please enter a valid work email address (e.g. name@company.com).");
      return;
    }

    // Auto-update state with sanitized email
    setSignInData((prev) => ({ ...prev, email: cleanEmail }));

    setIsLoading(true);
    setLoadingText("Signing in...");
    try {
      const result = await login({
        email: cleanEmail,
        password: password,
        rememberMe: signInData.rememberMe
      });
      setLoadingText("Taking you to Home...");
      setSuccessMessage("Welcome back! Taking you to Home...");
      setTimeout(() => {
        router.push(redirectTarget);
      }, 750);
    } catch (err) {
      setErrorMessage(err.message || "Invalid work email or password. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const cleanEmail = cleanEmailString(signUpData.email);
    const fullName = (signUpData.fullName || "").trim();
    const companyName = (signUpData.companyName || "").trim();
    const phone = (signUpData.phone || "").trim();
    const password = signUpData.password || "";
    const confirmPassword = signUpData.confirmPassword || "";

    if (!fullName || !companyName || !cleanEmail || !password) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (!isValidEmailAddress(cleanEmail)) {
      setErrorMessage("Please enter a valid work email address (e.g. name@company.com).");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!signUpData.agreeTerms) {
      setErrorMessage("Please accept the terms and partner pledge to continue.");
      return;
    }

    // Auto-update state with sanitized email
    setSignUpData((prev) => ({ ...prev, email: cleanEmail }));

    setIsLoading(true);
    setLoadingText("Creating account...");
    try {
      const result = await register({
        fullName,
        full_name: fullName,
        companyName,
        email: cleanEmail,
        phone,
        businessType: signUpData.businessType,
        gstin: signUpData.gstin,
        password,
        rememberMe: true
      });

      setLoadingText("Taking you to Home...");
      setSuccessMessage("Account created! Taking you to Home...");
      setTimeout(() => {
        router.push(redirectTarget);
      }, 850);
    } catch (err) {
      setErrorMessage(err.message || "Failed to create account. Please check your details.");
      setIsLoading(false);
    }
  };

  const activeSegment =
    businessSegments.find((s) => s.id === signUpData.businessType) || businessSegments[0];
  const ActiveSegmentIcon = activeSegment.icon;

  return (
    <div className="w-full flex items-center justify-center p-2.5 sm:p-6 lg:p-8 min-h-screen">
      <div className="w-full max-w-6xl bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative">
        
        {/* Top Active Progress Bar during Loading */}
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-brand-200 overflow-hidden z-50">
            <div className="w-full h-full bg-brand-600 animate-pulse origin-left" />
          </div>
        )}

        {/* ============================================================ */}
        {/* LEFT COLUMN: Lush Greenery Brand Showcase (Mobile Optimized) */}
        {/* ============================================================ */}
        <div className="lg:col-span-5 relative overflow-hidden bg-slate-950 flex flex-col justify-between p-6 sm:p-8 lg:p-10 text-white min-h-[220px] sm:min-h-[280px] lg:min-h-[720px]">
          {/* Background Image with Crisp Detail */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <img
              src="/images/b2b-auth-showcase.jpg"
              alt="Green Fibre Sustainable B2B Tableware & Packaging"
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
            />
            {/* Double Gradient Overlay for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-transparent" />
          </div>

          {/* Top Brand Header */}
          <div className="relative z-10 space-y-3 sm:space-y-4">
            <Link href="/" className="inline-block group">
              <img
                src="/images/logo.png"
                alt="Green Fibre Logo"
                className="h-14 sm:h-18 w-auto max-w-[210px] object-contain group-hover:scale-105 transition-transform flex-shrink-0"
              />
            </Link>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/20 text-brand-300 text-[11px] sm:text-xs font-semibold shadow-sm">
              <Sprout className="w-3.5 h-3.5 text-brand-400" />
              <span>100% Upcycled Rice Husk • B2B Portal</span>
            </div>
          </div>

          {/* Middle Content (Compact on mobile, rich on desktop) */}
          <div className="relative z-10 space-y-4 sm:space-y-6 my-auto pt-4 sm:pt-8">
            <div className="space-y-1.5 sm:space-y-3">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug sm:leading-[1.18] drop-shadow-md">
                Sustainable Tableware &amp; Corporate Gifting
              </h2>
              <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed font-normal max-w-md hidden sm:block">
                Access factory-direct wholesale pricing, in-house permanent optical laser branding, and Pan-India bulk fulfillment.
              </p>
            </div>

            {/* Desktop / Tablet Feature List */}
            <div className="hidden sm:space-y-2.5 sm:block pt-1">
              <div className="flex items-center gap-2.5 text-xs text-slate-100 font-medium">
                <span className="w-4 h-4 rounded-full bg-brand-500/30 border border-brand-400/40 flex items-center justify-center text-brand-300 text-[10px] font-bold flex-shrink-0">
                  ✓
                </span>
                <span>Direct factory volume discounts up to 45%</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-100 font-medium">
                <span className="w-4 h-4 rounded-full bg-brand-500/30 border border-brand-400/40 flex items-center justify-center text-brand-300 text-[10px] font-bold flex-shrink-0">
                  ✓
                </span>
                <span>Permanent laser logo engraving with 4h 3D proofing</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-100 font-medium">
                <span className="w-4 h-4 rounded-full bg-brand-500/30 border border-brand-400/40 flex items-center justify-center text-brand-300 text-[10px] font-bold flex-shrink-0">
                  ✓
                </span>
                <span>FDA 21 CFR &amp; LFGB certified food-safe bio-composite</span>
              </div>
            </div>

            {/* Testimonial Quote Card */}
            <div className="hidden lg:block bg-slate-900/70 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-xs text-slate-200 space-y-2 shadow-lg">
              <p className="italic leading-relaxed text-slate-100">
                &ldquo;Green Fibre transitioned our entire corporate welcome hampers and cafeterias to circular rice-husk tableware. The branding finish is unmatched.&rdquo;
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[11px] text-slate-300">
                <span className="font-bold text-brand-300">Priya Sharma</span>
                <span className="text-slate-400">Head of ESG</span>
              </div>
            </div>
          </div>

          {/* Bottom Trusted Bar */}
          <div className="relative z-10 pt-3 sm:pt-6 border-t border-white/15 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 font-medium">
            <span>200+ Enterprise Clients:</span>
            <span className="font-bold tracking-wider text-slate-300">TAJ • GOOGLE • INFOSYS</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Interactive Sign In / Sign Up Form              */}
        {/* ============================================================ */}
        <div className="lg:col-span-7 p-5 sm:p-8 lg:p-12 flex flex-col justify-between bg-white">
          <div>
            {/* Top Switcher Tabs */}
            <div className="flex items-center justify-center p-1 bg-slate-100 rounded-xl border border-slate-200 mb-6 sm:mb-8 w-full max-w-xs sm:max-w-sm mx-auto">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setMode("signin");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                  mode === "signin"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                Sign In
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setMode("signup");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                  mode === "signup"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                Create Account
              </button>
            </div>

            {/* Feedback Alerts */}
            {errorMessage && (
              <div className="mb-4 sm:mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in-0 duration-200">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 sm:mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in-0 duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODE: SIGN IN                                            */}
            {/* ======================================================== */}
            {mode === "signin" ? (
              <form noValidate onSubmit={handleSignInSubmit} className="space-y-4 sm:space-y-5">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Welcome Back to Green Fibre
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Sign in to access volume tier pricing, GST invoicing, and quote tracking.
                  </p>
                </div>

                {/* Work Email */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Corporate Work Email
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      inputMode="email"
                      autoComplete="email"
                      required
                      disabled={isLoading}
                      placeholder="name@company.com"
                      value={signInData.email}
                      onBlur={() => setSignInData((prev) => ({ ...prev, email: cleanEmailString(prev.email) }))}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      className="w-full text-sm sm:text-xs pl-10 pr-4 py-2.5 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all disabled:opacity-60 disabled:bg-slate-100"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => alert("Password reset link will be sent to your verified corporate email.")}
                      className="text-xs font-semibold text-brand-700 hover:text-brand-800 hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      disabled={isLoading}
                      placeholder="••••••••••••"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      className="w-full text-sm sm:text-xs pl-10 pr-10 py-2.5 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all disabled:opacity-60 disabled:bg-slate-100"
                    />
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
                    <input
                      type="checkbox"
                      disabled={isLoading}
                      checked={signInData.rememberMe}
                      onChange={(e) => setSignInData({ ...signInData, rememberMe: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 accent-brand-600 cursor-pointer"
                    />
                    <span>Remember this device</span>
                  </label>
                </div>

                {/* Submit Sign In Button with Dynamic Loading State */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`btn-primary w-full py-3 sm:py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98] ${
                    isLoading ? "opacity-90 cursor-wait bg-brand-700" : "cursor-pointer"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white flex-shrink-0" />
                      <span>{loadingText || "Signing in..."}</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* ======================================================== */
              /* MODE: SIGN UP (CREATE B2B ACCOUNT)                       */
              /* ======================================================== */
              <form noValidate onSubmit={handleSignUpSubmit} className="space-y-3 sm:space-y-3.5">
                <div className="space-y-0.5 text-center sm:text-left">
                  <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Create Enterprise Account
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Register for factory wholesale tier rates and custom logo branding.
                  </p>
                </div>

                {/* Row: Name & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Contact Name *
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        required
                        disabled={isLoading}
                        placeholder="John Doe"
                        value={signUpData.fullName}
                        onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                        className="w-full text-sm sm:text-xs pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all disabled:opacity-60 disabled:bg-slate-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Organization *
                    </label>
                    <div className="relative flex items-center">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        required
                        disabled={isLoading}
                        placeholder="Company Pvt Ltd"
                        value={signUpData.companyName}
                        onChange={(e) => setSignUpData({ ...signUpData, companyName: e.target.value })}
                        className="w-full text-sm sm:text-xs pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all disabled:opacity-60 disabled:bg-slate-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Row: Work Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Work Email *
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        inputMode="email"
                        autoComplete="email"
                        required
                        disabled={isLoading}
                        placeholder="name@company.com"
                        value={signUpData.email}
                        onBlur={() => setSignUpData((prev) => ({ ...prev, email: cleanEmailString(prev.email) }))}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        className="w-full text-sm sm:text-xs pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all disabled:opacity-60 disabled:bg-slate-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Phone / WhatsApp *
                    </label>
                    <div className="relative flex items-center">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="tel"
                        required
                        disabled={isLoading}
                        placeholder="+91 98765 43210"
                        value={signUpData.phone}
                        onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                        className="w-full text-sm sm:text-xs pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all disabled:opacity-60 disabled:bg-slate-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Row: Luxury Business Type Dropdown & GSTIN */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Custom Luxury Business Segment Dropdown */}
                  <div className="space-y-1 relative" ref={dropdownRef}>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Business Segment
                    </label>

                    {/* Luxury Custom Trigger Button */}
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`w-full text-left bg-slate-50 hover:bg-white border rounded-xl px-3 py-2.5 flex items-center justify-between gap-2 transition-all cursor-pointer shadow-xs ${
                        isDropdownOpen
                          ? "border-brand-600 bg-white ring-2 ring-brand-500/20 shadow-md"
                          : "border-slate-200 hover:border-brand-400"
                      } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                      aria-expanded={isDropdownOpen}
                      aria-haspopup="listbox"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-6 h-6 rounded-lg bg-brand-100 text-brand-800 flex items-center justify-center flex-shrink-0">
                          <ActiveSegmentIcon className="w-3.5 h-3.5 text-brand-700" />
                        </div>
                        <span className="text-xs font-semibold text-slate-900 truncate">
                          {activeSegment.label}
                        </span>
                      </div>

                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                          isDropdownOpen ? "rotate-180 text-brand-700 font-bold" : ""
                        }`}
                      />
                    </button>

                    {/* Luxury Animated Floating Dropdown Menu */}
                    {isDropdownOpen && !isLoading && (
                      <div
                        role="listbox"
                        className="absolute top-full left-0 right-0 sm:right-auto sm:w-[320px] mt-1.5 z-50 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl p-1.5 space-y-1 animate-in fade-in-0 zoom-in-95 duration-150 max-h-60 overflow-y-auto"
                      >
                        <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                          Select Industry Segment
                        </div>

                        {businessSegments.map((segment) => {
                          const Icon = segment.icon;
                          const isSelected = signUpData.businessType === segment.id;
                          return (
                            <button
                              key={segment.id}
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => {
                                setSignUpData({ ...signUpData, businessType: segment.id });
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full text-left p-2 rounded-xl flex items-start justify-between gap-2.5 transition-all cursor-pointer group ${
                                isSelected
                                  ? "bg-brand-50 border border-brand-200 text-brand-900 shadow-xs"
                                  : "hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-transparent"
                              }`}
                            >
                              <div className="flex items-start gap-2.5 min-w-0">
                                <div
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                                    isSelected
                                      ? "bg-brand-600 text-white shadow-xs"
                                      : "bg-slate-100 text-slate-600 group-hover:bg-brand-100 group-hover:text-brand-800"
                                  }`}
                                >
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold truncate block">
                                      {segment.label}
                                    </span>
                                    {segment.badge && (
                                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-brand-100 text-brand-800 border border-brand-200 flex-shrink-0">
                                        {segment.badge}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-slate-500 line-clamp-1 block mt-0.5">
                                    {segment.desc}
                                  </span>
                                </div>
                              </div>

                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-brand-700 flex-shrink-0 mt-1 font-bold" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      GSTIN <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative flex items-center">
                      <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        disabled={isLoading}
                        placeholder="22AAAAA0000A1Z5"
                        value={signUpData.gstin}
                        onChange={(e) => setSignUpData({ ...signUpData, gstin: e.target.value.toUpperCase() })}
                        className="w-full text-sm sm:text-xs font-mono uppercase pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all disabled:opacity-60 disabled:bg-slate-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Row: Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Password *
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        disabled={isLoading}
                        placeholder="••••••••••••"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        className="w-full text-sm sm:text-xs pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all disabled:opacity-60 disabled:bg-slate-100"
                      />
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Confirm Password *
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        disabled={isLoading}
                        placeholder="••••••••••••"
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                        className="w-full text-sm sm:text-xs pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all disabled:opacity-60 disabled:bg-slate-100"
                      />
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="pt-0.5">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
                    <input
                      type="checkbox"
                      disabled={isLoading}
                      checked={signUpData.agreeTerms}
                      onChange={(e) => setSignUpData({ ...signUpData, agreeTerms: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 accent-brand-600 cursor-pointer flex-shrink-0"
                    />
                    <span className="leading-snug">
                      I agree to the Green Fibre B2B Terms of Trade and sustainability partner pledge.
                    </span>
                  </label>
                </div>

                {/* Submit Sign Up Button with Dynamic Loading State */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`btn-primary w-full py-3 sm:py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98] ${
                    isLoading ? "opacity-90 cursor-wait bg-brand-700" : "cursor-pointer"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white flex-shrink-0" />
                      <span>{loadingText || "Creating account..."}</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Footer Security / Trust Note */}
          <div className="pt-4 sm:pt-6 border-t border-slate-100 flex items-center justify-center text-xs text-slate-500 mt-4 sm:mt-6">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span>256-Bit Encrypted Enterprise B2B Portal</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
