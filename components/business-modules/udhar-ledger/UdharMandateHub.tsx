'use client';

import React, { useState, useMemo } from 'react';
import { 
  CreditCard, ShieldCheck, AlertTriangle, CheckCircle2, Clock, 
  ArrowLeft, Search, Filter, Check, X, ExternalLink, RefreshCw, 
  FileText, Scale, Landmark, Sparkles, PhoneCall, Share2, 
  Users, HandCoins, Building2, ChevronRight, Ban, CheckCheck
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';
import { UdharContact } from './UdharLedgerModule';
import { UdharMandate, UdharMandateModule } from './UdharMandateModule';

interface UdharMandateHubProps {
  contacts: UdharContact[];
  mandates: Record<string, UdharMandate>;
  selectedContactId: string | null;
  onSelectContact: (contactId: string | null) => void;
  onUpdateMandate: (contactId: string, updated: UdharMandate) => void;
  onMandateCollect: (contactId: string, amount: number, note: string) => void;
  onBackToLedger?: () => void;
}

export function UdharMandateHub({
  contacts,
  mandates,
  selectedContactId,
  onSelectContact,
  onUpdateMandate,
  onMandateCollect,
  onBackToLedger
}: UdharMandateHubProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'bounced' | 'cancelled' | 'eligible'>('all');

  // Filter only receivable (given) udhar or those with existing mandates
  const eligibleReceivables = useMemo(() => {
    return contacts.filter(c => c.type === 'given' || mandates[c.id]);
  }, [contacts, mandates]);

  // Aggregate KPI metrics across all mandates
  const metrics = useMemo(() => {
    let totalCreated = 0;
    let activeCount = 0;
    let activeRecoverableAmount = 0;
    let pendingCount = 0;
    let bouncedCount = 0;
    let cancelledCount = 0;
    let executedCount = 0;
    let totalExecutedAmount = 0;
    const cancelReasonsCount: Record<string, number> = {};

    Object.entries(mandates).forEach(([contactId, m]) => {
      totalCreated++;
      const contact = contacts.find(c => c.id === contactId);
      const balance = contact ? (contact.remaining_balance || 0) : m.max_amount;

      if (m.status === 'active') {
        activeCount++;
        activeRecoverableAmount += Math.min(m.max_amount, balance);
      } else if (m.status === 'pending') {
        pendingCount++;
      } else if (m.status === 'bounced') {
        bouncedCount++;
      } else if (m.status === 'cancelled') {
        cancelledCount++;
        const reasonKey = m.cancellation_reason?.split('(')[0]?.trim() || 'अन्य';
        cancelReasonsCount[reasonKey] = (cancelReasonsCount[reasonKey] || 0) + 1;
      } else if (m.status === 'executed') {
        executedCount++;
        totalExecutedAmount += m.max_amount;
      }
    });

    const readyToCreateCount = eligibleReceivables.filter(
      c => !mandates[c.id] && c.status === 'active' && (c.remaining_balance || c.original_amount) <= 15000
    ).length;

    return {
      totalCreated,
      activeCount,
      activeRecoverableAmount,
      pendingCount,
      bouncedCount,
      cancelledCount,
      executedCount,
      totalExecutedAmount,
      cancelReasonsCount,
      readyToCreateCount
    };
  }, [mandates, contacts, eligibleReceivables]);

  // Filtered customer list according to search & filter tab
  const filteredList = useMemo(() => {
    return eligibleReceivables.filter(c => {
      const m = mandates[c.id];
      const nameMatch = c.person_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (c.phone && c.phone.includes(searchTerm));
      if (!nameMatch) return false;

      if (statusFilter === 'all') return true;
      if (statusFilter === 'active') return m?.status === 'active';
      if (statusFilter === 'pending') return m?.status === 'pending';
      if (statusFilter === 'bounced') return m?.status === 'bounced';
      if (statusFilter === 'cancelled') return m?.status === 'cancelled';
      if (statusFilter === 'eligible') {
        return !m && c.status === 'active' && (c.remaining_balance || c.original_amount) <= 15000;
      }
      return true;
    });
  }, [eligibleReceivables, mandates, searchTerm, statusFilter]);

  const activeContact = contacts.find(c => c.id === selectedContactId);
  const activeMandate = selectedContactId ? mandates[selectedContactId] : null;

  return (
    <div className="space-y-4">
      {/* Top Banner & Header */}
      <div className="p-4 bg-gradient-to-r from-navy via-navy-light to-navy text-paper rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-gold/20 text-gold border border-gold/30">
                <CreditCard size={20} />
              </span>
              <div>
                <h2 className="text-base font-bold font-serif flex items-center gap-2">
                  💳 UPI Autopay & ई-मैंडेट रिकवरी केंद्र (Recovery Hub)
                </h2>
                <p className="text-xs text-paper-dim">
                  RBI व NPCI अनुमोदित AFA-Free ₹15,000 ऑटो-डेबिट रिकवरी डैशबोर्ड
                </p>
              </div>
            </div>
          </div>

          {onBackToLedger && (
            <button
              type="button"
              onClick={onBackToLedger}
              className="px-3 py-1.5 bg-paper/10 hover:bg-paper/20 text-paper font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border border-paper/20"
            >
              <ArrowLeft size={14} /> उधारी बहीखाता (Khata) पर लौटें
            </button>
          )}
        </div>

        {/* Legal Regulatory Compliance Strip */}
        <div className="p-2.5 rounded-xl bg-navy-dark/60 border border-paper/10 flex items-center justify-between gap-3 text-[11px] text-paper-dim flex-wrap">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-gold shrink-0" />
            <span>
              <strong>प्रॉमिसरी OTP लिंक्ड:</strong> केवल वैध व्यापारिक उधारी व OTP सत्यापित खातों पर ही मैंडेट जनरेट होता है।
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
              ₹15,000 NPCI कैप
            </span>
            <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-bold text-[10px]">
              ₹5.90 फिक्स शुल्क (99.6% बचत)
            </span>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Active Mandates */}
        <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-900">सक्रिय मैंडेट (Active)</span>
            <CheckCircle2 size={15} className="text-emerald-700" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-emerald-900">{metrics.activeCount}</span>
            <span className="text-[11px] text-emerald-700 font-medium">खाते</span>
          </div>
          <p className="text-[10px] text-emerald-800 font-semibold truncate">
            सुरक्षित राशि: <Mono className="font-bold">₹{metrics.activeRecoverableAmount.toLocaleString('en-IN')}</Mono>
          </p>
        </div>

        {/* Pending Mandates */}
        <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-900">पेंडिंग ऑथराइजेशन</span>
            <Clock size={15} className="text-amber-700 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-amber-900">{metrics.pendingCount}</span>
            <span className="text-[11px] text-amber-700 font-medium">ग्राहक</span>
          </div>
          <p className="text-[10px] text-amber-800 truncate">
            UPI ऐप पर लिंक स्वीकृति प्रतीक्षित
          </p>
        </div>

        {/* Bounced / Follow-up */}
        <div className="p-3 bg-red-50/80 rounded-2xl border border-red-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-red-900">बाउंस / समस्या</span>
            <AlertTriangle size={15} className="text-red-700" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-red-900">{metrics.bouncedCount}</span>
            <span className="text-[11px] text-red-700 font-medium">अकाउंट</span>
          </div>
          <p className="text-[10px] text-red-800 truncate">
            24h रीट्राई या मैन्युअल तकादा
          </p>
        </div>

        {/* Cancelled Mandates */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-800">रद्द किए गए (Cancelled)</span>
            <Ban size={15} className="text-slate-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-slate-900">{metrics.cancelledCount}</span>
            <span className="text-[11px] text-slate-600 font-medium">मैंडेट</span>
          </div>
          <p className="text-[10px] text-slate-600 truncate">
            NEFT/चेक या स्वतः भुगतान से बंद
          </p>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Customer Selector & Filtered List */}
        <div className={`${selectedContactId ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-3`}>
          <div className="p-3.5 bg-paper rounded-2xl border border-paper-dim shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Users size={16} className="text-navy" />
                <h3 className="text-xs font-bold text-ink uppercase tracking-wide">
                  प्रॉमिसरी OTP सत्यापित ग्राहक सूची
                </h3>
              </div>
              <span className="text-[11px] font-bold text-ink-muted bg-paper-dim px-2 py-0.5 rounded-full">
                {filteredList.length} उपलब्ध
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ग्राहक का नाम या मोबाइल नंबर खोजें..."
                className="w-full pl-9 pr-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl text-xs text-ink focus:outline-hidden focus:ring-1 focus:ring-navy"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-1 overflow-x-auto no-scrollbar pb-0.5 text-[11px]">
              {[
                { key: 'all', label: 'सभी' },
                { key: 'active', label: `सक्रिय (${metrics.activeCount})` },
                { key: 'pending', label: `पेंडिंग (${metrics.pendingCount})` },
                { key: 'bounced', label: `बाउंस (${metrics.bouncedCount})` },
                { key: 'cancelled', label: `रद्द (${metrics.cancelledCount})` },
                { key: 'eligible', label: `पात्र (${metrics.readyToCreateCount})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusFilter(tab.key as any)}
                  className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    statusFilter === tab.key
                      ? 'bg-navy text-paper shadow-xs'
                      : 'bg-paper-dim/50 text-ink-muted hover:text-ink border border-paper-dim'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Customer List Cards */}
            <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
              {filteredList.length === 0 ? (
                <div className="p-6 text-center text-xs text-ink-muted space-y-1">
                  <HandCoins size={28} className="mx-auto text-ink-muted opacity-40 mb-1" />
                  <p className="font-bold">कोई ग्राहक रिकॉर्ड नहीं मिला</p>
                  <p className="text-[11px]">फ़िल्टर बदलें या नया उधारी खाता जोड़ें।</p>
                </div>
              ) : (
                filteredList.map((c) => {
                  const m = mandates[c.id];
                  const isSelected = selectedContactId === c.id;
                  const isEligible = !m && c.status === 'active' && (c.remaining_balance || c.original_amount) <= 15000;

                  return (
                    <div
                      key={c.id}
                      onClick={() => onSelectContact(isSelected ? null : c.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer text-xs space-y-2 ${
                        isSelected
                          ? 'bg-navy/5 border-navy shadow-sm ring-1 ring-navy'
                          : 'bg-paper hover:bg-paper-dim/30 border-paper-dim'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold text-ink text-xs">{c.person_name}</h4>
                            {c.is_otp_verified ? (
                              <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.2 rounded border border-green-200 font-semibold flex items-center gap-0.5">
                                <ShieldCheck size={10} /> OTP Verified
                              </span>
                            ) : (
                              <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.2 rounded border border-amber-200">
                                OTP पेंडिंग
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-ink-muted mt-0.5">
                            {c.phone ? `📞 ${c.phone}` : 'मोबाइल नंबर नहीं है'}
                            {c.due_date && ` • वापसी: ${c.due_date}`}
                          </p>
                        </div>

                        {/* Balance display */}
                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-ink-muted block uppercase">बाकी उधारी</span>
                          <Mono className="font-bold text-coral text-xs">
                            ₹{(c.remaining_balance || 0).toLocaleString('en-IN')}
                          </Mono>
                        </div>
                      </div>

                      {/* Mandate Status Ribbon */}
                      <div className="flex items-center justify-between pt-1 border-t border-paper-dim/60">
                        {m?.status === 'active' ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                            <CheckCircle2 size={11} className="text-emerald-700" /> सक्रिय मैंडेट: ₹{m.max_amount.toLocaleString('en-IN')}
                          </span>
                        ) : m?.status === 'pending' ? (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1 animate-pulse">
                            <Clock size={11} className="text-amber-700" /> ऑथराइजेशन पेंडिंग
                          </span>
                        ) : m?.status === 'bounced' ? (
                          <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full border border-red-300 flex items-center gap-1">
                            <AlertTriangle size={11} className="text-red-700" /> {m.is_exhausted ? 'विफल (मैन्युअल तकादा)' : `बाउंस (प्रयास ${m.retry_count || 1}/2)`}
                          </span>
                        ) : m?.status === 'executed' ? (
                          <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full border border-green-300 flex items-center gap-1">
                            <CheckCheck size={11} className="text-green-700" /> पूर्ण चुकता (Executed)
                          </span>
                        ) : m?.status === 'cancelled' ? (
                          <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full border border-slate-300">
                            रद्द (Cancelled)
                          </span>
                        ) : isEligible ? (
                          <span className="text-[10px] bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                            <Sparkles size={11} className="text-blue-600" /> नया मैंडेट सेट करें ⚡
                          </span>
                        ) : (
                          <span className="text-[10px] text-ink-muted italic">
                            {(c.remaining_balance || 0) > 15000 ? '₹15,000 कैप से अधिक' : 'सेट नहीं है'}
                          </span>
                        )}

                        <span className="text-navy font-bold text-[11px] flex items-center gap-0.5">
                          {isSelected ? 'सक्रिय ▲' : 'विवरण खोलें ➔'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Full Mandate Detail & Action Workspace */}
        {selectedContactId && activeContact ? (
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between p-2.5 bg-paper rounded-xl border border-paper-dim">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-navy text-paper flex items-center justify-center font-bold text-xs">
                  💳
                </span>
                <div>
                  <h3 className="text-xs font-bold text-ink">
                    {activeContact.person_name} — मैंडेट प्रबंधन
                  </h3>
                  <p className="text-[10px] text-ink-muted">
                    बाकी उधारी: ₹{(activeContact.remaining_balance || 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectContact(null)}
                className="px-2.5 py-1 text-xs bg-paper-dim hover:bg-paper-dim/80 text-ink rounded-lg font-medium cursor-pointer"
              >
                बंद करें ✕
              </button>
            </div>

            {/* Mount Full UdharMandateModule */}
            <UdharMandateModule
              contact={activeContact}
              mandate={activeMandate}
              onClose={() => onSelectContact(null)}
              onUpdateMandate={onUpdateMandate}
              onMandateCollect={onMandateCollect}
            />
          </div>
        ) : (
          /* Empty Workspace Prompt when no customer selected on wide screens */
          <div className="hidden lg:flex lg:col-span-7 flex-col items-center justify-center p-12 bg-paper rounded-2xl border border-paper-dim text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-navy/5 text-navy flex items-center justify-center">
              <CreditCard size={28} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">किसी ग्राहक का चयन करें</h3>
              <p className="text-xs text-ink-muted max-w-sm mt-1">
                बाईं ओर की प्रॉमिसरी OTP सत्यापित सूची में से किसी भी ग्राहक पर क्लिक करके उनका UPI Autopay रिकवरी मैंडेट सेट करें, ऑटो-डेबिट ट्रिगर करें या स्टेटस देखें।
              </p>
            </div>
            <div className="p-3 bg-paper-dim/50 rounded-xl border border-paper-dim text-[11px] text-ink-muted max-w-sm text-left space-y-1">
              <span className="font-bold text-ink block">💡 मुख्य विशेषताएं:</span>
              <p>• ₹15,000 NPCI नियामक सीमा के तहत बिना OTP बैंक से सीधी वसूली।</p>
              <p>• बैंक बाउंस होने पर 24 घंटे में ऑटो-रीट्राई व WhatsApp लीगल नोटिस।</p>
              <p>• मैन्युअल NEFT/चेक मिलने पर दोहरा भुगतान रोकने हेतु स्वतः रद्दीकरण।</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
