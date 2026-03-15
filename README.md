# Vitalis Pulse

**The heartbeat of Web3** — A project health scoring dashboard that provides real-time Vitalis Scores (0-100) for Web3 projects based on treasury management, development activity, community retention, revenue sustainability, and governance.

![Vitalis Pulse Screenshot](screenshot-placeholder.png)

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

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Charts:** Recharts
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Theming:** next-themes (dark mode default)

## Features

- **Global Leaderboard** — Filterable, sortable table of 50 scored projects with real-time health metrics
- **Project Deep-Dive** — Detailed breakdown across 5 health dimensions with interactive charts
- **Compare Tool** — Side-by-side comparison of up to 4 projects with radar chart visualization
- **Ecosystem Overview** — Health metrics aggregated by blockchain ecosystem
- **Global Search** — Cmd+K search across all projects
- **Dark/Light Mode** — Dark-first design with light mode toggle
- **Responsive** — Desktop-optimized with mobile support

## Project Structure

```
app/                    # Next.js App Router pages
  page.tsx              # Homepage / Leaderboard
  project/[slug]/       # Project deep-dive
  compare/              # Compare tool
  ecosystems/           # Ecosystem overview
  about/                # About & methodology
components/
  dashboard/            # Core dashboard components
  project/              # Project detail sections
  compare/              # Compare tool components
  ecosystems/           # Ecosystem components
  layout/               # Header, footer, search modal
  ui/                   # shadcn/ui components
lib/
  mock-data.ts          # Realistic mock data generator (50 projects)
  types.ts              # TypeScript interfaces
  constants.ts          # Score tiers, chains, categories
  utils.ts              # Helper functions
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

MIT
