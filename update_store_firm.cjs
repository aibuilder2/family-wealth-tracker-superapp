const fs = require('fs');

let storeCode = fs.readFileSync('lib/store/familyStore.tsx', 'utf8');

// Update imports
storeCode = storeCode.replace(
  "LawyerFeePayment, LawyerPaymentType",
  "LawyerFeePayment, LawyerPaymentType, BusinessFirm, FirmDrawing, EntityType"
);

// Add initial business firms data
const firmInitialData = `
export const INITIAL_FIRMS: BusinessFirm[] = [
  {
    id: 'firm-1',
    family_id: 'fam-1',
    firm_name: 'Sharma Roadways & Logistics (Transport Firm)',
    entity_type: 'Proprietorship',
    gstin: '07AAAAA0000A1Z5',
    pan: 'ABCDE1234F',
    bank_current_acc: 'HDFC Bank (CA-889102)',
    total_revenue: 2840000,
    total_expenses: 1620000,
    total_gst_collected: 142000,
    total_tds_deducted: 28400,
    current_firm_balance: 1191600,
    total_drawings_paid: 450000,
    drawings: [
      {
        id: 'fd-1',
        firm_id: 'firm-1',
        date: '2026-07-31',
        amount: 250000,
        drawing_type: 'profit_dividend',
        credited_to_member_id: 'm-papa',
        note: 'Quarterly Net Profit transfer to Papa Savings A/c'
      },
      {
        id: 'fd-2',
        firm_id: 'firm-1',
        date: '2026-08-15',
        amount: 200000,
        drawing_type: 'partner_salary',
        credited_to_member_id: 'm-papa',
        note: 'Monthly Partner Remuneration to Family'
      }
    ]
  },
  {
    id: 'firm-2',
    family_id: 'fam-1',
    firm_name: 'Shree Ram Agro Farms & Trading',
    entity_type: 'Partnership_Firm',
    gstin: '07BBBBB1111B2Z6',
    pan: 'XYZAB9876C',
    bank_current_acc: 'SBI Current A/c (CA-443109)',
    total_revenue: 1250000,
    total_expenses: 570000,
    total_gst_collected: 0,
    total_tds_deducted: 0,
    current_firm_balance: 680000,
    total_drawings_paid: 150000,
    drawings: [
      {
        id: 'fd-3',
        firm_id: 'firm-2',
        date: '2026-08-10',
        amount: 150000,
        drawing_type: 'profit_dividend',
        credited_to_member_id: 'm-papa',
        note: 'Fasal Season Profit transfer to Family'
      }
    ]
  }
];
`;

storeCode = storeCode.replace("export const INITIAL_FLEET:", firmInitialData + "\nexport const INITIAL_FLEET:");

// Add to context type
const firmContextAdditions = `
  businessFirms: BusinessFirm[];
  addBusinessFirm: (firm: Omit<BusinessFirm, 'id' | 'family_id' | 'total_revenue' | 'total_expenses' | 'total_gst_collected' | 'total_tds_deducted' | 'current_firm_balance' | 'total_drawings_paid' | 'drawings'>) => void;
  recordFirmDrawingToFamily: (firmId: string, drawing: { amount: number; drawing_type: 'partner_salary' | 'profit_dividend' | 'director_remuneration'; credited_to_member_id: string; note: string }) => void;
`;

storeCode = storeCode.replace("fleetVehicles: CommercialFleetVehicle[];", "fleetVehicles: CommercialFleetVehicle[];\n" + firmContextAdditions);

// Add to provider state
storeCode = storeCode.replace(
  "const [fleetVehicles, setFleetVehicles] = useState<CommercialFleetVehicle[]>(INITIAL_FLEET);",
  "const [fleetVehicles, setFleetVehicles] = useState<CommercialFleetVehicle[]>(INITIAL_FLEET);\n  const [businessFirms, setBusinessFirms] = useState<BusinessFirm[]>(INITIAL_FIRMS);"
);

// Add actions in provider
const firmActionHandlers = `
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
`;

storeCode = storeCode.replace("const addFleetVehicle = (vData: Omit<CommercialFleetVehicle,", firmActionHandlers + "\n  const addFleetVehicle = (vData: Omit<CommercialFleetVehicle,");

// Add values to provider
storeCode = storeCode.replace(
  "fleetVehicles,",
  "fleetVehicles,\n        businessFirms,\n        addBusinessFirm,\n        recordFirmDrawingToFamily,"
);

fs.writeFileSync('lib/store/familyStore.tsx', storeCode, 'utf8');
console.log('Store updated with Business Firms, GST & Partner Drawings.');
