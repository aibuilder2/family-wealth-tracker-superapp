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
  joint_member_ids?: string[]; // Multiple family members (Joint Account / Co-holders)
  category: AssetCategory;
  type: AssetType;
  asset_subtype?: 'fd' | 'rd' | 'savings' | 'sip' | 'lumpsum' | 'other';
  label: string;
  institution?: string;
  symbol?: string; // for live shares (e.g. RELIANCE, TCS)
  quantity?: number;
  purchase_price?: number;
  interest_rate?: number; // e.g. 7.1% for FD/RD
  maturity_date?: string;
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
  total_drawings_paid?: number;
  drawings?: AgriDrawing[];
}

export interface AgriDrawing {
  id: string;
  land_id: string;
  date: string;
  amount: number;
  credited_to_member_id: string; // memberId or 'all_members'
  note: string;
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
  father_name?: string; // Optional: Pita ka naam
  address?: string; // Optional: Pata
  phone?: string;
  type: 'given' | 'taken'; // Maine diya (Receivable) vs Maine liya (Payable)
  payment_mode?: 'cash' | 'bank_transfer' | 'upi' | 'cheque'; // Bank se dala ya cash diya
  original_amount: number;
  remaining_balance: number;
  due_date?: string; // Kab wapas karega (Promised return date)
  promised_return_date?: string;
  otp_code?: string; // 6-digit verification code
  is_otp_verified?: boolean; // WhatsApp/OTP verified or not
  otp_verified_at?: string;
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
  total_drawings_paid?: number;
  drawings?: FleetDrawing[];
}

export interface FleetDrawing {
  id: string;
  vehicle_id: string;
  date: string;
  amount: number;
  credited_to_member_id: string; // memberId or 'all_members'
  note: string;
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
export type RentalPropertyType = 'residential_flat' | 'commercial_shop' | 'independent_house' | 'pg_hostel' | 'warehouse_godown' | 'vacant_plot';
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
  pan_no?: string;
  aadhaar_card_url?: string;
  pan_card_url?: string;
  photo_url?: string;
  permanent_address?: string;
  current_address?: string;
  native_or_permanent_address?: string;
  occupation?: string;
  is_commercial?: boolean;
  
  // Electricity sub-meter check-in reading
  move_in_meter_reading?: number;
  
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
  
  // Rent Increase / Escalation (Badhotri Schedule)
  rent_increase_type?: 'percentage' | 'fixed_amount'; // % ya Fixed ₹
  rent_increase_value?: number; // e.g. 10 (for 10%) ya 1000 (for ₹1,000)
  rent_increase_frequency?: 'every_11_months' | 'annually' | 'every_2_years' | 'custom';
  next_rent_increase_date?: string; // Agli badhotri ki tareekh (e.g. 2026-11-01)
  rent_increase_terms?: string;

  // Tenant lifecycle & exit settlement
  tenant_status?: 'active' | 'vacated' | 'replaced';
  vacate_date?: string;
  final_meter_reading?: number;
  final_electricity_charge?: number;
  final_damage_deduction?: number;
  final_advance_refunded?: number;
  settlement_summary?: string;

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
  owner_member_id?: string; // Family member who owns the property
  owner_member_name?: string;
  title: string; // e.g. "Shri Ram PG & Hostel (Civil Lines)", "Sector 14 2BHK Flat"
  property_type: RentalPropertyType;
  address: string;
  city: string;
  pincode?: string; // Postal PIN code (Optional)
  gps_coordinates?: string; // GPS Latitude, Longitude or Maps link (Optional)
  landlord_name?: string;
  landlord_phone?: string;
  landlord_pan?: string;
  landlord_upi?: string;

