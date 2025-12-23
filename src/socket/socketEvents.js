import socket from "./socket";

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
    console.log("🔌 Socket connected:", socket.id);
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("❌ Socket disconnected");
  }
};

export const joinMeetingRoom = ({ meetingId, userId }) => {
  console.log("➡️ Joining meeting room:", meetingId);
  socket.emit("join-meeting", { meetingId, userId });
};

export const leaveMeetingRoom = ({ meetingId, userId }) => {
  console.log("⬅️ Leaving meeting room:", meetingId);
  socket.emit("leave-meeting", { meetingId, userId });
};

export const onUserJoined = (cb) => {
  socket.on("user-joined", cb);
};

export const onUserLeft = (cb) => {
  socket.on("user-left", cb);
};

export const offUserJoined = () => {
  socket.off("user-joined");
};

export const offUserLeft = () => {
  socket.off("user-left");
};
