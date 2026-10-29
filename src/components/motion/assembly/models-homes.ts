import { builder, orbit, pegs, tree, vehicle, type AssemblyModel, type Builder, type Vec3 } from "./kit";

/*
 * Homes, buildings and other structures. Each `build…` function draws one structure around its
 * own origin in seven stages (0–6), so it can be shown on its own or placed into the hero's
 * township with its stages renumbered.
 */

/** A two-storey house with a gable roof, 10 × 8 m. */
export function buildHouse(b: Builder, { grounds = true, survey = true }: { grounds?: boolean; survey?: boolean } = {}) {
  if (survey) pegs(b, [[-5.6, -4.6], [5.6, -4.6], [-5.6, 4.6], [5.6, 4.6]], 0);

  // 1 · Plinth.
  b.box([11, 0.6, 9], [0, 0.3, 0], "concreteDark", 1, { grow: "y", dur: 0.6 });

  // 2 · Walls course by course, the first-floor slab, then the upper walls.
  const courses: [number, number][] = [[0.6, 1], [1.6, 1], [2.6, 1], [3.85, 0.95], [4.8, 0.95], [5.75, 0.95]];
  courses.forEach(([y0, h], k) => {
    const order = (k < 3 ? k : k + 1) / 7.2;
    const y = y0 + h / 2;
    const extra = { order, dur: 0.12, grow: "y" as const };
    b.box([10, h, 0.25], [0, y, 3.875], "plaster", 2, extra);
    b.box([10, h, 0.25], [0, y, -3.875], "plaster", 2, extra);
    b.box([0.25, h, 7.5], [4.875, y, 0], "plaster", 2, extra);
    b.box([0.25, h, 7.5], [-4.875, y, 0], "plaster", 2, extra);
  });
  b.box([10.6, 0.25, 8.6], [0, 3.725, 0], "concrete", 2, { order: 3 / 7.2, dur: 0.12, from: [0, 5, 0] });

  // 3 · Roof structure: the gable, rafters and ridge.
  const pitch = Math.atan2(2.55, 4.6);
  b.gable([10, 2.4, 8], [0, 7.9, 0], "plaster", 3, { order: 0, dur: 0.35, grow: "y" });
  [-4.6, -1.55, 1.55, 4.6].forEach((x, i) => {
    for (const s of [-1, 1]) b.box([0.14, 0.14, 5.3], [x, 7.72, s * 2.3], "gold", 3, { rot: [s * pitch, 0, 0], order: 0.3 + i * 0.12, from: [0, 4, 0] });
  });
  b.box([10.9, 0.2, 0.2], [0, 9.1, 0], "gold", 3, { order: 0.85, from: [0, 3, 0] });

  // 4 · Roofing, one slope then the other.
  for (const s of [-1, 1]) b.box([11.2, 0.18, 5.4], [0, 7.9, s * 2.3], "tile", 4, { rot: [s * pitch, 0, 0], order: s < 0 ? 0 : 0.5, dur: 0.45, from: [0, 5, s * 2] });

  // 5 · Doors, windows, sunshades and the balcony.
  const pane = (w: number, h: number, at: Vec3, order: number, finish: "glass" | "wood" = "glass") => {
    const front = Math.abs(at[2]) > Math.abs(at[0]);
    b.box(front ? [w, h, 0.12] : [0.12, h, w], at, finish, 5, { order, from: front ? [0, 0, Math.sign(at[2]) * 3] : [Math.sign(at[0]) * 3, 0, 0] });
  };
  pane(1.7, 1.4, [-2.9, 2.2, 4.03], 0);
  pane(1.3, 2.4, [0, 1.8, 4.03], 0.04, "wood");
  pane(1.7, 1.4, [2.9, 2.2, 4.03], 0.08);
  pane(1.5, 1.3, [-2.9, 5.3, 4.03], 0.16);
  pane(1.4, 2.2, [0, 4.95, 4.03], 0.2);
  pane(1.5, 1.3, [2.9, 5.3, 4.03], 0.24);
  for (const [x, y, order] of [[-2.5, 2.2, 0.3], [2.5, 2.2, 0.32], [-2.5, 5.3, 0.34], [2.5, 5.3, 0.36]] as const) pane(1.6, 1.3, [x, y, -4.03], order);
  for (const s of [-1, 1]) {
    pane(1.6, 1.3, [s * 5.03, 2.2, 0], 0.4 + (s > 0 ? 0.04 : 0));
    pane(1.6, 1.3, [s * 5.03, 5.3, 0], 0.46 + (s > 0 ? 0.04 : 0));
  }
  [[-2.9, 3.05], [2.9, 3.05], [-2.9, 6.1], [2.9, 6.1]].forEach(([x, y], i) =>
    b.box([2.1, 0.1, 0.6], [x!, y!, 4.3], "concrete", 5, { order: 0.55 + i * 0.04, from: [0, 1.5, 0] }),
  );
  b.box([3.4, 0.15, 1.4], [0, 3.78, 4.7], "concrete", 5, { order: 0.72, from: [0, 0, 3] });
  b.box([3.4, 0.9, 0.06], [0, 4.3, 5.37], "steel", 5, { order: 0.82, from: [0, 2, 0] });

  // 6 · Grounds: lawn, path, compound wall, gate and trees.
  if (grounds) {
    b.box([22, 0.08, 19.5], [0, 0.04, 0.75], "leaf", 6, { order: 0, dur: 0.35, grow: "x", ghost: false, shadow: false });
    b.box([1.6, 0.06, 6.2], [0, 0.11, 7.3], "paving", 6, { order: 0.15, dur: 0.3, grow: "z", ghost: false });
    for (const s of [-1, 1]) {
      b.box([9.2, 1, 0.2], [s * 6.4, 0.5, 10.5], "plaster", 6, { order: 0.3, grow: "y" });
      b.box([0.2, 1, 19.5], [s * 11, 0.5, 0.75], "plaster", 6, { order: 0.35, grow: "y" });
    }
    b.box([22.2, 1, 0.2], [0, 0.5, -9], "plaster", 6, { order: 0.4, grow: "y" });
    b.box([3.6, 1.3, 0.06], [0, 0.65, 10.5], "gold", 6, { order: 0.55, from: [0, 0, 2] });
    tree(b, -8, 0, 6.5, 6, 0.6);
    tree(b, 8, 0, 6.5, 6, 0.65);
    tree(b, -8, 0, -6.5, 6, 0.7);
    tree(b, 8.5, 0, -5.5, 6, 0.75);
  }
}

