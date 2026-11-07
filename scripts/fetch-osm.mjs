// Fetch courthouse locations from OpenStreetMap Overpass and vendor a dated snapshot.
//
// Overpass is capacity-limited. We try mirrors in order, wait between attempts, and
// NEVER invent a coordinate: if every mirror fails for a city, previously cached rows
// for that city are kept. The script refuses to write a file with no rows.
//
//   node scripts/fetch-osm.mjs
//
// Output: data/osmCourts.json  (read by lib/places.ts at runtime)

import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const CITIES = [
  { city: "Delhi", state: "Delhi", lat: 28.6129, lon: 77.2315, radius: 9000 },
  { city: "Mumbai", state: "Maharashtra", lat: 18.9388, lon: 72.8354, radius: 5000 },
  { city: "Bengaluru", state: "Karnataka", lat: 12.9716, lon: 77.5946, radius: 6000 },
  { city: "Chennai", state: "Tamil Nadu", lat: 13.0827, lon: 80.2707, radius: 6000 },
];

const MIRRORS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

const UA = "CaseTime/1.0 (legal-aid cost statement; cached OSM snapshot)";

function query(c) {
  return `[out:json][timeout:25];nwr["amenity"="courthouse"](around:${c.radius},${c.lat},${c.lon});out center tags 60;`;
}

async function fetchCity(c) {
  for (const url of MIRRORS) {
    try {
      const res = await fetch(`${url}?data=${encodeURIComponent(query(c))}`, {
        headers: { "User-Agent": UA, Accept: "application/json" },
        signal: AbortSignal.timeout(40000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const els = Array.isArray(json.elements) ? json.elements : [];
      const places = els
        .map((e) => {
          const lat = e.lat ?? e.center?.lat;
          const lon = e.lon ?? e.center?.lon;
          if (typeof lat !== "number" || typeof lon !== "number") return null;
          return {
            id: `${e.type}/${e.id}`,
            name: (e.tags?.name || e.tags?.["name:en"] || "Unnamed courthouse").trim(),
            lat: Number(lat.toFixed(6)),
            lon: Number(lon.toFixed(6)),
            city: c.city,
            state: c.state,
            osmType: e.type,
            tags: {
              amenity: e.tags?.amenity || null,
              operator: e.tags?.operator || null,
              "addr:street": e.tags?.["addr:street"] || null,
            },
          };
        })
        .filter(Boolean);
      console.log(`${c.city}: ${places.length} from ${url}`);
      return { places, mirror: url };
    } catch (err) {
      console.warn(`  ${c.city} ${url}: ${err.message}`);
      await new Promise((r) => setTimeout(r, 1200));
    }
  }
  throw new Error(`all mirrors failed for ${c.city}`);
}

const file = path.join(process.cwd(), "data", "osmCourts.json");
mkdirSync(path.dirname(file), { recursive: true });
const existing = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : { places: [] };

const out = [];
const usedMirrors = new Set();
for (const c of CITIES) {
  let places;
  try {
    const got = await fetchCity(c);
    places = got.places;
    usedMirrors.add(got.mirror);
  } catch (err) {
    console.warn(`  ${c.city}: ${err.message} — keeping previously cached rows for this city.`);
    places = (existing.places || []).filter((p) => p.city === c.city);
    if (!places.length) {
      console.error(`No cached rows and no live rows for ${c.city}. Continuing; will fail at the end if the snapshot is empty.`);
    }
  }
  const seen = new Set();
  for (const p of places) {
    const key = `${p.name.toLowerCase()}|${p.lat.toFixed(4)}|${p.lon.toFixed(4)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  await new Promise((r) => setTimeout(r, 1500));
}

if (!out.length) {
  console.error("Refusing to overwrite snapshot: no real coordinates available.");
  process.exit(1);
}

const payload = {
  fetchedAt: new Date().toISOString(),
  licence: "OpenStreetMap contributors, ODbL 1.0 (https://www.openstreetmap.org/copyright)",
  source: "OpenStreetMap Overpass API",
  mirrors: [...usedMirrors],
  note:
    "Cached snapshot of amenity=courthouse around four city centres. Not exhaustive: " +
    "OSM coverage varies. Coordinates are copied verbatim from OSM; no location is inferred. " +
    "Re-run scripts/fetch-osm.mjs to refresh.",
  cities: CITIES.map(({ city, state, lat, lon }) => ({ city, state, lat, lon })),
  places: out.sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name)),
};

writeFileSync(file, JSON.stringify(payload, null, 2) + "\n");
console.log(`wrote ${out.length} places to ${file}`);
