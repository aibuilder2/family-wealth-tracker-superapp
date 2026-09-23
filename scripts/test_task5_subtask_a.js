/**
 * AUTOMATED VERIFICATION FOR TASK 5 (SUB-TASK A: CORE MANDATE FLOW)
 */

const http = require('http');
const assert = require('assert');

function postJson(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path: path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      },
      (res) => {
        let body = '';
        res.on('data', chunk => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      }
    );

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Verification Suite for Task 5 Sub-task A...\n');

  // TEST 1: Missing udhar_transaction_id (Mandate cannot be standalone)
  console.log('▶️ TEST 1: Reject standalone mandate (missing udhar_transaction_id)');
  const res1 = await postJson('/api/udhar/mandate/create', {
    max_amount: 10000,
    customer_name: 'Test Customer'
  });
  assert.strictEqual(res1.status, 400, 'Expected 400 Bad Request');
  assert.ok(res1.data.error.includes('udhar_transaction_id'), 'Error must mention udhar_transaction_id is required');
  console.log('✅ TEST 1 PASSED: Standalone mandate creation was rejected.\n');

  // TEST 2: Amount exceeds ₹15,000 AFA-free regulatory cap
  console.log('▶️ TEST 2: Reject amount exceeding ₹15,000 regulatory cap');
  const res2 = await postJson('/api/udhar/mandate/create', {
    udhar_transaction_id: 'tx-12345',
    max_amount: 25000,
    customer_name: 'Test Customer'
  });
  assert.strictEqual(res2.status, 400, 'Expected 400 Bad Request');
  assert.ok(res2.data.error.includes('15,000'), 'Error must mention ₹15,000 limit');
  console.log('✅ TEST 2 PASSED: Mandate amount > ₹15,000 was rejected per RBI/NPCI rules.\n');

  // TEST 3: Successful mandate creation under ₹15,000 limit
  console.log('▶️ TEST 3: Valid mandate creation (₹12,000 <= ₹15,000)');
  const res3 = await postJson('/api/udhar/mandate/create', {
    udhar_transaction_id: 'tx-99999',
    max_amount: 12000,
    customer_name: 'Ramesh Kirana Store',
    customer_phone: '9876543210'
  });
  assert.strictEqual(res3.status, 200, 'Expected 200 OK');
  assert.strictEqual(res3.data.success, true, 'success must be true');
  assert.strictEqual(res3.data.mandate.udhar_transaction_id, 'tx-99999');
  assert.strictEqual(res3.data.mandate.max_amount, 12000);
  assert.strictEqual(res3.data.mandate.status, 'pending');
  assert.ok(res3.data.mandate.razorpay_token_id, 'Must contain token id');
  assert.ok(res3.data.mandate.auth_link, 'Must contain authorization link');
  console.log('✅ TEST 3 PASSED: Mandate successfully created with status pending, token ID, and auth link.');
  console.log('Created Mandate Object:', res3.data.mandate);

  console.log('\n🎉 ALL TASK 5 SUB-TASK A TESTS PASSED 100%!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
