'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Mono } from '@/components/ui/Mono';
import { Button } from '@/components/ui/Button';
import { TrendingUp, RefreshCw, Plus, Sparkles, Coins, Landmark, ArrowUpRight, ArrowDownRight, Search, CheckCircle2, Calculator, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  price: number;
  exchange: string;
}

export default function WealthPage() {
  const { assets, totalWealth, liquidWealth, fixedWealth, addAsset } = useFamilyStore();
  const [activeTab, setActiveTab] = useState<'all' | 'liquid' | 'fixed'>('all');
  
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
      // Recalculate SIP default
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
    
    // Average compounding SIP return estimate (~15% annualized average for equity MF)
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
  };

  const filteredAssets = assets.filter((a) => {
    if (activeTab === 'all') return true;
    return a.category === activeTab;
  });

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
    <div className="space-y-4">
      <ScreenHeader
        title="Wealth & Net Worth"
        subtitle="Liquid vs Fixed Wealth, Live Shares, Gold & Mutual Funds"
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

      {/* Main Total Wealth Card with Total P&L */}
      <div className="px-4">
        <div className="p-5 rounded-3xl bg-navy text-paper shadow-xl border border-navy-light/60 space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-gold-soft tracking-wider block">
                Total Family Net Worth
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-2xl font-serif text-gold-soft font-bold">₹</span>
                <span className="text-3xl font-bold font-mono text-paper tracking-tight">
                  {totalWealth.toLocaleString('en-IN')}
                </span>
              </div>
              {totalProfitAll > 0 && (
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="px-2 py-0.5 rounded-full bg-green/20 text-green-300 font-bold text-[10px] flex items-center gap-0.5">
                    <ArrowUpRight size={11} /> +₹{Math.round(totalProfitAll).toLocaleString('en-IN')} Total Profit
                  </span>
                  <span className="text-[10px] text-paper/70 font-mono">
                    Invested: ₹{Math.round(totalInvestedAll).toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={handleSyncMarketRates}
              disabled={isSyncing}
              className="px-2.5 py-1 rounded-xl bg-navy-light border border-gold/30 text-gold-soft text-[10px] font-bold flex items-center gap-1.5 hover:bg-gold/20 transition-all"
              title="Sync Live Rates"
            >
              <RefreshCw size={12} className={isSyncing ? 'animate-spin text-gold' : ''} />
              {isSyncing ? 'Syncing...' : 'Live Sync'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-navy-light/50 text-xs">
            <div className="p-2.5 rounded-xl bg-navy-light/60 border border-navy-light">
              <span className="text-[10px] text-green-300 block font-medium">💧 Liquid / Cash Wealth</span>
              <Mono className="font-bold text-paper text-sm block mt-0.5">
                ₹{liquidWealth.toLocaleString('en-IN')}
              </Mono>
              <span className="text-[9px] text-paper/60">Bank, Shares, MFs</span>
            </div>

            <div className="p-2.5 rounded-xl bg-navy-light/60 border border-navy-light">
              <span className="text-[10px] text-gold-soft block font-medium">🏛️ Fixed / Illiquid Wealth</span>
              <Mono className="font-bold text-paper text-sm block mt-0.5">
                ₹{fixedWealth.toLocaleString('en-IN')}
              </Mono>
              <span className="text-[9px] text-paper/60">Gold, Property, Khet</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Market Benchmark Rates Card */}
      <div className="px-4">
        <div className="p-3.5 bg-paper rounded-2xl border border-paper-dim shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-gold" />
              <span className="font-bold text-ink">Live Market Benchmarks</span>
            </div>
            <span className="text-[10px] text-ink-muted">{marketRates.lastSyncTime}</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1 text-[11px]">
            <div className="p-2 bg-gold/10 rounded-xl border border-gold/20">
              <span className="text-[9px] text-ink-muted block uppercase font-bold">Gold (24K / 10g)</span>
              <Mono className="font-bold text-gold text-xs block mt-0.5">
                ₹{marketRates.gold_24k_10g.toLocaleString('en-IN')}
              </Mono>
              <span className="text-[9px] text-ink-muted">₹{marketRates.gold_24k_per_g}/g</span>
            </div>

            <div className="p-2 bg-paper-dim/60 rounded-xl border border-paper-dim">
              <span className="text-[9px] text-ink-muted block uppercase font-bold">Reliance (NSE)</span>
              <Mono className="font-bold text-ink text-xs block mt-0.5">
                ₹{marketRates.stocks['RELIANCE']?.price.toLocaleString('en-IN')}
              </Mono>
              <span className="text-[9px] text-green font-bold flex items-center">
                <ArrowUpRight size={10} /> +1.45%
              </span>
            </div>

            <div className="p-2 bg-paper-dim/60 rounded-xl border border-paper-dim">
              <span className="text-[9px] text-ink-muted block uppercase font-bold">Parag Parikh MF</span>
              <Mono className="font-bold text-ink text-xs block mt-0.5">
                NAV ₹{marketRates.mutual_funds['122639']?.nav || 89.57}
              </Mono>
              <span className="text-[9px] text-ink-muted">Daily AMFI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 flex gap-1.5">
        {[
          { key: 'all', label: 'Sabhi Assets (' + assets.length + ')' },
          { key: 'liquid', label: 'Liquid (Cash/Shares/MF)' },
          { key: 'fixed', label: 'Fixed (Gold/Land)' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={'text-xs px-3 py-1.5 rounded-full font-medium transition-all ' + (activeTab === t.key ? 'bg-navy text-paper shadow-sm' : 'bg-paper-dim text-ink-muted hover:text-ink')}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Asset Items List with Live P&L Calculation */}
      <div className="px-4 space-y-2.5">
        {filteredAssets.map((asset) => {
          const isShareOrMF = asset.type === 'shares' || asset.type === 'mutual_funds';
          const isGold = asset.type === 'gold';
          const isLiquid = asset.category === 'liquid';

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

                <div>
                  <h4 className="text-xs font-bold text-ink">{asset.label}</h4>
                  <div className="text-[10px] text-ink-muted mt-0.5 space-x-1">
                    {hasPnl ? (
                      <span>
                        Invested: <strong className="text-ink">₹{Math.round(investedAmt).toLocaleString('en-IN')}</strong> ({asset.quantity} {asset.type === 'shares' ? 'shares' : 'units'} @ ₹{asset.purchase_price})
                      </span>
                    ) : isGold && asset.quantity ? (
                      <span>{asset.quantity} grams (24K Gold Locker)</span>
                    ) : (
                      <span className="capitalize">{asset.category} Wealth · Verified</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
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
            </div>
          );
        })}
      </div>

      {/* Add New Asset Modal with Real-time Search Autocomplete & SIP Calculator */}
      {isAddAssetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-3 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-paper-dim pb-2">
              <h3 className="text-sm font-bold font-serif text-ink">Naya Asset / SIP Jodein</h3>
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
                🔍 Search Stock ya Mutual Fund (Type karein)
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
                    onClick={() => { setAssetCat('liquid'); setAssetType('mutual_funds'); }}
                    className={'py-1.5 text-xs font-bold rounded-xl border ' + (assetCat === 'liquid' ? 'bg-green text-white border-green' : 'bg-paper text-ink-muted border-paper-dim')}
                  >
                    💧 Liquid (MF / Shares / Bank)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAssetCat('fixed'); setAssetType('gold'); }}
                    className={'py-1.5 text-xs font-bold rounded-xl border ' + (assetCat === 'fixed' ? 'bg-gold text-white border-gold' : 'bg-paper text-ink-muted border-paper-dim')}
                  >
                    🏛️ Fixed (Gold / Land)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Asset Type</label>
                <select
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                >
                  <option value="mutual_funds">Mutual Fund (SIP / Lumpsum)</option>
                  <option value="shares">Stock / Shares (NSE/BSE)</option>
                  <option value="gold">Gold & Silver (Jewellery / SGB / Coins)</option>
                  <option value="bank_deposit">Bank FD / RD / Savings</option>
                  <option value="land">Plot / Agricultural Land</option>
                  <option value="property">House / Commercial Property</option>
                </select>
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
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Asset Name / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Parag Parikh Flexi Cap, Tata Motors, Gold Locker"
                  value={assetLabel}
                  onChange={(e) => setAssetLabel(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  required
                />
              </div>

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
                    ₹{Math.round((parseFloat(assetQty) || 0) * (parseFloat(assetBuyPrice) || 0) || (parseFloat(sipMonthlyAmount) * parseFloat(sipMonthsCount)) || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-muted text-[10px]">Current Market Value:</span>
                  <span className="font-mono font-bold text-ink text-sm">
                    ₹{Math.round(parseFloat(assetVal) || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                {parseFloat(assetVal) > 0 && (
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
