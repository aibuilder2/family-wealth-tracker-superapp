"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { getPythonBackendUrl } from "@/lib/api";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{symbol:string, company_name:string}[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.trim().length === 0) {
      setIsOpen(false);
      setResults([]);
      return;
    }

    // Debounced real search against stocks_master — so the user can look
    // up ANY listed stock, not just a hardcoded handful.
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(getPythonBackendUrl(`/data-sync/search-stocks?q=${encodeURIComponent(val.trim())}`));
        const data = await res.json();
        setResults(data.results || []);
        setIsOpen(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  };

  const handleSelect = (sym: string) => {
    setIsOpen(false);
    setQuery("");
    // Redirect to the individual stock page (e.g. /stock/RELIANCE)
    router.push(`/stock/${sym}`);
  };

  return (
    <div ref={searchRef} className="relative w-full sm:w-72 z-50">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text"
          placeholder="Search stocks (e.g. RELIANCE)..."
          value={query}
          onChange={handleSearch}
          className="w-full bg-[#111827] border border-slate-700 text-slate-200 text-sm rounded-xl pl-9 pr-8 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-500 shadow-inner"
        />
        {query && (
          <button onClick={() => { setQuery(""); setIsOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 bg-slate-800 rounded-full p-0.5">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isOpen && (searching || results.length > 0 || query.trim().length > 0) && (
        <div className="absolute top-full mt-2 w-full bg-[#111827] border border-slate-700 rounded-xl shadow-2xl shadow-black/80 overflow-hidden">
          <div className="max-h-64 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {searching ? (
              <div className="p-4 text-center text-xs text-slate-500">Searching...</div>
            ) : results.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">Koi stock nahi mila "{query}" ke liye.</div>
            ) : (
              results.map((stock) => (
                <div
                  key={stock.symbol}
                  onClick={() => handleSelect(stock.symbol)}
                  className="flex items-center justify-between p-3 border-b border-slate-800/50 hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <div>
                    <div className="font-bold text-sm text-blue-400">{stock.symbol}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{stock.company_name}</div>
                  </div>
                  <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {isOpen && query.length > 0 && results.length === 0 && (
         <div className="absolute top-full mt-2 w-full bg-[#111827] border border-slate-700 rounded-xl shadow-2xl p-5 text-center text-sm text-slate-400">
            No stocks found for "{query}"
         </div>
      )}
    </div>
  );
}