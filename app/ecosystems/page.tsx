import { getEcosystemStats } from '@/lib/data/queries';
import { ecosystemData as mockEcosystemData } from '@/lib/mock-data';
import { ChainCard } from '@/components/ecosystems/chain-card';
import { EcosystemChart } from '@/components/ecosystems/ecosystem-chart';

export const revalidate = 300;

export default async function EcosystemsPage() {
  const liveData = await getEcosystemStats();
  const usesMock = liveData.length === 0;
  const data = usesMock ? mockEcosystemData : liveData;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      {usesMock && (
        <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-sm text-amber-400">
          Displaying sample data. Real scores are being calculated.
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Ecosystems</h1>
        <p className="mt-1 text-muted-foreground">Health overview by blockchain ecosystem</p>
      </div>

      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Average Vitalis Score by Ecosystem</h2>
        <EcosystemChart data={data} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data
          .filter(e => e.projectCount > 0)
          .sort((a, b) => b.avgScore - a.avgScore)
          .map(eco => (
            <ChainCard key={eco.chain} ecosystem={eco} />
          ))}
      </div>
    </div>
  );
}
