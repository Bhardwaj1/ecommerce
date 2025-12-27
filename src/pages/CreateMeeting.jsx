import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createMeeting, joinMeeting } from "../store/slices/meetingSlice";
// import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import { Notify } from "../utils/notify";

export default function CreateMeeting() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { user } = useAuth();
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
      dispatch(joinMeeting( meetingId ));
    }
  }, [meetingId, dispatch]);

  // Step 2: Navigate AFTER backend confirms join
  useEffect(() => {
    if (currentMeeting?.meetingId && meetingId && !hasJoinedRef.current) {
      hasJoinedRef.current = true; // 🔒 guard
      Notify("Meeting joined successfully", "success");
      navigate(`/meeting/${meetingId}`);
    }
  }, [currentMeeting, meetingId, navigate]);

  return (
    <Button
      onClick={handleCreateMeeting}
      loading={loading}
      className="w-full py-3"
    >
      🚀 Create & Join Meeting
    </Button>
  );
}
