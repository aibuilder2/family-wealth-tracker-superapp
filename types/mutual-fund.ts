export type RiskLevel = "low" | "moderate" | "high";

export interface MutualFund {
  schemeCode: string;
  schemeName: string;
  fundHouse: string;
  category: string;
  subCategory: string;
  nav: number;
  aum: number;
  expenseRatio: number;
  returns1y: number;
  returns3y: number;
  returns5y: number;
  riskLevel: RiskLevel;
  minInvestment: number;
  exitLoad: string;
}

export interface MFHolding {
  schemeCode: string;
  stockSymbol: string;
  companyName: string;
  holdingPct: number;
  value: number;
}

export interface MFScreenerFilter {
  category?: string[];
  fundHouse?: string[];
  minReturns1y?: number;
  maxExpenseRatio?: number;
  riskLevel?: RiskLevel[];
  minAum?: number;
}

export interface MFComparison {
  schemes: MutualFund[];
  comparisonDate: string;
}
