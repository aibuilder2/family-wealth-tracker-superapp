const fs = require('fs');

let guide = fs.readFileSync('APP_FEATURES_AND_USER_GUIDE.md', 'utf8');

const fleetSection = `
---

### 8. 🚛 Fleet & Transport Business (1-50 Vehicles: Mining Trucks, School Buses, Cabs):
**Kahan milega:** **More** Menu → **🚛 Fleet & Transport Business** (\`/fleet\`)

1. **Commercial Vehicle Portfolio:**
   - **Mining Tipper Truck** (Tata Signa 28 Ton Tipper) — Per-trip / Per-ton billing.
   - **School Bus Contract** (Ashok Leyland 42-Seater) — Monthly school contract (₹85,000/mo) with Driver (Ramu Kaka) & Conductor (Mohan Lal).
   - **Tourist / Outstation Cab** (Maruti Ertiga Tourer) — Per-km / Outstation rental.
2. **Financials, Loan EMI & Real Lifetime ROI:**
   - Total Acquisition Cost (Gaadi + Body Making).
   - Monthly Loan EMI (e.g. ₹68,500/mo) & Loan Balance tracking.
   - Annual Depreciation (15%/year) se Current Real Market Value.
   - **Lifetime ROI**: Lifetime Revenue (₹28.4L) − Lifetime Expenses (₹16.2L) = Lifetime Net Munafa (₹12.2L).
3. **Trip Dispatcher & Raste Ke Kharche:**
   - **\`+ Nayi Trip Jodein\`**: Gross Billing (₹45,000) − [Diesel (120L = ₹10,800) + Tolls (₹2,400) + Driver Bhata (₹2,000) + Repair (₹800)] = **Net Trip Profit (₹29,000)** jo direct family income me add hota hai.

---

### 9. ⚖️ Court Case Lawyer Fee & Peshi Payment Ledger:
**Kahan milega:** **More** Menu → **Court Case Tracker** (\`/cases\`)

- **Total Agreed Fee (Kul Teh Shuda)**: e.g. ₹65,000.
- **Starting Advance**: e.g. ₹20,000.
- **Per-Peshi / Tarikh Fee**: e.g. ₹2,000/peshi.
- **\`+ Fee / Peshi Pay Karein\` Button**: Peshi fee, advance ya munshiana pay karte hi **Wakil ka bakaya balance kam ho jata hai** aur family expense ledger me record ho jata hai.
`;

if (!guide.includes('Fleet & Transport Business')) {
  guide = guide.replace("## 💻 App Ko Start Kaise Karein:", fleetSection + "\n## 💻 App Ko Start Kaise Karein:");
  fs.writeFileSync('APP_FEATURES_AND_USER_GUIDE.md', guide, 'utf8');
  console.log('Updated APP_FEATURES_AND_USER_GUIDE.md with Fleet and Lawyer Fee sections');
}
