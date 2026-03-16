import { notFound } from 'next/navigation';
import { getProject } from '@/lib/data/queries';
import { getProjectBySlug } from '@/lib/mock-data';
import { ProjectDetail } from '@/components/project/project-detail';

export const revalidate = 300;

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Try live data first, fall back to mock
  let project = await getProject(slug);
  const isMock = !project;
  if (!project) {
    project = getProjectBySlug(slug) || null;
  }

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} isMock={isMock} />;
}
