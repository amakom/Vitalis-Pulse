'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, TrendingUp, Clock, X } from 'lucide-react';
import { projects } from '@/lib/mock-data';
import { getScoreColor } from '@/lib/constants';
import { getCategoryLabel, getChainInfo } from '@/lib/constants';
import { ChainBadge } from '@/components/dashboard/chain-badge';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

// Projects with biggest absolute score changes for "Trending"
const trendingProjects = [...projects]
  .sort((a, b) => Math.abs(b.scoreTrend24h) - Math.abs(a.scoreTrend24h))
  .slice(0, 5);

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');

  const results = query.length > 0
    ? projects.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.chain.includes(query.toLowerCase()) ||
        p.category.includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) onClose();
        else {
          setQuery('');
          // trigger open from parent - we need to use a callback for this
        }
      }
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Open via ⌘K from outside
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-xl rounded-xl border border-border bg-card shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            autoFocus
            placeholder="Search projects, chains, categories..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground hover:bg-accent"
          >
            ESC
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-2">
          {/* Search results */}
          {query.length > 0 ? (
            results.length > 0 ? (
              <div>
                <p className="px-3 py-2 text-xs font-medium uppercase text-muted-foreground">Results</p>
                {results.map(project => (
                  <Link
                    key={project.id}
                    href={`/project/${project.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: `hsl(${(project.name.charCodeAt(0) * 7) % 360}, 60%, 45%)` }}
                      >
                        {project.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{project.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <ChainBadge chain={project.chain} />
                          <span>{getCategoryLabel(project.category)}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className="font-mono text-lg font-bold"
                      style={{ color: getScoreColor(project.vitalisScore) }}
                    >
                      {project.vitalisScore}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                No projects found for &ldquo;{query}&rdquo;
              </p>
            )
          ) : (
            <>
              {/* Trending */}
              <div>
                <p className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium uppercase text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Trending
                </p>
                {trendingProjects.map(project => (
                  <Link
                    key={project.id}
                    href={`/project/${project.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: `hsl(${(project.name.charCodeAt(0) * 7) % 360}, 60%, 45%)` }}
                      >
                        {project.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-foreground">{project.name}</span>
                    </div>
                    <span className={`font-mono text-sm font-medium ${project.scoreTrend24h >= 0 ? 'text-emerald' : 'text-red'}`}>
                      {project.scoreTrend24h >= 0 ? '+' : ''}{project.scoreTrend24h}%
                    </span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
