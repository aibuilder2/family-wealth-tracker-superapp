"use client";

import { X, Settings, AlertCircle } from "lucide-react";

interface SetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SetupModal({ isOpen, onClose }: SetupModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#111827] rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b bg-[#0B0F19]">
          <h3 className="font-bold text-white flex items-center gap-2"><Settings className="h-5 w-5 text-slate-400"/> Account Setup</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-slate-300 transition"><X className="h-5 w-5"/></button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Starting Virtual Margin</label>
            <select className="w-full border rounded-lg p-3 text-sm outline-none focus:border-blue-500 bg-[#111827]">
              <option>₹1,00,000 (Beginner)</option>
              <option>₹5,00,000 (Intermediate)</option>
              <option>₹10,00,000 (Pro Simulator)</option>
            </select>
          </div>
          <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-xs flex gap-2 items-start border border-blue-100">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>You can reset your account anytime from the dashboard. This will erase all past trades.</p>
          </div>
          <button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-lg border border-slate-800">Save & Start Trading</button>
        </div>
      </div>
    </div>
  );
}
