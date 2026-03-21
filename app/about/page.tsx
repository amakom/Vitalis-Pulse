'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, ExternalLink, Github, Twitter, ArrowRight } from 'lucide-react';
import { SCORE_TIERS } from '@/lib/constants';

const METHODOLOGY = [
  {
    title: 'Treasury Health',
    weight: 30,
    color: '#14B8A6',
    description: 'Evaluates the sustainability of a project\'s financial reserves. Factors include total treasury value (TVL as proxy), runway estimation based on burn rate, diversification across asset types, stablecoin ratios, and ATH drawdown resilience.',
    metrics: ['Treasury size (TVL)', 'Estimated runway', 'Diversification grade', 'Stablecoin ratio', 'Monthly burn rate'],
    sources: ['DefiLlama', 'On-chain wallet data'],
  },
  {
    title: 'Development Activity',
    weight: 25,
    color: '#10B981',
    description: 'Measures the pace and quality of technical development. Metrics include 30-day commit frequency, active developer count, PR merge velocity, last push recency, and weekly commit trends.',
    metrics: ['Commits (30d)', 'Active developers', 'PR merge time', 'Last push recency', 'Weekly commit trends'],
    sources: ['GitHub API'],
  },
  {
    title: 'Community & Retention',
    weight: 20,
    color: '#F59E0B',
    description: 'Assesses the health and engagement of the project\'s user base using on-chain and market signals. Key metrics include market cap, TVL/market cap ratio, 30-day price momentum, and holder distribution.',
    metrics: ['Market cap', 'TVL/market cap ratio', '30d price change', 'Holder distribution'],
    sources: ['CoinGecko', 'DefiLlama'],
  },
  {
    title: 'Revenue & Sustainability',
    weight: 15,
    color: '#8B5CF6',
    description: 'Evaluates the project\'s path to financial sustainability. Considers monthly protocol revenue, revenue trend direction, TVL as business scale indicator, and revenue efficiency relative to market cap.',
    metrics: ['Monthly revenue', 'Revenue trend', 'TVL scale', 'Revenue/market cap efficiency'],
    sources: ['DefiLlama (fees & revenue)', 'CoinGecko'],
  },
  {
    title: 'Governance & Security',
    weight: 10,
    color: '#627EEA',
    description: 'Reviews the project\'s governance model and security posture. Includes governance type classification, open-source presence, development team size as proxy for decentralization, and public treasury transparency.',
    metrics: ['Governance type', 'Open-source repos', 'Dev team size', 'Treasury transparency'],
    sources: ['GitHub API', 'Project metadata'],
  },
];

const DATA_SOURCES = [
  { name: 'DefiLlama', what: 'TVL, protocol revenue, fees, treasury data', url: 'https://defillama.com' },
  { name: 'CoinGecko', what: 'Market cap, price data, ATH metrics, trading volume', url: 'https://coingecko.com' },
  { name: 'GitHub API', what: 'Commit history, active developers, PR velocity, repo health', url: 'https://github.com' },
];

