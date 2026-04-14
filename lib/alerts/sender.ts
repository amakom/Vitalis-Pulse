// ════════════════════════════════════════════
// ALERT EMAIL SENDER — Resend transactional email
// ════════════════════════════════════════════

import { Resend } from 'resend';

const FROM = process.env.ALERT_EMAIL_FROM || 'VitalisPulse <alerts@vitalispulse.xyz>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://vitalispulse.xyz';

export interface AlertEmailInput {
  to: string;
  projectName: string;
  projectSlug: string;
  oldScore: number;
  newScore: number;
  biggestDimension: string; // e.g. "Treasury", "Development"
  biggestDelta: number;     // signed delta on that dimension
}

export async function sendAlertEmail(input: AlertEmailInput): Promise<{ id: string | null; error: string | null }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[Alerts] RESEND_API_KEY missing — skipping email');
    return { id: null, error: 'RESEND_API_KEY not configured' };
  }

  const delta = input.newScore - input.oldScore;
  const direction = delta < 0 ? 'dropped to' : 'rose to';
  const arrow = delta < 0 ? '⚠' : '↗';
  const subject = `${arrow} ${input.projectName} ${direction} ${input.newScore}`;
  const projectUrl = `${APP_URL}/project/${input.projectSlug}`;
  const unsubUrl = `${APP_URL}/watchlist`;

  const html = `
<!DOCTYPE html>
<html>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#0A0E12; color:#E6E9EC; padding:32px; margin:0;">
    <div style="max-width:560px; margin:0 auto; background:#121820; border:1px solid #1F2832; border-radius:12px; padding:32px;">
      <div style="font-size:13px; color:#7B8794; margin-bottom:8px;">VitalisPulse Score Alert</div>
      <h1 style="font-size:22px; margin:0 0 16px 0; color:#E6E9EC;">${input.projectName} ${direction} <span style="color:${delta < 0 ? '#F87171' : '#2DD4BF'};">${input.newScore}</span></h1>

      <div style="display:flex; gap:24px; margin:20px 0; padding:16px; background:#0A0E12; border-radius:8px;">
        <div>
          <div style="font-size:11px; text-transform:uppercase; color:#7B8794;">Previous</div>
          <div style="font-size:20px; font-weight:600;">${input.oldScore}</div>
        </div>
        <div style="font-size:20px; color:#7B8794; align-self:center;">→</div>
        <div>
          <div style="font-size:11px; text-transform:uppercase; color:#7B8794;">Current</div>
          <div style="font-size:20px; font-weight:600; color:${delta < 0 ? '#F87171' : '#2DD4BF'};">${input.newScore} (${delta > 0 ? '+' : ''}${delta})</div>
        </div>
      </div>

      <p style="font-size:14px; line-height:1.6; color:#C7CED6;">
        Biggest change: <strong>${input.biggestDimension}</strong> (${input.biggestDelta > 0 ? '+' : ''}${input.biggestDelta} pts)
      </p>

      <a href="${projectUrl}" style="display:inline-block; background:#2DD4BF; color:#0A0E12; font-weight:600; padding:12px 24px; border-radius:8px; text-decoration:none; margin:16px 0;">View ${input.projectName} →</a>

      <hr style="border:none; border-top:1px solid #1F2832; margin:24px 0;" />
      <p style="font-size:11px; color:#7B8794; line-height:1.5;">
        This is an automated alert based on protocol health metrics. <strong>Not investment advice. DYOR.</strong><br>
        <a href="${unsubUrl}" style="color:#7B8794;">Manage alerts</a> · <a href="${APP_URL}" style="color:#7B8794;">VitalisPulse</a>
      </p>
    </div>
  </body>
</html>`;

  const text = `${input.projectName} ${direction} ${input.newScore} (${delta > 0 ? '+' : ''}${delta}).
Previous: ${input.oldScore} → Current: ${input.newScore}
Biggest change: ${input.biggestDimension} (${input.biggestDelta > 0 ? '+' : ''}${input.biggestDelta} pts)

View: ${projectUrl}
Manage alerts: ${unsubUrl}

Not investment advice. DYOR.`;

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: input.to,
      subject,
      html,
      text,
    });
    if (error) {
      console.error('[Alerts] Resend error:', error);
      return { id: null, error: error.message || 'Resend error' };
    }
    return { id: data?.id || null, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Alerts] Send failed:', msg);
    return { id: null, error: msg };
  }
}
