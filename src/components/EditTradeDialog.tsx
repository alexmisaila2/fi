import { Trade, Market, Setup } from "@/types/trade";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface EditTradeDialogProps {
  trade: Trade | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (trade: Trade) => void;
  onChange: (trade: Trade) => void;
}

export const EditTradeDialog = ({
  trade,
  open,
  onOpenChange,
  onSave,
  onChange,
}: EditTradeDialogProps) => {
  if (!trade) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Trade</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={trade.date}
              onChange={(e) =>
                onChange({
                  ...trade,
                  date: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Market</Label>
            <Select
              value={trade.market}
              onValueChange={(value: Market) =>
                onChange({
                  ...trade,
                  market: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="XAUUSD">XAUUSD</SelectItem>
                <SelectItem value="USDJPY">USDJPY</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Setup</Label>
            <Select
              value={trade.setup}
              onValueChange={(value: Setup) =>
                onChange({
                  ...trade,
                  setup: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SA1">SA1</SelectItem>
                <SelectItem value="Fibs">Fibs</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Profit/Loss</Label>
            <Input
              type="number"
              step="0.01"
              value={trade.profit_loss}
              onChange={(e) =>
                onChange({
                  ...trade,
                  profit_loss: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Rules Followed</Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={trade.rules_followed}
                onCheckedChange={(checked) =>
                  onChange({
                    ...trade,
                    rules_followed: checked,
                  })
                }
              />
              <Label>{trade.rules_followed ? 'Yes' : 'No'}</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={trade.notes || ''}
              onChange={(e) =>
                onChange({
                  ...trade,
                  notes: e.target.value,
                })
              }
              className="min-h-[100px]"
            />
          </div>
          <Button onClick={() => onSave(trade)} className="w-full">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
