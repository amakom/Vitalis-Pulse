'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { SCORE_TIERS } from '@/lib/constants';

const METHODOLOGY = [
  {
    title: 'Treasury Health',
    weight: 30,
    color: '#14B8A6',
    description: 'Evaluates the sustainability of a project\'s financial reserves. Factors include total treasury value, runway (months of operation at current burn rate), diversification across asset types, stablecoin ratios, and monthly burn rate trends.',
  },
  {
    title: 'Development Activity',
    weight: 25,
    color: '#10B981',
    description: 'Measures the pace and quality of technical development. Metrics include commit frequency, active developer count, PR merge times, deployment frequency, and code review quality indicators.',
  },
  {
    title: 'Community & Retention',
    weight: 20,
    color: '#F59E0B',
    description: 'Assesses the health and engagement of the project\'s user base. Key metrics include DAU/MAU ratio, holder growth rates, wallet concentration (Gini coefficient), and user churn rates.',
  },
  {
    title: 'Revenue & Sustainability',
    weight: 15,
    color: '#8B5CF6',
    description: 'Evaluates the project\'s path to financial sustainability. Considers monthly revenue, non-token income percentage, burn multiple (revenue relative to spending), and revenue trend direction.',
  },
  {
    title: 'Governance & Security',
    weight: 10,
    color: '#627EEA',
    description: 'Reviews the project\'s security posture and governance practices. Includes audit recency, voter participation rates, multisig configurations, and bug bounty program status.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Is Vitalis free?',
    answer: 'Yes, Vitalis scores are free and publicly accessible. We believe transparency in Web3 project health benefits the entire ecosystem. Premium features like API access and custom alerts will be available in the future.',
  },
  {
    question: 'How often are scores updated?',
    answer: 'Vitalis scores are recalculated every 6 hours using the latest on-chain data, GitHub activity, and governance metrics. Treasury data updates in real-time as on-chain transactions occur.',
  },
  {
    question: 'Can projects manipulate their score?',
    answer: 'We employ multiple anti-gaming measures including anomaly detection, commit quality analysis (not just quantity), Sybil-resistant community metrics, and weighted historical data. While no system is perfect, gaming the Vitalis score requires genuine, sustained improvement across multiple dimensions.',
  },
  {
    question: 'How do I get my project scored?',
    answer: 'Vitalis automatically indexes projects that meet minimum criteria: deployed smart contracts, public GitHub repositories, and on-chain treasury. If your project qualifies but isn\'t listed, submit a request through our GitHub and we\'ll review it within 48 hours.',
  },
  {
    question: 'What chains are supported?',
    answer: 'We currently support Ethereum, Solana, Arbitrum, Base, Polygon, BNB Chain, Optimism, and Avalanche. New chains are added based on ecosystem maturity and data availability. L2s with sufficient project density are prioritized.',
  },
  {
    question: 'Is there an API?',
    answer: 'An API is coming soon. It will provide programmatic access to Vitalis scores, historical data, and project metrics. Early access is available for researchers and builders — reach out on Twitter/X to join the waitlist.',
  },
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-6">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-teal">
            <path d="M3 12h4l3-9 4 18 3-9h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-2xl font-bold">vitalis</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">The Heartbeat of Web3</h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
          Real-time health scoring for Web3 projects. Think credit scores, but for crypto.
        </p>
      </div>

      {/* What is Vitalis */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">What is Vitalis?</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Vitalis is an open-data platform that provides health scores for Web3 projects. By aggregating on-chain data, development activity, community metrics, and financial indicators, we generate a single Vitalis Score (0–100) that reflects a project&apos;s operational health and sustainability.
          </p>
          <p>
            Our mission is to bring transparency and accountability to the Web3 ecosystem. Too many projects operate as black boxes — Vitalis shines a light on the fundamentals that matter: Can the project sustain itself? Is the team actively building? Is the community growing or shrinking? Is governance functional?
          </p>
        </div>
      </section>

      {/* How the score works */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">How the Vitalis Score Works</h2>
        <p className="mb-6 text-muted-foreground">
          The Vitalis Score is a weighted composite of five key health dimensions:
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

      {/* Scoring Methodology */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Scoring Methodology</h2>
        <div className="space-y-4">
          {METHODOLOGY.map(m => (
            <div key={m.title} className="rounded-xl border border-border bg-card p-5">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold">{m.title}</h3>
                <span
                  className="rounded-full px-2.5 py-0.5 text-sm font-bold"
                  style={{ backgroundColor: `${m.color}20`, color: m.color }}
                >
                  {m.weight}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{m.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Anti-Gaming */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Anti-Gaming Measures</h2>
        <div className="rounded-xl border border-border bg-card p-6">
          <ul className="space-y-3">
            {[
              'Commit quality analysis — We measure meaningful code changes, not just commit count. Empty commits and trivial changes are detected and discounted.',
              'Sybil-resistant community metrics — Wallet clustering and behavior analysis filter out fake accounts and wash trading from community metrics.',
              'Weighted historical data — Scores use rolling averages that resist short-term manipulation. Sudden spikes in any metric trigger anomaly detection.',
              'Cross-validation — Each metric is cross-referenced against correlated indicators. For example, development activity is validated against actual on-chain deployments.',
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
        <p className="mt-2 text-muted-foreground">Submit your project for evaluation or join the Vitalis community.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg bg-teal px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal/90">
            Get Your Project Scored
            <ExternalLink className="h-4 w-4" />
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-2.5 text-sm font-medium transition-colors hover:bg-accent">
            Join the Community
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
