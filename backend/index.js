import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load .env file
dotenv.config();

// Boilerplate to get __dirname working in ES modules
const __dirname = dirname(fileURLToPath(import.meta.url));

const app  = express();
const PORT = 3001;

// ── Database setup ────────────────────────────────────────
const db = new Database(join(__dirname, "journal.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS entries (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    raw_text   TEXT NOT NULL,
    title      TEXT NOT NULL,
    emotion    TEXT NOT NULL,
    valence    TEXT NOT NULL,
    response   TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

// ── OpenAI setup ──────────────────────────────────────────
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── Middleware ────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ────────────────────────────────────────────────

// GET /entries — fetch all saved entries
app.get("/entries", (req, res) => {
  const entries = db.prepare(
    "SELECT * FROM entries ORDER BY id DESC"
  ).all();
  res.json(entries);
});

// POST /entries — save a new entry + get AI response
app.post("/entries", async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "text is required" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are Psyk OS, a reflective AI journaling companion.
When given a journal entry, respond with a JSON object with exactly these fields:

"title"    - Short evocative title for the entry (3-6 words, sentence case).
"emotion"  - The single dominant emotion (one word e.g. Anger, Joy, Grief, Hope).
"valence"  - Exactly one of: "positive", "negative", or "neutral".
"response" - A warm 2-4 paragraph reflective response. Be empathetic, engage with what they actually said.

Return ONLY the JSON. No extra text.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    const parsed = JSON.parse(completion.choices[0].message.content);
    const { title, emotion, valence, response } = parsed;

    db.prepare(`
      INSERT INTO entries (raw_text, title, emotion, valence, response)
      VALUES (?, ?, ?, ?, ?)
    `).run(text.trim(), title, emotion, valence, response);

    const entry = db.prepare(
      "SELECT * FROM entries WHERE id = last_insert_rowid()"
    ).get();

    res.status(201).json(entry);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ── Start server ──────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
