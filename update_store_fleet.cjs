const fs = require('fs');

let storeCode = fs.readFileSync('lib/store/familyStore.tsx', 'utf8');

// Update imports
storeCode = storeCode.replace(
  "UdharSettlement, UdharSettlementMode",
  "UdharSettlement, UdharSettlementMode, CommercialFleetVehicle, FleetTrip, FleetBusinessType, CommercialVehicleType, LawyerFeePayment, LawyerPaymentType"
);

// Add initial fleet and updated court cases
const fleetAndCourtStoreData = `
export const INITIAL_FLEET: CommercialFleetVehicle[] = [
  {
    id: 'fl-1',
    family_id: 'fam-1',
    vehicle_type: 'truck_mining',
    title_model: 'Tata Signa 2823.K Tipper (Mining Dumper)',
    reg_number: 'UP 32 BK 5521',
    business_model: 'mining_per_trip',
    purchase_date: '2023-04-10',
    purchase_cost: 3800000,
    body_building_cost: 250000,
    total_acquisition_cost: 4050000,
    has_loan: true,
    monthly_emi: 68500,
    loan_tenure_months: 48,
    loan_balance: 1850000,
    financier_name: 'HDFC Commercial Vehicle Finance',
    annual_depreciation_percent: 15,
    current_depreciated_value: 2926000,
    status: 'active',
    default_driver_name: 'Baljeet Singh (Driver)',
    default_driver_phone: '+91 98765 88990',
    odometer_km: 74200,
    permit_expiry: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
    fitness_expiry: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    national_tax_expiry: new Date(Date.now() + 210 * 86400000).toISOString().split('T')[0],
    lifetime_revenue: 2840000,
    lifetime_expenses: 1620000,
    lifetime_net_profit: 1220000,
    trips: [
      {
        id: 'ft-1',
        fleet_vehicle_id: 'fl-1',
        trip_type: 'mining_per_trip',
        trip_title: 'Mines Stone Crusher to Highway Site - 10 Runs',
        start_date: new Date().toISOString().split('T')[0],
        assigned_driver: 'Baljeet Singh',
        customer_party_name: 'Singhal Builders & Infra Ltd',
        customer_phone: '+91 98112 00998',
        billing_mode: 'per_trip',
        rate: 4500,
        quantity: 10,
        gross_revenue: 45000,
        advance_received: 15000,
        pending_payment: 30000,
        diesel_liters: 120,
        diesel_cost: 10800,
        toll_fastag_cost: 2400,
        driver_bhata: 2000,
        chalan_cost: 0,
        other_repair_cost: 800,
        total_trip_expense: 16000,
        net_trip_profit: 29000,
        status: 'completed'
      }
    ]
  },
  {
    id: 'fl-2',
    family_id: 'fam-1',
    vehicle_type: 'school_bus',
    title_model: 'Ashok Leyland 42-Seater (School Bus Contract)',
    reg_number: 'UP 32 CD 8891',
    business_model: 'school_monthly',
    purchase_date: '2022-06-20',
    purchase_cost: 2600000,
    body_building_cost: 150000,
    total_acquisition_cost: 2750000,
    has_loan: false,
    monthly_emi: 0,
    loan_balance: 0,
    annual_depreciation_percent: 12,
    current_depreciated_value: 1720000,
    status: 'active',
    default_driver_name: 'Ramu Kaka',
    default_conductor_name: 'Mohan Lal (Helper)',
    odometer_km: 48500,
    lifetime_revenue: 2150000,
    lifetime_expenses: 980000,
    lifetime_net_profit: 1170000,
    trips: [
      {
        id: 'ft-2',
        fleet_vehicle_id: 'fl-2',
        trip_type: 'school_monthly',
        trip_title: 'DPS Public School Monthly Route Duty',
        start_date: new Date().toISOString().split('T')[0],
        assigned_driver: 'Ramu Kaka',
        assigned_conductor: 'Mohan Lal',
        customer_party_name: 'Delhi Public School Management',
        billing_mode: 'monthly_fixed',
        rate: 85000,
        quantity: 1,
        gross_revenue: 85000,
        advance_received: 85000,
        pending_payment: 0,
        diesel_liters: 280,
        diesel_cost: 25200,
        toll_fastag_cost: 0,
        driver_bhata: 15000,
        conductor_bhata: 8000,
        total_trip_expense: 48200,
        net_trip_profit: 36800,
        status: 'completed'
      }
    ]
  },
  {
    id: 'fl-3',
    family_id: 'fam-1',
    vehicle_type: 'tourist_cab',
    title_model: 'Maruti Ertiga Tour M Commercial (Taxi)',
    reg_number: 'DL 01 N 4421',
    business_model: 'outstation_rental',
    purchase_date: '2023-11-15',
    purchase_cost: 1150000,
    body_building_cost: 35000,
    total_acquisition_cost: 1185000,
    has_loan: true,
    monthly_emi: 19500,
    loan_tenure_months: 48,
    loan_balance: 780000,
    financier_name: 'Kotak Mahindra Prime',
    annual_depreciation_percent: 15,
    current_depreciated_value: 955000,
    status: 'active',
    default_driver_name: 'Vikram Sharma',
    odometer_km: 36000,
    lifetime_revenue: 640000,
    lifetime_expenses: 320000,
    lifetime_net_profit: 320000,
    trips: [
      {
        id: 'ft-3',
        fleet_vehicle_id: 'fl-3',
        trip_type: 'outstation_rental',
        trip_title: 'Delhi to Jaipur - 3 Days Family Outstation Tour',
        start_date: new Date().toISOString().split('T')[0],
        assigned_driver: 'Vikram Sharma',
        customer_party_name: 'Mr. Arvind Aggarwal (Tourist Booking)',
        customer_phone: '+91 99118 77665',
        billing_mode: 'per_km',
        rate: 18,
        quantity: 650,
        gross_revenue: 14700,
        advance_received: 5000,
        pending_payment: 9700,
        diesel_liters: 45,
        diesel_cost: 4050,
        toll_fastag_cost: 1250,
        driver_bhata: 1500,
        total_trip_expense: 6800,
        net_trip_profit: 7900,
        status: 'completed'
      }
    ]
  }
];
`;

