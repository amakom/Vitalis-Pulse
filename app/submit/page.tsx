'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { submitProject } from '@/lib/data/queries';

const CHAINS = [
  'ethereum', 'solana', 'arbitrum', 'base', 'polygon', 'bnb', 'optimism', 'avalanche', 'cosmos', 'other'
];

const CATEGORIES = [
  'defi', 'gamefi', 'infrastructure', 'nft', 'l1-l2', 'dao', 'socialfi'
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
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal/10">
          <CheckCircle className="h-8 w-8 text-teal" />
        </div>
        <h1 className="mb-3 text-2xl font-bold">Project Submitted!</h1>
        <p className="mb-8 text-muted-foreground">
          Your project has been submitted for review. We&apos;ll score it within 48 hours.
        </p>
        <Link href="/" className="rounded-lg bg-teal px-6 py-2.5 text-sm font-medium text-white hover:bg-teal/90">
          Back to Leaderboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 lg:px-6">
      <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Leaderboard
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Get Your Project Scored</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Submit your project for a Vitalis health score. We&apos;ll collect data from public APIs and generate your score within 48 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Required fields */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-4 sm:p-6">
          <h2 className="text-lg font-semibold">Project Details</h2>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Project Name *</label>
            <input
              required
              type="text"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              placeholder="e.g., Aave"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Website URL *</label>
            <input
              required
              type="url"
              value={form.website}
              onChange={e => update('website', e.target.value)}
              placeholder="https://yourproject.com"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Chain *</label>
              <select
                required
                value={form.chain}
                onChange={e => update('chain', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
              >
                <option value="">Select chain</option>
                {CHAINS.map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Category *</label>
              <select
                required
                value={form.category}
                onChange={e => update('category', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
              >
                <option value="">Select category</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Data sources */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-4 sm:p-6">
          <h2 className="text-lg font-semibold">Data Sources</h2>
          <p className="text-sm text-muted-foreground">These help us collect accurate data. All optional.</p>

          <div>
            <label className="mb-1.5 block text-sm font-medium">GitHub URL</label>
            <input
              type="url"
              value={form.github_url}
              onChange={e => update('github_url', e.target.value)}
              placeholder="https://github.com/org/repo"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">DefiLlama Slug</label>
            <input
              type="text"
              value={form.defillama_slug}
              onChange={e => update('defillama_slug', e.target.value)}
              placeholder="e.g., aave"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            />
            <p className="mt-1 text-xs text-muted-foreground">Find at defillama.com/protocol/YOUR_SLUG</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">CoinGecko ID</label>
            <input
              type="text"
              value={form.coingecko_id}
              onChange={e => update('coingecko_id', e.target.value)}
              placeholder="e.g., aave"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            />
            <p className="mt-1 text-xs text-muted-foreground">Find at coingecko.com/en/coins/YOUR_ID</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Treasury Wallet Address</label>
            <input
              type="text"
              value={form.treasury_wallet}
              onChange={e => update('treasury_wallet', e.target.value)}
              placeholder="0x..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-4 sm:p-6">
          <h2 className="text-lg font-semibold">Contact</h2>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={form.contact_email}
              onChange={e => update('contact_email', e.target.value)}
              placeholder="team@project.com"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Additional Notes</label>
            <textarea
              value={form.notes}
              onChange={e => update('notes', e.target.value)}
              placeholder="Anything else we should know..."
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal/90 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {loading ? 'Submitting...' : 'Submit for Scoring'}
        </button>
      </form>
    </div>
  );
}
