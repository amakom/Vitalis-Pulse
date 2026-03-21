# VitalisPulse

**The heartbeat of Web3** — A project health scoring dashboard that provides real-time Vitalis Scores (0-100) for Web3 projects based on treasury management, development activity, community retention, revenue sustainability, and governance.

## Links

- **Website:** [vitalis-pulse.vercel.app](https://vitalis-pulse.vercel.app)
- **Twitter/X:** [@vitalispulse](https://x.com/vitalispulse)
- **GitHub:** [github.com/vitalispulse](https://github.com/vitalispulse)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Charts:** Recharts
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Theming:** next-themes (dark mode default)
- **Database:** Supabase (PostgreSQL)

## Features

- **Global Leaderboard** — Filterable, sortable table of scored projects with real-time health metrics
- **Project Deep-Dive** — Detailed breakdown across 5 health dimensions with interactive charts
- **Compare Tool** — Side-by-side comparison of up to 4 projects with radar chart visualization
- **Ecosystem Overview** — Health metrics aggregated by blockchain ecosystem
- **Global Search** — Cmd+K search across all projects
- **Dark/Light Mode** — Dark-first design with light mode toggle
- **Responsive** — Full mobile and desktop support
- **Public API** — RESTful API for score and badge access
- **Automated Scoring** — Daily cron-based score recalculation

## License

MIT
