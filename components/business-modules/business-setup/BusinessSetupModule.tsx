'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Landmark, PieChart, Layers, Trash2, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

interface SetupExpense {
  id: string;
  title: string;
  category: 'interior' | 'machinery' | 'licence' | 'advance_deposit' | 'branding' | 'raw_material';
  amount: number;
  paidBy: string; // e.g. Self Savings, Mudra Loan, Private Loan
  vendorName: string;
  date: string;
}

interface SetupProject {
  id: string;
  name: string;
  type: string; // e.g. Cafe, Bakery, Cloth Store, Garage
  targetLaunchDate: string;
  budgetCapEx: number;
  fundingSources: {
    name: string; // e.g. Self Capital, Bank MSME Loan, Family Relative
    allocatedAmount: number;
    disbursedAmount: number;
  }[];
  expenses: SetupExpense[];
}

const DEFAULT_PROJECT: SetupProject = {
  id: 'proj-1',
  name: 'न्यू बेकरी एंड कैफ़े प्रोजेक्ट',
  type: 'Bakery & Cafe',
  targetLaunchDate: '2026-11-01',
  budgetCapEx: 1500000,
  fundingSources: [
    { name: 'खुद की बचत (Self Capital)', allocatedAmount: 700000, disbursedAmount: 700000 },
    { name: 'PMEGP / Mudra Bank Loan', allocatedAmount: 800000, disbursedAmount: 400000 }
  ],
  expenses: [
    {
      id: 'exp-1',
      title: 'दुकान का सिक्योरिटी एडवांस (Pagdi/Deposit)',
      category: 'advance_deposit',
      amount: 250000,
      paidBy: 'खुद की बचत',
      vendorName: 'दुकान मालिक गुप्ता जी',
      date: '2026-08-10'
    },
    {
      id: 'exp-2',
      title: 'कमर्शियल ओवन और डीप फ्रीजर',
      category: 'machinery',
      amount: 320000,
      paidBy: 'Mudra Bank Loan',
      vendorName: 'दिल्ली किचन इक्विपमेंट',
      date: '2026-08-28'
    },
    {
      id: 'exp-3',
      title: 'इंटीरियर काउंटर, लकड़ी का रैक और लाइटिंग',
      category: 'interior',
      amount: 180000,
      paidBy: 'Mudra Bank Loan',
      vendorName: 'कारपेंटर रफ़ीक',
      date: '2026-09-05'
    },
    {
      id: 'exp-4',
      title: 'FSSAI फ़ूड लाइसेंस और GST रजिस्ट्रेशन',
      category: 'licence',
      amount: 15000,
      paidBy: 'खुद की बचत',
      vendorName: 'CA वर्मा जी',
      date: '2026-09-12'
    }
  ]
};

