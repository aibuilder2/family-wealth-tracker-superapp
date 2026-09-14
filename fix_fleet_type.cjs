const fs = require('fs');

// 1. Update familyStore.tsx addFleetVehicle type definition
let store = fs.readFileSync('lib/store/familyStore.tsx', 'utf8');
store = store.replace(
  "addFleetVehicle: (vehicle: Omit<CommercialFleetVehicle, 'id' | 'family_id' | 'trips' | 'lifetime_revenue' | 'lifetime_expenses' | 'lifetime_net_profit'>) => void;",
  "addFleetVehicle: (vehicle: Omit<CommercialFleetVehicle, 'id' | 'family_id' | 'trips' | 'lifetime_revenue' | 'lifetime_expenses' | 'lifetime_net_profit' | 'total_acquisition_cost' | 'current_depreciated_value'>) => void;"
);
fs.writeFileSync('lib/store/familyStore.tsx', store, 'utf8');

// 2. Update fleet/page.tsx
let fleet = fs.readFileSync('app/(dashboard)/fleet/page.tsx', 'utf8');
fleet = fleet.replace(
  "addFleetVehicle({",
  "addFleetVehicle({\n      total_acquisition_cost: pCost + bCost,\n      current_depreciated_value: pCost + bCost,"
);
fs.writeFileSync('app/(dashboard)/fleet/page.tsx', fleet, 'utf8');

console.log('Fixed addFleetVehicle signature');
