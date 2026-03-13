import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "GET") return res.status(405).end();

  try {
    const result = await pool.query("SELECT * FROM rb_users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}