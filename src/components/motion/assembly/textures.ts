import { BufferAttribute, CanvasTexture, RepeatWrapping, SRGBColorSpace, type BufferGeometry } from "three";
import type { Finish, Part } from "./kit";

/*
 * Surface detail for the 3D models, painted once on small canvases: grain for concrete, earth
 * and asphalt; mullions for curtain walls; courses for roof tiles; ribs for metal sheeting; cells
 * for solar panels. The maps are near-white and multiply the finish colour. Geometry UVs are
 * scaled to metres, so a pattern keeps the same size on a small part and a long one.
 */

/** Metres covered by one repeat of a surface map. */
const TILE = 3;

type Pattern = "grain" | "glass" | "tile" | "sheet" | "solar";

export const PATTERN: Partial<Record<Finish, Pattern>> = {
  concrete: "grain",
  concreteDark: "grain",
  asphalt: "grain",
  asphaltLight: "grain",
  earth: "grain",
  earthDark: "grain",
  gravel: "grain",
  gravelDark: "grain",
  sand: "grain",
  paving: "grain",
  plaster: "grain",
  leaf: "grain",
  glass: "glass",
  glassDark: "glass",
  tile: "tile",
  sheet: "sheet",
  solar: "solar",
};

/** A small deterministic generator, so every visit paints the same grain. */
function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PAINTERS: Record<Pattern, (g: CanvasRenderingContext2D, s: number) => void> = {
  grain(g, s) {
    const r = random(7);
    g.fillStyle = "#f2f2f2";
    g.fillRect(0, 0, s, s);
    for (let i = 0; i < 26; i++) {
      g.fillStyle = `rgba(150,150,150,${0.04 + r() * 0.05})`;
      g.beginPath();
      g.arc(r() * s, r() * s, 10 + r() * 30, 0, Math.PI * 2);
      g.fill();
    }
    for (let i = 0; i < 4200; i++) {
      const v = 175 + Math.floor(r() * 80);
      g.fillStyle = `rgba(${v},${v},${v},0.55)`;
      g.fillRect(r() * s, r() * s, 1.4, 1.4);
    }
  },
  glass(g, s) {
    const sky = g.createLinearGradient(0, 0, s, s);
    sky.addColorStop(0, "#ffffff");
    sky.addColorStop(0.55, "#e4ebf2");
    sky.addColorStop(1, "#f7f9fb");
    g.fillStyle = sky;
    g.fillRect(0, 0, s, s);
    g.fillStyle = "#2b3443";
    for (const x of [0, s / 2]) g.fillRect(x, 0, 4, s);
    g.fillRect(0, s * 0.36, s, 3);
  },
  tile(g, s) {
    g.fillStyle = "#f4f1ee";
    g.fillRect(0, 0, s, s);
    const rows = 10;
    for (let i = 0; i < rows; i++) {
      const y = (i * s) / rows;
      g.fillStyle = i % 2 ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)";
      g.fillRect(0, y, s, s / rows);
      g.fillStyle = "rgba(60,30,20,0.55)";
      g.fillRect(0, y + s / rows - 2, s, 2);
      for (let x = (i % 2) * (s / 16); x < s; x += s / 8) g.fillRect(x, y, 1.5, s / rows);
    }
  },
  sheet(g, s) {
    g.fillStyle = "#f6f7f9";
    g.fillRect(0, 0, s, s);
    const ribs = 12;
    for (let i = 0; i < ribs; i++) {
      const x = (i * s) / ribs;
      g.fillStyle = "rgba(40,50,65,0.22)";
      g.fillRect(x, 0, 3, s);
      g.fillStyle = "rgba(255,255,255,0.6)";
      g.fillRect(x + 3, 0, 2, s);
    }
  },
  solar(g, s) {
    g.fillStyle = "#ffffff";
    g.fillRect(0, 0, s, s);
    const cells = 8;
    const c = s / cells;
    g.fillStyle = "#c9d3e6";
    for (let i = 0; i < cells; i++) for (let j = 0; j < cells; j++) g.fillRect(i * c + 1.5, j * c + 1.5, c - 3, c - 3);
  },
};

export function makeTextures(anisotropy: number) {
  const made = new Map<Pattern, CanvasTexture>();
  return {
    get(finish: Finish) {
      const pattern = PATTERN[finish];
      if (!pattern) return null;
      let t = made.get(pattern);
      if (!t) {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 256;
        PAINTERS[pattern](canvas.getContext("2d")!, 256);
        t = new CanvasTexture(canvas);
        t.wrapS = t.wrapT = RepeatWrapping;
        t.colorSpace = SRGBColorSpace;
        t.anisotropy = anisotropy;
        made.set(pattern, t);
      }
      return t;
    },
    dispose() {
      made.forEach((t) => t.dispose());
    },
  };
}

/** Rescales a geometry's UVs so one map repeat covers TILE metres on every face. */
export function metreUVs(g: BufferGeometry, part: Part) {
  const [a, b, c] = part.size;
  const uv = g.getAttribute("uv");
  if (part.shape === "box" && uv) {
    // BoxGeometry faces: ±x (depth × height), ±y (width × depth), ±z (width × height), 4 vertices each.
    const dims: [number, number][] = [[c, b], [c, b], [a, c], [a, c], [a, b], [a, b]];
    for (let i = 0; i < uv.count; i++) {
      const [du, dv] = dims[Math.floor(i / 4)]!;
      uv.setXY(i, (uv.getX(i) * du) / TILE, (uv.getY(i) * dv) / TILE);
    }
  } else if (part.shape === "cyl" && uv) {
    const around = 2 * Math.PI * Math.max(a, c);
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) * around) / TILE, (uv.getY(i) * b) / TILE);
  } else {
    const pos = g.getAttribute("position");
    const out = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      out[i * 2] = (pos.getX(i) + pos.getZ(i)) / TILE;
      out[i * 2 + 1] = pos.getY(i) / TILE;
    }
    g.setAttribute("uv", new BufferAttribute(out, 2));
  }
}
