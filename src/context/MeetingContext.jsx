import { createContext, useContext, useState } from "react";

const MeetingContext = createContext(null);

export function MeetingProvider({ children }) {
  const [participants, setParticipants] = useState([]);
  const [localStream, setLocalStream] = useState(null);

  const joinSession = (user) => {
    setParticipants((prev) => {
      // prevent duplicate host
      if (prev.find((p) => p.id === user.id)) return prev;
      return [user];
    });
  };

  const leaveSession = () => {
    setParticipants([]);
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
      setLocalStream(null);
    }
  };

  return (
    <MeetingContext.Provider
      value={{
        participants,
        localStream,
        setLocalStream,
        joinSession,
        leaveSession,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
}

export const useMeeting = () => useContext(MeetingContext);
