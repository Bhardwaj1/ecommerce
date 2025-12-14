import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";

export default function CreateMeeting() {
  const navigate = useNavigate();

  const createMeeting = () => {
    const id = Math.random().toString(36).substring(2, 9);
    navigate(`/meeting/${id}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      {/* Card */}
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Start a New <span className="text-blue-500">Meeting</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Create an instant meeting and invite participants
          </p>
        </div>

        {/* Meeting Info */}
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Meeting Type</p>
              <p className="font-semibold">Instant Meeting</p>
            </div>
            <span className="px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
              Default
            </span>
          </div>
        </div>

        {/* Action */}
        <Button
          onClick={createMeeting}
          className="w-full py-3 text-base font-semibold rounded-xl"
        >
          🚀 Create & Join Meeting
        </Button>

        {/* Tips */}
        <p className="text-center text-sm text-gray-400 mt-6">
          You can share the meeting link after it’s created
        </p>
      </div>
    </div>
  );
}
