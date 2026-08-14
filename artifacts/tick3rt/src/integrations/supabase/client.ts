// Supabase client stub — replaced for Replit.
// Auth is handled by the mock AuthContext (localStorage-based).
// This file exists only to satisfy any remaining imports.

export const supabase = {
  auth: {
    onAuthStateChange: (_event: unknown) => ({ data: { subscription: { unsubscribe: () => {} } } }),
    getSession: async () => ({ data: { session: null } }),
    updateUser: async (_data: unknown) => ({ error: null }),
    setSession: async (_tokens: unknown) => ({ error: null }),
  },
};
