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
  let current = baseScore + randBetween(-10, 10);
  for (let i = 0; i < days; i++) {
    current += randBetween(-2.5, 2.5);
    current = Math.max(0, Math.min(100, current));
    history.push(Math.round(current));
  }
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

  const total = comp.reduce((s, c) => s + c.percentage, 0);
  comp.forEach(c => c.percentage = Math.round(c.percentage / total * 100));
  const diff = 100 - comp.reduce((s, c) => s + c.percentage, 0);
  comp[0].percentage += diff;

  return comp;
}

// 200 project names generated from prefix + suffix pools
const PREFIXES = [
  'Alpha', 'Nova', 'Orbit', 'Vertex', 'Nexus', 'Phantom', 'Atlas', 'Forge', 'Helix', 'Cipher',
  'Prism', 'Quantum', 'Vortex', 'Horizon', 'Pulse', 'Drift', 'Echo', 'Flux', 'Ember', 'Onyx',
  'Aero', 'Bolt', 'Crest', 'Dawn', 'Edge', 'Fuse', 'Grid', 'Hive', 'Ion', 'Jade',
  'Kite', 'Loom', 'Mesa', 'Node', 'Opal', 'Peak', 'Quill', 'Reef', 'Silk', 'Tide',
  'Umbra', 'Vale', 'Wave', 'Xeno', 'Yield', 'Zephyr', 'Arch', 'Bloom', 'Core', 'Dusk',
  'Flint', 'Glow', 'Helm', 'Ink', 'Jolt', 'Keen', 'Lynx', 'Mist', 'Neon', 'Orion',
  'Pine', 'Rune', 'Sage', 'Thorn', 'Void', 'Wren', 'Apex', 'Blaze', 'Cliff', 'Drake',
];

const SUFFIXES = [
  'Protocol', 'Finance', 'Labs', 'Chain', 'Network', 'DAO', 'Exchange', 'Vault', 'Markets', 'Studio',
  'Gaming', 'Hub', 'Bridge', 'Layer', 'Swap', 'Lend', 'Pay', 'Social', 'Guard', 'Shield',
  'Link', 'Mint', 'Pool', 'Port', 'Sync', 'Trade', 'Trust', 'Works', 'Zone', 'Capital',
];

const CHAINS_LIST: Chain[] = ['ethereum', 'solana', 'arbitrum', 'base', 'polygon', 'bnb', 'optimism', 'avalanche'];
const CATEGORIES_LIST: Category[] = ['defi', 'gamefi', 'infrastructure', 'nft', 'l1-l2', 'dao', 'socialfi'];

// Chain weight distribution (more projects on major chains)
const CHAIN_WEIGHTS: { chain: Chain; weight: number }[] = [
  { chain: 'ethereum', weight: 30 },
  { chain: 'solana', weight: 18 },
  { chain: 'arbitrum', weight: 15 },
  { chain: 'base', weight: 12 },
  { chain: 'polygon', weight: 10 },
  { chain: 'bnb', weight: 7 },
  { chain: 'optimism', weight: 5 },
  { chain: 'avalanche', weight: 3 },
];

function pickWeightedChain(): Chain {
  const total = CHAIN_WEIGHTS.reduce((s, c) => s + c.weight, 0);
  let r = rand() * total;
  for (const { chain, weight } of CHAIN_WEIGHTS) {
    r -= weight;
    if (r <= 0) return chain;
  }
  return 'ethereum';
}

function generateProjectTemplates(count: number) {
  const usedNames = new Set<string>();
  const templates: { name: string; category: Category; chain: Chain }[] = [];

  for (let i = 0; i < count; i++) {
    let name = '';
    let attempts = 0;
    do {
      const prefix = PREFIXES[Math.floor(rand() * PREFIXES.length)];
      const suffix = SUFFIXES[Math.floor(rand() * SUFFIXES.length)];
      name = `${prefix} ${suffix}`;
      attempts++;
    } while (usedNames.has(name) && attempts < 50);
    usedNames.add(name);

    templates.push({
      name,
      category: CATEGORIES_LIST[Math.floor(rand() * CATEGORIES_LIST.length)],
      chain: pickWeightedChain(),
    });
  }

  return templates;
}

// Score distribution for 200 projects:
// ~20 at 85+, ~60 at 70-84, ~60 at 50-69, ~40 at 25-49, ~20 below 25
const SCORE_BUCKETS: { min: number; max: number; count: number }[] = [
  { min: 85, max: 97, count: 20 },
  { min: 70, max: 84, count: 60 },
  { min: 50, max: 69, count: 60 },
  { min: 25, max: 49, count: 40 },
  { min: 5, max: 24, count: 20 },
];

function generateScores(total: number): number[] {
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
  return scores.slice(0, total);
}

