const fs = require('fs');

let store = fs.readFileSync('lib/store/familyStore.tsx', 'utf8');

store = store.replace(
  "const addFleetVehicle = (vData: Omit<CommercialFleetVehicle, 'id' | 'family_id' | 'trips' | 'lifetime_revenue' | 'lifetime_expenses' | 'lifetime_net_profit'>) => {",
  "const addFleetVehicle = (vData: Omit<CommercialFleetVehicle, 'id' | 'family_id' | 'trips' | 'lifetime_revenue' | 'lifetime_expenses' | 'lifetime_net_profit' | 'total_acquisition_cost' | 'current_depreciated_value'>) => {"
);

fs.writeFileSync('lib/store/familyStore.tsx', store, 'utf8');
console.log('Fixed addFleetVehicle implementation signature');
