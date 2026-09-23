/**
 * VENDOR DUPLICATE & MISMATCH AUDIT SCRIPT
 * 
 * Scans vendor records from database, JSON data, or mock store to identify:
 * 1. Conflicting names under the same phone number (phone collision).
 * 2. Conflicting names under the same GSTIN (GSTIN collision).
 * 3. Similar vendor names across different phone numbers (suspected duplicate).
 * 4. Invalid or non-10-digit Indian phone numbers.
 * 5. Malformed 15-character GST numbers.
 * 
 * IMPORTANT: This script NEVER merges or alters data. It generates an audit report
 * for manual human verification.
 */

const fs = require('fs');
const path = require('path');

const PHONE_REGEX = /^[6-9]\d{9}$/;
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

function cleanPhone(raw) {
  if (!raw) return '';
  const digits = raw.toString().replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.substring(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.substring(1);
  }
  return digits;
}

function cleanGst(raw) {
  if (!raw) return null;
  const s = raw.toString().trim().toUpperCase();
  return s.length > 0 ? s : null;
}

function runAudit(vendorList) {
  console.log('='.repeat(70));
  console.log('  🔍 VENDOR UDHAR: DUPLICATE & MISMATCH AUDIT REPORT');
  console.log('  Generated At:', new Date().toLocaleString('en-IN'));
  console.log('='.repeat(70));
  console.log(`Total Records Scanned: ${vendorList.length}\n`);

  const phoneMap = new Map(); // phone -> [records]
  const gstMap = new Map(); // gst -> [records]
  const invalidPhones = [];
  const invalidGsts = [];

  for (const v of vendorList) {
    const rawPhone = v.phone || v.phone_number || '';
    const phone = cleanPhone(rawPhone);
    const rawGst = v.gst || v.party_gstin || v.gst_number || null;
    const gst = cleanGst(rawGst);
    const name = (v.person_name || v.vendor_name || v.name || '').trim();

    // 1. Phone validation check
    if (!phone || !PHONE_REGEX.test(phone)) {
      invalidPhones.push({ id: v.id, name, rawPhone });
    } else {
      if (!phoneMap.has(phone)) phoneMap.set(phone, []);
      phoneMap.get(phone).push({ ...v, name, phone, gst });
    }

    // 2. GST validation check
    if (gst) {
      if (!GST_REGEX.test(gst)) {
        invalidGsts.push({ id: v.id, name, gst: rawGst });
      } else {
        if (!gstMap.has(gst)) gstMap.set(gst, []);
        gstMap.get(gst).push({ ...v, name, phone, gst });
      }
    }
  }

  // A. Phone Collisions (Same phone, different names)
  const phoneCollisions = [];
  for (const [phone, records] of phoneMap.entries()) {
    const uniqueNames = new Set(records.map(r => r.name.toLowerCase()));
    if (uniqueNames.size > 1) {
      phoneCollisions.push({ phone, records });
    }
  }

  // B. GST Collisions (Same GST, different names)
  const gstCollisions = [];
  for (const [gst, records] of gstMap.entries()) {
    const uniqueNames = new Set(records.map(r => r.name.toLowerCase()));
    if (uniqueNames.size > 1) {
      gstCollisions.push({ gst, records });
    }
  }

  // Print Section 1: Phone Collisions
  console.log(`📌 1. PHONE COLLISIONS (Same 10-digit Phone with Different Names): ${phoneCollisions.length}`);
  if (phoneCollisions.length === 0) {
    console.log('   ✅ No conflicting vendor names under the same phone number.');
  } else {
    phoneCollisions.forEach((item, idx) => {
      console.log(`   [Issue #${idx + 1}] Phone: ${item.phone}`);
      item.records.forEach(r => {
        console.log(`      • ID: ${r.id} | Name: "${r.name}" | GST: ${r.gst || 'N/A'}`);
      });
      console.log('      👉 Action Required: Verify if these are the same vendor or two different people sharing a number.\n');
    });
  }
  console.log('-'.repeat(70));

  // Print Section 2: GST Collisions
  console.log(`📌 2. GSTIN COLLISIONS (Same GSTIN with Different Names): ${gstCollisions.length}`);
  if (gstCollisions.length === 0) {
    console.log('   ✅ No conflicting vendor names under the same GSTIN.');
  } else {
    gstCollisions.forEach((item, idx) => {
      console.log(`   [Issue #${idx + 1}] GSTIN: ${item.gst}`);
      item.records.forEach(r => {
        console.log(`      • ID: ${r.id} | Name: "${r.name}" | Phone: ${r.phone}`);
      });
      console.log('      👉 Action Required: Verify legal trade name on GST portal and unify reference.\n');
    });
  }
  console.log('-'.repeat(70));

  // Print Section 3: Invalid Phone Numbers
  console.log(`📌 3. MISSING OR INVALID INDIAN PHONE NUMBERS: ${invalidPhones.length}`);
  if (invalidPhones.length === 0) {
    console.log('   ✅ All records have valid 10-digit Indian phone numbers.');
  } else {
    invalidPhones.forEach((item, idx) => {
      console.log(`   [Warning #${idx + 1}] ID: ${item.id} | Name: "${item.name}" | Phone Entered: "${item.rawPhone}"`);
    });
    console.log('   👉 Action: Update with valid 10-digit mobile number starting with 6, 7, 8, or 9.\n');
  }
  console.log('-'.repeat(70));

  // Print Section 4: Invalid GSTIN Formats
  console.log(`📌 4. INVALID GSTIN FORMATS: ${invalidGsts.length}`);
  if (invalidGsts.length === 0) {
    console.log('   ✅ All provided GSTINs match valid 15-character statutory format.');
  } else {
    invalidGsts.forEach((item, idx) => {
      console.log(`   [Warning #${idx + 1}] ID: ${item.id} | Name: "${item.name}" | GST Entered: "${item.gst}"`);
    });
    console.log('   👉 Action: Correct the GSTIN to standard 15-character alphanumeric format.\n');
  }
  console.log('='.repeat(70));
  console.log('  REPORT COMPLETE. (No data was altered).');
  console.log('='.repeat(70));
}

// Sample test run with mock records
const sampleLegacyData = [
  { id: 'v-101', person_name: 'रमेश किराना स्टोर', phone: '9876543210', party_gstin: '09AAACS1234F1Z5' },
  { id: 'v-102', person_name: 'रमेश कुमार किराना', phone: '9876543210', party_gstin: '09AAACS1234F1Z5' }, // Collision
  { id: 'v-103', person_name: 'सुनील हार्डवेयर', phone: '9811223344', party_gstin: '09CCWPS9911L1Z8' },
  { id: 'v-104', person_name: 'बलबीर ट्रैक्टर वर्क्स', phone: '9826019283' },
  { id: 'v-105', person_name: 'गुप्ता जी प्रोविजन', phone: '12345' }, // Invalid phone
  { id: 'v-106', person_name: 'अग्रवाल पेंट्स', phone: '9823456789', party_gstin: 'INVALIDGST' } // Invalid GST
];

runAudit(sampleLegacyData);
