export interface PaperAccount {
  id: string;
  userId: string;
  virtualCash: number;
  paymentType: "free" | "paid";
  totalValue: number;
  totalPnl: number;
  totalPnlPct: number;
  isActive: boolean;
  startedAt: string;
}

export interface PaperTrade {
  id: string;
  accountId: string;
  symbol: string;
  tradeType: "buy" | "sell";
  quantity: number;
  price: number;
  tradedAt: string;
  status: "executed" | "pending" | "cancelled" | "failed";
}

export interface PaperHolding {
  symbol: string;
  companyName: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  currentValue: number;
  pnl: number;
  pnlPct: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  totalPnlPct: number;
  totalValue: number;
  tradesCount: number;
  joinedAt: string;
}
