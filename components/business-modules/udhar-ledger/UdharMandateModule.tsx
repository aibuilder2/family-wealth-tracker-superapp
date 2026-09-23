'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, ShieldCheck, AlertTriangle, CheckCircle2, Clock, 
  ArrowLeft, Share2, Check, X, Lock, ExternalLink, RefreshCw, 
  FileText, Scale, Landmark, Sparkles, AlertOctagon, HelpCircle, PhoneCall,
  History, Receipt, IndianRupee, Layers
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

export interface UdharMandate {
  id: string;
  udhar_transaction_id: string;
  max_amount: number;
  razorpay_token_id?: string;
  razorpay_customer_id?: string;
  status: 'pending' | 'active' | 'bounced' | 'executed' | 'cancelled';
  auth_link?: string;
  created_at: string;
  updated_at?: string;
  last_executed_at?: string;
  last_bounced_at?: string;
  next_retry_at?: string;
  failure_reason?: string;
  cancellation_reason?: string;
  retry_count?: number;
  is_exhausted?: boolean;
  customer_cancel_request?: {
    requested_at: string;
    reason_type: string;
    utr_or_note: string;
  };
}

export interface UdharMandateModuleProps {
  contact: {
    id: string;
    person_name: string;
    phone?: string;
    original_amount: number;
    remaining_balance: number;
    due_date?: string;
    promised_tenure_days?: number;
    status?: string;
    terms_and_conditions?: string;
    terms_template_title?: string;
    our_business_name?: string;
  };
  mandate?: UdharMandate | null;
  onClose: () => void;
  onUpdateMandate: (contactId: string, updated: UdharMandate) => void;
  onMandateCollect?: (contactId: string, amount: number, note: string) => void;
}

