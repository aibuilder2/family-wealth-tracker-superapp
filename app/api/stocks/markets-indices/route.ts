import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const INDICES_DATABASE = [
  { id: 'nifty50', name: 'NIFTY 50', category: 'Broad Market', value: 24852.30, change: 142.60, changePct: 0.58, desc: 'India benchmark top 50 large-cap bluechip companies on NSE' },
  { id: 'sensex', name: 'BSE SENSEX', category: 'Broad Market', value: 81332.72, change: 446.12, changePct: 0.55, desc: '30 premier well-established companies listed on BSE' },
  { id: 'niftynext50', name: 'NIFTY NEXT 50', category: 'Broad Market', value: 71420.50, change: 320.15, changePct: 0.45, desc: 'Next 50 liquid large-cap potential bluechips' },
  { id: 'niftymidcap100', name: 'NIFTY MIDCAP 100', category: 'Broad Market', value: 58210.80, change: 410.90, changePct: 0.71, desc: 'Top 100 mid-sized high-growth companies' },
  { id: 'niftysmallcap100', name: 'NIFTY SMALLCAP 100', category: 'Broad Market', value: 18940.25, change: 185.30, changePct: 0.99, desc: 'Top 100 small-cap emerging businesses' },
  { id: 'bse500', name: 'BSE 500', category: 'Broad Market', value: 37450.60, change: 215.40, changePct: 0.58, desc: 'Top 500 listed companies representing 93% market cap' },
  { id: 'indiavix', name: 'INDIA VIX', category: 'Broad Market', value: 12.84, change: -0.42, changePct: -3.17, desc: 'Volatility Index - Lower VIX indicates bullish market confidence' },

  { id: 'niftybank', name: 'NIFTY BANK', category: 'Sectoral', value: 51240.60, change: 380.40, changePct: 0.75, desc: '12 most capitalized banking stocks (HDFC, ICICI, SBI, Axis)' },
  { id: 'niftyit', name: 'NIFTY IT', category: 'Sectoral', value: 41890.15, change: 520.80, changePct: 1.26, desc: 'Top technology leaders (TCS, Infosys, HCLTech, Wipro)' },
  { id: 'niftyauto', name: 'NIFTY AUTO', category: 'Sectoral', value: 25480.90, change: 210.50, changePct: 0.83, desc: 'Automobile manufacturers (Tata Motors, M&M, Maruti)' },
  { id: 'niftypharma', name: 'NIFTY PHARMA', category: 'Sectoral', value: 22610.40, change: 115.20, changePct: 0.51, desc: 'Pharmaceutical & Healthcare leaders (Sun Pharma, Dr Reddy)' },
  { id: 'niftyfmcg', name: 'NIFTY FMCG', category: 'Sectoral', value: 63120.30, change: -85.60, changePct: -0.14, desc: 'Fast-Moving Consumer Goods (ITC, HUL, Nestlé)' },
  { id: 'niftymetal', name: 'NIFTY METAL', category: 'Sectoral', value: 9240.75, change: 145.20, changePct: 1.60, desc: 'Steel, Aluminum & Mining companies (Tata Steel, JSW)' },
  { id: 'niftyenergy', name: 'NIFTY ENERGY', category: 'Sectoral', value: 39850.10, change: 280.90, changePct: 0.71, desc: 'Oil, Gas & Power companies (Reliance, NTPC, ONGC)' },

  { id: 'giftnifty', name: 'GIFT NIFTY', category: 'Global', value: 24910.00, change: 80.00, changePct: 0.32, desc: 'Live early morning trend barometer traded on NSE IX' },
  { id: 'sp500', name: 'S&P 500 (US)', category: 'Global', value: 5648.40, change: 35.20, changePct: 0.63, desc: 'United States top 500 large cap benchmark' },
  { id: 'nasdaq', name: 'NASDAQ 100', category: 'Global', value: 19680.15, change: 180.50, changePct: 0.93, desc: 'US Tech giant companies (Apple, Nvidia, Microsoft)' },
  { id: 'dowjones', name: 'DOW JONES', category: 'Global', value: 41250.50, change: 228.30, changePct: 0.56, desc: 'Wall Street Industrial Index' }
];

