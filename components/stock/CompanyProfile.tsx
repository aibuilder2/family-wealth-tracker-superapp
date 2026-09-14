"use client";

import { Globe, Users, MapPin } from "lucide-react";

export default function CompanyProfile({ name = "Company Name", description = "A brief description of the company operations." }) {
  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 p-6">
      <h3 className="font-bold text-white text-xl mb-4 border-b pb-2">About {name}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-6">
        {description}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Globe className="h-4 w-4 text-blue-500" />
          <a href="#" className="hover:underline">www.example.com</a>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Users className="h-4 w-4 text-blue-500" />
          <span>100,000+ Employees</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <MapPin className="h-4 w-4 text-blue-500" />
          <span>Mumbai, India</span>
        </div>
      </div>
    </div>
  );
}