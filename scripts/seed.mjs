// Seeds demo estimates. Run: npm run seed (or after first `npm run dev`).
import { DatabaseSync } from "node:sqlite";
import path from "path";
const db = new DatabaseSync(path.join(process.cwd(), "casetime.db"));
db.exec(`CREATE TABLE IF NOT EXISTS estimates (
  id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT DEFAULT (datetime('now')),
  case_type TEXT, state TEXT, court_level TEXT, suit_value INTEGER,
  total_cost INTEGER, queue_clear_months REAL, result_json TEXT);`);
const demo = "demo";
const rows = [
  ["family", "Delhi", "district", 300000],
  ["property", "Maharashtra", "district", 500000],
  ["money", "Karnataka", "district", 1000000],
  ["commercial", "Tamil Nadu", "district", 5000000],
];
for (const [ct, st, lvl, sv] of rows) {
  db.prepare(`INSERT INTO estimates (case_type,state,court_level,suit_value,total_cost,queue_clear_months,result_json)
    VALUES (?,?,?,?,?,?,?)`).run(ct, st, lvl, sv, 0, 0, JSON.stringify({ demo }));
}
console.log("seeded", rows.length, "demo estimates");
