import { getSocket } from "./socket";

/* ---------- CONNECTION ---------- */
export const connectSocket = () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.warn("❌ Socket not connecting: accessToken missing");
    return;
  }

  const socket = getSocket();

  if (!socket) {
    console.warn("❌ Socket instance not created");
    return;
  }

  socket.auth = { accessToken };

  if (!socket.connected) {
    console.log("🔌 Socket connecting with token...");
    socket.connect();
  }
};

export const disconnectSocket = () => {
  const socket = getSocket();
  if (socket?.connected) {
    console.log("❌ Socket disconnecting...");
    socket.disconnect();
  }
};

/* ---------- SOCKET CONNECT HANDLER ---------- */
export const onSocketConnected = (cb) => {
  const socket = getSocket();
  if (!socket) return;

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);

    // 🔁 Auto rejoin meeting after refresh / reconnect
    if (socket.meetingId) {
      console.log("🔁 Rejoining meeting:", socket.meetingId);
      socket.emit("join-meeting", { meetingId: socket.meetingId });
    }

    cb?.();
  });
};

/* ---------- MEETING EVENTS ---------- */
export const joinMeetingRoom = ({ meetingId }) => {
  const socket = getSocket();
  if (!socket) return;

  console.log("➡️ Joining meeting room:", meetingId);
  socket.meetingId = meetingId;
  socket.emit("join-meeting", { meetingId });
};

export const leaveMeetingRoom = (meetingId) => {
  const socket = getSocket();
  if (!socket) return;

  console.log("⬅️ Leaving meeting room");
  socket.meetingId = null;
  socket.emit("leave-meeting", { meetingId });
};

export const onMeetingError = (cb) => {
  const socket = getSocket();
  if (!socket) return;

  socket.on("meeting-error", (error) => {
    console.log("Meeting Socket error", error);
    cb?.(error);
  });
};

/* ---------- HOST CONTROLS ---------- */
export const hostMuteUser = (meetingId, targetUserId) => {
  const socket = getSocket();
  socket?.emit("host-mute-user", { meetingId, targetUserId });
};

export const hostUnmuteUser = (meetingId, targetUserId) => {
  const socket = getSocket();
  socket?.emit("host-unmute-user", { meetingId, targetUserId });
};

/* ---------- LISTENERS ---------- */
export const onUserJoined = (cb) => {
  const socket = getSocket();
  socket?.on("user-joined", cb);
};

export const onUserLeft = (cb) => {
  const socket = getSocket();
  socket?.on("user-left", cb);
};

export const onParticipantsCount = (cb) => {
  const socket = getSocket();
  socket?.on("participants-count", cb);
};

export const onUserMuted = (cb) => {
  const socket = getSocket();
  socket?.on("user-muted", cb);
};

export const onUserUnmuted = (cb) => {
  const socket = getSocket();
  socket?.on("user-unmuted", cb);
};

export const onMeetingEnded = (cb) => {
  const socket = getSocket();
  socket?.on("meeting-ended", cb);
};

/* ---------- CLEANUP ---------- */
export const offMeetingListeners = () => {
  const socket = getSocket();
  if (!socket) return;

  socket.off("user-joined");
  socket.off("user-left");
  socket.off("participants-count");
  socket.off("user-muted");
  socket.off("user-unmuted");
  socket.off("meeting-ended");
  socket.off("meeting-error");
};
