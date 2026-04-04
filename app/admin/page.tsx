'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { RefreshCw, Play, CheckCircle, XCircle, Loader2, Shield, ChevronRight, Settings } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { useRole } from '@/lib/hooks/use-role';
import { createSupabaseBrowser } from '@/lib/supabase/browser';
import { useToast } from '@/components/layout/toast';

interface ProjectRow {
  id: string;
  name: string;
  chain: string;
  score?: { vitalis_score: number; scored_at: string };
}

interface SubmissionRow {
  id: number;
  name: string;
  website: string;
  chain: string;
  category: string;
  status: string;
  submitted_at: string;
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isOwner, loading: roleLoading } = useRole();
  const { showToast } = useToast();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [scoringId, setScoringId] = useState<string | null>(null);
  const [scoringAll, setScoringAll] = useState(false);
  const [message, setMessage] = useState('');

  const loadData = useCallback(async () => {
    try {
      const supabase = createSupabaseBrowser();

      const { data: projs } = await supabase
        .from('projects')
        .select('id, name, chain, score:current_scores(vitalis_score, scored_at)')
        .eq('is_active', true)
        .order('name');

      setProjects((projs || []).map((p: any) => ({
        ...p,
        score: Array.isArray(p.score) ? (p.score.length > 0 ? p.score[0] : null) : p.score,
      })));

      const { data: subs } = await supabase
        .from('project_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      setSubmissions(subs || []);
    } catch (err) {
      console.error('Failed to load admin data', err);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !roleLoading && isAdmin) loadData();
  }, [authLoading, roleLoading, isAdmin, loadData]);

  const logAction = async (action: string, details: any) => {
    if (!user) return;
    const supabase = createSupabaseBrowser();
    await supabase.from('admin_logs').insert({ user_id: user.id, action, details });
  };

  const scoreProject = async (projectId: string) => {
    setScoringId(projectId);
    setMessage('');
    try {
      const res = await fetch(`/api/admin/score/${projectId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || ''}` },
      });
      const data = await res.json();
      setMessage(data.success ? `Scored ${projectId}` : `Error: ${data.error}`);
      await logAction('score_project', { projectId });
      await loadData();
    } catch {
      setMessage('Network error');
    }
    setScoringId(null);
  };

  const scoreAll = async () => {
    setScoringAll(true);
    setMessage('Scoring projects...');
    try {
      const res = await fetch('/api/cron/score-all', {
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || ''}` },
      });
      const data = await res.json();
      setMessage(`Done: ${data.scored || 0} scored`);
      await logAction('score_all', data);
      await loadData();
    } catch {
      setMessage('Network error');
    }
    setScoringAll(false);
  };

  const updateSubmission = async (id: number, status: string) => {
    const supabase = createSupabaseBrowser();
    await supabase.from('project_submissions').update({ status }).eq('id', id);
    await logAction('update_submission', { submission_id: id, status });
    await loadData();
    showToast(`Submission ${status}`);
  };

  // Access denied
  if (!authLoading && !roleLoading && !isAdmin) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <Shield className="mx-auto h-12 w-12 text-muted-foreground/30" />
        <h1 className="mt-4 text-xl font-bold">Access Denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">Admin access required. Sign in with an admin account.</p>
        <Link href="/login" className="mt-4 inline-block text-sm text-teal hover:underline">Sign In</Link>
      </div>
    );
  }

  if (authLoading || roleLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="flex h-40 items-center justify-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-teal" />
            <h1 className="text-2xl font-bold sm:text-3xl">Admin Panel</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Signed in as {user?.email}</p>
        </div>
        <div className="flex gap-2">
          {isOwner && (
            <Link
              href="/owner"
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent"
            >
              Owner Dashboard <ChevronRight className="h-4 w-4" />
            </Link>
          )}
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <button
            onClick={scoreAll}
            disabled={scoringAll}
            className="flex items-center gap-1.5 rounded-lg bg-teal px-4 py-1.5 text-sm font-medium text-white hover:bg-teal/90 disabled:opacity-50"
          >
            {scoringAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Score All
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-6 rounded-lg border border-teal/30 bg-teal/10 px-4 py-2 text-sm text-teal">
          {message}
        </div>
      )}

      {/* System status */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Projects</p>
          <p className="text-2xl font-bold">{projects.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Scored</p>
          <p className="text-2xl font-bold">{projects.filter(p => p.score).length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Pending Submissions</p>
          <p className="text-2xl font-bold">{submissions.filter(s => s.status === 'pending').length}</p>
        </div>
      </div>

      {/* Projects table - desktop */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Projects</h2>
        <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Chain</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Score</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Last Scored</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id} className="border-b border-border hover:bg-muted/20">
                  <td className="px-4 py-2.5 font-medium">{p.name}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{p.chain}</td>
                  <td className="px-4 py-2.5 font-mono font-semibold">
                    {p.score?.vitalis_score ?? '—'}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">
                    {p.score?.scored_at ? new Date(p.score.scored_at).toLocaleString() : 'Never'}
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => scoreProject(p.id)}
                      disabled={scoringId === p.id}
                      className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-accent disabled:opacity-50"
                    >
                      {scoringId === p.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                      Rescore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Projects cards - mobile */}
        <div className="space-y-3 md:hidden">
          {projects.map(p => (
            <div key={p.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.chain}</p>
                </div>
                <span className="font-mono text-lg font-semibold">
                  {p.score?.vitalis_score ?? '—'}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {p.score?.scored_at ? new Date(p.score.scored_at).toLocaleString() : 'Never scored'}
                </span>
                <button
                  onClick={() => scoreProject(p.id)}
                  disabled={scoringId === p.id}
                  className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-accent disabled:opacity-50"
                >
                  {scoringId === p.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                  Rescore
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submissions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Submissions</h2>
        {submissions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No submissions yet.</p>
        ) : (
          <>
          <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Website</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Chain</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(s => (
                  <tr key={s.id} className="border-b border-border hover:bg-muted/20">
                    <td className="px-4 py-2.5 font-medium">{s.name}</td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{s.website}</td>
                    <td className="px-4 py-2.5">{s.chain}</td>
                    <td className="px-4 py-2.5">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        s.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                        s.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                        'bg-amber-500/10 text-amber-400'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">
                      {new Date(s.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2.5">
                      {s.status === 'pending' && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateSubmission(s.id, 'approved')}
                            className="rounded-md bg-emerald-500/10 p-1 text-emerald-400 hover:bg-emerald-500/20"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => updateSubmission(s.id, 'rejected')}
                            className="rounded-md bg-red-500/10 p-1 text-red-400 hover:bg-red-500/20"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 md:hidden">
            {submissions.map(s => (
              <div key={s.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{s.website}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    s.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                    s.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    {s.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{s.chain}</span>
                    <span>{new Date(s.submitted_at).toLocaleDateString()}</span>
                  </div>
                  {s.status === 'pending' && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => updateSubmission(s.id, 'approved')}
                        className="rounded-md bg-emerald-500/10 p-1 text-emerald-400 hover:bg-emerald-500/20"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => updateSubmission(s.id, 'rejected')}
                        className="rounded-md bg-red-500/10 p-1 text-red-400 hover:bg-red-500/20"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          </>
        )}
      </div>
    </div>
  );
}
