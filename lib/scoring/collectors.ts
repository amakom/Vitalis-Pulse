// ════════════════════════════════════════════
// DATA COLLECTORS — fetch from GitHub, DefiLlama, CoinGecko
// ════════════════════════════════════════════

export interface GitHubData {
  commits_30d: number;
  active_devs: number;
  pr_merge_hours: number;
  last_push_days: number;
  weekly_commits: number[];
}

export interface DefiLlamaData {
  tvl: number;
  monthly_revenue: number;
  monthly_fees: number;
  revenue_history: number[]; // last 6 months
}

export interface CoinGeckoData {
  price: number;
  market_cap: number;
  price_change_30d: number;
  ath: number;
  ath_change_pct: number;
  logo_url: string | null;
  // Community data
  twitter_followers: number;
  telegram_members: number;
  reddit_subscribers: number;
  total_community: number; // sum of all community channels
}

// ── Helpers ──────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function safeFetch(url: string, headers?: Record<string, string>): Promise<any | null> {
  try {
    await sleep(500);
    const resp = await fetch(url, {
      headers: headers || {},
      cache: 'no-store',
    });
    if (!resp.ok) {
      console.warn(`API ${resp.status}: ${url}`);
      return null;
    }
    return await resp.json();
  } catch (err) {
    console.error(`Fetch error: ${url}`, err);
    return null;
  }
}

function githubHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  if (!token || token === 'your_github_personal_access_token') return {};
  return {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json',
  };
}

// ── GitHub Collector ─────────────────────────

export async function collectGitHubData(repos: string[]): Promise<GitHubData> {
  const empty: GitHubData = {
    commits_30d: 0,
    active_devs: 0,
    pr_merge_hours: 0,
    last_push_days: 999,
    weekly_commits: [],
  };

  if (!repos || repos.length === 0) return empty;

  const headers = githubHeaders();
  let totalCommits30d = 0;
  const allDevs = new Set<string>();
  let totalPrHours = 0;
  let prCount = 0;
  let earliestPushDays = 999;
  let weeklyCommitsAgg: number[] = [];

  for (const repo of repos) {
    // 1. Weekly commit activity (last 52 weeks)
    const commitActivity = await safeFetch(
      `https://api.github.com/repos/${repo}/stats/commit_activity`,
      headers
    );
    if (Array.isArray(commitActivity)) {
      // Last 4 weeks = ~30 days
      const last4 = commitActivity.slice(-4);
      const repoCommits30d = last4.reduce((sum: number, w: any) => sum + (w.total || 0), 0);
      totalCommits30d += repoCommits30d;

      // Weekly commits for chart (last 12 weeks)
      const last12 = commitActivity.slice(-12);
      const weeklyNums = last12.map((w: any) => w.total || 0);
      if (weeklyCommitsAgg.length === 0) {
        weeklyCommitsAgg = weeklyNums;
      } else {
        for (let i = 0; i < weeklyNums.length; i++) {
          weeklyCommitsAgg[i] = (weeklyCommitsAgg[i] || 0) + weeklyNums[i];
        }
      }
    }

    // 2. Contributors (active dev count)
    const contributors = await safeFetch(
      `https://api.github.com/repos/${repo}/contributors?per_page=100`,
      headers
    );
    if (Array.isArray(contributors)) {
      contributors.forEach((c: any) => {
        if (c.login) allDevs.add(c.login);
      });
    }

    // 3. Closed PRs (merge time)
    const pulls = await safeFetch(
      `https://api.github.com/repos/${repo}/pulls?state=closed&sort=updated&direction=desc&per_page=20`,
      headers
    );
    if (Array.isArray(pulls)) {
      for (const pr of pulls) {
        if (pr.merged_at && pr.created_at) {
          const created = new Date(pr.created_at).getTime();
          const merged = new Date(pr.merged_at).getTime();
          const hours = (merged - created) / (1000 * 60 * 60);
          if (hours > 0 && hours < 10000) {
            totalPrHours += hours;
            prCount++;
          }
        }
      }
    }

    // 4. Last push date
    const repoInfo = await safeFetch(
      `https://api.github.com/repos/${repo}`,
      headers
    );
    if (repoInfo && repoInfo.pushed_at) {
      const pushDate = new Date(repoInfo.pushed_at).getTime();
      const daysSincePush = Math.floor((Date.now() - pushDate) / (1000 * 60 * 60 * 24));
      if (daysSincePush < earliestPushDays) {
        earliestPushDays = daysSincePush;
      }
    }
  }

  return {
    commits_30d: totalCommits30d,
    active_devs: allDevs.size,
    pr_merge_hours: prCount > 0 ? Math.round(totalPrHours / prCount) : 0,
    last_push_days: earliestPushDays,
    weekly_commits: weeklyCommitsAgg,
  };
}

