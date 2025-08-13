// src/index.ts
import express from "express";
import dotenv from "dotenv";
import './config/database';
console.log("Main app starting...");

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello from Node + TS + PostgreSQL!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
