"use client";

import { useState, useEffect } from "react";
import { AlertOctagon } from "lucide-react";

export default function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem("mainDisclaimerAccepted");
    if (!hasAccepted) setIsOpen(true);
  }, []);

  const handleAccept = () => {
    if (!accepted) return;
    localStorage.setItem("mainDisclaimerAccepted", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-sans">
      <div className="bg-[#111827] rounded-2xl shadow-2xl max-w-lg w-full p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300 border border-slate-800">
        <div className="flex items-center gap-3 mb-4 text-red-400">
          <AlertOctagon className="h-8 w-8" />
          <h2 className="text-xl font-bold text-slate-100">Important Disclaimer / ज़रूरी सूचना</h2>
        </div>
        <div className="text-sm text-slate-400 space-y-3 mb-6 bg-[#0B0F19] p-4 rounded-lg border border-slate-800">
          <p>1. This platform provides AI-driven insights for <strong>educational purposes only</strong>. It is not registered with SEBI as an investment advisor.</p>
          <p>2. Share market investments are subject to market risks. Read all scheme related documents carefully.</p>
          <p>3. <strong>F&O Warning:</strong> 9 out of 10 individual traders in equity Futures and Options Segment incur net losses (Source: SEBI).</p>
          <p>4. Humari website kisi bhi prakar ke financial loss ke liye zimmedar nahi hai.</p>
        </div>
        <label className="flex items-start gap-3 mb-6 cursor-pointer text-sm font-medium text-slate-300">
          <input 
            type="checkbox" 
            checked={accepted} 
            onChange={(e) => setAccepted(e.target.checked)} 
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900" 
          />
          <span>
            Maine saari shartein padh li hain aur mujhe manzoor hain. (I have read and understood the terms).
          </span>
        </label>
        <button 
          onClick={handleAccept} 
          disabled={!accepted} 
          className={`
            w-full py-3 rounded-lg font-bold text-white transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#111827]
            ${accepted 
              ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500" 
              : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }
          `}
        >
          Accept & Continue
        </button>
      </div>
    </div>
  );
}
