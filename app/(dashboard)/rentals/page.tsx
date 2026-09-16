"use client";

import React, { useState } from "react";
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
  Scale,
  CreditCard,
  Image as ImageIcon,
  Eye,
  Sparkles,
  ArrowRight,
  LogOut,
  History,
  TrendingUp,
  UserPlus,
  MapPin,
  Maximize2
} from "lucide-react";
import { RentalProperty, RentalPropertyType, HostelRoom, RentalTenant, RentalExpense } from "@/types";
import Link from "next/link";

export default function RentalsPage() {
  const {
    members,
    currentUserId,
    rentalProperties,
    addRentalProperty,
    updateRentalProperty,
    deleteRentalProperty,
    addHostelRoom,
    addRentalTenant,
    updateRentalTenant,
    deleteRentalTenant,
    vacateAndSettleTenant,
    collectRentPayment,
    addRentalExpense,
    deleteRentalExpense
  } = useFamilyStore();

  const [selectedPropId, setSelectedPropId] = useState<string>(rentalProperties[0]?.id || "");
  const [activeTab, setActiveTab] = useState<"tenants" | "past_tenants" | "rooms_beds" | "maintenance_expenses" | "agreement_rules" | "wealth_details" | "submeter">("tenants");

  // Single Unified Modal State
  const [showUnifiedModal, setShowUnifiedModal] = useState(false);
  const [unifiedMode, setUnifiedMode] = useState<"both" | "tenant_only" | "property_only">("both");
  const [showEditTenantModal, setShowEditTenantModal] = useState<RentalTenant | null>(null);
  const [showEditPropModal, setShowEditPropModal] = useState<RentalProperty | null>(null);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showRentSlipModal, setShowRentSlipModal] = useState<{ tenant: RentalTenant; property: RentalProperty } | null>(null);
  const [showDamageModal, setShowDamageModal] = useState<RentalTenant | null>(null);
  const [showDocPreview, setShowDocPreview] = useState<{ title: string; url: string } | null>(null);

  // Tenant Checkout / Settle & Vacate Modal State
  const [showVacateModal, setShowVacateModal] = useState<{ tenant: RentalTenant; property: RentalProperty } | null>(null);
  const [vacateFinalMeter, setVacateFinalMeter] = useState<number>(0);
  const [vacateMeterRate, setVacateMeterRate] = useState<number>(9);
  const [vacateDamageDeduction, setVacateDamageDeduction] = useState<number>(0);
  const [vacateDate, setVacateDate] = useState(new Date().toISOString().split("T")[0]);
  const [vacateReason, setVacateReason] = useState("");
  const [vacateNotes, setVacateNotes] = useState("");

  // Property Fields
  const [propTitle, setPropTitle] = useState("");
  const [propType, setPropType] = useState<RentalPropertyType>("commercial_shop");
  const [propAddress, setPropAddress] = useState("");
  const [propCity, setPropCity] = useState("Delhi NCR");
  const [propOwnerMemberId, setPropOwnerMemberId] = useState<string>(currentUserId || members[0]?.id || "m-head");
  const [propSize, setPropSize] = useState<number>(450);
  const [propSizeUnit, setPropSizeUnit] = useState<"sqft" | "sqyards" | "sqmeters" | "bigha" | "dhur">("sqft");
  const [propMarketValue, setPropMarketValue] = useState<number>(3500000);
  const [propPurchasePrice, setPropPurchasePrice] = useState<number>(2200000);
  const [propPurchaseDate, setPropPurchaseDate] = useState("2021-04-10");
  const [propRegistryNo, setPropRegistryNo] = useState("");
  const [propTargetRent, setPropTargetRent] = useState<number>(15000);
  const [propOwnerName, setPropOwnerName] = useState("Makan Malik (Self)");
  const [propOwnerPhone, setPropOwnerPhone] = useState("9876543210");
  const [propOwnerPan, setPropOwnerPan] = useState("");
  const [propOwnerUpi, setPropOwnerUpi] = useState("");
  const [propDefaultRules, setPropDefaultRules] = useState(
    "1. Har mahine ki due date tak rent jama karein.\n2. Sub-letting ya kisi aur ko kiraye par dena mana hai.\n3. Notice period: Kam se kam 30 din pehle suchit karein.\n4. Kisi bhi samagri ya fittings me damage hone par bharpai security deposit se ki jayegi.\n5. Chhote repairs (bulb, washer) tenant karega, structural repairs owner karega."
  );

  // Tenant Personal & Contact Fields
  const [targetPropertyId, setTargetPropertyId] = useState<string>(selectedPropId || rentalProperties[0]?.id || "");
  const [tenantName, setTenantName] = useState("");
  const [tenantFatherSpouse, setTenantFatherSpouse] = useState("");
  const [tenantPhone, setTenantPhone] = useState("");
  const [tenantAltPhone, setTenantAltPhone] = useState("");
  const [tenantOccupation, setTenantOccupation] = useState("");

  // Address logic (Commercial vs Residential)
  const [tenantPermAddress, setTenantPermAddress] = useState("");
  const [tenantOldAddress, setTenantOldAddress] = useState("");

  // IDs & Documents (Aadhaar & PAN)
  const [tenantAadhaar, setTenantAadhaar] = useState("");
  const [tenantPan, setTenantPan] = useState("");
  const [tenantAadhaarUrl, setTenantAadhaarUrl] = useState("");
  const [tenantPanUrl, setTenantPanUrl] = useState("");
  const [tenantPhotoUrl, setTenantPhotoUrl] = useState("");

  // Rent & Advance Fields (Fixed sticky 0)
  const [tenantRent, setTenantRent] = useState<number>(15000);
  const [tenantDeposit, setTenantDeposit] = useState<number>(30000);
  const [tenantDepositMode, setTenantDepositMode] = useState<"cash" | "upi" | "bank_transfer" | "cheque">("upi");
  const [tenantJoiningDate, setTenantJoiningDate] = useState(new Date().toISOString().split("T")[0]);

  // Billing cycle
  const [tenantCycleStartDay, setTenantCycleStartDay] = useState<number>(5);
  const [tenantCycleEndDay, setTenantCycleEndDay] = useState<number>(4);
  const [tenantDueDay, setTenantDueDay] = useState<number>(5);

  // Move-in Electricity Sub-Meter Reading
  const [tenantMoveInMeter, setTenantMoveInMeter] = useState<number>(1250);

  // Agreement & Exit Terms
  const [tenantAgreementMonths, setTenantAgreementMonths] = useState<number>(11);
  const [tenantLockInMonths, setTenantLockInMonths] = useState<number>(6);
  const [tenantNoticeDays, setTenantNoticeDays] = useState<number>(30);
  const [tenantEarlyExitPenalty, setTenantEarlyExitPenalty] = useState("1 mahine ka rent kata jayega agar lock-in se pehle khali kiya");
  const [tenantSpecialTerms, setTenantSpecialTerms] = useState("Damage bharpai security deposit se hogi. Bijli bill meter reading ke mutabik har mahine alag se deya hoga.");
  const [tenantNotes, setTenantNotes] = useState("");

  // PG Specific
  const [tenantRoomNo, setTenantRoomNo] = useState("");
  const [tenantBedId, setTenantBedId] = useState("");
  const [tenantFood, setTenantFood] = useState(false);

  // New Room Form State
  const [newRoomNo, setNewRoomNo] = useState("");
  const [newRoomFloor, setNewRoomFloor] = useState("First Floor");
  const [newRoomSharing, setNewRoomSharing] = useState<"single" | "double" | "triple" | "four_sharing">("double");
  const [newRoomRentPerBed, setNewRoomRentPerBed] = useState<number>(8000);
  const [newRoomSubMeterReading, setNewRoomSubMeterReading] = useState<number>(100);

  // Damage / Deduction Form State
  const [damageAmount, setDamageAmount] = useState<number>(0);
  const [damageNotes, setDamageNotes] = useState("");

  // Expense / Maintenance Form State
  const [newExpCat, setNewExpCat] = useState<RentalExpense["category"]>("maintenance");
  const [newExpAmount, setNewExpAmount] = useState<number>(1500);
  const [newExpPaidBy, setNewExpPaidBy] = useState<"owner" | "tenant">("owner");
  const [newExpAdjustInRent, setNewExpAdjustInRent] = useState(false);
  const [newExpTenantId, setNewExpTenantId] = useState("");
  const [newExpNote, setNewExpNote] = useState("");
  const [newExpDate, setNewExpDate] = useState(new Date().toISOString().split("T")[0]);

  // Submeter Calculator
  const [meterPrevUnit, setMeterPrevUnit] = useState<number>(1420);
  const [meterCurrUnit, setMeterCurrUnit] = useState<number>(1530);
  const [meterRate, setMeterRate] = useState<number>(9);

  const activeProperty = rentalProperties.find((p) => p.id === selectedPropId) || rentalProperties[0];

  // Overall Portfolio Calculations
  const totalMonthlyTarget = rentalProperties.reduce((sum, p) => sum + (p.monthly_target_revenue || 0), 0);
  const totalDeposits = rentalProperties.reduce((sum, p) => sum + (p.security_deposit_holding || 0), 0);
  const totalPortfolioValuation = rentalProperties.reduce((sum, p) => sum + (p.estimated_market_value || 0), 0);

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

  // Active Property Calculations
  const activeTenants = activeProperty?.tenants || [];
  const pastTenants = activeProperty?.past_tenants || [];
  const activeExpenses = activeProperty?.expenses || [];
  const activeRooms = activeProperty?.rooms || [];

  const totalCollectedThisMonth = activeTenants
    .filter((t) => t.rent_status === "paid")
    .reduce((sum, t) => sum + Number(t.monthly_rent || 0), 0);

  const totalPendingRent = activeTenants
    .filter((t) => t.rent_status !== "paid")
    .reduce((sum, t) => sum + Number(t.monthly_rent || 0), 0);

  const totalExpensesAmount = activeExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  // File Upload Helper (FileReader to base64 for instant preview)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset Master Form
  const resetMasterForm = () => {
    setPropTitle("");
    setPropType("commercial_shop");
    setPropAddress("");
    setPropSize(450);
    setPropSizeUnit("sqft");
    setPropMarketValue(3500000);
    setPropPurchasePrice(2200000);
    setPropPurchaseDate("2021-04-10");
    setPropRegistryNo("");
    setPropOwnerMemberId(currentUserId || members[0]?.id || "m-head");
    setPropTargetRent(15000);
    setTenantName("");
    setTenantFatherSpouse("");
    setTenantPhone("");
    setTenantAltPhone("");
    setTenantOccupation("");
    setTenantPermAddress("");
    setTenantOldAddress("");
    setTenantAadhaar("");
    setTenantPan("");
    setTenantAadhaarUrl("");
    setTenantPanUrl("");
    setTenantPhotoUrl("");
    setTenantRent(15000);
    setTenantDeposit(30000);
    setTenantDepositMode("upi");
    setTenantJoiningDate(new Date().toISOString().split("T")[0]);
    setTenantCycleStartDay(5);
    setTenantCycleEndDay(4);
    setTenantDueDay(5);
    setTenantMoveInMeter(1250);
    setTenantAgreementMonths(11);
    setTenantLockInMonths(6);
    setTenantNoticeDays(30);
    setTenantEarlyExitPenalty("1 mahine ka rent kata jayega agar lock-in se pehle khali kiya");
    setTenantSpecialTerms("Damage bharpai security deposit se hogi. Bijli bill meter reading ke mutabik har mahine alag se deya hoga.");
    setTenantNotes("");
    setTenantRoomNo("");
    setTenantBedId("");
  };

  // Open Unified Modal
  const handleOpenUnifiedModal = (mode: "both" | "tenant_only" | "property_only" = "both", prefillMoveInMeter?: number, prefillUnit?: string) => {
    resetMasterForm();
    setUnifiedMode(mode);
    setTargetPropertyId(activeProperty?.id || rentalProperties[0]?.id || "");
    if (prefillMoveInMeter !== undefined) {
      setTenantMoveInMeter(prefillMoveInMeter);
    }
    if (prefillUnit) {
      setTenantRoomNo(prefillUnit);
    }
    setShowUnifiedModal(true);
  };

  // Submit Unified Form (Property + Tenant in 1 click)
  const handleSaveUnifiedEntry = (e: React.FormEvent) => {
    e.preventDefault();

    let createdPropId = targetPropertyId;
    const selectedOwner = members.find((m) => m.id === propOwnerMemberId);

    // 1. Create Property if mode is 'both' or 'property_only'
    if (unifiedMode === "both" || unifiedMode === "property_only") {
      if (!propTitle) {
        alert("Kripya Property / Dukan ka Title daalein!");
        return;
      }

      const formattedOwnerPhone = propOwnerPhone ? (propOwnerPhone.startsWith("+91") ? propOwnerPhone : `+91 ${propOwnerPhone}`) : "";

      const newProperty = addRentalProperty({
        title: propTitle,
        property_type: propType,
        address: propAddress,
        city: propCity,
        owner_member_id: propOwnerMemberId,
        owner_member_name: selectedOwner?.name || propOwnerName || "Makan Malik",
        property_size: Number(propSize || 0),
        size_unit: propSizeUnit,
        estimated_market_value: Number(propMarketValue || 0),
        purchase_price: Number(propPurchasePrice || 0),
        purchase_date: propPurchaseDate,
        registration_deed_no: propRegistryNo,
        landlord_name: selectedOwner?.name || propOwnerName || "Makan Malik",
        landlord_phone: formattedOwnerPhone,
        landlord_pan: propOwnerPan,
        landlord_upi: propOwnerUpi,
        total_units_or_rooms: 1,
        total_capacity_beds: propType === "pg_hostel" ? 6 : 1,
        has_hostel_model: propType === "pg_hostel",
        monthly_target_revenue: Number(propTargetRent || tenantRent || 0),
        security_deposit_holding: 0,
        default_rules: propDefaultRules,
        rooms: propType === "pg_hostel" ? [] : undefined
      });

      createdPropId = newProperty.id;
      setSelectedPropId(newProperty.id);
    }

    // 2. Create Tenant if mode is 'both' or 'tenant_only'
    if (unifiedMode === "both" || unifiedMode === "tenant_only") {
      if (!tenantName) {
        alert("Kripya Kirayedaar ka Naam daalein!");
        return;
      }

      const formattedPhone = tenantPhone ? (tenantPhone.startsWith("+91") ? tenantPhone : `+91 ${tenantPhone}`) : "";
      const formattedAltPhone = tenantAltPhone ? (tenantAltPhone.startsWith("+91") ? tenantAltPhone : `+91 ${tenantAltPhone}`) : "";

      addRentalTenant(createdPropId, {
        name: tenantName,
        father_or_spouse_name: tenantFatherSpouse,
        phone: formattedPhone,
        alternate_phone: formattedAltPhone,
        aadhaar_no: tenantAadhaar,
        pan_no: tenantPan,
        aadhaar_card_url: tenantAadhaarUrl,
        pan_card_url: tenantPanUrl,
        photo_url: tenantPhotoUrl,
        permanent_address: tenantPermAddress,
        current_address: propAddress || activeProperty?.address || "",
        native_or_permanent_address: tenantPermAddress,
        occupation: tenantOccupation,
        is_commercial: propType === "commercial_shop" || propType === "warehouse_godown",
        tenant_status: "active",
        move_in_meter_reading: Number(tenantMoveInMeter || 0),
        joining_date: tenantJoiningDate,
        cycle_start_day: Number(tenantCycleStartDay || 1),
        cycle_end_day: Number(tenantCycleEndDay || 30),
        rent_due_day: Number(tenantDueDay || 5),
        monthly_rent: Number(tenantRent || 0),
        security_deposit: Number(tenantDeposit || 0),
        advance_payment_date: tenantJoiningDate,
        advance_payment_mode: tenantDepositMode,
        advance_status: "held",
        agreement_duration_months: Number(tenantAgreementMonths || 11),
        agreement_start_date: tenantJoiningDate,
        lock_in_period_months: Number(tenantLockInMonths || 6),
        notice_period_days: Number(tenantNoticeDays || 30),
        early_exit_penalty: tenantEarlyExitPenalty,
        special_terms: tenantSpecialTerms,
        rent_status: "paid",
        food_included: tenantFood,
        room_number: tenantRoomNo || (propType === "commercial_shop" ? "Shop Unit" : "Unit 1"),
        bed_id: tenantBedId || undefined,
        last_paid_date: new Date().toISOString().split("T")[0],
        notes: tenantNotes
      });
    }

    setShowUnifiedModal(false);
    resetMasterForm();
  };

  // Open Edit Tenant Modal
  const openEditModal = (t: RentalTenant) => {
    setShowEditTenantModal(t);
    setTenantName(t.name || "");
    setTenantFatherSpouse(t.father_or_spouse_name || "");
    setTenantPhone((t.phone || "").replace("+91", "").trim());
    setTenantAltPhone((t.alternate_phone || "").replace("+91", "").trim());
    setTenantAadhaar(t.aadhaar_no || "");
    setTenantPan(t.pan_no || "");
    setTenantAadhaarUrl(t.aadhaar_card_url || "");
    setTenantPanUrl(t.pan_card_url || "");
    setTenantPhotoUrl(t.photo_url || "");
    setTenantPermAddress(t.permanent_address || "");
    setTenantOldAddress(t.current_address || "");
    setTenantOccupation(t.occupation || "");
    setTenantRent(t.monthly_rent || 0);
    setTenantDeposit(t.security_deposit || 0);
    setTenantDepositMode(t.advance_payment_mode || "upi");
    setTenantJoiningDate(t.joining_date || new Date().toISOString().split("T")[0]);
    setTenantCycleStartDay(t.cycle_start_day || 5);
    setTenantCycleEndDay(t.cycle_end_day || 4);
    setTenantDueDay(t.rent_due_day || 5);
    setTenantMoveInMeter(t.move_in_meter_reading || 0);
    setTenantAgreementMonths(t.agreement_duration_months || 11);
    setTenantLockInMonths(t.lock_in_period_months || 6);
    setTenantNoticeDays(t.notice_period_days || 30);
    setTenantEarlyExitPenalty(t.early_exit_penalty || "1 Month Rent");
    setTenantSpecialTerms(t.special_terms || "");
    setTenantNotes(t.notes || "");
  };

  // Save Edited Tenant
  const handleSaveEditedTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditTenantModal || !activeProperty) return;

    const formattedPhone = tenantPhone ? (tenantPhone.startsWith("+91") ? tenantPhone : `+91 ${tenantPhone}`) : "";
    const formattedAltPhone = tenantAltPhone ? (tenantAltPhone.startsWith("+91") ? tenantAltPhone : `+91 ${tenantAltPhone}`) : "";

    updateRentalTenant(activeProperty.id, showEditTenantModal.id, {
      name: tenantName,
      father_or_spouse_name: tenantFatherSpouse,
      phone: formattedPhone,
      alternate_phone: formattedAltPhone,
      aadhaar_no: tenantAadhaar,
      pan_no: tenantPan,
      aadhaar_card_url: tenantAadhaarUrl,
      pan_card_url: tenantPanUrl,
      photo_url: tenantPhotoUrl,
      permanent_address: tenantPermAddress,
      occupation: tenantOccupation,
      move_in_meter_reading: Number(tenantMoveInMeter || 0),
      joining_date: tenantJoiningDate,
      cycle_start_day: Number(tenantCycleStartDay || 1),
      cycle_end_day: Number(tenantCycleEndDay || 30),
      rent_due_day: Number(tenantDueDay || 5),
      monthly_rent: Number(tenantRent || 0),
      security_deposit: Number(tenantDeposit || 0),
      advance_payment_mode: tenantDepositMode,
      agreement_duration_months: Number(tenantAgreementMonths || 11),
      lock_in_period_months: Number(tenantLockInMonths || 6),
      notice_period_days: Number(tenantNoticeDays || 30),
      early_exit_penalty: tenantEarlyExitPenalty,
      special_terms: tenantSpecialTerms,
      notes: tenantNotes
    });

    setShowEditTenantModal(null);
    resetMasterForm();
  };

  // Open Edit Property Modal
  const openEditPropertyModal = (p: RentalProperty) => {
    setShowEditPropModal(p);
    setPropTitle(p.title || "");
    setPropType(p.property_type || "commercial_shop");
    setPropAddress(p.address || "");
    setPropCity(p.city || "Delhi NCR");
    setPropOwnerMemberId(p.owner_member_id || currentUserId || "m-head");
    setPropSize(p.property_size || 450);
    setPropSizeUnit(p.size_unit || "sqft");
    setPropMarketValue(p.estimated_market_value || 3500000);
    setPropPurchasePrice(p.purchase_price || 2200000);
    setPropPurchaseDate(p.purchase_date || "2021-04-10");
    setPropRegistryNo(p.registration_deed_no || "");
    setPropTargetRent(p.monthly_target_revenue || 15000);
    setPropOwnerName(p.landlord_name || "Makan Malik");
    setPropOwnerPhone((p.landlord_phone || "").replace("+91", "").trim());
    setPropOwnerPan(p.landlord_pan || "");
    setPropDefaultRules(p.default_rules || propDefaultRules);
  };

  // Save Edited Property
  const handleSaveEditedProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditPropModal) return;

    const selectedOwner = members.find((m) => m.id === propOwnerMemberId);
    const formattedOwnerPhone = propOwnerPhone ? (propOwnerPhone.startsWith("+91") ? propOwnerPhone : `+91 ${propOwnerPhone}`) : "";

    updateRentalProperty(showEditPropModal.id, {
      title: propTitle,
      property_type: propType,
      address: propAddress,
      city: propCity,
      owner_member_id: propOwnerMemberId,
      owner_member_name: selectedOwner?.name || propOwnerName || "Makan Malik",
      property_size: Number(propSize || 0),
      size_unit: propSizeUnit,
      estimated_market_value: Number(propMarketValue || 0),
      purchase_price: Number(propPurchasePrice || 0),
      purchase_date: propPurchaseDate,
      registration_deed_no: propRegistryNo,
      landlord_name: selectedOwner?.name || propOwnerName || "Makan Malik",
      landlord_phone: formattedOwnerPhone,
      landlord_pan: propOwnerPan,
      monthly_target_revenue: Number(propTargetRent || 0),
      default_rules: propDefaultRules
    });

    setShowEditPropModal(null);
  };

  // Open Vacate & Settle Modal
  const openVacateModal = (tenant: RentalTenant, property: RentalProperty) => {
    setShowVacateModal({ tenant, property });
    const checkInReading = tenant.move_in_meter_reading || 0;
    setVacateFinalMeter(checkInReading + 110);
    setVacateMeterRate(9);
    setVacateDamageDeduction(0);
    setVacateDate(new Date().toISOString().split("T")[0]);
    setVacateReason("Contract Completed / Kirayedaar Shifting");
    setVacateNotes("Full final settlement done. Keys received.");
  };

  // Submit Vacate & Settle
  const handleConfirmVacateAndSettle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showVacateModal) return;

    const { tenant, property } = showVacateModal;
    const checkInReading = tenant.move_in_meter_reading || 0;
    const consumedUnits = Math.max(0, vacateFinalMeter - checkInReading);
    const elecBill = consumedUnits * vacateMeterRate;
    const totalAdvance = tenant.security_deposit || 0;
    const netRefund = Math.max(0, totalAdvance - elecBill - vacateDamageDeduction);

    vacateAndSettleTenant(property.id, tenant.id, {
      final_meter_reading: Number(vacateFinalMeter),
      final_electricity_charge: elecBill,
      final_damage_deduction: Number(vacateDamageDeduction),
      final_advance_refunded: netRefund,
      vacate_date: vacateDate,
      reason: vacateReason,
      notes: `${vacateReason}. Consumed: ${consumedUnits} units @ ₹${vacateMeterRate} = ₹${elecBill}. Damage: ₹${vacateDamageDeduction}. Refund: ₹${netRefund}. ${vacateNotes}`
    });

    setShowVacateModal(null);
  };

  // Create Room Handler (PG)
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

  // Expense Handler
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

  // Damage Deduction Handler
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

  // WhatsApp Slip URL Generator
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
${tenant.aadhaar_no ? `🆔 *Aadhaar:* ${tenant.aadhaar_no}\n` : ""}${tenant.pan_no ? `💳 *PAN:* ${tenant.pan_no}\n` : ""}🏢 *Unit/Shop:* ${tenant.room_number || "Main Property"} ${tenant.bed_number || ""}
📅 *Cycle Period:* Har mahine ${startDay} taarikh se ${endDay} taarikh tak
⚡ *Check-in Meter Unit:* ${tenant.move_in_meter_reading || "N/A"}
💰 *Rent Status:* PAID ✅ (Date: ${tenant.last_paid_date || today})

