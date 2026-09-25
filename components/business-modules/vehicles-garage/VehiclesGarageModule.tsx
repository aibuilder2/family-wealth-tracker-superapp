'use client';

import React, { useState, useEffect } from 'react';
import { Car, Plus, Wrench, Shield, Calendar, Trash2, Fuel, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

interface ServiceLog {
  id: string;
  date: string;
  odometerKm: number;
  cost: number;
  garageName: string;
  workDone: string;
}

interface PersonalVehicle {
  id: string;
  type: 'car' | 'bike' | 'scooter' | 'tractor';
  brandModel: string;
  regNumber: string; // e.g. UP 32 AB 1234
  owner: string; // Papa, Rohan, Mummy
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'EV';
  insuranceExpiry: string;
  pucExpiry: string;
  serviceDueKm: number;
  currentOdometerKm: number;
  serviceHistory: ServiceLog[];
}

const DEFAULT_VEHICLES: PersonalVehicle[] = [];

export function VehiclesGarageModule() {
  const [vehicles, setVehicles] = useState<PersonalVehicle[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_garage_vehicles_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter((v: any) => !['veh-1', 'veh-2'].includes(v?.id));
          }
        } catch (e) {}
      }
    }
    return DEFAULT_VEHICLES;
  });

  const [selectedVehId, setSelectedVehId] = useState<string>(vehicles[0]?.id || '');
  const [isAddVehOpen, setIsAddVehOpen] = useState(false);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);

  // Form State: Vehicle
  const [brandModel, setBrandModel] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [type, setType] = useState<PersonalVehicle['type']>('car');
  const [owner, setOwner] = useState('पापा');
  const [fuelType, setFuelType] = useState<PersonalVehicle['fuelType']>('Petrol');
  const [insExpiry, setInsExpiry] = useState('');
  const [pucExpiry, setPucExpiry] = useState('');

  // Form State: Service Log
  const [srvKm, setSrvKm] = useState<number | ''>('');
  const [srvCost, setSrvCost] = useState<number | ''>('');
  const [srvGarage, setSrvGarage] = useState('');
  const [srvWork, setSrvWork] = useState('');

  useEffect(() => {
    localStorage.setItem('fwa_garage_vehicles_v1', JSON.stringify(vehicles));
  }, [vehicles]);

  const activeVeh = vehicles.find(v => v.id === selectedVehId) || vehicles[0];

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandModel || !regNumber) return;

    const newVeh: PersonalVehicle = {
      id: `veh-${Date.now()}`,
      brandModel,
      regNumber: regNumber.toUpperCase(),
      type,
      owner,
      fuelType,
      insuranceExpiry: insExpiry || '2027-01-01',
      pucExpiry: pucExpiry || '2026-12-31',
      serviceDueKm: 10000,
      currentOdometerKm: 0,
      serviceHistory: []
    };

    setVehicles([...vehicles, newVeh]);
    setSelectedVehId(newVeh.id);
    setIsAddVehOpen(false);
    setBrandModel('');
    setRegNumber('');
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVeh || !srvCost || !srvWork) return;

    const newSrv: ServiceLog = {
      id: `sl-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      odometerKm: Number(srvKm) || activeVeh.currentOdometerKm,
      cost: Number(srvCost),
      garageName: srvGarage || 'लोकल वर्कशॉप',
      workDone: srvWork
    };

    const updated: PersonalVehicle = {
      ...activeVeh,
      currentOdometerKm: Number(srvKm) || activeVeh.currentOdometerKm,
      serviceHistory: [newSrv, ...activeVeh.serviceHistory]
    };

    setVehicles(vehicles.map(v => v.id === activeVeh.id ? updated : v));
    setIsAddServiceOpen(false);
    setSrvKm('');
    setSrvCost('');
    setSrvGarage('');
    setSrvWork('');
  };

  const handleDeleteVeh = (id: string) => {
    if (confirm('क्या आप इस गाड़ी का रिकॉर्ड हटाना चाहते हैं?')) {
      setVehicles(vehicles.filter(v => v.id !== id));
    }
  };

  const totalServiceSpent = activeVeh?.serviceHistory.reduce((sum, s) => sum + s.cost, 0) || 0;

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-navy text-paper p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gold/20 text-gold rounded-xl">
              <Car size={20} />
            </span>
            <div>
              <h2 className="text-base font-bold font-serif">Personal Garage & Vehicles</h2>
              <p className="text-[11px] text-paper-dim/80">निजी कार/बाइक, सर्विस बिल, इंश्योरेंस व PUC एक्सपायरी अलर्ट</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddVehOpen(true)}
            className="px-3 py-1.5 bg-gold text-navy text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-gold-light active:scale-95 transition-all shadow-sm"
          >
            <Plus size={15} /> नई गाड़ी
          </button>
        </div>

        {/* Vehicle Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs pt-1 border-t border-navy-light/40">
          {vehicles.map(v => (
            <button
              key={v.id}
              onClick={() => setSelectedVehId(v.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedVehId === v.id ? 'bg-gold text-navy shadow-sm' : 'bg-navy-light/50 text-paper-dim hover:bg-navy-light'
              }`}
            >
              🚗 {v.brandModel} ({v.regNumber})
            </button>
          ))}
        </div>
      </div>

      {vehicles.length === 0 && (
        <div className="bg-paper border border-paper-dim rounded-2xl p-8 text-center shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-paper-dim/50 flex items-center justify-center mx-auto text-ink-muted">
            <Car size={24} />
          </div>
          <h3 className="text-sm font-bold text-ink">कोई गाड़ी दर्ज नहीं है</h3>
          <p className="text-xs text-ink-muted max-w-xs mx-auto">
            अपनी कार, बाइक या अन्य वाहन जोड़ें ताकि सर्विस रिकॉर्ड्स और इंश्योरेंस एक्सपायरी ट्रैक हो सके।
          </p>
          <button
            onClick={() => setIsAddVehOpen(true)}
            className="mt-2 px-4 py-2 bg-gold text-navy text-xs font-bold rounded-xl inline-flex items-center gap-1 hover:bg-gold-light"
          >
            <Plus size={15} /> नई गाड़ी जोड़ें
          </button>
        </div>
      )}

      {activeVeh && (
        <div className="space-y-3">
          {/* Active Vehicle Card */}
          <div className="bg-paper border border-paper-dim rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 bg-gold/15 text-gold-dark text-[10px] font-bold rounded uppercase">
                    {activeVeh.regNumber}
                  </span>
                  <span className="text-xs text-ink-muted">मालिक: <strong>{activeVeh.owner}</strong> • {activeVeh.fuelType}</span>
                </div>
                <h3 className="text-base font-bold text-ink mt-1">{activeVeh.brandModel}</h3>
              </div>

              <div className="text-right">
                <Mono className="text-sm font-bold text-ink">{activeVeh.currentOdometerKm.toLocaleString('en-IN')} KM</Mono>
                <p className="text-[10px] text-ink-muted">ओडोमीटर रीडिंग</p>
              </div>
            </div>

            {/* Compliance Alerts Grid */}
            <div className="grid grid-cols-2 gap-2 bg-paper-dim/40 p-2.5 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-gold-dark shrink-0" />
                <div>
                  <p className="text-[10px] text-ink-muted">इंश्योरेंस एक्सपायरी</p>
                  <p className="font-bold text-ink">{activeVeh.insuranceExpiry}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-coral shrink-0" />
                <div>
                  <p className="text-[10px] text-ink-muted">PUC प्रदूषण प्रमाण-पत्र</p>
                  <p className="font-bold text-ink">{activeVeh.pucExpiry}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-paper-dim text-xs">
              <span className="text-ink-muted">लाइफटाइम सर्विस ख़र्च: <Mono className="font-bold text-ink">₹{totalServiceSpent.toLocaleString('en-IN')}</Mono></span>
              <button
                onClick={() => setIsAddServiceOpen(true)}
                className="px-3 py-1 bg-gold text-navy font-bold rounded-lg hover:bg-gold-light"
              >
                + सर्विस एंट्री दर्ज करें
              </button>
            </div>
          </div>

          {/* Service History Log */}
          <div className="bg-paper border border-paper-dim rounded-2xl p-4 shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">सर्विस व रिपेयर इतिहास ({activeVeh.serviceHistory.length})</h4>
            {activeVeh.serviceHistory.length === 0 ? (
              <p className="text-xs text-ink-muted py-2">कोई सर्विस रिकॉर्ड दर्ज नहीं है।</p>
            ) : (
              activeVeh.serviceHistory.map(s => (
                <div key={s.id} className="flex justify-between items-center text-xs border-b border-paper-dim pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-ink">{s.workDone}</p>
                    <p className="text-[10px] text-ink-muted">{s.date} • {s.odometerKm} KM • {s.garageName}</p>
                  </div>
                  <Mono className="font-bold text-coral">₹{s.cost.toLocaleString('en-IN')}</Mono>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {isAddVehOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <h3 className="text-sm font-bold text-ink">गैराज में नई गाड़ी जोड़ें</h3>
            <form onSubmit={handleAddVehicle} className="space-y-3 text-xs">
              <div>
                <label className="block text-ink-muted mb-1">गाड़ी का मॉडल / नाम</label>
                <input
                  type="text"
                  placeholder="उदा. Hyundai Creta या Activa 6G"
                  value={brandModel}
                  onChange={e => setBrandModel(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">गाड़ी नंबर</label>
                  <input
                    type="text"
                    placeholder="UP32AB1234"
                    value={regNumber}
                    onChange={e => setRegNumber(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">प्रकार</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  >
                    <option value="car">कार (Car)</option>
                    <option value="bike">मोटरसाइकिल (Bike)</option>
                    <option value="scooter">स्कूटी (Scooter)</option>
                    <option value="tractor">ट्रैक्टर (Tractor)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">किसके नाम है?</label>
                  <select
                    value={owner}
                    onChange={e => setOwner(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  >
                    <option value="पापा">पापा</option>
                    <option value="मम्मी">मम्मी</option>
                    <option value="रोहन">रोहन</option>
                  </select>
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">ईंधन (Fuel)</label>
                  <select
                    value={fuelType}
                    onChange={e => setFuelType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  >
                    <option value="Petrol">पेट्रोल</option>
                    <option value="Diesel">डीजल</option>
                    <option value="CNG">CNG</option>
                    <option value="EV">इलेक्ट्रिक (EV)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">इंश्योरेंस एक्सपायरी</label>
                  <input
                    type="date"
                    value={insExpiry}
                    onChange={e => setInsExpiry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">PUC एक्सपायरी</label>
                  <input
                    type="date"
                    value={pucExpiry}
                    onChange={e => setPucExpiry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddVehOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gold text-navy font-bold hover:bg-gold-light"
                >
                  गाड़ी जोड़ें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {isAddServiceOpen && activeVeh && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <h3 className="text-sm font-bold text-ink">सर्विस / रिपेयर बिल दर्ज करें</h3>
            <form onSubmit={handleAddService} className="space-y-3 text-xs">
              <div>
                <label className="block text-ink-muted mb-1">क्या काम कराया (Work Done)</label>
                <input
                  type="text"
                  placeholder="उदा. 30K सर्विस + मोबिल ऑयल + ब्रेक पैड"
                  value={srvWork}
                  onChange={e => setSrvWork(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-ink-muted mb-1">सर्विस ख़र्च (₹)</label>
                  <input
                    type="number"
                    placeholder="4500"
                    value={srvCost}
                    onChange={e => setSrvCost(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-bold"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">ओडोमीटर (KM)</label>
                  <input
                    type="number"
                    placeholder="28000"
                    value={srvKm}
                    onChange={e => setSrvKm(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                  />
                </div>
              </div>
              <div>
                <label className="block text-ink-muted mb-1">वर्कशॉप / गैराज का नाम</label>
                <input
                  type="text"
                  placeholder="उदा. मारुति ऑथराइज्ड वर्कशॉप"
                  value={srvGarage}
                  onChange={e => setSrvGarage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddServiceOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-paper-dim text-ink font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gold text-navy font-bold"
                >
                  सर्विस सेव करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
