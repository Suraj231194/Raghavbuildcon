import type { IconName } from "@/components/ui/Icon";

/**
 * A value the company has not supplied yet.
 * `null` renders as a clearly-marked "To be updated" placeholder — never as a guess.
 */
export type Pending<T> = T | null;

export type ImageAsset = {
  src: string;
  alt: string;
};

export type VerticalSlug = "roads-highways" | "bridges-structures" | "buildings" | "epc-construction";

export type Capability = {
  title: string;
  description: string;
  icon: IconName;
};

export type Vertical = {
  slug: VerticalSlug;
  title: string;
  icon: IconName;
  /** One line for cards and menus. */
  summary: string;
  /** Opening paragraph(s) for the vertical page. */
  intro: string[];
  image: ImageAsset;
  capabilities: Capability[];
  /** Types of work delivered under this vertical. */
  scope: string[];
};

export type ProjectFacts = {
  client: Pending<string>;
  location: Pending<string>;
  contractValue: Pending<string>;
  status: Pending<string>;
  duration: Pending<string>;
  contractType: Pending<string>;
};

export type ProjectStory = {
  challenge: string;
  approach: string;
  outcome: string;
};

export type Project = {
  slug: string;
  title: string;
  vertical: VerticalSlug;
  /**
   * True while the entry is illustrative sample content rather than a verified project.
   * Sample entries are badged in the UI. Set to false only once every fact has been confirmed.
   */
  sample: boolean;
  signature: boolean;
  summary: string;
  overview: string[];
  scope: string[];
  highlights: string[];
  facts: ProjectFacts;
  story?: ProjectStory;
  image: ImageAsset;
  gallery: ImageAsset[];
};

export type NewsPost = {
  slug: string;
  title: string;
  category: string;
  /** ISO date (YYYY-MM-DD). */
  date: Pending<string>;
  excerpt: string;
  body: string[];
  image: ImageAsset;
  sample: boolean;
};

export type Stat = {
  label: string;
  value: Pending<number>;
  suffix?: string;
  /** Static text shown instead of an animated number (e.g. a year). */
  text?: string;
  description?: string;
};

export type Leader = {
  name: Pending<string>;
  role: Pending<string>;
  bio: Pending<string>;
};

export type Credential = {
  title: string;
  issuer: Pending<string>;
};