/** A glass-and-concrete tower with a central core and a tower crane. */
export function buildTower(b: Builder, floors = 12, { survey = true }: { survey?: boolean } = {}) {
  const H = 3.4;
  const BASE = 0.6;
  const top = BASE + floors * H;
  if (survey) pegs(b, [[-8.5, -8.5], [8.5, -8.5], [-8.5, 8.5], [8.5, 8.5]], 0);

  // 1 · Raft foundation and the tower crane, which leaves at handover.
  b.box([17, 1.2, 17], [0, 0, 0], "concreteDark", 1, { order: 0, dur: 0.5, grow: "y" });
  const cx = 13;
  const cz = -13;
  const turn = Math.PI / 4;
  const along = (d: number, y: number): Vec3 => [cx + d * Math.cos(turn), y, cz - d * Math.sin(turn)];
  const mast = top + 7;
  const leave = (order: number) => ({ exit: { stage: 6, to: [0, -(mast + 10), 0] as Vec3, order } });
  b.box([3.2, 0.8, 3.2], [cx, 0.4, cz], "concreteDark", 1, { ...leave(0.7), order: 0.3, from: [0, 4, 0] });
  b.box([1, mast, 1], [cx, 0.8 + mast / 2, cz], "gold", 1, { ...leave(0.4), order: 0.45, grow: "y" });
  b.box([34, 0.7, 0.7], along(-6, mast + 1.15), "gold", 1, { ...leave(0), rot: [0, turn, 0], order: 0.8, from: [0, 8, 0] });
  b.box([2.6, 1.5, 1.5], along(9, mast + 0.5), "concreteDark", 1, { ...leave(0), rot: [0, turn, 0], order: 0.85, from: [0, 8, 0] });
  b.box([1.5, 1.5, 1.5], [cx + 1, mast + 0.05, cz + 1], "white", 1, { ...leave(0), order: 0.85, from: [0, 8, 0] });
  b.cyl([0.04, 8, 0.04], along(-18, mast - 3), "steel", 1, { ...leave(0), order: 0.9, from: [0, 8, 0], shadow: false });

  // 2 · The core climbs in four lifts.
  const coreH = top + 2.4 - BASE;
  for (let k = 0; k < 4; k++) b.box([5, coreH / 4, 5], [0, BASE + (coreH / 4) * (k + 0.5), 0], "concreteDark", 2, { order: k / 4, dur: 0.25, grow: "y" });

  // 3 · Columns and slabs, floor by floor.
  const corners: [number, number][] = [[-6.4, -6.4], [6.4, -6.4], [-6.4, 6.4], [6.4, 6.4]];
  for (let f = 0; f < floors; f++) {
    const base = BASE + f * H;
    for (const [x, z] of corners) b.box([0.8, H - 0.3, 0.8], [x, base + (H - 0.3) / 2, z], "concrete", 3, { order: f / floors, dur: 0.5 / floors, grow: "y" });
    b.box([14.4, 0.3, 14.4], [0, base + H - 0.15, 0], "concrete", 3, { order: (f + 0.45) / floors, dur: 0.5 / floors, from: [0, 6, 0] });
  }

  // 4 · Curtain wall floor by floor, then full-height fins.
  for (let f = 0; f < floors; f++) {
    const y = BASE + f * H + (H - 0.3) / 2;
    const order = (f / floors) * 0.72;
    const extra = { order, dur: 0.12 };
    b.box([13.4, H - 0.45, 0.12], [0, y, 6.95], "glass", 4, { ...extra, from: [0, 0, 6] });
    b.box([13.4, H - 0.45, 0.12], [0, y, -6.95], "glass", 4, { ...extra, from: [0, 0, -6] });
    b.box([0.12, H - 0.45, 13.4], [6.95, y, 0], "glass", 4, { ...extra, from: [6, 0, 0] });
    b.box([0.12, H - 0.45, 13.4], [-6.95, y, 0], "glass", 4, { ...extra, from: [-6, 0, 0] });
  }
  const finH = top - BASE;
  [-3.4, 3.4].forEach((d, i) => {
    const order = 0.78 + i * 0.08;
    const extra = { order, dur: 0.14, grow: "y" as const };
    b.box([0.2, finH, 0.5], [d, BASE + finH / 2, 7.3], "gold", 4, extra);
    b.box([0.2, finH, 0.5], [d, BASE + finH / 2, -7.3], "gold", 4, extra);
    b.box([0.5, finH, 0.2], [7.3, BASE + finH / 2, d], "gold", 4, extra);
    b.box([0.5, finH, 0.2], [-7.3, BASE + finH / 2, d], "gold", 4, extra);
  });

  // 5 · Crown: parapet, glazed lantern and spire.
  for (const s of [-1, 1]) {
    b.box([14.4, 1.2, 0.3], [0, top + 0.6, s * 7.05], "concrete", 5, { order: 0, from: [0, 4, 0] });
    b.box([0.3, 1.2, 13.8], [s * 7.05, top + 0.6, 0], "concrete", 5, { order: 0.1, from: [0, 4, 0] });
  }
  b.box([7, 3.6, 7], [0, top + 1.8, 0], "glassDark", 5, { order: 0.35, from: [0, 6, 0] });
  b.cyl([0.06, 7, 0.22], [0, top + 3.6 + 3.5, 0], "gold", 5, { order: 0.6, grow: "y" });

  // 6 · Plaza and trees.
  b.box([30, 0.1, 30], [0, 0.05, 0], "paving", 6, { order: 0, dur: 0.35, grow: "x", ghost: false, shadow: false });
  [[-12, 12], [12, 12], [-12, -12]].forEach(([x, z], i) => tree(b, x!, 0.1, z!, 6, 0.4 + i * 0.12, 1.2));
  return top;
}

