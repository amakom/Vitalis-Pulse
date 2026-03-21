'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, BarChart3, Shield, GitBranch, TrendingUp, Zap, Play } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface LandingHeroProps {
  stats: {
    totalProjects: number;
    avgScore: number;
    atRiskCount: number;
    totalTreasury: number;
  };
  projectCount: number;
}

function AnimatedCounter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

const VALUE_PROPS = [
  {
    icon: BarChart3,
    title: 'Health Scores, Not Hype',
    description: 'Every project gets a transparent 0–100 score based on real data — not token price or Twitter followers.',
  },
  {
    icon: GitBranch,
    title: 'Real Development Data',
    description: 'We track actual GitHub commits, active developers, and PR velocity. Dead projects can\'t fake code.',
  },
  {
    icon: Shield,
    title: 'Treasury Transparency',
    description: 'Know if a project has 5 years of runway or 5 weeks. Treasury health is the #1 predictor of survival.',
  },
];

const TRUST_SOURCES = [
  { name: 'DefiLlama', description: 'TVL & Revenue' },
  { name: 'CoinGecko', description: 'Market Data' },
  { name: 'GitHub', description: 'Dev Activity' },
];

export function LandingHero({ stats, projectCount }: LandingHeroProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal/5 via-transparent to-transparent" />
      <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-teal/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 lg:px-6 lg:pt-24 lg:pb-28">
        {/* Badge */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/5 px-4 py-1.5 text-sm">
            <span className="h-2 w-2 rounded-full bg-teal animate-pulse" />
            <span className="text-teal font-medium">Live — Scoring {projectCount} projects daily</span>
          </div>
        </div>

        {/* Headline */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            The Credit Score for{' '}
            <span className="bg-gradient-to-r from-teal to-emerald-400 bg-clip-text text-transparent">
              Web3 Projects
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Free, real-time health scoring for DeFi, infrastructure, and governance projects.
            Know which projects are thriving — and which are dying — before the market does.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#leaderboard"
            className="inline-flex items-center gap-2 rounded-xl bg-teal px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal/25 transition-all hover:bg-teal/90 hover:shadow-xl hover:shadow-teal/30"
          >
            <BarChart3 className="h-4 w-4" />
            Explore Scores
          </a>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-8 py-3.5 text-sm font-semibold transition-colors hover:bg-accent"
          >
            <Zap className="h-4 w-4" />
            Get Your Project Scored
          </Link>
        </div>

        {/* Demo Video */}
        <div className="mt-16">
          <div className="mx-auto max-w-3xl">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/20">
              {/* Video placeholder — replace src with actual video URL when ready */}
              <div className="relative aspect-video w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                {/* Placeholder state — remove this div and uncomment the video/iframe below when video is ready */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal/20 backdrop-blur-sm border border-teal/30">
                    <Play className="h-7 w-7 text-teal ml-1" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">See VitalisPulse in Action</p>
                    <p className="mt-1 text-xs text-muted-foreground">60-second explainer — coming soon</p>
                  </div>
                </div>

                {/*
                  WHEN VIDEO IS READY:
                  1. Remove the placeholder div above
                  2. Uncomment one of the options below and add your video URL

                  Option A — YouTube/Vimeo embed:
                  <iframe
                    src="YOUR_YOUTUBE_EMBED_URL"
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />

                  Option B — Self-hosted MP4:
                  <video
                    src="/demo.mp4"
                    controls
                    poster="/demo-poster.jpg"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                */}
              </div>
            </div>
          </div>
        </div>

        {/* Live Stats Counter */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {[
            { label: 'Projects Scored', value: stats.totalProjects, suffix: '' },
            { label: 'Avg Health Score', value: stats.avgScore, suffix: '/100' },
            { label: 'Projects At Risk', value: stats.atRiskCount, suffix: '' },
            { label: 'Treasury Tracked', value: 0, suffix: '', formatted: formatCurrency(stats.totalTreasury) },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card/80 backdrop-blur-sm px-4 py-5 text-center">
              <p className="font-mono text-2xl font-bold text-foreground sm:text-3xl">
                {stat.formatted ? stat.formatted : <AnimatedCounter target={stat.value} suffix={stat.suffix} />}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Value Props */}
        <div className="mt-20 grid gap-6 sm:grid-cols-3">
          {VALUE_PROPS.map((prop) => (
            <div key={prop.title} className="rounded-xl border border-border bg-card p-6 transition-all hover:border-teal/30 hover:shadow-lg">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10">
                <prop.icon className="h-5 w-5 text-teal" />
              </div>
              <h3 className="text-base font-semibold">{prop.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{prop.description}</p>
            </div>
          ))}
        </div>

        {/* Data Sources Trust Bar */}
        <div className="mt-16 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">Powered by publicly verifiable data from</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {TRUST_SOURCES.map((source) => (
              <div key={source.name} className="flex items-center gap-2 text-muted-foreground">
                <span className="text-sm font-semibold text-foreground">{source.name}</span>
                <span className="text-xs">({source.description})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-12 flex justify-center">
          <a href="#leaderboard" className="flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-foreground">
            <span className="text-xs">View Leaderboard</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </a>
        </div>
      </div>
    </div>
  );
}
