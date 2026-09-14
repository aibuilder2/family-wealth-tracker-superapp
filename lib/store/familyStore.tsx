'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Family, Member, Transaction, Asset, Goal, Reminder, DocumentItem,
  MedicalRecord, HouseholdStaff, CourtCase, CourtHearing, CreditCard, RecurringIncome,
  UtilityBill, CalendarEventItem, AgriculturalLand, CropCycle, AgricultureExpense,
  Vehicle, VehicleServiceLog, UdharContact, UdharSettlement, UdharSettlementMode, CommercialFleetVehicle, FleetTrip, FleetBusinessType, CommercialVehicleType, LawyerFeePayment, LawyerPaymentType, BusinessFirm, FirmDrawing, EntityType
} from '@/types';

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm-head',
    family_id: 'fam-1',
    name: 'Head of Family (Aap)',
    role: 'owner',
    color: '#B98B2A',
    initials: 'H',
    relationship: 'Head of Family',
    permissions: {
      can_view_investments: true,
      can_view_bills: true,
      can_view_vault: true,
      can_view_medical: true,
      can_view_staff: true,
      can_view_cases: true,
      is_admin: true,
    }
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [];
export const INITIAL_FIRMS: BusinessFirm[] = [];
export const INITIAL_FLEET: CommercialFleetVehicle[] = [];
export const INITIAL_AGRI_LANDS: AgriculturalLand[] = [];
export const INITIAL_VEHICLES: Vehicle[] = [];
export const INITIAL_UDHAR_CONTACTS: UdharContact[] = [];
export const INITIAL_CASES: CourtCase[] = [];
export const INITIAL_RECURRING_INCOME: RecurringIncome[] = [];
export const INITIAL_CREDIT_CARDS: CreditCard[] = [];
export const INITIAL_UTILITY_BILLS: UtilityBill[] = [];
export const INITIAL_ASSETS: Asset[] = [];
export const INITIAL_GOALS: Goal[] = [];
export const INITIAL_REMINDERS: Reminder[] = [];
export const INITIAL_STAFF: HouseholdStaff[] = [];
export const INITIAL_DOCUMENTS: DocumentItem[] = [];
export const INITIAL_MEDICAL: MedicalRecord[] = [];

interface FamilyContextType {
  family: Family;
  members: Member[];
  transactions: Transaction[];
  assets: Asset[];
  goals: Goal[];
  reminders: Reminder[];
  documents: DocumentItem[];
  medicalRecords: MedicalRecord[];
  staff: HouseholdStaff[];
  courtCases: CourtCase[];
  creditCards: CreditCard[];
  recurringIncomes: RecurringIncome[];
  utilityBills: UtilityBill[];
  agriculturalLands: AgriculturalLand[];
  vehicles: Vehicle[];

  udharContacts: UdharContact[];

  fleetVehicles: CommercialFleetVehicle[];

  businessFirms: BusinessFirm[];
  addBusinessFirm: (firm: Omit<BusinessFirm, 'id' | 'family_id' | 'total_revenue' | 'total_expenses' | 'total_gst_collected' | 'total_tds_deducted' | 'current_firm_balance' | 'total_drawings_paid' | 'drawings'>) => void;
  recordFirmDrawingToFamily: (firmId: string, drawing: { amount: number; drawing_type: 'partner_salary' | 'profit_dividend' | 'director_remuneration'; credited_to_member_id: string; note: string }) => void;

  addFleetVehicle: (vehicle: Omit<CommercialFleetVehicle, 'id' | 'family_id' | 'trips' | 'lifetime_revenue' | 'lifetime_expenses' | 'lifetime_net_profit' | 'total_acquisition_cost' | 'current_depreciated_value'>) => void;
  addFleetTrip: (vehicleId: string, trip: Omit<FleetTrip, 'id' | 'fleet_vehicle_id' | 'total_trip_expense' | 'net_trip_profit'>) => void;
  recordLawyerFeePayment: (caseId: string, payment: { amount: number; payment_type: LawyerPaymentType; note: string }) => void;

  addUdharContact: (udhar: Omit<UdharContact, 'id' | 'family_id' | 'settlements' | 'created_at'>) => void;
  recordUdharSettlement: (contactId: string, settlement: { amount: number; mode: UdharSettlementMode; note: string }) => void;

  activeMemberId: string | null;
  currentUserId: string;
  setCurrentUserId: (id: string) => void;
  setActiveMemberId: (id: string | null) => void;
  
  // Actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'family_id' | 'created_at'>) => void;
  deleteTransaction: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'family_id'>) => void;
  addReminder: (rem: Omit<Reminder, 'id' | 'family_id'>) => void;
  addAsset: (asset: Omit<Asset, 'id' | 'family_id'>) => void;
  addMember: (member: Omit<Member, 'id' | 'family_id'>) => void;
  updateMemberPermissions: (memberId: string, perms: Partial<Member['permissions']>) => void;
  markStaffAttendance: (staffId: string, day: number, status: 'present' | 'absent' | 'half_day' | 'leave') => void;
  addStaffPayment: (staffId: string, amount: number, type: 'salary' | 'advance' | 'bonus') => void;
  addCourtCase: (c: Omit<CourtCase, 'id' | 'family_id' | 'hearings'>) => void;
  addCourtHearing: (caseId: string, hearing: Omit<CourtHearing, 'id' | 'case_id'>) => void;
  toggleMedicalVerification: (id: string) => void;
  triggerEmergencySOS: () => { success: boolean; message: string };
  addAgriLand: (land: Omit<AgriculturalLand, 'id' | 'family_id'>) => void;
  addAgriExpense: (landId: string, expense: Omit<AgricultureExpense, 'id'>) => void;
  recordCropHarvest: (landId: string, harvestData: { yield_quintals: number; rate: number; bonus: number; addToIncome: boolean }) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'family_id'>) => void;
  addVehicleServiceLog: (vehicleId: string, log: Omit<VehicleServiceLog, 'id'>) => void;

  // Computed
  totalWealth: number;
  liquidWealth: number;
  fixedWealth: number;
  totalIncomeThisMonth: number;
  totalExpenseThisMonth: number;
  totalUdharGiven: number;
  totalUdharTaken: number;
  totalCreditCardDue: number;
  allCalendarEvents: CalendarEventItem[];
  currentUser: Member;
  isAdmin: boolean;

  // Quick Add Modal
  isQuickAddOpen: boolean;
  quickAddType: 'expense' | 'income' | 'udhar';
  openQuickAdd: (type?: 'expense' | 'income' | 'udhar') => void;
  closeQuickAdd: () => void;
}

