import { createContext, useContext, useState } from "react";

const MeetingContext = createContext(null);

export function MeetingProvider({ children }) {
  const [participants, setParticipants] = useState([]);
  const [localStream, setLocalStream] = useState(null);

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
        setParticipants,
        localStream,
        setLocalStream,
        leaveSession,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
}

export const useMeeting = () => useContext(MeetingContext);
