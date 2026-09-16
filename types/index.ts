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

// ==========================================
// RENTAL PROPERTY, PG & HOSTEL TYPES
// ==========================================
export type RentalPropertyType = 'residential_flat' | 'commercial_shop' | 'independent_house' | 'pg_hostel' | 'warehouse_godown';
export type HostelBedStatus = 'vacant' | 'occupied' | 'under_maintenance';

export interface HostelBed {
  id: string;
  bed_number: string;
  room_number: string;
  monthly_rent: number;
  status: HostelBedStatus;
  current_tenant_id?: string;
  current_tenant_name?: string;
  food_included: boolean;
}

export interface HostelRoom {
  id: string;
  room_number: string;
  floor: string;
  sharing_type: 'single' | 'double' | 'triple' | 'four_sharing';
  total_beds: number;
  sub_meter_last_reading?: number;
  sub_meter_current_reading?: number;
  electricity_rate_per_unit?: number;
  beds: HostelBed[];
}

export interface RentalTenant {
  id: string;
  property_id: string;
  room_id?: string;
  room_number?: string;
  bed_id?: string;
  bed_number?: string;
  name: string;
  father_or_spouse_name?: string;
  phone: string;
  alternate_phone?: string;
  aadhaar_no?: string;
  permanent_address?: string;
  current_address?: string;
  occupation?: string;
  
  // Billing cycle & dates
  joining_date: string;
  cycle_start_day?: number; // e.g. 5 (5th of every month)
  cycle_end_day?: number; // e.g. 4 (4th of next month)
  rent_due_day: number;
  
  // Rent & Advance Deposit
  monthly_rent: number;
  security_deposit: number; // Advance amount
  advance_payment_date?: string;
  advance_payment_mode?: 'cash' | 'upi' | 'bank_transfer' | 'cheque';
  advance_status?: 'held' | 'partially_adjusted' | 'refunded';
  
  // Damage & Maintenance Adjustments
  damage_deduction_amount?: number;
  damage_notes?: string;
  maintenance_deduction_amount?: number;
  maintenance_deduction_notes?: string;

  // Agreement & Rules (Niyam & Sharte)
  agreement_duration_months?: number; // e.g. 11
  agreement_start_date?: string;
  agreement_end_date?: string;
  lock_in_period_months?: number; // e.g. 6
  notice_period_days?: number; // e.g. 30
  early_exit_penalty?: string; // e.g. "1 Month Rent deduction if leaving before lock-in"
  special_terms?: string; // Rules, damages liability, etc.
  
  food_included?: boolean;
  electricity_due?: number;
  rent_status: 'paid' | 'pending' | 'overdue';
  last_paid_date?: string;
  last_paid_amount?: number;
  last_payment_mode?: 'upi' | 'cash' | 'bank_transfer' | 'cheque';
  last_transaction_id?: string;
  notes?: string;
}

export interface RentalExpense {
  id: string;
  property_id: string;
  category: 'warden_salary' | 'cook_salary' | 'maid_cleaning' | 'wifi_internet' | 'electricity_main' | 'water_supply' | 'maintenance' | 'property_tax' | 'damage_repair' | 'other';
  amount: number;
  date: string;
  note: string;
  paid_by?: 'owner' | 'tenant'; // Kon karega / kisne karwaya (Owner or Tenant)
  is_adjusted_in_rent?: boolean; // Agar tenant ne karwaya to rent se minus hua ya nahi
  tenant_id?: string;
}

export interface RentalProperty {
  id: string;
  family_id: string;
  member_id?: string;
  title: string; // e.g. "Shri Ram PG & Hostel (Civil Lines)", "Sector 14 2BHK Flat"
  property_type: RentalPropertyType;
  address: string;
  city: string;
  landlord_name?: string;
  landlord_phone?: string;
  landlord_pan?: string;
  landlord_upi?: string;
  total_units_or_rooms: number;
  total_capacity_beds?: number;
  has_hostel_model: boolean;
  rooms?: HostelRoom[];
  tenants: RentalTenant[];
  expenses: RentalExpense[];
  monthly_target_revenue: number;
  security_deposit_holding: number;
  default_rules?: string;
  notes?: string;
}

export type MemberLedgerType = 'cash_transfer' | 'samaan_shopping' | 'work_payment' | 'settlement';

export interface MemberLedgerEntry {
  id: string;
  family_id: string;
  from_member_id: string; // Jisne paise diye / kharch kiye
  to_member_id: string; // Jiske liye kharch kiye / jisne paise liye
  type: MemberLedgerType;
  amount: number;
  title: string; // e.g. "Ghar ka Ration & Sabji", "Bike Petrol / Service", "Cash transfer"
  items_detail?: string; // e.g. "Atta 10kg, Mustard Oil 2L, Dawa"
  bill_url?: string;
  date: string;
  is_settled?: boolean;
  notes?: string;
  created_at?: string;
}

export type GoldPurityKarat = '24K' | '22K' | '18K' | '14K';
export type GoldLoanStatus = 'active' | 'settled' | 'overdue' | 'auction_notice';

export interface GoldLoanInterestPayment {
  id: string;
  amount: number;
  payment_date: string;
  mode: 'cash' | 'upi' | 'bank_transfer';
  notes?: string;
}

export interface GoldLoanPledge {
  id: string;
  family_id: string;
  pledge_no: string; // e.g. "GL-2026-001"
  customer_name: string;
  customer_phone: string;
  customer_aadhaar?: string;
  item_title: string; // e.g. "22K Gold Chain + 2 Rings"
  gross_weight_grams: number;
  stone_weight_grams: number;
  net_gold_weight_grams: number;
  purity_karat: GoldPurityKarat;
  market_gold_rate_per_gram: number;
  valuation_amount: number;
  loan_amount_given: number;
  ltv_percentage: number;
  interest_rate_monthly: number; // e.g. 2 for 2% per month (₹2 saikda)
  interest_type: 'simple' | 'monthly_compound';
  pledge_date: string;
  due_date?: string;
  status: GoldLoanStatus;
  safe_locker_tag: string; // e.g. "Safe Vault B - Tray 3 - Box 102"
  packet_barcode: string; // e.g. "SEC-GOLD-98421"
  customer_photo_url?: string;
  gold_photo_url?: string;
  interest_payments?: GoldLoanInterestPayment[];
  notes?: string;
  noc_otp_verified?: boolean;
  noc_date?: string;
  created_at?: string;
}


