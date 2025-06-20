import { io } from "socket.io-client";

const socket = io("http://localhost:5004", {
  withCredentials: true,
});

export default socket;