import express from "express";
import dotenv from "dotenv";
import './config/database';
import db from './config/database';
// import { userRouter, orderRouter, productRouter, categoryRouter } from "./routes/routes";
import { setupAssociations } from "./model/associations";
dotenv.config();
console.log("Main app starting...");
import apiRoutes from './routes/routes'
import { stripeWebhook } from "./routes/webhook";
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

setupAssociations();
// API Routes
app.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

// All API routes prefixed with /api
app.use('/api', apiRoutes);
app.get("/", (req, res) => {
  res.send("Hello from Node + TS + PostgreSQL!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

