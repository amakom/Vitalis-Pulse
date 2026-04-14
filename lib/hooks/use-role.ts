'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { createSupabaseBrowser } from '@/lib/supabase/browser';

export type UserRole = 'owner' | 'admin' | 'user' | null;

export function useRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      const supabase = createSupabaseBrowser();
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('[useRole] Profile fetch error:', error.message, error.code);
      }
      console.log('[useRole] Profile data:', data, 'User email:', user.email);

      // Database role takes priority; fall back to env-based owner check
      if (data?.role) {
        setRole(data.role as UserRole);
      } else if (user.email === process.env.NEXT_PUBLIC_OWNER_EMAIL) {
        setRole('owner');
      } else {
        setRole('user');
      }
      setLoading(false);
    }
    fetchRole();
  }, [user]);

  return {
    role,
    loading,
    isOwner: role === 'owner',
    isAdmin: role === 'admin' || role === 'owner',
    isUser: !!user,
  };
}
