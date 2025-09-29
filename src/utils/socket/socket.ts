import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";

class SocketService {
  private static instance: SocketService;
  private io: Server;

  private constructor(server: HTTPServer) {
    this.io = new Server(server, {
      cors: {
        origin: "*", // change to frontend URL in production
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket: Socket) => {
      console.log("🔗 Client connected:", socket.id);

      // Listen for custom events
      socket.on("chat", (data) => {
        console.log("💬 Chat message:", data);
        // Broadcast to everyone (except sender)
        socket.broadcast.emit("chat", data);
      });

      socket.on("notify", (msg) => {
        console.log("🔔 Notification:", msg);
        // Send to ALL clients
        this.io.emit("notify", msg);
      });

      socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
      });
    });
  }

  public static init(server: HTTPServer) {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService(server);
    }
    return SocketService.instance;
  }

  public emit(event: string, payload: any) {
    this.io.emit(event, payload);
  }
}

export default SocketService;
