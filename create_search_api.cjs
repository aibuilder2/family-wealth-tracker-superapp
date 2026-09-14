const fs = require('fs');
const path = require('path');

const searchApiCode = `import { NextResponse } from 'next/server';

// Comprehensive database of top NSE/BSE Stocks, ETFs and Popular Mutual Funds
const POPULAR_ASSETS = [
  // Top NSE Stocks
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', type: 'shares', price: 2985.40, exchange: 'NSE' },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd', type: 'shares', price: 4210.80, exchange: 'NSE' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', type: 'shares', price: 975.20, exchange: 'NSE' },
  { symbol: 'TATASTEEL', name: 'Tata Steel Ltd', type: 'shares', price: 153.40, exchange: 'NSE' },
  { symbol: 'TATAPOWER', name: 'Tata Power Company Ltd', type: 'shares', price: 412.60, exchange: 'NSE' },
  { symbol: 'TATACHEM', name: 'Tata Chemicals Ltd', type: 'shares', price: 1045.00, exchange: 'NSE' },
  { symbol: 'TATAELXSI', name: 'Tata Elxsi Ltd', type: 'shares', price: 7120.50, exchange: 'NSE' },
  { symbol: 'TATACONSUM', name: 'Tata Consumer Products Ltd', type: 'shares', price: 1160.00, exchange: 'NSE' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', type: 'shares', price: 1640.50, exchange: 'NSE' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', type: 'shares', price: 1215.30, exchange: 'NSE' },
  { symbol: 'SBIN', name: 'State Bank of India', type: 'shares', price: 815.70, exchange: 'NSE' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd', type: 'shares', price: 1780.00, exchange: 'NSE' },
  { symbol: 'INFY', name: 'Infosys Ltd', type: 'shares', price: 1820.00, exchange: 'NSE' },
  { symbol: 'WIPRO', name: 'Wipro Ltd', type: 'shares', price: 520.40, exchange: 'NSE' },
  { symbol: 'ITC', name: 'ITC Ltd', type: 'shares', price: 485.60, exchange: 'NSE' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', type: 'shares', price: 2710.00, exchange: 'NSE' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', type: 'shares', price: 1510.20, exchange: 'NSE' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd', type: 'shares', price: 7150.00, exchange: 'NSE' },
  { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Ltd', type: 'shares', price: 1840.00, exchange: 'NSE' },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd', type: 'shares', price: 3580.00, exchange: 'NSE' },
  { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd', type: 'shares', price: 2980.00, exchange: 'NSE' },
  { symbol: 'ADANIPORTS', name: 'Adani Ports & SEZ Ltd', type: 'shares', price: 1440.00, exchange: 'NSE' },
  { symbol: 'ZOMATO', name: 'Zomato Ltd', type: 'shares', price: 260.50, exchange: 'NSE' },
  { symbol: 'PAYTM', name: 'One97 Communications Ltd (Paytm)', type: 'shares', price: 650.00, exchange: 'NSE' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd', type: 'shares', price: 12450.00, exchange: 'NSE' },
  { symbol: 'MAHINDCIE', name: 'Mahindra & Mahindra Ltd', type: 'shares', price: 2740.00, exchange: 'NSE' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries', type: 'shares', price: 1810.00, exchange: 'NSE' },
  { symbol: 'NTPC', name: 'NTPC Ltd', type: 'shares', price: 395.00, exchange: 'NSE' },
  { symbol: 'POWERGRID', name: 'Power Grid Corporation of India', type: 'shares', price: 330.00, exchange: 'NSE' },
  { symbol: 'COALINDIA', name: 'Coal India Ltd', type: 'shares', price: 490.00, exchange: 'NSE' },

  // ETFs
  { symbol: 'GOLDBEES', name: 'Nippon India Gold BeES ETF', type: 'gold', price: 74.50, exchange: 'NSE' },
  { symbol: 'SILVERBEES', name: 'Nippon India Silver BeES ETF', type: 'shares', price: 86.20, exchange: 'NSE' },
  { symbol: 'NIFTYBEES', name: 'Nippon India Nifty 50 BeES ETF', type: 'shares', price: 272.30, exchange: 'NSE' },
  { symbol: 'BANKBEES', name: 'Nippon India Bank BeES ETF', type: 'shares', price: 540.00, exchange: 'NSE' },

  // Top Mutual Funds (AMFI Scheme Codes & NAVs)
  { symbol: '122639', name: 'Parag Parikh Flexi Cap Fund - Direct Plan - Growth', type: 'mutual_funds', price: 89.57, exchange: 'AMFI' },
  { symbol: '120828', name: 'Quant Small Cap Fund - Direct Plan - Growth', type: 'mutual_funds', price: 265.12, exchange: 'AMFI' },
  { symbol: '119598', name: 'SBI Bluechip Fund - Direct Plan - Growth', type: 'mutual_funds', price: 94.30, exchange: 'AMFI' },
  { symbol: '118989', name: 'HDFC Mid-Cap Opportunities Fund - Direct - Growth', type: 'mutual_funds', price: 172.40, exchange: 'AMFI' },
  { symbol: '120503', name: 'Nippon India Small Cap Fund - Direct Plan - Growth', type: 'mutual_funds', price: 168.20, exchange: 'AMFI' },
  { symbol: '118834', name: 'Mirae Asset Large Cap Fund - Direct Plan - Growth', type: 'mutual_funds', price: 114.80, exchange: 'AMFI' },
  { symbol: '120716', name: 'Tata Digital India Fund - Direct Plan - Growth', type: 'mutual_funds', price: 52.60, exchange: 'AMFI' },
  { symbol: '119775', name: 'ICICI Prudential Bharat 22 FOF - Direct - Growth', type: 'mutual_funds', price: 34.20, exchange: 'AMFI' },
  { symbol: '119612', name: 'SBI Gold Fund - Direct Plan - Growth', type: 'mutual_funds', price: 26.40, exchange: 'AMFI' }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase()?.trim() || '';

  if (!query) {
    return NextResponse.json({ results: POPULAR_ASSETS.slice(0, 10) });
  }

  // Filter local catalog
  const filtered = POPULAR_ASSETS.filter(
    a => a.symbol.toLowerCase().includes(query) || a.name.toLowerCase().includes(query)
  );

  // If query is for mutual funds, also attempt dynamic AMFI search
  if (filtered.length < 3 && query.length >= 3) {
    try {
      const mfSearchRes = await fetch(\`https://api.mfapi.in/mf/search?q=\${encodeURIComponent(query)}\`, {
        next: { revalidate: 3600 }
      });
      if (mfSearchRes.ok) {
        const data = await mfSearchRes.json();
        if (Array.isArray(data)) {
          const dynamicMFs = data.slice(0, 5).map((d: any) => ({
            symbol: d.schemeCode?.toString() || 'MF',
            name: d.schemeName,
            type: 'mutual_funds',
            price: 50.00, // Placeholder until detailed NAV lookup
            exchange: 'AMFI'
          }));
          return NextResponse.json({ results: [...filtered, ...dynamicMFs] });
        }
      }
    } catch (e) {
      console.log('Dynamic MF search fallback');
    }
  }

  return NextResponse.json({ results: filtered });
}
`;

fs.mkdirSync('app/api/search-assets', { recursive: true });
fs.writeFileSync('app/api/search-assets/route.ts', searchApiCode.trim() + '\n', 'utf8');
console.log('Created app/api/search-assets/route.ts');
