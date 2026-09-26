'use client';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { MemberCard } from '@/components/family/MemberCard';
import { FamilyTreeView } from '@/components/family/FamilyTreeView';
import Link from 'next/link';
import { HeartPulse, Sparkles, Plus, Edit2, Check, Share2, Copy, Users, X } from 'lucide-react';

const MEMBER_COLORS = ['#B98B2A', '#4C7A5E', '#C1502E', '#2B4C7E', '#8E44AD', '#D35400'];

export default function FamilyPage() {
  const { family, members, addMember, updateFamilyName } = useFamilyStore();
  
  // State for Add Member Modal
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState<'owner' | 'member'>('member');
  const [memberRelation, setMemberRelation] = useState('Spouse');

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
        subtitle="परिवार के सदस्य व प्रोफाइल"
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
                  className="px-2.5 py-1 text-sm bg-paper-dim/40 border border-gold rounded-lg font-serif font-bold text-ink focus:outline-none flex-1"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-1.5 bg-gold text-navy rounded-lg hover:bg-gold-light shadow-sm"
                  title="Save"
                >
                  <Check size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingFamily(false)}
                  className="p-1.5 bg-paper-dim text-ink-muted rounded-lg"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 mt-0.5">
                <h2 className="text-base font-serif font-bold text-ink truncate">{family.name}</h2>
                <button
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
          <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
            परिवार के सदस्य ({members.length})
          </h3>
          <button
            onClick={() => setIsAddMemberOpen(true)}
            className="text-xs font-bold text-gold hover:underline flex items-center gap-1"
          >
            <Plus size={13} /> नया जोड़ें
          </button>
        </div>

        <div className="rounded-xl bg-paper border border-paper-dim overflow-hidden divide-y divide-paper-dim shadow-sm">
          {members.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      </div>

      {/* Family Tree Link */}
      <div className="px-4">
        <FamilyTreeView />
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
                className="text-xs text-navy font-bold bg-gold hover:bg-gold-light px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all"
              >
                {copied ? <Check size={13} className="text-green" /> : <Copy size={13} />}
                <span>{copied ? 'कॉपी हुआ!' : 'Copy Code'}</span>
              </button>
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white font-bold bg-green hover:bg-green-600 px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all"
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

      {/* Add Member Modal */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <Users size={18} className="text-gold" />
                नया परिवार सदस्य जोड़ें
              </h3>
              <button
                onClick={() => setIsAddMemberOpen(false)}
                className="text-ink-muted hover:text-ink p-1"
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
                  className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold"
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
                  className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold text-ink"
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
                    View & Add (Member)
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
                    Full Control (Owner)
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink-muted font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gold text-navy font-bold hover:bg-gold-light shadow-sm"
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
