import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import teamLeadRoutes from "./routes/teamLeadRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";

import { initSocket } from "./sockets/index.js";
import { startReminderJobs } from "./sockets/reminders.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/teamlead", teamLeadRoutes);
app.use("/api/employee", employeeRoutes);

const server = http.createServer(app);     // Create HTTP server

initSocket(server);       // Initialize WebSocket

startReminderJobs();      // Start reminder jobs (for pending tasks, missed daily reports)        

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
