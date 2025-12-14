import { useState } from "react";
import VideoTile from "../components/meeting/VideoTile";
import Controls from "../components/meeting/Controls";
import ChatPanel from "../components/meeting/ChatPanel";

export default function MeetingRoom() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Top Bar */}
      <div className="h-14 flex items-center justify-between px-4 bg-gray-900 border-b border-gray-800">
        <h1 className="text-sm md:text-base font-semibold">
          Meeting in progress
        </h1>

        <button
          onClick={() => setShowChat(!showChat)}
          className="text-sm px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
        >
          💬 Chat
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video Grid */}
        <div
          className={`flex-1 grid gap-3 p-3 transition-all
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-${showChat ? "2" : "3"}
          `}
        >
          <VideoTile name="You" isMe />
          <VideoTile name="User 1" />
          <VideoTile name="User 2" />
          <VideoTile name="User 3" />
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="w-full md:w-80 border-l border-gray-800 bg-gray-900">
            <ChatPanel />
          </div>
        )}
      </div>

      {/* Controls */}
      <Controls />
    </div>
  );
}
