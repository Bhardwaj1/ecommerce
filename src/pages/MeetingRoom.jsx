import { useEffect, useRef, useState } from "react";
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
  const hasJoinedRef = useRef(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (!meetingId || !user) return;

    if (hasJoinedRef.current) return;
    hasJoinedRef.current = true;

    // 🔌 Join meeting via socket
    joinMeetingRoom({
      meetingId,
      user: {
        id: user.id,
        name: user.name,
      },
    });

    const handleUserJoined = ({ user: joinedUser }) => {
      setParticipants((prev) => {
        // prevent duplicates
        if (prev.find((p) => p.id === joinedUser.id)) return prev;

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

    const handleUserLeft = ({ userId }) => {
      setParticipants((prev) => prev.filter((p) => p.id !== userId));
    };

    onUserJoined(handleUserJoined);
    onUserLeft(handleUserLeft);

    return () => {
      leaveMeetingRoom({
        meetingId,
        userId: user.id,
      });

      offUserJoined();
      offUserLeft();

      hasJoinedRef.current = false;
    };
  }, [meetingId, user, setParticipants]);

  useEffect(() => {
    if (!meetingId || !user) return;

    setParticipants((prev) => {
      const alreadyExists = prev.some((p) => p.id === user.id);
      if (alreadyExists) return prev;

      return [
        ...prev,
        {
          id: user.id,
          name: user.name,
          isMe: true,
        },
      ];
    });
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
            <VideoTile key={p._id} name={p.name} isMe={p.isMe} />
          ))}
        </div>
      </div>

      <Controls />
    </div>
  );
}
