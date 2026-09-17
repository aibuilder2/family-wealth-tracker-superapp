'use client';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Mono } from '@/components/ui/Mono';
import { Button } from '@/components/ui/Button';
import { Sprout, Plus, TrendingUp, HandCoins, Phone, ShieldCheck, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AgriculturePage() {
  const { agriculturalLands, addAgriLand, addAgriExpense, recordCropHarvest, deleteAgriLand, deleteAgriExpense, recordAgriDrawingToFamily, members, currentUserId } = useFamilyStore();
  const [selectedLandId, setSelectedLandId] = useState<string>(agriculturalLands[0]?.id || '');
  
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isHarvestOpen, setIsHarvestOpen] = useState(false);
  const [isAgriDrawingOpen, setIsAgriDrawingOpen] = useState(false);
  const [agriDrawAmount, setAgriDrawAmount] = useState('');
  const [agriDrawMemberId, setAgriDrawMemberId] = useState('all_members');
  const [agriDrawNote, setAgriDrawNote] = useState('Kheti fasal munafa payout');
  const [isAddLandOpen, setIsAddLandOpen] = useState(false);

  const [expCat, setExpCat] = useState<'beej' | 'khaad' | 'pesticide' | 'diesel_water' | 'labor' | 'harvesting' | 'other'>('beej');
  const [expAmt, setExpAmt] = useState('');
  const [expNote, setExpNote] = useState('');

  const [harvestYield, setHarvestYield] = useState('45');
  const [harvestRate, setHarvestRate] = useState('2350');
  const [harvestBonus, setHarvestBonus] = useState('5000');
  const [addToIncome, setAddToIncome] = useState(true);

  const [landTitle, setLandTitle] = useState('');
  const [landLocation, setLandLocation] = useState('');
  const [landArea, setLandArea] = useState('');
  const [landUnit, setLandUnit] = useState<'Bigha' | 'Acre' | 'Killa' | 'Hectare'>('Bigha');
  const [farmingType, setFarmingType] = useState<'khud' | 'theka' | 'adhiya'>('khud');
  const [partnerName, setPartnerName] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [yearlyTheka, setYearlyTheka] = useState('');

  const activeLand = agriculturalLands.find(l => l.id === selectedLandId) || agriculturalLands[0];

  const handleAgriDrawingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(agriDrawAmount);
    if (!amt || amt <= 0 || !activeLand) return;

    recordAgriDrawingToFamily(activeLand.id, {
      amount: amt,
      credited_to_member_id: agriDrawMemberId,
      note: agriDrawNote
    });

    try { confetti({ particleCount: 50, spread: 60 }); } catch (e) {}
    setIsAgriDrawingOpen(false);
    setAgriDrawAmount('');
  };

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(expAmt);
    if (!amt || amt <= 0) return;
    addAgriExpense(activeLand.id, {
      category: expCat,
      amount: amt,
      date: new Date().toISOString().split('T')[0],
      note: expNote || expCat
    });
    setExpAmt('');
    setExpNote('');
    setIsAddExpenseOpen(false);
  };

  const handleHarvestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const y = parseFloat(harvestYield);
    const r = parseFloat(harvestRate);
    const b = parseFloat(harvestBonus) || 0;
    if (!y || !r) return;
    recordCropHarvest(activeLand.id, {
      yield_quintals: y,
      rate: r,
      bonus: b,
      addToIncome: addToIncome
    });
    try { confetti({ particleCount: 70, spread: 70 }); } catch (err) {}
    setIsHarvestOpen(false);
    alert('Fasal bikri & bonus income record ho gaya!');
  };

  const handleAddLandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!landTitle || !landArea) return;
    addAgriLand({
      title: landTitle,
      location: landLocation || 'Gram Panchayat',
      area: parseFloat(landArea),
      area_unit: landUnit,
      farming_type: farmingType,
      partner_name: partnerName || undefined,
      partner_phone: partnerPhone || undefined,
      yearly_theka_amount: yearlyTheka ? parseFloat(yearlyTheka) : undefined,
      current_crop: farmingType === 'khud' ? 'Gehu / Sarson' : undefined
    });
    setIsAddLandOpen(false);
    setLandTitle('');
    setLandArea('');
  };

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Krishi & Agri Land"
        subtitle="Kheti, Theka/Adhiya, Fasal kharche aur Mandi bikri + Bonus"
        action={
          <button
            type="button"
            onClick={() => setIsAddLandOpen(true)}
            className="w-8 h-8 rounded-full bg-navy text-paper flex items-center justify-center shadow hover:bg-navy-light transition-all"
            title="Add Agricultural Land"
          >
            <Plus size={16} />
          </button>
        }
      />

      <div className="px-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {agriculturalLands.map((l) => (
          <button
            key={l.id}
            onClick={() => setSelectedLandId(l.id)}
            className={'px-3.5 py-2 rounded-xl text-left border shrink-0 transition-all ' + (selectedLandId === l.id ? 'bg-navy text-paper border-navy shadow-sm' : 'bg-paper text-ink border-paper-dim hover:bg-paper-dim')}
          >
            <p className="text-xs font-semibold">{l.title}</p>
            <p className="text-[10px] opacity-80 capitalize">{l.area} {l.area_unit} · {l.farming_type === 'khud' ? 'Khud ki Kheti' : l.farming_type === 'theka' ? 'Theka par' : 'Adhiya'}</p>
          </button>
        ))}
      </div>

      {activeLand ? (
        <div className="px-4 space-y-3">
          <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider">
                  {activeLand.location}
                </span>
                <h3 className="text-sm font-bold text-ink font-serif mt-0.5">{activeLand.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={'text-[10px] font-bold px-2 py-0.5 rounded uppercase ' + (activeLand.farming_type === 'khud' ? 'bg-green/10 text-green' : 'bg-gold/10 text-gold')}>
                  {activeLand.farming_type === 'khud' ? '🌾 Khud ki Kheti' : activeLand.farming_type === 'theka' ? '🤝 Theka' : '⚖️ Adhiya'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(activeLand.title + ' ko hatayein?')) {
                      deleteAgriLand(activeLand.id);
                    }
                  }}
                  className="text-[10px] text-ink-muted hover:text-coral"
                  title="Zameen hatayein"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-paper-dim text-xs">
              <div>
                <span className="text-[10px] text-ink-muted block">Kul Zameen (Area)</span>
                <span className="font-semibold text-ink">{activeLand.area} {activeLand.area_unit}</span>
              </div>
              {activeLand.farming_type === 'theka' ? (
                <div>
                  <span className="text-[10px] text-ink-muted block">Varshik Theka Raqam</span>
                  <Mono className="font-semibold text-gold">₹{activeLand.yearly_theka_amount?.toLocaleString('en-IN')}/saal</Mono>
                </div>
              ) : (
                <div>
                  <span className="text-[10px] text-ink-muted block">Current Crop (Fasal)</span>
                  <span className="font-semibold text-green">{activeLand.current_crop || 'Gehu / Sarson'}</span>
                </div>
              )}
            </div>

            {activeLand.partner_name && (
              <div className="p-2.5 bg-paper-dim/60 rounded-xl text-xs flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-ink-muted block">Thekedaar / Partner</span>
                  <span className="font-medium text-ink">{activeLand.partner_name}</span>
                </div>
                {activeLand.partner_phone && (
                  <a href={'tel:' + activeLand.partner_phone} className="flex items-center gap-1 text-gold font-medium text-xs">
                    <Phone size={12} /> {activeLand.partner_phone}
                  </a>
                )}
              </div>
            )}
          </div>

          {activeLand.farming_type === 'khud' && activeLand.active_cycle && (
            <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-green uppercase tracking-wider">Active Season</span>
                  <h4 className="text-xs font-bold text-ink">{activeLand.active_cycle.season} ({activeLand.active_cycle.crop_name})</h4>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setIsAddExpenseOpen(true)}
                    className="text-[10px] font-bold px-2.5 py-1 bg-navy text-paper rounded-lg flex items-center gap-1"
                  >
                    <Plus size={11} /> Kharch
                  </button>
                  <button
                    onClick={() => setIsHarvestOpen(true)}
                    className="text-[10px] font-bold px-2.5 py-1 bg-gold text-paper rounded-lg flex items-center gap-1"
                  >
                    <TrendingUp size={11} /> Bikri
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-paper-dim">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-ink">Kul Kheti Kharcha:</span>
                  <Mono className="text-coral">₹{activeLand.active_cycle.total_expense.toLocaleString('en-IN')}</Mono>
                </div>

                <div className="space-y-1 pt-1">
                  {activeLand.active_cycle.expenses.map((e) => (
                    <div key={e.id} className="flex justify-between text-[11px] text-ink-muted bg-paper-dim/40 px-2.5 py-1 rounded">
                      <span className="capitalize">{e.note || e.category} ({e.date})</span>
                      <Mono className="text-ink font-medium">₹{e.amount.toLocaleString('en-IN')}</Mono>
                    </div>
                  ))}
                </div>
              </div>

              {activeLand.active_cycle.crop_sale_income ? (
                <div className="pt-2 border-t border-paper-dim bg-green/5 p-3 rounded-xl space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-ink-muted">Mandi Sale ({activeLand.active_cycle.crop_yield_quintals} Qtl @ ₹{activeLand.active_cycle.mandi_rate_per_quintal}):</span>
                    <Mono className="font-semibold text-green">₹{activeLand.active_cycle.crop_sale_income.toLocaleString('en-IN')}</Mono>
                  </div>
                  {activeLand.active_cycle.govt_bonus_amount && (
                    <div className="flex justify-between text-xs">
                      <span className="text-ink-muted">Govt Bonus / Subsidy:</span>
                      <Mono className="font-semibold text-green">+₹{activeLand.active_cycle.govt_bonus_amount.toLocaleString('en-IN')}</Mono>
                    </div>
                  )}
                  <div className="flex justify-between text-xs font-bold pt-1 border-t border-green/20">
                    <span className="text-ink">Shuddh Munafa (Net Profit):</span>
                    <Mono className="text-sm font-bold text-green">₹{activeLand.active_cycle.net_profit.toLocaleString('en-IN')}</Mono>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      ) : (
        <div className="mx-4 p-8 text-center bg-paper rounded-2xl border border-paper-dim shadow-sm space-y-3">
          <Sprout size={36} className="mx-auto text-ink-muted opacity-50" />
          <h3 className="text-sm font-bold text-ink">Koi Krishi Bhoomi / Kheti Record Nahi Hai</h3>
          <p className="text-xs text-ink-muted max-w-sm mx-auto">
            Apni kheti ki zameen, theka/adhiya hisab aur fasal mandi bikri ko yahan jodein.
          </p>
          <Button onClick={() => setIsAddLandOpen(true)} size="sm" className="bg-navy text-paper">
            + Nayi Zameen / Khet Jodein
          </Button>
        </div>
      )}

      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-3">
            <h3 className="text-sm font-bold font-serif text-ink">Kheti Ka Kharch Likhein</h3>
            <form onSubmit={handleAddExpenseSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Kharch Category</label>
                <select
                  value={expCat}
                  onChange={(e) => setExpCat(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                >
                  <option value="beej">Beej (Seeds)</option>
                  <option value="khaad">Khaad & Urea (Fertilizer)</option>
                  <option value="pesticide">Keetnashak Spray</option>
                  <option value="diesel_water">Diesel & Tube-well Paani</option>
                  <option value="labor">Mazdoori (Labor)</option>
                  <option value="harvesting">Kataai / Thresher</option>
                  <option value="other">Anya</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Raqam (Amount ₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 4500"
                  value={expAmt}
                  onChange={(e) => setExpAmt(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Vivran / Note</label>
                <input
                  type="text"
                  placeholder="e.g. 2 bora DAP + 1 urea"
                  value={expNote}
                  onChange={(e) => setExpNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddExpenseOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1 bg-navy text-paper">
                  Save Kharcha
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isHarvestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-3">
            <h3 className="text-sm font-bold font-serif text-ink">Fasal Bikri & Bonus Entry</h3>
            <form onSubmit={handleHarvestSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Kul Paidaawar (Quintals me)</label>
                <input
                  type="number"
                  placeholder="e.g. 45"
                  value={harvestYield}
                  onChange={(e) => setHarvestYield(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Mandi / MSP Rate (₹ per Quintal)</label>
                <input
                  type="number"
                  placeholder="e.g. 2350"
                  value={harvestRate}
                  onChange={(e) => setHarvestRate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Sarkari Bonus / Subsidy Raqam (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={harvestBonus}
                  onChange={(e) => setHarvestBonus(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-mono font-bold"
                />
              </div>

              <div className="flex items-center gap-2 p-2 bg-green/10 rounded-xl text-xs">
                <input
                  type="checkbox"
                  id="incCheck"
                  checked={addToIncome}
                  onChange={(e) => setAddToIncome(e.target.checked)}
                  className="rounded text-green"
                />
                <label htmlFor="incCheck" className="text-ink font-medium cursor-pointer">
                  Is raqam ko seedhe Family Income me add karein
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsHarvestOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1 bg-green text-white">
                  Record Bikri
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddLandOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-3 max-h-[85vh] overflow-y-auto">
            <h3 className="text-sm font-bold font-serif text-ink">Naya Khet Jodein</h3>
            <form onSubmit={handleAddLandSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Khet Ka Naam</label>
                <input
                  type="text"
                  placeholder="e.g. Nahar Wala Khet"
                  value={landTitle}
                  onChange={(e) => setLandTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Area</label>
                  <input
                    type="number"
                    placeholder="e.g. 5"
                    value={landArea}
                    onChange={(e) => setLandArea(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Unit</label>
                  <select
                    value={landUnit}
                    onChange={(e) => setLandUnit(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  >
                    <option value="Bigha">Bigha</option>
                    <option value="Acre">Acre</option>
                    <option value="Killa">Killa</option>
                    <option value="Hectare">Hectare</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Kheti Prakar</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['khud', 'theka', 'adhiya'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFarmingType(t)}
                      className={'py-1.5 text-xs font-medium rounded-lg border capitalize ' + (farmingType === t ? 'bg-navy text-paper border-navy' : 'bg-paper text-ink-muted border-paper-dim')}
                    >
                      {t === 'khud' ? 'Khud Kheti' : t === 'theka' ? 'Theka' : 'Adhiya'}
                    </button>
                  ))}
                </div>
              </div>

              {farmingType !== 'khud' && (
                <>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Thekedaar Name & Phone</label>
                    <input
                      type="text"
                      placeholder="e.g. Mahender Yadav"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                    />
                  </div>
                  {farmingType === 'theka' && (
                    <div>
                      <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Varshik Theka Amount (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 150000"
                        value={yearlyTheka}
                        onChange={(e) => setYearlyTheka(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-mono"
                      />
                    </div>
                  )}
                </>
              )}

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddLandOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1 bg-navy text-paper">
                  Save Khet
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Agri Profit Drawing / Payout Modal */}
      {isAgriDrawingOpen && activeLand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-green tracking-wider">Kheti Munafa Payout</span>
              <h3 className="text-sm font-bold font-serif text-ink mt-0.5">{activeLand.title}</h3>
              <p className="text-xs text-ink-muted">
                Available Fasal Munafa: <Mono className="font-bold text-green">₹{(Math.max(0, (activeLand.active_cycle?.net_profit || 0) - (activeLand.total_drawings_paid || 0))).toLocaleString('en-IN')}</Mono>
              </p>
            </div>

            <form onSubmit={handleAgriDrawingSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Transfer Raqam (₹ Amount)</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={agriDrawAmount}
                  onChange={(e) => setAgriDrawAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-paper-dim border border-paper-dim rounded-xl font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Kis Parivar Member Ke Account Me?</label>
                <select
                  value={agriDrawMemberId}
                  onChange={(e) => setAgriDrawMemberId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-medium"
                >
                  <option value="all_members">👥 Sabhi Parivar Sadasyon Me Barabar (Equal Split)</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} ({m.relationship || m.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Vivran / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Gehu bikri munafa transfer"
                  value={agriDrawNote}
                  onChange={(e) => setAgriDrawNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAgriDrawingOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1 bg-green text-white font-bold">
                  Transfer to Family
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}