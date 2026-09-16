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
  Phone,
  Share2,
  Calendar,
  Layers,
  ShieldCheck,
  Trash2,
  Printer,
  Edit3,
  X,
  UserCheck,
  Wrench,
  AlertCircle,
  FileCheck,
  BadgeIndianRupee,
  Receipt,
  Scale
} from "lucide-react";
import { RentalProperty, RentalPropertyType, HostelRoom, RentalTenant, RentalExpense } from "@/types";

export default function RentalsPage() {
  const {
    rentalProperties,
    addRentalProperty,
    updateRentalProperty,
    deleteRentalProperty,
    addHostelRoom,
    addRentalTenant,
    updateRentalTenant,
    deleteRentalTenant,
    collectRentPayment,
    addRentalExpense,
    deleteRentalExpense
  } = useFamilyStore();

  const [selectedPropId, setSelectedPropId] = useState<string>(rentalProperties[0]?.id || "");
  const [activeTab, setActiveTab] = useState<"rooms_beds" | "tenants" | "maintenance_expenses" | "agreement_rules" | "submeter">("tenants");

  // Modals
  const [showAddPropModal, setShowAddPropModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [showEditTenantModal, setShowEditTenantModal] = useState<RentalTenant | null>(null);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showRentSlipModal, setShowRentSlipModal] = useState<{ tenant: RentalTenant; property: RentalProperty } | null>(null);
  const [showDamageModal, setShowDamageModal] = useState<RentalTenant | null>(null);

  // New Property Form State
  const [newPropTitle, setNewPropTitle] = useState("");
  const [newPropType, setNewPropType] = useState<RentalPropertyType>("residential_flat");
  const [newPropAddress, setNewPropAddress] = useState("");
  const [newPropCity, setNewPropCity] = useState("Delhi NCR");
  const [newPropTargetRev, setNewPropTargetRev] = useState(25000);
  const [newPropLandlordName, setNewPropLandlordName] = useState("Makan Malik (Self)");
  const [newPropLandlordPhone, setNewPropLandlordPhone] = useState("+91 98765 43210");
  const [newPropLandlordPan, setNewPropLandlordPan] = useState("");
  const [newPropLandlordUpi, setNewPropLandlordUpi] = useState("");
  const [newPropDefaultRules, setNewPropDefaultRules] = useState(
    "1. Har mahine ki due date tak rent jama karein.\n2. Sub-letting ya kisi aur ko kiraye par dena mana hai.\n3. Notice period: Kam se kam 30 din pehle suchit karein.\n4. Kisi bhi samagri ya fittings me damage hone par bharpai security deposit se ki jayegi.\n5. Chhote repairs (bulb, washer) tenant karega, structural repairs owner karega."
  );
  const [newPropNotes, setNewPropNotes] = useState("");

  // New Room Form State
  const [newRoomNo, setNewRoomNo] = useState("");
  const [newRoomFloor, setNewRoomFloor] = useState("First Floor");
  const [newRoomSharing, setNewRoomSharing] = useState<"single" | "double" | "triple" | "four_sharing">("double");
  const [newRoomRentPerBed, setNewRoomRentPerBed] = useState(8000);
  const [newRoomSubMeterReading, setNewRoomSubMeterReading] = useState(100);

  // New / Edit Tenant Form State
  const [newTenantName, setNewTenantName] = useState("");
  const [newTenantFatherSpouse, setNewTenantFatherSpouse] = useState("");
  const [newTenantPhone, setNewTenantPhone] = useState("");
  const [newTenantAltPhone, setNewTenantAltPhone] = useState("");
  const [newTenantAadhaar, setNewTenantAadhaar] = useState("");
  const [newTenantPermAddress, setNewTenantPermAddress] = useState("");
  const [newTenantCurrAddress, setNewTenantCurrAddress] = useState("");
  const [newTenantOccupation, setNewTenantOccupation] = useState("");

  const [newTenantRent, setNewTenantRent] = useState(15000);
  const [newTenantDeposit, setNewTenantDeposit] = useState(30000);
  const [newTenantDepositDate, setNewTenantDepositDate] = useState(new Date().toISOString().split("T")[0]);
  const [newTenantDepositMode, setNewTenantDepositMode] = useState<"cash" | "upi" | "bank_transfer" | "cheque">("upi");

  const [newTenantJoiningDate, setNewTenantJoiningDate] = useState(new Date().toISOString().split("T")[0]);
  const [newTenantCycleStartDay, setNewTenantCycleStartDay] = useState(5);
  const [newTenantCycleEndDay, setNewTenantCycleEndDay] = useState(4);
  const [newTenantDueDay, setNewTenantDueDay] = useState(5);

  const [newTenantAgreementMonths, setNewTenantAgreementMonths] = useState(11);
  const [newTenantLockInMonths, setNewTenantLockInMonths] = useState(6);
  const [newTenantNoticeDays, setNewTenantNoticeDays] = useState(30);
  const [newTenantEarlyExitPenalty, setNewTenantEarlyExitPenalty] = useState("1 mahine ka rent kata jayega agar lock-in se pehle khali kiya");
  const [newTenantSpecialTerms, setNewTenantSpecialTerms] = useState("Damage bharpai security deposit se hogi. Bijli bill unit meter hisab se alag se deya hoga.");

  const [newTenantRoomNo, setNewTenantRoomNo] = useState("");
  const [newTenantBedId, setNewTenantBedId] = useState("");
  const [newTenantFood, setNewTenantFood] = useState(false);
  const [newTenantNotes, setNewTenantNotes] = useState("");

  // Damage / Deduction Form State
  const [damageAmount, setDamageAmount] = useState(0);
  const [damageNotes, setDamageNotes] = useState("");

  // New Expense / Maintenance Form State
  const [newExpCat, setNewExpCat] = useState<RentalExpense["category"]>("maintenance");
  const [newExpAmount, setNewExpAmount] = useState(1500);
  const [newExpPaidBy, setNewExpPaidBy] = useState<"owner" | "tenant">("owner");
  const [newExpAdjustInRent, setNewExpAdjustInRent] = useState(false);
  const [newExpTenantId, setNewExpTenantId] = useState("");
  const [newExpNote, setNewExpNote] = useState("");
  const [newExpDate, setNewExpDate] = useState(new Date().toISOString().split("T")[0]);

  // Submeter Quick Calculator
  const [meterPrevUnit, setMeterPrevUnit] = useState<number>(1420);
  const [meterCurrUnit, setMeterCurrUnit] = useState<number>(1530);
  const [meterRate, setMeterRate] = useState<number>(9);

  const activeProperty = rentalProperties.find((p) => p.id === selectedPropId) || rentalProperties[0];

  // Overall Portfolio Calculations
  const totalMonthlyTarget = rentalProperties.reduce((sum, p) => sum + (p.monthly_target_revenue || 0), 0);
  const totalDeposits = rentalProperties.reduce((sum, p) => sum + (p.security_deposit_holding || 0), 0);

  let totalBedsCount = 0;
  let occupiedBedsCount = 0;
  rentalProperties.forEach((p) => {
    if (p.has_hostel_model && p.rooms) {
      p.rooms.forEach((rm) => {
        rm.beds.forEach((b) => {
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
    .filter((t) => t.rent_status === "paid")
    .reduce((sum, t) => sum + Number(t.monthly_rent || 0), 0);

  const totalPendingRent = activeTenants
    .filter((t) => t.rent_status !== "paid")
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
      landlord_name: newPropLandlordName,
      landlord_phone: newPropLandlordPhone,
      landlord_pan: newPropLandlordPan,
      landlord_upi: newPropLandlordUpi,
      total_units_or_rooms: 1,
      total_capacity_beds: newPropType === "pg_hostel" ? 6 : 1,
      has_hostel_model: newPropType === "pg_hostel",
      monthly_target_revenue: Number(newPropTargetRev),
      security_deposit_holding: 0,
      default_rules: newPropDefaultRules,
      notes: newPropNotes,
      rooms: newPropType === "pg_hostel" ? [] : undefined
    });
    setShowAddPropModal(false);
    setNewPropTitle("");
    setNewPropAddress("");
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
      father_or_spouse_name: newTenantFatherSpouse,
      phone: newTenantPhone,
      alternate_phone: newTenantAltPhone,
      aadhaar_no: newTenantAadhaar,
      permanent_address: newTenantPermAddress,
      current_address: newTenantCurrAddress,
      occupation: newTenantOccupation,
      joining_date: newTenantJoiningDate,
      cycle_start_day: Number(newTenantCycleStartDay),
      cycle_end_day: Number(newTenantCycleEndDay),
      rent_due_day: Number(newTenantDueDay),
      monthly_rent: Number(newTenantRent),
      security_deposit: Number(newTenantDeposit),
      advance_payment_date: newTenantDepositDate,
      advance_payment_mode: newTenantDepositMode,
      advance_status: "held",
      agreement_duration_months: Number(newTenantAgreementMonths),
      agreement_start_date: newTenantJoiningDate,
      lock_in_period_months: Number(newTenantLockInMonths),
      notice_period_days: Number(newTenantNoticeDays),
      early_exit_penalty: newTenantEarlyExitPenalty,
      special_terms: newTenantSpecialTerms,
      rent_status: "paid",
      food_included: newTenantFood,
      room_number: newTenantRoomNo || "Unit 1",
      bed_id: newTenantBedId,
      last_paid_date: new Date().toISOString().split("T")[0],
      notes: newTenantNotes
    });

    setShowAddTenantModal(false);
    resetTenantForm();
  };

  // Handler: Save Edited Tenant
  const handleSaveEditedTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditTenantModal || !activeProperty) return;

    updateRentalTenant(activeProperty.id, showEditTenantModal.id, {
      name: newTenantName,
      father_or_spouse_name: newTenantFatherSpouse,
      phone: newTenantPhone,
      alternate_phone: newTenantAltPhone,
      aadhaar_no: newTenantAadhaar,
      permanent_address: newTenantPermAddress,
      current_address: newTenantCurrAddress,
      occupation: newTenantOccupation,
      joining_date: newTenantJoiningDate,
      cycle_start_day: Number(newTenantCycleStartDay),
      cycle_end_day: Number(newTenantCycleEndDay),
      rent_due_day: Number(newTenantDueDay),
      monthly_rent: Number(newTenantRent),
      security_deposit: Number(newTenantDeposit),
      advance_payment_mode: newTenantDepositMode,
      agreement_duration_months: Number(newTenantAgreementMonths),
      lock_in_period_months: Number(newTenantLockInMonths),
      notice_period_days: Number(newTenantNoticeDays),
      early_exit_penalty: newTenantEarlyExitPenalty,
      special_terms: newTenantSpecialTerms,
      notes: newTenantNotes
    });

    setShowEditTenantModal(null);
    resetTenantForm();
  };

  const openEditModal = (t: RentalTenant) => {
    setShowEditTenantModal(t);
    setNewTenantName(t.name || "");
    setNewTenantFatherSpouse(t.father_or_spouse_name || "");
    setNewTenantPhone(t.phone || "");
    setNewTenantAltPhone(t.alternate_phone || "");
    setNewTenantAadhaar(t.aadhaar_no || "");
    setNewTenantPermAddress(t.permanent_address || "");
    setNewTenantCurrAddress(t.current_address || "");
    setNewTenantOccupation(t.occupation || "");
    setNewTenantRent(t.monthly_rent || 0);
    setNewTenantDeposit(t.security_deposit || 0);
    setNewTenantDepositMode(t.advance_payment_mode || "upi");
    setNewTenantJoiningDate(t.joining_date || new Date().toISOString().split("T")[0]);
    setNewTenantCycleStartDay(t.cycle_start_day || 5);
    setNewTenantCycleEndDay(t.cycle_end_day || 4);
    setNewTenantDueDay(t.rent_due_day || 5);
    setNewTenantAgreementMonths(t.agreement_duration_months || 11);
    setNewTenantLockInMonths(t.lock_in_period_months || 6);
    setNewTenantNoticeDays(t.notice_period_days || 30);
    setNewTenantEarlyExitPenalty(t.early_exit_penalty || "1 Month Rent");
    setNewTenantSpecialTerms(t.special_terms || "");
    setNewTenantNotes(t.notes || "");
  };

  const resetTenantForm = () => {
    setNewTenantName("");
    setNewTenantFatherSpouse("");
    setNewTenantPhone("");
    setNewTenantAltPhone("");
    setNewTenantAadhaar("");
    setNewTenantPermAddress("");
    setNewTenantCurrAddress("");
    setNewTenantOccupation("");
    setNewTenantRent(15000);
    setNewTenantDeposit(30000);
    setNewTenantJoiningDate(new Date().toISOString().split("T")[0]);
    setNewTenantCycleStartDay(5);
    setNewTenantCycleEndDay(4);
    setNewTenantDueDay(5);
    setNewTenantAgreementMonths(11);
    setNewTenantLockInMonths(6);
    setNewTenantNoticeDays(30);
    setNewTenantEarlyExitPenalty("1 mahine ka rent kata jayega agar lock-in se pehle khali kiya");
    setNewTenantSpecialTerms("Damage bharpai security deposit se hogi. Bijli bill alag se deya hoga.");
    setNewTenantNotes("");
  };

  // Handler: Add Expense & Maintenance
  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProperty || !newExpAmount) return;

    addRentalExpense(activeProperty.id, {
      category: newExpCat,
      amount: Number(newExpAmount),
      date: newExpDate,
      note: newExpNote || `${newExpCat} expense`,
      paid_by: newExpPaidBy,
      is_adjusted_in_rent: newExpAdjustInRent,
      tenant_id: newExpTenantId || undefined
    });

    // If tenant paid and adjusted in rent, update the tenant's maintenance deduction
    if (newExpPaidBy === "tenant" && newExpAdjustInRent && newExpTenantId) {
      const targetTenant = activeProperty.tenants.find((t) => t.id === newExpTenantId);
      if (targetTenant) {
        updateRentalTenant(activeProperty.id, targetTenant.id, {
          maintenance_deduction_amount: (targetTenant.maintenance_deduction_amount || 0) + Number(newExpAmount),
          maintenance_deduction_notes: `${targetTenant.maintenance_deduction_notes ? targetTenant.maintenance_deduction_notes + "; " : ""}${newExpNote} (₹${newExpAmount})`
        });
      }
    }

    setShowAddExpenseModal(false);
    setNewExpNote("");
    setNewExpPaidBy("owner");
    setNewExpAdjustInRent(false);
  };

  // Handler: Apply Damage Deduction
  const handleApplyDamageDeduction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showDamageModal || !activeProperty) return;

    updateRentalTenant(activeProperty.id, showDamageModal.id, {
      damage_deduction_amount: (showDamageModal.damage_deduction_amount || 0) + Number(damageAmount),
      damage_notes: `${showDamageModal.damage_notes ? showDamageModal.damage_notes + "; " : ""}${damageNotes} (₹${damageAmount})`
    });

    setShowDamageModal(null);
    setDamageAmount(0);
    setDamageNotes("");
  };

  // Helper: WhatsApp Rich Receipt Message
  const getWhatsAppSlipUrl = (tenant: RentalTenant, prop: RentalProperty) => {
    const startDay = tenant.cycle_start_day || 5;
    const endDay = tenant.cycle_end_day || 4;
    const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const netPaid = Math.max(0, tenant.monthly_rent - (tenant.maintenance_deduction_amount || 0));

    const text = `*━━━━━━━━━━━━━━━━━━━━━*
📜 *RENT RECEIPT & SLIP (किराया रसीद)*
*${prop.title.toUpperCase()}*
${prop.address}, ${prop.city}
*━━━━━━━━━━━━━━━━━━━━━*

👤 *Kirayedaar (Tenant):* ${tenant.name}
${tenant.father_or_spouse_name ? `👨 *C/o:* ${tenant.father_or_spouse_name}\n` : ""}📞 *Mobile:* ${tenant.phone}
🏢 *Unit/Room:* ${tenant.room_number || "Main Property"} ${tenant.bed_number || ""}
📅 *Cycle Period:* ${startDay} Tarikh se ${endDay} Tarikh tak
💰 *Rent Status:* PAID ✅ (Date: ${tenant.last_paid_date || today})

*--- HISAAB-KITAAB BREAKUP ---*
➕ Base Monthly Rent: ₹${tenant.monthly_rent.toLocaleString("en-IN")}
${(tenant.maintenance_deduction_amount || 0) > 0 ? `➖ Maintenance / Repair Adjustment: -₹${tenant.maintenance_deduction_amount?.toLocaleString("en-IN")} (${tenant.maintenance_deduction_notes || "Tenant Expense"})\n` : ""}💵 *Net Amount Received:* ₹${netPaid.toLocaleString("en-IN")}
💳 *Payment Mode:* ${(tenant.last_payment_mode || "UPI / Online").toUpperCase()}

*--- SECURITY DEPOSIT (ADVANCE) ---*
🛡️ Advance Held: ₹${(tenant.security_deposit || 0).toLocaleString("en-IN")}
${(tenant.damage_deduction_amount || 0) > 0 ? `⚠️ Damage Deductions: -₹${tenant.damage_deduction_amount?.toLocaleString("en-IN")} (${tenant.damage_notes})\n` : ""}✨ Net Deposit Balance: ₹${Math.max(0, (tenant.security_deposit || 0) - (tenant.damage_deduction_amount || 0)).toLocaleString("en-IN")}

*--- NIYAM & AGREEMENT ---*
• Notice Period: ${tenant.notice_period_days || 30} Days
• Early Exit Clause: ${tenant.early_exit_penalty || "As per agreement"}
• Makan Malik: ${prop.landlord_name || "Owner"} (${prop.landlord_phone || ""})

🙏 _Dhanyawad! Digital Family Wealth SuperApp Generated Receipt._`;

    return `https://wa.me/${tenant.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200 p-4 md:p-8 font-sans pb-28">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            <Building className="w-4 h-4" /> Real Estate, PG, Shops & Tenant Hub
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Rental Properties, Shops & Tenants Manager
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            फ्लैट, दुकान, मकान, गोदाम और पीजी के किरायेदारों का पूरा ब्यौरा—एडवांस डिपॉजिट, बिलिंग साइकल, नियम-शर्तें, मेंटेनेंस खर्च एडजस्टमेंट और पक्की रसीद (Rent Slip)।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              resetTenantForm();
              setShowAddTenantModal(true);
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
          >
            <Users className="w-4 h-4" /> + Naya Kirayedaar (Tenant) Jodein
          </button>
          <button
            onClick={() => setShowAddPropModal(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> + Nayi Property / Dukan
          </button>
        </div>
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
          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">कुल सक्रिय किरायेदार</span>
          <div className="text-xl md:text-2xl font-black text-blue-400 mt-1">
            {rentalProperties.reduce((acc, p) => acc + (p.tenants?.length || 0), 0)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">दुकानें, फ्लैट्स व पीजी</p>
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
            <span>
              {prop.property_type === "commercial_shop"
                ? "🏪"
                : prop.property_type === "warehouse_godown"
                ? "📦"
                : prop.has_hostel_model
                ? "🏢"
                : "🏠"}
            </span>
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
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 rounded-full font-bold text-[10px] uppercase">
                  {activeProperty.property_type.replace("_", " ")}
                </span>
                {activeProperty.has_hostel_model && (
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full font-bold text-[10px] uppercase">
                    Hostel & PG Matrix
                  </span>
                )}
                {activeProperty.landlord_name && (
                  <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 rounded-full font-bold text-[10px]">
                    👤 Owner: {activeProperty.landlord_name}
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
                onClick={() => {
                  resetTenantForm();
                  setShowAddTenantModal(true);
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow"
              >
                <Users className="w-4 h-4" /> + Add Tenant (किरायेदार)
              </button>
              <button
                onClick={() => setShowAddExpenseModal(true)}
                className="px-3.5 py-2 bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow"
              >
                <Wrench className="w-4 h-4" /> + Maintenance & Expense
              </button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex border-b border-slate-800 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveTab("tenants")}
              className={`px-5 py-3 text-xs font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
                activeTab === "tenants"
                  ? "border-amber-500 text-amber-400 bg-amber-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Users className="w-4 h-4" /> Tenants & Rent Slips ({activeTenants.length})
            </button>

            {activeProperty.has_hostel_model && (
              <button
                onClick={() => setActiveTab("rooms_beds")}
                className={`px-5 py-3 text-xs font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
                  activeTab === "rooms_beds"
                    ? "border-amber-500 text-amber-400 bg-amber-500/10"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Bed className="w-4 h-4" /> Rooms & Bed Matrix ({activeRooms.length} Rooms)
              </button>
            )}

            <button
              onClick={() => setActiveTab("maintenance_expenses")}
              className={`px-5 py-3 text-xs font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
                activeTab === "maintenance_expenses"
                  ? "border-amber-500 text-amber-400 bg-amber-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Wrench className="w-4 h-4" /> Maintenance & Repairs ({activeExpenses.length})
            </button>

            <button
              onClick={() => setActiveTab("agreement_rules")}
              className={`px-5 py-3 text-xs font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
                activeTab === "agreement_rules"
                  ? "border-amber-500 text-amber-400 bg-amber-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileCheck className="w-4 h-4" /> Agreement, Rules & Damage Policy
            </button>

            {activeProperty.has_hostel_model && (
              <button
                onClick={() => setActiveTab("submeter")}
                className={`px-5 py-3 text-xs font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
                  activeTab === "submeter"
                    ? "border-amber-500 text-amber-400 bg-amber-500/10"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Zap className="w-4 h-4" /> Electricity Sub-meter Calculator
              </button>
            )}
          </div>

          {/* TAB 1: Tenants Directory & Ledger */}
          {activeTab === "tenants" && (
            <div className="space-y-4">
              <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white text-sm">Active Tenants Directory (किरायेदारों की सूची)</h3>
                    <p className="text-xs text-slate-400">एडवांस डिपॉजिट, साइकल डेट्स, मेंटेनेंस कटौती एवं 1-क्लिक रसीद</p>
                  </div>
                  <span className="text-xs text-slate-400">{activeTenants.length} Tenants Listed</span>
                </div>

                {activeTenants.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-sm space-y-3">
                    <Users className="w-10 h-10 mx-auto text-slate-600" />
                    <div>Koi tenant nahi joda gaya hai. Upar &apos;Add Tenant&apos; par click karke pehla kirayedaar jodein.</div>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800">
                    {activeTenants.map((tenant) => {
                      const cycleStart = tenant.cycle_start_day || 5;
                      const cycleEnd = tenant.cycle_end_day || 4;
                      const hasMaintenanceDeduction = (tenant.maintenance_deduction_amount || 0) > 0;
                      const hasDamageDeduction = (tenant.damage_deduction_amount || 0) > 0;

                      return (
                        <div key={tenant.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-[#0B0F19]/60 transition">
                          <div className="flex items-start gap-3.5 flex-1">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-base shrink-0 border border-amber-500/30">
                              {tenant.name.charAt(0)}
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-bold text-white text-base">{tenant.name}</h4>
                                {tenant.father_or_spouse_name && (
                                  <span className="text-xs text-slate-400 font-normal">
                                    (C/o {tenant.father_or_spouse_name})
                                  </span>
                                )}
                                <span className="px-2.5 py-0.5 bg-slate-800 border border-slate-700 text-[10px] text-slate-300 rounded-md font-mono">
                                  {tenant.room_number || "Unit"} {tenant.bed_number || ""}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  tenant.rent_status === "paid"
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                    : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                }`}>
                                  {tenant.rent_status === "paid" ? "Paid ✅" : "Pending ⏳"}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {tenant.phone}</span>
                                {tenant.aadhaar_no && <span>🆔 Aadhaar: <strong className="text-slate-300 font-mono">{tenant.aadhaar_no}</strong></span>}
                                <span>📅 Shuru: <strong className="text-slate-300">{tenant.joining_date}</strong></span>
                                <span className="text-amber-400">🔄 Cycle: Har mahine <strong>{cycleStart} se {cycleEnd}</strong></span>
                              </div>

                              {tenant.permanent_address && (
                                <p className="text-[11px] text-slate-500">
                                  🏠 Sthayi Pata: {tenant.permanent_address}
                                </p>
                              )}

                              {/* Badges for maintenance or damage adjustments */}
                              <div className="flex flex-wrap gap-2 pt-1">
                                {hasMaintenanceDeduction && (
                                  <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] rounded flex items-center gap-1">
                                    <Wrench className="w-3 h-3" /> Rent se kata: ₹{tenant.maintenance_deduction_amount} ({tenant.maintenance_deduction_notes})
                                  </span>
                                )}
                                {hasDamageDeduction && (
                                  <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px] rounded flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> Damage Kata: ₹{tenant.damage_deduction_amount} ({tenant.damage_notes})
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row lg:flex-row items-start sm:items-center justify-between lg:justify-end gap-4 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                            <div className="text-left sm:text-right">
                              <div className="text-base font-black text-white">₹{tenant.monthly_rent.toLocaleString("en-IN")}/mo</div>
                              <div className="text-xs text-amber-400 font-semibold">
                                Advance Held: ₹{(tenant.security_deposit || 0).toLocaleString("en-IN")}
                              </div>
                              <div className="text-[10px] text-slate-500">Due Day: Har mahine {tenant.rent_due_day || cycleStart} taarikh</div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              {/* Mark Paid Toggle */}
                              <button
                                onClick={() => collectRentPayment(activeProperty.id, tenant.id, tenant.monthly_rent, tenant.rent_status !== "paid")}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
                                  tenant.rent_status === "paid"
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                                    : "bg-rose-500 hover:bg-rose-600 text-white font-black shadow-lg shadow-rose-500/20"
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {tenant.rent_status === "paid" ? "Paid ✅" : "Collect Rent"}
                              </button>

                              {/* Open Full Rent Slip Modal */}
                              <button
                                onClick={() => setShowRentSlipModal({ tenant, property: activeProperty })}
                                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                                title="Bada Rent Slip / Invoice View"
                              >
                                <Receipt className="w-3.5 h-3.5" /> Full Slip
                              </button>

                              {/* WhatsApp Share Button */}
                              <a
                                href={getWhatsAppSlipUrl(tenant, activeProperty)}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 rounded-xl border border-emerald-500/30 transition"
                                title="Send WhatsApp Rent Slip"
                              >
                                <Share2 className="w-4 h-4" />
                              </a>

                              {/* Damage / Deduction Button */}
                              <button
                                onClick={() => setShowDamageModal(tenant)}
                                className="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl border border-rose-500/30 transition"
                                title="Record Damage / Deposit Deduction"
                              >
                                <Scale className="w-4 h-4" />
                              </button>

                              {/* Edit Tenant */}
                              <button
                                onClick={() => openEditModal(tenant)}
                                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
                                title="Edit Tenant Details"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {/* Delete Tenant */}
                              <button
                                onClick={() => {
                                  if (confirm(`Kya aap sach me ${tenant.name} ko delete karna chahte hain?`)) {
                                    deleteRentalTenant(activeProperty.id, tenant.id);
                                  }
                                }}
                                className="p-2 bg-slate-900 hover:bg-rose-900/40 text-slate-500 hover:text-rose-400 rounded-xl border border-slate-800 transition"
                                title="Remove Tenant"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Rooms & Beds Matrix (PG/Hostel) */}
          {activeTab === "rooms_beds" && activeProperty.has_hostel_model && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeRooms.map((room) => {
                const roomOccupied = room.beds.filter((b) => b.status === "occupied").length;
                return (
                  <div key={room.id} className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{room.floor}</span>
                        <h3 className="text-lg font-black text-white">{room.room_number}</h3>
                        <p className="text-xs text-slate-400 capitalize">{room.sharing_type.replace("_", " ")} Sharing</p>
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

          {/* TAB 3: Maintenance, Repairs & Expenses */}
          {activeTab === "maintenance_expenses" && (
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-bold text-white text-base">Maintenance, Repairs & Staff Expenses</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    प्लंबर, बिजली, पेंट या टूट-फूट का खर्च—मालिक ने किया या किरायेदार ने, और रेंट में एडजस्टमेंट का पूरा हिसाब।
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Net Monthly Cashflow:</span>
                    <div className={`text-lg font-black ${netCashflow >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      ₹{netCashflow.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddExpenseModal(true)}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" /> Add Expense
                  </button>
                </div>
              </div>

              {activeExpenses.length === 0 ? (
                <div className="text-center p-8 text-slate-500 text-sm">
                  Koi maintenance ya expense record nahi hai.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeExpenses.map((exp) => (
                    <div key={exp.id} className="p-4 bg-[#0B0F19] rounded-xl border border-slate-800 flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider px-2 py-0.5 bg-rose-500/10 rounded">
                            {exp.category.replace("_", " ")}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            exp.paid_by === "tenant"
                              ? "bg-blue-500/20 text-blue-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}>
                            {exp.paid_by === "tenant" ? "Paid by Tenant" : "Paid by Owner"}
                          </span>
                          {exp.is_adjusted_in_rent && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-semibold">
                              Rent Adjusted ✅
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-bold text-white">{exp.note}</div>
                        <div className="text-[11px] text-slate-500">{exp.date}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-sm font-black text-rose-400">
                          -₹{exp.amount.toLocaleString("en-IN")}
                        </div>
                        <button
                          onClick={() => deleteRentalExpense(activeProperty.id, exp.id)}
                          className="p-1.5 text-slate-600 hover:text-rose-400 rounded-lg transition"
                          title="Delete Expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Agreement, Rules & Damage Recovery */}
          {activeTab === "agreement_rules" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Landlord & Property Rules Card */}
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
                  <FileCheck className="w-5 h-5" /> Property Rules & Agreement Clauses (नियम एवं शर्तें)
                </div>
                <p className="text-xs text-slate-400">
                  यह नियम और शर्तें किरायेदार के एग्रीमेंट और रेंट स्लिप में स्वतः शामिल की जाती हैं:
                </p>

                <div className="bg-[#0B0F19] p-4 rounded-xl border border-slate-800 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                  {activeProperty.default_rules || newPropDefaultRules}
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-400" /> Early Exit & Lock-in Policy:
                  </div>
                  <p className="text-slate-400">
                    यदि कोई किरायेदार न्यूनतम लॉक-इन अवधि (उदा. 6 या 11 महीने) से पहले मकान/दुकान खाली करता है या बिना 30 दिन के नोटिस के छोड़ता है, तो एग्रीमेंट नियमानुसार 1 महीने का किराया सिक्योरिटी डिपॉजिट से काट लिया जाएगा।
                  </p>
                </div>
              </div>

              {/* Damage Recovery & Security Deposit Settlement */}
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase tracking-wider">
                  <Scale className="w-5 h-5" /> Damage Recovery Policy (टूट-फूट व हर्जाना भरपाई)
                </div>
                <p className="text-xs text-slate-400">
                  समान में टूट-फूट (सैनिटरी, पेंट, पंखे, फिटिंग्स या दुकान शटर डैमेज) होने पर सिक्योरिटी डिपॉजिट से कटौती का सिस्टम:
                </p>

                <div className="space-y-2.5">
                  <div className="p-3 bg-[#0B0F19] rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-white">कुल सुरक्षित एडवांस (Security Deposit)</strong>
                      <p className="text-[11px] text-slate-500">सभी किरायेदारों द्वारा जमा</p>
                    </div>
                    <div className="text-base font-black text-amber-400">
                      ₹{activeProperty.security_deposit_holding?.toLocaleString("en-IN") || 0}
                    </div>
                  </div>

                  <div className="p-3 bg-[#0B0F19] rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-white">मेंटेनेंस जिम्मेदारी विभाजन (Who Fixes What?)</strong>
                      <p className="text-[11px] text-slate-500">मालिक vs किरायेदार</p>
                    </div>
                    <div className="text-right text-[11px] text-slate-400">
                      <div>🛠️ मेजर/स्ट्रक्चरल: <strong>मालिक (Owner)</strong></div>
                      <div>💡 माइनर/डेली वियर: <strong>किरायेदार (Tenant)</strong></div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-400">
                  किसी किरायेदार की एग्जिट पर या डैमेज होने पर किरायेदार कार्ड पर दिए गए <Scale className="w-3.5 h-3.5 inline text-rose-400" /> बटन पर क्लिक करके डैमेज की सीधी कटौती दर्ज करें।
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Submeter Calculator */}
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

      {/* ========================================================================= */}
      {/* MODAL 1: BADA RENT SLIP / PRINTABLE INVOICE RECEIPT                      */}
      {/* ========================================================================= */}
      {showRentSlipModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-0 text-slate-200 my-auto">
            {/* Action Bar */}
            <div className="bg-[#111827] px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">Full Official Rent Slip & Receipt</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
                <a
                  href={getWhatsAppSlipUrl(showRentSlipModal.tenant, showRentSlipModal.property)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share WhatsApp
                </a>
                <button
                  onClick={() => setShowRentSlipModal(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Slip Content */}
            <div className="p-6 md:p-8 space-y-6 bg-[#0B0F19] text-slate-200 print:bg-white print:text-black" id="printable-rent-slip">
              {/* Slip Header */}
              <div className="text-center border-b border-slate-800 pb-5 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest px-3 py-0.5 bg-amber-500/10 rounded-full">
                  OFFICIAL RENT RECEIPT & STATEMENT
                </span>
                <h2 className="text-2xl font-black text-white">{showRentSlipModal.property.title}</h2>
                <p className="text-xs text-slate-400">{showRentSlipModal.property.address}, {showRentSlipModal.property.city}</p>
                <div className="flex justify-center gap-4 text-[11px] text-slate-500 pt-1">
                  <span>Receipt No: <strong className="font-mono text-slate-300">RCP-{showRentSlipModal.tenant.id.slice(-6).toUpperCase()}</strong></span>
                  <span>Date: <strong className="text-slate-300">{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</strong></span>
                </div>
              </div>

              {/* Tenant & Landlord Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#111827] p-4 rounded-2xl border border-slate-800 text-xs">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">👤 Kirayedaar (Tenant Details)</span>
                  <div className="font-bold text-sm text-white">{showRentSlipModal.tenant.name}</div>
                  {showRentSlipModal.tenant.father_or_spouse_name && (
                    <div className="text-slate-400">Father/Guardian: {showRentSlipModal.tenant.father_or_spouse_name}</div>
                  )}
                  <div className="text-slate-400">Phone: {showRentSlipModal.tenant.phone}</div>
                  {showRentSlipModal.tenant.aadhaar_no && (
                    <div className="text-slate-400">Aadhaar: <span className="font-mono text-slate-300">{showRentSlipModal.tenant.aadhaar_no}</span></div>
                  )}
                  {showRentSlipModal.tenant.permanent_address && (
                    <div className="text-slate-400">Address: {showRentSlipModal.tenant.permanent_address}</div>
                  )}
                </div>

                <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
                  <span className="text-[10px] font-bold text-blue-400 uppercase">🏠 Makan Malik (Owner Details)</span>
                  <div className="font-bold text-sm text-white">{showRentSlipModal.property.landlord_name || "Makan Malik"}</div>
                  <div className="text-slate-400">Phone: {showRentSlipModal.property.landlord_phone || "+91 98765 43210"}</div>
                  {showRentSlipModal.property.landlord_pan && (
                    <div className="text-slate-400">Landlord PAN (HRA): <span className="font-mono text-slate-300">{showRentSlipModal.property.landlord_pan}</span></div>
                  )}
                  <div className="text-amber-300 font-semibold pt-1">
                    🔄 Rent Cycle: Har Mahine {showRentSlipModal.tenant.cycle_start_day || 5} se {showRentSlipModal.tenant.cycle_end_day || 4} taarikh
                  </div>
                </div>
              </div>

              {/* Itemized Calculation Table */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Hisab-Kitab Breakup (किराया एवं समायोजन)</span>
                <div className="border border-slate-800 rounded-2xl overflow-hidden text-xs">
                  <div className="grid grid-cols-3 bg-[#111827] p-3 font-bold text-slate-400 border-b border-slate-800">
                    <div className="col-span-2">Mad / Description</div>
                    <div className="text-right">Amount (₹)</div>
                  </div>

                  <div className="p-3 border-b border-slate-800 flex justify-between">
                    <div>
                      <div className="font-bold text-white">Base Monthly Rent (मासिक किराया)</div>
                      <div className="text-[11px] text-slate-500">Unit: {showRentSlipModal.tenant.room_number || "Main Property"}</div>
                    </div>
                    <div className="font-bold text-white">₹{showRentSlipModal.tenant.monthly_rent.toLocaleString("en-IN")}</div>
                  </div>

                  {(showRentSlipModal.tenant.maintenance_deduction_amount || 0) > 0 && (
                    <div className="p-3 border-b border-slate-800 flex justify-between text-rose-400 bg-rose-500/5">
                      <div>
                        <div className="font-bold">Less: Tenant-Paid Maintenance / Repair Deduction</div>
                        <div className="text-[11px] text-slate-500">{showRentSlipModal.tenant.maintenance_deduction_notes || "Repair adjusted"}</div>
                      </div>
                      <div className="font-bold">-₹{showRentSlipModal.tenant.maintenance_deduction_amount?.toLocaleString("en-IN")}</div>
                    </div>
                  )}

                  <div className="p-4 bg-emerald-500/10 flex justify-between items-center text-emerald-400 font-bold">
                    <div>
                      <div className="text-sm font-black">Net Rent Paid / Received (कुल प्राप्त किराया)</div>
                      <div className="text-[11px] text-emerald-300 font-normal">
                        Mode: {(showRentSlipModal.tenant.last_payment_mode || "UPI / Online").toUpperCase()} | Status: PAID ✅
                      </div>
                    </div>
                    <div className="text-xl font-black">
                      ₹{Math.max(0, showRentSlipModal.tenant.monthly_rent - (showRentSlipModal.tenant.maintenance_deduction_amount || 0)).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Deposit & Advance Status Box */}
              <div className="p-4 bg-[#111827] rounded-2xl border border-slate-800 text-xs space-y-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase">🛡️ Security Deposit (Advance) Status</span>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="bg-[#0B0F19] p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500">Total Advance Held</span>
                    <div className="font-bold text-white mt-0.5">₹{(showRentSlipModal.tenant.security_deposit || 0).toLocaleString("en-IN")}</div>
                  </div>
                  <div className="bg-[#0B0F19] p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-rose-400">Damage Deductions</span>
                    <div className="font-bold text-rose-400 mt-0.5">-₹{(showRentSlipModal.tenant.damage_deduction_amount || 0).toLocaleString("en-IN")}</div>
                  </div>
                  <div className="bg-[#0B0F19] p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-emerald-400">Net Refundable Balance</span>
                    <div className="font-bold text-emerald-400 mt-0.5">
                      ₹{Math.max(0, (showRentSlipModal.tenant.security_deposit || 0) - (showRentSlipModal.tenant.damage_deduction_amount || 0)).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Agreement Terms Summary & Signatures */}
              <div className="pt-2 border-t border-slate-800 space-y-4">
                <div className="text-[11px] text-slate-500 leading-relaxed">
                  <strong>Niyam & Agreement:</strong> Notice period is {showRentSlipModal.tenant.notice_period_days || 30} days. {showRentSlipModal.tenant.early_exit_penalty || ""}. {showRentSlipModal.tenant.special_terms || ""}
                </div>

                <div className="flex justify-between pt-6 text-xs text-slate-400">
                  <div className="text-center space-y-1">
                    <div className="w-32 border-b border-slate-700 pb-1 font-semibold text-white">
                      {showRentSlipModal.property.landlord_name || "Makan Malik"}
                    </div>
                    <span className="text-[10px] text-slate-500">Landlord Signature</span>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="w-32 border-b border-slate-700 pb-1 font-semibold text-white">
                      {showRentSlipModal.tenant.name}
                    </div>
                    <span className="text-[10px] text-slate-500">Tenant Signature</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD / EDIT TENANT MODAL (COMPLETE PROFILE & AGREEMENT)            */}
      {/* ========================================================================= */}
      {(showAddTenantModal || showEditTenantModal) && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 md:p-8 w-full max-w-2xl space-y-5 my-auto max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  {showEditTenantModal ? "Kirayedaar Profile & Agreement Edit Karein" : "Naya Kirayedaar (Tenant) Jodein"}
                </h3>
                <p className="text-xs text-slate-400">
                  Kirayedaar ka naam, mobile, sthayi pata, advance deposit, cycle dates (e.g. 5 se 4), agreement aur damage deduction niyam.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddTenantModal(false);
                  setShowEditTenantModal(null);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={showEditTenantModal ? handleSaveEditedTenant : handleCreateTenant} className="space-y-4">
              {/* Property Selector */}
              {!showEditTenantModal && rentalProperties.length > 1 && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                  <label className="text-xs font-bold text-amber-300 block mb-1">
                    🏠 Kis Property / Dukan / Flat ke liye Kirayedaar jod rahe hain?
                  </label>
                  <select
                    value={selectedPropId}
                    onChange={(e) => setSelectedPropId(e.target.value)}
                    className="w-full p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs font-bold"
                  >
                    {rentalProperties.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.property_type.replace('_', ' ')}) — {p.address}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Personal Details */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  1. Kirayedaar Ki Details (व्यक्तिगत जानकारी)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-400">Kirayedaar ka Poora Naam *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={newTenantName}
                      onChange={(e) => setNewTenantName(e.target.value)}
                      className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400">Pita / Pati ka Naam (Father / C/o)</label>
                    <input
                      type="text"
                      placeholder="e.g. Shri Suresh Sharma"
                      value={newTenantFatherSpouse}
                      onChange={(e) => setNewTenantFatherSpouse(e.target.value)}
                      className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-400">Mobile No. (WhatsApp) *</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98765 00000"
                      value={newTenantPhone}
                      onChange={(e) => setNewTenantPhone(e.target.value)}
                      className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400">Alternate / Emergency Phone</label>
                    <input
                      type="text"
                      placeholder="+91 98112..."
                      value={newTenantAltPhone}
                      onChange={(e) => setNewTenantAltPhone(e.target.value)}
                      className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400">Aadhaar / ID Card No.</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012"
                      value={newTenantAadhaar}
                      onChange={(e) => setNewTenantAadhaar(e.target.value)}
                      className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-400">Sthayi Pata (Permanent Home Address)</label>
                    <input
                      type="text"
                      placeholder="e.g. Village, Tehsil, District, State"
                      value={newTenantPermAddress}
                      onChange={(e) => setNewTenantPermAddress(e.target.value)}
                      className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400">Vyavasay / Job (Occupation)</label>
                    <input
                      type="text"
                      placeholder="e.g. Software Engineer / Student / Trader"
                      value={newTenantOccupation}
                      onChange={(e) => setNewTenantOccupation(e.target.value)}
                      className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Rent, Advance & Billing Cycle Dates */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  2. Rent, Advance (डिपॉजिट) aur Cycle Dates
                </span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-400">Monthly Rent (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newTenantRent}
                      onChange={(e) => setNewTenantRent(Number(e.target.value))}
                      className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400">Advance Deposit (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newTenantDeposit}
                      onChange={(e) => setNewTenantDeposit(Number(e.target.value))}
                      className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400">Advance Payment Mode</label>
                    <select
                      value={newTenantDepositMode}
                      onChange={(e) => setNewTenantDepositMode(e.target.value as any)}
                      className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                    >
                      <option value="upi">UPI / GPay / PhonePe</option>
                      <option value="bank_transfer">Bank Transfer / NEFT</option>
                      <option value="cash">Cash (नकद)</option>
                      <option value="cheque">Cheque</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400">Joining Date (शुरू दिनांक)</label>
                    <input
                      type="date"
                      value={newTenantJoiningDate}
                      onChange={(e) => setNewTenantJoiningDate(e.target.value)}
                      className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>

                {/* Billing Cycle Start and End Days */}
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> Billing Cycle Configuration (महीना कब से कब तक?)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400">Cycle Start Day (हर महीने किस तारीख से?)</label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={newTenantCycleStartDay}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setNewTenantCycleStartDay(val);
                          setNewTenantCycleEndDay(val === 1 ? 30 : val - 1);
                        }}
                        className="w-full mt-1 p-2 bg-[#0B0F19] border border-slate-800 rounded-lg text-white text-xs"
                      />
                      <span className="text-[10px] text-slate-500">उदा. 5 तारीख को शुरू</span>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-400">Cycle End Day (अगले महीने किस तारीख को खत्म?)</label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={newTenantCycleEndDay}
                        onChange={(e) => setNewTenantCycleEndDay(Number(e.target.value))}
                        className="w-full mt-1 p-2 bg-[#0B0F19] border border-slate-800 rounded-lg text-white text-xs"
                      />
                      <span className="text-[10px] text-slate-500">उदा. 4 तारीख को खत्म</span>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-400">Rent Due Date (किराया आने की अंतिम तिथि)</label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={newTenantDueDay}
                        onChange={(e) => setNewTenantDueDay(Number(e.target.value))}
                        className="w-full mt-1 p-2 bg-[#0B0F19] border border-slate-800 rounded-lg text-white text-xs"
                      />
                      <span className="text-[10px] text-slate-500">उदा. हर महीने 5 तारीख</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agreement & Lock-in Terms */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  3. Agreement & Early Exit Niyam (नियम व शर्तें)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-400">Agreement Duration (महीने)</label>
                    <input
                      type="number"
                      value={newTenantAgreementMonths}
                      onChange={(e) => setNewTenantAgreementMonths(Number(e.target.value))}
                      className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400">Lock-in Period (महीने)</label>
                    <input
                      type="number"
                      value={newTenantLockInMonths}
                      onChange={(e) => setNewTenantLockInMonths(Number(e.target.value))}
                      className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400">Notice Period (दिन)</label>
                    <input
                      type="number"
                      value={newTenantNoticeDays}
                      onChange={(e) => setNewTenantNoticeDays(Number(e.target.value))}
                      className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400">Samay se pehle chhodne par deduction clause</label>
                  <input
                    type="text"
                    value={newTenantEarlyExitPenalty}
                    onChange={(e) => setNewTenantEarlyExitPenalty(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              {/* Room & Bed Allocation if PG */}
              {activeProperty.has_hostel_model && (
                <div className="space-y-2 pt-3 border-t border-slate-800">
                  <label className="text-xs font-bold text-slate-400">Assign Room & Bed</label>
                  <select
                    value={newTenantBedId}
                    onChange={(e) => {
                      setNewTenantBedId(e.target.value);
                      const selectedBed = activeRooms.flatMap((r) => r.beds).find((b) => b.id === e.target.value);
                      if (selectedBed) {
                        setNewTenantRoomNo(`Room ${selectedBed.room_number}`);
                        setNewTenantRent(selectedBed.monthly_rent);
                      }
                    }}
                    className="w-full p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                  >
                    <option value="">Select Bed from Available Rooms</option>
                    {activeRooms.map((rm) =>
                      rm.beds
                        .filter((b) => b.status === "vacant" || b.id === showEditTenantModal?.bed_id)
                        .map((b) => (
                          <option key={b.id} value={b.id}>
                            {rm.room_number} - {b.bed_number} (₹{b.monthly_rent}/mo)
                          </option>
                        ))
                    )}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddTenantModal(false);
                    setShowEditTenantModal(null);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/20"
                >
                  {showEditTenantModal ? "Save Changes" : "Save Tenant & Advance"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: DAMAGE RECOVERY & DEDUCTION MODAL                                 */}
      {/* ========================================================================= */}
      {showDamageModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-black text-white">Damage Recovery (टूट-फूट भरपाई)</h3>
              </div>
              <button onClick={() => setShowDamageModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Kirayedaar <strong>{showDamageModal.name}</strong> ke security deposit se damage recovery deduct karein:
            </p>

            <form onSubmit={handleApplyDamageDeduction} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400">Damage / Bharpai Amount (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 2500"
                  value={damageAmount}
                  onChange={(e) => setDamageAmount(Number(e.target.value))}
                  className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400">Damage Details / Reason (क्या खराब हुआ?)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Bathroom washbasin crack & wall repaint charges"
                  value={damageNotes}
                  onChange={(e) => setDamageNotes(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                Current Deposit: ₹{(showDamageModal.security_deposit || 0).toLocaleString("en-IN")} → New Balance: ₹{Math.max(0, (showDamageModal.security_deposit || 0) - (showDamageModal.damage_deduction_amount || 0) - damageAmount).toLocaleString("en-IN")}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDamageModal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black shadow-lg shadow-rose-600/20"
                >
                  Apply Deduction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ADD EXPENSE & MAINTENANCE                                        */}
      {/* ========================================================================= */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-black text-white">Maintenance & Expense Entry</h3>
              </div>
              <button onClick={() => setShowAddExpenseModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400">Expense Category</label>
                  <select
                    value={newExpCat}
                    onChange={(e) => setNewExpCat(e.target.value as any)}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                  >
                    <option value="maintenance">🔧 Plumber / Electrician Repair</option>
                    <option value="damage_repair">🛠️ Damage Repair</option>
                    <option value="electricity_main">⚡ Main Power Bill</option>
                    <option value="water_supply">💧 Water Supply / Motor</option>
                    <option value="maid_cleaning">🧹 Cleaning & Whitewash</option>
                    <option value="cook_salary">👨‍🍳 Cook / Staff Salary</option>
                    <option value="property_tax">🏛️ Municipal Property Tax</option>
                    <option value="other">📦 Other Expense</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400">Amount (₹)</label>
                  <input
                    type="number"
                    value={newExpAmount}
                    onChange={(e) => setNewExpAmount(Number(e.target.value))}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs font-bold"
                  />
                </div>
              </div>

              {/* Who Paid for this Repair? */}
              <div className="p-3 bg-[#0B0F19] border border-slate-800 rounded-xl space-y-2">
                <label className="text-xs font-bold text-amber-400">Kon Karega / Kisne Paise Diye? (Who Paid?)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewExpPaidBy("owner");
                      setNewExpAdjustInRent(false);
                    }}
                    className={`p-2 rounded-lg text-xs font-bold border transition ${
                      newExpPaidBy === "owner"
                        ? "bg-amber-500 text-slate-950 border-amber-500"
                        : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                  >
                    🏠 Makan Malik (Owner)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewExpPaidBy("tenant");
                      setNewExpAdjustInRent(true);
                    }}
                    className={`p-2 rounded-lg text-xs font-bold border transition ${
                      newExpPaidBy === "tenant"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                  >
                    👤 Kirayedaar (Tenant)
                  </button>
                </div>

                {newExpPaidBy === "tenant" && (
                  <div className="pt-2 space-y-2">
                    <label className="text-[11px] font-bold text-slate-300">Select Tenant (Jiske rent se minus hoga):</label>
                    <select
                      value={newExpTenantId}
                      onChange={(e) => setNewExpTenantId(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                    >
                      <option value="">Select Tenant</option>
                      {activeTenants.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.room_number || "Unit"})
                        </option>
                      ))}
                    </select>

                    <label className="flex items-center gap-2 text-xs text-emerald-400 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={newExpAdjustInRent}
                        onChange={(e) => setNewExpAdjustInRent(e.target.checked)}
                        className="rounded"
                      />
                      <span>Is mahine ke rent me se adjust karein (-₹{newExpAmount})</span>
                    </label>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400">Notes / Payee Description</label>
                <input
                  type="text"
                  placeholder="e.g. Water motor repair & new pipe fitting"
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
                  Save Maintenance Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: ADD PROPERTY                                                     */}
      {/* ========================================================================= */}
      {showAddPropModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 md:p-8 w-full max-w-lg space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-lg font-black text-white">🏠 Nayi Property / Dukan / Flat Jodein</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Aapki property ki jankari yahan add karein. Kirayedaar (Tenant) ko add karne ke liye upar diye gaye <strong>"+ Naya Kirayedaar Jodein"</strong> button ka upyog karein.
              </p>
            </div>
            <form onSubmit={handleCreateProperty} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400">Property / Shop Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Main Market Shop No. 4 ya Sector 14 Flat"
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
                    <option value="commercial_shop">🏪 Commercial Shop / Showroom</option>
                    <option value="residential_flat">🏠 Residential Flat / Apartment</option>
                    <option value="independent_house">🏡 Independent House</option>
                    <option value="warehouse_godown">📦 Warehouse / Godown</option>
                    <option value="pg_hostel">🏢 PG & Hostel Model (Beds & Rooms)</option>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400">Makan Malik / Owner Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Aapka Naam"
                    value={newPropLandlordName}
                    onChange={(e) => setNewPropLandlordName(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                  />
                  <span className="text-[10px] text-slate-500">Rent slip par print karne ke liye</span>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400">Owner Contact No. (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    value={newPropLandlordPhone}
                    onChange={(e) => setNewPropLandlordPhone(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                  />
                  <span className="text-[10px] text-slate-500">Rent slip par aayega</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400">Address & City</label>
                <input
                  type="text"
                  placeholder="e.g. Shop No. 4, GT Road Market"
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

      {/* ========================================================================= */}
      {/* MODAL 6: ADD ROOM (PG / HOSTEL)                                           */}
      {/* ========================================================================= */}
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
                    placeholder="e.g. 101 or 202"
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
    </div>
  );
}
