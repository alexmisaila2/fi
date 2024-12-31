import { useState, useRef } from "react";
import { useTradesStore } from "@/store/useTradesStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trade } from "@/types/trade";
import { Download, Upload, Calendar } from "lucide-react";
import { toast } from "sonner";
import { TradeActions } from "./TradeActions";
import { EditTradeDialog } from "./EditTradeDialog";
import { exportToCsv, importCsv } from "@/utils/csvUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

const ITEMS_PER_PAGE = 10;

export const TradeHistory = () => {
  const trades = useTradesStore((state) => state.trades);
  const deleteTrade = useTradesStore((state) => state.deleteTrade);
  const editTrade = useTradesStore((state) => state.editTrade);
  const addTrade = useTradesStore((state) => state.addTrade);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'won' | 'lost'>('all');
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredTrades = trades.filter((trade) => {
    if (filter === 'won') return trade.profit_loss > 0;
    if (filter === 'lost') return trade.profit_loss < 0;
    return true;
  });

  const totalPages = Math.ceil(filteredTrades.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedTrades = filteredTrades.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleDelete = (id: string) => {
    deleteTrade(id);
    toast.success("Trade deleted successfully");
  };

  const handleEdit = (trade: Trade) => {
    setEditingTrade(trade);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (updatedTrade: Trade) => {
    editTrade(updatedTrade.id, updatedTrade);
    setEditingTrade(null);
    setIsEditDialogOpen(false);
    toast.success("Trade updated successfully");
  };

  const handleExport = () => {
    const tradesToExport = trades.filter(trade => {
      if (!dateRange.from || !dateRange.to) return true;
      const tradeDate = new Date(trade.date);
      return tradeDate >= dateRange.from && tradeDate <= dateRange.to;
    });
    
    if (tradesToExport.length === 0) {
      toast.error("No trades found in the selected date range");
      return;
    }

    exportToCsv(tradesToExport);
    setIsExportDialogOpen(false);
    setDateRange({ from: undefined, to: undefined });
    toast.success(`Exported ${tradesToExport.length} trades`);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedTrades = await importCsv(file);
      importedTrades.forEach(trade => addTrade(trade));
      toast.success(`Successfully imported ${importedTrades.length} trades`);
    } catch (error) {
      toast.error("Failed to import trades");
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={(value: 'all' | 'won' | 'lost') => setFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter trades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trades</SelectItem>
              <SelectItem value="won">Won Trades</SelectItem>
              <SelectItem value="lost">Lost Trades</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select Date Range for Export</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <CalendarComponent
                    mode="range"
                    selected={{
                      from: dateRange.from,
                      to: dateRange.to,
                    }}
                    onSelect={(range: { from?: Date; to?: Date }) => 
                      setDateRange({ from: range?.from, to: range?.to })
                    }
                    numberOfMonths={2}
                    className="rounded-md border"
                  />
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleExport}>
                    Export
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={handleImportClick} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileImport}
            accept=".csv"
            className="hidden"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Market</TableHead>
              <TableHead>Setup</TableHead>
              <TableHead>Profit/Loss</TableHead>
              <TableHead>Rules Followed</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedTrades.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell>{trade.date}</TableCell>
                <TableCell>{trade.market}</TableCell>
                <TableCell>{trade.setup}</TableCell>
                <TableCell className={trade.profit_loss >= 0 ? 'text-profit' : 'text-loss'}>
                  {trade.profit_loss >= 0 ? '+' : ''}{trade.profit_loss.toFixed(2)}
                </TableCell>
                <TableCell>{trade.rules_followed ? 'Yes' : 'No'}</TableCell>
                <TableCell className="max-w-[200px] truncate">{trade.notes}</TableCell>
                <TableCell className="text-right">
                  <TradeActions
                    trade={trade}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <EditTradeDialog
        trade={editingTrade}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveEdit}
        onChange={setEditingTrade}
      />
    </Card>
  );
};
