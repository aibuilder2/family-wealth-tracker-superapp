import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'summary';
  const familyId = searchParams.get('family_id') || 'fam-1';

  // Return formatted JSON for ChatGPT Action
  return NextResponse.json({
    status: 'success',
    family_id: familyId,
    timestamp: new Date().toISOString(),
    data: {
      net_wealth: '₹52,50,000',
      monthly_income: '₹1,85,000',
      monthly_expense: '₹92,000',
      active_goals: [
        { title: 'Priya Higher Education', target: '₹15,00,000', saved: '₹9,20,000', progress: '61%' },
        { title: 'Diwali Gold & SGB', target: '₹3,00,000', saved: '₹2,10,000', progress: '70%' }
      ],
      inter_member_hisab: [
        { pair: 'Papa (Head) ↔ Rahul', net_balance: 'Papa owes Rahul ₹1,800', status: 'pending' },
        { pair: 'Priya ↔ Mummy', net_balance: 'Priya spent ₹1,450 for Mummy', status: 'pending' }
      ],
      rental_business: {
        total_properties: 2,
        occupancy: '90%',
        monthly_rent_target: '₹84,000',
        collected: '₹72,000'
      }
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, query } = body;

    return NextResponse.json({
      status: 'success',
      action_processed: action || 'advisor_query',
      response: `Family SuperApp verified query: "${query || 'Summary requested'}". Portfolio is 62% invested in compounding assets with zero high-cost debt.`
    });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 400 });
  }
}
