import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket/socket";
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

export default function MeetingRoom() {
  const { id: meetingId } = useParams(); // Get meetingId from URL
  const { user } = useAuth(); // { id, name, email }
  const { participants, setParticipants } = useMeeting();

  const hasJoinedRef = useRef(false);

  /* ================================
     0️⃣ SOCKET CONNECT / DISCONNECT
  ================================ */
  useEffect(() => {
    connectSocket();
    
    // Add connection event listeners for debugging
    socket.on("connect", () => {
      console.log("✅ Socket connected successfully:", socket.id);
    });
    
    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
    
    socket.on("connect_error", (error) => {
      console.log("🚫 Socket connection error:", error);
    });
    
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      disconnectSocket();
    };
  }, []);

  /* ================================
     1️⃣ JOIN MEETING (ONLY ONCE)
  ================================ */
  useEffect(() => {
    console.log("🔍 Debug values:", { meetingId, user, hasJoined: hasJoinedRef.current });
    
    if (!meetingId) {
      console.log("⚠️ No meetingId available");
      return;
    }
    
    if (!user) {
      console.log("⚠️ No user available");
      return;
    }
    
    if (hasJoinedRef.current) {
      console.log("⚠️ Already joined, skipping");
      return;
    }

    console.log("🔗 Attempting to join meeting:", { meetingId, user });
    console.log("🔍 Socket connected:", socket.connected);
    console.log("🔍 Socket ID:", socket.id);
    
    hasJoinedRef.current = true;
    
    // Add current user to participants immediately
    setParticipants([{
      id: user.id,
      name: user.name,
      isMuted: false,
      isMe: true,
    }]);
    
    // Wait for socket to be connected before emitting
    const emitJoinEvent = () => {
      if (socket.connected) {
        console.log("📤 Emitting join-meeting event:", { meetingId });
        socket.emit("join-meeting", { meetingId });
      } else {
        console.log("⚠️ Socket not connected, waiting...");
        setTimeout(emitJoinEvent, 500);
      }
    };
    
    emitJoinEvent();
    console.log("🔗 joined meeting:", meetingId);
  }, [meetingId, user, setParticipants]);

  /* ================================
     2️⃣ AUTHORITATIVE SNAPSHOT
     (MOST IMPORTANT FIX)
  ================================ */
  useEffect(() => {
    if (!user) return;

    const handleMeetingState = (snapshot) => {
      console.log("📸 meeting-state:", snapshot);

      // Merge server state with existing participants to avoid overwriting
      setParticipants((prevParticipants) => {
        const serverParticipants = snapshot.participants.map((p) => ({
          id: p._id || p.id, // Backend uses _id, frontend uses id
          name: p.name,
          isMuted: p.isMuted,
          isMe: (p._id || p.id) === user.id, // Handle both _id and id
        }));

        console.log("📊 Server participants mapped:", serverParticipants);
        return serverParticipants; // Use server state as authoritative
      });
    };

    socket.on("meeting-state", handleMeetingState);

    return () => {
      socket.off("meeting-state", handleMeetingState);
    };
  }, [user, setParticipants]);

  /* ================================
     3️⃣ REALTIME JOIN / LEAVE
  ================================ */
  useEffect(() => {
    if (!user) return;

    const handleUserJoined = ({ user: joinedUser }) => {
      console.log("➕ user joined:", joinedUser);
      console.log("🔍 Current user ID:", user.id);
      console.log("🔍 Joined user ID:", joinedUser.id);

      setParticipants((prev) => {
        console.log("📊 Previous participants:", prev);
        const joinedUserId = joinedUser._id || joinedUser.id; // Handle both _id and id
        const exists = prev.some((p) => p.id === joinedUserId);
        console.log("🔍 User already exists:", exists);
        
        if (exists) {
          console.log("⚠️ User already in participants, skipping");
          return prev;
        }
        
        const newParticipant = {
          id: joinedUserId,
          name: joinedUser.name,
          isMuted: false,
          isMe: joinedUserId === user.id,
        };
        
        console.log("✨ Adding new participant:", newParticipant);
        const updated = [...prev, newParticipant];
        console.log("📊 Updated participants:", updated);
        return updated;
      });
    };

    const handleUserLeft = ({ userId }) => {
      console.log("➖ user left:", userId);

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
     4️⃣ MUTE / UNMUTE SYNC
  ================================ */
  useEffect(() => {
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
     GUARD (VERY IMPORTANT)
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
  console.log("🎯 Current participants:", participants); // Debug log
  
  return (
    <div className="h-screen flex flex-col bg-[#020617] text-white">
      {/* TOP BAR */}
      <div className="h-14 flex items-center justify-between px-6 bg-white/5 border-b border-white/10">
        <h1 className="font-semibold">🎥 Meeting in progress</h1>
        <span className="text-xs text-gray-400">ID: {meetingId} | Users: {participants.length}</span>
      </div>

      {/* VIDEO GRID */}
      <div className="flex-1 p-6 overflow-y-auto">
        {participants.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-400 mb-2">No participants yet</p>
              <p className="text-sm text-gray-500">Waiting for users to join...</p>
            </div>
          </div>
        ) : (
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
        )}
      </div>

      {/* CONTROLS */}
      <div className="sticky bottom-0 z-40">
        <div className="mx-auto max-w-3xl px-6 pb-6">
          <div className="rounded-2xl bg-white/10 border border-white/10 shadow-xl">
            <Controls />
          </div>
        </div>
      </div>
    </div>
  );
}
