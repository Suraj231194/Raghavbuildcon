/**
 * News & updates.
 *
 * Every post below is a SAMPLE (`sample: true`) that shows how updates will look. Replace them
 * with real announcements (and real dates) before launch, and set `sample: false`.
 */
import type { NewsPost } from "./types";
import { photos } from "./images";

export const news: NewsPost[] = [
  {
    slug: "project-milestone-update",
    title: "Project milestone update",
    category: "Projects",
    date: null,
    excerpt: "A placeholder for project milestone announcements — foundation completion, span launches, corridor openings and handovers.",
    body: [
      "This is a sample update that shows how project milestones will be presented on the Raghav Buildcon website.",
      "Replace this text with the announcement: which project reached which milestone, when it happened, and what it means for the people who will use the finished infrastructure. Add a photograph from site where possible.",
      "Keep each update factual and verifiable — dates, quantities and names should match the project records.",
    ],
    image: photos.bridges,
    sample: true,
  },
  {
    slug: "safety-week-on-site",
    title: "Safety week across our project sites",
    category: "Safety",
    date: null,
    excerpt: "A placeholder for safety and quality updates — training drives, audits, campaigns and recognition for safe work.",
    body: [
      "This is a sample update that shows how safety and quality news will be presented.",
      "Replace this text with details of the safety initiative: the sites involved, the activities carried out, the number of people trained and any verified outcomes.",
    ],
    image: photos.safety,
    sample: true,
  },
  {
    slug: "joining-our-engineering-team",
    title: "Joining our engineering team",
    category: "Careers",
    date: null,
    excerpt: "A placeholder for people news — recruitment drives, graduate programmes and stories from our teams on site.",
    body: [
      "This is a sample update that shows how people and careers news will be presented.",
      "Replace this text with the announcement: roles being recruited, locations, eligibility and how to apply. Link to the Careers page for applications.",
    ],
    image: photos.team,
    sample: true,
  },
];

export function getNewsPost(slug: string): NewsPost | undefined {
  return news.find((n) => n.slug === slug);
}
