/*
 * The building kit for the 3D models: the part and model types, and a builder that places parts
 * relative to an origin (and can renumber their stages), so a structure written once can be used
 * on its own or as one piece of a larger scene. Units are roughly metres; y is up.
 */

export type Vec3 = readonly [number, number, number];

export type Finish =
  | "concrete"
  | "concreteDark"
  | "steel"
  | "gold"
  | "asphalt"
  | "asphaltLight"
  | "earth"
  | "earthDark"
  | "gravel"
  | "gravelDark"
  | "sand"
  | "water"
  | "glass"
  | "glassDark"
  | "cabin"
  | "paint"
  | "lamp"
  | "leaf"
  | "pipe"
  | "white"
  | "tyre"
  | "paving"
  | "plaster"
  | "tile"
  | "wood"
  | "sheet"
  | "solar";

export type Part = {
  /** A cuboid, a cylinder (or cone), or a triangular prism along x with its ridge on top. */
  shape: "box" | "cyl" | "gable";
  /** Box and gable: width, height, depth. Cylinder: top radius, height, bottom radius. */
  size: Vec3;
  /** Centre of the finished part. */
  at: Vec3;
  rot?: Vec3;
  finish: Finish;
  /** The stage it arrives in; -1 means it is on site from the start. */
  stage: number;
  /** When it starts within its stage, 0–1. Defaults to the order parts were added. */
  order?: number;
  /** How long it takes, as a share of its stage. Defaults by how many parts the stage has. */
  dur?: number;
  /** Offset it travels in from. */
  from?: Vec3;
  /** Extra rotation it turns in from. */
  turn?: Vec3;
  /** Grows out of its base (y), or is laid from its start along x or z, instead of travelling. */
  grow?: "y" | "x" | "z";
  /** Leaves during `stage`, travelling by `to`. */
  exit?: { stage: number; to: Vec3; order?: number };
  shadow?: boolean;
  /** Drawn as a blueprint outline until it arrives. Default true for built parts. */
  ghost?: boolean;
  /** First stage of the structure the part belongs to; its outline is drawn from then. Set by the builder. */
  group?: number;
};

export type CameraKey = { at: number; pos: Vec3; look: Vec3 };

export type AssemblyModel = {
  parts: Part[];
  camera: CameraKey[];
  /** Height of the site floor. */
  floor: number;
  /** Half the width of the site: sizes the shadows and the fog. */
  extent: number;
  /** Stage in which glazing and lamps light up. */
  lightsStage?: number;
  /** Fog start and end distances; by default scaled from `extent`. */
  fog?: [number, number];
  /** Centre of the site floor, when the model is not built around the origin. */
  center?: Vec3;
  /** Half the width the sun's shadow covers; with it set, the shadow follows the camera's target. */
  shadowExtent?: number;
  /** Camera keys are placed in build progress (the stages), not scroll progress. */
  cameraOnBuild?: boolean;
};

export type Extra = Partial<Omit<Part, "shape" | "size" | "at" | "finish" | "stage">>;

export type Builder = {
  parts: Part[];
  box(size: Vec3, at: Vec3, finish: Finish, stage: number, extra?: Extra): void;
  cyl(size: Vec3, at: Vec3, finish: Finish, stage: number, extra?: Extra): void;
  gable(size: Vec3, at: Vec3, finish: Finish, stage: number, extra?: Extra): void;
  /** A builder whose parts are offset by `origin` and whose stages are renumbered by `stages`. */
  at(origin: Vec3, stages?: (stage: number) => number): Builder;
};

export function builder(parts: Part[] = [], origin: Vec3 = [0, 0, 0], stages: (stage: number) => number = (s) => s): Builder {
  const restage = (s: number) => (s < 0 ? s : stages(s));
  const add = (shape: Part["shape"]) => (size: Vec3, at: Vec3, finish: Finish, stage: number, extra: Extra = {}) => {
    const part: Part = { shape, size, at: [at[0] + origin[0], at[1] + origin[1], at[2] + origin[2]], finish, stage: restage(stage), group: stages(0), ...extra };
    if (extra.exit) part.exit = { ...extra.exit, stage: restage(extra.exit.stage) };
    parts.push(part);
  };
  return {
    parts,
    box: add("box"),
    cyl: add("cyl"),
    gable: add("gable"),
    at: (o, map) => builder(parts, [origin[0] + o[0], origin[1] + o[1], origin[2] + o[2]], map ? (s) => stages(map(s)) : stages),
  };
}

export const HALF_PI = Math.PI / 2;

/** Survey pegs with flags, set out in stage 0 and cleared once the foundations are in. */
export function pegs(b: Builder, points: [number, number][], ground: number) {
  const xs = points.map((p) => p[0]);
  const min = Math.min(...xs);
  const range = Math.max(...xs) - min || 1;
  for (const [x, z] of points) {
    const order = ((x - min) / range) * 0.8 + (z > 0 ? 0.1 : 0);
    const exit = { stage: 2, to: [0, 3, 0] as Vec3, order: order * 0.5 };
    b.cyl([0.06, 1.2, 0.06], [x, ground + 0.6, z], "paint", 0, { order, from: [0, 2.5, 0], ghost: false, exit });
    b.box([0.38, 0.24, 0.02], [x + 0.2, ground + 1.05, z], "gold", 0, { order, from: [0, 2.5, 0], ghost: false, shadow: false, exit });
  }
}

/** A car or a truck on a road along x, driving in from `distance` metres away in direction `dir`. */
export function vehicle(b: Builder, x: number, road: number, z: number, dir: 1 | -1, truck: boolean, stage: number, order: number, distance = 46) {
  const extra: Extra = { order, dur: 0.75, from: [-dir * distance, 0, 0], ghost: false };
  if (truck) {
    b.box([1.9, 1.7, 2.1], [x + dir * 3.1, road + 0.4 + 0.85, z], "gold", stage, extra);
    b.box([5.2, 2.2, 2.2], [x - dir * 0.7, road + 0.4 + 1.1, z], "steel", stage, extra);
  } else {
    b.box([3.8, 0.75, 1.75], [x, road + 0.3 + 0.375, z], "white", stage, extra);
    b.box([2, 0.6, 1.55], [x - dir * 0.2, road + 0.3 + 0.75 + 0.3, z], "cabin", stage, extra);
  }
  const wheelbase = truck ? 2.4 : 1.25;
  for (const dx of [-wheelbase, wheelbase])
    for (const dz of [-0.8, 0.8])
      b.cyl([0.36, 0.26, 0.36], [x + dx + (truck ? dir * 0.6 : 0), road + 0.36, z + dz], "tyre", stage, { ...extra, rot: [HALF_PI, 0, 0], shadow: false });
}

/** A tree: trunk, then a conical crown. */
export function tree(b: Builder, x: number, ground: number, z: number, stage: number, order: number, height = 1) {
  b.cyl([0.15 * height, 1.6 * height, 0.18 * height], [x, ground + 0.8 * height, z], "earthDark", stage, { order, grow: "y" });
  b.cyl([0, 3 * height, 1.3 * height], [x, ground + (1.6 + 1.5) * height, z], "leaf", stage, { order: order + 0.05, from: [0, 2, 0] });
}

/** A camera position on a circle around `look`: `deg` measured from +z towards +x. */
export function orbit(deg: number, distance: number, height: number, look: Vec3): Vec3 {
  const a = (deg * Math.PI) / 180;
  return [look[0] + Math.sin(a) * distance, look[1] + height, look[2] + Math.cos(a) * distance];
}
