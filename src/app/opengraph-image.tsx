import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { company } from "@/content/company";

export const alt = `${company.name} — Infrastructure & Construction`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default share card for every page, built around the company shield emblem. */
export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "src/assets/og-logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "72px 80px",
          background: "linear-gradient(135deg, #070b14 0%, #121b2e 60%, #2a3855 100%)",
          color: "#ffffff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
        <img src={logoSrc} width={320} height={320} alt="" />
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: 52, fontWeight: 700, letterSpacing: 8 }}>RAGHAV</div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 16, color: "#f2b04a" }}>BUILDCON</div>
          <div style={{ marginTop: 40, fontSize: 46, fontWeight: 700, lineHeight: 1.1 }}>Building Infrastructure. Delivering Trust.</div>
          <div style={{ marginTop: 24, fontSize: 22, color: "#c9cfdb" }}>Roads · Bridges · Culverts · Pipelines · Buildings · Nashik</div>
          <div style={{ display: "flex", marginTop: 36, height: 6, width: 160, background: "#e8962a" }} />
        </div>
      </div>
    ),
    size,
  );
}
