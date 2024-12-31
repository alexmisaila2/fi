import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Market, Setup } from "@/types/trade";
import { useTradesStore } from "@/store/useTradesStore";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const formSchema = z.object({
  date: z.string(),
  market: z.string(),
  setup: z.string(),
  profit_loss: z.string(),
  rules_followed: z.boolean(),
  notes: z.string().optional(),
});

export function TradeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addTrade = useTradesStore((state) => state.addTrade);
  const loadTrades = useTradesStore((state) => state.loadTrades);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      market: "XAUUSD",
      setup: "SA1",
      profit_loss: "",
      rules_followed: false,
      notes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      await addTrade({
        date: values.date,
        market: values.market as Market,
        setup: values.setup as Setup,
        profit_loss: parseFloat(values.profit_loss),
        rules_followed: values.rules_followed,
        notes: values.notes,
      });
      
      // Reload trades after successful addition
      await loadTrades();
      
      form.reset();
      toast.success("Trade added successfully");
    } catch (error) {
      console.error("Error adding trade:", error);
      toast.error("Failed to add trade. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Add Trade</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="market"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Market</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select market" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="XAUUSD">XAUUSD</SelectItem>
                    <SelectItem value="USDJPY">USDJPY</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="setup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Setup</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select setup" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SA1">SA1</SelectItem>
                    <SelectItem value="Fibs">Fibs</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profit_loss"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profit/Loss</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rules_followed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Rules Followed</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Trade"}
          </Button>
        </form>
      </Form>
    </div>
  );
}