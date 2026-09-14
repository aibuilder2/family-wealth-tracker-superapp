"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function CollapsibleSection({ title, icon, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-xl bg-[#111827] overflow-hidden shadow-lg border border-slate-800">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-[#0B0F19] hover:bg-slate-800/50 transition"
      >
        <div className="flex items-center gap-2 font-bold text-white">
          {icon && <span className="text-blue-600">{icon}</span>}
          {title}
        </div>
        <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="p-4 border-t animate-in fade-in duration-200">{children}</div>
      )}
    </div>
  );
}