  // Wealth & Valuation
  property_size?: number;
  size_unit?: 'sqft' | 'sqyards' | 'sqmeters' | 'bigha' | 'dhur';
  estimated_market_value?: number; // Market valuation reflecting in Family Wealth / Net Worth
  purchase_price?: number;
  purchase_date?: string;
  registration_deed_no?: string;
  annual_appreciation_rate?: number; // Year-on-year appreciation rate % (e.g. 12% - 18%)

  // Rent Increase / Escalation (Badhotri Schedule)
  rent_increase_type?: 'percentage' | 'fixed_amount'; // % ya Fixed ₹
  rent_increase_value?: number; // e.g. 10 (for 10%) ya 1000 (for ₹1,000)
  rent_increase_frequency?: 'every_11_months' | 'annually' | 'every_2_years' | 'custom';
  next_rent_increase_date?: string; // Agli badhotri ki tareekh (e.g. 2026-11-01)
  rent_increase_terms?: string;

  // Ownership Lifecycle (Transfer to Family Member or Sold)
  ownership_status?: 'owned' | 'transferred' | 'sold';
  sold_details?: {
    sold_to_name?: string;
    sold_price?: number;
    sold_date?: string;
    capital_gain?: number;
    notes?: string;
  };
  transfer_details?: {
    transferred_to_member_id?: string;
    transferred_to_name?: string;
    transfer_date?: string;
    notes?: string;
  };

  // Rent Diversion / Batwara to other family members
  rent_diversions?: RentDiversionRule[];

  total_units_or_rooms: number;
  total_capacity_beds?: number;
  has_hostel_model: boolean;
  rooms?: HostelRoom[];
  tenants: RentalTenant[];
  past_tenants?: RentalTenant[];
  expenses: RentalExpense[];
  monthly_target_revenue: number;
  security_deposit_holding: number;
  default_rules?: string;
  notes?: string;
}

export interface RentDiversionRule {
  id: string;
  target_member_id: string;
  target_member_name: string;
  split_type: 'percentage' | 'fixed_amount';
  split_value: number; // e.g. 50 (%) or 10000 (₹)
  purpose: string; // e.g. "Ghar Kharcha / Ration", "Bachon ki Padhai", "Savings / SIP / FD / RD", "Loan EMI", "Staff Salary"
  payment_mode?: 'bank_transfer' | 'cash' | 'upi';
  is_active: boolean;
  notes?: string;

  // Direct Integration with FD/RD, Ration, and Staff
  allocation_target?: 'member_personal' | 'fd_rd_investment' | 'ghar_ration_expense' | 'staff_payment' | 'loan_emi';
  linked_asset_id?: string; // For linking to FD or RD in Wealth
  linked_asset_name?: string;
  linked_staff_id?: string; // For linking to household staff member
  linked_staff_name?: string;
  last_executed_date?: string; // e.g. "2026-09-17"
  last_executed_amount?: number;
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
}// ==========================================
// TRIP, HOLIDAY & VACATION SPLIT EXPENSE TYPES
// ==========================================
export type TripType = 'family_vacation' | 'friends_tour' | 'pilgrimage_yatra' | 'couple_solo' | 'business_trip';
export type TripExpenseType = 'group_split' | 'personal_individual' | 'advance_pool_deposit';
export type TripExpenseCategory = 'hotel_stay' | 'flight_train_bus' | 'taxi_fuel_toll' | 'food_restaurant' | 'sightseeing_entry' | 'shopping_personal' | 'activities_sports' | 'emergency_medical' | 'other';

export interface TripMember {
  id: string;
  name: string;
  phone?: string;
  is_family_member?: boolean;
}

export interface TripExpense {
  id: string;
  trip_id: string;
  title: string;
  amount: number;
  category: TripExpenseCategory;
  expense_type: TripExpenseType; // 'group_split' | 'personal_individual' | 'advance_pool_deposit'
  paid_by_member_id: string;
  paid_by_name: string;
  split_among_member_ids?: string[];
  date: string;
  notes?: string;
  bill_url?: string;
}