const STOCKS_CONSTITUENTS_MAP: Record<string, any[]> = {
  'NIFTY 50': [
    { symbol: 'RELIANCE', company_name: 'Reliance Industries Ltd', sector: 'Energy & Oil', price: 2984.50, change: 32.10, changePct: 1.09, pe: 28.4, market_cap: '20.1 Lakh Cr', high52: 3217.90, low52: 2220.30 },
    { symbol: 'HDFCBANK', company_name: 'HDFC Bank Ltd', sector: 'Banking', price: 1642.80, change: 14.50, changePct: 0.89, pe: 18.2, market_cap: '12.5 Lakh Cr', high52: 1794.00, low52: 1363.55 },
    { symbol: 'TCS', company_name: 'Tata Consultancy Services', sector: 'IT Services', price: 4420.00, change: 64.20, changePct: 1.47, pe: 31.8, market_cap: '15.9 Lakh Cr', high52: 4585.90, low52: 3313.00 },
    { symbol: 'ICICIBANK', company_name: 'ICICI Bank Ltd', sector: 'Banking', price: 1215.30, change: 11.20, changePct: 0.93, pe: 17.6, market_cap: '8.5 Lakh Cr', high52: 1257.80, low52: 912.45 },
    { symbol: 'BHARTIARTL', company_name: 'Bharti Airtel Ltd', sector: 'Telecom', price: 1548.90, change: 18.40, changePct: 1.20, pe: 54.2, market_cap: '8.8 Lakh Cr', high52: 1588.00, low52: 865.00 },
    { symbol: 'INFY', company_name: 'Infosys Ltd', sector: 'IT Services', price: 1892.40, change: 25.60, changePct: 1.37, pe: 27.9, market_cap: '7.8 Lakh Cr', high52: 1940.00, low52: 1358.35 },
    { symbol: 'SBIN', company_name: 'State Bank of India', sector: 'Banking', price: 812.60, change: 7.80, changePct: 0.97, pe: 10.4, market_cap: '7.2 Lakh Cr', high52: 912.10, low52: 543.15 },
    { symbol: 'ITC', company_name: 'ITC Ltd', sector: 'FMCG', price: 504.20, change: -1.80, changePct: -0.36, pe: 29.5, market_cap: '6.3 Lakh Cr', high52: 518.00, low52: 399.30 },
    { symbol: 'LT', company_name: 'Larsen & Toubro Ltd', sector: 'Infrastructure', price: 3620.50, change: 42.10, changePct: 1.18, pe: 33.1, market_cap: '4.9 Lakh Cr', high52: 3919.90, low52: 2855.00 },
    { symbol: 'TATAMOTORS', company_name: 'Tata Motors Ltd', sector: 'Automobile', price: 1068.70, change: 19.30, changePct: 1.84, pe: 11.5, market_cap: '3.9 Lakh Cr', high52: 1179.05, low52: 593.50 },
    { symbol: 'M&M', company_name: 'Mahindra & Mahindra Ltd', sector: 'Automobile', price: 2780.40, change: 35.80, changePct: 1.30, pe: 31.2, market_cap: '3.4 Lakh Cr', high52: 3013.90, low52: 1464.00 },
    { symbol: 'SUNPHARMA', company_name: 'Sun Pharmaceutical Industries', sector: 'Pharma', price: 1812.30, change: 14.20, changePct: 0.79, pe: 38.6, market_cap: '4.3 Lakh Cr', high52: 1840.00, low52: 1087.00 },
    { symbol: 'TATASTEEL', company_name: 'Tata Steel Ltd', sector: 'Metals & Mining', price: 154.60, change: 2.80, changePct: 1.84, pe: 42.1, market_cap: '1.9 Lakh Cr', high52: 184.60, low52: 114.25 },
    { symbol: 'NTPC', company_name: 'NTPC Ltd', sector: 'Energy & Power', price: 412.80, change: 5.40, changePct: 1.33, pe: 18.7, market_cap: '4.0 Lakh Cr', high52: 428.00, low52: 231.00 },
    { symbol: 'HINDUNILVR', company_name: 'Hindustan Unilever Ltd', sector: 'FMCG', price: 2715.00, change: -6.50, changePct: -0.24, pe: 58.2, market_cap: '6.3 Lakh Cr', high52: 2844.00, low52: 2172.00 }
  ],
  'BSE SENSEX': [
    { symbol: 'RELIANCE', company_name: 'Reliance Industries Ltd', sector: 'Energy & Oil', price: 2984.50, change: 32.10, changePct: 1.09, pe: 28.4, market_cap: '20.1 Lakh Cr', high52: 3217.90, low52: 2220.30 },
    { symbol: 'HDFCBANK', company_name: 'HDFC Bank Ltd', sector: 'Banking', price: 1642.80, change: 14.50, changePct: 0.89, pe: 18.2, market_cap: '12.5 Lakh Cr', high52: 1794.00, low52: 1363.55 },
    { symbol: 'TCS', company_name: 'Tata Consultancy Services', sector: 'IT Services', price: 4420.00, change: 64.20, changePct: 1.47, pe: 31.8, market_cap: '15.9 Lakh Cr', high52: 4585.90, low52: 3313.00 },
    { symbol: 'ICICIBANK', company_name: 'ICICI Bank Ltd', sector: 'Banking', price: 1215.30, change: 11.20, changePct: 0.93, pe: 17.6, market_cap: '8.5 Lakh Cr', high52: 1257.80, low52: 912.45 },
    { symbol: 'BHARTIARTL', company_name: 'Bharti Airtel Ltd', sector: 'Telecom', price: 1548.90, change: 18.40, changePct: 1.20, pe: 54.2, market_cap: '8.8 Lakh Cr', high52: 1588.00, low52: 865.00 },
    { symbol: 'INFY', company_name: 'Infosys Ltd', sector: 'IT Services', price: 1892.40, change: 25.60, changePct: 1.37, pe: 27.9, market_cap: '7.8 Lakh Cr', high52: 1940.00, low52: 1358.35 },
    { symbol: 'SBIN', company_name: 'State Bank of India', sector: 'Banking', price: 812.60, change: 7.80, changePct: 0.97, pe: 10.4, market_cap: '7.2 Lakh Cr', high52: 912.10, low52: 543.15 },
    { symbol: 'ITC', company_name: 'ITC Ltd', sector: 'FMCG', price: 504.20, change: -1.80, changePct: -0.36, pe: 29.5, market_cap: '6.3 Lakh Cr', high52: 518.00, low52: 399.30 },
    { symbol: 'LT', company_name: 'Larsen & Toubro Ltd', sector: 'Infrastructure', price: 3620.50, change: 42.10, changePct: 1.18, pe: 33.1, market_cap: '4.9 Lakh Cr', high52: 3919.90, low52: 2855.00 },
    { symbol: 'MARUTI', company_name: 'Maruti Suzuki India Ltd', sector: 'Automobile', price: 12420.00, change: 110.00, changePct: 0.89, pe: 28.5, market_cap: '3.9 Lakh Cr', high52: 13076.00, low52: 9250.00 }
  ],
  'NIFTY BANK': [
    { symbol: 'HDFCBANK', company_name: 'HDFC Bank Ltd', sector: 'Banking', price: 1642.80, change: 14.50, changePct: 0.89, pe: 18.2, market_cap: '12.5 Lakh Cr', high52: 1794.00, low52: 1363.55 },
    { symbol: 'ICICIBANK', company_name: 'ICICI Bank Ltd', sector: 'Banking', price: 1215.30, change: 11.20, changePct: 0.93, pe: 17.6, market_cap: '8.5 Lakh Cr', high52: 1257.80, low52: 912.45 },
    { symbol: 'SBIN', company_name: 'State Bank of India', sector: 'Banking', price: 812.60, change: 7.80, changePct: 0.97, pe: 10.4, market_cap: '7.2 Lakh Cr', high52: 912.10, low52: 543.15 },
    { symbol: 'KOTAKBANK', company_name: 'Kotak Mahindra Bank Ltd', sector: 'Banking', price: 1782.40, change: 8.90, changePct: 0.50, pe: 21.4, market_cap: '3.5 Lakh Cr', high52: 1932.00, low52: 1544.15 },
    { symbol: 'AXISBANK', company_name: 'Axis Bank Ltd', sector: 'Banking', price: 1178.50, change: 12.30, changePct: 1.05, pe: 14.8, market_cap: '3.6 Lakh Cr', high52: 1339.65, low52: 968.00 },
    { symbol: 'INDUSINDBK', company_name: 'IndusInd Bank Ltd', sector: 'Banking', price: 1450.20, change: 10.40, changePct: 0.72, pe: 12.6, market_cap: '1.1 Lakh Cr', high52: 1694.00, low52: 1331.00 },
    { symbol: 'BANKBARODA', company_name: 'Bank of Baroda', sector: 'Banking', price: 248.60, change: 3.20, changePct: 1.30, pe: 6.8, market_cap: '1.3 Lakh Cr', high52: 298.40, low52: 189.00 },
    { symbol: 'PNB', company_name: 'Punjab National Bank', sector: 'Banking', price: 112.40, change: 1.60, changePct: 1.44, pe: 8.9, market_cap: '1.2 Lakh Cr', high52: 142.90, low52: 67.50 }
  ],
  'NIFTY IT': [
    { symbol: 'TCS', company_name: 'Tata Consultancy Services', sector: 'IT Services', price: 4420.00, change: 64.20, changePct: 1.47, pe: 31.8, market_cap: '15.9 Lakh Cr', high52: 4585.90, low52: 3313.00 },
    { symbol: 'INFY', company_name: 'Infosys Ltd', sector: 'IT Services', price: 1892.40, change: 25.60, changePct: 1.37, pe: 27.9, market_cap: '7.8 Lakh Cr', high52: 1940.00, low52: 1358.35 },
    { symbol: 'HCLTECH', company_name: 'HCL Technologies Ltd', sector: 'IT Services', price: 1765.80, change: 21.30, changePct: 1.22, pe: 29.1, market_cap: '4.8 Lakh Cr', high52: 1820.00, low52: 1180.00 },
    { symbol: 'WIPRO', company_name: 'Wipro Ltd', sector: 'IT Services', price: 532.40, change: 6.80, changePct: 1.29, pe: 23.4, market_cap: '2.8 Lakh Cr', high52: 564.00, low52: 375.00 },
    { symbol: 'TECHM', company_name: 'Tech Mahindra Ltd', sector: 'IT Services', price: 1580.90, change: 24.10, changePct: 1.55, pe: 36.2, market_cap: '1.5 Lakh Cr', high52: 1640.00, low52: 1082.00 },
    { symbol: 'LTIM', company_name: 'LTIMindtree Ltd', sector: 'IT Services', price: 5920.00, change: 82.50, changePct: 1.41, pe: 38.5, market_cap: '1.7 Lakh Cr', high52: 6442.00, low52: 4510.00 }
  ]
};

