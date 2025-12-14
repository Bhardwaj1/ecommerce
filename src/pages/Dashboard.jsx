import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Welcome back 👋
        </h1>
        <p className="text-gray-400 mt-1">
          Start or join a meeting in just one click
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create Meeting */}
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/20 backdrop-blur rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition">
          <h2 className="text-xl font-semibold mb-2">🎥 New Meeting</h2>
          <p className="text-gray-300 mb-6">
            Start an instant meeting and invite others
          </p>
          <Button className="w-full" onClick={() => navigate("/create")}>
            Create Meeting
          </Button>
        </div>

        {/* Join Meeting */}
        <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/20 backdrop-blur rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition">
          <h2 className="text-xl font-semibold mb-2">🔗 Join Meeting</h2>
          <p className="text-gray-300 mb-6">
            Join a meeting using a meeting ID
          </p>
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={() => navigate("/join")}
          >
            Join Meeting
          </Button>
        </div>

        {/* History (Future-ready) */}
        <div className="bg-gray-800/70 border border-gray-700 backdrop-blur rounded-2xl p-6 shadow-lg opacity-80">
          <h2 className="text-xl font-semibold mb-2">📁 Meeting History</h2>
          <p className="text-gray-400 mb-6">
            View your past meetings (coming soon)
          </p>
          <Button className="w-full cursor-not-allowed opacity-60" disabled>
            View History
          </Button>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-10 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-2">💡 Quick Tips</h3>
        <ul className="text-gray-400 text-sm space-y-1">
          <li>• Allow camera & microphone permissions</li>
          <li>• Use headphones for better audio quality</li>
          <li>• Share the meeting link to invite others</li>
        </ul>
      </div>
    </div>
  );
}