export interface TripPoolContribution {
  id: string;
  trip_id: string;
  member_id: string;
  member_name: string;
  amount: number;
  date: string;
  payment_mode?: 'upi' | 'cash' | 'bank_transfer';
  notes?: string;
}

export interface Trip {
  id: string;
  family_id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  trip_type: TripType;
  budget_target?: number;
  status: 'planned' | 'ongoing' | 'completed';
  members: TripMember[];
  pool_contributions: TripPoolContribution[];
  expenses: TripExpense[];
  notes?: string;
  created_at?: string;
}

// =========================================================================
// BUSINESS SETUP, PRE-OPERATIVE CAPEX & CAPITALIZATION TYPES
// =========================================================================
export type PreOpExpenseCategory =
  | 'legal_incorporation' // Company/LLP registration, Stamp duty, MOA/AOA, CA fees
  | 'licensing_gst_ip' // GST, MSME Udyam, Trade License, FSSAI, Trademark, Copyright
  | 'interior_furniture' // Furniture, civil works, electricals, shop/office fitouts, signboards
  | 'it_website_software' // Website, Mobile app, POS ERP software, Domain, Cloud server
  | 'machinery_equipment' // Plant & machinery, Tools, Hardware, ACs, Backup Inverter/DG
  | 'advance_rent_security' // Office/Shop advance deposit, Land lease advance
  | 'travelling_conveyance' // Site visits, vendor meetings, partner travel
  | 'marketing_prelaunch' // Branding, logo design, pre-launch promotions, hoarding
  | 'inventory_raw_material' // Initial stock, raw material trial runs
  | 'other_preoperative';

export type FundingSourceType =
  | 'self_savings' // Promoter / Family Savings
  | 'bank_term_loan' // Public/Commercial Bank Project Loan
  | 'private_bank_nbfc' // Private Bank / NBFC
  | 'friends_family_debt' // Dost / Rishtedaar Udhar
  | 'investor_seed_equity' // Outside Seed Partner / Investor
  | 'other_source';

export interface CollateralSecurity {
  is_pledged: boolean;
  asset_type?: 'real_estate_property' | 'fixed_deposit_lien' | 'gold_pledge' | 'machinery_hypothecation' | 'personal_guarantee' | 'other';
  title?: string; // e.g. "Civil Lines Commercial Plot Registry", "₹10L SBI FD Lien"
  estimated_valuation?: number;
  bank_charge_status?: 'registered_mortgage' | 'equitable_mortgage' | 'lien_marked' | 'hypothecated';
  safe_custody_notes?: string;
}

export interface DisbursalTranche {
  id: string;
  tranche_no: number;
  amount: number;
  disbursal_date: string;
  notes?: string;
}

export interface ProjectFundingSource {
  id: string;
  project_id: string;
  source_type: FundingSourceType;
  provider_name: string; // e.g. "State Bank of India", "Papa ki Savings", "HDFC Private Bank", "Ramesh Chacha"
  sanctioned_amount: number;
  disbursed_amount: number;
  interest_rate_annual: number; // 0 for zero-interest
  charge_interest: boolean;
  processing_fees: number;
  documentation_bank_charges: number;
  collateral: CollateralSecurity;
  tranches: DisbursalTranche[];
  notes?: string;
  created_at?: string;
}

export interface PreOpExpense {
  id: string;
  project_id: string;
  title: string;
  amount: number;
  category: PreOpExpenseCategory;
  date: string;
  funding_source_id?: string;
  funding_source_name?: string;
  vendor_name?: string;
  gst_amount?: number;
  invoice_no?: string;
  is_fixed_asset: boolean; // True if fixed asset, False if preliminary revenue expense (35D)
  notes?: string;
  bill_url?: string;
}

export interface ProjectRepayment {
  id: string;
  project_id: string;
  funding_source_id: string;
  funding_source_name: string;
  amount: number;
  repayment_date: string;
  payment_mode: 'bank' | 'upi' | 'cash';
  principal_portion: number;
  interest_portion: number;
  notes?: string;
}

