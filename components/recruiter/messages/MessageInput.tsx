"use client";

import { useRef, useState } from "react";
import { Paperclip, Send } from "lucide-react";

interface MessageInputProps {
  quickReplies: string[];
  onSendMessage: (message: string) => void;
  onAttach: (file: File | null) => void;
}

export default function MessageInput({
  quickReplies,
  onSendMessage,
  onAttach,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setMessage("");
  };

  return (
    <div className="sticky bottom-0 border-t border-slate/20 bg-white p-3">
      <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
        {quickReplies.map((reply) => (
          <button
            key={reply}
            type="button"
            onClick={() => setMessage(reply)}
            className="whitespace-nowrap rounded-full border border-slate/20 bg-surface px-3 py-1.5 text-xs font-semibold text-midnight transition hover:border-primary hover:text-primary"
          >
            {reply}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-slate/25 bg-white px-2 py-2">
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message..."
          className="w-full bg-transparent px-2 text-sm text-midnight placeholder:text-slate/80 focus:outline-none"
        />

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(event) => onAttach(event.target.files?.[0] ?? null)}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-lg p-2 text-slate transition hover:bg-surface hover:text-midnight"
          aria-label="Attach file"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={handleSend}
          className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
          Send
        </button>
      </div>
    </div>
  );
}

