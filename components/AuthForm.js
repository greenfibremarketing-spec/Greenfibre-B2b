"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
  ArrowLeft,
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
  Loader2,
  RotateCcw,
  KeyRound
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
  clean = clean.replace(/,([a-zA-Z0-9-]+)/g, ".$1");
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
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determine current mode from path or params or defaultMode prop
  const getResolvedMode = () => {
    if (pathname === "/signup") return "signup";
    if (pathname === "/forgot-password") return "forgot";
    if (pathname === "/login") return "signin";
    return searchParams?.get("mode") || defaultMode;
  };

  const initialMode = getResolvedMode();
  const redirectTarget = searchParams?.get("redirect") || "/";

  const { login, register, sendOtp, resetPassword, isAuthenticated, user } = useAuth() || {};

  const [mode, setMode] = useState(initialMode); // "signin" | "signup" | "forgot"
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [devNotice, setDevNotice] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // OTP & Multi-step state
  const [signupStep, setSignupStep] = useState(1); // 1 = Details, 2 = Enter OTP
  const [signUpOtp, setSignUpOtp] = useState("");
  const [forgotStep, setForgotStep] = useState(1); // 1 = Email, 2 = OTP + New Password
  const [resendCooldown, setResendCooldown] = useState(0);

  // Sync mode whenever URL route changes
  useEffect(() => {
    const target = getResolvedMode();
    if (target && target !== mode) {
      setMode(target);
      setSignupStep(1);
      setForgotStep(1);
      setErrorMessage("");
      setSuccessMessage("");
      setDevNotice("");
    }
  }, [pathname, defaultMode, searchParams]);

  // Clean switcher helper that synchronizes UI mode and URL path
  const switchMode = (newMode, carriedEmail = null) => {
    setMode(newMode);
    setSignupStep(1);
    setForgotStep(1);
    setErrorMessage("");
    setSuccessMessage("");
    setDevNotice("");

    if (carriedEmail) {
      if (newMode === "signup") {
        setSignUpData((prev) => ({ ...prev, email: carriedEmail }));
      } else if (newMode === "forgot") {
        setForgotData((prev) => ({ ...prev, email: carriedEmail }));
      } else if (newMode === "signin") {
        setSignInData((prev) => ({ ...prev, email: carriedEmail }));
      }
    }

    if (newMode === "signup" && pathname !== "/signup") {
      router.push("/signup");
    } else if (newMode === "signin" && pathname !== "/login") {
      router.push("/login");
    } else if (newMode === "forgot" && pathname !== "/forgot-password") {
      router.push("/forgot-password");
    }
  };

  // If already logged in, redirect
  useEffect(() => {
    if (isAuthenticated && user && !isLoading && !successMessage) {
      router.push(redirectTarget);
    }
  }, [isAuthenticated, user, isLoading, redirectTarget, router, successMessage]);

  // Dropdown dismiss handlers
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

  // Resend Countdown Timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

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

  // Forgot Password Form State
  const [forgotData, setForgotData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });

  // -------------------------------------------------------------
  // SIGN IN SUBMISSION
  // -------------------------------------------------------------
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setDevNotice("");

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

    setSignInData((prev) => ({ ...prev, email: cleanEmail }));
    setIsLoading(true);
    setLoadingText("Signing in...");

    try {
      await login({
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

  // -------------------------------------------------------------
  // SIGN UP: STEP 1 (Send OTP)
  // -------------------------------------------------------------
  const handleSendSignUpOtp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setDevNotice("");

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

    setSignUpData((prev) => ({ ...prev, email: cleanEmail }));
    setIsLoading(true);
    setLoadingText("Sending verification code to your email...");

    try {
      const res = await sendOtp({
        email: cleanEmail,
        type: "registration",
        fullName
      });

      setIsLoading(false);
      setSignupStep(2);
      setResendCooldown(60);
      setSuccessMessage(res.message || `Verification code sent to ${cleanEmail}`);
      if (res.devMode) {
        setDevNotice("Dev Mode Notice: SMTP credentials are not configured in .env yet. The OTP code was logged to your server console for testing.");
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to send verification code. Please check your email address.");
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // SIGN UP: Resend OTP
  // -------------------------------------------------------------
  const handleResendSignUpOtp = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setErrorMessage("");
    setSuccessMessage("");
    setDevNotice("");

    const cleanEmail = cleanEmailString(signUpData.email);
    setIsLoading(true);
    setLoadingText("Resending verification code...");

    try {
      const res = await sendOtp({
        email: cleanEmail,
        type: "registration",
        fullName: signUpData.fullName
      });

      setIsLoading(false);
      setResendCooldown(60);
      setSuccessMessage(`A fresh verification code has been sent to ${cleanEmail}.`);
      if (res.devMode) {
        setDevNotice("Dev Mode Notice: SMTP credentials are not configured in .env yet. The OTP code was logged to your server console for testing.");
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to resend verification code.");
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // SIGN UP: STEP 2 (Verify OTP & Complete Account Creation)
  // -------------------------------------------------------------
  const handleVerifyAndSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setDevNotice("");

    const otp = signUpOtp.trim();
    if (!otp || otp.length < 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsLoading(true);
    setLoadingText("Verifying code and setting up your account...");

    try {
      await register({
        fullName: signUpData.fullName.trim(),
        full_name: signUpData.fullName.trim(),
        companyName: signUpData.companyName.trim(),
        email: cleanEmailString(signUpData.email),
        phone: signUpData.phone.trim(),
        businessType: signUpData.businessType,
        gstin: signUpData.gstin,
        password: signUpData.password,
        otp: otp,
        rememberMe: true
      });

      setLoadingText("Account verified! Taking you to Home...");
      setSuccessMessage("Account verified and created! Taking you to Home...");
      setTimeout(() => {
        router.push(redirectTarget);
      }, 850);
    } catch (err) {
      setErrorMessage(err.message || "Verification failed. Please check the code and try again.");
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // FORGOT PASSWORD: STEP 1 (Send Reset OTP)
  // -------------------------------------------------------------
  const handleSendForgotOtp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setDevNotice("");

    const cleanEmail = cleanEmailString(forgotData.email);
    if (!cleanEmail) {
      setErrorMessage("Please enter your registered corporate email.");
      return;
    }

    if (!isValidEmailAddress(cleanEmail)) {
      setErrorMessage("Please enter a valid work email address (e.g. name@company.com).");
      return;
    }

    setForgotData((prev) => ({ ...prev, email: cleanEmail }));
    setIsLoading(true);
    setLoadingText("Sending reset verification code...");

    try {
      const res = await sendOtp({
        email: cleanEmail,
        type: "forgot_password"
      });

      setIsLoading(false);
      setForgotStep(2);
      setResendCooldown(60);
      setSuccessMessage(`Password reset code sent to ${cleanEmail}.`);
      if (res.devMode) {
        setDevNotice("Dev Mode Notice: SMTP credentials are not configured in .env yet. The OTP code was logged to your server console for testing.");
      }
    } catch (err) {
      setErrorMessage(err.message || "Could not send reset code. Please check your email.");
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // FORGOT PASSWORD: Resend Reset OTP
  // -------------------------------------------------------------
  const handleResendForgotOtp = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setErrorMessage("");
    setSuccessMessage("");
    setDevNotice("");

    const cleanEmail = cleanEmailString(forgotData.email);
    setIsLoading(true);
    setLoadingText("Resending reset code...");

    try {
      const res = await sendOtp({
        email: cleanEmail,
        type: "forgot_password"
      });

      setIsLoading(false);
      setResendCooldown(60);
      setSuccessMessage(`A fresh reset code has been sent to ${cleanEmail}.`);
      if (res.devMode) {
        setDevNotice("Dev Mode Notice: SMTP credentials are not configured in .env yet. The OTP code was logged to your server console for testing.");
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to resend reset code.");
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // FORGOT PASSWORD: STEP 2 (Reset Password with OTP)
  // -------------------------------------------------------------
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setDevNotice("");

    const cleanEmail = cleanEmailString(forgotData.email);
    const otp = forgotData.otp.trim();
    const newPassword = forgotData.newPassword || "";
    const confirmPassword = forgotData.confirmPassword || "";

    if (!otp || otp.length < 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    setIsLoading(true);
    setLoadingText("Updating your password...");

    try {
      const res = await resetPassword({
        email: cleanEmail,
        otp,
        newPassword
      });

      setIsLoading(false);
      setSuccessMessage(res.message || "Password updated successfully! Please sign in with your new password.");
      setSignInData((prev) => ({ ...prev, email: cleanEmail, password: "" }));
      setForgotStep(1);
      setForgotData({ email: "", otp: "", newPassword: "", confirmPassword: "" });
      setMode("signin");
    } catch (err) {
      setErrorMessage(err.message || "Failed to reset password. Please check your verification code.");
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
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <img
              src="/images/b2b-auth-showcase.jpg"
              alt="Green Fibre Sustainable B2B Tableware & Packaging"
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
            />
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
              <span>100% Upcycled Rice Husk &bull; B2B Portal</span>
            </div>
          </div>

          {/* Middle Content */}
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
                <span>Secure email OTP verification for corporate integrity</span>
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
            <span className="font-bold tracking-wider text-slate-300">TAJ &bull; GOOGLE &bull; INFOSYS</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Interactive Sign In / Sign Up / Forgot Form      */}
        {/* ============================================================ */}
        <div className="lg:col-span-7 p-5 sm:p-8 lg:p-12 flex flex-col justify-between bg-white">
          <div>
            {/* Top Switcher Tabs (Shown on Sign In & Sign Up) */}
            {mode !== "forgot" ? (
              <div className="flex items-center justify-center p-1 bg-slate-100 rounded-xl border border-slate-200 mb-6 sm:mb-8 w-full max-w-xs sm:max-w-sm mx-auto">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => switchMode("signin")}
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
                  onClick={() => switchMode("signup")}
                  className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                    mode === "signup"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  Create Account
                </button>
              </div>
            ) : (
              /* Navigation back when in Forgot Password Mode */
              <div className="mb-6 flex items-center justify-between">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => switchMode("signin")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-700 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                      const emailToCarry = cleanEmailString(forgotData.email);
                      switchMode("signup", emailToCarry);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800 transition-colors cursor-pointer mr-1"
                  >
                    <span>Create Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
                    Password Recovery
                  </span>
                </div>
              </div>
            )}

            {/* Feedback Alerts */}
            {errorMessage && (
              <div className="mb-4 sm:mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex flex-col gap-2 animate-in fade-in-0 duration-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                {errorMessage.toLowerCase().includes("no registered") && (
                  <button
                    type="button"
                    onClick={() => {
                      const emailToCarry = cleanEmailString(forgotData.email);
                      switchMode("signup", emailToCarry);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800 underline self-start pl-6 cursor-pointer"
                  >
                    <span>Create an Enterprise Account with this email</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 sm:mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in-0 duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {devNotice && (
              <div className="mb-4 sm:mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-start gap-2">
                <KeyRound className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>{devNotice}</span>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODE: SIGN IN                                            */}
            {/* ======================================================== */}
            {mode === "signin" && (
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
                      onClick={() => {
                        const emailToCarry = cleanEmailString(signInData.email);
                        switchMode("forgot", emailToCarry);
                      }}
                      className="text-xs font-semibold text-brand-700 hover:text-brand-800 hover:underline cursor-pointer"
                    >
                      Forgot Password?
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

                {/* Submit Sign In Button */}
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
            )}

            {/* ======================================================== */}
            {/* MODE: SIGN UP (OTP BASED REGISTRATION)                   */}
            {/* ======================================================== */}
            {mode === "signup" && signupStep === 1 && (
              <form noValidate onSubmit={handleSendSignUpOtp} className="space-y-3 sm:space-y-3.5">
                <div className="space-y-0.5 text-center sm:text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      Create Enterprise Account
                    </h3>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      Step 1 of 2
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Register for factory wholesale rates. A 6-digit verification code will be sent to your work email.
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

                {/* Row: Business Segment Dropdown & GSTIN */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1 relative" ref={dropdownRef}>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Business Segment
                    </label>
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

                {/* Continue to OTP Step Button */}
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
                      <span>{loadingText || "Sending verification code..."}</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Email &amp; Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ======================================================== */}
            {/* MODE: SIGN UP (STEP 2: ENTER OTP)                        */}
            {/* ======================================================== */}
            {mode === "signup" && signupStep === 2 && (
              <form noValidate onSubmit={handleVerifyAndSignUp} className="space-y-4 sm:space-y-5 animate-in fade-in-50 duration-200">
                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => {
                        setSignupStep(1);
                        setErrorMessage("");
                        setDevNotice("");
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Edit details / email</span>
                    </button>
                    <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                      Step 2 of 2
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Verify Your Work Email
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    We sent a 6-digit verification code to{" "}
                    <span className="font-bold text-slate-900 underline">{signUpData.email}</span>.
                  </p>
                </div>

                {/* 6-Digit OTP Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 text-center sm:text-left">
                    Enter 6-Digit Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      autoFocus
                      required
                      disabled={isLoading}
                      placeholder="000000"
                      value={signUpOtp}
                      onChange={(e) => setSignUpOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="w-full text-center tracking-[0.5em] font-mono text-2xl sm:text-3xl font-extrabold py-3.5 bg-slate-50 border-2 border-brand-200 rounded-2xl text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all disabled:opacity-60"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 text-center sm:text-left">
                    Code expires in 10 minutes.
                  </p>
                </div>

                {/* Resend Code Action */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="text-slate-500">Didn&apos;t receive the code?</span>
                  <button
                    type="button"
                    disabled={resendCooldown > 0 || isLoading}
                    onClick={handleResendSignUpOtp}
                    className={`font-semibold inline-flex items-center gap-1.5 transition-colors ${
                      resendCooldown > 0 || isLoading
                        ? "text-slate-400 cursor-not-allowed"
                        : "text-brand-700 hover:text-brand-800 hover:underline cursor-pointer"
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                    </span>
                  </button>
                </div>

                {/* Submit Verification Button */}
                <button
                  type="submit"
                  disabled={isLoading || signUpOtp.length < 6}
                  className={`btn-primary w-full py-3 sm:py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98] ${
                    isLoading || signUpOtp.length < 6
                      ? "opacity-90 cursor-wait bg-brand-700"
                      : "cursor-pointer"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white flex-shrink-0" />
                      <span>{loadingText || "Verifying..."}</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ======================================================== */}
            {/* MODE: FORGOT PASSWORD (STEP 1: ENTER WORK EMAIL)         */}
            {/* ======================================================== */}
            {mode === "forgot" && forgotStep === 1 && (
              <form noValidate onSubmit={handleSendForgotOtp} className="space-y-4 sm:space-y-5 animate-in fade-in-50 duration-200">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Reset Enterprise Password
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Enter your registered corporate email. We&apos;ll deliver a secure 6-digit verification code to reset your credentials.
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
                      autoFocus
                      required
                      disabled={isLoading}
                      placeholder="name@company.com"
                      value={forgotData.email}
                      onBlur={() => setForgotData((prev) => ({ ...prev, email: cleanEmailString(prev.email) }))}
                      onChange={(e) => setForgotData({ ...forgotData, email: e.target.value })}
                      className="w-full text-sm sm:text-xs pl-10 pr-4 py-2.5 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all disabled:opacity-60 disabled:bg-slate-100"
                    />
                  </div>
                </div>

                {/* Submit Reset Code Request */}
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
                      <span>{loadingText || "Sending reset code..."}</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Switch to Register link */}
                <div className="pt-2 text-center text-xs text-slate-500">
                  Don&apos;t have an enterprise account yet?{" "}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                      const emailToCarry = cleanEmailString(forgotData.email);
                      switchMode("signup", emailToCarry);
                    }}
                    className="font-bold text-brand-700 hover:text-brand-800 hover:underline cursor-pointer"
                  >
                    Register here &rarr;
                  </button>
                </div>
              </form>
            )}

            {/* ======================================================== */}
            {/* MODE: FORGOT PASSWORD (STEP 2: ENTER OTP & NEW PASSWORD) */}
            {/* ======================================================== */}
            {mode === "forgot" && forgotStep === 2 && (
              <form noValidate onSubmit={handleResetPassword} className="space-y-3.5 sm:space-y-4 animate-in fade-in-50 duration-200">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => {
                        setForgotStep(1);
                        setErrorMessage("");
                        setDevNotice("");
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Change email</span>
                    </button>
                    <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                      Step 2 of 2
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Set New Password
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Enter the code sent to{" "}
                    <span className="font-bold text-slate-900 underline">{forgotData.email}</span>{" "}
                    and create a new password.
                  </p>
                </div>

                {/* 6-Digit OTP */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    6-Digit Verification Code *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    autoFocus
                    required
                    disabled={isLoading}
                    placeholder="000000"
                    value={forgotData.otp}
                    onChange={(e) =>
                      setForgotData({
                        ...forgotData,
                        otp: e.target.value.replace(/\D/g, "").slice(0, 6)
                      })
                    }
                    className="w-full text-center tracking-[0.4em] font-mono text-xl sm:text-2xl font-bold py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500 outline-none transition-all disabled:opacity-60"
                  />
                </div>

                {/* Row: New Password & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      New Password *
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type={showForgotNewPassword ? "text" : "password"}
                        required
                        disabled={isLoading}
                        placeholder="••••••••••••"
                        value={forgotData.newPassword}
                        onChange={(e) => setForgotData({ ...forgotData, newPassword: e.target.value })}
                        className="w-full text-sm sm:text-xs pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all disabled:opacity-60"
                      />
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        aria-label={showForgotNewPassword ? "Hide password" : "Show password"}
                      >
                        {showForgotNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Confirm New Password *
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type={showForgotConfirmPassword ? "text" : "password"}
                        required
                        disabled={isLoading}
                        placeholder="••••••••••••"
                        value={forgotData.confirmPassword}
                        onChange={(e) => setForgotData({ ...forgotData, confirmPassword: e.target.value })}
                        className="w-full text-sm sm:text-xs pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all disabled:opacity-60"
                      />
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        aria-label={showForgotConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showForgotConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Resend Code Option */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="text-slate-500">Didn&apos;t get the code?</span>
                  <button
                    type="button"
                    disabled={resendCooldown > 0 || isLoading}
                    onClick={handleResendForgotOtp}
                    className={`font-semibold inline-flex items-center gap-1.5 transition-colors ${
                      resendCooldown > 0 || isLoading
                        ? "text-slate-400 cursor-not-allowed"
                        : "text-brand-700 hover:text-brand-800 hover:underline cursor-pointer"
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                    </span>
                  </button>
                </div>

                {/* Submit Reset Password */}
                <button
                  type="submit"
                  disabled={isLoading || forgotData.otp.length < 6}
                  className={`btn-primary w-full py-3 sm:py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98] ${
                    isLoading || forgotData.otp.length < 6
                      ? "opacity-90 cursor-wait bg-brand-700"
                      : "cursor-pointer"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white flex-shrink-0" />
                      <span>{loadingText || "Updating password..."}</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password &amp; Sign In</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Footer Security Note */}
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
