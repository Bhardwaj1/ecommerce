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
      // 🔥 SOCKET EVENT FIRST
      leaveMeetingRoom(meetingId); // <-- this triggers the "⬅️ Leaving meeting room" log

      // 1️⃣ Inform backend (REST API)
      if (meetingId) {
        await dispatch(leaveMeeting({ meetingId })).unwrap();
      }

      // 2️⃣ Cleanup local media + participants
      leaveSession();

      // 3️⃣ Notify UI
      Notify("You left the meeting", "success");

      // 4️⃣ Redirect
      navigate("/", { replace: true });
    } catch (error) {
      Notify(error || "Failed to leave meeting", "error");
    }
  };

  return (
    <div className="flex justify-center gap-4 p-4 bg-gray-800">
      <Button>Mic</Button>
      <Button>Camera</Button>

      <Button
        onClick={handleLeaveMeeting}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700"
      >
        Leave
      </Button>
    </div>
  );
}
