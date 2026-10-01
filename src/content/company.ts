/**
 * Company profile.
 *
 * Every factual field below is `null` until Raghav Buildcon supplies verified information.
 * `null` values render as visible "To be updated" placeholders — do not replace them with
 * estimates. See README.md › "Replacing placeholder content".
 */
import type { Credential, Leader, Pending, Stat } from "./types";

export const company = {
  name: "Raghav Buildcon",
  legalName: null as Pending<string>,
  tagline: "Building Infrastructure. Delivering Trust.",
  description:
    "Raghav Buildcon is an emerging civil infrastructure and construction enterprise committed to delivering high-quality, dependable and technically sound projects.",
  /** Company-supplied "About" text, used on the About page and homepage. */
  about: [
    "Raghav Buildcon, established in March 2026, is an emerging civil infrastructure and construction enterprise committed to delivering high-quality, dependable, and technically sound projects. We undertake a diverse range of infrastructure and civil engineering works, including PMGSY and PWD road projects, bridges, culverts, pipelines, building construction, and allied infrastructure development.",
    "Our approach is built on engineering excellence, quality-driven execution, safety, transparency, and timely project delivery. We are committed to adhering to applicable technical specifications, construction standards, and best industry practices across every stage of our projects. With a forward-looking vision and a strong commitment to professional integrity, Raghav Buildcon aims to contribute to the development of durable, resilient, and sustainable infrastructure while building long-term relationships with clients, authorities, partners, and communities.",
  ],
  /** Works the company undertakes, as stated by the company. */
  works: ["PMGSY road projects", "PWD road projects", "Bridges", "Culverts", "Pipelines", "Building construction", "Allied infrastructure development"],
  founded: "March 2026" as Pending<string>,
  headquarters: "Nashik, Maharashtra" as Pending<string>,
  registration: null as Pending<string>,
  operatingRegions: null as Pending<string>,
};

const OFFICE_ADDRESS = "C-204, Gajra Avenue, Pathardi Gaulane Road, Pathardi Gaon, Nashik, Maharashtra";
/** The company's single published email; also used for careers and media until dedicated inboxes exist. */
const EMAIL = "Raghavbuildconltd@gmail.com";

export const contact = {
  officeName: "Corporate Office",
  address: OFFICE_ADDRESS as Pending<string>,
  phone: "+91 89288 96961" as Pending<string>,
  email: EMAIL as Pending<string>,
  careersEmail: EMAIL as Pending<string>,
  mediaEmail: EMAIL as Pending<string>,
  hours: null as Pending<string>,
  /** Optional Google Maps (or similar) link for the office. */
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(OFFICE_ADDRESS)}` as Pending<string>,
};

/** Optional social profiles. Leave empty to hide the social links entirely. */
export const social: { label: string; href: string }[] = [];

/** Headline figures. Set `value` once the figure is verified; `null` renders a placeholder. */
export const stats: Stat[] = [
  { label: "Established", value: null, text: "2026" },
  { label: "Projects delivered", value: null, suffix: "+" },
  { label: "Lane-km of roads built", value: null },
  { label: "Engineers & professionals", value: null, suffix: "+" },
];

export const leadership: Leader[] = [
  { name: null, role: null, bio: null },
  { name: null, role: null, bio: null },
  { name: null, role: null, bio: null },
];

/** Registrations, certifications and empanelments. Empty slots render as placeholders. */
export const credentials: Credential[] = [];
export const credentialSlots = 4;


/**
 * Company milestones, oldest first. Only the founding entry exists until the company supplies
 * its history — add entries rather than inventing them.
 */
export const milestones: { year: Pending<string>; title: string; description: Pending<string> }[] = [
  {
    year: "March 2026",
    title: "Raghav Buildcon established",
    description: "Founded as a civil infrastructure and construction enterprise undertaking roads, bridges, culverts, pipelines, buildings and allied infrastructure works.",
  },
];
