import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, wealthData } = body;

    const liquid = Number(wealthData?.liquidWealth || 0);
    const fixed = Number(wealthData?.fixedWealth || 0);
    const total = liquid + fixed;
    const monthlyIncome = Number(wealthData?.totalIncome || 0);
    const monthlyExpense = Number(wealthData?.totalExpense || 0);
    const savingsRate = monthlyIncome > 0 ? Math.round(((monthlyIncome - monthlyExpense) / monthlyIncome) * 100) : 0;

    // AI Financial & Stock Advisory Synthesis
    let recommendations = [
      {
        title: "Asset Allocation Strategy",
        desc: total > 0 
          ? `Current portfolio is ${Math.round((liquid/total)*100)}% Liquid (₹${liquid.toLocaleString('en-IN')}) and ${Math.round((fixed/total)*100)}% Fixed (₹${fixed.toLocaleString('en-IN')}). Recommended ideal allocation is 40% Liquid, 40% Growth Equity, 20% Safe Fixed.`
          : "Start building your family emergency fund of 6 months expenses in high-yield liquid instruments.",
        tag: "Portfolio Allocation",
        color: "#B98B2A"
      },
      {
        title: "Monthly Cashflow & Savings Rate",
        desc: monthlyIncome > 0 
          ? `Your net savings rate this month is ${savingsRate}%. Target minimum 25% savings to deploy into SIPs and bluechip equity index funds.`
          : "Record regular monthly income and recurring expenses to unlock automated tax & cashflow optimization.",
        tag: "Cashflow",
        color: "#34D399"
      },
      {
        title: "Equity & Stock Market Strategy",
        desc: "For current market environment with Nifty near benchmark highs, prefer staggered SIPs in Nifty 50 / Large-cap leaders (Reliance, TCS, HDFC Bank) with strict stop-losses.",
        tag: "Stock Market AI",
        color: "#60A5FA"
      },
      {
        title: "Risk & Debt Management",
        desc: "Ensure zero high-interest credit card revolving debt and keep term insurance + family health coverage up to date.",
        tag: "Protection",
        color: "#FB7185"
      }
    ];

    if (question && question.trim().length > 0) {
      const q = question.toLowerCase();
      let customAnswer = "";

      if (q.includes("stock") || q.includes("share") || q.includes("nifty") || q.includes("market")) {
        customAnswer = "Market momentum indicates positive strength in Banking & IT sectors. Focus on fundamentally strong bluechips with PE under 25 and ROCE > 15%. Keep F&O positions strictly risk-hedged.";
      } else if (q.includes("tax") || q.includes("save") || q.includes("80c") || q.includes("80d")) {
        customAnswer = "Maximize Section 80C limit (₹1.5 Lakh via ELSS/PPF/EPF) and Section 80D for family medical insurance (₹25,000 - ₹50,000 for parents) to optimize total family taxable income.";
      } else if (q.includes("child") || q.includes("education") || q.includes("goal")) {
        customAnswer = "For goals > 5 years out, deploy funds into a combination of Nifty 50 Index Funds (60%), Midcap Funds (20%), and Sovereign Gold Bonds (20%).";
      } else {
        customAnswer = `Based on your current family profile (₹${total.toLocaleString('en-IN')} total net wealth), maintain a disciplined 70:30 long-term compounding vs liquid safety approach.`;
      }

      recommendations.unshift({
        title: `AI Response: "${question}"`,
        desc: customAnswer,
        tag: "Custom Query",
        color: "#E5C378"
      });
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      insights: recommendations
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to process advisor request"
    }, { status: 500 });
  }
}
