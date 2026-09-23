'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Plus, Users, Calendar, Phone, 
  Clock, AlertCircle, FileText, CheckCircle2, X
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

export interface LeadCustomer {
  id: string;
  clientName: string;
  clientPhone: string;
  type: 'INSURANCE' | 'PROPERTY_PLOT';
  dealDetails: string; // e.g. "LIC Kanyadan Policy ₹25k/yr" or "100 Gaj Plot in Borkheda"
  budgetOrPremium: number;
  commissionExpected: number;
  nextFollowupDate: string;
  stage: 'INTERESTED' | 'DOCS_PENDING' | 'CLOSED_WON';
}

const INITIAL_LEADS: LeadCustomer[] = [
  {
    id: 'ld-1',
    clientName: 'राजेश सिंघल',
    clientPhone: '9829044556',
    type: 'INSURANCE',
    dealDetails: 'स्टार हेल्थ फॅमिली फ्लोटर (₹10 लाख कवर)',
    budgetOrPremium: 22000,
    commissionExpected: 3300,
    nextFollowupDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    stage: 'DOCS_PENDING',
  },
  {
    id: 'ld-2',
    clientName: 'दिनेश शर्मा (प्रॉपर्टी बायर)',
    clientPhone: '9414088990',
    type: 'PROPERTY_PLOT',
    dealDetails: 'कुन्हाड़ी रीको एरिया में 200 गज कमर्शियल प्लॉट',
    budgetOrPremium: 3500000,
    commissionExpected: 70000, // 2% Brokerage
    nextFollowupDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    stage: 'INTERESTED',
  }
];

export default function InsurancePropertyCrmModule() {
  const [leads, setLeads] = useState<LeadCustomer[]>(INITIAL_LEADS);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dealType, setDealType] = useState<'INSURANCE' | 'PROPERTY_PLOT'>('INSURANCE');
  const [dealDesc, setDealDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [comm, setComm] = useState('');
  const [followupDate, setFollowupDate] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fwa_crm_leads_v1');
      if (saved) setLeads(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const saveLeads = (lList: LeadCustomer[]) => {
    setLeads(lList);
    try { localStorage.setItem('fwa_crm_leads_v1', JSON.stringify(lList)); } catch (e) {}
  };

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newL: LeadCustomer = {
      id: 'ld-' + Date.now(),
      clientName: name.trim(),
      clientPhone: phone.trim(),
      type: dealType,
      dealDetails: dealDesc.trim() || 'General Enquiry',
      budgetOrPremium: Number(amount) || 0,
      commissionExpected: Number(comm) || 0,
      nextFollowupDate: followupDate || new Date().toISOString().split('T')[0],
      stage: 'INTERESTED',
    };

    saveLeads([newL, ...leads]);
    setShowAddModal(false);
    setName('');
    setPhone('');
    setDealDesc('');
    setAmount('');
    setComm('');
    setFollowupDate('');
  };

  const totalPipelineComm = leads.reduce((s, l) => s + l.commissionExpected, 0);

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-cyan-950 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/25 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm">इंश्योरेंस व प्रॉपर्टी कंसल्टेंट CRM</h3>
                <span className="text-[9px] bg-blue-500/30 text-blue-200 px-1.5 py-0.2 rounded font-mono">
                  {leads.length} क्लाइंट लीड्स
                </span>
              </div>
              <p className="text-[11px] text-blue-200">बीमा एजेंट व प्रॉपर्टी डीलर कस्टमर फॉलोअप व कमीशन</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md cursor-pointer transition-all active:scale-95"
          >
            <Plus size={14} /> + नया क्लाइंट जोड़ें
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-white/15 flex justify-between items-center text-xs">
          <span className="text-cyan-200">अनुमानित ब्रोकरेज / कमीशन पाइपलाइन:</span>
          <Mono className="text-base font-bold text-emerald-300">₹{totalPipelineComm.toLocaleString('en-IN')}</Mono>
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-2.5">
        {leads.map(lead => (
          <div key={lead.id} className="p-3.5 bg-paper rounded-xl border border-paper-dim shadow-xs flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-ink">{lead.clientName}</h4>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                  lead.type === 'INSURANCE' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {lead.type === 'INSURANCE' ? '🛡️ बीमा पॉलिसी' : '🏡 जमीन/प्लॉट'}
                </span>
              </div>
              <p className="text-[11px] text-ink-muted">📞 {lead.clientPhone} • {lead.dealDetails}</p>
              <div className="text-[10px] text-rose-700 font-bold flex items-center gap-1">
                <Clock size={11} /> अगला फॉलोअप: {lead.nextFollowupDate}
              </div>
            </div>

            <div className="text-right space-y-0.5">
              <span className="text-[10px] text-ink-muted block">कमीशन कमाई</span>
              <Mono className="font-bold text-emerald-700 text-sm block">
                +₹{lead.commissionExpected.toLocaleString('en-IN')}
              </Mono>
            </div>
          </div>
        ))}
      </div>

      {/* ➕ MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper rounded-2xl max-w-sm w-full p-5 space-y-3.5 border border-paper-dim shadow-2xl">
            <div className="flex justify-between items-center border-b border-paper-dim pb-2">
              <h4 className="font-bold text-sm text-ink">नया कस्टमर / लीड प्रविष्टि</h4>
              <button onClick={() => setShowAddModal(false)} className="text-ink-muted hover:text-ink"><X size={16} /></button>
            </div>

            <form onSubmit={handleSaveLead} className="space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDealType('INSURANCE')}
                  className={`py-1.5 rounded-lg font-bold border ${dealType === 'INSURANCE' ? 'bg-navy text-gold' : 'bg-paper'}`}
                >
                  बीमा (Insurance)
                </button>
                <button
                  type="button"
                  onClick={() => setDealType('PROPERTY_PLOT')}
                  className={`py-1.5 rounded-lg font-bold border ${dealType === 'PROPERTY_PLOT' ? 'bg-navy text-gold' : 'bg-paper'}`}
                >
                  प्रॉपर्टी (Plot/Flat)
                </button>
              </div>

              <input
                type="text"
                required
                placeholder="क्लाइंट का नाम *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-bold"
              />
              <input
                type="tel"
                placeholder="मोबाइल नंबर"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl"
              />
              <input
                type="text"
                placeholder="डील विवरण (उदा. LIC जीवन लाभ 20 लाख)"
                value={dealDesc}
                onChange={(e) => setDealDesc(e.target.value)}
                className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="डील अमाउंट ₹"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-paper-dim/40 border border-paper-dim rounded-xl font-medium"
                />
                <input
                  type="number"
                  placeholder="कमीशन आय ₹"
                  value={comm}
                  onChange={(e) => setComm(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-paper-dim/40 border border-paper-dim rounded-xl font-bold text-emerald-800"
                />
              </div>

              <div>
                <label className="block text-[10px] text-ink-muted font-bold mb-0.5">कॉल/फॉलोअप तारीख</label>
                <input
                  type="date"
                  value={followupDate}
                  onChange={(e) => setFollowupDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-paper-dim/40 border border-paper-dim rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 rounded-xl border border-paper-dim font-bold text-ink-muted">रद्द</button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold">क्लाइंट सेव करें</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
