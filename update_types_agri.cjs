const fs = require('fs');

// 1. Append types to types/index.ts
let typesContent = fs.readFileSync('types/index.ts', 'utf8');

const agriAndVehicleTypes = `
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
`;

if (!typesContent.includes('AgriculturalLand')) {
  fs.writeFileSync('types/index.ts', typesContent.trim() + '\n' + agriAndVehicleTypes.trim() + '\n', 'utf8');
  console.log('Appended Agri and Vehicle types to types/index.ts');
}
