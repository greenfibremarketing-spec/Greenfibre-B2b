"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "./AuthContext";
import {
  User,
  Building,
  ShieldCheck,
  LogOut,
  ChevronDown,
  FileText,
  ShoppingBag,
  LayoutGrid,
  Gift,
  CheckCircle2,
  Clock,
  UserCheck
} from "lucide-react";

export default function UserNav() {
  const { user, isAuthenticated, logout } = useAuth() || {};
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // When user is not logged in: show Sign In & Register B2B on desktop only
  if (!isAuthenticated || !user) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
        <Link
          href="/login"
          className="inline-flex items-center text-xs font-bold text-slate-700 hover:text-brand-800 hover:bg-slate-100 px-3 h-10 rounded-xl transition-colors border border-transparent hover:border-slate-200"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="px-3.5 inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 hover:border-slate-300 rounded-xl transition-all shadow-2xs active:scale-95 flex-shrink-0 h-10"
          aria-label="Register B2B Account"
        >
          <User className="w-4.5 h-4.5 text-slate-600 flex-shrink-0" />
          <span className="whitespace-nowrap">Register B2B</span>
        </Link>
      </div>
    );
  }

  // When user IS signed in: show their actual contact name & company on navbar
  const displayName =
    user.fullName ||
    user.full_name ||
    user.name ||
    user.companyName ||
    (user.email ? user.email.split("@")[0] : "Corporate Buyer");

  const displayCompany = user.companyName || user.b2bProfile?.companyName || "B2B Account";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase() || "GF";

  return (
    <div className="hidden sm:block relative" ref={dropdownRef}>
      {/* Logged-in User Pill Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-10 flex items-center gap-1.5 px-2 sm:px-3 rounded-xl border transition-all cursor-pointer shadow-2xs group flex-shrink-0 active:scale-95 ${
          isOpen
            ? "border-brand-600 bg-white ring-2 ring-brand-500/15"
            : "border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {/* Avatar with Initials */}
        <div className="w-6 h-6 rounded-md bg-brand-700 text-white font-extrabold flex items-center justify-center text-[11px] shadow-2xs flex-shrink-0">
          {initials}
        </div>

        {/* Display User Name & Company — hidden on mobile, visible sm+ */}
        <div className="hidden sm:flex flex-col text-left min-w-0 max-w-[120px] sm:max-w-[160px]">
          <span className="text-xs font-bold text-slate-900 truncate leading-tight flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="truncate">{displayName}</span>
          </span>
          <span className="text-[10px] text-slate-500 truncate">
            {displayCompany}
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 group-hover:text-brand-700 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180 text-brand-700 font-bold" : ""
          }`}
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in-0 zoom-in-95 duration-150 space-y-3"
        >
          {/* Header Profile Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 truncate">
                {displayName}
              </span>
              {user.isB2BVerified ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  <span>Verified B2B</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-800 bg-brand-100 border border-brand-200 px-2 py-0.5 rounded-full">
                  <UserCheck className="w-3 h-3 text-brand-700" />
                  <span>B2B Buyer</span>
                </span>
              )}
            </div>

            <div className="text-[11px] text-slate-600 space-y-0.5">
              <div className="flex items-center gap-1.5 truncate">
                <Building className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="truncate">{displayCompany}</span>
              </div>
              <div className="truncate text-slate-500 font-mono text-[10px]">
                {user.email}
              </div>
              {user.phone && (
                <div className="truncate text-slate-500 text-[10px]">
                  Phone: {user.phone}
                </div>
              )}
              {user.gstin && (
                <div className="text-[10px] font-mono font-semibold text-brand-900 bg-brand-50/80 px-1.5 py-0.5 rounded border border-brand-200 inline-block mt-1">
                  GSTIN: {user.gstin}
                </div>
              )}
            </div>
          </div>

          {/* Quick Menu Links */}
          <div className="space-y-1 text-xs font-semibold text-slate-700">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 hover:text-brand-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-brand-700" />
                <span>Home Dashboard</span>
              </div>
            </Link>

            <Link
              href="/quote"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 hover:text-brand-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-brand-700" />
                <span>Quote Basket &amp; RFQs</span>
              </div>
              <span className="text-[10px] text-slate-400">View Active</span>
            </Link>

            <Link
              href="/products"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 hover:text-brand-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-brand-700" />
                <span>Wholesale Product Catalog</span>
              </div>
              <span className="text-[10px] text-slate-400">Tiers Active</span>
            </Link>
          </div>

          {/* Sign Out Button */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer border border-transparent hover:border-red-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out from B2B Portal</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
