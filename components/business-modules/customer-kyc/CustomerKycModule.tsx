'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, Users, Store, Plus, Search, Filter, Phone, 
  CheckCircle2, Clock, X, AlertCircle, FileText, Printer, 
  Share2, ChevronRight, ShieldCheck, MapPin, Trash2, Edit3, 
  Send, ExternalLink, CreditCard, DollarSign, Briefcase, 
  Building, Check, Copy, AlertTriangle, ArrowRight, UserCheck
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

export type PartnerType = 'b2b_dealer' | 'distributor' | 'retailer' | 'franchise' | 'b2c_high_value';
export type EntityConstitution = 'proprietorship' | 'partnership' | 'pvt_ltd' | 'individual' | 'huf';
export type KycStatus = 'pending_review' | 'verified' | 'credit_approved' | 'active' | 'suspended_defaulter';

export interface CustomerKycRecord {
  id: string;
  partnerType: PartnerType;
  tradeName: string; // दुकान / फर्म का नाम
  legalEntityName?: string;
  constitution: EntityConstitution;
  gstin?: string;
  panNumber?: string;
  businessStartedYear?: string; // कब से काम शुरू किया है (वर्ष / अनुभव)
  
  // Business Premises & Address
  shopAddress: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  premisesType: 'owned' | 'rented';
  
  // Owner Personal KYC
  ownerName: string;
  ownerDob?: string;
  ownerPhone: string;
  ownerWhatsapp?: string;
  ownerEmail?: string;
  ownerAadhar?: string;
  ownerResidentialAddress?: string;
  
  // Trade & Products
  annualTurnoverBracket?: 'below_20L' | '20L_to_1Cr' | '1Cr_to_5Cr' | 'above_5Cr';
  dealingProducts?: string; // किन उत्पादों का काम करते हैं
  existingBrandsDealt?: string; // कौन से ब्रांड्स पहले से बेचते हैं
  
  // Credit & Financial Due Diligence
  requestedCreditLimit: number; // मांगी गई उधार सीमा
  approvedCreditLimit: number; // स्वीकृत उधार सीमा
  creditPaymentDays: number; // 7, 15, 30 दिन
  securityChequeGiven: boolean;
  securityChequeDetails?: string; // बैंक व चेक नंबर
  securityDepositAmount?: number;
  bankName?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  
  // Trade References
  reference1Name?: string;
  reference1Phone?: string;
  reference2Name?: string;
  reference2Phone?: string;
  
  // Status & Timestamps
  kycStatus: KycStatus;
  createdAt: string;
  verifiedAt?: string;
  notes?: string;
  isSelfSubmitted?: boolean; // क्या कस्टमर ने लिंक से खुद भरा है
}

const DEFAULT_RECORDS: CustomerKycRecord[] = [
  {
    id: 'kyc-001',
    partnerType: 'b2b_dealer',
    tradeName: 'श्री बालाजी हार्डवेयर व सेनेटरी स्टोर्स',
    legalEntityName: 'श्री बालाजी हार्डवेयर',
    constitution: 'proprietorship',
    gstin: '22AAAAA0000A1Z5',
    panNumber: 'ABCDE1234K',
    businessStartedYear: '2014 (12 वर्ष का अनुभव)',
    shopAddress: 'दुकान नंबर 14-15, लोहा बाजार, पुराना बस स्टैंड मार्ग',
    landmark: 'हनुमान मंदिर के सामने',
    city: 'बिलासपुर',
    state: 'छत्तीसगढ़',
    pincode: '495001',
    premisesType: 'owned',
    ownerName: 'महेश कुमार अग्रवाल',
    ownerDob: '1978-11-22',
    ownerPhone: '9827155667',
    ownerWhatsapp: '9827155667',
    ownerEmail: 'balaji.hardware@gmail.com',
    ownerAadhar: '5421 8899 1234',
    ownerResidentialAddress: 'फ्लैट 402, शांति हाइट्स, लिंक रोड, बिलासपुर',
    annualTurnoverBracket: '1Cr_to_5Cr',
    dealingProducts: 'पाइप, सेनेटरी वेयर, वाटर टैंक, सीपी फिटिंग्स व टाइल्स',
    existingBrandsDealt: 'एस्ट्रल, सुप्रीम, सेरा, एशियन पेंट्स',
    requestedCreditLimit: 300000,
    approvedCreditLimit: 200000,
    creditPaymentDays: 21,
    securityChequeGiven: true,
    securityChequeDetails: 'SBI चेक नं: 409182 (हस्ताक्षरित सुरक्षा चेक प्राप्त)',
    securityDepositAmount: 50000,
    bankName: 'भारतीय स्टेट बैंक (SBI)',
    bankAccountNumber: '38192049581',
    bankIfsc: 'SBIN0000345',
    reference1Name: 'गुप्ता जी स्टील ट्रेडर्स (श्री रमेश गुप्ता)',
    reference1Phone: '9827011223',
    reference2Name: 'केडिया पेंट्स एजेंसी (श्री विनोद केडिया)',
    reference2Phone: '9425233445',
    kycStatus: 'active',
    createdAt: '2026-09-20',
    verifiedAt: '2026-09-21',
    notes: 'बाजार में 12 साल पुरानी प्रतिष्ठित दुकान है। सभी चेक व आधार वेरिफाइड हैं।'
  },
  {
    id: 'kyc-002',
    partnerType: 'distributor',
    tradeName: 'जय अम्बे एग्रो व खाद बीज डिस्ट्रीब्यूटर्स',
    constitution: 'partnership',
    gstin: '22BBBBB1111B2Z6',
    businessStartedYear: '2018 (8 वर्ष)',
    shopAddress: 'मंडी गेट नंबर 2, कृषि उपज मंडी प्रांगण',
    city: 'मुंगेली',
    state: 'छत्तीसगढ़',
    pincode: '495334',
    premisesType: 'rented',
    ownerName: 'अजय कुमार जायसवाल',
    ownerDob: '1985-04-10',
    ownerPhone: '9425566778',
    ownerWhatsapp: '9425566778',
    ownerAadhar: '8910 2345 6789',
    ownerResidentialAddress: 'वार्ड 8, कॉलेज रोड, मुंगेली',
    annualTurnoverBracket: '1Cr_to_5Cr',
    dealingProducts: 'कीटनाशक, हाइब्रिड बीज, रासायनिक व जैविक खाद',
    existingBrandsDealt: 'इफको, बायर, टाटा रैलीज़',
    requestedCreditLimit: 500000,
    approvedCreditLimit: 350000,
    creditPaymentDays: 30,
    securityChequeGiven: true,
    securityChequeDetails: 'HDFC बैंक चेक नं: 002134',
    bankName: 'HDFC Bank',
    bankAccountNumber: '50200021948572',
    bankIfsc: 'HDFC0001234',
    reference1Name: 'छत्तीसगढ़ बीज निगम डीलर संघ',
    reference1Phone: '9893000000',
    kycStatus: 'credit_approved',
    createdAt: '2026-09-24',
    isSelfSubmitted: true
  }
];

