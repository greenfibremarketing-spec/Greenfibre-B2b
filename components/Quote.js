"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Leaf, Check, ChevronDown, Minus, Plus, ShoppingBag } from "lucide-react";

const QuoteContext = createContext(null);

export const useQuote = () => useContext(QuoteContext);

export function QuoteProvider({ children }) {
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gf_quote_v2");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load quote basket", e);
    }
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const saveItems = (newItems) => {
    setItems(newItems);
    try {
      localStorage.setItem("gf_quote_v2", JSON.stringify(newItems));
    } catch (e) {
      console.error("Failed to persist quote basket", e);
    }
  };

  const add = (product, colour, qty) => {
    const key = `${product.slug}-${colour || "standard"}`;
    const existing = items.find((x) => x.key === key);
    let updated;
    if (existing) {
      updated = items.map((x) =>
        x.key === key
          ? {
              ...x,
              qty: x.qty + qty,
              price: product.price ?? x.price,
              customBranding: product.customBranding ?? x.customBranding,
              selectedCustomizations:
                product.selectedCustomizations ?? x.selectedCustomizations,
              customizationCount:
                product.customizationCount ?? x.customizationCount,
              maxAllowedCustomizations:
                product.maxAllowedCustomizations ?? x.maxAllowedCustomizations,
              brandingNotes: product.brandingNotes ?? x.brandingNotes,
              packagingOption: product.packagingOption ?? x.packagingOption,
              activeTierTitle: product.activeTierTitle ?? x.activeTierTitle,
              activeTierNumber: product.activeTierNumber ?? x.activeTierNumber
            }
          : x
      );
    } else {
      updated = [
        ...items,
        {
          key,
          slug: product.slug,
          sku: product.sku,
          name: product.name,
          unit: product.unit,
          price: product.price,
          moq: product.moq,
          image: product.image,
          colour: colour || "Standard",
          qty,
          customBranding: product.customBranding,
          selectedCustomizations: product.selectedCustomizations,
          customizationCount: product.customizationCount,
          maxAllowedCustomizations: product.maxAllowedCustomizations,
          brandingNotes: product.brandingNotes,
          packagingOption: product.packagingOption,
          activeTierTitle: product.activeTierTitle,
          activeTierNumber: product.activeTierNumber
        }
      ];
    }
    saveItems(updated);
    showToast(`Added ${qty}× ${product.name} (${product.activeTierTitle || "Volume Order"}) to basket.`);
  };

  const setQty = (key, qty) => {
    const updated = items.map((x) =>
      x.key === key ? { ...x, qty: Math.max(1, qty) } : x
    );
    saveItems(updated);
  };

  const remove = (key) => {
    const updated = items.filter((x) => x.key !== key);
    saveItems(updated);
    showToast("Gift set removed from basket.");
  };

  const clear = () => {
    saveItems([]);
  };

  const totalUnits = items.reduce((acc, item) => acc + (item.qty || 0), 0);
  const estimatedTotal = items.reduce(
    (acc, item) => acc + (item.price ? item.price * item.qty : 0),
    0
  );

  return (
    <QuoteContext.Provider
      value={{
        items,
        add,
        setQty,
        remove,
        clear,
        count: items.length,
        totalUnits,
        estimatedTotal,
        drawerOpen,
        setDrawerOpen,
        showToast
      }}
    >
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="flex items-center gap-3 bg-[#FAF7F0] text-slate-800 px-4 py-3 rounded-xl shadow-xl border border-[#E5DAC8] max-w-md">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs border border-brand-200">
              <Leaf className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-800 flex-1">{toast}</span>
            <Link
              href="/quote"
              className="text-xs font-bold text-brand-700 hover:text-brand-800 underline uppercase tracking-wider ml-1"
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
  const { add } = useQuote() || {};
  const [colour, setColour] = useState(p.colours ? p.colours[0] : "Natural Sand");
  const [qty, setQty] = useState(p.moq || 50);
  const [added, setAdded] = useState(false);

  const step = 10;
  const minQty = p.moq || 1;

  const handleDecrease = () => {
    setQty((prev) => Math.max(minQty, prev - step));
  };

  const handleIncrease = () => {
    setQty((prev) => prev + step);
  };

  const handleAdd = () => {
    if (!add) return;
    const finalQty = Math.max(qty, minQty);
    add(p, colour, finalQty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="space-y-2.5 w-full pt-1.5">
      {/* If multiple colours exist, show sleek finish dropdown */}
      {p.colours && p.colours.length > 1 && (
        <div className="relative">
          <select
            aria-label="Select Finish"
            value={colour}
            onChange={(e) => setColour(e.target.value)}
            className="w-full h-9 text-xs py-1.5 pl-3 pr-8 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white outline-none cursor-pointer transition-colors appearance-none"
          >
            {p.colours.map((c) => (
              <option key={c} value={c}>
                Finish: {c}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      )}

      {/* Stepper & Add to Basket Button */}
      <div className="flex items-center gap-2 w-full">
        {/* Luxury Stepper Pill */}
        <div className="h-10 inline-flex items-center bg-slate-100/90 border border-slate-200 rounded-xl p-0.5 shadow-xs flex-shrink-0">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={qty <= minQty}
            className="w-7 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-xs disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold text-sm cursor-pointer"
            title="Decrease quantity"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <input
            aria-label={`Quantity in ${p.unit}`}
            type="number"
            min={minQty}
            step={step}
            value={qty}
            onChange={(e) => setQty(Math.max(minQty, parseInt(e.target.value, 10) || minQty))}
            className="w-9 text-center text-xs font-bold text-slate-900 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />

          <button
            type="button"
            onClick={handleIncrease}
            className="w-7 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-xs transition-all font-bold text-sm cursor-pointer"
            title="Increase quantity"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Luxury Action Button: Add to Basket */}
        <button
          type="button"
          onClick={handleAdd}
          title={`Add ${qty} ${p.unit} to wholesale basket`}
          className={`h-10 flex-1 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] cursor-pointer whitespace-nowrap ${
            added
              ? "bg-emerald-600 text-white shadow-emerald-600/30"
              : "bg-brand-600 hover:bg-brand-700 text-white hover:shadow-md hover:-translate-y-0.5"
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Added to Basket</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Basket</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
