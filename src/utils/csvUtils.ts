import { Market, Setup, Trade } from "@/types/trade";

export const exportToCsv = (trades: Trade[]) => {
  const headers = ['Date', 'Market', 'Setup', 'Profit/Loss', 'Rules Followed', 'Notes'];
  
  // Create CSV content with proper cell separation
  const csvRows = [
    headers,
    ...trades.map((trade) => [
      trade.date,
      trade.market,
      trade.setup,
      trade.profit_loss.toString(),
      trade.rules_followed ? 'Yes' : 'No',
      trade.notes || ''
    ])
  ];

  // Convert to CSV format with proper cell separation
  const csvContent = csvRows
    .map(row => 
      row.map(cell => 
        `"${cell.replace(/"/g, '""')}"`
      ).join(',')
    )
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `trades_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

export const importCsv = async (file: File): Promise<Trade[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = text.split('\n').map(row => {
          // Split by comma but respect quoted values
          return row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)
            ?.map(cell => cell.replace(/^"(.*)"$/, '$1').replace(/""/g, '"')) || [];
        });
        
        // Remove header row
        rows.shift();
        
        const trades: Trade[] = rows
          .filter(row => row.length >= 5) // Ensure row has minimum required fields
          .map(row => ({
            id: crypto.randomUUID(),
            date: row[0],
            market: row[1] as Market,
            setup: row[2] as Setup,
            profit_loss: parseFloat(row[3]),
            rules_followed: row[4].toLowerCase() === 'yes',
            notes: row[5] || ''
          }));
        
        resolve(trades);
      } catch (error) {
        reject(new Error('Failed to parse CSV file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read CSV file'));
    };
    
    reader.readAsText(file);
  });
};