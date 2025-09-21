import express from "express";
import dotenv from "dotenv";
import './config/database';
import db from './config/database';
import { setupAssociations } from "./model/associations";
import apiRoutes from './routes/routes'
import WebSocketService from "./utils/webSocket/webSocket";
import http from "http";


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

setupAssociations();

// All API routes prefixed with /api
app.use('/api', apiRoutes);
app.get("/", (req, res) => {
  res.send("Hello from Node + TS + PostgreSQL!");
});

// Create HTTP server
const server = http.createServer(app);
// Init WebSocket service (singleton)
const wsService = WebSocketService.init(server);

// Example: send broadcast from REST API
app.get("/notify", (req, res) => {
  wsService.broadcast("📢 New notification from API");
  res.json({ message: "Notification sent" });
});
//Server is running on port 3005
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

