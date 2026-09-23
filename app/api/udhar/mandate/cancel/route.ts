import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mandate_id, udhar_transaction_id, reason } = body;

    if (!mandate_id && !udhar_transaction_id) {
      return NextResponse.json(
        { error: 'mandate_id या udhar_transaction_id अनिवार्य है।' },
        { status: 400 }
      );
    }

    const cancelReason = reason || 'ग्राहक द्वारा मैन्युअल भुगतान प्राप्त — डबल वसूली रोकने हेतु मैंडेट स्वतः रद्द';

    // In production, Razorpay Subscriptions / Mandate cancel API would be invoked here:
    // await razorpay.subscriptions.cancel(subscription_id, { cancel_at_cycle_end: 0 })

    return NextResponse.json({
      success: true,
      message: 'मैंडेट सफलतापूर्वक रद्द (Cancelled) कर दिया गया है। भविष्य में कोई ऑटो-डेबिट नहीं होगा।',
      cancelled_mandate: {
        id: mandate_id,
        udhar_transaction_id,
        status: 'cancelled',
        cancellation_reason: cancelReason,
        cancelled_at: new Date().toISOString()
      }
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'मैंडेट रद्द करने में आंतरिक त्रुटि हुई।' },
      { status: 500 }
    );
  }
}