export function CustomerKycModule() {
  const [records, setRecords] = useState<CustomerKycRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_customer_kyc_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return DEFAULT_RECORDS;
  });

  useEffect(() => {
    localStorage.setItem('fwa_customer_kyc_v1', JSON.stringify(records));
  }, [records]);

  // Tab & Filters
  const [activeTab, setActiveTab] = useState<'all' | KycStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | PartnerType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<CustomerKycRecord | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [recordForPrint, setRecordForPrint] = useState<CustomerKycRecord | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form Step State
  const [formStep, setFormStep] = useState<1 | 2 | 3 | 4>(1);
  const [partnerType, setPartnerType] = useState<PartnerType>('b2b_dealer');
  const [tradeName, setTradeName] = useState('');
  const [legalEntityName, setLegalEntityName] = useState('');
  const [constitution, setConstitution] = useState<EntityConstitution>('proprietorship');
  const [gstin, setGstin] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [businessStartedYear, setBusinessStartedYear] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('छत्तीसगढ़');
  const [pincode, setPincode] = useState('');
  const [premisesType, setPremisesType] = useState<'owned' | 'rented'>('owned');

  // Owner Details
  const [ownerName, setOwnerName] = useState('');
  const [ownerDob, setOwnerDob] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerWhatsapp, setOwnerWhatsapp] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerAadhar, setOwnerAadhar] = useState('');
  const [ownerResidentialAddress, setOwnerResidentialAddress] = useState('');

  // Trade Profile
  const [annualTurnoverBracket, setAnnualTurnoverBracket] = useState<CustomerKycRecord['annualTurnoverBracket']>('20L_to_1Cr');
  const [dealingProducts, setDealingProducts] = useState('');
  const [existingBrandsDealt, setExistingBrandsDealt] = useState('');

  // Credit & Financials
  const [requestedCreditLimit, setRequestedCreditLimit] = useState<number | ''>('');
  const [approvedCreditLimit, setApprovedCreditLimit] = useState<number | ''>('');
  const [creditPaymentDays, setCreditPaymentDays] = useState<number>(15);
  const [securityChequeGiven, setSecurityChequeGiven] = useState(false);
  const [securityChequeDetails, setSecurityChequeDetails] = useState('');
  const [securityDepositAmount, setSecurityDepositAmount] = useState<number | ''>('');
  const [bankName, setBankName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [reference1Name, setReference1Name] = useState('');
  const [reference1Phone, setReference1Phone] = useState('');
  const [reference2Name, setReference2Name] = useState('');
  const [reference2Phone, setReference2Phone] = useState('');
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setFormStep(1);
    setPartnerType('b2b_dealer');
    setTradeName('');
    setLegalEntityName('');
    setConstitution('proprietorship');
    setGstin('');
    setPanNumber('');
    setBusinessStartedYear('');
    setShopAddress('');
    setLandmark('');
    setCity('');
    setState('छत्तीसगढ़');
    setPincode('');
    setPremisesType('owned');
    setOwnerName('');
    setOwnerDob('');
    setOwnerPhone('');
    setOwnerWhatsapp('');
    setOwnerEmail('');
    setOwnerAadhar('');
    setOwnerResidentialAddress('');
    setAnnualTurnoverBracket('20L_to_1Cr');
    setDealingProducts('');
    setExistingBrandsDealt('');
    setRequestedCreditLimit('');
    setApprovedCreditLimit('');
    setCreditPaymentDays(15);
    setSecurityChequeGiven(false);
    setSecurityChequeDetails('');
    setSecurityDepositAmount('');
    setBankName('');
    setBankAccountNumber('');
    setBankIfsc('');
    setReference1Name('');
    setReference1Phone('');
    setReference2Name('');
    setReference2Phone('');
    setNotes('');
  };

  const handleSaveKyc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tradeName || !ownerName || !ownerPhone || !city) {
      alert('कृपया दुकान का नाम, मालिक का नाम, फोन और शहर अनिवार्य रूप से भरें।');
      return;
    }

    const newRecord: CustomerKycRecord = {
      id: `kyc-${Date.now()}`,
      partnerType,
      tradeName,
      legalEntityName: legalEntityName || tradeName,
      constitution,
      gstin: gstin.toUpperCase(),
      panNumber: panNumber.toUpperCase(),
      businessStartedYear,
      shopAddress,
      landmark,
      city,
      state,
      pincode,
      premisesType,
      ownerName,
      ownerDob,
      ownerPhone,
      ownerWhatsapp: ownerWhatsapp || ownerPhone,
      ownerEmail,
      ownerAadhar,
      ownerResidentialAddress,
      annualTurnoverBracket,
      dealingProducts,
      existingBrandsDealt,
      requestedCreditLimit: Number(requestedCreditLimit) || 0,
      approvedCreditLimit: Number(approvedCreditLimit) || Number(requestedCreditLimit) || 0,
      creditPaymentDays: Number(creditPaymentDays) || 15,
      securityChequeGiven,
      securityChequeDetails,
      securityDepositAmount: Number(securityDepositAmount) || 0,
      bankName,
      bankAccountNumber,
      bankIfsc,
      reference1Name,
      reference1Phone,
      reference2Name,
      reference2Phone,
      kycStatus: 'pending_review',
      createdAt: new Date().toISOString().split('T')[0],
      notes
    };

    setRecords(prev => [newRecord, ...prev]);
    setIsAddOpen(false);
    resetForm();
  };

  const handleUpdateStatus = (id: string, newStatus: KycStatus, updates?: Partial<CustomerKycRecord>) => {
    setRecords(prev => prev.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, kycStatus: newStatus, ...updates };
      if (newStatus === 'verified' || newStatus === 'credit_approved') {
        updated.verifiedAt = new Date().toISOString().split('T')[0];
      }
      return updated;
    }));

    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(prev => prev ? { ...prev, kycStatus: newStatus, ...updates } : null);
    }
  };

  // Filtered
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesTab = activeTab === 'all' ? true : r.kycStatus === activeTab;
      const matchesType = typeFilter === 'all' ? true : r.partnerType === typeFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q ||
        r.tradeName.toLowerCase().includes(q) ||
        r.ownerName.toLowerCase().includes(q) ||
        r.ownerPhone.includes(q) ||
        (r.gstin && r.gstin.toLowerCase().includes(q)) ||
        r.city.toLowerCase().includes(q);
      return matchesTab && matchesType && matchesQuery;
    });
  }, [records, activeTab, typeFilter, searchQuery]);

  // Counts
  const counts = useMemo(() => {
    return {
      all: records.length,
      pending: records.filter(r => r.kycStatus === 'pending_review').length,
      verified: records.filter(r => r.kycStatus === 'verified').length,
      credit_approved: records.filter(r => r.kycStatus === 'credit_approved').length,
      active: records.filter(r => r.kycStatus === 'active').length,
      defaulter: records.filter(r => r.kycStatus === 'suspended_defaulter').length,
      totalCreditLimit: records
        .filter(r => r.kycStatus === 'active' || r.kycStatus === 'credit_approved')
        .reduce((sum, r) => sum + (r.approvedCreditLimit || 0), 0)
    };
  }, [records]);

  // Share Link WhatsApp Message
  const getShareLink = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/customer-onboard`;
    }
    return 'https://yourapp.com/customer-onboard';
  };

  const handleCopyLink = () => {
    const link = getShareLink();
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSendWhatsappInvite = () => {
    const link = getShareLink();
    const text = encodeURIComponent(
      `*पार्टनर व डीलरशिप KYC ऑनबोर्डिंग फॉर्म*\n\n` +
      `नमस्कार जी, हमारी फर्म के साथ नया डीलरशिप / ग्राहक खाता खोलने व तुरंत क्रेडिट (उधार) लिमिट एक्टिवेट करने हेतु कृपया नीचे दिए गए लिंक पर 2 मिनट में अपनी दुकान व फर्म का विवरण भरें:\n\n` +
      `👉 फॉर्म लिंक: ${link}\n\n` +
      `आवश्यक जानकारी: दुकान का नाम, GST/PAN (यदि हो), मालिक का आधार व बैंक विवरण। फॉर्म सबमिट होते ही हमारी टीम इसे 24 घंटे में अप्रूव कर देगी।\n\nधन्यवाद!`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-navy via-navy-light to-navy border border-gold/30 rounded-2xl p-4 sm:p-5 text-paper">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-gold/20 text-gold rounded-xl">
                <Store size={20} />
              </span>
              <h2 className="text-lg font-bold text-paper flex items-center gap-2">
                ग्राहक, डीलर व डिस्ट्रीब्यूटर KYC Hub
                <span className="text-[10px] bg-gold text-navy font-bold px-2 py-0.5 rounded-full">
                  B2B & Credit Due Diligence
                </span>
              </h2>
            </div>
            <p className="text-xs text-paper/80 leading-relaxed max-w-2xl">
              डीलर/डिस्ट्रीब्यूटर बनने का फॉर्म सीधे ग्राहक को भेजें, उनकी दुकान का अनुभव, जीएसटी, प्रोप्राइटर आधार, सुरक्षा चेक व क्रेडिट लिमिट जांचें और पक्का रिकॉर्ड रखें।
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-3.5 py-2.5 bg-paper/10 border border-paper/20 text-gold font-bold text-xs rounded-xl hover:bg-paper/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 size={15} />
              <span>फॉर्म ग्राहक को भेजें</span>
            </button>

            <button
              onClick={() => {
                resetForm();
                setIsAddOpen(true);
              }}
              className="px-4 py-2.5 bg-gold text-navy font-bold text-xs rounded-xl shadow hover:bg-gold-light transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={15} />
              <span>+ नया डीलर / कस्टमर जोड़ें</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 pt-3 border-t border-paper/10 text-center">
          <div className="bg-paper/5 p-2 rounded-xl">
            <div className="text-[10px] text-paper/70">कुल पंजीकृत पार्टियां</div>
            <div className="text-base font-bold text-gold"><Mono>{counts.all}</Mono></div>
          </div>
          <div className="bg-paper/5 p-2 rounded-xl">
            <div className="text-[10px] text-paper/70">📥 समीक्षा लंबित (New)</div>
            <div className="text-base font-bold text-amber-300"><Mono>{counts.pending}</Mono></div>
          </div>
          <div className="bg-paper/5 p-2 rounded-xl">
            <div className="text-[10px] text-paper/70">✅ एक्टिव डीलर्स</div>
            <div className="text-base font-bold text-emerald-400"><Mono>{counts.active}</Mono></div>
          </div>
          <div className="bg-paper/5 p-2 rounded-xl">
            <div className="text-[10px] text-paper/70">सुरक्षा चेक जमा</div>
            <div className="text-base font-bold text-blue-300">
              <Mono>{records.filter(r => r.securityChequeGiven).length}</Mono>
            </div>
          </div>
          <div className="bg-paper/5 p-2 rounded-xl col-span-2 sm:col-span-1">
            <div className="text-[10px] text-paper/70">मंजूर कुल क्रेडिट लिमिट</div>
            <div className="text-base font-bold text-gold">
              <Mono>₹{(counts.totalCreditLimit / 100000).toFixed(1)}L</Mono>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: `सभी (${counts.all})` },
            { id: 'pending_review', label: `📥 समीक्षा लंबित (${counts.pending})` },
            { id: 'credit_approved', label: `💳 उधार स्वीकृत (${counts.credit_approved})` },
            { id: 'active', label: `✅ एक्टिव डीलर (${counts.active})` },
            { id: 'suspended_defaulter', label: `⚠️ ब्लॉक (${counts.defaulter})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-navy text-gold-soft shadow-sm'
                  : 'bg-paper text-ink-muted hover:bg-paper-dim border border-paper-dim'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink focus:outline-none"
          >
            <option value="all">सभी श्रेणियां</option>
            <option value="b2b_dealer">डीलर (Dealer)</option>
            <option value="distributor">वितरक (Distributor)</option>
            <option value="retailer">रिटेलर (Retailer)</option>
            <option value="franchise">फ्रैंचाइज़ी (Franchise)</option>
            <option value="b2c_high_value">B2C ग्राहक</option>
          </select>

          <div className="relative min-w-[180px]">
            <Search size={14} className="absolute left-3 top-2.5 text-ink-muted" />
            <input
              type="text"
              placeholder="फर्म, मालिक या GST खोजें..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:border-navy"
            />
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredRecords.length === 0 ? (
        <div className="bg-paper border border-paper-dim rounded-2xl p-8 text-center space-y-2">
          <Store size={36} className="mx-auto text-ink-muted opacity-40" />
          <p className="text-sm font-bold text-ink">कोई ग्राहक / डीलर रिकॉर्ड नहीं मिला</p>
          <p className="text-xs text-ink-muted max-w-sm mx-auto">
            नया डीलर जोड़ने के लिए ऊपर दिए गए बटन का उपयोग करें अथवा ग्राहक को लिंक भेजें।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredRecords.map(record => {
            const statusConfig = {
              pending_review: { label: 'समीक्षा लंबित', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
              verified: { label: 'KYC सत्यापित', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
              credit_approved: { label: 'उधार स्वीकृत', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
              active: { label: 'सक्रिय डीलर (Active)', bg: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
              suspended_defaulter: { label: 'ब्लॉक / डिफॉल्टर', bg: 'bg-rose-50 text-rose-700 border-rose-300' },
            }[record.kycStatus];

            const typeLabel = {
              b2b_dealer: 'B2B डीलर',
              distributor: 'डिस्ट्रीब्यूटर',
              retailer: 'रिटेलर',
              franchise: 'फ्रैंचाइज़ी',
              b2c_high_value: 'B2C ग्राहक',
            }[record.partnerType];

            return (
              <div 
                key={record.id}
                className="bg-paper border border-paper-dim rounded-2xl p-4 shadow-sm hover:border-gold/50 transition space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-ink">{record.tradeName}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusConfig.bg}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                    <div className="text-xs text-ink-muted flex items-center gap-1.5">
                      <span className="font-semibold text-navy">{record.ownerName}</span>
                      <span>• {typeLabel}</span>
                      {record.city && <span>• {record.city}</span>}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-700">
                      <Mono>₹{record.approvedCreditLimit.toLocaleString('en-IN')}</Mono>
                    </div>
                    <span className="text-[10px] text-ink-muted block">
                      क्रेडिट सीमा ({record.creditPaymentDays} दिन)
                    </span>
                  </div>
                </div>

                {/* Info Pills Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-paper-dim/40 p-2.5 rounded-xl border border-paper-dim/60">
                  <div>
                    <span className="text-[10px] text-ink-muted block">काम कब से शुरू किया</span>
                    <span className="font-semibold text-ink">
                      {record.businessStartedYear || 'स्थापित दुकान'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-muted block">दुकान स्वामित्व</span>
                    <span className="font-semibold text-ink">
                      {record.premisesType === 'owned' ? '🏢 खुद की दुकान (Owned)' : '🏠 किराये की दुकान'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-muted block">GSTIN / PAN</span>
                    <span className="font-mono text-ink">
                      {record.gstin || record.panNumber || 'लागू नहीं (Unregistered)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-muted block">सुरक्षा चेक (Security)</span>
                    <span className={`font-semibold ${record.securityChequeGiven ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {record.securityChequeGiven ? '✓ सुरक्षा चेक प्राप्त' : 'चेक अप्राप्त'}
                    </span>
                  </div>
                </div>

                {/* Bottom Bar & Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-paper-dim">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${record.ownerPhone}`}
                      className="px-2.5 py-1.5 bg-paper border border-paper-dim rounded-lg text-xs font-semibold text-ink hover:bg-paper-dim flex items-center gap-1"
                    >
                      <Phone size={12} className="text-emerald-600" />
                      <span>कॉल</span>
                    </a>
                    <button
                      onClick={() => {
                        setRecordForPrint(record);
                        setIsPrintModalOpen(true);
                      }}
                      className="px-2.5 py-1.5 bg-paper border border-paper-dim rounded-lg text-xs font-semibold text-navy hover:bg-paper-dim flex items-center gap-1 cursor-pointer"
                    >
                      <FileText size={12} className="text-gold-dark" />
                      <span>KYC शीट</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedRecord(record)}
                    className="px-3 py-1.5 bg-navy text-gold-soft rounded-lg text-xs font-bold hover:bg-navy-light flex items-center gap-1 cursor-pointer"
                  >
                    <span>समीक्षा व अप्रूवल</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================
          MODAL 1: SHARE ONBOARDING FORM VIA WHATSAPP / LINK
         ======================================================== */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm">
          <div className="bg-paper border border-paper-dim rounded-2xl w-full max-w-lg shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <div className="flex items-center gap-2">
                <Share2 size={18} className="text-gold" />
                <h3 className="text-sm font-bold text-ink">ग्राहक / डीलर को KYC फॉर्म भेजें</h3>
              </div>
              <button onClick={() => setIsShareModalOpen(false)} className="text-ink-muted hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-ink-muted leading-relaxed">
              यह लिंक आप किसी भी नए व्यापारी, डीलर या ग्राहक को व्हाट्सएप पर भेज सकते हैं। वे अपने मोबाइल पर अपनी दुकान, पता, जीएसटी, मालिक का आधार और बैंक विवरण भरकर सीधे सबमिट करेंगे।
            </p>

            <div className="bg-paper-dim/60 p-3 rounded-xl border border-paper-dim space-y-2">
              <span className="text-[10px] font-bold text-ink-muted uppercase block">डिजिटल फॉर्म लिंक</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={getShareLink()}
                  className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-lg text-xs font-mono text-ink"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-navy text-gold-soft font-bold text-xs rounded-lg flex items-center gap-1 whitespace-nowrap cursor-pointer"
                >
                  {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedLink ? 'कॉपी हो गया' : 'कॉपी करें'}</span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSendWhatsappInvite}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow cursor-pointer"
              >
                <Send size={15} />
                <span>व्हाट्सएप (WhatsApp) पर आमंत्रण व लिंक भेजें</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: ADD / EDIT DEALER KYC FORM (4 STEPS)
         ======================================================== */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-paper border border-paper-dim rounded-2xl w-full max-w-2xl my-6 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-5 py-3.5 bg-navy text-paper flex items-center justify-between border-b border-gold/20">
              <div className="flex items-center gap-2">
                <Store size={18} className="text-gold" />
                <h3 className="text-sm font-bold">डीलर / कस्टमर KYC ऑनबोर्डिंग फॉर्म</h3>
              </div>
              <button onClick={() => setIsAddOpen(false)} className="text-paper/70 hover:text-paper">
                <X size={18} />
              </button>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-4 bg-paper-dim/40 border-b border-paper-dim text-xs font-semibold text-center py-2">
              <button 
                onClick={() => setFormStep(1)}
                className={`py-1 ${formStep === 1 ? 'text-navy font-bold border-b-2 border-navy' : 'text-ink-muted'}`}
              >
                1. फर्म व दुकान
              </button>
              <button 
                onClick={() => setFormStep(2)}
                className={`py-1 ${formStep === 2 ? 'text-navy font-bold border-b-2 border-navy' : 'text-ink-muted'}`}
              >
                2. मालिक की पहचान
              </button>
              <button 
                onClick={() => setFormStep(3)}
                className={`py-1 ${formStep === 3 ? 'text-navy font-bold border-b-2 border-navy' : 'text-ink-muted'}`}
              >
                3. व्यापार व क्षमता
              </button>
              <button 
                onClick={() => setFormStep(4)}
                className={`py-1 ${formStep === 4 ? 'text-navy font-bold border-b-2 border-navy' : 'text-ink-muted'}`}
              >
                4. उधार व सुरक्षा चेक
              </button>
            </div>

            <form onSubmit={handleSaveKyc} className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* STEP 1: Firm & Business Details */}
              {formStep === 1 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">
                        पार्टनर श्रेणी (Category) *
                      </label>
                      <select
                        value={partnerType}
                        onChange={e => setPartnerType(e.target.value as any)}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink focus:outline-none focus:border-navy"
                      >
                        <option value="b2b_dealer">B2B अधिकृत डीलर (Dealer)</option>
                        <option value="distributor">थोक वितरक (Distributor / Stockist)</option>
                        <option value="retailer">खुदरा व्यापारी (Retailer)</option>
                        <option value="franchise">फ्रैंचाइज़ी पार्टनर (Franchisee)</option>
                        <option value="b2c_high_value">नियमित थोक ग्राहक (High-Value Client)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">
                        दुकान / फर्म का नाम (Trade Name) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="जैसे: श्री बालाजी हार्डवेयर"
                        value={tradeName}
                        onChange={e => setTradeName(e.target.value)}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink focus:outline-none focus:border-navy"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">
                        फर्म का प्रकार (Constitution)
                      </label>
                      <select
                        value={constitution}
                        onChange={e => setConstitution(e.target.value as any)}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink focus:outline-none focus:border-navy"
                      >
                        <option value="proprietorship">प्रोपराइटरशिप (एकल स्वामित्व)</option>
                        <option value="partnership">पार्टनरशिप फर्म</option>
                        <option value="pvt_ltd">प्राइवेट लिमिटेड (Pvt Ltd)</option>
                        <option value="individual">व्यक्तिगत</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">
                        GSTIN नंबर (यदि उपलब्ध हो)
                      </label>
                      <input
                        type="text"
                        placeholder="15 अंकों का GSTIN"
                        value={gstin}
                        onChange={e => setGstin(e.target.value)}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink uppercase"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">
                        कब से काम शुरू किया हुआ है? (Year)
                      </label>
                      <input
                        type="text"
                        placeholder="जैसे: 2015 या 10 साल से"
                        value={businessStartedYear}
                        onChange={e => setBusinessStartedYear(e.target.value)}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">
                      दुकान / ऑफिस / गोदाम का पूरा पता *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="दुकान नंबर, मार्केट का नाम, सड़क"
                      value={shopAddress}
                      onChange={e => setShopAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink focus:outline-none focus:border-navy"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-ink block mb-1">लैंडमार्क</label>
                      <input
                        type="text"
                        placeholder="जैसे: मंदिर के पास"
                        value={landmark}
                        onChange={e => setLandmark(e.target.value)}
                        className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-ink block mb-1">शहर / कस्बा *</label>
                      <input
                        type="text"
                        required
                        placeholder="शहर"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-ink block mb-1">राज्य</label>
                      <input
                        type="text"
                        value={state}
                        onChange={e => setState(e.target.value)}
                        className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-ink block mb-1">पिनकोड</label>
                      <input
                        type="text"
                        placeholder="6 अंक"
                        value={pincode}
                        onChange={e => setPincode(e.target.value)}
                        className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">
                      दुकान का स्वामित्व (Premises Status)
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-xs">
                        <input
                          type="radio"
                          name="premises"
                          checked={premisesType === 'owned'}
                          onChange={() => setPremisesType('owned')}
                          className="accent-navy"
                        />
                        <span>🏢 खुद की दुकान है (Owned)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs">
                        <input
                          type="radio"
                          name="premises"
                          checked={premisesType === 'rented'}
                          onChange={() => setPremisesType('rented')}
                          className="accent-navy"
                        />
                        <span>🏠 किराये की दुकान है (Rented)</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      type="button"
                      onClick={() => setFormStep(2)}
                      className="px-4 py-2 bg-navy text-gold-soft font-bold text-xs rounded-xl flex items-center gap-1.5"
                    >
                      <span>अगला: मालिक की पहचान</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Owner Personal KYC */}
              {formStep === 2 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">
                        मालिक / प्रोपराइटर का नाम (Owner Full Name) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="जैसे: श्री रमेश कुमार अग्रवाल"
                        value={ownerName}
                        onChange={e => setOwnerName(e.target.value)}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink focus:outline-none focus:border-navy"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">
                        जन्म तिथि (Date of Birth)
                      </label>
                      <input
                        type="date"
                        value={ownerDob}
                        onChange={e => setOwnerDob(e.target.value)}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">
                        मोबाइल नंबर (Phone) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="10 अंकों का नंबर"
                        value={ownerPhone}
                        onChange={e => setOwnerPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">
                        व्हाट्सएप नंबर
                      </label>
                      <input
                        type="tel"
                        placeholder="WhatsApp नंबर"
                        value={ownerWhatsapp}
                        onChange={e => setOwnerWhatsapp(e.target.value)}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">
                        ईमेल पता
                      </label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={ownerEmail}
                        onChange={e => setOwnerEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">
                        मालिक का आधार कार्ड नंबर
                      </label>
                      <input
                        type="text"
                        placeholder="12 अंकों का आधार"
                        value={ownerAadhar}
                        onChange={e => setOwnerAadhar(e.target.value)}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">
                        व्यक्तिगत पैन नंबर (Personal PAN)
                      </label>
                      <input
                        type="text"
                        placeholder="10 अंकों का पैन"
                        value={panNumber}
                        onChange={e => setPanNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">
                      मालिक का आवासीय / घरेलू पता (Residential Address)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="मालिक का घर का स्थायी पता"
                      value={ownerResidentialAddress}
                      onChange={e => setOwnerResidentialAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                    />
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
                      <span>अगला: व्यापार व क्षमता</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Trade & Capabilities */}
              {formStep === 3 && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">
                      वार्षिक टर्नओवर ब्रैकेट (Annual Business Turnover)
                    </label>
                    <select
                      value={annualTurnoverBracket}
                      onChange={e => setAnnualTurnoverBracket(e.target.value as any)}
                      className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink focus:outline-none focus:border-navy"
                    >
                      <option value="below_20L">₹20 लाख से कम (Small Retailer)</option>
                      <option value="20L_to_1Cr">₹20 लाख से ₹1 करोड़ (Growing Dealer)</option>
                      <option value="1Cr_to_5Cr">₹1 करोड़ से ₹5 करोड़ (Major Dealer / Distributor)</option>
                      <option value="above_5Cr">₹5 करोड़ से अधिक (Wholesale Hub)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">
                      किन-किन उत्पादों का कारोबार करते हैं? (Dealing Products)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="जैसे: सीमेंट, सरिया, पाइप्स, पेंट्स, हार्डवेयर टूल्स..."
                      value={dealingProducts}
                      onChange={e => setDealingProducts(e.target.value)}
                      className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">
                      वर्तमान में किन कंपनियों / ब्रांड्स का माल बेच रहे हैं?
                    </label>
                    <input
                      type="text"
                      placeholder="जैसे: टाटा, एशियन पेंट्स, सुप्रीम, बिरला..."
                      value={existingBrandsDealt}
                      onChange={e => setExistingBrandsDealt(e.target.value)}
                      className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                    />
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
                      <span>अगला: उधार व सुरक्षा चेक</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Credit Due Diligence & Security Cheque */}
              {formStep === 4 && (
                <div className="space-y-3">
                  <div className="p-3 bg-paper-dim/40 rounded-xl border border-paper-dim space-y-3">
                    <h4 className="text-xs font-bold text-ink flex items-center gap-1.5">
                      <CreditCard size={14} className="text-gold-dark" />
                      <span>उधार सीमा व भुगतान नियम (Credit Due Diligence)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-ink block mb-1">
                          मांगी गई उधार सीमा (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="जैसे: 200000"
                          value={requestedCreditLimit}
                          onChange={e => setRequestedCreditLimit(e.target.value ? Number(e.target.value) : '')}
                          className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-ink block mb-1">
                          स्वीकृत उधार सीमा (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="जैसे: 150000"
                          value={approvedCreditLimit}
                          onChange={e => setApprovedCreditLimit(e.target.value ? Number(e.target.value) : '')}
                          className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink font-bold text-emerald-700"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-ink block mb-1">
                          उधार भुगतान अवधि (Credit Days)
                        </label>
                        <select
                          value={creditPaymentDays}
                          onChange={e => setCreditPaymentDays(Number(e.target.value))}
                          className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                        >
                          <option value={7}>7 दिन (हफ़्ते का हिसाब)</option>
                          <option value={15}>15 दिन (पाक्षिक)</option>
                          <option value={21}>21 दिन</option>
                          <option value={30}>30 दिन (मासिक चक्र)</option>
                          <option value={45}>45 दिन</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-paper-dim">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securityChequeGiven}
                          onChange={e => setSecurityChequeGiven(e.target.checked)}
                          className="w-4 h-4 accent-navy rounded"
                        />
                        <span className="text-xs font-bold text-ink">
                          सुरक्षा चेक प्राप्त हुआ? (Security Cheque Collected)
                        </span>
                      </label>

                      {securityChequeGiven && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="text-[11px] font-bold text-ink block mb-1">
                              बैंक का नाम व चेक नंबर
                            </label>
                            <input
                              type="text"
                              placeholder="जैसे: SBI चेक नं 340912"
                              value={securityChequeDetails}
                              onChange={e => setSecurityChequeDetails(e.target.value)}
                              className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-ink block mb-1">
                              सिक्योरिटी डिपॉजिट राशि (यदि ली हो)
                            </label>
                            <input
                              type="number"
                              placeholder="जैसे: 50000"
                              value={securityDepositAmount}
                              onChange={e => setSecurityDepositAmount(e.target.value ? Number(e.target.value) : '')}
                              className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Trade References */}
                  <div className="p-3 bg-paper-dim/40 rounded-xl border border-paper-dim space-y-3">
                    <h4 className="text-xs font-bold text-ink flex items-center gap-1.5">
                      <Users size={14} className="text-navy" />
                      <span>व्यापारिक संदर्भ / रेफरेंस (Trade References for Due Diligence)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-ink block mb-1">
                          रेफरेंस 1: फर्म का नाम व मालिक
                        </label>
                        <input
                          type="text"
                          placeholder="जैसे: श्री राम स्टील (श्री शर्मा जी)"
                          value={reference1Name}
                          onChange={e => setReference1Name(e.target.value)}
                          className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-ink block mb-1">
                          रेफरेंस 1: मोबाइल नंबर
                        </label>
                        <input
                          type="tel"
                          placeholder="सत्यापन हेतु फोन नंबर"
                          value={reference1Phone}
                          onChange={e => setReference1Phone(e.target.value)}
                          className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-ink block mb-1">
                          रेफरेंस 2: फर्म का नाम व मालिक
                        </label>
                        <input
                          type="text"
                          placeholder="जैसे: कृष्णा पेंट्स एजेंसी"
                          value={reference2Name}
                          onChange={e => setReference2Name(e.target.value)}
                          className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-xl text-xs text-ink"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-ink block mb-1">
                          रेफरेंस 2: मोबाइल नंबर
                        </label>
                        <input
                          type="tel"
                          placeholder="सत्यापन हेतु फोन नंबर"
                          value={reference2Phone}
                          onChange={e => setReference2Phone(e.target.value)}
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
                      <span>डीलर / कस्टमर KYC सुरक्षित करें</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: DEALER DOSSIER & APPROVAL REVIEW
         ======================================================== */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-paper border border-paper-dim rounded-2xl w-full max-w-2xl my-6 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-5 py-3.5 bg-navy text-paper flex items-center justify-between border-b border-gold/20">
              <div className="flex items-center gap-2">
                <Store size={18} className="text-gold" />
                <div>
                  <h3 className="text-sm font-bold">{selectedRecord.tradeName}</h3>
                  <p className="text-[11px] text-paper/70">
                    {selectedRecord.ownerName} • {selectedRecord.ownerPhone} • {selectedRecord.city}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="text-paper/70 hover:text-paper">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Approval Bar */}
              <div className="p-3 bg-paper-dim/40 rounded-xl border border-paper-dim space-y-2">
                <span className="text-[11px] font-bold text-ink block">
                  पार्टनर स्थिति व उधार स्वीकृति (Update KYC Status):
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedRecord.id, 'verified')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer ${
                      selectedRecord.kycStatus === 'verified'
                        ? 'bg-blue-600 text-white'
                        : 'bg-paper border border-paper-dim text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    <CheckCircle2 size={13} />
                    <span>दस्तावेज सत्यापित (KYC Verified)</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedRecord.id, 'credit_approved')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer ${
                      selectedRecord.kycStatus === 'credit_approved'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-paper border border-paper-dim text-indigo-700 hover:bg-indigo-50'
                    }`}
                  >
                    <CreditCard size={13} />
                    <span>उधार सीमा स्वीकृत</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedRecord.id, 'active')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer ${
                      selectedRecord.kycStatus === 'active'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-paper border border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    <ShieldCheck size={13} />
                    <span>✅ एक्टिव डीलर घोषित करें</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedRecord.id, 'suspended_defaulter')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer ${
                      selectedRecord.kycStatus === 'suspended_defaulter'
                        ? 'bg-rose-600 text-white'
                        : 'bg-paper border border-rose-300 text-rose-700 hover:bg-rose-50'
                    }`}
                  >
                    <AlertTriangle size={13} />
                    <span>⚠️ ब्लॉक / डिफॉल्टर</span>
                  </button>
                </div>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-paper border border-paper-dim p-3 rounded-xl space-y-1.5">
                  <span className="text-[10px] font-bold text-ink-muted uppercase block">दुकान व फर्म विवरण</span>
                  <div className="text-ink">
                    <span className="font-semibold block">पता:</span> {selectedRecord.shopAddress}, {selectedRecord.city} ({selectedRecord.pincode})
                  </div>
                  <div className="text-ink flex justify-between">
                    <span>GSTIN:</span>
                    <span className="font-mono font-semibold">{selectedRecord.gstin || 'लागू नहीं'}</span>
                  </div>
                  <div className="text-ink flex justify-between">
                    <span>दुकान स्वामित्व:</span>
                    <span>{selectedRecord.premisesType === 'owned' ? '🏢 खुद की दुकान' : '🏠 किराये की दुकान'}</span>
                  </div>
                  <div className="text-ink flex justify-between">
                    <span>अनुभव:</span>
                    <span>{selectedRecord.businessStartedYear || 'स्थापित'}</span>
                  </div>
                </div>

                <div className="bg-paper border border-paper-dim p-3 rounded-xl space-y-1.5">
                  <span className="text-[10px] font-bold text-ink-muted uppercase block">उधार व सुरक्षा चेक्स</span>
                  <div className="text-ink flex justify-between">
                    <span>मंजूर उधार सीमा:</span>
                    <span className="font-bold text-emerald-700"><Mono>₹{selectedRecord.approvedCreditLimit.toLocaleString('en-IN')}</Mono></span>
                  </div>
                  <div className="text-ink flex justify-between">
                    <span>भुगतान अवधि:</span>
                    <span className="font-semibold">{selectedRecord.creditPaymentDays} दिन</span>
                  </div>
                  <div className="text-ink flex justify-between">
                    <span>सुरक्षा चेक:</span>
                    <span className={selectedRecord.securityChequeGiven ? 'text-emerald-700 font-semibold' : 'text-amber-700'}>
                      {selectedRecord.securityChequeGiven ? '✓ प्राप्त' : 'अप्राप्त'}
                    </span>
                  </div>
                  {selectedRecord.securityChequeDetails && (
                    <div className="text-[11px] text-ink-muted pt-1">
                      विवरण: {selectedRecord.securityChequeDetails}
                    </div>
                  )}
                </div>
              </div>

              {/* Owner KYC Details */}
              <div className="bg-paper border border-paper-dim p-3.5 rounded-xl space-y-2">
                <span className="text-[11px] font-bold text-ink flex items-center gap-1.5">
                  <UserCheck size={14} className="text-gold" />
                  <span>मालिक / प्रोपराइटर व्यक्तिगत पहचान (Owner KYC)</span>
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-ink-muted block">मालिक का नाम:</span>
                    <span className="font-semibold text-ink">{selectedRecord.ownerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-muted block">जन्म तारीख (DOB):</span>
                    <span className="font-semibold text-ink">{selectedRecord.ownerDob || 'एन/ए'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-muted block">आधार संख्या:</span>
                    <span className="font-semibold text-ink">{selectedRecord.ownerAadhar || 'एन/ए'}</span>
                  </div>
                </div>
                {selectedRecord.ownerResidentialAddress && (
                  <div className="pt-1">
                    <span className="text-[10px] text-ink-muted block">मालिक का निवास पता:</span>
                    <span className="text-ink">{selectedRecord.ownerResidentialAddress}</span>
                  </div>
                )}
              </div>

              {/* Trade References */}
              {(selectedRecord.reference1Name || selectedRecord.reference2Name) && (
                <div className="bg-paper border border-paper-dim p-3.5 rounded-xl space-y-2">
                  <span className="text-[11px] font-bold text-ink flex items-center gap-1.5">
                    <Users size={14} className="text-navy" />
                    <span>मार्केट व्यापारिक रेफरेंस (Trade References)</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedRecord.reference1Name && (
                      <div className="bg-paper-dim/40 p-2 rounded-lg">
                        <span className="font-semibold text-ink block">{selectedRecord.reference1Name}</span>
                        <span className="text-ink-muted font-mono">{selectedRecord.reference1Phone}</span>
                      </div>
                    )}
                    {selectedRecord.reference2Name && (
                      <div className="bg-paper-dim/40 p-2 rounded-lg">
                        <span className="font-semibold text-ink block">{selectedRecord.reference2Name}</span>
                        <span className="text-ink-muted font-mono">{selectedRecord.reference2Phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 py-3 bg-paper-dim/40 border-t border-paper-dim flex items-center justify-between">
              <button
                onClick={() => {
                  setRecordForPrint(selectedRecord);
                  setIsPrintModalOpen(true);
                }}
                className="px-3 py-2 bg-navy text-gold-soft font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <FileText size={14} />
                <span>डीलर मास्टर KYC शीट प्रिंट करें</span>
              </button>

              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-paper border border-paper-dim text-ink font-bold rounded-xl cursor-pointer"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: PRINTABLE DEALER KYC MASTER SHEET / AGREEMENT
         ======================================================== */}
      {isPrintModalOpen && recordForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-paper border border-paper-dim rounded-2xl w-full max-w-xl my-6 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-5 py-3 bg-navy text-paper flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-gold" />
                <h3 className="text-sm font-bold">डीलर / ग्राहक KYC एवं क्रेडिट एग्रीमेंट शीट</h3>
              </div>
              <button onClick={() => setIsPrintModalOpen(false)} className="text-paper/70 hover:text-paper">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-ink text-xs font-sans bg-white">
              {/* Sheet Header */}
              <div className="text-center border-b pb-3 border-gray-200 space-y-1">
                <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide">
                  व्यापारिक डीलरशिप / ग्राहक ऑनबोर्डिंग मास्टर प्रोफाइल
                </h2>
                <p className="text-[11px] text-gray-600">
                  (KYC, व्यावसायिक पृष्ठभूमि एवं उधार साख सीमा अनुबंध)
                </p>
                <p className="text-[10px] text-gray-500">तारीख: {new Date().toLocaleDateString('hi-IN')}</p>
              </div>

              {/* Table */}
              <table className="w-full border-collapse border border-gray-300 text-[11px]">
                <tbody>
                  <tr className="border-b border-gray-300">
                    <td className="p-2 bg-gray-50 font-bold border-r border-gray-300 w-1/3">फर्म / दुकान का नाम</td>
                    <td className="p-2 font-bold text-gray-900">{recordForPrint.tradeName}</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="p-2 bg-gray-50 font-bold border-r border-gray-300">पार्टनर श्रेणी</td>
                    <td className="p-2 uppercase font-semibold">{recordForPrint.partnerType.replace('_', ' ')}</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="p-2 bg-gray-50 font-bold border-r border-gray-300">दुकान का पता</td>
                    <td className="p-2">{recordForPrint.shopAddress}, {recordForPrint.city} ({recordForPrint.state}) - {recordForPrint.pincode}</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="p-2 bg-gray-50 font-bold border-r border-gray-300">GSTIN व PAN</td>
                    <td className="p-2 font-mono font-semibold">{recordForPrint.gstin || 'एन/ए'} / {recordForPrint.panNumber || 'एन/ए'}</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="p-2 bg-gray-50 font-bold border-r border-gray-300">मालिक / प्रोपराइटर</td>
                    <td className="p-2 font-bold">{recordForPrint.ownerName} (फोन: {recordForPrint.ownerPhone})</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="p-2 bg-gray-50 font-bold border-r border-gray-300">मालिक आधार व DOB</td>
                    <td className="p-2">{recordForPrint.ownerAadhar || 'एन/ए'} (जन्म: {recordForPrint.ownerDob || 'एन/ए'})</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="p-2 bg-gray-50 font-bold border-r border-gray-300">स्वीकृत उधार सीमा</td>
                    <td className="p-2 font-bold text-emerald-800 text-sm">
                      ₹{recordForPrint.approvedCreditLimit.toLocaleString('en-IN')} (भुगतान चक्र: {recordForPrint.creditPaymentDays} दिन)
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="p-2 bg-gray-50 font-bold border-r border-gray-300">सुरक्षा चेक विवरण</td>
                    <td className="p-2">{recordForPrint.securityChequeDetails || 'सुरक्षा चेक संलग्न'}</td>
                  </tr>
                  <tr>
                    <td className="p-2 bg-gray-50 font-bold border-r border-gray-300">व्यापारिक संदर्भ</td>
                    <td className="p-2">{recordForPrint.reference1Name || 'एन/ए'}</td>
                  </tr>
                </tbody>
              </table>

              <div className="space-y-1 text-[11px] text-gray-700 bg-gray-50 p-2.5 rounded border border-gray-200">
                <p className="font-bold">सत्यापन घोषणा:</p>
                <p>
                  उपरोक्त दी गई सभी व्यावसायिक, व्यक्तिगत एवं बैंक विवरण सत्य व सही हैं। स्वीकृत उधार सीमा की अवधि समाप्त होने पर देय राशि का तत्काल भुगतान सुनिश्चित किया जाएगा।
                </p>
              </div>

              {/* Signature Blocks */}
              <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs">
                <div>
                  <div className="border-t border-gray-400 pt-1 font-bold">
                    हस्ताक्षर व सील: डीलर / ग्राहक
                  </div>
                  <div className="text-[10px] text-gray-500">({recordForPrint.ownerName})</div>
                </div>
                <div>
                  <div className="border-t border-gray-400 pt-1 font-bold">
                    अधिकृत हस्ताक्षर: सप्लायर / निर्माता
                  </div>
                  <div className="text-[10px] text-gray-500">(क्रेडिट कंट्रोल विभाग)</div>
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
                onClick={() => setIsPrintModalOpen(false)}
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
