import { builder, pegs, tree, vehicle, type AssemblyModel, type Builder, type CameraKey, type Vec3 } from "./kit";
import { bridge, building, pipeline, road } from "./models";
import { buildHouse, buildTower } from "./models-homes";

/*
 * Larger worlds composed from the single models: the four verticals side by side on one site, and
 * a network of roads, a bridge and the buildings they connect.
 */

/** Stages each vertical takes in the world: its seven, then one while the camera travels on. */
export const STAGES_PER_VERTICAL = 8;

/**
 * The four verticals — road, bridge, building, pipeline — built one after another along a single
 * landscape. The camera follows each build and then flies on to the next site, so the four read as
 * one continuous presentation.
 */
export function verticalsWorld(): AssemblyModel {
  const b = builder();
  const sites: { make: (b: Builder) => AssemblyModel; origin: Vec3 }[] = [
    { make: road, origin: [0, 0, 0] },
    // The bridge's gorge floor sits 1.4 m below its banks; lift it onto the common floor.
    { make: bridge, origin: [130, 1.4, -8] },
    { make: building, origin: [262, 0, 0] },
    { make: pipeline, origin: [360, 0, -4] },
  ];
  const total = sites.length * STAGES_PER_VERTICAL;
  const camera: CameraKey[] = [];
  sites.forEach(({ make, origin }, i) => {
    const first = i * STAGES_PER_VERTICAL;
    const model = make(b.at(origin, (s) => first + s));
    const shift = (v: Vec3): Vec3 => [v[0] + origin[0], v[1] + origin[1], v[2] + origin[2]];
    for (const k of model.camera) camera.push({ at: (first + k.at * (STAGES_PER_VERTICAL - 1)) / total, pos: shift(k.pos), look: shift(k.look) });
  });
  return {
    parts: b.parts,
    camera,
    cameraOnBuild: true,
    floor: 0,
    center: [180, 0, 0],
    extent: 230,
    shadowExtent: 60,
    fog: [115, 270],
    lightsStage: 2 * STAGES_PER_VERTICAL + 6,
  };
}

/** Bank height either side of the river in the network. */
const BANK = 3;

/**
 * A road network: a new road winds from a town of homes, crosses a river on a bridge and reaches a
 * tower on the far bank. The road is paved along its length as it is scrolled, every segment
 * meeting the next at a round joint, and the buildings rise beside it.
 */
