import OpenAI from "openai";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});
console.log("DB URL:", process.env.POSTGRES_URL?.substring(0, 50));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  // Required for Vercel CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { message } = req.body;

    const systemPrompt = `
        You are an intelligent ERP AI Copilot.

        DATABASE STRUCTURE:
        - rb_users(userid, firstname, lastname, city)
        - purchase(id, name, amount, status)

        INSTRUCTIONS:
        1. If the user asks for data from the database → generate ONLY a valid PostgreSQL SELECT query ending with semicolon. No explanation.
        2. If the user asks to draft an email → return it formatted with Subject, Dear, body, regards.
        3. For general questions → answer normally.
        4. Never generate SQL for non-database questions.

        Return only the answer.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
    });

    let aiReply = response.choices[0].message.content;
    const sqlMatch = aiReply.match(/select[\s\S]*?;/i);
    let executedSQL = null;

    if (sqlMatch) {
      executedSQL = sqlMatch[0];
      try {
        const dbResult = await pool.query(executedSQL);
        aiReply = dbResult.rows.map(row => 
        {
          const keys = Object.keys(row);
          const display = keys.map(k => `${k}: ${row[k]}`).join(" | ");
          return { Name: { FullName: display } };
        });
      } catch (dbErr) {
        aiReply = `SQL Error: ${dbErr.message}`;
      }
    }

    res.json({ sql: executedSQL, reply: aiReply });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed" });
  }
}