import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          {/* Logo & tagline */}
          <div>
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-teal">
                <path
                  d="M3 12h4l3-9 4 18 3-9h4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-base font-bold tracking-tight">VitalisPulse</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Built for builders. Open data.</p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Leaderboard</Link>
            <Link href="/ecosystems" className="hover:text-foreground transition-colors">Ecosystems</Link>
            <Link href="/compare" className="hover:text-foreground transition-colors">Compare</Link>
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <span className="cursor-default opacity-50">API Docs</span>
            <a href="https://x.com/vitalispulse" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Twitter/X</a>
            <a href="https://github.com/vitalispulse" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
          </nav>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} VitalisPulse. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
