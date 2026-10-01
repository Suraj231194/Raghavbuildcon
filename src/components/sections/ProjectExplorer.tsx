"use client";

import { useId, useState } from "react";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { Icon } from "@/components/ui/Icon";
import type { Project, VerticalSlug } from "@/content/types";
import { verticals } from "@/content/verticals";
import { cn } from "@/lib/site";

type Filter = "all" | VerticalSlug;

/** Filterable project grid. Filtering is client-side so the page stays fully static. */
export function ProjectExplorer({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const statusId = useId();
  const visible = filter === "all" ? projects : projects.filter((p) => p.vertical === filter);
  const options: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: "All projects", count: projects.length },
    ...verticals.map((v) => ({ value: v.slug, label: v.title, count: projects.filter((p) => p.vertical === v.slug).length })),
  ];

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-ink-100 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter projects by vertical" aria-describedby={statusId} className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {options.map((o) => {
            const active = filter === o.value;
            return (
              <button
                key={o.value}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(o.value)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                  active ? "border-ink-950 bg-ink-950 text-white" : "border-ink-200 text-ink-700 hover:border-ink-400 hover:text-ink-950",
                )}
              >
                {o.label}
                <span className={cn("rounded-full px-1.5 text-xs tabular-nums", active ? "bg-gold-500 text-ink-950" : "bg-ink-100 text-ink-500")}>{o.count}</span>
              </button>
            );
          })}
        </div>
        <p id={statusId} aria-live="polite" className="text-sm text-ink-500">
          Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
        </p>
      </div>

      {visible.length > 0 ? (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <li key={p.slug} className="animate-fade-up">
              <ProjectCard project={p} headingLevel="h2" />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 flex flex-col items-center rounded-sm border border-dashed border-ink-200 bg-sand-50 px-6 py-16 text-center">
          <Icon name="layers" className="size-10 text-ink-300" />
          <p className="mt-4 font-display text-xl font-semibold text-ink-900">No projects listed in this vertical yet</p>
          <p className="mt-2 max-w-md text-ink-500">Projects will appear here as they are added to the portfolio.</p>
          <button type="button" onClick={() => setFilter("all")} className="mt-6 text-sm font-semibold text-gold-700 hover:text-gold-800">
            Show all projects
          </button>
        </div>
      )}
    </div>
  );
}
