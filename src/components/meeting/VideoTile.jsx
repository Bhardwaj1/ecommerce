export default function VideoTile({ name, isMe, isMuted, onMute, onUnmute }) {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-[#111827] to-[#020617] border border-white/10 shadow-xl overflow-hidden group">
      {/* Avatar / Fake Video */}
      <div className="flex items-center justify-center h-full">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-bold">
          {initials}
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-black/40 backdrop-blur flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">
            {name} {isMe && "(You)"}
          </p>
          <p className="text-xs text-gray-300">
            {isMuted ? "Muted" : "Speaking"}
          </p>
        </div>

        {/* Host Controls */}
        {!isMe && (
          <button
            onClick={isMuted ? onUnmute : onMute}
            className={`text-xs px-3 py-1 rounded-full font-medium transition
              ${
                isMuted
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
          >
            {isMuted ? "Unmute" : "Mute"}
          </button>
        )}
      </div>

      {/* Speaking Highlight */}
      {!isMuted && (
        <div className="absolute inset-0 border-2 border-cyan-400/40 rounded-2xl animate-pulse pointer-events-none"></div>
      )}
    </div>
  );
}
