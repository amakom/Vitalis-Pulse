'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, CheckCircle, Clock, Shield, BarChart3 } from 'lucide-react';
import { submitProject } from '@/lib/data/queries';

const CHAINS = [
  'ethereum', 'solana', 'arbitrum', 'base', 'polygon', 'bnb', 'optimism', 'avalanche', 'cosmos', 'other'
];

const CATEGORIES = [
  { id: 'defi', label: 'DeFi' },
  { id: 'gamefi', label: 'GameFi' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'nft', label: 'NFT' },
  { id: 'l1-l2', label: 'L1/L2' },
  { id: 'dao', label: 'DAO' },
  { id: 'socialfi', label: 'SocialFi' },
];

const PROCESS_STEPS = [
  { icon: Send, title: 'Submit', description: 'Fill in your project details and data source identifiers' },
  { icon: Clock, title: 'Review', description: 'We verify your submission and configure data collectors (24–48 hrs)' },
  { icon: BarChart3, title: 'Scored', description: 'Your project appears on the leaderboard with a live health score' },
];

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    website: '',
    chain: '',
    category: '',
    github_url: '',
    defillama_slug: '',
    coingecko_id: '',
    treasury_wallet: '',
    contact_email: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await submitProject(form);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const update = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center sm:py-20">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-teal/10">
          <CheckCircle className="h-10 w-10 text-teal" />
        </div>
        <h1 className="mb-3 text-3xl font-bold">Project Submitted!</h1>
        <p className="mb-2 text-lg text-muted-foreground">
          Thank you for submitting <strong className="text-foreground">{form.name}</strong>.
        </p>
        <p className="mb-8 text-muted-foreground">
          We&apos;ll review your project and configure data collectors within 24–48 hours.
          Once processed, your project will appear on the leaderboard with a live Vitalis Score.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-lg bg-teal px-6 py-2.5 text-sm font-medium text-white hover:bg-teal/90">
            Back to Leaderboard
          </Link>
          <a href="https://x.com/vitalispulse" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium hover:bg-accent">
            Follow for Updates
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-6">
      <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Leaderboard
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Get Your Project Scored</h1>
        <p className="mt-2 text-muted-foreground">
          Submit your project for a free VitalisPulse health score. We collect data from public APIs
          and generate a transparent, methodology-backed score.
        </p>
      </div>

      {/* How it works */}
      <div className="mb-8 rounded-xl border border-border bg-card p-5 sm:p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">How it works</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {PROCESS_STEPS.map((step, i) => (
            <div key={step.title} className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal/10">
                <step.icon className="h-4 w-4 text-teal" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  <span className="text-teal">{i + 1}.</span> {step.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div className="mb-8 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
        <div className="flex items-start gap-2">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <div className="text-sm text-muted-foreground">
            <strong className="text-foreground">Requirements:</strong> Your project needs at minimum a public GitHub repository
            and on-chain presence (TVL, token, or protocol revenue). All scoring data is sourced from public APIs — we never use self-reported metrics.
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Required fields */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-4 sm:p-6">
          <h2 className="text-lg font-semibold">Project Details</h2>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Project Name <span className="text-red-400">*</span></label>
            <input
              required
              type="text"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              placeholder="e.g., Aave"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm transition-colors focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Website URL <span className="text-red-400">*</span></label>
            <input
              required
              type="url"
              value={form.website}
              onChange={e => update('website', e.target.value)}
              placeholder="https://yourproject.com"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm transition-colors focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Chain <span className="text-red-400">*</span></label>
              <select
                required
                value={form.chain}
                onChange={e => update('chain', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm transition-colors focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
              >
                <option value="">Select chain</option>
                {CHAINS.map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Category <span className="text-red-400">*</span></label>
              <select
                required
                value={form.category}
                onChange={e => update('category', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm transition-colors focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
              >
                <option value="">Select category</option>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Data sources */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-4 sm:p-6">
          <div>
            <h2 className="text-lg font-semibold">Data Source Identifiers</h2>
            <p className="mt-1 text-sm text-muted-foreground">These help us collect accurate data automatically. All optional but recommended.</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">GitHub Repository URL</label>
            <input
              type="url"
              value={form.github_url}
              onChange={e => update('github_url', e.target.value)}
              placeholder="https://github.com/org/repo"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm transition-colors focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            />
            <p className="mt-1 text-xs text-muted-foreground">Your main public repository for development activity scoring</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">DefiLlama Slug</label>
              <input
                type="text"
                value={form.defillama_slug}
                onChange={e => update('defillama_slug', e.target.value)}
                placeholder="e.g., aave"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm transition-colors focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
              />
              <p className="mt-1 text-xs text-muted-foreground">defillama.com/protocol/<strong>your-slug</strong></p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">CoinGecko ID</label>
              <input
                type="text"
                value={form.coingecko_id}
                onChange={e => update('coingecko_id', e.target.value)}
                placeholder="e.g., aave"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm transition-colors focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
              />
              <p className="mt-1 text-xs text-muted-foreground">coingecko.com/en/coins/<strong>your-id</strong></p>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Treasury Wallet Address</label>
            <input
              type="text"
              value={form.treasury_wallet}
              onChange={e => update('treasury_wallet', e.target.value)}
              placeholder="0x..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm transition-colors focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            />
            <p className="mt-1 text-xs text-muted-foreground">Public treasury or multisig address for on-chain treasury monitoring</p>
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-4 sm:p-6">
          <h2 className="text-lg font-semibold">Contact Information</h2>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={form.contact_email}
              onChange={e => update('contact_email', e.target.value)}
              placeholder="team@project.com"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm transition-colors focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            />
            <p className="mt-1 text-xs text-muted-foreground">We&apos;ll notify you when your project has been scored</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Additional Notes</label>
            <textarea
              value={form.notes}
              onChange={e => update('notes', e.target.value)}
              placeholder="Anything else we should know about your project..."
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm transition-colors focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal/25 transition-all hover:bg-teal/90 hover:shadow-xl hover:shadow-teal/30 disabled:opacity-50 disabled:shadow-none"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit for Scoring
            </>
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          By submitting, you confirm this project has public GitHub repos and on-chain presence.
          Scoring is free and based entirely on publicly available data.
        </p>
      </form>
    </div>
  );
}
