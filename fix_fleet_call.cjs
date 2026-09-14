const fs = require('fs');

let fleet = fs.readFileSync('app/(dashboard)/fleet/page.tsx', 'utf8');
fleet = fleet.replace(
  "      total_acquisition_cost: pCost + bCost,\n      current_depreciated_value: pCost + bCost,\n",
  ""
);
fs.writeFileSync('app/(dashboard)/fleet/page.tsx', fleet, 'utf8');

console.log('Cleaned addFleetVehicle call');
