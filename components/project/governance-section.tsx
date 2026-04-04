import { Project } from '@/lib/types';
import { MiniMetric } from '@/components/dashboard/metric-card';
import { getScoreColor } from '@/lib/constants';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';

interface GovernanceSectionProps {
  project: Project;
  subScore: number;
}

export function GovernanceSection({ project, subScore }: GovernanceSectionProps) {
  const { governance } = project;

  const riskFlags: string[] = [];
  if (governance.lastAuditDaysAgo === 0) riskFlags.push('Audit status unknown');
  else if (governance.lastAuditDaysAgo > 365) riskFlags.push('Audit older than 1 year');
  if (governance.voterParticipation < 5) riskFlags.push('Low voter participation');
  if (!governance.bugBountyActive) riskFlags.push('No active bug bounty');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Governance & Security</h3>
          <p className="text-sm text-muted-foreground">Weight: 10%</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xl font-bold" style={{ color: getScoreColor(subScore) }}>
            {subScore}
          </span>
          <span className="text-sm text-muted-foreground">/100</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${subScore}%`, backgroundColor: getScoreColor(subScore) }}
        />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MiniMetric
          label="Last Audit"
          value={governance.lastAuditDaysAgo > 0 ? `${governance.lastAuditDaysAgo} days ago` : 'Unknown'}
          valueColor={governance.lastAuditDaysAgo === 0 ? '#94A3B8' : governance.lastAuditDaysAgo > 365 ? '#F97316' : undefined}
        />
        <MiniMetric label="Voter Participation" value={`${governance.voterParticipation}%`} />
        <MiniMetric label="Multisig" value={governance.multisig} />
        <MiniMetric
          label="Bug Bounty"
          value={governance.bugBountyActive ? 'Active' : 'Inactive'}
          valueColor={governance.bugBountyActive ? '#10B981' : '#94A3B8'}
        />
      </div>

      {/* Security indicators */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-3 text-sm font-medium text-muted-foreground">Security Indicators</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            {governance.lastAuditDaysAgo === 0 ? (
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            ) : governance.lastAuditDaysAgo < 180 ? (
              <CheckCircle className="h-4 w-4 text-emerald" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber" />
            )}
            <span>
              {governance.lastAuditDaysAgo === 0
                ? 'Audit status unknown'
                : `Security audit ${governance.lastAuditDaysAgo < 180 ? 'is recent' : 'needs updating'}`}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {governance.bugBountyActive ? (
              <CheckCircle className="h-4 w-4 text-emerald" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber" />
            )}
            <span>Bug bounty {governance.bugBountyActive ? 'is active' : 'is not active'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-teal" />
            <span>Multisig: {governance.multisig} signers required</span>
          </div>
        </div>
      </div>

      {/* Risk flags */}
      {riskFlags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {riskFlags.map((flag, i) => (
            <span key={i} className="rounded-full bg-orange/15 px-3 py-1 text-xs font-medium text-orange">
              {flag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
