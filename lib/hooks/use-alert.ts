'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/context';
import { createSupabaseBrowser } from '@/lib/supabase/browser';

/**
 * Per-project alert state. Alerts live on the watchlist row:
 * adding to watchlist auto-enables a ±5 alert; this hook toggles it on/off.
 */
export function useAlert(slug: string) {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [threshold, setThreshold] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) {
        setEnabled(false);
        setLoading(false);
        return;
      }
      const supabase = createSupabaseBrowser();
      const { data } = await supabase
        .from('watchlists')
        .select('alerts_enabled, alert_threshold')
        .eq('user_id', user.id)
        .eq('project_slug', slug)
        .maybeSingle();
      setEnabled(!!data?.alerts_enabled);
      setThreshold(data?.alert_threshold ?? 5);
      setLoading(false);
    }
    load();
  }, [user, slug]);

  const toggle = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    const supabase = createSupabaseBrowser();
    const next = !enabled;

    // Upsert the watchlist row with new alert state (adds to watchlist if missing)
    await supabase.from('watchlists').upsert(
      { user_id: user.id, project_slug: slug, alerts_enabled: next, alert_threshold: threshold },
      { onConflict: 'user_id,project_slug' }
    );
    setEnabled(next);
    return next;
  }, [user, slug, enabled, threshold]);

  return { enabled, threshold, loading, toggle, isLoggedIn: !!user };
}
