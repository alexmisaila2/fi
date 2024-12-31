export type Market = 'XAUUSD' | 'USDJPY';
export type Setup = 'SA1' | 'Fibs';

export interface Trade {
  id: string;
  date: string;
  market: Market;
  setup: Setup;
  profit_loss: number;  // Changed from profitLoss
  rules_followed: boolean;  // Changed from rulesFollowed
  notes?: string;
  user_id?: string;  // Added to match database schema
}

export interface TradeStats {
  totalPL: number;
  winRate: number;
  totalTrades: number;
  rulesFollowedRate: number;
}