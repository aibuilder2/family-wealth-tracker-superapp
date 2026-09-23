/**
 * Test script for Task 5 Sub-task C: Mandate Bounce & Retry Mechanism
 * 
 * Verifies:
 * 1. Attempt 1 Bounce: Saves failure reason, schedules next retry (+24h), retry_count = 1, is_exhausted = false.
 * 2. Attempt 2 Bounce: Retries exhausted, sets is_exhausted = true, flags '⚠️ Mandate failed — manual follow-up needed'.
 * 3. Retry Success: Successfully settles balance and captures payment.
 */

const http = require('http');

function postRequest(path, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path: path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk) => {
          responseBody += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseBody);
            resolve({ statusCode: res.statusCode, body: parsed });
          } catch (e) {
            resolve({ statusCode: res.statusCode, body: responseBody });
          }
        });
      }
    );

    req.on('error', (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('=====================================================');
  console.log('🚀 TASK 5 - SUB-TASK C VERIFICATION: BOUNCE & RETRY');
  console.log('=====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
    }
  }

  // 1. Test Attempt 1 Failure / Bounce
  console.log('--- Test 1: First Bounce / Failure (Attempt 1 of 2) ---');
  const bounce1Res = await postRequest('/api/udhar/mandate/retry', {
    mandate_id: 'man_test_bounce_001',
    udhar_transaction_id: 'tx_cust_001',
    amount: 5000,
    current_retry_count: 0,
    simulate_outcome: 'fail'
  });

  assert(bounce1Res.statusCode === 200, 'HTTP status is 200 for Attempt 1 retry');
  assert(bounce1Res.body.outcome === 'bounced', 'Outcome is marked as bounced');
  assert(bounce1Res.body.retry_count === 1, 'Retry count incremented to 1');
  assert(bounce1Res.body.is_exhausted === false, 'is_exhausted is false for attempt 1');
  assert(!!bounce1Res.body.mandate.failure_reason, 'Failure reason from bank is saved');
  assert(!!bounce1Res.body.mandate.next_retry_at, 'Next retry is scheduled (+24 hrs)');
  console.log(`   Bank Reason: ${bounce1Res.body.mandate.failure_reason}`);
  console.log(`   Next Scheduled Retry: ${bounce1Res.body.mandate.next_retry_at}\n`);

  // 2. Test Attempt 2 Failure / Bounce (Retries Exhausted)
  console.log('--- Test 2: Second Bounce / Failure (Attempt 2 of 2 - Exhausted) ---');
  const bounce2Res = await postRequest('/api/udhar/mandate/retry', {
    mandate_id: 'man_test_bounce_001',
    udhar_transaction_id: 'tx_cust_001',
    amount: 5000,
    current_retry_count: 1,
    simulate_outcome: 'fail'
  });

  assert(bounce2Res.statusCode === 200, 'HTTP status is 200 for Attempt 2 retry');
  assert(bounce2Res.body.outcome === 'bounced', 'Outcome is marked as bounced');
  assert(bounce2Res.body.retry_count === 2, 'Retry count is 2 (max retries reached)');
  assert(bounce2Res.body.is_exhausted === true, 'is_exhausted is true');
  assert(
    bounce2Res.body.message.includes('⚠️ Mandate failed — manual follow-up needed'),
    'Message explicitly warns "⚠️ Mandate failed — manual follow-up needed"'
  );
  assert(bounce2Res.body.mandate.next_retry_at === undefined, 'No further retries scheduled');
  console.log(`   Exhausted Message: ${bounce2Res.body.message}\n`);

  // 3. Test Successful Retry
  console.log('--- Test 3: Successful Retry Recovery ---');
  const successRes = await postRequest('/api/udhar/mandate/retry', {
    mandate_id: 'man_test_bounce_001',
    udhar_transaction_id: 'tx_cust_001',
    amount: 5000,
    current_retry_count: 1,
    simulate_outcome: 'success'
  });

  assert(successRes.statusCode === 200, 'HTTP status is 200 for successful retry');
  assert(successRes.body.outcome === 'success', 'Outcome is success');
  assert(successRes.body.mandate.status === 'executed', 'Mandate status updated to executed');
  assert(!!successRes.body.payment && successRes.body.payment.status === 'captured', 'Payment captured successfully');
  console.log(`   Captured Payment ID: ${successRes.body.payment.payment_id}\n`);

  console.log('=====================================================');
  console.log(`📊 Result: ${passed}/${total} assertions passed (${Math.round((passed/total)*100)}%)`);
  console.log('=====================================================');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
