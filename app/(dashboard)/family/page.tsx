'use client';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { MemberCard } from '@/components/family/MemberCard';
import { FamilyTreeView } from '@/components/family/FamilyTreeView';
import Link from 'next/link';
import { 
  HeartPulse, Sparkles, Plus, Edit2, Check, Share2, Copy, Users, X, 
  Landmark, UserCheck, ArrowRight, Receipt, CreditCard, Plane, Briefcase, 
  Store, Clock, MapPin, DollarSign 
} from 'lucide-react';
import { Member } from '@/types';

const MEMBER_COLORS = ['#B98B2A', '#4C7A5E', '#C1502E', '#2B4C7E', '#8E44AD', '#D35400'];

export default function FamilyPage() {
  const { family, members, addMember, updateMember, updateFamilyName } = useFamilyStore();
  
  // State for Add Member Modal
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState<'owner' | 'member'>('member');
  const [memberRelation, setMemberRelation] = useState('Spouse');

  // State for Editing Member Profession & Work Profile
  const [selectedMemberForEdit, setSelectedMemberForEdit] = useState<Member | null>(null);
  const [profType, setProfType] = useState<Member['profession_type']>('business');
  const [profDesignation, setProfDesignation] = useState('');
  const [profIncome, setProfIncome] = useState('');
  const [profTimings, setProfTimings] = useState('');
  const [profAddress, setProfAddress] = useState('');

  // State for Editing Family Name
  const [isEditingFamily, setIsEditingFamily] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState(family.name);

  // State for copied feedback
  const [copied, setCopied] = useState(false);

  const handleSaveFamilyName = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFamilyName.trim()) {
      updateFamilyName(newFamilyName.trim());
      setIsEditingFamily(false);
    }
  };

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;

    const trimmed = memberName.trim();
    const color = MEMBER_COLORS[members.length % MEMBER_COLORS.length];
    const initials = trimmed.slice(0, 2).toUpperCase();

    addMember({
      name: `${trimmed} (${memberRelation})`,
      role: memberRole,
      color,
      initials,
    });

    setMemberName('');
    setIsAddMemberOpen(false);
  };

  const handleOpenEditMember = (m: Member) => {
    setSelectedMemberForEdit(m);
    setProfType(m.profession_type || 'business');
    setProfDesignation(m.designation_or_business_name || '');
    setProfIncome(m.monthly_income ? String(m.monthly_income) : '');
    setProfTimings(m.work_timings || '');
    setProfAddress(m.workplace_address || '');
  };

  const handleSaveMemberProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberForEdit) return;

    updateMember(selectedMemberForEdit.id, {
      profession_type: profType,
      designation_or_business_name: profDesignation.trim() || undefined,
      monthly_income: profIncome ? Number(profIncome) : undefined,
      work_timings: profTimings.trim() || undefined,
      workplace_address: profAddress.trim() || undefined,
    });

    setSelectedMemberForEdit(null);
  };

  const handleShareCode = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(family.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `मेरे परिवार "${family.name}" के Family Wealth Vault में जुड़ें।\nInvite Code: ${family.invite_code}`
  )}`;

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Family"
        subtitle="परिवार के सदस्य, पेशा (Business/Job) व प्रोफाइल"
        action={
          <button
            onClick={() => setIsAddMemberOpen(true)}
            className="px-3 py-1.5 bg-gold text-navy font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm hover:bg-gold-light active:scale-95 transition-all"
          >
            <Plus size={15} /> सदस्य जोड़ें
          </button>
        }
      />

      {/* Family Name Banner & Edit */}
      <div className="px-4">
        <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-sm flex items-center justify-between">
          <div className="flex-1 min-w-0 mr-2">
            <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block">
              परिवार का नाम (Family Vault)
            </span>
            {isEditingFamily ? (
              <form onSubmit={handleSaveFamilyName} className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={newFamilyName}
                  onChange={(e) => setNewFamilyName(e.target.value)}
                  className="px-2.5 py-1 text-sm bg-paper-dim/40 border border-gold rounded-lg font-serif font-bold text-ink focus:outline-hidden flex-1"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-gold text-navy text-xs font-bold rounded-lg shadow-xs"
                >
                  सेव
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingFamily(false)}
                  className="px-2 py-1 text-ink-muted text-xs hover:text-ink"
                >
                  रद्द
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 mt-0.5">
                <h2 className="text-base font-serif font-bold text-ink truncate">{family.name}</h2>
                <button
                  type="button"
                  onClick={() => {
                    setNewFamilyName(family.name);
                    setIsEditingFamily(true);
                  }}
                  className="p-1 text-ink-muted hover:text-gold transition-colors"
                  title="परिवार का नाम बदलें"
                >
                  <Edit2 size={13} />
                </button>
              </div>
            )}
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] font-mono text-gold-dark font-bold bg-gold/10 px-2 py-0.5 rounded-full">
              {members.length} सदस्य
            </span>
          </div>
        </div>
      </div>

      {/* Member List */}
      <div className="px-4 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
              परिवार के सदस्य ({members.length})
            </h3>
            <span className="text-[10px] text-ink-muted">क्लिक करके पेशा (Business/Job), समय व आय बदलें</span>
          </div>
          <button
            onClick={() => setIsAddMemberOpen(true)}
            className="text-xs font-bold text-gold hover:underline flex items-center gap-1"
          >
            <Plus size={13} /> नया जोड़ें
          </button>
        </div>

        <div className="rounded-xl bg-paper border border-paper-dim overflow-hidden divide-y divide-paper-dim shadow-sm">
          {members.map((m) => (
            <MemberCard key={m.id} member={m} onClick={() => handleOpenEditMember(m)} />
          ))}
        </div>
      </div>

      {/* Family Tree Link */}
      <div className="px-4">
        <FamilyTreeView />
      </div>

      {/* Family Accounts, Central Fund, Staff & Travel Reimbursement Grid */}
      <div className="px-4 space-y-2">
        <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
          पारिवारिक कोष, टूर क्लेम व हिसाब-किताब
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          <Link
            href="/family/hisab?tab=fund"
            className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/10 via-paper to-paper border border-amber-500/30 hover:border-amber-500 transition-all shadow-sm block group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <Landmark size={20} className="text-amber-500 group-hover:scale-110 transition-transform" />
              <ArrowRight size={14} className="text-amber-500/60 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <h4 className="text-xs font-black text-ink">🏛️ सदस्य कैशफ्लो</h4>
            <p className="text-[10px] text-ink-muted mt-0.5 leading-relaxed">
              किराया, लाभ, ब्याज व निवेश
            </p>
          </Link>

          <Link
            href="/family/hisab?tab=travel"
            className="p-3.5 rounded-xl bg-gradient-to-br from-blue-500/15 via-paper to-paper border border-blue-500/30 hover:border-blue-500 transition-all shadow-sm block group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <Plane size={20} className="text-blue-500 group-hover:scale-110 transition-transform" />
              <ArrowRight size={14} className="text-blue-500/60 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <h4 className="text-xs font-black text-ink">✈️ टूर व यात्रा क्लेम</h4>
            <p className="text-[10px] text-ink-muted mt-0.5 leading-relaxed">
              जॉब/व्यापार यात्रा, रसीदें व प्रतिपूर्ति
            </p>
          </Link>

          <Link
            href="/family/hisab?tab=loans"
            className="p-3.5 rounded-xl bg-gradient-to-br from-rose-500/10 via-paper to-paper border border-rose-500/30 hover:border-rose-500 transition-all shadow-sm block group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <CreditCard size={20} className="text-rose-500 group-hover:scale-110 transition-transform" />
              <ArrowRight size={14} className="text-rose-500/60 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <h4 className="text-xs font-black text-ink">💳 लोन व EMI हब</h4>
            <p className="text-[10px] text-ink-muted mt-0.5 leading-relaxed">
              सोलर, दुकान लोन ऑटो-सिंक
            </p>
          </Link>

          <Link
            href="/family/hisab?tab=aapsi"
            className="p-3.5 rounded-xl bg-paper border border-paper-dim hover:border-gold/40 transition-all shadow-sm block group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <Receipt size={20} className="text-gold group-hover:scale-110 transition-transform" />
              <ArrowRight size={14} className="text-gold/60 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <h4 className="text-xs font-bold text-ink">👥 सदस्य आपसी हिसाब</h4>
            <p className="text-[10px] text-ink-muted mt-0.5 leading-relaxed">
              सामान पर्ची vs एडवांस रीसीट
            </p>
          </Link>

          <Link
            href="/family/hisab?tab=staff"
            className="p-3.5 rounded-xl bg-paper border border-paper-dim hover:border-blue-400/40 transition-all shadow-sm block group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <UserCheck size={20} className="text-blue-500 group-hover:scale-110 transition-transform" />
              <ArrowRight size={14} className="text-blue-400/60 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <h4 className="text-xs font-bold text-ink">🧹 घरेलू कर्मचारी</h4>
            <p className="text-[10px] text-ink-muted mt-0.5 leading-relaxed">
              अटेंडेंस, मासिक वेतन व एडवांस
            </p>
          </Link>
        </div>
      </div>

      {/* Quick Links to Medical & AI Advisor */}
      <div className="px-4 grid grid-cols-2 gap-3">
        <Link
          href="/medical"
          className="p-4 rounded-xl bg-paper border border-paper-dim hover:border-coral/40 transition-all shadow-sm block"
        >
          <HeartPulse size={20} className="text-coral mb-1.5" />
          <h3 className="text-sm font-semibold text-ink">Medical Records</h3>
          <p className="text-[11px] text-ink-muted mt-0.5">दवाइयाँ और ब्लड ग्रुप</p>
        </Link>

        <Link
          href="/advisor"
          className="p-4 rounded-xl bg-paper border border-paper-dim hover:border-gold/40 transition-all shadow-sm block"
        >
          <Sparkles size={20} className="text-gold mb-1.5" />
          <h3 className="text-sm font-semibold text-ink">AI Advisor</h3>
          <p className="text-[11px] text-ink-muted mt-0.5">बचत व निवेश सलाह</p>
        </Link>
      </div>

      {/* Working Invite Code Box with WhatsApp & Copy */}
      <div className="px-4">
        <div className="p-4 rounded-xl bg-paper-dim/80 border border-paper-dim space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider">
                Family Invite Code
              </span>
              <p className="font-mono font-bold text-sm text-ink">{family.invite_code}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShareCode}
                className="text-xs text-navy font-bold bg-gold hover:bg-gold-light px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all cursor-pointer"
              >
                {copied ? <Check size={13} className="text-green" /> : <Copy size={13} />}
                <span>{copied ? 'कॉपी हुआ!' : 'Copy Code'}</span>
              </button>
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white font-bold bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all"
              >
                <Share2 size={13} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
          <p className="text-[10px] text-ink-muted">
            परिवार के सदस्यों को कोड भेजें ताकि वे अपने फोन से इस तिजोरी में जुड़ सकें।
          </p>
        </div>
      </div>

      {/* MODAL: EDIT MEMBER PROFESSION & WORK PROFILE */}
      {selectedMemberForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <div className="flex items-center justify-between border-b border-paper-dim pb-2.5">
              <div className="flex items-center gap-2">
                <Briefcase size={18} className="text-amber-500" />
                <div>
                  <h3 className="text-sm font-bold text-ink">{selectedMemberForEdit.name}</h3>
                  <span className="text-[10px] text-ink-muted">पेशा, कार्य समय व मासिक आय प्रोफाइल</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedMemberForEdit(null)}
                className="text-ink-muted hover:text-ink p-1 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveMemberProfile} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  पेशा का प्रकार (Profession Type) *
                </label>
                <select
                  value={profType}
                  onChange={(e) => setProfType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-paper-subtle border border-paper-dim rounded-xl font-semibold text-ink"
                >
                  <option value="business">🏬 व्यापार / दुकान (Business Owner)</option>
                  <option value="job">💼 नौकरी / वेतनभोगी (Salaried Job)</option>
                  <option value="professional">🎓 पेशेवर / सलाहकार (Doctor/CA/Lawyer/Consultant)</option>
                  <option value="homemaker">🏡 गृहणी (Homemaker)</option>
                  <option value="student">📚 विद्यार्थी (Student)</option>
                  <option value="other">अन्य पेशा (Other)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  दुकान / कंपनी का नाम या पद (Business Name / Designation)
                </label>
                <input
                  type="text"
                  placeholder="उदा. श्री गणेश किराना व जनरल स्टोर्स या TCS Software Engineer"
                  value={profDesignation}
                  onChange={(e) => setProfDesignation(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-subtle border border-paper-dim rounded-xl text-ink font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">
                    मासिक आय / सैलरी (₹/माह)
                  </label>
                  <input
                    type="number"
                    placeholder="85000"
                    value={profIncome}
                    onChange={(e) => setProfIncome(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-subtle border border-paper-dim rounded-xl font-mono font-bold text-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">
                    काम का समय (Work Timings)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. 09:30 AM - 08:30 PM"
                    value={profTimings}
                    onChange={(e) => setProfTimings(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-subtle border border-paper-dim rounded-xl text-ink"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  ऑफिस / दुकान का पता (Workplace Address)
                </label>
                <input
                  type="text"
                  placeholder="उदा. मुख्य बाजार, दुकान नंबर 1, सिटी सेंटर"
                  value={profAddress}
                  onChange={(e) => setProfAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-subtle border border-paper-dim rounded-xl text-ink"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-paper-dim">
                <button
                  type="button"
                  onClick={() => setSelectedMemberForEdit(null)}
                  className="px-3.5 py-1.5 font-bold text-ink-muted hover:text-ink cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-navy font-bold rounded-xl shadow-xs cursor-pointer transition-all"
                >
                  ✓ प्रोफाइल सुरक्षित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <Users size={18} className="text-gold" />
                नया परिवार सदस्य जोड़ें
              </h3>
              <button
                onClick={() => setIsAddMemberOpen(false)}
                className="text-ink-muted hover:text-ink p-1 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  सदस्य का नाम (Name)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Sharma या Sunita"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-subtle border border-paper-dim rounded-xl text-ink font-semibold"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  रिश्ता (Relation)
                </label>
                <select
                  value={memberRelation}
                  onChange={(e) => setMemberRelation(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-subtle border border-paper-dim rounded-xl text-ink"
                >
                  <option value="Father">Father (पिताजी)</option>
                  <option value="Mother">Mother (माताजी)</option>
                  <option value="Spouse">Spouse (पति / पत्नी)</option>
                  <option value="Son">Son (बेटा)</option>
                  <option value="Daughter">Daughter (बेटी)</option>
                  <option value="Brother">Brother (भाई)</option>
                  <option value="Sister">Sister (बहन)</option>
                  <option value="Other">Other (अन्य)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  अनुमति (Role)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMemberRole('member')}
                    className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                      memberRole === 'member'
                        ? 'border-gold bg-gold/15 text-gold-dark'
                        : 'border-paper-dim bg-paper text-ink-muted'
                    }`}
                  >
                    Member (साधारण)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMemberRole('owner')}
                    className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                      memberRole === 'owner'
                        ? 'border-gold bg-gold/15 text-gold-dark'
                        : 'border-paper-dim bg-paper text-ink-muted'
                    }`}
                  >
                    Owner (मुखिया)
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-paper-dim">
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(false)}
                  className="px-3 py-1.5 text-ink-muted hover:text-ink cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  जोड़ें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
