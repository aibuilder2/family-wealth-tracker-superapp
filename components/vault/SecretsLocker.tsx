'use client';

import React, { useState, useEffect } from 'react';
import { VaultSecretItem, VaultSecretType } from '@/types';
import { useFamilyStore } from '@/lib/store/familyStore';
import { 
  Key, Lock, Unlock, Copy, Check, Eye, EyeOff, Code2, 
  Terminal, ExternalLink, Trash2, Edit2, Plus, X, Search,
  Shield, Server, Globe, FileCode, CheckCircle2, User, Users,
  Sparkles, RefreshCw
} from 'lucide-react';

const INITIAL_DEMO_SECRETS: VaultSecretItem[] = [
  {
    id: 'sec-demo-1',
    family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
    member_name: 'Ankush kesharwani',
    secret_type: 'env_file',
    title: 'Family Wealth SuperApp (Next.js)',
    environment: 'production',
    env_content: `# Production Environment Variables
NEXT_PUBLIC_APP_URL=https://kesharwani-family-wealth.app
DATABASE_URL=postgresql://postgres.kesharwani:[SECURE_PASS]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
NEXT_PUBLIC_SUPABASE_URL=https://xfyqerzzxxjjww.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9...
ENCRYPTION_SECRET_KEY=9f8e7d6c5b4a31201928374655
NODE_ENV=production`,
    url: 'https://github.com/aibuilder2/family-wealth-tracker-superapp',
    notes: 'मुख्य फ़ैमिली वेल्थ सुपरऐप का प्रोडक्शन डेटाबेस व API क्रेडेंशियल्स',
    created_at: '2026-03-10',
    updated_at: '2026-03-25',
  },
  {
    id: 'sec-demo-2',
    family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
    member_name: 'Ankush kesharwani',
    secret_type: 'password',
    title: 'HDFC Corporate Netbanking',
    username_or_email: 'ankush_kesh94',
    password: 'Kesh@Bank#2026!Pro',
    url: 'https://netbanking.hdfcbank.com',
    notes: 'मुख्य बिजनेस करेंट अकाउंट व टैक्स चालान लॉगिन',
    created_at: '2026-02-15',
    updated_at: '2026-03-18',
  },
  {
    id: 'sec-demo-3',
    family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
    member_name: 'Ganesh Prasad kesharwani',
    secret_type: 'pin_secret',
    title: 'घर की मुख्य अलमारी व डिजिटल लॉकर पिन',
    password: '7429',
    notes: 'मास्टर बेडरूम अलमारी के लॉकर का 4-अंकीय आपातकालीन पिन',
    created_at: '2026-01-20',
    updated_at: '2026-01-20',
  }
];

