import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:8000";

let socket;

export const initSocket=(accessToken)=>{
  socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials:true,
  auth: {
    accessToken
  },
});
}


export const getSocket=()=> socket;
