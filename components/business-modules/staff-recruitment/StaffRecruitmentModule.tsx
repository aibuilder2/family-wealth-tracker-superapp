'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  UserCheck, Users, Plus, Search, Filter, Phone, Calendar, 
  CheckCircle2, Clock, X, AlertCircle, FileText, Printer, 
  Share2, ChevronRight, Briefcase, Award, ShieldCheck, MapPin, 
  Trash2, Edit3, Star, CheckSquare, Sparkles, Building, ArrowRight,
  ExternalLink, UserPlus, Send, Copy, Check, Layers, Sliders, ChevronDown
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

export interface CandidateExperience {
  firstJobStartedYear?: string; // पहले काम कहाँ से और कब शुरू किया
  previousEmployer: string; // पिछली दुकान / कंपनी का नाम
  role: string; // पिछला पद / काम
  durationMonths: number; // कितने महीने / साल काम किया
  lastDrawnSalary: number; // पिछली सैलरी
  reasonForLeaving: string; // नौकरी छोड़ने का कारण
  referenceContactName?: string; // संदर्भ / गारंटर का नाम
  referenceContactPhone?: string; // संदर्भ का फोन
}

export interface CandidateKYC {
  aadharNumber?: string;
  hasAadharCopy: boolean;
  panNumber?: string;
  hasPanCopy: boolean;
  hasPhoto: boolean;
  hasPoliceVerification: boolean;
  hasAddressProof: boolean;
  drivingLicense?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  upiId?: string;
}

export interface CandidateWorkTerms {
  targetRole: string; // जैसे: सेल्समैन, हेल्पर, कुक, ड्राइवर, बिलिंग काउंटर, अकाउंटेंट, गार्ड
  department?: string;
  workResponsibilities: string; // दैनिक काम और मुख्य जिम्मेदारियां
  wageModel: 'monthly_fixed' | 'daily_wage' | 'piece_rate' | 'commission';
  proposedSalary: number; // मासिक वेतन या दैनिक दर
  paymentSchedule: 'monthly' | 'weekly' | 'daily';
  salaryPaymentDate?: string; // जैसे 1 से 7 तारीख
  workShiftTimings: string; // जैसे सुबह 9:00 से रात 8:00
  weeklyOffDay: string; // जैसे रविवार, मंगलवार आदि
  allowedPaidLeaves: number; // महीने में कितनी सवेतन छुट्टी
  maxConsecutiveLeaves: number; // बिना सूचना लगातार कितने दिन छुट्टी ले सकते हैं
  deductLeaveSalary: boolean; // अतिरिक्त छुट्टी पर पैसे कटेंगे
  noticePeriodDays: number; // नौकरी छोड़ने पर कितने दिन पहले नोटिस
  advancePolicy?: string; // एडवांस लेने के नियम
  
  // Joining & Reporting Details (Final Selection)
  joiningDate?: string; // कब से काम शुरू करना है
  reportingTime?: string; // कितने बजे पहुंचना है (जैसे सुबह 9:30 बजे)
  reportingSupervisor?: string; // किसको रिपोर्ट करना है (जैसे: श्री महेश जी)
  requiredDocsAtJoining?: string; // पहले दिन लाने वाले जरूरी दस्तावेज
}

export interface RecruitmentStage {
  id: string;
  label: string;
  color: string;
  isSystem?: boolean;
}

export const DEFAULT_STAGES: RecruitmentStage[] = [
  { id: 'applied', label: '📥 नए आवेदन (Applied)', color: 'bg-slate-100 text-slate-700 border-slate-300', isSystem: true },
  { id: 'interview_1', label: '📞 राउंड 1: फोन इंटरव्यू', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'interview_2', label: '🤝 राउंड 2: मुख्य इंटरव्यू / टेस्ट', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'trial_period', label: '⏳ ट्रायल काम (3-7 दिन)', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'hired', label: '✅ अंतिम चयन व नियुक्त (Hired)', color: 'bg-emerald-50 text-emerald-700 border-emerald-300', isSystem: true },
  { id: 'rejected', label: '❌ अस्वीकृत (Rejected)', color: 'bg-rose-50 text-rose-700 border-rose-200', isSystem: true },
];

export interface StaffCandidate {
  id: string;
  fullName: string;
  phone: string;
  whatsapp?: string;
  dob?: string;
  gender: 'male' | 'female' | 'other';
  currentAddress: string; // स्थानीय / शहर का पता
  permanentAddress: string; // मूल गांव या स्थायी पता
  qualification: 'illiterate' | '8th_pass' | '10th_pass' | '12th_pass' | 'iti_diploma' | 'graduate' | 'post_graduate' | 'skilled_artisan';
  qualificationDetails?: string;
  
  // Work History
  hasPastExperience: boolean;
  pastExperience?: CandidateExperience;
  
  // Work Terms & Leaves
  workTerms: CandidateWorkTerms;
  
  // Documents & KYC
  kyc: CandidateKYC;
  
  // Recruitment Status / Custom Stage ID
  status: string; // Stage ID: 'applied' | 'interview_1' | 'interview_2' | 'trial_period' | 'hired' | 'rejected' | custom stage id
  interviewDate?: string;
  interviewRating?: number; // 1-5
  interviewNotes?: string;
  trialDays?: number; // 3-7 दिन ट्रायल
  appliedDate: string;
  hiredDate?: string;
}