export interface BusinessSetupProject {
  id: string;
  family_id: string;
  project_name: string;
  business_type: string; // e.g. "Retail Bakery & Cafe", "Transport Fleet Depot", "Textile Manufacturing"
  target_launch_date: string;
  actual_launch_date?: string;
  status: 'setup_in_progress' | 'capitalized_live' | 'closed';
  linked_firm_id?: string;
  funding_sources: ProjectFundingSource[];
  expenses: PreOpExpense[];
  repayments: ProjectRepayment[];
  capitalization_date?: string;
  capitalization_summary?: {
    total_project_cost: number;
    total_fixed_assets: number;
    total_preop_35d: number;
    total_accrued_interest: number;
    total_processing_fees: number;
    promoter_equity: number;
    bank_debt: number;
    private_debt: number;
    friends_family_debt: number;
    closing_notes?: string;
  };
  notes?: string;
  created_at?: string;
}

// =========================================================================
// CONSTRUCTION & THEKEDARI PROJECT MANAGEMENT TYPES
// =========================================================================
export type ConstructionStage =
  | 'planning_sanction' // Map approval, soil test, architect
  | 'foundation_plinth' // Excavation, footing, plinth beam
  | 'structure_lintel' // Columns, RCC slab casting, brickwork
  | 'plumbing_electrical' // Sanitary, pipe fitting, wiring
  | 'plaster_flooring' // Wall plaster, tiles, marble, granite
  | 'finishing_paint' // Putty, painting, wood work, glass
  | 'handover_ready';

export type MeasurementUnitBasis = 'sqft' | 'sqmtr' | 'rft' | 'lump_sum' | 'item_rate';

export type ContractorCategory =
  | 'civil_structure'
  | 'dhalai_slab_machine' // Dhalai machine & Lanter gang
  | 'shuttering'
  | 'chokhat_doors' // Chokhat & Door fixing
  | 'lintel_chajja'
  | 'plaster_masonry'
  | 'tiles_flooring'
  | 'electrician'
  | 'plumber'
  | 'painter'
  | 'other';

export type MaterialCategory =
  | 'cement'
  | 'sariya_steel'
  | 'sand_ret_balu'
  | 'aggregate_rodi_gitti'
  | 'bricks_eent_blocks'
  | 'tiles_marble'
  | 'plumbing_sanitary'
  | 'electrical_wiring'
  | 'wood_doors_windows'
  | 'paint_putty'
  | 'other_material';

export interface ConstructionMaterialLog {
  id: string;
  project_id: string;
  material_name: string;
  category: MaterialCategory;
  vendor_name: string;
  vendor_phone?: string;
  quantity: number;
  unit: string; // Bags, Tons, Sqft, Brass/Trolley, Pcs, SqMtr
  rate_per_unit: number;
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  invoice_no?: string;
  vehicle_no?: string; // Delivery truck plate
  date: string;
  notes?: string;
}

export interface ThekedarContract {
  id: string;
  project_id: string;
  contractor_name: string;
  contractor_category?: ContractorCategory;
  work_scope: string; // e.g. "RCC Labor Contract", "Third-Party Dhalai Machine & Labor", "Chokhat Fitting"
  phone: string;
  contract_type: 'sqft_rate' | 'item_rate' | 'lump_sum_theka';
  unit_basis?: MeasurementUnitBasis; // 'sqft' (sft), 'sqmtr' (smtr), 'rft', 'lump_sum'
  rate_per_unit?: number;
  total_units?: number; // Total sft or smtr
  rate_per_sqft?: number;
  total_sqft?: number;
  total_contract_value: number;
  total_paid: number;
  retention_amount?: number;
  is_third_party_dhalai?: boolean; // Dedicated third-party dhalai machine / subcontractor
  bills: Array<{
    id: string;
    ra_bill_no: string; // e.g. "RA Bill #1 - Plinth", "RA Bill #2 - Chokhat", "RA Bill #3 - Dhalai"
    stage_name: string; // e.g. "Roof Dhalai (Slab Casting - Badi Rakam)", "Chokhat Level", "Plinth Level", "Daily Wage Kharcha"
    bill_amount: number;
    date: string;
    is_paid: boolean;
    payment_mode?: string;
    notes?: string;
  }>;
  notes?: string;
}

