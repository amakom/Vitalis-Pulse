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
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      setRole((data?.role as UserRole) || 'user');
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