export function network(): AssemblyModel {
  const b = builder();
  const SURFACE = BANK + 0.4;

  // Banks with grass, and the river between them (there from the start).
  for (const s of [-1, 1]) {
    b.box([61, BANK, 84], [s * 39.5, BANK / 2, 0], "earthDark", -1, { ghost: false });
    b.box([61, 0.08, 84], [s * 39.5, BANK + 0.04, 0], "leaf", -1, { ghost: false, shadow: false });
  }
  b.box([18, 1.6, 84], [0, 0.8, 0], "water", -1, { ghost: false, shadow: false });

  // The route, from the town (left) across the bridge to the tower (right).
  const route: [number, number][] = [[-66, 26], [-40, 18], [-22, 4], [-9, 0], [9, 0], [24, -6], [42, -16], [66, -22]];
  pegs(b, route.filter((_, i) => i % 2 === 0).map(([x, z]) => [x, z + 6]), BANK);
  let walked = 0;
  const length = route.slice(1).reduce((sum, [x, z], i) => sum + Math.hypot(x - route[i]![0], z - route[i]![1]), 0);
  route.slice(1).forEach(([x1, z1], i) => {
    const [x0, z0] = route[i]!;
    const len = Math.hypot(x1 - x0, z1 - z0);
    const yaw = -Math.atan2(z1 - z0, x1 - x0);
    const mid: [number, number] = [(x0 + x1) / 2, (z0 + z1) / 2];
    const onBridge = x0 === -9;
    const order = walked / length;
    walked += len;
    const along = { rot: [0, yaw, 0] as Vec3, grow: "x" as const };
    // 1 · Formation (on the banks), 3 · paving along the whole route, 4 · centre-line dashes.
    if (!onBridge) b.box([len, 0.3, 9], [mid[0], BANK + 0.15, mid[1]], "earth", 1, { ...along, order: order * 0.85, dur: 0.15 });
    b.box([len, 0.1, 7], [mid[0], SURFACE - 0.05, mid[1]], "asphalt", 3, { ...along, order: 0.25 + order * 0.6, dur: 0.15 });
    for (let d = 2; d < len - 1; d += 4) {
      const t = d / len;
      b.box([2, 0.02, 0.16], [x0 + (x1 - x0) * t, SURFACE + 0.01, z0 + (z1 - z0) * t], "paint", 4, {
        rot: [0, yaw, 0],
        order: ((walked - len + d) / length) * 0.5,
        from: [0, 0.6, 0],
        shadow: false,
        ghost: false,
      });
    }
  });
  // Round joints where segments meet, so the road has no gaps at its bends.
  route.slice(1, -1).forEach(([x, z], i) => {
    if (Math.abs(x) !== 9) b.cyl([4.5, 0.3, 4.5], [x, BANK + 0.15, z], "earth", 1, { order: ((i + 1) / route.length) * 0.85, dur: 0.15, grow: "y" });
    b.cyl([3.5, 0.1, 3.5], [x, SURFACE - 0.05, z], "asphalt", 3, { order: 0.25 + ((i + 1) / route.length) * 0.6, dur: 0.15, grow: "y", ghost: false });
  });

  // 2 · Bridge piers in the river, 3 · the deck, 4 · its parapets.
  for (const x of [-3, 3]) {
    for (const z of [-2.4, 2.4]) b.cyl([0.6, 2.4, 0.6], [x, 1.2, z], "concrete", 2, { order: x < 0 ? 0.1 : 0.4, grow: "y" });
    b.box([1.6, 0.5, 8.4], [x, 2.65, 0], "concrete", 2, { order: x < 0 ? 0.3 : 0.6, from: [0, 4, 0] });
  }
  for (const x of [-6, 0, 6]) b.box([6, 0.4, 9], [x, BANK + 0.1, 0], "concrete", 3, { order: 0.05 + (x + 6) / 40, from: [0, 5, 0] });
  for (const s of [-1, 1]) b.box([18.4, 0.8, 0.3], [0, SURFACE + 0.4, s * 4.35], "concrete", 4, { order: 0.2, dur: 0.4, grow: "x" });

  // 5 · Buildings rise beside the road while it is finished; the crane leaves in the last stage.
  const houseStages = [0, 2, 3, 4, 4, 5, 5];
  const towerStages = [0, 2, 3, 3, 4, 5, 6];
  buildHouse(b.at([-52, BANK + 0.08, 36], (s) => houseStages[s]!), { grounds: false, survey: false });
  buildHouse(b.at([-28, BANK + 0.08, 24], (s) => houseStages[s]!), { grounds: false, survey: false });
  buildTower(b.at([44, BANK + 0.08, 10], (s) => towerStages[s]!), 8, { survey: false });

  // 4 · Street lamps beside the road, 5 · trees, 6 · traffic over the bridge.
  const pointAt = (distance: number) => {
    let rest = distance;
    for (let i = 1; i < route.length; i++) {
      const [x0, z0] = route[i - 1]!;
      const [x1, z1] = route[i]!;
      const len = Math.hypot(x1 - x0, z1 - z0);
      if (rest <= len) return { x: x0 + ((x1 - x0) * rest) / len, z: z0 + ((z1 - z0) * rest) / len, nx: -(z1 - z0) / len, nz: (x1 - x0) / len };
      rest -= len;
    }
    return { x: route[route.length - 1]![0], z: route[route.length - 1]![1], nx: 0, nz: 1 };
  };
  [10, 35, 55, 95, 118, 138].forEach((d) => {
    const p = pointAt(d);
    const order = 0.45 + (d / length) * 0.45;
    b.cyl([0.09, 5, 0.12], [p.x + p.nx * 5.2, BANK + 2.6, p.z + p.nz * 5.2], "steel", 4, { order, grow: "y" });
    b.box([0.6, 0.14, 0.34], [p.x + p.nx * 4.6, BANK + 5.1, p.z + p.nz * 4.6], "lamp", 4, { order: order + 0.05, from: [0, 1.5, 0], shadow: false, ghost: false, rot: [0, -Math.atan2(p.nz, p.nx), 0] });
  });
  [[-62, 6], [-46, -4], [-16, 22], [-60, 44], [18, 16], [24, 26], [64, 2], [30, -34]].forEach(([x, z], i) => tree(b, x!, BANK + 0.08, z!, 5, 0.2 + i * 0.08, 1.15));
  vehicle(b, -3, SURFACE, -1.8, 1, false, 6, 0.1, 14);
  vehicle(b, 4, SURFACE, 1.8, -1, true, 6, 0.3, 14);

  return {
    parts: b.parts,
    floor: 0,
    extent: 70,
    fog: [150, 330],
    lightsStage: 6,
    camera: [
      { at: 0, pos: [-30, 95, 120], look: [0, 3, 0] },
      { at: 0.25, pos: [-80, 32, 74], look: [-36, 4, 14] },
      { at: 0.5, pos: [-16, 17, 44], look: [0, 3.5, 0] },
      { at: 0.75, pos: [92, 46, 84], look: [34, 8, -2] },
      { at: 1, pos: [-12, 72, 120], look: [2, 4, 0] },
    ],
  };
}
