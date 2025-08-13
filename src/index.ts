// src/index.ts
import express from "express";
import dotenv from "dotenv";
import './config/database';
import db from './config/database'
console.log("Main app starting...");

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

// Test DB connection
(async () => {
  try {
    await db.authenticate();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
app.get("/", (req, res) => {
  res.send("Hello from Node + TS + PostgreSQL!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
