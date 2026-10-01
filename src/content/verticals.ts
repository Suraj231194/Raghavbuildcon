/**
 * Business verticals. Capability and scope lists describe the kinds of work in each vertical;
 * review them with the company and remove anything Raghav Buildcon does not undertake.
 */
import type { Vertical, VerticalSlug } from "./types";
import { photos } from "./images";

export const verticals: Vertical[] = [
  {
    slug: "roads-highways",
    title: "Roads & Highways",
    icon: "road",
    summary: "PMGSY and PWD road projects — rural connectivity, district and state roads.",
    intro: [
      "Roads are the backbone of economic movement. Our highways practice covers new alignments, widening of existing corridors and the strengthening of ageing pavements — delivered with traffic kept moving and communities kept safe.",
      "From earthwork and embankments to the final layer of road markings, every stage is planned around durability, ride quality and the long service life that public road owners expect.",
    ],
    image: photos.roads,
    capabilities: [
      { icon: "layers", title: "Greenfield alignments", description: "New highway corridors from earthwork and embankment through pavement, drainage and road furniture." },
      { icon: "road", title: "Widening & upgrading", description: "Widening and strengthening of existing roads, carried out in phases alongside live traffic." },
      { icon: "gauge", title: "Pavement engineering", description: "Flexible and rigid pavements, overlays and strengthening designed for heavy axle loads." },
      { icon: "bridge", title: "Grade separators", description: "Interchanges, flyovers, vehicular and pedestrian underpasses integrated with the corridor." },
    ],
    scope: [
      "Earthwork, embankment and subgrade",
      "Granular and bituminous pavement layers",
      "Rigid (concrete) pavements",
      "Cross-drainage and side drains",
      "Interchanges and grade separators",
      "Road furniture, signage and markings",
      "Toll plazas and wayside amenities",
      "Maintenance and rehabilitation",
    ],
  },
  {
    slug: "bridges-structures",
    title: "Bridges & Structures",
    icon: "bridge",
    summary: "Bridges, culverts and cross-drainage structures built to specification.",
    intro: [
      "Bridges and elevated structures demand the most from engineering teams: deep foundations, heavy lifts, tight tolerances and work over water, rail or live roads.",
      "We bring structural design coordination, methodical construction sequencing and rigorous quality control to every span — so that the structures we build carry loads safely for decades.",
    ],
    image: photos.bridges,
    capabilities: [
      { icon: "layers", title: "Deep foundations", description: "Pile, well and open foundations for river, marine and urban conditions." },
      { icon: "bridge", title: "Superstructures", description: "RCC and pre-stressed concrete girders, box girders and composite steel decks." },
      { icon: "crane", title: "Elevated corridors", description: "Viaducts and flyovers built with precast segments to limit disruption below." },
      { icon: "shield", title: "Rail-over-bridges", description: "Structures over operational railway lines, delivered within strict possession windows." },
    ],
    scope: [
      "Major and minor river bridges",
      "Flyovers and elevated viaducts",
      "Rail-over-bridges and rail-under-bridges",
      "Culverts and cross-drainage structures",
      "Pre-stressed and precast girders",
      "Retaining walls and reinforced earth",
      "Bridge rehabilitation and strengthening",
      "Bearings, expansion joints and crash barriers",
    ],
  },
  {
    slug: "buildings",
    title: "Buildings",
    icon: "building",
    summary: "Institutional, commercial, residential and industrial buildings, delivered turnkey.",
    intro: [
      "Buildings are where infrastructure meets people. We construct institutional, commercial, residential and industrial facilities with the same engineering discipline we apply to civil works.",
      "Our teams coordinate structure, services and finishes from foundation to handover, keeping quality, safety and schedule visible at every floor.",
    ],
    image: photos.buildings,
    capabilities: [
      { icon: "building", title: "Institutional campuses", description: "Educational, healthcare and government buildings designed around public use." },
      { icon: "briefcase", title: "Commercial buildings", description: "Office, retail and mixed-use developments with high-quality envelopes." },
      { icon: "layers", title: "Residential projects", description: "Group housing and township buildings delivered at scale and consistency." },
      { icon: "crane", title: "Industrial facilities", description: "Warehouses, plants and pre-engineered structures with heavy-duty floors." },
    ],
    scope: [
      "RCC and composite structures",
      "Pre-engineered steel buildings",
      "Façade and building envelope",
      "MEP coordination and installation",
      "Interior and finishing works",
      "External development and landscaping",
      "Fire safety and life-safety systems",
      "Turnkey design-and-build delivery",
    ],
  },
  {
    slug: "epc-construction",
    title: "EPC / Construction",
    icon: "crane",
    summary: "Single-point engineering, procurement and construction responsibility for complex projects.",
    intro: [
      "Under an EPC model, the client gets one accountable partner from design to commissioning. We integrate engineering, procurement and construction so that decisions are made early, interfaces are controlled and risk is managed in one place.",
      "Our project management approach ties design, supply chain and site execution to a single integrated programme, giving owners clear visibility of progress, cost and quality.",
    ],
    image: photos.epc,
    capabilities: [
      { icon: "compass", title: "Engineering & design", description: "Surveys, investigations and design management, coordinated with authorities and consultants." },
      { icon: "layers", title: "Procurement", description: "Material sourcing, vendor development and logistics planned around the construction programme." },
      { icon: "crane", title: "Construction", description: "Self-performed and supervised site execution with planned equipment and resources." },
      { icon: "clipboard", title: "Project management", description: "Integrated scheduling, cost control, risk management and transparent progress reporting." },
    ],
    scope: [
      "Feasibility, surveys and investigations",
      "Detailed engineering and design management",
      "Procurement and supply-chain management",
      "Civil, structural and finishing works",
      "Testing and commissioning",
      "Pipelines and allied infrastructure works",
      "Interface and stakeholder management",
      "Operation and maintenance support",
      "Statutory approvals coordination",
    ],
  },
];

export const verticalMap = Object.fromEntries(verticals.map((v) => [v.slug, v])) as Record<VerticalSlug, Vertical>;

export function getVertical(slug: string): Vertical | undefined {
  return verticals.find((v) => v.slug === slug);
}

/** Delivery lifecycle shared across verticals. */
export const deliveryProcess = [
  { title: "Survey & investigation", description: "Topographic, geotechnical and traffic studies that ground every design decision in site reality." },
  { title: "Design & engineering", description: "Design coordination and value engineering to balance durability, constructability and cost." },
  { title: "Planning & mobilisation", description: "Integrated programmes, resource plans and site set-up before the first excavation." },
  { title: "Construction", description: "Sequenced execution with daily progress tracking, safety controls and supervision." },
  { title: "Quality assurance", description: "Inspection and test plans, material testing and hold points at every critical stage." },
  { title: "Handover & support", description: "Documentation, as-built records and defect-liability support beyond completion." },
];