/** A precast box culvert carrying a stream under a road. */
function buildCulvert(b: Builder) {
  pegs(b, [[-3.6, -10], [3.6, -10], [-3.6, 10], [3.6, 10]], 0.6);
  // The banks either side of the stream.
  for (const s of [-1, 1]) b.box([17, 0.6, 32], [s * 11.5, 0.3, 0], "earthDark", -1, { ghost: false });

  // 1 · Levelling bed.
  b.box([5.2, 0.25, 19], [0, 0.125, 0], "concreteDark", 1, { grow: "z", dur: 0.7 });

  // 2 · Precast box sections, lowered in one after another.
  for (let k = 0; k < 6; k++) {
    const z = -7.5 + k * 3;
    const extra = { order: k / 6, dur: 0.25, from: [0, 9, 0] as Vec3 };
    b.box([3.7, 0.35, 2.95], [0, 0.425, z], "concrete", 2, extra);
    for (const s of [-1, 1]) b.box([0.35, 2.5, 2.95], [s * 1.675, 1.85, z], "concrete", 2, extra);
    b.box([3.7, 0.35, 2.95], [0, 3.275, z], "concrete", 2, extra);
  }

  // 3 · Headwalls, wing walls and aprons.
  const splay = 0.45;
  for (const e of [-1, 1]) {
    const first = e < 0 ? 0 : 0.5;
    b.box([4.4, 0.9, 0.35], [0, 3.9, e * 9.15], "concrete", 3, { order: first, from: [0, 4, 0] });
    for (const s of [-1, 1])
      b.box([0.35, 3.2, 4.2], [s * 2.76, 1.85, e * 10.89], "concrete", 3, { rot: [0, s * e * splay, 0], order: first + 0.1 + (s > 0 ? 0.1 : 0), grow: "y" });
    b.box([6.4, 0.3, 3.6], [0, 0.15, e * 11], "concreteDark", 3, { order: first + 0.3, grow: "y" });
  }

  // 4 · Embankment, in compacted lifts each side, then over the box.
  for (let lift = 0; lift < 2; lift++)
    for (const s of [-1, 1]) b.box([12, 2.175, 12], [s * 7.85, 2.175 * (lift + 0.5), 0], "earth", 4, { order: lift * 0.4 + (s > 0 ? 0.15 : 0), from: [0, 6, 0] });
  b.box([3.7, 0.9, 12], [0, 3.9, 0], "earth", 4, { order: 0.85, from: [0, 5, 0] });

  // 5 · Road over the top.
  const ROAD = 4.47;
  b.box([28, 0.12, 9], [0, ROAD - 0.06, 0], "asphalt", 5, { order: 0, dur: 0.5, grow: "x" });
  for (let x = -12; x <= 12; x += 3.2) b.box([1.6, 0.02, 0.14], [x, ROAD + 0.01, 0], "paint", 5, { order: 0.5 + ((x + 12) / 24) * 0.35, from: [0, 0.8, 0], shadow: false, ghost: false });
  for (const s of [-1, 1]) b.box([28, 0.02, 0.12], [0, ROAD + 0.01, s * 3.9], "paint", 5, { order: 0.55, dur: 0.4, grow: "x", shadow: false, ghost: false });

  // 6 · Railings, water through the barrel, traffic.
  for (let x = -6; x <= 6; x += 2)
    for (const s of [-1, 1]) b.box([0.14, 0.9, 0.14], [x, ROAD + 0.45, s * 4.4], "steel", 6, { order: ((x + 6) / 12) * 0.3, grow: "y" });
  for (const s of [-1, 1]) b.box([12.4, 0.12, 0.1], [0, ROAD + 0.8, s * 4.4], "gold", 6, { order: 0.35, dur: 0.3, grow: "x" });
  b.box([2.95, 0.22, 18.6], [0, 0.71, 0], "water", 6, { order: 0.3, dur: 0.4, grow: "z", ghost: false, shadow: false });
  for (const e of [-1, 1]) {
    b.box([3.6, 0.3, 3.5], [0, 0.15, e * 14.55], "sand", 3, { order: 0.9, grow: "y", ghost: false });
    b.box([2.95, 0.22, 7.1], [0, 0.41, e * 12.75], "water", 6, { order: 0.45, dur: 0.35, grow: "z", ghost: false, shadow: false });
  }
  vehicle(b, 3, ROAD, -2, 1, false, 6, 0.55, 18);
  vehicle(b, -5, ROAD, 2, -1, true, 6, 0.62, 16);
}

