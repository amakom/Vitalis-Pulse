import { ecosystemData } from '@/lib/mock-data';
import { ChainCard } from '@/components/ecosystems/chain-card';
import { EcosystemChart } from '@/components/ecosystems/ecosystem-chart';

export default function EcosystemsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Ecosystems</h1>
        <p className="mt-1 text-muted-foreground">Health overview by blockchain ecosystem</p>
      </div>

      {/* Bar chart comparison */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Average Vitalis Score by Ecosystem</h2>
        <EcosystemChart data={ecosystemData} />
      </div>

      {/* Chain cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ecosystemData
          .filter(e => e.projectCount > 0)
          .sort((a, b) => b.avgScore - a.avgScore)
          .map(eco => (
            <ChainCard key={eco.chain} ecosystem={eco} />
          ))}
      </div>
    </div>
  );
}
