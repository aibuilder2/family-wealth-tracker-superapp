export type FilterOperator = "gt" | "lt" | "gte" | "lte" | "eq" | "between" | "in";

export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: number | string | boolean | string[] | number[];
  value2?: number; // Used mainly for 'between' operator
}

export interface ScreenerFilter {
  id: string;
  name: string;
  description?: string;
  conditions: FilterCondition[];
  logic: "AND" | "OR";
  createdAt: string;
}

export interface ScreenerResult {
  symbol: string;
  companyName: string;
  currentPrice: number;
  change: number;
  changePct: number;
  volume: number;
  marketCap: number;
  matchedConditions: string[];
}

export interface SavedScreen extends Omit<ScreenerFilter, "conditions" | "logic"> {
  userId: string;
  filter: ScreenerFilter;
  lastRunAt?: string;
  resultCount?: number;
}

export interface ScreenerField {
  key: string;
  label: string;
  category: "technical" | "fundamental" | "volume" | "price";
  dataType: "number" | "percentage" | "boolean";
}
