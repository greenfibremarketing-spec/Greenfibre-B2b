"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Leaf, Check, ChevronDown, Minus, Plus, ShoppingBag } from "lucide-react";

const QuoteContext = createContext(null);

export const useQuote = () => useContext(QuoteContext);

// ── Pricing constants & Dynamic Volume Tier Rules ────────────────────────────
// Tier 1: 1–100 units   -> 10% wholesale discount
// Tier 2: 101–200 units -> 15% volume discount
// Tier 3: 201+ units    -> 20% enterprise bulk discount
// Bundle bonus (5%) applied on overall net subtotal when 2+ distinct products are in basket.
export const BUNDLE_BONUS_PCT = 5;

export function getItemDiscountPct(qty) {
  const q = Number(qty) || 1;
  if (q >= 201 || q >= 200) return 20; // Tier 3: 200+ units -> 20% off
  if (q >= 101) return 15;  // Tier 2: 101–200 units -> 15% off
  return 10;                // Tier 1: 1–100 units -> 10% off
}

export function getItemTierNumber(qty) {
  const q = Number(qty) || 1;
  if (q >= 201 || q >= 200) return 3;
  if (q >= 101) return 2;
  return 1;
}

export function getItemTierLabel(qty) {
  const q = Number(qty) || 1;
  if (q >= 201 || q >= 200) return "Tier 3 (200+ units • 20% Off)";
  if (q >= 101) return "Tier 2 (101–200 units • 15% Off)";
  return "Tier 1 (Wholesale 1–100 • 10% Off)";
}

// Safely resolve the original MRP — NEVER from an already-discounted price
function resolveMRP(product) {
  if (product.wholesalePrice    > 0) return product.wholesalePrice;
  if (product.originalBasePrice > 0) return product.originalBasePrice;
  if (product.retailPrice       > 0) return product.retailPrice;
  if (product.mrp               > 0) return product.mrp;
  if (product.price             > 0) {
    const discount = product.discountPct || getItemDiscountPct(product.qty || 1);
    return Math.round(product.price / (1 - discount / 100));
  }
  return 500;
}

