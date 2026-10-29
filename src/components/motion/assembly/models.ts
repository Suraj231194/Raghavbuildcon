import { builder, pegs, vehicle, HALF_PI, type AssemblyModel, type Builder, type Extra, type Vec3 } from "./kit";

/*
 * The vertical models, built from simple solids (see kit.ts). Each takes an optional builder, so
 * it can also be placed into a larger world (models-world.ts). Each part has a finished position and a
 * build stage; the scene moves it in from `from` (or grows it out of its base) while its stage is
 * scrolled through, so the structure assembles itself in the order it would be built on site.
 */

export function bridge(b: Builder = builder()): AssemblyModel {
  const piers = [-15, 0, 15];
  const spans = [-22.5, -7.5, 7.5, 22.5];
  const ROAD = 10; // road surface

  // The gorge and the river.
  for (const s of [-1, 1]) b.box([22, 11.3, 36], [s * 42, 4.25, 0], "earthDark", -1, { ghost: false });
  b.box([62, 0.7, 36], [0, -1.05, 0], "water", -1, { ghost: false, shadow: false });

  pegs(b, [[-36, -5], [-36, 5], [36, -5], [36, 5]], 9.9);

  // 1 · Foundations: four piles under each pier, then the pile cap.
  piers.forEach((x, i) => {
    let k = 0;
    for (const dx of [-1.4, 1.4])
      for (const dz of [-2.6, 2.6]) b.cyl([0.45, 5, 0.45], [x + dx, -2.1, dz], "concreteDark", 1, { order: (i * 4 + k++) / 16, from: [0, 16, 0] });
    b.box([4.4, 1, 7.6], [x, 0.9, 0], "concreteDark", 1, { order: (i * 4 + 3.4) / 16 + 0.1, from: [0, 7, 0] });
  });

  // 2 · Piers and abutments.
  piers.forEach((x, i) => {
    for (const dz of [-2.5, 2.5]) b.cyl([0.8, 5.8, 0.8], [x, 4.3, dz], "concrete", 2, { order: 0.1 + i * 0.26, grow: "y" });
    b.box([2.6, 1, 9.8], [x, 7.7, 0], "concrete", 2, { order: 0.24 + i * 0.26, from: [0, 6, 0] });
  });
  for (const s of [-1, 1]) {
    b.box([1.6, 9.6, 11], [s * 30.2, 3.4, 0], "concrete", 2, { order: s < 0 ? 0 : 0.7, grow: "y" });
    b.box([1, 1.7, 11], [s * 30.5, 9.05, 0], "concrete", 2, { order: s < 0 ? 0.2 : 0.95, grow: "y" });
  }

  // 3 · Girders, lifted in span by span.
  spans.forEach((x, i) =>
    [-3.3, -1.1, 1.1, 3.3].forEach((z, j) =>
      b.box([14.6, 1.2, 0.55], [x, 8.8, z], "steel", 3, { order: (i * 4 + j) / 16, from: [0, 10, 0], turn: [0, 0.45, 0] }),
    ),
  );

  // 4 · Deck slab panels.
  spans.forEach((x, i) =>
    [-3.75, 3.75].forEach((dx, j) => b.box([7.5, 0.5, 10.6], [x + dx, 9.65, 0], "concrete", 4, { order: (i * 2 + j) / 8, from: [0, 7, 0] })),
  );

  // 5 · Wearing coat, barriers, markings and lighting.
  b.box([61, 0.1, 8.8], [0, ROAD - 0.05, 0], "asphalt", 5, { order: 0, dur: 0.4, grow: "x" });
  b.box([22, 0.1, 8.8], [-42, ROAD - 0.05, 0], "asphalt", 5, { order: 0.05, dur: 0.3, grow: "x" });
  b.box([22, 0.1, 8.8], [42, ROAD - 0.05, 0], "asphalt", 5, { order: 0.3, dur: 0.3, grow: "x" });
  spans.forEach((x, i) => {
    for (const s of [-1, 1]) b.box([15, 0.9, 0.4], [x, ROAD + 0.35, s * 5.1], "concrete", 5, { order: 0.25 + i * 0.07, from: [0, 0, s * 5] });
  });
  for (let x = -49.3; x <= 49.3; x += 3.4)
    b.box([1.7, 0.03, 0.16], [x, ROAD + 0.015, 0], "paint", 5, { order: 0.45 + ((x + 50) / 100) * 0.3, from: [0, 0.8, 0], shadow: false, ghost: false });
  for (const s of [-1, 1]) b.box([104, 0.03, 0.14], [0, ROAD + 0.015, s * 4.05], "paint", 5, { order: 0.5, dur: 0.4, grow: "x", shadow: false, ghost: false });
  spans.forEach((x, i) => {
    for (const s of [-1, 1]) {
      const order = 0.72 + i * 0.05;
      b.cyl([0.09, 5, 0.12], [x, ROAD + 0.8 + 2.5, s * 5.1], "steel", 5, { order, grow: "y" });
      b.box([0.12, 0.12, 1.3], [x, ROAD + 5.75, s * 4.5], "steel", 5, { order: order + 0.05, from: [0, 1.5, 0], ghost: false });
      b.box([0.6, 0.14, 0.34], [x, ROAD + 5.7, s * 3.95], "lamp", 5, { order: order + 0.07, from: [0, 1.5, 0], shadow: false, ghost: false });
    }
  });

  // 6 · Open to traffic.
  vehicle(b, -9, ROAD, -2, 1, false, 6, 0);
  vehicle(b, 12, ROAD, 2, -1, true, 6, 0.12);
  vehicle(b, 20, ROAD, -2, 1, false, 6, 0.25);

  return {
    parts: b.parts,
    floor: -1.4,
    extent: 54,
    lightsStage: 6,
    camera: [
      { at: 0, pos: [-54, 42, 72], look: [0, 2, 0] },
      { at: 0.2, pos: [-32, 17, 42], look: [-6, 1.5, 0] },
      { at: 0.38, pos: [-12, 18, 58], look: [2, 4.5, 0] },
      { at: 0.56, pos: [34, 23, 48], look: [4, 7, 0] },
      { at: 0.74, pos: [24, 32, 54], look: [0, 9, 0] },
      { at: 0.88, pos: [-52, 18, 22], look: [0, 10, 0] },
      { at: 1, pos: [-32, 36, 72], look: [6, 6, 0] },
    ],
  };
}

