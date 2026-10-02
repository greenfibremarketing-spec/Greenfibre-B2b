"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, ArrowRight, Package } from "lucide-react";
export default function NavbarSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const router = useRouter();

  const trimmed = query.trim().toLowerCase();

  useEffect(() => {
    if (!trimmed) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults((data.products || []).slice(0, 5));
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [trimmed]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (trimmed) {
      setIsOpen(false);
      router.push(`/products?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Desktop Search Input Pill */}
      <form onSubmit={handleSubmit} className="relative hidden md:flex items-center">
        <span className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400" />
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search products..."
          className="w-40 lg:w-56 text-xs font-medium pl-8 pr-8 py-1.5 bg-slate-100/90 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-brand-500 rounded-lg text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:w-48 lg:focus:w-64 focus:ring-2 focus:ring-brand-500/20"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="hidden lg:inline-flex items-center gap-0.5 absolute right-2 text-[10px] font-semibold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 pointer-events-none">
            ⌘K
          </kbd>
        )}
      </form>

      {/* Mobile Search Trigger Icon Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className="md:hidden p-2 text-slate-600 hover:text-brand-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        aria-label="Search catalog"
      >
        <Search className="w-4 h-4" />
      </button>

      {/* Real-Time Dropdown Results Modal */}
      {isOpen && (
        <div className="absolute top-full right-0 md:left-0 md:right-auto mt-2 w-[calc(100vw-2rem)] max-w-[380px] bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Mobile Input inside popup */}
          <div className="md:hidden p-3 border-b border-slate-100">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                autoFocus
                className="w-full text-xs font-medium pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:bg-white focus:border-brand-500"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {trimmed ? (
            searchResults.length > 0 ? (
              <div className="p-2 space-y-1">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Products ({searchResults.length})
                </div>
                {searchResults.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/products/${item.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-brand-50/70 border border-transparent hover:border-brand-200 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate group-hover:text-brand-800">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span>MOQ: {item.moq}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-extrabold text-brand-700">
                        ₹{item.price}
                      </div>
                      <div className="text-[10px] text-slate-400">/{item.unit}</div>
                    </div>
                  </Link>
                ))}

                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full py-2 px-3 text-xs font-bold text-brand-700 hover:text-brand-800 hover:bg-brand-50 rounded-lg flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>View all matching results</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center space-y-2">
                <Package className="w-8 h-8 text-slate-300 mx-auto" />
                <div className="text-xs font-bold text-slate-800">No products found</div>
                <div className="text-[11px] text-slate-500">
                  Try searching for &quot;tumbler&quot;, &quot;husk&quot;, &quot;mug&quot;, or &quot;gift set&quot;.
                </div>
              </div>
            )
          ) : (
            <div className="p-4 space-y-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["Coffee Mug", "Thermal Bottle", "Gift Hampers", "Dining Bowls", "Bento Lunchbox"].map(
                  (term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setQuery(term);
                        inputRef.current?.focus();
                      }}
                      className="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-brand-50 hover:text-brand-800 border border-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