export interface LaborHaziraRecord {
  id: string;
  project_id: string;
  date: string;
  mistri_count: number;
  mistri_rate: number;
  labor_count: number;
  labor_rate: number;
  total_daily_wage: number;
  paid_amount: number;
  khuraki_advance?: number;
  supervisor_name?: string;
  notes?: string;
}

export interface ConstructionProject {
  id: string;
  family_id: string;
  site_title: string; // e.g. "Sector 14 House Construction", "Commercial Plaza Ground Floor"
  site_location: string;
  plot_area_sqft?: number;
  builtup_area_sqft?: number;
  target_budget: number;
  current_stage: ConstructionStage;
  start_date: string;
  target_completion_date: string;
  status: 'ongoing' | 'completed' | 'on_hold';
  materials: ConstructionMaterialLog[];
  contractors: ThekedarContract[];
  daily_labor_logs: LaborHaziraRecord[];
  notes?: string;
  created_at?: string;
}

// ==========================================
// BANK LOAN & MULTI-MEMBER SPLIT TYPES
// ==========================================
export type BankLoanType = 
  | 'home_loan' 
  | 'car_loan' 
  | 'personal_loan' 
  | 'business_loan' 
  | 'education_loan' 
  | 'plot_loan' 
  | 'lap' 
  | 'other';

export interface LoanMemberSplit {
  member_id: string;
  member_name?: string;
  share_amount?: number; // Principal hissa (₹)
  share_percentage: number; // e.g. 60%
  monthly_emi_share: number; // e.g. ₹26,100
  is_verified?: boolean; // Optional: Verified via WhatsApp/OTP
  verified_at?: string;
  otp_code?: string;
  notes?: string;
}

export interface LoanInterestRevision {
  id: string;
  revision_date: string;
  old_rate: number;
  new_rate: number;
  old_emi: number;
  new_emi: number;
  reason?: string; // e.g. "RBI Repo Rate Hike 25 bps", "Bank MCLR reset"
  created_at?: string;
}

export interface BankLoan {
  id: string;
  family_id: string;
  loan_name: string; // e.g. "SBI Home Loan (Green Park)"
  bank_name: string; // e.g. "State Bank of India"
  account_no?: string; // Optional loan account / reference no
  loan_type: BankLoanType;
  
  // Principal & Disbursal (Flexible for both new and running old loans)
  original_principal?: number; // Sanctioned loan amount
  current_outstanding_principal: number; // Current remaining balance
  processing_fees?: number; // Optional
  insurance_charges?: number; // Optional
  other_charges?: number; // Optional
  is_charges_added_to_loan?: boolean;

  // Interest & EMI
  annual_interest_rate: number; // e.g. 8.5%
  tenure_months?: number; // Remaining or total months
  monthly_emi: number;
  emi_due_day?: number; // e.g. 5 (5th of month)
  start_date?: string; // Optional for old loans
  end_date?: string;
  
  // Multi-Member Split
  member_splits: LoanMemberSplit[];
  interest_revisions?: LoanInterestRevision[];
  
  status: 'active' | 'closed' | 'foreclosed';
  notes?: string;
  created_at: string;
}

// ==========================================
// HOSPITAL & ONGOING MEDICAL TREATMENT EPISODES
// ==========================================

