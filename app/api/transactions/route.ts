import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({ status: 'ok', message: 'Transactions API ready' }); }
export async function POST(req: Request) { const b = await req.json(); return NextResponse.json({ status: 'ok', data: b }); }
