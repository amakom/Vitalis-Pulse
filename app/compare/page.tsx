import { getAllProjects } from '@/lib/data/queries';
import { projects as mockProjects } from '@/lib/mock-data';
import { CompareClient } from '@/components/compare/compare-client';

export const revalidate = 300;

export default async function ComparePage() {
  const liveProjects = await getAllProjects();
  const usesMock = liveProjects.length === 0;
  const allProjects = usesMock ? mockProjects : liveProjects;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      {usesMock && (
        <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-sm text-amber-400">
          Displaying sample data. Real scores are being calculated.
        </div>
      )}
      <CompareClient allProjects={allProjects} />
    </div>
  );
}
