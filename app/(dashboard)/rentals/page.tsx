"use client";

import { useState } from "react";
import { useFamilyStore } from "@/lib/store/familyStore";
import {
  Building,
  Home,
  Users,
  Bed,
  DollarSign,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Zap,
  Utensils,
  Wifi,
  Phone,
  Share2,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Percent,
  Trash2
} from "lucide-react";
import { RentalProperty, RentalPropertyType, HostelRoom, RentalTenant, RentalExpense } from "@/types";

export default function RentalsPage() {
  const { rentalProperties, addRentalProperty, addHostelRoom, addRentalTenant, collectRentPayment, addRentalExpense } = useFamilyStore();
  
  const [selectedPropId, setSelectedPropId] = useState<string>(rentalProperties[0]?.id || "");
  const [activeTab, setActiveTab] = useState<"rooms_beds" | "tenants" | "expenses" | "submeter">("rooms_beds");
  
  // Modals
  const [showAddPropModal, setShowAddPropModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  // New Property Form State
  const [newPropTitle, setNewPropTitle] = useState("");
  const [newPropType, setNewPropType] = useState<RentalPropertyType>("pg_hostel");
  const [newPropAddress, setNewPropAddress] = useState("");
  const [newPropCity, setNewPropCity] = useState("Delhi NCR");
  const [newPropTargetRev, setNewPropTargetRev] = useState(60000);
  const [newPropNotes, setNewPropNotes] = useState("");

  // New Room Form State
  const [newRoomNo, setNewRoomNo] = useState("");
  const [newRoomFloor, setNewRoomFloor] = useState("First Floor");
  const [newRoomSharing, setNewRoomSharing] = useState<"single" | "double" | "triple" | "four_sharing">("double");
  const [newRoomRentPerBed, setNewRoomRentPerBed] = useState(8000);
  const [newRoomSubMeterReading, setNewRoomSubMeterReading] = useState(100);

  // New Tenant Form State
  const [newTenantName, setNewTenantName] = useState("");
  const [newTenantPhone, setNewTenantPhone] = useState("");
  const [newTenantAadhaar, setNewTenantAadhaar] = useState("");
  const [newTenantRent, setNewTenantRent] = useState(8000);
  const [newTenantDeposit, setNewTenantDeposit] = useState(10000);
  const [newTenantDueDay, setNewTenantDueDay] = useState(5);
  const [newTenantRoomNo, setNewTenantRoomNo] = useState("");
  const [newTenantBedId, setNewTenantBedId] = useState("");
  const [newTenantFood, setNewTenantFood] = useState(true);

  // New Expense Form State
  const [newExpCat, setNewExpCat] = useState<RentalExpense["category"]>("cook_salary");
  const [newExpAmount, setNewExpAmount] = useState(12000);
  const [newExpNote, setNewExpNote] = useState("");

  // Submeter Quick Calculator
  const [meterPrevUnit, setMeterPrevUnit] = useState<number>(1420);
  const [meterCurrUnit, setMeterCurrUnit] = useState<number>(1530);
  const [meterRate, setMeterRate] = useState<number>(9);

  const activeProperty = rentalProperties.find(p => p.id === selectedPropId) || rentalProperties[0];

  // Overall Portfolio Calculations
  const totalMonthlyTarget = rentalProperties.reduce((sum, p) => sum + (p.monthly_target_revenue || 0), 0);
  const totalDeposits = rentalProperties.reduce((sum, p) => sum + (p.security_deposit_holding || 0), 0);
  
  let totalBedsCount = 0;
  let occupiedBedsCount = 0;
  rentalProperties.forEach(p => {
    if (p.has_hostel_model && p.rooms) {
      p.rooms.forEach(rm => {
        rm.beds.forEach(b => {
          totalBedsCount++;
          if (b.status === "occupied") occupiedBedsCount++;
        });
      });
    }
  });

  const overallOccupancyPct = totalBedsCount > 0 ? Math.round((occupiedBedsCount / totalBedsCount) * 100) : 100;

  // Active Property Calculations
  const activeTenants = activeProperty?.tenants || [];
  const activeExpenses = activeProperty?.expenses || [];
  const activeRooms = activeProperty?.rooms || [];

  const totalCollectedThisMonth = activeTenants
    .filter(t => t.rent_status === "paid")
    .reduce((sum, t) => sum + Number(t.monthly_rent || 0), 0);

  const totalPendingRent = activeTenants
    .filter(t => t.rent_status !== "paid")
    .reduce((sum, t) => sum + Number(t.monthly_rent || 0), 0);

  const totalExpensesAmount = activeExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const netCashflow = totalCollectedThisMonth - totalExpensesAmount;

  // Handler: Create Property
  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropTitle) return;
    addRentalProperty({
      title: newPropTitle,
      property_type: newPropType,
      address: newPropAddress,
      city: newPropCity,
      total_units_or_rooms: 1,
      total_capacity_beds: newPropType === "pg_hostel" ? 6 : 1,
      has_hostel_model: newPropType === "pg_hostel",
      monthly_target_revenue: Number(newPropTargetRev),
      security_deposit_holding: 0,
      notes: newPropNotes,
      rooms: newPropType === "pg_hostel" ? [] : undefined
    });
    setShowAddPropModal(false);
    setNewPropTitle("");
  };

  // Handler: Add Room
  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNo || !activeProperty) return;
    
    const bedCount = newRoomSharing === "single" ? 1 : newRoomSharing === "double" ? 2 : newRoomSharing === "triple" ? 3 : 4;
    const bedLetters = ["A", "B", "C", "D"];
    const generatedBeds = [];

    for (let i = 0; i < bedCount; i++) {
      generatedBeds.push({
        id: `b-${newRoomNo}-${bedLetters[i]}`,
        room_number: newRoomNo,
        bed_number: `Bed ${bedLetters[i]}`,
        monthly_rent: Number(newRoomRentPerBed),
        status: "vacant" as const,
        food_included: true
      });
    }

    addHostelRoom(activeProperty.id, {
      room_number: `Room ${newRoomNo}`,
      floor: newRoomFloor,
      sharing_type: newRoomSharing,
      total_beds: bedCount,
      sub_meter_last_reading: Number(newRoomSubMeterReading),
      sub_meter_current_reading: Number(newRoomSubMeterReading),
      electricity_rate_per_unit: 9,
      beds: generatedBeds
    });

    setShowAddRoomModal(false);
    setNewRoomNo("");
  };

  // Handler: Add Tenant
  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName || !activeProperty) return;

    addRentalTenant(activeProperty.id, {
      name: newTenantName,
      phone: newTenantPhone,
      aadhaar_no: newTenantAadhaar,
      joining_date: new Date().toISOString().split("T")[0],
      monthly_rent: Number(newTenantRent),
      security_deposit: Number(newTenantDeposit),
      rent_due_day: Number(newTenantDueDay),
      rent_status: "paid",
      food_included: newTenantFood,
      room_number: newTenantRoomNo,
      bed_id: newTenantBedId,
      last_paid_date: new Date().toISOString().split("T")[0]
    });

    setShowAddTenantModal(false);
    setNewTenantName("");
    setNewTenantPhone("");
  };

  // Handler: Add Expense
  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProperty || !newExpAmount) return;

    addRentalExpense(activeProperty.id, {
      category: newExpCat,
      amount: Number(newExpAmount),
      date: new Date().toISOString().split("T")[0],
      note: newExpNote || `${newExpCat} payment`
    });

    setShowAddExpenseModal(false);
    setNewExpNote("");
  };

  // WhatsApp Receipt Link
  const getWhatsAppReceiptUrl = (tenant: RentalTenant) => {
    const text = `*RENT RECEIPT - ${activeProperty?.title}*\n\nNamaste ${tenant.name} ji,\nAapka is mahine ka rent ₹${tenant.monthly_rent.toLocaleString('en-IN')} safaltapurvak receive ho gaya hai.\n\n• Room/Bed: ${tenant.room_number || 'N/A'} ${tenant.bed_number || ''}\n• Status: PAID ✅\n• Date: ${tenant.last_paid_date || new Date().toISOString().split('T')[0]}\n\nDhanyawad! 🙏`;
    return `https://wa.me/${tenant.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200 p-4 md:p-8 font-sans pb-28">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            <Building className="w-4 h-4" /> Real Estate, PG & Hostel Business Hub
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Rental Properties, PG & Hostel Manager
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            फ्लैट, दुकान, पीजी एवं हॉस्टल के कमरों, बेड्स, बिजली सब-मीटर और किरायेदार का पूरा हिसाब-किताब।
          </p>
        </div>

        <button
          onClick={() => setShowAddPropModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Property / Hostel
        </button>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#111827] border border-slate-800 p-4 md:p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">कुल मासिक किराया टारगेट</span>
          <div className="text-xl md:text-2xl font-black text-white mt-1">
            ₹{totalMonthlyTarget.toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">सभी {rentalProperties.length} संपत्तियों से</p>
        </div>

        <div className="bg-[#111827] border border-slate-800 p-4 md:p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">इस महीने कलेक्ट हुआ</span>
          <div className="text-xl md:text-2xl font-black text-emerald-400 mt-1">
            ₹{totalCollectedThisMonth.toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">पेंडिंग: ₹{totalPendingRent.toLocaleString("en-IN")}</p>
        </div>

        <div className="bg-[#111827] border border-slate-800 p-4 md:p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">कुल सिक्योरिटी डिपॉजिट (Advance)</span>
          <div className="text-xl md:text-2xl font-black text-amber-400 mt-1">
            ₹{totalDeposits.toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">सुरक्षित जमा पूंजी (Refundable)</p>
        </div>

        <div className="bg-[#111827] border border-slate-800 p-4 md:p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">PG/Hostel बेड ऑक्यूपेंसी</span>
          <div className="text-xl md:text-2xl font-black text-blue-400 mt-1">
            {overallOccupancyPct}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{occupiedBedsCount} भरे / {totalBedsCount} कुल बेड्स</p>
        </div>
      </div>

      {/* Property Selector Pills */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 pb-2">
        {rentalProperties.map((prop) => (
          <button
            key={prop.id}
            onClick={() => setSelectedPropId(prop.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
              selectedPropId === prop.id
                ? "bg-amber-500 text-slate-950 border-amber-500 shadow-lg shadow-amber-500/20"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <span>{prop.has_hostel_model ? "🏢" : "🏠"}</span>
            <span>{prop.title}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20 font-mono">
              ₹{(prop.monthly_target_revenue || 0).toLocaleString("en-IN")}
            </span>
          </button>
        ))}
      </div>

      {activeProperty ? (
        <div className="space-y-6">
          {/* Active Property Banner */}
          <div className="bg-gradient-to-r from-blue-950/40 via-[#111827] to-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 rounded-full font-bold text-[10px] uppercase">
                  {activeProperty.property_type.replace('_', ' ')}
                </span>
                {activeProperty.has_hostel_model && (
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full font-bold text-[10px] uppercase">
                    Hostel & PG Model Enabled
                  </span>
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white mt-1">{activeProperty.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{activeProperty.address}, {activeProperty.city}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {activeProperty.has_hostel_model && (
                <button
                  onClick={() => setShowAddRoomModal(true)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow"
                >
                  <Plus className="w-4 h-4" /> Add Room
                </button>
              )}
              <button
                onClick={() => setShowAddTenantModal(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow"
              >
                <Users className="w-4 h-4" /> Add Tenant
              </button>
              <button
                onClick={() => setShowAddExpenseModal(true)}
                className="px-3.5 py-2 bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow"
              >
                <DollarSign className="w-4 h-4" /> Add Expense
              </button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex border-b border-slate-800">
            {activeProperty.has_hostel_model && (
              <button
                onClick={() => setActiveTab("rooms_beds")}
                className={`px-5 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === "rooms_beds"
                    ? "border-amber-500 text-amber-400 bg-amber-500/10"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Bed className="w-4 h-4" /> Rooms & Bed Matrix ({activeRooms.length} Rooms)
              </button>
            )}

            <button
              onClick={() => setActiveTab("tenants")}
              className={`px-5 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === "tenants"
                  ? "border-amber-500 text-amber-400 bg-amber-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Users className="w-4 h-4" /> Tenants ({activeTenants.length})
            </button>

            <button
              onClick={() => setActiveTab("expenses")}
              className={`px-5 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === "expenses"
                  ? "border-amber-500 text-amber-400 bg-amber-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <DollarSign className="w-4 h-4" /> Expenses & Staff ({activeExpenses.length})
            </button>

            {activeProperty.has_hostel_model && (
              <button
                onClick={() => setActiveTab("submeter")}
                className={`px-5 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === "submeter"
                    ? "border-amber-500 text-amber-400 bg-amber-500/10"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Zap className="w-4 h-4" /> Electricity Sub-meter Calculator
              </button>
            )}
          </div>

          {/* TAB 1: Rooms & Beds Matrix */}
          {activeTab === "rooms_beds" && activeProperty.has_hostel_model && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeRooms.map((room) => {
                const roomOccupied = room.beds.filter(b => b.status === "occupied").length;
                return (
                  <div key={room.id} className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{room.floor}</span>
                        <h3 className="text-lg font-black text-white">{room.room_number}</h3>
                        <p className="text-xs text-slate-400 capitalize">{room.sharing_type.replace('_', ' ')} Sharing</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        roomOccupied === room.total_beds
                          ? "bg-rose-500/20 text-rose-300"
                          : roomOccupied > 0
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-emerald-500/20 text-emerald-300"
                      }`}>
                        {roomOccupied} / {room.total_beds} Occupied
                      </span>
                    </div>

                    {/* Bed List */}
                    <div className="space-y-2">
                      {room.beds.map((bed) => (
                        <div
                          key={bed.id}
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                            bed.status === "occupied"
                              ? "bg-[#0B0F19] border-slate-800 text-slate-200"
                              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Bed className="w-4 h-4 text-slate-400" />
                            <div>
                              <div className="font-bold">{bed.bed_number}</div>
                              {bed.current_tenant_name ? (
                                <div className="text-[11px] text-slate-400">{bed.current_tenant_name}</div>
                              ) : (
                                <div className="text-[11px] text-emerald-400 font-semibold">Vacant (Available)</div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-black text-white">₹{bed.monthly_rent.toLocaleString("en-IN")}</div>
                            <div className="text-[10px] text-slate-500">{bed.food_included ? "With Mess" : "No Food"}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Submeter Info */}
                    <div className="pt-2 border-t border-slate-800/80 flex justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400" /> Sub-meter:</span>
                      <span className="font-mono text-slate-200">{room.sub_meter_current_reading || 0} Units</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: Tenants Directory */}
          {activeTab === "tenants" && (
            <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-white text-sm">Active Tenants Directory</h3>
                <span className="text-xs text-slate-400">{activeTenants.length} Tenants Listed</span>
              </div>

              {activeTenants.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">No tenants added yet. Click 'Add Tenant' to add your first tenant.</div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {activeTenants.map((tenant) => (
                    <div key={tenant.id} className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#0B0F19]/50 transition">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                          {tenant.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-sm">{tenant.name}</h4>
                            <span className="px-2 py-0.5 bg-slate-800 text-[10px] text-slate-300 rounded font-mono">
                              {tenant.room_number || "Room"} {tenant.bed_number || ""}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {tenant.phone}</span>
                            {tenant.aadhaar_no && <span>Aadhaar: {tenant.aadhaar_no}</span>}
                            <span>Joined: {tenant.joining_date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                        <div className="text-right">
                          <div className="text-sm font-black text-white">₹{tenant.monthly_rent.toLocaleString("en-IN")}/mo</div>
                          <div className="text-[11px] text-slate-500">Deposit: ₹{tenant.security_deposit.toLocaleString("en-IN")}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => collectRentPayment(activeProperty.id, tenant.id, tenant.monthly_rent, tenant.rent_status !== "paid")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                              tenant.rent_status === "paid"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse"
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {tenant.rent_status === "paid" ? "Paid ✅" : "Mark Paid"}
                          </button>

                          <a
                            href={getWhatsAppReceiptUrl(tenant)}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 rounded-lg border border-emerald-500/30 transition"
                            title="Send WhatsApp Rent Receipt"
                          >
                            <Share2 className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Expenses & Staff */}
          {activeTab === "expenses" && (
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-bold text-white text-base">Operational Expenses & Net Cashflow</h3>
                  <p className="text-xs text-slate-400 mt-0.5">कुक सैलरी, सफाई, वाईफाई और मेंटेनेंस खर्च</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Net Monthly Cashflow Profit:</span>
                  <div className={`text-lg font-black ${netCashflow >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    ₹{netCashflow.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {activeExpenses.length === 0 ? (
                <div className="text-center p-8 text-slate-500 text-sm">No expenses recorded for this property yet.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeExpenses.map((exp) => (
                    <div key={exp.id} className="p-4 bg-[#0B0F19] rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">{exp.category.replace('_', ' ')}</span>
                        <div className="text-xs font-bold text-white mt-0.5">{exp.note}</div>
                        <div className="text-[11px] text-slate-500">{exp.date}</div>
                      </div>
                      <div className="text-sm font-black text-rose-400">
                        -₹{exp.amount.toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Submeter Calculator */}
          {activeTab === "submeter" && activeProperty.has_hostel_model && (
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
                <Zap className="w-5 h-5" /> Quick Electricity Sub-meter Bill Calculator
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">पिछली रीडिंग (Previous Unit)</label>
                  <input
                    type="number"
                    value={meterPrevUnit}
                    onChange={(e) => setMeterPrevUnit(Number(e.target.value))}
                    className="w-full mt-1.5 p-3 bg-[#0B0F19] border border-slate-800 rounded-xl text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">वर्तमान रीडिंग (Current Unit)</label>
                  <input
                    type="number"
                    value={meterCurrUnit}
                    onChange={(e) => setMeterCurrUnit(Number(e.target.value))}
                    className="w-full mt-1.5 p-3 bg-[#0B0F19] border border-slate-800 rounded-xl text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">दर (Rate per Unit ₹)</label>
                  <input
                    type="number"
                    value={meterRate}
                    onChange={(e) => setMeterRate(Number(e.target.value))}
                    className="w-full mt-1.5 p-3 bg-[#0B0F19] border border-slate-800 rounded-xl text-white font-bold"
                  />
                </div>
              </div>

              <div className="p-5 bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <div className="text-xs text-slate-400">कुल खपत यूनिट: <strong className="text-white font-bold">{Math.max(0, meterCurrUnit - meterPrevUnit)} Units</strong></div>
                  <div className="text-xs text-slate-400 mt-0.5">2-Sharing रूम में प्रति व्यक्ति हिस्सा: <strong className="text-amber-400 font-bold">₹{Math.round((Math.max(0, meterCurrUnit - meterPrevUnit) * meterRate) / 2)}</strong></div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 uppercase font-bold">कुल बिजली बिल:</span>
                  <div className="text-2xl font-black text-amber-400">₹{Math.max(0, meterCurrUnit - meterPrevUnit) * meterRate}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* MODAL: Add Property */}
      {showAddPropModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4">
            <h3 className="text-lg font-black text-white">Add New Rental Property / Hostel</h3>
            <form onSubmit={handleCreateProperty} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400">Property / Hostel Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahaveer Girls PG & Hostel"
                  value={newPropTitle}
                  onChange={(e) => setNewPropTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400">Property Type</label>
                  <select
                    value={newPropType}
                    onChange={(e) => setNewPropType(e.target.value as any)}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                  >
                    <option value="pg_hostel">🏢 PG & Hostel Model (Beds & Rooms)</option>
                    <option value="residential_flat">🏠 Residential Flat / Apartment</option>
                    <option value="commercial_shop">🏪 Commercial Shop / Showroom</option>
                    <option value="independent_house">🏡 Independent House</option>
                    <option value="warehouse_godown">📦 Warehouse / Godown</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400">Monthly Target Rent (₹)</label>
                  <input
                    type="number"
                    value={newPropTargetRev}
                    onChange={(e) => setNewPropTargetRev(Number(e.target.value))}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400">Address & Location</label>
                <input
                  type="text"
                  placeholder="e.g. Near Metro Station / Coaching Hub"
                  value={newPropAddress}
                  onChange={(e) => setNewPropAddress(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPropModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-amber-500/20"
                >
                  Save Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Room */}
      {showAddRoomModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-black text-white">Add Room to {activeProperty?.title}</h3>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400">Room Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 103 or 201"
                    value={newRoomNo}
                    onChange={(e) => setNewRoomNo(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400">Floor</label>
                  <select
                    value={newRoomFloor}
                    onChange={(e) => setNewRoomFloor(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                  >
                    <option value="Ground Floor">Ground Floor</option>
                    <option value="First Floor">First Floor</option>
                    <option value="Second Floor">Second Floor</option>
                    <option value="Third Floor">Third Floor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400">Sharing Type</label>
                  <select
                    value={newRoomSharing}
                    onChange={(e) => setNewRoomSharing(e.target.value as any)}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                  >
                    <option value="single">Single Room (1 Bed)</option>
                    <option value="double">Double Sharing (2 Beds)</option>
                    <option value="triple">Triple Sharing (3 Beds)</option>
                    <option value="four_sharing">4-Bed Sharing</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400">Rent Per Bed (₹)</label>
                  <input
                    type="number"
                    value={newRoomRentPerBed}
                    onChange={(e) => setNewRoomRentPerBed(Number(e.target.value))}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-600/20"
                >
                  Create Room & Beds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Tenant */}
      {showAddTenantModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-black text-white">Add Tenant to {activeProperty?.title}</h3>
            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400">Tenant Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400">Mobile Number (WhatsApp)</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765..."
                    value={newTenantPhone}
                    onChange={(e) => setNewTenantPhone(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400">Aadhaar Card No.</label>
                  <input
                    type="text"
                    placeholder="XXXX XXXX XXXX"
                    value={newTenantAadhaar}
                    onChange={(e) => setNewTenantAadhaar(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400">Monthly Rent (₹)</label>
                  <input
                    type="number"
                    value={newTenantRent}
                    onChange={(e) => setNewTenantRent(Number(e.target.value))}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400">Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={newTenantDeposit}
                    onChange={(e) => setNewTenantDeposit(Number(e.target.value))}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              {activeProperty.has_hostel_model && (
                <div>
                  <label className="text-xs font-bold text-slate-400">Assign Room & Bed</label>
                  <select
                    value={newTenantBedId}
                    onChange={(e) => {
                      setNewTenantBedId(e.target.value);
                      const selectedBed = activeRooms.flatMap(r => r.beds).find(b => b.id === e.target.value);
                      if (selectedBed) {
                        setNewTenantRoomNo(`Room ${selectedBed.room_number}`);
                        setNewTenantRent(selectedBed.monthly_rent);
                      }
                    }}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                  >
                    <option value="">Select Bed from Available Rooms</option>
                    {activeRooms.map(rm => (
                      rm.beds.filter(b => b.status === "vacant").map(b => (
                        <option key={b.id} value={b.id}>
                          {rm.room_number} - {b.bed_number} (₹{b.monthly_rent}/mo)
                        </option>
                      ))
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTenantModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/20"
                >
                  Save Tenant & Collect Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Expense */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-black text-white">Record Property Expense</h3>
            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400">Expense Category</label>
                  <select
                    value={newExpCat}
                    onChange={(e) => setNewExpCat(e.target.value as any)}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                  >
                    <option value="cook_salary">👨‍🍳 Cook / Maharaj Salary</option>
                    <option value="warden_salary">🛡️ Warden / Caretaker Salary</option>
                    <option value="maid_cleaning">🧹 Maid & Housekeeping</option>
                    <option value="wifi_internet">🌐 Wi-Fi & Internet</option>
                    <option value="electricity_main">⚡ Main Power Bill</option>
                    <option value="water_supply">💧 Water Supply Tanker</option>
                    <option value="maintenance">🔧 Repair & Maintenance</option>
                    <option value="property_tax">🏛️ Municipal Property Tax</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400">Amount (₹)</label>
                  <input
                    type="number"
                    value={newExpAmount}
                    onChange={(e) => setNewExpAmount(Number(e.target.value))}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400">Notes / Payee Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Maharaj salary for September"
                  value={newExpNote}
                  onChange={(e) => setNewExpNote(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black shadow-lg shadow-rose-600/20"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
