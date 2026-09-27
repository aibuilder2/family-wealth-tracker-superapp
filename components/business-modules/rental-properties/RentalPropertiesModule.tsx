'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building, Plus, Users, ShieldCheck, TrendingUp, Calendar, 
  ArrowRight, Edit3, RefreshCw, CheckCircle2, FileText, Phone, Home, 
  Sparkles, X, Clock, CreditCard, Receipt
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';
import { useFamilyStore } from '@/lib/store/familyStore';
import { RentalProperty, RentalTenant } from '@/types';
import Link from 'next/link';

export default function RentalPropertiesModule() {
  const { 
    rentalProperties, 
    updateRentalProperty, 
    updateRentalTenant,
    collectRentPayment,
    executeRentDiversion,
    members 
  } = useFamilyStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [activeSubTab, setActiveSubTab] = useState<'properties' | 'diversions' | 'advance'>('properties');
  const [diversionNotice, setDiversionNotice] = useState<string | null>(null);

  // Modals State
  const [editingProp, setEditingProp] = useState<RentalProperty | null>(null);
  const [propTitle, setPropTitle] = useState('');
  const [propType, setPropType] = useState('commercial_shop');
  const [propSize, setPropSize] = useState<number>(0);
  const [propSizeUnit, setPropSizeUnit] = useState('sqft');
  const [propOwnerMemberId, setPropOwnerMemberId] = useState('');
  const [propOwnerName, setPropOwnerName] = useState('Papa');
  const [propDeedNo, setPropDeedNo] = useState('');
  const [propMarketValue, setPropMarketValue] = useState<number>(0);
  const [propPurchasePrice, setPropPurchasePrice] = useState<number>(0);
  const [propPurchaseDate, setPropPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [propMonthlyRent, setPropMonthlyRent] = useState<number>(0);

  // Collect Rent Modal State
  const [collectingTenant, setCollectingTenant] = useState<{ tenant: RentalTenant; property: RentalProperty } | null>(null);
  const [collectAmount, setCollectAmount] = useState<number>(0);
  const [collectDate, setCollectDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [collectTime, setCollectTime] = useState<string>(new Date().toTimeString().slice(0, 5));
  const [collectMode, setCollectMode] = useState<'upi' | 'cash' | 'bank_transfer' | 'cheque'>('upi');
  const [collectRef, setCollectRef] = useState<string>('');

  // Advance Deposit Edit Modal State
  const [editingAdvance, setEditingAdvance] = useState<{ tenant: RentalTenant; property: RentalProperty } | null>(null);
  const [advanceAmount, setAdvanceAmount] = useState<number>(0);
  const [advanceDate, setAdvanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [advanceMode, setAdvanceMode] = useState<'upi' | 'cash' | 'bank_transfer' | 'cheque'>('upi');

  const displayProps = rentalProperties;

  // Key KPI totals
  const totalValuation = displayProps.reduce((sum, p) => sum + (p.estimated_market_value || 0), 0);
  const totalMonthlyRent = displayProps.reduce((sum, p) => sum + (p.monthly_target_revenue || 0), 0);
  const allTenants = displayProps.flatMap(p => p.tenants || []);
  const totalAdvanceHeld = allTenants.reduce((sum, t) => sum + (t.security_deposit || 0), 0);

  const handleOpenEditProp = (p: RentalProperty) => {
    setEditingProp(p);
    setPropTitle(p.title || '');
    setPropType(p.property_type || 'commercial_shop');
    setPropSize(p.property_size || 0);
    setPropSizeUnit(p.size_unit || 'sqft');
    setPropOwnerMemberId(p.owner_member_id || members[0]?.id || '');
    setPropOwnerName(p.owner_member_name || 'Papa');
    setPropDeedNo(p.registration_deed_no || '');
    setPropMarketValue(p.estimated_market_value || 0);
    setPropPurchasePrice(p.purchase_price || 0);
    setPropPurchaseDate(p.purchase_date || new Date().toISOString().split('T')[0]);
    setPropMonthlyRent(p.monthly_target_revenue || 0);
  };

  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProp) return;

    const selectedOwner = members.find(m => m.id === propOwnerMemberId);

    updateRentalProperty(editingProp.id, {
      title: propTitle,
      property_type: propType as any,
      property_size: Number(propSize) || 0,
      size_unit: propSizeUnit as any,
      owner_member_id: propOwnerMemberId,
      owner_member_name: selectedOwner?.name || propOwnerName || 'Papa',
      registration_deed_no: propDeedNo,
      estimated_market_value: Number(propMarketValue) || 0,
      purchase_price: Number(propPurchasePrice) || 0,
      purchase_date: propPurchaseDate,
      monthly_target_revenue: Number(propMonthlyRent) || 0,
    });

    setEditingProp(null);
  };

  const handleOpenCollectRent = (tenant: RentalTenant, prop: RentalProperty) => {
    setCollectingTenant({ tenant, property: prop });
    setCollectAmount(tenant.monthly_rent || 0);
    setCollectDate(new Date().toISOString().split('T')[0]);
    setCollectTime(new Date().toTimeString().slice(0, 5));
    setCollectMode((tenant.last_payment_mode as any) || 'upi');
    setCollectRef(tenant.last_transaction_id || '');
  };

  const handleSaveRentCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectingTenant) return;

    collectRentPayment(
      collectingTenant.property.id,
      collectingTenant.tenant.id,
      Number(collectAmount),
      true,
      {
        payment_mode: collectMode,
        payment_date: collectDate,
        payment_time: collectTime,
        transaction_id: collectRef,
      }
    );

    setDiversionNotice(`✓ किराया ₹${Number(collectAmount).toLocaleString('en-IN')} सफलतापूर्वक कलेक्ट हुआ (तारीख: ${collectDate}, समय: ${collectTime})!`);
    setTimeout(() => setDiversionNotice(null), 4000);
    setCollectingTenant(null);
  };

  const handleOpenEditAdvance = (tenant: RentalTenant, prop: RentalProperty) => {
    setEditingAdvance({ tenant, property: prop });
    setAdvanceAmount(tenant.security_deposit || 0);
    setAdvanceDate(tenant.advance_payment_date || tenant.joining_date || new Date().toISOString().split('T')[0]);
    setAdvanceMode((tenant.advance_payment_mode as any) || 'upi');
  };

  const handleSaveAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdvance) return;

    updateRentalTenant(editingAdvance.property.id, editingAdvance.tenant.id, {
      security_deposit: Number(advanceAmount),
      advance_payment_date: advanceDate,
      advance_payment_mode: advanceMode,
    });

    setDiversionNotice(`✓ अमानत (Advance) ₹${Number(advanceAmount).toLocaleString('en-IN')} सफलतापूर्वक अपडेट हुई (तारीख: ${advanceDate})!`);
    setTimeout(() => setDiversionNotice(null), 4000);
    setEditingAdvance(null);
  };

  const handleExecuteDiversion = (propertyId: string, ruleId: string) => {
    const res = executeRentDiversion(propertyId, ruleId);
    setDiversionNotice(res.message);
    setTimeout(() => setDiversionNotice(null), 4000);
  };

  if (!mounted) {
    return <div className="p-6 text-center text-xs text-slate-400">लोड हो रहा है...</div>;
  }

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
              संपत्तियों की बाजार कीमत (Valuation), खरीद तारीख, कागजात, मासिक किराया, ड्यू तारीख व पारिवारिक बंटवारा।
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800 text-center">
          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-amber-300 font-medium block">कुल मासिक किराया टारगेट</span>
            <Mono className="text-base font-black text-amber-400">
              ₹{totalMonthlyRent.toLocaleString('en-IN')}/माह
            </Mono>
          </div>

          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-emerald-300 font-medium block">रियल एस्टेट कुल वैल्यूएशन</span>
            <Mono className="text-base font-black text-emerald-400">
              ₹{(totalValuation / 10000000).toFixed(2)} Cr+
            </Mono>
          </div>

          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-blue-300 font-medium block">कुल सुरक्षित अमानत (Advance)</span>
            <Mono className="text-base font-black text-blue-400">
              ₹{totalAdvanceHeld.toLocaleString('en-IN')}
            </Mono>
          </div>
        </div>
      </div>

      {/* Diversion execution toast notice */}
      {diversionNotice && (
        <div className="p-3 bg-emerald-900/90 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in shadow-lg">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
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
                className="p-4 rounded-2xl bg-[#111827] border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3 shadow-lg overflow-hidden"
              >
                <div className="space-y-3">
                  {/* Property Title & Type Header */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl p-2 rounded-xl bg-slate-800 shrink-0">
                        {p.property_type === 'commercial_shop' ? '🏪' : p.property_type === 'warehouse_godown' ? '📦' : p.has_hostel_model ? '🏢' : '🏠'}
                      </span>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-white truncate">{p.title}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
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

                    <div className="text-right space-y-1 shrink-0">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 block">
                        👤 {p.owner_member_name || 'Papa'}
                      </span>
                      {p.registration_deed_no && (
                        <span className="text-[9px] font-mono text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 block truncate max-w-[120px]" title={p.registration_deed_no}>
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

                  {/* Purchase Lagat & Purchase Date with Calendar */}
                  {p.purchase_price ? (
                    <div className="grid grid-cols-2 gap-1.5 text-[10px] p-2 bg-slate-900/40 rounded-xl border border-slate-800/60">
                      <div>
                        <span className="text-slate-400 block text-[9px]">🏷️ खरीद लागत:</span>
                        <span className="font-bold text-slate-200 font-mono">₹{p.purchase_price.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">📅 खरीद तारीख:</span>
                        <span className="font-bold text-amber-300">{p.purchase_date || 'N/A'}</span>
                      </div>
                    </div>
                  ) : null}

                  {/* Dates: Start Date & Rent Due Date */}
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] p-2 bg-slate-900/50 rounded-xl border border-slate-800/60">
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
                    <div className="flex items-center justify-between text-[10px] px-2.5 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                      <span className="text-blue-300 font-bold flex items-center gap-1">
                        <ShieldCheck size={12} className="text-blue-400" /> जमा अमानत (Advance):
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-blue-400">₹{propAdvance.toLocaleString('en-IN')}</span>
                        {firstTenant && (
                          <button
                            onClick={() => handleOpenEditAdvance(firstTenant, p)}
                            className="text-[9px] text-blue-300 underline hover:text-white"
                          >
                            एडिट
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Collection & Diversion Rules (Structured Multi-Line to Prevent Overflow) */}
                  {p.rent_diversions && p.rent_diversions.length > 0 && (
                    <div className="p-2.5 bg-purple-950/30 border border-purple-500/30 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-purple-300 flex items-center gap-1">
                          <RefreshCw size={11} className="text-purple-400" />
                          <span>किराया बंटवारा व खर्च (Allocation):</span>
                        </span>
                        <span className="text-[9px] text-purple-400 font-mono font-bold">
                          ₹{(p.monthly_target_revenue || 0).toLocaleString('en-IN')}/माह
                        </span>
                      </div>
                      <div className="space-y-1">
                        {p.rent_diversions.map(d => {
                          const amt = d.split_type === 'percentage' 
                            ? Math.round(((p.monthly_target_revenue || 0) * d.split_value) / 100)
                            : d.split_value;
                          return (
                            <div key={d.id} className="p-2 bg-purple-900/40 rounded-xl border border-purple-500/20 space-y-1">
                              <div className="flex items-center justify-between gap-1 flex-wrap">
                                <div className="flex items-center gap-1 flex-wrap">
                                  <span className="font-bold text-white text-[11px]">👤 {d.target_member_name}</span>
                                  <span className="px-1.5 py-0.2 bg-purple-500/30 text-purple-200 rounded text-[9px] font-mono font-bold">
                                    {d.split_type === 'percentage' ? `${d.split_value}%` : `₹${d.split_value}`}
                                  </span>
                                </div>
                                <span className="font-mono font-black text-emerald-400 text-xs">
                                  ₹{amt.toLocaleString('en-IN')}
                                </span>
                              </div>
                              <div className="text-[10px] text-purple-200/90 leading-tight">
                                👉 उपयोग: {d.purpose}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer actions */}
                <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                  {firstTenant && (
                    <button
                      onClick={() => handleOpenCollectRent(firstTenant, p)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 shadow ${
                        firstTenant.rent_status === 'paid'
                          ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/40'
                          : 'bg-rose-600 hover:bg-rose-500 text-white font-black'
                      }`}
                    >
                      <CheckCircle2 size={13} />
                      <span>{firstTenant.rent_status === 'paid' ? 'किराया जमा ✅' : 'किराया कलेक्ट करें'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenEditProp(p)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                    title="Edit Valuation & Purchase Date"
                  >
                    <Edit3 size={14} />
                  </button>
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
                            <div className="flex items-center gap-2 flex-wrap">
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
                  <th className="py-2.5 px-3">अमानत जमा तारीख</th>
                  <th className="py-2.5 px-3 text-right">मासिक किराया</th>
                  <th className="py-2.5 px-3">ड्यू तारीख</th>
                  <th className="py-2.5 px-3 text-center">कार्रवाई</th>
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
                      <td className="py-3 px-3">
                        <div className="text-slate-200 font-bold">{t.advance_payment_date || t.joining_date || '01/01/2026'}</div>
                        <div className="text-[10px] text-slate-500 uppercase">{t.advance_payment_mode || 'upi'}</div>
                      </td>
                      <td className="py-3 px-3 text-right font-bold font-mono text-emerald-400">
                        ₹{t.monthly_rent.toLocaleString('en-IN')}/माह
                      </td>
                      <td className="py-3 px-3">
                        हर महीने {t.cycle_start_day || t.rent_due_day || 5} तारीख
                      </td>
                      <td className="py-3 px-3 text-center">
                        {parent && (
                          <button
                            onClick={() => handleOpenEditAdvance(t, parent)}
                            className="px-2.5 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 rounded-lg text-[10px] font-bold transition"
                          >
                            अमानत बदलें
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 🛠️ MODAL 1: EDIT PROPERTY WITH PURCHASE DATE & CALENDAR */}
      {editingProp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-5 md:p-6 w-full max-w-xl space-y-4 shadow-2xl my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Edit3 size={16} className="text-amber-400" />
                  <span>प्रॉपर्टी, खरीद तारीख व वैल्यूएशन एडिट करें</span>
                </h4>
                <p className="text-[11px] text-slate-400">{editingProp.title}</p>
              </div>
              <button onClick={() => setEditingProp(null)} className="p-1 text-slate-400 hover:text-white rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-300">Property Title / Name *</label>
                <input
                  type="text"
                  required
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300">Property Type</label>
                  <select
                    value={propType}
                    onChange={(e) => setPropType(e.target.value)}
                    className="w-full mt-1 p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="commercial_shop">🏪 Commercial Shop</option>
                    <option value="residential_flat">🏠 Residential Flat</option>
                    <option value="warehouse_godown">📦 Warehouse / Godown</option>
                    <option value="independent_house">🏡 Independent House</option>
                    <option value="vacant_plot">📐 Plot / Land</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-purple-300">कागजात किसके नाम (Owner)</label>
                  <select
                    value={propOwnerMemberId}
                    onChange={(e) => setPropOwnerMemberId(e.target.value)}
                    className="w-full mt-1 p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.relationship || m.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-blue-300">Size (क्षेत्रफल)</label>
                  <div className="flex gap-1 mt-1">
                    <input
                      type="number"
                      value={propSize || ''}
                      onChange={(e) => setPropSize(Number(e.target.value))}
                      placeholder="e.g. 450"
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                    />
                    <select
                      value={propSizeUnit}
                      onChange={(e) => setPropSizeUnit(e.target.value)}
                      className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-[10px]"
                    >
                      <option value="sqft">sqft</option>
                      <option value="sqyards">gaj</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-indigo-300">रजिस्ट्री विलेख (Deed No)</label>
                  <input
                    type="text"
                    value={propDeedNo}
                    onChange={(e) => setPropDeedNo(e.target.value)}
                    placeholder="e.g. REG/MAIN/SHOP1"
                    className="w-full mt-1 p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div>
                  <label className="font-bold text-emerald-400">वर्तमान बाजार कीमत (Market Valuation ₹)</label>
                  <input
                    type="number"
                    value={propMarketValue || ''}
                    onChange={(e) => setPropMarketValue(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-slate-950 border border-emerald-500/40 rounded-xl text-emerald-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-amber-300">मासिक किराया टारगेट (₹)</label>
                  <input
                    type="number"
                    value={propMonthlyRent || ''}
                    onChange={(e) => setPropMonthlyRent(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-slate-950 border border-amber-500/40 rounded-xl text-amber-300 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Purchase Lagat & Purchase Date Calendar */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <div>
                  <label className="font-bold text-amber-200">खरीद लागत (Purchase Price ₹)</label>
                  <input
                    type="number"
                    value={propPurchasePrice || ''}
                    onChange={(e) => setPropPurchasePrice(Number(e.target.value))}
                    placeholder="e.g. 1500000"
                    className="w-full mt-1 p-2 bg-slate-950 border border-amber-500/40 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-amber-200 flex items-center gap-1">
                    <Calendar size={13} className="text-amber-400" />
                    <span>खरीद तारीख (Purchase Date Calendar)</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={propPurchaseDate}
                    onChange={(e) => setPropPurchaseDate(e.target.value)}
                    className="w-full mt-1 p-2 bg-slate-950 border border-amber-500/40 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProp(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow"
                >
                  सुरक्षित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 💰 MODAL 2: COLLECT RENT WITH EXACT DATE & TIME CALENDAR */}
      {collectingTenant && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-5 md:p-6 w-full max-w-md space-y-4 shadow-2xl my-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>किराया कलेक्शन रसीद (Collect Rent)</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  {collectingTenant.tenant.name} • {collectingTenant.property.title}
                </p>
              </div>
              <button onClick={() => setCollectingTenant(null)} className="p-1 text-slate-400 hover:text-white rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveRentCollection} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-amber-300">किराया राशि (Rent Amount ₹) *</label>
                <input
                  type="number"
                  required
                  value={collectAmount || ''}
                  onChange={(e) => setCollectAmount(Number(e.target.value))}
                  className="w-full mt-1 p-2.5 bg-slate-900 border border-amber-500/40 rounded-xl text-amber-300 font-black text-base font-mono"
                />
              </div>

              {/* Exact Collection Date & Time */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <div>
                  <label className="font-bold text-slate-300 flex items-center gap-1">
                    <Calendar size={13} className="text-emerald-400" />
                    <span>कलेक्शन तारीख (Date)</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={collectDate}
                    onChange={(e) => setCollectDate(e.target.value)}
                    className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 flex items-center gap-1">
                    <Clock size={13} className="text-cyan-400" />
                    <span>कलेक्शन समय (Time)</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={collectTime}
                    onChange={(e) => setCollectTime(e.target.value)}
                    className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300">भुगतान का माध्यम (Mode)</label>
                  <select
                    value={collectMode}
                    onChange={(e) => setCollectMode(e.target.value as any)}
                    className="w-full mt-1 p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                  >
                    <option value="upi">UPI / GPay / PhonePe</option>
                    <option value="cash">Cash (नकद)</option>
                    <option value="bank_transfer">Net Banking / IMPS</option>
                    <option value="cheque">Cheque (चेक)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300">UPI Ref / Cheque No (Opt)</label>
                  <input
                    type="text"
                    placeholder="उदा. UPI/87965412"
                    value={collectRef}
                    onChange={(e) => setCollectRef(e.target.value)}
                    className="w-full mt-1 p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCollectingTenant(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow"
                >
                  ✓ भुगतान दर्ज करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🛡️ MODAL 3: EDIT ADVANCE SECURITY DEPOSIT WITH CALENDAR */}
      {editingAdvance && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-5 md:p-6 w-full max-w-md space-y-4 shadow-2xl my-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <ShieldCheck size={16} className="text-blue-400" />
                  <span>अमानत (Advance Deposit) दर्ज व अपडेट करें</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  {editingAdvance.tenant.name} • {editingAdvance.property.title}
                </p>
              </div>
              <button onClick={() => setEditingAdvance(null)} className="p-1 text-slate-400 hover:text-white rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAdvance} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-blue-300">जमा अमानत राशि (Advance Deposit ₹) *</label>
                <input
                  type="number"
                  required
                  value={advanceAmount || ''}
                  onChange={(e) => setAdvanceAmount(Number(e.target.value))}
                  className="w-full mt-1 p-2.5 bg-slate-900 border border-blue-500/40 rounded-xl text-blue-300 font-black text-base font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 flex items-center gap-1">
                  <Calendar size={13} className="text-blue-400" />
                  <span>अमानत मिलने की तारीख (Deposit Date Calendar) *</span>
                </label>
                <input
                  type="date"
                  required
                  value={advanceDate}
                  onChange={(e) => setAdvanceDate(e.target.value)}
                  className="w-full mt-1 p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300">भुगतान माध्यम (Deposit Mode)</label>
                <select
                  value={advanceMode}
                  onChange={(e) => setAdvanceMode(e.target.value as any)}
                  className="w-full mt-1 p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                >
                  <option value="upi">UPI / GPay / PhonePe</option>
                  <option value="cash">Cash (नकद)</option>
                  <option value="bank_transfer">Net Banking / IMPS</option>
                  <option value="cheque">Cheque (चेक)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingAdvance(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black shadow"
                >
                  ✓ अमानत अपडेट करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
