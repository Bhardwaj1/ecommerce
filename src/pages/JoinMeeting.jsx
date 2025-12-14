import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function JoinMeeting() {
  const [meetingId, setMeetingId] = useState("");
  const navigate = useNavigate();

  const joinMeeting = () => {
    if (meetingId.trim()) {
      navigate(`/meeting/${meetingId}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      {/* Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Join a <span className="text-green-500">Meeting</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Enter the meeting ID shared with you
          </p>
        </div>

        {/* Input */}
        <div className="space-y-4">
          <Input
            placeholder="Meeting ID"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
          />

          <Button
            className="w-full py-2.5 text-base font-semibold rounded-xl bg-green-600 hover:bg-green-700"
            onClick={joinMeeting}
          >
            🔗 Join Meeting
          </Button>
        </div>

        {/* Footer Tip */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Make sure your camera and microphone are ready
        </p>
      </div>
    </div>
  );
}
