import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/site";

export type Feature = { title: string; description: string; icon: IconName };

/** Icon + title + text cards. The cards assemble into the grid and their icons draw themselves as they come into view. */
export function FeatureGrid({
  features,
  tone = "dark",
  columns = 3,
  numbered = false,
}: {
  features: Feature[];
  tone?: "dark" | "light";
  columns?: 2 | 3 | 4;
  numbered?: boolean;
}) {
  const light = tone === "light";
  return (
    <ul data-assemble="" className={cn("grid gap-5 sm:grid-cols-2", columns === 3 && "lg:grid-cols-3", columns === 4 && "lg:grid-cols-4")}>
      {features.map((f, i) => (
        <li
          key={f.title}
          data-assemble-item=""
          className={cn(
            "group relative rounded-sm border p-7 transition-[border-color,background-color,box-shadow] duration-500",
            light
              ? "border-white/10 bg-white/[0.03] hover:border-gold-400/40 hover:bg-white/[0.05]"
              : "border-ink-100 bg-white hover:border-gold-500/40 hover:shadow-[0_20px_50px_-30px_rgb(11_18_32/0.35)]",
          )}
        >
          <div className="flex items-start justify-between">
            <span
              className={cn(
                "flex size-12 items-center justify-center rounded-sm transition-colors duration-300",
                light ? "bg-gold-500/10 text-gold-400 group-hover:bg-gold-500 group-hover:text-ink-950" : "bg-ink-950 text-gold-400 group-hover:bg-gold-500 group-hover:text-ink-950",
              )}
            >
              <Icon name={f.icon} className="size-6" data-draw="top 60%" />
            </span>
            {numbered ? <span className={cn("font-display text-sm font-semibold tracking-[0.16em]", light ? "text-ink-500" : "text-ink-300")}>{String(i + 1).padStart(2, "0")}</span> : null}
          </div>
          <h3 className={cn("mt-6 font-display text-xl font-semibold", light ? "text-white" : "text-ink-950")}>{f.title}</h3>
          <p className={cn("mt-2.5 text-[0.95rem] leading-relaxed", light ? "text-ink-300" : "text-ink-500")}>{f.description}</p>
        </li>
      ))}
    </ul>
  );
}
