import http from "http";
import { WebSocketServer, WebSocket } from "ws";

class WebSocketService {
  private static instance: WebSocketService;
  private wss: WebSocketServer;

  // Map of topic -> Set of subscribers
  private topicSubscribers: Map<string, Set<WebSocket>> = new Map();

  private constructor(server: http.Server) {
    this.wss = new WebSocketServer({ server });

    this.wss.on("connection", (ws: WebSocket) => {
      console.log("🔗 Client connected");

      ws.on("message", (rawMessage: string) => {
        try {
          const data = JSON.parse(rawMessage.toString());

          switch (data.action) {
            case "subscribe":
              this.subscribe(ws, data.topic);
              break;

            case "publish":
              this.publish(data.topic, data.message);
              break;

            default:
              ws.send(JSON.stringify({ error: "Unknown action" }));
          }
        } catch (err) {
          console.error("❌ Invalid message format:", rawMessage);
          ws.send(JSON.stringify({ error: "Invalid message format. Must be JSON." }));
        }
      });

      ws.on("close", () => {
        console.log("❌ Client disconnected");
        this.unsubscribeAll(ws);
      });

      ws.send(JSON.stringify({ message: "👋 Welcome to WebSocket Pub/Sub server!" }));
    });
  }

  // Singleton init
  public static init(server: http.Server) {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService(server);
    }
    return WebSocketService.instance;
  }

  // ========== Pub/Sub Methods ==========

  private subscribe(ws: WebSocket, topic: string) {
    if (!this.topicSubscribers.has(topic)) {
      this.topicSubscribers.set(topic, new Set());
    }
    this.topicSubscribers.get(topic)?.add(ws);
    ws.send(JSON.stringify({ message: `✅ Subscribed to ${topic}` }));
  }

  private unsubscribeAll(ws: WebSocket) {
    this.topicSubscribers.forEach((subscribers) => subscribers.delete(ws));
  }

  public publish(topic: string, message: string) {
    const subscribers = this.topicSubscribers.get(topic);
    if (subscribers) {
      subscribers.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ topic, message }));
        }
      });
    }
  }

  // ========== Utility Methods ==========

  // Send to all clients (ignores topics)
  public broadcast(message: string) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ message }));
      }
    });
  }

  // Send to a specific client
  public sendToClient(ws: WebSocket, message: string) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ message }));
    }
  }
}

export default WebSocketService;
