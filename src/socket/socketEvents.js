import socket from "./socket";

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (!socket.connected) {
    socket.disconnect();
  }
};

export const sendHello = (payload) => {
  socket.emit("hello", payload);
};

export const listenHelloResponse = (cb) => {
  socket.on("hello-response", cb);
};
