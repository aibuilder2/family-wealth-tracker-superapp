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
}

export interface Goal {
  id: string;
  family_id: string;
  title: string;
  target_amount: number;
  saved_amount: number;
  target_date?: string;
  category?: string;
}

export type ReminderCategory = 'insurance' | 'service' | 'appointment' | 'emi' | 'other';

export interface Reminder {
  id: string;
  family_id: string;
  member_id?: string;
  title: string;
  category: ReminderCategory;
  due_date: string;
  amount?: number;
  notify_1_month?: boolean;
  notify_1_week?: boolean;
  is_completed?: boolean;
  color?: string;
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
