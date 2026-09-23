import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface UdharMandateLog {
  id: string;
  mandate_id: string;
  event_type: string;
  amount: number;
  processing_fee: number;
  vendor_received_amount: number;
  failure_reason?: string;
  raw_payload?: any;
  created_at: string;
}

// In-memory log cache (shared across sessions in-process)
declare global {
  var __udhar_mandate_logs_store: UdharMandateLog[] | undefined;
}

if (!global.__udhar_mandate_logs_store) {
  global.__udhar_mandate_logs_store = [];
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mandateId = searchParams.get('mandate_id');

    if (!mandateId) {
      return NextResponse.json(
        { error: 'mandate_id query parameter अनिवार्य है।' },
        { status: 400 }
      );
    }

    const logs = (global.__udhar_mandate_logs_store || []).filter(
      (l) => l.mandate_id === mandateId
    );

    return NextResponse.json({
      success: true,
      mandate_id: mandateId,
      count: logs.length,
      logs: logs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'लॉग प्राप्त करने में त्रुटि हुई।' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      mandate_id,
      event_type,
      amount = 0,
      processing_fee = 0,
      vendor_received_amount = 0,
      failure_reason,
      raw_payload
    } = body;

    if (!mandate_id || !event_type) {
      return NextResponse.json(
        { error: 'mandate_id और event_type अनिवार्य हैं।' },
        { status: 400 }
      );
    }

    const logEntry: UdharMandateLog = {
      id: 'log_' + Math.random().toString(36).substring(2, 10),
      mandate_id,
      event_type,
      amount: Number(amount || 0),
      processing_fee: Number(processing_fee || 0),
      vendor_received_amount: Number(vendor_received_amount || (amount - processing_fee)),
      failure_reason,
      raw_payload,
      created_at: new Date().toISOString()
    };

    if (!global.__udhar_mandate_logs_store) {
      global.__udhar_mandate_logs_store = [];
    }
    global.__udhar_mandate_logs_store.push(logEntry);

    return NextResponse.json({
      success: true,
      log: logEntry
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'लॉग सुरक्षित करने में त्रुटि हुई।' },
      { status: 500 }
    );
  }
}
