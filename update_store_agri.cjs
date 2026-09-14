const fs = require('fs');

let storeCode = fs.readFileSync('lib/store/familyStore.tsx', 'utf8');

// Add imports
storeCode = storeCode.replace(
  "UtilityBill, CalendarEventItem",
  "UtilityBill, CalendarEventItem, AgriculturalLand, CropCycle, AgricultureExpense, Vehicle, VehicleServiceLog"
);

// Add initial datasets before FamilyContextType
const initialAgriAndVehicles = `
export const INITIAL_AGRI_LANDS: AgriculturalLand[] = [
  {
    id: 'ag-1',
    family_id: 'fam-1',
    member_id: 'm-papa',
    title: 'Nahar Wala Khet (Khet No. 12)',
    location: 'Gram Rampur, Tehsil Sadar',
    area: 5,
    area_unit: 'Bigha',
    farming_type: 'khud',
    current_crop: 'Gehu (Wheat) + Sarson',
    active_cycle: {
      id: 'cc-1',
      land_id: 'ag-1',
      season: 'Rabi (Gehu/Sarson)',
      year: 2026,
      crop_name: 'Sharbati Gehu & Peeli Sarson',
      expenses: [
        { id: 'ae-1', category: 'beej', amount: 4500, date: '2026-05-10', note: 'Certified Wheat & Mustard seeds' },
        { id: 'ae-2', category: 'khaad', amount: 6200, date: '2026-05-25', note: 'DAP & Urea bags' },
        { id: 'ae-3', category: 'diesel_water', amount: 5400, date: '2026-06-15', note: 'Tube-well electricity & diesel engine' },
        { id: 'ae-4', category: 'labor', amount: 8000, date: '2026-07-02', note: 'Nirai & spraying labor' }
      ],
      total_expense: 24100,
      crop_yield_quintals: 45,
      mandi_rate_per_quintal: 2350,
      crop_sale_income: 105750,
      govt_bonus_amount: 5000,
      total_income: 110750,
      net_profit: 86650,
      status: 'active'
    }
  },
  {
    id: 'ag-2',
    family_id: 'fam-1',
    member_id: 'm-papa',
    title: 'Gaon Wala Bada Khet (Dakhili)',
    location: 'Gram Shivpur, Main Highway Road',
    area: 8,
    area_unit: 'Acre',
    farming_type: 'theka',
    partner_name: 'Mahender Yadav (Thekedaar)',
    partner_phone: '+91 98765 44332',
    yearly_theka_amount: 160000,
    current_crop: 'Dhaan (Basmati Rice)'
  }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'v-1',
    family_id: 'fam-1',
    member_id: 'm-papa',
    member_name: 'Papa',
    vehicle_type: 'car',
    brand_model: 'Hyundai Creta SX (O)',
    reg_number: 'DL 03 CA 4421',
    purchase_date: '2022-03-15',
    purchase_price: 1650000,
    fuel_type: 'Petrol',
    insurance_policy_no: 'HDFC-ERGO-99410',
    insurance_expiry: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0],
    puc_expiry: new Date(Date.now() + 65 * 86400000).toISOString().split('T')[0],
    service_due_date: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
    fastag_bank: 'ICICI FASTag',
    notes: 'Primary family car. Regular servicing at Authorized Hyundai Service Center.',
    service_logs: [
      { id: 'sl-1', service_date: '2026-03-10', odometer_km: 24500, cost: 7800, garage_name: 'Concept Hyundai, Okhla', details: 'Periodic 25,000 km service + Engine oil + Filter change' }
    ]
  },
  {
    id: 'v-2',
    family_id: 'fam-1',
    member_id: 'm-rohan',
    member_name: 'Rohan',
    vehicle_type: 'bike',
    brand_model: 'Royal Enfield Classic 350 (Dark Stealth)',
    reg_number: 'DL 08 BK 9021',
    purchase_date: '2023-08-10',
    purchase_price: 225000,
    fuel_type: 'Petrol',
    insurance_policy_no: 'ICICI-LOMBARD-8812',
    insurance_expiry: new Date(Date.now() + 140 * 86400000).toISOString().split('T')[0],
    puc_expiry: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    service_due_date: new Date(Date.now() + 80 * 86400000).toISOString().split('T')[0],
    notes: 'Rohan daily college bike.',
    service_logs: [
      { id: 'sl-2', service_date: '2026-02-15', odometer_km: 6200, cost: 2400, garage_name: 'Royal Enfield Service Center, Saket', details: 'General service & chain lube' }
    ]
  },
  {
    id: 'v-3',
    family_id: 'fam-1',
    member_id: 'm-mummy',
    member_name: 'Mummy',
    vehicle_type: 'scooter',
    brand_model: 'Honda Activa 6G Deluxe',
    reg_number: 'DL 04 AB 8812',
    purchase_date: '2021-10-20',
    purchase_price: 85000,
    fuel_type: 'Petrol',
    insurance_policy_no: 'ORIENTAL-INS-3321',
    insurance_expiry: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    notes: 'Local vegetable market & grocery scooty.'
  }
];
`;

storeCode = storeCode.replace("interface FamilyContextType {", initialAgriAndVehicles + "\ninterface FamilyContextType {");

// Add properties to FamilyContextType
const contextTypeAdditions = `
  agriculturalLands: AgriculturalLand[];
  vehicles: Vehicle[];
  addAgriLand: (land: Omit<AgriculturalLand, 'id' | 'family_id'>) => void;
  addAgriExpense: (landId: string, expense: Omit<AgricultureExpense, 'id'>) => void;
  recordCropHarvest: (landId: string, harvestData: { yield_quintals: number; rate: number; bonus: number; addToIncome: boolean }) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'family_id'>) => void;
  addVehicleServiceLog: (vehicleId: string, log: Omit<VehicleServiceLog, 'id'>) => void;
`;

storeCode = storeCode.replace("activeMemberId: string | null;", contextTypeAdditions + "\n  activeMemberId: string | null;");

// Add state hooks inside FamilyProvider
const providerStateAdditions = `
  const [agriculturalLands, setAgriculturalLands] = useState<AgriculturalLand[]>(INITIAL_AGRI_LANDS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
`;
storeCode = storeCode.replace("const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);", providerStateAdditions + "\n  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);");

// Add actions inside FamilyProvider
const providerActionAdditions = `
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
`;

storeCode = storeCode.replace("const openQuickAdd = (type: 'expense'", providerActionAdditions + "\n  const openQuickAdd = (type: 'expense'");

// Add values to FamilyContext.Provider
const providerValueAdditions = `
        agriculturalLands,
        vehicles,
        addAgriLand,
        addAgriExpense,
        recordCropHarvest,
        addVehicle,
        addVehicleServiceLog,
`;
storeCode = storeCode.replace("utilityBills,", "utilityBills," + providerValueAdditions);

fs.writeFileSync('lib/store/familyStore.tsx', storeCode, 'utf8');
console.log('Store updated with Agriculture and Vehicles data & actions.');
