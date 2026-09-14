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
  { id: 'niftypharma', name: 'NIFTY PHARMA', category: 'Sectoral', value: 22610.40, change: 115.20, changePct: 0.51, desc: 'Pharmaceutical and Healthcare leaders (Sun Pharma, Dr Reddy)' },
  { id: 'niftyfmcg', name: 'NIFTY FMCG', category: 'Sectoral', value: 63120.30, change: -85.60, changePct: -0.14, desc: 'Fast-Moving Consumer Goods (ITC, HUL, Nestle)' },
  { id: 'niftymetal', name: 'NIFTY METAL', category: 'Sectoral', value: 9240.75, change: 145.20, changePct: 1.60, desc: 'Steel, Aluminum and Mining companies (Tata Steel, JSW)' },
  { id: 'niftyenergy', name: 'NIFTY ENERGY', category: 'Sectoral', value: 39850.10, change: 280.90, changePct: 0.71, desc: 'Oil, Gas and Power companies (Reliance, NTPC, ONGC)' },

  { id: 'giftnifty', name: 'GIFT NIFTY', category: 'Global', value: 24910.00, change: 80.00, changePct: 0.32, desc: 'Live early morning trend barometer traded on NSE IX' },
  { id: 'sp500', name: 'S&P 500 (US)', category: 'Global', value: 5648.40, change: 35.20, changePct: 0.63, desc: 'United States top 500 large cap benchmark' },
  { id: 'nasdaq', name: 'NASDAQ 100', category: 'Global', value: 19680.15, change: 180.50, changePct: 0.93, desc: 'US Tech giant companies (Apple, Nvidia, Microsoft)' },
  { id: 'dowjones', name: 'DOW JONES', category: 'Global', value: 41250.50, change: 228.30, changePct: 0.56, desc: 'Wall Street Industrial Index' }
];

