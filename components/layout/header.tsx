'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Sun, Moon, Menu, X, User, LogOut, Star } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Project } from '@/lib/types';
import { useAuth } from '@/lib/auth/context';
import { SearchModal } from './search-modal';

const NAV_LINKS = [
  { href: '/', label: 'Leaderboard' },
  { href: '/ecosystems', label: 'Ecosystems' },
  { href: '/compare', label: 'Compare' },
  { href: '/about', label: 'About' },
];

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchProjects, setSearchProjects] = useState<Project[]>([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, loading: authLoading, signOut } = useAuth();

  // Fetch projects for search on mount
  useEffect(() => {
    async function load() {
      try {
        const { getAllProjects } = await import('@/lib/data/queries');
        const projects = await getAllProjects();
        if (projects.length > 0) {
          setSearchProjects(projects);
        } else {
          const { projects: mock } = await import('@/lib/mock-data');
          setSearchProjects(mock);
        }
      } catch {
        const { projects: mock } = await import('@/lib/mock-data');
        setSearchProjects(mock);
      }
    }
    load();
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-teal">
                <path
                  d="M3 12h4l3-9 4 18 3-9h4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-lg font-bold tracking-tight text-foreground">
                VitalisPulse
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-accent text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden rounded bg-muted px-1.5 py-0.5 font-mono text-xs sm:inline">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </button>

            {/* Auth */}
            {!authLoading && (
              user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-teal/15 text-teal transition-colors hover:bg-teal/25"
                  >
                    <User className="h-4 w-4" />
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-11 z-50 w-48 rounded-lg border border-border bg-card p-1 shadow-lg">
                        <p className="truncate px-3 py-2 text-xs text-muted-foreground">{user.email}</p>
                        <div className="my-1 border-t border-border" />
                        <Link
                          href="/watchlist"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                        >
                          <Star className="h-3.5 w-3.5" /> Watchlist
                        </Link>
                        <button
                          onClick={() => { signOut(); setUserMenuOpen(false); }}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                        >
                          <LogOut className="h-3.5 w-3.5" /> Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal/90 sm:flex"
                >
                  Sign Up
                </Link>
              )
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg border border-border bg-card p-2 text-muted-foreground md:hidden"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background px-4 py-3 md:hidden">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-accent text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    href="/watchlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn('rounded-lg px-3 py-2 text-sm font-medium transition-colors', pathname === '/watchlist' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground')}
                  >
                    Watchlist
                  </Link>
                  <button
                    onClick={() => { signOut(); setMobileMenuOpen(false); }}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white"
                >
                  Sign Up
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} projects={searchProjects} />
    </>
  );
}
