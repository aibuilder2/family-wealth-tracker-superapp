export interface Commodity {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  unit: string;
  exchange: "MCX" | "NCDEX" | "COMEX";
  category: "precious_metals" | "energy" | "agri" | "base_metals";
  updatedAt: string;
}

export interface GoldPrice {
  price24k: number;
  price22k: number;
  price18k: number;
  silverPrice: number;
  date: string;
  city: "Mumbai" | "Delhi" | "Chennai" | "Kolkata";
}

export interface CommodityHistory {
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
