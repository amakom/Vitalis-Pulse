// ════════════════════════════════════════════
// ALERT DETECTOR — compares score changes and fans out emails
// ════════════════════════════════════════════

import { supabaseAdmin } from '@/lib/supabase/server';
import { sendAlertEmail } from './sender';

export interface ScoreSnapshot {
  vitalis_score: number;
  treasury_score: number;
  development_score: number;
  community_score: number;
  revenue_score: number;
  governance_score: number;
}

const DIMENSIONS: { key: keyof ScoreSnapshot; label: string }[] = [
  { key: 'treasury_score', label: 'Treasury' },
  { key: 'development_score', label: 'Development' },
  { key: 'community_score', label: 'Community' },
  { key: 'revenue_score', label: 'Revenue' },
  { key: 'governance_score', label: 'Governance' },
];

function biggestMover(oldS: ScoreSnapshot, newS: ScoreSnapshot) {
  let winner = { label: 'Overall', delta: newS.vitalis_score - oldS.vitalis_score };
  let biggestAbs = 0;
  for (const d of DIMENSIONS) {
    const delta = (newS[d.key] as number) - (oldS[d.key] as number);
    if (Math.abs(delta) > biggestAbs) {
      biggestAbs = Math.abs(delta);
      winner = { label: d.label, delta };
    }
  }
  return winner;
}

/**
 * Called AFTER a project's score is updated.
 * Compares old vs new; if delta exceeds a watcher's threshold, sends email.
 */
export async function processScoreChange(
  projectId: string,
  oldScore: ScoreSnapshot | null,
  newScore: ScoreSnapshot
): Promise<{ sent: number; skipped: number; errors: number }> {
  const result = { sent: 0, skipped: 0, errors: 0 };

  if (!oldScore) return result; // First-ever score, nothing to compare
  const delta = newScore.vitalis_score - oldScore.vitalis_score;
  if (delta === 0) return result;

  // Load project (need slug + name for the email)
  const { data: project } = await supabaseAdmin
    .from('projects')
    .select('id, slug, name')
    .eq('id', projectId)
    .single();
  if (!project) return result;

  // Find all watchers who have alerts enabled and whose threshold is crossed
  const { data: watchers } = await supabaseAdmin
    .from('watchlists')
    .select('user_id, alert_threshold, alerts_enabled')
    .eq('project_slug', project.slug)
    .eq('alerts_enabled', true);

  if (!watchers || watchers.length === 0) return result;

  const crossed = watchers.filter(w => Math.abs(delta) >= (w.alert_threshold ?? 5));
  if (crossed.length === 0) return result;

  // Batch-fetch user emails from auth.users via admin API
  const userIds = [...new Set(crossed.map(w => w.user_id))];
  const emails = new Map<string, string>();
  for (const uid of userIds) {
    const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(uid);
    if (user?.email) emails.set(uid, user.email);
  }

  const mover = biggestMover(oldScore, newScore);

  for (const w of crossed) {
    const email = emails.get(w.user_id);
    if (!email) {
      result.skipped++;
      continue;
    }

    const { id: resendId, error } = await sendAlertEmail({
      to: email,
      projectName: project.name,
      projectSlug: project.slug,
      oldScore: oldScore.vitalis_score,
      newScore: newScore.vitalis_score,
      biggestDimension: mover.label,
      biggestDelta: mover.delta,
    });

    await supabaseAdmin.from('alert_log').insert({
      user_id: w.user_id,
      project_id: projectId,
      old_score: oldScore.vitalis_score,
      new_score: newScore.vitalis_score,
      delta,
      biggest_dimension: mover.label,
      email_to: email,
      resend_id: resendId,
      error,
    });

    if (error) result.errors++;
    else result.sent++;
  }

  console.log(`[Alerts] ${project.name}: ${result.sent} sent, ${result.errors} errors, ${result.skipped} skipped (Δ${delta})`);
  return result;
}
