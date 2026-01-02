import { createContext, useContext, useRef, useState } from "react";

const MeetingContext = createContext(null);

export function MeetingProvider({ children }) {
  const [participants, setParticipants] = useState([]);

  const localStreamRef = useRef();

  const startLocalStream = async () => {
     if (localStreamRef.current) {
    return localStreamRef.current;
  }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
 console.log("🎥 got local stream:", stream);
  console.log("🎥 video tracks:", stream.getVideoTracks())
    localStreamRef.current = stream;
    return stream;
  };

  const stopLocalStream = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => {
        t.stop();
        localStreamRef.current = null;
      });
    }
  };
  const leaveSession = () => {
    setParticipants([]);
    stopLocalStream();
  };

  return (
    <MeetingContext.Provider
      value={{
        participants,
        setParticipants,
        localStreamRef,
        startLocalStream,
        stopLocalStream,
        leaveSession,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
}

export const useMeeting = () => useContext(MeetingContext);
