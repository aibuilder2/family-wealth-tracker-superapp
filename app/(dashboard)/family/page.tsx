'use client';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { MemberCard } from '@/components/family/MemberCard';
import { FamilyTreeView } from '@/components/family/FamilyTreeView';
import Link from 'next/link';
import { HeartPulse, Key, Sparkles, Plus, X, User, Phone, Users, Share2 } from 'lucide-react';

const RELATIONSHIPS = [
  'Self / Mukhiya', 'Patni (Wife)', 'Pati (Husband)',
  'Beta (Son)', 'Beti (Daughter)',
  'Pita (Father)', 'Mata (Mother)',
  'Bhai (Brother)', 'Behen (Sister)',
  'Dada (Grandfather)', 'Dadi (Grandmother)',
  'Nana (Maternal Grandfather)', 'Nani (Maternal Grandmother)',
  'Chacha (Uncle)', 'Chachi (Aunt)',
  'Mama (Maternal Uncle)', 'Maami (Maternal Aunt)',
  'Bhatija (Nephew)', 'Bhatiji (Niece)',
  'Dost (Friend)', 'Anyaa (Other)',
];

export default function FamilyPage() {
  const { family, members, addMember } = useFamilyStore();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [dob, setDob] = useState('');
  const [role, setRole] = useState<'owner' | 'member'>('member');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return alert('Naam zaroori hai');
    if (!relationship) return alert('Rishta chunna zaroori hai');
    setSaving(true);
    addMember({
      name: name.trim(),
      phone: phone.trim() || undefined,
      relationship,
      dob: dob || undefined,
      role,
      color: ['#B98B2A', '#34D399', '#60A5FA', '#F472B6', '#A78BFA', '#FB923C', '#34D399'][members.length % 7],
      initials: name.trim().charAt(0).toUpperCase(),
      permissions: {
        can_view_investments: role === 'member',
        can_view_bills: role === 'member',
        can_view_vault: false,
        can_view_medical: true,
        can_view_staff: false,
        can_view_cases: false,
        is_admin: false,
      }
    });
    setSaving(false);
    setShowAddModal(false);
    setName(''); setPhone(''); setRelationship(''); setDob(''); setRole('member');
  };

  const handleWhatsAppInvite = () => {
    const code = family.invite_code;
    const msg = encodeURIComponent(`🏠 *Mera Parivar App* pe hamare parivar se jud jaao!\n\nFamily Invite Code: *${code}*\n\nApp download karo aur apna account banao, phir ye code use karo.`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Family"
        subtitle="Parivar ke sabhi members"
        action={
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-gold text-white px-3 py-1.5 rounded-xl text-sm font-semibold shadow-sm hover:bg-gold/90 transition-all active:scale-95"
          >
            <Plus size={16} />
            Sadasya Jodein
          </button>
        }
      />

      {/* Member List */}
      <div className="px-4">
        <div className="rounded-xl bg-paper border border-paper-dim overflow-hidden divide-y divide-paper-dim shadow-sm">
          {members.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      </div>

      {/* Add Member + WhatsApp Invite Banner */}
      <div className="px-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => setShowAddModal(true)}
          className="p-4 rounded-xl bg-gold/10 border-2 border-gold/30 hover:border-gold transition-all shadow-sm flex flex-col items-start gap-1 active:scale-95"
        >
          <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
            <Plus size={18} className="text-gold" />
          </div>
          <span className="text-sm font-bold text-ink">Sadasya Jodein</span>
          <span className="text-[11px] text-ink-muted">Naaya parivar sadasya add karo</span>
        </button>

        <button
          onClick={handleWhatsAppInvite}
          className="p-4 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/30 hover:border-emerald-500 transition-all shadow-sm flex flex-col items-start gap-1 active:scale-95"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Share2 size={18} className="text-emerald-500" />
          </div>
          <span className="text-sm font-bold text-ink">WhatsApp Invite</span>
          <span className="text-[11px] text-ink-muted">Code se invite karo</span>
        </button>
      </div>

      {/* Family Tree Link */}
      <div className="px-4">
        <FamilyTreeView />
      </div>

      {/* Member Aapsi Hisab Banner */}
      <div className="px-4">
        <Link
          href="/family/hisab"
          className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-gold/15 to-emerald-500/10 border-2 border-gold/40 hover:border-gold transition-all shadow-sm flex items-center justify-between group block"
        >
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gold tracking-wider bg-gold/10 px-2 py-0.5 rounded-full">
              New • Member Ledger
            </span>
            <h3 className="text-base font-bold font-serif text-ink group-hover:text-gold transition-colors">
              Aapsi Hisab-Kitab Hub
            </h3>
            <p className="text-xs text-ink-muted">
              Samaan lana, cash len-den, running balance &amp; 1-click WhatsApp receipt
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center text-gold font-bold text-lg group-hover:scale-110 transition-transform">
            ₹
          </div>
        </Link>
      </div>

      {/* Quick Links to Medical & AI Advisor */}
      <div className="px-4 grid grid-cols-2 gap-3">
        <Link
          href="/medical"
          className="p-4 rounded-xl bg-paper border border-paper-dim hover:border-coral/40 transition-all shadow-sm block"
        >
          <HeartPulse size={20} className="text-coral mb-1.5" />
          <h3 className="text-sm font-semibold text-ink">Medical Records</h3>
          <p className="text-[11px] text-ink-muted mt-0.5">Dawaiyan aur blood group</p>
        </Link>

        <Link
          href="/advisor"
          className="p-4 rounded-xl bg-paper border border-paper-dim hover:border-gold/40 transition-all shadow-sm block"
        >
          <Sparkles size={20} className="text-gold mb-1.5" />
          <h3 className="text-sm font-semibold text-ink">AI Advisor</h3>
          <p className="text-[11px] text-ink-muted mt-0.5">Bachat &amp; investment advice</p>
        </Link>
      </div>

      {/* Invite Code Box */}
      <div className="px-4">
        <div className="p-4 rounded-xl bg-paper-dim/80 border border-paper-dim flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider">Family Invite Code</span>
            <p className="font-mono font-bold text-sm text-ink">{family.invite_code}</p>
          </div>
          <button
            onClick={handleWhatsAppInvite}
            className="text-xs text-gold font-medium bg-gold/10 px-2.5 py-1 rounded-lg hover:bg-gold/20 transition-all"
          >
            Share Code
          </button>
        </div>
      </div>

      {/* ===== ADD MEMBER MODAL ===== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-paper rounded-t-3xl sm:rounded-2xl border border-paper-dim shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-paper-dim sticky top-0 bg-paper z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
                  <Users size={16} className="text-gold" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-ink">Naaya Sadasya Jodein</h2>
                  <p className="text-[11px] text-ink-muted">Parivar mein add karo</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full bg-paper-dim flex items-center justify-center">
                <X size={16} className="text-ink-muted" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1.5 uppercase tracking-wide">
                  Naam <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jaise: Ramesh Kumar"
                    className="w-full pl-9 pr-4 py-2.5 bg-paper-dim border border-paper-dim rounded-xl text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Relationship */}
              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1.5 uppercase tracking-wide">
                  Rishta <span className="text-red-400">*</span>
                </label>
                <select
                  value={relationship}
                  onChange={e => setRelationship(e.target.value)}
                  className="w-full px-3 py-2.5 bg-paper-dim border border-paper-dim rounded-xl text-sm text-ink focus:outline-none focus:border-gold"
                >
                  <option value="">— Rishta chunen —</option>
                  {RELATIONSHIPS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1.5 uppercase tracking-wide">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-4 py-2.5 bg-paper-dim border border-paper-dim rounded-xl text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1.5 uppercase tracking-wide">
                  Janam Tithi (Date of Birth)
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  className="w-full px-3 py-2.5 bg-paper-dim border border-paper-dim rounded-xl text-sm text-ink focus:outline-none focus:border-gold"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-2 uppercase tracking-wide">
                  Permission Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('member')}
                    className={`p-3 rounded-xl border text-left transition-all ${role === 'member' ? 'border-gold bg-gold/10' : 'border-paper-dim bg-paper-dim/50'}`}
                  >
                    <div className="text-sm font-bold text-ink">Sadasya</div>
                    <div className="text-[11px] text-ink-muted">Data dekh aur add kar sakta hai</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('owner')}
                    className={`p-3 rounded-xl border text-left transition-all ${role === 'owner' ? 'border-gold bg-gold/10' : 'border-paper-dim bg-paper-dim/50'}`}
                  >
                    <div className="text-sm font-bold text-ink">Admin</div>
                    <div className="text-[11px] text-ink-muted">Full access — manage kar sakta hai</div>
                  </button>
                </div>
              </div>

              {/* WhatsApp Invite Option */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
                <p className="text-xs font-semibold text-emerald-700 mb-2">📲 WhatsApp se bhi invite kar sakte ho</p>
                <button
                  type="button"
                  onClick={handleWhatsAppInvite}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-all"
                >
                  <Share2 size={14} />
                  WhatsApp Invite Bhejo (Code: {family.invite_code})
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-paper-dim rounded-xl text-sm font-semibold text-ink-muted hover:bg-paper-dim transition-all"
                >
                  Raho Do
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 bg-gold text-white rounded-xl text-sm font-bold hover:bg-gold/90 transition-all active:scale-95 disabled:opacity-50"
                >
                  {saving ? 'Save ho raha hai...' : '✓ Jod Do'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
