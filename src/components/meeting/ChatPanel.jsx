import { useState } from "react";
import Button from "../common/Button";

export default function ChatPanel() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, { text: message, sender: "You" }]);
    setMessage("");
  };

  return (
    <div className="w-full md:w-80 bg-gray-800 flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <span className="text-blue-400 text-sm">{msg.sender}:</span>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="p-2 flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-3 py-2 rounded bg-gray-700"
          placeholder="Type message..."
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
