/**
 * Automated Verification Script for Task 5 Sub-tasks D & E
 * Tests:
 * 1. POST /api/udhar/mandate/logs (audit log creation)
 * 2. GET /api/udhar/mandate/logs (audit log retrieval)
 * 3. POST /api/udhar/mandate/webhook (Webhook handling for mandate.active, payment.captured with fee breakdown, and payment.failed)
 */

const http = require('http');

function postRequest(path, data, headers = {}) {
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
          'Content-Length': Buffer.byteLength(payload),
          ...headers
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

function getRequest(path) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path: path,
        method: 'GET'
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
    req.end();
  });
}

async function runTests() {
  console.log('=====================================================');
  console.log('🚀 TASK 5 - SUB-TASKS D & E VERIFICATION: WEBHOOKS & LOGS');
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

  const TEST_MANDATE_ID = 'man_test_audit_' + Date.now();

  // --- 1. Audit Log Insertion ---
  console.log('--- Test 1: Record Audit Log Entry ---');
  const logRes1 = await postRequest('/api/udhar/mandate/logs', {
    mandate_id: TEST_MANDATE_ID,
    event_type: 'mandate.created',
    amount: 10000,
    processing_fee: 0,
    vendor_received_amount: 0,
    raw_payload: { note: 'Mandate registration link created' }
  });

  assert(logRes1.statusCode === 200, 'HTTP status is 200 for log creation');
  assert(logRes1.body.success === true, 'Audit log saved successfully');
  assert(logRes1.body.log.mandate_id === TEST_MANDATE_ID, 'Mandate ID matches');
  assert(logRes1.body.log.event_type === 'mandate.created', 'Event type is mandate.created');
  console.log(`   Saved Log ID: ${logRes1.body.log.id}\n`);

  // --- 2. Audit Log Retrieval ---
  console.log('--- Test 2: Retrieve Audit Logs for Mandate ---');
  const getLogsRes = await getRequest(`/api/udhar/mandate/logs?mandate_id=${TEST_MANDATE_ID}`);
  assert(getLogsRes.statusCode === 200, 'HTTP status is 200 for log retrieval');
  assert(getLogsRes.body.success === true, 'Log retrieval was successful');
  assert(getLogsRes.body.count >= 1, 'Audit log entries count is >= 1');
  assert(getLogsRes.body.logs[0].event_type === 'mandate.created', 'First event is mandate.created');
  console.log(`   Retrieved ${getLogsRes.body.count} logs for mandate.\n`);

  // --- 3. Webhook: Mandate Active Event ---
  console.log('--- Test 3: Razorpay Webhook (mandate.active) ---');
  const whActiveRes = await postRequest('/api/udhar/mandate/webhook', {
    event: 'mandate.active',
    mandate_id: TEST_MANDATE_ID,
    payload: {
      mandate: {
        entity: {
          id: TEST_MANDATE_ID,
          status: 'active'
        }
      }
    }
  });

  assert(whActiveRes.statusCode === 200, 'HTTP status 200 for webhook mandate.active');
  assert(whActiveRes.body.event_status === 'mandate_activated', 'Webhook successfully marked mandate as activated');
  console.log(`   Event Status: ${whActiveRes.body.event_status}\n`);

  // --- 4. Webhook: Payment Captured & Cost Breakdown ---
  console.log('--- Test 4: Razorpay Webhook (payment.captured & Fee Breakdown) ---');
  const whPaymentRes = await postRequest('/api/udhar/mandate/webhook', {
    event: 'payment.captured',
    mandate_id: TEST_MANDATE_ID,
    payload: {
      payment: {
        entity: {
          id: 'pay_test_wh_123',
          amount: 800000, // 8000.00 INR (paise)
          notes: { mandate_id: TEST_MANDATE_ID }
        }
      }
    }
  });

  assert(whPaymentRes.statusCode === 200, 'HTTP status 200 for webhook payment.captured');
  assert(whPaymentRes.body.event_status === 'payment_success', 'Webhook status is payment_success');
  assert(whPaymentRes.body.amount === 8000, 'Amount parsed as ₹8,000');
  assert(whPaymentRes.body.fee_breakdown.platform_fee === 5.00, 'Platform fee calculated as ₹5.00');
  assert(whPaymentRes.body.fee_breakdown.gst_18_pct === 0.90, 'GST 18% calculated as ₹0.90');
  assert(whPaymentRes.body.fee_breakdown.total_deduction === 5.90, 'Total gateway deduction is ₹5.90');
  assert(whPaymentRes.body.fee_breakdown.net_vendor_received === 7994.10, 'Net vendor credit is ₹7,994.10');
  console.log(`   Gross: ₹${whPaymentRes.body.fee_breakdown.gross_amount}`);
  console.log(`   Total Fee: ₹${whPaymentRes.body.fee_breakdown.total_deduction}`);
  console.log(`   Net In-Hand: ₹${whPaymentRes.body.fee_breakdown.net_vendor_received}\n`);

  // --- 5. Webhook: Payment Failed / Bounced ---
  console.log('--- Test 5: Razorpay Webhook (payment.failed) ---');
  const whFailRes = await postRequest('/api/udhar/mandate/webhook', {
    event: 'payment.failed',
    mandate_id: TEST_MANDATE_ID,
    payload: {
      payment: {
        entity: {
          id: 'pay_test_failed_001',
          error_description: 'INSUFFICIENT_FUNDS: ग्राहक के खाते में पर्याप्त शेष नहीं है',
          notes: { mandate_id: TEST_MANDATE_ID }
        }
      }
    }
  });

  assert(whFailRes.statusCode === 200, 'HTTP status 200 for webhook payment.failed');
  assert(whFailRes.body.event_status === 'payment_bounced', 'Event status marked as payment_bounced');
  assert(
    whFailRes.body.log.failure_reason.includes('INSUFFICIENT_FUNDS'),
    'Failure reason properly captured from error_description'
  );
  console.log(`   Saved Failure Reason: ${whFailRes.body.log.failure_reason}\n`);

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