export type MedicalExpenseCategory = 
  | 'doctor_consultation' // Multi-doctor OPD fees, specialist advice, second opinions
  | 'diagnostics_tests'   // Ultrasound, Sonography, Blood tests, MRI, CT Scan, Biopsy
  | 'pharmacy_medicines'  // Prescription medicines, injections, supplements
  | 'hospital_admission'  // Bed/room rent, ICU, OT charges, delivery package, surgeon fee
  | 'travel_ambulance'    // Taxi/Cab, Ambulance, Train/Flight tickets to other cities, Fuel
  | 'stay_food_attendant' // Hotel, Dharamshala, attendant meals, hospital canteen
  | 'physiotherapy_rehab' // Post-treatment therapy, home nursing
  | 'other';

export interface MedicalEpisodeDoctorVisit {
  id: string;
  doctor_name: string;        // e.g. "Dr. Sunita Agarwal"
  specialization: string;     // e.g. "Senior Gynecologist & Obstetrician", "Interventional Cardiologist"
  hospital_clinic: string;    // e.g. "Apollo Cradle, Delhi"
  city?: string;              // e.g. "New Delhi", "Local City"
  visit_date: string;
  consultation_fee?: number;
  prescription_notes?: string;
  next_followup_date?: string;
}

export interface MedicalEpisodeExpenseItem {
  id: string;
  date: string;
  category: MedicalExpenseCategory;
  title: string;              // e.g. "3rd Trimester Anomaly Scan", "AIIMS Travel Train + Cab"
  doctor_name?: string;
  hospital_or_vendor?: string;// e.g. "Dr. Lal PathLabs", "Apollo Pharmacy", "Ola Cab"
  city?: string;
  amount: number;             // Total Bill Amount (₹)
  payment_mode: 'cash' | 'online_upi' | 'card' | 'bank_transfer';
  paid_by_member_id: string;  // Which family member paid this bill
  is_insurance_claimable?: boolean;
  insurance_claimed_amount?: number;
  insurance_settled_amount?: number; // Reimbursed by TPA / Mediclaim
  bill_receipt_no?: string;
  notes?: string;
}

export interface MedicalTreatmentEpisode {
  id: string;
  family_id: string;
  member_id: string;          // Patient family member (e.g. Priya)
  patient_name?: string;
  title: string;              // e.g. "Priya — Pregnancy & Maternity Journey" or "Papa — Heart Angioplasty & Followups"
  treatment_type: 'pregnancy_delivery' | 'surgery_operation' | 'chronic_illness' | 'accidental_injury' | 'dental_ortho' | 'child_pediatric' | 'general_prolonged';
  start_date: string;
  end_date?: string;
  status: 'ongoing' | 'completed' | 'followup_pending';
  primary_hospital?: string;   // e.g. "Apollo Hospital"
  primary_doctor?: string;     // e.g. "Dr. Sunita Agarwal"
  city?: string;               // e.g. "Delhi NCR"
  has_health_insurance: boolean;
  insurance_provider?: string; // e.g. "Star Health", "HDFC ERGO", "Ayushman Bharat"
  policy_number?: string;
  notes?: string;

  // Embedded Sub-Collections:
  doctor_consultations: MedicalEpisodeDoctorVisit[];
  expense_items: MedicalEpisodeExpenseItem[];

  // Cumulative Totals
  total_expenses: number;
  total_insurance_reimbursed: number;
  net_out_of_pocket: number; // Jeb se kul kitna kharch hua
  created_at: string;
}



// ==========================================
// CLOUD KITCHEN, TIFFIN SERVICE & CATERING BOM TYPES
// ==========================================
export type KitchenBusinessType =
  | 'tiffin_service'
  | 'cloud_kitchen'
  | 'plate_thali'
  | 'nasta_snack'
  | 'event_catering';

