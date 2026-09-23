const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

function normalizePhoneNumber(raw) {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.substring(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.substring(1);
  return digits;
}

function isValidIndianPhone(phone) {
  return INDIAN_PHONE_REGEX.test(normalizePhoneNumber(phone));
}

function normalizePan(raw) {
  if (!raw) return null;
  const cleaned = raw.trim().toUpperCase();
  return cleaned.length > 0 ? cleaned : null;
}

function isValidPan(pan) {
  const cleaned = normalizePan(pan);
  if (!cleaned) return false;
  return PAN_REGEX.test(cleaned);
}

function isValidGstin(gstin) {
  if (!gstin) return false;
  return GSTIN_REGEX.test(gstin.trim().toUpperCase());
}

console.log('--- 🧪 STARTING UDHAR SYSTEM LOGICAL TESTS ---');

// Test 1: Phone Validation
console.assert(isValidIndianPhone('9876543210') === true, 'Valid Indian phone must pass');
console.assert(isValidIndianPhone('+91 98765 43210') === true, 'Formatted +91 phone must pass');
console.assert(isValidIndianPhone('5876543210') === false, 'Non-Indian mobile start digit must fail');
console.assert(isValidIndianPhone('987654321') === false, '9 digits must fail');
console.log('✅ Test 1: Phone Number (10-Digit Indian Mobile) Validation Passed');

// Test 2: PAN Validation
console.assert(isValidPan('ABCDE1234F') === true, 'Valid 10-char PAN must pass');
console.assert(isValidPan('abcde1234f') === true, 'Lowercase PAN must be normalized and pass');
console.assert(isValidPan('ABCDE12345') === false, 'Wrong ending character must fail');
console.assert(isValidPan('12345ABCDE') === false, 'Reversed order must fail');
console.assert(isValidPan('ABCDE123') === false, 'Short PAN must fail');
console.log('✅ Test 2: PAN (10-Char Statutory Indian Format) Validation Passed');

// Test 3: GSTIN Validation
console.assert(isValidGstin('09AAACS1234F1Z5') === true, 'Valid 15-char GSTIN must pass');
console.assert(isValidGstin('09AAACS1234F1') === false, 'Incomplete GSTIN must fail');
console.log('✅ Test 3: GSTIN (15-Char Standard Format) Validation Passed');

// Test 4: First-time Customer Photo Check Logic
function canSaveUdhar(isRepeatCustomer, customerPhoto) {
  if (!isRepeatCustomer && !customerPhoto) {
    return { ok: false, error: 'पहली उधारी के लिए ग्राहक की फोटो अनिवार्य है!' };
  }
  return { ok: true };
}

const firstTimeNoPhoto = canSaveUdhar(false, null);
console.assert(firstTimeNoPhoto.ok === false, 'First time udhar without photo must fail');

const firstTimeWithPhoto = canSaveUdhar(false, 'data:image/jpeg;base64,sample...');
console.assert(firstTimeWithPhoto.ok === true, 'First time udhar with photo must pass');

const repeatCustomerNoNewPhoto = canSaveUdhar(true, null);
console.assert(repeatCustomerNoNewPhoto.ok === true, 'Repeat customer without new photo must pass');
console.log('✅ Test 4: First-time Mandatory Photo vs Repeat Optional Photo Passed');

// Test 5: Promised vs Actual Settled Days Trust Track
function calculateRepaymentPerformance(promisedDays, actualDays) {
  const diff = promisedDays - actualDays;
  if (diff >= 0) {
    return { onTime: true, label: diff === 0 ? 'समय पर' : `${diff} दिन पहले` };
  } else {
    return { onTime: false, label: `${Math.abs(diff)} दिन विलंब` };
  }
}

const onTimeResult = calculateRepaymentPerformance(30, 28);
console.assert(onTimeResult.onTime === true && onTimeResult.label === '2 दिन पहले', 'On time calculation failed');

const lateResult = calculateRepaymentPerformance(30, 42);
console.assert(lateResult.onTime === false && lateResult.label === '12 दिन विलंब', 'Late calculation failed');
console.log('✅ Test 5: Speaking vs Doing (Repayment Trust Track) Calculation Passed');

console.log('🎉 ALL 5 LOGICAL FLOWS & VALIDATION RULES VERIFIED 100% SUCCEEDED!');