/** A steel portal-frame shed with a solar roof and rainwater storage. */
function buildWarehouse(b: Builder) {
  const EAVE = 7.6;
  const RIDGE = 9.6;
  const pitch = Math.atan2(RIDGE - EAVE, 9);
  // Centre line of a rafter at distance |z| from the ridge.
  const rafter = (z: number) => 8.85 + (4.5 - Math.abs(z)) * ((RIDGE - EAVE) / 9);
  const xs = [-15, -9, -3, 3, 9, 15];
  pegs(b, [[-16.5, -10.5], [16.5, -10.5], [-16.5, 10.5], [16.5, 10.5]], 0);

  // 1 · Column footings, then the floor slab.
  xs.forEach((x, i) => {
    for (const s of [-1, 1]) b.box([1.2, 0.8, 1.2], [x, 0.4, s * 9], "concreteDark", 1, { order: (i / 6) * 0.6 + (s > 0 ? 0.03 : 0), grow: "y" });
  });
  b.box([31, 0.3, 19], [0, 0.15, 0], "concrete", 1, { order: 0.7, dur: 0.3, grow: "x" });

  // 2 · Portal frames, bay by bay.
  xs.forEach((x, i) => {
    const order = (i / 6) * 0.9;
    for (const s of [-1, 1]) b.box([0.45, 6.8, 0.55], [x, 0.8 + 3.4, s * 9], "gold", 2, { order, dur: 0.14, grow: "y" });
    for (const s of [-1, 1]) b.box([0.4, 0.55, 9.25], [x, 8.85, s * 4.5], "gold", 2, { rot: [s * pitch, 0, 0], order: order + 0.06, dur: 0.14, from: [0, 6, 0] });
  });

  // 3 · Purlins and eave beams.
  [-7.5, -4.5, -1.5, 1.5, 4.5, 7.5].forEach((z, i) => b.box([30.6, 0.2, 0.2], [0, rafter(z) + 0.38, z], "steel", 3, { order: i / 7, dur: 0.25, grow: "x" }));
  for (const s of [-1, 1]) b.box([30.6, 0.3, 0.3], [0, EAVE, s * 9], "gold", 3, { order: 0.85, dur: 0.15, grow: "x" });

  // 4 · Wall cladding, gable ends, roof sheets and dock doors.
  for (const s of [-1, 1]) b.box([30.4, 7.3, 0.1], [0, 3.95, s * 9.35], "sheet", 4, { order: s < 0 ? 0 : 0.12, from: [0, 0, s * 6] });
  for (const s of [-1, 1]) {
    b.box([0.1, 7.3, 18.6], [s * 15.35, 3.95, 0], "sheet", 4, { order: 0.25, from: [s * 6, 0, 0] });
    b.gable([0.1, 2.3, 18.6], [s * 15.35, EAVE + 1.15, 0], "sheet", 4, { order: 0.35, from: [s * 6, 0, 0] });
  }
  for (const s of [-1, 1]) b.box([31, 0.1, 9.4], [0, rafter(4.6) + 0.53, s * 4.6], "sheet", 4, { rot: [s * pitch, 0, 0], order: s < 0 ? 0.5 : 0.62, from: [0, 5, 0] });
  [-9, -3, 3].forEach((x, i) => b.box([3.6, 4.6, 0.12], [x, 2.6, 9.42], "cabin", 4, { order: 0.8 + i * 0.04, from: [0, 0, 3] }));
  b.box([22, 0.15, 2.4], [-3, 5.6, 10.6], "steel", 4, { order: 0.92, from: [0, 2, 0] });

  // 5 · Rooftop solar, rainwater tanks.
  for (let row = 0; row < 3; row++)
    for (let i = 0; i < 8; i++) {
      const z = 1.6 + row * 2.5;
      b.box([3.1, 0.07, 2.1], [-12.25 + i * 3.5, rafter(z) + 0.65, z], "solar", 5, { rot: [pitch, 0, 0], order: (row * 8 + i) / 24 * 0.75, dur: 0.12, from: [0, 3, 0] });
    }
  for (const [z, order] of [[-4, 0.8], [0, 0.88]] as const) b.cyl([1.6, 3.6, 1.6], [19, 1.8, z], "white", 5, { order, grow: "y" });

  // 6 · Yard, trucks at the docks, trees.
  b.box([46, 0.1, 36], [0, 0.05, 2], "paving", 6, { order: 0, dur: 0.35, grow: "x", ghost: false, shadow: false });
  vehicle(b, -6, 0.1, 15.5, 1, true, 6, 0.4, 20);
  vehicle(b, 8, 0.1, 15.5, -1, true, 6, 0.5, 20);
  [-18, -10, -2, 6, 14].forEach((x, i) => tree(b, x, 0.1, -14, 6, 0.55 + i * 0.07, 1.1));
}

