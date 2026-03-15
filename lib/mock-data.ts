import { Project, Chain, Category, Grade, RevenueTrend, EcosystemData } from './types';

// Seeded random for consistent data across renders
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = seededRandom(42);

function randBetween(min: number, max: number): number {
  return min + rand() * (max - min);
}

function randInt(min: number, max: number): number {
  return Math.floor(randBetween(min, max + 1));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function generateScoreHistory(baseScore: number, days: number): number[] {
  const history: number[] = [];
  let current = baseScore + randBetween(-8, 8);
  for (let i = 0; i < days; i++) {
    current += randBetween(-2, 2);
    current = Math.max(0, Math.min(100, current));
    history.push(Math.round(current));
  }
  // Ensure last value is close to the actual score
  history[history.length - 1] = baseScore;
  return history;
}

function generateDAUHistory(baseDAU: number, days: number): number[] {
  const history: number[] = [];
  let current = baseDAU;
  for (let i = 0; i < days; i++) {
    current += current * randBetween(-0.05, 0.05);
    current = Math.max(100, current);
    history.push(Math.round(current));
  }
  return history;
}

function generateWeeklyCommits(activeDevs: number, weeks: number): number[] {
  return Array.from({ length: weeks }, () =>
    Math.max(0, Math.round(activeDevs * randBetween(2, 12)))
  );
}

function generateMonthlyRevenue(baseRevenue: number, trend: RevenueTrend, months: number): number[] {
  const history: number[] = [];
  let current = baseRevenue * (trend === 'growing' ? 0.6 : trend === 'declining' ? 1.4 : 0.95);
  for (let i = 0; i < months; i++) {
    const factor = trend === 'growing' ? randBetween(1.02, 1.12) :
                   trend === 'declining' ? randBetween(0.85, 0.98) :
                   randBetween(0.95, 1.05);
    current *= factor;
    history.push(Math.round(current));
  }
  return history;
}

function scoreToGrade(score: number): Grade {
  const noise = randBetween(-10, 10);
  const adjusted = score + noise;
  if (adjusted >= 80) return 'A';
  if (adjusted >= 65) return 'B';
  if (adjusted >= 50) return 'C';
  if (adjusted >= 35) return 'D';
  return 'F';
}

function generateTreasuryComposition(score: number): { label: string; percentage: number; color: string }[] {
  const stablecoinPct = score > 70 ? randInt(25, 45) : score > 40 ? randInt(10, 30) : randInt(0, 15);
  const ethPct = randInt(10, 30);
  const nativeTokenPct = 100 - stablecoinPct - ethPct - randInt(5, 15);
  const otherPct = 100 - stablecoinPct - ethPct - Math.max(nativeTokenPct, 10);

  const comp = [
    { label: 'Native Token', percentage: Math.max(nativeTokenPct, 10), color: '#8B5CF6' },
    { label: 'USDC/USDT', percentage: stablecoinPct, color: '#14B8A6' },
    { label: 'ETH', percentage: ethPct, color: '#627EEA' },
    { label: 'Other', percentage: Math.max(otherPct, 5), color: '#64748B' },
  ];

  // Normalize to 100
  const total = comp.reduce((s, c) => s + c.percentage, 0);
  comp.forEach(c => c.percentage = Math.round(c.percentage / total * 100));
  const diff = 100 - comp.reduce((s, c) => s + c.percentage, 0);
  comp[0].percentage += diff;

  return comp;
}

const PROJECT_TEMPLATES = [
  { name: 'Alpha Protocol', category: 'defi' as Category, chain: 'ethereum' as Chain },
  { name: 'Nova Finance', category: 'defi' as Category, chain: 'ethereum' as Chain },
  { name: 'Orbit Chain', category: 'l1-l2' as Category, chain: 'ethereum' as Chain },
  { name: 'Vertex Labs', category: 'infrastructure' as Category, chain: 'ethereum' as Chain },
  { name: 'Nexus DAO', category: 'dao' as Category, chain: 'ethereum' as Chain },
  { name: 'Phantom Gaming', category: 'gamefi' as Category, chain: 'solana' as Chain },
  { name: 'Atlas Infrastructure', category: 'infrastructure' as Category, chain: 'solana' as Chain },
  { name: 'Meridian DEX', category: 'defi' as Category, chain: 'arbitrum' as Chain },
  { name: 'Pulse Network', category: 'l1-l2' as Category, chain: 'polygon' as Chain },
  { name: 'Zenith Protocol', category: 'defi' as Category, chain: 'base' as Chain },
  { name: 'Catalyst Labs', category: 'infrastructure' as Category, chain: 'ethereum' as Chain },
  { name: 'Vortex Finance', category: 'defi' as Category, chain: 'arbitrum' as Chain },
  { name: 'Echo Social', category: 'socialfi' as Category, chain: 'solana' as Chain },
  { name: 'Prism Collective', category: 'dao' as Category, chain: 'ethereum' as Chain },
  { name: 'Nebula Gaming', category: 'gamefi' as Category, chain: 'polygon' as Chain },
  { name: 'Quantum Bridge', category: 'infrastructure' as Category, chain: 'arbitrum' as Chain },
  { name: 'Horizon Markets', category: 'defi' as Category, chain: 'ethereum' as Chain },
  { name: 'Flux Protocol', category: 'defi' as Category, chain: 'solana' as Chain },
  { name: 'Sentinel Guard', category: 'infrastructure' as Category, chain: 'ethereum' as Chain },
  { name: 'Pixel Worlds', category: 'nft' as Category, chain: 'solana' as Chain },
  { name: 'Apex Yield', category: 'defi' as Category, chain: 'base' as Chain },
  { name: 'Lunar Network', category: 'l1-l2' as Category, chain: 'polygon' as Chain },
  { name: 'Forge Protocol', category: 'defi' as Category, chain: 'ethereum' as Chain },
  { name: 'Drift Exchange', category: 'defi' as Category, chain: 'solana' as Chain },
  { name: 'Bastion DAO', category: 'dao' as Category, chain: 'arbitrum' as Chain },
  { name: 'Helix Labs', category: 'infrastructure' as Category, chain: 'base' as Chain },
  { name: 'Cosmos Arena', category: 'gamefi' as Category, chain: 'bnb' as Chain },
  { name: 'Vector Finance', category: 'defi' as Category, chain: 'avalanche' as Chain },
  { name: 'Nimbus Cloud', category: 'infrastructure' as Category, chain: 'optimism' as Chain },
  { name: 'Radiant Swap', category: 'defi' as Category, chain: 'arbitrum' as Chain },
  { name: 'Terra Nova', category: 'l1-l2' as Category, chain: 'ethereum' as Chain },
  { name: 'Synapse Hub', category: 'socialfi' as Category, chain: 'base' as Chain },
  { name: 'Ember Finance', category: 'defi' as Category, chain: 'polygon' as Chain },
  { name: 'Arctic Protocol', category: 'defi' as Category, chain: 'ethereum' as Chain },
  { name: 'Phoenix Rise', category: 'dao' as Category, chain: 'solana' as Chain },
  { name: 'Titan Network', category: 'infrastructure' as Category, chain: 'arbitrum' as Chain },
  { name: 'Aegis Shield', category: 'infrastructure' as Category, chain: 'ethereum' as Chain },
  { name: 'Oasis Markets', category: 'defi' as Category, chain: 'bnb' as Chain },
  { name: 'Cipher NFT', category: 'nft' as Category, chain: 'ethereum' as Chain },
  { name: 'Solstice Games', category: 'gamefi' as Category, chain: 'solana' as Chain },
  { name: 'Aether DAO', category: 'dao' as Category, chain: 'ethereum' as Chain },
  { name: 'Ripple Tide', category: 'defi' as Category, chain: 'base' as Chain },
  { name: 'Starlight DeFi', category: 'defi' as Category, chain: 'optimism' as Chain },
  { name: 'Marble Protocol', category: 'nft' as Category, chain: 'polygon' as Chain },
  { name: 'Zephyr Labs', category: 'infrastructure' as Category, chain: 'solana' as Chain },
  { name: 'Cortex AI', category: 'infrastructure' as Category, chain: 'ethereum' as Chain },
  { name: 'Dawn Protocol', category: 'defi' as Category, chain: 'avalanche' as Chain },
  { name: 'Rally Social', category: 'socialfi' as Category, chain: 'polygon' as Chain },
  { name: 'Genesis Vault', category: 'defi' as Category, chain: 'ethereum' as Chain },
  { name: 'Omega Chain', category: 'l1-l2' as Category, chain: 'bnb' as Chain },
];

// Score distribution: 5 at 85+, 15 at 70-84, 15 at 50-69, 10 at 25-49, 5 below 25
const SCORE_BUCKETS: { min: number; max: number; count: number }[] = [
  { min: 87, max: 96, count: 5 },
  { min: 70, max: 84, count: 15 },
  { min: 50, max: 69, count: 15 },
  { min: 25, max: 49, count: 10 },
  { min: 8, max: 24, count: 5 },
];

function generateScores(): number[] {
  const scores: number[] = [];
  for (const bucket of SCORE_BUCKETS) {
    for (let i = 0; i < bucket.count; i++) {
      scores.push(randInt(bucket.min, bucket.max));
    }
  }
  // Shuffle
  for (let i = scores.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [scores[i], scores[j]] = [scores[j], scores[i]];
  }
  return scores;
}

function generateHealthSummary(score: number, project: typeof PROJECT_TEMPLATES[0]): string {
  if (score >= 85) {
    return pick([
      'Strong development activity with diversified treasury and growing community engagement.',
      'Excellent operational health across all metrics. Revenue positive with robust governance practices.',
      'Top-tier project health with active development, strong treasury management, and growing adoption.',
    ]);
  }
  if (score >= 70) {
    return pick([
      'Solid fundamentals with active development team. Treasury diversification could be improved.',
      'Healthy metrics overall. Community growth is steady but governance participation is declining.',
      'Good development velocity and revenue trajectory. Minor concerns around token concentration in treasury.',
    ]);
  }
  if (score >= 50) {
    return pick([
      'Development activity has slowed. Treasury runway is adequate but burn rate is concerning.',
      'Community metrics are mixed with declining DAU/MAU ratio. Revenue shows signs of stabilization.',
      'Moderate risk profile. Development team is active but treasury concentration in native token is high.',
    ]);
  }
  if (score >= 25) {
    return pick([
      'Critical concerns around treasury runway and declining development activity.',
      'Revenue declining with high burn rate. Community churn is accelerating. Needs immediate attention.',
      'Limited development activity and shrinking community. Treasury runway is below 6 months.',
    ]);
  }
  return pick([
    'Severe operational concerns. Minimal development activity, depleted treasury, and no revenue.',
    'Project shows minimal signs of active development. Treasury is nearly depleted with no clear path to sustainability.',
    'Terminal state: no recent commits, treasury below 3 months runway, community has largely abandoned the project.',
  ]);
}

function generateProject(template: typeof PROJECT_TEMPLATES[0], score: number, index: number): Project {
  const slug = template.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const trend24h = randBetween(-5, 5);

  // Treasury correlates with score
  const treasuryBase = score > 70 ? randBetween(5_000_000, 200_000_000) :
                       score > 40 ? randBetween(500_000, 20_000_000) :
                       randBetween(50_000, 2_000_000);
  const monthlyBurn = score > 70 ? randBetween(50_000, 500_000) :
                      score > 40 ? randBetween(100_000, 800_000) :
                      randBetween(200_000, 1_000_000);
  const runwayMonths = Math.round(treasuryBase / monthlyBurn);
  const stablecoinRatio = score > 70 ? randBetween(0.25, 0.50) :
                          score > 40 ? randBetween(0.10, 0.35) :
                          randBetween(0.0, 0.15);

  // Dev activity correlates with score
  const activeDevs = score > 70 ? randInt(8, 35) : score > 40 ? randInt(3, 12) : randInt(0, 4);
  const commits30d = activeDevs * randInt(8, 30);

  // Community
  const dauBase = score > 70 ? randBetween(5000, 100000) : score > 40 ? randBetween(500, 10000) : randBetween(50, 1000);

  // Revenue
  const monthlyRevenue = score > 70 ? randBetween(50_000, 500_000) :
                         score > 40 ? randBetween(5_000, 80_000) :
                         randBetween(0, 5_000);
  const revenueTrend: RevenueTrend = score > 70 ? pick(['growing', 'stable']) :
                                     score > 40 ? pick(['stable', 'declining', 'growing']) :
                                     pick(['declining', 'declining', 'stable']);

  const badges: string[] = [];
  if (score >= 85) badges.push('verified');
  if (runwayMonths > 24) badges.push('vault-active');
  if (score >= 70 && activeDevs > 10) badges.push('mesh-member');

  return {
    id: `proj-${index.toString().padStart(3, '0')}`,
    slug,
    name: template.name,
    chain: template.chain,
    category: template.category,
    vitalisScore: score,
    scoreHistory: generateScoreHistory(score, 90),
    scoreTrend24h: Math.round(trend24h * 10) / 10,
    treasury: {
      totalUsd: Math.round(treasuryBase),
      runwayMonths: Math.min(runwayMonths, 60),
      diversificationGrade: scoreToGrade(score + 5),
      composition: generateTreasuryComposition(score),
      stablecoinRatio: Math.round(stablecoinRatio * 100) / 100,
      monthlyBurnUsd: Math.round(monthlyBurn),
    },
    development: {
      commits30d,
      activeDevs,
      prMergeTimeHours: score > 70 ? Math.round(randBetween(1, 8) * 10) / 10 :
                        score > 40 ? Math.round(randBetween(4, 24) * 10) / 10 :
                        Math.round(randBetween(12, 72) * 10) / 10,
      lastDeployDaysAgo: score > 70 ? randInt(0, 5) : score > 40 ? randInt(3, 21) : randInt(14, 90),
      weeklyCommits: generateWeeklyCommits(activeDevs, 12),
      grade: scoreToGrade(score),
    },
    community: {
      dauMauRatio: score > 70 ? Math.round(randBetween(0.25, 0.50) * 100) / 100 :
                   score > 40 ? Math.round(randBetween(0.10, 0.30) * 100) / 100 :
                   Math.round(randBetween(0.02, 0.12) * 100) / 100,
      holderGrowth30d: score > 70 ? Math.round(randBetween(3, 15) * 10) / 10 :
                       score > 40 ? Math.round(randBetween(-2, 8) * 10) / 10 :
                       Math.round(randBetween(-15, 0) * 10) / 10,
      giniCoefficient: Math.round(randBetween(0.35, 0.85) * 100) / 100,
      churnRate: score > 70 ? Math.round(randBetween(1, 5) * 10) / 10 :
                 score > 40 ? Math.round(randBetween(4, 12) * 10) / 10 :
                 Math.round(randBetween(10, 25) * 10) / 10,
      dauHistory: generateDAUHistory(dauBase, 90),
    },
    revenue: {
      monthlyRevenueUsd: Math.round(monthlyRevenue),
      nonTokenIncomePercent: score > 70 ? Math.round(randBetween(40, 80)) :
                             score > 40 ? Math.round(randBetween(15, 50)) :
                             Math.round(randBetween(0, 20)),
      burnMultiple: monthlyRevenue > 0 ? Math.round(monthlyRevenue / monthlyBurn * 10) / 10 : 0,
      trend: revenueTrend,
      monthlyHistory: generateMonthlyRevenue(monthlyRevenue, revenueTrend, 6),
      isRevenuePositive: monthlyRevenue > monthlyBurn * 0.5,
    },
    governance: {
      lastAuditDaysAgo: score > 70 ? randInt(10, 90) : score > 40 ? randInt(60, 365) : randInt(180, 730),
      voterParticipation: score > 70 ? Math.round(randBetween(8, 25) * 10) / 10 :
                          score > 40 ? Math.round(randBetween(3, 12) * 10) / 10 :
                          Math.round(randBetween(0.5, 5) * 10) / 10,
      multisig: score > 70 ? pick(['4/7', '5/9', '3/5']) :
                score > 40 ? pick(['3/5', '2/3', '2/5']) :
                pick(['1/3', '2/3', '1/1']),
      bugBountyActive: score > 60 ? rand() > 0.2 : rand() > 0.7,
    },
    healthSummary: generateHealthSummary(score, template),
    badges,
  };
}

const scores = generateScores();
export const projects: Project[] = PROJECT_TEMPLATES.map((template, i) =>
  generateProject(template, scores[i], i)
).sort((a, b) => b.vitalisScore - a.vitalisScore);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug);
}

