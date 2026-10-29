/**
 * Build sequences shown by the scroll-driven 3D models (home page and each expertise page).
 *
 * Each sequence describes the usual stages of that kind of work. The models are illustrations,
 * not records of a Raghav Buildcon project, and are labelled as such on the page.
 */
import type { VerticalSlug } from "./types";

export type AssemblyId = "bridge" | "road" | "building" | "pipeline" | "house" | "tower" | "culvert" | "warehouse" | "township" | "verticals" | "network";

export type AssemblyStage = { title: string; text: string };

const travelling: AssemblyStage = { title: "On to the next vertical", text: "" };

export const assemblyStages: Record<AssemblyId, AssemblyStage[]> = {
  bridge: [
    { title: "Survey & set-out", text: "The alignment, levels and every member of the structure are set out before work begins." },
    { title: "Foundations", text: "Piles are driven down to firm strata and tied together with pile caps." },
    { title: "Piers & abutments", text: "Piers rise from the pile caps and abutments retain each bank." },
    { title: "Girders", text: "Girders are lifted onto the pier caps to span from support to support." },
    { title: "Deck slab", text: "The deck slab is placed over the girders, span by span." },
    { title: "Finishing", text: "Wearing coat, crash barriers, road markings and lighting complete the deck." },
    { title: "Open to traffic", text: "Inspected, tested and handed over for use." },
  ],
  road: [
    { title: "Survey & alignment", text: "The centre line, levels and boundaries are pegged out on the ground." },
    { title: "Earthwork & subgrade", text: "The embankment is built up and compacted in layers to form the subgrade." },
    { title: "Granular sub-base", text: "A free-draining granular layer spreads the load and keeps the subgrade dry." },
    { title: "Base course", text: "Wet mix macadam is laid and rolled to form a strong, even base." },
    { title: "Bituminous layers", text: "Bituminous macadam and a dense wearing course give a smooth, durable surface." },
    { title: "Drainage & shoulders", text: "Shoulders and side drains carry water away from the pavement." },
    { title: "Markings & safety", text: "Lane markings, crash barriers and signage make the road ready for traffic." },
  ],
  building: [
    { title: "Set-out", text: "Grid lines and levels are marked out from the approved drawings." },
    { title: "Foundations", text: "The raft foundation is cast and the tower crane is erected." },
    { title: "Structural frame", text: "Columns and slabs rise floor by floor, each checked before the next." },
    { title: "Envelope", text: "Glazing and façade panels close in every floor." },
    { title: "Roof & services", text: "Parapets, plant, tanks and roof services are installed." },
    { title: "External works", text: "Paving, landscaping and the entrance canopy finish the site." },
    { title: "Handover", text: "The crane is dismantled, systems are commissioned and the lights come on." },
  ],
  pipeline: [
    { title: "Survey & route", text: "The route is surveyed and existing services are located before digging." },
    { title: "Excavation", text: "The trench is excavated to line and level." },
    { title: "Bedding", text: "A compacted sand bed gives the pipe even, continuous support." },
    { title: "Pipe laying", text: "Pipe lengths are lowered in and pushed home, one into the next." },
    { title: "Jointing & testing", text: "Joints are sealed and the line is pressure-tested section by section." },
    { title: "Backfill", text: "Sand surround and backfill are placed and compacted in layers." },
    { title: "Restoration", text: "The surface is reinstated and marker posts show the route." },
  ],
  house: [
    { title: "Set-out", text: "The plot is surveyed and the house is pegged out from the plan." },
    { title: "Plinth", text: "Footings and the plinth are cast to carry the walls." },
    { title: "Walls & slab", text: "Walls rise course by course, with the first-floor slab cast between storeys." },
    { title: "Roof structure", text: "The gable, rafters and ridge are set over the walls." },
    { title: "Roofing", text: "Roof panels close the house against the weather." },
    { title: "Doors & windows", text: "Doors, windows, sunshades and the balcony are fitted." },
    { title: "Grounds", text: "Compound wall, gate, lawn and trees complete the home." },
  ],
  tower: [
    { title: "Set-out", text: "The grid and levels of the tower are set out on site." },
    { title: "Raft & crane", text: "The raft foundation is cast and the tower crane is erected." },
    { title: "Core", text: "The central core climbs ahead of the floors." },
    { title: "Floors", text: "Columns and slabs follow, floor by floor." },
    { title: "Façade", text: "Curtain-wall glazing and full-height fins wrap the frame." },
    { title: "Crown", text: "Parapet, lantern and spire top out the tower." },
    { title: "Handover", text: "The crane comes down and the tower lights up." },
  ],
  culvert: [
    { title: "Survey", text: "The stream crossing is surveyed and the culvert set out on its alignment." },
    { title: "Bed", text: "The channel is prepared and a levelling concrete bed is cast." },
    { title: "Box sections", text: "Precast box sections are lowered in and joined, one after another." },
    { title: "Headwalls & wings", text: "Headwalls, wing walls and aprons guide the water and hold back the fill." },
    { title: "Embankment", text: "Fill is placed and compacted in layers around and over the box." },
    { title: "Road", text: "The road is paved and marked across the top." },
    { title: "Open", text: "Railings go up, water flows through and traffic crosses above." },
  ],
  warehouse: [
    { title: "Set-out", text: "The building footprint and column grid are set out." },
    { title: "Footings & floor", text: "Column footings and the floor slab are cast." },
    { title: "Portal frames", text: "Steel portal frames are erected bay by bay." },
    { title: "Purlins", text: "Purlins and eave beams tie the frames together." },
    { title: "Cladding & roof", text: "Wall and roof sheeting close in the building." },
    { title: "Solar & rainwater", text: "Rooftop solar panels and rainwater storage are installed." },
    { title: "Yard", text: "The yard is paved and planted, ready for use." },
  ],
  township: [
    { title: "Survey", text: "The site is surveyed and set out." },
    { title: "Foundations", text: "Raft and plinths are cast." },
    { title: "Structure", text: "The tower core, frame and house walls rise." },
    { title: "Envelope", text: "Glazing and roofs close in the buildings." },
    { title: "Finishing", text: "The street is paved, planted and lit." },
    { title: "Ready", text: "The crane leaves and the street comes to life." },
  ],
  network: [
    { title: "Survey", text: "The route is surveyed across the river and set out on the ground." },
    { title: "Earthworks", text: "The road formation is built up along the route." },
    { title: "Bridge piers", text: "Piers rise from the riverbed to carry the crossing." },
    { title: "Deck & paving", text: "The bridge deck goes on and the road is paved end to end." },
    { title: "Road furniture", text: "Markings, parapets and street lighting complete the road." },
    { title: "Buildings", text: "Homes and a tower rise beside the new road." },
    { title: "Connected", text: "Traffic crosses, the lights come on and the town is connected." },
  ],
  verticals: [],
};