const ROADMAP = [
  {
    phase: 'Foundation',
    period: 'Q1 2026',
    status: 'current' as const,
    description: 'Launch the core scoring platform with automated data pipelines and public API access.',
    items: [
      { text: 'Launch MVP dashboard with 20+ projects scored', done: true },
      { text: 'Automated daily scoring pipeline (Supabase + Vercel Cron)', done: true },
      { text: 'Public REST API endpoints for score data', done: true },
      { text: 'Embeddable SVG score badges for project READMEs', done: true },
      { text: 'Scoring methodology documentation', done: true },
      { text: 'Project submission and review pipeline', done: false },
    ],
  },
  {
    phase: 'Arbitrum Ecosystem Coverage',
    period: 'Q2 2026',
    status: 'next' as const,
    description: 'Deep coverage of every active Arbitrum project with enhanced on-chain data integration.',
    items: [
      { text: 'Expand to 50+ Arbitrum DeFi, infrastructure, and governance projects', done: false },
      { text: 'On-chain treasury wallet monitoring for verified addresses', done: false },
      { text: 'Weekly Arbitrum ecosystem health reports', done: false },
      { text: 'Full API documentation with developer guides', done: false },
      { text: 'Arbitrum Foundation partnership for ecosystem visibility', done: false },
    ],
  },
  {
    phase: 'Multi-Chain Expansion',
    period: 'Q3–Q4 2026',
    status: 'future' as const,
    description: 'Scale scoring infrastructure to Optimism, Base, and Ethereum mainnet with advanced analytics.',
    items: [
      { text: 'Expand coverage to Optimism, Base, and Ethereum L1 projects', done: false },
      { text: 'Email alerts and watchlist notifications for score changes', done: false },
      { text: 'Ecosystem benchmark reports with cross-chain comparisons', done: false },
      { text: 'Historical score analytics and trend analysis', done: false },
      { text: 'First annual "State of Web3 Health" report', done: false },
    ],
  },
  {
    phase: 'Protocol Infrastructure',
    period: '2027',
    status: 'future' as const,
    description: 'Evolve from a dashboard into core Web3 infrastructure — tools that help projects survive.',
    items: [
      { text: 'Vitalis Vault — Adaptive treasury management recommendations', done: false },
      { text: 'Vitalis Mesh — Curated service marketplace for Web3 projects', done: false },
      { text: 'Enterprise API tier for VCs, funds, and institutional researchers', done: false },
      { text: 'Establish Vitalis Score as the industry standard for due diligence', done: false },
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: 'Is VitalisPulse free?',
    answer: 'Yes. The public dashboard and all project scores are free forever. We believe transparency in Web3 project health benefits the entire ecosystem. Premium features like full API access, custom alerts, and extended history will be available in paid tiers.',
  },
  {
    question: 'How often are scores updated?',
    answer: 'Scores are recalculated daily using the latest data from DefiLlama, CoinGecko, and GitHub. Treasury and revenue data updates as new on-chain transactions are indexed by our data providers.',
  },
  {
    question: 'Can projects manipulate their score?',
    answer: 'We employ multiple anti-gaming measures: commit quality analysis filters trivial changes, on-chain metrics can\'t be faked, revenue data comes from verified protocol contracts via DefiLlama, and scores use rolling averages that resist short-term manipulation.',
  },
  {
    question: 'How do I get my project scored?',
    answer: 'Submit your project through the "Get Scored" page with your project\'s GitHub, DefiLlama slug, and CoinGecko ID. We\'ll review and add it within 48 hours. Projects need at minimum a public GitHub repository and on-chain presence.',
  },
  {
    question: 'What chains are supported?',
    answer: 'We currently score projects on Ethereum, Arbitrum, Optimism, Base, Solana, Polygon, BNB Chain, and Avalanche. Our primary focus is the Arbitrum ecosystem, with deep coverage of all major DeFi and infrastructure projects on the chain.',
  },
  {
    question: 'Is there an API?',
    answer: 'Yes! We have public API endpoints at /api/v1/scores and /api/v1/scores/[slug] that return JSON score data. Embeddable SVG badges are available at /api/v1/badge/[slug]. Full API documentation is coming soon.',
  },
  {
    question: 'Who built this?',
    answer: 'VitalisPulse is an independent, open-source project built by a small team of Web3 builders. The project is community-driven and transparent. Follow @vitalispulse on X for updates and join our community.',
  },
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openMethodology, setOpenMethodology] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-6">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-teal">
            <path d="M3 12h4l3-9 4 18 3-9h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-2xl font-bold">VitalisPulse</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">The Heartbeat of Web3</h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
          Free, real-time health scoring for Web3 projects. Think credit scores, but for crypto.
        </p>
      </div>

      {/* Why This Exists */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Why VitalisPulse Exists</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Every market cycle, <strong className="text-foreground">70–80% of Web3 projects die</strong> — not because of bad technology, but because of operational collapse: treasury mismanagement, zero real revenue, contributor flight, and governance paralysis.
          </p>
          <p>
            Investors, community members, and even project teams have no reliable way to assess operational health before it&apos;s too late. TVL and token price tell you how much money is locked or what the market thinks — but they don&apos;t tell you if a project can <em>survive</em>.
          </p>
          <p>
            VitalisPulse changes that. We aggregate on-chain data, development activity, revenue metrics, and governance signals into a single <strong className="text-foreground">Vitalis Score (0–100)</strong> that reflects a project&apos;s real operational health and sustainability.
          </p>
        </div>
      </section>

      {/* How the score works */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">How the Vitalis Score Works</h2>
        <p className="mb-2 text-muted-foreground">
          The Vitalis Score is a weighted composite of five health dimensions:
        </p>
        <p className="mb-6 text-sm text-muted-foreground font-mono">
          Score = (Treasury × 0.30) + (Development × 0.25) + (Community × 0.20) + (Revenue × 0.15) + (Governance × 0.10)
        </p>

        {/* Stacked weight bar */}
        <div className="mb-6 overflow-hidden rounded-full">
          <div className="flex h-8">
            {METHODOLOGY.map(m => (
              <div
                key={m.title}
                className="flex items-center justify-center text-xs font-bold text-white"
                style={{ width: `${m.weight}%`, backgroundColor: m.color }}
              >
                {m.weight}%
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {METHODOLOGY.map(m => (
            <span key={m.title} className="inline-flex items-center gap-1.5 text-sm">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: m.color }} />
              {m.title}
            </span>
          ))}
        </div>
      </section>

      {/* Scoring Methodology with expandable details */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Scoring Methodology</h2>
        <div className="space-y-3">
          {METHODOLOGY.map((m, i) => (
            <div key={m.title} className="rounded-xl border border-border bg-card overflow-hidden">
              <button
                onClick={() => setOpenMethodology(openMethodology === i ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: m.color }} />
                  <h3 className="text-lg font-semibold">{m.title}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-sm font-bold"
                    style={{ backgroundColor: `${m.color}20`, color: m.color }}
                  >
                    {m.weight}%
                  </span>
                  {openMethodology === i ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>
              {openMethodology === i && (
                <div className="border-t border-border px-5 pb-5 pt-4 space-y-4">
                  <p className="text-sm text-muted-foreground">{m.description}</p>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">METRICS</p>
                    <div className="flex flex-wrap gap-2">
                      {m.metrics.map(metric => (
                        <span key={metric} className="rounded-full bg-muted px-2.5 py-1 text-xs">{metric}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">DATA SOURCES</p>
                    <div className="flex flex-wrap gap-2">
                      {m.sources.map(source => (
                        <span key={source} className="rounded-full bg-teal/10 px-2.5 py-1 text-xs text-teal">{source}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Data Sources */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Data Sources</h2>
        <p className="mb-6 text-muted-foreground">
          All scores are derived from publicly verifiable data. We never use self-reported metrics.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {DATA_SOURCES.map(src => (
            <a
              key={src.name}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-teal/30"
            >
              <h3 className="font-semibold">{src.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{src.what}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Anti-Gaming */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Anti-Gaming Measures</h2>
        <div className="rounded-xl border border-border bg-card p-6">
          <ul className="space-y-3">
            {[
              'On-chain verification — Treasury and revenue metrics sourced from verified on-chain data via DefiLlama and CoinGecko. Not self-reported.',
              'Commit quality analysis — GitHub commits filtered for substantive changes. Whitespace, auto-generated, and trivial commits are discounted.',
              'Rolling averages — Scores use historical rolling averages that resist short-term manipulation. Sudden metric spikes trigger anomaly weighting.',
              'Cross-validation — Each metric is cross-referenced against correlated indicators. Development activity validated against actual deployment recency.',
              'Decay function — Scores trend toward zero if a project stops producing new data for 30+ days.',
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Score Tiers */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Score Tiers</h2>
        <div className="grid gap-3 sm:grid-cols-5">
          {SCORE_TIERS.map(tier => (
            <div
              key={tier.tier}
              className="rounded-xl border border-border bg-card p-4 text-center"
            >
              <div
                className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full font-mono text-lg font-bold"
                style={{ backgroundColor: tier.bgColor, color: tier.color }}
              >
                {tier.min === 0 ? '0' : tier.min}+
              </div>
              <p className="text-sm font-semibold" style={{ color: tier.color }}>{tier.label}</p>
              <p className="text-xs text-muted-foreground">{tier.min}–{tier.max}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="mb-12">
        <h2 className="mb-2 text-2xl font-bold">Roadmap</h2>
        <p className="mb-8 text-muted-foreground">Our path from MVP to Web3 infrastructure standard.</p>

        <div className="relative">
          {/* Timeline connector line */}
          <div className="absolute left-[19px] top-0 hidden h-full w-0.5 bg-border sm:block" />

          <div className="space-y-8">
            {ROADMAP.map((phase, phaseIndex) => {
              const completedCount = phase.items.filter(i => i.done).length;
              const totalCount = phase.items.length;
              const progressPct = Math.round((completedCount / totalCount) * 100);

              return (
                <div key={phase.phase} className="relative flex gap-6">
                  {/* Timeline node */}
                  <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-center">
                    <div
                      className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold ${
                        phase.status === 'current'
                          ? 'border-teal bg-teal text-white'
                          : completedCount === totalCount
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-border bg-card text-muted-foreground'
                      }`}
                    >
                      {completedCount === totalCount ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        phaseIndex + 1
                      )}
                    </div>
                  </div>

                  {/* Phase content */}
                  <div
                    className={`flex-1 rounded-xl border bg-card overflow-hidden ${
                      phase.status === 'current'
                        ? 'border-teal/40 shadow-lg shadow-teal/5'
                        : 'border-border'
                    }`}
                  >
                    {/* Phase header */}
                    <div className={`px-5 py-4 ${phase.status === 'current' ? 'bg-teal/5' : ''}`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          {/* Mobile phase number */}
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold sm:hidden ${
                              phase.status === 'current'
                                ? 'border-teal bg-teal text-white'
                                : 'border-border bg-card text-muted-foreground'
                            }`}
                          >
                            {phaseIndex + 1}
                          </div>
                          <h3 className="text-lg font-semibold">{phase.phase}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">{phase.period}</span>
                          {phase.status === 'current' && (
                            <span className="flex items-center gap-1 rounded-full bg-teal/15 px-2.5 py-0.5 text-xs font-semibold text-teal">
                              <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
                              In Progress
                            </span>
                          )}
                          {phase.status === 'next' && (
                            <span className="rounded-full bg-blue-500/15 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
                              Up Next
                            </span>
                          )}
                          {phase.status === 'future' && (
                            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                              Planned
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="mt-1.5 text-sm text-muted-foreground">{phase.description}</p>

                      {/* Progress bar for current/completed phases */}
                      {phase.status === 'current' && (
                        <div className="mt-3 flex items-center gap-3">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-teal transition-all"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-muted-foreground">{completedCount}/{totalCount}</span>
                        </div>
                      )}
                    </div>

                    {/* Milestone items */}
                    <div className="border-t border-border px-5 py-3">
                      <ul className="space-y-2">
                        {phase.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm">
                            {item.done ? (
                              <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : phase.status === 'current' ? (
                              <div className="mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-teal/50" />
                            ) : (
                              <div className="mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-border" />
                            )}
                            <span className={item.done ? 'text-muted-foreground line-through decoration-muted-foreground/40' : 'text-foreground'}>
                              {item.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About the Project */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">About the Project</h2>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-teal">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M3 12h4l3-9 4 18 3-9h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">VitalisPulse</h3>
              <p className="text-sm text-muted-foreground">Open-Source · Community-Driven · Free Forever</p>
              <p className="mt-3 text-sm text-muted-foreground">
                VitalisPulse is an independent, open-source project built to bring transparency and accountability
                to the Web3 ecosystem. We believe every community member, investor, and builder deserves free access
                to objective, data-driven health metrics — not just TVL and token price.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Built with Next.js, TypeScript, Supabase, and Tailwind CSS. All scoring data comes from
                publicly verifiable sources. No self-reported metrics. No pay-to-play listings.
              </p>
              <div className="mt-4 flex gap-3">
                <a
                  href="https://x.com/vitalispulse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm transition-colors hover:bg-accent"
                >
                  <Twitter className="h-4 w-4" /> @vitalispulse
                </a>
                <a
                  href="https://github.com/vitalispulse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm transition-colors hover:bg-accent"
                >
                  <Github className="h-4 w-4" /> GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="rounded-xl border border-border bg-card">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <span className="font-medium">{item.question}</span>
                {openFaq === i ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              {openFaq === i && (
                <div className="border-t border-border px-4 pb-4 pt-3 text-sm text-muted-foreground">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mb-8 rounded-xl border border-teal/30 bg-teal/5 p-8 text-center">
        <h2 className="text-2xl font-bold">Ready to get your project scored?</h2>
        <p className="mt-2 text-muted-foreground">Submit your project for evaluation or join the VitalisPulse community.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/submit" className="inline-flex items-center gap-2 rounded-lg bg-teal px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal/90">
            Get Your Project Scored
            <ExternalLink className="h-4 w-4" />
          </Link>
          <a href="https://x.com/vitalispulse" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-2.5 text-sm font-medium transition-colors hover:bg-accent">
            Follow on X
            <Twitter className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
