'use client';

import React, { useState } from 'react';
import { 
  Building, Plus, Users, ShieldCheck, TrendingUp, Calendar, 
  ArrowRight, Edit3, RefreshCw, CheckCircle2, FileText, Phone, Home, Sparkles
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';
import { useFamilyStore } from '@/lib/store/familyStore';
import { RentalProperty, RentalTenant } from '@/types';
import Link from 'next/link';

export default function RentalPropertiesModule() {
  const { 
    rentalProperties, 
    updateRentalProperty, 
    executeRentDiversion,
    members 
  } = useFamilyStore();

  const [activeSubTab, setActiveSubTab] = useState<'properties' | 'diversions' | 'advance'>('properties');
  const [selectedPropId, setSelectedPropId] = useState<string>(rentalProperties[0]?.id || 'rent-prop-1');
  const [diversionNotice, setDiversionNotice] = useState<string | null>(null);

  // Filter only non-hostel or all property rentals
  const personalRentalProps = rentalProperties.filter(p => !p.has_hostel_model);
  const displayProps = rentalProperties;

  // Key KPI totals
  const totalValuation = displayProps.reduce((sum, p) => sum + (p.estimated_market_value || 0), 0);
  const totalMonthlyRent = displayProps.reduce((sum, p) => sum + (p.monthly_target_revenue || 0), 0);
  const allTenants = displayProps.flatMap(p => p.tenants || []);
  const totalAdvanceHeld = allTenants.reduce((sum, t) => sum + (t.security_deposit || 0), 0);

  const handleExecuteDiversion = (propertyId: string, ruleId: string) => {
    const res = executeRentDiversion(propertyId, ruleId);
    setDiversionNotice(res.message);
    setTimeout(() => setDiversionNotice(null), 4000);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner with Wealth Valuation Sync */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#111827] via-slate-900 to-amber-950/70 border border-amber-500/30 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
                <Building size={18} />
              </span>
              <h3 className="font-bold text-base text-white">
                पारिवारिक दुकान, फ्लैट व मकान किराया (Family Rental & Valuation ERP)
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              संपत्तियों की बाजार कीमत (Valuation), कागजात, मासिक किराया, ड्यू तारीख व पारिवारिक बंटवारा।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/rentals"
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition"
            >
              <span>पूरा रेंटल हब खोलें</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 3 Core KPI Metrics */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800 text-center">
          <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-amber-300/90 font-medium block">कुल मासिक किराया</span>
            <Mono className="text-sm md:text-base font-black text-amber-400">
              ₹{totalMonthlyRent.toLocaleString('en-IN')}/माह
            </Mono>
          </div>

          <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-emerald-300/90 font-medium block">रियल एस्टेट वैल्यूएशन</span>
            <Mono className="text-sm md:text-base font-black text-emerald-400">
              ₹{(totalValuation / 10000000).toFixed(2)} Cr+
            </Mono>
          </div>

          <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-blue-300/90 font-medium block">कुल सुरक्षित अमानत (Advance)</span>
            <Mono className="text-sm md:text-base font-black text-blue-400">
              ₹{totalAdvanceHeld.toLocaleString('en-IN')}
            </Mono>
          </div>
        </div>
      </div>

      {/* Diversion execution toast notice */}
      {diversionNotice && (
        <div className="p-3 bg-emerald-900/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{diversionNotice}</span>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('properties')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeSubTab === 'properties'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
          }`}
        >
          <Building size={14} />
          <span>📋 सभी 6 संपत्तियां ({displayProps.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('diversions')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeSubTab === 'diversions'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
          }`}
        >
          <RefreshCw size={14} />
          <span>🔄 किराया बंटवारा व खर्च (Diversions)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('advance')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeSubTab === 'advance'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
          }`}
        >
          <ShieldCheck size={14} />
          <span>💰 अमानत (Advance) बही-खाता ({allTenants.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: PROPERTIES GRID */}
      {activeSubTab === 'properties' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayProps.map((p) => {
            const firstTenant = p.tenants?.find(t => t.tenant_status === 'active') || p.tenants?.[0];
            const propAdvance = (p.tenants || []).reduce((acc, t) => acc + (t.security_deposit || 0), 0);

            return (
              <div 
                key={p.id}
                className="p-4 rounded-2xl bg-[#111827] border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3 shadow-lg"
              >
                <div className="space-y-3">
                  {/* Property Title & Type Header */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl p-2 rounded-xl bg-slate-800">
                        {p.property_type === 'commercial_shop' ? '🏪' : p.property_type === 'warehouse_godown' ? '📦' : p.has_hostel_model ? '🏢' : '🏠'}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-white">{p.title}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-slate-400 capitalize">
                            {p.property_type.replace('_', ' ')}
                          </span>
                          {p.property_size && (
                            <span className="text-[10px] font-bold text-blue-300 bg-blue-500/20 px-1.5 py-0.2 rounded border border-blue-500/30">
                              📏 {p.property_size} {p.size_unit || 'sqft'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 block">
                        👤 {p.owner_member_name || 'Papa'}
                      </span>
                      {p.registration_deed_no && (
                        <span className="text-[9px] font-mono text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 block truncate max-w-[120px]">
                          📄 {p.registration_deed_no}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Valuation & Rent Card */}
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800/80 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[11px] text-slate-400">बाज़ार कीमत (Market Value):</span>
                      <span className="font-black text-emerald-400 font-mono">
                        ₹{(p.estimated_market_value || 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-slate-800 text-xs">
                      <span className="text-[11px] text-amber-300 font-bold">मासिक किराया:</span>
                      <span className="font-black text-amber-400 font-mono">
                        ₹{(p.monthly_target_revenue || 0).toLocaleString('en-IN')}/माह
                      </span>
                    </div>
                  </div>

                  {/* Dates: Start Date & Rent Due Date */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] p-2 bg-slate-900/50 rounded-xl border border-slate-800/60">
                    <div>
                      <span className="text-slate-400 block text-[9px]">📅 शुरुआत (Start Date):</span>
                      <span className="font-bold text-slate-200">
                        {firstTenant?.joining_date || '01/01/2026'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">⏰ किराया Due तारीख:</span>
                      <span className="font-bold text-amber-300">
                        हर महीने {firstTenant?.cycle_start_day || firstTenant?.rent_due_day || 5} तारीख
                      </span>
                    </div>
                  </div>

                  {/* Advance Deposit */}
                  {propAdvance > 0 && (
                    <div className="flex items-center justify-between text-[10px] px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <span className="text-blue-300 font-bold flex items-center gap-1">
                        <ShieldCheck size={12} className="text-blue-400" /> जमा अमानत (Advance):
                      </span>
                      <span className="font-mono font-black text-blue-400">₹{propAdvance.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {/* Collection & Diversion Rules */}
                  {p.rent_diversions && p.rent_diversions.length > 0 && (
                    <div className="p-2.5 bg-purple-950/30 border border-purple-500/30 rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-purple-300 flex items-center gap-1">
                        <RefreshCw size={11} className="text-purple-400" />
                        <span>किराया बंटवारा व खर्च (Allocation):</span>
                      </span>
                      <div className="space-y-0.5">
                        {p.rent_diversions.map(d => {
                          const amt = d.split_type === 'percentage' 
                            ? Math.round(((p.monthly_target_revenue || 0) * d.split_value) / 100)
                            : d.split_value;
                          return (
                            <div key={d.id} className="flex items-center justify-between text-[10px] bg-purple-900/40 px-2 py-0.5 rounded border border-purple-500/20">
                              <span className="font-bold text-white">
                                {d.target_member_name}:
                              </span>
                              <span className="text-purple-200">
                                {d.purpose} <b className="font-mono text-emerald-400">(₹{amt.toLocaleString('en-IN')})</b>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer action */}
                <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                  <Link
                    href="/rentals"
                    className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg text-center transition"
                  >
                    पूरा खाता व रसीदें →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-TAB 2: DIVERSIONS & EXPENDITURES */}
      {activeSubTab === 'diversions' && (
        <div className="space-y-4">
          <div className="p-4 bg-purple-950/40 border border-purple-500/30 rounded-2xl">
            <h4 className="font-bold text-sm text-purple-200 flex items-center gap-2">
              <RefreshCw size={16} className="text-purple-400" />
              <span>किराया कलेक्शन किसके पास जाता है और वो कहाँ खर्च/बचत करता है</span>
            </h4>
            <p className="text-xs text-purple-300/80 mt-1">
              हर प्रॉपर्टी से मिलने वाले किराए का पारिवारिक सदस्यों में ऑटोमैटिक बंटवारा, बैंक RD/FD निवेश, या घर के राशन में डायरेक्ट ट्रांसफर।
            </p>
          </div>

          <div className="space-y-3">
            {displayProps.map((p) => {
              if (!p.rent_diversions || p.rent_diversions.length === 0) return null;

              return (
                <div key={p.id} className="p-4 bg-[#111827] border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{p.title}</span>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        ₹{(p.monthly_target_revenue || 0).toLocaleString('en-IN')}/माह
                      </span>
                    </div>
                    <span className="text-[10px] text-purple-300 font-semibold">
                      कागजी मालिक: {p.owner_member_name || 'Papa'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {p.rent_diversions.map((d) => {
                      const amount = d.split_type === 'percentage' 
                        ? Math.round(((p.monthly_target_revenue || 0) * d.split_value) / 100)
                        : d.split_value;

                      return (
                        <div key={d.id} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-white">👤 {d.target_member_name}</span>
                              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono font-bold">
                                {d.split_type === 'percentage' ? `${d.split_value}%` : `₹${d.split_value}`}
                              </span>
                              <span className="font-mono font-black text-emerald-400 text-xs">
                                ₹{amount.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-300">
                              🎯 उपयोग/खर्च: <b>{d.purpose}</b> • मोड: <span className="uppercase text-slate-400">{d.payment_mode || 'bank_transfer'}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleExecuteDiversion(p.id, d.id)}
                            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow transition active:scale-95 whitespace-nowrap self-start sm:self-auto cursor-pointer"
                          >
                            ✓ इस महीने का पैसा ट्रांसफर करें
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ADVANCE DEPOSIT LEDGER */}
      {activeSubTab === 'advance' && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-950/40 border border-blue-500/30 rounded-2xl flex justify-between items-center">
            <div>
              <h4 className="font-bold text-sm text-blue-200 flex items-center gap-2">
                <ShieldCheck size={16} className="text-blue-400" />
                <span>पारिवारिक किराया अमानत बही-खाता (Advance Security Deposit Ledger)</span>
              </h4>
              <p className="text-xs text-blue-300/80 mt-1">
                सभी 6 संपत्तियों के किरायेदारों की सुरक्षित जमा अमानत पूंजी का ब्योरा।
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-blue-300 uppercase block font-bold">कुल अमानत</span>
              <Mono className="text-base font-black text-blue-400">₹{totalAdvanceHeld.toLocaleString('en-IN')}</Mono>
            </div>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-x-auto shadow">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-[10px] uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">किरायेदार</th>
                  <th className="py-2.5 px-3">प्रॉपर्टी</th>
                  <th className="py-2.5 px-3 text-right">जमा अमानत (Advance)</th>
                  <th className="py-2.5 px-3 text-right">मासिक किराया</th>
                  <th className="py-2.5 px-3">ड्यू तारीख</th>
                  <th className="py-2.5 px-3 text-center">स्थिति</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {allTenants.map((t) => {
                  const parent = displayProps.find(p => p.id === t.property_id);
                  return (
                    <tr key={t.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">{t.name}</div>
                        <div className="text-[10px] text-slate-500">शुरुआत: {t.joining_date || '01/01/2026'}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-200">{parent?.title || 'प्रॉपर्टी'}</div>
                        <div className="text-[10px] text-purple-300">कागजात: {parent?.owner_member_name || 'Papa'}</div>
                      </td>
                      <td className="py-3 px-3 text-right font-black font-mono text-blue-400">
                        ₹{(t.security_deposit || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right font-bold font-mono text-emerald-400">
                        ₹{t.monthly_rent.toLocaleString('en-IN')}/माह
                      </td>
                      <td className="py-3 px-3">
                        हर महीने {t.cycle_start_day || t.rent_due_day || 5} तारीख
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                          सुरक्षित जमा (Held)
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