// The verticals world runs the road, bridge, building and pipeline sequences one after another,
// each followed by one stage while the camera travels on.
assemblyStages.verticals = [assemblyStages.road, assemblyStages.bridge, assemblyStages.building, assemblyStages.pipeline].flatMap((list) => [...list, travelling]);

/** The three structures shown in the home page's "What we build" section. */
export const showcase: { model: AssemblyId; title: string; text: string; href: string; link: string }[] = [
  { model: "house", title: "Homes", text: "Independent houses and residential buildings, from the plinth to the roof.", href: "/expertise/buildings", link: "Buildings" },
  { model: "tower", title: "Multi-storey buildings", text: "Core, frame and façade, rising floor by floor.", href: "/expertise/buildings", link: "Buildings" },
  { model: "culvert", title: "Culverts & cross-drainage", text: "Box culverts that carry water safely under the road.", href: "/expertise/bridges-structures", link: "Bridges & Structures" },
];

/** The model and headline shown on each expertise page. */
export const verticalAssembly: Record<VerticalSlug, { model: AssemblyId; title: string; lead: string }> = {
  "roads-highways": {
    model: "road",
    title: "Layer by layer, a road takes shape.",
    lead: "From the subgrade to the wearing course, each layer of a road assembled in turn.",
  },
  "bridges-structures": {
    model: "bridge",
    title: "Span by span, a bridge takes shape.",
    lead: "Foundations, piers, girders and deck: the stages of a bridge build, assembled one by one.",
  },
  buildings: {
    model: "building",
    title: "Floor by floor, a building takes shape.",
    lead: "From the raft foundation to the lights coming on, the stages of a building assembled floor by floor.",
  },
  "epc-construction": {
    model: "pipeline",
    title: "Joint by joint, a pipeline takes shape.",
    lead: "Excavation, bedding, laying, testing and backfill: the stages of a pipeline assembled joint by joint.",
  },
};
