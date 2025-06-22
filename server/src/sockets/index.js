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
  console.log("New client connected:", socket.id);

  // Client joins their room
  socket.on("joinRoom", ({ role, userId }) => {
    if (role === "EMPLOYEE") {
      socket.join(`employee_${userId}`);
      console.log(`Employee ${userId} joined room employee_${userId}`);
    } else if (role === "TEAM_LEAD") {
      socket.join(`teamLead_${userId}`);
      console.log(`Team lead ${userId} joined room teamLead_${userId}`);
    }
  });

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
