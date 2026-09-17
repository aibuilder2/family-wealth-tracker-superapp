'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Mono } from '@/components/ui/Mono';
import { Button } from '@/components/ui/Button';
import { 
  TrendingUp, RefreshCw, Plus, Sparkles, Coins, Landmark, ArrowUpRight, ArrowDownRight, 
  Search, CheckCircle2, Calculator, Calendar, Users, Percent, ShieldCheck, ArrowRight, Building2, Home, Edit3, Trash2, ArrowRightLeft, Building, Check, Split 
} from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  price: number;
  exchange: string;
}

export default function WealthPage() {
  const { assets, totalWealth, liquidWealth, fixedWealth, addAsset, updateAsset, deleteAsset, members, currentUserId, rentalProperties, updateRentalProperty, addRentDiversion, deleteRentDiversion, executeRentDiversion, staff } = useFamilyStore();
  const [activeTab, setActiveTab] = useState<'all' | 'liquid' | 'fixed'>('all');
  
  // Asset Edit & Delete States
  const [editingAsset, setEditingAsset] = useState<any | null>(null);
  const [editAssetLabel, setEditAssetLabel] = useState('');
  const [editAssetVal, setEditAssetVal] = useState('');
  const [editAssetMemberId, setEditAssetMemberId] = useState('');
  const [editAssetJointIds, setEditAssetJointIds] = useState<string[]>([]);
  const [editAssetCategory, setEditAssetCategory] = useState<'liquid' | 'fixed'>('liquid');

  // Property Quick Owner Change State
  const [reassignPropModal, setReassignPropModal] = useState<any | null>(null);
  const [newPropOwnerId, setNewPropOwnerId] = useState('');

  // Rent Diversion / Batwara Modal State
  const [diversionPropModal, setDiversionPropModal] = useState<any | null>(null);
  const [divTargetMemberId, setDivTargetMemberId] = useState(members[1]?.id || members[0]?.id || '');
  const [divSplitType, setDivSplitType] = useState<'percentage' | 'fixed_amount'>('fixed_amount');
  const [divSplitValue, setDivSplitValue] = useState<number>(5000);
  const [divPurpose, setDivPurpose] = useState('Ghar Kharcha');
  
  const [divAllocTarget, setDivAllocTarget] = useState<'member_personal' | 'fd_rd_investment' | 'ghar_ration_expense' | 'staff_payment'>('member_personal');
  const [divLinkedAssetId, setDivLinkedAssetId] = useState<string>('');
  const [divLinkedStaffId, setDivLinkedStaffId] = useState<string>('');

  const [divPaymentMode, setDivPaymentMode] = useState<'bank_transfer' | 'cash' | 'upi'>('bank_transfer');

  const [memberFilter, setMemberFilter] = useState<'all' | string>('all');

  const totalRentalPropertiesValuation = (rentalProperties || []).reduce((sum, p) => sum + Number(p.estimated_market_value || p.purchase_price || 0), 0);
  const combinedFixedWealth = fixedWealth + totalRentalPropertiesValuation;
  const combinedTotalWealth = totalWealth + totalRentalPropertiesValuation;

  
  // Market sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [marketRates, setMarketRates] = useState<{
    gold_24k_10g: number;
    gold_24k_per_g: number;
    stocks: Record<string, { price: number; changePercent: number; name: string }>;
    mutual_funds: Record<string, { nav: number; schemeName: string }>;
    lastSyncTime: string;
  }>({
    gold_24k_10g: 74500,
    gold_24k_per_g: 7450,
    stocks: {
      'RELIANCE': { price: 2985.40, changePercent: 1.45, name: 'Reliance Industries' },
      'TCS': { price: 4210.80, changePercent: 0.85, name: 'Tata Consultancy Services' },
      'TATAMOTORS': { price: 975.20, changePercent: -0.40, name: 'Tata Motors' },
      'HDFCBANK': { price: 1640.50, changePercent: 0.60, name: 'HDFC Bank' }
    },
    mutual_funds: {
      '122639': { nav: 89.57, schemeName: 'Parag Parikh Flexi Cap Fund' },
      '120828': { nav: 265.12, schemeName: 'Quant Small Cap Fund' },
      '119598': { nav: 94.30, schemeName: 'SBI Bluechip Fund' }
    },
    lastSyncTime: 'Aaj 09:30 PM (Daily Sync)'
  });

  // Modal & Search Autocomplete State
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [assetCat, setAssetCat] = useState<'liquid' | 'fixed'>('liquid');
  const [assetType, setAssetType] = useState<'bank_deposit' | 'gold' | 'silver' | 'shares' | 'mutual_funds' | 'land' | 'property'>('shares');
  
  // Member & Joint Holdings
  const [primaryMemberId, setPrimaryMemberId] = useState(currentUserId || members[0]?.id || 'm-head');
  const [jointMemberIds, setJointMemberIds] = useState<string[]>([]);

  // Subtypes for Bank Deposits & MF
  const [depositSubtype, setDepositSubtype] = useState<'fd' | 'rd' | 'savings' | 'other'>('fd');
  const [interestRate, setInterestRate] = useState('');
  const [maturityDate, setMaturityDate] = useState('');

  // MF Investment Mode: 'units' vs 'sip'
  const [mfMode, setMfMode] = useState<'units' | 'sip'>('sip');
  const [sipMonthlyAmount, setSipMonthlyAmount] = useState('5000');
  const [sipMonthsCount, setSipMonthsCount] = useState('12');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<SearchResult | null>(null);

  const [assetLabel, setAssetLabel] = useState('');
  const [assetSymbol, setAssetSymbol] = useState('');
  const [assetQty, setAssetQty] = useState('');
  const [assetBuyPrice, setAssetBuyPrice] = useState('');
  const [assetLivePrice, setAssetLivePrice] = useState<number>(0);
  const [assetVal, setAssetVal] = useState('');

  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Autocomplete fetch on search input
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    searchDebounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch('/api/search-assets?q=' + encodeURIComponent(searchQuery));
        const data = await res.json();
        if (data.results) {
          setSearchResults(data.results);
        }
      } catch (e) {
        console.log('Search error:', e);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchQuery]);

  const handleSelectSearchResult = (item: SearchResult) => {
    setSelectedAsset(item);
    setAssetLabel(item.name);
    setAssetSymbol(item.symbol);
    setAssetLivePrice(item.price);
    setSearchResults([]);
    setSearchQuery('');

    if (item.type === 'mutual_funds') {
      setAssetCat('liquid');
      setAssetType('mutual_funds');
      calculateSipValue(sipMonthlyAmount, sipMonthsCount, item.price);
    } else if (item.type === 'shares') {
      setAssetCat('liquid');
      setAssetType('shares');
      const q = parseFloat(assetQty) || 1;
      setAssetVal((q * item.price).toFixed(2));
    } else if (item.type === 'gold') {
      setAssetCat('fixed');
      setAssetType('gold');
      const g = parseFloat(assetQty) || 10;
      setAssetVal((g * marketRates.gold_24k_per_g).toFixed(2));
    }
  };

  const calculateSipValue = (monthly: string, months: string, nav: number) => {
    const mAmount = parseFloat(monthly) || 0;
    const mCount = parseFloat(months) || 0;
    const totalInvested = mAmount * mCount;
    
    // Compounding SIP return estimate (~15% annualized average for equity MF)
    const monthlyRate = 0.15 / 12;
    let futureValue = 0;
    for (let i = 1; i <= mCount; i++) {
      futureValue += mAmount * Math.pow(1 + monthlyRate, i);
    }
    
    setAssetBuyPrice((totalInvested / (futureValue / (nav || 80))).toFixed(2)); // Avg buy NAV
    setAssetQty((futureValue / (nav || 80)).toFixed(2)); // Total Units
    setAssetVal(futureValue > 0 ? futureValue.toFixed(2) : totalInvested.toFixed(2));
  };

  const handleQtyChange = (val: string) => {
    setAssetQty(val);
    const q = parseFloat(val) || 0;
    if (assetType === 'gold') {
      setAssetVal((q * marketRates.gold_24k_per_g).toFixed(2));
    } else if (assetLivePrice > 0) {
      setAssetVal((q * assetLivePrice).toFixed(2));
    }
  };

  const handleSyncMarketRates = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/market-prices');
      const data = await res.json();
      if (data.success) {
        setMarketRates({
          gold_24k_10g: data.gold.rate_per_10g_24k,
          gold_24k_per_g: data.gold.rate_per_gram_24k,
          stocks: data.stocks,
          mutual_funds: data.mutual_funds,
          lastSyncTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (Live Updated)'
        });
        try { confetti({ particleCount: 40, spread: 50 }); } catch (e) {}
      }
    } catch (e) {
      console.log('Sync error:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleJointMember = (id: string) => {
    if (jointMemberIds.includes(id)) {
      setJointMemberIds(jointMemberIds.filter(mId => mId !== id));
    } else {
      setJointMemberIds([...jointMemberIds, id]);
    }
  };

  
  const openEditAssetModal = (asset: any) => {
    setEditingAsset(asset);
    setEditAssetLabel(asset.label || '');
    setEditAssetVal(String(asset.value || 0));
    setEditAssetMemberId(asset.member_id || currentUserId || members[0]?.id || '');
    setEditAssetJointIds(asset.joint_member_ids || []);
    setEditAssetCategory(asset.category || 'liquid');
  };

  const handleSaveEditedAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;
    updateAsset(editingAsset.id, {
      label: editAssetLabel,
      value: parseFloat(editAssetVal) || 0,
      member_id: editAssetMemberId,
      joint_member_ids: editAssetJointIds.length > 0 ? editAssetJointIds : undefined,
      category: editAssetCategory
    });
    setEditingAsset(null);
  };

  const handleDeleteAssetClick = (assetId: string, label: string) => {
    if (confirm(`Kya aap "${label}" asset ko hatana chahte hain?`)) {
      deleteAsset(assetId);
    }
  };

  const handleReassignPropertyOwner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignPropModal || !newPropOwnerId) return;
    const targetMember = members.find(m => m.id === newPropOwnerId);
    if (!targetMember) return;

    updateRentalProperty(reassignPropModal.id, {
      owner_member_id: targetMember.id,
      owner_member_name: targetMember.name,
      member_id: targetMember.id,
      landlord_name: targetMember.name
    });
    setReassignPropModal(null);
  };

  
  const handleExecuteDiversionInWealth = (propertyId: string, ruleId: string) => {
    const res = executeRentDiversion(propertyId, ruleId);
    if (res.success) {
      try { confetti({ particleCount: 60, spread: 60 }); } catch (e) {}
      alert(res.message);
    } else {
      alert(res.message);
    }
  };

  const handleAddDiversionRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diversionPropModal) return;
    const target = members.find(m => m.id === divTargetMemberId);
    if (!target) return;

    const linkedAsset = assets.find(a => a.id === divLinkedAssetId);
    const linkedStaff = (staff || []).find(s => s.id === divLinkedStaffId);

    addRentDiversion(diversionPropModal.id, {
      target_member_id: target.id,
      target_member_name: target.name,
      split_type: divSplitType,
      split_value: Number(divSplitValue) || 0,
      purpose: divPurpose,
      payment_mode: divPaymentMode,
      is_active: true,
      allocation_target: divAllocTarget,
      linked_asset_id: divAllocTarget === 'fd_rd_investment' ? divLinkedAssetId || undefined : undefined,
      linked_asset_name: divAllocTarget === 'fd_rd_investment' ? linkedAsset?.label : undefined,
      linked_staff_id: divAllocTarget === 'staff_payment' ? divLinkedStaffId || undefined : undefined,
      linked_staff_name: divAllocTarget === 'staff_payment' ? linkedStaff?.name : undefined
    });

    // Reset diversion form
    setDivSplitValue(5000);
    setDivPurpose('Ghar Kharcha');
  };

  const handleAddAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(assetQty) || 0;
    const buyPrice = parseFloat(assetBuyPrice) || 0;
    let computedVal = parseFloat(assetVal) || 0;

    if (!computedVal && qty && assetLivePrice) {
      computedVal = qty * assetLivePrice;
    }

    addAsset({
      category: assetCat,
      type: assetType as any,
      asset_subtype: assetType === 'bank_deposit' ? depositSubtype : (assetType === 'mutual_funds' ? (mfMode === 'sip' ? 'sip' : 'lumpsum') : undefined),
      interest_rate: interestRate ? parseFloat(interestRate) : undefined,
      maturity_date: maturityDate || undefined,
      member_id: primaryMemberId,
      joint_member_ids: jointMemberIds.length > 0 ? jointMemberIds : undefined,
      label: assetLabel || (assetSymbol ? assetSymbol + ' Asset' : 'New Asset'),
      symbol: assetSymbol ? assetSymbol.toUpperCase() : undefined,
      quantity: qty || undefined,
      purchase_price: buyPrice || undefined,
      value: computedVal,
      color: assetCat === 'liquid' ? '#4C7A5E' : '#B98B2A'
    });

    setIsAddAssetOpen(false);
    setSelectedAsset(null);
    setAssetLabel('');
    setAssetSymbol('');
    setAssetQty('');
    setAssetBuyPrice('');
    setAssetLivePrice(0);
    setAssetVal('');
    setInterestRate('');
    setMaturityDate('');
    setJointMemberIds([]);

    try { confetti({ particleCount: 50, spread: 50 }); } catch (e) {}
  };

  // Selected Member Object
  const selectedMemberObj = members.find(m => m.id === memberFilter);

  // Filter regular assets for selected tab and member
  const filteredAssets = assets.filter((a) => {
    if (activeTab !== 'all' && a.category !== activeTab) return false;
    if (memberFilter !== 'all') {
      const isPrimary = a.member_id === memberFilter;
      const isJoint = a.joint_member_ids && a.joint_member_ids.includes(memberFilter);
      if (!isPrimary && !isJoint) return false;
    }
    return true;
  });

  // Filter Rental Properties belonging to selected member
  const memberRentalProperties = memberFilter === 'all'
    ? (rentalProperties || [])
    : (rentalProperties || []).filter(p => 
        p.owner_member_id === memberFilter || 
        p.member_id === memberFilter || 
        (selectedMemberObj && (p.owner_member_name?.toLowerCase() === selectedMemberObj.name.toLowerCase() || p.landlord_name?.toLowerCase() === selectedMemberObj.name.toLowerCase()))
      );

  // Member Rental Valuation
  const memberRentalValuation = memberRentalProperties.reduce(
    (sum, p) => sum + Number(p.estimated_market_value || p.purchase_price || 0), 
    0
  );

  // Member Individual Wealth Breakdown
  const selectedMemberLiquidWealth = assets
    .filter(a => (memberFilter === 'all' ? true : (a.member_id === memberFilter || a.joint_member_ids?.includes(memberFilter))) && a.category === 'liquid')
    .reduce((sum, a) => sum + Number(a.value || 0), 0);

  const selectedMemberFixedWealth = assets
    .filter(a => (memberFilter === 'all' ? true : (a.member_id === memberFilter || a.joint_member_ids?.includes(memberFilter))) && a.category === 'fixed')
    .reduce((sum, a) => sum + Number(a.value || 0), 0) + (memberFilter === 'all' ? totalRentalPropertiesValuation : memberRentalValuation);

  const selectedMemberTotalNetWorth = selectedMemberLiquidWealth + selectedMemberFixedWealth;

  // Monthly Rental Revenue & Diversion Calculations for Member
  const memberGrossMonthlyRent = memberRentalProperties.reduce(
    (sum, p) => sum + Number(p.monthly_target_revenue || 0), 
    0
  );

  // Outgoing Rent Diversions (from this member's properties to other family members)
  let memberDivertedOut = 0;
  const outgoingDiversions: { propertyTitle: string; toName: string; amount: number; purpose: string }[] = [];
  memberRentalProperties.forEach(p => {
    (p.rent_diversions || []).filter(r => r.is_active).forEach(r => {
      const amt = r.split_type === 'percentage'
        ? Math.round(((p.monthly_target_revenue || 0) * r.split_value) / 100)
        : Number(r.split_value || 0);
      memberDivertedOut += amt;
      outgoingDiversions.push({
        propertyTitle: p.title,
        toName: r.target_member_name,
        amount: amt,
        purpose: r.purpose
      });
    });
  });

  // Incoming Rent Diversions (from other members' properties to this member)
  let memberDivertedIn = 0;
  const incomingDiversions: { propertyTitle: string; fromName: string; amount: number; purpose: string }[] = [];
  if (memberFilter !== 'all') {
    (rentalProperties || [])
      .filter(p => p.owner_member_id !== memberFilter && p.member_id !== memberFilter)
      .forEach(p => {
        (p.rent_diversions || []).filter(r => r.is_active && r.target_member_id === memberFilter).forEach(r => {
          const amt = r.split_type === 'percentage'
            ? Math.round(((p.monthly_target_revenue || 0) * r.split_value) / 100)
            : Number(r.split_value || 0);
          memberDivertedIn += amt;
          incomingDiversions.push({
            propertyTitle: p.title,
            fromName: p.owner_member_name || p.landlord_name || 'Family Member',
            amount: amt,
            purpose: r.purpose
          });
        });
      });
  }

  const memberNetMonthlyRent = Math.max(0, memberGrossMonthlyRent - memberDivertedOut) + memberDivertedIn;

  // Calculate Total Portfolio Investment & Live Profit
  let totalInvestedAll = 0;
  let totalProfitAll = 0;
  assets.forEach(a => {
    if (a.quantity && a.purchase_price) {
      const invested = a.quantity * a.purchase_price;
      const profit = a.value - invested;
      totalInvestedAll += invested;
      totalProfitAll += profit;
    }
  });

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-12">
      <ScreenHeader
        title="Wealth & Net Worth"
        subtitle="Liquid vs Fixed, Joint FD/RD, Live Shares, Gold & Mutual Funds"
        action={
          <button
            type="button"
            onClick={() => setIsAddAssetOpen(true)}
            className="w-8 h-8 rounded-full bg-navy text-paper flex items-center justify-center shadow hover:bg-navy-light transition-all"
            title="Add New Asset"
          >
            <Plus size={16} />
          </button>
        }
      />

      {/* Main Total Wealth Card with Dynamic Member-Wise Breakdown */}
      <div className="px-4">
        <div className="p-5 rounded-3xl bg-navy text-paper shadow-xl border border-navy-light/60 space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold text-gold-soft tracking-wider block">
                  {memberFilter === 'all' ? 'Total Family Net Worth' : `👤 ${selectedMemberObj?.name || 'Member'} Ki Net Worth`}
                </span>
                {memberFilter !== 'all' && selectedMemberObj && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-gold/20 text-gold-soft font-bold border border-gold/30">
                    {selectedMemberObj.relationship || selectedMemberObj.role}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-2xl font-serif text-gold-soft font-bold">₹</span>
                <Mono className="text-2xl font-bold tracking-tight">
                  {Math.round(memberFilter === 'all' ? combinedTotalWealth : selectedMemberTotalNetWorth).toLocaleString('en-IN')}
                </Mono>
              </div>
            </div>

            <button
              onClick={handleSyncMarketRates}
              disabled={isSyncing}
              className="px-2.5 py-1 rounded-full bg-paper/15 hover:bg-paper/25 text-paper text-xs flex items-center gap-1.5 transition-all"
              title="Sync latest live market prices"
            >
              <RefreshCw size={12} className={isSyncing ? 'animate-spin text-gold' : ''} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Rates'}</span>
            </button>
          </div>

          {/* Liquid vs Fixed Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2 border-t border-paper/10 text-xs">
            <div>
              <span className="text-[10px] text-paper-muted block">💧 Liquid (Cash/FD/MF)</span>
              <Mono className="font-bold text-paper text-sm">
                ₹{Math.round(memberFilter === 'all' ? liquidWealth : selectedMemberLiquidWealth).toLocaleString('en-IN')}
              </Mono>
            </div>
            <div>
              <span className="text-[10px] text-paper-muted block">🏛️ Fixed & Real Estate</span>
              <Mono className="font-bold text-gold-soft text-sm">
                ₹{Math.round(memberFilter === 'all' ? combinedFixedWealth : selectedMemberFixedWealth).toLocaleString('en-IN')}
              </Mono>
              {memberRentalValuation > 0 && (
                <span className="text-[9px] text-emerald-300 block">
                  (₹{Math.round(memberFilter === 'all' ? totalRentalPropertiesValuation : memberRentalValuation).toLocaleString('en-IN')} Properties)
                </span>
              )}
            </div>

            {/* Monthly Rental Income Card */}
            {(memberGrossMonthlyRent > 0 || memberDivertedIn > 0) && (
              <div className="col-span-2 md:col-span-1 pt-1 md:pt-0 border-t md:border-t-0 border-paper/10">
                <span className="text-[10px] text-paper-muted block">💰 Monthly Net Rent</span>
                <Mono className="font-bold text-emerald-400 text-sm">
                  ₹{Math.round(memberFilter === 'all' ? memberGrossMonthlyRent : memberNetMonthlyRent).toLocaleString('en-IN')} / mo
                </Mono>
                {memberFilter !== 'all' && (memberDivertedOut > 0 || memberDivertedIn > 0) && (
                  <span className="text-[9px] text-paper-muted block">
                    {memberDivertedOut > 0 ? `-₹${memberDivertedOut} Bheja ` : ''}
                    {memberDivertedIn > 0 ? `+₹${memberDivertedIn} Mila` : ''}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center text-[10px] text-paper-muted pt-1 border-t border-paper/10">
            <span>Market Data: {marketRates.lastSyncTime}</span>
            {totalProfitAll !== 0 && (
              <span className="text-green font-bold flex items-center gap-0.5">
                <ArrowUpRight size={10} /> +₹{Math.round(totalProfitAll).toLocaleString('en-IN')} Overall P&L
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Link Banner to Bank Loans & EMI Split Hub */}
      <div className="px-4">
        <Link 
          href="/loans" 
          className="p-3 bg-paper rounded-2xl border border-gold/30 hover:border-gold flex items-center justify-between shadow-sm transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gold/15 text-gold-dark flex items-center justify-center shrink-0">
              <Landmark size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ink flex items-center gap-1.5">
                Bank Loans & Family Split Hub
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-navy text-paper font-semibold">New</span>
              </h4>
              <p className="text-[10px] text-ink-muted">Home/Car loan split, member-wise EMI aur interest hike recalculator</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-gold-dark group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Link Banner to Rentals & Properties Portfolio */}
      <div className="px-4">
        <Link 
          href="/rentals" 
          className="p-3 bg-paper rounded-2xl border border-emerald-500/30 hover:border-emerald-500 flex items-center justify-between shadow-sm transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center shrink-0">
              <Building2 size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ink flex items-center gap-1.5">
                Rental Properties & Real Estate Portfolio
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-600 text-paper font-semibold">{rentalProperties.length} Properties</span>
              </h4>
              <p className="text-[10px] text-ink-muted">
                Valuation: <strong className="text-ink">₹{totalRentalPropertiesValuation.toLocaleString('en-IN')}</strong> · Dukan, Makan, Kiraya & Badhotri
              </p>
            </div>
          </div>
          <ArrowRight size={16} className="text-emerald-700 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Member Filter Bar */}
      <div className="px-4 space-y-1">
        <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block">
          Filter by Family Member (Individual & Joint Holdings):
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setMemberFilter('all')}
            className={'text-xs px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap ' + (memberFilter === 'all' ? 'bg-navy text-paper shadow-sm' : 'bg-paper border border-paper-dim text-ink-muted hover:text-ink')}
          >
            Sabhi Sadasya
          </button>
          {members.map(m => (
            <button
              key={m.id}
              onClick={() => setMemberFilter(m.id)}
              className={'text-xs px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap flex items-center gap-1 ' + (memberFilter === m.id ? 'bg-navy text-paper shadow-sm' : 'bg-paper border border-paper-dim text-ink-muted hover:text-ink')}
            >
              <span>{m.name}</span>
              <span className="text-[9px] opacity-70">({m.role})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-4 flex gap-2">
        {[
          { key: 'all', label: 'Sabhi Sampatti (All)' },
          { key: 'liquid', label: '💧 Liquid (Cash/FD/MF)' },
          { key: 'fixed', label: '🏛️ Fixed (Gold/Plot)' }
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={'text-xs px-3 py-1.5 rounded-xl font-medium transition-all ' + (activeTab === t.key ? 'bg-navy text-paper shadow-sm' : 'bg-paper text-ink-muted border border-paper-dim hover:text-ink')}
          >
            {t.label}
          </button>
        ))}
      </div>

      
      {/* Real Estate & Rental Properties Cards Section */}
      <div className="px-4 space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
              {memberFilter === 'all' ? 'Real Estate & Rental Properties' : `${selectedMemberObj?.name || 'Member'} Ki Properties & Rent`}
              <span className="ml-1.5 text-[10px] font-mono px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                {memberRentalProperties.length} Properties
              </span>
            </h3>
          </div>
          <Link href="/rentals" className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-0.5">
            Rentals Hub <ArrowRight size={12} />
          </Link>
        </div>

        {memberRentalProperties.length === 0 ? (
          <div className="p-3 bg-paper rounded-2xl border border-dashed border-paper-dim text-center text-xs text-ink-muted">
            {memberFilter === 'all' 
              ? 'Abhi koi property add nahi hai. Rentals page se property add karein.' 
              : `${selectedMemberObj?.name || 'Is sadasya'} ke naam par koi property darj nahi hai. Neeche diye button se property owner badal sakte hain.`}
          </div>
        ) : (
          <div className="space-y-2.5">
            {memberRentalProperties.map(p => {
              const activeCount = p.tenants?.filter(t => t.tenant_status === 'active').length || 0;
              const diversions = p.rent_diversions || [];

              return (
                <div key={p.id} className="p-3.5 bg-paper rounded-2xl border border-emerald-500/30 hover:border-emerald-500 transition-all shadow-sm space-y-2.5">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0">
                        <Home size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs font-bold text-ink">{p.title}</h4>
                          <span className="text-[9px] px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-bold">
                            👤 Owner: {p.owner_member_name || p.landlord_name || 'Papa'}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 bg-paper-dim text-ink-muted rounded capitalize">
                            {p.property_type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-[10px] text-ink-muted mt-0.5">
                          📍 {p.address}, {p.city} · 👥 {activeCount} Kirayedaar
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-ink-muted block">Market Valuation:</span>
                      <Mono className="text-sm font-bold text-emerald-700 block">
                        ₹{(p.estimated_market_value || p.purchase_price || 0).toLocaleString('en-IN')}
                      </Mono>
                      <span className="text-[10px] font-bold text-ink-muted">
                        Rent: ₹{(p.monthly_target_revenue || 0).toLocaleString('en-IN')}/mo
                      </span>
                    </div>
                  </div>

                  {/* Rent Diversions / Batwara Badge if configured */}
                  {diversions.length > 0 && (
                    <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200/60 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                        <Split size={12} /> Kiraya Batwara / Diversion Rules:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {diversions.map(d => (
                          <span key={d.id} className="text-[9px] px-2 py-0.5 bg-paper rounded-md border border-emerald-300 font-semibold text-ink flex items-center gap-1">
                            <span>➡️ {d.target_member_name}:</span>
                            <strong className="text-emerald-700 font-mono">
                              {d.split_type === 'percentage' ? `${d.split_value}%` : `₹${d.split_value}`}
                            </strong>
                            <span className="text-ink-muted">({d.purpose})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions for Property: Change Owner, Rent Diversion, Open Rentals */}
                  <div className="flex items-center gap-2 pt-1 border-t border-paper-dim">
                    <button
                      type="button"
                      onClick={() => {
                        setDiversionPropModal(p);
                        setDivTargetMemberId(members.find(m => m.id !== p.owner_member_id)?.id || members[0]?.id || '');
                      }}
                      className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold rounded-lg transition flex items-center gap-1"
                    >
                      <Split size={12} />
                      <span>Rent Batwara / Divert</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setReassignPropModal(p);
                        setNewPropOwnerId(p.owner_member_id || members[0]?.id || '');
                      }}
                      className="px-2.5 py-1 bg-paper-dim hover:bg-paper-dim/80 text-ink text-[11px] font-bold rounded-lg transition flex items-center gap-1 border border-paper-dim"
                    >
                      <Users size={12} />
                      <span>Sadasya Badlein (Owner)</span>
                    </button>

                    <Link
                      href="/rentals"
                      className="px-2.5 py-1 bg-navy text-paper text-[11px] font-bold rounded-lg hover:bg-navy-light transition flex items-center gap-1 ml-auto"
                    >
                      <span>Khata Kholein</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Asset Items List with Live P&L Calculation & Joint Badges */}
      <div className="px-4 space-y-2.5">
        {filteredAssets.length === 0 ? (
          <div className="p-8 text-center bg-paper rounded-2xl border border-paper-dim">
            <Coins size={36} className="mx-auto text-ink-muted opacity-40 mb-2" />
            <p className="text-sm font-medium text-ink">Koi asset nahi mila</p>
            <p className="text-xs text-ink-muted mt-0.5">Naya asset jodne ke liye upar diye gaye &quot;+&quot; button par click karein.</p>
          </div>
        ) : (
          filteredAssets.map((asset) => {
            const isShareOrMF = asset.type === 'shares' || asset.type === 'mutual_funds';
            const isGold = asset.type === 'gold';
            const isLiquid = asset.category === 'liquid';
            const isBankDeposit = asset.type === 'bank_deposit';

            const primaryMember = members.find(m => m.id === asset.member_id);
            const jointMembers = members.filter(m => asset.joint_member_ids?.includes(m.id));

            const hasPnl = isShareOrMF && asset.quantity && asset.purchase_price;
            const investedAmt = hasPnl ? asset.quantity! * asset.purchase_price! : 0;
            const pnlAmt = hasPnl ? asset.value - investedAmt : 0;
            const pnlPercent = hasPnl && investedAmt > 0 ? (pnlAmt / investedAmt) * 100 : 0;
            const isProfitable = pnlAmt >= 0;

            return (
              <div
                key={asset.id}
                className="p-3.5 bg-paper rounded-2xl border border-paper-dim shadow-sm flex items-center justify-between hover:border-gold/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ' + (isLiquid ? 'bg-green/10 text-green' : 'bg-gold/10 text-gold')}>
                    {isGold ? <Coins size={18} /> : isShareOrMF ? <TrendingUp size={18} /> : <Landmark size={18} />}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs font-bold text-ink">{asset.label}</h4>
                      
                      {/* Joint vs Single Member Badge */}
                      {jointMembers.length > 0 ? (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold border border-purple-200 flex items-center gap-0.5">
                          <Users size={10} /> Joint: {primaryMember?.name || 'Papa'} & {jointMembers.map(j => j.name).join(', ')}
                        </span>
                      ) : primaryMember ? (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-paper-dim text-ink-muted font-medium">
                          {primaryMember.name}
                        </span>
                      ) : null}

                      {/* FD / RD / SIP Subtype badge */}
                      {asset.asset_subtype && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold uppercase">
                          {asset.asset_subtype === 'fd' ? 'Fixed Deposit (FD)' :
                           asset.asset_subtype === 'rd' ? 'Recurring Deposit (RD)' :
                           asset.asset_subtype === 'sip' ? 'SIP' : asset.asset_subtype}
                          {asset.interest_rate ? ` · ${asset.interest_rate}%` : ''}
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] text-ink-muted space-x-1.5">
                      {hasPnl ? (
                        <span>
                          Invested: <strong className="text-ink">₹{Math.round(investedAmt).toLocaleString('en-IN')}</strong> ({asset.quantity} {asset.type === 'shares' ? 'shares' : 'units'} @ ₹{asset.purchase_price})
                        </span>
                      ) : isGold && asset.quantity ? (
                        <span>{asset.quantity} grams (24K Gold Locker)</span>
                      ) : isBankDeposit ? (
                        <span>
                          {asset.institution || 'Bank'} 
                          {asset.interest_rate ? ` · ${asset.interest_rate}% p.a. interest` : ''}
                          {asset.maturity_date ? ` · Maturity: ${asset.maturity_date}` : ''}
                        </span>
                      ) : (
                        <span className="capitalize">{asset.category} Wealth · Verified</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                  <div>
                    <Mono className="text-sm font-bold text-ink block">
                      ₹{Math.round(asset.value).toLocaleString('en-IN')}
                    </Mono>
                    {hasPnl ? (
                      <span className={'text-[9px] font-bold flex items-center justify-end gap-0.5 ' + (isProfitable ? 'text-green' : 'text-coral')}>
                        {isProfitable ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                        {isProfitable ? '+' : ''}₹{Math.round(pnlAmt).toLocaleString('en-IN')} ({pnlPercent.toFixed(1)}%)
                      </span>
                    ) : (
                      <span className="text-[9px] text-ink-muted uppercase font-bold">{asset.category}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 mt-0.5">
                    <button
                      type="button"
                      onClick={() => openEditAssetModal(asset)}
                      className="p-1 rounded-md bg-paper-dim hover:bg-gold/20 text-ink-muted hover:text-gold-dark transition"
                      title="Asset Ka Malik / Sadasya Badlein ya Edit Karein"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAssetClick(asset.id, asset.label)}
                      className="p-1 rounded-md bg-paper-dim hover:bg-rose-100 text-ink-muted hover:text-rose-600 transition"
                      title="Asset Delete Karein"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      
      {/* MODAL: EDIT ASSET & REASSIGN OWNER MEMBER */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-paper-dim pb-2">
              <div>
                <h3 className="text-sm font-bold font-serif text-ink">Asset Edit Karein & Malik Badlein</h3>
                <p className="text-[10px] text-ink-muted">Family member ke hisab se sampatti ka naam aur malik chunein</p>
              </div>
              <button onClick={() => setEditingAsset(null)} className="text-ink-muted hover:text-ink text-xs font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveEditedAsset} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Asset Ka Naam (Label)</label>
                <input
                  type="text"
                  value={editAssetLabel}
                  onChange={(e) => setEditAssetLabel(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Asset Ki Kimat (Valuation ₹)</label>
                <input
                  type="number"
                  value={editAssetVal}
                  onChange={(e) => setEditAssetVal(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                  👤 Sampatti Kis Sadasya Ke Naam Hai? (Primary Owner)
                </label>
                <select
                  value={editAssetMemberId}
                  onChange={(e) => setEditAssetMemberId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-bold text-ink"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.relationship || m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Asset Category</label>
                <select
                  value={editAssetCategory}
                  onChange={(e) => setEditAssetCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-bold text-ink"
                >
                  <option value="liquid">💧 Liquid Asset (Cash / Bank / FD / MF / Share)</option>
                  <option value="fixed">🏛️ Fixed Asset (Gold / Plot / Makan / Gaadi)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2 border-t border-paper-dim">
                <Button type="button" variant="outline" size="sm" onClick={() => setEditingAsset(null)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1 bg-navy text-paper font-bold">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CHANGE PROPERTY OWNER QUICK REASSIGN */}
      {reassignPropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-paper-dim pb-2">
              <div>
                <h3 className="text-sm font-bold font-serif text-ink">Property Ka Malik (Owner) Badlein</h3>
                <p className="text-[10px] text-ink-muted">{reassignPropModal.title}</p>
              </div>
              <button onClick={() => setReassignPropModal(null)} className="text-ink-muted hover:text-ink text-xs font-bold">✕</button>
            </div>

            <form onSubmit={handleReassignPropertyOwner} className="space-y-4">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-ink space-y-1">
                <div>Property: <strong>{reassignPropModal.title}</strong></div>
                <div>Valuation: <strong>₹{(reassignPropModal.estimated_market_value || reassignPropModal.purchase_price || 0).toLocaleString('en-IN')}</strong></div>
                <div>Monthly Rent: <strong>₹{(reassignPropModal.monthly_target_revenue || 0).toLocaleString('en-IN')}/mo</strong></div>
                <div>Abhi Kiske Naam: <span className="font-bold text-purple-700">{reassignPropModal.owner_member_name || 'Papa'}</span></div>
              </div>

              <div>
                <label className="text-xs font-bold text-ink block mb-1">
                  Naya Malik Chunein (Family Member):
                </label>
                <select
                  value={newPropOwnerId}
                  onChange={(e) => setNewPropOwnerId(e.target.value)}
                  className="w-full p-2.5 bg-paper-dim border border-paper-dim rounded-xl font-bold text-xs"
                  required
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.relationship || m.role})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-ink-muted mt-1">
                  Owner badalte hi yeh property aur iska kiraya turant us sadasya ke wealth profile me shift ho jayega.
                </p>
              </div>

              <div className="flex gap-2 pt-2 border-t border-paper-dim">
                <Button type="button" variant="outline" size="sm" onClick={() => setReassignPropModal(null)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1 bg-navy text-paper font-bold">
                  Malik Update Karein
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RENT DIVERSION / BATWARA */}
      {diversionPropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-paper-dim pb-2">
              <div>
                <h3 className="text-sm font-bold font-serif text-ink flex items-center gap-1.5">
                  <Split size={16} className="text-emerald-700" />
                  Kiraya Batwara / Rent Diversion System
                </h3>
                <p className="text-[10px] text-ink-muted">
                  {diversionPropModal.title} (Owner: {diversionPropModal.owner_member_name || 'Papa'})
                </p>
              </div>
              <button onClick={() => setDiversionPropModal(null)} className="text-ink-muted hover:text-ink text-xs font-bold">✕</button>
            </div>

            {/* Existing Diversions List */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-ink">Active Batwara Rules:</span>
                <span className="text-[11px] font-bold text-emerald-700 font-mono">
                  Kul Kiraya: ₹{(diversionPropModal.monthly_target_revenue || 0).toLocaleString('en-IN')}/mo
                </span>
              </div>

              {(diversionPropModal.rent_diversions || []).length === 0 ? (
                <div className="p-3 bg-paper-dim rounded-xl text-center text-xs text-ink-muted">
                  Abhi koi diversion rule nahi hai. Sara kiraya owner ({diversionPropModal.owner_member_name || 'Papa'}) ke account me rehta hai.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {(diversionPropModal.rent_diversions || []).map((div: any) => {
                    const calcAmount = div.split_type === 'percentage'
                      ? Math.round(((diversionPropModal.monthly_target_revenue || 0) * div.split_value) / 100)
                      : div.split_value;

                    return (
                      <div key={div.id} className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 space-y-2 text-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-ink">➡️ {div.target_member_name}</span>
                              <span className="px-1.5 py-0.2 bg-emerald-200 text-emerald-900 rounded font-bold font-mono text-[10px]">
                                ₹{calcAmount.toLocaleString('en-IN')} {div.split_type === 'percentage' ? `(${div.split_value}%)` : ''}
                              </span>
                              {div.allocation_target === 'fd_rd_investment' && (
                                <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded font-bold text-[9px]">
                                  🏦 FD/RD Link: {div.linked_asset_name || 'Rent RD Deposit'}
                                </span>
                              )}
                              {div.allocation_target === 'ghar_ration_expense' && (
                                <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-bold text-[9px]">
                                  🛒 Ration / Kirana Entry
                                </span>
                              )}
                              {div.allocation_target === 'staff_payment' && (
                                <span className="px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded font-bold text-[9px]">
                                  👨‍🍳 Staff Salary: {div.linked_staff_name || 'Household Staff'}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-ink-muted mt-0.5">
                              Uddeshya: <strong>{div.purpose}</strong> · Mode: {div.payment_mode || 'Bank Transfer'}
                            </p>
                            {div.last_executed_date && (
                              <p className="text-[9px] text-emerald-700 font-bold mt-0.5">
                                ✅ Pichli Baar Jama: {div.last_executed_date} ko ₹{(div.last_executed_amount || calcAmount).toLocaleString('en-IN')}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteRentDiversion(diversionPropModal.id, div.id)}
                            className="p-1.5 bg-paper rounded-lg text-rose-600 hover:bg-rose-100 transition"
                            title="Rule Hatayein"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        {/* Execute Now Action Button */}
                        <div className="pt-1.5 border-t border-emerald-200/60 flex justify-between items-center">
                          <span className="text-[10px] text-ink-muted">
                            Is mahine ka kiraya {div.allocation_target === 'fd_rd_investment' ? 'FD/RD me jama karein' : div.allocation_target === 'ghar_ration_expense' ? 'Ration kharch me jodein' : div.allocation_target === 'staff_payment' ? 'Staff salary me jodein' : 'sadasya ko bhejein'}:
                          </span>
                          <button
                            type="button"
                            onClick={() => handleExecuteDiversionInWealth(diversionPropModal.id, div.id)}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-paper text-[10px] font-bold rounded-lg transition shadow flex items-center gap-1"
                          >
                            <span>⚡ Fund Jama / Transfer Karein</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Add New Diversion Rule Form */}
            <form onSubmit={handleAddDiversionRule} className="p-3 bg-paper-dim/60 rounded-xl border border-paper-dim space-y-3">
              <span className="text-xs font-bold text-ink block">+ Naya Rent Diversion Rule Jodein:</span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-ink-muted uppercase block mb-1">🎯 Fund Kahan Kharch / Jama Hoga?</label>
                  <select
                    value={divAllocTarget}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setDivAllocTarget(val);
                      if (val === 'ghar_ration_expense') setDivPurpose('Ghar Ration & Kirana Kharcha');
                      if (val === 'fd_rd_investment') setDivPurpose('Monthly FD / RD Investment');
                      if (val === 'staff_payment') setDivPurpose('Household Staff Salary');
                    }}
                    className="w-full p-2 bg-paper border border-emerald-500/40 rounded-xl text-xs font-bold text-ink"
                  >
                    <option value="member_personal">👤 Sadasya Ka Personal Khata / Savings</option>
                    <option value="fd_rd_investment">🏦 Bank FD / RD (Fixed / Recurring Deposit Jama)</option>
                    <option value="ghar_ration_expense">🛒 Ghar Ration & Groceries (राशन व घरेलू खर्च)</option>
                    <option value="staff_payment">👨‍🍳 Household Staff Salary (ड्राइवर, नौकर, बाई वेतन)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-ink-muted uppercase block mb-1">Kis Sadasya Ke Naam / Zariye?</label>
                  <select
                    value={divTargetMemberId}
                    onChange={(e) => setDivTargetMemberId(e.target.value)}
                    className="w-full p-2 bg-paper border border-paper-dim rounded-xl text-xs font-bold text-ink"
                    required
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.relationship || m.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Conditional Selector for FD/RD or Staff */}
              {divAllocTarget === 'fd_rd_investment' && (
                <div>
                  <label className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">🏦 Kaunse FD / RD Asset Me Jama Hoga?</label>
                  <select
                    value={divLinkedAssetId}
                    onChange={(e) => setDivLinkedAssetId(e.target.value)}
                    className="w-full p-2 bg-paper border border-emerald-500/50 rounded-xl text-xs font-bold text-ink"
                  >
                    <option value="">+ Nayi Rent RD Deposit Shuru Karein (Automatic Naya Asset Banega)</option>
                    {assets.filter(a => a.type === 'bank_deposit' || a.label.toLowerCase().includes('fd') || a.label.toLowerCase().includes('rd')).map(a => (
                      <option key={a.id} value={a.id}>
                        {a.label} (Current Value: ₹{Math.round(a.value).toLocaleString('en-IN')})
                      </option>
                    ))}
                  </select>
                  <span className="text-[9px] text-ink-muted mt-0.5 block">
                    Kiraye ka paisa is FD/RD me judega aur Wealth / Net Worth me automatic badhega.
                  </span>
                </div>
              )}

              {divAllocTarget === 'staff_payment' && (
                <div>
                  <label className="text-[10px] font-bold text-purple-800 uppercase block mb-1">👨‍🍳 Kis Staff Worker Ko Salary Denge?</label>
                  <select
                    value={divLinkedStaffId}
                    onChange={(e) => setDivLinkedStaffId(e.target.value)}
                    className="w-full p-2 bg-paper border border-purple-500/50 rounded-xl text-xs font-bold text-ink"
                    required
                  >
                    <option value="">Staff Worker Chunein...</option>
                    {(staff || []).map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role}) · Monthly Salary: ₹{s.monthly_salary.toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                  <span className="text-[9px] text-ink-muted mt-0.5 block">
                    Kiraye ka yeh hissa Staff management (/staff) me salary payment ke roop me darj ho jayega.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-ink-muted uppercase block mb-1">Batwara Ka Madhyam</label>
                  <select
                    value={divSplitType}
                    onChange={(e) => setDivSplitType(e.target.value as any)}
                    className="w-full p-2 bg-paper border border-paper-dim rounded-xl text-xs font-bold text-ink"
                  >
                    <option value="fixed_amount">₹ Fixed Amount (e.g. ₹5,000)</option>
                    <option value="percentage">% Percentage Share (e.g. 40%)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-ink-muted uppercase block mb-1">
                    {divSplitType === 'percentage' ? 'Kitna % Hissa?' : 'Kitna Fixed ₹ Hissa?'}
                  </label>
                  <input
                    type="number"
                    value={divSplitValue === 0 ? '' : divSplitValue}
                    onChange={(e) => setDivSplitValue(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-full p-2 bg-paper border border-paper-dim rounded-xl text-xs font-bold font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-ink-muted uppercase block mb-1">
                    {divSplitType === 'percentage' ? 'Kitna % Hissa?' : 'Kitna Fixed ₹ Hissa?'}
                  </label>
                  <input
                    type="number"
                    value={divSplitValue === 0 ? '' : divSplitValue}
                    onChange={(e) => setDivSplitValue(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-full p-2 bg-paper border border-paper-dim rounded-xl text-xs font-bold font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-ink-muted uppercase block mb-1">Uddeshya (Purpose)</label>
                  <input
                    type="text"
                    value={divPurpose}
                    onChange={(e) => setDivPurpose(e.target.value)}
                    placeholder="e.g. Ghar Kharcha, Padhai, SIP, EMI"
                    className="w-full p-2 bg-paper border border-paper-dim rounded-xl text-xs font-bold"
                    required
                  />
                </div>
              </div>

              {/* Preview Box */}
              <div className="p-2.5 bg-paper rounded-xl border border-paper-dim text-[11px] space-y-1">
                <div className="flex justify-between text-ink-muted">
                  <span>Kiraya: <strong>₹{(diversionPropModal.monthly_target_revenue || 0).toLocaleString('en-IN')}</strong></span>
                  <span>
                    Divert Amount: <strong className="text-emerald-700">
                      ₹{divSplitType === 'percentage' 
                        ? Math.round(((diversionPropModal.monthly_target_revenue || 0) * (divSplitValue || 0)) / 100).toLocaleString('en-IN') 
                        : (divSplitValue || 0).toLocaleString('en-IN')}
                    </strong>
                  </span>
                </div>
              </div>

              <Button type="submit" size="sm" className="w-full bg-emerald-700 hover:bg-emerald-800 text-paper font-bold">
                + Yeh Diversion Rule Save Karein
              </Button>
            </form>

            <div className="pt-2 border-t border-paper-dim text-right">
              <Button type="button" variant="outline" size="sm" onClick={() => setDiversionPropModal(null)}>
                Theek Hai / Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Asset Modal with Joint Holder Selector & Real-time Autocomplete */}
      {isAddAssetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-3 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-paper-dim pb-2">
              <h3 className="text-sm font-bold font-serif text-ink">Naya Asset / FD / RD / SIP Jodein</h3>
              <button
                onClick={() => setIsAddAssetOpen(false)}
                className="text-ink-muted hover:text-ink text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Smart Search Bar with Instant Autocomplete */}
            <div className="relative">
              <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                🔍 Search Stock ya Mutual Fund (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Tata, Reliance, Parag Parikh, Quant, HDFC, SBI..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 pl-8 text-xs bg-paper-dim border border-paper-dim rounded-xl focus:outline-none focus:border-gold"
                />
                <Search size={14} className="absolute left-2.5 top-2.5 text-ink-muted" />
                {isSearching && (
                  <RefreshCw size={12} className="absolute right-2.5 top-2.5 animate-spin text-gold" />
                )}
              </div>

              {/* Autocomplete Dropdown List */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-paper border border-paper-dim rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto divide-y divide-paper-dim">
                  {searchResults.map((item) => (
                    <button
                      key={item.symbol + item.name}
                      type="button"
                      onClick={() => handleSelectSearchResult(item)}
                      className="w-full p-2 text-left text-xs hover:bg-gold/10 flex items-center justify-between transition-all"
                    >
                      <div className="pr-2">
                        <span className="font-bold text-ink block text-[11px] leading-tight">{item.name}</span>
                        <span className="text-[9px] font-mono text-ink-muted uppercase">{item.symbol} · {item.exchange}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold font-mono text-green text-[11px] block">₹{item.price}</span>
                        <span className="text-[8px] text-ink-muted uppercase">{item.type.replace('_', ' ')}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedAsset && (
              <div className="p-2.5 bg-green/10 border border-green/20 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-bold text-green flex items-center gap-1">
                    <CheckCircle2 size={12} /> Selected: {selectedAsset.name}
                  </span>
                  <span className="text-[9px] text-ink-muted font-mono">Live Rate / NAV: ₹{selectedAsset.price} ({selectedAsset.exchange})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAsset(null)}
                  className="text-[10px] text-coral font-bold"
                >
                  Change
                </button>
              </div>
            )}

            <form onSubmit={handleAddAssetSubmit} className="space-y-3 pt-1">
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Asset Category</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setAssetCat('liquid'); setAssetType('bank_deposit'); }}
                    className={'py-1.5 text-xs font-bold rounded-xl border ' + (assetCat === 'liquid' ? 'bg-green text-white border-green' : 'bg-paper text-ink-muted border-paper-dim')}
                  >
                    💧 Liquid (Bank FD / RD / MF / Shares)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAssetCat('fixed'); setAssetType('gold'); }}
                    className={'py-1.5 text-xs font-bold rounded-xl border ' + (assetCat === 'fixed' ? 'bg-gold text-white border-gold' : 'bg-paper text-ink-muted border-paper-dim')}
                  >
                    🏛️ Fixed (Gold / Land / Property)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Asset Type</label>
                <select
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-medium"
                >
                  <option value="bank_deposit">Bank Deposit (FD / RD / Savings)</option>
                  <option value="mutual_funds">Mutual Fund (SIP / Lumpsum)</option>
                  <option value="shares">Stock / Shares (NSE/BSE)</option>
                  <option value="gold">Gold & Silver (Jewellery / SGB / Coins)</option>
                  <option value="land">Plot / Agricultural Land</option>
                  <option value="property">House / Commercial Property</option>
                </select>
              </div>

              {/* Bank Deposit Sub-type (FD vs RD vs Savings) */}
              {assetType === 'bank_deposit' && (
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                  <label className="text-[10px] font-bold uppercase text-blue-900 block">
                    Deposit Ka Prakar (FD / RD)
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: 'fd', label: 'Fixed Deposit (FD)' },
                      { id: 'rd', label: 'Recurring (RD)' },
                      { id: 'savings', label: 'Savings A/C' },
                    ].map(sub => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setDepositSubtype(sub.id as any)}
                        className={'py-1.5 text-[11px] font-semibold rounded-lg border text-center transition-all ' + (depositSubtype === sub.id ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-ink-muted border-blue-100')}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-[9px] font-bold uppercase text-blue-900 block mb-1">
                        Byaj Dar (% Interest Rate)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 7.25"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-blue-200 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold uppercase text-blue-900 block mb-1">
                        Maturity Tareekh (Optional)
                      </label>
                      <input
                        type="date"
                        value={maturityDate}
                        onChange={(e) => setMaturityDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-blue-200 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Primary Member & Joint Holders Selection */}
              <div className="p-3 bg-paper-dim/60 border border-paper-dim rounded-2xl space-y-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                    Primary Holder (Kiske Naam Par Hai?) *
                  </label>
                  <select
                    value={primaryMemberId}
                    onChange={(e) => setPrimaryMemberId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper border border-paper-dim rounded-xl font-medium"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold uppercase text-ink-muted">
                      👥 Joint Co-Holders (Multiple Sadasya Jodein)
                    </label>
                    <span className="text-[9px] text-ink-muted">Optional</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {members
                      .filter(m => m.id !== primaryMemberId)
                      .map(m => {
                        const isSelected = jointMemberIds.includes(m.id);
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => toggleJointMember(m.id)}
                            className={'text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ' + (isSelected ? 'bg-navy text-paper border-navy shadow-sm' : 'bg-paper text-ink-muted border-paper-dim')}
                          >
                            {isSelected ? '✓ ' : '+ '}{m.name}
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Special SIP Calculator Mode for Mutual Funds */}
              {assetType === 'mutual_funds' && (
                <div className="p-3 bg-gold/10 border border-gold/20 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-ink flex items-center gap-1">
                      <Calculator size={14} className="text-gold" /> SIP Mode Se Jodein
                    </span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setMfMode('sip')}
                        className={'px-2 py-0.5 rounded-lg text-[10px] font-bold ' + (mfMode === 'sip' ? 'bg-navy text-paper' : 'bg-paper text-ink-muted')}
                      >
                        Monthly SIP
                      </button>
                      <button
                        type="button"
                        onClick={() => setMfMode('units')}
                        className={'px-2 py-0.5 rounded-lg text-[10px] font-bold ' + (mfMode === 'units' ? 'bg-navy text-paper' : 'bg-paper text-ink-muted')}
                      >
                        Direct Units
                      </button>
                    </div>
                  </div>

                  {mfMode === 'sip' ? (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[9px] font-bold uppercase text-ink-muted block mb-1">
                          Har Mahine Ki SIP (₹)
                        </label>
                        <input
                          type="number"
                          value={sipMonthlyAmount}
                          onChange={(e) => {
                            setSipMonthlyAmount(e.target.value);
                            calculateSipValue(e.target.value, sipMonthsCount, assetLivePrice || 89.57);
                          }}
                          className="w-full px-2 py-1.5 bg-paper rounded-lg border border-paper-dim font-mono font-bold"
                          placeholder="5000"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold uppercase text-ink-muted block mb-1">
                          Kitne Mahine Ho Gaye?
                        </label>
                        <input
                          type="number"
                          value={sipMonthsCount}
                          onChange={(e) => {
                            setSipMonthsCount(e.target.value);
                            calculateSipValue(sipMonthlyAmount, e.target.value, assetLivePrice || 89.57);
                          }}
                          className="w-full px-2 py-1.5 bg-paper rounded-lg border border-paper-dim font-mono font-bold"
                          placeholder="12"
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Asset Name / Title *</label>
                <input
                  type="text"
                  placeholder="e.g. SBI 3-Year Joint FD, Parag Parikh Flexi Cap, Gold Locker"
                  value={assetLabel}
                  onChange={(e) => setAssetLabel(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  required
                />
              </div>

              {/* Total Value Input */}
              {(assetType === 'bank_deposit' || assetType === 'land' || assetType === 'property') && (
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Kul Raqam (Total Value ₹) *</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={assetVal}
                    onChange={(e) => setAssetVal(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-paper-dim border border-paper-dim rounded-xl font-mono font-bold"
                    required
                  />
                </div>
              )}

              {/* Quantity and Buy Price Inputs (For Shares or Manual Units) */}
              {(assetType === 'shares' || (assetType === 'mutual_funds' && mfMode === 'units')) && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-bold uppercase text-ink-muted block mb-1">
                      {assetType === 'shares' ? 'Quantity (Shares)' : 'Total Units'}
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 50"
                      value={assetQty}
                      onChange={(e) => handleQtyChange(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs bg-paper-dim border border-paper-dim rounded-lg font-mono font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase text-ink-muted block mb-1">
                      Buy Price / Rate (₹)
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 800"
                      value={assetBuyPrice}
                      onChange={(e) => setAssetBuyPrice(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs bg-paper-dim border border-paper-dim rounded-lg font-mono"
                    />
                  </div>
                </div>
              )}

              {assetType === 'gold' && (
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Gold Weight (Grams me)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 50 (grams)"
                    value={assetQty}
                    onChange={(e) => handleQtyChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-mono"
                    required
                  />
                  <span className="text-[10px] text-gold mt-1 block">Live 24K Benchmark: ₹{marketRates.gold_24k_per_g}/gram</span>
                </div>
              )}

              {/* Auto Calculated Live Summary Preview Card */}
              <div className="p-2.5 bg-paper-dim/80 rounded-xl border border-paper-dim space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-ink-muted text-[10px]">Total Invested:</span>
                  <span className="font-mono font-bold text-ink">
                    ₹{Math.round((parseFloat(assetQty) || 0) * (parseFloat(assetBuyPrice) || 0) || (parseFloat(sipMonthlyAmount) * parseFloat(sipMonthsCount)) || (parseFloat(assetVal) || 0)).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-muted text-[10px]">Current Market Value:</span>
                  <span className="font-mono font-bold text-ink text-sm">
                    ₹{Math.round(parseFloat(assetVal) || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                {parseFloat(assetVal) > 0 && assetType !== 'bank_deposit' && (
                  <div className="flex justify-between items-center pt-1 border-t border-paper-dim text-[10px]">
                    <span className="font-bold text-ink">Live Profit / Loss (P&L):</span>
                    <span className="font-bold font-mono text-green flex items-center">
                      <ArrowUpRight size={12} />
                      +₹{Math.round(
                        (parseFloat(assetVal) || 0) -
                        ((parseFloat(assetQty) || 0) * (parseFloat(assetBuyPrice) || 0) || (parseFloat(sipMonthlyAmount) * parseFloat(sipMonthsCount)) || 0)
                      ).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddAssetOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1 bg-navy text-paper">
                  Save Asset
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
