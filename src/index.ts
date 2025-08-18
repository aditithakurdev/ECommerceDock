import express from "express";
import dotenv from "dotenv";
import './config/database';
import db from './config/database';
import route from "./routes/user";
import orderRouter from "./routes/order";

dotenv.config();
console.log("Main app starting...");

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3005;

// Test DB connection
(async () => {
  try {
    await db.authenticate();
    console.log("Database connected successfully!");
    await db.sync({ alter: true }); 
    console.log("Database synced successfully!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

// API Routes
app.use("/api/users", route);
app.use("api/order",orderRouter)

app.get("/", (req, res) => {
  res.send("Hello from Node + TS + PostgreSQL!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
