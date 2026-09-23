'use client';

import React, { useState, useEffect } from 'react';
import { Scale, Plus, Calendar, UserCheck, Trash2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

interface HearingRecord {
  id: string;
  date: string;
  purpose: string;
  peshiFeePaid: number;
  outcomeNotes: string;
}

interface CourtCase {
  id: string;
  title: string;
  caseNumber: string;
  courtName: string; // e.g. District Court, High Court, Tehsil
  advocateName: string;
  advocatePhone: string;
  totalAgreedFee: number;
  feePaidSoFar: number;
  nextHearingDate: string;
  status: 'running' | 'stay_granted' | 'disposed' | 'compromise';
  hearings: HearingRecord[];
}

const DEFAULT_CASES: CourtCase[] = [
  {
    id: 'case-1',
    title: 'तहसीलदार ज़मीन सीमांकन व मेढ़ विवाद',
    caseNumber: 'TS-2024/842',
    courtName: 'एसडीएम कोर्ट, सदर',
    advocateName: 'एडवोकेट के. के. त्रिवेदी',
    advocatePhone: '9826011223',
    totalAgreedFee: 65000,
    feePaidSoFar: 35000,
    nextHearingDate: '2026-10-14',
    status: 'running',
    hearings: [
      { id: 'h1', date: '2026-08-10', purpose: 'पटवारी रिपोर्ट तलब', peshiFeePaid: 2000, outcomeNotes: 'पटवारी को मौका मुआयना का आदेश दिया' },
      { id: 'h2', date: '2026-09-02', purpose: 'विपक्षी हाजिरी व बहस', peshiFeePaid: 2000, outcomeNotes: 'विपक्षी ने जवाब दावा दाखिल करने हेतु समय मांगा' }
    ]
  }
];

export function CourtCasesModule() {
  const [cases, setCases] = useState<CourtCase[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_court_cases_v1');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { }
      }
    }
    return DEFAULT_CASES;
  });

  const [isAddCaseOpen, setIsAddCaseOpen] = useState(false);
  const [isAddHearingOpen, setIsAddHearingOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || '');

  // Form State
  const [title, setTitle] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [courtName, setCourtName] = useState('');
  const [advocateName, setAdvocateName] = useState('');
  const [advocatePhone, setAdvocatePhone] = useState('');
  const [totalAgreedFee, setTotalAgreedFee] = useState<number | ''>('');
  const [advancePaid, setAdvancePaid] = useState<number | ''>('');
  const [nextDate, setNextDate] = useState('');

  // Hearing Form
  const [hearingDate, setHearingDate] = useState(new Date().toISOString().split('T')[0]);
  const [purpose, setPurpose] = useState('');
  const [peshiFee, setPeshiFee] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    localStorage.setItem('fwa_court_cases_v1', JSON.stringify(cases));
  }, [cases]);

  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  const handleAddCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !caseNumber || !advocateName) return;

    const newCase: CourtCase = {
      id: `case-${Date.now()}`,
      title,
      caseNumber,
      courtName: courtName || 'तहसील/जिला न्यायालय',
      advocateName,
      advocatePhone,
      totalAgreedFee: Number(totalAgreedFee) || 50000,
      feePaidSoFar: Number(advancePaid) || 0,
      nextHearingDate: nextDate || '2026-10-30',
      status: 'running',
      hearings: []
    };

    setCases([...cases, newCase]);
    setSelectedCaseId(newCase.id);
    setIsAddCaseOpen(false);
    setTitle('');
    setCaseNumber('');
    setCourtName('');
    setAdvocateName('');
  };

  const handleAddHearing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase || !purpose) return;

    const fee = Number(peshiFee) || 0;
    const newHearing: HearingRecord = {
      id: `h-${Date.now()}`,
      date: hearingDate,
      purpose,
      peshiFeePaid: fee,
      outcomeNotes: notes
    };

    const updated: CourtCase = {
      ...activeCase,
      feePaidSoFar: activeCase.feePaidSoFar + fee,
      nextHearingDate: hearingDate,
      hearings: [newHearing, ...activeCase.hearings]
    };

    setCases(cases.map(c => c.id === activeCase.id ? updated : c));
    setIsAddHearingOpen(false);
    setPurpose('');
    setPeshiFee('');
    setNotes('');
  };

  const handleDeleteCase = (id: string) => {
    if (confirm('क्या आप इस केस रिकॉर्ड को हटाना चाहते हैं?')) {
      setCases(cases.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-navy text-paper p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-coral/20 text-coral-light rounded-xl">
              <Scale size={20} />
            </span>
            <div>
              <h2 className="text-base font-bold font-serif">Court Case & Legal Tracker</h2>
              <p className="text-[11px] text-paper-dim/80">ज़मीन विवाद, कोर्ट पेशी तारीख, वकील फीस व सुनवाई डायरी</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddCaseOpen(true)}
            className="px-3 py-1.5 bg-gold text-navy text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-gold-light active:scale-95 transition-all shadow-sm"
          >
            <Plus size={15} /> नया केस
          </button>
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-3">
        {cases.map(cs => {
          const lawyerBalance = Math.max(0, cs.totalAgreedFee - cs.feePaidSoFar);

          return (
            <div key={cs.id} className="bg-paper border border-paper-dim rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-coral/15 text-coral text-[10px] font-bold rounded-md uppercase">
                      केस नं: {cs.caseNumber}
                    </span>
                    <span className="text-[11px] text-ink-muted">{cs.courtName}</span>
                  </div>
                  <h3 className="text-sm font-bold text-ink mt-1">{cs.title}</h3>
                  <p className="text-xs text-ink-muted">वकील: <strong>{cs.advocateName}</strong> ({cs.advocatePhone})</p>
                </div>

                <div className="text-right bg-gold/10 border border-gold/30 px-3 py-1.5 rounded-xl">
                  <p className="text-[10px] text-gold-dark font-bold">अगली पेशी तारीख</p>
                  <Mono className="text-xs font-bold text-ink">{cs.nextHearingDate}</Mono>
                </div>
              </div>

              {/* Lawyer Fee Ledger */}
              <div className="grid grid-cols-3 gap-2 bg-paper-dim/40 p-2.5 rounded-xl text-center text-xs">
                <div>
                  <p className="text-[10px] text-ink-muted">तयशुदा कुल फीस</p>
                  <Mono className="font-bold text-ink">₹{cs.totalAgreedFee.toLocaleString('en-IN')}</Mono>
                </div>
                <div>
                  <p className="text-[10px] text-ink-muted">अब तक भुगतान</p>
                  <Mono className="font-bold text-green">₹{cs.feePaidSoFar.toLocaleString('en-IN')}</Mono>
                </div>
                <div>
                  <p className="text-[10px] text-ink-muted">वकील का बकाया</p>
                  <Mono className="font-bold text-coral">₹{lawyerBalance.toLocaleString('en-IN')}</Mono>
                </div>
              </div>

              {/* Hearing History */}
              {cs.hearings.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <p className="text-[10px] font-bold text-ink-muted uppercase">पिछली पेशियों का विवरण:</p>
                  {cs.hearings.map(h => (
                    <div key={h.id} className="p-2 rounded-xl bg-paper border border-paper-dim text-xs space-y-0.5">
                      <div className="flex justify-between">
                        <span className="font-bold text-ink">{h.date} • {h.purpose}</span>
                        {h.peshiFeePaid > 0 && (
                          <Mono className="text-coral font-semibold">पेशी फीस: ₹{h.peshiFeePaid.toLocaleString('en-IN')}</Mono>
                        )}
                      </div>
                      {h.outcomeNotes && <p className="text-[11px] text-ink-muted">{h.outcomeNotes}</p>}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-paper-dim text-xs">
                <button
                  onClick={() => {
                    setSelectedCaseId(cs.id);
                    setIsAddHearingOpen(true);
                  }}
                  className="px-3 py-1 bg-gold text-navy font-bold rounded-lg hover:bg-gold-light"
                >
                  + पेशी व फीस दर्ज करें
                </button>
                <button
                  onClick={() => handleDeleteCase(cs.id)}
                  className="text-coral hover:text-coral-dark p-1"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Case Modal */}
      {isAddCaseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-ink">नया कोर्ट केस जोड़ें</h3>
            <form onSubmit={handleAddCase} className="space-y-3 text-xs">
              <div>
                <label className="block text-ink-muted mb-1">केस का शीर्षक / विषय</label>
                <input
                  type="text"
                  placeholder="उदा. ज़मीन कब्जा / बंटवारा वाद"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">मुकदमा / केस नंबर</label>
                  <input
                    type="text"
                    placeholder="2026/894"
                    value={caseNumber}
                    onChange={e => setCaseNumber(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">कोर्ट का नाम</label>
                  <input
                    type="text"
                    placeholder="जिला न्यायालय / तहसील"
                    value={courtName}
                    onChange={e => setCourtName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">वकील का नाम</label>
                  <input
                    type="text"
                    placeholder="एडवोकेट शर्मा जी"
                    value={advocateName}
                    onChange={e => setAdvocateName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">वकील फ़ोन नंबर</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={advocatePhone}
                    onChange={e => setAdvocatePhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">तयशुदा कुल वकील फीस (₹)</label>
                  <input
                    type="number"
                    placeholder="50000"
                    value={totalAgreedFee}
                    onChange={e => setTotalAgreedFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">शुरुआती एडवांस दिया (₹)</label>
                  <input
                    type="number"
                    placeholder="15000"
                    value={advancePaid}
                    onChange={e => setAdvancePaid(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink-muted mb-1">अगली पेशी तारीख</label>
                <input
                  type="date"
                  value={nextDate}
                  onChange={e => setNextDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCaseOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gold text-navy font-bold hover:bg-gold-light"
                >
                  सेव करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Hearing Modal */}
      {isAddHearingOpen && activeCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <h3 className="text-sm font-bold text-ink">पेशी व फीस दर्ज करें</h3>
            <p className="text-xs text-ink-muted">{activeCase.title}</p>
            <form onSubmit={handleAddHearing} className="space-y-3 text-xs">
              <div>
                <label className="block text-ink-muted mb-1">पेशी तारीख</label>
                <input
                  type="date"
                  value={hearingDate}
                  onChange={e => setHearingDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                />
              </div>
              <div>
                <label className="block text-ink-muted mb-1">पेशी का उद्देश्य / बहस</label>
                <input
                  type="text"
                  placeholder="उदा. गवाह बयान / ऑर्डर"
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                />
              </div>
              <div>
                <label className="block text-ink-muted mb-1">पेशी फीस भुगतान (₹ यदि दिया)</label>
                <input
                  type="number"
                  placeholder="2000"
                  value={peshiFee}
                  onChange={e => setPeshiFee(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                />
              </div>
              <div>
                <label className="block text-ink-muted mb-1">कोर्ट में क्या हुआ (Notes)</label>
                <input
                  type="text"
                  placeholder="उदा. अगली तारीख पर स्टे का फैसला होगा"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddHearingOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gold text-navy font-bold"
                >
                  दर्ज करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
