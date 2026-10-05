"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Leaf, Check, ChevronDown, Minus, Plus, ShoppingBag } from "lucide-react";

const QuoteContext = createContext(null);

export const useQuote = () => useContext(QuoteContext);

// ── Pricing constants & Dynamic Volume Tier Rules ────────────────────────────
// Tier 1: 1–100 units   -> 15% wholesale discount
// Tier 2: 101–200 units -> 20% volume discount
// Tier 3: 201+ units    -> 25% enterprise bulk discount
// Bundle bonus (5%) applied on overall net subtotal when 2+ distinct products are in basket.
export const BUNDLE_BONUS_PCT = 5;

export function getItemDiscountPct(qty) {
  const q = Number(qty) || 1;
  if (q >= 201 || q >= 200) return 25; // Tier 3: 200+ units -> 25% off
  if (q >= 101) return 20;  // Tier 2: 101–200 units -> 20% off
  return 15;                // Tier 1: 1–100 units -> 15% off
}

export function getItemTierNumber(qty) {
  const q = Number(qty) || 1;
  if (q >= 201 || q >= 200) return 3;
  if (q >= 101) return 2;
  return 1;
}

export function getItemTierLabel(qty) {
  const q = Number(qty) || 1;
  if (q >= 201 || q >= 200) return "Tier 3 (200+ units • 25% Off)";
  if (q >= 101) return "Tier 2 (101–200 units • 20% Off)";
  return "Tier 1 (Wholesale 1–100 • 15% Off)";
}

// Safely resolve the original MRP — NEVER from an already-discounted price
function resolveMRP(product) {
  if (product.wholesalePrice > 0) return product.wholesalePrice;
  if (product.originalBasePrice > 0) return product.originalBasePrice;
  if (product.retailPrice > 0) return product.retailPrice;
  if (product.mrp > 0) return product.mrp;
  if (product.price > 0) {
    const discount = product.discountPct || getItemDiscountPct(product.qty || 1);
    return Math.round(product.price / (1 - discount / 100));
  }
  return 500;
}

// ── Centralized Pure Function to Compute a Line Item ───────────────────────────
export function computeLineItem(item) {
  const isPair = Boolean(item.isPairItem === true || item.isPair === true);
  const isPrimary = !isPair;
  const minQty = isPair ? 1 : Math.max(10, Number(item.moq) || 10);
  const qty = Math.max(minQty, Number(item.qty) || minQty);
  const mrp = Number(item.wholesalePrice || item.originalBasePrice || item.mrp || item.price || 0);

  // Real-time dynamic volume tier discount
  const discountPct = getItemDiscountPct(qty);
  const tierNumber = getItemTierNumber(qty);
  const tierLabel = getItemTierLabel(qty);

  const lineGross = mrp * qty;
  const lineDiscount = Math.round(lineGross * (discountPct / 100));
  const lineNet = lineGross - lineDiscount;
  const unitPrice = Math.round(mrp * (1 - discountPct / 100));

  return {
    ...item,
    qty,
    mrp,
    wholesalePrice: mrp,
    originalBasePrice: mrp,
    retailPrice: mrp,
    price: unitPrice,
    discountPct,
    tierNumber,
    tierLabel,
    isPair,
    isPairItem: isPair,
    isPrimary,
    minQty,
    lineGross,
    lineDiscount,
    lineNet,
  };
}

