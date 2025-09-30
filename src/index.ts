import express from "express";
import dotenv from "dotenv";
import './config/database';
import db from './config/database';
import { setupAssociations } from "./model/associations";
import apiRoutes from './routes/routes'
import WebSocketService from "./utils/webSocket/webSocket";
import http from "http";
import { Server } from 'socket.io';

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
  // res.send("Hello from Node + TS + PostgreSQL!");
    res.send("HTTP + WebSocket Server Running...");

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


// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // allow frontend domain or "*" for testing
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection event
io.on('connection', (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);

  // Listen for messages from the client
  socket.on('message', (data) => {
    console.log(`📩 Message from client: ${data}`);
    // Reply to the same client
    socket.emit('message', `Server received: ${data}`);
  });

  // Broadcast example
  socket.on('broadcastData', (data) => {
    socket.broadcast.emit('broadcastData', data);
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

//Server is running on port 3005
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

