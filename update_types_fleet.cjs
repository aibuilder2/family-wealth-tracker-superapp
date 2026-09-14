const fs = require('fs');

let types = fs.readFileSync('types/index.ts', 'utf8');

const fleetAndCourtTypes = `
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
`;

if (!types.includes('CommercialFleetVehicle')) {
  fs.writeFileSync('types/index.ts', types.trim() + '\n' + fleetAndCourtTypes.trim() + '\n', 'utf8');
  console.log('Appended Fleet and Lawyer fee types to types/index.ts');
}
