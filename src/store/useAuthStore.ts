import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      checkSession: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          set({ user: session.user });
        } else {
          // If no valid session exists, clear the user state
          set({ user: null });
        }
      },
      login: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) {
            console.error('Login error:', error.message);
            return {
              success: false,
              message: 'Invalid email or password',
            };
          }
          
          if (data?.user) {
            set({ user: data.user });
            return {
              success: true,
              message: 'Login successful',
            };
          }
          
          return {
            success: false,
            message: 'Something went wrong',
          };
        } catch (error) {
          console.error('Login error:', error);
          return {
            success: false,
            message: 'An unexpected error occurred',
          };
        }
      },
      register: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: window.location.origin,
              data: {
                email_confirm: true
              }
            }
          });
          
          if (error) {
            console.error('Registration error:', error.message);
            return {
              success: false,
              message: 'Registration failed. Email might be taken.',
            };
          }
          
          if (data.user) {
            set({ user: data.user });
            return {
              success: true,
              message: 'Registration successful!',
            };
          }
          return {
            success: false,
            message: 'Something went wrong',
          };
        } catch (error) {
          console.error('Registration error:', error);
          return {
            success: false,
            message: 'An unexpected error occurred',
          };
        }
      },
      logout: async () => {
        try {
          // First clear the local session
          set({ user: null });
          
          // Then attempt to clear the server session
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.error('Logout error:', error);
            // Even if there's an error, we've already cleared the local state
          }
        } catch (error) {
          console.error('Logout error:', error);
          // The local state is already cleared, so the user is effectively logged out
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Set up auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  if (session?.user) {
    useAuthStore.setState({ user: session.user });
  } else {
    useAuthStore.setState({ user: null });
  }
});