export function house(): AssemblyModel {
  const b = builder();
  buildHouse(b);
  const look: Vec3 = [0, 3.4, 0.5];
  return {
    parts: b.parts,
    floor: 0,
    extent: 14,
    fog: [42, 95],
    lightsStage: 6,
    camera: [
      { at: 0, pos: orbit(42, 36, 21, look), look },
      { at: 0.35, pos: orbit(26, 30, 12, look), look },
      { at: 0.7, pos: orbit(-8, 29, 10, look), look },
      { at: 1, pos: orbit(-28, 31, 12, look), look },
    ],
  };
}

export function tower(): AssemblyModel {
  const b = builder();
  buildTower(b);
  const look: Vec3 = [0, 21, 0];
  return {
    parts: b.parts,
    floor: 0,
    extent: 26,
    fog: [95, 220],
    lightsStage: 6,
    camera: [
      { at: 0, pos: orbit(38, 84, 20, look), look },
      { at: 0.35, pos: orbit(22, 78, 4, look), look },
      { at: 0.7, pos: orbit(-14, 78, 8, look), look },
      { at: 1, pos: orbit(-36, 80, 12, look), look },
    ],
  };
}

export function culvert(): AssemblyModel {
  const b = builder();
  buildCulvert(b);
  const look: Vec3 = [0, 2, 2];
  return {
    parts: b.parts,
    floor: 0,
    extent: 20,
    fog: [60, 140],
    camera: [
      { at: 0, pos: orbit(38, 44, 26, look), look },
      { at: 0.35, pos: orbit(26, 40, 15, look), look },
      { at: 0.7, pos: orbit(-10, 41, 17, look), look },
      { at: 1, pos: orbit(-30, 43, 19, look), look },
    ],
  };
}

