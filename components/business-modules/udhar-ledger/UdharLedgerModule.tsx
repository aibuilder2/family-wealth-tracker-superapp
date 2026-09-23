'use client';

import React, { useState, useEffect } from 'react';
import { 
  HandCoins, Plus, ArrowUpRight, ArrowDownLeft, ArrowDownRight, Phone, CheckCircle, Clock, 
  Package, Wrench, Banknote, ShieldCheck, Share2, MapPin, User,
  Calendar, CreditCard, CheckCircle2, AlertCircle, Sparkles, Trash2, 
  Gauge, Building2, Landmark, Check, X, ShieldAlert, CheckCheck, AlertTriangle,
  Scale, FileText, Image as ImageIcon, ExternalLink, Paperclip, Eye,
  Truck, Navigation, AlertOctagon, CheckSquare, MessageSquare, ThumbsUp, ThumbsDown,
  Star, Award, Search, Camera, Edit3, Lock, History
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';
import { 
  isValidIndianPhone, 
  isValidGstin, 
  isValidPan,
  normalizePhoneNumber, 
  normalizeGstin, 
  normalizePan,
  findExistingVendor,
  calculateDeliveryTrustScore,
  calculateRepaymentTrustScore,
  aggregateCrossVendorPartySummaries,
  PartyTrustSummary
} from '@/lib/utils/udharValidation';
import { 
  PREBUILT_UDHAR_TEMPLATES, 
  getCustomTemplates, 
  saveCustomTemplate,
  UdharTermsTemplate 
} from '@/lib/constants/udharTermsTemplates';
import { saveBillProof, getBillProof } from '@/lib/utils/idbStorage';
import { useFamilyStore } from '@/lib/store/familyStore';
import { UdharMandateModule, UdharMandate } from './UdharMandateModule';

export type UdharSettlementMode = 'cash_online' | 'samaan_goods' | 'kaam_service';

export interface UdharSettlement {
  id: string;
  amount: number;
  mode: UdharSettlementMode;
  date: string;
  note?: string;
}

export interface UdharContact {
  id: string;
  // Our Business Info
  our_business_name: string; // e.g. Sharma Traders / RK Logistics
  our_business_gstin?: string; // e.g. 09AAACS1234F1Z5
  linked_member_name?: string; // Optional: Papa, Rohan, etc.
  
  // Party Info (Customer / Retailer / Vendor)
  person_name: string; // Name of person / dukandar / firm
  father_name?: string; // Strictly optional
  address?: string; // Optional shop / village location
  phone?: string;
  party_gstin?: string; // Optional GST of the party
  party_pan?: string; // Optional 10-char PAN of the party
  photo_urls?: string[]; // Customer face / profile photos (mandatory on 1st transaction)
  
  type: 'given' | 'taken'; // given = lena hai, taken = dena hai
  original_amount: number;
  remaining_balance: number;
  credit_limit?: number; // Retailer credit limit e.g. 50000
  payment_mode: 'cash' | 'bank_transfer' | 'upi' | 'cheque';
  
  // Tenure in days
  tenure_days: number; // e.g. 15, 30, 45, 60, 90 days
  start_date: string;
  due_date: string;
  promised_return_date: string;
  
  // Task 2: Terms & Conditions Snapshot
  terms_and_conditions?: string;
  terms_template_title?: string;

  // Task 2.5: Mandatory Bill Proof (File or Manual)
  bill_proof_type?: 'file' | 'manual' | 'both';
  bill_proof_filename?: string;
  bill_proof_filetype?: string;
  bill_proof_filesize?: number;
  bill_number?: string;
  bill_date?: string;
  bill_amount?: number;

  // Wealth Sync Toggle (individual / global)
  sync_to_family_wealth: boolean;
  
  // Task 2.6 & Task 2.7: Delivery Type & Quotation/Dispatch Pipeline
  delivery_type: 'hand_to_hand' | 'transport';
  pipeline_stage: 'quotation' | 'dispatched' | 'in_transit' | 'confirmed' | 'disputed' | 'settled';

  // Quotation stage
  estimated_amount?: number;
  material_description?: string;
  quotation_date?: string;

  // Dispatch stage
  bilty_number?: string;
  transport_name?: string;
  dispatch_date?: string;
  expected_arrival_date?: string;
  dispatch_otp?: string;
  is_dispatch_otp_verified?: boolean;

  // Delivery stage
  delivery_otp?: string;
  is_delivery_otp_verified?: boolean;
  delivery_feedback?: 'all_ok' | 'discrepancy_reported';
  dispute_note?: string;

  // Promised vs Actual Tenure (Trust Score)
  promised_tenure_days: number;
  actual_settled_days?: number;
  actual_settled_date?: string;

  // Task 2: Bill & Dispute Immutability / Amendments
  amended_from_id?: string;
  amendment_version?: number;
  amendment_reason?: string;
  is_amended?: boolean;
  is_dispute_resolved?: boolean;
  dispute_resolved_at?: string;
  dispute_resolution_note?: string;

  otp_code: string;
  is_otp_verified: boolean;
  notes?: string;
  status: 'active' | 'settled';
  settlements: UdharSettlement[];
}

const DEFAULT_UDHAR_CONTACTS: UdharContact[] = [
  {
    id: 'u-1',
    our_business_name: 'शर्मा ट्रेडर्स & सप्लायर्स',
    our_business_gstin: '09AAACS1234F1Z5',
    linked_member_name: 'पापा',
    person_name: 'रमेश किराना स्टोर',
    father_name: 'श्री रामस्वरूप जी',
    address: 'दुकान नं 14, सदर बाजार, लखनऊ',
    phone: '9876543210',
    party_gstin: '09BBTPS4580K1Z2',
    party_pan: 'BBTPS4580K',
    photo_urls: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'],
    type: 'given',
    original_amount: 45000,
    remaining_balance: 15000,
    credit_limit: 50000,
    payment_mode: 'cash',
    tenure_days: 30,
    start_date: '2026-08-15',
    due_date: '2026-09-15',
    promised_return_date: '2026-09-15',
    sync_to_family_wealth: false,
    delivery_type: 'hand_to_hand',
    pipeline_stage: 'confirmed',
    promised_tenure_days: 30,
    delivery_feedback: 'all_ok',
    otp_code: '849201',
    is_otp_verified: true,
    notes: 'किराना होलसेल माल उधार दिया था (30 दिन की उधारी शर्त)',
    status: 'active',
    settlements: [
      {
        id: 's-1',
        amount: 20000,
        mode: 'cash_online',
        date: '2026-08-25',
        note: 'UPI द्वारा आंशिक बैंक ट्रांसफर'
      },
      {
        id: 's-2',
        amount: 10000,
        mode: 'samaan_goods',
        date: '2026-09-02',
        note: '5 बोरी उत्तम बासमती चावल देकर हिसाब काटा'
      }
    ]
  },
  {
    id: 'u-2',
    our_business_name: 'आर.के. हार्डवेयर मार्ट',
    our_business_gstin: '09AAACS1234F1Z5',
    linked_member_name: 'रोहन',
    person_name: 'सुनील हार्डवेयर सप्लायर्स',
    father_name: '',
    address: 'वार्ड 4, इंडस्ट्रियल एरिया',
    phone: '9811223344',
    party_gstin: '09CCWPS9911L1Z8',
    party_pan: 'CCWPS9911L',
    photo_urls: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'],
    type: 'taken',
    original_amount: 22000,
    remaining_balance: 22000,
    credit_limit: 30000,
    payment_mode: 'cheque',
    tenure_days: 45,
    start_date: '2026-08-10',
    due_date: '2026-09-25',
    promised_return_date: '2026-09-25',
    sync_to_family_wealth: false,
    delivery_type: 'transport',
    pipeline_stage: 'in_transit',
    promised_tenure_days: 45,
    bilty_number: 'BL-84920',
    transport_name: 'VRL लॉजिस्टिक्स',
    dispatch_date: '2026-08-11',
    expected_arrival_date: '2026-08-14',
    dispatch_otp: '517392',
    is_dispatch_otp_verified: true,
    delivery_otp: '930182',
    otp_code: '517392',
    is_otp_verified: false,
    notes: 'प्लंबिंग व PVC पाइप का बिल (ट्रांसपोर्ट द्वारा डिस्पैच)',
    status: 'active',
    settlements: []
  },
  {
    id: 'u-3',
    our_business_name: 'शर्मा एग्रो वर्क्स',
    linked_member_name: 'पापा',
    person_name: 'बलबीर ट्रैक्टर रिपेयर',
    father_name: 'श्री हरनाम सिंह',
    address: 'ग्राम रामपुर',
    phone: '9826019283',
    type: 'given',
    original_amount: 12000,
    remaining_balance: 0,
    payment_mode: 'cash',
    tenure_days: 60,
    start_date: '2026-05-10',
    due_date: '2026-07-10',
    promised_return_date: '2026-07-10',
    sync_to_family_wealth: false,
    delivery_type: 'hand_to_hand',
    pipeline_stage: 'settled',
    promised_tenure_days: 60,
    actual_settled_days: 58,
    actual_settled_date: '2026-07-08',
    delivery_feedback: 'all_ok',
    otp_code: '639104',
    is_otp_verified: true,
    status: 'settled',
    settlements: [
      {
        id: 's-3',
        amount: 12000,
        mode: 'kaam_service',
        date: '2026-07-08',
        note: 'खेत की 3 बार जुताई व बुवाई का काम करके पूरा हिसाब चुकता किया'
      }
    ]
  },
  {
    id: 'u-4',
    our_business_name: 'शर्मा ट्रेडर्स & सप्लायर्स',
    our_business_gstin: '09AAACS1234F1Z5',
    linked_member_name: 'पापा',
    person_name: 'गुप्ता बिल्डिंग मैटेरियल्स',
    father_name: 'श्री राधेश्याम गुप्ता',
    address: 'बायपास रोड, उन्नाव',
    phone: '9839012345',
    party_gstin: '09AABCG7890M1Z3',
    type: 'given',
    original_amount: 85000,
    remaining_balance: 85000,
    credit_limit: 100000,
    payment_mode: 'bank_transfer',
    tenure_days: 30,
    start_date: '2026-09-20',
    due_date: '2026-10-20',
    promised_return_date: '2026-10-20',
    sync_to_family_wealth: false,
    delivery_type: 'transport',
    pipeline_stage: 'quotation',
    estimated_amount: 85000,
    material_description: '150 बैग अल्ट्राटेक सीमेंट व 2 ट्रॉली मौरंग',
    quotation_date: '2026-09-20',
    promised_tenure_days: 30,
    dispatch_otp: '394812',
    otp_code: '394812',
    is_otp_verified: false,
    notes: 'प्रारंभिक कोटेशन (ऑटो व कार्टेज खर्चा माल डिस्पैच पर जुड़ेगा)',
    status: 'active',
    settlements: []
  },
  {
    id: 'u-5',
    our_business_name: 'शर्मा ट्रेडर्स & सप्लायर्स',
    linked_member_name: 'रोहन',
    person_name: 'वर्मा इलेक्ट्रिकल्स',
    address: 'मेन मार्केट, कानपुर',
    phone: '9792001122',
    type: 'given',
    original_amount: 30000,
    remaining_balance: 0,
    payment_mode: 'upi',
    tenure_days: 30,
    start_date: '2026-07-01',
    due_date: '2026-07-31',
    promised_return_date: '2026-07-31',
    sync_to_family_wealth: false,
    delivery_type: 'transport',
    pipeline_stage: 'settled',
    promised_tenure_days: 30,
    actual_settled_days: 42,
    actual_settled_date: '2026-08-12',
    bilty_number: 'BL-71201',
    transport_name: 'न्यू इंडिया कार्गो',
    delivery_feedback: 'all_ok',
    otp_code: '419082',
    is_otp_verified: true,
    notes: 'केबल व स्विच गियर (12 दिन विलंब से चुकता हुआ)',
    status: 'settled',
    settlements: [
      {
        id: 's-5',
        amount: 30000,
        mode: 'cash_online',
        date: '2026-08-12',
        note: 'विलंब के बाद NEFT से पूरा भुगतान प्राप्त'
      }
    ]
  }
];

export function UdharLedgerModule() {
  const familyStore = useFamilyStore();
  const members = familyStore?.members || [];

  const [contacts, setContacts] = useState<UdharContact[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_udhar_b2b_retail_v6');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {}
      }
    }
    return []; // Clean empty slate by default for real user accounts!
  });

  const [filter, setFilter] = useState<'all' | 'given' | 'taken' | 'settled'>('all');

  // Modals
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [otpVerifyContact, setOtpVerifyContact] = useState<UdharContact | null>(null);
  const [inputOtp, setInputOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  // Task 5: Mandate Management State
  const [activeMandateContactId, setActiveMandateContactId] = useState<string | null>(null);
  const [mandates, setMandates] = useState<Record<string, UdharMandate>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_udhar_mandates_v1');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fwa_udhar_mandates_v1', JSON.stringify(mandates));
    }
  }, [mandates]);

  const handleUpdateMandate = (contactId: string, updated: UdharMandate) => {
    setMandates(prev => ({ ...prev, [contactId]: updated }));
  };

  // Persistent Business Info (Stores real vendor profile so they never re-type it)
  const [ourBizName, setOurBizName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fwa_udhar_biz_name') || '';
    }
    return '';
  });
  const [ourGstin, setOurGstin] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fwa_udhar_biz_gstin') || '';
    }
    return '';
  });
  const [linkedMember, setLinkedMember] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fwa_udhar_biz_rep') || '';
    }
    return '';
  });

  const handleBizNameChange = (val: string) => {
    setOurBizName(val);
    if (typeof window !== 'undefined') localStorage.setItem('fwa_udhar_biz_name', val);
  };
  const handleOurGstinChange = (val: string) => {
    setOurGstin(val);
    if (typeof window !== 'undefined') localStorage.setItem('fwa_udhar_biz_gstin', val);
  };
  const handleLinkedMemberChange = (val: string) => {
    setLinkedMember(val);
    if (typeof window !== 'undefined') localStorage.setItem('fwa_udhar_biz_rep', val);
  };

  const hasDemoContacts = contacts.some(c => ['u-1', 'u-2', 'u-3', 'u-4', 'u-5'].includes(c.id));

  const handleClearAllData = () => {
    if (confirm('क्या आप सभी डमी / सैंपल रिकॉर्ड हटाकर बिल्कुल साफ़ (Fresh) खाता शुरू करना चाहते हैं?')) {
      setContacts([]);
      if (typeof window !== 'undefined') {
        localStorage.setItem('fwa_udhar_b2b_retail_v6', JSON.stringify([]));
      }
    }
  };

  const handleLoadDemoData = () => {
    setContacts(DEFAULT_UDHAR_CONTACTS);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fwa_udhar_b2b_retail_v6', JSON.stringify(DEFAULT_UDHAR_CONTACTS));
    }
  };

  // Form State: Party Info (Task 1: Phone mandatory, GSTIN optional, Unique Vendor identity)
  const [personName, setPersonName] = useState('');
  const [fatherName, setFatherName] = useState(''); // Optional
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [partyGstin, setPartyGstin] = useState('');
  const [partyPan, setPartyPan] = useState('');

  // Task 1: Deduplication & Validation Feedback State
  const [phoneError, setPhoneError] = useState('');
  const [gstinError, setGstinError] = useState('');
  const [panError, setPanError] = useState('');
  const [customerPhoto, setCustomerPhoto] = useState<string | null>(null);
  const [customerPhotoError, setCustomerPhotoError] = useState('');
  const [matchedVendor, setMatchedVendor] = useState<UdharContact | null>(null);

  // Form State: Loan Terms
  const [udharType, setUdharType] = useState<'given' | 'taken'>('given');
  const [amount, setAmount] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [paymentMode, setPaymentMode] = useState<UdharContact['payment_mode']>('cash');
  
  // Tenure in days presets (15, 30, 45, 60, 90, custom)
  const [tenureDays, setTenureDays] = useState<number>(30);
  const [customDays, setCustomDays] = useState('');
  const [syncToWealth, setSyncToWealth] = useState(false);
  const [notes, setNotes] = useState('');

  // Task 2.6 & Task 2.7: Delivery Type & Quotation/Dispatch Pipeline States
  const [deliveryType, setDeliveryType] = useState<'hand_to_hand' | 'transport'>('hand_to_hand');
  const [isQuotation, setIsQuotation] = useState(false);
  const [materialDesc, setMaterialDesc] = useState('');
  const [initialBilty, setInitialBilty] = useState('');
  const [initialTransport, setInitialTransport] = useState('');

  // Dispatch Modal State (Quotation -> In-Transit)
  const [dispatchingContact, setDispatchingContact] = useState<UdharContact | null>(null);
  const [dispatchFinalAmount, setDispatchFinalAmount] = useState('');
  const [dispatchCartageFee, setDispatchCartageFee] = useState('');
  const [dispatchBilty, setDispatchBilty] = useState('');
  const [dispatchTransport, setDispatchTransport] = useState('');
  const [dispatchExpectedDate, setDispatchExpectedDate] = useState('');
  const [dispatchNotes, setDispatchNotes] = useState('');
  const [dispatchError, setDispatchError] = useState('');

  // Delivery Confirmation Modal State (2nd OTP & Feedback)
  const [deliveringContact, setDeliveringContact] = useState<UdharContact | null>(null);
  const [deliveryOtpInput, setDeliveryOtpInput] = useState('');
  const [deliveryFeedback, setDeliveryFeedback] = useState<'all_ok' | 'discrepancy_reported'>('all_ok');
  const [deliveryDisputeNote, setDeliveryDisputeNote] = useState('');
  const [deliveryOtpError, setDeliveryOtpError] = useState('');

  // Cross-Vendor Trust Ledger Modal
  const [showTrustLedgerModal, setShowTrustLedgerModal] = useState(false);
  const [trustSearchTerm, setTrustSearchTerm] = useState('');

  // Task 2: Terms & Conditions State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('t-30-days');
  const [termsText, setTermsText] = useState<string>(PREBUILT_UDHAR_TEMPLATES[0].content);
  const [customTemplatesList, setCustomTemplatesList] = useState<UdharTermsTemplate[]>(() => {
    return typeof window !== 'undefined' ? getCustomTemplates() : [];
  });

  // Task 2.5: Mandatory Bill Proof State (Option A vs Option B)
  const [billProofMode, setBillProofMode] = useState<'file' | 'manual'>('file');
  const [billFile, setBillFile] = useState<{ name: string; type: string; size: number; dataUrl: string } | null>(null);
  const [billNumber, setBillNumber] = useState('');
  const [billDate, setBillDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [billAmount, setBillAmount] = useState('');
  const [billProofError, setBillProofError] = useState('');
  const [duplicateBillWarning, setDuplicateBillWarning] = useState('');

  // Modal Viewer for full-screen bill proof
  const [viewingProof, setViewingProof] = useState<{ title: string; filename: string; filetype: string; dataUrl: string } | null>(null);
  const [loadingProofId, setLoadingProofId] = useState<string | null>(null);

  // Form State: Settlement
  const [settleAmount, setSettleAmount] = useState('');
  const [settleMode, setSettleMode] = useState<UdharSettlementMode>('cash_online');
  const [settleNote, setSettleNote] = useState('');

  // Task 2: Bill Amendment State (Immutable Bill Proof & Dispute Corrections)
  const [amendingContact, setAmendingContact] = useState<UdharContact | null>(null);
  const [amendAmount, setAmendAmount] = useState('');
  const [amendBillNumber, setAmendBillNumber] = useState('');
  const [amendBillDate, setAmendBillDate] = useState('');
  const [amendTenureDays, setAmendTenureDays] = useState<number>(30);
  const [amendReason, setAmendReason] = useState('');
  const [amendError, setAmendError] = useState('');

  // Task 2: Dispute Resolution Modal State
  const [resolvingDisputeContact, setResolvingDisputeContact] = useState<UdharContact | null>(null);
  const [disputeAgreedAmount, setDisputeAgreedAmount] = useState('');
  const [disputeResolutionNote, setDisputeResolutionNote] = useState('');
  const [disputeResolutionError, setDisputeResolutionError] = useState('');

  // Handle Bill Number change with duplicate warning
  const handleBillNumberChange = (val: string) => {
    setBillNumber(val);
    setDuplicateBillWarning('');
    if (val.trim()) {
      const match = contacts.find(c => c.bill_number && c.bill_number.trim().toLowerCase() === val.trim().toLowerCase());
      if (match) {
        setDuplicateBillWarning(`⚠️ चेतावनी: बिल नंबर "${val.trim()}" पहले से "${match.person_name}" के रिकॉर्ड में दर्ज है!`);
      }
    }
  };

  // Handle Bill File Upload (Max 5MB, JPG/PNG/PDF)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setBillProofError('फ़ाइल बहुत बड़ी है (5MB से अधिक)! कृपया 5MB तक की JPG, PNG या PDF चुनें।');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setBillFile({
        name: file.name,
        type: file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
        size: file.size,
        dataUrl: reader.result as string
      });
      setBillProofError('');
    };
    reader.readAsDataURL(file);
  };

  // View Bill Proof in Modal (loads from IndexedDB)
  const handleOpenProof = async (c: UdharContact) => {
    setLoadingProofId(c.id);
    try {
      const proofUrl = await getBillProof(c.id);
      if (proofUrl) {
        setViewingProof({
          title: `बिल प्रमाण — ${c.person_name}`,
          filename: c.bill_proof_filename || 'bill_document',
          filetype: c.bill_proof_filetype || 'image/jpeg',
          dataUrl: proofUrl
        });
      } else if (c.bill_number) {
        alert(`मैन्युअल बिल विवरण:\n• बिल नंबर: ${c.bill_number}\n• तारीख: ${c.bill_date || c.start_date}\n• रकम: ₹${c.bill_amount ? c.bill_amount.toLocaleString('en-IN') : c.original_amount.toLocaleString('en-IN')}`);
      } else {
        alert('इस लेन-देन के साथ कोई डिजिटल बिल फ़ाइल संलग्न नहीं है।');
      }
    } catch (e) {
      alert('बिल फ़ाइल लोड करने में त्रुटि हुई।');
    } finally {
      setLoadingProofId(null);
    }
  };

  // Live Phone Change with Deduplication Matcher
  const handlePhoneChange = (val: string) => {
    const rawDigits = val.replace(/\D/g, '').slice(0, 10);
    setPhone(rawDigits);
    setPhoneError('');

    if (rawDigits.length === 10) {
      if (!isValidIndianPhone(rawDigits)) {
        setPhoneError('अमान्य मोबाइल नंबर! 10 अंक 6, 7, 8 या 9 से शुरू होने चाहिए।');
      } else {
        // Check for existing vendor identity
        const check = findExistingVendor(rawDigits, partyGstin, contacts);
        if (check.isMatch && check.existingVendor) {
          setMatchedVendor(check.existingVendor);
          setPersonName(check.existingVendor.person_name);
          if (check.existingVendor.father_name) setFatherName(check.existingVendor.father_name);
          if (check.existingVendor.address) setAddress(check.existingVendor.address);
          if (check.existingVendor.party_gstin && !partyGstin) setPartyGstin(check.existingVendor.party_gstin);
          if (check.existingVendor.party_pan && !partyPan) setPartyPan(check.existingVendor.party_pan);
          if (check.existingVendor.credit_limit && !creditLimit) setCreditLimit(check.existingVendor.credit_limit.toString());
          if (check.existingVendor.tenure_days) setTenureDays(check.existingVendor.tenure_days);
          if (check.existingVendor.terms_and_conditions) setTermsText(check.existingVendor.terms_and_conditions);
          if (check.existingVendor.photo_urls && check.existingVendor.photo_urls.length > 0) {
            setCustomerPhotoError('');
          }
        } else {
          setMatchedVendor(null);
        }
      }
    } else {
      setMatchedVendor(null);
    }
  };

  // Live GSTIN Change with Deduplication Matcher
  const handleGstinChange = (val: string) => {
    const upper = val.trim().toUpperCase();
    setPartyGstin(upper);
    setGstinError('');

    if (upper.length >= 15) {
      if (!isValidGstin(upper)) {
        setGstinError('अमान्य GSTIN प्रारूप! (उदा. 09AAACS1234F1Z5)');
      } else {
        const check = findExistingVendor(phone, upper, contacts);
        if (check.isMatch && check.existingVendor) {
          setMatchedVendor(check.existingVendor);
          if (!personName) setPersonName(check.existingVendor.person_name);
          if (check.existingVendor.phone && !phone) setPhone(check.existingVendor.phone);
          if (check.existingVendor.father_name && !fatherName) setFatherName(check.existingVendor.father_name);
          if (check.existingVendor.address && !address) setAddress(check.existingVendor.address);
          if (check.existingVendor.party_pan && !partyPan) setPartyPan(check.existingVendor.party_pan);
          if (check.existingVendor.credit_limit && !creditLimit) setCreditLimit(check.existingVendor.credit_limit.toString());
          if (check.existingVendor.tenure_days) setTenureDays(check.existingVendor.tenure_days);
          if (check.existingVendor.terms_and_conditions) setTermsText(check.existingVendor.terms_and_conditions);
        }
      }
    }
  };

  // Task 1: Live PAN Change with Validation
  const handlePanChange = (val: string) => {
    const upper = val.trim().toUpperCase().slice(0, 10);
    setPartyPan(upper);
    setPanError('');

    if (upper.length === 10) {
      if (!isValidPan(upper)) {
        setPanError('अमान्य PAN प्रारूप! 10 अक्षर (उदा. ABCDE1234F) होने चाहिए।');
      }
    }
  };

  // Task 1: Customer Photo Upload / Camera Capture
  const handleCustomerPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setCustomerPhotoError('फोटो साइज 3MB से अधिक है! कृपया छोटी फोटो चुनें।');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCustomerPhoto(reader.result as string);
      setCustomerPhotoError('');
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    localStorage.setItem('fwa_udhar_b2b_retail_v6', JSON.stringify(contacts));
    
    // Sync total synced receivable to localStorage for wealth engine
    const syncedReceivableTotal = contacts
      .filter(u => u.sync_to_family_wealth && u.type === 'given' && u.status === 'active')
      .reduce((sum, u) => sum + Number(u.remaining_balance || 0), 0);
    localStorage.setItem('fwa_udhar_synced_wealth_amount', syncedReceivableTotal.toString());
  }, [contacts]);

  const activeContact = contacts.find(c => c.id === selectedContactId);

  const totalReceivable = contacts
    .filter(u => u.type === 'given' && u.status === 'active')
    .reduce((sum, u) => sum + Number(u.remaining_balance || 0), 0);

  const totalPayable = contacts
    .filter(u => u.type === 'taken' && u.status === 'active')
    .reduce((sum, u) => sum + Number(u.remaining_balance || 0), 0);

  const totalSyncedToWealth = contacts
    .filter(u => u.sync_to_family_wealth && u.type === 'given' && u.status === 'active')
    .reduce((sum, u) => sum + Number(u.remaining_balance || 0), 0);

  // Task 3 & Task 4: Two-Way Trust Ratings Calculation with Dispute Neutral Exclusion
  // Unresolved disputes (pipeline_stage === 'disputed' && !is_dispute_resolved) are strictly excluded from ratings!
  const deliveryTrustPercent = calculateDeliveryTrustScore(contacts);
  const repaymentTrustPercent = calculateRepaymentTrustScore(contacts);

  // Task 4: Cross-vendor data access & party summary aggregation
  const ourGivenCount = contacts.filter(c => c.type === 'given').length;
  const isCrossVendorUnlocked = ourGivenCount > 0;
  const partyTrustSummaries = aggregateCrossVendorPartySummaries(contacts);

  const filteredContacts = contacts.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'given') return c.type === 'given' && c.status === 'active';
    if (filter === 'taken') return c.type === 'taken' && c.status === 'active';
    if (filter === 'settled') return c.status === 'settled';
    return true;
  });

  const handleTenurePreset = (days: number) => {
    setTenureDays(days);
    setCustomDays('');
  };

  // Check if entered phone matches an existing customer who already has a photo on record
  const cleanPhoneDigitsForCheck = normalizePhoneNumber(phone);
  const existingCustomerWithPhoto = contacts.find(
    c => normalizePhoneNumber(c.phone || '') === cleanPhoneDigitsForCheck && c.photo_urls && c.photo_urls.length > 0
  );
  const isRepeatCustomerWithPhoto = Boolean(
    (matchedVendor && matchedVendor.photo_urls && matchedVendor.photo_urls.length > 0) ||
    existingCustomerWithPhoto
  );

  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(amount);
    if (!personName.trim() || !numAmt || numAmt <= 0) return;

    // Task 1: Strict Phone Number Validation (Mandatory 10-digit Indian Mobile)
    const cleanPhoneDigits = normalizePhoneNumber(phone);
    if (!cleanPhoneDigits || !isValidIndianPhone(cleanPhoneDigits)) {
      setPhoneError('कृपया मान्य 10-अंकीय भारतीय मोबाइल नंबर दर्ज करें (शुरुआत 6, 7, 8 या 9 से)।');
      return;
    }

    // Task 1: Optional 15-character GSTIN Validation
    const cleanGst = normalizeGstin(partyGstin);
    if (cleanGst && !isValidGstin(cleanGst)) {
      setGstinError('अमान्य GSTIN प्रारूप! कृपया 15-अंकीय सही GSTIN दर्ज करें (उदा. 09AAACS1234F1Z5)।');
      return;
    }

    // Task 1: Optional 10-character PAN Validation
    const cleanPan = normalizePan(partyPan);
    if (cleanPan && !isValidPan(cleanPan)) {
      setPanError('अमान्य PAN प्रारूप! कृपया 10-अंकीय सही PAN दर्ज करें (उदा. ABCDE1234F)।');
      return;
    }

    // Task 1: Mandatory Customer Photo on First Udhar Transaction
    if (!isRepeatCustomerWithPhoto && !customerPhoto) {
      setCustomerPhotoError('पहली उधारी के लिए ग्राहक/पार्टी की लाइव फोटो (कैमरा/अपलोड) अनिवार्य है!');
      return;
    }

    const resolvedPhotoUrls: string[] = customerPhoto
      ? [customerPhoto, ...(matchedVendor?.photo_urls || existingCustomerWithPhoto?.photo_urls || [])]
      : (matchedVendor?.photo_urls || existingCustomerWithPhoto?.photo_urls || []);

    // Task 2.5: Mandatory Bill Proof Validation (Option A: File OR Option B: Manual Details)
    const hasFileProof = billProofMode === 'file' && !!billFile;
    const hasManualProof = billProofMode === 'manual' && !!billNumber.trim() && !!billAmount.trim();

    if (!hasFileProof && !hasManualProof) {
      setBillProofError('अनिवार्य बिल प्रमाण: कृपया बिल फोटो/PDF अपलोड करें (विकल्प A) या बिल नंबर व रकम दर्ज करें (विकल्प B)।');
      return;
    }

    // Task 2: Custom T&C Persistence for Reusability
    if (termsText.trim()) {
      const savedTpl = saveCustomTemplate(termsText);
      if (savedTpl) {
        setCustomTemplatesList(prev => [savedTpl, ...prev]);
      }
    }

    const days = customDays ? parseInt(customDays) : tenureDays;
    const startDate = new Date();
    const dueDateObj = new Date();
    dueDateObj.setDate(dueDateObj.getDate() + (days || 30));
    const dueDateStr = dueDateObj.toISOString().split('T')[0];

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const newContactId = 'u-' + Date.now();

    // Persist heavy bill file to IndexedDB
    if (hasFileProof && billFile) {
      saveBillProof(newContactId, billFile.dataUrl);
    }

    const newContact: UdharContact = {
      id: newContactId,
      our_business_name: ourBizName.trim() || 'मेरा व्यापार',
      our_business_gstin: ourGstin.trim().toUpperCase() || undefined,
      linked_member_name: linkedMember || undefined,
      person_name: personName.trim(),
      father_name: fatherName.trim() || undefined,
      address: address.trim() || undefined,
      phone: cleanPhoneDigits,
      party_gstin: cleanGst || undefined,
      party_pan: cleanPan || undefined,
      photo_urls: resolvedPhotoUrls.length > 0 ? resolvedPhotoUrls : undefined,
      type: udharType,
      original_amount: numAmt,
      remaining_balance: numAmt,
      credit_limit: creditLimit ? parseFloat(creditLimit) : undefined,
      payment_mode: paymentMode,
      tenure_days: days || 30,
      start_date: startDate.toISOString().split('T')[0],
      due_date: dueDateStr,
      promised_return_date: dueDateStr,

      // Task 2: Immutable Terms & Conditions Snapshot
      terms_and_conditions: termsText.trim() || undefined,
      terms_template_title: PREBUILT_UDHAR_TEMPLATES.find(t => t.id === selectedTemplateId)?.title,

      // Task 2.5: Mandatory Bill Proof
      bill_proof_type: hasFileProof ? 'file' : 'manual',
      bill_proof_filename: hasFileProof && billFile ? billFile.name : undefined,
      bill_proof_filetype: hasFileProof && billFile ? billFile.type : undefined,
      bill_proof_filesize: hasFileProof && billFile ? billFile.size : undefined,
      bill_number: hasManualProof ? billNumber.trim() : (hasFileProof && billNumber.trim() ? billNumber.trim() : undefined),
      bill_date: hasManualProof ? billDate : undefined,
      bill_amount: hasManualProof ? parseFloat(billAmount) : undefined,

      // Task 2.6 & Task 2.7: Delivery Type & Quotation/Dispatch Pipeline
      delivery_type: deliveryType,
      pipeline_stage: deliveryType === 'transport' ? (isQuotation ? 'quotation' : 'in_transit') : 'confirmed',
      estimated_amount: isQuotation ? numAmt : undefined,
      material_description: materialDesc.trim() || undefined,
      quotation_date: isQuotation ? startDate.toISOString().split('T')[0] : undefined,
      bilty_number: !isQuotation && initialBilty.trim() ? initialBilty.trim() : undefined,
      transport_name: !isQuotation && initialTransport.trim() ? initialTransport.trim() : undefined,
      dispatch_date: (!isQuotation && deliveryType === 'transport') ? startDate.toISOString().split('T')[0] : undefined,
      dispatch_otp: isQuotation ? generatedOtp : undefined,
      delivery_otp: deliveryType === 'transport' ? Math.floor(100000 + Math.random() * 900000).toString() : undefined,
      delivery_feedback: deliveryType === 'hand_to_hand' ? 'all_ok' : undefined,
      promised_tenure_days: days || 30,

      sync_to_family_wealth: syncToWealth,
      otp_code: generatedOtp,
      is_otp_verified: false,
      notes: notes.trim() || undefined,
      status: 'active',
      settlements: []
    };

    setContacts([newContact, ...contacts]);
    setIsAddContactOpen(false);
    setPersonName('');
    setFatherName('');
    setAddress('');
    setPhone('');
    setPartyGstin('');
    setPartyPan('');
    setCustomerPhoto(null);
    setCustomerPhotoError('');
    setAmount('');
    setCreditLimit('');
    setPaymentMode('cash');
    setCustomDays('');
    setNotes('');
    setPhoneError('');
    setGstinError('');
    setPanError('');
    setMatchedVendor(null);

    // Reset Task 2.6 Delivery Form
    setDeliveryType('hand_to_hand');
    setIsQuotation(false);
    setMaterialDesc('');
    setInitialBilty('');
    setInitialTransport('');

    // Reset Bill & Terms Form
    setBillFile(null);
    setBillNumber('');
    setBillAmount('');
    setBillProofError('');
    setDuplicateBillWarning('');
    setTermsText(PREBUILT_UDHAR_TEMPLATES[0].content);
    setSelectedTemplateId('t-30-days');
  };

  const toggleWealthSync = (id: string) => {
    setContacts(contacts.map(c => c.id === id ? { ...c, sync_to_family_wealth: !c.sync_to_family_wealth } : c));
  };

  // Dispatch Action: Open modal to lock final bill amount, cartage, and bilty details
  const handleOpenDispatchModal = (c: UdharContact) => {
    setDispatchingContact(c);
    setDispatchFinalAmount((c.estimated_amount || c.original_amount).toString());
    setDispatchCartageFee('');
    setDispatchBilty('');
    setDispatchTransport('');
    const exp = new Date();
    exp.setDate(exp.getDate() + 3);
    setDispatchExpectedDate(exp.toISOString().split('T')[0]);
    setDispatchNotes('');
    setDispatchError('');
  };

  // Dispatch Action Submit: Lock final amount and generate 2nd Delivery OTP
  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchingContact) return;

    const finalAmt = parseFloat(dispatchFinalAmount);
    if (!finalAmt || finalAmt <= 0) {
      setDispatchError('कृपया मान्य फ़ाइनल बिल रकम दर्ज करें।');
      return;
    }
    if (!dispatchBilty.trim()) {
      setDispatchError('कृपया ट्रांसपोर्ट बिल्टी (LR) नंबर दर्ज करें।');
      return;
    }

    // Generate 2nd OTP for customer delivery confirmation
    const newDeliveryOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const todayStr = new Date().toISOString().split('T')[0];

    const updated: UdharContact = {
      ...dispatchingContact,
      original_amount: finalAmt,
      remaining_balance: finalAmt,
      bilty_number: dispatchBilty.trim(),
      transport_name: dispatchTransport.trim() || 'ट्रांसपोर्ट',
      expected_arrival_date: dispatchExpectedDate,
      dispatch_date: todayStr,
      delivery_otp: newDeliveryOtp,
      pipeline_stage: 'in_transit',
      notes: dispatchNotes.trim()
        ? (dispatchingContact.notes ? `${dispatchingContact.notes} | डिस्पैच: ${dispatchNotes.trim()}` : `डिस्पैच: ${dispatchNotes.trim()}`)
        : dispatchingContact.notes,
    };

    setContacts(contacts.map(c => c.id === dispatchingContact.id ? updated : c));
    setDispatchingContact(null);
  };

  // Delivery Action: Open modal to verify 2nd OTP and goods feedback
  const handleOpenDeliveryModal = (c: UdharContact) => {
    setDeliveringContact(c);
    setDeliveryOtpInput(c.delivery_otp || '');
    setDeliveryFeedback('all_ok');
    setDeliveryDisputeNote('');
    setDeliveryOtpError('');
  };

  // Delivery Action Submit: Verify 2nd OTP and log feedback for trust rating
  const handleDeliveryVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveringContact) return;

    const targetOtp = deliveringContact.delivery_otp || deliveringContact.otp_code;
    if (deliveryOtpInput.trim() !== targetOtp) {
      setDeliveryOtpError('गलत 2nd OTP! कृपया सही 6-अंकीय डिलीवरी कोड दर्ज करें।');
      return;
    }

    const isOk = deliveryFeedback === 'all_ok';
    const updated: UdharContact = {
      ...deliveringContact,
      is_delivery_otp_verified: true,
      pipeline_stage: isOk ? 'confirmed' : 'disputed',
      delivery_feedback: deliveryFeedback,
      dispute_note: isOk ? undefined : (deliveryDisputeNote.trim() || 'माल में कमी/टूट-फूट दर्ज'),
    };

    setContacts(contacts.map(c => c.id === deliveringContact.id ? updated : c));
    setDeliveringContact(null);
    setDeliveryOtpInput('');
    setDeliveryOtpError('');
  };

  const handleSettlementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(settleAmount);
    if (!selectedContactId || !activeContact || !numAmt || numAmt <= 0) return;

    const newBal = Math.max(0, activeContact.remaining_balance - numAmt);
    const todayStr = new Date().toISOString().split('T')[0];
    const isFullySettled = newBal === 0;

    let settledDays = activeContact.actual_settled_days;
    if (isFullySettled && !settledDays) {
      const start = new Date(activeContact.start_date).getTime();
      const now = new Date().getTime();
      settledDays = Math.max(1, Math.round((now - start) / (1000 * 60 * 60 * 24)));
    }

    const newSettlement: UdharSettlement = {
      id: 'set-' + Date.now(),
      amount: numAmt,
      mode: settleMode,
      date: todayStr,
      note: settleNote || (settleMode === 'cash_online' ? 'कैश/ऑनलाइन पेमेंट' : settleMode === 'samaan_goods' ? 'सामान देकर हिसाब काटा' : 'काम करके हिसाब काटा')
    };

    const updated: UdharContact = {
      ...activeContact,
      remaining_balance: newBal,
      status: isFullySettled ? 'settled' : 'active',
      pipeline_stage: isFullySettled ? 'settled' : activeContact.pipeline_stage,
      actual_settled_days: settledDays,
      actual_settled_date: isFullySettled ? todayStr : activeContact.actual_settled_date,
      settlements: [newSettlement, ...activeContact.settlements]
    };

    // Task 5 Sub-task B: If transaction manually marked paid, auto-cancel linked mandate to prevent double-charging!
    if (isFullySettled && selectedContactId && mandates[selectedContactId]) {
      const existingMandate = mandates[selectedContactId];
      if (existingMandate.status !== 'cancelled' && existingMandate.status !== 'executed') {
        const cancelledMandate: UdharMandate = {
          ...existingMandate,
          status: 'cancelled',
          failure_reason: `ग्राहक द्वारा मैन्युअल भुगतान प्राप्त (₹${numAmt}) — डबल वसूली रोकने हेतु मैंडेट स्वतः रद्द`,
          updated_at: new Date().toISOString()
        };
        handleUpdateMandate(selectedContactId, cancelledMandate);
      }
    }

    setContacts(contacts.map(c => c.id === selectedContactId ? updated : c));
    setSelectedContactId(null);
    setSettleAmount('');
    setSettleNote('');
  };

  // Task 5 Sub-task B: Handler when payment collected via UPI Autopay Mandate
  const handleMandateCollect = (contactId: string, collectedAmt: number, note: string) => {
    const target = contacts.find(c => c.id === contactId);
    if (!target) return;

    const newBal = Math.max(0, target.remaining_balance - collectedAmt);
    const todayStr = new Date().toISOString().split('T')[0];
    const isFullySettled = newBal === 0;

    let settledDays = target.actual_settled_days;
    if (isFullySettled && !settledDays) {
      const start = new Date(target.start_date).getTime();
      const now = new Date().getTime();
      settledDays = Math.max(1, Math.round((now - start) / (1000 * 60 * 60 * 24)));
    }

    const mandateSettlement: UdharSettlement = {
      id: 'set-mandate-' + Date.now(),
      amount: collectedAmt,
      mode: 'cash_online',
      date: todayStr,
      note: note
    };

    const updated: UdharContact = {
      ...target,
      remaining_balance: newBal,
      status: isFullySettled ? 'settled' : target.status,
      pipeline_stage: isFullySettled ? 'settled' : target.pipeline_stage,
      actual_settled_days: settledDays,
      actual_settled_date: isFullySettled ? todayStr : target.actual_settled_date,
      settlements: [mandateSettlement, ...target.settlements]
    };

    setContacts(contacts.map(c => c.id === contactId ? updated : c));
  };

  // Task 2: Open Bill Amendment Modal
  const handleOpenAmendModal = (c: UdharContact) => {
    setAmendingContact(c);
    setAmendAmount(c.original_amount.toString());
    setAmendBillNumber(c.bill_number || '');
    setAmendBillDate(c.bill_date || c.start_date);
    setAmendTenureDays(c.tenure_days || 30);
    setAmendReason('');
    setAmendError('');
  };

  // Task 2: Submit Bill Amendment (Never modifies existing record in-place, creates linked amended record)
  const handleAmendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amendingContact) return;

    const newAmt = parseFloat(amendAmount);
    if (!newAmt || newAmt <= 0) {
      setAmendError('कृपया मान्य संशोधित बिल रकम दर्ज करें।');
      return;
    }
    if (!amendReason.trim()) {
      setAmendError('संशोधन का स्पष्ट कारण लिखना अनिवार्य है (ताकि ऑडिट ट्रेल सुरक्षित रहे)।');
      return;
    }

    const nextVersion = (amendingContact.amendment_version || 1) + 1;
    const newAmendedId = 'u-' + Date.now();

    // Preserve previous settlements/payments if any
    const alreadyPaid = Math.max(0, amendingContact.original_amount - amendingContact.remaining_balance);
    const newRemaining = Math.max(0, newAmt - alreadyPaid);

    const newAmendedRecord: UdharContact = {
      ...amendingContact,
      id: newAmendedId,
      amended_from_id: amendingContact.id,
      amendment_version: nextVersion,
      amendment_reason: amendReason.trim(),
      is_amended: false,
      original_amount: newAmt,
      remaining_balance: newRemaining,
      bill_number: amendBillNumber.trim() || amendingContact.bill_number,
      bill_date: amendBillDate || amendingContact.bill_date,
      tenure_days: amendTenureDays,
      promised_tenure_days: amendTenureDays,
      notes: amendingContact.notes
        ? `${amendingContact.notes} | संशोधित (v${nextVersion}): ${amendReason.trim()}`
        : `संशोधित (v${nextVersion}): ${amendReason.trim()}`,
      status: newRemaining === 0 ? 'settled' : 'active'
    };

    // Mark original record as superseded / amended (retains all proof and history)
    const updatedOriginalRecord: UdharContact = {
      ...amendingContact,
      is_amended: true
    };

    setContacts(contacts.map(c => c.id === amendingContact.id ? updatedOriginalRecord : c).concat([newAmendedRecord]));
    setAmendingContact(null);
  };

  // Task 2: Open Dispute Resolution Modal
  const handleOpenDisputeResolveModal = (c: UdharContact) => {
    setResolvingDisputeContact(c);
    setDisputeAgreedAmount(c.remaining_balance.toString());
    setDisputeResolutionNote('');
    setDisputeResolutionError('');
  };

  // Task 2: Submit Dispute Resolution via Amended Record (Never overwrite disputed record in-place)
  const handleDisputeResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingDisputeContact) return;

    const agreedAmt = parseFloat(disputeAgreedAmount);
    if (isNaN(agreedAmt) || agreedAmt < 0) {
      setDisputeResolutionError('कृपया मान्य समझौता/सहमति रकम दर्ज करें (0 या अधिक)।');
      return;
    }
    if (!disputeResolutionNote.trim()) {
      setDisputeResolutionError('विवाद समाधान की लिखित टिप्पणी/समझौता विवरण अनिवार्य है।');
      return;
    }

    const nextVersion = (resolvingDisputeContact.amendment_version || 1) + 1;
    const resolvedRecordId = 'u-' + Date.now();
    const resolutionTimestamp = new Date().toISOString();

    const resolvedRecord: UdharContact = {
      ...resolvingDisputeContact,
      id: resolvedRecordId,
      amended_from_id: resolvingDisputeContact.id,
      amendment_version: nextVersion,
      amendment_reason: `विवाद समाधान समझौता: ${disputeResolutionNote.trim()}`,
      is_amended: false,
      pipeline_stage: agreedAmt === 0 ? 'settled' : 'confirmed',
      delivery_feedback: 'all_ok',
      is_dispute_resolved: true,
      dispute_resolved_at: resolutionTimestamp,
      dispute_resolution_note: disputeResolutionNote.trim(),
      original_amount: agreedAmt,
      remaining_balance: agreedAmt,
      status: agreedAmt === 0 ? 'settled' : 'active',
      notes: resolvingDisputeContact.notes
        ? `${resolvingDisputeContact.notes} | विवाद समाधान (v${nextVersion}): ${disputeResolutionNote.trim()}`
        : `विवाद समाधान (v${nextVersion}): ${disputeResolutionNote.trim()}`
    };

    const updatedDisputedOriginal: UdharContact = {
      ...resolvingDisputeContact,
      is_amended: true, // marked as superseded
      is_dispute_resolved: true,
      dispute_resolved_at: resolutionTimestamp,
      dispute_resolution_note: disputeResolutionNote.trim()
    };

    setContacts(contacts.map(c => c.id === resolvingDisputeContact.id ? updatedDisputedOriginal : c).concat([resolvedRecord]));
    setResolvingDisputeContact(null);
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpVerifyContact) return;

    if (inputOtp.trim() === otpVerifyContact.otp_code) {
      setContacts(contacts.map(c => c.id === otpVerifyContact.id ? { ...c, is_otp_verified: true } : c));
      setOtpVerifyContact(null);
      setInputOtp('');
      setOtpError('');
    } else {
      setOtpError('गलत OTP! कृपया सही 6-अंकीय कोड दर्ज करें।');
    }
  };

  const getWhatsAppShareUrl = (c: UdharContact) => {
    const isQuotation = c.pipeline_stage === 'quotation';
    const isTransit = c.pipeline_stage === 'in_transit';

    let title = '🤝 व्यापारिक उधार रसीद व समझौता (Business Credit Agreement)';
    if (isQuotation) title = '📜 व्यापारिक कोटेशन व एस्टिमेट (Quotation / Estimate)';
    if (isTransit) title = '🚚 माल डिस्पैच व बिल्टी रसीद (Transport Dispatch & Bilty)';

    const modeLabel = c.payment_mode === 'bank_transfer' ? 'Bank Transfer' :
                      c.payment_mode === 'upi' ? 'UPI (PhonePe/GPay)' :
                      c.payment_mode === 'cheque' ? 'Cheque' : 'Cash (नकद)';

    let msg = `*${title}*\n` +
      `------------------------------------\n` +
      `🏢 *लेन-देन प्रदाता फर्म:* ${c.our_business_name} ${c.our_business_gstin ? `(GST: ${c.our_business_gstin})` : ''}\n` +
      (c.linked_member_name ? `👤 *अधिकृत प्रतिनिधि:* ${c.linked_member_name}\n` : '') +
      `------------------------------------\n` +
      `👤 *ग्राहक / रिटेलर:* ${c.person_name}\n` +
      (c.father_name ? `👨‍🦳 *पिता का नाम:* ${c.father_name}\n` : '') +
      (c.address ? `📍 *स्थान / दुकान:* ${c.address}\n` : '') +
      (c.party_gstin ? `📑 *पार्टी GSTIN:* ${c.party_gstin}\n` : '') +
      `------------------------------------\n`;

    if (isQuotation) {
      msg += `📋 *प्रकार:* शुरुआती कोटेशन (फ़ाइनल बिल डिस्पैच पर)\n` +
             `💰 *अनुमानित रकम:* ₹${(c.estimated_amount || c.original_amount).toLocaleString('en-IN')}\n` +
             (c.material_description ? `📦 *सामान:* ${c.material_description}\n` : '') +
             `⏳ *प्रस्तावित उधारी अवधि:* ${c.tenure_days} दिन\n` +
             `🔐 *कोटेशन स्वीकृति OTP:* *${c.dispatch_otp || c.otp_code}*\n`;
    } else if (isTransit) {
      msg += `🚚 *डिलीवरी प्रकार:* ट्रांसपोर्ट / बिल्टी डिस्पैच\n` +
             `📑 *बिल्टी नंबर:* ${c.bilty_number || 'उपलब्ध नहीं'}\n` +
             `🚛 *ट्रांसपोर्ट:* ${c.transport_name || 'उपलब्ध नहीं'}\n` +
             (c.expected_arrival_date ? `📅 *अनुमानित आगमन:* ${c.expected_arrival_date}\n` : '') +
             `💰 *फ़ाइनल बिल रकम (कार्टेज सहित):* ₹${c.original_amount.toLocaleString('en-IN')}\n` +
             `⏳ *उधारी अवधि:* ${c.tenure_days} दिन (देय तारीख: ${c.due_date})\n` +
             `🔐 *माल प्राप्ति OTP (2nd OTP):* *${c.delivery_otp || c.otp_code}*\n` +
             `_⚠️ कृपया सामान मिलने व जांचने के बाद ही यह OTP ड्राइवर/सप्लायर से साझा करें।_\n`;
    } else {
      msg += `💰 *क्रेडिट रकम:* ₹${c.original_amount.toLocaleString('en-IN')}\n` +
             `⏳ *अवधि:* ${c.tenure_days} दिन\n` +
             `📅 *अंतिम देय तारीख:* ${c.due_date}\n` +
             `💳 *माध्यम:* ${modeLabel}\n` +
             (c.bill_number ? `📑 *बिल संदर्भ:* #${c.bill_number}\n` : '') +
             (c.terms_and_conditions ? `⚖️ *तय व्यापारिक शर्त:* ${c.terms_and_conditions}\n` : '') +
             `🔐 *सुरक्षित OTP कोड:* *${c.otp_code}*\n`;
    }

    msg += `------------------------------------\n` +
      `_आपसी सहमति व व्यापारिक रिकॉर्ड हेतु डिजिटल साक्ष्य।_`;

    const cleanPhone = c.phone ? c.phone.replace(/[^0-9]/g, '') : '';
    const phoneParam = cleanPhone.length >= 10 ? (cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone) : '';
    
    return phoneParam 
      ? ('https://wa.me/' + phoneParam + '?text=' + encodeURIComponent(msg))
      : ('https://wa.me/?text=' + encodeURIComponent(msg));
  };

  const handleDelete = (id: string) => {
    if (confirm('क्या आप इस उधारी रिकॉर्ड को हटाना चाहते हैं?')) {
      setContacts(contacts.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-navy text-paper p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gold/20 text-gold rounded-xl">
              <HandCoins size={20} />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold font-serif">B2B Business & Retail Credit Ledger</h2>
                {ourBizName && (
                  <span className="text-[10px] bg-gold/20 text-gold-soft font-bold px-2 py-0.5 rounded-full border border-gold/30">
                    🏢 {ourBizName}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-paper-dim/80">
                {ourBizName 
                  ? `फर्म: ${ourBizName} ${ourGstin ? `(GST: ${ourGstin})` : ''} | ग्राहक उधारी, बिल व 3-Way चुकता`
                  : 'फर्म व रिटेलर उधारी, GSTIN, क्रेडिट लिमिट, अवधि (दिन) व 3-Way चुकता'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddContactOpen(true)}
            className="px-3 py-1.5 bg-gold text-navy text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-gold-light active:scale-95 transition-all shadow-sm"
          >
            <Plus size={15} /> नया उधार
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-navy-light/40 text-center">
          <div className="bg-navy-light/40 p-2 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-coral-light text-[10px] font-bold">
              <ArrowUpRight size={13} /> मुझे लेना है (Market Out)
            </div>
            <Mono className="text-sm font-bold text-coral-light mt-0.5">₹{totalReceivable.toLocaleString('en-IN')}</Mono>
          </div>

          <div className="bg-navy-light/40 p-2 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-green text-[10px] font-bold">
              <ArrowDownLeft size={13} /> मुझे देना है (Vendor In)
            </div>
            <Mono className="text-sm font-bold text-green mt-0.5">₹{totalPayable.toLocaleString('en-IN')}</Mono>
          </div>

          <div className="bg-navy-light/40 p-2 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-gold text-[10px] font-bold">
              <Landmark size={13} /> Family Wealth में सिंक
            </div>
            <Mono className="text-sm font-bold text-gold mt-0.5">₹{totalSyncedToWealth.toLocaleString('en-IN')}</Mono>
          </div>
        </div>
      </div>

      {/* Demo Data Alert Bar */}
      {hasDemoContacts && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-900 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">डेमो / सैंपल रिकॉर्ड दिख रहे हैं</p>
              <p className="text-[11px] text-amber-700">अपनी असली दुकान/ग्राहकों का वास्तविक हिसाब शुरू करने के लिए डमी डेटा साफ़ करें।</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClearAllData}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shrink-0 shadow-xs transition-all flex items-center gap-1 cursor-pointer"
          >
            <Trash2 size={13} /> डमी डेटा हटाएं (Start Fresh)
          </button>
        </div>
      )}

      {/* Task 2.7: Two-Way Trust & Reputation Rating Bar */}
      <div className="p-3 bg-paper rounded-2xl border border-paper-dim shadow-sm flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Merchant Delivery Accuracy */}
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-green-50 text-green-700 border border-green-200">
              <Truck size={16} />
            </span>
            <div>
              <span className="text-[10px] text-ink-muted uppercase block font-bold tracking-wide">
                विक्रेता डिलीवरी साख (माल शुद्धता)
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-sm font-bold text-green-700">{deliveryTrustPercent}% सही माल</span>
                <span className="text-[9px] bg-green-100 text-green-800 px-1.5 py-0.2 rounded font-semibold">100% OK</span>
              </div>
            </div>
          </div>

          <div className="hidden sm:block h-8 w-px bg-paper-dim" />

          {/* Customer Repayment On-time */}
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <Scale size={16} />
            </span>
            <div>
              <span className="text-[10px] text-ink-muted uppercase block font-bold tracking-wide">
                ग्राहक भुगतान साख (बोलने vs करने में अंतर)
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-sm font-bold text-navy">{repaymentTrustPercent}% समय पर भुगतान</span>
                <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold">ट्रैक रिकॉर्ड</span>
              </div>
            </div>
          </div>
        </div>

        {/* Button to open Cross-Vendor Reputation Ledger Modal */}
        <button
          type="button"
          onClick={() => setShowTrustLedgerModal(true)}
          className="px-3.5 py-2 bg-navy hover:bg-navy-light text-paper font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Gauge size={14} className="text-gold" /> क्रॉस-वेंडर साख बही (Reputation Ledger)
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'all', label: 'सभी खाते' },
          { key: 'given', label: 'बाज़ार से लेना है (Receivable)' },
          { key: 'taken', label: 'वेंडर को देना है (Payable)' },
          { key: 'settled', label: '✓ पूरा चुकता (Settled)' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key as any)}
            className={'px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ' + 
              (filter === t.key ? 'bg-navy text-paper shadow-sm' : 'bg-paper border border-paper-dim text-ink-muted hover:text-ink')}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Contacts List */}
      <div className="space-y-3">
        {filteredContacts.length === 0 ? (
          <div className="p-8 text-center bg-paper rounded-2xl border border-paper-dim space-y-3">
            <HandCoins size={36} className="mx-auto text-ink-muted opacity-40 mb-1" />
            <div>
              <p className="text-sm font-bold text-ink">कोई व्यापारिक उधार रिकॉर्ड नहीं मिला</p>
              <p className="text-xs text-ink-muted mt-0.5">अपनी दुकान का नया उधारी खाता जोड़ने के लिए ऊपर दिए गए "+ नया उधार" बटन पर क्लिक करें।</p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsAddContactOpen(true)}
                className="px-4 py-2 bg-navy hover:bg-navy-light text-paper font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus size={14} className="text-gold" /> + पहला उधार खाता जोड़ें
              </button>
              <button
                type="button"
                onClick={handleLoadDemoData}
                className="px-3 py-2 bg-paper-dim hover:bg-paper border border-paper-dim text-ink-muted hover:text-ink font-semibold text-xs rounded-xl transition-all"
              >
                डेमो सैंपल डेटा लोड करें
              </button>
            </div>
          </div>
        ) : (
          filteredContacts.map((c) => {
            const isGiven = c.type === 'given';
            const isFullySettled = c.status === 'settled';
            const isLimitExceeded = c.credit_limit ? c.remaining_balance >= c.credit_limit : false;

            return (
              <div key={c.id} className="p-4 rounded-2xl bg-paper border border-paper-dim shadow-sm space-y-3 hover:border-navy/20 transition-all">
                {/* Header Row */}
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    {/* Business Tag */}
                    <div className="flex items-center gap-1 text-[11px] text-ink-muted font-medium">
                      <Building2 size={12} className="text-gold-dark" />
                      <span>फर्म: <strong className="text-ink">{c.our_business_name}</strong></span>
                      {c.our_business_gstin && <span className="font-mono text-[10px]">({c.our_business_gstin})</span>}
                      {c.linked_member_name && <span className="text-[10px] bg-paper-dim px-1.5 py-0.2 rounded">👤 {c.linked_member_name}</span>}
                    </div>

                    {/* Debtor Info */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {c.photo_urls && c.photo_urls.length > 0 ? (
                        <img
                          src={c.photo_urls[0]}
                          alt={c.person_name}
                          className="w-9 h-9 rounded-full object-cover border-2 border-navy/20 shadow-xs shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-navy/10 text-navy font-bold text-xs flex items-center justify-center border border-paper-dim shrink-0">
                          {c.person_name.charAt(0) || '👤'}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-ink">{c.person_name}</h3>
                          {c.father_name && (
                            <span className="text-xs text-ink-muted font-normal">
                              (पिता: {c.father_name})
                            </span>
                          )}
                          {isFullySettled ? (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-green/15 text-green">
                              ✓ चुकता
                            </span>
                          ) : (
                            <span className={'text-[9px] font-bold px-2 py-0.5 rounded uppercase ' + (isGiven ? 'bg-coral/10 text-coral' : 'bg-green/10 text-green')}>
                              {isGiven ? 'बाज़ार से लेना है' : 'वेंडर को देना है'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-muted">
                      {c.phone && (
                        <span className="flex items-center gap-1">
                          📞 <a href={'tel:' + c.phone} className="text-gold font-mono font-bold underline hover:text-ink">{c.phone}</a>
                          <span className="text-[9px] bg-green/10 text-green px-1.5 py-0.2 rounded font-medium">✓ 10-अंक</span>
                        </span>
                      )}
                      {c.address && (
                        <span className="flex items-center gap-0.5 text-ink-muted">
                          <MapPin size={11} className="text-ink-muted" /> {c.address}
                        </span>
                      )}
                      {c.party_gstin && (
                        <span className="font-mono text-ink text-[10px] bg-paper-dim px-1.5 py-0.2 rounded border border-paper-dim flex items-center gap-1">
                          📑 GST: {c.party_gstin}
                        </span>
                      )}
                      {c.party_pan && (
                        <span className="font-mono text-ink text-[10px] bg-paper-dim px-1.5 py-0.2 rounded border border-paper-dim flex items-center gap-1">
                          🪪 PAN: {c.party_pan}
                        </span>
                      )}
                    </div>

                    {/* Payment Mode, Days & Promised Date badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-paper-dim text-ink font-medium border border-paper-dim flex items-center gap-1">
                        <CreditCard size={10} className="text-navy" />
                        {c.payment_mode === 'bank_transfer' ? '🏦 Bank Transfer' :
                         c.payment_mode === 'upi' ? '📱 UPI Online' :
                         c.payment_mode === 'cheque' ? '📝 Cheque' : '💵 नकद / Cash'}
                      </span>

                      {/* Delivery Mode Badge */}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border ${
                        c.delivery_type === 'transport' ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-slate-100 text-slate-800 border-slate-200'
                      }`}>
                        {c.delivery_type === 'transport' ? <Truck size={10} className="text-blue-700" /> : <HandCoins size={10} className="text-slate-600" />}
                        {c.delivery_type === 'transport' ? '🚚 ट्रांसपोर्ट / बिल्टी' : '🤝 दुकान पर हैंडओवर'}
                      </span>

                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold-dark font-medium flex items-center gap-1">
                        <Clock size={10} /> {c.tenure_days} दिन की उधारी (वापसी: {c.due_date})
                      </span>

                      {c.credit_limit && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 border ${
                          isLimitExceeded ? 'bg-coral/15 text-coral border-coral/30 font-bold' : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          <Gauge size={10} /> 
                          {isLimitExceeded ? `⚠️ क्रेडिट लिमिट पार! (₹${c.credit_limit.toLocaleString('en-IN')})` : `लिमिट: ₹${c.credit_limit.toLocaleString('en-IN')}`}
                        </span>
                      )}

                      {/* Task 2.5: Bill Proof Badge on Card */}
                      {(c.bill_proof_filename || c.bill_number) && (
                        <button
                          type="button"
                          onClick={() => handleOpenProof(c)}
                          disabled={loadingProofId === c.id}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold border border-blue-200 flex items-center gap-1 transition-all"
                          title="पक्का बिल प्रमाण देखें"
                        >
                          <Paperclip size={10} className="text-blue-600" />
                          <span>{c.bill_number ? `बिल #${c.bill_number}` : (c.bill_proof_filename || 'बिल प्रमाण')}</span>
                          <Eye size={10} className="text-blue-700 ml-0.5" />
                        </button>
                      )}

                      {/* Task 2: Amendment & Dispute Resolution Badges */}
                      {c.is_amended && (
                        <span 
                          className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold border border-purple-300 flex items-center gap-1 shadow-xs" 
                          title="यह मूल/पुराना रिकॉर्ड है। इसका नया संशोधित रिकॉर्ड बन चुका है।"
                        >
                          <Lock size={10} className="text-purple-700" />
                          📜 मूल रिकॉर्ड (v{c.amendment_version || 1} - संशोधित / Superseded)
                        </span>
                      )}

                      {c.amended_from_id && (
                        <span 
                          className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 flex items-center gap-1 shadow-xs" 
                          title={`संशोधन कारण: ${c.amendment_reason || 'सुधार'}`}
                        >
                          <Edit3 size={10} className="text-emerald-700" />
                          ✏️ संशोधित बिल (v{c.amendment_version || 2})
                        </span>
                      )}

                      {c.is_dispute_resolved && (
                        <span 
                          className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 font-bold border border-teal-300 flex items-center gap-1 shadow-xs" 
                          title={`विवाद समाधान: ${c.dispute_resolution_note || 'सहमति बनी'}`}
                        >
                          <CheckCircle2 size={10} className="text-teal-700" />
                          🤝 विवाद समाधान समझौता
                        </span>
                      )}

                      {/* Task 5: Mandate Summary Badge (Click to open dedicated dashboard) */}
                      {(() => {
                        const m = mandates[c.id];
                        if (m?.status === 'active') {
                          return (
                            <button
                              type="button"
                              onClick={() => setActiveMandateContactId(activeMandateContactId === c.id ? null : c.id)}
                              className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold border border-emerald-300 flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                              title="UPI Autopay रिकवरी मैंडेट सक्रिय है — क्लिक करके डैशबोर्ड देखें"
                            >
                              <CreditCard size={10} className="text-emerald-700" />
                              Mandate: Active ✅ (₹{m.max_amount.toLocaleString('en-IN')})
                            </button>
                          );
                        }
                        if (m?.status === 'pending') {
                          return (
                            <button
                              type="button"
                              onClick={() => setActiveMandateContactId(activeMandateContactId === c.id ? null : c.id)}
                              className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold border border-amber-300 flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                              title="मैंडेट स्वीकृति पेंडिंग है — ऑथराइज़ लिंक भेजने के लिए क्लिक करें"
                            >
                              <Clock size={10} className="text-amber-700 animate-pulse" />
                              Mandate: Pending ⏳
                            </button>
                          );
                        }
                        if (m?.status === 'bounced') {
                          return (
                            <button
                              type="button"
                              onClick={() => setActiveMandateContactId(activeMandateContactId === c.id ? null : c.id)}
                              className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1 transition-all shadow-xs cursor-pointer ${
                                m.is_exhausted
                                  ? 'bg-red-100 hover:bg-red-200 text-red-900 border-red-300 animate-pulse'
                                  : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                              }`}
                              title={m.is_exhausted ? "मैंडेट प्रयास समाप्त — मैन्युअल तकादा आवश्यक है" : "मैंडेट बाउंस हुआ — पुनः प्रयास निर्धारित है"}
                            >
                              <AlertTriangle size={10} className={m.is_exhausted ? "text-red-700" : "text-amber-700"} />
                              {m.is_exhausted 
                                ? '⚠️ Mandate Failed (Manual Follow-up)' 
                                : `⚠️ Mandate Bounced (Retry ${m.retry_count || 1}/2)`}
                            </button>
                          );
                        }
                        if (m?.status === 'executed') {
                          return (
                            <button
                              type="button"
                              onClick={() => setActiveMandateContactId(activeMandateContactId === c.id ? null : c.id)}
                              className="text-[10px] px-2.5 py-0.5 rounded-full bg-green-100 hover:bg-green-200 text-green-900 font-bold border border-green-300 flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                              title="मैंडेट द्वारा सफल ऑटो-डेबिट हो चुका है"
                            >
                              <CheckCircle2 size={10} className="text-green-700" />
                              Mandate: Executed ✅
                            </button>
                          );
                        }
                        if (m?.status === 'cancelled') {
                          return (
                            <button
                              type="button"
                              onClick={() => setActiveMandateContactId(activeMandateContactId === c.id ? null : c.id)}
                              className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                              title="मैंडेट स्वतः रद्द (मैन्युअल भुगतान प्राप्त)"
                            >
                              <CreditCard size={10} className="text-slate-500" />
                              Mandate: Cancelled
                            </button>
                          );
                        }
                        const canSetup = (c.remaining_balance || c.original_amount) <= 15000 && !c.is_amended && c.status === 'active';
                        return (
                          <button
                            type="button"
                            onClick={() => setActiveMandateContactId(activeMandateContactId === c.id ? null : c.id)}
                            className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1 transition-all cursor-pointer ${
                              canSetup 
                                ? 'bg-navy/10 hover:bg-navy/20 text-navy border-navy/30' 
                                : 'bg-paper-dim text-ink-muted border-paper-dim'
                            }`}
                            title={canSetup ? "UPI Autopay रिकवरी मैंडेट सेट करें" : "रिकवरी मैंडेट विवरण देखें"}
                          >
                            <CreditCard size={10} className={canSetup ? "text-navy" : "text-ink-muted"} />
                            {canSetup ? '💳 Set up Mandate' : '💳 No Mandate (₹15k Limit)'}
                          </button>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Balance Display */}
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-ink-muted block uppercase font-bold">बकाया रकम</span>
                    <Mono className={'text-base font-bold ' + (isFullySettled ? 'text-ink-muted line-through' : isGiven ? 'text-coral' : 'text-green')}>
                      ₹{c.remaining_balance.toLocaleString('en-IN')}
                    </Mono>
                    <span className="text-[10px] text-ink-muted block">मूल: ₹{c.original_amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Task 2: Immutable Terms & Conditions Display */}
                {c.terms_and_conditions && (
                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-950 flex items-start gap-2">
                    <Scale size={14} className="text-amber-700 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold text-[10px] uppercase tracking-wider text-amber-800 block">
                        {c.terms_template_title || 'तय व्यापारिक नियम व कानूनी शर्त'}:
                      </span>
                      <p className="leading-relaxed text-ink/90">{c.terms_and_conditions}</p>
                    </div>
                  </div>
                )}

                {c.notes && (
                  <p className="text-xs text-ink-muted bg-paper-dim/40 p-2 rounded-lg italic">
                    &ldquo;{c.notes}&rdquo;
                  </p>
                )}

                {/* Task 2.6: Quotation & In-Transit Pipeline Stage Card */}
                {c.delivery_type === 'transport' && (
                  <div className="space-y-2">
                    {/* Quotation Stage */}
                    {c.pipeline_stage === 'quotation' && (
                      <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-300 flex items-center justify-between gap-2 flex-wrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                            <FileText size={14} className="text-amber-700" />
                            <span>📜 शुरुआती कोटेशन (Quotation Approval Stage)</span>
                          </div>
                          <p className="text-[11px] text-amber-800">
                            अनुमानित रकम: <strong className="font-mono">₹{(c.estimated_amount || c.original_amount).toLocaleString('en-IN')}</strong>
                            {c.material_description && <span className="ml-1.5 text-ink-muted">({c.material_description})</span>}
                          </p>
                          <span className="text-[10px] text-amber-700 block">
                            स्वीकृति OTP: <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-amber-200 text-navy">{c.dispatch_otp || c.otp_code}</code>
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenDispatchModal(c)}
                          className="px-3 py-1.5 rounded-xl bg-navy text-paper font-bold text-xs hover:bg-navy-light flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <Truck size={13} className="text-gold" /> माल डिस्पैच करें & फ़ाइनल बिल लॉक
                        </button>
                      </div>
                    )}

                    {/* In-Transit Stage */}
                    {c.pipeline_stage === 'in_transit' && (
                      <div className="p-3 rounded-xl bg-blue-50/90 border border-blue-200 flex items-center justify-between gap-2 flex-wrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-950">
                            <Truck size={15} className="text-blue-700 animate-pulse" />
                            <span>🚚 माल रास्ते में है (In-Transit Bilty)</span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-blue-900 flex-wrap">
                            {c.bilty_number && <span>बिल्टी: <strong className="font-mono font-bold">{c.bilty_number}</strong></span>}
                            {c.transport_name && <span>ट्रांसपोर्ट: <strong>{c.transport_name}</strong></span>}
                            {c.expected_arrival_date && <span>आगमन: <strong>{c.expected_arrival_date}</strong></span>}
                          </div>
                          <span className="text-[10px] text-blue-800 block">
                            ग्राहक डिलीवरी पुष्टि OTP (2nd OTP): <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-blue-300 text-navy">{c.delivery_otp || c.otp_code}</code>
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenDeliveryModal(c)}
                          className="px-3 py-1.5 rounded-xl bg-blue-700 text-white font-bold text-xs hover:bg-blue-800 flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <Package size={13} /> 📦 2nd OTP व डिलीवरी पुष्टि
                        </button>
                      </div>
                    )}

                    {/* Delivery Feedback Banner */}
                    {c.delivery_feedback === 'all_ok' && (
                      <div className="p-2.5 rounded-xl bg-green-50 border border-green-200 text-xs text-green-900 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCheck size={16} className="text-green-600 shrink-0" />
                          <div>
                            <span className="font-bold">डिलीवरी सफल: ग्राहक को सब सामान 100% सही मिला</span>
                            {c.bilty_number && <span className="text-[10px] text-green-700 block">बिल्टी: {c.bilty_number} ({c.transport_name})</span>}
                          </div>
                        </div>
                        <span className="text-[10px] bg-white px-2 py-0.5 rounded font-bold text-green-700 border border-green-300 flex items-center gap-0.5">
                          <Star size={11} className="text-gold fill-gold" /> विक्रेता साख +1
                        </span>
                      </div>
                    )}

                    {c.delivery_feedback === 'discrepancy_reported' && (
                      <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-start gap-2">
                        <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <span className="font-bold">माल में कमी / विवाद दर्ज (Discrepancy Reported)</span>
                          {c.dispute_note && <p className="text-[11px] text-red-700">&ldquo;{c.dispute_note}&rdquo;</p>}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Task 2.7: Promised vs Actual Tenure (Trust Score Indicator) */}
                {c.actual_settled_days !== undefined && (
                  <div className="p-2 rounded-xl bg-paper-dim/60 border border-paper-dim flex items-center justify-between text-xs">
                    <span className="text-ink-muted text-[11px] font-medium">बोलने और करने में अंतर (Repayment Track):</span>
                    <div className="flex items-center gap-2">
                      <span className="text-ink text-[11px]">वादा: <strong>{c.promised_tenure_days} दिन</strong></span>
                      <span className="text-ink text-[11px]">असल: <strong>{c.actual_settled_days} दिन</strong></span>
                      {c.actual_settled_days <= c.promised_tenure_days ? (
                        <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={11} /> समय पर ({c.promised_tenure_days - c.actual_settled_days === 0 ? 'सटीक' : `${c.promised_tenure_days - c.actual_settled_days} दिन पहले`})
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock size={11} /> {c.actual_settled_days - c.promised_tenure_days} दिन विलंब
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Digital OTP Verification & Wealth Sync Bar */}
                <div className="p-2.5 rounded-xl bg-paper-dim/40 border border-paper-dim flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-2">
                    {c.is_otp_verified ? (
                      <span className="flex items-center gap-1 font-semibold text-green text-[11px]">
                        <ShieldCheck size={14} className="text-green" /> Digital OTP Verified (No Vivad)
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-ink-muted uppercase">OTP:</span>
                        <code className="text-xs font-mono font-bold bg-paper px-1.5 py-0.5 rounded border border-paper-dim text-navy">
                          {c.otp_code}
                        </code>
                        <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-medium">
                          पेंडिंग
                        </span>
                      </div>
                    )}

                    {/* Toggle Wealth Sync Button */}
                    {isGiven && (
                      <button
                        type="button"
                        onClick={() => toggleWealthSync(c.id)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 border transition-all ${
                          c.sync_to_family_wealth 
                            ? 'bg-gold/20 text-gold-dark border-gold' 
                            : 'bg-paper text-ink-muted border-paper-dim hover:bg-paper-dim'
                        }`}
                        title={c.sync_to_family_wealth ? "पारिवारिक संपत्ति से हटाएं" : "पारिवारिक संपत्ति में जोड़ें"}
                      >
                        <Landmark size={11} />
                        {c.sync_to_family_wealth ? '✓ Wealth में शामिल' : '+ Wealth में जोड़ें'}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={getWhatsAppShareUrl(c)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium text-[11px] flex items-center gap-1 shadow-sm transition-all"
                      title="WhatsApp पर व्यापारिक एग्रीमेंट व OTP भेजें"
                    >
                      <Share2 size={12} /> WhatsApp रसीद
                    </a>

                    {!c.is_otp_verified && (
                      <button
                        type="button"
                        onClick={() => {
                          setOtpVerifyContact(c);
                          setInputOtp(c.otp_code || '');
                          setOtpError('');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-navy hover:bg-navy-light text-paper font-medium text-[11px] flex items-center gap-1 shadow-sm transition-all"
                      >
                        <ShieldCheck size={12} /> OTP Verify
                      </button>
                    )}
                  </div>
                </div>

                {/* Past Settlement History (Cash / Goods / Work) */}
                {c.settlements && c.settlements.length > 0 && (
                  <div className="pt-2 border-t border-paper-dim space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
                      चुकता इतिहास (Settlement & Hisab Log):
                    </span>
                    {c.settlements.map((s) => (
                      <div key={s.id} className="p-2 rounded-lg bg-paper-dim/50 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          {s.mode === 'cash_online' ? (
                            <Banknote size={14} className="text-green shrink-0" />
                          ) : s.mode === 'samaan_goods' ? (
                            <Package size={14} className="text-gold shrink-0" />
                          ) : (
                            <Wrench size={14} className="text-purple-600 shrink-0" />
                          )}
                          <div>
                            <span className="text-ink font-medium">{s.note}</span>
                            <span className="text-[10px] text-ink-muted block">{s.date}</span>
                          </div>
                        </div>
                        <Mono className="font-bold text-green">
                          -₹{s.amount.toLocaleString('en-IN')}
                        </Mono>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 border-t border-paper-dim flex justify-between items-center text-xs flex-wrap gap-2">
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-coral hover:text-coral-dark p-1"
                    title="हटाएं"
                  >
                    <Trash2 size={15} />
                  </button>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Task 2: Dispute resolution action button */}
                    {c.pipeline_stage === 'disputed' && !c.is_amended && (
                      <button
                        type="button"
                        onClick={() => handleOpenDisputeResolveModal(c)}
                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-1.5 px-3 rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                      >
                        <HandCoins size={13} /> 🤝 विवाद समाधान & संशोधित बिल
                      </button>
                    )}

                    {/* Task 2: Bill amendment action button */}
                    {!c.is_amended && !isFullySettled && c.pipeline_stage !== 'disputed' && (
                      <button
                        type="button"
                        onClick={() => handleOpenAmendModal(c)}
                        className="bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 text-xs font-semibold py-1.5 px-3 rounded-xl shadow-sm flex items-center gap-1 transition-all"
                        title="बिल में सुधार हेतु नया संशोधित संस्करण (v2) जारी करें"
                      >
                        <Edit3 size={13} className="text-purple-700" /> ✏️ बिल संशोधन
                      </button>
                    )}

                    {!isFullySettled && !c.is_amended && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedContactId(c.id);
                          setSettleAmount(c.remaining_balance.toString());
                        }}
                        className="bg-navy hover:bg-navy-light text-paper text-xs font-semibold py-1.5 px-3 rounded-xl shadow-sm"
                      >
                        + हिसाब चुकता करें / Partial Settle
                      </button>
                    )}

                    {c.is_amended && (
                      <span className="text-[11px] text-ink-muted italic bg-paper-dim px-2.5 py-1 rounded-lg border border-paper-dim flex items-center gap-1">
                        <Lock size={12} className="text-ink-muted" /> अपरिवर्तनीय इतिहास (नया संशोधित रिकॉर्ड सक्रिय है)
                      </span>
                    )}
                  </div>
                </div>

                {/* Task 5: Dedicated Customer Recovery Mandate Section */}
                {activeMandateContactId === c.id && (
                  <div className="pt-3 border-t-2 border-navy/20">
                    <UdharMandateModule
                      contact={c}
                      mandate={mandates[c.id]}
                      onClose={() => setActiveMandateContactId(null)}
                      onUpdateMandate={handleUpdateMandate}
                      onMandateCollect={handleMandateCollect}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* OTP Verification Modal */}
      {otpVerifyContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green/15 text-green flex items-center justify-center">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink font-serif">OTP से सत्यापित करें</h3>
                <p className="text-[11px] text-ink-muted">{otpVerifyContact.person_name} का डिजिटल प्रमाण</p>
              </div>
            </div>

            <p className="text-xs text-ink-muted bg-paper-dim/40 p-2.5 rounded-xl leading-relaxed">
              पार्टी द्वारा WhatsApp पर प्राप्त 6-अंकीय कोड दर्ज करें ताकि भविष्य में किसी भी वाद की गुंजाइश न रहे।
            </p>

            <form onSubmit={handleVerifyOtpSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 842109"
                  value={inputOtp}
                  onChange={(e) => {
                    setInputOtp(e.target.value);
                    setOtpError('');
                  }}
                  className="w-full px-3 py-2 text-center tracking-widest text-lg bg-paper-dim border border-paper-dim rounded-xl font-mono font-bold text-navy"
                  required
                />
                {otpError && (
                  <p className="text-[11px] text-coral font-medium mt-1">{otpError}</p>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <button 
                  type="button" 
                  onClick={() => {
                    setOtpVerifyContact(null);
                    setInputOtp('');
                    setOtpError('');
                  }} 
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink font-semibold text-xs"
                >
                  रद्द करें
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-xs shadow-sm"
                >
                  Confirm OTP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settle Modal (Cash, Samaan, Kaam) */}
      {selectedContactId && activeContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-gold tracking-wider">Udhar Settlement</span>
              <h3 className="text-base font-bold font-serif text-ink mt-0.5">{activeContact.person_name}</h3>
              <p className="text-xs text-ink-muted">
                बकाया रकम: <Mono className="font-bold text-ink">₹{activeContact.remaining_balance.toLocaleString('en-IN')}</Mono>
              </p>
            </div>

            <form onSubmit={handleSettlementSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Settlement का माध्यम</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'cash_online', label: '💵 Cash/GPay' },
                    { id: 'samaan_goods', label: '🌾 सामान देकर' },
                    { id: 'kaam_service', label: '🛠️ काम करके' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSettleMode(m.id as any)}
                      className={'py-2 px-1 text-[11px] font-medium rounded-xl border text-center transition-all ' + 
                        (settleMode === m.id ? 'bg-navy text-paper border-navy shadow-sm' : 'bg-paper text-ink-muted border-paper-dim')}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">कितना हिसाब चुकता हुआ? (₹ रकम)</label>
                <input
                  type="number"
                  placeholder="e.g. 2000"
                  max={activeContact.remaining_balance}
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-paper-dim border border-paper-dim rounded-xl font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">विवरण / नोट</label>
                <input
                  type="text"
                  placeholder={settleMode === 'samaan_goods' ? 'उदा. 1 बोरी गेहूं देकर हिसाब काटा' : settleMode === 'kaam_service' ? 'उदा. ट्रैक्टर से खेत जोता' : 'उदा. GPay से ट्रांसफर किया'}
                  value={settleNote}
                  onChange={(e) => setSettleNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setSelectedContactId(null)} 
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink font-semibold"
                >
                  रद्द करें
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-sm"
                >
                  चुकता दर्ज करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New B2B Udhar Contact Modal */}
      {isAddContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-3 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-paper-dim pb-2">
              <h3 className="text-base font-bold font-serif text-ink">व्यापारिक उधार खाता जोड़ें</h3>
              <span className="text-[10px] bg-paper-dim px-2 py-0.5 rounded text-ink-muted">B2B / Retailer / Vendor</span>
            </div>

            <form onSubmit={handleAddContactSubmit} className="space-y-3 text-xs">
              {/* Our Business Details */}
              <div className="bg-paper-dim/40 p-2.5 rounded-xl space-y-2 border border-paper-dim">
                <span className="text-[10px] font-bold uppercase text-ink-muted block">हमारी फर्म व प्रदाता विवरण:</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-ink-muted mb-0.5">हमारी फर्म / बिज़नेस का नाम *</label>
                    <input
                      type="text"
                      placeholder="उदा. आपकी दुकान या फर्म का नाम"
                      value={ourBizName}
                      onChange={e => handleBizNameChange(e.target.value)}
                      required
                      className="w-full px-2.5 py-1.5 text-xs bg-paper border border-paper-dim rounded-lg font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-ink-muted mb-0.5">हमारा GST नं (वैकल्पिक)</label>
                    <input
                      type="text"
                      placeholder="09AAAAA0000A1Z5"
                      value={ourGstin}
                      onChange={e => handleOurGstinChange(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-paper border border-paper-dim rounded-lg uppercase font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-ink-muted mb-0.5">अधिकृत परिवार सदस्य (वैकल्पिक ड्रॉपडाउन)</label>
                  {members.length > 0 ? (
                    <select
                      value={linkedMember}
                      onChange={e => handleLinkedMemberChange(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-paper border border-paper-dim rounded-lg font-medium"
                    >
                      <option value="">कोई विशेष सदस्य नहीं (फर्म स्तर)</option>
                      {members.map(m => (
                        <option key={m.id} value={m.name}>{m.name} ({m.role})</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="उदा. पार्टनर / मैनेजर का नाम"
                      value={linkedMember}
                      onChange={e => handleLinkedMemberChange(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-paper border border-paper-dim rounded-lg font-medium"
                    />
                  )}
                </div>
              </div>

              {/* Udhar Type Toggle */}
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">उधार का प्रकार</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUdharType('given')}
                    className={'py-2 text-xs font-bold rounded-xl border transition-all ' + 
                      (udharType === 'given' ? 'bg-coral text-white border-coral shadow-sm' : 'bg-paper text-ink-muted border-paper-dim')}
                  >
                    मैंने दिया (बाज़ार से लेना है)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUdharType('taken')}
                    className={'py-2 text-xs font-bold rounded-xl border transition-all ' + 
                      (udharType === 'taken' ? 'bg-green text-white border-green shadow-sm' : 'bg-paper text-ink-muted border-paper-dim')}
                  >
                    मैंने लिया (वेंडर को देना है)
                  </button>
                </div>
              </div>

              {/* Debtor / Retailer Info (Task 1: Unique Vendor Identity & Deduplication) */}
              {matchedVendor && (
                <div className="p-2.5 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between text-xs text-green-800">
                  <div className="flex items-center gap-2">
                    <CheckCheck size={16} className="text-green-600 shrink-0" />
                    <div>
                      <span className="font-bold">पहचान सत्यापित: "{matchedVendor.person_name}"</span>
                      <p className="text-[10px] text-green-700">मौजूदा वेंडर रिकॉर्ड लिंक हुआ (नया डुप्लीकेट नहीं बनेगा)</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded font-mono font-bold text-green-700 border border-green-300">
                    यूनिक लिंक
                  </span>
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                  ऋणी व्यक्ति / दुकानदार / फर्म का नाम *
                </label>
                <input
                  type="text"
                  placeholder="उदा. रमेश किराना स्टोर, वर्मा हार्डवेयर"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-semibold"
                  required
                />
              </div>

              {/* Mobile Phone (Mandatory 10-digit Indian Mobile) & GSTIN (Optional 15-digit) */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold uppercase text-ink-muted block">
                      मोबाइल नं * (यूनिक पहचान)
                    </label>
                    {phone.length === 10 && !phoneError && (
                      <span className="text-[9px] text-green font-bold flex items-center gap-0.5">
                        <CheckCheck size={11} /> 10-अंक मान्य
                      </span>
                    )}
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className={`w-full px-3 py-2 text-xs bg-paper-dim border rounded-xl font-mono font-bold ${
                      phoneError ? 'border-coral text-coral' : 'border-paper-dim'
                    }`}
                    required
                  />
                  {phoneError && (
                    <p className="text-[10px] text-coral font-medium mt-1">{phoneError}</p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                    पार्टी GSTIN (वैकल्पिक 15-अंक)
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="09BBTPS0000K1Z2"
                    value={partyGstin}
                    onChange={(e) => handleGstinChange(e.target.value)}
                    className={`w-full px-3 py-2 text-xs bg-paper-dim border rounded-xl uppercase font-mono ${
                      gstinError ? 'border-coral text-coral' : 'border-paper-dim'
                    }`}
                  />
                  {gstinError && (
                    <p className="text-[10px] text-coral font-medium mt-1">{gstinError}</p>
                  )}
                </div>
              </div>

              {/* PAN (Optional 10-character) & Father Name (Optional) */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold uppercase text-ink-muted block">
                      पार्टी PAN (वैकल्पिक 10-अक्षर)
                    </label>
                    {partyPan.length === 10 && !panError && (
                      <span className="text-[9px] text-green font-bold flex items-center gap-0.5">
                        <CheckCheck size={11} /> मान्य PAN
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="ABCDE1234F"
                    value={partyPan}
                    onChange={(e) => handlePanChange(e.target.value)}
                    className={`w-full px-3 py-2 text-xs bg-paper-dim border rounded-xl uppercase font-mono ${
                      panError ? 'border-coral text-coral' : 'border-paper-dim'
                    }`}
                  />
                  {panError && (
                    <p className="text-[10px] text-coral font-medium mt-1">{panError}</p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                    पिता का नाम (पूर्णतः वैकल्पिक)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. श्री रामस्वरूप जी"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                  पता / गाँव / दुकान का स्थान
                </label>
                <input
                  type="text"
                  placeholder="उदा. वार्ड 4, सदर बाजार"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                />
              </div>

              {/* Task 1: Customer Identity Photo (Mandatory on First Udhar Transaction) */}
              <div className="p-3 bg-paper-dim/40 border border-paper-dim rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase text-ink flex items-center gap-1">
                    <Camera size={13} className="text-navy" />
                    ग्राहक फोटो पहचान (Customer Identity Photo)
                  </label>
                  {isRepeatCustomerWithPhoto ? (
                    <span className="text-[9px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <CheckCircle2 size={11} /> रिकॉर्ड में उपलब्ध (वैकल्पिक)
                    </span>
                  ) : (
                    <span className="text-[9px] bg-coral/15 text-coral px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <AlertCircle size={11} /> पहली उधारी: अनिवार्य *
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {customerPhoto ? (
                    <div className="relative shrink-0">
                      <img
                        src={customerPhoto}
                        alt="Customer Captured"
                        className="w-14 h-14 object-cover rounded-xl border-2 border-green shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setCustomerPhoto(null)}
                        className="absolute -top-1.5 -right-1.5 bg-coral text-white rounded-full p-0.5 shadow-sm hover:bg-coral-dark"
                        title="हटाएं"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : isRepeatCustomerWithPhoto && (matchedVendor?.photo_urls?.[0] || existingCustomerWithPhoto?.photo_urls?.[0]) ? (
                    <div className="shrink-0 text-center">
                      <img
                        src={matchedVendor?.photo_urls?.[0] || existingCustomerWithPhoto?.photo_urls?.[0]}
                        alt="Existing on record"
                        className="w-14 h-14 object-cover rounded-xl border border-paper-dim opacity-85"
                      />
                      <span className="text-[8px] text-ink-muted block mt-0.5">मौजूदा फोटो</span>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl border-2 border-dashed border-paper-dim flex flex-col items-center justify-center text-ink-muted shrink-0 bg-paper">
                      <Camera size={18} className="opacity-40" />
                      <span className="text-[8px] font-bold mt-0.5">फोटो</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-1">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy hover:bg-navy-light text-paper font-semibold text-xs rounded-xl cursor-pointer shadow-sm transition-all">
                      <Camera size={13} />
                      <span>{customerPhoto ? 'फोटो बदलें' : 'कैमरा / फोटो चुनें'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        onChange={handleCustomerPhotoSelect}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-ink-muted leading-tight">
                      {isRepeatCustomerWithPhoto 
                        ? 'इस ग्राहक की फोटो पहले से सुरक्षित है। नई फोटो लेना वैकल्पिक है।'
                        : 'पहली बार उधारी पर ग्राहक/पार्टी की फोटो अनिवार्य है (विवाद से बचाव हेतु)।'}
                    </p>
                    {customerPhotoError && (
                      <p className="text-[10px] text-coral font-bold">{customerPhotoError}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">रकम (₹ Amount) *</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-paper-dim border border-paper-dim rounded-xl font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">क्रेडिट लिमिट (₹ Limit)</label>
                  <input
                    type="number"
                    placeholder="50000"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-bold"
                  />
                </div>
              </div>

              {/* Tenure in Days */}
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                  कितने दिन के लिए दिया गया? (उधारी अवधि)
                </label>
                <div className="grid grid-cols-5 gap-1">
                  {[15, 30, 45, 60, 90].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleTenurePreset(d)}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        tenureDays === d && !customDays ? 'bg-gold text-navy border-gold' : 'bg-paper text-ink-muted border-paper-dim'
                      }`}
                    >
                      {d} दिन
                    </button>
                  ))}
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-[10px] text-ink-muted whitespace-nowrap">या कस्टम दिन लिखें:</span>
                  <input
                    type="number"
                    placeholder="उदा. 75 दिन"
                    value={customDays}
                    onChange={(e) => {
                      setCustomDays(e.target.value);
                      if (e.target.value) setTenureDays(parseInt(e.target.value));
                    }}
                    className="w-24 px-2 py-1 text-xs bg-paper border border-paper-dim rounded-lg font-bold"
                  />
                </div>
              </div>

              {/* Payment Mode */}
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                  लेन-देन का माध्यम (Payment Mode)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'cash', label: '💵 Cash' },
                    { id: 'bank_transfer', label: '🏦 Bank A/C' },
                    { id: 'upi', label: '📱 UPI' },
                    { id: 'cheque', label: '📝 Cheque' },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMode(pm.id as any)}
                      className={'py-1.5 text-xs font-medium rounded-xl border text-center transition-all ' + 
                        (paymentMode === pm.id ? 'bg-navy text-paper border-navy shadow-sm' : 'bg-paper text-ink-muted border-paper-dim')}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sync to Wealth Toggle */}
              <div className="bg-paper-dim/60 p-2.5 rounded-xl border border-paper-dim flex items-center justify-between">
                <div>
                  <p className="font-bold text-ink text-xs flex items-center gap-1">
                    <Landmark size={13} className="text-gold-dark" />
                    पारिवारिक कुल संपत्ति (Family Wealth) में जोड़ें?
                  </p>
                  <p className="text-[10px] text-ink-muted">चालू करने पर यह उधारी पर्सनल नेट वेल्थ में एसेट दिखेगी, कभी भी हटा सकते हैं</p>
                </div>
                <input
                  type="checkbox"
                  checked={syncToWealth}
                  onChange={(e) => setSyncToWealth(e.target.checked)}
                  className="w-4 h-4 rounded text-gold cursor-pointer"
                />
              </div>

              {/* Task 2.6: Delivery Method & Quotation / Transport Pipeline */}
              <div className="bg-paper-dim/40 p-3 rounded-2xl border border-paper-dim space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink flex items-center gap-1">
                    <Truck size={13} className="text-navy" /> माल डिलीवरी का तरीका (Delivery Method) *
                  </span>
                  <span className="text-[9px] bg-navy/10 text-navy font-bold px-1.5 py-0.5 rounded">
                    हैंडओवर / ट्रांसपोर्ट
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryType('hand_to_hand');
                      setIsQuotation(false);
                    }}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                      deliveryType === 'hand_to_hand' ? 'bg-navy text-paper border-navy shadow-sm' : 'bg-paper text-ink-muted border-paper-dim'
                    }`}
                  >
                    <HandCoins size={14} /> 🤝 दुकान पर हैंडओवर
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('transport')}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                      deliveryType === 'transport' ? 'bg-navy text-paper border-navy shadow-sm' : 'bg-paper text-ink-muted border-paper-dim'
                    }`}
                  >
                    <Truck size={14} /> 🚚 ट्रांसपोर्ट / डिस्पैच
                  </button>
                </div>

                {deliveryType === 'transport' && (
                  <div className="p-2.5 bg-amber-50/80 border border-amber-200/90 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-950 flex items-center gap-1">
                        <FileText size={13} className="text-amber-700" /> शुरुआती कोटेशन (Quotation Pipeline)
                      </span>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isQuotation}
                          onChange={(e) => setIsQuotation(e.target.checked)}
                          className="w-4 h-4 rounded text-gold cursor-pointer"
                        />
                        <span className="text-[10px] font-bold text-amber-900">कोटेशन बनाएं</span>
                      </label>
                    </div>

                    <p className="text-[10px] text-amber-800 leading-relaxed">
                      {isQuotation 
                        ? "📜 शुरुआती एस्टिमेट/कोटेशन बनेगा। जब माल पैक होकर कार्टेज/ऑटो रिक्शा खर्चे के साथ रवाना होगा, तब डिस्पैच के समय फ़ाइनल बिल लॉक होगा और 2nd OTP जाएगा।"
                        : "🚚 सीधा डिस्पैच: माल रवाना हो रहा है। नीचे बिल्टी और ट्रांसपोर्ट विवरण भरें।"}
                    </p>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-amber-900 block mb-0.5">
                        सामान का विवरण (Material Description)
                      </label>
                      <input
                        type="text"
                        placeholder="उदा. 100 बोरी सीमेंट, 20 बंडल सरिया, सेनेटरी..."
                        value={materialDesc}
                        onChange={(e) => setMaterialDesc(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-amber-300 rounded-lg text-ink"
                      />
                    </div>

                    {!isQuotation && (
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-amber-200">
                        <div>
                          <label className="text-[10px] font-bold text-amber-900 block mb-0.5">बिल्टी नंबर (Bilty No.)</label>
                          <input
                            type="text"
                            placeholder="उदा. BL-9842"
                            value={initialBilty}
                            onChange={(e) => setInitialBilty(e.target.value)}
                            className="w-full px-2 py-1.5 text-xs bg-white border border-amber-300 rounded-lg font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-amber-900 block mb-0.5">ट्रांसपोर्ट का नाम</label>
                          <input
                            type="text"
                            placeholder="उदा. VRL लॉजिस्टिक्स"
                            value={initialTransport}
                            onChange={(e) => setInitialTransport(e.target.value)}
                            className="w-full px-2 py-1.5 text-xs bg-white border border-amber-300 rounded-lg font-medium"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Task 2.5: Mandatory Bill Proof (Option A vs Option B) */}
              <div className="bg-paper-dim/40 p-3 rounded-2xl border border-paper-dim space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink flex items-center gap-1">
                    <FileText size={12} className="text-navy" /> पक्का बिल प्रमाण (Bill Proof) *
                  </span>
                  <span className="text-[9px] bg-navy/10 text-navy font-bold px-1.5 py-0.5 rounded">
                    अनिवार्य सत्यापन
                  </span>
                </div>

                {/* Option A / Option B Toggle */}
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setBillProofMode('file')}
                    className={`py-1.5 px-2 text-[11px] font-bold rounded-xl border flex items-center justify-center gap-1 transition-all ${
                      billProofMode === 'file' ? 'bg-navy text-paper border-navy shadow-sm' : 'bg-paper text-ink-muted border-paper-dim'
                    }`}
                  >
                    <ImageIcon size={12} /> विकल्प A: फोटो / PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillProofMode('manual')}
                    className={`py-1.5 px-2 text-[11px] font-bold rounded-xl border flex items-center justify-center gap-1 transition-all ${
                      billProofMode === 'manual' ? 'bg-navy text-paper border-navy shadow-sm' : 'bg-paper text-ink-muted border-paper-dim'
                    }`}
                  >
                    <FileText size={12} /> विकल्प B: बिल विवरण
                  </button>
                </div>

                {/* Option A: File Upload UI */}
                {billProofMode === 'file' && (
                  <div className="space-y-2 pt-1">
                    <label className="block text-[10px] text-ink-muted">
                      बिल की फोटो (कैमरा/गैलरी) या PDF चालान (अधिकतम 5MB)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileSelect}
                        className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-navy file:text-paper hover:file:bg-navy-light cursor-pointer"
                      />
                    </div>
                    {billFile && (
                      <div className="p-2 rounded-xl bg-paper border border-paper-dim flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate">
                          {billFile.type.includes('pdf') ? (
                            <FileText size={16} className="text-red-600 shrink-0" />
                          ) : (
                            <ImageIcon size={16} className="text-blue-600 shrink-0" />
                          )}
                          <span className="font-medium text-ink truncate">{billFile.name}</span>
                          <span className="text-[10px] text-ink-muted font-mono">({Math.round(billFile.size / 1024)} KB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setBillFile(null)}
                          className="text-coral hover:text-coral-dark p-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Option B: Structured Manual Bill Fields */}
                {billProofMode === 'manual' && (
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-ink-muted block mb-0.5">
                          बिल नंबर *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. INV-1048"
                          value={billNumber}
                          onChange={(e) => handleBillNumberChange(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-paper border border-paper-dim rounded-lg font-mono font-bold"
                          required={billProofMode === 'manual'}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-ink-muted block mb-0.5">
                          बिल तारीख *
                        </label>
                        <input
                          type="date"
                          value={billDate}
                          onChange={(e) => setBillDate(e.target.value)}
                          className="w-full px-2 py-1.5 text-xs bg-paper border border-paper-dim rounded-lg font-medium"
                          required={billProofMode === 'manual'}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-ink-muted block mb-0.5">
                          बिल रकम (₹) *
                        </label>
                        <input
                          type="number"
                          placeholder="45000"
                          value={billAmount}
                          onChange={(e) => setBillAmount(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-paper border border-paper-dim rounded-lg font-mono font-bold"
                          required={billProofMode === 'manual'}
                        />
                      </div>
                    </div>
                    {duplicateBillWarning && (
                      <p className="text-[10px] text-amber-700 bg-amber-50 p-1.5 rounded-lg border border-amber-200 font-medium">
                        {duplicateBillWarning}
                      </p>
                    )}
                  </div>
                )}

                {billProofError && (
                  <p className="text-[11px] text-coral font-medium mt-1">{billProofError}</p>
                )}
              </div>

              {/* Task 2: Terms & Conditions Section */}
              <div className="bg-paper-dim/40 p-3 rounded-2xl border border-paper-dim space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink flex items-center gap-1">
                    <Scale size={13} className="text-amber-700" /> व्यापारिक नियम व कानूनी शर्तें (Terms & Conditions)
                  </span>
                  <span className="text-[9px] text-ink-muted">T&C Template / Custom</span>
                </div>

                {/* Templates Selector Dropdown */}
                <div>
                  <label className="text-[10px] text-ink-muted block mb-1">कानूनी टेम्प्लेट चुनें (Select Template):</label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => {
                      setSelectedTemplateId(e.target.value);
                      const allTpls = [...PREBUILT_UDHAR_TEMPLATES, ...customTemplatesList];
                      const matched = allTpls.find(t => t.id === e.target.value);
                      if (matched) setTermsText(matched.content);
                    }}
                    className="w-full px-2.5 py-1.5 text-xs bg-paper border border-paper-dim rounded-xl font-medium text-ink"
                  >
                    <optgroup label="⚡ रेडीमेड व्यापारिक टेम्प्लेट्स (Pre-built)">
                      {PREBUILT_UDHAR_TEMPLATES.map((tpl) => (
                        <option key={tpl.id} value={tpl.id}>{tpl.title}</option>
                      ))}
                    </optgroup>
                    {customTemplatesList.length > 0 && (
                      <optgroup label="📝 आपकी पूर्व कस्टम शर्तें (Saved Custom)">
                        {customTemplatesList.map((tpl) => (
                          <option key={tpl.id} value={tpl.id}>{tpl.title}</option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>

                {/* Editable Terms Textarea */}
                <div>
                  <textarea
                    rows={2}
                    value={termsText}
                    onChange={(e) => setTermsText(e.target.value)}
                    placeholder="व्यापारिक शर्तें लिखें (उदा. 30 दिन बाद 1.5% मासिक विलंब शुल्क देय होगा...)"
                    className="w-full p-2.5 text-xs bg-paper border border-paper-dim rounded-xl text-ink leading-relaxed"
                  />
                  <p className="text-[9px] text-ink-muted mt-0.5">
                    💡 जो भी कस्टम शर्त आप लिखेंगे, वह भविष्य के लिए स्वतः सेव हो जाएगी और WhatsApp रसीद में भी जाएगी।
                  </p>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">विवरण / बिल सं. / Notes</label>
                <input
                  type="text"
                  placeholder="उदा. बिल नं. 4082 या माल खरीद"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsAddContactOpen(false)} 
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink font-semibold"
                >
                  रद्द करें
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2 rounded-xl bg-navy text-paper font-semibold hover:bg-navy-light shadow-sm"
                >
                  उधार खाता सेव करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task 2.5: Proof Viewer Modal */}
      {viewingProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-paper p-5 rounded-2xl border border-paper-dim shadow-2xl space-y-3 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-paper-dim pb-2 shrink-0">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-navy" />
                <div>
                  <h3 className="text-sm font-bold text-ink">{viewingProof.title}</h3>
                  <p className="text-[10px] text-ink-muted font-mono">{viewingProof.filename}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingProof(null)}
                className="p-1 rounded-lg text-ink-muted hover:text-ink hover:bg-paper-dim"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-slate-950/5 rounded-xl p-2 flex items-center justify-center min-h-[300px]">
              {viewingProof.filetype.includes('pdf') ? (
                <iframe
                  src={viewingProof.dataUrl}
                  title="PDF Preview"
                  className="w-full h-[450px] rounded-lg border border-paper-dim"
                />
              ) : (
                <img
                  src={viewingProof.dataUrl}
                  alt="Bill Proof"
                  className="max-h-[450px] max-w-full object-contain rounded-lg shadow-sm"
                />
              )}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-paper-dim shrink-0">
              <a
                href={viewingProof.dataUrl}
                download={viewingProof.filename}
                className="px-3 py-1.5 bg-paper-dim hover:bg-paper-dim/80 text-ink text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
              >
                <ExternalLink size={13} /> डाउनलोड / नया टैब
              </a>
              <button
                onClick={() => setViewingProof(null)}
                className="px-4 py-1.5 bg-navy text-paper text-xs font-semibold rounded-xl hover:bg-navy-light transition-all"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task 2.6: Dispatch Material Modal (Quotation -> In-Transit) */}
      {dispatchingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/65 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper p-5 rounded-2xl border border-paper-dim shadow-2xl space-y-3.5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-paper-dim pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-navy text-gold">
                  <Truck size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">माल डिस्पैच & फ़ाइनल बिल लॉक</h3>
                  <p className="text-[10px] text-ink-muted">{dispatchingContact.person_name} (कोटेशन: ₹{(dispatchingContact.estimated_amount || dispatchingContact.original_amount).toLocaleString('en-IN')})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDispatchingContact(null)}
                className="text-ink-muted hover:text-ink p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
              💡 <strong>व्यापारिक नियम:</strong> कार्टेज, ऑटो रिक्शा और पैकिंग खर्चा तय होने के बाद नीचे फ़ाइनल बिल रकम दर्ज करें। यह रकम लॉक हो जाएगी और ग्राहक को माल प्राप्ति सत्यापन हेतु <strong>2nd OTP</strong> स्वतः बन जाएगा।
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                    फ़ाइनल बिल रकम (₹) *
                  </label>
                  <input
                    type="number"
                    value={dispatchFinalAmount}
                    onChange={(e) => setDispatchFinalAmount(e.target.value)}
                    placeholder="फ़ाइनल रकम"
                    className="w-full px-3 py-2 text-sm bg-paper-dim border border-paper-dim rounded-xl font-mono font-bold text-navy"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                    कार्टेज / ऑटो / पैकिंग (₹ नोट)
                  </label>
                  <input
                    type="text"
                    value={dispatchCartageFee}
                    onChange={(e) => setDispatchCartageFee(e.target.value)}
                    placeholder="उदा. ₹500 ऑटो + ₹200 पैकिंग"
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                    ट्रांसपोर्ट कंपनी का नाम *
                  </label>
                  <input
                    type="text"
                    value={dispatchTransport}
                    onChange={(e) => setDispatchTransport(e.target.value)}
                    placeholder="उदा. VRL / TCI एक्सप्रेस"
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                    बिल्टी नंबर (Bilty / LR) *
                  </label>
                  <input
                    type="text"
                    value={dispatchBilty}
                    onChange={(e) => setDispatchBilty(e.target.value)}
                    placeholder="उदा. BL-84920"
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-mono font-bold uppercase text-navy"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                  अनुमानित प्राप्ति तारीख (Expected Arrival)
                </label>
                <input
                  type="date"
                  value={dispatchExpectedDate}
                  onChange={(e) => setDispatchExpectedDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                  डिस्पैच विवरण / ड्राइवर नोट
                </label>
                <input
                  type="text"
                  value={dispatchNotes}
                  onChange={(e) => setDispatchNotes(e.target.value)}
                  placeholder="उदा. गाड़ी नंबर UP-32-AB-1234, ड्राइवर फोन 98XXXXXXXX"
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                />
              </div>

              {dispatchError && (
                <p className="text-[11px] text-coral font-medium">{dispatchError}</p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDispatchingContact(null)}
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-navy text-paper font-semibold hover:bg-navy-light flex items-center justify-center gap-1 shadow-sm"
                >
                  <Truck size={14} className="text-gold" /> माल डिस्पैच करें & 2nd OTP बनाएं
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task 2.6 & Task 2.7: Delivery Confirmation Modal (2nd OTP & Goods Quality Verification) */}
      {deliveringContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/65 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper p-5 rounded-2xl border border-paper-dim shadow-2xl space-y-3.5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-paper-dim pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-green-100 text-green-800">
                  <Package size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">2nd OTP व डिलीवरी पुष्टि</h3>
                  <p className="text-[10px] text-ink-muted">{deliveringContact.person_name} | बिल्टी #{deliveringContact.bilty_number}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeliveringContact(null)}
                className="text-ink-muted hover:text-ink p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-paper-dim/60 border border-paper-dim text-[11px] text-ink space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-ink-muted">कुल बिल रकम:</span>
                <Mono className="font-bold text-navy">₹{deliveringContact.original_amount.toLocaleString('en-IN')}</Mono>
              </div>
              <div className="flex justify-between items-center text-[10px] text-ink-muted">
                <span>ट्रांसपोर्ट: {deliveringContact.transport_name || 'ट्रांसपोर्ट'}</span>
                <span>बिल्टी: {deliveringContact.bilty_number}</span>
              </div>
            </div>

            <form onSubmit={handleDeliveryVerifySubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                  ग्राहक डिलीवरी OTP (2nd OTP Code) *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={deliveryOtpInput}
                  onChange={(e) => {
                    setDeliveryOtpInput(e.target.value);
                    setDeliveryOtpError('');
                  }}
                  placeholder="e.g. 930182"
                  className="w-full px-3 py-2 text-center tracking-widest text-lg bg-paper-dim border border-paper-dim rounded-xl font-mono font-bold text-navy"
                  required
                />
                {deliveryOtpError && (
                  <p className="text-[11px] text-coral font-medium mt-1">{deliveryOtpError}</p>
                )}
              </div>

              {/* Goods Condition / Feedback for Merchant Trust Rating */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-ink-muted block">
                  सामान की स्थिति (Goods Verification Feedback) *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryFeedback('all_ok')}
                    className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all ${
                      deliveryFeedback === 'all_ok'
                        ? 'bg-green-50 border-green-500 text-green-900 shadow-sm ring-1 ring-green-500'
                        : 'bg-paper text-ink-muted border-paper-dim'
                    }`}
                  >
                    <CheckCheck size={16} className={deliveryFeedback === 'all_ok' ? 'text-green-600' : 'text-ink-muted'} />
                    <div>
                      <span className="font-bold block text-xs">सब सही मिला (All OK)</span>
                      <span className="text-[9px] text-green-700 block">पूरा माल सुरक्षित व सही प्राप्त हुआ (+साख)</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryFeedback('discrepancy_reported')}
                    className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all ${
                      deliveryFeedback === 'discrepancy_reported'
                        ? 'bg-red-50 border-coral text-red-900 shadow-sm ring-1 ring-coral'
                        : 'bg-paper text-ink-muted border-paper-dim'
                    }`}
                  >
                    <AlertTriangle size={16} className={deliveryFeedback === 'discrepancy_reported' ? 'text-coral' : 'text-ink-muted'} />
                    <div>
                      <span className="font-bold block text-xs">कमी / टूट-फूट (Dispute)</span>
                      <span className="text-[9px] text-red-700 block">सामान में कमी या टूट-फूट दर्ज करें</span>
                    </div>
                  </button>
                </div>
              </div>

              {deliveryFeedback === 'discrepancy_reported' && (
                <div>
                  <label className="text-[10px] font-bold uppercase text-coral block mb-1">
                    विवाद / कमी का विवरण (Dispute Notes) *
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryDisputeNote}
                    onChange={(e) => setDeliveryDisputeNote(e.target.value)}
                    placeholder="उदा. 2 बोरी सीमेंट भीग गई, 1 बंडल सरिया कम आया..."
                    className="w-full p-2.5 text-xs bg-paper-dim border border-coral rounded-xl text-ink"
                    required
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeliveringContact(null)}
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-1 shadow-sm"
                >
                  <CheckCheck size={14} /> पुष्टि करें & साख अपडेट करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task 2.7: Cross-Vendor Reputation Ledger Modal */}
      {showTrustLedgerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/70 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-paper p-5 rounded-2xl border border-paper-dim shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gold/20 text-gold-dark">
                  <Scale size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-ink">क्रॉस-वेंडर साख बही (Reputation & Credit Track Ledger)</h3>
                  <p className="text-xs text-ink-muted">किस पार्टी ने कितने दिन में देने का वादा किया था और असल में कितने दिन में दिया (बोलने और करने में अंतर)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTrustLedgerModal(false)}
                className="text-ink-muted hover:text-ink p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Top Metric Cards inside Ledger */}
            <div className="grid grid-cols-3 gap-2.5 shrink-0">
              <div className="p-3 bg-navy-light/10 border border-navy/10 rounded-xl text-center">
                <span className="text-[10px] uppercase font-bold text-ink-muted block">कुल पंजीकृत पार्टियां</span>
                <span className="text-base font-bold text-navy mt-0.5 block">{contacts.length}</span>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-center">
                <span className="text-[10px] uppercase font-bold text-green-800 block">समय पर भुगतान दर (On-Time)</span>
                <span className="text-base font-bold text-green-700 mt-0.5 block">{repaymentTrustPercent}%</span>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
                <span className="text-[10px] uppercase font-bold text-blue-800 block">माल संतुष्टि (Delivery Trust)</span>
                <span className="text-base font-bold text-blue-700 mt-0.5 block">{deliveryTrustPercent}%</span>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative shrink-0">
              <Search size={15} className="absolute left-3 top-2.5 text-ink-muted" />
              <input
                type="text"
                value={trustSearchTerm}
                onChange={(e) => setTrustSearchTerm(e.target.value)}
                placeholder="पार्टी नाम, मोबाइल नंबर या शहर से खोजें..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-medium"
              />
            </div>

            {/* Task 4: Give Data to Get Data Gate Check */}
            {!isCrossVendorUnlocked ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-paper-dim/40 rounded-2xl border border-paper-dim">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Lock size={22} />
                </div>
                <div className="space-y-1 max-w-md">
                  <h4 className="text-sm font-bold text-ink">डेटा साझाकरण गेट (Give Data to Get Data)</h4>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    क्रॉस-वेंडर नेटवर्क का साख रिकॉर्ड देखने के लिए आपको कम से कम 1 उधारी लेन-देन दर्ज करना अनिवार्य है। जब आप व्यापारिक डेटा साझा करेंगे, तभी बाज़ार की संयुक्त साख बही अनलॉक होगी।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowTrustLedgerModal(false);
                    setIsAddContactOpen(true);
                  }}
                  className="px-4 py-2 bg-navy text-paper font-bold text-xs rounded-xl hover:bg-navy-light flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Plus size={14} className="text-gold" /> पहला लेन-देन जोड़ें
                </button>
              </div>
            ) : (
              /* Task 4: Summary-Only Aggregated Party List (Privacy Preserved, No Vendor Names Leaked) */
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {partyTrustSummaries
                  .filter(s => {
                    if (!trustSearchTerm.trim()) return true;
                    const term = trustSearchTerm.toLowerCase();
                    return (
                      s.personName.toLowerCase().includes(term) ||
                      s.phone.includes(term) ||
                      (s.address && s.address.toLowerCase().includes(term)) ||
                      (s.partyGstin && s.partyGstin.toLowerCase().includes(term))
                    );
                  })
                  .map((s) => {
                    const maskedPhone = s.phone.length >= 10
                      ? `${s.phone.slice(0, 3)}****${s.phone.slice(-3)}`
                      : s.phone;

                    return (
                      <div key={s.partyKey} className="p-3.5 bg-paper border border-paper-dim rounded-xl shadow-xs space-y-2.5 hover:border-navy/30 transition-all">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-ink text-sm">{s.personName}</h4>
                              <span className="text-[10px] text-ink-muted font-mono bg-paper-dim px-2 py-0.5 rounded border">
                                📞 {maskedPhone}
                              </span>
                              {s.partyGstin && (
                                <span className="text-[9px] font-mono bg-paper-dim px-1.5 py-0.5 rounded border text-ink-muted">
                                  GSTIN: {s.partyGstin}
                                </span>
                              )}
                            </div>
                            {s.address && <p className="text-[10px] text-ink-muted mt-0.5">{s.address}</p>}
                          </div>

                          {/* Task 4: Minimum 2-Vendor Threshold Check */}
                          {s.hasEnoughData ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-navy/10 text-navy border border-navy/20 flex items-center gap-1">
                                <Star size={11} className="text-gold fill-gold" /> संयुक्त साख: {s.weightedScore}/100
                              </span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                🏢 {s.vendorCount} व्यापारियों का डेटा
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1">
                              <AlertCircle size={11} className="text-amber-600" /> पर्याप्त डेटा नहीं (न्यूनतम 2 व्यापारियों का डेटा आवश्यक)
                            </span>
                          )}
                        </div>

                        {/* Task 4: Summary-Only Metrics (NO Individual Invoices, NO Raw Balances, NO Vendor Names Disclosed) */}
                        <div className="p-2.5 bg-paper-dim/40 rounded-xl border border-paper-dim grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] text-ink-muted uppercase block font-semibold">संयुक्त ट्रैक रिकॉर्ड</span>
                            <span className="font-bold text-ink">
                              {s.totalTransactions} लेन-देन दर्ज
                            </span>
                            <span className="text-[9px] text-ink-muted block">साझा बही आधार</span>
                          </div>

                          <div>
                            <span className="text-[10px] text-ink-muted uppercase block font-semibold">समय पर भुगतान</span>
                            <span className="font-bold text-green-700 flex items-center gap-1">
                              <CheckCircle2 size={12} /> {s.onTimeCount} समय पर
                            </span>
                            <span className="text-[9px] text-ink-muted block">तय वादा अवधि में</span>
                          </div>

                          <div>
                            <span className="text-[10px] text-ink-muted uppercase block font-semibold">विलंब भुगतान</span>
                            <span className={`font-bold flex items-center gap-1 ${s.delayedCount > 0 ? 'text-coral' : 'text-ink-muted'}`}>
                              <Clock size={12} /> {s.delayedCount} विलंब
                            </span>
                            <span className="text-[9px] text-ink-muted block">वादा तिथि के बाद</span>
                          </div>

                          <div>
                            <span className="text-[10px] text-ink-muted uppercase block font-semibold">साख भार (Recency Weight)</span>
                            <span className="font-bold text-navy text-[11px]">
                              70% हालिया (6 माह)
                            </span>
                            <span className="text-[9px] text-ink-muted block">30% पुराना इतिहास</span>
                          </div>
                        </div>

                        {/* Task 3: Unresolved Dispute Neutral Notice */}
                        {s.activeDisputesCount > 0 && (
                          <div className="p-2 bg-blue-50/70 border border-blue-200 rounded-lg text-[10px] text-blue-900 flex items-center gap-1.5">
                            <ShieldAlert size={12} className="text-blue-600 shrink-0" />
                            <span>
                              ⚖️ {s.activeDisputesCount} विवाद विचाराधीन: दोनों पक्षों की निष्पक्षता हेतु इसे साख स्कोर से बाहर (Neutral) रखा गया है।
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}

            <div className="pt-2 border-t border-paper-dim flex justify-between items-center shrink-0">
              <span className="text-[11px] text-ink-muted">
                🔒 सुरक्षित बही: व्यापारिक साख रिकॉर्ड आपसी लेन-देन से स्वतः तैयार होता है।
              </span>
              <button
                type="button"
                onClick={() => setShowTrustLedgerModal(false)}
                className="px-4 py-1.5 bg-navy text-paper font-semibold text-xs rounded-xl hover:bg-navy-light transition-all"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task 2: Bill Amendment Modal (Immutable Amendments) */}
      {amendingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-3.5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-paper-dim pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                  <Edit3 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-ink">बिल संशोधन (Amend Bill)</h3>
                  <p className="text-[11px] text-ink-muted">नया संस्करण (v{(amendingContact.amendment_version || 1) + 1})</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setAmendingContact(null)} 
                className="text-ink-muted hover:text-ink text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs space-y-1 text-purple-950">
              <span className="font-bold flex items-center gap-1 text-purple-900">
                <Lock size={12} className="text-purple-700" /> अपरिवर्तनीय ऑडिट ट्रेल (Immutability):
              </span>
              <p className="text-[11px] text-purple-900 leading-relaxed">
                मूल बिल प्रमाण व पुराना रिकॉर्ड इतिहास में 100% सुरक्षित रहेगा। यह संशोधन एक नया लिंक्ड रिकॉर्ड (v{(amendingContact.amendment_version || 1) + 1}) बनाएगा ताकि दोनों पक्षों के पास पूरा ऐतिहासिक प्रमाण रहे।
              </p>
            </div>

            <form onSubmit={handleAmendSubmit} className="space-y-3 text-xs">
              {amendError && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                  {amendError}
                </div>
              )}

              <div className="p-2.5 bg-paper-dim/40 rounded-xl border border-paper-dim space-y-1">
                <span className="text-[10px] uppercase font-bold text-ink-muted block">पार्टी विवरण:</span>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-ink">{amendingContact.person_name}</span>
                  <span className="font-mono text-ink-muted">{amendingContact.phone}</span>
                </div>
                <div className="text-[11px] text-ink-muted flex justify-between pt-1 border-t border-paper-dim">
                  <span>मौजूदा बिल: {amendingContact.bill_number ? `#${amendingContact.bill_number}` : 'N/A'}</span>
                  <span>मूल रकम: <strong>₹{amendingContact.original_amount.toLocaleString('en-IN')}</strong></span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink mb-1">
                  संशोधित बिल रकम (₹ New Amount) *
                </label>
                <input
                  type="number"
                  step="any"
                  value={amendAmount}
                  onChange={(e) => setAmendAmount(e.target.value)}
                  placeholder="उदा. 42000"
                  className="w-full px-3 py-2 text-sm font-mono font-bold bg-paper-dim border border-paper-dim rounded-xl text-ink"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-ink-muted mb-1">नया बिल नंबर (वैकल्पिक)</label>
                  <input
                    type="text"
                    value={amendBillNumber}
                    onChange={(e) => setAmendBillNumber(e.target.value)}
                    placeholder="उदा. INV-2026-002"
                    className="w-full px-2.5 py-1.5 bg-paper-dim border border-paper-dim rounded-xl font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-ink-muted mb-1">संशोधित उधारी अवधि (दिन)</label>
                  <input
                    type="number"
                    value={amendTenureDays}
                    onChange={(e) => setAmendTenureDays(parseInt(e.target.value) || 30)}
                    placeholder="उदा. 30"
                    className="w-full px-2.5 py-1.5 bg-paper-dim border border-paper-dim rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink mb-1">
                  संशोधन का अनिवार्य कारण (Reason for Amendment) *
                </label>
                <textarea
                  rows={2}
                  value={amendReason}
                  onChange={(e) => setAmendReason(e.target.value)}
                  placeholder="उदा. GST दर सुधार, माल वापसी डिस्काउंट, या आपसी समझौते से बिल रकम संशोधन..."
                  className="w-full p-2.5 bg-paper-dim border border-paper-dim rounded-xl text-xs text-ink"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAmendingContact(null)}
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold flex items-center justify-center gap-1 shadow-sm"
                >
                  <Edit3 size={14} /> संशोधित बिल सुरक्षित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task 2: Dispute Resolution Modal (Immutable Dispute Resolutions) */}
      {resolvingDisputeContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-3.5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-paper-dim pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <HandCoins size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-ink">विवाद समाधान एवं संशोधित समझौता</h3>
                  <p className="text-[11px] text-ink-muted">शांतिपूर्ण समाधान (Amended Settlement Entry)</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setResolvingDisputeContact(null)} 
                className="text-ink-muted hover:text-ink text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs space-y-1.5 text-amber-950">
              <span className="font-bold flex items-center gap-1 text-amber-900">
                <AlertTriangle size={13} className="text-amber-700" /> दर्ज शिकायत का विवरण:
              </span>
              <p className="text-[11px] italic bg-white/70 p-2 rounded border border-amber-200 text-amber-900">
                &ldquo;{resolvingDisputeContact.dispute_note || 'माल में कमी/विवाद दर्ज'}&rdquo;
              </p>
              <p className="text-[10px] text-amber-800">
                अपरिवर्तनीय नियम: पुराना विवादित रिकॉर्ड सुरक्षित रहेगा और नया समाधानित रिकॉर्ड जारी होगा।
              </p>
            </div>

            <form onSubmit={handleDisputeResolveSubmit} className="space-y-3 text-xs">
              {disputeResolutionError && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                  {disputeResolutionError}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-ink mb-1">
                  अंतिम सहमति / समझौता रकम (₹ Agreed Balance) *
                </label>
                <input
                  type="number"
                  step="any"
                  value={disputeAgreedAmount}
                  onChange={(e) => setDisputeAgreedAmount(e.target.value)}
                  placeholder="उदा. 40000 (यदि पूरा माफ तो 0 दर्ज करें)"
                  className="w-full px-3 py-2 text-sm font-mono font-bold bg-paper-dim border border-paper-dim rounded-xl text-ink"
                  required
                />
                <span className="text-[10px] text-ink-muted mt-1 block">
                  मूल बिल रकम: ₹{resolvingDisputeContact.original_amount.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink mb-1">
                  समाधान नोट / समझौता विवरण (Resolution Note) *
                </label>
                <textarea
                  rows={2.5}
                  value={disputeResolutionNote}
                  onChange={(e) => setDisputeResolutionNote(e.target.value)}
                  placeholder="उदा. 2 बोरी सीमेंट का हरजाना ₹800 काटकर शेष राशि ₹39,200 पर दोनों पक्षों की सहमति बनी..."
                  className="w-full p-2.5 bg-paper-dim border border-paper-dim rounded-xl text-xs text-ink"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResolvingDisputeContact(null)}
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-1 shadow-sm"
                >
                  <CheckCheck size={14} /> विवाद हल करें & नया रिकॉर्ड जारी करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
