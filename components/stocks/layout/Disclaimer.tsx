"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";

export default function Disclaimer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("termsAccepted");
    if (!accepted) setIsVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("termsAccepted", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#111827] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-white">Terms & Conditions</h2>
        </div>
        
        <div className="text-slate-300 space-y-4 text-sm mb-8">
          <p>
            Welcome to StockScan. Platform use karne se pehle kripya dhyan dein:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li>Ye platform <strong>sirf knowledge aur educational purpose</strong> ke liye hai.</li>
            <li>Yaha diye gaye AI predictions, target, aur stoploss expected hain aur inko <strong>trading purpose ke liye use na karein</strong>.</li>
            <li>Bina apne <strong>financial advisor ke salah</strong> ke koi bhi nivesh (investment) na karein.</li>
            <li>Stock market me risk hota hai. Trade me hone wale kisi bhi nuksan (loss) ki <strong>humari ya is platform ki koi jawabdaari nahi hai</strong>.</li>
          </ul>
        </div>

        <button 
          onClick={handleAccept}
          className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-4 rounded-xl transition-colors"
        >
          I Accept & Understand
        </button>
      </div>
    </div>
  );
}