export interface KitchenBOMIngredient {
  id: string;
  name: string; // e.g. "Wheat Atta", "Paneer", "Mustard Oil", "Packaging Dabba/Foil", "Gas"
  quantity: number; // e.g. 100, 1
  unit: 'gram' | 'kg' | 'ml' | 'litre' | 'piece' | 'portion';
  rate_per_unit: number; // e.g. ₹40 per kg, ₹350 per kg, ₹4 per packaging box
  cost: number; // computed per plate cost
}

export interface KitchenBOMRecipe {
  id: string;
  kitchen_id: string;
  recipe_name: string; // e.g. "Special Veg Thali (4 Roti + Dal Tadka + Paneer Sabji + Jeera Rice + Salad)"
  meal_type: 'thali_plate' | 'tiffin' | 'nasta_snack' | 'sweet_dessert' | 'beverage';
  ingredients: KitchenBOMIngredient[];
  total_cost_per_plate: number; // COGS (Laagat)
  selling_price_per_plate: number; // Vikray Mulya
  profit_per_plate: number; // Munafa
  margin_percentage: number; // Gross Margin %
  notes?: string;
}

export interface KitchenMenuItem {
  id: string;
  kitchen_id: string;
  item_name: string;
  category: 'thali' | 'sabji' | 'roti_bread' | 'rice' | 'nasta_snack' | 'dessert' | 'beverage';
  price: number;
  is_today_special?: boolean;
  is_available: boolean;
  description?: string;
}

export interface KitchenCustomerTiffin {
  id: string;
  kitchen_id: string;
  customer_name: string;
  phone: string;
  delivery_address: string;
  meal_plan: 'lunch_only' | 'dinner_only' | 'both_lunch_dinner';
  billing_cycle: 'monthly' | 'per_meal';
  monthly_rate: number;
  price_per_meal?: number;
  start_date: string;
  total_tiffins_delivered: number; // meal tally counter
  total_paid: number;
  pending_dues: number;
  status: 'active' | 'paused' | 'cancelled';
  notes?: string;
}

export interface KitchenDailyOrder {
  id: string;
  kitchen_id: string;
  order_number: string; // e.g. "ORD-101"
  date: string;
  time_slot: 'lunch' | 'dinner' | 'nasta' | 'party';
  customer_name: string;
  customer_phone?: string;
  delivery_address?: string;
  items_summary: string; // e.g. "2x Special Thali + 1x Gulab Jamun"
  plate_count: number;
  total_amount: number;
  payment_status: 'paid' | 'pending_cod' | 'khata';
  source?: 'whatsapp' | 'call_walkin' | 'tiffin_subscription' | 'other';
  notes?: string;
}

export interface KitchenExpenseItem {
  id: string;
  kitchen_id: string;
  date: string;
  category: 'mandi_sabji' | 'dairy_milk_paneer' | 'grocery_ration' | 'gas_cylinder' | 'packaging_material' | 'delivery_fuel' | 'staff_helper' | 'other';
  item_name: string;
  amount: number;
  vendor_name?: string;
  payment_mode: 'cash' | 'upi' | 'credit_khata';
  notes?: string;
}

export interface KitchenDrawing {
  id: string;
  kitchen_id: string;
  date: string;
  amount: number;
  credited_to_member_id: string; // memberId or 'all_members'
  note: string;
}

export interface KitchenBusinessProfile {
  id: string;
  family_id: string;
  kitchen_name: string;
  business_model: KitchenBusinessType;
  owner_member_id?: string;
  whatsapp_number: string;
  upi_id?: string;
  address_city: string;
  fssai_number?: string;
  recipes_bom: KitchenBOMRecipe[];
  menu_items: KitchenMenuItem[];
  tiffin_subscribers: KitchenCustomerTiffin[];
  daily_orders: KitchenDailyOrder[];
  expenses: KitchenExpenseItem[];
  drawings: KitchenDrawing[];
  lifetime_revenue: number;
  lifetime_expenses: number;
  lifetime_net_profit: number;
  total_drawings_paid: number;
  created_at?: string;
}
