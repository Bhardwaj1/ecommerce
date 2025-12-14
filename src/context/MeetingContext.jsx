import { createContext, useContext, useState } from "react";

const MeetingContext = createContext();

export function MeetingProvider({ children }) {
  const [meetingId, setMeetingId] = useState(null);
  const [participants, setParticipants] = useState([]);

  return (
    <MeetingContext.Provider
      value={{ meetingId, setMeetingId, participants, setParticipants }}
    >
      {children}
    </MeetingContext.Provider>
  );
}

export const useMeeting = () => useContext(MeetingContext);
