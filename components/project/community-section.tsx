'use client';

import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Project } from '@/lib/types';
import { MiniMetric } from '@/components/dashboard/metric-card';
import { getScoreColor } from '@/lib/constants';

interface CommunitySectionProps {
  project: Project;
  subScore: number;
}

export function CommunitySection({ project, subScore }: CommunitySectionProps) {
  const { community } = project;

  const chartData = community.dauHistory.map((dau, i) => ({
    day: i + 1,
    dau,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Community & Retention</h3>
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-500">Estimated</span>
          </div>
          <p className="text-sm text-muted-foreground">Weight: 20%</p>
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
        {community.dataAvailable ? (
          <>
            <MiniMetric label="Total Followers" value={community.totalFollowers.toLocaleString()} />
            <MiniMetric label="Twitter/X" value={community.twitterFollowers.toLocaleString()} />
            <MiniMetric label="Telegram" value={community.telegramMembers > 0 ? community.telegramMembers.toLocaleString() : 'N/A'} />
            <MiniMetric label="Reddit" value={community.redditSubscribers > 0 ? community.redditSubscribers.toLocaleString() : 'N/A'} />
          </>
        ) : (
          <>
            <MiniMetric label="DAU/MAU" value={community.dauMauRatio.toFixed(2)} />
            <MiniMetric
              label="Holder Growth (30d)"
              value={`${community.holderGrowth30d > 0 ? '+' : ''}${community.holderGrowth30d}%`}
              valueColor={community.holderGrowth30d > 0 ? '#10B981' : '#EF4444'}
            />
            <MiniMetric label="Social Data" value="Unavailable" valueColor="#94A3B8" />
            <MiniMetric label="On-chain Data" value="Unavailable" valueColor="#94A3B8" />
          </>
        )}
      </div>

      {/* Chart */}
      <div className="rounded-lg border border-border bg-card p-4">
        {community.dataAvailable && community.totalFollowers > 0 ? (
          <>
            <p className="mb-3 text-sm font-medium text-muted-foreground">Community Distribution</p>
            <div className="space-y-3">
              {[
                { label: 'Twitter/X', value: community.twitterFollowers, color: '#1DA1F2' },
                { label: 'Telegram', value: community.telegramMembers, color: '#26A5E4' },
                { label: 'Reddit', value: community.redditSubscribers, color: '#FF5700' },
              ].filter(c => c.value > 0).map((channel) => {
                const pct = Math.round((channel.value / community.totalFollowers) * 100);
                return (
                  <div key={channel.label}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{channel.label}</span>
                      <span className="font-mono font-medium">{channel.value.toLocaleString()} ({pct}%)</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: channel.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : chartData.length > 0 ? (
          <>
            <p className="mb-3 text-sm font-medium text-muted-foreground">Daily Active Users (90 days)</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="dauGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v) => v % 30 === 0 ? `D${v}` : ''} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} formatter={(value) => [Number(value).toLocaleString(), 'DAU']} />
                  <Area type="monotone" dataKey="dau" stroke="#14B8A6" fill="url(#dauGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            Community activity data not yet available
          </div>
        )}
      </div>
    </div>
  );
}