const DEFAULT_CANDIDATES: StaffCandidate[] = [
  {
    id: 'cand-001',
    fullName: 'राजेश कुमार वर्मा',
    phone: '9827101234',
    whatsapp: '9827101234',
    dob: '1996-05-14',
    gender: 'male',
    currentAddress: 'वार्ड नंबर 4, मेन मार्केट के पीछे, स्थानीय शहर',
    permanentAddress: 'ग्राम रामपुर, पोस्ट बेलतरा, जिला बिलासपुर (छ.ग.)',
    qualification: '12th_pass',
    qualificationDetails: 'कॉमर्स 12वीं उत्तीर्ण + कंप्यूटर बेसिक (MS Word, Tally Basic)',
    hasPastExperience: true,
    pastExperience: {
      firstJobStartedYear: '2019 (कपड़ा दुकान में सेल्समैन)',
      previousEmployer: 'श्री राम वस्त्र भंडार, गोल बाजार',
      role: 'वरिष्ठ सेल्समैन व स्टॉक इनवर्ड',
      durationMonths: 36,
      lastDrawnSalary: 12000,
      reasonForLeaving: 'दुकान बंद होने के कारण नया काम तलाश रहे हैं',
      referenceContactName: 'श्री रामस्वरूप जी (मालिक)',
      referenceContactPhone: '9827000000'
    },
    workTerms: {
      targetRole: 'सीनियर सेल्समैन व बिलिंग सहायक',
      department: 'रिटेल काउंटर',
      workResponsibilities: 'ग्राहकों को सामान दिखाना, बिलिंग काउंटर संभालना, दैनिक स्टॉक मिलान व दुकान की साफ-सफाई की निगरानी।',
      wageModel: 'monthly_fixed',
      proposedSalary: 14000,
      paymentSchedule: 'monthly',
      salaryPaymentDate: 'प्रत्येक माह की 5 तारीख',
      workShiftTimings: 'सुबह 9:30 से रात 8:30',
      weeklyOffDay: 'मंगलवार (साप्ताहिक अवकाश)',
      allowedPaidLeaves: 2,
      maxConsecutiveLeaves: 2,
      deductLeaveSalary: true,
      noticePeriodDays: 15,
      advancePolicy: '15 दिन काम पूरा होने के बाद अधिकतम 50% एडवांस स्वीकृत',
      joiningDate: '2026-10-01',
      reportingTime: 'सुबह 9:30 बजे',
      reportingSupervisor: 'श्री गुप्ता जी (प्रबंधक)',
      requiredDocsAtJoining: 'आधार कार्ड ओरिजिनल, 2 फोटो, बैंक पासबुक कॉपी'
    },
    kyc: {
      aadharNumber: '4589 1234 5678',
      hasAadharCopy: true,
      panNumber: 'ABCDE1234F',
      hasPanCopy: true,
      hasPhoto: true,
      hasPoliceVerification: true,
      hasAddressProof: true,
      bankAccountNumber: '30291048572',
      bankIfsc: 'SBIN0001234',
      upiId: 'rajesh@oksbi'
    },
    status: 'interview_2',
    interviewDate: '2026-09-30T11:00',
    interviewRating: 4,
    interviewNotes: 'बातचीत में काफी शालीन, 3 साल का अनुभव है और बिलिंग सॉफ्टवेयर जानता है।',
    trialDays: 3,
    appliedDate: '2026-09-28'
  },
  {
    id: 'cand-002',
    fullName: 'दिनेश कुमार साहू',
    phone: '9893214567',
    whatsapp: '9893214567',
    dob: '2001-08-20',
    gender: 'male',
    currentAddress: 'शांति नगर, गली नंबर 2, स्थानीय शहर',
    permanentAddress: 'ग्राम तखतपुर, मुंगेली रोड',
    qualification: '10th_pass',
    qualificationDetails: '10वीं पास',
    hasPastExperience: true,
    pastExperience: {
      firstJobStartedYear: '2022 (ट्रांसपोर्ट गोदाम)',
      previousEmployer: 'माँ शारदा लॉजिस्टिक्स',
      role: 'लोडिंग-अनलोडिंग व लोकल डिलीवरी',
      durationMonths: 18,
      lastDrawnSalary: 9500,
      reasonForLeaving: 'देर रात की शिफ्ट के कारण दिन का काम चाहिए था',
      referenceContactName: 'विशाल भइया',
      referenceContactPhone: '9425000000'
    },
    workTerms: {
      targetRole: 'गोदाम हेल्पर व डिलीवरी बॉय',
      department: 'वेयरहाउस व डिलीवरी',
      workResponsibilities: 'मंडी से माल लाना, दुकान में बोरियां जमाना, लोकल ग्राहकों को आर्डर पहुंचाना।',
      wageModel: 'monthly_fixed',
      proposedSalary: 11000,
      paymentSchedule: 'monthly',
      salaryPaymentDate: 'प्रत्येक माह की 7 तारीख',
      workShiftTimings: 'सुबह 8:30 से शाम 7:30',
      weeklyOffDay: 'रविवार',
      allowedPaidLeaves: 2,
      maxConsecutiveLeaves: 2,
      deductLeaveSalary: true,
      noticePeriodDays: 10,
      advancePolicy: 'महीने में 1 बार अधिकतम ₹2,000',
      joiningDate: '2026-10-02',
      reportingTime: 'सुबह 8:30 बजे',
      reportingSupervisor: 'गोदाम प्रभारी'
    },
    kyc: {
      aadharNumber: '8912 3456 7890',
      hasAadharCopy: true,
      hasPanCopy: false,
      hasPhoto: true,
      hasPoliceVerification: false,
      hasAddressProof: true,
      drivingLicense: 'CG-10-2021004567',
      upiId: 'dinesh@paytm'
    },
    status: 'trial_period',
    trialDays: 5,
    interviewRating: 4,
    interviewNotes: 'मेहनती लड़का है, ड्राइविंग लाइसेंस भी है। 5 दिन का ट्रायल चालू है।',
    appliedDate: '2026-09-25'
  }
];

