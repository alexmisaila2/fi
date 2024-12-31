import { Card } from "@/components/ui/card";
import { useTradesStore } from "@/store/useTradesStore";
import { useMemo } from "react";

export const Stats = () => {
  const trades = useTradesStore((state) => state.trades);
  
  const stats = useMemo(() => {
    const totalTrades = trades.length;
    if (totalTrades === 0) {
      return {
        totalPL: 0,
        winRate: 0,
        totalTrades: 0,
        rulesFollowedRate: 0,
      };
    }

    const totalPL = trades.reduce((sum, trade) => sum + trade.profit_loss, 0);
    const winningTrades = trades.filter((trade) => trade.profit_loss > 0).length;
    const winRate = (winningTrades / totalTrades) * 100;
    const rulesFollowed = trades.filter((trade) => trade.rules_followed).length;
    const rulesFollowedRate = (rulesFollowed / totalTrades) * 100;

    return {
      totalPL,
      winRate,
      totalTrades,
      rulesFollowedRate,
    };
  }, [trades]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Total P/L</h3>
        <p className={`text-2xl font-bold ${stats.totalPL >= 0 ? 'text-profit' : 'text-loss'}`}>
          {stats.totalPL >= 0 ? '+' : ''}{stats.totalPL.toFixed(2)}
        </p>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Win Rate</h3>
        <p className="text-2xl font-bold">
          {stats.winRate.toFixed(1)}%
        </p>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Trades</h3>
        <p className="text-2xl font-bold">
          {stats.totalTrades}
        </p>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Rules Followed</h3>
        <p className="text-2xl font-bold">
          {stats.rulesFollowedRate.toFixed(1)}%
        </p>
      </Card>
    </div>
  );
};