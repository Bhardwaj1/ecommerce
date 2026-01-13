import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getSocket } from "../socket/socket";
import { useAuth } from "../context/AuthContext";
import { useMeeting } from "../context/MeetingContext";

import {
  connectSocket,
  disconnectSocket,
  hostMuteUser,
  hostUnmuteUser,
} from "../socket/socketEvents";

import VideoTile from "../components/meeting/VideoTile";
import Controls from "../components/meeting/Controls";
import { Notify } from "../utils/notify";
import MeetingTime from "../components/meeting/MeetingTime";

export default function MeetingRoom() {
  const { id: meetingId } = useParams();
  const { user } = useAuth();
  const { participants, setParticipants } = useMeeting();

  const hasJoinedRef = useRef(false);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef(null);

  /* ================================
     0️⃣ SOCKET CONNECT / DISCONNECT
  ================================ */
  useEffect(() => {
    connectSocket();

    const socket = getSocket();
    if (!socket) return;

    const onConnect = () => {
      console.log("✅ Socket connected:", socket.id);
    };

    const onDisconnect = () => {
      console.log("❌ Socket disconnected");
    };

    const onConnectError = (err) => {
      console.log("🚫 Socket connect error:", err.message);
      Notify("Connection issue. Reconnecting…", "warning");

      setTimeout(() => {
        socket.connect();
      }, 1500);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      disconnectSocket();
    };
  }, []);

  /* ================================
     1️⃣ JOIN MEETING
  ================================ */
  useEffect(() => {
    if (!meetingId || !user) return;
    if (hasJoinedRef.current) return;

    setParticipants([
      {
        id: user.id,
        name: user.name,
        isMuted: false,
        isMe: true,
      },
    ]);

    const emitJoin = () => {
      const socket = getSocket();
      if (!socket) return;

      if (socket.connected) {
        socket.emit("join-meeting", { meetingId });
      } else {
        setTimeout(emitJoin, 300);
      }
    };

    emitJoin();
  }, [meetingId, user, setParticipants]);

  /* ================================
     2️⃣ AUTHORITATIVE SNAPSHOT
  ================================ */
  useEffect(() => {
    if (!user) return;

    const socket = getSocket();
    if (!socket) return;

    const handleMeetingState = ({ participants }) => {
      hasJoinedRef.current = true;
      retryCountRef.current = 0;

      setParticipants(
        participants.map((p) => ({
          id: p._id || p.id,
          name: p.name,
          isMuted: p.isMuted,
          isMe: (p._id || p.id) === user.id,
        }))
      );
    };

    socket.on("meeting-state", handleMeetingState);
    return () => socket.off("meeting-state", handleMeetingState);
  }, [user, setParticipants]);

  /* ================================
     3️⃣ REALTIME JOIN / LEAVE
  ================================ */
  useEffect(() => {
    if (!user) return;
    const socket = getSocket();
    if (!socket) return;

    const handleUserJoined = ({ user: joinedUser }) => {
      const joinedUserId = joinedUser._id || joinedUser.id;

      setParticipants((prev) =>
        prev.some((p) => p.id === joinedUserId)
          ? prev
          : [
              ...prev,
              {
                id: joinedUserId,
                name: joinedUser.name,
                isMuted: false,
                isMe: joinedUserId === user.id,
              },
            ]
      );
    };

    const handleUserLeft = ({ userId }) => {
      setParticipants((prev) => prev.filter((p) => p.id !== userId));
    };

    socket.on("user-joined", handleUserJoined);
    socket.on("user-left", handleUserLeft);

    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("user-left", handleUserLeft);
    };
  }, [user, setParticipants]);

  /* ================================
     4️⃣ MUTE / UNMUTE
  ================================ */
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleMuted = ({ userId }) => {
      setParticipants((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, isMuted: true } : p))
      );
    };

    const handleUnmuted = ({ userId }) => {
      setParticipants((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, isMuted: false } : p))
      );
    };

    socket.on("user-muted", handleMuted);
    socket.on("user-unmuted", handleUnmuted);

    return () => {
      socket.off("user-muted", handleMuted);
      socket.off("user-unmuted", handleUnmuted);
    };
  }, [setParticipants]);

  /* ================================
     5️⃣ MEETING ERROR
  ================================ */
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const MAX_RETRY = 3;

    const handleMeetingError = (error) => {
      if (hasJoinedRef.current) return;

      if (retryCountRef.current < MAX_RETRY) {
        retryCountRef.current += 1;
        Notify(`Retry ${retryCountRef.current}/${MAX_RETRY}`, "warning");

        retryTimerRef.current = setTimeout(() => {
          socket.emit("join-meeting", { meetingId });
        }, 1000);
      } else {
        Notify("Meeting unavailable. Redirecting…", "error");
        socket.emit("leave-meeting", { meetingId });
        setTimeout(() => (window.location.href = "/"), 1200);
      }
    };

    socket.on("meeting-error", handleMeetingError);

    return () => {
      socket.off("meeting-error", handleMeetingError);
      clearTimeout(retryTimerRef.current);
    };
  }, [meetingId]);

  /* ================================
     UI
  ================================ */
  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading meeting...
      </div>
    );
  }

  /* ================================
     UI
  ================================ */
  return (
    <div className="h-screen flex flex-col bg-[#020617] text-white">
      <div className="h-14 flex items-center justify-between px-6 bg-white/5 border-b border-white/10">
        <h1 className="font-semibold">🎥 Meeting in progress</h1>
        <span className="text-xs text-gray-400">
          ID: {meetingId} | Users: {participants.length}
        </span>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {participants.map((p) => (
            <VideoTile
              key={p.id}
              name={p.name}
              isMe={p.isMe}
              isMuted={p.isMuted}
              onMute={() => hostMuteUser(meetingId, p.id)}
              onUnmute={() => hostUnmuteUser(meetingId, p.id)}
            />
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 z-40 relative">
        {/* ⏰ TIME (LEFT SIDE) */}
        <MeetingTime />

        {/* 🎛 CONTROLS (CENTER – unchanged) */}
        <div className="mx-auto max-w-3xl px-6 pb-6">
          <div className="shadow-xl">
            <Controls />
          </div>
        </div>
      </div>
    </div>
  );
}
