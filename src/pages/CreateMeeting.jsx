import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createMeeting, joinMeeting } from "../store/slices/meetingSlice";
import { useAuth } from "../context/AuthContext";
import { useMeeting } from "../context/MeetingContext";
import Button from "../components/common/Button";
import { Notify } from "../utils/notify";

export default function CreateMeeting() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { joinSession } = useMeeting();
  const hasJoinedRef = useRef(false);

  const { loading, meetingId, currentMeeting } = useSelector(
    (state) => state.meeting
  );

  const handleCreateMeeting = () => {
    dispatch(createMeeting({ type: "INSTANT" }));
  };

  // Step 1: Join meeting after creation
  useEffect(() => {
    if (meetingId) {
      dispatch(joinMeeting({ meetingId }));
    }
  }, [meetingId, dispatch]);

  // Step 2: Initialize session ONCE
  useEffect(() => {
    if (currentMeeting?.meetingId && meetingId && !hasJoinedRef.current) {
      hasJoinedRef.current = true; // 🔒 lock
      joinSession(user);
      Notify("Meeting joined successfully", "success");
      navigate(`/meeting/${meetingId}`);
    }
  }, [currentMeeting, meetingId, user, joinSession, navigate]);

  return (
    <Button
      onClick={handleCreateMeeting}
      disabled={loading}
      className="w-full py-3"
    >
      {loading ? "Starting Meeting..." : "🚀 Create & Join Meeting"}
    </Button>
  );
}
