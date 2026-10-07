'use client';

import React, { useState, useMemo } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import {
  Sparkles,
  Clipboard,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  User,
  Trash2,
  ArrowRight,
  Filter,
  DollarSign,
  TrendingUp,
  X,
  FileText,
  Check,
  RefreshCw,
  Info,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { Transaction } from '@/types';

interface ParsedItem {
  id: string;
  selected: boolean;
  date: string; // YYYY-MM-DD
  amount: number;
  description: string;
  category: string;
  memberId: string;
  memberName: string;
  mode: 'online' | 'offline';
  isDuplicate?: boolean;
  isRdSavings?: boolean;
}

export function SmartWhatsAppImporter({ onClose }: { onClose?: () => void }) {
  const {
    members,
    currentUserId,
    transactions,
    addBulkTransactions,
    cleanDuplicateTransactions,
    assets,
    updateAsset,
    addAsset
  } = useFamilyStore();

  const [rawText, setRawText] = useState('');
  const [defaultMemberId, setDefaultMemberId] = useState<string>(currentUserId || members[0]?.id || '');
  const [defaultYear, setDefaultYear] = useState<number>(new Date().getFullYear());
  const [importMode, setImportMode] = useState<'itemized' | 'summary'>('itemized');
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([]);
  const [hasParsed, setHasParsed] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cleanupMessage, setCleanupMessage] = useState<string | null>(null);
  const [autoAddRdToAssets, setAutoAddRdToAssets] = useState(true);

  // Month map for Hindi and English
  const monthMap: Record<string, string> = {
    'जन': '01', 'जन॰': '01', 'jan': '01', 'january': '01',
    'फ़र': '02', 'फ़र॰': '02', 'फर': '02', 'फर॰': '02', 'feb': '02', 'february': '02',
    'मार्च': '03', 'mar': '03', 'march': '03',
    'अपरै': '04', 'अपरै॰': '04', 'अप्रैल': '04', 'apr': '04', 'april': '04',
    'मई': '05', 'may': '05',
    'जून': '06', 'jun': '06', 'june': '06',
    'जुल': '07', 'जुल॰': '07', 'jul': '07', 'july': '07',
    'अग': '08', 'अग॰': '08', 'aug': '08', 'august': '08',
    'सित': '09', 'सित॰': '09', 'sep': '09', 'sept': '09', 'september': '09',
    'अक्टू': '10', 'अक्टू॰': '10', 'अक्टु': '10', 'oct': '10', 'october': '10',
    'नव': '11', 'नव॰': '11', 'nov': '11', 'november': '11',
    'दिस': '12', 'दिस॰': '12', 'dec': '12', 'december': '12'
  };

  // Helper to find member by text
  const matchMemberFromText = (text: string): { id: string; name: string } => {
    const lower = text.toLowerCase();
    
    // Check Papa
    if (lower.includes('papa') || lower.includes('father') || lower.includes('pita') || lower.includes('ganesh')) {
      const p = members.find(m => m.relationship?.toLowerCase().includes('father') || m.relationship?.toLowerCase().includes('pita') || m.name.toLowerCase().includes('ganesh'));
      if (p) return { id: p.id, name: p.name };
    }
    
    // Check Wife
    if (lower.includes('wife') || lower.includes('patni') || lower.includes('neha') || lower.includes('bhabhi')) {
      const w = members.find(m => m.relationship?.toLowerCase().includes('wife') || m.relationship?.toLowerCase().includes('patni') || m.name.toLowerCase().includes('neha'));
      if (w) return { id: w.id, name: w.name };
    }

    // Check Mummy
    if (lower.includes('mummy') || lower.includes('mother') || lower.includes('mata') || lower.includes('neeta')) {
      const m = members.find(m => m.relationship?.toLowerCase().includes('mother') || m.relationship?.toLowerCase().includes('mata') || m.name.toLowerCase().includes('neeta'));
      if (m) return { id: m.id, name: m.name };
    }

    // Check Bhai / Akshay
    if (lower.includes('akshay') || lower.includes('bhai') || lower.includes('brother')) {
      const b = members.find(m => m.name.toLowerCase().includes('akshay') || m.relationship?.toLowerCase().includes('bhai'));
      if (b) return { id: b.id, name: b.name };
    }

    // Check Children / Kids
    if (lower.includes('children') || lower.includes('kids') || lower.includes('bachha') || lower.includes('bachhe') || lower.includes('beta') || lower.includes('beti')) {
      const c = members.find(m => m.relationship?.toLowerCase().includes('child') || m.relationship?.toLowerCase().includes('son') || m.relationship?.toLowerCase().includes('daughter'));
      if (c) return { id: c.id, name: c.name };
      const def = members.find(m => m.id === defaultMemberId) || members[0];
      return { id: def?.id || 'm-self', name: `${def?.name || 'Self'} (Children)` };
    }

    // Check Self
    if (lower.includes('self') || lower.includes('me') || lower.includes('ankush') || lower.includes('mukhiya') || lower.includes('खुद')) {
      const s = members.find(m => m.role === 'owner' || m.relationship?.toLowerCase().includes('self') || m.name.toLowerCase().includes('ankush'));
      if (s) return { id: s.id, name: s.name };
    }

    // Default member
    const def = members.find(m => m.id === defaultMemberId) || members[0];
    return { id: def?.id || 'm-self', name: def?.name || 'Self' };
  };

  // Helper to categorize
  const detectCategory = (desc: string): string => {
    const l = desc.toLowerCase();
    if (l.includes('राशन') || l.includes('किराना') || l.includes('sabji') || l.includes('dudh') || l.includes('chawal') || l.includes('oil') || l.includes('mithai') || l.includes('kirana')) {
      return 'Ghar Ration & Groceries';
    }
    if (l.includes('पेट्रोल') || l.includes('वाहन') || l.includes('car petrol') || l.includes('fuel') || l.includes('bus') || l.includes('diesel')) {
      return 'Fuel & Travel';
    }
    if (l.includes('दवाई') || l.includes('अस्पताल') || l.includes('medical') || l.includes('doctor') || l.includes('dawai')) {
      return 'Medical & Healthcare';
    }
    if (l.includes('बिजली') || l.includes('पानी') || l.includes('गैस') || l.includes('cylender') || l.includes('bill') || l.includes('recharge') || l.includes('tv recharge')) {
      return 'Bills & Utility';
    }
    if (l.includes('बचत किस्त') || l.includes('post office rd') || l.includes('rd') || l.includes('sip') || l.includes('saving')) {
      return 'Savings & Investment';
    }
    if (l.includes('स्टाफ एडवांस') || l.includes('salary') || l.includes('staff')) {
      return 'Staff Salary & Advance';
    }
    return 'Ghar Kharcha / General';
  };

  // Handle Clean Duplicates (Fixes user's doubled expenses immediately)
  const handleCleanDuplicates = () => {
    const res = cleanDuplicateTransactions();
    if (res.countRemoved > 0) {
      setCleanupMessage(`सफलतापूर्वक ${res.countRemoved} डुप्लिकेट एंट्रियां हटा दी गईं! अब ऐप में कुल ${res.totalRemaining} सही व शुद्ध एंट्रियां सुरक्षित हैं।`);
    } else {
      setCleanupMessage(`कोई डुप्लिकेट ट्रांजेक्शन नहीं मिला। आपके सभी ${res.totalRemaining} ट्रांजेक्शन पहले से बिल्कुल सही और यूनिक हैं।`);
    }
    setTimeout(() => setCleanupMessage(null), 8000);
  };

  // Paste from clipboard helper
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setRawText(text);
        parseTextData(text, importMode);
      }
    } catch (err) {
      alert('कृपया टेक्स्ट बॉक्स में सीधा Paste (Ctrl+V) करें।');
    }
  };

  // The Robust Parser Engine
  const parseTextData = (textToParse?: string, mode: 'itemized' | 'summary' = importMode) => {
    const content = textToParse !== undefined ? textToParse : rawText;
    if (!content.trim()) return;

    // Detect year if mentioned in text e.g. "सितंबर 2026" or "2026"
    let detectedYear = defaultYear;
    const yearMatch = content.match(/\b(202[4-9])\b/);
    if (yearMatch) {
      detectedYear = parseInt(yearMatch[1], 10);
      setDefaultYear(detectedYear);
    }

    // Detect default month if header has e.g. "सितंबर 2026"
    let defaultMonthNum = '10';
    Object.keys(monthMap).forEach(mStr => {
      if (content.toLowerCase().includes(mStr)) {
        defaultMonthNum = monthMap[mStr];
      }
    });

    const lines = content.split('\n');
    const items: ParsedItem[] = [];

    // CASE 1: SUMMARY MODE (Only member totals: Self: ₹46,897, Papa: ₹5,428, etc.)
    if (mode === 'summary') {
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return;
        // Check for bullet summary line: • Self: ₹46,897
        if (trimmed.includes('•') && (trimmed.includes('₹') || trimmed.match(/:\s*₹?[0-9,]+/))) {
          const colonMatch = trimmed.match(/•\s*(.*?):\s*₹?([0-9,]+(?:\.[0-9]+)?)/);
          if (colonMatch) {
            const memberText = colonMatch[1].trim();
            const amt = parseFloat(colonMatch[2].replace(/,/g, ''));
            const matchedMember = matchMemberFromText(memberText);
            const dateStr = `${detectedYear}-${defaultMonthNum}-28`;

            const isDup = transactions.some(t =>
              Number(t.amount) === amt &&
              t.member_id === matchedMember.id &&
              t.txn_date.startsWith(`${detectedYear}-${defaultMonthNum}`)
            );

            items.push({
              id: `summary-${index}-${Date.now()}`,
              selected: !isDup,
              date: dateStr,
              amount: amt,
              description: `घर खर्च मासिक योग (${memberText})`,
              category: 'Ghar Kharcha / General',
              memberId: matchedMember.id,
              memberName: matchedMember.name,
              mode: 'online',
              isDuplicate: isDup,
              isRdSavings: false
            });
          }
        }
      });
      setParsedItems(items);
      setHasParsed(true);
      return;
    }

    // CASE 2: ITEMIZED MODE (Detailed line-by-line transactions: 1. राशन - ₹200 (6 अक्टू॰))
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // CRITICAL: Skip summary headers AND member summary bullets (• Self: ₹46,897) in itemized mode
      // This PREVENTS DOUBLE-COUNTING OF SUMMARY TOTALS WITH LINE ITEMS!
      if (
        trimmed.startsWith('*🏡') ||
        trimmed.startsWith('*🏢') ||
        trimmed.startsWith('----------------') ||
        trimmed.startsWith('*💰') ||
        trimmed.startsWith('*📝') ||
        trimmed.startsWith('*👥') ||
        trimmed.startsWith('*📋') ||
        trimmed.startsWith('_Generated') ||
        trimmed.includes('...और') ||
        (trimmed.startsWith('•') && trimmed.includes(':')) // Skips summary bullets!
      ) {
        return;
      }

      // Extract Date from end if present in parentheses e.g. (6 अक्टू॰) or (29 सित॰)
      let datePart = '';
      let lineWithoutDate = trimmed;
      const dateMatch = lineWithoutDate.match(/\(([^)]+)\)$/);
      if (dateMatch) {
        datePart = dateMatch[1].trim();
        lineWithoutDate = lineWithoutDate.substring(0, lineWithoutDate.lastIndexOf('(')).trim();
      }

      // Extract Amount from end e.g. - ₹200 or - 1,500 or ₹4,800
      // Matches: [₹ or unicode rupee or hyphen or space] followed by digits at the end
      const amtMatch = lineWithoutDate.match(/[\u20B9₹]\s*([0-9,]+(?:\.[0-9]+)?)\s*$/) ||
                       lineWithoutDate.match(/[-:\s]\s*₹?\s*([0-9,]+(?:\.[0-9]+)?)\s*$/);

      if (amtMatch) {
        const amt = parseFloat(amtMatch[1].replace(/,/g, ''));
        if (!isNaN(amt) && amt > 0) {
          // Description is everything before the amount match
          let descPart = lineWithoutDate.substring(0, amtMatch.index).trim();
          // Remove leading numbers or bullets e.g. "1. " or "• "
          descPart = descPart.replace(/^[\d+.)•\s]+/, '').trim();
          // Remove trailing hyphens or colons
          descPart = descPart.replace(/[-:\s]+$/, '').trim();

          // Date parsing
          let parsedDate = `${detectedYear}-${defaultMonthNum}-01`;
          if (datePart) {
            const dMatch = datePart.match(/(\d{1,2})\s*([^\s\d]+)/);
            if (dMatch) {
              const day = dMatch[1].padStart(2, '0');
              const rawMonth = dMatch[2].replace(/॰/g, '').toLowerCase();
              const monthNum = monthMap[rawMonth] || defaultMonthNum;
              parsedDate = `${detectedYear}-${monthNum}-${day}`;
            } else if (datePart.match(/\d{4}-\d{2}-\d{2}/)) {
              parsedDate = datePart;
            } else if (datePart.match(/\d{1,2}[\/\-]\d{1,2}/)) {
              const parts = datePart.split(/[\/\-]/);
              parsedDate = `${detectedYear}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
          }

          // Member parsing
          const matchedMember = matchMemberFromText(descPart);

          // Clean description: remove member tags from note
          let cleanDesc = descPart;
          [' - Self', ' - Papa', ' - Wife', ' - Children', ' - Mummy', ' - self', ' - papa', ' - wife'].forEach(tag => {
            cleanDesc = cleanDesc.replace(tag, '');
          });
          cleanDesc = cleanDesc.replace(/[-:\s]+$/, '').trim();

          const isRd = cleanDesc.toLowerCase().includes('rd') || cleanDesc.toLowerCase().includes('बचत किस्त');

          // Check duplicate against existing transactions
          const isDup = transactions.some(t => {
            const sameAmt = Math.abs(Number(t.amount) - amt) < 0.01;
            const sameDate = t.txn_date === parsedDate;
            const normExisting = (t.note || '').toLowerCase().replace(/[^a-z0-9\u0900-\u097F]/g, '');
            const normNew = cleanDesc.toLowerCase().replace(/[^a-z0-9\u0900-\u097F]/g, '');
            const similarNote = normExisting.includes(normNew.substring(0, 8)) || normNew.includes(normExisting.substring(0, 8));
            return sameAmt && (sameDate || similarNote);
          });

          items.push({
            id: `parse-item-${index}-${Date.now()}`,
            selected: !isDup, // Pre-uncheck duplicates to prevent double-counting!
            date: parsedDate,
            amount: amt,
            description: cleanDesc,
            category: detectCategory(cleanDesc),
            memberId: matchedMember.id,
            memberName: matchedMember.name,
            mode: 'online',
            isDuplicate: isDup,
            isRdSavings: isRd
          });
          return;
        }
      }

      // Pipe-delimited fallback: YYYY-MM-DD | AMOUNT | CATEGORY | NOTE
      if (trimmed.includes('|')) {
        const parts = trimmed.split('|').map(p => p.trim());
        if (parts.length >= 2) {
          const dateStr = parts[0];
          const amt = parseFloat(parts[1].replace(/[^0-9.]/g, ''));
          const desc = parts[3] || parts[2] || 'Expense';
          const cat = parts[2] || detectCategory(desc);
          const matchedMember = matchMemberFromText(desc);

          if (!isNaN(amt) && amt > 0) {
            const isDup = transactions.some(t =>
              Number(t.amount) === amt && t.txn_date === dateStr
            );

            items.push({
              id: `parse-pipe-${index}-${Date.now()}`,
              selected: !isDup,
              date: dateStr.length === 10 ? dateStr : `${detectedYear}-${defaultMonthNum}-01`,
              amount: amt,
              description: desc,
              category: cat,
              memberId: matchedMember.id,
              memberName: matchedMember.name,
              mode: 'online',
              isDuplicate: isDup,
              isRdSavings: desc.toLowerCase().includes('rd')
            });
          }
        }
      }
    });

    setParsedItems(items);
    setHasParsed(true);
  };

  // Toggle item selection
  const toggleItem = (id: string) => {
    setParsedItems(prev => prev.map(it => it.id === id ? { ...it, selected: !it.selected } : it));
  };

  // Select only new items (uncheck all duplicates)
  const selectOnlyNewItems = () => {
    setParsedItems(prev => prev.map(it => ({ ...it, selected: !it.isDuplicate })));
  };

  // Toggle select all
  const toggleSelectAll = (select: boolean) => {
    setParsedItems(prev => prev.map(it => ({ ...it, selected: select })));
  };

  // Update specific field on an item
  const updateItemField = (id: string, field: keyof ParsedItem, value: any) => {
    setParsedItems(prev => prev.map(it => {
      if (it.id !== id) return it;
      if (field === 'memberId') {
        const found = members.find(m => m.id === value);
        return { ...it, memberId: value, memberName: found?.name || it.memberName };
      }
      return { ...it, [field]: value };
    }));
  };

  // Remove single item from preview list
  const removeItem = (id: string) => {
    setParsedItems(prev => prev.filter(it => it.id !== id));
  };

  // Save all selected items
  const handleSaveAll = () => {
    const selected = parsedItems.filter(it => it.selected);
    if (selected.length === 0) {
      alert('कम से कम एक ट्रांजेक्शन को सिलेक्ट करें!');
      return;
    }

    const txPayloads = selected.map(it => ({
      member_id: it.memberId,
      type: 'expense' as const,
      amount: it.amount,
      category: it.category,
      mode: it.mode,
      scope: (it.category.includes('Ration') || it.category.includes('Utility') || it.category.includes('Staff')) ? ('ghar' as const) : ('bahar' as const),
      note: it.description,
      txn_date: it.date,
    }));

    // Add to Store
    const count = addBulkTransactions(txPayloads);

    // Optional: Auto-add RD savings to Assets
    if (autoAddRdToAssets) {
      const rdItems = selected.filter(it => it.isRdSavings);
      rdItems.forEach(rd => {
        const existingRd = assets.find(a => a.label.toLowerCase().includes('post office') || a.label.toLowerCase().includes('rd'));
        if (existingRd) {
          updateAsset(existingRd.id, {
            value: Number(existingRd.value || 0) + rd.amount,
            notes: (existingRd.notes || '') + ` (+₹${rd.amount} on ${rd.date} via Vyapar Import)`
          });
        } else {
          addAsset({
            category: 'liquid',
            type: 'bank_deposit',
            label: `Post Office RD (${rd.description})`,
            value: rd.amount,
            notes: `Auto-imported from Vyapar on ${rd.date}`
          });
        }
      });
    }

    setSuccessMessage(`सफलता! कुल ${count} ट्रांजेक्शन (कुल ₹${selected.reduce((s, it) => s + it.amount, 0).toLocaleString('en-IN')}) सभी सदस्यों के खातों और फैमिली लेजर में तारीख-वार दर्ज हो गए हैं।`);
    setParsedItems([]);
    setRawText('');
    setHasParsed(false);
  };

  // Stats
  const totalSelectedCount = useMemo(() => parsedItems.filter(i => i.selected).length, [parsedItems]);
  const totalSelectedAmount = useMemo(() => parsedItems.filter(i => i.selected).reduce((s, i) => s + i.amount, 0), [parsedItems]);
  const duplicateCount = useMemo(() => parsedItems.filter(i => i.isDuplicate).length, [parsedItems]);

  return (
    <div className="bg-[#111827] border border-amber-500/30 rounded-3xl p-5 md:p-7 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg md:text-xl font-black text-white flex items-center gap-2 flex-wrap">
                स्मार्ट WhatsApp व व्यापार ऐप बल्क इम्पोर्टर
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Universal Date-Wise
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Mobile Vyapar App या WhatsApp से कॉपी किया गया मैसेज सीधे पेस्ट करें। डुप्लिकेट से सुरक्षित व तारीख-वार ऑटो-मैपिंग।
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Duplicate Cleaner Button */}
          <button
            type="button"
            onClick={handleCleanDuplicates}
            className="px-3 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            title="सिस्टम में मौजूद किसी भी डबल/डुप्लिकेट एंट्री को 1-क्लिक में साफ करें"
          >
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>🧹 डुप्लिकेट एंट्रियां साफ करें</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Cleanup Notification */}
      {cleanupMessage && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/50 rounded-2xl flex items-center justify-between gap-3 text-rose-200 text-xs font-bold">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{cleanupMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setCleanupMessage(null)}
            className="text-xs px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg text-rose-300"
          >
            ठीक है
          </button>
        </div>
      )}

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-2xl flex items-center justify-between gap-3 text-emerald-300 text-xs font-bold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-xs px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg"
          >
            ठीक है
          </button>
        </div>
      )}

      {/* Paste Area & Controls */}
      {!hasParsed && (
        <div className="space-y-4">
          {/* Mode Switcher */}
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" /> इम्पोर्ट का प्रकार चुनें (Choose Import Mode):
              </span>
              <p className="text-[11px] text-slate-400">
                {importMode === 'itemized' 
                  ? 'लाइन-वार 40+ खर्चे तारीख सहित अलग-अलग दर्ज होंगे (समरी टोटल को छोड़ दिया जाएगा ताकि डबल न हो)।'
                  : 'सिर्फ सदस्यों का कुल योग (Self: ₹46,897, Papa: ₹5,428) 1-1 लाइन में दर्ज होगा।'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setImportMode('itemized')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  importMode === 'itemized'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📋 सभी अलग-अलग खर्चे (40 Items)
              </button>
              <button
                type="button"
                onClick={() => setImportMode('summary')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  importMode === 'summary'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                👥 सदस्यवार कुल योग (Summary)
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-400" /> WhatsApp / व्यापार ऐप का पूरा मैसेज यहाँ पेस्ट करें:
            </label>
            <button
              type="button"
              onClick={handlePasteFromClipboard}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Clipboard className="w-3.5 h-3.5" /> क्लिपबोर्ड से ऑटो-पेस्ट करें
            </button>
          </div>

          <textarea
            rows={8}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={`यहाँ अपना मैसेज पेस्ट करें, जैसे:\n\n*🏡 फैमिली घर खर्च रिपोर्ट*\n*👥 सदस्यवार खर्च:*\n  • Self: ₹46,897\n  • Papa: ₹5,428\n*📋 प्रमुख खर्चे:*\n1. राशन/किराना - Self - ₹200 (6 अक्टू॰)\n2. Dudh ka diya - ₹670 (5 अक्टू॰)\n3. दवाई/अस्पताल - Children - ₹500 (3 अक्टू॰)\n4. बचत किस्त - Post office rd 3000rs - ₹3,000 (23 सित॰)\n...`}
            className="w-full p-4 bg-[#0B0F19] border border-slate-800 rounded-2xl text-xs text-white font-mono placeholder:text-slate-600 focus:border-amber-500 outline-none transition"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-400 font-bold block mb-1">डिफ़ॉल्ट सदस्य (अगर लाइन में न लिखा हो)</label>
              <select
                value={defaultMemberId}
                onChange={(e) => setDefaultMemberId(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    👤 {m.name} ({m.relationship || m.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">साल (Year)</label>
              <input
                type="number"
                value={defaultYear}
                onChange={(e) => setDefaultYear(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold font-mono"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => parseTextData(rawText, importMode)}
                disabled={!rawText.trim()}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" /> डेटा स्कैन व प्रिव्यू टेबल बनाएं
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Parsed Interactive Table */}
      {hasParsed && (
        <div className="space-y-4">
          {/* Summary & Controls Bar */}
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-white">
                  कुल पाए गए: <strong className="text-amber-400 font-mono">{parsedItems.length}</strong>
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-bold text-emerald-400">
                  शामिल करने हेतु चुने गए: <strong className="font-mono">{totalSelectedCount}</strong>
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-sm font-black text-emerald-400 font-mono">
                  कुल चुनी गई राशि: ₹{totalSelectedAmount.toLocaleString('en-IN')}
                </span>
              </div>
              {duplicateCount > 0 && (
                <p className="text-[11px] text-amber-300 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  {duplicateCount} ट्रांजेक्शन पहले से आपके ऐप में मौजूद हैं! इन्हें डबल होने से बचाने के लिए ऑटो-अनचेक रखा गया है।
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {duplicateCount > 0 && (
                <button
                  type="button"
                  onClick={selectOnlyNewItems}
                  className="px-2.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold"
                  title="सिर्फ उन खर्चों को चुनें जो अभी तक ऐप में नहीं हैं"
                >
                  ✓ सिर्फ नए खर्चे चुनें
                </button>
              )}
              <button
                type="button"
                onClick={() => toggleSelectAll(true)}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold"
              >
                सब चुनें
              </button>
              <button
                type="button"
                onClick={() => toggleSelectAll(false)}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-xs font-bold"
              >
                सब हटाएं
              </button>
              <button
                type="button"
                onClick={() => {
                  setHasParsed(false);
                  setParsedItems([]);
                }}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> नया टेक्स्ट पेस्ट करें
              </button>
            </div>
          </div>

          {/* User's manual handling helper banner */}
          <div className="p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl flex items-start gap-2.5 text-xs text-purple-200">
            <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong>मैन्युअल एडजस्टमेंट सुविधा:</strong> यदि कोई खर्चा पहले से दर्ज है, तो उस पंक्ति का चेकबॉक्स अनचेक रखें। यदि तारीख या सदस्य में बदलाव करना हो, तो सीधे इसी टेबल में क्लिक करके बदल सकते हैं।
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto border border-slate-800 rounded-2xl max-h-[500px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B0F19] text-slate-400 font-bold border-b border-slate-800 sticky top-0 z-10">
                <tr>
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={parsedItems.length > 0 && parsedItems.every(i => i.selected)}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                    />
                  </th>
                  <th className="p-3 w-32">तारीख (Date)</th>
                  <th className="p-3 w-40">सदस्य (Member)</th>
                  <th className="p-3">खर्च विवरण (Description)</th>
                  <th className="p-3 w-36">श्रेणी (Category)</th>
                  <th className="p-3 w-28 text-right">राशि (₹)</th>
                  <th className="p-3 w-12 text-center">हटाएं</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                {parsedItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-800/40 transition ${
                      !item.selected ? 'opacity-40 bg-slate-950/40' : ''
                    } ${item.isDuplicate ? 'bg-amber-950/20' : ''}`}
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => toggleItem(item.id)}
                        className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                      />
                    </td>

                    {/* Date Input */}
                    <td className="p-3">
                      <input
                        type="date"
                        value={item.date}
                        onChange={(e) => updateItemField(item.id, 'date', e.target.value)}
                        className="p-1.5 bg-[#0B0F19] border border-slate-700 rounded-lg text-white font-mono text-[11px] w-full"
                      />
                    </td>

                    {/* Member Dropdown */}
                    <td className="p-3">
                      <select
                        value={item.memberId}
                        onChange={(e) => updateItemField(item.id, 'memberId', e.target.value)}
                        className="p-1.5 bg-[#0B0F19] border border-slate-700 rounded-lg text-white font-bold text-[11px] w-full"
                      >
                        {members.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Description */}
                    <td className="p-3">
                      <div className="space-y-0.5">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItemField(item.id, 'description', e.target.value)}
                          className="p-1.5 bg-[#0B0F19] border border-slate-700 rounded-lg text-white text-[11px] w-full font-medium"
                        />
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.isRdSavings && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                              🏦 RD बचत (Assets)
                            </span>
                          )}
                          {item.isDuplicate && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300 font-bold flex items-center gap-0.5">
                              ⚠️ पहले से दर्ज है (अनचेक रखा गया)
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-3">
                      <select
                        value={item.category}
                        onChange={(e) => updateItemField(item.id, 'category', e.target.value)}
                        className="p-1.5 bg-[#0B0F19] border border-slate-700 rounded-lg text-slate-200 text-[11px] w-full"
                      >
                        <option value="Ghar Ration & Groceries">घर का राशन (Groceries)</option>
                        <option value="Fuel & Travel">पेट्रोल व वाहन (Fuel)</option>
                        <option value="Medical & Healthcare">दवाई व अस्पताल (Medical)</option>
                        <option value="Bills & Utility">बिजली, पानी व बिल (Bills)</option>
                        <option value="Savings & Investment">बचत व RD किश्त (Savings)</option>
                        <option value="Staff Salary & Advance">स्टाफ वेतन व एडवांस</option>
                        <option value="Ghar Kharcha / General">सामान्य घरेलू खर्च</option>
                      </select>
                    </td>

                    {/* Amount */}
                    <td className="p-3 text-right">
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => updateItemField(item.id, 'amount', parseFloat(e.target.value) || 0)}
                        className="p-1.5 bg-[#0B0F19] border border-slate-700 rounded-lg text-emerald-400 font-mono font-black text-xs text-right w-24"
                      />
                    </td>

                    {/* Delete Action */}
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition"
                        title="हटाएं"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 border-t border-slate-800">
            <label className="text-xs text-slate-300 flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoAddRdToAssets}
                onChange={(e) => setAutoAddRdToAssets(e.target.checked)}
                className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
              />
              <span>🏦 पोस्ट ऑफिस RD / बचत किश्तों को सीधे वेल्थ एसेट्स में भी दर्ज करें (Net Worth Boost)</span>
            </label>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={totalSelectedCount === 0}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl shadow-xl transition-all flex items-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" /> सभी {totalSelectedCount} ट्रांजेक्शन सिस्टम में जोड़ें (₹{totalSelectedAmount.toLocaleString('en-IN')})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