function generateHealthSummary(score: number): string {
  if (score >= 85) {
    return pick([
      'Strong development activity with diversified treasury and growing community engagement.',
      'Excellent operational health across all metrics. Revenue positive with robust governance practices.',
      'Top-tier project health with active development, strong treasury management, and growing adoption.',
      'Outstanding fundamentals. Multiple revenue streams, active contributor base, and strong governance.',
    ]);
  }
  if (score >= 70) {
    return pick([
      'Solid fundamentals with active development team. Treasury diversification could be improved.',
      'Healthy metrics overall. Community growth is steady but governance participation is declining.',
      'Good development velocity and revenue trajectory. Minor concerns around token concentration in treasury.',
      'Stable project with consistent development output. Revenue growing but still dependent on token incentives.',
    ]);
  }
  if (score >= 50) {
    return pick([
      'Development activity has slowed. Treasury runway is adequate but burn rate is concerning.',
      'Community metrics are mixed with declining DAU/MAU ratio. Revenue shows signs of stabilization.',
      'Moderate risk profile. Development team is active but treasury concentration in native token is high.',
      'Declining community engagement paired with adequate treasury. Development pace has dropped in recent weeks.',
    ]);
  }
  if (score >= 25) {
    return pick([
      'Critical concerns around treasury runway and declining development activity.',
      'Revenue declining with high burn rate. Community churn is accelerating. Needs immediate attention.',
      'Limited development activity and shrinking community. Treasury runway is below 6 months.',
      'Severe decline in key metrics. Governance participation near zero, treasury reserves dwindling rapidly.',
    ]);
  }
  return pick([
    'Severe operational concerns. Minimal development activity, depleted treasury, and no revenue.',
    'Project shows minimal signs of active development. Treasury is nearly depleted with no clear path to sustainability.',
    'Terminal state: no recent commits, treasury below 3 months runway, community has largely abandoned the project.',
    'Effectively abandoned. No meaningful development, negligible community activity, treasury approaching zero.',
  ]);
}

function generateProject(template: { name: string; category: Category; chain: Chain }, score: number, index: number): Project {
  const slug = template.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  // ~40% negative trends for bear market realism
  const trend24h = rand() < 0.4 ? randBetween(-4.5, -0.1) : randBetween(0.1, 4.5);

  // Treasury and runway — realistic, correlated with score
  const treasuryBase = score >= 85 ? randBetween(20_000_000, 200_000_000) :
                       score >= 70 ? randBetween(3_000_000, 50_000_000) :
                       score >= 50 ? randBetween(500_000, 10_000_000) :
                       score >= 25 ? randBetween(100_000, 3_000_000) :
                       randBetween(10_000, 500_000);

  const monthlyBurn = score >= 85 ? randBetween(100_000, 600_000) :
                      score >= 70 ? randBetween(80_000, 400_000) :
                      score >= 50 ? randBetween(60_000, 350_000) :
                      score >= 25 ? randBetween(80_000, 500_000) :
                      randBetween(50_000, 300_000);

  // Runway: directly control by score tier for realistic distribution
  let runwayMonths: number;
  if (score >= 85) {
    runwayMonths = randInt(36, 60);      // 3-5 years
  } else if (score >= 70) {
    runwayMonths = randInt(12, 36);      // 1-3 years
  } else if (score >= 50) {
    runwayMonths = randInt(4, 14);       // 4-14 months
  } else if (score >= 25) {
    runwayMonths = randInt(1, 6);        // 1-6 months
  } else {
    runwayMonths = randInt(0, 2);        // 0-2 months
  }

  const stablecoinRatio = score > 70 ? randBetween(0.25, 0.50) :
                          score > 40 ? randBetween(0.10, 0.35) :
                          randBetween(0.0, 0.15);

  // Dev activity correlates with score
  const activeDevs = score >= 85 ? randInt(12, 40) :
                     score >= 70 ? randInt(6, 20) :
                     score >= 50 ? randInt(3, 12) :
                     score >= 25 ? randInt(1, 5) :
                     randInt(0, 2);
  const commits30d = activeDevs * randInt(6, 25);

  // Community
  const dauBase = score >= 85 ? randBetween(20000, 150000) :
                  score >= 70 ? randBetween(3000, 40000) :
                  score >= 50 ? randBetween(500, 8000) :
                  score >= 25 ? randBetween(100, 2000) :
                  randBetween(10, 300);

  // Revenue
  const monthlyRevenue = score >= 85 ? randBetween(100_000, 800_000) :
                         score >= 70 ? randBetween(30_000, 200_000) :
                         score >= 50 ? randBetween(5_000, 60_000) :
                         score >= 25 ? randBetween(0, 10_000) :
                         randBetween(0, 1_000);
  const revenueTrend: RevenueTrend = score >= 70 ? pick(['growing', 'growing', 'stable']) :
                                     score >= 50 ? pick(['stable', 'declining', 'growing']) :
                                     pick(['declining', 'declining', 'stable']);

  const badges: string[] = [];
  if (score >= 85) badges.push('verified');
  if (runwayMonths > 24) badges.push('vault-active');
  if (score >= 70 && activeDevs > 10) badges.push('mesh-member');

  // Generate sub-scores with realistic variance from main score
  const subScoreNoise = (seed: number) => Math.max(0, Math.min(100, score + Math.round(((seed * 17 + 7) % 15) - 7)));

  return {
    id: `proj-${index.toString().padStart(3, '0')}`,
    slug,
    name: template.name,
    chain: template.chain,
    category: template.category,
    vitalisScore: score,
    scoreHistory: generateScoreHistory(score, 90),
    scoreTrend24h: Math.round(trend24h * 10) / 10,
    subScores: {
      treasury: subScoreNoise(1),
      development: subScoreNoise(2),
      community: subScoreNoise(3),
      revenue: subScoreNoise(4),
      governance: subScoreNoise(5),
    },
    treasury: {
      totalUsd: Math.round(treasuryBase),
      runwayMonths,
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
                       score > 40 ? Math.round(randBetween(-5, 8) * 10) / 10 :
                       Math.round(randBetween(-20, -1) * 10) / 10,
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
    healthSummary: generateHealthSummary(score),
    badges,
  };
}

const PROJECT_COUNT = 200;
const templates = generateProjectTemplates(PROJECT_COUNT);
const scores = generateScores(PROJECT_COUNT);

export const projects: Project[] = templates.map((template, i) =>
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
