const fs = require('fs');

let storeCode = fs.readFileSync('lib/store/familyStore.tsx', 'utf8');

// Add import
storeCode = storeCode.replace(
  "Vehicle, VehicleServiceLog",
  "Vehicle, VehicleServiceLog, UdharContact, UdharSettlement, UdharSettlementMode"
);

// Add initial udhar contacts
const initialUdharData = `
export const INITIAL_UDHAR_CONTACTS: UdharContact[] = [
  {
    id: 'uc-1',
    family_id: 'fam-1',
    member_id: 'm-papa',
    person_name: 'Chacha Ji (Suresh Sharma)',
    phone: '+91 98765 11002',
    type: 'given', // Maine Diya (Lena hai)
    original_amount: 15000,
    remaining_balance: 7000,
    due_date: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
    notes: 'Bache ki fees ke liye diya tha',
    status: 'active',
    created_at: '2026-06-10',
    settlements: [
      { id: 'us-1', contact_id: 'uc-1', date: '2026-07-15', amount: 5000, settlement_mode: 'cash_online', note: 'GPay se partial payment wapas kiya' },
      { id: 'us-2', contact_id: 'uc-1', date: '2026-08-10', amount: 3000, settlement_mode: 'samaan_goods', note: 'Gaon se 1 quintal desi gehu diya (₹3000 value adjust)' }
    ]
  },
  {
    id: 'uc-2',
    family_id: 'fam-1',
    member_id: 'm-mummy',
    person_name: 'Gupta Kirana Store',
    phone: '+91 98112 44331',
    type: 'taken', // Maine Liya (Dena hai)
    original_amount: 4200,
    remaining_balance: 1200,
    due_date: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
    notes: 'Pichle mahine ka ration udhar',
    status: 'active',
    created_at: '2026-07-20',
    settlements: [
      { id: 'us-3', contact_id: 'uc-2', date: '2026-08-05', amount: 3000, settlement_mode: 'cash_online', note: 'Cash payment' }
    ]
  }
];
`;

storeCode = storeCode.replace("interface FamilyContextType {", initialUdharData + "\ninterface FamilyContextType {");

// Add to context type
const contextAdditions = `
  udharContacts: UdharContact[];
  addUdharContact: (udhar: Omit<UdharContact, 'id' | 'family_id' | 'settlements' | 'created_at'>) => void;
  recordUdharSettlement: (contactId: string, settlement: { amount: number; mode: UdharSettlementMode; note: string }) => void;
`;

storeCode = storeCode.replace("vehicles: Vehicle[];", "vehicles: Vehicle[];\n" + contextAdditions);

// Add to provider state
storeCode = storeCode.replace(
  "const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);",
  "const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);\n  const [udharContacts, setUdharContacts] = useState<UdharContact[]>(INITIAL_UDHAR_CONTACTS);"
);

// Add action handlers
const actionHandlers = `
  const addUdharContact = (uData: Omit<UdharContact, 'id' | 'family_id' | 'settlements' | 'created_at'>) => {
    const newContact: UdharContact = {
      ...uData,
      id: 'uc-' + Date.now(),
      family_id: family.id,
      remaining_balance: uData.original_amount,
      status: 'active',
      settlements: [],
      created_at: new Date().toISOString().split('T')[0]
    };

    setUdharContacts([newContact, ...udharContacts]);

    // Record initial transaction
    addTransaction({
      member_id: uData.member_id,
      type: uData.type === 'given' ? 'udhar_given' : 'udhar_taken',
      amount: uData.original_amount,
      category: 'Udhar',
      category_type: 'personal',
      mode: 'online',
      scope: 'bahar',
      note: (uData.type === 'given' ? 'Udhar diya — ' : 'Udhar liya — ') + uData.person_name,
      udhar_person: uData.person_name,
      txn_date: new Date().toISOString().split('T')[0]
    });
  };

  const recordUdharSettlement = (contactId: string, settlement: { amount: number; mode: UdharSettlementMode; note: string }) => {
    setUdharContacts(udharContacts.map(c => {
      if (c.id === contactId) {
        const newSettlement: UdharSettlement = {
          id: 'us-' + Date.now(),
          contact_id: contactId,
          date: new Date().toISOString().split('T')[0],
          amount: settlement.amount,
          settlement_mode: settlement.mode,
          note: settlement.note
        };

        const newBal = Math.max(0, c.remaining_balance - settlement.amount);
        const newStatus = newBal === 0 ? 'settled' : 'active';

        return {
          ...c,
          remaining_balance: newBal,
          status: newStatus,
          settlements: [newSettlement, ...c.settlements]
        };
      }
      return c;
    }));

    // Record adjustment in family transactions if cash/online
    if (settlement.mode === 'cash_online') {
      const contact = udharContacts.find(c => c.id === contactId);
      if (contact) {
        addTransaction({
          member_id: contact.member_id,
          type: contact.type === 'given' ? 'income' : 'expense',
          amount: settlement.amount,
          category: 'Udhar Wapsi',
          category_type: 'personal',
          mode: 'online',
          scope: 'bahar',
          note: 'Udhar settle/wapsi — ' + contact.person_name + ' (' + settlement.note + ')',
          udhar_person: contact.person_name,
          txn_date: new Date().toISOString().split('T')[0]
        });
      }
    }
  };
`;

storeCode = storeCode.replace("const openQuickAdd = (type: 'expense'", actionHandlers + "\n  const openQuickAdd = (type: 'expense'");

// Add values to provider
storeCode = storeCode.replace(
  "addVehicleServiceLog,",
  "addVehicleServiceLog,\n        udharContacts,\n        addUdharContact,\n        recordUdharSettlement,"
);

fs.writeFileSync('lib/store/familyStore.tsx', storeCode, 'utf8');
console.log('Store updated with Udhar Contacts and Partial/Goods Settlement logic.');
