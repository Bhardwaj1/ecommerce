import { useEffect } from "react";
import socket from "../socket/socket";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useMeeting } from "../context/MeetingContext";
import {
  joinMeetingRoom,
  onUserJoined,
  onUserLeft,
  offMeetingListeners,
  onSocketConnected,
} from "../socket/socketEvents";
import VideoTile from "../components/meeting/VideoTile";
import Controls from "../components/meeting/Controls";

/**
 * 🔒 GLOBAL GUARD
 * React StrictMode dev-only double mount protection
 */
let hasJoinedMeeting = false;

export default function MeetingRoom() {
  const { meetingId } = useSelector((state) => state.meeting);
  const { user } = useAuth();
  const { participants, setParticipants } = useMeeting();

  useEffect(() => {
    if (!meetingId || !user) return;

    const joinMeetingSafely = () => {
      if (hasJoinedMeeting) return;

      console.log("➡️ Joining meeting room:", meetingId);
      hasJoinedMeeting = true;
      joinMeetingRoom({ meetingId });
    };

    // 🔑 Case 1: socket already connected
    if (socket.connected) {
      console.log("🟢 Socket already connected");
      joinMeetingSafely();
    }
    // 🔑 Case 2: socket will connect later
    else {
      console.log("🟡 Waiting for socket connection");
      onSocketConnected(joinMeetingSafely);
    }

    // 🔔 user joined
    const handleUserJoined = ({ user: joinedUser }) => {
      setParticipants((prev) => {
        if (prev.some((p) => p.id === joinedUser.id)) return prev;

        return [
          ...prev,
          {
            id: joinedUser.id,
            name: joinedUser.name,
            isMe: joinedUser.id === user.id,
          },
        ];
      });
    };

    // 🔕 user left
    const handleUserLeft = ({ userId }) => {
      setParticipants((prev) => prev.filter((p) => p.id !== userId));
    };

    onUserJoined(handleUserJoined);
    onUserLeft(handleUserLeft);

    // 🧹 CLEANUP (listeners only)
    return () => {
      offMeetingListeners();
    };
  }, [meetingId, user, setParticipants]);

  return (
    <div className="h-screen bg-black flex flex-col">
      <div className="h-14 flex items-center px-4 bg-gray-900">
        <h1 className="font-semibold">Meeting in progress</h1>
      </div>

      <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-3 p-3">
        {participants.map((p) => (
          <VideoTile key={p.id} name={p.name} isMe={p.isMe} />
        ))}
      </div>

      <Controls />
    </div>
  );
}
