export type MemberRole = 'owner' | 'member';

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
  relationship?: string;
  dob?: string;
  color: string;
  initials: string;
  avatar_url?: string;
  phone?: string;
  permissions?: {
    is_admin?: boolean;
    can_view_bills?: boolean;
    can_view_cases?: boolean;
    can_view_staff?: boolean;
    can_view_vault?: boolean;
    can_view_medical?: boolean;
    can_view_investments?: boolean;
  };
  profession_type?: 'business' | 'job' | 'professional' | 'student' | 'homemaker' | 'other';
  designation_or_business_name?: string;
  monthly_income?: number; // Salary or Business Income
  work_timings?: string; // e.g. "10:00 AM - 07:00 PM"
  workplace_address?: string; // Office / Shop address
}

export type TransactionType = 'income' | 'expense' | 'udhar_given' | 'udhar_taken';
export type PaymentMode = 'online' | 'offline';
export type ExpenseScope = 'ghar' | 'bahar';

export interface Transaction {
  id: string;
  family_id: string;
  member_id: string;
  member?: Member;
  type: TransactionType;
  amount: number;
  category: string;
  mode: PaymentMode;
  scope?: ExpenseScope;
  note: string;
  udhar_person?: string;
  is_settled?: boolean;
  txn_date: string;
  created_at?: string;
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
  value: number;
  notes?: string;
  color?: string;
  updated_at?: string;

  // Flexible Deposit / RD / Investment Fields
  start_date?: string; // कब से शुरू हुआ
  maturity_date?: string; // परिपक्वता तिथि
  opened_by?: 'direct_bank' | 'agent' | string; // डायरेक्ट बैंक से या एजेंट के ज़रिए
  agent_name?: string; // एजेंट का नाम
  agent_phone?: string; // एजेंट का संपर्क नंबर
  monthly_installment?: number; // मासिक आरडी/एसआईपी किश्त
  account_number?: string; // खाता या फोलियो संख्या
  linked_goal_id?: string; // किस लक्ष्य से जुड़ा है
  sip_or_rd_due_day?: number; // SIP / RD महीने की तारीख

  // Vehicle Details
  vehicle_image_url?: string; // गाड़ी की फ़ोटो (Optional Image)
  vehicle_number?: string; // गाड़ी का नंबर (e.g. MP 09 AB 1234)
  vehicle_model?: string; // मॉडल / वर्शन
}

export interface Goal {
  id: string;
  family_id: string;
  member_id?: string; // किस सदस्य का लक्ष्य है
  title: string;
  target_amount: number;
  saved_amount: number;
  target_date?: string;
  category?: string;
  
  // Goal Funding & Asset Linking
  funding_source?: 'income' | 'savings' | 'investment'; // किस स्रोत से पूरा होगा
  linked_asset_ids?: string[]; // जुड़े हुए एफडी, आरडी, एसआईपी या गोल्ड
  monthly_contribution?: number; // मासिक बचत लक्ष्य
  notes?: string;
}

export type ReminderCategory = 'insurance' | 'service' | 'appointment' | 'emi' | 'sip_rd' | 'other';

export interface Reminder {
  id: string;
  family_id: string;
  member_id?: string;
  member_name?: string;
  title: string;
  category: ReminderCategory;
  due_date: string;
  amount?: number;
  notify_1_month?: boolean;
  notify_1_week?: boolean;
  is_completed?: boolean;
  color?: string;
  linked_loan_id?: string;
  linked_asset_id?: string;
}

export type DocumentCategory = 'insurance' | 'vehicle' | 'property' | 'id_proof' | 'tax' | 'other';

export interface DocumentItem {
  id: string;
  family_id: string;
  member_id?: string;
  member_name?: string;
  folder_name?: string;
  title: string;
  category: DocumentCategory;
  file_url: string;
  file_type?: string;
  file_size?: string;
  expiry_date?: string;
  notes?: string;
  alert?: boolean;
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
  rent_due_day?: number;
  
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
  early_exit_penalty?: string;
  special_terms?: string;
  
  // Rent Increase / Escalation (Badhotri Schedule)
  rent_increase_type?: 'percentage' | 'fixed_amount';
  rent_increase_value?: number;
  rent_increase_frequency?: 'every_11_months' | 'annually' | 'every_2_years' | 'custom';
  next_rent_increase_date?: string;
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
  rent_status: 'paid' | 'pending' | 'overdue' | 'due';
  last_paid_date?: string;
  last_paid_amount?: number;
  last_payment_mode?: 'upi' | 'cash' | 'bank_transfer' | 'cheque';
  last_transaction_id?: string;
  notes?: string;
  created_at?: string;
}

export interface RentalExpense {
  id: string;
  property_id: string;
  category: 'warden_salary' | 'cook_salary' | 'maid_cleaning' | 'wifi_internet' | 'electricity_main' | 'water_supply' | 'maintenance' | 'property_tax' | 'damage_repair' | 'other';
  amount: number;
  date: string;
  note: string;
  paid_by?: 'owner' | 'tenant';
  is_adjusted_in_rent?: boolean;
  tenant_id?: string;
}

export interface RentalProperty {
  id: string;
  family_id: string;
  member_id?: string;
  owner_member_id?: string; // Family member who owns the property ("paper kiske name thi")
  owner_member_name?: string;
  title: string; // e.g. "Kesharwani Complex", "Shri Ram PG & Hostel"
  name?: string; // compatibility alias
  property_type: RentalPropertyType;
  type?: string; // compatibility alias
  address: string;
  city?: string;
  pincode?: string;
  gps_coordinates?: string;
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
  annual_appreciation_rate?: number;