const STOCKS_CONSTITUENTS_MAP: Record<string, any[]> = {
  'NIFTY 50': [
    { symbol: 'RELIANCE', company_name: 'Reliance Industries Ltd', sector: 'Energy & Oil', price: 2984.50, change: 32.10, changePct: 1.09, pe: 28.4, market_cap: '20.1 Lakh Cr', high52: 3217.90, low52: 2220.30 },
    { symbol: 'TCS', company_name: 'Tata Consultancy Services', sector: 'IT Services', price: 4480.00, change: 65.40, changePct: 1.48, pe: 32.1, market_cap: '16.2 Lakh Cr', high52: 4565.00, low52: 3310.00 },
    { symbol: 'HDFCBANK', company_name: 'HDFC Bank Ltd', sector: 'Banking & Finance', price: 1642.80, change: 14.50, changePct: 0.89, pe: 19.8, market_cap: '12.5 Lakh Cr', high52: 1794.00, low52: 1363.55 },
    { symbol: 'INFY', company_name: 'Infosys Ltd', sector: 'IT Services', price: 1925.30, change: 28.70, changePct: 1.51, pe: 27.6, market_cap: '8.0 Lakh Cr', high52: 1975.00, low52: 1358.35 },
    { symbol: 'ICICIBANK', company_name: 'ICICI Bank Ltd', sector: 'Banking & Finance', price: 1210.40, change: 11.20, changePct: 0.93, pe: 18.4, market_cap: '8.5 Lakh Cr', high52: 1257.80, low52: 911.20 },
    { symbol: 'BHARTIARTL', company_name: 'Bharti Airtel Ltd', sector: 'Telecom', price: 1545.60, change: 21.30, changePct: 1.40, pe: 72.1, market_cap: '9.2 Lakh Cr', high52: 1590.00, low52: 865.00 },
    { symbol: 'SBIN', company_name: 'State Bank of India', sector: 'Banking & Finance', price: 812.90, change: 6.80, changePct: 0.84, pe: 10.9, market_cap: '7.2 Lakh Cr', high52: 912.00, low52: 543.15 },
    { symbol: 'ITC', company_name: 'ITC Ltd', sector: 'FMCG', price: 504.20, change: -1.80, changePct: -0.36, pe: 29.5, market_cap: '6.3 Lakh Cr', high52: 520.00, low52: 399.30 },
    { symbol: 'HINDUNILVR', company_name: 'Hindustan Unilever Ltd', sector: 'FMCG', price: 2780.00, change: -12.40, changePct: -0.44, pe: 64.2, market_cap: '6.5 Lakh Cr', high52: 2850.00, low52: 2170.00 },
    { symbol: 'LT', company_name: 'Larsen & Toubro Ltd', sector: 'Infrastructure', price: 3680.50, change: 45.00, changePct: 1.24, pe: 35.8, market_cap: '5.1 Lakh Cr', high52: 3919.00, low52: 2865.00 },
    { symbol: 'BAJFINANCE', company_name: 'Bajaj Finance Ltd', sector: 'Banking & Finance', price: 7350.00, change: 82.00, changePct: 1.13, pe: 31.2, market_cap: '4.5 Lakh Cr', high52: 8192.00, low52: 6350.00 },
    { symbol: 'TATAMOTORS', company_name: 'Tata Motors Ltd', sector: 'Automobile', price: 1075.40, change: 18.60, changePct: 1.76, pe: 11.5, market_cap: '3.9 Lakh Cr', high52: 1179.00, low52: 608.00 },
    { symbol: 'SUNPHARMA', company_name: 'Sun Pharmaceutical', sector: 'Pharma', price: 1820.00, change: 16.40, changePct: 0.91, pe: 41.5, market_cap: '4.3 Lakh Cr', high52: 1880.00, low52: 1080.00 },
    { symbol: 'MARUTI', company_name: 'Maruti Suzuki India', sector: 'Automobile', price: 12480.00, change: 140.00, changePct: 1.13, pe: 28.9, market_cap: '3.9 Lakh Cr', high52: 13680.00, low52: 9737.00 },
    { symbol: 'KOTAKBANK', company_name: 'Kotak Mahindra Bank', sector: 'Banking & Finance', price: 1810.00, change: 9.50, changePct: 0.53, pe: 20.1, market_cap: '3.6 Lakh Cr', high52: 1940.00, low52: 1543.00 }
  ],
  'BSE SENSEX': [
    { symbol: 'RELIANCE', company_name: 'Reliance Industries Ltd', sector: 'Energy & Oil', price: 2984.50, change: 32.10, changePct: 1.09, pe: 28.4, market_cap: '20.1 Lakh Cr', high52: 3217.90, low52: 2220.30 },
    { symbol: 'TCS', company_name: 'Tata Consultancy Services', sector: 'IT Services', price: 4480.00, change: 65.40, changePct: 1.48, pe: 32.1, market_cap: '16.2 Lakh Cr', high52: 4565.00, low52: 3310.00 },
    { symbol: 'HDFCBANK', company_name: 'HDFC Bank Ltd', sector: 'Banking & Finance', price: 1642.80, change: 14.50, changePct: 0.89, pe: 19.8, market_cap: '12.5 Lakh Cr', high52: 1794.00, low52: 1363.55 },
    { symbol: 'INFY', company_name: 'Infosys Ltd', sector: 'IT Services', price: 1925.30, change: 28.70, changePct: 1.51, pe: 27.6, market_cap: '8.0 Lakh Cr', high52: 1975.00, low52: 1358.35 },
    { symbol: 'ICICIBANK', company_name: 'ICICI Bank Ltd', sector: 'Banking & Finance', price: 1210.40, change: 11.20, changePct: 0.93, pe: 18.4, market_cap: '8.5 Lakh Cr', high52: 1257.80, low52: 911.20 },
    { symbol: 'SBIN', company_name: 'State Bank of India', sector: 'Banking & Finance', price: 812.90, change: 6.80, changePct: 0.84, pe: 10.9, market_cap: '7.2 Lakh Cr', high52: 912.00, low52: 543.15 }
  ],
  'NIFTY BANK': [
    { symbol: 'HDFCBANK', company_name: 'HDFC Bank Ltd', sector: 'Private Bank', price: 1642.80, change: 14.50, changePct: 0.89, pe: 19.8, market_cap: '12.5 Lakh Cr', high52: 1794.00, low52: 1363.55 },
    { symbol: 'ICICIBANK', company_name: 'ICICI Bank Ltd', sector: 'Private Bank', price: 1210.40, change: 11.20, changePct: 0.93, pe: 18.4, market_cap: '8.5 Lakh Cr', high52: 1257.80, low52: 911.20 },
    { symbol: 'SBIN', company_name: 'State Bank of India', sector: 'PSU Bank', price: 812.90, change: 6.80, changePct: 0.84, pe: 10.9, market_cap: '7.2 Lakh Cr', high52: 912.00, low52: 543.15 },
    { symbol: 'KOTAKBANK', company_name: 'Kotak Mahindra Bank', sector: 'Private Bank', price: 1810.00, change: 9.50, changePct: 0.53, pe: 20.1, market_cap: '3.6 Lakh Cr', high52: 1940.00, low52: 1543.00 },
    { symbol: 'AXISBANK', company_name: 'Axis Bank Ltd', sector: 'Private Bank', price: 1180.00, change: 12.40, changePct: 1.06, pe: 15.2, market_cap: '3.6 Lakh Cr', high52: 1339.00, low52: 933.00 },
    { symbol: 'INDUSINDBK', company_name: 'IndusInd Bank Ltd', sector: 'Private Bank', price: 1420.00, change: 8.50, changePct: 0.60, pe: 12.8, market_cap: '1.1 Lakh Cr', high52: 1694.00, low52: 1330.00 }
  ],
  'NIFTY IT': [
    { symbol: 'TCS', company_name: 'Tata Consultancy Services', sector: 'IT Services', price: 4480.00, change: 65.40, changePct: 1.48, pe: 32.1, market_cap: '16.2 Lakh Cr', high52: 4565.00, low52: 3310.00 },
    { symbol: 'INFY', company_name: 'Infosys Ltd', sector: 'IT Services', price: 1925.30, change: 28.70, changePct: 1.51, pe: 27.6, market_cap: '8.0 Lakh Cr', high52: 1975.00, low52: 1358.35 },
    { symbol: 'HCLTECH', company_name: 'HCL Technologies Ltd', sector: 'IT Services', price: 1780.00, change: 24.50, changePct: 1.39, pe: 28.9, market_cap: '4.8 Lakh Cr', high52: 1820.00, low52: 1175.00 },
    { symbol: 'WIPRO', company_name: 'Wipro Ltd', sector: 'IT Services', price: 530.00, change: 5.20, changePct: 0.99, pe: 24.1, market_cap: '2.7 Lakh Cr', high52: 564.00, low52: 375.00 },
    { symbol: 'LTIM', company_name: 'LTIMindtree Ltd', sector: 'IT Services', price: 5980.00, change: 78.00, changePct: 1.32, pe: 38.4, market_cap: '1.7 Lakh Cr', high52: 6440.00, low52: 4515.00 },
    { symbol: 'TECHM', company_name: 'Tech Mahindra Ltd', sector: 'IT Services', price: 1620.00, change: 22.00, changePct: 1.38, pe: 42.6, market_cap: '1.5 Lakh Cr', high52: 1680.00, low52: 1082.00 }
  ]
};

