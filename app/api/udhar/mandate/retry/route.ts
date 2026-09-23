import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      mandate_id, 
      udhar_transaction_id, 
      amount, 
      current_retry_count = 0, 
      simulate_outcome = 'fail' // 'success' | 'fail'
    } = body;

    if (!mandate_id || !udhar_transaction_id) {
      return NextResponse.json(
        { error: 'mandate_id और udhar_transaction_id अनिवार्य हैं।' },
        { status: 400 }
      );
    }

    const nextRetryCount = (parseInt(current_retry_count) || 0) + 1;
    const nowIso = new Date().toISOString();

    // Check if retry limit (1-2 times) is exhausted
    const MAX_RETRIES = 2;
    const isExhausted = nextRetryCount >= MAX_RETRIES;

    if (simulate_outcome === 'success') {
      // Retry succeeded!
      const paymentId = 'pay_retry_' + Math.random().toString(36).substring(2, 9);
      return NextResponse.json({
        success: true,
        outcome: 'success',
        message: `पुनः प्रयास सफल: ₹${Number(amount || 0).toLocaleString('en-IN')} का भुगतान प्राप्त हुआ।`,
        mandate: {
          id: mandate_id,
          udhar_transaction_id,
          status: 'executed',
          last_executed_at: nowIso,
          retry_count: nextRetryCount,
          is_exhausted: false,
          failure_reason: undefined
        },
        payment: {
          payment_id: paymentId,
          amount: Number(amount || 0),
          status: 'captured',
          method: 'upi_autopay_retry'
        }
      });
    }

    // Outcome: Bounce / Failure
    const bounceReasons = [
      'INSUFFICIENT_FUNDS: ग्राहक के खाते में पर्याप्त बैलेंस नहीं है',
      'USER_DECLINED: ग्राहक द्वारा UPI ऑटो-पे अस्वीकृत',
      'BANK_TECHNICAL_DECLINE: ग्राहक के बैंक सर्वर से लेन-देन अस्वीकृत',
      'EXCEEDS_MEMBER_LIMIT: ग्राहक की दैनिक UPI सीमा समाप्त'
    ];
    const failureReason = bounceReasons[nextRetryCount % bounceReasons.length];

    // Calculate scheduled next retry time (+24 hours) if not yet exhausted
    const nextRetryDate = new Date();
    nextRetryDate.setHours(nextRetryDate.getHours() + 24);

    return NextResponse.json({
      success: false,
      outcome: 'bounced',
      retry_count: nextRetryCount,
      max_retries: MAX_RETRIES,
      is_exhausted: isExhausted,
      message: isExhausted
        ? '⚠️ Mandate failed — manual follow-up needed. (2 स्वचालित प्रयास विफल, अब मैन्युअल तकादा आवश्यक है)'
        : `प्रयास ${nextRetryCount}/${MAX_RETRIES} विफल। अगला स्वचालित प्रयास 24 घंटे बाद निर्धारित।`,
      mandate: {
        id: mandate_id,
        udhar_transaction_id,
        status: 'bounced',
        failure_reason: failureReason,
        last_bounced_at: nowIso,
        next_retry_at: isExhausted ? undefined : nextRetryDate.toISOString(),
        retry_count: nextRetryCount,
        is_exhausted: isExhausted
      }
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'मैंडेट पुनः प्रयास में आंतरिक त्रुटि हुई।' },
      { status: 500 }
    );
  }
}