  // Rent Increase / Escalation
  rent_increase_type?: 'percentage' | 'fixed_amount';
  rent_increase_value?: number;
  rent_increase_frequency?: 'every_11_months' | 'annually' | 'every_2_years' | 'custom';
  next_rent_increase_date?: string;
  rent_increase_terms?: string;

  // Ownership Lifecycle
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

  // Rent Diversion / Batwara
  rent_diversions?: RentDiversionRule[];

  total_units_or_rooms?: number;
  total_units?: number;
  total_floors?: number;
  total_capacity_beds?: number;
  total_beds?: number;
  has_hostel_model: boolean;
  rooms?: HostelRoom[];
  tenants: RentalTenant[];
  past_tenants?: RentalTenant[];
  expenses: RentalExpense[];
  monthly_target_revenue?: number;
  monthly_target_rent?: number;
  collected_rent?: number;
  pending_rent?: number;
  security_deposit_holding?: number;
  default_rules?: string;
  notes?: string;
  created_at?: string;
}

export interface RentDiversionRule {
  id: string;
  target_member_id: string;
  target_member_name: string;
  split_type: 'percentage' | 'fixed_amount';
  split_value: number;
  purpose: string;
  payment_mode?: 'bank_transfer' | 'cash' | 'upi';
  is_active?: boolean;
  notes?: string;
  allocation_target?: 'member_personal' | 'fd_rd_investment' | 'ghar_ration_expense' | 'staff_payment' | 'loan_emi';
  linked_asset_id?: string;
  linked_asset_name?: string;
  linked_staff_id?: string;
  linked_staff_name?: string;
  last_executed_date?: string;
  last_executed_amount?: number;
}

export interface StockPrediction {
  id: string;
  ticker: string;
  name: string;
  prediction_date: string;
  entry_price: number;
  target_price: number;
  stoploss_price: number;
  current_price: number;
  timeframe: string; // 'Short Term (7-15 Days)' | 'Medium Term (1-3 Months)'
  status: 'ACTIVE' | 'TARGET_HIT' | 'STOPLOSS_HIT' | 'EXPIRED';
  technicals: {
    rsi: number;
    macd_signal: string;
    pe_ratio: number;
    dma_200_status: 'Above 200 DMA' | 'Near 200 DMA Support' | 'Below 200 DMA';
    yearly_high_low?: string;
  };
  ai_reason: string;
  post_mortem?: string; // AI का विश्लेषण कि क्यों पास या फेल हुआ
  resolved_date?: string;
  pnl_percent?: number;
}

export type TravelTripType = 'job_official' | 'business_tour' | 'personal_family';
export type TravelClaimStatus = 'draft' | 'submitted' | 'reimbursed' | 'rejected';

export interface TravelExpenseItem {
  id: string;
  category: 'ticket_transport' | 'hotel_stay' | 'food_meal' | 'client_meeting' | 'fuel_petrol' | 'other';
  amount: number;
  description: string;
  expense_date: string;
  receipt_url?: string; // Image / receipt photo
}

export interface TravelClaim {
  id: string;
  family_id: string;
  member_id: string;
  member_name?: string;
  trip_title: string; // e.g. "Mandi Purchase Tour", "Client Meeting Raipur"
  trip_type: TravelTripType;
  destination: string; // e.g. "Raipur / Delhi"
  start_date: string;
  end_date: string;
  total_amount: number;
  status: TravelClaimStatus;
  reimbursed_amount?: number;
  reimbursement_date?: string;
  reimbursement_note?: string;
  receipt_images?: string[]; // Multiple receipt photos
  expenses: TravelExpenseItem[];
  created_at?: string;
}

// ==========================================
// VAULT SECRETS & .ENV LOCKER
// ==========================================
export type VaultSecretType = 'env_file' | 'password' | 'pin_secret';

export interface VaultSecretItem {
  id: string;
  family_id: string;
  member_id?: string;
  member_name?: string;
  secret_type: VaultSecretType;
  title: string; // Project Name or Account/Service Name
  environment?: 'production' | 'staging' | 'local' | 'other'; // For .env files
  env_content?: string; // Multi-line .env text
  username_or_email?: string; // For account / login
  password?: string; // Password / Secret
  url?: string; // Website / Project repo URL
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// ==========================================
// LOANS & LIABILITIES (कर्ज व ईएमआई)
// ==========================================
export type LoanType = 
  | 'home_loan' 
  | 'car_loan' 
  | 'business_loan' 
  | 'personal_loan' 
  | 'gold_loan' 
  | 'education_loan' 
  | 'other';

export interface LoanLiability {
  id: string;
  family_id: string;
  borrower_member_id: string; // kiske naam se loan hai
  borrower_member_name: string;
  loan_type: LoanType;
  title: string; // e.g. "SBI Home Loan", "HDFC Car Loan - Creta"
  lender_bank: string; // e.g. "State Bank of India", "HDFC Bank"
  account_number?: string; // Loan Account No.
  total_loan_amount: number; // कुल ऋण राशि
  outstanding_balance: number; // बाकी बकाया राशि
  monthly_emi_amount: number; // मासिक EMI किश्त ₹
  emi_due_day: number; // e.g. 5 (5th of every month)
  interest_rate?: number; // e.g. 8.5
  tenure_months?: number; // e.g. 60
  start_date?: string;
  end_date?: string;
  auto_reminder: boolean; // creates/syncs an EMI reminder
  notes?: string;
  created_at?: string;
}



