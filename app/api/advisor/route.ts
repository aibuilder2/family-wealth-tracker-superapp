import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { totalIncome, totalExpense, totalWealth, liquidWealth, fixedWealth, goals, recentTransactions } = body;

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Gemini API key not configured'
      }, { status: 500 });
    }

    const prompt = `
Aap ek anubhavi aur samajhdaar Indian Family Financial Advisor aur Chartered Accountant hain.
Aapka kaam ek Bharatiya Parivar ko unke real income, expense aur wealth data ke aadhar par aasan Hinglish/Hindi me practical, actionable aur smart financial insights dena hai.

Parivar ka Current Financial Summary:
- Total Net Wealth: ₹${(totalWealth || 0).toLocaleString('en-IN')}
- Liquid Wealth (Bank/Cash/Shares): ₹${(liquidWealth || 0).toLocaleString('en-IN')}
- Fixed Wealth (Gold/Land/Property): ₹${(fixedWealth || 0).toLocaleString('en-IN')}
- Is Mahine ki Total Income: ₹${(totalIncome || 0).toLocaleString('en-IN')}
- Is Mahine ka Total Kharch (Expense): ₹${(totalExpense || 0).toLocaleString('en-IN')}
- Active Parivar Goals: ${JSON.stringify(goals || [])}
- Hal hi ke Kharch (Transactions Sample): ${JSON.stringify(recentTransactions || [])}

Kripya parivar ke liye 3-4 vishesh insights/recommandations tayyar karein.
Response strictly JSON format me hona chahiye jisme ek array 'insights' ho:
{
  "insights": [
    {
      "title": "Short title in Hinglish (e.g. Bachat ka mauka, Emergency Fund, Goal Strategy)",
      "desc": "2-3 sentences practical detail aur specific amount advice ke saath.",
      "tag": "Category like Goal Strategy, Budget Alert, Asset Allocation, Emergency Fund",
      "color": "gold" | "green" | "coral" | "navy"
    }
  ]
}
Sirf valid JSON return karein, koi extra markdown ya codeblocks ke bina agar sambhav ho.
`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error('Gemini API call failed:', errorData);
      return NextResponse.json({
        success: false,
        error: 'Gemini API call failed',
        details: errorData
      }, { status: 502 });
    }

    const data = await res.json();
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    let parsedInsights = [];
    try {
      const cleanJson = replyText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      parsedInsights = parsed.insights || parsed;
    } catch (parseErr) {
      console.warn('JSON parsing error on Gemini response, fallback used:', parseErr);
    }

    return NextResponse.json({
      success: true,
      insights: parsedInsights
    });

  } catch (err: any) {
    console.error('Advisor route error:', err);
    return NextResponse.json({
      success: false,
      error: err?.message || 'Internal server error'
    }, { status: 500 });
  }
}
