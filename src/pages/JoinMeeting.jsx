import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { joinMeeting } from "../store/slices/meetingSlice";
import { toast } from "sonner";

export default function JoinMeeting() {
  const [meetingId, setMeetingId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleJoinMeeting = async () => {
    if (!meetingId.trim()) return;

    try {
      setLoading(true);

      // ✅ CORRECT WAY
      await dispatch(joinMeeting(meetingId.trim())).unwrap();

      navigate(`/meeting/${meetingId.trim()}`);
    } catch (err) {
      toast.error(
        err?.message || "Unable to join meeting"
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Join a <span className="text-green-500">Meeting</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Enter the meeting ID shared with you
          </p>
        </div>

        <div className="space-y-4">
          <Input
            placeholder="Meeting ID"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
          />

          <Button
            disabled={loading}
            className="w-full py-2.5 text-base font-semibold rounded-xl bg-green-600 hover:bg-green-700"
            onClick={handleJoinMeeting}
          >
            {loading ? "Joining..." : "🔗 Join Meeting"}
          </Button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Make sure your camera and microphone are ready
        </p>
      </div>
    </div>
  );
}
