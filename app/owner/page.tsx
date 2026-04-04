'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, Users, Star, Activity, ChevronRight, UserPlus, Clock } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { useRole } from '@/lib/hooks/use-role';
import { createSupabaseBrowser } from '@/lib/supabase/browser';

interface DashboardStats {
  totalUsers: number;
  usersLast7d: number;
  totalWatchlists: number;
  topProjects: { slug: string; count: number }[];
  admins: { id: string; email: string; role: string }[];
  recentLogs: { action: string; details: any; created_at: string; email?: string }[];
  recentUsers: { email: string; created_at: string }[];
}

export default function OwnerPage() {
  const { user, loading: authLoading } = useAuth();
  const { isOwner, loading: roleLoading } = useRole();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [adminMsg, setAdminMsg] = useState('');

  useEffect(() => {
    if (authLoading || roleLoading) return;
    if (!isOwner) { setLoading(false); return; }

    async function load() {
      const supabase = createSupabaseBrowser();

      // Fetch stats in parallel
      const [usersRes, watchlistsRes, topRes, adminsRes, logsRes, recentUsersRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('watchlists').select('id', { count: 'exact', head: true }),
        supabase.from('watchlists').select('project_slug'),
        supabase.from('profiles').select('id, email, role').in('role', ['owner', 'admin']).order('role'),
        supabase.from('admin_logs').select('action, details, created_at, user_id').order('created_at', { ascending: false }).limit(20),
        supabase.from('profiles').select('email, created_at').order('created_at', { ascending: false }).limit(10),
      ]);

      // Count users in last 7 days
      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
      const { count: usersLast7d } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo);

      // Top watchlisted projects
      const slugCounts: Record<string, number> = {};
      topRes.data?.forEach((w: any) => {
        slugCounts[w.project_slug] = (slugCounts[w.project_slug] || 0) + 1;
      });
      const topProjects = Object.entries(slugCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([slug, count]) => ({ slug, count }));

      // Enrich logs with admin emails
      const adminMap = new Map(adminsRes.data?.map((a: any) => [a.id, a.email]) || []);
      const recentLogs = (logsRes.data || []).map((l: any) => ({
        ...l,
        email: adminMap.get(l.user_id) || 'Unknown',
      }));

      setStats({
        totalUsers: usersRes.count || 0,
        usersLast7d: usersLast7d || 0,
        totalWatchlists: watchlistsRes.count || 0,
        topProjects,
        admins: adminsRes.data || [],
        recentLogs,
        recentUsers: recentUsersRes.data || [],
      });
      setLoading(false);
    }
    load();
  }, [authLoading, roleLoading, isOwner]);

  const handleGrantAdmin = async () => {
    if (!newAdminEmail.trim()) return;
    setAdminMsg('');

    const supabase = createSupabaseBrowser();

    // Find user by email in profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('email', newAdminEmail.trim())
      .single();

    if (!profile) {
      setAdminMsg('User not found. They must sign up first.');
      return;
    }

    if (profile.role === 'owner') {
      setAdminMsg('Cannot modify owner role.');
      return;
    }

    const newRole = profile.role === 'admin' ? 'user' : 'admin';
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', profile.id);

    if (error) {
      setAdminMsg(`Error: ${error.message}`);
      return;
    }

    // Log the action
    await supabase.from('admin_logs').insert({
      user_id: user!.id,
      action: newRole === 'admin' ? 'grant_admin' : 'revoke_admin',
      details: { target_email: newAdminEmail.trim(), target_id: profile.id },
    });

    setAdminMsg(`${newAdminEmail.trim()} is now ${newRole}.`);
    setNewAdminEmail('');

    // Refresh admins list
    const { data: admins } = await supabase
      .from('profiles')
      .select('id, email, role')
      .in('role', ['owner', 'admin'])
      .order('role');
    if (stats && admins) setStats({ ...stats, admins });
  };

  // Access denied
  if (!authLoading && !roleLoading && !isOwner) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <Shield className="mx-auto h-12 w-12 text-muted-foreground/30" />
        <h1 className="mt-4 text-xl font-bold">Access Denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">This page is restricted to the owner.</p>
        <Link href="/" className="mt-4 inline-block text-sm text-teal hover:underline">Back to Leaderboard</Link>
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="flex h-40 items-center justify-center text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-teal" />
            <h1 className="text-2xl font-bold">Owner Dashboard</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Platform overview and admin management</p>
        </div>
        <Link
          href="/admin"
          className="flex items-center gap-1 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal/90"
        >
          Admin Panel <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<Users className="h-5 w-5" />} label="Total Users" value={stats.totalUsers} />
        <StatCard icon={<UserPlus className="h-5 w-5" />} label="New (7d)" value={stats.usersLast7d} />
        <StatCard icon={<Star className="h-5 w-5" />} label="Watchlist Entries" value={stats.totalWatchlists} />
        <StatCard icon={<Activity className="h-5 w-5" />} label="Admin Actions" value={stats.recentLogs.length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Signups */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 flex items-center gap-2 font-semibold"><UserPlus className="h-4 w-4 text-teal" /> Recent Signups</h2>
          {stats.recentUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users yet.</p>
          ) : (
            <div className="space-y-2">
              {stats.recentUsers.map((u, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="truncate text-muted-foreground">{u.email}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Watchlisted Projects */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 flex items-center gap-2 font-semibold"><Star className="h-4 w-4 text-teal" /> Most Watchlisted</h2>
          {stats.topProjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No watchlist data yet.</p>
          ) : (
            <div className="space-y-2">
              {stats.topProjects.map((p, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <Link href={`/project/${p.slug}`} className="font-medium text-foreground hover:text-teal">{p.slug}</Link>
                  <span className="font-mono text-muted-foreground">{p.count} watchers</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin Management */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 flex items-center gap-2 font-semibold"><Shield className="h-4 w-4 text-teal" /> Admin Management</h2>
          <div className="mb-4 space-y-2">
            {stats.admins.map((a, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="truncate text-muted-foreground">{a.email}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${a.role === 'owner' ? 'bg-teal/15 text-teal' : 'bg-amber-500/15 text-amber-500'}`}>
                  {a.role}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="email"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              placeholder="email@example.com"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-teal"
            />
            <button
              onClick={handleGrantAdmin}
              className="shrink-0 rounded-lg bg-teal px-3 py-2 text-sm font-medium text-white hover:bg-teal/90"
            >
              Toggle Admin
            </button>
          </div>
          {adminMsg && <p className="mt-2 text-xs text-muted-foreground">{adminMsg}</p>}
        </div>

        {/* Admin Activity Log */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 flex items-center gap-2 font-semibold"><Clock className="h-4 w-4 text-teal" /> Admin Activity</h2>
          {stats.recentLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No admin activity yet.</p>
          ) : (
            <div className="space-y-2">
              {stats.recentLogs.map((log, i) => (
                <div key={i} className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{log.action.replace(/_/g, ' ')}</span>
                    <span className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString()}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{log.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">{icon}<span className="text-xs">{label}</span></div>
      <p className="mt-2 font-mono text-2xl font-bold">{value.toLocaleString()}</p>
    </div>
  );
}
