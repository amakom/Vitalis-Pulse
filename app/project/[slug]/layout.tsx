import type { Metadata } from "next";
import { getProject } from "@/lib/data/queries";
import { getProjectBySlug } from "@/lib/mock-data";
import { getScoreTier } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  // Try live data first, fall back to mock
  const project = await getProject(slug) || getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found — VitalisPulse" };
  }

  const tier = getScoreTier(project.vitalisScore);

  return {
    title: `${project.name} — Vitalis Score ${project.vitalisScore} (${tier.label}) | VitalisPulse`,
    description: project.healthSummary,
    openGraph: {
      title: `${project.name} — Vitalis Score ${project.vitalisScore}`,
      description: project.healthSummary,
      url: `https://www.vitalispulse.xyz/project/${slug}`,
      siteName: "VitalisPulse",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${project.name} — Vitalis Score ${project.vitalisScore} (${tier.label})`,
      description: project.healthSummary,
    },
  };
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
