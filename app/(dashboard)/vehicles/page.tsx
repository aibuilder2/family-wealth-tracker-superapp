'use client';

import React, { useState } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Mono } from '@/components/ui/Mono';
import { Button } from '@/components/ui/Button';
import { Car, Wrench, Shield, Calendar, Plus, Fuel, User, Clock } from 'lucide-react';
import { formatDueDays } from '@/lib/utils/dateHelpers';

export default function VehiclesPage() {
  const { vehicles, addVehicle, addVehicleServiceLog, members } = useFamilyStore();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || '');
  
  const [isAddVehOpen, setIsAddVehOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);

  const [vType, setVType] = useState<'car' | 'bike' | 'scooter' | 'tractor' | 'other'>('car');
  const [brandModel, setBrandModel] = useState('');
  const [regNo, setRegNo] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('2023-01-15');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [fuelType, setFuelType] = useState<'Petrol' | 'Diesel' | 'CNG' | 'EV' | 'Hybrid'>('Petrol');
  const [ownerId, setOwnerId] = useState(members[0]?.id || 'm-papa');
  const [insExpiry, setInsExpiry] = useState('');
  const [pucExpiry, setPucExpiry] = useState('');
  const [serviceDue, setServiceDue] = useState('');

  const [srvDate, setSrvDate] = useState(new Date().toISOString().split('T')[0]);
  const [srvKm, setSrvKm] = useState('25000');
  const [srvCost, setSrvCost] = useState('4500');
  const [srvGarage, setSrvGarage] = useState('Authorized Service Center');
  const [srvDetails, setSrvDetails] = useState('Oil change + Filter replace');

  const activeVeh = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(purchasePrice) || 0;
    if (!brandModel || !regNo) return;

    const owner = members.find(m => m.id === ownerId);
    addVehicle({
      vehicle_type: vType,
      brand_model: brandModel,
      reg_number: regNo.toUpperCase(),
      purchase_date: purchaseDate,
      purchase_price: price,
      fuel_type: fuelType,
      member_id: ownerId,
      member_name: owner?.name || 'Papa',
      insurance_expiry: insExpiry || undefined,
      puc_expiry: pucExpiry || undefined,
      service_due_date: serviceDue || undefined,
      notes: 'Added to family garage'
    });

    setIsAddVehOpen(false);
    setBrandModel('');
    setRegNo('');
    setPurchasePrice('');
  };

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseFloat(srvCost);
    const km = parseInt(srvKm) || 0;
    if (!cost) return;

    addVehicleServiceLog(activeVeh.id, {
      service_date: srvDate,
      odometer_km: km,
      cost: cost,
      garage_name: srvGarage,
      details: srvDetails
    });

    setIsServiceOpen(false);
    alert('Service log record ho gaya aur kharch me add ho gaya!');
  };

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Vehicles & Garage"
        subtitle="Car, Bike, Scooty details, Service history aur Document dues"
        action={
          <button
            type="button"
            onClick={() => setIsAddVehOpen(true)}
            className="w-8 h-8 rounded-full bg-navy text-paper flex items-center justify-center shadow hover:bg-navy-light transition-all"
            title="Add Vehicle"
          >
            <Plus size={16} />
          </button>
        }
      />

      <div className="px-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {vehicles.map((v) => (
          <button
            key={v.id}
            onClick={() => setSelectedVehicleId(v.id)}
            className={'px-3.5 py-2 rounded-xl text-left border shrink-0 transition-all ' + (selectedVehicleId === v.id ? 'bg-navy text-paper border-navy shadow-sm' : 'bg-paper text-ink border-paper-dim hover:bg-paper-dim')}
          >
            <p className="text-xs font-bold">{v.brand_model}</p>
            <p className="text-[10px] opacity-80 uppercase font-mono">{v.reg_number}</p>
          </button>
        ))}
      </div>

      {activeVeh && (
        <div className="px-4 space-y-3">
          <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-gold tracking-wider">
                  {activeVeh.vehicle_type} · {activeVeh.fuel_type}
                </span>
                <h3 className="text-base font-bold text-ink font-serif mt-0.5">{activeVeh.brand_model}</h3>
                <span className="text-xs font-mono font-bold bg-navy text-paper px-2.5 py-0.5 rounded inline-block mt-1">
                  {activeVeh.reg_number}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-ink-muted block">Owner / Member</span>
                <span className="text-xs font-bold text-ink">{activeVeh.member_name || 'Papa'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-paper-dim text-xs">
              <div>
                <span className="text-[10px] text-ink-muted block">Purchase Date</span>
                <span className="font-semibold text-ink">{activeVeh.purchase_date}</span>
              </div>
              <div>
                <span className="text-[10px] text-ink-muted block">Purchase Cost</span>
                <Mono className="font-semibold text-ink">₹{activeVeh.purchase_price.toLocaleString('en-IN')}</Mono>
              </div>
            </div>
          </div>

          <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-ink">Document & Service Dues</h4>
            <div className="space-y-1.5 pt-1">
              {activeVeh.insurance_expiry && (
                <div className="flex justify-between items-center text-xs p-2 bg-paper-dim/40 rounded-xl">
                  <span className="flex items-center gap-1.5 text-ink">
                    <Shield size={14} className="text-gold" /> Insurance Renewal
                  </span>
                  <span className="text-[11px] font-bold text-coral">
                    {formatDueDays(activeVeh.insurance_expiry).text} ({activeVeh.insurance_expiry})
                  </span>
                </div>
              )}

              {activeVeh.puc_expiry && (
                <div className="flex justify-between items-center text-xs p-2 bg-paper-dim/40 rounded-xl">
                  <span className="flex items-center gap-1.5 text-ink">
                    <Fuel size={14} className="text-green" /> Pollution (PUC) Expiry
                  </span>
                  <span className="text-[11px] font-bold text-ink-muted">
                    {formatDueDays(activeVeh.puc_expiry).text}
                  </span>
                </div>
              )}

              {activeVeh.service_due_date && (
                <div className="flex justify-between items-center text-xs p-2 bg-paper-dim/40 rounded-xl">
                  <span className="flex items-center gap-1.5 text-ink">
                    <Wrench size={14} className="text-coral" /> Next Periodic Service
                  </span>
                  <span className="text-[11px] font-bold text-gold">
                    {formatDueDays(activeVeh.service_due_date).text}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-ink">Service & Repair History</h4>
              <button
                onClick={() => setIsServiceOpen(true)}
                className="text-[10px] font-bold px-2.5 py-1 bg-navy text-paper rounded-lg flex items-center gap-1"
              >
                <Plus size={11} /> Record Service
              </button>
            </div>

            {activeVeh.service_logs && activeVeh.service_logs.length > 0 ? (
              <div className="space-y-2 pt-1">
                {activeVeh.service_logs.map((sl) => (
                  <div key={sl.id} className="p-2.5 bg-paper-dim/50 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span className="text-ink">{sl.details}</span>
                      <Mono className="text-coral">₹{sl.cost.toLocaleString('en-IN')}</Mono>
                    </div>
                    <div className="flex justify-between text-[10px] text-ink-muted">
                      <span>{sl.garage_name} ({sl.odometer_km} km)</span>
                      <span>{sl.service_date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-ink-muted text-center py-2">Koi service history record nahi hai.</p>
            )}
          </div>
        </div>
      )}

      {isAddVehOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-3 max-h-[85vh] overflow-y-auto">
            <h3 className="text-sm font-bold font-serif text-ink">Naya Vehicle Jodein</h3>
            <form onSubmit={handleAddVehicleSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Vehicle Type</label>
                <div className="grid grid-cols-4 gap-1">
                  {(['car', 'bike', 'scooter', 'tractor'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setVType(t)}
                      className={'py-1.5 text-xs font-medium rounded-lg border capitalize ' + (vType === t ? 'bg-navy text-paper border-navy' : 'bg-paper text-ink-muted border-paper-dim')}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Brand & Model Name</label>
                <input
                  type="text"
                  placeholder="e.g. Maruti Swift Dzire"
                  value={brandModel}
                  onChange={(e) => setBrandModel(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Number Plate (Reg Number)</label>
                <input
                  type="text"
                  placeholder="e.g. DL 03 CA 1234"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-mono uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Purchase Date</label>
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Purchase Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 850000"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Fuel Type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="EV">Electric (EV)</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Owner Member</label>
                  <select
                    value={ownerId}
                    onChange={(e) => setOwnerId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Insurance Expiry Date</label>
                <input
                  type="date"
                  value={insExpiry}
                  onChange={(e) => setInsExpiry(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                />
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

      {isServiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper p-5 rounded-2xl border border-paper-dim shadow-xl space-y-3">
            <h3 className="text-sm font-bold font-serif text-ink">Service / Repair Record Karein</h3>
            <form onSubmit={handleServiceSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Service Date</label>
                  <input
                    type="date"
                    value={srvDate}
                    onChange={(e) => setSrvDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Odometer (Km)</label>
                  <input
                    type="number"
                    placeholder="e.g. 25000"
                    value={srvKm}
                    onChange={(e) => setSrvKm(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Service Cost (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 4500"
                  value={srvCost}
                  onChange={(e) => setSrvCost(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Garage Name</label>
                <input
                  type="text"
                  placeholder="e.g. Maruti Service Arena"
                  value={srvGarage}
                  onChange={(e) => setSrvGarage(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Kaam Ka Vivran</label>
                <input
                  type="text"
                  placeholder="e.g. Periodic service, Oil change"
                  value={srvDetails}
                  onChange={(e) => setSrvDetails(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-paper-dim border border-paper-dim rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsServiceOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1 bg-navy text-paper">
                  Save Service
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
