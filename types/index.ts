export type MemberRole = 'owner' | 'member';

export interface MemberPermissions {
  can_view_investments: boolean;
  can_view_bills: boolean;
  can_view_vault: boolean;
  can_view_medical: boolean;
  can_view_staff: boolean;
  can_view_cases: boolean;
  is_admin: boolean;
}

export interface Family {
  id: string;
  name: string;
  currency: string;
  invite_code: string;
  created_at?: string;
}

export interface Member {
  id: string;
  family_id: string;
  user_id?: string;
  name: string;
  role: MemberRole;
  color: string;
  initials: string;
  avatar_url?: string;
  phone?: string;
  dob?: string;
  relationship?: string;
  anniversary?: string;
  permissions?: MemberPermissions;
}

export type TransactionType = 'income' | 'expense' | 'udhar_given' | 'udhar_taken';
export type PaymentMode = 'online' | 'offline';
export type ExpenseScope = 'ghar' | 'bahar';
export type ExpenseCategoryType = 'main_ghar' | 'personal' | 'child' | 'long_term' | 'trip' | 'event';

export interface Transaction {
  id: string;
  family_id: string;
  member_id: string;
  member?: Member;
  type: TransactionType;
  amount: number;
  category: string;
  category_type?: ExpenseCategoryType;
  mode: PaymentMode;
  scope?: ExpenseScope;
  note: string;
  time_stamp?: string; // e.g. "10:30 AM", "05:15 PM"
  udhar_person?: string;
  is_settled?: boolean;
  txn_date: string;
  created_at?: string;
}

export interface RecurringIncome {
  id: string;
  family_id: string;
  member_id: string;
  title: string;
  gross_amount: number;
  expected_day: number; // e.g. 5 (5th of every month)
  linked_liability_title?: string;
  linked_liability_amount?: number;
  net_amount: number;
  frequency: 'monthly' | 'quarterly' | 'yearly';
}

export interface CreditCard {
  id: string;
  family_id: string;
  member_id: string;
  bank_name: string;
  card_name: string;
  last4: string;
  credit_limit: number;
  current_due: number;
  due_date: string;
  late_penalty_history?: { date: string; amount: number; reason: string }[];
}

export interface UtilityBill {
  id: string;
  family_id: string;
  bill_type: 'electricity' | 'water' | 'gas' | 'internet' | 'mobile' | 'other';
  provider: string;
  consumer_no?: string;
  amount: number;
  due_date: string;
  is_paid: boolean;
}

export type AssetCategory = 'liquid' | 'fixed';
export type AssetType = 
  | 'bank_deposit' 
  | 'gold' 
  | 'silver' 
  | 'shares' 
  | 'mutual_funds' 
  | 'land' 
  | 'property' 
  | 'vehicle' 
  | 'other';

export interface Asset {
  id: string;
  family_id: string;
  member_id?: string;
  category: AssetCategory;
  type: AssetType;
  label: string;
  institution?: string;
  symbol?: string; // for live shares (e.g. RELIANCE, TCS)
  quantity?: number;
  purchase_price?: number;
  value: number;
  notes?: string;
  color?: string;
  updated_at?: string;
}

export interface Goal {
  id: string;
  family_id: string;
  title: string;
  target_amount: number;
  saved_amount: number;
  target_date?: string;
  category?: string;
  monthly_contribution?: number;
}

export type ReminderCategory = 'insurance' | 'service' | 'appointment' | 'emi' | 'bill' | 'hearing' | 'birthday' | 'other';

export interface Reminder {
  id: string;
  family_id: string;
  member_id?: string;
  title: string;
  category: ReminderCategory;
  due_date: string;
  time?: string;
  amount?: number;
  notify_1_month?: boolean;
  notify_1_week?: boolean;
  is_completed?: boolean;
  color?: string;
}

export interface HouseholdStaff {
  id: string;
  family_id: string;
  name: string;
  role: 'maid' | 'driver' | 'cook' | 'gardener' | 'guard' | 'other';
  monthly_salary: number;
  advance_balance: number;
  phone?: string;
  joining_date?: string;
  attendance_this_month?: { [day: number]: 'present' | 'absent' | 'half_day' | 'leave' };
}

export interface StaffPayment {
  id: string;
  staff_id: string;
  amount: number;
  type: 'salary' | 'advance' | 'bonus';
  date: string;
  note?: string;
}

export interface CourtHearing {
  id: string;
  case_id: string;
  hearing_date: string;
  result_notes: string;
  next_hearing_date?: string;
  documents_filed?: string[];
}

