'use client';

import React, { useState } from 'react';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Avatar } from '@/components/ui/Avatar';
import { useFamilyStore } from '@/lib/store/familyStore';
import Link from 'next/link';
import {
  ChevronLeft, Plus, Phone, MessageCircle, Heart, Crown,
  Users, Calendar, Sparkles, X, UserCheck, Edit2, Trash2, AlertTriangle
} from 'lucide-react';
import { Member } from '@/types';

const RELATION_OPTIONS = [
  { value: 'Pita (Father)', label: 'Pita (Father)', tier: 'parents' },
  { value: 'Mata (Mother)', label: 'Mata (Mother)', tier: 'parents' },
  { value: 'Patni (Wife)', label: 'Patni (Wife)', tier: 'spouse' },
  { value: 'Pati (Husband)', label: 'Pati (Husband)', tier: 'spouse' },
  { value: 'Bhai (Brother)', label: 'Bhai (Brother)', tier: 'sibling' },
  { value: 'Behen (Sister)', label: 'Behen (Sister)', tier: 'sibling' },
  { value: 'Bhabhi (Sister-in-law)', label: 'Bhabhi (Sister-in-law)', tier: 'sibling_family' },
  { value: 'Jija (Brother-in-law)', label: 'Jija (Brother-in-law)', tier: 'sibling_family' },
  { value: 'Beta (Son)', label: 'Beta (Son)', tier: 'children' },
  { value: 'Beti (Daughter)', label: 'Beti (Daughter)', tier: 'children' },
  { value: 'Bahu (Daughter-in-law)', label: 'Bahu (Daughter-in-law)', tier: 'children' },
  { value: 'Damad (Son-in-law)', label: 'Damad (Son-in-law)', tier: 'children' },
  { value: 'Bhatija (Nephew)', label: 'Bhatija (Nephew)', tier: 'sibling_family' },
  { value: 'Bhatiji (Niece)', label: 'Bhatiji (Niece)', tier: 'sibling_family' },
  { value: 'Pota (Grandson)', label: 'Pota (Grandson)', tier: 'grandkids' },
  { value: 'Poti (Granddaughter)', label: 'Poti (Granddaughter)', tier: 'grandkids' },
  { value: 'Dada (Grandfather)', label: 'Dada (Grandfather)', tier: 'grandparents' },
  { value: 'Dadi (Grandmother)', label: 'Dadi (Grandmother)', tier: 'grandparents' },
  { value: 'Nana (Maternal Grandfather)', label: 'Nana (Maternal Grandfather)', tier: 'grandparents' },
  { value: 'Nani (Maternal Grandmother)', label: 'Nani (Maternal Grandmother)', tier: 'grandparents' },
  { value: 'Anya (Other)', label: 'Anya (Other)', tier: 'other' },
];

