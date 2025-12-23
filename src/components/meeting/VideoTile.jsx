import { useEffect, useRef } from "react";

export default function VideoTile({ name, stream, isMe }) {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted={isMe}
        playsInline
        className="w-full h-full object-cover"
      />
      <span className="absolute bottom-2 left-2 text-sm bg-gray-900 px-2 py-1 rounded">
        {isMe ? "You" : name}
      </span>
    </div>
  );
}