export function BusinessSetupModule() {
  const [project, setProject] = useState<SetupProject>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_biz_setup_v1');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { }
      }
    }
    return DEFAULT_PROJECT;
  });

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  // Form State
  const [expTitle, setExpTitle] = useState('');
  const [expCategory, setExpCategory] = useState<SetupExpense['category']>('interior');
  const [expAmount, setExpAmount] = useState<number | ''>('');
  const [expPaidBy, setExpPaidBy] = useState('खुद की बचत');
  const [expVendor, setExpVendor] = useState('');
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    localStorage.setItem('fwa_biz_setup_v1', JSON.stringify(project));
  }, [project]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle || !expAmount) return;

    const newExp: SetupExpense = {
      id: `exp-${Date.now()}`,
      title: expTitle,
      category: expCategory,
      amount: Number(expAmount),
      paidBy: expPaidBy,
      vendorName: expVendor || 'विविध',
      date: expDate
    };

    setProject({
      ...project,
      expenses: [newExp, ...project.expenses]
    });

    setIsAddExpenseOpen(false);
    setExpTitle('');
    setExpAmount('');
    setExpVendor('');
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('क्या आप इस ख़र्च को हटाना चाहते हैं?')) {
      setProject({
        ...project,
        expenses: project.expenses.filter(e => e.id !== id)
      });
    }
  };

  const totalSpent = project.expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalFunding = project.fundingSources.reduce((sum, f) => sum + f.allocatedAmount, 0);
  const budgetRemaining = Math.max(0, project.budgetCapEx - totalSpent);
  const spentPct = Math.min(100, Math.round((totalSpent / project.budgetCapEx) * 100));

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-navy text-paper p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gold/20 text-gold rounded-xl">
              <Briefcase size={20} />
            </span>
            <div>
              <h2 className="text-base font-bold font-serif">{project.name}</h2>
              <p className="text-[11px] text-paper-dim/80">Day-0 प्री-लॉन्च ख़र्चे, मशीनरी, इंटीरियर व फंडिंग ट्रैकर</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="px-3 py-1.5 bg-gold text-navy text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-gold-light active:scale-95 transition-all shadow-sm"
          >
            <Plus size={15} /> नया ख़र्च
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-xs">
            <span className="text-paper-dim">कुल बजट इस्तेमाल ({spentPct}%):</span>
            <span className="font-semibold text-gold">₹{totalSpent.toLocaleString('en-IN')} / ₹{project.budgetCapEx.toLocaleString('en-IN')}</span>
          </div>
          <div className="w-full h-2 bg-navy-light/60 rounded-full overflow-hidden">
            <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${spentPct}%` }} />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-navy-light/40">
          <div className="bg-navy-light/40 p-2 rounded-xl">
            <p className="text-[10px] text-paper-dim/70">कुल ख़र्च हो चुका (Actual CapEx)</p>
            <Mono className="text-sm font-bold text-coral-light">₹{totalSpent.toLocaleString('en-IN')}</Mono>
          </div>
          <div className="bg-navy-light/40 p-2 rounded-xl">
            <p className="text-[10px] text-paper-dim/70">बाकी बचा बजट</p>
            <Mono className="text-sm font-bold text-green">₹{budgetRemaining.toLocaleString('en-IN')}</Mono>
          </div>
        </div>
      </div>

      {/* Funding Sources */}
      <div className="bg-paper border border-paper-dim rounded-2xl p-4 shadow-sm space-y-2">
        <h3 className="text-xs font-bold text-ink uppercase tracking-wider">फंडिंग स्रोत (Funding Tranches)</h3>
        <div className="grid grid-cols-1 gap-2">
          {project.fundingSources.map((fs, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-paper-dim/40 text-xs">
              <div>
                <p className="font-bold text-ink">{fs.name}</p>
                <p className="text-[10px] text-ink-muted">आया: ₹{fs.disbursedAmount.toLocaleString('en-IN')} / कुल तय: ₹{fs.allocatedAmount.toLocaleString('en-IN')}</p>
              </div>
              <Mono className="font-bold text-gold-dark">₹{fs.disbursedAmount.toLocaleString('en-IN')}</Mono>
            </div>
          ))}
        </div>
      </div>

      {/* Expenses Log */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-ink uppercase tracking-wider px-1">
          प्री-लॉन्च ख़र्चे व बिल ({project.expenses.length})
        </h3>

        {project.expenses.map(exp => (
          <div key={exp.id} className="bg-paper border border-paper-dim rounded-2xl p-4 shadow-sm space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 bg-paper-dim text-ink-muted text-[10px] font-bold rounded-md uppercase">
                    {exp.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-ink-muted">दुकानदार: {exp.vendorName}</span>
                </div>
                <h4 className="text-sm font-bold text-ink mt-0.5">{exp.title}</h4>
              </div>
              <div className="text-right">
                <Mono className="text-sm font-bold text-coral">₹{exp.amount.toLocaleString('en-IN')}</Mono>
                <p className="text-[10px] text-ink-muted">{exp.date}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-ink-muted border-t border-paper-dim">
              <span>भुगतान स्रोत: <strong className="text-ink">{exp.paidBy}</strong></span>
              <button
                onClick={() => handleDeleteExpense(exp.id)}
                className="text-coral hover:text-coral-dark p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-ink">नया प्री-ऑप ख़र्च जोड़ें</h3>
            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div>
                <label className="block text-ink-muted mb-1">ख़र्च का शीर्षक</label>
                <input
                  type="text"
                  placeholder="उदा. 3 टन AC व बिजली फिटिंग"
                  value={expTitle}
                  onChange={e => setExpTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">ख़र्च श्रेणी</label>
                  <select
                    value={expCategory}
                    onChange={e => setExpCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim focus:outline-none focus:border-gold"
                  >
                    <option value="interior">इंटीरियर व फर्नीचर</option>
                    <option value="machinery">मशीनरी व उपकरण</option>
                    <option value="advance_deposit">दुकान एडवांस / पगड़ी</option>
                    <option value="licence">लाइसेंस व CA फीस</option>
                    <option value="branding">बोर्ड, फ्लेक्स व ब्रांडिंग</option>
                    <option value="raw_material">शुरुआती कच्चा माल</option>
                  </select>
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">रकम (₹)</label>
                  <input
                    type="number"
                    placeholder="45000"
                    value={expAmount}
                    onChange={e => setExpAmount(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">दुकानदार / वेंडर का नाम</label>
                  <input
                    type="text"
                    placeholder="उदा. वोल्टास डीलर"
                    value={expVendor}
                    onChange={e => setExpVendor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">भुगतान स्रोत</label>
                  <select
                    value={expPaidBy}
                    onChange={e => setExpPaidBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim focus:outline-none focus:border-gold"
                  >
                    <option value="खुद की बचत">खुद की बचत (Self)</option>
                    <option value="Mudra Bank Loan">बैंक मुद्रा लोन (Mudra)</option>
                    <option value="रिश्तेदार/पार्टनर">रिश्तेदार/पार्टनर फंड</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-ink-muted mb-1">तारीख</label>
                <input
                  type="date"
                  value={expDate}
                  onChange={e => setExpDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
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
    </div>
  );
}
