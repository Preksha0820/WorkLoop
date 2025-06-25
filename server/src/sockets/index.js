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
   // console.log("New client connected:", socket.id);

    socket.on("joinRoom", ({ role, userId }) => {
      // Convert TEAM_LEAD to teamLead for room naming
      const roomName = role === 'TEAM_LEAD' ? 'teamLead' : role.toLowerCase();
      const room = `${roomName}_${userId}`;
      socket.join(room);
   //   console.log(`${role} ${userId} joined room ${room}`);
    });

    socket.on("send-message", async ({ senderId, receiverId, content }) => {
      try {
        //console.log("Sending message:", { senderId, receiverId, content });
        const message = await prisma.chatMessage.create({
          data: { senderId, receiverId, content },
        });
    
       // console.log("Message saved to database:", message);
        
        // Emit to receiver (whether teamLead or employee)
        io.to(`employee_${receiverId}`).emit("receive-message", message);
        io.to(`teamLead_${receiverId}`).emit("receive-message", message);
        
       // console.log(`Emitted to rooms: employee_${receiverId}, teamLead_${receiverId}`);
        
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });
    
    socket.on("disconnect", () => {
     // console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
