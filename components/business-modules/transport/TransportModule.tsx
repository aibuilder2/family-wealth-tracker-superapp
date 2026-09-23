'use client';

import React, { useState, useEffect } from 'react';
import { 
  Truck, Plus, Fuel, Wrench, IndianRupee, ShieldCheck, 
  Calendar, Clock, FileText, AlertTriangle, CheckCircle2, 
  Trash2, Filter, Layers, Zap, X
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

export type VehicleType = 'TAXI_AUTO' | 'TRUCK_TRAILER' | 'JCB_HEAVY';

export interface VehicleMaster {
  id: string;
  vehicleNumber: string;
  name: string; // e.g. "Swift Dzire Taxi", "JCB 3DX Super", "16-Wheeler BharatBenz"
  type: VehicleType;
  modelYear?: string;
  emiAmount?: number;
  emiDueDate?: string; // Day of month e.g. "10th"
  insuranceExpiry?: string;
  fitnessExpiry?: string;
  defaultHourlyRate?: number; // For JCB / Crane
}

export interface TransportTrip {
  id: string;
  vehicleId: string;
  vehicleNumber: string;
  type: VehicleType;
  partyName: string;
  routeOrSite: string; // Route for Taxi/Truck or Site Name for JCB
  // Billing basis:
  billingMode: 'FIXED_FREIGHT' | 'HOURLY';
  hoursWorked?: number;
  hourlyRate?: number;
  grossEarnings: number; // freightAmount or (hoursWorked * hourlyRate)
  // Expenses
  dieselExpense: number;
  tollExpense: number;
  driverBhatta: number;
  maintenanceExpense: number;
  notes?: string;
  status: 'PENDING' | 'RECEIVED';
  date: string;
}

const INITIAL_VEHICLES: VehicleMaster[] = [
  {
    id: 'v-1',
    vehicleNumber: 'RJ-20-TA-1008',
    name: 'Ertiga Taxi (Company Contract)',
    type: 'TAXI_AUTO',
    emiAmount: 14500,
    emiDueDate: '10th',
    insuranceExpiry: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
    fitnessExpiry: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
  },
  {
    id: 'v-2',
    vehicleNumber: 'RJ-20-GA-4581',
    name: '14-Wheeler Heavy Trailer',
    type: 'TRUCK_TRAILER',
    emiAmount: 42000,
    emiDueDate: '15th',
    insuranceExpiry: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0], // Alert soon
    fitnessExpiry: new Date(Date.now() + 120 * 86400000).toISOString().split('T')[0],
  },
  {
    id: 'v-3',
    vehicleNumber: 'RJ-20-EA-9922',
    name: 'JCB 3DX Excavator',
    type: 'JCB_HEAVY',
    emiAmount: 28000,
    emiDueDate: '5th',
    defaultHourlyRate: 1400,
    insuranceExpiry: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
  },
];

const INITIAL_TRIPS: TransportTrip[] = [
  {
    id: 't-1',
    vehicleId: 'v-2',
    vehicleNumber: 'RJ-20-GA-4581',
    type: 'TRUCK_TRAILER',
    partyName: 'Shree Ram Cement Logistics',
    routeOrSite: 'Kota ➔ Ahmedabad',
    billingMode: 'FIXED_FREIGHT',
    grossEarnings: 52000,
    dieselExpense: 19500,
    tollExpense: 3400,
    driverBhatta: 2500,
    maintenanceExpense: 800,
    status: 'RECEIVED',
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 't-2',
    vehicleId: 'v-3',
    vehicleNumber: 'RJ-20-EA-9922',
    type: 'JCB_HEAVY',
    partyName: 'Highway Fourlane Construction',
    routeOrSite: 'Bypass Flyover Excavation',
    billingMode: 'HOURLY',
    hoursWorked: 8.5,
    hourlyRate: 1400,
    grossEarnings: 11900,
    dieselExpense: 4200,
    tollExpense: 0,
    driverBhatta: 800,
    maintenanceExpense: 500,
    status: 'PENDING',
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 't-3',
    vehicleId: 'v-1',
    vehicleNumber: 'RJ-20-TA-1008',
    type: 'TAXI_AUTO',
    partyName: 'Tata Power Corp (Staff Duty)',
    routeOrSite: 'Kota Plant Local Duty',
    billingMode: 'FIXED_FREIGHT',
    grossEarnings: 2800,
    dieselExpense: 900,
    tollExpense: 120,
    driverBhatta: 300,
    maintenanceExpense: 0,
    status: 'RECEIVED',
    date: new Date().toISOString().split('T')[0],
  },
];