export function UdharMandateModule({
  contact,
  mandate,
  onClose,
  onUpdateMandate,
  onMandateCollect
}: UdharMandateModuleProps) {
  const [maxAmount, setMaxAmount] = useState<string>(() => {
    if (mandate?.max_amount) return mandate.max_amount.toString();
    const recommended = Math.min(15000, contact.remaining_balance || contact.original_amount);
    return recommended.toString();
  });
  const [collectAmount, setCollectAmount] = useState<string>(() => (contact.remaining_balance || 0).toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExecutingCollect, setIsExecutingCollect] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const fetchLogs = async (mandateId: string) => {
    if (!mandateId) return;
    setIsLoadingLogs(true);
    try {
      const res = await fetch(`/api/udhar/mandate/logs?mandate_id=${mandateId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.logs) {
          setAuditLogs(data.logs);
        }
      }
    } catch (e) {
      console.error('Failed to fetch mandate logs:', e);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (mandate?.id) {
      fetchLogs(mandate.id);
    }
  }, [mandate?.id, mandate?.status]);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReasonType, setCancelReasonType] = useState('neft');
  const [cancelReferenceNote, setCancelReferenceNote] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const getFullCancelReason = () => {
    const reasons: Record<string, string> = {
      neft: 'NEFT / RTGS बैंक में प्राप्त',
      cheque: 'चेक प्राप्त व क्लियर हुआ',
      cash: 'नकद भुगतान प्राप्त',
      customer_request: 'ग्राहक द्वारा कैंसिलेशन अनुरोध स्वीकृत',
      mutual_agreement: 'आपसी व्यापारिक समझौता / उधारी माफ़',
      other: 'अन्य कारण'
    };
    const base = reasons[cancelReasonType] || cancelReasonType;
    return cancelReferenceNote.trim() ? `${base} (विवरण: ${cancelReferenceNote.trim()})` : base;
  };

  const handleCancelMandate = async (customReason?: string) => {
    if (!mandate) return;
    setErrorMsg('');
    setSuccessMsg('');
    setIsCancelling(true);

    const finalReason = customReason || getFullCancelReason();

    try {
      const res = await fetch('/api/udhar/mandate/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mandate_id: mandate.id,
          udhar_transaction_id: contact.id,
          reason: finalReason
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'मैंडेट रद्द करने में विफलता।');
      }

      const updated: UdharMandate = {
        ...mandate,
        status: 'cancelled',
        cancellation_reason: finalReason,
        customer_cancel_request: undefined,
        updated_at: new Date().toISOString()
      };

      onUpdateMandate(contact.id, updated);
      setIsCancelModalOpen(false);
      setSuccessMsg(`मैंडेट सफलतापूर्वक रद्द किया गया: ${finalReason}`);

      // Log into audit trail
      fetch('/api/udhar/mandate/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mandate_id: mandate.id,
          event_type: 'mandate.cancelled',
          amount: 0,
          processing_fee: 0,
          vendor_received_amount: 0,
          failure_reason: finalReason,
          raw_payload: { reason_type: cancelReasonType, note: cancelReferenceNote }
        })
      }).then(() => fetchLogs(mandate.id)).catch(() => {});
    } catch (err: any) {
      setErrorMsg(err.message || 'मैंडेट रद्द नहीं हो सका।');
    } finally {
      setIsCancelling(false);
    }
  };

  // Simulate customer submitting cancellation request with payment proof
  const handleSimulateCustomerCancelRequest = () => {
    if (!mandate) return;
    const updated: UdharMandate = {
      ...mandate,
      customer_cancel_request: {
        requested_at: new Date().toISOString(),
        reason_type: 'NEFT / बैंक ट्रांसफर',
        utr_or_note: 'UTR: SBIN00' + Math.floor(10000000 + Math.random() * 90000000)
      }
    };
    onUpdateMandate(contact.id, updated);
    setSuccessMsg('ग्राहक द्वारा कैंसिलेशन अनुरोध प्राप्त हुआ। जब तक आप (विक्रेता) पुष्टि नहीं करेंगे, मैंडेट एक्टिव रहेगा।');
  };

  const handleRejectCustomerCancelRequest = () => {
    if (!mandate) return;
    const updated: UdharMandate = {
      ...mandate,
      customer_cancel_request: undefined
    };
    onUpdateMandate(contact.id, updated);
    setSuccessMsg('ग्राहक का कैंसिलेशन अनुरोध अस्वीकृत कर दिया गया। मैंडेट एक्टिव बना हुआ है।');
  };

  const isAlreadyPaid = (contact.remaining_balance || 0) <= 0 || contact.status === 'settled';
  const numMaxAmount = parseFloat(maxAmount) || 0;
  const isOver15kLimit = (contact.remaining_balance || contact.original_amount) > 15000;
  const isRequestedOver15k = numMaxAmount > 15000;

  // Task 5 Sub-task B: Collect via Mandate Handler
  const handleCollectViaMandate = async () => {
    if (!mandate || mandate.status !== 'active') return;
    setErrorMsg('');
    setSuccessMsg('');

    if (isAlreadyPaid) {
      setErrorMsg('डबल वसूली निषेध (Double-Collection Blocked): यह उधारी पहले ही चुकता है।');
      return;
    }

    const amt = parseFloat(collectAmount) || contact.remaining_balance;
    if (amt <= 0) {
      setErrorMsg('कृपया मान्य वसूली राशि दर्ज करें।');
      return;
    }

    setIsExecutingCollect(true);
    try {
      const res = await fetch('/api/udhar/mandate/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mandate_id: mandate.id,
          udhar_transaction_id: contact.id,
          amount: amt,
          current_balance: contact.remaining_balance,
          is_already_paid: isAlreadyPaid
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'मैंडेट वसूली में विफलता।');
      }

      const updatedMandate: UdharMandate = {
        ...mandate,
        status: 'executed',
        last_executed_at: new Date().toISOString()
      };
      onUpdateMandate(contact.id, updatedMandate);

      if (onMandateCollect) {
        onMandateCollect(contact.id, amt, `UPI Autopay रिकवरी मैंडेट द्वारा सफल डेबिट (ID: ${data.payment.payment_id})`);
      }

      setSuccessMsg(`🎉 ₹${amt.toLocaleString('en-IN')} का ऑटो-डेबिट सफल! ग्राहक का हिसाब चुकता दर्ज किया गया।`);
      fetch('/api/udhar/mandate/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mandate_id: mandate.id,
          event_type: 'payment.captured',
          amount: amt,
          processing_fee: 5.90,
          vendor_received_amount: Math.max(0, amt - 5.90),
          raw_payload: { payment_id: data.payment?.payment_id, note: 'सफल ऑटो-डेबिट रिकवरी' }
        })
      }).then(() => fetchLogs(mandate.id)).catch(() => {});
    } catch (err: any) {
      setErrorMsg(err.message || 'मैंडेट डेबिट निष्पादन विफल रहा।');
    } finally {
      setIsExecutingCollect(false);
    }
  };

  const [isRetrying, setIsRetrying] = useState(false);

  // Task 5 Sub-task C: Handler to trigger or simulate mandate retry / bounce
  const handleRetryMandate = async (simulateOutcome: 'success' | 'fail' = 'fail') => {
    if (!mandate) return;
    setErrorMsg('');
    setSuccessMsg('');
    setIsRetrying(true);

    try {
      const res = await fetch('/api/udhar/mandate/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mandate_id: mandate.id,
          udhar_transaction_id: contact.id,
          amount: contact.remaining_balance,
          current_retry_count: mandate.retry_count || 0,
          simulate_outcome: simulateOutcome
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'पुनः प्रयास में त्रुटि हुई।');
      }

      onUpdateMandate(contact.id, data.mandate);
      fetch('/api/udhar/mandate/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mandate_id: mandate.id,
          event_type: data.outcome === 'success' ? 'payment.captured' : 'payment.bounced',
          amount: contact.remaining_balance,
          processing_fee: data.outcome === 'success' ? 5.90 : 0,
          vendor_received_amount: data.outcome === 'success' ? Math.max(0, contact.remaining_balance - 5.90) : 0,
          failure_reason: data.mandate?.failure_reason,
          raw_payload: { retry_count: data.mandate?.retry_count, note: data.message }
        })
      }).then(() => fetchLogs(mandate.id)).catch(() => {});

      if (data.outcome === 'success') {
        if (onMandateCollect) {
          onMandateCollect(contact.id, contact.remaining_balance, `पुनः प्रयास सफल (ID: ${data.payment.payment_id})`);
        }
        setSuccessMsg(data.message);
      } else {
        if (data.is_exhausted) {
          setErrorMsg('⚠️ Mandate failed — manual follow-up needed. बैंक द्वारा 2 बार प्रयास विफल हो चुके हैं। अब मैन्युअल तकादा आवश्यक है।');
        } else {
          setErrorMsg(data.message);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'नेटवर्क त्रुटि: पुनः प्रयास नहीं हो सका।');
    } finally {
      setIsRetrying(false);
    }
  };

  // WhatsApp follow-up link when mandate fails / retries exhausted
  const getWhatsAppFollowUpLink = () => {
    const cleanPhone = contact.phone ? contact.phone.replace(/[^0-9]/g, '') : '';
    const phoneParam = cleanPhone.length >= 10 ? (cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone) : '';

    const msg = `*⚠️ उधारी भुगतान व चेक/मैंडेट अनादरण सूचना*\n` +
      `------------------------------------\n` +
      `🏢 फर्म: ${contact.our_business_name || 'व्यापारी फर्म'}\n` +
      `👤 ग्राहक / पार्टी: ${contact.person_name}\n` +
      `💰 देय बकाया राशि: ₹${contact.remaining_balance.toLocaleString('en-IN')}\n` +
      `📅 देय तिथि: ${contact.due_date || 'तय वादा'}\n` +
      `------------------------------------\n` +
      `महोदय, आपकी सहमति से पंजीकृत UPI Autopay मैंडेट बैंक द्वारा अस्वीकृत (Bounce) हो गया है।\n` +
      `अतः कानूनी असुविधा व हर्जाना शुल्क से बचने हेतु कृपया तत्काल दुकान पर आकर या सीधे UPI/NEFT द्वारा बकाया राशि चुकता करें।`;

    return phoneParam
      ? `https://wa.me/${phoneParam}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
  };

  // Extract penalty or late-payment clause from frozen T&C
  const rawTerms = contact.terms_and_conditions || '';
  const penaltyClauseMatch = rawTerms.includes('हर्जाना') || rawTerms.includes('विलंब') || rawTerms.includes('ब्याज') || rawTerms.includes('कानूनी');
  const penaltyClauseText = penaltyClauseMatch
    ? rawTerms
    : 'वादा तिथि के बाद देय शेष राशि पर पूर्व-सहमति अनुसार रिकवरी व हर्जाना शुल्क UPI Autopay द्वारा बैंक खाते से स्वतः काटा जाएगा।';

  // Handler to Create Mandate via Server-Side API Route (Keys safe in server)
  const handleCreateMandate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (numMaxAmount <= 0) {
      setErrorMsg('कृपया मान्य मैंडेट राशि दर्ज करें।');
      return;
    }

    if (numMaxAmount > 15000) {
      setErrorMsg('UPI Autopay AFA-Free सीमा नियम: अधिकतम ₹15,000 तक की राशि ही स्वीकृत है।');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/udhar/mandate/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          udhar_transaction_id: contact.id,
          max_amount: numMaxAmount,
          customer_name: contact.person_name,
          customer_phone: contact.phone
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'मैंडेट तैयार करने में विफलता।');
      }

      onUpdateMandate(contact.id, data.mandate);
      setSuccessMsg('मैंडेट सफलतापूर्वक तैयार हुआ! ग्राहक को WhatsApp पर ऑथराइज़ेशन लिंक भेजें।');
      fetch('/api/udhar/mandate/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mandate_id: data.mandate.id,
          event_type: 'mandate.created',
          amount: numMaxAmount,
          processing_fee: 0,
          vendor_received_amount: 0,
          raw_payload: { note: 'UPI Autopay रिकवरी मैंडेट लिंक तैयार हुआ' }
        })
      }).then(() => fetchLogs(data.mandate.id)).catch(() => {});
    } catch (err: any) {
      setErrorMsg(err.message || 'नेटवर्क त्रुटि: मैंडेट नहीं बनाया जा सका।');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler to Mark Mandate as Active (Simulate customer authorized via UPI app)
  const handleMarkActive = () => {
    if (!mandate) return;
    const updated: UdharMandate = {
      ...mandate,
      status: 'active',
      updated_at: new Date().toISOString()
    };
    onUpdateMandate(contact.id, updated);
    setSuccessMsg('✅ ग्राहक द्वारा UPI ऑथराइजेशन की पुष्टि हो चुकी है। मैंडेट अब ACTIVE है!');
    fetch('/api/udhar/mandate/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mandate_id: mandate.id,
        event_type: 'mandate.active',
        amount: mandate.max_amount,
        processing_fee: 0,
        vendor_received_amount: 0,
        raw_payload: { note: 'ग्राहक ने UPI ऐप (PhonePe / GPay) में ऑटो-पे स्वीकार किया' }
      })
    }).then(() => fetchLogs(mandate.id)).catch(() => {});
  };

  // WhatsApp link for sending mandate auth request to customer
  const getWhatsAppMandateLink = () => {
    if (!mandate) return '#';
    const authUrl = mandate.auth_link || `https://api.razorpay.com/v1/customers/mandate/${mandate.id}/authorize`;
    const cleanPhone = contact.phone ? contact.phone.replace(/[^0-9]/g, '') : '';
    const phoneParam = cleanPhone.length >= 10 ? (cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone) : '';

    const msg = `*🔒 UPI Autopay रिकवरी मैंडेट पंजीकरण*\n` +
      `------------------------------------\n` +
      `🏢 फर्म: ${contact.our_business_name || 'व्यापारी फर्म'}\n` +
      `👤 ग्राहक / पार्टी: ${contact.person_name}\n` +
      `💰 उधारी शेष राशि: ₹${contact.remaining_balance.toLocaleString('en-IN')}\n` +
      `📅 देय तिथि: ${contact.due_date || 'तय वादा'}\n` +
      `💳 अधिकतम अधिकृत सीमा: ₹${mandate.max_amount.toLocaleString('en-IN')}\n` +
      `------------------------------------\n` +
      `👉 अपने UPI ऐप (PhonePe / Google Pay / Paytm) से मैंडेट स्वीकारने हेतु नीचे दिए लिंक पर क्लिक करें:\n` +
      `${authUrl}\n\n` +
      `_नोट: यह केवल वादा तिथि पर अनादरण होने पर सुरक्षित रिकवरी हेतु एकमुश्त डिजिटल अनुमति है।_`;

    return phoneParam
      ? `https://wa.me/${phoneParam}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="bg-paper border-2 border-navy/20 rounded-2xl p-5 shadow-lg space-y-5 animate-in fade-in duration-200">
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between border-b border-paper-dim pb-3.5 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-paper-dim hover:bg-paper-dim/80 text-ink transition-all"
            title="वापस जाएं"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="p-2 rounded-xl bg-navy text-gold">
            <CreditCard size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold font-serif text-ink">
                UPI Autopay रिकवरी मैंडेट डैशबोर्ड
              </h3>
              <span className="text-[10px] bg-navy/10 text-navy font-bold px-2 py-0.5 rounded-full border border-navy/20">
                AFA-Free Recovery
              </span>
            </div>
            <p className="text-xs text-ink-muted">
              पार्टी: <strong className="text-ink">{contact.person_name}</strong> {contact.phone ? `(${contact.phone})` : ''} | शेष बकाया: <strong className="font-mono text-coral">₹{contact.remaining_balance.toLocaleString('en-IN')}</strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-paper-dim text-ink hover:bg-paper-dim/80 transition-all"
        >
          डैशबोर्ड बंद करें ✕
        </button>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
          <AlertOctagon size={16} className="text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-900 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-green-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Current Mandate Status Card */}
      <div className="p-4 rounded-2xl bg-paper-dim/40 border border-paper-dim space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            वर्तमान मैंडेट स्थिति (Current Mandate Status):
          </span>

          {mandate ? (
            mandate.status === 'active' ? (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-900 border border-green-300 flex items-center gap-1.5 shadow-xs">
                <CheckCircle2 size={13} className="text-green-700" /> Mandate Active ✅ (Auto-debit Ready)
              </span>
            ) : mandate.status === 'pending' ? (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 shadow-xs">
                <Clock size={13} className="text-amber-700 animate-pulse" /> ग्राहक स्वीकृति पेंडिंग ⏳
              </span>
            ) : mandate.status === 'bounced' ? (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-900 border border-red-300 flex items-center gap-1.5 shadow-xs">
                <AlertTriangle size={13} className="text-red-700" /> मैंडेट बाउंस (Bounced)
              </span>
            ) : (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300 flex items-center gap-1.5 shadow-xs">
                रद्द / Cancelled
              </span>
            )
          ) : (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1.5">
              कोई मैंडेट नहीं (No Mandate)
            </span>
          )}
        </div>

        {mandate ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
            <div className="p-2.5 bg-paper rounded-xl border border-paper-dim">
              <span className="text-[10px] text-ink-muted uppercase block font-semibold">मैंडेट ID</span>
              <span className="font-mono font-bold text-ink block truncate">{mandate.id}</span>
            </div>
            <div className="p-2.5 bg-paper rounded-xl border border-paper-dim">
              <span className="text-[10px] text-ink-muted uppercase block font-semibold">UPI Autopay टोकन</span>
              <span className="font-mono font-bold text-navy block truncate">{mandate.razorpay_token_id || 'Generating...'}</span>
            </div>
            <div className="p-2.5 bg-paper rounded-xl border border-paper-dim">
              <span className="text-[10px] text-ink-muted uppercase block font-semibold">अधिकतम अधिकृत सीमा</span>
              <Mono className="font-bold text-green-700 block">₹{mandate.max_amount.toLocaleString('en-IN')}</Mono>
            </div>
            <div className="p-2.5 bg-paper rounded-xl border border-paper-dim">
              <span className="text-[10px] text-ink-muted uppercase block font-semibold">पंजीकरण तिथि</span>
              <span className="font-bold text-ink block">{mandate.created_at ? mandate.created_at.split('T')[0] : 'आज'}</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-ink-muted leading-relaxed">
            इस ग्राहक के लिए अभी कोई UPI Autopay रिकवरी मैंडेट सक्रिय नहीं है। समय पर भुगतान न मिलने पर बिना भागदौड़ के सीधे बैंक खाते से रिकवरी हेतु नीचे से मैंडेट पंजीकृत करें।
          </p>
        )}

        {/* Pending Actions: Share WhatsApp Auth Link / Simulate Approval */}
        {mandate && mandate.status === 'pending' && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs text-amber-950">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold flex items-center gap-1">
                <Clock size={13} className="text-amber-700" /> ग्राहक से UPI ऐप में स्वीकृति करवाएं:
              </span>
              <a
                href={getWhatsAppMandateLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm transition-all"
              >
                <Share2 size={13} /> WhatsApp पर ऑथराइज लिंक भेजें
              </a>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-amber-200/60 flex-wrap gap-2">
              <span className="text-[11px] text-amber-800">
                क्या ग्राहक ने PhonePe / GPay में ₹15,000 Autopay स्वीकार कर लिया?
              </span>
              <button
                type="button"
                onClick={handleMarkActive}
                className="px-3 py-1 bg-navy text-paper font-semibold text-xs rounded-lg hover:bg-navy-light transition-all flex items-center gap-1"
              >
                <Check size={12} className="text-gold" /> हाँ, सक्रिय चिह्नित करें (Mark Active)
              </button>
            </div>
          </div>
        )}

        {/* Customer Cancellation Request Approval Banner (Seller Confirmation Gate) */}
        {mandate && mandate.customer_cancel_request && mandate.status !== 'cancelled' && (
          <div className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded-xl space-y-2 text-xs text-amber-950 animate-in fade-in">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-700 shrink-0" />
                <div>
                  <span className="font-bold text-amber-950 block">
                    🔔 ग्राहक द्वारा मैंडेट कैंसिलेशन अनुरोध (Customer Cancellation Request)
                  </span>
                  <span className="text-[11px] text-amber-800">
                    ग्राहक ने सूचित किया: <strong>&ldquo;{mandate.customer_cancel_request.reason_type} ({mandate.customer_cancel_request.utr_or_note})&rdquo;</strong>
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full shrink-0 border border-amber-300">
                विक्रेता पुष्टि पेंडिंग (Approval Pending)
              </span>
            </div>

            <p className="text-[11px] text-amber-900 bg-white/80 p-2.5 rounded-lg border border-amber-200 leading-relaxed">
              <strong>🔒 सुरक्षा नियम (Security Gate):</strong> ग्राहक अपने स्तर पर मैंडेट को एकतरफा रद्द नहीं कर सकता। जब तक आप (विक्रेता) अपने बैंक खाते में पैसे चेक करके नीचे &ldquo;पुष्टि करें व मैंडेट रद्द करें&rdquo; पर क्लिक नहीं करेंगे, तब तक मैंडेट रद्द नहीं होगा और सुरक्षा हेतु सक्रिय (Active) ही रहेगा।
            </p>

            <div className="flex items-center justify-end gap-2 pt-1 flex-wrap">
              <button
                type="button"
                onClick={handleRejectCustomerCancelRequest}
                className="px-3 py-1.5 bg-paper hover:bg-paper-dim border border-paper-dim text-ink font-semibold text-xs rounded-xl transition-all cursor-pointer"
                title="यदि बैंक खाते में पैसे नहीं आए हों तो अर्जी खारिज करें"
              >
                ✕ अनुरोध खारिज करें (Reject)
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => handleCancelMandate(`ग्राहक अनुरोध स्वीकृत: ${mandate.customer_cancel_request?.reason_type} (${mandate.customer_cancel_request?.utr_or_note})`)}
                className="px-3.5 py-1.5 bg-green-700 hover:bg-green-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                {isCancelling ? <RefreshCw size={12} className="animate-spin" /> : <CheckCircle2 size={13} />}
                ✓ बैंक में पैसे आ गए, मैंडेट रद्द करें (Confirm & Cancel)
              </button>
            </div>
          </div>
        )}

        {/* Task 5 Sub-task B: Active Mandate Execution & Double-Collection Prevention */}
        {mandate && mandate.status === 'active' && (
          isAlreadyPaid ? (
            /* Double-Collection Guard: Disabled when already paid */
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl space-y-1.5 text-xs text-emerald-950">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                <span className="font-bold">
                  ✅ यह उधारी खाता पहले ही चुकता है (Already Paid / Settled)
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                <strong>डबल वसूली रोकथाम (Double-Collection Protection):</strong> इस लेन-देन का शेष बकाया ₹0 है। ग्राहक के बैंक खाते से दोबारा पैसे कटने से रोकने के लिए "Collect via Mandate" बटन सुरक्षित रूप से अक्षम (Disabled) है।
              </p>
            </div>
          ) : (
            /* Active Mandate: Enabled only when transaction is UNPAID */
            <div className="p-3.5 bg-navy-light/10 border-2 border-navy/20 rounded-xl space-y-3 text-xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} className="text-navy" />
                  <div>
                    <span className="font-bold text-ink text-xs block">
                      💳 Collect via Mandate (UPI Autopay रिकवरी निष्पादन)
                    </span>
                    <span className="text-[11px] text-ink-muted">
                      बकाया राशि वसूलने हेतु पंजीकृत बैंक से स्वतः डेबिट करें
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full border border-green-300">
                  अनपेड खाते पर सक्रिय
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex-1 min-w-[140px]">
                  <label className="text-[10px] uppercase font-bold text-ink-muted block mb-1">
                    वसूली रकम (₹ Amount to Collect)
                  </label>
                  <input
                    type="number"
                    max={contact.remaining_balance}
                    value={collectAmount}
                    onChange={(e) => setCollectAmount(e.target.value)}
                    className="w-full px-3 py-1.5 bg-paper border border-paper-dim rounded-lg font-mono font-bold text-xs"
                  />
                </div>

                <div className="pt-4 flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    disabled={isExecutingCollect || isAlreadyPaid}
                    onClick={handleCollectViaMandate}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    {isExecutingCollect ? (
                      <RefreshCw size={13} className="animate-spin" />
                    ) : (
                      <CreditCard size={13} />
                    )}
                    Collect via Mandate (₹{parseFloat(collectAmount || '0').toLocaleString('en-IN')})
                  </button>

                  <button
                    type="button"
                    disabled={isRetrying || isAlreadyPaid}
                    onClick={() => handleRetryMandate('fail')}
                    className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                    title="बैंक बाउंस / विफलता सिमुलेट करें (Simulate Bank Bounce)"
                  >
                    {isRetrying ? <RefreshCw size={12} className="animate-spin" /> : <AlertTriangle size={12} className="text-amber-700" />}
                    ⚡ बाउंस सिमुलेट करें
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCancelModalOpen(true)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                    title="यदि NEFT / चेक / नकद मिल गया हो तो मैंडेट रद्द करें"
                  >
                    <X size={13} className="text-slate-600" />
                    ✕ मैंडेट रद्द करें
                  </button>

                  <button
                    type="button"
                    onClick={handleSimulateCustomerCancelRequest}
                    className="px-2.5 py-2 bg-paper hover:bg-paper-dim text-ink-muted border border-paper-dim text-[10px] font-medium rounded-xl transition-all cursor-pointer"
                    title="टेस्ट करें कि ग्राहक द्वारा कैंसिलेशन अर्जी भेजने पर विक्रेता को कैसा अप्रूवल दिखता है"
                  >
                    📨 ग्राहक कैंसिलेशन अर्जी टेस्ट
                  </button>
                </div>
              </div>
            </div>
          )
        )}

        {/* Task 5 Sub-task C: Bounced Mandate View & Auto-Retry Handling */}
        {mandate && mandate.status === 'bounced' && (
          mandate.is_exhausted ? (
            /* Exhausted Retries (>= 2 attempts failed) -> ⚠️ Mandate failed — manual follow-up needed */
            <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl space-y-3 text-xs text-red-950">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="flex items-start gap-2.5">
                  <AlertOctagon size={22} className="text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-red-900 flex items-center gap-1.5">
                      ⚠️ Mandate failed — manual follow-up needed
                    </h4>
                    <p className="text-[11px] text-red-800 mt-0.5 leading-relaxed">
                      बैंक द्वारा 2 स्वचालित डेबिट प्रयास विफल (Bounced) हो चुके हैं। सिस्टम ने अतिरिक्त बैंक पेनल्टी से बचने हेतु स्वतः डेबिट बंद कर दिया है। अब व्यापारी द्वारा मैन्युअल तकादा आवश्यक है।
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-red-200 text-red-900 font-mono font-bold px-2.5 py-0.5 rounded-full shrink-0 border border-red-300">
                  प्रयास 2/2 समाप्त (Exhausted)
                </span>
              </div>

              {/* Bounce Reason & Log */}
              <div className="p-3 bg-white/90 rounded-xl border border-red-200 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] flex-wrap gap-1">
                  <span className="text-ink-muted font-medium">बैंक विफलता कारण (Bank Reason):</span>
                  <span className="font-bold font-mono text-red-700">{mandate.failure_reason || 'INSUFFICIENT_FUNDS: ग्राहक के खाते में पर्याप्त बैलेंस नहीं है'}</span>
                </div>
                {mandate.last_bounced_at && (
                  <div className="flex items-center justify-between text-[10px] text-ink-muted">
                    <span>अंतिम बाउंस समय:</span>
                    <span className="font-mono">{new Date(mandate.last_bounced_at).toLocaleString('hi-IN')}</span>
                  </div>
                )}
              </div>

              {/* Direct Follow-Up Actions: WhatsApp & Phone */}
              <div className="pt-1 flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] font-bold text-red-900">
                  व्यापारी तत्काल कार्यवाही (Follow-up Actions):
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={getWhatsAppFollowUpLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Share2 size={13} /> 📱 WhatsApp तकादा (Legal Notice)
                  </a>
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="px-3.5 py-1.5 bg-navy hover:bg-navy-light text-paper font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <PhoneCall size={13} className="text-gold" /> 📞 ग्राहक को कॉल करें
                    </a>
                  )}
                  <button
                    type="button"
                    disabled={isRetrying}
                    onClick={() => handleRetryMandate('success')}
                    className="px-3 py-1.5 bg-paper hover:bg-paper-dim text-ink border border-paper-dim font-bold text-xs rounded-xl flex items-center gap-1 transition-all"
                    title="यदि ग्राहक ने खाते में पैसे डाल दिए हों तो सफल वसूली दर्ज करें"
                  >
                    {isRetrying ? <RefreshCw size={12} className="animate-spin" /> : <CheckCircle2 size={12} className="text-green-600" />}
                    सफल वसूली दर्ज करें
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Retry in Progress (e.g. Attempt 1 of 2 failed, scheduled retry) */
            <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-3 text-xs text-amber-950">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-amber-900">
                      ⚠️ मैंडेट बाउंस (Attempt {mandate.retry_count || 1}/2 Failed)
                    </h4>
                    <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                      डेबिट प्रयास बैंक द्वारा अस्वीकृत हुआ। नियमानुसार अगला स्वचालित पुनः प्रयास 24 घंटे बाद निर्धारित किया गया है।
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-mono font-bold px-2.5 py-0.5 rounded-full shrink-0 border border-amber-300">
                  प्रयास {mandate.retry_count || 1}/2
                </span>
              </div>

              {/* Bounce Reason & Scheduled Retry */}
              <div className="p-3 bg-white/90 rounded-xl border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] flex-wrap gap-1">
                  <span className="text-ink-muted font-medium">बैंक विफलता कारण:</span>
                  <span className="font-bold font-mono text-amber-800">{mandate.failure_reason || 'INSUFFICIENT_FUNDS: ग्राहक के खाते में पर्याप्त बैलेंस नहीं है'}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-ink-muted">
                  <span>अगला स्वचालित प्रयास (Next Scheduled Retry):</span>
                  <span className="font-bold text-ink font-mono">{mandate.next_retry_at ? new Date(mandate.next_retry_at).toLocaleString('hi-IN') : '24 घंटे बाद'}</span>
                </div>
              </div>

              {/* Action Buttons: Retry Now (Success / Fail) or WhatsApp Notice */}
              <div className="pt-1 flex items-center justify-between flex-wrap gap-2">
                <a
                  href={getWhatsAppFollowUpLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Share2 size={13} /> 📱 WhatsApp चेतावनी सूचना
                </a>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    disabled={isRetrying}
                    onClick={() => handleRetryMandate('success')}
                    className="px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm transition-all"
                  >
                    {isRetrying ? <RefreshCw size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                    सफल पुनः प्रयास (Simulate Success)
                  </button>

                  <button
                    type="button"
                    disabled={isRetrying}
                    onClick={() => handleRetryMandate('fail')}
                    className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-900 border border-red-300 font-bold text-xs rounded-xl flex items-center gap-1 transition-all"
                  >
                    {isRetrying ? <RefreshCw size={12} className="animate-spin" /> : <AlertOctagon size={12} className="text-red-600" />}
                    पुनः बाउंस सिमुलेट (Next Retry)
                  </button>
                </div>
              </div>
            </div>
          )
        )}

        {/* Task 5 Sub-task B: Cancelled Mandate Status (Automatic cancellation due to manual payment) */}
        {mandate && mandate.status === 'cancelled' && (
          <div className="p-3.5 bg-slate-100 border border-slate-300 rounded-xl space-y-1 text-xs text-slate-800">
            <div className="flex items-center gap-2">
              <X size={15} className="text-slate-600 shrink-0" />
              <span className="font-bold">मैंडेट स्वतः रद्द (Cancelled Mandate)</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {mandate.failure_reason || 'ग्राहक द्वारा मैन्युअल भुगतान प्राप्त होने के कारण डबल वसूली रोकने हेतु यह मैंडेट सिस्टम द्वारा स्वतः रद्द (Cancelled) कर दिया गया था। बैंक से कोई दोबारा चार्ज नहीं कटेगा।'}
            </p>
          </div>
        )}

        {/* Executed Mandate Status */}
        {mandate && mandate.status === 'executed' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl space-y-1 text-xs text-green-900">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 size={15} className="text-green-600" />
              <span>ऑटो-डेबिट वसूली पूर्ण (Mandate Executed)</span>
            </div>
            <p className="text-[11px] text-green-800">
              यह मैंडेट सफलतापूर्वक निष्पादित हो चुका है और बकाया रकम खाते में समायोजित हो चुकी है।
            </p>
          </div>
        )}
      </div>

      {/* Frozen T&C & Penalty Clause Preview */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
        <div className="flex items-center gap-2">
          <Scale size={16} className="text-amber-800 shrink-0" />
          <h4 className="font-bold text-amber-950 text-xs">
            तय व्यापारिक शर्तें व कानूनी हर्जाना क्लॉज (Frozen Legal Terms)
          </h4>
        </div>
        <div className="p-3 bg-white/80 rounded-xl border border-amber-200/80 text-[11px] text-ink leading-relaxed space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-amber-900 font-bold uppercase border-b border-amber-100 pb-1">
            <span>शीर्षक: {contact.terms_template_title || 'तय व्यापारिक उधारी नियम'}</span>
            <span>देय अवधि: {contact.promised_tenure_days || 30} दिन</span>
          </div>
          <p className="italic text-ink/90">&ldquo;{rawTerms || '30 दिन के अंदर पूरा भुगतान अनिवार्य है। समय पर चुकता न करने पर कानूनी कार्यवाही व रिकवरी अधिकृत होगी।'}&rdquo;</p>
          <div className="p-2 bg-amber-100/70 rounded-lg text-amber-950 font-medium text-[10px] border border-amber-300/60 flex items-start gap-1.5">
            <Lock size={12} className="text-amber-800 shrink-0 mt-0.5" />
            <span>
              <strong>मैंडेट रिकवरी अधिकार क्लॉज:</strong> ग्राहक द्वारा दी गई स्वीकृति डिजिटल चेक (e-Mandate) के समतुल्य है और धारा 138 / PSSA एक्ट के तहत कानूनी रूप से बाध्यकारी है।
            </span>
          </div>
        </div>
      </div>

      {/* ₹15,000 Regulatory Cap Notice & Form */}
      {isOver15kLimit && !mandate ? (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-950 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-600 shrink-0" />
            <h4 className="font-bold text-red-900">
              UPI Autopay AFA-Free सीमा नियम (₹15,000 Limit Exceeded)
            </h4>
          </div>
          <p className="text-[11px] text-red-900 leading-relaxed">
            भारतीय रिज़र्व बैंक (RBI) व NPCI के नियामकीय दिशानिर्देशों के अनुसार, बिना अतिरिक्त प्रमाणीकरण (AFA-free) के ऑटो-डेबिट मैंडेट केवल <strong>अधिकतम ₹15,000</strong> तक की राशि के लिए बनाया जा सकता है।
          </p>
          <div className="p-2.5 bg-white/70 rounded-xl border border-red-200 flex items-center justify-between">
            <span className="text-[11px] font-bold text-red-800">
              वर्तमान लेन-देन शेष: ₹{contact.remaining_balance.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">
              मैंडेट अनुमति सीमा से अधिक
            </span>
          </div>
          <p className="text-[10px] text-red-800 italic">
            सुझाव: ग्राहक से आंशिक भुगतान (Partial Payment) लेकर शेष राशि ₹15,000 के अंदर लाएं, जिसके बाद रिकवरी मैंडेट स्वतः सक्रिय करने का विकल्प उपलब्ध हो जाएगा।
          </p>
        </div>
      ) : (
        /* Mandate Registration Form */
        !mandate && (
          <form onSubmit={handleCreateMandate} className="p-4 rounded-2xl bg-paper-dim/30 border border-paper-dim space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-ink text-xs flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-navy" /> नया UPI Autopay मैंडेट सेट करें
              </span>
              <span className="text-[10px] text-ink-muted">अधिकतम सीमा: ₹15,000</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-ink mb-1">
                अधिकतम ऑटो-डेबिट रिकवरी सीमा (₹ Max Amount Cap) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  max={15000}
                  step="any"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  placeholder="15000"
                  className="w-full px-3 py-2 text-sm font-mono font-bold bg-paper border border-paper-dim rounded-xl text-ink"
                  required
                />
                <span className="absolute right-3 top-2.5 text-[10px] text-ink-muted font-bold">
                  MAX ₹15,000
                </span>
              </div>
              <span className="text-[10px] text-ink-muted mt-1 block">
                वादा तिथि पर शेष बकाया वसूलने के लिए ग्राहक के बैंक से अधिकतम इतनी राशि काटी जा सकेगी।
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-paper-dim text-ink font-semibold text-xs"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isRequestedOver15k}
                className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all ${
                  isRequestedOver15k
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-navy hover:bg-navy-light text-paper'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={13} className="animate-spin text-gold" /> मैंडेट जनरेट हो रहा है...
                  </>
                ) : (
                  <>
                    <CreditCard size={14} className="text-gold" /> ₹{numMaxAmount.toLocaleString('en-IN')} का रिकवरी मैंडेट बनाएं
                  </>
                )}
              </button>
            </div>
          </form>
        )
      )}

      {/* Task 5 Sub-task E: Recovery Cost & Fee Breakdown Card */}
      {(() => {
        const displayGross = mandate 
          ? mandate.max_amount 
          : Math.min(15000, contact.remaining_balance || contact.original_amount || 0);
        const basePlatformFee = 5.00;
        const gstFee = 0.90;
        const totalFee = 5.90;
        const netMerchantReceived = Math.max(0, displayGross - totalFee);

        return (
          <div className="p-4 rounded-2xl bg-paper-dim/40 border border-paper-dim space-y-3 text-xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Receipt size={17} className="text-navy" />
                <h4 className="font-bold text-ink">
                  💰 वसूली लागत व कटौती विवरण (Cost & Fee Breakdown)
                </h4>
              </div>
              <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full border border-green-300">
                100% पारदर्शी शुल्क (Zero Hidden Charges)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="p-2.5 bg-paper rounded-xl border border-paper-dim">
                <span className="text-[10px] text-ink-muted uppercase block font-semibold">कुल देय वसूली रकम</span>
                <Mono className="font-bold text-ink text-sm block">₹{displayGross.toLocaleString('en-IN')}</Mono>
                <span className="text-[9px] text-ink-muted">ग्राहक से वसूली योग्य</span>
              </div>
              <div className="p-2.5 bg-paper rounded-xl border border-paper-dim">
                <span className="text-[10px] text-ink-muted uppercase block font-semibold">गेटवे प्लेटफॉर्म शुल्क</span>
                <Mono className="font-bold text-ink-muted text-sm block">₹{basePlatformFee.toFixed(2)}</Mono>
                <span className="text-[9px] text-ink-muted">Razorpay UPI Autopay</span>
              </div>
              <div className="p-2.5 bg-paper rounded-xl border border-paper-dim">
                <span className="text-[10px] text-ink-muted uppercase block font-semibold">GST (18%)</span>
                <Mono className="font-bold text-ink-muted text-sm block">₹{gstFee.toFixed(2)}</Mono>
                <span className="text-[9px] text-ink-muted">सरकारी सेवा कर</span>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-300">
                <span className="text-[10px] text-emerald-800 uppercase block font-bold">व्यापारी शुद्ध प्राप्ति (Net In-Hand)</span>
                <Mono className="font-bold text-emerald-900 text-sm block">₹{netMerchantReceived.toLocaleString('en-IN')}</Mono>
                <span className="text-[9px] text-emerald-700 font-semibold">सीधे बैंक खाते में जमा</span>
              </div>
            </div>

            <div className="p-2.5 bg-white/80 rounded-xl border border-paper-dim text-[11px] text-ink-muted leading-relaxed flex items-center justify-between flex-wrap gap-2">
              <span className="flex items-center gap-1.5 text-navy font-semibold">
                <Sparkles size={13} className="text-gold shrink-0" />
                पारंपरिक कानूनी नोटिस या वसूली एजेंट (10-20% कमीशन) के मुकाबले UPI Autopay में मात्र ₹5.90 में 100% कानूनी वसूली संभव है।
              </span>
              <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                99.6% लागत बचत
              </span>
            </div>
          </div>
        );
      })()}

      {/* Task 5 Sub-task D: Audit Trail & Event Timeline */}
      <div className="p-4 rounded-2xl bg-paper-dim/40 border border-paper-dim space-y-3 text-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <History size={17} className="text-navy" />
            <h4 className="font-bold text-ink">
              📋 रिकवरी ऑडिट ट्रेल व टाइमलाइन (Audit Trail & Timeline)
            </h4>
          </div>
          {mandate?.id && (
            <button
              type="button"
              onClick={() => fetchLogs(mandate.id)}
              className="text-[10px] text-navy font-bold hover:underline flex items-center gap-1"
            >
              <RefreshCw size={11} className={isLoadingLogs ? "animate-spin" : ""} /> ताज़ा करें
            </button>
          )}
        </div>

        {/* Timeline Event List */}
        <div className="space-y-2 pt-1">
          {auditLogs && auditLogs.length > 0 ? (
            auditLogs.map((log, idx) => {
              const isPayment = log.event_type.includes('payment') || log.event_type.includes('captured');
              const isBounce = log.event_type.includes('bounced') || log.event_type.includes('failed') || log.event_type.includes('rejected');
              const isActive = log.event_type.includes('active');

              return (
                <div key={log.id || idx} className="p-2.5 bg-paper rounded-xl border border-paper-dim flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg shrink-0 ${
                      isPayment ? 'bg-green-100 text-green-800' :
                      isBounce ? 'bg-red-100 text-red-800' :
                      isActive ? 'bg-emerald-100 text-emerald-800' :
                      'bg-navy/10 text-navy'
                    }`}>
                      {isPayment ? <CreditCard size={14} /> :
                       isBounce ? <AlertOctagon size={14} /> :
                       isActive ? <CheckCircle2 size={14} /> :
                       <ShieldCheck size={14} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-ink">
                          {log.event_type === 'mandate.created' ? 'मैंडेट पंजीकृत व लिंक जारी' :
                           log.event_type === 'mandate.active' ? 'ग्राहक द्वारा UPI ऐप में स्वीकृति' :
                           log.event_type === 'payment.captured' ? 'सफल ऑटो-डेबिट वसूली' :
                           log.event_type === 'payment.bounced' ? 'बैंक डेबिट अस्वीकृत (बाउंस)' :
                           log.event_type}
                        </span>
                        <code className="text-[9px] bg-paper-dim px-1 rounded text-ink-muted font-mono">{log.event_type}</code>
                      </div>
                      <span className="text-[10px] text-ink-muted block">
                        {log.created_at ? new Date(log.created_at).toLocaleString('hi-IN') : 'हाल ही में'}
                        {log.failure_reason && <span className="text-red-600 ml-1 font-semibold">— {log.failure_reason}</span>}
                      </span>
                    </div>
                  </div>

                  {log.amount > 0 && (
                    <div className="text-right shrink-0">
                      <Mono className={`font-bold ${isBounce ? 'text-red-600' : 'text-green-700'}`}>
                        {isBounce ? 'विफल' : `+₹${log.amount.toLocaleString('en-IN')}`}
                      </Mono>
                      {log.processing_fee > 0 && (
                        <span className="text-[9px] text-ink-muted block">शुल्क: ₹{log.processing_fee}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            /* Fallback formatted default timeline based on mandate state */
            <div className="space-y-2">
              <div className="p-2.5 bg-paper rounded-xl border border-paper-dim flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-navy/10 text-navy shrink-0">
                    <ShieldCheck size={14} />
                  </div>
                  <div>
                    <span className="font-bold text-ink">उधारी रिकॉर्ड व मैंडेट प्रावधान</span>
                    <span className="text-[10px] text-ink-muted block">लेन-देन निर्माण समय तय कानूनी शर्तों के साथ सुरक्षित</span>
                  </div>
                </div>
                <span className="text-[10px] bg-paper-dim px-2 py-0.5 rounded font-mono text-ink-muted">प्रारंभिक</span>
              </div>

              {mandate && (
                <div className="p-2.5 bg-paper rounded-xl border border-paper-dim flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                      <CreditCard size={14} />
                    </div>
                    <div>
                      <span className="font-bold text-ink">UPI Autopay रिकवरी टोकन जनरेट</span>
                      <span className="text-[10px] text-ink-muted block">टोकन ID: {mandate.razorpay_token_id || 'tok_upi_generated'} (सीमा: ₹{mandate.max_amount.toLocaleString('en-IN')})</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-ink-muted">
                    {mandate.created_at ? mandate.created_at.split('T')[0] : 'आज'}
                  </span>
                </div>
              )}

              {mandate && mandate.status === 'active' && (
                <div className="p-2.5 bg-green-50 rounded-xl border border-green-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-green-200 text-green-900 shrink-0">
                      <CheckCircle2 size={14} />
                    </div>
                    <div>
                      <span className="font-bold text-green-950">ग्राहक द्वारा UPI ऐप स्वीकृति (Active)</span>
                      <span className="text-[10px] text-green-800 block">PhonePe / GPay द्वारा स्वतः वसूली अधिकृत</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-green-800 bg-white px-2 py-0.5 rounded border border-green-300">सक्रिय</span>
                </div>
              )}

              {mandate && mandate.status === 'bounced' && (
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-200 text-amber-900 shrink-0">
                      <AlertTriangle size={14} />
                    </div>
                    <div>
                      <span className="font-bold text-amber-950">बैंक डेबिट बाउंस (प्रयास {mandate.retry_count || 1}/2)</span>
                      <span className="text-[10px] text-amber-800 block">{mandate.failure_reason || 'अपर्याप्त बैलेंस'}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-amber-900 font-bold bg-white px-2 py-0.5 rounded border border-amber-300">बाउंस</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Seller Manual Cancellation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-paper p-5 rounded-2xl border-2 border-navy/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-100 text-red-700">
                  <X size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-ink font-serif">
                    मैंडेट निरस्तीकरण (Cancel UPI Mandate)
                  </h3>
                  <p className="text-[11px] text-ink-muted">
                    पार्टी: <strong>{contact.person_name}</strong> | शेष: <strong>₹{contact.remaining_balance.toLocaleString('en-IN')}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="text-ink-muted hover:text-ink text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-ink mb-1">
                  मैंडेट रद्द करने का कारण (Cancellation Reason) *
                </label>
                <select
                  value={cancelReasonType}
                  onChange={(e) => setCancelReasonType(e.target.value)}
                  className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl font-medium text-xs text-ink"
                >
                  <option value="neft">🏦 NEFT / RTGS बैंक ट्रांसफर प्राप्त हो गया</option>
                  <option value="cheque">📄 चेक प्राप्त हुआ और खाते में क्लियर हो गया</option>
                  <option value="cash">💵 नकद (Cash) भुगतान प्राप्त हो गया</option>
                  <option value="customer_request">👤 ग्राहक का कैंसिलेशन अनुरोध स्वीकृत किया</option>
                  <option value="mutual_agreement">🤝 आपसी व्यापारिक समझौता / उधारी माफ़ी</option>
                  <option value="other">📝 अन्य विशेष कारण</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">
                  विवरण / संदर्भ (UTR No., Cheque No. या संदर्भ नोट)
                </label>
                <input
                  type="text"
                  value={cancelReferenceNote}
                  onChange={(e) => setCancelReferenceNote(e.target.value)}
                  placeholder="उदा. UTR: SBIN00291039 या Cheque #40291"
                  className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs font-mono"
                />
                <span className="text-[10px] text-ink-muted mt-0.5 block">
                  भविष्य में किसी भी भ्रम या विवाद से बचने के लिए यह विवरण ऑडिट ट्रेल में स्थायी रूप से दर्ज रहेगा।
                </span>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                <strong>⚠️ विक्रेता पुष्टि (Seller Confirmation):</strong> मैंडेट रद्द करने के बाद बैंक द्वारा कोई भी स्वतः रिकवरी नहीं की जा सकेगी। कृपया सुनिश्चित करें कि आपको देय राशि प्राप्त हो चुकी है।
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-paper-dim">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 bg-paper-dim hover:bg-paper-dim/80 text-ink text-xs font-semibold rounded-xl cursor-pointer"
              >
                रद्द न करें (वापस)
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => handleCancelMandate()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                {isCancelling ? <RefreshCw size={13} className="animate-spin" /> : <X size={14} />}
                हाँ, मैंडेट निरस्त करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
