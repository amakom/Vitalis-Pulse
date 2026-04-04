import { supabase } from '@/lib/supabase/client';
import type { Project, EcosystemData, Chain } from '@/lib/types';
import { CHAINS } from '@/lib/constants';
import { mapToDisplayProject } from './mapper';

// Fetch all projects with their current scores (for leaderboard)
export async function getLeaderboard(options?: {
  chain?: string;
  category?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}): Promise<{ projects: Project[]; total: number }> {
  const page = options?.page || 1;
  const limit = options?.limit || 25;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('projects')
    .select(`
      *,
      score:current_scores(*)
    `, { count: 'exact' })
    .eq('is_active', true);

  if (options?.chain && options.chain !== 'all') {
    query = query.eq('chain', options.chain);
  }
  if (options?.category && options.category !== 'all') {
    query = query.eq('category', options.category);
  }

  query = query.order('vitalis_score', {
    referencedTable: 'current_scores',
    ascending: options?.sortBy === 'lowest'
  });

  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error('Leaderboard query error:', error);
    return { projects: [], total: 0 };
  }

  // Fetch score history for sparklines
  const projectIds = data?.map((p: any) => p.id) || [];
  const { data: histories } = await supabase
    .from('score_history')
    .select('project_id, vitalis_score, recorded_at')
    .in('project_id', projectIds)
    .order('recorded_at', { ascending: true });

  const historyMap = new Map<string, number[]>();
  histories?.forEach((h: any) => {
    const arr = historyMap.get(h.project_id) || [];
    arr.push(h.vitalis_score);
    historyMap.set(h.project_id, arr);
  });

  const projects = (data || []).map((p: any) => {
    const score = Array.isArray(p.score) ? (p.score.length > 0 ? p.score[0] : null) : p.score;
    const scoreHistory = historyMap.get(p.id)?.slice(-90) || [];
    return mapToDisplayProject(p, score, scoreHistory);
  });

  return { projects, total: count || 0 };
}

// Fetch single project with full data
export async function getProject(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      score:current_scores(*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;

  const { data: history } = await supabase
    .from('score_history')
    .select('vitalis_score, recorded_at')
    .eq('project_id', data.id)
    .order('recorded_at', { ascending: true });

  const score = Array.isArray(data.score) ? (data.score.length > 0 ? data.score[0] : null) : data.score;
  const scoreHistory = history?.map((h: any) => h.vitalis_score) || [];

  return mapToDisplayProject(data, score, scoreHistory);
}

// Fetch aggregate stats (for hero section)
export async function getDashboardStats(): Promise<{
  totalProjects: number;
  avgScore: number;
  atRiskCount: number;
  totalTreasury: number;
}> {
  const { data: scores } = await supabase
    .from('current_scores')
    .select('vitalis_score, treasury_total_usd');

  if (!scores || scores.length === 0) {
    return { totalProjects: 0, avgScore: 0, atRiskCount: 0, totalTreasury: 0 };
  }

  return {
    totalProjects: scores.length,
    avgScore: Math.round(scores.reduce((s: number, r: any) => s + r.vitalis_score, 0) / scores.length),
    atRiskCount: scores.filter((s: any) => s.vitalis_score < 70).length,
    totalTreasury: scores.reduce((s: number, r: any) => s + (r.treasury_total_usd || 0), 0),
  };
}

// Fetch ecosystem stats
export async function getEcosystemStats(): Promise<EcosystemData[]> {
  const { data } = await supabase
    .from('projects')
    .select(`
      chain,
      score:current_scores(vitalis_score, treasury_total_usd)
    `)
    .eq('is_active', true);

  const ecosystems: Record<string, { scores: number[]; totalTreasury: number }> = {};

  data?.forEach((p: any) => {
    const chain = p.chain;
    const score = Array.isArray(p.score) ? (p.score.length > 0 ? p.score[0] : null) : p.score;
    if (!score) return;

    if (!ecosystems[chain]) {
      ecosystems[chain] = { scores: [], totalTreasury: 0 };
    }
    ecosystems[chain].scores.push(score.vitalis_score);
    ecosystems[chain].totalTreasury += score.treasury_total_usd || 0;
  });

  return Object.entries(ecosystems).map(([chain, data]) => {
    const chainInfo = CHAINS.find(c => c.id === chain);
    const avgScore = Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length);
    return {
      chain: chain as Chain,
      name: chainInfo?.name || chain,
      projectCount: data.scores.length,
      avgScore,
      atRiskPercent: Math.round(data.scores.filter(s => s < 70).length / data.scores.length * 100),
      totalTreasury: data.totalTreasury,
      color: chainInfo?.color || '#6b7280',
    };
  });
}

// Search projects
export async function searchProjects(query: string): Promise<Project[]> {
  const { data } = await supabase
    .from('projects')
    .select(`*, score:current_scores(*)`)
    .eq('is_active', true)
    .ilike('name', `%${query}%`)
    .limit(10);

  return (data || []).map((p: any) => {
    const score = Array.isArray(p.score) ? (p.score.length > 0 ? p.score[0] : null) : p.score;
    return mapToDisplayProject(p, score, []);
  });
}

// Fetch all projects (for compare page / selectors)
export async function getAllProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from('projects')
    .select(`*, score:current_scores(*)`)
    .eq('is_active', true)
    .order('vitalis_score', { referencedTable: 'current_scores', ascending: false });

  return (data || []).map((p: any) => {
    const score = Array.isArray(p.score) ? (p.score.length > 0 ? p.score[0] : null) : p.score;
    return mapToDisplayProject(p, score, []);
  });
}

// Submit a new project
export async function submitProject(submission: {
  name: string;
  website: string;
  chain: string;
  category: string;
  github_url?: string;
  defillama_slug?: string;
  coingecko_id?: string;
  treasury_wallet?: string;
  contact_email?: string;
  notes?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('project_submissions')
    .insert(submission);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