export function warehouse(): AssemblyModel {
  const b = builder();
  buildWarehouse(b);
  const look: Vec3 = [0, 3.5, 1];
  return {
    parts: b.parts,
    floor: 0,
    extent: 26,
    fog: [62, 150],
    camera: [
      { at: 0, pos: orbit(40, 52, 28, look), look },
      { at: 0.35, pos: orbit(22, 46, 15, look), look },
      { at: 0.7, pos: orbit(-16, 47, 17, look), look },
      { at: 1, pos: orbit(-36, 50, 20, look), look },
    ],
  };
}

/**
 * The hero: a tower rising beside two houses on a new road, in six stages — survey, foundations,
 * structure, envelope, finishing, and the street coming to life.
 */
export function township(): AssemblyModel {
  const b = builder();
  const towerStages = [0, 1, 2, 2, 3, 4, 5];
  const houseStages = [0, 1, 2, 3, 3, 4, 4];
  buildTower(b.at([-6, 0, -12], (s) => towerStages[s]!), 10);
  buildHouse(b.at([15, 0, 3], (s) => houseStages[s]!), { grounds: false, survey: false });
  buildHouse(b.at([29, 0, 3], (s) => houseStages[s]!), { grounds: false, survey: false });

  // The street: paved in stage 4, lamps lit and traffic in stage 5.
  const ROAD = 0.1;
  b.box([110, 0.1, 7], [0, 0.05, 15], "asphalt", 4, { order: 0, dur: 0.45, grow: "x" });
  b.box([110, 0.12, 2.2], [0, 0.06, 19.6], "paving", 4, { order: 0.1, dur: 0.45, grow: "x", ghost: false });
  for (let x = -50; x <= 50; x += 4) b.box([2, 0.02, 0.16], [x, ROAD + 0.01, 15], "paint", 4, { order: 0.4 + ((x + 50) / 100) * 0.3, from: [0, 0.8, 0], shadow: false, ghost: false });
  for (let x = -36; x <= 44; x += 16) {
    const order = 0.55 + ((x + 36) / 80) * 0.35;
    b.cyl([0.09, 5, 0.12], [x, 2.6, 19.2], "steel", 4, { order, grow: "y" });
    b.box([0.6, 0.14, 0.34], [x, 5.1, 18.7], "lamp", 4, { order: order + 0.05, from: [0, 1.5, 0], shadow: false, ghost: false });
  }
  [[-24, 6], [-30, -4], [6, 9], [40, 8], [44, -6]].forEach(([x, z], i) => tree(b, x!, 0, z!, 4, 0.3 + i * 0.1, 1.2));
  vehicle(b, -14, ROAD, 13.4, 1, false, 5, 0.1);
  vehicle(b, 10, ROAD, 16.6, -1, true, 5, 0.2);
  vehicle(b, 26, ROAD, 13.4, 1, false, 5, 0.32);

  const look: Vec3 = [10, 11, -3];
  return {
    parts: b.parts,
    floor: 0,
    extent: 50,
    fog: [150, 340],
    lightsStage: 5,
    camera: [
      { at: 0, pos: [-90, 110, 150], look: [10, 4, -3] },
      { at: 0.3, pos: [-86, 66, 138], look },
      { at: 0.62, pos: [-78, 44, 124], look },
      { at: 0.82, pos: [-44, 56, 126], look: [10, 9, -2] },
      { at: 1, pos: [-6, 88, 116], look: [10, 4, 0] },
    ],
  };
}
