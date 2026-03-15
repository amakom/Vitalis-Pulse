'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { projects } from '@/lib/mock-data';
import { Project } from '@/lib/types';
import { getScoreColor } from '@/lib/constants';

interface ProjectSelectorProps {
  selected: Project[];
  onAdd: (project: Project) => void;
  onRemove: (projectId: string) => void;
  maxProjects?: number;
}

export function ProjectSelector({ selected, onAdd, onRemove, maxProjects = 4 }: ProjectSelectorProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const available = projects.filter(
    p => !selected.some(s => s.id === p.id) &&
    (query.length === 0 || p.name.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 6);

  return (
    <div className="space-y-3">
      {/* Selected projects */}
      <div className="flex flex-wrap gap-2">
        {selected.map(p => (
          <span
            key={p.id}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm"
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: getScoreColor(p.vitalisScore) }}
            />
            {p.name}
            <button onClick={() => onRemove(p.id)} className="ml-0.5 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
      </div>

      {/* Search input */}
      {selected.length < maxProjects && (
        <div className="relative">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={`Add a project to compare (${selected.length}/${maxProjects})...`}
              value={query}
              onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
              onFocus={() => setIsOpen(true)}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          {isOpen && (query.length > 0 || true) && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-card shadow-lg">
              {available.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    onAdd(p);
                    setQuery('');
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-accent"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: `hsl(${(p.name.charCodeAt(0) * 7) % 360}, 60%, 45%)` }}
                    >
                      {p.name.charAt(0)}
                    </div>
                    <span>{p.name}</span>
                    <span className="text-xs text-muted-foreground">{p.chain}</span>
                  </div>
                  <span className="font-mono font-semibold" style={{ color: getScoreColor(p.vitalisScore) }}>
                    {p.vitalisScore}
                  </span>
                </button>
              ))}
              {available.length === 0 && (
                <p className="px-3 py-4 text-center text-sm text-muted-foreground">No projects found</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