export function StaffRecruitmentModule() {
  // Custom & Default Stages State
  const [stages, setStages] = useState<RecruitmentStage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_staff_recruitment_stages_v2');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return DEFAULT_STAGES;
  });

  useEffect(() => {
    localStorage.setItem('fwa_staff_recruitment_stages_v2', JSON.stringify(stages));
  }, [stages]);

  // Candidates State
  const [candidates, setCandidates] = useState<StaffCandidate[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_staff_recruitment_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((c: any) => ({
              ...c,
              status: c.status === 'interview_scheduled' ? 'interview_1' : c.status
            }));
          }
        } catch (e) {}
      }
    }
    return DEFAULT_CANDIDATES;
  });

  useEffect(() => {
    localStorage.setItem('fwa_staff_recruitment_v1', JSON.stringify(candidates));
  }, [candidates]);

  // Tab & Filters
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<StaffCandidate | null>(null);
  const [isOfferLetterOpen, setIsOfferLetterOpen] = useState(false);
  const [candidateForOffer, setCandidateForOffer] = useState<StaffCandidate | null>(null);
  const [isNewStageModalOpen, setIsNewStageModalOpen] = useState(false);
  const [newStageName, setNewStageName] = useState('');

  // Final Selection & WhatsApp Joining Modal
  const [isHiringModalOpen, setIsHiringModalOpen] = useState(false);
  const [candidateToHire, setCandidateToHire] = useState<StaffCandidate | null>(null);
  const [hireJoiningDate, setHireJoiningDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [hireReportingTime, setHireReportingTime] = useState('सुबह 9:30 बजे');
  const [hireSupervisor, setHireSupervisor] = useState('प्रबंधक / मालिक');
  const [hireRequiredDocs, setHireRequiredDocs] = useState('आधार कार्ड ओरिजिनल व कॉपी, 2 पासपोर्ट फोटो, बैंक पासबुक');
  const [copiedWhatsappText, setCopiedWhatsappText] = useState(false);

  // Form State
  const [formStep, setFormStep] = useState<1 | 2 | 3 | 4>(1);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [currentAddress, setCurrentAddress] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [qualification, setQualification] = useState<StaffCandidate['qualification']>('10th_pass');
  const [qualificationDetails, setQualificationDetails] = useState('');
  
  // Past Experience
  const [hasPastExperience, setHasPastExperience] = useState(false);
  const [firstJobStartedYear, setFirstJobStartedYear] = useState('');
  const [previousEmployer, setPreviousEmployer] = useState('');
  const [prevRole, setPrevRole] = useState('');
  const [durationMonths, setDurationMonths] = useState<number | ''>('');
  const [lastDrawnSalary, setLastDrawnSalary] = useState<number | ''>('');
  const [reasonForLeaving, setReasonForLeaving] = useState('');
  const [referenceContactName, setReferenceContactName] = useState('');
  const [referenceContactPhone, setReferenceContactPhone] = useState('');

  // Work Terms & Leaves
  const [targetRole, setTargetRole] = useState('');
  const [department, setDepartment] = useState('');
  const [workResponsibilities, setWorkResponsibilities] = useState('');
  const [wageModel, setWageModel] = useState<CandidateWorkTerms['wageModel']>('monthly_fixed');
  const [proposedSalary, setProposedSalary] = useState<number | ''>('');
  const [paymentSchedule, setPaymentSchedule] = useState<CandidateWorkTerms['paymentSchedule']>('monthly');
  const [salaryPaymentDate, setSalaryPaymentDate] = useState('प्रत्येक माह की 7 तारीख');
  const [workShiftTimings, setWorkShiftTimings] = useState('सुबह 9:00 से शाम 8:00');
  const [weeklyOffDay, setWeeklyOffDay] = useState('रविवार');
  const [allowedPaidLeaves, setAllowedPaidLeaves] = useState<number>(2);
  const [maxConsecutiveLeaves, setMaxConsecutiveLeaves] = useState<number>(2);
  const [deductLeaveSalary, setDeductLeaveSalary] = useState(true);
  const [noticePeriodDays, setNoticePeriodDays] = useState<number>(15);
  const [advancePolicy, setAdvancePolicy] = useState('15 दिन कार्य उपरांत ही अधिकतम 50% एडवांस देय होगा');

  // KYC Checklist
  const [aadharNumber, setAadharNumber] = useState('');
  const [hasAadharCopy, setHasAadharCopy] = useState(false);
  const [panNumber, setPanNumber] = useState('');
  const [hasPanCopy, setHasPanCopy] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [hasPoliceVerification, setHasPoliceVerification] = useState(false);
  const [hasAddressProof, setHasAddressProof] = useState(false);
  const [drivingLicense, setDrivingLicense] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [upiId, setUpiId] = useState('');

  const resetForm = () => {
    setFormStep(1);
    setFullName('');
    setPhone('');
    setWhatsapp('');
    setDob('');
    setGender('male');
    setCurrentAddress('');
    setPermanentAddress('');
    setQualification('10th_pass');
    setQualificationDetails('');
    setHasPastExperience(false);
    setFirstJobStartedYear('');
    setPreviousEmployer('');
    setPrevRole('');
    setDurationMonths('');
    setLastDrawnSalary('');
    setReasonForLeaving('');
    setReferenceContactName('');
    setReferenceContactPhone('');
    setTargetRole('');
    setDepartment('');
    setWorkResponsibilities('');
    setWageModel('monthly_fixed');
    setProposedSalary('');
    setPaymentSchedule('monthly');
    setSalaryPaymentDate('प्रत्येक माह की 7 तारीख');
    setWorkShiftTimings('सुबह 9:00 से शाम 8:00');
    setWeeklyOffDay('रविवार');
    setAllowedPaidLeaves(2);
    setMaxConsecutiveLeaves(2);
    setDeductLeaveSalary(true);
    setNoticePeriodDays(15);
    setAdvancePolicy('15 दिन कार्य उपरांत ही अधिकतम 50% एडवांस देय होगा');
    setAadharNumber('');
    setHasAadharCopy(false);
    setPanNumber('');
    setHasPanCopy(false);
    setHasPhoto(false);
    setHasPoliceVerification(false);
    setHasAddressProof(false);
    setDrivingLicense('');
    setBankAccountNumber('');
    setBankIfsc('');
    setUpiId('');
  };

  const handleSaveCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !targetRole) {
      alert('कृपया उम्मीदवार का नाम, फोन और पद अनिवार्य रूप से भरें।');
      return;
    }

    const newCandidate: StaffCandidate = {
      id: `cand-${Date.now()}`,
      fullName,
      phone,
      whatsapp: whatsapp || phone,
      dob,
      gender,
      currentAddress,
      permanentAddress: permanentAddress || currentAddress,
      qualification,
      qualificationDetails,
      hasPastExperience,
      pastExperience: hasPastExperience ? {
        firstJobStartedYear,
        previousEmployer,
        role: prevRole,
        durationMonths: Number(durationMonths) || 0,
        lastDrawnSalary: Number(lastDrawnSalary) || 0,
        reasonForLeaving,
        referenceContactName,
        referenceContactPhone
      } : undefined,
      workTerms: {
        targetRole,
        department,
        workResponsibilities: workResponsibilities || 'दुकान/प्रतिष्ठान के निर्देशानुसार दैनिक कार्य।',
        wageModel,
        proposedSalary: Number(proposedSalary) || 0,
        paymentSchedule,
        salaryPaymentDate,
        workShiftTimings,
        weeklyOffDay,
        allowedPaidLeaves: Number(allowedPaidLeaves) || 0,
        maxConsecutiveLeaves: Number(maxConsecutiveLeaves) || 1,
        deductLeaveSalary,
        noticePeriodDays: Number(noticePeriodDays) || 15,
        advancePolicy
      },
      kyc: {
        aadharNumber,
        hasAadharCopy,
        panNumber,
        hasPanCopy,
        hasPhoto,
        hasPoliceVerification,
        hasAddressProof,
        drivingLicense,
        bankAccountNumber,
        bankIfsc,
        upiId
      },
      status: 'applied',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    setCandidates(prev => [newCandidate, ...prev]);
    setIsAddModalOpen(false);
    resetForm();
  };

  // Add Dynamic Stage
  const handleAddNewStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStageName.trim()) return;

    const stageId = `stg_${Date.now()}`;
    const newStage: RecruitmentStage = {
      id: stageId,
      label: newStageName.trim(),
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    };

    setStages(prev => {
      // Insert before rejected
      const rejectedIdx = prev.findIndex(s => s.id === 'rejected');
      if (rejectedIdx !== -1) {
        const copy = [...prev];
        copy.splice(rejectedIdx, 0, newStage);
        return copy;
      }
      return [...prev, newStage];
    });

    setNewStageName('');
    setIsNewStageModalOpen(false);
  };

  // Move candidate to any stage (Dropdown / Quick Action)
  const handleMoveCandidateStage = (candidateId: string, stageId: string) => {
    if (stageId === 'hired') {
      const cand = candidates.find(c => c.id === candidateId);
      if (cand) {
        setCandidateToHire(cand);
        setHireJoiningDate(cand.workTerms.joiningDate || new Date().toISOString().split('T')[0]);
        setHireReportingTime(cand.workTerms.reportingTime || 'सुबह 9:30 बजे');
        setHireSupervisor(cand.workTerms.reportingSupervisor || 'प्रबंधक / मालिक');
        setIsHiringModalOpen(true);
        return;
      }
    }

    setCandidates(prev => prev.map(c => {
      if (c.id !== candidateId) return c;
      return { ...c, status: stageId };
    }));

    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate(prev => prev ? { ...prev, status: stageId } : null);
    }
  };

  // Complete Final Selection & Sync with Active Payroll
  const handleConfirmFinalSelection = () => {
    if (!candidateToHire) return;

    const updatedCand: StaffCandidate = {
      ...candidateToHire,
      status: 'hired',
      hiredDate: new Date().toISOString().split('T')[0],
      workTerms: {
        ...candidateToHire.workTerms,
        joiningDate: hireJoiningDate,
        reportingTime: hireReportingTime,
        reportingSupervisor: hireSupervisor,
        requiredDocsAtJoining: hireRequiredDocs
      }
    };

    setCandidates(prev => prev.map(c => c.id === updatedCand.id ? updatedCand : c));
    if (selectedCandidate && selectedCandidate.id === updatedCand.id) {
      setSelectedCandidate(updatedCand);
    }

    // Auto-sync into Active Staff & Payroll (fwa_staff_v1)
    syncToActivePayroll(updatedCand);
    setIsHiringModalOpen(false);
  };

  // 1-Click Sync to Active Household/Business Staff (fwa_staff_v1)
  const syncToActivePayroll = (cand: StaffCandidate) => {
    try {
      const existing = localStorage.getItem('fwa_staff_v1');
      let staffList: any[] = [];
      if (existing) {
        staffList = JSON.parse(existing);
      }

      const alreadyPresent = staffList.find(s => s.phone === cand.phone || s.id === cand.id);
      if (!alreadyPresent) {
        const newStaffMember = {
          id: cand.id,
          name: cand.fullName,
          role: cand.workTerms.targetRole.toLowerCase().includes('cook') ? 'cook'
                : cand.workTerms.targetRole.toLowerCase().includes('driver') ? 'driver'
                : cand.workTerms.targetRole.toLowerCase().includes('guard') ? 'guard'
                : 'shop_helper',
          monthlySalary: cand.workTerms.proposedSalary || 10000,
          advanceTaken: 0,
          phone: cand.phone,
          joiningDate: cand.workTerms.joiningDate || new Date().toISOString().split('T')[0],
          aadharNumber: cand.kyc.aadharNumber || '',
          currentAddress: cand.currentAddress || '',
          permanentAddress: cand.permanentAddress || '',
          wageModel: cand.workTerms.wageModel === 'daily_wage' ? 'daily_wage' : 'monthly_with_allowed_leaves',
          dailyRate: cand.workTerms.wageModel === 'daily_wage' ? cand.workTerms.proposedSalary : Math.round((cand.workTerms.proposedSalary || 10000) / 30),
          allowedPaidLeaves: cand.workTerms.allowedPaidLeaves ?? 2,
          deductLeaveSalary: cand.workTerms.deductLeaveSalary ?? true,
          attendance: {},
          monthlyAttendance: {
            [new Date().toISOString().substring(0, 7)]: {}
          },
          salaryHistory: []
        };
        const updatedList = [newStaffMember, ...staffList];
        localStorage.setItem('fwa_staff_v1', JSON.stringify(updatedList));
      }
    } catch (err) {
      console.error('Error syncing staff to payroll:', err);
    }
  };

  // Generate WhatsApp Selection Message
  const getWhatsappSelectionText = (cand: StaffCandidate) => {
    return (
      `🎉 *बधाई! आपका चयन हो गया है (Selection Confirmation)*\n\n` +
      `प्रिय *${cand.fullName}* जी,\n` +
      `हमें आपको सूचित करते हुए अत्यंत प्रसन्नता है कि हमारी फर्म में आपका चयन *${cand.workTerms.targetRole}* पद हेतु कर लिया गया है।\n\n` +
      `📌 *जॉइनिंग एवं सेवा शर्तें:*\n` +
      `• पद: ${cand.workTerms.targetRole}\n` +
      `• तय वेतन: ₹${cand.workTerms.proposedSalary.toLocaleString('en-IN')}/${cand.workTerms.wageModel === 'daily_wage' ? 'दिन' : 'माह'}\n` +
      `• काम शुरू करने की तारीख (Joining Date): *${hireJoiningDate || cand.workTerms.joiningDate || 'शीघ्र'}*\n` +
      `• रिपोर्टिंग समय: ${hireReportingTime || 'सुबह 9:30 बजे'}\n` +
      `• कार्य समय: ${cand.workTerms.workShiftTimings}\n` +
      `• साप्ताहिक अवकाश: ${cand.workTerms.weeklyOffDay}\n` +
      `• रिपोर्टिंग अधिकारी: ${hireSupervisor}\n\n` +
      `📑 *जॉइनिंग के समय साथ लाने वाले दस्तावेज़:*\n` +
      `1. आधार कार्ड (मूल व फोटोकॉपी)\n` +
      `2. पासपोर्ट साइज फोटो (2)\n` +
      `3. बैंक खाता / पासबुक कॉपी (वेतन भुगतान हेतु)\n\n` +
      `कृपया नियत समय पर उपस्थित होकर अपनी सेवा प्रारंभ करें। किसी भी सहायता हेतु संपर्क करें: ${cand.phone}।\n\nशुभकामनाएं!`
    );
  };

  const handleSendWhatsappSelection = (cand: StaffCandidate) => {
    const text = encodeURIComponent(getWhatsappSelectionText(cand));
    const targetPhone = cand.whatsapp || cand.phone;
    window.open(`https://api.whatsapp.com/send?phone=91${targetPhone}&text=${text}`, '_blank');
  };

  const handleCopyWhatsappText = (cand: StaffCandidate) => {
    navigator.clipboard.writeText(getWhatsappSelectionText(cand));
    setCopiedWhatsappText(true);
    setTimeout(() => setCopiedWhatsappText(false), 2500);
  };

  // Filtered List
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const matchesTab = activeTab === 'all' ? true : c.status === activeTab;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q || 
        c.fullName.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.workTerms.targetRole.toLowerCase().includes(q) ||
        c.currentAddress.toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    });
  }, [candidates, activeTab, searchQuery]);

  // Stage Map
  const stageMap = useMemo(() => {
    const map = new Map<string, RecruitmentStage>();
    stages.forEach(s => map.set(s.id, s));
    return map;
  }, [stages]);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-navy via-navy-light to-navy border border-gold/30 rounded-2xl p-4 sm:p-5 text-paper">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-gold/20 text-gold rounded-xl">
                <UserCheck size={20} />
              </span>
              <h2 className="text-lg font-bold text-paper flex items-center gap-2">
                स्टाफ भर्ती, मल्टी-स्टेज चयन व ऑनबोर्डिंग ERP
                <span className="text-[10px] bg-gold text-navy font-bold px-2 py-0.5 rounded-full">
                  Hire-to-Pay Pipeline
                </span>
              </h2>
            </div>
            <p className="text-xs text-paper/80 leading-relaxed max-w-2xl">
              योग्य स्टाफ की खोज, कस्टम इंटरव्यू राउंड्स (Round 1, 2, स्किल टेस्ट), कब से स्टार्ट करना है (Joining Date), व्हाट्सएप सिलेक्शन लेटर और 1-क्लिक पेरोल ट्रांसफर।
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsNewStageModalOpen(true)}
              className="px-3.5 py-2.5 bg-paper/10 border border-paper/20 text-gold-soft hover:text-gold font-bold text-xs rounded-xl hover:bg-paper/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Layers size={14} />
              <span>+ नया स्टेज बनाएं</span>
            </button>

            <button
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true);
              }}
              className="px-4 py-2.5 bg-gold text-navy font-bold text-xs rounded-xl shadow hover:bg-gold-light transition flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus size={15} />
              <span>+ नया स्टाफ भर्ती फॉर्म</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Stage Tabs Switcher */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'all'
                ? 'bg-navy text-gold-soft shadow-sm'
                : 'bg-paper text-ink-muted hover:bg-paper-dim border border-paper-dim'
            }`}
          >
            सभी उम्मीदवार ({candidates.length})
          </button>

          {stages.map(stage => {
            const count = candidates.filter(c => c.status === stage.id).length;
            const isActive = activeTab === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveTab(stage.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-navy text-gold-soft shadow-sm'
                    : 'bg-paper text-ink-muted hover:bg-paper-dim border border-paper-dim'
                }`}
              >
                <span>{stage.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-gold text-navy font-bold' : 'bg-paper-dim text-ink'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-2.5 text-ink-muted" />
          <input
            type="text"
            placeholder="उम्मीदवार का नाम, फोन या पद खोजें..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:border-navy"
          />
        </div>
      </div>

      {/* Candidate List Cards */}
      {filteredCandidates.length === 0 ? (
        <div className="bg-paper border border-paper-dim rounded-2xl p-8 text-center space-y-2">
          <UserCheck size={36} className="mx-auto text-ink-muted opacity-40" />
          <p className="text-sm font-bold text-ink">इस स्टेज में कोई उम्मीदवार नहीं मिला</p>
          <p className="text-xs text-ink-muted max-w-sm mx-auto">
            उम्मीदवारों को इस स्टेज में लाने के लिए उनके कार्ड पर दिए गए "स्टेज बदलें" ड्रॉपडाउन का उपयोग करें।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredCandidates.map(candidate => {
            const currentStage = stageMap.get(candidate.status) || {
              id: candidate.status,
              label: candidate.status,
              color: 'bg-slate-100 text-slate-700 border-slate-300'
            };

            return (
              <div 
                key={candidate.id}
                className="bg-paper border border-paper-dim rounded-2xl p-4 shadow-sm hover:border-gold/50 transition space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-ink">{candidate.fullName}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentStage.color}`}>
                        {currentStage.label}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-gold-dark flex items-center gap-1.5">
                      <Briefcase size={12} />
                      <span>{candidate.workTerms.targetRole}</span>
                      {candidate.workTerms.department && (
                        <span className="text-ink-muted font-normal">• {candidate.workTerms.department}</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-ink">
                      <Mono>₹{candidate.workTerms.proposedSalary.toLocaleString('en-IN')}</Mono>
                      <span className="text-[10px] font-normal text-ink-muted">
                        /{candidate.workTerms.wageModel === 'daily_wage' ? 'दिन' : 'माह'}
                      </span>
                    </div>
                    <span className="text-[10px] text-ink-muted block">
                      {candidate.workTerms.wageModel === 'daily_wage' ? 'दैनिक मजदूरी' : 'मासिक वेतन'}
                    </span>
                  </div>
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-paper-dim/40 p-2.5 rounded-xl border border-paper-dim/60">
                  <div>
                    <span className="text-[10px] text-ink-muted block">शैक्षणिक योग्यता</span>
                    <span className="font-semibold text-ink">
                      {candidate.qualification.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-muted block">पिछला अनुभव</span>
                    <span className="font-semibold text-ink">
                      {candidate.hasPastExperience 
                        ? `${candidate.pastExperience?.durationMonths || 12} माह (${candidate.pastExperience?.role || 'अनुभवी'})` 
                        : 'फ्रेशर'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-muted block">कार्य समय व शिफ्ट</span>
                    <span className="font-medium text-ink truncate block">
                      {candidate.workTerms.workShiftTimings}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-muted block">साप्ताहिक अवकाश</span>
                    <span className="font-medium text-ink">
                      {candidate.workTerms.weeklyOffDay} ({candidate.workTerms.allowedPaidLeaves} दिन Paid)
                    </span>
                  </div>
                </div>

                {/* Joining Details if Hired */}
                {candidate.status === 'hired' && candidate.workTerms.joiningDate && (
                  <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-700 block">काम शुरू करने की तारीख (Joining):</span>
                      <span className="font-bold">{candidate.workTerms.joiningDate} ({candidate.workTerms.reportingTime || 'सुबह 9:30'})</span>
                    </div>
                    <button
                      onClick={() => handleSendWhatsappSelection(candidate)}
                      className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-700"
                    >
                      <Send size={11} />
                      <span>WhatsApp स्लिप</span>
                    </button>
                  </div>
                )}

                {/* Stage Selector Dropdown */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] font-bold text-ink-muted">स्टेज बदलें:</span>
                  <div className="relative flex-1 max-w-[240px]">
                    <select
                      value={candidate.status}
                      onChange={e => handleMoveCandidateStage(candidate.id, e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs font-semibold text-ink focus:outline-none focus:border-navy cursor-pointer"
                    >
                      {stages.map(stg => (
                        <option key={stg.id} value={stg.id}>
                          {stg.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Bottom Bar Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-paper-dim">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${candidate.phone}`}
                      className="px-2.5 py-1.5 bg-paper border border-paper-dim rounded-lg text-xs font-semibold text-ink hover:bg-paper-dim flex items-center gap-1"
                    >
                      <Phone size={12} className="text-emerald-600" />
                      <span>कॉल</span>
                    </a>

                    <button
                      onClick={() => {
                        setCandidateForOffer(candidate);
                        setIsOfferLetterOpen(true);
                      }}
                      className="px-2.5 py-1.5 bg-paper border border-paper-dim rounded-lg text-xs font-semibold text-navy hover:bg-paper-dim flex items-center gap-1 cursor-pointer"
                    >
                      <FileText size={12} className="text-gold-dark" />
                      <span>जॉइनिंग पत्र</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedCandidate(candidate)}
                    className="px-3 py-1.5 bg-navy text-gold-soft rounded-lg text-xs font-bold hover:bg-navy-light flex items-center gap-1 cursor-pointer"
                  >
                    <span>विस्तार व फाइल</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================
          MODAL 1: ADD NEW STAGE (DYNAMIC STAGE CREATION)
         ======================================================== */}
      {isNewStageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm">
          <div className="bg-paper border border-paper-dim rounded-2xl w-full max-w-md shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-gold" />
                <h3 className="text-sm font-bold text-ink">नया इंटरव्यू / चयन स्टेज बनाएं</h3>
              </div>
              <button onClick={() => setIsNewStageModalOpen(false)} className="text-ink-muted hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-ink-muted leading-relaxed">
              अपनी ज़रूरत के अनुसार नया राउंड जोड़ें (जैसे: "मशीन ऑपरेटर स्किल टेस्ट", "दुकानदार फाइनल राउंड", "ड्राइविंग टेस्ट" आदि)। यह तुरंत ऊपर फ़िल्टर टैब व ड्रॉपडाउन में उपलब्ध हो जाएगा।
            </p>

            <form onSubmit={handleAddNewStage} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-ink block mb-1">
                  स्टेज का नाम (Stage Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="जैसे: राउंड 3: व्यावहारिक काम टेस्ट"
                  value={newStageName}
                  onChange={e => setNewStageName(e.target.value)}
                  className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink focus:outline-none focus:border-navy"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewStageModalOpen(false)}
                  className="px-4 py-2 bg-paper border border-paper-dim text-xs font-bold text-ink rounded-xl"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-navy text-gold-soft text-xs font-bold rounded-xl shadow"
                >
                  स्टेज सुरक्षित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: FINAL SELECTION, JOINING DATE & WHATSAPP SLIP
         ======================================================== */}
      {isHiringModalOpen && candidateToHire && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-paper border border-paper-dim rounded-2xl w-full max-w-lg my-6 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <div>
                  <h3 className="text-sm font-bold text-ink">अंतिम चयन व जॉइनिंग कन्फर्मेशन</h3>
                  <p className="text-[11px] text-ink-muted">{candidateToHire.fullName} • {candidateToHire.workTerms.targetRole}</p>
                </div>
              </div>
              <button onClick={() => setIsHiringModalOpen(false)} className="text-ink-muted hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-ink block mb-1">
                    कब से काम शुरू करना है (Joining Date) *
                  </label>
                  <input
                    type="date"
                    required
                    value={hireJoiningDate}
                    onChange={e => setHireJoiningDate(e.target.value)}
                    className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink focus:outline-none focus:border-navy"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink block mb-1">
                    रिपोर्टिंग समय (Reporting Time)
                  </label>
                  <input
                    type="text"
                    value={hireReportingTime}
                    onChange={e => setHireReportingTime(e.target.value)}
                    className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink block mb-1">
                  किसको रिपोर्ट करना है (Supervisor / Contact Person)
                </label>
                <input
                  type="text"
                  value={hireSupervisor}
                  onChange={e => setHireSupervisor(e.target.value)}
                  className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink block mb-1">
                  पहले दिन साथ लाने वाले दस्तावेज़
                </label>
                <input
                  type="text"
                  value={hireRequiredDocs}
                  onChange={e => setHireRequiredDocs(e.target.value)}
                  className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                />
              </div>

              {/* WhatsApp Message Preview */}
              <div className="bg-paper-dim/40 border border-paper-dim p-3 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-ink-muted uppercase">व्हाट्सएप सिलेक्शन लेटर प्रीव्यू</span>
                  <button
                    onClick={() => handleCopyWhatsappText(candidateToHire)}
                    className="text-[11px] text-navy font-bold flex items-center gap-1 hover:underline"
                  >
                    {copiedWhatsappText ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                    <span>{copiedWhatsappText ? 'कॉपी हो गया' : 'टेक्स्ट कॉपी करें'}</span>
                  </button>
                </div>
                <div className="bg-paper p-2.5 rounded-lg border border-paper-dim text-[11px] font-sans text-ink leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto">
                  {getWhatsappSelectionText(candidateToHire)}
                </div>
              </div>

              {/* WhatsApp Send Action */}
              <button
                onClick={() => handleSendWhatsappSelection(candidateToHire)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow cursor-pointer"
              >
                <Send size={14} />
                <span>उम्मीदवार को सीधे WhatsApp पर सिलेक्शन लेटर भेजें</span>
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-paper-dim">
              <button
                type="button"
                onClick={() => setIsHiringModalOpen(false)}
                className="px-4 py-2 bg-paper border border-paper-dim text-xs font-bold text-ink rounded-xl"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={handleConfirmFinalSelection}
                className="px-5 py-2 bg-navy text-gold-soft text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
              >
                <CheckCircle2 size={14} />
                <span>नियुक्त करें व एक्टिव पेरोल में जोड़ें</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: ADD NEW STAFF CANDIDATE FORM (4-STEP)
         ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-paper border border-paper-dim rounded-2xl w-full max-w-2xl my-6 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-5 py-3.5 bg-navy text-paper flex items-center justify-between border-b border-gold/20">
              <div className="flex items-center gap-2">
                <UserPlus size={18} className="text-gold" />
                <h3 className="text-sm font-bold">नया स्टाफ भर्ती व जॉइनिंग फॉर्म</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-paper/70 hover:text-paper p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-4 bg-paper-dim/40 border-b border-paper-dim text-xs font-semibold text-center py-2">
              <button 
                onClick={() => setFormStep(1)}
                className={`py-1 ${formStep === 1 ? 'text-navy font-bold border-b-2 border-navy' : 'text-ink-muted'}`}
              >
                1. व्यक्तिगत पहचान
              </button>
              <button 
                onClick={() => setFormStep(2)}
                className={`py-1 ${formStep === 2 ? 'text-navy font-bold border-b-2 border-navy' : 'text-ink-muted'}`}
              >
                2. शिक्षा व अनुभव
              </button>
              <button 
                onClick={() => setFormStep(3)}
                className={`py-1 ${formStep === 3 ? 'text-navy font-bold border-b-2 border-navy' : 'text-ink-muted'}`}
              >
                3. काम, सैलरी व छुट्टी
              </button>
              <button 
                onClick={() => setFormStep(4)}
                className={`py-1 ${formStep === 4 ? 'text-navy font-bold border-b-2 border-navy' : 'text-ink-muted'}`}
              >
                4. दस्तावेज व KYC
              </button>
            </div>

            <form onSubmit={handleSaveCandidate} className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* STEP 1 */}
              {formStep === 1 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">
                        पूरा नाम (Candidate Full Name) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="जैसे: रमेश कुमार साहू"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink focus:outline-none focus:border-navy"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">
                        मोबाइल नंबर (Phone Number) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="10 अंकों का मोबाइल नंबर"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink focus:outline-none focus:border-navy"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">व्हाट्सएप नंबर</label>
                      <input
                        type="tel"
                        placeholder="WhatsApp नंबर"
                        value={whatsapp}
                        onChange={e => setWhatsapp(e.target.value)}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">जन्म तिथि (DOB)</label>
                      <input
                        type="date"
                        value={dob}
                        onChange={e => setDob(e.target.value)}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">लिंग (Gender)</label>
                      <select
                        value={gender}
                        onChange={e => setGender(e.target.value as any)}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                      >
                        <option value="male">पुरुष (Male)</option>
                        <option value="female">महिला (Female)</option>
                        <option value="other">अन्य</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">
                        स्थानीय / वर्तमान पता (Current Local Address) *
                      </label>
                      <textarea
                        rows={2}
                        placeholder="वर्तमान में शहर में कहाँ रहते हैं (मकान नं, मोहल्ला, लैंडमार्क)"
                        value={currentAddress}
                        onChange={e => setCurrentAddress(e.target.value)}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink focus:outline-none focus:border-navy"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">
                        स्थायी / मूल गाँव का पता (Permanent / Native Address)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="यदि बाहर के हैं तो मूल गाँव, पोस्ट, तहसील, जिला"
                        value={permanentAddress}
                        onChange={e => setPermanentAddress(e.target.value)}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink focus:outline-none focus:border-navy"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      type="button"
                      onClick={() => setFormStep(2)}
                      className="px-4 py-2 bg-navy text-gold-soft font-bold text-xs rounded-xl flex items-center gap-1.5"
                    >
                      <span>अगला: शिक्षा व अनुभव</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {formStep === 2 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">
                        शैक्षणिक योग्यता (Education Level)
                      </label>
                      <select
                        value={qualification}
                        onChange={e => setQualification(e.target.value as any)}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink focus:outline-none focus:border-navy"
                      >
                        <option value="illiterate">अनपढ़ / सामान्य साक्षर</option>
                        <option value="8th_pass">8वीं पास</option>
                        <option value="10th_pass">10वीं पास</option>
                        <option value="12th_pass">12वीं पास</option>
                        <option value="iti_diploma">आईटीआई / डिप्लोमा</option>
                        <option value="graduate">ग्रेजुएट (स्नातक)</option>
                        <option value="post_graduate">पोस्ट ग्रेजुएट</option>
                        <option value="skilled_artisan">कुशल कारीगर / हुनरमंद</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">
                        अतिरिक्त हुनर / कम्प्यूटर ज्ञान
                      </label>
                      <input
                        type="text"
                        placeholder="जैसे: टैली, ड्राइविंग, इलेक्ट्रिक काम, खाना बनाना"
                        value={qualificationDetails}
                        onChange={e => setQualificationDetails(e.target.value)}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-paper-dim/40 rounded-xl border border-paper-dim space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasPastExperience}
                        onChange={e => setHasPastExperience(e.target.checked)}
                        className="w-4 h-4 accent-navy rounded"
                      />
                      <span className="text-xs font-bold text-ink">
                        क्या उम्मीदवार के पास पहले का काम का अनुभव है? (Past Experience)
                      </span>
                    </label>

                    {hasPastExperience && (
                      <div className="space-y-3 pt-2 border-t border-paper-dim">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-ink block mb-1">
                              पहला काम कब और कहाँ से शुरू किया था?
                            </label>
                            <input
                              type="text"
                              placeholder="जैसे: 2020 में कपड़ा दुकान से"
                              value={firstJobStartedYear}
                              onChange={e => setFirstJobStartedYear(e.target.value)}
                              className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-ink block mb-1">
                              पिछली फर्म / दुकान / मालिक का नाम
                            </label>
                            <input
                              type="text"
                              placeholder="जैसे: माँ जगदंबा ट्रेडर्स"
                              value={previousEmployer}
                              onChange={e => setPreviousEmployer(e.target.value)}
                              className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-ink block mb-1">पिछला पद</label>
                            <input
                              type="text"
                              placeholder="सेल्समैन / हेल्पर"
                              value={prevRole}
                              onChange={e => setPrevRole(e.target.value)}
                              className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-ink block mb-1">समय (महीने)</label>
                            <input
                              type="number"
                              placeholder="जैसे: 24"
                              value={durationMonths}
                              onChange={e => setDurationMonths(e.target.value ? Number(e.target.value) : '')}
                              className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-ink block mb-1">अंतिम सैलरी (₹)</label>
                            <input
                              type="number"
                              placeholder="जैसे: 12000"
                              value={lastDrawnSalary}
                              onChange={e => setLastDrawnSalary(e.target.value ? Number(e.target.value) : '')}
                              className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-ink block mb-1">
                            नौकरी छोड़ने का कारण
                          </label>
                          <input
                            type="text"
                            placeholder="कारण लिखें"
                            value={reasonForLeaving}
                            onChange={e => setReasonForLeaving(e.target.value)}
                            className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-ink block mb-1">रेफरेंस व्यक्ति नाम</label>
                            <input
                              type="text"
                              value={referenceContactName}
                              onChange={e => setReferenceContactName(e.target.value)}
                              className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-ink block mb-1">रेफरेंस फोन नंबर</label>
                            <input
                              type="tel"
                              value={referenceContactPhone}
                              onChange={e => setReferenceContactPhone(e.target.value)}
                              className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-3">
                    <button
                      type="button"
                      onClick={() => setFormStep(1)}
                      className="px-4 py-2 bg-paper border border-paper-dim text-ink text-xs font-bold rounded-xl"
                    >
                      पीछे
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormStep(3)}
                      className="px-4 py-2 bg-navy text-gold-soft font-bold text-xs rounded-xl flex items-center gap-1.5"
                    >
                      <span>अगला: काम, सैलरी व छुट्टी</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {formStep === 3 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">
                        किस पद / काम के लिए रख रहे हैं? *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="जैसे: सेल्समैन, ड्राइवर, कुक, हेल्पर"
                        value={targetRole}
                        onChange={e => setTargetRole(e.target.value)}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink focus:outline-none focus:border-navy"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">विभाग / शाखा</label>
                      <input
                        type="text"
                        placeholder="जैसे: मुख्य दुकान, गोदाम"
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">
                      दैनिक कार्य व जिम्मेदारियां (Job Description)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="दैनिक काम विवरण"
                      value={workResponsibilities}
                      onChange={e => setWorkResponsibilities(e.target.value)}
                      className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">वेतन मॉडल</label>
                      <select
                        value={wageModel}
                        onChange={e => setWageModel(e.target.value as any)}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                      >
                        <option value="monthly_fixed">मासिक तय वेतन (Monthly Fixed)</option>
                        <option value="daily_wage">दैनिक मजदूरी (Daily Wage)</option>
                        <option value="piece_rate">काम के हिसाब से (Piece-rate)</option>
                        <option value="commission">कमीशन / इन्सेंटिव बेस</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">प्रस्तावित वेतन (₹) *</label>
                      <input
                        type="number"
                        required
                        placeholder="जैसे: 14000"
                        value={proposedSalary}
                        onChange={e => setProposedSalary(e.target.value ? Number(e.target.value) : '')}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink font-bold text-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">सैलरी भुगतान तारीख</label>
                      <input
                        type="text"
                        value={salaryPaymentDate}
                        onChange={e => setSalaryPaymentDate(e.target.value)}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-paper-dim/40 rounded-xl border border-paper-dim space-y-2">
                    <h4 className="text-xs font-bold text-ink flex items-center gap-1.5">
                      <Clock size={14} className="text-gold-dark" />
                      <span>कार्य समय व छुट्टी के नियम</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-ink block mb-1">दुकान / कार्य समय (Shift)</label>
                        <input
                          type="text"
                          value={workShiftTimings}
                          onChange={e => setWorkShiftTimings(e.target.value)}
                          className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-ink block mb-1">साप्ताहिक अवकाश</label>
                        <input
                          type="text"
                          value={weeklyOffDay}
                          onChange={e => setWeeklyOffDay(e.target.value)}
                          className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-[11px] font-bold text-ink block mb-1">स्वीकृत सवेतन छुट्टी (Paid Leaves)</label>
                        <input
                          type="number"
                          value={allowedPaidLeaves}
                          onChange={e => setAllowedPaidLeaves(Number(e.target.value))}
                          className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-ink block mb-1">नोटिस पीरियड (दिन)</label>
                        <input
                          type="number"
                          value={noticePeriodDays}
                          onChange={e => setNoticePeriodDays(Number(e.target.value))}
                          className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-3">
                    <button
                      type="button"
                      onClick={() => setFormStep(2)}
                      className="px-4 py-2 bg-paper border border-paper-dim text-ink text-xs font-bold rounded-xl"
                    >
                      पीछे
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormStep(4)}
                      className="px-4 py-2 bg-navy text-gold-soft font-bold text-xs rounded-xl flex items-center gap-1.5"
                    >
                      <span>अगला: दस्तावेज व KYC</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {formStep === 4 && (
                <div className="space-y-3">
                  <div className="p-3 bg-paper-dim/40 rounded-xl border border-paper-dim space-y-3">
                    <h4 className="text-xs font-bold text-ink flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-emerald-600" />
                      <span>दस्तावेज़ संकलन चेकलिस्ट (Document Verification Checklist)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-ink block mb-1">आधार कार्ड नंबर</label>
                        <input
                          type="text"
                          placeholder="12 अंकों का आधार"
                          value={aadharNumber}
                          onChange={e => setAadharNumber(e.target.value)}
                          className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-ink block mb-1">पैन कार्ड नंबर</label>
                        <input
                          type="text"
                          placeholder="10 अंकों का पैन"
                          value={panNumber}
                          onChange={e => setPanNumber(e.target.value)}
                          className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer bg-paper p-2 rounded-lg border border-paper-dim">
                        <input
                          type="checkbox"
                          checked={hasAadharCopy}
                          onChange={e => setHasAadharCopy(e.target.checked)}
                          className="w-4 h-4 accent-navy rounded"
                        />
                        <span className="font-semibold text-ink">आधार कॉपी जमा</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer bg-paper p-2 rounded-lg border border-paper-dim">
                        <input
                          type="checkbox"
                          checked={hasPhoto}
                          onChange={e => setHasPhoto(e.target.checked)}
                          className="w-4 h-4 accent-navy rounded"
                        />
                        <span className="font-semibold text-ink">2 पासपोर्ट फोटो</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer bg-paper p-2 rounded-lg border border-paper-dim">
                        <input
                          type="checkbox"
                          checked={hasPoliceVerification}
                          onChange={e => setHasPoliceVerification(e.target.checked)}
                          className="w-4 h-4 accent-navy rounded"
                        />
                        <span className="font-semibold text-ink">पुलिस वेरिफिकेशन</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="text-[11px] font-bold text-ink block mb-1">ड्राइविंग लाइसेंस</label>
                        <input
                          type="text"
                          value={drivingLicense}
                          onChange={e => setDrivingLicense(e.target.value)}
                          className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-ink block mb-1">सैलरी खाता / UPI ID</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={e => setUpiId(e.target.value)}
                          className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-3">
                    <button
                      type="button"
                      onClick={() => setFormStep(3)}
                      className="px-4 py-2 bg-paper border border-paper-dim text-ink text-xs font-bold rounded-xl"
                    >
                      पीछे
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gold text-navy font-bold text-xs rounded-xl shadow hover:bg-gold-light transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 size={15} />
                      <span>उम्मीदवार आवेदन सुरक्षित करें</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: CANDIDATE DOSSIER
         ======================================================== */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-paper border border-paper-dim rounded-2xl w-full max-w-2xl my-6 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-5 py-3.5 bg-navy text-paper flex items-center justify-between border-b border-gold/20">
              <div className="flex items-center gap-2">
                <Briefcase size={18} className="text-gold" />
                <div>
                  <h3 className="text-sm font-bold">{selectedCandidate.fullName}</h3>
                  <p className="text-[11px] text-paper/70">
                    {selectedCandidate.workTerms.targetRole} • {selectedCandidate.phone}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="text-paper/70 hover:text-paper p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Stage Selector in Modal */}
              <div className="p-3 bg-paper-dim/40 rounded-xl border border-paper-dim flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-ink-muted uppercase font-bold block">वर्तमान स्टेज:</span>
                  <span className="font-bold text-navy text-sm">
                    {stageMap.get(selectedCandidate.status)?.label || selectedCandidate.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-ink">स्टेज बदलें:</span>
                  <select
                    value={selectedCandidate.status}
                    onChange={e => handleMoveCandidateStage(selectedCandidate.id, e.target.value)}
                    className="px-3 py-1.5 bg-paper border border-paper-dim rounded-xl font-bold text-navy focus:outline-none"
                  >
                    {stages.map(stg => (
                      <option key={stg.id} value={stg.id}>{stg.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dossier Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-paper border border-paper-dim p-3 rounded-xl space-y-1.5">
                  <span className="text-[10px] font-bold text-ink-muted uppercase block">स्थानीय व मूल पता</span>
                  <div className="text-ink">
                    <span className="font-semibold block">वर्तमान:</span> {selectedCandidate.currentAddress || 'एन/ए'}
                  </div>
                  <div className="text-ink">
                    <span className="font-semibold block">मूल गाँव:</span> {selectedCandidate.permanentAddress || 'एन/ए'}
                  </div>
                </div>

                <div className="bg-paper border border-paper-dim p-3 rounded-xl space-y-1.5">
                  <span className="text-[10px] font-bold text-ink-muted uppercase block">वेतन व कार्य समय</span>
                  <div className="text-ink flex justify-between">
                    <span>प्रस्तावित वेतन:</span>
                    <span className="font-bold text-gold-dark"><Mono>₹{selectedCandidate.workTerms.proposedSalary.toLocaleString('en-IN')}</Mono></span>
                  </div>
                  <div className="text-ink flex justify-between">
                    <span>कार्य शिफ्ट:</span>
                    <span>{selectedCandidate.workTerms.workShiftTimings}</span>
                  </div>
                  <div className="text-ink flex justify-between">
                    <span>साप्ताहिक छुट्टी:</span>
                    <span className="font-semibold text-emerald-700">{selectedCandidate.workTerms.weeklyOffDay}</span>
                  </div>
                </div>
              </div>

              {/* Past Experience Details */}
              {selectedCandidate.hasPastExperience && selectedCandidate.pastExperience && (
                <div className="bg-paper border border-paper-dim p-3.5 rounded-xl space-y-2">
                  <span className="text-[11px] font-bold text-ink flex items-center gap-1.5">
                    <Award size={14} className="text-gold" />
                    <span>पिछला कार्य अनुभव (Past Employment Record)</span>
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-ink-muted block">पहला काम कहाँ शुरू किया:</span>
                      <span className="font-semibold text-ink">{selectedCandidate.pastExperience.firstJobStartedYear || 'एन/ए'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-muted block">पिछली दुकान/फर्म:</span>
                      <span className="font-semibold text-ink">{selectedCandidate.pastExperience.previousEmployer}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-muted block">पिछली सैलरी:</span>
                      <span className="font-semibold text-ink"><Mono>₹{selectedCandidate.pastExperience.lastDrawnSalary.toLocaleString('en-IN')}</Mono></span>
                    </div>
                  </div>
                  <div className="pt-1">
                    <span className="text-[10px] text-ink-muted block">नौकरी छोड़ने का कारण:</span>
                    <span className="text-ink">{selectedCandidate.pastExperience.reasonForLeaving || 'एन/ए'}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 py-3 bg-paper-dim/40 border-t border-paper-dim flex items-center justify-between">
              <button
                onClick={() => {
                  setCandidateForOffer(selectedCandidate);
                  setIsOfferLetterOpen(true);
                }}
                className="px-3 py-2 bg-navy text-gold-soft font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <FileText size={14} />
                <span>जॉइनिंग पत्र प्रिंट करें</span>
              </button>

              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 bg-paper border border-paper-dim text-ink font-bold rounded-xl cursor-pointer"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 5: PRINTABLE JOINING AGREEMENT / OFFER LETTER
         ======================================================== */}
      {isOfferLetterOpen && candidateForOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-paper border border-paper-dim rounded-2xl w-full max-w-xl my-6 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-5 py-3 bg-navy text-paper flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-gold" />
                <h3 className="text-sm font-bold">स्टाफ नियुक्ति व सहमति पत्र (Joining Letter)</h3>
              </div>
              <button onClick={() => setIsOfferLetterOpen(false)} className="text-paper/70 hover:text-paper">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-ink text-xs font-sans bg-white">
              <div className="text-center border-b pb-3 border-gray-200 space-y-1">
                <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide">
                  व्यापारिक प्रतिष्ठान / स्टाफ सेवा अनुबंध
                </h2>
                <p className="text-[11px] text-gray-600">(कर्मचारी नियुक्ति पत्र एवं सेवा नियम सहमति पत्र)</p>
                <p className="text-[10px] text-gray-500">तारीख: {new Date().toLocaleDateString('hi-IN')}</p>
              </div>

              <p>
                यह सहमति पत्र <strong>प्रतिष्ठान प्रबंधक</strong> एवं श्री/सुश्री <strong>{candidateForOffer.fullName}</strong> (फोन: {candidateForOffer.phone}) के मध्य निष्पादित किया जाता है।
              </p>

              <table className="w-full border-collapse border border-gray-300 text-[11px]">
                <tbody>
                  <tr className="border-b border-gray-300">
                    <td className="p-2 bg-gray-50 font-bold border-r border-gray-300 w-1/3">नियुक्त पद</td>
                    <td className="p-2 font-semibold text-gray-800">{candidateForOffer.workTerms.targetRole}</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="p-2 bg-gray-50 font-bold border-r border-gray-300">मासिक / दैनिक वेतन</td>
                    <td className="p-2 font-bold text-gray-900">
                      ₹{candidateForOffer.workTerms.proposedSalary.toLocaleString('en-IN')} ({candidateForOffer.workTerms.wageModel === 'daily_wage' ? 'प्रति दिन' : 'प्रति माह'})
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="p-2 bg-gray-50 font-bold border-r border-gray-300">काम शुरू करने की तारीख</td>
                    <td className="p-2 font-semibold text-emerald-800">{candidateForOffer.workTerms.joiningDate || 'तत्काल'}</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="p-2 bg-gray-50 font-bold border-r border-gray-300">दैनिक कार्य समय (Shift)</td>
                    <td className="p-2">{candidateForOffer.workTerms.workShiftTimings}</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="p-2 bg-gray-50 font-bold border-r border-gray-300">साप्ताहिक अवकाश</td>
                    <td className="p-2 font-semibold text-blue-700">{candidateForOffer.workTerms.weeklyOffDay}</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="p-2 bg-gray-50 font-bold border-r border-gray-300">सवेतन छुट्टी नियम</td>
                    <td className="p-2">
                      माह में अधिकतम {candidateForOffer.workTerms.allowedPaidLeaves} दिन सवेतन छुट्टी स्वीकृत। अतिरिक्त अनुपस्थिति पर वेतन कटौती लागू होगी।
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 bg-gray-50 font-bold border-r border-gray-300">आधार सत्यापन</td>
                    <td className="p-2">{candidateForOffer.kyc.aadharNumber || 'सत्यापित आधार संलग्न'}</td>
                  </tr>
                </tbody>
              </table>

              <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs">
                <div>
                  <div className="border-t border-gray-400 pt-1 font-bold">हस्ताक्षर: कर्मचारी / स्टाफ</div>
                  <div className="text-[10px] text-gray-500">({candidateForOffer.fullName})</div>
                </div>
                <div>
                  <div className="border-t border-gray-400 pt-1 font-bold">हस्ताक्षर व सील: फर्म / मालिक</div>
                  <div className="text-[10px] text-gray-500">(अधिकृत हस्ताक्षरकर्ता)</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-paper-dim/40 border-t border-paper-dim flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-navy text-gold-soft font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Printer size={15} />
                <span>प्रिंट / PDF सेव करें</span>
              </button>

              <button
                onClick={() => setIsOfferLetterOpen(false)}
                className="px-4 py-2 bg-paper border border-paper-dim text-ink font-bold rounded-xl cursor-pointer"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
