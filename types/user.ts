export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Subscription {
  userId: string;
  plan: "free" | "pro";
  status: "active" | "expired" | "cancelled";
  startDate: string;
  endDate: string;
  scansUsedToday: number;
  scansLimit: number;
}

export interface UserPreferences {
  userId: string;
  defaultWatchlist: string[];
  theme: "light" | "dark";
  notifications: boolean;
  defaultIndices: string[];
}

export interface WatchlistItem {
  userId: string;
  symbol: string;
  addedAt: string;
  notes?: string;
}
