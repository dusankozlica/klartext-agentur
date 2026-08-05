import type { NextConfig } from "next";

/**
 * STATISCH=1 erzeugt den GitHub-Pages-Build: statischer Export unter dem
 * Projektpfad /klartext-agentur (dusankozlica.github.io/klartext-agentur).
 * Bilder laufen dort unoptimiert — Pages hat keinen Image-Optimizer.
 * Ohne die Variable bleibt alles beim normalen Serverbuild (localhost:3100).
 */
const statisch = process.env.STATISCH === "1";

const nextConfig: NextConfig = statisch
  ? {
      output: "export",
      basePath: "/klartext-agentur",
      // index.html je Ordner — GitHub Pages löst das ohne Sonderfälle auf.
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
