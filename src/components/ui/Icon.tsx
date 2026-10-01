import type { SVGProps } from "react";

/** Original line-icon set, 24×24, drawn with `currentColor`. */
const paths = {
  "arrow-right": "M5 12h14M13 6l6 6-6 6",
  "arrow-left": "M19 12H5M11 6l-6 6 6 6",
  "arrow-up-right": "M7 17 17 7M8 7h9v9",
  "arrow-up": "M12 19V5M6 11l6-6 6 6",
  "chevron-down": "m6 9 6 6 6-6",
  menu: "M4 7h16M4 12h16M4 17h10",
  close: "M6 6l12 12M18 6 6 18",
  plus: "M12 5v14M5 12h14",
  road: "M8 3 4 21M16 3l4 18M12 4v3M12 10.5v3M12 17v3",
  bridge: "M2 15h20M4 15v5M20 15v5M4 15c2.4-6 13.6-6 16 0M8 11.2V15M12 10.3V15M16 11.2V15",
  building: "M5 21V5.5L12 3l7 2.5V21M3 21h18M9 8.5h.01M15 8.5h.01M9 12.5h.01M15 12.5h.01M9 16.5h.01M15 16.5h.01",
  crane: "M6 21V4M6 4h14M6 4 3 7.5M6 8l4-4M17 4v6M15 10h4v3h-4zM3 21h8",
  shield: "M12 3 20 6v6c0 4.6-3.4 8.3-8 9-4.6-.7-8-4.4-8-9V6l8-3ZM8.5 12l2.5 2.5 4.5-5",
  helmet: "M3 18h18M5 18v-3a7 7 0 0 1 14 0v3M9.5 9V6.5h5V9",
  leaf: "M5 20c0-8.5 6-15 15-15 0 9-6 15-14.5 15M5 20l8-8",
  check: "M5 12.5 9.5 17 19 7.5",
  compass: "M12 3v3M12 6 6 21M12 6l6 15M8.4 15h7.2",
  users: "M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM21 20v-1a4 4 0 0 0-3-3.9M15.5 4.1a3.5 3.5 0 0 1 0 6.8",
  mail: "M3.5 6h17v12h-17zM3.5 7l8.5 6 8.5-6",
  phone: "M5 4h3.5l2 5-2.5 1.5a11 11 0 0 0 5 5L14.5 13l5 2v3.5A1.5 1.5 0 0 1 18 20 16 16 0 0 1 4 6a2 2 0 0 1 1-2Z",
  "map-pin": "M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12ZM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3.5 2",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM12 12h.01",
  eye: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7ZM12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  layers: "m12 3 9 5-9 5-9-5 9-5ZM3 13l9 5 9-5",
  gauge: "M12 14.5 16.5 10M3.5 18a9 9 0 1 1 17 0",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3A4 4 0 0 0 13 5.3l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  scale: "M12 3v18M7.5 21h9M5 7h14M5 7l-3 6a3 3 0 0 0 6 0L5 7ZM19 7l-3 6a3 3 0 0 0 6 0l-3-6Z",
  droplet: "M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11Z",
  sun: "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4",
  clipboard: "M9 3.5h6v3H9zM7.5 5H5v16h14V5h-2.5M9 13.5l2 2 4-4",
  flask: "M9 3h6M10 3v6l-5.2 9A2 2 0 0 0 6.5 21h11a2 2 0 0 0 1.7-3L14 9V3M7.2 15h9.6",
  briefcase: "M3 8h18v12H3zM8.5 8V5h7v3M3 13h18",
  pulse: "M3 12h4l2-4.5 4 9 2-4.5h6",
  file: "M6 3h8.5L19 7.5V21H6zM14 3v5h5M9 12.5h6M9 16.5h6",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5.5M12 7.8h.01",
  award: "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM8.5 14 7 21l5-2.5 5 2.5-1.5-7",
  truck: "M2.5 6h11v10h-11zM13.5 9.5h4l3 3.5V16h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  recycle: "M7 19H4.5l3.5-6M17 19h2.5L16 13M12 4l-2 3.5M12 4l2 3.5M8 13l-2.2-3.6M16 13l2.2-3.6M9.5 19h5",
} as const;

export type IconName = keyof typeof paths;

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  /** Provide a title only when the icon carries meaning on its own (no visible text). */
  title?: string;
};

export function Icon({ name, title, strokeWidth = 1.6, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path d={paths[name]} />
    </svg>
  );
}
