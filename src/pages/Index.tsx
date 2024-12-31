import { Stats } from "@/components/Stats";
import { TradeForm } from "@/components/TradeForm";
import { TradeHistory } from "@/components/TradeHistory";
import { LotSizeCalculator } from "@/components/LotSizeCalculator";
import { AuthForm } from "@/components/AuthForm";
import { useAuthStore } from "@/store/useAuthStore";
import { useTradesStore } from "@/store/useTradesStore";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";

const Index = () => {
  const user = useAuthStore((state) => state.user);
  const checkSession = useAuthStore((state) => state.checkSession);
  const logout = useAuthStore((state) => state.logout);
  const loadTrades = useTradesStore((state) => state.loadTrades);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (user) {
      loadTrades();
    }
  }, [user, loadTrades]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-md px-8 py-12 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Forex Trading Journal
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Track your trades, analyze your performance
          </p>
          <AuthForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container py-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Forex Trading Journal
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user.email?.split('@')[0]}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={logout}
            className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
        
        <div className="grid gap-6">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-sm">
            <Stats />
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-sm">
              <LotSizeCalculator />
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-sm">
              <TradeForm />
            </div>
          </div>
          
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-sm">
            <TradeHistory />
          </div>
        </div>
        
        <AdBanner />
      </div>
    </div>
  );
};

export default Index;