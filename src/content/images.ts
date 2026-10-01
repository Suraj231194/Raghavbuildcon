/**
 * Photography registry — every photo on the site is referenced from here.
 *
 * These are generic stock photographs (Unsplash Licence: free for commercial use, no attribution
 * required) used as placeholders. None of them shows a Raghav Buildcon project. Replace each
 * file in public/images/ with the company's own project photography (keep the file name, or
 * change `src`) and update `alt`. Credits are listed in README.md.
 */
import type { ImageAsset } from "./types";

export const photos = {
  hero: { src: "/images/hero-expressway.jpg", alt: "Aerial view of a city highway interchange lit up at night" },
  roads: { src: "/images/roads-highways.jpg", alt: "Divided highway running through a cutting in red-earth hills" },
  bridges: { src: "/images/bridges-structures.jpg", alt: "Concrete bridge on tall piers crossing a wide stretch of water" },
  buildings: { src: "/images/buildings.jpg", alt: "Tower cranes above a building under construction" },
  epc: { src: "/images/epc-construction.jpg", alt: "Excavator loading soil into a dump truck on a construction site" },
  aerial: { src: "/images/aerial-interchange.jpg", alt: "Aerial view of highways crossing through green countryside" },
  engineers: { src: "/images/engineers-site.jpg", alt: "Construction professionals in hard hats and high-visibility vests taking measurements on site" },
  metro: { src: "/images/metro-viaduct.jpg", alt: "Elevated metro line curving above a city road" },
  hillRoad: { src: "/images/ghat-highway.jpg", alt: "Road winding through green hills and tea plantations" },
  solar: { src: "/images/sustainability.jpg", alt: "Aerial view of solar panel rows across a green field" },
  safety: { src: "/images/safety-quality.jpg", alt: "Construction workers wearing hard hats and high-visibility vests" },
  team: { src: "/images/careers-team.jpg", alt: "Construction crew in hard hats gathered for a site briefing" },
} satisfies Record<string, ImageAsset>;

/** Stylised map used on the contact page (original illustration). */
export const officeMap: ImageAsset = { src: "/illustrations/office-map.svg", alt: "Stylised city map with an office location marker" };
