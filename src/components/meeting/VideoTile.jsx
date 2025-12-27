export default function VideoTile({ name, isMe, isMuted, onMute, onUnmute }) {
  return (
    <div className="relative rounded-xl bg-gray-800 p-3 text-white">
      <p className="font-semibold">{name}</p>

      <p className="text-sm">{isMuted ? "🔇 Muted" : "🎤 Speaking"}</p>

      {!isMe && (
        <div className="absolute bottom-2 right-2">
          {isMuted ? (
            <button onClick={onUnmute}>Unmute</button>
          ) : (
            <button onClick={onMute}>Mute</button>
          )}
        </div>
      )}
    </div>
  );
}