const FamilyContext = createContext<FamilyContextType | null>(null);

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const [family, setFamily] = useState<Family>({
    id: 'fam-1',
    name: 'Mera Parivar',
    currency: 'INR',
    invite_code: 'SHARMA77',
  });

  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [currentUserId, setCurrentUserId] = useState<string>('m-head');
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);

  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(INITIAL_MEDICAL);
  const [staff, setStaff] = useState<HouseholdStaff[]>(INITIAL_STAFF);
  const [courtCases, setCourtCases] = useState<CourtCase[]>(INITIAL_CASES);
  const [creditCards, setCreditCards] = useState<CreditCard[]>(INITIAL_CREDIT_CARDS);
  const [recurringIncomes, setRecurringIncomes] = useState<RecurringIncome[]>(INITIAL_RECURRING_INCOME);
  const [utilityBills, setUtilityBills] = useState<UtilityBill[]>(INITIAL_UTILITY_BILLS);
  const [agriculturalLands, setAgriculturalLands] = useState<AgriculturalLand[]>(INITIAL_AGRI_LANDS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [udharContacts, setUdharContacts] = useState<UdharContact[]>(INITIAL_UDHAR_CONTACTS);
  const [fleetVehicles, setFleetVehicles] = useState<CommercialFleetVehicle[]>(INITIAL_FLEET);
  const [businessFirms, setBusinessFirms] = useState<BusinessFirm[]>(INITIAL_FIRMS);

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<'expense' | 'income' | 'udhar'>('expense');

  useEffect(() => {
    try {
      // Clear legacy mock cache on initial clean reset
      const isCleaned = localStorage.getItem('fwa_clean_v3');
      if (!isCleaned) {
        localStorage.removeItem('fwa_transactions_v2');
        localStorage.removeItem('fwa_staff');
        localStorage.removeItem('fwa_cases');
        localStorage.setItem('fwa_clean_v3', 'true');
      } else {
        const savedTx = localStorage.getItem('fwa_transactions_v2');
        if (savedTx) setTransactions(JSON.parse(savedTx));
        const savedStaff = localStorage.getItem('fwa_staff');
        if (savedStaff) setStaff(JSON.parse(savedStaff));
        const savedCases = localStorage.getItem('fwa_cases');
        if (savedCases) setCourtCases(JSON.parse(savedCases));
      }
    } catch (e) {}
  }, []);

  const saveTransactions = (newTx: Transaction[]) => {
    setTransactions(newTx);
    try { localStorage.setItem('fwa_transactions_v2', JSON.stringify(newTx)); } catch (e) {}
  };

  const addTransaction = (txData: Omit<Transaction, 'id' | 'family_id' | 'created_at'>) => {
    const newTx: Transaction = {
      ...txData,
      id: 'tx-' + Date.now(),
      family_id: family.id,
      time_stamp: txData.time_stamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      created_at: new Date().toISOString(),
    };
    saveTransactions([newTx, ...transactions]);
  };

  const deleteTransaction = (id: string) => {
    saveTransactions(transactions.filter(t => t.id !== id));
  };

  const addGoal = (g: Omit<Goal, 'id' | 'family_id'>) => {
    const newG: Goal = { ...g, id: 'g-' + Date.now(), family_id: family.id };
    setGoals([...goals, newG]);
  };

  const addReminder = (r: Omit<Reminder, 'id' | 'family_id'>) => {
    const newR: Reminder = { ...r, id: 'r-' + Date.now(), family_id: family.id };
    setReminders([...reminders, newR]);
  };

  const addAsset = (a: Omit<Asset, 'id' | 'family_id'>) => {
    const newA: Asset = { ...a, id: 'a-' + Date.now(), family_id: family.id };
    setAssets([...assets, newA]);
  };

  const addMember = (m: Omit<Member, 'id' | 'family_id'>) => {
    const newM: Member = { ...m, id: 'm-' + Date.now(), family_id: family.id };
    setMembers([...members, newM]);
  };

  const updateMemberPermissions = (memberId: string, perms: Partial<Member['permissions']>) => {
    setMembers(members.map(m => {
      if (m.id === memberId) {
        return { ...m, permissions: { ...m.permissions, ...perms } as any };
      }
      return m;
    }));
  };

  const markStaffAttendance = (staffId: string, day: number, status: 'present' | 'absent' | 'half_day' | 'leave') => {
    const updated = staff.map(st => {
      if (st.id === staffId) {
        const att = { ...(st.attendance_this_month || {}), [day]: status };
        return { ...st, attendance_this_month: att };
      }
      return st;
    });
    setStaff(updated);
    try { localStorage.setItem('fwa_staff', JSON.stringify(updated)); } catch (e) {}
  };

  const addStaffPayment = (staffId: string, amount: number, type: 'salary' | 'advance' | 'bonus') => {
    setStaff(staff.map(st => {
      if (st.id === staffId) {
        if (type === 'advance') {
          return { ...st, advance_balance: st.advance_balance + amount };
        }
        if (type === 'salary') {
          return { ...st, advance_balance: Math.max(0, st.advance_balance - 1000) };
        }
      }
      return st;
    }));

    addTransaction({
      member_id: currentUserId,
      type: 'expense',
      amount,
      category: 'Household Staff',
      category_type: 'main_ghar',
      mode: 'online',
      scope: 'ghar',
      note: 'Staff payment (' + type + ')',
      txn_date: new Date().toISOString().split('T')[0],
    });
  };

  const addCourtCase = (c: Omit<CourtCase, 'id' | 'family_id' | 'hearings'>) => {
    const newCase: CourtCase = {
      ...c,
      id: 'cs-' + Date.now(),
      family_id: family.id,
      hearings: []
    };
    const updated = [...courtCases, newCase];
    setCourtCases(updated);
    try { localStorage.setItem('fwa_cases', JSON.stringify(updated)); } catch (e) {}
  };

  const addCourtHearing = (caseId: string, h: Omit<CourtHearing, 'id' | 'case_id'>) => {
    setCourtCases(courtCases.map(cs => {
      if (cs.id === caseId) {
        const newH: CourtHearing = { ...h, id: 'h-' + Date.now(), case_id: caseId };
        return {
          ...cs,
          next_hearing_date: h.next_hearing_date || cs.next_hearing_date,
          hearings: [newH, ...cs.hearings]
        };
      }
      return cs;
    }));
  };

  const toggleMedicalVerification = (id: string) => {
    setMedicalRecords(medicalRecords.map(rec => {
      if (rec.id === id) {
        return { ...rec, is_verified: !rec.is_verified, verified_by: !rec.is_verified ? 'Doctor / Lab Report' : undefined };
      }
      return rec;
    }));
  };

  const triggerEmergencySOS = () => {
    const msg = '🚨 EMERGENCY SOS: ' + currentUser.name + ' ne emergency alert bheja hai! Current location & Medical info broadcast kar di gayi hai.';
    return { success: true, message: msg };
  };

  const addAgriLand = (land: Omit<AgriculturalLand, 'id' | 'family_id'>) => {
    const newLand: AgriculturalLand = {
      ...land,
      id: 'ag-' + Date.now(),
      family_id: family.id
    };
    setAgriculturalLands([...agriculturalLands, newLand]);
  };

  const addAgriExpense = (landId: string, expense: Omit<AgricultureExpense, 'id'>) => {
    setAgriculturalLands(agriculturalLands.map(l => {
      if (l.id === landId && l.active_cycle) {
        const newExp: AgricultureExpense = { ...expense, id: 'ae-' + Date.now() };
        const updatedExpenses = [...(l.active_cycle.expenses || []), newExp];
        const totalExp = updatedExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
        const net = (l.active_cycle.total_income || 0) - totalExp;
        return {
          ...l,
          active_cycle: {
            ...l.active_cycle,
            expenses: updatedExpenses,
            total_expense: totalExp,
            net_profit: net
          }
        };
      }
      return l;
    }));
  };

  const recordCropHarvest = (landId: string, harvestData: { yield_quintals: number; rate: number; bonus: number; addToIncome: boolean }) => {
    setAgriculturalLands(agriculturalLands.map(l => {
      if (l.id === landId && l.active_cycle) {
        const cropIncome = harvestData.yield_quintals * harvestData.rate;
        const totalInc = cropIncome + harvestData.bonus;
        const netProf = totalInc - (l.active_cycle.total_expense || 0);

        if (harvestData.addToIncome) {
          addTransaction({
            member_id: l.member_id || currentUserId,
            type: 'income',
            amount: totalInc,
            category: 'Agriculture',
            mode: 'online',
            scope: 'ghar',
            note: 'Fasal Bikri & Bonus (' + l.title + ' - ' + l.active_cycle.crop_name + ')',
            txn_date: new Date().toISOString().split('T')[0]
          });
        }

        return {
          ...l,
          active_cycle: {
            ...l.active_cycle,
            crop_yield_quintals: harvestData.yield_quintals,
            mandi_rate_per_quintal: harvestData.rate,
            crop_sale_income: cropIncome,
            govt_bonus_amount: harvestData.bonus,
            total_income: totalInc,
            net_profit: netProf,
            status: 'completed'
          }
        };
      }
      return l;
    }));
  };

  const addVehicle = (veh: Omit<Vehicle, 'id' | 'family_id'>) => {
    const newVeh: Vehicle = {
      ...veh,
      id: 'v-' + Date.now(),
      family_id: family.id
    };
    setVehicles([...vehicles, newVeh]);
  };

  const addVehicleServiceLog = (vehicleId: string, log: Omit<VehicleServiceLog, 'id'>) => {
    setVehicles(vehicles.map(v => {
      if (v.id === vehicleId) {
        const newLog: VehicleServiceLog = { ...log, id: 'sl-' + Date.now() };
        return {
          ...v,
          service_logs: [newLog, ...(v.service_logs || [])]
        };
      }
      return v;
    }));

    addTransaction({
      member_id: currentUserId,
      type: 'expense',
      amount: log.cost,
      category: 'Vehicle Maintenance',
      category_type: 'long_term',
      mode: 'online',
      scope: 'ghar',
      note: 'Vehicle Service (' + log.details + ')',
      txn_date: log.service_date || new Date().toISOString().split('T')[0]
    });
  };

  
  const addUdharContact = (uData: Omit<UdharContact, 'id' | 'family_id' | 'settlements' | 'created_at'>) => {
    const newContact: UdharContact = {
      ...uData,
      id: 'uc-' + Date.now(),
      family_id: family.id,
      remaining_balance: uData.original_amount,
      status: 'active',
      settlements: [],
      created_at: new Date().toISOString().split('T')[0]
    };

    setUdharContacts([newContact, ...udharContacts]);

    // Record initial transaction
    addTransaction({
      member_id: uData.member_id,
      type: uData.type === 'given' ? 'udhar_given' : 'udhar_taken',
      amount: uData.original_amount,
      category: 'Udhar',
      category_type: 'personal',
      mode: 'online',
      scope: 'bahar',
      note: (uData.type === 'given' ? 'Udhar diya — ' : 'Udhar liya — ') + uData.person_name,
      udhar_person: uData.person_name,
      txn_date: new Date().toISOString().split('T')[0]
    });
  };

  const recordUdharSettlement = (contactId: string, settlement: { amount: number; mode: UdharSettlementMode; note: string }) => {
    setUdharContacts(udharContacts.map(c => {
      if (c.id === contactId) {
        const newSettlement: UdharSettlement = {
          id: 'us-' + Date.now(),
          contact_id: contactId,
          date: new Date().toISOString().split('T')[0],
          amount: settlement.amount,
          settlement_mode: settlement.mode,
          note: settlement.note
        };

        const newBal = Math.max(0, c.remaining_balance - settlement.amount);
        const newStatus = newBal === 0 ? 'settled' : 'active';

        return {
          ...c,
          remaining_balance: newBal,
          status: newStatus,
          settlements: [newSettlement, ...c.settlements]
        };
      }
      return c;
    }));

    // Record adjustment in family transactions if cash/online
    if (settlement.mode === 'cash_online') {
      const contact = udharContacts.find(c => c.id === contactId);
      if (contact) {
        addTransaction({
          member_id: contact.member_id,
          type: contact.type === 'given' ? 'income' : 'expense',
          amount: settlement.amount,
          category: 'Udhar Wapsi',
          category_type: 'personal',
          mode: 'online',
          scope: 'bahar',
          note: 'Udhar settle/wapsi — ' + contact.person_name + ' (' + settlement.note + ')',
          udhar_person: contact.person_name,
          txn_date: new Date().toISOString().split('T')[0]
        });
      }
    }
  };

  
  
  const addBusinessFirm = (fData: Omit<BusinessFirm, 'id' | 'family_id' | 'total_revenue' | 'total_expenses' | 'total_gst_collected' | 'total_tds_deducted' | 'current_firm_balance' | 'total_drawings_paid' | 'drawings'>) => {
    const newFirm: BusinessFirm = {
      ...fData,
      id: 'firm-' + Date.now(),
      family_id: family.id,
      total_revenue: 0,
      total_expenses: 0,
      total_gst_collected: 0,
      total_tds_deducted: 0,
      current_firm_balance: 0,
      total_drawings_paid: 0,
      drawings: []
    };
    setBusinessFirms([...businessFirms, newFirm]);
  };

  const recordFirmDrawingToFamily = (firmId: string, drawing: { amount: number; drawing_type: 'partner_salary' | 'profit_dividend' | 'director_remuneration'; credited_to_member_id: string; note: string }) => {
    setBusinessFirms(businessFirms.map(f => {
      if (f.id === firmId) {
        const newD: FirmDrawing = {
          id: 'fd-' + Date.now(),
          firm_id: firmId,
          date: new Date().toISOString().split('T')[0],
          amount: drawing.amount,
          drawing_type: drawing.drawing_type,
          credited_to_member_id: drawing.credited_to_member_id,
          note: drawing.note
        };
        const updatedDrawings = [newD, ...f.drawings];
        const newDrawingsTotal = f.total_drawings_paid + drawing.amount;
        const newBalance = Math.max(0, f.current_firm_balance - drawing.amount);
        return {
          ...f,
          drawings: updatedDrawings,
          total_drawings_paid: newDrawingsTotal,
          current_firm_balance: newBalance
        };
      }
      return f;
    }));

    const firmObj = businessFirms.find(f => f.id === firmId);
    // Add to personal family income
    addTransaction({
      member_id: drawing.credited_to_member_id || currentUserId,
      type: 'income',
      amount: drawing.amount,
      category: 'Business Profit / Drawings',
      category_type: 'main_ghar',
      mode: 'online',
      scope: 'ghar',
      note: (firmObj?.firm_name || 'Firm') + ' se Profit / Salary Payout (' + drawing.note + ')',
      txn_date: new Date().toISOString().split('T')[0]
    });
  };

  const addFleetVehicle = (vData: Omit<CommercialFleetVehicle, 'id' | 'family_id' | 'trips' | 'lifetime_revenue' | 'lifetime_expenses' | 'lifetime_net_profit' | 'total_acquisition_cost' | 'current_depreciated_value'>) => {
    const totalAcq = Number(vData.purchase_cost || 0) + Number(vData.body_building_cost || 0);
    const newVeh: CommercialFleetVehicle = {
      ...vData,
      id: 'fl-' + Date.now(),
      family_id: family.id,
      total_acquisition_cost: totalAcq,
      current_depreciated_value: totalAcq,
      lifetime_revenue: 0,
      lifetime_expenses: 0,
      lifetime_net_profit: 0,
      trips: []
    };
    setFleetVehicles([newVeh, ...fleetVehicles]);
  };

  const addFleetTrip = (vehicleId: string, tData: Omit<FleetTrip, 'id' | 'fleet_vehicle_id' | 'total_trip_expense' | 'net_trip_profit'>) => {
    const totalExp = Number(tData.diesel_cost || 0) + Number(tData.toll_fastag_cost || 0) + Number(tData.driver_bhata || 0) + Number(tData.conductor_bhata || 0) + Number(tData.chalan_cost || 0) + Number(tData.other_repair_cost || 0);
    const netProf = Number(tData.gross_revenue || 0) - totalExp;

    setFleetVehicles(fleetVehicles.map(v => {
      if (v.id === vehicleId) {
        const newTrip: FleetTrip = {
          ...tData,
          id: 'ft-' + Date.now(),
          fleet_vehicle_id: vehicleId,
          total_trip_expense: totalExp,
          net_trip_profit: netProf
        };
        const updatedTrips = [newTrip, ...v.trips];
        const lifeRev = v.lifetime_revenue + tData.gross_revenue;
        const lifeExp = v.lifetime_expenses + totalExp;
        return {
          ...v,
          trips: updatedTrips,
          lifetime_revenue: lifeRev,
          lifetime_expenses: lifeExp,
          lifetime_net_profit: lifeRev - lifeExp
        };
      }
      return v;
    }));

    // Record net trip revenue in family transactions
    addTransaction({
      member_id: currentUserId,
      type: 'income',
      amount: tData.gross_revenue,
      category: 'Commercial Transport',
      category_type: 'main_ghar',
      mode: 'online',
      scope: 'ghar',
      note: 'Transport Business (' + tData.trip_title + ')',
      txn_date: tData.start_date || new Date().toISOString().split('T')[0]
    });
  };

  const recordLawyerFeePayment = (caseId: string, payment: { amount: number; payment_type: LawyerPaymentType; note: string }) => {
    setCourtCases(courtCases.map(cs => {
      if (cs.id === caseId) {
        const newPay: LawyerFeePayment = {
          id: 'lp-' + Date.now(),
          case_id: caseId,
          date: new Date().toISOString().split('T')[0],
          amount: payment.amount,
          payment_type: payment.payment_type,
          note: payment.note
        };
        const curPaid = Number((cs as any).lawyer_total_paid || 0) + payment.amount;
        const totalFee = Number((cs as any).lawyer_total_agreed_fee || 60000);
        return {
          ...cs,
          lawyer_total_paid: curPaid,
          lawyer_balance_due: Math.max(0, totalFee - curPaid),
          lawyer_payments: [newPay, ...((cs as any).lawyer_payments || [])]
        } as any;
      }
      return cs;
    }));

    // Auto add to family expense
    addTransaction({
      member_id: currentUserId,
      type: 'expense',
      amount: payment.amount,
      category: 'Court & Legal Fees',
      category_type: 'long_term',
      mode: 'online',
      scope: 'ghar',
      note: 'Lawyer Fee (' + payment.note + ')',
      txn_date: new Date().toISOString().split('T')[0]
    });
  };

  const openQuickAdd = (type: 'expense' | 'income' | 'udhar' = 'expense') => {
    setQuickAddType(type);
    setIsQuickAddOpen(true);
  };

  const closeQuickAdd = () => {
    setIsQuickAddOpen(false);
  };

  const currentUser = members.find(m => m.id === currentUserId) || members[0];
  const isAdmin = currentUser.role === 'owner' || currentUser.permissions?.is_admin === true;

  const liquidWealth = assets
    .filter(a => a.category === 'liquid')
    .reduce((sum, a) => sum + Number(a.value || 0), 0);

  const fixedWealth = assets
    .filter(a => a.category === 'fixed')
    .reduce((sum, a) => sum + Number(a.value || 0), 0);

  const totalWealth = liquidWealth + fixedWealth;

  const totalIncomeThisMonth = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpenseThisMonth = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalUdharGiven = transactions
    .filter(t => t.type === 'udhar_given')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalUdharTaken = transactions
    .filter(t => t.type === 'udhar_taken')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalCreditCardDue = creditCards.reduce((sum, cc) => sum + Number(cc.current_due || 0), 0);

  const allCalendarEvents: CalendarEventItem[] = [
    ...transactions.map(t => ({
      id: 'cal-tx-' + t.id,
      title: t.note || t.category,
      date: t.txn_date,
      time: t.time_stamp || '12:00 PM',
      type: (t.type === 'income' ? 'income' : 'expense') as any,
      amount: t.amount,
      color: t.type === 'income' ? '#4C7A5E' : '#C1502E',
      member_name: members.find(m => m.id === t.member_id)?.name,
      details: t.category + ' · ' + (t.mode || 'Online')
    })),
    ...reminders.map(r => ({
      id: 'cal-rem-' + r.id,
      title: r.title,
      date: r.due_date,
      type: 'reminder' as any,
      color: r.color || '#B98B2A',
      details: 'Reminder (' + r.category + ')'
    })),
    ...courtCases.map(cs => ({
      id: 'cal-case-' + cs.id,
      title: 'Hearing: ' + cs.case_title,
      date: cs.next_hearing_date,
      time: '10:30 AM',
      type: 'hearing' as any,
      color: '#8A5A6B',
      details: cs.court_name + ' (' + cs.case_number + ')'
    })),
    ...creditCards.map(cc => ({
      id: 'cal-cc-' + cc.id,
      title: 'Card Bill: ' + cc.bank_name + ' (' + cc.last4 + ')',
      date: cc.due_date,
      type: 'bill' as any,
      amount: cc.current_due,
      color: '#C1502E',
      details: 'Credit limit ₹' + cc.credit_limit.toLocaleString('en-IN')
    })),
    ...vehicles.filter(v => v.insurance_expiry).map(v => ({
      id: 'cal-v-ins-' + v.id,
      title: '🛡️ Car/Bike Insurance: ' + v.brand_model,
      date: v.insurance_expiry!,
      type: 'reminder' as any,
      color: '#C1502E',
      details: 'Plate: ' + v.reg_number
    })),
    ...members.filter(m => m.dob).map(m => ({
      id: 'cal-bday-' + m.id,
      title: '🎂 ' + m.name + ' ka Janamdin (Birthday)',
      date: new Date().getFullYear() + '-' + (m.dob ? m.dob.slice(5) : '01-01'),
      type: 'birthday' as any,
      color: '#B98B2A',
      details: 'Parivar member: ' + (m.relationship || m.name)
    }))
  ];

  return (
    <FamilyContext.Provider
      value={{
        family,
        members,
        transactions,
        assets,
        goals,
        reminders,
        documents,
        medicalRecords,
        staff,
        courtCases,
        creditCards,
        recurringIncomes,
        utilityBills,
        agriculturalLands,
        vehicles,
        activeMemberId,
        currentUserId,
        setCurrentUserId,
        setActiveMemberId,
        addTransaction,
        deleteTransaction,
        addGoal,
        addReminder,
        addAsset,
        addMember,
        updateMemberPermissions,
        markStaffAttendance,
        addStaffPayment,
        addCourtCase,
        addCourtHearing,
        toggleMedicalVerification,
        triggerEmergencySOS,
        addAgriLand,
        addAgriExpense,
        recordCropHarvest,
        addVehicle,
        addVehicleServiceLog,
        udharContacts,
        addUdharContact,
        recordUdharSettlement,
        fleetVehicles,
        addFleetVehicle,
        addFleetTrip,
        businessFirms,
        addBusinessFirm,
        recordFirmDrawingToFamily,
        recordLawyerFeePayment,
        totalWealth,
        liquidWealth,
        fixedWealth,
        totalIncomeThisMonth,
        totalExpenseThisMonth,
        totalUdharGiven,
        totalUdharTaken,
        totalCreditCardDue,
        allCalendarEvents,
        currentUser,
        isAdmin,
        isQuickAddOpen,
        quickAddType,
        openQuickAdd,
        closeQuickAdd,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamilyStore() {
  const ctx = useContext(FamilyContext);
  if (!ctx) {
    throw new Error('useFamilyStore must be used within a FamilyProvider');
  }
  return ctx;
}
