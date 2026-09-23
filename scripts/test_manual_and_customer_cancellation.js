/**
 * Automated Test: Seller Cancellation with Details & Customer Request Approval Gate
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
  console.log('🚀 TESTING SELLER CANCELLATION & CUSTOMER APPROVAL GATE');
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

  // Test 1: Seller Cancels Mandate with NEFT & UTR Number
  console.log('--- Test 1: Seller Manual Cancellation (NEFT & UTR Reason) ---');
  const neftCancelRes = await postRequest('/api/udhar/mandate/cancel', {
    mandate_id: 'man_test_neft_001',
    udhar_transaction_id: 'tx_cust_neft_01',
    reason: 'NEFT / RTGS बैंक में प्राप्त (विवरण: UTR PUNB0928172938)'
  });

  assert(neftCancelRes.statusCode === 200, 'HTTP status is 200');
  assert(neftCancelRes.body.success === true, 'Cancellation succeeded');
  assert(neftCancelRes.body.cancelled_mandate.status === 'cancelled', 'Status set to cancelled');
  assert(
    neftCancelRes.body.cancelled_mandate.cancellation_reason.includes('PUNB0928172938'),
    'Custom UTR reference preserved in cancellation reason'
  );
  console.log(`   Cancellation Reason Saved: ${neftCancelRes.body.cancelled_mandate.cancellation_reason}\n`);

  // Test 2: Seller Cancels Mandate with Cheque Details
  console.log('--- Test 2: Seller Manual Cancellation (Cheque Reason) ---');
  const chqCancelRes = await postRequest('/api/udhar/mandate/cancel', {
    mandate_id: 'man_test_chq_002',
    udhar_transaction_id: 'tx_cust_chq_02',
    reason: 'चेक प्राप्त व क्लियर हुआ (विवरण: Cheque #509214 SBI)'
  });

  assert(chqCancelRes.statusCode === 200, 'HTTP status is 200');
  assert(chqCancelRes.body.cancelled_mandate.status === 'cancelled', 'Status set to cancelled');
  assert(
    chqCancelRes.body.cancelled_mandate.cancellation_reason.includes('Cheque #509214'),
    'Cheque reference preserved in cancellation reason'
  );
  console.log(`   Cancellation Reason Saved: ${chqCancelRes.body.cancelled_mandate.cancellation_reason}\n`);

  // Test 3: Seller Approves Customer Cancellation Request
  console.log('--- Test 3: Seller Confirms Customer Request (Seller Approval Gate) ---');
  const custApprovedRes = await postRequest('/api/udhar/mandate/cancel', {
    mandate_id: 'man_test_cust_req_003',
    udhar_transaction_id: 'tx_cust_req_03',
    reason: 'ग्राहक अनुरोध स्वीकृत: NEFT / बैंक ट्रांसफर (UTR: SBIN0088219482)'
  });

  assert(custApprovedRes.statusCode === 200, 'HTTP status is 200');
  assert(custApprovedRes.body.cancelled_mandate.status === 'cancelled', 'Status set to cancelled');
  assert(
    custApprovedRes.body.cancelled_mandate.cancellation_reason.includes('ग्राहक अनुरोध स्वीकृत'),
    'Approval gate note recorded'
  );
  console.log(`   Confirmed by Seller: ${custApprovedRes.body.cancelled_mandate.cancellation_reason}\n`);

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
