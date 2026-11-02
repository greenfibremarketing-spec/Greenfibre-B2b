"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Leaf, Check, ChevronDown, Minus, Plus, ShoppingBag } from "lucide-react";

const QuoteContext = createContext(null);

export const useQuote = () => useContext(QuoteContext);

export {
  BUNDLE_BONUS_PCT,
  DIWALI_SPECIAL_EXTRA_PCT,
  getItemDiscountPct,
  getItemTierNumber,
  getItemTierLabel,
  computeLineItem,
  moqErrors,
  sanitizeCustomizationPayload
} from "@/lib/cartModel";
import {
  BUNDLE_BONUS_PCT,
  DIWALI_SPECIAL_EXTRA_PCT,
  getItemDiscountPct,
  getItemTierNumber,
  getItemTierLabel,
  computeLineItem,
  moqErrors,
  sanitizeCustomizationPayload
} from "@/lib/cartModel";

// Safely resolve the base reference MRP — NEVER from an already-discounted price
function resolveMRP(product) {
  if (product.mrp > 0) return product.mrp;
  if (product.retailMrp > 0) return product.retailMrp;
  if (product.retailPrice > 0) return product.retailPrice;
  if (product.originalPrice > 0) return product.originalPrice;
  if (product.wholesalePrice > 0) return product.wholesalePrice;
  if (product.originalBasePrice > 0) return product.originalBasePrice;
  if (product.price > 0) return product.price;
  return 500;
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

  const saveItems = (newItemsOrUpdater) => {
    setItems((prevItems) => {
      const newItems = typeof newItemsOrUpdater === "function" ? newItemsOrUpdater(prevItems) : newItemsOrUpdater;
      const computed = newItems.map(computeLineItem);
      try {
        localStorage.setItem("gf_quote_v2", JSON.stringify(computed));
      } catch (e) {
        console.error("Failed to persist quote basket", e);
      }
      return computed;
    });
  };

  // ── addBatch (Atomic addition of multiple items/variants in a single pass) ──
  const addBatch = (batchList) => {
    if (!Array.isArray(batchList) || batchList.length === 0) return;

    saveItems((currentItems) => {
      let current = [...currentItems];

      for (const { product, colour, qty } of batchList) {
        const isPair = Boolean(product.isPairItem === true || product.isPair === true || product.addOn === true);
        const isPrimary = !isPair;
        const parentSlug = isPair ? (product.parentSlug || product.pairedWithSlug || null) : null;
        const rawColor = (colour || product.colour || product.color || "").trim();

        if (!rawColor) {
          console.error("Cart line rejected: missing required color for " + (product.name || product.slug));
          continue;
        }

        const pairedWithKey = isPair ? (product.pairedWithKey || (parentSlug ? `${parentSlug}-${rawColor.toLowerCase()}` : null)) : null;
        const parentName = isPair ? (product.parentName || null) : null;

        const key = isPair && parentSlug
          ? `${product.slug}-${rawColor.toLowerCase()}-addon-${parentSlug}`
          : isPair
            ? `${product.slug}-${rawColor.toLowerCase()}-addon`
            : `${product.slug}-${rawColor.toLowerCase()}`;

        const mrp = resolveMRP(product);
        const minAllowed = 1;
        const maxStock = typeof product.totalStock === "number" && product.totalStock > 0
          ? product.totalStock
          : (typeof product.stockQuantity === "number" && product.stockQuantity > 0 ? product.stockQuantity : 999999);
        const validQty = Math.min(maxStock, Math.max(minAllowed, parseInt(qty, 10) || minAllowed));

        const existingIndex = current.findIndex((x) => x.key === key);

        if (existingIndex !== -1) {
          const existing = current[existingIndex];
          const newQty = Math.min(maxStock, existing.qty + validQty);
          const lockedMRP = existing.wholesalePrice || existing.originalBasePrice || mrp;

          current[existingIndex] = computeLineItem({
            ...existing,
            qty: newQty,
            wholesalePrice: lockedMRP,
            originalBasePrice: lockedMRP,
            retailPrice: lockedMRP,
            isPrimary: !isPair,
            isPairItem: isPair,
            isPair: isPair,
            addOn: isPair,
            parentSlug: isPair ? (parentSlug || existing.parentSlug || null) : null,
            pairedWithSlug: isPair ? (parentSlug || existing.pairedWithSlug || null) : null,
            pairedWithKey: isPair ? (pairedWithKey || existing.pairedWithKey || null) : null,
            parentName: isPair ? (parentName || existing.parentName || null) : null,
            moq: product.moq || 10,
            productId: product.productId || product._id || product.id || existing.productId,
            variantId: product.variantId || existing.variantId || null,
            raw_sku: product.raw_sku || product.sku || existing.raw_sku || "GF-B2B",
            channel: "b2b",
            colour: rawColor,
            color: rawColor,
            selectedColor: rawColor,
            selectedColour: rawColor,
            customBranding: product.customBranding ?? existing.customBranding,
            selectedCustomizations: product.selectedCustomizations ?? existing.selectedCustomizations,
            customizationCount: product.customizationCount ?? existing.customizationCount,
            maxAllowedCustomizations: product.maxAllowedCustomizations ?? existing.maxAllowedCustomizations,
            brandingNotes: product.brandingNotes ?? existing.brandingNotes,
            packagingOption: product.packagingOption ?? existing.packagingOption,
            senderName: product.senderName ?? existing.senderName,
            receiverName: product.receiverName ?? existing.receiverName,
            giftMessage: product.giftMessage ?? existing.giftMessage,
            engravingName: product.engravingName ?? existing.engravingName,
            customProductName: product.customProductName ?? existing.customProductName,
          });
        } else {
          current.push(
            computeLineItem({
              key,
              productId: product.productId || product._id || product.id,
              variantId: product.variantId || null,
              raw_sku: product.raw_sku || product.sku || "GF-B2B",
              channel: "b2b",
              slug: product.slug,
              sku: product.sku || "GF-B2B",
              name: product.name,
              totalStock: product.totalStock,
              stockQuantity: product.stockQuantity,
              unit: product.unit || (/\b(set|sets|storage bowl|storage bowls|bowl set|bowls set|dining set|hamper|combo|pack of|gift set|kit)\b/i.test(product.name || "") ? "set" : "piece"),
              wholesalePrice: mrp,
              originalBasePrice: mrp,
              retailPrice: mrp,
              mrp,
              moq: product.moq || 10,
              isPrimary: !isPair,
              isPairItem: isPair,
              isPair: isPair,
              addOn: isPair,
              parentSlug,
              pairedWithSlug: parentSlug,
              pairedWithKey,
              parentName,
              image: product.image,
              colour: rawColor,
              color: rawColor,
              selectedColor: rawColor,
              selectedColour: rawColor,
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
            })
          );
        }
      }

      return current;
    });

    const totalAdded = batchList.reduce((sum, item) => sum + (parseInt(item.qty, 10) || 0), 0);
    showToast(`Added ${totalAdded} pieces to quote basket.`);
  };

  // ── add ───────────────────────────────────────────────────────────────────
  const add = (product, colour, qty) => {
    addBatch([{ product, colour, qty }]);
  };

  // ── setQty (Instant Centralized Reactive Update) ───────────────────────────
  const setQty = (key, rawQty) => {
    const parsed = parseInt(rawQty, 10);
    const updated = items.map((x) => {
      if (x.key !== key) return x;
      const minAllowed = 1;
      const maxStock = typeof x.totalStock === "number" && x.totalStock > 0
        ? x.totalStock
        : (typeof x.stockQuantity === "number" && x.stockQuantity > 0 ? x.stockQuantity : 999999);
      const validQty = Math.min(maxStock, Math.max(minAllowed, isNaN(parsed) ? minAllowed : parsed));
      return computeLineItem({ ...x, qty: validQty, minQty: 1 });
    });
    saveItems(updated);
  };

  // ── remove / clear ────────────────────────────────────────────────────────
  const remove = (key) => {
    const itemToRemove = items.find((x) => x.key === key);
    if (!itemToRemove) {
      saveItems(items.filter((x) => x.key !== key));
      return;
    }

    const isPrimary = !itemToRemove.isPair && !itemToRemove.isPairItem && !itemToRemove.addOn;

    let remaining;
    if (isPrimary) {
      // 1. Remove the primary item
      // 2. Also remove any paired items linked specifically to this primary item key
      remaining = items.filter((x) => {
        if (x.key === itemToRemove.key) return false;
        const isLinkedPair = (x.isPair || x.isPairItem || x.addOn) && (
          x.pairedWithKey === itemToRemove.key ||
          (x.key && x.key.includes(`-addon-${itemToRemove.slug}`))
        );
        if (isLinkedPair) return false;
        return true;
      });

      // 3. Find all primary items remaining in the basket
      const remainingPrimary = remaining.filter((x) => !x.isPair && !x.isPairItem && !x.addOn);

      // If NO primary items remain at all in the basket, purge orphan pair items!
      if (remainingPrimary.length === 0) {
        remaining = [];
      } else {
        remaining = remaining.filter((x) => {
          if (!x.isPair && !x.isPairItem && !x.addOn) return true;
          if (x.parentSlug || x.pairedWithSlug) {
            const pSlug = x.parentSlug || x.pairedWithSlug;
            return remainingPrimary.some((p) => p.slug === pSlug);
          }
          return true;
        });
      }

      showToast(`Removed ${itemToRemove.name} (${itemToRemove.colour || itemToRemove.color})${items.length > remaining.length + 1 ? " and linked paired item" : ""}.`);
    } else {
      // User is removing a pair/add-on item directly
      remaining = items.filter((x) => x.key !== itemToRemove.key);
      showToast(`Removed ${itemToRemove.name} (${itemToRemove.colour || itemToRemove.color}) from basket.`);
    }

    saveItems(remaining);
  };

  const clear = () => saveItems([]);

  // Strip colour/variant/identity fields so customizations never overwrite line identity
  const sanitizeCustomizationPayload = (payload) => {
    if (!payload || typeof payload !== "object") return {};
    const {
      colour,
      color,
      selectedColor,
      selectedColour,
      variantId,
      key,
      slug,
      productId,
      raw_sku,
      channel,
      ...safeFields
    } = payload;
    return safeFields;
  };

  const updateCustomizations = (keyOrUpdates, data) => {
    saveItems((current) => {
      if (typeof keyOrUpdates === "object" && keyOrUpdates !== null && !data) {
        return current.map((x) => {
          const update = keyOrUpdates[x.key];
          if (!update) return x;
          return { ...x, ...sanitizeCustomizationPayload(update) };
        });
      }
      return current.map((x) => (x.key === keyOrUpdates ? { ...x, ...sanitizeCustomizationPayload(data) } : x));
    });
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
        addBatch,
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
        moqErrors: () => moqErrors(lineItems),
        moqErrorList: moqErrors(lineItems),
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
  // Do not default silently to colours[0]; require explicit color pick on product page
  return (
    <Link
      href={`/products/${p.slug || ""}`}
      className="w-full h-9 sm:h-9.5 px-3 text-xs sm:text-[13px] font-bold rounded-md transition-all duration-200 flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] cursor-pointer whitespace-nowrap bg-green-600 hover:bg-green-700 text-white hover:shadow-sm"
      title={`Select color & quantity for ${p.name}`}
    >
      <ShoppingBag className="w-4 h-4 flex-shrink-0" />
      <span>Select Options</span>
    </Link>
  );
}
