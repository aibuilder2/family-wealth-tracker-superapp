const fs = require('fs');

const guideContent = `# Family Wealth App — Poora Feature Guide & User Manual

Yeh document aapke **Family Wealth App** ke har ek feature, screen, aur unko kaise use/create karna hai, uska poora aasan guide hai.

---

## 🗺️ Navigation Map (Kahan Kya Milega)

| Module / Screen | URL Route | Kahan Milega | Kya Kar Sakte Hain |
|---|---|---|---|
| **Home Dashboard** | \`/home\` | Bottom Bar (1st Tab) | Total Wealth, Monthly Income/Expense, Priya ki Education Goal, Quick Action Buttons (\`+ Expense\`, \`+ Income\`, \`+ Udhar\`), Emergency SOS Button. |
| **Money & Ledger** | \`/money\` | Bottom Bar (2nd Tab) | Daily Transactions (Aaj, Kal), Online vs Offline filter, Member filter, Delete transaction. |
| **Udhar & Settle Manager** | \`/money/udhar\` | \`/money\` ke top banner se | Kisi bhi baahar ke insaan ka naya Udhar banana, Partial payment lena/dena, **Samaan/Anaaj dekar hisab chukana**, ya **Kaam/Service karke adjust karna**. |
| **Wealth & Assets** | \`/wealth\` | Bottom Bar (3rd Tab) | Net Wealth summary, **Liquid Wealth** (Bank, Shares) vs **Fixed Wealth** (Gold, Land) split, Financial Goals progress. |
| **Calendar Central Hub** | \`/calendar\` | Bottom Bar (4th Tab) | Time-stamped daily expenses (e.g. 10:15 AM Sabzi ₹840), Bill & EMI due dates, Court hearing dates, Birthdays. |
| **🌾 Krishi & Agri Land** | \`/agriculture\` | **More** Menu → Krishi | Zameen/Khet ka hisab (Khud ki Kheti, Theka, Adhiya), Beej/Khaad/Diesel kharcha, Mandi Fasal bikri aur **Sarkari Bonus** calculation. |
| **🚗 Vehicles & Garage** | \`/vehicles\` | **More** Menu → Vehicles | Car, Bike, Scooty details (Number plate, Purchase cost), Insurance & PUC renewal alerts, Service & Repair history log. |
| **🧹 Household Staff** | \`/staff\` | **More** Menu → Staff | Maid, Driver, Cook ki 1-15 daily attendance (Present/Absent/Half-day), Advance ledger, Salary auto-calculation. |
| **⚖️ Court Case Tracker** | \`/cases\` | **More** Menu → Court Cases | Zameen & Dispute case number, Court name, Next hearing countdown, Hearing result log. |
| **🛡️ Documents Vault** | \`/vault\` | **More** Menu → Vault | Car insurance, Health insurance, Land registry papers, Driving license expiry alerts. |
| **👨‍👩‍👧‍👦 Family Tree & Members** | \`/family\` | **More** Menu → Family | Parivar sadasya list, Invite code, Family Tree (\`/family/tree\`) hierarchy view. |
| **🩺 Medical & Health Vault** | \`/medical\` | **More** Menu → Medical | Blood groups, daily dawai timings, **Verified (Green)** vs **Unverified (Grey)** status. |
| **✨ AI Advisor** | \`/advisor\` | **More** Menu → AI Advisor | Goal savings projections aur portfolio rebalancing suggestions. |
| **⚙️ Permissions & Roles** | \`/settings/members\` | **More** Menu → Permissions | Family Head dwara har member ke specific module access ON/OFF karna aur live simulation. |

---

## 🛠️ Step-by-Step "Kaise Use Karein" (How-To Guide)

### 1. 🎤 Bolke Kharch Add Karna (Voice Input):
1. **Home** ya **Money** screen par **\`+ Expense\`** button dabayein.
2. Form ke upar **Mic (🎤)** button par tap karein.
3. Boliye: jaise *"500 petrol Rohan"* ya *"840 sabzi"*.
4. Amount, Category aur Member auto-fill ho jayenge. **Entry Save Karein** par click karein.

---

### 2. 🤝 Udhar Lena / Dena & Samaan ya Kaam Se Hisab Chukana:
1. **Money** screen me jakar **"Udhar & Settlement Manager"** banner par click karein (\`/money/udhar\`).
2. **Naya Udhar Jodne ke liye (\`+ button\`):**
   - Kisi bhi baahar ke insaan ya dukaandar ka naam likhein (e.g. *Ramesh Uncle*, *Sunil Kirana*).
   - Choose karein: *Maine Diya (Lena Hai)* ya *Maine Liya (Dena Hai)*.
   - Raqam aur Wapsi ki date likhkar save karein.
3. **Hisab Chukane / Settle karne ke liye (\`+ Hisab Chukayein\` button):**
   - **Tareeqa 1: 💵 Cash / GPay** — Jitna cash wapas mila/diya wo enter karein.
   - **Tareeqa 2: 🌾 Samaan Dekar** — Jaise ₹3,000 ka gehu/anaaj/saman dekar adjust kiya.
   - **Tareeqa 3: 🛠️ Kaam Karke** — Jaise ₹1,500 ka tractor/mazdoori kaam kiya.
   - System baaki balance auto-reduce kar deta hai aur pura chukne par **✓ Chukta** mark kar deta hai.

---

### 3. 🌾 Krishi (Agri Land), Kheti Kharch & Mandi Fasal Bikri + Bonus:
1. **More** menu se **🌾 Krishi & Agri Land** open karein (\`/agriculture\`).
2. **Zameen Mode**:
   - *Khud ki Kheti*: Beej, Khaad, Diesel, Labor ke kharche **\`+ Kharch\`** button se likhein.
   - *Theka*: Thekedaar ka naam, phone aur saalana theka raqam track karein.
   - *Adhiya*: 50-50 crop sharing record karein.
3. **Fasal Bikri & Sarkari Bonus:**
   - **\`+ Bikri\`** button dabayein.
   - Mandi me kitne Quintals becha, kya rate mila, aur Sarkari Bonus/Subsidy kitni mili dalein.
   - System Shuddh Munafa (Net Profit) nikalta hai aur checkbox tick karne par direct **Family Income** me jod deta hai.

---

### 4. 🚗 Gaadiyan, Insurance Alert & Service Record:
1. **More** menu se **🚗 Vehicles & Garage** open karein (\`/vehicles\`).
2. **Nayi Gaadi/Bike Add karein (\`+ button\`):** Number plate, Purchase date, Fuel type, Owner save karein.
3. **Alerts Check karein:** Insurance renewal kitne din me due hai, PUC kab expire ho rahi hai.
4. **Service History Likhein (\`+ Record Service\`):** Odometer reading (Km), Service cost (₹), Garage name aur kya kaam hua likhein.

---

### 5. 🧹 Household Staff Attendance & Salary:
1. **More** menu se **Household Staff** open karein (\`/staff\`).
2. Maid ya Driver ke card par jakar **1 se 15 tareek** me se kisi bhi din par tap karein (*Present*, *Absent*, *Half-day*).
3. Salary ya Advance pay karne par ledger update hota hai.

---

### 6. ⚖️ Court Case Tracker:
1. **More** menu se **Court Cases** open karein (\`/cases\`).
2. Case number, Advocate name, aur agle hearing date ka live countdown dekhein.
3. Hearing history me pichli date ka result log padhein.

---

### 7. 🚨 Emergency SOS & Health Verification:
1. Top header me laal rang ka **\`SOS\`** button dabane par emergency broadcast alert activate hota hai.
2. **Medical Records** me blood group aur daily dawai ke aage **Verified (Green)** button tap karke confirm kar sakte hain.

---

## 💻 App Ko Start Kaise Karein:

\`\`\`bash
# 1. Project folder me jayein:
cd C:\\Users\\Lenovo1\\.gemini\\antigravity\\scratch\\family-wealth-app

# 2. Start karein:
npm run dev

# 3. Browser me open karein:
http://localhost:3000
\`\`\`
`;

fs.writeFileSync('APP_FEATURES_AND_USER_GUIDE.md', guideContent.trim() + '\n', 'utf8');
console.log('APP_FEATURES_AND_USER_GUIDE.md created successfully.');
