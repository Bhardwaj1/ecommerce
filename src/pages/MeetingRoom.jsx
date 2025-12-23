import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useMeeting } from "../context/MeetingContext";
import {
  joinMeetingRoom,
  leaveMeetingRoom,
  onUserJoined,
  onUserLeft,
  offUserJoined,
  offUserLeft,
} from "../socket/socketEvents";
import VideoTile from "../components/meeting/VideoTile";
import Controls from "../components/meeting/Controls";

export default function MeetingRoom() {
  const { meetingId } = useSelector((state) => state.meeting);
  const { user } = useAuth();
  const { participants, setParticipants } = useMeeting();
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (!meetingId || !user) return;

    console.log("🟢 Joining socket meeting:", meetingId);

    joinMeetingRoom({
      meetingId,
      userId: user.id,
    });

    const handleUserJoined = ({ userId }) => {
      console.log("👤 User joined:", userId);
      setParticipants((prev) => {
        if (prev.find((p) => p.id === userId)) return prev;
        return [...prev, { id: userId }];
      });
    };

    const handleUserLeft = ({ userId }) => {
      console.log("🚪 User left:", userId);
      setParticipants((prev) =>
        prev.filter((p) => p.id !== userId)
      );
    };

    onUserJoined(handleUserJoined);
    onUserLeft(handleUserLeft);

    return () => {
      console.log("🔴 Leaving socket meeting:", meetingId);

      leaveMeetingRoom({
        meetingId,
        userId: user.id,
      });

      offUserJoined();
      offUserLeft();
    };
  }, [meetingId, user, setParticipants]);

  return (
    <div className="h-screen bg-black flex flex-col">
      <div className="h-14 flex items-center justify-between px-4 bg-gray-900">
        <h1 className="font-semibold">Meeting in progress</h1>
        <button onClick={() => setShowChat(!showChat)}>💬 Chat</button>
      </div>

      <div className="flex flex-1">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 p-3 flex-1">
          {participants.map((p) => (
            <VideoTile key={p.id} name={p.id} />
          ))}
        </div>
      </div>

      <Controls />
    </div>
  );
}