export function QuoteProvider({ children }) {
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gf_quote_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed.map(computeLineItem));
        }
      }
    } catch (e) {
      console.error("Failed to load quote basket", e);
    }
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3200);
  };

  const saveItems = (newItems) => {
    const computed = newItems.map(computeLineItem);
    setItems(computed);
    try {
      localStorage.setItem("gf_quote_v2", JSON.stringify(computed));
    } catch (e) {
      console.error("Failed to persist quote basket", e);
    }
  };

  // ── add ───────────────────────────────────────────────────────────────────
  const add = (product, colour, qty) => {
    // Explicit pair detection ONLY (never from bundle bonuses or tier titles)
    const isPair = Boolean(product.isPairItem === true || product.isPair === true);
    const isPrimary = !isPair;
    const parentSlug = isPair ? (product.parentSlug || product.pairedWithSlug || null) : null;
    const pairedWithKey = isPair ? (product.pairedWithKey || (parentSlug ? `${parentSlug}-${colour || "standard"}` : null)) : null;
    const parentName = isPair ? (product.parentName || null) : null;

    // Use a distinct key for paired items so they don't overwrite primary products of same slug
    const key = isPair && parentSlug
      ? `${product.slug}-${colour || "standard"}-pair-${parentSlug}`
      : isPair
        ? `${product.slug}-${colour || "standard"}-pair`
        : `${product.slug}-${colour || "standard"}`;

    // Lock the MRP on first add — this value never changes regardless of qty updates
    const mrp = resolveMRP(product);
    const minAllowed = isPair ? 1 : Math.max(10, Number(product.moq) || 10);
    const validQty = Math.max(minAllowed, parseInt(qty, 10) || minAllowed);

    const existing = items.find((x) => x.key === key);
    let updated;

    if (existing) {
      const newQty = existing.qty + validQty;
      const lockedMRP = existing.wholesalePrice || existing.originalBasePrice || mrp;

      updated = items.map((x) =>
        x.key === key
          ? computeLineItem({
            ...x,
            qty: newQty,
            wholesalePrice: lockedMRP,
            originalBasePrice: lockedMRP,
            retailPrice: lockedMRP,
            isPrimary: !isPair,
            isPairItem: isPair,
            isPair: isPair,
            parentSlug: isPair ? (parentSlug || x.parentSlug || null) : null,
            pairedWithSlug: isPair ? (parentSlug || x.pairedWithSlug || null) : null,
            pairedWithKey: isPair ? (pairedWithKey || x.pairedWithKey || null) : null,
            parentName: isPair ? (parentName || x.parentName || null) : null,
            moq: minAllowed,
            customBranding: product.customBranding ?? x.customBranding,
            selectedCustomizations: product.selectedCustomizations ?? x.selectedCustomizations,
            customizationCount: product.customizationCount ?? x.customizationCount,
            maxAllowedCustomizations: product.maxAllowedCustomizations ?? x.maxAllowedCustomizations,
            brandingNotes: product.brandingNotes ?? x.brandingNotes,
            packagingOption: product.packagingOption ?? x.packagingOption,
            senderName: product.senderName ?? x.senderName,
            receiverName: product.receiverName ?? x.receiverName,
            giftMessage: product.giftMessage ?? x.giftMessage,
            engravingName: product.engravingName ?? x.engravingName,
            customProductName: product.customProductName ?? x.customProductName,
          })
          : x
      );
    } else {
      updated = [
        ...items,
        computeLineItem({
          key,
          slug: product.slug,
          sku: product.sku || "GF-B2B",
          name: product.name,
          unit: product.unit || (/\b(set|sets|storage bowl|storage bowls|bowl set|bowls set|dining set|hamper|combo|pack of|gift set|kit)\b/i.test(product.name || "") ? "set" : "piece"),
          wholesalePrice: mrp,           // LOCKED MRP — never recalculated
          originalBasePrice: mrp,
          retailPrice: mrp,
          mrp,
          moq: minAllowed,
          isPrimary: !isPair,
          isPairItem: isPair,
          isPair: isPair,
          parentSlug,
          pairedWithSlug: parentSlug,
          pairedWithKey,
          parentName,
          image: product.image,
          colour: colour || "Standard",
          qty: validQty,
          customBranding: product.customBranding,
          selectedCustomizations: product.selectedCustomizations,
          customizationCount: product.customizationCount,
          maxAllowedCustomizations: product.maxAllowedCustomizations,
          brandingNotes: product.brandingNotes,
          packagingOption: product.packagingOption,
          senderName: product.senderName || "",
          receiverName: product.receiverName || "",
          giftMessage: product.giftMessage || "",
          engravingName: product.engravingName || "",
          customProductName: product.customProductName || "",
        }),
      ];
    }

    saveItems(updated);
    showToast(`Added ${validQty}× ${product.name} to quote basket.`);
  };

  // ── setQty (Instant Centralized Reactive Update) ───────────────────────────
  const setQty = (key, rawQty) => {
    const parsed = parseInt(rawQty, 10);
    const updated = items.map((x) => {
      if (x.key !== key) return x;
      const isPair = Boolean(x.isPairItem === true || x.isPair === true);
      const minAllowed = isPair ? 1 : Math.max(10, Number(x.moq) || 10);
      const validQty = Math.max(minAllowed, isNaN(parsed) ? minAllowed : parsed);
      return computeLineItem({ ...x, qty: validQty, moq: minAllowed });
    });
    saveItems(updated);
  };

  // ── remove / clear ────────────────────────────────────────────────────────
  const remove = (key) => {
    const itemToRemove = items.find((x) => x.key === key || x.slug === key);
    if (!itemToRemove) {
      saveItems(items.filter((x) => x.key !== key));
      return;
    }

    const isPrimary = !itemToRemove.isPair && !itemToRemove.isPairItem;

    let remaining;
    if (isPrimary) {
      // 1. Remove the primary item
      // 2. Also remove any paired items linked to this primary item
      remaining = items.filter((x) => {
        if (x.key === itemToRemove.key) return false;
        // Check if x is a pair item linked to this primary item
        const isLinkedPair = (x.isPair || x.isPairItem) && (
          x.parentSlug === itemToRemove.slug ||
          x.pairedWithSlug === itemToRemove.slug ||
          x.pairedWithKey === itemToRemove.key ||
          (x.key && x.key.includes(`-pair-${itemToRemove.slug}`))
        );
        if (isLinkedPair) return false;
        return true;
      });

      // 3. Find all primary items remaining in the basket
      const remainingPrimary = remaining.filter((x) => !x.isPair && !x.isPairItem);

      // If NO primary items remain at all in the basket, purge all orphan pair items!
      if (remainingPrimary.length === 0) {
        remaining = [];
      } else {
        // If there are pair items whose parent is no longer in the cart, clean them up
        remaining = remaining.filter((x) => {
          if (!x.isPair && !x.isPairItem) return true;
          if (x.parentSlug || x.pairedWithSlug) {
            const parentSlug = x.parentSlug || x.pairedWithSlug;
            return remainingPrimary.some((p) => p.slug === parentSlug);
          }
          // If pair had no explicit parentSlug (e.g. legacy), keep only while primary items exist
          return true;
        });
      }

      showToast(`Removed ${itemToRemove.name}${items.length > remaining.length + 1 ? " and linked paired item" : ""}.`);
    } else {
      // User is removing a pair item directly
      remaining = items.filter((x) => x.key !== itemToRemove.key);
      showToast(`Removed ${itemToRemove.name} from basket.`);
    }

    saveItems(remaining);
  };

  const clear = () => saveItems([]);

  const updateCustomizations = (key, data) => {
    saveItems(items.map((x) => (x.key === key ? { ...x, ...data } : x)));
  };

  // ── Derived cart-level totals with centralized reactive calculations ──────
  const lineItems = items.map(computeLineItem);

  const totalUnits = lineItems.reduce((acc, it) => acc + (it.qty || 0), 0);
  const totalUnitsCount = totalUnits;

  // Bundle bonus: 5% extra off when 2+ distinct products are paired in basket
  const hasBundleBonus = lineItems.length >= 2;

  const totalGross = lineItems.reduce((acc, it) => acc + (it.lineGross || 0), 0);

  const totalItemDiscount = lineItems.reduce((acc, it) => acc + (it.lineDiscount || 0), 0);

  const netSubtotalBeforeBundle = totalGross - totalItemDiscount;

  const bundleBonusAmount = hasBundleBonus
    ? Math.round(netSubtotalBeforeBundle * (BUNDLE_BONUS_PCT / 100))
    : 0;

  const estimatedTotal = netSubtotalBeforeBundle - bundleBonusAmount;
  const estimatedGST = Math.round(estimatedTotal * 0.18);
  const totalWithGST = estimatedTotal + estimatedGST;
  const totalSavings = totalItemDiscount + bundleBonusAmount;
  const savingsPct = totalGross > 0 ? ((totalSavings / totalGross) * 100).toFixed(1) : "0";

  return (
    <QuoteContext.Provider
      value={{
        items,
        lineItems,
        add,
        setQty,
        remove,
        clear,
        updateCustomizations,
        count: lineItems.length,
        totalUnits,
        totalUnitsCount,
        totalGross,
        totalItemDiscount,
        hasBundleBonus,
        bundleBonusAmount,
        netSubtotalBeforeBundle,
        estimatedTotal,
        estimatedGST,
        totalWithGST,
        totalSavings,
        savingsPct,
        getItemDiscountPct,
        getItemTierNumber,
        getItemTierLabel,
        BUNDLE_BONUS_PCT,
        drawerOpen,
        setDrawerOpen,
        showToast,
      }}
    >
      {children}
      {toast && (
        <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:bottom-6 z-50 animate-slide-up flex justify-center sm:justify-end pointer-events-none">
          <div className="flex items-center gap-3 bg-white text-slate-800 px-4 py-3 rounded-xl shadow-xl border border-slate-200 max-w-md w-full sm:w-auto pointer-events-auto">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs border border-brand-200">
              <Leaf className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-800 flex-1">{toast}</span>
            <Link
              href="/quote"
              className="text-xs font-bold text-brand-700 hover:text-brand-800 underline uppercase tracking-wider ml-1 flex-shrink-0"
            >
              View
            </Link>
          </div>
        </div>
      )}
    </QuoteContext.Provider>
  );
}

