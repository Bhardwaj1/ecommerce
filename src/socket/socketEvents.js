import socket from "./socket";

let joinedMeetingId = null;

/* ---------- CONNECTION ---------- */
export const connectSocket = () => {
  if (!socket.connected) {
    console.log("🔌 Socket connecting...");
    socket.connect();
  }
};

export const onSocketConnected = (cb) => {
  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
    cb?.();
  });
};

export const disconnectSocket = () => {
  if (socket.connected) {
    console.log("❌ Socket disconnected");
    socket.disconnect();
  }
};

/* ---------- MEETING EVENTS ---------- */
export const joinMeetingRoom = ({ meetingId }) => {
  console.log("➡️ Joining meeting room:", meetingId);

  if (joinedMeetingId === meetingId) return; // prevent duplicate joins
  joinedMeetingId = meetingId;

  socket.emit("join-meeting", { meetingId });
};
export const hostMuteUser = (meetingId, targetUserId) => {
  socket.emit("host-mute-user", { meetingId, targetUserId });
};

export const hostUnmuteUser = (meetingId, targetUserId) => {
  socket.emit("host-unmute-user", { meetingId, targetUserId });
};

export const leaveMeetingRoom = (meetingId) => {
  console.log("⬅️ Leaving meeting room");
  joinedMeetingId = null;
  socket.emit("leave-meeting", { meetingId });
};

/* ---------- LISTENERS ---------- */
export const onUserJoined = (cb) => socket.on("user-joined", cb);
export const onUserLeft = (cb) => socket.on("user-left", cb);
export const onParticipantsCount = (cb) => socket.on("participants-count", cb);
export const onUserMuted = (cb) => socket.on("user-muted", cb);
export const onUserUnmuted = (cb) => socket.on("user-unmuted", cb);
export const onMeetingEnded = (cb) => socket.on("meeting-ended", cb);

/* ---------- CLEANUP ---------- */
export const offMeetingListeners = () => {
  socket.off("user-joined");
  socket.off("user-left");
  socket.off("participants-count");
  socket.off("user-muted");
  socket.off("user-unmuted");
  socket.off("meeting-ended");

  // Optionally disconnect:
  // if (socket.connected) socket.disconnect();
};