export interface CourtCase {
  id: string;
  family_id: string;
  case_title: string;
  case_number: string;
  court_name: string;
  judge_advocate_name?: string;
  current_status: string;
  next_hearing_date: string;
  summary: string;
  hearings: CourtHearing[];
  lawyer_total_agreed_fee?: number;
  lawyer_advance_paid?: number;
  lawyer_per_peshi_fee?: number;
  lawyer_total_paid?: number;
  lawyer_balance_due?: number;
  lawyer_payments?: LawyerFeePayment[];
}

export type DocumentCategory = 'insurance' | 'vehicle' | 'property' | 'id_proof' | 'tax' | 'other';

export interface DocumentItem {
  id: string;
  family_id: string;
  member_id?: string;
  title: string;
  category: DocumentCategory;
  file_url: string;
  file_type?: string;
  file_size?: string;
  expiry_date?: string;
  notes?: string;
  alert?: boolean;
  policy_number?: string;
  provider?: string;
  premium_amount?: number;
  nominee?: string;
  agent_contact?: string;
}

export interface FamilyTreeNode {
  id: string;
  family_id: string;
  member_id?: string;
  name: string;
  relation: string;
  photo_url?: string;
  parent_node_id?: string;
  generation: number;
  birth_year?: number;
}

export interface MedicalRecord {
  id: string;
  family_id: string;
  member_id: string;
  member_name?: string;
  blood_group: string;
  condition: string;
  medicine_name: string;
  medicine_time: string;
  allergies?: string;
  doctor_name?: string;
  doctor_phone?: string;
  notes?: string;
  is_verified: boolean;
  verified_by?: string;
  entered_by?: string;
}

export interface CalendarEventItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'expense' | 'income' | 'reminder' | 'hearing' | 'birthday' | 'bill' | 'emi';
  amount?: number;
  color?: string;
  member_name?: string;
  details?: string;
}
// ==========================================
// AGRICULTURE & LAND FARMING TYPES
// ==========================================
export type FarmingType = 'khud' | 'theka' | 'adhiya';

export interface AgricultureExpense {
  id: string;
  category: 'beej' | 'khaad' | 'pesticide' | 'diesel_water' | 'labor' | 'harvesting' | 'other';
  amount: number;
  date: string;
  note?: string;
}

export interface CropCycle {
  id: string;
  land_id: string;
  season: 'Rabi (Gehu/Sarson)' | 'Kharif (Dhaan/Makka)' | 'Zaid (Moong/Ganna)';
  year: number;
  crop_name: string;
  expenses: AgricultureExpense[];
  total_expense: number;
  crop_yield_quintals?: number;
  mandi_rate_per_quintal?: number;
  crop_sale_income?: number;
  govt_bonus_amount?: number;
  total_income: number;
  net_profit: number;
  status: 'active' | 'harvested' | 'completed';
}

export interface AgriculturalLand {
  id: string;
  family_id: string;
  member_id?: string;
  title: string;
  location: string;
  area: number;
  area_unit: 'Bigha' | 'Acre' | 'Killa' | 'Hectare';
  farming_type: FarmingType;
  partner_name?: string; // Thekedaar / Batai partner name
  partner_phone?: string;
  yearly_theka_amount?: number;
  current_crop?: string;
  active_cycle?: CropCycle;
  past_cycles?: CropCycle[];
}

// ==========================================
// VEHICLES (CAR / BIKE / TRACTOR) TYPES
// ==========================================
export type VehicleType = 'car' | 'bike' | 'scooter' | 'tractor' | 'other';

export interface VehicleServiceLog {
  id: string;
  service_date: string;
  odometer_km: number;
  cost: number;
  garage_name: string;
  details: string;
}

export interface Vehicle {
  id: string;
  family_id: string;
  member_id?: string;
  member_name?: string;
  vehicle_type: VehicleType;
  brand_model: string;
  reg_number: string; // e.g. "DL 01 AB 1234"
  purchase_date: string;
  purchase_price: number;
  fuel_type: 'Petrol' | 'Diesel' | 'CNG' | 'EV' | 'Hybrid';
  rc_expiry?: string;
  insurance_policy_no?: string;
  insurance_expiry?: string;
  puc_expiry?: string;
  service_due_date?: string;
  fastag_bank?: string;
  notes?: string;
  service_logs?: VehicleServiceLog[];
}
// ==========================================
// ADVANCED UDHAR & SETTLEMENT TYPES
// ==========================================
export type UdharSettlementMode = 'cash_online' | 'samaan_goods' | 'kaam_service';

