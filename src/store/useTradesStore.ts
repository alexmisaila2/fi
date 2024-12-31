import { create } from 'zustand';
import { Trade } from '@/types/trade';
import { supabase } from '@/lib/supabase';

interface TradesState {
  trades: Trade[];
  addTrade: (trade: Omit<Trade, 'id'>) => Promise<void>;
  editTrade: (id: string, trade: Partial<Trade>) => Promise<void>;
  deleteTrade: (id: string) => Promise<void>;
  loadTrades: () => Promise<void>;
}

export const useTradesStore = create<TradesState>()((set, get) => ({
  trades: [],
  addTrade: async (trade) => {
    const session = await supabase.auth.getSession();
    const user_id = session.data.session?.user.id;
    
    if (!user_id) {
      throw new Error('User not authenticated');
    }

    // First, ensure user exists in users table using RPC
    const { error: rpcError } = await supabase.rpc('ensure_user_exists', {
      user_id: user_id,
      user_email: session.data.session?.user.email
    });

    if (rpcError) {
      console.error('Error ensuring user exists:', rpcError);
      throw rpcError;
    }

    // Now add the trade
    const { data, error } = await supabase
      .from('trades')
      .insert([{ ...trade, user_id }])
      .select()
      .single();

    if (error) {
      console.error('Error adding trade:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from insert');
    }

    set((state) => ({ trades: [data, ...state.trades] }));
  },
  editTrade: async (id, updatedTrade) => {
    const session = await supabase.auth.getSession();
    const user_id = session.data.session?.user.id;
    
    if (!user_id) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('trades')
      .update(updatedTrade)
      .eq('id', id)
      .eq('user_id', user_id);

    if (error) throw error;
    set((state) => ({
      trades: state.trades.map((trade) =>
        trade.id === id ? { ...trade, ...updatedTrade } : trade
      ),
    }));
  },
  deleteTrade: async (id) => {
    const session = await supabase.auth.getSession();
    const user_id = session.data.session?.user.id;
    
    if (!user_id) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('trades')
      .delete()
      .eq('id', id)
      .eq('user_id', user_id);

    if (error) throw error;
    set((state) => ({
      trades: state.trades.filter((trade) => trade.id !== id),
    }));
  },
  loadTrades: async () => {
    const session = await supabase.auth.getSession();
    const user_id = session.data.session?.user.id;
    
    if (!user_id) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', user_id)
      .order('date', { ascending: false });

    if (error) throw error;
    set({ trades: data || [] });
  },
}));
