'use client';

import React, { useState } from 'react';
import VaultLockModal from '@/components/security/VaultLockModal';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Mono } from '@/components/ui/Mono';
import { Button } from '@/components/ui/Button';
import { 
  HeartPulse, Clock, ShieldCheck, ShieldAlert, Plus, Stethoscope, Hospital, 
  Receipt, Car, MapPin, Calendar, FileText, Share2, Trash2, CheckCircle2, 
  ChevronRight, ArrowUpRight, ArrowDownRight, Phone, AlertCircle, X, 
  Activity, Baby, Scissors, Syringe, Pill, Bed, Coffee, ChevronLeft
} from 'lucide-react';
import { 
  MedicalTreatmentEpisode, 
  MedicalEpisodeDoctorVisit, 
  MedicalEpisodeExpenseItem, 
  MedicalExpenseCategory 
} from '@/types';
import confetti from 'canvas-confetti';
import Link from 'next/link';

export default function MedicalPage() {
  const [activeTab, setActiveTab] = useState<'treatments' | 'emergency_vault'>('treatments');
  const [isLocked, setIsLocked] = useState(true);

  const { 
    medicalRecords, 
    toggleMedicalVerification, 
    medicalEpisodes,
    addMedicalEpisode,
    updateMedicalEpisode,
    deleteMedicalEpisode,
    addEpisodeExpenseItem,
    deleteEpisodeExpenseItem,
    addEpisodeDoctorVisit,
    members,
    currentUserId 
  } = useFamilyStore();

  // Episode detail / drawer state
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);
  const [episodeSubTab, setEpisodeSubTab] = useState<'bills' | 'doctors' | 'travel' | 'insurance'>('bills');
  const [memberFilter, setMemberFilter] = useState<'all' | string>('all');

  // Modals state
  const [isAddEpisodeOpen, setIsAddEpisodeOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddDoctorVisitOpen, setIsAddDoctorVisitOpen] = useState(false);
  const [targetEpisodeId, setTargetEpisodeId] = useState<string>('');

  // Form State: New Episode
  const [epMemberId, setEpMemberId] = useState(members[0]?.id || 'm-sunita');
  const [epTitle, setEpTitle] = useState('');
  const [epTreatmentType, setEpTreatmentType] = useState<MedicalTreatmentEpisode['treatment_type']>('pregnancy_delivery');
  const [epPrimaryHospital, setEpPrimaryHospital] = useState('');
  const [epPrimaryDoctor, setEpPrimaryDoctor] = useState('');
  const [epCity, setEpCity] = useState('Delhi NCR');
  const [epStartDate, setEpStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [epHasInsurance, setEpHasInsurance] = useState(false);
  const [epInsuranceProvider, setEpInsuranceProvider] = useState('');
  const [epPolicyNumber, setEpPolicyNumber] = useState('');
  const [epNotes, setEpNotes] = useState('');

  // Form State: New Expense
  const [expCategory, setExpCategory] = useState<MedicalExpenseCategory>('doctor_consultation');
  const [expTitle, setExpTitle] = useState('');
  const [expDoctorName, setExpDoctorName] = useState('');
  const [expVendor, setExpVendor] = useState('');
  const [expCity, setExpCity] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);
  const [expPaymentMode, setExpPaymentMode] = useState<MedicalEpisodeExpenseItem['payment_mode']>('online_upi');
  const [expPaidBy, setExpPaidBy] = useState(currentUserId || members[0]?.id || 'm-head');
  const [expIsClaimable, setExpIsClaimable] = useState(false);
  const [expSettledAmount, setExpSettledAmount] = useState('');
  const [expNotes, setExpNotes] = useState('');

  // Form State: New Doctor Visit
  const [docName, setDocName] = useState('');
  const [docSpec, setDocSpec] = useState('');
  const [docHospital, setDocHospital] = useState('');
  const [docCity, setDocCity] = useState('');
  const [docVisitDate, setDocVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [docFee, setDocFee] = useState('');
  const [docNotes, setDocNotes] = useState('');
  const [docFollowup, setDocFollowup] = useState('');

  const activeEpisode = medicalEpisodes.find(ep => ep.id === selectedEpisodeId);

  // Overall Portfolio Calculations across all episodes
  const filteredEpisodes = medicalEpisodes.filter(ep => {
    if (memberFilter === 'all') return true;
    return ep.member_id === memberFilter;
  });

  const totalOngoingCount = medicalEpisodes.filter(e => e.status === 'ongoing').length;
  const totalBillsSum = medicalEpisodes.reduce((sum, e) => sum + Number(e.total_expenses || 0), 0);
  const totalInsuranceSum = medicalEpisodes.reduce((sum, e) => sum + Number(e.total_insurance_reimbursed || 0), 0);
  const totalNetOutOfPocket = medicalEpisodes.reduce((sum, e) => sum + Number(e.net_out_of_pocket || 0), 0);

  // Submit: New Episode
  const handleAddEpisodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!epTitle.trim()) return;

    const selectedMember = members.find(m => m.id === epMemberId);

    addMedicalEpisode({
      member_id: epMemberId,
      patient_name: selectedMember?.name || 'Parivar Sadasya',
      title: epTitle.trim(),
      treatment_type: epTreatmentType,
      start_date: epStartDate,
      status: 'ongoing',
      primary_hospital: epPrimaryHospital.trim() || undefined,
      primary_doctor: epPrimaryDoctor.trim() || undefined,
      city: epCity.trim() || undefined,
      has_health_insurance: epHasInsurance,
      insurance_provider: epInsuranceProvider.trim() || undefined,
      policy_number: epPolicyNumber.trim() || undefined,
      notes: epNotes.trim() || undefined,
      doctor_consultations: [],
      expense_items: []
    });

    setIsAddEpisodeOpen(false);
    setEpTitle('');
    setEpPrimaryHospital('');
    setEpPrimaryDoctor('');
    setEpNotes('');
    setEpInsuranceProvider('');
    setEpPolicyNumber('');
    try { confetti({ particleCount: 50, spread: 50 }); } catch (err) {}
  };

  // Submit: New Expense
  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(expAmount);
    if (!targetEpisodeId || !numAmt || numAmt <= 0) return;

    addEpisodeExpenseItem(targetEpisodeId, {
      date: expDate,
      category: expCategory,
      title: expTitle.trim() || getCategoryLabel(expCategory),
      doctor_name: expDoctorName.trim() || undefined,
      hospital_or_vendor: expVendor.trim() || undefined,
      city: expCity.trim() || undefined,
      amount: numAmt,
      payment_mode: expPaymentMode,
      paid_by_member_id: expPaidBy,
      is_insurance_claimable: expIsClaimable,
      insurance_settled_amount: expSettledAmount ? parseFloat(expSettledAmount) : undefined,
      notes: expNotes.trim() || undefined
    });

    setIsAddExpenseOpen(false);
    setExpTitle('');
    setExpAmount('');
    setExpDoctorName('');
    setExpVendor('');
    setExpSettledAmount('');
    setExpNotes('');
    try { confetti({ particleCount: 40, spread: 40 }); } catch (err) {}
  };

  // Submit: New Doctor Visit
  const handleAddDoctorVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEpisodeId || !docName.trim()) return;

    addEpisodeDoctorVisit(targetEpisodeId, {
      doctor_name: docName.trim(),
      specialization: docSpec.trim() || 'Specialist Doctor',
      hospital_clinic: docHospital.trim() || 'Hospital/Clinic',
      city: docCity.trim() || undefined,
      visit_date: docVisitDate,
      consultation_fee: docFee ? parseFloat(docFee) : undefined,
      prescription_notes: docNotes.trim() || undefined,
      next_followup_date: docFollowup || undefined
    });

    setIsAddDoctorVisitOpen(false);
    setDocName('');
    setDocSpec('');
    setDocHospital('');
    setDocFee('');
    setDocNotes('');
    setDocFollowup('');
    try { confetti({ particleCount: 40, spread: 40 }); } catch (err) {}
  };

  const getCategoryLabel = (cat: MedicalExpenseCategory) => {
    switch (cat) {
      case 'doctor_consultation': return '👨‍⚕️ Doctor OPD / Consultation';
      case 'diagnostics_tests': return '🔬 Janch / Scan / Ultrasound';
      case 'pharmacy_medicines': return '💊 Dawaiyan & Injections';
      case 'hospital_admission': return '🏥 Hospital Bed / Operation / Delivery';
      case 'travel_ambulance': return '🚗 Cab / Train / Ambulance Safar';
      case 'stay_food_attendant': return '🏨 Attendant Stay & Food';
      case 'physiotherapy_rehab': return '🧘 Physiotherapy & Home Nursing';
      default: return '🩺 Anya Kharcha';
    }
  };

  const getTreatmentTypeIcon = (type: MedicalTreatmentEpisode['treatment_type']) => {
    switch (type) {
      case 'pregnancy_delivery': return <Baby size={16} className="text-pink-600" />;
      case 'surgery_operation': return <Scissors size={16} className="text-blue-600" />;
      case 'chronic_illness': return <HeartPulse size={16} className="text-red-600" />;
      case 'dental_ortho': return <Activity size={16} className="text-purple-600" />;
      default: return <Stethoscope size={16} className="text-teal-600" />;
    }
  };

  const getWhatsAppShareUrl = (ep: MedicalTreatmentEpisode) => {
    const patient = members.find(m => m.id === ep.member_id)?.name || ep.patient_name || 'Family Member';
    let msg = `*🏥 Hospital & Medical Treatment Hisab Record*\n\n` +
      `• *Patient:* ${patient}\n` +
      `• *Ilaj / Episode:* ${ep.title}\n` +
      (ep.primary_hospital ? `• *Hospital:* ${ep.primary_hospital} (${ep.city || ''})\n` : '') +
      (ep.primary_doctor ? `• *Doctor:* ${ep.primary_doctor}\n` : '') +
      `• *Status:* ${ep.status === 'ongoing' ? '🟢 Chalu (Ongoing)' : '✓ Pura Hua (Completed)'}\n\n` +
      `*Kharcha Vivran (Financial Summary):*\n` +
      `• Kul Bills / Kharche: ₹${Math.round(ep.total_expenses).toLocaleString('en-IN')}\n` +
      `• Insurance Wapsi (Settled): ₹${Math.round(ep.total_insurance_reimbursed).toLocaleString('en-IN')}\n` +
      `• *Net Jeb Se Kharch:* *₹${Math.round(ep.net_out_of_pocket).toLocaleString('en-IN')}*\n\n` +
      `• Kul Bills Entries: ${ep.expense_items?.length || 0} bills\n` +
      `• Doctor Consultations: ${ep.doctor_consultations?.length || 0} visits\n\n` +
      `_Family Wealth & Medical Hub._`;

    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <ScreenHeader
        title="Medical & Hospital Hub"
        subtitle="Hospital episodes, doctor consultations, travel kharch aur emergency vault"
        action={
          activeTab === 'treatments' ? (
            <button
              type="button"
              onClick={() => setIsAddEpisodeOpen(true)}
              className="w-9 h-9 rounded-full bg-navy text-paper flex items-center justify-center shadow hover:bg-navy-light transition-all"
              title="Naya Ilaj / Treatment Episode Jodein"
            >
              <Plus size={18} />
            </button>
          ) : null
        }
      />

      {/* Main Tab Switcher: Treatments vs Emergency Vault */}
      <div className="px-4">
        <div className="grid grid-cols-2 p-1 bg-paper-dim rounded-2xl border border-paper-dim">
          <button
            onClick={() => setActiveTab('treatments')}
            className={'py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ' + (activeTab === 'treatments' ? 'bg-navy text-paper shadow-sm' : 'text-ink-muted hover:text-ink')}
          >
            <Hospital size={15} />
            <span>Hospital & Ongoing Ilaj</span>
          </button>
          <button
            onClick={() => setActiveTab('emergency_vault')}
            className={'py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ' + (activeTab === 'emergency_vault' ? 'bg-navy text-paper shadow-sm' : 'text-ink-muted hover:text-ink')}
          >
            <ShieldAlert size={15} />
            <span>Blood Group & Daily Meds</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: HOSPITAL & ONGOING TREATMENT EPISODES */}
      {/* ======================================================== */}
      {activeTab === 'treatments' && (
        <div className="space-y-4">
          {/* Overview Stat Cards */}
          <div className="px-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-paper border border-paper-dim shadow-xs">
              <span className="text-[10px] uppercase font-bold text-ink-muted block">Ongoing Ilaj</span>
              <Mono className="text-xl font-bold text-navy block mt-1">{totalOngoingCount}</Mono>
              <span className="text-[10px] text-ink-muted">Chalu treatments</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-paper border border-paper-dim shadow-xs">
              <span className="text-[10px] uppercase font-bold text-coral block">Kul Hospital Bills</span>
              <Mono className="text-xl font-bold text-coral block mt-1">₹{Math.round(totalBillsSum).toLocaleString('en-IN')}</Mono>
              <span className="text-[10px] text-ink-muted">Doctor, test, admit sab</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-paper border border-paper-dim shadow-xs">
              <span className="text-[10px] uppercase font-bold text-green block">Insurance Wapsi</span>
              <Mono className="text-xl font-bold text-green block mt-1">₹{Math.round(totalInsuranceSum).toLocaleString('en-IN')}</Mono>
              <span className="text-[10px] text-ink-muted">TPA claim settled</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-paper border border-paper-dim shadow-xs">
              <span className="text-[10px] uppercase font-bold text-gold-dark block">Jeb Se Lagaya</span>
              <Mono className="text-xl font-bold text-ink block mt-1">₹{Math.round(totalNetOutOfPocket).toLocaleString('en-IN')}</Mono>
              <span className="text-[10px] text-ink-muted">Net out-of-pocket</span>
            </div>
          </div>

          {/* Member Filter Bar */}
          <div className="px-4 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setMemberFilter('all')}
              className={'text-xs px-3.5 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ' + (memberFilter === 'all' ? 'bg-navy text-paper shadow-sm' : 'bg-paper border border-paper-dim text-ink-muted hover:text-ink')}
            >
              Sabhi Mareez / Sadasya
            </button>
            {members.map(m => (
              <button
                key={m.id}
                onClick={() => setMemberFilter(m.id)}
                className={'text-xs px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ' + (memberFilter === m.id ? 'bg-navy text-paper shadow-sm' : 'bg-paper border border-paper-dim text-ink-muted hover:text-ink')}
              >
                {m.name}
              </button>
            ))}
          </div>

          {/* Episode Cards List */}
          <div className="px-4 space-y-3">
            {filteredEpisodes.length === 0 ? (
              <div className="p-8 text-center bg-paper rounded-2xl border border-paper-dim space-y-2">
                <Hospital size={36} className="mx-auto text-ink-muted opacity-40" />
                <p className="text-sm font-bold text-ink">Koi Hospital Treatment Record Nahi Hai</p>
                <p className="text-xs text-ink-muted max-w-sm mx-auto">
                  Pregnancy, surgery ya kisi lambe ilaj ka ek jagah folder banane ke liye upar diye gaye &quot;+&quot; button par click karein.
                </p>
              </div>
            ) : (
              filteredEpisodes.map(ep => {
                const patient = members.find(m => m.id === ep.member_id);
                const isOngoing = ep.status === 'ongoing';

                return (
                  <div key={ep.id} className="p-4 rounded-2xl bg-paper border border-paper-dim shadow-sm space-y-3 hover:border-navy/30 transition-all">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="p-1.5 rounded-lg bg-paper-dim">
                            {getTreatmentTypeIcon(ep.treatment_type)}
                          </span>
                          <h3 className="text-sm font-bold text-ink">{ep.title}</h3>
                          <span className={'text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ' + (isOngoing ? 'bg-amber-100 text-amber-800' : 'bg-green/15 text-green')}>
                            {isOngoing ? '🟢 Ongoing' : '✓ Completed'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-ink-muted">
                          <span>Mareez / Sadasya: <strong className="text-ink">{patient?.name || ep.patient_name || 'Family Member'}</strong></span>
                          {ep.primary_hospital && (
                            <span className="flex items-center gap-1">
                              <Hospital size={11} className="text-navy" /> {ep.primary_hospital} {ep.city ? `(${ep.city})` : ''}
                            </span>
                          )}
                          {ep.primary_doctor && (
                            <span className="flex items-center gap-1">
                              <Stethoscope size={11} className="text-teal-700" /> {ep.primary_doctor}
                            </span>
                          )}
                        </div>

                        {ep.has_health_insurance && ep.insurance_provider && (
                          <div className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md inline-flex items-center gap-1 font-medium">
                            <ShieldCheck size={11} /> Insurance: {ep.insurance_provider} {ep.policy_number ? `· ${ep.policy_number}` : ''}
                          </div>
                        )}
                      </div>

                      {/* Right Total Net Out-of-Pocket */}
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-ink-muted block uppercase font-bold">Jeb Se Lagaya</span>
                        <Mono className="text-base font-bold text-coral block">
                          ₹{Math.round(ep.net_out_of_pocket).toLocaleString('en-IN')}
                        </Mono>
                        <span className="text-[10px] text-ink-muted block">
                          Kul: ₹{Math.round(ep.total_expenses).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-paper-dim text-xs">
                      <div className="p-2 rounded-xl bg-paper-dim/40">
                        <span className="text-[9px] text-ink-muted block uppercase font-semibold">Bills / Kharcha</span>
                        <span className="font-mono font-bold text-ink text-xs mt-0.5 block">
                          {ep.expense_items?.length || 0} bills (₹{Math.round(ep.total_expenses).toLocaleString('en-IN')})
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-paper-dim/40">
                        <span className="text-[9px] text-ink-muted block uppercase font-semibold">Dr. Consultations</span>
                        <span className="font-mono font-bold text-teal-800 text-xs mt-0.5 block">
                          {ep.doctor_consultations?.length || 0} visits
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-paper-dim/40">
                        <span className="text-[9px] text-ink-muted block uppercase font-semibold">Insurance Wapsi</span>
                        <span className="font-mono font-bold text-green text-xs mt-0.5 block">
                          ₹{Math.round(ep.total_insurance_reimbursed).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedEpisodeId(ep.id);
                            setEpisodeSubTab('bills');
                          }}
                          className="bg-navy text-paper text-xs font-semibold py-1.5 px-3 flex items-center gap-1"
                        >
                          <FileText size={13} /> Ilaj File & Bills Kholein
                        </Button>

                        <a
                          href={getWhatsAppShareUrl(ep)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs flex items-center gap-1 shadow-sm transition-all"
                          title="WhatsApp par summary share karein"
                        >
                          <Share2 size={13} />
                        </a>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setTargetEpisodeId(ep.id);
                            setIsAddDoctorVisitOpen(true);
                          }}
                          className="text-[11px] font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 px-2.5 py-1.5 rounded-lg border border-teal-200 flex items-center gap-1 transition-all"
                        >
                          + Dr. Visit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTargetEpisodeId(ep.id);
                            setIsAddExpenseOpen(true);
                          }}
                          className="text-[11px] font-semibold text-coral bg-coral/10 hover:bg-coral/20 px-2.5 py-1.5 rounded-lg border border-coral/20 flex items-center gap-1 transition-all"
                        >
                          + Naya Bill
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: EMERGENCY VAULT & DAILY MEDICINES (Original Feature) */}
      {/* ======================================================== */}
      {activeTab === 'emergency_vault' && (
        <div className="space-y-4">
          <VaultLockModal 
            isOpen={isLocked} 
            onUnlocked={() => setIsLocked(false)} 
            title="Medical Health Vault Locked" 
            description="Parivar ke blood groups aur confidential bimariyo ka data dekhne ke liye Vault PIN ya Fingerprint use karein." 
          />

          <div className="px-4">
            <div className="p-3 bg-coral/10 border border-coral/20 rounded-xl flex items-start gap-2 text-xs text-coral">
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <span>
                Emergency data: Parivar ka koi bhi sadasya kisi ki bhi zaroori dawai aur blood group yahan se dekh sakta hai.
              </span>
            </div>
          </div>

          <div className="px-4 space-y-3">
            {medicalRecords.map((rec) => (
              <div key={rec.id} className="rounded-xl p-4 bg-paper border border-paper-dim shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HeartPulse size={16} className="text-coral" />
                    <h3 className="text-sm font-semibold text-ink">{rec.member_name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold bg-coral/15 text-coral">
                      {rec.blood_group}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleMedicalVerification(rec.id)}
                      className={'text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ' + (rec.is_verified ? 'bg-green/10 text-green' : 'bg-gray-200 text-gray-600')}
                      title="Tap to verify/unverify"
                    >
                      {rec.is_verified ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                      {rec.is_verified ? 'Verified' : 'Unverified'}
                    </button>
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <p className="text-ink-muted">
                    <span className="font-medium text-ink">Condition: </span>
                    {rec.condition}
                  </p>
                  <p className="text-ink-muted flex items-start gap-1">
                    <Clock size={13} className="text-gold mt-0.5 shrink-0" />
                    <span>
                      <strong className="text-ink">{rec.medicine_name}</strong> — {rec.medicine_time}
                    </span>
                  </p>
                  {rec.notes && (
                    <p className="text-ink-muted text-[11px] bg-paper-dim/50 p-2 rounded-lg mt-1">
                      {rec.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EPISODE DETAIL FILE & EXPENSES DRAWER */}
      {/* ======================================================== */}
      {selectedEpisodeId && activeEpisode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-paper p-5 rounded-3xl border border-paper-dim shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-paper-dim pb-3">
              <div>
                <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">
                  Medical Treatment File · {activeEpisode.patient_name}
                </span>
                <h2 className="text-base font-bold font-serif text-ink mt-0.5">{activeEpisode.title}</h2>
                <p className="text-xs text-ink-muted flex items-center gap-2 mt-0.5">
                  <span>Hospital: <strong className="text-ink">{activeEpisode.primary_hospital || 'N/A'}</strong></span>
                  <span>· Dr: <strong className="text-ink">{activeEpisode.primary_doctor || 'N/A'}</strong></span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEpisodeId(null)}
                className="p-1.5 rounded-full hover:bg-paper-dim text-ink-muted hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            {/* Financial Summary Card */}
            <div className="p-3.5 rounded-2xl bg-navy text-paper shadow-sm grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[10px] text-paper-muted block">Kul Bills / Kharch</span>
                <Mono className="text-base font-bold text-paper block mt-0.5">
                  ₹{Math.round(activeEpisode.total_expenses).toLocaleString('en-IN')}
                </Mono>
              </div>
              <div>
                <span className="text-[10px] text-paper-muted block">Insurance Settled</span>
                <Mono className="text-base font-bold text-green block mt-0.5">
                  ₹{Math.round(activeEpisode.total_insurance_reimbursed).toLocaleString('en-IN')}
                </Mono>
              </div>
              <div>
                <span className="text-[10px] text-paper-muted block">Net Jeb Se Lagaya</span>
                <Mono className="text-base font-bold text-gold-soft block mt-0.5">
                  ₹{Math.round(activeEpisode.net_out_of_pocket).toLocaleString('en-IN')}
                </Mono>
              </div>
            </div>

            {/* Sub-tabs within Episode */}
            <div className="flex gap-1 border-b border-paper-dim pb-1">
              {[
                { id: 'bills', label: `💵 Bills (${activeEpisode.expense_items?.length || 0})` },
                { id: 'doctors', label: `👨‍⚕️ Doctors (${activeEpisode.doctor_consultations?.length || 0})` },
                { id: 'travel', label: '🚗 Safar & Stay' },
                { id: 'insurance', label: '📑 Insurance' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setEpisodeSubTab(t.id as any)}
                  className={'px-3 py-1.5 text-xs font-bold rounded-lg transition-all ' + (episodeSubTab === t.id ? 'bg-navy text-paper' : 'text-ink-muted hover:text-ink')}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* SUBTAB 1: BILLS LOG */}
            {episodeSubTab === 'bills' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-ink">Sabhi Kharch / Medical Bills</span>
                  <button
                    type="button"
                    onClick={() => {
                      setTargetEpisodeId(activeEpisode.id);
                      setIsAddExpenseOpen(true);
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold bg-navy text-paper rounded-lg flex items-center gap-1"
                  >
                    <Plus size={12} /> Naya Bill Jodein
                  </button>
                </div>

                {(!activeEpisode.expense_items || activeEpisode.expense_items.length === 0) ? (
                  <p className="text-xs text-ink-muted py-6 text-center">Is ilaj me abhi koi bill add nahi hua hai.</p>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1 divide-y divide-paper-dim">
                    {activeEpisode.expense_items.map((item) => {
                      const payer = members.find(m => m.id === item.paid_by_member_id);
                      return (
                        <div key={item.id} className="pt-2 flex items-center justify-between text-xs">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-ink">{item.title}</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-paper-dim text-ink-muted font-medium">
                                {getCategoryLabel(item.category).split(' ')[0]} {item.category.replace('_', ' ')}
                              </span>
                              {item.insurance_settled_amount && item.insurance_settled_amount > 0 ? (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-green/15 text-green font-bold">
                                  ✓ Ins: ₹{item.insurance_settled_amount}
                                </span>
                              ) : null}
                            </div>
                            <div className="text-[10px] text-ink-muted flex items-center gap-2">
                              <span>Tareekh: {item.date}</span>
                              {item.hospital_or_vendor && <span>· {item.hospital_or_vendor}</span>}
                              <span>· Diya: <strong className="text-ink">{payer?.name || 'Aap'}</strong></span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Mono className="font-bold text-ink text-sm">
                              ₹{item.amount.toLocaleString('en-IN')}
                            </Mono>
                            <button
                              type="button"
                              onClick={() => deleteEpisodeExpenseItem(activeEpisode.id, item.id)}
                              className="text-ink-muted hover:text-coral p-1"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* SUBTAB 2: DOCTORS & CONSULTATIONS */}
            {episodeSubTab === 'doctors' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-ink">Doctors & Second Opinion Checkups</span>
                  <button
                    type="button"
                    onClick={() => {
                      setTargetEpisodeId(activeEpisode.id);
                      setIsAddDoctorVisitOpen(true);
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold bg-teal-800 text-paper rounded-lg flex items-center gap-1"
                  >
                    <Plus size={12} /> Doctor Visit Jodein
                  </button>
                </div>

                {(!activeEpisode.doctor_consultations || activeEpisode.doctor_consultations.length === 0) ? (
                  <p className="text-xs text-ink-muted py-6 text-center">Koi doctor visit record nahi hai.</p>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {activeEpisode.doctor_consultations.map((doc) => (
                      <div key={doc.id} className="p-3 rounded-xl bg-paper-dim/40 border border-paper-dim space-y-1.5 text-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-ink flex items-center gap-1">
                              <Stethoscope size={13} className="text-teal-700" /> {doc.doctor_name}
                            </h4>
                            <p className="text-[10px] text-ink-muted">{doc.specialization} · {doc.hospital_clinic} {doc.city ? `(${doc.city})` : ''}</p>
                          </div>
                          <span className="text-[10px] text-ink-muted font-mono">{doc.visit_date}</span>
                        </div>

                        {doc.prescription_notes && (
                          <p className="text-[11px] text-ink-muted bg-paper p-2 rounded-lg border border-paper-dim italic">
                            &quot;{doc.prescription_notes}&quot;
                          </p>
                        )}

                        <div className="flex justify-between items-center text-[10px] text-ink-muted pt-1 border-t border-paper-dim">
                          <span>Fees: <Mono className="font-bold text-ink">₹{doc.consultation_fee || 0}</Mono></span>
                          {doc.next_followup_date && (
                            <span className="text-teal-800 font-bold flex items-center gap-1">
                              <Calendar size={11} /> Agla Checkup: {doc.next_followup_date}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SUBTAB 3: TRAVEL & STAY LOGISTICS */}
            {episodeSubTab === 'travel' && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-ink block">Hospital Travel & Attendant Lodging Kharcha</span>
                <p className="text-[11px] text-ink-muted">
                  Hospital aane-jane ka Cab/Ambulance/Train ticket aur attendants ke stay & khane ka hisab:
                </p>

                {activeEpisode.expense_items?.filter(e => e.category === 'travel_ambulance' || e.category === 'stay_food_attendant').length === 0 ? (
                  <p className="text-xs text-ink-muted py-6 text-center">Is ilaj me abhi koi travel ya stay kharcha log nahi hai.</p>
                ) : (
                  <div className="space-y-2">
                    {activeEpisode.expense_items
                      ?.filter(e => e.category === 'travel_ambulance' || e.category === 'stay_food_attendant')
                      .map(item => (
                        <div key={item.id} className="p-2.5 rounded-xl bg-paper-dim/40 border border-paper-dim flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-ink block">{item.title}</span>
                            <span className="text-[10px] text-ink-muted">{item.date} · {item.hospital_or_vendor || 'Local'}</span>
                          </div>
                          <Mono className="font-bold text-coral text-sm">
                            ₹{item.amount.toLocaleString('en-IN')}
                          </Mono>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* SUBTAB 4: INSURANCE SUMMARY */}
            {episodeSubTab === 'insurance' && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                  <h4 className="font-bold text-blue-950 flex items-center gap-1">
                    <ShieldCheck size={14} className="text-blue-700" /> Health Insurance Policy
                  </h4>
                  <p className="text-blue-900/80">
                    Company: <strong>{activeEpisode.insurance_provider || 'Not Provided'}</strong><br />
                    Policy No: <Mono className="font-bold">{activeEpisode.policy_number || 'N/A'}</Mono>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-paper-dim border border-paper-dim">
                    <span className="text-[10px] text-ink-muted block uppercase font-bold">Insurance Settled</span>
                    <Mono className="text-base font-bold text-green block mt-1">
                      ₹{Math.round(activeEpisode.total_insurance_reimbursed).toLocaleString('en-IN')}
                    </Mono>
                  </div>
                  <div className="p-3 rounded-xl bg-paper-dim border border-paper-dim">
                    <span className="text-[10px] text-ink-muted block uppercase font-bold">Jeb Se Lagaya (Net)</span>
                    <Mono className="text-base font-bold text-coral block mt-1">
                      ₹{Math.round(activeEpisode.net_out_of_pocket).toLocaleString('en-IN')}
                    </Mono>
                  </div>
                </div>
              </div>
            )}

            {/* Drawer Footer Actions */}
            <div className="flex justify-between items-center pt-2 border-t border-paper-dim">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Kya aap sach me is ilaj file ko delete karna chahte hain?')) {
                    deleteMedicalEpisode(activeEpisode.id);
                    setSelectedEpisodeId(null);
                  }
                }}
                className="text-xs text-coral hover:underline font-semibold flex items-center gap-1"
              >
                <Trash2 size={13} /> Ilaj File Delete Karein
              </button>

              <Button
                size="sm"
                onClick={() => setSelectedEpisodeId(null)}
                className="bg-navy text-paper font-semibold"
              >
                Done / Wapas
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD NEW TREATMENT EPISODE */}
      {/* ======================================================== */}
      {isAddEpisodeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-paper-dim pb-2">
              <h3 className="text-base font-bold font-serif text-ink">Naya Ilaj / Treatment Episode Jodein</h3>
              <button onClick={() => setIsAddEpisodeOpen(false)} className="text-ink-muted hover:text-ink text-xs font-bold">✕</button>
            </div>

            <form onSubmit={handleAddEpisodeSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Mareez / Kiska Ilaj Hai? *</label>
                <select
                  value={epMemberId}
                  onChange={(e) => setEpMemberId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-medium"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Ilaj Ka Naam / Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Priya — Pregnancy & Delivery Care, Papa — Heart Angioplasty"
                  value={epTitle}
                  onChange={(e) => setEpTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Treatment Type</label>
                  <select
                    value={epTreatmentType}
                    onChange={(e) => setEpTreatmentType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  >
                    <option value="pregnancy_delivery">🤰 Pregnancy & Delivery</option>
                    <option value="surgery_operation">🔪 Surgery / Operation</option>
                    <option value="chronic_illness">🩺 Chronic / Long Illness</option>
                    <option value="accidental_injury">🦴 Fracture / Injury</option>
                    <option value="dental_ortho">🦷 Dental / Braces</option>
                    <option value="child_pediatric">👶 Child Pediatric Care</option>
                    <option value="general_prolonged">🏥 Anya Lamba Ilaj</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Shuru Hone Ki Tareekh</label>
                  <input
                    type="date"
                    value={epStartDate}
                    onChange={(e) => setEpStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Mukhya Hospital / Clinic</label>
                  <input
                    type="text"
                    placeholder="e.g. Apollo Hospital, AIIMS"
                    value={epPrimaryHospital}
                    onChange={(e) => setEpPrimaryHospital(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Mukhya Doctor Ka Naam</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Sunita Agarwal"
                    value={epPrimaryDoctor}
                    onChange={(e) => setEpPrimaryDoctor(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Shehar (City / Location)</label>
                <input
                  type="text"
                  placeholder="e.g. Delhi NCR, Mumbai, Local City"
                  value={epCity}
                  onChange={(e) => setEpCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                />
              </div>

              {/* Health Insurance details */}
              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase text-blue-900">Health Insurance / Mediclaim Hai?</label>
                  <input
                    type="checkbox"
                    checked={epHasInsurance}
                    onChange={(e) => setEpHasInsurance(e.target.checked)}
                    className="rounded"
                  />
                </div>

                {epHasInsurance && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <input
                        type="text"
                        placeholder="Insurance Company (e.g. Star Health)"
                        value={epInsuranceProvider}
                        onChange={(e) => setEpInsuranceProvider(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-blue-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Policy / Card Number"
                        value={epPolicyNumber}
                        onChange={(e) => setEpPolicyNumber(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-blue-200 rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Notes / Plan</label>
                <input
                  type="text"
                  placeholder="e.g. Delivery expected in July, Dr advised high protein diet"
                  value={epNotes}
                  onChange={(e) => setEpNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddEpisodeOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1 bg-navy text-paper font-semibold">
                  Save Ilaj File
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD NEW BILL / EXPENSE */}
      {/* ======================================================== */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-paper-dim pb-2">
              <h3 className="text-base font-bold font-serif text-ink">Naya Medical Bill / Kharch Jodein</h3>
              <button onClick={() => setIsAddExpenseOpen(false)} className="text-ink-muted hover:text-ink text-xs font-bold">✕</button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Kharcha Category *</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-medium"
                >
                  <option value="doctor_consultation">👨‍⚕️ Doctor OPD / Consultation Fee</option>
                  <option value="diagnostics_tests">🔬 Janch / Ultrasound / MRI / Blood Test</option>
                  <option value="pharmacy_medicines">💊 Dawaiyan & Injections</option>
                  <option value="hospital_admission">🏥 Hospital Bed / OT / Delivery Package</option>
                  <option value="travel_ambulance">🚗 Cab / Train / Ambulance Safar</option>
                  <option value="stay_food_attendant">🏨 Attendant Stay & Food</option>
                  <option value="physiotherapy_rehab">🧘 Physiotherapy & Home Nursing</option>
                  <option value="other">🩺 Anya Kharcha</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Kharch Ka Naam / Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Double Marker Blood Test, Hospital Cab To & Fro"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Raqam (₹ Bill Amount) *</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-paper-dim border border-paper-dim rounded-xl font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Tareekh (Date)</label>
                  <input
                    type="date"
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Lab / Hospital / Vendor</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Lal PathLabs, Apollo, Ola"
                    value={expVendor}
                    onChange={(e) => setExpVendor(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Doctor Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Sunita Agarwal"
                    value={expDoctorName}
                    onChange={(e) => setExpDoctorName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Kis Member Ne Pay Kiya?</label>
                  <select
                    value={expPaidBy}
                    onChange={(e) => setExpPaidBy(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Payment Mode</label>
                  <select
                    value={expPaymentMode}
                    onChange={(e) => setExpPaymentMode(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  >
                    <option value="online_upi">📱 Online UPI (GPay/PhonePe)</option>
                    <option value="cash">💵 Cash (Nagad)</option>
                    <option value="card">💳 Card</option>
                    <option value="bank_transfer">🏦 NetBanking</option>
                  </select>
                </div>
              </div>

              {/* Insurance Claim Reimbursement Check */}
              <div className="p-3 bg-green-50/70 border border-green-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase text-green-900">Insurance Claim / Reimbursement Mila?</label>
                  <input
                    type="checkbox"
                    checked={expIsClaimable}
                    onChange={(e) => setExpIsClaimable(e.target.checked)}
                    className="rounded"
                  />
                </div>

                {expIsClaimable && (
                  <div>
                    <label className="text-[9px] font-bold uppercase text-green-900 block mb-1">
                      Kitna Paisa Wapas Mila? (₹ Settled Amount)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 3500 (0 agar abhi pending hai)"
                      value={expSettledAmount}
                      onChange={(e) => setExpSettledAmount(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-green-200 rounded-lg font-mono font-bold"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Notes / Bill Receipt No</label>
                <input
                  type="text"
                  placeholder="e.g. Bill #84102, Report normal aayi"
                  value={expNotes}
                  onChange={(e) => setExpNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddExpenseOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1 bg-navy text-paper font-semibold">
                  Save Medical Bill
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD NEW DOCTOR VISIT */}
      {/* ======================================================== */}
      {isAddDoctorVisitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-paper-dim pb-2">
              <h3 className="text-base font-bold font-serif text-ink">Doctor Consultation / Visit Record Jodein</h3>
              <button onClick={() => setIsAddDoctorVisitOpen(false)} className="text-ink-muted hover:text-ink text-xs font-bold">✕</button>
            </div>

            <form onSubmit={handleAddDoctorVisitSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Doctor Ka Naam *</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Sunita Agarwal"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Gynecologist, Surgeon"
                    value={docSpec}
                    onChange={(e) => setDocSpec(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Hospital / Clinic</label>
                  <input
                    type="text"
                    placeholder="e.g. Apollo Cradle, Fortis"
                    value={docHospital}
                    onChange={(e) => setDocHospital(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Checkup Tareekh</label>
                  <input
                    type="date"
                    value={docVisitDate}
                    onChange={(e) => setDocVisitDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Consultation Fees (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1200"
                    value={docFee}
                    onChange={(e) => setDocFee(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Prescription Notes / Doctor Ki Salah</label>
                <input
                  type="text"
                  placeholder="e.g. Folic acid tablets, BP normal (120/80), advised rest"
                  value={docNotes}
                  onChange={(e) => setDocNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Agla Checkup / Next Follow-up Date</label>
                <input
                  type="date"
                  value={docFollowup}
                  onChange={(e) => setDocFollowup(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddDoctorVisitOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1 bg-teal-800 text-paper font-semibold">
                  Save Doctor Visit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
