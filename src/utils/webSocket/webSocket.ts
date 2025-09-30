import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import Notification from "../../model/notification";

interface PubSubMessage {
  action: string;
  topic?: string;
  message?: any;
}

class WebSocketService {
  private static instance: WebSocketService;
  private wss: WebSocketServer;
  private topicSubscribers: Map<string, Set<WebSocket>> = new Map();

  // constructor is private → only init() can call it
  private constructor(server: http.Server) {
    this.wss = new WebSocketServer({ server });

    this.wss.on("connection", (ws: WebSocket) => {
      console.log("🔗 Client connected");

      ws.on("message", (rawMessage: string) => {
        try {
          const data: PubSubMessage = JSON.parse(rawMessage.toString());

          switch (data.action) {
            case "subscribe":
              if (data.topic) this.subscribe(ws, data.topic);
              break;

            case "unsubscribe":
              if (data.topic) this.unsubscribe(ws, data.topic);
              break;

            case "publish":
              if (data.topic && data.message) this.publish(data.topic, data.message);
              break;

            default:
              ws.send(JSON.stringify({ type: "error", error: "Unknown action" }));
          }
        } catch (err) {
          console.error("❌ Invalid message format:", rawMessage);
          ws.send(JSON.stringify({ type: "error", error: "Invalid JSON format" }));
        }
      });

      ws.on("close", () => {
        console.log("❌ Client disconnected");
        this.unsubscribeAll(ws);
      });

      ws.send(
        JSON.stringify({
          type: "system",
          message: "👋 Welcome to WebSocket Pub/Sub server!",
        })
      );
    });
  }

  // Singleton init (only one instance)
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
    ws.send(JSON.stringify({ type: "system", message: `✅ Subscribed to ${topic}` }));
  }

  private unsubscribe(ws: WebSocket, topic: string) {
    if (this.topicSubscribers.has(topic)) {
      this.topicSubscribers.get(topic)?.delete(ws);
      ws.send(JSON.stringify({ type: "system", message: `🚪 Unsubscribed from ${topic}` }));
    }
  }

  private unsubscribeAll(ws: WebSocket) {
    this.topicSubscribers.forEach((subscribers) => subscribers.delete(ws));
  }

  public publish(topic: string, message: any) {
    const subscribers = this.topicSubscribers.get(topic);
    if (subscribers) {
      subscribers.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "message", topic, data: message }));
        }
      });
    }
  }

  // ========== Notification Helpers ==========
  public static async sendNotification(topic: string, notification: any) {
  if (!WebSocketService.instance) {
    throw new Error("WebSocketService not initialized!");
  }
  await Notification.create({
    userId: notification.userId,
    title: notification.title,
    body: notification.body,
    topic,
  });

  WebSocketService.instance.publish(topic, { ...notification, timestamp: Date.now() });
}

  public addClientHandlers() {
    this.wss.on("connection", (ws: any) => {
      ws.topics = new Set();

      ws.on("message", (msg: string) => {
        const { action, topic } = JSON.parse(msg);
        if (action === "subscribe") ws.topics.add(topic);
      });
    });
  }

  // ========== Utility Methods ==========
  public broadcast(message: any) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "broadcast", data: message }));
      }
    });
  }

  public sendToClient(ws: WebSocket, message: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "direct", data: message }));
    }
  }
}

export default WebSocketService;
