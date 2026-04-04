'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/context';
import { createSupabaseBrowser } from '@/lib/supabase/browser';

export function useWatchlist() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load watchlist from Supabase (logged in) or localStorage (anonymous)
  useEffect(() => {
    async function load() {
      if (user) {
        const supabase = createSupabaseBrowser();
        const { data } = await supabase
          .from('watchlists')
          .select('project_slug')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        setWatchlist(data?.map(d => d.project_slug) || []);
      } else {
        const local = JSON.parse(localStorage.getItem('vitalis-watchlist') || '[]');
        setWatchlist(local);
      }
      setLoading(false);
    }
    load();
  }, [user]);

  const isWatchlisted = useCallback((slug: string) => watchlist.includes(slug), [watchlist]);

  const toggle = useCallback(async (slug: string): Promise<boolean> => {
    const wasWatchlisted = watchlist.includes(slug);

    if (user) {
      const supabase = createSupabaseBrowser();
      if (wasWatchlisted) {
        await supabase.from('watchlists').delete().eq('user_id', user.id).eq('project_slug', slug);
        setWatchlist(prev => prev.filter(s => s !== slug));
      } else {
        await supabase.from('watchlists').insert({ user_id: user.id, project_slug: slug });
        setWatchlist(prev => [slug, ...prev]);
      }
    } else {
      // Anonymous: use localStorage
      if (wasWatchlisted) {
        const updated = watchlist.filter(s => s !== slug);
        localStorage.setItem('vitalis-watchlist', JSON.stringify(updated));
        setWatchlist(updated);
      } else {
        const updated = [slug, ...watchlist];
        localStorage.setItem('vitalis-watchlist', JSON.stringify(updated));
        setWatchlist(updated);
      }
    }

    return !wasWatchlisted; // returns new state
  }, [user, watchlist]);

  return { watchlist, loading, isWatchlisted, toggle };
}
