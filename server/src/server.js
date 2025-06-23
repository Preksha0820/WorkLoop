import express from 'express';
import dotenv from 'dotenv';
import http from "http";
import router from './routes/index.js'; 
import cors from 'cors';
import "./services/deleteCompletedTask.js";
import { initSocket } from './sockets/index.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
}));
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json());
app.use(router);

const server = http.createServer(app); // Create HTTP server
initSocket(server);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
