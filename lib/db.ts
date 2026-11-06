import { DatabaseSync } from "node:sqlite";
import path from "path";

let db: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (db) return db;
  // Vercel serverless has a read-only filesystem except /tmp.
  const file = process.env.VERCEL
    ? "/tmp/casetime.db"
    : path.join(process.cwd(), "casetime.db");
  db = new DatabaseSync(file);
  db.exec(`
    CREATE TABLE IF NOT EXISTS estimates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT DEFAULT (datetime('now')),
      case_type TEXT, state TEXT, court_level TEXT,
      suit_value INTEGER, total_cost INTEGER,
      queue_clear_months REAL, result_json TEXT
    );
    CREATE TABLE IF NOT EXISTS njdg_cache (
      id INTEGER PRIMARY KEY,
      fetched_at TEXT, payload TEXT
    );
  `);
  return db;
}

export function saveEstimate(row: {
  case_type: string; state: string; court_level: string;
  suit_value: number; total_cost: number; queue_clear_months: number; result_json: string;
}) {
  const d = getDb();
  d.prepare(
    `INSERT INTO estimates (case_type, state, court_level, suit_value, total_cost, queue_clear_months, result_json)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(row.case_type, row.state, row.court_level, row.suit_value, row.total_cost, row.queue_clear_months, row.result_json);
}

export function recentEstimates(limit = 10): unknown[] {
  const d = getDb();
  return d
    .prepare(`SELECT id, created_at, case_type, state, court_level, suit_value, total_cost, queue_clear_months
              FROM estimates ORDER BY id DESC LIMIT ?`)
    .all(limit) as unknown[];
}

export function cacheNjdg(fetchedAt: string, payload: unknown) {
  const d = getDb();
  d.prepare(`INSERT OR REPLACE INTO njdg_cache (id, fetched_at, payload) VALUES (1, ?, ?)`)
    .run(fetchedAt, JSON.stringify(payload));
}

export function readNjdgCache(): { fetchedAt: string; payload: unknown } | null {
  const d = getDb();
  const r = d.prepare(`SELECT fetched_at, payload FROM njdg_cache WHERE id=1`).get() as
    | { fetched_at: string; payload: string }
    | undefined;
  if (!r) return null;
  return { fetchedAt: r.fetched_at, payload: JSON.parse(r.payload) };
}
