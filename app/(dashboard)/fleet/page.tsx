'use client';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Mono } from '@/components/ui/Mono';
import { Button } from '@/components/ui/Button';
import { Truck, Bus, Car, Plus, TrendingUp, DollarSign, Shield, Calendar, Fuel, Phone, User, CheckCircle, Navigation, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CommercialVehicleType, FleetBusinessType } from '@/types';

export default function CommercialFleetPage() {
  const { fleetVehicles, addFleetVehicle, addFleetTrip, deleteFleetVehicle, deleteFleetTrip } = useFamilyStore();
  const [selectedFleetId, setSelectedFleetId] = useState<string>(fleetVehicles[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'trips' | 'roi' | 'docs'>('trips');

  // Modals
  const [isAddTripOpen, setIsAddTripOpen] = useState(false);
  const [isAddVehOpen, setIsAddVehOpen] = useState(false);

  // New Trip form
  const [tripTitle, setTripTitle] = useState('');
  const [partyName, setPartyName] = useState('');
  const [partyPhone, setPartyPhone] = useState('');
  const [billingMode, setBillingMode] = useState<'per_trip' | 'per_ton' | 'per_km' | 'monthly_fixed' | 'daily_fixed'>('per_trip');
  const [rate, setRate] = useState('4500');
  const [quantity, setQuantity] = useState('10');
  const [grossRev, setGrossRev] = useState('45000');
  const [advanceRecv, setAdvanceRecv] = useState('15000');
  const [assignedDriver, setAssignedDriver] = useState('');
  const [dieselLiters, setDieselLiters] = useState('120');
  const [dieselCost, setDieselCost] = useState('10800');
  const [tollCost, setTollCost] = useState('2400');
  const [driverBhata, setDriverBhata] = useState('2000');
  const [repairCost, setRepairCost] = useState('800');

  // New Vehicle form
  const [vType, setVType] = useState<CommercialVehicleType>('truck_mining');
  const [vTitle, setVTitle] = useState('');
  const [vReg, setVReg] = useState('');
  const [vBusinessModel, setVBusinessModel] = useState<FleetBusinessType>('mining_per_trip');
  const [vPurchaseCost, setVPurchaseCost] = useState('');
  const [vBodyCost, setVBodyCost] = useState('');
  const [vHasLoan, setVHasLoan] = useState(true);
  const [vMonthlyEmi, setVMonthlyEmi] = useState('');
  const [vLoanBalance, setVLoanBalance] = useState('');
  const [vFinancier, setVFinancier] = useState('HDFC Bank');
  const [vDriver, setVDriver] = useState('');
  const [vDriverPhone, setVDriverPhone] = useState('');

  const activeVeh = fleetVehicles.find(v => v.id === selectedFleetId) || fleetVehicles[0];

  const totalFleetRevenue = fleetVehicles.reduce((sum, v) => sum + Number(v.lifetime_revenue || 0), 0);
  const totalFleetProfit = fleetVehicles.reduce((sum, v) => sum + Number(v.lifetime_net_profit || 0), 0);
  const totalFleetEmi = fleetVehicles.reduce((sum, v) => sum + Number(v.monthly_emi || 0), 0);

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'truck_mining': return <Truck size={16} className="text-amber-700" />;
      case 'school_bus':
      case 'route_bus': return <Bus size={16} className="text-blue-700" />;
      default: return <Car size={16} className="text-green" />;
    }
  };

  const handleAddTripSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gRev = parseFloat(grossRev);
    if (!tripTitle || !gRev || !activeVeh) return;

    addFleetTrip(activeVeh.id, {
      trip_type: activeVeh.business_model,
      trip_title: tripTitle,
      start_date: new Date().toISOString().split('T')[0],
      assigned_driver: assignedDriver || activeVeh.default_driver_name,
      customer_party_name: partyName || 'Direct Booking',
      customer_phone: partyPhone || undefined,
      billing_mode: billingMode,
      rate: parseFloat(rate) || 0,
      quantity: parseFloat(quantity) || 1,
      gross_revenue: gRev,
      advance_received: parseFloat(advanceRecv) || 0,
      pending_payment: Math.max(0, gRev - (parseFloat(advanceRecv) || 0)),
      diesel_liters: parseFloat(dieselLiters) || 0,
      diesel_cost: parseFloat(dieselCost) || 0,
      toll_fastag_cost: parseFloat(tollCost) || 0,
      driver_bhata: parseFloat(driverBhata) || 0,
      other_repair_cost: parseFloat(repairCost) || 0,
      status: 'completed'
    });

    try { confetti({ particleCount: 60, spread: 60 }); } catch (err) {}
    setIsAddTripOpen(false);
    setTripTitle('');
    alert('Trip / Booking record ho gayi aur munafa calculate ho gaya!');
  };

  const handleAddVehSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pCost = parseFloat(vPurchaseCost) || 0;
    const bCost = parseFloat(vBodyCost) || 0;
    if (!vTitle || !vReg || !pCost) return;

    addFleetVehicle({
      vehicle_type: vType,
      title_model: vTitle,
      reg_number: vReg.toUpperCase(),
      business_model: vBusinessModel,
      purchase_date: new Date().toISOString().split('T')[0],
      purchase_cost: pCost,
      body_building_cost: bCost,
      has_loan: vHasLoan,
      monthly_emi: vHasLoan ? parseFloat(vMonthlyEmi) || 0 : 0,
      loan_balance: vHasLoan ? parseFloat(vLoanBalance) || 0 : 0,
      financier_name: vHasLoan ? vFinancier : undefined,
      annual_depreciation_percent: 15,
      status: 'active',
      default_driver_name: vDriver || 'Assigned Driver',
      default_driver_phone: vDriverPhone || undefined,
      odometer_km: 1000
    });

    setIsAddVehOpen(false);
    setVTitle('');
    setVReg('');
    setVPurchaseCost('');
  };

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Fleet & Transport Business"
        subtitle="Trucks, School Buses, Cabs ka ROI, EMI, Toll/Diesel & Munafa"
        action={
          <button
            type="button"
            onClick={() => setIsAddVehOpen(true)}
            className="w-8 h-8 rounded-full bg-navy text-paper flex items-center justify-center shadow hover:bg-navy-light transition-all"
            title="Add Commercial Vehicle"
          >
            <Plus size={16} />
          </button>
        }
      />

      {/* Overview Stats */}
      <div className="px-4 grid grid-cols-3 gap-2">
        <div className="p-3 bg-paper rounded-2xl border border-paper-dim shadow-sm">
          <span className="text-[9px] font-bold uppercase text-ink-muted block">Kul Gaadiyan</span>
          <Mono className="text-base font-bold text-ink">{fleetVehicles.length} Vehicles</Mono>
          <span className="text-[9px] text-gold block">1-50 Fleet Scale</span>
        </div>

        <div className="p-3 bg-paper rounded-2xl border border-paper-dim shadow-sm">
          <span className="text-[9px] font-bold uppercase text-green block">Lifetime Profit</span>
          <Mono className="text-base font-bold text-green">₹{(totalFleetProfit / 100000).toFixed(1)}L</Mono>
          <span className="text-[9px] text-ink-muted block">Total Munafa</span>
        </div>

        <div className="p-3 bg-paper rounded-2xl border border-paper-dim shadow-sm">
          <span className="text-[9px] font-bold uppercase text-coral block">Total EMI/mo</span>
          <Mono className="text-base font-bold text-coral">₹{(totalFleetEmi / 1000).toFixed(0)}k</Mono>
          <span className="text-[9px] text-ink-muted block">Kisht Dues</span>
        </div>
      </div>

      {/* Vehicle Selector Chips */}
      <div className="px-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {fleetVehicles.map((v) => (
          <button
            key={v.id}
            onClick={() => setSelectedFleetId(v.id)}
            className={'px-3.5 py-2 rounded-xl text-left border shrink-0 transition-all ' + (selectedFleetId === v.id ? 'bg-navy text-paper border-navy shadow-sm' : 'bg-paper text-ink border-paper-dim hover:bg-paper-dim')}
          >
            <div className="flex items-center gap-1.5">
              {getVehicleIcon(v.vehicle_type)}
              <p className="text-xs font-bold truncate max-w-[140px]">{v.title_model}</p>
            </div>
            <p className="text-[10px] opacity-80 uppercase font-mono mt-0.5">{v.reg_number}</p>
          </button>
        ))}
      </div>

      {activeVeh && (
        <div className="px-4 space-y-3">
          {/* Active Vehicle Info Header */}
          <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-sm space-y-2">
            <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (confirm('Kya aap is commercial vehicle aur iske sabhi trips ko hatana chahte hain?')) {
                    deleteFleetVehicle(activeVeh.id);
                  }
                }}
                className="text-xs text-ink-muted hover:text-coral p-1 rounded-lg transition-colors"
                title="Gaadi Hatayein"
              >
                ✕ Hatayein
              </button>
            </div>
              <div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gold/10 text-gold">
                  {activeVeh.business_model.replace('_', ' ')}
                </span>
                <h3 className="text-sm font-bold text-ink font-serif mt-1">{activeVeh.title_model}</h3>
                <span className="text-xs font-mono font-bold bg-navy text-paper px-2 py-0.5 rounded inline-block mt-0.5">
                  {activeVeh.reg_number}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-ink-muted block uppercase font-bold">Driver / Staff</span>
                <span className="text-xs font-bold text-ink">{activeVeh.default_driver_name}</span>
                {activeVeh.default_conductor_name && (
                  <span className="text-[10px] text-ink-muted block">+ {activeVeh.default_conductor_name}</span>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-paper-dim text-xs">
              <button
                onClick={() => setActiveTab('trips')}
                className={'flex-1 py-1.5 rounded-lg font-semibold text-center transition-all ' + (activeTab === 'trips' ? 'bg-navy text-paper' : 'bg-paper-dim text-ink-muted')}
              >
                Trips & Duties ({activeVeh.trips?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('roi')}
                className={'flex-1 py-1.5 rounded-lg font-semibold text-center transition-all ' + (activeTab === 'roi' ? 'bg-navy text-paper' : 'bg-paper-dim text-ink-muted')}
              >
                ROI, Cost & EMI
              </button>
            </div>
          </div>

          {/* TAB 1: Trips & On-Road Expenses */}
          {activeTab === 'trips' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-ink">Trips & Duty Bookings</h4>
                <button
                  onClick={() => setIsAddTripOpen(true)}
                  className="text-xs font-bold px-3 py-1.5 bg-navy text-paper rounded-xl flex items-center gap-1 shadow-sm"
                >
                  <Plus size={13} /> Nayi Trip / Duty Jodein
                </button>
              </div>

              {activeVeh.trips && activeVeh.trips.length > 0 ? (
                activeVeh.trips.map((t) => (
                  <div key={t.id} className="p-4 rounded-2xl bg-paper border border-paper-dim shadow-sm space-y-2.5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="text-xs font-bold text-ink">{t.trip_title}</h5>
                        <p className="text-[10px] text-ink-muted mt-0.5">
                          Party: <strong className="text-ink">{t.customer_party_name}</strong> · Driver: {t.assigned_driver}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-bold text-green uppercase block">Net Munafa</span>
                        <Mono className="text-sm font-bold text-green">₹{t.net_trip_profit.toLocaleString('en-IN')}</Mono>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 p-2 bg-paper-dim/50 rounded-xl text-[11px]">
                      <div>
                        <span className="text-[9px] text-ink-muted block">Gross Billed</span>
                        <Mono className="font-semibold text-ink">₹{t.gross_revenue.toLocaleString('en-IN')}</Mono>
                      </div>
                      <div>
                        <span className="text-[9px] text-ink-muted block">Diesel ({t.diesel_liters} L)</span>
                        <Mono className="font-semibold text-coral">₹{t.diesel_cost.toLocaleString('en-IN')}</Mono>
                      </div>
                      <div>
                        <span className="text-[9px] text-ink-muted block">Toll + Bhata</span>
                        <Mono className="font-semibold text-coral">₹{(t.toll_fastag_cost + t.driver_bhata).toLocaleString('en-IN')}</Mono>
                      </div>
                    </div>

                    {t.pending_payment > 0 && (
                      <div className="flex justify-between items-center text-[10px] px-2 py-1 bg-coral/10 rounded-lg text-coral font-semibold">
                        <span>Party Se Lena Baaki (Pending):</span>
                        <Mono>₹{t.pending_payment.toLocaleString('en-IN')}</Mono>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 bg-paper rounded-xl text-center text-xs text-ink-muted">
                  Koi trip record nahi hai. "+ Nayi Trip" dabakar trip shuru karein.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ROI, Acquisition Cost & Monthly EMI */}
          {activeTab === 'roi' && (
            <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-ink">Vehicle Financials, EMI & Lifetime ROI</h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 bg-paper-dim/40 rounded-xl">
                  <span className="text-ink-muted">Total Acquisition Cost (Gaadi + Body Making):</span>
                  <Mono className="font-bold text-ink">₹{activeVeh.total_acquisition_cost.toLocaleString('en-IN')}</Mono>
                </div>

                <div className="flex justify-between p-2 bg-paper-dim/40 rounded-xl">
                  <span className="text-ink-muted">Current Depreciated Value (Real Market Value):</span>
                  <Mono className="font-bold text-gold">₹{activeVeh.current_depreciated_value.toLocaleString('en-IN')}</Mono>
                </div>

                {activeVeh.has_loan && (
                  <div className="p-3 bg-coral/5 border border-coral/20 rounded-xl space-y-1">
                    <div className="flex justify-between font-semibold text-coral">
                      <span>Monthly Loan EMI:</span>
                      <Mono>₹{activeVeh.monthly_emi.toLocaleString('en-IN')}/month</Mono>
                    </div>
                    <div className="flex justify-between text-[10px] text-ink-muted">
                      <span>Financier: {activeVeh.financier_name}</span>
                      <span>Loan Balance: ₹{activeVeh.loan_balance.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}

                <div className="p-3 bg-green/10 border border-green/20 rounded-xl space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-green block">Lifetime Profitability (ROI)</span>
                  <div className="flex justify-between text-xs">
                    <span className="text-ink-muted">Lifetime Gross Revenue:</span>
                    <Mono className="font-semibold text-green">₹{activeVeh.lifetime_revenue.toLocaleString('en-IN')}</Mono>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-ink-muted">Lifetime Operating Expenses:</span>
                    <Mono className="font-semibold text-coral">₹{activeVeh.lifetime_expenses.toLocaleString('en-IN')}</Mono>
                  </div>
                  <div className="flex justify-between text-xs font-bold pt-1 border-t border-green/30">
                    <span className="text-ink">Shuddh Lifetime Munafa:</span>
                    <Mono className="text-sm font-bold text-green">₹{activeVeh.lifetime_net_profit.toLocaleString('en-IN')}</Mono>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add New Trip Modal */}
      {isAddTripOpen && activeVeh && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-3 max-h-[85vh] overflow-y-auto">
            <h3 className="text-sm font-bold font-serif text-ink">Nayi Trip / Duty Record Karein</h3>
            <form onSubmit={handleAddTripSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Trip / Kaam Ka Naam</label>
                <input
                  type="text"
                  placeholder="e.g. Mines to Highway Site - 10 Trips"
                  value={tripTitle}
                  onChange={(e) => setTripTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Party / Customer</label>
                  <input
                    type="text"
                    placeholder="e.g. Singhal Builders"
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Assigned Driver</label>
                  <input
                    type="text"
                    placeholder={activeVeh.default_driver_name}
                    value={assignedDriver}
                    onChange={(e) => setAssignedDriver(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Gross Bill Raqam (₹)</label>
                  <input
                    type="number"
                    value={grossRev}
                    onChange={(e) => setGrossRev(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Advance Received (₹)</label>
                  <input
                    type="number"
                    value={advanceRecv}
                    onChange={(e) => setAdvanceRecv(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-coral/5 border border-coral/20 rounded-xl space-y-2">
                <span className="text-[10px] font-bold uppercase text-coral block">Raste Ke Kharche (Running Costs)</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-ink-muted block">Diesel Cost (₹)</label>
                    <input
                      type="number"
                      value={dieselCost}
                      onChange={(e) => setDieselCost(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs bg-paper border border-paper-dim rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-ink-muted block">Toll / Fastag (₹)</label>
                    <input
                      type="number"
                      value={tollCost}
                      onChange={(e) => setTollCost(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs bg-paper border border-paper-dim rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-ink-muted block">Driver Bhata (₹)</label>
                    <input
                      type="number"
                      value={driverBhata}
                      onChange={(e) => setDriverBhata(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs bg-paper border border-paper-dim rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-ink-muted block">Repair/Misc (₹)</label>
                    <input
                      type="number"
                      value={repairCost}
                      onChange={(e) => setRepairCost(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs bg-paper border border-paper-dim rounded-lg font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddTripOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1 bg-navy text-paper">
                  Save Trip
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Commercial Vehicle Modal */}
      {isAddVehOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-3 max-h-[85vh] overflow-y-auto">
            <h3 className="text-sm font-bold font-serif text-ink">Nayi Commercial Gaadi Jodein</h3>
            <form onSubmit={handleAddVehSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Business Model</label>
                <select
                  value={vBusinessModel}
                  onChange={(e) => setVBusinessModel(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                >
                  <option value="mining_per_trip">Mines / Tipper / Dumper (Per Trip)</option>
                  <option value="school_monthly">School Bus Contract (Monthly)</option>
                  <option value="route_daily">Route Stage Bus (Daily Ticket)</option>
                  <option value="outstation_rental">Tourist / Rental Cab (Per Km/Day)</option>
                  <option value="goods_contract">Goods Carrier / Mini Truck</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Model & Title</label>
                <input
                  type="text"
                  placeholder="e.g. Tata Signa 2823 Tipper, Ashok Leyland 42 Seater"
                  value={vTitle}
                  onChange={(e) => setVTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Registration Number Plate</label>
                <input
                  type="text"
                  placeholder="e.g. UP 32 BK 5521"
                  value={vReg}
                  onChange={(e) => setVReg(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-mono uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Purchase Cost (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 3800000"
                    value={vPurchaseCost}
                    onChange={(e) => setVPurchaseCost(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Body Making (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 250000"
                    value={vBodyCost}
                    onChange={(e) => setVBodyCost(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Monthly EMI (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 68000"
                    value={vMonthlyEmi}
                    onChange={(e) => setVMonthlyEmi(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Driver Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Baljeet Singh"
                    value={vDriver}
                    onChange={(e) => setVDriver(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddVehOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1 bg-navy text-paper">
                  Save Vehicle
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