*--- HISAAB-KITAAB BREAKUP ---*
➕ Base Monthly Rent: ₹${tenant.monthly_rent.toLocaleString("en-IN")}
${(tenant.maintenance_deduction_amount || 0) > 0 ? `➖ Maintenance / Repair Adjustment: -₹${tenant.maintenance_deduction_amount?.toLocaleString("en-IN")} (${tenant.maintenance_deduction_notes || "Tenant Paid"})\n` : ""}💵 *Net Amount Received:* ₹${netPaid.toLocaleString("en-IN")}
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
            <Building className="w-4 h-4" /> Real Estate, PG, Shops, Tenants & Family Wealth Hub
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Rental Properties, Shops & Tenants Manager
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Dukan, Flat, Makan ya PG ka kiraya, kirayedaar badalna (Vacate & Replacement), meter hisab, aur property ki market value ko Family Wealth me jodna.
          </p>
        </div>

        {/* SINGLE UNIFIED PRIMARY ACTION BUTTON */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => handleOpenUnifiedModal("both")}
            className="px-5 py-3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-sm rounded-2xl flex items-center gap-2.5 shadow-xl shadow-emerald-600/30 active:scale-95 transition-all border border-emerald-400/30"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>+ Nayi Rental Entry (Property & Kirayedaar Jodein)</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards + Wealth Value Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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

      {/* Real Estate Portfolio Valuation Bar (Sync to Family Wealth) */}
      <div className="mb-8 p-4 bg-gradient-to-r from-amber-500/10 via-[#111827] to-emerald-500/10 border border-amber-500/30 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-300">
              💎 Kul Real Estate / Property Asset Market Valuation:{" "}
              <strong className="text-white text-sm font-black">₹{totalPortfolioValuation.toLocaleString("en-IN")}</strong>
            </div>
            <p className="text-[11px] text-slate-400">
              Yeh amount aapki Parivar ki Total Wealth / Net Worth me Property assets ke roop me shamil hai.
            </p>
          </div>
        </div>

        <Link
          href="/wealth"
          className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
        >
          <span>View in Family Wealth</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
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

        <button
          onClick={() => handleOpenUnifiedModal("both")}
          className="px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap bg-slate-900 border border-dashed border-slate-700 text-amber-400 hover:border-amber-500 hover:bg-slate-800 flex items-center gap-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5" /> + Nayi Property / Kirayedaar Jodein
        </button>
      </div>

      {activeProperty ? (
        <div className="space-y-6">
          {/* Active Property Banner with Member Owner & Size & Valuation */}
          <div className="bg-gradient-to-r from-blue-950/40 via-[#111827] to-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 rounded-full font-bold text-[10px] uppercase">
                  {activeProperty.property_type.replace("_", " ")}
                </span>
                {activeProperty.property_size && (
                  <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 rounded-full font-bold text-[10px]">
                    📏 {activeProperty.property_size} {activeProperty.size_unit || "sqft"}
                  </span>
                )}
                <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 rounded-full font-bold text-[10px]">
                  👤 Owner: {activeProperty.owner_member_name || activeProperty.landlord_name || "Makan Malik"}
                </span>
                {activeProperty.estimated_market_value && (
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full font-bold text-[10px]">
                    💎 Market Value: ₹{activeProperty.estimated_market_value.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                {activeProperty.title}
              </h2>
              <p className="text-xs text-slate-400">
                📍 {activeProperty.address}, {activeProperty.city}
                {activeProperty.registration_deed_no ? ` | Deed No: ${activeProperty.registration_deed_no}` : ""}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => openEditPropertyModal(activeProperty)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-slate-700 transition shadow"
              >
                <Edit3 className="w-4 h-4" /> Edit Property & Valuation
              </button>

              <button
                onClick={() => handleOpenUnifiedModal("tenant_only")}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow"
              >
                <Users className="w-4 h-4" /> + Add Kirayedaar (Tenant)
              </button>

              {activeProperty.has_hostel_model && (
                <button
                  onClick={() => setShowAddRoomModal(true)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow"
                >
                  <Plus className="w-4 h-4" /> Add Room
                </button>
              )}

              <button
                onClick={() => setShowAddExpenseModal(true)}
                className="px-3.5 py-2 bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow"
              >
                <Wrench className="w-4 h-4" /> + Maintenance / Kharch
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
              <Users className="w-4 h-4" /> Active Tenants & Slips ({activeTenants.length})
            </button>

            <button
              onClick={() => setActiveTab("past_tenants")}
              className={`px-5 py-3 text-xs font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
                activeTab === "past_tenants"
                  ? "border-amber-500 text-amber-400 bg-amber-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <History className="w-4 h-4" /> Purane Kirayedaar / Exit Log ({pastTenants.length})
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
              onClick={() => setActiveTab("wealth_details")}
              className={`px-5 py-3 text-xs font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
                activeTab === "wealth_details"
                  ? "border-amber-500 text-amber-400 bg-amber-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <TrendingUp className="w-4 h-4" /> Property Wealth & Size (₹ Asset Details)
            </button>

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
              <FileCheck className="w-4 h-4" /> Agreement & Damage Policy
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
                    <h3 className="font-bold text-white text-sm">Active Tenants Directory (सक्रिय किरायेदार)</h3>
                    <p className="text-xs text-slate-400">एडवांस डिपॉजिट, साइकल डेट्स, आधार/पैन, प्रारंभिक मीटर यूनिट, रसीद एवं खाली करने का सिस्टम</p>
                  </div>
                  <span className="text-xs text-slate-400">{activeTenants.length} Active Tenants</span>
                </div>

                {activeTenants.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-sm space-y-3">
                    <Users className="w-10 h-10 mx-auto text-slate-600" />
                    <div>Yeh property filhal khali hai. Naya kirayedaar bithane ke liye niche button par click karein.</div>
                    <button
                      onClick={() => handleOpenUnifiedModal("tenant_only")}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl inline-flex items-center gap-1.5 shadow"
                    >
                      <UserPlus className="w-4 h-4" /> + Naya Kirayedaar Bithayein (Add Tenant)
                    </button>
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
                            {tenant.photo_url ? (
                              <img
                                src={tenant.photo_url}
                                alt={tenant.name}
                                className="w-12 h-12 rounded-2xl object-cover border border-amber-500/40 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-base shrink-0 border border-amber-500/30">
                                {tenant.name.charAt(0)}
                              </div>
                            )}

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
                                {tenant.aadhaar_no && (
                                  <span className="flex items-center gap-1">
                                    🆔 Aadhaar: <strong className="text-slate-300 font-mono">{tenant.aadhaar_no}</strong>
                                    {tenant.aadhaar_card_url && (
                                      <button
                                        onClick={() => setShowDocPreview({ title: `${tenant.name} - Aadhaar Card`, url: tenant.aadhaar_card_url! })}
                                        className="text-amber-400 hover:underline text-[10px] ml-1"
                                      >
                                        [View Photo]
                                      </button>
                                    )}
                                  </span>
                                )}
                                {tenant.pan_no && (
                                  <span className="flex items-center gap-1">
                                    💳 PAN: <strong className="text-slate-300 font-mono">{tenant.pan_no}</strong>
                                    {tenant.pan_card_url && (
                                      <button
                                        onClick={() => setShowDocPreview({ title: `${tenant.name} - PAN Card`, url: tenant.pan_card_url! })}
                                        className="text-blue-400 hover:underline text-[10px] ml-1"
                                      >
                                        [View Photo]
                                      </button>
                                    )}
                                  </span>
                                )}
                                {tenant.move_in_meter_reading !== undefined && (
                                  <span className="text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-[11px] font-semibold">
                                    ⚡ Check-in Sub-meter: <strong>{tenant.move_in_meter_reading} Units</strong>
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                                <span>📅 Shuru: <strong className="text-slate-300">{tenant.joining_date}</strong></span>
                                <span className="text-amber-400">🔄 Cycle: Har mahine <strong>{cycleStart} se {cycleEnd}</strong></span>
                                {tenant.occupation && <span>💼 Kaam: <strong className="text-slate-300">{tenant.occupation}</strong></span>}
                              </div>

                              {tenant.permanent_address && (
                                <p className="text-[11px] text-slate-500">
                                  🏠 Sthayi / Grah Pata: {tenant.permanent_address}
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

                              {/* VACATE & SETTLE BUTTON */}
                              <button
                                onClick={() => openVacateModal(tenant, activeProperty)}
                                className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                                title="Kirayedaar Khali Karein / Exit Settlement"
                              >
                                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                                <span>Khali Karein</span>
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

          {/* TAB 2: Past Tenants History Log */}
          {activeTab === "past_tenants" && (
            <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden space-y-4">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white text-sm">Purane Kirayedaar (Past Tenants Exit History Log)</h3>
                  <p className="text-xs text-slate-400">Pehle reh chuke kirayedaaron ka purana bahi-khata, meter reading v advance refund hisab</p>
                </div>
                <span className="text-xs text-slate-400">{pastTenants.length} Records</span>
              </div>

              {pastTenants.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-sm space-y-2">
                  <History className="w-8 h-8 mx-auto text-slate-600" />
                  <div>Is property me abhi tak koi purana kirayedaar exit nahi hua hai.</div>
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {pastTenants.map((pt) => (
                    <div key={pt.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#0B0F19]/50 transition text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <strong className="text-white text-sm">{pt.name}</strong>
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px]">
                            {pt.room_number || "Shop/Unit"}
                          </span>
                          <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded text-[10px] font-bold">
                            Vacated on: {pt.vacate_date || "Past"}
                          </span>
                        </div>
                        <div className="text-slate-400 flex flex-wrap gap-x-4 gap-y-0.5 pt-0.5">
                          <span>📞 {pt.phone}</span>
                          {pt.aadhaar_no && <span>🆔 Aadhaar: {pt.aadhaar_no}</span>}
                          <span>📅 Staying Period: {pt.joining_date} se {pt.vacate_date || "Exit"} tak</span>
                          <span>⚡ Final Meter Reading: <strong className="text-amber-300">{pt.final_meter_reading || pt.move_in_meter_reading} Units</strong></span>
                        </div>
                        {pt.settlement_summary && (
                          <p className="text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800/80 mt-1">
                            📝 <strong>Settlement Hisab:</strong> {pt.settlement_summary}
                          </p>
                        )}
                      </div>

                      <div className="text-left md:text-right shrink-0">
                        <div className="text-slate-400 text-[11px]">Refunded Advance:</div>
                        <div className="text-emerald-400 font-bold text-sm">₹{(pt.final_advance_refunded || 0).toLocaleString("en-IN")}</div>
                        <button
                          onClick={() => handleOpenUnifiedModal("tenant_only", pt.final_meter_reading, pt.room_number)}
                          className="mt-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Bithayein Naya Kirayedaar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Property Wealth & Size Details */}
          {activeTab === "wealth_details" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Asset Valuation Card */}
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
                  <TrendingUp className="w-5 h-5" /> Property Asset & Wealth Valuation
                </div>
                <p className="text-xs text-slate-400">
                  Yeh property aapki total family wealth me property asset ke roop me shamil hai:
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-4 bg-[#0B0F19] rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-slate-400">Current Market Valuation (अनुमानित बाजार भाव)</span>
                      <div className="text-2xl font-black text-amber-400 mt-0.5">
                        ₹{(activeProperty.estimated_market_value || 0).toLocaleString("en-IN")}
                      </div>
                    </div>
                    <Link
                      href="/wealth"
                      className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition"
                    >
                      View in Wealth →
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-[#0B0F19] rounded-xl border border-slate-800">
                      <span className="text-slate-500 block">Property Size (क्षेत्रफल)</span>
                      <strong className="text-white text-sm">{activeProperty.property_size || 0} {activeProperty.size_unit || "sqft"}</strong>
                    </div>
                    <div className="p-3 bg-[#0B0F19] rounded-xl border border-slate-800">
                      <span className="text-slate-500 block">Purchase Cost (खरीद लागत)</span>
                      <strong className="text-white text-sm">₹{(activeProperty.purchase_price || 0).toLocaleString("en-IN")}</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-[#0B0F19] rounded-xl border border-slate-800 text-xs flex justify-between">
                    <div>
                      <span className="text-slate-500 block">Ownership Name (किसके नाम पर है)</span>
                      <strong className="text-purple-300">{activeProperty.owner_member_name || activeProperty.landlord_name || "Self"}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block">Registry / Deed No.</span>
                      <strong className="text-slate-300 font-mono">{activeProperty.registration_deed_no || "N/A"}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => openEditPropertyModal(activeProperty)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Size, Valuation & Ownership Details
                  </button>
                </div>
              </div>

              {/* Rental Return & ROI Analysis */}
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
                  <BadgeIndianRupee className="w-5 h-5" /> Rental Yield & Return Analysis
                </div>
                <p className="text-xs text-slate-400">
                  Property ke market value aur annual rental income ka hisab:
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-emerald-300 font-bold">Annual Target Rent (सालाना किराया)</span>
                      <div className="text-xl font-black text-white mt-0.5">
                        ₹{((activeProperty.monthly_target_revenue || 0) * 12).toLocaleString("en-IN")} / year
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400">Gross Rental Yield</span>
                      <div className="text-lg font-black text-emerald-400">
                        {activeProperty.estimated_market_value
                          ? `${(((activeProperty.monthly_target_revenue || 0) * 12 / activeProperty.estimated_market_value) * 100).toFixed(2)}%`
                          : "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#0B0F19] rounded-xl border border-slate-800 text-xs space-y-1 text-slate-400">
                    <div>💡 <strong>Commercial Rental Yield:</strong> Typically 6% - 10% in Indian markets.</div>
                    <div>🏠 <strong>Residential Rental Yield:</strong> Typically 2.5% - 4.5%.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Rooms & Beds Matrix (PG/Hostel) */}
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
                            <Bed className="w-4 h-4" />
                            <div>
                              <span className="font-bold">{bed.bed_number}</span>
                              {bed.current_tenant_name ? (
                                <span className="text-slate-400 block text-[10px]">
                                  Occupied by: {bed.current_tenant_name}
                                </span>
                              ) : (
                                <span className="text-emerald-400 block text-[10px] font-bold">
                                  🟢 Vacant (Khali)
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold">₹{bed.monthly_rent}/mo</span>
                            {bed.status === "vacant" && (
                              <button
                                onClick={() => handleOpenUnifiedModal("tenant_only", room.sub_meter_last_reading, `${room.room_number} - ${bed.bed_number}`)}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold"
                              >
                                + Bithayein
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 5: Maintenance & Expenses */}
          {activeTab === "maintenance_expenses" && (
            <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden space-y-4">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white text-sm">Property Maintenance & Kharch Log</h3>
                  <p className="text-xs text-slate-400">मालिक vs किरायेदार द्वारा कराए गए खर्च एवं रेंट एडजस्टमेंट</p>
                </div>
                <button
                  onClick={() => setShowAddExpenseModal(true)}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Maintenance
                </button>
              </div>

              {activeExpenses.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-sm">Koi maintenance kharch darj nahi hai.</div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {activeExpenses.map((exp) => (
                    <div key={exp.id} className="p-4 flex items-center justify-between text-xs hover:bg-[#0B0F19]/50 transition">
                      <div className="space-y-1">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span className="capitalize">{exp.category.replace("_", " ")}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            exp.paid_by === "tenant" ? "bg-blue-500/20 text-blue-300" : "bg-purple-500/20 text-purple-300"
                          }`}>
                            Paid by: {exp.paid_by === "tenant" ? "Kirayedaar" : "Makan Malik"}
                          </span>
                          {exp.is_adjusted_in_rent && (
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] rounded font-bold">
                              Rent se Adjusted ✅
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400">{exp.note}</p>
                        <span className="text-[10px] text-slate-500">{exp.date}</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-black text-rose-400 text-sm">₹{exp.amount.toLocaleString("en-IN")}</span>
                        <button
                          onClick={() => deleteRentalExpense(activeProperty.id, exp.id)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: Agreement & Rules */}
          {activeTab === "agreement_rules" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
                  <FileCheck className="w-5 h-5" /> Property Rules & Agreement Clauses (नियम एवं शर्तें)
                </div>
                <p className="text-xs text-slate-400">
                  यह नियम और शर्तें किरायेदार के एग्रीमेंट और रेंट स्लिप में स्वतः शामिल की जाती हैं:
                </p>

                <div className="bg-[#0B0F19] p-4 rounded-xl border border-slate-800 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                  {activeProperty.default_rules || propDefaultRules}
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-400" /> Early Exit & Lock-in Policy:
                  </div>
                  <p className="text-slate-400">
                    यदि कोई किरायेदार न्यूनतम लॉक-इन अवधि से पहले मकान/दुकान खाली करता है या बिना 30 दिन के नोटिस के छोड़ता है, तो एग्रीमेंट नियमानुसार 1 महीने का किराया सिक्योरिटी डिपॉजिट से काट लिया जाएगा।
                  </p>
                </div>
              </div>

              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase tracking-wider">
                  <Scale className="w-5 h-5" /> Damage Recovery Policy (टूट-फूट व हर्जाना भरपाई)
                </div>
                <p className="text-xs text-slate-400">
                  समान में टूट-फूट होने पर सिक्योरिटी डिपॉजिट से कटौती का सिस्टम:
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
              </div>
            </div>
          )}

          {/* TAB 7: Submeter Calculator */}
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
                    value={meterPrevUnit === 0 ? "" : meterPrevUnit}
                    onChange={(e) => setMeterPrevUnit(e.target.value === "" ? 0 : Number(e.target.value))}
                    placeholder="0"
                    className="w-full mt-1.5 p-3 bg-[#0B0F19] border border-slate-800 rounded-xl text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">वर्तमान रीडिंग (Current Unit)</label>
                  <input
                    type="number"
                    value={meterCurrUnit === 0 ? "" : meterCurrUnit}
                    onChange={(e) => setMeterCurrUnit(e.target.value === "" ? 0 : Number(e.target.value))}
                    placeholder="0"
                    className="w-full mt-1.5 p-3 bg-[#0B0F19] border border-slate-800 rounded-xl text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">दर (Rate per Unit ₹)</label>
                  <input
                    type="number"
                    value={meterRate === 0 ? "" : meterRate}
                    onChange={(e) => setMeterRate(e.target.value === "" ? 0 : Number(e.target.value))}
                    placeholder="0"
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
      {/* MASTER UNIFIED MODAL: PROPERTY + TENANT ENTRY                             */}
      {/* ========================================================================= */}
      {showUnifiedModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 md:p-8 w-full max-w-3xl space-y-6 my-auto max-h-[92vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg md:text-xl font-black text-white">
                    {unifiedMode === "both"
                      ? "Nayi Property & Kirayedaar (Dono ek sath jodein)"
                      : unifiedMode === "tenant_only"
                      ? "Existing Property me Naya Kirayedaar Jodein"
                      : "Sirf Nayi Property / Dukan Register Karein"}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Puri property details, Family member ownership, Kirayedaar profile, Advance deposit aur Sub-meter reading ek sath save karein.
                </p>
              </div>
              <button
                onClick={() => setShowUnifiedModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-3 gap-2 bg-[#0B0F19] p-1.5 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setUnifiedMode("both")}
                className={`py-2 px-3 text-xs font-bold rounded-xl transition ${
                  unifiedMode === "both"
                    ? "bg-emerald-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🏠 + 👤 Property & Kirayedaar
              </button>
              <button
                type="button"
                onClick={() => setUnifiedMode("tenant_only")}
                className={`py-2 px-3 text-xs font-bold rounded-xl transition ${
                  unifiedMode === "tenant_only"
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                👤 Sirf Kirayedaar Jodein
              </button>
              <button
                type="button"
                onClick={() => setUnifiedMode("property_only")}
                className={`py-2 px-3 text-xs font-bold rounded-xl transition ${
                  unifiedMode === "property_only"
                    ? "bg-amber-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🏠 Sirf Nayi Property
              </button>
            </div>

            <form onSubmit={handleSaveUnifiedEntry} className="space-y-6">
              {/* PART 1: PROPERTY DETAILS (if mode is 'both' or 'property_only') */}
              {(unifiedMode === "both" || unifiedMode === "property_only") && (
                <div className="space-y-4 p-5 bg-[#0B0F19] rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Building className="w-4 h-4" /> 1. Property / Dukan / Makan Ki Jankari & Ownership
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-400">Property / Shop Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Main Market Dukan No. 4 ya Flat 302"
                        value={propTitle}
                        onChange={(e) => setPropTitle(e.target.value)}
                        className="w-full mt-1 p-2.5 bg-[#111827] border border-slate-800 rounded-xl text-white text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400">Property Type</label>
                      <select
                        value={propType}
                        onChange={(e) => setPropType(e.target.value as any)}
                        className="w-full mt-1 p-2.5 bg-[#111827] border border-slate-800 rounded-xl text-white text-xs font-bold"
                      >
                        <option value="commercial_shop">🏪 Commercial Shop / Dukan / Showroom</option>
                        <option value="residential_flat">🏠 Residential Flat / Apartment</option>
                        <option value="independent_house">🏡 Independent House / Makaan</option>
                        <option value="warehouse_godown">📦 Warehouse / Godown</option>
                        <option value="pg_hostel">🏢 PG & Hostel Model (Beds & Rooms)</option>
                      </select>
                    </div>
                  </div>

                  {/* Family Member Ownership & Property Size */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-purple-300">Property Malik (Family Member)</label>
                      <select
                        value={propOwnerMemberId}
                        onChange={(e) => setPropOwnerMemberId(e.target.value)}
                        className="w-full mt-1 p-2.5 bg-[#111827] border border-slate-800 rounded-xl text-white text-xs font-bold"
                      >
                        {members.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.relationship || m.role})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400">Property Size (क्षेत्रफल)</label>
                      <input
                        type="number"
                        placeholder="e.g. 450"
                        value={propSize === 0 ? "" : propSize}
                        onChange={(e) => setPropSize(e.target.value === "" ? 0 : Number(e.target.value))}
                        className="w-full mt-1 p-2.5 bg-[#111827] border border-slate-800 rounded-xl text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400">Size Unit</label>
                      <select
                        value={propSizeUnit}
                        onChange={(e) => setPropSizeUnit(e.target.value as any)}
                        className="w-full mt-1 p-2.5 bg-[#111827] border border-slate-800 rounded-xl text-white text-xs font-bold"
                      >
                        <option value="sqft">Sq. Ft (वर्ग फुट)</option>
                        <option value="sqyards">Sq. Yards (वर्ग गज)</option>
                        <option value="sqmeters">Sq. Meters</option>
                        <option value="bigha">Bigha (बीघा)</option>
                        <option value="dhur">Dhur / Kattha</option>
                      </select>
                    </div>
                  </div>

                  {/* Market Valuation for Wealth Sync */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl">
                    <div>
                      <label className="text-xs font-bold text-amber-300">Estimated Market Value (बाजार भाव ₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 3500000"
                        value={propMarketValue === 0 ? "" : propMarketValue}
                        onChange={(e) => setPropMarketValue(e.target.value === "" ? 0 : Number(e.target.value))}
                        className="w-full mt-1 p-2.5 bg-[#111827] border border-amber-500/40 rounded-xl text-amber-300 font-bold text-xs"
                      />
                      <span className="text-[10px] text-slate-400 block mt-0.5">Family Wealth / Net Worth me automatic judega</span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400">Purchase Cost (खरीद लागत ₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 2200000"
                        value={propPurchasePrice === 0 ? "" : propPurchasePrice}
                        onChange={(e) => setPropPurchasePrice(e.target.value === "" ? 0 : Number(e.target.value))}
                        className="w-full mt-1 p-2.5 bg-[#111827] border border-slate-800 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-400">Property Address & Area</label>
                      <input
                        type="text"
                        placeholder="e.g. Shop 4, Civil Lines Main Road"
                        value={propAddress}
                        onChange={(e) => setPropAddress(e.target.value)}
                        className="w-full mt-1 p-2.5 bg-[#111827] border border-slate-800 rounded-xl text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400">City / Shehar</label>
                      <input
                        type="text"
                        value={propCity}
                        onChange={(e) => setPropCity(e.target.value)}
                        className="w-full mt-1 p-2.5 bg-[#111827] border border-slate-800 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PART 1.5: Target Property Selector (if mode is 'tenant_only') */}
              {unifiedMode === "tenant_only" && rentalProperties.length > 0 && (
                <div className="p-4 bg-[#0B0F19] rounded-2xl border border-slate-800">
                  <label className="text-xs font-bold text-amber-300 block mb-1">
                    🏠 Kis Property / Dukan ke liye Kirayedaar jod rahe hain?
                  </label>
                  <select
                    value={targetPropertyId}
                    onChange={(e) => setTargetPropertyId(e.target.value)}
                    className="w-full p-2.5 bg-[#111827] border border-slate-800 rounded-xl text-white text-xs font-bold"
                  >
                    {rentalProperties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.property_type.replace("_", " ")}) — {p.address}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* PART 2: KIRAYEDAAR (TENANT) DETAILS (if mode is 'both' or 'tenant_only') */}
              {(unifiedMode === "both" || unifiedMode === "tenant_only") && (
                <>
                  {/* Personal Info & Contacts */}
                  <div className="space-y-4 p-5 bg-[#0B0F19] rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                      <Users className="w-4 h-4" /> 2. Kirayedaar Ki Details (व्यक्तिगत जानकारी)
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-400">Kirayedaar ka Poora Naam *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh Kumar Sharma"
                          value={tenantName}
                          onChange={(e) => setTenantName(e.target.value)}
                          className="w-full mt-1 p-2.5 bg-[#111827] border border-slate-800 rounded-xl text-white text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-400">Pita / Pati ka Naam (C/o)</label>
                        <input
                          type="text"
                          placeholder="e.g. Shri Suresh Kumar"
                          value={tenantFatherSpouse}
                          onChange={(e) => setTenantFatherSpouse(e.target.value)}
                          className="w-full mt-1 p-2.5 bg-[#111827] border border-slate-800 rounded-xl text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Phone with Auto +91 Badge */}
                      <div>
                        <label className="text-xs font-bold text-slate-400">Mobile No. (WhatsApp) *</label>
                        <div className="flex items-center mt-1 bg-[#111827] border border-slate-800 rounded-xl overflow-hidden focus-within:border-emerald-500">
                          <span className="px-3 py-2 bg-slate-800 text-slate-400 text-xs font-bold select-none border-r border-slate-700">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            placeholder="98765 43210"
                            value={tenantPhone}
                            onChange={(e) => setTenantPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                            className="w-full p-2 bg-transparent text-white text-xs font-bold outline-none"
                          />
                        </div>
                      </div>

                      {/* Alternate Phone */}
                      <div>
                        <label className="text-xs font-bold text-slate-400">Alternate / Ghar ka Phone</label>
                        <div className="flex items-center mt-1 bg-[#111827] border border-slate-800 rounded-xl overflow-hidden focus-within:border-emerald-500">
                          <span className="px-3 py-2 bg-slate-800 text-slate-400 text-xs font-bold select-none border-r border-slate-700">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            placeholder="98123 45678"
                            value={tenantAltPhone}
                            onChange={(e) => setTenantAltPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                            className="w-full p-2 bg-transparent text-white text-xs font-bold outline-none"
                          />
                        </div>
                      </div>

                      {/* Occupation */}
                      <div>
                        <label className="text-xs font-bold text-slate-400">Kaam / Vyavsay (Occupation)</label>
                        <input
                          type="text"
                          placeholder="e.g. Grocery Store Owner / Private Job"
                          value={tenantOccupation}
                          onChange={(e) => setTenantOccupation(e.target.value)}
                          className="w-full mt-1 p-2.5 bg-[#111827] border border-slate-800 rounded-xl text-white text-xs"
                        />
                      </div>
                    </div>

                    {/* Address Field: Specialized for Commercial vs Residential */}
                    <div>
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-400">
                          {propType === "commercial_shop" || propType === "warehouse_godown"
                            ? "Kirayedaar ka Sthayi / Grah Pata (Permanent Home / Native Village Address)"
                            : "Kirayedaar ka Sthayi Pata (Permanent / Previous Address)"}
                        </label>
                        <span className="text-[10px] text-amber-400">
                          {propType === "commercial_shop"
                            ? "⚠️ Dukan rent par dene par mool nivas pata jaruri hai (Police verification hetu)"
                            : "Optional"}
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Gram + Post - Rampur, Tehsil - Sadar, Dist - Meerut, UP"
                        value={tenantPermAddress}
                        onChange={(e) => setTenantPermAddress(e.target.value)}
                        className="w-full mt-1 p-2.5 bg-[#111827] border border-slate-800 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>

                  {/* ID Proofs (Aadhaar, PAN & Photos with Instant Preview) */}
                  <div className="space-y-4 p-5 bg-[#0B0F19] rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                      <CreditCard className="w-4 h-4" /> 3. Identity Verification & Dastavez (Aadhaar / PAN)
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Aadhaar Input + Photo Picker */}
                      <div className="p-3 bg-[#111827] rounded-xl border border-slate-800 space-y-2">
                        <label className="text-xs font-bold text-slate-300">🆔 Aadhaar Card Number (12 Digit)</label>
                        <input
                          type="text"
                          maxLength={14}
                          placeholder="e.g. 1234 5678 9012"
                          value={tenantAadhaar}
                          onChange={(e) => setTenantAadhaar(e.target.value)}
                          className="w-full p-2 bg-[#0B0F19] border border-slate-800 rounded-lg text-white font-mono text-xs"
                        />
                        <div className="flex items-center justify-between pt-1">
                          <label className="cursor-pointer text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5" /> Aadhaar Photo Upload
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, setTenantAadhaarUrl)}
                            />
                          </label>
                          {tenantAadhaarUrl && (
                            <button
                              type="button"
                              onClick={() => setShowDocPreview({ title: "Aadhaar Card Preview", url: tenantAadhaarUrl })}
                              className="text-[10px] text-emerald-400 font-bold flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> View Photo ✅
                            </button>
                          )}
                        </div>
                      </div>

                      {/* PAN Input + Photo Picker */}
                      <div className="p-3 bg-[#111827] rounded-xl border border-slate-800 space-y-2">
                        <label className="text-xs font-bold text-slate-300">💳 PAN Card Number (10 Digit Alphanumeric)</label>
                        <input
                          type="text"
                          maxLength={10}
                          placeholder="e.g. ABCDE1234F"
                          value={tenantPan}
                          onChange={(e) => setTenantPan(e.target.value.toUpperCase())}
                          className="w-full p-2 bg-[#0B0F19] border border-slate-800 rounded-lg text-white font-mono text-xs uppercase"
                        />
                        <div className="flex items-center justify-between pt-1">
                          <label className="cursor-pointer text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5" /> PAN Card Photo Upload
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, setTenantPanUrl)}
                            />
                          </label>
                          {tenantPanUrl && (
                            <button
                              type="button"
                              onClick={() => setShowDocPreview({ title: "PAN Card Preview", url: tenantPanUrl })}
                              className="text-[10px] text-emerald-400 font-bold flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> View Photo ✅
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Kirayedaar Photo / Avatar Upload */}
                    <div className="flex items-center justify-between p-3 bg-[#111827] rounded-xl border border-slate-800">
                      <div className="flex items-center gap-3">
                        {tenantPhotoUrl ? (
                          <img src={tenantPhotoUrl} alt="Tenant" className="w-10 h-10 rounded-xl object-cover border border-emerald-500" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 text-xs">
                            📷
                          </div>
                        )}
                        <div>
                          <span className="text-xs font-bold text-slate-300 block">Kirayedaar Passport / Self Photo</span>
                          <span className="text-[10px] text-slate-500">Rent slip & record me lagane hetu</span>
                        </div>
                      </div>
                      <label className="cursor-pointer px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition">
                        Select Photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, setTenantPhotoUrl)}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Rent, Advance & Sub-meter Initial Reading */}
                  <div className="space-y-4 p-5 bg-[#0B0F19] rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                      <BadgeIndianRupee className="w-4 h-4" /> 4. Rent, Advance (डिपॉजिट) & Move-in Meter Reading
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-400">Monthly Rent (मासिक किराया ₹) *</label>
                        <input
                          type="number"
                          required
                          placeholder="0"
                          value={tenantRent === 0 ? "" : tenantRent}
                          onChange={(e) => setTenantRent(e.target.value === "" ? 0 : Number(e.target.value))}
                          className="w-full mt-1 p-2.5 bg-[#111827] border border-slate-800 rounded-xl text-white font-black text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-amber-300">Advance Security Deposit (₹) *</label>
                        <input
                          type="number"
                          required
                          placeholder="0"
                          value={tenantDeposit === 0 ? "" : tenantDeposit}
                          onChange={(e) => setTenantDeposit(e.target.value === "" ? 0 : Number(e.target.value))}
                          className="w-full mt-1 p-2.5 bg-[#111827] border border-amber-500/40 rounded-xl text-amber-400 font-black text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-400">Advance Mode (किस माध्यम से मिला)</label>
                        <select
                          value={tenantDepositMode}
                          onChange={(e) => setTenantDepositMode(e.target.value as any)}
                          className="w-full mt-1 p-2.5 bg-[#111827] border border-slate-800 rounded-xl text-white text-xs font-bold"
                        >
                          <option value="upi">UPI / GPay / PhonePe</option>
                          <option value="cash">Cash (नकद)</option>
                          <option value="bank_transfer">Net Banking / IMPS</option>
                          <option value="cheque">Cheque (चेक)</option>
                        </select>
                      </div>
                    </div>

                    {/* Move-in Electricity Sub-Meter Reading */}
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                            <Zap className="w-4 h-4 text-amber-400" /> Move-in Electricity Sub-meter Reading (प्रारंभिक मीटर यूनिट)
                          </label>
                          <p className="text-[11px] text-slate-400">
                            Kirayedaar ke aate samay meter me jo reading chal rahi hai, use yahan note karein taaki exit ke samay clear hisab rahe.
                          </p>
                        </div>
                        <div className="w-full md:w-44">
                          <input
                            type="number"
                            placeholder="e.g. 1420"
                            value={tenantMoveInMeter === 0 ? "" : tenantMoveInMeter}
                            onChange={(e) => setTenantMoveInMeter(e.target.value === "" ? 0 : Number(e.target.value))}
                            className="w-full p-2 bg-[#111827] border border-amber-500/40 rounded-xl text-amber-300 font-black font-mono text-center text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Billing Cycle Dates */}
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">
                        Billing Cycle Dates (महीना कब से कब तक?)
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-400">Joining Date</label>
                          <input
                            type="date"
                            value={tenantJoiningDate}
                            onChange={(e) => setTenantJoiningDate(e.target.value)}
                            className="w-full mt-1 p-2 bg-[#111827] border border-slate-800 rounded-lg text-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-400">Cycle Start Day</label>
                          <input
                            type="number"
                            min="1"
                            max="31"
                            placeholder="5"
                            value={tenantCycleStartDay === 0 ? "" : tenantCycleStartDay}
                            onChange={(e) => setTenantCycleStartDay(e.target.value === "" ? 0 : Number(e.target.value))}
                            className="w-full mt-1 p-2 bg-[#111827] border border-slate-800 rounded-lg text-white text-xs"
                          />
                          <span className="text-[10px] text-slate-500">उदा. 5 तारीख</span>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-400">Cycle End Day</label>
                          <input
                            type="number"
                            min="1"
                            max="31"
                            placeholder="4"
                            value={tenantCycleEndDay === 0 ? "" : tenantCycleEndDay}
                            onChange={(e) => setTenantCycleEndDay(e.target.value === "" ? 0 : Number(e.target.value))}
                            className="w-full mt-1 p-2 bg-[#111827] border border-slate-800 rounded-lg text-white text-xs"
                          />
                          <span className="text-[10px] text-slate-500">उदा. 4 तारीख</span>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-400">Rent Due Date</label>
                          <input
                            type="number"
                            min="1"
                            max="31"
                            placeholder="5"
                            value={tenantDueDay === 0 ? "" : tenantDueDay}
                            onChange={(e) => setTenantDueDay(e.target.value === "" ? 0 : Number(e.target.value))}
                            className="w-full mt-1 p-2 bg-[#111827] border border-slate-800 rounded-lg text-white text-xs"
                          />
                          <span className="text-[10px] text-slate-500">उदा. 5 तारीख</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Agreement & Exit Rules */}
                  <div className="space-y-4 p-5 bg-[#0B0F19] rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                      <Scale className="w-4 h-4" /> 5. Agreement & Early Exit Niyam (नियम व शर्तें)
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-400">Agreement Duration (महीने)</label>
                        <input
                          type="number"
                          placeholder="11"
                          value={tenantAgreementMonths === 0 ? "" : tenantAgreementMonths}
                          onChange={(e) => setTenantAgreementMonths(e.target.value === "" ? 0 : Number(e.target.value))}
                          className="w-full mt-1 p-2 bg-[#111827] border border-slate-800 rounded-xl text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400">Lock-in Period (महीने)</label>
                        <input
                          type="number"
                          placeholder="6"
                          value={tenantLockInMonths === 0 ? "" : tenantLockInMonths}
                          onChange={(e) => setTenantLockInMonths(e.target.value === "" ? 0 : Number(e.target.value))}
                          className="w-full mt-1 p-2 bg-[#111827] border border-slate-800 rounded-xl text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400">Notice Period (दिन)</label>
                        <input
                          type="number"
                          placeholder="30"
                          value={tenantNoticeDays === 0 ? "" : tenantNoticeDays}
                          onChange={(e) => setTenantNoticeDays(e.target.value === "" ? 0 : Number(e.target.value))}
                          className="w-full mt-1 p-2 bg-[#111827] border border-slate-800 rounded-xl text-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400">Samay se pehle chhodne par deduction clause</label>
                      <input
                        type="text"
                        value={tenantEarlyExitPenalty}
                        onChange={(e) => setTenantEarlyExitPenalty(e.target.value)}
                        className="w-full mt-1 p-2.5 bg-[#111827] border border-slate-800 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUnifiedModal(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/30 active:scale-95 transition"
                >
                  {unifiedMode === "both"
                    ? "Save Property & Kirayedaar"
                    : unifiedMode === "tenant_only"
                    ? "Save Kirayedaar"
                    : "Save Property"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT PROPERTY & VALUATION MODAL                                   */}
      {/* ========================================================================= */}
      {showEditPropModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 md:p-8 w-full max-w-2xl space-y-5 my-auto max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-amber-400" />
                  Property Details & Wealth Valuation Edit Karein
                </h3>
                <p className="text-xs text-slate-400">{showEditPropModal.title} ki jankari update karein.</p>
              </div>
              <button onClick={() => setShowEditPropModal(null)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedProperty} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400">Property Title *</label>
                  <input
                    type="text"
                    required
                    value={propTitle}
                    onChange={(e) => setPropTitle(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400">Property Type</label>
                  <select
                    value={propType}
                    onChange={(e) => setPropType(e.target.value as any)}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs font-bold"
                  >
                    <option value="commercial_shop">🏪 Commercial Shop</option>
                    <option value="residential_flat">🏠 Residential Flat</option>
                    <option value="independent_house">🏡 Independent House</option>
                    <option value="warehouse_godown">📦 Warehouse / Godown</option>
                    <option value="pg_hostel">🏢 PG & Hostel Model</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-purple-300">Owner Member (Parivar Sadasya)</label>
                  <select
                    value={propOwnerMemberId}
                    onChange={(e) => setPropOwnerMemberId(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs font-bold"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.relationship || m.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400">Size (क्षेत्रफल)</label>
                  <input
                    type="number"
                    value={propSize === 0 ? "" : propSize}
                    onChange={(e) => setPropSize(e.target.value === "" ? 0 : Number(e.target.value))}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400">Unit</label>
                  <select
                    value={propSizeUnit}
                    onChange={(e) => setPropSizeUnit(e.target.value as any)}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs font-bold"
                  >
                    <option value="sqft">Sq. Ft</option>
                    <option value="sqyards">Sq. Yards (Gaj)</option>
                    <option value="sqmeters">Sq. Meters</option>
                    <option value="bigha">Bigha</option>
                    <option value="dhur">Dhur</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <div>
                  <label className="text-xs font-bold text-amber-300">Estimated Market Value (₹)</label>
                  <input
                    type="number"
                    value={propMarketValue === 0 ? "" : propMarketValue}
                    onChange={(e) => setPropMarketValue(e.target.value === "" ? 0 : Number(e.target.value))}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-amber-500/40 rounded-xl text-amber-300 font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400">Monthly Target Rent (₹)</label>
                  <input
                    type="number"
                    value={propTargetRent === 0 ? "" : propTargetRent}
                    onChange={(e) => setPropTargetRent(e.target.value === "" ? 0 : Number(e.target.value))}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white font-bold text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400">Address</label>
                  <input
                    type="text"
                    value={propAddress}
                    onChange={(e) => setPropAddress(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400">City</label>
                  <input
                    type="text"
                    value={propCity}
                    onChange={(e) => setPropCity(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditPropModal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow"
                >
                  Save Property Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: TENANT VACATE & SETTLEMENT MODAL (KHALI KARNA & HISAB)             */}
      {/* ========================================================================= */}
      {showVacateModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 md:p-8 w-full max-w-xl space-y-5 my-auto max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <LogOut className="w-5 h-5 text-rose-400" />
                <h3 className="text-base md:text-lg font-black text-white">Kirayedaar Exit & Final Settlement (खाली व हिसाब)</h3>
              </div>
              <button onClick={() => setShowVacateModal(null)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#0B0F19] rounded-2xl border border-slate-800 space-y-1 text-xs">
              <div className="text-slate-400">Kirayedaar: <strong className="text-white text-sm">{showVacateModal.tenant.name}</strong></div>
              <div className="text-slate-400">Unit / Shop: <strong className="text-amber-300">{showVacateModal.tenant.room_number || "Shop Unit"}</strong></div>
              <div className="text-slate-400">
                Aate samay Meter Reading: <strong className="text-amber-400 font-mono">{showVacateModal.tenant.move_in_meter_reading || 0} Units</strong>
              </div>
            </div>

            <form onSubmit={handleConfirmVacateAndSettle} className="space-y-4 text-xs">
              {/* Meter Settlement */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-3">
                <span className="font-bold text-amber-300 uppercase flex items-center gap-1.5 text-[11px]">
                  <Zap className="w-4 h-4 text-amber-400" /> 1. Electricity Sub-Meter Final Reading & Bill
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400">Final Meter Reading (वर्तमान यूनिट) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1380"
                      value={vacateFinalMeter === 0 ? "" : vacateFinalMeter}
                      onChange={(e) => setVacateFinalMeter(e.target.value === "" ? 0 : Number(e.target.value))}
                      className="w-full mt-1 p-2 bg-[#111827] border border-amber-500/40 rounded-xl text-amber-300 font-mono font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400">Rate per Unit (₹)</label>
                    <input
                      type="number"
                      value={vacateMeterRate === 0 ? "" : vacateMeterRate}
                      onChange={(e) => setVacateMeterRate(e.target.value === "" ? 0 : Number(e.target.value))}
                      className="w-full mt-1 p-2 bg-[#111827] border border-slate-800 rounded-xl text-white font-mono font-bold text-xs"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 flex justify-between pt-1">
                  <span>
                    Consumed: {Math.max(0, vacateFinalMeter - (showVacateModal.tenant.move_in_meter_reading || 0))} Units
                  </span>
                  <span className="font-bold text-amber-400">
                    Electricity Due: ₹{Math.max(0, vacateFinalMeter - (showVacateModal.tenant.move_in_meter_reading || 0)) * vacateMeterRate}
                  </span>
                </div>
              </div>

              {/* Damage Deduction & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400">Damage / Toot-phoot Katauti (₹)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={vacateDamageDeduction === 0 ? "" : vacateDamageDeduction}
                    onChange={(e) => setVacateDamageDeduction(e.target.value === "" ? 0 : Number(e.target.value))}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-rose-400 font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-400">Vacate / Move-out Date</label>
                  <input
                    type="date"
                    value={vacateDate}
                    onChange={(e) => setVacateDate(e.target.value)}
                    className="w-full mt-1 p-2 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              {/* Settlement Summary Box */}
              {(() => {
                const consumed = Math.max(0, vacateFinalMeter - (showVacateModal.tenant.move_in_meter_reading || 0));
                const elecBill = consumed * vacateMeterRate;
                const totalAdvance = showVacateModal.tenant.security_deposit || 0;
                const netRefund = Math.max(0, totalAdvance - elecBill - vacateDamageDeduction);

                return (
                  <div className="p-4 bg-[#0B0F19] rounded-2xl border border-slate-800 space-y-2">
                    <span className="font-bold text-slate-400 uppercase text-[10px]">Net Advance Refund Calculation</span>
                    <div className="space-y-1 text-slate-300">
                      <div className="flex justify-between">
                        <span>Total Advance Held:</span>
                        <strong className="text-white">₹{totalAdvance.toLocaleString("en-IN")}</strong>
                      </div>
                      <div className="flex justify-between text-rose-400">
                        <span>Less: Electricity Bill ({consumed} units):</span>
                        <strong>-₹{elecBill.toLocaleString("en-IN")}</strong>
                      </div>
                      {vacateDamageDeduction > 0 && (
                        <div className="flex justify-between text-rose-400">
                          <span>Less: Damage Recovery:</span>
                          <strong>-₹{vacateDamageDeduction.toLocaleString("en-IN")}</strong>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-black text-emerald-400">
                        <span>Kirayedaar ko Wapas (Net Refund):</span>
                        <span>₹{netRefund.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div>
                <label className="font-bold text-slate-400">Settlement Notes / Reason</label>
                <input
                  type="text"
                  placeholder="e.g. Completed 11 months, all dues cleared, keys handed over"
                  value={vacateNotes}
                  onChange={(e) => setVacateNotes(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowVacateModal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl shadow-lg shadow-rose-600/20"
                >
                  Confirm Exit & Vacate Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: EDIT TENANT MODAL                                                 */}
      {/* ========================================================================= */}
      {showEditTenantModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 md:p-8 w-full max-w-2xl space-y-5 my-auto max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-amber-400" />
                  Kirayedaar Profile & Agreement Edit Karein
                </h3>
                <p className="text-xs text-slate-400">{showEditTenantModal.name} ki details update karein.</p>
              </div>
              <button onClick={() => setShowEditTenantModal(null)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedTenant} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400">Kirayedaar ka Poora Naam *</label>
                  <input
                    type="text"
                    required
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400">Pita / Pati ka Naam</label>
                  <input
                    type="text"
                    value={tenantFatherSpouse}
                    onChange={(e) => setTenantFatherSpouse(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400">Mobile No. (WhatsApp)</label>
                  <div className="flex items-center mt-1 bg-[#0B0F19] border border-slate-800 rounded-xl overflow-hidden">
                    <span className="px-3 py-2 bg-slate-800 text-slate-400 text-xs font-bold select-none border-r border-slate-700">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={tenantPhone}
                      onChange={(e) => setTenantPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="w-full p-2 bg-transparent text-white text-xs font-bold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400">Aadhaar Card No.</label>
                  <input
                    type="text"
                    value={tenantAadhaar}
                    onChange={(e) => setTenantAadhaar(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400">PAN Card No.</label>
                  <input
                    type="text"
                    value={tenantPan}
                    onChange={(e) => setTenantPan(e.target.value.toUpperCase())}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white font-mono text-xs uppercase"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400">Move-in Sub-meter Reading (Units)</label>
                  <input
                    type="number"
                    value={tenantMoveInMeter === 0 ? "" : tenantMoveInMeter}
                    onChange={(e) => setTenantMoveInMeter(e.target.value === "" ? 0 : Number(e.target.value))}
                    placeholder="0"
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400">Permanent Home Address</label>
                <input
                  type="text"
                  value={tenantPermAddress}
                  onChange={(e) => setTenantPermAddress(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400">Monthly Rent (₹)</label>
                  <input
                    type="number"
                    value={tenantRent === 0 ? "" : tenantRent}
                    onChange={(e) => setTenantRent(e.target.value === "" ? 0 : Number(e.target.value))}
                    placeholder="0"
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400">Advance Deposit (₹)</label>
                  <input
                    type="number"
                    value={tenantDeposit === 0 ? "" : tenantDeposit}
                    onChange={(e) => setTenantDeposit(e.target.value === "" ? 0 : Number(e.target.value))}
                    placeholder="0"
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white font-bold text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditTenantModal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: BADA RENT SLIP / PRINTABLE INVOICE RECEIPT                      */}
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
                <button onClick={() => setShowRentSlipModal(null)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
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
                  {showRentSlipModal.tenant.pan_no && (
                    <div className="text-slate-400">PAN: <span className="font-mono text-slate-300">{showRentSlipModal.tenant.pan_no}</span></div>
                  )}
                  {showRentSlipModal.tenant.move_in_meter_reading !== undefined && (
                    <div className="text-amber-300">⚡ Check-in Sub-meter: <span className="font-mono font-bold">{showRentSlipModal.tenant.move_in_meter_reading} Units</span></div>
                  )}
                  {showRentSlipModal.tenant.permanent_address && (
                    <div className="text-slate-400">Address: {showRentSlipModal.tenant.permanent_address}</div>
                  )}
                </div>

                <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
                  <span className="text-[10px] font-bold text-blue-400 uppercase">🏠 Makan Malik (Owner Details)</span>
                  <div className="font-bold text-sm text-white">{showRentSlipModal.property.owner_member_name || showRentSlipModal.property.landlord_name || "Makan Malik"}</div>
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
                      {showRentSlipModal.property.owner_member_name || showRentSlipModal.property.landlord_name || "Makan Malik"}
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
      {/* MODAL 6: DOCUMENT / PHOTO PREVIEW MODAL                                    */}
      {/* ========================================================================= */}
      {showDocPreview && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 w-full max-w-lg space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h4 className="text-sm font-bold text-white">{showDocPreview.title}</h4>
              <button onClick={() => setShowDocPreview(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-center bg-black/40 rounded-xl overflow-hidden p-2">
              <img src={showDocPreview.url} alt={showDocPreview.title} className="max-h-[70vh] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: ADD EXPENSE & MAINTENANCE                                        */}
      {/* ========================================================================= */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-black text-white">Log Property Maintenance / Expense</h3>
            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400">Expense Category</label>
                  <select
                    value={newExpCat}
                    onChange={(e) => setNewExpCat(e.target.value as any)}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                  >
                    <option value="maintenance">🛠️ Maintenance & Minor Repairs</option>
                    <option value="damage_repair">💥 Damage / Structural Repair</option>
                    <option value="electricity_main">⚡ Main Electricity Bill</option>
                    <option value="water_supply">💧 Water Supply / Tanker</option>
                    <option value="maid_cleaning">🧹 Cleaning / Housekeeping</option>
                    <option value="property_tax">🏛️ Property Tax / Nagar Nigam</option>
                    <option value="other">📦 Other Misc Expense</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    value={newExpAmount === 0 ? "" : newExpAmount}
                    onChange={(e) => setNewExpAmount(e.target.value === "" ? 0 : Number(e.target.value))}
                    className="w-full mt-1 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              {/* Who Paid & Rent Adjustment */}
              <div className="space-y-2 p-3 bg-[#0B0F19] rounded-xl border border-slate-800">
                <label className="text-xs font-bold text-slate-300 block">Yeh kharch kisne karwaya? (Paid by)</label>
                <div className="flex gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="paidBy"
                      value="owner"
                      checked={newExpPaidBy === "owner"}
                      onChange={() => setNewExpPaidBy("owner")}
                    />
                    <span>मालिक (Owner)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="paidBy"
                      value="tenant"
                      checked={newExpPaidBy === "tenant"}
                      onChange={() => setNewExpPaidBy("tenant")}
                    />
                    <span>किरायेदार (Tenant)</span>
                  </label>
                </div>

                {newExpPaidBy === "tenant" && (
                  <div className="pt-2 space-y-2 border-t border-slate-800 mt-2">
                    <label className="text-xs font-bold text-slate-400 block">Kis Kirayedaar ne kharch kiya?</label>
                    <select
                      value={newExpTenantId}
                      onChange={(e) => setNewExpTenantId(e.target.value)}
                      className="w-full p-2 bg-[#111827] border border-slate-800 rounded-lg text-white text-xs"
                    >
                      <option value="">Select Tenant</option>
                      {activeTenants.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.room_number || "Unit"})
                        </option>
                      ))}
                    </select>

                    <label className="flex items-center gap-2 text-xs text-amber-300 pt-1 cursor-pointer">
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
      {/* MODAL 8: ADD ROOM (PG / HOSTEL)                                           */}
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
                    value={newRoomRentPerBed === 0 ? "" : newRoomRentPerBed}
                    onChange={(e) => setNewRoomRentPerBed(e.target.value === "" ? 0 : Number(e.target.value))}
                    placeholder="0"
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