const FNO_WATCHLIST = [
  {
    symbol: "NIFTY 50",
    pcr: 1.18,
    sentiment: "BULLISH",
    support_strike: 24700,
    resistance_strike: 25000,
    max_call_oi: "25000 CE (1.42 Cr)",
    max_put_oi: "24700 PE (1.68 Cr)",
    spot_price: 24852.30
  },
  {
    symbol: "BANKNIFTY",
    pcr: 0.94,
    sentiment: "NEUTRAL",
    support_strike: 50800,
    resistance_strike: 51600,
    max_call_oi: "51500 CE (86.4 L)",
    max_put_oi: "51000 PE (82.1 L)",
    spot_price: 51240.60
  },
  {
    symbol: "FINNIFTY",
    pcr: 1.05,
    sentiment: "BULLISH",
    support_strike: 23200,
    resistance_strike: 23600,
    max_call_oi: "23500 CE (42.1 L)",
    max_put_oi: "23300 PE (48.3 L)",
    spot_price: 23410.50
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const index = searchParams.get('index') || 'NIFTY 50';

  if (type === 'fno') {
    return NextResponse.json(FNO_WATCHLIST);
  }

  if (type === 'constituents') {
    const list = STOCKS_CONSTITUENTS_MAP[index.toUpperCase()] || STOCKS_CONSTITUENTS_MAP['NIFTY 50'];
    return NextResponse.json({
      index,
      count: list.length,
      constituents: list
    });
  }

  return NextResponse.json({
    market_status: {
      is_open: true,
      status_text: "LIVE NSE / BSE SESSIONS",
      current_time: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    },
    all: INDICES_DATABASE,
    broad: INDICES_DATABASE.filter(i => i.category === 'Broad Market'),
    sectoral: INDICES_DATABASE.filter(i => i.category === 'Sectoral'),
    global: INDICES_DATABASE.filter(i => i.category === 'Global')
  });
}
