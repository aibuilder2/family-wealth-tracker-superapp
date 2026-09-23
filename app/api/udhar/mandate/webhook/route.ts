import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // 1. Signature Verification (if webhook secret configured)
    if (secret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (signature !== expectedSignature) {
        return NextResponse.json(
          { error: 'अमान्य वेबहुक हस्ताक्षर (Invalid Webhook Signature)' },
          { status: 400 }
        );
      }
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      return NextResponse.json({ error: 'अमान्य JSON पेलोड' }, { status: 400 });
    }

    const { event, payload: eventData } = payload;
    const nowIso = new Date().toISOString();

    // Extract mandate_id or entity details
    const paymentEntity = eventData?.payment?.entity;
    const mandateEntity = eventData?.mandate?.entity || eventData?.subscription?.entity;
    
    // Mandate ID can be in notes, description, or id
    const mandateId = 
      mandateEntity?.id || 
      paymentEntity?.notes?.mandate_id || 
      payload?.mandate_id || 
      'man_webhook_default';

    const amount = Number((paymentEntity?.amount ? paymentEntity.amount / 100 : payload?.amount) || 0);

    // Standard Razorpay Autopay platform fee calculation:
    // Base fee: ₹5.00, GST (18%): ₹0.90 => Total fee: ₹5.90
    const processingFee = amount > 0 ? (payload?.fee ? payload.fee : 5.90) : 0;
    const vendorReceivedAmount = Math.max(0, amount - processingFee);

    let eventStatus = 'received';
    let failureReason = payload?.failure_reason || paymentEntity?.error_description;

    // Event Handling
    switch (event) {
      case 'mandate.active':
        eventStatus = 'mandate_activated';
        break;

      case 'mandate.rejected':
        eventStatus = 'mandate_rejected';
        failureReason = failureReason || 'ग्राहक द्वारा UPI ऐप में मैंडेट अस्वीकृत';
        break;

      case 'payment.authorized':
      case 'payment.captured':
        eventStatus = 'payment_success';
        break;

      case 'payment.failed':
        eventStatus = 'payment_bounced';
        failureReason = failureReason || paymentEntity?.error_description || 'INSUFFICIENT_FUNDS: ग्राहक खाते में अपर्याप्त राशि';
        break;

      case 'mandate.cancelled':
        eventStatus = 'mandate_cancelled';
        failureReason = failureReason || 'ग्राहक या बैंक द्वारा मैंडेट निरस्त';
        break;

      default:
        eventStatus = event || 'unknown_event';
        break;
    }

    // Append to in-memory logs store
    if (!global.__udhar_mandate_logs_store) {
      global.__udhar_mandate_logs_store = [];
    }

    const logEntry = {
      id: 'log_wh_' + Math.random().toString(36).substring(2, 10),
      mandate_id: mandateId,
      event_type: event || 'custom.event',
      amount,
      processing_fee: processingFee,
      vendor_received_amount: vendorReceivedAmount,
      failure_reason: failureReason,
      raw_payload: payload,
      created_at: nowIso
    };

    global.__udhar_mandate_logs_store.push(logEntry);

    return NextResponse.json({
      status: 'ok',
      event,
      event_status: eventStatus,
      mandate_id: mandateId,
      amount,
      fee_breakdown: {
        gross_amount: amount,
        platform_fee: 5.00,
        gst_18_pct: 0.90,
        total_deduction: processingFee,
        net_vendor_received: vendorReceivedAmount
      },
      log: logEntry
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'वेबहुक प्रोसेसिंग में आंतरिक त्रुटि हुई।' },
      { status: 500 }
    );
  }
}
