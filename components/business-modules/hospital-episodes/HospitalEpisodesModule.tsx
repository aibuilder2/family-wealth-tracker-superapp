'use client';

import React, { useState, useEffect } from 'react';
import { HeartPulse, Plus, Hospital, Stethoscope, ShieldCheck, Trash2, Calendar, FileText, Pill, DollarSign } from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

interface HospitalBill {
  id: string;
  title: string;
  category: 'doctor_consultation' | 'surgery_operation' | 'pharmacy_medicine' | 'lab_tests' | 'room_icu';
  amount: number;
  date: string;
  isInsuranceClaimable: boolean;
}

interface HospitalEpisode {
  id: string;
  title: string;
  patientName: string; // e.g. Mummy, Papa, Sunita
  episodeType: 'surgery' | 'pregnancy' | 'hospitalization' | 'chronic_care';
  hospitalName: string;
  doctorName: string;
  startDate: string;
  status: 'ongoing' | 'discharged' | 'recovered';
  hasInsurance: boolean;
  insuranceClaimedAmount: number;
  bills: HospitalBill[];
}

const DEFAULT_EPISODES: HospitalEpisode[] = [];

export function HospitalEpisodesModule() {
  const [episodes, setEpisodes] = useState<HospitalEpisode[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_hospital_episodes_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter((e: any) => e?.id !== 'ep-1');
          }
        } catch (e) {}
      }
    }
    return DEFAULT_EPISODES;
  });

  const [selectedEpId, setSelectedEpId] = useState<string>(episodes[0]?.id || '');
  const [isAddEpOpen, setIsAddEpOpen] = useState(false);
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);

  // Form State: New Episode
  const [epTitle, setEpTitle] = useState('');
  const [patientName, setPatientName] = useState('मम्मी');
  const [episodeType, setEpisodeType] = useState<HospitalEpisode['episodeType']>('surgery');
  const [hospitalName, setHospitalName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [hasInsurance, setHasInsurance] = useState(true);

  // Form State: Bill
  const [billTitle, setBillTitle] = useState('');
  const [billCategory, setBillCategory] = useState<HospitalBill['category']>('pharmacy_medicine');
  const [billAmount, setBillAmount] = useState<number | ''>('');
  const [isClaimable, setIsClaimable] = useState(true);

  useEffect(() => {
    localStorage.setItem('fwa_hospital_episodes_v1', JSON.stringify(episodes));
  }, [episodes]);

  const activeEp = episodes.find(e => e.id === selectedEpId) || episodes[0];

  const handleAddEpisode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!epTitle || !hospitalName) return;

    const newEp: HospitalEpisode = {
      id: `ep-${Date.now()}`,
      title: epTitle,
      patientName,
      episodeType,
      hospitalName,
      doctorName: doctorName || 'वरिष्ठ चिकित्सक',
      startDate: new Date().toISOString().split('T')[0],
      status: 'ongoing',
      hasInsurance,
      insuranceClaimedAmount: 0,
      bills: []
    };

    setEpisodes([newEp, ...episodes]);
    setSelectedEpId(newEp.id);
    setIsAddEpOpen(false);
    setEpTitle('');
    setHospitalName('');
    setDoctorName('');
  };

  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEp || !billTitle || !billAmount) return;

    const newBill: HospitalBill = {
      id: `b-${Date.now()}`,
      title: billTitle,
      category: billCategory,
      amount: Number(billAmount),
      date: new Date().toISOString().split('T')[0],
      isInsuranceClaimable: isClaimable
    };

    const updated = {
      ...activeEp,
      bills: [newBill, ...activeEp.bills]
    };

    setEpisodes(episodes.map(ep => ep.id === activeEp.id ? updated : ep));
    setIsAddBillOpen(false);
    setBillTitle('');
    setBillAmount('');
  };

  const totalHospitalBills = activeEp?.bills.reduce((sum, b) => sum + b.amount, 0) || 0;
  const netFamilyKharcha = Math.max(0, totalHospitalBills - (activeEp?.insuranceClaimedAmount || 0));

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-navy text-paper p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-coral/20 text-coral-light rounded-xl">
              <HeartPulse size={20} />
            </span>
            <div>
              <h2 className="text-base font-bold font-serif">Hospital & Medical Episodes</h2>
              <p className="text-[11px] text-paper-dim/80">सर्जरी, डिलीवरी, अस्पताल भर्ती बिल व इंश्योरेंस क्लेम हिसाब</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddEpOpen(true)}
            className="px-3 py-1.5 bg-gold text-navy text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-gold-light active:scale-95 transition-all shadow-sm"
          >
            <Plus size={15} /> नया एपिसोड
          </button>
        </div>

        {/* Episode Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs pt-1 border-t border-navy-light/40">
          {episodes.map(ep => (
            <button
              key={ep.id}
              onClick={() => setSelectedEpId(ep.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedEpId === ep.id ? 'bg-gold text-navy shadow-sm' : 'bg-navy-light/50 text-paper-dim hover:bg-navy-light'
              }`}
            >
              🏥 {ep.patientName}: {ep.title}
            </button>
          ))}
        </div>

        {/* Active Episode Metrics */}
        {activeEp && (
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-navy-light/40 text-center">
            <div className="bg-navy-light/40 p-2 rounded-xl">
              <p className="text-[10px] text-paper-dim/70">कुल अस्पताल बिल</p>
              <Mono className="text-sm font-bold text-coral-light">₹{totalHospitalBills.toLocaleString('en-IN')}</Mono>
            </div>
            <div className="bg-navy-light/40 p-2 rounded-xl">
              <p className="text-[10px] text-paper-dim/70">बीमा क्लेम मिला</p>
              <Mono className="text-sm font-bold text-green">₹{activeEp.insuranceClaimedAmount.toLocaleString('en-IN')}</Mono>
            </div>
            <div className="bg-navy-light/40 p-2 rounded-xl">
              <p className="text-[10px] text-paper-dim/70">जेब से लगा शुद्ध ख़र्च</p>
              <Mono className="text-sm font-bold text-gold">₹{netFamilyKharcha.toLocaleString('en-IN')}</Mono>
            </div>
          </div>
        )}
      </div>

      {episodes.length === 0 && (
        <div className="bg-paper border border-paper-dim rounded-2xl p-8 text-center shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-paper-dim/50 flex items-center justify-center mx-auto text-ink-muted">
            <HeartPulse size={24} />
          </div>
          <h3 className="text-sm font-bold text-ink">कोई मेडिकल एपिसोड दर्ज नहीं है</h3>
          <p className="text-xs text-ink-muted max-w-xs mx-auto">
            परिवार के किसी सदस्य की सर्जरी, डिलीवरी या अस्पताल भर्ती व मेडिकल बिल ट्रैक करने के लिए एपिसोड जोड़ें।
          </p>
          <button
            onClick={() => setIsAddEpOpen(true)}
            className="mt-2 px-4 py-2 bg-gold text-navy text-xs font-bold rounded-xl inline-flex items-center gap-1 hover:bg-gold-light"
          >
            <Plus size={15} /> नया एपिसोड जोड़ें
          </button>
        </div>
      )}

      {activeEp && (
        <div className="space-y-3">
          {/* Active Episode Hospital Header */}
          <div className="bg-paper border border-paper-dim rounded-2xl p-4 shadow-sm space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2 py-0.5 bg-paper-dim text-ink text-[10px] font-bold rounded uppercase">
                  मरीज़: <strong>{activeEp.patientName}</strong> • {activeEp.episodeType}
                </span>
                <h3 className="text-sm font-bold text-ink mt-1">{activeEp.title}</h3>
                <p className="text-xs text-ink-muted">अस्पताल: <strong>{activeEp.hospitalName}</strong></p>
                <p className="text-xs text-ink-muted">डॉक्टर: <strong>{activeEp.doctorName}</strong></p>
              </div>

              <div className="text-right">
                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                  activeEp.status === 'recovered' ? 'bg-green/15 text-green' : 'bg-gold/20 text-gold-dark'
                }`}>
                  {activeEp.status === 'recovered' ? '✓ स्वस्थ' : 'इलाज जारी'}
                </span>
                {activeEp.hasInsurance && (
                  <p className="text-[10px] text-green font-semibold mt-1">🛡️ मेडिक्लेम पॉलिसी कवर</p>
                )}
              </div>
            </div>
          </div>

          {/* Bills List */}
          <div className="bg-paper border border-paper-dim rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
                अस्पताल के सभी बिल व रसीदें ({activeEp.bills.length})
              </h3>
              <button
                onClick={() => setIsAddBillOpen(true)}
                className="px-3 py-1 bg-gold text-navy text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-gold-light"
              >
                <Plus size={14} /> + बिल जोड़ें
              </button>
            </div>

            <div className="space-y-2">
              {activeEp.bills.map(b => (
                <div key={b.id} className="flex items-center justify-between p-2.5 bg-paper rounded-xl border border-paper-dim text-xs">
                  <div>
                    <span className="px-1.5 py-0.2 bg-paper-dim text-ink-muted text-[10px] font-bold rounded uppercase">
                      {b.category.replace('_', ' ')}
                    </span>
                    <h4 className="font-bold text-ink mt-0.5">{b.title}</h4>
                    <p className="text-[10px] text-ink-muted">{b.date} {b.isInsuranceClaimable ? '• बीमा में मान्य' : '• बीमा में अमान्य'}</p>
                  </div>
                  <Mono className="font-bold text-sm text-coral">₹{b.amount.toLocaleString('en-IN')}</Mono>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Episode Modal */}
      {isAddEpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <h3 className="text-sm font-bold text-ink">नया मेडिकल एपिसोड / बीमारी जोड़ें</h3>
            <form onSubmit={handleAddEpisode} className="space-y-3 text-xs">
              <div>
                <label className="block text-ink-muted mb-1">इलाज / बीमारी का शीर्षक</label>
                <input
                  type="text"
                  placeholder="उदा. पथरी ऑपरेशन या मोतियाबिंद"
                  value={epTitle}
                  onChange={e => setEpTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">मरीज़ (सदस्य)</label>
                  <select
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  >
                    <option value="पापा">पापा</option>
                    <option value="मम्मी">मम्मी</option>
                    <option value="रोहन">रोहन</option>
                    <option value="प्रिया">प्रिया</option>
                  </select>
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">प्रकार</label>
                  <select
                    value={episodeType}
                    onChange={e => setEpisodeType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  >
                    <option value="surgery">सर्जरी (Surgery)</option>
                    <option value="hospitalization">भर्ती (Hospitalized)</option>
                    <option value="pregnancy">डिलीवरी (Maternity)</option>
                    <option value="chronic_care">गंभीर रोग (Chronic)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-ink-muted mb-1">अस्पताल का नाम</label>
                <input
                  type="text"
                  placeholder="उदा. अपोलो / मेदांता / सिविल अस्पताल"
                  value={hospitalName}
                  onChange={e => setHospitalName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                />
              </div>
              <div>
                <label className="block text-ink-muted mb-1">मुख्य डॉक्टर का नाम</label>
                <input
                  type="text"
                  placeholder="उदा. डॉ. आर. के. गुप्ता"
                  value={doctorName}
                  onChange={e => setDoctorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddEpOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gold text-navy font-bold hover:bg-gold-light"
                >
                  दर्ज करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Bill Modal */}
      {isAddBillOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <h3 className="text-sm font-bold text-ink">अस्पताल बिल / दवा पर्चा जोड़ें</h3>
            <form onSubmit={handleAddBill} className="space-y-3 text-xs">
              <div>
                <label className="block text-ink-muted mb-1">बिल का विवरण</label>
                <input
                  type="text"
                  placeholder="उदा. ब्लड टेस्ट व MRI स्कैन"
                  value={billTitle}
                  onChange={e => setBillTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">रकम (₹)</label>
                  <input
                    type="number"
                    placeholder="8500"
                    value={billAmount}
                    onChange={e => setBillAmount(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-bold"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">श्रेणी</label>
                  <select
                    value={billCategory}
                    onChange={e => setBillCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  >
                    <option value="surgery_operation">ऑपरेशन / सर्जरी</option>
                    <option value="room_icu">रूम / बेड चार्ज</option>
                    <option value="pharmacy_medicine">दवाइयां (Medicine)</option>
                    <option value="lab_tests">जांच / टेस्ट</option>
                    <option value="doctor_consultation">डॉक्टर फीस</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddBillOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gold text-navy font-bold"
                >
                  बिल जोड़ें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
