import type { IconName } from "@/components/ui/Icon";
import { verticals } from "./verticals";

export type NavLink = {
  label: string;
  href: string;
  description?: string;
  icon?: IconName;
};

export type NavItem = NavLink & {
  /** Sub-links shown in the dropdown (desktop) and accordion (mobile). */
  children?: NavLink[];
  /** Render the dropdown as a wide panel with descriptions. */
  mega?: boolean;
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About Us", href: "/about", description: "Discover Raghav Buildcon and our values.", icon: "building" },
      { label: "About Proprietor", href: "/about/proprietor", description: "Meet Mr. Sagar Wale, our proprietor.", icon: "users" },
    ],
  },
  {
    label: "Expertise",
    href: "/expertise",
    mega: true,
    children: verticals.map((v) => ({ label: v.title, href: `/expertise/${v.slug}`, description: v.summary, icon: v.icon })),
  },
  {
    label: "Projects",
    href: "/projects",
    children: [
      { label: "Infrastructure Projects", href: "/projects", description: "Our project portfolio across every vertical.", icon: "layers" },
      { label: "Signature Projects", href: "/signature-projects", description: "The stories behind landmark works.", icon: "spark" },
    ],
  },
  {
    label: "Responsibility",
    href: "/sustainability",
    children: [
      { label: "Sustainability & ESG", href: "/sustainability", description: "Environment, social and governance commitments.", icon: "leaf" },
      { label: "Safety & Quality", href: "/safety-quality", description: "How we protect people and assure every build.", icon: "shield" },
    ],
  },
  { label: "Careers", href: "/careers" },
  { label: "News", href: "/news" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About Raghav Buildcon", href: "/about" },
      { label: "About Proprietor", href: "/about/proprietor" },
      { label: "Careers", href: "/careers" },
      { label: "News & updates", href: "/news" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Expertise",
    links: [...verticals.map((v) => ({ label: v.title, href: `/expertise/${v.slug}` })), { label: "All expertise", href: "/expertise" }],
  },
  {
    title: "Projects",
    links: [
      { label: "Infrastructure Projects", href: "/projects" },
      { label: "Signature Projects", href: "/signature-projects" },
      { label: "Sustainability & ESG", href: "/sustainability" },
      { label: "Safety & Quality", href: "/safety-quality" },
    ],
  },
];
