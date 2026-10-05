export type MarketCategory =
  | 'overview'
  | 'indices'
  | 'us_stocks'
  | 'world_stocks'
  | 'crypto'
  | 'futures'
  | 'forex'
  | 'bonds'
  | 'etfs'
  | 'economy';

export type StockFilter = 'most_active' | 'gainers' | 'losers' | 'volatility';

export type RegionFilter = 'global' | 'americas' | 'europe' | 'asia_pacific';

export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  category: MarketCategory;
  subCategory?: StockFilter;
  region?: 'americas' | 'europe' | 'asia_pacific';
  badge?: {
    text: string;
    bg: string;
    textColor?: string;
  };
  flag?: string;
  volume?: string;
  sparkline: number[];
  open: number;
  high: number;
  low: number;
  prevClose: number;
  peRatio?: number;
  marketCap?: string;
  week52High?: number;
  week52Low?: number;
  description?: string;
  currency?: string;
  flashState?: 'up' | 'down' | null;
}

export interface EconomicIndicator {
  id: string;
  name: string;
  country: string;
  flag: string;
  actual: string;
  forecast: string;
  previous: string;
  impact: 'high' | 'medium' | 'low';
  period: string;
  date: string;
}
