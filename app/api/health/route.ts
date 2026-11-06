export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    service: "CaseTime",
    bharatcode: Boolean(process.env.BHARATCODE_API_KEY),
    eci: Boolean(process.env.ECI_KEY),
    mode: process.env.ECI_KEY ? "per-case available" : "aggregate-statistics",
  });
}
