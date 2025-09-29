import { io } from "socket.io-client";

// Connect to your backend Socket.IO server
const socket = io("http://localhost:3005"); 

socket.on("connect", () => {
  console.log("✅ Connected to server:", socket.id);

  // Send a test event to the server
  socket.emit("sendData", { message: "Hello from test client" });

  // Send a broadcast example
  socket.emit("broadcastData", { message: "Broadcast from test client" });
});

// Listen for server responses
socket.on("receiveData", (data) => {
  console.log("📩 Server response:", data);
});

socket.on("broadcastData", (data) => {
  console.log("🌐 Broadcast received:", data);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});
