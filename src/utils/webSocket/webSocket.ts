import http from "http";
import { WebSocketServer,WebSocket } from "ws";

class WebSocketService {
  private static instance: WebSocketService;
  private wss: WebSocketServer;

  private constructor(server: http.Server) {
    this.wss = new WebSocketServer({ server });

    this.wss.on("connection", (ws: WebSocket) => {
      console.log("🔗 Client connected");

      ws.on("message", (message: string) => {
        console.log("📩 Received:", message);
        // Broadcast to all connected clients
        this.broadcast(`Echo: ${message}`);
      });

      ws.on("close", () => {
        console.log("❌ Client disconnected");
      });

      ws.send("👋 Welcome to WebSocket server!");
    });
  }

  // Singleton (only one WebSocket server instance)
  public static init(server: http.Server) {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService(server);
    }
    return WebSocketService.instance;
  }

  // Send a message to all clients
  public broadcast(message: string) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Send a message to a specific client
  public sendToClient(ws: WebSocket, message: string) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  }
}

export default WebSocketService;