export default function TransportModule() {
  const [vehicles, setVehicles] = useState<VehicleMaster[]>(INITIAL_VEHICLES);
  const [trips, setTrips] = useState<TransportTrip[]>(INITIAL_TRIPS);
  const [activeTab, setActiveTab] = useState<'ENTRIES' | 'FLEET_VEHICLES' | 'REPORTS'>('ENTRIES');
  const [selectedVehicleFilter, setSelectedVehicleFilter] = useState<string>('ALL');

  // Modals
  const [showAddTripModal, setShowAddTripModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);

  // New Trip Form State
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [partyName, setPartyName] = useState('');
  const [routeOrSite, setRouteOrSite] = useState('');
  const [billingMode, setBillingMode] = useState<'FIXED_FREIGHT' | 'HOURLY'>('FIXED_FREIGHT');
  const [grossEarnings, setGrossEarnings] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [dieselExpense, setDieselExpense] = useState('');
  const [tollExpense, setTollExpense] = useState('');
  const [driverBhatta, setDriverBhatta] = useState('');
  const [maintenanceExpense, setMaintenanceExpense] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'RECEIVED'>('PENDING');

  // New Vehicle Master State
  const [newVehNumber, setNewVehNumber] = useState('');
  const [newVehName, setNewVehName] = useState('');
  const [newVehType, setNewVehType] = useState<VehicleType>('TRUCK_TRAILER');
  const [newVehEmi, setNewVehEmi] = useState('');
  const [newVehHourlyRate, setNewVehHourlyRate] = useState('');
  const [newVehInsurance, setNewVehInsurance] = useState('');

  // Load from local storage
  useEffect(() => {
    try {
      const savedV = localStorage.getItem('fwa_transport_vehicles_v2');
      if (savedV) setVehicles(JSON.parse(savedV));
      const savedT = localStorage.getItem('fwa_transport_trips_v2');
      if (savedT) setTrips(JSON.parse(savedT));
    } catch (e) {}
  }, []);

  const saveVehicles = (vList: VehicleMaster[]) => {
    setVehicles(vList);
    try { localStorage.setItem('fwa_transport_vehicles_v2', JSON.stringify(vList)); } catch (e) {}
  };

  const saveTrips = (tList: TransportTrip[]) => {
    setTrips(tList);
    try { localStorage.setItem('fwa_transport_trips_v2', JSON.stringify(tList)); } catch (e) {}
  };

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehNumber.trim() || !newVehName.trim()) return;

    const newV: VehicleMaster = {
      id: 'v-' + Date.now(),
      vehicleNumber: newVehNumber.trim().toUpperCase(),
      name: newVehName.trim(),
      type: newVehType,
      emiAmount: Number(newVehEmi) || 0,
      defaultHourlyRate: Number(newVehHourlyRate) || (newVehType === 'JCB_HEAVY' ? 1400 : undefined),
      insuranceExpiry: newVehInsurance || undefined,
    };

    saveVehicles([...vehicles, newV]);
    setShowAddVehicleModal(false);
    setNewVehNumber('');
    setNewVehName('');
    setNewVehEmi('');
    setNewVehHourlyRate('');
    setNewVehInsurance('');
  };

  const handleSaveTrip = (e: React.FormEvent) => {
    e.preventDefault();
    const veh = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];
    if (!veh) return;

    let finalEarnings = 0;
    if (billingMode === 'HOURLY') {
      finalEarnings = (Number(hoursWorked) || 0) * (Number(hourlyRate) || veh.defaultHourlyRate || 1400);
    } else {
      finalEarnings = Number(grossEarnings) || 0;
    }

    const newTrip: TransportTrip = {
      id: 'trip-' + Date.now(),
      vehicleId: veh.id,
      vehicleNumber: veh.vehicleNumber,
      type: veh.type,
      partyName: partyName.trim() || 'General Party',
      routeOrSite: routeOrSite.trim() || (veh.type === 'JCB_HEAVY' ? 'Site Duty' : 'Transport Route'),
      billingMode,
      hoursWorked: billingMode === 'HOURLY' ? Number(hoursWorked) : undefined,
      hourlyRate: billingMode === 'HOURLY' ? Number(hourlyRate) : undefined,
      grossEarnings: finalEarnings,
      dieselExpense: Number(dieselExpense) || 0,
      tollExpense: Number(tollExpense) || 0,
      driverBhatta: Number(driverBhatta) || 0,
      maintenanceExpense: Number(maintenanceExpense) || 0,
      status: paymentStatus,
      date: new Date().toISOString().split('T')[0],
    };

    saveTrips([newTrip, ...trips]);
    setShowAddTripModal(false);

    // Reset Form
    setPartyName('');
    setRouteOrSite('');
    setGrossEarnings('');
    setHoursWorked('');
    setHourlyRate('');
    setDieselExpense('');
    setTollExpense('');
    setDriverBhatta('');
    setMaintenanceExpense('');
  };

  // Filtered Trips
  const filteredTrips = trips.filter(t => {
    if (selectedVehicleFilter === 'ALL') return true;
    return t.vehicleId === selectedVehicleFilter;
  });

  // KPI Calculations
  const totalEarnings = filteredTrips.reduce((sum, t) => sum + t.grossEarnings, 0);
  const totalDiesel = filteredTrips.reduce((sum, t) => sum + t.dieselExpense, 0);
  const totalToll = filteredTrips.reduce((sum, t) => sum + t.tollExpense, 0);
  const totalDriverBhatta = filteredTrips.reduce((sum, t) => sum + t.driverBhatta, 0);
  const totalMaintenance = filteredTrips.reduce((sum, t) => sum + t.maintenanceExpense, 0);
  const totalExpenses = totalDiesel + totalToll + totalDriverBhatta + totalMaintenance;
  const netProfit = totalEarnings - totalExpenses;
  const pendingRecovery = filteredTrips.filter(t => t.status === 'PENDING').reduce((sum, t) => sum + t.grossEarnings, 0);

  return (
    <div className="space-y-4">
      {/* 🚀 Main Header & ERP Overview */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Truck className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm">ट्रांसपोर्ट व मशीनरी ERP</h3>
                <span className="text-[9px] bg-blue-500/30 text-blue-200 px-1.5 py-0.2 rounded font-mono">
                  {vehicles.length} गाड़ियाँ
                </span>
              </div>
              <p className="text-[11px] text-blue-200">टैक्सी, ट्रेलर व JCB प्रति-घंटा व डीज़ल शुद्ध हिसाब</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedVehicleId(vehicles[0]?.id || '');
                setShowAddTripModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs flex items-center gap-1 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <Plus size={14} /> + नई ट्रिप / घंटे
            </button>
            <button
              onClick={() => setShowAddVehicleModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
            >
              <Layers size={13} /> + नई गाड़ी जोड़ें
            </button>
          </div>
        </div>

        {/* 📊 KPI Summary Strip */}
        <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-white/15 text-center">
          <div>
            <span className="text-[10px] text-blue-200">कुल कमाई</span>
            <Mono className="text-xs font-bold text-white block">₹{totalEarnings.toLocaleString('en-IN')}</Mono>
          </div>
          <div>
            <span className="text-[10px] text-blue-200">डीज़ल व मेंटेनेंस</span>
            <Mono className="text-xs font-bold text-rose-300 block">₹{totalExpenses.toLocaleString('en-IN')}</Mono>
          </div>
          <div>
            <span className="text-[10px] text-blue-200">शुद्ध मुनाफ़ा</span>
            <Mono className="text-xs font-bold text-emerald-300 block">₹{netProfit.toLocaleString('en-IN')}</Mono>
          </div>
          <div>
            <span className="text-[10px] text-amber-200">मार्केट बाकी</span>
            <Mono className="text-xs font-bold text-amber-300 block">₹{pendingRecovery.toLocaleString('en-IN')}</Mono>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center justify-between gap-2 border-b border-paper-dim pb-1 text-xs">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('ENTRIES')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'ENTRIES' ? 'bg-navy text-gold-soft' : 'text-ink-muted hover:bg-paper-dim'
            }`}
          >
            दैनिक फेरे व काम ({trips.length})
          </button>
          <button
            onClick={() => setActiveTab('FLEET_VEHICLES')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'FLEET_VEHICLES' ? 'bg-navy text-gold-soft' : 'text-ink-muted hover:bg-paper-dim'
            }`}
          >
            गाड़ी लिस्ट व EMI ({vehicles.length})
          </button>
        </div>

        {/* Vehicle Filter Selector */}
        {activeTab === 'ENTRIES' && (
          <select
            value={selectedVehicleFilter}
            onChange={(e) => setSelectedVehicleFilter(e.target.value)}
            className="px-2 py-1 bg-paper border border-paper-dim rounded-lg text-[11px] font-bold text-ink outline-none"
          >
            <option value="ALL">सभी गाड़ियाँ व मशीनें</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.vehicleNumber} ({v.name})</option>
            ))}
          </select>
        )}
      </div>

      {/* TAB 1: TRIPS & DAILY WORK */}
      {activeTab === 'ENTRIES' && (
        <div className="space-y-2.5">
          {filteredTrips.length === 0 ? (
            <div className="p-8 text-center text-ink-muted text-xs bg-paper rounded-xl border border-paper-dim">
              इस फ़िल्टर में कोई ट्रिप दर्ज नहीं है। ऊपर '+ नई ट्रिप / घंटे' दबाएं।
            </div>
          ) : (
            filteredTrips.map(trip => {
              const tripExp = trip.dieselExpense + trip.tollExpense + trip.driverBhatta + trip.maintenanceExpense;
              const tripProfit = trip.grossEarnings - tripExp;

              return (
                <div key={trip.id} className="p-3.5 bg-paper rounded-xl border border-paper-dim shadow-xs space-y-2 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-navy bg-navy/10 px-1.5 py-0.5 rounded text-[10px]">
                          {trip.vehicleNumber}
                        </span>
                        <span className="font-bold text-ink text-xs">{trip.partyName}</span>
                      </div>
                      <p className="text-[11px] text-ink-muted mt-0.5">
                        {trip.billingMode === 'HOURLY' ? `⏱️ ${trip.hoursWorked} घंटे @ ₹${trip.hourlyRate}/घंटा` : `📍 ${trip.routeOrSite}`}
                      </p>
                    </div>

                    <div className="text-right">
                      <Mono className="font-bold text-emerald-700 text-sm block">
                        ₹{trip.grossEarnings.toLocaleString('en-IN')}
                      </Mono>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        trip.status === 'RECEIVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {trip.status === 'RECEIVED' ? '✓ भाड़ा जमा' : 'बाकी (Pending)'}
                      </span>
                    </div>
                  </div>

                  {/* Expense Breakdown Bar */}
                  <div className="bg-paper-dim/40 rounded-lg p-2 flex items-center justify-between text-[10px] text-ink-muted">
                    <span>डीज़ल: ₹{trip.dieselExpense}</span>
                    <span>टोल: ₹{trip.tollExpense}</span>
                    <span>ड्राइवर: ₹{trip.driverBhatta}</span>
                    {trip.maintenanceExpense > 0 && <span>मरम्मत: ₹{trip.maintenanceExpense}</span>}
                    <span className="font-bold text-ink">बचत: ₹{tripProfit}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: FLEET VEHICLES & MACHINE MASTER */}
      {activeTab === 'FLEET_VEHICLES' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vehicles.map(v => {
              const vTrips = trips.filter(t => t.vehicleId === v.id);
              const vEarn = vTrips.reduce((s, t) => s + t.grossEarnings, 0);
              const vExp = vTrips.reduce((s, t) => s + t.dieselExpense + t.tollExpense + t.driverBhatta + t.maintenanceExpense, 0);

              return (
                <div key={v.id} className="p-3.5 bg-paper rounded-xl border border-paper-dim shadow-xs space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-paper-dim pb-2">
                    <div>
                      <h4 className="font-bold text-ink">{v.name}</h4>
                      <p className="font-mono text-gold font-semibold text-[11px]">{v.vehicleNumber}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                      {v.type === 'JCB_HEAVY' ? '🏗️ जेसीबी/मशीन' : (v.type === 'TAXI_AUTO' ? '🚖 टैक्सी' : '🚛 ट्रेलर')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <span className="text-ink-muted">मासिक EMI: <b className="text-ink">₹{v.emiAmount?.toLocaleString('en-IN') || 0}</b></span>
                    <span className="text-ink-muted">किस्त तारीख: <b className="text-ink">{v.emiDueDate || 'N/A'}</b></span>
                    {v.defaultHourlyRate && (
                      <span className="text-ink-muted">घंटा रेट: <b className="text-emerald-700">₹{v.defaultHourlyRate}/hr</b></span>
                    )}
                    <span className="text-ink-muted">बीमा एक्सपायरी: <b className="text-ink">{v.insuranceExpiry || 'N/A'}</b></span>
                  </div>

                  <div className="pt-1.5 border-t border-paper-dim flex justify-between text-[11px] font-medium">
                    <span>कुल ट्रिप्स: <b>{vTrips.length}</b></span>
                    <span>नेट मुनाफा: <b className="text-emerald-700">₹{(vEarn - vExp).toLocaleString('en-IN')}</b></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ➕ MODAL: ADD TRIP / HOURS */}
      {showAddTripModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper rounded-2xl max-w-sm w-full p-5 space-y-3.5 border border-paper-dim shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-paper-dim pb-2">
              <h4 className="font-bold text-sm text-ink">नई ट्रिप या जेसीबी घंटा प्रविष्टि</h4>
              <button onClick={() => setShowAddTripModal(false)} className="text-ink-muted hover:text-ink"><X size={16} /></button>
            </div>

            <form onSubmit={handleSaveTrip} className="space-y-3 text-xs">
              {/* Select Vehicle */}
              <div>
                <label className="block font-bold text-ink mb-1">गाड़ी या मशीन चुनें *</label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedVehicleId(id);
                    const v = vehicles.find(item => item.id === id);
                    if (v?.type === 'JCB_HEAVY') {
                      setBillingMode('HOURLY');
                      setHourlyRate(String(v.defaultHourlyRate || 1400));
                    } else {
                      setBillingMode('FIXED_FREIGHT');
                    }
                  }}
                  className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-bold text-ink"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.vehicleNumber} — {v.name}</option>
                  ))}
                </select>
              </div>

              {/* Mode Selection */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBillingMode('FIXED_FREIGHT')}
                  className={`py-1.5 rounded-lg font-bold border transition-all ${
                    billingMode === 'FIXED_FREIGHT' ? 'bg-navy text-gold-soft border-navy' : 'bg-paper text-ink-muted border-paper-dim'
                  }`}
                >
                  फिक्स भाड़ा (Freight)
                </button>
                <button
                  type="button"
                  onClick={() => setBillingMode('HOURLY')}
                  className={`py-1.5 rounded-lg font-bold border transition-all ${
                    billingMode === 'HOURLY' ? 'bg-navy text-gold-soft border-navy' : 'bg-paper text-ink-muted border-paper-dim'
                  }`}
                >
                  घंटे के हिसाब से (JCB)
                </button>
              </div>

              {billingMode === 'HOURLY' ? (
                <div className="grid grid-cols-2 gap-2 bg-paper-dim/30 p-2.5 rounded-xl border border-paper-dim">
                  <div>
                    <label className="block font-semibold mb-1">कुल घंटे (Hours) *</label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      placeholder="उदा. 8.5"
                      value={hoursWorked}
                      onChange={(e) => setHoursWorked(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-paper rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">प्रति घंटा रेट (₹/hr) *</label>
                    <input
                      type="number"
                      required
                      placeholder="उदा. 1400"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-paper rounded-lg font-bold"
                    />
                  </div>
                  <div className="col-span-2 text-right text-[11px] font-bold text-emerald-800">
                    कुल कमाई: ₹{((Number(hoursWorked) || 0) * (Number(hourlyRate) || 0)).toLocaleString('en-IN')}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block font-semibold mb-1">कुल तय भाड़ा ₹ *</label>
                  <input
                    type="number"
                    required
                    placeholder="उदा. 45000"
                    value={grossEarnings}
                    onChange={(e) => setGrossEarnings(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-bold text-sm"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">पार्टी का नाम</label>
                  <input
                    type="text"
                    placeholder="उदा. अल्ट्राटेक, शर्मा जी"
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-paper-dim/40 border border-paper-dim rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">रूट या साइट</label>
                  <input
                    type="text"
                    placeholder="उदा. कोटा ➔ जयपुर"
                    value={routeOrSite}
                    onChange={(e) => setRouteOrSite(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-paper-dim/40 border border-paper-dim rounded-xl"
                  />
                </div>
              </div>

              {/* Expenses Breakdown */}
              <div className="space-y-1.5 bg-paper-dim/20 p-2.5 rounded-xl border border-paper-dim">
                <span className="font-bold text-[10px] text-ink-muted uppercase">इस ट्रिप के खर्चे</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="डीज़ल खर्च ₹"
                    value={dieselExpense}
                    onChange={(e) => setDieselExpense(e.target.value)}
                    className="w-full px-2 py-1.5 bg-paper border border-paper-dim rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="टोल टैक्स ₹"
                    value={tollExpense}
                    onChange={(e) => setTollExpense(e.target.value)}
                    className="w-full px-2 py-1.5 bg-paper border border-paper-dim rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="ड्राइवर भत्ता ₹"
                    value={driverBhatta}
                    onChange={(e) => setDriverBhatta(e.target.value)}
                    className="w-full px-2 py-1.5 bg-paper border border-paper-dim rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="मरम्मत/ग्रीसिंग ₹"
                    value={maintenanceExpense}
                    onChange={(e) => setMaintenanceExpense(e.target.value)}
                    className="w-full px-2 py-1.5 bg-paper border border-paper-dim rounded-lg"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentStatus('RECEIVED')}
                  className={`flex-1 py-1.5 rounded-lg font-bold border transition-all ${
                    paymentStatus === 'RECEIVED' ? 'bg-emerald-700 text-white' : 'bg-paper text-ink-muted'
                  }`}
                >
                  ✓ पेमेंट मिल गया
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentStatus('PENDING')}
                  className={`flex-1 py-1.5 rounded-lg font-bold border transition-all ${
                    paymentStatus === 'PENDING' ? 'bg-amber-600 text-white' : 'bg-paper text-ink-muted'
                  }`}
                >
                  ⏳ उधारी बाकी है
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddTripModal(false)} className="flex-1 py-2 rounded-xl border border-paper-dim font-bold text-ink-muted">रद्द</button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold">सेव करें</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ➕ MODAL: ADD VEHICLE MASTER */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper rounded-2xl max-w-sm w-full p-5 space-y-3.5 border border-paper-dim shadow-2xl">
            <div className="flex justify-between items-center border-b border-paper-dim pb-2">
              <h4 className="font-bold text-sm text-ink">नई गाड़ी या मशीन मास्टर जोड़ें</h4>
              <button onClick={() => setShowAddVehicleModal(false)} className="text-ink-muted hover:text-ink"><X size={16} /></button>
            </div>

            <form onSubmit={handleCreateVehicle} className="space-y-2.5 text-xs">
              <input
                type="text"
                required
                placeholder="गाड़ी नंबर (e.g. RJ-20-GA-9999)"
                value={newVehNumber}
                onChange={(e) => setNewVehNumber(e.target.value)}
                className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-bold uppercase"
              />
              <input
                type="text"
                required
                placeholder="गाड़ी का नाम (उदा. बोलेरो पिकअप, JCB 3DX)"
                value={newVehName}
                onChange={(e) => setNewVehName(e.target.value)}
                className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-medium"
              />
              <select
                value={newVehType}
                onChange={(e) => setNewVehType(e.target.value as VehicleType)}
                className="w-full px-3 py-2 bg-paper-dim/40 border border-paper-dim rounded-xl font-semibold"
              >
                <option value="TRUCK_TRAILER">🚛 भारी ट्रक / ट्रेलर / डंपर</option>
                <option value="JCB_HEAVY">🏗️ JCB / पोकलेन / क्रेन (प्रति घंटा मशीन)</option>
                <option value="TAXI_AUTO">🚖 ऑटो / टैक्सी / ई-रिक्शा</option>
              </select>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="मासिक EMI ₹"
                  value={newVehEmi}
                  onChange={(e) => setNewVehEmi(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-paper-dim/40 border border-paper-dim rounded-xl font-medium"
                />
                <input
                  type="number"
                  placeholder="डिफ़ॉल्ट घंटा रेट ₹"
                  value={newVehHourlyRate}
                  onChange={(e) => setNewVehHourlyRate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-paper-dim/40 border border-paper-dim rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] text-ink-muted font-bold mb-0.5">बीमा एक्सपायरी तारीख</label>
                <input
                  type="date"
                  value={newVehInsurance}
                  onChange={(e) => setNewVehInsurance(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-paper-dim/40 border border-paper-dim rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddVehicleModal(false)} className="flex-1 py-2 rounded-xl border border-paper-dim font-bold text-ink-muted">रद्द</button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-navy text-gold font-bold">गाड़ी जोड़ें</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
