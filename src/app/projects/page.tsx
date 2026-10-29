import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { ProjectExplorer } from "@/components/sections/ProjectExplorer";
import { ArrowLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PlaceholderNote } from "@/components/ui/Placeholder";
import { photos } from "@/content/images";
import { projects } from "@/content/projects";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Infrastructure Projects",
  description: "The Raghav Buildcon project portfolio across roads & highways, bridges & structures, buildings and EPC construction.",
  path: "/projects",
});

export default function ProjectsPage() {
  const hasSamples = projects.some((p) => p.sample);
  return (
    <>
      <PageHero
        image={photos.roads.src}
        scene="network"
        breadcrumbs={[{ name: "Projects", path: "/projects" }]}
        eyebrow="Infrastructure projects"
        title="Our project portfolio."
        lead="Highways, structures, buildings and EPC works — explore the projects by vertical."
      >
        <ArrowLink href="/signature-projects" tone="light">
          See our signature projects
        </ArrowLink>
      </PageHero>

      <section className="py-20 sm:py-24">
        <Container>
          {hasSamples ? (
            <PlaceholderNote className="mb-10">
              Entries marked <strong className="font-semibold">Sample content</strong> show how projects will be presented. They will be replaced with verified Raghav Buildcon projects.
            </PlaceholderNote>
          ) : null}
          <ProjectExplorer projects={projects} />
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