export function QuoteProvider({ children }) {
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gf_quote_v2");
      if (saved) setItems(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to load quote basket", e);
    }
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3200);
  };

  const saveItems = (newItems) => {
    setItems(newItems);
    try {
      localStorage.setItem("gf_quote_v2", JSON.stringify(newItems));
    } catch (e) {
      console.error("Failed to persist quote basket", e);
    }
  };

  // ── add ───────────────────────────────────────────────────────────────────
  const add = (product, colour, qty) => {
    const key = `${product.slug}-${colour || "standard"}`;

    // Lock the MRP on first add — this value never changes regardless of qty updates
    const mrp = resolveMRP(product);

    const existing = items.find((x) => x.key === key);
    let updated;

    if (existing) {
      const newQty       = existing.qty + qty;
      const lockedMRP    = existing.wholesalePrice || existing.originalBasePrice || mrp;
      const discountPct  = getItemDiscountPct(newQty);
      const lockedUnitPx = Math.round(lockedMRP * (1 - discountPct / 100));

      updated = items.map((x) =>
        x.key === key
          ? {
              ...x,
              qty:              newQty,
              price:            lockedUnitPx,
              wholesalePrice:   lockedMRP,
              originalBasePrice: lockedMRP,
              retailPrice:      lockedMRP,
              discountPct,
              tierNumber:       getItemTierNumber(newQty),
              customBranding:           product.customBranding          ?? x.customBranding,
              selectedCustomizations:   product.selectedCustomizations  ?? x.selectedCustomizations,
              customizationCount:       product.customizationCount      ?? x.customizationCount,
              maxAllowedCustomizations: product.maxAllowedCustomizations ?? x.maxAllowedCustomizations,
              brandingNotes:            product.brandingNotes           ?? x.brandingNotes,
              packagingOption:          product.packagingOption         ?? x.packagingOption,
              senderName:               product.senderName              ?? x.senderName,
              receiverName:             product.receiverName            ?? x.receiverName,
              giftMessage:              product.giftMessage             ?? x.giftMessage,
              engravingName:            product.engravingName           ?? x.engravingName,
              customProductName:        product.customProductName       ?? x.customProductName,
              isPairItem:               product.isPairItem              ?? x.isPairItem,
              isPair:                   product.isPair                  ?? x.isPair,
              moq: (product.isPairItem || x.isPairItem || product.isPair || x.isPair) ? 1 : (product.moq || x.moq || 10),
            }
          : x
      );
    } else {
      const isPair = Boolean(product.isPairItem || product.isPair || product.bundleDiscountApplied || product.activeTierTitle?.includes("Bundle"));
      const discountPct = getItemDiscountPct(qty);
      const unitPrice = Math.round(mrp * (1 - discountPct / 100));

      updated = [
        ...items,
        {
          key,
          slug:             product.slug,
          sku:              product.sku  || "GF-B2B",
          name:             product.name,
          unit:             product.unit || "piece",
          price:            unitPrice,
          wholesalePrice:   mrp,           // LOCKED MRP — never recalculated
          originalBasePrice: mrp,
          retailPrice:      mrp,
          discountPct,
          tierNumber:       getItemTierNumber(qty),
          moq:              isPair ? 1 : (product.moq || 10),
          isPairItem:       isPair,
          isPair:           isPair,
          image:            product.image,
          colour:           colour || "Standard",
          qty,
          customBranding:           product.customBranding,
          selectedCustomizations:   product.selectedCustomizations,
          customizationCount:       product.customizationCount,
          maxAllowedCustomizations: product.maxAllowedCustomizations,
          brandingNotes:            product.brandingNotes,
          packagingOption:          product.packagingOption,
          senderName:               product.senderName        || "",
          receiverName:             product.receiverName      || "",
          giftMessage:              product.giftMessage       || "",
          engravingName:            product.engravingName     || "",
          customProductName:        product.customProductName || "",
        },
      ];
    }

    saveItems(updated);
    showToast(`Added ${qty}× ${product.name} to quote basket.`);
  };

  // ── setQty ────────────────────────────────────────────────────────────────
  const setQty = (key, rawQty) => {
    const updated = items.map((x) => {
      if (x.key !== key) return x;
      const isPair = Boolean(x.isPairItem || x.isPair || x.bundleDiscountApplied || x.moq === 1);
      const minAllowed = isPair ? 1 : (x.moq || 10);
      const parsedQty = Math.max(minAllowed, parseInt(rawQty, 10) || minAllowed);
      // Always recalculate from the LOCKED MRP with dynamic tier discount
      const lockedMRP   = x.wholesalePrice || x.originalBasePrice || x.mrp || 500;
      const discountPct = getItemDiscountPct(parsedQty);
      const newUnitPx   = Math.round(lockedMRP * (1 - discountPct / 100));
      return {
        ...x,
        qty:          parsedQty,
        price:        newUnitPx,
        wholesalePrice: lockedMRP,
        originalBasePrice: lockedMRP,
        retailPrice:  lockedMRP,
        discountPct,
        tierNumber:   getItemTierNumber(parsedQty),
        moq:          isPair ? 1 : (x.moq || 10),
        isPairItem:   isPair,
        isPair:       isPair,
      };
    });
    saveItems(updated);
  };

  // ── remove / clear ────────────────────────────────────────────────────────
  const remove = (key) => {
    saveItems(items.filter((x) => x.key !== key));
    showToast("Item removed from basket.");
  };

  const clear = () => saveItems([]);

  const updateCustomizations = (key, data) => {
    saveItems(items.map((x) => (x.key === key ? { ...x, ...data } : x)));
  };

  // ── Derived cart-level totals with dynamic tier discounts ────────────────
  const totalUnits = items.reduce((acc, it) => acc + (it.qty || 0), 0);

  // Bundle bonus: 5% extra off when 2+ distinct products are paired in basket
  const hasBundleBonus = items.length >= 2;

  const totalGross = items.reduce((acc, it) => {
    const mrp = it.wholesalePrice || it.originalBasePrice || it.mrp || 0;
    return acc + (mrp * (it.qty || 0));
  }, 0);

  const totalItemDiscount = items.reduce((acc, it) => {
    const mrp = it.wholesalePrice || it.originalBasePrice || it.mrp || 0;
    const q = it.qty || 0;
    const discountPct = getItemDiscountPct(q);
    const lineGross = mrp * q;
    return acc + Math.round(lineGross * (discountPct / 100));
  }, 0);

  const netSubtotalBeforeBundle = totalGross - totalItemDiscount;

  const bundleBonusAmount = hasBundleBonus
    ? Math.round(netSubtotalBeforeBundle * (BUNDLE_BONUS_PCT / 100))
    : 0;

  const estimatedTotal = netSubtotalBeforeBundle - bundleBonusAmount;

  return (
    <QuoteContext.Provider
      value={{
        items,
        add,
        setQty,
        remove,
        clear,
        updateCustomizations,
        count: items.length,
        totalUnits,
        totalGross,
        totalItemDiscount,
        hasBundleBonus,
        bundleBonusAmount,
        netSubtotalBeforeBundle,
        estimatedTotal,
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
          <div className="flex items-center gap-3 bg-[#FAF7F0] text-slate-800 px-4 py-3 rounded-xl shadow-xl border border-[#E5DAC8] max-w-md w-full sm:w-auto pointer-events-auto">
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

export function Count() {
  const { count } = useQuote() || { count: 0 };
  return (
    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold bg-white text-brand-800 rounded-full transition-transform duration-200">
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
      className={`w-full h-9 sm:h-9.5 px-3 text-xs sm:text-[13px] font-bold rounded-md transition-all duration-200 flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] cursor-pointer whitespace-nowrap ${
        added
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