export function SecretsLocker() {
  const { members } = useFamilyStore();

  const [secrets, setSecrets] = useState<VaultSecretItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_vault_secrets_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return INITIAL_DEMO_SECRETS;
  });

  // UI Filters
  const [typeFilter, setTypeFilter] = useState<'ALL' | VaultSecretType>('ALL');
  const [memberFilter, setMemberFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Visibility & Copy States
  const [revealedIds, setRevealedIds] = useState<{ [id: string]: boolean }>({});
  const [expandedEnvIds, setExpandedEnvIds] = useState<{ [id: string]: boolean }>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [secretType, setSecretType] = useState<VaultSecretType>('env_file');
  const [title, setTitle] = useState('');
  const [environment, setEnvironment] = useState<'production' | 'staging' | 'local' | 'other'>('production');
  const [envContent, setEnvContent] = useState('');
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('COMMON');
  const [notes, setNotes] = useState('');
  const [showFormPassword, setShowFormPassword] = useState(false);

  // Save to localStorage whenever secrets change
  const saveSecrets = (updated: VaultSecretItem[]) => {
    setSecrets(updated);
    try {
      localStorage.setItem('fwa_vault_secrets_v1', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleCopy = (text: string, keyIdentifier: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(keyIdentifier);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpandEnv = (id: string) => {
    setExpandedEnvIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setSecretType('env_file');
    setTitle('');
    setEnvironment('production');
    setEnvContent('');
    setUsernameOrEmail('');
    setPassword('');
    setUrl('');
    setSelectedMemberId('COMMON');
    setNotes('');
    setShowFormPassword(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: VaultSecretItem) => {
    setEditingId(item.id);
    setSecretType(item.secret_type);
    setTitle(item.title);
    setEnvironment(item.environment || 'production');
    setEnvContent(item.env_content || '');
    setUsernameOrEmail(item.username_or_email || '');
    setPassword(item.password || '');
    setUrl(item.url || '');
    setSelectedMemberId(item.member_id || 'COMMON');
    setNotes(item.notes || '');
    setShowFormPassword(false);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('क्या आप इस सीक्रेट / .env को हटाना चाहते हैं?')) {
      const updated = secrets.filter(s => s.id !== id);
      saveSecrets(updated);
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*()_+';
    let res = '';
    for (let i = 0; i < 16; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
    setShowFormPassword(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const memberObj = members.find(m => m.id === selectedMemberId);
    const memberName = selectedMemberId === 'COMMON' ? 'कॉमन (सभी के लिए)' : (memberObj?.name || 'सदस्य');

    if (editingId) {
      const updated = secrets.map(s => {
        if (s.id !== editingId) return s;
        return {
          ...s,
          secret_type: secretType,
          title: title.trim(),
          environment: secretType === 'env_file' ? environment : undefined,
          env_content: secretType === 'env_file' ? envContent : undefined,
          username_or_email: secretType === 'password' ? usernameOrEmail.trim() : undefined,
          password: (secretType === 'password' || secretType === 'pin_secret') ? password : undefined,
          url: url.trim() || undefined,
          member_id: selectedMemberId === 'COMMON' ? undefined : selectedMemberId,
          member_name: memberName,
          notes: notes.trim() || undefined,
          updated_at: new Date().toISOString().split('T')[0],
        };
      });
      saveSecrets(updated);
    } else {
      const newSecret: VaultSecretItem = {
        id: 'sec-' + Date.now(),
        family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
        secret_type: secretType,
        title: title.trim(),
        environment: secretType === 'env_file' ? environment : undefined,
        env_content: secretType === 'env_file' ? envContent : undefined,
        username_or_email: secretType === 'password' ? usernameOrEmail.trim() : undefined,
        password: (secretType === 'password' || secretType === 'pin_secret') ? password : undefined,
        url: url.trim() || undefined,
        member_id: selectedMemberId === 'COMMON' ? undefined : selectedMemberId,
        member_name: memberName,
        notes: notes.trim() || undefined,
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0],
      };
      saveSecrets([newSecret, ...secrets]);
    }

    setIsModalOpen(false);
  };

  // Filtered Items
  const filteredSecrets = secrets.filter(item => {
    if (typeFilter !== 'ALL' && item.secret_type !== typeFilter) return false;
    if (memberFilter !== 'ALL') {
      if (memberFilter === 'COMMON') {
        if (item.member_id) return false;
      } else if (item.member_id !== memberFilter) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchUser = (item.username_or_email || '').toLowerCase().includes(q);
      const matchNotes = (item.notes || '').toLowerCase().includes(q);
      const matchEnv = (item.env_content || '').toLowerCase().includes(q);
      if (!matchTitle && !matchUser && !matchNotes && !matchEnv) return false;
    }
    return true;
  });

  const totalEnvFiles = secrets.filter(s => s.secret_type === 'env_file').length;
  const totalPasswords = secrets.filter(s => s.secret_type === 'password').length;
  const totalPins = secrets.filter(s => s.secret_type === 'pin_secret').length;

  return (
    <div className="space-y-4">
      {/* Top Banner & Quick Add */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-ink flex items-center gap-1.5">
            <Lock size={16} className="text-gold" />
            पासवर्ड व प्रोजेक्ट .env लॉकर
          </h2>
          <p className="text-[11px] text-ink-muted">
            सभी प्रोजेक्ट क्रेडेंशियल्स, पासवर्ड व सीक्रेट कोड्स सुरक्षित व 1-क्लिक कॉपी
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="py-2 px-3 rounded-xl bg-gold hover:bg-gold-soft text-navy font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Plus size={14} />
          <span>+ नया सीक्रेट</span>
        </button>
      </div>

      {/* Mini Stats Bar */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2.5 rounded-xl bg-paper border border-paper-dim shadow-2xs">
          <p className="text-[10px] text-ink-muted font-bold">कुल सीक्रेट्स</p>
          <p className="text-base font-black text-ink font-mono mt-0.5">{secrets.length}</p>
        </div>
        <div className="p-2.5 rounded-xl bg-paper border border-paper-dim shadow-2xs">
          <p className="text-[10px] text-emerald-600 font-bold">.env प्रोजेक्ट्स</p>
          <p className="text-base font-black text-emerald-600 font-mono mt-0.5">{totalEnvFiles}</p>
        </div>
        <div className="p-2.5 rounded-xl bg-paper border border-paper-dim shadow-2xs">
          <p className="text-[10px] text-blue-600 font-bold">पासवर्ड्स / लॉगिन</p>
          <p className="text-base font-black text-blue-600 font-mono mt-0.5">{totalPasswords + totalPins}</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            placeholder="प्रोजेक्ट का नाम, ईमेल, या वेरिएबल खोजें..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-paper border border-paper-dim rounded-xl text-xs font-medium text-ink focus:border-gold outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              typeFilter === 'ALL'
                ? 'bg-navy text-gold shadow-xs'
                : 'bg-paper text-ink-muted border border-paper-dim hover:bg-paper-dim'
            }`}
          >
            सभी ({secrets.length})
          </button>
          <button
            onClick={() => setTypeFilter('env_file')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              typeFilter === 'env_file'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-paper text-ink-muted border border-paper-dim hover:bg-paper-dim'
            }`}
          >
            <Code2 size={13} />
            <span>.env फ़ाइलें ({totalEnvFiles})</span>
          </button>
          <button
            onClick={() => setTypeFilter('password')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              typeFilter === 'password'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-paper text-ink-muted border border-paper-dim hover:bg-paper-dim'
            }`}
          >
            <Key size={13} />
            <span>पासवर्ड / लॉगिन ({totalPasswords})</span>
          </button>
          <button
            onClick={() => setTypeFilter('pin_secret')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              typeFilter === 'pin_secret'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-paper text-ink-muted border border-paper-dim hover:bg-paper-dim'
            }`}
          >
            <Shield size={13} />
            <span>पिन / सीक्रेट्स ({totalPins})</span>
          </button>
        </div>

        {/* Member Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
          <button
            onClick={() => setMemberFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
              memberFilter === 'ALL'
                ? 'bg-gold/20 text-gold-dark border border-gold/40'
                : 'bg-paper-dim/40 text-ink-muted border border-transparent'
            }`}
          >
            सभी सदस्य
          </button>
          <button
            onClick={() => setMemberFilter('COMMON')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
              memberFilter === 'COMMON'
                ? 'bg-gold/20 text-gold-dark border border-gold/40'
                : 'bg-paper-dim/40 text-ink-muted border border-transparent'
            }`}
          >
            <Users size={11} /> कॉमन
          </button>
          {members.map(m => (
            <button
              key={m.id}
              onClick={() => setMemberFilter(m.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                memberFilter === m.id
                  ? 'bg-gold/20 text-gold-dark border border-gold/40'
                  : 'bg-paper-dim/40 text-ink-muted border border-transparent'
              }`}
            >
              <User size={11} /> {m.name}
            </button>
          ))}
        </div>
      </div>

      {/* Secret Cards List */}
      <div className="space-y-3">
        {filteredSecrets.length === 0 ? (
          <div className="p-8 text-center bg-paper rounded-2xl border border-paper-dim text-ink-muted text-xs space-y-2">
            <Lock size={28} className="mx-auto text-ink-muted/50" />
            <p className="font-bold">कोई सीक्रेट या .env नहीं मिला</p>
            <p className="text-[11px]">ऊपर '+ नया सीक्रेट' बटन दबाकर नया प्रोजेक्ट .env या पासवर्ड सुरक्षित करें।</p>
          </div>
        ) : (
          filteredSecrets.map((item) => {
            const isRevealed = !!revealedIds[item.id];
            const isEnvExpanded = !!expandedEnvIds[item.id];
            const isCopied = copiedKey === item.id;

            return (
              <div
                key={item.id}
                className="bg-paper rounded-2xl border border-paper-dim p-4 space-y-3 shadow-xs hover:border-gold/40 transition-all"
              >
                {/* Header: Title, Badges, and Action Icons */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.secret_type === 'env_file' && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <Code2 size={11} />
                          {item.environment || 'production'} .env
                        </span>
                      )}
                      {item.secret_type === 'password' && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30 flex items-center gap-1">
                          <Key size={11} /> Password
                        </span>
                      )}
                      {item.secret_type === 'pin_secret' && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                          <Shield size={11} /> PIN / Secret
                        </span>
                      )}
                      {item.member_name && (
                        <span className="text-[10px] font-semibold text-ink-muted bg-paper-dim px-2 py-0.5 rounded-full">
                          👤 {item.member_name}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-ink truncate flex items-center gap-1.5">
                      {item.title}
                      {item.url && (
                        <a
                          href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ink-muted hover:text-gold shrink-0"
                          title="Open Link"
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-paper-dim transition-colors"
                      title="संपादित करें"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-ink-muted hover:text-coral hover:bg-coral/10 transition-colors"
                      title="हटाएं"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Content Body: Env File View vs Password View */}
                {item.secret_type === 'env_file' && item.env_content && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-ink-muted font-mono">
                        {item.env_content.split('\n').filter(Boolean).length} Variables configured
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleExpandEnv(item.id)}
                          className="text-gold font-bold hover:underline cursor-pointer"
                        >
                          {isEnvExpanded ? '▲ कम दिखाएं (Collapse)' : '▼ पूरा देखें (View All)'}
                        </button>
                        <button
                          onClick={() => handleCopy(item.env_content || '', item.id)}
                          className="px-2.5 py-1 rounded-lg bg-paper-dim hover:bg-paper-dim/80 text-ink text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          {isCopied ? (
                            <>
                              <Check size={12} className="text-emerald-500" />
                              <span className="text-emerald-600">Copied! ✓</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} className="text-gold" />
                              <span>Copy .env</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Env Code Box */}
                    <div className="rounded-xl bg-navy-dark text-paper border border-navy/40 overflow-hidden font-mono text-[11px]">
                      <div className="px-3 py-1.5 bg-navy border-b border-navy/60 flex items-center justify-between text-[10px] text-paper-dim">
                        <span className="flex items-center gap-1">
                          <Terminal size={11} className="text-gold" />
                          .env.{item.environment || 'production'}
                        </span>
                        <span className="text-gold/80">UTF-8 Encrypted</span>
                      </div>
                      <pre className={`p-3 overflow-x-auto text-emerald-400 select-all leading-relaxed whitespace-pre font-mono ${
                        isEnvExpanded ? 'max-h-[300px]' : 'max-h-[90px]'
                      } transition-all`}>
                        {isRevealed
                          ? item.env_content
                          : item.env_content
                              .split('\n')
                              .map(line => {
                                if (line.trim().startsWith('#') || !line.includes('=')) return line;
                                const [key, ...rest] = line.split('=');
                                return `${key}=••••••••••••••••`;
                              })
                              .join('\n')}
                      </pre>
                      <div className="px-3 py-1 bg-navy/80 border-t border-navy/60 flex items-center justify-between text-[10px]">
                        <button
                          onClick={() => toggleReveal(item.id)}
                          className="text-paper-dim hover:text-gold flex items-center gap-1 cursor-pointer"
                        >
                          {isRevealed ? <EyeOff size={11} /> : <Eye size={11} />}
                          <span>{isRevealed ? 'मास्क करें (Mask values)' : 'मूल वैल्यू दिखाएं (Reveal values)'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Password / Login Secret View */}
                {item.secret_type === 'password' && (
                  <div className="p-3 rounded-xl bg-paper-dim/40 border border-paper-dim space-y-2 text-xs">
                    {item.username_or_email && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-ink-muted font-medium">यूज़रनेम / ईमेल:</span>
                        <div className="flex items-center gap-1.5">
                          <code className="font-mono font-bold text-ink bg-paper px-2 py-0.5 rounded border border-paper-dim">
                            {item.username_or_email}
                          </code>
                          <button
                            onClick={() => handleCopy(item.username_or_email || '', `${item.id}-user`)}
                            className="text-ink-muted hover:text-gold p-1"
                            title="यूज़रनेम कॉपी करें"
                          >
                            {copiedKey === `${item.id}-user` ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-paper-dim/60">
                      <span className="text-[11px] text-ink-muted font-medium">पासवर्ड:</span>
                      <div className="flex items-center gap-1.5">
                        <code className="font-mono font-bold text-ink bg-paper px-2.5 py-0.5 rounded border border-paper-dim tracking-wider">
                          {isRevealed ? item.password : '••••••••••••'}
                        </code>
                        <button
                          onClick={() => toggleReveal(item.id)}
                          className="text-ink-muted hover:text-gold p-1"
                          title={isRevealed ? 'Hide' : 'Show'}
                        >
                          {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                        <button
                          onClick={() => handleCopy(item.password || '', item.id)}
                          className="px-2 py-0.5 rounded bg-gold hover:bg-gold-soft text-navy font-bold text-[10px] flex items-center gap-1 shadow-2xs"
                        >
                          {isCopied ? <Check size={11} className="text-navy" /> : <Copy size={11} />}
                          <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* PIN / Private Code View */}
                {item.secret_type === 'pin_secret' && (
                  <div className="p-3 rounded-xl bg-paper-dim/40 border border-paper-dim flex items-center justify-between gap-2 text-xs">
                    <span className="text-[11px] text-ink-muted font-medium">गोपनीय पिन / कोड:</span>
                    <div className="flex items-center gap-2">
                      <code className="font-mono font-bold text-base text-ink bg-paper px-3 py-1 rounded-lg border border-paper-dim tracking-widest">
                        {isRevealed ? item.password : '••••'}
                      </code>
                      <button
                        onClick={() => toggleReveal(item.id)}
                        className="text-ink-muted hover:text-gold p-1"
                      >
                        {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => handleCopy(item.password || '', item.id)}
                        className="px-2 py-1 rounded bg-gold text-navy font-bold text-xs flex items-center gap-1"
                      >
                        {isCopied ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Notes & Footer */}
                {item.notes && (
                  <p className="text-[11px] text-ink-muted bg-paper-dim/30 p-2 rounded-lg italic">
                    ℹ️ {item.notes}
                  </p>
                )}

                <div className="text-[10px] text-ink-muted flex items-center justify-between pt-1 border-t border-paper-dim/40">
                  <span>अंतिम अपडेट: {item.updated_at || item.created_at}</span>
                  <span className="text-emerald-600 font-medium">🔒 Vault Protected</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT SECRET / .ENV                          */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-paper-dim shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-gold" />
                <h3 className="font-serif font-bold text-base text-ink">
                  {editingId ? 'सीक्रेट / .env संपादित करें' : 'नया सीक्रेट या प्रोजेक्ट .env जोड़ें'}
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
              {/* Secret Type Selector */}
              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1.5">
                  सीक्रेट का प्रकार (Secret Type) *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSecretType('env_file')}
                    className={`py-2 px-2 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                      secretType === 'env_file'
                        ? 'border-emerald-600 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                        : 'border-paper-dim bg-paper text-ink-muted'
                    }`}
                  >
                    <Code2 size={16} />
                    <span>.env फ़ाइल</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSecretType('password')}
                    className={`py-2 px-2 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                      secretType === 'password'
                        ? 'border-blue-600 bg-blue-500/15 text-blue-700 dark:text-blue-400'
                        : 'border-paper-dim bg-paper text-ink-muted'
                    }`}
                  >
                    <Key size={16} />
                    <span>पासवर्ड / लॉगिन</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSecretType('pin_secret')}
                    className={`py-2 px-2 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                      secretType === 'pin_secret'
                        ? 'border-amber-600 bg-amber-500/15 text-amber-700 dark:text-amber-400'
                        : 'border-paper-dim bg-paper text-ink-muted'
                    }`}
                  >
                    <Shield size={16} />
                    <span>पिन / सीक्रेट कोड</span>
                  </button>
                </div>
              </div>

              {/* Title & Member */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                    प्रोजेक्ट / सर्विस का नाम *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={secretType === 'env_file' ? 'उदा. Next.js SuperApp' : 'उदा. HDFC नेटबैंकिंग'}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-medium text-ink focus:border-gold outline-none"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                    किसके लिए है? (Owner Member)
                  </label>
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-medium text-ink focus:border-gold outline-none"
                  >
                    <option value="COMMON">👥 कॉमन (पूरे परिवार के लिए)</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>👤 {m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Specific fields for .env files */}
              {secretType === 'env_file' && (
                <div className="space-y-2.5 pt-1">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                        Environment (माहौल)
                      </label>
                      <select
                        value={environment}
                        onChange={(e) => setEnvironment(e.target.value as any)}
                        className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-medium text-ink focus:border-gold outline-none"
                      >
                        <option value="production">🚀 Production (लाइव)</option>
                        <option value="staging">🧪 Staging (टेस्टिंग)</option>
                        <option value="local">💻 Local / Dev (डेवलपमेंट)</option>
                        <option value="other">⚙️ Other (अन्य)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                        Repo / Website URL (वैकल्पिक)
                      </label>
                      <input
                        type="text"
                        placeholder="https://github.com/..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl text-ink focus:border-gold outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-ink uppercase tracking-wider">
                        .env फ़ाइल का कोड / वेरिएबल्स *
                      </label>
                      <span className="text-[10px] text-ink-muted">KEY=VALUE प्रति पंक्ति</span>
                    </div>
                    <textarea
                      rows={7}
                      required
                      placeholder={`DATABASE_URL=postgres://...\nNEXT_PUBLIC_API_KEY=...\nSECRET_TOKEN=...`}
                      value={envContent}
                      onChange={(e) => setEnvContent(e.target.value)}
                      className="w-full p-3 bg-navy-dark text-emerald-400 font-mono text-xs rounded-xl border border-paper-dim focus:border-gold outline-none leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* Specific fields for Password */}
              {secretType === 'password' && (
                <div className="space-y-2.5 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                        यूज़रनेम / ईमेल
                      </label>
                      <input
                        type="text"
                        placeholder="उदा. admin@kesharwani.in"
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl text-ink focus:border-gold outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-bold text-ink uppercase tracking-wider">
                          पासवर्ड *
                        </label>
                        <button
                          type="button"
                          onClick={generateRandomPassword}
                          className="text-[10px] text-gold hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <Sparkles size={10} /> मजबूत बनाएं
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showFormPassword ? 'text' : 'password'}
                          required
                          placeholder="पासवर्ड दर्ज करें"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-3 pr-8 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl text-ink font-mono focus:border-gold outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowFormPassword(!showFormPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                        >
                          {showFormPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                      वेबसाइट / लॉगिन लिंक (वैकल्पिक)
                    </label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl text-ink focus:border-gold outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Specific fields for PIN */}
              {secretType === 'pin_secret' && (
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-ink uppercase tracking-wider">
                      गोपनीय पिन / सिक्योरिटी कोड *
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showFormPassword ? 'text' : 'password'}
                      required
                      placeholder="उदा. 4 या 6 अंकों का पिन"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl text-ink font-mono text-base tracking-widest focus:border-gold outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFormPassword(!showFormPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                    >
                      {showFormPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                  विवरण / नोट्स (वैकल्पिक)
                </label>
                <input
                  type="text"
                  placeholder="उदा. 2FA बैकअप कोड्स अलमारी में हैं, या सर्वर IP"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl text-ink focus:border-gold outline-none"
                />
              </div>

              {/* Modal Buttons */}
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
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gold hover:bg-gold-soft text-navy font-bold flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <CheckCircle2 size={15} />
                  सुरक्षित सेव करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