export interface UdharSettlement {
  id: string;
  contact_id: string;
  date: string;
  amount: number;
  settlement_mode: UdharSettlementMode;
  note: string; // e.g. "Cash diya", "1 bora gehu dekar adjust kiya", "Tractor chalakar kaam kiya"
}

export interface UdharContact {
  id: string;
  family_id: string;
  member_id: string; // which family member is involved
  person_name: string; // External person or relative name
  phone?: string;
  type: 'given' | 'taken'; // Maine diya (Receivable) vs Maine liya (Payable)
  original_amount: number;
  remaining_balance: number;
  due_date?: string;
  notes?: string;
  settlements: UdharSettlement[];
  status: 'active' | 'settled';
  created_at: string;
}
// ==========================================
// COMMERCIAL FLEET & TRANSPORT BUSINESS TYPES
// ==========================================
export type FleetBusinessType = 'mining_per_trip' | 'school_monthly' | 'route_daily' | 'outstation_rental' | 'goods_contract';
export type CommercialVehicleType = 'truck_mining' | 'school_bus' | 'route_bus' | 'tourist_cab' | 'goods_carrier' | 'other';

export interface FleetTrip {
  id: string;
  fleet_vehicle_id: string;
  trip_type: FleetBusinessType;
  trip_title: string;
  start_date: string;
  end_date?: string;
  assigned_driver: string;
  driver_phone?: string;
  assigned_conductor?: string;
  customer_party_name: string;
  customer_phone?: string;
  billing_mode: 'per_trip' | 'per_ton' | 'per_km' | 'monthly_fixed' | 'daily_fixed';
  rate: number;
  quantity?: number; // e.g. 15 trips or 250 km or 30 tons
  gross_revenue: number;
  advance_received: number;
  pending_payment: number;
  diesel_liters: number;
  diesel_cost: number;
  toll_fastag_cost: number;
  driver_bhata: number;
  conductor_bhata?: number;
  chalan_cost?: number;
  other_repair_cost?: number;
  total_trip_expense: number;
  net_trip_profit: number;
  status: 'running' | 'completed' | 'cancelled';
}

export interface CommercialFleetVehicle {
  id: string;
  family_id: string;
  vehicle_type: CommercialVehicleType;
  title_model: string; // e.g. "Tata Signa 2823.K Tipper (Mining Truck)"
  reg_number: string; // e.g. "UP 32 BK 5521"
  business_model: FleetBusinessType;
  purchase_date: string;
  purchase_cost: number;
  body_building_cost: number;
  total_acquisition_cost: number;
  has_loan: boolean;
  monthly_emi: number;
  loan_tenure_months?: number;
  loan_balance: number;
  financier_name?: string;
  annual_depreciation_percent: number; // e.g. 15%
  current_depreciated_value: number;
  resale_date?: string;
  resale_amount?: number;
  status: 'active' | 'under_maintenance' | 'sold';
  default_driver_name: string;
  default_driver_phone?: string;
  default_conductor_name?: string;
  odometer_km: number;
  permit_expiry?: string;
  fitness_expiry?: string;
  national_tax_expiry?: string;
  trips: FleetTrip[];
  lifetime_revenue: number;
  lifetime_expenses: number;
  lifetime_net_profit: number;
}

// ==========================================
// COURT LAWYER FEE PAYMENT TYPES
// ==========================================
export type LawyerPaymentType = 'advance_filing' | 'peshi_fee' | 'munshi_fee' | 'misc_court_fee';

export interface LawyerFeePayment {
  id: string;
  case_id: string;
  date: string;
  amount: number;
  payment_type: LawyerPaymentType;
  note: string;
}
// ==========================================
// REGISTERED BUSINESS FIRM & GST TYPES
// ==========================================
export type EntityType = 'Proprietorship' | 'Partnership_Firm' | 'Pvt_Ltd' | 'LLP' | 'Individual_Unregistered';

export interface FirmDrawing {
  id: string;
  firm_id: string;
  date: string;
  amount: number;
  drawing_type: 'partner_salary' | 'profit_dividend' | 'director_remuneration';
  credited_to_member_id: string;
  note: string;
}

export interface BusinessFirm {
  id: string;
  family_id: string;
  firm_name: string; // e.g. "Sharma Roadways & Logistics"
  entity_type: EntityType;
  gstin?: string; // e.g. "07AAAAA0000A1Z5"
  pan?: string;
  bank_current_acc: string;
  total_revenue: number;
  total_expenses: number;
  total_gst_collected: number;
  total_tds_deducted: number;
  current_firm_balance: number;
  total_drawings_paid: number;
  drawings: FirmDrawing[];
}
