import snapshot from "../data/osmCourts.json";

export interface OsmPlace {
  id: string;
  name: string;
  lat: number;
  lon: number;
  city: string;
  state: string;
  osmType: string;
  tags: { amenity: string | null; operator: string | null; "addr:street": string | null };
}

interface Snapshot {
  fetchedAt: string;
  licence: string;
  source: string;
  note: string;
  cities: { city: string; state: string; lat: number; lon: number }[];
  places: OsmPlace[];
}

const SNAP = snapshot as unknown as Snapshot;

export function osmLink(p: OsmPlace): string {
  return `https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lon}#map=17/${p.lat}/${p.lon}`;
}

export function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function placesForState(
  state: string,
  limit = 4
): { city: string | null; places: (OsmPlace & { distanceKm: number })[]; fetchedAt: string; note: string; licence: string } {
  const city = SNAP.cities.find((c) => c.state.toLowerCase() === state.toLowerCase()) ?? null;
  if (!city) {
    return {
      city: null,
      places: [],
      fetchedAt: SNAP.fetchedAt,
      note: `No cached OpenStreetMap locations for ${state === "Other" ? "this State" : state}. The DLSA link below is the free-help route.`,
      licence: SNAP.licence,
    };
  }
  const places = SNAP.places
    .filter((p) => p.city === city.city)
    .map((p) => ({ ...p, distanceKm: haversineKm(city, p) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
  return {
    city: city.city,
    places,
    fetchedAt: SNAP.fetchedAt,
    note: SNAP.note,
    licence: SNAP.licence,
  };
}

export const OSM_SNAPSHOT_DATE = SNAP.fetchedAt;