export function Count({ className = "" }) {
  const { count } = useQuote() || { count: 0 };
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[10px] font-extrabold rounded-full transition-transform duration-200 leading-none ${className || "bg-brand-600 text-white"
        }`}
    >
      {count}
    </span>
  );
}

export function AddToQuote({ p }) {
  const { add, items, setQty, remove } = useQuote() || {};
  const [added, setAdded] = useState(false);
  const defaultColour = p.colours ? p.colours[0] : "Natural Sand";
  const minQty = p.moq || 10;
  const step = 10;

  // Check if item is already added to quote basket
  const basketItem = items?.find(
    (x) => x.slug === p.slug || x.key?.startsWith(`${p.slug}-`)
  );

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!add) return;
    add(p, defaultColour, minQty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleDecrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!basketItem) return;
    const nextQty = basketItem.qty - step;
    if (nextQty < minQty) {
      if (remove) remove(basketItem.key);
    } else if (setQty) {
      setQty(basketItem.key, nextQty);
    }
  };

  const handleIncrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!basketItem || !setQty) return;
    setQty(basketItem.key, basketItem.qty + step);
  };

  if (basketItem) {
    return (
      <div className="w-full h-9 sm:h-9.5 flex items-center justify-between bg-brand-50 border border-brand-200 rounded-md p-1 shadow-2xs">
        <button
          type="button"
          onClick={handleDecrease}
          className="w-7 h-7 rounded-[4px] flex items-center justify-center text-brand-800 hover:bg-white transition-all font-bold cursor-pointer active:scale-95"
          title="Decrease quantity"
          aria-label="Decrease quantity"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="text-xs font-bold text-brand-900 px-1 truncate select-none">
          {basketItem.qty} in Basket
        </span>
        <button
          type="button"
          onClick={handleIncrease}
          className="w-7 h-7 rounded-[4px] flex items-center justify-center text-brand-800 hover:bg-white transition-all font-bold cursor-pointer active:scale-95"
          title="Increase quantity"
          aria-label="Increase quantity"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      title={`Add MOQ (${minQty}) to wholesale basket`}
      className={`w-full h-9 sm:h-9.5 px-3 text-xs sm:text-[13px] font-bold rounded-md transition-all duration-200 flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] cursor-pointer whitespace-nowrap ${added
        ? "bg-emerald-600 text-white shadow-emerald-600/30"
        : "bg-brand-600 hover:bg-brand-700 text-white hover:shadow-sm"
        }`}
    >
      {added ? (
        <>
          <Check className="w-4 h-4 stroke-[2.5] flex-shrink-0" />
          <span>Added to Basket!</span>
        </>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4 flex-shrink-0" />
          <span>Add to Basket</span>
        </>
      )}
    </button>
  );
}