const FNO_WATCHLIST_DATA = [
  {
    symbol: 'NIFTY',
    spot_price: 24852.30,
    pcr: 1.18,
    sentiment: 'BULLISH',
    support_strike: 24500,
    resistance_strike: 25000,
    max_pain: 24700,
    total_ce_oi: 2458000,
    total_pe_oi: 2895000
  },
  {
    symbol: 'BANKNIFTY',
    spot_price: 51240.60,
    pcr: 0.94,
    sentiment: 'NEUTRAL',
    support_strike: 50500,
    resistance_strike: 52000,
    max_pain: 51000,
    total_ce_oi: 1845000,
    total_pe_oi: 1734000
  },
  {
    symbol: 'FINNIFTY',
    spot_price: 23410.20,
    pcr: 1.05,
    sentiment: 'BULLISH',
    support_strike: 23000,
    resistance_strike: 23800,
    max_pain: 23300,
    total_ce_oi: 980000,
    total_pe_oi: 1029000
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'all_indices';
  const indexName = searchParams.get('index') || 'NIFTY 50';

  if (type === 'fno') {
    return NextResponse.json({ success: true, data: FNO_WATCHLIST_DATA });
  }

  if (type === 'constituents') {
    const list = (STOCKS_CONSTITUENTS_MAP as any)[indexName] || STOCKS_CONSTITUENTS_MAP['NIFTY 50'];
    return NextResponse.json({
      success: true,
      index: indexName,
      count: list.length,
      constituents: list
    });
  }

  return NextResponse.json({
    success: true,
    market_status: {
      is_open: true,
      status_text: 'NSE LIVE (Market Active)',
      current_time: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    },
    all: INDICES_DATABASE,
    indian: INDICES_DATABASE.filter(i => i.category !== 'Global'),
    global: INDICES_DATABASE.filter(i => i.category === 'Global')
  });
}
