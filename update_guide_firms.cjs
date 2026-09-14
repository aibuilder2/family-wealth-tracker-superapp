const fs = require('fs');

let guide = fs.readFileSync('APP_FEATURES_AND_USER_GUIDE.md', 'utf8');

const firmsSection = `
---

### 10. 🏢 Registered Business Firms, GST & Partner Drawings Hub:
**Kahan milega:** **More** Menu → **🏢 Business Firms & GST** (\`/firms\`)

1. **Registered Firm Setup (Proprietorship, Partnership, Pvt Ltd, LLP):**
   - Example: *Sharma Roadways & Logistics (Proprietorship)* with GSTIN (\`07AAAAA0000A1Z5\`) & HDFC Current Account.
   - Example: *Shree Ram Agro Farms & Trading (Partnership)* with SBI Current Account.
2. **GST & TDS (194C) Calculation:**
   - Commercial trips aur contracts par GST (5% RCM, 12%, 18%) aur TDS (1%, 2%) auto-tracked.
3. **Do Options Available:**
   - **Option 1 (Direct Personal):** Bina firm ke direct personal Family Income me add karein.
   - **Option 2 (Firm Account + Partner Drawings):** Pura business revenue pehle Firm ke Current Account me jama hoga. Mahine ya quarter ke aakhir me **\`+ Transfer Profit to Family\`** button dabakar Partner Salary ya Profit Dividend ke roop me personal Family Income me transfer karein!
`;

if (!guide.includes('Business Firms, GST & Partner Drawings Hub')) {
  guide = guide.replace("## 💻 App Ko Start Kaise Karein:", firmsSection + "\n## 💻 App Ko Start Kaise Karein:");
  fs.writeFileSync('APP_FEATURES_AND_USER_GUIDE.md', guide, 'utf8');
  console.log('Updated APP_FEATURES_AND_USER_GUIDE.md with Business Firms section');
}