export function road(b: Builder = builder()): AssemblyModel {
  const L = 30;
  const TOP = 3.85; // finished road surface

  b.box([40, 0.8, 30], [0, 0.4, 0], "earthDark", -1, { ghost: false });
  pegs(b, [-14, -4.7, 4.7, 14].flatMap((x) => [[x, -7.4], [x, 7.4]] as [number, number][]), 0.8);

  // 1 · Embankment, compacted in three layers.
  for (let k = 0; k < 3; k++) b.box([L, 0.55, 16 - k * 0.6], [0, 1.075 + k * 0.55, 0], "earth", 1, { order: k / 3, from: [0, 7, 0] });
  // 2 · Granular sub-base, spread in three lengths.
  for (let k = 0; k < 3; k++) b.box([10, 0.5, 13.6], [-10 + k * 10, 2.7, 0], "gravel", 2, { order: k / 3, from: [0, 6, 0] });
  // 3 · Wet mix macadam base, laid along the road.
  b.box([L, 0.45, 12.4], [0, 3.175, 0], "gravelDark", 3, { grow: "x" });
  // 4 · Bituminous macadam, then the wearing course.
  b.box([L, 0.3, 11.2], [0, 3.55, 0], "asphaltLight", 4, { order: 0, dur: 0.5, grow: "x" });
  b.box([L, 0.15, 11.2], [0, 3.775, 0], "asphalt", 4, { order: 1, dur: 0.5, grow: "x" });
  // 5 · Shoulders and side drains.
  for (const s of [-1, 1]) b.box([L - 0.1, 1.4, 1.2], [0, 3.15, s * 6.8], "sand", 5, { order: s < 0 ? 0 : 0.15, from: [0, 5, 0] });
  for (const s of [-1, 1]) {
    const order = s < 0 ? 0.4 : 0.6;
    b.box([L, 0.2, 1.6], [0, 0.9, s * 9.4], "concreteDark", 5, { order, from: [0, 4, 0] });
    for (const z of [8.7, 10.1]) b.box([L, 0.9, 0.2], [0, 1.25, s * z], "concrete", 5, { order: order + 0.1, from: [0, 4, 0] });
  }
  // 6 · Markings, crash barrier and signage.
  for (let k = 0; k < 9; k++) b.box([1.8, 0.02, 0.15], [-13.5 + k * 3.375, TOP + 0.01, 0], "paint", 6, { order: (k / 9) * 0.4, from: [0, 0.8, 0], shadow: false, ghost: false });
  for (const s of [-1, 1]) b.box([L, 0.02, 0.12], [0, TOP + 0.01, s * 5.35], "paint", 6, { order: 0.1, dur: 0.4, grow: "x", shadow: false, ghost: false });
  for (let k = 0; k < 9; k++) b.box([0.16, 0.9, 0.16], [-14 + k * 3.5, TOP + 0.45, 7], "steel", 6, { order: 0.3 + k * 0.03, grow: "y" });
  b.box([L - 0.4, 0.32, 0.1], [0, TOP + 0.65, 6.88], "steel", 6, { order: 0.6, dur: 0.3, grow: "x" });
  b.cyl([0.07, 3.2, 0.07], [-11, TOP + 1.6, -7], "steel", 6, { order: 0.7, grow: "y" });
  b.box([2.4, 1.1, 0.08], [-11, TOP + 3.45, -7], "gold", 6, { order: 0.8, from: [0, 1.5, 0] });

  return {
    parts: b.parts,
    floor: 0,
    extent: 24,
    camera: [
      { at: 0, pos: [46, 36, 48], look: [0, 1, 0] },
      { at: 0.3, pos: [40, 22, 38], look: [2, 2, 0] },
      { at: 0.6, pos: [40, 14, 27], look: [8, 3, 0] },
      { at: 0.82, pos: [20, 14, 35], look: [4, 3.5, 0] },
      { at: 1, pos: [40, 21, 37], look: [0, 3, 0] },
    ],
  };
}