export function getProjectsByChain(chain: Chain): Project[] {
  return projects.filter(p => p.chain === chain);
}

export function getProjectsByCategory(category: Category): Project[] {
  return projects.filter(p => p.category === category);
}

const ecosystemBase: EcosystemData[] = [
  { chain: 'ethereum', name: 'Ethereum', projectCount: 0, avgScore: 0, atRiskPercent: 0, totalTreasury: 0, color: '#627EEA' },
  { chain: 'solana', name: 'Solana', projectCount: 0, avgScore: 0, atRiskPercent: 0, totalTreasury: 0, color: '#9945FF' },
  { chain: 'arbitrum', name: 'Arbitrum', projectCount: 0, avgScore: 0, atRiskPercent: 0, totalTreasury: 0, color: '#28A0F0' },
  { chain: 'base', name: 'Base', projectCount: 0, avgScore: 0, atRiskPercent: 0, totalTreasury: 0, color: '#0052FF' },
  { chain: 'polygon', name: 'Polygon', projectCount: 0, avgScore: 0, atRiskPercent: 0, totalTreasury: 0, color: '#8247E5' },
  { chain: 'bnb', name: 'BNB Chain', projectCount: 0, avgScore: 0, atRiskPercent: 0, totalTreasury: 0, color: '#F0B90B' },
  { chain: 'optimism', name: 'Optimism', projectCount: 0, avgScore: 0, atRiskPercent: 0, totalTreasury: 0, color: '#FF0420' },
  { chain: 'avalanche', name: 'Avalanche', projectCount: 0, avgScore: 0, atRiskPercent: 0, totalTreasury: 0, color: '#E84142' },
];

export const ecosystemData: EcosystemData[] = ecosystemBase.map(eco => {
  const chainProjects = projects.filter(p => p.chain === eco.chain);
  return {
    ...eco,
    projectCount: chainProjects.length,
    avgScore: chainProjects.length > 0
      ? Math.round(chainProjects.reduce((s, p) => s + p.vitalisScore, 0) / chainProjects.length)
      : 0,
    atRiskPercent: chainProjects.length > 0
      ? Math.round(chainProjects.filter(p => p.vitalisScore < 50).length / chainProjects.length * 100)
      : 0,
    totalTreasury: chainProjects.reduce((s, p) => s + p.treasury.totalUsd, 0),
  };
});

// Global stats
export const globalStats = {
  totalProjects: projects.length,
  avgScore: Math.round(projects.reduce((s, p) => s + p.vitalisScore, 0) / projects.length),
  atRiskCount: projects.filter(p => p.vitalisScore < 50).length,
  totalTreasury: projects.reduce((s, p) => s + p.treasury.totalUsd, 0),
};
