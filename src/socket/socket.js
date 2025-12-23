import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:8000";

const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export default socket;
