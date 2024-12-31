import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const LotSizeCalculator = () => {
  // Capital-based calculator state
  const [capital, setCapital] = useState("");
  const [pips, setPips] = useState("");
  
  // Risk-based calculator state
  const [riskAmount, setRiskAmount] = useState("");
  const [slPips, setSlPips] = useState("");

  const calculateLotSize = (capital: number, pips: number) => {
    let lotSize = (capital / 1000) * 1.00;

    if (pips > 10) {
      const pipRiskFactor = pips / 10;
      lotSize /= pipRiskFactor;
    }

    lotSize = Math.max(0.01, lotSize);
    return lotSize.toFixed(2);
  };

  const calculateRiskBasedLotSize = (riskAmount: number, slPips: number) => {
    if (slPips <= 0) return "0.00";
    const lotSize = riskAmount / (slPips * 10);
    return Math.max(0.01, lotSize).toFixed(2);
  };

  const capitalBasedLotSize = () => {
    const capitalNum = parseFloat(capital);
    const pipsNum = parseFloat(pips);

    if (isNaN(capitalNum) || isNaN(pipsNum) || capitalNum <= 0 || pipsNum <= 0) {
      return "0.00";
    }
    return calculateLotSize(capitalNum, pipsNum);
  };

  const riskBasedLotSize = () => {
    const riskAmountNum = parseFloat(riskAmount);
    const slPipsNum = parseFloat(slPips);

    if (isNaN(riskAmountNum) || isNaN(slPipsNum) || riskAmountNum <= 0 || slPipsNum <= 0) {
      return "0.00";
    }
    return calculateRiskBasedLotSize(riskAmountNum, slPipsNum);
  };

  return (
    <Card className="p-6 mb-8">
      <Tabs defaultValue="capital" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="capital">Capital-based</TabsTrigger>
          <TabsTrigger value="risk">Risk-based</TabsTrigger>
        </TabsList>

        <TabsContent value="capital" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="capital">Capital ($)</Label>
              <Input
                id="capital"
                type="number"
                min="0"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                placeholder="Enter your capital"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pips">Pips</Label>
              <Input
                id="pips"
                type="number"
                min="0"
                value={pips}
                onChange={(e) => setPips(e.target.value)}
                placeholder="Enter pips"
              />
            </div>
          </div>
          <div className="p-4 bg-muted rounded-md">
            <p className="text-center text-lg font-semibold">
              Recommended Lot Size: {capitalBasedLotSize()} lots
            </p>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="risk-amount">Risk Amount ($)</Label>
              <Input
                id="risk-amount"
                type="number"
                min="0"
                value={riskAmount}
                onChange={(e) => setRiskAmount(e.target.value)}
                placeholder="Enter risk amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sl-pips">Stop Loss (Pips)</Label>
              <Input
                id="sl-pips"
                type="number"
                min="0"
                value={slPips}
                onChange={(e) => setSlPips(e.target.value)}
                placeholder="Enter stop loss pips"
              />
            </div>
          </div>
          <div className="p-4 bg-muted rounded-md">
            <p className="text-center text-lg font-semibold">
              Recommended Lot Size: {riskBasedLotSize()} lots
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};