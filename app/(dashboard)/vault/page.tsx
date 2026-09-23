'use client';

import React, { useState, useEffect } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { DocumentCard } from '@/components/vault/DocumentCard';
import { ReminderCard } from '@/components/reminders/ReminderCard';
import { 
  Upload, Plus, X, FileText, CheckCircle2, AlertTriangle, 
  ShieldCheck, FolderPlus, Folder, Users, User, Share2, Filter 
} from 'lucide-react';
import { DocumentCategory } from '@/types';

// Default built-in smart folders
const DEFAULT_FOLDERS = [
  'General',
  'जमीन व प्रॉपर्टी (Registry)',
  'बीमा व हेल्थ (Insurance)',
  'गाड़ी के कागज़ (RC/PUC)',
  'पहचान पत्र (Aadhar/PAN)',
  'टैक्स व ITR (Income Tax)',
];

export default function VaultPage() {
  const { documents, reminders, members, addDocument, deleteDocument } = useFamilyStore();

  // Custom User Folders (Stored in localStorage)
  const [customFolders, setCustomFolders] = useState<string[]>(DEFAULT_FOLDERS);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'COMMON' | string>('ALL'); // 'ALL' | 'COMMON' | memberId | folderName
  const [filterType, setFilterType] = useState<'ALL' | 'MEMBER' | 'FOLDER'>('ALL');

  // Modals State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Upload Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('insurance');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('COMMON'); // 'COMMON' or member.id
  const [selectedFolder, setSelectedFolder] = useState<string>('General');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [fileData, setFileData] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);

  // Load custom folders from localStorage
  useEffect(() => {
    try {
      const savedFolders = localStorage.getItem('fwa_custom_folders');
      if (savedFolders) {
        setCustomFolders(JSON.parse(savedFolders));
      }
    } catch (e) {}
  }, []);

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const name = newFolderName.trim();
    if (!customFolders.includes(name)) {
      const updated = [...customFolders, name];
      setCustomFolders(updated);
      try { localStorage.setItem('fwa_custom_folders', JSON.stringify(updated)); } catch (e) {}
    }
    setSelectedFolder(name);
    setNewFolderName('');
    setIsCreateFolderModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setFileData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setUploading(true);

    let hasAlert = false;
    if (expiryDate) {
      const diffTime = new Date(expiryDate).getTime() - Date.now();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 30 && diffDays >= 0) {
        hasAlert = true;
      }
    }

    const memberObj = members.find(m => m.id === selectedMemberId);
    const memberName = selectedMemberId === 'COMMON' ? 'कॉमन (सभी के लिए)' : (memberObj?.name || 'सदस्य');

    addDocument({
      title: title.trim(),
      category,
      member_id: selectedMemberId === 'COMMON' ? undefined : selectedMemberId,
      member_name: memberName,
      folder_name: selectedFolder || 'General',
      file_url: fileData || '#',
      file_type: fileName.split('.').pop() || 'pdf',
      expiry_date: expiryDate || undefined,
      notes: notes.trim() || (expiryDate ? `Expiry: ${new Date(expiryDate).toLocaleDateString('hi-IN')}` : 'सुरक्षित सेव्ड'),
      alert: hasAlert,
    });

    setUploading(false);
    setIsUploadModalOpen(false);

    // Reset Form
    setTitle('');
    setCategory('insurance');
    setSelectedMemberId('COMMON');
    setSelectedFolder('General');
    setExpiryDate('');
    setNotes('');
    setFileData(null);
    setFileName('');
  };

  // Filtered Documents
  const filteredDocuments = documents.filter(doc => {
    if (filterType === 'ALL') return true;
    if (filterType === 'MEMBER') {
      if (activeFilter === 'COMMON') return !doc.member_id || doc.member_name?.includes('कॉमन');
      return doc.member_id === activeFilter;
    }
    if (filterType === 'FOLDER') {
      return doc.folder_name === activeFilter;
    }
    return true;
  });

  return (
    <div className="space-y-4 pt-2">
      <ScreenHeader
        title="Document Vault"
        subtitle="फ़ैमिली मेंबर व फ़ोल्डर अनुसार सुरक्षित दस्तावेज़"
      />

      {/* Top Action Bar */}
      <div className="px-4 flex gap-2">
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex-1 py-2.5 px-3 rounded-xl bg-gold hover:bg-gold-soft text-navy text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <Upload size={14} />
          <span>+ नया डॉक्यूमेंट जोड़ें</span>
        </button>
        <button
          onClick={() => setIsCreateFolderModalOpen(true)}
          className="py-2.5 px-3 rounded-xl bg-paper hover:bg-paper-dim border border-paper-dim text-ink text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          title="नया फ़ोल्डर बनाएं"
        >
          <FolderPlus size={15} className="text-gold" />
          <span>+ नया फ़ोल्डर</span>
        </button>
      </div>

      {/* 📁 Member-wise & Folder Filter Tabs */}
      <div className="px-4 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-ink-muted">
          <span>फ़िल्टर करें (सदस्य या फ़ोल्डर):</span>
          {filterType !== 'ALL' && (
            <button
              onClick={() => { setFilterType('ALL'); setActiveFilter('ALL'); }}
              className="text-gold hover:underline cursor-pointer"
            >
              सभी दिखाएं
            </button>
          )}
        </div>

        {/* Members Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => { setFilterType('ALL'); setActiveFilter('ALL'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterType === 'ALL'
                ? 'bg-navy text-gold shadow-xs'
                : 'bg-paper text-ink-muted border border-paper-dim hover:bg-paper-dim'
            }`}
          >
            सभी ({documents.length})
          </button>

          <button
            onClick={() => { setFilterType('MEMBER'); setActiveFilter('COMMON'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
              filterType === 'MEMBER' && activeFilter === 'COMMON'
                ? 'bg-navy text-gold shadow-xs'
                : 'bg-paper text-ink-muted border border-paper-dim hover:bg-paper-dim'
            }`}
          >
            <Users size={12} /> कॉमन फ़ाइलें
          </button>

          {members.map((m) => (
            <button
              key={m.id}
              onClick={() => { setFilterType('MEMBER'); setActiveFilter(m.id); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                filterType === 'MEMBER' && activeFilter === m.id
                  ? 'bg-navy text-gold shadow-xs'
                  : 'bg-paper text-ink-muted border border-paper-dim hover:bg-paper-dim'
              }`}
            >
              <User size={12} /> {m.name}
            </button>
          ))}
        </div>

        {/* Category / Custom Folders Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {customFolders.map((fName) => (
            <button
              key={fName}
              onClick={() => { setFilterType('FOLDER'); setActiveFilter(fName); }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                filterType === 'FOLDER' && activeFilter === fName
                  ? 'bg-gold/20 text-gold font-bold border border-gold/40'
                  : 'bg-paper-dim/40 text-ink-muted border border-transparent hover:bg-paper-dim'
              }`}
            >
              <Folder size={11} className={filterType === 'FOLDER' && activeFilter === fName ? 'text-gold' : 'text-ink-muted'} />
              <span>{fName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stored Documents List */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif font-semibold text-ink text-sm">
            {filterType === 'ALL' ? 'सभी दस्तावेज़' : (filterType === 'MEMBER' ? `सदस्य अनुसार फ़ाइलें` : `फ़ोल्डर: ${activeFilter}`)} ({filteredDocuments.length})
          </h2>
        </div>

        <div className="rounded-xl bg-paper border border-paper-dim overflow-hidden divide-y divide-paper-dim shadow-sm">
          {filteredDocuments.length === 0 ? (
            <div className="p-8 text-center text-ink-muted text-xs space-y-1">
              <FileText size={24} className="mx-auto text-ink-muted/50 mb-1" />
              <p className="font-bold">इस फ़ोल्डर/सदस्य में कोई डॉक्यूमेंट नहीं है</p>
              <p className="text-[11px]">ऊपर '+ नया डॉक्यूमेंट जोड़ें' पर क्लिक करें।</p>
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                onDelete={(id) => deleteDocument(id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Upcoming Expiry & Reminders Section */}
      <div className="px-4 pt-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif font-semibold text-ink text-sm">
            Upcoming Expiry & Reminders
          </h2>
        </div>

        <div className="rounded-xl bg-paper border border-paper-dim overflow-hidden divide-y divide-paper-dim shadow-sm">
          {reminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))}
        </div>
      </div>

      {/* ➕ CREATE CUSTOM FOLDER MODAL */}
      {isCreateFolderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper rounded-2xl max-w-sm w-full p-5 space-y-3 border border-paper-dim shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-paper-dim pb-2.5">
              <div className="flex items-center gap-2">
                <FolderPlus size={18} className="text-gold" />
                <h3 className="font-serif font-bold text-sm text-ink">नया फ़ोल्डर बनाएं</h3>
              </div>
              <button onClick={() => setIsCreateFolderModalOpen(false)} className="text-ink-muted hover:text-ink">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                  फ़ोल्डर का नाम (Folder Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. पासपोर्ट, बैंक एफडी, जमीन रजिस्ट्री, कोर्ट केस"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-medium text-ink focus:border-gold outline-none"
                  autoFocus
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateFolderModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-paper-dim font-bold text-ink-muted hover:bg-paper-dim/40"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gold hover:bg-gold-soft text-navy font-bold shadow transition-all"
                >
                  फ़ोल्डर बनाएं
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📁 UPLOAD DOCUMENT MODAL (Member & Folder Dropdown) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-paper rounded-t-3xl sm:rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-paper-dim shadow-2xl p-5 space-y-4 animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <div className="flex items-center gap-2">
                <Upload size={18} className="text-gold" />
                <h3 className="font-serif font-bold text-base text-ink">नया दस्तावेज़ अपलोड करें</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-ink-muted hover:text-ink p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              {/* Document Title */}
              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                  डॉक्यूमेंट का नाम *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. पापा की LIC पॉलिसी, कार इंश्योरेंस, रजिस्ट्री"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-medium text-ink focus:border-gold outline-none"
                />
              </div>

              {/* Member Selection (Member-Wise Isolation) */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                    किस सदस्य का है? *
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

                {/* Folder Selection (Folder Isolation) */}
                <div>
                  <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                    किस फ़ोल्डर में रखें? *
                  </label>
                  <select
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-medium text-ink focus:border-gold outline-none"
                  >
                    {customFolders.map(f => (
                      <option key={f} value={f}>📁 {f}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                    Category (प्रकार) *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                    className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-medium text-ink focus:border-gold outline-none"
                  >
                    <option value="insurance">Insurance (बीमा)</option>
                    <option value="vehicle">Vehicle (गाड़ी RC/PUC)</option>
                    <option value="property">Property (जमीन/मकान)</option>
                    <option value="id_proof">ID Proof (Aadhar/PAN)</option>
                    <option value="tax">Tax / ITR</option>
                    <option value="other">Other (अन्य)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                    Expiry Date (यदि हो)
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-medium text-ink focus:border-gold outline-none"
                  />
                </div>
              </div>

              {/* File Upload Box (PDF or Image) */}
              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                  फ़ाइल अपलोड करें (PDF या फ़ोटो)
                </label>
                <label className="border-2 border-dashed border-paper-dim hover:border-gold rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-paper-dim/20 transition-all">
                  <FileText size={22} className="text-gold" />
                  <span className="text-xs font-semibold text-ink text-center">
                    {fileName ? fileName : 'फ़ोटो या PDF चुनने के लिए यहाँ क्लिक करें'}
                  </span>
                  <span className="text-[10px] text-ink-muted">PDF, PNG, JPG (Galley ya Camera)</span>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
                  विवरण / नोट्स (वैकल्पिक)
                </label>
                <input
                  type="text"
                  placeholder="उदा. पॉलिसी नंबर, अलमारी नंबर 2 में मूल प्रति रखी है"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl text-ink focus:border-gold outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-paper-dim text-ink-muted font-bold hover:bg-paper-dim/50 transition-colors"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={uploading || !title.trim()}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gold hover:bg-gold-soft text-navy font-bold flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50"
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