export default function FamilyTreePage() {
  const { members, addMember, updateMember, deleteMember, family } = useFamilyStore();

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [defaultRelation, setDefaultRelation] = useState('');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  // Edit state
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRelation, setEditRelation] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editRole, setEditRole] = useState<'member' | 'owner'>('member');

  // Form state
  const [formName, setFormName] = useState('');
  const [formRelation, setFormRelation] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDob, setFormDob] = useState('');
  const [formRole, setFormRole] = useState<'member' | 'owner'>('member');

  const handleOpenEdit = (m: Member) => {
    setEditingMember(m);
    setEditName(m.name || '');
    setEditPhone(m.phone || '');
    setEditRelation(m.relationship || '');
    setEditDob(m.dob || '');
    setEditRole(m.role || 'member');
  };

  const handleSaveEdit = () => {
    if (!editingMember) return;
    if (!editName.trim()) return alert('Naam likhna zaroori hai');
    if (!editRelation) return alert('Rishta chunna zaroori hai');

    updateMember(editingMember.id, {
      name: editName.trim(),
      phone: editPhone.trim() || undefined,
      relationship: editRelation,
      dob: editDob || undefined,
      role: editRole,
      initials: editName.trim().charAt(0).toUpperCase(),
    });

    setEditingMember(null);
  };

  const handleConfirmDelete = () => {
    if (!memberToDelete) return;
    if (members.length <= 1) {
      alert('Parivar me kam se kam ek sadasya hona anivarya hai.');
      setMemberToDelete(null);
      return;
    }
    deleteMember(memberToDelete.id);
    setMemberToDelete(null);
  };

  const openAddForRelation = (rel: string) => {
    setDefaultRelation(rel);
    setFormRelation(rel);
    setFormName('');
    setFormPhone('');
    setFormDob('');
    setShowAddModal(true);
  };

  const handleSaveMember = () => {
    if (!formName.trim()) return alert('Kripya sadasya ka naam likhein');
    if (!formRelation) return alert('Rishta chunna zaroori hai');

    addMember({
      name: formName.trim(),
      phone: formPhone.trim() || undefined,
      relationship: formRelation,
      dob: formDob || undefined,
      role: formRole,
      color: ['#B98B2A', '#34D399', '#60A5FA', '#F472B6', '#A78BFA', '#FB923C', '#EAB308'][members.length % 7],
      initials: formName.trim().charAt(0).toUpperCase(),
      permissions: {
        can_view_investments: true,
        can_view_bills: true,
        can_view_vault: false,
        can_view_medical: true,
        can_view_staff: false,
        can_view_cases: false,
        is_admin: formRole === 'owner',
      }
    });

    setShowAddModal(false);
  };

  // --- TREE HIERARCHY CLASSIFICATION ---
  // 1. Identify Mukhiya (Main Member / Jisne Banaya)
  const mukhiya = members.find(m =>
    m.role === 'owner' ||
    (m.relationship && (
      m.relationship.toLowerCase().includes('mukhiya') ||
      m.relationship.toLowerCase().includes('self') ||
      m.relationship.toLowerCase().includes('aap')
    ))
  ) || members[0];

  const normalizeRel = (r?: string) => (r || '').toLowerCase();

  // Grandparents
  const grandparents = members.filter(m => {
    const rel = normalizeRel(m.relationship);
    return rel.includes('dada') || rel.includes('dadi') || rel.includes('nana') || rel.includes('nani');
  });

  // Parents (Maa-Baap)
  const parents = members.filter(m => {
    if (m.id === mukhiya?.id) return false;
    const rel = normalizeRel(m.relationship);
    return (
      rel.includes('pita') ||
      rel.includes('father') ||
      rel.includes('mata') ||
      rel.includes('mother') ||
      rel.includes('maa') ||
      rel.includes('baap')
    );
  });

  const pita = parents.find(m => {
    const r = normalizeRel(m.relationship);
    return r.includes('pita') || r.includes('father') || r.includes('baap');
  });

  const mata = parents.find(m => {
    const r = normalizeRel(m.relationship);
    return r.includes('mata') || r.includes('mother') || r.includes('maa');
  });

  const otherParents = parents.filter(m => m.id !== pita?.id && m.id !== mata?.id);

  // Spouse of Mukhiya
  const spouse = members.find(m => {
    if (m.id === mukhiya?.id) return false;
    const r = normalizeRel(m.relationship);
    return r.includes('patni') || r.includes('wife') || r.includes('pati') || r.includes('husband');
  });

  // Siblings (Bhai & Behen)
  const siblings = members.filter(m => {
    if (m.id === mukhiya?.id) return false;
    const r = normalizeRel(m.relationship);
    return r.includes('bhai') || r.includes('brother') || r.includes('behen') || r.includes('sister');
  });

  // Sibling's Family (Bhabhi, Jija, Bhatija, Bhatiji)
  const siblingFamily = members.filter(m => {
    if (m.id === mukhiya?.id) return false;
    const r = normalizeRel(m.relationship);
    return (
      r.includes('bhabhi') ||
      r.includes('jija') ||
      r.includes('bhatija') ||
      r.includes('bhatiji') ||
      r.includes('bhanja') ||
      r.includes('bhanji')
    );
  });

  // Children (Beta, Beti, Bahu, Damad)
  const children = members.filter(m => {
    if (m.id === mukhiya?.id) return false;
    const r = normalizeRel(m.relationship);
    return (
      r.includes('beta') ||
      r.includes('son') ||
      r.includes('beti') ||
      r.includes('daughter') ||
      r.includes('bahu') ||
      r.includes('damad')
    );
  });

  // Grandchildren (Pota, Poti, Naati, Naatin)
  const grandchildren = members.filter(m => {
    if (m.id === mukhiya?.id) return false;
    const r = normalizeRel(m.relationship);
    return r.includes('pota') || r.includes('poti') || r.includes('naati') || r.includes('naatin');
  });

  // Classified Member IDs to catch any remaining
  const classifiedIds = new Set([
    mukhiya?.id,
    ...grandparents.map(m => m.id),
    ...parents.map(m => m.id),
    spouse?.id,
    ...siblings.map(m => m.id),
    ...siblingFamily.map(m => m.id),
    ...children.map(m => m.id),
    ...grandchildren.map(m => m.id),
  ].filter(Boolean));

  const otherMembers = members.filter(m => !classifiedIds.has(m.id));

  // --- MEMBER TREE CARD COMPONENT ---
  const TreeMemberCard = ({
    member,
    relationLabel,
    badgeColor = 'bg-gold/15 text-gold-dark border-gold/30',
    isPrimary = false,
  }: {
    member: Member;
    relationLabel?: string;
    badgeColor?: string;
    isPrimary?: boolean;
  }) => {
    const relation = relationLabel || member.relationship || 'Sadasya';
    return (
      <div
        onClick={() => setSelectedMember(member)}
        className={`relative flex flex-col items-center p-3 rounded-2xl border transition-all cursor-pointer hover:shadow-lg active:scale-95 group text-center min-w-[125px] max-w-[155px] ${
          isPrimary
            ? 'bg-gradient-to-b from-paper to-gold/10 border-gold shadow-md ring-2 ring-gold/20'
            : 'bg-paper border-paper-dim hover:border-gold/40 shadow-xs'
        }`}
      >
        {isPrimary && (
          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 uppercase tracking-wider">
            <Crown size={11} /> Mukhiya
          </span>
        )}

        <div className="relative mt-1">
          <Avatar m={member} size={48} className={isPrimary ? 'ring-2 ring-gold' : ''} />
          {member.role === 'owner' && !isPrimary && (
            <span className="absolute -bottom-1 -right-1 text-xs">👑</span>
          )}
        </div>

        <h4 className="text-xs font-bold text-ink mt-2 truncate w-full group-hover:text-gold transition-colors">
          {member.name}
        </h4>

        {/* RELATIONSHIP BADGE (Bold & Visible) */}
        <div className={`mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${badgeColor} max-w-full truncate`}>
          {relation}
        </div>

        {member.phone && (
          <p className="text-[10px] text-ink-muted/80 mt-1 truncate w-full flex items-center justify-center gap-0.5">
            <Phone size={9} /> {member.phone}
          </p>
        )}

        {member.dob && (
          <p className="text-[9px] text-ink-muted/70 mt-0.5">
            DOB: {member.dob}
          </p>
        )}
      </div>
    );
  };

  // Add Member Dashed Placeholder
  const EmptySlotCard = ({
    label,
    suggestedRelation,
  }: {
    label: string;
    suggestedRelation: string;
  }) => (
    <button
      type="button"
      onClick={() => openAddForRelation(suggestedRelation)}
      className="flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-dashed border-paper-dim hover:border-gold/60 bg-paper/40 hover:bg-gold/5 transition-all text-center min-w-[125px] max-w-[155px] group"
    >
      <div className="w-10 h-10 rounded-full bg-paper-dim group-hover:bg-gold/20 flex items-center justify-center text-ink-muted group-hover:text-gold transition-colors">
        <Plus size={18} />
      </div>
      <span className="text-xs font-semibold text-ink-muted group-hover:text-gold mt-1.5">
        {label}
      </span>
      <span className="text-[10px] text-ink-muted/60 mt-0.5">
        + Add Karein
      </span>
    </button>
  );

  return (
    <div className="space-y-4 pb-12">
      {/* Top Navigation */}
      <div className="px-4 pt-3 flex items-center justify-between">
        <Link href="/family" className="text-xs text-ink-muted hover:text-ink flex items-center gap-1 font-semibold">
          <ChevronLeft size={16} /> Parivar List
        </Link>
        <button
          onClick={() => openAddForRelation('Bhai (Brother)')}
          className="flex items-center gap-1.5 bg-gold text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs hover:bg-gold/90 transition-all active:scale-95"
        >
          <Plus size={14} /> Sadasya Jodein
        </button>
      </div>

      <ScreenHeader
        title="Parivar Tree (Vansh Rekha)"
        subtitle={`${family.name || 'Parivar'} • Pidhi-dar-pidhi rishton ka record`}
      />

      {/* Guide Banner */}
      <div className="px-4">
        <div className="p-3 bg-paper-dim/60 border border-paper-dim rounded-xl flex items-center gap-2.5 text-xs text-ink-muted">
          <Sparkles size={16} className="text-gold shrink-0" />
          <p>
            Tree me <strong>Maa-Baap</strong> sabse upar, phir <strong>Mukhiya &amp; Bhai-Behen</strong> unki family ke sath, aur neeche <strong>Agli Peedhi (Bachhe)</strong> rishte ke sath darshaye gaye hain.
          </p>
        </div>
      </div>

      {/* MAIN TREE CANVAS */}
      <div className="px-2 sm:px-4">
        <div className="p-4 sm:p-6 bg-paper rounded-3xl border border-paper-dim shadow-sm overflow-x-auto min-h-[500px]">
          <div className="min-w-[550px] flex flex-col items-center space-y-7">

            {/* ========================================================= */}
            {/* TIER 0: GRANDPARENTS (Dada-Dadi / Nana-Nani if present)   */}
            {/* ========================================================= */}
            {grandparents.length > 0 && (
              <div className="flex flex-col items-center w-full">
                <div className="text-[11px] uppercase font-bold tracking-wider text-ink-muted mb-2 px-3 py-0.5 bg-paper-dim rounded-full">
                  👴👵 Peedhi: Dada-Dadi / Buzurg
                </div>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  {grandparents.map(m => (
                    <TreeMemberCard
                      key={m.id}
                      member={m}
                      badgeColor="bg-amber-100 text-amber-900 border-amber-300"
                    />
                  ))}
                </div>
                <div className="w-0.5 h-6 bg-paper-dim mt-2" />
              </div>
            )}

            {/* ========================================================= */}
            {/* TIER 1: PARENTS (Maa-Baap / Mata-Pita)                   */}
            {/* ========================================================= */}
            <div className="flex flex-col items-center w-full">
              <div className="text-[11px] uppercase font-bold tracking-wider text-emerald-800 mb-2 px-3 py-0.5 bg-emerald-50 rounded-full border border-emerald-200">
                🌱 Peedhi 1: Mata-Pita (Maa-Baap)
              </div>

              <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
                {/* Pita */}
                {pita ? (
                  <TreeMemberCard
                    member={pita}
                    relationLabel={pita.relationship || 'Pita (Father)'}
                    badgeColor="bg-blue-50 text-blue-800 border-blue-200"
                  />
                ) : (
                  <EmptySlotCard label="Pita (Father)" suggestedRelation="Pita (Father)" />
                )}

                {/* Marriage Heart */}
                <div className="flex flex-col items-center px-1">
                  <div className="w-7 h-7 rounded-full bg-rose-50 border border-rose-200 text-rose-500 flex items-center justify-center text-xs shadow-xs">
                    <Heart size={14} className="fill-rose-500" />
                  </div>
                  <span className="text-[9px] text-ink-muted mt-0.5 font-medium">Vivah</span>
                </div>

                {/* Mata */}
                {mata ? (
                  <TreeMemberCard
                    member={mata}
                    relationLabel={mata.relationship || 'Mata (Mother)'}
                    badgeColor="bg-rose-50 text-rose-800 border-rose-200"
                  />
                ) : (
                  <EmptySlotCard label="Mata (Mother)" suggestedRelation="Mata (Mother)" />
                )}

                {/* Other Parents / Chacha-Chachi */}
                {otherParents.map(m => (
                  <TreeMemberCard
                    key={m.id}
                    member={m}
                    badgeColor="bg-emerald-50 text-emerald-800 border-emerald-200"
                  />
                ))}
              </div>

              {/* Connecting Pipe down to Generation 2 */}
              <div className="flex flex-col items-center my-1">
                <div className="w-0.5 h-7 bg-gold/50" />
                <div className="w-2 h-2 rounded-full bg-gold" />
              </div>
            </div>

            {/* ========================================================= */}
            {/* TIER 2: MAIN MEMBER (MUKHIYA), SPOUSE & SIBLINGS (FAMILY) */}
            {/* ========================================================= */}
            <div className="flex flex-col items-center w-full">
              <div className="text-[11px] uppercase font-bold tracking-wider text-gold-dark mb-2 px-3 py-0.5 bg-gold/15 rounded-full border border-gold/30">
                👑 Peedhi 2: Mukhiya, Patni/Pati &amp; Bhai-Behen (Unki Family)
              </div>

              {/* Horizontal Branch Line connecting the generation */}
              <div className="w-full flex items-center justify-center">
                <div className="h-0.5 bg-gold/30 flex-1 max-w-[420px]" />
              </div>

              <div className="flex items-start justify-center gap-4 sm:gap-6 mt-2 flex-wrap">

                {/* Siblings (Bhai / Behen) - Left side */}
                {siblings.map(sib => (
                  <div key={sib.id} className="flex flex-col items-center">
                    <div className="w-0.5 h-3 bg-gold/40 mb-1" />
                    <TreeMemberCard
                      member={sib}
                      relationLabel={sib.relationship || 'Bhai / Behen'}
                      badgeColor="bg-indigo-50 text-indigo-800 border-indigo-200"
                    />
                  </div>
                ))}

                {/* Center Group: Mukhiya + Spouse */}
                <div className="flex flex-col items-center p-3 bg-paper-dim/40 rounded-3xl border border-paper-dim">
                  <div className="w-0.5 h-3 bg-gold/40 mb-1" />

                  <div className="flex items-center gap-3">
                    {/* Mukhiya Card */}
                    {mukhiya ? (
                      <TreeMemberCard
                        member={mukhiya}
                        relationLabel={mukhiya.relationship || 'Mukhiya (Self)'}
                        badgeColor="bg-amber-100 text-amber-900 border-amber-300 font-extrabold"
                        isPrimary
                      />
                    ) : (
                      <EmptySlotCard label="Mukhiya (Self)" suggestedRelation="Self / Mukhiya" />
                    )}

                    {/* Marriage connector to Spouse */}
                    <div className="flex flex-col items-center px-1">
                      <div className="w-7 h-7 rounded-full bg-rose-50 border border-rose-200 text-rose-500 flex items-center justify-center text-xs shadow-xs">
                        <Heart size={14} className="fill-rose-500" />
                      </div>
                      <span className="text-[9px] text-ink-muted mt-0.5 font-medium">Jodi</span>
                    </div>

                    {/* Spouse Card */}
                    {spouse ? (
                      <TreeMemberCard
                        member={spouse}
                        relationLabel={spouse.relationship || 'Patni (Wife)'}
                        badgeColor="bg-pink-50 text-pink-800 border-pink-200"
                      />
                    ) : (
                      <EmptySlotCard label="Patni (Wife)" suggestedRelation="Patni (Wife)" />
                    )}
                  </div>
                </div>

                {/* Sibling's Family (Bhabhi, Jija, Bhatija/Bhatiji) */}
                {siblingFamily.map(fam => (
                  <div key={fam.id} className="flex flex-col items-center">
                    <div className="w-0.5 h-3 bg-gold/40 mb-1" />
                    <TreeMemberCard
                      member={fam}
                      relationLabel={fam.relationship || 'Parivar'}
                      badgeColor="bg-purple-50 text-purple-800 border-purple-200"
                    />
                  </div>
                ))}

                {/* Quick Add Bhai/Behen button if user wants to add */}
                {siblings.length === 0 && (
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-3 bg-gold/40 mb-1" />
                    <EmptySlotCard label="Bhai / Behen" suggestedRelation="Bhai (Brother)" />
                  </div>
                )}
              </div>

              {/* Connecting Pipe down to Children */}
              <div className="flex flex-col items-center my-1">
                <div className="w-0.5 h-7 bg-gold/50" />
                <div className="w-2 h-2 rounded-full bg-gold" />
              </div>
            </div>

            {/* ========================================================= */}
            {/* TIER 3: CHILDREN (Agli Peedhi - Beta, Beti, Bahu, Damad)  */}
            {/* ========================================================= */}
            <div className="flex flex-col items-center w-full">
              <div className="text-[11px] uppercase font-bold tracking-wider text-sky-800 mb-2 px-3 py-0.5 bg-sky-50 rounded-full border border-sky-200">
                👶 Peedhi 3: Agli Peedhi (Beta, Beti, Bahu, Damad)
              </div>

              {/* Horizontal Branch Line connecting the children */}
              {children.length > 1 && (
                <div className="w-full flex items-center justify-center">
                  <div className="h-0.5 bg-gold/30 flex-1 max-w-[360px]" />
                </div>
              )}

              <div className="flex items-start justify-center gap-4 sm:gap-6 mt-2 flex-wrap">
                {children.length > 0 ? (
                  children.map(child => (
                    <div key={child.id} className="flex flex-col items-center">
                      <div className="w-0.5 h-3 bg-gold/40 mb-1" />
                      <TreeMemberCard
                        member={child}
                        relationLabel={child.relationship || 'Beta / Beti'}
                        badgeColor="bg-cyan-50 text-cyan-800 border-cyan-200"
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-3 bg-gold/40 mb-1" />
                    <EmptySlotCard label="Beta / Beti" suggestedRelation="Beta (Son)" />
                  </div>
                )}

                {/* Additional child shortcut */}
                {children.length > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-3 bg-gold/40 mb-1" />
                    <EmptySlotCard label="+ Bachha Jodein" suggestedRelation="Beta (Son)" />
                  </div>
                )}
              </div>
            </div>

            {/* ========================================================= */}
            {/* TIER 4: GRANDCHILDREN (Pota / Poti / Naati) if present   */}
            {/* ========================================================= */}
            {grandchildren.length > 0 && (
              <div className="flex flex-col items-center w-full">
                <div className="w-0.5 h-6 bg-gold/40 my-1" />
                <div className="text-[11px] uppercase font-bold tracking-wider text-purple-800 mb-2 px-3 py-0.5 bg-purple-50 rounded-full border border-purple-200">
                  🍼 Peedhi 4: Pota / Poti (Poti-Pota)
                </div>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  {grandchildren.map(m => (
                    <TreeMemberCard
                      key={m.id}
                      member={m}
                      badgeColor="bg-violet-50 text-violet-800 border-violet-200"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other relatives if any */}
            {otherMembers.length > 0 && (
              <div className="w-full pt-4 border-t border-paper-dim flex flex-col items-center">
                <div className="text-[11px] uppercase font-bold tracking-wider text-ink-muted mb-2 px-3 py-0.5 bg-paper-dim rounded-full">
                  🤝 Anya Parivar Jan
                </div>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  {otherMembers.map(m => (
                    <TreeMemberCard
                      key={m.id}
                      member={m}
                      badgeColor="bg-slate-100 text-slate-800 border-slate-300"
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MEMBER DETAILS MODAL                                      */}
      {/* ========================================================= */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-paper rounded-t-3xl sm:rounded-2xl border border-paper-dim shadow-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar m={selectedMember} size={48} />
                <div>
                  <h3 className="text-base font-bold text-ink">{selectedMember.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs font-bold text-gold-dark bg-gold/15 px-2 py-0.5 rounded-full border border-gold/30">
                      {selectedMember.relationship || 'Family Member'}
                    </span>
                    {selectedMember.role === 'owner' && (
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-semibold">
                        Admin / Mukhiya
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="w-8 h-8 rounded-full bg-paper-dim flex items-center justify-center text-ink-muted hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-3 bg-paper-dim/60 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between text-ink-muted">
                <span>Rishta:</span>
                <strong className="text-ink">{selectedMember.relationship || 'N/A'}</strong>
              </div>
              {selectedMember.phone && (
                <div className="flex items-center justify-between text-ink-muted">
                  <span>Mobile:</span>
                  <strong className="text-ink">{selectedMember.phone}</strong>
                </div>
              )}
              {selectedMember.dob && (
                <div className="flex items-center justify-between text-ink-muted">
                  <span>Janam Tithi (DOB):</span>
                  <strong className="text-ink">{selectedMember.dob}</strong>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {selectedMember.phone ? (
                <>
                  <a
                    href={`tel:${selectedMember.phone}`}
                    className="flex items-center justify-center gap-1.5 py-2.5 bg-paper-dim hover:bg-paper-dim/80 text-ink rounded-xl text-xs font-semibold border border-paper-dim"
                  >
                    <Phone size={14} className="text-gold" /> Call Karein
                  </a>
                  <a
                    href={`https://wa.me/${selectedMember.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200"
                  >
                    <MessageCircle size={14} className="text-emerald-600" /> WhatsApp
                  </a>
                </>
              ) : null}

              <Link
                href="/family/hisab"
                className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 bg-gold text-white rounded-xl text-xs font-bold hover:bg-gold/90 transition-all shadow-xs"
              >
                ₹ Aapsi Hisab-Kitab Kholein
              </Link>

              {/* Edit & Delete Member Options */}
              <div className="col-span-2 flex items-center gap-2 pt-2 border-t border-paper-dim">
                <button
                  type="button"
                  onClick={() => {
                    handleOpenEdit(selectedMember);
                    setSelectedMember(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-xs font-bold border border-blue-200 transition-all"
                >
                  <Edit2 size={13} /> Edit Karein
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMemberToDelete(selectedMember);
                    setSelectedMember(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-bold border border-rose-200 transition-all"
                >
                  <Trash2 size={13} /> Hatayein
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ADD MEMBER MODAL DIRECTLY FROM TREE                       */}
      {/* ========================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-paper rounded-t-3xl sm:rounded-2xl border border-paper-dim shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center text-gold">
                  <Users size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">Tree me Sadasya Jodein</h3>
                  <p className="text-[11px] text-ink-muted">Rishta aur details bharein</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-paper-dim flex items-center justify-center text-ink-muted hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-ink-muted mb-1">
                  Naam <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="Jaise: Radhey Shyam"
                  className="w-full px-3 py-2 bg-paper-dim border border-paper-dim rounded-xl text-sm text-ink focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block font-semibold text-ink-muted mb-1">
                  Rishta (Mukhiya ke sath) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formRelation}
                  onChange={e => setFormRelation(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim border border-paper-dim rounded-xl text-sm text-ink focus:outline-none focus:border-gold"
                >
                  <option value="">— Rishta Chunen —</option>
                  {RELATION_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-ink-muted mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={formPhone}
                  onChange={e => setFormPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 bg-paper-dim border border-paper-dim rounded-xl text-sm text-ink focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block font-semibold text-ink-muted mb-1">
                  Janam Tithi (DOB)
                </label>
                <input
                  type="date"
                  value={formDob}
                  onChange={e => setFormDob(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim border border-paper-dim rounded-xl text-sm text-ink focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-paper-dim rounded-xl text-sm font-semibold text-ink-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveMember}
                  className="flex-1 py-2.5 bg-gold text-white rounded-xl text-sm font-bold shadow-xs hover:bg-gold/90"
                >
                  ✓ Tree Me Jodein
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ========================================================= */}
      {/* EDIT MEMBER MODAL                                         */}
      {/* ========================================================= */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-paper rounded-t-3xl sm:rounded-2xl border border-paper-dim shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Edit2 size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">Sadasya Edit Karein</h3>
                  <p className="text-[11px] text-ink-muted">{editingMember.name} ki details badlein</p>
                </div>
              </div>
              <button
                onClick={() => setEditingMember(null)}
                className="w-8 h-8 rounded-full bg-paper-dim flex items-center justify-center text-ink-muted hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-ink-muted mb-1">
                  Naam <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim border border-paper-dim rounded-xl text-sm text-ink focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block font-semibold text-ink-muted mb-1">
                  Rishta (Mukhiya ke sath) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={editRelation}
                  onChange={e => setEditRelation(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim border border-paper-dim rounded-xl text-sm text-ink focus:outline-none focus:border-gold"
                >
                  <option value="">— Rishta Chunen —</option>
                  {RELATION_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-ink-muted mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim border border-paper-dim rounded-xl text-sm text-ink focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block font-semibold text-ink-muted mb-1">
                  Janam Tithi (DOB)
                </label>
                <input
                  type="date"
                  value={editDob}
                  onChange={e => setEditDob(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim border border-paper-dim rounded-xl text-sm text-ink focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="flex-1 py-2.5 border border-paper-dim rounded-xl text-sm font-semibold text-ink-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-xs hover:bg-blue-700 transition-all"
                >
                  ✓ Changes Save Karein
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DELETE CONFIRMATION MODAL                                 */}
      {/* ========================================================= */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-paper rounded-2xl border border-paper-dim shadow-2xl p-5 space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-ink">Sadasya Ko Hatayein?</h3>
              <p className="text-xs text-ink-muted">
                Kya aap sach me <strong>{memberToDelete.name}</strong> ({memberToDelete.relationship || 'Sadasya'}) ko parivar tree se hatana chahte hain?
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="flex-1 py-2.5 border border-paper-dim rounded-xl text-xs font-semibold text-ink-muted hover:bg-paper-dim"
              >
                Raho Do
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1"
              >
                <Trash2 size={13} /> Haan, Hatayein
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