export function building(b: Builder = builder()): AssemblyModel {
  const FLOORS = 5;
  const H = 3.6; // floor to floor
  const BASE = 0.4; // top of the raft

  pegs(b, [[-11, -8], [11, -8], [-11, 8], [11, 8]], 0);

  // 1 · Raft foundation and the tower crane. The crane leaves at handover.
  b.box([22, 1, 16], [0, -0.1, 0], "concreteDark", 1, { order: 0, grow: "y" });
  const cx = 15;
  const cz = -10;
  const turn = 0.55;
  const along = (d: number, y: number): Vec3 => [cx + d * Math.cos(turn), y, cz - d * Math.sin(turn)];
  const crane: Extra = { exit: { stage: 6, to: [0, -32, 0] } };
  b.box([3, 0.8, 3], [cx, 0.4, cz], "concreteDark", 1, { ...crane, order: 0.35, from: [0, 4, 0], exit: { stage: 6, to: [0, -32, 0], order: 0.6 } });
  b.box([0.9, 26, 0.9], [cx, 13.8, cz], "gold", 1, { ...crane, order: 0.5, grow: "y", exit: { stage: 6, to: [0, -32, 0], order: 0.3 } });
  b.box([30, 0.7, 0.7], along(-5, 27.15), "gold", 1, { ...crane, rot: [0, turn, 0], order: 0.8, from: [0, 6, 0] });
  b.box([2.4, 1.4, 1.4], along(8, 26.5), "concreteDark", 1, { ...crane, rot: [0, turn, 0], order: 0.85, from: [0, 6, 0] });
  b.box([1.4, 1.4, 1.4], [cx + 0.9, 26.1, cz + 0.9], "white", 1, { ...crane, order: 0.85, from: [0, 6, 0] });
  b.cyl([0.04, 6, 0.04], along(-14, 24.15), "steel", 1, { ...crane, order: 0.9, from: [0, 6, 0], shadow: false });
  b.box([0.5, 0.6, 0.5], along(-14, 20.9), "gold", 1, { ...crane, order: 0.9, from: [0, 6, 0] });

  // 2 · Columns and slabs, floor by floor.
  const xs = [-9, -3, 3, 9];
  const zs = [-6, 0, 6];
  for (let f = 0; f < FLOORS; f++) {
    const base = BASE + f * H;
    let k = 0;
    for (const x of xs)
      for (const z of zs) b.box([0.6, H - 0.3, 0.6], [x, base + (H - 0.3) / 2, z], "concrete", 2, { order: (f + (0.25 * k++) / 11) / FLOORS, dur: 0.1, grow: "y" });
    b.box([20.6, 0.3, 14.6], [0, base + H - 0.15, 0], "concrete", 2, { order: (f + 0.38) / FLOORS, dur: 0.1, from: [0, 6, 0] });
  }

  // 3 · Glazing.
  for (let f = 0; f < FLOORS; f++) {
    const y = BASE + f * H + (H - 0.3) / 2;
    const order = f / FLOORS;
    b.box([19.6, 3.2, 0.12], [0, y, 6.9], "glass", 3, { order, from: [0, 0, 8] });
    b.box([19.6, 3.2, 0.12], [0, y, -6.9], "glass", 3, { order: order + 0.03, from: [0, 0, -8] });
    b.box([0.12, 3.2, 13.6], [9.9, y, 0], "glass", 3, { order: order + 0.06, from: [8, 0, 0] });
    b.box([0.12, 3.2, 13.6], [-9.9, y, 0], "glass", 3, { order: order + 0.09, from: [-8, 0, 0] });
  }

  // 4 · Parapet and roof plant.
  const roof = BASE + FLOORS * H;
  for (const s of [-1, 1]) {
    b.box([20.6, 1, 0.25], [0, roof + 0.5, s * 7.175], "concrete", 4, { order: s < 0 ? 0 : 0.1, from: [0, 3, 0] });
    b.box([0.25, 1, 14.1], [s * 10.175, roof + 0.5, 0], "concrete", 4, { order: s < 0 ? 0.05 : 0.15, from: [0, 3, 0] });
  }
  b.box([3.6, 2.4, 3.6], [3, roof + 1.2, -3], "concreteDark", 4, { order: 0.35, from: [0, 5, 0] });
  b.box([3.2, 1.6, 2.4], [-5, roof + 0.8, 1.5], "steel", 4, { order: 0.5, from: [0, 5, 0] });
  b.box([2.4, 1.4, 2], [-1, roof + 0.7, 3], "steel", 4, { order: 0.6, from: [0, 5, 0] });
  b.cyl([1.2, 2.2, 1.2], [6, roof + 1.1, 3], "white", 4, { order: 0.75, from: [0, 5, 0] });

  // 5 · Paving, landscaping and the entrance canopy.
  b.box([34, 0.12, 28], [0, 0.06, 0], "paving", 5, { order: 0, dur: 0.35, grow: "x", ghost: false });
  for (const [x, z] of [[-14, 10], [-8, 11.5], [8, 11.5], [14, 10], [-15, -4], [16, 3]] as const) {
    const order = 0.3 + ((x + 16) / 32) * 0.4;
    b.cyl([0.15, 1.6, 0.18], [x, 0.12 + 0.8, z], "earthDark", 5, { order, grow: "y" });
    b.cyl([0, 3, 1.3], [x, 0.12 + 1.6 + 1.5, z], "leaf", 5, { order: order + 0.05, from: [0, 2, 0] });
  }
  b.box([7, 0.3, 3], [0, 3.85, 8.8], "concrete", 5, { order: 0.75, from: [0, 4, 0] });
  for (const s of [-1, 1]) b.cyl([0.12, 3.6, 0.12], [s * 3.2, 0.12 + 1.8, 10], "steel", 5, { order: 0.7, grow: "y" });

  return {
    parts: b.parts,
    floor: 0,
    extent: 30,
    lightsStage: 6,
    camera: [
      { at: 0, pos: [48, 42, 54], look: [0, 5, 0] },
      { at: 0.22, pos: [36, 20, 40], look: [0, 4, 0] },
      { at: 0.45, pos: [36, 30, 54], look: [0, 10, 0] },
      { at: 0.62, pos: [-28, 24, 46], look: [0, 10, 0] },
      { at: 0.8, pos: [-40, 34, 38], look: [0, 12, 0] },
      { at: 1, pos: [44, 26, 58], look: [0, 9, 0] },
    ],
  };
}

