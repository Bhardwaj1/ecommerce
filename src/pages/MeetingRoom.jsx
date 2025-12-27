import { useEffect } from "react";
import socket from "../socket/socket";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useMeeting } from "../context/MeetingContext";

import {
  joinMeetingRoom,
  onUserJoined,
  onUserLeft,
  offMeetingListeners,
  onSocketConnected,
  onUserMuted,
  onUserUnmuted,
  hostMuteUser,
  hostUnmuteUser,
} from "../socket/socketEvents";

import { fetchMeetingDetails } from "../store/slices/meetingSlice";
import VideoTile from "../components/meeting/VideoTile";
import Controls from "../components/meeting/Controls";

let hasJoinedMeeting = false;

export default function MeetingRoom() {
  const dispatch = useDispatch();
  const { meetingId } = useSelector((state) => state.meeting);
  const { user } = useAuth();
  const { participants, setParticipants } = useMeeting();

  /* ================================
     1️⃣ LOAD PARTICIPANTS (REST)
  ================================ */
  useEffect(() => {
    if (!meetingId || !user) return;

    dispatch(fetchMeetingDetails(meetingId))
      .unwrap()
      .then((res) => {
        setParticipants(
          res.participants.map((p) => ({
            id: p.id,
            name: p.name,
            isMuted: p.isMuted,
            isMe: p.id === user.id,
          }))
        );
      });
  }, [meetingId, user, dispatch, setParticipants]);

  /* ================================
     2️⃣ SOCKET JOIN
  ================================ */
  useEffect(() => {
    if (!meetingId || !user) return;

    const joinSafely = () => {
      if (hasJoinedMeeting) return;
      hasJoinedMeeting = true;
      joinMeetingRoom({ meetingId });
    };

    socket.connected ? joinSafely() : onSocketConnected(joinSafely);

    const handleUserJoined = ({ user: joinedUser }) => {
      setParticipants((prev) =>
        prev.some((p) => p.id === joinedUser.id)
          ? prev
          : [...prev, { ...joinedUser, isMuted: false, isMe: joinedUser.id === user.id }]
      );
    };

    const handleUserLeft = ({ userId }) => {
      setParticipants((prev) => prev.filter((p) => p.id !== userId));
    };

    onUserJoined(handleUserJoined);
    onUserLeft(handleUserLeft);

    return () => offMeetingListeners();
  }, [meetingId, user, setParticipants]);

  /* ================================
     3️⃣ MUTE / UNMUTE SYNC
  ================================ */
  useEffect(() => {
    onUserMuted(({ userId }) =>
      setParticipants((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, isMuted: true } : p))
      )
    );

    onUserUnmuted(({ userId }) =>
      setParticipants((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, isMuted: false } : p))
      )
    );

    return () => {
      socket.off("user-muted");
      socket.off("user-unmuted");
    };
  }, []);

  /* ================================
     UI
  ================================ */
  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      <div className="h-14 flex items-center px-4 bg-gray-800 border-b border-gray-700">
        <h1 className="font-semibold">Meeting in progress</h1>
      </div>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
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

      <Controls />
    </div>
  );
}
