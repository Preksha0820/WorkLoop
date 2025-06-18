import { io } from "socket.io-client";

const socket = io("http://localhost:0804", {
  withCredentials: true,
});

export default socket;