// ── DefiLlama Collector ──────────────────────

export async function collectDefiLlamaData(slug: string): Promise<DefiLlamaData> {
  const empty: DefiLlamaData = {
    tvl: 0,
    monthly_revenue: 0,
    monthly_fees: 0,
    revenue_history: [],
  };

  if (!slug) return empty;

  // 1. TVL
  const tvlData = await safeFetch(`https://api.llama.fi/tvl/${slug}`);
  const tvl = typeof tvlData === 'number' ? tvlData : 0;

  // 2. Revenue (daily)
  const revenueData = await safeFetch(
    `https://api.llama.fi/summary/fees/${slug}?dataType=dailyRevenue`
  );
  let monthlyRevenue = 0;
  let revenueHistory: number[] = [];
  if (revenueData && revenueData.totalDataChart) {
    const chart: [number, number][] = revenueData.totalDataChart;
    // Last 30 entries = ~30 days of revenue
    const last30 = chart.slice(-30);
    monthlyRevenue = last30.reduce((sum, [, val]) => sum + (val || 0), 0);

    // Build 6-month history (group by ~30-day chunks)
    const last180 = chart.slice(-180);
    for (let i = 0; i < 6; i++) {
      const chunk = last180.slice(i * 30, (i + 1) * 30);
      const monthTotal = chunk.reduce((sum, [, val]) => sum + (val || 0), 0);
      revenueHistory.push(Math.round(monthTotal));
    }
  }

  // 3. Fees (daily)
  const feesData = await safeFetch(
    `https://api.llama.fi/summary/fees/${slug}?dataType=dailyFees`
  );
  let monthlyFees = 0;
  if (feesData && feesData.totalDataChart) {
    const chart: [number, number][] = feesData.totalDataChart;
    const last30 = chart.slice(-30);
    monthlyFees = last30.reduce((sum, [, val]) => sum + (val || 0), 0);
  }

  return {
    tvl,
    monthly_revenue: Math.round(monthlyRevenue),
    monthly_fees: Math.round(monthlyFees),
    revenue_history: revenueHistory,
  };
}

// ── CoinGecko Collector ──────────────────────

export async function collectCoinGeckoData(coinId: string): Promise<CoinGeckoData> {
  const empty: CoinGeckoData = {
    price: 0,
    market_cap: 0,
    price_change_30d: 0,
    ath: 0,
    ath_change_pct: 0,
    logo_url: null,
    twitter_followers: 0,
    telegram_members: 0,
    reddit_subscribers: 0,
    total_community: 0,
  };

  if (!coinId) return empty;

  const data = await safeFetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false`
  );

  if (!data || !data.market_data) return empty;

  const md = data.market_data;
  const cd = data.community_data || {};

  const twitterFollowers = cd.twitter_followers || 0;
  const telegramMembers = cd.telegram_channel_user_count || 0;
  const redditSubscribers = cd.reddit_subscribers || 0;
  const totalCommunity = twitterFollowers + telegramMembers + redditSubscribers;

  return {
    price: md.current_price?.usd || 0,
    market_cap: md.market_cap?.usd || 0,
    price_change_30d: md.price_change_percentage_30d || 0,
    ath: md.ath?.usd || 0,
    ath_change_pct: md.ath_change_percentage?.usd || 0,
    logo_url: data.image?.small || data.image?.thumb || null,
    twitter_followers: twitterFollowers,
    telegram_members: telegramMembers,
    reddit_subscribers: redditSubscribers,
    total_community: totalCommunity,
  };
}
