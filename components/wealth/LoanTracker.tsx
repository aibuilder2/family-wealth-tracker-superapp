'use client';

import React, { useState } from 'react';
import { LoanLiability, LoanType, LoanDocument, LoanDocType } from '@/types';
import { useFamilyStore } from '@/lib/store/familyStore';
import { Mono } from '@/components/ui/Mono';
import { 
  CreditCard, Landmark, Plus, X, Edit2, Trash2, Calendar, 
  User, CheckCircle2, AlertCircle, Bell, Percent, Clock,
  Home, Car, Briefcase, Award, Shield, FileText, ChevronRight,
  Camera, Upload, Download, Eye, ExternalLink, RefreshCw, Folder,
  Image as ImageIcon, Loader2, Sparkles, Check, CheckCheck
} from 'lucide-react';

const LOAN_TYPE_CONFIG: { [key in LoanType]: { label: string; icon: React.ElementType; color: string } } = {
  home_loan: { label: 'होम लोन (मकान/जमीन)', icon: Home, color: '#2563EB' },
  car_loan: { label: 'कार / वाहन लोन', icon: Car, color: '#D97706' },
  business_loan: { label: 'बिजनेस / व्यापार लोन', icon: Briefcase, color: '#059669' },
  personal_loan: { label: 'पर्सनल लोन', icon: CreditCard, color: '#DC2626' },
  gold_loan: { label: 'गोल्ड लोन', icon: Award, color: '#B98B2A' },
  education_loan: { label: 'एजुकेशन / पढ़ाई लोन', icon: Landmark, color: '#7C3AED' },
  other: { label: 'अन्य कर्ज / लोन', icon: Shield, color: '#6B7280' },
};

export const LOAN_DOC_CONFIG: Record<LoanDocType, { label: string; badge: string; color: string; desc: string }> = {
  noc: {
    label: 'बैंक NOC / No Dues Certificate',
    badge: 'NOC / No Dues',
    color: '#059669',
    desc: 'बैंक द्वारा जारी अनापत्ति प्रमाण पत्र (सबसे महत्वपूर्ण कानूनी सबूत)',
  },
  closure_letter: {
    label: 'लोन क्लोज़र लेटर (Final Settlement Letter)',
    badge: 'क्लोज़र लेटर',
    color: '#2563EB',
    desc: 'बैंक से 0-बैलेंस खाता बंद होने का पत्र व स्टेटमेंट',
  },
  handover_receipt: {
    label: 'मूल रजिस्ट्री / RC वापसी रसीद (Title Deed Return)',
    badge: 'कागज़ वापसी रसीद',
    color: '#D97706',
    desc: 'बैंक द्वारा मूल दस्तावेज लौटाने की पावती रसीद',
  },
  form_35: {
    label: 'RTO Form 35 (Hypothecation Cancel)',
    badge: 'Form 35',
    color: '#7C3AED',
    desc: 'गाड़ी की RC से बैंक का नाम हटाने वाला RTO फॉर्म',
  },
  sanction_letter: {
    label: 'लोन स्वीकृति पत्र (Sanction Letter)',
    badge: 'Sanction Letter',
    color: '#0891B2',
    desc: 'शुरुआती लोन स्वीकृति पत्र, ब्याज दर व नियम-शर्तें',
  },
  other: {
    label: 'अन्य बैंक कागज़ / रसीद',
    badge: 'अन्य दस्तावेज़',
    color: '#6B7280',
    desc: 'कोई भी अतिरिक्त बैंक चालान या कागज़',
  },
};

async function uploadLoanFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'family-wealth-loans-noc');

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      if (data.url) return data.url;
    }
  } catch (err) {
    console.warn('Upload API error, falling back to local file reader', err);
  }

  // Graceful fallback to client data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function calculateLoanRemainingTime(
  startDate?: string,
  tenure?: { years?: number; months?: number },
  outstandingBalance?: number,
  monthlyEmi?: number
) {
  const now = new Date();
  let totalMonths = 0;
  if (tenure?.months && tenure.months > 0) {
    totalMonths = tenure.months;
  } else if (tenure?.years && tenure.years > 0) {
    totalMonths = Math.round(tenure.years * 12);
  }

  if (startDate && totalMonths > 0) {
    const start = new Date(startDate);
    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const startDay = start.getDate();

    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();

    let elapsed = (currentYear - startYear) * 12 + (currentMonth - startMonth);
    if (currentDay < startDay) {
      elapsed = Math.max(0, elapsed - 1);
    }
    elapsed = Math.max(0, elapsed);

    const remainingMonths = Math.max(0, totalMonths - elapsed);

    const endDate = new Date(startYear, startMonth + totalMonths, startDay);
    const endDateFormatted = endDate.toLocaleDateString('hi-IN', { month: 'short', year: 'numeric' });

    const remYears = Math.floor(remainingMonths / 12);
    const remMonths = remainingMonths % 12;

    let remainingText = '';
    if (remainingMonths <= 0) {
      remainingText = 'लोन पूर्ण / चुकता (Completed 🎉)';
    } else if (remYears > 0 && remMonths > 0) {
      remainingText = `${remYears} वर्ष ${remMonths} माह बाकी (${remainingMonths} किस्तें)`;
    } else if (remYears > 0) {
      remainingText = `${remYears} वर्ष बाकी (${remainingMonths} किस्तें)`;
    } else {
      remainingText = `${remMonths} माह बाकी (${remainingMonths} किस्तें)`;
    }

    const elapsedYears = Math.floor(elapsed / 12);
    const elapsedRemMonths = elapsed % 12;
    let elapsedText = '';
    if (elapsedYears > 0 && elapsedRemMonths > 0) {
      elapsedText = `${elapsedYears} वर्ष ${elapsedRemMonths} माह बीत चुके`;
    } else if (elapsedYears > 0) {
      elapsedText = `${elapsedYears} वर्ष बीत चुके`;
    } else {
      elapsedText = `${elapsedRemMonths} माह बीत चुके`;
    }

    return {
      hasCalculation: true,
      totalMonths,
      elapsedMonths: elapsed,
      remainingMonths,
      remainingText,
      elapsedText,
      endDateFormatted,
      isFinished: remainingMonths <= 0,
      progressPct: Math.min(100, Math.round((elapsed / totalMonths) * 100)),
    };
  }

  // Fallback estimation using balance / monthly EMI
  if (outstandingBalance && monthlyEmi && monthlyEmi > 0) {
    const estMonths = Math.ceil(outstandingBalance / monthlyEmi);
    const remYears = Math.floor(estMonths / 12);
    const remMonths = estMonths % 12;

    let remainingText = '';
    if (remYears > 0 && remMonths > 0) {
      remainingText = `लगभग ${remYears} वर्ष ${remMonths} माह (${estMonths} किस्तें)`;
    } else if (remYears > 0) {
      remainingText = `लगभग ${remYears} वर्ष (${estMonths} किस्तें)`;
    } else {
      remainingText = `लगभग ${estMonths} माह (${estMonths} किस्तें)`;
    }

    return {
      hasCalculation: true,
      totalMonths: estMonths,
      elapsedMonths: 0,
      remainingMonths: estMonths,
      remainingText,
      elapsedText: 'बैलेंस व EMI अनुसार अनुमानित',
      endDateFormatted: '',
      isFinished: outstandingBalance <= 0,
      progressPct: 0,
    };
  }

  return {
    hasCalculation: false,
    remainingText: 'अवधि दर्ज नहीं है',
    elapsedText: '',
    endDateFormatted: '',
    isFinished: false,
    progressPct: 0,
  };
}

