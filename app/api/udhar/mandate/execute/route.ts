import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mandate_id, udhar_transaction_id, amount, current_balance, is_already_paid } = body;

    // 1. Mandatory checks
    if (!mandate_id || !udhar_transaction_id) {
      return NextResponse.json(
        { error: 'mandate_id और udhar_transaction_id अनिवार्य हैं।' },
        { status: 400 }
      );
    }

    // 2. Double-Collection Protection: Strictly reject collection if already paid or balance is 0
    if (is_already_paid || Number(current_balance) <= 0) {
      return NextResponse.json(
        { 
          error: 'डबल वसूली निषेध (Double-Collection Blocked): यह उधारी पहले ही चुकता (Paid) हो चुकी है। मैंडेट से दोबारा पैसे काटना अस्वीकृत है।',
          code: 'ALREADY_PAID' 
        },
        { status: 400 }
      );
    }

    const collectAmount = parseFloat(amount);
    if (!collectAmount || isNaN(collectAmount) || collectAmount <= 0) {
      return NextResponse.json(
        { error: 'कृपया मान्य वसूली राशि दर्ज करें।' },
        { status: 400 }
      );
    }

    // 3. Amount cannot exceed remaining balance
    if (collectAmount > Number(current_balance)) {
      return NextResponse.json(
        { error: `वसूली राशि शेष बकाया (₹${current_balance}) से अधिक नहीं हो सकती।` },
        { status: 400 }
      );
    }

    // In production, Razorpay Recurring Payment / Invoices API is triggered here.
    const executionId = 'pay_' + Math.random().toString(36).substring(2, 10);
    const nowIso = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: `₹${collectAmount.toLocaleString('en-IN')} का सफल ऑटो-डेबिट निष्पादित हुआ।`,
      payment: {
        payment_id: executionId,
        amount: collectAmount,
        status: 'captured',
        mandate_id,
        udhar_transaction_id,
        executed_at: nowIso,
        method: 'upi_autopay'
      },
      updated_mandate: {
        id: mandate_id,
        status: 'executed',
        last_executed_at: nowIso
      }
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'मैंडेट निष्पादन में आंतरिक त्रुटि हुई।' },
      { status: 500 }
    );
  }
}
