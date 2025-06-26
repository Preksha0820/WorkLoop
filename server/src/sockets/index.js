import { Server } from "socket.io";
import prisma from "../prisma.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "https://work-loop-pink.vercel.app" ,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {

    socket.on("joinRoom", ({ role, userId }) => {
      const roomName = role === 'TEAM_LEAD' ? 'teamLead' : role.toLowerCase();
      const room = `${roomName}_${userId}`;
      socket.join(room);
    });

    socket.on("send-message", async ({ senderId, receiverId, content }) => {
      try {
        const message = await prisma.chatMessage.create({
          data: { senderId, receiverId, content },
        });
    
        io.to(`employee_${receiverId}`).emit("receive-message", message);
        io.to(`teamLead_${receiverId}`).emit("receive-message", message);
        
        
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });
    
    socket.on("disconnect", () => {
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