storeCode = storeCode.replace("export const INITIAL_CASES:", fleetAndCourtStoreData + "\nexport const INITIAL_CASES:");

// Add lawyer fee properties to CourtCase
storeCode = storeCode.replace(
  "summary: 'Purani zameen ke hisse aur boundary verification ka case.',",
  `summary: 'Purani zameen ke hisse aur boundary verification ka case.',
    lawyer_total_agreed_fee: 65000,
    lawyer_advance_paid: 20000,
    lawyer_per_peshi_fee: 2000,
    lawyer_total_paid: 28000,
    lawyer_balance_due: 37000,
    lawyer_payments: [
      { id: 'lp-1', case_id: 'cs-1', date: '2026-05-15', amount: 20000, payment_type: 'advance_filing', note: 'Case filing & Vakalatnama advance' },
      { id: 'lp-2', case_id: 'cs-1', date: '2026-06-20', amount: 2000, payment_type: 'peshi_fee', note: '1st Peshi hearing fee' },
      { id: 'lp-3', case_id: 'cs-1', date: '2026-07-25', amount: 2000, payment_type: 'peshi_fee', note: '2nd Peshi hearing fee' },
      { id: 'lp-4', case_id: 'cs-1', date: '2026-08-01', amount: 4000, payment_type: 'munshi_fee', note: 'Munshi clerkage & Patwari copy misc fees' }
    ],`
);

// Add to context type
const fleetContextAdditions = `
  fleetVehicles: CommercialFleetVehicle[];
  addFleetVehicle: (vehicle: Omit<CommercialFleetVehicle, 'id' | 'family_id' | 'trips' | 'lifetime_revenue' | 'lifetime_expenses' | 'lifetime_net_profit'>) => void;
  addFleetTrip: (vehicleId: string, trip: Omit<FleetTrip, 'id' | 'fleet_vehicle_id' | 'total_trip_expense' | 'net_trip_profit'>) => void;
  recordLawyerFeePayment: (caseId: string, payment: { amount: number; payment_type: LawyerPaymentType; note: string }) => void;
`;

storeCode = storeCode.replace("udharContacts: UdharContact[];", "udharContacts: UdharContact[];\n" + fleetContextAdditions);

// Add to provider state
storeCode = storeCode.replace(
  "const [udharContacts, setUdharContacts] = useState<UdharContact[]>(INITIAL_UDHAR_CONTACTS);",
  "const [udharContacts, setUdharContacts] = useState<UdharContact[]>(INITIAL_UDHAR_CONTACTS);\n  const [fleetVehicles, setFleetVehicles] = useState<CommercialFleetVehicle[]>(INITIAL_FLEET);"
);

// Add fleet and lawyer fee actions
const fleetActionHandlers = `
  const addFleetVehicle = (vData: Omit<CommercialFleetVehicle, 'id' | 'family_id' | 'trips' | 'lifetime_revenue' | 'lifetime_expenses' | 'lifetime_net_profit'>) => {
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
`;

storeCode = storeCode.replace("const openQuickAdd = (type: 'expense'", fleetActionHandlers + "\n  const openQuickAdd = (type: 'expense'");

// Add values to provider
storeCode = storeCode.replace(
  "recordUdharSettlement,",
  "recordUdharSettlement,\n        fleetVehicles,\n        addFleetVehicle,\n        addFleetTrip,\n        recordLawyerFeePayment,"
);

fs.writeFileSync('lib/store/familyStore.tsx', storeCode, 'utf8');
console.log('Store updated with Commercial Fleet & Lawyer Fee Payment tracking.');
