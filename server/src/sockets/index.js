import { Server } from "socket.io";
let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  io.on("connection", (socket) => {
    //console.log("New client connected:", socket.id);

    // You can add more socket event listeners here if needed
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
