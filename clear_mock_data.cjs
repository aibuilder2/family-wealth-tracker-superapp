const fs = require('fs');

let store = fs.readFileSync('lib/store/familyStore.tsx', 'utf8');

// Update INITIAL constants to clean empty arrays
const cleanConstants = `export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm-head',
    family_id: 'fam-1',
    name: 'Head of Family (Aap)',
    role: 'owner',
    color: '#B98B2A',
    initials: 'H',
    relationship: 'Head of Family',
    permissions: {
      can_view_investments: true,
      can_view_bills: true,
      can_view_vault: true,
      can_view_medical: true,
      can_view_staff: true,
      can_view_cases: true,
      is_admin: true,
    }
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [];
export const INITIAL_FIRMS: BusinessFirm[] = [];
export const INITIAL_FLEET: CommercialFleetVehicle[] = [];
export const INITIAL_AGRI_LANDS: AgriculturalLand[] = [];
export const INITIAL_VEHICLES: Vehicle[] = [];
export const INITIAL_UDHAR_CONTACTS: UdharContact[] = [];
export const INITIAL_CASES: CourtCase[] = [];
export const INITIAL_RECURRING_INCOME: RecurringIncome[] = [];
export const INITIAL_CREDIT_CARDS: CreditCard[] = [];
export const INITIAL_UTILITY_BILLS: UtilityBill[] = [];
export const INITIAL_ASSETS: Asset[] = [];
export const INITIAL_GOALS: Goal[] = [];
export const INITIAL_REMINDERS: Reminder[] = [];
export const INITIAL_STAFF: HouseholdStaff[] = [];
export const INITIAL_DOCUMENTS: DocumentItem[] = [];
export const INITIAL_MEDICAL: MedicalRecord[] = [];`;

// Replace from export const INITIAL_MEMBERS up to interface FamilyContextType
const startIdx = store.indexOf('export const INITIAL_MEMBERS: Member[]');
const endIdx = store.indexOf('interface FamilyContextType');

if (startIdx !== -1 && endIdx !== -1) {
  store = store.substring(0, startIdx) + cleanConstants + '\n\n' + store.substring(endIdx);
}

// Ensure currentUserId defaults to 'm-head'
store = store.replace("useState<string>('m-papa')", "useState<string>('m-head')");
store = store.replace("id: 'fam-1',\n    name: 'Sharma Parivar'", "id: 'fam-1',\n    name: 'Mera Parivar'");

// Clear localstorage mock keys on startup if clean reset is needed
const cleanStorageHook = `  useEffect(() => {
    try {
      // Clear legacy mock cache on initial clean reset
      const isCleaned = localStorage.getItem('fwa_clean_v3');
      if (!isCleaned) {
        localStorage.removeItem('fwa_transactions_v2');
        localStorage.removeItem('fwa_staff');
        localStorage.removeItem('fwa_cases');
        localStorage.setItem('fwa_clean_v3', 'true');
      } else {
        const savedTx = localStorage.getItem('fwa_transactions_v2');
        if (savedTx) setTransactions(JSON.parse(savedTx));
        const savedStaff = localStorage.getItem('fwa_staff');
        if (savedStaff) setStaff(JSON.parse(savedStaff));
        const savedCases = localStorage.getItem('fwa_cases');
        if (savedCases) setCourtCases(JSON.parse(savedCases));
      }
    } catch (e) {}
  }, []);`;

const useEffectOld = `  useEffect(() => {
    try {
      const savedTx = localStorage.getItem('fwa_transactions_v2');
      if (savedTx) setTransactions(JSON.parse(savedTx));
      const savedStaff = localStorage.getItem('fwa_staff');
      if (savedStaff) setStaff(JSON.parse(savedStaff));
      const savedCases = localStorage.getItem('fwa_cases');
      if (savedCases) setCourtCases(JSON.parse(savedCases));
    } catch (e) {}
  }, []);`;

store = store.replace(useEffectOld, cleanStorageHook);

fs.writeFileSync('lib/store/familyStore.tsx', store, 'utf8');
console.log('Cleared all mock dummy data from familyStore.tsx');
