import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Trade } from "@/types/trade";

interface TradeActionsProps {
  trade: Trade;
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
}

export const TradeActions = ({ trade, onEdit, onDelete }: TradeActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(trade)}
      >
        <Pencil className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(trade.id)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};