export function pipeline(b: Builder = builder()): AssemblyModel {

  // The ground either side of the trench, cut away in front so the trench can be seen.
  b.box([36, 4, 12], [0, 2, -8], "earth", -1, { ghost: false });
  b.box([18, 4, 12], [-9, 2, 8], "earth", -1, { ghost: false });

  // 0 · Survey: route line and pegs.
  b.box([36, 0.02, 0.14], [0, 4.01, 0], "gold", 0, { order: 0, dur: 0.6, grow: "x", ghost: false, shadow: false, exit: { stage: 1, to: [0, 10, -12], order: 0 } });
  pegs(b, [-15, -5, 5, 15].map((x) => [x, -2.6] as [number, number]), 4);

  // 1 · Excavation: the soil in the trench is lifted out.
  for (let k = 0; k < 4; k++)
    b.box([9, 4, 4], [-13.5 + k * 9, 2, 0], "earth", -1, { ghost: false, exit: { stage: 1, to: [0, 10, -14], order: 0.1 + k * 0.22 } });

  // 2 · Sand bedding.
  for (const s of [-1, 1]) b.box([18, 0.5, 3.8], [s * 9, 0.25, 0], "sand", 2, { order: s < 0 ? 0 : 0.5, from: [0, 6, 0] });

  // 3 · Pipe lengths, lowered in and pushed home one into the next.
  for (let k = 0; k < 5; k++)
    b.cyl([0.9, 6.4, 0.9], [-12.8 + k * 6.4, 1.4, 0], "pipe", 3, { rot: [0, 0, HALF_PI], order: k / 5, from: [3, 7, 0], turn: [0, 0.6, 0] });

  // 4 · Joint collars and test caps.
  for (let k = 0; k < 4; k++)
    b.cyl([1.06, 0.6, 1.06], [-9.6 + k * 6.4, 1.4, 0], "gold", 4, { rot: [0, 0, HALF_PI], order: k * 0.18, from: [0, 2.5, 0] });
  for (const s of [-1, 1]) b.cyl([0.95, 0.2, 0.95], [s * 16.1, 1.4, 0], "steel", 4, { rot: [0, 0, HALF_PI], order: 0.8, from: [s * 2.5, 0, 0] });

  // 5 · Backfill over the back half; the front half stays open as a section.
  b.box([18, 1.3, 4], [-9, 1.15, 0], "sand", 5, { order: 0, from: [0, 6, 0] });
  b.box([18, 1.3, 4], [-9, 2.45, 0], "sand", 5, { order: 0.35, from: [0, 6, 0] });
  b.box([18, 0.9, 4], [-9, 3.55, 0], "earthDark", 5, { order: 0.7, from: [0, 6, 0] });

  // 6 · Surface reinstated, marker posts.
  b.box([18, 0.14, 4], [-9, 4.07, 0], "leaf", 6, { order: 0, dur: 0.5, grow: "x" });
  b.cyl([0.7, 0.08, 0.7], [-9, 4.18, 0], "steel", 6, { order: 0.4, from: [0, 1.5, 0] });
  for (const x of [-15, -9, -3]) b.cyl([0.1, 1.4, 0.1], [x, 4.7, 2.6], "gold", 6, { order: 0.5 + ((x + 15) / 12) * 0.3, grow: "y" });

  return {
    parts: b.parts,
    floor: 0,
    extent: 22,
    camera: [
      { at: 0, pos: [36, 32, 40], look: [0, 2, 0] },
      { at: 0.28, pos: [32, 18, 30], look: [0, 1.5, 0] },
      { at: 0.55, pos: [30, 13, 26], look: [4, 1.5, 0] },
      { at: 0.8, pos: [14, 13, 26], look: [-2, 2, 0] },
      { at: 1, pos: [31, 19, 31], look: [-1, 2, 0] },
    ],
  };
}
