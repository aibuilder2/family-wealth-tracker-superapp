export interface Stock {
  id: string;
  symbol: string;
  companyName: string;
  exchange: string;
  sector: string;
  marketCap: number;
  currentPrice: number;
  change: number;
  changePct: number;
  volume: number;
  week52High: number;
  week52Low: number;
  marketCapCategory: "Large Cap" | "Mid Cap" | "Small Cap" | "Micro Cap";
  indices: string[];
  isActive: boolean;
  logoUrl?: string;
}

export interface StockQuote {
  symbol: string;
  ltp: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  change: number;
  changePct: number;
  volume: number;
  upperCircuit: number;
  lowerCircuit: number;
  updatedAt: string;
}

export interface StockSearchResult extends Pick<Stock, "id" | "symbol" | "companyName" | "exchange" | "marketCapCategory" | "currentPrice"> {
  similarity: number;
}

export interface CorporateAction {
  type: "split" | "bonus" | "dividend" | "rights" | "merger";
  exDate: string;
  details: string;
  sourceUrl?: string;
}

export interface ManagementHistory {
  role: string;
  personName: string;
  fromDate: string;
  toDate: string | null;
}
