import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
//import { poolPromise } from "./db.js";
import pool from "./db.js";

dotenv.config(); // must be on top

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ------------------ Test route ------------------
app.get("/", (req, res) => res.send("AI Backend Running 🚀"));

// ------------------ AI Chat route ------------------
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // SYSTEM PROMPT: AI generates only valid SQL Server SELECT statements
   const systemPrompt = `
You are an intelligent ERP AI Copilot.

You can perform the following tasks depending on the user request:

DATABASE STRUCTURE:
- rb_users(userid, firstname, lastname, city)
- purchase(id, name, amount, status)

INSTRUCTIONS:

1. If the user asks for data that exists in the database:
   - Generate ONLY a PostgreSQL SELECT query.
   - Use correct table and column names.
   - End the query with a semicolon.
   - Do NOT add explanation.

2. If the user asks to draft an email:
Return the email exactly in this format:

Subject: <Subject Line>

Dear <Recipient Name>,

<Email body>

Thank you.

Best regards,
<Sender Name>

3. If the user asks general questions 
(example: capital of India, technology, programming, business, jobs, etc):
Return a normal helpful answer.

4. If the question is NOT related to the database:
Do NOT generate SQL.
Just answer normally.

5. If the question is related to users or purchases:
Generate SQL query.

Always decide automatically what the user needs.

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

    // Extract only SELECT statements
    const sqlMatch = aiReply.match(/select[\s\S]*;/i);
    let executedSQL = null;

    if (sqlMatch) {
      executedSQL = sqlMatch[0]; // save AI-generated SQL

      try {
        const pool = await poolPromise;
        const dbResult = await pool.request().query(executedSQL);

        // Map SQL result into readable JSON
        aiReply = dbResult.recordset.map(user => ({
          Name: {
            FirstName: user.FirstName,
            LastName: user.LastName,
            FullName: `${user.FirstName} ${user.LastName}`
          }
        }));

      } catch (dbErr) {
        aiReply = { error: "SQL Execution Failed", details: dbErr.message };
      }
    }

    // Send BOTH the executed SQL and mapped result
    res.json({ sql: executedSQL, reply: aiReply });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "AI failed" });
  }
});

// ------------------ Get all purchases ------------------
app.post
("/purchases", async (req, res) => {
  try {
    // const pool = await poolPromise;
    // const result = await pool.request().query("SELECT * FROM rb_Users");
    const dbResult = await pool.query("SELECT * FROM rb_Users");
    res.json(dbResult.rows);
  } catch (err) {
    console.error("DB Query Error:", err);
    res.status(500).send("DB Query Failed");
  }
});

// ------------------ Start server ------------------
app.listen(5000, () => console.log("Server running on http://localhost:5000"));