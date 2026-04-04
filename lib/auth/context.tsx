'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createSupabaseBrowser } from '@/lib/supabase/browser';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };

    // Migrate localStorage watchlist to Supabase on signup
    await migrateLocalWatchlist(supabase);
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };

    // Migrate localStorage watchlist on login too
    await migrateLocalWatchlist(supabase);
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// Migrate localStorage watchlist items to Supabase
async function migrateLocalWatchlist(supabase: ReturnType<typeof createSupabaseBrowser>) {
  try {
    const localWatchlist: string[] = JSON.parse(localStorage.getItem('vitalis-watchlist') || '[]');
    if (localWatchlist.length === 0) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Insert each local watchlist item (ignore conflicts)
    for (const slug of localWatchlist) {
      await supabase.from('watchlists').upsert(
        { user_id: user.id, project_slug: slug },
        { onConflict: 'user_id,project_slug' }
      );
    }

    // Clear localStorage after migration
    localStorage.removeItem('vitalis-watchlist');
  } catch {
    // Silent fail — localStorage might not be available
  }
}
