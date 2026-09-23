/**
 * AUTOMATED VERIFICATION SUITE FOR TASK 5 SUB-TASK B
 * Mandate vs Manual Payment Conflict & Double-Collection Prevention
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
  console.log('🧪 Starting Verification Suite for Task 5 Sub-task B...\n');

  // TEST 1: Cancel Mandate on Manual Payment
  console.log('▶️ TEST 1: Automatic Mandate Cancellation on Manual Payment');
  const res1 = await postJson('/api/udhar/mandate/cancel', {
    mandate_id: 'man-test-101',
    udhar_transaction_id: 'tx-test-202',
    reason: 'ग्राहक द्वारा मैन्युअल भुगतान प्राप्त (₹10,000) — डबल वसूली रोकने हेतु मैंडेट स्वतः रद्द'
  });
  assert.strictEqual(res1.status, 200, 'Expected 200 OK');
  assert.strictEqual(res1.data.success, true);
  assert.strictEqual(res1.data.cancelled_mandate.status, 'cancelled');
  assert.ok(res1.data.cancelled_mandate.cancellation_reason.includes('डबल वसूली रोकने'));
  console.log('✅ TEST 1 PASSED: Mandate successfully marked cancelled upon manual settlement.\n');

  // TEST 2: Double-Collection Prevention (Block debit when transaction is already paid)
  console.log('▶️ TEST 2: Double-Collection Protection (Block execution on already paid transactions)');
  const res2 = await postJson('/api/udhar/mandate/execute', {
    mandate_id: 'man-test-101',
    udhar_transaction_id: 'tx-test-202',
    amount: 5000,
    current_balance: 0,
    is_already_paid: true
  });
  assert.strictEqual(res2.status, 400, 'Expected 400 Bad Request');
  assert.ok(res2.data.error.includes('डबल वसूली निषेध'), 'Must contain double collection prohibition');
  assert.strictEqual(res2.data.code, 'ALREADY_PAID');
  console.log('✅ TEST 2 PASSED: Double collection was strictly blocked because transaction is already paid.\n');

  // TEST 3: Block execution when requested debit exceeds remaining balance
  console.log('▶️ TEST 3: Block debit exceeding remaining unpaid balance');
  const res3 = await postJson('/api/udhar/mandate/execute', {
    mandate_id: 'man-test-101',
    udhar_transaction_id: 'tx-test-202',
    amount: 12000,
    current_balance: 5000,
    is_already_paid: false
  });
  assert.strictEqual(res3.status, 400, 'Expected 400 Bad Request');
  assert.ok(res3.data.error.includes('शेष बकाया'), 'Must mention remaining balance limit');
  console.log('✅ TEST 3 PASSED: Excessive debit amount rejected.\n');

  // TEST 4: Successful Mandate Execution on Unpaid Transaction
  console.log('▶️ TEST 4: Successful Mandate Execution on active unpaid balance');
  const res4 = await postJson('/api/udhar/mandate/execute', {
    mandate_id: 'man-test-101',
    udhar_transaction_id: 'tx-test-202',
    amount: 4500,
    current_balance: 4500,
    is_already_paid: false
  });
  assert.strictEqual(res4.status, 200, 'Expected 200 OK');
  assert.strictEqual(res4.data.success, true);
  assert.strictEqual(res4.data.payment.amount, 4500);
  assert.strictEqual(res4.data.payment.status, 'captured');
  assert.strictEqual(res4.data.updated_mandate.status, 'executed');
  console.log('✅ TEST 4 PASSED: Mandate executed successfully for ₹4,500 and status set to executed.');
  console.log('Execution Payment Result:', res4.data.payment);

  console.log('\n🎉 ALL TASK 5 SUB-TASK B TESTS PASSED 100%!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
