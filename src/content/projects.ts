/**
 * Project portfolio.
 *
 * IMPORTANT: every entry below is SAMPLE content (`sample: true`). The entries show how real
 * projects will be presented — they are not Raghav Buildcon projects, and every fact is `null`.
 * Replace each entry with a verified project (name, client, location, value, status, scope,
 * photography) and set `sample: false`. Sample entries are badged throughout the site.
 */
import type { Project, ProjectFacts } from "./types";
import { photos } from "./images";

const pendingFacts: ProjectFacts = {
  client: null,
  location: null,
  contractValue: null,
  status: null,
  duration: null,
  contractType: null,
};

export const projects: Project[] = [
  {
    slug: "four-lane-highway-corridor",
    title: "Four-Lane Highway Corridor",
    vertical: "roads-highways",
    sample: true,
    signature: true,
    summary: "Upgrading a congested two-lane alignment into a four-lane divided carriageway with service roads and grade separators.",
    overview: [
      "A highway corridor upgrade of this kind widens an existing two-lane road into a four-lane divided carriageway, adding paved shoulders, a landscaped median and service roads through built-up stretches.",
      "Construction is phased so that traffic keeps moving throughout, with temporary diversions, night-time works at junctions and continuous safety management along live sections.",
    ],
    scope: [
      "Widening and strengthening of the existing carriageway",
      "New embankment, subgrade and pavement layers",
      "Cross-drainage structures and side drains",
      "Vehicular and pedestrian underpasses",
      "Road furniture, signage, markings and lighting",
    ],
    highlights: [
      "Traffic diversion plan maintaining two-way movement during construction",
      "Phased junction works scheduled outside peak hours",
      "Pavement designed for heavy commercial axle loads",
      "Median plantation and roadside landscaping",
    ],
    facts: { ...pendingFacts },
    story: {
      challenge: "Widening a heavily used corridor without closing it — while keeping roadside communities, schools and markets safely connected.",
      approach: "A phased construction sequence with temporary diversions, segregated work zones and a dedicated traffic-safety team on every live stretch.",
      outcome: "Verified outcomes — completion date, length delivered and performance — will be published here once confirmed.",
    },
    image: photos.roads,
    gallery: [
      photos.aerial,
      photos.engineers,
    ],
  },
  {
    slug: "major-river-bridge",
    title: "Major River Bridge",
    vertical: "bridges-structures",
    sample: true,
    signature: true,
    summary: "A long river crossing on deep foundations, with tall piers and precast superstructure spans.",
    overview: [
      "A major river bridge connects communities that were previously separated by water, replacing long detours or seasonal crossings with an all-weather link.",
      "Works of this scale combine deep foundations in the riverbed, a long main span and precast approach spans — each planned around monsoon windows and river flow conditions.",
    ],
    scope: [
      "Pile and well foundations in the riverbed",
      "Pylons, pier caps and substructure",
      "Pre-stressed concrete superstructure spans",
      "Precast segmental approach viaducts",
      "Bearings, expansion joints, crash barriers and lighting",
    ],
    highlights: [
      "Foundation works scheduled around monsoon and river-flow windows",
      "Precast yard to control quality and reduce work over water",
      "Geometry control and monitoring during span erection",
      "Navigation and environmental safeguards on the river",
    ],
    facts: { ...pendingFacts },
    story: {
      challenge: "Building deep foundations and a long main span in a river with strong seasonal flows and a short working season.",
      approach: "Foundations prioritised in the dry season, a precast yard on the bank and a monitored, step-by-step erection sequence for the main span.",
      outcome: "Verified outcomes — span lengths, completion date and performance — will be published here once confirmed.",
    },
    image: photos.bridges,
    gallery: [
      photos.engineers,
      photos.safety,
    ],
  },
  {
    slug: "hill-section-highway",
    title: "Hill-Section Highway Upgrade",
    vertical: "roads-highways",
    sample: true,
    signature: true,
    summary: "Realigning a winding ghat road with a curved viaduct, a tunnel and slope-protection works.",
    overview: [
      "Hill-section highways replace slow, accident-prone hairpin roads with safer geometry — combining viaducts, tunnels and cuttings to flatten gradients and straighten curves.",
      "Work in mountainous terrain requires careful slope stabilisation, drainage and environmental management, with construction sequenced around monsoon conditions.",
    ],
    scope: [
      "Realignment with improved gradients and curves",
      "Curved viaduct across a valley section",
      "Tunnel portals and lining works",
      "Slope protection, rock bolting and drainage",
      "Crash barriers, signage and delineation",
    ],
    highlights: [
      "Geotechnical investigation guiding every cut and fill",
      "Slope stabilisation designed for heavy monsoon rainfall",
      "Minimised tree felling and compensatory plantation",
      "Continuous safety management for traffic on the old road",
    ],
    facts: { ...pendingFacts },
    story: {
      challenge: "Delivering safer geometry through steep, monsoon-exposed terrain while the existing ghat road stays open to traffic.",
      approach: "A viaduct-and-tunnel alignment to avoid deep cuttings, with slope protection installed ahead of each monsoon season.",
      outcome: "Verified outcomes — length, travel-time savings and completion date — will be published here once confirmed.",
    },
    image: photos.hillRoad,
    gallery: [
      photos.roads,
      photos.solar,
    ],
  },
  {
    slug: "highway-interchange",
    title: "Highway Interchange Package",
    vertical: "roads-highways",
    sample: true,
    signature: false,
    summary: "A cloverleaf interchange connecting two highways, with ramps, a flyover and junction improvements.",
    overview: [
      "Interchanges remove at-grade conflicts where major roads meet, improving safety and keeping long-distance traffic moving.",
      "Packages like this combine a flyover, loop and slip ramps, drainage and junction improvements on the connecting roads.",
    ],
    scope: [
      "Main-line flyover and approaches",
      "Loop and slip ramps",
      "Reinforced-earth retaining walls",
      "Drainage and utility relocation",
      "Signage, lighting and road markings",
    ],
    highlights: [
      "Traffic management plan for two live highways",
      "Reinforced-earth walls to reduce land take",
      "Integrated drainage for low-lying ramps",
    ],
    facts: { ...pendingFacts },
    image: photos.aerial,
    gallery: [photos.roads],
  },
  {
    slug: "elevated-urban-viaduct",
    title: "Elevated Urban Viaduct",
    vertical: "bridges-structures",
    sample: true,
    signature: false,
    summary: "An elevated corridor above a busy city street, built with precast segments to keep the road below open.",
    overview: [
      "Elevated corridors add capacity in dense cities where there is no room to widen at ground level — for metro rail, expressways or flyovers.",
      "Precast construction moves most of the work off the street, so the corridor can rise above traffic with limited disruption to shops, homes and commuters.",
    ],
    scope: [
      "Pile foundations and single-column piers",
      "Precast segmental superstructure",
      "Launching-girder erection",
      "Utility diversions and barricading",
      "Road restoration below the viaduct",
    ],
    highlights: [
      "Off-site precasting to minimise street occupation",
      "Night-time erection within traffic-police windows",
      "Noise and dust controls for adjacent residents",
    ],
    facts: { ...pendingFacts },
    image: photos.metro,
    gallery: [
      photos.bridges,
      photos.epc,
    ],
  },
  {
    slug: "institutional-campus",
    title: "Institutional Campus Buildings",
    vertical: "buildings",
    sample: true,
    signature: false,
    summary: "Academic and administrative blocks for a public institution, delivered with services and external development.",
    overview: [
      "Institutional campuses bring together teaching, administrative and residential buildings that must serve the public for decades.",
      "Delivery covers structure, building services, finishes and external development, coordinated so that the campus can be handed over in usable phases.",
    ],
    scope: [
      "RCC framed academic and administrative blocks",
      "MEP services and fire safety systems",
      "Façades, finishes and interiors",
      "Internal roads, drainage and landscaping",
      "Phased handover of completed blocks",
    ],
    highlights: [
      "Phased handover so facilities can open early",
      "Energy-efficient envelope and lighting",
      "Accessible design for all users",
    ],
    facts: { ...pendingFacts },
    image: photos.buildings,
    gallery: [photos.engineers],
  },
  {
    slug: "industrial-facility-epc",
    title: "Industrial Facility EPC",
    vertical: "epc-construction",
    sample: true,
    signature: false,
    summary: "Single-point EPC delivery of an industrial facility — from design and procurement to commissioning.",
    overview: [
      "Industrial owners need facilities that are ready to operate on a fixed date. An EPC contract places design, procurement and construction under one accountable partner.",
      "Integrated planning links engineering deliverables, equipment supply and site works, so that interfaces are resolved before they reach the site.",
    ],
    scope: [
      "Site development and heavy-duty foundations",
      "Pre-engineered and RCC structures",
      "Equipment foundations and pipe racks",
      "Utilities, roads and drainage",
      "Testing, commissioning and handover",
    ],
    highlights: [
      "Single integrated programme across E, P and C",
      "Early procurement of long-lead items",
      "Commissioning planned from day one",
    ],
    facts: { ...pendingFacts },
    image: photos.epc,
    gallery: [photos.safety],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const signatureProjects = projects.filter((p) => p.signature);