export function LoanTracker() {
  const { 
    loans, members, addLoan, updateLoan, deleteLoan, 
    closeLoan, reopenLoan, addLoanDocument, deleteLoanDocument,
    totalLoansOutstanding, totalMonthlyEmi 
  } = useFamilyStore();

  const [filterTab, setFilterTab] = useState<'active' | 'closed' | 'all'>('active');

  // Add / Edit Loan Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoanId, setEditingLoanId] = useState<string | null>(null);

  // Close Loan Modal State
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [closingLoan, setClosingLoan] = useState<LoanLiability | null>(null);
  const [closeDate, setCloseDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [closeNotes, setCloseNotes] = useState('');
  const [closeDocFile, setCloseDocFile] = useState<File | null>(null);
  const [closeDocPreview, setCloseDocPreview] = useState<string | null>(null);
  const [isSubmittingClose, setIsSubmittingClose] = useState(false);

  // Documents Modal State
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedLoanIdForDocs, setSelectedLoanIdForDocs] = useState<string | null>(null);
  const activeLoanForDocs = loans.find(l => l.id === selectedLoanIdForDocs) || null;

  // New Document upload within Doc Modal
  const [newDocType, setNewDocType] = useState<LoanDocType>('noc');
  const [newDocTitle, setNewDocTitle] = useState('बैंक NOC / No Dues Certificate');
  const [newDocFile, setNewDocFile] = useState<File | null>(null);
  const [newDocPreview, setNewDocPreview] = useState<string | null>(null);
  const [newDocNotes, setNewDocNotes] = useState('');
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  // Full Image Preview Modal State
  const [fullViewImage, setFullViewImage] = useState<{ url: string; title: string } | null>(null);

  // Form State
  const [borrowerMemberId, setBorrowerMemberId] = useState(members[0]?.id || '');
  const [loanType, setLoanType] = useState<LoanType>('home_loan');
  const [title, setTitle] = useState('');
  const [lenderBank, setLenderBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [totalLoanAmount, setTotalLoanAmount] = useState('');
  const [outstandingBalance, setOutstandingBalance] = useState('');
  const [monthlyEmiAmount, setMonthlyEmiAmount] = useState('');
  const [emiDueDay, setEmiDueDay] = useState('5');
  const [interestRate, setInterestRate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [tenureYears, setTenureYears] = useState('');
  const [tenureMonths, setTenureMonths] = useState('');
  const [autoReminder, setAutoReminder] = useState(true);
  const [notes, setNotes] = useState('');

  const handleOpenAdd = () => {
    setEditingLoanId(null);
    setBorrowerMemberId(members[0]?.id || '');
    setLoanType('home_loan');
    setTitle('');
    setLenderBank('');
    setAccountNumber('');
    setTotalLoanAmount('');
    setOutstandingBalance('');
    setMonthlyEmiAmount('');
    setEmiDueDay('5');
    setInterestRate('');
    setStartDate('');
    setTenureYears('');
    setTenureMonths('');
    setAutoReminder(true);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (loan: LoanLiability) => {
    setEditingLoanId(loan.id);
    setBorrowerMemberId(loan.borrower_member_id);
    setLoanType(loan.loan_type);
    setTitle(loan.title);
    setLenderBank(loan.lender_bank);
    setAccountNumber(loan.account_number || '');
    setTotalLoanAmount(String(loan.total_loan_amount));
    setOutstandingBalance(String(loan.outstanding_balance));
    setMonthlyEmiAmount(String(loan.monthly_emi_amount));
    setEmiDueDay(String(loan.emi_due_day || 5));
    setInterestRate(loan.interest_rate ? String(loan.interest_rate) : '');
    setStartDate(loan.start_date || '');
    setTenureYears(loan.tenure_years ? String(loan.tenure_years) : (loan.tenure_months ? String(Math.round((loan.tenure_months / 12) * 10) / 10) : ''));
    setTenureMonths(loan.tenure_months ? String(loan.tenure_months) : (loan.tenure_years ? String(loan.tenure_years * 12) : ''));
    setAutoReminder(loan.auto_reminder);
    setNotes(loan.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmt = parseFloat(totalLoanAmount);
    const outAmt = parseFloat(outstandingBalance);
    const emiAmt = parseFloat(monthlyEmiAmount);
    const dueDayNum = parseInt(emiDueDay, 10) || 5;

    if (!title.trim() || !lenderBank.trim() || isNaN(totalAmt) || isNaN(outAmt) || isNaN(emiAmt)) {
      alert('कृपया सभी आवश्यक विवरण सही से भरें');
      return;
    }

    const borrowerObj = members.find(m => m.id === borrowerMemberId);
    const borrowerName = borrowerObj?.name || 'सदस्य';

    const tMonths = tenureMonths ? parseInt(tenureMonths, 10) : (tenureYears ? Math.round(parseFloat(tenureYears) * 12) : undefined);
    const tYears = tenureYears ? parseFloat(tenureYears) : (tMonths ? Math.round((tMonths / 12) * 10) / 10 : undefined);

    if (editingLoanId) {
      updateLoan(editingLoanId, {
        borrower_member_id: borrowerMemberId,
        borrower_member_name: borrowerName,
        loan_type: loanType,
        title: title.trim(),
        lender_bank: lenderBank.trim(),
        account_number: accountNumber.trim() || undefined,
        total_loan_amount: totalAmt,
        outstanding_balance: outAmt,
        monthly_emi_amount: emiAmt,
        emi_due_day: dueDayNum,
        interest_rate: interestRate ? parseFloat(interestRate) : undefined,
        start_date: startDate.trim() || undefined,
        tenure_years: tYears,
        tenure_months: tMonths,
        auto_reminder: autoReminder,
        notes: notes.trim() || undefined,
      });
    } else {
      addLoan({
        borrower_member_id: borrowerMemberId,
        borrower_member_name: borrowerName,
        loan_type: loanType,
        title: title.trim(),
        lender_bank: lenderBank.trim(),
        account_number: accountNumber.trim() || undefined,
        total_loan_amount: totalAmt,
        outstanding_balance: outAmt,
        monthly_emi_amount: emiAmt,
        emi_due_day: dueDayNum,
        interest_rate: interestRate ? parseFloat(interestRate) : undefined,
        start_date: startDate.trim() || undefined,
        tenure_years: tYears,
        tenure_months: tMonths,
        auto_reminder: autoReminder,
        notes: notes.trim() || undefined,
      });
    }

    setIsModalOpen(false);
  };

  const handleOpenCloseModal = (loan: LoanLiability) => {
    setClosingLoan(loan);
    setCloseDate(new Date().toISOString().split('T')[0]);
    setCloseNotes('पूर्ण भुगतान चुकता, बैंक से खाता बंद कराया गया।');
    setCloseDocFile(null);
    setCloseDocPreview(null);
    setIsCloseModalOpen(true);
  };

  const handleExecuteClose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!closingLoan) return;
    setIsSubmittingClose(true);

    try {
      let uploadedDocs: LoanDocument[] = [];
      if (closeDocFile) {
        const fileUrl = await uploadLoanFile(closeDocFile);
        uploadedDocs.push({
          id: 'doc-loan-' + Date.now(),
          title: `${closingLoan.title} - NOC / No Dues Certificate`,
          doc_type: 'noc',
          file_url: fileUrl,
          file_name: closeDocFile.name,
          uploaded_at: new Date().toISOString(),
          notes: 'लोन बंद करते समय अपलोड की गई NOC',
        });
      }

      closeLoan(closingLoan.id, {
        closed_date: closeDate,
        closure_notes: closeNotes.trim() || undefined,
        documents: uploadedDocs,
      });

      setIsCloseModalOpen(false);
      setClosingLoan(null);
    } catch (err: any) {
      alert('लोन बंद करने में त्रुटि: ' + (err.message || 'Error'));
    } finally {
      setIsSubmittingClose(false);
    }
  };

  const handleOpenDocModal = (loan: LoanLiability) => {
    setSelectedLoanIdForDocs(loan.id);
    setNewDocType('noc');
    setNewDocTitle(`${loan.title} - Bank NOC`);
    setNewDocFile(null);
    setNewDocPreview(null);
    setNewDocNotes('');
    setIsDocModalOpen(true);
  };

  const handleUploadNewDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLoanForDocs || !newDocFile) {
      alert('कृपया दस्तावेज़ की फ़ोटो या फ़ाइल चुनें');
      return;
    }

    setIsUploadingDoc(true);
    try {
      const fileUrl = await uploadLoanFile(newDocFile);
      addLoanDocument(activeLoanForDocs.id, {
        title: newDocTitle.trim() || LOAN_DOC_CONFIG[newDocType]?.label || 'दस्तावेज़',
        doc_type: newDocType,
        file_url: fileUrl,
        file_name: newDocFile.name,
        notes: newDocNotes.trim() || undefined,
      });

      // Reset upload sub-form
      setNewDocFile(null);
      setNewDocPreview(null);
      setNewDocNotes('');
      setNewDocTitle(`${activeLoanForDocs.title} - ${LOAN_DOC_CONFIG[newDocType]?.badge}`);
    } catch (err: any) {
      alert('दस्तावेज़ सेव करने में त्रुटि: ' + (err.message || 'Error'));
    } finally {
      setIsUploadingDoc(false);
    }
  };

  // Categorization
  const activeLoans = loans.filter(l => l.status !== 'closed');
  const closedLoans = loans.filter(l => l.status === 'closed');

  const filteredLoans = loans.filter(loan => {
    if (filterTab === 'active') return loan.status !== 'closed';
    if (filterTab === 'closed') return loan.status === 'closed';
    return true;
  });

  // Member-wise aggregation (only active debt)
  const memberLoanMap: { [memberId: string]: { name: string; debt: number; emi: number; count: number } } = {};
  activeLoans.forEach(loan => {
    if (!memberLoanMap[loan.borrower_member_id]) {
      memberLoanMap[loan.borrower_member_id] = {
        name: loan.borrower_member_name,
        debt: 0,
        emi: 0,
        count: 0,
      };
    }
    memberLoanMap[loan.borrower_member_id].debt += Number(loan.outstanding_balance || 0);
    memberLoanMap[loan.borrower_member_id].emi += Number(loan.monthly_emi_amount || 0);
    memberLoanMap[loan.borrower_member_id].count += 1;
  });

  return (
    <div className="space-y-3 pt-2">
      {/* Header and Add Button */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-ink flex items-center gap-1.5">
            <CreditCard size={16} className="text-coral" />
            कर्ज व मासिक ईएमआई (Loans & Liabilities)
          </h2>
          <p className="text-[11px] text-ink-muted">
            पारिवारिक होम लोन, कार लोन, बिजनेस लोन व सदस्य-अनुसार मासिक EMI
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="py-1.5 px-3 rounded-xl bg-coral/15 hover:bg-coral/20 text-coral border border-coral/30 font-bold text-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Plus size={14} />
          <span>+ नया लोन / EMI</span>
        </button>
      </div>

      {/* Aggregate Debt Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-paper border border-paper-dim shadow-2xs">
          <span className="text-[10px] font-bold text-coral uppercase block">कुल बाकी कर्ज (Outstanding)</span>
          <Mono className="text-lg font-black text-ink block mt-0.5 text-coral">
            ₹{totalLoansOutstanding.toLocaleString('en-IN')}
          </Mono>
          <span className="text-[10px] text-ink-muted">
            {activeLoans.length} सक्रिय लोन {closedLoans.length > 0 ? `(${closedLoans.length} चुकता)` : ''}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-paper border border-paper-dim shadow-2xs">
          <span className="text-[10px] font-bold text-ink-muted uppercase block">कुल मासिक EMI किश्त</span>
          <Mono className="text-lg font-black text-ink block mt-0.5">
            ₹{totalMonthlyEmi.toLocaleString('en-IN')}
          </Mono>
          <span className="text-[10px] text-ink-muted">हर महीने का कुल भुगतान</span>
        </div>

        <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-paper border border-paper-dim shadow-2xs flex flex-col justify-center">
          <span className="text-[10px] font-bold text-ink-muted uppercase block">कर्जदार सदस्य (Borrowers)</span>
          <p className="text-xs font-bold text-ink mt-1 truncate">
            {Object.keys(memberLoanMap).length > 0 
              ? Object.values(memberLoanMap).map(m => m.name.split(' ')[0]).join(', ')
              : (closedLoans.length > 0 ? 'सभी कर्ज चुकता 🎉' : 'कोई कर्ज नहीं')}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
            <CheckCircle2 size={11} /> समय पर EMI रिमाइंडर व NOC ट्रैकर
          </span>
        </div>
      </div>

      {/* Member-wise Debt Breakdown (Kiske Naam Par Kitna Loan) */}
      {Object.keys(memberLoanMap).length > 1 && (
        <div className="p-3 rounded-xl bg-paper-dim/40 border border-paper-dim space-y-1.5">
          <span className="text-[11px] font-bold text-ink uppercase block">
            सदस्य अनुसार कर्ज व EMI विवरण (Member-Wise Debt):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {Object.entries(memberLoanMap).map(([mId, data]) => (
              <div key={mId} className="flex items-center justify-between p-2 rounded-lg bg-paper border border-paper-dim">
                <span className="font-bold text-ink flex items-center gap-1">
                  <User size={12} className="text-gold" /> {data.name}
                </span>
                <div className="text-right">
                  <span className="font-mono font-bold text-coral text-xs block">
                    बाकी: ₹{data.debt.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-ink-muted font-mono">
                    EMI: ₹{data.emi.toLocaleString('en-IN')}/माह ({data.count} लोन)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active vs Closed Loans Tab Filters */}
      <div className="flex items-center gap-1.5 p-1 bg-paper-dim/40 rounded-xl border border-paper-dim">
        <button
          type="button"
          onClick={() => setFilterTab('active')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            filterTab === 'active'
              ? 'bg-paper text-coral shadow-2xs border border-coral/20'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          <CreditCard size={13} />
          <span>सक्रिय लोन ({activeLoans.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterTab('closed')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            filterTab === 'closed'
              ? 'bg-paper text-emerald-600 shadow-2xs border border-emerald-500/20'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          <CheckCheck size={13} />
          <span>चुकता व क्लोज्ड ({closedLoans.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterTab('all')}
          className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            filterTab === 'all'
              ? 'bg-paper text-ink shadow-2xs border border-paper-dim'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          सभी ({loans.length})
        </button>
      </div>

      {/* Loans Cards List */}
      <div className="space-y-3">
        {filteredLoans.length === 0 ? (
          <div className="p-6 text-center bg-paper rounded-2xl border border-dashed border-paper-dim text-xs text-ink-muted space-y-2">
            <CreditCard size={28} className="mx-auto text-ink-muted/50" />
            <p className="font-bold text-ink">
              {filterTab === 'closed' 
                ? 'कोई क्लोज्ड / चुकता लोन दर्ज नहीं है' 
                : filterTab === 'active' 
                  ? 'परिवार पर कोई सक्रिय लोन दर्ज नहीं है' 
                  : 'कोई लोन दर्ज नहीं है'}
            </p>
            <p className="text-[11px] max-w-sm mx-auto">
              {filterTab === 'closed' 
                ? 'जब आप किसी लोन को पूर्ण चुकता करके क्लोज़ करेंगे, वह यहाँ सुरक्षित NOC के साथ दिखेगा।' 
                : 'यदि किसी सदस्य के नाम पर लोन है, तो ऊपर "+ नया लोन / EMI" जोड़ें।'}
            </p>
          </div>
        ) : (
          filteredLoans.map(loan => {
            const config = LOAN_TYPE_CONFIG[loan.loan_type] || LOAN_TYPE_CONFIG.other;
            const Icon = config.icon;
            const paidAmount = Math.max(0, loan.total_loan_amount - loan.outstanding_balance);
            const paidPct = Math.min(100, Math.round((paidAmount / loan.total_loan_amount) * 100)) || 0;

            return (
              <div
                key={loan.id}
                className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-xs hover:border-coral/40 transition-all space-y-3"
              >
                {/* Header: Title, Bank & Actions */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs mt-0.5"
                      style={{ backgroundColor: config.color + '20' }}
                    >
                      <Icon size={18} style={{ color: config.color }} />
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span 
                          className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider"
                          style={{ backgroundColor: config.color + '18', color: config.color }}
                        >
                          {config.label.split(' ')[0]}
                        </span>
                        <span className="text-[10px] font-bold bg-paper-dim px-2 py-0.5 rounded-full text-ink flex items-center gap-1">
                          👤 {loan.borrower_member_name} के नाम से
                        </span>
                        {loan.status === 'closed' ? (
                          <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCheck size={11} /> चुकता व क्लोज्ड
                          </span>
                        ) : loan.auto_reminder ? (
                          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Bell size={10} /> रिमाइंडर चालू
                          </span>
                        ) : null}
                      </div>

                      <h4 className="text-sm font-bold text-ink">{loan.title}</h4>
                      <p className="text-[11px] text-ink-muted">
                        बैंक / संस्थान: <strong className="text-ink">{loan.lender_bank}</strong>
                        {loan.account_number && ` • A/C: ${loan.account_number}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(loan)}
                      className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-paper-dim transition-colors"
                      title="संपादित करें"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`क्या आप ${loan.title} को हटाना चाहते हैं?`)) {
                          deleteLoan(loan.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-ink-muted hover:text-coral hover:bg-coral/10 transition-colors"
                      title="हटाएं"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Amounts & EMI Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-paper-dim/60 text-xs">
                  <div className="p-2 rounded-xl bg-paper-dim/30">
                    <span className="text-[10px] text-ink-muted block">कुल लोन राशि</span>
                    <Mono className="font-bold text-ink text-xs block mt-0.5">
                      ₹{Number(loan.total_loan_amount).toLocaleString('en-IN')}
                    </Mono>
                  </div>

                  <div className="p-2 rounded-xl bg-coral/10 border border-coral/20">
                    <span className="text-[10px] text-coral font-bold block">बाकी बकाया (Due)</span>
                    <Mono className="font-black text-coral text-xs block mt-0.5">
                      {loan.status === 'closed' ? '₹0 (पूर्ण चुकता)' : `₹${Number(loan.outstanding_balance).toLocaleString('en-IN')}`}
                    </Mono>
                  </div>

                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold block">मासिक EMI</span>
                    <Mono className="font-black text-emerald-700 dark:text-emerald-400 text-xs block mt-0.5">
                      ₹{Number(loan.monthly_emi_amount).toLocaleString('en-IN')}/माह
                    </Mono>
                  </div>

                  <div className="p-2 rounded-xl bg-paper-dim/30">
                    <span className="text-[10px] text-ink-muted block">किश्त तारीख (Due Day)</span>
                    <span className="font-bold text-ink text-xs block mt-0.5 flex items-center gap-1">
                      <Calendar size={11} className="text-gold" /> हर माह {loan.emi_due_day} तारीख
                    </span>
                  </div>
                </div>

                {/* Auto Calculated Remaining Time & Tenure Card */}
                {(() => {
                  const remInfo = calculateLoanRemainingTime(
                    loan.start_date,
                    { years: loan.tenure_years, months: loan.tenure_months },
                    loan.outstanding_balance,
                    loan.monthly_emi_amount
                  );
                  if (!remInfo.hasCalculation) return null;

                  return (
                    <div className="p-2.5 rounded-xl bg-paper-dim/40 border border-paper-dim space-y-1.5 text-xs">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className="text-coral shrink-0" />
                          <span className="text-[11px] font-bold text-ink">
                            बचा हुआ समय: <span className="text-coral font-black">{remInfo.remainingText}</span>
                          </span>
                        </div>
                        {remInfo.endDateFormatted && (
                          <span className="text-[10px] font-bold bg-coral/10 text-coral px-2 py-0.5 rounded-md">
                            समाप्ति: {remInfo.endDateFormatted}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-ink-muted flex-wrap gap-1">
                        {loan.start_date && (
                          <span>
                            आरंभ: {new Date(loan.start_date).toLocaleDateString('hi-IN', { month: 'short', year: 'numeric' })}
                          </span>
                        )}
                        {remInfo.elapsedText && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓ {remInfo.elapsedText}</span>
                        )}
                        {loan.tenure_years ? (
                          <span>कुल अवधि: {loan.tenure_years} साल ({loan.tenure_months || loan.tenure_years * 12} माह)</span>
                        ) : loan.tenure_months ? (
                          <span>कुल अवधि: {loan.tenure_months} माह</span>
                        ) : null}
                      </div>

                      {remInfo.progressPct > 0 && (
                        <div className="space-y-0.5 pt-0.5">
                          <div className="w-full h-1.5 rounded-full bg-paper-dim overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                              style={{ width: `${remInfo.progressPct}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[9px] text-ink-muted">
                            <span>समय प्रगति: {remInfo.progressPct}% अवधि पूर्ण</span>
                            <span>{remInfo.remainingMonths} किस्तें बाकी</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Repayment Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-ink-muted">
                    <span>चुकता राशि: ₹{paidAmount.toLocaleString('en-IN')}</span>
                    <span className="font-mono font-bold text-ink">{paidPct}% चुकता</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-paper-dim overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                      style={{ width: `${paidPct}%` }}
                    />
                  </div>
                </div>

                {loan.notes && (
                  <p className="text-[11px] text-ink-muted italic bg-paper-dim/30 p-2 rounded-lg">
                    📝 {loan.notes}
                  </p>
                )}

                {/* Closed Loan Notice & NOC Banner */}
                {loan.status === 'closed' && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="text-xs font-bold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                        लोन खाता पूर्ण चुकता व सुरक्षित क्लोज़्ड है
                      </span>
                      {loan.closed_date && (
                        <span className="text-[10px] font-mono bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-800 dark:text-emerald-300">
                          बंद तारीख: {loan.closed_date}
                        </span>
                      )}
                    </div>
                    {loan.closure_notes && (
                      <p className="text-[11px] text-ink-muted">
                        टिप्पणी: {loan.closure_notes}
                      </p>
                    )}
                  </div>
                )}

                {/* Documents & Action Bar */}
                <div className="pt-2 flex items-center justify-between gap-2 flex-wrap border-t border-paper-dim/60">
                  <button
                    type="button"
                    onClick={() => handleOpenDocModal(loan)}
                    className="px-3 py-1.5 rounded-xl bg-paper-dim/60 hover:bg-paper-dim text-ink font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:border-gold border border-transparent"
                  >
                    <Folder size={14} className="text-gold" />
                    <span>
                      दस्तावेज़ व NOC ({loan.documents?.length || 0})
                    </span>
                    {loan.documents && loan.documents.some(d => d.doc_type === 'noc') && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                        NOC सुरक्षित ✓
                      </span>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    {loan.status === 'closed' ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`क्या आप ${loan.title} को दोबारा 'सक्रिय' (Active) करना चाहते हैं?`)) {
                            reopenLoan(loan.id);
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-xl border border-paper-dim text-ink-muted hover:text-ink text-xs font-semibold flex items-center gap-1 hover:bg-paper-dim transition-all cursor-pointer"
                        title="लोन दोबारा सक्रिय करें"
                      >
                        <RefreshCw size={12} />
                        <span>पुनः सक्रिय</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenCloseModal(loan)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
                      >
                        <CheckCircle2 size={13} />
                        <span>✓ लोन क्लोज़ करें</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT LOAN & EMI                             */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-paper-dim shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-coral" />
                <h3 className="font-serif font-bold text-base text-ink">
                  {editingLoanId ? 'लोन व EMI विवरण संपादित करें' : 'नया लोन / ईएमआई खाता जोड़ें'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-ink-muted hover:text-ink p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              {/* Borrower Member Selection (USER REQUIREMENT: KISKE NAAM SE HAI) */}
              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                  लोन किसके नाम पर है? (Borrower Member) *
                </label>
                <select
                  value={borrowerMemberId}
                  onChange={(e) => setBorrowerMemberId(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-bold text-ink focus:border-gold outline-none"
                  required
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>👤 {m.name} ({m.relationship || 'सदस्य'})</option>
                  ))}
                </select>
              </div>

              {/* Loan Type Selector */}
              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                  लोन का प्रकार (Loan Type) *
                </label>
                <select
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value as LoanType)}
                  className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-bold text-ink focus:border-gold outline-none"
                >
                  <option value="home_loan">🏠 होम लोन (मकान / जमीन निर्माण)</option>
                  <option value="car_loan">🚗 कार / वाहन लोन</option>
                  <option value="business_loan">💼 बिजनेस / व्यापार विस्तार लोन</option>
                  <option value="personal_loan">💳 पर्सनल लोन</option>
                  <option value="gold_loan">🪙 गोल्ड लोन</option>
                  <option value="education_loan">🎓 एजुकेशन / शिक्षा लोन</option>
                  <option value="other">🛡️ अन्य कर्ज / लोन</option>
                </select>
              </div>

              {/* Title & Bank */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                    लोन का नाम / विवरण *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. SBI Home Loan प्लॉट"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-medium text-ink focus:border-gold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                    बैंक / फाइनेंस कंपनी *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. State Bank of India, HDFC"
                    value={lenderBank}
                    onChange={(e) => setLenderBank(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-medium text-ink focus:border-gold outline-none"
                  />
                </div>
              </div>

              {/* Loan Amounts & EMI */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                    कुल लोन (Total ₹) *
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    required
                    placeholder="₹ 20,00,000"
                    value={totalLoanAmount}
                    onChange={(e) => setTotalLoanAmount(e.target.value)}
                    className="w-full px-2.5 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-mono font-bold text-ink focus:border-gold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-coral uppercase tracking-wider mb-1">
                    बाकी बकाया (Due ₹) *
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    required
                    placeholder="₹ 15,40,000"
                    value={outstandingBalance}
                    onChange={(e) => setOutstandingBalance(e.target.value)}
                    className="w-full px-2.5 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-mono font-bold text-coral focus:border-coral outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
                    मासिक EMI (₹) *
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    required
                    placeholder="₹ 22,500"
                    value={monthlyEmiAmount}
                    onChange={(e) => setMonthlyEmiAmount(e.target.value)}
                    className="w-full px-2.5 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-mono font-bold text-emerald-700 dark:text-emerald-400 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Due Day & Account No */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                    हर महीने की तारीख (Due Day) *
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={1}
                      max={31}
                      required
                      placeholder="5"
                      value={emiDueDay}
                      onChange={(e) => setEmiDueDay(e.target.value)}
                      className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-mono font-bold text-ink focus:border-gold outline-none"
                    />
                    <span className="text-ink-muted text-xs whitespace-nowrap">तारीख को</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                    लोन खाता संख्या (A/C No.)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. 409823487..."
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-mono text-ink focus:border-gold outline-none"
                  />
                </div>
              </div>

              {/* Start Date & Tenure (USER REQUEST: KAB SE START HUA HAI, KITNE YEAR KA HAI) */}
              <div className="p-3 rounded-xl bg-paper-dim/30 border border-paper-dim space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
                  <Clock size={13} className="text-coral" />
                  <span>लोन अवधि व शुरुआत विवरण (Tenure & Remaining Time) [वैकल्पिक]</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                    कब से शुरू हुआ है (Loan Start Date)
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl font-mono text-ink focus:border-gold outline-none"
                  />
                  <span className="text-[10px] text-ink-muted block mt-0.5">
                    तारीख दर्ज करने पर बीता हुआ समय और बची हुई किस्तें अपने आप निकल आएंगी
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                      कितने साल का है (Years)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="उदा. 5, 10, 15, 20 साल"
                      value={tenureYears}
                      onChange={(e) => {
                        const y = e.target.value;
                        setTenureYears(y);
                        if (y && !isNaN(parseFloat(y))) {
                          setTenureMonths(String(Math.round(parseFloat(y) * 12)));
                        } else if (y === '') {
                          setTenureMonths('');
                        }
                      }}
                      className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl font-mono text-ink focus:border-gold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                      कुल महीने (Tenure Months)
                    </label>
                    <input
                      type="number"
                      placeholder="उदा. 60, 120 महीने"
                      value={tenureMonths}
                      onChange={(e) => {
                        const m = e.target.value;
                        setTenureMonths(m);
                        if (m && !isNaN(parseInt(m, 10))) {
                          setTenureYears(String(Math.round((parseInt(m, 10) / 12) * 10) / 10));
                        } else if (m === '') {
                          setTenureYears('');
                        }
                      }}
                      className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl font-mono text-ink focus:border-gold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                    ब्याज दर (% Annual Interest Rate)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    placeholder="8.50 %"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl font-mono text-ink focus:border-gold outline-none"
                  />
                </div>

                {/* Live Remaining Time Preview Box */}
                {(() => {
                  const preview = calculateLoanRemainingTime(
                    startDate,
                    { 
                      years: tenureYears ? parseFloat(tenureYears) : undefined, 
                      months: tenureMonths ? parseInt(tenureMonths, 10) : undefined 
                    },
                    outstandingBalance ? parseFloat(outstandingBalance) : undefined,
                    monthlyEmiAmount ? parseFloat(monthlyEmiAmount) : undefined
                  );
                  if (!preview.hasCalculation) return null;
                  return (
                    <div className="p-2.5 rounded-lg bg-coral/10 border border-coral/20 text-coral space-y-1">
                      <div className="flex items-center gap-1 font-bold text-xs">
                        <Clock size={12} />
                        <span>स्वचालित गणना पूर्वावलोकन (Auto Calculated):</span>
                      </div>
                      <p className="text-xs font-black text-ink">
                        ⏳ {preview.remainingText}
                      </p>
                      {preview.endDateFormatted && (
                        <p className="text-[10px] text-ink-muted">
                          अनुमानित अंतिम किश्त / समाप्ति: <strong className="text-ink">{preview.endDateFormatted}</strong>
                        </p>
                      )}
                      {preview.elapsedText && (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                          ✓ {preview.elapsedText}
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Auto Reminder Switch */}
              <div className="p-3 rounded-xl bg-paper-dim/30 border border-paper-dim flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-gold" />
                  <div>
                    <span className="text-xs font-bold text-ink block">
                      मासिक EMI का स्वचालित रिमाइंडर (Auto Reminder)
                    </span>
                    <span className="text-[10px] text-ink-muted">
                      हर महीने किश्त कटने से पहले रिमाइंडर व अलर्ट में दिखेगा
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoReminder}
                  onChange={(e) => setAutoReminder(e.target.checked)}
                  className="w-4 h-4 accent-gold cursor-pointer"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                  विवरण / नोट्स (वैकल्पिक)
                </label>
                <input
                  type="text"
                  placeholder="उदा. ऑटो-डेबिट HDFC सैलरी खाते से होता है"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl text-ink focus:border-gold outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-paper-dim text-ink-muted font-bold hover:bg-paper-dim/50 transition-colors"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-coral hover:bg-coral-dark text-white font-bold flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 size={15} />
                  सुरक्षित सेव करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: CLOSE LOAN & RECORD NOC                         */}
      {/* ======================================================== */}
      {isCloseModalOpen && closingLoan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-paper-dim shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-ink">
                    लोन क्लोज़ / चुकता दर्ज करें
                  </h3>
                  <p className="text-[11px] text-ink-muted">
                    {closingLoan.title} • {closingLoan.lender_bank}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCloseModalOpen(false)}
                className="text-ink-muted hover:text-ink p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs space-y-1">
              <span className="font-bold flex items-center gap-1">
                <AlertCircle size={13} className="text-amber-600" />
                बैंक NOC व क्लोज़र रसीद क्यों ज़रूरी है?
              </span>
              <p className="text-[11px] leading-relaxed text-ink-muted">
                लोन पूरा भरने के बाद बैंक से <strong>NOC (No Dues Certificate)</strong> अवश्य प्राप्त करें। भविष्य में CIBIL में किसी गलती या विवाद से बचने के लिए उसकी फ़ोटो यहाँ सेव कर लें।
              </p>
            </div>

            <form onSubmit={handleExecuteClose} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                  लोन बंद होने / NOC मिलने की तारीख *
                </label>
                <input
                  type="date"
                  required
                  value={closeDate}
                  onChange={(e) => setCloseDate(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-mono text-ink focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                  क्लोज़र विवरण / टिप्पणी
                </label>
                <textarea
                  rows={2}
                  placeholder="उदा. पूरा भुगतान चेक द्वारा हुआ, बैंक से मूल कागज़ात व NOC प्राप्त हुई..."
                  value={closeNotes}
                  onChange={(e) => setCloseNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl text-ink focus:border-gold outline-none resize-none"
                />
              </div>

              {/* Upload NOC Image Now */}
              <div className="p-3 rounded-xl bg-paper-dim/30 border border-paper-dim space-y-2">
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider">
                  बैंक NOC / क्लोज़र लेटर की फ़ोटो (वैकल्पिक परंतु अनुशंसित)
                </label>
                
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 p-3 border-2 border-dashed border-paper-dim hover:border-gold rounded-xl bg-paper transition-all">
                    <Camera size={16} className="text-gold" />
                    <span className="font-bold text-xs text-ink truncate">
                      {closeDocFile ? closeDocFile.name : 'कैमरा या गैलरी से फ़ोटो चुनें'}
                    </span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setCloseDocFile(file);
                        if (file.type.startsWith('image/')) {
                          const reader = new FileReader();
                          reader.onload = () => setCloseDocPreview(reader.result as string);
                          reader.readAsDataURL(file);
                        } else {
                          setCloseDocPreview(null);
                        }
                      }}
                    />
                  </label>
                  {closeDocFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setCloseDocFile(null);
                        setCloseDocPreview(null);
                      }}
                      className="p-2 rounded-lg text-coral hover:bg-coral/10"
                      title="फ़ाइल हटाएं"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {closeDocPreview && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-paper-dim mt-2">
                    <img src={closeDocPreview} alt="NOC Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCloseModalOpen(false)}
                  disabled={isSubmittingClose}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-paper-dim text-ink-muted font-bold hover:bg-paper-dim/50 transition-colors"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingClose}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingClose ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>सेव हो रहा है...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} />
                      <span>✓ लोन क्लोज़ करें</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: LOAN DOCUMENTS & NOC VAULT                      */}
      {/* ======================================================== */}
      {isDocModalOpen && activeLoanForDocs && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-paper-dim shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gold/15 flex items-center justify-center text-gold">
                  <Folder size={20} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-ink">
                    लोन दस्तावेज़ व NOC वॉल्ट
                  </h3>
                  <p className="text-[11px] text-ink-muted">
                    {activeLoanForDocs.title} • {activeLoanForDocs.lender_bank} (👤 {activeLoanForDocs.borrower_member_name})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDocModalOpen(false)}
                className="text-ink-muted hover:text-ink p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* List of Existing Documents */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                  <FileText size={13} className="text-gold" />
                  सेव किए गए कागज़ात ({activeLoanForDocs.documents?.length || 0})
                </span>
              </div>

              {!activeLoanForDocs.documents || activeLoanForDocs.documents.length === 0 ? (
                <div className="p-4 rounded-xl bg-paper-dim/30 border border-dashed border-paper-dim text-center space-y-1">
                  <p className="text-xs font-bold text-ink-muted">इस लोन के लिए अभी कोई दस्तावेज़ सेव नहीं है</p>
                  <p className="text-[11px] text-ink-muted">
                    नीचे दिए गए फॉर्म से बैंक NOC, क्लोज़र लेटर, या रजिस्ट्री रसीद की फ़ोटो खींचकर सेव करें।
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeLoanForDocs.documents.map((doc) => {
                    const cfg = LOAN_DOC_CONFIG[doc.doc_type] || LOAN_DOC_CONFIG.other;
                    const isImg = doc.file_url.startsWith('data:image') || doc.file_url.match(/\.(jpeg|jpg|png|webp|gif)/i) || !doc.file_url.endsWith('.pdf');

                    return (
                      <div
                        key={doc.id}
                        className="p-2.5 rounded-xl bg-paper border border-paper-dim shadow-2xs hover:border-gold/40 transition-all space-y-2"
                      >
                        <div className="flex items-start gap-2">
                          {isImg ? (
                            <button
                              type="button"
                              onClick={() => setFullViewImage({ url: doc.file_url, title: doc.title })}
                              className="w-14 h-14 rounded-lg bg-paper-dim overflow-hidden shrink-0 border border-paper-dim group relative cursor-pointer"
                              title="बड़ा देखने के लिए क्लिक करें"
                            >
                              <img src={doc.file_url} alt={doc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                <Eye size={14} />
                              </div>
                            </button>
                          ) : (
                            <div className="w-14 h-14 rounded-lg bg-red-500/10 text-red-600 flex flex-col items-center justify-center shrink-0 border border-red-500/20">
                              <FileText size={20} />
                              <span className="text-[9px] font-bold">PDF</span>
                            </div>
                          )}

                          <div className="flex-1 min-w-0 space-y-0.5">
                            <span
                              className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded"
                              style={{ backgroundColor: cfg.color + '15', color: cfg.color }}
                            >
                              {cfg.badge}
                            </span>
                            <h5 className="text-xs font-bold text-ink truncate" title={doc.title}>
                              {doc.title}
                            </h5>
                            <span className="text-[10px] text-ink-muted block">
                              {new Date(doc.uploaded_at).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        {doc.notes && (
                          <p className="text-[10px] text-ink-muted italic bg-paper-dim/40 p-1.5 rounded">
                            {doc.notes}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-1 border-t border-paper-dim text-xs">
                          <button
                            type="button"
                            onClick={() => setFullViewImage({ url: doc.file_url, title: doc.title })}
                            className="text-[11px] font-bold text-gold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Eye size={12} /> बड़ा देखें
                          </button>

                          <div className="flex items-center gap-1">
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              download={doc.file_name || 'loan-document'}
                              className="p-1 rounded text-ink-muted hover:text-ink"
                              title="डाउनलोड / ओपन करें"
                            >
                              <ExternalLink size={13} />
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`क्या आप ${doc.title} को हटाना चाहते हैं?`)) {
                                  deleteLoanDocument(activeLoanForDocs.id, doc.id);
                                }
                              }}
                              className="p-1 rounded text-ink-muted hover:text-coral cursor-pointer"
                              title="हटाएं"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Form to Add New Document */}
            <div className="pt-3 border-t border-paper-dim space-y-3">
              <span className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                <Plus size={13} className="text-coral" />
                नया दस्तावेज़ / फ़ोटो जोड़ें
              </span>

              <form onSubmit={handleUploadNewDoc} className="space-y-3 text-xs bg-paper-dim/30 p-3.5 rounded-xl border border-paper-dim">
                <div>
                  <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                    कागज़ का प्रकार (Document Type) *
                  </label>
                  <select
                    value={newDocType}
                    onChange={(e) => {
                      const t = e.target.value as LoanDocType;
                      setNewDocType(t);
                      setNewDocTitle(`${activeLoanForDocs.title} - ${LOAN_DOC_CONFIG[t]?.badge}`);
                    }}
                    className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl font-bold text-ink focus:border-gold outline-none"
                  >
                    <option value="noc">📑 बैंक NOC / No Dues Certificate (अनापत्ति पत्र)</option>
                    <option value="closure_letter">📜 लोन क्लोज़र लेटर (Final Settlement Letter)</option>
                    <option value="handover_receipt">🏠 मूल रजिस्ट्री / RC वापसी रसीद (Title Deed Return)</option>
                    <option value="form_35">🚗 RTO Form 35 (Hypothecation Termination)</option>
                    <option value="sanction_letter">📝 लोन स्वीकृति पत्र (Sanction Letter)</option>
                    <option value="other">📁 अन्य बैंक रसीद / कागज़</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                    दस्तावेज़ का नाम / शीर्षक *
                  </label>
                  <input
                    type="text"
                    required
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    placeholder="उदा. HDFC Car Loan - No Dues Certificate"
                    className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl font-medium text-ink focus:border-gold outline-none"
                  />
                </div>

                {/* File / Camera Input */}
                <div>
                  <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                    फ़ोटो या फ़ाइल चुनें (Camera / File) *
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 p-2.5 border border-paper-dim hover:border-gold rounded-xl bg-paper transition-all">
                      <Camera size={15} className="text-gold" />
                      <span className="font-bold text-xs text-ink truncate">
                        {newDocFile ? newDocFile.name : 'कैमरा या गैलरी से फ़ोटो लें'}
                      </span>
                      <input
                        type="file"
                        required
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setNewDocFile(file);
                          if (file.type.startsWith('image/')) {
                            const reader = new FileReader();
                            reader.onload = () => setNewDocPreview(reader.result as string);
                            reader.readAsDataURL(file);
                          } else {
                            setNewDocPreview(null);
                          }
                        }}
                      />
                    </label>
                    {newDocFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setNewDocFile(null);
                          setNewDocPreview(null);
                        }}
                        className="p-2 rounded-lg text-coral hover:bg-coral/10"
                        title="हटाएं"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {newDocPreview && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-paper-dim mt-2">
                      <img src={newDocPreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                    टिप्पणी / विवरण (वैकल्पिक)
                  </label>
                  <input
                    type="text"
                    value={newDocNotes}
                    onChange={(e) => setNewDocNotes(e.target.value)}
                    placeholder="उदा. ब्रांच मैनेजर के हस्ताक्षर वाली असली कॉपी"
                    className="w-full px-3 py-2 bg-paper border border-paper-dim rounded-xl text-ink focus:border-gold outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUploadingDoc || !newDocFile}
                  className="w-full py-2.5 px-3 rounded-xl bg-gold hover:bg-gold-dark text-white font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isUploadingDoc ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Cloudinary पर सुरक्षित सेव हो रहा है...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      <span>दस्तावेज़ सुरक्षित सेव करें</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: FULL SCREEN IMAGE PREVIEW                       */}
      {/* ======================================================== */}
      {fullViewImage && (
        <div 
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setFullViewImage(null)}
        >
          <div 
            className="max-w-3xl w-full bg-paper rounded-2xl overflow-hidden border border-paper-dim shadow-2xl p-3 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-paper-dim px-2">
              <span className="font-bold text-sm text-ink truncate">
                {fullViewImage.title}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={fullViewImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-paper-dim"
                  title="नए टैब में खोलें"
                >
                  <ExternalLink size={16} />
                </a>
                <button
                  onClick={() => setFullViewImage(null)}
                  className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-paper-dim cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="max-h-[75vh] overflow-auto flex items-center justify-center bg-black/10 rounded-xl p-2">
              <img 
                src={fullViewImage.url} 
                alt={fullViewImage.title} 
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-md" 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
