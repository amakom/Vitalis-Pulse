// ════════════════════════════════════════════
// SCORING PIPELINE — orchestrates collect → score → write
// ════════════════════════════════════════════

import { supabaseAdmin } from '@/lib/supabase/server';
import { collectGitHubData, collectDefiLlamaData, collectCoinGeckoData } from './collectors';
import { calculateScore } from './engine';

export async function scoreProject(projectId: string): Promise<void> {
  console.log(`[Pipeline] Scoring project: ${projectId}`);

  // 1. Fetch project config from DB
  const { data: project, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error || !project) {
    console.error(`[Pipeline] Project not found: ${projectId}`, error);
    return;
  }

  // 2. Collect data from all sources
  const github = await collectGitHubData(project.github_repos || []);
  const defillama = await collectDefiLlamaData(project.defillama_slug || '');
  const coingecko = await collectCoinGeckoData(project.coingecko_id || '');

  // 3. Cache raw data
  for (const [source, data] of Object.entries({ github, defillama, coingecko })) {
    await supabaseAdmin.from('raw_api_data').insert({
      project_id: projectId,
      source,
      data,
    });
  }

  // 4. Calculate score
  const result = calculateScore({
    github,
    defillama,
    coingecko,
    projectMeta: {
      governance_type: project.governance_type || 'none',
      github_repos: project.github_repos || [],
      treasury_addresses: project.treasury_addresses || {},
    },
  });

  // 5. Get previous score for trend calculation
  const { data: prevScore } = await supabaseAdmin
    .from('current_scores')
    .select('vitalis_score')
    .eq('project_id', projectId)
    .single();

  const trend24h = prevScore
    ? Number(((result.vitalisScore - prevScore.vitalis_score) / Math.max(prevScore.vitalis_score, 1) * 100).toFixed(1))
    : 0;

  // 6. Upsert current score
  await supabaseAdmin.from('current_scores').upsert({
    project_id: projectId,
    vitalis_score: result.vitalisScore,
    treasury_score: result.treasuryScore,
    development_score: result.developmentScore,
    community_score: result.communityScore,
    revenue_score: result.revenueScore,
    governance_score: result.governanceScore,
    treasury_runway_months: result.treasury_runway_months,
    treasury_total_usd: result.treasury_total_usd,
    treasury_diversification_grade: result.treasury_diversification_grade,
    treasury_stablecoin_ratio: result.treasury_stablecoin_ratio,
    treasury_monthly_burn: result.treasury_monthly_burn,
    treasury_composition: result.treasury_composition,
    dev_commits_30d: result.dev_commits_30d,
    dev_active_devs: result.dev_active_devs,
    dev_pr_merge_hours: result.dev_pr_merge_hours,
    dev_last_push_days: result.dev_last_push_days,
    dev_weekly_commits: result.dev_weekly_commits,
    dev_grade: result.dev_grade,
    community_dau_mau: result.community_dau_mau,
    community_holder_growth: result.community_holder_growth,
    community_gini: result.community_gini,
    community_churn: result.community_churn,
    community_dau_history: result.community_dau_history,
    revenue_monthly_usd: result.revenue_monthly_usd,
    revenue_non_token_pct: result.revenue_non_token_pct,
    revenue_burn_multiple: result.revenue_burn_multiple,
    revenue_trend: result.revenue_trend,
    revenue_monthly_history: result.revenue_monthly_history,
    revenue_is_positive: result.revenue_is_positive,
    gov_last_audit_days: result.gov_last_audit_days,
    gov_voter_participation: result.gov_voter_participation,
    gov_multisig: result.gov_multisig,
    gov_bug_bounty: result.gov_bug_bounty,
    health_summary: result.health_summary,
    badges: result.badges,
    score_trend_24h: trend24h,
    scored_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // 7. Append to score history
  await supabaseAdmin.from('score_history').insert({
    project_id: projectId,
    vitalis_score: result.vitalisScore,
    treasury_score: result.treasuryScore,
    development_score: result.developmentScore,
    community_score: result.communityScore,
    revenue_score: result.revenueScore,
    governance_score: result.governanceScore,
  });

  console.log(`[Pipeline] ${project.name}: Score ${result.vitalisScore} (${result.dev_grade})`);
}

// Score the single oldest-scored project (fits within 60s Hobby limit)
export async function scoreNextProject(): Promise<{ projectId: string; projectName: string; score: number } | { projectId: null }> {
  // Find the project with the oldest scored_at, or one that hasn't been scored yet
  const { data: projects } = await supabaseAdmin
    .from('projects')
    .select('id, name')
    .eq('is_active', true);

  if (!projects || projects.length === 0) return { projectId: null };

  // Get all current scores to find the oldest
  const { data: scores } = await supabaseAdmin
    .from('current_scores')
    .select('project_id, scored_at')
    .order('scored_at', { ascending: true });

  const scoredMap = new Map(scores?.map(s => [s.project_id, s.scored_at]) || []);

  // Prioritize unscored projects, then oldest scored
  let target = projects.find(p => !scoredMap.has(p.id));
  if (!target) {
    // All scored — pick the one scored longest ago
    target = projects.sort((a, b) => {
      const aTime = scoredMap.get(a.id) || '1970-01-01';
      const bTime = scoredMap.get(b.id) || '1970-01-01';
      return aTime < bTime ? -1 : 1;
    })[0];
  }

  if (!target) return { projectId: null };

  try {
    await scoreProject(target.id);
    const { data: newScore } = await supabaseAdmin
      .from('current_scores')
      .select('vitalis_score')
      .eq('project_id', target.id)
      .single();
    return { projectId: target.id, projectName: target.name, score: newScore?.vitalis_score || 0 };
  } catch (err) {
    console.error(`[Pipeline] Error scoring ${target.name}:`, err);
    return { projectId: target.id, projectName: target.name, score: -1 };
  }
}

export async function scoreAllProjects(): Promise<{ scored: number; errors: number }> {
  const { data: projects } = await supabaseAdmin
    .from('projects')
    .select('id, name')
    .eq('is_active', true);

  if (!projects) return { scored: 0, errors: 0 };

  let scored = 0;
  let errors = 0;

  for (const project of projects) {
    try {
      await scoreProject(project.id);
      scored++;
    } catch (err) {
      console.error(`[Pipeline] Error scoring ${project.name}:`, err);
      errors++;
    }
    // Rate limit between projects
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`[Pipeline] Complete: ${scored} scored, ${errors} errors`);
  return { scored, errors };
}
