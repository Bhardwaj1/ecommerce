import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { leaveMeeting } from "../../store/slices/meetingSlice";
import { useMeeting } from "../../context/MeetingContext";
import { Notify } from "../../utils/notify";
import { leaveMeetingRoom } from "../../socket/socketEvents";

export default function Controls() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { leaveSession } = useMeeting();
  const { meetingId, loading } = useSelector((state) => state.meeting);

  const handleLeaveMeeting = async () => {
    const confirmLeave = window.confirm(
      "Are you sure you want to leave the meeting?"
    );
    if (!confirmLeave) return;

    try {
      leaveMeetingRoom(meetingId);

      if (meetingId) {
        await dispatch(leaveMeeting({ meetingId })).unwrap();
      }

      leaveSession();
      Notify("You left the meeting", "success");
      navigate("/", { replace: true });
    } catch (error) {
      Notify(error || "Failed to leave meeting", "error");
    }
  };

  return (
    <div className="flex justify-center">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 backdrop-blur border border-white/10 shadow-lg">
        {/* Mic */}
        <button
          className="
            px-4 py-2 rounded-lg
            bg-indigo-600/90 hover:bg-indigo-600
            text-sm font-medium
            transition
          "
        >
          🎤 Mic
        </button>

        {/* Camera */}
        <button
          className="
            px-4 py-2 rounded-lg
            bg-purple-600/90 hover:bg-purple-600
            text-sm font-medium
            transition
          "
        >
          📷 Camera
        </button>

        {/* Leave */}
        <button
          onClick={handleLeaveMeeting}
          disabled={loading}
          className="
            px-4 py-2 rounded-lg
            bg-red-600 hover:bg-red-700
            text-sm font-medium
            transition
          "
        >
          Leave
        </button>
      </div>
    </div>
  );
}
